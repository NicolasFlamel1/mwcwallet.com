// Use strict
"use strict";


// Classes

// Initial heights obtained class
class InitialHeightsObtained {

	// Public
	
		// Constructor
		constructor(node) {
		
			// Create database
			Database.createDatabase(function(database, currentVersion, databaseTransaction) {
			
				// Create or get initial heights obtained object store
				var initialHeightsObtainedObjectStore = (currentVersion === Database.NO_CURRENT_VERSION) ? database.createObjectStore(InitialHeightsObtained.OBJECT_STORE_NAME, {
				
					// Key path
					"keyPath": [
					
						// Wallet type
						Database.toKeyPath(InitialHeightsObtained.DATABASE_WALLET_TYPE_NAME),
						
						// Network type
						Database.toKeyPath(InitialHeightsObtained.DATABASE_NETWORK_TYPE_NAME)
					]
					
				}) : databaseTransaction.objectStore(InitialHeightsObtained.OBJECT_STORE_NAME);
			});
		}
		
		// Get obtained
		getObtained() {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting the initial heights obtained with the wallet type and network type in the database
				return Database.getResults(InitialHeightsObtained.OBJECT_STORE_NAME, 0, 1, Database.NO_INDEX, IDBKeyRange.only([
				
					// Wallet type
					Consensus.getWalletType(),
					
					// Network type
					Consensus.getNetworkType(),
					
				])).then(function(results) {
				
					// Check if initial heights were obtained
					if(results["length"] !== 0) {
					
						// Resolve true
						resolve(true);
					}
					
					// Otherwise
					else {
					
						// Resolve false
						resolve(false);
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject("The database failed.");
				});
			});
		}
		
		// Set obtained
		setObtained() {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Save initial heights obtained for the wallet type and network type in the database
				Database.saveResults(InitialHeightsObtained.OBJECT_STORE_NAME, [{
							
					// Wallet type
					[Database.toKeyPath(InitialHeightsObtained.DATABASE_WALLET_TYPE_NAME)]: Consensus.getWalletType(),
					
					// Network type
					[Database.toKeyPath(InitialHeightsObtained.DATABASE_NETWORK_TYPE_NAME)]: Consensus.getNetworkType()
					
				}], [], Database.CREATE_NEW_TRANSACTION, Database.STRICT_DURABILITY).then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject("The database failed.");
				});
			});
		}
	
	// Private
		
		// Object store name
		static get OBJECT_STORE_NAME() {
		
			// Return object store name
			return "Initial Heights Obtained";
		}
		
		// Database wallet type name
		static get DATABASE_WALLET_TYPE_NAME() {
		
			// Return database wallet type name
			return "Wallet Type";
		}
		
		// Database network type name
		static get DATABASE_NETWORK_TYPE_NAME() {
		
			// Return database network type name
			return "Network Type";
		}
}


// Main function

// Set global object's initial heights obtained
globalThis["InitialHeightsObtained"] = InitialHeightsObtained;
