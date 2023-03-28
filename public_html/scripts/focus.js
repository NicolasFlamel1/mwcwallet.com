// Use strict
"use strict";


// Classes

// Focus class
class Focus {

	// Public
	
		// Constructor
		constructor() {
		
			// Set focus stack to empty array
			this.focusStack = [];
			
			// Set self
			var self = this;
			
			// Document input focus event
			$(document).on("focus", "input", function() {
			
				// Get input
				var input = $(this);
				
				// Check if input isn't having its focus restored
				if(input.hasClass("focused") === false) {
				
					// Select input
					input.select();
				}
			});
			
			// Document key down event
			$(document).on("keydown", function(event) {
			
				// Check if is an extension and a popup or is an app
				if((Common.isExtension() === true && Common.isPopup() === true) || Common.isApp() === true) {
			
					// Check if key tab is pressed
					if(event["which"] === "\t".charCodeAt(0)) {
					
						// Get all focusable elements
						var focusableElements = $("button:not([tabindex=\"-1\"]):not(:disabled):visible, input:not([tabindex=\"-1\"]):not(:disabled):visible, select:not([tabindex=\"-1\"]):not(:disabled):visible, a:not([tabindex=\"-1\"]):not(:disabled):visible").filter(function() {
						
							// Return if not hidden
							return $(this).closest(".hide")["length"] === 0;
						});
						
						// Check if elements are focusable
						if(focusableElements["length"] !== 0) {
						
							// Check if no element is focused
							if($(":focus")["length"] === 0) {
							
								// Check if tabbing forward
								if(event["shiftKey"] === false) {
								
									// Focus on first focusable element
									focusableElements.first().focus();
								}
								
								// Otherwise
								else {
								
									// Focus on last first focusable element
									focusableElements.last().focus();
								}
								
								// Prevent default;
								event.preventDefault();
							}
							
							// Otherwise check if tabbing forward and focused on the last focusable element
							else if(event["shiftKey"] === false && focusableElements.last().is(":focus") === true) {
							
								// Check if other elements are focusable
								if(focusableElements["length"] > 1) {
							
									// Focus on first focusable element
									focusableElements.first().focus();
								}
							
								// Prevent default;
								event.preventDefault();
							}
							
							// Otherwise check if tabbing backward and focused on the first focusable element
							else if(event["shiftKey"] === true && focusableElements.first().is(":focus") === true) {
							
								// Check if other elements are focusable
								if(focusableElements["length"] > 1) {
							
									// Focus on last first focusable element
									focusableElements.last().focus();
								}
							
								// Prevent default;
								event.preventDefault();
							}
						}
						
						// Otherwise
						else {
						
							// Prevent default;
							event.preventDefault();
						}
					}
				}
			});
		}
		
		// Save
		save(blur) {
		
			// Get focused element
			var focusedElement = $(":focus");
			
			// Check if no elements are focused
			if(focusedElement["length"] === 0) {
			
				// Add no focus element to focus stack
				this.focusStack.push(Focus.NO_FOCUS);
				
				// Return no focus
				return Focus.NO_FOCUS;
			}
			
			// Otherwise
			else {
			
				// Add focused element to the focus stack
				this.focusStack.push(focusedElement.first());
				
				// Check if blurring
				if(blur === true) {
				
					// Remove focus from element
					focusedElement.blur();
					
					// Remove selection
					Focus.removeSelection();
				}
				
				// Return focused element
				return focusedElement;
			}
		}
		
		// Restore
		restore(blurIfNoState) {
		
			// Check if focus stack isn't empty
			if(this.focusStack["length"] > 0) {
			
				// Get focused element from the focus stack and remove it from the focus stack
				var focusedElement = this.focusStack.pop();
				
				// Check if focused element isn't no focus
				if(focusedElement !== Focus.NO_FOCUS) {
				
					// Set that focused element is having its focus restored
					focusedElement.addClass("focused");
				
					// Focus on focused element
					focusedElement.focus();
					
					// Set that focused element isn't having its focus restored
					focusedElement.removeClass("focused");
				}
				
				// Otherwise check if blurring if no state
				else if(blurIfNoState === true)
				
					// Blur focused element
					$(":focus").blur();
			}
		}
		
		// Delete
		delete() {
		
			// Check if focus stack isn't empty
			if(this.focusStack["length"] > 0)
			
				// Remove next focused element from the focus stack
				this.focusStack.pop();
		}
		
		// Delete all
		deleteAll() {
		
			// Set focus stack to empty array
			this.focusStack = [];
		}
		
		// Remove selection
		static removeSelection() {
		
			// Check if get selection is supported
			if(typeof getSelection !== "undefined") {
			
				// Get current selection
				var currentSelection = getSelection();
			
				// Check if current selection empty is supported
				if(typeof currentSelection.empty !== "undefined")
				
					// Empty current selection
					currentSelection.empty();
				
				// Otherwise check if current selection remove all ranges is supported
				else if(typeof currentSelection.removeAllRanges !== "undefined")
				
					// Remove all ranges from the current selection
					currentSelection.removeAllRanges();
			}
			
			// Otherwise check if selection is supported and selection empty is supported
			else if(typeof document["selection"] !== "undefined" && typeof document["selection"].empty !== "undefined")
			
				// Empty selection
				document["selection"].empty();
		}
		
		// No focus
		static get NO_FOCUS() {
		
			// Return no focus
			return null;
		}
}


// Main function

// Set global object's focus
globalThis["Focus"] = Focus;
