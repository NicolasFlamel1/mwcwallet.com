// Use strict
"use strict";


// Classes

// Application class
class Application {

	// Public
	
		// Constructor
		constructor() {
		
			// Get body display
			this.bodyDisplay = $("body");
			
			// Get main display
			this.mainDisplay = $("main");
		
			// Get locked display
			this.lockedDisplay = $("div.locked");
			
			// Get unlocked display
			this.unlockedDisplay = $("div.unlocked");
		
			// Get loading display
			this.loadingDisplay = this.lockedDisplay.find("div.loading");
			
			// Get create display
			this.createDisplay = this.lockedDisplay.find("div.create");
			
			// Get unlock display
			this.unlockDisplay = this.lockedDisplay.find("div.unlock");
			
			// Get status display
			this.statusDisplay = this.unlockDisplay.find("div.status");
			
			// Get info display
			this.infoDisplay = this.lockedDisplay.find("div.info");
			
			// Create settings
			this.settings = new Settings();
			
			// Create focus
			this.focus = new Focus();
			
			// Create clipboard
			this.clipboard = new Clipboard();
			
			// Create message
			this.message = new Message(this, this.focus, this.clipboard);
			
			// Create caps lock
			this.capsLock = new CapsLock();
			
			// Create Tor proxy
			this.torProxy = new TorProxy(this.settings);
			
			// Create node
			this.node = new Node(this.torProxy, this.settings);
			
			// Create listener
			this.listener = new Listener(this.settings);
			
			// Create transactions
			this.transactions = new Transactions();
			
			// Create prices
			this.prices = new Prices(this.settings);
		
			// Create wallets
			this.wallets = new Wallets(this.torProxy, this.node, this.listener, this.settings, this, this.message, this.transactions, this.prices);
			
			// Create version
			this.version = new Version(this, this.message);
			
			// Create maintenance notification
			this.maintenanceNotification = new MaintenanceNotification();
			
			// Create cookie acceptance
			this.cookieAcceptance = new CookieAcceptance();
			
			// Create automatic lock
			this.automaticLock = new AutomaticLock(this, this.message, this.settings);
			
			// Create install app
			this.installApp = new InstallApp(this.cookieAcceptance, this.automaticLock);
			
			// Create service worker installer
			this.serviceWorkerInstaller = new ServiceWorkerInstaller(this.version);
			
			// Create wake lock
			this.wakeLock = new WakeLock();
			
			// Create logo
			this.logo = new Logo(this, this.message, this.wakeLock);
			
			// Create sections
			this.sections = new Sections(this.settings, this.message, this.version);
			
			// Create scroll
			this.scroll = new Scroll();
			
			// Create unlocked
			this.unlocked = new Unlocked(this, this.bodyDisplay, this.unlockedDisplay, this.settings, this.message, this.focus, this.wallets, this.node, this.listener, this.automaticLock, this.transactions, this.sections, this.scroll, this.wakeLock, this.clipboard, this.prices);
			
			// Set node incompatible message shown
			this.nodeIncompatibleMessageShown = false;
			
			// Set node invalid response message shown
			this.nodeInvalidResponseMessageShown = false;
			
			// Set node unauthorized response message shown
			this.nodeUnauthorizedResponseMessageShown = false;
			
			// Set node connection message shown
			this.nodeConnectionMessageShown = false;
			
			// Set listener connection message shown
			this.listenerConnectionMessageShown = false;
			
			// Set ignore updates
			this.ignoreUpdates = false;
			
			// Set enable node connection error messages to setting's default value
			this.enableNodeConnectionErrorMessages = Application.SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_DEFAULT_VALUE;
			
			// Set enable listener connection error messages to setting's default value
			this.enableListenerConnectionErrorMessages = Application.SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_DEFAULT_VALUE;
			
			// Set reset settings
			this.resetSettings = false;
			
			// Set unlocked at least once
			this.unlockedAtLeastOnce = false;
			
			// Set protocol handler registered
			this.protocolHandlerRegistered = false;
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Enable node connection error messages setting
						self.settings.createValue(Application.SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_NAME, Application.SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_DEFAULT_VALUE),
						
						// Enable listener connection error messages setting
						self.settings.createValue(Application.SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_NAME, Application.SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_DEFAULT_VALUE)
					
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Enable node connection error messages setting
							Application.SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_NAME,
							
							// Enable listener connection error messages setting
							Application.SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set enable node connection error messages to setting's value
							self.enableNodeConnectionErrorMessages = settingValues[settings.indexOf(Application.SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_NAME)];
							
							// Set enable listener connection error messages to setting's value
							self.enableListenerConnectionErrorMessages = settingValues[settings.indexOf(Application.SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_NAME)];
						
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
				
					// Enable node connection error messages setting
					case Application.SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_NAME:
					
						// Set enable node connection error messages to setting's value
						self.enableNodeConnectionErrorMessages = setting[Settings.DATABASE_VALUE_NAME];
					
						// Break
						break;
					
					// Enable listener connection error messages setting
					case Application.SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_NAME:
					
						// Set enable listener connection error messages to setting's value
						self.enableListenerConnectionErrorMessages = setting[Settings.DATABASE_VALUE_NAME];
					
						// Break
						break;
				}
			});
			
			// Check if is an extension
			if(Common.isExtension() === true) {
			
				// Document extension request receive event
				$(document).on(Extension.REQUEST_RECEIVE_EVENT, function() {
				
					// Check if an extension request exists, unlocked display is shown, a message isn't shown, not showing loading, unlocked isn't disabled, unlocked display isn't showing minimal display, automatic lock isn't disabled, automatic lock isn't locking, and message isn't disabled
					if(Extension.getRequests()["length"] !== 0 && self.isUnlockedDisplayShown() === true && self.message.isShown() === false && self.isShowingLoading() === false && self.unlocked.isDisabled() === false && self.unlockedDisplay.hasClass("minimal") === false && self.automaticLock.getAllowed() === (AutomaticLock.NO_INTERACTION_LOCK_TYPE | AutomaticLock.INACTIVE_LOCK_TYPE) && self.automaticLock.isLocking() === false && self.message.getAllowed() === true) {
						
						// Show current section and catch errors
						self.sections.showCurrentSection(false).catch(function(error) {
						
						});
					}
				});
				
				// Set interval
				setInterval(function() {
				
					// Check if an extension request exists, unlocked display is shown, a message isn't shown, not showing loading, unlocked isn't disabled, unlocked display isn't showing minimal display, automatic lock isn't disabled, automatic lock isn't locking, and message isn't disabled
					if(Extension.getRequests()["length"] !== 0 && self.isUnlockedDisplayShown() === true && self.message.isShown() === false && self.isShowingLoading() === false && self.unlocked.isDisabled() === false && self.unlockedDisplay.hasClass("minimal") === false && self.automaticLock.getAllowed() === (AutomaticLock.NO_INTERACTION_LOCK_TYPE | AutomaticLock.INACTIVE_LOCK_TYPE) && self.automaticLock.isLocking() === false && self.message.getAllowed() === true) {
						
						// Show current section and catch errors
						self.sections.showCurrentSection(false).catch(function(error) {
						
						});
					}
				
				}, Application.CHECK_EXTENSION_REQUEST_RECEIVED_INTERVAL_MILLISECONDS);
			}
			
			// Window context menu event
			$(window).on("contextmenu", function(event) {
			
				// Check if is an app
				if(Common.isApp() === true) {
				
					// Get element
					var element = $(event["target"]);
			
					// Check if element isn't a radio input or a link and doesn't allow the context menu
					if((element.is("input") === false || element.attr("type") === "radio") && element.is("a") === false && element.hasClass("contextMenu") === false)
					
						// Prevent default
						event.preventDefault();
				}
			
			// Window device orientation change event
			}).on("orientationchange", function() {
			
				// Check if is an app
				if(Common.isApp() === true) {
				
					// Trigger a resize event
					$(window).trigger("resize");
				}
			
			// Window resize event
			}).on("resize", function() {
			
				// Check if not an app
				if(Common.isApp() === false) {
				
					// Scroll to origin
					$(window).scrollTop(0);
					
					// Set timeout
					setTimeout(function() {
					
						// Scroll back to origin to prevent minimal interface mode
						$(window).scrollTop(1);
						$(window).scrollTop(0);
					
					}, Application.PREVENT_MINIMAL_INTERFACE_DELAY_MILLISECONDS);
				}
				
				// Trigger transition end event on unlock display delete all wallets button
				self.unlockDisplay.find("div.deleteAllWallets").children().trigger("transitionend");
			
			// Window page show event
			}).on("pageshow", function(event) {
			
				// Check if page was loaded form cache
				if(event["originalEvent"]["persisted"] === true) {
				
					// Show loading
					self.showLoading();
					
					// Prevent extension from interrupting on close
					Extension.preventInterruptOnClose();
				
					// Reload page
					location.reload();
				}
			
			// Window before unload event
			}).on("beforeunload", function() {
			
				// Prevent showing messages
				self.message.prevent();
				
				// Lock wallets
				self.wallets.lock();
			
				// Check if unlocked display is shown
				if(self.isUnlockedDisplayShown() === true) {
				
					// Show loading
					self.showLoading();
					
					// Disable unlocked
					self.unlocked.disable();
					
					// Prevent automatic lock
					self.automaticLock.prevent();
					
					// Check if message is shown
					if(self.message.isShown() === true) {
					
						// Hide message and uninitialize
						self.message.hide(true);
					}
					
					// Otherwise
					else {
					
						// Uninitialize message
						self.message.uninitialize();
					}
					
					// Hide language display
					$("div.language").addClass("hide normalTransitionSpeed");
				
					// Hide unlocked display children
					self.unlockedDisplay.children().addClass("hide");
					
					// Unlocked display children transition end or timeout event
					self.unlockedDisplay.children().transitionEndOrTimeout(function() {
					
						// Hide unlocked display
						self.unlockedDisplay.addClass("hide");
						
						// Hide loading
						self.hideLoading();
						
						// Enable unlocked
						self.unlocked.enable();
						
						// Reset unlocked
						self.unlocked.reset();
						
					}, "opacity");
				}
				
				// Otherwise
				else {
				
					// Check if message is shown
					if(self.message.isShown() === true) {
					
						// Hide message and uninitialize
						self.message.hide(true);
					}
					
					// Otherwise
					else {
					
						// Uninitialize message
						self.message.uninitialize();
					}
				}
			
			// Window unload event
			}).on("unload", function() {
			
				// Uninitialize dependencies
				self.uninitializeDependencies();
			});
			
			// Document mouse down and focus change event
			$(document).on("mousedown " + Common.FOCUS_CHANGE_EVENT, function(event) {
			
				// Check if event isn't mouse down or the primary pointer button was pressed and the focused element isn't an input element
				if((event["type"] !== "mousedown" || (event["buttons"] & Common.PRIMARY_POINTER_BUTTON_BITMASK) !== 0) && $(":focus").is("input") === false) {
			
					// Remove selection
					Focus.removeSelection();
				}
			
			// Document key down application event
			}).on("keydown.application", function(event) {
			
				// Check if shift was pressed
				if(event["which"] === Application.SHIFT_KEY_CODE) {
				
					// Turn off document key down application event
					$(document).off("keydown.application");
				
					// Set reset settings
					self.resetSettings = true;
				}
			});
			
			// Node connection open event
			$(this.node).on(Node.CONNECTION_OPEN_EVENT, function() {
			
				// Get node status display
				var nodeStatusDisplay = self.statusDisplay.find("p.node");
			
				// Set that node status display shows success
				nodeStatusDisplay.removeClass("warning").addClass("success");
				
				// Set title
				var title = Language.getDefaultTranslation('Node connected');
			
				// Set node status display's title
				nodeStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
				
				// Turn off node connection warning application event
				$(self.node).off(Node.CONNECTION_WARNING_EVENT + ".application");
				
				// Turn off node connection close application event
				$(self.node).off(Node.CONNECTION_CLOSE_EVENT + ".application");
				
				// Clear node connection message shown
				self.nodeConnectionMessageShown = false;
			
			// Node connection warning event
			}).on(Node.CONNECTION_WARNING_EVENT, function(event, warningType) {
			
				// Get node status display
				var nodeStatusDisplay = self.statusDisplay.find("p.node");
			
				// Set that node status display shows warning
				nodeStatusDisplay.removeClass("success").addClass("warning");
				
				// Set title
				var title = Language.getDefaultTranslation('Node warning');
			
				// Set node status display's title
				nodeStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
				
				// Turn off node connection close application event
				$(self.node).off(Node.CONNECTION_CLOSE_EVENT + ".application");
				
				// Check if warning is because node isn't compatible and node incompatible message hasn't been shown
				if(warningType === Node.INCOMPATIBLE_WARNING_TYPE && self.nodeIncompatibleMessageShown === false) {
				
					// Check if showing node connection error messages is enabled
					if(self.enableNodeConnectionErrorMessages === true) {
			
						// Show message
						self.message.show(Language.getDefaultTranslation('Node Error'), Message.createText(Language.getDefaultTranslation('The node isn\'t compatible. The node\'s version must be version %1$v or newer.'), [
						
							// Minimum compatible node version
							Node.MINIMUM_COMPATIBLE_NODE_VERSION
						
						]), false, function() {
						
							// Check if node incompatible message hasn't been shown and the node status is showing a warning
							if(self.nodeIncompatibleMessageShown === false && nodeStatusDisplay.hasClass("warning") === true) {
							
								// Set node incompatible message shown
								self.nodeIncompatibleMessageShown = true;
						
								// Save focus and blur
								self.focus.save(true);
								
								// Check if create display is shown
								if(self.isCreateDisplayShown() === true)
								
									// Disable tabbing to everything in create display and disable everything in create display
									self.createDisplay.find("*").disableTab().disable();
								
								// Otherwise check if unlock display is shown
								else if(self.isUnlockDisplayShown() === true)
								
									// Disable tabbing to everything in unlock display and disable everything in unlock display
									self.unlockDisplay.find("*").disableTab().disable();
								
								// Otherwise check if unlocked display is shown
								else if(self.isUnlockedDisplayShown() === true)
								
									// Disable unlocked
									self.unlocked.disable();
								
								// Node connection open application node incompatible warning event
								$(self.node).one(Node.CONNECTION_OPEN_EVENT + ".applicationNodeIncompatibleWarning", function() {
								
									// Check if create display is shown
									if(self.isCreateDisplayShown() === true)
								
										// Enable tabbing to everything in create display and enable everything in create display
										self.createDisplay.find("*").enableTab().enable();
									
									// Otherwise check if unlock display is shown
									else if(self.isUnlockDisplayShown() === true)
									
										// Enable tabbing to everything in unlock display and enable everything in unlock display
										self.unlockDisplay.find("*").enableTab().enable();
							
									// Otherwise check if unlocked display is shown
									else if(self.isUnlockedDisplayShown() === true)
									
										// Enable unlocked
										self.unlocked.enable();
									
									// Restore focus and don't blur
									self.focus.restore(false);
									
									// Hide message
									self.message.hide();
								});
							}
							
							// Otherwise
							else {
							
								// Return false
								return false;
							}
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
						
							// Turn off node connection open application node incompatible warning event
							$(self.node).off(Node.CONNECTION_OPEN_EVENT + ".applicationNodeIncompatibleWarning");
							
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
							
								// Check if create display is shown
								if(self.isCreateDisplayShown() === true)
							
									// Enable tabbing to everything in create display and enable everything in create display
									self.createDisplay.find("*").enableTab().enable();
								
								// Otherwise check if unlock display is shown
								else if(self.isUnlockDisplayShown() === true)
								
									// Enable tabbing to everything in unlock display and enable everything in unlock display
									self.unlockDisplay.find("*").enableTab().enable();
						
								// Otherwise check if unlocked display is shown
								else if(self.isUnlockedDisplayShown() === true)
								
									// Enable unlocked
									self.unlocked.enable();
								
								// Restore focus and don't blur
								self.focus.restore(false);
								
								// Hide message
								self.message.hide();
							}
						});
					}
				}
				
				// Otherwise check if warning is because node returned in invalid response and node invalid response message hasn't been shown
				else if(warningType === Node.INVALID_RESPONSE_WARNING_TYPE && self.nodeInvalidResponseMessageShown === false) {
				
					// Node connection warning application event
					$(self.node).one(Node.CONNECTION_WARNING_EVENT + ".application", function(event, warningType) {
					
						// Check if warning is because node returned in invalid response and node invalid response message hasn't been shown
						if(warningType === Node.INVALID_RESPONSE_WARNING_TYPE && self.nodeInvalidResponseMessageShown === false) {
				
							// Check if showing node connection error messages is enabled
							if(self.enableNodeConnectionErrorMessages === true) {
							
								// Show message
								self.message.show(Language.getDefaultTranslation('Node Error'), Message.createText(Language.getDefaultTranslation('The node returned an invalid response.')), false, function() {
								
									// Check if node invalid response message hasn't been shown and the node status is showing a warning
									if(self.nodeInvalidResponseMessageShown === false && nodeStatusDisplay.hasClass("warning") === true) {
									
										// Set node invalid response message shown
										self.nodeInvalidResponseMessageShown = true;
								
										// Save focus and blur
										self.focus.save(true);
										
										// Check if create display is shown
										if(self.isCreateDisplayShown() === true)
										
											// Disable tabbing to everything in create display and disable everything in create display
											self.createDisplay.find("*").disableTab().disable();
										
										// Otherwise check if unlock display is shown
										else if(self.isUnlockDisplayShown() === true)
										
											// Disable tabbing to everything in unlock display and disable everything in unlock display
											self.unlockDisplay.find("*").disableTab().disable();
										
										// Otherwise check if unlocked display is shown
										else if(self.isUnlockedDisplayShown() === true)
										
											// Disable unlocked
											self.unlocked.disable();
										
										// Node connection open application node invalid response warning event
										$(self.node).one(Node.CONNECTION_OPEN_EVENT + ".applicationNodeInvalidResponseWarning", function() {
										
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
										
												// Enable tabbing to everything in create display and enable everything in create display
												self.createDisplay.find("*").enableTab().enable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
											
											// Hide message
											self.message.hide();
										});
									}
									
									// Otherwise
									else {
									
										// Return false
										return false;
									}
								
								}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Turn off node connection open application node invalid response warning event
									$(self.node).off(Node.CONNECTION_OPEN_EVENT + ".applicationNodeInvalidResponseWarning");
									
									// Check if message was displayed
									if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
										// Check if create display is shown
										if(self.isCreateDisplayShown() === true)
									
											// Enable tabbing to everything in create display and enable everything in create display
											self.createDisplay.find("*").enableTab().enable();
										
										// Otherwise check if unlock display is shown
										else if(self.isUnlockDisplayShown() === true)
										
											// Enable tabbing to everything in unlock display and enable everything in unlock display
											self.unlockDisplay.find("*").enableTab().enable();
								
										// Otherwise check if unlocked display is shown
										else if(self.isUnlockedDisplayShown() === true)
										
											// Enable unlocked
											self.unlocked.enable();
										
										// Restore focus and don't blur
										self.focus.restore(false);
										
										// Hide message
										self.message.hide();
									}
								});
							}
						}
					});
				}
				
				// Otherwise check if warning is because node returned an unauthorized response and node unauthorized response message hasn't been shown
				else if(warningType === Node.UNAUTHORIZED_WARNING_TYPE && self.nodeUnauthorizedResponseMessageShown === false) {
				
					// Check if showing node connection error messages is enabled
					if(self.enableNodeConnectionErrorMessages === true) {
					
						// Check if node's secret doesn't exist
						if(self.node.getSecret() === Node.NO_SECRET) {
						
							// Set message
							var message = Message.createText(Language.getDefaultTranslation('The node returned an unauthorized response.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('The node may require a foreign API secret.'));
						}
						
						// Otherwise
						else {
						
							// Set message
							var message = Message.createText(Language.getDefaultTranslation('The node returned an unauthorized response.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the node\'s foreign API secret is correct.'));
						}
					
						// Show message
						self.message.show(Language.getDefaultTranslation('Node Error'), message, false, function() {
						
							// Check if node unauthorized response message hasn't been shown and the node status is showing a warning
							if(self.nodeUnauthorizedResponseMessageShown === false && nodeStatusDisplay.hasClass("warning") === true) {
							
								// Set node unauthorized response message shown
								self.nodeUnauthorizedResponseMessageShown = true;
						
								// Save focus and blur
								self.focus.save(true);
								
								// Check if create display is shown
								if(self.isCreateDisplayShown() === true)
								
									// Disable tabbing to everything in create display and disable everything in create display
									self.createDisplay.find("*").disableTab().disable();
								
								// Otherwise check if unlock display is shown
								else if(self.isUnlockDisplayShown() === true)
								
									// Disable tabbing to everything in unlock display and disable everything in unlock display
									self.unlockDisplay.find("*").disableTab().disable();
								
								// Otherwise check if unlocked display is shown
								else if(self.isUnlockedDisplayShown() === true)
								
									// Disable unlocked
									self.unlocked.disable();
								
								// Node connection open application node unauthorized response warning event
								$(self.node).one(Node.CONNECTION_OPEN_EVENT + ".applicationNodeIUnauthorizedResponseWarning", function() {
								
									// Check if create display is shown
									if(self.isCreateDisplayShown() === true)
								
										// Enable tabbing to everything in create display and enable everything in create display
										self.createDisplay.find("*").enableTab().enable();
									
									// Otherwise check if unlock display is shown
									else if(self.isUnlockDisplayShown() === true)
									
										// Enable tabbing to everything in unlock display and enable everything in unlock display
										self.unlockDisplay.find("*").enableTab().enable();
							
									// Otherwise check if unlocked display is shown
									else if(self.isUnlockedDisplayShown() === true)
									
										// Enable unlocked
										self.unlocked.enable();
									
									// Restore focus and don't blur
									self.focus.restore(false);
									
									// Hide message
									self.message.hide();
								});
							}
							
							// Otherwise
							else {
							
								// Return false
								return false;
							}
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
						
							// Turn off node connection open application node unauthorized response warning event
							$(self.node).off(Node.CONNECTION_OPEN_EVENT + ".applicationNodeIUnauthorizedResponseWarning");
							
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
							
								// Check if create display is shown
								if(self.isCreateDisplayShown() === true)
							
									// Enable tabbing to everything in create display and enable everything in create display
									self.createDisplay.find("*").enableTab().enable();
								
								// Otherwise check if unlock display is shown
								else if(self.isUnlockDisplayShown() === true)
								
									// Enable tabbing to everything in unlock display and enable everything in unlock display
									self.unlockDisplay.find("*").enableTab().enable();
						
								// Otherwise check if unlocked display is shown
								else if(self.isUnlockedDisplayShown() === true)
								
									// Enable unlocked
									self.unlocked.enable();
								
								// Restore focus and don't blur
								self.focus.restore(false);
								
								// Hide message
								self.message.hide();
							}
						});
					}
				}
			
			// Node connection close event
			}).on(Node.CONNECTION_CLOSE_EVENT, function(event, closeType) {
			
				// Get node status display
				var nodeStatusDisplay = self.statusDisplay.find("p.node");
			
				// Set that node status display shows error
				nodeStatusDisplay.removeClass("warning success");
				
				// Set title
				var title = Language.getDefaultTranslation('Node disconnected');
			
				// Set node status display's title
				nodeStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
				
				// Turn off node connection warning application event
				$(self.node).off(Node.CONNECTION_WARNING_EVENT + ".application");
				
				// Check if close is because couldn't connect to node and node connection message hasn't been shown or the close is because the connection to the node was disconnected
				if((closeType === Node.NO_CONNECTION_CLOSE_TYPE && self.nodeConnectionMessageShown === false) || closeType === Node.DISCONNECTED_CLOSE_TYPE) {
				
					// Node connection close application event
					$(self.node).one(Node.CONNECTION_CLOSE_EVENT + ".application", function() {
					
						// Check if close is because couldn't connect to node and node connection message hasn't been shown or the close is because the connection to the node was disconnected
						if((closeType === Node.NO_CONNECTION_CLOSE_TYPE && self.nodeConnectionMessageShown === false) || closeType === Node.DISCONNECTED_CLOSE_TYPE) {
				
							// Check if showing node connection error messages is enabled
							if(self.enableNodeConnectionErrorMessages === true) {
							
								// Check if close is because couldn't connect to node
								if(closeType === Node.NO_CONNECTION_CLOSE_TYPE) {
								
									// Check if using a custom node
									if(self.node.usingCustomNode() === true) {
									
										// Check if node's address exists
										if(self.node.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0]["length"] !== 0) {
								
											// Check if not an extension and the page is connected to securely
											if(Common.isExtension() === false && (location["protocol"] === Common.HTTPS_PROTOCOL || Tor.isOnionService() === true)) {
											
												// Initialize error occurred
												var errorOccurred = false;
												
												// Get URL as the node's first address
												var url = self.node.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0];
												
												// Try
												try {
										
													// Parse URL
													var parsedUrl = new URL(url);
												}
												
												// Catch errors
												catch(error) {
												
													// Set error occurred
													errorOccurred = true;
												}
												
												// Check if an error didn't occur
												if(errorOccurred === false) {
												
													// Check if node will be connected to insecurely
													if(parsedUrl["protocol"] === Common.HTTP_PROTOCOL && Tor.isTorUrl(url) === false) {
													
														// Check if is an app
														if(Common.isApp() === true) {
													
															// Set message with insecure content information
															var message = Message.createText(Language.getDefaultTranslation('Connecting to the node failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Some browsers don\'t allow connecting to content that is served insecurely from an app that is served securely.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to specify a node address that is served over HTTPS or as an Onion Service to connect to the node.'));
														}
														
														// Otherwise
														else {
														
															// Set message with insecure content information
															var message = Message.createText(Language.getDefaultTranslation('Connecting to the node failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Some browsers don\'t allow connecting to content that is served insecurely from a site that is served securely.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to specify a node address that is served over HTTPS or as an Onion Service to connect to the node.'));
														}
													}
												}
											}
										}
										
										// Otherwise
										else {
										
											// Set message
											var message = Message.createText(Language.getDefaultTranslation('A node address hasn\'t been provided.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.'));
										}
									}
									
									// Check if a message hasn't been set
									if(typeof message === "undefined") {
									
										// Check if using a custom node
										if(self.node.usingCustomNode() === true) {
										
											// Check if using a custom Tor proxy
											if(self.torProxy.usingCustomTorProxy() === true) {
											
												// Initialize error occurred
												var errorOccurred = false;
												
												// Get URL as the node's first address
												var url = self.node.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0];
												
												// Try
												try {
										
													// Parse URL
													var parsedUrl = new URL(url);
												}
												
												// Catch errors
												catch(error) {
												
													// Set error occurred
													errorOccurred = true;
												}
												
												// Check if an error didn't occur
												if(errorOccurred === false) {
												
													// Check if Tor proxy was used to connect to the node
													if(Tor.isTorUrl(url) === true && Tor.isSupported() === false) {
													
														// Check if Tor proxy isn't set
														if(self.torProxy.getAddress()["length"] === 0) {
														
															// Set message
															var message = Message.createText(Language.getDefaultTranslation('Connecting to the node failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You\'ll need to provide a Tor proxy address to connect to the node.'));
														}
														
														// Otherwise
														else {
													
															// Set message
															var message = Message.createText(Language.getDefaultTranslation('Connecting to the node failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to specify a different Tor proxy address to connect to the node.'));
														}
													}
												}
											}
											
											// Check if a message hasn't been set
											if(typeof message === "undefined") {
											
												// Set message
												var message = Message.createText(Language.getDefaultTranslation('Connecting to the node failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.'));
											}
										}
									}
									
									// Check if a message hasn't been set
									if(typeof message === "undefined") {
									
										// Set message
										var message = Message.createText(Language.getDefaultTranslation('Connecting to a node failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.'));
									}
					
									// Show message
									self.message.show(Language.getDefaultTranslation('Node Error'), message, false, function() {
									
										// Check if node connection message hasn't been shown and the node status isn't showing a warning or success
										if(self.nodeConnectionMessageShown === false && nodeStatusDisplay.hasClass("warning") === false && nodeStatusDisplay.hasClass("success") === false) {
										
											// Set node connection message shown
											self.nodeConnectionMessageShown = true;
									
											// Save focus and blur
											self.focus.save(true);
											
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
											
												// Disable tabbing to everything in create display and disable everything in create display
												self.createDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Disable tabbing to everything in unlock display and disable everything in unlock display
												self.unlockDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Disable unlocked
												self.unlocked.disable();
											
											// Node connection open application node no connection error event
											$(self.node).one(Node.CONNECTION_OPEN_EVENT + ".applicationNodeNoConnectionError", function() {
											
												// Check if create display is shown
												if(self.isCreateDisplayShown() === true)
											
													// Enable tabbing to everything in create display and enable everything in create display
													self.createDisplay.find("*").enableTab().enable();
												
												// Otherwise check if unlock display is shown
												else if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
												
												// Hide message
												self.message.hide();
											});
										}
										
										// Otherwise
										else {
										
											// Return false
											return false;
										}
									
									}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
									
										// Node connection open application node no connection error event
										$(self.node).off(Node.CONNECTION_OPEN_EVENT + ".applicationNodeNoConnectionError");
										
										// Check if message was displayed
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
										
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
										
												// Enable tabbing to everything in create display and enable everything in create display
												self.createDisplay.find("*").enableTab().enable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
											
											// Hide message
											self.message.hide();
										}
									});
								}
								
								// Otherwise check if close is because connection to node was disconnected
								else if(closeType === Node.DISCONNECTED_CLOSE_TYPE) {
								
									// Check if using a custom node
									if(self.node.usingCustomNode() === true) {
									
										// Check if using a custom Tor proxy
										if(self.torProxy.usingCustomTorProxy() === true) {
										
											// Initialize error occurred
											var errorOccurred = false;
											
											// Get URL as the node's first address
											var url = self.node.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0];
											
											// Try
											try {
									
												// Parse URL
												var parsedUrl = new URL(url);
											}
											
											// Catch errors
											catch(error) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if Tor proxy was used to connect to the node
												if(Tor.isTorUrl(url) === true && Tor.isSupported() === false) {
												
													// Check if Tor proxy isn't set
													if(self.torProxy.getAddress()["length"] === 0) {
													
														// Set message
														var message = Message.createText(Language.getDefaultTranslation('You\'re no longer connected to the node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You\'ll need to provide a Tor proxy address to connect to the node.'));
													}
													
													// Otherwise
													else {
												
														// Set message
														var message = Message.createText(Language.getDefaultTranslation('You\'re no longer connected to the node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to specify a different Tor proxy address to connect to the node.'));
													}
												}
											}
										}
										
										// Check if a message hasn't been set
										if(typeof message === "undefined") {
										
											// Set message
											var message = Message.createText(Language.getDefaultTranslation('You\'re no longer connected to the node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.'));
										}
									}
									
									// Check if a message hasn't been set
									if(typeof message === "undefined") {
									
										// Set message
										var message = Message.createText(Language.getDefaultTranslation('You\'re no longer connected to a node.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to send payments without being connected to a node.'));
									}
								
									// Show message
									self.message.show(Language.getDefaultTranslation('Node Error'), message, false, function() {
									
										// Check if the node status isn't showing warning or success
										if(nodeStatusDisplay.hasClass("warning") === false && nodeStatusDisplay.hasClass("success") === false) {
										
											// Set node connection message shown
											self.nodeConnectionMessageShown = true;
										
											// Save focus and blur
											self.focus.save(true);
											
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
											
												// Disable tabbing to everything in create display and disable everything in create display
												self.createDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Disable tabbing to everything in unlock display and disable everything in unlock display
												self.unlockDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Disable unlocked
												self.unlocked.disable();
											
											// Node connection open application node disconnected error event
											$(self.node).one(Node.CONNECTION_OPEN_EVENT + ".applicationNodeDisconnectedError", function() {
											
												// Check if create display is shown
												if(self.isCreateDisplayShown() === true)
											
													// Enable tabbing to everything in create display and enable everything in create display
													self.createDisplay.find("*").enableTab().enable();
												
												// Otherwise check if unlock display is shown
												else if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
												
												// Hide message
												self.message.hide();
											});
										}
										
										// Otherwise
										else {
										
											// Return false
											return false;
										}
									
									}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
									
										// Turn off node connection open application node disconnected error event
										$(self.node).off(Node.CONNECTION_OPEN_EVENT + ".applicationNodeDisconnectedError");
										
										// Check if message was displayed
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
										
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
										
												// Enable tabbing to everything in create display and enable everything in create display
												self.createDisplay.find("*").enableTab().enable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
											
											// Hide message
											self.message.hide();
										}
									});
								}
							}
						}
					});
				}
			
			// Node settings change event
			}).on(Node.SETTINGS_CHANGE_EVENT, function() {
			
				// Clear node incompatible message shown
				self.nodeIncompatibleMessageShown = false;
				
				// Clear node invalid response message shown
				self.nodeInvalidResponseMessageShown = false;
				
				// Clear node unauthorized response message shown
				self.nodeUnauthorizedResponseMessageShown = false;
				
				// Check if node's address exists
				if(self.node.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0]["length"] !== 0) {
				
					// Clear node connection message shown
					self.nodeConnectionMessageShown = false;
				}
				
				// Otherwise
				else {
				
					// Set node connection message shown
					self.nodeConnectionMessageShown = true;
				}
				
				// Turn off node connection warning application event
				$(self.node).off(Node.CONNECTION_WARNING_EVENT + ".application");
				
				// Turn off node connection close application event
				$(self.node).off(Node.CONNECTION_CLOSE_EVENT + ".application");
			});
			
			// Listener connection open event
			$(this.listener).on(Listener.CONNECTION_OPEN_EVENT, function() {
			
				// Get listener status display
				var listenerStatusDisplay = self.statusDisplay.find("p.listener");
			
				// Set that listener status display shows success
				listenerStatusDisplay.removeClass("warning").addClass("success");
				
				// Set title
				var title = Language.getDefaultTranslation('Listener connected');
			
				// Set listener status display's title
				listenerStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
				
				// Turn off listener connection close application event
				$(self.listener).off(Listener.CONNECTION_CLOSE_EVENT + ".application");
				
				// Clear listener connection message shown
				self.listenerConnectionMessageShown = false;
			
			// Listener connection close event
			}).on(Listener.CONNECTION_CLOSE_EVENT, function(event, closeType) {
			
				// Get listener status display
				var listenerStatusDisplay = self.statusDisplay.find("p.listener");
			
				// Set that listener status display shows error
				listenerStatusDisplay.removeClass("warning success");
				
				// Set title
				var title = Language.getDefaultTranslation('Listener disconnected');
			
				// Set listener status display's title
				listenerStatusDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title));
				
				// Check if listener connection message hasn't been shown
				if(self.listenerConnectionMessageShown === false) {
				
					// Listener connection close application event
					$(self.listener).one(Listener.CONNECTION_CLOSE_EVENT + ".application", function() {
					
						// Check if listener connection message hasn't been shown
						if(self.listenerConnectionMessageShown === false) {
					
							// Check if showing listener connection error messages is enabled
							if(self.enableListenerConnectionErrorMessages === true) {
							
								// Check if close is because couldn't connect to listener
								if(closeType === Listener.NO_CONNECTION_CLOSE_TYPE) {
								
									// Check if using a custom listener
									if(self.listener.usingCustomListener() === true) {
									
										// Check if listener's address exists
										if(self.listener.getAddress()["length"] !== 0) {
								
											// Check if not an extension and the page is connected to securely
											if(Common.isExtension() === false && (location["protocol"] === Common.HTTPS_PROTOCOL || Tor.isOnionService() === true)) {
											
												// Initialize error occurred
												var errorOccurred = false;
												
												// Get URL as the listener's address
												var url = self.listener.getAddress();
												
												// Try
												try {
										
													// Parse URL
													var parsedUrl = new URL(url);
												}
												
												// Catch errors
												catch(error) {
												
													// Set error occurred
													errorOccurred = true;
												}
												
												// Check if an error didn't occur
												if(errorOccurred === false) {
												
													// Check if listener will be connected to insecurely
													if(parsedUrl["protocol"] === Common.WEBSOCKET_PROTOCOL && Tor.isTorUrl(url) === false) {
													
														// Check if is an app
														if(Common.isApp() === true) {
													
															// Set message with insecure content information
															var message = Message.createText(Language.getDefaultTranslation('Connecting to the listener failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to receive payments without being connected to a listener.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Some browsers don\'t allow connecting to content that is served insecurely from an app that is served securely.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to specify a listener address that is served over HTTPS to connect to the listener.'));
														}
														
														// Otherwise
														else {
														
															// Set message with insecure content information
															var message = Message.createText(Language.getDefaultTranslation('Connecting to the listener failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to receive payments without being connected to a listener.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Some browsers don\'t allow connecting to content that is served insecurely from a site that is served securely.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to specify a listener address that is served over HTTPS to connect to the listener.'));
														}
													}
												}
											}
										}
										
										// Otherwise
										else {
										
											// Set message
											var message = Message.createText(Language.getDefaultTranslation('A listener address hasn\'t been provided.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to receive payments without being connected to a listener.'));
										}
									}
									
									// Check if a message hasn't been set
									if(typeof message === "undefined") {
									
										// Set message
										var message = Message.createText(Language.getDefaultTranslation('Connecting to the listener failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to receive payments without being connected to a listener.'));
									}
					
									// Show message
									self.message.show(Language.getDefaultTranslation('Listener Error'), message, false, function() {
									
										// Check if listener connection message hasn't been shown and the listener status isn't showing warning
										if(self.listenerConnectionMessageShown === false && listenerStatusDisplay.hasClass("warning") === false && listenerStatusDisplay.hasClass("success") === false) {
										
											// Set listener connection message shown
											self.listenerConnectionMessageShown = true;
									
											// Save focus and blur
											self.focus.save(true);
											
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
											
												// Disable tabbing to everything in create display and disable everything in create display
												self.createDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Disable tabbing to everything in unlock display and disable everything in unlock display
												self.unlockDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Disable unlocked
												self.unlocked.disable();
											
											// Listener connection open application listener no connection error event
											$(self.listener).one(Listener.CONNECTION_OPEN_EVENT + ".applicationListenerNoConnectionError", function() {
											
												// Check if create display is shown
												if(self.isCreateDisplayShown() === true)
											
													// Enable tabbing to everything in create display and enable everything in create display
													self.createDisplay.find("*").enableTab().enable();
												
												// Otherwise check if unlock display is shown
												else if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
												
												// Hide message
												self.message.hide();
											});
										}
										
										// Otherwise
										else {
										
											// Return false
											return false;
										}
									
									}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
									
										// Turn off listener connection open application listener no connection error event
										$(self.listener).off(Listener.CONNECTION_OPEN_EVENT + ".applicationListenerNoConnectionError");
										
										// Check if message was displayed
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
										
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
										
												// Enable tabbing to everything in create display and enable everything in create display
												self.createDisplay.find("*").enableTab().enable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
											
											// Hide message
											self.message.hide();
										}
									});
								}
								
								// Otherwise check if close is because connection to listener was disconnected
								else if(closeType === Listener.DISCONNECTED_CLOSE_TYPE) {
								
									// Show message
									self.message.show(Language.getDefaultTranslation('Listener Error'), Message.createText(Language.getDefaultTranslation('You\'re no longer connected to the listener.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to receive payments without being connected to a listener.')), false, function() {
									
										// Check if the listener status isn't showing warning
										if(listenerStatusDisplay.hasClass("warning") === false && listenerStatusDisplay.hasClass("success") === false) {
										
											// Set listener connection message shown
											self.listenerConnectionMessageShown = true;
									
											// Save focus and blur
											self.focus.save(true);
											
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
											
												// Disable tabbing to everything in create display and disable everything in create display
												self.createDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Disable tabbing to everything in unlock display and disable everything in unlock display
												self.unlockDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Disable unlocked
												self.unlocked.disable();
											
											// Listener connection open application listener disconnected error event
											$(self.listener).one(Listener.CONNECTION_OPEN_EVENT + ".applicationListenerDisconnectedError", function() {
											
												// Check if create display is shown
												if(self.isCreateDisplayShown() === true)
											
													// Enable tabbing to everything in create display and enable everything in create display
													self.createDisplay.find("*").enableTab().enable();
												
												// Otherwise check if unlock display is shown
												else if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
												
												// Hide message
												self.message.hide();
											});
										}
										
										// Otherwise
										else {
										
											// Return false
											return false;
										}
									
									}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
									
										// Turn off listener connection open application listener disconnected error event
										$(self.listener).off(Listener.CONNECTION_OPEN_EVENT + ".applicationListenerDisconnectedError");
										
										// Check if message was displayed
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
										
											// Check if create display is shown
											if(self.isCreateDisplayShown() === true)
										
												// Enable tabbing to everything in create display and enable everything in create display
												self.createDisplay.find("*").enableTab().enable();
											
											// Otherwise check if unlock display is shown
											else if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
											
											// Hide message
											self.message.hide();
										}
									});
								}
							}
						}
					});
				}
				
			// Listener settings change event
			}).on(Listener.SETTINGS_CHANGE_EVENT, function() {
			
				// Check if listener's address exists
				if(self.listener.getAddress()["length"] !== 0) {
				
					// Clear listener connection message shown
					self.listenerConnectionMessageShown = false;
				}
				
				// Otherwise
				else {
				
					// Set listener connection message shown
					self.listenerConnectionMessageShown = true;
				}
				
				// Turn off listener connection close application event
				$(self.listener).off(Listener.CONNECTION_CLOSE_EVENT + ".application");
			});
			
			// Wallets currency receive event
			$(this.wallets).on(Wallets.CURRENCY_RECEIVE_EVENT, function(event, wallet, amount, currency, message, receiverAddress) {
			
				// Get is raw data
				var isRawData = Common.hasWhitespace(message) === false;
			
				// Show message
				self.message.show(Language.getDefaultTranslation('Payment Received'), Message.createSuccessResult() + Message.createLineBreak() + Message.createText((message === SlateParticipant.NO_MESSAGE || message["length"] === 0) ? ((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('You were sent %1$c to Wallet %2$s.') : Language.getDefaultTranslation('You were sent %1$c to %2$y.')) : ((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('You were sent %1$c to Wallet %2$s with a message.') : Language.getDefaultTranslation('You were sent %1$c to %2$y with a message.')), [
				
					[
					
						// Number
						amount.toFixed(),
						
						// Currency
						currency,
						
						// Display value
						true
					],
					
					// Wallet key path or name
					(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()
					
				]) + ((message !== SlateParticipant.NO_MESSAGE && message["length"] !== 0) ? Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu" + ((isRawData === true) ? " rawData" : "") + "\">" + Common.htmlEncode(message) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('(?<=.) '))) + ((receiverAddress !== Slate.NO_RECEIVER_ADDRESS) ? Message.createText(Language.getDefaultTranslation('The recipient payment proof address you used for the transaction is the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(receiverAddress) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() : Message.createText(Language.getDefaultTranslation('The transaction doesn\'t have a payment proof.'))) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You shouldn\'t consider this payment to be legitimate until it\'s been confirmed on the blockchain.')) + "</b>", false, function() {
				
					// Check if wallet exists
					if(self.wallets.walletExists(wallet.getKeyPath()) === true) {
				
						// Save focus and blur
						self.focus.save(true);
						
						// Check if create display is shown
						if(self.isCreateDisplayShown() === true)
						
							// Disable tabbing to everything in create display and disable everything in create display
							self.createDisplay.find("*").disableTab().disable();
						
						// Otherwise check if unlock display is shown
						else if(self.isUnlockDisplayShown() === true)
						
							// Disable tabbing to everything in unlock display and disable everything in unlock display
							self.unlockDisplay.find("*").disableTab().disable();
						
						// Otherwise check if unlocked display is shown
						else if(self.isUnlockedDisplayShown() === true)
						
							// Disable unlocked
							self.unlocked.disable();
					}
					
					// Otherwise
					else {
					
						// Return false
						return false;
					}
				
				}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, false, Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
						// Check if create display is shown
						if(self.isCreateDisplayShown() === true)
					
							// Enable tabbing to everything in create display and enable everything in create display
							self.createDisplay.find("*").enableTab().enable();
						
						// Otherwise check if unlock display is shown
						else if(self.isUnlockDisplayShown() === true)
						
							// Enable tabbing to everything in unlock display and enable everything in unlock display
							self.unlockDisplay.find("*").enableTab().enable();
				
						// Otherwise check if unlocked display is shown
						else if(self.isUnlockedDisplayShown() === true)
						
							// Enable unlocked
							self.unlocked.enable();
						
						// Restore focus and don't blur
						self.focus.restore(false);
						
						// Hide message
						self.message.hide();
					}
				});
			});
			
			// Service worker installer update available event
			$(this.serviceWorkerInstaller).on(ServiceWorkerInstaller.UPDATE_AVAILABLE_EVENT, function() {
			
				// Check if not ignoring updates
				if(self.ignoreUpdates === false) {
				
					// Check if is an app
					if(Common.isApp() === true) {
					
						// Set message
						var message = Language.getDefaultTranslation('An update for this app is available. Do you want to install the update now? If so, this app will reload once the update has been installed. If not, the update will be install the next time you open this app.');
					}
					
					// Otherwise
					else {
					
						// Set message
						var message = Language.getDefaultTranslation('An update for this site is available. Do you want to install the update now? If so, this site will reload once the update has been installed. If not, the update will be install the next time you visit this site.');
					}
			
					// Show message
					self.message.show(Language.getDefaultTranslation('Update Available'), Message.createText(message), false, function() {
					
						// Save focus and blur
						self.focus.save(true);
						
						// Check if create display is shown
						if(self.isCreateDisplayShown() === true)
						
							// Disable tabbing to everything in create display and disable everything in create display
							self.createDisplay.find("*").disableTab().disable();
						
						// Otherwise check if unlock display is shown
						else if(self.isUnlockDisplayShown() === true)
						
							// Disable tabbing to everything in unlock display and disable everything in unlock display
							self.unlockDisplay.find("*").disableTab().disable();
						
						// Otherwise check if unlocked display is shown
						else if(self.isUnlockedDisplayShown() === true)
						
							// Disable unlocked
							self.unlocked.disable();
					
					}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Check if installing the update
							if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
							
								// Prevent showing messages
								self.message.prevent();
								
								// Show loading
								self.showLoading();
							
								// Set that message second button is loading
								self.message.setButtonLoading(Message.SECOND_BUTTON);
								
								// Delete focus
								self.focus.delete();
								
								// Set timeout
								setTimeout(function() {
								
									// Check if is an app
									if(Common.isApp() === true) {
									
										// Set message
										var message = Language.getDefaultTranslation('The update was successfully installed. This app will now reload to use the new version.');
									}
									
									// Otherwise
									else {
									
										// Set message
										var message = Language.getDefaultTranslation('The update was successfully installed. This site will now reload to use the new version.');
									}
								
									// Show message
									self.message.show(Language.getDefaultTranslation('Update Installed'), Message.createText(message), true, function() {
									
										// Hide loading
										self.hideLoading();
									
									}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
									
										// Check if message was displayed
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
											// Prevent showing messages
											self.message.prevent();
										
											// Show loading
											self.showLoading();
											
											// Prevent extension from interrupting on close
											Extension.preventInterruptOnClose();
										
											// Reload page
											location.reload();
										}
									});
								
								}, Application.INSTALL_UPDATE_DELAY_MILLISECONDS);
							}
							
							// Otherwise
							else {
							
								// Set ignore updates
								self.ignoreUpdates = true;
							
								// Check if create display is shown
								if(self.isCreateDisplayShown() === true)
							
									// Enable tabbing to everything in create display and enable everything in create display
									self.createDisplay.find("*").enableTab().enable();
								
								// Otherwise check if unlock display is shown
								else if(self.isUnlockDisplayShown() === true)
								
									// Enable tabbing to everything in unlock display and enable everything in unlock display
									self.unlockDisplay.find("*").enableTab().enable();
						
								// Otherwise check if unlocked display is shown
								else if(self.isUnlockedDisplayShown() === true)
								
									// Enable unlocked
									self.unlocked.enable();
								
								// Restore focus and don't blur
								self.focus.restore(false);
								
								// Hide message
								self.message.hide();
							}
						}
					});
				}
			});
			
			// Is not iframe
			this.isNotIframe().then(function() {
			
				// If browser is compatible
				self.browserIsCompatible().then(function() {
				
					// Install service worker
					self.installServiceWorker().then(function() {
				
						// Show version changes
						self.version.showChanges().then(function() {
					
							// Show private browsing message
							self.showPrivateBrowsingMessage().then(function() {
							
								// Show third-party cookies message
								self.showThirdPartyCookiesMessage().then(function() {
							
									// Is primary instance
									self.isPrimaryInstance().then(function() {
									
										// Set timeout
										setTimeout(function() {
									
											// Show reset settings
											self.showResetSettings().then(function() {
									
												// Initialize dependencies
												self.initializeDependencies().then(function() {
												
													// Initialize extension
													self.initializeExtension().then(function() {
													
														// Set verify source
														self.setVerifySource();
														
														// Show create or unlock
														self.showCreateOrUnlock();
													});
												});
											});
										}, 0);
									});
								});
							});
						});
					});
				});
			});
			
			// Locked display form show click event
			this.lockedDisplay.find("form span.show").on("click", function(event) {
			
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
						self.focus.save(false);
					
						// Restore input selection
						input.get(0).setSelectionRange(savedSelectionStart, savedSelectionEnd, savedSelectionDirection);
						
						// Restore focus and blur if it doesn't exist
						self.focus.restore(true);
					});
				}
			
			// Locked display form show mouse down event
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
			
			// Locked display form input input event
			this.lockedDisplay.find("form input").on("input", function() {
			
				// Get input
				var input = $(this);
				
				// Check if input's value is empty
				if(input.val()["length"] === 0)
				
					// Set that input is empty
					input.removeClass("notEmpty");
				
				// Otherwise
				else
				
					// Set that input isn't empty
					input.addClass("notEmpty");
			});
			
			// Create display form submit event
			this.createDisplay.children("form").on("submit", function(event) {
			
				// Prevent default
				event.preventDefault();
				
				// Prevent showing messages
				self.message.prevent();
				
				// Save focus, blur, and get focused element
				var focusedElement = self.focus.save(true);
				
				// Check if focused element is a button
				if(focusedElement !== Focus.NO_FOCUS && focusedElement.is("button") === true)
				
					// Set that focused element is clicked
					focusedElement.addClass("clicked");
				
				// Disable tabbing to everything in create display and disable everything in create display
				self.createDisplay.find("*").disableTab().disable();
				
				// Show loading
				self.showLoading();
				
				// Set that create display button is loading
				$(this).children("button").addClass("loading");
				
				// Get password
				var password = $(this).find("input[name=\"Password\"]").val();
				
				// Get confirm password
				var confirmPassword = $(this).find("input[name=\"Confirm Password\"]").val();
				
				// Show create error
				var showCreateError = function(error) {
				
					// TODO Securely clear password and confirm password
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Create Error'), Message.createText(error), false, function() {
					
						// Hide loading
						self.hideLoading();
					
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Set that create display button isn't loading
							self.createDisplay.find("form").children("button").removeClass("loading");
							
							// Enable tabbing to everything in create display and enable everything in create display
							self.createDisplay.find("*").enableTab().enable();
							
							// Check if focused element is clicked
							if(focusedElement !== Focus.NO_FOCUS && focusedElement.hasClass("clicked") === true)
							
								// Set that focused element isn't clicked
								focusedElement.removeClass("clicked");
							
							// Restore focus and don't blur
							self.focus.restore(false);
							
							// Hide message
							self.message.hide();
						}
					});
				};
				
				// Check if password is invalid
				if(password["length"] === 0)
				
					// Show create error
					showCreateError(Language.getDefaultTranslation('Password is empty.'));
				
				// Otherwise check if password is invalid
				else if(confirmPassword["length"] === 0)
				
					// Show create error
					showCreateError(Language.getDefaultTranslation('Confirm password is empty.'));
				
				// Otherwise check if passwords don't match match
				else if(password !== confirmPassword)
				
					// Show create error
					showCreateError(Language.getDefaultTranslation('Passwords don\'t match.'));
				
				// Otherwise
				else {
				
					// Unlock wallets using password
					self.wallets.unlock(password).then(function() {
					
						// Create a wallet
						self.wallets.create(Wallet.NO_NAME, Consensus.getWalletType(), Consensus.getNetworkType(), (self.node.isConnected() === true) ? Wallet.STATUS_SYNCED : ((self.node.connectionFailed() === true) ? Wallet.STATUS_ERROR : Wallet.STATUS_SYNCING)).then(function(wallet) {
						
							// Connect wallets to node and listener if not closing when dont processing extension requests
							self.wallets.connectToNodeAndListener(Extension.getCloseWhenDone() === true);
							
							// Get wallet's passphrase
							wallet.getPassphrase().then(function(walletPassphrase) {
							
								// Initialize unlocked
								self.unlocked.initialize().then(function() {
								
									// Log message
									Log.logMessage(Language.getDefaultTranslation('Created wallet Wallet %1$s.'), [
									
										// Wallet key path
										wallet.getKeyPath().toFixed()
									]);
									
									// TODO Securely clear password and confirm password
								
									// Log message
									Log.logMessage(Language.getDefaultTranslation('Unlocked.'));
								
									// Delete all saved focus
									self.focus.deleteAll();
									
									// Allow extension to interrupt on close
									Extension.allowInterruptOnClose();
							
									// Set timeout
									setTimeout(function() {
									
										// Check if message is shown
										if(self.message.isShown() === true) {
										
											// Check if message visible state doesn't include unlocked
											if((self.message.visibleState() & Message.VISIBLE_STATE_UNLOCKED) === 0)
										
												// Hide message
												self.message.hide();
										}
											
										// Hide create display children
										self.createDisplay.children().addClass("hide");
										
										// Hide logo
										self.logo.hide();
										
										// Hide info display
										self.infoDisplay.addClass("hide");
										
										// Create display form transition end or timeout event
										self.createDisplay.children("form").transitionEndOrTimeout(function() {
										
											// Hide create display
											self.createDisplay.addClass("hide");
											
											// Reset
											self.reset();
											
											// Hide loading
											self.hideLoading();
											
											// Set that create display button isn't loading
											self.createDisplay.find("form").children("button").removeClass("loading");
											
											// Enable tabbing to everything in create display and enable everything in create display
											self.createDisplay.find("*").enableTab().enable();
											
											// Check if focused element is clicked
											if(focusedElement !== Focus.NO_FOCUS && focusedElement.hasClass("clicked") === true)
											
												// Set that focused element isn't clicked
												focusedElement.removeClass("clicked");
											
											// Clear create display shown input values
											self.createDisplay.find("input:not(.hide)").val("").trigger("input");
											
											// Unhide create display logo
											self.createDisplay.children("div.logo").removeClass("hide");
											
											// Set that unlock display can show status
											self.unlockDisplay.addClass("showStatus");
											
											// Set unlocked at least once
											self.unlockedAtLeastOnce = true;
											
											// Disable unlocked
											self.unlocked.disable();
											
											// Show unlocked display
											self.unlockedDisplay.removeClass("hide");
											
											// Set timeout
											setTimeout(function() {
											
												// Trigger resize event
												$(window).trigger("resize");
											
												// Show unlocked display children
												self.unlockedDisplay.children().removeClass("hide");
												
												// Trigger section shown event on the current section
												$(self.sections.getCurrentSection()).trigger(Section.SHOWN_EVENT);
												
												// Trigger unlocked show event
												$(self.unlocked).trigger(Unlocked.SHOW_EVENT);
												
												// Check if protocol handler wasn't registered
												if(self.protocolHandlerRegistered === false) {
												
													// Set protocol handler registered
													self.protocolHandlerRegistered = true;
												
													// Register protocol handler
													ProtocolHandler.register();
												}
											
												// Show message and allow showing messages
												self.message.show(Language.getDefaultTranslation('New Wallet Passphrase'), Message.createText(Language.getDefaultTranslation('This passphrase will allow you to recover Wallet %1$s. It\'s recommended that you record this passphrase in a secure, nondigital way.'), [wallet.getKeyPath().toFixed()]) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"passphrase contextMenu\" spellcheck=\"false\">" + Common.htmlEncode(walletPassphrase) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('Don\'t disclose this passphrase to anyone.')) + "</b>", false, Message.NO_BEFORE_SHOW_FUNCTION, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
												
													// TODO Securely clear walletPassphrase
													
													// Check if message was displayed
													if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
													
														// Allow automatic lock
														self.automaticLock.allow();
														
														// Check if automatic lock isn't locking
														if(self.automaticLock.isLocking() === false) {
													
															// Enable unlocked
															self.unlocked.enable();
															
															// Focus on unlocked display
															self.unlockedDisplay.focus();
															
															// Trigger section focus event on the current section
															$(self.sections.getCurrentSection()).trigger(Section.FOCUS_EVENT);
															
															// Hide message
															self.message.hide();
														}
													}
												});
											}, 0);
											
										}, "opacity");
										
									}, Application.SHOW_UNLOCKED_DISPLAY_DELAY_MILLISECONDS);
								
								// Catch errors
								}).catch(function(error) {
								
									// TODO Securely clear walletPassphrase
								
									// Reset unlocked
									self.unlocked.reset();
								
									// Remove wallet and catch errors
									self.wallets.removeWallet(wallet.getKeyPath()).catch(function(error) {
									
									// Finally
									}).finally(function() {
									
										// Lock wallets
										self.wallets.lock();
									
										// Show create error
										showCreateError(error);
									});
								});
							
							// Catch errors
							}).catch(function(error) {
							
								// Remove wallet and catch errors
								self.wallets.removeWallet(wallet.getKeyPath()).catch(function(error) {
									
								// Finally
								}).finally(function() {
								
									// Lock wallets
									self.wallets.lock();
								
									// Show create error
									showCreateError(error);
								});
							});
							
						// Catch errors
						}).catch(function(error) {
						
							// Lock wallets
							self.wallets.lock();
						
							// Show create error
							showCreateError(error);
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Lock wallets
						self.wallets.lock();
					
						// Show create error
						showCreateError(error);
					});
				}
			});
			
			// Unlock display form submit event
			this.unlockDisplay.children("form").on("submit", function(event) {
			
				// Prevent default
				event.preventDefault();
			
				// Prevent showing messages
				self.message.prevent();
				
				// Save focus, blur, and get focused element
				var focusedElement = self.focus.save(true);
				
				// Check if focused element is a button
				if(focusedElement !== Focus.NO_FOCUS && focusedElement.is("button") === true)
				
					// Set that focused element is clicked
					focusedElement.addClass("clicked");
				
				// Disable tabbing to everything in unlock display and disable everything in unlock display
				self.unlockDisplay.find("*").disableTab().disable();
				
				// Show loading
				self.showLoading();
				
				// Set that unlock display button is loading
				$(this).children("button").addClass("loading");
				
				// Get password
				var password = $(this).find("input[name=\"Password\"]").val();
				
				// Show unlock error
				var showUnlockError = function(error) {
				
					// TODO Securely clear password
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Unlock Error'), Message.createText(error), false, function() {
					
						// Hide loading
						self.hideLoading();
					
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Set that unlock display button isn't loading
							self.unlockDisplay.find("form").children("button").removeClass("loading");
							
							// Enable tabbing to everything in unlock display and enable everything in unlock display
							self.unlockDisplay.find("*").enableTab().enable();
							
							// Check if focused element is clicked
							if(focusedElement !== Focus.NO_FOCUS && focusedElement.hasClass("clicked") === true)
							
								// Set that focused element isn't clicked
								focusedElement.removeClass("clicked");
							
							// Restore focus and don't blur
							self.focus.restore(false);
							
							// Hide message
							self.message.hide();
						}
					});
				};
				
				// Check if password is invalid
				if(password["length"] === 0)
				
					// Show unlock error
					showUnlockError(Language.getDefaultTranslation('Password is empty.'));
				
				// Otherwise
				else {
			
					// Unlock wallets using password
					self.wallets.unlock(password, self.unlockedAtLeastOnce === false).then(function() {
					
						// Connect wallets to node and listener if not closing when dont processing extension requests
						self.wallets.connectToNodeAndListener(Extension.getCloseWhenDone() === true);
					
						// Initialize unlocked
						self.unlocked.initialize().then(function() {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Unlocked.'));
							
							// TODO Securely clear password
						
							// Delete all saved focus
							self.focus.deleteAll();
							
							// Allow extension to interrupt on close
							Extension.allowInterruptOnClose();
					
							// Set timeout
							setTimeout(function() {
							
								// Check if message is shown
								if(self.message.isShown() === true) {
								
									// Check if message visible state doesn't include unlocked
									if((self.message.visibleState() & Message.VISIBLE_STATE_UNLOCKED) === 0)
								
										// Hide message
										self.message.hide();
								}
						
								// Hide unlock display children
								self.unlockDisplay.children().addClass("hide");
								
								// Hide logo
								self.logo.hide();
								
								// Hide info display
								self.infoDisplay.addClass("hide");

								// Unlock display form transition end or timeout event
								self.unlockDisplay.children("form").transitionEndOrTimeout(function() {

									// Hide unlock display
									self.unlockDisplay.addClass("hide");
									
									// Reset
									self.reset();
									
									// Hide loading
									self.hideLoading();
									
									// Set that unlock display button isn't loading
									self.unlockDisplay.find("form").children("button").removeClass("loading");
									
									// Enable tabbing to everything in unlock display and enable everything in unlock display
									self.unlockDisplay.find("*").enableTab().enable();
									
									// Check if focused element is clicked
									if(focusedElement !== Focus.NO_FOCUS && focusedElement.hasClass("clicked") === true)
									
										// Set that focused element isn't clicked
										focusedElement.removeClass("clicked");
									
									// Clear unlock display shown input values
									self.unlockDisplay.find("input:not(.hide)").val("").trigger("input");
									
									// Unhide unlock display logo
									self.unlockDisplay.children("div.logo").removeClass("hide");
									
									// Set that unlock display can show status
									self.unlockDisplay.addClass("showStatus");
									
									// Set show install app to if hasn't been previously unlocked
									var showInstallApp = self.unlockedAtLeastOnce === false;
									
									// Set unlocked at least once
									self.unlockedAtLeastOnce = true;
									
									// Disable unlocked
									self.unlocked.disable();
									
									// Show unlocked display
									self.unlockedDisplay.removeClass("hide");
									
									// Set timeout
									setTimeout(function() {
									
										// Trigger resize event
										$(window).trigger("resize");
									
										// Show unlocked display children
										self.unlockedDisplay.children().removeClass("hide");
										
										// Trigger section shown event on the current section
										$(self.sections.getCurrentSection()).trigger(Section.SHOWN_EVENT);
										
										// Trigger unlocked show event
										$(self.unlocked).trigger(Unlocked.SHOW_EVENT);
										
										// Check if message is not shown
										if(self.message.isShown() === false) {
										
											// Unlocked display children transition end or timeout event
											self.unlockedDisplay.children().transitionEndOrTimeout(function() {
											
												// Allow automatic lock
												self.automaticLock.allow();
												
											}, "opacity");
										
											// Enable unlocked
											self.unlocked.enable();
											
											// Focus on unlocked display
											self.unlockedDisplay.focus();
											
											// Trigger section focus event on the current section
											$(self.sections.getCurrentSection()).trigger(Section.FOCUS_EVENT);
										}
										
										// Otherwise
										else {
										
											// Unlocked display children transition end or timeout event
											self.unlockedDisplay.children().transitionEndOrTimeout(function() {
											
												// Allow automatic lock
												self.automaticLock.allow();
											
												// Check if message is not shown
												if(self.message.isShown() === false) {
												
													// Enable unlocked
													self.unlocked.enable();
													
													// Focus on unlocked display
													self.unlockedDisplay.focus();
													
													// Trigger section focus event on the current section
													$(self.sections.getCurrentSection()).trigger(Section.FOCUS_EVENT);
												}
											}, "opacity");
										}
										
										// Allow showing messages
										self.message.allow();
										
										// Check if showing install app
										if(showInstallApp === true) {
										
											// Set timeout
											setTimeout(function() {
												
												// Show install app
												self.installApp.show();
											
											}, Common.randomNumber(Application.SHOW_INSTALL_APP_MINIMUM_DELAY_SECONDS, Application.SHOW_INSTALL_APP_MAXIMUM_DELAY_SECONDS) * Common.MILLISECONDS_IN_A_SECOND);
										}
									}, 0);
									
								}, "opacity");
								
							}, Application.SHOW_UNLOCKED_DISPLAY_DELAY_MILLISECONDS);
							
						// Catch errors
						}).catch(function(error) {
						
							// Reset unlocked
							self.unlocked.reset();
							
							// Lock wallets
							self.wallets.lock(self.unlockedAtLeastOnce === false);
						
							// Show unlock error
							showUnlockError(error);
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Lock wallets
						self.wallets.lock(self.unlockedAtLeastOnce === false);
					
						// Show unlock error
						showUnlockError(error);
					});
				}
			});
			
			// Unlock display delete all wallets button click event
			this.unlockDisplay.find("div.deleteAllWallets").children().on("click", function(event) {
			
				// Get button
				var button = $(this);
			
				// Show message
				self.message.show(Language.getDefaultTranslation('Delete All Wallets'), Message.createText(Language.getDefaultTranslation('Are you sure you want to delete all your wallets?')) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('Each wallet can only be recovered by using its passphrase or hardware wallet once it\'s been deleted.')) + "</b>", false, function() {
				
					// Save focus and blur
					self.focus.save(true);
					
					// Set that unlock display delete all wallets button is clicked
					button.addClass("clicked");
					
					// Disable tabbing to everything in unlock display and disable everything in unlock display
					self.unlockDisplay.find("*").disableTab().disable();
				
				}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), false, Message.VISIBLE_STATE_ALL, true).then(function(messageResult) {
				
					// Check if message was displayed
					if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
				
						// Check if deleting all wallets
						if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
						
							// Prevent showing messages
							self.message.prevent();
						
							// Show loading
							self.showLoading();
						
							// Set that message second button is loading
							self.message.setButtonLoading(Message.SECOND_BUTTON);
							
							// Set timeout
							setTimeout(function() {
							
								// Clear sections stack if applicable
								var clearSectionsStackIfApplicable = function() {
								
									// Return promise
									return new Promise(function(resolve, reject) {
									
										// Check if wallet section is in the sections stack
										if(self.sections.isSectionInStack(WalletSection.NAME) === true) {
										
											// Return clear sections stack
											return self.sections.clearStack(true).then(function() {
											
												// Resolve
												resolve();
												
											// Catch errors
											}).catch(function(error) {
											
												// Reject error
												reject(error);
											});
										}
										
										// Otherwise
										else {
										
											// Resolve
											resolve();
										}
									});
								};
								
								// Clear sections stack if applicable
								clearSectionsStackIfApplicable().then(function() {
							
									// Remove all wallets
									self.wallets.removeAllWallets().then(function() {
									
										// Hide unlock display form
										self.unlockDisplay.children("form").addClass("hide");
										
										// Hide unlock display delete all wallets button
										self.unlockDisplay.find("div.deleteAllWallets").addClass("hide");
										
										// Hide message
										self.message.hide();
										
										// Unlock display delete all wallets button transition end or timeout event
										self.unlockDisplay.find("div.deleteAllWallets").transitionEndOrTimeout(function() {
										
											// Hide unlock display
											self.unlockDisplay.addClass("hide");
											
											// Reset
											self.reset();
											
											// Hide loading
											self.hideLoading();
											
											// Enable tabbing to everything in unlock display and enable everything in unlock display
											self.unlockDisplay.find("*").enableTab().enable();
											
											// Set that button isn't clicked
											button.removeClass("clicked");
											
											// Delete focus
											self.focus.delete();
											
											// Clear unlock display shown input values
											self.unlockDisplay.find("input:not(.hide)").val("").trigger("input");
											
											// Disable tabbing to everything in create display and disable everything in create display
											self.createDisplay.find("*").disableTab().disable();
									
											// Show create display
											self.createDisplay.removeClass("hide");
											
											// Set timeout
											setTimeout(function() {
											
												// Show create display form
												self.createDisplay.children("form").removeClass("hide");
												
												// Enable tabbing to everything in create display and enable everything in create display
												self.createDisplay.find("*").enableTab().enable();
												
												// Focus on create display
												self.createDisplay.focus();
												
												// Allow showing messages
												self.message.allow();
											}, 0);
											
										}, "opacity");
									
									// Catch errors
									}).catch(function(error) {
									
										// Show message and allow showing messages
										self.message.show(Language.getDefaultTranslation('Delete All Wallets Error'), Message.createText(error), true, function() {
										
											// Hide loading
											self.hideLoading();
										
										}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
										
											// Check if message was displayed
											if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
										
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
												
												// Set that button isn't clicked
												button.removeClass("clicked");
												
												// Restore focus and don't blur
												self.focus.restore(false);
												
												// Hide message
												self.message.hide();
											}
										});
									});
								
								// Catch errors
								}).catch(function(error) {
								
									// Show message and allow showing messages
									self.message.show(Language.getDefaultTranslation('Delete All Wallets Error'), Message.createText(error), true, function() {
									
										// Hide loading
										self.hideLoading();
									
									}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
									
										// Check if message was displayed
										if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
											// Enable tabbing to everything in unlock display and enable everything in unlock display
											self.unlockDisplay.find("*").enableTab().enable();
											
											// Set that button isn't clicked
											button.removeClass("clicked");
											
											// Restore focus and don't blur
											self.focus.restore(false);
											
											// Hide message
											self.message.hide();
										}
									});
								});
							}, Application.DELETE_ALL_WALLETS_DELAY_MILLISECONDS);
						}
						
						// Otherwise
						else {
						
							// Enable tabbing to everything in unlock display and enable everything in unlock display
							self.unlockDisplay.find("*").enableTab().enable();
							
							// Set that button isn't clicked
							button.removeClass("clicked");
							
							// Restore focus and don't blur
							self.focus.restore(false);
							
							// Hide message
							self.message.hide();
						}
					}
				});
			
			// Unlock display delete all wallets button transition event
			}).on("transitionend", function() {
			
				// Get button
				var button = $(this);
				
				// Get button text
				var buttonText = button.children();
				
				// Check if button is expanded
				if((((typeof matchMedia === "function" && matchMedia("(any-hover: hover)")["matches"] === true && button.is(":hover") === true) || button.is(":focus") === true) && button.is(":disabled") === false) || button.hasClass("clicked") === true) {
				
					// Get button max width
					var buttonMaxWidth = parseFloat(button.css("font-size")) * Application.DELETE_ALL_WALLETS_BUTTON_MAXIMUM_WIDTH;
				
					// Check if button text isn't fully showing
					if(button.outerWidth() >= button.parent().width() || buttonText.get(0)["scrollWidth"] >= buttonMaxWidth) {
					
						// Make button text truncate
						buttonText.addClass("truncate");
						
						// Check if button is larger than it's parent
						if(buttonMaxWidth > button.parent().width())
						
							// Make button text align left
							buttonText.addClass("alignLeft");
						
						// Otherwise
						else
						
							// Make button text align center
							buttonText.removeClass("alignLeft");
					}
					
					// Otherwise
					else
					
						// Make button text not truncate and align center
						buttonText.removeClass("truncate alignLeft");
				}
				
				// Otherwise
				else
				
					// Make button text not truncate and align center
					buttonText.removeClass("truncate alignLeft");
			});
			
			// Unlock display delete all wallets button text language change event
			this.unlockDisplay.find("div.deleteAllWallets").children().children().on(Language.CHANGE_EVENT, function() {
			
				// Trigger transition end event on parent
				$(this).parent().trigger("transitionend");
			});
		}
		
		// Show create display
		showCreateDisplay() {
		
			// Show create display
			this.showDisplay(this.createDisplay);
		}
		
		// Show lock display
		showLockDisplay() {
		
			// Show unlock display
			this.showDisplay(this.unlockDisplay);
		}
		
		// Is create diplay shown
		isCreateDisplayShown() {
		
			// Return if create display's children is shown
			return this.createDisplay.children().hasClass("hide") === false;
		}
		
		// Is unlock diplay shown
		isUnlockDisplayShown() {
		
			// Return if unlock display's children is shown
			return this.unlockDisplay.children().hasClass("hide") === false;
		}
		
		// Is unlocked diplay shown
		isUnlockedDisplayShown() {
		
			// Return if unlocked display's children is shown
			return this.unlockedDisplay.children().hasClass("hide") === false;
		}
		
		// Show loading
		showLoading() {
		
			// Set that body display is loading
			this.bodyDisplay.addClass("loading");
		}
		
		// Hide loading
		hideLoading() {
		
			// Set that body display isn't loading
			this.bodyDisplay.removeClass("loading");
		}
		
		// Is showing loading
		isShowingLoading() {
		
			// Return if showing loading
			return this.bodyDisplay.hasClass("loading") === true;
		}
		
		// Show approve receiving payment message
		showApproveReceivingPaymentMessage(wallet, slate, allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Prompt to approve
				var promptToApprove = function() {
				
					// Check if cancel didn't occur
					if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
					
						// Check if preventing messages or messages are allowed and no message is shown
						if(preventMessages === true || (self.message.getAllowed() === true && self.message.isShown() === false)) {
			
							// Initialize prevent cancel on hide
							var preventCancelOnHide = false;
							
							// Initialize external cancel check allowed
							var externalCancelCheckAllowed = true;
							
							// Initialize sleep disabled
							var sleepDisabled = false;
							
							// Show message
							self.message.show(Language.getDefaultTranslation('Approve Receiving Payment'), Message.createPendingResult() + Message.createLineBreak() + Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('Do you approve receiving a payment for Wallet %1$s of %2$c with a fee of %3$c and %4$x kernel features?') : Language.getDefaultTranslation('Do you approve receiving a payment for %1$y of %2$c with a fee of %3$c and %4$x kernel features?'), [
																																																									
								// Wallet key path or name
								(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName(),
								
								[

									// Number
									slate.getAmount().dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
									
									// Currency
									Consensus.CURRENCY_NAME,
						
									// Display value
									true
								],
								
								[
								
									// Number
									slate.getFee().dividedBy(Consensus.VALUE_NUMBER_BASE).toFixed(),
									
									// Currency
									Consensus.CURRENCY_NAME,
						
									// Display value
									true
								],
								
								// Kernel features
								slate.getDisplayKernelFeatures()
								
							]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + ((slate.getSenderAddress() !== Slate.NO_SENDER_ADDRESS) ? Message.createText(Language.getDefaultTranslation('The transaction\'s sender payment proof address is the following payment proof address.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(slate.getSenderAddress()) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak() + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can guarantee that this payment is coming from the intended sender by having the sender confirm that this payment proof address is their payment proof address.')) + "</b>" : (Message.createText(Language.getDefaultTranslation('The transaction doesn\'t have a payment proof.')) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('You can\'t guarantee that this payment is coming from the intended sender since the transaction doesn\'t have a payment proof.')) + "</b>")), preventMessages === true, function() {
							
								// Check if cancel didn't occur and wallet exists
								if((cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) && self.wallets.walletExists(wallet.getKeyPath()) === true) {
							
									// Check if preventing messages
									if(preventMessages === true) {
								
										// Hide loading
										self.hideLoading();
									}
									
									// Otherwise
									else {
						
										// Save focus and blur
										self.focus.save(true);
										
										// Check if unlock display is shown
										if(self.isUnlockDisplayShown() === true)
										
											// Disable tabbing to everything in unlock display and disable everything in unlock display
											self.unlockDisplay.find("*").disableTab().disable();
										
										// Otherwise check if unlocked display is shown
										else if(self.isUnlockedDisplayShown() === true)
										
											// Disable unlocked
											self.unlocked.disable();
											
										// Keep device awake and catch errors
										self.wakeLock.preventLock().catch(function(error) {
										
										});
									
										// Set sleep disabled
										sleepDisabled = true;
									}
									
									// Cancel if external canceled
									var cancelIfExternalCanceled = function() {
									
										// Check if external cancel check if allowed
										if(externalCancelCheckAllowed === true) {
									
											// Check if cancel occurred
											if(cancelOccurred !== Common.NO_CANCEL_OCCURRED && cancelOccurred() === true) {
											
												// Disable message
												self.message.disable();
												
												// Set prevent cancel on hide
												preventCancelOnHide = true;
												
												// Check if preventing messages
												if(preventMessages === true) {
												
													// Check if can't be canceled
													if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
												
														// Prevent showing messages
														self.message.prevent();
													}
													
													// Check if preventing messages and it can be canceled
													if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
													}
													
													// Otherwise
													else {
													
														// Hide message
														self.message.hide().then(function() {
														
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
														});
													}
												}
												
												// Otherwise
												else {
												
													// Check if sleep is disabled
													if(sleepDisabled === true) {
													
														// Allow device to sleep and catch errors
														self.wakeLock.allowLock().catch(function(error) {
															
														// Finally
														}).finally(function() {
														
															// Check if unlock display is shown
															if(self.isUnlockDisplayShown() === true)
															
																// Enable tabbing to everything in unlock display and enable everything in unlock display
																self.unlockDisplay.find("*").enableTab().enable();
													
															// Otherwise check if unlocked display is shown
															else if(self.isUnlockedDisplayShown() === true)
															
																// Enable unlocked
																self.unlocked.enable();
															
															// Restore focus and don't blur
															self.focus.restore(false);
															
															// Check if preventing messages and it can be canceled
															if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
															
																// Reject canceled error
																reject(Common.CANCELED_ERROR);
															}
															
															// Otherwise
															else {
															
																// Hide message
																self.message.hide().then(function() {
																
																	// Reject canceled error
																	reject(Common.CANCELED_ERROR);
																});
															}
														});
													}
													
													// Otherwise
													else {
											
														// Check if unlock display is shown
														if(self.isUnlockDisplayShown() === true)
														
															// Enable tabbing to everything in unlock display and enable everything in unlock display
															self.unlockDisplay.find("*").enableTab().enable();
												
														// Otherwise check if unlocked display is shown
														else if(self.isUnlockedDisplayShown() === true)
														
															// Enable unlocked
															self.unlocked.enable();
														
														// Restore focus and don't blur
														self.focus.restore(false);
														
														// Check if preventing messages and it can be canceled
														if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
														
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
														}
														
														// Otherwise
														else {
														
															// Hide message
															self.message.hide().then(function() {
															
																// Reject canceled error
																reject(Common.CANCELED_ERROR);
															});
														}
													}
												}
											}
											
											// Otherwise
											else {
											
												// Set timeout
												setTimeout(function() {
												
													// Cancel if external canceled
													cancelIfExternalCanceled();
												
												}, Application.CANCELED_CHECK_INTERVAL_MILLISECONDS);
											}
										}
									};
									
									// Cancel if external canceled
									cancelIfExternalCanceled();
								}
								
								// Otherwise
								else {
								
									// Return false
									return false;
								}
							
							}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), preventMessages === true, (allowUnlock === true) ? Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED : Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
							
								// Clear external cancel check allowed
								externalCancelCheckAllowed = false;
								
								// Check if message was displayed
								if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
								
									// Check if receiving payment
									if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
									
										// Check if preventing messages
										if(preventMessages === true) {
										
											// Check if can't be canceled
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
											
												// Show loading
												self.showLoading();
												
												// Prevent showing messages
												self.message.prevent();
											}
											
											// Check if preventing messages and it can be canceled
											if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
											
												// Replace message
												self.message.replace().then(function() {
											
													// Resolve
													resolve();
												});
											}
											
											// Otherwise
											else {
											
												// Hide message
												self.message.hide().then(function() {
												
													// Resolve
													resolve();
												});
											}
										}
										
										// Otherwise
										else {
								
											// Check if sleep is disabled
											if(sleepDisabled === true) {
											
												// Allow device to sleep and catch errors
												self.wakeLock.allowLock().catch(function(error) {
													
												// Finally
												}).finally(function() {
												
													// Check if unlock display is shown
													if(self.isUnlockDisplayShown() === true)
													
														// Enable tabbing to everything in unlock display and enable everything in unlock display
														self.unlockDisplay.find("*").enableTab().enable();
											
													// Otherwise check if unlocked display is shown
													else if(self.isUnlockedDisplayShown() === true)
													
														// Enable unlocked
														self.unlocked.enable();
													
													// Restore focus and don't blur
													self.focus.restore(false);
													
													// Check if preventing messages and it can be canceled
													if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
													
														// Replace message
														self.message.replace().then(function() {
													
															// Resolve
															resolve();
														});
													}
													
													// Otherwise
													else {
													
														// Hide message
														self.message.hide().then(function() {
														
															// Resolve
															resolve();
														});
													}
												});
											}
											
											// Otherwise
											else {
									
												// Check if unlock display is shown
												if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
												
												// Check if preventing messages and it can be canceled
												if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
												
													// Replace message
													self.message.replace().then(function() {
												
														// Resolve
														resolve();
													});
												}
												
												// Otherwise
												else {
												
													// Hide message
													self.message.hide().then(function() {
													
														// Resolve
														resolve();
													});
												}
											}
										}
									}
									
									// Otherwise
									else {
									
										// Check if preventing messages
										if(preventMessages === true) {
										
											// Check if can't be canceled
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
										
												// Prevent showing messages
												self.message.prevent();
											}
											
											// Check if preventing messages and it can be canceled
											if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
											}
											
											// Otherwise
											else {
											
												// Hide message
												self.message.hide().then(function() {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												});
											}
										}
										
										// Otherwise
										else {
									
											// Check if sleep is disabled
											if(sleepDisabled === true) {
											
												// Allow device to sleep and catch errors
												self.wakeLock.allowLock().catch(function(error) {
													
												// Finally
												}).finally(function() {
												
													// Check if unlock display is shown
													if(self.isUnlockDisplayShown() === true)
													
														// Enable tabbing to everything in unlock display and enable everything in unlock display
														self.unlockDisplay.find("*").enableTab().enable();
											
													// Otherwise check if unlocked display is shown
													else if(self.isUnlockedDisplayShown() === true)
													
														// Enable unlocked
														self.unlocked.enable();
													
													// Restore focus and don't blur
													self.focus.restore(false);
													
													// Check if preventing messages and it can be canceled
													if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
													}
													
													// Otherwise
													else {
													
														// Hide message
														self.message.hide().then(function() {
														
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
														});
													}
												});
											}
											
											// Otherwise
											else {
									
												// Check if unlock display is shown
												if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
												
												// Check if preventing messages and it can be canceled
												if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												}
												
												// Otherwise
												else {
												
													// Hide message
													self.message.hide().then(function() {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
													});
												}
											}
										}
									}
								}
								
								// Otherwise check if not preventing cancel on hide
								else if(preventCancelOnHide === false) {
								
									// Check if sleep is disabled
									if(sleepDisabled === true) {
									
										// Allow device to sleep and catch errors
										self.wakeLock.allowLock().catch(function(error) {
											
										// Finally
										}).finally(function() {
										
											// Reject canceled error
											reject(Common.CANCELED_ERROR);
										});
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
								}
							});
						}
						
						// Otherwise
						else {
						
							// Check if a high priority wallets exclusive transactions lock is waiting
							if(self.transactions.isHighPriorityWalletsExclusiveTransactionsLockWaiting(wallet.getKeyPath()) === true) {
							
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
							
							// Otherwise
							else {
						
								// Set timeout
								setTimeout(function() {
								
									// Prompt to approve
									promptToApprove();
									
								}, Application.CHECK_HARDWARE_WALLET_PRIORITY_INTERVAL_MILLISECONDS);
							}
						}
					}
					
					// Otherwise
					else {
					
						// Reject canceled error
						reject(Common.CANCELED_ERROR);
					}
				};
				
				// Prompt to approve
				promptToApprove();
			});
		}
		
		// Show hardware wallet connect message
		showHardwareWalletConnectMessage(wallet, text, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED, recursivelyShown = false) {
		
			// set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Prompt to connect
				var promptToConnect = function() {
				
					// Check if cancel didn't occur or recursively shown
					if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false || recursivelyShown === true) {
					
						// Check if preventing messages, recursively shown, or messages are allowed and no message is shown
						if(preventMessages === true || recursivelyShown === true || (self.message.getAllowed() === true && self.message.isShown() === false)) {
			
							// Initialize prevent cancel on hide
							var preventCancelOnHide = false;
							
							// Initialize external cancel check allowed
							var externalCancelCheckAllowed = true;
					
							// Return showing message and do it immediately if preventing messages or recursively shown
							return self.message.show(Language.getDefaultTranslation('Hardware Wallet Disconnected'), Message.createPendingResult() + Message.createLineBreak() + Message.createText(text, textArguments), preventMessages === true || recursivelyShown === true, function() {
							
								// Check if cancel didn't occur or recursively shown and wallet exists
								if((cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false || recursivelyShown === true) && self.wallets.walletExists(wallet.getKeyPath()) === true) {
								
									// Check if wallet's hardware wallet is connected
									if(wallet.isHardwareConnected() === true) {
									
										// Set prevent cancel on hide
										preventCancelOnHide = true;
										
										// Check if preventing messages
										if(preventMessages === true) {
										
											// Check if can't be canceled
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
										
												// Show loading
												self.showLoading();
											
												// Prevent showing messages
												self.message.prevent();
											}
										}
									
										// Resolve
										resolve();
										
										// Return false
										return false;
									}
									
									// Otherwise
									else {
									
										// Check if preventing messages
										if(preventMessages === true) {
									
											// Hide loading
											self.hideLoading();
										}
										
										// Otherwise
										else {
							
											// Save focus and blur
											self.focus.save(true);
											
											// Check if unlock display is shown
											if(self.isUnlockDisplayShown() === true)
											
												// Disable tabbing to everything in unlock display and disable everything in unlock display
												self.unlockDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Disable unlocked
												self.unlocked.disable();
										}
										
										// Document wallet connect application wallet key path event
										$(document).on(Wallet.CONNECT_EVENT + ".application" + wallet.getKeyPath().toFixed(), function(event, walletKeyPath) {
										
											// Check if wallet's hardware wallet is connected
											if(walletKeyPath === wallet.getKeyPath()) {
											
												// Turn off document wallet connect application wallet key path event
												$(document).off(Wallet.CONNECT_EVENT + ".application" + wallet.getKeyPath().toFixed());
												
												// Clear external cancel check allowed
												externalCancelCheckAllowed = false;
												
												// Disable message
												self.message.disable();
											
												// Set prevent cancel on hide
												preventCancelOnHide = true;
												
												// Check if preventing messages
												if(preventMessages === true) {
												
													// Check if can't be canceled
													if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
													
														// Show loading
														self.showLoading();
														
														// Prevent showing messages
														self.message.prevent();
													}
												}
												
												// Otherwise
												else {
										
													// Check if unlock display is shown
													if(self.isUnlockDisplayShown() === true)
													
														// Enable tabbing to everything in unlock display and enable everything in unlock display
														self.unlockDisplay.find("*").enableTab().enable();
											
													// Otherwise check if unlocked display is shown
													else if(self.isUnlockedDisplayShown() === true)
													
														// Enable unlocked
														self.unlocked.enable();
													
													// Restore focus and don't blur
													self.focus.restore(false);
												}
												
												// Check if preventing messages and it can be canceled
												if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
												
													// Return replacing message
													return self.message.replace().then(function() {
												
														// Resolve
														resolve();
													});
												}
												
												// Otherwise
												else {
												
													// Return hiding message
													return self.message.hide().then(function() {
													
														// Resolve
														resolve();
													});
												}
											}
										});
										
										// Cancel if external canceled
										var cancelIfExternalCanceled = function() {
										
											// Check if external cancel check if allowed
											if(externalCancelCheckAllowed === true) {
										
												// Check if cancel occurred and not recursively shown
												if(cancelOccurred !== Common.NO_CANCEL_OCCURRED && cancelOccurred() === true && recursivelyShown === false) {
												
													// Turn off document wallet connect application wallet key path event
													$(document).off(Wallet.CONNECT_EVENT + ".application" + wallet.getKeyPath().toFixed());
													
													// Disable message
													self.message.disable();
													
													// Set prevent cancel on hide
													preventCancelOnHide = true;
													
													// Check if preventing messages
													if(preventMessages === true) {
													
														// Check if can't be canceled
														if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
													
															// Prevent showing messages
															self.message.prevent();
														}
													}
													
													// Otherwise
													else {
												
														// Check if unlock display is shown
														if(self.isUnlockDisplayShown() === true)
														
															// Enable tabbing to everything in unlock display and enable everything in unlock display
															self.unlockDisplay.find("*").enableTab().enable();
												
														// Otherwise check if unlocked display is shown
														else if(self.isUnlockedDisplayShown() === true)
														
															// Enable unlocked
															self.unlocked.enable();
														
														// Restore focus and don't blur
														self.focus.restore(false);
													}
													
													// Check if preventing messages and it can be canceled
													if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
													}
													
													// Otherwise
													else {
													
														// Return hiding message
														return self.message.hide().then(function() {
														
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
														});
													}
												}
												
												// Otherwise
												else {
												
													// Set timeout
													setTimeout(function() {
													
														// Cancel if external canceled
														cancelIfExternalCanceled();
													
													}, Application.CANCELED_CHECK_INTERVAL_MILLISECONDS);
												}
											}
										};
										
										// Cancel if external canceled
										cancelIfExternalCanceled();
									}
								}
								
								// Otherwise
								else {
								
									// Return false
									return false;
								}
							
							}, Language.getDefaultTranslation('Cancel'), Language.getDefaultTranslation('Connect'), preventMessages === true || recursivelyShown === true, (allowUnlock === true) ? Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED : Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
							
								// Turn off document wallet connect application wallet key path event
								$(document).off(Wallet.CONNECT_EVENT + ".application" + wallet.getKeyPath().toFixed());
								
								// Clear external cancel check allowed
								externalCancelCheckAllowed = false;
								
								// Check if message was displayed
								if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
								
									// Check if connect
									if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
										
										// Return obtain wallets exclusive hardware lock
										return self.wallets.obtainExclusiveHardwareLock().then(function() {
										
											// Check if wallet still isn't connected to a hardware wallet
											if(wallet.isHardwareConnected() === false) {
										
												// Show hardware wallet error
												var showHardwareWalletError = function(message) {
												
													// Disable message
													self.message.disable();
												
													// Return promise
													return new Promise(function(resolve, reject) {
												
														// Return showing message immediately and allow showing messages
														return self.message.show(Language.getDefaultTranslation('Hardware Wallet Error'), message, true, function() {
														
															// Hide loading
															self.hideLoading();
															
														}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, (allowUnlock === true) ? Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED : Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
														
															// Check if message was displayed
															if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
															
																// Release wallets exclusive hardware lock
																self.wallets.releaseExclusiveHardwareLock();
																
																// Return showing hardware connect message immediately
																return self.showHardwareWalletConnectMessage(wallet, text, textArguments, allowUnlock, preventMessages, cancelOccurred, true).then(function() {
																
																	// Resolve
																	resolve();
																	
																// Catch errors
																}).catch(function(error) {
																
																	// Reject error
																	reject(error);
																});
															}
															
															// Otherwise
															else {
															
																// Release wallets exclusive hardware lock
																self.wallets.releaseExclusiveHardwareLock();
															
																// Reject canceled error
																reject(Common.CANCELED_ERROR);
															}
														});
													});
												};
										
												// Check if hardware wallets are supported
												if(HardwareWallet.isSupported() === true) {
													
													// Get if automatic lock state
													var automaticLockState = self.automaticLock.getAllowed();
													
													// Prevent inactive automatic lock
													self.automaticLock.prevent();
													
													// Initialize canceled
													var canceled = false;
													
													// Return showing message immediately and allow showing messages
													return self.message.show(Language.getDefaultTranslation('Hardware Wallet Disconnected'), Message.createPendingResult() + Message.createLineBreak() + Message.createText(Language.getDefaultTranslation('Connecting to a hardware wallet.')), true, function() {
													
														// Message show application hardware wallet connect event
														$(self.message).one(Message.SHOW_EVENT + ".applicationHardwareWalletConnect", function() {
														
															// Create hardware wallet
															var hardwareWallet = new HardwareWallet(self);
															
															// Message before replace application hardware wallet connect event
															$(self.message).on(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletConnect", function(event, messageType, messageData) {
															
																// Check if not canceled
																if(canceled === false) {
																
																	// Check message type
																	switch(messageType) {
																	
																		// Application hardware wallet unlock message
																		case Application.HARDWARE_WALLET_UNLOCK_MESSAGE:
																		
																			// Cancel replacing message
																			self.message.cancelReplace();
																			
																			// Return false to stop other replace message
																			return false;
																	
																		// Application hardware wallet disconnect message
																		case Application.HARDWARE_WALLET_DISCONNECT_MESSAGE:
																		
																			// Set canceled
																			canceled = true;
																			
																			// Turn off message before replace application hardware wallet connect event
																			$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletConnect");
																			
																			// Restore automatic lock state
																			self.automaticLock.allow(automaticLockState);
																				
																			// Check if automatic lock is locking and message doesn't allow unlock
																			if(self.automaticLock.isLocking() === true && allowUnlock === false) {
																			
																				// Release wallets exclusive hardware lock
																				self.wallets.releaseExclusiveHardwareLock();
																			
																				// Reject canceled error
																				reject(Common.CANCELED_ERROR);
																			}
																			
																			// Otherwise
																			else {
																			
																				// Show hardware wallet error
																				showHardwareWalletError(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.'))).then(function() {
																				
																					// Resolve
																					resolve();
																					
																				// Catch errors
																				}).catch(function(error) {
																				
																					// Reject error
																					reject(error);
																				});
																			}
																			
																			// Return false to stop other replace message
																			return false;
																	}
																}
															});
															
															// Return connecting to any hardware wallet descriptor
															return hardwareWallet.connect(HardwareWallet.ANY_HARDWARE_WALLET_DESCRIPTOR, false, Language.getDefaultTranslation('Unlock that hardware wallet to continue connecting to it.'), [], allowUnlock, true, cancelOccurred).then(function() {
															
																// Check if not canceled
																if(canceled === false) {
																
																	// Turn off message before replace application hardware wallet connect event
																	$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletConnect");
																
																	// Restore automatic lock state
																	self.automaticLock.allow(automaticLockState);
																	
																	// Check if automatic lock is locking and message doesn't allow unlock
																	if(self.automaticLock.isLocking() === true && allowUnlock === false) {
																	
																		// Close the hardware wallet
																		hardwareWallet.close();
																		
																		// Release wallets exclusive hardware lock
																		self.wallets.releaseExclusiveHardwareLock();
																	
																		// Reject canceled error
																		reject(Common.CANCELED_ERROR);
																		
																		// Return
																		return;
																	}
																
																	// Disable message
																	self.message.disable();
																	
																	// Return connecting wallet to the applicable hardware wallet
																	return wallet.connectToApplicableHardware([hardwareWallet]).then(function() {
																	
																		// Check if hardware wallet isn't in use
																		if(hardwareWallet.getInUse() === false) {
																		
																			// Close hardware wallet
																			hardwareWallet.close();
																			
																			// Return showing hardware wallet error
																			return showHardwareWalletError(Message.createText((wallet.getName() === Wallet.NO_NAME) ? Language.getDefaultTranslation('That hardware wallet isn\'t for Wallet %1$s.') : Language.getDefaultTranslation('That hardware wallet isn\'t for %1$y.'), [(wallet.getName() === Wallet.NO_NAME) ? wallet.getKeyPath().toFixed() : wallet.getName()])).then(function() {
																			
																				// Resolve
																				resolve();
																				
																			// Catch errors
																			}).catch(function(error) {
																			
																				// Reject error
																				reject(error);
																			});
																		}
																		
																		// Otherwise
																		else {
																		
																			
																			// Release wallets exclusive hardware lock
																			self.wallets.releaseExclusiveHardwareLock();
																			
																			// Check if preventing messages
																			if(preventMessages === true) {
																			
																				// Check if can't be canceled
																				if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
																			
																					// Show loading
																					self.showLoading();
																					
																					// Prevent showing messages
																					self.message.prevent();
																				}
																			}
																			
																			// Otherwise
																			else {
																	
																				// Check if unlock display is shown
																				if(self.isUnlockDisplayShown() === true)
																				
																					// Enable tabbing to everything in unlock display and enable everything in unlock display
																					self.unlockDisplay.find("*").enableTab().enable();
																		
																				// Otherwise check if unlocked display is shown
																				else if(self.isUnlockedDisplayShown() === true)
																				
																					// Enable unlocked
																					self.unlocked.enable();
																				
																				// Restore focus and don't blur
																				self.focus.restore(false);
																			}
																			
																			// Check if preventing messages and it can be canceled
																			if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
																			
																				// Return replacing message
																				return self.message.replace().then(function() {
																			
																					// Resolve
																					resolve();
																				});
																			}
																			
																			// Otherwise
																			else {
																			
																				// Return hiding message
																				return self.message.hide().then(function() {
																				
																					// Resolve
																					resolve();
																				});
																			}
																		}
																	
																	// Catch errors
																	}).catch(function(error) {
																	
																		// Close the hardware wallet
																		hardwareWallet.close();
																		
																		// Return showing hardware wallet error
																		return showHardwareWalletError(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.'))).then(function() {
																		
																			// Resolve
																			resolve();
																			
																		// Catch errors
																		}).catch(function(error) {
																		
																			// Reject error
																			reject(error);
																		});
																	});
																}
																
																// Otherwise
																else {
																
																	// Close the hardware wallet
																	hardwareWallet.close();
																}
															
															// Catch errors
															}).catch(function(error) {
															
																// Check if not canceled
																if(canceled === false) {
																
																	// Turn off message before replace application hardware wallet connect event
																	$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletConnect");
																
																	// Restore automatic lock state
																	self.automaticLock.allow(automaticLockState);
																		
																	// Check if automatic lock is locking and message doesn't allow unlock
																	if(self.automaticLock.isLocking() === true && allowUnlock === false) {
																		
																		// Release wallets exclusive hardware lock
																		self.wallets.releaseExclusiveHardwareLock();
																	
																		// Reject canceled error
																		reject(Common.CANCELED_ERROR);
																		
																		// Return
																		return;
																	}
																	
																	// Check if error is canceled
																	if(error === Common.CANCELED_ERROR) {
																	
																		// Release wallets exclusive hardware lock
																		self.wallets.releaseExclusiveHardwareLock();
																	
																		// Check if preventing messages
																		if(preventMessages === true) {
																		
																			// Check if can't be canceled
																			if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
																		
																				// Prevent showing messages
																				self.message.prevent();
																			}
																		}
																		
																		// Otherwise
																		else {
																	
																			// Check if unlock display is shown
																			if(self.isUnlockDisplayShown() === true)
																			
																				// Enable tabbing to everything in unlock display and enable everything in unlock display
																				self.unlockDisplay.find("*").enableTab().enable();
																	
																			// Otherwise check if unlocked display is shown
																			else if(self.isUnlockedDisplayShown() === true)
																			
																				// Enable unlocked
																				self.unlocked.enable();
																			
																			// Restore focus and don't blur
																			self.focus.restore(false);
																		}
																		
																		// Check if preventing messages and it can be canceled
																		if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
																		
																			// Reject canceled error
																			reject(Common.CANCELED_ERROR);
																		}
																		
																		// Otherwise
																		else {
																		
																			// Return hiding message
																			return self.message.hide().then(function() {
																			
																				// Reject canceled error
																				reject(Common.CANCELED_ERROR);
																			});
																		}
																	}
																	
																	// Otherwise
																	else {
																
																		// Return showing hardware wallet error
																		return showHardwareWalletError(error).then(function() {
																		
																			// Resolve
																			resolve();
																			
																		// Catch errors
																		}).catch(function(error) {
																		
																			// Reject error
																			reject(error);
																		});
																	}
																}
															});
														});
													
													}, Language.getDefaultTranslation('Back'), Message.NO_BUTTON, true, (allowUnlock === true) ? Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED : Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
													
														// Turn off message show application hardware wallet connect event
														$(self.message).off(Message.SHOW_EVENT + ".applicationHardwareWalletConnect");
														
														// Check if message was displayed
														if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
														
															// Check if not canceled
															if(canceled === false) {
														
																// Set canceled
																canceled = true;
																
																// Turn off message before replace application hardware wallet connect event
																$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletConnect");
														
																// Release wallets exclusive hardware lock
																self.wallets.releaseExclusiveHardwareLock();
																
																// Restore automatic lock state
																self.automaticLock.allow(automaticLockState);
																
																// Check if automatic lock is locking and message doesn't allow unlock
																if(self.automaticLock.isLocking() === true && allowUnlock === false) {
																	
																	// Reject canceled error
																	reject(Common.CANCELED_ERROR);
																	
																	// Return
																	return;
																}
																
																// Return showing hardware connect message immediately
																return self.showHardwareWalletConnectMessage(wallet, text, textArguments, allowUnlock, preventMessages, cancelOccurred, true).then(function() {
																
																	// Resolve
																	resolve();
																	
																// Catch errors
																}).catch(function(error) {
																
																	// Reject error
																	reject(error);
																});
															}
														}
													});
												}
												
												// Otherwise
												else {
												
													// Return showing hardware wallet error
													return showHardwareWalletError(Message.createText(Language.getDefaultTranslation('Your browser doesn\'t allow using USB or Bluetooth devices.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Update your browser to use this feature.'))).then(function() {
																			
														// Resolve
														resolve();
														
													// Catch errors
													}).catch(function(error) {
													
														// Reject error
														reject(error);
													});
												}
											}
											
											// Otherwise
											else {
											
												// Release wallets exclusive hardware lock
												self.wallets.releaseExclusiveHardwareLock();
												
												// Check if preventing messages
												if(preventMessages === true) {
												
													// Check if can't be canceled
													if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
												
														// Show loading
														self.showLoading();
													
														// Prevent showing messages
														self.message.prevent();
													}
												}
												
												// Otherwise
												else {
										
													// Check if unlock display is shown
													if(self.isUnlockDisplayShown() === true)
													
														// Enable tabbing to everything in unlock display and enable everything in unlock display
														self.unlockDisplay.find("*").enableTab().enable();
											
													// Otherwise check if unlocked display is shown
													else if(self.isUnlockedDisplayShown() === true)
													
														// Enable unlocked
														self.unlocked.enable();
													
													// Restore focus and don't blur
													self.focus.restore(false);
												}
												
												// Check if preventing messages and it can be canceled
												if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
												
													// Return replacing message
													return self.message.replace().then(function() {
												
														// Resolve
														resolve();
													});
												}
												
												// Otherwise
												else {
												
													// Return hiding message
													return self.message.hide().then(function() {
													
														// Resolve
														resolve();
													});
												}
											}
										});
									}
									
									// Otherwise
									else {
								
										// Check if preventing messages
										if(preventMessages === true) {
										
											// Check if can't be canceled
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
										
												// Prevent showing messages
												self.message.prevent();
											}
										}
										
										// Otherwise
										else {
									
											// Check if unlock display is shown
											if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
										}
										
										// Check if preventing messages and it can be canceled
										if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
										
											// Reject canceled error
											reject(Common.CANCELED_ERROR);
										}
										
										// Otherwise
										else {
										
											// Return hiding message
											return self.message.hide().then(function() {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
											});
										}
									}
								}
								
								// Otherwise check if not preventing cancel on hide
								else if(preventCancelOnHide === false) {
								
									// Reject canceled error
									reject(Common.CANCELED_ERROR);
								}
							});
						}
						
						// Otherwise
						else {
						
							// Check if a high priority wallets exclusive transactions lock is waiting
							if(self.transactions.isHighPriorityWalletsExclusiveTransactionsLockWaiting(wallet.getKeyPath()) === true) {
							
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
							
							// Otherwise
							else {
						
								// Set timeout
								setTimeout(function() {
								
									// Prompt to connect
									promptToConnect();
									
								}, Application.CHECK_HARDWARE_WALLET_PRIORITY_INTERVAL_MILLISECONDS);
							}
						}
					}
					
					// Otherwise
					else {
					
						// Reject canceled error
						reject(Common.CANCELED_ERROR);
					}
				};
				
				// Prompt to connect
				promptToConnect();
			});
		}
		
		// Show hardware wallet unlock message
		showHardwareWalletUnlockMessage(hardwareWallet, text, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Prompt to unlock
				var promptToUnlock = function() {
				
					// Check if cancel didn't occur
					if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
					
						// Check if preventing messages or messages are allowed and no message is shown
						if(preventMessages === true || (self.message.getAllowed() === true && self.message.isShown() === false)) {
					
							// Initialize prevent cancel on hide
							var preventCancelOnHide = false;
							
							// Initialize external cancel check allowed
							var externalCancelCheckAllowed = true;
							
							// Check hardware wallet's transport type
							switch(hardwareWallet.transport.type) {
							
								// Ledger type
								case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
								
									// Set message
									var message = Message.createPendingResult() + Message.createLineBreak() + Message.createText(text, textArguments);
									
									// Set second button
									var secondButton = Message.NO_BUTTON;
									
									// Break
									break;
								
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
								
									// Check hardware wallet's transport product name
									switch(hardwareWallet.transport["deviceModel"]["productName"]) {
									
										// Trezor Model One
										case "Trezor Model One":
						
											// Set message
											var message = Message.createText(text, textArguments) + Message.createLineBreak() + "<b>" + Message.createText(Language.getDefaultTranslation('Enter your pin as the following alphabetic characters to unlock the hardware wallet.')) + "</b>" + Message.createLineBreak() + Message.createPinMatrix() + Message.createLineBreak() + Message.createLineBreak() + Message.createInput(Language.getDefaultTranslation('Pin'), [], false) + Message.createLineBreak();
											
											// Set second button
											var secondButton = Language.getDefaultTranslation('Unlock');
											
											// Break
											break;
										
										// Trezor Model T, Trezor Safe 3, Trezor Safe 5, or default
										case "Trezor Model T":
										case "Trezor Safe 3":
										case "Trezor Safe 5":
										default:
										
											// Set message
											var message = Message.createPendingResult() + Message.createLineBreak() + Message.createText(text, textArguments);
											
											// Set second button
											var secondButton = Message.NO_BUTTON;
											
											// Break
											break;
									}
								
									// Break
									break;
							}
						
							// Return showing message and do it immediately if preventing messages
							return self.message.show(Language.getDefaultTranslation('Hardware Wallet Locked'), message, preventMessages === true, function() {
							
								// Check if cancel didn't occur
								if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
							
									// Check if hardware wallet is connected and locked
									if(hardwareWallet.isConnected() === true && hardwareWallet.isLocked() === true) {
									
										// Check if preventing messages
										if(preventMessages === true) {
									
											// Hide loading
											self.hideLoading();
										}
										
										// Otherwise
										else {
									
											// Save focus and blur
											self.focus.save(true);
											
											// Check if unlock display is shown
											if(self.isUnlockDisplayShown() === true)
											
												// Disable tabbing to everything in unlock display and disable everything in unlock display
												self.unlockDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Disable unlocked
												self.unlocked.disable();
										}
										
										// Hardware wallet unlock application event
										$(hardwareWallet).one(HardwareWallet.UNLOCK_EVENT + ".application", function(event) {
										
											// Turn off hardware wallet disconnect application event
											$(hardwareWallet).off(HardwareWallet.DISCONNECT_EVENT + ".application");
											
											// Turn off hardware wallet before disconnect application event
											$(hardwareWallet).off(HardwareWallet.BEFORE_DISCONNECT_EVENT + ".application");
											
											// Turn off hardware wallet device cancel application event
											$(hardwareWallet).off(HardwareWallet.DEVICE_CANCEL_EVENT + ".application");
											
											// Clear external cancel check allowed
											externalCancelCheckAllowed = false;
											
											// Disable message
											self.message.disable();
											
											// Set prevent cancel on hide
											preventCancelOnHide = true;
											
											// Check if preventing messages
											if(preventMessages === true) {
											
												// Check if can't be canceled
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
											
													// Show loading
													self.showLoading();
													
													// Prevent showing messages
													self.message.prevent();
												}
											}
											
											// Otherwise
											else {
									
												// Check if unlock display is shown
												if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
											}
											
											// Check if preventing messages and it can be canceled
											if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
											
												// Return replacing message
												return self.message.replace(Application.HARDWARE_WALLET_UNLOCK_MESSAGE).then(function() {
											
													// Resolve
													resolve();
												});
											}
											
											// Otherwise
											else {
											
												// Return hiding message
												return self.message.hide().then(function() {
												
													// Resolve
													resolve();
												});
											}
										});
										
										// Hardware wallet disconnect application event
										$(hardwareWallet).one(HardwareWallet.DISCONNECT_EVENT + ".application", function(event) {
										
											// Turn off hardware wallet unlock application event
											$(hardwareWallet).off(HardwareWallet.UNLOCK_EVENT + ".application");
											
											// Turn off hardware wallet before disconnect application event
											$(hardwareWallet).off(HardwareWallet.BEFORE_DISCONNECT_EVENT + ".application");
											
											// Turn off hardware wallet device cancel application event
											$(hardwareWallet).off(HardwareWallet.DEVICE_CANCEL_EVENT + ".application");
											
											// Clear external cancel check allowed
											externalCancelCheckAllowed = false;
											
											// Disable message
											self.message.disable();
											
											// Set prevent cancel on hide
											preventCancelOnHide = true;
											
											// Check if preventing messages
											if(preventMessages === true) {
											
												// Check if can't be canceled
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
											
													// Show loading
													self.showLoading();
													
													// Prevent showing messages
													self.message.prevent();
												}
											}
											
											// Otherwise
											else {
									
												// Check if unlock display is shown
												if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
											}
											
											// Check if preventing messages and it can be canceled
											if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
											
												// Return replacing message
												return self.message.replace(Application.HARDWARE_WALLET_DISCONNECT_MESSAGE).then(function() {
												
													// Resolve
													resolve();
												});
											}
											
											// Otherwise
											else {
											
												// Return hiding message
												return self.message.hide().then(function() {
												
													// Resolve
													resolve();
												});
											}
										});
										
										// Hardware wallet before disconnect application event
										$(hardwareWallet).one(HardwareWallet.BEFORE_DISCONNECT_EVENT + ".application", function(event) {
										
											// Turn off hardware wallet unlock application event
											$(hardwareWallet).off(HardwareWallet.UNLOCK_EVENT + ".application");
											
											// Turn off hardware wallet disconnect application event
											$(hardwareWallet).off(HardwareWallet.DISCONNECT_EVENT + ".application");
											
											// Turn off hardware wallet device cancel application event
											$(hardwareWallet).off(HardwareWallet.DEVICE_CANCEL_EVENT + ".application");
											
											// Clear external cancel check allowed
											externalCancelCheckAllowed = false;
											
											// Disable message
											self.message.disable();
											
											// Set prevent cancel on hide
											preventCancelOnHide = true;
											
											// Check if preventing messages
											if(preventMessages === true) {
											
												// Check if can't be canceled
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
											
													// Show loading
													self.showLoading();
													
													// Prevent showing messages
													self.message.prevent();
												}
											}
											
											// Otherwise
											else {
									
												// Check if unlock display is shown
												if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
											}
											
											// Check if preventing messages and it can be canceled
											if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
											
												// Return replacing message
												return self.message.replace(Application.HARDWARE_WALLET_DISCONNECT_MESSAGE).then(function() {
											
													// Resolve
													resolve();
												});
											}
											
											// Otherwise
											else {
											
												// Return hiding message
												return self.message.hide().then(function() {
												
													// Resolve
													resolve();
												});
											}
										});
										
										// Hardware wallet device cancel application event
										$(hardwareWallet).one(HardwareWallet.DEVICE_CANCEL_EVENT + ".application", function(event) {
										
											// Turn off hardware wallet unlock application event
											$(hardwareWallet).off(HardwareWallet.UNLOCK_EVENT + ".application");
											
											// Turn off hardware wallet disconnect application event
											$(hardwareWallet).off(HardwareWallet.DISCONNECT_EVENT + ".application");
											
											// Turn off hardware wallet before disconnect application event
											$(hardwareWallet).off(HardwareWallet.BEFORE_DISCONNECT_EVENT + ".application");
											
											// Clear external cancel check allowed
											externalCancelCheckAllowed = false;
											
											// Disable message
											self.message.disable();
											
											// Set prevent cancel on hide
											preventCancelOnHide = true;
											
											// Check if preventing messages
											if(preventMessages === true) {
											
												// Check if can't be canceled
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
											
													// Prevent showing messages
													self.message.prevent();
												}
											}
											
											// Otherwise
											else {
										
												// Check if unlock display is shown
												if(self.isUnlockDisplayShown() === true)
												
													// Enable tabbing to everything in unlock display and enable everything in unlock display
													self.unlockDisplay.find("*").enableTab().enable();
										
												// Otherwise check if unlocked display is shown
												else if(self.isUnlockedDisplayShown() === true)
												
													// Enable unlocked
													self.unlocked.enable();
												
												// Restore focus and don't blur
												self.focus.restore(false);
											}
											
											// Check if preventing messages and it can be canceled
											if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
											}
											
											// Otherwise
											else {
											
												// Return hiding message
												return self.message.hide().then(function() {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												});
											}
										});
										
										// Cancel if external canceled
										var cancelIfExternalCanceled = function() {
										
											// Check if external cancel check if allowed
											if(externalCancelCheckAllowed === true) {
										
												// Check if cancel occurred
												if(cancelOccurred !== Common.NO_CANCEL_OCCURRED && cancelOccurred() === true) {
												
													// Turn off hardware wallet unlock application event
													$(hardwareWallet).off(HardwareWallet.UNLOCK_EVENT + ".application");
													
													// Turn off hardware wallet disconnect application event
													$(hardwareWallet).off(HardwareWallet.DISCONNECT_EVENT + ".application");
													
													// Turn off hardware wallet before disconnect application event
													$(hardwareWallet).off(HardwareWallet.BEFORE_DISCONNECT_EVENT + ".application");
													
													// Turn off hardware wallet device cancel application event
													$(hardwareWallet).off(HardwareWallet.DEVICE_CANCEL_EVENT + ".application");
													
													// Disable message
													self.message.disable();
													
													// Set prevent cancel on hide
													preventCancelOnHide = true;
													
													// Check if preventing messages
													if(preventMessages === true) {
													
														// Check if can't be canceled
														if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
													
															// Prevent showing messages
															self.message.prevent();
														}
													}
													
													// Otherwise
													else {
												
														// Check if unlock display is shown
														if(self.isUnlockDisplayShown() === true)
														
															// Enable tabbing to everything in unlock display and enable everything in unlock display
															self.unlockDisplay.find("*").enableTab().enable();
												
														// Otherwise check if unlocked display is shown
														else if(self.isUnlockedDisplayShown() === true)
														
															// Enable unlocked
															self.unlocked.enable();
														
														// Restore focus and don't blur
														self.focus.restore(false);
													}
													
													// Check if preventing messages and it can be canceled
													if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
													}
													
													// Otherwise
													else {
													
														// Return hiding message
														return self.message.hide().then(function() {
														
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
														});
													}
												}
												
												// Otherwise
												else {
												
													// Set timeout
													setTimeout(function() {
													
														// Cancel if external canceled
														cancelIfExternalCanceled();
													
													}, Application.CANCELED_CHECK_INTERVAL_MILLISECONDS);
												}
											}
										};
										
										// Cancel if external canceled
										cancelIfExternalCanceled();
									}
									
									// Otherwise
									else {
									
										// Set prevent cancel on hide
										preventCancelOnHide = true;
										
										// Resolve
										resolve();
									
										// Return false
										return false;
									}
								}
								
								// Otherwise
								else {
								
									// Return false
									return false;
								}
							
							}, Language.getDefaultTranslation('Cancel'), secondButton, preventMessages === true, (allowUnlock === true) ? Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED : Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
							
								// Turn off hardware wallet unlock application event
								$(hardwareWallet).off(HardwareWallet.UNLOCK_EVENT + ".application");
								
								// Turn off hardware wallet disconnect application event
								$(hardwareWallet).off(HardwareWallet.DISCONNECT_EVENT + ".application");
								
								// Turn off hardware wallet before disconnect application event
								$(hardwareWallet).off(HardwareWallet.BEFORE_DISCONNECT_EVENT + ".application");
								
								// Turn off hardware wallet device cancel application event
								$(hardwareWallet).off(HardwareWallet.DEVICE_CANCEL_EVENT + ".application");
								
								// Clear external cancel check allowed
								externalCancelCheckAllowed = false;
								
								// Check if canceling
								if(messageResult === Message.FIRST_BUTTON_CLICKED_RESULT) {
								
									// Check if preventing messages
									if(preventMessages === true) {
									
										// Check if can't be canceled
										if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
									
											// Prevent showing messages
											self.message.prevent();
										}
									}
									
									// Otherwise
									else {
								
										// Check if unlock display is shown
										if(self.isUnlockDisplayShown() === true)
										
											// Enable tabbing to everything in unlock display and enable everything in unlock display
											self.unlockDisplay.find("*").enableTab().enable();
								
										// Otherwise check if unlocked display is shown
										else if(self.isUnlockedDisplayShown() === true)
										
											// Enable unlocked
											self.unlocked.enable();
										
										// Restore focus and don't blur
										self.focus.restore(false);
									}
									
									// Check if preventing messages and it can be canceled
									if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
									
									// Otherwise
									else {
									
										// Return hiding message
										return self.message.hide().then(function() {
										
											// Reject canceled error
											reject(Common.CANCELED_ERROR);
										});
									}
								}
								
								// Otherwise check if second button was clicked
								else if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
								
									// Try
									try {
								
										// Get alphabetic pin
										var alphabeticPin = self.message.getInputText().trim();
									}
									
									// Catch errors
									catch(error) {
									
										// Check if preventing messages
										if(preventMessages === true) {
										
											// Check if can't be canceled
											if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
										
												// Prevent showing messages
												self.message.prevent();
											}
										}
										
										// Otherwise
										else {
									
											// Check if unlock display is shown
											if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
										}
										
										// Check if preventing messages and it can be canceled
										if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
										
											// Reject
											reject();
										}
										
										// Otherwise
										else {
										
											// Return hiding message
											return self.message.hide().then(function() {
											
												// Reject
												reject();
											});
										}
										
										// Return
										return;
									}
									
									// Show loading
									self.showLoading();
								
									// Set that message second button is loading
									self.message.setButtonLoading(Message.SECOND_BUTTON);
									
									// Disable message
									self.message.disable();
									
									// Resolve alphabetic pin
									resolve(alphabeticPin);
								}
								
								// Otherwise check if not preventing cancel on hide
								else if(preventCancelOnHide === false) {
								
									// Reject canceled error
									reject(Common.CANCELED_ERROR);
								}
							});
						}
						
						// Otherwise
						else {
						
							// Check if a high priority wallets exclusive transactions lock is waiting
							if(self.transactions.isHighPriorityWalletsExclusiveTransactionsLockWaiting(hardwareWallet.getWalletKeyPath()) === true) {
							
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
							
							// Otherwise
							else {
						
								// Set timeout
								setTimeout(function() {
								
									// Prompt to unlock
									promptToUnlock();
									
								}, Application.CHECK_HARDWARE_WALLET_PRIORITY_INTERVAL_MILLISECONDS);
							}
						}
					}
						
					// Otherwise
					else {
					
						// Reject canceled error
						reject(Common.CANCELED_ERROR);
					}
				};
				
				// Prompt to unlock
				promptToUnlock();
			});
		}
		
		// Hardware wallet unlock message done
		hardwareWalletUnlockMessageDone(preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED, replaceMessage = true) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if preventing messages
				if(preventMessages === true) {
				
					// Check if can't be canceled
					if(cancelOccurred === Common.NO_CANCEL_OCCURRED) {
				
						// Show loading
						self.showLoading();
						
						// Prevent showing messages
						self.message.prevent();
					}
					
					// Otherwise check if replacing message
					else if(replaceMessage === true) {
					
						// Hide loading
						self.hideLoading();
					}
				}
				
				// Otherwise
				else {
				
					// Check if replacing message
					if(replaceMessage === true) {
				
						// Hide loading
						self.hideLoading();
			
						// Check if unlock display is shown
						if(self.isUnlockDisplayShown() === true)
						
							// Enable tabbing to everything in unlock display and enable everything in unlock display
							self.unlockDisplay.find("*").enableTab().enable();
				
						// Otherwise check if unlocked display is shown
						else if(self.isUnlockedDisplayShown() === true)
						
							// Enable unlocked
							self.unlocked.enable();
						
						// Restore focus and don't blur
						self.focus.restore(false);
					}
				}
				
				// Check if preventing messages and it can be canceled
				if(preventMessages === true && cancelOccurred !== Common.NO_CANCEL_OCCURRED) {
				
					// Check if replacing message
					if(replaceMessage === true) {
				
						// Return replacing message
						return self.message.replace(Application.HARDWARE_WALLET_UNLOCK_MESSAGE).then(function() {
					
							// Resolve
							resolve();
						});
					}
					
					// Otherwise
					else {
					
						// Resolve
						resolve();
					}
				}
				
				// Otherwise
				else {
				
					// Check if replacing message
					if(replaceMessage === true) {
				
						// Return hiding message
						return self.message.hide().then(function() {
						
							// Resolve
							resolve();
						});
					}
					
					// Otherwise
					else {
					
						// Resolve
						resolve();
					}
				}
			});
		}
		
		// Show hardware wallet pending message
		showHardwareWalletPendingMessage(hardwareWallet, text, allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED, recursivelyShown = false, rootCanceled = undefined) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Prompt to approve
				var promptToApprove = function() {
				
					// Check if cancel didn't occur or recursively shown
					if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false || recursivelyShown === true) {
					
						// Check if preventing messages, recursively shown, or messages are allowed and no message is shown
						if(preventMessages === true || recursivelyShown === true || (self.message.getAllowed() === true && self.message.isShown() === false)) {
				
							// Initialize canceled
							var canceled = {
							
								// Value
								"Value": false
							};
							
							// Initialize sleep disabled
							var sleepDisabled = false;
						
							// Return showing message and do it immediately if preventing messages or recursively shown
							return self.message.show(Language.getDefaultTranslation('Hardware Wallet Approval Requested'), text, preventMessages === true || recursivelyShown === true, function() {
							
								// Check if cancel didn't occur or recursively shown
								if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false || recursivelyShown === true) {
							
									// Check if hardware wallet is connected
									if(hardwareWallet.isConnected() === true) {
									
										// Check if preventing messages
										if(preventMessages === true) {
									
											// Hide loading
											self.hideLoading();
										}
										
										// Otherwise
										else {
										
											// Save focus and blur
											self.focus.save(true);
											
											// Check if unlock display is shown
											if(self.isUnlockDisplayShown() === true)
											
												// Disable tabbing to everything in unlock display and disable everything in unlock display
												self.unlockDisplay.find("*").disableTab().disable();
											
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Disable unlocked
												self.unlocked.disable();
											
											// Keep device awake and catch errors
											self.wakeLock.preventLock().catch(function(error) {
											
											});
										
											// Set sleep disabled
											sleepDisabled = true;
										}
										
										// Message before replace application hardware wallet approve event
										$(self.message).on(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletApprove", function(event, messageType, messageData) {
										
											// Check if message type is hardware wallet unlock message
											if(messageType === Application.HARDWARE_WALLET_UNLOCK_MESSAGE) {
											
												// Turn off message before replace application hardware wallet approve event
												$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletApprove");
												
												// Show hardware wallet pending message and catch errors
												self.showHardwareWalletPendingMessage(hardwareWallet, text, allowUnlock, preventMessages, cancelOccurred, true, (recursivelyShown === true) ? rootCanceled : canceled).catch(function(error) {
												
													// Replace message
													self.message.replace(Application.HARDWARE_WALLET_DISCONNECT_MESSAGE);
												});
												
												// Return false to stop other replace message
												return false;
											}
										});
										
										// Message show application hardware wallet approve event
										$(self.message).one(Message.SHOW_EVENT + ".applicationHardwareWalletApprove", function() {
										
											// Resolve canceled
											resolve(function() {
											
												// Return if canceled
												return canceled["Value"] === true;
											});
										});
									}
									
									// Otherwise
									else {
									
										// Reject hardware wallet disconnected error
										reject(HardwareWallet.DISCONNECTED_ERROR);
									
										// Return false
										return false;
									}
								}
								
								// Otherwise
								else {
								
									// Return false
									return false;
								}
							
							}, Language.getDefaultTranslation('Cancel'), Message.NO_BUTTON, preventMessages === true || recursivelyShown === true, (allowUnlock === true) ? Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED : Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
							
								// Turn off message show application hardware wallet approve event
								$(self.message).off(Message.SHOW_EVENT + ".applicationHardwareWalletApprove");
								
								// Check if message was displayed
								if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
								
									// Turn off message before replace application hardware wallet approve event
									$(self.message).off(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletApprove");
									
									// Check if recursively shown
									if(recursivelyShown === true) {
									
										// Set root canceled
										rootCanceled["Value"] = true;
									}
									
									// Otherwise
									else {
								
										// Set canceled
										canceled["Value"] = true;
									}
									
									// Check if sleep is disabled
									if(sleepDisabled === true) {
									
										// Allow device to sleep and catch errors
										self.wakeLock.allowLock().catch(function(error) {
											
										// Finally
										}).finally(function() {
										
											// Check if unlock display is shown
											if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
											
											// Hide message
											self.message.hide().then(function() {
											
												// Replace message
												self.message.replace(Application.HARDWARE_WALLET_DISCONNECT_MESSAGE);
											});
										});
									}
									
									// Otherwise
									else {
									
										// Check if preventing messages
										if(preventMessages === true) {
										
											// Prevent showing messages
											self.message.prevent();
										}
										
										// Otherwise
										else {
										
											// Check if unlock display is shown
											if(self.isUnlockDisplayShown() === true)
											
												// Enable tabbing to everything in unlock display and enable everything in unlock display
												self.unlockDisplay.find("*").enableTab().enable();
									
											// Otherwise check if unlocked display is shown
											else if(self.isUnlockedDisplayShown() === true)
											
												// Enable unlocked
												self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
										}
										
										// Hide message
										self.message.hide().then(function() {
										
											// Replace message
											self.message.replace(Application.HARDWARE_WALLET_DISCONNECT_MESSAGE);
										});
									}
								}
								
								// Otherwise check if sleep is disabled
								else if(sleepDisabled === true) {
								
									// Allow device to sleep and catch errors
									self.wakeLock.allowLock().catch(function(error) {
										
									// Finally
									}).finally(function() {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									});
								}
								
								// Otherwise
								else {
								
									// Reject canceled error
									reject(Common.CANCELED_ERROR);
								}
							});
						}
						
						// Otherwise
						else {
						
							// Check if a high priority wallets exclusive transactions lock is waiting
							if(self.transactions.isHighPriorityWalletsExclusiveTransactionsLockWaiting(hardwareWallet.getWalletKeyPath()) === true) {
							
								// Reject canceled error
								reject(Common.CANCELED_ERROR);
							}
							
							// Otherwise
							else {
						
								// Set timeout
								setTimeout(function() {
								
									// Prompt to approve
									promptToApprove();
									
								}, Application.CHECK_HARDWARE_WALLET_PRIORITY_INTERVAL_MILLISECONDS);
							}
						}
					}
					
					// Otherwise
					else {
					
						// Reject canceled error
						reject(Common.CANCELED_ERROR);
					}
				};
				
				// Prompt to approve
				promptToApprove();
			});
		}
		
		// Hardware wallet pending message done
		hardwareWalletPendingMessageDone(preventMessages = false) {
		
			// Turn off message before replace application hardware wallet approve event
			$(this.message).off(Message.BEFORE_REPLACE_EVENT + ".applicationHardwareWalletApprove");
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if preventing messages
				if(preventMessages === true) {
				
					// Show loading
					self.showLoading();
					
					// Prevent showing messages
					self.message.prevent();
				}
				
				// Otherwise
				else {
				
					// Hide loading
					self.hideLoading();
		
					// Check if unlock display is shown
					if(self.isUnlockDisplayShown() === true)
					
						// Enable tabbing to everything in unlock display and enable everything in unlock display
						self.unlockDisplay.find("*").enableTab().enable();
			
					// Otherwise check if unlocked display is shown
					else if(self.isUnlockedDisplayShown() === true)
					
						// Enable unlocked
						self.unlocked.enable();
					
					// Restore focus and don't blur
					self.focus.restore(false);
				}
				
				// Return hiding message
				return self.message.hide().then(function() {
				
					// Resolve
					resolve();
				});
			});
		}
		
		// Is disabled
		isDisabled() {
		
			// Check if create display is shown
			if(this.isCreateDisplayShown() === true) {
			
				// Return if create display is disabled
				return this.createDisplay.children("div").first().attr("tabindex") === Common.NO_TAB_INDEX;
			}
			
			// Otherwise check if unlock display is shown
			else if(this.isUnlockDisplayShown() === true) {
			
				// Return if unlock display is disabled
				return this.unlockDisplay.children("div").first().attr("tabindex") === Common.NO_TAB_INDEX;
			}
			
			// Otherwise
			else {
			
				// Return false
				return false;
			}
		}
		
		// Show loading delay milliseconds
		static get SHOW_LOADING_DELAY_MILLISECONDS() {
		
			// Return show loading delay milliseconds
			return 100;
		}
		
		// Hardware wallet disconnect message
		static get HARDWARE_WALLET_DISCONNECT_MESSAGE() {
		
			// Return hardware wallet disconnect message
			return "ApplicationHardwareWalletDisconnectMessage";
		}
		
		// Hardware wallet unlock message
		static get HARDWARE_WALLET_UNLOCK_MESSAGE() {
		
			// Return hardware wallet unlock message
			return "ApplicationHardwareWalletUnlockMessage";
		}
	
	// Private
	
		// Is not iframe
		isNotIframe() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if not an iframe
				if(Common.isIframe() === false)
				
					// Resolve
					resolve();
				
				// Otherwise
				else {
				
					// Check if is an extension
					if(Common.isExtension() === true) {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('This extension won\'t run when it\'s embedded in a site.'));
					}
					
					// Otherwise check if is an app
					else if(Common.isApp() === true) {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('This app won\'t run when it\'s embedded in a site.'));
					}
					
					// Otherwise
					else {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('This site won\'t run when it\'s embedded in a site. Visit %1$l to continue.'), [
					
							[
								// Text
								Language.getDefaultTranslation('MWC Wallet'),
								
								// URL
								location["href"],
								
								// Is external
								true,
								
								// Is blob
								false
							]
						]);
					}
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Error'), message, false, function() {
					
						// Hide loading
						self.hideLoading();
					
						// Hide loading display spinner
						self.loadingDisplay.children("div.spinner").addClass("hide");
					
					}, Message.NO_BUTTON, Message.NO_BUTTON, true);
				}
			});
		}
		
		// Browser is compatible
		browserIsCompatible() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Try
				try {
			
					// Check if math isn't supported
					if(typeof Math !== "object" || Math === null)
					
						// Throw error
						throw "Math isn't supported.";
					
					// Otherwise check if document isn't supported
					else if(typeof document !== "object" || document === null)
					
						// Throw error
						throw "Document isn't supported.";
					
					// Otherwise check if window isn't supported
					else if(typeof window !== "object" || window === null)
					
						// Throw error
						throw "Window isn't supported.";
					
					// Otherwise check if global this isn't supported
					else if(typeof globalThis !== "object" || globalThis === null)
					
						// Throw error
						throw "Global this isn't supported.";

					// Otherwise Check if promises aren't supported
					else if(typeof Promise !== "function")
					
						// Throw error
						throw "Promises aren't supported.";
					
					// Otherwise check if crypto isn't supported
					else if(typeof crypto !== "object" || crypto === null)
					
						// Throw error
						throw "Crypto isn't supported.";
					
					// Otherwise check if IndexedDB isn't supported
					else if(typeof indexedDB !== "object" || indexedDB === null)
					
						// Throw error
						throw "IndexedDB isn't supported.";
					
					// Otherwise check if IDBKeyRange isn't supported
					else if(typeof IDBKeyRange !== "function")
					
						// Throw error
						throw "IDBKeyRange isn't supported.";
					
					// Otherwise check if Number isn't supported
					else if(typeof Number !== "function")
					
						// Throw error
						throw "Number isn't supported.";
					
					// Otherwise check if String isn't supported
					else if(typeof String !== "function")
					
						// Throw error
						throw "String isn't supported.";
					
					// Otherwise check if local storage isn't supported
					else if(typeof localStorage !== "object" || localStorage === null)
					
						// Throw error
						throw "Local storage isn't supported.";
					
					// Otherwise check if 8-bit unsigned integer arrays aren't supported
					else if(typeof Uint8Array !== "function")
					
						// Throw error
						throw "8-bit unsigned integer arrays aren't supported.";
					
					// Otherwise check if 16-bit unsigned integer arrays aren't supported
					else if(typeof Uint16Array !== "function")
					
						// Throw error
						throw "16-bit unsigned integer arrays aren't supported.";
					
					// Otherwise check if 8-bit unsigned integer clamped arrays aren't supported
					else if(typeof Uint8ClampedArray !== "function")
					
						// Throw error
						throw "8-bit unsigned integer clamped arrays aren't supported.";
					
					// Otherwise check if text encoders aren't supported
					else if(typeof TextEncoder !== "function")
					
						// Throw error
						throw "Text encoders aren't supported.";
					
					// Otherwise check if text decoders aren't supported
					else if(typeof TextDecoder !== "function")
					
						// Throw error
						throw "Text decoders aren't supported.";
					
					// Otherwise check if URLs aren't supported
					else if(typeof URL !== "function")
					
						// Throw error
						throw "URLs aren't supported.";
					
					// Otherwise check if responses aren't supported
					else if(typeof Response !== "function")
					
						// Throw error
						throw "Responses aren't supported.";
					
					// Otherwise check if headers aren't supported
					else if(typeof Headers !== "function")
					
						// Throw error
						throw "Headers aren't supported.";
					
					// Otherwise check if data views aren't supported
					else if(typeof DataView !== "function")
					
						// Throw error
						throw "Data views aren't supported.";
					
					// Otherwise check if 32-bit unsigned integer arrays aren't supported
					else if(typeof Uint32Array !== "function")
					
						// Throw error
						throw "32-bit unsigned integer arrays aren't supported.";
					
					// Otherwise check if array buffers aren't supported
					else if(typeof ArrayBuffer !== "function")
					
						// Throw error
						throw "Array buffers aren't supported.";
					
					// Otherwise check if arrays aren't supported
					else if(typeof Array !== "function")
					
						// Throw error
						throw "Arrays aren't supported.";
					
					// Otherwise check if JSON isn't supported
					else if(typeof JSON !== "object" || JSON === null)
					
						// Throw error
						throw "JSON isn't supported.";
					
					// Otherwise check if WebSockets aren't supported
					else if(typeof WebSocket !== "function")
					
						// Throw error
						throw "WebSockets aren't supported.";
					
					// Otherwise check if Object isn't supported
					else if(typeof Object !== "function")
					
						// Throw error
						throw "Object isn't supported.";
					
					// Otherwise check if Date isn't supported
					else if(typeof Date !== "function")
					
						// Throw error
						throw "Date isn't supported.";
					
					// Otherwise check if Intl isn't supported
					else if(typeof Intl !== "object" || Intl === null)
					
						// Throw error
						throw "Intl isn't supported.";
					
					// Otherwise check if Sets aren't supported
					else if(typeof Set !== "function")
					
						// Throw error
						throw "Sets aren't supported.";
					
					// Otherwise check if WebAssembly isn't supported
					else if(typeof WebAssembly !== "object" || WebAssembly === null)
					
						// Throw error
						throw "WebAssembly isn't supported.";
					
					// Otherwise check if Web Workers aren't supported
					else if(typeof Worker !== "function")
					
						// Throw error
						throw "Web Workers aren't supported.";
					
					// Otherwise check if RegExp isn't supported
					else if(typeof RegExp !== "function")
					
						// Throw error
						throw "RegExp isn't supported.";
					
					// Otherwise check if 32-bit floating point arrays aren't supported
					else if(typeof Float32Array !== "function")
					
						// Throw error
						throw "32-bit floating point arrays aren't supported.";
					
					// Otherwise check if 64-bit floating point arrays aren't supported
					else if(typeof Float64Array !== "function")
					
						// Throw error
						throw "64-bit floating point arrays aren't supported.";
					
					// Otherwise check if Image isn't supported
					else if(typeof Image !== "function")
					
						// Throw error
						throw "Image isn't supported.";
					
					// Otherwise check if 16-bit signed integer arrays aren't supported
					else if(typeof Int16Array !== "function")
					
						// Throw error
						throw "16-bit signed integer arrays aren't supported.";
					
					// Otherwise check if 32-bit signed integer arrays aren't supported
					else if(typeof Int32Array !== "function")
					
						// Throw error
						throw "32-bit signed integer arrays aren't supported.";
					
					// Otherwise check if 8-bit signed integer arrays aren't supported
					else if(typeof Int8Array !== "function")
					
						// Throw error
						throw "8-bit signed integer arrays aren't supported.";
					
					// Otherwise check if RangeError isn't supported
					else if(typeof RangeError !== "function")
					
						// Throw error
						throw "RangeError isn't supported.";
					
					// Otherwise check if TypeError isn't supported
					else if(typeof TypeError !== "function")
					
						// Throw error
						throw "TypeError isn't supported.";
					
					// Otherwise check if Error isn't supported
					else if(typeof Error !== "function")
					
						// Throw error
						throw "Error isn't supported.";
					
					// Otherwise check if XMLHttpRequest isn't supported
					else if(typeof XMLHttpRequest !== "function")
					
						// Throw error
						throw "XMLHttpRequest isn't supported.";
					
					// Otherwise check if fetch isn't supported
					else if(typeof fetch !== "function")
					
						// Throw error
						throw "Fetch isn't supported.";
					
					// Otherwise check if set interval isn't supported
					else if(typeof setInterval !== "function")
					
						// Throw error
						throw "Set interval isn't supported.";
					
					// Otherwise check if clear interval isn't supported
					else if(typeof clearInterval !== "function")
					
						// Throw error
						throw "Clear interval isn't supported.";
					
					// Otherwise check if set timeout isn't supported
					else if(typeof setTimeout !== "function")
					
						// Throw error
						throw "Set timeout isn't supported.";
					
					// Otherwise check if clear timeout isn't supported
					else if(typeof clearTimeout !== "function")
					
						// Throw error
						throw "Clear timeout isn't supported.";
					
					// Otherwise check if request animation frame isn't supported
					else if(typeof requestAnimationFrame !== "function")
					
						// Throw error
						throw "Request animation frame isn't supported.";
					
					// Otherwise check if parse integer isn't supported
					else if(typeof parseInt !== "function")
					
						// Throw error
						throw "Parse integer isn't supported.";
					
					// Otherwise check if parse float isn't supported
					else if(typeof parseFloat !== "function")
					
						// Throw error
						throw "Parse float isn't supported.";
					
					// Otherwise check if decode URI component isn't supported
					else if(typeof decodeURIComponent !== "function")
					
						// Throw error
						throw "Decode URI component isn't supported.";
					
					// Otherwise check if encode URI component isn't supported
					else if(typeof encodeURIComponent !== "function")
					
						// Throw error
						throw "Encode URI component isn't supported.";
					
					// Otherwise check if Event isn't supported
					else if(typeof Event !== "function")
					
						// Throw error
						throw "Event isn't supported.";
					
					// Otherwise check if Function isn't supported
					else if(typeof Function !== "function")
					
						// Throw error
						throw "Function isn't supported.";
					
					// Otherwise check if DOM exception isn't supported
					else if(typeof DOMException !== "function")
					
						// Throw error
						throw "DOM exception isn't supported.";
					
					// Otherwise check if file reader isn't supported
					else if(typeof FileReader !== "function")
					
						// Throw error
						throw "File reader isn't supported.";
					
					// Otherwise check if Blobs aren't supported
					else if(typeof Blob !== "function")
					
						// Throw error
						throw "Blobs aren't supported.";
						
					// Otherwise
					else

						// Resolve
						resolve();
				}
				
				// Catch errors
				catch(error) {
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Error'), Message.createText(Language.getDefaultTranslation('Your browser isn\'t compatible. Update your browser to continue.')), false, function() {
					
						// Hide loading
						self.hideLoading();
						
						// Hide loading display spinner
						self.loadingDisplay.children("div.spinner").addClass("hide");
					
					}, Message.NO_BUTTON, Message.NO_BUTTON, true);
				}
			});
		}
		
		// Install service worker
		installServiceWorker() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check service work installer's installation status
				switch(self.serviceWorkerInstaller.getInstallationStatus()) {
				
					// Installing
					case ServiceWorkerInstaller.INSTALLING_STATUS:
					
						// Service worker installer install succeeded application event
						$(self.serviceWorkerInstaller).one(ServiceWorkerInstaller.INSTALL_SUCCEEDED_EVENT + ".application", function() {
						
							// Turn off service worker installer install failed application event
							$(self.serviceWorkerInstaller).off(ServiceWorkerInstaller.INSTALL_FAILED_EVENT + ".application");
							
							// Resolve
							resolve();
						
						// Service worker installer install failed application event
						}).one(ServiceWorkerInstaller.INSTALL_FAILED_EVENT + ".application", function() {
						
							// Turn off service worker installer install succeeded application event
							$(self.serviceWorkerInstaller).off(ServiceWorkerInstaller.INSTALL_SUCCEEDED_EVENT + ".application");
							
							// Check if is an app
							if(Common.isApp() === true) {
							
								// Set message
								var message = Message.createText(Language.getDefaultTranslation('Failed to install or update the service worker.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Restart this app to try again.'));
							}
							
							// Otherwise
							else {
							
								// Set message
								var message = Message.createText(Language.getDefaultTranslation('Failed to install or update the service worker.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Refresh this site to try again.'));
							}
							
							// Show message and allow showing messages
							self.message.show(Language.getDefaultTranslation('Error'), message, false, function() {
							
								// Hide loading
								self.hideLoading();
							
								// Show language display
								Language.showDisplay();
							
								// Hide loading display spinner
								self.loadingDisplay.children("div.spinner").addClass("hide");
							
							}, Message.NO_BUTTON, Message.NO_BUTTON, true);
						});
					
						// Break
						break;
					
					// Unsupported or installed
					case ServiceWorkerInstaller.UNSUPPORTED_STATUS:
					case ServiceWorkerInstaller.INSTALLED_STATUS:
					
						// Resolve
						resolve();
						
						// Break
						break;
					
					// Failed
					case ServiceWorkerInstaller.FAILED_STATUS:
					
						// Check if is an app
						if(Common.isApp() === true) {
						
							// Set message
							var message = Message.createText(Language.getDefaultTranslation('Failed to install or update the service worker.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Restart this app to try again.'));
						}
						
						// Otherwise
						else {
						
							// Set message
							var message = Message.createText(Language.getDefaultTranslation('Failed to install or update the service worker.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Refresh this site to try again.'));
						}
					
						// Show message and allow showing messages
						self.message.show(Language.getDefaultTranslation('Error'), message, false, function() {
						
							// Hide loading
							self.hideLoading();
						
							// Show language display
							Language.showDisplay();
						
							// Hide loading display spinner
							self.loadingDisplay.children("div.spinner").addClass("hide");
						
						}, Message.NO_BUTTON, Message.NO_BUTTON, true);
					
						// Break
						break;
				}
			});
		}
		
		// Show private browsing message
		showPrivateBrowsingMessage() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get if private browsing message has been shown
				var privateBrowsingMessageShown = localStorage.getItem(Application.PRIVATE_BROWSING_MESSAGE_SHOWN_LOCAL_STORAGE_NAME);
				
				// Check if private browsing message hasn't been shown and not an app or extension
				if((privateBrowsingMessageShown === Common.INVALID_LOCAL_STORAGE_ITEM || privateBrowsingMessageShown !== Application.PRIVATE_BROWSING_MESSAGE_SHOWN_TRUE_VALUE) && Common.isApp() === false && Common.isExtension() === false) {
				
					// Initialize message button clicked
					var messageButtonClicked = false;
					
					// Window storage application event
					$(window).on("storage.application", function(event) {
					
						// Check if private browsing message shown was changed
						if(event["originalEvent"]["key"] === Application.PRIVATE_BROWSING_MESSAGE_SHOWN_LOCAL_STORAGE_NAME) {
						
							// Turn off window storage application event
							$(window).off("storage.application");
							
							// Turn off window resize application event
							$(window).off("resize.application");
							
							// Set timeout
							setTimeout(function() {
							
								// Check if message button wasn't clicked
								if(messageButtonClicked === false) {
							
									// Show loading
									self.showLoading();
									
									// Prevent showing messages
									self.message.prevent();
								
									// Hide message
									self.message.hide().then(function() {
							
										// Resolve
										resolve();
									});
								}
							
							}, Application.HIDE_PRIVATE_BROWSING_MESSAGE_DELAY_MILLISECONDS);
						}
					});
					
					// Windows resize application event
					$(window).on("resize.application", function() {
						
						// Check if is an app
						if(Common.isApp() === true) {
						
							// Turn off window storage application event
							$(window).off("storage.application");
							
							// Turn off window resize application event
							$(window).off("resize.application");
							
							// Set timeout
							setTimeout(function() {
							
								// Check if message button wasn't clicked
								if(messageButtonClicked === false) {
							
									// Show loading
									self.showLoading();
									
									// Prevent showing messages
									self.message.prevent();
									
									// Hide message
									self.message.hide().then(function() {
							
										// Resolve
										resolve();
									});
								}
							
							}, Application.HIDE_PRIVATE_BROWSING_MESSAGE_DELAY_MILLISECONDS);
						}
					});
					
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Private Browsing And Site Data Information'), Message.createText(Language.getDefaultTranslation('This site won\'t function correctly if you have private or incognito browsing modes enabled or if your browser is configured to automatically delete cookies and site data. Make sure that private and incognito browsing modes are disabled and that your browser is configured to retain cookies and site data before continuing.')), false, function() {
					
						// Hide loading
						self.hideLoading();
						
						// Show language display
						Language.showDisplay();
					
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
					
						// Turn off window storage application event
						$(window).off("storage.application");
						
						// Turn off window resize application event
						$(window).off("resize.application");
						
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
						
							// Set message button clicked
							messageButtonClicked = true;
							
							// Try
							try {
							
								// Save that private browsing message has been shown
								localStorage.setItem(Application.PRIVATE_BROWSING_MESSAGE_SHOWN_LOCAL_STORAGE_NAME, Application.PRIVATE_BROWSING_MESSAGE_SHOWN_TRUE_VALUE);
							}
							
							// Catch errors
							catch(error) {
							
								// Trigger a fatal error
								new FatalError(FatalError.LOCAL_STORAGE_ERROR);
								
								// Return
								return;
							}
							
							// Show loading
							self.showLoading();
							
							// Prevent showing messages
							self.message.prevent();
							
							// Hide message
							self.message.hide().then(function() {
					
								// Resolve
								resolve();
							});
						}
					});
				}
				
				// Otherwise
				else
				
					// Resolve
					resolve();
			});
		}
		
		// Show third-party cookies message
		showThirdPartyCookiesMessage() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get if third-party cookies message has been shown
				var thirdPartyCookiesMessageShown = localStorage.getItem(Application.THIRD_PARTY_COOKIES_MESSAGE_SHOWN_LOCAL_STORAGE_NAME);
				
				// Check if third-party cookies message hasn't been shown and is an extension or loading from a file
				if((thirdPartyCookiesMessageShown === Common.INVALID_LOCAL_STORAGE_ITEM || thirdPartyCookiesMessageShown !== Application.THIRD_PARTY_COOKIES_MESSAGE_SHOWN_TRUE_VALUE) && (Common.isExtension() === true || location["protocol"] === Common.FILE_PROTOCOL)) {
				
					// Check if browser is Safari
					if(typeof navigator === "object" && navigator !== null && "userAgent" in navigator === true && navigator["userAgent"].toLowerCase().indexOf("safari") !== Common.INDEX_NOT_FOUND && navigator["userAgent"].toLowerCase().indexOf("chrome") === Common.INDEX_NOT_FOUND) {
					
						// Initialize message button clicked
						var messageButtonClicked = false;
						
						// Window storage application event
						$(window).on("storage.application", function(event) {
						
							// Check if third-party cookies message shown was changed
							if(event["originalEvent"]["key"] === Application.THIRD_PARTY_COOKIES_MESSAGE_SHOWN_LOCAL_STORAGE_NAME) {
							
								// Turn off window storage application event
								$(window).off("storage.application");
								
								// Set timeout
								setTimeout(function() {
								
									// Check if message button wasn't cicked
									if(messageButtonClicked === false) {
								
										// Show loading
										self.showLoading();
										
										// Prevent showing messages
										self.message.prevent();
									
										// Hide message
										self.message.hide().then(function() {
								
											// Resolve
											resolve();
										});
									}
								
								}, Application.HIDE_THIRD_PARTY_COOKIES_MESSAGE_DELAY_MILLISECONDS);
							}
						});
						
						// Check if is an extesnion
						if(Common.isExtension() === true) {
						
							// Set message
							var message = Message.createText(Language.getDefaultTranslation('This extension won\'t function correctly if your browser is configured to block third-party cookies. Make sure that your browser is configured to allow third-party cookies before continuing.'));
						}
						
						// Otherwise
						else {
						
							// Set message
							var message = Message.createText(Language.getDefaultTranslation('This site won\'t function correctly if your browser is configured to block third-party cookies. Make sure that your browser is configured to allow third-party cookies before continuing.'));
						}
						
						// Show message and allow showing messages
						self.message.show(Language.getDefaultTranslation('Third-Party Cookies Information'), message, false, function() {
						
							// Hide loading
							self.hideLoading();
							
							// Show language display
							Language.showDisplay();
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
						
							// Turn off window storage application event
							$(window).off("storage.application");
							
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
							
								// Set message button clicked
								messageButtonClicked = true;
								
								// Try
								try {
								
									// Save that third-party cookies message has been shown
									localStorage.setItem(Application.THIRD_PARTY_COOKIES_MESSAGE_SHOWN_LOCAL_STORAGE_NAME, Application.THIRD_PARTY_COOKIES_MESSAGE_SHOWN_TRUE_VALUE);
								}
								
								// Catch errors
								catch(error) {
								
									// Trigger a fatal error
									new FatalError(FatalError.LOCAL_STORAGE_ERROR);
									
									// Return
									return;
								}
								
								// Show loading
								self.showLoading();
								
								// Prevent showing messages
								self.message.prevent();
								
								// Hide message
								self.message.hide().then(function() {
						
									// Resolve
									resolve();
								});
							}
						});
					}
					
					// Otherwise
					else {
					
						// Resolve
						resolve();
					}
				}
				
				// Otherwise
				else {
				
					// Resolve
					resolve();
				}
			});
		}
		
		// Initialize dependencies
		initializeDependencies() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return performing dependencies initializations
				return Promise.all(Application.DEPENDENCIES_INITIALIZATIONS.map(function(dependencyInitialization) {
			
					// Return performing dependency initialization
					return dependencyInitialization();
					
				})).then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Check if is an extesnion
					if(Common.isExtension() === true) {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('Failed to initialize dependencies.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Restart this extension to try again.'));
					}
					
					// Otherwise check if is an app
					else if(Common.isApp() === true) {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('Failed to initialize dependencies.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Restart this app to try again.'));
					}
					
					// Otherwise
					else {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('Failed to initialize dependencies.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Refresh this site to try again.'));
					}
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Error'), message, false, function() {
					
						// Hide loading
						self.hideLoading();
					
						// Show language display
						Language.showDisplay();
					
						// Hide loading display spinner
						self.loadingDisplay.children("div.spinner").addClass("hide");
					
					}, Message.NO_BUTTON, Message.NO_BUTTON, true);
				});
			});
		}
		
		// Initialize extension
		initializeExtension() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return initializing extension
				return Extension.initialize().then(function() {
				
					// Check if closing when done processing extension requests
					if(Extension.getCloseWhenDone() === true) {
					
						// Set ignore updates
						self.ignoreUpdates = true;
					}
					
					// Otherwise
					else {
					
						// Set that body display shows that it's using listener
						self.bodyDisplay.addClass("usingListener");
					}
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Error'), Message.createText(error), false, function() {
					
						// Hide loading
						self.hideLoading();
					
						// Show language display
						Language.showDisplay();
					
						// Hide loading display spinner
						self.loadingDisplay.children("div.spinner").addClass("hide");
					
					}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Prevent extension from interrupting on close
							Extension.preventInterruptOnClose();
						
							// Close
							window.close();
						}
					});
				});
			});
		}
		
		// Uninitialize dependencies
		uninitializeDependencies() {
		
			// Go through all dependencies uninitializations
			for(var i = 0; i < Application.DEPENDENCIES_UNINITIALIZATIONS["length"]; ++i) {
			
				// Get dependency's uninitialization
				var dependencyUninitialization = Application.DEPENDENCIES_UNINITIALIZATIONS[i];
				
				// Perform dependency's uninitialization
				dependencyUninitialization();
			}
		}
		
		// Show reset settings
		showResetSettings() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get URL parameters
				var urlParameters = Common.getUrlParameters();
			
				// Check if resetting settings and URL parameters don't contain a request
				if(self.resetSettings === true && "Request" in urlParameters === false) {
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Reset Settings'), Message.createText(Language.getDefaultTranslation('Are you sure you want to reset the settings to their default values?')), false, function() {
					
						// Hide loading
						self.hideLoading();
					
						// Show language display
						Language.showDisplay();
					
					}, Language.getDefaultTranslation('No'), Language.getDefaultTranslation('Yes'), true).then(function(messageResult) {
					
						// Check if message was displayed
						if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
					
							// Check if resetting settings
							if(messageResult === Message.SECOND_BUTTON_CLICKED_RESULT) {
							
								// Show loading
								self.showLoading();
								
								// Set that message second button is loading
								self.message.setButtonLoading(Message.SECOND_BUTTON);
							
								// Prevent showing messages
								self.message.prevent();
								
								// Set timeout
								setTimeout(function() {
								
									// Once database is initialized
									Database.onceInitialized(function() {
									
										// Return promise
										return new Promise(function(resolve, reject) {
										
											// Return deleting settings
											return self.settings.deleteValues(false).then(function() {
											
												// Return hiding message
												return self.message.hide().then(function() {
												
													setTimeout(function() {
												
														// Resolve
														resolve();
													
													}, Application.RESET_SETTINGS_AFTER_DELAY_MILLISECONDS);
												});
												
											// Catch errors
											}).catch(function(error) {
											
												// Return showing message and allow showing messages
												return self.message.show(Language.getDefaultTranslation('Reset Settings Error'), Message.createText(error), true, function() {
												
													// Hide loading
													self.hideLoading();
												
												}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
												
													// Check if message was displayed
													if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
												
														// Show loading
														self.showLoading();
														
														// Prevent showing messages
														self.message.prevent();
													
														// Return hiding message
														return self.message.hide().then(function() {
												
															// Resolve
															resolve();
														});
													}
												});
											});
										});
									}, true);
									
									// Resolve
									resolve();
									
								}, Application.RESET_SETTINGS_BEFORE_DELAY_MILLISECONDS);
							}
							
							// Otherwise
							else {
							
								// Show loading
								self.showLoading();
								
								// Prevent showing messages
								self.message.prevent();
							
								// Hide message
								self.message.hide().then(function() {
								
									// Resolve
									resolve();
								});
							}
						}
					});
				}
				
				// Otherwise
				else {
				
					// Resolve
					resolve();
				}
			});
		}
		
		// Is primary instance
		isPrimaryInstance() {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Try
				try {
						
					// Create instance
					var instance = new Instance();
				}
				
				// Catch errors
				catch(error) {
				
					// Check if is an extesnion
					if(Common.isExtension() === true) {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('Failed to determine the primary instance.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Restart this extension to try again.'));
					}
					
					// Otherwise check if is an app
					else if(Common.isApp() === true) {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('Failed to determine the primary instance.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Restart this app to try again.'));
					}
					
					// Otherwise
					else {
					
						// Set message
						var message = Message.createText(Language.getDefaultTranslation('Failed to determine the primary instance.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Refresh this site to try again.'));
					}
				
					// Show message and allow showing messages
					self.message.show(Language.getDefaultTranslation('Error'), message, false, function() {
					
						// Hide loading
						self.hideLoading();
					
						// Show language display
						Language.showDisplay();
					
						// Hide loading display spinner
						self.loadingDisplay.children("div.spinner").addClass("hide");
					
					}, Message.NO_BUTTON, Message.NO_BUTTON, true);
					
					// Return
					return;
				}
				
				// Return getting if instance is the primary instance
				return instance.isPrimaryInstance().then(function(isPrimaryInstance) {
				
					// Check if instance is the primary instance
					if(isPrimaryInstance === true)
					
						// Resolve
						resolve();
					
					// Otherwise
					else {
					
						// Check if is an extension
						if(Common.isExtension() === true) {
						
							// Set message
							var message = Language.getDefaultTranslation('Only one instance of this extension can be open at once. Close all other instances to continue.');
						}
						
						// Otherwise check if is an app
						else if(Common.isApp() === true) {
						
							// Set message
							var message = Language.getDefaultTranslation('Only one instance of this app can be open at once. Close all other instances to continue.');
						}
						
						// Otherwise
						else {
						
							// Set message
							var message = Language.getDefaultTranslation('Only one instance of this site can be open at once. Close all other instances to continue.');
						}
					
						// Show message and allow showing messages
						self.message.show(Language.getDefaultTranslation('Error'), Message.createText(message), false, function() {
						
							// Hide loading
							self.hideLoading();
						
							// Show language display
							Language.showDisplay();
						
						}, Message.NO_BUTTON, Message.NO_BUTTON, true);
						
						// Instance is primary instance event
						$(instance).one(Instance.IS_PRIMARY_INSTANCE_EVENT, function() {
						
							// Set timeout
							setTimeout(function() {
						
								// Show loading
								self.showLoading();
								
								// Prevent showing messages
								self.message.prevent();
							
								// Hide message
								self.message.hide().then(function() {
								
									// Resolve
									resolve();
								});
							
							}, Application.HIDE_PRIMARY_INSTANCE_MESSAGE_DELAY_MILLISECONDS);
						});
					}
				});
			});
		}
		
		// Set verify source
		setVerifySource() {
		
			// Check if is an extension
			if(Common.isExtension() === true) {
			
				// Check if using the Firefox extension
				if(typeof browser !== "undefined" && browser["runtime"]["id"] === "{d783f67c-4dea-4d64-bfc2-1d4a6057babe}") {
				
					// Set message
					var message = Language.getDefaultTranslation('Make sure that you installed this extension for free from MWC Wallet\'s official browser extension listing on the Firefox Add-ons site at %1$m');
					
					// Set message arguments
					var messageArguments = [
					
						[
							// Text
							"https://addons.mozilla.org/en-US/firefox/addon/mwc-wallet/",
							
							// URL
							"https://addons.mozilla.org/en-US/firefox/addon/mwc-wallet/",
							
							// Is external
							true,
							
							// Is blob
							false
						]
					];
				}
				
				// Otherwise check if using the Chrome extension
				else if(typeof chrome !== "undefined" && chrome["runtime"]["id"] === "ahhdnimkkpkmclgcnbchlgijhmieongp") {
				
					// Set message
					var message = Language.getDefaultTranslation('Make sure that you installed this extension for free from MWC Wallet\'s official browser extension listing on the Chrome Web Store at %1$m');
					
					// Set message arguments
					var messageArguments = [
					
						[
							// Text
							"https://chromewebstore.google.com/detail/mwc-wallet/ahhdnimkkpkmclgcnbchlgijhmieongp",
							
							// URL
							"https://chromewebstore.google.com/detail/mwc-wallet/ahhdnimkkpkmclgcnbchlgijhmieongp",
							
							// Is external
							true,
							
							// Is blob
							false
						]
					];
				}
				
				// Otherwise
				else {
				
					// Set message
					var message = Language.getDefaultTranslation('Make sure that you downloaded this extension for free from MWC Wallet\'s official browser extension releases at %1$m');
					
					// Set message arguments
					var messageArguments = [
					
						[
							// Text
							"https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension/releases",
							
							// URL
							"https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension/releases",
							
							// Is external
							true,
							
							// Is blob
							false
						]
					];
				}
			}
			
			// Otherwise check if is an app
			else if(Common.isApp() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('Make sure that you installed this app for free from MWC Wallet\'s official site at %1$m');
				
				// Set message arguments
				var messageArguments = [
				
					[
						// Text
						"https://mwcwallet.com",
						
						// URL
						"https://mwcwallet.com",
						
						// Is external
						true,
						
						// Is blob
						false
					]
				];
			}
			
			// Otherwise check if loading from a file
			else if(location["protocol"] === Common.FILE_PROTOCOL) {
			
				// Set message
				var message = Language.getDefaultTranslation('Make sure that you downloaded this file for free from MWC Wallet\'s official standalone releases at %1$m');
				
				// Set message arguments
				var messageArguments = [
				
					[
						// Text
						"https://github.com/NicolasFlamel1/MWC-Wallet-Standalone/releases",
						
						// URL
						"https://github.com/NicolasFlamel1/MWC-Wallet-Standalone/releases",
						
						// Is external
						true,
						
						// Is blob
						false
					]
				];
			}
			
			// Otherwise
			else {
			
				// Set message
				var message = Language.getDefaultTranslation('Make sure that you\'re accessing MWC Wallet for free from its official site at %1$m');
				
				// Set message arguments
				var messageArguments = [
				
					[
						// Text
						(Tor.isOnionService() === true) ? "http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion" : "https://mwcwallet.com",
						
						// URL
						(Tor.isOnionService() === true) ? "http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion" : "https://mwcwallet.com",
						
						// Is external
						true,
						
						// Is blob
						false
					]
				];
			}
			
			// Create verify source from message
			var verifySource = Language.createTranslatableContainer("<p>", message, messageArguments, "verifySource");
			
			// Set create display's verify source
			this.createDisplay.find("p.verifySource").replaceWith(verifySource);
			
			// Set unlock display's verify source
			this.unlockDisplay.find("p.verifySource").replaceWith(verifySource);
		}
		
		// Show create or unlock
		showCreateOrUnlock() {
		
			// Check if wallets don't exist
			if(this.wallets.exist() === false)
			
				// Set display to show to create display
				var displayToShow = this.createDisplay;
			
			// Otherwise
			else
			
				// Set display to show to unlock display
				var displayToShow = this.unlockDisplay;
			
			// Hide loading display spinner
			this.loadingDisplay.children("div.spinner").addClass("hide");
			
			// Allow showing logo
			this.logo.allowShowing();
			
			// Show logo
			this.logo.show();
			
			// Set self
			var self = this;
			
			// Loading display spinner transition end or timeout event
			this.loadingDisplay.children("div.spinner").transitionEndOrTimeout(function() {
			
				// Hide loading display
				self.loadingDisplay.addClass("hide");
				
				// Hide loading
				self.hideLoading();
				
				// Disable tabbing to everything in display to show and disable everything in display to show
				displayToShow.find("*").disableTab().disable();
		
				// Show display to show
				displayToShow.removeClass("hide");
				
				// Set timeout
				setTimeout(function() {
				
					// Trigger input on display to show's inputs
					displayToShow.find("input:not(.hide)").trigger("input");
				
					// Show display to show children
					displayToShow.children().removeClass("hide");
					
					// Show language display
					Language.showDisplay(true);
					
					// Set info display
					self.infoDisplay.append(Language.createTranslatableContainer("<p>", Language.getDefaultTranslation('%1$x/%2$x/v%3$v'), [Consensus.walletTypeToText(Consensus.getWalletType()), Consensus.networkTypeToText(Consensus.getNetworkType()), VERSION_NUMBER]));
					
					// Show info display
					self.infoDisplay.removeClass("hide");
					
					// Initialize focus on input
					var focusOnInput = true;
					
					// Check if cookie acceptance was shown
					if(self.cookieAcceptance.show() === true) {
					
						// Clear focus on input
						focusOnInput = false;
					}
					
					// Show maintenance notification
					self.maintenanceNotification.show();
					
					// Display to show form transition end or timeout event
					displayToShow.children("form").transitionEndOrTimeout(function() {
					
						// Set everything to transition at normal speed
						self.mainDisplay.addClass("normalTransitionSpeed");
					
						// Enable tabbing to everything in display to show and enable everything in display to show
						displayToShow.find("*").enableTab().enable();
						
						// Check if focusing on input
						if(focusOnInput === true) {
						
							// Get focus to display's first input
							var firstInput = displayToShow.find("input:visible").first();
							
							// Try
							try {
							
								// Check if first input isn't autofilled in
								if(firstInput.is(":-webkit-autofill") === false && firstInput.is(":autofill") === false) {
								
									// Focus on first input
									firstInput.focus();
								}
							}
							
							// Catch errors
							catch(error) {
							
								// Focus on first input
								firstInput.focus();
							}
						}
						
						// Allow showing messages
						self.message.allow();
						
					}, "opacity");
				}, 0);
				
			}, "opacity");
		}
		
		// Show display
		showDisplay(displayToShow) {
		
			// Delete all saved focus
			this.focus.deleteAll();
			
			// Allow scroll keys
			this.scroll.allowKeys();
			
			// Disable unlocked
			this.unlocked.disable();
			
			// Prevent automatic lock
			this.automaticLock.prevent();
			
			// Lock wallets
			this.wallets.lock(this.unlockedAtLeastOnce === false);
			
			// Check if message is shown
			if(this.message.isShown() === true) {
			
				// Check display to show
				switch(displayToShow) {
				
					// Create display
					case this.createDisplay:
					
						// Set hide message to if message visible state doesn't include create
						var hideMessage = (this.message.visibleState() & Message.VISIBLE_STATE_CREATE) === 0;
					
						// Break
						break;
					
					// Unlock display
					case this.unlockDisplay:
					
						// Set hide message to if message visible state doesn't include unlock
						var hideMessage = (this.message.visibleState() & Message.VISIBLE_STATE_UNLOCK) === 0;
						
						// Break
						break;
				}
				
				// Check if hiding message
				if(hideMessage === true) {
			
					// Hide message
					this.message.hide();
				}
			}
			
			// Set self
			var self = this;
			
			// Message show application show display event
			$(this.message).on(Message.SHOW_EVENT + ".applicationShowDisplay", function() {
			
				// Check display to show
				switch(displayToShow) {
				
					// Create display
					case self.createDisplay:
					
						// Set hide message to if message visible state doesn't include create
						var hideMessage = (self.message.visibleState() & Message.VISIBLE_STATE_CREATE) === 0;
					
						// Break
						break;
					
					// Unlock display
					case self.unlockDisplay:
					
						// Set hide message to if message visible state doesn't include unlock
						var hideMessage = (self.message.visibleState() & Message.VISIBLE_STATE_UNLOCK) === 0;
						
						// Break
						break;
				}
				
				// Check if hiding message
				if(hideMessage === true) {
			
					// Hide message
					self.message.hide();
				}
			
			// Message before show application event
			}).on(Message.BEFORE_SHOW_EVENT + ".application", function() {
			
				// Check display to show
				switch(displayToShow) {
				
					// Create display
					case self.createDisplay:
					
						// Set hide message to if message visible state doesn't include create
						var hideMessage = (self.message.visibleState() & Message.VISIBLE_STATE_CREATE) === 0;
					
						// Break
						break;
					
					// Unlock display
					case self.unlockDisplay:
					
						// Set hide message to if message visible state doesn't include unlock
						var hideMessage = (self.message.visibleState() & Message.VISIBLE_STATE_UNLOCK) === 0;
						
						// Break
						break;
				}
				
				// Check if hiding message
				if(hideMessage === true) {
			
					// Return false to cancel the message
					return false;
				}
			});
		
			// Hide unlocked display children
			this.unlockedDisplay.children().addClass("hide");
			
			// Hide display to show display logo
			displayToShow.children("div.logo").addClass("hide");
				
			// Unlocked display children transition end or timeout event
			this.unlockedDisplay.children().transitionEndOrTimeout(function() {
			
				// Hide unlocked display
				self.unlockedDisplay.addClass("hide");
				
				// Hide loading
				self.hideLoading();
				
				// Enable unlocked
				self.unlocked.enable();
				
				// Reset unlocked
				self.unlocked.reset();
				
				// Disable tabbing to everything in display to show and disable everything in display to show
				displayToShow.find("*").disableTab().disable();
		
				// Show display to show
				displayToShow.removeClass("hide");
				
				// Set timeout
				setTimeout(function() {
				
					// Turn off message show application show display event
					$(self.message).off(Message.SHOW_EVENT + ".applicationShowDisplay");
					
					// Turn off message before show application event
					$(self.message).off(Message.BEFORE_SHOW_EVENT + ".application");
				
					// Show display to show children
					displayToShow.children().removeClass("hide");
					
					// Show logo
					self.logo.show();
					
					// Show info display
					self.infoDisplay.removeClass("hide");
					
					// Check if message is not shown
					if(self.message.isShown() === false) {
					
						// Enable tabbing to everything in display to show and enable everything in display to show
						displayToShow.find("*").enableTab().enable();
					
						// Focus on display to show
						displayToShow.focus();
					}
					
					// Otherwise
					else {
					
						// Display to show form transition end or timeout event
						displayToShow.children("form").transitionEndOrTimeout(function() {
						
							// Check if message is not shown
							if(self.message.isShown() === false) {
							
								// Enable tabbing to everything in display to show and enable everything in display to show
								displayToShow.find("*").enableTab().enable();
							
								// Focus on display to show
								displayToShow.focus();
							}
						}, "opacity");
					}
					
					// Allow showing messages
					self.message.allow();
				}, 0);
				
			}, "opacity");
		}
		
		// Reset
		reset() {
			
			// Set title
			var title = Language.getDefaultTranslation('Show');
			
			// Show create display password show icon, set its title, and change password input type
			this.createDisplay.find("input[name=\"Password\"]").siblings("span.show").removeClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title)).siblings("input").attr("type", "password");
			
			// Show create display confirm password show icon, set its title, and change password input type
			this.createDisplay.find("input[name=\"Confirm Password\"]").siblings("span.show").removeClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title)).siblings("input").attr("type", "password");
			
			// Show unlock display password show icon, set its title, and change password input type
			this.unlockDisplay.find("input[name=\"Password\"]").siblings("span.show").removeClass("conceal").attr(Common.DATA_ATTRIBUTE_PREFIX + "text", title).attr("title", Language.getTranslation(title)).siblings("input").attr("type", "password");
		}
		
		// Private browsing message shown local storage name
		static get PRIVATE_BROWSING_MESSAGE_SHOWN_LOCAL_STORAGE_NAME() {
		
			// Return private browsing message shown local storage name
			return "Private Browsing Message Shown";
		}
		
		// Private browsing message shown true value
		static get PRIVATE_BROWSING_MESSAGE_SHOWN_TRUE_VALUE() {
		
			// Return private browsing message shown true value
			return "true";
		}
		
		// Third-party cookies message shown local storage name
		static get THIRD_PARTY_COOKIES_MESSAGE_SHOWN_LOCAL_STORAGE_NAME() {
		
			// Return third-party cookies message shown local storage name
			return "Third-Party Cookies Message Shown";
		}
		
		// Third-party cookies message shown true value
		static get THIRD_PARTY_COOKIES_MESSAGE_SHOWN_TRUE_VALUE() {
		
			// Return Third-party cookies message shown true value
			return "true";
		}
		
		// Show install app minimum delay seconds
		static get SHOW_INSTALL_APP_MINIMUM_DELAY_SECONDS() {
		
			// Return show install app minimum delay seconds
			return 1 * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Show install app maximum delay seconds
		static get SHOW_INSTALL_APP_MAXIMUM_DELAY_SECONDS() {
		
			// Return show install app maximum delay seconds
			return 5 * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Show unlocked display delay milliseconds
		static get SHOW_UNLOCKED_DISPLAY_DELAY_MILLISECONDS() {
		
			// Return show unlocked display delay milliseconds
			return 300;
		}
		
		// Delete all wallets delay milliseconds
		static get DELETE_ALL_WALLETS_DELAY_MILLISECONDS() {
		
			// Return delete all wallets delay milliseconds
			return 300;
		}
		
		// Hide primary instance message delay milliseconds
		static get HIDE_PRIMARY_INSTANCE_MESSAGE_DELAY_MILLISECONDS() {
		
			// Return hide primary instance message delay milliseconds
			return 100;
		}
		
		// Hide private browsing message delay milliseconds
		static get HIDE_PRIVATE_BROWSING_MESSAGE_DELAY_MILLISECONDS() {
		
			// Return hide private browsing message delay milliseconds
			return Application.HIDE_PRIMARY_INSTANCE_MESSAGE_DELAY_MILLISECONDS;
		}
		
		// Hide third-party cookies message delay milliseconds
		static get HIDE_THIRD_PARTY_COOKIES_MESSAGE_DELAY_MILLISECONDS() {
		
			// Return hide third-party cookies message delay milliseconds
			return Application.HIDE_PRIMARY_INSTANCE_MESSAGE_DELAY_MILLISECONDS;
		}
		
		// Reset settings before delay milliseconds
		static get RESET_SETTINGS_BEFORE_DELAY_MILLISECONDS() {
		
			// Return reset settings before delay milliseconds
			return 500;
		}
		
		// Reset settings after delay milliseconds
		static get RESET_SETTINGS_AFTER_DELAY_MILLISECONDS() {
		
			// Return reset settings after delay milliseconds
			return 500;
		}
		
		// Install update delay milliseconds
		static get INSTALL_UPDATE_DELAY_MILLISECONDS() {
		
			// Return install update delay milliseconds
			return 1 * Common.MILLISECONDS_IN_A_SECOND;
		}
		
		// Delete all wallets button maximum width
		static get DELETE_ALL_WALLETS_BUTTON_MAXIMUM_WIDTH() {
		
			// Return delete all wallets button maximum width
			return parseFloat("10em");
		}
		
		// Dependencies initializations
		static get DEPENDENCIES_INITIALIZATIONS() {
		
			// Return dependencies initializations
			return [
			
				// BLAKE2b initialize
				Blake2b.initialize,
				
				// Ed25519 initialize
				Ed25519.initialize,
				
				// X25519 initialize
				X25519.initialize,
				
				// Secp256k1-zkp initialize
				Secp256k1Zkp.initialize,
				
				// SMAZ initialize
				Smaz.initialize,
				
				// Database initialize
				Database.initialize,
				
				// Output initialize
				Output.initialize,
				
				// Slate initialize
				Slate.initialize,
				
				// Wallet initialize
				Wallet.initialize,
				
				// Tor initialize
				Tor.initialize,
				
				// Camera initialize
				Camera.initialize
			];
		}
		
		// Dependencies uninitializations
		static get DEPENDENCIES_UNINITIALIZATIONS() {
		
			// Return dependencies uninitializations
			return [
			
				// Secp256k1-zkp uninitialize
				Secp256k1Zkp.uninitialize
			];
		}
		
		// Settings enable node connection error messages name
		static get SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_NAME() {
		
			// Return settings enable node connection error messages name
			return "Enable Node Connection Error Messages";
		}
		
		// Settings enable node connection error messages default value
		static get SETTINGS_ENABLE_NODE_CONNECTION_ERROR_MESSAGES_DEFAULT_VALUE() {
		
			// Return settings enable node connection error messages default value
			return true;
		}
		
		// Settings enable listener connection error messages name
		static get SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_NAME() {
		
			// Return settings enable listener connection error messages name
			return "Enable Listener Connection Error Messages";
		}
		
		// Settings enable listener connection error messages default value
		static get SETTINGS_ENABLE_LISTENER_CONNECTION_ERROR_MESSAGES_DEFAULT_VALUE() {
		
			// Return settings enable listener connection error messages default value
			return true;
		}
		
		// Shift key code
		static get SHIFT_KEY_CODE() {
		
			// Return shift key code
			return 16;
		}
		
		// Prevent minimal interface delay milliseconds
		static get PREVENT_MINIMAL_INTERFACE_DELAY_MILLISECONDS() {
		
			// Return prevent minimal interface delay milliseconds
			return 500;
		}
		
		// Canceled check interval milliseconds
		static get CANCELED_CHECK_INTERVAL_MILLISECONDS() {
		
			// Return canceled check interval milliseconds
			return 50;
		}
		
		// Check extension request received interval milliseconds
		static get CHECK_EXTENSION_REQUEST_RECEIVED_INTERVAL_MILLISECONDS() {
		
			// Return check extension request received interval milliseconds
			return 50;
		}
		
		// Check hardware wallet priority interval milliseconds
		static get CHECK_HARDWARE_WALLET_PRIORITY_INTERVAL_MILLISECONDS() {
		
			// Return check hardware wallet priority interval milliseconds
			return 50;
		}
}


// Main function

// Set global object's application
globalThis["Application"] = Application;

// Ready event
$(function() {

	// Set timeout
	setTimeout(function() {

		// Check if a startup error didn't occur
		if(startupErrorOccurred() === false) {
		
			// Enable application error handler
			enableApplicationErrorHandler();
	
			// Create application
			new Application();
		}
	
	}, Application.SHOW_LOADING_DELAY_MILLISECONDS);
});
