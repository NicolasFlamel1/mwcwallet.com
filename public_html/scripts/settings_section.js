// Use strict
"use strict";


// Classes

// Settings section class
class SettingsSection extends Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Delegate constructor
			super(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard);
			
			// Set self
			var self = this;
			
			// Settings change event
			$(this.getSettings()).on(Settings.CHANGE_EVENT, function(event, setting) {
			
				// Check if shown
				if(self.isShown() === true) {
				
					// Go through all settings
					self.getDisplay().find("div.setting").each(function() {
					
						// Set setting's display
						var settingDisplay = $(this);
						
						// Get setting's dependencies
						var settingDependencies = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "dependencies");
						
						// Check if setting's dependencies don't exist
						if(settingDependencies === Common.NO_ATTRIBUTE)
						
							// Set setting's dependencies to empty array
							settingDependencies = [];
						
						// Otherwise
						else
						
							// Set setting's dependencies to it's JSON value
							settingDependencies = JSON.parse(settingDependencies);
						
						// Initialize setting depends on changed setting
						var settingDependsOnChangedSetting = false;
						
						// Go through all setting's dependencies
						for(var i = 0; i < settingDependencies["length"]; ++i) {
						
							// Get dependency name
							var dependencyName = settingDependencies[i][SettingsSection.DEPENDENCY_NAME_INDEX];
							
							// Check if dependency is the change setting
							if(dependencyName === setting[Settings.DATABASE_SETTING_NAME]) {
							
								// Set setting depends on changed setting
								settingDependsOnChangedSetting = true;
								
								// Break
								break;
							}
						}
						
						// Check if setting depends on changed setting
						if(settingDependsOnChangedSetting === true) {
						
							// Get setting value for all setting's dependencies
							Promise.all(settingDependencies.map(function(dependency) {
							
								// Get dependency name
								var dependencyName = dependency[SettingsSection.DEPENDENCY_NAME_INDEX];
							
								// Return getting dependency value from settings
								return self.getSettings().getValue(dependencyName);
							
							})).then(function(dependencyValues) {
							
								// Set that setting isn't disabled
								settingDisplay.removeClass("disabled");
							
								// Go through all dependency values
								for(var i = 0; i < dependencyValues["length"]; ++i) {
								
									// Get dependency value
									var dependencyValue = dependencyValues[i];
									
									// Get dependency required value
									var dependencyRequiredValue = settingDependencies[i][SettingsSection.DEPENDENCY_VALUE_INDEX];
									
									// Check if dependency value is not the required value
									if(dependencyValue !== dependencyRequiredValue) {
									
										// Disable setting's display
										settingDisplay.addClass("disabled");
									
										// Break
										break;
									}
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Trigger a fatal error
								new FatalError(FatalError.DATABASE_ERROR);
							});
						}
					});
				}
			});
			
			// Document key down event
			$(document).on("keydown", function(event) {
			
				// Check if key tab is pressed
				if(event["which"] === "\t".charCodeAt(0)) {
				
					// Enable tabbing to all not disabled settings buttons, inputs, and selects
					self.getDisplay().find("div.setting:not(.disabled)").find("button, input, select").enableTab();
					
					// Disable tabbing to all disabled settings buttons, inputs, and selects
					self.getDisplay().find("div.setting.disabled").find("button, input, select").disableTab();
				}
			});
			
			// Setting focus event
			this.getDisplay().find("div.setting").find("button, input, select").on("focus", function() {
			
				// Get setting
				var setting = $(this);
				
				// Check if setting is disabled
				if(setting.closest("div.setting").hasClass("disabled") === true) {
				
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Blur setting
						setting.blur();
					});
				}
			});
			
			// Boolean setting button click event
			this.getDisplay().find("div.setting").find("div.value[" + Common.DATA_ATTRIBUTE_PREFIX + "type=\"boolean\"]").find("button").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Get button's setting display
				var settingDisplay = button.closest("div.setting");
				
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
				self.getAutomaticLock().prevent();
				
				// Get value
				var value = button.hasClass("enabled") === false;
				
				// Get button's setting
				var setting = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "setting");
				
				// Get setting's sensitive
				var sensitive = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "sensitive") !== Common.NO_ATTRIBUTE;
				
				// Save setting's value
				self.getSettings().setValue(setting, value, true, sensitive).then(function() {
				
					// Save setting's value
					settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "value", JSON.stringify(value));
				
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
							
							// Allow showing messages
							self.getMessage().allow();
						}
					}, "background");
				
				// Catch errors
				}).catch(function(error) {
				
					// Allow automatic lock
					self.getAutomaticLock().allow();
					
					// Check if automatic lock isn't locking
					if(self.getAutomaticLock().isLocking() === false) {
				
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('Settings Error'), Message.createText(error), false, function() {
						
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
			});
			
			// Setting input blur event
			this.getDisplay().find("div.setting").find("div.value").find("input").on("blur", function(event) {
			
				// Get input
				var input = $(this);
			
				// Set that input is private
				input.attr(Common.DATA_ATTRIBUTE_PREFIX + "private", "true");
			
				// Check if automatic lock isn't locking
				if(self.getAutomaticLock().isLocking() === false) {
			
					// Trigger input event
					input.trigger("input");
					
					// Get input's setting display
					var settingDisplay = input.closest("div.setting");
					
					// Get input setting's current value
					var currentValue = JSON.parse(settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "value"));
					
					// Check if input's setting isn't showing an error
					if(settingDisplay.hasClass("error") === false) {
					
						// Check setting's type
						switch(settingDisplay.find("div.value").attr(Common.DATA_ATTRIBUTE_PREFIX + "type")) {
						
							// Number
							case "number":
						
								// Get input's value as a number
								var value = parseInt(input.val(), Common.DECIMAL_NUMBER_BASE);
								
								// Check if current value is a string
								if(typeof currentValue === "string") {
								
									// Get current value as a number
									currentValue = parseInt(currentValue, Common.DECIMAL_NUMBER_BASE);
								}
								
								// Break
								break;
							
							// URL
							case "url":
							
								// Get input's value
								var value = input.val();
							
								// Break
								break;
							
							// Text
							case "text":
							
								// Get input's value
								var value = input.val();
							
								// Break
								break;
						}
						
						// Check if value changed
						if(value !== currentValue) {
						
							// Prevent showing messages
							self.getMessage().prevent();
							
							// Save focus and blur
							self.getFocus().save(true);
						
							// Disable unlocked
							self.getUnlocked().disable();
							
							// Show loading
							self.getApplication().showLoading();
							
							// Prevent automatic lock
							self.getAutomaticLock().prevent();
						
							// Get input's setting
							var setting = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "setting");
							
							// Get setting's sensitive
							var sensitive = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "sensitive") !== Common.NO_ATTRIBUTE;
					
							// Save setting's value
							self.getSettings().setValue(setting, value, true, sensitive).then(function() {
							
								// Save setting's value
								settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "value", JSON.stringify(value));
							
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
										
										// Delete focus
										self.getFocus().delete();
									
										// Allow showing messages
										self.getMessage().allow();
									}
								
								}, (typeof matchMedia === "function" && matchMedia("(any-hover: none)")["matches"] === true) ? 0 : SettingsSection.SAVE_SETTING_DELAY_MILLISECONDS);
							
							// Catch errors
							}).catch(function(error) {
							
								// Allow automatic lock
								self.getAutomaticLock().allow();
								
								// Check if automatic lock isn't locking
								if(self.getAutomaticLock().isLocking() === false) {
							
									// Show message and allow showing messages
									self.getMessage().show(Language.getDefaultTranslation('Settings Error'), Message.createText(error), false, function() {
									
										// Hide loading
										self.getApplication().hideLoading();
									
									}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
									
										// Check if message was displayed
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
											// Restore old value
											input.val((typeof currentValue === "number") ? currentValue.toFixed() : currentValue);
											
											// Check if old value is an empty string
											if(typeof currentValue === "string" && currentValue["length"] === 0)
											
												// Set that setting display doesn't shows an error
												settingDisplay.removeClass("error");
											
											// Otherwise
											else
											
												// Trigger input event
												input.trigger("input");
										
											// Enable unlocked
											self.getUnlocked().enable();
											
											// Restore focus and don't blur
											self.getFocus().restore(false);
											
											// Hide message
											self.getMessage().hide();
										}
									});
								}
							});
						}
						
						// Otherwise
						else {
						
							// Disable tab, disable, enable tab, and enable input
							input.disableTab().disable().enableTab().enable();
						
							// Allow showing messages
							self.getMessage().allow();
						}
					}
					
					// Otherwise
					else {
					
						// Disable tab, disable, enable tab, and enable input
						input.disableTab().disable().enableTab().enable();
						
						// Restore old value
						input.val((typeof currentValue === "number") ? currentValue.toFixed() : currentValue);
						
						// Check if old value is an empty string
						if(typeof currentValue === "string" && currentValue["length"] === 0)
						
							// Set that setting display doesn't shows an error
							settingDisplay.removeClass("error");
						
						// Otherwise
						else
						
							// Trigger input event
							input.trigger("input");
						
						// Allow showing messages
						self.getMessage().allow();
					}
				}
			
			// Setting input focus event
			}).on("focus", function(event) {
			
				// Get input
				var input = $(this);
				
				// Get input's setting display
				var settingDisplay = input.closest("div.setting");
			
				// Check if setting isn't disabled
				if(settingDisplay.hasClass("disabled") === false) {
				
					// Set that input isn't private
					input.removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "private");
				
					// Trigger input event
					input.trigger("input");
				
					// Prevent showing messages
					self.getMessage().prevent();
				}
			
			// Setting input key up event
			}).on("keyup", function(event) {
			
				// Check if enter was pressed
				if(event["which"] === "\r".charCodeAt(0)) {
				
					// Get input
					var input = $(this);
					
					// Get input's setting display
					var settingDisplay = input.closest("div.setting");
					
					// Check if setting display doens't show an error
					if(settingDisplay.hasClass("error") === false) {
				
						// Blur input
						input.blur();
					}
				}
			
			// Setting input input event
			}).on("input", function() {
			
				// Get input
				var input = $(this);
				
				// Get input's setting display
				var settingDisplay = input.closest("div.setting");
				
				// Get input's value
				var value = input.val();
				
				// Check setting's type
				switch(settingDisplay.find("div.value").attr(Common.DATA_ATTRIBUTE_PREFIX + "type")) {
				
					// Number
					case "number":
				
						// Check if value isn't a whole number
						if(Common.isNumberString(value) === false || (new BigNumber(value)).isInteger() === false) {
						
							// Set that setting display shows an error
							settingDisplay.addClass("error");
						
							// Return
							return;
						}
						
						// Check if value contains a leading zero
						if(value["length"] > "0"["length"] && value[0] === "0") {
						
							// Set that setting display shows an error
							settingDisplay.addClass("error");
						
							// Return
							return;
						}
						
						// Get value as a number
						value = parseInt(value, Common.DECIMAL_NUMBER_BASE);
						
						// Check if setting has a minimum value
						var minimumValue = input.attr("min");
						
						if(minimumValue !== Common.NO_ATTRIBUTE) {
						
							// Get minimum value as a number
							minimumValue = parseInt(minimumValue, Common.DECIMAL_NUMBER_BASE);
							
							// Check if value is less than the minimum value
							if(value < minimumValue) {
							
								// Set that setting display shows an error
								settingDisplay.addClass("error");
							
								// Return
								return;
							}
						}
						
						// Check if setting has a maximum value
						var maximumValue = input.attr("max");
						
						if(maximumValue !== Common.NO_ATTRIBUTE) {
						
							// Get maximum value as a number
							maximumValue = parseInt(maximumValue, Common.DECIMAL_NUMBER_BASE);
							
							// Check if value is greater than the maximum value
							if(value > maximumValue) {
							
								// Set that setting display shows an error
								settingDisplay.addClass("error");
							
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
						
							// Set that setting display shows an error
							settingDisplay.addClass("error");
						
							// Return
							return;
						}
					
						// Break
						break;
				}
				
				// Set that setting display doesn't shows an error
				settingDisplay.removeClass("error");
			
			// Input key down event
			}).on("keydown", function(event) {
			
				// Check if enter was pressed
				if(event["which"] === "\r".charCodeAt(0)) {
			
					// Get input
					var input = $(this);
					
					// Get input's setting display
					var settingDisplay = input.closest("div.setting");
					
					// Check if setting display shows an error
					if(settingDisplay.hasClass("error") === true) {
					
						// Prevent default
						event.preventDefault();
					}
				}
			
			// Setting input key press event
			}).on("keypress", function(event) {
			
				// Get input
				var input = $(this);
				
				// Check setting's type
				switch(input.closest("div.value").attr(Common.DATA_ATTRIBUTE_PREFIX + "type")) {
				
					// Number
					case "number":
			
						// Check if key isn't a number
						if(event["which"] < "0".charCodeAt(0) || event["which"] > "9".charCodeAt(0))
						
							// Prevent default
							event.preventDefault();
						
						// Break
						break;
				}
			});
			
			// Setting select input event
			this.getDisplay().find("div.setting").find("div.value").find("select").on("input", function() {
			
				// Check if automatic lock isn't locking
				if(self.getAutomaticLock().isLocking() === false) {
				
					// Get select
					var select = $(this);
					
					// Get select's setting display
					var settingDisplay = select.closest("div.setting");
					
					// Prevent showing messages
					self.getMessage().prevent();
					
					// Prevent scroll keys
					self.getScroll().preventKeys();
					
					// Save focus and blur
					self.getFocus().save(true);
					
					// Set that select is clicked
					select.addClass("clicked");
					
					// Disable unlocked
					self.getUnlocked().disable();
					
					// Show loading
					self.getApplication().showLoading();
					
					// Prevent automatic lock
					self.getAutomaticLock().prevent();
					
					// Get value
					var value = select.children(":selected").val();
					
					// Get select's setting
					var setting = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "setting");
					
					// Get setting's sensitive
					var sensitive = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "sensitive") !== Common.NO_ATTRIBUTE;
					
					// Save setting's value
					self.getSettings().setValue(setting, value, true, sensitive).then(function() {
					
						// Save setting's value
						settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "value", JSON.stringify(value));
					
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
								
								// Set that select isn't clicked
								select.removeClass("clicked");
								
								// Delete focus
								self.getFocus().delete();
								
								// Allow scroll keys
								self.getScroll().allowKeys();
								
								// Allow showing messages
								self.getMessage().allow();
							}
						
						}, (typeof matchMedia === "function" && matchMedia("(any-hover: none)")["matches"] === true) ? 0 : SettingsSection.CHANGE_SELECT_SETTING_DELAY_MILLISECONDS);
					
					// Catch errors
					}).catch(function(error) {
					
						// Allow automatic lock
						self.getAutomaticLock().allow();
						
						// Check if automatic lock isn't locking
						if(self.getAutomaticLock().isLocking() === false) {
					
							// Show message and allow showing messages
							self.getMessage().show(Language.getDefaultTranslation('Settings Error'), Message.createText(error), false, function() {
							
								// Hide loading
								self.getApplication().hideLoading();
								
								// Allow scroll keys
								self.getScroll().allowKeys();
							
							}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
							
								// Check if message was displayed
								if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
							
									// Restore old value
									select.val(JSON.parse(settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "value")));
								
									// Enable unlocked
									self.getUnlocked().enable();
									
									// Set that select isn't clicked
									select.removeClass("clicked");
									
									// Restore focus and don't blur
									self.getFocus().restore(false);
									
									// Hide message
									self.getMessage().hide();
								}
							});
						}
					});
				}
			});
			
			// Reset settings button click event
			this.getDisplay().find("button.resetSettings").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");
				
				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Reset Settings'), Message.createText(Language.getDefaultTranslation('Are you sure you want to reset the settings to their default values?')), false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if resetting settings
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
							
								// Delete settings
								self.getSettings().deleteValues().then(function() {
								
									// Initialize setting displays
									var settingDisplays = [];
									
									// Initialize settings names
									var settingsNames = [];
								
									// Go through all settings
									self.getDisplay().find("div.setting").each(function() {
									
										// Set setting's display
										var settingDisplay = $(this);
										
										// Append setting's display to list
										settingDisplays.push(settingDisplay);
										
										// Get setting's name
										var settingsName = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "setting");
										
										// Append setting's name to list
										settingsNames.push(settingsName);
									});
								
									// Get the default values for all settings
									Promise.all(settingsNames.map(function(settingsName) {
									
										// Return getting default value from settings
										return self.getSettings().getDefaultValue(settingsName);
									
									})).then(function(defaultValues) {
									
										// Initialize checking settings dependencies
										var checkingSettingsDependencies = [];
									
										// Go through all settings' default values
										for(var i = 0; i < defaultValues["length"]; ++i) {
										
											// Get default value
											var defaultValue = defaultValues[i];
										
											// Get setting's display
											let settingDisplay = settingDisplays[i];
											
											// Get setting's value display
											var settingsValueDisplay = settingDisplay.find("div.value");
											
											// Check setting's value display's type
											switch(settingsValueDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "type")) {
											
												// Boolean
												case "boolean":
												
													// Check if default value is true
													if(defaultValue === true) {
													
														// Set that setting's value display's button is enabled
														settingsValueDisplay.find("button").addClass("enabled");
													}
													
													// Otherwise
													else {
													
														// Set that setting's value display's button isn't enabled
														settingsValueDisplay.find("button").removeClass("enabled");
													}
													
													// Break
													break;
												
												// Number, text, and URL
												case "number":
												case "text":
												case "url":
												
													// Set that setting's value display's input to the default value
													settingsValueDisplay.find("input").val((typeof defaultValue === "number") ? defaultValue.toFixed() : defaultValue);
													
													// Break
													break;
												
												// Select
												case "select":
												
													// Set that setting's value display's select to the default value
													settingsValueDisplay.find("select").val(defaultValue);
												
													// Break
													break;
											}
											
											// Save setting's value
											settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "value", JSON.stringify(defaultValue));
											
											// Get setting's dependencies
											let settingDependencies = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "dependencies");
											
											// Check if setting's dependencies don't exist
											if(settingDependencies === Common.NO_ATTRIBUTE)
											
												// Set setting's dependencies to empty array
												settingDependencies = [];
											
											// Otherwise
											else
											
												// Set setting's dependencies to it's JSON value
												settingDependencies = JSON.parse(settingDependencies);
											
											// Append checking setting dependencies to list
											checkingSettingsDependencies.push(new Promise(function(resolve, reject) {
											
												// Return getting the values for setting's dependencies
												return Promise.all(settingDependencies.map(function(dependency) {
												
													// Get dependency name
													var dependencyName = dependency[SettingsSection.DEPENDENCY_NAME_INDEX];
												
													// Return getting dependency default value from settings
													return self.getSettings().getDefaultValue(dependencyName);
												
												})).then(function(dependencyDefaultValues) {
												
													// Set that setting isn't disabled or shows an error
													settingDisplay.removeClass("disabled error");
												
													// Go through all dependency default values
													for(var j = 0; j < dependencyDefaultValues["length"]; ++j) {
													
														// Get dependency default value
														var dependencyDefaultValue = dependencyDefaultValues[j];
														
														// Get dependency required value
														var dependencyRequiredValue = settingDependencies[j][SettingsSection.DEPENDENCY_VALUE_INDEX];
														
														// Check if dependency default value is not the required value
														if(dependencyDefaultValue !== dependencyRequiredValue) {
														
															// Disable setting's display
															settingDisplay.addClass("disabled");
														
															// Break
															break;
														}
													}
												
													// Resolve
													resolve();
												
												// Catch errors
												}).catch(function(error) {
												
													// Reject error
													reject(error);
												});
											}));
										}
										
										// Wait until all settings' dependencies are checked
										Promise.all(checkingSettingsDependencies).then(function() {
										
											// Update state and catch errors
											self.updateState().catch(function(error) {
											
											});
										
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
												
											}, SettingsSection.RESET_SETTINGS_AFTER_DELAY_MILLISECONDS);
										
										// Catch errors
										}).catch(function(error) {
										
											// Trigger a fatal error
											new FatalError(FatalError.DATABASE_ERROR);
										});
									
									// Catch errors
									}).catch(function(error) {
									
										// Trigger a fatal error
										new FatalError(FatalError.DATABASE_ERROR);
									});
								
								// Catch errors
								}).catch(function(error) {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
								
										// Show message and allow showing messages
										self.getMessage().show(Language.getDefaultTranslation('Reset Settings Error'), Message.createText(error), true, function() {
										
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
							}, SettingsSection.RESET_SETTINGS_BEFORE_DELAY_MILLISECONDS);
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
			
			// Wallet type select input event
			this.getDisplay().find("select.walletType").on("input", function() {
			
				// Check if automatic lock isn't locking
				if(self.getAutomaticLock().isLocking() === false) {
				
					// Get select
					var select = $(this);
					
					// Set that select is clicked
					select.addClass("clicked");
				
					// Get wallet type
					var walletType = parseInt(select.children(":selected").val(), Common.DECIMAL_NUMBER_BASE);
					
					// Check if is an extension
					if(Common.isExtension() === true) {
					
						// Set message
						var message = Language.getDefaultTranslation('This extension must reload for the new wallet type to be applied. Would you like to reload now?');
					}
					
					// Otherwise check if is an app
					else if(Common.isApp() === true) {
					
						// Set message
						var message = Language.getDefaultTranslation('This app must reload for the new wallet type to be applied. Would you like to reload now?');
					}
					
					// Otherwise
					else {
					
						// Set message
						var message = Language.getDefaultTranslation('This site must reload for the new wallet type to be applied. Would you like to reload now?');
					}
					
					// Show message
					self.getMessage().show(Language.getDefaultTranslation('Reload Required'), Message.createText(message), false, function() {
					
						// Save focus and blur
						self.getFocus().save(true);
						
						// Disable unlocked
						self.getUnlocked().disable();
					
					}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Check if reloading
							if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
							
								// Prevent showing messages
								self.getMessage().prevent();
							
								// Show loading
								self.getApplication().showLoading();
							
								// Set that message second button is loading
								self.getMessage().setButtonLoading(Message.SECOND_BUTTON);
								
								// Prevent automatic lock
								self.getAutomaticLock().prevent();
								
								// Prevent extension from interrupting on close
								Extension.preventInterruptOnClose();
							
								// Refresh page to have new wallet type
								location.replace(location.toString() + Common.URL_QUERY_STRING_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_WALLET_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.walletTypeToText(walletType)).replace(/%20/ug, "+") + Common.getPreservedUrlParameters());
							}
							
							// Otherwise
							else {
							
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that select isn't clicked
								select.removeClass("clicked");
								
								// Set wallet type select value
								select.val(Consensus.getWalletType()).children("option").enable().filter(":selected").disable();
								
								// Restore focus and don't blur
								self.getFocus().restore(false);
								
								// Hide message
								self.getMessage().hide();
							}
						}
					});
				}
			});
			
			// Network type select input event
			this.getDisplay().find("select.networkType").on("input", function() {
			
				// Check if automatic lock isn't locking
				if(self.getAutomaticLock().isLocking() === false) {
				
					// Get select
					var select = $(this);
					
					// Set that select is clicked
					select.addClass("clicked");
				
					// Get network type
					var networkType = parseInt(select.children(":selected").val(), Common.DECIMAL_NUMBER_BASE);
					
					// Check if is an extension
					if(Common.isExtension() === true) {
					
						// Set message
						var message = Language.getDefaultTranslation('This extension must reload for the new network type to be applied. Would you like to reload now?');
					}
					
					// Otherwise check if is an app
					else if(Common.isApp() === true) {
					
						// Set message
						var message = Language.getDefaultTranslation('This app must reload for the new network type to be applied. Would you like to reload now?');
					}
					
					// Otherwise
					else {
					
						// Set message
						var message = Language.getDefaultTranslation('This site must reload for the new network type to be applied. Would you like to reload now?');
					}
					
					// Show message
					self.getMessage().show(Language.getDefaultTranslation('Reload Required'), Message.createText(message), false, function() {
					
						// Save focus and blur
						self.getFocus().save(true);
						
						// Disable unlocked
						self.getUnlocked().disable();
					
					}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Check if reloading
							if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
							
								// Prevent showing messages
								self.getMessage().prevent();
							
								// Show loading
								self.getApplication().showLoading();
							
								// Set that message second button is loading
								self.getMessage().setButtonLoading(Message.SECOND_BUTTON);
								
								// Prevent automatic lock
								self.getAutomaticLock().prevent();
								
								// Prevent extension from interrupting on close
								Extension.preventInterruptOnClose();
							
								// Refresh page to have new network type
								location.replace(location.toString() + Common.URL_QUERY_STRING_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_NETWORK_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.networkTypeToText(networkType)).replace(/%20/ug, "+") + Common.getPreservedUrlParameters());
							}
							
							// Otherwise
							else {
							
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that select isn't clicked
								select.removeClass("clicked");
								
								// Set network type select value
								select.val(Consensus.getNetworkType()).children("option").enable().filter(":selected").disable();
								
								// Restore focus and don't blur
								self.getFocus().restore(false);
								
								// Hide message
								self.getMessage().hide();
							}
						}
					});
				}
			});
		}
		
		// Get name
		getName() {
		
			// Return name
			return SettingsSection.NAME;
		}
		
		// Reset
		reset() {
		
			// Reset
			super.reset();
			
			// Set that settings aren't disabled or show an error and remove their values
			this.getDisplay().find("div.setting").removeClass("disabled error").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "value");

			// Set that setting buttons aren't enabled, clicked, or transition instantly
			this.getDisplay().find("div.setting").find("div.value").find("button").removeClass("enabled clicked noTransition");

			// Set that setting select isn't clicked
			this.getDisplay().find("div.setting").find("div.value").find("select").removeClass("clicked");
		}
		
		// Name
		static get NAME() {
		
			// Return name
			return "Settings";
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
			
					// Initialize setting displays
					var settingDisplays = [];
					
					// Initialize settings names
					var settingsNames = [];
				
					// Go through all settings
					self.getDisplay().find("div.setting").each(function() {
					
						// Set setting's display
						var settingDisplay = $(this);
						
						// Append setting's display to list
						settingDisplays.push(settingDisplay);
						
						// Get setting's name
						var settingsName = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "setting");
						
						// Append setting's name to list
						settingsNames.push(settingsName);
					});
				
					// Return getting the default values for all settings
					return Promise.all(settingsNames.map(function(settingsName) {
					
						// Return getting default value from settings
						return self.getSettings().getDefaultValue(settingsName);
					
					})).then(function(defaultValues) {
					
						// Return getting the values for all settings
						return Promise.all(settingsNames.map(function(settingsName) {
						
							// Return getting value from settings
							return self.getSettings().getValue(settingsName);
						
						})).then(function(values) {
						
							// Turn off section shown settings section event
							$(self).off(Section.SHOWN_EVENT + ".settingsSection");
						
							// Initialize checking settings dependencies
							var checkingSettingsDependencies = [];
					
							// Go through all settings' values
							for(var i = 0; i < values["length"]; ++i) {
							
								// Get value
								var value = values[i];
							
								// Get default value
								var defaultValue = defaultValues[i];
							
								// Get setting's display
								let settingDisplay = settingDisplays[i];
								
								// Get setting's value display
								var settingsValueDisplay = settingDisplay.find("div.value");
								
								// Check setting's value display's type
								switch(settingsValueDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "type")) {
								
									// Boolean
									case "boolean":
									
										// Check if value is not a boolean value
										if(typeof value !== "boolean")
										
											// Set value to default value
											value = defaultValue;
										
										// Get setting's value display's button
										let button = settingsValueDisplay.find("button");
										
										// Check if value is true
										if(value === true)
										
											// Set that setting's value display's button is enabled and make it transition instantly
											button.addClass("enabled noTransition");
										
										// Otherwise
										else
										
											// Set that setting's value display's button isn't enabled and make it transition instantly
											button.removeClass("enabled").addClass("noTransition");
										
										// Section shown settings section event
										$(self).one(Section.SHOWN_EVENT + ".settingsSection", function() {
										
											// Allow setting's value display's button to transition
											button.removeClass("noTransition");
										});
										
										// Break
										break;
									
									// Number
									case "number":
									
										// Check if value is not a number value
										if(typeof value !== "number")
										
											// Set value to default value
											value = defaultValue;
										
										// Set that setting's value display's input to the value
										settingsValueDisplay.find("input").val((typeof value === "number") ? value.toFixed() : value);
										
										// Break
										break;
									
									// Select
									case "select":
									
										// Check if value is not a string value
										if(typeof value !== "string")
										
											// Set value to default value
											value = defaultValue;
										
										// Otherwise
										else {
									
											// Get setting's value display's values
											var options = settingsValueDisplay.find("option").map(function() {
											
												// Return option's value
												return $(this).attr("value");
											
											}).get();
											
											// Check if value is not an option
											if(options.indexOf(value) === Common.INDEX_NOT_FOUND)
											
												// Set value to default value
												value = defaultValue;
										}
										
										// Set that setting's value display's select to the value
										settingsValueDisplay.find("select").val(value);
									
										// Break
										break;
									
									// URL
									case "url":
									
										// Check if value is not a string value
										if(typeof value !== "string")
										
											// Set value to default value
											value = defaultValue;
										
										// Otherwise check if value isn't a valid URL
										else if(Common.isValidUrl(value) === false)
									
											// Set value to default value
											value = defaultValue;
										
										// Set that setting's value display's input to the value
										settingsValueDisplay.find("input").val(value);
									
										// Break
										break;
									
									// Text
									case "text":
									
										// Check if value is not a string value
										if(typeof value !== "string")
										
											// Set value to default value
											value = defaultValue;
										
										// Set that setting's value display's input to the value
										settingsValueDisplay.find("input").val(value);
									
										// Break
										break;
								}
								
								// Save setting's value
								settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "value", JSON.stringify(value));
								
								// Get setting's dependencies
								let settingDependencies = settingDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "dependencies");
								
								// Check if setting's dependencies don't exist
								if(settingDependencies === Common.NO_ATTRIBUTE)
								
									// Set setting's dependencies to empty array
									settingDependencies = [];
								
								// Otherwise
								else
								
									// Set setting's dependencies to it's JSON value
									settingDependencies = JSON.parse(settingDependencies);
								
								// Append checking setting dependencies to list
								checkingSettingsDependencies.push(new Promise(function(resolve, reject) {
								
									// Return getting the values for setting's dependencies
									return Promise.all(settingDependencies.map(function(dependency) {
									
										// Get dependency name
										var dependencyName = dependency[SettingsSection.DEPENDENCY_NAME_INDEX];
									
										// Return getting dependency value from settings
										return self.getSettings().getValue(dependencyName);
									
									})).then(function(dependencyValues) {
									
										// Set that setting isn't disabled or shows an error
										settingDisplay.removeClass("disabled error");
									
										// Go through all dependency values
										for(var j = 0; j < dependencyValues["length"]; ++j) {
										
											// Get dependency value
											var dependencyValue = dependencyValues[j];
											
											// Get dependency required value
											var dependencyRequiredValue = settingDependencies[j][SettingsSection.DEPENDENCY_VALUE_INDEX];
											
											// Check if dependency value is not the required value
											if(dependencyValue !== dependencyRequiredValue) {
											
												// Disable setting's display
												settingDisplay.addClass("disabled");
											
												// Break
												break;
											}
										}
									
										// Resolve
										resolve();
									
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(error);
									});
								}));
							}
							
							// Return waiting until all settings' dependencies are checked
							return Promise.all(checkingSettingsDependencies).then(function() {
							
								// Set wallet type select value
								self.getDisplay().find("select.walletType").val(Consensus.getWalletType()).children("option").enable().filter(":selected").disable();
								
								// Set network type select value
								self.getDisplay().find("select.networkType").val(Consensus.getNetworkType()).children("option").enable().filter(":selected").disable();
							
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
		
		// Get initialize error header
		getInitializeErrorHeader() {
		
			// Return initialize error header
			return Language.getDefaultTranslation('Settings Error');
		}
		
		// Save setting delay milliseconds
		static get SAVE_SETTING_DELAY_MILLISECONDS() {
		
			// Return save setting delay milliseconds
			return 150;
		}
		
		// Change select setting delay milliseconds
		static get CHANGE_SELECT_SETTING_DELAY_MILLISECONDS() {
		
			// Return change select setting delay milliseconds
			return 200;
		}
		
		// Reset settings before delay milliseconds
		static get RESET_SETTINGS_BEFORE_DELAY_MILLISECONDS() {
		
			// Return reset settings before delay milliseconds
			return 400;
		}
		
		// Reset settings after delay milliseconds
		static get RESET_SETTINGS_AFTER_DELAY_MILLISECONDS() {
		
			// Return reset settings after delay milliseconds
			return 100;
		}
		
		// Dependency name index
		static get DEPENDENCY_NAME_INDEX() {
		
			// Return dependency name index
			return 0;
		}
		
		// Dependency value index
		static get DEPENDENCY_VALUE_INDEX() {
		
			// Return dependency value index
			return SettingsSection.DEPENDENCY_NAME_INDEX + 1;
		}
}


// Main function

// Set global object's settings section
globalThis["SettingsSection"] = SettingsSection;
