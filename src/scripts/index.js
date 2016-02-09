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
var EMPTY_PARAGRAPHS_REGEX = /<p>\s<\/p>/g;
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
		content: $section.html().replace(EMPTY_PARAGRAPHS_REGEX, '')
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

function showMobileContent() {
	var $row, $card, $content;

	$card = $(this);
	$row = $card.closest('.ExpandableCards');
	$content = $card.next();

	// If this card is already active, close it.

	if ($card.hasClass('is-active')) {
		$card.removeClass('is-active').removeAttr('aria-selected');
		$content.attr('aria-hidden', 'true').css('height', 0);
		return false;
	}

	// Otherwise open the card.

	$card.addClass('is-active').attr('aria-selected', 'true');
	$content.css('height','auto').removeAttr('aria-hidden').show();

	return false;
}

function showDesktopContent() {
	var $row, $card, $activeCard, $content, $activeContent;

	$card = $(this);
	$row = $card.closest('.ExpandableCards');
	$content = $row.find('[aria-labelledby="' + $card.attr('id') + '"]').last();

	// If this card is already active, close it.

	if ($card.hasClass('is-active')) {
		$card.removeClass('is-active').removeAttr('aria-selected');
		$content.attr('aria-hidden', 'true').slideUp(250);
		return false;
	}

	// Otherwise close the active card if there is one
	// (even if it's in another row) and open the card.

	$activeCard = $row.parent().find('.ExpandableCards .is-active').first();

	if ($activeCard.length) {
		$activeCard.removeClass('is-active').removeAttr('aria-selected');
		$activeContent = $activeCard.closest('.ExpandableCards').find('[aria-labelledby="' + $activeCard.attr('id') + '"]').last();
	}

	($activeContent || $content)
	.attr('aria-hidden', 'true')
	.slideUp(250, function () {
		var cardTop = $card.offset().top;

		if (cardTop < $(window).scrollTop()) {
			$('html, body').animate({scrollTop: cardTop - 20}, 250);
		}

		$card.addClass('is-active').attr('aria-selected', 'true');
		$content.slideDown(250).removeAttr('aria-hidden');
	});

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
        var $teaser, rows, sectionEls, rowsOfSectionEls;

        // Fix the teaser content and normalise across platforms
        dewysiwyg.normalise(this);

        $teaser = $(this);

        rows = [];

        // Wrap sections so they can be grouped and parsed
        sectionEls = wrapSections($teaser);

        // Group sections into rows of 4
		rowsOfSectionEls = sectionEls.reduce(function (rows, sectionEl, index) {
			var rowIndex = Math.floor(index / 4);

			if (rows.length === rowIndex) {
				rows.push([]);
			}

			rows[rowIndex].push(sectionEl);

			return rows;
		}, []);

		// Parse sections in each row, and replace original content with interactive
		rowsOfSectionEls.forEach(function (rowSectionEls, rowIndex) {
			var $expandFeatureRow;

			$expandFeatureRow = $(templates.row({
				items: rowSectionEls.map(parseItemFromSection),
				isMobile: isMobile,
				rowId: [teaserIndex, rowIndex].join('-')
			}))
			.on('click', '.ExpandableCards-card', isMobile ? showMobileContent : showDesktopContent);

			if (rowIndex < (rowsOfSectionEls.length - 1)) {
				$expandFeatureRow.addClass('is-chained');
			}

            rows.push($expandFeatureRow);
		});

        $teaser.empty().append(rows);


    });

}

init();
