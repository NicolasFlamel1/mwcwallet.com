// Use strict
"use strict";


// Classes

// HardwareWallet class
class HardwareWallet {

	// Public
	
		// Constructor
		constructor(application) {
		
			// Set application
			this.application = application;
		
			// Set transport to no transport
			this.transport = HardwareWallet.NO_TRANSPORT;
			
			// Set root public key to no root public key
			this.rootPublicKey = HardwareWallet.NO_ROOT_PUBLIC_KEY;
			
			// Set seed cookie to no seed cookie
			this.seedCookie = HardwareWallet.NO_SEED_COOKIE;
			
			// Set connected to false
			this.connected = false;
			
			// Set in use to false
			this.inUse = false;
			
			// Set exclusive lock obtained to false
			this.exclusiveLockObtained = false;
			
			// Set exclusive lock release event index
			this.exclusiveLockReleaseEventIndex = 0;
			
			// Set locked to false
			this.locked = false;
			
			// Set connection type to USB connection type
			this.connectionType = HardwareWallet.USB_CONNECTION_TYPE;
			
			// Set wallet key path
			this.walletKeyPath = Wallet.NO_KEY_PATH;
			
			// Set hardware type
			this.hardwareType = HardwareWallet.LEDGER_HARDWARE_TYPE;
		}
		
		// Get root public key
		getRootPublicKey() {
		
			// Return copy of root public key
			return new Uint8Array(this.rootPublicKey);
		}
		
		// Get seed cookie
		getSeedCookie() {
		
			// Return seed cookie
			return this.seedCookie;
		}
		
		// Get connection type
		getConnectionType() {
		
			// Return connection type
			return this.connectionType;
		}
		
		// Get hardware type
		getHardwareType() {
		
			// Return hardware type
			return this.hardwareType;
		}
		
		// Is connected
		isConnected() {
		
			// Return if connected
			return this.connected === true;
		}
		
		// Set in use
		setInUse(inUse) {
		
			// Set is in use
			this.inUse = inUse;
		}
		
		// Get in use
		getInUse() {
		
			// Return in use
			return this.inUse;
		}
		
		// Is locked
		isLocked() {
		
			// Return if locked
			return this.locked === true;
		}
		
		// Close
		close() {
		
			// Check if root public key exists
			if(this.rootPublicKey !== HardwareWallet.NO_ROOT_PUBLIC_KEY) {
			
				// Securely clear the root public key
				this.rootPublicKey.fill(0);
			
				// Set root public key to no root public key
				this.rootPublicKey = HardwareWallet.NO_ROOT_PUBLIC_KEY;
			}
			
			// Set seed cookie to no seed cookie
			this.seedCookie = HardwareWallet.NO_SEED_COOKIE;
			
			// Clear in use
			this.inUse = false;
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
						
						// Return closing transport and catch errors
						return self.transport.close().catch(function(error) {
						
						// Finally
						}).finally(function() {
						
							// Clear connected
							self.connected = false;
						
							// Set transport to no transport
							self.transport = HardwareWallet.NO_TRANSPORT;
						
							// Trigger disconnect event
							$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
							
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Resolve
							resolve();
						});
					}
					
