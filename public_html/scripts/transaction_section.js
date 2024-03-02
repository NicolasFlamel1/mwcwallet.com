// Use strict
"use strict";


// Classes

// Transaction section class
class TransactionSection extends Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Delegate constructor
			super(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard);
			
			// Get navigation display
			this.navigationDisplay = this.getDisplay().find("div.navigation");
			
			// Set wallet key path
			this.walletKeyPath = WalletSection.NO_WALLET_KEY_PATH;
			
			// Set transaction key path
			this.transactionKeyPath = TransactionSection.NO_TRANSACTION_KEY_PATH;
			
			// Set transaction index
			this.transactionIndex = TransactionSection.NO_TRANSACTION_INDEX;
			
			// Set initialize database transaction
			this.initializeDatabaseTransaction = TransactionSection.NO_INITIALIZE_DATABASE_TRANSACTION;
			
			// Set transaction
			this.transaction = TransactionSection.NO_TRANSACTION;
			
			// Set self
			var self = this;
			
			// Transactions change event
			$(this.getTransactions()).on(Transactions.CHANGE_EVENT, function(event, changedTransactions) {
			
				// Check if shown and transaction key path exists
				if(self.isShown() === true && self.transactionKeyPath !== TransactionSection.NO_TRANSACTION_KEY_PATH) {
				
					// Go through all changed transactions
					for(var i = 0; i < changedTransactions["length"]; ++i) {
					
						// Get changed transaction
						var changedTransaction = changedTransactions[i];
						
						// Check if shown transaction was changed
						if(changedTransaction.getKeyPath() === self.transactionKeyPath) {
						
							// Set transaction
							self.transaction = changedTransaction;
							
							// Update transaction display
							self.updateTransactionDisplay();
						
							// Break
							break;
						}
					}
				}
			});
			
			// Node height change event
			$(this.getNode()).on(Node.HEIGHT_CHANGE_EVENT, function(event, height) {
			
				// Get number of confirmation display
				var numberOfConfirmationsDisplay = self.getDisplay().find("div.transactionInformation").find("span.numberOfConfirmations");
				
				// Check if number of confirmations display exists and transaction exists
				if(numberOfConfirmationsDisplay["length"] !== 0 && self.transaction !== TransactionSection.NO_TRANSACTION) {
				
					// Check if transaction isn't expired and canceled
					if(self.transaction.getExpired() === false && self.transaction.getCanceled() === false) {
					
						// Check if transaction's status is unknown
						if(self.transaction.getStatus() === Transaction.UNKNOWN_STATUS) {
						
							// Check if transaction's amount was released
							if(self.transaction.getAmountReleased() === true) {
							
								// Check if transaction's height is known
								if(self.transaction.getHeight() !== Transaction.UNKNOWN_HEIGHT) {
								
									// Check if node isn't synced or height is less than the transaction's height
									if(height.isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true || height.isLessThan(self.transaction.getHeight()) === true) {
									
										// Replace number of confirmations display
										numberOfConfirmationsDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "numberOfConfirmations"));
									}
									
									// Otherwise
									else {
							
										// Replace number of confirmations display
										numberOfConfirmationsDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$s", [height.minus(self.transaction.getHeight()).plus(1).toFixed()], "numberOfConfirmations contextMenu"));
									}
								}
							}
						}
						
						// Otherwise check if transaction's status isn't unconfirmed
						else if(self.transaction.getStatus() !== Transaction.STATUS_UNCONFIRMED) {
						
							// Check if transaction's height is known
							if(self.transaction.getHeight() !== Transaction.UNKNOWN_HEIGHT) {
							
								// Check if node isn't synced or height is less than the transaction's height
								if(height.isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true || height.isLessThan(self.transaction.getHeight()) === true) {
								
									// Replace number of confirmations display
									numberOfConfirmationsDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "numberOfConfirmations"));
								}
								
								// Otherwise
								else {
						
									// Replace number of confirmations display
									numberOfConfirmationsDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$s", [height.minus(self.transaction.getHeight()).plus(1).toFixed()], "numberOfConfirmations contextMenu"));
								}
							}
						}
					}
				}
			
			// Node connection warning or connection close event
			}).on(Node.CONNECTION_WARNING_EVENT + " " + Node.CONNECTION_CLOSE_EVENT, function() {
			
				// Get number of confirmation display
				var numberOfConfirmationsDisplay = self.getDisplay().find("div.transactionInformation").find("span.numberOfConfirmations");
				
				// Check if number of confirmations display exists and transaction exists
				if(numberOfConfirmationsDisplay["length"] !== 0 && self.transaction !== TransactionSection.NO_TRANSACTION) {
				
					// Check if transaction isn't expired and canceled
					if(self.transaction.getExpired() === false && self.transaction.getCanceled() === false) {
					
						// Check if transaction's status is unknown
						if(self.transaction.getStatus() === Transaction.UNKNOWN_STATUS) {
						
							// Check if transaction's amount was released
							if(self.transaction.getAmountReleased() === true) {
							
								// Replace number of confirmations display
								numberOfConfirmationsDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "numberOfConfirmations"));
							}
						}
						
						// Otherwise check if transaction's status isn't unconfirmed
						else if(self.transaction.getStatus() !== Transaction.STATUS_UNCONFIRMED) {
						
							// Replace number of confirmations display
							numberOfConfirmationsDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "numberOfConfirmations"));
						}
					}
				}
			});
			
			// When recorded value display on language change event
			$(document).on(Language.CHANGE_EVENT, "main > div.unlocked > div > div > div.sections > div > div.transaction > div > div > p > span.whenRecordedValue", function() {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Update when recorded values
					self.updateWhenRecordedValues();
				}
			
			// Copy click and touch end event
			}).on("click touchend", "main > div.unlocked > div > div > div.sections > div > div.transaction > div > div > p > span.copy", function(event) {
			
				// Check if event is touch end
				if("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") {
				
					// Check if address copy isn't under the touch area
					var changedTouch = event["originalEvent"]["changedTouches"][0];
					if(this !== document.elementFromPoint(changedTouch["clientX"], changedTouch["clientY"])) {
					
						// Return
						return;
					}
				}
				
				// Stop propagation
				event.stopPropagation();
				
				// Prevent showing messages
				self.getMessage().prevent();
				
				// Blur focus
				$(":focus").blur();
				
				// Disable unlocked
				self.getUnlocked().disable();
				
				// Get copy button
				var copyButton = $(this);
				
				// Show loading
				self.getApplication().showLoading();
				
				// Set that copy button is clicked
				copyButton.addClass("clicked");
				
				// Set timeout
				setTimeout(function() {
				
					// Blur copy button
					copyButton.blur();
				}, 0);
				
				// Set timeout
				setTimeout(function() {
				
					// Get value
					var value = copyButton.prev().text();
					
					// Get is raw data
					var isRawData = copyButton.prev().hasClass("rawData") === true;
				
					// Copy value to clipboard
					self.getClipboard().copy(value).then(function() {
					
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('Value Copied'), Message.createText(Language.getDefaultTranslation('The value was successfully copied to your clipboard.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the pasted value matches the following value when you paste it.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu" + ((isRawData === true) ? " rawData" : "") + "\">" + Common.htmlEncode(value) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak(), false, function() {
						
							// Hide loading
							self.getApplication().hideLoading();
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
						
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
						
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that copy button isn't clicked
								copyButton.removeClass("clicked");
								
								// Hide message
								self.getMessage().hide();
							}
						});
						
					// Catch errors
					}).catch(function(error) {
					
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('Copy Value Error'), Message.createText(Language.getDefaultTranslation('Copying the value to your clipboard failed.')), false, function() {
						
							// Hide loading
							self.getApplication().hideLoading();
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
						
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
						
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that copy button isn't clicked
								copyButton.removeClass("clicked");
								
								// Hide message
								self.getMessage().hide();
							}
						});
					});
				
				}, ("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") ? 0 : TransactionSection.COPY_VALUE_TO_CLIPBOARD_DELAY_MILLISECONDS);
			});
			
			// Check if get selection is supported
			if(typeof getSelection !== "undefined") {
			
				// Display copy event
				this.getDisplay().on("copy", function(event) {
				
					// Prevent default
					event.preventDefault();
					
					// Get selection without duplicate newlines
					var selection = Common.removeDuplicateNewlines(getSelection().toString());
					
					// Set clipboard data to the new selection
					event["originalEvent"]["clipboardData"].setData("text/plain", selection);
				});
			}
			
			// Rebroadcast transaction button click event
			this.getDisplay().find("button.rebroadcastTransaction").on("click", function() {
				
				// Get button
				var button = $(this);

				// Prevent showing messages
				self.getMessage().prevent();
				
				// Save focus and blur
				self.getFocus().save(true);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Disable unlocked
				self.getUnlocked().disable();
				
				// Show loading
				self.getApplication().showLoading();
				
				// Set that button is loading
				button.addClass("loading");
				
				// Show rebroadcast transaction error
				var showRebroadcastTransactionError = function(message) {
				
					// Show message and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Rebroadcast Error'), message, false, function() {
					
						// Hide loading
						self.getApplication().hideLoading();
						
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Set that button isn't loading
							button.removeClass("loading");
							
							// Enable unlocked
							self.getUnlocked().enable();
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.getFocus().restore(false);
							
							// Hide message
							self.getMessage().hide();
						}
					});
				};
				
				// Check if transaction is coinbase
				if(self.transaction.getIsCoinbase() === true) {
				
					// Show rebroadcast transaction error
					showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Coinbase transactions can\'t be rebroadcast.')));
				}
				
				// Otherwise check if transaction was received
				else if(self.transaction.getReceived() === true) {
				
					// Show rebroadcast transaction error
					showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Received transactions can\'t be rebroadcast.')));
				}
				
				// Otherwise check if transaction is canceled
				else if(self.transaction.getCanceled() === true) {
				
					// Show rebroadcast transaction error
					showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Canceled transactions can\'t be rebroadcast.')));
				}
				
				// Otherwise check if transaction is expired
				else if(self.transaction.getExpired() === true) {
				
					// Show rebroadcast transaction error
					showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Expired transactions can\'t be rebroadcast.')));
				}
				
				// Otherwise check if transaction hasn't been broadcast
				else if(self.transaction.getBroadcast() === false) {
				
					// Show rebroadcast transaction error
					showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Unbroadcast transactions can\'t be rebroadcast.')));
				}
				
				// Otherwise check if transaction is confirmed
				else if(self.transaction.getAmountReleased() === true) {
				
					// Show rebroadcast transaction error
					showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Confirmed transactions can\'t be rebroadcast.')));
				}
				
				// Otherwise check if transaction's rebroadcast message is unknown
				else if(self.transaction.getRebroadcastMessage() === Transaction.UNKNOWN_REBROADCAST_MESSAGE) {
				
					// Show rebroadcast transaction error
					showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('The transaction can\'t be rebroadcast.')));
				}
				
				// Otherwise
				else {
				
					// Prevent automatic lock
					self.getAutomaticLock().prevent();
					
					// Set timeout
					setTimeout(function() {
				
						// Broadcast transaction to the node
						self.getNode().broadcastTransaction(JSONBigNumber.parse(self.transaction.getRebroadcastMessage())).then(function() {
						
							// Allow automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
							
								// Show message and allow showing messages
								self.getMessage().show(Language.getDefaultTranslation('Transaction Rebroadcast'), Message.createText(Language.getDefaultTranslation('The transaction was successfully rebroadcast.')), false, function() {
								
									// Hide loading
									self.getApplication().hideLoading();
								
								}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Check if message was displayed
									if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
										// Set that button isn't loading
										button.removeClass("loading");
										
										// Enable unlocked
										self.getUnlocked().enable();
										
										// Set that button isn't clicked
										button.removeClass("clicked");
										
										// Delete focus
										self.getFocus().delete();
										
										// Hide message
										self.getMessage().hide();
									}
								});
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Allow automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
						
								// Check if error contains a message
								if(Node.isMessageError(error) === true && error[Node.ERROR_RESPONSE_INDEX]["Err"]["Internal"]["length"] !== 0) {
								
									// Get is raw data
									var isRawData = Common.hasWhitespace(error[Node.ERROR_RESPONSE_INDEX]["Err"]["Internal"]) === false;
								
									// Show rebroadcast transaction error
									showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Rebroadcasting the transaction failed for the following reason.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu" + ((isRawData === true) ? " rawData" : "") + "\">" + Message.createText(Language.escapeText(error[Node.ERROR_RESPONSE_INDEX]["Err"]["Internal"])) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak());
								}
								
								// Otherwise check if error is a connection error
								else if(Array.isArray(error) === true && error[Node.ERROR_TYPE_INDEX] === Node.CONNECTION_ERROR) {
								
									// Show rebroadcast transaction error
									showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Rebroadcasting the transaction failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to rebroadcast transactions without being connected to a node.')));
								}
								
								// Otherwise
								else {
								
									// Show rebroadcast transaction error
									showRebroadcastTransactionError(Message.createText(Language.getDefaultTranslation('Rebroadcasting the transaction failed.')));
								}
							}
						});
					}, TransactionSection.REBROADCAST_TRANSACTION_DELAY_MILLISECONDS);
				}
			});
			
			// Get transaction file response button click event
			this.getDisplay().find("button.getTransactionFileResponse").on("click", function() {
				
				// Get button
				var button = $(this);

				// Prevent showing messages
				self.getMessage().prevent();
				
				// Save focus and blur
				self.getFocus().save(true);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Disable unlocked
				self.getUnlocked().disable();
				
				// Show loading
				self.getApplication().showLoading();
				
				// Set that button is loading
				button.addClass("loading");
				
				// Show get transaction file response error
				var showGetTransactionFileResponseError = function(message) {
				
					// Show message and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Get File Response Error'), Message.createText(message), false, function() {
					
						// Hide loading
						self.getApplication().hideLoading();
						
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Set that button isn't loading
							button.removeClass("loading");
							
							// Enable unlocked
							self.getUnlocked().enable();
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.getFocus().restore(false);
							
							// Hide message
							self.getMessage().hide();
						}
					});
				};
				
				// Check if transaction is coinbase
				if(self.transaction.getIsCoinbase() === true) {
				
					// Show get transaction file response error
					showGetTransactionFileResponseError(Language.getDefaultTranslation('Coinbase transactions don\'t have a file response.'));
				}
				
				// Otherwise check if transaction was sent
				else if(self.transaction.getReceived() === false) {
				
					// Show get transaction file response error
					showGetTransactionFileResponseError(Language.getDefaultTranslation('Sent transactions don\'t have a file response.'));
				}
				
				// Otherwise check if transaction's file response doesn't exist
				else if(self.transaction.getFileResponse() === Transaction.UNUSED_FILE_RESPONSE) {
				
					// Show get transaction file response error
					showGetTransactionFileResponseError(Language.getDefaultTranslation('The transaction doesn\'t have a file response or its file response isn\'t known.'));
				}
				
				// Otherwise
				else {
				
					// Prevent automatic lock
					self.getAutomaticLock().prevent();
					
					// Set timeout
					setTimeout(function() {
					
						// Set file name
						var fileName = ((self.transaction.getId() !== Transaction.UNKNOWN_ID && self.transaction.getId() !== Transaction.UNUSED_ID) ? self.transaction.getId().serialize() : "transaction") + ".response";
					
						// Save transaction's file response
						Common.saveFile(fileName, self.transaction.getFileResponse());
					
						// Allow automatic lock
						self.getAutomaticLock().allow();
						
						// Check if automatic lock isn't locking
						if(self.getAutomaticLock().isLocking() === false) {
					
							// Set that button isn't loading
							button.removeClass("loading");
							
							// Hide loading
							self.getApplication().hideLoading();
							
							// Enable unlocked
							self.getUnlocked().enable();
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Delete focus
							self.getFocus().delete();
							
							// Allow showing messages
							self.getMessage().allow();
						}
					}, TransactionSection.GET_TRANSACTION_FILE_RESPONSE_DELAY_MILLISECONDS);
				}
			});
			
			// Cancel transaction button click event
			this.getDisplay().find("button.cancelTransaction").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");

				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Cancel'), Message.createText(Language.getDefaultTranslation('Are you sure you want to cancel transaction %1$s?'), [self.transactionIndex.toFixed()]), false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if canceling transaction
						if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
						
							// Prevent showing messages
							self.getMessage().prevent();
						
							// Show loading
							self.getApplication().showLoading();
						
							// Set that message second button is loading
							self.getMessage().setButtonLoading(Message.SECOND_BUTTON);
							
							// Prevent automatic lock
							self.getAutomaticLock().prevent();
							
							// Set timeout
							setTimeout(function() {
							
								// Cancel transaction
								self.getWallets().cancelTransaction(self.walletKeyPath, self.transactionKeyPath).then(function() {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
									
										// Show message immediately and allow showing messages
										self.getMessage().show(Language.getDefaultTranslation('Transaction Canceled'), Message.createText(Language.getDefaultTranslation('The transaction was successfully canceled.')), true, function() {
										
											// Hide loading
											self.getApplication().hideLoading();
										
										}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
										
											// Check if message was displayed
											if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
											
												// Enable unlocked
												self.getUnlocked().enable();
												
												// Set that button isn't clicked
												button.removeClass("clicked");
												
												// Delete focus
												self.getFocus().delete();
												
												// Hide message
												self.getMessage().hide();
											}
										});
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
								
										// Show message immediately and allow showing messages
										self.getMessage().show(Language.getDefaultTranslation('Cancel Error'), Message.createText(error), true, function() {
										
											// Hide loading
											self.getApplication().hideLoading();
										
										}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
										
											// Check if message was displayed
											if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
										
												// Enable unlocked
												self.getUnlocked().enable();
												
												// Set that button isn't clicked
												button.removeClass("clicked");
												
												// Restore focus and don't blur
												self.getFocus().restore(false);
												
												// Hide message
												self.getMessage().hide();
											}
										});
									}
								});
							}, TransactionSection.CANCEL_TRANSACTION_DELAY_MILLISECONDS);
						}
						
						// Otherwise
						else {
						
							// Enable unlocked
							self.getUnlocked().enable();
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.getFocus().restore(false);
							
							// Hide message
							self.getMessage().hide();
						}
					}
				});
			});
		}
		
		// Get name
		getName() {
		
			// Return name
			return TransactionSection.NAME;
		}
		
		// Reset
		reset() {
		
			// Turn off transaction section shown event
			$(this).off(Section.SHOWN_EVENT + ".transactionSection");
		
			// Check if initialize database transaction exists
			if(this.initializeDatabaseTransaction !== TransactionSection.NO_INITIALIZE_DATABASE_TRANSACTION) {
			
				// Set self
				var self = this;
				
				// Abort initialize database transaction and catch errors
				Database.abortTransaction(this.initializeDatabaseTransaction).catch(function(error) {
				
				// Finally
				}).finally(function() {
				
					// Set initialize database transaction to no initialize database transaction
					self.initializeDatabaseTransaction = TransactionSection.NO_INITIALIZE_DATABASE_TRANSACTION;
				});
			}
		
			// Reset
			super.reset();
			
			// Remove navigation display's transaction index
			this.navigationDisplay.find("h2").remove();
			
			// Clear transaction information display
			this.getDisplay().find("div.transactionInformation").empty();
			
			// Clear payment proof display
			this.getDisplay().find("div.paymentProof").empty();
			
			// Set that buttons aren't clicked or loading
			this.getDisplay().find("button").removeClass("clicked loading");
		}
		
		// Get state
		getState() {
		
			// Get state
			var state = super.getState();
			
			// Set state's wallet key path
			state[TransactionSection.STATE_WALLET_KEY_PATH_NAME] = this.walletKeyPath;
			
			// Set state's transaction key path
			state[TransactionSection.STATE_TRANSACTION_KEY_PATH_NAME] = this.transactionKeyPath;
			
			// Set state's transaction index
			state[TransactionSection.STATE_TRANSACTION_INDEX_NAME] = this.transactionIndex;
			
			// Return state
			return state;
		}
		
		// Name
		static get NAME() {
		
			// Return name
			return "Transaction";
		}
		
		// State wallet key path name
		static get STATE_WALLET_KEY_PATH_NAME() {
		
			// Return state wallet key path name
			return WalletSection.STATE_WALLET_KEY_PATH_NAME;
		}
		
		// State transaction key path name
		static get STATE_TRANSACTION_KEY_PATH_NAME() {
		
			// Return state transaction key path name
			return "Transaction Key Path";
		}
		
		// State transaction index name
		static get STATE_TRANSACTION_INDEX_NAME() {
		
			// Return state transaction index name
			return "Transaction Index";
		}
	
	// Private
		
		// Initialize
		initialize(state) {
			
			// Set base class initialize
			var baseClassInitialize = super.initialize(state);
			
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return initializing base class
				return baseClassInitialize.then(function() {
				
					// Set wallet key path to value in state
					self.walletKeyPath = state[TransactionSection.STATE_WALLET_KEY_PATH_NAME];
					
					// Set transaction key path to value in state
					self.transactionKeyPath = state[TransactionSection.STATE_TRANSACTION_KEY_PATH_NAME];
					
					// Set transaction index to value in state
					self.transactionIndex = state[TransactionSection.STATE_TRANSACTION_INDEX_NAME];
					
					// Return creating a database transaction to prevent transactions from changing
					return Database.createTransaction(Transactions.OBJECT_STORE_NAME, Database.READ_MODE, Database.RELAXED_DURABILITY, false).then(function(databaseTransaction) {
					
						// Set initialize database transaction
						self.initializeDatabaseTransaction = databaseTransaction;
						
						// Return getting transactions
						return self.getTransactions().getTransactions([self.transactionKeyPath], self.initializeDatabaseTransaction).then(function(transactions) {
						
							// Set transaction
							self.transaction = transactions[0];
							
							// Check if transaction doesn't exist
							if(self.transaction === Transactions.NO_TRANSACTION_FOUND) {
							
								// Set transaction to no transaction
								self.transaction = TransactionSection.NO_TRANSACTION;
							
								// Reject error
								reject(Language.getDefaultTranslation('The transaction doesn\'t exist.'));
							}
							
							// Otherwise
							else {
							
								// Show transaction index in the navigation display
								self.navigationDisplay.children("button").first().after(Language.createTranslatableContainer("<h2>", Language.getDefaultTranslation('Transaction %1$s'), [self.transactionIndex.toFixed()]));
							
								// Update transaction display
								self.updateTransactionDisplay(false);
								
								// Transaction section shown event
								$(self).one(Section.SHOWN_EVENT + ".transactionSection", function() {
								
									// Update when recorded values
									self.updateWhenRecordedValues();
									
									// Trigger resize event
									$(window).trigger("resize");
								
									// Commit initialize database transaction and catch errors
									Database.commitTransaction(self.initializeDatabaseTransaction).catch(function(error) {
									
									// Finally
									}).finally(function() {
									
										// Set initialize database transaction to no initialize database transaction
										self.initializeDatabaseTransaction = WalletSection.NO_INITIALIZE_DATABASE_TRANSACTION;
									});
								});
						
								// Resolve
								resolve();
							}
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(Language.getDefaultTranslation('The database failed.'));
					});
				
				// Reject error
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Get initialize error header
		getInitializeErrorHeader() {
		
			// Return initialize error header
			return Language.getDefaultTranslation('Transaction Error');
		}
		
		// Update transaction display
		updateTransactionDisplay(preserveScrollPosition = true) {
		
			// Save scroll position
			var scrollPosition = this.getDisplay().scrollTop();
			
			// Get transaction information display
			var transactionInformationDisplay = this.getDisplay().find("div.transactionInformation");
			
			// Set focus on kernel excess display
			var focusOnKernelExcessDisplay = transactionInformationDisplay.find("span.kernelExcess").find(":focus")["length"] !== 0;
			
			// Set focus on output commit display
			var focusOnOutputCommitDisplay = transactionInformationDisplay.find("span.outputCommit").find(":focus")["length"] !== 0;
		
			// Clear transaction information display
			transactionInformationDisplay.empty();
			
			// Check if transaction is a coinbase transaction
			if(this.transaction.getIsCoinbase() === true) {
			
				// Add type to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Type:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Coinbase')], "contextMenu") + "</p>");
			}
			
			// Otherwise
			else {
			
				// Add type to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Type:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [(this.transaction.getReceived() === true) ? Language.getDefaultTranslation('Received') : Language.getDefaultTranslation('Sent')], "contextMenu") + "</p>");
			}
			
			// Check if transaction is expired or canceled
			if(this.transaction.getExpired() === true || this.transaction.getCanceled() === true) {
			
				// Add status to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Status:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [(this.transaction.getCanceled() === true) ? Language.getDefaultTranslation('Canceled') : Language.getDefaultTranslation('Expired')], "contextMenu") + "</p>");
				
				// Add number of confirmations to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')], "numberOfConfirmations") + "</p>");
			}
			
			// Otherwise check if transaction's status is unknown
			else if(this.transaction.getStatus() === Transaction.UNKNOWN_STATUS) {
			
				// Add status to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Status:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [(this.transaction.getAmountReleased() === false) ? Language.getDefaultTranslation('Unconfirmed') : Language.getDefaultTranslation('Confirmed')], "contextMenu") + "</p>");
				
				// Check if transaction's amount was released
				if(this.transaction.getAmountReleased() === true) {
				
					// Get current height
					var currentHeight = this.getNode().getCurrentHeight().getHeight();
					
					// Check if current height is unknown, transaction's height is unknown, the node isn't synced, or current height is less than the transaction's height
					if(currentHeight === Node.UNKNOWN_HEIGHT || this.transaction.getHeight() === Transaction.UNKNOWN_HEIGHT || currentHeight.isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true || currentHeight.isLessThan(this.transaction.getHeight()) === true) {
					
						// Add number of confirmations to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "numberOfConfirmations") + "</p>");
					}
					
					// Otherwise
					else {
				
						// Add number of confirmations to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [currentHeight.minus(this.transaction.getHeight()).plus(1).toFixed()], "numberOfConfirmations contextMenu") + "</p>");
					}
				}
				
				// Otherwise
				else {
				
					// Add number of confirmations to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')], "numberOfConfirmations") + "</p>");
				}
			}
			
			// Otherwise
			else {
			
				// Check if transaction's amount was released
				if(this.transaction.getAmountReleased() === true) {
				
					// Add status to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Status:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Spendable')], "contextMenu") + "</p>");
				}
				
				// Otherwise
				else {
			
					// Add status to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Status:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [(this.transaction.getStatus() === Transaction.STATUS_UNCONFIRMED) ? Language.getDefaultTranslation('Unconfirmed') : Language.getDefaultTranslation('Confirmed')], "contextMenu") + "</p>");
				}
				
				// Check if transaction's status isn't unconfirmed
				if(this.transaction.getStatus() !== Transaction.STATUS_UNCONFIRMED) {
				
					// Get current height
					var currentHeight = this.getNode().getCurrentHeight().getHeight();
					
					// Check if current height is unknown, transaction's height is unknown, the node isn't synced, or current height is less than the transaction's height
					if(currentHeight === Node.UNKNOWN_HEIGHT || this.transaction.getHeight() === Transaction.UNKNOWN_HEIGHT || currentHeight.isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true || currentHeight.isLessThan(this.transaction.getHeight()) === true) {
					
						// Add number of confirmations to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "numberOfConfirmations") + "</p>");
					}
					
					// Otherwise
					else {
				
						// Add number of confirmations to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [currentHeight.minus(this.transaction.getHeight()).plus(1).toFixed()], "numberOfConfirmations contextMenu") + "</p>");
					}
				}
				
				// Otherwise
				else {
				
					// Add number of confirmations to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')], "numberOfConfirmations") + "</p>");
				}
			}
			
			// Create amount display
			var amountDisplay = $("<p class=\"currency\">" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
			
			// Append transaction's amount to amount display
			amountDisplay.append(Language.createTranslatableContainer("<span>", "%1$c", [
				[
			
					// Amount
					this.transaction.getAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
					
					// Currency
					Consensus.CURRENCY_NAME,
					
					// Display value
					true
				]
			], "contextMenu"));
		
			// Add amount display to transaction information display
			transactionInformationDisplay.append(amountDisplay);
			
			// Check if prices are enabled
			if(this.getPrices().enablePrice === true) {
			
				// Check if transaction's prices when recorded is unknown
				if(this.transaction.getPricesWhenRecorded() === Transaction.UNKNOWN_PRICES_WHEN_RECORDED) {
				
					// Add amount's value when recorded to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
				}
				
				// Otherwise check if transaction's prices when recorded isn't used
				else if(this.transaction.getPricesWhenRecorded() === Transaction.UNUSED_PRICES_WHEN_RECORDED) {
				
					// Add amount's value when recorded to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
				}
				
				// Otherwise
				else {
				
					// Get currency
					var currency = this.getUnlocked().getDisplayedCurrency();
					
					// Get price in the currency when the transaction was recorded
					var price = this.getPrices().getPrice(currency, this.transaction.getPricesWhenRecorded());
					
					// Check if price doesn't exist
					if(price === Prices.NO_PRICE_FOUND) {
					
						// Add amount's value when recorded to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "whenRecordedValue amount") + "</p>");
					}
					
					// Otherwise
					else {
					
						// Create amount's value when recorded display
						var amountsValueWhenRecordedDisplay = $("<p class=\"currency\">" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
						
						// Append transaction's amount's value to amount's value when recorded display
						amountsValueWhenRecordedDisplay.append(Language.createTranslatableContainer("<span>", "%1$c", [
							[
						
								// Value
								this.transaction.getAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).multipliedBy(price).toFixed(),
								
								// Currency
								currency
							]
						], "whenRecordedValue amount contextMenu"));
						
						// Add amount's value when recorded display to transaction information display
						transactionInformationDisplay.append(amountsValueWhenRecordedDisplay);
					}
				}
			}
			
			// Check if transaction's fee is unknown and transaction isn't a coinbase transaction
			if(this.transaction.getFee() === Transaction.UNKNOWN_FEE && this.transaction.getIsCoinbase() === false) {
			
				// Add fee to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
				
				// Check if prices are enabled
				if(this.getPrices().enablePrice === true) {
				
					// Add fee's value when recorded to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
				}
			}
			
			// Otherwise check if transaction's fee doesn't exist or transaction is a coinbase transaction
			else if(this.transaction.getFee() === Transaction.NO_FEE || this.transaction.getIsCoinbase() === true) {
			
				// Add fee to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
				
				// Check if prices are enabled
				if(this.getPrices().enablePrice === true) {
				
					// Add fee's value when recorded to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
				}
			}
			
			// Otherwise
			else {
			
				// Create fee display
				var feeDisplay = $("<p class=\"currency\">" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's fee to fee display
				feeDisplay.append(Language.createTranslatableContainer("<span>", "%1$c", [
					[
				
						// Amount
						this.transaction.getFee().dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
						
						// Currency
						Consensus.CURRENCY_NAME,
					
						// Display value
						true
					]
				], "contextMenu"));
			
				// Add fee display to transaction information display
				transactionInformationDisplay.append(feeDisplay);
				
				// Check if prices are enabled
				if(this.getPrices().enablePrice === true) {
				
					// Check if transaction's prices when recorded is unknown
					if(this.transaction.getPricesWhenRecorded() === Transaction.UNKNOWN_PRICES_WHEN_RECORDED) {
					
						// Add fee's value when recorded to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
					}
					
					// Otherwise check if transaction's prices when recorded isn't used
					else if(this.transaction.getPricesWhenRecorded() === Transaction.UNUSED_PRICES_WHEN_RECORDED) {
					
						// Add fee's value when recorded to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
					}
					
					// Otherwise
					else {
					
						// Check if price doesn't exist
						if(price === Prices.NO_PRICE_FOUND) {
						
							// Add fee's value when recorded to transaction information display
							transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "whenRecordedValue fee") + "</p>");
						}
						
						// Otherwise
						else {
						
							// Create fee's value when recorded display
							var feesValueWhenRecordedDisplay = $("<p class=\"currency\">" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Fee\'s value when recorded:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
							
							// Append transaction's fee's value to fee's value when recorded display
							feesValueWhenRecordedDisplay.append(Language.createTranslatableContainer("<span>", "%1$c", [
								[
							
									// Value
									this.transaction.getFee().dividedBy(Consensus.VALUE_NUMBER_BASE).multipliedBy(price).toFixed(),
									
									// Currency
									currency
								]
							], "whenRecordedValue fee contextMenu"));
							
							// Add fee's value when recorded display to transaction information display
							transactionInformationDisplay.append(feesValueWhenRecordedDisplay);
						}
					}
				}
			}
			
			// Check if transaction was sent
			if(this.transaction.getReceived() === false) {
			
				// Check if transaction wasn't confirmed
				if(this.transaction.getAmountReleased() === false) {
				
					// Add confirmed height to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
				}
				
				// Otherwise check if transaction's height is unknown
				else if(this.transaction.getHeight() === Transaction.UNKNOWN_HEIGHT) {
				
					// Add confirmed height to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
				}
				
				// Otherwise
				else {
				
					// Add confirmed height to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [this.transaction.getHeight().toFixed()], "contextMenu") + "</p>");
				}
			}
			
			// Otherwise
			else {
			
				// Check if transaction's is unconfirmed
				if(this.transaction.getStatus() === Transaction.STATUS_UNCONFIRMED) {
				
					// Add confirmed height to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
				}
				
				// Otherwise check if transaction's height is unknown
				else if(this.transaction.getHeight() === Transaction.UNKNOWN_HEIGHT) {
				
					// Add confirmed height to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
				}
				
				// Otherwise
				else {
				
					// Add confirmed height to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [this.transaction.getHeight().toFixed()], "contextMenu") + "</p>");
				}
			}
			
			// Check if transaction's lock height is unknown and transaction isn't a coinbase transaction
			if(this.transaction.getLockHeight() === Transaction.UNKNOWN_LOCK_HEIGHT && this.transaction.getIsCoinbase() === false) {
			
				// Add lock height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Lock height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Check if transaction's lock height doesn't exist or transaction is a coinbase transaction
			else if(this.transaction.getLockHeight() === Transaction.NO_LOCK_HEIGHT || this.transaction.getIsCoinbase() === true) {
			
				// Add lock height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Lock height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Add lock height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Lock height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [this.transaction.getLockHeight().toFixed()], "contextMenu") + "</p>");
			}
			
			// Check if transaction's time to live cut off height is unknown and transaction isn't a coinbase transaction
			if(this.transaction.getTimeToLiveCutOffHeight() === Transaction.UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT && this.transaction.getIsCoinbase() === false) {
			
				// Add time to live cut off height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Expire height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Check if transaction's time to live cut off height doesn't exist or transaction is a coinbase transaction
			else if(this.transaction.getTimeToLiveCutOffHeight() === Transaction.NO_TIME_TO_LIVE_CUT_OFF_HEIGHT || this.transaction.getIsCoinbase() === true) {
			
				// Add time to live cut off height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Expire height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Add time to live cut off height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Expire height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [this.transaction.getTimeToLiveCutOffHeight().toFixed()], "contextMenu") + "</p>");
			}
			
			// Check if transaction was sent
			if(this.transaction.getReceived() === false) {
			
				// Add required number of confirmations to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Required number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Check if transaction's required number of confirmations is unknown
				if(this.transaction.getRequiredNumberOfConfirmations() === Transaction.UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS) {
				
					// Check if transaction is a coinbase transaction
					if(this.transaction.getIsCoinbase() === true) {
					
						// Add required number of confirmations to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Required number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [Consensus.COINBASE_MATURITY.toFixed()], "contextMenu") + "</p>");
					}
					
					// Otherwise
					else {
				
						// Add required number of confirmations to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Required number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
					}
				}
				
				// Otherwise
				else {
				
					// Add required number of confirmations to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Required number of confirmations:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [(this.transaction.getIsCoinbase() === false || this.transaction.getRequiredNumberOfConfirmations().isGreaterThan(Consensus.COINBASE_MATURITY) === true) ? this.transaction.getRequiredNumberOfConfirmations().toFixed() : Consensus.COINBASE_MATURITY.toFixed()], "contextMenu") + "</p>");
				}
			}
			
			// Check if transaction was received and it's not confirmed or transaction was sent
			if((this.transaction.getReceived() === true && this.transaction.getStatus() === Transaction.STATUS_UNCONFIRMED) || this.transaction.getReceived() === false) {
			
				// Add spendable height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Spendable height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise heck if transaction's spendable height is unknown
			else if(this.transaction.getSpendableHeight() === Transaction.UNKNOWN_SPENDABLE_HEIGHT) {
			
				// Add spendable height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Spendable height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Add spendable height to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Spendable height:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$s", [this.transaction.getSpendableHeight().toFixed()], "contextMenu") + "</p>");
			}
			
			// Check if transaction is a coinbase transaction
			if(this.transaction.getIsCoinbase() === true) {
			
				// Add ID to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('ID:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise check if transaction's ID is unknown
			else if(this.transaction.getId() === Transaction.UNKNOWN_ID) {
			
				// Add ID to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('ID:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Create ID display
				var idDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('ID:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's ID to ID display
				idDisplay.append("<span class=\"rawData contextMenu\">" + Common.htmlEncode(this.transaction.getId().serialize()) + "</span>");
				
				// Append copy to ID display
				idDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
			
				// Add ID display to transaction information display
				transactionInformationDisplay.append(idDisplay);
			}
			
			// Check if transaction was received, transaction is a coinbase transaction, or transaction's destination isn't used
			if(this.transaction.getReceived() === true || this.transaction.getIsCoinbase() === true || this.transaction.getDestination() === Transaction.UNUSED_DESTINATION) {
			
				// Add destination to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Destination:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise check if transaction's destination is unknown
			else if(this.transaction.getDestination() === Transaction.UNKNOWN_DESTINATION) {
			
				// Add destination to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Destination:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Create destination display
				var destinationDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Destination:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's destination to destination display
				destinationDisplay.append("<span class=\"rawData contextMenu\">" + Common.htmlEncode(this.transaction.getDestination()) + "</span>");
				
				// Append copy to destination display
				destinationDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
			
				// Add destination display to transaction information display
				transactionInformationDisplay.append(destinationDisplay);
			}
			
			// Check if transaction's kernel excess is unknown
			if(this.transaction.getKernelExcess() === Transaction.UNKNOWN_KERNEL_EXCESS) {
			
				// Add kernel excess to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Kernel excess:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Otherwise check if explorer kernel excess URL doesn't exist
			else if(Consensus.EXPLORER_KERNEL_EXCESS_URL === Consensus.NO_EXPLORER_URL) {
			
				// Create kernel excess display
				var kernelExcessDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Kernel excess:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's kernel excess to kernel excess display
				kernelExcessDisplay.append("<span class=\"rawData contextMenu\">" + Common.htmlEncode(Common.toHexString(this.transaction.getKernelExcess())) + "</span>");
				
				// Append copy to kernel excess display
				kernelExcessDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
				
				// Add kernel excess display to transaction information display
				transactionInformationDisplay.append(kernelExcessDisplay);
			}
			
			// Otherwise
			else {
			
				// Create kernel excess display
				var kernelExcessDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Kernel excess:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's kernel excess to kernel excess display
				kernelExcessDisplay.append(Language.createTranslatableContainer("<span>", "%1$m", [
					[
						// Kernel excess
						Common.toHexString(this.transaction.getKernelExcess()),
						
						// URL
						Consensus.EXPLORER_KERNEL_EXCESS_URL + encodeURIComponent(Common.toHexString(this.transaction.getKernelExcess())),
						
						// Is external
						true,
						
						// Is blob
						false
					]
				], "kernelExcess rawData"));
				
				// Append copy to kernel excess display
				kernelExcessDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
				
				// Add kernel excess display to transaction information display
				transactionInformationDisplay.append(kernelExcessDisplay);
			}
			
			// Check if transaction was sent
			if(this.transaction.getReceived() === false) {
			
				// Add output commit to transaction information display
				transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Output commitment:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Check if transaction's commit is unused
				if(this.transaction.getCommit() === Transaction.UNUSED_COMMIT) {
				
					// Add output commit to transaction information display
					transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Output commitment:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
				}
				
				// Otherwise check if explorer output commitment URL doesn't exist
				else if(Consensus.EXPLORER_OUTPUT_COMMITMENT_URL === Consensus.NO_EXPLORER_URL) {
				
					// Create output commit display
					var outputCommitDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Output commitment:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
					
					// Append transaction's output commit to output commit display
					outputCommitDisplay.append("<span class=\"rawData contextMenu\">" + Common.htmlEncode(Common.toHexString(this.transaction.getCommit())) + "</span>");
					
					// Append copy to output commit display
					outputCommitDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
					
					// Add output commit display to transaction information display
					transactionInformationDisplay.append(outputCommitDisplay);
				}
				
				// Otherwise
				else {
				
					// Create output commit display
					var outputCommitDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Output commitment:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
					
					// Append transaction's output commit to output commit display
					outputCommitDisplay.append(Language.createTranslatableContainer("<span>", "%1$m", [
						[
							// Output commit
							Common.toHexString(this.transaction.getCommit()),
							
							// URL
							Consensus.EXPLORER_OUTPUT_COMMITMENT_URL + encodeURIComponent(Common.toHexString(this.transaction.getCommit())),
							
							// Is external
							true,
							
							// Is blob
							false
						]
					], "outputCommit rawData"));
					
					// Append copy to output commit display
					outputCommitDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
					
					// Add output commit display to transaction information display
					transactionInformationDisplay.append(outputCommitDisplay);
				}
			}
			
			// Add recorded timestamp to transaction information display
			transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Recorded time:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$d at %2$t'), [
			
				// Recorded timestamp
				(this.transaction.getRecordedTimestamp() / Common.MILLISECONDS_IN_A_SECOND).toFixed(),
				
				// Recorded timestamp
				(this.transaction.getRecordedTimestamp() / Common.MILLISECONDS_IN_A_SECOND).toFixed()
				
			], "contextMenu") + "</p>");
			
			// Check wallet type
			switch(Consensus.getWalletType()) {
			
				// MWC or EPIC wallet
				case Consensus.MWC_WALLET_TYPE:
				case Consensus.EPIC_WALLET_TYPE:
			
					// Check if transaction's message is unknown and transaction isn't a coinbase transaction
					if(this.transaction.getMessage() === Transaction.UNKNOWN_MESSAGE && this.transaction.getIsCoinbase() === false) {
					
						// Add message to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Message:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
					}
					
					// Otherwise check if transaction's message is doesn't exist, transaction is a coinbase transaction, or transaction message is empty
					else if(this.transaction.getMessage() === Transaction.NO_MESSAGE || this.transaction.getIsCoinbase() === true || this.transaction.getMessage()["length"] === 0) {
					
						// Add message to transaction information display
						transactionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Message:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
					}
					
					// Otherwise
					else {
					
						// Create message display
						var messageDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Message:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
						
						// Get is raw data
						var isRawData = Common.hasWhitespace(this.transaction.getMessage()) === false;
						
						// Append transaction's message to message display
						messageDisplay.append("<span class=\"" + ((isRawData === true) ? "rawData " : "") + "contextMenu\">" + Common.htmlEncode(this.transaction.getMessage()) + "</span>");
						
						// Append copy to message display
						messageDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
						
						// Add message display to transaction information display
						transactionInformationDisplay.append(messageDisplay);
					}
					
					// Break
					break;
			}
			
			// Get payment proof display
			var paymentProofDisplay = this.getDisplay().find("div.paymentProof");
			
			// Clear payment proof display
			paymentProofDisplay.empty();
			
			// Check if transaction's receiver address is unknown and transaction isn't a coinbase transaction
			if(this.transaction.getReceiverAddress() === Transaction.UNKNOWN_RECEIVER_ADDRESS && this.transaction.getIsCoinbase() === false) {
			
				// Add receiver proof address to payment proof display
				paymentProofDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Recipient payment proof address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Otherwise check if transaction's receiver address is doesn't exist or transaction is a coinbase transaction
			else if(this.transaction.getReceiverAddress() === Transaction.NO_RECEIVER_ADDRESS || this.transaction.getIsCoinbase() === true) {
			
				// Add receiver proof address to payment proof display
				paymentProofDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Recipient payment proof address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Create receiver proof address display
				var receiverproofAddressDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Recipient payment proof address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's receiver proof address to receiver proof address display
				receiverproofAddressDisplay.append("<span class=\"rawData contextMenu\">" + Common.htmlEncode(this.transaction.getReceiverAddress()) + "</span>");
				
				// Append copy to receiver proof address display
				receiverproofAddressDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
				
				// Add receiver proof address display to payment proof display
				paymentProofDisplay.append(receiverproofAddressDisplay);
			}
			
			// Check if transaction's receiver signature is unknown and transaction isn't a coinbase transaction
			if(this.transaction.getReceiverSignature() === Transaction.UNKNOWN_RECEIVER_SIGNATURE && this.transaction.getIsCoinbase() === false) {
			
				// Add receiver proof signature to payment proof display
				paymentProofDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Recipient payment proof signature:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Otherwise check if transaction's receiver signature is doesn't exist or transaction is a coinbase transaction
			else if(this.transaction.getReceiverSignature() === Transaction.NO_RECEIVER_SIGNATURE || this.transaction.getIsCoinbase() === true) {
			
				// Add receiver proof signature to payment proof display
				paymentProofDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Recipient payment proof signature:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Create receiver proof signature display
				var receiverproofSignatureDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Recipient payment proof signature:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's receiver proof signature to receiver proof signature display
				receiverproofSignatureDisplay.append("<span class=\"rawData contextMenu\">" + Common.htmlEncode(Common.toHexString(this.transaction.getReceiverSignature())) + "</span>");
				
				// Append copy to receiver proof signature display
				receiverproofSignatureDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
				
				// Add receiver proof signature display to payment proof display
				paymentProofDisplay.append(receiverproofSignatureDisplay);
			}
			
			// Check if transaction's sender address is unknown and transaction isn't a coinbase transaction
			if(this.transaction.getSenderAddress() === Transaction.UNKNOWN_SENDER_ADDRESS && this.transaction.getIsCoinbase() === false) {
			
				// Add sender proof address to payment proof display
				paymentProofDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Sender payment proof address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')]) + "</p>");
			}
			
			// Otherwise check if transaction's sender address is doesn't exist or transaction is a coinbase transaction
			else if(this.transaction.getSenderAddress() === Transaction.NO_SENDER_ADDRESS || this.transaction.getIsCoinbase() === true) {
			
				// Add sender proof address to payment proof display
				paymentProofDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Sender payment proof address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('N/A')]) + "</p>");
			}
			
			// Otherwise
			else {
			
				// Create sender proof address display
				var senderproofAddressDisplay = $("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Sender payment proof address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "</p>");
				
				// Append transaction's sender proof address to sender proof address display
				senderproofAddressDisplay.append("<span class=\"rawData contextMenu\">" + Common.htmlEncode(this.transaction.getSenderAddress()) + "</span>");
				
				// Append copy to sender proof address display
				senderproofAddressDisplay.append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true));
				
				// Add sender proof address display to payment proof display
				paymentProofDisplay.append(senderproofAddressDisplay);
			}
			
			// Check if focus on kernel excess display
			if(focusOnKernelExcessDisplay === true) {
			
				// Focus on kernel excess display
				transactionInformationDisplay.find("span.kernelExcess").find("a").focus();
			}
			
			// Otherwise check if focus on output commit display
			else if(focusOnOutputCommitDisplay === true) {
			
				// Focus on output commit display
				transactionInformationDisplay.find("span.outputCommit").find("a").focus();
			}
			
			// Check if preserving scroll position
			if(preserveScrollPosition === true) {
			
				// Restore scroll position
				this.getDisplay().scrollTop(scrollPosition);
			}
			
			// Check if unlocked is disabled
			if(this.getUnlocked().isDisabled() === true) {
			
				// Disable tabbing to everything in the display and disable everything in the display
				this.getDisplay().find("*").disableTab().disable();
			}
		}
		
		// Update when recorded values
		updateWhenRecordedValues() {
		
			// Check if prices are enabled
			if(this.getPrices().enablePrice === true) {
			
				// Get currency
				var currency = this.getUnlocked().getDisplayedCurrency();
				
				// Get price in the currency when the transaction was recorded
				var price = this.getPrices().getPrice(currency, this.transaction.getPricesWhenRecorded());
				
				// Set self
				var self = this;
				
				// Go through all when recorded value displays
				this.getDisplay().find("div.transactionInformation").find("span.whenRecordedValue").each(function() {
				
					// Get when recorded value display
					var whenRecordedValueDisplay = $(this);
					
					// Get when recorded value display's parent
					var parent = whenRecordedValueDisplay.parent();
					
					// Check if when recorded value display is for the transaction's amount
					if(whenRecordedValueDisplay.hasClass("amount") === true) {
					
						// Set extra class and amount
						var extraClass = "amount";
						var amount = self.transaction.getAmount();
					}
					
					// Otherwise heck if when recorded value display is for the transaction's fee
					else if(whenRecordedValueDisplay.hasClass("fee") === true) {
					
						// Set extra class and amount
						var extraClass = "fee";
						var amount = self.transaction.getFee();
					}
					
					// Otherwise
					else {
					
						// Go to next when recorded value displays
						return;
					}
					
					// Check if price doesn't exist
					if(price === Prices.NO_PRICE_FOUND) {
					
						// Replace when recorded value display
						whenRecordedValueDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$x", [Language.getDefaultTranslation('Unknown')], "whenRecordedValue " + extraClass));
						
						// Set that parent isn't displaying a currency
						parent.removeClass("currency");
					}
					
					// Otherwise
					else {
					
						// Replace when recorded value display
						whenRecordedValueDisplay.replaceWith(Language.createTranslatableContainer("<span>", "%1$c", [
							[
						
								// Value
								amount.dividedBy(Consensus.VALUE_NUMBER_BASE).multipliedBy(price).toFixed(),
								
								// Currency
								currency
							]
						], "whenRecordedValue " + extraClass + " contextMenu"));
						
						// Set that parent is displaying a currency
						parent.addClass("currency");
					}
				});
			}
		}
		
		// No transaction key path
		static get NO_TRANSACTION_KEY_PATH() {
		
			// Return no transaction key path
			return null;
		}
		
		// No transaction index
		static get NO_TRANSACTION_INDEX() {
		
			// Return no transaction index
			return null;
		}
		
		// No initialize database transaction
		static get NO_INITIALIZE_DATABASE_TRANSACTION() {
		
			// Return no initialize database transaction
			return null;
		}
		
		// No transaction
		static get NO_TRANSACTION() {
		
			// Return no transaction
			return null;
		}
		// Cancel transaction delay milliseconds
		static get CANCEL_TRANSACTION_DELAY_MILLISECONDS() {
		
			// Return cancel transaction delay milliseconds
			return 300;
		}
		
		// Rebroadcast transaction delay milliseconds
		static get REBROADCAST_TRANSACTION_DELAY_MILLISECONDS() {
		
			// Return rebroadcast transaction delay milliseconds
			return 300;
		}
		
		// Copy value to clipboard delay milliseconds
		static get COPY_VALUE_TO_CLIPBOARD_DELAY_MILLISECONDS() {
		
			// Return copy value to clipboard delay milliseconds
			return 175;
		}
		
		// Get transaction file response delay milliseconds
		static get GET_TRANSACTION_FILE_RESPONSE_DELAY_MILLISECONDS() {
		
			// Return get transaction file response delay milliseconds
			return 300;
		}
}


// Main function

// Set global object's transaction section
globalThis["TransactionSection"] = TransactionSection;
