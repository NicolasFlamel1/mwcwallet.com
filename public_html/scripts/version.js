// Use strict
"use strict";


// Classes

// Version class
class Version {

	// Public
	
		// Constructor
		constructor(application, message) {
		
			// Set version
			this.version = (Common.isExtension() === true || location["protocol"] === Common.FILE_PROTOCOL) ? VERSION_NUMBER : Version.hash(JSON.stringify(FILES));
			
			// Set application
			this.application = application;
			
			// Set message
			this.message = message;
		}
		
		// Get version
		getVersion() {
		
			// Return version
			return this.version;
		}
	
		// Show changes
		showChanges() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get current version
				var currentVersion = localStorage.getItem(Version.CURRENT_VERSION_LOCAL_STORAGE_NAME);
				
				// Check if no previous version exists
				if(currentVersion === Common.INVALID_LOCAL_STORAGE_ITEM) {
				
					// Try
					try {
				
						// Save current version
						localStorage.setItem(Version.CURRENT_VERSION_LOCAL_STORAGE_NAME, self.version);
					}
					
					// Catch errors
					catch(error) {
					
						// Trigger a fatal error
						new FatalError(FatalError.LOCAL_STORAGE_ERROR);
						
						// Return
						return;
					}
					
					// Resolve
					resolve();
				}
				
				// Otherwise check if version changed
				else if(currentVersion !== self.version) {
				
					// Check if there's version changes to show
					if(VERSION_CHANGES["length"] !== 0) {
					
						// Set timeout
						setTimeout(function() {
				
							// Window storage version event
							$(window).on("storage.version", function(event) {
							
								// Check if current version was changed
								if(event["originalEvent"]["key"] === Version.CURRENT_VERSION_LOCAL_STORAGE_NAME) {
								
									// Check if current version is the same version
									if(event["originalEvent"]["newValue"] === self.version) {
								
										// Turn off window storage version event
										$(window).off("storage.version");
										
										// Set timeout
										setTimeout(function() {
										
											// Show loading
											self.application.showLoading();
										
											// Hide message
											self.message.hide().then(function() {
									
												// Resolve
												resolve();
											});
										
										}, Version.HIDE_VERSION_CHANGES_MESSAGE_DELAY_MILLISECONDS);
									}
								}
							});
							
							// Show message and allow showing messages
							self.message.show(Language.getDefaultTranslation('Version Changes'), "<b>" + Message.createText(Language.getDefaultTranslation('Version %1$v'), [VERSION_NUMBER]) + "</b>" + Message.createLineBreak() + "<ul>" + VERSION_CHANGES.map(function(versionChange) {
				
								return "<li>" + Language.createTranslatableContainer("<span>", Language.escapeText(versionChange), [], "contextMenu") + "</li>";
							
							}).join("") + "</ul>" + Message.createLineBreak(), false, function() {
							
								// Hide loading
								self.application.hideLoading();
								
								// Show language display
								Language.showDisplay();
							
							}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true).then(function(messageResult) {
							
								// Turn off window storage version event
								$(window).off("storage.version");
								
								// Check if message was displayed
								if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
							
									// Try
									try {
								
										// Save current version
										localStorage.setItem(Version.CURRENT_VERSION_LOCAL_STORAGE_NAME, self.version);
									}
									
									// Catch errors
									catch(error) {
									
										// Trigger a fatal error
										new FatalError(FatalError.LOCAL_STORAGE_ERROR);
										
										// Return
										return;
									}
									
									// Show loading
									self.application.showLoading();
									
									// Prevent showing messages
									self.message.prevent();
									
									// Hide message
									self.message.hide().then(function() {
							
										// Resolve
										resolve();
									});
								}
							});
						}, Version.SHOW_VERSION_CHANGES_DELAY_MILLISECONDS);
					}
					
					// Otherwise
					else {
					
						// Try
						try {
					
							// Save current version
							localStorage.setItem(Version.CURRENT_VERSION_LOCAL_STORAGE_NAME, self.version);
						}
						
						// Catch errors
						catch(error) {
						
							// Trigger a fatal error
							new FatalError(FatalError.LOCAL_STORAGE_ERROR);
							
							// Return
							return;
						}
						
						// Resolve
						resolve();
					}
				}
				
				// Otherwise
				else
				
					// Resolve
					resolve();
			});
		}
	
	// Private
	
		// Hash
		static hash(string) {

			// Initialize hash
			var hash = 0;
			
			// Go through all characters in the string
			for(var i = 0; i < string["length"]; ++i) {
			
				// Get the character as a number
				var character = string.charCodeAt(i);
				
				// Update the hash using the character
				hash = ((hash << Version.HASH_BITS_SHIFT_RIGHT) - hash) + character;
				
				// Limit the hash
				hash |= 0;
			}
			
			// Return hash
			return hash.toFixed();
		}
		
		// Hash bits shift right
		static get HASH_BITS_SHIFT_RIGHT() {
		
			// Return hash bits shift right
			return 5;
		}
		
		// Current version local storage name
		static get CURRENT_VERSION_LOCAL_STORAGE_NAME() {
		
			// Return current version local storage name
			return "Current Version";
		}
		
		// Hide version changes message delay milliseconds
		static get HIDE_VERSION_CHANGES_MESSAGE_DELAY_MILLISECONDS() {
		
			// Return hide version changes message delay milliseconds
			return Application.HIDE_PRIMARY_INSTANCE_MESSAGE_DELAY_MILLISECONDS;
		}
		
		// Show version changes delay milliseconds
		static get SHOW_VERSION_CHANGES_DELAY_MILLISECONDS() {
		
			// Return show version changes delay milliseconds
			return 300;
		}
}


// Main function

// Set global object's version
globalThis["Version"] = Version;
