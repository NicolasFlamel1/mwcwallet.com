// Use strict
"use strict";


// Classes

// Listener class
class Listener {

	// Public
		
		// Constructor
		constructor(settings) {
			
			// Set settings
			this.settings = settings;
		
			// Set connection to no connection
			this.connection = Listener.NO_CONNECTION;
		
			// Set retry delay to initial value
			this.retryDelay = Listener.INITIAL_RETRY_DELAY_MILLISECONDS;
			
			// Set request index
			this.requestIndex = 0;
			
			// Set reconnect timeout to no timeout
			this.reconnectTimeout = Listener.NO_TIMEOUT;
			
			// Set started to false
			this.started = false;
			
			// Set connected to false
			this.connected = false;
			
			// Set use custom listener to setting's default value
			this.useCustomListener = Listener.SETTINGS_USE_CUSTOM_LISTENER_DEFAULT_VALUE;
			
			// Set custom listener address to setting's default value
			this.customListenerAddress = Listener.SETTINGS_CUSTOM_LISTENER_ADDRESS_DEFAULT_VALUE;
			
			// Set ignore response index
			this.ignoreResponseIndex = 0;
			
			// Set self
			var self = this;
			
			// Once database is initialized
			Database.onceInitialized(function() {
			
				// Return promise
				return new Promise(function(resolve, reject) {
				
					// Return creating settings
					return Promise.all([
			
						// Use custom listener setting
						self.settings.createValue(Listener.SETTINGS_USE_CUSTOM_LISTENER_NAME, Listener.SETTINGS_USE_CUSTOM_LISTENER_DEFAULT_VALUE),
						
						// Custom listener address setting
						self.settings.createValue(Listener.SETTINGS_CUSTOM_LISTENER_ADDRESS_NAME, Listener.SETTINGS_CUSTOM_LISTENER_ADDRESS_DEFAULT_VALUE)
					
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Use custom listener setting
							Listener.SETTINGS_USE_CUSTOM_LISTENER_NAME,
							
							// Custom listener address setting
							Listener.SETTINGS_CUSTOM_LISTENER_ADDRESS_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set use custom listener to setting's value
							self.useCustomListener = settingValues[settings.indexOf(Listener.SETTINGS_USE_CUSTOM_LISTENER_NAME)];
							
							// Set custom listener address to setting's value
							self.customListenerAddress = settingValues[settings.indexOf(Listener.SETTINGS_CUSTOM_LISTENER_ADDRESS_NAME)];
							
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
			
				// Initialize listener setting changes
				var listenerSettingChanged = false;
				
				// Check what setting was changes
				switch(setting[Settings.DATABASE_SETTING_NAME]) {
				
					// Use custom listener setting
					case Listener.SETTINGS_USE_CUSTOM_LISTENER_NAME:
					
						// Set use custom listener to setting's value
						self.useCustomListener = setting[Settings.DATABASE_VALUE_NAME];
						
						// Set listener settings changed
						listenerSettingChanged = true;
						
						// Break
						break;
					
					// Custom listener address setting
					case Listener.SETTINGS_CUSTOM_LISTENER_ADDRESS_NAME:
					
						// Set custom listener address to setting's value
						self.customListenerAddress = setting[Settings.DATABASE_VALUE_NAME];
						
						// Set listener settings changed
						listenerSettingChanged = true;
						
						// Break
						break;
				}
				
				// Check if a listener setting was changed
				if(listenerSettingChanged === true) {
				
					// Check if connected
					if(self.connected === true) {
				
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Listener settings changed. Disconnecting from the listener.'));
					}
					
					// Check if connection exists
					if(self.connection !== Listener.NO_CONNECTION) {
					
						// Try
						try {
					
							// Close connection
							self.connection.close();
						}
						
						// Catch errors
						catch(error) {
						
						}
						
						// Set connection to no connection
						self.connection = Listener.NO_CONNECTION;
					}
					
					// Check if reconnect timeout exists
					if(self.reconnectTimeout !== Listener.NO_TIMEOUT) {
					
						// Clear reconnect timeout
						clearTimeout(self.reconnectTimeout);
						
						// Set reconnect timeout to no timeout
						self.reconnectTimeout = Listener.NO_TIMEOUT;
					}
				
					// Reset retry delay
					self.retryDelay = Listener.INITIAL_RETRY_DELAY_MILLISECONDS;
					
					// Trigger settings change event
					$(self).trigger(Listener.SETTINGS_CHANGE_EVENT);
					
					// Clear connected
					self.connected = false;
					
					// Connect
					self.connect();
				}
			});
			
			// Window online event
			$(window).on("online", function() {
			
				// Check if reconnect timeout exists
				if(self.reconnectTimeout !== Listener.NO_TIMEOUT) {
				
					// Clear reconnect timeout
					clearTimeout(self.reconnectTimeout);
					
					// Set reconnect timeout to no timeout
					self.reconnectTimeout = Listener.NO_TIMEOUT;
				
					// Reset retry delay
					self.retryDelay = Listener.INITIAL_RETRY_DELAY_MILLISECONDS;
					
					// Connect
					self.connect();
				}
				
			// Window offline event
			}).on("offline", function() {
			
				// Check if started
				if(self.started === true) {
				
					// Check if connected
					if(self.connected === true) {
				
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Network changed. Disconnecting from the listener.'));
					}
					
					// Check if connection exists
					if(self.connection !== Listener.NO_CONNECTION) {
					
						// Try
						try {
					
							// Close connection
							self.connection.close();
						}
						
						// Catch errors
						catch(error) {
						
						}
						
						// Set connection to no connection
						self.connection = Listener.NO_CONNECTION;
					}
					
					// Check if reconnect timeout exists
					if(self.reconnectTimeout !== Listener.NO_TIMEOUT) {
					
						// Clear reconnect timeout
						clearTimeout(self.reconnectTimeout);
						
						// Set reconnect timeout to no timeout
						self.reconnectTimeout = Listener.NO_TIMEOUT;
					}
				
					// Reset retry delay
					self.retryDelay = Listener.INITIAL_RETRY_DELAY_MILLISECONDS;
					
					// Clear connected
					self.connected = false;
					
					// Connect
					self.connect();
				}
			});
		}
		
		// Using custom listener
		usingCustomListener() {
		
			// Return if using a custom listener
			return this.useCustomListener === true;
		}
		
		// Get address
		getAddress() {
		
			// Check if not using a custom listener
			if(this.usingCustomListener() === false) {
			
				// Return default listener address
				return Listener.DEFAULT_LISTENER_ADDRESS;
			}
			
			// Otherwise
			else {
			
				// Get custom listener address
				var customListenerAddress = this.customListenerAddress.trim();
				
				// Check if custom listener address isn't set
				if(customListenerAddress["length"] === 0) {
				
					// Return custom listener address
					return customListenerAddress;
				}
				
				// Otherwise
				else {
			
					// Check if custom listener address doesn't have a protocol
					if(Common.urlContainsProtocol(customListenerAddress) === false) {
					
						// Add protocol to custom listener address
						customListenerAddress = Common.WEBSOCKET_PROTOCOL + "//" + customListenerAddress;
					}
					
					// Otherwise
					else {
					
						// Initialize error occurred
						var errorOccurred = false;
						
						// Try
						try {
						
							// Parse custom listener address as a URL
							var parsedUrl = new URL(customListenerAddress);
						}
						
						// Catch errors
						catch(error) {
						
							// Set error occurred
							errorOccurred = true;
						}
						
						// Check if an error didn't occur
						if(errorOccurred === false) {
						
							// Check if URL's protocol is HTTP
							if(parsedUrl["protocol"] === Common.HTTP_PROTOCOL) {
							
								// Change custom listener address's protocol to WebSocket
								customListenerAddress = Common.WEBSOCKET_PROTOCOL + Common.ltrim(customListenerAddress).substring(Common.HTTP_PROTOCOL["length"]);
							}
							
							// Otherwise check if URL's protocol is HTTPS
							else if(parsedUrl["protocol"] === Common.HTTPS_PROTOCOL) {
							
								// Change custom listener address's protocol to WebSocket secure
								customListenerAddress = Common.WEBSOCKET_SECURE_PROTOCOL + Common.ltrim(customListenerAddress).substring(Common.HTTPS_PROTOCOL["length"]);
							}
						}
					}
					
					// Return custom listener address upgraded if applicable and without any trailing slashes
					return Common.removeTrailingSlashes(Common.upgradeApplicableInsecureUrl(customListenerAddress));
				}
			}
		}
		
		// Start
		start() {
		
			// Check if not already started
			if(this.started === false) {
			
				// Set started
				this.started = true;
				
				// Connect
				this.connect();
			}
		}
		
		// Create URL
		createUrl() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return sending request to create URL
				return self.sendRequest({
				
					// Request
					"Request": Listener.CREATE_URL_REQUEST_NAME
					
				}).then(function(url) {
				
					// Check if URL is valid
					if(typeof url === "string")
					
						// Resolve URL
						resolve(url);
					
					// Otherwise
					else
					
						// Reject error
						reject("Creating URL failed.");
				
				// Catch errors
				}).catch(function(error) {
				
					// Check error
					switch(error) {
					
						// Connection error
						case Listener.CONNECTION_ERROR:
						
							// Reject error
							reject("Connecting to the listener failed.");
						
							// Break
							break;
						
						// Timeout error
						case Listener.TIMEOUT_ERROR:
						
							// Reject error
							reject("Creating URL timed out.");
						
							// Break
							break;
						
						// Invalid response error or default
						case Listener.INVALID_RESPONSE_ERROR:
						default:
						
							// Reject error
							reject("Creating URL failed.");
						
							// Break
							break;
					}
				});
			});
		}
		
		// Change URL
		changeUrl(url) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if connected
				if(self.isConnected() === true) {
			
					// Return sending request to change URL
					return self.sendRequest({
					
						// Request
						"Request": Listener.CHANGE_URL_REQUEST_NAME,
						
						// URL
						"URL": url
						
					}).then(function(url) {
					
						// Check if URL is valid
						if(typeof url === "string")
						
							// Resolve URL
							resolve(url);
						
						// Otherwise
						else
						
							// Reject error
							reject(Message.createText(Language.getDefaultTranslation('Changing the address suffix failed.')));
					
					// Catch errors
					}).catch(function(error) {
					
						// Check error
						switch(error) {
						
							// Connection error
							case Listener.CONNECTION_ERROR:
							
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('Connecting to the listener failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to change address suffixes without being connected to a listener.')));
							
								// Break
								break;
							
							// Timeout error
							case Listener.TIMEOUT_ERROR:
							
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('Changing the address suffix timed out.')));
							
								// Break
								break;
							
							// Invalid response error or default
							case Listener.INVALID_RESPONSE_ERROR:
							default:
							
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('Changing the address suffix failed.')));
							
								// Break
								break;
						}
					});
				}
				
				// Otherwise
				else {
				
					// Reject error
					reject(Message.createText(Language.getDefaultTranslation('You aren\'t connected to a listener.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You won\'t be able to change address suffixes without being connected to a listener.')));
				}
			});
		}
		
		// Owns URL
		ownsUrl(url) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return sending request to see if owns the URL
				return self.sendRequest({
				
					// Request
					"Request": Listener.OWN_URL_REQUEST_NAME,
					
					// URL
					"URL": url
					
				}).then(function(ownsUrl) {
				
					// Check if owns URL is valid
					if(typeof ownsUrl === "boolean")
					
						// Resolve owns URL
						resolve(ownsUrl);
					
					// Otherwise
					else
					
						// Reject error
						reject("Checking if owns URL failed.");
				
				// Catch errors
				}).catch(function(error) {
				
					// Check error
					switch(error) {
					
						// Connection error
						case Listener.CONNECTION_ERROR:
						
							// Reject error
							reject("Connecting to the listener failed.");
						
							// Break
							break;
						
						// Timeout error
						case Listener.TIMEOUT_ERROR:
						
							// Reject error
							reject("Checking if owns URL timed out.");
						
							// Break
							break;
						
						// Invalid response error or default
						case Listener.INVALID_RESPONSE_ERROR:
						default:
						
							// Reject error
							reject("Checking if owns URL failed.");
						
							// Break
							break;
					}
				});
			});
		}
		
		// Delete URL
		deleteUrl(url) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return sending request to delete URL
				return self.sendRequest({
				
					// Request
					"Request": Listener.DELETE_URL_REQUEST_NAME,
					
					// URL
					"URL": url
					
				}).then(function(deletedUrl) {
				
					// Check if deleted URL is valid
					if(typeof deletedUrl === "boolean")
					
						// Resolve deleted URL
						resolve(deletedUrl);
					
					// Otherwise
					else
					
						// Reject error
						reject("Deleting URL failed.");
				
				// Catch errors
				}).catch(function(error) {
				
					// Check error
					switch(error) {
					
						// Connection error
						case Listener.CONNECTION_ERROR:
						
							// Reject error
							reject("Connecting to the listener failed.");
						
							// Break
							break;
						
						// Timeout error
						case Listener.TIMEOUT_ERROR:
						
							// Reject error
							reject("Deleting URL timed out.");
						
							// Break
							break;
						
						// Invalid response error
						case Listener.INVALID_RESPONSE_ERROR:
						
							// Resolve false
							resolve(false);
							
							// Break
							break;
						
						// Default
						default:
						
							// Reject error
							reject("Deleting URL failed.");
						
							// Break
							break;
					}
				});
			});
		}
		
		// Respond with data
		respondWithData(interaction, data) {
		
			// Turn off status receive listener cancel interaction event
			$(this).off(Listener.STATUS_RECEIVE_EVENT + ".listenerCancel" + interaction.toFixed());
			
			// Turn off settings change listener cancel interaction event
			$(this).off(Listener.SETTINGS_CHANGE_EVENT + ".listenerCancel" + interaction.toFixed());
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return sending response
				return self.sendResponse({
				
					// Interaction
					"Interaction": interaction,
					
					// Type
					"Type": (Object.isObject(data) === true) ? "application/json" : "text/plain",
					
					// Data
					"Data": Base64.fromUint8Array((new TextEncoder()).encode((Object.isObject(data) === true) ? JSONBigNumber.stringify(data) : data)),
					
					// Status
					"Status": Common.HTTP_OK_STATUS
					
				}).then(function(status) {
				
					// Check if status is valid
					if(typeof status === "string")
					
						// Resolve if status succeeded
						resolve(status === Listener.STATUS_SUCCEEDED_VALUE);
					
					// Otherwise
					else
					
						// Reject error
						reject("Sending response failed.");
				
				// Catch errors
				}).catch(function(error) {
				
					// Check error
					switch(error) {
					
						// Connection error
						case Listener.CONNECTION_ERROR:
						
							// Reject error
							reject("Connecting to the listener failed.");
						
							// Break
							break;
						
						// Timeout error
						case Listener.TIMEOUT_ERROR:
						
							// Reject error
							reject("Sending response timed out.");
						
							// Break
							break;
						
						// Invalid status error or default
						case Listener.INVALID_STATUS_ERROR:
						default:
						
							// Reject error
							reject("Sending response failed.");
						
							// Break
							break;
					}
				});
			});
		}
		
		// Respond with error
		respondWithError(interaction, data) {
		
			// Turn off status receive listener cancel interaction event
			$(this).off(Listener.STATUS_RECEIVE_EVENT + ".listenerCancel" + interaction.toFixed());
			
			// Turn off settings change listener cancel interaction event
			$(this).off(Listener.SETTINGS_CHANGE_EVENT + ".listenerCancel" + interaction.toFixed());
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Set status to HTTP ok status
				var status = Common.HTTP_OK_STATUS;
				
				// Check if data is a status response
				if(typeof data === "number") {
			
					// Check data
					switch(data) {
					
						// Ok response
						case Listener.OK_RESPONSE:
						
							// Set status to HTTP ok status
							status = Common.HTTP_OK_STATUS;
						
							// Break
							break;
						
						// Unauthoirzed response
						case Listener.UNAUTHORIZED_RESPONSE:
						
							// Set status to HTTP unauthorized status
							status = Common.HTTP_UNAUTHORIZED_STATUS;
						
							// Break
							break;
						
						// Forbidden response
						case Listener.FORBIDDEN_RESPONSE:
						
							// Set status to HTTP forbidden status
							status = Common.HTTP_FORBIDDEN_STATUS;
						
							// Break
							break;
						
						// Not found response
						case Listener.NOT_FOUND_RESPONSE:
						
							// Set status to HTTP not found status
							status = Common.HTTP_NOT_FOUND_STATUS;
						
							// Break
							break;
						
						// Unsupported media type response
						case Listener.UNSUPPORTED_MEDIA_TYPE_RESPONSE:
						
							// Set status to HTTP unsupported media type status
							status = Common.HTTP_UNSUPPORTED_MEDIA_TYPE_STATUS;
						
							// Break
							break;
					}
				}
			
				// Return sending response
				return self.sendResponse({
				
					// Interaction
					"Interaction": interaction,
					
					// Type
					"Type": (Object.isObject(data) === true) ? "application/json" : "text/plain",
					
					// Data
					"Data": Base64.fromUint8Array((new TextEncoder()).encode((Object.isObject(data) === true) ? JSONBigNumber.stringify(data) : ((typeof data === "number") ? "" : data))),
					
					// Status
					"Status": status
					
				}).then(function(status) {
				
					// Check if status is valid
					if(typeof status === "string")
					
						// Resolve true
						resolve(true);
					
					// Otherwise
					else
					
						// Reject error
						reject("Sending response failed.");
				
				// Catch errors
				}).catch(function(error) {
				
					// Check error
					switch(error) {
					
						// Connection error
						case Listener.CONNECTION_ERROR:
						
							// Reject error
							reject("Connecting to the listener failed.");
						
							// Break
							break;
						
						// Timeout error
						case Listener.TIMEOUT_ERROR:
						
							// Reject error
							reject("Sending response timed out.");
						
							// Break
							break;
						
						// Invalid status error or default
						case Listener.INVALID_STATUS_ERROR:
						default:
						
							// Reject error
							reject("Sending response failed.");
						
							// Break
							break;
					}
				});
			});
		}
		
		// Connection open event
		static get CONNECTION_OPEN_EVENT() {
		
			// Return connection open event
			return "ListenerConnectionOpenEvent";
		}
		
		// Connection close event
		static get CONNECTION_CLOSE_EVENT() {
		
			// Return connection close event
			return "ListenerConnectionCloseEvent";
		}
		
		// Request receive event
		static get REQUEST_RECEIVE_EVENT() {
		
			// Return request receive event
			return "ListenerRequestReceiveEvent";
		}
		
		// No connection close type
		static get NO_CONNECTION_CLOSE_TYPE() {
		
			// Return no connection close type
			return 0;
		}
		
		// Disconnected close type
		static get DISCONNECTED_CLOSE_TYPE() {
		
			// Return disconnected close type
			return Listener.NO_CONNECTION_CLOSE_TYPE + 1;
		}
		
		// Ok response
		static get OK_RESPONSE() {
		
			// Return ok response
			return 0;
		}
		
		// Unauthorized response
		static get UNAUTHORIZED_RESPONSE() {
		
			// Return unauthorized response
			return Listener.OK_RESPONSE + 1;
		}
		
		// Forbidden response
		static get FORBIDDEN_RESPONSE() {
		
			// Return forbidden response
			return Listener.UNAUTHORIZED_RESPONSE + 1;
		}
		
		// Not found response
		static get NOT_FOUND_RESPONSE() {
		
			// Return not found response
			return Listener.FORBIDDEN_RESPONSE + 1;
		}
		
		// Unsupported media type response
		static get UNSUPPORTED_MEDIA_TYPE_RESPONSE() {
		
			// Return unsupported media type response
			return Listener.NOT_FOUND_RESPONSE + 1;
		}
		
		// Settings change event
		static get SETTINGS_CHANGE_EVENT() {
		
			// Return settings change event
			return "ListenerSettingsChangeEvent";
		}
		
		// Promise resolve wallet index
		static get PROMISE_RESOLVE_WALLET_INDEX() {
		
			// Return promise resolve wallet index
			return 0;
		}
		
		// Promise resolve amount index
		static get PROMISE_RESOLVE_AMOUNT_INDEX() {
		
			// Return promise resolve amount index
			return Listener.PROMISE_RESOLVE_WALLET_INDEX + 1;
		}
		
		// Promise resolve currency index
		static get PROMISE_RESOLVE_CURRENCY_INDEX() {
		
			// Return promise resolve currency index
			return Listener.PROMISE_RESOLVE_AMOUNT_INDEX + 1;
		}
		
		// Promise resolve message index
		static get PROMISE_RESOLVE_MESSAGE_INDEX() {
		
			// Return promise resolve message index
			return Listener.PROMISE_RESOLVE_CURRENCY_INDEX + 1;
		}
		
		// Promise resolve receiver address index
		static get PROMISE_RESOLVE_RECEIVER_ADDRESS_INDEX() {
		
			// Return promise resolve receiver address index
			return Listener.PROMISE_RESOLVE_MESSAGE_INDEX + 1;
		}
		
		// Promise resolve file response index
		static get PROMISE_RESOLVE_FILE_RESPONSE_INDEX() {
		
			// Return promise resolve file response index
			return Listener.PROMISE_RESOLVE_RECEIVER_ADDRESS_INDEX + 1;
		}
		
		// Promise resolve ID index
		static get PROMISE_RESOLVE_ID_INDEX() {
		
			// Return promise resolve ID index
			return Listener.PROMISE_RESOLVE_FILE_RESPONSE_INDEX + 1;
		}
	
	// Private
	
		// Connect
		connect() {
		
			// Check if reconnect timeout exists
			if(this.reconnectTimeout !== Listener.NO_TIMEOUT) {
			
				// Clear reconnect timeout
				clearTimeout(this.reconnectTimeout);
				
				// Set reconnect timeout to no timeout
				this.reconnectTimeout = Listener.NO_TIMEOUT;
			}
		
			// Set empty address
			var emptyAddress = this.getAddress()["length"] === 0;
		
			// Check if address exists
			if(emptyAddress === false) {
		
				// Log message
				Log.logMessage(Language.getDefaultTranslation('Trying to connect to the listener at %1$y.'), [
				
					[
						// Text
						this.getAddress(),
						
						// Is raw data
						true
					]
				]);
			}
			
			// Get current ignore response index
			var index = this.ignoreResponseIndex++;
			
			// Check if current ignore resposne index is at the max safe integer
			if(index === Number.MAX_SAFE_INTEGER) {
			
				// Reset ignore response index
				this.ignoreResponseIndex = 0;
			}
			
			// Set ignore response
			var ignoreResponse = false;
			
			// Settings change listener index event
			$(this).one(Listener.SETTINGS_CHANGE_EVENT + ".listener" + index.toFixed(), function() {
			
				// Turn off window offline listener index event
				$(window).off("offline" + ".listener" + index.toFixed());
			
				// Set ignore response
				ignoreResponse = true;
			});
			
			// Set self
			var self = this;
			
			// Window offline listener index event
			$(window).one("offline" + ".listener" + index.toFixed(), function() {
			
				// Turn off settings change listener index event
				$(self).off(Listener.SETTINGS_CHANGE_EVENT + ".listener" + index.toFixed());
			
				// Set ignore response
				ignoreResponse = true;
			});
			
			// Try
			try {
		
				// Create connection
				this.connection = new WebSocket(this.getAddress());
			}
			
			// Catch errors
			catch(error) {
			
				// Check if not ignoring response
				if(ignoreResponse === false) {
				
					// Turn off settings change listener index event
					$(this).off(Listener.SETTINGS_CHANGE_EVENT + ".listener" + index.toFixed());
					
					// Turn off window offline listener index event
					$(window).off("offline" + ".listener" + index.toFixed());
			
					// Check if address exists
					if(emptyAddress === false) {
				
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Connecting to the listener failed.'));
					}
					
					// Check if reconnect timeout exists
					if(this.reconnectTimeout !== Listener.NO_TIMEOUT) {
					
						// Clear reconnect timeout
						clearTimeout(this.reconnectTimeout);
						
						// Set reconnect timeout to no timeout
						this.reconnectTimeout = Listener.NO_TIMEOUT;
					}
					
					// Set reconnect timeout
					this.reconnectTimeout = setTimeout(function() {
					
						// Set reconnect timeout to no timeout
						self.reconnectTimeout = Listener.NO_TIMEOUT;
					
						// Connect
						self.connect();
					
					}, Math.min(Listener.MAXIMUM_RETRY_DELAY_MILLISECONDS, this.retryDelay));
					
					// Update retry delay
					this.retryDelay *= Listener.RETRY_DELAY_SCALING_FACTOR;
					
					// Trigger connection close event
					$(this).trigger(Listener.CONNECTION_CLOSE_EVENT, (this.connected === false) ? Listener.NO_CONNECTION_CLOSE_TYPE : Listener.DISCONNECTED_CLOSE_TYPE);
					
					// Set connection to no connection
					this.connection = Listener.NO_CONNECTION;
					
					// Clear connected
					this.connected = false;
				}
				
				// Return
				return;
			}
			
			// Connection open event
			$(this.connection).on("open", function() {
			
				// Check if not ignoring response
				if(ignoreResponse === false) {
			
					// Log message
					Log.logMessage(Language.getDefaultTranslation('Successfully connected to the listener.'));
				
					// Reset retry delay
					self.retryDelay = Listener.INITIAL_RETRY_DELAY_MILLISECONDS;
					
					// Trigger connection open event
					$(self).trigger(Listener.CONNECTION_OPEN_EVENT);
					
					// Set connected
					self.connected = true;
				}
			
			// Connection error event
			}).on("error", function() {
			
				// Check if not ignoring response
				if(ignoreResponse === false) {
			
					// Close connection
					self.connection.close();
				}
			
			// Connection close event
			}).on("close", function() {
			
				// Check if not ignoring response
				if(ignoreResponse === false) {
				
					// Turn off settings change listener index event
					$(self).off(Listener.SETTINGS_CHANGE_EVENT + ".listener" + index.toFixed());
					
					// Turn off window offline listener index event
					$(window).off("offline" + ".listener" + index.toFixed());
			
					// Check if connected
					if(self.connected === true) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Disconnected from the listener.'));
					}
					
					// Otherwise
					else {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Connecting to the listener failed.'));
					}
				
					// Check if reconnect timeout exists
					if(self.reconnectTimeout !== Listener.NO_TIMEOUT) {
					
						// Clear reconnect timeout
						clearTimeout(self.reconnectTimeout);
						
						// Set reconnect timeout to no timeout
						self.reconnectTimeout = Listener.NO_TIMEOUT;
					}
				
					// Set reconnect timeout
					self.reconnectTimeout = setTimeout(function() {
					
						// Set reconnect timeout to no timeout
						self.reconnectTimeout = Listener.NO_TIMEOUT;
					
						// Connect
						self.connect();
					
					}, Math.min(Listener.MAXIMUM_RETRY_DELAY_MILLISECONDS, self.retryDelay));
					
					// Update retry delay
					self.retryDelay *= Listener.RETRY_DELAY_SCALING_FACTOR;
					
					// Trigger connection close event
					$(self).trigger(Listener.CONNECTION_CLOSE_EVENT, (self.connected === false) ? Listener.NO_CONNECTION_CLOSE_TYPE : Listener.DISCONNECTED_CLOSE_TYPE);
					
					// Set connection to no connection
					self.connection = Listener.NO_CONNECTION;
					
					// Clear connected
					self.connected = false;
				}
			
			// Connection message event
			}).on("message", function(event) {
			
				// Try
				try {
				
					// Parse message as JSON
					var message = JSON.parse(event["originalEvent"]["data"]);
				}
				
				// Catch errors
				catch(error) {
					
					// Return
					return;
				}
				
				// Check if message is invalid
				if(Object.isObject(message) === false)
				
					// Return
					return;
				
				// Check if message is a response
				if("Index" in message === true && typeof message["Index"] === "number")
				
					// Trigger response receive event
					$(self).trigger(Listener.RESPONSE_RECEIVE_EVENT, message);
				
				// Otherwise check if message is an interaction
				else if("Interaction" in message === true && typeof message["Interaction"] === "number" && "URL" in message === true && "API" in message === true && "Type" in message === true && "Data" in message === true) {
				
					// Check if not ignoring response
					if(ignoreResponse === false) {
				
						// Check if message's contents are valid
						if(typeof message["URL"] === "string" && typeof message["API"] === "string" && typeof message["Type"] === "string" && typeof message["Data"] === "string") {
						
							// Try
							try {
							
								// Decode message's data
								var data = Base64.toUint8Array(message["Data"]);
							}
							
							// Catch errors
							catch(error) {
								
								// Send error
								self.send({
								
									// Interaction
									"Interaction": message["Interaction"],
									
									// Type
									"Type": "text/plain",
									
									// Data
									"Data": Base64.fromUint8Array((new TextEncoder()).encode("")),
									
									// Status
									"Status": Common.HTTP_UNSUPPORTED_MEDIA_TYPE_STATUS
								});
								
								// Return
								return;
							}
							
							// Create interaction from message
							var interaction = new Interaction(message["Interaction"], message["URL"], message["API"], message["Type"], data, self);
							
							// Status receive listener cancel interaction event
							$(self).on(Listener.STATUS_RECEIVE_EVENT + ".listenerCancel" + message["Interaction"].toFixed(), function(event, status) {
							
								// Check if status is for the interaction
								if(status["Interaction"] === message["Interaction"]) {
								
									// Turn off status receive listener cancel interaction event
									$(self).off(Listener.STATUS_RECEIVE_EVENT + ".listenerCancel" + message["Interaction"].toFixed());
									
									// Turn off settings change listener cancel interaction event
									$(self).off(Listener.SETTINGS_CHANGE_EVENT + ".listenerCancel" + message["Interaction"].toFixed());
								
									// Check if status contains an error, doesn't contain a status, or doesn't contain a succeeded status
									if(Object.isObject(status) === false || "Error" in status === true || "Status" in status === false || status["Status"] !== Listener.STATUS_SUCCEEDED_VALUE) {
									
										// Set that interaction is canceled
										interaction.setCanceled();
									}
								}
							
							// Settings change listener cancel interaction event
							}).one(Listener.SETTINGS_CHANGE_EVENT + ".listenerCancel" + message["Interaction"].toFixed(), function() {
							
								// Turn off status receive listener cancel interaction event
								$(self).off(Listener.STATUS_RECEIVE_EVENT + ".listenerCancel" + message["Interaction"].toFixed());
								
								// Set that interaction is canceled
								interaction.setCanceled();
							});
						
							// Trigger request receive event
							$(self).trigger(Listener.REQUEST_RECEIVE_EVENT, interaction);
						}
						
						// Otherwise
						else {
						
							// Send error
							self.send({
							
								// Interaction
								"Interaction": message["Interaction"],
								
								// Type
								"Type": "text/plain",
								
								// Data
								"Data": Base64.fromUint8Array((new TextEncoder()).encode("")),
								
								// Status
								"Status": Common.HTTP_UNSUPPORTED_MEDIA_TYPE_STATUS
							});
						}
					}
					
					// Otherwise
					else {
					
						// Send error
						self.send({
						
							// Interaction
							"Interaction": message["Interaction"],
							
							// Type
							"Type": "text/plain",
							
							// Data
							"Data": Base64.fromUint8Array((new TextEncoder()).encode("")),
							
							// Status
							"Status": Common.HTTP_NOT_FOUND_STATUS
						});
					}
				}
				
				// Otherwise check if message is a status
				else if("Interaction" in message === true && typeof message["Interaction"] === "number")
				
					// Trigger status receive event
					$(self).trigger(Listener.STATUS_RECEIVE_EVENT, message);
			});
		}
		
		// Is connected
		isConnected() {
		
			// Return if connection exists and is open
			return this.connection !== Listener.NO_CONNECTION && this.connection["readyState"] === Listener.WEBSOCKET_OPEN_STATE;
		}
		
		// Send
		send(data) {
		
			// Send data to connection
			this.connection.send(JSON.stringify(data));
		}
		
		// Send request
		sendRequest(request) {
		
			// Get current request index
			var index = this.requestIndex++;
			
			// Check if current request index is at the max safe integer
			if(index === Number.MAX_SAFE_INTEGER)
			
				// Reset request index
				this.requestIndex = 0;
			
			// Set index in request
			request["Index"] = index;
			
			// Get current ignore response index
			var ignoreResponseIndex = this.ignoreResponseIndex++;
			
			// Check if current ignore resposne index is at the max safe integer
			if(ignoreResponseIndex === Number.MAX_SAFE_INTEGER) {
			
				// Reset ignore response index
				this.ignoreResponseIndex = 0;
			}
			
			// Initialize ignore response
			var ignoreResponse = false;
			
			// Settings change listener request ignore response index event
			$(this).on(Listener.SETTINGS_CHANGE_EVENT + ".listenerRequest" + ignoreResponseIndex.toFixed(), function() {
			
				// Set ignore response
				ignoreResponse = true;
			});
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Turn off settings change listener request ignore response index event
				$(self).off(Listener.SETTINGS_CHANGE_EVENT + ".listenerRequest" + ignoreResponseIndex.toFixed());
			
				// Check if ignoring response
				if(ignoreResponse === true) {
				
					// Reject error
					reject(Listener.CONNECTION_ERROR);
				}
				
				// Otherwise
				else {
				
					// Turn off events
					var turnOffEvents = function() {
					
						// Turn off response receive listener request index event
						$(self).off(Listener.RESPONSE_RECEIVE_EVENT + ".listenerRequest" + index.toFixed());
						
						// Turn off connection open listener request index event
						$(self).off(Listener.CONNECTION_OPEN_EVENT + ".listenerRequest" + index.toFixed());
						
						// Turn off connection close listener request index event
						$(self).off(Listener.CONNECTION_CLOSE_EVENT + ".listenerRequest" + index.toFixed());
						
						// Turn off settings change listener request ignore response index event
						$(self).off(Listener.SETTINGS_CHANGE_EVENT + ".listenerRequest" + ignoreResponseIndex.toFixed());
					};
					
					// Create timeout
					var timeout = setTimeout(function() {
					
						// Turn off events
						turnOffEvents();
						
						// Reject error
						reject(Listener.TIMEOUT_ERROR);
						
					}, Listener.REQUEST_TIMEOUT_SECONDS * Common.MILLISECONDS_IN_A_SECOND);
					
					// Initialize close count
					var closeCount = 0;
					
					// Response receive listener request index event
					$(self).on(Listener.RESPONSE_RECEIVE_EVENT + ".listenerRequest" + index.toFixed(), function(event, response) {
					
						// Check if response contains the index
						if(response["Index"] === index) {
						
							// Stop timeout
							clearTimeout(timeout);
							
							// Turn off events
							turnOffEvents();
						
							// Check if response contains an error or doesn't contain a response
							if(Object.isObject(response) === false || "Error" in response === true || "Response" in response === false)
							
								// Reject error
								reject(Listener.INVALID_RESPONSE_ERROR);
							
							// Otherwise
							else
							
								// Resolve response
								resolve(response["Response"]);
						}
					
					// Connection open listener request index event
					}).on(Listener.CONNECTION_OPEN_EVENT + ".listenerRequest" + index.toFixed(), function() {
					
						// Send request
						self.send(request);
					
					// Connection close listener request index event
					}).on(Listener.CONNECTION_CLOSE_EVENT + ".listenerRequest" + index.toFixed(), function() {
					
						// Check if close count is at the fail threshold
						if(++closeCount >= Listener.CONNECTION_CLOSE_FAIL_THRESHOLD) {
						
							// Stop timeout
							clearTimeout(timeout);
							
							// Turn off events
							turnOffEvents();
							
							// Reject error
							reject(Listener.CONNECTION_ERROR);
						}
					
					// Settings change listener request ignore response index event
					}).on(Listener.SETTINGS_CHANGE_EVENT + ".listenerRequest" + ignoreResponseIndex.toFixed(), function() {
					
						// Stop timeout
						clearTimeout(timeout);
						
						// Turn off events
						turnOffEvents();
						
						// Reject error
						reject(Listener.CONNECTION_ERROR);
					});
					
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Send request
							self.send(request);
						}
						
						// Catch errors
						catch(error) {
						
						}
					}
				}
			});
		}
		
		// Send response
		sendResponse(response) {
		
			// Get interaction index
			var index = response["Interaction"];
			
			// Get current ignore response index
			var ignoreResponseIndex = this.ignoreResponseIndex++;
			
			// Check if current ignore resposne index is at the max safe integer
			if(ignoreResponseIndex === Number.MAX_SAFE_INTEGER) {
			
				// Reset ignore response index
				this.ignoreResponseIndex = 0;
			}
		
			// Initialize ignore response
			var ignoreResponse = false;
			
			// Settings change listener response ignore response index event
			$(this).on(Listener.SETTINGS_CHANGE_EVENT + ".listenerResponse" + ignoreResponseIndex.toFixed(), function() {
			
				// Set ignore response
				ignoreResponse = true;
			});
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Turn off settings change listener response ignore response index event
				$(self).off(Listener.SETTINGS_CHANGE_EVENT + ".listenerResponse" + ignoreResponseIndex.toFixed());
			
				// Check if ignoring response
				if(ignoreResponse === true) {
				
					// Reject error
					reject(Listener.CONNECTION_ERROR);
				}
				
				// Otherwise
				else {
				
					// Turn off events
					var turnOffEvents = function() {
					
						// Turn off status receive listener response index event
						$(self).off(Listener.STATUS_RECEIVE_EVENT + ".listenerResponse" + index.toFixed());
						
						// Turn off connection open listener response index event
						$(self).off(Listener.CONNECTION_OPEN_EVENT + ".listenerResponse" + index.toFixed());
						
						// Turn off connection close listener response index event
						$(self).off(Listener.CONNECTION_CLOSE_EVENT + ".listenerResponse" + index.toFixed());
						
						// Turn off settings change listener response ignore response index event
						$(self).off(Listener.SETTINGS_CHANGE_EVENT + ".listenerResponse" + ignoreResponseIndex.toFixed());
					};
					
					// Create timeout
					var timeout = setTimeout(function() {
					
						// Turn off events
						turnOffEvents();
						
						// Reject error
						reject(Listener.TIMEOUT_ERROR);
						
					}, Listener.RESPONSE_TIMEOUT_SECONDS * Common.MILLISECONDS_IN_A_SECOND);
					
					// Initialize close count
					var closeCount = 0;
					
					// Status receive listener response index event
					$(self).on(Listener.STATUS_RECEIVE_EVENT + ".listenerResponse" + index.toFixed(), function(event, status) {
					
						// Check if status contains the index
						if(status["Interaction"] === index) {
						
							// Stop timeout
							clearTimeout(timeout);
							
							// Turn off events
							turnOffEvents();
							
							// Check if status contains an error or doesn't contain a status
							if(Object.isObject(status) === false || "Error" in status === true || "Status" in status === false)
							
								// Reject error
								reject(Listener.INVALID_STATUS_ERROR);
							
							// Otherwise
							else
							
								// Resolve status
								resolve(status["Status"]);
						}
					
					// Connection open listener response index event
					}).on(Listener.CONNECTION_OPEN_EVENT + ".listenerResponse" + index.toFixed(), function() {
					
						// Send response
						self.send(response);
					
					// Connection close listener response index event
					}).on(Listener.CONNECTION_CLOSE_EVENT + ".listenerResponse" + index.toFixed(), function() {
					
						// Check if close count is at the fail threshold
						if(++closeCount >= Listener.CONNECTION_CLOSE_FAIL_THRESHOLD) {
						
							// Stop timeout
							clearTimeout(timeout);
							
							// Turn off events
							turnOffEvents();
							
							// Reject error
							reject(Listener.CONNECTION_ERROR);
						}
					
					// Settings change listener response ignore response index event
					}).on(Listener.SETTINGS_CHANGE_EVENT + ".listenerResponse" + ignoreResponseIndex.toFixed(), function() {
					
						// Stop timeout
						clearTimeout(timeout);
						
						// Turn off events
						turnOffEvents();
						
						// Reject error
						reject(Listener.CONNECTION_ERROR);
					});
					
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Send response
							self.send(response);
						}
						
						// Catch errors
						catch(error) {
						
						}
					}
				}
			});
		}
	
		// Initial retry delay milliseconds
		static get INITIAL_RETRY_DELAY_MILLISECONDS() {
		
			// Return initial retry delay milliseconds
			return 250;
		}
		
		// Maximum retry delay milliseconds
		static get MAXIMUM_RETRY_DELAY_MILLISECONDS() {
		
			// Return maximum retry delay milliseconds
			return 10 * Common.MILLISECONDS_IN_A_SECOND;
		}
		
		// Retry delay scaling factor
		static get RETRY_DELAY_SCALING_FACTOR() {
		
			// Return retry delay scaling factor
			return 2;
		}
		
		// Response receive event
		static get RESPONSE_RECEIVE_EVENT() {
		
			// Return response receive event
			return "ListenerResponseReceiveEvent";
		}
		
		// Status receive event
		static get STATUS_RECEIVE_EVENT() {
		
			// Return status receive event
			return "ListenerStatusReceiveEvent";
		}
		
		// WebSocket open state
		static get WEBSOCKET_OPEN_STATE() {
		
			// Return WebSocket open state
			return 1;
		}
		
		// Request timeout seconds
		static get REQUEST_TIMEOUT_SECONDS() {
		
			// Return request timeout seconds
			return 2 * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Response timeout seconds
		static get RESPONSE_TIMEOUT_SECONDS() {
		
			// Return response timeout seconds
			return Listener.REQUEST_TIMEOUT_SECONDS;
		}
		
		// No timeout
		static get NO_TIMEOUT() {
		
			// Return no timeout
			return null;
		}
		
		// Connection close fail threshold
		static get CONNECTION_CLOSE_FAIL_THRESHOLD() {
		
			// Return connection close fail threshold
			return 3;
		}
		
		// Create URL request name
		static get CREATE_URL_REQUEST_NAME() {
		
			// Return create URL request name
			return "Create URL";
		}
		
		// Change URL request name
		static get CHANGE_URL_REQUEST_NAME() {
		
			// Return change URL request name
			return "Change URL";
		}
		
		// Own URL request name
		static get OWN_URL_REQUEST_NAME() {
		
			// Return own URL request name
			return "Own URL";
		}
		
		// Delete URL request name
		static get DELETE_URL_REQUEST_NAME() {
		
			// Return delete URL request name
			return "Delete URL";
		}
		
		// Connection error
		static get CONNECTION_ERROR() {
		
			// Return connection error
			return 0;
		}
		
		// Timeout error
		static get TIMEOUT_ERROR() {
		
			// Return timeout error
			return Listener.CONNECTION_ERROR + 1;
		}
		
		// Invalid response error
		static get INVALID_RESPONSE_ERROR() {
		
			// Return invalid response error
			return Listener.TIMEOUT_ERROR + 1;
		}
		
		// Invalid status error
		static get INVALID_STATUS_ERROR() {
		
			// Return invalid status error
			return Listener.INVALID_RESPONSE_ERROR + 1;
		}
		
		// Status succeeded value
		static get STATUS_SUCCEEDED_VALUE() {
		
			// Return status succeeded value
			return "Succeeded";
		}
		
		// No connection
		static get NO_CONNECTION() {
		
			// Return no connection
			return null;
		}
		
		// Settings use custom listener name
		static get SETTINGS_USE_CUSTOM_LISTENER_NAME() {
		
			// Return settings use custom listener name
			return "Use Custom Listener";
		}
		
		// Settings use custom listener default value
		static get SETTINGS_USE_CUSTOM_LISTENER_DEFAULT_VALUE() {
		
			// Return settings use custom listener default value
			return false;
		}
		
		// Settings custom listener address name
		static get SETTINGS_CUSTOM_LISTENER_ADDRESS_NAME() {
		
			// Return settings custom listener address name
			return "Custom Listener Address";
		}
		
		// Settings custom listener address default value
		static get SETTINGS_CUSTOM_LISTENER_ADDRESS_DEFAULT_VALUE() {
		
			// Return settings custom listener address default value
			return "";
		}
		
		// Default listener address
		static get DEFAULT_LISTENER_ADDRESS() {
		
			// Set server
			var server = (Common.isExtension() === true || location["protocol"] === Common.FILE_PROTOCOL) ? new URL(HTTPS_SERVER_ADDRESS) : location;
			
			// Return default listener address
			return ((server["protocol"] === Common.HTTPS_PROTOCOL) ? Common.WEBSOCKET_SECURE_PROTOCOL : Common.WEBSOCKET_PROTOCOL) + "//" + server["hostname"] + "/listen";
		}
}


// Main function

// Set global object's listener
globalThis["Listener"] = Listener;
