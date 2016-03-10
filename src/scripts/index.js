/*!
 * interactive-expandable-cards
 *
 * @version development
 * @author Colin Gourlay <gourlay.colin@abc.net.au>
 */

var dewysiwyg = require('util-dewysiwyg');
var ns = require('util-news-selectors');
var templates = require('./templates')(require('handlebars/runtime'));

var TITLE_PREFIX_DELIMETER = ': ';
var TITLE_PREFIX_REGEX = /^([^:]*)/;
var TITLE_MINUS_PREFIX_REGEX = /:\s+(.*)/;
var IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX = /\d+x\d+-\d+x\d+/;
var THREE_TWO_IMAGE_SRC_SEGMENT = '3x2-460x307';
var SPACES = /\s/g;

function parseItemFromSection(sectionEl) {
	var $section, $heading, $img, item;

	$section = $(sectionEl);
	$heading = $section.children().first();
	$img = $heading.next();

	$heading.detach();
	$img.detach();

	if (!$img.is('img')) {
		$img = $img.find('img');
	}

	item = {
		title: $heading.text(),
		image: $img.attr('src').replace(IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX, THREE_TWO_IMAGE_SRC_SEGMENT),
		$$content: $section.children().filter(function () {
			return $(this).text() !== ' ';
		})
	};

	if (item.title.indexOf(TITLE_PREFIX_DELIMETER) > -1) {
		item.titlePrefix = item.title.match(TITLE_PREFIX_REGEX)[1];
		item.title = item.title.match(TITLE_MINUS_PREFIX_REGEX)[1];
	}

	if (item.titlePrefix) {
		item.className = item.titlePrefix.toLowerCase().replace(SPACES, '-');
	}

	return item;
}

function triggerResizeEvent() {
	setTimeout(function () {
		window[(window.dispatchEvent != null) ? 'dispatchEvent' : 'fireEvent'](new Event('resize'));
	}, 0);
}

function showContent(event) {
	var $card, $body, $root, $rowEndCard, $activeCard, $content, contentHeight,
		bodyScrollTop, cardTop, activeCardTop, isStandard, duration;

	$content = event.data.$content;
	contentHeight = $content.height();

	$card = $(this);
	cardTop = $card.offset().top;

	$root = $card.closest('.ExpandableCards');
	$rowEndCard = $('.ExpandableCards-card', $root).filter(function () {
		return $(this).offset().top === cardTop;
	}).last();
	$activeCard = $('.ExpandableCards-card.is-active', $root).first();
	activeCardTop = $activeCard.length ? $activeCard.offset().top : 0;

	$body = $('body');
	bodyScrollTop = $body.scrollTop();
	isStandard = $body.hasClass('platform-standard');
	duration = isStandard ? 250 : 0;

	// Close any active card's related content

	if ($activeCard.length) {
		$activeCard.removeClass('is-active');
		$content.slideUp(duration, function () {
			$activeCard.data('item').$$content.detach();
		});
	}

	// If this card is already active, we're done.

	if ($card.is($activeCard)) {
		return false;
	}

	// If it wasn't, make it active and show its content

	setTimeout(function () {

		if (!isStandard && cardTop > activeCardTop) {
			$body.scrollTop(bodyScrollTop - contentHeight);
		} else if (isStandard && cardTop < bodyScrollTop) {
			$body.animate({scrollTop: cardTop - 20}, duration);
		}

		$content.find('.article').append($card.data('item').$$content);

		$rowEndCard.after($content);

		$card.addClass('is-active');

		$content.slideDown(duration, triggerResizeEvent);

	}, ($activeCard.length ? duration : 0) + 100);

	return false;
}

function wrapSections($teaser) {
	var sections = [];
	var stack = [];

	function popStack() {
		if (!stack.length) {
			return;
		}

		sections.push($('<div></div>').append(stack));
		stack = [];
	}

	$teaser.children()
	.each(function () {
		var $child = $(this);

		if ($child.is('h2')) {
			popStack();
		} else if (!stack.length) {
            return;
        }

		stack.push($child);
	});

	popStack();
	$teaser.append(sections);

	return sections;
}

function init() {
	var isMobile, $$beacons, $$teasers;

	isMobile = $('body').hasClass('platform-mobile');
    $$beacons = $('[data-beacon="interactive-expandable-cards"]', $(ns('story')));
    $$teasers = $$beacons.closest(ns('embed:wysiwyg'));
    $$beacons.remove();

    $$teasers.each(function (teaserIndex) {
        var $teaser, sectionEls, items, $root, $content;

        // Fix the teaser content and normalise across platforms
        dewysiwyg.normalise(this);

        $teaser = $(this);

        // Wrap sections so they can be grouped and parsed
        sectionEls = wrapSections($teaser);

		items = sectionEls.map(parseItemFromSection);

		$content = $(templates.content({
			id: teaserIndex
		})).hide();

		$root = $(templates.root({
			id: teaserIndex,
			items: items
		}))
		.on('click', '.ExpandableCards-card', {
			$content: $content
		}, showContent);

		$root.find('.ExpandableCards-card')
		.each(function (itemIndex) {
			$(this).data('item', items[itemIndex]);
		});

        $teaser.empty().append($root);
    });

}

init();
