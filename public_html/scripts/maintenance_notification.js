// Use strict
"use strict";


// Classes

// Maintenance notification class
class MaintenanceNotification {

	// Public
	
		// Constructor
		constructor() {
			
			// Get maintenance notification display
			this.maintenanceNotificationDisplay = $("section.maintenanceNotification");
			
			// Get acknowledge button
			this.acknowledgeButton = this.maintenanceNotificationDisplay.find("button");
			
			// Get start timestamp
			this.startTimestamp = (MAINTENANCE_START_TIME["length"] !== 0) ? Date.parse(MAINTENANCE_START_TIME) / Common.MILLISECONDS_IN_A_SECOND : 0;
			
			// Set can show
			this.canShow = true;
			
			// Set self
			var self = this;
			
			// Maintenance notification display transaition end event
			this.maintenanceNotificationDisplay.on("transitionend", function() {
			
				// Check if maintenance notification display is hiding
				if(self.maintenanceNotificationDisplay.hasClass("hide") === true)
				
					// Prevent focus on maintenance notification display's elements
					self.maintenanceNotificationDisplay.addClass("noFocus");
			});
			
			// Window storage event
			$(window).on("storage", function(event) {
			
				// Check if maintenance notification message acknowledged timestamp was changed and it's as recent or newer than the start timestamp
				if(event["originalEvent"]["key"] === MaintenanceNotification.MAINTENANCE_NOTIFICATION_MESSAGE_ACKNOWLEDGED_TIMESTAMP_LOCAL_STORAGE_NAME && parseInt(event["originalEvent"]["newValue"], Common.DECIMAL_NUMBER_BASE) >= self.startTimestamp) {
				
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
				
					// Save maintenance notification message acknowledged timestamp
					localStorage.setItem(MaintenanceNotification.MAINTENANCE_NOTIFICATION_MESSAGE_ACKNOWLEDGED_TIMESTAMP_LOCAL_STORAGE_NAME, self.startTimestamp.toFixed());
				}
				
				// Catch errors
				catch(error) {
				
					// Trigger a fatal error
					new FatalError(FatalError.LOCAL_STORAGE_ERROR);
				}
			});
		}
		
		// Show
		show() {
		
			// Check if can show
			if(this.canShow === true) {
			
				// Check if not an extension and not loading from file
				if(Common.isExtension() === false && location["protocol"] !== Common.FILE_PROTOCOL) {
			
					// Get the current timestamp
					var currentTimestamp = Common.getCurrentTimestamp();
				
					// Check if current timestamp is older than the start timestamp
					if(currentTimestamp <= this.startTimestamp) {
			
						// Get maintenance notification message acknowledged timestamp
						var maintenanceNotificationMessageAcknowledgedTimestamp = localStorage.getItem(MaintenanceNotification.MAINTENANCE_NOTIFICATION_MESSAGE_ACKNOWLEDGED_TIMESTAMP_LOCAL_STORAGE_NAME);
						
						// Check if maintenance notification message hasn't been acknowledged or it was acknowledged as an older timestamp
						if(maintenanceNotificationMessageAcknowledgedTimestamp === Common.INVALID_LOCAL_STORAGE_ITEM || parseInt(maintenanceNotificationMessageAcknowledgedTimestamp, Common.DECIMAL_NUMBER_BASE) < this.startTimestamp) {
						
							// Check if is an app
							if(Common.isApp() === true) {
							
								// Set message
								var message = Language.getDefaultTranslation('This app will be down for scheduled maintenance starting on %1$d at %2$t.');
							}
							
							// Otherwise
							else {
							
								// Set message
								var message = Language.getDefaultTranslation('This site will be down for scheduled maintenance starting on %1$d at %2$t.');
							}
						
							// Add maintenance notification display text to maintenance notification display
							this.maintenanceNotificationDisplay.find("button").before(Language.createTranslatableContainer("<p>", message, [
							
								// Start timestamp
								this.startTimestamp.toFixed(),
								
								// Start timestamp
								this.startTimestamp.toFixed()
							]));
							
							// Show maintenance notification display and make it so that its elements can be focused
							this.maintenanceNotificationDisplay.removeClass("hide noFocus");
							
							// Check if a timeout can be set for the start timestamp
							if((this.startTimestamp - currentTimestamp) * Common.MILLISECONDS_IN_A_SECOND <= Common.INT32_MAX_VALUE) {
							
								// Check if not closing when done processing extension requests
								if(Extension.getCloseWhenDone() === false) {
							
									// Set timeout
									setTimeout(function() {
									
										// Prevent extension from interrupting on close
										Extension.preventInterruptOnClose();
									
										// Go to maintenance page
										location.replace(((location["protocol"] === Common.HTTPS_PROTOCOL) ? Common.HTTPS_PROTOCOL : Common.HTTP_PROTOCOL) + "//" + location["hostname"] + MaintenanceNotification.MAINTENANCE_PAGE_URL);
										
									}, (this.startTimestamp - currentTimestamp) * Common.MILLISECONDS_IN_A_SECOND);
								}
							}
							
							// Return true
							return true;
						}
					}
				}
			}
			
			// Return false
			return false;
		}
	
	// Private
		
		// Hide
		hide() {
		
			// Hide maintenance notification display
			this.maintenanceNotificationDisplay.addClass("hide");
		}
		
		// Maintenance notification message acknowledged local storage name
		static get MAINTENANCE_NOTIFICATION_MESSAGE_ACKNOWLEDGED_TIMESTAMP_LOCAL_STORAGE_NAME() {
		
			// Return maintenance notification message acknowledged timestamp local storage name
			return "Maintenance Notification Message Acknowledged Timestamp";
		}
		
		// Maintenance page URL
		static get MAINTENANCE_PAGE_URL() {
		
			// Return maintenance page URL
			return "/errors/503.html";
		}
}


// Main function

// Set global object's maintenance notification
globalThis["MaintenanceNotification"] = MaintenanceNotification;
