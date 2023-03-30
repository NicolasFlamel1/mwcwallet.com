// Use strict
"use strict";


// Classes

// Log section class
class LogSection extends Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Delegate constructor
			super(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard);
			
			// Get message display
			this.messageDisplay = this.getDisplay().find("div.messages");
			
			// Set message counter
			this.messageCounter = 1;
			
			// Set maximum number of messages to setting's default value
			this.maximumNumberOfMessages = LogSection.SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_DEFAULT_VALUE;
			
			// Set scroll to bottom
			this.scrollToBottom = true;
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Maximum number of messages setting
						self.getSettings().createValue(LogSection.SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_NAME, LogSection.SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_DEFAULT_VALUE)
						
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Maximum number of messages setting
							LogSection.SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_NAME,
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.getSettings().getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set maximum number of messages to setting's value
							self.maximumNumberOfMessages = settingValues[settings.indexOf(LogSection.SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_NAME)];
							
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
			$(this.getSettings()).on(Settings.CHANGE_EVENT, function(event, setting) {
			
				// Check what setting was changes
				switch(setting[Settings.DATABASE_SETTING_NAME]) {
				
					// Maximum number of messages setting
					case LogSection.SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_NAME:
					
						// Set maximum number of messages to setting's value
						self.maximumNumberOfMessages = setting[Settings.DATABASE_VALUE_NAME];
						
						// Truncate messages
						self.truncateMessages();
					
						// Break
						break;
				}
			});
			
			// Check if get selection is supported
			if(typeof getSelection !== "undefined") {
			
				// Main copy event
				$("main").on("copy", function(event) {
				
					// Check if shown
					if(self.isShown() === true) {
					
						// Prevent default
						event.preventDefault();
						
						// Get selection without duplicate newlines
						var selection = Common.removeDuplicateNewlines(getSelection().toString());
						
						// Set clipboard data to the new selection
						event["originalEvent"]["clipboardData"].setData("text/plain", selection);
					}
				});
			}
			
			// Display scroll event
			this.getDisplay().on("scroll", function(event) {
			
				// Check if shown
				if(self.isShown() === true) {
			
					// Update scroll to bottom
					self.scrollToBottom = Math.abs(self.getDisplay().get(0)["scrollHeight"] - self.getDisplay().get(0)["clientHeight"] - self.getDisplay().get(0)["scrollTop"]) <= Scroll.TOLERANCE || self.getDisplay().get(0)["scrollHeight"] - self.getDisplay().get(0)["scrollTop"] <= self.getDisplay().get(0)["clientHeight"];
				}
			
			// Display language change event
			}).on(Language.CHANGE_EVENT, function() {
			
				// Check if scroll to bottom
				if(self.scrollToBottom === true) {
				
					// Scroll display to the bottom
					self.getDisplay().get(0)["scrollTop"] = self.getDisplay().get(0)["scrollHeight"] - self.getDisplay().get(0)["clientHeight"] + Scroll.TOLERANCE;
				}
			});
			
			// Document log message event
			$(document).on(Log.MESSAGE_EVENT, function() {
			
				// Increment message counter
				++self.messageCounter;
			
				// Truncate messages
				self.truncateMessages();
			});
			
			// Section shown event
			$(this).on(Section.SHOWN_EVENT, function() {
			
				// Check if scroll to bottom
				if(self.scrollToBottom === true) {
				
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Scroll display to the bottom
						self.getDisplay().get(0)["scrollTop"] = self.getDisplay().get(0)["scrollHeight"] - self.getDisplay().get(0)["clientHeight"] + Scroll.TOLERANCE;
					});
				}
			});
			
			// Window resize event
			$(window).on("resize", function() {
			
				// Check if scroll to bottom
				if(self.scrollToBottom === true) {
				
					// Scroll display to the bottom
					self.getDisplay().get(0)["scrollTop"] = self.getDisplay().get(0)["scrollHeight"] - self.getDisplay().get(0)["clientHeight"] + Scroll.TOLERANCE;
				}
			});
		}
		
		// Get name
		getName() {
		
			// Return name
			return LogSection.NAME;
		}
		
		// Reset
		reset() {
		
			// Reset
			super.reset();
		}
		
		// Name
		static get NAME() {
		
			// Return name
			return "Log";
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
			return Language.getDefaultTranslation('Log Error');
		}
		
		// Truncate messages
		truncateMessages() {
		
			// Check if too many messages exist
			if(this.messageCounter > this.maximumNumberOfMessages) {
			
				// Remove earlier messages
				this.messageDisplay.children("p:lt(" + (this.messageCounter - this.maximumNumberOfMessages).toFixed() + ")").remove();
				
				// Update message counter
				this.messageCounter = this.maximumNumberOfMessages;
			}
		}
		
		// Settings maximum number of messages name
		static get SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_NAME() {
		
			// Return settings maximum number of messages name
			return "Maximum Number Of Messages";
		}
		
		// Settings maximum number of messages default value
		static get SETTINGS_MAXIMUM_NUMBER_OF_MESSAGES_DEFAULT_VALUE() {
		
			// Return settings maximum number of messages default value
			return 1000;
		}
}


// Main function

// Set global object's log section
globalThis["LogSection"] = LogSection;
