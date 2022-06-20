// Use strict
"use strict";


// Classes

// Output information class
class OutputInformation {

	// Public
		
		// Constructor
		constructor(output, amount, identifier, switchType) {
		
			// Set output
			this.output = output;
			
			// Set amount
			this.amount = amount;
			
			// Set identifier
			this.identifier = identifier;
			
			// Set switch type
			this.switchType = switchType;
		}
		
		// Get output
		getOutput() {
		
			// Return output
			return this.output;
		}
		
		// Get amount
		getAmount() {
		
			// Return amount
			return this.amount;
		}
		
		// Get identifier
		getIdentifier() {
		
			// Return identifier
			return this.identifier;
		}
		
		// Get switch type
		getSwitchType() {
		
			// Return switch type
			return this.switchType;
		}
}


// Main function

// Set global object's output information
globalThis["OutputInformation"] = OutputInformation;
