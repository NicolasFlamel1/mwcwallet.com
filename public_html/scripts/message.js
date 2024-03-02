// Use strict
"use strict";


// Classes

// Message class
class Message {

	// Public
	
		// Constructor
		constructor(application, focus, clipboard) {
		
			// Set application
			this.application = application;
			
			// Set focus
			this.focus = focus;
			
			// Set clipboard
			this.clipboard = clipboard;
		
			// Get message display
			this.messageDisplay = $("aside.message");
			
			// Get body display
			this.bodyDisplay = $("body");
			
			// Set message queue
			this.messageQueue = [];
			
			// Set messages allowed
			this.messagesAllowed = false;
			
			// Set shutting down
			this.shuttingDown = false;
			
			// Set self
			var self = this;
			
			// Disable
			this.disable();
			
			// Window resize event
			$(window).on("resize", function() {
			
				// Update scroll bars
				self.updateScrollBars();
			});
			
			// Message display text scroll event
			this.messageDisplay.find("p").on("scroll", function() {
			
				// Check if scrolled to the top
				if(this["scrollTop"] <= 0)
				
					// Hide scroll up arrow
					$(this).parent().removeClass("scrollUp");
				
				// Otherwise
				else
				
					// Show scroll up arrow
					$(this).parent().addClass("scrollUp");
				
				// Check if scrolled to the bottom
				if(Math.abs(this["scrollHeight"] - this["clientHeight"] - this["scrollTop"]) <= Scroll.TOLERANCE || this["scrollHeight"] - this["scrollTop"] <= this["clientHeight"]) {
				
					// Hide scroll down arrow
					$(this).parent().removeClass("scrollDown");
				}
				
				// Otherwise
				else {
				
					// Show scroll down arrow
					$(this).parent().addClass("scrollDown");
				}
			
			// Message display text language change event
			}).on(Language.CHANGE_EVENT, function() {
			
				// Update scroll bars
				self.updateScrollBars();
			});
			
			// Message text input input event
			$(document).on("input", "aside.message > div > div > p > span.text span.input > input", function() {
			
				// Get input
				var input = $(this);
				
				// Check if input's value is empty
				if(input.val()["length"] === 0) {
				
					// Set that input is empty
					input.removeClass("notEmpty");
				}
				
				// Otherwise
				else {
				
					// Set that input isn't empty
					input.addClass("notEmpty");
				}
			
			// Message text input key down event
			}).on("keydown", "aside.message > div > div > p > span.text span.input > input", function(event) {
			
				// Check if enter was pressed
				if(event["which"] === "\r".charCodeAt(0)) {
				
					// Trigger click event on last unhidden message display button
					self.messageDisplay.find("button:not(:hidden)").last().trigger("click");
				}
			
			// Message text input show click event
			}).on("click", "aside.message > div > div > p > span.text span.input > span.show", function(event) {
			
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
			
			// Message text input show mouse down event
			}).on("mousedown", "aside.message > div > div > p > span.text span.input > span.show", function(event) {
			
				// Get target
				var target = $(this);
				
				// Check if target's input has focus
				if(target.siblings("input").is(":focus") === true) {
			
					// Prevent stealing focus
					event.preventDefault();
					
					// Trigger focus change event
					target.trigger(Common.FOCUS_CHANGE_EVENT);
				}
			
			// Message radio input key down event
			}).on("keydown", "aside.message > div > div > p > span.text span.radio > input", function(event) {
			
				// Check if enter was pressed
				if(event["which"] === "\r".charCodeAt(0)) {
				
					// Trigger click event on last unhidden message display button
					self.messageDisplay.find("button:not(:hidden)").last().trigger("click");
				}
			
			// Message copy button click and touch end event
			}).on("click touchend", "aside.message > div > div > p > span.text span.copy", function(event) {
			
				// Check if event is touch end
				if("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") {
				
					// Check if address copy isn't under the touch area
					var changedTouch = event["originalEvent"]["changedTouches"][0];
					if(this !== document.elementFromPoint(changedTouch["clientX"], changedTouch["clientY"])) {
					
						// Return
						return;
					}
				}
				
				// Stop propagation
				event.stopPropagation();
				
				// Get copy button
				var copyButton = $(this);
				
				// Check if copy button isn't already clicked
				if(copyButton.hasClass("clicked") === false) {
				
					// Set that copy button is clicked
					copyButton.addClass("clicked");
				
					// Get if application is showing loading
					var loadingShown = self.application.isShowingLoading() === true;
					
					// Show loading
					self.application.showLoading();
					
					// Set timeout
					setTimeout(function() {
					
						// Get value
						var value = copyButton.prev().text();
					
						// Copy value to clipboard
						self.clipboard.copy(value).then(function() {
						
							// TODO Securely clear value
						
							// Set timeout
							setTimeout(function() {
							
								// Check if loading wasn't shown before
								if(loadingShown === false) {
								
									// Hide loading
									self.application.hideLoading();
								}
							
								// Set that copy button isn't clicked
								copyButton.removeClass("clicked");
								
							}, Message.COPY_VALUE_TO_CLIPBOARD_AFTER_DELAY_MILLISECONDS);
						
						// Catch errors
						}).catch(function(error) {
						
							// TODO Securely clear value
						
							// Trigger a fatal error
							new FatalError(FatalError.UNKNOWN_ERROR);
						});
					
					}, ("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") ? 0 : Message.COPY_VALUE_TO_CLIPBOARD_BEFORE_DELAY_MILLISECONDS);
				}
			});
			
			// Update scroll bars
			this.updateScrollBars();
			
			// Set timeout
			setTimeout(function() {
			
				// Update scroll bars
				self.updateScrollBars();
			}, 0);
		}
		
