// Use strict
"use strict";


// Classes

// Unlocked class
class Unlocked {

	// Public
	
		// Constructor
		constructor(application, bodyDisplay, unlockedDisplay, settings, message, focus, wallets, node, listener, automaticLock, transactions, sections, scroll, wakeLock, clipboard, prices) {
		
			// Set application
			this.application = application;
			
			// Set body display
			this.bodyDisplay = bodyDisplay;
			
			// Get unlocked display
			this.unlockedDisplay = unlockedDisplay;
			
			// Get menu display
			this.menuDisplay = this.unlockedDisplay.find("div.menu");
			
			// Get wallets display
			this.walletsDisplay = this.unlockedDisplay.find("div.wallets");
			
			// Get sections display
			this.sectionsDisplay = this.unlockedDisplay.find("div.sections");
			
			// Get statuc display
			this.statusDisplay = this.unlockedDisplay.find("div.status");
			
			// Set settings
			this.settings = settings;
		
			// Set message
			this.message = message;
			
			// Set focus
			this.focus = focus;
			
			// Set wallets
			this.wallets = wallets;
			
			// Set node
			this.node = node;
			
			// Set listener
			this.listener = listener;
			
			// Set automatic lock
			this.automaticLock = automaticLock;
			
			// Set sections
			this.sections = sections;
			
			// Set scroll
			this.scroll = scroll;
			
			// Set wake lock
			this.wakeLock = wakeLock;
			
			// Set clipboard
			this.clipboard = clipboard;
			
			// Create prices
			this.prices = prices;
			
			// Set previous body display width
			this.previousBodyDisplayWidth = this.bodyDisplay.width();
			
			// Set currency display to setting's default value
			this.currencyDisplay = Unlocked.SETTINGS_CURRENCY_DISPLAY_DEFAULT_VALUE;
			
			// Set displayed address type to setting's default value
			this.displayedAddressType = Unlocked.SETTINGS_DISPLAYED_ADDRESS_TYPE_DEFAULT_VALUE;
			
			// Set displayed amount type to setting's default value
			this.displayedAmountType = Unlocked.SETTINGS_DISPLAYED_AMOUNT_TYPE_DEFAULT_VALUE;
			
			// Set wallets expanded to setting's default value
			this.walletsExpanded = Unlocked.SETTINGS_WALLETS_EXPANDED_DEFAULT_VALUE;
			
			// Set wallets scroll position to setting's default value
			this.walletsScrollPosition = Unlocked.SETTINGS_WALLETS_SCROLL_POSITION_DEFAULT_VALUE;
			
			// Create settings section
			this.settingsSection = new SettingsSection(this.sectionsDisplay.find("div.settings"), this.sections, this.settings, this.message, this.focus, this.application, this, this.automaticLock, this.scroll, this.wallets, this.node, this.wakeLock, transactions, this.prices, this.clipboard);
			
			// Create about section
			this.aboutSection = new AboutSection(this.sectionsDisplay.find("div.about"), this.sections, this.settings, this.message, this.focus, this.application, this, this.automaticLock, this.scroll, this.wallets, this.node, this.wakeLock, transactions, this.prices, this.clipboard);
			
			// Create transaction section
			this.transactionSection = new TransactionSection(this.sectionsDisplay.find("div.transaction"), this.sections, this.settings, this.message, this.focus, this.application, this, this.automaticLock, this.scroll, this.wallets, this.node, this.wakeLock, transactions, this.prices, this.clipboard);
			
			// Create account section
			this.accountSection = new AccountSection(this.sectionsDisplay.find("div.account"), this.sections, this.settings, this.message, this.focus, this.application, this, this.automaticLock, this.scroll, this.wallets, this.node, this.wakeLock, transactions, this.prices, this.clipboard);
			
			// Create wallet section
			this.walletSection = new WalletSection(this.sectionsDisplay.find("div.wallet"), this.sections, this.settings, this.message, this.focus, this.application, this, this.automaticLock, this.scroll, this.wallets, this.node, this.wakeLock, transactions, this.prices, this.clipboard);
			
			// Create send payment section
			this.sendPaymentSection = new SendPaymentSection(this.sectionsDisplay.find("div.sendPayment"), this.sections, this.settings, this.message, this.focus, this.application, this, this.automaticLock, this.scroll, this.wallets, this.node, this.wakeLock, transactions, this.prices, this.clipboard);
			
			// Create log section
			this.logSection = new LogSection(this.sectionsDisplay.find("div.log"), this.sections, this.settings, this.message, this.focus, this.application, this, this.automaticLock, this.scroll, this.wallets, this.node, this.wakeLock, transactions, this.prices, this.clipboard);
			
			// Set self
			var self = this;
			
			// Set language get displayed currency
			Language.setGetDisplayedCurrency(function() {
			
				// Return displayed currency
				return self.getDisplayedCurrency();
			});
			
			// Set language get price
			Language.setGetPrice(this.prices);
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Currency display setting
						self.settings.createValue(Unlocked.SETTINGS_CURRENCY_DISPLAY_NAME, Unlocked.SETTINGS_CURRENCY_DISPLAY_DEFAULT_VALUE),
						
						// Displayed address type setting
						self.settings.createValue(Unlocked.SETTINGS_DISPLAYED_ADDRESS_TYPE_NAME, Unlocked.SETTINGS_DISPLAYED_ADDRESS_TYPE_DEFAULT_VALUE),
						
						// Displayed amount type setting
						self.settings.createValue(Unlocked.SETTINGS_DISPLAYED_AMOUNT_TYPE_NAME, Unlocked.SETTINGS_DISPLAYED_AMOUNT_TYPE_DEFAULT_VALUE),
						
						// Wallets expanded setting
						self.settings.createValue(Unlocked.SETTINGS_WALLETS_EXPANDED_NAME, Unlocked.SETTINGS_WALLETS_EXPANDED_DEFAULT_VALUE),
						
						// Wallets scroll position setting
						self.settings.createValue(Unlocked.SETTINGS_WALLETS_SCROLL_POSITION_NAME, Unlocked.SETTINGS_WALLETS_SCROLL_POSITION_DEFAULT_VALUE)
					
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Currency display setting
							Unlocked.SETTINGS_CURRENCY_DISPLAY_NAME,
							
							// Displayed address type setting
							Unlocked.SETTINGS_DISPLAYED_ADDRESS_TYPE_NAME,
							
							// Displayed amount type setting
							Unlocked.SETTINGS_DISPLAYED_AMOUNT_TYPE_NAME,
							
							// Wallets expanded setting
							Unlocked.SETTINGS_WALLETS_EXPANDED_NAME,
							
							// Wallets scroll position setting
							Unlocked.SETTINGS_WALLETS_SCROLL_POSITION_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set currency display to setting's value
							self.currencyDisplay = settingValues[settings.indexOf(Unlocked.SETTINGS_CURRENCY_DISPLAY_NAME)];
							
							// Set displayed address type to setting's value
							self.displayedAddressType = settingValues[settings.indexOf(Unlocked.SETTINGS_DISPLAYED_ADDRESS_TYPE_NAME)];
							
							// Set displayed amount type to setting's value
							self.displayedAmountType = settingValues[settings.indexOf(Unlocked.SETTINGS_DISPLAYED_AMOUNT_TYPE_NAME)];
							
							// Set wallets expanded to setting's value
							self.walletsExpanded = settingValues[settings.indexOf(Unlocked.SETTINGS_WALLETS_EXPANDED_NAME)];
							
							// Set wallets scroll position to setting's value
							self.walletsScrollPosition = settingValues[settings.indexOf(Unlocked.SETTINGS_WALLETS_SCROLL_POSITION_NAME)];
						
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
				});
			});
			
			// Settings change event
			$(this.settings).on(Settings.CHANGE_EVENT, function(event, setting) {
			
				// Check what setting was changes
				switch(setting[Settings.DATABASE_SETTING_NAME]) {
				
					// Currency display setting
					case Unlocked.SETTINGS_CURRENCY_DISPLAY_NAME:
					
						// Set currency display to setting's value
						self.currencyDisplay = setting[Settings.DATABASE_VALUE_NAME];
						
						// Update currency display
						self.updateCurrencyDisplay();
						
						// Break
						break;
					
					// Displayed address type setting
					case Unlocked.SETTINGS_DISPLAYED_ADDRESS_TYPE_NAME:
					
						// Set displayed address type to setting's value
						self.displayedAddressType = setting[Settings.DATABASE_VALUE_NAME];
						
						// Go through all wallet display wallet buttons
						self.walletsDisplay.find("div.list").find("button").each(function() {
						
							// Get button
							var button = $(this);
							
							// Try
							try {
							
								// Get button's wallet
								var wallet = self.wallets.getWallet(parseInt(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE));
							}
							
							// Catch errors
							catch(error) {
								
								// Return
								return;
							}
							
							// Get wallet's address
							var address = wallet.getAddress(self.displayedAddressType);
							
							// Get button's address display
							var addressDisplay = button.find("span.address");
							
							// Check if address display is showing the old value
							if(addressDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "address") !== address) {
								
								// Get address display's text
								var addressDisplayText = addressDisplay.find("p");
								
								// Set address display's address
								addressDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "address", address);
							
								// Set address display's text
								addressDisplayText.text(address);
								
								// Update address display
								Unlocked.updateAddressDisplay(addressDisplayText);
							}
						});
					
						// Break
						break;
					
					// Displayed amount type setting
					case Unlocked.SETTINGS_DISPLAYED_AMOUNT_TYPE_NAME:
					
						// Set displayed amount type to setting's value
						self.displayedAmountType = setting[Settings.DATABASE_VALUE_NAME];
						
						// Update currency display
						self.updateCurrencyDisplay();
						
						// Break
						break;
				}
			});
			
			// Show event
			$(this).on(Unlocked.SHOW_EVENT, function() {
			
				// Check if wallets are expanded and unlocked display isn't showing minimal display
				if(self.walletsExpanded === true && self.unlockedDisplay.hasClass("minimal") === false) {
			
					// Check if expand wallets button is shown
					if(self.walletsDisplay.find("button.expand").is(":hidden") === false) {
					
						// Show wallets display section and make it not transition
						self.walletsDisplay.children("div").removeClass("hide").addClass("noTransition");
						
						// Expand wallets display and make it not transition
						self.walletsDisplay.addClass("noTransition expand");
					
						// Hide sections display section
						self.sectionsDisplay.children("div").addClass("hide");
						
						// Set that unlocked display has the wallets expanded
						self.unlockedDisplay.addClass("walletsExpanded");
						
						// Run on resize
						self.onResize();
						
						// Allow expand wallets to transition
						self.walletsDisplay.removeClass("noTransition").children("div").removeClass("noTransition");
						
					}
					
					// Otherwise
					else {
					
						// Show wallets display section
						self.walletsDisplay.children("div").removeClass("hide");
					
						// Expand wallets display
						self.walletsDisplay.addClass("expand");
						
						// Hide sections display section
						self.sectionsDisplay.children("div").addClass("hide");
						
						// Set that unlocked display has the wallets expanded
						self.unlockedDisplay.addClass("walletsExpanded");
					}
				}
				
				// Restore wallets scroll position
				self.walletsDisplay.find("div.list").scrollTop(self.walletsScrollPosition);
				
				// Update menu display
				self.updateMenuDisplay();
				
				// Unlocked display children transition start event
				self.unlockedDisplay.children("div").one("transitionstart", function() {
				
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Request animation frame
						requestAnimationFrame(function() {
				
							// Update menu display
							self.updateMenuDisplay();
						});
					});
				});
			});
			
			// Prices change event
			$(this.prices).on(Prices.CHANGE_EVENT, function(event, prices) {
			
				// Update currency display
				self.updateCurrencyDisplay();
			});
			
			// Node connection open event
			$(this.node).on(Node.CONNECTION_OPEN_EVENT, function() {
			
				// Get node status display
				var nodeStatusDisplay = self.statusDisplay.find("p.node");
			
				// Set that node status display shows success
				nodeStatusDisplay.removeClass("warning").addClass("success");
				
				// Set title
				var title = Language.getDefaultTranslation('Node connected');
			
				// Set node status display's title
				nodeStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
			
			// Node connection warning event
			}).on(Node.CONNECTION_WARNING_EVENT, function() {
			
				// Get node status display
				var nodeStatusDisplay = self.statusDisplay.find("p.node");
			
				// Set that node status display shows warning
				nodeStatusDisplay.removeClass("success").addClass("warning");
				
				// Set title
				var title = Language.getDefaultTranslation('Node warning');
			
				// Set node status display's title
				nodeStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
			
			// Node connection close event
			}).on(Node.CONNECTION_CLOSE_EVENT, function() {
			
				// Get node status display
				var nodeStatusDisplay = self.statusDisplay.find("p.node");
			
				// Set that node status display shows error
				nodeStatusDisplay.removeClass("warning success");
				
				// Set title
				var title = Language.getDefaultTranslation('Node disconnected');
			
				// Set node status display's title
				nodeStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
			});
			
			// Listener connection open event
			$(this.listener).on(Listener.CONNECTION_OPEN_EVENT, function() {
			
				// Get listener status display
				var listenerStatusDisplay = self.statusDisplay.find("p.listener");
			
				// Set that listener status display shows success
				listenerStatusDisplay.removeClass("warning").addClass("success");
				
				// Set title
				var title = Language.getDefaultTranslation('Listener connected');
			
				// Set listener status display's title
				listenerStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
			
			// Listener connection close event
			}).on(Listener.CONNECTION_CLOSE_EVENT, function() {
			
				// Get listener status display
				var listenerStatusDisplay = self.statusDisplay.find("p.listener");
			
				// Set that listener status display shows error
				listenerStatusDisplay.removeClass("warning success");
				
				// Set title
				var title = Language.getDefaultTranslation('Listener disconnected');
			
				// Set listener status display's title
				listenerStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
			});
			
			// Wallets sync start event
			$(this.wallets).on(Wallets.SYNC_START_EVENT, function(event, walletKeyPath, percentComplete) {
			
				// Get wallet's button
				var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
				
				// Check if wallet's button exists
				if(button["length"] !== 0) {
				
					// Set that button shows that wallet is syncing
					button.removeClass("synced error").addClass("syncing");
				}
			
			// Wallets sync done event
			}).on(Wallets.SYNC_DONE_EVENT, function(event, walletKeyPath) {
			
				// Get wallet's button
				var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
				
				// Check if wallet's button exists
				if(button["length"] !== 0)
			
					// Set that button shows that wallet is synced
					button.removeClass("syncing error").addClass("synced");
			
			// Wallets sync fail
			}).on(Wallets.SYNC_FAIL_EVENT, function(event, walletKeyPath) {
			
				// Get wallet's button
				var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
				
				// Check if wallet's button exists
				if(button["length"] !== 0)
			
					// Set that button shows that wallet had an error while syncing
					button.removeClass("syncing synced").addClass("error");
			});
			
			// Menu display about button click event
			this.menuDisplay.find("button.about").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Check if button isn't already clicked
				if(button.hasClass("clicked") === false) {
				
					// Prevent showing messages
					self.message.prevent();
					
					// Set that button is clicked and its siblings aren't
					button.addClass("clicked").siblings().removeClass("clicked");
					
					// Get selected wallet button
					var selectedWalletButton = self.walletsDisplay.find("div.list").find("button.clicked");
					
					// Set that selected wallet button isn't clicked
					selectedWalletButton.addClass("noTransition").removeClass("clicked");
					
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Set that selected wallet button can transition
						selectedWalletButton.removeClass("noTransition");
					});
					
					// Update wallets order buttons
					self.updateWalletsOrderButtons();
					
					// Show about section
					self.aboutSection.show().then(function() {
					
						// Allow showing messages
						self.message.allow();
					
					// Catch errors
					}).catch(function(error) {
					
						// Set that button isn't clicked
						button.removeClass("clicked");
					});
				}
				
				// Othwerwise
				else
				
					// Hide wallets
					self.hideWallets();
			});
			
			// Menu display account button click event
			this.menuDisplay.find("button.account").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Check if button isn't already clicked
				if(button.hasClass("clicked") === false) {
				
					// Prevent showing messages
					self.message.prevent();
					
					// Set that button is clicked and its siblings aren't
					button.addClass("clicked").siblings().removeClass("clicked");
					
					// Get selected wallet button
					var selectedWalletButton = self.walletsDisplay.find("div.list").find("button.clicked");
					
					// Set that selected wallet button isn't clicked
					selectedWalletButton.addClass("noTransition").removeClass("clicked");
					
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Set that selected wallet button can transition
						selectedWalletButton.removeClass("noTransition");
					});
					
					// Update wallets order buttons
					self.updateWalletsOrderButtons();
				
					// Show account section
					self.accountSection.show().then(function() {
					
						// Allow showing messages
						self.message.allow();
					
					// Catch errors
					}).catch(function(error) {
					
						// Set that button isn't clicked
						button.removeClass("clicked");
					});
				}
				
				// Othwerwise
				else
				
					// Hide wallets
					self.hideWallets();
			});
			
			// Menu display settings button click event
			this.menuDisplay.find("button.settings").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Check if button isn't already clicked
				if(button.hasClass("clicked") === false) {
				
					// Prevent showing messages
					self.message.prevent();
			
					// Set that button is clicked and its siblings aren't
					button.addClass("clicked").siblings().removeClass("clicked");
					
					// Get selected wallet button
					var selectedWalletButton = self.walletsDisplay.find("div.list").find("button.clicked");
					
					// Set that selected wallet button isn't clicked
					selectedWalletButton.addClass("noTransition").removeClass("clicked");
					
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Set that selected wallet button can transition
						selectedWalletButton.removeClass("noTransition");
					});
					
					// Update wallets order buttons
					self.updateWalletsOrderButtons();
					
					// Show settings section
					self.settingsSection.show().then(function() {
					
						// Allow showing messages
						self.message.allow();
					
					// Catch errors
					}).catch(function(error) {
					
						// Set that button isn't clicked
						button.removeClass("clicked");
					});
				}
				
				// Othwerwise
				else
				
					// Hide wallets
					self.hideWallets();
			});
			
			// Menu display log button click event
			this.menuDisplay.find("button.log").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Check if button isn't already clicked
				if(button.hasClass("clicked") === false) {
				
					// Prevent showing messages
					self.message.prevent();
			
					// Set that button is clicked and its siblings aren't
					button.addClass("clicked").siblings().removeClass("clicked");
					
					// Get selected wallet button
					var selectedWalletButton = self.walletsDisplay.find("div.list").find("button.clicked");
					
					// Set that selected wallet button isn't clicked
					selectedWalletButton.addClass("noTransition").removeClass("clicked");
					
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Set that selected wallet button can transition
						selectedWalletButton.removeClass("noTransition");
					});
					
					// Update wallets order buttons
					self.updateWalletsOrderButtons();
					
					// Show log section
					self.logSection.show().then(function() {
					
						// Allow showing messages
						self.message.allow();
					
					// Catch errors
					}).catch(function(error) {
					
						// Set that button isn't clicked
						button.removeClass("clicked");
					});
				}
				
				// Othwerwise
				else
				
					// Hide wallets
					self.hideWallets();
			});
			
			// Menu display lock button click event
			this.menuDisplay.find("button.lock").on("click", function() {
			
				// Log message
				Log.logMessage(Language.getDefaultTranslation('Locked.'));
			
				// Prevent showing messages
				self.message.prevent();
			
				// Set that button is clicked
				$(this).addClass("clicked");
				
				// Show loading
				self.application.showLoading();
			
				// Show lock display
				self.application.showLockDisplay();
			});
			
			// Unlocked display wallets expand button click event
			this.walletsDisplay.find("button.expand").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Check if button isn't already clicked
				if(button.hasClass("clicked") === false) {
				
					// Set that button is clicked
					button.addClass("clicked");
				
					// Check if wallets display is already expanded
					if(self.walletsDisplay.hasClass("expand") === true) {
					
						// Hide wallets
						self.hideWallets().then(function() {
						
							// Check if automatic lock isn't locking
							if(self.automaticLock.isLocking() === false) {
						
								// Set that button is focused and not clicked
								button.focus().removeClass("clicked");
							}
						});
					}
					
					// Otherwise
					else {
					
						// Show wallets
						self.showWallets().then(function() {
						
							// Check if automatic lock isn't locking
							if(self.automaticLock.isLocking() === false) {
						
								// Set that button is focused and not clicked
								button.focus().removeClass("clicked");
							}
						});
					}
				}
			});
			
			// Wallets display wallet button click event
			$(document).on("click", "main > div.unlocked > div > div > div.wallets > div > div.list > button", function() {
			
				// Get button
				var button = $(this);
				
				// Check if button isn't already clicked
				if(button.hasClass("clicked") === false) {
				
					// Prevent showing messages
					self.message.prevent();
			
					// Set that button is clicked and its siblings aren't
					button.addClass("clicked").siblings().removeClass("clicked");
					
					// Update wallets order buttons
					self.updateWalletsOrderButtons();
					
					// Set that menu display buttons aren't clicked
					self.menuDisplay.find("button").removeClass("clicked");
					
					// Get wallet's key path
					var keyPath = parseInt(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE);
					
					// Show wallet section
					self.walletSection.show(false, true, true, {
					
						// Wallet key path
						[WalletSection.STATE_WALLET_KEY_PATH_NAME]: keyPath
					
					}).then(function() {
					
						// Allow showing messages
						self.message.allow();
					
					// Catch errors
					}).catch(function(error) {
					
						// Set that button isn't clicked
						button.removeClass("clicked");
							
						// Update wallets order buttons
						self.updateWalletsOrderButtons();
					});
				}
			
				// Othwerwise
				else {
				
					// Hide wallets
					self.hideWallets();
				}
			
			// Wallets display wallet button name selected click event
			}).on("click", "main > div.unlocked > div > div > div.wallets > div > div.list > button > span.name > span.selected", function(event) {
			
				// Check if button is clicked and the wallets display expand button is hidden
				if($(this).closest("button").hasClass("clicked") === true && self.walletsDisplay.find("button.expand").is(":hidden") === true)
			
					// Stop propagation
					event.stopPropagation();
			
			// Wallets display wallet button total status click event
			}).on("click", "main > div.unlocked > div > div > div.wallets > div > div.list > button > span.totals > span.status", function(event) {
			
				// Check if button is clicked and the wallets display expand button is hidden
				if($(this).closest("button").hasClass("clicked") === true && self.walletsDisplay.find("button.expand").is(":hidden") === true)
			
					// Stop propagation
					event.stopPropagation();
			
			// Wallets display wallet button total value language change event
			}).on(Language.CHANGE_EVENT, "main > div.unlocked > div > div > div.wallets > div > div.list > button > span.totals > span.value", function() {
			
				// Check if currency display is the current language's currency
				if(self.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) {
				
					// Get value
					var value = $(this);
					
					// Set currency to the language's currency
					var currency = Language.getConstant(Language.CURRENCY_CONSTANT);
					
					// Get the price in the currency
					var price = self.prices.getPrice(currency);
					
					// Check if price exsist
					if(price !== Prices.NO_PRICE_FOUND) {
					
						// Get value's amount
						var amount = value.siblings("span.amount");
						
						// Get amount displayed
						var amountDisplayed = new BigNumber(JSON.parse(amount.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments"))[0][Language.CURRENCY_NUMBER_ARGUMENT_INDEX]);
				
						// Get value in currency
						var valueInCurrency = Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value: %1$c'), [[amountDisplayed.multipliedBy(price).toFixed(), currency]], "value");
						
						// Update value
						value.replaceWith(valueInCurrency);
					}
					
					// Otherwise
					else
					
						// Remove value
						value.remove();
				}
			
			// Wallets display wallet button address copy click and touch end event
			}).on("click touchend", "main > div.unlocked > div > div > div.wallets > div > div.list > button > span.address > span.copy", function(event) {
			
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
				self.message.prevent();
				
				// Blur focus
				$(":focus").blur();
				
				// Disable
				self.disable();
				
				// Get copy button
				var copyButton = $(this);
				
				// Show loading
				self.application.showLoading();
				
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
						self.message.show(Language.getDefaultTranslation('Copy Address Error'), Message.createText(error), false, function() {
						
							// Hide loading
							self.application.hideLoading();
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
						
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
						
								// Enable
								self.enable();
								
								// Set that copy button isn't clicked
								copyButton.removeClass("clicked");
								
								// Hide message
								self.message.hide();
							}
						});
					};
					
					// Try
					try {
					
						// Get copy button's wallet
						var wallet = self.wallets.getWallet(parseInt(copyButton.closest("button").attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE));
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
						var address = wallet.getAddress(self.displayedAddressType);
						
						// Copy address to clipboard
						self.clipboard.copy(address).then(function() {
						
							// Show message and allow showing messages
							self.message.show(Language.getDefaultTranslation('Address Copied'), ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('The address for Wallet %1$s was successfully copied to your clipboard.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('The address for %1$y was successfully copied to your clipboard.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the pasted address matches the following address when you paste it.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(address) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can only receive payments at this address while you\'re online and connected to a listener.')) + "</b>", false, function() {
							
								// Check if wallet exists
								if(self.wallets.walletExists(wallet.getKeyPath()) === true) {
								
									// Hide loading
									self.application.hideLoading();
								}
								
								// Otherwise
								else {
								
									// Set timeout
									setTimeout(function() {
								
										// Show copy address error
										showCopyAddressError(Language.getDefaultTranslation('The wallet doesn\'t exist.'));
									}, 0);
									
									// Return false
									return false;
								}
							
							}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
							
								// Check if message was displayed
								if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
							
									// Enable
									self.enable();
									
									// Set that copy button isn't clicked
									copyButton.removeClass("clicked");
									
									// Hide message
									self.message.hide();
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
				
				}, ("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") ? 0 : Unlocked.COPY_ADDRESS_TO_CLIPBOARD_DELAY_MILLISECONDS);
			
			// Wallets change event
			}).on(Wallets.CHANGE_EVENT, function(event, walletKeyPath, change, newValue) {
			
				// Get wallet's button
				var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
				
				// Check if wallet's button exists
				if(button["length"] !== 0) {
				
					// Check what changed
					switch(change) {
					
						// Unspent amount, pending amount, or unconfirmed amount
						case Wallets.UNSPENT_AMOUNT_CHANGED:
						case Wallets.PENDING_AMOUNT_CHANGED:
						case Wallets.UNCONFIRMED_AMOUNT_CHANGED:
						
							// Try
							try {
							
								// Get wallet
								var wallet = self.wallets.getWallet(walletKeyPath);
							}
							
							// Catch errors
							catch(error) {
								
								// Return
								return;
							}
						
							// Set currency to the language's currency if specified or the currency display otherwise
							var currency = (self.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) ? Language.getConstant(Language.CURRENCY_CONSTANT) : self.currencyDisplay;
							
							// Get the price in the currency
							var price = self.prices.getPrice(currency);
						
							// Check displayed amount type
							switch(self.displayedAmountType) {
							
								// Spendable
								case Unlocked.SPENDABLE_DISPLAYED_AMOUNT_TYPE:
								
									// Set amount to display to the wallet's unspent amount
									var amountToDisplay = wallet.getUnspentAmount();
								
									// Break
									break;
								
								// Confirmed
								case Unlocked.CONFIRMED_DISPLAYED_AMOUNT_TYPE:
								
									// Set amount to display to the wallet's unspent amount
									var amountToDisplay = wallet.getUnspentAmount();
									
									// Add wallet's pending amount to the amount to display
									amountToDisplay = amountToDisplay.plus(wallet.getPendingAmount());
								
									// Break
									break;
								
								// Confirmed and unconfirmed
								case Unlocked.CONFIRMED_AND_UNCONFIRMED_DISPLAYED_AMOUNT_TYPE:
								
									// Set amount to display to the wallet's unspent amount
									var amountToDisplay = wallet.getUnspentAmount();
									
									// Add wallet's pending amount to the amount to display
									amountToDisplay = amountToDisplay.plus(wallet.getPendingAmount());
									
									// Add wallet's unconfirmed amount to the amount to display
									amountToDisplay = amountToDisplay.plus(wallet.getUnconfirmedAmount());
								
									// Break
									break;
							}
							
							// Get amount to display in number's base
							amountToDisplay = amountToDisplay.dividedBy(Consensus.VALUE_NUMBER_BASE);
							
							// Check if wallet's unspent amount is at least the whale amount threshold
							if(wallet.getUnspentAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).isGreaterThanOrEqualTo(Unlocked.WHALE_AMOUNT_THRESHOLD) === true) {
							
								// Add whale overlay to button
								button.addClass("whale");
							}
							
							// Otherwise
							else {
							
								// Remove whale overlay from button
								button.removeClass("whale");
							}
						
							// Get button's totals
							var totals = button.find("span.totals");
							
							// Get total's amount
							var amount = totals.find("span.amount");
							
							// Get total's value
							var value = totals.find("span.value");
							
							// Check if price exsist
							if(price !== Prices.NO_PRICE_FOUND) {
							
								// Get value in currency
								var valueInCurrency = Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value: %1$c'), [[amountToDisplay.multipliedBy(price).toFixed(), currency]], "value");
								
								// Check if total's value doesn't exist
								if(value["length"] === 0)
								
									// Add value after total's amount
									amount.after(valueInCurrency);
								
								// Otherwise
								else
								
									// Update total's value
									value.replaceWith(valueInCurrency);
							}
							
							// Otherwise
							else
							
								// Remove total's value
								value.remove();
							
							// Update total's amount
							amount.replaceWith(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount: %1$c'), [[amountToDisplay.toFixed(), Consensus.CURRENCY_NAME]], "amount"));
							
							// Break
							break;
					
						// Address suffix
						case Wallets.ADDRESS_SUFFIX_CHANGED:
						
							// Try
							try {
							
								// Get wallet
								var wallet = self.wallets.getWallet(walletKeyPath);
							}
							
							// Catch errors
							catch(error) {
								
								// Return
								return;
							}
							
							// Get wallet's address
							var address = wallet.getAddress(self.displayedAddressType);
							
							// Get button's address display
							var addressDisplay = button.find("span.address");
							
							// Check if address display is showing the old value
							if(addressDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "address") !== address) {
								
								// Get address display's text
								var addressDisplayText = addressDisplay.find("p");
								
								// Check if address display's text is visible and not empty
								if(addressDisplayText.is(":visible") === true && addressDisplayText.is(":empty") === false) {
								
									// Hide address display's text
									addressDisplayText.addClass("hide");
								
									// Address display's text transition end or timeout event
									addressDisplayText.transitionEndOrTimeout(function() {
									
										// Check if unlocked display is shown
										if(self.application.isUnlockedDisplayShown() === true) {
										
											// Check if address didn't change
											if(address === wallet.getAddress(self.displayedAddressType)) {
									
												// Set address display's address
												addressDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "address", address);
												
												// Set timeout
												setTimeout(function() {
												
													// Check if unlocked display is shown
													if(self.application.isUnlockedDisplayShown() === true) {
													
														// Check if address didn't change
														if(address === wallet.getAddress(self.displayedAddressType)) {
											
															// Set address display's text and show it
															addressDisplayText.text(address).removeClass("hide");
															
															// Update address display
															Unlocked.updateAddressDisplay(addressDisplayText);
														}
													}
												}, Unlocked.SHOW_ADDRESS_DELAY_MILLISECONDS);
											}
										}
									}, "opacity");
								}
								
								// Otherwise
								else {
								
									// Set address display's address
									addressDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "address", address);
								
									// Set address display's text and show it
									addressDisplayText.text(address).removeClass("hide");
									
									// Update address display
									Unlocked.updateAddressDisplay(addressDisplayText);
								}
							}
						
							// Break
							break;
						
						// Name
						case Wallets.NAME_CHANGED:
						
							// Replace button's name display
							button.find("span.name").find("span.name").replaceWith("<span class=\"name\">" + Common.htmlEncode(newValue) + "</span>");
						
							// Break
							break;
						
						// Hardware type
						case Wallets.HARDWARE_TYPE_CHANGED:
						
							// Check new hardware type
							switch(newValue) {
							
								// Legder hardware type
								case HardwareWallet.LEDGER_HARDWARE_TYPE:
								
									// Remove overlays from button and transition end or timeout event
									button.addClass("noOverlay").transitionEndOrTimeout(function() {
									
										// Set timeout
										setTimeout(function() {
										
											// Add Ledger overlay to button
											button.addClass("ledger").removeClass("noOverlay trezor");
											
										}, Unlocked.SHOW_HARDWARE_TYPE_DELAY_MILLISECONDS);
										
									}, "opacity");
								
									// Break
									break;
								
								// Trezor hardware type
								case HardwareWallet.TREZOR_HARDWARE_TYPE:
								
									// Remove overlays from button and transition end or timeout event
									button.addClass("noOverlay").transitionEndOrTimeout(function() {
									
										// Set timeout
										setTimeout(function() {
										
											// Add Trezor overlay to button
											button.addClass("trezor").removeClass("noOverlay ledger");
											
										}, Unlocked.SHOW_HARDWARE_TYPE_DELAY_MILLISECONDS);
										
									}, "opacity");
								
									// Break
									break;
							}
						
							// Break
							break;
					}
				}
				
			// Document key down event
			}).on("keydown", function(event) {
			
				// Check if key tab is pressed
				if(event["which"] === "\t".charCodeAt(0)) {
			
					// Check if wallets display expand button is hidden
					if(self.walletsDisplay.find("button.expand").is(":hidden") === true) {
					
						// Disable tabbing to clicked menu button
						self.menuDisplay.find("button.clicked").disableTab();
					
						// Disable tabbing to clicked wallet
						self.walletsDisplay.find("div.list").find("button.clicked").disableTab();
					}
					
					// Otherwise
					else {
					
						// Check if unlocked display has the wallets expanded
						if(self.unlockedDisplay.hasClass("walletsExpanded") === true)
						
							// Enable tabbing to clicked menu button
							self.menuDisplay.find("button.clicked").enableTab();
						
						// Otherwise
						else
						
							// Disable tabbing to clicked menu button
							self.menuDisplay.find("button.clicked").disableTab();
						
						// Enable tabbing to clicked wallet
						self.walletsDisplay.find("div.list").find("button.clicked").enableTab();
					}
					
					// Enable tabbing to all not disabled wallet order buttons
					self.walletsDisplay.find("div.order").find("button:not(.disabled)").enableTab();
					
					// Disable tabbing to all disabled wallet order buttons
					self.walletsDisplay.find("div.order").find("button.disabled").disableTab();
				}
			
			// Document wallet disconnect event
			}).on(Wallet.DISCONNECT_EVENT, function(event, walletKeyPath) {
			
				// Get wallet's button
				var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
				
				// Check if wallet's button exists
				if(button["length"] !== 0) {
				
					// Set wallet status's title to show that wallet is disconnected
					button.find("span.name").find("span.status").removeClass("connected").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "text").removeAttr("title");
				}
				
			// Document wallet connect event
			}).on(Wallet.CONNECT_EVENT, function(event, walletKeyPath, connectionType) {
			
				// Get wallet's button
				var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
				
				// Check if wallet's button exists
				if(button["length"] !== 0) {
				
					// Set title
					var title = Language.getDefaultTranslation('Hardware wallet connected');
					
					// Get wallet status
					var walletStatus = button.find("span.name").find("span.status");
					
					// Check if connection type is Bluetooth connection type
					if(connectionType === HardwareWallet.BLUETOOTH_CONNECTION_TYPE) {
					
						// Have wallet status show Bluetooth
						walletStatus.addClass("bluetooth");
					}
					
					// Otherwise
					else {
					
						// Have wallet status show USB
						walletStatus.removeClass("bluetooth");
					}
					
					// Set wallet status's title to show that wallet is connected
					walletStatus.addClass("connected").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
				}
			});
			
			// Wallets display scroll event
			this.walletsDisplay.find("div.list").on("scroll", function(event) {
			
				// Get scroll position
				var scrollPosition = $(this).scrollTop();
				
				// Check if wallets aren't hidden, expand button is hidden, or scroll position isn't zero
				if(self.walletsDisplay.children("div").hasClass("hide") === false || self.walletsDisplay.find("button.expand").is(":hidden") === true || scrollPosition !== 0)
					
					// Save wallets scroll position
					self.walletsScrollPosition = scrollPosition;
			
			// Wallets display scroll stopped event
			}).scrollStopped(function(event) {
			
				// Save wallets scroll position setting and catch errors
				self.settings.setValue(Unlocked.SETTINGS_WALLETS_SCROLL_POSITION_NAME, self.walletsScrollPosition).catch(function(error) {
				
				});
			});
			
			// Wallets display create button click event
			this.walletsDisplay.find("div.new").find("button.create").on("click", function() {
			
				// Prevent showing messages
				self.message.prevent();
				
				// Save focus and blur
				self.focus.save(true);
			
				// Disable
				self.disable();
				
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show wallet's loading
				self.walletsDisplay.find("div.loading").removeClass("hide");
				
				// Show loading
				self.application.showLoading();
				
				// Prevent automatic lock
				self.automaticLock.prevent();
				
				// Show create wallet error
				var showCreateWalletError = function(error, walletButton) {
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Create Wallet Error'), Message.createText(error), false, function() {
					
						// Hide loading
						self.application.hideLoading();
						
						// Hide wallet's loading
						self.walletsDisplay.find("div.loading").addClass("hide");
					
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Enable
							self.enable();
							
							// Check if wallet button is provided
							if(walletButton !== Common.NO_ARGUMENT) {
							
								// Set that wallet button isn't clicked
								walletButton.removeClass("clicked");
								
								// Update wallets order buttons
								self.updateWalletsOrderButtons();
							}
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.focus.restore(false);
							
							// Hide message
							self.message.hide();
						}
					});
				};
				
				// Create a wallet
				self.wallets.create(Wallet.NO_NAME, Consensus.getWalletType(), Consensus.getNetworkType(), (self.node.isConnected() === true) ? Wallet.STATUS_SYNCED : ((self.node.connectionFailed() === true) ? Wallet.STATUS_ERROR : Wallet.STATUS_SYNCING), Wallet.NO_HARDWARE_WALLET, Wallet.NO_PASSPHRASE, false, Wallet.NO_BIP39_SALT, true).then(function(wallet) {
				
					// Get wallet's passphrase
					wallet.getPassphrase().then(function(walletPassphrase) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Created wallet Wallet %1$s.'), [
						
							// Wallet key path
							wallet.getKeyPath().toFixed()
						]);
					
						// Set timeout
						setTimeout(function() {
					
							// Set currency to the language's currency if specified or the currency display otherwise
							var currency = (self.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) ? Language.getConstant(Language.CURRENCY_CONSTANT) : self.currencyDisplay;
							
							// Get the price in the currency
							var price = self.prices.getPrice(currency);
						
							// Add wallet button
							var walletButtonAndScrollDuration = self.addWalletButton(wallet, price, currency, true, true);
							
							// Create address suffix for the wallet
							self.wallets.createAddressSuffix(wallet.getKeyPath());
							
							// Set timeout
							setTimeout(function() {
							
								// Get wallets display list
								var walletsDisplayList = self.walletsDisplay.find("div.list");
								
								// Set that clicked wallet button isn't clicked
								walletsDisplayList.find("button.clicked").removeClass("clicked");
								
								// Set that added wallet button is clicked
								walletButtonAndScrollDuration[Unlocked.ADD_WALLET_BUTTON_INDEX].addClass("clicked");
							
								// Update wallets order buttons
								self.updateWalletsOrderButtons();
							
								// Set that menu display buttons aren't clicked
								self.menuDisplay.find("button").removeClass("clicked");
								
								// Set timeout
								setTimeout(function() {
								
									// Show wallet section
									self.walletSection.show(false, false, false, {
									
										// Wallet key path
										[WalletSection.STATE_WALLET_KEY_PATH_NAME]: wallet.getKeyPath()
									
									}).then(function() {
									
										// Show message and allow showing messages
										self.message.show(Language.getDefaultTranslation('New Wallet Passphrase'), Message.createText(Language.getDefaultTranslation('This passphrase will allow you to recover Wallet %1$s. It\'s recommended that you record this passphrase in a secure, nondigital way.'), [wallet.getKeyPath().toFixed()]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"passphrase contextMenu\" spellcheck=\"false\">" + Common.htmlEncode(walletPassphrase) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('Don\'t disclose this passphrase to anyone.')) + "</b>", false, function() {
										
											// Hide loading
											self.application.hideLoading();
											
											// Hide wallet's loading
											self.walletsDisplay.find("div.loading").addClass("hide");
										
										}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
										
											// TODO Securely clear walletPassphrase
											
											// Check if message was displayed
											if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
											
												// Allow automatic lock
												self.automaticLock.allow();
												
												// Check if automatic lock isn't locking
												if(self.automaticLock.isLocking() === false) {
										
													// Enable
													self.enable();
													
													// Set that button isn't clicked
													button.removeClass("clicked");
													
													// Delete focus
													self.focus.delete();
													
													// Hide message
													self.message.hide();
												}
											}
										});
									
									// Catch errors
									}).catch(function(error) {
									
										// TODO Securely clear walletPassphrase
										
										// Allow automatic lock
										self.automaticLock.allow();
										
										// Check if automatic lock isn't locking
										if(self.automaticLock.isLocking() === false) {
									
											// Show create wallet error
											showCreateWalletError(error, walletButtonAndScrollDuration[Unlocked.ADD_WALLET_BUTTON_INDEX]);
										}
									});
								}, (self.walletsDisplay.find("button.expand").is(":hidden") === true) ? 0 : Unlocked.CREATE_WALLET_EXPAND_DELAY_MILLISECONDS);
								
							}, walletButtonAndScrollDuration[Unlocked.ADD_WALLET_SCROLL_DURATION_INDEX]);
							
						}, Unlocked.CREATE_WALLET_INITIAL_DELAY_MILLISECONDS);
						
					// Catch errors
					}).catch(function(error) {
					
						// Remove wallet and catch errors
						self.wallets.removeWallet(wallet.getKeyPath()).catch(function(error) {
						
						// Finally
						}).finally(function() {
						
							// Allow automatic lock
							self.automaticLock.allow();
							
							// Check if automatic lock isn't locking
							if(self.automaticLock.isLocking() === false) {
					
								// Show create wallet error
								showCreateWalletError(error);
							}
						});
					});
					
				// Catch errors
				}).catch(function(error) {
				
					// Allow automatic lock
					self.automaticLock.allow();
					
					// Check if automatic lock isn't locking
					if(self.automaticLock.isLocking() === false) {
				
						// Show create wallet error
						showCreateWalletError(error);
					}
				});
			});
			
			// Wallets display recover button click event
			this.walletsDisplay.find("div.new").find("button.recover").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show recover wallet error
				var showRecoverWalletError = function(error, walletButton) {
				
					// Show message immediately and allow showing messages
					self.message.show(Language.getDefaultTranslation('Recover Wallet Error'), Message.createText(error), true, function() {
					
						// Hide loading
						self.application.hideLoading();
						
						// Hide wallet's loading
						self.walletsDisplay.find("div.loading").addClass("hide");
					
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Enable
							self.enable();
							
							// Check if wallet button is provided
							if(walletButton !== Common.NO_ARGUMENT) {
							
								// Set that wallet button isn't clicked
								walletButton.removeClass("clicked");
								
								// Update wallets order buttons
								self.updateWalletsOrderButtons();
							}
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.focus.restore(false);
							
							// Hide message
							self.message.hide();
						}
					});
				};

				// Show message
				self.message.show(Language.getDefaultTranslation('Recover Wallet'), Message.createText(Language.getDefaultTranslation('Enter a wallet\'s passphrase to recover it.')) + Message.createLineBreak() + Message.createLineBreak() + Message.createInput(Language.getDefaultTranslation('Passphrase')) + Message.createLineBreak() + Message.createLineBreak() + Message.createText(Language.getDefaultTranslation('Select passphrase\'s origin.')) + Message.createLineBreak() + Message.createRadioButtons([Language.getDefaultTranslation('Non-hardware wallet'), Language.getDefaultTranslation('Hardware wallet')]) + Message.createLineBreak(), false, function() {
				
					// Save focus and blur
					self.focus.save(true);
					
					// Disable
					self.disable();
				
				}, Language.getDefaultTranslation('Cancel'), Language.getDefaultTranslation('Continue'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if recovering wallet
						if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
						
							// Prevent showing messages
							self.message.prevent();
							
							// Try
							try {
						
								// Get passphrase
								var passphrase = self.message.getInputText();
							}
							
							// Catch errors
							catch(error) {
							
								// Show recover wallet error
								showRecoverWalletError(Language.getDefaultTranslation('Invalid passphrase.'));
								
								// Return
								return;
							}
							
							// Try
							try {
							
								// Set use BIP39 to if the origin is a hardware wallet
								var useBip39 = self.message.getRadioButtonSelection() === 1;
							}
							
							// Catch errors
							catch(error) {
							
								// TODO Securely clear passphrase
							
								// Show recover wallet error
								showRecoverWalletError(Language.getDefaultTranslation('Invalid origin.'));
								
								// Return
								return;
							}
							
							// Disable message
							self.message.disable();
							
							// Show loading
							self.application.showLoading();
							
							// Set that message second button is loading
							self.message.setButtonLoading(Message.SECOND_BUTTON);
							
							// Prevent automatic lock
							self.automaticLock.prevent();
							
							// Split passphrase into mnemonic words
							var mnemonicWords = Common.splitRemaining(Common.ltrim(passphrase), Seed.WHITESPACE_PATTERN, Seed.VALID_MNEMONIC_LENGTHS[Seed.VALID_MNEMONIC_LENGTHS["length"] - 1]);
							
							// TODO Securely clear passphrase
							
							// Initialize BIP39 salt
							var bip39Salt = Wallet.NO_BIP39_SALT;
							
							// Check if using BIP39
							if(useBip39 === true) {
							
								// Check if the passphrase contains a BIP39 salt at the end
								if(Seed.VALID_MNEMONIC_LENGTHS.indexOf(mnemonicWords["length"] - 1) !== Common.INDEX_NOT_FOUND) {
								
									// Get BIP39 salt and remove it from the passphrase
									bip39Salt = (new TextEncoder()).encode(mnemonicWords.pop());
								}
							}
							
							// Create a wallet
							self.wallets.create(Wallet.NO_NAME, Consensus.getWalletType(), Consensus.getNetworkType(), (self.node.connectionFailed() === true) ? Wallet.STATUS_ERROR : Wallet.STATUS_SYNCING, Wallet.NO_HARDWARE_WALLET, mnemonicWords.join(" "), useBip39, bip39Salt, true, new BigNumber((useBip39 === true) ? Consensus.HARDWARE_WALLET_STARTING_HEIGHT : Consensus.FIRST_BLOCK_HEIGHT)).then(function(wallet) {
							
								// Set timeout
								setTimeout(function() {
									
									// TODO Securely clear mnemonic words
									
									// Log message
									Log.logMessage(Language.getDefaultTranslation('Recovered wallet Wallet %1$s.'), [
									
										// Wallet key path
										wallet.getKeyPath().toFixed()
									]);
									
									// Hide message
									self.message.hide();
									
									// Show wallet's loading
									self.walletsDisplay.find("div.loading").removeClass("hide");
								
									// Set timeout
									setTimeout(function() {
								
										// Set currency to the language's currency if specified or the currency display otherwise
										var currency = (self.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) ? Language.getConstant(Language.CURRENCY_CONSTANT) : self.currencyDisplay;
										
										// Get the price in the currency
										var price = self.prices.getPrice(currency);
									
										// Add wallet button
										var walletButtonAndScrollDuration = self.addWalletButton(wallet, price, currency, true, true);
										
										// Create address suffix for the wallet
										self.wallets.createAddressSuffix(wallet.getKeyPath());
										
										// Set timeout
										setTimeout(function() {
										
											// Get wallets display list
											var walletsDisplayList = self.walletsDisplay.find("div.list");
											
											// Set that clicked wallet button isn't clicked
											walletsDisplayList.find("button.clicked").removeClass("clicked");
											
											// Set that added wallet button is clicked
											walletButtonAndScrollDuration[Unlocked.ADD_WALLET_BUTTON_INDEX].addClass("clicked");
										
											// Update wallets order buttons
											self.updateWalletsOrderButtons();
										
											// Set that menu display buttons aren't clicked
											self.menuDisplay.find("button").removeClass("clicked");
											
											// Set timeout
											setTimeout(function() {
											
												// Show wallet section
												self.walletSection.show(false, false, false, {
												
													// Wallet key path
													[WalletSection.STATE_WALLET_KEY_PATH_NAME]: wallet.getKeyPath()
												
												}).then(function() {
												
													// Allow automatic lock
													self.automaticLock.allow();
													
													// Check if automatic lock isn't locking
													if(self.automaticLock.isLocking() === false) {
												
														// Hide loading
														self.application.hideLoading();
														
														// Hide wallet's loading
														self.walletsDisplay.find("div.loading").addClass("hide");
													
														// Enable
														self.enable();
														
														// Set that button isn't clicked
														button.removeClass("clicked");
														
														// Delete focus
														self.focus.delete();
														
														// Allow showing messages
														self.message.allow();
													}
												
												// Catch errors
												}).catch(function(error) {
												
													// Allow automatic lock
													self.automaticLock.allow();
													
													// Check if automatic lock isn't locking
													if(self.automaticLock.isLocking() === false) {
												
														// Show recover error
														showRecoverWalletError(error, walletButtonAndScrollDuration[Unlocked.ADD_WALLET_BUTTON_INDEX]);
													}
												});
											}, (self.walletsDisplay.find("button.expand").is(":hidden") === true) ? 0 : Unlocked.CREATE_WALLET_EXPAND_DELAY_MILLISECONDS);
											
										}, walletButtonAndScrollDuration[Unlocked.ADD_WALLET_SCROLL_DURATION_INDEX]);
										
									}, Unlocked.CREATE_WALLET_INITIAL_DELAY_MILLISECONDS);
								
								}, Unlocked.RECOVER_WALLET_INITIAL_DELAY_MILLISECONDS);
							
							// Catch errors
							}).catch(function(error) {
							
								// Check if BIP39 salt exists
								if(bip39Salt !== Wallet.NO_BIP39_SALT) {
								
									// Securely clear the BIP39 salt
									bip39Salt.fill(0);
								}
								
								// TODO Securely clear mnemonic words
								
								// Set timeout
								setTimeout(function() {
								
									// Allow automatic lock
									self.automaticLock.allow();
									
									// Check if automatic lock isn't locking
									if(self.automaticLock.isLocking() === false) {
								
										// Show recover wallet error
										showRecoverWalletError(error);
									}
								}, Unlocked.RECOVER_WALLET_INITIAL_DELAY_MILLISECONDS);
							});
						}
						
						// Otherwise
						else {
						
							// Enable unlocked
							self.enable();
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.focus.restore(false);
							
							// Hide message
							self.message.hide();
						}
					}
				});
			});
			
			// Wallets display hardware button click event
			this.walletsDisplay.find("div.new").find("button.hardware").on("click", function() {
			
				// Prevent showing messages
				self.message.prevent();
				
				// Save focus and blur
				self.focus.save(true);
			
				// Disable
				self.disable();
				
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show hardware wallet error
				var showHardwareWalletError = function(message, showImmediately, walletButton) {
					
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Hardware Wallet Error'), message, showImmediately, function() {
					
						// Hide loading
						self.application.hideLoading();
						
						// Hide wallet's loading
						self.walletsDisplay.find("div.loading").addClass("hide");
					
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Enable
							self.enable();
							
							// Check if wallet button is provided
							if(walletButton !== Common.NO_ARGUMENT) {
							
								// Set that wallet button isn't clicked
								walletButton.removeClass("clicked");
								
								// Update wallets order buttons
								self.updateWalletsOrderButtons();
							}
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.focus.restore(false);
							
							// Hide message
							self.message.hide();
						}
					});
				};
			
				// Check if hardware wallets are supported
				if(HardwareWallet.isSupported() === true) {
				
					// Prevent automatic lock
					self.automaticLock.prevent();
				
					// Initialize canceled
					var canceled = false;
					
					// Initialize release wallets exclusive hardware lock if canceled
					var releaseWalletsExclusiveHardwareLockIfCanceled = false;
					
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Hardware Wallet'), Message.createPendingResult() + Message.createLineBreak() + Message.createText(Language.getDefaultTranslation('Connecting to a hardware wallet.')), false, function() {
					
						// Message show unlocked connecting event
						$(self.message).one(Message.SHOW_EVENT + ".unlockedConnecting", function() {
						
							// Obtain wallets exclusive hardware lock
							self.wallets.obtainExclusiveHardwareLock().then(function() {
							
								// Check if not canceled
								if(canceled === false) {
					
									// Create hardware wallet
									var hardwareWallet = new HardwareWallet(self.application);
									
									// Set release wallets exclusive hardware lock if canceled
									releaseWalletsExclusiveHardwareLockIfCanceled = true;
									
									// Message before replace unlocked event
									$(self.message).on(Message.BEFORE_REPLACE_EVENT + ".unlocked", function(event, messageType, messageData) {
									
										// Check if not canceled
										if(canceled === false) {
										
											// Check message type
											switch(messageType) {
											
												// Application hardware wallet unlock message
												case Application.HARDWARE_WALLET_UNLOCK_MESSAGE:
												
													// Cancel replacing message
													self.message.cancelReplace();
													
													// Return false to stop other replace message
													return false;
											
												// Application hardware wallet disconnect message
												case Application.HARDWARE_WALLET_DISCONNECT_MESSAGE:
												
													// Set canceled
													canceled = true;
												
													// Turn off message before replace unlocked event
													$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".unlocked");
												
													// Clear release wallets exclusive hardware lock if canceled
													releaseWalletsExclusiveHardwareLockIfCanceled = false;
													
													// Release wallets exclusive hardware lock
													self.wallets.releaseExclusiveHardwareLock();
											
													// Allow automatic lock
													self.automaticLock.allow();
													
													// Check if automatic lock isn't locking
													if(self.automaticLock.isLocking() === false) {
													
														// Show hardware wallet error immediately
														showHardwareWalletError(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.')), true);
													}
													
													// Return false to stop other replace message
													return false;
											}
										}
									});
									
									// Connect to any hardware wallet descriptor
									hardwareWallet.connect(HardwareWallet.ANY_HARDWARE_WALLET_DESCRIPTOR, false, Language.getDefaultTranslation('Unlock that hardware wallet to continue connecting to it.'), [], false, true, function() {
																			
										// Return if canceled
										return canceled === true;
										
									}).then(function() {
									
										// Check if not canceled
										if(canceled === false) {
									
											// Turn off message before replace unlocked event
											$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".unlocked");
											
											// Clear release wallets exclusive hardware lock if canceled
											releaseWalletsExclusiveHardwareLockIfCanceled = false;
											
											// Allow automatic lock
											self.automaticLock.allow();
											
											// Check if automatic lock isn't locking
											if(self.automaticLock.isLocking() === false) {
											
												// Check if not canceled
												if(canceled === false) {
									
													// Initialize prevent cancel on hide
													var preventCancelOnHide = false;
													
													// Prevent automatic lock
													self.automaticLock.prevent();
												
													// Show message immediately
													self.message.show(Language.getDefaultTranslation('Hardware Wallet'), Message.createPendingResult() + Message.createLineBreak() + Message.createText(Language.getDefaultTranslation('Approve exporting the root public key for the account at index %1$s on that hardware wallet.'), [HardwareWallet.ACCOUNT.toFixed()]), true, function() {
													
														// Check if not canceled
														if(canceled === false) {
														
															// Message show unlocked confirm event
															$(self.message).one(Message.SHOW_EVENT + ".unlockedConfirm", function() {
															
																// Set prevent cancel on hide
																preventCancelOnHide = true;
																
																// Set release wallets exclusive hardware lock if canceled
																releaseWalletsExclusiveHardwareLockIfCanceled = true;
																
																// Get root public key from the hardware wallet
																hardwareWallet.getPublicKey().then(function(rootPublicKey) {
																
																	// Securely clear root public key
																	rootPublicKey.fill(0);
																
																	// Allow automatic lock
																	self.automaticLock.allow();
																	
																	// Check if automatic lock isn't locking
																	if(self.automaticLock.isLocking() === false) {
																
																		// Check if not canceled
																		if(canceled === false) {
																								
																			// Clear release wallets exclusive hardware lock if canceled
																			releaseWalletsExclusiveHardwareLockIfCanceled = false;
																		
																			// Disable message
																			self.message.disable();
																			
																			// Prevent automatic lock
																			self.automaticLock.prevent();
																		
																			// Create a wallet
																			self.wallets.create(Wallet.NO_NAME, Consensus.getWalletType(), Consensus.getNetworkType(), (self.node.connectionFailed() === true) ? Wallet.STATUS_ERROR : Wallet.STATUS_SYNCING, hardwareWallet, Wallet.NO_PASSPHRASE, false, Wallet.NO_BIP39_SALT, true, new BigNumber(Consensus.HARDWARE_WALLET_STARTING_HEIGHT)).then(function(wallet) {
																				
																				// Log message
																				Log.logMessage(Language.getDefaultTranslation('Created hardware wallet Wallet %1$s.'), [
																				
																					// Wallet key path
																					wallet.getKeyPath().toFixed()
																				]);
																				
																				// Release wallets exclusive hardware lock
																				self.wallets.releaseExclusiveHardwareLock();
																				
																				// Prevent showing messages
																				self.message.prevent();
																				
																				// Hide message
																				self.message.hide();
																				
																				// Show loading
																				self.application.showLoading();
																				
																				// Show wallet's loading
																				self.walletsDisplay.find("div.loading").removeClass("hide");
																			
																				// Set timeout
																				setTimeout(function() {
																			
																					// Set currency to the language's currency if specified or the currency display otherwise
																					var currency = (self.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) ? Language.getConstant(Language.CURRENCY_CONSTANT) : self.currencyDisplay;
																					
																					// Get the price in the currency
																					var price = self.prices.getPrice(currency);
																				
																					// Add wallet button
																					var walletButtonAndScrollDuration = self.addWalletButton(wallet, price, currency, true, true);
																					
																					// Create address suffix for the wallet
																					self.wallets.createAddressSuffix(wallet.getKeyPath());
																					
																					// Set timeout
																					setTimeout(function() {
																					
																						// Get wallets display list
																						var walletsDisplayList = self.walletsDisplay.find("div.list");
																						
																						// Set that clicked wallet button isn't clicked
																						walletsDisplayList.find("button.clicked").removeClass("clicked");
																						
																						// Set that added wallet button is clicked
																						walletButtonAndScrollDuration[Unlocked.ADD_WALLET_BUTTON_INDEX].addClass("clicked");
																					
																						// Update wallets order buttons
																						self.updateWalletsOrderButtons();
																					
																						// Set that menu display buttons aren't clicked
																						self.menuDisplay.find("button").removeClass("clicked");
																						
																						// Set timeout
																						setTimeout(function() {
																						
																							// Show wallet section
																							self.walletSection.show(false, false, false, {
																							
																								// Wallet key path
																								[WalletSection.STATE_WALLET_KEY_PATH_NAME]: wallet.getKeyPath()
																							
																							}).then(function() {
																							
																								// Allow automatic lock
																								self.automaticLock.allow();
																								
																								// Check if automatic lock isn't locking
																								if(self.automaticLock.isLocking() === false) {
																							
																									// Hide loading
																									self.application.hideLoading();
																									
																									// Hide wallet's loading
																									self.walletsDisplay.find("div.loading").addClass("hide");
																								
																									// Enable
																									self.enable();
																									
																									// Set that button isn't clicked
																									button.removeClass("clicked");
																									
																									// Delete focus
																									self.focus.delete();
																									
																									// Allow showing messages
																									self.message.allow();
																								}
																							
																							// Catch errors
																							}).catch(function(error) {
																							
																								// Allow automatic lock
																								self.automaticLock.allow();
																								
																								// Check if automatic lock isn't locking
																								if(self.automaticLock.isLocking() === false) {
																							
																									// Show hardware wallet error immediately
																									showHardwareWalletError(Message.createText(error), true, walletButtonAndScrollDuration[Unlocked.ADD_WALLET_BUTTON_INDEX]);
																								}
																							});
																						}, (self.walletsDisplay.find("button.expand").is(":hidden") === true) ? 0 : Unlocked.CREATE_WALLET_EXPAND_DELAY_MILLISECONDS);
																						
																					}, walletButtonAndScrollDuration[Unlocked.ADD_WALLET_SCROLL_DURATION_INDEX]);
																					
																				}, Unlocked.CREATE_WALLET_INITIAL_DELAY_MILLISECONDS);
																			
																			// Catch errors
																			}).catch(function(error) {
																			
																				// Check if hardware wallet isn't in use
																				if(hardwareWallet.getInUse() === false) {
																			
																					// Close the hardware wallet
																					hardwareWallet.close();
																				}
																				
																				// Release wallets exclusive hardware lock
																				self.wallets.releaseExclusiveHardwareLock();
																				
																				// Allow automatic lock
																				self.automaticLock.allow();
																				
																				// Check if automatic lock isn't locking
																				if(self.automaticLock.isLocking() === false) {
																			
																					// Show hardware wallet error immediately
																					showHardwareWalletError(Message.createText(error), true);
																				}
																			});
																		}
																		
																		// Otherwise
																		else {
																		
																			// Close the hardware wallet
																			hardwareWallet.close();
																		}
																	}
																	
																	// Otherwise
																	else {
																	
																		// Close the hardware wallet
																		hardwareWallet.close();
																	}
																
																// Catch errors
																}).catch(function(error) {
																
																	// Close the hardware wallet
																	hardwareWallet.close();
																	
																	// Check if not canceled
																	if(canceled === false) {
																	
																		// Clear release wallets exclusive hardware lock if canceled
																		releaseWalletsExclusiveHardwareLockIfCanceled = false;
																	
																		// Release wallets exclusive hardware lock
																		self.wallets.releaseExclusiveHardwareLock();
																	}
																	
																	// Allow automatic lock
																	self.automaticLock.allow();
																	
																	// Check if automatic lock isn't locking
																	if(self.automaticLock.isLocking() === false) {
																	
																		// Check if not canceled
																		if(canceled === false) {
																	
																			// Show hardware wallet error immediately
																			showHardwareWalletError(error, true);
																		}
																	}
																});
															});
														}
														
														// Otherwise
														else {
														
															// Return false
															return false;
														}
													
													}, Language.getDefaultTranslation('Cancel'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
													
														// Turn off message show unlocked confirm event
														$(self.message).off(Message.SHOW_EVENT + ".unlockedConfirm");
										
														// Set canceled
														canceled = true;
														
														// Check if releasing wallets exclusive hardware lock if canceled
														if(releaseWalletsExclusiveHardwareLockIfCanceled === true) {
														
															// Release wallets exclusive hardware lock
															self.wallets.releaseExclusiveHardwareLock();
														}
													
														// Check if message was displayed
														if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
														
															// Allow automatic lock
															self.automaticLock.allow();
															
															// Check if automatic lock isn't locking
															if(self.automaticLock.isLocking() === false) {
														
																// Enable
																self.enable();
																
																// Set that button isn't clicked
																button.removeClass("clicked");
																
																// Restore focus and don't blur
																self.focus.restore(false);
																
																// Hide message
																self.message.hide();
															}
														}
														
														// Check if not preventing cancel on hide
														else if(preventCancelOnHide === false) {
														
															// Close the hardware wallet
															hardwareWallet.close();
														
															// Release wallets exclusive hardware lock
															self.wallets.releaseExclusiveHardwareLock();
														
															// Allow automatic lock
															self.automaticLock.allow();
														}
													});
												}
												
												// Otherwise
												else {
												
													// Close the hardware wallet
													hardwareWallet.close();
													
													// Release wallets exclusive hardware lock
													self.wallets.releaseExclusiveHardwareLock();
												}
											}
											
											// Otherwise
											else {
											
												// Close the hardware wallet
												hardwareWallet.close();
												
												// Release wallets exclusive hardware lock
												self.wallets.releaseExclusiveHardwareLock();
											}
										}
										
										// Otherwise
										else {
										
											// Close the hardware wallet
											hardwareWallet.close();
										}
									
									// Catch errors
									}).catch(function(error) {
									
										// Check if not canceled
										if(canceled === false) {
										
											// Set canceled
											canceled = true;
										
											// Turn off message before replace unlocked event
											$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".unlocked");
										
											// Clear release wallets exclusive hardware lock if canceled
											releaseWalletsExclusiveHardwareLockIfCanceled = false;
											
											// Release wallets exclusive hardware lock
											self.wallets.releaseExclusiveHardwareLock();
									
											// Allow automatic lock
											self.automaticLock.allow();
											
											// Check if automatic lock isn't locking
											if(self.automaticLock.isLocking() === false) {
											
												// Check if error is canceled
												if(error === Common.CANCELED_ERROR) {
												
													// Enable
													self.enable();
													
													// Set that button isn't clicked
													button.removeClass("clicked");
													
													// Restore focus and don't blur
													self.focus.restore(false);
													
													// Hide message
													self.message.hide();
												}
												
												// Otherwise
												else {
												
													// Show hardware wallet error immediately
													showHardwareWalletError(error, true);
												}
											}
										}
									});
								}
								
								// Otherwise
								else {
								
									// Release wallets exclusive hardware lock
									self.wallets.releaseExclusiveHardwareLock();
								}
							});
						});
					
					}, Language.getDefaultTranslation('Cancel'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Turn off message show unlocked connecting event
						$(self.message).off(Message.SHOW_EVENT + ".unlockedConnecting");
						
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
						
							// Check if not canceled
							if(canceled === false) {
						
								// Set canceled
								canceled = true;
								
								// Turn off message before replace unlocked event
								$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".unlocked");
								
								// Check if releasing wallets exclusive hardware lock if canceled
								if(releaseWalletsExclusiveHardwareLockIfCanceled === true) {
								
									// Release wallets exclusive hardware lock
									self.wallets.releaseExclusiveHardwareLock();
								}
								
								// Allow automatic lock
								self.automaticLock.allow();
								
								// Check if automatic lock isn't locking
								if(self.automaticLock.isLocking() === false) {
							
									// Enable
									self.enable();
									
									// Set that button isn't clicked
									button.removeClass("clicked");
									
									// Restore focus and don't blur
									self.focus.restore(false);
									
									// Hide message
									self.message.hide();
								}
							}
						}
					});
				}
				
				// Otherwise
				else {
				
					// Show hardware wallet error
					showHardwareWalletError(Message.createText(Language.getDefaultTranslation('Your browser doesn\'t allow using USB or Bluetooth devices.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Update your browser to use this feature.')), false);
				}
			});
			
			// Wallets display button click event
			this.walletsDisplay.find("div.order").find("button").on("click", function() {
			
				// Get button
				var button = $(this);
			
				// Check if button isn't disabled
				if(button.hasClass("disabled") === false) {
				
					// Prevent showing messages
					self.message.prevent();
				
					// Save focus and blur
					self.focus.save(true);
				
					// Disable
					self.disable();
					
					// Set that button is clicked
					button.addClass("clicked");
					
					// Show wallet's loading
					self.walletsDisplay.find("div.loading").removeClass("hide");
					
					// Show loading
					self.application.showLoading();
					
					// Prevent automatic lock
					self.automaticLock.prevent();
				
					// Get selected wallet button
					var selectedWalletButton = self.walletsDisplay.find("div.list").find("button.clicked");
					
					// Get other wallet button
					var otherWalletButton = (button.hasClass("up") === true) ? selectedWalletButton.prev() : selectedWalletButton.next();
					
					// Set timeout
					setTimeout(function() {
					
						// Get wallets display list
						var walletsDisplayList = self.walletsDisplay.find("div.list");
						
						// Save current scroll position
						var currentScrollPosition = walletsDisplayList.scrollTop();
					
						// Change order
						self.wallets.changeOrder(parseInt(selectedWalletButton.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE), parseInt(otherWalletButton.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE)).then(function() {
						
							// Check if up button was pressed
							if(button.hasClass("up") === true) {
							
								// Move selected wallet up in the order
								otherWalletButton.insertAfter(selectedWalletButton);
							}
							
							// Otherwise
							else {
							
								// Move selected wallet down in the order
								otherWalletButton.insertBefore(selectedWalletButton);
							}
							
							// Restore current scroll position
							walletsDisplayList.scrollTop(currentScrollPosition);
							
							// Update wallets order buttons
							self.updateWalletsOrderButtons();
							
							// Get wallet's display list height
							var walletsDisplayListHeight = walletsDisplayList.get(0)["clientHeight"];
							
							// Get button's height
							var buttonHeight = selectedWalletButton.outerHeight(true);
							
							// Initialize units to scroll
							var unitsToScroll = 0;
							
							// Check if need to scroll up to show selected wallet button
							if(selectedWalletButton.offset()["top"] - parseFloat(getComputedStyle(selectedWalletButton.get(0))["marginTop"]) * 2 + Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE * 2 < walletsDisplayList.offset()["top"]) {
							
								// Get units to scroll
								unitsToScroll = walletsDisplayList.offset()["top"] - selectedWalletButton.offset()["top"] + parseFloat(getComputedStyle(selectedWalletButton.get(0))["marginTop"]) * 2 - Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE * 2;
							}
							
							// Otherwise check if need to scroll down to show selected wallet button
							else if(selectedWalletButton.offset()["top"] + buttonHeight + Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE > walletsDisplayList.offset()["top"] + walletsDisplayListHeight) {
							
								// Get units to scroll
								unitsToScroll = walletsDisplayList.offset()["top"] + walletsDisplayListHeight - selectedWalletButton.offset()["top"] - buttonHeight - Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE;
								
								// Check if button's height is larger than the wallets display list height
								if(buttonHeight + parseFloat(getComputedStyle(selectedWalletButton.get(0))["marginTop"]) * 2 - Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE * 2 > walletsDisplayListHeight) {
								
									// Adjust units to scroll to go to the top of the button
									unitsToScroll += buttonHeight - walletsDisplayListHeight + parseFloat(getComputedStyle(selectedWalletButton.get(0))["marginTop"]) * 2 - Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE * 2;
								}
							}
							
							// Check if scrolling
							if(unitsToScroll !== 0) {
							
								// Set scroll duration
								var scrollDuration = Math.abs(unitsToScroll) * Unlocked.SCROLL_WALLET_INTO_VIEW_SPEED_SCALAR;
								
								// Animate scrolling wallets display list to button
								walletsDisplayList.animate({
								
									// Scroll top
									"scrollTop": walletsDisplayList.scrollTop() - unitsToScroll
								
								}, scrollDuration);
							}
							
							// Set timeout
							setTimeout(function() {
							
								// Allow automatic lock
								self.automaticLock.allow();
								
								// Check if automatic lock isn't locking
								if(self.automaticLock.isLocking() === false) {
							
									// Hide loading
									self.application.hideLoading();
									
									// Hide wallet's loading
									self.walletsDisplay.find("div.loading").addClass("hide");
									
									// Enable
									self.enable();
									
									// Set that button isn't clicked
									button.removeClass("clicked");
									
									// Delete focus
									self.focus.delete();
									
									// Allow showing messages
									self.message.allow();
								}
								
							}, Unlocked.CHANGE_ORDER_AFTER_DELAY_MILLISECONDS);
						
						// Catch errors
						}).catch(function(error) {
						
							// Allow automatic lock
							self.automaticLock.allow();
							
							// Check if automatic lock isn't locking
							if(self.automaticLock.isLocking() === false) {
						
								// Show message and allow showing messages
								self.message.show(Language.getDefaultTranslation('Order Error'), Message.createText(error), false, function() {
								
									// Hide loading
									self.application.hideLoading();
									
									// Hide wallet's loading
									self.walletsDisplay.find("div.loading").addClass("hide");
								
								}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Check if message was displayed
									if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
								
										// Enable
										self.enable();
										
										// Set that button isn't clicked
										button.removeClass("clicked");
										
										// Restore focus and don't blur
										self.focus.restore(false);
										
										// Hide message
										self.message.hide();
									}
								});
							}
						});
					}, Unlocked.CHANGE_ORDER_BEFORE_DELAY_MILLISECONDS);
				}
			});
			
			// Window resize event
			$(window).on("resize", function() {
			
				// Run on resize
				self.onResize();
			});
			
			// Menu display button language change event
			this.menuDisplay.find("button").children().on(Language.CHANGE_EVENT, function() {
			
				// Update menu display
				self.updateMenuDisplay();
			});
			
			// Menu display buttons and new wallets buttons hover in event
			this.unlockedDisplay.find("div.menu button, div.wallets div.new button").hover(function() {
			
				// Check if can hover
				if(typeof matchMedia === "function" && matchMedia("(any-hover: hover)")["matches"] === true) {
			
					// Get element
					var element = $(this);
					
					// Check if element's text is shown
					if(element.children().is(":visible") === true) {
				
						// Save element's title
						element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title", element.attr("title"));
						
						// Remove element's title
						element.removeAttr("title");
					}
				}
			
			// Menu display buttons and new wallets buttons hover out event
			}, function() {
			
				// Check if can hover
				if(typeof matchMedia === "function" && matchMedia("(any-hover: hover)")["matches"] === true) {
			
					// Get element
					var element = $(this);
					
					// Check if element isn't focused
					if(element.is(":focus") === false) {
					
						// Check if element's title is saved
						if(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title") !== Common.NO_ATTRIBUTE) {
					
							// Restore element's title
							element.attr("title", element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title"));
							
							// Remove element's saved title
							element.removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "title");
						}
					}
				}
			
			// Menu display buttons and new wallets buttons focus event
			}).on("focus", function() {
			
				// Get element
				var element = $(this);
				
				// Check if element's text is shown
				if(element.children().is(":visible") === true) {
			
					// Save element's title
					element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title", element.attr("title"));
					
					// Remove element's title
					element.removeAttr("title");
				}
			
			// Menu display buttons and new wallets buttons blur event
			}).on("blur", function() {
			
				// Get element
				var element = $(this);
				
				// Check if can't hover or element isn't hovered
				if((typeof matchMedia !== "function" || matchMedia("(any-hover: hover)")["matches"] === false) || element.is(":hover") === false) {
				
					// Check if element's title is saved
					if(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title") !== Common.NO_ATTRIBUTE) {
				
						// Restore element's title
						element.attr("title", element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title"));
						
						// Remove element's saved title
						element.removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "title");
					}
				}
			});
		}
		
		// Initialize
		initialize() {
			
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Try
				try {
				
					// Get wallets in order
					var walletsInOrder = self.wallets.getWalletsInOrder();
				}
				
				// Catch errors
				catch(error) {
				
					// Reject error
					reject(error);
					
					// Return
					return;
				}
				
				// Set currency to the language's currency if specified or the currency display otherwise
				var currency = (self.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) ? Language.getConstant(Language.CURRENCY_CONSTANT) : self.currencyDisplay;
				
				// Get the price in the currency
				var price = self.prices.getPrice(currency);
				
				// Go through all wallets in order
				for(var i = 0; i < walletsInOrder["length"]; ++i) {
				
					// Get wallet
					var wallet = walletsInOrder[i];
						
					// Add wallet button
					var walletButtonAndScrollDuration = self.addWalletButton(wallet, price, currency);
					
					// Check if wallet isn't performing an address suffix operation
					if(wallet.getPerformingAddressSuffixOperation() === false) {
					
						// Check if wallet doesn't have an address suffix
						if(wallet.getAddressSuffix() === Wallet.NO_ADDRESS_SUFFIX)
						
							// Create address suffix for the wallet
							self.wallets.createAddressSuffix(wallet.getKeyPath());
						
						// Otherwise
						else
						
							// Verify wallet's address suffix
							self.wallets.verifyAddressSuffix(wallet.getKeyPath());
					}
				}
				
				// Check current section
				switch(self.sections.getCurrentSectionName()) {
					
					// About section
					case self.aboutSection.getName():
					
						// Set that about menu button is clicked
						self.menuDisplay.find("button.about").addClass("clicked");
						
						// Break
						break;
					
					// Transaction section
					case self.transactionSection.getName():
					
						// Get current section state
						var state = self.sections.getCurrentSectionState();
						
						// Get wallet's key path from state
						var walletKeyPath = state[TransactionSection.STATE_WALLET_KEY_PATH_NAME];
						
						// Get wallet's button
						var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
						
						// Set that wallet's button is clicked
						button.addClass("clicked");
						
						// Break
						break;
					
					// Account section
					case self.accountSection.getName():
					
						// Set that account menu button is clicked
						self.menuDisplay.find("button.account").addClass("clicked");
						
						// Break
						break;
					
					// Settings section
					case self.settingsSection.getName():
					
						// Set that settings menu button is clicked
						self.menuDisplay.find("button.settings").addClass("clicked");
						
						// Break
						break;
					
					// Wallet section
					case self.walletSection.getName():
					
						// Get current section state
						var state = self.sections.getCurrentSectionState();
						
						// Get wallet's key path from state
						var walletKeyPath = (state !== Section.NO_STATE) ? state[WalletSection.STATE_WALLET_KEY_PATH_NAME] : walletsInOrder[0].getKeyPath();
						
						// Get wallet's button
						var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
						
						// Set that wallet's button is clicked
						button.addClass("clicked");
					
						// Break
						break;
					
					// Send payment section
					case self.sendPaymentSection.getName():
					
						// Get current section state
						var state = self.sections.getCurrentSectionState();
						
						// Get wallet's key path from state
						var walletKeyPath = state[SendPaymentSection.STATE_WALLET_KEY_PATH_NAME];
						
						// Get wallet's button
						var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
						
						// Set that wallet's button is clicked
						button.addClass("clicked");
						
						// Break
						break;
					
					// Log section
					case self.logSection.getName():
					
						// Set that logmenu button is clicked
						self.menuDisplay.find("button.log").addClass("clicked");
						
						// Break
						break;
				}
				
				// Update wallets order buttons
				self.updateWalletsOrderButtons();
				
				// Check if current section isn't temporary
				if(self.sections.isCurrentSectionTemporary() === false) {
				
					// Check if an extension request exists
					if(Extension.getRequests()["length"] !== 0) {
					
						// Get request
						var request = Extension.getRequests().shift();
						
						// Insert request into sections
						self.sections.insertStateInStack(request["Name"], request["State"], true);
					}
				}
				
				// Return showing the current section
				return self.sections.showCurrentSection().then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Reset
		reset() {
		
			// Set that unlocked display doesn't have the wallets expanded
			this.unlockedDisplay.removeClass("walletsExpanded");

			// Show sections display
			this.sectionsDisplay.children("div").removeClass("hide");

			// Hide all sections
			this.sectionsDisplay.children("div").children("div").addClass("hide");

			// Collapse wallets display and allow it to transition
			this.walletsDisplay.removeClass("expand noTransition");

			// Hide wallets display section
			this.walletsDisplay.children("div").addClass("hide");

			// Set that unlocked display wallets expand button isn't clicked
			this.walletsDisplay.find("button.expand").removeClass("clicked");

			// Remove all wallet buttons in the wallets display
			this.walletsDisplay.find("div.list").empty();

			// Set that wallets display order buttons are enabled and not clicked
			this.walletsDisplay.find("div.order").find("button").removeClass("disabled clicked");

			// Set that menu display buttons aren't clicked
			this.menuDisplay.find("button").removeClass("clicked");

			// Set that new wallet buttons aren't clicked
			this.walletsDisplay.find("div.new").find("button").removeClass("clicked");

			// Hide wallet's loading
			this.walletsDisplay.find("div.loading").addClass("hide");
			
			// Reset sections
			this.sections.reset();
		}
		
		// Disable
		disable() {
		
			// Disable tabbing to everything in unlocked display and disable everything in unlocked display
			this.unlockedDisplay.find("*").disableTab().disable();
		}
		
		// Enable
		enable() {
		
			// Enable tabbing to everything in unlocked display and enable everything in unlocked display
			this.unlockedDisplay.find("*").enableTab().enable();
		}
		
		// Is disabled
		isDisabled() {
		
			// Return if unlocked display is disabled
			return this.unlockedDisplay.children("div").attr("tabindex") === Common.NO_TAB_INDEX;
		}
		
		// Hide wallets
		hideWallets(disableWhileHiding = true) {
		
			// Check if wallets display expand button is visible and wallets are shown
			if(this.walletsDisplay.find("button.expand").is(":visible") === true && this.walletsDisplay.hasClass("expand") === true) {
			
				// Clear wallets expanded
				this.walletsExpanded = false;
				
				// Save wallets expanded setting and catch errors
				this.settings.setValue(Unlocked.SETTINGS_WALLETS_EXPANDED_NAME, this.walletsExpanded).catch(function(error) {
				
				});
		
				// Check if disable while hiding
				if(disableWhileHiding === true){
				
					// Disable
					this.disable();
					
					// Prevent automatic lock
					this.automaticLock.prevent();
				}
				
				// Show sections display section
				this.sectionsDisplay.children("div").removeClass("hide");
				
				// Trigger a resize event
				$(window).trigger("resize");
				
				// Set self
				var self = this;
				
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Set timeout
					setTimeout(function() {
					
						// Collapse wallets display
						self.walletsDisplay.removeClass("expand");
						
						// Wallets display transition end or timeout event
						self.walletsDisplay.transitionEndOrTimeout(function() {
						
							// Hide wallets display section
							self.walletsDisplay.children("div").addClass("hide");
							
							// Set that unlocked display doesn't have the wallets expanded
							self.unlockedDisplay.removeClass("walletsExpanded");
							
							// Check if disable while hiding
							if(disableWhileHiding === true) {
							
								// Allow automatic lock
								self.automaticLock.allow();
								
								// Check if automatic lock isn't locking
								if(self.automaticLock.isLocking() === false) {
								
									// Enable
									self.enable();
								}
							}
							
							// Resolve
							resolve();
							
						}, "width");
					}, 0);
				});
			}
			
			// Otherwise
			else {
			
				// Trigger a resize event
				$(window).trigger("resize");
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Resolve
					resolve();
				});
			}
		}
		
		// Get displayed address type
		getDisplayedAddressType() {
		
			// Return displayed address type
			return this.displayedAddressType;
		}
		
		// Get displayed currency
		getDisplayedCurrency() {
		
			// Return displayed currency
			return (this.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) ? Language.getConstant(Language.CURRENCY_CONSTANT) : this.currencyDisplay;
		}
		
		// Remove wallet button
		removeWalletButton(walletKeyPath) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get wallet's button
				var button = self.walletsDisplay.find("div.list").find("button[" + Common.DATA_ATTRIBUTE_PREFIX + "keyPath=\"" + walletKeyPath.toFixed() + "\"]");
				
				// Check if wallet's button exists
				if(button["length"] !== 0) {
				
					// Show wallet's loading
					self.walletsDisplay.find("div.loading").removeClass("hide");
				
					// Set timeout
					setTimeout(function() {
				
						// Hide button
						button.addClass("hide");
						
						// Check if button is visible
						if(self.walletsDisplay.find("button.expand").is(":visible") === false) {
						
							// Button transition end or timeout event
							button.transitionEndOrTimeout(function() {
							
								// Set timeout
								setTimeout(function() {
							
									// Remove button
									button.remove();
									
									// Update wallets order buttons
									self.updateWalletsOrderButtons();
								
									// Set timeout
									setTimeout(function() {
								
										// Hide wallet's loading
										self.walletsDisplay.find("div.loading").addClass("hide");
										
										// Resolve
										resolve();
										
									}, Unlocked.REMOVE_WALLET_BUTTON_DELAY_ENDING_MILLISECONDS);
									
								}, Unlocked.REMOVE_WALLET_BUTTON_DELAY_AFTER_MILLISECONDS);
								
							}, "opacity");
						}
						
						// Otherwise
						else {
						
							// Remove button
							button.remove();
						
							// Hide wallet's loading
							self.walletsDisplay.find("div.loading").addClass("hide");
							
							// Update wallets order buttons
							self.updateWalletsOrderButtons();
							
							// Resolve
							resolve();
						}
					}, Unlocked.REMOVE_WALLET_BUTTON_DELAY_BEFORE_MILLISECONDS);
				}
				
				// Otherwise
				else {
				
					// Resolve
					resolve();
				}
			});
		}
		
		// Show event
		static get SHOW_EVENT() {
		
			// Return show event
			return "UnlockedShowEvent";
		}
	
	// Private
	
		// On resize
		onResize() {
		
			// Get current body display width
			var currentBodyDisplayWidth = this.bodyDisplay.width();
			
			// Check if expand wallet's button is changing size
			if((this.previousBodyDisplayWidth <= Unlocked.LARGE_EXPAND_WALLETS_BUTTON_MAXIMUM_BODY_WIDTH && currentBodyDisplayWidth > Unlocked.LARGE_EXPAND_WALLETS_BUTTON_MAXIMUM_BODY_WIDTH) || (this.previousBodyDisplayWidth > Unlocked.LARGE_EXPAND_WALLETS_BUTTON_MAXIMUM_BODY_WIDTH && currentBodyDisplayWidth <= Unlocked.LARGE_EXPAND_WALLETS_BUTTON_MAXIMUM_BODY_WIDTH)) {
			
				// Make wallet's display transition instantly
				this.walletsDisplay.addClass("noTransition");
				
				// Set self
				var self = this;
				
				// Request animation frame
				requestAnimationFrame(function() {
				
					// Allow wallet's display to transition
					self.walletsDisplay.removeClass("noTransition");
				});
			}
			
			// Update previous body display width
			this.previousBodyDisplayWidth = currentBodyDisplayWidth;
			
			// Get wallets display list
			var walletsDisplayList = this.walletsDisplay.find("div.list");
			
			// Check if wallets are hidden, expand button is hidden, and wallets scroll position isn't correct
			if(this.walletsDisplay.children("div").hasClass("hide") === true && this.walletsDisplay.find("button.expand").is(":hidden") === true && walletsDisplayList.scrollTop() !== this.walletsScrollPosition)
			
				// Restore wallets scroll position
				walletsDisplayList.scrollTop(this.walletsScrollPosition);
			
			// Update menu display
			this.updateMenuDisplay();
			
			// Go through all wallet display wallet button addresses
			this.walletsDisplay.find("div.list").find("button").find("span.address").children("p").each(function() {
			
				// Get address display
				var addressDisplay = $(this);
				
				// Update address display
				Unlocked.updateAddressDisplay(addressDisplay);
			});
		}
		
		// Show wallets
		showWallets() {
		
			// Disable
			this.disable();
			
			// Prevent automatic lock
			this.automaticLock.prevent();
		
			// Show wallets display section
			this.walletsDisplay.children("div").removeClass("hide");
			
			// Restore wallets scroll position
			this.walletsDisplay.find("div.list").scrollTop(this.walletsScrollPosition);
			
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Set timeout
				setTimeout(function() {
				
					// Expand wallets display
					self.walletsDisplay.addClass("expand");
					
					// Set wallets expanded
					self.walletsExpanded = true;
				
					// Save wallets expanded setting and catch errors
					self.settings.setValue(Unlocked.SETTINGS_WALLETS_EXPANDED_NAME, self.walletsExpanded).catch(function(error) {
					
					});
				
					// Wallets display transition start event
					self.walletsDisplay.one("transitionstart", function() {
					
						// Go through all wallet display list buttons' status
						self.walletsDisplay.find("div.list").find("button").find("span.totals").find("span.status").each(function() {
						
							// Get status
							var status = $(this);
							
							// Request animation frame
							requestAnimationFrame(function() {
							
								// Set status to not transition
								status.addClass("noTransition");
								
								// Request animation frame
								requestAnimationFrame(function() {
								
									// Allow status to transition
									status.removeClass("noTransition");
								});
							});
						});
					
					// Wallets display transition end or timeout event
					}).transitionEndOrTimeout(function() {
					
						// Set that unlocked display has the wallets expanded
						self.unlockedDisplay.addClass("walletsExpanded");
					
						// Set timeout
						setTimeout(function() {
						
							// Hide sections display section
							self.sectionsDisplay.children("div").addClass("hide");
					
							// Allow automatic lock
							self.automaticLock.allow();
							
							// Check if automatic lock isn't locking
							if(self.automaticLock.isLocking() === false) {
							
								// Enable
								self.enable();
							}
							
							// Resolve
							resolve();
							
						}, Unlocked.SHOW_WALLETS_AFTER_DELAY_MILLISECONDS);
						
					}, "width");
				}, 0);
			});
		}
		
		// Add wallet button
		addWalletButton(wallet, price, currency, isSelected = false, fadeIn = false) {
		
			// Check displayed amount type
			switch(this.displayedAmountType) {
			
				// Spendable
				case Unlocked.SPENDABLE_DISPLAYED_AMOUNT_TYPE:
				
					// Set amount to display to the wallet's unspent amount
					var amountToDisplay = wallet.getUnspentAmount();
				
					// Break
					break;
				
				// Confirmed
				case Unlocked.CONFIRMED_DISPLAYED_AMOUNT_TYPE:
				
					// Set amount to display to the wallet's unspent amount
					var amountToDisplay = wallet.getUnspentAmount();
					
					// Add wallet's pending amount to the amount to display
					amountToDisplay = amountToDisplay.plus(wallet.getPendingAmount());
				
					// Break
					break;
				
				// Confirmed and unconfirmed
				case Unlocked.CONFIRMED_AND_UNCONFIRMED_DISPLAYED_AMOUNT_TYPE:
				
					// Set amount to display to the wallet's unspent amount
					var amountToDisplay = wallet.getUnspentAmount();
					
					// Add wallet's pending amount to the amount to display
					amountToDisplay = amountToDisplay.plus(wallet.getPendingAmount());
					
					// Add wallet's unconfirmed amount to the amount to display
					amountToDisplay = amountToDisplay.plus(wallet.getUnconfirmedAmount());
				
					// Break
					break;
			}
			
			// Get amount to display in number's base
			amountToDisplay = amountToDisplay.dividedBy(Consensus.VALUE_NUMBER_BASE);
		
			// Get wallet's address
			var address = wallet.getAddress(this.displayedAddressType);
		
			// Create button for wallet
			var button = $("<button style=\"background-color: " + Common.htmlEncode(wallet.getColor()) + ";\">" +
				"<span class=\"name\">" +
					"<span>" +
						((wallet.getName() !== Wallet.NO_NAME) ? "<span class=\"name\">" + Common.htmlEncode(wallet.getName()) + "</span>" : Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Wallet %1$s'), [wallet.getKeyPath().toFixed()], "name")) +
						"<span class=\"status\"></span>" +
					"</span>" +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Selected'), [], "selected", true) +
				"</span>" +
				"<span class=\"totals\">" +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount: %1$c'), [[amountToDisplay.toFixed(), Consensus.CURRENCY_NAME]], "amount") +
					((price !== Prices.NO_PRICE_FOUND) ? Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value: %1$c'), [[amountToDisplay.multipliedBy(price).toFixed(), currency]], "value") : "") +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Syncing'), [], "status syncing", true) +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Synced'), [], "status synced", true) +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Syncing failed'), [], "status error", true) +
				"</span>" +
				"<span class=\"address\">" +
					"<p>" + Common.htmlEncode(address) + "</p>" +
					Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) +
				"</span>" +
			"</button>");
			
			// Check wallet's syncing status
			switch(wallet.getSyncingStatus()) {
			
				// Status syncing or resyncing
				case Wallet.STATUS_SYNCING:
				case Wallet.STATUS_RESYNCING:
				
					// Set that button shows syncing
					button.addClass("syncing");
					
					// Break
					break;
				
				// Status synced
				case Wallet.STATUS_SYNCED:
				
					// Set that button shows synced
					button.addClass("synced");
					
					// Break
					break;
				
				// Status error
				case Wallet.STATUS_ERROR:
				
					// Set that button shows error
					button.addClass("error");
					
					// Break
					break;
			}
			
			// Set button's key path
			button.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath", wallet.getKeyPath().toFixed());
			
			// Set button's address
			button.find("span.address").attr(Common.DATA_ATTRIBUTE_PREFIX + "address", address);
			
			// Check if wallet's unspent amount is at least the whale amount threshold
			if(wallet.getUnspentAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).isGreaterThanOrEqualTo(Unlocked.WHALE_AMOUNT_THRESHOLD) === true) {
			
				// Add whale overlay to button
				button.addClass("whale");
			}
			
			// Check if wallet is a hardware wallet
			if(wallet.getHardwareType() !== Wallet.NO_HARDWARE_TYPE) {
			
				// Set that button is for a hardware wallet
				button.addClass("hardware");
				
				// Check if wallet's hardware wallet is connected
				if(wallet.isHardwareConnected() === true) {
				
					// Set title
					var title = Language.getDefaultTranslation('Hardware wallet connected');
					
					// Get wallet status
					var walletStatus = button.find("span.name").find("span.status");
					
					// Check if hardware wallet's connection type is Bluetooth
					if(wallet.getHardwareWallet().getConnectionType() === HardwareWallet.BLUETOOTH_CONNECTION_TYPE) {
					
						// Have wallet status show Bluetooth
						walletStatus.addClass("bluetooth");
					}
					
					// Set wallet status's title to show that wallet is connected
					walletStatus.addClass("connected").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
				}
			}
			
			// Check wallet's hardware type
			switch(wallet.getHardwareType()) {
			
				// Legder hardware type
				case HardwareWallet.LEDGER_HARDWARE_TYPE:
				
					// Add Ledger overlay to button
					button.addClass("ledger");
				
					// Break
					break;
				
				// Trezor hardware type
				case HardwareWallet.TREZOR_HARDWARE_TYPE:
				
					// Add Trezor overlay to button
					button.addClass("trezor");
				
					// Break
					break;
			}
			
			// Disable tabbing to button and disable button
			button.disableTab().disable();
			
			// Button transition end event
			button.on("transitionend", function(event) {
			
				// Stop propagation
				event.stopPropagation();
			});
			
			// Get wallets display list
			var walletsDisplayList = this.walletsDisplay.find("div.list");
			
			// Check if fading in
			if(fadeIn === true)
			
				// Set that button is hidden
				button.addClass("hide");
			
			// Append button to wallets display list
			walletsDisplayList.append(button);
			
			// Check if selected
			if(isSelected === true) {
			
				// Get wallet's display list height
				var walletsDisplayListHeight = walletsDisplayList.get(0)["clientHeight"];
				
				// Get button's height
				var buttonHeight = button.outerHeight(true);
			
				// Get units to scroll
				var unitsToScroll = button.offset()["top"] - walletsDisplayList.offset()["top"] - walletsDisplayListHeight + buttonHeight + Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE;
				
				// Check if button's height is larger than the wallets display list height
				if(buttonHeight + parseFloat(getComputedStyle(button.get(0))["marginTop"]) * 2 - Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE * 2 > walletsDisplayListHeight) {
				
					// Adjust units to scroll to go to the top of the button
					unitsToScroll -= buttonHeight - walletsDisplayListHeight + parseFloat(getComputedStyle(button.get(0))["marginTop"]) * 2 - Unlocked.WALLET_BUTTON_HEIGHT_TOLERANCE * 2;
				}
				
				// Set scroll duration
				var scrollDuration = unitsToScroll * Unlocked.SCROLL_WALLET_INTO_VIEW_SPEED_SCALAR;
			
				// Check if fading in
				if(fadeIn === true) {
			
					// Check if button is fully scrolled in view
					var buttonTop = button.offset()["top"] - walletsDisplayList.offset()["top"];
					
					if(buttonTop >= 0 && (buttonTop + button.height()) <= walletsDisplayList.height()) {
					
						// Request animation frame or timeout
						Common.requestAnimationFrameOrTimeout(function() {
						
							// Show button
							button.removeClass("hide");
						});
					}
					
					// Otherwise
					else {
					
						// Set timeout
						setTimeout(function() {
						
							// Show button
							button.removeClass("hide");
						
						}, unitsToScroll * Unlocked.SCROLL_WALLET_INTO_VIEW_FADE_SCALAR);
					}
				}
				
				// Animate scrolling wallets display list to button
				walletsDisplayList.animate({
				
					// Scroll top
					"scrollTop": walletsDisplayList.scrollTop() + unitsToScroll
				
				}, scrollDuration);
			}
			
			// Otherwise
			else {
			
				// Set scroll duration
				var scrollDuration = 0;
			}
			
			// Return
			return [
			
				// Button
				button,
				
				// Scroll duration
				scrollDuration
			];
		}
		
		// Update currency display
		updateCurrencyDisplay() {
		
			// Set currency to the language's currency if specified or the currency display otherwise
			var currency = (this.currencyDisplay === Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE) ? Language.getConstant(Language.CURRENCY_CONSTANT) : this.currencyDisplay;
			
			// Get the price in the currency
			var price = this.prices.getPrice(currency);
			
			// Set self
			var self = this;
		
			// Go through all wallet display wallet buttons
			this.walletsDisplay.find("div.list").find("button").each(function() {
			
				// Get button
				var button = $(this);
				
				// Try
				try {
				
					// Get wallet
					var wallet = self.wallets.getWallet(parseInt(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "keyPath"), Common.DECIMAL_NUMBER_BASE));
				}
				
				// Catch errors
				catch(error) {
					
					// Return
					return;
				}
				
				// Check displayed amount type
				switch(self.displayedAmountType) {
				
					// Spendable
					case Unlocked.SPENDABLE_DISPLAYED_AMOUNT_TYPE:
					
						// Set amount to display to the wallet's unspent amount
						var amountToDisplay = wallet.getUnspentAmount();
					
						// Break
						break;
					
					// Confirmed
					case Unlocked.CONFIRMED_DISPLAYED_AMOUNT_TYPE:
					
						// Set amount to display to the wallet's unspent amount
						var amountToDisplay = wallet.getUnspentAmount();
						
						// Add wallet's pending amount to the amount to display
						amountToDisplay = amountToDisplay.plus(wallet.getPendingAmount());
					
						// Break
						break;
					
					// Confirmed and unconfirmed
					case Unlocked.CONFIRMED_AND_UNCONFIRMED_DISPLAYED_AMOUNT_TYPE:
					
						// Set amount to display to the wallet's unspent amount
						var amountToDisplay = wallet.getUnspentAmount();
						
						// Add wallet's pending amount to the amount to display
						amountToDisplay = amountToDisplay.plus(wallet.getPendingAmount());
						
						// Add wallet's unconfirmed amount to the amount to display
						amountToDisplay = amountToDisplay.plus(wallet.getUnconfirmedAmount());
					
						// Break
						break;
				}
				
				// Get amount to display in number's base
				amountToDisplay = amountToDisplay.dividedBy(Consensus.VALUE_NUMBER_BASE);
				
				// Check if wallet's unspent amount is at least the whale amount threshold
				if(wallet.getUnspentAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).isGreaterThanOrEqualTo(Unlocked.WHALE_AMOUNT_THRESHOLD) === true) {
				
					// Add whale overlay to button
					button.addClass("whale");
				}
				
				// Otherwise
				else {
				
					// Remove whale overlay from button
					button.removeClass("whale");
				}
				
				// Get button's totals
				var totals = button.find("span.totals");
				
				// Get total's amount
				var amount = totals.find("span.amount");
				
				// Get total's value
				var value = totals.find("span.value");
				
				// Check if price exsist
				if(price !== Prices.NO_PRICE_FOUND) {
				
					// Get value in currency
					var valueInCurrency = Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value: %1$c'), [[amountToDisplay.multipliedBy(price).toFixed(), currency]], "value");
					
					// Check if total's value doesn't exist
					if(value["length"] === 0)
					
						// Add value after total's amount
						amount.after(valueInCurrency);
					
					// Otherwise
					else
					
						// Update total's value
						value.replaceWith(valueInCurrency);
				}
				
				// Otherwise
				else
				
					// Remove total's value
					value.remove();
				
				// Update total's amount
				amount.replaceWith(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Amount: %1$c'), [[amountToDisplay.toFixed(), Consensus.CURRENCY_NAME]], "amount"));
			});
		}
		
		// Update wallets order buttons
		updateWalletsOrderButtons() {
		
			// Get wallets order display
			var walletsOrderDisplay = this.walletsDisplay.find("div.order");
		
			// Get selected wallet button
			var selectedWalletButton = this.walletsDisplay.find("div.list").find("button.clicked");
			
			// Check if selected wallet button doesn't exist
			if(selectedWalletButton["length"] === 0)
			
				// Set that wallets order display buttons are disabled
				walletsOrderDisplay.find("button").addClass("disabled");
			
			// Otherwise
			else {
			
				// Set that wallets order display buttons are enabled
				walletsOrderDisplay.find("button").removeClass("disabled");
			
				// Check if selected wallet is the first wallet in the list
				if(selectedWalletButton.is(":first-child") === true)
			
					// Set that wallets order up button is disabled
					walletsOrderDisplay.find("button.up").addClass("disabled");
				
				// Check if selected wallet is the last wallet in the list
				if(selectedWalletButton.is(":last-child") === true)
			
					// Set that wallets order down button is disabled
					walletsOrderDisplay.find("button.down").addClass("disabled");
			}
		}
		
		// Update menu display
		updateMenuDisplay() {
		
			// Get menu display about button
			var aboutButton = this.menuDisplay.find("button.about");
			
			// Reset about button right position
			aboutButton.css("right", "0");
			
			// Set about button to be left aligned
			aboutButton.css("right", aboutButton.offset()["left"] - aboutButton.parent().parent().offset()["left"] + "px");
		}
		
		// Update address display
		static updateAddressDisplay(addressDisplay) {
		
			// Get address display's address
			var address = addressDisplay.parent().attr(Common.DATA_ATTRIBUTE_PREFIX + "address");
			
			// Check if address exists
			if(address !== Common.NO_ATTRIBUTE) {
			
				// Set address display's text to a single character
				addressDisplay.text("M");
				
				// Get character length
				var characterLength = addressDisplay.width();
			
				// Set address display's text to be the address
				addressDisplay.text(address);
				
				// Get address display's maximum length
				var maximumLength = addressDisplay.width();
				
				// Let address display's contents overflow
				addressDisplay.addClass("overflow");
				
				// Check if address display's current length is greater than the maximum length
				if(addressDisplay.width() > maximumLength) {
				
					// Get maximum number of characters
					var maximumNumberOfCharacters = Math.floor(maximumLength / characterLength - "…"["length"]);
					
					// Check if maximum nuber of characters is event
					if(maximumNumberOfCharacters % 2 === 0) {
					
						// Get left and right side of the address to get the maximum number of characters
						var leftSide = address.substring(0, Math.floor(maximumNumberOfCharacters / 2));
						var rightSide = address.substring(address["length"] - Math.floor(maximumNumberOfCharacters / 2));
					}
					
					// Otherwise
					else {
					
						// Get left and right side of the address to get the maximum number of characters
						var leftSide = address.substring(0, Math.floor(maximumNumberOfCharacters / 2));
						var rightSide = address.substring(address["length"] - 1 - Math.floor(maximumNumberOfCharacters / 2));
					}
					
					// Set address display's text to be a combination of the left and ride sides
					addressDisplay.text(leftSide + "…" + rightSide);
				}
				
				// Don't let address display's contents overflow
				addressDisplay.removeClass("overflow");
			}
		}
		
		// Settings currency display name
		static get SETTINGS_CURRENCY_DISPLAY_NAME() {
		
			// Return settings currency display name
			return "Currency Display";
		}
		
		// Settings currency display language's currency value
		static get SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE() {
		
			// Return settings currency display language's currency value
			return "Language's Currency";
		}
		
		// Settings currency display default value
		static get SETTINGS_CURRENCY_DISPLAY_DEFAULT_VALUE() {
		
			// Return settings currency display default value
			return Unlocked.SETTINGS_CURRENCY_DISPLAY_LANGUAGES_CURRENCY_VALUE;
		}
		
		// Settings displayed address type name
		static get SETTINGS_DISPLAYED_ADDRESS_TYPE_NAME() {
		
			// Return settings displayed address type name
			return "Displayed Address Type";
		}
		
		// Settings displayed address type default value
		static get SETTINGS_DISPLAYED_ADDRESS_TYPE_DEFAULT_VALUE() {
		
			// Return settings displayed address type default value
			return Wallet.HTTP_ADDRESS_TYPE;
		}
		
		// Settings displayed amount type name
		static get SETTINGS_DISPLAYED_AMOUNT_TYPE_NAME() {
		
			// Return settings displayed amount type name
			return "Displayed Amount Type";
		}
		
		// Spendable displayed amount type
		static get SPENDABLE_DISPLAYED_AMOUNT_TYPE() {
		
			// Return spendable displayed amount type
			return "Spendable";
		}
		
		// Confirmed displayed amount type
		static get CONFIRMED_DISPLAYED_AMOUNT_TYPE() {
		
			// Return confirmed displayed amount type
			return "Confirmed";
		}
		
		// Confirmed and unconfirmed displayed amount type
		static get CONFIRMED_AND_UNCONFIRMED_DISPLAYED_AMOUNT_TYPE() {
		
			// Return confirmed and unconfirmed displayed amount type
			return "Confirmed And Unconfirmed";
		}
		
		// Settings displayed amount type default value
		static get SETTINGS_DISPLAYED_AMOUNT_TYPE_DEFAULT_VALUE() {
		
			// Return settings displayed amount type default value
			return Unlocked.CONFIRMED_AND_UNCONFIRMED_DISPLAYED_AMOUNT_TYPE;
		}
		
		// Settings wallets expanded name
		static get SETTINGS_WALLETS_EXPANDED_NAME() {
		
			// Return settings wallets expanded name
			return "Wallets Expanded";
		}
		
		// Settings wallets expanded default value
		static get SETTINGS_WALLETS_EXPANDED_DEFAULT_VALUE() {
		
			// Return settings wallets expanded default value
			return false;
		}
		
		// Settings wallets scroll position name
		static get SETTINGS_WALLETS_SCROLL_POSITION_NAME() {
		
			// Return settings wallets scroll position name
			return "Wallets Scroll Position";
		}
		
		// Settings wallets scroll position default value
		static get SETTINGS_WALLETS_SCROLL_POSITION_DEFAULT_VALUE() {
		
			// Return settings wallets scroll position default value
			return 0;
		}
		
		// Copy address to clipboard delay milliseconds
		static get COPY_ADDRESS_TO_CLIPBOARD_DELAY_MILLISECONDS() {
		
			// Return copy address to clipboard delay milliseconds
			return 175;
		}
		
		// Scroll wallet into view fade scalar
		static get SCROLL_WALLET_INTO_VIEW_FADE_SCALAR() {
		
			// Return scroll wallet into view fade scalar
			return 1.2;
		}
		
		// Scroll wallet into view speed scalar
		static get SCROLL_WALLET_INTO_VIEW_SPEED_SCALAR() {
		
			// Return scroll wallet into view speed scalar
			return 1.2;
		}
		
		// Large expand wallets button maximum body width
		static get LARGE_EXPAND_WALLETS_BUTTON_MAXIMUM_BODY_WIDTH() {
		
			// Return large expand wallets button maximum body width
			return 500;
		}
		
		// Add wallet button index
		static get ADD_WALLET_BUTTON_INDEX() {
		
			// Return add wallet button index
			return 0;
		}
		
		// Add wallet scroll duration index
		static get ADD_WALLET_SCROLL_DURATION_INDEX() {
		
			// Return add wallet scroll duration index
			return Unlocked.ADD_WALLET_BUTTON_INDEX + 1;
		}
		
		// Create wallet initial delay milliseconds
		static get CREATE_WALLET_INITIAL_DELAY_MILLISECONDS() {
		
			// Return create wallet initial delay milliseconds
			return 350;
		}
		
		// Create wallet expand delay milliseconds
		static get CREATE_WALLET_EXPAND_DELAY_MILLISECONDS() {
		
			// Return create wallet expand delay milliseconds
			return 350;
		}
		
		// Recover wallet initial delay milliseconds
		static get RECOVER_WALLET_INITIAL_DELAY_MILLISECONDS() {
		
			// Return recover wallet initial delay milliseconds
			return 500;
		}
		
		// Whale amount threshold
		static get WHALE_AMOUNT_THRESHOLD() {
		
			// Check wallet type
			switch(Consensus.getWalletType()) {
			
				// MWC or EPIC wallet
				case Consensus.MWC_WALLET_TYPE:
				case Consensus.EPIC_WALLET_TYPE:
		
					// Return whale amount threshold
					return 10000;
				
				// GRIN wallet
				case Consensus.GRIN_WALLET_TYPE:
		
					// Return whale amount threshold
					return Infinity;
			}
		}
		
		// Change order before delay milliseconds
		static get CHANGE_ORDER_BEFORE_DELAY_MILLISECONDS() {
		
			// Return change order before delay milliseconds
			return 200;
		}
		
		// Remove wallet button delay before milliseconds
		static get REMOVE_WALLET_BUTTON_DELAY_BEFORE_MILLISECONDS() {
		
			// Return remove wallet button delay before milliseconds
			return 200;
		}
		
		// Remove wallet button delay after milliseconds
		static get REMOVE_WALLET_BUTTON_DELAY_AFTER_MILLISECONDS() {
		
			// Return remove wallet button delay after milliseconds
			return 200;
		}
		
		// Remove wallet button delay ending milliseconds
		static get REMOVE_WALLET_BUTTON_DELAY_ENDING_MILLISECONDS() {
		
			// Return remove wallet button delay ending milliseconds
			return 200;
		}
		
		// Change order after delay milliseconds
		static get CHANGE_ORDER_AFTER_DELAY_MILLISECONDS() {
		
			// Return change order after delay milliseconds
			return 100;
		}
		
		// Wallet button height tolerance
		static get WALLET_BUTTON_HEIGHT_TOLERANCE() {
		
			// Return wallet button height tolerance
			return 1;
		}
		
		// Show address delay milliseconds
		static get SHOW_ADDRESS_DELAY_MILLISECONDS() {
		
			// Return show address delay milliseconds
			return 250;
		}
		
		// Show wallets after delay milliseconds
		static get SHOW_WALLETS_AFTER_DELAY_MILLISECONDS() {
		
			// Return show wallets after delay milliseconds
			return 200;
		}
		
		// Show hardware type delay milliseconds
		static get SHOW_HARDWARE_TYPE_DELAY_MILLISECONDS() {
		
			// Return show hardware type delay milliseconds
			return 100;
		}
}


// Main function

// Set global object's unlocked
globalThis["Unlocked"] = Unlocked;
