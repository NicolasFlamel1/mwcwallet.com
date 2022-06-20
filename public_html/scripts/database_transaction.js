// Use strict
"use strict";


// Classes

// Database transaction class
class DatabaseTransaction {

	// Public
	
		// Constructor
		constructor(transaction, objectStoreNames, autocomplete = true) {
		
			// Set transaction
			this.transaction = transaction;
			
			// Set object store names
			this.objectStoreNames = objectStoreNames;
			
			// Set autocomplete
			this.autocomplete = autocomplete;
			
			// Set completed
			this.completed = false;
			
			// Set aborted
			this.aborted = false;
			
			// Set self
			var self = this;
			
			// Transaction complete event
			$(this.transaction).on("complete", function() {
			
				// Set completed
				self.completed = true;
			
			// Transaction abort event
			}).on("abort", function() {
			
				// Set aborted
				self.aborted = true;
			});
		}
		
		// Get transaction
		getTransaction() {
		
			// Return transaction
			return this.transaction;
		}
		
		// Get object store names
		getObjectStoreNames() {
		
			// Return object store names
			return this.objectStoreNames;
		}
		
		// Get autocomplete
		getAutocomplete() {
		
			// Return autocomplete
			return this.autocomplete;
		}
		
		// Is completed
		isCompleted() {
		
			// Return if completed
			return this.completed === true;
		}
		
		// Is aborted
		isAborted() {
		
			// Return if aborted
			return this.aborted === true;
		}
}


// Main function

// Set global object's database transaction
globalThis["DatabaseTransaction"] = DatabaseTransaction;