		// Uninitialize
		uninitialize() {
		
			// Set shutting down
			this.shuttingDown = true;
		
			// Go through all messages in the message queue
			for(var i = 0; i < this.messageQueue["length"]; ++i) {
			
				// Show message
				this.messageQueue[i]();
			}
			
			// Clear message queue
			this.messageQueue = [];
		
			// Reset
			this.reset();
		}
		
		// Show
		show(header, text, showImmediately = false, beforeShow = Message.NO_BEFORE_SHOW_FUNCTION, firstButton = Message.NO_BUTTON, secondButton = Message.NO_BUTTON, allowIfShown = false, visibleState = Message.VISIBLE_STATE_ALL, secondButtonIsDangerous = false) {
		
			// Check if shutting down
			if(this.shuttingDown === true) {
			
				// TODO Securely clear text
				
				// Set self
				var self = this;
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Trigger not displayed event
					$(self).trigger(Message.NOT_DISPLAYED_EVENT);
				
					// Resolve not displayed result
					resolve(Message.NOT_DISPLAYED_RESULT);
				});
			}
			
			// Otherwise check if messages are allowed or allow if shown and message display is hidden or showing immediately
			else if((this.messagesAllowed === true || allowIfShown === true) && (this.isShown() === false || showImmediately === true)) {
				
				// Check if visible state isn't applicable or run before show failed
				if(this.isVisibleStateApplicable(visibleState) === false || (beforeShow !== Message.NO_BEFORE_SHOW_FUNCTION && beforeShow() === false)) {
				
					// TODO Securely clear text
				
					// Check if message queue isn't empty
					if(this.messageQueue["length"] !== 0) {
					
						// Get next message
						var nextMessage = this.messageQueue.shift();
							
						// Show next message
						nextMessage();
						
						// Set self
						var self = this;
						
						// Return promise
						return new Promise(function(resolve, reject) {
						
							// Trigger not displayed event
							$(self).trigger(Message.NOT_DISPLAYED_EVENT);
						
							// Resolve not displayed result
							resolve(Message.NOT_DISPLAYED_RESULT);
						});
					}
					
					// Otherwise
					else {
					
						// Check if shown
						if(this.isShown() === true) {
						
							// Hide message display
							this.messageDisplay.addClass("hide");
							
							// Set self
							var self = this;
							
							// Return promise
							return new Promise(function(resolve, reject) {
						
								// Message display transition end or timeout event
								self.messageDisplay.transitionEndOrTimeout(function() {
								
									// Check if message display is still hidden
									if(self.isShown() === false) {
									
										// Set that body display isn't showing a message
										self.bodyDisplay.removeClass("message");
								
										// Reset
										self.reset();
										
										// Set that message can show display message
										self.messageDisplay.removeClass("noMessage");
									}
									
									// Trigger not displayed event
									$(self).trigger(Message.NOT_DISPLAYED_EVENT);
								
									// Resolve not displayed result
									resolve(Message.NOT_DISPLAYED_RESULT);
									
								}, "opacity");
							});
						}
						
						// Otherwise
						else {
						
							// Set self
							var self = this;
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Trigger not displayed event
								$(self).trigger(Message.NOT_DISPLAYED_EVENT);
							
								// Resolve not displayed result
								resolve(Message.NOT_DISPLAYED_RESULT);
							});
						}
					}
				}
				
				// Otherwise
				else {
				
					// Disable
					this.disable();
				
					// Check if allow if shown
					if(allowIfShown === true)
					
						// Set messages allowed
						this.messagesAllowed = true;
					
					// Set self
					var self = this;
			
					// Return promise
					return new Promise(function(resolve, reject) {
					
						// Show message
						var showMessage = function() {
						
							// Trigger before show event
							var event = $.Event(Message.BEFORE_SHOW_EVENT);
							$(self).trigger(event);
							
							// Check if event was canceled
							if(event["result"] === false) {
							
								// Check if message queue isn't empty
								if(self.messageQueue["length"] !== 0) {
								
									// Get next message
									var nextMessage = self.messageQueue.shift();
										
									// Show next message
									nextMessage();
									
									// Trigger not displayed event
									$(self).trigger(Message.NOT_DISPLAYED_EVENT);
									
									// Resolve not displayed result
									resolve(Message.NOT_DISPLAYED_RESULT);
								}
								
								// Otherwise
								else {
								
									// Check if shown
									if(self.isShown() === true) {
									
										// Hide message display
										self.messageDisplay.addClass("hide");
										
										// Message display transition end or timeout event
										self.messageDisplay.transitionEndOrTimeout(function() {
										
											// Check if message display is still hidden
											if(self.isShown() === false) {
											
												// Set that body display isn't showing a message
												self.bodyDisplay.removeClass("message");
										
												// Reset
												self.reset();
												
												// Set that message can show display message
												self.messageDisplay.removeClass("noMessage");
											}
											
											// Trigger not displayed event
											$(self).trigger(Message.NOT_DISPLAYED_EVENT);
										
											// Resolve not displayed result
											resolve(Message.NOT_DISPLAYED_RESULT);
											
										}, "opacity");
									}
									
									// Otherwise
									else {
									
										// Trigger not displayed event
										$(self).trigger(Message.NOT_DISPLAYED_EVENT);
									
										// Resolve not displayed result
										resolve(Message.NOT_DISPLAYED_RESULT);
									}
								}
							}
							
							// Otherwise
							else {
						
								// Get message display header
								var messageDisplayHeader = self.messageDisplay.find("h2");
							
								// Set message display header text and make it translatable
								messageDisplayHeader.text(Language.getTranslation(header));
								messageDisplayHeader.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", header);
								
								// Set message display text HTML
								self.messageDisplay.find("p").children("span.text").html(text);
								
								// TODO Securely clear text
								
								// Set focus on message to if nothing has focus
								var focusOnMessage = $(":focus")["length"] === 0;
								
								// Check if a first button is provided
								if(firstButton !== Message.NO_BUTTON) {
								
									// Show and set message display first button and make it translatable
									self.messageDisplay.removeClass("noButtons").addClass("oneButton").find("button").first().children("span").first().text(Language.getTranslation(firstButton)).attr(Common.DATA_ATTRIBUTE_PREFIX + "text", firstButton);
									
									// Check if focusing on message and document has focus
									if(focusOnMessage === true && document.hasFocus() === true) {
									
										// Make first button appear focused
										self.messageDisplay.find("button").first().addClass("focus");
									}
									
									// Check if a second button is provided
									if(secondButton !== Message.NO_BUTTON) {
									
										// Show and set message display second button and make it translatable
										self.messageDisplay.removeClass("oneButton").find("button").eq(1).children("span").first().text(Language.getTranslation(secondButton)).attr(Common.DATA_ATTRIBUTE_PREFIX + "text", secondButton);
										
										// Check if second button is dangerous
										if(secondButtonIsDangerous === true) {
										
											// Indicate that second button is dangerous
											self.messageDisplay.find("button").eq(1).addClass("dangerous");
										}
										
										// Otherwise
										else {
										
											// Indicate that second button isn't dangerous
											self.messageDisplay.find("button").eq(1).removeClass("dangerous");
										}
									}
									
									// Otherwise
									else {
									
										// Remove message display second button text
										self.messageDisplay.find("button").eq(1).removeClass("dangerous").children("span").first().text("").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "text");
									}
								}
								
								// Otherwise
								else {
								
									// Hide message display buttons
									self.messageDisplay.addClass("noButtons").removeClass("oneButton");
									
									// Remove message display buttons text
									self.messageDisplay.find("button").first().children("span").first().text("").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "text");
									self.messageDisplay.find("button").eq(1).children("span").first().text("").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "text");
								}
								
								// Set message display visible state
								self.messageDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "visibleState", visibleState.toFixed());
								
								// Scroll to the top of message display text
								self.messageDisplay.find("p").scrollTop(0);
							
								// Turn off message display buttons click event and set that they aren't loading
								self.messageDisplay.find("button").off("click").removeClass("loading");
								
								// Translate message display
								Language.translateElement(self.messageDisplay);
								
								// Trigger before show not cabcelable event
								$(self).trigger(Message.BEFORE_SHOW_NOT_CANCELABLE_EVENT);
								
								// After message shown
								var afterMessageShown = function() {
								
									// Check if a button was provided
									if(firstButton !== Message.NO_BUTTON) {
									
										// Message hide message event
										$(self).one(Message.HIDE_EVENT + ".message", function() {
										
											// Turn off message display button click event, blur message display buttons, and disable message display buttons
											self.messageDisplay.find("button").off("click").blur().disable();
											
											// Turn off window focus message event
											$(window).off("focus.message");
											
											// Resolve not displayed result
											resolve(Message.NOT_DISPLAYED_RESULT);
										});
									
										// Message display first button click event
										self.messageDisplay.find("button").first().one("click", function() {
										
											// Get button
											var button = $(this);
										
											// Turn off message hide message event
											$(self).off(Message.HIDE_EVENT + ".message");
											
											// Check if button has focus
											if(button.is(":focus") === true) {
											
												// Add focus apperance to first button
												button.addClass("focus");
											}
											
											// Blue focused element
											$(":focus").blur();
											
											// Remove selection
											Focus.removeSelection();
										
											// Turn off message display button click event, blur message display buttons, and disable message display buttons
											self.messageDisplay.find("button").off("click").blur().disable();
											
											// Turn off window focus message event
											$(window).off("focus.message");
											
											// Trigger first button click event
											$(self).trigger(Message.FIRST_BUTTON_CLICK_EVENT);
										
											// Resolve first button clicked result
											resolve(Message.FIRST_BUTTON_CLICKED_RESULT);
										});
										
										// Message display second button click event
										self.messageDisplay.find("button").eq(1).one("click", function() {
										
											// Get button
											var button = $(this);
										
											// Turn off message hide message event
											$(self).off(Message.HIDE_EVENT + ".message");
											
											// Check if button has focus
											if(button.is(":focus") === true) {
											
												// Add focus apperance to second button
												button.addClass("focus");
											}
											
											// Blue focused element
											$(":focus").blur();
											
											// Remove selection
											Focus.removeSelection();
										
											// Turn off message display button click event, blur message display buttons, and disable message display buttons
											self.messageDisplay.find("button").off("click").blur().disable();
											
											// Turn off window focus message event
											$(window).off("focus.message");
											
											// Trigger second button click event
											$(self).trigger(Message.SECOND_BUTTON_CLICK_EVENT);
										
											// Resolve second button clicked result
											resolve(Message.SECOND_BUTTON_CLICKED_RESULT);
										});
										
										// Enable tabbing to everything in message display and enable everything in message display
										self.messageDisplay.find("*").enableTab().enable();
										
										// Check if focusing on message
										if(focusOnMessage === true) {
										
											// Check if document has focus
											if(document.hasFocus() === true) {
											
												// Focus on message display first button
												self.messageDisplay.find("button").first().focus();
											}
											
											// Otherwise
											else {
											
												// Window focus message event
												$(window).one("focus.message", function() {
												
													// Focus on message display first button
													self.messageDisplay.find("button").first().focus();
												});
											}
										}
										
										// Remove focus apperance from first button
										self.messageDisplay.find("button").first().removeClass("focus");
										
										// Trigger message show event
										$(self).trigger(Message.SHOW_EVENT);
									}
									
									// Otherwise
									else {
									
										// Enable tabbing to everything in message display and enable everything in message display
										self.messageDisplay.find("*").enableTab().enable();
										
										// Trigger message show event
										$(self).trigger(Message.SHOW_EVENT);
									
										// Resolve displayed result
										resolve(Message.DISPLAYED_RESULT);
									}
								};
								
								// Check if message display is hidden
								if(self.isShown() === false) {
								
									// Show message display
									self.messageDisplay.removeClass("hide");
									
									// Set that body display is showing a message
									self.bodyDisplay.addClass("message");
									
									// Prevent message display arrows from fading
									self.messageDisplay.addClass("noArrowTransition");
									
									// Update scroll bars
									self.updateScrollBars();
									
									// Allow message display arrows to fade
									self.messageDisplay.removeClass("noArrowTransition");
									
									// Message display transition end or timeout event
									self.messageDisplay.transitionEndOrTimeout(function() {
									
										// After message shown
										afterMessageShown();
										
									}, "opacity");
								}
								
								// Otherwise
								else {
								
									// Show message display message
									self.messageDisplay.removeClass("noMessage");
									
									// Prevent message display arrows from fading
									self.messageDisplay.addClass("noArrowTransition");
									
									// Update scroll bars
									self.updateScrollBars();
									
									// Allow message display arrows to fade
									self.messageDisplay.removeClass("noArrowTransition");
									
									// Message display message transition end or timeout event
									self.messageDisplay.children("div").transitionEndOrTimeout(function() {
									
										// After message shown
										afterMessageShown();
										
									}, "opacity");
								}
							}
						};
						
						// Check if message display is showing and its message display isn't hidden
						if(self.isShown() === true && self.messageDisplay.hasClass("noMessage") === false) {
						
							// Trigger hide event
							$(self).trigger(Message.HIDE_EVENT);
						
							// Hide message display message
							self.messageDisplay.addClass("noMessage");
							
							// Message display message transition end or timeout event
							self.messageDisplay.children("div").transitionEndOrTimeout(function() {
							
								// Reset
								self.reset();
								
								// Set timeout
								setTimeout(function() {
								
									// Show message
									showMessage();
								}, 0);
								
							}, "opacity");
						}
						
						// Otherwise
						else {
						
							// Show message
							showMessage();
						}
					});
				}
			}
			
			// Otherwise
			else {
			
				// Check if shown and message display message is hidden
				if(this.isShown() === true && this.messageDisplay.hasClass("noMessage") === true) {
				
					// Hide message display
					this.messageDisplay.addClass("hide");
					
					// Set self
					var self = this;
					
					// Return promise
					return new Promise(function(resolve, reject) {
				
						// Message display transition end or timeout event
						self.messageDisplay.transitionEndOrTimeout(function() {
						
							// Check if message display is still hidden
							if(self.isShown() === false) {
							
								// Set that body display isn't showing a message
								self.bodyDisplay.removeClass("message");
						
								// Reset
								self.reset();
								
								// Set that message can show display message
								self.messageDisplay.removeClass("noMessage");
							}
							
							// Append message to queue
							self.messageQueue.push(function() {
							
								// Return showing message
								return self.show(header, text, true, beforeShow, firstButton, secondButton, allowIfShown, visibleState, secondButtonIsDangerous).then(function(result) {
								
									// Resolve result
									resolve(result);
								});
							});
						}, "opacity");
					});
				}
				
				// Otherwise
				else {
				
					// Set self
					var self = this;
				
					// Return promise
					return new Promise(function(resolve, reject) {
					
						// Append message to queue
						self.messageQueue.push(function() {
						
							// Return showing message
							return self.show(header, text, true, beforeShow, firstButton, secondButton, allowIfShown, visibleState, secondButtonIsDangerous).then(function(result) {
							
								// Resolve result
								resolve(result);
							});
						});
					});
				}
			}
		}
		
		// Hide
		hide(uninitialize = false) {
		
			// Disable
			this.disable();
			
			// Check if uninitializing
			if(uninitialize === true) {
			
				// Set shutting down
				this.shuttingDown = true;
			
				// Go through all messages in the message queue
				for(var i = 0; i < this.messageQueue["length"]; ++i) {
				
					// Show message
					this.messageQueue[i]();
				}
				
				// Clear message queue
				this.messageQueue = [];
			}
			
			// Trigger hide event
			$(this).trigger(Message.HIDE_EVENT);
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if message queue isn't empty
				if(self.messageQueue["length"] !== 0) {
				
					// Hide message display message
					self.messageDisplay.addClass("noMessage");
					
					// Message display message transition end or timeout event
					self.messageDisplay.children("div").transitionEndOrTimeout(function() {
					
						// Reset
						self.reset();
					
						// Set timeout
						setTimeout(function() {
						
							// Get next message
							var nextMessage = self.messageQueue.shift();
								
							// Show next message
							nextMessage();
						
							// Resolve
							resolve();
						}, 0);
						
					}, "opacity");
				}
				
				// Otherwise
				else {
		
					// Hide message display
					self.messageDisplay.addClass("hide");
					
					// Message display transition end or timeout event
					self.messageDisplay.transitionEndOrTimeout(function() {
					
						// Check if message display is still hidden
						if(self.isShown() === false) {
						
							// Set that body display isn't showing a message
							self.bodyDisplay.removeClass("message");
					
							// Reset
							self.reset();
							
							// Set that message can show display message
							self.messageDisplay.removeClass("noMessage");
						}
					
						// Resolve
						resolve();
						
					}, "opacity");
				}
			});
		}
		
		// Replace
		replace(messageType = Message.NO_MESSAGE_TYPE, messageData = Message.NO_MESSAGE_DATA) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Show message event
				$(self).one(Message.SHOW_EVENT + ".message", function() {
				
					// Turn off cancel replace event
					$(self).off(Message.CANCEL_REPLACE_EVENT);
					
					// Turn off not displayed event
					$(self).off(Message.NOT_DISPLAYED_EVENT);
				
					// Resolve replace show result
					resolve(Message.REPLACE_SHOW_RESULT);
				
				// Cancel replace event
				}).one(Message.CANCEL_REPLACE_EVENT, function() {
				
					// Turn off show message event
					$(self).off(Message.SHOW_EVENT + ".message");
					
					// Turn off not displayed event
					$(self).off(Message.NOT_DISPLAYED_EVENT);
				
					// Resolve replace cancel result
					resolve(Message.REPLACE_CANCEL_RESULT);
					
				
				// Not displayed event
				}).one(Message.NOT_DISPLAYED_EVENT, function() {
				
					// Turn off show message event
					$(self).off(Message.SHOW_EVENT + ".message");
					
					// Turn off cancel replace event
					$(self).off(Message.CANCEL_REPLACE_EVENT);
				
					// Resolve replace not displayed result
					resolve(Message.REPLACE_NOT_DISPLAYED_RESULT);
				});
				
				// Trigger before replace event
				var event = $.Event(Message.BEFORE_REPLACE_EVENT);
				$(self).trigger(event, [
				
					// Message type
					messageType,
					
					// Message data
					messageData
				]);
				
				// Check if event wasn't canceled
				if(event["result"] !== false) {
		
					// Trigger replace event
					$(self).trigger(Message.REPLACE_EVENT, [
					
						// Message type
						messageType,
						
						// Message data
						messageData
					]);
				}
			});
		}
		
		// Cancel replace
		cancelReplace() {
		
			// Trigger cancel replace event
			$(this).trigger(Message.CANCEL_REPLACE_EVENT);
		}
		
		// Is shown
		isShown() {
		
			// Return is message display isn't hidden
			return this.messageDisplay.hasClass("hide") === false;
		}
		
		// Set button loading
		setButtonLoading(button) {
		
			// Check if button is the first button
			if(button === Message.FIRST_BUTTON)
			
				// Set that button element is message display first button
				var buttonElement = this.messageDisplay.find("button").first();
			
			// Otherwise check if button is the first button
			else if(button === Message.SECOND_BUTTON)
			
				// Set that button element is message display second button
				var buttonElement = this.messageDisplay.find("button").eq(1);
			
			// Set that button element is loading
			buttonElement.addClass("loading");
		}
		
		// Prevent
		prevent() {
		
			// Clear messages allowed
			this.messagesAllowed = false;
		}
		
		// Allow
		allow() {
		
			// Check if messages aren't allowed
			if(this.messagesAllowed === false) {
			
				// Set messages allowed
				this.messagesAllowed = true;
				
				// Check if message display is hidden
				if(this.isShown() === false) {
				
					// Check if message display message is hidden
					if(this.messageDisplay.hasClass("noMessage") === true) {
					
						// Set self
						var self = this;
					
						// Message display transition end or timeout event
						this.messageDisplay.transitionEndOrTimeout(function() {
						
							// Check if message display is still hidden
							if(self.isShown() === false) {
						
								// Check if message queue isn't empty
								if(self.messageQueue["length"] !== 0) {
								
									// Get next message
									var nextMessage = self.messageQueue.shift();
										
									// Show next message
									nextMessage();
								}
							}
						}, "opacity");
					}
					
					// Otherwise
					else {
					
						// Check if message queue isn't empty
						if(this.messageQueue["length"] !== 0) {
						
							// Get next message
							var nextMessage = this.messageQueue.shift();
								
							// Show next message
							nextMessage();
						}
					}
				}
			}
		}
		
		// Get allowed
		getAllowed() {
		
			// Return if messages are allowed
			return this.messagesAllowed === true;
		}
		
		// Visible state
		visibleState() {
		
			// Get message display visible state
			var visibleState = this.messageDisplay.attr(Common.DATA_ATTRIBUTE_PREFIX + "visibleState");
			
			// Return visible state or none if it doesn't exist
			return (visibleState !== Common.NO_ATTRIBUTE) ? parseInt(visibleState, Common.DECIMAL_NUMBER_BASE) : Message.VISIBLE_STATE_NONE;
		}
		
		// Show success result
		showSuccessResult() {
		
			// Disable
			this.disable();
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Get message display text's result
				var result = self.messageDisplay.find("p").children("span.text").find("span.result");
				
				// Check if result doesn't exist
				if(result["length"] === 0)
				
					// Reject
					reject();
				
				// Otherwise
				else {
				
					// Change to success result
					result.addClass("success change");
					
					// Result's check mark animation iteration event
					result.find("path.checkMark").one("animationend", function() {
					
						// Resolve
						resolve();
					});
				}
			});
		}
		
		// Show failure result
		showFailureResult() {
		
			// Disable
			this.disable();
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Get message display text's result
				var result = self.messageDisplay.find("p").children("span.text").find("span.result");
				
				// Check if result doesn't exist
				if(result["length"] === 0)
				
					// Reject
					reject();
				
				// Otherwise
				else {
				
					// Change to failure result
					result.addClass("failure change");
					
					// Result's cross animation iteration event
					result.find("path.cross").first().one("animationend", function() {
					
						// Resolve
						resolve();
					});
				}
			});
		}
		
		// Disable
		disable() {
		
			// Check if no message display buttons have a focus apperance
			if(this.messageDisplay.find("button.focus")["length"] === 0) {
			
				// Set focused button to have a focus apperance and blur it
				this.messageDisplay.find("button:focus").addClass("focus").blur();
			}
		
			// Disable tabbing to everything in message display and disable everything in message display
			this.messageDisplay.find("*").disableTab().disable();
			
			// Enable message display text's copy buttons
			this.messageDisplay.find("p").children("span.text").find("span.copy").enable();
			
			// Enable tabbing to message display links and enable them
			this.messageDisplay.find("a").enableTab().enable();
		}
		
		// Enable
		enable() {
		
			// Enable tabbing to everything in message display and enable everything in message display
			this.messageDisplay.find("*").enableTab().enable();
			
			// Set that message display buttons aren't loading
			this.messageDisplay.find("button").removeClass("loading");
		}
		
		// Get input text
		getInputText() {
		
			// Try
			try {
		
				// Return input text
				return this.messageDisplay.find("p").children("span.text").find("span.input").find("input").val();
			}
			
			// Catch errors
			catch(error) {
			
				// Return no input text
				return Message.NO_INPUT_TEXT;
			}
		}
		
		// Get camera
		getCamera() {
		
			// Get camera
			var camera = this.messageDisplay.find("p").children("span.text").find("video");
			
			// Return camera if it exists or no camera otherwise
			return (camera["length"] !== 0) ? camera[0] : Message.NO_CAMERA;
		}
		
		// Get radio button selection
		getRadioButtonSelection() {
		
			// Try
			try {
		
				// Return radio button selection
				return parseInt(this.messageDisplay.find("p").children("span.text").find("input[type=\"radio\"]:checked").val(), Common.DECIMAL_NUMBER_BASE);
			}
			
			// Catch errors
			catch(error) {
			
				// Return no radio button selection
				return Message.NO_RADIO_BUTTON_SELECTION;
			}
		}
		
		// Has camera
		hasCamera() {
		
			// Set that message display message has a camera
			this.messageDisplay.children("div").addClass("camera");
		}
		
		// Create text
		static createText(text, textArguments = []) {
		
			// Return translatable container
			return Language.createTranslatableContainer("<span>", text, textArguments);
		}
		
		// Create input
		static createInput(text, textArguments = [], isPassword = false, autoComplete = false, autoCapitalize = false, spellcheck = false) {
		
			// Create container
			var container = $("<span class=\"input\">" +
				((isPassword === true) ? Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Show'), [], "show", true) : "") +
				Language.createTranslatableContainer("<input>", text, textArguments) +
				"<span></span>" +
				"<span class=\"capsLock hide\"></span>" +
			"</span>");
			
			// Get input from container
			var input = container.find("input");
			
			// Check if password
			if(isPassword) {
			
				// Configure input as password
				input.attr("type", "password");
				input.attr("autocomplete", "current-password");
				input.attr("autocapitalize", (autoCapitalize === true) ? "on" : "off");
				input.attr("spellcheck", "false");
			}
			
			// Otherwise
			else {
			
				// Configure input as text
				input.attr("type", "text");
				input.attr("autocomplete", (autoComplete === true) ? "on" : "off");
				input.attr("autocapitalize", (autoCapitalize === true) ? "on" : "off");
				input.attr("spellcheck", (spellcheck === true) ? "true" : "false");
			}
			
			// Return container's outer HTML
			return container.outerHtml();
		}
		
		// Create radio buttons
		static createRadioButtons(texts = [], textsArguments = []) {
		
			// Initialize container
			var container = $("<span>");
			
			// Go through all texts
			for(var i = 0; i < texts["length"]; ++i) {
			
				// Create text container
				var textContainer = $("<span>");
				
				// Add radio class to text container
				textContainer.addClass("radio");
			
				// Create label from text
				var label = $(Language.createTranslatableContainer("<label>", texts[i], textsArguments[i]));
				label.attr("for", i.toFixed());
				
				// Append radio button and label to text container
				textContainer.append("<input type=\"radio\" id=\"" + i.toFixed() + "\" name=\"messageRadioButtons\" value=\"" + i.toFixed() + "\"" + ((i === 0) ? " checked" : "") + " autocomplete=\"off\" autocapitalize=\"off\" spellcheck=\"false\">");
				textContainer.append(label);
				
				// Append text container to container
				container.append(textContainer);
			}
			
			// Return container's outer HTML
			return container.outerHtml();
		}
		
		// Create camera
		static createCamera() {
		
			// Return camera
			return "<video playsinline></video>";
		}
		
		// Create pin matrix
		static createPinMatrix() {
		
			// Return pin matrix
			return "<span class=\"pinMatrix\">" +
				"<span>A</span>" +
				"<span>B</span>" +
				"<span>C</span>" +
				"<span>D</span>" +
				"<span>E</span>" +
				"<span>F</span>" +
				"<span>G</span>" +
				"<span>H</span>" +
				"<span>I</span>" +
			"</span>";
		}
		
		// Create line break
		static createLineBreak() {
		
			// Return line break
			return "<span class=\"lineBreak\"></span>";
		}
		
		// Create pending result
		static createPendingResult() {
		
			// Return pending result
			return "<span class=\"result\">" + Message.RESULT_SVG + "</span>";
		}
		
		// Create success result
		static createSuccessResult() {
		
			// Return success result
			return "<span class=\"result success instant\">" + Message.RESULT_SVG + "</span>";
		}
		
		// Create failure result
		static createFailureResult() {
		
			// Return failure result
			return "<span class=\"result failure instant\">" + Message.RESULT_SVG + "</span>";
		}
		
		// No before show function
		static get NO_BEFORE_SHOW_FUNCTION() {
		
			// Return no before show function
			return null;
		}
		
		// No button
		static get NO_BUTTON() {
		
			// Return no button
			return null;
		}
		
		// Not displayed result
		static get NOT_DISPLAYED_RESULT() {
		
			// Return not displayed result
			return 0;
		}
		
		// Displayed result
		static get DISPLAYED_RESULT() {
		
			// Return displayed result
			return Message.NOT_DISPLAYED_RESULT + 1;
		}
		
		// First button clicked result
		static get FIRST_BUTTON_CLICKED_RESULT() {
		
			// Return first button clicked result
			return Message.DISPLAYED_RESULT + 1;
		}
		
		// Second button clicked result
		static get SECOND_BUTTON_CLICKED_RESULT() {
		
			// Return second button clicked result
			return Message.FIRST_BUTTON_CLICKED_RESULT + 1;
		}
		
		// Visible state none
		static get VISIBLE_STATE_NONE() {
		
			// Return visible state none
			return 0;
		}
		
		// Visible state create
		static get VISIBLE_STATE_CREATE() {
		
			// Return visible state create
			return 1 << 0;
		}
		
		// Visible state unlock
		static get VISIBLE_STATE_UNLOCK() {
		
			// Return visible state unlock
			return 1 << 1;
		}
		
		// Visible state unlocked
		static get VISIBLE_STATE_UNLOCKED() {
		
			// Return visible state unlocked
			return 1 << 2;
		}
		
		// Visible state all
		static get VISIBLE_STATE_ALL() {
		
			// Return visible state all
			return Message.VISIBLE_STATE_CREATE | Message.VISIBLE_STATE_UNLOCK | Message.VISIBLE_STATE_UNLOCKED;
		}
		
		// First button
		static get FIRST_BUTTON() {
		
			// Return first button
			return 0;
		}
		
		// Second button
		static get SECOND_BUTTON() {
		
			// Return second button
			return Message.FIRST_BUTTON + 1;
		}
		
		// Hide event
		static get HIDE_EVENT() {
		
			// Return hide event
			return "MessageHideEvent";
		}
		
		// Show event
		static get SHOW_EVENT() {
		
			// Return show event
			return "MessageShowEvent";
		}
		
		// Before show event
		static get BEFORE_SHOW_EVENT() {
		
			// Return before show event
			return "MessageBeforeShowEvent";
		}
		
		// Before show not cancelable event
		static get BEFORE_SHOW_NOT_CANCELABLE_EVENT() {
		
			// Return before show event
			return "MessageBeforeShowNotCancelableEvent";
		}
		
		// Before replace event
		static get BEFORE_REPLACE_EVENT() {
		
			// Return before replace event
			return "MessageBeforeReplaceEvent";
		}
		
		// Replace event
		static get REPLACE_EVENT() {
		
			// Return replace event
			return "MessageReplaceEvent";
		}
		
		// First button click event
		static get FIRST_BUTTON_CLICK_EVENT() {
		
			// Return first button click event
			return "MessageFirstButtonClickEvent";
		}
		
		// Second button click event
		static get SECOND_BUTTON_CLICK_EVENT() {
		
			// Return second button click event
			return "MessageSecondButtonClickEvent";
		}
		
		// No input text
		static get NO_INPUT_TEXT() {
		
			// Return no input text
			return null;
		}
		
		// No camera
		static get NO_CAMERA() {
		
			// Return no camera
			return null;
		}
		
		// No radio button selection
		static get NO_RADIO_BUTTON_SELECTION() {
		
			// Return no radio button selection
			return null;
		}
		
		// Replace show result
		static get REPLACE_SHOW_RESULT() {
		
			// Return replace show result
			return 0;
		}
		
		// Replace cancel result
		static get REPLACE_CANCEL_RESULT() {
		
			// Return replace cancel result
			return Message.REPLACE_SHOW_RESULT + 1;
		}
		
		// Replace not displayed result
		static get REPLACE_NOT_DISPLAYED_RESULT() {
		
			// Return replace not displayed result
			return Message.REPLACE_CANCEL_RESULT + 1;
		}
	
	// Private
	
		// Reset
		reset() {
		
			// Remove message display header text
			this.messageDisplay.find("h2").text("").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "text");
			
			// Remove message display buttons text
			this.messageDisplay.find("button").first().children("span").first().text("").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "text");
			this.messageDisplay.find("button").eq(1).children("span").first().text("").removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "text");
			
			// Remove focus apperance from buttons
			this.messageDisplay.find("button").removeClass("focus");
			
			// TODO Securely clear message display text
			
			// Remove message display text HTML
			this.messageDisplay.find("p").children("span.text").html("");
			
			// Remove message display visible state
			this.messageDisplay.removeAttr(Common.DATA_ATTRIBUTE_PREFIX + "visibleState");
			
			// Set that message display message doesn't have a camera
			this.messageDisplay.children("div").removeClass("camera");
		}
		
		// Update scroll bars
		updateScrollBars() {
		
			// Get message display text
			var messageDisplayText = this.messageDisplay.find("p");
			
			// Check if message display is shown
			if(this.isShown() === true) {
				
				// Check if message display text has scroll bars
				if(messageDisplayText.get(0)["scrollHeight"] > messageDisplayText.get(0)["clientHeight"]) {
				
					// Add message display text separator
					messageDisplayText.parent().addClass("separate");
					
					// Set message display arrows margin to scrollbar width
					messageDisplayText.siblings("span").css("margin-right", messageDisplayText.get(0)["offsetWidth"] - messageDisplayText.get(0)["clientWidth"] + "px");
				}
				
				// Otherwise
				else
				
					// Remove message display text separator
					messageDisplayText.parent().removeClass("separate");
			}
			
			// Otherwise
			else
			
				// Remove message display text separator
				messageDisplayText.parent().removeClass("separate");
			
			// Scroll message display text to add or remove arrows
			messageDisplayText.scroll();
		}
		
		// Is visible state applicable
		isVisibleStateApplicable(visibleState) {
		
			// Check if create display is shown and visible state doesn't include create
			if(this.application.isCreateDisplayShown() === true && (visibleState & Message.VISIBLE_STATE_CREATE) === 0)
			
				// Return false
				return false;
			
			// Otherwise check if unlock display is shown and visible state doesn't include unlock
			else if(this.application.isUnlockDisplayShown() === true && (visibleState & Message.VISIBLE_STATE_UNLOCK) === 0)
			
				// Return false
				return false;
			
			// Otherwise check if unlocked display is shown and visible state doesn't include unlocked
			else if(this.application.isUnlockedDisplayShown() === true && (visibleState & Message.VISIBLE_STATE_UNLOCKED) === 0)
			
				// Return false
				return false;
			
			// Otherwise
			else
			
				// Return true
				return true;
		}
		
		// Result SVG
		static get RESULT_SVG() {
		
			// Return result SVG
			return "<svg viewBox=\"0 0 100 100\">" +
				"<circle class=\"loading\" cx=\"50\" cy=\"50\" r=\"50\" pathLength=\"100\"/>" +
				"<circle class=\"background\" cx=\"50\" cy=\"50\" r=\"50\" pathLength=\"100\"/>" +
				"<path class=\"checkMark\" d=\"M" + ((100 - (15 + 25)) / 2 + 2).toFixed() + " " + ((100 - (15 - 25)) / 2 - 6).toFixed() + " l15 15 l25 -25\" pathLength=\"100\"/>" +
				"<path class=\"cross\" d=\"M" + ((100 - 35) / 2).toFixed() + " " + ((100 - 35) / 2).toFixed() + " l35 35\" pathLength=\"100\"/>" +
				"<path class=\"cross\" d=\"M" + ((100 + 35) / 2).toFixed() + " " + ((100 - 35) / 2).toFixed() + " l-35 35\" pathLength=\"100\"/>" +
			"</svg>";
		}
		
		// No message type
		static get NO_MESSAGE_TYPE() {
		
			// Return no message type
			return null;
		}
		
		// No message data
		static get NO_MESSAGE_DATA() {
		
			// Return no message data
			return null;
		}
		
		// Cancel replace event
		static get CANCEL_REPLACE_EVENT() {
		
			// Return cancel replace event
			return "MessageCancelReplaceEvent";
		}
		
		// Not displayed event
		static get NOT_DISPLAYED_EVENT() {
		
			// Return not displayed event
			return "MessageNotDisplayedEvent";
		}
		
		// Copy value to clipboard before delay milliseconds
		static get COPY_VALUE_TO_CLIPBOARD_BEFORE_DELAY_MILLISECONDS() {
		
			// Return copy value to clipboard before delay milliseconds
			return 175;
		}
		
		// Copy value to clipboard after delay milliseconds
		static get COPY_VALUE_TO_CLIPBOARD_AFTER_DELAY_MILLISECONDS() {
		
			// Return copy value to clipboard after delay milliseconds
			return 100;
		}
}


// Main function

// Set global object's message
globalThis["Message"] = Message;
