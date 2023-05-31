// Use strict
"use strict";


// Classes

// Settings class
class Settings {

	// Public
	
		// Constructor
		constructor() {
		
			// Set default values
			this.defaultValues = {};
			
			// Set self
			var self = this;
		
			// Create database
			Database.createDatabase(function(database, currentVersion, databaseTransaction) {
			
				// Create or get settings object store
				var settingsObjectStore = (currentVersion === Database.NO_CURRENT_VERSION) ? database.createObjectStore(Settings.OBJECT_STORE_NAME, {
				
					// Key path
					"keyPath": [
					
						// Wallet type
						Database.toKeyPath(Settings.DATABASE_WALLET_TYPE_NAME),
						
						// Network type
						Database.toKeyPath(Settings.DATABASE_NETWORK_TYPE_NAME),
						
						// Setting
						Database.toKeyPath(Settings.DATABASE_SETTING_NAME)
					]
					
				}) : databaseTransaction.objectStore(Settings.OBJECT_STORE_NAME);
			
				// Check if no database version exists
				if(currentVersion === Database.NO_CURRENT_VERSION) {
					
					// Create index to search settings object store by wallet type and network type
					settingsObjectStore.createIndex(Settings.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, [
					
						// Wallet Type
						Database.toKeyPath(Settings.DATABASE_WALLET_TYPE_NAME),
						
						// Network Type
						Database.toKeyPath(Settings.DATABASE_NETWORK_TYPE_NAME)
					], {
					
						// Unique
						"unique": false
					});
				}
			});
		}
		
		// Create value
		createValue(setting, defaultValue) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Append settings to default values
				self.defaultValues[setting] = defaultValue;
				
