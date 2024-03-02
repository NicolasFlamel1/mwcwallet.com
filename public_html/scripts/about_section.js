// Use strict
"use strict";


// Classes

// About section class
class AboutSection extends Section {

	// Public
	
		// Constructor
		constructor(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard) {
		
			// Delegate constructor
			super(display, sections, settings, message, focus, application, unlocked, automaticLock, scroll, wallets, node, wakeLock, transactions, prices, clipboard);
			
			// Add version information
			this.addVersionInformation();
			
			// Add donate information
			this.addDonateInformation();
			
			// Update copyright
			this.updateCopyright();
			
			// Add disclaimer
			this.addDisclaimer();
			
			// Add translation contribution message
			this.addTranslationContributionMessage();
			
			// Add attributions
			this.addAttributions();
			
			// Set self
			var self = this;
			
			// Donate address copy click and touch end event
			this.getDisplay().find("div.donate span.copy").on("click touchend", function(event) {
			
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
				
				// Prevent showing messages
				self.getMessage().prevent();
				
				// Blur focus
				$(":focus").blur();
				
				// Disable unlocked
				self.getUnlocked().disable();
				
				// Get copy button
				var copyButton = $(this);
				
				// Show loading
				self.getApplication().showLoading();
				
				// Set that copy button is clicked
				copyButton.addClass("clicked");
				
				// Set timeout
				setTimeout(function() {
				
					// Blur copy button
					copyButton.blur();
				}, 0);
				
				// Set timeout
				setTimeout(function() {
				
					// Get address
					var address = copyButton.prev().text();
				
					// Copy address to clipboard
					self.getClipboard().copy(address).then(function() {
					
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('Address Copied'), Message.createText(Language.getDefaultTranslation('The address was successfully copied to your clipboard.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Verify that the pasted address matches the following address when you paste it.')) + Message.createLineBreak() + Message.createLineBreak() + "<span class=\"messageContainer\"><span class=\"message contextMenu rawData\">" + Common.htmlEncode(address) + "</span>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Copy'), [], "copy", true) + "</span>" + Message.createLineBreak(), false, function() {
						
							// Hide loading
							self.getApplication().hideLoading();
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
						
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
						
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that copy button isn't clicked
								copyButton.removeClass("clicked");
								
								// Hide message
								self.getMessage().hide();
							}
						});
						
					// Catch errors
					}).catch(function(error) {
					
						// Show message and allow showing messages
						self.getMessage().show(Language.getDefaultTranslation('Copy Address Error'), Message.createText(Language.getDefaultTranslation('Copying the address to your clipboard failed.')), false, function() {
						
							// Hide loading
							self.getApplication().hideLoading();
						
						}, Language.getDefaultTranslation('OK'), Message.NO_BUTTON, true, Message.VISIBLE_STATE_UNLOCKED).then(function(messageResult) {
						
							// Check if message was displayed
							if(messageResult !== Message.NOT_DISPLAYED_RESULT) {
						
								// Enable unlocked
								self.getUnlocked().enable();
								
								// Set that copy button isn't clicked
								copyButton.removeClass("clicked");
								
								// Hide message
								self.getMessage().hide();
							}
						});
					});
				
				}, ("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") ? 0 : AboutSection.COPY_ADDRESS_TO_CLIPBOARD_DELAY_MILLISECONDS);
			});
		}
		
		// Get name
		getName() {
		
			// Return name
			return AboutSection.NAME;
		}
		
		// Reset
		reset() {
		
			// Reset
			super.reset();
		}
		
		// Name
		static get NAME() {
		
			// Return name
			return "About";
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
			return Language.getDefaultTranslation('About Error');
		}
		
		// Add version information
		addVersionInformation() {
		
			// Get version information display
			var versionInformationDisplay = this.getDisplay().find("div.versionInformation");
			
			// Get version release timestamp
			var versionReleaseTimestamp = Date.parse(VERSION_RELEASE_DATE) / Common.MILLISECONDS_IN_A_SECOND;
			
			// Add version number to version information display
			versionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Version number:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$v", [VERSION_NUMBER], "contextMenu") + "</p>");
			
			// Add release date to version information display
			versionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Release date:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$d", [versionReleaseTimestamp.toFixed()], "contextMenu") + "</p>");
			
			// Check if is an extension
			if(Common.isExtension() === true) {
			
				// Set source code
				var sourceCode = "https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension";
			}
			
			// Otherwise check if loading from file
			else if(location["protocol"] === Common.FILE_PROTOCOL) {
			
				// Set source code
				var sourceCode = "https://github.com/NicolasFlamel1/MWC-Wallet-Standalone";
			}
			
			// Otherwise
			else {
			
				// Set source code
				var sourceCode = "https://github.com/NicolasFlamel1/mwcwallet.com";
			}
			
			// Add source code to version information display
			versionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Source code:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$m", [
				[
			
					// Text
					sourceCode,
					
					// URL
					sourceCode,
					
					// Is external
					true,
					
					// Is blob
					false
				]
			]) + "</p>");
			
			// Add wallet type to version information display
			versionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Wallet type:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Consensus.walletTypeToText(Consensus.getWalletType())], "contextMenu") + "</p>");
			
			// Add network type to version information display
			versionInformationDisplay.append("<p>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('Network type:')) + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", "%1$x", [Consensus.networkTypeToText(Consensus.getNetworkType())], "contextMenu") + "</p>");
		}
		
		// Add donate information
		addDonateInformation() {
		
			// Get donate display
			var donateDisplay = this.getDisplay().find("div.donate");
			
			// Check if is an extension
			if(Common.isExtension() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('Donations are greatly appreciated and help fund the development of this extension.');
			}
			
			// Otherwise check if is an app
			else if(Common.isApp() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('Donations are greatly appreciated and help fund the development of this app.');
			}
			
			// Otherwise
			else {
			
				// Set message
				var message = Language.getDefaultTranslation('Donations are greatly appreciated and help fund the development of this site.');
			}
			
			// Add message to donate display
			donateDisplay.prepend(Language.createTranslatableContainer("<p>", message));
		}
		
		// Update copyright
		updateCopyright() {
		
			// Get current timestamp
			var currentTimestamp = new Date();
		
			// Get current year
			var currentYear = currentTimestamp.getFullYear();
			
			// Check if the current year is greater than the copyright year
			if(currentYear > COPYRIGHT_YEAR) {
			
				// Get new copyright
				var newCopyright = Language.createTranslatableContainer("<p>", Language.getDefaultTranslation('© %1$s–%2$s Nicolas Flamel.'), [COPYRIGHT_YEAR.toFixed(), currentYear.toFixed()], "copyright");
			}
			
			// Otherwise
			else {
			
				// Get new copyright
				var newCopyright = Language.createTranslatableContainer("<p>", Language.getDefaultTranslation('© %1$s Nicolas Flamel.'), [COPYRIGHT_YEAR.toFixed()], "copyright");
			}
			
			// Replace copyright with the new copyright
			this.getDisplay().find("p.copyright").replaceWith(newCopyright);
			
			// Get next year timestamp
			var nextYearTimestamp = new Date(currentYear + 1, Common.JANUARY_MONTH_INDEX);
			
			// Set self
			var self = this;
			
			// Set timeout
			setTimeout(function() {
			
				// Update copyright
				self.updateCopyright();
			
			}, Math.min(nextYearTimestamp - currentTimestamp, Common.INT32_MAX_VALUE));
		}
		
		// Add disclaimer
		addDisclaimer() {
		
			// Get disclaimer display
			var disclaimerDisplay = this.getDisplay().find("div.disclaimer");
			
			// Check if is an extension
			if(Common.isExtension() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('This extension is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with this extension or the use or other dealings in this extension.');
			}
			
			// Otherwise check if is an app
			else if(Common.isApp() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('This app is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with this app or the use or other dealings in this app.');
			}
			
			// Otherwise
			else {
			
				// Set message
				var message = Language.getDefaultTranslation('This site is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with this site or the use or other dealings in this site.');
			}
			
			// Add disclaimer message to disclaimer display
			disclaimerDisplay.append(Language.createTranslatableContainer("<p>", message));
		}
		
		// Add translation contribution message
		addTranslationContributionMessage() {
		
			// Get translation contributors display
			var translationContributorsDisplay = this.getDisplay().find("div.translationContributors");
			
			// Check if is an extension
			if(Common.isExtension() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('The following people created the translations for this extension. You can email %1$m if you\'re interested in translating this extension into another language.');
			}
			
			// Otherwise check if is an app
			else if(Common.isApp() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('The following people created the translations for this app. You can email %1$m if you\'re interested in translating this app into another language.');
			}
			
			// Otherwise
			else {
			
				// Set message
				var message = Language.getDefaultTranslation('The following people created the translations for this site. You can email %1$m if you\'re interested in translating this site into another language.');
			}
			
			// Add translation contribution message to translation contributors display
			translationContributorsDisplay.prepend(Language.createTranslatableContainer("<p>", message, [
				[
					// Text
					"nicolasflamel@mwcwallet.com",
					
					// URL
					"mailto:nicolasflamel@mwcwallet.com",
					
					// Is external
					true,
							
					// Is blob
					false
				]
			]));
		}
		
		// Add attributions
		addAttributions() {
		
			// Get attributions display
			var attributionsDisplay = this.getDisplay().find("div.attributions");
			
			// Check if is an extension
			if(Common.isExtension() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('This extension utilizes code and assets from the following sources.');
			}
			
			// Otherwise check if is an app
			else if(Common.isApp() === true) {
			
				// Set message
				var message = Language.getDefaultTranslation('This app utilizes code and assets from the following sources.');
			}
			
			// Otherwise
			else {
			
				// Set message
				var message = Language.getDefaultTranslation('This site utilizes code and assets from the following sources.');
			}
			
			// Add attributions message to attributions display
			attributionsDisplay.prepend(Language.createTranslatableContainer("<p>", message));
			
			// Go through all attributions
			for(var name in ATTRIBUTIONS) {
						
				if(ATTRIBUTIONS.hasOwnProperty(name) === true) {
				
					// Check if attribution has a license
					if("License Type" in ATTRIBUTIONS[name] === true && "License Path" in ATTRIBUTIONS[name] === true) {
				
						// Add attribution to attributions display
						attributionsDisplay.find("ul").append("<li>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$y: %2$m, License: %3$m'), [
						
							// Name
							name,
							
							[
								// Text
								ATTRIBUTIONS[name]["URL"],
								
								// URL
								ATTRIBUTIONS[name]["URL"],
								
								// Is external
								true,
								
								// Is blob
								false
							],
							
							[
								// Text
								ATTRIBUTIONS[name]["License Type"],
								
								// URL
								ATTRIBUTIONS[name]["License Path"],
								
								// Is external
								true,
								
								// Is blob
								false
							]
						], "contextMenu") + "</li>");
					}
					
					// Otherwise
					else {
					
						// Add attribution to attributions display
						attributionsDisplay.find("ul").append("<li>" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$y: %2$m'), [
						
							// Name
							name,
							
							[
								// Text
								ATTRIBUTIONS[name]["URL"],
								
								// URL
								ATTRIBUTIONS[name]["URL"],
								
								// Is external
								true,
								
								// Is blob
								false
							]
						], "contextMenu") + "</li>");
					}
				}
			}
		}
		
		// Copy address to clipboard delay milliseconds
		static get COPY_ADDRESS_TO_CLIPBOARD_DELAY_MILLISECONDS() {
		
			// Return copy address to clipboard delay milliseconds
			return 175;
		}
}


// Main function

// Set global object's about section
globalThis["AboutSection"] = AboutSection;
