// Use strict
"use strict";


// Classes

// Automatic lock class
class AutomaticLock {

	// Public
	
		// Constructor
		constructor(application, message, settings) {
		
			// Set application
			this.application = application;
			
			// Set message
			this.message = message;
			
			// Set settings
			this.settings = settings;
			
			// Set lock timeout to no timeout
			this.lockTimeout = AutomaticLock.NO_TIMEOUT;
			
			// Set allow no interaction lock to false
			this.allowNoInteractionLock = false;
			
			// Set allow inactive lock to false
			this.allowInactiveLock = false;
			
			// Set locking to false
			this.locking = false;
			
			// Set enable automatic lock to setting's default value
			this.enableAutomaticLock = AutomaticLock.SETTINGS_ENABLE_AUTOMATIC_LOCK_DEFAULT_VALUE;
			
			// Set no interaction lock timeout minutes to setting's default value
			this.noInteractionLockTimeoutMinutes = AutomaticLock.SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_DEFAULT_VALUE;
			
			// Set lock on inactive to setting's default value
			this.enableLockOnInactive = AutomaticLock.SETTINGS_ENABLE_LOCK_ON_INACTIVE_DEFAULT_VALUE;
			
			// Update last interaction timestamp
			this.updateLastInteractionTimestamp();
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Create enable automatic lock setting
						self.settings.createValue(AutomaticLock.SETTINGS_ENABLE_AUTOMATIC_LOCK_NAME, AutomaticLock.SETTINGS_ENABLE_AUTOMATIC_LOCK_DEFAULT_VALUE),
					
						// Create no interaction lock timeout minutes setting
						self.settings.createValue(AutomaticLock.SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_NAME, AutomaticLock.SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_DEFAULT_VALUE),
						
						// Create enable lock on inactive setting
						self.settings.createValue(AutomaticLock.SETTINGS_ENABLE_LOCK_ON_INACTIVE_NAME, AutomaticLock.SETTINGS_ENABLE_LOCK_ON_INACTIVE_DEFAULT_VALUE)
						
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Enable automatic lock setting
							AutomaticLock.SETTINGS_ENABLE_AUTOMATIC_LOCK_NAME,
							
							// No interaction lock timeout minutes setting
							AutomaticLock.SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_NAME,
							
							// Enable lock on inactive setting
							AutomaticLock.SETTINGS_ENABLE_LOCK_ON_INACTIVE_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set enable automatic lock to setting's value
							self.enableAutomaticLock = settingValues[settings.indexOf(AutomaticLock.SETTINGS_ENABLE_AUTOMATIC_LOCK_NAME)];
				
							// Set no interaction lock timeout minutes to setting's value
							self.noInteractionLockTimeoutMinutes = settingValues[settings.indexOf(AutomaticLock.SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_NAME)];
							
							// Set enable lock on inactive to setting's value
							self.enableLockOnInactive = settingValues[settings.indexOf(AutomaticLock.SETTINGS_ENABLE_LOCK_ON_INACTIVE_NAME)];
							
							// Update last interaction timestamp
							self.updateLastInteractionTimestamp();
						
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
				
					// Enable automatic lock setting
					case AutomaticLock.SETTINGS_ENABLE_AUTOMATIC_LOCK_NAME:
					
						// Set enable automatic lock to setting's value
						self.enableAutomaticLock = setting[Settings.DATABASE_VALUE_NAME];
						
						// Update last interaction timestamp
						self.updateLastInteractionTimestamp();
						
						// Break
						break;
					
					// No interaction lock timeout minutes setting
					case AutomaticLock.SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_NAME:
					
						// Set no interaction lock timeout minutes to setting's value
						self.noInteractionLockTimeoutMinutes = setting[Settings.DATABASE_VALUE_NAME];
						
						// Update last interaction timestamp
						self.updateLastInteractionTimestamp();
						
						// Break
						break;
					
					// Enable lock on inactive setting
					case AutomaticLock.SETTINGS_ENABLE_LOCK_ON_INACTIVE_NAME:
					
						// Set enable lock on inactive to setting's value
						self.enableLockOnInactive = setting[Settings.DATABASE_VALUE_NAME];
						
						// Break
						break;
				}
			});
			
			// Window blur event
			$(window).on("blur", function() {
			
				// Update last interaction timestamp
				self.updateLastInteractionTimestamp();
				
				// Check if lock on inactive is enabled and allowed
				if(self.enableLockOnInactive === true && self.allowInactiveLock === true) {
				
					// Reset lock timeout
					self.resetLockTimeout();
					
					// Check if application's unlocked display is shown
					if(self.application.isUnlockedDisplayShown() === true) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Inactive lock activated.'));
					}
					
					// Lock
					self.lock();
				}
			
			// Window focus event
			}).on("focus", function() {
			
				// Check if no interaction lock timeout minutes exist
				if(self.noInteractionLockTimeoutMinutes !== AutomaticLock.NO_NO_INTERACTION_LOCK_TIMEOUT_MINUTES) {
			
					// Check if application hasn't been interacted with in too long
					if(self.lastInteractionTimestamp <= Common.getCurrentTimestamp() - self.noInteractionLockTimeoutMinutes * Common.SECONDS_IN_A_MINUTE) {
					
						// Reset lock timeout
						self.resetLockTimeout();
					
						// Check if automatic lock is enabled and allowed
						if(self.enableAutomaticLock === true && self.allowNoInteractionLock === true) {
						
							// Check if application's unlocked display is shown
							if(self.application.isUnlockedDisplayShown() === true) {
							
								// Log message
								Log.logMessage(Language.getDefaultTranslation('Automatic lock activated.'));
							}
					
							// Lock
							self.lock();
						}
					}
				}
				
				// Update last interaction timestamp
				self.updateLastInteractionTimestamp();
			
			// Window page hide event
			}).on("pagehide", function() {
			
				// Check if lock on inactive is enabled and allowed
				if(self.enableLockOnInactive === true && self.allowInactiveLock === true) {
				
					// Reset lock timeout
					self.resetLockTimeout();
					
					// Check if application's unlocked display is shown
					if(self.application.isUnlockedDisplayShown() === true) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Inactive lock activated.'));
					}
				
					// Lock
					self.lock();
				}
			});
			
			// Document mouse move, mouse down, mouse up, key down, key up, touch start, touch move, touch end, and focus change event
			$(document).on("mousemove mousedown mouseup keydown keyup touchstart touchmove touchend" + Common.FOCUS_CHANGE_EVENT, function(event) {
			
				// Check if has focus
				if(document.hasFocus() === true)
				
					// Update last interaction timestamp
					self.updateLastInteractionTimestamp();
			
			// Document visibility change event
			}).on("visibilitychange", function() {
			
				// Check if page is hidden
				if(document["visibilityState"] === Common.VISIBILITY_STATE_HIDDEN) {
				
					// Check if lock on inactive is enabled and allowed
					if(self.enableLockOnInactive === true && self.allowInactiveLock === true) {
					
						// Reset lock timeout
						self.resetLockTimeout();
						
						// Check if application's unlocked display is shown
						if(self.application.isUnlockedDisplayShown() === true) {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Inactive lock activated.'));
						}
					
						// Lock
						self.lock();
					}
				}
			});
		}
		
		// Allow
		allow(lockType = AutomaticLock.NO_INTERACTION_LOCK_TYPE | AutomaticLock.INACTIVE_LOCK_TYPE) {
		
			// Check if allowing the no interaction lock
			if((lockType & AutomaticLock.NO_INTERACTION_LOCK_TYPE) !== 0)
			
				// Set allow no interaction lock
				this.allowNoInteractionLock = true;
			
			// Check if allowing the inactive lock
			if((lockType & AutomaticLock.INACTIVE_LOCK_TYPE) !== 0)
			
				// Set allow inactive lock
				this.allowInactiveLock = true;
			
			// Check if no interaction lock timeout minutes exist
			if(this.noInteractionLockTimeoutMinutes !== AutomaticLock.NO_NO_INTERACTION_LOCK_TIMEOUT_MINUTES) {
		
				// Check if application hasn't been interacted with in too long
				if(this.lastInteractionTimestamp <= Common.getCurrentTimestamp() - this.noInteractionLockTimeoutMinutes * Common.SECONDS_IN_A_MINUTE) {
				
					// Reset lock timeout
					this.resetLockTimeout();
				
					// Check if automatic lock is enabled and allowed
					if(this.enableAutomaticLock === true && this.allowNoInteractionLock === true) {
					
						// Check if application's unlocked display is shown
						if(this.application.isUnlockedDisplayShown() === true) {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Automatic lock activated.'));
						}
				
						// Lock
						this.lock();
					}
				}
			}
			
			// Check if lock on inactive is enabled and allowed and the document doesn't have focus or is hidden
			if(this.enableLockOnInactive === true && this.allowInactiveLock === true && (document.hasFocus() === false || document["visibilityState"] === Common.VISIBILITY_STATE_HIDDEN)) {
				
				// Reset lock timeout
				this.resetLockTimeout();
				
				// Check if application's unlocked display is shown
				if(this.application.isUnlockedDisplayShown() === true) {
				
					// Log message
					Log.logMessage(Language.getDefaultTranslation('Inactive lock activated.'));
				}
			
				// Lock
				this.lock();
			}
		}
		
		// Get allowed
		getAllowed() {
		
			// Initialize result
			var result = 0;
			
			// Check if allow no interaction lock
			if(this.allowNoInteractionLock === true) {
			
				// Set no interaction lock type in the result
				result |= AutomaticLock.NO_INTERACTION_LOCK_TYPE;
			}
			
			// Check if allow inactive lock
			if(this.allowInactiveLock === true) {
			
				// Set inactive lock type in the result
				result |= AutomaticLock.INACTIVE_LOCK_TYPE;
			}
			
			// Return result
			return result;
		}
		
		// Prevent
		prevent(lockType = AutomaticLock.NO_INTERACTION_LOCK_TYPE | AutomaticLock.INACTIVE_LOCK_TYPE) {
		
			// Check if preventing the no interaction lock
			if((lockType & AutomaticLock.NO_INTERACTION_LOCK_TYPE) !== 0)
			
				// Clear allow no interaction lock
				this.allowNoInteractionLock = false;
			
			// Check if preventing the inactive lock
			if((lockType & AutomaticLock.INACTIVE_LOCK_TYPE) !== 0)
			
				// Clear allow inactive lock
				this.allowInactiveLock = false;
		}
		
		// Is locking
		isLocking() {
		
			// Return if locking
			return this.locking === true;
		}
		
		// No interaction lock type
		static get NO_INTERACTION_LOCK_TYPE() {
		
			// Return no interaction lock type
			return 1 << 0;
		}
		
		// Inactive lock type
		static get INACTIVE_LOCK_TYPE() {
		
			// Return inactive lock type
			return 1 << 1;
		}
	
	// Private
	
		// Update last interaction timestamp
		updateLastInteractionTimestamp() {
		
			// Set last interaction timestamp to current timestamp
			this.lastInteractionTimestamp = Common.getCurrentTimestamp();
			
			// Reset lock timeout
			this.resetLockTimeout();
		}
		
		// Reset lock timeout
		resetLockTimeout() {
		
			// Check if lock timeout exists
			if(this.lockTimeout !== AutomaticLock.NO_TIMEOUT) {
			
				// Clear lock timeout
				clearTimeout(this.lockTimeout);
				
				// Set lock timeout to no timeout
				this.lockTimeout = AutomaticLock.NO_TIMEOUT;
			}
			
			// Check if no interaction lock timeout minutes exist
			if(this.noInteractionLockTimeoutMinutes !== AutomaticLock.NO_NO_INTERACTION_LOCK_TIMEOUT_MINUTES) {
			
				// Set self
				var self = this;
			
				// Set lock timeout
				this.lockTimeout = setTimeout(function() {
				
					// Reset lock timeout
					self.resetLockTimeout();
				
					// Check if automatic lock is enabled and allowed
					if(self.enableAutomaticLock === true && self.allowNoInteractionLock === true) {
					
						// Check if application's unlocked display is shown
						if(self.application.isUnlockedDisplayShown() === true) {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Automatic lock activated.'));
						}
					
						// Lock
						self.lock();
					}
				
				}, this.noInteractionLockTimeoutMinutes * Common.SECONDS_IN_A_MINUTE * Common.MILLISECONDS_IN_A_SECOND);
			}
		}
		
		// Lock
		lock() {
			
			// Check if application's unlocked display is shown, not already locking, and not currently showing a minimal display
			if(this.application.isUnlockedDisplayShown() === true && this.isLocking() === false && $("div.unlocked").hasClass("minimal") === false) {
			
				// Set locking
				this.locking = true;
			
				// Prevent showing messages
				this.message.prevent();
			
				// Show loading
				this.application.showLoading();
			
				// Show lock display
				this.application.showLockDisplay();
				
				// Set self
				var self = this;
				
				// Set timeout
				setTimeout(function() {
				
					// Clear locking
					self.locking = false;
				}, 0);
			}
		}
		
		// No timeout
		static get NO_TIMEOUT() {
		
			// Return no timeout
			return null;
		}
		
		// No no interaction lock timeout minutes
		static get NO_NO_INTERACTION_LOCK_TIMEOUT_MINUTES() {
		
			// Return no no interaction lock timeout minutes
			return null;
		}
		
		// Settings enable automatic lock name
		static get SETTINGS_ENABLE_AUTOMATIC_LOCK_NAME() {
		
			// Return settings enable automatic lock name
			return "Enable Automatic Lock";
		}
		
		// Settings enable automatic lock default value
		static get SETTINGS_ENABLE_AUTOMATIC_LOCK_DEFAULT_VALUE() {
		
			// Return settings enable automatic lock default value
			return true;
		}
		
		// Settings no interaction lock timeout minutes name
		static get SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_NAME() {
		
			// Return settings no interaction lock timeout minutes name
			return "No Interaction Lock Timeout Minutes";
		}
		
		// Settings no interaction lock timeout minutes default value
		static get SETTINGS_NO_INTERACTION_LOCK_TIMEOUT_MINUTES_DEFAULT_VALUE() {
		
			// Return settings no interaction lock timeout minutes default value
			return 5;
		}
		
		// Settings enable lock on inactive name
		static get SETTINGS_ENABLE_LOCK_ON_INACTIVE_NAME() {
		
			// Return settings enable lock on inactive name
			return "Enable Lock On Inactive";
		}
		
		// Settings enable lock on inactive default value
		static get SETTINGS_ENABLE_LOCK_ON_INACTIVE_DEFAULT_VALUE() {
		
			// Return settings enable lock on inactive default value
			return false;
		}
}


// Main function

// Set global object's automatic lock
globalThis["AutomaticLock"] = AutomaticLock;
