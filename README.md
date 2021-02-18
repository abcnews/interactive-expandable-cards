# interactive-expandable-cards

Groups of expandable "winners and losers"-style cards that can be embedded in stories.


## Configuration

You can control the appearance of cards by appending settings to the `cards` anchor.


### Default card colour

Add `COLOUR` in uppercase followed by a colour name (see list below) or hex code in lowercase.

Examples:
* `cardsCOLOURred`
* `cardsCOLOURffd700`

### Label colour

Add `COLOUR` in uppercase followed by the name of the label in uppercase, and the colour in lowercase.

Example: `cardsCOLOURWINNERgreenCOLOURLOSERredCOLOURNEUTRALgrey`

### Photo colour

Add `TINTPHOTOyes` to re-colour photos to match the colour of the label.

Example: `cardsCOLOURWINNERgreenCOLOURLOSERredCOLOURNEUTRALgreyTINTPHOTOyes`


## Card-level configuration

You can override the appearance of individual cards by appending settings to a `card` anchor below the subheading.

Example: `cardCOLOURblue`


## Available colour names

* <span style="color: white; background-color: #049a5e; padding: 0.2em;">green</span>
* <span style="color: white; background-color: #b71a3c; padding: 0.2em;">red</span>
* <span style="color: white; background-color: #1467cc; padding: 0.2em;">blue</span>
* <span style="color: black; background-color: #b5bbbc; padding: 0.2em;">grey</span>
* <span style="color: white; background-color: #000000; padding: 0.2em;">black</span>


## Accessibility

Implementation is based on W3C's [WAI-ARIA Accordion Example](https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html)
