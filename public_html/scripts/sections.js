// Use strict
"use strict";


// Classes

// Sections class
class Sections {

	// Public
	
		// Constructor
		constructor(settings, message, version) {
		
			// Set settings
			this.settings = settings;
			
			// Set message
			this.message = message;
			
			// Set version
			this.version = version;
			
			// Set sections
			this.sections = {};
			
			// Set stack to setting's default value
			this.stack = JSON.parse(Sections.SETTINGS_SECTIONS_STACK_DEFAULT_VALUE);
			
			// Set stack index to setting's default value
			this.stackIndex = Sections.SETTINGS_SECTIONS_STACK_INDEX_DEFAULT_VALUE;
			
			// Set stack version
			this.stackVersion = version.getVersion();
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Sections stack setting
						self.settings.createValue(Sections.SETTINGS_SECTIONS_STACK_NAME, Sections.SETTINGS_SECTIONS_STACK_DEFAULT_VALUE),
						
						// Sections stack index setting
						self.settings.createValue(Sections.SETTINGS_SECTIONS_STACK_INDEX_NAME, Sections.SETTINGS_SECTIONS_STACK_INDEX_DEFAULT_VALUE),
						
						// Sections stack version setting
						self.settings.createValue(Sections.SETTINGS_SECTIONS_STACK_VERSION_NAME, self.stackVersion)
						
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Sections stack setting
							Sections.SETTINGS_SECTIONS_STACK_NAME,
							
							// Sections stack index setting
							Sections.SETTINGS_SECTIONS_STACK_INDEX_NAME,
							
							// Sections stack version setting
							Sections.SETTINGS_SECTIONS_STACK_VERSION_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Check if stack version changed
							if(settingValues[settings.indexOf(Sections.SETTINGS_SECTIONS_STACK_VERSION_NAME)] !== self.stackVersion) {
							
								// Return setting settings to their default values
								return Promise.all([
						
									// Sections stack setting
									self.settings.setValue(Sections.SETTINGS_SECTIONS_STACK_NAME, Sections.SETTINGS_SECTIONS_STACK_DEFAULT_VALUE),
									
									// Sections stack index setting
									self.settings.setValue(Sections.SETTINGS_SECTIONS_STACK_INDEX_NAME, Sections.SETTINGS_SECTIONS_STACK_INDEX_DEFAULT_VALUE)
									
								]).then(function() {
								
									// Return setting sections stack version setting to the current version
									return self.settings.setValue(Sections.SETTINGS_SECTIONS_STACK_VERSION_NAME, self.stackVersion).then(function() {
								
										// Set stack to setting's default value
										self.stack = JSON.parse(Sections.SETTINGS_SECTIONS_STACK_DEFAULT_VALUE);
										
										// Set stack index to setting's default value
										self.stackIndex = Sections.SETTINGS_SECTIONS_STACK_INDEX_DEFAULT_VALUE;
										
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
							}
							
							// Otherwise
							else {
						
								// Set stack to setting's value
								self.stack = JSON.parse(settingValues[settings.indexOf(Sections.SETTINGS_SECTIONS_STACK_NAME)]);
								
								// Set stack index to setting's value
								self.stackIndex = settingValues[settings.indexOf(Sections.SETTINGS_SECTIONS_STACK_INDEX_NAME)];
								
								// Resolve
								resolve();
							}
						
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
		}
		
		// Register section
		registerSection(section) {
		
			// Append section to list
			this.sections[section.getName()] = section;
		}
		
		// Get stack length
		getStackLength() {
		
			// Return stack length
			return this.stack["length"];
		}
		
		// Get stack index
		getStackIndex() {
		
			// Return stack index
			return this.stackIndex;
		}
		
		// Set stack index
		setStackIndex(stackIndex) {
		
			// Set stack index
			this.stackIndex = stackIndex;
		}
		
		// Get stack
		getStack() {
		
			// Return stack
			return this.stack;
		}
		
		// Set stack
		setStack(stack) {
		
			// Set stack
			this.stack = stack;
		}
		
		// Push state to stack
		pushStateToStack(section) {
		
			// Check if state isn't going to the end of the stack
			if(this.stackIndex !== this.stack["length"]) {
			
				// Remove everything in stack after current index
				this.stack.splice(this.stackIndex);
			}
			
			// Otherwise check if a state exists in the stack
			else if(this.stackIndex !== 0) {
			
				// Get current section
				var currentSection = this.sections[this.stack[this.stackIndex - 1]["Name"]];
			
				// Update current section's state in the stack
				this.stack[this.stackIndex - 1] = {

					// Name
					"Name": currentSection.getName(),
					
					// State
					"State": currentSection.getState()
				};
			}
			
			// Increment stack index
			++this.stackIndex;
			
			// Append section's state to the stack
			this.stack.push({

				// Name
				"Name": section.getName(),
				
				// State
				"State": section.getState()
			});
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return saving stack
				return self.saveStack().then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Insert state in stack
		insertStateInStack(sectionName, state, isTemporary = false) {
		
			// Check if no states exists in the stack
			if(this.stackIndex === 0) {
		
				// Increment stack index
				++this.stackIndex;
			}
		
			// Insert section name and state in the stack
			this.stack.splice(this.stackIndex - 1, 0, {

				// Name
				"Name": sectionName,
				
				// State
				"State": state
			});
			
			// Check if is temporary
			if(isTemporary === true) {
			
				// Set that value in stack is temporary
				this.stack[this.stackIndex - 1]["Temporary"] = true;
			}
			
			// Otherwise
			else {
			
				// Set self
				var self = this;
				
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return saving stack
					return self.saveStack().then(function() {
					
						// Resolve
						resolve();
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				});
			}
		}
		
		// Update state in stack
		updateStateInStack(section, state = Sections.NO_STATE) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if current state in the stack is for the section
				if(self.stackIndex !== 0 && self.stack[self.stackIndex - 1]["Name"] === section.getName()) {
				
					// Get if state is temporary
					var isTemporary = "Temporary" in self.stack[self.stackIndex - 1] === true && self.stack[self.stackIndex - 1]["Temporary"] === true;
					
					// Check if not temporary and unlocked display is showing a minimal display
					if(isTemporary === false && $("div.unlocked").hasClass("minimal") === true) {
					
						// Resolve
						resolve();
					}
					
					// Otherwise
					else {
					
						// Update section's state in the stack
						self.stack[self.stackIndex - 1] = {

							// Name
							"Name": section.getName(),
							
							// State
							"State": (state === Sections.NO_STATE) ? section.getState() : state
						};
						
						// Check if is temporary
						if(isTemporary === true) {
						
							// Set that value in stack is temporary
							self.stack[self.stackIndex - 1]["Temporary"] = true;
						}
						
						// Return saving stack
						return self.saveStack().then(function() {
						
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
				
					// Reject
					reject();
				}
			});
		}
		
		// Update stack
		updateStack() {
		
			// Set current state to no state
			var currentState = Sections.NO_STATE;
		
			// Check if a state exists in the stack
			if(this.stackIndex !== 0) {
			
				// Get current section
				var currentSection = this.sections[this.stack[this.stackIndex - 1]["Name"]];
		
				// Check if current state in the stack is for the current section
				if(this.stack[this.stackIndex - 1]["Name"] === currentSection.getName()) {
				
					// Get current section's state
					currentState = currentSection.getState();
				}
			}
			
			// Otherwise
			else {
			
				// Set current section to no section
				var currentSection = Sections.NO_SECTION;
			}
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if a current section exists
				if(currentSection !== Sections.NO_SECTION) {
		
					// Update current section's state in the stack
					self.updateStateInStack(currentSection, currentState).then(function() {
					
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
				
					// Reject
					reject();
				}
			});
		}
		
		// Clear stack
		clearStack(saveStack = false) {
		
			// Set stack to setting's default value
			this.stack = JSON.parse(Sections.SETTINGS_SECTIONS_STACK_DEFAULT_VALUE);
			
			// Set stack index to setting's default value
			this.stackIndex = Sections.SETTINGS_SECTIONS_STACK_INDEX_DEFAULT_VALUE;
			
			// Check if saving stack
			if(saveStack === true) {
			
				// Set self
				var self = this;
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return saving stack
					return self.saveStack().then(function() {
					
						// Resolve
						resolve();
				
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				});
			}
		}
		
		// Get current section
		getCurrentSection() {
		
			// Return current section or no section if it doesn't exist
			return (this.stackIndex !== 0) ? this.sections[this.stack[this.stackIndex - 1]["Name"]] : Sections.NO_SECTION;
		}
		
		// Get current section name
		getCurrentSectionName() {
		
			// Return current section's name or the default section name if there is no current section
			return (this.stackIndex !== 0) ? this.stack[this.stackIndex - 1]["Name"] : Sections.DEFAULT_SECTION_NAME;
		}
		
		// Get current section state
		getCurrentSectionState() {
		
			// Return current section's state or no state if there is no current section
			return (this.stackIndex !== 0) ? this.stack[this.stackIndex - 1]["State"] : Section.NO_STATE;
		}
		
		// Is current section temporary
		isCurrentSectionTemporary() {
		
			// Return if current section is temporary
			return this.stackIndex !== 0 && "Temporary" in this.stack[this.stackIndex - 1] === true && this.stack[this.stackIndex - 1]["Temporary"] === true;
		}
		
		// Show current section
		showCurrentSection(minimal = true) {
		
			// Check if not minimal
			if(minimal === false) {
			
				// Prevent showing messages
				this.message.prevent();
			
				// Check if a current section exists
				if(this.stackIndex !== 0) {
				
					// Check if current section is temporary
					if("Temporary" in this.stack[this.stackIndex - 1] === true && this.stack[this.stackIndex - 1]["Temporary"] === true) {
					
						// Remove current section from the stack
						this.stack.splice(this.stackIndex - 1, 1);
						
						// Check if there's no more sections
						if(this.stack["length"] === 0) {
						
							// Decrement stack index
							--this.stackIndex;
						}
					}
				}
				
				// Check if an extension request exists
				if(Extension.getRequests()["length"] !== 0) {
				
					// Get request
					var request = Extension.getRequests().shift();
					
					// Insert request into sections
					this.insertStateInStack(request["Name"], request["State"], true);
				}
				
				// Otherwise check if closing when done processing extension requests
				else if(Extension.getCloseWhenDone() === true) {
				
					// Prevent extension from interrupting on close
					Extension.preventInterruptOnClose();
				
					// Close
					window.close();
					
					// Return promise
					return new Promise(function(resolve, reject) {
					
					});
				}
			}
		
			// Initialize first stack value
			var firstStackValue = false;
		
			// Check if no current sections exists
			if(this.stackIndex === 0) {
			
				// Set current state to no state
				var currentState = Section.NO_STATE;
				
				// Set current section to the default section
				var currentSection = this.sections[Sections.DEFAULT_SECTION_NAME];
				
				// Set first stack value
				firstStackValue = true;
			}
			
			// Otherwise
			else {
		
				// Get current state from stack
				var currentState = this.stack[this.stackIndex - 1];
				
				// Get current section from state
				var currentSection = this.sections[currentState["Name"]];
			}
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if minimal
				if(minimal === true) {
			
					// Return showing current section with the current state
					return currentSection.show(true, false, false, (currentState !== Section.NO_STATE) ? currentState["State"] : Section.NO_STATE, firstStackValue, true, currentState !== Section.NO_STATE && "Temporary" in currentState === true && currentState["Temporary"] === true).then(function() {
					
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
				
					// Return showing current section with the current state
					return currentSection.show(false, true, true, (currentState !== Section.NO_STATE) ? currentState["State"] : Section.NO_STATE, firstStackValue, false, currentState !== Section.NO_STATE && "Temporary" in currentState === true && currentState["Temporary"] === true).then(function() {
					
						// Allow showing messages
						self.message.allow();
						
						// Resolve
						resolve();
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
			});
		}
		
		// Show section
		showSection(sectionName, saveCurrentDisplay = false, state = Section.NO_STATE) {
		
			// Prevent showing messages
			this.message.prevent();
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return showing section
				return self.sections[sectionName].show(false, true, true, state, true, saveCurrentDisplay).then(function() {
				
					// Allow showing messages
					self.message.allow();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Show previous section
		showPreviousSection() {
		
			// Get previous state
			var previousState = this.getPreviousStateFromStack();
			
			// Get previous section
			var previousSection = this.sections[previousState["Name"]];
			
			// Prevent showing messages
			this.message.prevent();
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return showing previous section
				return previousSection.show(false, true, true, previousState["State"], false, true).then(function() {
				
					// Allow showing messages
					self.message.allow();
					
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
					
					// Reject error
					reject(error);
				});
			});
		}
		
		// Show next section
		showNextSection() {
		
			// Get next state
			var nextState = this.getNextStateFromStack();
			
			// Get next section
			var nextSection = this.sections[nextState["Name"]];
			
			// Prevent showing messages
			this.message.prevent();
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return showing next section
				return nextSection.show(false, true, true, nextState["State"], false, true).then(function() {
				
					// Allow showing messages
					self.message.allow();
					
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
					
					// Reject error
					reject(error);
				});
			});
		}
		
		// Reset
		reset() {
		
			// Go through all sections
			for(var sectionName in this.sections) {
								
				if(this.sections.hasOwnProperty(sectionName) === true) {
				
					// Get section
					var section = this.sections[sectionName];
					
					// Reset section
					section.reset();
				}
			}
		}
		
		// Get section
		getSection(display) {
		
			// Go through all sections
			for(var sectionName in this.sections) {
								
				if(this.sections.hasOwnProperty(sectionName) === true) {
				
					// Get section
					var section = this.sections[sectionName];
					
					// Check if section has the display
					if(section.getDisplay().is(display) === true) {
					
						// Return section
						return section;
					}
				}
			}
			
			// Return no section
			return Sections.NO_SECTION;
		}
		
		// Is section in stack
		isSectionInStack(sectionName) {
		
			// Go through the stack
			for(var i = 0; i < this.stack["length"]; ++i) {
			
				// Check if section in the stack has the same name
				if(this.stack[i]["Name"] === sectionName) {
				
					// Return true
					return true;
				}
			}
			
			// Return false
			return false;
		}
		
		// No section
		static get NO_SECTION() {
		
			// Return no section
			return null;
		}
	
	// Private
	
		// Save stack
		saveStack() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get current stack
				var currentStack = [];
				
				// Get current stack index
				var currentStackIndex = self.stackIndex;
				
				// Go through all values in the stack
				for(var i = 0; i < self.stack["length"]; ++i) {
				
					// Get value
					var value = self.stack[i];
					
					// Check if value is temporary
					if("Temporary" in value === true && value["Temporary"] === true) {
					
						// Check if value being removed affects the current stack index
						if(currentStackIndex - 1 > i || i === currentStack["length"] - 1) {
						
							// Decrement current stack index
							--currentStackIndex;
						}
					}
					
					// Otherwise
					else {
					
						// Add value to current stack
						currentStack.push(value);
					}
				}
				
				// Check if nothing is in the current stack
				if(currentStack["length"] === 0) {
				
					// Set current stack index to zero
					currentStackIndex = 0;
				}
				
				// Return saving sections stack version setting
				return self.settings.setValue(Sections.SETTINGS_SECTIONS_STACK_VERSION_NAME, self.stackVersion).then(function() {
			
					// Return saving settings
					return Promise.all([
				
						// Save sections stack setting
						self.settings.setValue(Sections.SETTINGS_SECTIONS_STACK_NAME, JSON.stringify(currentStack)),
						
						// Save sections stack index setting
						self.settings.setValue(Sections.SETTINGS_SECTIONS_STACK_INDEX_NAME, currentStackIndex)
					
					]).then(function() {
					
						// Resolve
						resolve();
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Get previous state from stack
		getPreviousStateFromStack() {
		
			// Decrement stack index
			--this.stackIndex;
			
			// Return state at stack index
			return this.stack[this.stackIndex - 1];
		}
		
		// Get next state from stack
		getNextStateFromStack() {
		
			// Increment stack index
			++this.stackIndex;
			
			// Return state at stack index
			return this.stack[this.stackIndex - 1];
		}
		
		// Settings sections stack name
		static get SETTINGS_SECTIONS_STACK_NAME() {
		
			// Return settings sections stack name
			return "Sections Stack";
		}
		
		// Settings sections stack default value
		static get SETTINGS_SECTIONS_STACK_DEFAULT_VALUE() {
		
			// Return settings sections stack default value
			return JSON.stringify([]);
		}
		
		// Settings sections stack index name
		static get SETTINGS_SECTIONS_STACK_INDEX_NAME() {
		
			// Return settings sections stack index name
			return "Sections Stack Index";
		}
		
		// Settings sections stack index default value
		static get SETTINGS_SECTIONS_STACK_INDEX_DEFAULT_VALUE() {
		
			// Return settings sections stack index default value
			return 0;
		}
		
		// Settings sections stackversion name
		static get SETTINGS_SECTIONS_STACK_VERSION_NAME() {
		
			// Return settings sections stack version name
			return "Sections Stack Version";
		}
		
		// Default section name
		static get DEFAULT_SECTION_NAME() {
		
			// Return default section name
			return WalletSection.NAME;
		}
}


// Main function

// Set global object's sections
globalThis["Sections"] = Sections;
