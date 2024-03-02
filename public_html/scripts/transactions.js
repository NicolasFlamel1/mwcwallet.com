// Use strict
"use strict";


// Classes

// Transactions class
class Transactions {

	// Public
	
		// Constructor
		constructor() {
		
			// Set exclusive wallet transactions locks
			this.exclusiveWalletTransactionsLocks = new Set();
			
			// Set exclusive wallet transactions lock release event index
			this.exclusiveWalletTransactionsLockReleaseEventIndex = 0;
			
			// Set exclusive wallet transactions locks priority counters
			this.exclusiveWalletTransactionsLocksPriorityCounters = {};
		
			// Create database
			Database.createDatabase(function(database, currentVersion, databaseTransaction) {
			
				// Create or get transactions object store
				var transactionsObjectStore = (currentVersion === Database.NO_CURRENT_VERSION) ? database.createObjectStore(Transactions.OBJECT_STORE_NAME, {
				
					// Auto increment
					"autoIncrement": true
				
				}) : databaseTransaction.objectStore(Transactions.OBJECT_STORE_NAME);
				
				// Check if no database version exists
				if(currentVersion === Database.NO_CURRENT_VERSION) {
			
					// Create index to search transactions object store by wallet type, network type, and commit
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_COMMIT_NAME, [
					
						// Wallet Type
						Database.toKeyPath(Transactions.DATABASE_WALLET_TYPE_NAME),
						
						// Network Type
						Database.toKeyPath(Transactions.DATABASE_NETWORK_TYPE_NAME),
						
						// Commit
						Database.toKeyPath(Transactions.DATABASE_COMMIT_NAME)
					], {
					
						// Unique
						"unique": true
					});
			
					// Create index to search transactions object store by wallet key path
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_NAME, Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME), {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet key path and height
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_AND_HEIGHT_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Height
						Database.toKeyPath(Transactions.DATABASE_HEIGHT_NAME)
					], {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet key path, received, amount released, status, and spendable height
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_SPENDABLE_HEIGHT_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Received
						Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME),
						
						// Amount released
						Database.toKeyPath(Transactions.DATABASE_AMOUNT_RELEASED_NAME),
						
						// Status
						Database.toKeyPath(Transactions.DATABASE_STATUS_NAME),
						
						// Spendable height
						Database.toKeyPath(Transactions.DATABASE_SPENDABLE_HEIGHT_NAME)
					], {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet key path, received, amount released, status, and recorded timestamp
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_RECORDED_TIMESTAMP_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Received
						Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME),
						
						// Amount released
						Database.toKeyPath(Transactions.DATABASE_AMOUNT_RELEASED_NAME),
						
						// Status
						Database.toKeyPath(Transactions.DATABASE_STATUS_NAME),
						
						// Recorded timestamp
						Database.toKeyPath(Transactions.DATABASE_RECORDED_TIMESTAMP_NAME)
					], {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet key path, received, amount released, and broadcast
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_AND_BROADCAST_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Received
						Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME),
						
						// Amount released
						Database.toKeyPath(Transactions.DATABASE_AMOUNT_RELEASED_NAME),
						
