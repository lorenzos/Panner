/*
---
description: Content panning based on mouse movement, a cool way to replace scrolling for large images or full pages.

license: MIT-style

authors:
- Lorenzo Stanco

requires:
- core/1.4.1: '*'

provides: [Panner]

...
*/

var Panner = new Class({

	Implements: [Options],
	
	options: {
		limit: true, // Limits content movements at its normal scroll bounds
		center: false // Move to center initially
	},
	
	initialize: function(content, options) {
		
		// Setup
		this.setOptions(options);
		this.content = document.id(content);
		this.container = this.content.getParent();
		
		// Force content position and container overflow
		if (!(['relative', 'absolute'].contains(this.content.getStyle('position')))) this.content.setStyle('position', 'relative');
		this.container.setStyle('overflow', 'hidden');
		
		// Force container position for IE6-7 (this solves an overflow bug)
		if (Browser.ie6 || Browser.ie7) {
			if (!(['relative', 'absolute'].contains(this.container.getStyle('position')))) this.container.setStyle('position', 'relative');
		}
		
		// Attach
		this.attach();
		
		// Manage window resizing
		window.addEvent('resize', function() { if (this.attached) this.refresh(); }.bind(this));
		
		// Center?
		if (this.options.center) this.center();
		
	},
	
	// Scroll content to center
	center: function() {
		this.content.setStyles({ 
			left: (this.containerSize.x - this.contentSize.x) / 2, 
			top : (this.containerSize.y - this.contentSize.y) / 2 
		});
		return this;
	},
	
	// Scroll content to top left corner
	topLeft: function() {
		this.content.setStyles({ 'left': 0, 'top': 0 });
		return this;
	},
	
	// Attach events, enabling panner
	attach: function() {
		if (!this.attached) {
		
			// Calculate elements size
			this.contentSize = this.content.getSize(); // Padding and borders too
			this.containerSize = { x: this.container.getStyle('width').toInt(), y: this.container.getStyle('height').toInt() }; // Without padding and borders
			this.containerPosition = this.container.getPosition();
			this.ratio = { x: this.contentSize.x / this.containerSize.x, y: this.contentSize.y / this.containerSize.y }; // Content/container ratio
			
			// Setup initial position in a way that content is never completely outside container
			var currentPosition = {
				x: this.content.getStyle('left').toInt(),
				y: this.content.getStyle( 'top')
			};
			if (currentPosition.x > this.containerSize.x || currentPosition.y > this.containerSize.y || currentPosition.x < -this.contentSize.x || currentPosition.y < -this.contentSize.y) {
				if (this.options.center) this.center();
				else this.topLeft();
			}
			
			// Attach events
			if (!this.bound) this.bound = this._scroll.bind(this);
			this.container.addEvent('mousemove', this.bound);
			
			this.attached = true;
			
		}
		return this;
	},
	
	// Detach events, disabling panner
	detach: function() {
		if (this.attached) {
			this.container.removeEvent('mousemove', this.bound);
			this.attached = false;
		}
		return this;
	},
	
	// Refresh panner (detach + attach)
	refresh: function() {
		this.detach().attach();
		return this;
	},
	
	_scroll: function(e) {
		if (this.attached) {
		
			// Calculate coordinates
			var mouse = { x: e.page.x - this.containerPosition.x, y: e.page.y - this.containerPosition.y }; // Mouse position relative to container
			var position = { x: this.containerSize.x / 2 - mouse.x * this.ratio.x, y: this.containerSize.y / 2 - mouse.y * this.ratio.y }; // New position for content
			
			// Limit coordinates
			if (this.options.limit) position = {
				x: position.x.limit(this.containerSize.x - this.contentSize.x, 0), 
				y: position.y.limit(this.containerSize.y - this.contentSize.y, 0)
			};
			
			// Force when container is bigger than content
			if (this.options.limit && this.containerSize.x > this.contentSize.x) position.x = this.options.center ? (this.containerSize.x - this.contentSize.x) / 2 : 0;
			if (this.options.limit && this.containerSize.y > this.contentSize.y) position.y = this.options.center ? (this.containerSize.y - this.contentSize.y) / 2 : 0;
			
			// Apply position
			this.content.setStyles({ 'left': position.x, 'top': position.y });
			
		}
		return this;
	}
	
});

Element.implement({
	
	panner: function(options) {
		new Panner(document.id(this), options);
		return this;
	}
	
});

Elements.implement({
	
	panner: function(options) {
		this.each(function(el) { new Panner(el, options); });
		return this;
	}
	
});