					// Otherwise
					else {
						
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Resolve
						resolve();
					}
				});
			});
		}
		
		// Connect
		connect(hardwareWalletDescriptor, failOnLock = false, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
				
					// Check if not connected
					if(self.isConnected() === false) {
			
						// Function get hardware wallet transport
						var getHardwareWalletTransport = function() {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if connecting to any hardware wallet descriptor
								if(hardwareWalletDescriptor === HardwareWallet.ANY_HARDWARE_WALLET_DESCRIPTOR) {
								
									// Check if USB is supported
									if("usb" in navigator === true) {
								
										// Return connecting to any USB hardware wallet
										return HardwareWalletUsbTransport.request().then(function(transport) {
										
											// Set connection type to USB connection type
											self.connectionType = HardwareWallet.USB_CONNECTION_TYPE;
										
											// Resolve transport
											resolve(transport);
											
										// Catch errors
										}).catch(function(error) {
										
											// Check if error is that user canceled action
											if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NOT_FOUND_ERROR_CODE) || ("name" in error === true && error["name"] === "NotFoundError"))) {
											
												// Check if Bluetooth is supported
												if("bluetooth" in navigator === true) {
												
													// Return connecting to any Bluetooth hardware wallet
													return HardwareWalletBluetoothTransport.request().then(function(transport) {
													
														// Set connection type to Bluetooth connection type
														self.connectionType = HardwareWallet.BLUETOOTH_CONNECTION_TYPE;
													
														// Resolve transport
														resolve(transport);
														
													// Catch errors
													}).catch(function(error) {
													
														// Check if error is that user canceled action
														if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NOT_FOUND_ERROR_CODE) || ("name" in error === true && error["name"] === "NotFoundError"))) {
														
															// Reject error
															reject(Message.createText(Language.getDefaultTranslation('No hardware wallet was selected.')) + ((Common.isPopup() === true) ? Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to open this extension in a tab or window if it\'s not able to connect to a hardware wallet.')) : ""));
														}
														
														// Otherwise check if error was a connection error
														else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
														
															// Check if is an extension
															if(Common.isExtension() === true) {
														
																// Reject error
																reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this extension can connect to it.')));
															}
															
															// Otherwise check if is an app
															else if(Common.isApp() === true) {
															
																// Reject error
																reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this app can connect to it.')));
															}
															
															// Otherwise
															else {
															
																// Reject error
																reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this site can connect to it.')));
															}
														}
														
														// Otherwise check if error was an invalid state error
														else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.INVALID_STATE_ERROR_CODE) || ("name" in error === true && error["name"] === "InvalidStateError"))) {
														
															// Reject error
															reject(Message.createText(Language.getDefaultTranslation('That hardware wallet is currently in use.')));
														}
														
														// Otherwise
														else {
														
															// Reject error
															reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')));
														}
													});
												}
												
												// Otherwise
												else {
												
													// Reject error
													reject(Message.createText(Language.getDefaultTranslation('No hardware wallet was selected.')) + ((Common.isPopup() === true) ? Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to open this extension in a tab or window if it\'s not able to connect to a hardware wallet.')) : ""));
												}
											}
											
											// Otherwise check if error was an invalid state error
											else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.INVALID_STATE_ERROR_CODE) || ("name" in error === true && error["name"] === "InvalidStateError"))) {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('That hardware wallet is currently in use.')));
											}
											
											// Otherwise
											else {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')));
											}
										});
									}
									
									// Otherwise check if Bluetooth is supported
									else if("bluetooth" in navigator === true) {
									
										// Return connecting to any Bluetooth hardware wallet
										return HardwareWalletBluetoothTransport.request().then(function(transport) {
										
											// Set connection type to Bluetooth connection type
											self.connectionType = HardwareWallet.BLUETOOTH_CONNECTION_TYPE;
										
											// Resolve transport
											resolve(transport);
											
										// Catch errors
										}).catch(function(error) {
										
											// Check if error is that user canceled action
											if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NOT_FOUND_ERROR_CODE) || ("name" in error === true && error["name"] === "NotFoundError"))) {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('No hardware wallet was selected.')) + ((Common.isPopup() === true) ? Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to open this extension in a tab or window if it\'s not able to connect to a hardware wallet.')) : ""));
											}
											
											// Otherwise check if error was a connection error
											else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
											
												// Check if is an extension
												if(Common.isExtension() === true) {
											
													// Reject error
													reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this extension can connect to it.')));
												}
												
												// Otherwise check if is an app
												else if(Common.isApp() === true) {
												
													// Reject error
													reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this app can connect to it.')));
												}
												
												// Otherwise
												else {
												
													// Reject error
													reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this site can connect to it.')));
												}
											}
											
											// Otherwise check if error was an invalid state error
											else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.INVALID_STATE_ERROR_CODE) || ("name" in error === true && error["name"] === "InvalidStateError"))) {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('That hardware wallet is currently in use.')));
											}
											
											// Otherwise
											else {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')));
											}
										});
									}
								}
								
								// Otherwise
								else {
								
									// Return connecting to provided hardware wallet descriptor
									return HardwareWalletUsbTransport.request(hardwareWalletDescriptor).then(function(transport) {
									
										// Set connection type to USB connection type
										self.connectionType = HardwareWallet.USB_CONNECTION_TYPE;
									
										// Resolve transport
										resolve(transport);
										
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')));
									});
								}
							});
						};
						
						// Return gwetting hardware wallet transport
						return getHardwareWalletTransport().then(function(transport) {
						
							// Set transport
							self.transport = transport;
							
							// Get product name
							var productName = self.transport["deviceModel"]["productName"];
							
							// Get minimum compatible version
							var minimumCompatibleVersion = self.getMinimumCompatibleVersion();
							
							// Check transport's type
							switch(self.transport.type) {
							
								// Ledger type
								case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
							
									// Set hardware type to Ledger hardware type
									self.hardwareType = HardwareWallet.LEDGER_HARDWARE_TYPE;
									
									// Break
									break;
								
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
							
									// Set hardware type to Trezor hardware type
									self.hardwareType = HardwareWallet.TREZOR_HARDWARE_TYPE;
									
									// Break
									break;
							}
							
							// Set connected
							self.connected = true;
							
							// Transport on disconnect
							self.transport.on("disconnect", function() {
							
								// Obtain exclusive lock
								self.obtainExclusiveLock().then(function() {
								
									// Check if connected
									if(self.isConnected() === true) {
									
										// Clear connected
										self.connected = false;
										
										// Set transport to no transport
										self.transport = HardwareWallet.NO_TRANSPORT;
									
										// Trigger disconnect event
										$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
									}
										
									// Release exclusive lock
									self.releaseExclusiveLock();
								});
							});
							
							// Check transport's type
							switch(self.transport.type) {
							
								// Ledger type
								case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
							
									// Return requesting getting the application information from the hardware wallet
									return self.send(HardwareWalletDefinitions.LEDGER_GET_APPLICATION_INFORMATION_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred).then(function(response) {
									
										// Check if response contains an application name length
										if(response["length"] >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]) {
										
											// Get application name length
											var applicationNameLength = response[Uint8Array["BYTES_PER_ELEMENT"]];
											
											// Check if response contains an application name
											if(response["length"] >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength) {
											
												// Set error occured to false
												var errorOccurred = false;
												
												// Try
												try {
													// Get application name from the response
													var applicationName = (new TextDecoder("utf-8", {"fatal": true})).decode(response.subarray(Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"], Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength));
												}
												
												// Catch error
												catch(error) {
												
													// Set error occurred
													errorOccurred = true;
												}
												
												// Check if error didn't occur and application name is valid
												if(errorOccurred === false && applicationName === HardwareWallet.APPLICATION_NAME) {
												
													// Check if response contains an application version length
													if(response["length"] >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"]) {
													
														// Get application version length
														var applicationVersionLength = response[Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength];
														
														// Check if response contains an application version
														if(response["length"] >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"] + applicationVersionLength) {
														
															// Try
															try {
															
																// Get application version from the response
																var applicationVersion = (new TextDecoder("utf-8", {"fatal": true})).decode(response.subarray(Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"], Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"] + applicationVersionLength));
															}
															
															// Catch error
															catch(error) {
															
																// Set error occurred
																errorOccurred = true;
															}
															
															// Check if error didn't occur and application version is compatible
															if(errorOccurred === false && HardwareWallet.isCompatibleVersion(applicationVersion, minimumCompatibleVersion) === true) {
															
																// Return requesting getting the seed cookie from the hardware wallet
																return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_SEED_COOKIE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																
																	// Coin type
																	"Coin Type": Consensus.getWalletType(),
																	
																	// Network type
																	"Network Type": Consensus.getNetworkType(),
																	
																	// Account
																	"Account": new BigNumber(HardwareWallet.ACCOUNT)
																	
																}, HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred).then(function(response) {
																
																	// Check if response is valid
																	if(response["length"] === HardwareWallet.SEED_COOKIE_LENGTH) {
																	
																		// Get seed cookie from response
																		self.seedCookie = response;
																		
																		// Release exclusive lock
																		self.releaseExclusiveLock();
																
																		// Resolve
																		resolve();
																	}
																	
																	// Otherwise
																	else {
																	
																		// Return closing transport and catch errors
																		return self.transport.close().catch(function(error) {
																		
																		// Finally
																		}).finally(function() {
																		
																			// Clear connected
																			self.connected = false;
																		
																			// Set transport to no transport
																			self.transport = HardwareWallet.NO_TRANSPORT;
																			
																			// Trigger disconnect event
																			$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																		
																			// Release exclusive lock
																			self.releaseExclusiveLock();
																		
																			// Reject error
																			reject(Message.createText(Language.getDefaultTranslation('Getting the seed cookie from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
																		});
																	}
																
																// Catch errors
																}).catch(function(error) {
																
																	// Return closing transport and catch errors
																	return self.transport.close().catch(function(error) {
																	
																	// Finally
																	}).finally(function() {
																	
																		// Clear connected
																		self.connected = false;
																	
																		// Set transport to no transport
																		self.transport = HardwareWallet.NO_TRANSPORT;
																		
																		// Trigger disconnect event
																		$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																	
																		// Release exclusive lock
																		self.releaseExclusiveLock();
																		
																		// Check if error is canceled
																		if(error === Common.CANCELED_ERROR) {
																		
																			// Reject error
																			reject(error);
																		}
																		
																		// Otherwise check if error is disconnected error
																		else if(error === HardwareWallet.DISCONNECTED_ERROR) {
																		
																			// Reject error
																			reject(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.')));
																		}
																		
																		// Otherwise
																		else {
																	
																			// Reject error
																			reject(Message.createText(Language.getDefaultTranslation('Getting the seed cookie from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
																		}
																	});
																});
															}
															
															// Otherwise
															else {
															
																// Return closing transport and catch errors
																return self.transport.close().catch(function(error) {
																
																// Finally
																}).finally(function() {
																
																	// Clear connected
																	self.connected = false;
																
																	// Set transport to no transport
																	self.transport = HardwareWallet.NO_TRANSPORT;
																	
																	// Trigger disconnect event
																	$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																
																	// Release exclusive lock
																	self.releaseExclusiveLock();
																
																	// Reject error
																	reject(Message.createText(Language.getDefaultTranslation('The app on that %1$x hardware wallet isn\'t compatible. Update the app on the hardware wallet to version %2$v or newer to continue.'), [productName, minimumCompatibleVersion]));
																});
															}
														}
														
														// Otherwise
														else {
														
															// Return closing transport and catch errors
															return self.transport.close().catch(function(error) {
															
															// Finally
															}).finally(function() {
															
																// Clear connected
																self.connected = false;
															
																// Set transport to no transport
																self.transport = HardwareWallet.NO_TRANSPORT;
																
																// Trigger disconnect event
																$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
															
																// Release exclusive lock
																self.releaseExclusiveLock();
															
																// Reject error
																reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
															});
														}
													}
													
													// Otherwise
													else {
													
														// Return closing transport and catch errors
														return self.transport.close().catch(function(error) {
														
														// Finally
														}).finally(function() {
														
															// Clear connected
															self.connected = false;
														
															// Set transport to no transport
															self.transport = HardwareWallet.NO_TRANSPORT;
															
															// Trigger disconnect event
															$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
														
															// Release exclusive lock
															self.releaseExclusiveLock();
														
															// Reject error
															reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
														});
													}
												}
												
												// Otherwise
												else {
												
													// Return closing transport and catch errors
													return self.transport.close().catch(function(error) {
													
													// Finally
													}).finally(function() {
													
														// Clear connected
														self.connected = false;
													
														// Set transport to no transport
														self.transport = HardwareWallet.NO_TRANSPORT;
														
														// Trigger disconnect event
														$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
													
														// Release exclusive lock
														self.releaseExclusiveLock();
													
														// Reject error
														reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
													});
												}
											}
											
											// Otherwise
											else {
											
												// Return closing transport and catch errors
												return self.transport.close().catch(function(error) {
												
												// Finally
												}).finally(function() {
												
													// Clear connected
													self.connected = false;
												
													// Set transport to no transport
													self.transport = HardwareWallet.NO_TRANSPORT;
													
													// Trigger disconnect event
													$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
												
													// Release exclusive lock
													self.releaseExclusiveLock();
												
													// Reject error
													reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
												});
											}
										}
										
										// Otherwise
										else {
										
											// Return closing transport and catch errors
											return self.transport.close().catch(function(error) {
											
											// Finally
											}).finally(function() {
											
												// Clear connected
												self.connected = false;
											
												// Set transport to no transport
												self.transport = HardwareWallet.NO_TRANSPORT;
												
												// Trigger disconnect event
												$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
											
												// Release exclusive lock
												self.releaseExclusiveLock();
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
											});
										}
									
									// Catch errors
									}).catch(function(error) {
									
										// Return closing transport and catch errors
										return self.transport.close().catch(function(error) {
										
										// Finally
										}).finally(function() {
										
											// Clear connected
											self.connected = false;
										
											// Set transport to no transport
											self.transport = HardwareWallet.NO_TRANSPORT;
											
											// Trigger disconnect event
											$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
										
											// Release exclusive lock
											self.releaseExclusiveLock();
											
											// Check if error is canceled
											if(error === Common.CANCELED_ERROR) {
											
												// Reject error
												reject(error);
											}
											
											// Otherwise check if error is disconnected error
											else if(error === HardwareWallet.DISCONNECTED_ERROR) {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.')));
											}
											
											// Otherwise
											else {
										
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText((failOnLock === false) ? Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.') : Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
											}
										});
									});
								
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
								
									// Return requesting initializing on the hardware wallet
									return self.send(HardwareWalletDefinitions.TREZOR_INITIALIZE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, HardwareWalletDefinitions.TREZOR_FEATURES_MESSAGE_TYPE, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred).then(function(response) {
									
										// Check if response contains a major version, minor version, patch version, pin protection, passphrase protection, initialized, unlocked, and model
										if(response["length"] >= Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]) {
									
											// Get major version
											var majorVersion = parseInt(Common.toHexString(response.subarray(0, Uint32Array["BYTES_PER_ELEMENT"])), Common.HEX_NUMBER_BASE);
											
											// Get minor version
											var minorVersion = parseInt(Common.toHexString(response.subarray(Uint32Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"])), Common.HEX_NUMBER_BASE);
											
											// Get patch version
											var patchVersion = parseInt(Common.toHexString(response.subarray(Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"])), Common.HEX_NUMBER_BASE);
											
											// Get firmware version
											var firmwareVersion = majorVersion.toFixed() + "." + minorVersion.toFixed() + "." + patchVersion.toFixed();
											
											// Get model length
											var modelLength = response[Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]];
											
											// Check if response contains a model and capabilities
											if(response["length"] >= Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + modelLength + Uint8Array["BYTES_PER_ELEMENT"]) {
											
												// Set error occured to false
												var errorOccurred = false;
												
												// Try
												try {
												
													// Get model
													var model = (new TextDecoder("utf-8", {"fatal": true})).decode(response.subarray(Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + modelLength));
												}
												
												// Catch error
												catch(error) {
												
													// Set error occurred
													errorOccurred = true;
												}
												
												// Check if error didn't occur
												if(errorOccurred === false) {
												
													// Check model
													switch(model) {
													
														// One
														case "1":
														
															// Update transport's product name to include model
															self.transport["deviceModel"]["productName"] += " Model One";
															
															// Break
															break;
														
														// T
														case "T":
														
															// Update transport's product name to include model
															self.transport["deviceModel"]["productName"] += " Model T";
															
															// Break
															break;
														
														// Safe 3, Safe 5, or default
														case "Safe 3":
														case "Safe 5":
														default:
														
															// Update transport's product name to include model
															self.transport["deviceModel"]["productName"] += " " + model;
															
															// Break
															break;
													}
												
													// Update product name
													productName = self.transport["deviceModel"]["productName"];
													
													// Update minimum compatible version
													minimumCompatibleVersion = self.getMinimumCompatibleVersion();
													
													// Check if firmware version is compatible
													if(HardwareWallet.isCompatibleVersion(firmwareVersion, minimumCompatibleVersion) === true) {
													
														// Get capabilities length
														var capabilitiesLength = response[Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + modelLength];
														
														// Check if response contains capabilities and passphrase always on device
														if(response["length"] >= Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + modelLength + Uint8Array["BYTES_PER_ELEMENT"] + capabilitiesLength + Uint8Array["BYTES_PER_ELEMENT"]) {
														
															// Get capabilities
															var capabilities = response.subarray(Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + modelLength + Uint8Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + modelLength + Uint8Array["BYTES_PER_ELEMENT"] + capabilitiesLength);
															
															// Check if device is MimbleWimble Coin capable
															if(capabilities.indexOf(HardwareWallet.MIMBLEWIMBLE_COIN_CAPABLE) !== Common.INDEX_NOT_FOUND) {
															
																// Get initialized
																var initialized = response[Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]] !== 0;
																
																// Check if device is initialized
																if(initialized === true) {
																
																	// Get pin enabled
																	var pinEnabled = response[Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"]] !== 0;
																	
																	// Get unlocked
																	var unlocked = response[Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]] !== 0;
																	
																	// Get passphrase enabled
																	var passphraseEnabled = response[Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]] !== 0;
																	
																	// Get passphrase always on device
																	var passphraseAlwaysOnDevice = response[Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint32Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + modelLength + Uint8Array["BYTES_PER_ELEMENT"] + capabilitiesLength] !== 0;
																	
																	// Check if not set to fail on lock, pin isn't enabled, or device is unlocked
																	if(failOnLock === false || pinEnabled === false || unlocked === true) {
																	
																		// Check if not set to fail on lock, passphrase isn't enabled, or passphrase always on device isn't enabled
																		if(failOnLock === false || passphraseEnabled === false || passphraseAlwaysOnDevice === false) {
																
																			// Return requesting getting the seed cookie from the hardware wallet
																			return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_SEED_COOKIE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																			
																				// Coin type
																				"Coin Type": Consensus.getWalletType(),
																				
																				// Network type
																				"Network Type": Consensus.getNetworkType(),
																				
																				// Account
																				"Account": new BigNumber(HardwareWallet.ACCOUNT)
																				
																			}, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_SEED_COOKIE_MESSAGE_TYPE, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred).then(function(response) {
																			
																				// Check if response is valid
																				if(response["length"] === HardwareWallet.SEED_COOKIE_LENGTH) {
																				
																					// Get seed cookie from response
																					self.seedCookie = response;
																					
																					// Release exclusive lock
																					self.releaseExclusiveLock();
																			
																					// Resolve
																					resolve();
																				}
																				
																				// Otherwise
																				else {
																				
																					// Return closing transport and catch errors
																					return self.transport.close().catch(function(error) {
																					
																					// Finally
																					}).finally(function() {
																					
																						// Clear connected
																						self.connected = false;
																					
																						// Set transport to no transport
																						self.transport = HardwareWallet.NO_TRANSPORT;
																						
																						// Trigger disconnect event
																						$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																					
																						// Release exclusive lock
																						self.releaseExclusiveLock();
																					
																						// Reject error
																						reject(Message.createText(Language.getDefaultTranslation('Getting the seed cookie from that %1$x hardware wallet failed.'), [productName]));
																					});
																				}
																			
																			// Catch errors
																			}).catch(function(error) {
																			
																				// Return closing transport and catch errors
																				return self.transport.close().catch(function() {
																				
																				// Finally
																				}).finally(function() {
																				
																					// Clear connected
																					self.connected = false;
																				
																					// Set transport to no transport
																					self.transport = HardwareWallet.NO_TRANSPORT;
																					
																					// Trigger disconnect event
																					$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																				
																					// Release exclusive lock
																					self.releaseExclusiveLock();
																					
																					// Check if error is canceled
																					if(error === Common.CANCELED_ERROR) {
																					
																						// Reject error
																						reject(error);
																					}
																					
																					// Otherwise check if error is disconnected error
																					else if(error === HardwareWallet.DISCONNECTED_ERROR) {
																					
																						// Reject error
																						reject(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.')));
																					}
																					
																					// Otherwise
																					else {
																					
																						// Check if failure occurred
																						if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
																					
																							// Try
																							try {
																							
																								// Decode error
																								var decodedError = self.decode(error["Message Type"], error["Data"], HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE);
																							}
																							
																							// Catch errors
																							catch(decodeError) {
																							
																								// Set error occurred
																								errorOccurred = true;
																							}
																							
																							// Check if an error didn't occur
																							if(errorOccurred === false) {
																							
																								// Check if user rejected the request
																								if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
																								
																									// Reject canceled error
																									reject(Common.CANCELED_ERROR);
																									
																									// Return
																									return;
																								}
																							}
																						}
																				
																						// Reject error
																						reject(Message.createText(Language.getDefaultTranslation('Getting the seed cookie from that %1$x hardware wallet failed.'), [productName]));
																					}
																				});
																			});
																		}
																	
																		// Otherwise
																		else {
																		
																			// Return closing transport and catch errors
																			return self.transport.close().catch(function(error) {
																			
																			// Finally
																			}).finally(function() {
																			
																				// Clear connected
																				self.connected = false;
																			
																				// Set transport to no transport
																				self.transport = HardwareWallet.NO_TRANSPORT;
																				
																				// Trigger disconnect event
																				$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																			
																				// Release exclusive lock
																				self.releaseExclusiveLock();
																			
																				// Reject error
																				reject(Message.createText(Language.getDefaultTranslation('That %1$x hardware wallet is locked. Unlock the hardware wallet to continue.'), [productName]));
																			});
																		}
																	}
																	
																	// Otherwise
																	else {
																	
																		// Return closing transport and catch errors
																		return self.transport.close().catch(function(error) {
																		
																		// Finally
																		}).finally(function() {
																		
																			// Clear connected
																			self.connected = false;
																		
																			// Set transport to no transport
																			self.transport = HardwareWallet.NO_TRANSPORT;
																			
																			// Trigger disconnect event
																			$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																		
																			// Release exclusive lock
																			self.releaseExclusiveLock();
																		
																			// Reject error
																			reject(Message.createText(Language.getDefaultTranslation('That %1$x hardware wallet is locked. Unlock the hardware wallet to continue.'), [productName]));
																		});
																	}
																}
																
																// Otherwise
																else {
																
																	// Return closing transport and catch errors
																	return self.transport.close().catch(function(error) {
																	
																	// Finally
																	}).finally(function() {
																	
																		// Clear connected
																		self.connected = false;
																	
																		// Set transport to no transport
																		self.transport = HardwareWallet.NO_TRANSPORT;
																		
																		// Trigger disconnect event
																		$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																	
																		// Release exclusive lock
																		self.releaseExclusiveLock();
																	
																		// Reject error
																		reject(Message.createText(Language.getDefaultTranslation('That %1$x hardware wallet isn\'t initialized. Initialize the hardware wallet to continue.'), [productName]));
																	});
																}
															}
															
															// Otherwise
															else {
															
																// Return closing transport and catch errors
																return self.transport.close().catch(function(error) {
																
																// Finally
																}).finally(function() {
																
																	// Clear connected
																	self.connected = false;
																
																	// Set transport to no transport
																	self.transport = HardwareWallet.NO_TRANSPORT;
																	
																	// Trigger disconnect event
																	$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
																
																	// Release exclusive lock
																	self.releaseExclusiveLock();
																
																	// Reject error
																	reject(Message.createText(Language.getDefaultTranslation('The firmware on that %1$x hardware wallet isn\'t compatible. Install a compatible firmware on the hardware wallet to continue.'), [productName]));
																});
															}
														}
														
														// Otherwise
														else {
														
															// Return closing transport and catch errors
															return self.transport.close().catch(function(error) {
															
															// Finally
															}).finally(function() {
															
																// Clear connected
																self.connected = false;
															
																// Set transport to no transport
																self.transport = HardwareWallet.NO_TRANSPORT;
																
																// Trigger disconnect event
																$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
															
																// Release exclusive lock
																self.releaseExclusiveLock();
															
																// Reject error
																reject(Message.createText(Language.getDefaultTranslation('Getting the features from that %1$x hardware wallet failed.'), [productName]));
															});
														}
													}
													
													// Otherwise
													else {
													
														// Return closing transport and catch errors
														return self.transport.close().catch(function(error) {
														
														// Finally
														}).finally(function() {
														
															// Clear connected
															self.connected = false;
														
															// Set transport to no transport
															self.transport = HardwareWallet.NO_TRANSPORT;
															
															// Trigger disconnect event
															$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
														
															// Release exclusive lock
															self.releaseExclusiveLock();
														
															// Reject error
															reject(Message.createText(Language.getDefaultTranslation('The firmware on that %1$x hardware wallet isn\'t compatible. Update the firmware on the hardware wallet to version %2$v or newer to continue.'), [productName, minimumCompatibleVersion]));
														});
													}
												}
												
												// Otherwise
												else {
												
													// Return closing transport and catch errors
													return self.transport.close().catch(function(error) {
													
													// Finally
													}).finally(function() {
													
														// Clear connected
														self.connected = false;
													
														// Set transport to no transport
														self.transport = HardwareWallet.NO_TRANSPORT;
														
														// Trigger disconnect event
														$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
													
														// Release exclusive lock
														self.releaseExclusiveLock();
													
														// Reject error
														reject(Message.createText(Language.getDefaultTranslation('Getting the features from that %1$x hardware wallet failed.'), [productName]));
													});
												}
											}
											
											// Otherwise
											else {
											
												// Return closing transport and catch errors
												return self.transport.close().catch(function(error) {
												
												// Finally
												}).finally(function() {
												
													// Clear connected
													self.connected = false;
												
													// Set transport to no transport
													self.transport = HardwareWallet.NO_TRANSPORT;
													
													// Trigger disconnect event
													$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
												
													// Release exclusive lock
													self.releaseExclusiveLock();
												
													// Reject error
													reject(Message.createText(Language.getDefaultTranslation('Getting the features from that %1$x hardware wallet failed.'), [productName]));
												});
											}
										}
										
										// Otherwise
										else {
										
											// Return closing transport and catch errors
											return self.transport.close().catch(function(error) {
											
											// Finally
											}).finally(function() {
											
												// Clear connected
												self.connected = false;
											
												// Set transport to no transport
												self.transport = HardwareWallet.NO_TRANSPORT;
												
												// Trigger disconnect event
												$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
											
												// Release exclusive lock
												self.releaseExclusiveLock();
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('Getting the features from that %1$x hardware wallet failed.'), [productName]));
											});
										}
										
									// Catch errors
									}).catch(function(error) {
									
										// Return closing transport and catch errors
										return self.transport.close().catch(function() {
										
										// Finally
										}).finally(function() {
										
											// Clear connected
											self.connected = false;
										
											// Set transport to no transport
											self.transport = HardwareWallet.NO_TRANSPORT;
											
											// Trigger disconnect event
											$(self).trigger(HardwareWallet.DISCONNECT_EVENT);
										
											// Release exclusive lock
											self.releaseExclusiveLock();
											
											// Check if error is canceled
											if(error === Common.CANCELED_ERROR) {
											
												// Reject error
												reject(error);
											}
											
											// Otherwise check if error is disconnected error
											else if(error === HardwareWallet.DISCONNECTED_ERROR) {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.')));
											}
											
											// Otherwise
											else {
											
												// Check if failure occurred
												if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
											
													// Initialize error occurred
													var errorOccurred = false;
													
													// Try
													try {
													
														// Decode error
														var decodedError = self.decode(error["Message Type"], error["Data"], HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE);
													}
													
													// Catch errors
													catch(decodeError) {
													
														// Set error occurred
														errorOccurred = true;
													}
													
													// Check if an error didn't occur
													if(errorOccurred === false) {
													
														// Check if user rejected the request
														if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
														
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
															
															// Return
															return;
														}
													}
												}
										
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('Getting the features from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('You may need to disconnect and reconnect the hardware wallet to connect to it.')));
											}
										});
									});
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject error
						reject(Message.createText(Language.getDefaultTranslation('The hardware wallet is already connected.')));
					}
				});
			});
		}
		
		// Get public key
		getPublicKey() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Get product name
						var productName = self.transport["deviceModel"]["productName"];
						
						// Return requesting getting the root public key from the hardware wallet
						return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ROOT_PUBLIC_KEY_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
						
							// Coin type
							"Coin Type": Consensus.getWalletType(),
							
							// Network type
							"Network Type": Consensus.getNetworkType(),
							
							// Account
							"Account": new BigNumber(HardwareWallet.ACCOUNT)
						
						}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ROOT_PUBLIC_KEY_MESSAGE_TYPE], HardwareWallet.NO_TEXT, [], false, true, true, Common.NO_CANCEL_OCCURRED).then(function(response) {
						
							// Check if response is valid
							if(response["length"] === Crypto.SECP256K1_PUBLIC_KEY_LENGTH && Secp256k1Zkp.isValidPublicKey(response) === true) {
							
								// Get root public key from response
								self.rootPublicKey = response;
								
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Resolve root public key
								resolve(self.getRootPublicKey());
							}
							
							// Otherwise
							else {
							
								// Securely clear response
								response.fill(0);
							
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Check transport's type
								switch(self.transport.type) {
								
									// Ledger type
									case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
							
										// Reject error
										reject(Message.createText(Language.getDefaultTranslation('Getting the root public key from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
										
										// Break
										break;
									
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
							
										// Reject error
										reject(Message.createText(Language.getDefaultTranslation('Getting the root public key from that %1$x hardware wallet failed.'), [productName]));
										
										// Break
										break;
								}
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
							
							// Check if error is disconnected error
							if(error === HardwareWallet.DISCONNECTED_ERROR) {
							
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.')));
							}
							
							// Otherwise
							else {
							
								// Check transport's type
								switch(self.transport.type) {
								
									// Ledger type
									case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
									
										// Check if user rejected the request
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.LEDGER_USER_REJECTED_MESSAGE_TYPE) {
										
											// Reject error
											reject(Message.createText(Language.getDefaultTranslation('Exporting the root public key on that %1$x hardware wallet was denied.'), [productName]));
										}
										
										// Otherwise
										else {
							
											// Reject error
											reject(Message.createText(Language.getDefaultTranslation('Getting the root public key from that %1$x hardware wallet failed.'), [productName]) + Message.createText(Language.getDefaultTranslation('(?<=.) ')) + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
										}
										
										// Break
										break;
									
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject error
													reject(Message.createText(Language.getDefaultTranslation('Exporting the root public key on that %1$x hardware wallet was denied.'), [productName]));
													
													// Return
													return;
												}
											}
										}
										
										// Reject error
										reject(Message.createText(Language.getDefaultTranslation('Getting the root public key from that %1$x hardware wallet failed.'), [productName]));
										
										// Break
										break;
								}
							}
						});
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject error
						reject(Message.createText(Language.getDefaultTranslation('That hardware wallet was disconnected.')));
					}
				});
			});
		}
		
		// Get commit
		getCommit(value, identifier, switchType, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting getting the commit from the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_COMMITMENT_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Identifier
								"Identifier": identifier.getValue(),
								
								// Value
								"Value": value,
								
								// Switch type
								"Switch Type": switchType
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_COMMITMENT_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] === Crypto.COMMIT_LENGTH && Secp256k1Zkp.isValidCommit(response) === true) {
								
									// Get commit from response
									var commit = response;
									
									// Resolve commit
									resolve(commit);
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
							
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Get proof
		getProof(value, identifier, switchType, message, proofBuilder, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting getting the commit from the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_COMMITMENT_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Identifier
								"Identifier": identifier.getValue(),
								
								// Value
								"Value": value,
								
								// Switch type
								"Switch Type": switchType
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_COMMITMENT_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] === Crypto.COMMIT_LENGTH && Secp256k1Zkp.isValidCommit(response) === true) {
								
									// Get commit from response
									var commit = response;
									
									// Return getting rewind nonce from the proof builder
									return proofBuilder.rewindNonce(commit).then(function(rewindNonce) {
									
										// Try
										try {
									
											// Return requesting getting the proof components from the hardware wallet
											return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_BULLETPROOF_COMPONENTS_MESSAGE_TYPE, message, HardwareWallet.NO_PARAMETER, {
											
												// Coin type
												"Coin Type": Consensus.getWalletType(),
												
												// Network type
												"Network Type": Consensus.getNetworkType(),
												
												// Message type
												"Parameter One": message,
												
												// Account
												"Account": new BigNumber(HardwareWallet.ACCOUNT),
												
												// Identifier
												"Identifier": identifier.getValue(),
												
												// Value
												"Value": value,
												
												// Switch type
												"Switch Type": switchType
												
											}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_BULLETPROOF_COMPONENTS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
											
												// Check if response is valid
												if(response["length"] === Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH && (Secp256k1Zkp.isValidSecretKey(response.subarray(0, Crypto.TAU_X_LENGTH)) === true || Common.arraysAreEqual(response.subarray(0, Crypto.TAU_X_LENGTH), Crypto.ZERO_SECRET_KEY) === true) && Secp256k1Zkp.isValidPublicKey(response.subarray(Crypto.TAU_X_LENGTH, Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH)) === true && Secp256k1Zkp.isValidPublicKey(response.subarray(Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH, Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH)) === true) {
												
													// Get tau x from response
													var tauX = response.subarray(0, Crypto.TAU_X_LENGTH);
													
													// Get t one from response
													var tOne = response.subarray(Crypto.TAU_X_LENGTH, Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH);
													
													// Get t two from response
													var tTwo = response.subarray(Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH, Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH);
															
													// Try
													try {
												
														// Get proof message from identifier and switch type
														var proofMessage = proofBuilder.proofMessage(identifier, switchType);
													}
													
													// Catch errors
													catch(error) {
													
														// Securely clear rewind nonce
														rewindNonce.fill(0);
													
														// Reject error
														reject(error);
														
														// Return
														return;
													}
													
													// Check if creating proof with the tau x, t one, t two, commit, value, rewind nonce, and proof message was successful
													var proof = Secp256k1Zkp.createBulletproofBlindless(tauX, tOne, tTwo, commit, value.toFixed(), rewindNonce, new Uint8Array([]), proofMessage);
													
													if(proof !== Secp256k1Zkp.OPERATION_FAILED && Secp256k1Zkp.verifyBulletproof(proof, commit, new Uint8Array([])) === true) {
													
														// Securely clear rewind nonce
														rewindNonce.fill(0);
													
														// Resolve proof
														resolve(proof);
													}
													
													// Otherwise
													else {
													
														// Securely clear rewind nonce
														rewindNonce.fill(0);
														
														// Reject
														reject();
													}
												}
									
												// Otherwise
												else {
												
													// Securely clear rewind nonce
													rewindNonce.fill(0);
												
													// Reject
													reject();
												}
											
											// Catch errors
											}).catch(function(error) {
											
												// Securely clear rewind nonce
												rewindNonce.fill(0);
											
												// Release exclusive lock
												self.releaseExclusiveLock();
												
												// Check transport's type
												switch(self.transport.type) {
												
													// Trezor type
													case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
													
														// Check if failure occurred
														if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
													
															// Initialize error occurred
															var errorOccurred = false;
															
															// Try
															try {
															
																// Decode error
																var decodedError = self.decode(error["Message Type"], error["Data"]);
															}
															
															// Catch errors
															catch(decodeError) {
															
																// Set error occurred
																errorOccurred = true;
															}
															
															// Check if an error didn't occur
															if(errorOccurred === false) {
															
																// Check if user rejected the request
																if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
																
																	// Reject canceled error
																	reject(Common.CANCELED_ERROR);
																	
																	// Return
																	return;
																}
															}
														}
														
														// Break
														break;
												}
											
												// Reject error
												reject(error);
											});
										}
										
										// Catch errors
										catch(error) {
										
											// Securely clear rewind nonce
											rewindNonce.fill(0);
										
											// Release exclusive lock
											self.releaseExclusiveLock();
										
											// Reject error
											reject(error);
										}
									
									// Catch errors
									}).catch(function(error) {
									
										// Release exclusive lock
										self.releaseExclusiveLock();
									
										// Reject error
										reject(error);
									});
								}
								
								// Otherwise
								else {
								
									// Release exclusive lock
									self.releaseExclusiveLock();
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Get Tor address
		getTorAddress(index, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting getting the Tor address from the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ADDRESS_MESSAGE_TYPE, HardwareWallet.TOR_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Address type
								"Parameter One": HardwareWallet.TOR_ADDRESS_TYPE,
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Index
								"Index": new BigNumber(index)
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ADDRESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] === ((self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE) ? Uint8Array["BYTES_PER_ELEMENT"] : 0) + Tor.ADDRESS_LENGTH) {
								
									// Try
									try {
									
										// Get Tor address from response
										var torAddress = (new TextDecoder("utf-8", {"fatal": true})).decode((self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE) ? response.subarray(Uint8Array["BYTES_PER_ELEMENT"]) : response);
									
										// Get public key from Tor address
										Tor.torAddressToPublicKey(torAddress);
									}
									
									// Catch errors
									catch(error) {
									
										// Reject error
										reject(error);
										
										// Return
										return;
									}
									
									// Resolve Tor address
									resolve(torAddress);
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
								
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Verify Tor address
		verifyTorAddress(index, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting verifying the Tor address on the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_VERIFY_ADDRESS_MESSAGE_TYPE, HardwareWallet.TOR_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Address type
								"Parameter One": HardwareWallet.TOR_ADDRESS_TYPE,
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Index
								"Index": new BigNumber(index)
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] === 0) {
								
									// Resolve
									resolve();
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Check transport's type
								switch(self.transport.type) {
								
									// Ledger type
									case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
									
										// Check if user rejected the request
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.LEDGER_USER_REJECTED_MESSAGE_TYPE) {
										
											// Reject user rejected error
											reject(HardwareWallet.USER_REJECTED_ERROR);
										}
										
										// Otherwise
										else {
									
											// Reject error
											reject(error);
										}
										
										// Break
										break;
									
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject user rejected error
													reject(HardwareWallet.USER_REJECTED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Reject error
										reject(error);
										
										// Break
										break;
								}
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Get MQS address
		getMqsAddress(index, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting getting the MQS address from the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ADDRESS_MESSAGE_TYPE, HardwareWallet.MQS_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Address type
								"Parameter One": HardwareWallet.MQS_ADDRESS_TYPE,
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Index
								"Index": new BigNumber(index)
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ADDRESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] === ((self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE) ? Uint8Array["BYTES_PER_ELEMENT"] : 0) + Mqs.ADDRESS_LENGTH) {
								
									// Try
									try {
									
										// Get MQS address from response
										var mqsAddress = (new TextDecoder("utf-8", {"fatal": true})).decode((self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE) ? response.subarray(Uint8Array["BYTES_PER_ELEMENT"]) : response);
									
										// Get public key from MQS address
										Mqs.mqsAddressToPublicKey(mqsAddress, Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE);
									}
									
									// Catch errors
									catch(error) {
									
										// Reject error
										reject(error);
										
										// Return
										return;
									}
									
									// Resolve MQS address
									resolve(mqsAddress);
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Verify MQS address
		verifyMqsAddress(index, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting verifying the MQS address on the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_VERIFY_ADDRESS_MESSAGE_TYPE, HardwareWallet.MQS_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Address type
								"Parameter One": HardwareWallet.MQS_ADDRESS_TYPE,
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Index
								"Index": new BigNumber(index)
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] === 0) {
								
									// Resolve
									resolve();
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check transport's type
								switch(self.transport.type) {
								
									// Ledger type
									case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
									
										// Check if user rejected the request
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.LEDGER_USER_REJECTED_MESSAGE_TYPE) {
										
											// Reject user rejected error
											reject(HardwareWallet.USER_REJECTED_ERROR);
										}
										
										// Otherwise
										else {
									
											// Reject error
											reject(error);
										}
										
										// Break
										break;
									
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject user rejected error
													reject(HardwareWallet.USER_REJECTED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Reject error
										reject(error);
										
										// Break
										break;
								}
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Get Slatepack address
		getSlatepackAddress(index, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting getting the Slatepack address from the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ADDRESS_MESSAGE_TYPE, HardwareWallet.SLATEPACK_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Address type
								"Parameter One": HardwareWallet.SLATEPACK_ADDRESS_TYPE,
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Index
								"Index": new BigNumber(index)
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ADDRESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] === ((self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE) ? Uint8Array["BYTES_PER_ELEMENT"] : 0) + Slatepack.ADDRESS_LENGTH) {
								
									// Try
									try {
									
										// Get Slatepack address from response
										var slatepackAddress = (new TextDecoder("utf-8", {"fatal": true})).decode((self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE) ? response.subarray(Uint8Array["BYTES_PER_ELEMENT"]) : response);
									
										// Get public key from Slatepack address
										Slatepack.slatepackAddressToPublicKey(slatepackAddress);
									}
									
									// Catch errors
									catch(error) {
									
										// Reject error
										reject(error);
										
										// Return
										return;
									}
									
									// Resolve Slatepack address
									resolve(slatepackAddress);
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Verify Slatepack address
		verifySlatepackAddress(index, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting verifying the Slatepack address on the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_VERIFY_ADDRESS_MESSAGE_TYPE, HardwareWallet.SLATEPACK_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Address type
								"Parameter One": HardwareWallet.SLATEPACK_ADDRESS_TYPE,
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Index
								"Index": new BigNumber(index)
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] === 0) {
								
									// Resolve
									resolve();
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check transport's type
								switch(self.transport.type) {
								
									// Ledger type
									case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
									
										// Check if user rejected the request
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.LEDGER_USER_REJECTED_MESSAGE_TYPE) {
										
											// Reject user rejected error
											reject(HardwareWallet.USER_REJECTED_ERROR);
										}
										
										// Otherwise
										else {
									
											// Reject error
											reject(error);
										}
										
										// Break
										break;
									
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject user rejected error
													reject(HardwareWallet.USER_REJECTED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Reject error
										reject(error);
										
										// Break
										break;
								}
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Decrypt slate
		decryptSlate(index, slate, address, nonce, salt = HardwareWallet.NO_SALT, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Check if slate is valid
						if(slate["length"] > Slatepack.TAG_LENGTH) {
						
							// Try
							try {
						
								// Return requesting start decrypting on the hardware wallet
								return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_START_DECRYPTING_SLATE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
								
									// Coin type
									"Coin Type": Consensus.getWalletType(),
									
									// Network type
									"Network Type": Consensus.getNetworkType(),
									
									// Account
									"Account": new BigNumber(HardwareWallet.ACCOUNT),
									
									// Index
									"Index": new BigNumber(index),
									
									// Nonce
									"Nonce": nonce,
									
									// Sender address or ephemeral X25519 public key
									"Sender Address Or Ephemeral X25519 Public Key": (new TextEncoder()).encode(address),
									
									// Salt or encrypted file key
									"Salt Or Encrypted File Key": (salt !== HardwareWallet.NO_SALT) ? salt : new Uint8Array([]),
									
									// Payload nonce
									"Payload Nonce": new Uint8Array([])
									
								}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
								
									// Check if response is valid
									if(response["length"] === 0) {
									
										// Get encrypted data from slate
										var encryptedData = slate.subarray(0, slate["length"] - Slatepack.TAG_LENGTH);
										
										// Set decrypt chunk
										var decryptChunk = new Promise(function(resolve, reject) {
										
											// Resolve
											resolve();
										});
										
										// Initialize decrypting chunks
										var decryptingChunks = [decryptChunk];
									
										// Go through all of the encrypted data chunks
										for(let i = 0; i < Math.ceil(encryptedData["length"] / HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE); ++i) {
										
											// Decrypt chunk after the previous chunk is decrypted
											decryptChunk = decryptChunk.then(function() {
											
												// Return promise
												return new Promise(function(resolve, reject) {
												
													// Return decrypting chunk on the hardware wallet
													return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_DECRYPTING_SLATE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
													
														// Data
														"Encrypted Data": encryptedData.subarray(i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE, Math.min(encryptedData["length"], i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE + HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE))
													
													}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_DECRYPTED_SLATE_DATA_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
													
														// Check if response is valid
														if(response["length"] > 0) {
														
															// Get decrypted data chunk from response
															var decryptedDataChunk = response;
															
															// Resolve decrypted data chunk
															resolve(decryptedDataChunk);
														}
														
														// Otherwise
														else {
														
															// Reject
															reject();
														}
														
													// Catch errors
													}).catch(function(error) {
													
														// Check transport's type
														switch(self.transport.type) {
														
															// Trezor type
															case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
															
																// Check if failure occurred
																if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
															
																	// Initialize error occurred
																	var errorOccurred = false;
																	
																	// Try
																	try {
																	
																		// Decode error
																		var decodedError = self.decode(error["Message Type"], error["Data"]);
																	}
																	
																	// Catch errors
																	catch(decodeError) {
																	
																		// Set error occurred
																		errorOccurred = true;
																	}
																	
																	// Check if an error didn't occur
																	if(errorOccurred === false) {
																	
																		// Check if user rejected the request
																		if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
																		
																			// Reject canceled error
																			reject(Common.CANCELED_ERROR);
																			
																			// Return
																			return;
																		}
																	}
																}
																
																// Break
																break;
														}
													
														// Reject error
														reject(error);
													});
												});
												
											// Catch errors
											}).catch(function(error) {
											
												// Return Promise
												return new Promise(function(resolve, reject) {
											
													// Reject error
													reject(error);
												});
											});
											
											// Append decrypting chunk to list
											decryptingChunks.push(decryptChunk);
										}
										
										// Return decrypting all chunks
										return Promise.all(decryptingChunks).then(function(decryptedDataChunks) {
										
											// Get tag from slate
											var tag = slate.subarray(slate["length"] - Slatepack.TAG_LENGTH);
										
											// Return requesting finish decrypting on the hardware wallet
											return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_DECRYPTING_SLATE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
											
												// Tag
												"Tag": tag
												
											}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_DECRYPTED_SLATE_AES_KEY_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
												
												// Check if response is valid
												if(response["length"] === Crypto.AES_KEY_LENGTH) {
												
													// Get AES key from response
													var aesKey = response;
													
													// Initialize AES decrypt chunks
													var aesDecryptChunks = [];
													
													// Go through all decrypted chunks
													for(var i = 1; i < decryptedDataChunks["length"]; ++i) {
													
														// Get decrypted data chunk
														let decryptedDataChunk = decryptedDataChunks[i];
														
														// Append decrypting AES chunk to list
														aesDecryptChunks.push(new Promise(function(resolve, reject) {
														
															// Return performing AES decryption on decrypted data chunk using the AES key
															return Crypto.aesDecrypt(decryptedDataChunk, aesKey).then(function(dataChunk) {
															
																// Resolve data chunk
																resolve(dataChunk);
																
															// Catch errors
															}).catch(function(error) {
															
																// Reject error
																reject(error);
															});
														}));
													}
													
													// Return waiting for all data chunks to be AES decrypted
													return Promise.all(aesDecryptChunks).then(function(dataChunks) {
													
														// Securely clear AES key
														aesKey.fill(0);
														
														// Resolve combined data chunks
														resolve(Common.mergeArrays(dataChunks));
													
													// Catch errors
													}).catch(function(error) {
													
														// Securely clear AES key
														aesKey.fill(0);
													
														// Reject error
														reject(error);
													});
												}
												
												// Otherwise
												else {
												
													// Reject
													reject();
												}
												
											// Catch errors
											}).catch(function(error) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
												
												// Check transport's type
												switch(self.transport.type) {
												
													// Trezor type
													case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
													
														// Check if failure occurred
														if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
													
															// Initialize error occurred
															var errorOccurred = false;
															
															// Try
															try {
															
																// Decode error
																var decodedError = self.decode(error["Message Type"], error["Data"]);
															}
															
															// Catch errors
															catch(decodeError) {
															
																// Set error occurred
																errorOccurred = true;
															}
															
															// Check if an error didn't occur
															if(errorOccurred === false) {
															
																// Check if user rejected the request
																if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
																
																	// Reject canceled error
																	reject(Common.CANCELED_ERROR);
																	
																	// Return
																	return;
																}
															}
														}
														
														// Break
														break;
												}
											
												// Reject error
												reject(error);
											});
										
										// Catch errors
										}).catch(function(error) {
										
											// Release exclusive lock
											self.releaseExclusiveLock();
										
											// Reject error
											reject(error);
										});
									}
									
									// Otherwise
									else {
									
										// Release exclusive lock
										self.releaseExclusiveLock();
									
										// Reject
										reject();
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Release exclusive lock
									self.releaseExclusiveLock();
									
									// Check transport's type
									switch(self.transport.type) {
									
										// Trezor type
										case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
										
											// Check if failure occurred
											if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
										
												// Initialize error occurred
												var errorOccurred = false;
												
												// Try
												try {
												
													// Decode error
													var decodedError = self.decode(error["Message Type"], error["Data"]);
												}
												
												// Catch errors
												catch(decodeError) {
												
													// Set error occurred
													errorOccurred = true;
												}
												
												// Check if an error didn't occur
												if(errorOccurred === false) {
												
													// Check if user rejected the request
													if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
														
														// Return
														return;
													}
												}
											}
											
											// Break
											break;
									}
								
									// Reject error
									reject(error);
								});
							}
							
							// Catch errors
							catch(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Reject error
								reject(error);
							}
						}
						
						// Otherwise
						else {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject
							reject();
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Encrypt slate
		encryptSlate(index, slate, address, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Check if slate is valid
						if(slate["length"] !== 0) {
						
							// Try
							try {
						
								// Return requesting start encrypting on the hardware wallet
								return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_START_ENCRYPTING_SLATE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
								
									// Coin type
									"Coin Type": Consensus.getWalletType(),
									
									// Network type
									"Network Type": Consensus.getNetworkType(),
									
									// Account
									"Account": new BigNumber(HardwareWallet.ACCOUNT),
									
									// Index
									"Index": new BigNumber(index),
									
									// Recipient address
									"Recipient Address": (new TextEncoder()).encode(address)
									
								}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_NONCE_AND_SALT_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
								
									// Check if response is valid
									if(response["length"] >= Slatepack.NONCE_LENGTH) {
									
										// Get nonce from response
										var nonce = response.subarray(0, Slatepack.NONCE_LENGTH);
									
										// Get decrypted data from slate
										var decryptedData = slate;
										
										// Set encrypt chunk
										var encryptChunk = new Promise(function(resolve, reject) {
										
											// Resolve
											resolve(new Uint8Array([]));
										});
										
										// Initialize encrypting chunks
										var encryptingChunks = [encryptChunk];
									
										// Go through all of the decrypted data chunks
										for(let i = 0; i < Math.ceil(decryptedData["length"] / HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE); ++i) {
										
											// Encrypt chunk after the previous chunk is encrypted
											encryptChunk = encryptChunk.then(function() {
											
												// Return promise
												return new Promise(function(resolve, reject) {
												
													// Return encrypting chunk on the hardware wallet
													return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_ENCRYPTING_SLATE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
													
														// Data
														"Data": decryptedData.subarray(i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE, Math.min(decryptedData["length"], i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE + HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE))
														
													}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_DATA_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
													
														// Check if response is valid
														if(response["length"] > 0) {
														
															// Get encrypted data chunk from response
															var encryptedDataChunk = response;
															
															// Resolve encrypted data chunk
															resolve(encryptedDataChunk);
														}
														
														// Otherwise
														else {
														
															// Reject
															reject();
														}
														
													// Catch errors
													}).catch(function(error) {
													
														// Check transport's type
														switch(self.transport.type) {
														
															// Trezor type
															case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
															
																// Check if failure occurred
																if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
															
																	// Initialize error occurred
																	var errorOccurred = false;
																	
																	// Try
																	try {
																	
																		// Decode error
																		var decodedError = self.decode(error["Message Type"], error["Data"]);
																	}
																	
																	// Catch errors
																	catch(decodeError) {
																	
																		// Set error occurred
																		errorOccurred = true;
																	}
																	
																	// Check if an error didn't occur
																	if(errorOccurred === false) {
																	
																		// Check if user rejected the request
																		if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
																		
																			// Reject canceled error
																			reject(Common.CANCELED_ERROR);
																			
																			// Return
																			return;
																		}
																	}
																}
																
																// Break
																break;
														}
														
														// Reject error
														reject(error);
													});
												});
												
											// Catch errors
											}).catch(function(error) {
											
												// Return Promise
												return new Promise(function(resolve, reject) {
											
													// Reject error
													reject(error);
												});
											});
											
											// Append encrypting chunk to list
											encryptingChunks.push(encryptChunk);
										}
										
										// Return encrypting all chunks
										return Promise.all(encryptingChunks).then(function(encryptedDataChunks) {
										
											// Return requesting finish encrypting on the hardware wallet
											return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_ENCRYPTING_SLATE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_TAG_AND_SIGNATURE_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
												
												// Check if response is valid
												if(response["length"] >= Slatepack.TAG_LENGTH) {
												
													// Get tag from response
													var tag = response.subarray(0, Slatepack.TAG_LENGTH);
													
													// Append the tag to the encrypted data chunks
													var encryptedData = Common.mergeArrays([
													
														// Encrypted data chunks
														Common.mergeArrays(encryptedDataChunks),
													
														// tag
														tag
													]);
													
													// Resolve nonce and encrypted data
													resolve([
													
														// Nonce
														nonce,
													
														// Encrypted data
														encryptedData
													]);
												}
												
												// Otherwise
												else {
												
													// Reject
													reject();
												}
												
											// Catch errors
											}).catch(function(error) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
												
												// Check transport's type
												switch(self.transport.type) {
												
													// Trezor type
													case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
													
														// Check if failure occurred
														if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
													
															// Initialize error occurred
															var errorOccurred = false;
															
															// Try
															try {
															
																// Decode error
																var decodedError = self.decode(error["Message Type"], error["Data"]);
															}
															
															// Catch errors
															catch(decodeError) {
															
																// Set error occurred
																errorOccurred = true;
															}
															
															// Check if an error didn't occur
															if(errorOccurred === false) {
															
																// Check if user rejected the request
																if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
																
																	// Reject canceled error
																	reject(Common.CANCELED_ERROR);
																	
																	// Return
																	return;
																}
															}
														}
														
														// Break
														break;
												}
											
												// Reject error
												reject(error);
											});
										
										// Catch errors
										}).catch(function(error) {
										
											// Release exclusive lock
											self.releaseExclusiveLock();
										
											// Reject error
											reject(error);
										});
									}
									
									// Otherwise
									else {
									
										// Release exclusive lock
										self.releaseExclusiveLock();
									
										// Reject
										reject();
									}
								
								// Catch errors
								}).catch(function(error) {
								
									// Release exclusive lock
									self.releaseExclusiveLock();
									
									// Check transport's type
									switch(self.transport.type) {
									
										// Trezor type
										case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
										
											// Check if failure occurred
											if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
										
												// Initialize error occurred
												var errorOccurred = false;
												
												// Try
												try {
												
													// Decode error
													var decodedError = self.decode(error["Message Type"], error["Data"]);
												}
												
												// Catch errors
												catch(decodeError) {
												
													// Set error occurred
													errorOccurred = true;
												}
												
												// Check if an error didn't occur
												if(errorOccurred === false) {
												
													// Check if user rejected the request
													if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
														
														// Return
														return;
													}
												}
											}
											
											// Break
											break;
									}
								
									// Reject error
									reject(error);
								});
							}
							
							// Catch errors
							catch(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Reject error
								reject(error);
							}
						}
						
						// Otherwise
						else {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject
							reject();
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Start transaction
		startTransaction(index, output, input, fee, secretNonceIndex = HardwareWallet.NO_SECRET_NONCE_INDEX, address = HardwareWallet.NO_ADDRESS, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return obtainined exclusive lock
				return self.obtainExclusiveLock().then(function() {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting starting transaction on the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_START_TRANSACTION_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
							
								// Coin type
								"Coin Type": Consensus.getWalletType(),
								
								// Network type
								"Network Type": Consensus.getNetworkType(),
								
								// Account
								"Account": new BigNumber(HardwareWallet.ACCOUNT),
								
								// Index
								"Index": new BigNumber(index),
								
								// Output
								"Output": output,
								
								// Input
								"Input": input,
								
								// Fee
								"Fee": fee,
								
								// Secret nonce index
								"Secret Nonce Index": secretNonceIndex,
								
								// Address
								"Address": (address !== HardwareWallet.NO_ADDRESS) ? (new TextEncoder()).encode(address) : new Uint8Array([])
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] === 0) {
								
									// Resolve
									resolve();
								}
								
								// Otherwise
								else {
								
									// Release exclusive lock
									self.releaseExclusiveLock();
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch error
						catch(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				});
			});
		}
		
		// Include output in transaction
		includeOutputInTransaction(value, identifier, switchType, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting including output in transaction on the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_INCLUDE_OUTPUT_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
							
								// Identifier
								"Identifier": identifier.getValue(),
								
								// Value
								"Value": value,
								
								// Switch type
								"Switch Type": switchType
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] === 0) {
								
									// Resolve
									resolve();
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Include input in transaction
		includeInputInTransaction(value, identifier, switchType, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Return requesting including input in transaction on the hardware wallet
							return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_INCLUDE_INPUT_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
							
								// Identifier
								"Identifier": identifier.getValue(),
								
								// Value
								"Value": value,
								
								// Switch type
								"Switch Type": switchType
								
							}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] === 0) {
								
									// Resolve
									resolve();
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Check transport's type
								switch(self.transport.type) {
								
									// Trezor type
									case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
									
										// Check if failure occurred
										if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
											// Initialize error occurred
											var errorOccurred = false;
											
											// Try
											try {
											
												// Decode error
												var decodedError = self.decode(error["Message Type"], error["Data"]);
											}
											
											// Catch errors
											catch(decodeError) {
											
												// Set error occurred
												errorOccurred = true;
											}
											
											// Check if an error didn't occur
											if(errorOccurred === false) {
											
												// Check if user rejected the request
												if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
													
													// Return
													return;
												}
											}
										}
										
										// Break
										break;
								}
								
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Reject error
							reject(error);
						}
					}
					
					// Otherwise
					else {
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Apply offset to transaction
		applyOffsetToTransaction(offset, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Return requesting applying an offset to the transaction on the hardware wallet
						return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_APPLY_OFFSET_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
						
							// Offset
							"Offset": offset
							
						}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_SECRET_NONCE_INDEX_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] === 0 || response["length"] === 1) {
							
								// Get secret nonce index from response
								var secretNonceIndex = (response["length"] === 1) ? response[0] : HardwareWallet.NO_SECRET_NONCE_INDEX;
							
								// Resolve secret nonce index
								resolve(secretNonceIndex);
							}
							
							// Otherwise
							else {
							
								// Reject
								reject();
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check transport's type
							switch(self.transport.type) {
							
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
								
									// Check if failure occurred
									if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
								
										// Initialize error occurred
										var errorOccurred = false;
										
										// Try
										try {
										
											// Decode error
											var decodedError = self.decode(error["Message Type"], error["Data"]);
										}
										
										// Catch errors
										catch(decodeError) {
										
											// Set error occurred
											errorOccurred = true;
										}
										
										// Check if an error didn't occur
										if(errorOccurred === false) {
										
											// Check if user rejected the request
											if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
												
												// Return
												return;
											}
										}
									}
									
									// Break
									break;
							}
							
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Get transaction public key
		getTransactionPublicKey(text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Return requesting getting the transaction public key from the hardware wallet
						return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_KEY_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_PUBLIC_KEY_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] === Crypto.SECP256K1_PUBLIC_KEY_LENGTH && Secp256k1Zkp.isValidPublicKey(response) === true) {
							
								// Get public key from response
								var publicKey = response;
							
								// Resolve public key
								resolve(publicKey);
							}
							
							// Otherwise
							else {
							
								// Reject
								reject();
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check transport's type
							switch(self.transport.type) {
							
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
								
									// Check if failure occurred
									if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
								
										// Initialize error occurred
										var errorOccurred = false;
										
										// Try
										try {
										
											// Decode error
											var decodedError = self.decode(error["Message Type"], error["Data"]);
										}
										
										// Catch errors
										catch(decodeError) {
										
											// Set error occurred
											errorOccurred = true;
										}
										
										// Check if an error didn't occur
										if(errorOccurred === false) {
										
											// Check if user rejected the request
											if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
												
												// Return
												return;
											}
										}
									}
									
									// Break
									break;
							}
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Get transaction public nonce
		getTransactionPublicNonce(text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Return requesting getting the transaction public nonce from the hardware wallet
						return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_NONCE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_PUBLIC_NONCE_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] === Crypto.SECP256K1_PUBLIC_KEY_LENGTH && Secp256k1Zkp.isValidPublicKey(response) === true) {
							
								// Get public nonce from response
								var publicNonce = response;
							
								// Resolve public nonce
								resolve(publicNonce);
							}
							
							// Otherwise
							else {
							
								// Reject
								reject();
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check transport's type
							switch(self.transport.type) {
							
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
								
									// Check if failure occurred
									if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
								
										// Initialize error occurred
										var errorOccurred = false;
										
										// Try
										try {
										
											// Decode error
											var decodedError = self.decode(error["Message Type"], error["Data"]);
										}
										
										// Catch errors
										catch(decodeError) {
										
											// Set error occurred
											errorOccurred = true;
										}
										
										// Check if an error didn't occur
										if(errorOccurred === false) {
										
											// Check if user rejected the request
											if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
												
												// Return
												return;
											}
										}
									}
									
									// Break
									break;
							}
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Get transaction message signature
		getTransactionMessageSignature(message, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Return requesting getting the transaction message signature from the hardware wallet
						return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_MESSAGE_SIGNATURE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
						
							// Message
							"Message": (new TextEncoder()).encode(message)
							
						}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_MESSAGE_SIGNATURE_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] === Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH && Secp256k1Zkp.isValidSingleSignerSignature(response) === true) {
							
								// Get message signature from response
								var messageSignature = response;
							
								// Resolve signature
								resolve(messageSignature);
							}
							
							// Otherwise
							else {
							
								// Reject
								reject();
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check transport's type
							switch(self.transport.type) {
							
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
								
									// Check if failure occurred
									if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
								
										// Initialize error occurred
										var errorOccurred = false;
										
										// Try
										try {
										
											// Decode error
											var decodedError = self.decode(error["Message Type"], error["Data"]);
										}
										
										// Catch errors
										catch(decodeError) {
										
											// Set error occurred
											errorOccurred = true;
										}
										
										// Check if an error didn't occur
										if(errorOccurred === false) {
										
											// Check if user rejected the request
											if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
												
												// Return
												return;
											}
										}
									}
									
									// Break
									break;
							}
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Get transaction information
		getTransactionInformation(publicNonce, publicKey, features, lockHeight = Slate.NO_LOCK_HEIGHT, relativeHeight = Slate.NO_RELATIVE_HEIGHT, kernelCommit = HardwareWallet.NO_KERNEL_COMMIT, address = HardwareWallet.NO_ADDRESS, receiverSignature = Slate.NO_RECEIVER_SIGNATURE, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Try
						try {
					
							// Check features
							switch(features) {
							
								// Coinbase or plain features
								case SlateKernel.COINBASE_FEATURES:
								case SlateKernel.PLAIN_FEATURES:
								
									// Set kernel information to features
									var kernelInformation = new Uint8Array([features]);
								
									// Break
									break;
								
								// Height locked features
								case SlateKernel.HEIGHT_LOCKED_FEATURES:
								
									// Set kernel information to features followed by the lock height
									var kernelInformation = Common.mergeArrays([
									
										// Features
										new Uint8Array([features]),
										
										// Lock height
										lockHeight.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)
									]);
								
									// Break
									break;
								
								// No recent duplicate features
								case SlateKernel.NO_RECENT_DUPLICATE_FEATURES:
								
									// Set kernel features to features followed by the relative height
									var kernelInformation = Common.mergeArrays([
									
										// Features
										new Uint8Array([features]),
										
										// Relative height
										relativeHeight.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT16)
									]);
								
									// Break
									break;
							}
						}
						
						// Catch errors
						catch(error) {
						
							// Reject error
							reject(error);
							
							// Return
							return;
						}
						
						// Check wallet type
						switch(Consensus.getWalletType()) {
						
							// MWC wallet
							case Consensus.MWC_WALLET_TYPE:
							
								// Check if address exists
								if(address !== HardwareWallet.NO_ADDRESS) {
					
									// Check address length
									switch(address["length"]) {
									
										// Tor address length
										case Tor.ADDRESS_LENGTH:
										
											// Set address type
											var addressType = HardwareWallet.TOR_ADDRESS_TYPE;
											
											// Break
											break;
										
										// MQS address length
										case Mqs.ADDRESS_LENGTH:
										
											// Set address type
											var addressType = HardwareWallet.MQS_ADDRESS_TYPE;
											
											// Break
											break;
									}
								}
						
								// Otherwise
								else {
								
									// Set address type
									var addressType = HardwareWallet.MQS_ADDRESS_TYPE;
								}
								
								// Break
								break;
								
							// GRIN wallet
							case Consensus.GRIN_WALLET_TYPE:
							
								// Set address type
								var addressType = HardwareWallet.SLATEPACK_ADDRESS_TYPE;
								
								// Break
								break;
							
							// EPIC wallet
							case Consensus.EPIC_WALLET_TYPE:
							
								// Set address type
								var addressType = HardwareWallet.TOR_ADDRESS_TYPE;
								
								// Break
								break;
						}
						
						// Return requesting finishing the transaction on the hardware wallet
						return self.send(HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_TRANSACTION_MESSAGE_TYPE, addressType, HardwareWallet.NO_PARAMETER, {
						
							// Address type
							"Parameter One": addressType,
							
							// Public nonce
							"Public Nonce": publicNonce,
							
							// Public key
							"Public Key": publicKey,
							
							// Kernel information
							"Kernel Information": kernelInformation,
							
							// Kernel commitment
							"Kernel Commitment": (kernelCommit !== HardwareWallet.NO_KERNEL_COMMIT) ? kernelCommit : new Uint8Array([]),
							
							// Payment proof
							"Payment Proof": (receiverSignature !== Slate.NO_RECEIVER_SIGNATURE) ? receiverSignature : new Uint8Array([])
							
						}, [HardwareWalletDefinitions.LEDGER_SUCCESS_MESSAGE_TYPE, HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_SIGNATURE_AND_PAYMENT_PROOF_MESSAGE_TYPE], text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] >= Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH && Secp256k1Zkp.isValidSingleSignerSignature(response.subarray(0, Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH)) === true) {
							
								// Get signature from response
								var signature = response.subarray(0, Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH);
								
								// Get payment proof from response
								var paymentProof = (response["length"] > Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH) ? response.subarray(Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH) : HardwareWallet.NO_PAYMENT_PROOF;
								
								// Check if payment proof is valid
								if(paymentProof === HardwareWallet.NO_PAYMENT_PROOF || paymentProof["length"] <= Crypto.MAXIMUM_MESSAGE_HASH_SIGNATURE_LENGTH || paymentProof["length"] === Crypto.ED25519_SIGNATURE_LENGTH) {
								
									// Resolve transaction information
									resolve([
									
										// Signature
										signature,
										
										// Payment proof
										paymentProof
									]);
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							}
							
							// Otherwise
							else {
							
								// Reject
								reject();
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Check transport's type
							switch(self.transport.type) {
							
								// Ledger type
								case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
								
									// Check if user rejected the request
									if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.LEDGER_USER_REJECTED_MESSAGE_TYPE) {
									
										// Reject user rejected error
										reject(HardwareWallet.USER_REJECTED_ERROR);
									}
									
									// Otherwise
									else {
								
										// Reject error
										reject(error);
									}
									
									// Break
									break;
								
								// Trezor type
								case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
								
									// Check if failure occurred
									if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
								
										// Initialize error occurred
										var errorOccurred = false;
										
										// Try
										try {
										
											// Decode error
											var decodedError = self.decode(error["Message Type"], error["Data"]);
										}
										
										// Catch errors
										catch(decodeError) {
										
											// Set error occurred
											errorOccurred = true;
										}
										
										// Check if an error didn't occur
										if(errorOccurred === false) {
										
											// Check if user rejected the request
											if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
											
												// Reject user rejected error
												reject(HardwareWallet.USER_REJECTED_ERROR);
												
												// Return
												return;
											}
										}
									}
									
									// Reject error
									reject(error);
									
									// Break
									break;
							}
						});
					}
					
					// Otherwise
					else {
					
						// Reject disconnected error
						reject(HardwareWallet.DISCONNECTED_ERROR);
					}
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Cancel transaction
		cancelTransaction() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
					
					// Release exclusive lock
					self.releaseExclusiveLock();
				
					// Resolve
					resolve();
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Complete transaction
		completeTransaction() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
					
					// Release exclusive lock
					self.releaseExclusiveLock();
				
					// Resolve
					resolve();
				}
				
				// Otherwise
				else {
				
					// Reject
					reject();
				}
			});
		}
		
		// Set wallet key path
		setWalletKeyPath(walletKeyPath) {
		
			// Set wallet key path
			this.walletKeyPath = walletKeyPath;
		}
		
		// Get wallet key path
		getWalletKeyPath() {
		
			// Return wallet key path
			return this.walletKeyPath;
		}
		
		// Get available hardware wallet descriptors
		static getAvailableHardwareWalletDescriptors() {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting available hardware wallet descriptors
				return HardwareWalletUsbTransport.list().then(function(availableHardwareWalletDescriptors) {
				
					// Resolve available hardware wallet descriptors
					resolve(availableHardwareWalletDescriptors);
					
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Is supported
		static isSupported() {
		
			// Return if USB or Bluetooth are supported
			return "usb" in navigator === true || "bluetooth" in navigator === true;
		}
		
		// Any hardware wallet descriptor
		static get ANY_HARDWARE_WALLET_DESCRIPTOR() {
		
			// Return any hardware wallet descriptor
			return null;
		}
		
		// Ledger hardware type
		static get LEDGER_HARDWARE_TYPE() {
		
			// Return Ledger hardware type
			return 0;
		}
		
		// Trezor hardware type
		static get TREZOR_HARDWARE_TYPE() {
		
			// Return Trezor hardware type
			return HardwareWallet.LEDGER_HARDWARE_TYPE + 1;
		}
		
		// Disconnect event
		static get DISCONNECT_EVENT() {
		
			// Return disconnect event
			return "HardwareWalletDisconnectEvent";
		}
		
		// Before disconnect event
		static get BEFORE_DISCONNECT_EVENT() {
		
			// Return before disconnect event
			return "HardwareWalletBeforeDisconnectEvent";
		}
		
		// Unlock event
		static get UNLOCK_EVENT() {
		
			// Return unlock event
			return "HardwareWalletUnlockEvent";
		}
		
		// Device cancel event
		static get DEVICE_CANCEL_EVENT() {
		
			// Return device cancel event
			return "HardwareWalletDeviceCancelEvent";
		}
		
		// Transaction information signature index
		static get TRANSACTION_INFORMATION_SIGNATURE_INDEX() {
		
			// Return transaction information signature index
			return 0;
		}
		
		// Transaction information payment proof index
		static get TRANSACTION_INFORMATION_PAYMENT_PROOF_INDEX() {
		
			// Return transaction information payment proof index
			return HardwareWallet.TRANSACTION_INFORMATION_SIGNATURE_INDEX + 1;
		}
		
		// No text
		static get NO_TEXT() {
		
			// Return no text
			return null;
		}
		
		// Disconnected error
		static get DISCONNECTED_ERROR() {
		
			// Return disconnected error
			return "HardwareWalletDisconnectedError";
		}
		
		// User rejected error
		static get USER_REJECTED_ERROR() {
		
			// Return user rejected error
			return "HardwareWalletUserRejectedError";
		}
		
		// Encrypted slate nonce index
		static get ENCRYPTED_SLATE_NONCE_INDEX() {
		
			// Return encrypted slate nonce index
			return 0;
		}
		
		// Encrypted slate data index
		static get ENCRYPTED_SLATE_DATA_INDEX() {
		
			// Return encrypted slate data index
			return HardwareWallet.ENCRYPTED_SLATE_NONCE_INDEX + 1;
		}
		
		// Sending transaction message
		static get SENDING_TRANSACTION_MESSAGE() {
		
			// Return sending transaction message
			return 0;
		}
		
		// Receiving transaction message
		static get RECEIVING_TRANSACTION_MESSAGE() {
		
			// Return receiving transaction message
			return HardwareWallet.SENDING_TRANSACTION_MESSAGE + 1;
		}
		
		// Creating coinbase message
		static get CREATING_COINBASE_MESSAGE() {
		
			// Return creating coinbase message
			return HardwareWallet.RECEIVING_TRANSACTION_MESSAGE + 1;
		}
		
		// USB connection type
		static get USB_CONNECTION_TYPE() {
		
			// Return USB connection type
			return 0;
		}
		
		// Bluetooth connection type
		static get BLUETOOTH_CONNECTION_TYPE() {
		
			// Return Bluetooth connection type
			return HardwareWallet.USB_CONNECTION_TYPE + 1;
		}
		
		// No secret nonce index
		static get NO_SECRET_NONCE_INDEX() {
		
			// Return no secret nonce index
			return 0;
		}
	
	// Private
	
		// Obtain exclusive lock
		obtainExclusiveLock() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
				
					// Get current exclusive lock release event index
					var index = self.exclusiveLockReleaseEventIndex++;
					
					// Check if current current exclusive lock release event index is at the max safe integer
					if(index === Number.MAX_SAFE_INTEGER)
					
						// Reset current exclusive lock release event index
						self.exclusiveLockReleaseEventIndex = 0;
					
					// Exclusive lock release index event
					$(self).on(HardwareWallet.EXCLUSIVE_LOCK_RELEASE_EVENT + "." + index.toFixed(), function() {
					
						// Check if exclusive lock isn't locked
						if(self.exclusiveLockObtained === false) {
						
							// Turn off exclusive lock release index event
							$(self).off(HardwareWallet.EXCLUSIVE_LOCK_RELEASE_EVENT + "." + index.toFixed());
						
							// Lock exclusive lock
							self.exclusiveLockObtained = true;
							
							// Resolve
							resolve();
						}
					});
				}
				
				// Otherwise
				else {
				
					// Lock exclusive lock
					self.exclusiveLockObtained = true;
					
					// Resolve
					resolve();
				}
			});
		}
		
		// Release exclusive lock
		releaseExclusiveLock() {
		
			// Check if exclusive lock is locked
			if(this.exclusiveLockObtained === true) {
			
				// Set self
				var self = this;
			
				// Set timeout
				setTimeout(function() {
			
					// Unlock exclusive lock
					self.exclusiveLockObtained = false;
					
					// Trigger exclusive lock release event
					$(self).trigger(HardwareWallet.EXCLUSIVE_LOCK_RELEASE_EVENT);
				}, 0);
			}
		}
		
		// Send
		send(messageType, parameterOne, parameterTwo, data = HardwareWallet.NO_DATA, allowedResponseTypes = [], text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, failOnLock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED, forceSend = false, preventUnlockMessageDone = false, unlockMessageShown = false) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if cancel didn't occur or force sending
				if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false || forceSend === true) {
				
					// Return performing the instruction on the hardware wallet
					return self.transport.send(messageType, parameterOne, parameterTwo, self.encode(messageType, data)).then(function(response) {
					
						// Check if cancel didn't occur or force sending and unlock message isn't shown
						if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false || (forceSend === true && unlockMessageShown === false)) {
						
							// Check if the hardware wallet is locked and not set to fail on lock
							if((self.transport.type === HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE && (response["Message Type"] === HardwareWalletDefinitions.LEDGER_APP_LOCKED_MESSAGE_TYPE || response["Message Type"] === HardwareWalletDefinitions.LEDGER_DEVICE_LOCKED_MESSAGE_TYPE)) && failOnLock === false) {
							
								// Set locked
								self.locked = true;
								
								// Initialize canceled
								var canceled = false;
							
								// Check if showing message
								if(text !== HardwareWallet.NO_TEXT) {
								
									// Show hardware wallet unlock message
									var showMessage = self.application.showHardwareWalletUnlockMessage(self, text, textArguments, allowUnlock, preventMessages, cancelOccurred);
									
									// Catch errors while showing the message
									showMessage.catch(function(error) {
									
										// Set canceled
										canceled = true;
									});
								}
								
								// Resend
								var resend = function() {
								
									// Return promise
									return new Promise(function(resolve, reject) {
							
										// Set timeout
										setTimeout(function() {
										
											// Check if canceled
											if(canceled === true) {
											
												// Clear locked
												self.locked = false;
											
												// Reject canceled error
												reject(Common.CANCELED_ERROR);
											}
											
											// Otherwise
											else {
											
												// Check if cancel didn't occur
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
										
													// Return performing the instruction on the hardware wallet
													return self.transport.send(messageType, parameterOne, parameterTwo, self.encode(messageType, data)).then(function(response) {
													
														// Check if cancel didn't occur
														if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
													
															// Check if the hardware wallet is locked and not set to fail on lock
															if((self.transport.type === HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE && (response["Message Type"] === HardwareWalletDefinitions.LEDGER_APP_LOCKED_MESSAGE_TYPE || response["Message Type"] === HardwareWalletDefinitions.LEDGER_DEVICE_LOCKED_MESSAGE_TYPE)) && failOnLock === false) {
															
																// Return resend
																return resend().then(function(response) {
																
																	// Check if cancel didn't occur
																	if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
																
																		// Resolve response
																		resolve(response);
																	}
																	
																	// Otherwise
																	else {
																	
																		// Reject canceled error
																		reject(Common.CANCELED_ERROR);
																	}
																
																// Catch error
																}).catch(function(error) {
																
																	// Check if cancel didn't occur
																	if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
																	
																		// Reject error
																		reject(error);
																	}
																	
																	// Otherwise
																	else {
																	
																		// Reject canceled error
																		reject(Common.CANCELED_ERROR);
																	}
																});
															}
															
															// Otherwise check if response type isn't allowed
															else if(response["Message Type"] !== ((Array.isArray(allowedResponseTypes) === true) ? allowedResponseTypes[self.transport.type] : allowedResponseTypes)) {
															
																// Clear locked
																self.locked = false;
																
																// Check if response data isn't used
																if(response["Message Type"] !== HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
																
																	// Securely clear response data
																	response["Data"].fill(0);
																}
																
																// Reject response
																reject(response);
															}
															
															// Otherwise
															else {
															
																// Clear locked
																self.locked = false;
															
																// Try
																try {
																
																	// Decode response
																	var decodedResponse = self.decode(response["Message Type"], response["Data"]);
																}
																
																// Catch errors
																catch(error) {
																
																	// Securely clear response data
																	response["Data"].fill(0);
																
																	// Reject error
																	reject(error);
																	
																	// Return
																	return;
																}
																
																// Securely clear response data
																response["Data"].fill(0);
															
																// Trigger unlock event
																$(self).trigger(HardwareWallet.UNLOCK_EVENT);
																
																// Check if showing message and not canceled
																if(text !== HardwareWallet.NO_TEXT && canceled === false) {
																
																	// Return waiting until showing message has finished
																	return showMessage.then(function() {
																	
																		// Resolve decoded response
																		resolve(decodedResponse);
																	
																	// Catch errors
																	}).catch(function() {
																	
																		// Resolve decoded response
																		resolve(decodedResponse);
																	});
																}
																
																// Otherwise
																else {
															
																	// Resolve decoded response
																	resolve(decodedResponse);
																}
															}
														}
														
														// Otherwise
														else {
														
															// Securely clear response data
															response["Data"].fill(0);
														
															// Clear locked
															self.locked = false;
															
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
														}
													
													// Catch errors
													}).catch(function(error) {
													
														// Check if cancel didn't occur
														if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
														
															// Check if error is that the device was disconnected
															if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
															
																// Clear locked
																self.locked = false;
																
																// Trigger before disconnect event
																$(self).trigger(HardwareWallet.BEFORE_DISCONNECT_EVENT);
																
																// Check if showing message and not canceled
																if(text !== HardwareWallet.NO_TEXT && canceled === false) {
																
																	// Return waiting until showing message has finished
																	return showMessage.then(function() {
																	
																		// Reject disconnected error
																		reject(HardwareWallet.DISCONNECTED_ERROR);
																	
																	// Catch errors
																	}).catch(function() {
																	
																		// Reject disconnected error
																		reject(HardwareWallet.DISCONNECTED_ERROR);
																	});
																}
																
																// Otherwise
																else {
															
																	// Reject disconnected error
																	reject(HardwareWallet.DISCONNECTED_ERROR);
																}
															}
															
															// Otherwise
															else {
															
																// Clear locked
																self.locked = false;
															
																// Reject error
																reject(error);
															}
														}
														
														// Otherwise
														else {
														
															// Clear locked
															self.locked = false;
															
															// Reject canceled error
															reject(Common.CANCELED_ERROR);
														}
													});
												}
												
												// Otherwise
												else {
												
													// Clear locked
													self.locked = false;
													
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												}
											}
										}, HardwareWallet.RESEND_REQUEST_DELAY_MILLISECONDS);
									});
								};
								
								// Return resend
								return resend().then(function(response) {
								
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
									
										// Resolve response
										resolve(response);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
								
								// Catch error
								}).catch(function(error) {
								
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
								
										// Reject error
										reject(error);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
								});
							}
							
							// Otherwise check if hardware wallet requires button acknowledgment
							else if(self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE && response["Message Type"] === HardwareWalletDefinitions.TREZOR_BUTTON_REQUEST_MESSAGE_TYPE) {
							
								// Initialize error occurred
								var errorOccurred = false;
								
								// Try
								try {
								
									// Decode response
									var decodedResponse = self.decode(response["Message Type"], response["Data"]);
								}
								
								// Catch errors
								catch(error) {
								
									// Set error occurred
									errorOccurred = true;
								}
								
								// Check if an error didn't occur
								if(errorOccurred === false) {
								
									// Check if device is locked or needs a passphrase and not set to fail on lock
									if(decodedResponse["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedResponse[0] === HardwareWalletDefinitions.TREZOR_PIN_ENTRY_BUTTON_REQUEST_TYPE || decodedResponse[0] === HardwareWalletDefinitions.TREZOR_PASSPHRASE_ENTRY_BUTTON_REQUEST_TYPE) && failOnLock === false) {
									
										// Check if unlock message isn't shown
										if(unlockMessageShown === false) {
										
											// Set locked
											self.locked = true;
										}
										
										// Initialize canceled
										var canceled = false;
										
										// Initialize prevent cancel
										var preventCancel = false;
										
										// Check if showing message and unlock message isn't shown
										if(text !== HardwareWallet.NO_TEXT && unlockMessageShown === false) {
										
											// Show hardware wallet unlock message
											var showMessage = self.application.showHardwareWalletUnlockMessage(self, text, textArguments, allowUnlock, preventMessages, cancelOccurred);
											
											// Catch errors while showing the message
											showMessage.catch(function(error) {
											
												// Check if not preventing cancel
												if(preventCancel === false) {
												
													// Set canceled
													canceled = true;
													
													// Clear locked
													self.locked = false;
													
													// Reset transport device and catch errors
													self.transport.device.reset().catch(function(error) {
													
													// Finally
													}).finally(function() {
													
														// Reject canceled error
														reject(Common.CANCELED_ERROR);
													});
												}
											});
										}
										
										// Return sending button acknowledge response
										return self.send(HardwareWalletDefinitions.TREZOR_BUTTON_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, allowedResponseTypes, text, textArguments, allowUnlock, failOnLock, preventMessages, function() {
										
											// Return if cancel occurred or canceled
											return (cancelOccurred !== Common.NO_CANCEL_OCCURRED && cancelOccurred() === true) || canceled === true;
											
										}, true, preventUnlockMessageDone, true).then(function(response) {
										
											// Check if not canceled
											if(canceled === false) {
											
												// Set prevent cancel
												preventCancel = true;
											
												// Check if unlock message isn't shown
												if(unlockMessageShown === false) {
											
													// Clear locked
													self.locked = false;
												}
												
												// Check if cancel didn't occur
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
												
													// Check if unlock message isn't shown
													if(unlockMessageShown === false) {
												
														// Trigger unlock event
														$(self).trigger(HardwareWallet.UNLOCK_EVENT);
													}
												
													// Check if showing message and unlock message isn't shown
													if(text !== HardwareWallet.NO_TEXT && unlockMessageShown === false) {
													
														// Return waiting until showing message has finished
														return showMessage.then(function() {
														
															// Resolve response
															resolve(response);
														
														// Catch errors
														}).catch(function() {
														
															// Resolve response
															resolve(response);
														});
													}
													
													// Otherwise
													else {
												
														// Resolve response
														resolve(response);
													}
												}
												
												// Otherwise
												else {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												}
											}
											
										// Catch errors
										}).catch(function(error) {
										
											// Check if not canceled
											if(canceled === false) {
											
												// Set prevent cancel
												preventCancel = true;
											
												// Check if unlock message isn't shown
												if(unlockMessageShown === false) {
										
													// Clear locked
													self.locked = false;
												}
											
												// Check if cancel didn't occur
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
												
													// Check if unlock message isn't shown
													if(unlockMessageShown === false) {
												
														// Check if failure occurred
														if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
													
															// Initialize error occurred
															var errorOccurred = false;
															
															// Try
															try {
															
																// Decode error
																var decodedError = self.decode(error["Message Type"], error["Data"]);
															}
															
															// Catch errors
															catch(decodeError) {
															
																// Set error occurred
																errorOccurred = true;
															}
															
															// Check if an error didn't occur
															if(errorOccurred === false) {
															
																// Check if user rejected the request
																if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_ACTION_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE)) {
																
																	// Trigger device cancel event
																	$(self).trigger(HardwareWallet.DEVICE_CANCEL_EVENT);
																}
															}
														}
													}
												
													// Reject error
													reject(error);
												}
												
												// Otherwise
												else {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												}
											}
										});
									}
								}
							
								// Return sending button acknowledge response
								return self.send(HardwareWalletDefinitions.TREZOR_BUTTON_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, allowedResponseTypes, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred, true).then(function(response) {
								
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
									
										// Resolve response
										resolve(response);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
									
								// Catch errors
								}).catch(function(error) {
								
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
									
										// Reject error
										reject(error);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
								});
							}
							
							// Otherwise check if hardware wallet requires passphrase acknowledgment
							else if(self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE && response["Message Type"] === HardwareWalletDefinitions.TREZOR_PASSPHRASE_REQUEST_MESSAGE_TYPE) {
							
								// Return sending passphrase acknowledge response
								return self.send(HardwareWalletDefinitions.TREZOR_PASSPHRASE_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																	
									// Passphrase
									"Passphrase": ""
									
								}, allowedResponseTypes, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred, true).then(function(response) {
								
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
									
										// Resolve response
										resolve(response);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
									
								// Catch errors
								}).catch(function(error) {
								
									// Check if cancel didn't occur
									if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
									
										// Reject error
										reject(error);
									}
									
									// Otherwise
									else {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									}
								});
							}
							
							// Otherwise check if hardware wallet requires pin matrix acknowledgment
							else if(self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE && response["Message Type"] === HardwareWalletDefinitions.TREZOR_PIN_MATRIX_REQUEST_MESSAGE_TYPE) {
							
								// Check if not set to fail on lock and text exists
								if(failOnLock === false && text !== HardwareWallet.NO_TEXT) {
								
									// Set locked
									self.locked = true;
									
									// Initialize disconnected
									var disconnected = false;
									
									// Transport on disconnect
									var disconnectCallback = self.transport.on("disconnect", function() {
									
										// Set disconnected
										disconnected = true;
										
										// Clear locked
										self.locked = false;
									
										// Trigger before disconnect event
										$(self).trigger(HardwareWallet.BEFORE_DISCONNECT_EVENT);
									});
								
									// Return showing hardware wallet unlock message
									return self.application.showHardwareWalletUnlockMessage(self, text, textArguments, allowUnlock, preventMessages, cancelOccurred).then(function(alphabeticPin) {
									
										// Check if disconnected
										if(disconnected === true) {
										
											// Check if not preventing unlock message done and not preventing messages
											if(preventUnlockMessageDone === false && preventMessages === false) {
										
												// Return hiding application hardware unlock message
												return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
											
													// Reject disconnected error
													reject(HardwareWallet.DISCONNECTED_ERROR);
												});
											}
											
											// Otherwise
											else {
											
												// Reject disconnected error
												reject(HardwareWallet.DISCONNECTED_ERROR);
											}
										}
										
										// Otherwise
										else {
										
											// Turn off transport on disconnect
											self.transport.off("disconnect", disconnectCallback);
										
											// Clear locked
											self.locked = false;
											
											// Return sending pin matrix acknowledge response
											return self.send(HardwareWalletDefinitions.TREZOR_PIN_MATRIX_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																				
												// Pin
												"Pin": HardwareWallet.alphabeticPinToPin(Common.removeWhitespace(alphabeticPin))
												
											}, allowedResponseTypes, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred, true, true).then(function(response) {
											
												// Check if cancel didn't occur
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
												
													// Check if not preventing unlock message done
													if(preventUnlockMessageDone === false) {
												
														// Return hiding application hardware unlock message
														return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
													
															// Resolve response
															resolve(response);
														});
													}
													
													// Otherwise
													else {
													
														// Resolve response
														resolve(response);
													}
												}
												
												// Otherwise
												else {
												
													// Check if not preventing unlock message done
													if(preventUnlockMessageDone === false) {
												
														// Return hiding application hardware unlock message
														return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
													
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
												
											// Catch errors
											}).catch(function(error) {
											
												// Check if cancel didn't occur
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
												
													// Check if failure occurred
													if(Object.isObject(error) === true && "Message Type" in error === true && error["Message Type"] === HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
												
														// Initialize error occurred
														var errorOccurred = false;
														
														// Try
														try {
														
															// Decode error
															var decodedError = self.decode(error["Message Type"], error["Data"]);
														}
														
														// Catch errors
														catch(decodeError) {
														
															// Set error occurred
															errorOccurred = true;
														}
														
														// Check if an error didn't occur
														if(errorOccurred === false) {
														
															// Check if pin was incorrect
															if(decodedError["length"] >= Uint8Array["BYTES_PER_ELEMENT"] && (decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE || decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_INVALID_FAILURE_TYPE)) {
															
																// Return hiding application hardware unlock message
																return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred, false).then(function() {
																
																	// Check if not preventing messages
																	if(preventMessages === false) {
																	
																		// Message before replace hardware wallet event
																		$(self.application.message).on(Message.BEFORE_REPLACE_EVENT + ".hardwareWallet", function(event, messageType, messageData) {
																		
																			// Check if message type is hardware wallet disconnect message
																			if(messageType === Application.HARDWARE_WALLET_DISCONNECT_MESSAGE) {
																			
																				// Cancel replacing message
																				self.application.message.cancelReplace();
																				
																				// Return false to stop other replace message
																				return false;
																			}
																		});
																	}
																	
																	// Return resending message
																	return self.send(messageType, parameterOne, parameterTwo, data, allowedResponseTypes, (decodedError[0] === HardwareWalletDefinitions.TREZOR_PIN_CANCELED_FAILURE_TYPE) ? Language.getDefaultTranslation('Invalid pin.') : Language.getDefaultTranslation('Incorrect pin.'), [], allowUnlock, failOnLock, true, cancelOccurred, true, true).then(function(response) {
																	
																		// Turn off message before replace hardware wallet event
																		$(self.application.message).off(Message.BEFORE_REPLACE_EVENT + ".hardwareWallet");
																		
																		// Check if cancel didn't occur
																		if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
																		
																			// Check if not preventing unlock message done
																			if(preventUnlockMessageDone === false) {
																			
																				// Return hiding application hardware unlock message
																				return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
																				
																					// Resolve response
																					resolve(response);
																				});
																			}
																			
																			// Otherwise
																			else {
																			
																				// Resolve response
																				resolve(response);
																			}
																		}
																		
																		// Otherwise
																		else {
																		
																			// Check if not preventing unlock message done
																			if(preventUnlockMessageDone === false) {
																			
																				// Return hiding application hardware unlock message
																				return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
																				
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
																	
																	// Catch errors
																	}).catch(function(error) {
																	
																		// Turn off message before replace hardware wallet event
																		$(self.application.message).off(Message.BEFORE_REPLACE_EVENT + ".hardwareWallet");
																		
																		// Check if cancel didn't occur
																		if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
																		
																			// Check if not preventing unlock message done and not preventing messages
																			if(preventUnlockMessageDone === false && preventMessages === false) {
																			
																				// Return hiding application hardware unlock message
																				return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
																				
																					// Reject error
																					reject(error);
																				});
																			}
																			
																			// Otherwise
																			else {
																			
																				// Reject error
																				reject(error);
																			}
																		}
																		
																		// Otherwise
																		else {
																		
																			// Check if not preventing unlock message done
																			if(preventUnlockMessageDone === false) {
																			
																				// Return hiding application hardware unlock message
																				return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
																				
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
																});
															}
														}
													}
													
													// Check if not preventing unlock message done
													if(preventUnlockMessageDone === false) {
													
														// Return hiding application hardware unlock message
														return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
														
															// Reject error
															reject(error);
														});
													}
													
													// Otherwise
													else {
													
														// Reject error
														reject(error);
													}
												}
												
												// Otherwise
												else {
												
													// Check if not preventing unlock message done
													if(preventUnlockMessageDone === false) {
												
														// Return hiding application hardware unlock message
														return self.application.hardwareWalletUnlockMessageDone(preventMessages, cancelOccurred).then(function() {
													
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
										
									// Catch errors
									}).catch(function(error) {
									
										// Check if disconnected
										if(disconnected === true) {
										
											// Reject disconnected error
											reject(HardwareWallet.DISCONNECTED_ERROR);
										}
										
										// Otherwise
										else {
										
											// Turn off transport on disconnect
											self.transport.off("disconnect", disconnectCallback);
										
											// Clear locked
											self.locked = false;
											
											// Return sending pin matrix acknowledge response
											return self.send(HardwareWalletDefinitions.TREZOR_PIN_MATRIX_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																				
												// Pin
												"Pin": HardwareWallet.INVALID_PIN
												
											}, allowedResponseTypes, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred, true).then(function(response) {
											
												// Check if cancel didn't occur
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
												
													// Reject error
													reject(error);
												}
												
												// Otherwise
												else {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												}
												
											// Catch errors
											}).catch(function() {
											
												// Check if cancel didn't occur
												if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
												
													// Reject error
													reject(error);
												}
												
												// Otherwise
												else {
												
													// Reject canceled error
													reject(Common.CANCELED_ERROR);
												}
											});
										}
									});
								}
								
								// Otherwise
								else {
								
									// Return sending pin matrix acknowledge response
									return self.send(HardwareWalletDefinitions.TREZOR_PIN_MATRIX_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																		
										// Pin
										"Pin": HardwareWallet.INVALID_PIN
										
									}, allowedResponseTypes, text, textArguments, allowUnlock, failOnLock, preventMessages, cancelOccurred, true).then(function(response) {
									
										// Check if cancel didn't occur
										if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
										
											// Resolve response
											resolve(response);
										}
										
										// Otherwise
										else {
										
											// Reject canceled error
											reject(Common.CANCELED_ERROR);
										}
										
									// Catch errors
									}).catch(function(error) {
									
										// Check if cancel didn't occur
										if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
										
											// Reject error
											reject(error);
										}
										
										// Otherwise
										else {
										
											// Reject canceled error
											reject(Common.CANCELED_ERROR);
										}
									});
								}
							}
							
							// Otherwise check if response type isn't allowed
							else if(response["Message Type"] !== ((Array.isArray(allowedResponseTypes) === true) ? allowedResponseTypes[self.transport.type] : allowedResponseTypes)) {
							
								// Check if cancel didn't occur
								if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
								
									// Check if response data isn't used
									if(response["Message Type"] !== HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE) {
									
										// Securely clear response data
										response["Data"].fill(0);
									}
									
									// Reject response
									reject(response);
								}
						
								// Otherwise
								else {
								
									// Securely clear response data
									response["Data"].fill(0);
								
									// Reject canceled error
									reject(Common.CANCELED_ERROR);
								}
							}
							
							// Otherwise
							else {
							
								// Check if cancel didn't occur
								if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
								
									// Try
									try {
									
										// Decode response
										var decodedResponse = self.decode(response["Message Type"], response["Data"]);
									}
									
									// Catch errors
									catch(error) {
									
										// Securely clear response data
										response["Data"].fill(0);
									
										// Reject error
										reject(error);
										
										// Return
										return;
									}
									
									// Securely clear response data
									response["Data"].fill(0);
								
									// Resolve decoded response
									resolve(decodedResponse);
								}
						
								// Otherwise
								else {
								
									// Securely clear response data
									response["Data"].fill(0);
								
									// Reject canceled error
									reject(Common.CANCELED_ERROR);
								}
							}
						}
						
						// Otherwise
						else {
						
							// Securely clear response data
							response["Data"].fill(0);
							
							// Check if unlock message isn't shown
							if(unlockMessageShown === false) {
							
								// Check if hardware wallet requires button acknowledgment
								if(self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE && response["Message Type"] === HardwareWalletDefinitions.TREZOR_BUTTON_REQUEST_MESSAGE_TYPE) {
								
									// Return sending button acknowledge response and catch errors
									return self.send(HardwareWalletDefinitions.TREZOR_BUTTON_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, [], HardwareWallet.NO_TEXT, [], false, true).catch(function(error) {
									
									// Finally
									}).finally(function() {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									});
								}
								
								// Otherwise check if hardware wallet requires passphrase acknowledgment
								else if(self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE && response["Message Type"] === HardwareWalletDefinitions.TREZOR_PASSPHRASE_REQUEST_MESSAGE_TYPE) {
								
									// Return sending passphrase acknowledge response
									return self.send(HardwareWalletDefinitions.TREZOR_PASSPHRASE_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																		
										// Passphrase
										"Passphrase": ""
										
									}, [], HardwareWallet.NO_TEXT, [], false, true).catch(function(error) {
									
									// Finally
									}).finally(function() {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									});
								}
								
								// Otherwise check if hardware wallet requires pin matrix acknowledgment
								else if(self.transport.type === HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE && response["Message Type"] === HardwareWalletDefinitions.TREZOR_PIN_MATRIX_REQUEST_MESSAGE_TYPE) {
								
									// Return sending pin matrix acknowledge response
									return self.send(HardwareWalletDefinitions.TREZOR_PIN_MATRIX_ACKNOWLEDGE_MESSAGE_TYPE, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, {
																		
										// Pin
										"Pin": HardwareWallet.INVALID_PIN
										
									}, [], HardwareWallet.NO_TEXT, [], false, true).catch(function(error) {
									
									// Finally
									}).finally(function() {
									
										// Reject canceled error
										reject(Common.CANCELED_ERROR);
									});
								}
							}
							
							// Reject canceled error
							reject(Common.CANCELED_ERROR);
						}
						
					// Catch errors
					}).catch(function(error) {
					
						// Check if cancel didn't occur
						if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
						
							// Check if error is that the device was disconnected
							if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
							
								// Reject disconnected error
								reject(HardwareWallet.DISCONNECTED_ERROR);
							}
							
							// Otherwise
							else {
							
								// Reject error
								reject(error);
							}
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
				
					// Reject canceled error
					reject(Common.CANCELED_ERROR);
				}
			});
		}
		
		// Encode
		encode(messageType, data) {
		
			// Check if data is no data
			if(data === HardwareWallet.NO_DATA) {
			
				// Return nothing
				return new Uint8Array([]);
			}
		
			// Check transport's type
			switch(this.transport.type) {
			
				// Ledger type
				case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
				
					// Get message schema
					var messageSchema = HardwareWalletDefinitions.SCHEMA[messageType.toFixed()];
				
					// Initialize result
					var result = new Uint8Array([]);
					
					// Go through all fields in the message schema
					for(var fieldNumber in messageSchema) {
					
						if(messageSchema.hasOwnProperty(fieldNumber) === true) {
						
							// Check if field isn't ignored
							if(HardwareWalletDefinitions.LEDGER_IGNORE_FIELD_NAMES.indexOf(messageSchema[fieldNumber]["Name"]) === Common.INDEX_NOT_FOUND) {
					
								// Go through all values in the data
								for(var name in data) {
											
									if(data.hasOwnProperty(name) === true) {
									
										// Check if data is for the field
										if(name === messageSchema[fieldNumber]["Name"]) {
										
											// Check if data is a big number
											if(data[name] instanceof BigNumber === true) {
											
												// Set field payload
												var fieldPayload = data[name].toBytes(BigNumber.LITTLE_ENDIAN, messageSchema[fieldNumber]["Size"]);
											}
											
											// Otherwise check if data is bytes
											else if(data[name] instanceof Uint8Array === true) {
											
												// Set field payload
												var fieldPayload = data[name];
											}
											
											// Otherwise check if data is a string
											else if(typeof data[name] === "string") {
											
												// Set field payload
												var fieldPayload = (new TextEncoder()).encode(data[name]);
											}
											
											// Otherwise check if data is a number
											else if(typeof data[name] === "number") {
											
												// Set field payload
												var fieldPayload = new Uint8Array([data[name]]);
											}
										
											// Append field payload to the result
											result = Common.mergeArrays([
											
												// Result
												result,
												
												// Field payload
												fieldPayload
											]);
											
											// Break
											break;
										}
									}
								}
							}
						}
					}
					
					// Return result
					return result;
				
				// Trezor type
				case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
				
					// Return data encoded as Protocol Buffers
					return ProtocolBuffers.encode(messageType, data, HardwareWalletDefinitions.SCHEMA);
			}
		}
		
		// Decode
		decode(messageType, data, transportType = HardwareWallet.NO_TRANSPORT_TYPE) {
		
			// Check transport's type
			switch((transportType !== HardwareWallet.NO_TRANSPORT_TYPE) ? transportType : this.transport.type) {
			
				// Ledger type
				case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
				
					// Return data
					return new Uint8Array(data);
				
				// Trezor type
				case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
				
					// Decode data as Protocol Buffers
					var protocolBuffers = ProtocolBuffers.decode(messageType, data, HardwareWalletDefinitions.SCHEMA);
					
					// Get message schema
					var messageSchema = HardwareWalletDefinitions.SCHEMA[messageType.toFixed()];
					
					// Initialize result
					var result = new Uint8Array([]);
					
					// Go through all fields in the message schema
					for(var fieldNumber in messageSchema) {
					
						if(messageSchema.hasOwnProperty(fieldNumber) === true) {
						
							// Check if field doesn't exist in the Protocol Buffers
							if(messageSchema[fieldNumber]["Name"] in protocolBuffers === false) {
							
								// Check if field is optional
								if("Optional" in messageSchema[fieldNumber] === true && messageSchema[fieldNumber]["Optional"] === true) {
								
									// Go to next field
									continue;
								}
								
								// Check if field's type is bool
								if(messageSchema[fieldNumber]["Type"] === ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE) {
								
									// Set field payload to false
									protocolBuffers[messageSchema[fieldNumber]["Name"]] = [false];
								}
								
								// Otherwise
								else {
								
									// Securely clear result
									result.fill(0);
								
									// Throw error
									throw "Field doesn't exist in the Protocol Buffers.";
								}
							}
							
							// Get field payload
							var fieldPayload = protocolBuffers[messageSchema[fieldNumber]["Name"]];
							
							// Set include length
							var includeLength = false;
						
							// Check field's expected type
							switch(messageSchema[fieldNumber]["Type"]) {
							
								// Uint
								case ProtocolBuffers.UINT_SCHEMA_DATA_TYPE:
								
									// Set field data
									var fieldData = fieldPayload[fieldPayload["length"] - 1].toBytes(BigNumber.BIG_ENDIAN, messageSchema[fieldNumber]["Size"]);
									
									// Break
									break;
								
								// Bool
								case ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE:
								
									// Set field data
									var fieldData = new Uint8Array([(fieldPayload[fieldPayload["length"] - 1] === true) ? 1 : 0]);
									
									// Break
									break;
								
								// Enum
								case ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE:
								
									// Set field data
									var fieldData = new Uint8Array(fieldPayload);
									
									// Check if more than one value exists in the field payload
									if(fieldPayload["length"] > 1) {
									
										// Check if field length is too big
										if(fieldPayload["length"] > Common.BYTE_MAX_VALUE) {
										
											// Throw error
											throw "Field length is too big.";
										}
										
										// Set field data to include field length
										fieldData = Common.mergeArrays([new Uint8Array([fieldPayload["length"]]), fieldData]);
									}
									
									// Break
									break;
								
								// String
								case ProtocolBuffers.STRING_SCHEMA_DATA_TYPE:
								
									// Set field data
									var fieldData = (new TextEncoder()).encode(fieldPayload[fieldPayload["length"] - 1]);
									
									// Set include length
									includeLength = true;
									
									// Check if field length is too big
									if(fieldData["length"] > Common.BYTE_MAX_VALUE) {
									
										// Throw error
										throw "Field length is too big.";
									}
									
									// Break
									break;
								
								// Bytes
								case ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE:
								
									// Set field data
									var fieldData = fieldPayload[fieldPayload["length"] - 1];
									
									// Break
									break;
								
								// Sint
								case ProtocolBuffers.SINT_SCHEMA_DATA_TYPE:
								
									// Throw error
									throw "Field type not supported.";
							}
							
							// Append field data to the result
							var currentResult = new Uint8Array(result["length"] + ((includeLength === true) ? Uint8Array["BYTES_PER_ELEMENT"] : 0) + fieldData["length"]);
							currentResult.set(result);
							
							if(includeLength === true) {
								currentResult[result["length"]] = fieldData["length"];
							}
							
							currentResult.set(fieldData, result["length"] + ((includeLength === true) ? Uint8Array["BYTES_PER_ELEMENT"] : 0));
							result.fill(0);
							result = currentResult;
						}
					}
					
					// Return result
					return result;
			}
		}
		
		// Get minimum compatible version
		getMinimumCompatibleVersion() {
		
			// Check transport's type
			switch(this.transport.type) {
			
				// Ledger type
				case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
		
					// Return minimum compatible version
					return "7.4.1";
				
				// Trezor type
				case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
				
					// Check transport's product name
					switch(this.transport["deviceModel"]["productName"]) {
					
						// Trezor Model One
						case "Trezor Model One":
		
							// Return minimum compatible version
							return "1.12.2";
						
						// Trezor Model T, Trezor Safe 3, Safe 5, or default
						case "Trezor Model T":
						case "Trezor Safe 3":
						case "Trezor Safe 5":
						default:
						
							// Return minimum compatible version
							return "2.6.4";
					}
			}
		}
		
		// Alphabetic pin to pin
		static alphabeticPinToPin(alphabeticPin) {
		
			// Check if alphabetic pin is empty
			if(alphabeticPin["length"] === 0) {
			
				// Return invalid pin
				return HardwareWallet.INVALID_PIN;
			}
		
			// Initialize result
			var result = "";
			
			// Go through all characters in the alphabetic pin
			for(var i = 0; i < alphabeticPin["length"]; ++i) {
			
				// Check if character is valid
				if(alphabeticPin[i] in HardwareWallet.ALPHABETIC_PIN_CHARACTERS === true) {
				
					// Append pin character to result
					result += HardwareWallet.ALPHABETIC_PIN_CHARACTERS[alphabeticPin[i]];
				}
				
				// Otherwise
				else {
				
					// Return invalid pin
					return HardwareWallet.INVALID_PIN;
				}
			}
			
			// Return result
			return result;
		}
		
		// Alphabetic pin characters
		static get ALPHABETIC_PIN_CHARACTERS() {
		
			// Return alphabetic pin characters
			return {
			
				// Upper case a
				"A": "7",
				
				// Upper case b
				"B": "8",
				
				// Upper case c
				"C": "9",
				
				// Upper case d
				"D": "4",
				
				// Upper case e
				"E": "5",
				
				// Upper case f
				"F": "6",
				
				// Upper case g
				"G": "1",
				
				// Upper case h
				"H": "2",
				
				// Upper case i
				"I": "3",
				
				// Lower case a
				"a": "7",
				
				// Lower case b
				"b": "8",
				
				// Lower case c
				"c": "9",
				
				// Lower case d
				"d": "4",
				
				// Lower case e
				"e": "5",
				
				// Lower case f
				"f": "6",
				
				// Lower case g
				"g": "1",
				
				// Lower case h
				"h": "2",
				
				// Lower case i
				"i": "3"
			};
		}
		
		// Invalid pin
		static get INVALID_PIN() {
		
			// Return invalid pin
			return "A";
		}
		
		// Is compatible version
		static isCompatibleVersion(version, minimumCompatibleVersion) {
		
			// Get version parts from the version
			var versionParts = version.match(HardwareWallet.VERSION_STRING_PATTERN);
			
			// Check if getting version parts was successful
			if(versionParts !== Common.NO_MATCH_FOUND) {
			
				// Get minimum compatible version parts
				var minimumCompatibleVersionParts = minimumCompatibleVersion.match(HardwareWallet.VERSION_STRING_PATTERN);
			
				// Go through all version parts
				for(var i = 0; i < versionParts["length"]; ++i) {
				
					// Check if version part is greater than the minimum compatible version part
					if((new BigNumber(versionParts[i])).isGreaterThan(minimumCompatibleVersionParts[i]) === true) {
					
						// Return true
						return true;
					}
					
					// Otherwise check if version part is less than the minimum compatible version part
					else if((new BigNumber(versionParts[i])).isLessThan(minimumCompatibleVersionParts[i]) === true) {
					
						// Return false
						return false;
					}
				}
				
				// Return true
				return true;
			}
			
			// Return false
			return false;
		}
		
		// Exclusive lock release event
		static get EXCLUSIVE_LOCK_RELEASE_EVENT() {
		
			// Return exclusive lock release event
			return "HardwareWalletExclusiveLockReleaseEvent";
		}
		
		// No transport
		static get NO_TRANSPORT() {
		
			// Return no transport
			return null;
		}
		
		// No root public key
		static get NO_ROOT_PUBLIC_KEY() {
		
			// Return no root public key
			return null;
		}
		
		// No seed cookie
		static get NO_SEED_COOKIE() {
		
			// Return no seed cookie
			return null;
		}
		
		// No address
		static get NO_ADDRESS() {
		
			// Return no address
			return null;
		}
		
		// No kernel commit
		static get NO_KERNEL_COMMIT() {
		
			// Return no kernel commit
			return null;
		}
		
		// No payment proof
		static get NO_PAYMENT_PROOF() {
		
			// Return no payment proof
			return null;
		}
		
		// Application name
		static get APPLICATION_NAME() {
		
			// Check wallet type
			switch(Consensus.getWalletType()) {
			
				// MWC wallet
				case Consensus.MWC_WALLET_TYPE:
				
					// Check network type
					switch(Consensus.getNetworkType()) {
					
						// Mainnet network type
						case Consensus.MAINNET_NETWORK_TYPE:
						
							// Return application name
							return "MimbleWimble Coin";
						
						// Testnet network type
						case Consensus.TESTNET_NETWORK_TYPE:
						
							// Return application name
							return "MimbleWimble Coin Floonet";
					}
					
					// Break
					break;
				
				// GRIN wallet
				case Consensus.GRIN_WALLET_TYPE:
				
					// Check network type
					switch(Consensus.getNetworkType()) {
					
						// Mainnet network type
						case Consensus.MAINNET_NETWORK_TYPE:
						
							// Return application name
							return "Grin";
						
						// Testnet network type
						case Consensus.TESTNET_NETWORK_TYPE:
						
							// Return application name
							return "Grin Testnet";
					}
					
					// Break
					break;
				
				// EPIC wallet
				case Consensus.EPIC_WALLET_TYPE:
				
					// Check network type
					switch(Consensus.getNetworkType()) {
					
						// Mainnet network type
						case Consensus.MAINNET_NETWORK_TYPE:
						
							// Return application name
							return "Epic Cash";
						
						// Testnet network type
						case Consensus.TESTNET_NETWORK_TYPE:
						
							// Return application name
							return "Epic Cash Floonet";
					}
					
					// Break
					break;
			}
		}
		
		// MimbleWimble Coin capable
		static get MIMBLEWIMBLE_COIN_CAPABLE() {
		
			// Return MimbleWimble Coin capable
			return 0xC7;
		}
		
		// Version string pattern
		static get VERSION_STRING_PATTERN() {
		
			// Return hex string pattern
			return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
		}
		
		// Seed cookie length
		static get SEED_COOKIE_LENGTH() {
		
			// Return seed cookie length
			return 64;
		}
		
		// No parameter
		static get NO_PARAMETER() {
		
			// Return no parameter
			return 0;
		}
		
		// Account
		static get ACCOUNT() {
		
			// Return account
			return 0;
		}
		
		// MQS address type
		static get MQS_ADDRESS_TYPE() {
		
			// Return MQS address type
			return 0;
		}
		
		// Tor address type
		static get TOR_ADDRESS_TYPE() {
		
			// Return Tor address type
			return HardwareWallet.MQS_ADDRESS_TYPE + 1;
		}
		
		// Slatepack address type
		static get SLATEPACK_ADDRESS_TYPE() {
		
			// Return Slatepack address type
			return HardwareWallet.TOR_ADDRESS_TYPE + 1;
		}
		
		// No data
		static get NO_DATA() {
		
			// Return no data
			return null;
		}
		
		// Resend request delay milliseconds
		static get RESEND_REQUEST_DELAY_MILLISECONDS() {
		
			// Return resend request delay milliseconds
			return 50;
		}
		
		// Not found error code
		static get NOT_FOUND_ERROR_CODE() {
		
			// Return not found error code
			return 8;
		}
		
		// Invalid state error code
		static get INVALID_STATE_ERROR_CODE() {
		
			// Return invalid state error code
			return 11;
		}
		
		// Network error code
		static get NETWORK_ERROR_CODE() {
		
			// Return network error code
			return 19;
		}
		
		// No salt
		static get NO_SALT() {
		
			// Return no salt
			return null;
		}
		
		// Encryption and decryption maximum chunk size
		static get ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE() {
		
			// Return encryption and decryption maximum chunk size
			return 64;
		}
		
		// No transport type
		static get NO_TRANSPORT_TYPE() {
		
			// Return no transport type
			return null;
		}
}


// Main function

// Set global object's hardware wallet
globalThis["HardwareWallet"] = HardwareWallet;
