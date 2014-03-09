# Flexisel

> Simple carousel without any complicated stuff around it

## Why

You all know these huge jQuery carousel plugins, right?  
Besides these 20kB or even more, you also have to include jQuery in your site.

I found out that I don't need jQuery in my daily life - it would make my life easier but I really don't like overhead.

So I decided to write basic JS libraries not requiring any other libraries.  
Also, I want to learn advanced JS, so building this without jQuery was good for me (see "Feedback" below).

Flexisel is the first library in this series.
I also released [Flexibox](https://github.com/vis7mac/flexisel), a lightbox library.

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
- 1.08 KB minified and gzipped (!)
- totally flexible, as it doesn't require any other libraries

## Flexisel is *not*:

- packed with any CSS or graphics, so it can be highly configured
- one of these amazing 3D rotation carousels as the possible items are separate from the "stage"
- usable out-of-the-box™
- working in stone-age browsers (requires `document.querySelector` and `Function.bind()`)

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

## Feedback

I'm truly not a JS professional - but I want to become one.

I tried to comment everything in the Flexisel code, so if you want to support me and are good at JS, I would be really happy if you would give me [feedback on my code](https://twitter.com/lukasbestle).  
**Thanks!**