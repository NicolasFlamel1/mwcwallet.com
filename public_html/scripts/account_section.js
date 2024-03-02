// Use strict
"use strict";


// Classes

// Account section class
class AccountSection extends Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Delegate constructor
			super(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard);
			
			// Set self
			var self = this;
			
			// Change password button click event
			this.getDisplay().find("button.changePassword").on("click", function() {
			
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
				
				// Get current password
				var currentPassword = self.getDisplay().find("input.currentPassword").val();
				
				// Get new password
				var newPassword = self.getDisplay().find("input.newPassword").val();
				
				// Get confirm new password
				var confirmNewPassword = self.getDisplay().find("input.confirmNewPassword").val();
				
				// Show change password error
				var showChangePasswordError = function(error) {
				
					// TODO Securely clear the currentPassword, newPassword, and confirmNewPassword
				
					// Show message and allow showing messages
					self.getMessage().show(Language.getDefaultTranslation('Change Password Error'), Message.createText(error), false, function() {
					
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
				
				// Check if current password is invalid
				if(currentPassword["length"] === 0) {
				
					// Show change password error
					showChangePasswordError(Language.getDefaultTranslation('Current password is empty.'));
				}
				
				// Otherwise check if current password is incorrect
				else if(self.getWallets().isPassword(currentPassword) === false) {
				
					// Show change password error
					showChangePasswordError(Language.getDefaultTranslation('Current password is incorrect.'));
				}
				
				// Otherwise check if new password is invalid
				else if(newPassword["length"] === 0) {
				
					// Show change password error
					showChangePasswordError(Language.getDefaultTranslation('New password is empty.'));
				}
				
				// Otherwise check if confirm new password is invalid
				else if(confirmNewPassword["length"] === 0) {
				
					// Show change password error
					showChangePasswordError(Language.getDefaultTranslation('Confirm new password is empty.'));
				}
				
				// Otherwise check if new passwords don't match match
				else if(newPassword !== confirmNewPassword) {
				
					// Show change password error
					showChangePasswordError(Language.getDefaultTranslation('New passwords don\'t match.'));
				}
				
				// Otherwise
				else {
				
					// Prevent automatic lock
					self.getAutomaticLock().prevent();
					
					// Set timeout
					setTimeout(function() {
				
						// Change password
						self.getWallets().changePassword(currentPassword, newPassword).then(function() {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Changed password.'));
							
							// TODO Securely clear the currentPassword, newPassword, and confirmNewPassword
							
							// Allow automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
							
								// Show message and allow showing messages
								self.getMessage().show(Language.getDefaultTranslation('Password Changed'), Message.createText(Language.getDefaultTranslation('Your password was successfully changed.')), false, function() {
								
									// Hide loading
									self.getApplication().hideLoading();
								
								}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Check if message was displayed
									if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
										// Clear current password, new password, and confirm new password values
										self.getDisplay().find("input.currentPassword, input.newPassword, input.confirmNewPassword").val("").closest("div").parent().closest("div").removeClass("error");
										
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
									
									// Otherwise
									else {
									
										// Clear current password, new password, and confirm new password values
										self.getDisplay().find("input.currentPassword, input.newPassword, input.confirmNewPassword").val("").closest("div").parent().closest("div").removeClass("error");
									}
								});
							}
							
							// Otherwise
							else {
							
								// Clear current password, new password, and confirm new password values
								self.getDisplay().find("input.currentPassword, input.newPassword, input.confirmNewPassword").val("").closest("div").parent().closest("div").removeClass("error");
								
								// Update state and catch errors
								self.updateState().catch(function(error) {
								
								});
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Allow automatic lock
							self.getAutomaticLock().allow();
							
							// Check if automatic lock isn't locking
							if(self.getAutomaticLock().isLocking() === false) {
						
								// Show change password error
								showChangePasswordError(error);
							}
						});
					}, AccountSection.CHANGE_PASSWORD_DELAY_MILLISECONDS);
				}
			});
			
			// Current password, new password, or confirm new password key down event
			this.getDisplay().find("input.currentPassword, input.newPassword, input.confirmNewPassword").on("keydown", function(event) {
			
				// Check if enter was pressed
				if(event["which"] === "\r".charCodeAt(0)) {
				
					// Get input
					var input = $(this);
				
					// Get input's display
					var display = input.closest("div").parent().closest("div");
				
					// Check if display doesn't show an error
					if(display.hasClass("error") === false) {
				
						// Trigger click on change password button
						self.getDisplay().find("button.changePassword").trigger("click");
					}
				}
			
			// Current password, new password, or confirm new password input event
			}).on("input", function() {
			
				// Get input
				var input = $(this);
				
				// Check if input has focus
				if(input.is(":focus") === true) {
				
					// Get input's display
					var display = input.closest("div").parent().closest("div");
					
					// Get input's value
					var value = input.val();
					
					// Check if value doesn't exist
					if(value["length"] === 0) {
					
						// Set that display shows an error
						display.addClass("error");
					
						// Return
						return;
					}
					
					// Check if input is current password
					if(input.hasClass("currentPassword") === true) {
					
						// Check if value isn't the current password
						if(self.getWallets().isPassword(value) === false) {
						
							// Set that display shows an error
							display.addClass("error");
						
							// Return
							return;
						}
					}
					
					// Otherwise check if input is the new password
					else if(input.hasClass("newPassword") === true) {
					
						// Check if value isn't the confirm new password
						if(value === self.getDisplay().find("input.confirmNewPassword").val()) {
						
							// Set that confirm new password's display doesn't show an error
							self.getDisplay().find("input.confirmNewPassword").closest("div").parent().closest("div").removeClass("error");
						}
						
						// Otherwise check if confirm new password exists
						else if(self.getDisplay().find("input.confirmNewPassword").val()["length"] !== 0) {
						
							// Set that confirm new password's display doesn't shows an error
							self.getDisplay().find("input.confirmNewPassword").closest("div").parent().closest("div").addClass("error");
						}
					}
					
					// Otherwise check if input is the confirm new password
					else if(input.hasClass("confirmNewPassword") === true) {
					
						// Check if value isn't the new password
						if(value !== self.getDisplay().find("input.newPassword").val()) {
						
							// Set that display shows an error
							display.addClass("error");
						
							// Return
							return;
						}
					}
					
					// Set that display doesn't shows an error
					display.removeClass("error");
				}
			
			// Current password, new password, or confirm new password focus event
			}).on("focus", function() {
			
				// Get input
				var input = $(this);
				
				// Get input's display
				var display = input.closest("div").parent().closest("div");
			
				// Check if display isn't disabled
				if(display.hasClass("disabled") === false) {
				
					// Trigger input event
					input.trigger("input");
				}
			
			// Current password, new password, or confirm new password blur event
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
			});
			
			// Show click event
			this.getDisplay().find("span.show").on("click", function(event) {
			
				// Get target
				var target = $(this);
				
				// Get input
				var input = target.siblings("input");
				
				// Check if input isn't disabled
				if(input.is(":disabled") === false) {
				
					// Save input selection
					var savedSelectionStart = input.get(0)["selectionStart"];
					var savedSelectionEnd = input.get(0)["selectionEnd"];
					var savedSelectionDirection = input.get(0)["selectionDirection"];
					
					// Check if concealing password
					if(target.hasClass("conceal") === true) {
					
						// Set title
						var title = Language.getDefaultTranslation('Show');
					
						// Show reveal icon and set title
						target.removeClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
						
						// Change password input type
						input.attr("type", "password");
					}
					
					// Otherwise
					else {
					
						// Set title
						var title = Language.getDefaultTranslation('Hide');
					
						// Show conceal icon and set title
						target.addClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
						
						// Change password input type
						input.attr("type", "text");
					}
					
					// Request animation frame
					requestAnimationFrame(function() {
					
						// Save focus and don't blur
						self.getFocus().save(false);
					
						// Restore input selection
						input.get(0).setSelectionRange(savedSelectionStart, savedSelectionEnd, savedSelectionDirection);
						
						// Restore focus and blur if it doesn't exist
						self.getFocus().restore(true);
					});
				}
			
			// Show mouse down event
			}).on("mousedown", function(event) {
			
				// Get target
				var target = $(this);
				
				// Check if target's input has focus
				if(target.siblings("input").is(":focus") === true) {
			
					// Prevent stealing focus
					event.preventDefault();
					
					// Trigger focus change event
					target.trigger(Common.FOCUS_CHANGE_EVENT);
				}
			});
			
			// Delete all wallets button click event
			this.getDisplay().find("button.deleteAllWallets").on("click", function() {
			
				// Get button
				var button = $(this);
				
				// Set that button is clicked
				button.addClass("clicked");

				// Show message
				self.getMessage().show(Language.getDefaultTranslation('Delete All Wallets'), Message.createText(Language.getDefaultTranslation('Are you sure you want to delete all your wallets?')) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('Each wallet can only be recovered by using its passphrase or hardware wallet once it\'s been deleted.')) + "</b>", false, function() {
				
					// Save focus and blur
					self.getFocus().save(true);
					
					// Disable unlocked
					self.getUnlocked().disable();
				
				}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_UNLOCKED, true).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if deleting all wallets
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
							
								// Remove all wallets
								self.getWallets().removeAllWallets().then(function() {
								
									// Set that button isn't clicked
									button.removeClass("clicked");
								
									// Delete focus
									self.getFocus().delete();
								
									// Show create display
									self.getApplication().showCreateDisplay();
								
								// Catch errors
								}).catch(function(error) {
								
									// Allow automatic lock
									self.getAutomaticLock().allow();
									
									// Check if automatic lock isn't locking
									if(self.getAutomaticLock().isLocking() === false) {
								
										// Show message and allow showing messages
										self.getMessage().show(Language.getDefaultTranslation('Delete All Wallets Error'), Message.createText(error), true, function() {
										
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
							}, Application.DELETE_ALL_WALLETS_DELAY_MILLISECONDS);
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
		}
		
		// Get name
		getName() {
		
			// Return name
			return AccountSection.NAME;
		}
		
		// Reset
		reset() {
		
			// Reset
			super.reset();
			
			// Clear change password's current password, new password, and confirm new password an set their type to password and make them not showing errors
			this.getDisplay().find("input.currentPassword, input.newPassword, input.confirmNewPassword").val("").attr("type", "password").closest("div").parent().closest("div").removeClass("error");

			// Set that buttons aren't clicked or loading
			this.getDisplay().find("button").removeClass("clicked loading");
		}
		
		// Name
		static get NAME() {
		
			// Return name
			return "Account";
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
				
					// Set title
					var title = Language.getDefaultTranslation('Show');
					
					// Show current password show icon, set its title, and change password input type
					self.getDisplay().find("input.currentPassword").siblings("span.show").removeClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title)).siblings("input").attr("type", "password");
					
					// Show new password show icon, set its title, and change password input type
					self.getDisplay().find("input.newPassword").siblings("span.show").removeClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title)).siblings("input").attr("type", "password");
					
					// Show confirm new password show icon, set its title, and change password input type
					self.getDisplay().find("input.confirmNewPassword").siblings("span.show").removeClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title)).siblings("input").attr("type", "password");
			
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
			return Language.getDefaultTranslation('Account Error');
		}
		
		// Change password delay milliseconds
		static get CHANGE_PASSWORD_DELAY_MILLISECONDS() {
		
			// Return change password delay milliseconds
			return 300;
		}
}


// Main function

// Set global object's account section
globalThis["AccountSection"] = AccountSection;
