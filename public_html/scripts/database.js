// Use strict
"use strict";


// Classes

// Database class
class Database {

	// Public
	
		// Initialize
		static initialize() {
		
			// Set instance to invalid
			Database.instance = Database.INVALID;
			
			// Set object store locks
			Database.objectStoreLocks = new Set();
			
			// Set object store unlock event index
			Database.objectStoreUnlockEventIndex = 0;
			
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Try
				try {
				
					// Request database
					var databaseRequest = indexedDB.open(Database.NAME, Database.VERSION);
				}
				
				// Catch errors
				catch(error) {
				
					// Reject error
					reject("Failed to create and/or open database.");
					
					// Return
					return;
				}
				
				// Database request on error
				databaseRequest["onerror"] = function() {
				
					// Reject
					reject();
				};
				
				// Database request on upgrade needed
				databaseRequest["onupgradeneeded"] = function(event) {
				
					// Get database
					var database = event["target"]["result"];
					
					// Get database transaction
					var databaseTransaction = event["target"]["transaction"];
					
					// Get current version
					var currentVersion = event["oldVersion"];
					
					// Database on error
					database["onerror"] = function() {
				
						// Reject
						reject();
					};
					
					// Check if new databases exists
					if(typeof Database.newDatabases !== "undefined") {
					
						// Go through all new databases
						for(var i = 0; i < Database.newDatabases["length"]; ++i)
						
							// Create new database
							Database.newDatabases[i](database, currentVersion, databaseTransaction);
					}
				};
				
				// Database request on success
				databaseRequest["onsuccess"] = function(event) {
					
					// Set instance
					Database.instance = event["target"]["result"];
					
					// Check if critical initialization functions don't exist
					if(typeof Database.criticalInitializationFunctions === "undefined")
					
						// Create critical initialzation functions
						Database.criticalInitializationFunctions = [];
					
					// Run all critical initialization functions
					Promise.all(Database.criticalInitializationFunctions.map(function(criticalInitializationFunction) {
		
						// Return performing critical initialization function
						return criticalInitializationFunction();
						
					})).then(function() {
					
						// Check if initialization functions don't exist
						if(typeof Database.initializationFunctions === "undefined")
						
							// Create initialization functions
							Database.initializationFunctions = [];
					
						// Run all initialization functions
						Promise.all(Database.initializationFunctions.map(function(initializationFunction) {
			
							// Return performing initialization function
							return initializationFunction();
							
						})).then(function() {
						
							// Resolve
							resolve();
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject
							reject();
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject
						reject();
					});
				};
			});
		}
		
		// Create database
		static createDatabase(newDatabase) {
		
			// Check if new databases don't exist
			if(typeof Database.newDatabases === "undefined")
			
				// Create new databases
				Database.newDatabases = [];
			
			// Append new database to list
			Database.newDatabases.push(newDatabase);
		}
		
		// Once initialized
		static onceInitialized(initializationFunction, isCritical = false) {
		
			// Check if critical
			if(isCritical === true) {
			
				// Check if critical initialization functions don't exist
				if(typeof Database.criticalInitializationFunctions === "undefined")
				
					// Create critical initialization functions
					Database.criticalInitializationFunctions = [];
			
				// Append critical initialization function to list
				Database.criticalInitializationFunctions.push(initializationFunction);
			}
			
			// Otherwise
			else {
			
				// Check if initialization functions don't exist
				if(typeof Database.initializationFunctions === "undefined")
				
					// Create initialization functions
					Database.initializationFunctions = [];
		
				// Append initialization function to list
				Database.initializationFunctions.push(initializationFunction);
			}
		}
		
