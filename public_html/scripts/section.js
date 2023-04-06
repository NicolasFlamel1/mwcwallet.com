// Use strict
"use strict";


// Classes

// Section class
class Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Set display
			this.display = display;
			
			// Set sections
			this.sections = sections;
			
			// Set settings
			this.settings = settings;
			
			// Set message
			this.message = message;
			
			// Set focus
			this.focus = focus;
			
			// Set application
			this.application = application;
			
			// Set unlocked
			this.unlocked = unlocked;
			
			// Set automatic lock
			this.automaticLock = automaticLock;
			
			// Set scroll
			this.scroll = scroll;
			
			// Set wallets
			this.wallets = wallets;
			
			// Set node
			this.node = node;
			
			// Set wake lock
			this.wakeLock = wakeLock;
			
			// Set transactions
			this.transactions = transactions;
			
			// Set prices
			this.prices = prices;
			
			// Set clipboard
			this.clipboard = clipboard;
			
			// Set elements states
			this.elementsStates = [];
			
			// Set restoring state
			this.restoringState = false;
			
			// Register section
			this.sections.registerSection(this);
			
			// Set last scroll position
			this.lastScrollPosition = 0;
			
			// Set self
			var self = this;
			
			// Document key down event
			$(document).on("keydown", function(event) {
			
				// Check if key tab is pressed
				if(event["which"] === "\t".charCodeAt(0)) {
				
					// Enable tabbing to all not disabled section navigation buttons
					self.display.find("div.navigation").find("button:not(.disabled)").enableTab();
					
					// Disable tabbing to all disabled section navigation buttons
					self.display.find("div.navigation").find("button.disabled").disableTab();
				}
			});
			
			// Section navigation back button click event
			this.display.find("div.navigation").find("button.back").on("click", function() {
			
				// Show previous section
				self.sections.showPreviousSection().catch(function(error) {
				
				});
			});
			
			// Section navigation forward button click event
			this.display.find("div.navigation").find("button.forward").on("click", function() {
			
				// Show next section and catch errors
				self.sections.showNextSection().catch(function(error) {
				
				});
			});
			
			// Display scroll stopped event
			this.display.scrollStopped(function(event) {
			
				// Check if not restoring state
				if(self.restoringState === false) {
			
					// Check if shown and wallets display isn't showing or wallets expand button is hidden
					if(self.isShown() === true && (self.unlocked.walletsDisplay.children("div").hasClass("hide") === true || self.unlocked.walletsDisplay.find("button.expand").is(":hidden") === true)) {
					
						// Update state in stack and catch errors
						self.sections.updateStateInStack(self).catch(function(error) {
						
						});
					}
				}
			
			// Display button, input, select, and anchor focus event
			}).on("focus", "button, input, select, a", function() {
			
				// Check if not restoring state
				if(self.restoringState === false) {
			
					// Check if shown and wallets display isn't showing or wallets expand button is hidden
					if(self.isShown() === true && (self.unlocked.walletsDisplay.children("div").hasClass("hide") === true || self.unlocked.walletsDisplay.find("button.expand").is(":hidden") === true)) {
				
						// Update state and catch errors
						self.updateState().catch(function(error) {
						
						});
					}
				}
			
			// Display button, input, select, and anchor blur event
			}).on("blur", "button, input, select, a", function() {
			
				// Check if not restoring state
				if(self.restoringState === false) {
				
					// Check if automatic lock isn't locking, the document has focus, and the is shown and wallets display isn't showing or wallets expand button is hidden
					if(self.automaticLock.isLocking() === false && document.hasFocus() === true && self.isShown() === true && (self.unlocked.walletsDisplay.children("div").hasClass("hide") === true || self.unlocked.walletsDisplay.find("button.expand").is(":hidden") === true)) {
					
						// Update state and catch errors
						self.updateState().catch(function(error) {
						
						});
					}
				}
			
			// Display button click event
			}).on("click", "button", function() {
			
				// Check if not restoring state
				if(self.restoringState === false) {
				
					// Check if shown and wallets display isn't showing or wallets expand button is hidden
					if(self.isShown() === true && (self.unlocked.walletsDisplay.children("div").hasClass("hide") === true || self.unlocked.walletsDisplay.find("button.expand").is(":hidden") === true)) {
				
						// Update state and catch errors
						self.updateState().catch(function(error) {
						
						});
					}
				}
			
			// Display input and select input event
			}).on("input", "input, select", function() {
			
				// Check if not restoring state
				if(self.restoringState === false) {
				
					// Check if shown and wallets display isn't showing or wallets expand button is hidden
					if(self.isShown() === true && (self.unlocked.walletsDisplay.children("div").hasClass("hide") === true || self.unlocked.walletsDisplay.find("button.expand").is(":hidden") === true)) {
				
						// Update state and catch errors
						self.updateState().catch(function(error) {
						
						});
					}
				}
			
			// Display option enable event
			}).on(Common.ENABLE_EVENT, "option", function() {
			
				// Get option
				var option = $(this);
				
				// Check if option is selected
				if(option.is(":selected") === true) {
				
					// Disable option
					option.disable();
				}
			
			// Display option language change event
			}).on(Language.CHANGE_EVENT, "option", function() {
			
				// Get option's parent
				var parent = $(this).parent();
				
				// Get parent's value
				var value = parent.children(":selected").val();
				
				// Clear parent's value and set it back to the value
				parent.val("").val(value);
			});
			
			// Display input select event
			this.display.find("select").on("input", function(event) {
			
				// Check if not restoring state
				if(self.restoringState === false) {
				
					// Check if shown and wallets display isn't showing or wallets expand button is hidden
					if(self.isShown() === true && (self.unlocked.walletsDisplay.children("div").hasClass("hide") === true || self.unlocked.walletsDisplay.find("button.expand").is(":hidden") === true)) {
				
						// Update state and catch errors
						self.updateState().catch(function(error) {
						
						});
					}
				}
				
				// Enable select's options
				$(this).children("option").enable();
			});
			
			// Display dotted text language change event
			this.display.find("span.dots").parent().on(Language.CHANGE_EVENT, function() {
			
				// Get text
				var text = $(this).children("p");
				
				// Check if text exists
				if(text["length"] !== 0) {
				
					// Update text's dots
					Section.updateDots(text);
				}
			});
			
			// Window resize event
			$(window).on("resize", function() {
			
				// Go through all dotted text in the display
				self.display.find("span.dots").siblings("p").each(function() {
				
					// Get text
					var text = $(this);
					
					// Update text's dots
					Section.updateDots(text);
				});
			});
		}
		
		// Get name
		getName() {
		
			// Return name
			return "";
		}
		
		// Show
		show(minimal = false, showErrors = true, enableAfterInitializing = true, state = Section.NO_STATE, updateStack = true, saveCurrentDisplay = false, isTemporary = false) {
		
			// Get unlocked display
			var unlockedDisplay = $("div.unlocked");
		
			// Check if not minimal
			if(minimal === false) {
			
				// Get changing temporary
				var changingTemporary = (unlockedDisplay.hasClass("minimal") === true && isTemporary === false) || (unlockedDisplay.hasClass("minimal") === false && isTemporary === true);
		
				// Check if enabling after initializing
				if(enableAfterInitializing === true) {
			
					// Show loading
					this.application.showLoading();
				
					// Save focus and blur
					this.focus.save(true);
				
					// Disable unlocked
					this.unlocked.disable();
					
					// Prevent automatic lock
					this.automaticLock.prevent();
				}
				
				// Check if not temporary
				if(isTemporary === false) {
				
					// Hide wallets
					this.unlocked.hideWallets(false);
				}
				
				// Set self
				var self = this;
				
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Show section display
					var showSectionDisplay = function() {
					
						// Process error
						var processError = function(error) {
						
							// Check if enabling after initializing
							if(enableAfterInitializing === true) {
						
								// Allow automatic lock
								self.automaticLock.allow();
								
								// Check if automatic lock is locking
								if(self.automaticLock.isLocking() === true) {
								
									// Reject error
									reject(error);
									
									// Return
									return;
								}
							}
						
							// Check if showing errors
							if(showErrors === true) {
						
								// Return showing message and allow showing messages
								return self.message.show(self.getInitializeErrorHeader(), Message.createText(error), false, function() {
								
									// Hide loading
									self.application.hideLoading();
								
								}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
								
									// Check if message was displayed
									if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
									
										// Check if enabling after initializing
										if(enableAfterInitializing === true) {
									
											// Hide loading
											self.application.hideLoading();
										
											// Enable unlocked
											self.unlocked.enable();
											
											// Restore focus and don't blur
											self.focus.restore(false);
										}
										
										// Set unlocked's wallet buttons aren't clicked
										self.unlocked.walletsDisplay.find("div.list").find("button.clicked").removeClass("clicked");
										
										// Update unlocked's wallets order buttons
										self.unlocked.updateWalletsOrderButtons();
										
										// Set that unlocked's menu display buttons aren't clicked
										self.unlocked.menuDisplay.find("button").removeClass("clicked");
										
										// Hide message
										self.message.hide();
									}
									
									// Reject error
									reject(error);
								});
							}
							
							// Otherwise
							else {
							
								// Check if enabling after initializing
								if(enableAfterInitializing === true) {
							
									// Hide loading
									self.application.hideLoading();
								
									// Enable unlocked
									self.unlocked.enable();
									
									// Restore focus and don't blur
									self.focus.restore(false);
								}
							
								// Reject error
								reject(error);
							}
						};
						
						// Return initializing
						return self.initialize(state, false).then(function() {
						
							// Check if updating the stack
							if(updateStack === true) {
							
								// Check if not saving the current display
								if(saveCurrentDisplay === false) {
								
									// Clear the stack
									self.sections.clearStack();
								}
								
								// Return pushing state to stack
								return self.sections.pushStateToStack(self).then(function() {
								
									// Update navigation
									self.updateNavigation();
							
									// Check if enabling after initializing
									if(enableAfterInitializing === true)
								
										// Hide loading
										self.application.hideLoading();
									
									// Check if is temporary
									if(isTemporary === true) {
									
										// Make unlocked display have a minimal interface
										unlockedDisplay.addClass("minimal");
										
										// Show unlocked display's sections display
										unlockedDisplay.find("div.sections").children("div").removeClass("hide");
									}
									
									// Otherwise
									else {
									
										// Make unlocked display not have a minimal interface
										unlockedDisplay.removeClass("minimal");
									}
									
									// Check if not changing temporary
									if(changingTemporary === false) {
									
										// Show display
										self.display.removeClass("hide");
										
										// Trigger shown event
										$(self).trigger(Section.SHOWN_EVENT);
										
										// Display transition end or timeout event
										self.display.transitionEndOrTimeout(function() {
										
											// Check if enabling after initializing
											if(enableAfterInitializing === true) {
											
												// Allow automatic lock
												self.automaticLock.allow();
												
												// Check if automatic lock is locking
												if(self.automaticLock.isLocking() === true) {
												
													// Resolve
													resolve();
												
													// Return
													return;
												}
										
												// Enable unlocked
												self.unlocked.enable();
												
												// Delete focus
												self.focus.delete();
												
												// Trigger focus event
												$(self).trigger(Section.FOCUS_EVENT);
											}
											
											// Resolve
											resolve();
											
										}, "opacity");
									}
									
									// Otherwise
									else {
									
										// Show display without transitioning
										self.display.removeClass("hide").addClass("noTransition");
									
										// Show unlocked display's children if it was temporarily hidden
										unlockedDisplay.children().removeClass("temporaryHide");
										
										// Trigger resize event
										$(window).trigger("resize");
										
										// Trigger shown event
										$(self).trigger(Section.SHOWN_EVENT);
										
										// Trigger unlocked show event
										$(self.unlocked).trigger(Unlocked.SHOW_EVENT);
										
										// Unlocked display's children transition end or timeout event
										unlockedDisplay.children().transitionEndOrTimeout(function() {
										
											// Allow display to transition
											self.display.removeClass("noTransition");
										
											// Check if enabling after initializing
											if(enableAfterInitializing === true) {
											
												// Allow automatic lock
												self.automaticLock.allow();
												
												// Check if automatic lock is locking
												if(self.automaticLock.isLocking() === true) {
												
													// Resolve
													resolve();
												
													// Return
													return;
												}
										
												// Enable unlocked
												self.unlocked.enable();
												
												// Delete focus
												self.focus.delete();
												
												// Trigger focus event
												$(self).trigger(Section.FOCUS_EVENT);
											}
											
											// Resolve
											resolve();
											
										}, "opacity");
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Reset
									self.reset();
								
									// Process error
									processError(error);
								});
							}
							
							// Otherwise
							else {
							
								// Return saving the stack
								return self.sections.saveStack().then(function() {
							
									// Update navigation
									self.updateNavigation();
							
									// Check if enabling after initializing
									if(enableAfterInitializing === true)
								
										// Hide loading
										self.application.hideLoading();
									
									// Check if is temporary
									if(isTemporary === true) {
									
										// Make unlocked display have a minimal interface
										unlockedDisplay.addClass("minimal");
										
										// Show unlocked display's sections display
										unlockedDisplay.find("div.sections").children("div").removeClass("hide");
									}
									
									// Otherwise
									else {
									
										// Make unlocked display not have a minimal interface
										unlockedDisplay.removeClass("minimal");
									}
									
									// Check if not changing temporary
									if(changingTemporary === false) {
									
										// Show display
										self.display.removeClass("hide");
										
										// Trigger shown event
										$(self).trigger(Section.SHOWN_EVENT);
										
										// Display transition end or timeout event
										self.display.transitionEndOrTimeout(function() {
										
											// Check if enabling after initializing
											if(enableAfterInitializing === true) {
											
												// Allow automatic lock
												self.automaticLock.allow();
												
												// Check if automatic lock is locking
												if(self.automaticLock.isLocking() === true) {
												
													// Resolve
													resolve();
												
													// Return
													return;
												}
										
												// Enable unlocked
												self.unlocked.enable();
												
												// Delete focus
												self.focus.delete();
												
												// Trigger focus event
												$(self).trigger(Section.FOCUS_EVENT);
											}
											
											// Resolve
											resolve();
											
										}, "opacity");
									}
									
									// Otherwise
									else {
									
										// Show display without transitioning
										self.display.removeClass("hide").addClass("noTransition");
									
										// Show unlocked display's children
										unlockedDisplay.children().removeClass("temporaryHide");
										
										// Trigger resize event
										$(window).trigger("resize");
										
										// Trigger shown event
										$(self).trigger(Section.SHOWN_EVENT);
										
										// Trigger unlocked show event
										$(self.unlocked).trigger(Unlocked.SHOW_EVENT);
										
										// Unlocked display's children transition end or timeout event
										unlockedDisplay.children().transitionEndOrTimeout(function() {
										
											// Allow display to transition
											self.display.removeClass("noTransition");
										
											// Check if enabling after initializing
											if(enableAfterInitializing === true) {
											
												// Allow automatic lock
												self.automaticLock.allow();
												
												// Check if automatic lock is locking
												if(self.automaticLock.isLocking() === true) {
												
													// Resolve
													resolve();
												
													// Return
													return;
												}
										
												// Enable unlocked
												self.unlocked.enable();
												
												// Delete focus
												self.focus.delete();
												
												// Trigger focus event
												$(self).trigger(Section.FOCUS_EVENT);
											}
											
											// Resolve
											resolve();
											
										}, "opacity");
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Reset
									self.reset();
								
									// Process error
									processError(error);
								});
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Reset
							self.reset();
						
							// Process error
							processError(error);
						});
					};
				
					// Get shown display
					var shownDisplay = self.display.parent().children(":not(.hide)");
					
					// Check if shown display doesn't exist
					if(shownDisplay["length"] === 0) {
					
						// Check if not changing temporary
						if(changingTemporary === false) {
					
							// Set timeout
							setTimeout(function() {
						
								// Show section display
								showSectionDisplay();
							
							}, Section.SHOW_CURRENT_SECTION_DELAY_MILLISECONDS);
						}
						
						// Otherwise
						else {
						
							// Check if unlocked display's children is visible
							if(unlockedDisplay.children().is(":visible") === true) {
							
								// Temporarily hide unlocked display's children and transition end or timeout event
								unlockedDisplay.children().addClass("temporaryHide").transitionEndOrTimeout(function() {
								
									// Set timeout
									setTimeout(function() {
								
										// Show section display
										showSectionDisplay();
									
									}, Section.SHOW_CURRENT_SECTION_DELAY_MILLISECONDS);
									
								}, "opacity");
							}
							
							// Otherwise
							else {
							
								// Temporarily hide unlocked display's children
								unlockedDisplay.children().addClass("temporaryHide");
								
								// Set timeout
								setTimeout(function() {
							
									// Show section display
									showSectionDisplay();
								
								}, Section.SHOW_CURRENT_SECTION_DELAY_MILLISECONDS);
							}
						}
					}
					
					// Otherwise
					else {
					
						// Check if not changing temporary
						if(changingTemporary === false) {
					
							// Check if shown display is visible
							if(shownDisplay.is(":visible") === true) {
							
								// Hide shown display and transition end or timeout event
								shownDisplay.addClass("hide").transitionEndOrTimeout(function() {
								
									// Get current section
									var currentSection = self.sections.getSection(shownDisplay);
									
									// Set timeout
									setTimeout(function() {
									
										// Check if current section exists
										if(currentSection !== Sections.NO_SECTION) {
										
											// Reset the current section
											currentSection.reset();
										}
								
										// Show section display
										showSectionDisplay();
									
									}, Section.SHOW_CURRENT_SECTION_DELAY_MILLISECONDS);
									
								}, "opacity");
							}
							
							// Otherwise
							else {
							
								// Hide shown display
								shownDisplay.addClass("hide");
								
								// Get current section
								var currentSection = self.sections.getSection(shownDisplay);
								
								// Set timeout
								setTimeout(function() {
								
									// Check if current section exists
									if(currentSection !== Sections.NO_SECTION) {
									
										// Reset the current section
										currentSection.reset();
									}
							
									// Show section display
									showSectionDisplay();
								
								}, Section.SHOW_CURRENT_SECTION_DELAY_MILLISECONDS);
							}
						}
						
						// Otherwise
						else {
						
							// Check if unlocked display's children is visible
							if(unlockedDisplay.children().is(":visible") === true) {
							
								// Temporarily hide unlocked display's children and transition end or timeout event
								unlockedDisplay.children().addClass("temporaryHide").transitionEndOrTimeout(function() {
								
									// Hide shown display without transitioning
									shownDisplay.addClass("hide noTransition");
								
									// Get current section
									var currentSection = self.sections.getSection(shownDisplay);
									
									// Set timeout
									setTimeout(function() {
									
										// Allow shown display to transition
										shownDisplay.removeClass("noTransition");
									
										// Check if current section exists
										if(currentSection !== Sections.NO_SECTION) {
										
											// Reset the current section
											currentSection.reset();
										}
								
										// Show section display
										showSectionDisplay();
									
									}, Section.SHOW_CURRENT_SECTION_DELAY_MILLISECONDS);
									
								}, "opacity");
							}
							
							// Otherwise
							else {
							
								// Temporarily hide unlocked display's children
								unlockedDisplay.children().addClass("temporaryHide");
								
								// Hide shown display
								shownDisplay.addClass("hide");
								
								// Get current section
								var currentSection = self.sections.getSection(shownDisplay);
								
								// Set timeout
								setTimeout(function() {
								
									// Check if current section exists
									if(currentSection !== Sections.NO_SECTION) {
									
										// Reset the current section
										currentSection.reset();
									}
							
									// Show section display
									showSectionDisplay();
								
								}, Section.SHOW_CURRENT_SECTION_DELAY_MILLISECONDS);
							}
						}
					}
				});
			}
			
			// Otherwise
			else {
			
				// Set self
				var self = this;
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return initializing
					return self.initialize(state, true).then(function() {
					
						// Check if updating the stack
						if(updateStack === true) {
					
							// Check if not saving the current display
							if(saveCurrentDisplay === false) {
							
								// Clear the stack
								self.sections.clearStack();
							}
							
							// Return pushing state to stack
							return self.sections.pushStateToStack(self).then(function() {
							
								// Update navigation
								self.updateNavigation();
								
								// Check if is temporary
								if(isTemporary === true) {
								
									// Make unlocked display have a minimal interface
									unlockedDisplay.addClass("minimal");
									
									// Show unlocked display's sections display
									unlockedDisplay.find("div.sections").children("div").removeClass("hide");
								}
								
								// Otherwise
								else {
								
									// Make unlocked display not have a minimal interface
									unlockedDisplay.removeClass("minimal");
								}
						
								// Show display
								self.display.removeClass("hide");
							
								// Resolve
								resolve();
							
							// Catch errors
							}).catch(function(error) {
							
								// Reset
								self.reset();
							
								// Reject error
								reject(error);
							});
						}
						
						// Otherwise
						else {
						
							// Return saving the stack
							return self.sections.saveStack().then(function() {
						
								// Update navigation
								self.updateNavigation();
								
								// Check if is temporary
								if(isTemporary === true) {
								
									// Make unlocked display have a minimal interface
									unlockedDisplay.addClass("minimal");
									
									// Show unlocked display's sections display
									unlockedDisplay.find("div.sections").children("div").removeClass("hide");
								}
								
								// Otherwise
								else {
								
									// Make unlocked display not have a minimal interface
									unlockedDisplay.removeClass("minimal");
								}
						
								// Show display
								self.display.removeClass("hide");
							
								// Resolve
								resolve();
							
							// Catch errors
							}).catch(function(error) {
							
								// Reset
								self.reset();
							
								// Reject error
								reject(error);
							});
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Reset
						self.reset();
					
						// Reject error
						reject(error);
					});
				});
			}
		}
		
		// Get display
		getDisplay() {
		
			// Return display
			return this.display;
		}
		
		// Get state
		getState() {
		
			// Check if shown
			if(this.isShown() === true) {
			
				// Update last scroll position
				this.lastScrollPosition = this.display.scrollTop();
			}
			
			// Return state
			return {
			
				// Scroll position
				[Section.STATE_SCROLL_POSITION_NAME]: this.lastScrollPosition,
				
				// Elements states
				[Section.STATE_ELEMENTS_STATES_NAME]: this.elementsStates
			};
		}
		
		// Shown event
		static get SHOWN_EVENT() {
		
			// Return shown event
			return "SectionShownEvent";
		}
		
		// Focus event
		static get FOCUS_EVENT() {
		
			// Return focus event
			return "SectionFocusEvent";
		}
	
	// Protected
		
		// Get sections
		getSections() {
		
			// Return sections
			return this.sections;
		}
		
		// Get settings
		getSettings() {
		
			// Return settings
			return this.settings;
		}
		
		// Get message
		getMessage() {
		
			// Return message
			return this.message;
		}
		
		// Get focus
		getFocus() {
		
			// Return focus
			return this.focus;
		}
		
		// Get application
		getApplication() {
		
			// Return application
			return this.application;
		}
		
		// Get unlocked
		getUnlocked() {
		
			// Return unlocked
			return this.unlocked;
		}
		
		// Get automatic lock
		getAutomaticLock() {
		
			// Return automatic lock
			return this.automaticLock;
		}
		
		// Get scroll
		getScroll() {
		
			// Return scroll
			return this.scroll;
		}
		
		// Get wallets
		getWallets() {
		
			// Return wallets
			return this.wallets;
		}
		
		// Get node
		getNode() {
		
			// Return node
			return this.node;
		}
		
		// Get wake lock
		getWakeLock() {
		
			// Return wake lock
			return this.wakeLock;
		}
		
		// Get transactions
		getTransactions() {
		
			// Return transactions
			return this.transactions;
		}
		
		// Get prices
		getPrices() {
		
			// Return prices
			return this.prices;
		}
		
		// Get clipboard
		getClipboard() {
		
			// Return clipboard
			return this.clipboard;
		}
		
		// Is shown
		isShown() {
		
			// Return if display is shown
			return this.display.hasClass("hide") === false;
		}
		
		// Reset
		reset() {
		
			// Clear restoring state
			this.restoringState = false;
		
			// Blur display's focused element
			this.display.find(":focus").blur();
		
			// Hide navigation buttons
			this.display.find("div.navigation").find("button").addClass("hide");
			
			// Reset display scroll position
			this.display.scrollTop(0);
		}
		
		// Initialize
		initialize(state) {
		
			// Set restoring state
			this.restoringState = true;
			
			// Get elements states from the state
			this.elementsStates = (state !== Section.NO_STATE && Section.STATE_ELEMENTS_STATES_NAME in state === true) ? state[Section.STATE_ELEMENTS_STATES_NAME] : [];
		
			// Set self
			var self = this;
			
			// Turn off section shown section event
			$(this).off(Section.SHOWN_EVENT + ".section");
			
			// Turn off section focus section event
			$(this).off(Section.FOCUS_EVENT + ".section");
		
			// Section shown section event
			$(this).one(Section.SHOWN_EVENT + ".section", function() {
			
				// Get display's scroll position from the state
				self.display.scrollTop((state !== Section.NO_STATE && Section.STATE_SCROLL_POSITION_NAME in state === true) ? state[Section.STATE_SCROLL_POSITION_NAME] : 0);
				
				// Get elements
				var elements = self.display.find("button, input, select, a");
				
				// Go through all elements states
				for(var i = 0; i < self.elementsStates["length"]; ++i) {
				
					// Get element's state
					var elementsState = self.elementsStates[i];
					
					// Get element
					var element = elements.eq(i);
					
					// Check if element has the correct tag
					if(element.prop("tagName") === elementsState["Tag"]) {
					
						// Check element's tag
						switch(elementsState["Tag"]) {
						
							// Button
							case "BUTTON":
							
								// Check if element's state's value exists
								if(elementsState["Value"] !== Section.NO_VALUE) {
							
									// Check if element's state's value is true
									if(elementsState["Value"] === true) {
									
										// Set element's value
										element.addClass("enabled");
									}
									
									// Otherwise
									else {
									
										// Set element's value
										element.removeClass("enabled");
									}
								}
								
								// Break
								break;
							
							// Input
							case "INPUT":
							
								// Check if element's state's value exists
								if(elementsState["Value"] !== Section.NO_VALUE) {
							
									// Set element's value
									element.val(elementsState["Value"]);
								}
								
								// Break
								break;
							
							// Select
							case "SELECT":
							
								// Check if element's state's value exists
								if(elementsState["Value"] !== Section.NO_VALUE) {
							
									// Set element's value
									element.val(elementsState["Value"]);
								}
							
								// Break
								break;
						}
					}
					
					// Otherwise
					else {
					
						// Break
						break;
					}
				}
			
			// Section section focus event
			}).one(Section.FOCUS_EVENT + ".section", function() {
			
				// Get elements
				var elements = self.display.find("button, input, select, a");
				
				// Set focused element exists
				var focusedElementExists = false;
				
				// Go through all elements states
				for(var i = 0; i < self.elementsStates["length"]; ++i) {
				
					// Get element's state
					var elementsState = self.elementsStates[i];
					
					// Get element
					let element = elements.eq(i);
					
					// Check if element has the correct tag
					if(element.prop("tagName") === elementsState["Tag"]) {
					
						// Check if element's state is focused and it can be tabbed to
						if(elementsState["Focused"] === true && element.attr("tabindex") !== Common.NO_TAB_INDEX) {
						
							// Check if element is visible
							if(element.is(":visible") === true) {
						
								// Focus on element
								element.focus();
								
								// Set timeout
								setTimeout(function() {
								
									// Check if element isn't focused
									if(element.is(":focus") === false) {
								
										// Focus on element
										element.focus();
										
										// Get display's scroll position from the state
										self.display.scrollTop((state !== Section.NO_STATE && Section.STATE_SCROLL_POSITION_NAME in state === true) ? state[Section.STATE_SCROLL_POSITION_NAME] : 0);
									}
								}, 0);
								
								// Set focused element exists
								focusedElementExists = true;
							}
						}
						
						// Check element's tag
						switch(elementsState["Tag"]) {
						
							// Input
							case "INPUT":
							
								// Check if element's state's value exists
								if(elementsState["Value"] !== Section.NO_VALUE) {
							
									// Trigger input event on the element
									element.trigger("input", [
					
										// Is focus event
										true,
										
										// Force input
										true
									]);
								}
								
								// Try
								try {
								
									// Check if element's state's selection start exists
									if(elementsState["Selection Start"] !== Section.NO_VALUE) {
								
										// Set element's selection start
										element.get(0)["selectionStart"] = elementsState["Selection Start"];
									}
									
									// Check if element's state's selection end exists
									if(elementsState["Selection End"] !== Section.NO_VALUE) {
									
										// Set element's selection end
										element.get(0)["selectionEnd"] = elementsState["Selection End"];
									}
									
									// Check if element's state's selection direction exists
									if(elementsState["Selection Direction"] !== Section.NO_VALUE) {
									
										// Set element's selection direction
										element.get(0)["selectionDirection"] = elementsState["Selection Direction"];
									}
								}
								
								// Catch errors
								catch(error) {
								
								}
								
								// Break
								break;
							
							// Select
							case "SELECT":
							
								// Check if element's state's value exists
								if(elementsState["Value"] !== Section.NO_VALUE) {
							
									// Trigger input event on the element
									element.trigger("input");
								}
							
								// Break
								break;
						}
					}
					
					// Otherwise
					else {
					
						// Break
						break;
					}
				}
				
				// Check if focused element exists
				if(focusedElementExists === true) {
				
					// Get display's scroll position from the state
					self.display.scrollTop((state !== Section.NO_STATE && Section.STATE_SCROLL_POSITION_NAME in state === true) ? state[Section.STATE_SCROLL_POSITION_NAME] : 0);
				}
				
				// Clear restoring state
				self.restoringState = false;
			});
			
			// Return promise
			return new Promise(function(resolve, reject) {
				
				// Resolve
				resolve();
			});
		}
		
		// Get initialize error header
		getInitializeErrorHeader() {
		
			// Return initialize error header
			return "";
		}
		
		// Update state
		updateState() {
		
			// Update elements states
			this.updateElementsStates();
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return updating state in stack
				return self.sections.updateStateInStack(self).then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
	
	// Private
	
		// Update navigation
		updateNavigation() {
		
			// Check if a previous section exists
			if(this.sections.getStackIndex() - 1 > 0) {
			
				// Show navigation back button
				this.display.find("div.navigation").find("button.back").removeClass("hide");
			}
			
			// Otherwise
			else {
			
				// Hide navigation back button
				this.display.find("div.navigation").find("button.back").addClass("hide");
			}
			
			// Check if a next section exists
			if(this.sections.getStackIndex() < this.sections.getStackLength()) {
			
				// Show navigation forward button
				this.display.find("div.navigation").find("button.forward").removeClass("hide");
			}
			
			// Otherwise
			else {
			
				// Hide navigation forward button
				this.display.find("div.navigation").find("button.forward").addClass("hide");
			}
		}
		
		// Update elements states
		updateElementsStates() {
		
			// Clear elements states
			this.elementsStates = [];
			
			// Set self
			var self = this;
			
			// Go through all applicable elements in the display
			this.display.find("button, input, select, a").each(function() {
			
				// Get element
				var element = $(this);
				
				// Initialize element's state
				var elementsState = {
				
					// Tag
					"Tag": element.prop("tagName"),
				
					// Focused
					"Focused": element.is(":focus")
				};
				
				// Check element's tag
				switch(element.prop("tagName")) {
				
					// Button
					case "BUTTON":
					
						// Set element's state's value
						elementsState["Value"] = (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "private") === Common.NO_ATTRIBUTE) ? element.hasClass("enabled") : Section.NO_VALUE;
					
						// Break
						break;
					
					// Input
					case "INPUT":
					
						// Set element's state's value
						elementsState["Value"] = (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "private") === Common.NO_ATTRIBUTE) ? element.val() : Section.NO_VALUE;
						
						// Set element's state's selection start
						elementsState["Selection Start"] = (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "private") === Common.NO_ATTRIBUTE) ? element.get(0)["selectionStart"] : Section.NO_VALUE;
						
						// Set element's state's selection end
						elementsState["Selection End"] = (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "private") === Common.NO_ATTRIBUTE) ? element.get(0)["selectionEnd"] : Section.NO_VALUE;
						
						// Set element's state's selection direction
						elementsState["Selection Direction"] = (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "private") === Common.NO_ATTRIBUTE) ? element.get(0)["selectionDirection"] : Section.NO_VALUE;
					
						// Break
						break;
					
					// Select
					case "SELECT":
					
						// Set element's state's value
						elementsState["Value"] = (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "private") === Common.NO_ATTRIBUTE) ? element.children(":selected").val() : Section.NO_VALUE;
					
						// Break
						break;
				}
				
				// Append element's state to list
				self.elementsStates.push(elementsState);
			});
		}
		
		// Update dots
		static updateDots(text) {
		
			// Set text's width to overflow
			text.addClass("overflow");
			
			// Get the width of its child
			var width = Math.ceil(text.children("span").get(0).getBoundingClientRect()["width"]) + "px";
			
			// Set text's width and minimum width to the width of its child
			text.css("width", width);
			text.css("min-width", width);
			
			// Prevent text's width from overflowing
			text.removeClass("overflow");
			
			// Get dots
			var dots = text.siblings("span.dots");
			
			// Show dots
			dots.removeClass("hide");
			
			// Check if dot's width is too small
			if(dots.get(0).getBoundingClientRect()["width"] < parseFloat(dots.css("font-size")) * Section.SETTINGS_DOTS_MINIMUM_WIDTH) {
			
				// Hide dots
				dots.addClass("hide");
			}
		}
	
		// Show current section delay milliseconds
		static get SHOW_CURRENT_SECTION_DELAY_MILLISECONDS() {
		
			// Return show current section delay milliseconds
			return 150;
		}
		
		// No state
		static get NO_STATE() {
		
			// Return no state
			return null;
		}
		
		// Settings dots minimum width
		static get SETTINGS_DOTS_MINIMUM_WIDTH() {
		
			// Return settings dots minimum width
			return parseFloat("1.7em");
		}
		
		// State scroll position name
		static get STATE_SCROLL_POSITION_NAME() {
		
			// Return state scroll position name
			return "Scroll Position";
		}
		
		// State elements states name
		static get STATE_ELEMENTS_STATES_NAME() {
		
			// Return state elements states name
			return "Elements States";
		}
		
		// No value
		static get NO_VALUE() {
		
			// Return no value
			return null;
		}
}


// Main function

// Set global object's section
globalThis["Section"] = Section;
