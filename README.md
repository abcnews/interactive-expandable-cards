# interactive-expandable-cards

Groups of expandable "winners and losers"-style cards that can be embedded in stories.

## Configuration

You can control the appearance of cards by appending settings to the `cards` anchor.

### Default card colour

Add `COLOUR` in uppercase followed by a [named colour](https://css-tricks.com/snippets/css/named-colors-and-hex-equivalents/) or hex code in lowercase.

Examples:
* `cardsCOLOURgold`
* `cardsCOLOURffd700`

### Label colour

Add `COLOUR` in uppercase followed by the name of the label in uppercase, and the colour in lowercase.

Example: `cardsCOLOURWINNERdarkgreenCOLOURLOSERdarkredNEUTRALdimgrey`

### Photo colour

Add `TINTPHOTOyes` to re-colour photos to match the colour of the label.

Example: `cardsCOLOURWINNERdarkgreenCOLOURLOSERdarkredNEUTRALdimgreyTINTPHOTOyes`


## Card-level configuration

You can override the appearance of individual cards by appending settings to a `card` anchor below the subheading.

Example: `cardCOLOURlightpink`


## Accessibility

Implementation is based on W3C's [WAI-ARIA Accordion Example](https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html)
