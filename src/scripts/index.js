/*!
 * interactive-expandable-cards
 *
 * @version development
 * @author Colin Gourlay <gourlay.colin@abc.net.au>
 */

const dewysiwyg = require('util-dewysiwyg');
const ns = require('util-news-selectors');
const templates = {
	root: require('../templates/root.hbs'),
	story: require('../templates/story.hbs')
};

const slice = Array.prototype.slice;

const TITLE_PREFIX_DELIMETER = ': ';
const TITLE_PREFIX_REGEX = /^([^:]*)/;
const TITLE_MINUS_PREFIX_REGEX = /:\s+(.*)/;
const IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX = /\d+x\d+-\d+x\d+/;
const THREE_TWO_IMAGE_SRC_SEGMENT = '3x2-460x307';
const P2_IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX = /\d+x\d+-thumbnail/;
const P2_THREE_TWO_IMAGE_SRC_SEGMENT = '3x2-large';
const SPACES = /\s/g;
const BEACON_NAME = 'interactive-expandable-cards';
const $BODY = $('body');
const PLATFORM = {
	'-1': 'p1m',
	0: 'p2',
	1: 'p1s'
}[
	(+$BODY.is('.platform-standard')) -
	(+$BODY.is('.platform-mobile'))
];
const STORY_SELECTOR = ns('story');
const EMBED_WYSIWYG_SELECTOR = ns('embed:wysiwyg', PLATFORM);
const EMBED_FULL_CLASS_NAME = {p1s: 'full', p1m: '', p2: 'view-embed-full'}[PLATFORM];
const MOCK_TEASER_OUTER_CLASS_NAME = (
	EMBED_WYSIWYG_SELECTOR.split(' ')[0] + ' ' + EMBED_FULL_CLASS_NAME
).replace(/\./g, ' ');
const MOCK_TEASER_INNER_CLASS_NAME = (
	PLATFORM === 'p2' ? EMBED_WYSIWYG_SELECTOR.split(' ')[1] : ''
).replace(/\./g, ' ');

const parseItemFromSection = sectionEl => {
	const $section = $(sectionEl);
	const $heading = $section.children().first();

	const title = $heading.text();

	if (title.replace(' ', '').length === 0) {
		return null;
	}

	let $img = $heading.next();

	$heading.detach();
	$img.detach();

	if (!$img.is('img')) {
		$img = $img.find('img');
	}

	const src = $img.is('img') ? $img.attr('src') : '';

	const item = {
		title: title,
		image: src.replace(IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX, THREE_TWO_IMAGE_SRC_SEGMENT)
			.replace(P2_IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX, P2_THREE_TWO_IMAGE_SRC_SEGMENT),
		$$children: $section.children().filter((index, el) => {
			return $(el).text() !== ' ';
		})
	};

	if (item.title.indexOf(TITLE_PREFIX_DELIMETER) > -1) {
		item.titlePrefix = item.title.match(TITLE_PREFIX_REGEX)[1];
		item.title = item.title.match(TITLE_MINUS_PREFIX_REGEX)[1];
	}

	if (item.titlePrefix) {
		item.className = item.titlePrefix.toLowerCase().replace(SPACES, '-');

		if (item.titlePrefix.length > 12) {
			item.isTitlePrefixLong = true;
		}

	}

	return item;
};

const triggerResizeEvent = () => setTimeout(() => {
	window[(window.dispatchEvent != null) ? 'dispatchEvent' : 'fireEvent'](new Event('resize'));
}, 0);


