// Use strict
"use strict";


// Classes

// Cookie acceptance class
class CookieAcceptance {

	// Public
	
		// Constructor
		constructor() {
		
			// Get cookie acceptance display
			this.cookieAcceptanceDisplay = $("section.cookieAcceptance");
			
			// Get acknowledge button
			this.acknowledgeButton = this.cookieAcceptanceDisplay.find("button");
			
			// Set can show
			this.canShow = false;
			
			// Set self
			var self = this;
			
			// Cookie acceptance display transaition end event
			this.cookieAcceptanceDisplay.on("transitionend", function() {
			
				// Check if cookie acceptance display is hiding
				if(self.cookieAcceptanceDisplay.hasClass("hide") === true) {
				
					// Prevent focus on cookie acceptance display's elements
					self.cookieAcceptanceDisplay.addClass("noFocus");
					
					// Trigger is hidden event
					$(self).trigger(CookieAcceptance.IS_HIDDEN_EVENT);
				}
			});
			
			// Window storage event
			$(window).on("storage", function(event) {
			
				// Check if cookie acceptance message acknowledged was changed
				if(event["originalEvent"]["key"] === CookieAcceptance.COOKIE_ACCEPTANCE_MESSAGE_ACKNOWLEDGED_LOCAL_STORAGE_NAME) {
				
					// Hide
					self.hide();
					
					// Clear can show
					self.canShow = false;
				}
			});
			
			// Acknowledged button click event
			this.acknowledgeButton.on("click", function() {
			
				// Hide
				self.hide();
				
				// Clear can show
				self.canShow = false;
			
				// Try
				try {
				
					// Save cookie acceptance message acknowledged
					localStorage.setItem(CookieAcceptance.COOKIE_ACCEPTANCE_MESSAGE_ACKNOWLEDGED_LOCAL_STORAGE_NAME, CookieAcceptance.COOKIE_ACCEPTANCE_MESSAGE_ACKNOWLEDGED_TRUE_VALUE);
				}
				
				// Catch errors
				catch(error) {
				
					// Trigger a fatal error
					new FatalError(FatalError.LOCAL_STORAGE_ERROR);
				}
			});
		}
		
		// Show
		show(canShow = true) {
		
			// Check if can show
			if(canShow === true || this.canShow === true) {
			
				// Set can show
				this.canShow = true;
				
				// Check if not an app or extension and not loading from file
				if(Common.isApp() === false && Common.isExtension() === false && location["protocol"] !== Common.FILE_PROTOCOL) {
		
					// Get cookie acceptance message acknowledged
					var cookieAcceptanceMessageAcknowledged = localStorage.getItem(CookieAcceptance.COOKIE_ACCEPTANCE_MESSAGE_ACKNOWLEDGED_LOCAL_STORAGE_NAME);
					
					// Check if cookie acceptance message hasn't been acknowledged
					if(cookieAcceptanceMessageAcknowledged === Common.INVALID_LOCAL_STORAGE_ITEM || cookieAcceptanceMessageAcknowledged !== CookieAcceptance.COOKIE_ACCEPTANCE_MESSAGE_ACKNOWLEDGED_TRUE_VALUE) {
				
						// Show cookie acceptance display and make it so that its elements can be focused
						this.cookieAcceptanceDisplay.removeClass("hide noFocus");
						
						// Set self
						var self = this;
						
						// Windows resize cookie acceptance event
						$(window).on("resize.cookieAcceptance", function() {
							
							// Check if is an app
							if(Common.isApp() === true) {
							
								// Turn off window resize cookie acceptance event
								$(window).off("resize.cookieAcceptance");
								
								// Hide
								self.hide();
								
								// Clear can show
								self.canShow = false;
							}
						});
						
						// Return true
						return true;
					}
					
					// Otherwise
					else {
					
						// Trigger is hidden event
						$(this).trigger(CookieAcceptance.IS_HIDDEN_EVENT);
					}
				}
				
				// Otherwise
				else {
				
					// Trigger is hidden event
					$(this).trigger(CookieAcceptance.IS_HIDDEN_EVENT);
				}
			}
			
			// Return false
			return false;
		}
		
		// Is hidden event
		static get IS_HIDDEN_EVENT() {
		
			// Return is hidden event
			return "CookieAcceptanceIsHiddenEvent";
		}
	
	// Private
		
		// Hide
		hide() {
		
			// Hide cookie acceptance display
			this.cookieAcceptanceDisplay.addClass("hide");
		}
		
		// Cookie acceptance message acknowledged local storage name
		static get COOKIE_ACCEPTANCE_MESSAGE_ACKNOWLEDGED_LOCAL_STORAGE_NAME() {
		
			// Return cookie acceptance message acknowledged local storage name
			return "Cookie Acceptance Message Acknowledged";
		}
		
		// Cookie acceptance message acknowledged true value
		static get COOKIE_ACCEPTANCE_MESSAGE_ACKNOWLEDGED_TRUE_VALUE() {
		
			// Return cookie acceptance message acknowledged true value
			return "true";
		}
}


// Main function

// Set global object's cookie acceptance
globalThis["CookieAcceptance"] = CookieAcceptance;
