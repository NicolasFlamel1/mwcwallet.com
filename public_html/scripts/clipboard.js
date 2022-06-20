// Use strict
"use strict";


// Classes

// Clipboard class
class Clipboard {

	// Public
	
		// Copy
		copy(text) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if clipboard API is supported
				if(typeof navigator === "object" && navigator !== null && "clipboard" in navigator === true) {
				
					// Return writing text to clipboard
					return navigator["clipboard"].writeText(text).then(function() {
					
						// Resolve
						resolve();
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject("Writing to clipboard failed.");
					});
				}
				
				// Otherwise
				else
				
					// Reject error
					reject("Clipboard not supported.");
			});
		}
}


// Main function

// Set global object's clipboard
globalThis["Clipboard"] = Clipboard;
