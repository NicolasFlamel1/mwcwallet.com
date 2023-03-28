// Use strict
"use strict";


// Classes

// Install app class
class InstallApp {

	// Public
	
		// Constructor
		constructor(cookieAcceptance, automaticLock) {
		
			// Set automatic lock
			this.automaticLock = automaticLock;
		
			// Get install app display
			this.installAppDisplay = $("section.installApp");
			
			// Get install now button
			this.installNowButton = this.installAppDisplay.find("button.installNow");
			
			// Get remind me later button
			this.remindMeLaterButton = this.installAppDisplay.find("button.remindMeLater");
			
			// Set can show
			this.canShow = false;
			
			// Set was installed
			this.wasInstalled = false;
			
			// Set cookie acceptance is hidden
			this.cookieAcceptanceIsHidden = false;
			
			// Set self
			var self = this;
			
			// Cookie acceptance is hidden event
			$(cookieAcceptance).one(CookieAcceptance.IS_HIDDEN_EVENT, function() {
			
				// Set timeout
				setTimeout(function() {
			
					// Set cookie acceptance is hidden
					self.cookieAcceptanceIsHidden = true;
					
					// Can if can show
					if(self.canShow === true)
					
						// Show
						self.show();
				
				}, InstallApp.COOKIE_ACCEPTANCE_HIDE_BEFORE_SHOW_DELAY_MILLISECONDS);
			});
			
			// Window before install prompt event
			$(window).on("beforeinstallprompt", function(event) {
			
				// Prevent default
				event.preventDefault();
				
				// Store install app prompt
				installAppPrompt = event["originalEvent"];
				
				// Can if can show
				if(self.canShow === true)
				
					// Show
					self.show();
			});
			
			// Install app display transaition end event
			this.installAppDisplay.on("transitionend", function() {
			
				// Check if install app display is hiding
				if(self.installAppDisplay.hasClass("hide") === true)
				
					// Prevent focus on install app display's elements
					self.installAppDisplay.addClass("noFocus");
			});
			
			// Window app installed event
			$(window).on("appinstalled", function(event) {
			
				// Hide
				self.hide();
			});
			
			// Window storage event
			$(window).on("storage", function(event) {
			
				// Check if remind me later timestamp was changed
				if(event["originalEvent"]["key"] === InstallApp.INSTALL_APP_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME)
				
					// Hide
					self.hide();
			});
			
			// Install now button click event
			this.installNowButton.on("click", function() {
			
				// Check if the install app prompt exists
				if(installAppPrompt !== InstallApp.NO_INSTALL_APP_PROMPT) {
				
					// Get if automatic lock is enabled
					var automaticLockEnabled = self.automaticLock.getAllowed() !== 0;
					
					// Check if automatic lock is enabled
					if(automaticLockEnabled === true) {
				
						// Prevent automatic lock
						self.automaticLock.prevent();
					}
				
					// Prompt to install app
					installAppPrompt.prompt();
			
					// Get if app was installed
					installAppPrompt["userChoice"].then(function(result) {
					
						// Check if automatic lock is enabled
						if(automaticLockEnabled === true) {
					
							// Allow automatic lock
							self.automaticLock.allow();
						}
					
						// Check if app was installed
						if(result["outcome"] === InstallApp.APP_INSTALLED_OUTCOME) {
						
							// Set was installed
							self.wasInstalled = true;
						
							// Hide
							self.hide();
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Check if automatic lock is enabled
						if(automaticLockEnabled === true) {
					
							// Allow automatic lock
							self.automaticLock.allow();
						}
					});
				}
			});
			
			// Remind me later button click event
			this.remindMeLaterButton.on("click", function() {
			
				// Hide
				self.hide();
			
				// Try
				try {
				
					// Save current timestamp as the remind me later timestamp
					localStorage.setItem(InstallApp.INSTALL_APP_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME, Common.getCurrentTimestamp().toFixed());
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
			
			// Check if not an app or extension and not loading from file
			if(Common.isApp() === false && Common.isExtension() === false && location["protocol"] !== Common.FILE_PROTOCOL) {
		
				// Check if the install app prompt exists, cookie acceptance is hidden, and wasn't installed
				if(installAppPrompt !== InstallApp.NO_INSTALL_APP_PROMPT && this.cookieAcceptanceIsHidden === true && this.wasInstalled === false) {
			
					// Get remind me later timestamp
					var remindMeLaterTimestamp = localStorage.getItem(InstallApp.INSTALL_APP_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME);
					
					// Check if it's time to remind about installing the app
					if(remindMeLaterTimestamp === Common.INVALID_LOCAL_STORAGE_ITEM || parseInt(remindMeLaterTimestamp, Common.DECIMAL_NUMBER_BASE) <= Common.getCurrentTimestamp() - InstallApp.REMIND_ME_LATER_DURATION_SECONDS) {
				
						// Show install app display and make it so that its elements can be focused
						this.installAppDisplay.removeClass("hide noFocus");
						
						// Return true
						return true;
					}
				}
			}
			
			// Return false
			return false;
		}
		
		// No install app prompt
		static get NO_INSTALL_APP_PROMPT() {
		
			// Return no install app prompt
			return null;
		}
	
	// Private
		
		// Hide
		hide() {
		
			// Set install app prompt to no install app prompt
			this.installAppPrompt = InstallApp.NO_INSTALL_APP_PROMPT;
		
			// Hide install app display
			this.installAppDisplay.addClass("hide");
		}
		
		// Remind me later duration seconds
		static get REMIND_ME_LATER_DURATION_SECONDS() {
		
			// Return remind me later duration seconds
			return 90 * Common.HOURS_IN_A_DAY * Common.MINUTES_IN_AN_HOUR * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Install app remind me later timestamp local storage name
		static get INSTALL_APP_REMIND_ME_LATER_TIMESTAMP_LOCAL_STORAGE_NAME() {
		
			// Return install app remind me later timestamp local storage name
			return "Install App Remind Me Later Timestamp";
		}
		
		// App install outcome
		static get APP_INSTALLED_OUTCOME() {
		
			// Return app installed outcome
			return "accepted";
		}
		
		// Return cookie acceptance hide before show delay milliseconds
		static get COOKIE_ACCEPTANCE_HIDE_BEFORE_SHOW_DELAY_MILLISECONDS() {
		
			// Return cookie acceptance hide before show delay milliseconds
			return 100;
		}
}


// Global variables

// Install app prompt
var installAppPrompt = InstallApp.NO_INSTALL_APP_PROMPT;


// Main function

// Set global object's install app
globalThis["InstallApp"] = InstallApp;

// Window before install prompt event
$(window).on("beforeinstallprompt", function(event) {

	// Prevent default
	event.preventDefault();
	
	// Store install app prompt
	installAppPrompt = event["originalEvent"];
});
