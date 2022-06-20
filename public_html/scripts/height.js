// Use strict
"use strict";


// Classes

// Height class
class Height {

	// Public
	
		// Constructor
		constructor(height, hash = Height.NO_HASH) {
		
			// Set height
			this.setHeight(height);
			
			// Set hash
			this.setHash(hash);
		}
		
		// Set height
		setHeight(height) {
		
			// Set height
			this.height = height;
		}
		
		// Get height
		getHeight() {
		
			// Return height
			return this.height;
		}
		
		// Set hash
		setHash(hash) {
		
			// Set hash
			this.hash = hash;
		}
		
		// Get hash
		getHash() {
		
			// Return hash
			return this.hash;
		}
	
	// Private
	
		// No hash
		static get NO_HASH() {
		
			// Return no hash
			return "";
		}
}


// Main function

// Set global object's height
globalThis["Height"] = Height;
