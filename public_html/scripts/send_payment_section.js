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
			
			// Set allow changing base fee to setting's default value
			this.allowChangingBaseFee = SendPaymentSection.SETTINGS_ALLOW_CHANGING_BASE_FEE_DEFAULT_VALUE;
			
			// Set step
			var step = Consensus.VALUE_NUMBER_BASE.toFixed()["length"] - 1;
			
			// Set amount input's and base fee's step and min to the step
			this.getDisplay().find("input.amount").attr("step", (new BigNumber(10)).exponentiatedBy(-step).toFixed()).attr("min", (new BigNumber(10)).exponentiatedBy(-step).toFixed());
			this.getDisplay().find("input.baseFee").attr("step", (new BigNumber(10)).exponentiatedBy(-step).toFixed()).attr("min", (new BigNumber(10)).exponentiatedBy(-step).toFixed());
			
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
									value = (new BigNumber(input.val())).toFixed();
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
									step = new BigNumber(step);
									
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
							
								// Check if recipient address wasn't changed, or value doesn't exist, or not sending as file
								if(input.hasClass("recipientAddress") === false || value["length"] !== 0 || self.getDisplay().find("button.sendAsFile").hasClass("enabled") === false) {
							
									// Check if value isn't a valid URL
									if(Common.isValidUrl(value) === false) {
									
										// Set that display shows an error
										display.addClass("error");
									
										// Return
										return;
									}
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
				
					// Check if key isn't a number, a period, or a comma
					if((event["which"] < "0".charCodeAt(0) || event["which"] > "9".charCodeAt(0)) && event["which"] !== ".".charCodeAt(0) && event["which"] !== ",".charCodeAt(0)) {
					
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
			
			// Recipient address input paste event
			this.getDisplay().find("input.recipientAddress").on("paste", function(event) {
			
				// Get input
				var input = $(this);
				
				// Check if input is empty or all of its contents are selected
				if(input.val()["length"] === 0 || (typeof getSelection !== "undefined" && input.val() === getSelection().toString())) {
				
					// Prevent default
					event.preventDefault();
					
					// Get clipboard data
					var value = event["originalEvent"]["clipboardData"].getData("text/plain");
					
					// Remove handled protocols from value
					value = ProtocolHandler.standardizeUrlProtocol(value);
					
					// Set recipient address to the value
					input.val(value).trigger("input", [
					
						// Is focus event
						false,
						
						// Force input
						true
					]);
					
					// Scroll to end of input
					input.scrollLeft(input.get(0)["scrollWidth"]);
					
					// Check if get selection is supported
					if(typeof getSelection !== "undefined") {
					
						// Check if selection exists
						if(getSelection()["rangeCount"] > 0) {
						
							// Collapse selection to end
							getSelection().collapseToEnd();
						}
					}
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
														
															// Initialize value processed
															var valueProcessed = false;
															
															// Check if value is JSON
															if(value[0] === "{") {
															
																// Initialize error occurred
																var errorOccurred = false;
																
																// Try
																try {
																
																	// Parse value as json
																	var parsedValue = JSON.parse(value);
																}
																
																// Catch errors
																catch(error) {
																
																	// Set error occurred
																	errorOccurred = true;
																}
																
																// Check if an error didn't occur
																if(errorOccurred === false) {
																
																	// Check if parsed value's recipient address isn't valid
																	if("Recipient Address" in parsedValue === false || typeof parsedValue["Recipient Address"] !== "string" || parsedValue["Recipient Address"]["length"] === 0) {
																	
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
																					showScanError(Message.createText(Language.getDefaultTranslation('That QR code is invalid.')));
																				}
																			}
																		});
																		
																		// Return
																		return;
																	}
																	
																	// Otherwise check if parsed value's amount isn't valid
																	else if("Amount" in parsedValue === true && (Common.isNumberString(parsedValue["Amount"]) === false || Common.getNumberStringPrecision(parsedValue["Amount"]) > Extension.MAXIMUM_AMOUNT_PRECISION || parseFloat(Common.removeTrailingZeros(parsedValue["Amount"])) < Extension.MINIMUM_AMOUNT)) {
																	
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
																					showScanError(Message.createText(Language.getDefaultTranslation('That QR code is invalid.')));
																				}
																			}
																		});
																		
																		// Return
																		return;
																	}
																	
																	// Otherwise check if parsed value's message isn't valid
																	else if("Message" in parsedValue === true && typeof parsedValue["Message"] !== "string") {
																	
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
																					showScanError(Message.createText(Language.getDefaultTranslation('That QR code is invalid.')));
																				}
																			}
																		});
																		
																		// Return
																		return;
																	}
																	
																	// Otherwise
																	else {
																	
																		// Set value to the recipient address
																		value = parsedValue["Recipient Address"];
																		
																		// Check if parsed value contains an amount
																		if("Amount" in parsedValue === true) {
																		
																			// Set amount input's value to the amount
																			self.getDisplay().find("input.amount").val((new BigNumber(parsedValue["Amount"])).toFixed()).trigger("input", [
																			
																				// Is focus event
																				false,
																				
																				// Force input
																				true
																			]);
																		}
																		
																		// Otherwise
																		else {
																		
																			// Set amount input's value to the nothing
																			self.getDisplay().find("input.amount").val("").trigger("input", [
																			
																				// Is focus event
																				false,
																				
																				// Force input
																				true
																			]);
																		}
																		
																		// Check if parsed value contains a message and message input isn't hidden
																		if("Message" in parsedValue === true && self.getDisplay().find("input.message").closest("div").parent().closest("div").hasClass("hide") === false) {
																		
																			// Set message input's value to the message
																			self.getDisplay().find("input.message").val(parsedValue["Message"]).trigger("input", [
																			
																				// Is focus event
																				false,
																				
																				// Force input
																				true
																			]);
																		}
																		
																		// Otherwise
																		else {
																		
																			// Set message input's value to nothing
																			self.getDisplay().find("input.message").val("").trigger("input", [
																			
																				// Is focus event
																				false,
																				
																				// Force input
																				true
																			]);
																		}
																	
																		// Set send as file button to off
																		self.getDisplay().find("button.sendAsFile").removeClass("enabled");
																		
																		// Set value processed to true
																		valueProcessed = true;
																	}
																}
															}
															
															// Check if value wasn't processed
															if(valueProcessed === false) {
															
																// Check wallet type
																switch(Consensus.getWalletType()) {
																
																	// EPIC wallet
																	case Consensus.EPIC_WALLET_TYPE:
																	
																		// Get value's components
																		var valueComponents = value.split("*");
																		
																		// Check if value has the expected number of components
																		if(valueComponents["length"] === 3) {
																		
																			// Check if value's recipient address component isn't valid
																			if(valueComponents[0]["length"] === 0) {
																			
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
																							showScanError(Message.createText(Language.getDefaultTranslation('That QR code is invalid.')));
																						}
																					}
																				});
																				
																				// Return
																				return;
																			}
																			
																			// Otherwise check if value's amount component isn't valid
																			else if(Common.isNumberString(valueComponents[2]) === false || Common.getNumberStringPrecision(valueComponents[2]) > Extension.MAXIMUM_AMOUNT_PRECISION || parseFloat(Common.removeTrailingZeros(valueComponents[2])) < Extension.MINIMUM_AMOUNT) {
																			
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
																							showScanError(Message.createText(Language.getDefaultTranslation('That QR code is invalid.')));
																						}
																					}
																				});
																				
																				// Return
																				return;
																			}
																			
																			// Otherwise check if value's message component isn't valid
																			else if(/^ID: .* [^ ]+: .+$/u.test(valueComponents[1]) !== true && /^.*#[^ ]+: .+$/u.test(valueComponents[1]) !== true) {
																			
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
																							showScanError(Message.createText(Language.getDefaultTranslation('That QR code is invalid.')));
																						}
																					}
																				});
																				
																				// Return
																				return;
																			}
																			
																			// Otherwise
																			else {
																			
																				// Set value to the recipient address
																				value = valueComponents[0];
																				
																				// Set amount input's value to the amount
																				self.getDisplay().find("input.amount").val((new BigNumber(valueComponents[2])).toFixed()).trigger("input", [
																				
																					// Is focus event
																					false,
																					
																					// Force input
																					true
																				]);
																				
																				// Set message input's value to the message
																				self.getDisplay().find("input.message").val(valueComponents[1].match((/^ID: .* [^ ]+: .+$/u.test(valueComponents[1]) === true) ? /^ID: (.*) [^ ]+: .+$/u : /^(.*)#[^ ]+: .+$/u)[1]).trigger("input", [
																				
																					// Is focus event
																					false,
																					
																					// Force input
																					true
																				]);
																				
																				// Set send as file button to off
																				self.getDisplay().find("button.sendAsFile").removeClass("enabled");
																				
																				// Set value processed to true
																				valueProcessed = true;
																			}
																		}
																		
																		// Break
																		break;
																}
															}
														
															// Check wallet type
															switch(Consensus.getWalletType()) {
															
																// EPIC wallet
																case Consensus.EPIC_WALLET_TYPE:
																
																	// Initialize error occurred
																	var errorOccurred = false;
																
																	// Try
																	try {
																	
																		// Parse values as a URL
																		var parsedUrl = new URL(value);
																	}
																	
																	// Catch errors
																	catch(error) {
																	
																		// Set error occurred
																		errorOccurred = true;
																	}
																	
																	// Check if an error didn't occur
																	if(errorOccurred === false) {
																	
																		// Check if parsed URL's protocol isn't needed
																		if(parsedUrl["protocol"] === "epic:") {
																		
																			// Remove protocol from value
																			value = Common.ltrim(value).substring("epic:"["length"]);
																		}
																	}
																	
																	// Break
																	break;
															}
															
															// Remove handled protocols from value
															value = ProtocolHandler.standardizeUrlProtocol(value);
														
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
									showScanError(Message.createText(Language.getDefaultTranslation('Your browser doesn\'t allow using a camera.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Update your browser to use this feature.')));
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
						showScanError(Message.createText(Language.getDefaultTranslation('Your browser doesn\'t allow using a camera.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Update your browser to use this feature.')));
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
			
			// Boolean buttons click event
			this.getDisplay().find("div[data-type=\"boolean\"]").find("button").on("click", function() {
			
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
				
				// Prevent automatic lock
				self.getAutomaticLock().prevent();
				
				// Check if button is enabled
				if(button.hasClass("enabled") === true)
				
					// Set that button isn't enabled
					button.removeClass("enabled");
				
				// Otherwise
				else
				
					// Set that button is enabled
					button.addClass("enabled");
				
				// Update state and catch errors
				self.updateState().catch(function(error) {
				
				});
				
				// Button transition end or timeout event
				button.transitionEndOrTimeout(function() {
				
					// Enable automatic lock
					self.getAutomaticLock().allow();
					
					// Check if automatic lock isn't locking
					if(self.getAutomaticLock().isLocking() === false) {
			
						// Enable unlocked
						self.getUnlocked().enable();
						
						// Set that button isn't clicked
						button.removeClass("clicked");
						
						// Restore focus and don't blur
						self.getFocus().restore(false);
						
						// Allow showing messages
						self.getMessage().allow();
					}
					
				}, "background");
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
				var recipientAddress = self.getDisplay().find("input.recipientAddress").val().trim();
				
				// Set message
				var message = (self.getDisplay().find("input.message").val()["length"] !== 0) ? self.getDisplay().find("input.message").val() : SlateParticipant.NO_MESSAGE;
				
				// Set send as file
				var sendAsFile = self.getDisplay().find("button.sendAsFile").hasClass("enabled") === true;
				
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
				
				// Check if not sending as file and recipient address doesn't exist
				if(sendAsFile === false && recipientAddress["length"] === 0) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Recipient address is empty.')));
				}
				
				// Otherwise check if recipient address shows an error
				else if(self.getDisplay().find("input.recipientAddress").closest("div").parent().closest("div").hasClass("error") === true) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Recipient address is invalid.')));
				}
				
				// Otherwise check if amount doesn't exist
				else if(self.getDisplay().find("input.amount").val()["length"] === 0) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Amount is empty.')));
				}
				
				// Otherwise check if amount shows an error
				else if(self.getDisplay().find("input.amount").closest("div").parent().closest("div").hasClass("error") === true) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Amount is invalid.')));
				}
				
				// Otherwise check if base fee can be changed and base fee doesn't exist
				else if(self.allowChangingBaseFee === true && self.getDisplay().find("input.baseFee").val()["length"] === 0) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Base fee is empty.')));
				}
				
				// Otherwise check if base fee can be changed and base fee shows an error
				else if(self.allowChangingBaseFee === true && self.getDisplay().find("input.baseFee").closest("div").parent().closest("div").hasClass("error") === true) {
				
					// Show send error
					showSendError(Message.createText(Language.getDefaultTranslation('Base fee is invalid.')));
				}
				
				// Otherwise
				else {
				
					// Set amount
					var amount = (new BigNumber(self.getDisplay().find("input.amount").val())).multipliedBy(Consensus.VALUE_NUMBER_BASE);
					
					// Base fee
					var baseFee = (self.allowChangingBaseFee === true) ? (new BigNumber(self.getDisplay().find("input.baseFee").val())).multipliedBy(Consensus.VALUE_NUMBER_BASE) : Api.DEFAULT_BASE_FEE;
					
					// Check wallet type
					switch(Consensus.getWalletType()) {
					
						// MWC or GRIN wallet
						case Consensus.MWC_WALLET_TYPE:
						case Consensus.GRIN_WALLET_TYPE:
						
							// Clear send as MQS
							var sendAsMqs = false;
						
							// Break
							break;
					
						// EPIC wallet
						case Consensus.EPIC_WALLET_TYPE:
						
							// Set send as MQS to if the URL is an MQS address with host
							var sendAsMqs = Mqs.isValidAddressWithHost(recipientAddress, Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) === true;
							
							// Break
							break;
					}
					
					// Check if not sending as file or as MQS
					if(sendAsFile === false && sendAsMqs === false) {
					
						// Check wallet type
						switch(Consensus.getWalletType()) {
						
							// MWC or EPIC wallet
							case Consensus.MWC_WALLET_TYPE:
							case Consensus.EPIC_WALLET_TYPE:
					
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
					
					// Check if not sending as file or as MQS
					if(sendAsFile === false && sendAsMqs === false) {
					
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
								if((parsedUrl["origin"] === HTTPS_SERVER_ADDRESS || parsedUrl["origin"] === TOR_SERVER_ADDRESS) && Common.removeTrailingSlashes(Common.removeDuplicateSlashes(parsedUrl["pathname"])) === "/wallet/" + wallet.getAddressSuffix()) {
								
									// Show send error
									showSendError(Message.createText(Language.getDefaultTranslation('A wallet can\'t send payments to itself.')));
									
									// Return
									return;
								}
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
								self.getMessage().show(Language.getDefaultTranslation('Confirm Payment Details'), Message.createText((wallet.getName() === Wallet.NO_NAME) ? ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('You\'ll be sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('You\'ll be sending %1$c from Wallet %2$s for a fee of %3$c.')) : ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('You\'ll be sending %1$c from %2$y to the following address for a fee of %3$c.') : Language.getDefaultTranslation('You\'ll be sending %1$c from %2$y for a fee of %3$c.')), [
												
									[
									
										// Number
										amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
										
										// Currency
										Consensus.CURRENCY_NAME,
						
										// Display value
										true
									],
									
									// Wallet key path or name
									(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
									
									[
									
										// Number
										fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
										
										// Currency
										Consensus.CURRENCY_NAME,
						
										// Display value
										true
									]
								]) + ((recipientAddress["length"] !== 0) ? Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('(?<=.) '))) + Message.createText(Language.getDefaultTranslation('Enter your password to continue sending the payment.')) + Message.createLineBreak() + Message.createLineBreak() + Message.createInput(Language.getDefaultTranslation('Password'), [], true) + Message.createLineBreak(), false, function() {
								
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
												var text = Message.createText((wallet.getName() === Wallet.NO_NAME) ? ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('Sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from Wallet %2$s for a fee of %3$c.')) : ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('Sending %1$c from %2$y to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from %2$y for a fee of %3$c.')), [
												
													[
													
														// Number
														amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
														
														// Currency
														Consensus.CURRENCY_NAME,
						
														// Display value
														true
													],
													
													// Wallet key path or name
													(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
													
													[
													
														// Number
														fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
														
														// Currency
														Consensus.CURRENCY_NAME,
						
														// Display value
														true
													]
												]) + ((recipientAddress["length"] !== 0) ? Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : "") + ((sendAsFile === false) ? Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('This may take several minutes to complete. The recipient must be online and listening at that address to receive this payment.')) + "</b>" : "");
												
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
																				
																				// Initialize URL
																				var url = SendPaymentSection.NO_URL;
																				
																				// Initialize sender address
																				var senderAddress = SendPaymentSection.NO_SENDER_ADDRESS;
																				
																				// Message replace send section event
																				$(self.getMessage()).on(Message.REPLACE_EVENT + ".sendPaymentSection", function(event, messageType, messageData) {
																				
																					// Check if not canceled
																					if(canceled === false) {
																					
																						// Initialize message is loading
																						var messageIsLoading = false;
																						
																						// Check if message type changed
																						if(lastMessageType !== messageType) {
																							
																							// Clear message shown
																							messageShown = false;
																							
																							// Check message type
																							switch(messageType) {
																							
																								// Application hardware wallet unlock message
																								case Application.HARDWARE_WALLET_UNLOCK_MESSAGE:
																								
																									// Check if second button isn't no button
																									if(secondButton !== Message.NO_BUTTON) {
																									
																										// Set message is loading
																										messageIsLoading = true;
																									}
																								
																									// Break
																									break;
																							
																								// Application hardware wallet disconnect message
																								case Application.HARDWARE_WALLET_DISCONNECT_MESSAGE:
																								
																									// Set text
																									text = Message.createText((wallet.getName() === Wallet.NO_NAME) ? ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('Sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from Wallet %2$s for a fee of %3$c.')) : ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('Sending %1$c from %2$y to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from %2$y for a fee of %3$c.')), [
																									
																										[
																										
																											// Number
																											amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME,
						
																											// Display value
																											true
																										],
																										
																										// Wallet key path or name
																										(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
																										
																										[
																										
																											// Number
																											fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME,
						
																											// Display value
																											true
																										]
																									]) + ((recipientAddress["length"] !== 0) ? Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : "") + ((senderAddress !== SendPaymentSection.NO_SENDER_ADDRESS) ? ((recipientAddress["length"] !== 0) ? Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('(?<=.) '))) + ((senderAddress !== Slate.NO_SENDER_ADDRESS) ? Message.createText(Language.getDefaultTranslation('The sender payment proof address you\'re using for the transaction is the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(senderAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('The transaction won\'t have a payment proof.'))) : "") + ((sendAsFile === false) ? Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('This may take several minutes to complete. The recipient must be online and listening at that address to receive this payment.')) + "</b>" : "");
																									
																									// Set second button
																									secondButton = Message.NO_BUTTON;
																													
																									// Cancel message replace
																									self.getMessage().cancelReplace();
																								
																									// Return
																									return;
																									
																								// API finalize transaction message
																								case Api.FINALIZE_TRANSACTION_MESSAGE:
																								
																									// Get address and kernel features from the message data
																									var receiverAddress = messageData[Api.FINALIZE_TRANSACTION_MESSAGE_RECEIVER_ADDRESS_INDEX];
																									var kernelFeatures = messageData[Api.FINALIZE_TRANSACTION_MESSAGE_KERNEL_FEATURES_INDEX];
																									
																									// Check if receiver address doesn't exist
																									if(receiverAddress === Slate.NO_RECEIVER_ADDRESS) {
																									
																										// Check if wallet isn't a hardware wallet
																										if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
																										
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Finalize the transaction for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Finalize the transaction for %1$y to continue sending the payment.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You\'re sending %1$c for a fee of %2$c, and the transaction doesn\'t have a payment proof.'), [
																											
																												[
																
																													// Number
																													amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												],
																												
																												[
																												
																													// Number
																													fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												]
																												
																											]) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can\'t guarantee that this payment is going to the intended recipient since the transaction doesn\'t have a payment proof.')) + "</b>";
																											
																											// Set second button
																											secondButton = Language.getDefaultTranslation('Finalize');
																										}
																										
																										// Otherwise
																										else {
																								
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Approve sending the transaction on the hardware wallet for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Approve sending the transaction on the hardware wallet for %1$y to continue sending the payment.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the account index displayed on the hardware wallet is %1$s, the amount displayed is %2$c, the fee displayed is %3$c, the kernel features displayed is %4$x, and that there\'s no recipient payment proof address displayed.'), [
																											
																												// Account index
																												HardwareWallet.ACCOUNT.toFixed(),
																												
																												[
																
																													// Number
																													amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												],
																												
																												[
																												
																													// Number
																													fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												],
																												
																												// Kernel features
																												kernelFeatures
																												
																											]) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can\'t guarantee that this payment is going to the intended recipient since the transaction doesn\'t have a payment proof.')) + "</b>";
																											
																											// Set second button
																											secondButton = Message.NO_BUTTON;
																										}
																									}
																									
																									// Otherwise
																									else {
																									
																										// Check if wallet isn't a hardware wallet
																										if(wallet.getHardwareType() === Wallet.NO_HARDWARE_TYPE) {
																										
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Finalize the transaction for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Finalize the transaction for %1$y to continue sending the payment.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You\'re sending %1$c for a fee of %2$c, and the transaction\'s recipient payment proof address is the following payment proof address.'), [
																											
																												[
																
																													// Number
																													amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												],
																												
																												[
																												
																													// Number
																													fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												]
																												
																											]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(receiverAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can guarantee that this payment is going to the intended recipient by having the recipient confirm that this payment proof address is their payment proof address.')) + "</b>";
																											
																											// Set second button
																											secondButton = Language.getDefaultTranslation('Finalize');
																										}
																										
																										// Otherwise
																										else {
																									
																											// Set text
																											text = ((wallet.getName() === Wallet.NO_NAME) ? Message.createText(Language.getDefaultTranslation('Approve sending the transaction on the hardware wallet for Wallet %1$s to continue sending the payment.'), [wallet.getKeyPath().toFixed()]) : Message.createText(Language.getDefaultTranslation('Approve sending the transaction on the hardware wallet for %1$y to continue sending the payment.'), [wallet.getName()])) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the account index displayed on the hardware wallet is %1$s, the amount displayed is %2$c, the fee displayed is %3$c, the kernel features displayed is %4$x, and the recipient payment proof address displayed matches the following payment proof address.'), [
																											
																												// Account index
																												HardwareWallet.ACCOUNT.toFixed(),
																												
																												[
																
																													// Number
																													amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												],
																												
																												[
																												
																													// Number
																													fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																													
																													// Currency
																													Consensus.CURRENCY_NAME,
						
																													// Display value
																													true
																												],
																												
																												// Kernel features
																												kernelFeatures
																												
																											]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(receiverAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can guarantee that this payment is going to the intended recipient by having the recipient confirm that this payment proof address is their payment proof address.')) + "</b>";
																											
																											// Set second button
																											secondButton = Message.NO_BUTTON;
																										}
																									}
																									
																									// Break
																									break;
																								
																								// API get transaction response message
																								case Api.GET_TRANSACTION_RESPONSE_MESSAGE:
																								
																									// Get file contents and name from the message data
																									var fileContents = messageData[Api.GET_TRANSACTION_RESPONSE_MESSAGE_FILE_CONTENTS_INDEX];
																									var fileName = messageData[Api.GET_TRANSACTION_RESPONSE_MESSAGE_FILE_NAME_INDEX];
																									
																									// Check if URL exists
																									if(url !== SendPaymentSection.NO_URL) {
																									
																										// Revoke URL
																										URL.revokeObjectURL(url);
																										
																										// Set URL to no URL
																										url = SendPaymentSection.NO_URL;
																									}
																									
																									// Create URL from file contents
																									url = URL.createObjectURL(new Blob([
																									
																										// Contents
																										fileContents
																									], {
																									
																										// Type
																										"type": "application/octet-stream"
																									}));
																									
																									// Set text
																									text = Message.createText(Language.getDefaultTranslation('Give the %1$m file to the payment\'s recipient and open their response file to continue sending the payment.'), [
																					
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
																									]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + ((senderAddress !== SendPaymentSection.NO_SENDER_ADDRESS && senderAddress !== Slate.NO_SENDER_ADDRESS) ? Message.createText(Language.getDefaultTranslation('The sender payment proof address you\'re using for the transaction is the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(senderAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('The transaction doesn\'t have a payment proof.')));
																									
																									// Set second button
																									secondButton = Language.getDefaultTranslation('Open Response File');
																									
																									// Break
																									break;
																								
																								// API sender address message
																								case Api.SENDER_ADDRESS_MESSAGE:
																								
																									// Check if sender address changed
																									if(messageData !== senderAddress) {
																									
																										// Set sender address
																										senderAddress = messageData;
																									}
																									
																									// Otherwise
																									else {
																									
																										// Cancel message replace
																										self.getMessage().cancelReplace();
																										
																										// Return
																										return;
																									}
																								
																								// Default
																								default:
																								
																									// Set text
																									text = Message.createText((wallet.getName() === Wallet.NO_NAME) ? ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('Sending %1$c from Wallet %2$s to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from Wallet %2$s for a fee of %3$c.')) : ((recipientAddress["length"] !== 0) ? Language.getDefaultTranslation('Sending %1$c from %2$y to the following address for a fee of %3$c.') : Language.getDefaultTranslation('Sending %1$c from %2$y for a fee of %3$c.')), [
																									
																										[
																										
																											// Number
																											amount.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME,
						
																											// Display value
																											true
																										],
																										
																										// Wallet key path or name
																										(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
																										
																										[
																										
																											// Number
																											fee.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
																											
																											// Currency
																											Consensus.CURRENCY_NAME,
						
																											// Display value
																											true
																										]
																									]) + ((recipientAddress["length"] !== 0) ? Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(recipientAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : "") + ((senderAddress !== SendPaymentSection.NO_SENDER_ADDRESS) ? ((recipientAddress["length"] !== 0) ? Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('(?<=.) '))) + ((senderAddress !== Slate.NO_SENDER_ADDRESS) ? Message.createText(Language.getDefaultTranslation('The sender payment proof address you\'re using for the transaction is the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(senderAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('The transaction won\'t have a payment proof.'))) : "") + ((sendAsFile === false) ? Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('This may take several minutes to complete. The recipient must be online and listening at that address to receive this payment.')) + "</b>" : "");
																									
																									// Set second button
																									secondButton = Message.NO_BUTTON;
																									
																									// Break
																									break;
																							}
																							
																							// Update last message type
																							lastMessageType = messageType;
																						}
																						
																						// Otherwise check if second button isn't no button
																						else if(secondButton !== Message.NO_BUTTON) {
																						
																							// Set message is loading
																							messageIsLoading = true;
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
																									
																									// Check if message isn't loading
																									if(messageIsLoading === false) {
																									
																										// Hide loading
																										self.getApplication().hideLoading();
																									}
																									
																									// Otherwise
																									else {
																									
																										// Clear message is loading
																										messageIsLoading = false;
																										
																										// Show loading
																										self.getApplication().showLoading();
																								
																										// Message before show not cancelable send payment section message replace event
																										$(self.getMessage()).one(Message.BEFORE_SHOW_NOT_CANCELABLE_EVENT + ".sendPaymentSectionMessageReplace", function() {
																										
																											// Add focus apperance to message second button
																											self.getMessage().messageDisplay.find("button").removeClass("focus").eq(1).addClass("focus");
																											
																											// Set that message second button is loading
																											self.getMessage().setButtonLoading(Message.SECOND_BUTTON);
																										
																										// Message show send payment section message replace event
																										}).one(Message.SHOW_EVENT + ".sendPaymentSectionMessageReplace", function() {
																										
																											// Blur message buttons
																											self.getMessage().messageDisplay.find("button").blur();
																											
																											// Disable message
																											self.getMessage().disable();
																										});
																									}
																								}
																								
																							}, Language.getDefaultTranslation('Cancel'), secondButton, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
																							
																								// Turn off message before show not cancelable send payment section message replace event
																								$(self.getMessage()).off(Message.BEFORE_SHOW_NOT_CANCELABLE_EVENT + ".sendPaymentSectionMessageReplace");
																								
																								// Turn off message show send payment section message replace event
																								$(self.getMessage()).off(Message.SHOW_EVENT + ".sendPaymentSectionMessageReplace");
																								
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
																				return self.getWallets().send(wallet.getKeyPath(), recipientAddress, currentFee[Api.FEE_AMOUNT_INDEX], currentFee[Api.FEE_FEE_INDEX], currentFee[Api.FEE_BASE_FEE_INDEX], message, sendAsFile, function() {
																			
																					// Return if canceled
																					return canceled === true;
																					
																				}, true).then(function() {
																				
																					// Turn off message replace send section event
																					$(self.getMessage()).off(Message.REPLACE_EVENT + ".sendPaymentSection");
																					
																					// Release wallet's exclusive transactions lock
																					self.getTransactions().releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																					
																					// Check if URL exists
																					if(url !== SendPaymentSection.NO_URL) {
																					
																						// Revoke URL
																						URL.revokeObjectURL(url);
																						
																						// Set URL to no URL
																						url = SendPaymentSection.NO_URL;
																					}
																				
																					// Resolve
																					resolve();
																				
																				// Catch errors
																				}).catch(function(error) {
																				
																					// Turn off message replace send section event
																					$(self.getMessage()).off(Message.REPLACE_EVENT + ".sendPaymentSection");
																					
																					// Release wallet's exclusive transactions lock
																					self.getTransactions().releaseWalletsExclusiveTransactionsLock(wallet.getKeyPath());
																					
																					// Check if URL exists
																					if(url !== SendPaymentSection.NO_URL) {
																					
																						// Revoke URL
																						URL.revokeObjectURL(url);
																						
																						// Set URL to no URL
																						url = SendPaymentSection.NO_URL;
																					}
																				
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
																					
																					// Set send as file button to its default value
																					self.getDisplay().find("button.sendAsFile").removeClass("enabled");
																					
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
																				
																				// Set send as file button to its default value
																				self.getDisplay().find("button.sendAsFile").removeClass("enabled");
																				
																				// Set base fee to the default base fee and have it not show an error
																				self.getDisplay().find("input.baseFee").val(Api.DEFAULT_BASE_FEE.dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed()).closest("div").parent().closest("div").removeClass("error");
																				
																				// Update state and catch errors
																				self.updateState().catch(function(error) {
																				
																				});
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
			var savedValues = [];
			$(document).on("keydown", function(event) {
			
				// Check if key tab is pressed
				if(event["which"] === "\t".charCodeAt(0)) {
				
					// Enable tabbing to all not disabled inputs
					self.getDisplay().find("div:not(.disabled)").find("input").enableTab();
					
					// Disable tabbing to all disabled inputs
					self.getDisplay().find("div.disabled").find("input").disableTab();
				}
			
			// Document language before change event
			}).on(Language.BEFORE_CHANGE_EVENT, function() {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Clear saved values
					savedValues = [];
				
					// Go through all of the display's number inputs
					self.getDisplay().find("input[type=\"number\"]").each(function() {
					
						// Get input
						var input = $(this);
					
						// Append input's value to list
						savedValues.push((input.val()["length"] !== 0) ? (new BigNumber(input.val())).toFixed() : "");
					});
				}
			});
			
			// HTML on language change event
			$("html").on(Language.CHANGE_EVENT, function(event) {
			
				// Check if target is HTML, is shown, and values are saved
				if($(event["target"]).is("html") === true && self.isShown() === true && savedValues["length"] !== 0) {
			
					// Go through all of the display's number inputs
					self.getDisplay().find("input[type=\"number\"]").each(function(index) {
					
						// Get input
						var input = $(this);
					
						// Restore input's value
						input.val(savedValues[index]);
					});
					
					// Clear saved values
					savedValues = [];
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
			
			// Set that buttons aren't clicked, loading, enabled, or transition instantly
			this.getDisplay().find("button").removeClass("clicked loading enabled noTransition");
			
			// Allow all button display to merge
			this.getDisplay().find("button.all").parent().closest("div").addClass("merge");
			
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
							option.attr("value", wallet.getKeyPath().toFixed()).disable();
							
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
						
							// Clear and hide message input
							self.getDisplay().find("input.message").val("").closest("div").parent().closest("div").addClass("hide");
						
							// Break
							break;
					}
					
					// Make boolean buttons transition instantly
					self.getDisplay().find("div[data-type=\"boolean\"]").find("button").addClass("noTransition");
					
					// Section shown send payment section event
					$(self).one(Section.SHOWN_EVENT + ".sendPaymentSection", function() {
					
						// Update value currency
						self.updateValueCurrency();
						
						// Trigger resize event
						$(window).trigger("resize");
						
						// Update value input
						self.updateValueInput();
						
						// Request animation frame
						requestAnimationFrame(function() {
					
							// Update value input
							self.updateValueInput();
						});
						
						// Check if not first shown
						if(firstShown === false) {
							
							// Refresh prices
							self.getPrices().refresh();
						}
						
						// Allow boolean buttons to transition
						self.getDisplay().find("div[data-type=\"boolean\"]").find("button").removeClass("noTransition");
						
						// Check wallet type
						switch(Consensus.getWalletType()) {
						
							// GRIN wallet
							case Consensus.GRIN_WALLET_TYPE:
							
								// Clear message input
								self.getDisplay().find("input.message").val("");
							
								// Break
								break;
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
				
				// Check if value input is hidden
				if(this.getDisplay().find("input.value").closest("div").parent().closest("div").hasClass("hide") === true) {
				
					// Show value input
					this.getDisplay().find("input.value").closest("div").parent().closest("div").removeClass("hide");
					
					// Allow all button display to merge
					this.getDisplay().find("button.all").parent().closest("div").addClass("merge");
					
					// Trigger resize event
					$(window).trigger("resize");
				}
			}
			
			// Otherwise
			else {
			
				// Hide value input
				this.getDisplay().find("input.value").blur().closest("div").parent().closest("div").addClass("hide");
				
				// Prevent all button display from merging
				this.getDisplay().find("button.all").parent().closest("div").removeClass("merge");
			}
		}
		
		// Update value input
		updateValueInput() {
		
			// Get currency
			var currency = this.getUnlocked().getDisplayedCurrency();
			
			// Get price in the currency
			var price = this.getPrices().getPrice(currency);
			
			// Get amount input
			var amountInput = this.getDisplay().find("input.amount");
			
			// Get value input
			var valueInput = this.getDisplay().find("input.value");
			
			// Check if price exists
			if(price !== Prices.NO_PRICE_FOUND) {
			
				// Check if amount last changed
				if(this.amountLastChanged === true) {
				
					// Check if amount input is empty or it show an error
					if(amountInput.val()["length"] === 0 || amountInput.closest("div").parent().closest("div").hasClass("error") === true) {
					
						// Clear value input and have it not show an error
						valueInput.val("").closest("div").parent().closest("div").removeClass("error");
					}
					
					// Otherwise
					else {
					
						// Set value input to the amount input value multipled by the price and have it not show an error
						valueInput.val((new BigNumber(amountInput.val())).multipliedBy(price).toFixed()).closest("div").parent().closest("div").removeClass("error");
					}
				}
				
				// Otherwise
				else {
				
					// Check if value input is empty or it show an error
					if(valueInput.val()["length"] === 0 || valueInput.closest("div").parent().closest("div").hasClass("error") === true) {
					
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
			
			// Otherwise
			else {
			
				// Check if amount last changed
				if(this.amountLastChanged === true) {
				
					// Clear value input and have it not show an error
					valueInput.val("").closest("div").parent().closest("div").removeClass("error");
				}
				
				// Otherwise
				else {
				
					// Clear amount input and have it not show an error
					amountInput.val("").closest("div").parent().closest("div").removeClass("error");
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
		
		// No URL
		static get NO_URL() {
		
			// Return no URL
			return null;
		}
		
		// No sender addresss
		static get NO_SENDER_ADDRESS() {
		
			// Return no sender address
			return undefined;
		}
}


// Main function

// Set global object's send payment section
globalThis["SendPaymentSection"] = SendPaymentSection;
