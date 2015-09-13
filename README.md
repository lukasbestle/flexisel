# Flexisel

> Simple carousel without any complicated stuff around it

## Why

You all know these huge jQuery carousel plugins, right?  
Besides these 20kB or even more, you also have to include jQuery on your site.

I found out that I don't need jQuery in my daily life - it would make my life a bit easier but I really don't like overhead.
Don't get me wrong: Using jQuery can make sense, but not for sites that otherwise don't use much JavaScript.

So I decided to write basic JS libraries without any dependencies.

Flexisel is the first library in this series.
I also released [Flexibox](https://git.lukasbestle.com/flexijs/flexibox), a lightbox library.

## Features

- based on a list of links which can include just about any HTML content (images, text etc.) and a "stage" where the active item is transferred to
- hides the stage using a custom class name, which will get attached when the stage changes (you will do something like `opacity: 0;` combined with transitions for that class)
- automatically rotates the items in a specified interval
- can be triggered manually by the user (clicking an item) or by the developer (`Flexisel.set()` method)
- can exist multiple times on a page
- doesn't annoy the user:
	- doesn't change automatically if the user is hovering the carousel
	- doesn't change for a while after the user manually clicked on an item

## Flexisel is:

- a simple carousel framework
- ~ 1KB minified and gzipped (!) with no dependencies
- totally flexible and customizable

## Flexisel is *not*:

- packed with any CSS or graphics, so it can be highly configured
- one of these amazing 3D rotation carousels as the clickable items are separate from the "stage"
- usable out-of-the-box™
- usable in stone-age browsers (requires `document.querySelector` and `Function.bind()`)

## Usage

### HTML

```html
<section id="carousel">
	<ul>
		<li class="active">
			<a href="http://example.com/this/is/the/destination/of/the/item">
				<!-- Whatever -->
			</a>
		</li>
		<li>
			<a href="http://example.com/this/is/another/destination/of/the/item">
				<!-- Whatever -->
			</a>
		</li>
		<li>
			<a href="http://example.com/this/is/another/destination/of/the/item">
				<!-- Whatever -->
			</a>
		</li>
	</ul>
	<div class="stage">
		<a href="http://example.com/this/is/the/destination/of/the/item">
			<!-- Whatever -->
		</a>
	</div>
</section>
```

### JS

```javascript
var carousel = new Flexisel(document.getElementById('carousel'));
```

#### With custom configuration (see `flexisel.js` for documentation)

```javascript
var carousel = new Flexisel(document.getElementById('carousel'), {
	'debug':       true,
	'setCallback': function(link) { ... }
});
```

## Author

- Lukas Bestle <mail@lukasbestle.com>

## License

This project was published under the terms of the MIT license. You can find a copy [over at the repository](https://git.lukasbestle.com/flexijs/flexisel/blob/master/LICENSE.md).