				// Resolve
				resolve();
			});
		}
		
		// Get default value
		getDefaultValue(setting) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if setting has a default values
				if(setting in self.defaultValues === true)
				
					// Resolve default value
					resolve(self.defaultValues[setting]);
				
				// Otherwise
				else
				
					// Reject error
					reject(Language.getDefaultTranslation('The setting doesn\'t exist.'));
			});
		}
		
		// Get value
		getValue(setting) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return result from searching for setting in the database
				return Database.getResult(Settings.OBJECT_STORE_NAME, [
				
					// Wallet type
					Consensus.getWalletType(),
					
					// Network type
					Consensus.getNetworkType(),
				
					// Setting
					setting
				
				]).then(function(result) {
				
					// Check if result was found
					if(result !== Database.RESULT_NOT_FOUND)
					
						// Resolve value
						resolve(result[Database.toKeyPath(Settings.DATABASE_VALUE_NAME)]);
					
					// Otherwise check if setting has a default values
					else if(setting in self.defaultValues === true)
					
						// Resolve default value
						resolve(self.defaultValues[setting]);
					
					// Otherwise
					else
					
						// Reject error
						reject(Language.getDefaultTranslation('The setting doesn\'t exist.'));
				
				// Catch error
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Set value
		setValue(setting, value, logMessage = false, sensitive = false) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return saving setting in the database
				return Database.saveResults(Settings.OBJECT_STORE_NAME, [{
				
					// Wallet Type
					[Database.toKeyPath(Settings.DATABASE_WALLET_TYPE_NAME)]: Consensus.getWalletType(),
					
					// Network type
					[Database.toKeyPath(Settings.DATABASE_NETWORK_TYPE_NAME)]: Consensus.getNetworkType(),
							
					// Setting
					[Database.toKeyPath(Settings.DATABASE_SETTING_NAME)]: setting,
					
					// Value
					[Database.toKeyPath(Settings.DATABASE_VALUE_NAME)]: value
					
				}], [], Database.CREATE_NEW_TRANSACTION, Database.RELAXED_DURABILITY).then(function() {
				
					// Check if logging message
					if(logMessage === true) {
					
						// Check if sensitive
						if(sensitive === true) {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Changed %1$y setting.'), [
							
								// Setting
								setting
							]);
						}
						
						// Otherwise
						else {
				
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Changed %1$y setting to %2$y.'), [
							
								// Setting
								setting,
								
								// Value
								value
							]);
						}
					}
				
					// Trigger change event
					$(self).trigger(Settings.CHANGE_EVENT, {
					
						// Setting
						[Settings.DATABASE_SETTING_NAME]: setting,
						
						// Value
						[Settings.DATABASE_VALUE_NAME]: value
					});
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(Language.getDefaultTranslation('The database failed.'));
				});
			});
		}
		
		// Delete values
		deleteValues(triggerChangeEvents = true) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Initialize get values
				var getValues = [];
			
				// Check if triggering change events
				if(triggerChangeEvents === true) {
			
					// Initialize settings
					var settings = [];
					
					// Initialize default values
					var defaultValues = [];
					
					// Go through all settings
					for(let setting in self.defaultValues) {
					
						if(self.defaultValues.hasOwnProperty(setting) === true) {
						
							// Append setting to list
							settings.push(setting);
							
							// Append default value to list
							defaultValues.push(self.defaultValues[setting]);
							
							// Append getting setting's value to list
							getValues.push(new Promise(function(resolve, reject) {
							
								// Return getting setting's value
								return self.getValue(setting).then(function(value) {
								
									// Resolve value
									resolve(value);
									
								// Catch errors
								}).catch(function(error) {
								
									// Reject error
									reject(error);
								});
							}));
						}
					}
				}
				
				// Return getting all setting's values
				return Promise.all(getValues).then(function(values) {
			
					// Return deleting settings with the wallet type and network type in the database
					return Database.deleteResultsWithValue(Settings.OBJECT_STORE_NAME, Settings.DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME, IDBKeyRange.only([
					
						// Wallet type
						Consensus.getWalletType(),
						
						// Network type
						Consensus.getNetworkType()
						
					]), Database.CREATE_NEW_TRANSACTION, Database.STRICT_DURABILITY).then(function() {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Reset settings.'));
					
						// Check if triggering change events
						if(triggerChangeEvents === true) {
					
							// Go through all settings
							for(var i = 0; i < settings["length"]; ++i) {
							
								// Get setting
								var setting = settings[i];
								
								// Get default value
								var defaultValue = defaultValues[i];
								
								// Get value
								var value = values[i];
								
								// Check if setting's value changed
								if(value !== defaultValue) {
							
									// Trigger change event
									$(self).trigger(Settings.CHANGE_EVENT, {
									
										// Setting
										[Settings.DATABASE_SETTING_NAME]: setting,
										
										// Value
										[Settings.DATABASE_VALUE_NAME]: defaultValue
									});
								}
							}
						}
					
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
		
		// Change event
		static get CHANGE_EVENT() {
		
			// Return changed event
			return "SettingsChangeEvent";
		}
	
	// Private
		
		// Object store name
		static get OBJECT_STORE_NAME() {
		
			// Return object store name
			return "Settings";
		}
		
		// Database wallet type name
		static get DATABASE_WALLET_TYPE_NAME() {
		
			// Return database wallet type name
			return "Wallet Type";
		}
		
		// Database network type name
		static get DATABASE_NETWORK_TYPE_NAME() {
		
			// Return database network type name
			return "Network Type";
		}
		
		// Database setting name
		static get DATABASE_SETTING_NAME() {
		
			// Return database setting name
			return "Setting";
		}
		
		// Database value name
		static get DATABASE_VALUE_NAME() {
		
			// Return database value name
			return "Value";
		}
		
		// Database wallet type and network type name
		static get DATABASE_WALLET_TYPE_AND_NETWORK_TYPE_NAME() {
		
			// Return database wallet type and network type name
			return "Wallet Type And Network Type";
		}
}


// Main function

// Set global object's settings
globalThis["Settings"] = Settings;
