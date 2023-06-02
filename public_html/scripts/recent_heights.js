// Use strict
"use strict";


// Classes

// Recent heights class
class RecentHeights {

	// Public
	
		// Constructor
		constructor(node) {
		
			// Set node
			this.node = node;
			
			// Set heights
			this.heights = [];
			
			// Set current heights
			this.currentHeights = [];
			
			// Set heights changed
			this.heightsChanged = false;
			
			// Set initial heights obtained
			this.initialHeightsObtained = new InitialHeightsObtained();
		
			// Create database
			Database.createDatabase(function(database, currentVersion, databaseTransaction) {
			
				// Create or get recent heights object store
				var recentHeightsObjectStore = (currentVersion === Database.NO_CURRENT_VERSION) ? database.createObjectStore(RecentHeights.OBJECT_STORE_NAME, {
				
					// Key path
					"keyPath": [
					
						// Wallet type
						Database.toKeyPath(RecentHeights.DATABASE_WALLET_TYPE_NAME),
						
						// Network type
						Database.toKeyPath(RecentHeights.DATABASE_NETWORK_TYPE_NAME),
					
						// Height
						Database.toKeyPath(RecentHeights.DATABASE_HEIGHT_NAME)
					]
					
				}) : databaseTransaction.objectStore(RecentHeights.OBJECT_STORE_NAME);
				
				// Check if no database version exists
				if(currentVersion === Database.NO_CURRENT_VERSION) {
					
					// Create index to search recent heights object store by wallet type and network type
					recentHeightsObjectStore.createIndex(RecentHeights.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, [
					
						// Wallet Type
						Database.toKeyPath(RecentHeights.DATABASE_WALLET_TYPE_NAME),
						
						// Network Type
						Database.toKeyPath(RecentHeights.DATABASE_NETWORK_TYPE_NAME)
					], {
					
						// Unique
						"unique": false
					});
				}
			});
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return getting the recent heights with the wallet type and network type in the database
					return Database.getResults(RecentHeights.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, RecentHeights.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
				
						// Wallet type
						Consensus.getWalletType(),
						
						// Network type
						Consensus.getNetworkType()
						
					])).then(function(results) {
					
						// Go through all recent heights while not exceeding the max number of recent heights
						for(var i = 0; i < results["length"] && self.heights["length"] < RecentHeights.MAXIMUM_NUMBER_OF_RECENT_HEIGHTS; ++i) {
						
							// Get height from result
							var height = RecentHeights.getHeightFromResult(results[i]);
							
							// Check if height is valid
							if(height.getHeight().isGreaterThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true)
						
								// Append height to list of heights
								self.heights.push(height);
						}
						
						// Sort heights in descending order
						self.heights.sort(function(firstHeight, secondHeight) {
						
							// Check if first height is less than the second height
							if(firstHeight.getHeight().isLessThan(secondHeight.getHeight()) === true)
							
								// Return sort greater than
								return Common.SORT_GREATER_THAN;
							
							// Check if first height is greater than the second height
							if(firstHeight.getHeight().isGreaterThan(secondHeight.getHeight()) === true)
							
								// Return sort less than
								return Common.SORT_LESS_THAN;
							
							// Return sort equal
							return Common.SORT_EQUAL;
						});
						
						// Store current heights
						self.storeCurrentHeights();
						
						// Resolve
						resolve();
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject
						reject();
					});
				});
			});
		}
		
		// Get highest verified height
		getHighestVerifiedHeight(tipHeight) {
		
			// Retore current heights
			this.restoreCurrentHeights();
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Set get initial heights
				var getInitialHeights = new Promise(function(resolve, reject) {
				
					// Return getting if initial heights were obtained
					return self.initialHeightsObtained.getObtained().then(function(obtained) {
					
						// Check if initial heights weren't obtained
						if(obtained === false) {
			
							// Clear heights
							self.heights = [];
						
							// Return saving heights
							return self.saveHeights(tipHeight).then(function() {
							
								// Return setting that initial heights were obtained
								return self.initialHeightsObtained.setObtained().then(function() {
								
									// Resolve
									resolve();
								
								// Catch errors
								}).catch(function(error) {
						
									// Clear heights
									self.heights = [];
									
									// Return deleting recent heights with the wallet type and network type in the database
									return Database.deleteResultsWithValue(RecentHeights.OBJECT_STORE_NAME, RecentHeights.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
					
										// Wallet type
										Consensus.getWalletType(),
										
										// Network type
										Consensus.getNetworkType()
										
									]), Database.CREATE_NEW_TRANSACTION, Database.STRICT_DURABILITY).catch(function(error) {
									
									// Finally
									}).finally(function() {
								
										// Reject error
										reject(error);
									});
								});
							
							// Catch errors
							}).catch(function(error) {
							
								// Clear heights
								self.heights = [];
							
								// Return deleting recent heights with the wallet type and network type in the database
								return Database.deleteResultsWithValue(RecentHeights.OBJECT_STORE_NAME, RecentHeights.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
				
									// Wallet type
									Consensus.getWalletType(),
									
									// Network type
									Consensus.getNetworkType()
									
								]), Database.CREATE_NEW_TRANSACTION, Database.STRICT_DURABILITY).catch(function(error) {
								
								// Finally
								}).finally(function() {
							
									// Reject error
									reject(error);
								});
							});
						}
						
						// Otherwise
						else {
						
							// Resolve
							resolve();
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				});
				
				// Return getting initial heights
				return getInitialHeights.then(function() {
			
					// Set highest verified height to no verified height
					var highestVerifiedHeight = RecentHeights.NO_VERIFIED_HEIGHT;
					
					// Set reorg occurred to true if heights exist
					var reorgOccurred = self.heights["length"] !== 0;
					
					// Set verifying height to promise
					var verifyingHeight = new Promise(function(resolve, reject) {
					
						// Resolve
						resolve();
					});
					
					// Initialize verifying heights
					var verifyingHeights = [verifyingHeight];
				
					// Go through all heights from highest to lowest
					var verifiedHeightFound = false;
					for(let i = 0; i < self.heights["length"]; ++i) {
					
						// Get height
						let height = self.heights[i];
						
						// Set verifying height to verify current height after previous height is done being verified
						verifyingHeight = verifyingHeight.then(function() {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if a verified height was already found
								if(verifiedHeightFound === true)
								
									// Resolve
									resolve();
								
								// Otherwise
								else {
							
									// Return verifying height
									return self.verifyHeight(height, tipHeight).then(function(verified) {
								
										// Check if height is verified
										if(verified === true) {
										
											// Set highest verified height to height
											highestVerifiedHeight = height.getHeight();
											
											// Remove invalid heights
											self.heights.splice(0, i);
											
											// Set that a verified height was found
											verifiedHeightFound = true;
											
											// Check if highest height is verified
											if(i === 0)
											
												// Clear reorg occurred
												reorgOccurred = false;
										}
										
										// Otherwise check if no saved heights are valid
										else if(i === self.heights["length"] - 1)
										
											// Clear all heights
											self.heights = [];
											
										// Resolve
										resolve();
									
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(error);
									});
								}
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Return promise
							return new Promise(function(resolve, reject) {
						
								// Reject error
								reject(error);
							});
						});
						
						// Append verifying height to list
						verifyingHeights.push(verifyingHeight);
					}
					
					// Wait until a verified height has been found
					return Promise.all(verifyingHeights).then(function() {
					
						// Resolve highest verified height
						resolve([
						
							// Highest verified height
							highestVerifiedHeight,
							
							// Reorg occurred
							reorgOccurred
						]);
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Get highest height
		getHighestHeight() {
		
			// Return highest current height without verifying it again or no height if not available
			return (this.currentHeights["length"] !== 0) ? this.currentHeights[0].getHeight() : RecentHeights.NO_HEIGHT;
		}
		
		// Save heights
		saveHeights(tipHeight) {
		
			// Store current heights
			this.storeCurrentHeights();
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return updating heights
				return self.updateHeights(tipHeight).then(function() {
				
					// Store current heights
					self.storeCurrentHeights();
			
					// Check if heights changed
					if(self.heightsChanged === true) {
					
						// Clear heights changed
						self.heightsChanged = false;
						
						// Return creating database transaction
						return Database.createTransaction(RecentHeights.OBJECT_STORE_NAME, Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(transaction) {
						
							// Return deleting recent heights with the wallet type and network type in the database
							return Database.deleteResultsWithValue(RecentHeights.OBJECT_STORE_NAME, RecentHeights.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
			
								// Wallet type
								Consensus.getWalletType(),
								
								// Network type
								Consensus.getNetworkType()
								
							]), transaction, Database.STRICT_DURABILITY).then(function() {
							
								// Return saving all recent heights in the database
								return Database.saveResults(RecentHeights.OBJECT_STORE_NAME, self.heights.map(function(height) {
								
									// Return height as result
									return {
									
										// Wallet Type
										[Database.toKeyPath(RecentHeights.DATABASE_WALLET_TYPE_NAME)]: Consensus.getWalletType(),
										
										// Network type
										[Database.toKeyPath(RecentHeights.DATABASE_NETWORK_TYPE_NAME)]: Consensus.getNetworkType(),
										
										// Height
										[Database.toKeyPath(RecentHeights.DATABASE_HEIGHT_NAME)]: height.getHeight().toFixed(),
										
										// Hash
										[Database.toKeyPath(RecentHeights.DATABASE_HASH_NAME)]: height.getHash()
									};
								
								}), [], transaction, Database.STRICT_DURABILITY).then(function() {
								
									// Return committing database transaction
									return Database.commitTransaction(transaction).then(function() {
									
										// Resolve
										resolve();
									
									// Catch errors
									}).catch(function(error) {
									
										// Return aborting database transaction
										return Database.abortTransaction(transaction).then(function() {
									
											// Reject error
											reject("The database failed.");
										
										// Catch errors
										}).catch(function(error) {
										
											// Trigger a fatal error
											new FatalError(FatalError.DATABASE_ERROR);
										});
									});
								
								// Catch errors
								}).catch(function(error) {
								
									// Return aborting database transaction
									return Database.abortTransaction(transaction).then(function() {
								
										// Reject error
										reject("The database failed.");
									
									// Catch errors
									}).catch(function(error) {
									
										// Trigger a fatal error
										new FatalError(FatalError.DATABASE_ERROR);
									});
								});
							
							// Catch errors
							}).catch(function(error) {
							
								// Return aborting database transaction
								return Database.abortTransaction(transaction).then(function() {
							
									// Reject error
									reject("The database failed.");
								
								// Catch errors
								}).catch(function(error) {
								
									// Trigger a fatal error
									new FatalError(FatalError.DATABASE_ERROR);
								});
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject("The database failed.");
						});
					}
					
					// Otherwise
					else
				
						// Resolve
						resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// No verified height
		static get NO_VERIFIED_HEIGHT() {
		
			// Return no verified height
			return null;
		}
		
		// No height
		static get NO_HEIGHT() {
		
			// Return no height
			return null;
		}
		
		// Highest verified height index
		static get HIGHEST_VERIFIED_HEIGHT_INDEX() {
		
			// Return highest verified hight index
			return 0;
		}
		
		// Reorg occurred index
		static get REORG_OCCURRED_INDEX() {
		
			// Return reorg occurred index
			return RecentHeights.HIGHEST_VERIFIED_HEIGHT_INDEX + 1;
		}
		
		// Header hash length
		static get HEADER_HASH_LENGTH() {
		
			// Return header hash length
			return 32;
		}
	
	// Private
	
		// Verify height
		verifyHeight(height, tipHeight) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if tip height is greater than or equal to the height
				if(tipHeight.getHeight().isGreaterThanOrEqualTo(height.getHeight()) === true) {
				
					// Set get hash
					var getHash = new Promise(function(resolve, reject) {
				
						// Check if height is equal to the tip height
						if(height.getHeight().isEqualTo(tipHeight.getHeight()) === true) {
						
							// Set hash to tip height's hash
							var hash = tipHeight.getHash();
							
							// Resolve hash
							resolve(hash);
						}
						
						// Otherwise
						else {
						
							// Return getting node's header at height
							return self.node.getHeader(height.getHeight()).then(function(header) {
							
								// Resolve header
								resolve((header !== Node.NO_HEADER_FOUND) ? header["hash"] : header);
							
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
					});
					
					// Return getting hash
					return getHash.then(function(hash) {
					
						// Check if no header for the height
						if(hash === Node.NO_HEADER_FOUND)
						
							// Resolve false
							resolve(false);
						
						// Otherwise
						else
					
							// Resolve if height's hash didn't change
							resolve(Common.arraysAreEqual(hash, height.getHash()) === true);
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
				
				// Otherwise
				else
				
					// Resolve false
					resolve(false);
			});
		}
		
		// Update heights
		updateHeights(tipHeight) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
				
				// Initialize new heights
				var newHeights = [];
				
				// Initialize get heights
				var getHeights = [];
				
				// Go through the max number of recent heights or until a first block height is used
				var firstBlockHeightUsed = false;
				for(let i = 0; i < RecentHeights.MAXIMUM_NUMBER_OF_RECENT_HEIGHTS && firstBlockHeightUsed === false; ++i) {
				
					// Get minimum and maximum age in seconds for the height at this index
					var minimumAgeInSeconds = (i !== 0) ? RecentHeights.getMinimumAgeAtIndex(i - 1) : 0;
					
					var maximumAgeInSeconds = RecentHeights.getMinimumAgeAtIndex(i) - 1;
					
					// Get ideal height from minimum age
					let idealHeight = tipHeight.getHeight().minus(Math.ceil(minimumAgeInSeconds / Consensus.BLOCK_TIME_SECONDS));
					
					// Check if heights exist
					if(self.heights["length"] !== 0) {
					
						// Go through all heights
						for(var j = 0; j < self.heights["length"]; ++j) {
						
							// Get height
							var height = self.heights[j];
							
							// Get height's age in seconds
							var ageInSeconds = tipHeight.getHeight().minus(height.getHeight()).multipliedBy(Consensus.BLOCK_TIME_SECONDS);
							
							// Check if height isn't too new or old for this index or height and ideal height are both the first block height
							if((ageInSeconds.isGreaterThanOrEqualTo(minimumAgeInSeconds) === true && ageInSeconds.isLessThanOrEqualTo(maximumAgeInSeconds) === true) || (idealHeight.isLessThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true && height.getHeight().isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true)) {
							
								// Check if indexes differ
								if(i !== j)
								
									// Set heights changed
									self.heightsChanged = true;
								
								// Check if height is equal to the first block height
								if(height.getHeight().isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true)
								
									// Set first block height used
									firstBlockHeightUsed = true;
							
								// Set height in new heights at index
								newHeights[i] = height;
								
								// Break
								break;
							}
							
							// Otherwise check if no heights have the correct age for this index
							else if(j === self.heights["length"] - 1) {
								
								// Check if ideal height is less than or equal to the first block height
								if(idealHeight.isLessThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true) {
								
									// Check if first block height isn't used
									if(firstBlockHeightUsed === false) {
									
										// Set first block height used
										firstBlockHeightUsed = true;
								
										// Set ideal height to the first block height
										idealHeight = new BigNumber(Consensus.FIRST_BLOCK_HEIGHT);
										
										// Set heights changed
										self.heightsChanged = true;
									}
									
									// Otherwise
									else
									
										// Break
										break;
								}
								
								// Otherwise
								else
								
									// Set heights changed
									self.heightsChanged = true;
								
								// Append get height to list
								getHeights.push(new Promise(function(resolve, reject) {
								
									// Check if the ideal height is equal to the tip height
									if(idealHeight.isEqualTo(tipHeight.getHeight()) === true) {
									
										// Set new height at index to the tip height
										newHeights[i] = new Height(tipHeight.getHeight(), tipHeight.getHash());
										
										// Resolve
										resolve();
									}
									
									// Otherwise
									else {
									
										// Return getting node's header for the ideal height
										return self.node.getHeader(idealHeight).then(function(header) {
										
											// Check if no header exists for the height
											if(header === Node.NO_HEADER_FOUND)
											
												// Reject error
												reject("Height not found.");
											
											// Otherwise
											else {
										
												// Set height in new heights at index
												newHeights[i] = new Height(idealHeight, header["hash"]);
												
												// Resolve
												resolve();
											}
										
										// Catch errors
										}).catch(function(error) {
										
											// Reject error
											reject(error);
										});
									}
								}));
							}
						}
					}
					
					// Otherwise
					else {
					
						// Check if ideal height is less than or equal to the first block height
						if(idealHeight.isLessThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true) {
						
							// Check if first block height isn't used
							if(firstBlockHeightUsed === false) {
							
								// Set first block height used
								firstBlockHeightUsed = true;
						
								// Set ideal height to the first block height
								idealHeight = new BigNumber(Consensus.FIRST_BLOCK_HEIGHT);
								
								// Set heights changed
								self.heightsChanged = true;
							}
							
							// Otherwise
							else
							
								// Break
								break;
						}
						
						// Otherwise
						else
						
							// Set heights changed
							self.heightsChanged = true;
						
						// Append getting height to list
						getHeights.push(new Promise(function(resolve, reject) {
						
							// Check if the ideal height is equal to the tip height
							if(idealHeight.isEqualTo(tipHeight.getHeight()) === true) {
							
								// Set new height at index to the tip height
								newHeights[i] = new Height(tipHeight.getHeight(), tipHeight.getHash());
								
								// Resolve
								resolve();
							}
							
							// Otherwise
							else {
							
								// Return getting node's header for the ideal height
								return self.node.getHeader(idealHeight).then(function(header) {
								
									// Check if no header exists for the height
									if(header === Node.NO_HEADER_FOUND)
									
										// Reject
										reject("Height not found.");
									
									// Otherwise
									else {
								
										// Set height in new heights at index
										newHeights[i] = new Height(idealHeight, header["hash"]);
										
										// Resolve
										resolve();
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Reject error
									reject(error);
								});
							}
						}));
					}
				}
				
				// Return waiting for all heights to be obtained
				return Promise.all(getHeights).then(function() {
				
					// Get tip of new heights
					var tipNewHeight = newHeights[0];
					
					// Check if the tip of the new heights isn't equal to the tip height
					if(tipNewHeight.getHeight().isEqualTo(tipHeight.getHeight()) === false || Common.arraysAreEqual(tipNewHeight.getHash(), tipHeight.getHash()) === false) {
					
						// Set tip of new heights to tip height
						newHeights[0] = new Height(tipHeight.getHeight(), tipHeight.getHash());
						
						// Set heights changed
						self.heightsChanged = true;
					}
					
					// Set heights to new heights
					self.heights = newHeights;
					
					// Resolve
					resolve();
					
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Store current heights
		storeCurrentHeights() {
		
			// Clear current heights
			this.currentHeights = [];
		
			// Go through all heights
			for(var i = 0; i < this.heights["length"]; ++i) {
			
				// Get height
				var height = this.heights[i];
				
				// Copy height to current heights
				this.currentHeights.push(new Height(height.getHeight(), height.getHash()));
			}
		}
		
		// Retore current heights
		restoreCurrentHeights() {
		
			// Clear heights
			this.heights = [];
		
			// Go through all current heights
			for(var i = 0; i < this.currentHeights["length"]; ++i) {
			
				// Get current height
				var currentHeight = this.currentHeights[i];
				
				// Copy current height to heights
				this.heights.push(new Height(currentHeight.getHeight(), currentHeight.getHash()));
			}
		}
		
		// Get minimum age at index
		static getMinimumAgeAtIndex(index) {
		
			// Return minimum age at index in seconds
			return Math.pow((index > 2) ? 3 : 2, (index > 2) ? index - 1 : index) * Consensus.BLOCK_TIME_SECONDS;
		}
		
		// Get height from result
		static getHeightFromResult(result) {
		
			// Return height from result
			return new Height(
			
				// Height
				new BigNumber(result[Database.toKeyPath(RecentHeights.DATABASE_HEIGHT_NAME)]),
				
				// Hash
				result[Database.toKeyPath(RecentHeights.DATABASE_HASH_NAME)]
			);
		}
		
		// Object store name
		static get OBJECT_STORE_NAME() {
		
			// Return object store name
			return "Recent Heights";
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
		
		// Database height name
		static get DATABASE_HEIGHT_NAME() {
		
			// Return database height name
			return "Height";
		}
		
		// Database hash name
		static get DATABASE_HASH_NAME() {
		
			// Return database hash name
			return "Hash";
		}
		
		// Database wallet type and network type name
		static get DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME() {
		
			// Return database wallet type and network type name
			return "Wallet Type And Network Type";
		}
		
		// Maximum number of recent heights
		static get MAXIMUM_NUMBER_OF_RECENT_HEIGHTS() {
		
			// Return the maximum number of recent heights
			return 13;
		}
}


// Main function

// Set global object's recent heights
globalThis["RecentHeights"] = RecentHeights;
