// Use strict
"use strict";


// Classes

// Wallet section class
class WalletSection extends Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Delegate constructor
			super(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard);
			
			// Get navigation display
			this.navigationDisplay = this.getDisplay().find("div.navigation");
			
			// Get address display
			this.addressDisplay = this.getDisplay().find("div.address");
			
			// Get balance display
			this.balanceDisplay = this.getDisplay().find("div.balance");
			
			// Get transactions display
			this.transactionsDisplay = this.getDisplay().find("div.transactions");
			
			// Get transactions navigation display
			this.transactionsNavigationDisplay = this.getDisplay().find("div.transactionsNavigation");
			
			// Set wallet key path to no wallet key path
			this.walletKeyPath = WalletSection.NO_WALLET_KEY_PATH;
			
			// Set transactions group to the first group
			this.transactionsGroup = 0;
			
			// Set number of transactions to zero
			this.numberOfTransactions = 0;
			
			// Set newest transaction key path to no newest transaction key path
			this.newestTransactionKeyPath = WalletSection.NO_NEWEST_TRANSACTION_KEY_PATH;
			
			// Set initialize database transaction to no initialize database transaction
			this.initializeDatabaseTransaction = WalletSection.NO_INITIALIZE_DATABASE_TRANSACTION;
			
			// Set showing sync done to false
			this.showingSyncDone = false;
			
			// Set self
			var self = this;
			
			// Transactions change event
			$(this.getTransactions()).on(Transactions.CHANGE_EVENT, function(event, changedTransactions) {
			
				// Check if shown and wallet key path exists
				if(self.isShown() === true && self.walletKeyPath !== WalletSection.NO_WALLET_KEY_PATH) {
				
					// Create a database transaction to prevent transactions from changing
					Database.createTransaction(Transactions.OBJECT_STORE_NAME, Database.READ_MODE, Database.RELAXED_DURABILITY, false).then(function(databaseTransaction) {
				
						// Initialize number of new transactions
						var numberOfNewTransactions = 0;
						
						// Initialize current newest transaction key path
						var currentNewestTransactionKeyPath = WalletSection.NO_NEWEST_TRANSACTION_KEY_PATH;
						
						// Go through all changed transactions
						for(var i = 0; i < changedTransactions["length"]; ++i) {
						
							// Get changed transaction
							var changedTransaction = changedTransactions[i];
							
							// Check if changed transaction can be displayed and it's for the wallet
							if(changedTransaction.getDisplay() === true && changedTransaction.getWalletKeyPath() === self.walletKeyPath) {
							
								// Get transaction button
								var transactionButton = self.transactionsDisplay.find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + changedTransaction.getKeyPath().toFixed() + "\"]");
								
								// Check if transaction's button exists
								if(transactionButton["length"] !== 0) {
								
									// Create transaction button
									var button = self.createTransactionButton(changedTransaction);
									
									// Set button's name index
									button.find("span.name").find("span.index").replaceWith(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('#%1$s'), [transactionButton.attr(Common.DATA_ATTRIBUTE_PREFIX + "index")], "index"));
									
									// Replace transaction button's non-status name with the button's non-status name
									transactionButton.find("span.name").children("span:not(.status)").each(function() {
									
										$(this).replaceWith(button.find("span.name").children("span:not(.status)").first());
									});
									
									// Replace transaction button's totals and ID with the button's totals and ID
									transactionButton.find("span.totals").replaceWith(button.find("span.totals"));
									transactionButton.find("span.id").replaceWith(button.find("span.id"));
									
									// Replace transaction button's classes with the button's classes
									transactionButton.attr("class", button.attr("class"));
								}
								
								// Otherwise check if no newest transaction key path exists or the changed transaction is new
								else if(self.newestTransactionKeyPath === WalletSection.NO_NEWEST_TRANSACTION_KEY_PATH || changedTransaction.getKeyPath() > self.newestTransactionKeyPath) {
								
									// Increment number of new transactions
									++numberOfNewTransactions;
									
									// Check if changed transaction's key path is the current newest transaction key path
									if(currentNewestTransactionKeyPath === WalletSection.NO_NEWEST_TRANSACTION_KEY_PATH || changedTransaction.getKeyPath() > currentNewestTransactionKeyPath) {
									
										// Update current newest transaction key path
										currentNewestTransactionKeyPath = changedTransaction.getKeyPath();
									}
								}
							}
						}
						
						// Check if current newest transaction key path exists
						if(currentNewestTransactionKeyPath !== WalletSection.NO_NEWEST_TRANSACTION_KEY_PATH) {
						
							// Set newest transaction key path to the current newest transaction key path
							self.newestTransactionKeyPath = currentNewestTransactionKeyPath;
						}
						
						// Update number of transactions
						self.numberOfTransactions += numberOfNewTransactions;
						
						// Check if new transactions exist
						if(numberOfNewTransactions !== 0) {
						
							// Get the wallet's new display transactions in the group
							self.getTransactions().getWalletsDisplayTransactions(self.walletKeyPath, self.transactionsGroup * WalletSection.TRANSACTIONS_GROUP_SIZE, numberOfNewTransactions, databaseTransaction).then(function(newTransactions) {
							
								// Initialize buttons
								var buttons = [];
								
								// Go through all new transactions in ascending recorded timestamp up to a group amount
								for(var i = newTransactions["length"] - 1, j = 0; i >= 0 && j < WalletSection.TRANSACTIONS_GROUP_SIZE; --i, ++j) {
								
									// Get new transaction
									var newTransaction = newTransactions[i];
									
									// Create transaction button
									var button = self.createTransactionButton(newTransaction);
									
									// Hide button
									button.addClass("hide");
									
									// Get index
									var index = self.numberOfTransactions - self.transactionsGroup * WalletSection.TRANSACTIONS_GROUP_SIZE - i;
									
									// Set button's name index
									button.find("span.name").find("span.index").replaceWith(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('#%1$s'), [index.toFixed()], "index"));
									
									// Set button's index
									button.attr(Common.DATA_ATTRIBUTE_PREFIX + "index", index.toFixed());
									
									// Prepend button to transactions display
									self.transactionsDisplay.prepend(button);
									
									// Add button to list
									buttons.push(button);
								}
								
								// Remove transaction buttons if too many exist
								self.transactionsDisplay.find("button:gt(" + (WalletSection.TRANSACTIONS_GROUP_SIZE - 1).toFixed() + ")").remove();
								
								// Update transactions navigation buttons
								self.updateTransactionsNavigationButtons();
								
								// Check if transactions display is empty
								if(self.transactionsDisplay.hasClass("empty") === true) {
								
									// Hide no transactions display
									self.transactionsDisplay.next().addClass("hide");
									
									// Check if no transaction display is visible
									if(self.transactionsDisplay.next().is(":visible") === true) {
									
										// No transactions display transition end or timeout event
										self.transactionsDisplay.next().transitionEndOrTimeout(function() {
										
											// Check if shown
											if(self.isShown() === true) {
										
												// Show transactions display
												self.transactionsDisplay.removeClass("empty");
												
												// Set timeout
												setTimeout(function() {
												
													// Go through all buttons
													for(var i = 0; i < buttons["length"]; ++i) {
														
														// Get button
														var button = buttons[i];
													
														// Show button
														button.removeClass("hide");
													}
												}, 0);
											}
										}, "opacity");
									}
									
									// Otherwise
									else {
									
										// Show transactions display
										self.transactionsDisplay.removeClass("empty");
										
										// Set timeout
										setTimeout(function() {
										
											// Go through all buttons
											for(var i = 0; i < buttons["length"]; ++i) {
												
												// Get button
												var button = buttons[i];
											
												// Show button
												button.removeClass("hide");
											}
										}, 0);
									}
								}
								
								// Otherwise
								else {
								
									// Set timeout
									setTimeout(function() {
								
										// Go through all buttons
										for(var i = 0; i < buttons["length"]; ++i) {
											
											// Get button
											var button = buttons[i];
										
											// Show button
											button.removeClass("hide");
										}
									}, WalletSection.ADD_TRANSACTION_BUTTON_DELAY_MILLISECONDS);
								}
								
								// Commit database transaction and catch errors
								Database.commitTransaction(databaseTransaction).catch(function(error) {
								
								});
							
							// Catch errors
							}).catch(function(error) {
							
								// Abort database transaction and catch errors
								Database.abortTransaction(databaseTransaction).catch(function(error) {
								
								});
							});
						}
						
						// Otherwise
						else {
						
							// Commit database transaction and catch errors
							Database.commitTransaction(databaseTransaction).catch(function(error) {
							
							});
						}
					
					// Catch errors
					}).catch(function(error) {
					
					});
				}
			});
			
			// Section focus event
			$(this).on(Section.FOCUS_EVENT, function() {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Check if address display shows loading
					if(self.addressDisplay.hasClass("loading") === true) {
					
						// Blur address display's buttons
						self.addressDisplay.find("button").blur();
						
						// Set timeout
						setTimeout(function() {
						
							// Blur address display's buttons
							self.addressDisplay.find("button").blur();
						}, 0);
					}
				
					// Check if balance display shows syncing
					if(self.balanceDisplay.hasClass("syncing") === true) {
					
						// Blur balance display's buttons
						self.balanceDisplay.find("button").blur();
						
						// Set timeout
						setTimeout(function() {
						
							// Blur balance display's buttons
							self.balanceDisplay.find("button").blur();
						}, 0);
					}
					
					// Blur all disabled transactions navigation display buttons
					self.transactionsNavigationDisplay.find("button.disabled").blur();
					
					// Set timeout
					setTimeout(function() {
					
						// Blur all disabled transactions navigation display buttons
						self.transactionsNavigationDisplay.find("button.disabled").blur();
					}, 0);
				}
			});
			
			// Wallets change event
			$(document).on(Wallets.CHANGE_EVENT, function(event, walletKeyPath, change, newValue) {
			
				// Check if shown
				if(self.isShown() === true) {
			
					// Check if current wallet was changed
					if(walletKeyPath === self.walletKeyPath) {
					
						// Check what changed
						switch(change) {
						
							// Unspent amount, pending amount, or unconfirmed amount
							case Wallets.UNSPENT_AMOUNT_CHANGED:
							case Wallets.PENDING_AMOUNT_CHANGED:
							case Wallets.UNCONFIRMED_AMOUNT_CHANGED:
							
								// Try
								try {
								
									// Update balance
									self.updateBalance();
								}
								
								// Catch errors
								catch(error) {
								
								}
								
								// Break
								break;
						
							// Address suffix
							case Wallets.ADDRESS_SUFFIX_CHANGED:
							
								// Try
								try {
								
									// Update QR code
									self.updateQrCode();
								}
								
								// Catch errors
								catch(error) {
								
								}
								
								// Break
								break;
							
							// Name
							case Wallets.NAME_CHANGED:
							
								// Replace navigation display's wallet name
								self.navigationDisplay.find("h2").replaceWith("<h2>" + Common.htmlEncode(newValue) + "</h2>");
								
								// Break
								break;
						}
					}
				}
			
			// Address copy click and touch end event
			}).on("click touchend", "main > div.unlocked > div > div > div.sections > div > div.wallet > div > div.address > p > span.copy", function(event) {
			
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
				
					// Show copy address error
					var showCopyAddressError = function(error) {
					
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('Copy Address Error'), Message.createText(error), false, function() {
						
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
					};
					
					// Try
					try {
					
						// Get copy button's wallet
						var wallet = self.getWallets().getWallet(self.walletKeyPath);
					}
					
					// Catch errors
					catch(error) {
					
						// Show copy address error
						showCopyAddressError(error);
						
						// Return
						return;
					}
					
					// Check if wallet has an address suffix
					if(wallet.getAddressSuffix() !== Wallet.NO_ADDRESS_SUFFIX) {
					
						// Get wallet's address
						var address = wallet.getAddress(self.getUnlocked().getDisplayedAddressType());
				
						// Copy address to clipboard
						self.getClipboard().copy(address).then(function() {
						
							// Show message and allow showing messages
							self.getMessage().show(Language.getDefaultTranslation('Address Copied'), ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('The address for Wallet %1$s was successfully copied to your clipboard.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('The address for %1$y was successfully copied to your clipboard.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the pasted address matches the following address when you paste it.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(address) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can only receive payments at this address while you\'re online and connected to a listener.')) + "</b>", false, function() {
							
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
						
							// Show copy address error
							showCopyAddressError(Language.getDefaultTranslation('Copying the address to your clipboard failed.'));
						});
					}
					
					// Otherwise
					else {
					
						// Show copy address error
						showCopyAddressError(Language.getDefaultTranslation('The wallet\'s address doesn\'t exist.'));
					}
				
				}, ("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") ? 0 : WalletSection.COPY_ADDRESS_TO_CLIPBOARD_DELAY_MILLISECONDS);
			
			// Transactions display buttons click event
			}).on("click", "main > div.unlocked > div > div > div.sections > div > div.wallet > div > div.transactions > button", function() {
			
				// Get button
				var button = $(this);
			
				// Show transaction section and catch errors
				self.getSections().showSection(TransactionSection.NAME, true, {
				
					// Wallet key path
					[TransactionSection.STATE_WALLET_KEY_PATH_NAME]: self.walletKeyPath,
					
					// Transaction key path
					[TransactionSection.STATE_TRANSACTION_KEY_PATH_NAME]: parseInt(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE),
					
					// Transaction index
					[TransactionSection.STATE_TRANSACTION_INDEX_NAME]: parseInt(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "index"), Common.DECIMAL_NUMBER_BASE)
					
				}).catch(function(error) {
				
				});
			
			// Transaction button ID copy click and touch end event
			}).on("click touchend", "main > div.unlocked > div > div > div.sections > div > div.wallet > div > div.transactions > button > span.id > span.copy", function(event) {
			
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
				
				// Get transaction's ID
				var id = copyButton.prev().text();
				
				// Get transaction's index
				var index = copyButton.closest("button").attr(Common.DATA_ATTRIBUTE_PREFIX + "index");
				
				// Set timeout
				setTimeout(function() {
				
					// Copy ID to clipboard
					self.getClipboard().copy(id).then(function() {
					
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('ID Copied'), Message.createText(Language.getDefaultTranslation('The ID for transaction %1$s was successfully copied to your clipboard.'), [index]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the pasted ID matches the following ID when you paste it.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(id) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak(), false, function() {
						
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
						self.getMessage().show(Language.getDefaultTranslation('Copy ID Error'), Message.createText(Language.getDefaultTranslation('Copying the ID to your clipboard failed.')), false, function() {
						
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
				
				}, ("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") ? 0 : WalletSection.COPY_ID_TO_CLIPBOARD_DELAY_MILLISECONDS);
			
			// Document key down event
			}).on("keydown", function(event) {
			
				// Check if key tab is pressed
				if(event["which"] === "\t".charCodeAt(0)) {
				
					// Check if address display isn't showing loading
					if(self.addressDisplay.hasClass("loading") === false) {
				
						// Enable tabbing to all address display's enabled buttons
						self.addressDisplay.find("button:not(:disabled)").enableTab();
					}
					
					// Otherwise
					else {
					
						// Disable tabbing to all address display's enabled buttons
						self.addressDisplay.find("button:not(:disabled)").disableTab();
					}
				
					// Check if balance display isn't showing syncing
					if(self.balanceDisplay.hasClass("syncing") === false) {
				
						// Enable tabbing to all balance display's enabled buttons
						self.balanceDisplay.find("button:not(:disabled)").enableTab();
					}
					
					// Otherwise
					else {
					
						// Disable tabbing to all balance display's enabled buttons
						self.balanceDisplay.find("button:not(:disabled)").disableTab();
					}
					
					// Enable tabbing to all not disabled transactions navigation display buttons
					self.transactionsNavigationDisplay.find("button:not(.disabled)").enableTab();
					
					// Disable tabbing to all disabled transactions navigation display buttons
					self.transactionsNavigationDisplay.find("button.disabled").disableTab();
				}
			});
			
			// Wallets sync start event
			$(this.getWallets()).on(Wallets.SYNC_START_EVENT, function(event, walletKeyPath, percentComplete, lastPercentInGroup) {
			
				// Check if shown
				if(self.isShown() === true) {
			
					// Check if current wallet was changed
					if(walletKeyPath === self.walletKeyPath) {
					
						// Check if not showing sync done
						if(self.showingSyncDone === false) {
					
							// Try
							try {
							
								// Get wallet
								var wallet = self.getWallets().getWallet(self.walletKeyPath);
							}
							
							// Catch errors
							catch(error) {
							
								// Return
								return;
							}
							
							// Check if balance aren't showing syncing
							if(self.balanceDisplay.hasClass("syncing") === false) {
							
								// Set that balance shows syncing and prevent it from transitioning
								self.balanceDisplay.addClass("syncing instant");
								
								// Check if balance syncing status is visible
								if(self.balanceDisplay.find("div.syncStatus").is(":visible") === true) {
								
									// Balance syncing status transition end or timeout event
									self.balanceDisplay.find("div.syncStatus").transitionEndOrTimeout(function() {
									
										// Allow balance display to transition
										self.balanceDisplay.removeClass("instant");
										
									}, "opacity");
								}
								
								// Otherwise
								else {
								
									// Allow balance display to transition
									self.balanceDisplay.removeClass("instant");
								}
							}
							
							// Blur balance display's buttons
							self.balanceDisplay.find("button").blur();
							
							// Check if not last percent in group
							if(lastPercentInGroup === false) {
							
								// Prevent shown syncing percent from transitioning
								self.balanceDisplay.find("circle.foreground").addClass("noTransition");
								
								// Check if shown syncing percent is visible
								if(self.balanceDisplay.find("circle.foreground").is(":visible") === true) {
								
									// Shown syncing percent transition end or timeout event
									self.balanceDisplay.find("circle.foreground").transitionEndOrTimeout(function() {
									
										// Check if not showing sync done
										if(self.showingSyncDone === false) {
									
											// Allow shown syncing percent to transition
											self.balanceDisplay.find("circle.foreground").removeClass("noTransition");
										}
										
									}, "stroke-dashoffset");
								}
								
								// Otherwise
								else {
								
									// Allow shown syncing percent to transition
									self.balanceDisplay.find("circle.foreground").removeClass("noTransition");
								}
							}
							
							// Set shown syncing percent
							self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", Common.map(wallet.getPercentSynced(), Wallets.MINIMUM_PERCENT, Wallets.MAXIMUM_PERCENT, WalletSection.SYNCING_MINIMUM_STROKE_DASH_OFFSET, WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET).toFixed());
							
							// Remove percent display from balance display
							self.balanceDisplay.find("div.syncStatus").find("span").remove();
							
							// Append percent display to balance display
							self.balanceDisplay.find("div.syncStatus").append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$s%%'), [wallet.getPercentSynced().toFixed(0, BigNumber.ROUND_FLOOR)]));
							
							// Remove syncing failed message
							self.balanceDisplay.removeClass("failed");
						}
					}
				}
			
			// Wallets sync done event
			}).on(Wallets.SYNC_DONE_EVENT, function(event, walletKeyPath) {
			
				// Check if shown
				if(self.isShown() === true) {
			
					// Check if current wallet was changed
					if(walletKeyPath === self.walletKeyPath) {
					
						// Check if balance are showing syncing
						if(self.balanceDisplay.hasClass("syncing") === true) {
						
							// Check if not showing sync done
							if(self.showingSyncDone === false) {
							
								// Set showing sync done
								self.showingSyncDone = true;
								
								// Get if percent changed
								var percentChanged = WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET !== parseFloat(self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset"));
								
								// Set shown syncing percent and allow it to transition
								self.balanceDisplay.find("circle.foreground").removeClass("noTransition").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
								
								// Remove percent display from balance display
								self.balanceDisplay.find("div.syncStatus").find("span").remove();
								
								// Append percent display to balance display
								self.balanceDisplay.find("div.syncStatus").append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$s%%'), [(new BigNumber(Wallets.MAXIMUM_PERCENT)).toFixed(0, BigNumber.ROUND_FLOOR)]));
								
								// Remove syncing failed message
								self.balanceDisplay.removeClass("failed");
								
								// Check if percent changed
								if(percentChanged === true) {
								
									// Check if shown syncing percent is visible
									if(self.balanceDisplay.find("circle.foreground").is(":visible") === true) {
									
										// Shown syncing percent transition end or timeout event
										self.balanceDisplay.find("circle.foreground").transitionEndOrTimeout(function() {
										
											// Set timeout
											setTimeout(function() {
											
												// Check if shown
												if(self.isShown() === true) {
										
													// Set that balance doesn't show syncing
													self.balanceDisplay.removeClass("syncing");
													
													// Check if balance syncing status is visible
													if(self.balanceDisplay.find("div.syncStatus").is(":visible") === true) {
													
														// Balance syncing status transition end or timeout event
														self.balanceDisplay.find("div.syncStatus").transitionEndOrTimeout(function() {
														
															// Reset shown syncing percent
															self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
															
															// Remove percent display from balance display
															self.balanceDisplay.find("div.syncStatus").find("span").remove();
															
															// Clear showing sync done
															self.showingSyncDone = false;
															
														}, "opacity");
													}
													
													// Otherwise
													else {
													
														// Reset shown syncing percent
														self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
														
														// Remove percent display from balance display
														self.balanceDisplay.find("div.syncStatus").find("span").remove();
														
														// Clear showing sync done
														self.showingSyncDone = false;
													}
												}
												
											}, WalletSection.SYNC_DONE_DELAY_MILLISECONDS);
											
										}, "stroke-dashoffset");
									}
									
									// Otherwise
									else {
									
										// Set that balance doesn't show syncing
										self.balanceDisplay.removeClass("syncing");
										
										// Check if balance syncing status is visible
										if(self.balanceDisplay.find("div.syncStatus").is(":visible") === true) {
										
											// Balance syncing status transition end or timeout event
											self.balanceDisplay.find("div.syncStatus").transitionEndOrTimeout(function() {
											
												// Reset shown syncing percent
												self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
												
												// Remove percent display from balance display
												self.balanceDisplay.find("div.syncStatus").find("span").remove();
												
												// Clear showing sync done
												self.showingSyncDone = false;
												
											}, "opacity");
										}
										
										// Otherwise
										else {
										
											// Reset shown syncing percent
											self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
											
											// Remove percent display from balance display
											self.balanceDisplay.find("div.syncStatus").find("span").remove();
											
											// Clear showing sync done
											self.showingSyncDone = false;
										}
									}
								}
								
								// Otherwise
								else {
								
									// Set timeout
									setTimeout(function() {
									
										// Check if shown
										if(self.isShown() === true) {
								
											// Set that balance doesn't show syncing
											self.balanceDisplay.removeClass("syncing");
											
											// Check if balance syncing status is visible
											if(self.balanceDisplay.find("div.syncStatus").is(":visible") === true) {
											
												// Balance syncing status transition end or timeout event
												self.balanceDisplay.find("div.syncStatus").transitionEndOrTimeout(function() {
												
													// Reset shown syncing percent
													self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
													
													// Remove percent display from balance display
													self.balanceDisplay.find("div.syncStatus").find("span").remove();
													
													// Clear showing sync done
													self.showingSyncDone = false;
													
												}, "opacity");
											}
											
											// Otherwise
											else {
											
												// Reset shown syncing percent
												self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
												
												// Remove percent display from balance display
												self.balanceDisplay.find("div.syncStatus").find("span").remove();
												
												// Clear showing sync done
												self.showingSyncDone = false;
											}
										}
										
									}, WalletSection.SYNC_DONE_DELAY_MILLISECONDS);
								}
							}
						}
					}
				}
			
			// Wallets sync fail
			}).on(Wallets.SYNC_FAIL_EVENT, function(event, walletKeyPath) {
			
				// Check if shown
				if(self.isShown() === true) {
			
					// Check if current wallet was changed
					if(walletKeyPath === self.walletKeyPath) {
					
						// Check if not showing sync done
						if(self.showingSyncDone === false) {
					
							// Try
							try {
							
								// Get wallet
								var wallet = self.getWallets().getWallet(self.walletKeyPath);
							}
							
							// Catch errors
							catch(error) {
								
								// Return
								return;
							}
							
							// Check if balance aren't showing syncing
							if(self.balanceDisplay.hasClass("syncing") === false) {
							
								// Set that balance shows syncing and prevent it from transitioning
								self.balanceDisplay.addClass("syncing instant");
								
								// Check if balance syncing status
								if(self.balanceDisplay.find("div.syncStatus").is(":visible") === true) {
								
									// Balance syncing status transition end or timeout event
									self.balanceDisplay.find("div.syncStatus").transitionEndOrTimeout(function() {
									
										// Allow balance display to transition
										self.balanceDisplay.removeClass("instant");
										
									}, "opacity");
								}
								
								// Otherwise
								else {
								
									// Allow balance display to transition
									self.balanceDisplay.removeClass("instant");
								}
							}
							
							// Blur balance display's buttons
							self.balanceDisplay.find("button").blur();
							
							// Set shown syncing percent
							self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", Common.map(wallet.getPercentSynced(), Wallets.MINIMUM_PERCENT, Wallets.MAXIMUM_PERCENT, WalletSection.SYNCING_MINIMUM_STROKE_DASH_OFFSET, WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET).toFixed());
							
							// Remove percent display from balance display
							self.balanceDisplay.find("div.syncStatus").find("span").remove();
							
							// Append percent display to balance display
							self.balanceDisplay.find("div.syncStatus").append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$s%%'), [wallet.getPercentSynced().toFixed(0, BigNumber.ROUND_FLOOR)]));
							
							// Show syncing failed message
							self.balanceDisplay.addClass("failed");
						}
					}
				}
			});
			
			// Balance display on language change event
			var languageChanging = false;
			this.balanceDisplay.on(Language.CHANGE_EVENT, function() {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Check if language isn't changing
					if(languageChanging === false) {
					
						// Set language changing
						languageChanging = true;
						
						// Try
						try {
						
							// Update balance
							self.updateBalance();
						}
						
						// Catch errors
						catch(error) {
						
						}
						
						// Update transactions values
						self.updateTransactionsValues();
						
						// Set timeout
						setTimeout(function() {
						
							// Clear language changing
							languageChanging = false;
						}, 0);
					}
				}
			});
			
			// Prices change event
			$(this.getPrices()).on(Prices.CHANGE_EVENT, function(event, prices) {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Try
					try {
					
						// Update balance
						self.updateBalance();
					}
					
					// Catch errors
					catch(error) {
					
					}
					
					// Update transactions values
					self.updateTransactionsValues();
				}
			});
			
			// Change address suffix button click event
			this.addressDisplay.find("button.changeAddressSuffix").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show change address suffix error
				var showChangeAddressSuffixError = function(message) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Change Address Suffix Error'), message, true, function() {
					
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
				};
				
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallets().getWallet(self.walletKeyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Show change address suffix error
					showChangeAddressSuffixError(Message.createText(error));
				
					// Return
					return;
				}
				
				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Change Address Suffix'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Are you sure you want to change the address suffix for Wallet %1$s?') : Language.getDefaultTranslation('Are you sure you want to change the address suffix for %1$y?'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You\'ll no longer be able to receive payments at the wallet\'s current address once its address suffix has been changed.')) + "</b>", false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if changing address suffix
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
						
								// Change wallet's address suffix
								self.getWallets().changeAddressSuffix(self.walletKeyPath).then(function() {
								
									// Set timeout
									setTimeout(function() {
								
										// Allow automatic lock
										self.getAutomaticLock().allow();
										
										// Check if automatic lock isn't locking
										if(self.getAutomaticLock().isLocking() === false) {
									
											// Hide loading
											self.getApplication().hideLoading();
									
											// Enable unlocked
											self.getUnlocked().enable();
											
											// Set that button isn't clicked
											button.removeClass("clicked");
											
											// Delete focus
											self.getFocus().delete();
											
											// Hide message
											self.getMessage().hide();
											
											// Allow showing messages
											self.getMessage().allow();
										}
									}, WalletSection.CHANGE_ADDRESS_SUFFIX_AFTER_DELAY_MILLISECONDS);
								
								// Catch errors
								}).catch(function(error) {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
								
										// Show change address suffix error
										showChangeAddressSuffixError(error);
									}
								});
							}, WalletSection.CHANGE_ADDRESS_SUFFIX_BEFORE_DELAY_MILLISECONDS);
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
			
			// Send payment button click event
			this.balanceDisplay.find("button.sendPayment").on("click", function() {
			
				// Show send payment section and catch errors
				self.getSections().showSection(SendPaymentSection.NAME, true, {
				
					// Wallet key path
					[SendPaymentSection.STATE_WALLET_KEY_PATH_NAME]: self.walletKeyPath
					
				}).catch(function(error) {
				
				});
			});
			
			// Get passphrase button click event
			this.getDisplay().find("button.getPassphrase").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show get passphrase error
				var showGetPassphraseError = function(error) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Get Passphrase Error'), Message.createText(error), true, function() {
					
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
				};
				
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallets().getWallet(self.walletKeyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Show get passphrase error
					showGetPassphraseError(error);
				
					// Return
					return;
				}

				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Get Passphrase'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Enter your password to get the passphrase for Wallet %1$s.') : Language.getDefaultTranslation('Enter your password to get the passphrase for %1$y.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + Message.createLineBreak() + Message.createInput(Language.getDefaultTranslation('Password'), [], true) + Message.createLineBreak(), false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('Cancel'), Language.getDefaultTranslation('Continue'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if continuing
						if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
						
							// Prevent showing messages
							self.getMessage().prevent();
							
							// Show loading
							self.getApplication().showLoading();
						
							// Set that message second button is loading
							self.getMessage().setButtonLoading(Message.SECOND_BUTTON);
							
							// Try
							try {
						
								// Get password
								var password = self.getMessage().getInputText();
							}
							
							// Catch errors
							catch(error) {
							
								// Show get passphrase error
								showGetPassphraseError(Language.getDefaultTranslation('Incorrect password.'));
								
								// Return
								return;
							}
							
							// Disable message
							self.getMessage().disable();
							
							// Check if password is incorrect
							if(self.getWallets().isPassword(password) === false) {
							
								// TODO Securely clear password
							
								// Show get passphrase error
								showGetPassphraseError(Language.getDefaultTranslation('Incorrect password.'));
							}
							
							// Otherwise check if wallet doesn't exist
							else if(self.getWallets().walletExists(self.walletKeyPath) === false) {
							
								// TODO Securely clear password
							
								// Show get passphrase error
								showGetPassphraseError(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
							}
							
							// Otherwise
							else {
							
								// TODO Securely clear password
								
								// Prevent automatic lock
								self.getAutomaticLock().prevent();
								
								// Set timeout
								setTimeout(function() {
						
									// Get wallet's passphrase
									wallet.getPassphrase().then(function(passphrase) {
									
										// Allow automatic lock
										self.getAutomaticLock().allow();
										
										// Check if automatic lock isn't locking
										if(self.getAutomaticLock().isLocking() === false) {
									
											// Show message immediately and allow showing messages
											self.getMessage().show(Language.getDefaultTranslation('Passphrase'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('The passphrase for Wallet %1$s is the following passphrase.') : Language.getDefaultTranslation('The passphrase for %1$y is the following passphrase.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"passphrase contextMenu\" spellcheck=\"false\">" + Common.htmlEncode(passphrase) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('Don\'t disclose this passphrase to anyone.')) + "</b>", true, function() {
											
												// Hide loading
												self.getApplication().hideLoading();
											
											}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
											
												// TODO Securely clear passphrase
											
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
										
										// Otherwise
										else {
										
											// TODO Securely clear passphrase
										}
									
									// Catch errors
									}).catch(function(error) {
									
										// Allow automatic lock
										self.getAutomaticLock().allow();
										
										// Check if automatic lock isn't locking
										if(self.getAutomaticLock().isLocking() === false) {
									
											// Show get passphrase error
											showGetPassphraseError(error);
										}
									});
								}, WalletSection.GET_PASSPHRASE_DELAY_MILLISECONDS);
							}
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
			
			// Get payment proof address button click event
			this.getDisplay().find("button.getPaymentProofAddress").on("click", function() {
			
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
				
				// Show get payment proof address error
				var showGetPaymentProofAddressError = function(error) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Get Payment Proof Address Error'), Message.createText(error), true, function() {
					
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
				
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallets().getWallet(self.walletKeyPath);
				}
				
				// Catch errors
				catch(error) {
					
					// Show get payment proof address error
					showGetPaymentProofAddressError(error);
					
					// Return
					return;
				}
				
				// Get proof address
				var getProofAddress = function() {
				
					// Return promise
					return new Promise(function(resolve, reject) {
				
						// Check if wallet isn't a hardware wallet
						if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
						
							// Check wallet's type
							switch(wallet.getWalletType()) {
							
								// MWC or EPIC wallet
								case Consensus.MWC_WALLET_TYPE:
								case Consensus.EPIC_WALLET_TYPE:
						
									// Return getting the wallet's Tor proof address
									return wallet.getTorProofAddress().then(function(proofAddress) {
									
										// Resolve proof address
										resolve(proofAddress);
									
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(Language.getDefaultTranslation('Getting the payment proof address failed.'));
									});
								
								// GRIN wallet
								case Consensus.GRIN_WALLET_TYPE:
								
									// Return getting the wallet's Slatepack proof address
									return wallet.getSlatepackProofAddress().then(function(proofAddress) {
									
										// Resolve proof address
										resolve(proofAddress);
									
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(Language.getDefaultTranslation('Getting the payment proof address failed.'));
									});
							}
						}
						
						// Otherwise
						else {
						
							// Return waiting for wallet's hardware wallet to connect
							return self.getWallets().waitForHardwareWalletToConnect(wallet.getKeyPath(), (wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Connect the hardware wallet for Wallet %1$s to continue getting the payment proof address.') : Language.getDefaultTranslation('Connect the hardware wallet for %1$y to continue getting the payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()], false, true).then(function() {
							
								// Check wallet's type
								switch(wallet.getWalletType()) {
								
									// MWC or EPIC wallet
									case Consensus.MWC_WALLET_TYPE:
									case Consensus.EPIC_WALLET_TYPE:
							
										// Return getting the wallet's Tor proof address
										return wallet.getTorProofAddress((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Unlock the hardware wallet for Wallet %1$s to continue getting the payment proof address.') : Language.getDefaultTranslation('Unlock the hardware wallet for %1$y to continue getting the payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()], false, true).then(function(proofAddress) {
										
											// Resolve proof address
											resolve(proofAddress);
										
										// Catch errors
										}).catch(function(error) {
										
											// Check if canceled
											if(error === Common.CANCELED_ERROR) {
											
												// Reject error
												reject(error);
											}
											
											// Otherwise check if hardware wallet was disconnected
											else if(error === HardwareWallet.DISCONNECTED_ERROR) {
											
												// Check if wallet's hardware wallet is connected
												if(wallet.isHardwareConnected() === true) {
											
													// Wallet's hardware wallet disconnect event
													$(wallet.getHardwareWallet()).one(HardwareWallet.DISCONNECT_EVENT, function() {
												
														// Return getting proof address
														return getProofAddress().then(function(proofAddress) {
														
															// Resolve proof address
															resolve(proofAddress);
														
														// Catch errors
														}).catch(function(error) {
														
															// Reject error
															reject(error);
														});
													});
												}
												
												// Otherwise
												else {
												
													// Return getting proof address
													return getProofAddress().then(function(proofAddress) {
													
														// Resolve proof address
														resolve(proofAddress);
													
													// Catch errors
													}).catch(function(error) {
													
														// Reject error
														reject(error);
													});
												}
											}
											
											// Otherwise
											else {
										
												// Reject error
												reject(Language.getDefaultTranslation('Getting the payment proof address failed.'));
											}
										});
									
									// GRIN wallet
									case Consensus.GRIN_WALLET_TYPE:
									
										// Return getting the wallet's Slatepack proof address
										return wallet.getSlatepackProofAddress((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Unlock the hardware wallet for Wallet %1$s to continue getting the payment proof address.') : Language.getDefaultTranslation('Unlock the hardware wallet for %1$y to continue getting the payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()], false, true).then(function(proofAddress) {
										
											// Resolve proof address
											resolve(proofAddress);
										
										// Catch errors
										}).catch(function(error) {
										
											// Check if canceled
											if(error === Common.CANCELED_ERROR) {
											
												// Reject error
												reject(error);
											}
											
											// Otherwise check if hardware wallet was disconnected
											else if(error === HardwareWallet.DISCONNECTED_ERROR) {
											
												// Check if wallet's hardware wallet is connected
												if(wallet.isHardwareConnected() === true) {
											
													// Wallet's hardware wallet disconnect event
													$(wallet.getHardwareWallet()).one(HardwareWallet.DISCONNECT_EVENT, function() {
												
														// Return getting proof address
														return getProofAddress().then(function(proofAddress) {
														
															// Resolve proof address
															resolve(proofAddress);
														
														// Catch errors
														}).catch(function(error) {
														
															// Reject error
															reject(error);
														});
													});
												}
												
												// Otherwise
												else {
												
													// Return getting proof address
													return getProofAddress().then(function(proofAddress) {
													
														// Resolve proof address
														resolve(proofAddress);
													
													// Catch errors
													}).catch(function(error) {
													
														// Reject error
														reject(error);
													});
												}
											}
											
											// Otherwise
											else {
										
												// Reject error
												reject(Language.getDefaultTranslation('Getting the payment proof address failed.'));
											}
										});
								}
								
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
					});
				};
				
				// Prevent automatic lock
				self.getAutomaticLock().prevent();
				
				// Set timeout
				setTimeout(function() {
				
					// Get proof address
					getProofAddress().then(function(proofAddress) {
					
						// Allow automatic lock
						self.getAutomaticLock().allow();
						
						// Check if automatic lock isn't locking
						if(self.getAutomaticLock().isLocking() === false) {
					
							// Check if wallet isn't a hardware wallet
							if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
						
								// Show message and allow showing messages
								self.getMessage().show(Language.getDefaultTranslation('Payment Proof Address'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('The payment proof address for Wallet %1$s is the following payment proof address.') : Language.getDefaultTranslation('The payment proof address for %1$y is the following payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(proofAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak(), false, function() {
								
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
							
							// Otherwise
							else {
								
								// Initialize prevent cancel on hide
								var preventCancelOnHide = false;
								
								// Initialize canceled
								var canceled = false;
								
								// Check wallet's type
								switch(wallet.getWalletType()) {
								
									// MWC or EPIC wallet
									case Consensus.MWC_WALLET_TYPE:
									case Consensus.EPIC_WALLET_TYPE:
									
										// Set text
										var text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Verify the payment proof address on the hardware wallet for Wallet %1$s to continue getting the payment proof address.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Verify the payment proof address on the hardware wallet for %1$y to continue getting the payment proof address.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the Tor address displayed on the hardware wallet matches the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(proofAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak();
										
										// Break
										break;
									
									// GRIN wallet
									case Consensus.GRIN_WALLET_TYPE:
									
										// Set text
										var text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Verify the payment proof address on the hardware wallet for Wallet %1$s to continue getting the payment proof address.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Verify the payment proof address on the hardware wallet for %1$y to continue getting the payment proof address.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the Slatepack address displayed on the hardware wallet matches the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(proofAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak();
										
										// Break
										break;
								}
								
								// Prevent automatic lock
								self.getAutomaticLock().prevent();
								
								// Show message and allow showing messages
								self.getMessage().show(Language.getDefaultTranslation('Payment Proof Address'), Message.createPendingResult() + Message.createLineBreak() + text, false, function() {
								
									// Hide loading
									self.getApplication().hideLoading();
								
									// Message show wallet section event
									$(self.getMessage()).one(Message.SHOW_EVENT + ".walletSection", function() {
									
										// Set prevent cancel on hide
										preventCancelOnHide = true;
									
										// Message replace wallet section event
										$(self.getMessage()).on(Message.REPLACE_EVENT + ".walletSection", function(event, messageType, messageData) {
										
											// Check if not canceled
											if(canceled === false) {
											
												// Show message immediately and allow showing messages
												self.getMessage().show(Language.getDefaultTranslation('Payment Proof Address'), Message.createPendingResult() + Message.createLineBreak() + text, true, function() {
												
													// Check if canceled
													if(canceled === true) {
													
														// Return false
														return false;
													}
													
													// Otherwise
													else {
													
														// Hide loading
														self.getApplication().hideLoading();
													}
													
												}, Language.getDefaultTranslation('Cancel'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
												
													// Check if message wasn't hidden
													if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
													
														// Set canceled
														canceled = true;
												
														// Turn off message replace wallet section event
														$(self.getMessage()).off(Message.REPLACE_EVENT + ".walletSection");
														
														// Allow automatic lock
														self.getAutomaticLock().allow();
														
														// Check if automatic lock isn't locking
														if(self.getAutomaticLock().isLocking() === false) {
														
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
													}
												});
											}
										});
									
										// Verify proof address
										var verifyProofAddress = function() {
										
											// Return promise
											return new Promise(function(resolve, reject) {
											
												// Return waiting for wallet's hardware wallet to connect
												return self.getWallets().waitForHardwareWalletToConnect(wallet.getKeyPath(), (wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Connect the hardware wallet for Wallet %1$s to continue getting the payment proof address.') : Language.getDefaultTranslation('Connect the hardware wallet for %1$y to continue getting the payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()], false, true, function() {
												
													// Return if canceled
													return canceled === true;
													
												}).then(function() {
												
													// Check if wallet's hardware wallet is connected
													if(wallet.isHardwareConnected() === true) {
												
														// Check wallet's type
														switch(wallet.getWalletType()) {
														
															// MWC or EPIC wallet
															case Consensus.MWC_WALLET_TYPE:
															case Consensus.EPIC_WALLET_TYPE:
															
																// Return verifying the wallet's Tor address with the wallet's hardware wallet
																return wallet.getHardwareWallet().verifyTorAddress(Wallet.PAYMENT_PROOF_TOR_ADDRESS_KEY_INDEX, (wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Unlock the hardware wallet for Wallet %1$s to continue getting the payment proof address.') : Language.getDefaultTranslation('Unlock the hardware wallet for %1$y to continue getting the payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()], false, true, function() {
													
																	// Return if canceled
																	return canceled === true;
																	
																}).then(function() {
																
																	// Resolve
																	resolve();
																
																// Catch errors
																}).catch(function(error) {
																
																	// Check if canceled
																	if(error === Common.CANCELED_ERROR) {
																	
																		// Reject error
																		reject(error);
																	}
																	
																	// Otherwise check if hardware wallet was disconnected
																	else if(error === HardwareWallet.DISCONNECTED_ERROR) {
																	
																		// Check if wallet's hardware wallet is connected
																		if(wallet.isHardwareConnected() === true) {
																	
																			// Wallet's hardware wallet disconnect event
																			$(wallet.getHardwareWallet()).one(HardwareWallet.DISCONNECT_EVENT, function() {
																		
																				// Return verifying proof address
																				return verifyProofAddress().then(function() {
																				
																					// Resolve
																					resolve();
																				
																				// Catch errors
																				}).catch(function(error) {
																				
																					// Reject error
																					reject(error);
																				});
																			});
																		}
																		
																		// Otherwise
																		else {
																		
																			// Return verifying proof address
																			return verifyProofAddress().then(function() {
																			
																				// Resolve
																				resolve();
																			
																			// Catch errors
																			}).catch(function(error) {
																			
																				// Reject error
																				reject(error);
																			});
																		}
																	}
																	
																	// Otherwise check if the user rejected on the hardware wallet
																	else if(error === HardwareWallet.USER_REJECTED_ERROR) {
																	
																		// Reject error
																		reject(Language.getDefaultTranslation('Verifying the Tor address on the hardware wallet failed.'));
																	}
																	
																	// Otherwise
																	else {
																
																		// Reject error
																		reject(Language.getDefaultTranslation('Verifying the payment proof address failed.'));
																	}
																});
															
															// GRIN wallet
															case Consensus.GRIN_WALLET_TYPE:
															
																// Return verifying the wallet's Slatepack address with the wallet's hardware wallet
																return wallet.getHardwareWallet().verifySlatepackAddress(Wallet.PAYMENT_PROOF_SLATEPACK_ADDRESS_KEY_INDEX, (wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Unlock the hardware wallet for Wallet %1$s to continue getting the payment proof address.') : Language.getDefaultTranslation('Unlock the hardware wallet for %1$y to continue getting the payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()], false, true, function() {
													
																	// Return if canceled
																	return canceled === true;
																	
																}).then(function() {
																
																	// Resolve
																	resolve();
																
																// Catch errors
																}).catch(function(error) {
																
																	// Check if canceled
																	if(error === Common.CANCELED_ERROR) {
																	
																		// Reject error
																		reject(error);
																	}
																	
																	// Otherwise check if hardware wallet was disconnected
																	else if(error === HardwareWallet.DISCONNECTED_ERROR) {
																	
																		// Check if wallet's hardware wallet is connected
																		if(wallet.isHardwareConnected() === true) {
																	
																			// Wallet's hardware wallet disconnect event
																			$(wallet.getHardwareWallet()).one(HardwareWallet.DISCONNECT_EVENT, function() {
																		
																				// Return verifying proof address
																				return verifyProofAddress().then(function() {
																				
																					// Resolve
																					resolve();
																				
																				// Catch errors
																				}).catch(function(error) {
																				
																					// Reject error
																					reject(error);
																				});
																			});
																		}
																		
																		// Otherwise
																		else {
																		
																			// Return verifying proof address
																			return verifyProofAddress().then(function() {
																			
																				// Resolve
																				resolve();
																			
																			// Catch errors
																			}).catch(function(error) {
																			
																				// Reject error
																				reject(error);
																			});
																		}
																	}
																	
																	// Otherwise check if the user rejected on the hardware wallet
																	else if(error === HardwareWallet.USER_REJECTED_ERROR) {
																	
																		// Reject error
																		reject(Language.getDefaultTranslation('Verifying the Slatepack address on the hardware wallet failed.'));
																	}
																	
																	// Otherwise
																	else {
																
																		// Reject error
																		reject(Language.getDefaultTranslation('Verifying the payment proof address failed.'));
																	}
																});
														}
													}
													
													// Otherwise
													else {
													
														// Return verifying proof address
														return verifyProofAddress().then(function() {
														
															// Resolve
															resolve();
														
														// Catch errors
														}).catch(function(error) {
														
															// Reject error
															reject(error);
														});
													}
													
												// Catch errors
												}).catch(function(error) {
												
													// Reject error
													reject(error);
												});
											});
										};
										
										// Verify proof address
										verifyProofAddress().then(function() {
										
											// Turn off message replace wallet section event
											$(self.getMessage()).off(Message.REPLACE_EVENT + ".walletSection");
										
											// Check if not canceled
											if(canceled === false) {
											
												// Set prevent cancel on hide
												preventCancelOnHide = true;
												
												// Allow automatic lock
												self.getAutomaticLock().allow();
												
												// Check if automatic lock isn't locking
												if(self.getAutomaticLock().isLocking() === false) {
												
													// Show message immediately and allow showing messages
													self.getMessage().show(Language.getDefaultTranslation('Payment Proof Address'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('The payment proof address for Wallet %1$s is the following payment proof address.') : Language.getDefaultTranslation('The payment proof address for %1$y is the following payment proof address.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(proofAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak(), true, function() {
													
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
											}
											
										// Catch errors
										}).catch(function(error) {
										
											// Turn off message replace wallet section event
											$(self.getMessage()).off(Message.REPLACE_EVENT + ".walletSection");
										
											// Check if not canceled
											if(canceled === false) {
										
												// Check if canceled
												if(error === Common.CANCELED_ERROR) {
												
													// Set prevent cancel on hide
													preventCancelOnHide = true;
													
													// Allow automatic lock
													self.getAutomaticLock().allow();
													
													// Check if automatic lock isn't locking
													if(self.getAutomaticLock().isLocking() === false) {
													
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
												}
											
												// Otherwise
												else {
												
													// Set prevent cancel on hide
													preventCancelOnHide = true;
													
													// Allow automatic lock
													self.getAutomaticLock().allow();
													
													// Check if automatic lock isn't locking
													if(self.getAutomaticLock().isLocking() === false) {
												
														// Show get payment proof address error
														showGetPaymentProofAddressError(error);
													}
												}
											}
										});
									});
								}, Language.getDefaultTranslation('Cancel'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Turn off message show wallet section event
									$(self.getMessage()).off(Message.SHOW_EVENT + ".walletSection");
									
									// Check if not preventing cancel on hide or message wasn't hidden
									if(preventCancelOnHide === false || messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
										// Set canceled
										canceled = true;
										
										// Turn off message replace wallet section event
										$(self.getMessage()).off(Message.REPLACE_EVENT + ".walletSection");
										
										// Check if not preventing cancel on hide or message wasn't hidden
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
										
											// Allow automatic lock
											self.getAutomaticLock().allow();
											
											// Check if automatic lock isn't locking
											if(self.getAutomaticLock().isLocking() === false) {
									
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
										}
										
										// Otherwise
										else {
										
											// Allow automatic lock
											self.getAutomaticLock().allow();
										}
									}
								});
							}
						}
						
					// Catch errors
					}).catch(function(error) {
					
						// Allow automatic lock
						self.getAutomaticLock().allow();
						
						// Check if automatic lock isn't locking
						if(self.getAutomaticLock().isLocking() === false) {
					
							// Check if canceled
							if(error === Common.CANCELED_ERROR) {
							
								// Hide loading
								self.getApplication().hideLoading();
							
								// Set that button isn't loading
								button.removeClass("loading");
								
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that button isn't clicked
								button.removeClass("clicked");
								
								// Restore focus and don't blur
								self.getFocus().restore(false);
								
								// Allow showing messages
								self.getMessage().allow();
							}
							
							// Otherwise
							else {
						
								// Show get payment proof address error
								showGetPaymentProofAddressError(error);
							}
						}
					});
				}, WalletSection.GET_PAYMENT_PROOF_ADDRESS_DELAY_MILLISECONDS);
			});
			
			// Resync button click event
			this.getDisplay().find("button.resync").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show resync error
				var showResyncError = function(error) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Resync Error'), Message.createText(error), true, function() {
					
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
				};
				
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallets().getWallet(self.walletKeyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Show resync error
					showResyncError(error);
				
					// Return
					return;
				}
				
				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Resync'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Are you sure you want to resync Wallet %1$s?') : Language.getDefaultTranslation('Are you sure you want to resync %1$y?'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('Resyncing can take a significant amount of time to complete, and you won\'t be able to send payments from this wallet until it\'s finished resyncing.')) + ((Common.onReducedDataConnection() === true) ? Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Resyncing can also use a lot of data depending on the number of unspent transaction outputs present in the blockchain.')) : "") + "</b>", false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if resyncing
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
						
								// Resync wallet
								self.getWallets().resyncWallet(self.walletKeyPath).then(function() {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
								
										// Hide loading
										self.getApplication().hideLoading();
								
										// Enable unlocked
										self.getUnlocked().enable();
										
										// Set that button isn't clicked
										button.removeClass("clicked");
										
										// Delete focus
										self.getFocus().delete();
										
										// Hide message
										self.getMessage().hide();
										
										// Allow showing messages
										self.getMessage().allow();
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
								
										// Show resync error
										showResyncError(error);
									}
								});
							}, WalletSection.RESYNC_DELAY_MILLISECONDS);
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
			
			// Rename button click event
			this.getDisplay().find("button.rename").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show rename error
				var showRenameError = function(error) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Rename Error'), Message.createText(error), true, function() {
					
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
				};
				
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallets().getWallet(self.walletKeyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Show rename error
					showRenameError(error);
				
					// Return
					return;
				}

				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Rename'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Enter a new name for Wallet %1$s.') : Language.getDefaultTranslation('Enter a new name for %1$y.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + Message.createLineBreak() + Message.createInput(Language.getDefaultTranslation('Name'), [], false, true, true, true) + Message.createLineBreak(), false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('Cancel'), Language.getDefaultTranslation('Continue'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if continuing
						if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
						
							// Prevent showing messages
							self.getMessage().prevent();
							
							// Show loading
							self.getApplication().showLoading();
						
							// Set that message second button is loading
							self.getMessage().setButtonLoading(Message.SECOND_BUTTON);
							
							// Try
							try {
						
								// Get name
								var name = self.getMessage().getInputText().trim();
							}
							
							// Catch errors
							catch(error) {
							
								// Show rename error
								showRenameError(Language.getDefaultTranslation('Invalid name.'));
								
								// Return
								return;
							}
							
							// Disable message
							self.getMessage().disable();
							
							// Check if name is invalid
							if(name["length"] === 0) {
							
								// Show rename error
								showRenameError(Language.getDefaultTranslation('Invalid name.'));
							}
							
							// Otherwise
							else {
							
								// Prevent automatic lock
								self.getAutomaticLock().prevent();
								
								// Set timeout
								setTimeout(function() {
						
									// Rename wallet
									self.getWallets().renameWallet(self.walletKeyPath, name).then(function() {
									
										// Allow automatic lock
										self.getAutomaticLock().allow();
										
										// Check if automatic lock isn't locking
										if(self.getAutomaticLock().isLocking() === false) {
									
											// Show message immediately and allow showing messages
											self.getMessage().show(Language.getDefaultTranslation('Wallet Renamed'), Message.createText(Language.getDefaultTranslation('The wallet was successfully renamed.')), true, function() {
											
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
									
											// Show rename error
											showRenameError(error);
										}
									});
								}, WalletSection.RENAME_DELAY_MILLISECONDS);
							}
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
			
			// Receive payment as file button click event
			this.getDisplay().find("button.receivePaymentAsFile").on("click", function() {
			
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
				
				// Show receive payment as file error
				var showReceivePaymentAsFileError = function(error) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Receive Payment As File Error'), error, true, function() {
					
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
				
				// Prevent automatic lock
				self.getAutomaticLock().prevent();
				
				// Keep device awake and catch errors
				self.getWakeLock().preventLock().catch(function(error) {
				
				});
				
				// Prevent scrolling keys
				self.getScroll().preventKeys();
				
				// Block input
				$("body").addClass("blockInput");
				
				// Open file
				var openFile = function(file) {
				
					// Create file reader
					var fileReader = new FileReader();
					
					// File reader load event
					$(fileReader).one("load", function(event) {
					
						// Turn off file reader error event
						$(fileReader).off("error");
					
						// Get file's contents trimmed
						var filesContents = event["originalEvent"]["target"]["result"].trim();
						
						// Try
						try {
						
							// Get slate from file's contents parsed as JSON
							var slate = JSONBigNumber.parse(filesContents);
						}
						
						// Catch errors
						catch(error) {
						
							// Set slate to file's contents
							var slate = filesContents;
						}
						
						// Try
						try {
						
							// Get wallet
							var wallet = self.getWallets().getWallet(self.walletKeyPath);
						}
						
						// Catch errors
						catch(error) {
						
							// Allow device to sleep and catch errors
							self.getWakeLock().allowLock().catch(function(error) {
							
							// Finally
							}).finally(function() {
							
								// Allow automatic lock
								self.getAutomaticLock().allow();
								
								// Check if automatic lock isn't locking
								if(self.getAutomaticLock().isLocking() === false) {
						
									// Show receive payment as file error
									showReceivePaymentAsFileError(Message.createText(error));
								}
							});
						
							// Return
							return;
						}
						
						// Create interaction
						var interaction = new Interaction(Interaction.NO_INDEX, wallet.getKeyPath(), Api.FOREIGN_API_URL, "application/json", {
						
							// Version
							"jsonrpc": JsonRpc.VERSION,
							
							// ID
							"id": new BigNumber(JsonRpc.DEFAULT_ID),
							
							// Method
							"method": Api.RECEIVE_TRANSACTION_METHOD,
							
							// Parameters
							"params": [
							
								// Slate
								slate,
								
								// Destination account name
								null,
								
								// Message
								null,
							]
						});
						
						// Set timeout
						setTimeout(function() {
						
							// Create promise
							(new Promise(function(resolve, reject) {
						
								// Trigger listener request receive event for the interaction
								$(self.getWallets().listener).trigger(Listener.REQUEST_RECEIVE_EVENT, [
								
									// Interaction
									interaction,
									
									// Resolve
									resolve,
									
									// Reject
									reject
								]);
							
							// Interaction on success
							})).then(function(response) {
							
								// Get amount from response
								var amount = response[Listener.PROMISE_RESOLVE_AMOUNT_INDEX];
								
								// Get currency from response
								var currency = response[Listener.PROMISE_RESOLVE_CURRENCY_INDEX];
								
								// Get message from response
								var message = response[Listener.PROMISE_RESOLVE_MESSAGE_INDEX];
								
								// Get receiver address from response
								var receiverAddress = response[Listener.PROMISE_RESOLVE_RECEIVER_ADDRESS_INDEX];
								
								// Get file response from response
								var fileResponse = response[Listener.PROMISE_RESOLVE_FILE_RESPONSE_INDEX];
								
								// Get ID from response
								var id = response[Listener.PROMISE_RESOLVE_ID_INDEX];
								
								// Set file name
								var fileName = id.serialize() + ".response";
								
								// Create URL from contents
								var url = URL.createObjectURL(new Blob([
								
									// Contents
									fileResponse
								], {
								
									// Type
									"type": "application/octet-stream"
								}));
								
								// Get is raw data
								var isRawData = Common.hasWhitespace(message) === false;
								
								// Show message and allow showing messages
								self.getMessage().show(Language.getDefaultTranslation('Payment Received'), Message.createSuccessResult() + Message.createLineBreak() + Message.createText((message === SlateParticipant.NO_MESSAGE || message["length"] === 0) ? ((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('You were sent %1$c to Wallet %2$s.') : Language.getDefaultTranslation('You were sent %1$c to %2$y.')) : ((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('You were sent %1$c to Wallet %2$s with a message.') : Language.getDefaultTranslation('You were sent %1$c to %2$y with a message.')), [
								
									[
									
										// Number
										amount.toFixed(),
										
										// Currency
										currency,
						
										// Display value
										true
									],
									
									// Wallet key path or name
									(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()
									
								]) + ((message !== SlateParticipant.NO_MESSAGE && message["length"] !== 0) ? Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu" + ((isRawData === true) ? " rawData" : "") + "\">" + Common.htmlEncode(message) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('(?<=.) '))) + Message.createText(Language.getDefaultTranslation('Give the %1$m file to the payment\'s sender for them to finalize the transaction.'), [
				
									[
										// Text
										fileName,
										
										// URL
										url,
										
										// Is external
										true,
										
										// Is blob
										true
									]
								]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + ((receiverAddress !== Slate.NO_RECEIVER_ADDRESS) ? Message.createText(Language.getDefaultTranslation('The recipient payment proof address you used for the transaction is the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(receiverAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('The transaction doesn\'t have a payment proof.'))) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You shouldn\'t consider this payment to be legitimate until it\'s been confirmed on the blockchain.')) + "</b>", false, function() {
								
									// Hide loading
									self.getApplication().hideLoading();
									
									// Message show wallet section event
									$(self.getMessage()).one(Message.SHOW_EVENT + ".walletSection", function() {
									
										// Save file response
										Common.saveFile(fileName, fileResponse);
									});
								
								}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Turn off message show wallet section event
									$(self.getMessage()).off(Message.SHOW_EVENT + ".walletSection");
									
									// Revoke URL
									URL.revokeObjectURL(url);
								
									// Check if message was displayed
									if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
										// Allow device to sleep and catch errors
										self.getWakeLock().allowLock().catch(function(error) {
										
										// Finally
										}).finally(function() {
									
											// Allow automatic lock
											self.getAutomaticLock().allow();
											
											// Check if automatic lock isn't locking
											if(self.getAutomaticLock().isLocking() === false) {
									
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
									
									// Otherwise
									else {
									
										// Allow device to sleep and catch errors
										self.getWakeLock().allowLock().catch(function(error) {
										
										});
									}
								});
							
							// Interaction on failure
							}).catch(function(error) {
							
								// Allow device to sleep and catch errors
								self.getWakeLock().allowLock().catch(function(error) {
								
								// Finally
								}).finally(function() {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
									
										// Check if canceled
										if(error === Common.CANCELED_ERROR) {
										
											// Set that button isn't loading
											button.removeClass("loading");
											
											// Hide loading
											self.getApplication().hideLoading();
											
											// Enable unlocked
											self.getUnlocked().enable();
											
											// Set that button isn't clicked
											button.removeClass("clicked");
											
											// Restore focus and don't blur
											self.getFocus().restore(false);
											
											// Allow showing messages
											self.getMessage().allow();
										}
										
										// Otherwise
										else {
									
											// Check if error is a JSON-RPC error response
											if(JsonRpc.isErrorResponse(error) === true) {
										
												// Check error code
												switch(error["error"]["code"]) {
												
													// Internal error error
													case JsonRpc.INTERNAL_ERROR_ERROR:
													
														// Set text
														var text = Language.getDefaultTranslation('An internal error occurred.');
														
														// Break
														break;
													
													// Default
													default:
													
														// Set text
														var text = Language.getDefaultTranslation('That file is invalid, contains unsupported features, or was already used.');
														
														// Break
														break;
												}
											}
											
											// Otherwise check user rejected on hardware
											else if(error === HardwareWallet.USER_REJECTED_ERROR) {
											
												// Set text
												var text = Language.getDefaultTranslation('Approving the transaction on the hardware wallet was denied.');
											}
											
											// Otherwise
											else {
											
												// Set text
												var text = Language.getDefaultTranslation('An internal error occurred.');
											}
								
											// Show receive payment as file error
											showReceivePaymentAsFileError(Message.createFailureResult() + Message.createLineBreak() + Message.createText(text));
										}
									}
								});
							});
						
						}, WalletSection.RECEIVE_PAYMENT_AS_FILE_DELAY_MILLISECONDS);
						
					// File reader error event
					}).one("error", function() {
					
						// Turn off file reader load event
						$(fileReader).off("load");
						
						// Allow device to sleep and catch errors
						self.getWakeLock().allowLock().catch(function(error) {
						
						// Finally
						}).finally(function() {
						
							// Allow automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
							
								// Show receive payment as file error
								showReceivePaymentAsFileError(Message.createText(Language.getDefaultTranslation('Opening that file failed.')));
							}
						});
					});
					
					// Read file as text with file reader
					fileReader.readAsText(file);
				};
				
				// Open file canceled
				var openFileCanceled = function() {
				
					// Allow scrolling keys
					self.getScroll().allowKeys();
					
					// Unblock input
					$("body").removeClass("blockInput");
					
					// Allow device to sleep and catch errors
					self.getWakeLock().allowLock().catch(function(error) {
					
					// Finally
					}).finally(function() {
					
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
							
							// Restore focus and don't blur
							self.getFocus().restore(false);
							
							// Allow showing messages
							self.getMessage().allow();
						}
					});
				};
				
				// Check if File System API is supported
				if(typeof showOpenFilePicker === "function") {
				
					// Show open file picker
					showOpenFilePicker().then(function(fileHandles) {
					
						// Allow scrolling keys
						self.getScroll().allowKeys();
						
						// Unblock input
						$("body").removeClass("blockInput");
						
						// Check if no file was selected
						if(fileHandles["length"] <= 0) {
						
							// Allow device to sleep and catch errors
							self.getWakeLock().allowLock().catch(function(error) {
							
							// Finally
							}).finally(function() {
							
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
									
									// Restore focus and don't blur
									self.getFocus().restore(false);
									
									// Allow showing messages
									self.getMessage().allow();
								}
							});
						}
						
						// Otherwise
						else {
						
							// Get selected file
							fileHandles[0].getFile().then(function(file) {
							
								// Open file
								openFile(file);
								
							// Catch errors
							}).catch(function(error) {
							
								// Allow device to sleep and catch errors
								self.getWakeLock().allowLock().catch(function(error) {
								
								// Finally
								}).finally(function() {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
									
										// Show receive payment as file error
										showReceivePaymentAsFileError(Message.createText(Language.getDefaultTranslation('Opening that file failed.')));
									}
								});
							});
						}
						
					// Catch errors
					}).catch(function(error) {
					
						// Open file canceled
						openFileCanceled();
					});
				}
				
				// Otherwise
				else {
				
					// Create file input
					var fileInput = $("<input type=\"file\">");
					
					// Set file selected to false
					var fileSelected = false;
					
					// File input change event
					fileInput.one("change", function(event) {
					
						// Set file selected
						fileSelected = true;
					
						// Turn off window focus wallet section event
						$(window).off("focus.walletSection");
						
						// Allow scrolling keys
						self.getScroll().allowKeys();
						
						// Unblock input
						$("body").removeClass("blockInput");
						
						// Get files
						var files = event["target"]["files"];
						
						// Check if no file was selected
						if(files["length"] <= 0) {
						
							// Allow device to sleep and catch errors
							self.getWakeLock().allowLock().catch(function(error) {
							
							// Finally
							}).finally(function() {
							
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
									
									// Restore focus and don't blur
									self.getFocus().restore(false);
									
									// Allow showing messages
									self.getMessage().allow();
								}
							});
						}
						
						// Otherwise
						else {
						
							// Get file
							var file = files[0];
							
							// Open file
							openFile(file);
						}
					});
					
					// Window focus wallet section event
					$(window).one("focus.walletSection", function() {
					
						// Set timeout
						setTimeout(function() {
						
							// Check if a file isn't selected
							if(fileSelected === false) {
					
								// Turn off file input change event
								fileInput.off("change");
								
								// Open file canceled
								openFileCanceled();
							}
						}, WalletSection.FILE_INPUT_CANCEL_CHECK_DELAY_MILLISECONDS);
					});
					
					// Trigger file input selection
					fileInput.trigger("click");
				}
			});
			
			// Delete button click event
			this.getDisplay().find("button.delete").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show delete error
				var showDeleteError = function(error) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Delete Error'), Message.createText(error), true, function() {
					
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
				};
				
				// Try
				try {
				
					// Get wallet
					var wallet = self.getWallets().getWallet(self.walletKeyPath);
				}
				
				// Catch errors
				catch(error) {
				
					// Show delete error
					showDeleteError(error);
				
					// Return
					return;
				}
				
				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Delete'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Are you sure you want to delete Wallet %1$s?') : Language.getDefaultTranslation('Are you sure you want to delete %1$y?'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()]) + Message.createLineBreak() + "<b>" + Message.createText((wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) ? Language.getDefaultTranslation('This wallet can only be recovered by using its passphrase once it\'s been deleted.') : Language.getDefaultTranslation('This wallet can only be recovered by using its passphrase or hardware wallet once it\'s been deleted.')) + "</b>", false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED, true).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if deleting
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
							
								// Save sections stack
								var stack = self.getSections().getStack();
								var stackIndex = self.getSections().getStackIndex();
							
								// Clear sections stack
								self.getSections().clearStack(true).then(function() {
							
									// Remove wallet
									self.getWallets().removeWallet(self.walletKeyPath).then(function() {
									
										// Get wallet button
										var walletButton = self.getUnlocked().walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + self.walletKeyPath.toFixed() + "\"]");
										
										// Get next wallet button
										var nextWalletButton = (walletButton.prev()["length"] !== 0) ? walletButton.prev() : walletButton.next();
									
										// Remove unlocked wallet button
										self.getUnlocked().removeWalletButton(self.walletKeyPath).then(function() {
										
											// Check if no more wallets exist
											if(self.getWallets().exist() === false) {
											
												// Set that button isn't clicked
												button.removeClass("clicked");
												
												// Delete focus
												self.getFocus().delete();
											
												// Show create display
												self.getApplication().showCreateDisplay();
											}
											
											// Otherwise
											else {
										
												// Allow automatic lock
												self.getAutomaticLock().allow();
												
												// Check if automatic lock isn't locking
												if(self.getAutomaticLock().isLocking() === false) {
										
													// Set that button isn't clicked
													button.removeClass("clicked");
													
													// Delete focus
													self.getFocus().delete();
													
													// Hide message
													self.getMessage().hide();
													
													// Set that next wallet button is clicked
													nextWalletButton.addClass("clicked");
													
													// Update unlocked wallets order buttons
													self.getUnlocked().updateWalletsOrderButtons();
													
													// Show wallet section and catch errors
													self.getSections().showSection(WalletSection.NAME, false, {
													
														// Wallet key path
														[WalletSection.STATE_WALLET_KEY_PATH_NAME]: parseInt(nextWalletButton.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE)
														
													}).catch(function(error) {
													
														// Set that next wallet button isn't clicked
														nextWalletButton.removeClass("clicked");
													});
												}
											}
										});
									
									// Catch errors
									}).catch(function(error) {
									
										// Restore sections stack
										self.getSections().setStack(stack);
										self.getSections().setStackIndex(stackIndex);
										
										// Save stack
										self.getSections().saveStack().then(function() {
					
											// Allow automatic lock
											self.getAutomaticLock().allow();
											
											// Check if automatic lock isn't locking
											if(self.getAutomaticLock().isLocking() === false) {
										
												// Show delete error
												showDeleteError(error);
											}
									
										// Catch errors
										}).catch(function(error) {
										
											// Trigger a fatal error
											new FatalError(FatalError.UNKNOWN_ERROR);
										});
									});
								
								// Catch errors
								}).catch(function(error) {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
								
										// Show delete error
										showDeleteError(error);
									}
								});
							}, WalletSection.DELETE_DELAY_MILLISECONDS);
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
			
			// Transactions navigation display buttons click event
			this.transactionsNavigationDisplay.find("button").on("click", function() {
			
				// Get button
				var button = $(this);
			
				// Check if button isn't disabled
				if(button.hasClass("disabled") === false) {
				
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
					
					// Prevent automatic lock
					self.automaticLock.prevent();
					
					// Show transactions display loading
					self.transactionsDisplay.addClass("loading");
					
					// Show transactions navigation error
					var showTransactionsNavigationError = function(error) {
					
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('Transactions Navigation Error'), Message.createText(error), false, function() {
						
							// Hide loading
							self.getApplication().hideLoading();
							
							// Hide transactions display loading
							self.transactionsDisplay.removeClass("loading");
						
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
					};
					
					// Create a database transaction to prevent transactions from changing
					Database.createTransaction(Transactions.OBJECT_STORE_NAME, Database.READ_MODE, Database.RELAXED_DURABILITY, false).then(function(databaseTransaction) {
					
						// Check if first button was clicked
						if(button.hasClass("first") === true) {
						
							// Set new transactions group to the first group
							var newTransactionsGroup = 0;
						}
						
						// Otherwise check if previous button was clicked
						else if(button.hasClass("previous") === true) {
						
							// Set new transactions group to the previous group
							var newTransactionsGroup = self.transactionsGroup - 1;
						}
						
						// Otherwise check if next button was clicked
						else if(button.hasClass("next") === true) {
						
							// Set new transactions group to thenext group
							var newTransactionsGroup = self.transactionsGroup + 1;
						}
						
						// Otherwise check if last button was clicked
						else if(button.hasClass("last") === true) {
						
							// Set new transactions group to the last group
							var newTransactionsGroup = Math.floor((self.numberOfTransactions - 1) / WalletSection.TRANSACTIONS_GROUP_SIZE);
						}
						
						// Get the wallet's display transactions in the group
						self.getTransactions().getWalletsDisplayTransactions(self.walletKeyPath, newTransactionsGroup * WalletSection.TRANSACTIONS_GROUP_SIZE, WalletSection.TRANSACTIONS_GROUP_SIZE, databaseTransaction).then(function(transactions) {
						
							// Set timeout
							setTimeout(function() {
						
								// Set transactions group to the new transactions group
								self.transactionsGroup = newTransactionsGroup;
								
								// Remove all transaction buttons
								self.transactionsDisplay.empty();
									
								// Go through all transactions
								for(var i = 0; i < transactions["length"]; ++i) {
								
									// Get transaction
									var transaction = transactions[i];
									
									// Create transaction button
									var button = self.createTransactionButton(transaction);
									
									// Prevent button from transitioning
									button.addClass("noTransition");
									
									// Get index
									var index = ((transactions["length"] === WalletSection.TRANSACTIONS_GROUP_SIZE) ? self.numberOfTransactions - (self.transactionsGroup + 1) * WalletSection.TRANSACTIONS_GROUP_SIZE : 0) + transactions["length"] - i;
									
									// Set button's name index
									button.find("span.name").find("span.index").replaceWith(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('#%1$s'), [index.toFixed()], "index"));
									
									// Set button's index
									button.attr(Common.DATA_ATTRIBUTE_PREFIX + "index", index.toFixed());
									
									// Append button to transactions display
									self.transactionsDisplay.append(button);
								}
								
								// Update transactions navigation buttons
								self.updateTransactionsNavigationButtons();
								
								// Update state and catch errors
								self.updateState().catch(function(error) {
								
								});
								
								// Set timeout
								setTimeout(function() {
								
									// Allow transaction buttons to transition
									self.transactionsDisplay.find("button").removeClass("noTransition");
									
									// Commit database transaction and catch errors
									Database.commitTransaction(databaseTransaction).catch(function(error) {
									
									// Finally
									}).finally(function() {
									
										// Allow automatic lock
										self.automaticLock.allow();
										
										// Check if automatic lock isn't locking
										if(self.automaticLock.isLocking() === false) {
										
											// Hide loading
											self.getApplication().hideLoading();
											
											// Hide transactions display loading
											self.transactionsDisplay.removeClass("loading");
											
											// Enable unlocked
											self.getUnlocked().enable();
											
											// Set that button isn't clicked
											button.removeClass("clicked");
											
											// Delete focus
											self.getFocus().delete();
											
											// Allow showing messages
											self.getMessage().allow();
										}
									});
								}, 0);
							}, WalletSection.NAVIGATE_TRANSACTIONS_DELAY_MILLISECONDS);
						
						// Catch errors
						}).catch(function(error) {
						
							// Abort database transaction and catch errors
							Database.abortTransaction(databaseTransaction).catch(function(error) {
							
							// Finally
							}).finally(function() {
						
								// Allow automatic lock
								self.automaticLock.allow();
								
								// Check if automatic lock isn't locking
								if(self.automaticLock.isLocking() === false) {
							
									// Show transactions navigation error
									showTransactionsNavigationError(error);
								}
							});
						});
						
					// Catch errors
					}).catch(function(error) {
					
						// Allow automatic lock
						self.automaticLock.allow();
						
						// Check if automatic lock isn't locking
						if(self.automaticLock.isLocking() === false) {
					
							// Show transactions navigation error
							showTransactionsNavigationError(Language.getDefaultTranslation('The database failed.'));
						}
					});
				}
			});
		}
		
		// Get name
		getName() {
		
			// Return name
			return WalletSection.NAME;
		}
		
		// Reset
		reset() {
		
			// Turn off wallet section shown event
			$(this).off(Section.SHOWN_EVENT + ".walletSection");
			
			// Check if initialize database transaction exists
			if(this.initializeDatabaseTransaction !== WalletSection.NO_INITIALIZE_DATABASE_TRANSACTION) {
			
				// Set self
				var self = this;
				
				// Abort initialize database transaction and catch errors
				Database.abortTransaction(this.initializeDatabaseTransaction).catch(function(error) {
				
				// Finally
				}).finally(function() {
				
					// Set initialize database transaction to no initialize database transaction
					self.initializeDatabaseTransaction = WalletSection.NO_INITIALIZE_DATABASE_TRANSACTION;
				});
			}
		
			// Reset
			super.reset();
			
			// Remove navigation display's wallet name
			this.navigationDisplay.find("h2").remove();
			
			// Set that address display doesn't show loading
			this.addressDisplay.removeClass("loading");
			
			// Remove shown balance
			this.balanceDisplay.children("p").remove();
			
			// Set that balance doesn't show syncing or failed and allow it to transition
			this.balanceDisplay.removeClass("syncing failed instant");
			
			// Reset shown syncing percent and allow it to transition
			this.balanceDisplay.find("circle.foreground").removeClass("noTransition").css("stroke-dashoffset", WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET.toString());
			
			// Remove percent display from balance display
			this.balanceDisplay.find("div.syncStatus").find("span").remove();
			
			// Allow balance display sync status to transition
			this.balanceDisplay.find("div.syncStatus").removeClass("noTransition");
			
			// Clear transactions display and show no transactions display
			this.transactionsDisplay.empty().addClass("empty").removeClass("loading").next().removeClass("hide noTransition");
			
			// Set that buttons aren't clicked or loading
			this.getDisplay().find("button").removeClass("clicked loading");
			
			// Turn off address display loading transition end or timeout event
			this.addressDisplay.find("div.loading").offTransitionEndOrTimeout();
			
			// Turn off balance syncing status transition end or timeout event
			this.balanceDisplay.find("div.syncStatus").offTransitionEndOrTimeout();
			
			// Turn off shown syncing percent transition end or timeout event
			this.balanceDisplay.find("circle.foreground").offTransitionEndOrTimeout();
			
			// Set that transactions navigation display buttons are enabled and not clicked
			this.transactionsNavigationDisplay.find("button").removeClass("disabled clicked");
			
			// Clear showing sync done
			this.showingSyncDone = false;
		}
		
		// Get state
		getState() {
		
			// Get state
			var state = super.getState();
			
			// Set state's wallet key path
			state[WalletSection.STATE_WALLET_KEY_PATH_NAME] = this.walletKeyPath;
			
			// Set state's transactions group
			state[WalletSection.STATE_TRANSACTIONS_GROUP_NAME] = this.transactionsGroup;
			
			// Return state
			return state;
		}
		
		// Name
		static get NAME() {
		
			// Return name
			return "Wallet";
		}
		
		// State wallet key path name
		static get STATE_WALLET_KEY_PATH_NAME() {
		
			// Return state wallet key path name
			return "Wallet Key Path";
		}
		
		// State transactions group name
		static get STATE_TRANSACTIONS_GROUP_NAME() {
		
			// Return state transactions group name
			return "Transactions Group";
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
				
					// Set wallet key path to value in state or set it to the first wallet key path if there is no state
					self.walletKeyPath = (state !== Section.NO_STATE) ? state[WalletSection.STATE_WALLET_KEY_PATH_NAME] : self.getWallets().getWalletsInOrder()[0].getKeyPath();
					
					// Set transactions group to value in state or set it to the first group if there is no state or it doesn't exist
					self.transactionsGroup = (state !== Section.NO_STATE && WalletSection.STATE_TRANSACTIONS_GROUP_NAME in state === true) ? state[WalletSection.STATE_TRANSACTIONS_GROUP_NAME] : 0;
					
					// Return creating a database transaction to prevent wallets or transactions from changing
					return Database.createTransaction([
					
						// Wallets object store
						Wallets.OBJECT_STORE_NAME,
						
						// Transactions object store
						Transactions.OBJECT_STORE_NAME,
						
					], Database.READ_MODE, Database.RELAXED_DURABILITY, false).then(function(databaseTransaction) {
					
						// Set initialize database transaction
						self.initializeDatabaseTransaction = databaseTransaction;
					
						// Try
						try {
						
							// Get wallet
							var wallet = self.getWallets().getWallet(self.walletKeyPath);
						}
						
						// Catch errors
						catch(error) {
						
							// Reject error
							reject(error);
							
							// Return
							return;
						}
						
						// Check if wallet has no name
						if(wallet.getName() === Wallet.NO_NAME)
						
							// Show wallets name to default name in the navigation display
							self.navigationDisplay.children("button").first().after(Language.createTranslatableContainer("<h2>", Language.getDefaultTranslation('Wallet %1$s'), [self.walletKeyPath.toFixed()]));
						
						// Otherwise
						else
						
							// Show wallet's name in the navigation display
							self.navigationDisplay.children("button").first().after("<h2>" + Common.htmlEncode(wallet.getName()) + "</h2>");
						
						// Try
						try {
						
							// Update QR code
							self.updateQrCode();
							
							// Update balance
							self.updateBalance();
						}
						
						// Catch errors
						catch(error) {
						
							// Reject error
							reject(error);
							
							// Return
							return;
						}
						
						// Prevent address display loading from transitioning
						self.addressDisplay.find("div.loading").addClass("noTransition");
						
						// Section shown event
						$(self).one(Section.SHOWN_EVENT, function() {
						
							// Allow address display loading to transition
							self.addressDisplay.find("div.loading").removeClass("noTransition");
						});
						
						// Check wallet's syncing status
						switch(wallet.getSyncingStatus()) {
						
							// Syncing or resyncing
							case Wallet.STATUS_SYNCING:
							case Wallet.STATUS_RESYNCING:
						
								// Set that balance shows syncing and prevent it from transitioning
								self.balanceDisplay.addClass("syncing instant");
								
								// Prevent balance display sync status from transitioning
								self.balanceDisplay.find("div.syncStatus").addClass("noTransition");
								
								// Section shown event
								$(self).one(Section.SHOWN_EVENT, function() {
								
									// Allow balance display to transition
									self.balanceDisplay.removeClass("instant");
									
									// Allow balance display sync status to transition
									self.balanceDisplay.find("div.syncStatus").removeClass("noTransition");
								});
								
								// Set shown syncing percent
								self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", Common.map(wallet.getPercentSynced(), Wallets.MINIMUM_PERCENT, Wallets.MAXIMUM_PERCENT, WalletSection.SYNCING_MINIMUM_STROKE_DASH_OFFSET, WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET).toFixed());
								
								// Append percent display to balance display
								self.balanceDisplay.find("div.syncStatus").append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$s%%'), [wallet.getPercentSynced().toFixed(0, BigNumber.ROUND_FLOOR)]));
								
								// Break
								break;
							
							// Error
							case Wallet.STATUS_ERROR:
							
								// Set that balance shows syncing and prevent it from transitioning
								self.balanceDisplay.addClass("syncing instant");
								
								// Prevent balance display sync status from transitioning
								self.balanceDisplay.find("div.syncStatus").addClass("noTransition");
								
								// Section shown event
								$(self).one(Section.SHOWN_EVENT, function() {
								
									// Allow balance display to transition
									self.balanceDisplay.removeClass("instant");
									
									// Allow balance display sync status to transition
									self.balanceDisplay.find("div.syncStatus").removeClass("noTransition");
								});
								
								// Set shown syncing percent
								self.balanceDisplay.find("circle.foreground").css("stroke-dashoffset", Common.map(wallet.getPercentSynced(), Wallets.MINIMUM_PERCENT, Wallets.MAXIMUM_PERCENT, WalletSection.SYNCING_MINIMUM_STROKE_DASH_OFFSET, WalletSection.SYNCING_MAXIMUM_STROKE_DASH_OFFSET).toFixed());
								
								// Append percent display to balance display
								self.balanceDisplay.find("div.syncStatus").append(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$s%%'), [wallet.getPercentSynced().toFixed(0, BigNumber.ROUND_FLOOR)]));
								
								// Show syncing failed message
								self.balanceDisplay.addClass("failed");
							
								// Break
								break;
							
							// Synced
							case Wallet.STATUS_SYNCED:
							
								// Prevent balance display from transitioning
								self.balanceDisplay.addClass("instant");
								
								// Prevent balance display sync status from transitioning
								self.balanceDisplay.find("div.syncStatus").addClass("noTransition");
								
								// Section shown event
								$(self).one(Section.SHOWN_EVENT, function() {
								
									// Allow balance display to transition
									self.balanceDisplay.removeClass("instant");
									
									// Allow balance display sync status to transition
									self.balanceDisplay.find("div.syncStatus").removeClass("noTransition");
								});
								
								// Break
								break;
						}
						
						// Return getting the wallet's newest display transactions
						return self.getTransactions().getWalletsDisplayTransactions(self.walletKeyPath, 0, 1, self.initializeDatabaseTransaction).then(function(newestTransaction) {
						
							// Set newest transaction key path to the transaction's key path or no newest transaction key path if it doesn't exist
							self.newestTransactionKeyPath = (newestTransaction["length"] !== 0) ? newestTransaction[0].getKeyPath() : WalletSection.NO_NEWEST_TRANSACTION_KEY_PATH;
							
							// Return getting number of wallet's display transactions
							return self.getTransactions().getNumberOfWalletsDisplayTransactions(self.walletKeyPath, self.initializeDatabaseTransaction).then(function(numberOfTransactions) {
							
								// Set number of transactions
								self.numberOfTransactions = numberOfTransactions;
								
								// Check if transactions exist and transactions group doesn't exist
								if(self.numberOfTransactions !== 0 && self.transactionsGroup * WalletSection.TRANSACTIONS_GROUP_SIZE >= self.numberOfTransactions) {
								
									// Set transactions group to the last group
									self.transactionsGroup = Math.floor((self.numberOfTransactions - 1) / WalletSection.TRANSACTIONS_GROUP_SIZE);
								}
								
								// Return getting the wallet's display transactions in the group
								return self.getTransactions().getWalletsDisplayTransactions(self.walletKeyPath, self.transactionsGroup * WalletSection.TRANSACTIONS_GROUP_SIZE, WalletSection.TRANSACTIONS_GROUP_SIZE, self.initializeDatabaseTransaction).then(function(transactions) {
								
									// Check if transactions exists
									if(transactions["length"] !== 0) {
									
										// Show transactions display and hide no transactions display
										self.transactionsDisplay.removeClass("empty").next().addClass("hide noTransition");
									}
									
									// Go through all transactions
									for(var i = 0; i < transactions["length"]; ++i) {
									
										// Get transaction
										var transaction = transactions[i];
										
										// Create transaction button
										var button = self.createTransactionButton(transaction);
										
										// Prevent button from transitioning
										button.addClass("noTransition");
										
										// Get index
										var index = ((transactions["length"] === WalletSection.TRANSACTIONS_GROUP_SIZE) ? self.numberOfTransactions - (self.transactionsGroup + 1) * WalletSection.TRANSACTIONS_GROUP_SIZE : 0) + transactions["length"] - i;
										
										// Set button's name index
										button.find("span.name").find("span.index").replaceWith(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('#%1$s'), [index.toFixed()], "index"));
										
										// Set button's index
										button.attr(Common.DATA_ATTRIBUTE_PREFIX + "index", index.toFixed());
										
										// Append button to transactions display
										self.transactionsDisplay.append(button);
									}
									
									// Update transactions navigation buttons
									self.updateTransactionsNavigationButtons();
									
									// Wallet section shown event
									$(self).one(Section.SHOWN_EVENT + ".walletSection", function() {
									
										// Allow no transactions display to transition
										self.transactionsDisplay.next().removeClass("noTransition");
										
										// Allow transaction buttons to transition
										self.transactionsDisplay.find("button").removeClass("noTransition");
									
										// Try
										try {
									
											// Update balance
											self.updateBalance();
										}
										
										// Catch errors
										catch(error) {
										
										}
										
										// Update transactions values
										self.updateTransactionsValues();
										
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
								
								// Reject error
								}).catch(function(error) {
								
									// Reject error
									reject(error);
								});
							
							// Reject error
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						
						// Reject error
						}).catch(function(error) {
						
							// Reject error
							reject(error);
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
			return Language.getDefaultTranslation('Wallet Error');
		}
		
		// Update QR code
		updateQrCode() {
		
			// Try
			try {
			
				// Get wallet
				var wallet = this.getWallets().getWallet(this.walletKeyPath);
			}
			
			// Catch errors
			catch(error) {
			
				// Throw error
				throw error;
			}
			
			// Check if wallet has an address
			if(wallet.getAddressSuffix() !== Wallet.NO_ADDRESS_SUFFIX) {
			
				// Get wallet's address
				var address = wallet.getAddress(this.getUnlocked().getDisplayedAddressType());
				
				// Create QR code from address
				qrcode["stringToBytes"] = qrcode.stringToBytesFuncs["UTF-8"];
				var qrCode = qrcode(WalletSection.QR_CODE_AUTO_DETECT_VERSION, WalletSection.QR_CODE_ERROR_CORRECTION_LEVEL);
				qrCode.addData(address, "Byte");
				qrCode.make();
				
				// Check if address display is visible and is shown
				if(this.addressDisplay.is(":visible") === true && this.isShown() === true) {
				
					// Have address display show loading
					this.addressDisplay.addClass("loading");
					
					// Blur address display's buttons
					this.addressDisplay.find("button").blur();
					
					// Set self
					var self = this;
					
					// Address display loading transition end or timeout event
					this.addressDisplay.find("div.loading").transitionEndOrTimeout(function() {
					
						// Check if shown
						if(self.isShown() === true) {
						
							// Check if the address didn't change
							if(address === wallet.getAddress(self.getUnlocked().getDisplayedAddressType())) {
							
								// Replace address display's QR code
								self.addressDisplay.find("img").replaceWith(qrCode.createImgTag());
								
								// Replace address display's address
								self.addressDisplay.find("p").replaceWith("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "<span class=\"contextMenu\">" + Common.htmlEncode(address) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</p>");
								
								// Set timeout
								setTimeout(function() {
								
									// Check if shown
									if(self.isShown() === true) {
									
										// Check if the address didn't change
										if(address === wallet.getAddress(self.getUnlocked().getDisplayedAddressType())) {
								
											// Have address display not show loading
											self.addressDisplay.removeClass("loading");
										}
									}
								}, WalletSection.ADDRESS_BEFORE_SHOW_DELAY_MILLISECONDS);
							}
						}
					}, "opacity");
				}
				
				// Otherwise
				else {
				
					// Replace address display's QR code
					this.addressDisplay.find("img").replaceWith(qrCode.createImgTag());
					
					// Replace address display's address
					this.addressDisplay.find("p").replaceWith("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Address:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + "<span class=\"contextMenu\">" + Common.htmlEncode(address) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</p>");
					
					// Have address display not show loading
					this.addressDisplay.removeClass("loading");
				}
			}
			
			// Otherwise
			else {
			
				// Have address display show loading
				this.addressDisplay.addClass("loading");
				
				// Blur address display's buttons
				this.addressDisplay.find("button").blur();
			}
		}
		
		// Update balance
		updateBalance() {
		
			// Try
			try {
			
				// Get wallet
				var wallet = this.getWallets().getWallet(this.walletKeyPath);
			}
			
			// Catch errors
			catch(error) {
			
				// Throw error
				throw error;
			}
			
			// Remove shown balance
			this.balanceDisplay.children("p").remove();
			
			// Get currency
			var currency = this.getUnlocked().getDisplayedCurrency();
			
			// Get price in the currency
			var price = this.getPrices().getPrice(currency);
			
			// Append spendable amount to balance display
			this.balanceDisplay.find("button").before("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Spendable amount:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$c", [
				[
					// Amount
					wallet.getUnspentAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
					
					// Currency
					Consensus.CURRENCY_NAME
				]
			], "contextMenu") + ((price !== Prices.NO_PRICE_FOUND) ? Language.createTranslatableContainer("<span>", Language.getDefaultTranslation(',(?= )')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=,) ')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$c", [
				[
					// Amount
					wallet.getUnspentAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).multipliedBy(price).toFixed(),
					
					// Currency
					currency
				]
			], "contextMenu") : "") + "</p>");
			
			// Append confirmed amount to balance display
			this.balanceDisplay.find("button").before("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed amount:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$c", [
				[
					// Amount
					wallet.getUnspentAmount().plus(wallet.getPendingAmount()).dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
					
					// Currency
					Consensus.CURRENCY_NAME
				]
			], "contextMenu") + ((price !== Prices.NO_PRICE_FOUND) ? Language.createTranslatableContainer("<span>", Language.getDefaultTranslation(',(?= )')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=,) ')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$c", [
				[
					// Amount
					wallet.getUnspentAmount().plus(wallet.getPendingAmount()).dividedBy(Consensus.VALUE_NUMBER_BASE).multipliedBy(price).toFixed(),
					
					// Currency
					currency
				]
			], "contextMenu") : "") + "</p>");
			
			// Append unconfirmed amount to balance display
			this.balanceDisplay.find("button").before("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Unconfirmed amount:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$c", [
				[
					// Amount
					wallet.getUnconfirmedAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
					
					// Currency
					Consensus.CURRENCY_NAME
				]
			], "contextMenu") + ((price !== Prices.NO_PRICE_FOUND) ? Language.createTranslatableContainer("<span>", Language.getDefaultTranslation(',(?= )')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=,) ')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$c", [
				[
					// Amount
					wallet.getUnconfirmedAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).multipliedBy(price).toFixed(),
					
					// Currency
					currency
				]
			], "contextMenu") : "") + "</p>");
		}
		
		// Update transactions values
		updateTransactionsValues() {
		
			// Get currency
			var currency = this.getUnlocked().getDisplayedCurrency();
			
			// Get price in the currency
			var price = this.getPrices().getPrice(currency);
			
			// Go through all transactions buttons
			this.transactionsDisplay.find("button").each(function() {
			
				// Get button
				var button = $(this);
				
				// Get value display
				var valueDisplay = button.find("span.totals").find("span.value");
				
				// Check if price exsist
				if(price !== Prices.NO_PRICE_FOUND) {
				
					// Get amount display
					var amountDisplay = button.find("span.totals").find("span.amount");
					
					// Get amount
					var amount = new BigNumber(JSON.parse(amountDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments"))[0][Language.CURRENCY_NUMBER_ARGUMENT_INDEX]);
					
					// Get value in currency
					var valueInCurrency = Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value: %1$c'), [[amount.multipliedBy(price).toFixed(), currency]], "value");
					
					// Check if value display exists
					if(valueDisplay["length"] !== 0) {
					
						// Replace value display
						valueDisplay.replaceWith(valueInCurrency);
					}
					
					// Otherwise
					else {
					
						// Add value after amount display
						amountDisplay.after(valueInCurrency);
					}
				}
				
				// Otherwise
				else {
				
					// Remove value display
					valueDisplay.remove();
				}
			});
		}
		
		// Create transaction button
		createTransactionButton(transaction) {
		
			// Get currency
			var currency = this.getUnlocked().getDisplayedCurrency();
			
			// Get price in the currency
			var price = this.getPrices().getPrice(currency);
		
			// Create button
			var button = $("<button class=\"" + ((transaction.getIsCoinbase() === true) ? "coinbase" : ((transaction.getReceived() === true) ? "received" : "sent")) + "\">" +
				"<span class=\"name\">" +
					"<span>" +
						"<span class=\"index\"></span>" +
						Language.createTranslatableContainer("<span>", (transaction.getIsCoinbase() === true) ? Language.getDefaultTranslation('Coinbase') : ((transaction.getReceived() === true) ? Language.getDefaultTranslation('Received') : Language.getDefaultTranslation('Sent')), [], "type", true) +
						Language.createTranslatableContainer("<span>", (transaction.getIsCoinbase() === true) ? Language.getDefaultTranslation('Coinbase') : ((transaction.getReceived() === true) ? Language.getDefaultTranslation('Received') : Language.getDefaultTranslation('Sent'))) +
					"</span>" +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$d at %2$t'), [(transaction.getRecordedTimestamp() / Common.MILLISECONDS_IN_A_SECOND).toFixed(), (transaction.getRecordedTimestamp() / Common.MILLISECONDS_IN_A_SECOND).toFixed()]) +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Canceled'), [], "status canceled", true) +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Expired'), [], "status expired", true) +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Unconfirmed'), [], "status unconfirmed", true) +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Confirmed'), [], "status confirmed", true) +
				"</span>" +
				"<span class=\"totals\">" +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount: %1$c'), [[transaction.getAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(), Consensus.CURRENCY_NAME]], "amount") +
					((price !== Prices.NO_PRICE_FOUND) ? Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value: %1$c'), [[transaction.getAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).multipliedBy(price).toFixed(), currency]], "value") : "") +
				"</span>" +
				"<span class=\"id\">" +
					"<p>" + ((transaction.getId() !== Transaction.UNKNOWN_ID) ? Common.htmlEncode(transaction.getId().serialize()) : "") + "</p>" +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) +
				"</span>" +
			"</button>");
			
			// Check if transaction is canceled
			if(transaction.getCanceled() === true) {
			
				// Set that button shows canceled
				button.addClass("canceled");
			}
			
			// Otherwise check if transaction is expired
			else if(transaction.getExpired() === true) {
			
				// Set that button shows expired
				button.addClass("expired");
			}
			
			// Otherwise
			else {
			
				// Check if received
				if(transaction.getReceived() === true) {
				
					// Check if transaction is unconfirmed
					if(transaction.getStatus() === Transaction.STATUS_UNCONFIRMED) {
					
						// Set that button shows unconfirmed
						button.addClass("unconfirmed");
					}
					
					// Otherwise
					else {
					
						// Set that button shows confirmed
						button.addClass("confirmed");
					}
				}
				
				// Otherwise
				else {
				
					// Check if transaction is unconfirmed
					if(transaction.getAmountReleased() === false) {
					
						// Set that button shows unconfirmed
						button.addClass("unconfirmed");
					}
					
					// Otherwise
					else {
					
						// Set that button shows confirmed
						button.addClass("confirmed");
					}
				}
			}
			
			// Set button's key path
			button.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath", transaction.getKeyPath().toFixed());
			
			// Check if unlocked is disabled
			if(this.getUnlocked().isDisabled() === true) {
			
				// Disable tabbing to the button and disable the button
				button.disableTab().disable();
			}
			
			// Return button
			return button;
		}
		
		// Update transactions navigation buttons
		updateTransactionsNavigationButtons() {
		
			// Check if at the first transactions group
			if(this.transactionsGroup === 0) {
			
				// Disable transactions navigation display's first button
				this.transactionsNavigationDisplay.find("button.first").addClass("disabled");
				
				// Disable transactions navigation display's previous button
				this.transactionsNavigationDisplay.find("button.previous").addClass("disabled");
			}
			
			// Otherwise
			else {
			
				// Enable transactions navigation display's first button
				this.transactionsNavigationDisplay.find("button.first").removeClass("disabled");
				
				// Enable transactions navigation display's previous button
				this.transactionsNavigationDisplay.find("button.previous").removeClass("disabled");
			}
			
			// Check if at the last transactions group
			if((this.transactionsGroup + 1) * WalletSection.TRANSACTIONS_GROUP_SIZE >= this.numberOfTransactions) {
			
				// Disable transactions navigation display's last button
				this.transactionsNavigationDisplay.find("button.last").addClass("disabled");
				
				// Disable transactions navigation display's next button
				this.transactionsNavigationDisplay.find("button.next").addClass("disabled");
			}
			
			// Otherwise
			else {
			
				// Enable transactions navigation display's last button
				this.transactionsNavigationDisplay.find("button.last").removeClass("disabled");
				
				// Enable transactions navigation display's next button
				this.transactionsNavigationDisplay.find("button.next").removeClass("disabled");
			}
		}
		
		// QR code auto detect version
		static get QR_CODE_AUTO_DETECT_VERSION() {
		
			// Return QR code auto detect version
			return 0;
		}
		
		// QR code error correction level
		static get QR_CODE_ERROR_CORRECTION_LEVEL() {
		
			// Return QR code error correction level
			return "L";
		}
		
		// No wallet key path
		static get NO_WALLET_KEY_PATH() {
		
			// Return no wallet key path
			return null;
		}
		
		// No initialize database transaction
		static get NO_INITIALIZE_DATABASE_TRANSACTION() {
		
			// Return no initialize database transaction
			return null;
		}
		
		// Sync done delay milliseconds
		static get SYNC_DONE_DELAY_MILLISECONDS() {
		
			// Return sync done delay milliseconds
			return 400;
		}
		
		// Add transaction button delay milliseconds
		static get ADD_TRANSACTION_BUTTON_DELAY_MILLISECONDS() {
		
			// Return add transaction button delay milliseconds
			return 200;
		}
		
		// Change address suffix before delay milliseconds
		static get CHANGE_ADDRESS_SUFFIX_BEFORE_DELAY_MILLISECONDS() {
		
			// Return change address suffix before delay milliseconds
			return 300;
		}
		
		// Change address suffix before after milliseconds
		static get CHANGE_ADDRESS_SUFFIX_AFTER_DELAY_MILLISECONDS() {
		
			// Return change address suffix after delay milliseconds
			return 100;
		}
		
		// Get passphrase delay milliseconds
		static get GET_PASSPHRASE_DELAY_MILLISECONDS() {
		
			// Return get passphrase delay milliseconds
			return 300;
		}
		
		// Get payment proof address delay milliseconds
		static get GET_PAYMENT_PROOF_ADDRESS_DELAY_MILLISECONDS() {
		
			// Return get payment proof address delay milliseconds
			return 300;
		}
		
		// Resync delay milliseconds
		static get RESYNC_DELAY_MILLISECONDS() {
		
			// Return resync delay milliseconds
			return 300;
		}
		
		// Rename delay milliseconds
		static get RENAME_DELAY_MILLISECONDS() {
		
			// Return rename delay milliseconds
			return 300;
		}
		
		// Delete delay milliseconds
		static get DELETE_DELAY_MILLISECONDS() {
		
			// Return delete delay milliseconds
			return 50;
		}
		
		// Copy address to clipboard delay milliseconds
		static get COPY_ADDRESS_TO_CLIPBOARD_DELAY_MILLISECONDS() {
		
			// Return copy address to clipboard delay milliseconds
			return 175;
		}
		
		// Copy ID to clipboard delay milliseconds
		static get COPY_ID_TO_CLIPBOARD_DELAY_MILLISECONDS() {
		
			// Return copy ID to clipboard delay milliseconds
			return 175;
		}
		
		// Address before show delay milliseconds
		static get ADDRESS_BEFORE_SHOW_DELAY_MILLISECONDS() {
		
			// Return address before show delay milliseconds
			return 250;
		}
		
		// Receive payment as file delay milliseconds
		static get RECEIVE_PAYMENT_AS_FILE_DELAY_MILLISECONDS() {
		
			// Return receive payment as file delay milliseconds
			return 300;
		}
		
		// Syncing minimum stroke dash offset
		static get SYNCING_MINIMUM_STROKE_DASH_OFFSET() {
		
			// Return syncing minimum stroke dash offset
			return 101;
		}
		
		// Syncing maximum stroke dash offset
		static get SYNCING_MAXIMUM_STROKE_DASH_OFFSET() {
		
			// Return syncing maximum stroke dash offset
			return 0.75;
		}
		
		// Transactions group size
		static get TRANSACTIONS_GROUP_SIZE() {
		
			// Return transactions group size
			return 100;
		}
		
		// No newest transaction key path
		static get NO_NEWEST_TRANSACTION_KEY_PATH() {
		
			// Return no newest transaction key path
			return null;
		}
		
		// Navigate transactions delay milliseconds
		static get NAVIGATE_TRANSACTIONS_DELAY_MILLISECONDS() {
		
			// Return navigate transactions delay milliseconds
			return 100;
		}
		
		// File input cancel check delay milliseconds
		static get FILE_INPUT_CANCEL_CHECK_DELAY_MILLISECONDS() {
		
			// Return file input cancel check delay milliseconds
			return 500;
		}
}


// Main function

// Set global object's wallet section
globalThis["WalletSection"] = WalletSection;
