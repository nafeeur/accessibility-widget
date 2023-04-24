# accessibility-widget

Demo: https://codepen.io/demo-naf-app/pen/NWLyyBB

Code based on: https://github.com/bennyluk/Sienna-Accessibility-Widget

## Introduction:
The code is a JavaScript script that provides an accessibility widget for web pages. The widget allows users to adjust various settings to make the web page more accessible, including font size, color adjustments, and various tools such as text-to-speech and big cursor. The widget is implemented as a button that can be clicked to open the accessibility menu.

## Technical Details:
The code starts by adding an event listener to the DOMContentLoaded event, which fires when the page is fully loaded and parsed. Inside the event listener, the code initializes the SpeechSynthesis API, which provides text-to-speech functionality.

Next, the code defines two functions: speakText() and stopSpeaking(). speakText() uses the SpeechSynthesis API to convert the text content of the web page (retrieved using document.body.innerText) into speech. stopSpeaking() checks if speech is currently being spoken and cancels it if so.

The code then defines a handleButtonClick() function, which is called when the accessibility widget button is clicked. If the button is clicked while speech is currently being spoken, the function calls stopSpeaking(). Otherwise, it calls speakText() to start speech synthesis.

The code defines an object called t, which represents the state of the widget. t has a states property that stores the values of various widget settings, such as font size and color adjustments. The code initializes t with any saved state stored in a cookie.

The code defines three arrays of objects, i, o, and l, which represent the various options available in the accessibility menu. The objects in each array represent a specific option and contain a label, a key (used to identify the option), and an icon (displayed next to the label). The options in i represent content adjustments, o represents color adjustments, and l represents tools.

The code defines a function called n(), which takes an array of option objects and generates the HTML markup for displaying those options in the accessibility menu. The function generates a string of HTML elements, including a div for each option with appropriate classes, role, and data attributes.

The code generates three HTML strings using the n() function: i for content adjustments, o for color adjustments, and l for tools.

The code then creates a div element called r and sets its innerHTML to an HTML string that contains all the necessary HTML elements for the accessibility widget, including the button and menu elements, the various option elements generated earlier, and CSS styles.

The code defines several utility functions: c, d, p, and u. c() creates or updates a <style> element with a given ID and sets its innerHTML to a given CSS rule. d() generates a CSS rule for a given filter and property. p() applies a given filter to the page by setting a data attribute on the document element and generating a corresponding <style> element with the appropriate CSS rules. u() updates the UI to reflect the current state of the widget.

The code adds event listeners to the button and menu elements that toggle the visibility of the menu when clicked. It also adds event listeners to the various option elements that update the state of the widget when clicked.
