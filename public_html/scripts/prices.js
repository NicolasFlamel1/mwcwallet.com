// Use strict
"use strict";


// Classes

// Prices class
class Prices {

	// Public
	
		// Constructor
		constructor(settings) {
		
			// Set settings
			this.settings = settings;
		
			// Set prices obtained
			this.pricesObtained = false;
			
			// Set update prices timeout to no timeout
			this.updatePricesTimeout = Prices.NO_TIMEOUT;
			
			// Set prices
			this.prices = {};
			
			// Set enable price to setting's default value
			this.enablePrice = Prices.SETTINGS_ENABLE_PRICE_DEFAULT_VALUE;
			
			// Set update price interval minutes to setting's default value
			this.updatePriceIntervalMinutes = Prices.SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_DEFAULT_VALUE;
			
			// Can get prices
			this.canGetPrices = false;
		
			// Create database
			Database.createDatabase(function(database, currentVersion, databaseTransaction) {
			
				// Create or get prices object store
				var pricesObjectStore = (currentVersion === Database.NO_CURRENT_VERSION) ? database.createObjectStore(Prices.OBJECT_STORE_NAME, {
				
					// Key path
					"keyPath": [
					
						// Wallet type
						Database.toKeyPath(Prices.DATABASE_WALLET_TYPE_NAME),
					
						// Currency
						Database.toKeyPath(Prices.DATABASE_CURRENCY_NAME)
					]
					
				}) : databaseTransaction.objectStore(Prices.OBJECT_STORE_NAME);
				
				// Check if no database version exists
				if(currentVersion === Database.NO_CURRENT_VERSION) {
					
					// Create index to search prices object store by wallet type
					pricesObjectStore.createIndex(Prices.DATABASE_WALLET_TYPE_NAME, Database.toKeyPath(Prices.DATABASE_WALLET_TYPE_NAME), {
					
						// Unique
						"unique": false
					});
				}
			});
		
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Create enable price setting
						self.settings.createValue(Prices.SETTINGS_ENABLE_PRICE_NAME, Prices.SETTINGS_ENABLE_PRICE_DEFAULT_VALUE),
						
						// Create update price interval minutes setting
						self.settings.createValue(Prices.SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_NAME, Prices.SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_DEFAULT_VALUE)
					
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Enable price setting
							Prices.SETTINGS_ENABLE_PRICE_NAME,
							
							// Update price interval minutes setting
							Prices.SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set enable price to setting's value
							self.enablePrice = settingValues[settings.indexOf(Prices.SETTINGS_ENABLE_PRICE_NAME)];
							
							// Set update price interval minutes to setting's value
							self.updatePriceIntervalMinutes = settingValues[settings.indexOf(Prices.SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_NAME)];
							
							// Return getting all prices with the wallet type in the database
							return Database.getResults(Prices.OBJECT_STORE_NAME, Database.GET_ALL_RESULTS, Database.GET_ALL_RESULTS, Prices.DATABASE_WALLET_TYPE_NAME, Consensus.getWalletType()).then(function(results) {
							
								// Set can get prices
								self.canGetPrices = true;
							
								// Go through all prices
								for(var i = 0; i < results["length"]; ++i) {
								
									// Get price's currency
									var currency = results[i][Database.toKeyPath(Prices.DATABASE_CURRENCY_NAME)];
									
									// Get price's price or zero if network type isn't mainnet
									var price = new BigNumber((Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) ? results[i][Database.toKeyPath(Prices.DATABASE_PRICE_NAME)] : 0);
									
									// Add price to list of prices
									self.prices[currency] = price;
								}
								
								// Check if price is enabled and network type is mainnet
								if(self.enablePrice === true && Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) {
								
									// Check if update prices timeout exists
									if(self.updatePricesTimeout !== Prices.NO_TIMEOUT) {
									
										// Clear update prices timeout
										clearTimeout(self.updatePricesTimeout);
										
										// Set updates prices timeout to no timeout
										self.updatePricesTimeout = Prices.NO_TIMEOUT;
									}
								
									// Update prices
									self.updatePrices();
								}
								
								// Otherwise
								else {
								
									// Refresh prices timeout
									self.refreshPricesTimeout();
								}
								
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
				
					// Enable price setting
					case Prices.SETTINGS_ENABLE_PRICE_NAME:
					
						// Set enable price to setting's value
						self.enablePrice = setting[Settings.DATABASE_VALUE_NAME];
						
						// Check if price is enabled and network type is mainnet
						if(self.enablePrice === true && Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) {
						
							// Check if update prices timeout exists
							if(self.updatePricesTimeout !== Prices.NO_TIMEOUT) {
							
								// Clear update prices timeout
								clearTimeout(self.updatePricesTimeout);
								
								// Set updates prices timeout to no timeout
								self.updatePricesTimeout = Prices.NO_TIMEOUT;
							}
							
							// Trigger change event
							$(self).trigger(Prices.CHANGE_EVENT, self.prices);
						
							// Update prices
							self.updatePrices();
						}
						
						// Otherwise
						else {
						
							// Refresh prices timeout
							self.refreshPricesTimeout();
							
							// Trigger change event
							$(self).trigger(Prices.CHANGE_EVENT, self.prices);
						}
						
						// Break
						break;
				
					// Update price interval minutes setting
					case Prices.SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_NAME:
					
						// Set update price interval minutes to setting's value
						self.updatePriceIntervalMinutes = setting[Settings.DATABASE_VALUE_NAME];
						
						// Refresh prices timeout
						self.refreshPricesTimeout();
						
						// Break
						break;
				}
			});
			
