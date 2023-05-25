// Use strict
"use strict";


// Classes

// Scroll class
class Scroll {

	// Public
	
		// Constructor
		constructor() {
		
			// Set prevent scrolling keys to false
			this.preventScrollingKeys = false;
		
			// Set self
			var self = this;
		
			// Document key down event
			$(document).on("keydown", function(event) {
			
				// Check if preventing scrolling keys and a scroll key was pressed
				if(self.preventScrollingKeys === true && Scroll.isScrollKey(event["which"]) === true) {
				
					// Prevent default
					event.preventDefault();
				}
			
			// Input blur or mouse out event
			}).on("blur mouseout", "input", function() {
			
				// Get input
				var input = $(this);
				
				// Check if input doesn't have focus
				if(input.is(":focus") === false) {
			
					// Scroll input back to start
					input.scrollLeft(0);
				}
			});
			
			// Check if browser isn't Firefox
			if(typeof navigator !== "object" || navigator === null || "userAgent" in navigator === false || navigator["userAgent"].toLowerCase().indexOf("firefox") === Common.INDEX_NOT_FOUND) {
			
				// Scroll event
				document.addEventListener("scroll", function(event) {
					
					// Get element
					var element = $(event["target"]);
					
					// Check if element is an input and it doesn't have focus
					if(element.is("input") === true && element.is(":focus") === false) {
					
						// Prevent scrolling
						element.scrollLeft(0);
					}
				}, true);
			}
		}
		
		// Prevent keys
		preventKeys() {
		
			// Set prevent scrolling keys
			this.preventScrollingKeys = true;
		}
		
		// Allow keys
		allowKeys() {
		
			// Clear prevent scrolling keys
			this.preventScrollingKeys = false;
		}
		
		// Tolerance
		static get TOLERANCE() {
		
			// Return tolerance
			return 2;
		}
	
	// Private
	
		// Is scroll key
		static isScrollKey(key) {
		
			// Return is key is a scroll key
			return Scroll.SCROLL_KEYS.indexOf(key) !== Common.INDEX_NOT_FOUND;
		}
		
		// Scroll keys
		static get SCROLL_KEYS() {
		
			// Return scroll keys
			return [
		
				// Page up
				Scroll.PAGE_UP_KEY_CODE,
				
				// Page down
				Scroll.PAGE_DOWN_KEY_CODE,
				
				// End
				Scroll.END_KEY_CODE,
				
				// Home
				Scroll.HOME_KEY_CODE,
				
				// Left arrow
				Scroll.LEFT_ARROW_KEY_CODE,
				
				// Up arrow
				Scroll.UP_ARROW_KEY_CODE,
				
				// Right arrow
				Scroll.RIGHT_ARROW_KEY_CODE,
				
				// Down arrow
				Scroll.DOWN_ARROW_KEY_CODE
			];
		}
		
		// Page up key code
		static get PAGE_UP_KEY_CODE() {
		
			// Return page up key code
			return 33;
		}
		
		// Page down key code
		static get PAGE_DOWN_KEY_CODE() {
		
			// Return page down key code
			return 34;
		}
		
		// End key code
		static get END_KEY_CODE() {
		
			// Return end key code
			return 35;
		}
		
		// Home key code
		static get HOME_KEY_CODE() {
		
			// Return home key code
			return 36;
		}
		
		// Left arrow key code
		static get LEFT_ARROW_KEY_CODE() {
		
			// Return left arrow key code
			return 37;
		}
		
		// Up arrow key code
		static get UP_ARROW_KEY_CODE() {
		
			// Return up arrow key code
			return 38;
		}
		
		// Right arrow key code
		static get RIGHT_ARROW_KEY_CODE() {
		
			// Return right arrow key code
			return 39;
		}
		
		// Down arrow key code
		static get DOWN_ARROW_KEY_CODE() {
		
			// Return down arrow key code
			return 40;
		}
}


// Main function

// Set global object's scroll
globalThis["Scroll"] = Scroll;
