// Use strict
"use strict";


// Classes

// Wake lock class
class WakeLock {

	// Public
	
		// Constructor
		constructor() {
		
			// Set lock
			this.lock = WakeLock.NO_LOCK;
			
			// Set self
			var self = this;
			
			// Document visibility change event
			$(document).on("visibilitychange", function() {
			
				// Check if wake lock already exists and page is now visible
				if(self.lock !== WakeLock.NO_LOCK && document["visibilityState"] === Common.VISIBILITY_STATE_VISIBLE) {
				
					// Request wake lock
					navigator["wakeLock"].request("screen").then(function(lock) {
					
						// Set lock
						self.lock = lock;
					
					// Catch errors
					}).catch(function(error) {
					
						// Clear lock
						self.lock = WakeLock.NO_LOCK;
					});
				}
			});
		}
		
		// Prevent lock
		preventLock() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if wake is already locked
				if(self.lock !== WakeLock.NO_LOCK)
				
					// Resolve
					resolve();
		
				// Otherwise check if wake lock is supported
				else if(typeof navigator === "object" && navigator !== null && "wakeLock" in navigator === true) {
				
					// Request wake lock
					navigator["wakeLock"].request("screen").then(function(lock) {
					
						// Set lock
						self.lock = lock;
						
						// Resolve
						resolve();
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject
						reject();
					});
				}
				
				// Otherwise
				else
				
					// Reject
					reject();
			});
		}
		
		// Allow lock
		allowLock() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if wake is already unlocked
				if(self.lock === WakeLock.NO_LOCK)
				
					// Resolve
					resolve();
				
				// Otherwise
				else {
				
					// Request wake unlock
					self.lock.release().then(function() {
					
						// Clear lock
						self.lock = WakeLock.NO_LOCK;
						
						// Resolve
						resolve();
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject
						reject();
					});
				}
			});
		}
	
	// Private
	
		// No lock
		static get NO_LOCK() {
		
			// Return no lock
			return null;
		}
}


// Main function

// Set global object's wake lock
globalThis["WakeLock"] = WakeLock;
