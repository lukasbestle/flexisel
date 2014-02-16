/**
 * Flexisel
 * Simple carousel without any complicated stuff around it
 * 
 * @version   1.0 (16.02.2014)
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
	    removeClass,
	    outerHTML,
	    childOf;
	
	// Expose default options
	this.options = {
		// Times
		interval:           8000,       // Change interval
		waitAfterManual:    20000,      // Time to wait after an item was manually clicked
		changeTime:         400,        // Time to wait between hiding and showing the stage
		
		// Selectors
		stage:              '.stage',   // Stage within a carousel
		listItems:          'li',       // Possible list items (can get "active")
		buttons:            'a',        // Elements the onclick event is applied to (children of listItems)
		transfer:           'a',        // Items transferred to the stage (children of listItems)
		
		// Class names
		stageChangingClass: 'changing', // Class attached to the stage while changing its content
		activeClass:        'active',   // Class attached to the active list item
		
		// Callbacks
		setCallback:        null,       // Callback called with the object of the current link when setting the current item;
		                                // can return false to prevent setting an item
		
		// Other options
		noHover:            false,      // Ignore hover ("rotate under the mouse cursor")
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
	buttons   = Array.prototype.slice.call(carousel.querySelectorAll(this.options.listItems + ((this.options.buttons)? ' ' + this.options.buttons : '')));
	
	// Expose status stuff
	this.current    = 0;     // Current item ID in "listItems" (zero-based)
	this.lastManual = 0;     // Last time stamp when the user clicked manually
	this.hovered    = false; // Is the user currently hovering the carousel?
	
	/**
	 * Set the carousel to show a specific item
	 * 
	 * @param  object newItem The new item (possible: a) object of a button, b) object of a list item, numerical ID) which should be transferred to the stage; if not given: "next item"
	 * @return boolean        Did it work?
	 */
	this.set = function(newItem) {
		var listItemObject, transferObject;
		
		// Check if there are any list items
		if(listItems.length === 0) {
			return false;
		}
		
		// Get the list item we want to change to
		if(newItem === undefined) {
			// Increase by one
			listItemObject = listItems[(this.current === listItems.length - 1)? 0 : this.current + 1];
		} else if(typeof newItem === 'number') {
			// Get specific item
			listItemObject = listItems[newItem];
		} else if(typeof newItem === 'object') {
			// Loop through all list items to find the passed object
			listItems.every(function(item) {
				// List item was passed OR
				// Button    was passed
				if(item === newItem || childOf(newItem, item)) {
					listItemObject = item;
					return false;
				}
				
				// Continue loop
				return true;
			});
		} else {
			// Error
			throw '[Flexisel] Invalid value for "newItem".';
		}
		
		// Get the transfer object
		transferObject = listItemObject.querySelector(this.options.transfer);
		
		// Ask the callback if we should do it right now
		if(typeof this.options.setCallback === 'function' && !this.options.setCallback(listItemObject)) {
			return false;
		}
		
		// Check if the list item is the current one
		if(listItems.indexOf(listItemObject) === this.current) {
			return false;
		}
		
		// Disable all other items, enable the new item
		listItems.forEach(function(item) {
			removeClass(item, this.options.activeClass);
		}.bind(this));
		addClass(listItemObject, this.options.activeClass);
		
		// Hide the old content
		addClass(stage, this.options.stageChangingClass);
		
		setTimeout(function() {
			// Load the new content
			stage.innerHTML = outerHTML(transferObject);
			
			// Show the stage again
			setTimeout(function() {
				removeClass(stage, this.options.stageChangingClass);
			}.bind(this), this.options.changeTime / 2);
		}.bind(this), this.options.changeTime / 2);
		
		// Save the current item
		this.current = listItems.indexOf(listItemObject);
		
		// Debug
		if(this.options.debug) {
			console.log('[Flexisel] Changed to item ' + this.current + ', which was ' + ((newItem === undefined)? 'the next item' : 'requested') + '.');
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
	if(!this.options.noHover) {
		carousel.onmouseover = function() {
			this.hovered = true;
		}.bind(this);
		
		carousel.onmouseout = function() {
			this.hovered = false;
		}.bind(this);
	}
	
	/**
	 * Helper functions
	 */
	addClass = function(element, className) {
		element.className += ((element.className)? ' ' : '') + className;
	};

	removeClass = function(element, className) {
		element.className = element.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
	};
	
	outerHTML = function(node) {
		return node.outerHTML || (
		function(node) {
			var div = document.createElement('div'), html;
			
			div.appendChild(node.cloneNode(true));
			html = div.innerHTML;
			
			return html;
		}(node));
	};
	
	childOf = function(child, parent) {
		while((child = child.parentNode) && child !== parent) {}
		return !!child;
	};
};
