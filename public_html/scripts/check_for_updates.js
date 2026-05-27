// Use strict
"use strict";


// Classes

// Check for updates class
class CheckForUpdates {

	// Public
	
		// Constructor
		constructor(unlocked, settings, cookieAcceptance) {
		
			// Set settings
			this.settings = settings;
			
			// Get check for updates display
			this.checkForUpdatesDisplay = $("section.checkForUpdates");
			
			// Get download now button
			this.downloadNowButton = this.checkForUpdatesDisplay.find("button.downloadNow");
			
			// Get remind me later button
			this.remindMeLaterButton = this.checkForUpdatesDisplay.find("button.remindMeLater");
			
			// Set can show
			this.canShow = false;
			
			// Set cookie acceptance is hidden
			this.cookieAcceptanceIsHidden = false;
			
			// Set checked for updates to false
			this.checkedForUpdates = false;
			
			// Set newer version to no newer version
			this.newerVersion = CheckForUpdates.NO_NEWER_VERSION;
			
			// Set enable checking for updates to setting's default value
			this.enableCheckingForUpdates = CheckForUpdates.SETTINGS_ENABLE_CHECKING_FOR_UPDATES_DEFAULT_VALUE;
			
			// Check if is an extension that's not the Firefox extension, the Chrome extension, the Edge extension, or the Opera extension
			if(Common.isExtension() === true && (typeof browser === "undefined" || browser["runtime"]["id"] !== "{d783f67c-4dea-4d64-bfc2-1d4a6057babe}") && (typeof chrome === "undefined" || chrome["runtime"]["id"] !== "ahhdnimkkpkmclgcnbchlgijhmieongp") && (typeof chrome === "undefined" || chrome["runtime"]["id"] !== "nhfjkjhonhcjengnbaplabipoajnlmjm") && (typeof chrome === "undefined" || chrome["runtime"]["id"] !== "iaagomomhleebihpbgbnlbbfaeomeoof")) {
			
				// Set newest version URL
				this.newestVersionUrl = "https://api.github.com/repos/NicolasFlamel1/MWC-Wallet-Browser-Extension/releases/latest";
				
				// Set download URL
				this.downloadUrl = "https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension/releases";
			}
			
			// Otherwise check if is a mobile app
			else if(Common.isMobileApp() === true) {
			
				// Set newest version URL
				this.newestVersionUrl = "https://api.github.com/repos/NicolasFlamel1/MWC-Wallet-Mobile-App/releases/latest";
				
				// Set download URL
				this.downloadUrl = "https://github.com/NicolasFlamel1/MWC-Wallet-Mobile-App/releases";
			}
			
			// Otherwise check if loading from file
			else if(location["protocol"] === Common.FILE_PROTOCOL || location["protocol"] === Common.CONTENT_PROTOCOL) {
			
				// Set newest version URL
				this.newestVersionUrl = "https://api.github.com/repos/NicolasFlamel1/MWC-Wallet-Standalone/releases/latest";
				
				// Set download URL
				this.downloadUrl = "https://github.com/NicolasFlamel1/MWC-Wallet-Standalone/releases";
			}
			
			// Otherwise
			else {
			
				// Hide enable checking for updates setting
				unlocked.settingsSection.getDisplay().find("div.setting[data-setting=\"" + Common.escapeString(CheckForUpdates.SETTINGS_ENABLE_CHECKING_FOR_UPDATES_NAME) + "\"]").addClass("hide");
			}
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
					
						// Enable checking for updates setting
						self.settings.createValue(CheckForUpdates.SETTINGS_ENABLE_CHECKING_FOR_UPDATES_NAME, CheckForUpdates.SETTINGS_ENABLE_CHECKING_FOR_UPDATES_DEFAULT_VALUE)
						
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Enable checking for updates setting
							CheckForUpdates.SETTINGS_ENABLE_CHECKING_FOR_UPDATES_NAME
						];
						
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set enable checking for updates to setting's value
							self.enableCheckingForUpdates = settingValues[settings.indexOf(CheckForUpdates.SETTINGS_ENABLE_CHECKING_FOR_UPDATES_NAME)];
							
							// Check for updates
							self.checkForUpdates();
							
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
				
					// Enable checking for updates setting
					case CheckForUpdates.SETTINGS_ENABLE_CHECKING_FOR_UPDATES_NAME:
					