			// Window online event
			$(window).on("online", function() {
			
				// Check if prices haven't been obtained, the price is enabled, and network type is mainnet
				if(self.pricesObtained === false && self.enablePrice === true && Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) {
				
					// Check if update prices timeout exists
					if(self.updatePricesTimeout !== Prices.NO_TIMEOUT) {
					
						// Clear update prices timeout
						clearTimeout(self.updatePricesTimeout);
						
						// Set updates prices timeout to no timeout
						self.updatePricesTimeout = Prices.NO_TIMEOUT;
					}
				
					// Update prices
					self.updatePrices();
				}
			});
		}
		
		// Get prices
		getPrices() {
		
			// Check if price is enabled and prices exist
			if(this.enablePrice === true && Object.keys(this.prices)["length"] !== 0) {
			
				// Return copy of prices
				return JSONBigNumber.parse(JSONBigNumber.stringify(this.prices));
			}
			
			// Otherwise
			else {
			
				// Return no prices found
				return Prices.NO_PRICES_FOUND;
			}
		}
		
		// Get price
		getPrice(currency = Prices.CURRENT_LANGUAGE_CURRENCY, prices = Prices.CURRENT_PRICES) {
		
			// Check if using current prices
			if(prices === Prices.CURRENT_PRICES) {
			
				// Set prices to the current prices
				prices = this.prices;
			}
			
			// Check if price is enabled
			if(this.enablePrice === true) {
			
				// Check if network type is mainnet
				if(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) {
		
					// Check if currency is the current language's currency
					if(currency === Prices.CURRENT_LANGUAGE_CURRENCY)
					
						// Set currency to current language's currency
						currency = Prices.getCurrentLanguageCurrency();
					
					// Return price for currency if found or no price found otherwise
					return (currency.toUpperCase() in prices === true) ? prices[currency.toUpperCase()] : Prices.NO_PRICE_FOUND;
				}
				
				// Otherwise
				else {
				
					// Return zero
					return new BigNumber(0);
				}
			}
			
			// Otherwise
			else {
			
				// Return no price found
				return Prices.NO_PRICE_FOUND;
			}
		}
		
		// Refresh
		refresh() {
		
			// Check if price is enabled and network type is mainnet
			if(this.enablePrice === true && Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) {
			
				// Check if update prices timeout exists
				if(this.updatePricesTimeout !== Prices.NO_TIMEOUT) {
				
					// Clear update prices timeout
					clearTimeout(this.updatePricesTimeout);
					
					// Set updates prices timeout to no timeout
					this.updatePricesTimeout = Prices.NO_TIMEOUT;
				}
				
				// Update prices
				this.updatePrices();
			}
		}
		
		// Bitcoin currency name
		static get BITCOIN_CURRENCY_NAME() {
		
			// Return Bitcoin currency name
			return "BTC";
		}
		
		// Bitcoin number base
		static get BITCOIN_NUMBER_BASE() {
		
			// Return Bitcoin number base
			return 1E8;
		}
		
		// Ethereum currency name
		static get ETHEREUM_CURRENCY_NAME() {
		
			// Return Ethereum currency name
			return "ETH";
		}
		
		// Ethereum number base
		static get ETHEREUM_NUMBER_BASE() {
		
			// Return Ethereum number base
			return 1E18;
		}
		
		// No price found
		static get NO_PRICE_FOUND() {
		
			// Return no price found
			return null;
		}
		
		// No prices found
		static get NO_PRICES_FOUND() {
		
			// Return no prices found
			return null;
		}
		
		// Change event
		static get CHANGE_EVENT() {
		
			// Return change event
			return "PricesChangeEvent";
		}
		
		// Currency language currency
		static get CURRENT_LANGUAGE_CURRENCY() {
		
			// Return currency language currency
			return null;
		}
		
		// Current prices
		static get CURRENT_PRICES() {
		
			// Return current prices
			return null;
		}
	
	// Private
	
		// Update prices
		updatePrices() {
		
			// Check if can get prices
			if(this.canGetPrices === true) {
		
				// Log message
				Log.logMessage(Language.getDefaultTranslation('Trying to connect to the prices server at %1$y.'), [
				
					[
						// Text
						Prices.API_URL,
						
						// Is raw data
						true
					]
				]);
			
				// Initialize unique currencies to include default currencies
				var uniqueCurrencies = new Set(Prices.DEFAULT_CURRENCIES);
				
				// Go through all currencies
				var allCurrencies = Prices.getAllCurrencies();
				
				Object.keys(allCurrencies).forEach(function(language) {
				
					// Append currency to list of unique currencies
					uniqueCurrencies.add(allCurrencies[language].toUpperCase());
				});
				
				// Set self
				var self = this;
				
				// Get price for each currency
				$.ajax({
				
					// URL
					"url": Prices.getApiRequest(uniqueCurrencies),
					
					// Data type
					"dataType": "text"
				
				// Done
				}).done(function(response) {
				
					// Log message
					Log.logMessage(Language.getDefaultTranslation('Successfully connected to the prices server.'));
				
					// Try
					try {
					
						// Parse response as JSON
						response = JSONBigNumber.parse(response);
					}
					
					// Catch errors
					catch(error) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Received an invalid response from the prices server.'));
					
						// Return
						return;
					}
					
					// Initialize new prices
					var newPrices = [];
					
					// Check if response is valid
					if(Object.isObject(response) === true && Prices.API_CURRENCY_ID in response === true && Object.isObject(response[Prices.API_CURRENCY_ID]) === true) {
					
						// Go through price for each currency
						Object.keys(response[Prices.API_CURRENCY_ID]).forEach(function(currency) {
						
							// Check if currency and price are valid
							if(typeof currency === "string" && uniqueCurrencies.has(currency.toUpperCase()) === true && response[Prices.API_CURRENCY_ID][currency] instanceof BigNumber === true && response[Prices.API_CURRENCY_ID][currency].isPositive() === true && response[Prices.API_CURRENCY_ID][currency].isFinite() === true) {
						
								// Append new price to list
								newPrices.push({
								
									// Wallet type
									[Database.toKeyPath(Prices.DATABASE_WALLET_TYPE_NAME)]: Consensus.getWalletType(),
								
									// Currency
									[Database.toKeyPath(Prices.DATABASE_CURRENCY_NAME)]: currency.toUpperCase(),
									
									// Price
									[Database.toKeyPath(Prices.DATABASE_PRICE_NAME)]: response[Prices.API_CURRENCY_ID][currency].toFixed()
								});
								
								// Update prices in list
								self.prices[currency.toUpperCase()] = response[Prices.API_CURRENCY_ID][currency];
							}
						});
					}
					
					// Check if new prices exist
					if(newPrices["length"] !== 0) {
					
						// Set prices obtained
						self.pricesObtained = true;
					
						// Save new prices in the database
						Database.saveResults(Prices.OBJECT_STORE_NAME, newPrices, [], Database.CREATE_NEW_TRANSACTION, Database.STRICT_DURABILITY).then(function() {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Successfully updated the prices.'));
						
							// Trigger change event
							$(self).trigger(Prices.CHANGE_EVENT, self.prices);
						
						// Catch errors
						}).catch(function(error) {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Updating the prices failed.'));
						});
					}
					
					// Otherwise
					else {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Received an invalid response from the prices server.'));
					}
				
				// Catch errors
				}).fail(function(request) {
				
					// Check if connecting to the prices server failed
					if(request["status"] === Common.HTTP_NO_RESPONSE_STATUS) {
				
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Connecting to the prices server failed.'));
					}
					
					// Otherwise
					else {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Successfully connected to the prices server.'));
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Received an invalid response from the prices server.'));
					}
				
				// Always
				}).always(function() {
				
					// Refresh prices timeout
					self.refreshPricesTimeout();
				});
			}
			
			// Otherwise
			else {
			
				// Refresh prices timeout
				this.refreshPricesTimeout();
			}
		}
		
		// Refresh prices timeout
		refreshPricesTimeout() {
		
			// Check if update prices timeout exists
			if(this.updatePricesTimeout !== Prices.NO_TIMEOUT) {
			
				// Clear update prices timeout
				clearTimeout(this.updatePricesTimeout);
				
				// Set updates prices timeout to no timeout
				this.updatePricesTimeout = Prices.NO_TIMEOUT;
			}
			
			// Check if enable price and network type is mainnet
			if(this.enablePrice === true && Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE) {
			
				// Set self
				var self = this;
			
				// Set update prices timeout
				this.updatePricesTimeout = setTimeout(function() {
				
					// Update prices again
					self.updatePrices();
				
				}, this.updatePriceIntervalMinutes * Common.SECONDS_IN_A_MINUTE * Common.MILLISECONDS_IN_A_SECOND);
			}
		}
		
		// Get current language currency
		static getCurrentLanguageCurrency() {
		
			// Return currency for the current language
			return Language.getConstant(Language.CURRENCY_CONSTANT);
		}
		
		// Get all currencies
		static getAllCurrencies() {
		
			// Initialize currencies
			var currencies = {};
			
			// Check if available languages exist
			if(typeof AVAILABLE_LANGUAGES !== "undefined") {
		
				// Go through all available languages
				Object.keys(AVAILABLE_LANGUAGES).forEach(function(availableLanguage) {
				
					// Append currency for the available language to list of currencies
					currencies[availableLanguage] = Language.getConstant(Language.CURRENCY_CONSTANT, availableLanguage);
				});
			}
			
			// Return currencies
			return currencies;
		}
		
		// Get API request
		static getApiRequest(currencies) {
		
			// Return API query string
			return Prices.API_URL + Common.URL_QUERY_STRING_SEPARATOR + $.param({
			
				// IDs
				"ids": Prices.API_CURRENCY_ID,
				
				// VS currencies
				"vs_currencies": Array.from(currencies).join(Prices.API_CURRENCIES_SEPARATOR)
			});
		}
		
		// Object store name
		static get OBJECT_STORE_NAME() {
		
			// Return object store name
			return "Prices";
		}
		
		// Database wallet type name
		static get DATABASE_WALLET_TYPE_NAME() {
		
			// Return database wallet type name
			return "Wallet Type";
		}
		
		// Database currency name
		static get DATABASE_CURRENCY_NAME() {
		
			// Return database currency name
			return "Currency";
		}
		
		// Database price name
		static get DATABASE_PRICE_NAME() {
		
			// Return database price name
			return "Price";
		}
		
		// Default currencies
		static get DEFAULT_CURRENCIES() {
		
			// Return default currencies
			return [
			
				// Bitcoin currency name
				Prices.BITCOIN_CURRENCY_NAME.toUpperCase(),
				
				// Ethereum currency name
				Prices.ETHEREUM_CURRENCY_NAME.toUpperCase()
			];
		}
		
		// API URL
		static get API_URL() {
		
			// Return API URL
			return "https://api.coingecko.com/api/v3/simple/price";
		}
		
		// API currency ID
		static get API_CURRENCY_ID() {
		
			// Check wallet type
			switch(Consensus.getWalletType()) {
			
				// MWC wallet
				case Consensus.MWC_WALLET_TYPE:
				
					// Return API currency ID
					return "mimblewimblecoin";
				
				// GRIN wallet
				case Consensus.GRIN_WALLET_TYPE:
			
					// Return API currency ID
					return "grin";
				
				// EPIC wallet
				case Consensus.EPIC_WALLET_TYPE:
			
					// Return API currency ID
					return "epic-cash";
			}
		}
		
		// API currencies separator
		static get API_CURRENCIES_SEPARATOR() {
		
			// Return API currencies separator
			return ",";
		}
		
		// No timeout
		static get NO_TIMEOUT() {
		
			// Return no timeout
			return null;
		}
		
		// Settings enable price name
		static get SETTINGS_ENABLE_PRICE_NAME() {
		
			// Return settings enable price name
			return "Enable Price";
		}
		
		// Settings enable price default value
		static get SETTINGS_ENABLE_PRICE_DEFAULT_VALUE() {
		
			// Return settings enable price default value
			return true;
		}
		
		// Settings update price interval minutes name
		static get SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_NAME() {
		
			// Return settings update price interval minutes name
			return "Update Price Interval Minutes";
		}
		
		// Settings update price interval minutes default value
		static get SETTINGS_UPDATE_PRICE_INTERVAL_MINUTES_DEFAULT_VALUE() {
		
			// Return settings update price interval minutes default value
			return 10;
		}
}


// Main function

// Set global object's prices
globalThis["Prices"] = Prices;
