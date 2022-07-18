// Use strict
"use strict";


// Classes

// Send payment section class
class SendPaymentSection extends Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Delegate constructor
			super(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard);
			
			// Set wallet key path
			this.walletKeyPath = WalletSection.NO_WALLET_KEY_PATH;
			
			// Set amount last changed
			this.amountLastChanged = true;
			
			// Set allow changing base fee to setting's default vaue
			this.allowChangingBaseFee = SendPaymentSection.SETTINGS_ALLOW_CHANGING_BASE_FEE_DEFAULT_VALUE;
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Allow changing base fee setting
						self.getSettings().createValue(SendPaymentSection.SETTINGS_ALLOW_CHANGING_BASE_FEE_NAME, SendPaymentSection.SETTINGS_ALLOW_CHANGING_BASE_FEE_DEFAULT_VALUE)
					
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Allow changing base fee setting
							SendPaymentSection.SETTINGS_ALLOW_CHANGING_BASE_FEE_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.getSettings().getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set allow changing base fee to setting's value
							self.allowChangingBaseFee = settingValues[settings.indexOf(SendPaymentSection.SETTINGS_ALLOW_CHANGING_BASE_FEE_NAME)];
							
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
				
					// Allow changing base fee setting
					case SendPaymentSection.SETTINGS_ALLOW_CHANGING_BASE_FEE_NAME:
					
						// Set allow changing base fee to setting's value
						self.allowChangingBaseFee = setting[Settings.DATABASE_VALUE_NAME];
						
						// Break
						break;
				}
			});
			
			// Value display text on language change event
			self.getDisplay().find("input.value").parent().siblings("p").on(Language.CHANGE_EVENT, function() {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Update value currency
					self.updateValueCurrency();
					
					// Update value input
					self.updateValueInput();
				}
			});
			
			// Prices change event
			$(this.getPrices()).on(Prices.CHANGE_EVENT, function(event, prices) {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Update value currency
					self.updateValueCurrency();
					
					// Update value input
					self.updateValueInput();
				}
			});
			
			// Input input event
			this.getDisplay().find("input").on("input", function(event, isFocusEvent, forceInput) {
			
				// Get input
				var input = $(this);
				
				// Check if input has focus or forcing input
				if(input.is(":focus") === true || forceInput === true) {
				
					// Check if not focus event
					if(isFocusEvent !== true) {
					
						// Check if amount was changed
						if(input.hasClass("amount") === true) {
						
							// Set amount last changed
							self.amountLastChanged = true;
						}
						
						// Otherwise check if value was changed
						else if(input.hasClass("value") === true) {
					
							// Set amount last changed
							self.amountLastChanged = false;
						}
					}
				
					// Get input's display
					var display = input.closest("div").parent().closest("div");
					
					// Get input's value
					var value = input.val();
					
					// Check if value doesn't exist, input doesn't have focus, and forcing input
					if(value["length"] === 0 && input.is(":focus") === false && forceInput === true) {
					
						// Set that display doesn't show an error
						display.removeClass("error");
					}
					
					// Otherwise
					else {
					
						// Check type
						switch(display.find("div.value").attr(Common.DATA_ATTRIBUTE_PREFIX + "type")) {
						
							// Number
							case "number":
							
								// Check if value is in scientific notation
								if(value.indexOf("e") !== Common.INDEX_NOT_FOUND) {
								
									// Get value's parts
									var parts = value.split("e");
									
									// Get parts as a number
									var number = (new BigNumber(parts[0])).multipliedBy((new BigNumber(Common.DECIMAL_NUMBER_BASE)).exponentiatedBy((parts["length"] >= 2) ? parts[1] : 0));
									
									// Set input's value to the number
									input.val(number.toFixed());
									
									// Update value
									value = input.val();
								}
						
								// Check if value isn't a number
								if(Common.isNumberString(value) === false) {
								
									// Set that display shows an error
									display.addClass("error");
									
									// Check if not a focus event
									if(isFocusEvent !== true) {
									
										// Check if amount was changed
										if(input.hasClass("amount") === true) {
										
											// Clear value input and have it not show an error
											self.getDisplay().find("input.value").val("").closest("div").parent().closest("div").removeClass("error");
										}
										
										// Otherwise check if value was changed
										else if(input.hasClass("value") === true) {
										
											// Clear amount input and have it not show an error
											self.getDisplay().find("input.amount").val("").closest("div").parent().closest("div").removeClass("error");
										}
									}
									
									// Return
									return;
								}
								
								// Get value as a number
								value = new BigNumber(value);
								
								// Check if has a step and the input isn't for the value
								var step = input.attr("step");
								
								if(step !== Common.NO_ATTRIBUTE && input.hasClass("value") === false) {
								
									// Get step as a number
									var step = new BigNumber(step);
									
									// Check if value isn't evenly divisible by the step
									if(value.modulo(step).isInteger() === false) {
									
										// Set that display shows an error
										display.addClass("error");
										
										// Check if not a focus event
										if(isFocusEvent !== true) {
										
											// Check if amount was changed
											if(input.hasClass("amount") === true) {
											
												// Clear value input and have it not show an error
												self.getDisplay().find("input.value").val("").closest("div").parent().closest("div").removeClass("error");
											}
											
											// Otherwise check if value was changed
											else if(input.hasClass("value") === true) {
											
												// Clear amount input and have it not show an error
												self.getDisplay().find("input.amount").val("").closest("div").parent().closest("div").removeClass("error");
											}
										}
									
										// Return
										return;
									}
								}
								
								// Check if has a minimum value
								var minimumValue = input.attr("min");
								
								if(minimumValue !== Common.NO_ATTRIBUTE) {
								
									// Get minimum value as a number
									minimumValue = new BigNumber(minimumValue);
									
									// Check if value is less than the minimum value
									if(value.isLessThan(minimumValue) === true) {
									
										// Set that display shows an error
										display.addClass("error");
										
										// Check if not a focus event
										if(isFocusEvent !== true) {
										
											// Check if amount was changed
											if(input.hasClass("amount") === true) {
											
												// Clear value input and have it not show an error
												self.getDisplay().find("input.value").val("").closest("div").parent().closest("div").removeClass("error");
											}
											
											// Otherwise check if value was changed
											else if(input.hasClass("value") === true) {
											
												// Clear amount input and have it not show an error
												self.getDisplay().find("input.amount").val("").closest("div").parent().closest("div").removeClass("error");
											}
										}
									
										// Return
										return;
									}
								}
								
								// Check if has a maximum value
								var maximumValue = input.attr("max");
								
								if(maximumValue !== Common.NO_ATTRIBUTE) {
								
									// Get maximum value as a number
									maximumValue = new BigNumber(maximumValue);
									
									// Check if value is greater than the maximum value
									if(value.isGreaterThan(maximumValue) === true) {
									
										// Set that display shows an error
										display.addClass("error");
										
										// Check if not a focus event
										if(isFocusEvent !== true) {
										
											// Check if amount was changed
											if(input.hasClass("amount") === true) {
											
												// Clear value input and have it not show an error
												self.getDisplay().find("input.value").val("").closest("div").parent().closest("div").removeClass("error");
											}
											
											// Otherwise check if value was changed
											else if(input.hasClass("value") === true) {
											
												// Clear amount input and have it not show an error
												self.getDisplay().find("input.amount").val("").closest("div").parent().closest("div").removeClass("error");
											}
										}
									
										// Return
										return;
									}
								}
								
								// Break
								break;
							
							// URL
							case "url":
							
								// Check if value isn't a valid URL
								if(Common.isValidUrl(value) === false) {
								
									// Set that display shows an error
									display.addClass("error");
								
									// Return
									return;
								}
							
								// Break
								break;
						}
						
						// Set that display doesn't shows an error
						display.removeClass("error");
						
						// Check if not a focus event
						if(isFocusEvent !== true) {
						
							// Check if amount was changed
							if(input.hasClass("amount") === true) {
							
								// Get currency
								var currency = self.getUnlocked().getDisplayedCurrency();
								
								// Get price in the currency
								var price = self.getPrices().getPrice(currency);
								
								// Check if price exists
								if(price !== Prices.NO_PRICE_FOUND) {
								
									// Set value input's value to the value multipled by the price and have it not show an error
									self.getDisplay().find("input.value").val(value.multipliedBy(price).toFixed()).closest("div").parent().closest("div").removeClass("error");
								}
								
								// Otherwise
								else {
								
									// Clear value input and have it not show an error
									self.getDisplay().find("input.value").val("").closest("div").parent().closest("div").removeClass("error");
								}
							}
							
							// Otherwise check if value was changed
							else if(input.hasClass("value") === true) {
							
								// Get currency
								var currency = self.getUnlocked().getDisplayedCurrency();
								
								// Get price in the currency
								var price = self.getPrices().getPrice(currency);
								
								// Check if price exists
								if(price !== Prices.NO_PRICE_FOUND) {
								
									// Check if price is zero
									if(price.isZero() === true) {
									
										// Set amount input's value to zero and have it show an error
										self.getDisplay().find("input.amount").val("0").closest("div").parent().closest("div").addClass("error");
									}
									
									// Otherwise
									else {
									
										// Set amount input's value to the value divided by the price
										self.getDisplay().find("input.amount").val(Common.removeTrailingZeros(value.dividedBy(price).toFixed(Consensus.VALUE_NUMBER_BASE.toFixed()["length"] - 1, BigNumber.ROUND_UP)));
										
										// Check if amount input's value is zero
										if(self.getDisplay().find("input.amount").val() === "0") {
										
											// Have amount input show an error
											self.getDisplay().find("input.amount").closest("div").parent().closest("div").addClass("error");
										}
										
										// Otherwise
										else {
										
											// Have amount input not show an error
											self.getDisplay().find("input.amount").closest("div").parent().closest("div").removeClass("error");
										}
									}
								}
								
								// Otherwise
								else {
								
									// Clear amount input and have it not show an error
									self.getDisplay().find("input.amount").val("").closest("div").parent().closest("div").removeClass("error");
								}
							}
						}
					}
				}
			
			// Input key down event
			}).on("keydown", function(event) {
			
				// Check if enter was pressed
				if(event["which"] === "\r".charCodeAt(0)) {
				
					// Get input
					var input = $(this);
				
					// Get input's display
					var display = input.closest("div").parent().closest("div");
				
					// Check if display doesn't show an error
					if(display.hasClass("error") === false) {
					
						// Trigger click on send button
						self.getDisplay().find("button.send").trigger("click");
					}
				}
			
			// Input key press event
			}).on("keypress", function(event) {
			
				// Get input
				var input = $(this);
			
				// Get input's display
				var display = input.closest("div").parent().closest("div");
				
				// Check if type is a number
				if(display.find("div.value").attr(Common.DATA_ATTRIBUTE_PREFIX + "type") === "number") {
				
					// Check if key isn't a number or a period
					if((event["which"] < "0".charCodeAt(0) || event["which"] > "9".charCodeAt(0)) && event["which"] !== ".".charCodeAt(0)) {
					
						// Prevent default
						event.preventDefault();
					}
				}
			
			// Input blur event
			}).on("blur", function() {
			
				// Check if automatic lock isn't locking
				if(self.getAutomaticLock().isLocking() === false) {
			
					// Get input
					var input = $(this);
					
					// Get input's display
					var display = input.closest("div").parent().closest("div");
					
					// Check if value is empty
					if(input.val()["length"] === 0) {
					
						// Set that display doesn't shows an error
						display.removeClass("error");
					}
				}
			
			// Input focus event
			}).on("focus", function(event) {
			
				// Get input
				var input = $(this);
				
				// Get input's display
				var display = input.closest("div").parent().closest("div");
			
				// Check if display isn't disabled
				if(display.hasClass("disabled") === false) {
				
					// Trigger input event
					input.trigger("input", [
					
						// Is focus event
						true
					]);
				}
			});
			
			// Scan QR code button click event
			this.getDisplay().find("button.scan").on("click", function() {
			
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
				
				// Show scan error
				var showScanError = function(message) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Scan QR Code Error'), message, true, function() {
					
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
				
					// Prevent automatic lock
					self.getAutomaticLock().prevent();
				
					// Request access to camera
					navigator["mediaDevices"].getUserMedia({
					
						// Audio
						"audio": false,
						
						// Video
						"video": {
						
							// Facing mode
							"facingMode": "environment"
						}
					}).then(function(stream) {
					
						// Allow automatic lock
						self.getAutomaticLock().allow();
					
						// Check if automatic lock isn't locking
						if(self.getAutomaticLock().isLocking() === false) {
					
							// Initialize cancel occurred
							var cancelOccurred = false;
							
							// Show message and allow showing messages
							self.getMessage().show(Language.getDefaultTranslation('Scan QR Code'), Message.createCamera(), false, function() {
							
								// Hide loading
								self.getApplication().hideLoading();
								
								// Message before show not cancelable send section event
								$(self.getMessage()).one(Message.BEFORE_SHOW_NOT_CANCELABLE_EVENT + ".sendPaymentSection", function() {
								
									// Set that message has a camera
									self.getMessage().hasCamera();
								
									// Get camera
									var camera = self.getMessage().getCamera();
									
									// Set camera's source to the stream
									camera["srcObject"] = stream;
									
									// Play video
									var playVideo = camera.play();
									
									// Check if play video is a promise
									if(playVideo instanceof Promise === true) {
									
										// Catch errors
										playVideo.catch(function() {
										
											// Play video
											camera.play();
										});
									}
									
									// Message show send section event
									$(self.getMessage()).one(Message.SHOW_EVENT + ".sendPaymentSection", function() {
									
										// Prevent automatic lock
										self.getAutomaticLock().prevent();
									
										// Keep device awake and catch errors
										self.getWakeLock().preventLock().catch(function(error) {
										
										});
									
										// Decode QR code
										var decodeQrCode = function() {
										
											// Check if not canceled
											if(cancelOccurred === false) {
											
												// Get value from video's frame
												Camera.getValue(camera, camera["srcObject"].getVideoTracks()[0].getSettings()["width"], camera["srcObject"].getVideoTracks()[0].getSettings()["height"]).then(function(value) {
												
													// Check if not canceled
													if(cancelOccurred === false) {
												
														// Check if value exists
														if(value !== Camera.NO_VALUE && value["length"] !== 0) {
														
															// Set recipient address to the value
															self.getDisplay().find("input.recipientAddress").val(value).trigger("input", [
															
																// Is focus event
																false,
																
																// Force input
																true
															]);
														
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
														
															// Decode QR code
															decodeQrCode();
														}
													}
													
													// Otherwise
													else {
													
														// Allow device to sleep and catch errors
														self.getWakeLock().allowLock().catch(function(error) {
														
														// Finally
														}).finally(function() {
													
															// Enable automatic lock
															self.getAutomaticLock().allow();
														});
													}
												
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
												
															// Check if not canceled
															if(cancelOccurred === false) {
													
																// Show scan error
																showScanError(Message.createText(Language.getDefaultTranslation('An error occurred while trying to access your camera.')));
															}
														}
													});
												});
											}
											
											// Otherwise
											else {
											
												// Allow device to sleep and catch errors
												self.getWakeLock().allowLock().catch(function(error) {
												
												// Finally
												}).finally(function() {
											
													// Enable automatic lock
													self.getAutomaticLock().allow();
												});
											}
										};
										
										// Decode QR code
										decodeQrCode();
									});
								});
							
							}, Language.getDefaultTranslation('Cancel'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
							
								// Turn off message before show not cancelable send section event
								$(self.getMessage()).off(Message.BEFORE_SHOW_NOT_CANCELABLE_EVENT + ".sendPaymentSection");
								
								// Set cancel occurred
								cancelOccurred = true;
								
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
									self.getMessage().hide().then(function() {
									
										// Stop camera
										stream.getVideoTracks()[0].stop();
									});
								}
								
								// Otherwise
								else {
								
									// Stop camera
									stream.getVideoTracks()[0].stop();
								}
							});
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Request animation frame
						requestAnimationFrame(function() {
					
							// Allow automatic lock
							self.getAutomaticLock().allow();
						
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
						
								// Check if access to the camera was denied
								if(error["name"] === "NotAllowedError") {
								
									// Show scan error
									showScanError(Message.createText(Language.getDefaultTranslation('Access to your camera was denied.')));
								}
								
								// Otherwise check if no camera was found
								else if(error["name"] === "NotFoundError") {
								
									// Show scan error
									showScanError(Message.createText(Language.getDefaultTranslation('No camera was found. Connect a camera to use this feature.')));
								}
								
								// Otherwise check if browser doesn't allow using a camera
								else if(error["name"] === "NotSupportedError") {
								
									// Show scan error
									showScanError(Message.createText(Language.getDefaultTranslation('Your browser doesn\'t allow using a camera.')) + " " + Message.createText(Language.getDefaultTranslation('Update your browser to use this feature.')));
								}
								
								// Otherwise an error occurred while trying to access the camera
								else {
								
									// Show scan error
									showScanError(Message.createText(Language.getDefaultTranslation('An error occurred while trying to access your camera.')));
								}
							}
						});
					});
				}
				
				// Catch errors
				catch(error) {
				
					// Allow automatic lock
					self.getAutomaticLock().allow();
				
					// Check if automatic lock isn't locking
					if(self.getAutomaticLock().isLocking() === false) {
				
						// Show scan error
						showScanError(Message.createText(Language.getDefaultTranslation('Your browser doesn\'t allow using a camera.')) + " " + Message.createText(Language.getDefaultTranslation('Update your browser to use this feature.')));
					}
				}
			});
			
			// All button click event
			this.getDisplay().find("button.all").on("click", function() {
			
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
				
				// Show all error
				var showAllError = function(error) {
				
					// Show message and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('All Error'), Message.createText(error), false, function() {
					
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
				
				// Check if base fee can be changed and base fee doesn't exist
				if(self.allowChangingBaseFee === true && self.getDisplay().find("input.baseFee").val()["length"] === 0) {
				
					// Show all error
					showAllError(Language.getDefaultTranslation('Base fee is empty.'));
				}
				
				// Otherwise
				else {
				
					// Get base fee
					var baseFee = (self.allowChangingBaseFee === true) ? (new BigNumber(self.getDisplay().find("input.baseFee").val())).multipliedBy(Consensus.VALUE_NUMBER_BASE) : Api.DEFAULT_BASE_FEE;
					
					// Try
					try {
					
						// Get wallet with the wallet key path or the selected from wallet
						var wallet = self.getWallets().getWallet((self.walletKeyPath !== WalletSection.NO_WALLET_KEY_PATH) ? self.walletKeyPath : parseInt(self.getDisplay().find("select.fromWallet").children(":selected").val(), Common.DECIMAL_NUMBER_BASE));
					}
					
					// Catch errors
					catch(error) {
					
						// Show all error
						showAllError(error);
					
						// Return
						return;
					}
					
					// Prevent automatic lock
					self.getAutomaticLock().prevent();
					
					// Get fee for all amount with the base fee
					self.getWallets().getFee(wallet.getKeyPath(), Api.ALL_AMOUNT, baseFee).then(function(fee) {
					
						// Set timeout
						setTimeout(function() {
						
							// Enable automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
					
								// Get amount as the wallet's unspent amount without the fee
								var amount = wallet.getUnspentAmount().minus(fee[Api.FEE_FEE_INDEX]);
							
								// Set amount input's value to the amount
								self.getDisplay().find("input.amount").val(amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed()).trigger("input", [
																
									// Is focus event
									false,
									
									// Force input
									true
								]);
								
								// Hide loading
								self.getApplication().hideLoading();
								
								// Set that button isn't loading
								button.removeClass("loading");
							
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that button isn't clicked
								button.removeClass("clicked");
								
								// Delete focus
								self.getFocus().delete();
								
								// Allow showing messages
								self.getMessage().allow();
							}
						
						}, SendPaymentSection.ALL_RESULT_DELAY_MILLISECONDS);
						
					// Catch errors
					}).catch(function(error) {
					
						// Enable automatic lock
						self.getAutomaticLock().allow();
						
						// Check if automatic lock isn't locking
						if(self.getAutomaticLock().isLocking() === false) {
					
							// Show all error
							showAllError(error);
						}
					});
				}
			});
			
			// Default base fee button click event
			this.getDisplay().find("button.defaultBaseFee").on("click", function() {
			
				// Get button
				var button = $(this);
			
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
				
				// Prevent automatic lock
				self.getAutomaticLock().prevent();
				
				// Set timeout
				setTimeout(function() {
				
					// Enable automatic lock
					self.getAutomaticLock().allow();
					
					// Check if automatic lock isn't locking
					if(self.getAutomaticLock().isLocking() === false) {
			
						// Set base fee to the default base fee
						self.getDisplay().find("input.baseFee").val(Api.DEFAULT_BASE_FEE.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed()).trigger("input", [
																
							// Is focus event
							false,
							
							// Force input
							true
						]);
						
						// Hide loading
						self.getApplication().hideLoading();
						
						// Set that button isn't loading
						button.removeClass("loading");
					
						// Enable unlocked
						self.getUnlocked().enable();
						
						// Set that button isn't clicked
						button.removeClass("clicked");
						
						// Delete focus
						self.getFocus().delete();
						
						// Allow showing messages
						self.getMessage().allow();
					}
					
				}, SendPaymentSection.DEFAULT_BASE_FEE_DELAY_MILLISECONDS);
			});
			
			// Send button click event
			this.getDisplay().find("button.send").on("click", function() {
			
				// Get button
				var button = $(this);
			
				// Prevent showing messages
				self.getMessage().prevent();
				
				// Save focus, blur, and get focused element
				var focusedElement = self.getFocus().save(true);
				
				// Check if focused element is the button
				if(focusedElement !== Focus.NO_FOCUS && focusedElement.is(button) === true) {
				
					// Set that button is clicked
					button.addClass("clicked");
				}
				
				// Disable unlocked
				self.getUnlocked().disable();
				
				// Show loading
				self.getApplication().showLoading();
				
				// Set that button is loading
				button.addClass("loading");
			
				// Set recipient address
				var recipientAddress = self.getDisplay().find("input.recipientAddress").val();
				
				// Message
				var message = (self.getDisplay().find("input.message").val()["length"] !== 0) ? self.getDisplay().find("input.message").val() : SlateParticipant.NO_MESSAGE;
				
				// Show send error
				var showSendError = function(message) {
				
					// Show message immediately and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Send Error'), message, true, function() {
					
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
				
				// Check if recipient address doesn't exist
				if(recipientAddress["length"] === 0) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Recipient address is empty.')));
				}
				
				// Otherwise check if amount doesn't exist
				else if(self.getDisplay().find("input.amount").val()["length"] === 0) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Amount is empty.')));
				}
				
				// Otherwise check if base fee can be changed and base fee doesn't exist
				else if(self.allowChangingBaseFee === true && self.getDisplay().find("input.baseFee").val()["length"] === 0) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Base fee is empty.')));
				}
				
				// Otherwise
				else {
				
					// Set amount
					var amount = (new BigNumber(self.getDisplay().find("input.amount").val())).multipliedBy(Consensus.VALUE_NUMBER_BASE);
					
					// Base fee
					var baseFee = (self.allowChangingBaseFee === true) ? (new BigNumber(self.getDisplay().find("input.baseFee").val())).multipliedBy(Consensus.VALUE_NUMBER_BASE) : Api.DEFAULT_BASE_FEE;
			
					// Check wallet type
					switch(Consensus.getWalletType()) {
					
						// MWC wallet
						case Consensus.MWC_WALLET_TYPE:
				
							// Initialize error occurred
							var errorOccurred = false;
						
							// Try
							try {
							
								// Get receiver's Tor address from recipient address
								Tor.getTorAddressFromUrl(recipientAddress);
							}
							
							// Catch errors
							catch(error) {
							
								// Set error occurred
								errorOccurred = true;
							}
							
							// Check if an error didn't occur
							if(errorOccurred === false) {
							
								// Set receiver URL to the recipient address with a Tor protocol and top-level domain added if needed
								var receiverUrl = ((Common.urlContainsProtocol(recipientAddress) === false) ? Common.HTTP_PROTOCOL + "//" : "") + recipientAddress + ((Common.urlContainsProtocol(recipientAddress) === false && Common.urlContainsTopLevelDomain(recipientAddress) === false) ? Tor.URL_TOP_LEVEL_DOMAIN : "");
							}
							
							// Otherwise
							else {
							
								// Set receiver URL to recipient address
								var receiverUrl = recipientAddress;
							}
							
							// break
							break;
						
						// GRIN wallet
						case Consensus.GRIN_WALLET_TYPE:
						
							// Initialize error occurred
							var errorOccurred = false;
						
							// Try
							try {
							
								// Parse the recipient address as a Slatepack address
								var receiverPublicKey = Slatepack.slatepackAddressToPublicKey(recipientAddress);
							}
							
							// Catch errors
							catch(error) {
							
								// Set error occurred
								errorOccurred = true;
							}
							
							// Check if an error didn't occur
							if(errorOccurred === false) {
							
								// Set receiver URL to the receiver's public key as a Tor address with a Tor protocol and top-level domain added
								var receiverUrl = Common.HTTP_PROTOCOL + "//" + Tor.publicKeyToTorAddress(receiverPublicKey) + Tor.URL_TOP_LEVEL_DOMAIN;
							}
							
							// Otherwise
							else {
							
								// Set receiver URL to recipient address
								var receiverUrl = recipientAddress;
							}
						
							// Break
							break;
					}
					
					// Check if receiver URL doesn't have a protocol
					if(Common.urlContainsProtocol(receiverUrl) === false) {
					
						// Add protocol to receiver URL
						receiverUrl = Common.HTTP_PROTOCOL + "//" + receiverUrl;
					}
			
					// Try
					try {
					
						// Parse receiver URL
						var parsedUrl = new URL(Common.upgradeApplicableInsecureUrl(receiverUrl));
					}
					
					// Catch errors
					catch(error) {
					
						// Show send error
						showSendError(Message.createText(Language.getDefaultTranslation('Recipient address isn\'t supported.')));
						
						// Return
						return;
					}
					
					// Try
					try {
					
						// Get wallet with the wallet key path or the selected from wallet
						var wallet = self.getWallets().getWallet((self.walletKeyPath !== WalletSection.NO_WALLET_KEY_PATH) ? self.walletKeyPath : parseInt(self.getDisplay().find("select.fromWallet").children(":selected").val(), Common.DECIMAL_NUMBER_BASE));
					}
					
					// Catch errors
					catch(error) {
						
						// Show send error
						showSendError(Message.createText(error));
						
						// Return
						return;
					}
					
					// Check if wallet has an address suffix
					if(wallet.getAddressSuffix() !== Wallet.NO_ADDRESS_SUFFIX) {
					
						// Try
						try {
						
							// Parse wallet's address suffix as a URL
							var walletUrl = new URL(wallet.getAddressSuffix());
							
							// Check if sending to self
							if(parsedUrl["origin"] === walletUrl["origin"] && Common.removeTrailingSlashes(Common.removeDuplicateSlashes(parsedUrl["pathname"])) === walletUrl["pathname"]) {
							
								// Show send error
								showSendError(Message.createText(Language.getDefaultTranslation('A wallet can\'t send payments to itself.')));
								
								// Return
								return;
							}
						}
						
						// Catch errors
						catch(error) {
						
							// Check if sending to self
							if((parsedUrl["origin"] === HTTP_SERVER_ADDRESS || parsedUrl["origin"] === TOR_SERVER_ADDRESS) && Common.removeTrailingSlashes(Common.removeDuplicateSlashes(parsedUrl["pathname"])) === "/wallet/" + wallet.getAddressSuffix()) {
							
								// Show send error
								showSendError(Message.createText(Language.getDefaultTranslation('A wallet can\'t send payments to itself.')));
								
								// Return
								return;
							}
						}
					}
					
					// Check if wallet isn't synced
					if(wallet.isSynced() === false) {
					
						// Show send error
						showSendError(Message.createText(Language.getDefaultTranslation('The wallet isn\'t synced.')));
					}
				
					// Otherwise check if current height doesn't exist or the node isn't synced
					else if(self.getNode().getCurrentHeight().getHeight() === Node.UNKNOWN_HEIGHT || self.getNode().getCurrentHeight().getHeight().isEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true) {
					
						// Show send error
						showSendError(Message.createText(Language.getDefaultTranslation('The current height is unknown.')));
					}
					
					// Otherwise
					else {
					
						// Prevent automatic lock
						self.getAutomaticLock().prevent();
					
						// Get fee for the amount with the base fee
						self.getWallets().getFee(wallet.getKeyPath(), amount, baseFee).then(function(fee) {
						
							// Enable automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
						
								// Get fee
								fee = fee[Api.FEE_FEE_INDEX];
							
								// Show message and allow showing messages
								self.getMessage().show(Language.getDefaultTranslation('Confirm Payment Details'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('You\'ll be sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('You\'ll be sending %1$c from %2$y to the following address for a fee of %3$c.'), [
												
									[
									
										// Number
										amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
										
										// Currency
										Consensus.CURRENCY_NAME
									],
									
									// Wallet key path or name
									(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
									
									[
									
										// Number
										fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
										
										// Currency
										Consensus.CURRENCY_NAME
									]
								]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"message contextMenu\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + Message.createLineBreak() + Message.createLineBreak() + Message.createText(Language.getDefaultTranslation('Enter your password to continue sending the payment.')) + Message.createLineBreak() + Message.createLineBreak() + Message.createInput(Language.getDefaultTranslation('Password'), [], true) + Message.createLineBreak(), false, function() {
								
									// Hide loading
									self.getApplication().hideLoading();
								
								}, Language.getDefaultTranslation('Cancel'), Language.getDefaultTranslation('Continue'), true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Check if message was displayed
									if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
										// Check if continuing
										if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
										
											// Prevent showing messages
											self.getMessage().prevent();
										
											// Try
											try {
										
												// Get password
												var password = self.getMessage().getInputText();
											}
											
											// Catch errors
											catch(error) {
											
												// Show send error
												showSendError(Message.createText(Language.getDefaultTranslation('Incorrect password.')));
												
												// Return
												return;
											}
											
											// Disable message
											self.getMessage().disable();
											
											// Check if password is incorrect
											if(self.getWallets().isPassword(password) === false) {
											
												// TODO Securely clear password
											
												// Show send error
												showSendError(Message.createText(Language.getDefaultTranslation('Incorrect password.')));
											}
											
											// Otherwise
											else {
											
												// TODO Securely clear password
													
												// Initialize prevent cancel on hide
												var preventCancelOnHide = false;
												
												// Initialize canceled
												var canceled = false;
												
												// Set text
												var text = Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from %2$y to the following address for a fee of %3$c.'), [
												
													[
													
														// Number
														amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
														
														// Currency
														Consensus.CURRENCY_NAME
													],
													
													// Wallet key path or name
													(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
													
													[
													
														// Number
														fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
														
														// Currency
														Consensus.CURRENCY_NAME
													]
												]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"message contextMenu\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('This may take several minutes to complete. The recipient must be online and listening at that address to receive this payment.')) + "</b>";
												
												// Show message immediately and allow showing messages
												self.getMessage().show(Language.getDefaultTranslation('Sending Payment'), Message.createPendingResult() + Message.createLineBreak() + text, true, function() {
												
													// Hide loading
													self.getApplication().hideLoading();
												
													// Prevent automatic lock
													self.getAutomaticLock().prevent();
													
													// Keep device awake and catch errors
													self.getWakeLock().preventLock().catch(function(error) {
													
													});
													
													// Message show send section event
													$(self.getMessage()).one(Message.SHOW_EVENT + ".sendPaymentSection", function() {
													
														// Set timeout
														setTimeout(function() {
														
															// Send
															var send = function() {
															
																// Return promise
																return new Promise(function(resolve, reject) {
																
																	// Return obtaining wallet's exclusive transactions lock
																	return self.getTransactions().obtainWalletsExclusiveTransactionsLock(wallet.getKeyPath()).then(function() {
															
																		// Return getting fee
																		return self.getWallets().getFee(wallet.getKeyPath(), amount, baseFee, function() {
																			
																			// Return if canceled
																			return canceled === true;
																			
																		}, true).then(function(currentFee) {
																		
																			// Check if fee didn't change
																			if(currentFee[Api.FEE_FEE_INDEX].isEqualTo(fee) === true) {
																		
																				// Set prevent cancel on hide
																				preventCancelOnHide = true;
																				
																				// Initialize message shown
																				var messageShown = false;
																				
																				// Initialize last message type
																				var lastMessageType = SendPaymentSection.NO_LAST_MESSAGE_TYPE;
																				
																				// Initialize second button
																				var secondButton = Message.NO_BUTTON;
																				
																				// Message replace send section event
																				$(self.getMessage()).on(Message.REPLACE_EVENT + ".sendPaymentSection", function(event, messageType, messageData) {
																				
																					// Check if not canceled
																					if(canceled === false) {
																					
																						// Check if message type changed
																						if(lastMessageType !== messageType) {
																							
																							// Clear message shown
																							messageShown = false;
																							
																							// Check message type
																							switch(messageType) {
																							
																								// Application hardware wallet unlock message
																								case Application.HARDWARE_WALLET_UNLOCK_MESSAGE:
																								
																									// Break
																									break;
																							
																								// Application hardware wallet disconnect message
																								case Application.HARDWARE_WALLET_DISCONNECT_MESSAGE:
																								
																									// Set text
																									text = Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from %2$y to the following address for a fee of %3$c.'), [
																									
																										[
																										
																											// Number
																											amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME
																										],
																										
																										// Wallet key path or name
																										(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
																										
																										[
																										
																											// Number
																											fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME
																										]
																									]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"message contextMenu\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('This may take several minutes to complete. The recipient must be online and listening at that address to receive this payment.')) + "</b>";
																									
																									// Set second button
																									secondButton = Message.NO_BUTTON;
																													
																									// Cancel message replace
																									self.getMessage().cancelReplace();
																								
																									// Return
																									return;
																							
																								// API finalize transaction message
																								case Api.FINALIZE_TRANSACTION_MESSAGE:
																								
																									// Get address from the message data
																									var receiverAddress = messageData;
																									
																									// Check if receiver address doesn't exist
																									if(receiverAddress === Slate.NO_RECEIVER_ADDRESS) {
																									
																										// Check if wallet isn't a hardware wallet
																										if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
																										
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? (Message.createText(Language.getDefaultTranslation('Finalize the transaction for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) + " " + Message.createText(Language.getDefaultTranslation('This transaction doesn\'t contain a payment proof.'))) : (Message.createText(Language.getDefaultTranslation('Finalize the transaction for %1$y to continue sending the payment.'), [wallet.getName()]) + " " + Message.createText(Language.getDefaultTranslation('This transaction doesn\'t contain a payment proof.')))) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can\'t guarantee that this payment is going to the intended recipient since this transaction doesn\'t contain a payment proof.')) + "</b>";
																											
																											// Set second button
																											secondButton = Language.getDefaultTranslation('Finalize');
																										}
																										
																										// Otherwise
																										else {
																								
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Approve finalizing sending the transaction on the hardware wallet for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Approve finalizing sending the transaction on the hardware wallet for %1$y to continue sending the payment.'), [wallet.getName()])) + " " + Message.createText(Language.getDefaultTranslation('Verify that the amount displayed on the hardware wallet is %1$c, the fee displayed is %2$c, and that there\'s no payment proof address displayed.'), [
																											
																												[
																
																													// Number
																													amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME
																												],
																												
																												[
																												
																													// Number
																													fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME
																												]
																											]) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can\'t guarantee that this payment is going to the intended recipient since this transaction doesn\'t contain a payment proof.')) + "</b>";
																											
																											// Set second button
																											secondButton = Message.NO_BUTTON;
																										}
																									}
																									
																									// Otherwise
																									else {
																									
																										// Check if wallet isn't a hardware wallet
																										if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
																										
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? (Message.createText(Language.getDefaultTranslation('Finalize the transaction for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) + " " + Message.createText(Language.getDefaultTranslation('The recipient\'s payment proof address is the following payment proof address.'))) : (Message.createText(Language.getDefaultTranslation('Finalize the transaction for %1$y to continue sending the payment.'), [wallet.getName()]) + " " + Message.createText(Language.getDefaultTranslation('The recipient\'s payment proof address is the following payment proof address.')))) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"message contextMenu\">" + Common.htmlEncode(receiverAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can guarantee that this payment is going to the intended recipient by having the recipient confirm that this payment proof address is their payment proof address.')) + "</b>";
																											
																											// Set second button
																											secondButton = Language.getDefaultTranslation('Finalize');
																										}
																										
																										// Otherwise
																										else {
																									
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Approve finalizing sending the transaction on the hardware wallet for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Approve finalizing sending the transaction on the hardware wallet for %1$y to continue sending the payment.'), [wallet.getName()])) + " " + Message.createText(Language.getDefaultTranslation('Verify that the amount displayed on the hardware wallet is %1$c, the fee displayed is %2$c, and the proof address displayed matches the following payment proof address.'), [
																											
																												[
																
																													// Number
																													amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME
																												],
																												
																												[
																												
																													// Number
																													fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME
																												]
																												
																											]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"message contextMenu\">" + Common.htmlEncode(receiverAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can guarantee that this payment is going to the intended recipient by having the recipient confirm that this payment proof address is their payment proof address.')) + "</b>";
																											
																											// Set second button
																											secondButton = Message.NO_BUTTON;
																										}
																									}
																									
																									// Break
																									break;
																								
																								// Default
																								default:
																								
																									// Set text
																									text = Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from %2$y to the following address for a fee of %3$c.'), [
																									
																										[
																										
																											// Number
																											amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME
																										],
																										
																										// Wallet key path or name
																										(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
																										
																										[
																										
																											// Number
																											fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME
																										]
																									]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"message contextMenu\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('This may take several minutes to complete. The recipient must be online and listening at that address to receive this payment.')) + "</b>";
																									
																									// Set second button
																									secondButton = Message.NO_BUTTON;
																									
																									// Break
																									break;
																							}
																							
																							// Update last message type
																							lastMessageType = messageType;
																						}
																						
																						// Check if message isn't already shown
																						if(messageShown === false) {
																					
																							// Show message immediately and allow showing messages
																							self.getMessage().show(Language.getDefaultTranslation('Sending Payment'), Message.createPendingResult() + Message.createLineBreak() + text, true, function() {
																							
																								// Check if canceled
																								if(canceled === true) {
																								
																									// Return false
																									return false;
																								}
																								
																								// Otherwise
																								else {
																								
																									// Set message shown
																									messageShown = true;
																									
																									// Hide loading
																									self.getApplication().hideLoading();
																								}
																								
																							}, Language.getDefaultTranslation('Cancel'), secondButton, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
																							
																								// Clear message shown
																								messageShown = false;
												
																								// Check if canceling
																								if(messageResult === Message.FIRST_BUTTON_CLICKED_RESULT) {
																							
																									// Set canceled
																									canceled = true;
																									
																									// Turn off message replace send section event
																									$(self.getMessage()).off(Message.REPLACE_EVENT + ".sendPaymentSection");
																									
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
																											
																											// Restore focus and don't blur
																											self.getFocus().restore(false);
																										
																											// Hide message
																											self.getMessage().hide();
																										}
																									});
																								}
																								
																								// Otherwise check if finalizing
																								else if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
																								
																									// Show loading
																									self.getApplication().showLoading();
																								
																									// Set that message second button is loading
																									self.getMessage().setButtonLoading(Message.SECOND_BUTTON);
																								}
																							});
																						}
																					}
																				});
																			
																				// Return sending
																				return self.getWallets().send(wallet.getKeyPath(), recipientAddress, currentFee[Api.FEE_AMOUNT_INDEX], currentFee[Api.FEE_FEE_INDEX], currentFee[Api.FEE_BASE_FEE_INDEX], message, function() {
																			
																					// Return if canceled
																					return canceled === true;
																					
																				}, true).then(function() {
																				
																					// Turn off message replace send section event
																					$(self.getMessage()).off(Message.REPLACE_EVENT + ".sendPaymentSection");
																					
																					// Release wallet's exclusive transactions lock
																					self.getTransactions().releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																				
																					// Resolve
																					resolve();
																				
																				// Catch errors
																				}).catch(function(error) {
																				
																					// Turn off message replace send section event
																					$(self.getMessage()).off(Message.REPLACE_EVENT + ".sendPaymentSection");
																					
																					// Release wallet's exclusive transactions lock
																					self.getTransactions().releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																				
																					// Reject error
																					reject(error);
																				});
																			}
																			
																			// Otherwise
																			else {
																			
																				// Release wallet's exclusive transactions lock
																				self.getTransactions().releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																			
																				// Reject error
																				reject(Message.createText(Language.getDefaultTranslation('The fee changed.')));
																			}
																		
																		// Catch errors
																		}).catch(function(error) {
																		
																			// Release wallet's exclusive transactions lock
																			self.getTransactions().releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																			
																			// Check if canceled
																			if(error === Common.CANCELED_ERROR) {
																			
																				// Reject error
																				reject(error);
																			}
																			
																			// Otherwise
																			else {
																		
																				// Reject error
																				reject(Message.createText(error));
																			}
																		});
																	});
																});
															};
															
															// Send
															send().then(function() {
															
																// Set prevent cancel on hide
																preventCancelOnHide = true;
															
																// Disable message
																self.getMessage().disable();
															
																// Show success result and catch errors
																self.getMessage().showSuccessResult().catch(function(error) {
																
																// Finally
																}).finally(function() {
																
																	// Set timeout
																	setTimeout(function() {
																	
																		// Allow device to sleep and catch errors
																		self.getWakeLock().allowLock().catch(function(error) {
																		
																		// Finally
																		}).finally(function() {
																		
																			// Allow automatic lock
																			self.getAutomaticLock().allow();
																			
																			// Check if automatic lock isn't locking
																			if(self.getAutomaticLock().isLocking() === false) {
																			
																				// Check if current section is temporary
																				if(self.getSections().isCurrentSectionTemporary() === true) {
																				
																					// Delete focus
																					self.getFocus().delete();
																					
																					// Prevent showing messages
																					self.getMessage().prevent();
																					
																					// Hide message
																					self.getMessage().hide();
																				
																					// Show current section and catch errors
																					self.getSections().showCurrentSection(false).catch(function(error) {
																					
																					});
																				}
																				
																				// Otherwise
																				else {
																			
																					// Clear input values and have their displays not show errors
																					self.getDisplay().find("input").val("").closest("div").parent().closest("div").removeClass("error");
																					
																					// Set base fee to the default base fee
																					self.getDisplay().find("input.baseFee").val(Api.DEFAULT_BASE_FEE.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed()).trigger("input", [
																		
																						// Is focus event
																						false,
																						
																						// Force input
																						true
																					]);
																				
																					// Set that button isn't loading
																					button.removeClass("loading");
																		
																					// Enable unlocked
																					self.getUnlocked().enable();
																					
																					// Set that button isn't clicked
																					button.removeClass("clicked");
																					
																					// Delete focus
																					self.getFocus().delete();
																					
																					// Hide loading
																					self.getApplication().hideLoading();
																					
																					// Hide message
																					self.getMessage().hide();
																				}
																			}
																			
																			// Otherwise
																			else {
																			
																				// Clear input values and have their displays not show errors
																				self.getDisplay().find("input").val("").closest("div").parent().closest("div").removeClass("error");
																				
																				// Set base fee to the default base fee and have it not show an error
																				self.getDisplay().find("input.baseFee").val(Api.DEFAULT_BASE_FEE.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed()).closest("div").parent().closest("div").removeClass("error");
																			}
																		});
																		
																	}, SendPaymentSection.SEND_RESULT_DELAY_MILLISECONDS);
																});
																
															// Catch errors
															}).catch(function(error) {
															
																// Check if not canceled
																if(canceled === false) {
															
																	// Check if canceled
																	if(error === Common.CANCELED_ERROR) {
																		
																		// Set prevent cancel on hide
																		preventCancelOnHide = true;
																		
																		// Disable message
																		self.getMessage().disable();
																		
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
																				
																				// Restore focus and don't blur
																				self.getFocus().restore(false);
																				
																				// Hide loading
																				self.getApplication().hideLoading();
																			
																				// Hide message
																				self.getMessage().hide();
																			}
																		});
																	}
																
																	// Otherwise
																	else {
																	
																		// Set prevent cancel on hide
																		preventCancelOnHide = true;
																	
																		// Disable message
																		self.getMessage().disable();
																
																		// Show failure result and catch errors
																		self.getMessage().showFailureResult().catch(function(error) {
																		
																		// Finally
																		}).finally(function() {
																		
																			// Set timeout
																			setTimeout(function() {
																	
																				// Allow device to sleep and catch errors
																				self.getWakeLock().allowLock().catch(function(error) {
																				
																				// Finally
																				}).finally(function() {
																				
																					// Allow automatic lock
																					self.getAutomaticLock().allow();
																					
																					// Check if automatic lock isn't locking
																					if(self.getAutomaticLock().isLocking() === false) {
																				
																						// Show send error
																						showSendError(error);
																					}
																				});
																				
																			}, SendPaymentSection.SEND_RESULT_DELAY_MILLISECONDS);
																		});
																	}
																}
															});
														}, SendPaymentSection.START_SENDING_DELAY_MILLISECONDS);
													});
												}, Language.getDefaultTranslation('Cancel'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
												
													// Turn off message show send section event
													$(self.getMessage()).off(Message.SHOW_EVENT + ".sendPaymentSection");
												
													// Check if not preventing cancel on hide or message wasn't hidden
													if(preventCancelOnHide === false || messageResult !== Message.NOT_DISPLAYED_RESULT) {
												
														// Set canceled
														canceled = true;
														
														// Turn off message replace send section event
														$(self.getMessage()).off(Message.REPLACE_EVENT + ".sendPaymentSection");
														
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
																	
																	// Restore focus and don't blur
																	self.getFocus().restore(false);
																
																	// Hide message
																	self.getMessage().hide();
																}
															});
														}
														
														// Otherwise
														else {
														
															// Allow device to sleep and catch errors
															self.getWakeLock().allowLock().catch(function(error) {
															
															// Finally
															}).finally(function() {
															
																// Allow automatic lock
																self.getAutomaticLock().allow();
															});
														}
													}
												});
											}
										}
										
										// Otherwise
										else {
									
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
						
						// Catch errors
						}).catch(function(error) {
						
							// Enable automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
						
								// Show send error
								showSendError(Message.createText(error));
							}
						});
					}
				}
			});
			
			// Cancel button click event
			this.getDisplay().find("button.cancel").on("click", function() {
			
				// Show current section and catch errors
				self.getSections().showCurrentSection(false).catch(function(error) {
				
				});
			});
			
			// Document key down event
			$(document).on("keydown", function(event) {
			
				// Check if key tab is pressed
				if(event["which"] === "\t".charCodeAt(0)) {
				
					// Enable tabbing to all not disabled inputs
					self.getDisplay().find("div:not(.disabled)").find("input").enableTab();
					
					// Disable tabbing to all disabled inputs
					self.getDisplay().find("div.disabled").find("input").disableTab();
				}
			});
		}
		
		// Get name
		getName() {
		
			// Return name
			return SendPaymentSection.NAME;
		}
		
		// Reset
		reset() {
		
			// Reset
			super.reset();
			
			// Turn off section shown send payment section event
			$(this).off(Section.SHOWN_EVENT + ".sendPaymentSection");
			
			// Set that inputs aren't showing an error or hidden and clear their values
			this.getDisplay().find("div").removeClass("error hide").find("input").val("");
			
			// Set that buttons aren't clicked or loading
			this.getDisplay().find("button").removeClass("clicked loading");
			
			// Empty from wallet selection
			this.getDisplay().find("select.fromWallet").empty();
		}
		
		// Get state
		getState() {
		
			// Get state
			var state = super.getState();
			
			// Check if wallet key path exists
			if(this.walletKeyPath !== WalletSection.NO_WALLET_KEY_PATH) {
			
				// Set state's wallet key path
				state[SendPaymentSection.STATE_WALLET_KEY_PATH_NAME] = this.walletKeyPath;
			}
			
			// Set state's amount last changed
			state[SendPaymentSection.STATE_AMOUNT_LAST_CHANGED_NAME] = this.amountLastChanged;
			
			// Return state
			return state;
		}
		
		// Name
		static get NAME() {
		
			// Return name
			return "Send";
		}
		
		// State wallet key path name
		static get STATE_WALLET_KEY_PATH_NAME() {
		
			// Return state wallet key path name
			return WalletSection.STATE_WALLET_KEY_PATH_NAME;
		}
		
		// State amount last changed name
		static get STATE_AMOUNT_LAST_CHANGED_NAME() {
		
			// Return state amount last changed name
			return "Amount Last Changed";
		}
	
	// Private
		
		// Initialize
		initialize(state, firstShown) {
			
			// Set base class initialize
			var baseClassInitialize = super.initialize(state);
			
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return initializing base class
				return baseClassInitialize.then(function() {
				
					// Set wallet key path to value in state or no wallet key path if it doesn't exist
					self.walletKeyPath = (SendPaymentSection.STATE_WALLET_KEY_PATH_NAME in state === true) ? state[SendPaymentSection.STATE_WALLET_KEY_PATH_NAME] : WalletSection.NO_WALLET_KEY_PATH;
					
					// Set amount last changed to value in state or true if it doesn't exist
					self.amountLastChanged = (SendPaymentSection.STATE_AMOUNT_LAST_CHANGED_NAME in state === true) ? state[SendPaymentSection.STATE_AMOUNT_LAST_CHANGED_NAME] : true;
					
					// Check if there is no wallet key path
					if(self.walletKeyPath === WalletSection.NO_WALLET_KEY_PATH) {
					
						// Try
						try {
						
							// Get wallets in order
							var walletsInOrder = self.getWallets().getWalletsInOrder();
						}
						
						// Catch errors
						catch(error) {
						
							// Reject error
							reject(error);
							
							// Return
							return;
						}
						
						// Get from wallet selection display
						var fromWalletSelectionDisplay = self.getDisplay().find("select.fromWallet");
						
						// Go through all wallets in order
						for(var i = 0; i < walletsInOrder["length"]; ++i) {
						
							// Get wallet
							var wallet = walletsInOrder[i];
							
							// Create option for wallet
							var option = $(Language.createTranslatableContainer("<option>", (wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Wallet %1$s') : "%1$y", [
							
								// Wallet key path or name
								(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()
							]));
							
							// Set option's value and disable it
							option.attr("value", wallet.getKeyPath()).disable();
							
							// Append option to from wallet selection display
							fromWalletSelectionDisplay.append(option);
						}
						
						// Set from wallet selection display's value to the first option
						fromWalletSelectionDisplay.val(fromWalletSelectionDisplay.children("option").first().attr("value"));
					}
					
					// Set base fee to the default base fee
					self.getDisplay().find("input.baseFee").val(Api.DEFAULT_BASE_FEE.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed());
					
					// Check if not allowed to change base fee
					if(self.allowChangingBaseFee === false) {
					
						// Hide base fee input
						self.getDisplay().find("input.baseFee").closest("div").parent().closest("div").addClass("hide");
						
						// Hide default base fee button
						self.getDisplay().find("button.defaultBaseFee").closest("div").addClass("hide");
					}
					
					// Check wallet type
					switch(Consensus.getWalletType()) {
					
						// GRIN wallet
						case Consensus.GRIN_WALLET_TYPE:
						
							// Hide message input
							self.getDisplay().find("input.message").closest("div").parent().closest("div").addClass("hide");
						
							// Break
							break;
					}
					
					// Section shown send payment section event
					$(self).one(Section.SHOWN_EVENT + ".sendPaymentSection", function() {
					
						// Update value currency
						self.updateValueCurrency();
						
						// Trigger resize event
						$(window).trigger("resize");
					
						// Update value input
						self.updateValueInput();
						
						// Check if not first shown
						if(firstShown === false) {
							
							// Refresh prices
							self.getPrices().refresh();
						}
					});
				
					// Resolve
					resolve();
				
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
			return Language.getDefaultTranslation('Send Payment Error');
		}
		
		// Update value currency
		updateValueCurrency() {
		
			// Get currency
			var currency = this.getUnlocked().getDisplayedCurrency();
			
			// Get price in the currency
			var price = this.getPrices().getPrice(currency);
			
			// Check if price exists
			if(price !== Prices.NO_PRICE_FOUND) {
			
				// Check currency
				switch(currency) {
				
					// Bitcoin currency name
					case Prices.BITCOIN_CURRENCY_NAME:
					
						// Set step
						var step = Prices.BITCOIN_NUMBER_BASE.toFixed()["length"] - 1;
						
						// Break
						break;
					
					// Ethereum currency name
					case Prices.ETHEREUM_CURRENCY_NAME:
					
						// Set step
						var step = Prices.ETHEREUM_NUMBER_BASE.toFixed()["length"] - 1;
						
						// Break
						break;
				
					// Default
					default:
					
						// Set step
						var step = (new Intl.NumberFormat([], {
			
							// Style
							"style": "currency",
							
							// Currency
							"currency": currency
							
						})).resolvedOptions()["maximumFractionDigits"];
						
						// Break
						break;
				}
			
				// Set value input's step
				this.getDisplay().find("input.value").attr("step", (new BigNumber(10)).exponentiatedBy(-step).toFixed());
			
				// Set value display's text
				this.getDisplay().find("input.value").parent().siblings("p").find("span").replaceWith(Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Value in %1$y'), [currency]));
				
				// Check if vaue input is hidden
				if(this.getDisplay().find("input.value").closest("div").parent().closest("div").hasClass("hide") === true) {
				
					// Show value input
					this.getDisplay().find("input.value").closest("div").parent().closest("div").removeClass("hide");
					
					// Trigger resize event
					$(window).trigger("resize");
				}
			}
			
			// Otherwise
			else {
			
				// Hide value input
				this.getDisplay().find("input.value").blur().closest("div").parent().closest("div").addClass("hide");
			}
		}
		
		// Update value input
		updateValueInput() {
		
			// Get currency
			var currency = this.getUnlocked().getDisplayedCurrency();
			
			// Get price in the currency
			var price = this.getPrices().getPrice(currency);
			
			// Check if price exists
			if(price !== Prices.NO_PRICE_FOUND) {
			
				// Get amount input
				var amountInput = this.getDisplay().find("input.amount");
				
				// Get value input
				var valueInput = this.getDisplay().find("input.value");
				
				// Check if amount last changed
				if(this.amountLastChanged === true) {
				
					// Check if amount input is empty
					if(amountInput.val()["length"] === 0) {
					
						// Clear value input
						valueInput.val("");
					}
					
					// Otherwise
					else {
					
						// Set value input to the amount input value multipled by the price
						valueInput.val((new BigNumber(amountInput.val())).multipliedBy(price).toFixed());
					}
				}
				
				// Otherwise
				else {
				
					// Check if value input is empty
					if(valueInput.val()["length"] === 0) {
					
						// Clear amount input and have it not show an error
						amountInput.val("").closest("div").parent().closest("div").removeClass("error");
					}
					
					// Otherwise
					else {
					
						// Check if price is zero
						if(price.isZero() === true) {
						
							// Set amount input to zero and have it show an error
							amountInput.val("0").closest("div").parent().closest("div").addClass("error");
						}
						
						// Otherwise
						else {
						
							// Set amount input to the value input value divided by the price
							amountInput.val(Common.removeTrailingZeros((new BigNumber(valueInput.val())).dividedBy(price).toFixed(Consensus.VALUE_NUMBER_BASE.toFixed()["length"] - 1, BigNumber.ROUND_UP)));
							
							// Check if amount input is zero
							if(amountInput.val() === "0") {
							
								// Have amount input shows an error
								amountInput.closest("div").parent().closest("div").addClass("error");
							}
							
							// Otherwise
							else {
							
								// Have amount input not show an error
								amountInput.closest("div").parent().closest("div").removeClass("error");
							}
						}
					}
				}
			}
		}
		
		// Send result delay milliseconds
		static get SEND_RESULT_DELAY_MILLISECONDS() {
		
			// Return send result delay milliseconds
			return 350;
		}
		
		// Start sending delay milliseconds
		static get START_SENDING_DELAY_MILLISECONDS() {
		
			// Return start sending delay milliseconds
			return 500;
		}
		
		// No last message type
		static get NO_LAST_MESSAGE_TYPE() {
		
			// Return no last message type
			return null;
		}
		
		// All result delay milliseconds
		static get ALL_RESULT_DELAY_MILLISECONDS() {
		
			// Return all result delay milliseconds
			return 300;
		}
		
		// Default base fee delay milliseconds
		static get DEFAULT_BASE_FEE_DELAY_MILLISECONDS() {
		
			// Return default base fee delay milliseconds
			return 300;
		}
		
		// Settings allow changing base fee name
		static get SETTINGS_ALLOW_CHANGING_BASE_FEE_NAME() {
		
			// Return settings allow changing base fee name
			return "Allow Changing Base Fee";
		}
		
		// Settings allow changing base fee default value
		static get SETTINGS_ALLOW_CHANGING_BASE_FEE_DEFAULT_VALUE() {
		
			// Return settings allow changing base fee default value
			return false;
		}
}


// Main function

// Set global object's send payment section
globalThis["SendPaymentSection"] = SendPaymentSection;