const showStory = event => {
	const $target = $(event.target);
	const $$cards = event.data.$$cards;
	const $story = event.data.$story;
	const $card = $target.is('.ExpandableCards-card') ? $target : $target.closest('.ExpandableCards-card');
	const cardTop = $card.offset().top;
	const $activeCard = $$cards.filter('.is-active').first();
	const activeCardTop = $activeCard.length ? $activeCard.offset().top : 0;
	const $rowEndCard = $$cards.filter((index, el) => $(el).offset().top === cardTop).last();
	const windowScrollTop = $(window).scrollTop();
	const $body = $('body');
	const shouldTransition = $body.width() >= 700;
	const duration = shouldTransition ? 250 : 0;

	// Close any active card's related story
	if ($activeCard.length) {
		$activeCard.removeClass('is-active');
		$story.slideUp(duration, () => {
			$activeCard.data('item').$$children.detach();
		});
	}

	// If this card is already active, we're done.
	if ($card.is($activeCard)) {
		return false;
	}

	// If it wasn't, make it active and show its story
	const show = () => {
		if (!shouldTransition && activeCardTop > 0 && cardTop > activeCardTop) {
			$body.scrollTop($card.offset().top - (cardTop - windowScrollTop));
		} else if (shouldTransition && cardTop < windowScrollTop) {
			$body.animate({scrollTop: cardTop - 20}, duration);
		}

		$story.append($card.data('item').$$children);
		$rowEndCard.after($story);
		$card.addClass('is-active');
		$story.slideDown(duration, triggerResizeEvent);
	};

	if (shouldTransition) {
		setTimeout(show, ($activeCard.length ? duration : 0) + 100);
	} else {
		show();
	}

	return false;
};

const reorderVisibleStory = event => {
	const $root = event.data.$root;
	const $$cards = event.data.$$cards;
	const $story = event.data.$story;

	if (!$root.has($story).length) {
		return;
	}

	const $activeCard = $$cards.filter('.is-active').first();

	if (!$activeCard.length) {
		return;
	}

	const numColumns = slice.call($$cards.get()).reduce((memo, el) => {
		const left = $(el).offset().left;

		if (memo.length === 0 || memo[memo.length - 1] < left) {
			memo.push(left);
		}

		return memo;
	}, []).length;

	const activeCardIndex = $$cards.index($activeCard);
	const rowEndCardIndex = Math.min($$cards.length - 1,
		((activeCardIndex + 1) % numColumns) === 0 ?
		activeCardIndex :
		activeCardIndex - ((activeCardIndex + 1) % numColumns) + numColumns
	);

	$($$cards.get(rowEndCardIndex)).after($story);
};

const wrapSections = $teaser => {
	const sections = [];
	let stack = [];

	const popStack = () => {
		if (!stack.length) {
			return;
		}

		sections.push($('<div></div>').append(stack));
		stack = [];
	};

	$teaser.children()
	.each((index, el) => {
		var $child = $(el);

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
};

const mockTeasers = () => {
	$(`a[name^="cards"]`)
	.each((index, startNode) => {
		let nextNode = startNode;
		let isMoreContent = true;
		const betweenNodes = [];

		while(isMoreContent && (nextNode = nextNode.nextSibling) !== null) {
			if (nextNode.tagName && (nextNode.getAttribute('name') || '').indexOf('endcards') === 0) {
				isMoreContent = false;
			} else {
				betweenNodes.push(nextNode);
			}
		}

		const $outer = $(`<div class="${MOCK_TEASER_OUTER_CLASS_NAME}"></div>`);
		const $inner = MOCK_TEASER_INNER_CLASS_NAME ? $(`<div class="${MOCK_TEASER_INNER_CLASS_NAME}"></div>`) : null;

		($inner || $outer)
		.append($(`<div data-beacon="${BEACON_NAME}"></div>`))
		.append(betweenNodes);

		if ($inner) {
			$outer.append($inner);
		}

		$outer.insertBefore(startNode);

		$([startNode, nextNode]).remove();
	});
};

const init = () => {
	mockTeasers();

  const $$beacons = $(`[data-beacon="${BEACON_NAME}"]`, $(STORY_SELECTOR));
  const $$teasers = $$beacons.closest(EMBED_WYSIWYG_SELECTOR);

	$$beacons.remove();

  $$teasers.each((index, el) => {
    dewysiwyg.normalise(el);

    const $teaser = $(el);
    const sectionEls = wrapSections($teaser);
		const items = sectionEls.map(parseItemFromSection).filter(x => x);
		const $root = $(templates.root({id: index, items: items}));
		const $$cards = $root.find('.ExpandableCards-card')
		.each((index, el) => {
			$(el).data('item', items[index]);
		});
		const $story = $(templates.story({id: index})).hide();
		const refs = {
			$root: $root,
			$$cards: $$cards,
			$story: $story
		};

		$root.on('click', '.ExpandableCards-card', refs, showStory);
		$(window).on('resize', refs, reorderVisibleStory);
    $teaser.empty().append($root);
  });

};

init();
