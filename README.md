# Expandable cards

Groups of expandable "winners and losers"-style cards that can be embedded in stories.

## Configuration

Expandable cards sections are defined by starting (`#startcards`) and ending (`#endcards`) markers in the article text.

You can control some aspects of cards' appearance by appending settings to the `#startcards` anchor and further control some appearance attributes on individual cards by using settings markers within each card.

### Default card colour

The default card colour is black. Add `COLOUR` in uppercase followed by a colour name (see list below) or hex code in lowercase to change the default card colour.

Examples:

- `#startcardsCOLOURred`
- `#startcardsCOLOURffd700`

### Colour cards by label

Card colours can be defined on a per-label basis. To specify a colour for a specific label add `COLOUR` in uppercase followed by the name of the label in uppercase, and the colour in lowercase.

Example: `#startcardsCOLOURWINNERgreenCOLOURLOSERredCOLOURNEUTRALgrey`

### Image colour

Add `TINTIMAGESyes` to re-colour card images to match the colour of the label.

Example: `#startcardsCOLOURWINNERgreenCOLOURLOSERredCOLOURNEUTRALgreyTINTIMAGESyes`

## Cards

Each card is defined by the existence of a Heading 1 (`<h2>`) which specifies the card title and (optionally) card label.

The first embedded image after the heading will be used as the card image.

You can override the appearance of individual cards by use of an anchor with a specific format anywhere in the card content. The card specific settings available are **colour** and **tint**.

Example: `#COLOURblueTINTIMAGEno`

## Named colours

For convenience, the following colour names can be used: <span style="color: white; background-color: #049a5e; padding: 0.2em;">green</span> (`#049a5e`), <span style="color: white; background-color: #b71a3c; padding: 0.2em;">red</span> (`#b71a3c`), <span style="color: white; background-color: #1467cc; padding: 0.2em;">blue</span> (`#1467cc`), <span style="color: black; background-color: #b5bbbc; padding: 0.2em;">grey</span> (`#b5bbbc`) and <span style="color: white; background-color: #000000; padding: 0.2em;">black</span> (`#000000`).

All other colours must be specified using an RGB hex value.

## Accessibility

Implementation is based on W3C's [WAI-ARIA Accordion Example](https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html)

## Backwards compatibility

The current version of this component has Presentation Layer article pages on the ABC News website as a primary target.

It is backwards compatible in the sense that older articles rendered by legacy Phase 1 and Phase 2 templates should still render as expected. However there are a number of differences in usage and configuration options for older legacy usage that aren't documented here.

(don't mind me; I'm just here so we can test our PR CI workflow 😅)
