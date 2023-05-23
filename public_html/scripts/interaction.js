// Use strict
"use strict";


// Classes

// Interaction class
class Interaction {

	// Public
		
		// Constructor
		constructor(index, urlOrWalletKeyPath, api, type, data, listener = Interaction.NO_LISTENER) {
		
			// Check if a URL is provided
			if(typeof urlOrWalletKeyPath === "string") {
			
				// Set URL
				var url = urlOrWalletKeyPath;
				
				// Set wallet key path
				var walletKeyPath = Interaction.NO_WALLET_KEY_PATH;
			}
			
			// Otherwise
			else {
			
				// Set URL
				var url = Interaction.NO_URL;
				
				// Set wallet key path
				var walletKeyPath = urlOrWalletKeyPath;
			}
		
			// Set index
			this.index = index;
			
			// Set URL
			this.url = url;
			
			// Set wallet key path
			this.walletKeyPath = walletKeyPath;
			
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
		
		// Get wallet key path
		getWalletKeyPath() {
		
			// Return wallet key path
			return this.walletKeyPath;
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
				
				// Otherwise check if a listener is used
				else if(self.listener !== Interaction.NO_LISTENER) {
			
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
				
				// Otherwise
				else {
				
					// Resolve
					resolve();
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
				
				// Otherwise check if a listener is used
				else if(self.listener !== Interaction.NO_LISTENER) {
			
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
				
				// Otherwise
				else {
				
					// Resolve
					resolve();
				}
			});
		}
		
		// No index
		static get NO_INDEX() {
		
			// Return no index
			return null;
		}
		
		// No listener
		static get NO_LISTENER() {
		
			// Return no listener
			return null;
		}
		
		// No URL
		static get NO_URL() {
		
			// Return no URL
			return null;
		}
		
		// No wallet key path
		static get NO_WALLET_KEY_PATH() {
		
			// Return no wallet key path
			return null;
		}
}


// Main function

// Set global object's interaction
globalThis["Interaction"] = Interaction;