						// Broadcast
						Database.toKeyPath(Transactions.DATABASE_BROADCAST_NAME)
					], {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet key path, received, canceled, expired, broadcast, and lock height
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_CANCELED_EXPIRED_BROADCAST_AND_LOCK_HEIGHT_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Received
						Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME),
						
						// Canceled
						Database.toKeyPath(Transactions.DATABASE_CANCELED_NAME),
						
						// Expired
						Database.toKeyPath(Transactions.DATABASE_EXPIRED_NAME),
						
						// Broadcast
						Database.toKeyPath(Transactions.DATABASE_BROADCAST_NAME),
						
						// Lock height
						Database.toKeyPath(Transactions.DATABASE_LOCK_HEIGHT_NAME)
					], {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet key path, display, and recorded timestamp
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_DISPLAY_AND_RECORDED_TIMESTAMP_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Display
						Database.toKeyPath(Transactions.DATABASE_DISPLAY_NAME),
						
						// Recorded timestamp
						Database.toKeyPath(Transactions.DATABASE_RECORDED_TIMESTAMP_NAME)
					], {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet key path and ID
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_AND_ID, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// ID
						Database.toKeyPath(Transactions.DATABASE_ID_NAME)
					], {
					
						// Unique
						"unique": true
					});
					
					// Create index to search transactions object store by wallet key path, received, and kernel offset
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AND_KERNEL_OFFSET, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Received
						Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME),
						
						// Kernel offset
						Database.toKeyPath(Transactions.DATABASE_KERNEL_OFFSET_NAME)
					], {
					
						// Unique
						"unique": true
					});
					
					// Create index to search transactions object store by wallet key path, canceled, expired, broadcast, and time to live cut off height
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_CANCELED_EXPIRED_BROADCAST_AND_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Canceled
						Database.toKeyPath(Transactions.DATABASE_CANCELED_NAME),
						
						// Expired
						Database.toKeyPath(Transactions.DATABASE_EXPIRED_NAME),
						
						// Broadcast
						Database.toKeyPath(Transactions.DATABASE_BROADCAST_NAME),
						
						// Time to live cut off height
						Database.toKeyPath(Transactions.DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME)
					], {
					
						// Unique
						"unique": false
					});
					
					// Create index to search transactions object store by wallet type and network type
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, [
					
						// Wallet Type
						Database.toKeyPath(Transactions.DATABASE_WALLET_TYPE_NAME),
						
						// Network Type
						Database.toKeyPath(Transactions.DATABASE_NETWORK_TYPE_NAME)
					], {
					
						// Unique
						"unique": false
					});
				}
				
				// Check if database version is less than or equal to version one
				if(currentVersion <= Database.VERSION_ONE) {
				
					// Create index to search transactions object store by wallet key path and checked
					transactionsObjectStore.createIndex(Transactions.DATABASE_WALLET_KEY_PATH_AND_CHECKED_NAME, [
					
						// Wallet key path
						Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME),
						
						// Checked
						Database.toKeyPath(Transactions.DATABASE_CHECKED_NAME)
					], {
					
						// Unique
						"unique": false
					});
				}
			});
		}
		
		// Obtain wallet's exclusive transactions lock
		obtainWalletsExclusiveTransactionsLock(walletKeyPath, isHighPriority = true) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if wallet's exclusive transactions lock is locked
				if(self.exclusiveWalletTransactionsLocks.has(walletKeyPath) === true) {
				
					// Check if if high priority
					if(isHighPriority === true) {
				
						// Check if exclusive wallet transactions locks priority counter doesn't exist for the wallet
						if(walletKeyPath.toFixed() in self.exclusiveWalletTransactionsLocksPriorityCounters === false) {
						
							// Create exclusive wallet transactions locks priority counter for the wallet
							self.exclusiveWalletTransactionsLocksPriorityCounters[walletKeyPath.toFixed()] = 0;
						}
					
						// Increment exclusive wallet transactions locks priority counter for the wallet
						++self.exclusiveWalletTransactionsLocksPriorityCounters[walletKeyPath.toFixed()];
					}
				
					// Get current exclusive wallet transactions lock release event index
					var index = self.exclusiveWalletTransactionsLockReleaseEventIndex++;
					
					// Check if current exclusive wallet transactions lock release event index is at the max safe integer
					if(index === Number.MAX_SAFE_INTEGER)
					
						// Reset exclusive wallet transactions lock release event index
						self.exclusiveWalletTransactionsLockReleaseEventIndex = 0;
					
					// Exclusive wallet transactions lock release index event
					$(self).on(Transactions.EXCLUSIVE_WALLET_TRANSACTIONS_LOCK_RELEASE_EVENT + "." + index.toFixed(), function(event, releasedWalletKeyPath) {
					
						// Check if wallet's exclusive transactions lock isn't locked
						if(walletKeyPath === releasedWalletKeyPath && self.exclusiveWalletTransactionsLocks.has(walletKeyPath) === false) {
						
							// Turn off exclusive wallet transactions lock release index event
							$(self).off(Transactions.EXCLUSIVE_WALLET_TRANSACTIONS_LOCK_RELEASE_EVENT + "." + index.toFixed());
						
							// Lock wallet's exclusive transactions lock
							self.exclusiveWalletTransactionsLocks.add(walletKeyPath);
							
							// Check if if high priority
							if(isHighPriority === true) {
							
								// Decrement exclusive wallet transactions locks priority counter for the wallet
								--self.exclusiveWalletTransactionsLocksPriorityCounters[walletKeyPath.toFixed()];
							}
							
							// Resolve
							resolve();
						}
					});
				}
				
				// Otherwise
				else {
				
					// Lock wallet's exclusive transactions lock
					self.exclusiveWalletTransactionsLocks.add(walletKeyPath);
					
					// Resolve
					resolve();
				}
			});
		}
		
		// Release wallet's exclusive transactions lock
		releaseWalletsExclusiveTransactionsLock(walletKeyPath) {
		
			// Check if wallet's exclusive transactions lock is locked
			if(this.exclusiveWalletTransactionsLocks.has(walletKeyPath) === true) {
			
				// Set self
				var self = this;
			
				// Set timeout
				setTimeout(function() {
			
					// Unlock wallet's exclusive transactions lock
					self.exclusiveWalletTransactionsLocks.delete(walletKeyPath);
					
					// Trigger exclusive wallet transactions lock release event
					$(self).trigger(Transactions.EXCLUSIVE_WALLET_TRANSACTIONS_LOCK_RELEASE_EVENT, walletKeyPath);
				}, 0);
			}
		}
		
		// Is high priority wallet's exclusive transactions lock waiting
		isHighPriorityWalletsExclusiveTransactionsLockWaiting(walletKeyPath) {
		
			// Return if exclusive wallet transactions locks priority counter exists for the wallet and it's greater than zero
			return walletKeyPath.toFixed() in this.exclusiveWalletTransactionsLocksPriorityCounters === true && this.exclusiveWalletTransactionsLocksPriorityCounters[walletKeyPath.toFixed()] > 0;
		}
		
		// Get transactions
		getTransactions(transactionKeyPaths, transaction = Transactions.NO_TRANSACTION) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get database transaction
				var getDatabaseTransaction = new Promise(function(resolve, reject) {
				
					// Check if no transaction is provided
					if(transaction === Transactions.NO_TRANSACTION) {
					
						// Return creating a database transaction
						return Database.createTransaction(Transactions.OBJECT_STORE_NAME).then(function(databaseTransaction) {
						
							// Resolve database transaction
							resolve(databaseTransaction);
						
						// Catch errors
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
			
				// Return creating database transaction
				return getDatabaseTransaction.then(function(databaseTransaction) {
			
					// Return getting all specified transactions in the database
					return Promise.all(transactionKeyPaths.map(function(transactionKeyPath) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
					
							// Return getting specified transaction in the database
							return Database.getResult(Transactions.OBJECT_STORE_NAME, transactionKeyPath, databaseTransaction).then(function(result) {
							
								// Resolve result
								resolve(result);
								
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(Language.getDefaultTranslation('The database failed.'));
							});
						});
					
					})).then(function(results) {
					
						// Check if a transaction was provided
						if(transaction !== Transactions.NO_TRANSACTION) {
						
							// Initialize transactions
							var transactions = [];
							
							// Go through all results
							for(var i = 0; i < results["length"]; ++i) {
							
								// Check if result exists
								if(results[i] !== Database.RESULT_NOT_FOUND) {
							
									// Get transaction from result
									var currentTransaction = Transactions.getTransactionFromResult(results[i]);
								}
								
								// Otherwise
								else {
								
									// Set transaction to no transaction found
									var currentTransaction = Transactions.NO_TRANSACTION_FOUND;
								}
								
								// Append transaction to list of transactions
								transactions.push(currentTransaction);
							}
							
							// Resolve transactions
							resolve(transactions);
						}
						
						// Otherwise
						else {
					
							// Return committing the database transaction
							return Database.commitTransaction(databaseTransaction).then(function() {
						
								// Initialize transactions
								var transactions = [];
								
								// Go through all results
								for(var i = 0; i < results["length"]; ++i) {
								
									// Check if result exists
									if(results[i] !== Database.RESULT_NOT_FOUND) {
								
										// Get transaction from result
										var currentTransaction = Transactions.getTransactionFromResult(results[i]);
									}
									
									// Otherwise
									else {
									
										// Set transaction to no transaction found
										var currentTransaction = Transactions.NO_TRANSACTION_FOUND;
									}
									
									// Append transaction to list of transactions
									transactions.push(currentTransaction);
								}
								
								// Resolve transactions
								resolve(transactions);
							
							// Catch errors
							}).catch(function(error) {
							
								// Return aborting database transaction and catch errors
								return Database.abortTransaction(databaseTransaction).catch(function(error) {
								
								// Finally
								}).finally(function() {
								
									// Reject error
									reject(Language.getDefaultTranslation('The database failed.'));
								});
							});
						}
						
					// Catch errors
					}).catch(function(error) {
					
						// Check if a transaction was provided
						if(transaction !== Transactions.NO_TRANSACTION) {
						
							// Reject error
							reject(Language.getDefaultTranslation('The database failed.'));
						}
						
						// Otherwise
						else {
					
							// Return aborting database transaction and catch errors
							return Database.abortTransaction(databaseTransaction).catch(function(error) {
							
							// Finally
							}).finally(function() {
							
								// Reject error
								reject(Language.getDefaultTranslation('The database failed.'));
							});
						}
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get transaction
		getTransaction(walletType, networkType, commit) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting the transaction with the wallet type, network type, and commit in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, 0, 1, Transactions.DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_COMMIT_NAME, IDBKeyRange.only([
				
					// Wallet type
					walletType,
					
					// Network type
					networkType,
					
					// Commit
					commit
					
				])).then(function(results) {
				
					// Check if transaction exists
					if(results["length"] !== 0) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[0]);
					
						// Resolve transaction
						resolve(transaction);
					}
					
					// Otherwise
					else
					
						// Resolve no transaction found
						resolve(Transactions.NO_TRANSACTION_FOUND);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's received released transactions
		getWalletsReceivedReleasedTransactions(walletKeyPath, startPosition = Database.GET_ALL_RESULTS, count = Database.GET_ALL_RESULTS) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting all of the wallet's received, released transactions that are unspent in the database sorted by recorded timestamp in ascending order
				return Database.getResults(Transactions.OBJECT_STORE_NAME, startPosition, count, Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_RECORDED_TIMESTAMP_NAME, IDBKeyRange.bound([
				
					// Wallet key path lower bound
					walletKeyPath,
					
					// Received lower bound
					1,
					
					// Amount released lower bound
					1,
					
					// Status lower bound
					Transaction.STATUS_UNSPENT,
					
					// Recorded timestamp lower bound
					Number.NEGATIVE_INFINITY
				], [
				
					// Wallet key path upper bound
					walletKeyPath,
					
					// Received upper bound
					1,
					
					// Amount released upper bound
					1,
					
					// Status upper bound
					Transaction.STATUS_UNSPENT,
					
					// Recorded timestamp upper bound
					Number.POSITIVE_INFINITY
				
				]), Database.FORWARD_DIRECTION).then(function(results) {
				
					// Initialize transactions
					var transactions = [];
					
					// Go through all results
					for(var i = 0; i < results["length"]; ++i) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[i]);
					
						// Append transaction to list of transactions
						transactions.push(transaction);
					}
					
					// Resolve transactions
					resolve(transactions);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's unreleased sent broadcast transactions
		getWalletsUnreleasedSentBroadcastTransactions(walletKeyPath) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting all of the wallet's unreleased, sent transactions that have been broadcast in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_AND_BROADCAST_NAME, IDBKeyRange.only([
				
					// Wallet key path
					walletKeyPath,
					
					// Received
					0,
					
					// Amount released
					0,
					
					// Broadcast
					1
					
				])).then(function(results) {
				
					// Initialize transactions
					var transactions = [];
					
					// Go through all results
					for(var i = 0; i < results["length"]; ++i) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[i]);
					
						// Append transaction to list of transactions
						transactions.push(transaction);
					}
					
					// Resolve transactions
					resolve(transactions);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's unexpired sent unboradcast transactions in lock height range
		getWalletsUnexpiredSentUnbroadcastTransactionsInLockHeightRange(walletKeyPath, lowestLockHeight = Consensus.FIRST_BLOCK_HEIGHT, highestLockHeight = Number.POSITIVE_INFINITY) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting all of the wallet's not canceled, unexpired, sent transactions in the lock height range that have not been broadcast in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_CANCELED_EXPIRED_BROADCAST_AND_LOCK_HEIGHT_NAME, IDBKeyRange.bound([
				
					// Wallet key path lower bound
					walletKeyPath,
					
					// Canceled lower bound
					0,
					
					// Received lower bound
					0,
					
					// Expired lower bound
					0,
					
					// Broadcast lower bound
					0,
					
					// Lock height lower bound
					Math.max((lowestLockHeight instanceof BigNumber === true) ? lowestLockHeight.toNumber() : lowestLockHeight, Consensus.FIRST_BLOCK_HEIGHT)
				], [
				
					// Wallet key path upper bound
					walletKeyPath,
					
					// Canceled upper bound
					0,
					
					// Received upper bound
					0,
					
					// Expired upper bound
					0,
					
					// Broadcast upper bound
					0,
					
					// Lock height upper bound
					(highestLockHeight instanceof BigNumber === true) ? highestLockHeight.toNumber() : highestLockHeight
				
				])).then(function(results) {
				
					// Initialize transactions
					var transactions = [];
					
					// Go through all results
					for(var i = 0; i < results["length"]; ++i) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[i]);
					
						// Append transaction to list of transactions
						transactions.push(transaction);
					}
					
					// Resolve transactions
					resolve(transactions);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get number of wallet's display transactions
		getNumberOfWalletsDisplayTransactions(walletKeyPath, transaction = Transactions.NO_TRANSACTION) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting the count of the wallet's display transactions in the database
				return Database.getCount(Transactions.OBJECT_STORE_NAME, Transactions.DATABASE_WALLET_KEY_PATH_DISPLAY_AND_RECORDED_TIMESTAMP_NAME, IDBKeyRange.bound([
				
					// Wallet key path lower bound
					walletKeyPath,
					
					// Display lower bound
					1,
					
					// Recorded timestamp lower bound
					Number.NEGATIVE_INFINITY
				], [
				
					// Wallet key path upper bound
					walletKeyPath,
					
					// Display upper bound
					1,
					
					// Recorded timestamp upper bound
					Number.POSITIVE_INFINITY
				
				]), (transaction !== Transactions.NO_TRANSACTION) ? transaction : Database.CREATE_NEW_TRANSACTION).then(function(count) {
					
					// Resolve count
					resolve(count);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's display transactions
		getWalletsDisplayTransactions(walletKeyPath, startPosition = Database.GET_ALL_RESULTS, count = Database.GET_ALL_RESULT, transaction = Transactions.NO_TRANSACTION) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting all of the wallet's display transactions in the database sorted by recorded timestamp in descending order
				return Database.getResults(Transactions.OBJECT_STORE_NAME, startPosition, count, Transactions.DATABASE_WALLET_KEY_PATH_DISPLAY_AND_RECORDED_TIMESTAMP_NAME, IDBKeyRange.bound([
				
					// Wallet key path lower bound
					walletKeyPath,
					
					// Display lower bound
					1,
					
					// Recorded timestamp lower bound
					Number.NEGATIVE_INFINITY
				], [
				
					// Wallet key path upper bound
					walletKeyPath,
					
					// Display upper bound
					1,
					
					// Recorded timestamp upper bound
					Number.POSITIVE_INFINITY
				
				]), Database.BACKWARD_DIRECTION, (transaction !== Transactions.NO_TRANSACTION) ? transaction : Database.CREATE_NEW_TRANSACTION).then(function(results) {
				
					// Initialize transactions
					var transactions = [];
					
					// Go through all results
					for(var i = 0; i < results["length"]; ++i) {
					
						// Get transaction from result
						var currentTransaction = Transactions.getTransactionFromResult(results[i]);
					
						// Append transaction to list of transactions
						transactions.push(currentTransaction);
					}
					
					// Resolve transactions
					resolve(transactions);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's transactions in height range
		getWalletsTransactionsInHeightRange(walletKeyPath, lowestHeight = Consensus.FIRST_BLOCK_HEIGHT, highestHeight = Number.POSITIVE_INFINITY) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting all of the wallet's transactions in the height range in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_AND_HEIGHT_NAME, IDBKeyRange.bound([
				
					// Wallet key path lower bound
					walletKeyPath,
					
					// Height lower bound
					Math.max((lowestHeight instanceof BigNumber === true) ? lowestHeight.toNumber() : lowestHeight, Consensus.FIRST_BLOCK_HEIGHT)
				], [
				
					// Wallet key path upper bound
					walletKeyPath,
					
					// Height upper bound
					(highestHeight instanceof BigNumber === true) ? highestHeight.toNumber() : highestHeight
				
				])).then(function(results) {
				
					// Initialize transactions
					var transactions = [];
					
					// Go through all results
					for(var i = 0; i < results["length"]; ++i) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[i]);
					
						// Append transaction to list of transactions
						transactions.push(transaction);
					}
					
					// Resolve transactions
					resolve(transactions);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's unreleased received transactions in spendable height range
		getWalletsUnreleasedReceivedTransactionsInSpendableHeightRange(walletKeyPath, lowestSpendableHeight = Consensus.FIRST_BLOCK_HEIGHT, highestSpendableHeight = Number.POSITIVE_INFINITY) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return creating a database transaction
				return Database.createTransaction(Transactions.OBJECT_STORE_NAME).then(function(databaseTransaction) {
			
					// Return all promises
					return Promise.all([
					
						// Get all of the wallet's unreleased, received transactions that are unspent in the spendable height range in the database
						Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_SPENDABLE_HEIGHT_NAME, IDBKeyRange.bound([
					
							// Wallet key path lower bound
							walletKeyPath,
							
							// Received lower bound
							1,
							
							// Amount released lower bound
							0,
							
							// Status lower bound
							Transaction.STATUS_UNSPENT,
							
							// Spendable height lower bound
							Math.max((lowestSpendableHeight instanceof BigNumber === true) ? lowestSpendableHeight.toNumber() : lowestSpendableHeight, Consensus.FIRST_BLOCK_HEIGHT)
						], [
						
							// Wallet key path upper bound
							walletKeyPath,
							
							// Received upper bound
							1,
							
							// Amount released upper bound
							0,
							
							// Status upper bound
							Transaction.STATUS_UNSPENT,
							
							// Spendable height upper bound
							(highestSpendableHeight instanceof BigNumber === true) ? highestSpendableHeight.toNumber() : highestSpendableHeight
						
						]), Database.FORWARD_DIRECTION, databaseTransaction),
						
						// Get all of the wallet's unreleased, received transactions that are spent in the spendable height range in the database
						Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_SPENDABLE_HEIGHT_NAME, IDBKeyRange.bound([
					
							// Wallet key path lower bound
							walletKeyPath,
							
							// Received lower bound
							1,
							
							// Amount released lower bound
							0,
							
							// Status lower bound
							Transaction.STATUS_SPENT,
							
							// Spendable height lower bound
							Math.max((lowestSpendableHeight instanceof BigNumber === true) ? lowestSpendableHeight.toNumber() : lowestSpendableHeight, Consensus.FIRST_BLOCK_HEIGHT)
						], [
						
							// Wallet key path upper bound
							walletKeyPath,
							
							// Received upper bound
							1,
							
							// Amount released upper bound
							0,
							
							// Status upper bound
							Transaction.STATUS_SPENT,
							
							// Spendable height upper bound
							(highestSpendableHeight instanceof BigNumber === true) ? highestSpendableHeight.toNumber() : highestSpendableHeight
						
						]), Database.FORWARD_DIRECTION, databaseTransaction),
						
						// Get all of the wallet's unreleased, received transactions that are locked in the spendable height range in the database
						Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_SPENDABLE_HEIGHT_NAME, IDBKeyRange.bound([
					
							// Wallet key path lower bound
							walletKeyPath,
							
							// Received lower bound
							1,
							
							// Amount released lower bound
							0,
							
							// Status lower bound
							Transaction.STATUS_LOCKED,
							
							// Spendable height lower bound
							Math.max((lowestSpendableHeight instanceof BigNumber === true) ? lowestSpendableHeight.toNumber() : lowestSpendableHeight, Consensus.FIRST_BLOCK_HEIGHT)
						], [
						
							// Wallet key path upper bound
							walletKeyPath,
							
							// Received upper bound
							1,
							
							// Amount released upper bound
							0,
							
							// Status upper bound
							Transaction.STATUS_LOCKED,
							
							// Spendable height upper bound
							(highestSpendableHeight instanceof BigNumber === true) ? highestSpendableHeight.toNumber() : highestSpendableHeight
						
						]), Database.FORWARD_DIRECTION, databaseTransaction)
						
					]).then(function(results) {
					
						// Return committing the database transaction
						return Database.commitTransaction(databaseTransaction).then(function() {
					
							// Initialize transactions
							var transactions = [];
							
							// Go through all results
							for(var i = 0; i < results["length"]; ++i) {
							
								// Go through all result's transactions
								for(var j = 0; j < results[i]["length"]; ++j) {
								
									// Get transaction from result
									var transaction = Transactions.getTransactionFromResult(results[i][j]);
									
									// Append transaction to list of transactions
									transactions.push(transaction);
								}
							}
							
							// Resolve transactions
							resolve(transactions);
						
						// Catch errors
						}).catch(function(error) {
						
							// Return aborting database transaction and catch errors
							return Database.abortTransaction(databaseTransaction).catch(function(error) {
							
							// Finally
							}).finally(function() {
							
								// Reject error
								reject(Language.getDefaultTranslation('The database failed.'));
							});
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Return aborting database transaction and catch errors
						return Database.abortTransaction(databaseTransaction).catch(function(error) {
						
						// Finally
						}).finally(function() {
						
							// Reject error
							reject(Language.getDefaultTranslation('The database failed.'));
						});
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's unbroadcast transactions in time to live cut off height range
		getWalletsUnbroadcastTransactionsInTimeToLiveCutOffHeightRange(walletKeyPath, lowestTimeToLiveCutOffHeight = Consensus.FIRST_BLOCK_HEIGHT, highestTimeToLiveCutOffHeight = Number.POSITIVE_INFINITY) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting all of the wallet's not canceled, unbroadcast transactions in the time to live cut off height range that are not expired in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_CANCELED_EXPIRED_BROADCAST_AND_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME, IDBKeyRange.bound([
				
					// Wallet key path lower bound
					walletKeyPath,
					
					// Canceled lower bound
					0,
					
					// Expired lower bound
					0,
					
					// Broadcast lower bound
					0,
					
					// Time to live cut off height lower bound
					Math.max((lowestTimeToLiveCutOffHeight instanceof BigNumber === true) ? lowestTimeToLiveCutOffHeight.toNumber() : lowestTimeToLiveCutOffHeight, Consensus.FIRST_BLOCK_HEIGHT)
				], [
				
					// Wallet key path upper bound
					walletKeyPath,
					
					// Canceled upper bound
					0,
					
					// Expired upper bound
					0,
					
					// Broadcast upper bound
					0,
					
					// Time to live cut off height upper bound
					(highestTimeToLiveCutOffHeight instanceof BigNumber === true) ? highestTimeToLiveCutOffHeight.toNumber() : highestTimeToLiveCutOffHeight
				
				])).then(function(results) {
				
					// Initialize transactions
					var transactions = [];
					
					// Go through all results
					for(var i = 0; i < results["length"]; ++i) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[i]);
					
						// Append transaction to list of transactions
						transactions.push(transaction);
					}
					
					// Resolve transactions
					resolve(transactions);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's unchecked transactions
		getWalletsUncheckedTransactions(walletKeyPath) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting all of the wallet's unchecked transactions in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Transactions.DATABASE_WALLET_KEY_PATH_AND_CHECKED_NAME, IDBKeyRange.only([
				
					// Wallet key path
					walletKeyPath,
					
					// Checked
					0
					
				])).then(function(results) {
				
					// Initialize transactions
					var transactions = [];
					
					// Go through all results
					for(var i = 0; i < results["length"]; ++i) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[i]);
					
						// Append transaction to list of transactions
						transactions.push(transaction);
					}
					
					// Resolve transactions
					resolve(transactions);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's transaction with ID
		getWalletsTransactionWithId(walletKeyPath, id) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting the wallet's transaction with the ID in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, 0, 1, Transactions.DATABASE_WALLET_KEY_PATH_AND_ID, IDBKeyRange.only([
				
					// Wallet key path
					walletKeyPath,
					
					// ID
					id.getData()
					
				])).then(function(results) {
				
					// Check if transaction exists
					if(results["length"] !== 0) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[0]);
					
						// Resolve transaction
						resolve(transaction);
					}
					
					// Otherwise
					else
					
						// Resolve no transaction found
						resolve(Transactions.NO_TRANSACTION_FOUND);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get wallet's received transaction with kernel offset
		getWalletsReceivedTransactionWithKernelOffset(walletKeyPath, kernelOffset) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting the wallet's received transaction with the kernel offset in the database
				return Database.getResults(Transactions.OBJECT_STORE_NAME, 0, 1, Transactions.DATABASE_WALLET_KEY_PATH_RECEIVED_AND_KERNEL_OFFSET, IDBKeyRange.only([
				
					// Wallet key path
					walletKeyPath,
					
					// Received
					1,
					
					// Kernel offset
					kernelOffset
					
				])).then(function(results) {
				
					// Check if transaction exists
					if(results["length"] !== 0) {
					
						// Get transaction from result
						var transaction = Transactions.getTransactionFromResult(results[0]);
					
						// Resolve transaction
						resolve(transaction);
					}
					
					// Otherwise
					else
					
						// Resolve no transaction found
						resolve(Transactions.NO_TRANSACTION_FOUND);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Save transactions
		saveTransactions(transactions, transaction = Transactions.NO_TRANSACTION) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get database transaction
				var getDatabaseTransaction = new Promise(function(resolve, reject) {
				
					// Check if no transaction is provided
					if(transaction === Transactions.NO_TRANSACTION) {
					
						// Return creating a database transaction
						return Database.createTransaction([
						
							// Wallets object store
							Wallets.OBJECT_STORE_NAME,
							
							// Transactions object store
							Transactions.OBJECT_STORE_NAME
						
						], Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
						
							// Resolve database transaction
							resolve(databaseTransaction);
						
						// Catch errors
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
			
				// Return creating database transaction
				return getDatabaseTransaction.then(function(databaseTransaction) {
			
					// Return getting all wallet key paths from the database
					return Database.getKeyPaths(Wallets.OBJECT_STORE_NAME, databaseTransaction).then(function(walletKeyPaths) {
					
						// Go through all transactions
						for(var i = 0; i < transactions["length"]; ++i) {
						
							// Get current transaction
							var currentTransaction = transactions[i];
							
							// Check if current transaction's wallet doesn't exist in the database
							if(walletKeyPaths.indexOf(currentTransaction.getWalletKeyPath()) === Common.INDEX_NOT_FOUND) {
							
								// Remove current transaction from list
								transactions.splice(i--, 1);
							}
						}
						
						// Check if transactions exist
						if(transactions["length"] !== 0) {
						
							// Set pending change outputs
							var pendingChangeOutputs = typeof transactions[transactions["length"] - 1].getChangeOutputs() === "number";
				
							// Return saving transactions in the database
							return Database.saveResults(Transactions.OBJECT_STORE_NAME, transactions.slice(0, (pendingChangeOutputs === true) ? -1 : Common.NO_ARGUMENT).map(function(currentTransaction) {
							
								// Return current transaction as a result
								return {
								
									// Wallet type
									[Database.toKeyPath(Transactions.DATABASE_WALLET_TYPE_NAME)]: currentTransaction.getWalletType(),
									
									// Network type
									[Database.toKeyPath(Transactions.DATABASE_NETWORK_TYPE_NAME)]: currentTransaction.getNetworkType(),
										
									// Commit
									[Database.toKeyPath(Transactions.DATABASE_COMMIT_NAME)]: currentTransaction.getCommit(),
									
									// Wallet key path
									[Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME)]: currentTransaction.getWalletKeyPath(),
									
									// TODO Store received in the database as a boolean
									
									// Received
									[Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME)]: (currentTransaction.getReceived() === true) ? 1 : 0,
									
									// Recorded timestamp
									[Database.toKeyPath(Transactions.DATABASE_RECORDED_TIMESTAMP_NAME)]: currentTransaction.getRecordedTimestamp(),
									
									// Created timestamp
									[Database.toKeyPath(Transactions.DATABASE_CREATED_TIMESTAMP_NAME)]: currentTransaction.getCreatedTimestamp(),
									
									// TODO Store height in the database as a BigInt
									
									// Height
									[Database.toKeyPath(Transactions.DATABASE_HEIGHT_NAME)]: (currentTransaction.getHeight() !== Transaction.UNKNOWN_HEIGHT) ? currentTransaction.getHeight().toNumber() : Transaction.UNKNOWN_HEIGHT,
									
									// Lock height
									[Database.toKeyPath(Transactions.DATABASE_LOCK_HEIGHT_NAME)]: (currentTransaction.getLockHeight() !== Transaction.UNKNOWN_LOCK_HEIGHT && currentTransaction.getLockHeight() !== Transaction.NO_LOCK_HEIGHT) ? currentTransaction.getLockHeight().toNumber() : currentTransaction.getLockHeight(),
									
									// Is coinbase
									[Database.toKeyPath(Transactions.DATABASE_IS_COINBASE_NAME)]: currentTransaction.getIsCoinbase(),
									
									// Status
									[Database.toKeyPath(Transactions.DATABASE_STATUS_NAME)]: currentTransaction.getStatus(),
									
									// Amount
									[Database.toKeyPath(Transactions.DATABASE_AMOUNT_NAME)]: currentTransaction.getAmount().toFixed(),
									
									// TODO Store amount release in the database as a boolean
									
									// Amount released
									[Database.toKeyPath(Transactions.DATABASE_AMOUNT_RELEASED_NAME)]: (currentTransaction.getAmountReleased() === true) ? 1 : 0,
									
									// Kernel excess
									[Database.toKeyPath(Transactions.DATABASE_KERNEL_EXCESS_NAME)]: currentTransaction.getKernelExcess(),
									
									// Identifier
									[Database.toKeyPath(Transactions.DATABASE_IDENTIFIER_NAME)]: (currentTransaction.getIdentifier() !== Transaction.UNKNOWN_IDENTIFIER) ? currentTransaction.getIdentifier().getValue() : Transaction.UNKNOWN_IDENTIFIER,
									
									// Switch type
									[Database.toKeyPath(Transactions.DATABASE_SWITCH_TYPE_NAME)]: currentTransaction.getSwitchType(),
									
									// TODO Store display in the database as a boolean
									
									// Display
									[Database.toKeyPath(Transactions.DATABASE_DISPLAY_NAME)]: (currentTransaction.getDisplay() === true) ? 1 : 0,
									
									// Kernel offset
									[Database.toKeyPath(Transactions.DATABASE_KERNEL_OFFSET_NAME)]: currentTransaction.getKernelOffset(),
									
									// ID
									[Database.toKeyPath(Transactions.DATABASE_ID_NAME)]: (currentTransaction.getId() !== Transaction.UNKNOWN_ID && currentTransaction.getId() !== Transaction.UNUSED_ID) ? currentTransaction.getId().getData() : currentTransaction.getId(),
									
									// Message
									[Database.toKeyPath(Transactions.DATABASE_MESSAGE_NAME)]: currentTransaction.getMessage(),
									
									// TODO Store time to live cut off height in the database as a BigInt
									
									// Time to live cut off height
									[Database.toKeyPath(Transactions.DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME)]: (currentTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && currentTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT) ? currentTransaction.getTimeToLiveCutOffHeight().toNumber() : currentTransaction.getTimeToLiveCutOffHeight(),
									
									// TODO Store expired in the database as a boolean
									
									// Expired
									[Database.toKeyPath(Transactions.DATABASE_EXPIRED_NAME)]: (currentTransaction.getExpired() === true) ? 1 : 0,
									
									// Confirmed timestamp
									[Database.toKeyPath(Transactions.DATABASE_CONFIRMED_TIMESTAMP_NAME)]: currentTransaction.getConfirmedTimestamp(),
									
									// Fee
									[Database.toKeyPath(Transactions.DATABASE_FEE_NAME)]: (currentTransaction.getFee() !== Transaction.UNKNOWN_FEE && currentTransaction.getFee() !== Transaction.NO_FEE) ? currentTransaction.getFee().toFixed() : currentTransaction.getFee(),
									
									// Sender address
									[Database.toKeyPath(Transactions.DATABASE_SENDER_ADDRESS_NAME)]: currentTransaction.getSenderAddress(),
										
									// Receiver address
									[Database.toKeyPath(Transactions.DATABASE_RECEIVER_ADDRESS_NAME)]: currentTransaction.getReceiverAddress(),
									
									// Receiver signature
									[Database.toKeyPath(Transactions.DATABASE_RECEIVER_SIGNATURE_NAME)]: currentTransaction.getReceiverSignature(),
									
									// Destination
									[Database.toKeyPath(Transactions.DATABASE_DESTINATION_NAME)]: currentTransaction.getDestination(),
									
									// TODO Store spendable height in the database as a BigInt
									
									// Spendable height
									[Database.toKeyPath(Transactions.DATABASE_SPENDABLE_HEIGHT_NAME)]: (currentTransaction.getSpendableHeight() !== Transaction.UNKNOWN_SPENDABLE_HEIGHT) ? currentTransaction.getSpendableHeight().toNumber() : Transaction.UNKNOWN_SPENDABLE_HEIGHT,
									
									// Required number of confirmations
									[Database.toKeyPath(Transactions.DATABASE_REQUIRED_NUMBER_OF_CONFIRMATIONS_NAME)]: (currentTransaction.getRequiredNumberOfConfirmations() !== Transaction.UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS) ? currentTransaction.getRequiredNumberOfConfirmations().toFixed() : Transaction.UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS,
									
									// Spent outputs
									[Database.toKeyPath(Transactions.DATABASE_SPENT_OUTPUTS_NAME)]: currentTransaction.getSpentOutputs(),
									
									// Change outputs
									[Database.toKeyPath(Transactions.DATABASE_CHANGE_OUTPUTS_NAME)]: currentTransaction.getChangeOutputs(),
									
									// TODO Store broadcast in the database as a boolean
									
									// Broadcast
									[Database.toKeyPath(Transactions.DATABASE_BROADCAST_NAME)]: (currentTransaction.getBroadcast() === true) ? 1 : 0,
									
									// Rebroadcast message
									[Database.toKeyPath(Transactions.DATABASE_REBROADCAST_MESSAGE_NAME)]: currentTransaction.getRebroadcastMessage(),
									
									// File response
									[Database.toKeyPath(Transactions.DATABASE_FILE_RESPONSE_NAME)]: currentTransaction.getFileResponse(),
									
									// Prices when recorded
									[Database.toKeyPath(Transactions.DATABASE_PRICES_WHEN_RECORDED_NAME)]: (currentTransaction.getPricesWhenRecorded() !== Transaction.UNKNOWN_PRICES_WHEN_RECORDED && currentTransaction.getPricesWhenRecorded() !== Transaction.UNUSED_PRICES_WHEN_RECORDED) ? JSONBigNumber.stringify(currentTransaction.getPricesWhenRecorded()) : currentTransaction.getPricesWhenRecorded(),
									
									// TODO Store checked in the database as a boolean
									
									// Checked
									[Database.toKeyPath(Transactions.DATABASE_CHECKED_NAME)]: (currentTransaction.getChecked() === true) ? 1 : 0,
									
									// TODO Store canceled in the database as a boolean
									
									// Canceled
									[Database.toKeyPath(Transactions.DATABASE_CANCELED_NAME)]: (currentTransaction.getCanceled() === true) ? 1 : 0
								};
							
							}), transactions.map(function(currentTransaction) {
							
								// Return current transaction key path
								return (currentTransaction.getKeyPath() === Transaction.NO_KEY_PATH) ? Database.CREATE_NEW_KEY_PATH : currentTransaction.getKeyPath();
							
							}), databaseTransaction, Database.STRICT_DURABILITY).then(function(keyPaths) {
							
								// Go through all key paths
								for(var i = 0; i < keyPaths["length"]; ++i) {
								
									// Set transaction's key path
									transactions[i].setKeyPath(keyPaths[i]);
								}
							
								// Check if pending change outputs
								if(pendingChangeOutputs === true) {
								
									// Get spent transaction
									var spentTransaction = transactions[transactions["length"] - 1];
									
									// Set spent transaction's change outputs
									spentTransaction.setChangeOutputs(keyPaths.slice(-spentTransaction.getChangeOutputs()));
									
									// Return saving spent transaction
									return Database.saveResult(Transactions.OBJECT_STORE_NAME, {
								
										// Wallet type
										[Database.toKeyPath(Transactions.DATABASE_WALLET_TYPE_NAME)]: spentTransaction.getWalletType(),
										
										// Network type
										[Database.toKeyPath(Transactions.DATABASE_NETWORK_TYPE_NAME)]: spentTransaction.getNetworkType(),
											
										// Commit
										[Database.toKeyPath(Transactions.DATABASE_COMMIT_NAME)]: spentTransaction.getCommit(),
										
										// Wallet key path
										[Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME)]: spentTransaction.getWalletKeyPath(),
										
										// TODO Store received in the database as a boolean
										
										// Received
										[Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME)]: (spentTransaction.getReceived() === true) ? 1 : 0,
										
										// Recorded timestamp
										[Database.toKeyPath(Transactions.DATABASE_RECORDED_TIMESTAMP_NAME)]: spentTransaction.getRecordedTimestamp(),
										
										// Created timestamp
										[Database.toKeyPath(Transactions.DATABASE_CREATED_TIMESTAMP_NAME)]: spentTransaction.getCreatedTimestamp(),
										
										// TODO Store height in the database as a BigInt
										
										// Height
										[Database.toKeyPath(Transactions.DATABASE_HEIGHT_NAME)]: (spentTransaction.getHeight() !== Transaction.UNKNOWN_HEIGHT) ? spentTransaction.getHeight().toNumber() : Transaction.UNKNOWN_HEIGHT,
										
										// Lock height
										[Database.toKeyPath(Transactions.DATABASE_LOCK_HEIGHT_NAME)]: (spentTransaction.getLockHeight() !== Transaction.UNKNOWN_LOCK_HEIGHT && spentTransaction.getLockHeight() !== Transaction.NO_LOCK_HEIGHT) ? spentTransaction.getLockHeight().toNumber() : spentTransaction.getLockHeight(),
										
										// Is coinbase
										[Database.toKeyPath(Transactions.DATABASE_IS_COINBASE_NAME)]: spentTransaction.getIsCoinbase(),
										
										// Status
										[Database.toKeyPath(Transactions.DATABASE_STATUS_NAME)]: spentTransaction.getStatus(),
										
										// Amount
										[Database.toKeyPath(Transactions.DATABASE_AMOUNT_NAME)]: spentTransaction.getAmount().toFixed(),
										
										// TODO Store amount release in the database as a boolean
										
										// Amount released
										[Database.toKeyPath(Transactions.DATABASE_AMOUNT_RELEASED_NAME)]: (spentTransaction.getAmountReleased() === true) ? 1 : 0,
										
										// Kernel excess
										[Database.toKeyPath(Transactions.DATABASE_KERNEL_EXCESS_NAME)]: spentTransaction.getKernelExcess(),
										
										// Identifier
										[Database.toKeyPath(Transactions.DATABASE_IDENTIFIER_NAME)]: (spentTransaction.getIdentifier() !== Transaction.UNKNOWN_IDENTIFIER) ? spentTransaction.getIdentifier().getValue() : Transaction.UNKNOWN_IDENTIFIER,
										
										// Switch type
										[Database.toKeyPath(Transactions.DATABASE_SWITCH_TYPE_NAME)]: spentTransaction.getSwitchType(),
										
										// TODO Store display in the database as a boolean
										
										// Display
										[Database.toKeyPath(Transactions.DATABASE_DISPLAY_NAME)]: (spentTransaction.getDisplay() === true) ? 1 : 0,
										
										// Kernel offset
										[Database.toKeyPath(Transactions.DATABASE_KERNEL_OFFSET_NAME)]: spentTransaction.getKernelOffset(),
										
										// ID
										[Database.toKeyPath(Transactions.DATABASE_ID_NAME)]: (spentTransaction.getId() !== Transaction.UNKNOWN_ID && spentTransaction.getId() !== Transaction.UNUSED_ID) ? spentTransaction.getId().getData() : spentTransaction.getId(),
										
										// Message
										[Database.toKeyPath(Transactions.DATABASE_MESSAGE_NAME)]: spentTransaction.getMessage(),
										
										// TODO Store time to live cut off height in the database as a BigInt
										
										// Time to live cut off height
										[Database.toKeyPath(Transactions.DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME)]: (spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT) ? spentTransaction.getTimeToLiveCutOffHeight().toNumber() : spentTransaction.getTimeToLiveCutOffHeight(),
										
										// TODO Store expired in the database as a boolean
										
										// Expired
										[Database.toKeyPath(Transactions.DATABASE_EXPIRED_NAME)]: (spentTransaction.getExpired() === true) ? 1 : 0,
										
										// Confirmed timestamp
										[Database.toKeyPath(Transactions.DATABASE_CONFIRMED_TIMESTAMP_NAME)]: spentTransaction.getConfirmedTimestamp(),
										
										// Fee
										[Database.toKeyPath(Transactions.DATABASE_FEE_NAME)]: (spentTransaction.getFee() !== Transaction.UNKNOWN_FEE && spentTransaction.getFee() !== Transaction.NO_FEE) ? spentTransaction.getFee().toFixed() : spentTransaction.getFee(),
										
										// Sender address
										[Database.toKeyPath(Transactions.DATABASE_SENDER_ADDRESS_NAME)]: spentTransaction.getSenderAddress(),
											
										// Receiver address
										[Database.toKeyPath(Transactions.DATABASE_RECEIVER_ADDRESS_NAME)]: spentTransaction.getReceiverAddress(),
										
										// Receiver signature
										[Database.toKeyPath(Transactions.DATABASE_RECEIVER_SIGNATURE_NAME)]: spentTransaction.getReceiverSignature(),
										
										// Destination
										[Database.toKeyPath(Transactions.DATABASE_DESTINATION_NAME)]: spentTransaction.getDestination(),
										
										// TODO Store spendable height in the database as a BigInt
										
										// Spendable height
										[Database.toKeyPath(Transactions.DATABASE_SPENDABLE_HEIGHT_NAME)]: (spentTransaction.getSpendableHeight() !== Transaction.UNKNOWN_SPENDABLE_HEIGHT) ? spentTransaction.getSpendableHeight().toNumber() : Transaction.UNKNOWN_SPENDABLE_HEIGHT,
										
										// Required number of confirmations
										[Database.toKeyPath(Transactions.DATABASE_REQUIRED_NUMBER_OF_CONFIRMATIONS_NAME)]: (spentTransaction.getRequiredNumberOfConfirmations() !== Transaction.UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS) ? spentTransaction.getRequiredNumberOfConfirmations().toFixed() : Transaction.UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS,
										
										// Spent outputs
										[Database.toKeyPath(Transactions.DATABASE_SPENT_OUTPUTS_NAME)]: spentTransaction.getSpentOutputs(),
										
										// Change outputs
										[Database.toKeyPath(Transactions.DATABASE_CHANGE_OUTPUTS_NAME)]: spentTransaction.getChangeOutputs(),
										
										// TODO Store broadcast in the database as a boolean
									
										// Broadcast
										[Database.toKeyPath(Transactions.DATABASE_BROADCAST_NAME)]: (spentTransaction.getBroadcast() === true) ? 1 : 0,
										
										// Rebroadcast message
										[Database.toKeyPath(Transactions.DATABASE_REBROADCAST_MESSAGE_NAME)]: spentTransaction.getRebroadcastMessage(),
										
										// File response
										[Database.toKeyPath(Transactions.DATABASE_FILE_RESPONSE_NAME)]: spentTransaction.getFileResponse(),
										
										// Prices when recorded
										[Database.toKeyPath(Transactions.DATABASE_PRICES_WHEN_RECORDED_NAME)]: (spentTransaction.getPricesWhenRecorded() !== Transaction.UNKNOWN_PRICES_WHEN_RECORDED && spentTransaction.getPricesWhenRecorded() !== Transaction.UNUSED_PRICES_WHEN_RECORDED) ? JSONBigNumber.stringify(spentTransaction.getPricesWhenRecorded()) : spentTransaction.getPricesWhenRecorded(),
										
										// TODO Store checked in the database as a boolean
									
										// Checked
										[Database.toKeyPath(Transactions.DATABASE_CHECKED_NAME)]: (spentTransaction.getChecked() === true) ? 1 : 0,
										
										// TODO Store canceled in the database as a boolean
									
										// Canceled
										[Database.toKeyPath(Transactions.DATABASE_CANCELED_NAME)]: (spentTransaction.getCanceled() === true) ? 1 : 0
									
									}, (spentTransaction.getKeyPath() === Transaction.NO_KEY_PATH) ? Database.CREATE_NEW_KEY_PATH : spentTransaction.getKeyPath(), databaseTransaction, Database.STRICT_DURABILITY).then(function(keyPath) {
									
										// Set spent transaction's key path
										spentTransaction.setKeyPath(keyPath);
									
										// Check if a transaction was provided
										if(transaction !== Transactions.NO_TRANSACTION) {
										
											// Resolve
											resolve();
										}
										
										// Otherwise
										else {
									
											// Return committing database transaction
											return Database.commitTransaction(databaseTransaction).then(function() {
											
												// Trigger change event
												$(self).trigger(Transactions.CHANGE_EVENT, [
												
													// Transactions
													transactions
												]);
												
												// Resolve
												resolve();
											
											// Catch errors
											}).catch(function(error) {
											
												// Return aborting database transaction
												return Database.abortTransaction(databaseTransaction).then(function() {
												
													// Reject error
													reject(Language.getDefaultTranslation('The database failed.'));
												
												// Catch errors
												}).catch(function(error) {
												
													// Trigger a fatal error
													new FatalError(FatalError.DATABASE_ERROR);
												});
											});
										}
										
									// Catch errors
									}).catch(function(error) {
									
										// Check if a transaction was provided
										if(transaction !== Transactions.NO_TRANSACTION) {
										
											// Reject error
											reject(Language.getDefaultTranslation('The database failed.'));
										}
										
										// Otherwise
										else {
									
											// Return aborting database transaction
											return Database.abortTransaction(databaseTransaction).then(function() {
											
												// Reject error
												reject(Language.getDefaultTranslation('The database failed.'));
											
											// Catch errors
											}).catch(function(error) {
											
												// Trigger a fatal error
												new FatalError(FatalError.DATABASE_ERROR);
											});
										}
									});
								}
								
								// Otherwise
								else {
							
									// Check if a transaction was provided
									if(transaction !== Transactions.NO_TRANSACTION) {
									
										// Resolve
										resolve();
									}
									
									// Otherwise
									else {
								
										// Return committing database transaction
										return Database.commitTransaction(databaseTransaction).then(function() {
										
											// Trigger change event
											$(self).trigger(Transactions.CHANGE_EVENT, [
											
												// Transactions
												transactions
											]);
											
											// Resolve
											resolve();
										
										// Catch errors
										}).catch(function(error) {
										
											// Return aborting database transaction
											return Database.abortTransaction(databaseTransaction).then(function() {
											
												// Reject error
												reject(Language.getDefaultTranslation('The database failed.'));
											
											// Catch errors
											}).catch(function(error) {
											
												// Trigger a fatal error
												new FatalError(FatalError.DATABASE_ERROR);
											});
										});
									}
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Check if a transaction was provided
								if(transaction !== Transactions.NO_TRANSACTION) {
								
									// Reject error
									reject(Language.getDefaultTranslation('The database failed.'));
								}
								
								// Otherwise
								else {
							
									// Return aborting database transaction
									return Database.abortTransaction(databaseTransaction).then(function() {
									
										// Reject error
										reject(Language.getDefaultTranslation('The database failed.'));
									
									// Catch errors
									}).catch(function(error) {
									
										// Trigger a fatal error
										new FatalError(FatalError.DATABASE_ERROR);
									});
								}
							});
						}
						
						// Otherwise
						else {
						
							// Check if a transaction was provided
							if(transaction !== Transactions.NO_TRANSACTION) {
							
								// Resolve
								resolve();
							}
							
							// Otherwise
							else {
						
								// Return committing database transaction
								return Database.commitTransaction(databaseTransaction).then(function() {
								
									// Resolve
									resolve();
								
								// Catch errors
								}).catch(function(error) {
								
									// Return aborting database transaction
									return Database.abortTransaction(databaseTransaction).then(function() {
									
										// Reject error
										reject(Language.getDefaultTranslation('The database failed.'));
									
									// Catch errors
									}).catch(function(error) {
									
										// Trigger a fatal error
										new FatalError(FatalError.DATABASE_ERROR);
									});
								});
							}
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Check if a transaction was provided
						if(transaction !== Transactions.NO_TRANSACTION) {
						
							// Reject error
							reject(Language.getDefaultTranslation('The database failed.'));
						}
						
						// Otherwise
						else {
					
							// Return aborting database transaction
							return Database.abortTransaction(databaseTransaction).then(function() {
							
								// Reject error
								reject(Language.getDefaultTranslation('The database failed.'));
							
							// Catch errors
							}).catch(function(error) {
							
								// Trigger a fatal error
								new FatalError(FatalError.DATABASE_ERROR);
							});
						}
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Delete all transactions
		deleteAllTransactions(walletType, networkType, transaction = Transactions.NO_TRANSACTION) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return deleting all transactions with the wallet type and network type in the database
				return Database.deleteResultsWithValue(Transactions.OBJECT_STORE_NAME, Transactions.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
				
					// Wallet type
					walletType,
					
					// Network type
					networkType
					
				]), (transaction !== Transactions.NO_TRANSACTION) ? transaction : Database.CREATE_NEW_TRANSACTION, Database.STRICT_DURABILITY).then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Delete wallet's transactions
		deleteWalletsTransactions(walletKeyPath, transaction = Transactions.NO_TRANSACTION) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return deleting all of the wallet's transactions in the database
				return Database.deleteResultsWithValue(Transactions.OBJECT_STORE_NAME, Transactions.DATABASE_WALLET_KEY_PATH_NAME, walletKeyPath, (transaction !== Transactions.NO_TRANSACTION) ? transaction : Database.CREATE_NEW_TRANSACTION, Database.STRICT_DURABILITY).then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// No transaction found
		static get NO_TRANSACTION_FOUND() {
		
			// Return no transaction found
			return null;
		}
		
		// Change event
		static get CHANGE_EVENT() {
		
			// Return change event
			return "TransactionsChangeEvent";
		}
	
	// Private
	
		// Get transaction from result
		static getTransactionFromResult(result) {
		
			// Return transaction from result
			return new Transaction(
			
				// Wallet type
				result[Database.toKeyPath(Transactions.DATABASE_WALLET_TYPE_NAME)],
				
				// Network type
				result[Database.toKeyPath(Transactions.DATABASE_NETWORK_TYPE_NAME)],
			
				// Commit
				result[Database.toKeyPath(Transactions.DATABASE_COMMIT_NAME)],
				
				// Wallet key path
				result[Database.toKeyPath(Transactions.DATABASE_WALLET_KEY_PATH_NAME)],
				
				// Received
				(result[Database.toKeyPath(Transactions.DATABASE_RECEIVED_NAME)] === 1) ? true : false,
				
				// Recorded timestamp
				result[Database.toKeyPath(Transactions.DATABASE_RECORDED_TIMESTAMP_NAME)],
				
				// Created timestamp
				result[Database.toKeyPath(Transactions.DATABASE_CREATED_TIMESTAMP_NAME)],
				
				// Height
				(result[Database.toKeyPath(Transactions.DATABASE_HEIGHT_NAME)] !== Transaction.UNKNOWN_HEIGHT) ? new BigNumber(result[Database.toKeyPath(Transactions.DATABASE_HEIGHT_NAME)]) : Transaction.UNKNOWN_HEIGHT,
				
				// Lock height
				(result[Database.toKeyPath(Transactions.DATABASE_LOCK_HEIGHT_NAME)] !== Transaction.UNKNOWN_LOCK_HEIGHT && result[Database.toKeyPath(Transactions.DATABASE_LOCK_HEIGHT_NAME)] !== Transaction.NO_LOCK_HEIGHT) ? new BigNumber(result[Database.toKeyPath(Transactions.DATABASE_LOCK_HEIGHT_NAME)]) : result[Database.toKeyPath(Transactions.DATABASE_LOCK_HEIGHT_NAME)],
				
				// Is coinbase
				result[Database.toKeyPath(Transactions.DATABASE_IS_COINBASE_NAME)],
				
				// Status
				result[Database.toKeyPath(Transactions.DATABASE_STATUS_NAME)],
				
				// Amount
				new BigNumber(result[Database.toKeyPath(Transactions.DATABASE_AMOUNT_NAME)]),
				
				// Amount released
				(result[Database.toKeyPath(Transactions.DATABASE_AMOUNT_RELEASED_NAME)] === 1) ? true : false,
				
				// Kernel excess
				result[Database.toKeyPath(Transactions.DATABASE_KERNEL_EXCESS_NAME)],
				
				// Identifier
				(result[Database.toKeyPath(Transactions.DATABASE_IDENTIFIER_NAME)] !== Transaction.UNKNOWN_IDENTIFIER) ? new Identifier(Common.toHexString(result[Database.toKeyPath(Transactions.DATABASE_IDENTIFIER_NAME)])) : Transaction.UNKNOWN_IDENTIFIER,
				
				// Switch type
				result[Database.toKeyPath(Transactions.DATABASE_SWITCH_TYPE_NAME)],
				
				// Display
				(result[Database.toKeyPath(Transactions.DATABASE_DISPLAY_NAME)] === 1) ? true : false,
				
				// Kernel offset
				result[Database.toKeyPath(Transactions.DATABASE_KERNEL_OFFSET_NAME)],
				
				// ID
				(result[Database.toKeyPath(Transactions.DATABASE_ID_NAME)] !== Transaction.UNKNOWN_ID && result[Database.toKeyPath(Transactions.DATABASE_ID_NAME)] !== Transaction.UNUSED_ID) ? new Uuid(Uuid.serializeData(result[Database.toKeyPath(Transactions.DATABASE_ID_NAME)])) : result[Database.toKeyPath(Transactions.DATABASE_ID_NAME)],
				
				// Message
				result[Database.toKeyPath(Transactions.DATABASE_MESSAGE_NAME)],
				
				// Time to live cut off height
				(result[Database.toKeyPath(Transactions.DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME)] !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && result[Database.toKeyPath(Transactions.DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME)] !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT) ? new BigNumber(result[Database.toKeyPath(Transactions.DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME)]) : result[Database.toKeyPath(Transactions.DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME)],
				
				// Expired
				(result[Database.toKeyPath(Transactions.DATABASE_EXPIRED_NAME)] === 1) ? true : false,
				
				// Confirmed timestamp
				result[Database.toKeyPath(Transactions.DATABASE_CONFIRMED_TIMESTAMP_NAME)],
				
				// Fee
				(result[Database.toKeyPath(Transactions.DATABASE_FEE_NAME)] !== Transaction.UNKNOWN_FEE && result[Database.toKeyPath(Transactions.DATABASE_FEE_NAME)] !== Transaction.NO_FEE) ? new BigNumber(result[Database.toKeyPath(Transactions.DATABASE_FEE_NAME)]) : result[Database.toKeyPath(Transactions.DATABASE_FEE_NAME)],
				
				// Sender address
				result[Database.toKeyPath(Transactions.DATABASE_SENDER_ADDRESS_NAME)],
				
				// Receiver address
				result[Database.toKeyPath(Transactions.DATABASE_RECEIVER_ADDRESS_NAME)],
				
				// Receiver signature
				result[Database.toKeyPath(Transactions.DATABASE_RECEIVER_SIGNATURE_NAME)],
				
				// Destination
				result[Database.toKeyPath(Transactions.DATABASE_DESTINATION_NAME)],
				
				// Spendable height
				(result[Database.toKeyPath(Transactions.DATABASE_SPENDABLE_HEIGHT_NAME)] !== Transaction.UNKNOWN_SPENDABLE_HEIGHT) ? new BigNumber(result[Database.toKeyPath(Transactions.DATABASE_SPENDABLE_HEIGHT_NAME)]) : Transaction.UNKNOWN_SPENDABLE_HEIGHT,
				
				// Required number of confirmations
				(result[Database.toKeyPath(Transactions.DATABASE_REQUIRED_NUMBER_OF_CONFIRMATIONS_NAME)] !== Transaction.UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS) ? new BigNumber(result[Database.toKeyPath(Transactions.DATABASE_REQUIRED_NUMBER_OF_CONFIRMATIONS_NAME)]) : Transaction.UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS,
				
				// Spent outputs
				result[Database.toKeyPath(Transactions.DATABASE_SPENT_OUTPUTS_NAME)],
				
				// Change outputs
				result[Database.toKeyPath(Transactions.DATABASE_CHANGE_OUTPUTS_NAME)],
				
				// Broadcast
				(result[Database.toKeyPath(Transactions.DATABASE_BROADCAST_NAME)] === 1) ? true : false,
				
				// Rebroadcast message
				result[Database.toKeyPath(Transactions.DATABASE_REBROADCAST_MESSAGE_NAME)],
				
				// File response
				result[Database.toKeyPath(Transactions.DATABASE_FILE_RESPONSE_NAME)],
				
				// Prices when recorded
				(Database.toKeyPath(Transactions.DATABASE_PRICES_WHEN_RECORDED_NAME) in result === true) ? ((result[Database.toKeyPath(Transactions.DATABASE_PRICES_WHEN_RECORDED_NAME)] !== Transaction.UNKNOWN_PRICES_WHEN_RECORDED && result[Database.toKeyPath(Transactions.DATABASE_PRICES_WHEN_RECORDED_NAME)] !== Transaction.UNUSED_PRICES_WHEN_RECORDED) ? JSONBigNumber.parse(result[Database.toKeyPath(Transactions.DATABASE_PRICES_WHEN_RECORDED_NAME)]) : result[Database.toKeyPath(Transactions.DATABASE_PRICES_WHEN_RECORDED_NAME)]) : Transaction.UNKNOWN_PRICES_WHEN_RECORDED,
				
				// Checked
				(Database.toKeyPath(Transactions.DATABASE_CHECKED_NAME) in result === false || result[Database.toKeyPath(Transactions.DATABASE_CHECKED_NAME)] === 1) ? true : false,
				
				// Canceled
				(result[Database.toKeyPath(Transactions.DATABASE_CANCELED_NAME)] === 1) ? true : false,
				
				// Key path
				result[Database.KEY_PATH_NAME]
			);
		}
		
		// Object store name
		static get OBJECT_STORE_NAME() {
		
			// Return object store name
			return "Transactions";
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
		
		// Database commit name
		static get DATABASE_COMMIT_NAME() {
		
			// Return database commit name
			return "Commit";
		}
		
		// Database wallet key path name
		static get DATABASE_WALLET_KEY_PATH_NAME() {
		
			// Return database wallet key path name
			return "Wallet Key Path";
		}
		
		// Database received name
		static get DATABASE_RECEIVED_NAME() {
		
			// Return database received name
			return "Received";
		}
		
		// Database recorded timestamp name
		static get DATABASE_RECORDED_TIMESTAMP_NAME() {
		
			// Return database recorded timestamp name
			return "Recorded Timestamp";
		}
		
		// Database created timestamp name
		static get DATABASE_CREATED_TIMESTAMP_NAME() {
		
			// Return database created timestamp name
			return "Created Timestamp";
		}
		
		// Database height name
		static get DATABASE_HEIGHT_NAME() {
		
			// Return database height name
			return "Height";
		}
		
		// Database lock height name
		static get DATABASE_LOCK_HEIGHT_NAME() {
		
			// Return database lock height name
			return "Lock Height";
		}
		
		// Database is coinbase name
		static get DATABASE_IS_COINBASE_NAME() {
		
			// Return database is coinbase name
			return "Is Coinbase";
		}
		
		// Database status name
		static get DATABASE_STATUS_NAME() {
		
			// Return database status name
			return "Status";
		}
		
		// Database amount name
		static get DATABASE_AMOUNT_NAME() {
		
			// Return database amount name
			return "Amount";
		}
		
		// Database amount releasedname
		static get DATABASE_AMOUNT_RELEASED_NAME() {
		
			// Return database amount released name
			return "Amount Released";
		}
		
		// Database kernel excess name
		static get DATABASE_KERNEL_EXCESS_NAME() {
		
			// Return database kernel excess name
			return "Kernel Excess";
		}
		
		// Database identifier name
		static get DATABASE_IDENTIFIER_NAME() {
		
			// Return database identifier name
			return "Identifier";
		}
		
		// Database switch type name
		static get DATABASE_SWITCH_TYPE_NAME() {
		
			// Return database switch type name
			return "Switch Type";
		}
		
		// Database display name
		static get DATABASE_DISPLAY_NAME() {
		
			// Return database display name
			return "Display";
		}
		
		// Database kernel offset name
		static get DATABASE_KERNEL_OFFSET_NAME() {
		
			// Return database kernel offset name
			return "Kernel Offset";
		}
		
		// Database ID name
		static get DATABASE_ID_NAME() {
		
			// Return database ID name
			return "ID";
		}
		
		// Database message name
		static get DATABASE_MESSAGE_NAME() {
		
			// Return database message name
			return "Message";
		}
		
		// Database time to live cut off height name
		static get DATABASE_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME() {
		
			// Return database time to live cut off height name
			return "Time To Live Cut Off Height";
		}
		
		// Database expired name
		static get DATABASE_EXPIRED_NAME() {
		
			// Return database expired name
			return "Expired";
		}
		
		// Database confirmed timestamp name
		static get DATABASE_CONFIRMED_TIMESTAMP_NAME() {
		
			// Return database confirmed timestamp name
			return "Confirmed Timestamp";
		}
		
		// Database fee
		static get DATABASE_FEE_NAME() {
		
			// Return database fee name
			return "Fee";
		}
		
		// Database sender address
		static get DATABASE_SENDER_ADDRESS_NAME() {
		
			// Return database sender address name
			return "Sender Address";
		}
		
		// Database receiver address
		static get DATABASE_RECEIVER_ADDRESS_NAME() {
		
			// Return database receiver address name
			return "Receiver Address";
		}
		
		// Database receiver signature
		static get DATABASE_RECEIVER_SIGNATURE_NAME() {
		
			// Return database receiver signature name
			return "Receiver Signature";
		}
		
		// Database destination signature
		static get DATABASE_DESTINATION_NAME() {
		
			// Return database destination name
			return "Destination";
		}
		
		// Database spendable height name
		static get DATABASE_SPENDABLE_HEIGHT_NAME() {
		
			// Return database spendable height name
			return "Spendable Height";
		}
		
		// Database required number of confirmations name
		static get DATABASE_REQUIRED_NUMBER_OF_CONFIRMATIONS_NAME() {
		
			// Return database required number of confirmations name
			return "Required Number Of Confirmations";
		}
		
		// Database spent outputs name
		static get DATABASE_SPENT_OUTPUTS_NAME() {
		
			// Return database spent outputs name
			return "Spent Outputs";
		}
		
		// Database change outputs name
		static get DATABASE_CHANGE_OUTPUTS_NAME() {
		
			// Return database change outputs name
			return "Change Outputs";
		}
		
		// Database broadcast name
		static get DATABASE_BROADCAST_NAME() {
		
			// Return database broadcast name
			return "Broadcast";
		}
		
		// Database rebroadcast message name
		static get DATABASE_REBROADCAST_MESSAGE_NAME() {
		
			// Return database rebroadcast message name
			return "Rebroadcast Message";
		}
		
		// Database file response name
		static get DATABASE_FILE_RESPONSE_NAME() {
		
			// Return database file response name
			return "File Response";
		}
		
		// Database prices when recorded name
		static get DATABASE_PRICES_WHEN_RECORDED_NAME() {
		
			// Return database prices when recorded name
			return "Prices When Recorded";
		}
		
		// Database checked name
		static get DATABASE_CHECKED_NAME() {
		
			// Return database checked name
			return "Checked";
		}
		
		// Database canceled name
		static get DATABASE_CANCELED_NAME() {
		
			// Return database canceled name
			return "Canceled";
		}
		
		// Database wallet type, network type, and commit name
		static get DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_COMMIT_NAME() {
		
			// Return database wallet type, network type, and commit name
			return "Wallet Type, Network Type, And Commit";
		}
		
		// Database wallet key path and height name
		static get DATABASE_WALLET_KEY_PATH_AND_HEIGHT_NAME() {
		
			// Return database wallet key path and height name
			return "Wallet Key Path And Height";
		}
		
		// Database wallet key path, received, amount released, status, and spendable height name
		static get DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_SPENDABLE_HEIGHT_NAME() {
		
			// Return database wallet key path, received, amount released, status, and spendable height name
			return "Wallet Key Path, Received, Amount Released, Status, And Spendable Height";
		}
		
		// Database wallet key path, received, amount released, status, and recorded timestamp name
		static get DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_STATUS_AND_RECORDED_TIMESTAMP_NAME() {
		
			// Return database wallet key path, received, amount released, status, and recorded timestamp name
			return "Wallet Key Path, Received, Amount Released, Status, And Recorded Timestamp";
		}
		
		// Database wallet key path, received, amount released, and broadcast name
		static get DATABASE_WALLET_KEY_PATH_RECEIVED_AMOUNT_RELEASED_AND_BROADCAST_NAME() {
		
			// Return database wallet key path, received, amount released, and broadcast name
			return "Wallet Key Path, Received, Amount Released, And Broadcast";
		}
		
		// Database wallet key path, received, canceled, expired, broadcast, and lock height name
		static get DATABASE_WALLET_KEY_PATH_RECEIVED_CANCELED_EXPIRED_BROADCAST_AND_LOCK_HEIGHT_NAME() {
		
			// Return database wallet key path, received, canceled, expired, broadcast, and lock height name
			return "Wallet Key Path, Received, Canceled, Expired, Broadcast, And Lock Height";
		}
		
		// Database wallet key path, display, and recorded timestamp name
		static get DATABASE_WALLET_KEY_PATH_DISPLAY_AND_RECORDED_TIMESTAMP_NAME() {
		
			// Return database wallet key path, display, and recorded timestamp name
			return "Wallet Key Path, Display, And Recorded Timestamp";
		}
		
		// Database wallet key path and ID
		static get DATABASE_WALLET_KEY_PATH_AND_ID() {
		
			// Return database wallet key path and ID
			return "Wallet Key Path And ID";
		}
		
		// Database wallet key path, received, and kernel offset
		static get DATABASE_WALLET_KEY_PATH_RECEIVED_AND_KERNEL_OFFSET() {
		
			// Return database wallet key path, received, and kernel offset
			return "Wallet Key Path, Received, And Kernel Offset";
		}
		
		// Database wallet key path, canceled, expired, broadcast, and time to live cut off height name
		static get DATABASE_WALLET_KEY_PATH_CANCELED_EXPIRED_BROADCAST_AND_TIME_TO_LIVE_CUT_OFF_HEIGHT_NAME() {
		
			// Return database wallet key path, canceled, expired, broadcast, and time to live cut off height name
			return "Wallet Key Path, Canceled, Expired, Broadcast, And Time To Live Cut Off Height";
		}
		
		// Database wallet type and network type name
		static get DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME() {
		
			// Return database wallet type and network type name
			return "Wallet Type And Network Type";
		}
		
		// Database wallet key path and checked name
		static get DATABASE_WALLET_KEY_PATH_AND_CHECKED_NAME() {
		
			// Return database wallet key path and checked name
			return "Wallet Key Path And Checked";
		}
		
		// Exclusive wallet transactions lock release event
		static get EXCLUSIVE_WALLET_TRANSACTIONS_LOCK_RELEASE_EVENT() {
		
			// Return exclusive wallet transactions lock release event
			return "TransactionsExclusiveWalletTransactionsLockReleaseEvent";
		}
		
		// No transaction
		static get NO_TRANSACTION() {
		
			// Return no transaction
			return null;
		}
}


// Main function

// Set global object's transactions
globalThis["Transactions"] = Transactions;
