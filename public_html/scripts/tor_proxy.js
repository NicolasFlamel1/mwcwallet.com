// Use strict
"use strict";


// Classes

// TorProxy class
class TorProxy {

	// Public

		// Constructor
		constructor(settings) {
		
			// Set settings
			this.settings = settings;
			
			// Set use custom Tor proxy to setting's default value
			this.useCustomTorProxy = TorProxy.SETTINGS_USE_CUSTOM_TOR_PROXY_DEFAULT_VALUE;
			
			// Set custom Tor proxy address to setting's default value
			this.customTorProxyAddress = TorProxy.SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_DEFAULT_VALUE;
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Use custom Tor proxy setting
						self.settings.createValue(TorProxy.SETTINGS_USE_CUSTOM_TOR_PROXY_NAME, TorProxy.SETTINGS_USE_CUSTOM_TOR_PROXY_DEFAULT_VALUE),
						
						// Custom Tor proxy address setting
						self.settings.createValue(TorProxy.SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_NAME, TorProxy.SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_DEFAULT_VALUE)
					
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Use custom Tor proxy setting
							TorProxy.SETTINGS_USE_CUSTOM_TOR_PROXY_NAME,
							
							// Custom Tor proxy address setting
							TorProxy.SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set use custom Tor proxy to setting's value
							self.useCustomTorProxy = settingValues[settings.indexOf(TorProxy.SETTINGS_USE_CUSTOM_TOR_PROXY_NAME)];
							
							// Set custom Tor proxy address to setting's value
							self.customTorProxyAddress = settingValues[settings.indexOf(TorProxy.SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_NAME)];
							
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
			
				// Initialize Tor proxy setting changes
				var torProxySettingChanged = false;
				
				// Check what setting was changes
				switch(setting[Settings.DATABASE_SETTING_NAME]) {
				
					// Use custom Tor proxy setting
					case TorProxy.SETTINGS_USE_CUSTOM_TOR_PROXY_NAME:
					
						// Set use custom Tor proxy to setting's value
						self.useCustomTorProxy = setting[Settings.DATABASE_VALUE_NAME];
						
						// Set Tor Proxy settings changed
						torProxySettingChanged = true;
						
						// Break
						break;
					
					// Custom Tor proxy address setting
					case TorProxy.SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_NAME:
					
						// Set custom Tor proxy address to setting's value
						self.customTorProxyAddress = setting[Settings.DATABASE_VALUE_NAME];
						
						// Set Tor Proxy settings changed
						torProxySettingChanged = true;
						
						// Break
						break;
				}
				
				// Check if a Tor proxy setting was changed
				if(torProxySettingChanged === true) {
				
					// Trigger settings change event
					$(self).trigger(TorProxy.SETTINGS_CHANGE_EVENT);
				}
			});
		}
		
		// Using custom Tor proxy
		usingCustomTorProxy() {
		
			// Return if using a custom Tor proxy
			return this.useCustomTorProxy === true;
		}
		
		// Get address
		getAddress() {
		
			// Check if not using a custom Tor proxy
			if(this.usingCustomTorProxy() === false) {
			
				// Return default Tor Proxy address
				return TorProxy.DEFAULT_TOR_PROXY_ADDRESS;
			}
			
			// Otherwise
			else {
			
				// Get custom Tor proxy address
				var customTorProxyAddress = this.customTorProxyAddress.trim();
				
				// Check if custom Tor proxy address isn't set
				if(customTorProxyAddress["length"] === 0) {
				
					// Return custom Tor proxy address
					return customTorProxyAddress;
				}
				
				// Otherwise
				else {
			
					// Check if custom Tor proxy address doesn't have a protocol
					if(Common.urlContainsProtocol(customTorProxyAddress) === false) {
					
						// Add protocol to custom Tor proxy address
						customTorProxyAddress = Common.HTTP_PROTOCOL + "//" + customTorProxyAddress;
					}
				
					// Return custom Tor proxy address upgraded if applicable and with a trailing slash
					return Common.removeTrailingSlashes(Common.upgradeApplicableInsecureUrl(customTorProxyAddress)) + "/";
				}
			}
		}
		
		// Settings change event
		static get SETTINGS_CHANGE_EVENT() {
		
			// Return settings change event
			return "TorProxySettingsChangeEvent";
		}
	
	// Private
		
		// Settings use custom Tor proxy name
		static get SETTINGS_USE_CUSTOM_TOR_PROXY_NAME() {
		
			// Return settings use custom Tor proxy name
			return "Use Custom Tor Proxy";
		}
		
		// Settings use custom Tor proxy default value
		static get SETTINGS_USE_CUSTOM_TOR_PROXY_DEFAULT_VALUE() {
		
			// Return settings use custom Tor proxy default value
			return false;
		}
		
		// Settings custom Tor proxy address name
		static get SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_NAME() {
		
			// Return settings custom Tor proxy address name
			return "Custom Tor Proxy Address";
		}
		
		// Settings custom Tor proxy address default value
		static get SETTINGS_CUSTOM_TOR_PROXY_ADDRESS_DEFAULT_VALUE() {
		
			// Return settings custom Tor proxy address default value
			return "";
		}
		
		// Default Tor proxy address
		static get DEFAULT_TOR_PROXY_ADDRESS() {
		
			// Set server
			var server = (Common.isExtension() === true || location["protocol"] === Common.FILE_PROTOCOL) ? new URL(HTTPS_SERVER_ADDRESS) : location;
		
			// Return default Tor proxy address
			return ((server["protocol"] === Common.HTTPS_PROTOCOL) ? Common.HTTPS_PROTOCOL : Common.HTTP_PROTOCOL) + "//" + server["hostname"] + "/tor/";
		}
}


// Main function

// Set global object's Tor proxy
globalThis["TorProxy"] = TorProxy;
