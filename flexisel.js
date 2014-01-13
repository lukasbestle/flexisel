/**
 * Flexisel
 * Simple carousel without any complicated stuff around it
 * 
 * @version   0.8 (02.01.2014)
 * @author    Lukas Bestle <lukas@lu-x.me>
 * @copyright Lukas Bestle
 * @link      https://github.com/vis7mac/flexisel
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * 
 * @param  object carousel The object of the element you want to init the carousel in
 * @param  object options  Object with configuration options overwriting the default ones
 */
var Flexisel = function(carousel, options) {
	'use strict';
	
	var self                 = this,
	    attrName,
	    automaticIteration,
	    stage,
	    listItems,
	    buttons,
	    addClass,
	    removeClass;
	
	// Expose default options
	this.options = {
		// Times
		interval:           8000,       // Change interval
		waitAfterManual:    20000,      // Time to wait after an item was manually clicked
		changeTime:         400,        // Time to wait between hiding and showing the stage
		
		// Selectors
		stage:              '.stage',   // Selector of the stage within a carousel
		listItems:          'li',       // Possible list items
		buttons:            'li a',     // Buttons in the item list which are transferred to the stage
		
		// Class names
		stageChangingClass: 'changing', // Class attached to the stage while changing its content
		activeClass:        'active',   // Class attached to the active list item
		
		// Callbacks
		setCallback:        null,       // Callback called with the object of the current link when setting the current item;
		                                // can return false to prevent setting an item
		
		// Other options
		debug:              false       // Debug mode (print to console each time the item is changed)
	};
	
	// Merge with custom options
	if(typeof options === 'object') {
		for(attrName in options) {
			if(options.hasOwnProperty(attrName)) {
				this.options[attrName] = options[attrName];
			}
		}
	}
	
	// Get required stuff from the DOM
	stage     =                            carousel.querySelector   (this.options.stage);
	listItems = Array.prototype.slice.call(carousel.querySelectorAll(this.options.listItems));
	buttons   = Array.prototype.slice.call(carousel.querySelectorAll(this.options.buttons));
	
	// Expose status stuff
	this.current         = 0;     // Current item ID in "buttons" (zero-based)
	this.lastManual      = 0;     // Last time stamp when the user clicked manually
	this.hovered         = false; // Is the user currently hovering the carousel?
	
	/**
	 * Set the carousel to show a specific item
	 * 
	 * @param  object link The object of the item in the list which should be transferred; if not given: "next item"
	 * @return boolean     Did it work?
	 */
	this.set = function(link) {
		// If no specific link is given, just increase by one
		var linkObject = (link === undefined)? buttons[(this.current === buttons.length - 1)? 0 : this.current + 1] : link;
		
		// Ask the callback if we should do it right now
		if(typeof this.options.setCallback === 'function' && !this.options.setCallback(link)) {
			return false;
		}
		
		// Check if the link is the current one
		if(buttons.indexOf(linkObject) === this.current) {
			return false;
		}
		
		// Disable all other items, enable the new item
		listItems.forEach(function(item) {
			removeClass(item, this.options.activeClass);
		}.bind(this));
		addClass(linkObject.parentNode, this.options.activeClass);
		
		// Hide the old content
		addClass(stage, this.options.stageChangingClass);
		
		setTimeout(function() {
			var outerHTML = function(node) {
				return node.outerHTML || (
				function(n) {
					var div = document.createElement('div'), h;
					div.appendChild(n.cloneNode(true));
					h = div.innerHTML;
					div = null;
					return h;
				}(node));
			};
			
			// Load the new content
			stage.innerHTML = outerHTML(linkObject);
			
			// Show the stage again
			setTimeout(function() {
				removeClass(stage, this.options.stageChangingClass);
			}.bind(this), this.options.changeTime / 2);
		}.bind(this), this.options.changeTime / 2);
		
		// Save the current item
		this.current = buttons.indexOf(linkObject);
		
		// Debug
		if(this.options.debug) {
			console.log('[Flexisel] Changed to item ' + this.current + ', which was ' + ((link === undefined)? 'the next item' : 'requested') + '.');
		}
		
		return true;
	};
	
	/**
	 * Change the current item every options.interval milliseconds
	 * Only if the user is not hovering and did not interact for a while
	 */
	automaticIteration = function() {
		// Wait if the user just clicked
		var currentTime = new Date().getTime(),
		    time = (this.lastManual + this.options.waitAfterManual > currentTime)? this.options.waitAfterManual - (currentTime - this.lastManual) : 0;
		
		// Wait until that time is over before actually changing
		setTimeout(function() {
			// Check if the user is currently hovering or this timeout was set before the user clicked manually
			if(this.lastManual + this.options.waitAfterManual <= new Date().getTime() && !this.hovered) {
				// No, all is fine, change to the next item
				this.set();
			}
			
			// Change again after the interval is over
			setTimeout(automaticIteration.bind(this), this.options.interval);
		}.bind(this), time);
	};
	setTimeout(automaticIteration.bind(this), this.options.interval);
	
	/**
	 * Manual change
	 */
	buttons.forEach(function(item) {
		item.onclick = function() {
			var success = self.set(this);
			
			if(success) {
				// Stop automatic rotation for a time
				self.lastManual = new Date().getTime();
			
				// Prevent reloading the page
				return false;
			}
		};
	}.bind(this));
	
	/**
	 * Detect hovers
	 */
	carousel.onmouseover = function() {
		this.hovered = true;
	}.bind(this);
	
	carousel.onmouseout = function() {
		this.hovered = false;
	}.bind(this);
	
	/**
	 * Helper functions
	 */
	addClass = function(element, className) {
		element.className += ((element.className)? ' ' : '') + className;
	};

	removeClass = function(element, className) {
		element.className = element.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
	};
};
