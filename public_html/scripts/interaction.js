// Use strict
"use strict";


// Classes

// Interaction class
class Interaction {

	// Public
		
		// Constructor
		constructor(index, url, api, type, data, listener) {
		
			// Set index
			this.index = index;
			
			// Set URL
			this.url = url;
			
			// Set API
			this.api = api;
			
			// Set type
			this.type = type;
			
			// Set data
			this.data = data;
		
			// Set listener
			this.listener = listener;
			
			// Set canceled
			this.canceled = false;
		}
		
		// Get URL
		getUrl() {
		
			// Return URL
			return this.url;
		}
		
		// Get API
		getApi() {
		
			// Return API
			return this.api;
		}
		
		// Get type
		getType() {
		
			// Return type
			return this.type;
		}
		
		// Get data
		getData() {
		
			// Return data
			return this.data;
		}
		
		// Set canceled
		setCanceled() {
		
			// Set canceled
			this.canceled = true;
		}
		
		// Is canceled
		isCanceled() {
		
			// Return if canceled
			return this.canceled === true;
		}
		
		// Respond
		respond(response) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if canceled
				if(self.isCanceled() === true) {
				
					// Reject error
					reject("Interaction canceled.");
				}
				
				// Otherwise
				else {
			
					// Return responding with data to listener
					return self.listener.respondWithData(self.index, response).then(function(status) {
					
						// Resolve status
						resolve(status);
						
					// Catch errors
					}).catch(function(error) {
						
						// Reject error
						reject(error);
					});
				}
			});
		}
		
		// Cancel
		cancel(response) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if canceled
				if(self.isCanceled() === true) {
				
					// Reject error
					reject("Interaction canceled.");
				}
				
				// Otherwise
				else {
			
					// Return responding with error to listener
					return self.listener.respondWithError(self.index, response).then(function(status) {
					
						// Resolve status
						resolve(status);
						
					// Catch errors
					}).catch(function(error) {
						
						// Reject error
						reject(error);
					});
				}
			});
		}
}


// Main function

// Set global object's interaction
globalThis["Interaction"] = Interaction;
