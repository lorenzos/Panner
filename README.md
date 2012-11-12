Panner
======

Content panning based mouse movement, a cool way to replace scrolling for large images or full pages.  
Requires Mootools Core 1.4.1 or later.

![Screenshot](https://github.com/lorenzos/Panner/raw/master/Graphics/logo.png)


How to use
----------

First of all, include in your page Mootools 1.4.1 or later, and *Panner.js* source.

	<script type="text/javascript" src="Mootools.js"></script>
	<script type="text/javascript" src="Panner.js"></script>

Place the content you want to pan inside a smaller container (can be the main body too), like this:

	<!-- Small container -->
	<div style="width: 600px; height: 200px;">
	
		<!-- Big content -->
		<div id="content" style="width: 1200px; height: 600px;">
			Lorem Ipsum dolor sit amet.
		</div>
		
	</div>

Then, in your Javascript:

	$('content').panner();


Docs
----

**Syntax:**
	
	var myPanner = new Panner(content, options);

- **content**: A DOM element or ID, the content you want to scroll.
- **options**: (object) Options for the class. They are all listed below.

**Options:**

- **limit**: If `TRUE` (default) limits content panning at its normal scroll bounds.
- **center**: If `TRUE` moves the content to the center initially.

**Methods:**

- **center()**: Moves the content to the center immediatly.
- **topLeft()**: Moves the content to the top-left corner immediatly.
- **select()**: Select a value.
- **attach()**: Enable panner, this method is called in costructor.
- **detach()**: Disable panner, call it when you want to suspend panning.
- **refresh()**: Refresh panner (detach + attach), call this when container or content size changes.

**Element and Elements methods:**

You can use some shortcut methods on **Element** and **Elements** for creating the Panner quickly.

	$$('img').panner(options); // Attach Panner to all images

- **Element.panner(options)**: Creates a new instance of Panner on a single element.
- **Elements.panner(options)**: Creates a new instance of Panner on elements.