		// Create transaction
		static createTransaction(objectStoreNames, type = Database.READ_MODE, durability = Database.RELAXED_DURABILITY, autocomplete = true) {
		
			// Check if object stores names isn't an array
			if(Array.isArray(objectStoreNames) === false) {
			
				// Make object store names an array
				objectStoreNames = [objectStoreNames];
			}
			
			// Initialize locked object stores
			var lockedObjectStores = [];
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return locking all specified object stores
				return Promise.all(objectStoreNames.map(function(objectStoreName) {
				
					// Return promise
					return new Promise(function(resolve, reject) {
		
						// Check if object store is locked
						if(Database.objectStoreLocks.has(objectStoreName) === true) {
						
							// Get current unlock event index
							var index = Database.objectStoreUnlockEventIndex++;
							
							// Check if current unlock event index is at the max safe integer
							if(index === Number.MAX_SAFE_INTEGER)
							
								// Reset unlock event index
								Database.objectStoreUnlockEventIndex = 0;
						
							// Database object store unlock index event
							$(Database.instance).on(Database.OBJECT_STORE_UNLOCK_EVENT + "." + index.toFixed(), function(event, unlockedObjectStoreName) {
							
								// Check if object store is unlocked
								if(objectStoreName === unlockedObjectStoreName && Database.objectStoreLocks.has(objectStoreName) === false) {
								
									// Turn off database object store unlock index event
									$(Database.instance).off(Database.OBJECT_STORE_UNLOCK_EVENT + "." + index.toFixed());
								
									// Lock object store
									Database.objectStoreLocks.add(objectStoreName);
									
									// Append locked object store to list
									lockedObjectStores.push(objectStoreName);
									
									// Resolve
									resolve();
								}
							});
						}
						
						// Otherwise
						else {
					
							// Lock object store
							Database.objectStoreLocks.add(objectStoreName);
							
							// Append locked object store to list
							lockedObjectStores.push(objectStoreName);
							
							// Resolve
							resolve();
						}
					});
				})).then(function() {
				
					// Try
					try {
					
						// Create transaction
						var transaction = Database.instance.transaction(objectStoreNames, type, {
						
							// Durability
							"durability": durability
						});
					}
					
					// Catch errors
					catch(error) {
					
						// Go through all locked object stores
						for(var i = 0; i < lockedObjectStores["length"]; ++i) {
						
							// Get object store
							var objectStoreName = lockedObjectStores[i];
					
							// Check if object store is locked
							if(Database.objectStoreLocks.has(objectStoreName) === true) {
							
								// Unlock object store
								Database.objectStoreLocks.delete(objectStoreName);
								
								// Trigger object store unlock event
								$(Database.instance).trigger(Database.OBJECT_STORE_UNLOCK_EVENT, objectStoreName);
							}
						}
					
						// Reject
						reject();
					
						// Return
						return;
					}
					
					// Check if autocomplete
					if(autocomplete === true) {
					
						// Transaction complete, abort, or error event
						$(transaction).on("complete abort error", function() {
						
							// Unlock locked object stores
							Database.unlockObjectStores(lockedObjectStores);
						});
					}
					
					// Create database transaction
					var databaseTransaction = new DatabaseTransaction(transaction, lockedObjectStores, autocomplete);
				
					// Resolve database transaction
					resolve(databaseTransaction);
				});
			});
		}
		
		// Commit transaction
		static commitTransaction(transaction) {
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if transaction is completed
				if(transaction.isCompleted() === true) {
				
					// Check if transaction isn't autocomplete
					if(transaction.getAutocomplete() === false) {
					
						// Unlock transaction's object stores
						Database.unlockObjectStores(transaction.getObjectStoreNames());
					}
				
					// Resolve
					resolve();
				}
				
				// Otherwise check if transaction is aborted
				else if(transaction.isAborted() === true) {
				
					// Check if transaction isn't autocomplete
					if(transaction.getAutocomplete() === false) {
					
						// Unlock transaction's object stores
						Database.unlockObjectStores(transaction.getObjectStoreNames());
					}
				
					// Reject
					reject();
				}
				
				// Otherwise
				else {
				
					// Transaction on complete
					transaction.getTransaction()["oncomplete"] = function() {
					
						// Check if transaction isn't autocomplete
						if(transaction.getAutocomplete() === false) {
						
							// Unlock transaction's object stores
							Database.unlockObjectStores(transaction.getObjectStoreNames());
						}
					
						// Resolve
						resolve();
					};
					
					// Transaction on error
					transaction.getTransaction()["onerror"] = function() {
					
						// Check if transaction isn't autocomplete
						if(transaction.getAutocomplete() === false) {
						
							// Unlock transaction's object stores
							Database.unlockObjectStores(transaction.getObjectStoreNames());
						}
					
						// Reject
						reject();
					};
					
					// Transaction on abort
					transaction.getTransaction()["onabort"] = function() {
					
						// Check if transaction isn't autocomplete
						if(transaction.getAutocomplete() === false) {
						
							// Unlock transaction's object stores
							Database.unlockObjectStores(transaction.getObjectStoreNames());
						}
					
						// Reject
						reject();
					};
					
					// Try
					try {
					
						// Commit transaction
						transaction.getTransaction().commit();
					}
					
					// Catch errors
					catch(error) {
					
					}
				}
			});
		}
		
		// Cancel transaction
		static abortTransaction(transaction) {
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if transaction is aborted
				if(transaction.isAborted() === true) {
				
					// Check if transaction isn't autocomplete
					if(transaction.getAutocomplete() === false) {
					
						// Unlock transaction's object stores
						Database.unlockObjectStores(transaction.getObjectStoreNames());
					}
				
					// Resolve
					resolve();
				}
				
				// Otherwise check if transaction is completed
				else if(transaction.isCompleted() === true) {
				
					// Check if transaction isn't autocomplete
					if(transaction.getAutocomplete() === false) {
					
						// Unlock transaction's object stores
						Database.unlockObjectStores(transaction.getObjectStoreNames());
					}
				
					// Reject
					reject();
				}
				
				// Otherwise
				else {
			
					// Transaction on abort
					transaction.getTransaction()["onabort"] = function() {
					
						// Check if transaction isn't autocomplete
						if(transaction.getAutocomplete() === false) {
						
							// Unlock transaction's object stores
							Database.unlockObjectStores(transaction.getObjectStoreNames());
						}
					
						// Resolve
						resolve();
					};
					
					// Transaction on error
					transaction.getTransaction()["onerror"] = function() {
					
						// Check if transaction isn't autocomplete
						if(transaction.getAutocomplete() === false) {
						
							// Unlock transaction's object stores
							Database.unlockObjectStores(transaction.getObjectStoreNames());
						}
					
						// Reject
						reject();
					};
					
					// Transaction on complete
					transaction.getTransaction()["oncomplete"] = function() {
					
						// Check if transaction isn't autocomplete
						if(transaction.getAutocomplete() === false) {
						
							// Unlock transaction's object stores
							Database.unlockObjectStores(transaction.getObjectStoreNames());
						}
					
						// Reject
						reject();
					};
					
					// Try
					try {
					
						// Abort transaction
						transaction.getTransaction().abort();
					}
					
					// Catch errors
					catch(error) {
					
					}
				}
			});
		}
		
		// Get count
		static getCount(objectStoreName, index = Database.NO_INDEX, range = Database.NO_RANGE, transaction = Database.CREATE_NEW_TRANSACTION) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Initialize count
				var count;
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_MODE).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
							
							// Resolve count
							resolve(count);
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function(error) {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Get the object store
					var objectStore = currentTransaction.getTransaction().objectStore(objectStoreName);
					
					// Create count request to get count from the object store
					var countRequest = (index === Database.NO_INDEX) ? objectStore.count(range) : objectStore.index(index).count(range);
					
					// Count request on success
					countRequest["onsuccess"] = function(event) {
					
						// Get result
						var result = event["target"]["result"];
						
						// Get count from result
						count = result;
						
						// Check if not creating a new transaction
						if(createNewTransaction === false)
						
							// Resolve count
							resolve(count);
					};
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
	
		// Get key paths
		static getKeyPaths(objectStoreName, transaction = Database.CREATE_NEW_TRANSACTION) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Initialize key paths
				var keyPaths = [];
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_MODE).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
							
							// Resolve key paths
							resolve(keyPaths);
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Create key cursor request to read from the object store
					var keyCursorRequest = currentTransaction.getTransaction().objectStore(objectStoreName).openKeyCursor();
					
					// Key cursor request on success
					keyCursorRequest["onsuccess"] = function(event) {
					
						// Get result
						var result = event["target"]["result"];
						
						// Check if result exists
						if(result !== Database.NO_RECORDS_MATCH_CURSOR_RESULT) {
						
							// Get key path from result
							var keyPath = result["key"];
						
							// Append key path to key paths
							keyPaths.push(result["key"]);
							
							// Get next result
							result.continue();
						}
						
						// Otherwise check if not creating a new transaction
						else if(createNewTransaction === false)
						
							// Resolve key paths
							resolve(keyPaths);
					};
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// Get results
		static getResults(objectStoreName, startPosition = Database.GET_ALL_RESULTS, count = Database.GET_ALL_RESULTS, index = Database.NO_INDEX, range = Database.NO_RANGE, direction = Database.FORWARD_DIRECTION, transaction = Database.CREATE_NEW_TRANSACTION) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Check if start position or count is invalid
				if(startPosition < 0 || count < 0) {
				
					// Reject error
					reject("Invalid parameters.");
					
					// Return
					return;
				}
				
				// Initialize results
				var results = [];
				
				// Check if count is zero
				if(count === 0) {
				
					// Resolve results
					resolve(results);
					
					// Return
					return;
				}
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_MODE).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
							
							// Resolve results
							resolve(results);
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Get the object store
					var objectStore = currentTransaction.getTransaction().objectStore(objectStoreName);
					
					// Create cursor request to read from the object store
					var cursorRequest = (index === Database.NO_INDEX) ? objectStore.openKeyCursor(range, direction) : objectStore.index(index).openKeyCursor(range, direction);
					
					// Cursor request on success
					var firstResult = true;
					cursorRequest["onsuccess"] = function(event) {
					
						// Get result
						var result = event["target"]["result"];
						
						// Check if result exists
						if(result !== Database.NO_RECORDS_MATCH_CURSOR_RESULT) {
						
							// Check if at the first result
							if(firstResult === true) {
							
								// Clear first result
								firstResult = false;
								
								// Check if a start position is provided and it's not zero
								if(startPosition !== Database.GET_ALL_RESULTS && startPosition !== 0) {
							
									// Advance result to start position
									result.advance(startPosition);
									
									// Return
									return;
								}
							}
						
							// Get key path from result
							var keyPath = result["primaryKey"];
						
							// Create get request to read from the object store using the key path
							var getRequest = objectStore.get(keyPath);
							
							// Get request on success
							getRequest["onsuccess"] = function(event) {
							
								// Get request's result
								var requestsResult = event["target"]["result"];
								
								// Check if request's result exists
								if(requestsResult !== Database.NO_RECORDS_MATCH_GET_RESULT) {
								
									// Set key path in result
									requestsResult[Database.KEY_PATH_NAME] = keyPath;
									
									// Append result to results
									results.push(requestsResult);
								}
								
								// Check if not creating a new transaction, a count is provided, and it's currently at the count
								if(createNewTransaction === false && count !== Database.GET_ALL_RESULTS && count === 0)
								
									// Resolve results
									resolve(results);
							};
							
							// Check if a count isn't provided and currently not at the count
							if(count === Database.GET_ALL_RESULTS || --count > 0)
							
								// Get next result
								result.continue();
						}
						
						// Otherwise check if not creating a new transaction
						else if(createNewTransaction === false)
						
							// Resolve results
							resolve(results);
					};
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// Get result
		static getResult(objectStoreName, keyPath, transaction = Database.CREATE_NEW_TRANSACTION) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Initialize result
				var result = Database.RESULT_NOT_FOUND;
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_MODE).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
							
							// Resolve result
							resolve(result);
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Create get request to read from the object store using the key path
					var getRequest = currentTransaction.getTransaction().objectStore(objectStoreName).get(keyPath);
					
					// Get request on success
					getRequest["onsuccess"] = function(event) {
					
						// Get request's result
						var requestsResult = event["target"]["result"];
						
						// Check if request's result exists
						if(requestsResult !== Database.NO_RECORDS_MATCH_GET_RESULT) {
						
							// Set result to request's result
							result = requestsResult;
							
							// Set key path in result
							result[Database.KEY_PATH_NAME] = keyPath;
						}
						
						// Check if not creating a new transaction
						if(createNewTransaction === false)
						
							// Resolve result
							resolve(result);
					};
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// Save results
		static saveResults(objectStoreName, results, resultsKeyPaths = [], transaction = Database.CREATE_NEW_TRANSACTION, durability = Database.RELAXED_DURABILITY) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Initialize new key paths
				var newKeyPaths = [];
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_AND_WRITE_MODE, durability).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
						
							// Resolve new key paths
							resolve(newKeyPaths);
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
					
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
					
						// Reject
						reject();
					};
					
					// Get the object store
					var objectStore = currentTransaction.getTransaction().objectStore(objectStoreName);
					
					// Go through all result
					for(var i = 0, j = 0; i < results["length"]; ++i) {
					
						// Check if result includes a key path
						if(i < resultsKeyPaths["length"]) {
						
							// Create put request to write to the object store
							var putRequest = objectStore.put(results[i], resultsKeyPaths[i]);
						}
						
						// Otherwise
						else {
					
							// Create put request to write to the object store
							var putRequest = objectStore.put(results[i]);
						}
						
						// Put request on success
						putRequest["onsuccess"] = function(event) {
						
							// Get key path from result
							var keyPath = event["target"]["result"];
							
							// Appen key path to list
							newKeyPaths.push(keyPath);
						
							// Check if not creating a new transaction
							if(createNewTransaction === false) {
						
								// Check if all put requests were completed
								if(++j === results["length"])
								
									// Resolve new key paths
									resolve(newKeyPaths);
							}
						};
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// Save result
		static saveResult(objectStoreName, result, keyPath = Database.CREATE_NEW_KEY_PATH, transaction = Database.CREATE_NEW_TRANSACTION, durability = Database.RELAXED_DURABILITY) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Initialize new key path
				var newKeyPath;
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_AND_WRITE_MODE, durability).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
						
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
						
							// Resolve new key path
							resolve(newKeyPath);
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Create put request to write to the object store
					var putRequest = currentTransaction.getTransaction().objectStore(objectStoreName).put(result, keyPath);
					
					// Put request on success
					putRequest["onsuccess"] = function(event) {
						
						// Get key path from result
						var keyPath = event["target"]["result"];
						
						// Set new key path to key path
						newKeyPath = keyPath;
						
						// Check if not creating a new transaction
						if(createNewTransaction === false)
						
							// Resolve new key path
							resolve(newKeyPath);
					};
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// Delete results
		static deleteResults(objectStoreName, transaction = Database.CREATE_NEW_TRANSACTION, durability = Database.RELAXED_DURABILITY) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_AND_WRITE_MODE, durability).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
							
							// Resolve
							resolve();
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Create clear request to delete everything from the object store
					var clearRequest = currentTransaction.getTransaction().objectStore(objectStoreName).clear();
					
					// Check if not creating a new transaction
					if(createNewTransaction === false) {
					
						// Clear request on success
						clearRequest["onsuccess"] = function(event) {
						
							// Resolve
							resolve();
						};
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// Delete results with value
		static deleteResultsWithValue(objectStoreName, index, range, transaction = Database.CREATE_NEW_TRANSACTION, durability = Database.RELAXED_DURABILITY) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_AND_WRITE_MODE, durability).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
						
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
							
							// Resolve
							resolve();
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Get the object store
					var objectStore = currentTransaction.getTransaction().objectStore(objectStoreName);
					
					// Create cursor request to write to the object store
					var cursorRequest = objectStore.index(index).openCursor(range);
					
					// Cursor request on success
					cursorRequest["onsuccess"] = function(event) {
					
						// Get result
						var result = event["target"]["result"];
						
						// Check if result exists
						if(result !== Database.NO_RECORDS_MATCH_CURSOR_RESULT) {
						
							// Delete result
							result.delete();
							
							// Get next result
							result.continue();
						}
						
						// Otherwise check if not creating a new transaction
						else if(createNewTransaction === false)
						
							// Resolve
							resolve();
					};
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// Delete result
		static deleteResult(objectStoreName, keyPath, transaction = Database.CREATE_NEW_TRANSACTION, durability = Database.RELAXED_DURABILITY) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if instance is invalid
				if(Database.instance === Database.INVALID) {
				
					// Reject error
					reject("Invalid database.");
					
					// Return
					return;
				}
				
				// Get if creating a new transaction
				var createNewTransaction = transaction === Database.CREATE_NEW_TRANSACTION;
				
				// Get current transaction
				var getCurrentTransaction = new Promise(function(resolve, reject) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Return creating a transaction
						return Database.createTransaction(objectStoreName, Database.READ_AND_WRITE_MODE, durability).then(function(transaction) {
						
							// Resolve transaction
							resolve(transaction);
							
						// Catch error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve transaction
						resolve(transaction);
					}
				});
				
				// Return getting current transaction
				return getCurrentTransaction.then(function(currentTransaction) {
				
					// Check if creating a new transaction
					if(createNewTransaction === true) {
					
						// Current transaction on complete
						currentTransaction.getTransaction()["oncomplete"] = function() {
							
							// Resolve
							resolve();
						};
					}
					
					// Current transaction on error
					currentTransaction.getTransaction()["onerror"] = function() {
							
						// Reject
						reject();
					};
					
					// Current transaction on abort
					currentTransaction.getTransaction()["onabort"] = function() {
							
						// Reject
						reject();
					};
					
					// Create delete request to delete from the object store using the key path
					var deleteRequest = currentTransaction.getTransaction().objectStore(objectStoreName).delete(keyPath);
					
					// Check if not creating a new transaction
					if(createNewTransaction === false) {
					
						// Delete request on success
						deleteRequest["onsuccess"] = function(event) {
						
							// Resolve
							resolve();
						};
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject
					reject();
				});
			});
		}
		
		// To key path
		static toKeyPath(string) {
		
			// Return string as a key path
			return string.replace(Database.INVALID_KEY_PATH_PATTERN, Database.INVALID_KEY_PATH_REPLACEMENT);
		}
		
		// Result not found
		static get RESULT_NOT_FOUND() {
		
			// Return result not found
			return null;
		}
		
		// Create new key path
		static get CREATE_NEW_KEY_PATH() {
		
			// Return create new key path
			return undefined;
		}
		
		// Read mode
		static get READ_MODE() {
		
			// Return read mode
			return "readonly";
		}
		
		// Read and write mode
		static get READ_AND_WRITE_MODE() {
		
			// Return read and write mode
			return "readwrite";
		}
		
		// Key path name
		static get KEY_PATH_NAME() {
		
			// Return key path name
			return "Key Path";
		}
		
		// Get all results
		static get GET_ALL_RESULTS() {
		
			// Return get all results
			return null;
		}
		
		// No index
		static get NO_INDEX() {
		
			// Return no index
			return null;
		}
		
		// Create new transaction
		static get CREATE_NEW_TRANSACTION() {
		
			// Return create new transaction
			return null;
		}
		
		// No range
		static get NO_RANGE() {
		
			// Return no range
			return null;
		}
		
		// Forward direction
		static get FORWARD_DIRECTION() {
		
			// Return forward direction
			return "next";
		}
		
		// Backward direction
		static get BACKWARD_DIRECTION() {
		
			// Return backward direction
			return "prev";
		}
		
		// No current version
		static get NO_CURRENT_VERSION() {
		
			// Return no current version
			return 0;
		}
		
		// Relaxed durability
		static get RELAXED_DURABILITY() {
		
			// Return relaxed durability
			return "relaxed";
		}
		
		// Strict durability
		static get STRICT_DURABILITY() {
		
			// Return strict durability
			return "strict";
		}
	
	// Private
	
		// Unlock object stores
		static unlockObjectStores(objectStoreNames) {
		
			// Go through all of the object stores
			for(var i = 0; i < objectStoreNames["length"]; ++i) {
			
				// Get object store
				let objectStoreName = objectStoreNames[i];
		
				// Check if object store is locked
				if(Database.objectStoreLocks.has(objectStoreName) === true) {
				
					// Set timeout
					setTimeout(function() {
				
						// Unlock object store
						Database.objectStoreLocks.delete(objectStoreName);
						
						// Trigger object store unlock event
						$(Database.instance).trigger(Database.OBJECT_STORE_UNLOCK_EVENT, objectStoreName);
					}, 0);
				}
			}
		}
		
		// Invaid key path pattern
		static get INVALID_KEY_PATH_PATTERN() {
		
			// Return invalid key path pattern
			return /[ ']/gu;
		}
		
		// Invalid key path replacement
		static get INVALID_KEY_PATH_REPLACEMENT() {
		
			// Return invalid key path replacement
			return "";
		}
	
		// Invalid
		static get INVALID() {
		
			// Return invalid
			return null;
		}
	
		// Name
		static get NAME() {
		
			// Return name
			return "Database";
		}
		
		// Version one
		static get VERSION_ONE() {
		
			// Return version one
			return 1;
		}
		
		// Version
		static get VERSION() {
		
			// Return version
			return 2;
		}
		
		// No records match get result
		static get NO_RECORDS_MATCH_GET_RESULT() {
		
			// Return no records match get result
			return undefined;
		}
		
		// No records match cursor result
		static get NO_RECORDS_MATCH_CURSOR_RESULT() {
		
			// Return no records match cursor result
			return null;
		}
		
		// Object store unlock event
		static get OBJECT_STORE_UNLOCK_EVENT() {
		
			// Return object store unlock event
			return "DatabaseObjectStoreUnlockEvent";
		}
}


// Main function

// Set global object's database
globalThis["Database"] = Database;