						// Set enable checking for updates to setting's value
						self.enableCheckingForUpdates = setting[Settings.DATABASE_VALUE_NAME];
						
						// Check for updates
						self.checkForUpdates();
						
						// Break
						break;
				}
			});
			
			// Cookie acceptance is hidden event
			$(cookieAcceptance).one(CookieAcceptance.IS_HIDDEN_EVENT, function() {
			
				// Set timeout
				setTimeout(function() {
				
					// Set cookie acceptance is hidden
					self.cookieAcceptanceIsHidden = true;
					
					// Can if can show
					if(self.canShow === true) {
					
						// Show
						self.show();
					}
				
				}, CheckForUpdates.COOKIE_ACCEPTANCE_HIDE_BEFORE_SHOW_DELAY_MILLISECONDS);
			});
			
			// Check for updates display transaition end event
			this.checkForUpdatesDisplay.on("transitionend", function() {
			
				// Check if check for updates display is hiding
				if(self.checkForUpdatesDisplay.hasClass("hide") === true) {
				
					// Prevent focus on check for updates display's elements
					self.checkForUpdatesDisplay.addClass("noFocus");
				}
			});
			
			// Window storage event
			$(window).on("storage", function(event) {
			
				// Check if remind me later timestamp was changed
				if(event["originalEvent"]["key"] === CheckForUpdates.CHECK_FOR_UPDATES_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME) {
				
					// Hide
					self.hide();
				}
			});
			
			// Download now button click event
			this.downloadNowButton.on("click", function() {
			
				// Open download URL
				window.open(self.downloadUrl + "/tag/v" + self.newerVersion, "_blank");
				
				// Hide
				self.hide();
				
				// Try
				try {
				
					// Remove the remind me later timestamp
					localStorage.removeItem(CheckForUpdates.CHECK_FOR_UPDATES_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME);
				}
				
				// Catch errors
				catch(error) {
				
					// Trigger a fatal error
					new FatalError(FatalError.LOCAL_STORAGE_ERROR);
				}
			});
			
			// Remind me later button click event
			this.remindMeLaterButton.on("click", function() {
			
				// Hide
				self.hide();
				
				// Try
				try {
				
					// Save current timestamp as the remind me later timestamp
					localStorage.setItem(CheckForUpdates.CHECK_FOR_UPDATES_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME, Common.getCurrentTimestamp().toFixed());
				}
				
				// Catch errors
				catch(error) {
				
					// Trigger a fatal error
					new FatalError(FatalError.LOCAL_STORAGE_ERROR);
				}
			
			// Remind me later hover in event
			}).hover(function() {
			
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
			
			// Remind me later hover out event
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
			
			// Remind me later focus event
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
			
			// Remind me later blur event
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
		
		// Show
		show() {
		
			// Set can show
			this.canShow = true;
			
			// Check if a newer version exists and cookie acceptance is hidden
			if(this.newerVersion !== CheckForUpdates.NO_NEWER_VERSION && this.cookieAcceptanceIsHidden === true) {
			
				// Get remind me later timestamp
				var remindMeLaterTimestamp = localStorage.getItem(CheckForUpdates.CHECK_FOR_UPDATES_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME);
				
				// Check if it's time to remind about downloading an update
				if(remindMeLaterTimestamp === Common.INVALID_LOCAL_STORAGE_ITEM || parseInt(remindMeLaterTimestamp, Common.DECIMAL_NUMBER_BASE) <= Common.getCurrentTimestamp() - CheckForUpdates.REMIND_ME_LATER_DURATION_SECONDS) {
				
					// Show check for updates display and make it so that its elements can be focused
					this.checkForUpdatesDisplay.removeClass("hide noFocus");
					
					// Return true
					return true;
				}
			}
			
			// Return false
			return false;
		}
	
	// Private
		
		// Check for updates
		checkForUpdates() {
		
			// Check if checking for updates is enabled and hasn't already checked for updates
			if(this.enableCheckingForUpdates === true && this.checkedForUpdates === false) {
			
				// Set checked for updates to true
				this.checkedForUpdates = true;
				
				// Check if newest version URL exists
				if(typeof this.newestVersionUrl !== "undefined") {
				
					// Log message
					Log.logMessage(Language.getDefaultTranslation('Trying to connect to the updates server at %1$y.'), [
					
						[
							// Text
							this.newestVersionUrl,
							
							// Is raw data
							true
						]
					]);
					
					// Set self
					var self = this;
					
					// Check if getting newest version was successful
					$.getJSON(this.newestVersionUrl).then(function(newestVersionInfo) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Successfully connected to the updates server.'));
						
						// Check if newest version is valid
						if(Object.isObject(newestVersionInfo) === true && "tag_name" in newestVersionInfo === true && typeof newestVersionInfo["tag_name"] === "string" && newestVersionInfo["tag_name"][0] === "v" && Node.VERSION_PATTERN.test(newestVersionInfo["tag_name"].substring("v"["length"])) === true) {
						
							// Get newest version
							var newestVersion = newestVersionInfo["tag_name"].substring("v"["length"]);
							
							// Log message
							Log.logMessage(Language.getDefaultTranslation('The newest version available is %1$v.'), [
							
								// Newest version
								newestVersion
							]);
							
							// Check if newest version is newer than the current version
							if(Node.isVersionGreaterThanOrEqual(newestVersion, VERSION_NUMBER) === true) {
							
								// Check if is an extension
								if(Common.isExtension() === true) {
								
									// Set message
									var message = Language.getDefaultTranslation('A new version of this extension is available. Download version %1$v now?');
								}
								
								// Otherwise check if is an app
								else if(Common.isApp() === true) {
								
									// Set message
									var message = Language.getDefaultTranslation('A new version of this app is available. Download version %1$v now?');
								}
								
								// Otherwise
								else {
								
									// Set message
									var message = Language.getDefaultTranslation('A new version of this site is available. Download version %1$v now?');
								}
								
								// Add message before download now button
								self.downloadNowButton.before(Language.createTranslatableContainer("<p>", message, [
								
									// Newest version
									newestVersion
								]));
								
								// Set newer version to the newest version
								self.newerVersion = newestVersion;
								
								// Can if can show
								if(self.canShow === true) {
								
									// Show
									self.show();
								}
							}
						}
						
						// Otherwise
						else {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Received an invalid response from the updates server.'));
						}
						
					// Catch errors
					}).catch(function(request) {
					
						// Check if connecting to the prices server failed
						if(request["status"] === Common.HTTP_NO_RESPONSE_STATUS) {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Connecting to the updates server failed.'));
						}
						
						// Otherwise
						else {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Successfully connected to the updates server.'));
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Received an invalid response from the updates server.'));
						}
					});
				}
			}
		}
		
		// Hide
		hide() {
		
			// Set newer version to no newer version
			this.newerVersion = CheckForUpdates.NO_NEWER_VERSION;
			
			// Hide check for updates display
			this.checkForUpdatesDisplay.addClass("hide");
		}
		
		// No newer version
		static get NO_NEWER_VERSION() {
		
			// Return no newer version
			return null;
		}
		
		// Settings enable checking for updates name
		static get SETTINGS_ENABLE_CHECKING_FOR_UPDATES_NAME() {
		
			// Return settings enable checking for updates name
			return "Enable Checking For Updates";
		}
		
		// Settings enable checking for updates default value
		static get SETTINGS_ENABLE_CHECKING_FOR_UPDATES_DEFAULT_VALUE() {
		
			// Return settings enable checking for updates default value
			return true;
		}
		
		// Remind me later duration seconds
		static get REMIND_ME_LATER_DURATION_SECONDS() {
		
			// Return remind me later duration seconds
			return Common.DAYS_IN_A_WEEK * Common.HOURS_IN_A_DAY * Common.MINUTES_IN_AN_HOUR * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Check for updates remind me later timestamp local storage name
		static get CHECK_FOR_UPDATES_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME() {
		
			// Return check for updates remind me later timestamp local storage name
			return "Check For Updates Remind Me Later Timestamp";
		}
		
		// Return cookie acceptance hide before show delay milliseconds
		static get COOKIE_ACCEPTANCE_HIDE_BEFORE_SHOW_DELAY_MILLISECONDS() {
		
			// Return cookie acceptance hide before show delay milliseconds
			return 100;
		}
}


// Main function

// Set global object's check for updates
globalThis["CheckForUpdates"] = CheckForUpdates;
