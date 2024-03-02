// Use strict
"use strict";


// Classes

// Wallets class
class Wallets {

	// Public
	
		// Constructor
		constructor(torProxy, node, listener, settings, application, message, transactions, prices) {
		
			// Set node
			this.node = node;
		
			// Set listener
			this.listener = listener;
			
			// Set settings
			this.settings = settings;
			
			// Set application
			this.application = application;
			
			// Set transactions
			this.transactions = transactions;
			
			// Set prices
			this.prices = prices;
		
			// Set wallets
			this.wallets = {};
			
			// Set unverify address suffixes on close
			this.unverifyAddressSuffixesOnClose = false;
			
			// Set is syncing
			this.isSyncing = false;
			
			// Set stop syncing
			this.stopSyncing = false;
			
			// Set ignore synced status
			this.ignoreSyncedStatus = false;
			
			// Set recent heights
			this.recentHeights = new RecentHeights(this.node);
			
			// Set API
			this.api = new Api(torProxy, this.node, this.transactions, this, this.settings, message, application, this.prices);
			
			// Set number of confirmations to setting's default value
			this.numberOfConfirmations = new BigNumber(Wallets.SETTINGS_NUMBER_OF_CONFIRMATIONS_DEFAULT_VALUE);
			
			// Set password to no password
			this.password = Wallets.NO_PASSWORD;
			
			// Set exclusive hardware lock
			this.exclusiveHardwareLock = false;
			
			// Set exclusive hardware lock release event index
			this.exclusiveHardwareLockReleaseEventIndex = 0;
			
			// Set self
			var self = this;
			
			// Check if hardware wallets are supported
			if(HardwareWallet.isSupported() === true) {
			
				// Check if USB is supported
				if("usb" in navigator === true) {
				
					// USB connect event
					$(navigator["usb"]).on("connect", function(event) {
				
						// Obtain exclusive hardware lock
						self.obtainExclusiveHardwareLock().then(function() {
						
							// Check if device isn't opened
							if(event["originalEvent"]["device"]["opened"] === false) {
							
								// Initialize hardware wallet found
								var hardwareWalletFound = false;
						
								// Go through all wallets
								for(var keyPath in self.wallets) {
											
									if(self.wallets.hasOwnProperty(keyPath) === true) {
								
										// Get wallet
										var wallet = self.wallets[keyPath];
										
										// Check if wallet is open, it's a hardware wallet, and its hardware isn't connected
										if(wallet.isOpen() === true && wallet.getHardwareType() !== Wallet.NO_HARDWARE_TYPE && wallet.isHardwareConnected() === false) {
										
											// Set hardware wallet found
											hardwareWalletFound = true;
											
											// Break
											break;
										}
									}
								}
								
								// Check if a hardware wallet was found
								if(hardwareWalletFound === true) {
					
									// Create hardware wallet
									var hardwareWallet = new HardwareWallet(self.application);
									
									// Connect to hardware wallet
									hardwareWallet.connect(event["originalEvent"]["device"], true).then(function() {
									
										// Initialize connect wallets to hardware
										var connectWalletsToHardware = [];
									
										// Go through all wallets
										for(var keyPath in self.wallets) {
													
											if(self.wallets.hasOwnProperty(keyPath) === true) {
										
												// Get wallet
												let wallet = self.wallets[keyPath];
												
												// Check if wallet is a hardware wallet
												if(wallet.getHardwareType() !== Wallet.NO_HARDWARE_TYPE) {
												
													// Append connecting wallet to hardware to list
													connectWalletsToHardware.push(new Promise(function(resolve, reject) {
													
														// Return connecting wallet to the applicable hardware wallet
														return wallet.connectToApplicableHardware([hardwareWallet]).then(function() {
														
															// Resolve
															resolve();
														
														// Catch errors
														}).catch(function(error) {
														
															// Reject error
															reject(error);
														});
													}));
												}
											}
										}
										
										// Connect wallets to hardware
										Promise.allSettled(connectWalletsToHardware).then(function() {
										
											// Check if hardware wallet isn't in use
											if(hardwareWallet.getInUse() === false) {
											
												// Close hardware wallet
												hardwareWallet.close();
											}
											
											// Release exclusive hardware lock
											self.releaseExclusiveHardwareLock();
										});
										
									// Catch errors
									}).catch(function(error) {
									
										// Release exclusive hardware lock
										self.releaseExclusiveHardwareLock();
									});
								}
								
								// Otherwise
								else {
								
									// Release exclusive hardware lock
									self.releaseExclusiveHardwareLock();
								}
							
							}
								
							// Otherwise
							else {
							
								// Release exclusive hardware lock
								self.releaseExclusiveHardwareLock();
							}
						});
					});
				}
			}
			
			// Create database
			Database.createDatabase(function(database, currentVersion, databaseTransaction) {
			
				// Create or get wallets object store
				var walletsObjectStore = (currentVersion === Database.NO_CURRENT_VERSION) ? database.createObjectStore(Wallets.OBJECT_STORE_NAME, {
				
					// Auto increment
					"autoIncrement": true
					
				}) : databaseTransaction.objectStore(Wallets.OBJECT_STORE_NAME);
				
				// Check if no database version exists
				if(currentVersion === Database.NO_CURRENT_VERSION) {
					
					// Create index to search wallets object store by wallet type, network type, and address suffix
					walletsObjectStore.createIndex(Wallets.DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_ADDRESS_SUFFIX_NAME, [
					
						// Wallet type
						Database.toKeyPath(Wallets.DATABASE_WALLET_TYPE_NAME),
						
						// Network type
						Database.toKeyPath(Wallets.DATABASE_NETWORK_TYPE_NAME),
						
						// Address suffix
						Database.toKeyPath(Wallets.DATABASE_ADDRESS_SUFFIX_NAME)
					], {
					
						// Unique
						"unique": true
					});
					
					// Create index to search wallets object store by wallet type, network type, and order
					walletsObjectStore.createIndex(Wallets.DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_ORDER_NAME, [
					
						// Wallet type
						Database.toKeyPath(Wallets.DATABASE_WALLET_TYPE_NAME),
						
						// Network type
						Database.toKeyPath(Wallets.DATABASE_NETWORK_TYPE_NAME),
						
						// Order
						Database.toKeyPath(Wallets.DATABASE_ORDER_NAME)
					], {
					
						// Unique
						"unique": true
					});
					
					// Create index to search wallets object store by wallet type and network type
					walletsObjectStore.createIndex(Wallets.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, [
					
						// Wallet type
						Database.toKeyPath(Wallets.DATABASE_WALLET_TYPE_NAME),
						
						// Network type
						Database.toKeyPath(Wallets.DATABASE_NETWORK_TYPE_NAME)
					], {
					
						// Unique
						"unique": false
					});
				}
			});
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return getting all wallets with the wallet type and network type in the database
					return Database.getResults(Wallets.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Wallets.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
					
						// Wallet type lower bound
						Consensus.getWalletType(),
						
						// Network type lower bound
						Consensus.getNetworkType()
						
					])).then(function(results) {
				
						// Go through all wallets
						for(var i = 0; i < results["length"]; ++i) {
						
							// Get wallet from result
							var wallet = Wallets.getWalletFromResult(results[i]);
						
							// Append wallet to list of wallets
							self.wallets[wallet.getKeyPath()] = wallet;
						}
						
						// Return creating settings
						return Promise.all([
				
							// Number of confirmations setting
							self.settings.createValue(Wallets.SETTINGS_NUMBER_OF_CONFIRMATIONS_NAME, Wallets.SETTINGS_NUMBER_OF_CONFIRMATIONS_DEFAULT_VALUE)
						
						]).then(function() {
						
							// Initialize settings
							var settings = [
							
								// Number of confirmations setting
								Wallets.SETTINGS_NUMBER_OF_CONFIRMATIONS_NAME
							];
						
							// Return getting settings' values
							return Promise.all(settings.map(function(setting) {
							
								// Return getting setting's value
								return self.settings.getValue(setting);
							
							})).then(function(settingValues) {
							
								// Set number of confirmations to setting's value
								self.numberOfConfirmations = new BigNumber(settingValues[settings.indexOf(Wallets.SETTINGS_NUMBER_OF_CONFIRMATIONS_NAME)]);
								
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
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject
						reject();
					});
				});
			});
			
			// Settings change event
			$(this.settings).on(Settings.CHANGE_EVENT, function(event, setting) {
			
				// Check what setting was changes
				switch(setting[Settings.DATABASE_SETTING_NAME]) {
				
					// Number of confirmations setting
					case Wallets.SETTINGS_NUMBER_OF_CONFIRMATIONS_NAME:
					
						// Set number of confirmations to setting's value
						self.numberOfConfirmations = new BigNumber(setting[Settings.DATABASE_VALUE_NAME]);
						
						// Break
						break;
				}
			});
			
			// Node connection warning or close event
			$(this.node).on(Node.CONNECTION_WARNING_EVENT + " " + Node.CONNECTION_CLOSE_EVENT, function() {
			
				// Sync failed
				self.syncFailed();
			
			// Node height change event
			}).on(Node.HEIGHT_CHANGE_EVENT, function(event, height, lastBlockHash, ignoreSyncedStatus) {
			
				// Check if node is synced
				if(height.isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === false) {
				
					// Create a database transaction
					Database.createTransaction(Wallets.OBJECT_STORE_NAME, Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
				
						// Initialize set synced heights
						var setSyncedHeights = [];
						
						// Initialize changed wallets
						var changedWallets = [];
					
						// Go through all wallets
						for(var keyPath in self.wallets) {
									
							if(self.wallets.hasOwnProperty(keyPath) === true) {
							
								// Get wallet
								let wallet = self.wallets[keyPath];
							
								// Add to set synced heights
								setSyncedHeights.push(new Promise(function(resolve, reject) {
							
									// Check if wallet exists
									if(self.walletExists(wallet.getKeyPath()) === true) {
						
										// Check if wallet's synced height is current height
										if(wallet.getSyncedHeight() === Wallet.CURRENT_HEIGHT) {
										
											// Return saving wallet
											return self.saveWallet(wallet, function() {
											
												// Check if wallet's synced height is still the current height
												if(wallet.getSyncedHeight() === Wallet.CURRENT_HEIGHT) {
											
													// Return
													return {
													
														// New synced height value
														[Wallets.NEW_SYNCED_HEIGHT_VALUE]: height.minus(1)
													};
												}
												
												// Otherwise
												else {
												
													// Return nothing
													return {};
												}
												
											}, databaseTransaction).then(function(newValues) {
											
												// Check if wallet's new synced height was saved
												if(Wallets.NEW_SYNCED_HEIGHT_VALUE in newValues === true) {
											
													// Append changed wallet to list
													changedWallets.push(wallet);
												}
											
												// Resolve
												resolve();
											
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
									}
									
									// Otherwise
									else {
									
										// Resolve
										resolve();
									}
								}));
							}
						}
						
						// When all set synced heights are done
						Promise.all(setSyncedHeights).then(function() {
						
							// Commit database transaction
							Database.commitTransaction(databaseTransaction).then(function() {
							
								// Go through all changed wallets
								for(var i = 0; i < changedWallets["length"]; ++i) {
								
									// Get wallet
									var wallet = changedWallets[i];
									
									// Set wallet's synced height to the node's current height
									wallet.setSyncedHeight(height.minus(1));
									
									// Update wallet's starting sync height
									wallet.setStartingSyncHeight(wallet.getSyncedHeight());
								}
								
								// Start syncing and ignore synced status if specified
								self.startSyncing(typeof ignoreSyncedStatus !== "undefined" && ignoreSyncedStatus === true);
							
							// Catch errors
							}).catch(function() {
							
								// Abort database transaction and catch errors
								Database.abortTransaction(databaseTransaction).catch(function() {
								
									// Trigger a fatal error
									new FatalError(FatalError.DATABASE_ERROR);
								});
							});
						
						// Catch errors
						}).catch(function() {
						
							// Abort database transaction and catch errors
							Database.abortTransaction(databaseTransaction).catch(function() {
							
								// Trigger a fatal error
								new FatalError(FatalError.DATABASE_ERROR);
							});
						});
					
					// Catch errors
					}).catch(function() {
					
					});
				}
			});
			
			// Listener request receive event
			$(this.listener).on(Listener.REQUEST_RECEIVE_EVENT, function(event, interaction, promiseResolve = undefined, promiseReject = undefined) {
			
				// Get interaction's wallet
				var getInteractionsWallet = function() {
				
					// Return promise
					return new Promise(function(resolve, reject) {
					
						// Check if interaction uses a URL
						if(interaction.getUrl() !== Interaction.NO_URL) {
						
							// Return getting wallet with interaction's URL
							return self.getWalletFromAddressSuffix(interaction.getUrl()).then(function(wallet) {
							
								// Resolve wallet
								resolve(wallet);
								
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
						
						// Otherwise check if interaction uses a wallet key path
						else if(interaction.getWalletKeyPath() !== Interaction.NO_WALLET_KEY_PATH) {
						
							// Check if wallet with the interaction's wallet key path doesn't exist
							if(self.walletExists(interaction.getWalletKeyPath()) === false) {
							
								// Reject error
								reject(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
							}
							
							// Otherwise
							else {
					
								// Resolve wallet
								resolve(self.wallets[interaction.getWalletKeyPath()]);
							}
						}
						
						// Otherwise
						else {
						
							// Reject error
							reject(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
						}
					});
				};
			
				// Get interaction's wallet
				getInteractionsWallet().then(function(wallet) {
				
					// Get receiving as file
					var receivingAsFile = typeof promiseResolve !== "undefined";
				
					// Obtain wallet's exclusive transactions lock and make it high priority if receiving as file
					self.transactions.obtainWalletsExclusiveTransactionsLock(wallet.getKeyPath(), receivingAsFile === true).then(function() {
					
						// Check if wallet exists
						if(self.walletExists(wallet.getKeyPath()) === true) {
					
							// Get interaction's type
							var type = interaction.getType();
					
							// Get interaction's data
							var data = interaction.getData();
							
							// Get wallet's last identifier
							var lastIdentifier = wallet.getLastIdentifier();
							
							// Get the APIs response to the request
							self.api.getResponse(interaction.getApi(), wallet, type, data, (receivingAsFile === true) ? false : true, (receivingAsFile === true) ? true : false, (receivingAsFile === true) ? Common.NO_CANCEL_OCCURRED : function() {
							
								// Return if interaction is canceled
								return interaction.isCanceled() === true;
								
							}).then(function(response) {
							
								// Check if wallet exists
								if(self.walletExists(wallet.getKeyPath()) === true) {
							
									// Respond to interaction
									interaction.respond(response[Api.RESPONSE_RESPONSE_INDEX]).then(function() {
									
										// Set timestamp
										var timestamp = Date.now();
										
										// Get prices
										var prices = self.prices.getPrices();
									
										// Check if currency was received
										if(response[Api.RESPONSE_METHOD_INDEX] === Api.RECEIVE_TRANSACTION_METHOD) {
										
											// Get slate
											var slate = response[Api.RESPONSE_ADDITIONAL_DATA_INDEX][Api.RECEIVE_TRANSACTION_ADDITIONAL_DATA_SLATE_INDEX];
											
											// Get commit
											var commit = response[Api.RESPONSE_ADDITIONAL_DATA_INDEX][Api.RECEIVE_TRANSACTION_ADDITIONAL_DATA_COMMIT_INDEX];
											
											// Get identifier
											var identifier = response[Api.RESPONSE_ADDITIONAL_DATA_INDEX][Api.RECEIVE_TRANSACTION_ADDITIONAL_DATA_IDENTIFIER_INDEX];
											
											// Get switch type
											var switchType = response[Api.RESPONSE_ADDITIONAL_DATA_INDEX][Api.RECEIVE_TRANSACTION_ADDITIONAL_DATA_SWITCH_TYPE_INDEX];
											
											// Check if slate's height isn't known
											if(slate.getHeight() === Slate.UNKNOWN_HEIGHT) {
											
												// Set spendable height to the slate's lock height added to the number of confirmation if it exists
												var spendableHeight = (slate.getLockHeight().isEqualTo(Slate.NO_LOCK_HEIGHT) === false) ? slate.getLockHeight().plus(self.numberOfConfirmations.minus(1)) : Transaction.UNKNOWN_SPENDABLE_HEIGHT;
											}
											
											// Otherwise
											else {
											
												// Set spendable height to the slate's height added to the number of confirmations
												var spendableHeight = slate.getHeight().plus(self.numberOfConfirmations.minus(1));
												
												// Check if the slate's lock height added to the number of confirmation is greater than the spendable height
												if(slate.getLockHeight().isEqualTo(Slate.NO_LOCK_HEIGHT) === false && slate.getLockHeight().plus(self.numberOfConfirmations.minus(1)).isGreaterThan(spendableHeight) === true) {
												
													// Set the spendable height to the slate's lock height added to the number of confirmation
													spendableHeight = slate.getLockHeight().plus(self.numberOfConfirmations.minus(1));
												}
											}
											
											// Set file response
											var fileResponse = (receivingAsFile === true) ? ((typeof response[Api.RESPONSE_RESPONSE_INDEX]["result"]["Ok"] === "string") ? response[Api.RESPONSE_RESPONSE_INDEX]["result"]["Ok"] : JSONBigNumber.stringify(response[Api.RESPONSE_RESPONSE_INDEX]["result"]["Ok"])) : Transaction.UNUSED_FILE_RESPONSE;
											
											// Try
											try {
											
												// Create transaction
												var transaction = new Transaction(wallet.getWalletType(), wallet.getNetworkType(), commit, wallet.getKeyPath(), true, timestamp, timestamp, (slate.getHeight() === Slate.UNKNOWN_HEIGHT) ? Transaction.UNKNOWN_HEIGHT : slate.getHeight(), (slate.getLockHeight().isEqualTo(Slate.NO_LOCK_HEIGHT) === false) ? slate.getLockHeight() : Transaction.NO_LOCK_HEIGHT, false, Transaction.STATUS_UNCONFIRMED, slate.getAmount(), false, slate.getExcess(), identifier, switchType, true, slate.getOffsetExcess(), slate.getId(), (slate.getParticipant(SlateParticipant.SENDER_ID).getMessage() !== SlateParticipant.NO_MESSAGE) ? slate.getParticipant(SlateParticipant.SENDER_ID).getMessage() : Transaction.NO_MESSAGE, (slate.getTimeToLiveCutOffHeight() !== Slate.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT) ? slate.getTimeToLiveCutOffHeight() : Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT, false, Transaction.NO_CONFIRMED_TIMESTAMP, slate.getFee(), (slate.getSenderAddress() !== Slate.NO_SENDER_ADDRESS) ? slate.getSenderAddress() : Transaction.NO_SENDER_ADDRESS, (slate.getReceiverAddress() !== Slate.NO_RECEIVER_ADDRESS) ? slate.getReceiverAddress() : Transaction.NO_RECEIVER_ADDRESS, (slate.getReceiverSignature() !== Slate.NO_RECEIVER_SIGNATURE) ? slate.getReceiverSignature() : Transaction.NO_RECEIVER_SIGNATURE, Transaction.UNUSED_DESTINATION, spendableHeight, self.numberOfConfirmations, Transaction.UNUSED_SPENT_OUTPUTS, Transaction.UNUSED_CHANGE_OUTPUTS, false, Transaction.UNKNOWN_REBROADCAST_MESSAGE, fileResponse, (prices !== Prices.NO_PRICES_FOUND) ? prices : Transaction.UNKNOWN_PRICES_WHEN_RECORDED);
											}
											
											// Catch errors
											catch(error) {
											
												// Check if wallet exists and wallet's last identifier changed
												if(self.walletExists(wallet.getKeyPath()) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
												
													// Save wallet
													self.saveWallet(wallet).then(function() {
													
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
													
														// Trigger a fatal error
														new FatalError(FatalError.UNKNOWN_ERROR);
													
													// Catch errors
													}).catch(function(error) {
													
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
													
														// Trigger a fatal error
														new FatalError(FatalError.DATABASE_ERROR);
													});
												}
												
												// Otherwise
												else {
												
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
											
													// Trigger a fatal error
													new FatalError(FatalError.UNKNOWN_ERROR);
												}
													
												// Return
												return;
											}
											
											// Create a database transaction
											Database.createTransaction([
											
												// Wallets object store
												Wallets.OBJECT_STORE_NAME,
												
												// Transactions object store
												Transactions.OBJECT_STORE_NAME,
												
											], Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
											
												// Save transactions
												self.transactions.saveTransactions([transaction], databaseTransaction).then(function() {
												
													// Check if wallet exists
													if(self.walletExists(wallet.getKeyPath()) === true) {
													
														// Save wallet
														self.saveWallet(wallet, function() {
												
															// Return
															return {
															
																// New unconfirmed amount value
																[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]: wallet.getUnconfirmedAmount().plus(slate.getAmount())
															};
															
														}, databaseTransaction).then(function(newValues) {
														
															// Check if wallet exists
															if(self.walletExists(wallet.getKeyPath()) === true) {
															
																// Commit database transaction
																Database.commitTransaction(databaseTransaction).then(function() {
																
																	// Release wallet's exclusive transactions lock
																	self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																
																	// Update wallet's unconfirmed amount
																	wallet.setUnconfirmedAmount(newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]);
																	
																	// Check if wallet exists
																	if(self.walletExists(wallet.getKeyPath()) === true) {
																	
																		// Check if promise resolve exists
																		if(typeof promiseResolve !== "undefined") {
																	
																			// Resolve promise
																			promiseResolve([
																			
																				// Wallet
																				wallet,
																			
																				// Amount
																				slate.getAmount().dividedBy(Consensus.VALUE_NUMBER_BASE),
																				
																				// Currency
																				Consensus.CURRENCY_NAME,
																				
																				// Message
																				slate.getParticipant(SlateParticipant.SENDER_ID).getMessage(),
																				
																				// Receiver address
																				slate.getReceiverAddress(),
																				
																				// File response
																				fileResponse,
																				
																				// ID
																				slate.getId()
																			]);
																		}
																		
																		// Otherwise
																		else {
															
																			// Trigger currency receive event
																			$(self).trigger(Wallets.CURRENCY_RECEIVE_EVENT, [
																			
																				// Wallet
																				wallet,
																			
																				// Amount
																				slate.getAmount().dividedBy(Consensus.VALUE_NUMBER_BASE),
																				
																				// Currency
																				Consensus.CURRENCY_NAME,
																				
																				// Message
																				slate.getParticipant(SlateParticipant.SENDER_ID).getMessage(),
																				
																				// Receiver address
																				slate.getReceiverAddress(),
																				
																				// File response
																				fileResponse,
																				
																				// ID
																				slate.getId()
																			]);
																		}
																		
																		// Trigger change event
																		$(document).trigger(Wallets.CHANGE_EVENT, [
																		
																			// Key path
																			wallet.getKeyPath(),
																			
																			// Change
																			Wallets.UNCONFIRMED_AMOUNT_CHANGED,
																			
																			// New value
																			newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]
																		]);
																		
																		// Trigger transactions change event
																		$(self.transactions).trigger(Transactions.CHANGE_EVENT, [
																		
																			// Transactions
																			[transaction]
																		]);
																	}
																	
																	// Otherwise
																	else {
																	
																		// Check if promise reject exists
																		if(typeof promiseReject !== "undefined") {
																	
																			// Reject promise
																			promiseReject(Listener.NOT_FOUND_RESPONSE);
																		}
																	}
																
																// Catch errors
																}).catch(function(error) {
																
																	// Abort database transaction and catch errors
																	Database.abortTransaction(databaseTransaction).catch(function() {
																	
																	// Finally
																	}).finally(function() {
																	
																		// Release wallet's exclusive transactions lock
																		self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																		
																		// Check if promise reject exists
																		if(typeof promiseReject !== "undefined") {
																	
																			// Reject promise
																			promiseReject(error);
																		}
																
																		// Trigger a fatal error
																		new FatalError(FatalError.DATABASE_ERROR);
																	});
																});
															}
															
															// Otherwise
															else {
															
																// Abort database transaction
																Database.abortTransaction(databaseTransaction).then(function() {
																
																	// Release wallet's exclusive transactions lock
																	self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																	
																	// Check if promise reject exists
																	if(typeof promiseReject !== "undefined") {
																
																		// Reject promise
																		promiseReject(Listener.NOT_FOUND_RESPONSE);
																	}
																	
																// Catch errors
																}).catch(function(error) {
																
																	// Release wallet's exclusive transactions lock
																	self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																	
																	// Check if promise reject exists
																	if(typeof promiseReject !== "undefined") {
																
																		// Reject promise
																		promiseReject(Listener.NOT_FOUND_RESPONSE);
																	}
																
																	// Trigger a fatal error
																	new FatalError(FatalError.DATABASE_ERROR);
																});
															}
														
														// Catch errors
														}).catch(function(error) {
														
															// Abort database transaction and catch errors
															Database.abortTransaction(databaseTransaction).catch(function() {
															
															// Finally
															}).finally(function() {
															
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																
																// Check if promise reject exists
																if(typeof promiseReject !== "undefined") {
															
																	// Reject promise
																	promiseReject(error);
																}
														
																// Trigger a fatal error
																new FatalError(FatalError.DATABASE_ERROR);
															});
														});
													}
													
													// Otherwise
													else {
													
														// Abort database transaction
														Database.abortTransaction(databaseTransaction).then(function() {
														
															// Release wallet's exclusive transactions lock
															self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
															
															// Check if promise reject exists
															if(typeof promiseReject !== "undefined") {
														
																// Reject promise
																promiseReject(Listener.NOT_FOUND_RESPONSE);
															}
															
														// Catch errors
														}).catch(function(error) {
														
															// Release wallet's exclusive transactions lock
															self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
															
															// Check if promise reject exists
															if(typeof promiseReject !== "undefined") {
														
																// Reject promise
																promiseReject(Listener.NOT_FOUND_RESPONSE);
															}
														
															// Trigger a fatal error
															new FatalError(FatalError.DATABASE_ERROR);
														});
													}
												
												// Catch errors
												}).catch(function(error) {
												
													// Abort database transaction and catch errors
													Database.abortTransaction(databaseTransaction).catch(function() {
													
													// Finally
													}).finally(function() {
													
														// Check if wallet exists and wallet's last identifier changed
														if(self.walletExists(wallet.getKeyPath()) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
														
															// Save wallet and catch errors
															self.saveWallet(wallet).catch(function() {
															
															// Finally
															}).finally(function() {
															
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																
																// Check if promise reject exists
																if(typeof promiseReject !== "undefined") {
															
																	// Reject promise
																	promiseReject(error);
																}
															
																// Trigger a fatal error
																new FatalError(FatalError.DATABASE_ERROR);
															});
														}
														
														// Otherwise
														else {
														
															// Release wallet's exclusive transactions lock
															self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
															
															// Check if promise reject exists
															if(typeof promiseReject !== "undefined") {
														
																// Reject promise
																promiseReject(error);
															}
													
															// Trigger a fatal error
															new FatalError(FatalError.DATABASE_ERROR);
														}
													});
												});
											
											// Catch errors
											}).catch(function(error) {
											
												// Check if wallet exists and wallet's last identifier changed
												if(self.walletExists(wallet.getKeyPath()) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
												
													// Save wallet
													self.saveWallet(wallet).then(function() {
													
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
														
														// Check if promise reject exists
														if(typeof promiseReject !== "undefined") {
													
															// Reject promise
															promiseReject(error);
														}
													
													// Catch errors
													}).catch(function() {
													
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
														
														// Check if promise reject exists
														if(typeof promiseReject !== "undefined") {
													
															// Reject promise
															promiseReject(error);
														}
													
														// Trigger a fatal error
														new FatalError(FatalError.DATABASE_ERROR);
													});
												}
													
												// Otherwise
												else {
												
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
													
													// Check if promise reject exists
													if(typeof promiseReject !== "undefined") {
												
														// Reject promise
														promiseReject(error);
													}
											
													// Trigger a fatal error
													new FatalError(FatalError.DATABASE_ERROR);
												}
											});
										}
										
										// Otherwise
										else {
										
											// Check if wallet exists and wallet's last identifier changed
											if(self.walletExists(wallet.getKeyPath()) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
											
												// Save wallet
												self.saveWallet(wallet).then(function() {
												
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
													
													// Check if promise resolve exists
													if(typeof promiseResolve !== "undefined") {
												
														// Resolve promise
														promiseResolve();
													}
												
												// Catch errors
												}).catch(function(error) {
												
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
													
													// Check if promise reject exists
													if(typeof promiseReject !== "undefined") {
												
														// Reject promise
														promiseReject(error);
													}
												
													// Trigger a fatal error
													new FatalError(FatalError.DATABASE_ERROR);
												});
											}
											
											// Otherwise
											else {
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
												
												// Check if promise resolve exists
												if(typeof promiseResolve !== "undefined") {
											
													// Resolve promise
													promiseResolve();
												}
											}
										}
									
									// Catch errors
									}).catch(function(error) {
									
										// Check if wallet exists and wallet's last identifier changed
										if(self.walletExists(wallet.getKeyPath()) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
										
											// Save wallet
											self.saveWallet(wallet).then(function() {
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
												
												// Check if promise reject exists
												if(typeof promiseReject !== "undefined") {
											
													// Reject promise
													promiseReject(error);
												}
											
											// Catch errors
											}).catch(function() {
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
												
												// Check if promise reject exists
												if(typeof promiseReject !== "undefined") {
											
													// Reject promise
													promiseReject(error);
												}
											
												// Trigger a fatal error
												new FatalError(FatalError.DATABASE_ERROR);
											});
										}
										
										// Otherwise
										else {
										
											// Release wallet's exclusive transactions lock
											self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
											
											// Check if promise reject exists
											if(typeof promiseReject !== "undefined") {
										
												// Reject promise
												promiseReject(error);
											}
										}
									});
								}
							
								// Otherwise
								else {
								
									// Release wallet's exclusive transactions lock
									self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
									
									// Check if promise reject exists
									if(typeof promiseReject !== "undefined") {
								
										// Reject promise
										promiseReject(Listener.NOT_FOUND_RESPONSE);
									}
								
									// Cancel interaction with not found response and catch errors
									interaction.cancel(Listener.NOT_FOUND_RESPONSE).catch(function(error) {
									
									});
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Check if canceled or user rejected on hardware wallet
								if(error === Common.CANCELED_ERROR || error === HardwareWallet.USER_REJECTED_ERROR) {
								
									// Check if data is a buffer
									if(data instanceof Uint8Array === true) {
								
										// Set listener error to JSON-RPC internal error error response
										var listenerError = JsonRpc.createErrorResponse(JsonRpc.INTERNAL_ERROR_ERROR, JSONBigNumber.parse((new TextDecoder("utf-8", {"fatal": true})).decode(data)));
									}
									
									// Otherwise
									else {
									
										// Set listener error to JSON-RPC internal error error response
										var listenerError = JsonRpc.createErrorResponse(JsonRpc.INTERNAL_ERROR_ERROR, data);
									}
								}
								
								// Otherwise
								else {
								
									// Set listener error to error
									var listenerError = error;
								}
								
								// Check if wallet exists and wallet's last identifier changed
								if(self.walletExists(wallet.getKeyPath()) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
								
									// Save wallet
									self.saveWallet(wallet).then(function() {
									
										// Release wallet's exclusive transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
										
										// Check if promise reject exists
										if(typeof promiseReject !== "undefined") {
									
											// Reject promise
											promiseReject(error);
										}
									
										// Cancel interaction with listener error and catch errors
										interaction.cancel(listenerError).catch(function(error) {
										
										});
									
									// Catch errors
									}).catch(function() {
									
										// Release wallet's exclusive transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
										
										// Check if promise reject exists
										if(typeof promiseReject !== "undefined") {
									
											// Reject promise
											promiseReject(error);
										}
									
										// Cancel interaction with listener error and catch errors
										interaction.cancel(listenerError).catch(function(error) {
										
										// Finally
										}).finally(function() {
										
											// Trigger a fatal error
											new FatalError(FatalError.DATABASE_ERROR);
										});
									});
								}
								
								// Otherwise
								else {
								
									// Release wallet's exclusive transactions lock
									self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
									
									// Check if promise reject exists
									if(typeof promiseReject !== "undefined") {
								
										// Reject promise
										promiseReject(error);
									}
								
									// Cancel interaction with listener error and catch errors
									interaction.cancel(listenerError).catch(function(error) {
									
									});
								}
							});
						}
						
						// Otherwise
						else {
						
							// Release wallet's exclusive transactions lock
							self.transactions.releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
							
							// Check if promise reject exists
							if(typeof promiseReject !== "undefined") {
						
								// Reject promise
								promiseReject(Listener.NOT_FOUND_RESPONSE);
							}
						
							// Cancel interaction with not found response and catch errors
							interaction.cancel(Listener.NOT_FOUND_RESPONSE).catch(function(error) {
							
							});
						}
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Check if promise reject exists
					if(typeof promiseReject !== "undefined") {
				
						// Reject promise
						promiseReject(Listener.NOT_FOUND_RESPONSE);
					}
				
					// Cancel interaction with not found response and catch errors
					interaction.cancel(Listener.NOT_FOUND_RESPONSE).catch(function(error) {
					
					});
				});
			
			// Listener connection open event
			}).on(Listener.CONNECTION_OPEN_EVENT, function() {
			
				// Go through all wallets
				for(var keyPath in self.wallets)
							
					if(self.wallets.hasOwnProperty(keyPath) === true) {
				
						// Get wallet
						var wallet = self.wallets[keyPath];
			
						// Check if wallet has an address suffix
						if(wallet.getAddressSuffix() !== Wallet.NO_ADDRESS_SUFFIX)
						
							// Verify wallet's address suffix
							self.verifyAddressSuffix(wallet.getKeyPath());
					}
			
				// Set unverify address suffixes on close
				self.unverifyAddressSuffixesOnClose = true;
			
			// Listener connection close or settings change event
			}).on(Listener.CONNECTION_CLOSE_EVENT + " " + Listener.SETTINGS_CHANGE_EVENT, function() {
			
				// Check if unverify address suffixes on close
				if(self.unverifyAddressSuffixesOnClose === true) {
				
					// Clear unverify address suffixes on close
					self.unverifyAddressSuffixesOnClose = false;
			
					// Go through all wallets
					for(var keyPath in self.wallets)
								
						if(self.wallets.hasOwnProperty(keyPath) === true) {
					
							// Get wallet
							var wallet = self.wallets[keyPath];
							
							// Set that wallet's address suffix isn't verified
							wallet.setAddressSuffixVerified(false);
						}
				}
			});
			
			// Document wallet hardware type change event
			$(document).on(Wallet.HARDWARE_TYPE_CHANGE_EVENT, function(event, keyPath, newHardwareType) {
			
				// Check if wallet exists
				if(self.walletExists(keyPath.toFixed()) === true) {
				
					// Get wallet
					var wallet = self.wallets[keyPath.toFixed()];
			
					// Save wallet
					self.saveWallet(wallet, function() {
			
						// Return
						return {
						
							// New hardware type value
							[Wallets.NEW_HARDWARE_TYPE_VALUE]: newHardwareType
						};
						
					}).then(function(newValues) {
					
						// Check if wallet exists
						if(self.walletExists(keyPath) === true) {
						
							// Trigger change event
							$(document).trigger(Wallets.CHANGE_EVENT, [
							
								// Key path
								keyPath,
								
								// Change
								Wallets.HARDWARE_TYPE_CHANGED,
								
								// New value
								newValues[Wallets.NEW_HARDWARE_TYPE_VALUE]
							]);
						}
						
					// Catch errors
					}).catch(function(error) {
					
						// Trigger a fatal error
						new FatalError(FatalError.DATABASE_ERROR);
					});
				}
			});
		}
		
		// Start syncing
		startSyncing(ignoreSyncedStatus = false) {
		
			// Check if node is connected
			if(this.node.isConnected() === true) {
			
				// Clear stop syncing
				this.stopSyncing = false;
				
				// Sync
				this.sync(false, ignoreSyncedStatus);
			}
			
			// Otherwise
			else {
			
				// Sync failed
				this.syncFailed();
			}
		}
		
		// Exist
		exist() {
		
			// Return if at least one wallet exists
			return Object.keys(this.wallets)["length"] !== 0;
		}
		
		// Create
		create(name = Wallet.NO_NAME, type = Consensus.getWalletType(), networkType = Consensus.getNetworkType(), syncingStatus = Wallet.STATUS_SYNCING, hardwareWallet = Wallet.NO_HARDWARE_WALLET, passphrase = Wallet.NO_PASSPHRASE, useBip39 = false, bip39Salt = Wallet.NO_BIP39_SALT, startSyncing = false, syncHeight = Wallet.CURRENT_HEIGHT) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if locked
				if(self.isLocked() === true) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The wallets are locked.'));
				}
				
				// Otherwise
				else {
			
					// Create new wallet
					var wallet = new Wallet();
					
					// Get node's current height
					var currentHeight = self.node.getCurrentHeight().getHeight();
					
					// Return initializing wallet
					return wallet.initialize(name, self.password, type, networkType, (syncHeight === Wallet.CURRENT_HEIGHT && currentHeight !== Node.UNKNOWN_HEIGHT && currentHeight.isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === false) ? currentHeight : syncHeight, syncingStatus, hardwareWallet, passphrase, useBip39, bip39Salt, Object.keys(self.wallets).map(function(keyPath) {
					
						// Return wallet
						return self.wallets[keyPath];
					
					})).then(function() {
					
						// Return saving wallet
						return self.saveWallet(wallet).then(function() {
						
							// Request promise
							return new Promise(function(resolve, reject) {
							
								// Check is storage manager is supported
								if(typeof navigator === "object" && navigator !== null && "storage" in navigator === true) {
								
									// Return requesting for storage to be persistent
									return navigator["storage"].persist().then(function() {
									
										// Resolve
										resolve();
										
									// Catch errors
									}).catch(function(error) {
									
										// Resolve
										resolve();
									});
								}
								
								// Otherwise
								else {
								
									// Resolve
									resolve();
								}
								
							}).then(function() {
						
								// Append wallet to list of wallets
								self.wallets[wallet.getKeyPath()] = wallet;
								
								// Check if start syncing
								if(startSyncing === true) {
								
									// Start syncing
									self.startSyncing();
								}
							
								// Resolve wallet
								resolve(wallet);
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Close wallet
							wallet.close();
						
							// Reject error
							reject(Language.getDefaultTranslation('The database failed.'));
						});
						
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
			});
		}
		
		// Unlock
		unlock(password, connectHardwareWallets = false) {
		
			// Lock
			this.lock(false);
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if wallets don't exist
				if(self.exist() === false) {
				
					// Set password
					self.password = (new TextEncoder()).encode(password);
					
					// Resolve
					resolve();
				}
				
				// Otherwise
				else {
				
					// Initialize opening wallets
					var openingWallets = [];
					
					// Initialize password candidate
					var passwordCandidate = (new TextEncoder()).encode(password);
					
					// Go through all wallets
					for(var keyPath in self.wallets) {
								
						if(self.wallets.hasOwnProperty(keyPath) === true) {
					
							// Get wallet
							let wallet = self.wallets[keyPath];
							
							// Append to opening wallets
							openingWallets.push(new Promise(function(resolve, reject) {
							
								// Return opening wallet
								return wallet.open(passwordCandidate).then(function() {
								
									// Resolve
									resolve();
								
								// Catch errors
								}).catch(function(error) {
								
									// Reject error
									reject(error);
								});
							}));
						}
					}
					
					// Return checking if opening all wallets was successful
					return Promise.all(openingWallets).then(function() {
					
						// Set password
						self.password = passwordCandidate;
						
						// Check if connecting hardware wallets
						if(connectHardwareWallets === true) {
						
							// Connect to hardware wallets and catch errors
							self.connectToHardwareWallets().catch(function(error) {
							
							});
							
							// Resolve
							resolve();
						}
						
						// Otherwise
						else {
						
							// Resolve
							resolve();
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Securely clear password candidate
						passwordCandidate.fill(0);
						
						// Reject error
						reject(error);
					});
				}
			});
		}
		
		// Is password
		isPassword(password) {
		
			// Check if locked
			if(this.isLocked() === true) {
			
				// Throw error
				throw Language.getDefaultTranslation('The wallets are locked.');
			}
			
			// Otherwise
			else {
			
				// Initialize password candidate
				var passwordCandidate = (new TextEncoder()).encode(password);
		
				// Set result to if password is correct
				var result = Common.arraysAreEqualTimingSafe(passwordCandidate, this.password) === true;
				
				// Securely clear password candidate
				passwordCandidate.fill(0);
				
				// Return result
				return result;
			}
		}
		
		// Change password
		changePassword(currentPassword, newPassword) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if locked
				if(self.isLocked() === true) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The wallets are locked.'));
				}
				
				// Otherwise check if current password is incorrect
				else if(self.isPassword(currentPassword) === false) {
				
					// Reject error
					reject(Language.getDefaultTranslation('Incorrect password.'));
				}
				
				// Otherwise
				else {
				
					// Initialize password candidate
					var passwordCandidate = (new TextEncoder()).encode(newPassword);
				
					// Initialize new encryption values
					var newEncryptionValues = {};
				
					// Initialize encrypt wallets
					var encryptWallets = [];
					
					// Go through all wallets
					for(let keyPath in self.wallets) {
					
						if(self.wallets.hasOwnProperty(keyPath) === true) {
						
							// Get wallet
							let wallet = self.wallets[keyPath];
							
							// Append encrypting wallet to list
							encryptWallets.push(new Promise(function(resolve, reject) {
							
								// Get random salt
								var salt = crypto.getRandomValues(new Uint8Array(Wallet.SALT_LENGTH));
								
								// Get number of iterations
								var numberOfIterations = Wallet.DEFAULT_NUMBER_OF_ITERATIONS;
								
								// Get random initialization vector
								var initializationVector = crypto.getRandomValues(new Uint8Array(Wallet.INITIALIZATION_VECTOR_LENGTH));
								
								// Check if wallet isn't a hardware wallet
								if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
								
									// Return wallet's encrypting seed and BIP39 salt
									return wallet.encryptSeedAndBip39Salt(passwordCandidate, salt, numberOfIterations, initializationVector).then(function(encryptedSeedAndBip39Salt) {
									
										// Append values to new encryption values
										newEncryptionValues[keyPath] = [
										
											// Salt
											salt,
											
											// Number of iterations
											numberOfIterations,
											
											// Initialization vector
											initializationVector,
											
											// Encrypted seed
											encryptedSeedAndBip39Salt[Wallet.ENCRYPT_SEED_AND_BIP39_SALT_ENCRYPTED_SEED_INDEX],
											
											// Encrypted BIP39 salt
											encryptedSeedAndBip39Salt[Wallet.ENCRYPT_SEED_AND_BIP39_SALT_ENCRYPTED_BIP39_SALT_INDEX]
										];
									
										// Resolve
										resolve();
										
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(error);
									});
								}
								
								// Otherwise
								else {
								
									// Return wallet's encrypting root public key
									return wallet.encryptRootPublicKey(passwordCandidate, salt, numberOfIterations, initializationVector).then(function(encryptedRootPublicKey) {
									
										// Append values to new encryption values
										newEncryptionValues[keyPath] = [
										
											// Salt
											salt,
											
											// Number of iterations
											numberOfIterations,
											
											// Initialization vector
											initializationVector,
											
											// Encrypted root public key
											encryptedRootPublicKey
										];
									
										// Resolve
										resolve();
										
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(error);
									});
								}
							}));
						}
					}
					
					// Return encrypting wallets
					return Promise.all(encryptWallets).then(function() {
					
						// Return creating a database transaction
						return Database.createTransaction(Wallets.OBJECT_STORE_NAME, Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
						
							// Initializ save wallets
							var saveWallets = [];
						
							// Go through all wallets
							for(var keyPath in self.wallets) {
							
								if(self.wallets.hasOwnProperty(keyPath) === true) {
								
									// Check if wallet has new encryption values
									if(keyPath in newEncryptionValues === true) {
								
										// Get wallet
										let wallet = self.wallets[keyPath];
										
										// Get encryption values
										let encryptionValues = newEncryptionValues[keyPath];
										
										// Append saving wallet to list
										saveWallets.push(new Promise(function(resolve, reject) {
										
											// Return saving wallet
											return self.saveWallet(wallet, function() {
											
												// Check if wallet isn't a hardware wallet
												if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
									
													// Return
													return {
													
														// New salt value
														[Wallets.NEW_SALT_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_SALT_INDEX],
														
														// New number of iterations
														[Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_NUMBER_OF_ITERATIONS_INDEX],
													
														// New initialization vector value
														[Wallets.NEW_INITIALIZATION_VECTOR_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_INITIALIZATION_VECTOR_INDEX],
														
														// New encrypted seed
														[Wallets.NEW_ENCRYPTED_SEED_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_ENCRYPTED_SEED_INDEX],
														
														// New encrypted BIP39 salt
														[Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_ENCRYPTED_BIP39_SALT_INDEX]
													};
												}
												
												// Otherwise
												else {
												
													// Return
													return {
													
														// New salt value
														[Wallets.NEW_SALT_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_SALT_INDEX],
														
														// New number of iterations
														[Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_NUMBER_OF_ITERATIONS_INDEX],
													
														// New initialization vector value
														[Wallets.NEW_INITIALIZATION_VECTOR_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_INITIALIZATION_VECTOR_INDEX],
														
														// New encrypted root public key
														[Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE]: encryptionValues[Wallets.CHANGE_PASSWORD_ENCRYPTED_ROOT_PUBLIC_KEY_INDEX]
													};
												}
												
											}, databaseTransaction).then(function() {
											
												// Resolve
												resolve();
											
											// Catch errors
											}).catch(function(error) {
											
												// Reject error
												reject(Language.getDefaultTranslation('The database failed.'));
											});
										}));
									}
									
									// Otherwise
									else {
									
										// Append saving wallet to list
										saveWallets.push(new Promise(function(resolve, reject) {
										
											// Reject error
											reject(Language.getDefaultTranslation('Changing your password failed.'));
										}));
									}
								}
							}
							
							// Return saving all wallets
							return Promise.all(saveWallets).then(function() {
							
								// Return committing database transaction
								return Database.commitTransaction(databaseTransaction).then(function() {
								
									// Go through all wallets
									for(var keyPath in self.wallets) {
									
										if(self.wallets.hasOwnProperty(keyPath) === true) {
										
											// Check if wallet has new encryption values
											if(keyPath in newEncryptionValues === true) {
											
												// Get wallet
												var wallet = self.wallets[keyPath];
												
												// Get encryption values
												var encryptionValues = newEncryptionValues[keyPath];
											
												// Update wallet's salt
												wallet.setSalt(encryptionValues[Wallets.CHANGE_PASSWORD_SALT_INDEX]);
												
												// Update wallet's number of iterations
												wallet.setNumberOfIterations(encryptionValues[Wallets.CHANGE_PASSWORD_NUMBER_OF_ITERATIONS_INDEX]);
												
												// Update wallet's initialization vector
												wallet.setInitializationVector(encryptionValues[Wallets.CHANGE_PASSWORD_INITIALIZATION_VECTOR_INDEX]);
												
												// Check if wallet isn't a hardware wallet
												if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
												
													// Update wallet's encrypted seed
													wallet.setEncryptedSeed(encryptionValues[Wallets.CHANGE_PASSWORD_ENCRYPTED_SEED_INDEX]);
													
													// Update wallet's encrypted BIP39 salt
													wallet.setEncryptedBip39Salt(encryptionValues[Wallets.CHANGE_PASSWORD_ENCRYPTED_BIP39_SALT_INDEX]);
												}
												
												// Otherwise
												else {
												
													// Update wallet's encrypted root public key
													wallet.setEncryptedRootPublicKey(encryptionValues[Wallets.CHANGE_PASSWORD_ENCRYPTED_ROOT_PUBLIC_KEY_INDEX]);
												}
											}
											
											// Otherwise
											else {
											
												// Securely clear password candidate
												passwordCandidate.fill(0);
											
												// Trigger an unknown error
												new FatalError(FatalError.UNKNOWN_ERROR);
												
												// Return
												return;
											}
										}
									}
									
									// Securely clear password
									self.password.fill(0);
									
									// Update password
									self.password = passwordCandidate;
								
									// Resolve
									resolve();
								
								// Catch errors
								}).catch(function(error) {
								
									// Securely clear password candidate
									passwordCandidate.fill(0);
								
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
							
							// Catch errors
							}).catch(function(error) {
							
								// Securely clear password candidate
								passwordCandidate.fill(0);
							
								// Return aborting database transaction
								return Database.abortTransaction(databaseTransaction).then(function() {
							
									// Reject error
									reject(error);
								
								// Catch errors
								}).catch(function(error) {
								
									// Trigger a fatal error
									new FatalError(FatalError.DATABASE_ERROR);
								});
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Securely clear password candidate
							passwordCandidate.fill(0);
						
							// Reject error
							reject(Language.getDefaultTranslation('The database failed.'));
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Securely clear password candidate
						passwordCandidate.fill(0);
					
						// Reject error
						reject(Language.getDefaultTranslation('Changing your password failed.'));
					});
				}
			});
		}
		
		// Change order
		changeOrder(keyPathOne, keyPathTwo) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Try
				try {
				
					// Get wallet one
					var walletOne = self.getWallet(keyPathOne);
					
					// Get wallet two
					var walletTwo = self.getWallet(keyPathTwo);
				}
				
				// Catch errors
				catch(error) {
				
					// Reject error
					reject(error);
					
					// Return
					return;
				}
				
				// Return creating a database transaction
				return Database.createTransaction(Wallets.OBJECT_STORE_NAME, Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
				
					// Get order one
					var orderOne = walletOne.getOrder();
					
					// Get order two
					var orderTwo = walletTwo.getOrder();
				
					// Initialize save unknown orders
					var saveUnknownOrders = [];
				
					// Append saving wallet with unknown order to list
					saveUnknownOrders.push(new Promise(function(resolve, reject) {
					
						// Return saving wallet one
						return self.saveWallet(walletOne, function() {
										
							// Return
							return {
							
								// New order value
								[Wallets.NEW_ORDER_VALUE]: Wallet.UNKNOWN_ORDER
							};
							
						}, databaseTransaction).then(function() {
						
							// Resolve
							resolve();
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}));
					
					// Append saving wallet with unknown order to list
					saveUnknownOrders.push(new Promise(function(resolve, reject) {
					
						// Return saving wallet two
						return self.saveWallet(walletTwo, function() {
										
							// Return
							return {
							
								// New order value
								[Wallets.NEW_ORDER_VALUE]: Wallet.UNKNOWN_ORDER
							};
							
						}, databaseTransaction).then(function() {
						
							// Resolve
							resolve();
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}));
					
					// Return saving all wallets with unknown orders
					return Promise.all(saveUnknownOrders).then(function() {
					
						// Initialize save wallets
						var saveWallets = [];
						
						// Append saving wallet to list
						saveWallets.push(new Promise(function(resolve, reject) {
						
							// Return saving wallet one
							return self.saveWallet(walletOne, function() {
											
								// Return
								return {
								
									// New order value
									[Wallets.NEW_ORDER_VALUE]: orderTwo
								};
								
							}, databaseTransaction).then(function() {
							
								// Resolve
								resolve();
							
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}));
						
						// Append saving wallet to list
						saveWallets.push(new Promise(function(resolve, reject) {
						
							// Return saving wallet two
							return self.saveWallet(walletTwo, function() {
											
								// Return
								return {
								
									// New order value
									[Wallets.NEW_ORDER_VALUE]: orderOne
								};
								
							}, databaseTransaction).then(function() {
							
								// Resolve
								resolve();
							
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}));
						
						// Return saving all wallets
						return Promise.all(saveWallets).then(function() {
					
							// Return committing database transaction
							return Database.commitTransaction(databaseTransaction).then(function() {
							
								// Update wallet one's order
								walletOne.setOrder(orderTwo);
								
								// Update wallet two's order
								walletTwo.setOrder(orderOne);
							
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
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Connect to node and listener
		connectToNodeAndListener(onlyConnectToNode = false) {
		
			// Restart node and don't disconnect first
			this.node.restart(false);
			
			// Check if not only connecting to node
			if(onlyConnectToNode === false) {
			
				// Start listener
				this.listener.start();
			}
		}
		
		// Lock
		lock(closeWallets = true) {
		
			// Check if password exists
			if(this.password !== Wallets.NO_PASSWORD) {
		
				// Securely clear password
				this.password.fill(0);
			
				// Set password to no password
				this.password = Wallets.NO_PASSWORD;
			}
			
			// Check if closing wallets
			if(closeWallets === true) {
			
				// Go through all wallets
				for(var keyPath in this.wallets) {
							
					if(this.wallets.hasOwnProperty(keyPath) === true) {
					
						// Get wallet
						var wallet = this.wallets[keyPath];
						
						// Close wallet
						wallet.close();
					}
				}
			}
		}
		
		// Is locked
		isLocked() {
		
			// Return if password is no password
			return this.password === Wallets.NO_PASSWORD;
		}
		
		// Remove wallet
		removeWallet(keyPath) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if locked
				if(self.isLocked() === true) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The wallets are locked.'));
				}
				
				// Otherwise
				else {
				
					// Return obtaining wallet's exclusive transactions lock
					return self.transactions.obtainWalletsExclusiveTransactionsLock(keyPath).then(function() {
					
						// Check if wallet exists
						if(self.walletExists(keyPath) === true) {
						
							// Get wallet
							var wallet = self.wallets[keyPath];
							
							// Return creating a database transaction
							return Database.createTransaction([
							
								// Wallets object store
								Wallets.OBJECT_STORE_NAME,
								
								// Transactions object store
								Transactions.OBJECT_STORE_NAME,
								
							], Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
		
								// Return deleting wallet from the database
								return Database.deleteResult(Wallets.OBJECT_STORE_NAME, keyPath, databaseTransaction, Database.STRICT_DURABILITY).then(function() {
								
									// Check if wallet exists
									if(self.walletExists(keyPath) === true) {
									
										// Return deleting all wallet's transactions
										return self.transactions.deleteWalletsTransactions(keyPath, databaseTransaction).then(function() {
								
											// Return committing database transaction
											return Database.commitTransaction(databaseTransaction).then(function() {
											
												// Check if wallet's name doesn't exist
												if(wallet.getName() === Wallet.NO_NAME) {
												
													// Log message
													Log.logMessage(Language.getDefaultTranslation('Deleted wallet Wallet %1$s.'), [keyPath.toFixed()]);
												}
												
												// Otherwise
												else {
											
													// Log message
													Log.logMessage(Language.getDefaultTranslation('Deleted wallet %1$y.'), [wallet.getName()]);
												}
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
												
												// Check if wallet exists
												if(self.walletExists(keyPath) === true) {
											
													// Close wallet
													wallet.close();
													
													// Check it wallet has an address suffix
													if(wallet.getAddressSuffix() !== Wallet.NO_ADDRESS_SUFFIX) {
													
														// Delete wallet's address suffix
														self.deleteAddressSuffix(wallet.getAddressSuffix());
														
														// Set wallet's address suffix to no address suffix
														wallet.setAddressSuffix(Wallet.NO_ADDRESS_SUFFIX);
													}
												
													// Remove wallets from list of wallets
													delete self.wallets[keyPath];
												}
												
												// Resolve
												resolve();
											
											// Catch errors
											}).catch(function(error) {
											
												// Return aborting database transaction
												return Database.abortTransaction(databaseTransaction).then(function() {
												
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
													
													// Reject error
													reject(Language.getDefaultTranslation('The database failed.'));
												
												// Catch errors
												}).catch(function(error) {
											
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
													
													// Trigger a fatal error
													new FatalError(FatalError.DATABASE_ERROR);
												});
											});
										
										// Catch errors
										}).catch(function(error) {
										
											// Return aborting database transaction
											return Database.abortTransaction(databaseTransaction).then(function() {
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
												
												// Reject error
												reject(Language.getDefaultTranslation('The database failed.'));
											
											// Catch errors
											}).catch(function(error) {
										
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
												
												// Trigger a fatal error
												new FatalError(FatalError.DATABASE_ERROR);
											});
										});
									}
									
									// Otherwise
									else {
									
										// Return committing database transaction
										return Database.commitTransaction(databaseTransaction).then(function() {
									
											// Release wallet's exclusive transactions lock
											self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
										
											// Resolve
											resolve();
										
										// Catch errors
										}).catch(function(error) {
										
											// Return aborting database transaction
											return Database.abortTransaction(databaseTransaction).then(function() {
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
												
												// Reject error
												reject(Language.getDefaultTranslation('The database failed.'));
											
											// Catch errors
											}).catch(function(error) {
										
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
												
												// Trigger a fatal error
												new FatalError(FatalError.DATABASE_ERROR);
											});
										});
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Return aborting database transaction
									return Database.abortTransaction(databaseTransaction).then(function() {
									
										// Release wallet's exclusive transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
										
										// Reject error
										reject(Language.getDefaultTranslation('The database failed.'));
									
									// Catch errors
									}).catch(function(error) {
								
										// Release wallet's exclusive transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
										
										// Trigger a fatal error
										new FatalError(FatalError.DATABASE_ERROR);
									});
								});
							
							// Catch errors
							}).catch(function(error) {
							
								// Release wallet's exclusive transactions lock
								self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
								
								// Reject error
								reject(Language.getDefaultTranslation('The database failed.'));
							});
						}
						
						// Otherwise
						else {
						
							// Release wallet's exclusive transactions lock
							self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
						
							// Resolve
							resolve();
						}
					});
				}
			});
		}
		
		// Remove all wallets
		removeAllWallets() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Initialize obtain transactions locks
				var obtainTransactionsLocks = [];
				
				// Initialize obtained transactions locks
				var obtainedTransactionsLocks = [];
			
				// Go through all wallets
				for(var keyPath in self.wallets) {
				
					if(self.wallets.hasOwnProperty(keyPath) === true) {
					
						// Get wallet
						let wallet = self.wallets[keyPath];
					
						// Append to obtain transactions locks
						obtainTransactionsLocks.push(new Promise(function(resolve, reject) {
					
							// Return obtaining wallet's exclusive transactions lock
							return self.transactions.obtainWalletsExclusiveTransactionsLock(wallet.getKeyPath()).then(function() {
							
								// Append to obtained transactions locks
								obtainedTransactionsLocks.push(wallet.getKeyPath());
							
								// Resolve
								resolve();
							});
						}));
					}
				}
				
				// Return obtaining transactions locks
				return Promise.all(obtainTransactionsLocks).then(function() {
				
					// Return creating a database transaction
					return Database.createTransaction([
					
						// Wallets object store
						Wallets.OBJECT_STORE_NAME,
						
						// Transactions object store
						Transactions.OBJECT_STORE_NAME,
						
					], Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
			
						// Return deleting all wallets with the wallet type and network type in the database
						return Database.deleteResultsWithValue(Wallets.OBJECT_STORE_NAME, Wallets.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
				
							// Wallet type
							Consensus.getWalletType(),
							
							// Network type
							Consensus.getNetworkType()
							
						]), databaseTransaction, Database.STRICT_DURABILITY).then(function() {
						
							// Return deleting all transactions for wallet's with the wallet type and network type
							return self.transactions.deleteAllTransactions(Consensus.getWalletType(), Consensus.getNetworkType(), databaseTransaction).then(function() {
							
								// Return committing database transaction
								return Database.commitTransaction(databaseTransaction).then(function() {
								
									// Log message
									Log.logMessage(Language.getDefaultTranslation('Deleted all wallets.'));
								
									// Go through all obtained transactions locks
									for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
									
										// Get obtained transactions lock
										var obtainedTransactionsLock = obtainedTransactionsLocks[i];
										
										// Release obtained transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
									}
							
									// Go through all wallets
									for(var keyPath in self.wallets) {
												
										if(self.wallets.hasOwnProperty(keyPath) === true) {
										
											// Get wallet
											var wallet = self.wallets[keyPath];
											
											// Close wallet
											wallet.close();
											
											// Check it wallet has an address suffix
											if(wallet.getAddressSuffix() !== Wallet.NO_ADDRESS_SUFFIX) {
											
												// Delete wallet's address suffix
												self.deleteAddressSuffix(wallet.getAddressSuffix());
												
												// Set wallet's address suffix to no address suffix
												wallet.setAddressSuffix(Wallet.NO_ADDRESS_SUFFIX);
											}
										}
									}
								
									// Clear wallets
									self.wallets = {};
								
									// Lock
									self.lock();
								
									// Resolve
									resolve();
								
								// Catch errore
								}).catch(function(error) {
								
									// Return aborting database transaction
									return Database.abortTransaction(databaseTransaction).then(function() {
									
										// Go through all obtained transactions locks
										for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
										
											// Get obtained transactions lock
											var obtainedTransactionsLock = obtainedTransactionsLocks[i];
											
											// Release obtained transactions lock
											self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
										}
										
										// Reject error
										reject(Language.getDefaultTranslation('The database failed.'));
									
									// Catch errors
									}).catch(function(error) {
								
										// Go through all obtained transactions locks
										for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
										
											// Get obtained transactions lock
											var obtainedTransactionsLock = obtainedTransactionsLocks[i];
											
											// Release obtained transactions lock
											self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
										}
										
										// Trigger a fatal error
										new FatalError(FatalError.DATABASE_ERROR);
									});
								});
							
							// Catch errors
							}).catch(function(error) {
							
								// Return aborting database transaction
								return Database.abortTransaction(databaseTransaction).then(function() {
								
									// Go through all obtained transactions locks
									for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
									
										// Get obtained transactions lock
										var obtainedTransactionsLock = obtainedTransactionsLocks[i];
										
										// Release obtained transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
									}
									
									// Reject error
									reject(Language.getDefaultTranslation('The database failed.'));
								
								// Catch errors
								}).catch(function(error) {
							
									// Go through all obtained transactions locks
									for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
									
										// Get obtained transactions lock
										var obtainedTransactionsLock = obtainedTransactionsLocks[i];
										
										// Release obtained transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
									}
									
									// Trigger a fatal error
									new FatalError(FatalError.DATABASE_ERROR);
								});
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Return aborting database transaction
							return Database.abortTransaction(databaseTransaction).then(function() {
							
								// Go through all obtained transactions locks
								for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
								
									// Get obtained transactions lock
									var obtainedTransactionsLock = obtainedTransactionsLocks[i];
									
									// Release obtained transactions lock
									self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
								}
								
								// Reject error
								reject(Language.getDefaultTranslation('The database failed.'));
							
							// Catch errors
							}).catch(function(error) {
						
								// Go through all obtained transactions locks
								for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
								
									// Get obtained transactions lock
									var obtainedTransactionsLock = obtainedTransactionsLocks[i];
									
									// Release obtained transactions lock
									self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
								}
								
								// Trigger a fatal error
								new FatalError(FatalError.DATABASE_ERROR);
							});
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Go through all obtained transactions locks
						for(var i = 0; i < obtainedTransactionsLocks["length"]; ++i) {
						
							// Get obtained transactions lock
							var obtainedTransactionsLock = obtainedTransactionsLocks[i];
							
							// Release obtained transactions lock
							self.transactions.releaseWalletsExclusiveTransactionsLock(obtainedTransactionsLock);
						}
					
						// Reject error
						reject(Language.getDefaultTranslation('The database failed.'));
					});
				});
			});
		}
		
		// Wallet exists
		walletExists(keyPath) {
		
			// Return if wallet exists
			return keyPath in this.wallets === true;
		}
		
		// Get wallet
		getWallet(keyPath) {
		
			// Check if locked
			if(this.isLocked() === true) {
			
				// Throw error
				throw Language.getDefaultTranslation('The wallets are locked.');
			}
			
			// Otherwise check if wallet doesn't exist
			else if(this.walletExists(keyPath) === false) {
			
				// Throw error
				throw Language.getDefaultTranslation('The wallet doesn\'t exist.');
			}
			
			// Otherwise
			else {
	
				// Return wallet
				return this.wallets[keyPath];
			}
		}
		
		// Get wallets
		getWallets() {
		
			// Check if locked
			if(this.isLocked() === true) {
			
				// Throw error
				throw Language.getDefaultTranslation('The wallets are locked.');
			}
			
			// Otherwise
			else {
	
				// Return wallets
				return this.wallets;
			}
		}
		
		// Get wallets in order
		getWalletsInOrder() {
		
			// Check if locked
			if(this.isLocked() === true) {
			
				// Throw error
				throw Language.getDefaultTranslation('The wallets are locked.');
			}
			
			// Otherwise
			else {
		
				// Initialize wallets in order
				var walletsInOrder = [];
			
				// Go through all wallets
				for(var keyPath in this.wallets) {
				
					if(this.wallets.hasOwnProperty(keyPath) === true) {
				
						// Get wallet
						var wallet = this.wallets[keyPath];
						
						// Append wallet to list
						walletsInOrder.push(wallet);
					}
				}
				
				// Sort wallets by order
				walletsInOrder.sort(function(walletOne, walletTwo) {
			
					// Check if wallet one's order is greater than wallet two's
					if(walletOne.getOrder() > walletTwo.getOrder()) {
					
						// Return sort greater than
						return Common.SORT_GREATER_THAN;
					}
					
					// Check if wallet one's order is less than wallet two's
					else if(walletOne.getOrder() < walletTwo.getOrder()) {
					
						// Return sort less than
						return Common.SORT_LESS_THAN;
					}
					
					// Otherwise
					else {
					
						// Return sort equal
						return Common.SORT_EQUAL;
					}
				});
				
				// Return wallets in order
				return walletsInOrder;
			}
		}
		
		// Resync wallet
		resyncWallet(keyPath) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallet(keyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Reject error
					reject(error);
					
					// Return
					return;
				}
				
				// Return create a database transaction
				return Database.createTransaction(Wallets.OBJECT_STORE_NAME, Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
				
					// Return saving wallet
					return self.saveWallet(wallet, function() {
										
						// Return
						return {
						
							// New synced height value
							[Wallets.NEW_SYNCED_HEIGHT_VALUE]: new BigNumber((wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE && wallet.getUseBip39() === false) ? Consensus.FIRST_BLOCK_HEIGHT : Consensus.HARDWARE_WALLET_STARTING_HEIGHT)
						};
						
					}, databaseTransaction).then(function() {
					
						// Return committing database transaction
						return Database.commitTransaction(databaseTransaction).then(function() {
						
							// Set wallet's synced height to the first block height
							wallet.setSyncedHeight(new BigNumber((wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE && wallet.getUseBip39() === false) ? Consensus.FIRST_BLOCK_HEIGHT : Consensus.HARDWARE_WALLET_STARTING_HEIGHT));
						
							// Clear wallet's last sync index
							wallet.setLastSyncIndex(Wallet.NO_SYNC_INDEX);
							
							// Update wallet's starting sync height
							wallet.setStartingSyncHeight(wallet.getSyncedHeight());
							
							// Set wallet's percent synced
							wallet.setPercentSynced(new BigNumber(Wallets.MINIMUM_PERCENT));
						
							// Set wallet's syncing status to resyncing
							wallet.setSyncingStatus(Wallet.STATUS_RESYNCING);
							
							// Check if wallet exists
							if(self.walletExists(keyPath) === true) {
								
								// Trigger sync start event
								$(self).trigger(Wallets.SYNC_START_EVENT, [
								
									// Key path
									keyPath,
									
									// Percent complete
									new BigNumber(Wallets.MINIMUM_PERCENT),
									
									// Last percent in group
									false
								]);
								
								// Set timeout
								setTimeout(function() {
								
									// Start syncing
									self.startSyncing();
								
								}, Wallets.RESYNC_DELAY_MILLISECONDS);
								
								// Resolve
								resolve();
							}
							
							// Otherwise
							else {
							
								// Reject error
								reject(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
							}
						
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
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Rename wallet
		renameWallet(keyPath, name) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallet(keyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Reject error
					reject(error);
					
					// Return
					return;
				}
				
				// Return create a database transaction
				return Database.createTransaction(Wallets.OBJECT_STORE_NAME, Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
				
					// Return saving wallet
					return self.saveWallet(wallet, function() {
										
						// Return
						return {
						
							// New name value
							[Wallets.NEW_NAME_VALUE]: name
						};
						
					}, databaseTransaction).then(function(newValues) {
					
						// Return committing database transaction
						return Database.commitTransaction(databaseTransaction).then(function() {
						
							// Get old name
							var oldName = wallet.getName();
						
							// Update wallet's name
							wallet.setName(newValues[Wallets.NEW_NAME_VALUE]);
							
							// Check if wallet exists
							if(self.walletExists(keyPath) === true) {
							
								// Check if old name doesn't exist
								if(oldName === Wallet.NO_NAME) {
								
									// Log message
									Log.logMessage(Language.getDefaultTranslation('Renamed wallet Wallet %1$s to %2$y.'), [
									
										// Key path
										keyPath.toFixed(),
										
										// New name
										newValues[Wallets.NEW_NAME_VALUE]
									]);
								}
								
								// Otherwise
								else {
							
									// Log message
									Log.logMessage(Language.getDefaultTranslation('Renamed wallet %1$y to %2$y.'), [
									
										// Old name
										oldName,
										
										// New name
										newValues[Wallets.NEW_NAME_VALUE]
									]);
								}
								
								// Trigger change event
								$(document).trigger(Wallets.CHANGE_EVENT, [
								
									// Key path
									keyPath,
									
									// Change
									Wallets.NAME_CHANGED,
									
									// New value
									newValues[Wallets.NEW_NAME_VALUE]
								]);
								
								// Resolve
								resolve();
							}
							
							// Otherwise
							else {
							
								// Reject error
								reject(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
							}
						
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
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Get fee
		getFee(keyPath, amount = Api.ALL_AMOUNT, baseFee = Api.DEFAULT_BASE_FEE, cancelOccurred = Common.NO_CANCEL_OCCURRED, walletsExclusiveTransactionsLockObtained = false) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if cancel didn't occur
				if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
			
					// Try
					try {
					
						// Get wallet
						var wallet = self.getWallet(keyPath);
					}
					
					// Catch errors
					catch(error) {
					
						// Reject error
						reject(error);
						
						// Return
						return;
					}
					
					// Check if wallet isn't synced
					if(wallet.isSynced() === false) {
					
						// Reject error
						reject(Language.getDefaultTranslation('The wallet isn\'t synced.'));
					}
					
					// Otherwise
					else {
					
						// Obtain wallet's exclusive transactions lock
						var obtainWalletsExclusiveTransactionsLock = function() {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if cancel didn't occur
								if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
							
									// Check if wallet's exclusive transactions lock isn't already obtained
									if(walletsExclusiveTransactionsLockObtained === false) {
									
										// Return obtaining wallet's exclusive transactions lock
										return self.transactions.obtainWalletsExclusiveTransactionsLock(keyPath).then(function() {
										
											// Check if cancel didn't occur
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
										
												// Resolve
												resolve();
											}
											
											// Otherwise
											else {
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
											}
										});
									}
									
									// Otherwise
									else {
									
										// Resolve
										resolve();
									}
								}
								
								// Otherwise
								else {
								
									// Reject canceled error
									reject(Common.CANCELED_ERROR);
								}
							});
						};
			
						// Return obtaining wallet's exclusive transactions lock
						return obtainWalletsExclusiveTransactionsLock().then(function() {
						
							// Check if cancel didn't occur
							if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
						
								// Return getting fee
								return self.api.getFee(wallet, amount, baseFee, cancelOccurred).then(function(fee) {
								
									// Check if wallet's exclusive transactions lock isn't already obtained
									if(walletsExclusiveTransactionsLockObtained === false) {
								
										// Release wallet's exclusive transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
									}
									
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
									
										// Resolve fee
										resolve(fee);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
									
								// Catch errors
								}).catch(function(error) {
								
									// Check if wallet's exclusive transactions lock isn't already obtained
									if(walletsExclusiveTransactionsLockObtained === false) {
									
										// Release wallet's exclusive transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
									}
									
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
								
										// Reject error
										reject(error);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
								});
							}
							
							// Otherwise
							else {
							
								// Check if wallet's exclusive transactions lock isn't already obtained
								if(walletsExclusiveTransactionsLockObtained === false) {
							
									// Release wallet's exclusive transactions lock
									self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
								}
								
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check if cancel didn't occur
							if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
						
								// Reject error
								reject(error);
							}
							
							// Otherwise
							else {
							
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
						});
					}
				}
				
				// Otherwise
				else {
				
					// Reject canceled error
					reject(Common.CANCELED_ERROR);
				}
			});
		}
		
		// Send
		send(keyPath, destination, amount, fee, baseFee = Api.DEFAULT_BASE_FEE, message = SlateParticipant.NO_MESSAGE, sendAsFile = false, cancelOccurred = Common.NO_CANCEL_OCCURRED, walletsExclusiveTransactionsLockObtained = false) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if cancel didn't occur
				if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
			
					// Try
					try {
					
						// Get wallet
						var wallet = self.getWallet(keyPath);
					}
					
					// Catch errors
					catch(error) {
					
						// Reject error
						reject(Message.createText(error));
						
						// Return
						return;
					}
					
					// Check if wallet isn't synced
					if(wallet.isSynced() === false) {
					
						// Reject error
						reject(Message.createText(Language.getDefaultTranslation('The wallet isn\'t synced.')));
					}
					
					// Otherwise
					else {
					
						// Obtain wallet's exclusive transactions lock
						var obtainWalletsExclusiveTransactionsLock = function() {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if cancel didn't occur
								if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
							
									// Check if wallet's exclusive transactions lock isn't already obtained
									if(walletsExclusiveTransactionsLockObtained === false) {
									
										// Return obtaining wallet's exclusive transactions lock
										return self.transactions.obtainWalletsExclusiveTransactionsLock(keyPath).then(function() {
										
											// Check if cancel didn't occur
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
										
												// Resolve
												resolve();
											}
											
											// Otherwise
											else {
											
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
											}
										});
									}
									
									// Otherwise
									else {
									
										// Resolve
										resolve();
									}
								}
								
								// Otherwise
								else {
								
									// Reject canceled error
									reject(Common.CANCELED_ERROR);
								}
							});
						};
			
						// Return obtaining wallet's exclusive transactions lock
						return obtainWalletsExclusiveTransactionsLock().then(function() {
						
							// Check if cancel didn't occur
							if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
						
								// Get wallet's last identifier
								var lastIdentifier = wallet.getLastIdentifier();
							
								// Return sending
								return self.api.send(wallet, destination, amount, fee, baseFee, self.numberOfConfirmations, message, Slate.NO_LOCK_HEIGHT, Slate.NO_RELATIVE_HEIGHT, Slate.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT, sendAsFile, cancelOccurred).then(function(value) {
								
									// Return creating a database transaction
									return Database.createTransaction([
									
										// Wallets object store
										Wallets.OBJECT_STORE_NAME,
										
										// Transactions object store
										Transactions.OBJECT_STORE_NAME,
										
									], Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
									
										// Return saving updated transactions
										return self.transactions.saveTransactions(value[Api.SEND_UPDATED_TRANSACTIONS_INDEX], databaseTransaction).then(function() {
										
											// Check if wallet exists
											if(self.walletExists(keyPath) === true) {
											
												// Return saving wallet
												return self.saveWallet(wallet, function() {
												
													// Return
													return {
													
														// New locked amount value
														[Wallets.NEW_LOCKED_AMOUNT_VALUE]: wallet.getLockedAmount().plus(value[Api.SEND_LOCKED_AMOUNT_INDEX]),
														
														// New unconfirmed amount value
														[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]: wallet.getUnconfirmedAmount().plus(value[Api.SEND_UNCONFIRMED_AMOUNT_INDEX]),
														
														// New unspent amount value
														[Wallets.NEW_UNSPENT_AMOUNT_VALUE]: wallet.getUnspentAmount().minus(value[Api.SEND_LOCKED_AMOUNT_INDEX])
													};
													
												}, databaseTransaction).then(function(newValues) {
												
													// Check if wallet exists
													if(self.walletExists(keyPath) === true) {
													
														// Return committing database transaction
														return Database.commitTransaction(databaseTransaction).then(function() {
														
															// Check if wallet's exclusive transactions lock isn't already obtained
															if(walletsExclusiveTransactionsLockObtained === false) {
														
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
															}
														
															// Update wallet's locked amount
															wallet.setLockedAmount(newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE]);
														
															// Update wallet's unconfirmed amount
															wallet.setUnconfirmedAmount(newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]);
															
															// Update wallet's unspent amount
															wallet.setUnspentAmount(newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]);
															
															// Check if wallet exists
															if(self.walletExists(keyPath) === true) {
															
																// Check if wallet's unspent amount changed
																if(value[Api.SEND_LOCKED_AMOUNT_INDEX].isZero() === false) {
														
																	// Trigger change event
																	$(document).trigger(Wallets.CHANGE_EVENT, [
																	
																		// Key path
																		keyPath,
																		
																		// Change
																		Wallets.UNSPENT_AMOUNT_CHANGED,
																		
																		// New value
																		newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]
																	]);
																}
																
																// Check if wallet's unconfirmed amount changed
																if(value[Api.SEND_UNCONFIRMED_AMOUNT_INDEX].isZero() === false) {
														
																	// Trigger change event
																	$(document).trigger(Wallets.CHANGE_EVENT, [
																	
																		// Key path
																		keyPath,
																		
																		// Change
																		Wallets.UNCONFIRMED_AMOUNT_CHANGED,
																		
																		// New value
																		newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]
																	]);
																}
																
																// Trigger transactions change event
																$(self.transactions).trigger(Transactions.CHANGE_EVENT, [
																
																	// Transactions
																	value[Api.SEND_UPDATED_TRANSACTIONS_INDEX]
																]);
															}
															
															// Resolve
															resolve();
														
														// Catch errors
														}).catch(function(error) {
														
															// Return aborting database transaction
															return Database.abortTransaction(databaseTransaction).catch(function() {
															
															// Finally
															}).finally(function() {
															
																// Check if wallet exists and wallet's last identifier changed
																if(self.walletExists(keyPath) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
																
																	// Return saving wallet and catch errors
																	return self.saveWallet(wallet).catch(function(error) {
																	
																	// Finally
																	}).finally(function() {
																	
																		// Check if wallet's exclusive transactions lock isn't already obtained
																		if(walletsExclusiveTransactionsLockObtained === false) {
																	
																			// Release wallet's exclusive transactions lock
																			self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																		}
																	
																		// Trigger a fatal error
																		new FatalError(FatalError.DATABASE_ERROR);
																	});
																}
																
																// Otherwise
																else {
																
																	// Check if wallet's exclusive transactions lock isn't already obtained
																	if(walletsExclusiveTransactionsLockObtained === false) {
																
																		// Release wallet's exclusive transactions lock
																		self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																	}
																	
																	// Trigger a fatal error
																	new FatalError(FatalError.DATABASE_ERROR);
																}
															});
														});
													}
													
													// Otherwise
													else {
													
														// Return aborting database transaction
														return Database.abortTransaction(databaseTransaction).then(function() {
														
															// Check if wallet's exclusive transactions lock isn't already obtained
															if(walletsExclusiveTransactionsLockObtained === false) {
														
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
															}
															
															// Resolve
															resolve();
														
														// Catch errors
														}).catch(function() {
														
															// Check if wallet's exclusive transactions lock isn't already obtained
															if(walletsExclusiveTransactionsLockObtained === false) {
														
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
															}
															
															// Trigger a fatal error
															new FatalError(FatalError.DATABASE_ERROR);
														});
													}
												
												// Catch errors
												}).catch(function(error) {
												
													// Return aborting database transaction
													return Database.abortTransaction(databaseTransaction).catch(function() {
													
													// Finally
													}).finally(function() {
													
														// Check if wallet exists and wallet's last identifier changed
														if(self.walletExists(keyPath) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
														
															// Return saving wallet and catch errors
															return self.saveWallet(wallet).catch(function(error) {
															
															// Finally
															}).finally(function() {
															
																// Check if wallet's exclusive transactions lock isn't already obtained
																if(walletsExclusiveTransactionsLockObtained === false) {
															
																	// Release wallet's exclusive transactions lock
																	self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																}
																
																// Trigger a fatal error
																new FatalError(FatalError.DATABASE_ERROR);
															});
														}
														
														// Otherwise
														else {
														
															// Check if wallet's exclusive transactions lock isn't already obtained
															if(walletsExclusiveTransactionsLockObtained === false) {
														
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
															}
															
															// Trigger a fatal error
															new FatalError(FatalError.DATABASE_ERROR);
														}
													});
												});
											}
											
											// Otherwise
											else {
											
												// Return aborting database transaction
												return Database.abortTransaction(databaseTransaction).then(function() {
												
													// Check if wallet's exclusive transactions lock isn't already obtained
													if(walletsExclusiveTransactionsLockObtained === false) {
												
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
													}
													
													// Resolve
													resolve();
												
												// Catch errors
												}).catch(function() {
												
													// Check if wallet's exclusive transactions lock isn't already obtained
													if(walletsExclusiveTransactionsLockObtained === false) {
												
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
													}
													
													// Trigger a fatal error
													new FatalError(FatalError.DATABASE_ERROR);
												});
											}
										
										// Catch errors
										}).catch(function(error) {
										
											// Return aborting database transaction
											return Database.abortTransaction(databaseTransaction).catch(function() {
											
											// Finally
											}).finally(function() {
											
												// Check if wallet exists and wallet's last identifier changed
												if(self.walletExists(keyPath) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
												
													// Return saving wallet and catch errors
													return self.saveWallet(wallet).catch(function(error) {
													
													// Finally
													}).finally(function() {
													
														// Check if wallet's exclusive transactions lock isn't already obtained
														if(walletsExclusiveTransactionsLockObtained === false) {
													
															// Release wallet's exclusive transactions lock
															self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
														}
														
														// Trigger a fatal error
														new FatalError(FatalError.DATABASE_ERROR);
													});
												}
												
												// Otherwise
												else {
												
													// Check if wallet's exclusive transactions lock isn't already obtained
													if(walletsExclusiveTransactionsLockObtained === false) {
												
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
													}
													
													// Trigger a fatal error
													new FatalError(FatalError.DATABASE_ERROR);
												}
											});
										});
									
									// Catch errors
									}).catch(function(error) {
									
										// Check if wallet exists and wallet's last identifier changed
										if(self.walletExists(keyPath) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
										
											// Return saving wallet and catch errors
											return self.saveWallet(wallet).catch(function(error) {
											
											// Finally
											}).finally(function() {
											
												// Check if wallet's exclusive transactions lock isn't already obtained
												if(walletsExclusiveTransactionsLockObtained === false) {
											
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
												}
												
												// Trigger a fatal error
												new FatalError(FatalError.DATABASE_ERROR);
											});
										}
										
										// Otherwise
										else {
										
											// Check if wallet's exclusive transactions lock isn't already obtained
											if(walletsExclusiveTransactionsLockObtained === false) {
										
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
											}
											
											// Trigger a fatal error
											new FatalError(FatalError.DATABASE_ERROR);
										}
									});
								
								// Catch errors
								}).catch(function(error) {
									
									// Check if wallet exists and wallet's last identifier changed
									if(self.walletExists(keyPath) === true && wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER && (lastIdentifier === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().equalsValue(lastIdentifier) === false)) {
									
										// Return saving wallet
										return self.saveWallet(wallet).then(function() {
										
											// Check if wallet's exclusive transactions lock isn't already obtained
											if(walletsExclusiveTransactionsLockObtained === false) {
										
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
											}
											
											// Check if cancel didn't occur
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
										
												// Reject error
												reject(error);
											}
											
											// Otherwise
											else {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
											}
										
										// Catch errors
										}).catch(function(error) {
										
											// Check if wallet's exclusive transactions lock isn't already obtained
											if(walletsExclusiveTransactionsLockObtained === false) {
										
												// Release wallet's exclusive transactions lock
												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
											}
											
											// Trigger a fatal error
											new FatalError(FatalError.DATABASE_ERROR);
										});
									}
									
									// Otherwise
									else {
									
										// Check if wallet's exclusive transactions lock isn't already obtained
										if(walletsExclusiveTransactionsLockObtained === false) {
									
											// Release wallet's exclusive transactions lock
											self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
										}
										
										// Check if cancel didn't occur
										if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
									
											// Reject error
											reject(error);
										}
										
										// Otherwise
										else {
										
											// Reject canceled error
											reject(Common.CANCELED_ERROR);
										}
									}
								});
							}
							
							// Otherwise
							else {
							
								// Check if wallet's exclusive transactions lock isn't already obtained
								if(walletsExclusiveTransactionsLockObtained === false) {
							
									// Release wallet's exclusive transactions lock
									self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
								}
								
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check if cancel didn't occur
							if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
						
								// Reject error
								reject(error);
							}
							
							// Otherwise
							else {
							
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
						});
					}
				}
				
				// Otherwise
				else {
				
					// Reject canceled error
					reject(Common.CANCELED_ERROR);
				}
			});
		}
		
		// Create address suffix
		createAddressSuffix(keyPath, ignorePerformingAddressSuffixOperation = false) {
			
			// Check if wallet exists
			if(this.walletExists(keyPath) === true) {
			
				// Get wallet
				var wallet = this.wallets[keyPath];
				
				// Check if wallet isn't performing an address suffix operation or ignoring performing address suffix operation
				if(wallet.getPerformingAddressSuffixOperation() === false || ignorePerformingAddressSuffixOperation === true) {
		
					// Set that wallet is performing an address suffix operation
					wallet.setPerformingAddressSuffixOperation(true);
					
					// Set self
					var self = this;
				
					// Have listener create a URL
					this.listener.createUrl().then(function(url) {
					
						// Check if wallet exists
						if(self.walletExists(keyPath) === true) {
						
							// Get old address suffix
							var oldAddressSuffix = wallet.getAddressSuffix();
							
							// Save wallet
							self.saveWallet(wallet, function() {
										
								// Return
								return {
								
									// New address suffix value
									[Wallets.NEW_ADDRESS_SUFFIX_VALUE]: url
								};
								
							}).then(function() {
							
								// Check if wallet exists
								if(self.walletExists(keyPath) === true) {
							
									// Check if wallet has a old address suffix
									if(oldAddressSuffix !== Wallet.NO_ADDRESS_SUFFIX) {
								
										// Delete wallet's old address suffix
										self.deleteAddressSuffix(oldAddressSuffix);
									}
								
									// Set that wallet's address suffix is verified
									wallet.setAddressSuffixVerified(true);
								
									// Set that wallet isn't performing an address suffix operation
									wallet.setPerformingAddressSuffixOperation(false);
									
									// Check if wallet's address suffix changed
									if(oldAddressSuffix !== url) {
									
										// Trigger change event
										$(document).trigger(Wallets.CHANGE_EVENT, [
										
											// Key path
											keyPath,
											
											// Change
											Wallets.ADDRESS_SUFFIX_CHANGED,
											
											// New value
											url
										]);
									}
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Delete address suffix
								self.deleteAddressSuffix(url);
								
								// Create address suffix
								self.createAddressSuffix(keyPath, true);
							});
						}
						
						// Otherwise
						else {
						
							// Delete address suffix
							self.deleteAddressSuffix(url);
				
							// Set that wallet isn't performing an address suffix operation
							wallet.setPerformingAddressSuffixOperation(false);
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Check if wallet exists
						if(self.walletExists(keyPath) === true) {
						
							// Create address suffix
							self.createAddressSuffix(keyPath, true);
						}
						
						// Otherwise
						else {
				
							// Set that wallet isn't performing an address suffix operation
							wallet.setPerformingAddressSuffixOperation(false);
						}
					});
				}
			}
		}
		
		// Verify address suffix
		verifyAddressSuffix(keyPath, ignorePerformingAddressSuffixOperation = false) {
		
			// Check if wallet exists
			if(this.walletExists(keyPath) === true) {
			
				// Get wallet
				var wallet = this.wallets[keyPath];
			
				// Check if wallet's address suffix isn't already verified
				if(wallet.getAddressSuffixVerified() === false) {
			
					// Check if wallet isn't performing an address suffix operation or ignoring performing address suffix operation
					if(wallet.getPerformingAddressSuffixOperation() === false || ignorePerformingAddressSuffixOperation === true) {
			
						// Set that wallet is performing an address suffix operation
						wallet.setPerformingAddressSuffixOperation(true);
						
						// Get wallet's address suffix
						var addressSuffix = wallet.getAddressSuffix();
						
						// Set self
						var self = this;
				
						// Have listener check if owns URL
						this.listener.ownsUrl(addressSuffix).then(function(ownsUrl) {
						
							// Check if wallet exists
							if(self.walletExists(keyPath) === true) {
					
								// Check if owns URL
								if(ownsUrl === true) {
								
									// Set that wallet's address suffix is verified
									wallet.setAddressSuffixVerified(true);
								
									// Set that wallet isn't performing an address suffix operation
									wallet.setPerformingAddressSuffixOperation(false);
								}
								
								// Otherwise
								else {
								
									// Create address suffix
									self.createAddressSuffix(keyPath, true);
								}
							}
							
							// Otherwise
							else {
							
								// Check if owns URL
								if(ownsUrl === true) {
							
									// Delete address suffix
									self.deleteAddressSuffix(addressSuffix);
								}
					
								// Set that wallet isn't performing an address suffix operation
								wallet.setPerformingAddressSuffixOperation(false);
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check if wallet exists
							if(self.walletExists(keyPath) === true) {
							
								// Verify address suffix
								self.verifyAddressSuffix(keyPath, true);
							}
							
							// Otherwise
							else {
					
								// Set that wallet isn't performing an address suffix operation
								wallet.setPerformingAddressSuffixOperation(false);
							}
						});
					}
				}
			}
		}
		
		// Change address suffix
		changeAddressSuffix(keyPath) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallet(keyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Reject error
					reject(Message.createText(error));
					
					// Return
					return;
				}
				
				// Check if listener is connected
				if(self.listener.isConnected() === true) {
				
					// Check if wallet isn't performing an address suffix operation
					if(wallet.getPerformingAddressSuffixOperation() === false) {
			
						// Set that wallet is performing an address suffix operation
						wallet.setPerformingAddressSuffixOperation(true);
						
						// Get wallet's address suffix
						var addressSuffix = wallet.getAddressSuffix();
						
						// Return having listener change the URL
						return self.listener.changeUrl(addressSuffix).then(function(url) {
						
							// Return saving wallet
							return self.saveWallet(wallet, function() {
										
								// Return
								return {
								
									// New address suffix value
									[Wallets.NEW_ADDRESS_SUFFIX_VALUE]: url
								};
								
							}).then(function() {
							
								// Check if wallet exists
								if(self.walletExists(keyPath) === true) {
							
									// Set that wallet's address suffix is verified
									wallet.setAddressSuffixVerified(true);
								
									// Set that wallet isn't performing an address suffix operation
									wallet.setPerformingAddressSuffixOperation(false);
									
									// Trigger change event
									$(document).trigger(Wallets.CHANGE_EVENT, [
									
										// Key path
										keyPath,
										
										// Change
										Wallets.ADDRESS_SUFFIX_CHANGED,
										
										// New value
										url
									]);
								}
								
								// Resolve
								resolve();
							
							// Catch errors
							}).catch(function(error) {
							
								// Delete address suffix
								self.deleteAddressSuffix(url);
								
								// Set that wallet's address suffix isn't verified
								wallet.setAddressSuffixVerified(false);
								
								// Set timeout
								setTimeout(function() {
								
									// Create address suffix
									self.createAddressSuffix(keyPath, true);
								}, 0);
								
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('The database failed.')));
							});
							
						// Catch errors
						}).catch(function(error) {
						
							// Set that wallet isn't performing an address suffix operation
							wallet.setPerformingAddressSuffixOperation(false);
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Reject error
						reject(Message.createText(Language.getDefaultTranslation('An operation is currently being performed on the wallet\'s address suffix.')));
					}
				
				}
					
				// Otherwise
				else {
				
					// Reject error
					reject(Message.createText(Language.getDefaultTranslation('You aren\'t connected to a listener.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to change address suffixes without being connected to a listener.')));
				}
			});
		}
		
		// Delete address suffix
		deleteAddressSuffix(addressSuffix) {
		
			// Set self
			var self = this;
		
			// Have listener delete URL and catch errors
			this.listener.deleteUrl(addressSuffix).catch(function(error) {
			
				// Delete address suffix
				self.deleteAddressSuffix(addressSuffix);
			});
		}
		
		// Wait for hardware wallet to connect
		waitForHardwareWalletToConnect(keyPath, text, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Otherwise check if wallet doesn't exist
				if(self.walletExists(keyPath) === false) {
				
					// Reject error
					reject("Wallet doesn\'t exist.");
				}
				
				// Otherwise
				else {
				
					// Get wallet
					var wallet = self.wallets[keyPath];
					
					// Check if wallet isn't open(
					if(wallet.isOpen() === false) {
					
						// Reject error
						reject("Wallet isn't open.");
					}
					
					// Otherwise check if wallet isn't a hardware wallet
					else if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
					
						// Reject error
						reject("Wallet isn't a hardware wallet.");
					}
					
					// Otherwise check if the wallet's hardware wallet isn't connected
					else if(wallet.isHardwareConnected() === false) {
					
						// Return application showing hardware wallet connect message
						return self.application.showHardwareWalletConnectMessage(wallet, text, textArguments, allowUnlock, preventMessages, cancelOccurred).then(function() {
						
							// Resolve
							resolve();
						
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
				}
			});
		}
		
		// Wait for hardware wallet to approve
		waitForHardwareWalletToApprove(keyPath, text, allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Otherwise check if wallet doesn't exist
				if(self.walletExists(keyPath) === false) {
				
					// Reject error
					reject("Wallet doesn\'t exist.");
				}
				
				// Otherwise
				else {
				
					// Get wallet
					var wallet = self.wallets[keyPath];
					
					// Check if wallet isn't open(
					if(wallet.isOpen() === false) {
					
						// Reject error
						reject("Wallet isn't open.");
					}
					
					// Otherwise check if wallet isn't a hardware wallet
					else if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
					
						// Reject error
						reject("Wallet isn't a hardware wallet.");
					}
					
					// Otherwise check if the wallet's hardware wallet isn't connected
					else if(wallet.isHardwareConnected() === false) {
					
						// Reject hardware wallet disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
					
					// Otherwise
					else {
					
						// Return application showing hardware wallet pending message
						return self.application.showHardwareWalletPendingMessage(wallet.getHardwareWallet(), text, allowUnlock, preventMessages, cancelOccurred).then(function(canceled) {
						
							// Resolve canceled
							resolve(canceled);
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
				}
			});
		}
		
		// Hardware wallet done approving
		hardwareWalletDoneApproving(preventMessages = false) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return setting that application hardware wallet pending message is done
				return self.application.hardwareWalletPendingMessageDone(preventMessages).then(function() {
				
					// Resolve
					resolve();
				});
			});
		}
		
		// Obtain exclusive hardware lock
		obtainExclusiveHardwareLock() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive hardware lock is locked
				if(self.exclusiveHardwareLock === true) {
				
					// Get current exclusive hardware lock release event index
					var index = self.exclusiveHardwareLockReleaseEventIndex++;
					
					// Check if current exclusive hardware lock release event index is at the max safe integer
					if(index === Number.MAX_SAFE_INTEGER)
					
						// Reset exclusive hardware lock release event index
						self.exclusiveHardwareLockReleaseEventIndex = 0;
					
					// Exclusive hardware lock release index event
					$(self).on(Wallets.EXCLUSIVE_HARDWARE_LOCK_RELEASE_EVENT + "." + index.toFixed(), function(event) {
					
						// Check if exclusive hardware lock isn't locked
						if(self.exclusiveHardwareLock === false) {
						
							// Turn off exclusive hardware lock release index event
							$(self).off(Wallets.EXCLUSIVE_HARDWARE_LOCK_RELEASE_EVENT + "." + index.toFixed());
						
							// Lock exclusive hardware lock
							self.exclusiveHardwareLock = true;
							
							// Resolve
							resolve();
						}
					});
				}
				
				// Otherwise
				else {
				
					// Lock the exclusive hardware lock
					self.exclusiveHardwareLock = true;
					
					// Resolve
					resolve();
				}
			});
		}
		
		// Release exclusive hardware lock
		releaseExclusiveHardwareLock() {
		
			// Check if exclusive hardware lock is locked
			if(this.exclusiveHardwareLock === true) {
			
				// Set self
				var self = this;
			
				// Set timeout
				setTimeout(function() {
			
					// Unlock exclusive hardware lock
					self.exclusiveHardwareLock = false;
					
					// Trigger exclusive hardware lock release event
					$(self).trigger(Wallets.EXCLUSIVE_HARDWARE_LOCK_RELEASE_EVENT);
				}, 0);
			}
		}
		
		// Cancel transaction
		cancelTransaction(walletKeyPath, transactionKeyPath) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallet(walletKeyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Reject error
					reject(error);
					
					// Return
					return;
				}
				
				// Return obtaining wallet's exclusive transactions lock
				return self.transactions.obtainWalletsExclusiveTransactionsLock(walletKeyPath).then(function() {
				
					// Return getting transaction
					return self.transactions.getTransactions([transactionKeyPath]).then(function(transaction) {
					
						// Check if transaction doesn't exist
						if(transaction["length"] === 0) {
						
							// Release wallet's exclusive transactions lock
							self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
						
							// Reject error
							reject(Language.getDefaultTranslation('The transaction doesn\'t exist.'));
						}
						
						// Otherwise
						else {
						
							// Get transaction
							transaction = transaction[0];
					
							// Check if transaction doesn't belong to the wallet
							if(transaction.getWalletKeyPath() !== walletKeyPath) {
							
								// Release wallet's exclusive transactions lock
								self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
							
								// Reject error
								reject(Language.getDefaultTranslation('The transaction doesn\'t belong to the wallet.'));
							}
						
							// Otherwise check if transaction is canceled
							else if(transaction.getCanceled() === true) {
							
								// Release wallet's exclusive transactions lock
								self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
							
								// Reject error
								reject(Language.getDefaultTranslation('The transaction is already canceled.'));
							}
							
							// Otherwise check if transaction is confirmed
							else if((transaction.getReceived() === true && transaction.getStatus() !== Transaction.STATUS_UNCONFIRMED) || (transaction.getReceived() === false && transaction.getAmountReleased() === true)) {
							
								// Release wallet's exclusive transactions lock
								self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
							
								// Reject error
								reject(Language.getDefaultTranslation('Confirmed transactions can\'t be canceled.'));
							}
							
							// Otherwise check if transaction is expired
							else if(transaction.getExpired() === true) {
							
								// Release wallet's exclusive transactions lock
								self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
							
								// Reject error
								reject(Language.getDefaultTranslation('Expired transactions can\'t be canceled.'));
							}
							
							// Otherwise check if transaction is broadcast and isn't a coinbase transaction
							else if(transaction.getBroadcast() === true && transaction.getIsCoinbase() === false) {
							
								// Release wallet's exclusive transactions lock
								self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
							
								// Reject error
								reject(Language.getDefaultTranslation('Broadcast transactions can\'t be canceled.'));
							}
							
							// Otherwise
							else {
							
								// Initialize spent outputs
								var spentOutputs = [];
								
								// Initialize change outputs
								var changeOutputs = [];
							
								// Initialize updated transactions
								var updatedTransactions = [];
							
								// Initialize unspent amount change
								var unspentAmountChange = new BigNumber(0);
								
								// Initialize unconfirmed amount change
								var unconfirmedAmountChange = new BigNumber(0);
								
								// Initialize locked amount change
								var lockedAmountChange = new BigNumber(0);
								
								// Set that transaction is canceled
								transaction.setCanceled(true);
								
								// Check if transaction was received
								if(transaction.getReceived() === true) {
								
									// Subtract transaction's amount from unconfirmed amount change
									unconfirmedAmountChange = unconfirmedAmountChange.minus(transaction.getAmount());
								}
								
								// Otherwise
								else {
								
									// Set spent outputs to the transaction's spent outputs
									spentOutputs = transaction.getSpentOutputs();
									
									// Set change outputs to the transaction's change outputs
									changeOutputs = transaction.getChangeOutputs();
								}
								
								// Append transaction to list of updated transactions
								updatedTransactions.push(transaction);
								
								// Return getting spent transactions
								return self.transactions.getTransactions(spentOutputs).then(function(spentTransactions) {
								
									// Go through all spent transactions
									for(var i = 0; i < spentTransactions["length"]; ++i) {
									
										// Get spent transaction
										var spentTransaction = spentTransactions[i];
										
										// Set spent transaction's status to unspent
										spentTransaction.setStatus(Transaction.STATUS_UNSPENT);
										
										// Add spent transaction's amount to unspent amount change
										unspentAmountChange = unspentAmountChange.plus(spentTransaction.getAmount());
										
										// Subtract spent transaction's amount from locked amount change
										lockedAmountChange = lockedAmountChange.minus(spentTransaction.getAmount());
										
										// Append spent transaction to list of updated transactions
										updatedTransactions.push(spentTransaction);
									}
									
									// Return getting change transactions
									return self.transactions.getTransactions(changeOutputs).then(function(changeTransactions) {
									
										// Go through all change transactions
										for(var i = 0; i < changeTransactions["length"]; ++i) {
										
											// Get change transaction
											var changeTransaction = changeTransactions[i];
											
											// Set that change transaction is canceled
											changeTransaction.setCanceled(true);
											
											// Subtract change transaction's amount from unconfirmed amount change
											unconfirmedAmountChange = unconfirmedAmountChange.minus(changeTransaction.getAmount());
											
											// Append change transaction to list of updated transactions
											updatedTransactions.push(changeTransaction);
										}
								
										// Return creating a database transaction
										return Database.createTransaction([
										
											// Wallets object store
											Wallets.OBJECT_STORE_NAME,
											
											// Transactions object store
											Transactions.OBJECT_STORE_NAME,
											
										], Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
										
											// Return saving updated transactions
											return self.transactions.saveTransactions(updatedTransactions, databaseTransaction).then(function() {
											
												// Check if wallet exists
												if(self.walletExists(walletKeyPath) === true) {
												
													// Return saving wallet
													return self.saveWallet(wallet, function() {

														// Get values
														var values = {
														
															// New locked amount value
															[Wallets.NEW_LOCKED_AMOUNT_VALUE]: wallet.getLockedAmount().plus(lockedAmountChange),
															
															// New unconfirmed amount value
															[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]: wallet.getUnconfirmedAmount().plus(unconfirmedAmountChange),
															
															// New unspent amount value
															[Wallets.NEW_UNSPENT_AMOUNT_VALUE]: wallet.getUnspentAmount().plus(unspentAmountChange)
														};
														
														// Return values
														return values;
														
													}, databaseTransaction).then(function(newValues) {
													
														// Check if wallet exists
														if(self.walletExists(walletKeyPath) === true) {
														
															// Return committing database transaction
															return Database.commitTransaction(databaseTransaction).then(function() {
															
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
															
																// Update wallet's locked amount
																wallet.setLockedAmount(newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE]);
															
																// Update wallet's unconfirmed amount
																wallet.setUnconfirmedAmount(newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]);
																
																// Update wallet's unspent amount
																wallet.setUnspentAmount(newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]);
																
																// Check if wallet exists
																if(self.walletExists(walletKeyPath) === true) {
																
																	// Check if wallet's unspent amount changed
																	if(unspentAmountChange.isZero() === false) {
													
																		// Trigger change event
																		$(document).trigger(Wallets.CHANGE_EVENT, [
																		
																			// Key path
																			walletKeyPath,
																			
																			// Change
																			Wallets.UNSPENT_AMOUNT_CHANGED,
																			
																			// New value
																			newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]
																		]);
																	}
																	
																	// Check if wallet's unconfirmed amount changed
																	if(unconfirmedAmountChange.isZero() === false) {
													
																		// Trigger change event
																		$(document).trigger(Wallets.CHANGE_EVENT, [
																		
																			// Key path
																			walletKeyPath,
																			
																			// Change
																			Wallets.UNCONFIRMED_AMOUNT_CHANGED,
																			
																			// New value
																			newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]
																		]);
																	}
																	
																	// Trigger transactions change event
																	$(self.transactions).trigger(Transactions.CHANGE_EVENT, [
																	
																		// Transactions
																		updatedTransactions
																	]);
																}
																
																// Resolve
																resolve();
															
															// Catch errors
															}).catch(function(error) {
															
																// Return aborting database transaction
																return Database.abortTransaction(databaseTransaction).then(function() {
																
																	// Release wallet's exclusive transactions lock
																	self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
																
																	// Reject error
																	reject(Language.getDefaultTranslation('The database failed.'));
																
																// Catch errors
																}).catch(function(error) {
																
																	// Release wallet's exclusive transactions lock
																	self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
																
																	// Trigger a fatal error
																	new FatalError(FatalError.DATABASE_ERROR);
																});
															});
														}
														
														// Otherwise
														else {
														
															// Return aborting database transaction
															return Database.abortTransaction(databaseTransaction).then(function() {
															
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
															
																// Resolve
																resolve();
															
															// Catch errors
															}).catch(function() {
															
																// Release wallet's exclusive transactions lock
																self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
															
																// Trigger a fatal error
																new FatalError(FatalError.DATABASE_ERROR);
															});
														}
													
													// Catch errors
													}).catch(function(error) {
													
														// Return aborting database transaction
														return Database.abortTransaction(databaseTransaction).then(function() {
														
															// Release wallet's exclusive transactions lock
															self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
														
															// Reject error
															reject(error);
														
														// Catch errors
														}).catch(function(error) {
														
															// Release wallet's exclusive transactions lock
															self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
														
															// Trigger a fatal error
															new FatalError(FatalError.DATABASE_ERROR);
														});
													});
												}
												
												// Otherwise
												else {
												
													// Return aborting database transaction
													return Database.abortTransaction(databaseTransaction).then(function() {
													
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
													
														// Resolve
														resolve();
													
													// Catch errors
													}).catch(function() {
													
														// Release wallet's exclusive transactions lock
														self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
													
														// Trigger a fatal error
														new FatalError(FatalError.DATABASE_ERROR);
													});
												}
											
											// Catch errors
											}).catch(function(error) {
											
												// Return aborting database transaction
												return Database.abortTransaction(databaseTransaction).then(function() {
												
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
												
													// Reject error
													reject(error);
												
												// Catch errors
												}).catch(function(error) {
												
													// Release wallet's exclusive transactions lock
													self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
												
													// Trigger a fatal error
													new FatalError(FatalError.DATABASE_ERROR);
												});
											});
										
										// Catch errors
										}).catch(function(error) {
										
											// Release wallet's exclusive transactions lock
											self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
										
											// Reject error
											reject(Language.getDefaultTranslation('The database failed.'));
										});
									
									// Catch errors
									}).catch(function(error) {
									
										// Release wallet's exclusive transactions lock
										self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
									
										// Reject error
										reject(Language.getDefaultTranslation('The database failed.'));
									});
								
								// Catch errors
								}).catch(function(error) {
								
									// Release wallet's exclusive transactions lock
									self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
								
									// Reject error
									reject(Language.getDefaultTranslation('The database failed.'));
								});
							}
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Release wallet's exclusive transactions lock
						self.transactions.releaseWalletsExclusiveTransactionsLock(walletKeyPath);
					
						// Reject error
						reject(error);
					});
				});
			});
		}
		
		// Sync start event
		static get SYNC_START_EVENT() {
		
			// Return sync start event
			return "WalletsSyncStartEvent";
		}
		
		// Sync done event
		static get SYNC_DONE_EVENT() {
		
			// Return sync done event
			return "WalletsSyncDoneEvent";
		}
		
		// Sync fail event
		static get SYNC_FAIL_EVENT() {
		
			// Return sync fail event
			return "WalletsSyncFailEvent";
		}
		
		// Currency receive event
		static get CURRENCY_RECEIVE_EVENT() {
		
			// Return currency receive event
			return "WalletsCurrencyReceiveEvent";
		}
		
		// No message
		static get NO_MESSAGE() {
		
			// Return no message
			return null;
		}
		
		// Change event
		static get CHANGE_EVENT() {
		
			// Return change event
			return "WalletsChangeEvent";
		}
		
		// Address suffix changed
		static get ADDRESS_SUFFIX_CHANGED() {
		
			// Return address suffix changed
			return 0;
		}
		
		// Unspent amount changed
		static get UNSPENT_AMOUNT_CHANGED() {
		
			// Return unspent amount changed
			return Wallets.ADDRESS_SUFFIX_CHANGED + 1;
		}
		
		// Unconfirmed amount changed
		static get UNCONFIRMED_AMOUNT_CHANGED() {
		
			// Return unconfirmed amount changed
			return Wallets.UNSPENT_AMOUNT_CHANGED + 1;
		}
		
		// Pending amount changed
		static get PENDING_AMOUNT_CHANGED() {
		
			// Return pending amount changed
			return Wallets.UNCONFIRMED_AMOUNT_CHANGED + 1;
		}
		
		// Expired amount changed
		static get EXPIRED_AMOUNT_CHANGED() {
		
			// Return expired amount changed
			return Wallets.PENDING_AMOUNT_CHANGED + 1;
		}
		
		// Name changed
		static get NAME_CHANGED() {
		
			// Return name changed
			return Wallets.EXPIRED_AMOUNT_CHANGED + 1;
		}
		
		// Hardware type changed
		static get HARDWARE_TYPE_CHANGED() {
		
			// Return hardware type changed
			return Wallets.NAME_CHANGED + 1;
		}
	
	// Private
	
		// Get wallet from address suffix
		getWalletFromAddressSuffix(addressSuffix) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting wallet with the wallet type, network type, and address suffix from the database
				return Database.getResults(Wallets.OBJECT_STORE_NAME, 0, 1, Wallets.DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_ADDRESS_SUFFIX_NAME, IDBKeyRange.only([
				
					// Wallet type
					Consensus.getWalletType(),
					
					// Network type
					Consensus.getNetworkType(),
					
					// Address suffix
					addressSuffix.toLowerCase()
					
				])).then(function(results) {
				
					// Check if wallet doesn't exist in the database
					if(results["length"] === 0) {
					
						// Reject error
						reject(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
					}
					
					// Otherwise
					else {
					
						// Get key path from result
						var keyPath = results[0][Database.KEY_PATH_NAME];
						
						// Check if wallet doesn't exist
						if(self.walletExists(keyPath) === false) {
						
							// Reject error
							reject(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
						}
						
						// Otherwise
						else {
				
							// Resolve wallet
							resolve(self.wallets[keyPath]);
						}
					}
					
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
	
		// Sync
		sync(ignoreAlreadySyncing = false, ignoreSyncedStatus = false) {
		
			// Check if ignoring synced status
			if(ignoreSyncedStatus === true) {
			
				// Set ignore synced status
				this.ignoreSyncedStatus = true;
			}
		
			// Check if not stop syncing
			if(this.stopSyncing === false) {
			
				// Check if not already syncing or ignoring if already syncing
				if(this.isSyncing === false || ignoreAlreadySyncing === true) {
				
					// Set is syncing
					this.isSyncing = true;
					
					// Set tip height to the node's current height
					var tipHeight = this.node.getCurrentHeight();
					
					// Check if tip height is known
					if(tipHeight.getHeight() !== Node.UNKNOWN_HEIGHT) {
					
						// Get recent heights's highest height
						var highestRecentHeight = this.recentHeights.getHighestHeight();
						
						// Check if node is synced and there are no recent heights or the tip height is at least equal to the highest recent height
						if(tipHeight.getHeight().isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === false && (highestRecentHeight === RecentHeights.NO_HEIGHT || tipHeight.getHeight().isGreaterThanOrEqualTo(highestRecentHeight) === true)) {
						
							// Set self
							var self = this;
						
							// Get recent heights's highest verified height
							this.recentHeights.getHighestVerifiedHeight(tipHeight).then(function(verifyingHeightsResult) {
							
								// Get highest verified height
								var highestVerifiedHeight = verifyingHeightsResult[RecentHeights.HIGHEST_VERIFIED_HEIGHT_INDEX];
								
								// Get if a reorg occurred
								var reorgOccurred = verifyingHeightsResult[RecentHeights.REORG_OCCURRED_INDEX];
								
								// Check if a reorg occurred
								if(reorgOccurred === true) {
								
									// Clear node's cache
									self.node.clearCache();
								}
								
								// Otherwise
								else {
								
									// Optimize node's cache
									self.node.optimizeCache();
								}
								
								// Check if not stop syncing
								if(self.stopSyncing === false) {
							
									// Initialized syncing wallets
									var syncingWallets = [];
									
									// Initialize percent completes
									var percentCompletes = [];
									
									// Set lowest synced height to highest verified height or the first block height if no verified heights exist
									var lowestSyncedHeight = (highestVerifiedHeight !== RecentHeights.NO_VERIFIED_HEIGHT) ? highestVerifiedHeight : new BigNumber(Consensus.FIRST_BLOCK_HEIGHT);
									
									// Go through all wallets
									var applicableWalletFound = false;
									for(var keyPath in self.wallets) {
											
										if(self.wallets.hasOwnProperty(keyPath) === true) {
									
											// Get wallet
											var wallet = self.wallets[keyPath];
											
											// Check if wallet's synced height isn't the current height
											if(wallet.getSyncedHeight() !== Wallet.CURRENT_HEIGHT) {
											
												// Set applicable wallet found
												applicableWalletFound = true;
											
												// Check if the wallet's synced height is less than the lowest synced height
												if(wallet.getSyncedHeight().isLessThan(lowestSyncedHeight) === true) {
												
													// Set lowest synced height to the wallet's synced height
													lowestSyncedHeight = wallet.getSyncedHeight();
												}
											}
											
											// Append key path to list of syncing wallets
											syncingWallets.push(wallet.getKeyPath());
											
											// Check if wallet isn't synced or ignoring synced status and its synced height or the highest verified height are less than the tip height
											if((wallet.isSynced() === false || self.ignoreSyncedStatus === true) && wallet.getSyncedHeight() !== Wallet.CURRENT_HEIGHT && (wallet.getSyncedHeight().isLessThan(tipHeight.getHeight()) === true || (highestVerifiedHeight !== RecentHeights.NO_VERIFIED_HEIGHT && highestVerifiedHeight.isLessThan(tipHeight.getHeight()) === true))) {
											
												// Get current percent value
												var currentPercentValue = (highestVerifiedHeight !== RecentHeights.NO_VERIFIED_HEIGHT && highestVerifiedHeight.isLessThan(wallet.getSyncedHeight())) ? highestVerifiedHeight : wallet.getSyncedHeight();
												
												currentPercentValue = currentPercentValue.minus(wallet.getStartingSyncHeight());
												
												// Set wallet's sync complete value
												wallet.setSyncCompleteValue(tipHeight.getHeight().minus(wallet.getStartingSyncHeight()));
												
												// Get percent complete
												var percentComplete = (wallet.getSyncCompleteValue().isEqualTo(0) === true) ? new BigNumber(Wallets.MAXIMUM_PERCENT) : currentPercentValue.dividedBy(wallet.getSyncCompleteValue()).multipliedBy(Wallets.MAXIMUM_PERCENT);
												
												// Keep percent complete in bounds
												if(percentComplete.isLessThan(Wallets.MINIMUM_PERCENT) === true)
												
													percentComplete = new BigNumber(Wallets.MINIMUM_PERCENT);
												
												else if(percentComplete.isGreaterThan(Wallets.MAXIMUM_PERCENT) === true)
												
													percentComplete = new BigNumber(Wallets.MAXIMUM_PERCENT);
												
												// Append percent complete to list
												percentCompletes.push(percentComplete);
												
												// Set wallet's percent synced
												wallet.setPercentSynced(percentComplete);
												
												// Set wallet's syncing status to syncing
												wallet.setSyncingStatus(Wallet.STATUS_SYNCING);
												
												// Trigger sync start event
												$(self).trigger(Wallets.SYNC_START_EVENT, [
												
													// Key path
													wallet.getKeyPath(),
													
													// Percent complete
													percentComplete,
													
													// Last percent in group
													false
												]);
											}
											
											// Otherwise
											else {
											
												// Update wallet's starting sync height
												wallet.setStartingSyncHeight(wallet.getSyncedHeight());
												
												// Append unknown percent complete to list
												percentCompletes.push(Wallets.UNKNOWN_PERCENT_COMPLETE);
												
												// Set wallet's percent synced
												wallet.setPercentSynced(new BigNumber(Wallets.MAXIMUM_PERCENT));
											
												// Set wallet's syncing status to synced
												wallet.setSyncingStatus(Wallet.STATUS_SYNCED);
											
												// Trigger sync done event
												$(self).trigger(Wallets.SYNC_DONE_EVENT, wallet.getKeyPath());
											}
										}
									}
									
									// Initialize lowest last sync start index and last retrieved index
									var lowestLastSyncStartIndex = Wallets.NO_LAST_SYNC_START_INDEX;
									
									var lowestLastSyncLastRetrievedIndex = Wallets.NO_LAST_SYNC_LAST_RETRIEVED_INDEX;
									
									// Go through all syncing wallets
									for(var i = 0; i < syncingWallets["length"]; ++i) {
									
										// Get wallet
										var wallet = self.wallets[syncingWallets[i]];
										
										// Check if wallet's synced height isn't the current height and it's the lowest synced height
										if(wallet.getSyncedHeight() !== Wallet.CURRENT_HEIGHT && wallet.getSyncedHeight().isEqualTo(lowestSyncedHeight) === true) {
										
											// Check if wallet's last sync start index is no sync index or it's less than the lowest last sync start index
											if(lowestLastSyncStartIndex === Wallets.NO_LAST_SYNC_START_INDEX || wallet.getLastSyncIndex() === Wallet.NO_SYNC_INDEX || (lowestLastSyncStartIndex !== Wallet.NO_SYNC_INDEX && wallet.getLastSyncIndex()[Wallet.LAST_SYNC_INDEX_START_INDEX_INDEX].isLessThan(lowestLastSyncStartIndex) === true))
											
												// Set lowest last sync start index to the wallet's last sync start index
												lowestLastSyncStartIndex = (wallet.getLastSyncIndex() === Wallet.NO_SYNC_INDEX) ? Wallet.NO_SYNC_INDEX : wallet.getLastSyncIndex()[Wallet.LAST_SYNC_INDEX_START_INDEX_INDEX];
											
											// Check if wallet's last sync last retrieved index is no sync index or it's less than the lowest last sync last retrieved index
											if(lowestLastSyncLastRetrievedIndex === Wallets.NO_LAST_SYNC_LAST_RETRIEVED_INDEX || wallet.getLastSyncIndex() === Wallet.NO_SYNC_INDEX || (lowestLastSyncLastRetrievedIndex !== Wallet.NO_SYNC_INDEX && wallet.getLastSyncIndex()[Wallet.LAST_SYNC_INDEX_LAST_RETRIEVED_INDEX_INDEX].isLessThan(lowestLastSyncLastRetrievedIndex) === true))
											
												// Set lowest last sync last retrieved index to the wallet's last sync last retrieved index
												lowestLastSyncLastRetrievedIndex = (wallet.getLastSyncIndex() === Wallet.NO_SYNC_INDEX) ? Wallet.NO_SYNC_INDEX : wallet.getLastSyncIndex()[Wallet.LAST_SYNC_INDEX_LAST_RETRIEVED_INDEX_INDEX];
										}
									}
									
									// Check if ignoring synced status
									if(self.ignoreSyncedStatus === true) {
									
										// Clear ignore synced status
										self.ignoreSyncedStatus = false;
									}
									
									// Check if an applicable walet was found
									if(applicableWalletFound === true) {
									
										// Set start height to lowest synced height
										var startHeight = lowestSyncedHeight;
										
										// Check if tip height isn't verified and tip height is greater than or equal to the start height or the tip height is greater than the start height
										if((highestVerifiedHeight !== RecentHeights.NO_VERIFIED_HEIGHT && highestVerifiedHeight.isLessThan(tipHeight.getHeight()) === true && tipHeight.getHeight().isGreaterThanOrEqualTo(startHeight) === true) || tipHeight.getHeight().isGreaterThan(startHeight) === true) {
										
											// Log start height
											//console.log("Sync start height: " + startHeight.toFixed());
											
											// Get node's PMMR indices to go from start height to tip height
											self.node.getPmmrIndices(startHeight, tipHeight.getHeight()).then(function(pmmrIndices) {
											
												// Check if not stop syncing
												if(self.stopSyncing === false) {
											
													// Get start index
													var startIndex = pmmrIndices["last_retrieved_index"];
													
													// Check if start index is equal to the last start index
													if(lowestLastSyncStartIndex !== Wallets.NO_LAST_SYNC_START_INDEX && lowestLastSyncStartIndex !== Wallet.NO_SYNC_INDEX && startIndex.isEqualTo(lowestLastSyncStartIndex) === true) {
														
														// Check if the last retrieved index is valid
														if(lowestLastSyncLastRetrievedIndex !== Wallets.NO_LAST_SYNC_LAST_RETRIEVED_INDEX && lowestLastSyncLastRetrievedIndex !== Wallet.NO_SYNC_INDEX && lowestLastSyncLastRetrievedIndex.isGreaterThanOrEqualTo(lowestLastSyncStartIndex) === true) {
														
															// Set start index to one after the last retrieved index
															startIndex = lowestLastSyncLastRetrievedIndex.plus(1);
														}
													}
													
													// Get end index
													var endIndex = pmmrIndices["highest_index"];
													
													// Check if start and end index are valid
													if(startIndex.isLessThanOrEqualTo(endIndex) === true) {
													
														// Get node's unspent outputs from the start index in groups to the end index
														self.node.getUnspentOutputs(startIndex, endIndex, Wallets.OUTPUTS_GROUP_SIZE, pmmrIndices).then(function(unspentOutputs) {
														
															// Check if not stop syncing
															if(self.stopSyncing === false) {
															
																// Get highest synced height in the group
																var highestSyncedHeight = (unspentOutputs["outputs"]["length"] === 0) ? tipHeight.getHeight() : unspentOutputs["outputs"][unspentOutputs["outputs"]["length"] - 1]["block_height"];
																
																// Log end height
																//console.log("Sync end height: " + highestSyncedHeight.toFixed());
																
																// Initialize checking outputs
																var checkingOutputs = [];
																
																// Initialize outputs checked
																var outputsChecked = [];
																
																// Initialize starting percent value
																var startingPercentValue = [];
																
																// Initialize last percent complete
																var lastPercentComplete = [];
																
																// Go through all syncing wallets
																for(var i = 0; i < syncingWallets["length"]; ++i) {
																
																	// Get key path
																	var keyPath = syncingWallets[i];
																
																	// Check if wallet doesn't exist
																	if(self.walletExists(keyPath) === false)
																	
																		// Remove syncing wallet from list
																		syncingWallets.splice(i--, 1);
																	
																	// Otherwise
																	else {
																	
																		// Get wallet
																		var wallet = self.wallets[keyPath];
																		
																		// Check if wallet's syncing status is resyncing
																		if(wallet.getSyncingStatus() === Wallet.STATUS_RESYNCING)
																		
																			// Remove syncing wallet from list
																			syncingWallets.splice(i--, 1);
																		
																		// Otherwise check if wallet's synced height is the current height
																		else if(wallet.getSyncedHeight() === Wallet.CURRENT_HEIGHT)
																		
																			// Remove syncing wallet from list
																			syncingWallets.splice(i--, 1);
																		
																		// Otherwise check if wallet's synced height and the highest verified height are greater than the highest synced height
																		else if(wallet.getSyncedHeight().isGreaterThan(highestSyncedHeight) === true && (highestVerifiedHeight === RecentHeights.NO_VERIFIED_HEIGHT || highestVerifiedHeight.isGreaterThan(highestSyncedHeight) === true))
																		
																			// Remove syncing wallet from list
																			syncingWallets.splice(i--, 1);
																		
																		// Otherwise
																		else {
																		
																			// Append empty array to checking outputs
																			checkingOutputs.push([]);
																			
																			// Append zero to outputs checked
																			outputsChecked.push(0);
																			
																			// Append starting percent value to list
																			startingPercentValue.push((highestVerifiedHeight !== RecentHeights.NO_VERIFIED_HEIGHT && highestVerifiedHeight.isLessThan(wallet.getSyncedHeight())) ? highestVerifiedHeight : wallet.getSyncedHeight());
																			
																			// Append wallet's percent complete to last percent complete
																			lastPercentComplete.push((percentCompletes[i] !== Wallets.UNKNOWN_PERCENT_COMPLETE) ? percentCompletes[i].toFixed(Wallets.PERCENT_COMPLETE_PRECISION, BigNumber.ROUND_FLOOR) : Wallets.UNKNOWN_PERCENT_COMPLETE);
																		}
																	}
																}
																
																// Get highest index
																var highestIndex = unspentOutputs["highest_index"];
																
																// Get last retrieved index
																var lastRetrievedIndex = unspentOutputs["last_retrieved_index"];
																
																// Get if at the last output
																var atLastOutput = highestIndex.isLessThanOrEqualTo(lastRetrievedIndex) === true;
														
																// Get outputs ending percent value
																var outputsEndingPercentValue = highestSyncedHeight;
																
																// Initializing checking wallets
																var checkingWallets = [];
																
																// Go through all unspent outputs or run at least once
																for(var i = 0; i < unspentOutputs["outputs"]["length"] || i === 0; ++i) {
																
																	// Create output
																	let output = (unspentOutputs["outputs"]["length"] !== 0) ? new Output(unspentOutputs["outputs"][i]["commit"], unspentOutputs["outputs"][i]["proof"], unspentOutputs["outputs"][i]["output_type"], unspentOutputs["outputs"][i]["block_height"]) : Wallets.NO_OUTPUT;
																	
																	// Go through all syncing wallets
																	for(let j = 0; j < syncingWallets["length"]; ++j) {
																	
																		// Get key path
																		let keyPath = syncingWallets[j];
																	
																		// Get wallet
																		let wallet = self.wallets[keyPath];
																		
																		// Check if unspent outputs exists
																		if(unspentOutputs["outputs"]["length"] !== 0) {
																		
																			// Append checking output to list for wallet
																			checkingOutputs[j].push(new Promise(function(resolve, reject) {
																			
																				// Return checking if wallet owns output
																				return wallet.ownsOutput(output).then(function(outputInformation) {
																				
																					// Check if wallet isn't synced and its syncing status isn't resyncing
																					if(wallet.isSynced() === false && wallet.getSyncingStatus() !== Wallet.STATUS_RESYNCING) {
																					
																						// Increment outputs checked for wallet
																						++outputsChecked[j];
																						
																						// Get current percent value for wallet
																						var currentPercentValue = Common.map(outputsChecked[j], 0, unspentOutputs["outputs"]["length"], startingPercentValue[j], outputsEndingPercentValue);
																						
																						currentPercentValue = currentPercentValue.minus(wallet.getStartingSyncHeight());
																						
																						// Get percent complete
																						var percentComplete = (wallet.getSyncCompleteValue().isEqualTo(0) === true) ? new BigNumber(Wallets.MAXIMUM_PERCENT) : currentPercentValue.dividedBy(wallet.getSyncCompleteValue()).multipliedBy(Wallets.MAXIMUM_PERCENT);
																						
																						// Keep percent complete in bounds
																						if(percentComplete.isLessThan(Wallets.MINIMUM_PERCENT) === true)
																						
																							percentComplete = new BigNumber(Wallets.MINIMUM_PERCENT);
																						
																						else if(percentComplete.isGreaterThan(Wallets.MAXIMUM_PERCENT) === true)
																						
																							percentComplete = new BigNumber(Wallets.MAXIMUM_PERCENT);
																						
																						// Set wallet's percent synced
																						wallet.setPercentSynced(percentComplete);
																						
																						// Get new percent complete
																						var newPercentComplete = percentComplete.toFixed(Wallets.PERCENT_COMPLETE_PRECISION, BigNumber.ROUND_FLOOR);
																						
																						// Check if there is unknown last percent complete for wallet or the percent complete for wallet noticeably changed
																						if(lastPercentComplete[j] === Wallets.UNKNOWN_PERCENT_COMPLETE || lastPercentComplete[j] !== newPercentComplete) {
																						
																							// Trigger sync start event
																							$(self).trigger(Wallets.SYNC_START_EVENT, [
																							
																								// Key path
																								keyPath,
																								
																								// Percent complete
																								percentComplete,
																								
																								// Last percent in group
																								outputsChecked[j] === unspentOutputs["outputs"]["length"]
																							]);
																						}
																						
																						// Update last percent complete for wallet
																						lastPercentComplete[j] = newPercentComplete;
																					}
																				
																					// Resolve output information
																					resolve(outputInformation);
																				
																				// Catch errors
																				}).catch(function(error) {
																				
																					// Reject error
																					reject(error);
																				});
																			}));
																		}
																		
																		// Check if unspent outputs don't exist or at the last unspent output
																		if(unspentOutputs["outputs"]["length"] === 0 || i === unspentOutputs["outputs"]["length"] - 1) {
																		
																			// Append checking wallet to list
																			checkingWallets.push(new Promise(function(resolve, reject) {
																			
																				// Return waiting for wallet to finish checking all outputs
																				return Promise.all(checkingOutputs[j]).then(function(outputsInformation) {
																				
																					// Return obtaining wallet's exclusive transactions lock
																					return self.transactions.obtainWalletsExclusiveTransactionsLock(keyPath, false).then(function() {
																					
																						// Initialize process transactions
																						var processTransactions = [];
																						
																						// Initialize updated transactions
																						var updatedTransactions = [];
																						
																						// Initialize spent amount change
																						var spentAmountChange = new BigNumber(0);
																						
																						// Initialize unspent amount change
																						var unspentAmountChange = new BigNumber(0);
																						
																						// Initialize unconfirmed amount change
																						var unconfirmedAmountChange = new BigNumber(0);
																						
																						// Initialize locked amount change
																						var lockedAmountChange = new BigNumber(0);
																						
																						// Initialize pending amount change
																						var pendingAmountChange = new BigNumber(0);
																						
																						// Initialize expired amount change
																						var expiredAmountChange = new BigNumber(0);
																						
																						// Initialize highest identifier
																						var highestIdentifier = Wallet.NO_LAST_IDENTIFIER;
																						
																						// Initialize transactions verified
																						var transactionsVerified = [];
																			
																						// Go through all outputs' information
																						for(let k = 0; k < outputsInformation["length"]; ++k) {
																						
																							// Append processing transaction to list
																							processTransactions.push(new Promise(function(resolve, reject) {
																						
																								// Get output information
																								var outputInformation = outputsInformation[k];
																							
																								// Check if output information exists
																								if(outputInformation !== Output.NO_INFORMATION) {
																								
																									// Check if wallet is a hardware wallet and the output has an incompatible switch type
																									if(wallet.getHardwareType() !== Wallet.NO_HARDWARE_TYPE && outputInformation.getSwitchType() === Crypto.SWITCH_TYPE_NONE) {
																									
																										// Resolve
																										resolve();
																										
																										// Return
																										return;
																									}
																									
																									// Get output information's identifier height
																									var identifierHeight = outputInformation.getIdentifier().getHeight();
																								
																									// Check if identifier height exists
																									if(identifierHeight !== Identifier.NO_HEIGHT) {
																									
																										// Get output information's output height
																										var outputHeight = outputInformation.getOutput().getHeight();
																										
																										// Set identifier's height to include the part of the output height that exceeds the maximum identifier height
																										identifierHeight = identifierHeight.plus(outputHeight.dividedBy(Identifier.MAXIMUM_HEIGHT + 1).decimalPlaces(0, BigNumber.ROUND_HALF_CEIL).multipliedBy(Identifier.MAXIMUM_HEIGHT + 1));
																										
																										// Check if identifier height is now too large and it can be reduced
																										if(identifierHeight.minus(outputHeight).isGreaterThan(Wallets.IDENTIFIER_HEIGHT_OVERAGE_THRESHOLD) === true && identifierHeight.isGreaterThanOrEqualTo(Identifier.MAXIMUM_HEIGHT + 1) === true) {
																										
																											// Reduce identifier height
																											identifierHeight = identifierHeight.minus(Identifier.MAXIMUM_HEIGHT + 1);
																										}
																										
																										// Check if output height exceeds the identifier height by at least the replay detection threshold
																										if(outputHeight.minus(identifierHeight).isGreaterThan(Wallets.REPLAY_DETECTION_THRESHOLD) === true) {
																										
																											// Resolve
																											resolve();
																											
																											// Return
																											return;
																										}
																									}
																									
																									// Check if highest identifier doesn't exist
																									if(highestIdentifier === Wallet.NO_LAST_IDENTIFIER) {
																									
																										// Get default identifier
																										var defaultIdentifier = new Identifier();
																										
																										// Set the highest identifier candidate to the default identifier's child identifier
																										var highestIdentifierCandidate = defaultIdentifier.getChild();
																										
																										// Check if output information's identifier included the highest identifier candidate
																										if(outputInformation.getIdentifier().includesValue(highestIdentifierCandidate) === true) {
																										
																											// Set the highest identifier to the output information's identifier without the extras
																											highestIdentifier = outputInformation.getIdentifier().removeExtras();
																										}
																									}
																									
																									// Otherwise check if output information's identifier included the highest identifier
																									else if(outputInformation.getIdentifier().includesValue(highestIdentifier) === true) {
																									
																										// Set the highest identifier to the output information's identifier without the extras
																										highestIdentifier = outputInformation.getIdentifier().removeExtras();
																									}
																									
																									// Check if transactions wasn't already verified
																									if(transactionsVerified.indexOf(Common.toHexString(outputInformation.getOutput().getCommit())) === Common.INDEX_NOT_FOUND) {
																									
																										// Append transaction to list of transactions verified
																										transactionsVerified.push(Common.toHexString(outputInformation.getOutput().getCommit()));
																									
																										// Return getting header at output's height
																										return self.node.getHeader(outputInformation.getOutput().getHeight()).then(function(header) {
																										
																											// Get timestamp
																											var timestamp = header["timestamp"];
																										
																											// Return getting transaction
																											return self.transactions.getTransaction(wallet.getWalletType(), wallet.getNetworkType(), outputInformation.getOutput().getCommit()).then(function(transaction) {
																											
																												// Check if transaction exists
																												if(transaction !== Transactions.NO_TRANSACTION_FOUND) {
																												
																													// Check if transaction is for the wallet
																													if(transaction.getWalletKeyPath() === keyPath) {
																												
																														// Set transaction changed
																														var transactionChanged = false;
																														
																														// Check if transaction's confirmed timestamp needs to be updated
																														if(transaction.getConfirmedTimestamp() !== timestamp) {
																														
																															// Set transaction's confirmed timestamp
																															transaction.setConfirmedTimestamp(timestamp);
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's received needs to be updated
																														if(transaction.getReceived() === false) {
																														
																															// Set transaction's received
																															transaction.setReceived(true);
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's height needs to be updated
																														if(transaction.getHeight() === Transaction.UNKNOWN_HEIGHT || transaction.getHeight().isEqualTo(outputInformation.getOutput().getHeight()) === false) {
																														
																															// Set transaction's height
																															transaction.setHeight(outputInformation.getOutput().getHeight());
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's is coinbase needs to be updated
																														if(transaction.getIsCoinbase() !== outputInformation.getOutput().isCoinbase()) {
																														
																															// Set transaction's is coinbase
																															transaction.setIsCoinbase(outputInformation.getOutput().isCoinbase());
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's identifier needs to be updated
																														if(transaction.getIdentifier().equalsValue(outputInformation.getIdentifier()) === false) {
																														
																															// Set transaction's identifier
																															transaction.setIdentifier(outputInformation.getIdentifier());
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's switch type needs to be updated
																														if(transaction.getSwitchType() !== outputInformation.getSwitchType()) {
																														
																															// Set transaction's switch type
																															transaction.setSwitchType(outputInformation.getSwitchType());
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's broadcast needs to be updated
																														if(transaction.getBroadcast() === false) {
																														
																															// Set transaction's broadcast
																															transaction.setBroadcast(true);
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Get new spendable height as the output height added to the transaction's number of confirmations
																														var newSpendableHeight = outputInformation.getOutput().getHeight().plus(transaction.getRequiredNumberOfConfirmations().minus(1));
																														
																														// Check if output's maturity height is greater than the new spendable height
																														if(outputInformation.getOutput().getMaturityHeight().isGreaterThan(newSpendableHeight) === true) {
																														
																															// Set the new spendable height to the output's maturity height
																															newSpendableHeight = outputInformation.getOutput().getMaturityHeight();
																														}
																														
																														// Check if the transaction's lock height exists and if it added to the number of confirmation is greater than the new spendable height
																														if(transaction.getLockHeight() !== Transaction.UNKNOWN_LOCK_HEIGHT && transaction.getLockHeight() !== Transaction.NO_LOCK_HEIGHT && transaction.getLockHeight().plus(transaction.getRequiredNumberOfConfirmations().minus(1)).isGreaterThan(newSpendableHeight) === true) {
																														
																															// Set the new spendable height to the transaction's lock height added to the number of confirmation
																															newSpendableHeight = transaction.getLockHeight().plus(transaction.getRequiredNumberOfConfirmations().minus(1));
																														}
																														
																														// Check transaction's status
																														switch(transaction.getStatus()) {
																														
																															// Spent
																															case Transaction.STATUS_SPENT:
																															
																																// Revert transaction's status to locked since transaction wasn't completed yet
																																transaction.setStatus(Transaction.STATUS_LOCKED);
																																
																																// Add transaction's new amount to locked amount change
																																lockedAmountChange = lockedAmountChange.plus(outputInformation.getAmount());
																																
																																// Subtract transaction's current amount from spent amount change
																																spentAmountChange = spentAmountChange.minus(transaction.getAmount());
																																
																																// Set transaction changed
																																transactionChanged = true;
																															
																																// Break
																																break;
																															
																															// Unconfirmed
																															case Transaction.STATUS_UNCONFIRMED:
																															
																																// Update transaction's status to unspent since transaction is confirmed on the chain
																																transaction.setStatus(Transaction.STATUS_UNSPENT);
																																
																																// Check if the transaction's new spendable height is the next block
																																if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																
																																	// Check if the transaction's amount hasn't been released
																																	if(transaction.getAmountReleased() === false) {
																																	
																																		// Set transaction amount has been released
																																		transaction.setAmountReleased(true);
																																		
																																		// Add transaction's new amount to unspent amount change
																																		unspentAmountChange = unspentAmountChange.plus(outputInformation.getAmount());
																																	}
																																	
																																	// Otherwise
																																	else {
																																	
																																		// Subtract transaction's current amount from unspent amount change
																																		unspentAmountChange = unspentAmountChange.minus(transaction.getAmount());
																																	
																																		// Add transaction's new amount to unspent amount change
																																		unspentAmountChange = unspentAmountChange.plus(outputInformation.getAmount());
																																	}
																																}
																																
																																// Otherwise
																																else {
																																
																																	// Add transaction's new amount to pending amount change
																																	pendingAmountChange = pendingAmountChange.plus(outputInformation.getAmount());
																																
																																	// Check if the transaction's amount has been released
																																	if(transaction.getAmountReleased() === true) {
																																
																																		// Set transaction amount hasn't been released
																																		transaction.setAmountReleased(false);
																																		
																																		// Subtract transaction's current amount from unspent amount change
																																		unspentAmountChange = unspentAmountChange.minus(transaction.getAmount());
																																	}
																																}
																																
																																// Check if transaction isn't canceled and expired
																																if(transaction.getCanceled() === false && transaction.getExpired() === false) {
																																
																																	// Subtract transaction's current amount from unconfirmed amount change
																																	unconfirmedAmountChange = unconfirmedAmountChange.minus(transaction.getAmount());
																																}
																																
																																// Set transaction changed
																																transactionChanged = true;
																															
																																// Break
																																break;
																															
																															// Unspent
																															case Transaction.STATUS_UNSPENT:
																															
																																// Check if transaction's amount hasn't been released
																																if(transaction.getAmountReleased() === false) {
																																
																																	// Check if the transaction's new spendable height is the next block
																																	if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																
																																		// Set transaction amount has been released
																																		transaction.setAmountReleased(true);
																																		
																																		// Add transaction's new amount to unspent amount change
																																		unspentAmountChange = unspentAmountChange.plus(outputInformation.getAmount());
																																		
																																		// Subtract transaction's current amount from pending amount change
																																		pendingAmountChange = pendingAmountChange.minus(transaction.getAmount());
																																		
																																		// Set transaction changed
																																		transactionChanged = true;
																																	}
																																	
																																	// Otherwise check if the transaction's amount changed
																																	else if(transaction.getAmount().isEqualTo(outputInformation.getAmount()) === false) {
																																	
																																		// Subtract transaction's current amount from pending amount change
																																		pendingAmountChange = pendingAmountChange.minus(transaction.getAmount());
																																		
																																		// Add transaction's new amount to pending amount change
																																		pendingAmountChange = pendingAmountChange.plus(outputInformation.getAmount());
																																		
																																		// Set transaction changed
																																		transactionChanged = true;
																																	}
																																}
																																
																																// Otherwise
																																else {
																																
																																	// Check if the transaction's new spendable height isn't the next block
																																	if(newSpendableHeight.isGreaterThan(tipHeight.getHeight().plus(1)) === true) {
																																	
																																		// Set transaction amount hasn't been released
																																		transaction.setAmountReleased(false);
																																		
																																		// Subtract transaction's current amount from unspent amount change
																																		unspentAmountChange = unspentAmountChange.minus(transaction.getAmount());
																																		
																																		// Add transaction's new amount to pending amount change
																																		pendingAmountChange = pendingAmountChange.plus(outputInformation.getAmount());
																																		
																																		// Set transaction changed
																																		transactionChanged = true;
																																	}
																																	
																																	// Otherwise check if the transaction's amount changed
																																	else if(transaction.getAmount().isEqualTo(outputInformation.getAmount()) === false) {
																																	
																																		// Subtract transaction's current amount from unspent amount change
																																		unspentAmountChange = unspentAmountChange.minus(transaction.getAmount());
																																		
																																		// Add transaction's new amount to unspent amount change
																																		unspentAmountChange = unspentAmountChange.plus(outputInformation.getAmount());
																																		
																																		// Set transaction changed
																																		transactionChanged = true;
																																	}
																																}
																															
																																// Break
																																break;
																															
																															// Locked
																															case Transaction.STATUS_LOCKED:
																															
																																// Check if the transaction's amount changed
																																if(transaction.getAmount().isEqualTo(outputInformation.getAmount()) === false) {
																																
																																	// Subtract transaction's current amount from locked amount change
																																	lockedAmountChange = lockedAmountChange.minus(transaction.getAmount());
																																	
																																	// Add transaction's new amount to locked amount change
																																	lockedAmountChange = lockedAmountChange.plus(outputInformation.getAmount());
																																	
																																	// Set transaction changed
																																	transactionChanged = true;
																																}
																																
																																// Break
																																break;
																														}
																														
																														// Check if transaction's spendable height needs to be updated
																														if(transaction.getSpendableHeight() === Transaction.UNKNOWN_SPENDABLE_HEIGHT || transaction.getSpendableHeight().isEqualTo(newSpendableHeight) === false) {
																														
																															// Set transaction's spendable height
																															transaction.setSpendableHeight(newSpendableHeight);
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's amount needs to be updated
																														if(transaction.getAmount().isEqualTo(outputInformation.getAmount()) === false) {
																														
																															// Set transactions amount
																															transaction.setAmount(outputInformation.getAmount());
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's canceled needs to be updated
																														if(transaction.getCanceled() === true) {
																														
																															// Set transaction's canceled
																															transaction.setCanceled(false);
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's expired needs to be updated
																														if(transaction.getExpired() === true) {
																														
																															// Set transaction's expired
																															transaction.setExpired(false);
																															
																															// Check if transaction isn't change output
																															if(transaction.getDisplay() === true) {
																															
																																// Subtract transaction's current amount from expired amount change
																																expiredAmountChange = expiredAmountChange.minus(transaction.getAmount());
																															}
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction's checked needs to be updated
																														if(transaction.getChecked() === false) {
																														
																															// Set transaction's checked
																															transaction.setChecked(true);
																															
																															// Set transaction changed
																															transactionChanged = true;
																														}
																														
																														// Check if transaction changed
																														if(transactionChanged === true) {
																														
																															// Append transaction to list of updated transactions
																															updatedTransactions.push(transaction);
																														}
																													}
																													
																													// Resolve
																													resolve();
																												}
																												
																												// Otherwise
																												else {
																												
																													// Get recorded timestamp
																													var recordedTimestamp = Date.now();
																													
																													// Get prices
																													var prices = self.prices.getPrices();
																													
																													// Get spendable height as the output height added to the number of confirmations
																													var spendableHeight = outputInformation.getOutput().getHeight().plus(self.numberOfConfirmations.minus(1));
																													
																													// Check if output's maturity height is greater than the spendable height
																													if(outputInformation.getOutput().getMaturityHeight().isGreaterThan(spendableHeight) === true) {
																													
																														// Set the spendable height to the output's maturity height
																														spendableHeight = outputInformation.getOutput().getMaturityHeight();
																													}
																												
																													// Create new transaction
																													var newTransaction = new Transaction(wallet.getWalletType(), wallet.getNetworkType(), outputInformation.getOutput().getCommit(), keyPath, true, recordedTimestamp, Transaction.UNKNOWN_CREATED_TIMESTAMP, outputInformation.getOutput().getHeight(), Transaction.UNKNOWN_LOCK_HEIGHT, outputInformation.getOutput().isCoinbase(), Transaction.STATUS_UNSPENT, outputInformation.getAmount(), false, Transaction.UNKNOWN_KERNEL_EXCESS, outputInformation.getIdentifier(), outputInformation.getSwitchType(), true, Transaction.UNKNOWN_KERNEL_OFFSET, Transaction.UNKNOWN_ID, Transaction.UNKNOWN_MESSAGE, Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT, false, timestamp, Transaction.UNKNOWN_FEE, Transaction.UNKNOWN_SENDER_ADDRESS, Transaction.UNKNOWN_RECEIVER_ADDRESS, Transaction.UNKNOWN_RECEIVER_SIGNATURE, Transaction.UNUSED_DESTINATION, spendableHeight, self.numberOfConfirmations, Transaction.UNUSED_SPENT_OUTPUTS, Transaction.UNUSED_CHANGE_OUTPUTS, true, Transaction.UNKNOWN_REBROADCAST_MESSAGE, Transaction.UNUSED_FILE_RESPONSE, (prices !== Prices.NO_PRICES_FOUND) ? prices : Transaction.UNKNOWN_PRICES_WHEN_RECORDED, true);
																													
																													// Check if the new transaction's spendable height is the next block
																													if(newTransaction.getSpendableHeight().isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																													
																														// Set new transaction amount has been released
																														newTransaction.setAmountReleased(true);
																														
																														// Add new transaction's amount to unspent amount change
																														unspentAmountChange = unspentAmountChange.plus(newTransaction.getAmount());
																													}
																													
																													// Otherwise
																													else {
																													
																														// Add new transaction's amount to pending amount change
																														pendingAmountChange = pendingAmountChange.plus(newTransaction.getAmount());
																													}
																													
																													// Append new transaction to list of updated transactions
																													updatedTransactions.push(newTransaction);
																													
																													// Resolve
																													resolve();
																												}
																											
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
																									}
																									
																									// Otherwise
																									else {
																									
																										// Resolve
																										resolve();
																									}
																								}
																								
																								// Otherwise
																								else {
																								
																									// Resolve
																									resolve();
																								}
																							}));
																						}
																						
																						// Return processing all transactions for the wallet
																						return Promise.all(processTransactions).then(function() {
																						
																							// Return getting wallet's transactions in the height range between the start height and the highest synced height
																							return self.transactions.getWalletsTransactionsInHeightRange(keyPath, startHeight, highestSyncedHeight).then(function(transactions) {
																							
																								// Return getting wallet's unreleased, received transactions that can be included in the next block
																								return self.transactions.getWalletsUnreleasedReceivedTransactionsInSpendableHeightRange(keyPath, Consensus.FIRST_BLOCK_HEIGHT, tipHeight.getHeight().plus(1)).then(function(unreleasedTransactions) {
																								
																									// Return getting wallet's unbroadcast transactions that should have expired by the tip height
																									return self.transactions.getWalletsUnbroadcastTransactionsInTimeToLiveCutOffHeightRange(keyPath, Consensus.FIRST_BLOCK_HEIGHT, tipHeight.getHeight()).then(function(expiredTransactions) {
																									
																										// Return getting wallet's unreleased, sent transactions that have been broadcast
																										return self.transactions.getWalletsUnreleasedSentBroadcastTransactions(keyPath).then(function(sentUnreleasedTransactions) {
																										
																											// Return getting wallet's unexpired, sent, unbroadcast transactions that can be included in the next block
																											return self.transactions.getWalletsUnexpiredSentUnbroadcastTransactionsInLockHeightRange(keyPath, Consensus.FIRST_BLOCK_HEIGHT, tipHeight.getHeight().plus(1)).then(function(sentUnbroadcastTransactions) {
																											
																												// Return getting the wallet's unchecked transactions
																												return self.transactions.getWalletsUncheckedTransactions(keyPath).then(function(uncheckedTransactions) {
																										
																													// Initialize processed sent transactions
																													var processedSentTransactions = [];
																													
																													// Initialize verifying send transactions
																													var verifyingSentTransactions = [];
																										
																													// Initialize pending transactions
																													var pendingTransactions = [];
																													
																													// Initialize spent outputs
																													var spentOutputs = [
																													
																														// Change to spent
																														[],
																														
																														// Change to unspent
																														[],
																														
																														// Change to locked
																														[]
																													];
																													
																													// Initialize spent outputs to change
																													var spentOutputsToChange = [];
																													
																													// Initialize change outputs to change
																													var changeOutputsToChange = [];
																													
																													// Go through all of the wallet's transactions in the height range, the wallet's unreleased transactions that should have been released by the tip height, the wallet's unexpired transactions that should have expired by the tip height, the wallet's unreleased sent transactions that have been broadcast, the wallet's unexpired sent unbroadcast transactions that can be included in the next block, and the wallet's unchecked transactions
																													for(var k = 0; k < transactions["length"] + unreleasedTransactions["length"] + expiredTransactions["length"] + sentUnreleasedTransactions["length"] + sentUnbroadcastTransactions["length"] + uncheckedTransactions["length"]; ++k) {
																													
																														// Initialize transaction
																														let transaction;
																														
																														// Check if transaction is in the height range
																														if(k < transactions["length"]) {
																														
																															// Set transaction
																															transaction = transactions[k];
																														}
																														
																														// Otherwise check if transaction is an unreleased transactions that should have been released by the tip height
																														else if(k - transactions["length"] < unreleasedTransactions["length"]) {
																														
																															// Set transaction
																															transaction = unreleasedTransactions[k - transactions["length"]];
																														}
																														
																														// Otherwise check if transaction is an unreleased transactions that should have expired by the tip height
																														else if(k - transactions["length"] - unreleasedTransactions["length"] < expiredTransactions["length"]) {
																														
																															// Set transaction
																															transaction = expiredTransactions[k - transactions["length"] - unreleasedTransactions["length"]];
																														}
																														
																														// Otherwise check if transaction is a sent unreleased transaction
																														else if(k - transactions["length"] - unreleasedTransactions["length"] - expiredTransactions["length"] < sentUnreleasedTransactions["length"]) {
																														
																															// Set transaction
																															transaction = sentUnreleasedTransactions[k - transactions["length"] - unreleasedTransactions["length"] - expiredTransactions["length"]];
																														}
																														
																														// Otherwise check if transaction is a sent unbroadcast transaction
																														else if(k - transactions["length"] - unreleasedTransactions["length"] - expiredTransactions["length"] - sentUnreleasedTransactions["length"] < sentUnbroadcastTransactions["length"]) {
																														
																															// Set transaction
																															transaction = sentUnbroadcastTransactions[k - transactions["length"] - unreleasedTransactions["length"] - expiredTransactions["length"] - sentUnreleasedTransactions["length"]];
																														}
																														
																														// Otherwise check if transaction is an unchecked transactions
																														else if(k - transactions["length"] - unreleasedTransactions["length"] - expiredTransactions["length"] - sentUnreleasedTransactions["length"] - sentUnbroadcastTransactions["length"] < uncheckedTransactions["length"]) {
																														
																															// Set transaction
																															transaction = uncheckedTransactions[k - transactions["length"] - unreleasedTransactions["length"] - expiredTransactions["length"] - sentUnreleasedTransactions["length"] - sentUnbroadcastTransactions["length"]];
																														}
																														
																														// Check if transaction was received
																														if(transaction.getReceived() === true) {
																															
																															// Check if transactions wasn't already verified
																															if(transactionsVerified.indexOf(Common.toHexString(transaction.getCommit())) === Common.INDEX_NOT_FOUND) {
																															
																																// Append transaction to list of transactions verified
																																transactionsVerified.push(Common.toHexString(transaction.getCommit()));
																																
																																// Append transaction to list of pending transactions
																																pendingTransactions.push(transaction);
																															}
																														}
																														
																														// Otherwise
																														else {
																														
																															// Check if transaction wasn't already processed
																															if(processedSentTransactions.indexOf(transaction.getKeyPath()) === Common.INDEX_NOT_FOUND) {
																															
																																// Append transaction to list of sent transactions that have been processed
																																processedSentTransactions.push(transaction.getKeyPath());
																														
																																// Append verifying sent transaction to list
																																verifyingSentTransactions.push(new Promise(function(resolve, reject) {
																																
																																	// Set get transaction's kernel
																																	var getTransactionsKernel = function() {
																																	
																																		// Return promise
																																		return new Promise(function(resolve, reject) {
																																		
																																			// Check if transaction has been broadcast
																																			if(transaction.getBroadcast() === true) {
																																			
																																				// Set kernel minimum height
																																				var kernelMinimumHeight = transaction.getHeight().minus(Wallets.VARIATION_FROM_PREVIOUS_BLOCK_HEIGHT);
																																			
																																				// Set kernel maximum height
																																				var kernelMaximumHeight = transaction.getHeight().plus(Wallets.VARIATION_TO_NEXT_BLOCK_HEIGHT);
																																				
																																				// Check if kernel minimum height is less than the first block height
																																				if(kernelMinimumHeight.isLessThan(Consensus.FIRST_BLOCK_HEIGHT) === true) {
																																				
																																					// Set kernel minimum height to the first block height
																																					kernelMinimumHeight = new BigNumber(Consensus.FIRST_BLOCK_HEIGHT);
																																				}
																																				
																																				// Check if kernel maximum height exceeds the tip height
																																				if(kernelMaximumHeight.isGreaterThan(tipHeight.getHeight()) === true) {
																																				
																																					// Set kernel maximum height to the tip height
																																					kernelMaximumHeight = tipHeight.getHeight();
																																				}
																																			
																																				// Return getting transaction's kernel in the range around its height
																																				return self.node.getKernel(transaction.getKernelExcess(), kernelMinimumHeight, kernelMaximumHeight).then(function(kernel) {
																																				
																																					// Resolve kernel
																																					resolve(kernel);
																																					
																																				// Catch errors
																																				}).catch(function(error) {
																																				
																																					// Reject error
																																					reject(error);
																																				});
																																			}
																																			
																																			// Otherwise
																																			else {
																																			
																																				// Resolve no kernel found
																																				resolve(Node.NO_KERNEL_FOUND);
																																			}
																																		});
																																	};
																																
																																	// Return getting transaction's kernel
																																	return getTransactionsKernel().then(function(kernel) {
																																	
																																		// Set transaction changed
																																		var transactionChanged = false;
																																	
																																		// Check if kernel exists
																																		if(kernel !== Node.NO_KERNEL_FOUND) {
																																		
																																			// Go through all the transaction's spent outputs
																																			for(var l = 0; l < transaction.getSpentOutputs()["length"]; ++l) {
																																			
																																				// Get spent output
																																				var spentOutput = transaction.getSpentOutputs()[l];
																																				
																																				// Check if spent output isn't in the change to spent list
																																				if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX].indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																				
																																					// Add spent output to change to spent list
																																					spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX].push(spentOutput);
																																				}
																																				
																																				// Check if spent output exists in change to unspent list
																																				if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].indexOf(spentOutput) !== Common.INDEX_NOT_FOUND) {
																																				
																																					// Remove spent output from change to unspent list
																																					spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].splice(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].indexOf(spentOutput), 1);
																																				}
																																				
																																				// Check if spent output exists in change to locked list
																																				if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].indexOf(spentOutput) !== Common.INDEX_NOT_FOUND) {
																																				
																																					// Remove spent output from change to locked list
																																					spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].splice(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].indexOf(spentOutput), 1);
																																				}
																																				
																																				// Check if spent output doesn't exists in the list of outputs to change
																																				if(spentOutputsToChange.indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																				
																																					// Append spent output to list of spent outputs to change
																																					spentOutputsToChange.push(spentOutput);
																																				}
																																			}
																																		
																																			// Check if transaction's amount wasn't released
																																			if(transaction.getAmountReleased() === false) {
																																			
																																				// Set transaction amount has been released
																																				transaction.setAmountReleased(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction's amount was expired
																																			if(transaction.getExpired() === true) {
																																			
																																				// Set transaction isn't expired
																																				transaction.setExpired(false);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction's height needs to be updated
																																			if(transaction.getHeight().isEqualTo(kernel["height"]) === false) {
																																			
																																				// Update transaction's height to the kernel's height
																																				transaction.setHeight(kernel["height"]);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction's checked needs to be updated
																																			if(transaction.getChecked() === false) {
																																			
																																				// Set transaction's checked
																																				transaction.setChecked(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Return getting header at kernel's height
																																			return self.node.getHeader(kernel["height"]).then(function(header) {
																																			
																																				// Get timestamp
																																				var timestamp = header["timestamp"];
																																				
																																				// Check if transaction's confirmed timestamp needs to be updated
																																				if(transaction.getConfirmedTimestamp() !== timestamp) {
																																				
																																					// Set transaction's confirmed timestamp
																																					transaction.setConfirmedTimestamp(timestamp);
																																					
																																					// Set transaction changed
																																					transactionChanged = true;
																																				}
																																				
																																				// Check if transaction changed
																																				if(transactionChanged === true) {
																																				
																																					// Append transaction to list of updated transactions
																																					updatedTransactions.push(transaction);
																																				}
																																				
																																				// Resolve
																																				resolve();
																																				
																																			// Catch errors
																																			}).catch(function(error) {
																																			
																																				// Reject error
																																				reject(error);
																																			});
																																		}
																																		
																																		// Otherwise
																																		else {
																																		
																																			// Check if transaction hasn't been broadcast and it's expired
																																			if(transaction.getBroadcast() === false && transaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && transaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && transaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																			
																																				// Go through all the transaction's spent outputs
																																				for(var l = 0; l < transaction.getSpentOutputs()["length"]; ++l) {
																																				
																																					// Get spent output
																																					var spentOutput = transaction.getSpentOutputs()[l];
																																					
																																					// Check if spent output doesn't exists in change to spent list or change to locked list
																																					if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX].indexOf(spentOutput) === Common.INDEX_NOT_FOUND && spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																					
																																						// Check if spent output isn't in the change to unspent list
																																						if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																					
																																							// Add spent output to change to unspent list
																																							spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].push(spentOutput);
																																						}
																																					}
																																					
																																					// Check if spent output doesn't exists in the list of outputs to change
																																					if(spentOutputsToChange.indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																					
																																						// Append spent output to list of spent outputs to change
																																						spentOutputsToChange.push(spentOutput);
																																					}
																																				}
																																			}
																																			
																																			// Otherwise
																																			else {
																																		
																																				// Go through all the transaction's spent outputs
																																				for(var l = 0; l < transaction.getSpentOutputs()["length"]; ++l) {
																																				
																																					// Get spent output
																																					var spentOutput = transaction.getSpentOutputs()[l];
																																					
																																					// Check if spent output doesn't exists in change to spent list
																																					if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX].indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																					
																																						// Check if spent output isn't in the change to locked list
																																						if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																					
																																							// Add spent output to change to locked list
																																							spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].push(spentOutput);
																																						}
																																						
																																						// Check if spent output exists in change to unspent list
																																						if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].indexOf(spentOutput) !== Common.INDEX_NOT_FOUND) {
																																						
																																							// Remove spent output from change to unspent list
																																							spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].splice(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].indexOf(spentOutput), 1);
																																						}
																																					}
																																					
																																					// Check if spent output doesn't exists in the list of outputs to change
																																					if(spentOutputsToChange.indexOf(spentOutput) === Common.INDEX_NOT_FOUND) {
																																					
																																						// Append spent output to list of spent outputs to change
																																						spentOutputsToChange.push(spentOutput);
																																					}
																																				}
																																			}
																																		
																																			// Check if transaction's amount was released
																																			if(transaction.getAmountReleased() === true) {
																																		
																																				// Set transaction amount hasn't been released
																																				transaction.setAmountReleased(false);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																		
																																			// Check if transaction hasn't been broadcast, it isn't expired, and its time to live cut off height has past
																																			if(transaction.getBroadcast() === false && transaction.getExpired() === false && transaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && transaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && transaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																			
																																				// Set that transaction is expired
																																				transaction.setExpired(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction's checked needs to be updated
																																			if(transaction.getChecked() === false) {
																																			
																																				// Set transaction's checked
																																				transaction.setChecked(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction hasn't been broadcast, it isn't expired, and its lock height is the next block
																																			if(transaction.getBroadcast() === false && transaction.getExpired() === false && transaction.getLockHeight() !== Transaction.UNKNOWN_LOCK_HEIGHT && transaction.getLockHeight() !== Transaction.NO_LOCK_HEIGHT && transaction.getLockHeight().isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																			
																																				// Return broadcasting transaction to the node
																																				return self.node.broadcastTransaction(JSONBigNumber.parse(transaction.getRebroadcastMessage())).then(function() {
																																				
																																					// Set transaction has been broadcast
																																					transaction.setBroadcast(true);
																																					
																																					// Go through all of the transaction's change outputs
																																					for(var l = 0; l < transaction.getChangeOutputs()["length"]; ++l) {
																																					
																																						// Get change output
																																						var changeOutput = transaction.getChangeOutputs()[l];
																																					
																																						// Append change output to list of outputs to change
																																						changeOutputsToChange.push(changeOutput);
																																					}
																																					
																																					// Append transaction to list of updated transactions
																																					updatedTransactions.push(transaction);
																																					
																																					// Resolve
																																					resolve();
																																					
																																				// Catch errors
																																				}).catch(function(error) {
																																				
																																					// Check if transaction changed
																																					if(transactionChanged === true) {
																																					
																																						// Append transaction to list of updated transactions
																																						updatedTransactions.push(transaction);
																																					}
																																				
																																					// Resolve
																																					resolve();
																																				});
																																			}
																																			
																																			// Otherwise
																																			else {
																																			
																																				// Check if transaction changed
																																				if(transactionChanged === true) {
																																				
																																					// Append transaction to list of updated transactions
																																					updatedTransactions.push(transaction);
																																				}
																																				
																																				// Resolve
																																				resolve();
																																			}
																																		}
																																	
																																	// Catch errors
																																	}).catch(function(error) {
																																	
																																		// Reject error
																																		reject(error);
																																	});
																																}));
																															}
																														}
																													}
																													
																													// Return verifying sent transactions
																													return Promise.all(verifyingSentTransactions).then(function() {
																													
																														// Go through all pending transactions
																														for(var k = 0; k < pendingTransactions["length"]; ++k) {
																														
																															// Get pending transaction
																															var pendingTransaction = pendingTransactions[k];
																															
																															// Check if pending transaction is a change output that's changing
																															if(changeOutputsToChange.indexOf(pendingTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																															
																																// Remove pending transaction from list
																																pendingTransactions.splice(k--, 1);
																															}
																															
																															// Otherwise check if pending transaction is a spent output that's changing
																															else if(spentOutputsToChange.indexOf(pendingTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																															
																																// Remove pending transaction from list
																																pendingTransactions.splice(k--, 1);
																															}
																														}
																													
																														// Return getting change transactions
																														return self.transactions.getTransactions(changeOutputsToChange).then(function(changeTransactions) {
																															
																															// Go through all change transactions
																															for(var k = 0; k < changeTransactions["length"]; ++k) {
																															
																																// Get change transaction
																																var changeTransaction = changeTransactions[k];
																																
																																// Set change transaction has been broadcast
																																changeTransaction.setBroadcast(true);
																																
																																// Set changed transaction has been checked
																																changeTransaction.setChecked(true);
																																
																																// Append change transaction to list of updated transactions
																																updatedTransactions.push(changeTransaction);
																															}
																													
																															// Go through all updated transactions
																															for(var k = 0; k < updatedTransactions["length"]; ++k) {
																															
																																// Get updated transaction
																																var updatedTransaction = updatedTransactions[k];
																																
																																// Check if updated transaction is a spent output that's changing
																																if(updatedTransaction.getKeyPath() !== Transaction.NO_KEY_PATH && spentOutputsToChange.indexOf(updatedTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																																
																																	// Check updated transaction's status
																																	switch(updatedTransaction.getStatus()) {
																																	
																																		// Spent
																																		case Transaction.STATUS_SPENT:
																																		
																																			// Subtract updated transaction's amount from spent amount change
																																			spentAmountChange = spentAmountChange.minus(updatedTransaction.getAmount());
																																		
																																			// Break
																																			break;
																																		
																																		// Unconfirmed
																																		case Transaction.STATUS_UNCONFIRMED:
																																		
																																			// Subtract updated transaction's amount from unconfirmed amount change
																																			unconfirmedAmountChange = unconfirmedAmountChange.minus(updatedTransaction.getAmount());
																																		
																																			// Break
																																			break;
																																		
																																		// Unspent
																																		case Transaction.STATUS_UNSPENT:
																																		
																																			// Check if updated transaction's amount has been released
																																			if(updatedTransaction.getAmountReleased() === true) {
																																		
																																				// Subtract updated transaction's amount from unspent amount change
																																				unspentAmountChange = unspentAmountChange.minus(updatedTransaction.getAmount());
																																			}
																																			
																																			// Otherwis
																																			else {
																																		
																																				// Subtract updated transaction's amount from pending amount change
																																				pendingAmountChange = pendingAmountChange.minus(updatedTransaction.getAmount());
																																			}
																																		
																																			// Break
																																			break;
																																		
																																		// Locked
																																		case Transaction.STATUS_LOCKED:
																																		
																																			// Subtract updated transaction's amount from locked amount change
																																			lockedAmountChange = lockedAmountChange.minus(updatedTransaction.getAmount());
																																		
																																			// Break
																																			break;
																																	}
																																
																																	// Check if updated transaction is being changed to spent
																																	if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX].indexOf(updatedTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																																	
																																		// Set updated transaction's status to spent
																																		updatedTransaction.setStatus(Transaction.STATUS_SPENT);
																																		
																																		// Set updated transaction's amount has been released
																																		updatedTransaction.setAmountReleased(true);
																																		
																																		// Add updated transaction's amount to spent amount change
																																		spentAmountChange = spentAmountChange.plus(updatedTransaction.getAmount());
																																	}
																																	
																																	// Otherwise check if updated transaction is being changed to unspent
																																	else if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].indexOf(updatedTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																																	
																																		// Set updated transaction's status to unspent
																																		updatedTransaction.setStatus(Transaction.STATUS_UNSPENT);
																																		
																																		// Check if the updated transaction's spendable height is the next block
																																		if(updatedTransaction.getSpendableHeight() !== Transaction.UNKNOWN_SPENDABLE_HEIGHT && updatedTransaction.getSpendableHeight().isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																	
																																			// Set updated transaction's amount has been released
																																			updatedTransaction.setAmountReleased(true);
																																			
																																			// Add updated transaction's amount to unspent amount change
																																			unspentAmountChange = unspentAmountChange.plus(updatedTransaction.getAmount());
																																		}
																																		
																																		// Otherwise
																																		else {
																																	
																																			// Set updated transaction's amount hasn't been released
																																			updatedTransaction.setAmountReleased(false);
																																			
																																			// Add updated transaction's amount to pending amount change
																																			pendingAmountChange = pendingAmountChange.plus(updatedTransaction.getAmount());
																																		}
																																	}
																																	
																																	// Otherwise check if updated transaction is being changed to locked
																																	else if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].indexOf(updatedTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																																	
																																		// Set updated transaction's status to locked
																																		updatedTransaction.setStatus(Transaction.STATUS_LOCKED);
																																		
																																		// Set updated transaction's amount has been released
																																		updatedTransaction.setAmountReleased(true);
																																		
																																		// Add updated transaction's amount to locked amount change
																																		lockedAmountChange = lockedAmountChange.plus(updatedTransaction.getAmount());
																																	}
																																
																																	// Remove spent output to change from list
																																	spentOutputsToChange.splice(spentOutputsToChange.indexOf(updatedTransaction.getKeyPath()), 1);
																																}
																															}
																														
																															// Return getting spent transactions
																															return self.transactions.getTransactions(spentOutputsToChange).then(function(spentTransactions) {
																															
																																// Initializing verifying spent transactions
																																var verifyingSpentTransactions = [];
																															
																																// Go through all spent transactions
																																for(let k = 0; k < spentTransactions["length"]; ++k) {
																																
																																	// Append verifying spent transaction to list
																																	verifyingSpentTransactions.push(new Promise(function(resolve, reject) {
																																
																																		// Get spent transaction
																																		var spentTransaction = spentTransactions[k];
																																		
																																		// Set transaction changed
																																		var transactionChanged = false;
																																		
																																		// Check if spent transaction is being changed to spent
																																		if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX].indexOf(spentTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																																		
																																			// Check spent transaction's status
																																			switch(spentTransaction.getStatus()) {
																																		
																																				// Unconfirmed
																																				case Transaction.STATUS_UNCONFIRMED:
																																				
																																					// Check if spent transaction is expired
																																					if(spentTransaction.getExpired() === true) {
																																					
																																						// Check if spent transaction isn't change output
																																						if(spentTransaction.getDisplay() === true) {
																																					
																																							// Subtract spent transaction's amount from expired amount change
																																							expiredAmountChange = expiredAmountChange.minus(spentTransaction.getAmount());
																																						}
																																					}
																																					
																																					// Otherwise
																																					else {
																																				
																																						// Subtract spent transaction's amount from unconfirmed amount change
																																						unconfirmedAmountChange = unconfirmedAmountChange.minus(spentTransaction.getAmount());
																																					}
																																					
																																					// Add spent transaction's amount to spent amount change
																																					spentAmountChange = spentAmountChange.plus(spentTransaction.getAmount());
																																					
																																					// Break
																																					break;
																																				
																																				// Unspent
																																				case Transaction.STATUS_UNSPENT:
																																				
																																					// Check if spent transaction's amount has been released
																																					if(spentTransaction.getAmountReleased() === true) {
																																				
																																						// Subtract spent transaction's amount from unspent amount change
																																						unspentAmountChange = unspentAmountChange.minus(spentTransaction.getAmount());
																																					}
																																					
																																					// Otherwis
																																					else {
																																				
																																						// Subtract spent transaction's amount from pending amount change
																																						pendingAmountChange = pendingAmountChange.minus(spentTransaction.getAmount());
																																					}
																																					
																																					// Add spent transaction's amount to spent amount change
																																					spentAmountChange = spentAmountChange.plus(spentTransaction.getAmount());
																																					
																																					// Break
																																					break;
																																				
																																				// Locked
																																				case Transaction.STATUS_LOCKED:
																																				
																																					// Subtract spent transaction's amount from locked amount change
																																					lockedAmountChange = lockedAmountChange.minus(spentTransaction.getAmount());
																																					
																																					// Add spent transaction's amount to spent amount change
																																					spentAmountChange = spentAmountChange.plus(spentTransaction.getAmount());
																																					
																																					// Break
																																					break;
																																			}
																																			
																																			// Check if spent transaction's amount released needs to be updated
																																			if(spentTransaction.getAmountReleased() === false) {
																																			
																																				// Set spent transaction's amount has been released
																																				spentTransaction.setAmountReleased(true);
																																			
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's expired needs to be updated
																																			if(spentTransaction.getExpired() === true) {
																																			
																																				// Set spent transaction's expired
																																				spentTransaction.setExpired(false);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's broadcast needs to be updated
																																			if(spentTransaction.getBroadcast() === false) {
																																			
																																				// Set spent transaction's broadcast
																																				spentTransaction.setBroadcast(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's status needs to be updated
																																			if(spentTransaction.getStatus() !== Transaction.STATUS_SPENT) {
																																			
																																				// Set spent transaction's status to spent
																																				spentTransaction.setStatus(Transaction.STATUS_SPENT);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's checked needs to be updated
																																			if(spentTransaction.getChecked() === false) {
																																			
																																				// Set spent transaction's checked
																																				spentTransaction.setChecked(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction changed
																																			if(transactionChanged === true) {
																																			
																																				// Append spent transaction to list of updated transactions
																																				updatedTransactions.push(spentTransaction);
																																			}
																																			
																																			// Resolve
																																			resolve();
																																		}
																																		
																																		// Otherwise check if spent transaction is being changed to unspent
																																		else if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX].indexOf(spentTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																																		
																																			// Return getting node's output for the spent transaction
																																			return self.node.getOutputs([spentTransaction.getCommit()]).then(function(outputs) {
																																			
																																				// Get output
																																				var output = outputs[0];
																																				
																																				// Get wallet owns output
																																				var getWalletOwnsOutput = function() {
																																				
																																					// Return promise
																																					return new Promise(function(resolve, reject) {
																																					
																																						// Check if output was found
																																						if(output !== Node.NO_OUTPUT_FOUND) {
																																						
																																							// Return getting if wallet owns output
																																							return wallet.ownsOutput(new Output(output["commit"], output["proof"], output["output_type"], output["block_height"])).then(function(outputInformation) {
																																							
																																								// Check if output information exists
																																								if(outputInformation !== Output.NO_INFORMATION) {
																																								
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
																																								reject(error);
																																							});
																																						}
																																						
																																						// Otherwise
																																						else {
																																						
																																							// Resolve false
																																							resolve(false);
																																						}
																																					});
																																				};
																																				
																																				// Return getting if the wallet owns the output
																																				return getWalletOwnsOutput().then(function(walletOwnsOutput) {
																																				
																																					// Check if wallet owns output
																																					if(walletOwnsOutput === true) {
																																					
																																						// Check if spent transaction's is coinbase needs to be updated
																																						if(spentTransaction.getIsCoinbase() !== (output["output_type"] === Output.COINBASE_TYPE)) {
																																						
																																							// Set sent transaction's is coinbase
																																							spentTransaction.setIsCoinbase(output["output_type"] === Output.COINBASE_TYPE);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if spent transaction's height needs to be updated
																																						if(spentTransaction.getHeight() === Transaction.UNKNOWN_HEIGHT || spentTransaction.getHeight().isEqualTo(output["block_height"]) === false) {
																																						
																																							// Set spent transaction's height
																																							spentTransaction.setHeight(output["block_height"]);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Get new spendable height as the output height added to the spent transaction's number of confirmations
																																						var newSpendableHeight = output["block_height"].plus(spentTransaction.getRequiredNumberOfConfirmations().minus(1));
																																						
																																						// Check if maturity height is greater than the new spendable height
																																						if(output["block_height"].plus((spentTransaction.getIsCoinbase() === true) ? Consensus.COINBASE_MATURITY - 1 : 0).isGreaterThan(newSpendableHeight) === true) {
																																						
																																							// Set the new spendable height to the maturity height
																																							newSpendableHeight = output["block_height"].plus((spentTransaction.getIsCoinbase() === true) ? Consensus.COINBASE_MATURITY - 1 : 0);
																																						}
																																						
																																						// Check if spent transaction's lock height exists and if it added to the number of confirmation is greater than the new spendable height
																																						if(spentTransaction.getLockHeight() !== Transaction.UNKNOWN_LOCK_HEIGHT && spentTransaction.getLockHeight() !== Transaction.NO_LOCK_HEIGHT && spentTransaction.getLockHeight().plus(spentTransaction.getRequiredNumberOfConfirmations().minus(1)).isGreaterThan(newSpendableHeight) === true) {
																																						
																																							// Set the new spendable height to the spent transaction's lock height added to the number of confirmation
																																							newSpendableHeight = spentTransaction.getLockHeight().plus(spentTransaction.getRequiredNumberOfConfirmations().minus(1));
																																						}
																																						
																																						// Check spent transaction's status
																																						switch(spentTransaction.getStatus()) {
																																					
																																							// Spent
																																							case Transaction.STATUS_SPENT:
																																							
																																								// Subtract spent transaction's amount from spent amount change
																																								spentAmountChange = spentAmountChange.minus(spentTransaction.getAmount());
																																								
																																								// Check if the spent transaction's new spendable height is the next block
																																								if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																								
																																									// Add spent transaction's amount to unspent amount change
																																									unspentAmountChange = unspentAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Add spent transaction's amount to pending amount change
																																									pendingAmountChange = pendingAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Break
																																								break;
																																							
																																							// Unconfirmed
																																							case Transaction.STATUS_UNCONFIRMED:
																																							
																																								// Check if spent transaction is expired
																																								if(spentTransaction.getExpired() === true) {
																																								
																																									// Check if spent transaction isn't change output
																																									if(spentTransaction.getDisplay() === true) {
																																								
																																										// Subtract spent transaction's amount from expired amount change
																																										expiredAmountChange = expiredAmountChange.minus(spentTransaction.getAmount());
																																									}
																																								}
																																								
																																								// Otherwise
																																								else {
																																							
																																									// Subtract spent transaction's amount from unconfirmed amount change
																																									unconfirmedAmountChange = unconfirmedAmountChange.minus(spentTransaction.getAmount());
																																								}
																																								
																																								// Check if the spent transaction's new spendable height is the next block
																																								if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																								
																																									// Add spent transaction's amount to unspent amount change
																																									unspentAmountChange = unspentAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Add spent transaction's amount to pending amount change
																																									pendingAmountChange = pendingAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Break
																																								break;
																																							
																																							// Unspent
																																							case Transaction.STATUS_UNSPENT:
																																							
																																								// Check if the spent transaction's new spendable height is the next block
																																								if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																								
																																									// Check if spent transaction's amount hasn't been released
																																									if(spentTransaction.getAmountReleased() === false) {
																																									
																																										// Subtract spent transaction's amount from pending amount change
																																										pendingAmountChange = pendingAmountChange.minus(spentTransaction.getAmount());
																																										
																																										// Add spent transaction's amount to unspent amount change
																																										unspentAmountChange = unspentAmountChange.plus(spentTransaction.getAmount());
																																									}
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Check if spent transaction's amount has been released
																																									if(spentTransaction.getAmountReleased() === true) {
																																									
																																										// Subtract spent transaction's amount from unspent amount change
																																										unspentAmountChange = unspentAmountChange.minus(spentTransaction.getAmount());
																																										
																																										// Add spent transaction's amount to pending amount change
																																										pendingAmountChange = pendingAmountChange.plus(spentTransaction.getAmount());
																																									}
																																								}
																																							
																																								// Break
																																								break;
																																							
																																							// Locked
																																							case Transaction.STATUS_LOCKED:
																																							
																																								// Subtract spent transaction's amount from locked amount change
																																								lockedAmountChange = lockedAmountChange.minus(spentTransaction.getAmount());
																																								
																																								// Check if the spent transaction's new spendable height is the next block
																																								if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																								
																																									// Add spent transaction's amount to unspent amount change
																																									unspentAmountChange = unspentAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Add spent transaction's amount to pending amount change
																																									pendingAmountChange = pendingAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Break
																																								break;
																																						}
																																						
																																						// Check if the spent transaction's new spendable height is the next block
																																						if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																						
																																							// Check if spent transaction's amount released needs to be updated
																																							if(spentTransaction.getAmountReleased() === false) {
																																							
																																								// Set spent transaction's amount has been released
																																								spentTransaction.setAmountReleased(true);
																																							
																																								// Set transaction changed
																																								transactionChanged = true;
																																							}
																																						}
																																						
																																						// Otherwise
																																						else {
																																						
																																							// Check if spent transaction's amount released needs to be updated
																																							if(spentTransaction.getAmountReleased() === true) {
																																							
																																								// Set spent transaction's amount hasn't been released
																																								spentTransaction.setAmountReleased(false);
																																							
																																								// Set transaction changed
																																								transactionChanged = true;
																																							}
																																						}
																																						
																																						// Check if spent transaction's expired needs to be updated
																																						if(spentTransaction.getExpired() === true) {
																																						
																																							// Set spent transaction's expired
																																							spentTransaction.setExpired(false);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if spent transaction's broadcast needs to be updated
																																						if(spentTransaction.getBroadcast() === false) {
																																						
																																							// Set spent transaction's broadcast
																																							spentTransaction.setBroadcast(true);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if spent transaction's status needs to be updated
																																						if(spentTransaction.getStatus() !== Transaction.STATUS_UNSPENT) {
																																						
																																							// Set spent transaction's status to unspent
																																							spentTransaction.setStatus(Transaction.STATUS_UNSPENT);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if spent transaction's spendable height needs to be updated
																																						if(spentTransaction.getSpendableHeight() === Transaction.UNKNOWN_SPENDABLE_HEIGHT || spentTransaction.getSpendableHeight().isEqualTo(newSpendableHeight) === false) {
																																						
																																							// Set spent transaction's spendable height
																																							spentTransaction.setSpendableHeight(newSpendableHeight);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if spent transaction's checked needs to be updated
																																						if(spentTransaction.getChecked() === false) {
																																						
																																							// Set spent transaction's checked
																																							spentTransaction.setChecked(true);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Return getting header at output's height
																																						return self.node.getHeader(output["block_height"]).then(function(header) {
																																						
																																							// Get timestamp
																																							var timestamp = header["timestamp"];
																																							
																																							// Check if spent transaction's confirmed timestamp needs to be updated
																																							if(spentTransaction.getConfirmedTimestamp() !== timestamp) {
																																							
																																								// Set spent transaction's confirmed timestamp
																																								spentTransaction.setConfirmedTimestamp(timestamp);
																																								
																																								// Set transaction changed
																																								transactionChanged = true;
																																							}
																																					
																																							// Check if transaction changed
																																							if(transactionChanged === true) {
																																							
																																								// Append spent transaction to list of updated transactions
																																								updatedTransactions.push(spentTransaction);
																																							}
																																							
																																							// Resolve
																																							resolve();
																																							
																																						// Catch errors
																																						}).catch(function(error) {
																																						
																																							// Reject error
																																							reject(error);
																																						});
																																					}
																																					
																																					// Otherwise
																																					else {
																																					
																																						// Check spent transaction's status
																																						switch(spentTransaction.getStatus()) {
																																					
																																							// Spent
																																							case Transaction.STATUS_SPENT:
																																							
																																								// Subtract spent transaction's amount from spent amount change
																																								spentAmountChange = spentAmountChange.minus(spentTransaction.getAmount());
																																								
																																								// Check if the spent transaction's is expired
																																								if(spentTransaction.getBroadcast() === false && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																								
																																									// Check if spent transaction isn't change output
																																									if(spentTransaction.getDisplay() === true) {
																																								
																																										// Add spent transaction's amount to expired amount change
																																										expiredAmountChange = expiredAmountChange.plus(spentTransaction.getAmount());
																																									}
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Add spent transaction's amount to unconfirmed amount change
																																									unconfirmedAmountChange = unconfirmedAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Break
																																								break;
																																							
																																							// Unconfirmed
																																							case Transaction.STATUS_UNCONFIRMED:
																																							
																																								// Check if the spent transaction's is expired
																																								if(spentTransaction.getBroadcast() === false && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																								
																																									// Check if spent transaction isn't expired
																																									if(spentTransaction.getExpired() === false) {
																																									
																																										// Subtract spent transaction's amount from unconfirmed amount change
																																										unconfirmedAmountChange = unconfirmedAmountChange.minus(spentTransaction.getAmount());
																																										
																																										// Check if spent transaction isn't change output
																																										if(spentTransaction.getDisplay() === true) {
																																									
																																											// Add spent transaction's amount to expired amount change
																																											expiredAmountChange = expiredAmountChange.plus(spentTransaction.getAmount());
																																										}
																																									}
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Check if spent transaction is expired
																																									if(spentTransaction.getExpired() === true) {
																																									
																																										// Check if spent transaction isn't change output
																																										if(spentTransaction.getDisplay() === true) {
																																									
																																											// Subtract spent transaction's amount from expired amount change
																																											expiredAmountChange = expiredAmountChange.minus(spentTransaction.getAmount());
																																										}
																																										
																																										// Add spent transaction's amount to unconfirmed amount change
																																										unconfirmedAmountChange = unconfirmedAmountChange.plus(spentTransaction.getAmount());
																																									}
																																								}
																																							
																																								// Break
																																								break;
																																							
																																							// Unspent
																																							case Transaction.STATUS_UNSPENT:
																																							
																																								// Check if spent transaction's amount has been released
																																								if(spentTransaction.getAmountReleased() === true) {
																																							
																																									// Subtract spent transaction's amount from unspent amount change
																																									unspentAmountChange = unspentAmountChange.minus(spentTransaction.getAmount());
																																								}
																																								
																																								// Otherwis
																																								else {
																																							
																																									// Subtract spent transaction's amount from pending amount change
																																									pendingAmountChange = pendingAmountChange.minus(spentTransaction.getAmount());
																																								}
																																								
																																								// Check if the spent transaction's is expired
																																								if(spentTransaction.getBroadcast() === false && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																								
																																									// Check if spent transaction isn't change output
																																									if(spentTransaction.getDisplay() === true) {
																																								
																																										// Add spent transaction's amount to expired amount change
																																										expiredAmountChange = expiredAmountChange.plus(spentTransaction.getAmount());
																																									}
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Add spent transaction's amount to unconfirmed amount change
																																									unconfirmedAmountChange = unconfirmedAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Break
																																								break;
																																							
																																							// Locked
																																							case Transaction.STATUS_LOCKED:
																																							
																																								// Subtract spent transaction's amount from locked amount change
																																								lockedAmountChange = lockedAmountChange.minus(spentTransaction.getAmount());
																																								
																																								// Check if the spent transaction's is expired
																																								if(spentTransaction.getBroadcast() === false && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																								
																																									// Check if spent transaction isn't change output
																																									if(spentTransaction.getDisplay() === true) {
																																								
																																										// Add spent transaction's amount to expired amount change
																																										expiredAmountChange = expiredAmountChange.plus(spentTransaction.getAmount());
																																									}
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Add spent transaction's amount to unconfirmed amount change
																																									unconfirmedAmountChange = unconfirmedAmountChange.plus(spentTransaction.getAmount());
																																								}
																																								
																																								// Break
																																								break;
																																						}
																																						
																																						// Check if spent transaction's amount released needs to be updated
																																						if(spentTransaction.getAmountReleased() === true) {
																																						
																																							// Set spent transaction's amount released
																																							spentTransaction.setAmountReleased(false);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if the spent transaction's is expired
																																						if(spentTransaction.getBroadcast() === false && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && spentTransaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																						
																																							// Check if spent transaction's expired needs to be updated
																																							if(spentTransaction.getExpired() === false) {
																																							
																																								// Set that spent transaction's is expired
																																								spentTransaction.setExpired(true);
																																							
																																								// Set transaction changed
																																								transactionChanged = true;
																																							}
																																						}
																																						
																																						// Otherwise
																																						else {
																																						
																																							// Check if spent transaction's expired needs to be updated
																																							if(spentTransaction.getExpired() === true) {
																																							
																																								// Set that spent transaction's isn't expired
																																								spentTransaction.setExpired(false);
																																							
																																								// Set transaction changed
																																								transactionChanged = true;
																																							}
																																						}
																																						
																																						// Check if spent transaction's status needs to be updated
																																						if(spentTransaction.getStatus() !== Transaction.STATUS_UNCONFIRMED) {
																																						
																																							// Set spent transaction's status to unconfirmed
																																							spentTransaction.setStatus(Transaction.STATUS_UNCONFIRMED);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if spent transaction's confirmed timestamp needs to be updated
																																						if(spentTransaction.getConfirmedTimestamp() !== Transaction.NO_CONFIRMED_TIMESTAMP) {
																																						
																																							// Set spent transaction's confirmed timestamp
																																							spentTransaction.setConfirmedTimestamp(Transaction.NO_CONFIRMED_TIMESTAMP);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																						
																																						// Check if spent transaction's checked needs to be updated
																																						if(spentTransaction.getChecked() === false) {
																																						
																																							// Set spent transaction's checked
																																							spentTransaction.setChecked(true);
																																							
																																							// Set transaction changed
																																							transactionChanged = true;
																																						}
																																				
																																						// Check if transaction changed
																																						if(transactionChanged === true) {
																																						
																																							// Append spent transaction to list of updated transactions
																																							updatedTransactions.push(spentTransaction);
																																						}
																																						
																																						// Resolve
																																						resolve();
																																					}
																																				
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
																																		}
																																		
																																		// Otherwise check if spent transaction is being changed to locked
																																		else if(spentOutputs[Wallets.SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX].indexOf(spentTransaction.getKeyPath()) !== Common.INDEX_NOT_FOUND) {
																																		
																																			// Check spent transaction's status
																																			switch(spentTransaction.getStatus()) {
																																		
																																				// Spent
																																				case Transaction.STATUS_SPENT:
																																				
																																					// Subtract spent transaction's amount from spent amount change
																																					spentAmountChange = spentAmountChange.minus(spentTransaction.getAmount());
																																					
																																					// Add spent transaction's amount to locked amount change
																																					lockedAmountChange = lockedAmountChange.plus(spentTransaction.getAmount());
																																					
																																					// Break
																																					break;
																																				
																																				// Unconfirmed
																																				case Transaction.STATUS_UNCONFIRMED:
																																				
																																					// Check if spent transaction is expired
																																					if(spentTransaction.getExpired() === true) {
																																					
																																						// Check if spent transaction isn't change output
																																						if(spentTransaction.getDisplay() === true) {
																																					
																																							// Subtract spent transaction's amount from expired amount change
																																							expiredAmountChange = expiredAmountChange.minus(spentTransaction.getAmount());
																																						}
																																					}
																																					
																																					// Otherwise
																																					else {
																																				
																																						// Subtract spent transaction's amount from unconfirmed amount change
																																						unconfirmedAmountChange = unconfirmedAmountChange.minus(spentTransaction.getAmount());
																																					}
																																					
																																					// Add spent transaction's amount to locked amount change
																																					lockedAmountChange = lockedAmountChange.plus(spentTransaction.getAmount());
																																					
																																					// Break
																																					break;
																																				
																																				// Unspent
																																				case Transaction.STATUS_UNSPENT:
																																				
																																					// Check if spent transaction's amount has been released
																																					if(spentTransaction.getAmountReleased() === true) {
																																				
																																						// Subtract spent transaction's amount from unspent amount change
																																						unspentAmountChange = unspentAmountChange.minus(spentTransaction.getAmount());
																																					}
																																					
																																					// Otherwis
																																					else {
																																				
																																						// Subtract spent transaction's amount from pending amount change
																																						pendingAmountChange = pendingAmountChange.minus(spentTransaction.getAmount());
																																					}
																																					
																																					// Add spent transaction's amount to locked amount change
																																					lockedAmountChange = lockedAmountChange.plus(spentTransaction.getAmount());
																																					
																																					// Break
																																					break;
																																			}
																																			
																																			// Check if spent transaction's amount released needs to be updated
																																			if(spentTransaction.getAmountReleased() === false) {
																																			
																																				// Set spent transaction's amount has been released
																																				spentTransaction.setAmountReleased(true);
																																			
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's expired needs to be updated
																																			if(spentTransaction.getExpired() === true) {
																																			
																																				// Set spent transaction's expired
																																				spentTransaction.setExpired(false);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's broadcast needs to be updated
																																			if(spentTransaction.getBroadcast() === false) {
																																			
																																				// Set spent transaction's broadcast
																																				spentTransaction.setBroadcast(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's status needs to be updated
																																			if(spentTransaction.getStatus() !== Transaction.STATUS_LOCKED) {
																																			
																																				// Set spent transaction's status to locked
																																				spentTransaction.setStatus(Transaction.STATUS_LOCKED);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if spent transaction's checked needs to be updated
																																			if(spentTransaction.getChecked() === false) {
																																			
																																				// Set spent transaction's checked
																																				spentTransaction.setChecked(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction changed
																																			if(transactionChanged === true) {
																																			
																																				// Append spent transaction to list of updated transactions
																																				updatedTransactions.push(spentTransaction);
																																			}
																																			
																																			// Resolve
																																			resolve();
																																		}
																																		
																																		// Otherwise
																																		else {
																																		
																																			// Check if spent transaction's checked needs to be updated
																																			if(spentTransaction.getChecked() === false) {
																																			
																																				// Set spent transaction's checked
																																				spentTransaction.setChecked(true);
																																				
																																				// Set transaction changed
																																				transactionChanged = true;
																																			}
																																			
																																			// Check if transaction changed
																																			if(transactionChanged === true) {
																																			
																																				// Append spent transaction to list of updated transactions
																																				updatedTransactions.push(spentTransaction);
																																			}
																																			
																																			// Resolve
																																			resolve();
																																		}
																																	}));
																																}
																																
																																// Return verifying spent transactions
																																return Promise.all(verifyingSpentTransactions).then(function() {
																																
																																	// Initialize verifying pending transactions
																																	var verifyingPendingTransactions = [];
																																	
																																	// Go through all groups of pending transactions
																																	for(let k = 0; k < pendingTransactions["length"]; k += Wallets.VERIFYING_OUTPUTS_GROUP_SIZE) {
																																	
																																		// Append verifying group of pending transactions to list
																																		verifyingPendingTransactions.push(new Promise(function(resolve, reject) {
																																				
																																			// Return getting node's outputs for the group of pending transaction
																																			return self.node.getOutputs(pendingTransactions.slice(k, k + Wallets.VERIFYING_OUTPUTS_GROUP_SIZE).map(function(pendingTransaction) {
																																		
																																				// Return pending transaction's commit
																																				return pendingTransaction.getCommit();
																																			
																																			})).then(function(outputs) {
																																			
																																				// Initialize verifying pending transactions group
																																				var verifyingPendingTransactionsGroup = [];
																																			
																																				// Go through all outputs
																																				for(let l = 0; l < outputs["length"]; ++l) {
																																				
																																					// Append verifying pending transaction group to list
																																					verifyingPendingTransactionsGroup.push(new Promise(function(resolve, reject) {
																																					
																																						// Get output
																																						var output = outputs[l];
																																						
																																						// Get pending transaction
																																						var pendingTransaction = pendingTransactions[k + l];
																																						
																																						// Get wallet owns output
																																						var getWalletOwnsOutput = function() {
																																						
																																							// Return promise
																																							return new Promise(function(resolve, reject) {
																																							
																																								// Check if output was found
																																								if(output !== Node.NO_OUTPUT_FOUND) {
																																								
																																									// Return getting if wallet owns output
																																									return wallet.ownsOutput(new Output(output["commit"], output["proof"], output["output_type"], output["block_height"])).then(function(outputInformation) {
																																									
																																										// Check if output information exists
																																										if(outputInformation !== Output.NO_INFORMATION) {
																																										
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
																																										reject(error);
																																									});
																																								}
																																								
																																								// Otherwise
																																								else {
																																								
																																									// Resolve false
																																									resolve(false);
																																								}
																																							});
																																						};
																																						
																																						// Return getting if the wallet owns the output
																																						return getWalletOwnsOutput().then(function(walletOwnsOutput) {
																																					
																																							// Set transaction changed
																																							var transactionChanged = false;
																																						
																																							// Check if wallet owns output
																																							if(walletOwnsOutput === true) {
																																							
																																								// Check if pending transaction's is coinbase needs to be updated
																																								if(pendingTransaction.getIsCoinbase() !== (output["output_type"] === Output.COINBASE_TYPE)) {
																																								
																																									// Set pending transaction's is coinbase
																																									pendingTransaction.setIsCoinbase(output["output_type"] === Output.COINBASE_TYPE);
																																									
																																									// Set transaction changed
																																									transactionChanged = true;
																																								}
																																								
																																								// Check if pending transaction's height needs to be updated
																																								if(pendingTransaction.getHeight() === Transaction.UNKNOWN_HEIGHT || pendingTransaction.getHeight().isEqualTo(output["block_height"]) === false) {
																																								
																																									// Set pending transaction's height
																																									pendingTransaction.setHeight(output["block_height"]);
																																									
																																									// Set transaction changed
																																									transactionChanged = true;
																																								}
																																								
																																								// Check if pending transaction's broadcast needs to be updated
																																								if(pendingTransaction.getBroadcast() === false) {
																																								
																																									// Set pending transaction's broadcast
																																									pendingTransaction.setBroadcast(true);
																																									
																																									// Set transaction changed
																																									transactionChanged = true;
																																								}
																																								
																																								// Get new spendable height as the output height added to the pending transaction's number of confirmations
																																								var newSpendableHeight = output["block_height"].plus(pendingTransaction.getRequiredNumberOfConfirmations().minus(1));
																																								
																																								// Check if maturity height is greater than the new spendable height
																																								if(output["block_height"].plus((pendingTransaction.getIsCoinbase() === true) ? Consensus.COINBASE_MATURITY - 1 : 0).isGreaterThan(newSpendableHeight) === true) {
																																								
																																									// Set the new spendable height to the maturity height
																																									newSpendableHeight = output["block_height"].plus((pendingTransaction.getIsCoinbase() === true) ? Consensus.COINBASE_MATURITY - 1 : 0);
																																								}
																																								
																																								// Check if pending transaction's lock height exists and if it added to the number of confirmation is greater than the new spendable height
																																								if(pendingTransaction.getLockHeight() !== Transaction.UNKNOWN_LOCK_HEIGHT && pendingTransaction.getLockHeight() !== Transaction.NO_LOCK_HEIGHT && pendingTransaction.getLockHeight().plus(pendingTransaction.getRequiredNumberOfConfirmations().minus(1)).isGreaterThan(newSpendableHeight) === true) {
																																								
																																									// Set the new spendable height to the pending transaction's lock height added to the number of confirmation
																																									newSpendableHeight = pendingTransaction.getLockHeight().plus(pendingTransaction.getRequiredNumberOfConfirmations().minus(1));
																																								}
																																								
																																								// Check pending transaction's status
																																								switch(pendingTransaction.getStatus()) {
																																								
																																									// Spent
																																									case Transaction.STATUS_SPENT:
																																									
																																										// Revert pending transaction's status to locked since transaction wasn't completed yet
																																										pendingTransaction.setStatus(Transaction.STATUS_LOCKED);
																																										
																																										// Add pending transaction's amount to locked amount change
																																										lockedAmountChange = lockedAmountChange.plus(pendingTransaction.getAmount());
																																										
																																										// Subtract pending transaction's amount from spent amount change
																																										spentAmountChange = spentAmountChange.minus(pendingTransaction.getAmount());
																																										
																																										// Set transaction changed
																																										transactionChanged = true;
																																									
																																										// Break
																																										break;
																																									
																																									// Unconfirmed
																																									case Transaction.STATUS_UNCONFIRMED:
																																									
																																										// Update pending transaction's status to unspent since transaction is confirmed on the chain
																																										pendingTransaction.setStatus(Transaction.STATUS_UNSPENT);
																																										
																																										// Check if the pending transaction's new spendable height is the next block
																																										if(newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																										
																																											// Check if the pending transaction's amount hasn't been released
																																											if(pendingTransaction.getAmountReleased() === false) {
																																											
																																												// Set pending transaction amount has been released
																																												pendingTransaction.setAmountReleased(true);
																																												
																																												// Add pending transaction's amount to unspent amount change
																																												unspentAmountChange = unspentAmountChange.plus(pendingTransaction.getAmount());
																																											}
																																										}
																																										
																																										// Otherwise
																																										else {
																																										
																																											// Add pending transaction's amount to pending amount change
																																											pendingAmountChange = pendingAmountChange.plus(pendingTransaction.getAmount());
																																										
																																											// Check if the pending transaction's amount has been released
																																											if(pendingTransaction.getAmountReleased() === true) {
																																										
																																												// Set pending transaction amount hasn't been released
																																												pendingTransaction.setAmountReleased(false);
																																												
																																												// Subtract pending transaction's amount from unspent amount change
																																												unspentAmountChange = unspentAmountChange.minus(pendingTransaction.getAmount());
																																											}
																																										}
																																										
																																										// Check if pending transaction isn't canceled and expired
																																										if(pendingTransaction.getCanceled() === false && pendingTransaction.getExpired() === false) {
																																										
																																											// Subtract pending transaction's amount from unconfirmed amount change
																																											unconfirmedAmountChange = unconfirmedAmountChange.minus(pendingTransaction.getAmount());
																																										}
																																										
																																										// Set transaction changed
																																										transactionChanged = true;
																																									
																																										// Break
																																										break;
																																									
																																									// Unspent
																																									case Transaction.STATUS_UNSPENT:
																																									
																																										// Check if pending transaction's amount hasn't been released and the pending transaction's new spendable height is the next block
																																										if(pendingTransaction.getAmountReleased() === false && newSpendableHeight.isLessThanOrEqualTo(tipHeight.getHeight().plus(1)) === true) {
																																										
																																											// Set pending transaction amount has been released
																																											pendingTransaction.setAmountReleased(true);
																																											
																																											// Add pending transaction's amount to unspent amount change
																																											unspentAmountChange = unspentAmountChange.plus(pendingTransaction.getAmount());
																																											
																																											// Subtract pending transaction's amount from pending amount change
																																											pendingAmountChange = pendingAmountChange.minus(pendingTransaction.getAmount());
																																											
																																											// Set transaction changed
																																											transactionChanged = true;
																																										}
																																										
																																										// Otherwise check if pending transaction's amount has been released and the pending transaction's new spendable height isn't the next block
																																										else if(pendingTransaction.getAmountReleased() === true && newSpendableHeight.isGreaterThan(tipHeight.getHeight().plus(1)) === true) {
																																										
																																											// Set pending transaction amount hasn't been released
																																											pendingTransaction.setAmountReleased(false);
																																											
																																											// Subtract pending transaction's amount from unspent amount change
																																											unspentAmountChange = unspentAmountChange.minus(pendingTransaction.getAmount());
																																											
																																											// Add pending transaction's amount to pending amount change
																																											pendingAmountChange = pendingAmountChange.plus(pendingTransaction.getAmount());
																																											
																																											// Set transaction changed
																																											transactionChanged = true;
																																										}
																																									
																																										// Break
																																										break;
																																								}
																																								
																																								// Check if pending transaction's spendable height needs to be updated
																																								if(pendingTransaction.getSpendableHeight() === Transaction.UNKNOWN_SPENDABLE_HEIGHT || pendingTransaction.getSpendableHeight().isEqualTo(newSpendableHeight) === false) {
																																								
																																									// Set pending transaction's spendable height
																																									pendingTransaction.setSpendableHeight(newSpendableHeight);
																																									
																																									// Set transaction changed
																																									transactionChanged = true;
																																								}
																																								
																																								// Check if pending transaction's canceled needs to be updated
																																								if(pendingTransaction.getCanceled() === true) {
																																								
																																									// Set pending transaction's canceled
																																									pendingTransaction.setCanceled(false);
																																									
																																									// Set transaction changed
																																									transactionChanged = true;
																																								}
																																								
																																								// Check if pending transaction's expired needs to be updated
																																								if(pendingTransaction.getExpired() === true) {
																																								
																																									// Set pending transaction's expired
																																									pendingTransaction.setExpired(false);
																																									
																																									// Check if pending transaction isn't change output
																																									if(pendingTransaction.getDisplay() === true) {
																																									
																																										// Subtract pending transaction's amount from expired amount change
																																										expiredAmountChange = expiredAmountChange.minus(pendingTransaction.getAmount());
																																									}
																																									
																																									// Set transaction changed
																																									transactionChanged = true;
																																								}
																																								
																																								// Check if pending transaction's checked needs to be updated
																																								if(pendingTransaction.getChecked() === false) {
																																								
																																									// Set pending transaction's checked
																																									pendingTransaction.setChecked(true);
																																									
																																									// Set transaction changed
																																									transactionChanged = true;
																																								}
																																								
																																								// Return getting header at output's height
																																								return self.node.getHeader(output["block_height"]).then(function(header) {
																																								
																																									// Get timestamp
																																									var timestamp = header["timestamp"];
																																									
																																									// Check if pending transaction's confirmed timestamp needs to be updated
																																									if(pendingTransaction.getConfirmedTimestamp() !== timestamp) {
																																									
																																										// Set pending transaction's confirmed timestamp
																																										pendingTransaction.setConfirmedTimestamp(timestamp);
																																										
																																										// Set transaction changed
																																										transactionChanged = true;
																																									}
																																							
																																									// Check if transaction changed
																																									if(transactionChanged === true) {
																																									
																																										// Append pending transaction to list of updated transactions
																																										updatedTransactions.push(pendingTransaction);
																																									}
																																									
																																									// Resolve
																																									resolve();
																																									
																																								// Catch errors
																																								}).catch(function(error) {
																																								
																																									// Reject error
																																									reject(error);
																																								});
																																							}
																																							
																																							// Otherwise
																																							else {
																																								
																																								// Check pending transaction's status
																																								switch(pendingTransaction.getStatus()) {
																																								
																																									// Spent
																																									case Transaction.STATUS_SPENT:
																																									
																																										// Check if pending transaction's checked needs to be updated
																																										if(pendingTransaction.getChecked() === false) {
																																										
																																											// Set pending transaction's checked
																																											pendingTransaction.setChecked(true);
																																											
																																											// Set transaction changed
																																											transactionChanged = true;
																																										}
																																									
																																										// Check if pending transaction's height is known
																																										if(pendingTransaction.getHeight() !== Transaction.UNKNOWN_HEIGHT) {
																																									
																																											// Return getting header at pending transaction's height
																																											return self.node.getHeader(pendingTransaction.getHeight()).then(function(header) {
																																											
																																												// Get timestamp
																																												var timestamp = header["timestamp"];
																																												
																																												// Check if pending transaction's confirmed timestamp needs to be updated
																																												if(pendingTransaction.getConfirmedTimestamp() !== timestamp) {
																																												
																																													// Set pending transaction's confirmed timestamp
																																													pendingTransaction.setConfirmedTimestamp(timestamp);
																																													
																																													// Set transaction changed
																																													transactionChanged = true;
																																												}
																																										
																																												// Check if transaction changed
																																												if(transactionChanged === true) {
																																												
																																													// Append pending transaction to list of updated transactions
																																													updatedTransactions.push(pendingTransaction);
																																												}
																																												
																																												// Resolve
																																												resolve();
																																												
																																											// Catch errors
																																											}).catch(function(error) {
																																											
																																												// Reject error
																																												reject(error);
																																											});
																																										}
																																										
																																										// Otherwise
																																										else {
																																										
																																											// Check if transaction changed
																																											if(transactionChanged === true) {
																																											
																																												// Append pending transaction to list of updated transactions
																																												updatedTransactions.push(pendingTransaction);
																																											}
																																										
																																											// Resolve
																																											resolve();
																																										}
																																									
																																										// Break
																																										break;
																																									
																																									// Unconfirmed
																																									case Transaction.STATUS_UNCONFIRMED:
																																									
																																										// Check if pending transaction isn't already expired and its time to live cut off height has past
																																										if(pendingTransaction.getExpired() === false && pendingTransaction.getBroadcast() === false && pendingTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && pendingTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && pendingTransaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																										
																																											// Set that pending transaction is expired
																																											pendingTransaction.setExpired(true);
																																											
																																											// Check if pending transaction isn't a change output
																																											if(pendingTransaction.getDisplay() === true) {
																																											
																																												// Add pending transaction's amount to expired amount change
																																												expiredAmountChange = expiredAmountChange.plus(pendingTransaction.getAmount());
																																											}
																																											
																																											// Subtract pending transaction's amount from unconfirmed amount change
																																											unconfirmedAmountChange = unconfirmedAmountChange.minus(pendingTransaction.getAmount());
																																											
																																											// Set transaction changed
																																											transactionChanged = true;
																																										}
																																										
																																										// Check if pending transaction's checked needs to be updated
																																										if(pendingTransaction.getChecked() === false) {
																																										
																																											// Set pending transaction's checked
																																											pendingTransaction.setChecked(true);
																																											
																																											// Set transaction changed
																																											transactionChanged = true;
																																										}
																																										
																																										// Check if transaction changed
																																										if(transactionChanged === true) {
																																										
																																											// Append pending transaction to list of updated transactions
																																											updatedTransactions.push(pendingTransaction);
																																										}
																																										
																																										// Resolve
																																										resolve();
																																									
																																										// Break
																																										break;
																																									
																																									// Unspent
																																									case Transaction.STATUS_UNSPENT:
																																									
																																										// Set get transaction's kernel
																																										var getTransactionsKernel = new Promise(function(resolve, reject) {
																																										
																																											// Check if pending transaction has a known kernel excess
																																											if(pendingTransaction.getKernelExcess() !== Transaction.UNKNOWN_KERNEL_EXCESS) {
																																											
																																												// Check if pending transaction's height exists
																																												if(pendingTransaction.getHeight() !== Transaction.UNKNOWN_HEIGHT) {
																																												
																																													// Set kernel minimum height
																																													var kernelMinimumHeight = pendingTransaction.getHeight().minus(Wallets.VARIATION_FROM_PREVIOUS_BLOCK_HEIGHT);
																																												
																																													// Set kernel maximum height
																																													var kernelMaximumHeight = pendingTransaction.getHeight().plus(Wallets.VARIATION_TO_NEXT_BLOCK_HEIGHT);
																																												}
																																												
																																												// Otherwise
																																												else {
																																												
																																													// Set kernel minimum height
																																													var kernelMinimumHeight = startHeight.minus(Wallets.VARIATION_FROM_PREVIOUS_BLOCK_HEIGHT);
																																												
																																													// Set kernel maximum height
																																													var kernelMaximumHeight = highestSyncedHeight.plus(Wallets.VARIATION_TO_NEXT_BLOCK_HEIGHT);
																																												}
																																												
																																												// Check if kernel minimum height is less than the first block height
																																												if(kernelMinimumHeight.isLessThan(Consensus.FIRST_BLOCK_HEIGHT) === true) {
																																												
																																													// Set kernel minimum height to the first block height
																																													kernelMinimumHeight = new BigNumber(Consensus.FIRST_BLOCK_HEIGHT);
																																												}
																																												
																																												// Check if kernel maximum height exceeds the tip height
																																												if(kernelMaximumHeight.isGreaterThan(tipHeight.getHeight()) === true) {
																																												
																																													// Set kernel maximum height to the tip height
																																													kernelMaximumHeight = tipHeight.getHeight();
																																												}
																																												
																																												// Return getting pending transaction's kernel in the range around its height
																																												return self.node.getKernel(pendingTransaction.getKernelExcess(), kernelMinimumHeight, kernelMaximumHeight).then(function(kernel) {
																																												
																																													// Resolve kernel
																																													resolve(kernel);
																																												
																																												// Catch errors
																																												}).catch(function(error) {
																																												
																																													// Reject error
																																													reject(error);
																																												});
																																											}
																																											
																																											// Otherwise
																																											else {
																																											
																																												// Resolve no kernel found
																																												resolve(Node.NO_KERNEL_FOUND);
																																											}
																																										});
																																										
																																										// Return getting transaction's kernel
																																										return getTransactionsKernel.then(function(kernel) {
																																										
																																											// Check if pending transaction's amount has been released
																																											if(pendingTransaction.getAmountReleased() === true) {
																																											
																																												// Subtract pending transaction's amount from unspent amount change
																																												unspentAmountChange = unspentAmountChange.minus(pendingTransaction.getAmount());
																																											}
																																											
																																											// Otherwise
																																											else {
																																											
																																												// Subtract pending transaction's amount from pending amount change
																																												pendingAmountChange = pendingAmountChange.minus(pendingTransaction.getAmount());
																																											}
																																										
																																											// Check if kernel exists
																																											if(kernel !== Node.NO_KERNEL_FOUND) {
																																												
																																												// Update pending transaction's status to spent since it was confirmed on the chain previously
																																												pendingTransaction.setStatus(Transaction.STATUS_SPENT);
																																												
																																												// Add pending transaction's amount to spent amount change
																																												spentAmountChange = spentAmountChange.plus(pendingTransaction.getAmount());
																																												
																																												// Set pending transaction amount has been released
																																												pendingTransaction.setAmountReleased(true);
																																												
																																												// Set pending transaction isn't expired
																																												pendingTransaction.setExpired(false);
																																												
																																												// Set pending transaction isn't canceled
																																												pendingTransaction.setCanceled(false);
																																												
																																												// Set pending transaction is broadcast
																																												pendingTransaction.setBroadcast(true);
																																												
																																												// Update pending transaction's height to the kernel's height
																																												pendingTransaction.setHeight(kernel["height"]);
																																												
																																												// Update pending transaction's is coinbase to kernel's features
																																												pendingTransaction.setIsCoinbase(SlateKernel.textToFeatures(Object.keys(kernel["tx_kernel"]["features"])[0]) === SlateKernel.COINBASE_FEATURES);
																																												
																																												// Get new spendable height as the kernel's height added to the pending transaction's number of confirmations
																																												var newSpendableHeight = kernel["height"].plus(pendingTransaction.getRequiredNumberOfConfirmations().minus(1));
																																												
																																												// Check if maturity height is greater than the new spendable height
																																												if(kernel["height"].plus((pendingTransaction.getIsCoinbase() === true) ? Consensus.COINBASE_MATURITY - 1 : 0).isGreaterThan(newSpendableHeight) === true) {
																																												
																																													// Set the new spendable height to the maturity height
																																													newSpendableHeight = kernel["height"].plus((pendingTransaction.getIsCoinbase() === true) ? Consensus.COINBASE_MATURITY - 1 : 0);
																																												}
																																												
																																												// Check if pending transaction's lock height exists and if it added to the number of confirmation is greater than the new spendable height
																																												if(pendingTransaction.getLockHeight() !== Transaction.UNKNOWN_LOCK_HEIGHT && pendingTransaction.getLockHeight() !== Transaction.NO_LOCK_HEIGHT && pendingTransaction.getLockHeight().plus(pendingTransaction.getRequiredNumberOfConfirmations().minus(1)).isGreaterThan(newSpendableHeight) === true) {
																																												
																																													// Set the new spendable height to the pending transaction's lock height added to the number of confirmation
																																													newSpendableHeight = pendingTransaction.getLockHeight().plus(pendingTransaction.getRequiredNumberOfConfirmations().minus(1));
																																												}
																																												
																																												// Update pending transaction's spendable height
																																												pendingTransaction.setSpendableHeight(newSpendableHeight);
																																												
																																												// Set pending transaction's checked
																																												pendingTransaction.setChecked(true);
																																												
																																												// Return getting header at kernel's height
																																												return self.node.getHeader(kernel["height"]).then(function(header) {
																																												
																																													// Get timestamp
																																													var timestamp = header["timestamp"];
																																													
																																													// Set pending transaction's confirmed timestamp
																																													pendingTransaction.setConfirmedTimestamp(timestamp);
																																													
																																													// Append pending transaction to list of updated transactions
																																													updatedTransactions.push(pendingTransaction);
																																													
																																													// Resolve
																																													resolve();
																																													
																																												// Catch errors
																																												}).catch(function(error) {
																																												
																																													// Reject error
																																													reject(error);
																																												});
																																											}
																																											
																																											// Otherwise
																																											else {
																																											
																																												// Revert pending transaction's status to unconfirmed since transaction is no longer confirmed on the chain
																																												pendingTransaction.setStatus(Transaction.STATUS_UNCONFIRMED);
																																												
																																												// Set pending transaction amount hasn't been released
																																												pendingTransaction.setAmountReleased(false);
																																												
																																												// Set pending transaction's confirmed timestamp to no confirmed timestamp
																																												pendingTransaction.setConfirmedTimestamp(Transaction.NO_CONFIRMED_TIMESTAMP);
																																												
																																												// Check if pending transaction's time to live cut off height has past
																																												if(pendingTransaction.getBroadcast() === false && pendingTransaction.getTimeToLiveCutOffHeight() !== Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && pendingTransaction.getTimeToLiveCutOffHeight() !== Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT && pendingTransaction.getTimeToLiveCutOffHeight().isLessThanOrEqualTo(tipHeight.getHeight()) === true) {
																																												
																																													// Set that pending transaction is expired
																																													pendingTransaction.setExpired(true);
																																													
																																													// Check if pending transaction isn't change output
																																													if(pendingTransaction.getDisplay() === true) {
																																													
																																														// Add pending transaction's amount to expired amount change
																																														expiredAmountChange = expiredAmountChange.plus(pendingTransaction.getAmount());
																																													}
																																												}
																																												
																																												// Otherwise
																																												else {
																																												
																																													// Add pending transaction's amount to unconfirmed amount change
																																													unconfirmedAmountChange = unconfirmedAmountChange.plus(pendingTransaction.getAmount());
																																												}
																																												
																																												// Set pending transaction's checked
																																												pendingTransaction.setChecked(true);
																																												
																																												// Append pending transaction to list of updated transactions
																																												updatedTransactions.push(pendingTransaction);
																																												
																																												// Resolve
																																												resolve();
																																											}
																																										
																																										// Catch errors
																																										}).catch(function(error) {
																																										
																																											// Reject error
																																											reject(error);
																																										});
																																									
																																									// Locked
																																									case Transaction.STATUS_LOCKED:
																																									
																																										// Update pending transaction's status to spent since transaction was completed
																																										pendingTransaction.setStatus(Transaction.STATUS_SPENT);
																																										
																																										// Add pending transaction's amount to spent amount change
																																										spentAmountChange = spentAmountChange.plus(pendingTransaction.getAmount());
																																										
																																										// Subtract pending transaction's amount from locked amount change
																																										lockedAmountChange = lockedAmountChange.minus(pendingTransaction.getAmount());
																																										
																																										// Set pending transaction's checked
																																										pendingTransaction.setChecked(true);
																																										
																																										// Append pending transaction to list of updated transactions
																																										updatedTransactions.push(pendingTransaction);
																																										
																																										// Resolve
																																										resolve();
																																									
																																										// Break
																																										break;
																																									
																																									// Default
																																									default:
																																									
																																										// Check if pending transaction's checked needs to be updated
																																										if(pendingTransaction.getChecked() === false) {
																																										
																																											// Set pending transaction's checked
																																											pendingTransaction.setChecked(true);
																																											
																																											// Set transaction changed
																																											transactionChanged = true;
																																										}
																																										
																																										// Check if transaction changed
																																										if(transactionChanged === true) {
																																										
																																											// Append pending transaction to list of updated transactions
																																											updatedTransactions.push(pendingTransaction);
																																										}
																																										
																																										// Resolve
																																										resolve();
																																										
																																										// Break
																																										break;
																																								}
																																							}
																																						
																																						// Catch errors
																																						}).catch(function(error) {
																																						
																																							// Reject error
																																							reject(error);
																																						});
																																					}));
																																				}
																																				
																																				// Return verifying pending transactions group
																																				return Promise.all(verifyingPendingTransactionsGroup).then(function() {
																																				
																																					// Resolve
																																					resolve();
																																					
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
																																		}));
																																	}
																																
																																	// Return verifying pending transactions
																																	return Promise.all(verifyingPendingTransactions).then(function() {
																																	
																																		// Return creating a database transaction
																																		return Database.createTransaction([
																																		
																																			// Wallets object store
																																			Wallets.OBJECT_STORE_NAME,
																																			
																																			// Transactions object store
																																			Transactions.OBJECT_STORE_NAME,
																																			
																																		], Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
																																	
																																			// Return saving updated transactions
																																			return self.transactions.saveTransactions(updatedTransactions, databaseTransaction).then(function() {
																																			
																																				// Check if wallet exists
																																				if(self.walletExists(keyPath) === true) {
																																				
																																					// Return saving wallet
																																					return self.saveWallet(wallet, function() {
																		
																																						// Get values
																																						var values = {
																																						
																																							// New locked amount value
																																							[Wallets.NEW_LOCKED_AMOUNT_VALUE]: wallet.getLockedAmount().plus(lockedAmountChange),
																																							
																																							// New unconfirmed amount value
																																							[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]: wallet.getUnconfirmedAmount().plus(unconfirmedAmountChange),
																																							
																																							// New unspent amount value
																																							[Wallets.NEW_UNSPENT_AMOUNT_VALUE]: wallet.getUnspentAmount().plus(unspentAmountChange),
																																							
																																							// New spent amount value
																																							[Wallets.NEW_SPENT_AMOUNT_VALUE]: wallet.getSpentAmount().plus(spentAmountChange),
																																							
																																							// New pending amount value
																																							[Wallets.NEW_PENDING_AMOUNT_VALUE]: wallet.getPendingAmount().plus(pendingAmountChange),
																																							
																																							// New expired amount value
																																							[Wallets.NEW_EXPIRED_AMOUNT_VALUE]: wallet.getExpiredAmount().plus(expiredAmountChange)
																																						};
																																						
																																						// Check if wallet's syncing status isn't resyncing
																																						if(wallet.getSyncingStatus() !== Wallet.STATUS_RESYNCING) {
																																				
																																							// New synced height value
																																							values[Wallets.NEW_SYNCED_HEIGHT_VALUE] = highestSyncedHeight;
																																						}
																																						
																																						// Check if highest identifier exists and the wallet's last identifier doesn't exist or doesn't include the highest identifier
																																						if(highestIdentifier !== Wallet.NO_LAST_IDENTIFIER && (wallet.getLastIdentifier() === Wallet.NO_LAST_IDENTIFIER || wallet.getLastIdentifier().includesValue(highestIdentifier) === false)) {
																																						
																																							// New last identifier value
																																							values[Wallets.NEW_LAST_IDENTIFIER_VALUE] = highestIdentifier;
																																						}
																																						
																																						// Return values
																																						return values;
																																						
																																					}, databaseTransaction).then(function(newValues) {
																																					
																																						// Check if wallet exists
																																						if(self.walletExists(keyPath) === true) {
																																						
																																							// Return committing database transaction
																																							return Database.commitTransaction(databaseTransaction).then(function() {
																																							
																																								// Release wallet's exclusive transactions lock
																																								self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																							
																																								// Update wallet's locked amount
																																								wallet.setLockedAmount(newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE]);
																																							
																																								// Update wallet's unconfirmed amount
																																								wallet.setUnconfirmedAmount(newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]);
																																								
																																								// Update wallet's unspent amount
																																								wallet.setUnspentAmount(newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]);
																																								
																																								// Update wallet's spent amount
																																								wallet.setSpentAmount(newValues[Wallets.NEW_SPENT_AMOUNT_VALUE]);
																																								
																																								// Update wallet's pending amount
																																								wallet.setPendingAmount(newValues[Wallets.NEW_PENDING_AMOUNT_VALUE]);
																																								
																																								// Update wallet's expired amount
																																								wallet.setExpiredAmount(newValues[Wallets.NEW_EXPIRED_AMOUNT_VALUE]);
																																								
																																								// Check if wallet's synced height changed and its syncing status isn't resyncing
																																								if(Wallets.NEW_SYNCED_HEIGHT_VALUE in newValues === true && wallet.getSyncingStatus() !== Wallet.STATUS_RESYNCING) {
																																								
																																									// Update wallet's synced height
																																									wallet.setSyncedHeight(newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE]);
																																								}
																																								
																																								// Check if wallet's last identifier changed
																																								if(Wallets.NEW_LAST_IDENTIFIER_VALUE in newValues === true) {
																																								
																																									// Update wallet's last identifier
																																									wallet.setLastIdentifier(newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE]);
																																								}
																																								
																																								// Check if wallet exists
																																								if(self.walletExists(keyPath) === true) {
																																								
																																									// Check if wallet's unspent amount changed
																																									if(unspentAmountChange.isZero() === false) {
																																					
																																										// Trigger change event
																																										$(document).trigger(Wallets.CHANGE_EVENT, [
																																										
																																											// Key path
																																											keyPath,
																																											
																																											// Change
																																											Wallets.UNSPENT_AMOUNT_CHANGED,
																																											
																																											// New value
																																											newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]
																																										]);
																																									}
																																									
																																									// Check if wallet's unconfirmed amount changed
																																									if(unconfirmedAmountChange.isZero() === false) {
																																					
																																										// Trigger change event
																																										$(document).trigger(Wallets.CHANGE_EVENT, [
																																										
																																											// Key path
																																											keyPath,
																																											
																																											// Change
																																											Wallets.UNCONFIRMED_AMOUNT_CHANGED,
																																											
																																											// New value
																																											newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]
																																										]);
																																									}
																																									
																																									// Check if wallet's pending amount changed
																																									if(pendingAmountChange.isZero() === false) {
																																					
																																										// Trigger change event
																																										$(document).trigger(Wallets.CHANGE_EVENT, [
																																										
																																											// Key path
																																											keyPath,
																																											
																																											// Change
																																											Wallets.PENDING_AMOUNT_CHANGED,
																																											
																																											// New value
																																											newValues[Wallets.NEW_PENDING_AMOUNT_VALUE]
																																										]);
																																									}
																																									
																																									// Check if wallet's expired amount changed
																																									if(expiredAmountChange.isZero() === false) {
																																					
																																										// Trigger change event
																																										$(document).trigger(Wallets.CHANGE_EVENT, [
																																										
																																											// Key path
																																											keyPath,
																																											
																																											// Change
																																											Wallets.EXPIRED_AMOUNT_CHANGED,
																																											
																																											// New value
																																											newValues[Wallets.NEW_EXPIRED_AMOUNT_VALUE]
																																										]);
																																									}
																																									
																																									// Check if transactions were updated
																																									if(updatedTransactions["length"] !== 0) {
																																									
																																										// Trigger transactions change event
																																										$(self.transactions).trigger(Transactions.CHANGE_EVENT, [
																																										
																																											// Transactions
																																											updatedTransactions
																																										]);
																																									}
																																								
																																									// Check if wallet's syncing status isn't resyncing
																																									if(wallet.getSyncingStatus() !== Wallet.STATUS_RESYNCING) {
																																									
																																										// Check if at the last output
																																										if(atLastOutput === true) {
																																										
																																											// Clear wallet's last sync index
																																											wallet.setLastSyncIndex(Wallet.NO_SYNC_INDEX);
																																											
																																											// Update wallet's starting sync height
																																											wallet.setStartingSyncHeight(wallet.getSyncedHeight());
																																											
																																											// Set wallet's percent synced
																																											wallet.setPercentSynced(new BigNumber(Wallets.MAXIMUM_PERCENT));
																																										
																																											// Set wallet's syncing status to synced
																																											wallet.setSyncingStatus(Wallet.STATUS_SYNCED);
																																										
																																											// Trigger sync done event
																																											$(self).trigger(Wallets.SYNC_DONE_EVENT, keyPath);
																																										}
																																										
																																										// Otherwise
																																										else {
																																										
																																											// Set wallet's last sync index
																																											wallet.setLastSyncIndex([
																																											
																																												// Start index
																																												pmmrIndices["last_retrieved_index"],
																																												
																																												// Last retrieved index
																																												lastRetrievedIndex
																																											]);
																																										}
																																									}
																																								}
																																								
																																								// Resolve
																																								resolve();
																																							
																																							// Catch errors
																																							}).catch(function(error) {
																																							
																																								// Return aborting database transaction
																																								return Database.abortTransaction(databaseTransaction).then(function() {
																																								
																																									// Release wallet's exclusive transactions lock
																																									self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																								
																																									// Reject error
																																									reject(error);
																																								
																																								// Catch errors
																																								}).catch(function(error) {
																																								
																																									// Release wallet's exclusive transactions lock
																																									self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																								
																																									// Trigger a fatal error
																																									new FatalError(FatalError.DATABASE_ERROR);
																																								});
																																							});
																																						}
																																						
																																						// Otherwise
																																						else {
																																						
																																							// Return aborting database transaction
																																							return Database.abortTransaction(databaseTransaction).then(function() {
																																							
																																								// Release wallet's exclusive transactions lock
																																								self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																							
																																								// Resolve
																																								resolve();
																																							
																																							// Catch errors
																																							}).catch(function() {
																																							
																																								// Release wallet's exclusive transactions lock
																																								self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																							
																																								// Trigger a fatal error
																																								new FatalError(FatalError.DATABASE_ERROR);
																																							});
																																						}
																																					
																																					// Catch errors
																																					}).catch(function(error) {
																																					
																																						// Return aborting database transaction
																																						return Database.abortTransaction(databaseTransaction).then(function() {
																																						
																																							// Release wallet's exclusive transactions lock
																																							self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																						
																																							// Reject error
																																							reject(error);
																																						
																																						// Catch errors
																																						}).catch(function(error) {
																																						
																																							// Release wallet's exclusive transactions lock
																																							self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																						
																																							// Trigger a fatal error
																																							new FatalError(FatalError.DATABASE_ERROR);
																																						});
																																					});
																																				}
																																				
																																				// Otherwise
																																				else {
																																				
																																					// Return aborting database transaction
																																					return Database.abortTransaction(databaseTransaction).then(function() {
																																					
																																						// Release wallet's exclusive transactions lock
																																						self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																					
																																						// Resolve
																																						resolve();
																																					
																																					// Catch errors
																																					}).catch(function() {
																																					
																																						// Release wallet's exclusive transactions lock
																																						self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																					
																																						// Trigger a fatal error
																																						new FatalError(FatalError.DATABASE_ERROR);
																																					});
																																				}
																																			
																																			// Catch errors
																																			}).catch(function(error) {
																																			
																																				// Return aborting database transaction
																																				return Database.abortTransaction(databaseTransaction).then(function() {
																																				
																																					// Release wallet's exclusive transactions lock
																																					self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																				
																																					// Reject error
																																					reject(error);
																																				
																																				// Catch errors
																																				}).catch(function(error) {
																																				
																																					// Release wallet's exclusive transactions lock
																																					self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																				
																																					// Trigger a fatal error
																																					new FatalError(FatalError.DATABASE_ERROR);
																																				});
																																			});
																																		
																																		// Catch errors
																																		}).catch(function(error) {
																																		
																																			// Release wallet's exclusive transactions lock
																																			self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																		
																																			// Reject error
																																			reject(error);
																																		});
																																	
																																	// Catch errors
																																	}).catch(function(error) {
																																	
																																		// Release wallet's exclusive transactions lock
																																		self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																	
																																		// Reject error
																																		reject(error);
																																	});
																																
																																// Catch errors
																																}).catch(function(error) {
																																
																																	// Release wallet's exclusive transactions lock
																																	self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																																
																																	// Reject error
																																	reject(error);
																																});
																															
																															// Catch errors
																															}).catch(function(error) {
																															
																																// Release wallet's exclusive transactions lock
																																self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																															
																																// Reject error
																																reject(error);
																															});
																														
																														// Catch errors
																														}).catch(function(error) {
																														
																															// Release wallet's exclusive transactions lock
																															self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																														
																															// Reject error
																															reject(error);
																														});
																													
																													// Catch errors
																													}).catch(function(error) {
																													
																														// Release wallet's exclusive transactions lock
																														self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																													
																														// Reject error
																														reject(error);
																													});
																												
																												// Catch errors
																												}).catch(function(error) {
																												
																													// Release wallet's exclusive transactions lock
																													self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																												
																													// Reject error
																													reject(error);
																												});
																											
																											// Catch errors
																											}).catch(function(error) {
																											
																												// Release wallet's exclusive transactions lock
																												self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																											
																												// Reject error
																												reject(error);
																											});
																										
																										// Catch errors
																										}).catch(function(error) {
																										
																											// Release wallet's exclusive transactions lock
																											self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																										
																											// Reject error
																											reject(error);
																										});
																										
																									// Catch errors
																									}).catch(function(error) {
																									
																										// Release wallet's exclusive transactions lock
																										self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																									
																										// Reject error
																										reject(error);
																									});
																									
																								// Catch errors
																								}).catch(function(error) {
																								
																									// Release wallet's exclusive transactions lock
																									self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																								
																									// Reject error
																									reject(error);
																								});
																								
																							// Catch errors
																							}).catch(function(error) {
																							
																								// Release wallet's exclusive transactions lock
																								self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																							
																								// Reject error
																								reject(error);
																							});
																							
																						// Catch errors
																						}).catch(function(error) {
																						
																							// Release wallet's exclusive transactions lock
																							self.transactions.releaseWalletsExclusiveTransactionsLock(keyPath);
																						
																							// Reject error
																							reject(error);
																						});
																					});
																			
																				// Catch errors
																				}).catch(function(error) {
																				
																					// Reject error
																					reject(error);
																				});
																			}));
																		}
																	}
																}
																
																// Wait for all wallets to finish checking the outputs
																Promise.all(checkingWallets).then(function() {
																
																	// Save recent heights's heights and catch errors
																	self.recentHeights.saveHeights(tipHeight).catch(function(error) {
																	
																	// Finally
																	}).finally(function() {
																
																		// Check if stop syncing
																		if(self.stopSyncing === true) {
																		
																			// Clear is syncing
																			self.isSyncing = false;
																		}
																		
																		// Otherwise check if not at the last output
																		else if(atLastOutput === false) {
																		
																			// Sync
																			self.sync(true);
																		}
																		
																		// Otherwise
																		else {
																		
																			// Set continue syncing
																			var continueSyncing = false;
																			
																			// Check if node's tip height has changed
																			var currentTipHeight = self.node.getCurrentHeight();
																			
																			if(currentTipHeight === Node.UNKNOWN_HEIGHT || currentTipHeight.getHeight().isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true || tipHeight.getHeight().isEqualTo(currentTipHeight.getHeight()) === false || Common.arraysAreEqual(tipHeight.getHash(), currentTipHeight.getHash()) === false) {
																			
																				// Set continue syncing
																				continueSyncing = true;
																			}
																			
																			// Otherwise
																			else {
																		
																				// Go through all wallets
																				for(var keyPath in self.wallets) {
																						
																					if(self.wallets.hasOwnProperty(keyPath) === true) {
																					
																						// Get wallet
																						var wallet = self.wallets[keyPath];
																						
																						// Check if wallet is syncing
																						if(wallet.isSyncing() === true) {
																						
																							// Set continue syncing
																							continueSyncing = true;
																							
																							// Break
																							break;
																						}
																					}
																				}
																			}
																		
																			// Check if continue syncing or ignoring synced status
																			if(continueSyncing === true || self.ignoreSyncedStatus === true) {
																			
																				// Sync
																				self.sync(true);
																			}
																			
																			// Otherwise
																			else {
																			
																				// Clear is syncing
																				self.isSyncing = false;
																			}
																		}
																	});
																
																// Catch errors
																}).catch(function(error) {
																
																	// Check if node is connected
																	if(self.node.isConnected() === true) {
																	
																		// Sync failed
																		self.syncFailed(true);
																	}
																
																	// Clear is syncing
																	self.isSyncing = false;
																});
																
															}
															
															// Otherwise
															else {
															
																// Clear is syncing
																self.isSyncing = false;
															}
														
														// Catch errors
														}).catch(function(error) {
														
															// Clear is syncing
															self.isSyncing = false;
														});
													}
												
													// Otherwise
													else {
													
														// Check if node is connected
														if(self.node.isConnected() === true) {
														
															// Sync failed
															self.syncFailed(true);
														}
													
														// Clear is syncing
														self.isSyncing = false;
													}
												}
												
												// Otherwise
												else {
												
													// Clear is syncing
													self.isSyncing = false;
												}
											
											// Catch errors
											}).catch(function(error) {
											
												// Clear is syncing
												self.isSyncing = false;
											});
										}
										
										// Otherwise
										else {
										
											// Clear is syncing
											self.isSyncing = false;
										}
									}
									
									// Otherwise
									else {
									
										// Clear is syncing
										self.isSyncing = false;
									}
								}
								
								// Otherwise
								else {
								
									// Clear is syncing
									self.isSyncing = false;
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Check if node is connected
								if(self.node.isConnected() === true) {
								
									// Sync failed
									self.syncFailed(true);
								}
							
								// Clear is syncing
								self.isSyncing = false;
							});
						}
						
						// Otherwise
						else {
						
							// Sync waiting
							this.syncWaiting();
						
							// Clear is syncing
							this.isSyncing = false;
						}
					}
						
					// Otherwise
					else {
					
						// Check if node is connected
						if(this.node.isConnected() === true) {
					
							// Sync failed
							this.syncFailed(true);
						}
					
						// Clear is syncing
						this.isSyncing = false;
					}
				}
			}
		}
		
		// Sync failed
		syncFailed(restartNode = false) {
		
			// Go through all wallets
			for(var keyPath in this.wallets) {
						
				if(this.wallets.hasOwnProperty(keyPath) === true) {
			
					// Get wallet
					var wallet = this.wallets[keyPath];
					
					// Check if wallet is synced
					if(wallet.isSynced() === true) {
					
						// Set wallet's percent synced
						wallet.setPercentSynced(new BigNumber(Wallets.MINIMUM_PERCENT));
					}
					
					// Set wallet's syncing status to error
					wallet.setSyncingStatus(Wallet.STATUS_ERROR);
					
					// Trigger sync fail event
					$(this).trigger(Wallets.SYNC_FAIL_EVENT, wallet.getKeyPath());
				}
			}
		
			// Set stop syncing
			this.stopSyncing = true;
			
			// Check if restarting node
			if(restartNode === true) {
			
				// Restart node
				this.node.restart();
			}
		}
		
		// Sync waiting
		syncWaiting() {
		
			// Go through all wallets
			for(var keyPath in this.wallets) {
						
				if(this.wallets.hasOwnProperty(keyPath) === true) {
			
					// Get wallet
					var wallet = this.wallets[keyPath];
					
					// Set wallet's syncing status to syncing
					wallet.setSyncingStatus(Wallet.STATUS_SYNCING);
					
					// Trigger sync start event
					$(this).trigger(Wallets.SYNC_START_EVENT, [
					
						// Key path
						wallet.getKeyPath()
					]);
				}
			}
		
			// Set stop syncing
			this.stopSyncing = true;
		}
		
		// Save wallet
		saveWallet(wallet, newValues = Wallets.NO_NEW_VALUES, transaction = Wallets.NO_TRANSACTION) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get database transaction
				var getDatabaseTransaction = new Promise(function(resolve, reject) {
				
					// Check if no transaction is provided
					if(transaction === Wallets.NO_TRANSACTION) {
					
						// Return creating a database transaction
						return Database.createTransaction(Wallets.OBJECT_STORE_NAME, Database.READ_AND_WRITE_MODE, Database.STRICT_DURABILITY).then(function(databaseTransaction) {
						
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
				
					// Get new values
					newValues = (newValues === Wallets.NO_NEW_VALUES) ? {} : newValues();
				
					// Get creating new key path
					var creatingNewKeyPath = wallet.getKeyPath() === Wallet.NO_KEY_PATH;
					
					// Check if no creating a new key path and the wallet doesn't exist
					if(creatingNewKeyPath === false && self.walletExists(wallet.getKeyPath()) === false) {
					
						// Check if a transaction was provided
						if(transaction !== Wallets.NO_TRANSACTION) {
						
							// Resolve new values
							resolve(newValues);
						}
						
						// Otherwise
						else {
					
							// Return committing database transaction
							return Database.commitTransaction(databaseTransaction).then(function() {
							
								// Check if a new NAME value was set
								if(Wallets.NEW_NAME_VALUE in newValues === true) {
						
									// Set wallet's name to its new value
									wallet.setName(newValues[Wallets.NEW_NAME_VALUE]);
								}
								
								// Check if a new synced height value was set
								if(Wallets.NEW_SYNCED_HEIGHT_VALUE in newValues === true) {
						
									// Set wallet's synced height to its new value
									wallet.setSyncedHeight(newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE]);
								}
								
								// Check if a new unconfirmed amount value was set
								if(Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE in newValues === true) {
								
									// Set wallet's unconfirmed amount to its new value
									wallet.setUnconfirmedAmount(newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]);
								}
								
								// Check if a new locked amount value was set
								if(Wallets.NEW_LOCKED_AMOUNT_VALUE in newValues === true) {
								
									// Set wallet's locked amount to its new value
									wallet.setLockedAmount(newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE]);
								}
								
								// Check if a new unspent amount value was set
								if(Wallets.NEW_UNSPENT_AMOUNT_VALUE in newValues === true) {
								
									// Set wallet's unspent amount to its new value
									wallet.setUnspentAmount(newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]);
								}
								
								// Check if a new spent amount value was set
								if(Wallets.NEW_SPENT_AMOUNT_VALUE in newValues === true) {
								
									// Set wallet's spent amount to its new value
									wallet.setSpentAmount(newValues[Wallets.NEW_SPENT_AMOUNT_VALUE]);
								}
								
								// Check if a new pending amount value was set
								if(Wallets.NEW_PENDING_AMOUNT_VALUE in newValues === true) {
								
									// Set wallet's pending amount to its new value
									wallet.setPendingAmount(newValues[Wallets.NEW_PENDING_AMOUNT_VALUE]);
								}
								
								// Check if a new expired amount value was set
								if(Wallets.NEW_EXPIRED_AMOUNT_VALUE in newValues === true) {
								
									// Set wallet's expired amount to its new value
									wallet.setExpiredAmount(newValues[Wallets.NEW_EXPIRED_AMOUNT_VALUE]);
								}
								
								// Check if a new address suffix value was set
								if(Wallets.NEW_ADDRESS_SUFFIX_VALUE in newValues === true) {
								
									// Set wallet's address suffix to its new value
									wallet.setAddressSuffix(newValues[Wallets.NEW_ADDRESS_SUFFIX_VALUE]);
								}
								
								// Check if a new last identifier value was set
								if(Wallets.NEW_LAST_IDENTIFIER_VALUE in newValues === true) {
								
									// Set wallet's last identifier to its new value
									wallet.setLastIdentifier(newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE]);
								}
								
								// Check if a new salt value is set
								if(Wallets.NEW_SALT_VALUE in newValues === true) {
								
									// Set wallet's salt to its new value
									wallet.setSalt(newValues[Wallets.NEW_SALT_VALUE]);
								}
								
								// Check if a new number of iterations value is set
								if(Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE in newValues === true) {
								
									// Set wallet's number of iterations to its new value
									wallet.setNumberOfIterations(newValues[Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE]);
								}
								
								// Check if a new initialization vector value is set
								if(Wallets.NEW_INITIALIZATION_VECTOR_VALUE in newValues === true) {
								
									// Set wallet's intiialization vector to its new value
									wallet.setInitializationVector(newValues[Wallets.NEW_INITIALIZATION_VECTOR_VALUE]);
								}
								
								// Check if a new encrypted seed value is set
								if(Wallets.NEW_ENCRYPTED_SEED_VALUE in newValues === true) {
								
									// Set wallet's encrypted seed to its new value
									wallet.setEncryptedSeed(newValues[Wallets.NEW_ENCRYPTED_SEED_VALUE]);
								}
								
								// Check if a new order value is set
								if(Wallets.NEW_ORDER_VALUE in newValues === true) {
								
									// Set wallet's order to its new value
									wallet.setOrder(newValues[Wallets.NEW_ORDER_VALUE]);
								}
								
								// Check if a new encrypted root public key value is set
								if(Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE in newValues === true) {
								
									// Set wallet's encrypted root public key to its new value
									wallet.setEncryptedRootPublicKey(newValues[Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE]);
								}
								
								// Check if a new encrypted BIP39 salt value is set
								if(Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE in newValues === true) {
								
									// Set wallet's encrypted BIP39 salt to its new value
									wallet.setEncryptedBip39Salt(newValues[Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE]);
								}
								
								// Check if a new hardware type value is set
								if(Wallets.NEW_HARDWARE_TYPE_VALUE in newValues === true) {
								
									// Set wallet's hardware type to its new value
									wallet.setHardwareType(newValues[Wallets.NEW_HARDWARE_TYPE_VALUE]);
								}
							
								// Resolve new values
								resolve(newValues);
							
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
					
					// Otherwise
					else {
			
						// Check if wallet doesn't have an order
						if(wallet.getOrder() === Wallet.NO_ORDER) {
						
							// Return getting wallet with the wallet type, network type, and the highest order from the database
							return Database.getResults(Wallets.OBJECT_STORE_NAME, 0, 1, Wallets.DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_ORDER_NAME, IDBKeyRange.bound([
					
								// Wallet type lower bound
								Consensus.getWalletType(),
								
								// Network type lower bound
								Consensus.getNetworkType(),
								
								// Order lower bound
								Number.NEGATIVE_INFINITY
							], [
							
								// Wallet type upper bound
								Consensus.getWalletType(),
								
								// Network type upper bound
								Consensus.getNetworkType(),
								
								// Order upper bound
								Number.POSITIVE_INFINITY
							
							]), Database.BACKWARD_DIRECTION, databaseTransaction).then(function(results) {
							
								// Get new order
								var newOrder = (results["length"] !== 0) ? results[0][Database.toKeyPath(Wallets.DATABASE_ORDER_NAME)] + 1 : 0;
					
								// Return saving wallet in the database
								return Database.saveResult(Wallets.OBJECT_STORE_NAME, {
											
									// Name
									[Database.toKeyPath(Wallets.DATABASE_NAME_NAME)]: (Wallets.NEW_NAME_VALUE in newValues === true) ? newValues[Wallets.NEW_NAME_VALUE] : wallet.getName(),
									
									// Color
									[Database.toKeyPath(Wallets.DATABASE_COLOR_NAME)]: parseInt(wallet.getColor().substring("#"["length"]), Common.HEX_NUMBER_BASE),
									
									// Salt
									[Database.toKeyPath(Wallets.DATABASE_SALT_NAME)]: (Wallets.NEW_SALT_VALUE in newValues === true) ? newValues[Wallets.NEW_SALT_VALUE] : wallet.getSalt(),
									
									// Initialization vector
									[Database.toKeyPath(Wallets.DATABASE_INITIALIZATION_VECTOR_NAME)]: (Wallets.NEW_INITIALIZATION_VECTOR_VALUE in newValues === true) ? newValues[Wallets.NEW_INITIALIZATION_VECTOR_VALUE] : wallet.getInitializationVector(),
									
									// Number of iterations
									[Database.toKeyPath(Wallets.DATABASE_NUMBER_OF_ITERATIONS_NAME)]: (Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE in newValues === true) ? newValues[Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE] : wallet.getNumberOfIterations(),
									
									// Encrypted seed
									[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_SEED_NAME)]: (Wallets.NEW_ENCRYPTED_SEED_VALUE in newValues === true) ? newValues[Wallets.NEW_ENCRYPTED_SEED_VALUE] : wallet.getEncryptedSeed(),
									
									// Address suffix
									[Database.toKeyPath(Wallets.DATABASE_ADDRESS_SUFFIX_NAME)]: (Wallets.NEW_ADDRESS_SUFFIX_VALUE in newValues === true) ? newValues[Wallets.NEW_ADDRESS_SUFFIX_VALUE] : wallet.getAddressSuffix(),
									
									// Order
									[Database.toKeyPath(Wallets.DATABASE_ORDER_NAME)]: (Wallets.NEW_ORDER_VALUE in newValues === true) ? newValues[Wallets.NEW_ORDER_VALUE] : newOrder,
									
									// Synced height
									[Database.toKeyPath(Wallets.DATABASE_SYNCED_HEIGHT_NAME)]: (Wallets.NEW_SYNCED_HEIGHT_VALUE in newValues === true) ? ((newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE] !== Wallet.CURRENT_HEIGHT) ? newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE].toFixed() : Wallet.CURRENT_HEIGHT) : ((wallet.getSyncedHeight() !== Wallet.CURRENT_HEIGHT) ? wallet.getSyncedHeight().toFixed() : Wallet.CURRENT_HEIGHT),
									
									// Spent amount
									[Database.toKeyPath(Wallets.DATABASE_SPENT_AMOUNT_NAME)]: (Wallets.NEW_SPENT_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_SPENT_AMOUNT_VALUE].toFixed() : wallet.getSpentAmount().toFixed(),
									
									// Unspent amount
									[Database.toKeyPath(Wallets.DATABASE_UNSPENT_AMOUNT_NAME)]: (Wallets.NEW_UNSPENT_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE].toFixed() : wallet.getUnspentAmount().toFixed(),
									
									// Unconfirmed amount
									[Database.toKeyPath(Wallets.DATABASE_UNCONFIRMED_AMOUNT_NAME)]: (Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE].toFixed() : wallet.getUnconfirmedAmount().toFixed(),
									
									// Locked amount
									[Database.toKeyPath(Wallets.DATABASE_LOCKED_AMOUNT_NAME)]: (Wallets.NEW_LOCKED_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE].toFixed() : wallet.getLockedAmount().toFixed(),
									
									// Pending amount
									[Database.toKeyPath(Wallets.DATABASE_PENDING_AMOUNT_NAME)]: (Wallets.NEW_PENDING_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_PENDING_AMOUNT_VALUE].toFixed() : wallet.getPendingAmount().toFixed(),
									
									// Expired amount
									[Database.toKeyPath(Wallets.DATABASE_EXPIRED_AMOUNT_NAME)]: (Wallets.NEW_EXPIRED_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_EXPIRED_AMOUNT_VALUE].toFixed() : wallet.getExpiredAmount().toFixed(),
									
									// Wallet type
									[Database.toKeyPath(Wallets.DATABASE_WALLET_TYPE_NAME)]: wallet.getWalletType(),
									
									// Network type
									[Database.toKeyPath(Wallets.DATABASE_NETWORK_TYPE_NAME)]: wallet.getNetworkType(),
									
									// Last identifier
									[Database.toKeyPath(Wallets.DATABASE_LAST_IDENTIFIER_NAME)]: (Wallets.NEW_LAST_IDENTIFIER_VALUE in newValues === true) ? ((newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE] !== Wallet.NO_LAST_IDENTIFIER) ? newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE].getValue() : Wallet.NO_LAST_IDENTIFIER) : ((wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER) ? wallet.getLastIdentifier().getValue() : Wallet.NO_LAST_IDENTIFIER),
									
									// Hardware type
									[Database.toKeyPath(Wallets.DATABASE_HARDWARE_TYPE_NAME)]: (Wallets.NEW_HARDWARE_TYPE_VALUE in newValues === true) ? newValues[Wallets.NEW_HARDWARE_TYPE_VALUE] : wallet.getHardwareType(),
									
									// Encrypted root public key
									[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_ROOT_PUBLIC_KEY_NAME)]: (Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE in newValues === true) ? newValues[Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE] : wallet.getEncryptedRootPublicKey(),
									
									// Use BIP39
									[Database.toKeyPath(Wallets.DATABASE_USE_BIP39_NAME)]: wallet.getUseBip39(),
									
									// Encrypted BIP39 salt
									[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_BIP39_SALT_NAME)]: (Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE in newValues === true) ? newValues[Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE] : wallet.getEncryptedBip39Salt(),
									
									// Account number
									[Database.toKeyPath(Wallets.DATABASE_ACCOUNT_NUMBER_NAME)]: wallet.getAccountNumber(),
									
									// Payment proof index
									[Database.toKeyPath(Wallets.DATABASE_PAYMENT_PROOF_INDEX_NAME)]: wallet.getPaymentProofIndex()
									
								}, (creatingNewKeyPath === true) ? Database.CREATE_NEW_KEY_PATH : wallet.getKeyPath(), databaseTransaction, Database.STRICT_DURABILITY).then(function(keyPath) {
								
									// Check if a transaction was provided
									if(transaction !== Wallets.NO_TRANSACTION) {
									
										// Set wallet's order
										wallet.setOrder(newOrder);
										
										// Set wallet's key path
										wallet.setKeyPath(keyPath);
									
										// Resolve new values
										resolve(newValues);
									}
									
									// Otherwise
									else {
								
										// Return committing database transaction
										return Database.commitTransaction(databaseTransaction).then(function() {
										
											// Set wallet's order
											wallet.setOrder(newOrder);
											
											// Set wallet's key path
											wallet.setKeyPath(keyPath);
											
											// Check if a new name value was set
											if(Wallets.NEW_NAME_VALUE in newValues === true) {
									
												// Set wallet's name to its new value
												wallet.setName(newValues[Wallets.NEW_NAME_VALUE]);
											}
											
											// Check if a new synced height value was set
											if(Wallets.NEW_SYNCED_HEIGHT_VALUE in newValues === true) {
									
												// Set wallet's synced height to its new value
												wallet.setSyncedHeight(newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE]);
											}
											
											// Check if a new unconfirmed amount value was set
											if(Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE in newValues === true) {
											
												// Set wallet's unconfirmed amount to its new value
												wallet.setUnconfirmedAmount(newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]);
											}
											
											// Check if a new locked amount value was set
											if(Wallets.NEW_LOCKED_AMOUNT_VALUE in newValues === true) {
											
												// Set wallet's locked amount to its new value
												wallet.setLockedAmount(newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE]);
											}
											
											// Check if a new unspent amount value was set
											if(Wallets.NEW_UNSPENT_AMOUNT_VALUE in newValues === true) {
											
												// Set wallet's unspent amount to its new value
												wallet.setUnspentAmount(newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]);
											}
											
											// Check if a new spent amount value was set
											if(Wallets.NEW_SPENT_AMOUNT_VALUE in newValues === true) {
											
												// Set wallet's spent amount to its new value
												wallet.setSpentAmount(newValues[Wallets.NEW_SPENT_AMOUNT_VALUE]);
											}
											
											// Check if a new pending amount value was set
											if(Wallets.NEW_PENDING_AMOUNT_VALUE in newValues === true) {
											
												// Set wallet's pending amount to its new value
												wallet.setPendingAmount(newValues[Wallets.NEW_PENDING_AMOUNT_VALUE]);
											}
											
											// Check if a new expired amount value was set
											if(Wallets.NEW_EXPIRED_AMOUNT_VALUE in newValues === true) {
											
												// Set wallet's expired amount to its new value
												wallet.setExpiredAmount(newValues[Wallets.NEW_EXPIRED_AMOUNT_VALUE]);
											}
											
											// Check if a new address suffix value was set
											if(Wallets.NEW_ADDRESS_SUFFIX_VALUE in newValues === true) {
											
												// Set wallet's address suffix to its new value
												wallet.setAddressSuffix(newValues[Wallets.NEW_ADDRESS_SUFFIX_VALUE]);
											}
											
											// Check if a new last identifier value was set
											if(Wallets.NEW_LAST_IDENTIFIER_VALUE in newValues === true) {
											
												// Set wallet's last identifier to its new value
												wallet.setLastIdentifier(newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE]);
											}
											
											// Check if a new salt value is set
											if(Wallets.NEW_SALT_VALUE in newValues === true) {
											
												// Set wallet's salt to its new value
												wallet.setSalt(newValues[Wallets.NEW_SALT_VALUE]);
											}
											
											// Check if a new number of iterations value is set
											if(Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE in newValues === true) {
											
												// Set wallet's number of iterations to its new value
												wallet.setNumberOfIterations(newValues[Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE]);
											}
											
											// Check if a new initialization vector value is set
											if(Wallets.NEW_INITIALIZATION_VECTOR_VALUE in newValues === true) {
											
												// Set wallet's intiialization vector to its new value
												wallet.setInitializationVector(newValues[Wallets.NEW_INITIALIZATION_VECTOR_VALUE]);
											}
											
											// Check if a new encrypted seed value is set
											if(Wallets.NEW_ENCRYPTED_SEED_VALUE in newValues === true) {
											
												// Set wallet's encrypted seed to its new value
												wallet.setEncryptedSeed(newValues[Wallets.NEW_ENCRYPTED_SEED_VALUE]);
											}
											
											// Check if a new order value is set
											if(Wallets.NEW_ORDER_VALUE in newValues === true) {
											
												// Set wallet's order to its new value
												wallet.setOrder(newValues[Wallets.NEW_ORDER_VALUE]);
											}
											
											// Check if a new encrypted root public key value is set
											if(Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE in newValues === true) {
											
												// Set wallet's encrypted root public key to its new value
												wallet.setEncryptedRootPublicKey(newValues[Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE]);
											}
											
											// Check if a new encrypted BIP39 salt value is set
											if(Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE in newValues === true) {
											
												// Set wallet's encrypted BIP39 salt to its new value
												wallet.setEncryptedBip39Salt(newValues[Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE]);
											}
											
											// Check if a new hardware type value is set
											if(Wallets.NEW_HARDWARE_TYPE_VALUE in newValues === true) {
											
												// Set wallet's hardware type to its new value
												wallet.setHardwareType(newValues[Wallets.NEW_HARDWARE_TYPE_VALUE]);
											}
											
											// Resolve new values
											resolve(newValues);
										
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
									if(transaction !== Wallets.NO_TRANSACTION) {
									
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
							
								// Check if a transaction was provided
								if(transaction !== Wallets.NO_TRANSACTION) {
								
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
						
							// Return saving wallet in the database
							return Database.saveResult(Wallets.OBJECT_STORE_NAME, {
										
								// Name
								[Database.toKeyPath(Wallets.DATABASE_NAME_NAME)]: (Wallets.NEW_NAME_VALUE in newValues === true) ? newValues[Wallets.NEW_NAME_VALUE] : wallet.getName(),
								
								// Color
								[Database.toKeyPath(Wallets.DATABASE_COLOR_NAME)]: parseInt(wallet.getColor().substring("#"["length"]), Common.HEX_NUMBER_BASE),
								
								// Salt
								[Database.toKeyPath(Wallets.DATABASE_SALT_NAME)]: (Wallets.NEW_SALT_VALUE in newValues === true) ? newValues[Wallets.NEW_SALT_VALUE] : wallet.getSalt(),
								
								// Initialization vector
								[Database.toKeyPath(Wallets.DATABASE_INITIALIZATION_VECTOR_NAME)]: (Wallets.NEW_INITIALIZATION_VECTOR_VALUE in newValues === true) ? newValues[Wallets.NEW_INITIALIZATION_VECTOR_VALUE] : wallet.getInitializationVector(),
								
								// Number of iterations
								[Database.toKeyPath(Wallets.DATABASE_NUMBER_OF_ITERATIONS_NAME)]: (Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE in newValues === true) ? newValues[Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE] : wallet.getNumberOfIterations(),
								
								// Encrypted seed
								[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_SEED_NAME)]: (Wallets.NEW_ENCRYPTED_SEED_VALUE in newValues === true) ? newValues[Wallets.NEW_ENCRYPTED_SEED_VALUE] : wallet.getEncryptedSeed(),
								
								// Address suffix
								[Database.toKeyPath(Wallets.DATABASE_ADDRESS_SUFFIX_NAME)]: (Wallets.NEW_ADDRESS_SUFFIX_VALUE in newValues === true) ? newValues[Wallets.NEW_ADDRESS_SUFFIX_VALUE] : wallet.getAddressSuffix(),
								
								// Order
								[Database.toKeyPath(Wallets.DATABASE_ORDER_NAME)]: (Wallets.NEW_ORDER_VALUE in newValues === true) ? newValues[Wallets.NEW_ORDER_VALUE] : wallet.getOrder(),
								
								// Synced height
								[Database.toKeyPath(Wallets.DATABASE_SYNCED_HEIGHT_NAME)]: (Wallets.NEW_SYNCED_HEIGHT_VALUE in newValues === true) ? ((newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE] !== Wallet.CURRENT_HEIGHT) ? newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE].toFixed() : Wallet.CURRENT_HEIGHT) : ((wallet.getSyncedHeight() !== Wallet.CURRENT_HEIGHT) ? wallet.getSyncedHeight().toFixed() : Wallet.CURRENT_HEIGHT),
								
								// Spent amount
								[Database.toKeyPath(Wallets.DATABASE_SPENT_AMOUNT_NAME)]: (Wallets.NEW_SPENT_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_SPENT_AMOUNT_VALUE].toFixed() : wallet.getSpentAmount().toFixed(),
								
								// Unspent amount
								[Database.toKeyPath(Wallets.DATABASE_UNSPENT_AMOUNT_NAME)]: (Wallets.NEW_UNSPENT_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE].toFixed() : wallet.getUnspentAmount().toFixed(),
								
								// Unconfirmed amount
								[Database.toKeyPath(Wallets.DATABASE_UNCONFIRMED_AMOUNT_NAME)]: (Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE].toFixed() : wallet.getUnconfirmedAmount().toFixed(),
								
								// Locked amount
								[Database.toKeyPath(Wallets.DATABASE_LOCKED_AMOUNT_NAME)]: (Wallets.NEW_LOCKED_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE].toFixed() : wallet.getLockedAmount().toFixed(),
								
								// Pending amount
								[Database.toKeyPath(Wallets.DATABASE_PENDING_AMOUNT_NAME)]: (Wallets.NEW_PENDING_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_PENDING_AMOUNT_VALUE].toFixed() : wallet.getPendingAmount().toFixed(),
								
								// Expired amount
								[Database.toKeyPath(Wallets.DATABASE_EXPIRED_AMOUNT_NAME)]: (Wallets.NEW_EXPIRED_AMOUNT_VALUE in newValues === true) ? newValues[Wallets.NEW_EXPIRED_AMOUNT_VALUE].toFixed() : wallet.getExpiredAmount().toFixed(),
								
								// Wallet type
								[Database.toKeyPath(Wallets.DATABASE_WALLET_TYPE_NAME)]: wallet.getWalletType(),
								
								// Network type
								[Database.toKeyPath(Wallets.DATABASE_NETWORK_TYPE_NAME)]: wallet.getNetworkType(),
								
								// Last identifier
								[Database.toKeyPath(Wallets.DATABASE_LAST_IDENTIFIER_NAME)]: (Wallets.NEW_LAST_IDENTIFIER_VALUE in newValues === true) ? ((newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE] !== Wallet.NO_LAST_IDENTIFIER) ? newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE].getValue() : Wallet.NO_LAST_IDENTIFIER) : ((wallet.getLastIdentifier() !== Wallet.NO_LAST_IDENTIFIER) ? wallet.getLastIdentifier().getValue() : Wallet.NO_LAST_IDENTIFIER),
								
								// Hardware type
								[Database.toKeyPath(Wallets.DATABASE_HARDWARE_TYPE_NAME)]: (Wallets.NEW_HARDWARE_TYPE_VALUE in newValues === true) ? newValues[Wallets.NEW_HARDWARE_TYPE_VALUE] : wallet.getHardwareType(),
								
								// Encrypted root public key
								[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_ROOT_PUBLIC_KEY_NAME)]: (Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE in newValues === true) ? newValues[Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE] : wallet.getEncryptedRootPublicKey(),
								
								// Use BIP39
								[Database.toKeyPath(Wallets.DATABASE_USE_BIP39_NAME)]: wallet.getUseBip39(),
								
								// Encrypted BIP39 salt
								[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_BIP39_SALT_NAME)]: (Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE in newValues === true) ? newValues[Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE] : wallet.getEncryptedBip39Salt(),
								
								// Account number
								[Database.toKeyPath(Wallets.DATABASE_ACCOUNT_NUMBER_NAME)]: wallet.getAccountNumber(),
								
								// Payment proof index
								[Database.toKeyPath(Wallets.DATABASE_PAYMENT_PROOF_INDEX_NAME)]: wallet.getPaymentProofIndex()
								
							}, (creatingNewKeyPath === true) ? Database.CREATE_NEW_KEY_PATH : wallet.getKeyPath(), databaseTransaction, Database.STRICT_DURABILITY).then(function(keyPath) {
							
								// Check if a transaction was provided
								if(transaction !== Wallets.NO_TRANSACTION) {
								
									// Set wallet's key path
									wallet.setKeyPath(keyPath);
									
									// Resolve new values
									resolve(newValues);
								}
								
								// Otherwise
								else {
							
									// Return committing database transaction
									return Database.commitTransaction(databaseTransaction).then(function() {
									
										// Set wallet's key path
										wallet.setKeyPath(keyPath);
										
										// Check if a new name value was set
										if(Wallets.NEW_NAME_VALUE in newValues === true) {
								
											// Set wallet's name to its new value
											wallet.setName(newValues[Wallets.NEW_NAME_VALUE]);
										}
										
										// Check if a new synced height value was set
										if(Wallets.NEW_SYNCED_HEIGHT_VALUE in newValues === true) {
								
											// Set wallet's synced height to its new value
											wallet.setSyncedHeight(newValues[Wallets.NEW_SYNCED_HEIGHT_VALUE]);
										}
										
										// Check if a new unconfirmed amount value was set
										if(Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE in newValues === true) {
										
											// Set wallet's unconfirmed amount to its new value
											wallet.setUnconfirmedAmount(newValues[Wallets.NEW_UNCONFIRMED_AMOUNT_VALUE]);
										}
										
										// Check if a new locked amount value was set
										if(Wallets.NEW_LOCKED_AMOUNT_VALUE in newValues === true) {
										
											// Set wallet's locked amount to its new value
											wallet.setLockedAmount(newValues[Wallets.NEW_LOCKED_AMOUNT_VALUE]);
										}
										
										// Check if a new unspent amount value was set
										if(Wallets.NEW_UNSPENT_AMOUNT_VALUE in newValues === true) {
										
											// Set wallet's unspent amount to its new value
											wallet.setUnspentAmount(newValues[Wallets.NEW_UNSPENT_AMOUNT_VALUE]);
										}
										
										// Check if a new spent amount value was set
										if(Wallets.NEW_SPENT_AMOUNT_VALUE in newValues === true) {
										
											// Set wallet's spent amount to its new value
											wallet.setSpentAmount(newValues[Wallets.NEW_SPENT_AMOUNT_VALUE]);
										}
										
										// Check if a new pending amount value was set
										if(Wallets.NEW_PENDING_AMOUNT_VALUE in newValues === true) {
										
											// Set wallet's pending amount to its new value
											wallet.setPendingAmount(newValues[Wallets.NEW_PENDING_AMOUNT_VALUE]);
										}
										
										// Check if a new expired amount value was set
										if(Wallets.NEW_EXPIRED_AMOUNT_VALUE in newValues === true) {
										
											// Set wallet's expired amount to its new value
											wallet.setExpiredAmount(newValues[Wallets.NEW_EXPIRED_AMOUNT_VALUE]);
										}
										
										// Check if a new address suffix value was set
										if(Wallets.NEW_ADDRESS_SUFFIX_VALUE in newValues === true) {
										
											// Set wallet's address suffix to its new value
											wallet.setAddressSuffix(newValues[Wallets.NEW_ADDRESS_SUFFIX_VALUE]);
										}
										
										// Check if a new last identifier value was set
										if(Wallets.NEW_LAST_IDENTIFIER_VALUE in newValues === true) {
										
											// Set wallet's last identifier to its new value
											wallet.setLastIdentifier(newValues[Wallets.NEW_LAST_IDENTIFIER_VALUE]);
										}
										
										// Check if a new salt value is set
										if(Wallets.NEW_SALT_VALUE in newValues === true) {
										
											// Set wallet's salt to its new value
											wallet.setSalt(newValues[Wallets.NEW_SALT_VALUE]);
										}
										
										// Check if a new number of iterations value is set
										if(Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE in newValues === true) {
										
											// Set wallet's number of iterations to its new value
											wallet.setNumberOfIterations(newValues[Wallets.NEW_NUMBER_OF_ITERATIONS_VALUE]);
										}
										
										// Check if a new initialization vector value is set
										if(Wallets.NEW_INITIALIZATION_VECTOR_VALUE in newValues === true) {
										
											// Set wallet's intiialization vector to its new value
											wallet.setInitializationVector(newValues[Wallets.NEW_INITIALIZATION_VECTOR_VALUE]);
										}
										
										// Check if a new encrypted seed value is set
										if(Wallets.NEW_ENCRYPTED_SEED_VALUE in newValues === true) {
										
											// Set wallet's encrypted seed to its new value
											wallet.setEncryptedSeed(newValues[Wallets.NEW_ENCRYPTED_SEED_VALUE]);
										}
										
										// Check if a new order value is set
										if(Wallets.NEW_ORDER_VALUE in newValues === true) {
										
											// Set wallet's order to its new value
											wallet.setOrder(newValues[Wallets.NEW_ORDER_VALUE]);
										}
										
										// Check if a new encrypted root public key value is set
										if(Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE in newValues === true) {
										
											// Set wallet's encrypted root public key to its new value
											wallet.setEncryptedRootPublicKey(newValues[Wallets.NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE]);
										}
										
										// Check if a new encrypted BIP39 salt value is set
										if(Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE in newValues === true) {
										
											// Set wallet's encrypted BIP39 salt to its new value
											wallet.setEncryptedBip39Salt(newValues[Wallets.NEW_ENCRYPTED_BIP39_SALT_VALUE]);
										}
										
										// Check if a new hardware type value is set
										if(Wallets.NEW_HARDWARE_TYPE_VALUE in newValues === true) {
										
											// Set wallet's hardware type to its new value
											wallet.setHardwareType(newValues[Wallets.NEW_HARDWARE_TYPE_VALUE]);
										}
										
										// Resolve new values
										resolve(newValues);
									
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
								if(transaction !== Wallets.NO_TRANSACTION) {
								
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
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Connect to hardware wallets
		connectToHardwareWallets() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if locked
				if(self.isLocked() === true) {
				
					// Reject error
					reject("Wallets locked.");
				}
				
				// Otherwise
				else {
				
					// Initialize hardware wallet found
					var hardwareWalletFound = false;
			
					// Go through all wallets
					for(var keyPath in self.wallets) {
								
						if(self.wallets.hasOwnProperty(keyPath) === true) {
					
							// Get wallet
							var wallet = self.wallets[keyPath];
							
							// Check if wallet is open, it's a hardware wallet, and its hardware isn't connected
							if(wallet.isOpen() === true && wallet.getHardwareType() !== Wallet.NO_HARDWARE_TYPE && wallet.isHardwareConnected() === false) {
							
								// Set hardware wallet found
								hardwareWalletFound = true;
								
								// Break
								break;
							}
						}
					}
					
					// Check if a hardware wallet was found
					if(hardwareWalletFound === true) {
					
						// Check if hardware wallets are supported
						if(HardwareWallet.isSupported() === true) {
						
							// Check if USB is supported
							if("usb" in navigator === true) {
						
								// Return obtain exclusive hardware lock
								return self.obtainExclusiveHardwareLock().then(function() {
							
									// Return getting available hardware wallet descriptors
									return HardwareWallet.getAvailableHardwareWalletDescriptors().then(function(availableHardwareWalletDescriptors) {
									
										// Initialize connect to hardware wallets
										var connectToHardwareWallets = [];
									
										// Go through all available hardware wallet descriptors
										for(let i = 0; i < availableHardwareWalletDescriptors["length"]; ++i) {
										
											// Create hardware wallet
											let hardwareWallet = new HardwareWallet(self.application);
											
											// Append connecting to hardware wallet to list
											connectToHardwareWallets.push(new Promise(function(resolve, reject) {
											
												// Return connect to available hardware wallet descriptor
												return hardwareWallet.connect(availableHardwareWalletDescriptors[i], true).then(function() {
												
													// Initialize connect wallets to hardware
													var connectWalletsToHardware = [];
												
													// Go through all wallets
													for(var keyPath in self.wallets) {
																
														if(self.wallets.hasOwnProperty(keyPath) === true) {
													
															// Get wallet
															let wallet = self.wallets[keyPath];
															
															// Check if wallet is a hardware wallet
															if(wallet.getHardwareType() !== Wallet.NO_HARDWARE_TYPE) {
															
																// Append connecting wallet to hardware to list
																connectWalletsToHardware.push(new Promise(function(resolve, reject) {
																
																	// Return connecting wallet to the applicable hardware wallet
																	return wallet.connectToApplicableHardware([hardwareWallet]).then(function() {
																	
																		// Resolve
																		resolve();
																	
																	// Catch errors
																	}).catch(function(error) {
																	
																		// Reject error
																		reject(error);
																	});
																}));
															}
														}
													}
													
													// Return connecting wallets to hardware
													return Promise.allSettled(connectWalletsToHardware).then(function() {
													
														// Check if hardware wallet isn't in use
														if(hardwareWallet.getInUse() === false) {
														
															// Close hardware wallet
															hardwareWallet.close();
														}
														
														// Resolve
														resolve();
													});
												
												// Catch errors
												}).catch(function(error) {
												
													// Reject error
													reject(error);
												});
											}));
										}
										
										// Return connecting to hardware wallets
										return Promise.allSettled(connectToHardwareWallets).then(function() {
										
											// Release exclusive hardware lock
											self.releaseExclusiveHardwareLock();
										
											// Resolve
											resolve();
										});
									
									// Catch errors
									}).catch(function(error) {
									
										// Release exclusive hardware lock
										self.releaseExclusiveHardwareLock();
										
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
						}
						
						// Otherwise
						else {
						
							// Resolve
							resolve();
						}
					}
					
					// Otherwise
					else {
					
						// Resolve
						resolve();
					}
				}
			});
		}
		
		// Get wallet from result
		static getWalletFromResult(result) {
		
			// Return wallet from result
			return new Wallet(
			
				// Name
				result[Database.toKeyPath(Wallets.DATABASE_NAME_NAME)],
				
				// Color
				"#" + result[Database.toKeyPath(Wallets.DATABASE_COLOR_NAME)].toString(Common.HEX_NUMBER_BASE).padStart(Common.HEX_COLOR_LENGTH, Common.HEX_NUMBER_PADDING),
				
				// Salt
				result[Database.toKeyPath(Wallets.DATABASE_SALT_NAME)],
				
				// Initialization vector
				result[Database.toKeyPath(Wallets.DATABASE_INITIALIZATION_VECTOR_NAME)],
				
				// Number of iterations
				result[Database.toKeyPath(Wallets.DATABASE_NUMBER_OF_ITERATIONS_NAME)],
				
				// Encrypted seed
				result[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_SEED_NAME)],
				
				// Address suffix
				result[Database.toKeyPath(Wallets.DATABASE_ADDRESS_SUFFIX_NAME)],
				
				// Order
				result[Database.toKeyPath(Wallets.DATABASE_ORDER_NAME)],
				
				// Synced height
				(result[Database.toKeyPath(Wallets.DATABASE_SYNCED_HEIGHT_NAME)] !== Wallet.CURRENT_HEIGHT) ? new BigNumber(result[Database.toKeyPath(Wallets.DATABASE_SYNCED_HEIGHT_NAME)]) : Wallet.CURRENT_HEIGHT,
				
				// Spent amount
				new BigNumber(result[Database.toKeyPath(Wallets.DATABASE_SPENT_AMOUNT_NAME)]),
				
				// Unspent amount
				new BigNumber(result[Database.toKeyPath(Wallets.DATABASE_UNSPENT_AMOUNT_NAME)]),
				
				// Unconfirmed amount
				new BigNumber(result[Database.toKeyPath(Wallets.DATABASE_UNCONFIRMED_AMOUNT_NAME)]),
				
				// Locked amount
				new BigNumber(result[Database.toKeyPath(Wallets.DATABASE_LOCKED_AMOUNT_NAME)]),
				
				// Pending amount
				new BigNumber(result[Database.toKeyPath(Wallets.DATABASE_PENDING_AMOUNT_NAME)]),
				
				// Expired amount
				new BigNumber(result[Database.toKeyPath(Wallets.DATABASE_EXPIRED_AMOUNT_NAME)]),
				
				// Wallet type
				result[Database.toKeyPath(Wallets.DATABASE_WALLET_TYPE_NAME)],
				
				// Network type
				result[Database.toKeyPath(Wallets.DATABASE_NETWORK_TYPE_NAME)],
				
				// Last identifier
				(result[Database.toKeyPath(Wallets.DATABASE_LAST_IDENTIFIER_NAME)] !== Wallet.NO_LAST_IDENTIFIER) ? new Identifier(Common.toHexString(result[Database.toKeyPath(Wallets.DATABASE_LAST_IDENTIFIER_NAME)])) : Wallet.NO_LAST_IDENTIFIER,
				
				// Hardware type
				result[Database.toKeyPath(Wallets.DATABASE_HARDWARE_TYPE_NAME)],
				
				// Encrypted root public key
				result[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_ROOT_PUBLIC_KEY_NAME)],
				
				// Use BIP39
				result[Database.toKeyPath(Wallets.DATABASE_USE_BIP39_NAME)],
				
				// Encrypted BIP39 salt
				result[Database.toKeyPath(Wallets.DATABASE_ENCRYPTED_BIP39_SALT_NAME)],
				
				// Account number
				(Database.toKeyPath(Wallets.DATABASE_ACCOUNT_NUMBER_NAME) in result === true) ? result[Database.toKeyPath(Wallets.DATABASE_ACCOUNT_NUMBER_NAME)] : 0,
				
				// Payment proof index
				(Database.toKeyPath(Wallets.DATABASE_PAYMENT_PROOF_INDEX_NAME) in result === true) ? result[Database.toKeyPath(Wallets.DATABASE_PAYMENT_PROOF_INDEX_NAME)] : 0,
				
				// Key path
				result[Database.KEY_PATH_NAME]
			);
		}
	
		// No password
		static get NO_PASSWORD() {
		
			// Return no password
			return null;
		}
		
		// Object store name
		static get OBJECT_STORE_NAME() {
		
			// Return object store name
			return "Wallets";
		}
		
		// Database name name
		static get DATABASE_NAME_NAME() {
		
			// Return database name name
			return "Name";
		}
		
		// Database color name
		static get DATABASE_COLOR_NAME() {
		
			// Return database color name
			return "Color";
		}
		
		// Database salt name
		static get DATABASE_SALT_NAME() {
		
			// Return database salt name
			return "Salt";
		}
		
		// Database initialization vector name
		static get DATABASE_INITIALIZATION_VECTOR_NAME() {
		
			// Return database initialization vector name
			return "Initialization Vector";
		}
		
		// Database number of iterations name
		static get DATABASE_NUMBER_OF_ITERATIONS_NAME() {
		
			// Return database number of iterations name
			return "Number Of Iterations";
		}
		
		// Database encrypted seed name
		static get DATABASE_ENCRYPTED_SEED_NAME() {
		
			// Return database encrypted seed name
			return "Encrypted Seed";
		}
		
		// Database address suffix name
		static get DATABASE_ADDRESS_SUFFIX_NAME() {
		
			// Return database address suffix name
			return "Address Suffix";
		}
		
		// Database order name
		static get DATABASE_ORDER_NAME() {
		
			// Return database order name
			return "Order";
		}
		
		// Database synced height name
		static get DATABASE_SYNCED_HEIGHT_NAME() {
		
			// Return database synced height name
			return "Synced Height";
		}
		
		// Database spent amount name
		static get DATABASE_SPENT_AMOUNT_NAME() {
		
			// Return database spent amount name
			return "Spent Amount";
		}
		
		// Database unspent amount name
		static get DATABASE_UNSPENT_AMOUNT_NAME() {
		
			// Return database unspent amount name
			return "Unspent Amount";
		}
		
		// Database unconfirmed amount name
		static get DATABASE_UNCONFIRMED_AMOUNT_NAME() {
		
			// Return database unconfirmed amount name
			return "Unconfirmed Amount";
		}
		
		// Database locked amount name
		static get DATABASE_LOCKED_AMOUNT_NAME() {
		
			// Return database locked amount name
			return "Locked Amount";
		}
		
		// Database pending amount name
		static get DATABASE_PENDING_AMOUNT_NAME() {
		
			// Return database pending amount name
			return "Pending Amount";
		}
		
		// Database expired amount name
		static get DATABASE_EXPIRED_AMOUNT_NAME() {
		
			// Return database expired amount name
			return "Expired Amount";
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
		
		// Database last identifier name
		static get DATABASE_LAST_IDENTIFIER_NAME() {
		
			// Return database last identifier name
			return "Last Identifier";
		}
		
		// Database hardware type name
		static get DATABASE_HARDWARE_TYPE_NAME() {
		
			// Return database hardware type name
			return "Hardware Type";
		}
		
		// Database encrypted root public key name
		static get DATABASE_ENCRYPTED_ROOT_PUBLIC_KEY_NAME() {
		
			// Return database encrypted root public key name
			return "Encrypted Root Public Key";
		}
		
		// Database use BIP39 name
		static get DATABASE_USE_BIP39_NAME() {
		
			// Return database use BIP39 name
			return "Use BIP39";
		}
		
		// Database encrypted BIP39 salt name
		static get DATABASE_ENCRYPTED_BIP39_SALT_NAME() {
		
			// Return database encrypted BIP39 salt name
			return "Encrypted BIP39 Salt";
		}
		
		// Database account number name
		static get DATABASE_ACCOUNT_NUMBER_NAME() {
		
			// Return database account number name
			return "Account Number";
		}
		
		// Database payment proof index name
		static get DATABASE_PAYMENT_PROOF_INDEX_NAME() {
		
			// Return database payment proof index name
			return "Payment Proof Index";
		}
		
		// Database wallet type, network type, and address suffix name
		static get DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_ADDRESS_SUFFIX_NAME() {
		
			// Return database wallet type, network type, and address suffix name
			return "Wallet Type, Network Type, And Address Suffix";
		}
		
		// Database wallet type, network type, and order name
		static get DATABASE_WALLET_TYPE_NETWORK_TYPE_AND_ORDER_NAME() {
		
			// Return database wallet type, network type, and order name
			return "Wallet Type, Network Type, And Order";
		}
		
		// Database wallet type and network type name
		static get DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME() {
		
			// Return database wallet type and network type name
			return "Wallet Type And Network Type";
		}
		
		// Outputs group size
		static get OUTPUTS_GROUP_SIZE() {
		
			// Check if device has low memory
			if(Common.isLowMemoryDevice() === true)
			
				// Return outputs group size
				return new BigNumber(250);
			
			// Otherwise check if device has high memory
			else if(Common.isHighMemoryDevice() === true)
			
				// Return outputs group size
				return new BigNumber(1000);
			
			// Otherwise
			else
		
				// Return outputs group size
				return new BigNumber(400);
		}
		
		// Verifying outputs group size
		static get VERIFYING_OUTPUTS_GROUP_SIZE() {
		
			// Return verifying outputs group size
			return 100;
		}
		
		// Resync delay milliseconds
		static get RESYNC_DELAY_MILLISECONDS() {
		
			// Return resync delay milliseconds
			return 600;
		}
		
		// Unknown percent complete
		static get UNKNOWN_PERCENT_COMPLETE() {
		
			// Return unknown percent complete
			return null;
		}
		
		// Minimum percent
		static get MINIMUM_PERCENT() {
		
			// Return minimum percent
			return 0;
		}
		
		// Maximum percent
		static get MAXIMUM_PERCENT() {
		
			// Return maximum percent
			return 100;
		}
		
		// Variation from previous block height
		static get VARIATION_FROM_PREVIOUS_BLOCK_HEIGHT() {
		
			// Return variation from previous block height
			return Consensus.BLOCK_HEIGHT_WEEK;
		}
		
		// Variation to next block height
		static get VARIATION_TO_NEXT_BLOCK_HEIGHT() {
		
			// Return variation to next block height
			return Consensus.BLOCK_HEIGHT_WEEK;
		}
		
		// No last sync start index
		static get NO_LAST_SYNC_START_INDEX() {
		
			// Return no last sync start index
			return -1;
		}
		
		// No last sync last retrieved index
		static get NO_LAST_SYNC_LAST_RETRIEVED_INDEX() {
		
			// Return no last sync last retrieved index
			return -1;
		}
		
		// Percent complete precision
		static get PERCENT_COMPLETE_PRECISION() {
		
			// Return percent complete precision
			return 1;
		}
		
		// Replay detection threshold
		static get REPLAY_DETECTION_THRESHOLD() {
		
			// Return replay detection threshold
			return Consensus.BLOCK_HEIGHT_WEEK;
		}
		
		// Identifier height overage threshold
		static get IDENTIFIER_HEIGHT_OVERAGE_THRESHOLD() {
		
			// Return identifier height overage threshold
			return Consensus.BLOCK_HEIGHT_WEEK;
		}
		
		// No output
		static get NO_OUTPUT() {
		
			// Return no output
			return null;
		}
		
		// No new values
		static get NO_NEW_VALUES() {
		
			// Return no new values
			return null;
		}
		
		// No transaction
		static get NO_TRANSACTION() {
		
			// Return no transaction
			return null;
		}
		
		// New name value
		static get NEW_NAME_VALUE() {
		
			// Return new name value
			return "New Name Value";
		}
		
		// New synced height value
		static get NEW_SYNCED_HEIGHT_VALUE() {
		
			// Return new synced height value
			return "New Synced Height Value";
		}
		
		// New unconfirmed amount value
		static get NEW_UNCONFIRMED_AMOUNT_VALUE() {
		
			// Return new unconfirmed amount value
			return "New Unconfirmed Amount Value";
		}
		
		// New locked amount value
		static get NEW_LOCKED_AMOUNT_VALUE() {
		
			// Return new locked amount value
			return "New Locked Amount Value";
		}
		
		// New unspent amount value
		static get NEW_UNSPENT_AMOUNT_VALUE() {
		
			// Return new unspent amount value
			return "New Unspent Amount Value";
		}
		
		// New spent amount value
		static get NEW_SPENT_AMOUNT_VALUE() {
		
			// Return new spent amount value
			return "New Spent Amount Value";
		}
		
		// New pending amount value
		static get NEW_PENDING_AMOUNT_VALUE() {
		
			// Return new pending amount value
			return "New Pending Amount Value";
		}
		
		// New expired amount value
		static get NEW_EXPIRED_AMOUNT_VALUE() {
		
			// Return new expired amount value
			return "New Expired Amount Value";
		}
		
		// New address suffix value
		static get NEW_ADDRESS_SUFFIX_VALUE() {
		
			// Return new address suffix value
			return "New Address Suffix Value";
		}
		
		// New last identifier value
		static get NEW_LAST_IDENTIFIER_VALUE() {
		
			// Return new last identifier value
			return "New Last Identifier Value";
		}
		
		// New salt value
		static get NEW_SALT_VALUE() {
		
			// Return new salt value
			return "New Salt Value";
		}
		
		// New number of iterations value
		static get NEW_NUMBER_OF_ITERATIONS_VALUE() {
		
			// Return new number of iterations value
			return "New Number Of Iterations Value";
		}
		
		// New initialization vector value
		static get NEW_INITIALIZATION_VECTOR_VALUE() {
		
			// Return new initialization vector value
			return "New Initialization Vector Value";
		}
		
		// New encrypted seed value
		static get NEW_ENCRYPTED_SEED_VALUE() {
		
			// Return new encrypted seed value
			return "New Encrypted Seed Value";
		}
		
		// New order value
		static get NEW_ORDER_VALUE() {
		
			// Return new order value
			return "New Order Value";
		}
		
		// New encrypted root public key value
		static get NEW_ENCRYPTED_ROOT_PUBLIC_KEY_VALUE() {
		
			// Return new encrypted root public key value
			return "New Encrypted Root Public Key Value";
		}
		
		// New encrypted BIP39 salt value
		static get NEW_ENCRYPTED_BIP39_SALT_VALUE() {
		
			// Return new encrypted BIP39 salt value
			return "New Encrypted BIP39 Salt Value";
		}
		
		// New hardware type value
		static get NEW_HARDWARE_TYPE_VALUE() {
		
			// Return new hardware type value
			return "New Hardware Type Value";
		}
		
		// Change password salt index
		static get CHANGE_PASSWORD_SALT_INDEX() {
		
			// Return change password salt index
			return 0;
		}
		
		// Change password number of iterations index
		static get CHANGE_PASSWORD_NUMBER_OF_ITERATIONS_INDEX() {
		
			// Return change password number of iterations index
			return Wallets.CHANGE_PASSWORD_SALT_INDEX + 1;
		}
		
		// Change password initialization vector index
		static get CHANGE_PASSWORD_INITIALIZATION_VECTOR_INDEX() {
		
			// Return change password initialization vector index
			return Wallets.CHANGE_PASSWORD_NUMBER_OF_ITERATIONS_INDEX + 1;
		}
		
		// Change password encrypted seed index
		static get CHANGE_PASSWORD_ENCRYPTED_SEED_INDEX() {
		
			// Return change password encrypted seed index
			return Wallets.CHANGE_PASSWORD_INITIALIZATION_VECTOR_INDEX + 1;
		}
		
		// Change password encrypted BIP39 salt index
		static get CHANGE_PASSWORD_ENCRYPTED_BIP39_SALT_INDEX() {
		
			// Return change password encrypted BIP39 salt index
			return Wallets.CHANGE_PASSWORD_ENCRYPTED_SEED_INDEX + 1;
		}
		
		// Change password encrypted root public key index
		static get CHANGE_PASSWORD_ENCRYPTED_ROOT_PUBLIC_KEY_INDEX() {
		
			// Return change password encrypted root public key index
			return Wallets.CHANGE_PASSWORD_INITIALIZATION_VECTOR_INDEX + 1;
		}
		
		// Settings number of confirmations name
		static get SETTINGS_NUMBER_OF_CONFIRMATIONS_NAME() {
		
			// Return settings number of confirmations name
			return "Number Of Confirmations";
		}
		
		// Settings primary address type default value
		static get SETTINGS_NUMBER_OF_CONFIRMATIONS_DEFAULT_VALUE() {
		
			// Return settings number of confirmations default value
			return (new BigNumber(10)).toFixed();
		}
		
		// Exclusive hardware lock release event
		static get EXCLUSIVE_HARDWARE_LOCK_RELEASE_EVENT() {
		
			// Return exclusive hardware lock release event
			return "WalletsExclusiveHardwareLockReleaseEvent";
		}
		
		// Spent outputs change to spent index
		static get SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX() {
		
			// Return spent outputs change to spent index
			return 0;
		}
		
		// Spent outputs change to unspent index
		static get SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX() {
		
			// Return spent outputs change to unspent index
			return Wallets.SPENT_OUTPUTS_CHANGE_TO_SPENT_INDEX + 1;
		}
		
		// Spent outputs change to locked index
		static get SPENT_OUTPUTS_CHANGE_TO_LOCKED_INDEX() {
		
			// Return spent outputs change to locked index
			return Wallets.SPENT_OUTPUTS_CHANGE_TO_UNSPENT_INDEX + 1;
		}
}


// Main function

// Set global object's wallets
globalThis["Wallets"] = Wallets;
