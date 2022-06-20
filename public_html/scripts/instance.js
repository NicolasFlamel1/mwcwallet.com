// Use strict
"use strict";


// Classes

// Instance class
class Instance {

	// Public
		
		// Constructor
		constructor() {
		
			// Set current instance ID to random value
			this.currentInstanceId = Math.random().toFixed(Instance.MAX_FIXED_NUMBER_OF_DECIMAL_PLACES);
			
			// Set primary instance ID to stored value
			this.primaryInstanceId = localStorage.getItem(Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME);
			
			// Set check primary instance timeout
			this.checkPrimaryInstanceTimeout = Instance.NO_TIMEOUT;
			
			// Set self
			var self = this;
			
			// Try
			try {
			
				// Save current instance ID as the primary instance ID
				localStorage.setItem(Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME, this.currentInstanceId);
			}
			
			// Catch errors
			catch(error) {
			
				// Throw error
				throw "Local storage failed.";
			}
			
			// Set check primary instance timeout
			this.checkPrimaryInstanceTimeout = setTimeout(function() {
			
				// Check if primary instance
				self.checkIfPrimaryInstance();
			
			}, Instance.CHECK_IF_PRIMARY_INSTANCE_DELAY_MILLISECONDS);
			
			// Window storage instance event
			$(window).on("storage.instance", function(event) {
			
				// Check if primary instance ID was changed
				if(event["originalEvent"]["key"] === Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME) {
				
					// Check if primary instance was closed
					if(event["originalEvent"]["newValue"] === null || event["originalEvent"]["newValue"] === "") {
					
						// Try
						try {
						
							// Save current instance ID as the primary instance ID
							localStorage.setItem(Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME, self.currentInstanceId);
						}
						
						// Catch errors
						catch(error) {
						
							// Return
							return;
						}
						
						// Check if check primary instance timeout exists
						if(self.checkPrimaryInstanceTimeout !== Instance.NO_TIMEOUT) {
						
							// Clear check primary instance timeout
							clearTimeout(self.checkPrimaryInstanceTimeout);
							
							// Clear check primary instance timeout
							self.checkPrimaryInstanceTimeout = Instance.NO_TIMEOUT;
						}
						
						// Set check primary instance timeout
						self.checkPrimaryInstanceTimeout = setTimeout(function() {
						
							// Check if primary instance
							self.checkIfPrimaryInstance();
						
						}, Instance.CHECK_IF_PRIMARY_INSTANCE_DELAY_MILLISECONDS);
					}
				
					// Otherwise check if current instance ID is the primary instance ID and a new instance is trying to become the primary instance
					else if(self.currentInstanceId === self.primaryInstanceId && event["originalEvent"]["newValue"] !== self.currentInstanceId) {
					
						// Try
						try {
					
							// Save current instance ID as the primary instance ID
							localStorage.setItem(Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME, self.currentInstanceId);
						}
						
						// Catch errors
						catch(error) {
						
							// Trigger a fatal error
							new FatalError(FatalError.LOCAL_STORAGE_ERROR);
						}
					}
					
					// Otherwise check if new instance isn't the current instance ID
					else if(event["originalEvent"]["newValue"] !== self.currentInstanceId)
					
						// Update primary instance ID
						self.primaryInstanceId = event["originalEvent"]["newValue"];
				}
			
			// Window focus instance event
			}).on("focus.instance", function() {
			
				// Check if current instance ID isn't the primary instance ID
				if(self.currentInstanceId !== self.primaryInstanceId) {
			
					// Set timeout
					setTimeout(function() {
					
						// Try
						try {
						
							// Save current instance ID as the primary instance ID
							localStorage.setItem(Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME, self.currentInstanceId);
						}
						
						// Catch errors
						catch(error) {
						
							// Return
							return;
						}
						
						// Check if check primary instance timeout exists
						if(self.checkPrimaryInstanceTimeout !== Instance.NO_TIMEOUT) {
						
							// Clear check primary instance timeout
							clearTimeout(self.checkPrimaryInstanceTimeout);
							
							// Clear check primary instance timeout
							self.checkPrimaryInstanceTimeout = Instance.NO_TIMEOUT;
						}
						
						// Set check primary instance timeout
						self.checkPrimaryInstanceTimeout = setTimeout(function() {
						
							// Check if primary instance
							self.checkIfPrimaryInstance();
						
						}, Instance.CHECK_IF_PRIMARY_INSTANCE_DELAY_MILLISECONDS);
						
					}, Instance.FOCUS_DELAY_MILLISECONDS);
				}
			
			// Window before unload instance and unload instance event
			}).on("beforeunload.instance unload.instance", function() {
			
				// Turn off window before unload instance and unload instance event
				$(window).off("beforeunload.instance unload.instance");
			
				// Turn off window storage instance event
				$(window).off("storage.instance");
				
				// Turn off window focus instance event
				$(window).off("focus.instance");
			
				// Check if current instance ID is the primary instance ID
				if(self.currentInstanceId === self.primaryInstanceId)
				
					// Remove saved primary instance ID
					localStorage.removeItem(Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME);
			});
		}
		
		// Is primary instance
		isPrimaryInstance() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Set timeout
				setTimeout(function() {
				
					// Resolve if current instance ID is the primary instance ID
					resolve(self.currentInstanceId === self.primaryInstanceId);
				
				}, Instance.CHECK_IF_PRIMARY_INSTANCE_DELAY_MILLISECONDS);
			});
		}
		
		// Is primary instance event
		static get IS_PRIMARY_INSTANCE_EVENT() {
		
			// Return is primary instance event
			return "InstanceIsPrimaryInstanceEvent";
		}
	
	// Private
	
		// Check if primary instance
		checkIfPrimaryInstance() {
		
			// Clear check primary instance timeout
			this.checkPrimaryInstanceTimeout = Instance.NO_TIMEOUT;
		
			// Get the saved primary instance ID
			var savedPrimaryInstanceId = localStorage.getItem(Instance.PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME);
			
			// Check if current instance ID is the saved primary instance ID
			if(savedPrimaryInstanceId !== Common.INVALID_LOCAL_STORAGE_ITEM && this.currentInstanceId === savedPrimaryInstanceId) {
			
				// Set primary instance ID to current instance ID
				this.primaryInstanceId = this.currentInstanceId;
				
				// Trigger is primary instance event
				$(this).trigger(Instance.IS_PRIMARY_INSTANCE_EVENT);
			}
		}
		
		// Primary instance ID local storage name
		static get PRIMARY_INSTANCE_ID_LOCAL_STORAGE_NAME() {
		
			// Return primary instance ID local storage name
			return "Primary Instance ID";
		}
		
		// Check if primary instance delay milliseconds
		static get CHECK_IF_PRIMARY_INSTANCE_DELAY_MILLISECONDS() {
		
			// Return check if primary instance delay milliseconds
			return 600;
		}
		
		// Focus delay milliseconds
		static get FOCUS_DELAY_MILLISECONDS() {
		
			// Return focus delay milliseconds
			return 100;
		}
		
		// No timeout
		static get NO_TIMEOUT() {
		
			// Return no timeout
			return null;
		}
		
		// Max fixed number of decimal places
		static get MAX_FIXED_NUMBER_OF_DECIMAL_PLACES() {
		
			// Return max fixed number of decimal places
			return 20;
		}
}


// Main function

// Set global object's instance
globalThis["Instance"] = Instance;
