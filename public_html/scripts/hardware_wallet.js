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
			return HardwareWallet.LEDGER_HARDWARE_TYPE;
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
		connect(hardwareWalletDescriptor, failOnLock = false) {
		
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
										return TransportWebUSB.request().then(function(transport) {
										
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
													return TransportWebBluetooth.request().then(function(transport) {
													
														// Set connection type to Bluetooth connection type
														self.connectionType = HardwareWallet.BLUETOOTH_CONNECTION_TYPE;
													
														// Resolve transport
														resolve(transport);
														
													// Catch errors
													}).catch(function(error) {
													
														// Check if error is that user canceled action
														if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NOT_FOUND_ERROR_CODE) || ("name" in error === true && error["name"] === "NotFoundError"))) {
														
															// Reject error
															reject(Message.createText(Language.getDefaultTranslation('No hardware wallet was selected.')));
														}
														
														// Otherwise check if error was a connection error
														else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
														
															// Reject error
															reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + " " + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this site can connect to it.')));
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
													reject(Message.createText(Language.getDefaultTranslation('No hardware wallet was selected.')));
												}
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
										return TransportWebBluetooth.request().then(function(transport) {
										
											// Set connection type to Bluetooth connection type
											self.connectionType = HardwareWallet.BLUETOOTH_CONNECTION_TYPE;
										
											// Resolve transport
											resolve(transport);
											
										// Catch errors
										}).catch(function(error) {
										
											// Check if error is that user canceled action
											if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NOT_FOUND_ERROR_CODE) || ("name" in error === true && error["name"] === "NotFoundError"))) {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('No hardware wallet was selected.')));
											}
											
											// Otherwise check if error was a connection error
											else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
											
												// Reject error
												reject(Message.createText(Language.getDefaultTranslation('Connecting to that hardware wallet failed.')) + " " + Message.createText(Language.getDefaultTranslation('You may need to be already paired with the device before this site can connect to it.')));
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
									return TransportWebUSB.open(hardwareWalletDescriptor).then(function(transport) {
									
										// Set connection type to USB connection type
										self.connectionType = HardwareWallet.USB_CONNECTION_TYPE;
									
										// Resolve transport
										resolve(transport);
										
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(Message.createText(Language.getDefaultTranslation('Connecting to that %1$x hardware wallet failed.'), [hardwareWalletDescriptor["manufacturerName"] + " " + hardwareWalletDescriptor["productName"]]));
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
							
							// Return requesting getting the application information from the hardware wallet
							return self.send(HardwareWallet.BUILT_IN_REQUEST_CLASS, HardwareWallet.BUILT_IN_REQUEST_GET_APPLICATION_INFORMATION_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, HardwareWallet.NO_TEXT, [], false, failOnLock).then(function(response) {
							
								// Check if response contains an application name length
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]) {
								
									// Get application name length
									var applicationNameLength = response[Uint8Array["BYTES_PER_ELEMENT"]];
									
									// Check if response contains an application name
									if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength) {
								
										// Get application name from the response
										var applicationName = (new TextDecoder()).decode(response.subarray(Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"], Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength));
										
										// Check if application name is valid
										if(applicationName === HardwareWallet.APPLICATION_NAME) {
										
											// Check if response contains an application version length
											if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"]) {
											
												// Get application version length
												var applicationVersionLength = response[Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength];
												
												// Check if response contains an application version
												if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH >= Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"] + applicationVersionLength) {
										
													// Get application version from the response
													var applicationVersion = (new TextDecoder()).decode(response.subarray(Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"], Uint8Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + applicationNameLength + Uint8Array["BYTES_PER_ELEMENT"] + applicationVersionLength));
													
													// Check if application version is compatible
													if(HardwareWallet.isCompatibleApplicationVersion(applicationVersion) === true) {
													
														// Return requesting getting the seed cookie from the hardware wallet
														return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_SEED_COOKIE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)), HardwareWallet.NO_TEXT, [], false, failOnLock).then(function(response) {
														
															// Check if response is valid
															if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === HardwareWallet.SEED_COOKIE_LENGTH) {
															
																// Get seed cookie from response
																self.seedCookie = response.subarray(0, HardwareWallet.SEED_COOKIE_LENGTH);
																
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
																	reject(Message.createText(Language.getDefaultTranslation('Getting the seed cookie from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
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
															
																// Reject error
																reject(Message.createText(Language.getDefaultTranslation('Getting the seed cookie from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
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
															reject(Message.createText(Language.getDefaultTranslation('The app on that %1$x hardware wallet isn\'t compatible. Update the app on the hardware wallet to version %2$v or newer to continue.'), [productName, HardwareWallet.MINIMUM_COMPATIBLE_APPLICATION_VERSION]));
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
														reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
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
													reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
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
												reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
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
											reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
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
										reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
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
								
									// Reject error
									reject(Message.createText(Language.getDefaultTranslation('Getting the app information from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet and that the hardware wallet isn\'t locked.')));
								});
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
						return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_ROOT_PUBLIC_KEY_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32))).then(function(response) {
						
							// Check if response is valid
							if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.SECP256K1_PUBLIC_KEY_LENGTH && Secp256k1Zkp.isValidPublicKey(response.subarray(0, Crypto.SECP256K1_PUBLIC_KEY_LENGTH)) === true) {
							
								// Get root public key from response
								self.rootPublicKey = response.subarray(0, Crypto.SECP256K1_PUBLIC_KEY_LENGTH);
								
								// Release exclusive lock
								self.releaseExclusiveLock();
								
								// Resolve root public key
								resolve(self.getRootPublicKey());
							}
							
							// Otherwise
							else {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('Getting the root public key from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.')));
							}
						
						// Catch errors
						}).catch(function(error) {
						
							// Release exclusive lock
							self.releaseExclusiveLock();
						
							// Check if user rejected the request
							if(typeof error === "object" && error !== null && "statusCode" in error === true && error["statusCode"] === HardwareWallet.USER_REJECTED_RESPONSE_STATUS) {
							
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('Exporting the root public key on that %1$x hardware wallet was denied.'), [productName]));
							}
							
							// Otherwise
							else {
						
								// Reject error
								reject(Message.createText(Language.getDefaultTranslation('Getting the root public key from that %1$x hardware wallet failed.'), [productName]) + " " + Message.createText(Language.getDefaultTranslation('Make sure that the correct app is open on the hardware wallet.')));
							}
						});
					}
					
					// Otherwise
					else {
					
						// Release exclusive lock
						self.releaseExclusiveLock();
					
						// Reject error
						reject(Message.createText(Language.getDefaultTranslation('That hardware wallet isn\'t connected.')));
					}
				});
			});
		}
		
		// Get commit
		getCommit(amount, identifier, switchType, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_COMMITMENT_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Identifier
								Buffer.from(identifier.getValue()),
								
								// Amount
								Buffer.from(amount.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
								
								// Switch type
								Buffer.from(new Uint8Array([switchType]))
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.COMMIT_LENGTH && Secp256k1Zkp.isValidCommit(response.subarray(0, Crypto.COMMIT_LENGTH)) === true) {
								
									// Get commit from response
									var commit = response.subarray(0, Crypto.COMMIT_LENGTH);
									
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
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
		
		// Get proof
		getProof(amount, identifier, switchType, message, proofBuilder, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_COMMITMENT_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Identifier
								Buffer.from(identifier.getValue()),
								
								// Amount
								Buffer.from(amount.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
								
								// Switch type
								Buffer.from(new Uint8Array([switchType]))
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.COMMIT_LENGTH && Secp256k1Zkp.isValidCommit(response.subarray(0, Crypto.COMMIT_LENGTH)) === true) {
								
									// Get commit from response
									var commit = response.subarray(0, Crypto.COMMIT_LENGTH);
									
									// Return getting rewind nonce from the proof builder
									return proofBuilder.rewindNonce(commit).then(function(rewindNonce) {
									
										// Try
										try {
									
											// Return requesting getting the proof components from the hardware wallet
											return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_BULLETPROOF_COMPONENTS_INSTRUCTION, message, HardwareWallet.NO_PARAMETER, Buffer.concat([
											
												// Account
												Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
												
												// Identifier
												Buffer.from(identifier.getValue()),
												
												// Amount
												Buffer.from(amount.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
												
												// Switch type
												Buffer.from(new Uint8Array([switchType]))
												
											]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
											
												// Check if response is valid
												if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH && Secp256k1Zkp.isValidPublicKey(response.subarray(Crypto.TAU_X_LENGTH, Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH)) === true && Secp256k1Zkp.isValidPublicKey(response.subarray(Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH, Crypto.TAU_X_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH + Crypto.SECP256K1_PUBLIC_KEY_LENGTH)) === true) {
												
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
													
														// Reject
														reject();
														
														// Return
														return;
													}
													
													// Check if creating proof with the tau x, t one, t two, commit, amount, rewind nonce, and proof message was successful
													var proof = Secp256k1Zkp.createBulletproofBlindless(tauX, tOne, tTwo, commit, amount.toFixed(), rewindNonce, new Uint8Array([]), proofMessage);
													
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
										
											// Reject
											reject();
										}
									
									// Catch errors
									}).catch(function(error) {
									
										// Release exclusive lock
										self.releaseExclusiveLock();
									
										// Reject
										reject();
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_ADDRESS_INSTRUCTION, HardwareWallet.TOR_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Index
								Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Tor.ADDRESS_LENGTH) {
								
									// Try
									try {
									
										// Get Tor address from response
										var torAddress = (new TextDecoder()).decode(response.subarray(0, Tor.ADDRESS_LENGTH));
									
										// Get public key from Tor address
										Tor.torAddressToPublicKey(torAddress);
									}
									
									// Catch errors
									catch(error) {
									
										// Reject
										reject();
										
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_VERIFY_ADDRESS_INSTRUCTION, HardwareWallet.TOR_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Index
								Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 0) {
								
									// Resolve
									resolve(resolve);
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
							
								// Check if user rejected the request
								if(typeof error === "object" && error !== null && "statusCode" in error === true && error["statusCode"] === HardwareWallet.USER_REJECTED_RESPONSE_STATUS) {
								
									// Reject user rejected error
									reject(HardwareWallet.USER_REJECTED_ERROR);
								}
								
								// Otherwise
								else {
							
									// Reject error
									reject(error);
								}
							});
						}
						
						// Catch errors
						catch(error) {
						
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_ADDRESS_INSTRUCTION, HardwareWallet.MQS_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Index
								Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Mqs.ADDRESS_LENGTH) {
								
									// Try
									try {
									
										// Get MQS address from response
										var mqsAddress = (new TextDecoder()).decode(response.subarray(0, Mqs.ADDRESS_LENGTH));
									
										// Get public key from MQS address
										Mqs.mqsAddressToPublicKey(mqsAddress, Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE);
									}
									
									// Catch errors
									catch(error) {
									
										// Reject
										reject();
										
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_VERIFY_ADDRESS_INSTRUCTION, HardwareWallet.MQS_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Index
								Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 0) {
								
									// Resolve
									resolve(resolve);
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
							
								// Check if user rejected the request
								if(typeof error === "object" && error !== null && "statusCode" in error === true && error["statusCode"] === HardwareWallet.USER_REJECTED_RESPONSE_STATUS) {
								
									// Reject user rejected error
									reject(HardwareWallet.USER_REJECTED_ERROR);
								}
								
								// Otherwise
								else {
							
									// Reject error
									reject(error);
								}
							});
						}
						
						// Catch errors
						catch(error) {
						
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_GET_ADDRESS_INSTRUCTION, HardwareWallet.SLATEPACK_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Index
								Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Slatepack.ADDRESS_LENGTH) {
								
									// Try
									try {
									
										// Get Slatepack address from response
										var slatepackAddress = (new TextDecoder()).decode(response.subarray(0, Slatepack.ADDRESS_LENGTH));
									
										// Get public key from Slatepack address
										Slatepack.slatepackAddressToPublicKey(slatepackAddress);
									}
									
									// Catch errors
									catch(error) {
									
										// Reject
										reject();
										
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_VERIFY_ADDRESS_INSTRUCTION, HardwareWallet.SLATEPACK_ADDRESS_TYPE, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Index
								Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Release exclusive lock
								self.releaseExclusiveLock();
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 0) {
								
									// Resolve
									resolve(resolve);
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
							
								// Check if user rejected the request
								if(typeof error === "object" && error !== null && "statusCode" in error === true && error["statusCode"] === HardwareWallet.USER_REJECTED_RESPONSE_STATUS) {
								
									// Reject user rejected error
									reject(HardwareWallet.USER_REJECTED_ERROR);
								}
								
								// Otherwise
								else {
							
									// Reject error
									reject(error);
								}
							});
						}
						
						// Catch errors
						catch(error) {
						
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
								return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_START_DECRYPTING_SLATE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
								
									// Account
									Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
									
									// Index
									Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
									
									// Nonce
									Buffer.from(nonce),
									
									// Address
									Buffer.from(address),
									
									// Salt
									Buffer.from((salt !== HardwareWallet.NO_SALT) ? salt : [])
									
								]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
								
									// Check if response is valid
									if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 0) {
									
										// Get encrypted data from slate
										var encryptedData = slate.subarray(0, slate["length"] - Slatepack.TAG_LENGTH);
										
										// Set decrypt chunk
										var decryptChunk = new Promise(function(resolve, reject) {
										
											// Resolve
											resolve();
										});
										
										// Initialize decrypting chunks
										var decryptingChunks = [];
									
										// Go through all of the encrypted data chunks
										for(let i = 0; i < Math.ceil(encryptedData["length"] / HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE); ++i) {
										
											// Decrypt chunk after the previous chunk is decrypted
											decryptChunk = decryptChunk.then(function() {
											
												// Return promise
												return new Promise(function(resolve, reject) {
												
													// Return decrypting chunk on the hardware wallet
													return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_DECRYPTING_SLATE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.from(encryptedData.subarray(i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE, Math.min(encryptedData["length"], i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE + HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE))), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
													
														// Check if response is valid
														if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH > 0) {
														
															// Get decrypted data chunk from response
															var decryptedDataChunk = response.subarray(0, response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH);
															
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
											return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_FINISH_DECRYPTING_SLATE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.from(tag), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
												
												// Check if response is valid
												if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.AES_KEY_LENGTH) {
												
													// Get AES key from response
													var aesKey = response.subarray(0, Crypto.AES_KEY_LENGTH);
													
													// Initialize AES decrypt chunks
													var aesDecryptChunks = [];
													
													// Go through all decrypted chunks
													for(var i = 0; i < decryptedDataChunks["length"]; ++i) {
													
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
								
									// Reject error
									reject(error);
								});
							}
							
							// Catch errors
							catch(error) {
							
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
								return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_START_ENCRYPTING_SLATE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
								
									// Account
									Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
									
									// Index
									Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
									
									// Address
									Buffer.from(address)
									
								]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
								
									// Check if response is valid
									if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Slatepack.NONCE_LENGTH) {
									
										// Get nonce from response
										var nonce = response.subarray(0, Slatepack.NONCE_LENGTH);
									
										// Get decrypted data from slate
										var decryptedData = slate;
										
										// Set encrypt chunk
										var encryptChunk = new Promise(function(resolve, reject) {
										
											// Resolve
											resolve();
										});
										
										// Initialize encrypting chunks
										var encryptingChunks = [];
									
										// Go through all of the decrypted data chunks
										for(let i = 0; i < Math.ceil(decryptedData["length"] / HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE); ++i) {
										
											// Encrypt chunk after the previous chunk is encrypted
											encryptChunk = encryptChunk.then(function() {
											
												// Return promise
												return new Promise(function(resolve, reject) {
												
													// Return encrypting chunk on the hardware wallet
													return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_ENCRYPTING_SLATE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.from(decryptedData.subarray(i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE, Math.min(decryptedData["length"], i * HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE + HardwareWallet.ENCRYPTION_AND_DECRYPTION_MAXIMUM_CHUNK_SIZE))), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
													
														// Check if response is valid
														if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH > 0) {
														
															// Get encrypted data chunk from response
															var encryptedDataChunk = response.subarray(0, response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH);
															
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
											return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_FINISH_ENCRYPTING_SLATE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
											
												// Release exclusive lock
												self.releaseExclusiveLock();
												
												// Check if response is valid
												if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Slatepack.TAG_LENGTH) {
												
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
								
									// Reject error
									reject(error);
								});
							}
							
							// Catch errors
							catch(error) {
							
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_START_TRANSACTION_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Account
								Buffer.from((new BigNumber(HardwareWallet.ACCOUNT)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Index
								Buffer.from((new BigNumber(index)).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT32)),
								
								// Output
								Buffer.from(output.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
								
								// Input
								Buffer.from(input.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
								
								// Fee
								Buffer.from(fee.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
								
								// Secret nonce index
								Buffer.from(new Uint8Array([secretNonceIndex])),
								
								// Address
								Buffer.from((address !== HardwareWallet.NO_ADDRESS) ? address : [])
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 0) {
								
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch error
						catch(error) {
						
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
		
		// Include output in transaction
		includeOutputInTransaction(amount, identifier, switchType, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_TRANSACTION_INCLUDE_OUTPUT_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Identifier
								Buffer.from(identifier.getValue()),
								
								// Amount
								Buffer.from(amount.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
								
								// Switch type
								Buffer.from(new Uint8Array([switchType]))
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 0) {
								
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Reject
							reject();
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
		includeInputInTransaction(amount, identifier, switchType, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
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
							return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_TRANSACTION_INCLUDE_INPUT_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
							
								// Identifier
								Buffer.from(identifier.getValue()),
								
								// Amount
								Buffer.from(amount.toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64)),
								
								// Switch type
								Buffer.from(new Uint8Array([switchType]))
								
							]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
							
								// Check if response is valid
								if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 0) {
								
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
							
								// Reject error
								reject(error);
							});
						}
						
						// Catch errors
						catch(error) {
						
							// Reject
							reject();
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
						return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_TRANSACTION_APPLY_OFFSET_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.from(offset), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH <= 1) {
							
								// Get secret nonce index from response
								var secretNonceIndex = (response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === 1) ? response[0] : HardwareWallet.NO_SECRET_NONCE_INDEX;
							
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
						return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_TRANSACTION_GET_PUBLIC_KEY_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.SECP256K1_PUBLIC_KEY_LENGTH && Secp256k1Zkp.isValidPublicKey(response.subarray(0, Crypto.SECP256K1_PUBLIC_KEY_LENGTH)) === true) {
							
								// Get public key from response
								var publicKey = response.subarray(0, Crypto.SECP256K1_PUBLIC_KEY_LENGTH);
							
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
						return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_TRANSACTION_GET_PUBLIC_NONCE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_DATA, text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.SECP256K1_PUBLIC_KEY_LENGTH && Secp256k1Zkp.isValidPublicKey(response.subarray(0, Crypto.SECP256K1_PUBLIC_KEY_LENGTH)) === true) {
							
								// Get public nonce from response
								var publicNonce = response.subarray(0, Crypto.SECP256K1_PUBLIC_KEY_LENGTH);
							
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
		getTransactionMessageSignature(message, publicKey, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if exclusive lock is locked
				if(self.exclusiveLockObtained === true) {
			
					// Check if connected
					if(self.isConnected() === true) {
					
						// Return requesting getting the transaction message signature from the hardware wallet
						return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_CONTINUE_TRANSACTION_GET_MESSAGE_SIGNATURE_INSTRUCTION, HardwareWallet.NO_PARAMETER, HardwareWallet.NO_PARAMETER, Buffer.concat([
								
							// Public key
							Buffer.from(publicKey),
							
							// Message
							Buffer.from((new TextEncoder()).encode(message))
							
						]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH === Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH) {
							
								// Get signature from response
								var signature = response.subarray(0, Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH);
							
								// Resolve signature
								resolve(signature);
							}
							
							// Otherwise
							else {
							
								// Reject
								reject();
							}
						
						// Catch errors
						}).catch(function(error) {
						
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
						
							// Reject
							reject();
							
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
						}
						
						// Return requesting finishing the transaction on the hardware wallet
						return self.send(HardwareWallet.REQUEST_CLASS, HardwareWallet.REQUEST_FINISH_TRANSACTION_INSTRUCTION, addressType, HardwareWallet.NO_PARAMETER, Buffer.concat([
						
							// Public nonce
							Buffer.from(publicNonce),
							
							// Public key
							Buffer.from(publicKey),
							
							// Kernel information
							Buffer.from(kernelInformation),
							
							// Kernel commit
							Buffer.from((kernelCommit !== HardwareWallet.NO_KERNEL_COMMIT) ? kernelCommit : []),
							
							// Receiver signature
							Buffer.from((receiverSignature !== Slate.NO_RECEIVER_SIGNATURE) ? receiverSignature : [])
							
						]), text, textArguments, allowUnlock, false, preventMessages, cancelOccurred).then(function(response) {
						
							// Check if response is valid
							if(response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH >= Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH && Secp256k1Zkp.isValidSingleSignerSignature(response.subarray(0, Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH)) === true) {
							
								// Get signature from response
								var signature = response.subarray(0, Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH);
								
								// Get payment proof from response
								var paymentProof = (response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH > Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH) ? response.subarray(Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH, response["length"] - HardwareWallet.RESPONSE_DELIMITER_LENGTH) : HardwareWallet.NO_PAYMENT_PROOF;
								
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
						
							// Check if user rejected the request
							if(typeof error === "object" && error !== null && "statusCode" in error === true && error["statusCode"] === HardwareWallet.USER_REJECTED_RESPONSE_STATUS) {
							
								// Reject user rejected error
								reject(HardwareWallet.USER_REJECTED_ERROR);
							}
							
							// Otherwise
							else {
						
								// Reject error
								reject(error);
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
		
		// Get available hardware wallet descriptors
		static getAvailableHardwareWalletDescriptors() {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting available hardware wallet descriptors
				return TransportWebUSB.list().then(function(availableHardwareWalletDescriptors) {
				
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
		
			// Return if USB or Bluetooth and BigInt are supported
			return ("usb" in navigator === true || "bluetooth" in navigator === true) && typeof BigInt === "function";
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
		send(requestClass, requestInstruction, parameterOne, parameterTwo, data = HardwareWallet.NO_DATA, text = HardwareWallet.NO_TEXT, textArguments = [], allowUnlock = false, failOnLock = false, preventMessages = false, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Get product name
			var productName = this.transport["deviceModel"]["productName"];
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if cancel didn't occur
				if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
				
					// Return performing the instruction on the hardware wallet
					return self.transport.send(requestClass, requestInstruction, parameterOne, parameterTwo, (data !== HardwareWallet.NO_DATA) ? data : Buffer.from([])).then(function(response) {
					
						// Resolve response
						resolve(response);
						
					// Catch errors
					}).catch(function(error) {
					
						// Check if the hardware wallet is locked and not set to fail on lock
						if(typeof error === "object" && error !== null && "statusCode" in error === true && (error["statusCode"] === HardwareWallet.DEVICE_LOCKED_RESPONSE_STATUS || error["statusCode"] === HardwareWallet.OPERATING_SYSTEM_LOCKED_RESPONSE_STATUS) && failOnLock === false) {
						
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
												return self.transport.send(requestClass, requestInstruction, parameterOne, parameterTwo, (data !== HardwareWallet.NO_DATA) ? data : Buffer.from([])).then(function(response) {
												
													// Clear locked
													self.locked = false;
												
													// Trigger unlock event
													$(self).trigger(HardwareWallet.UNLOCK_EVENT);
													
													// Check if showing message an the message is shown
													if(text !== HardwareWallet.NO_TEXT) {
													
														// Return waiting until showing message has finished
														return showMessage.then(function() {
														
															// Resolve response
															resolve(response);
														});
													}
													
													// Otherwise
													else {
												
														// Resolve response
														resolve(response);
													}
												
												// Catch errors
												}).catch(function(error) {
												
													// Check if the hardware wallet is locked and not set to fail on lock
													if(typeof error === "object" && error !== null && "statusCode" in error === true && (error["statusCode"] === HardwareWallet.DEVICE_LOCKED_RESPONSE_STATUS || error["statusCode"] === HardwareWallet.OPERATING_SYSTEM_LOCKED_RESPONSE_STATUS) && failOnLock === false) {
													
														// Return resend
														return resend().then(function(response) {
														
															// Resolve response
															resolve(response);
														
														// Catch error
														}).catch(function(error) {
														
															// Reject error
															reject(error);
														});
													}
													
													// Otherwise check if error is that the device was disconnected
													else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
													
														// Clear locked
														self.locked = false;
														
														// Trigger before disconnect event
														$(self).trigger(HardwareWallet.BEFORE_DISCONNECT_EVENT);
														
														// Check if showing message an the message is shown and not canceled
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
							
								// Resolve response
								resolve(response);
							
							// Catch error
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
						
						// Otherwise check if error is that the device was disconnected
						else if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWallet.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
						
							// Reject disconnected error
							reject(HardwareWallet.DISCONNECTED_ERROR);
						}
						
						// Otherwise
						else {
						
							// Reject error
							reject(error);
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
		
		// Is compatible application version
		static isCompatibleApplicationVersion(applicationVersion) {
		
			// Get application version parts from the application version
			var applicationVersionParts = applicationVersion.match(HardwareWallet.APPLICATION_VERSION_STRING_PATTERN);
			
			// Check if getting application version parts was successful
			if(applicationVersionParts !== Common.NO_MATCH_FOUND) {
			
				// Get minimum compatible application version parts
				var minimumCompatibleApplicationVersionParts = HardwareWallet.MINIMUM_COMPATIBLE_APPLICATION_VERSION.match(HardwareWallet.APPLICATION_VERSION_STRING_PATTERN);
			
				// Go through all application version parts
				for(var i = 0; i < applicationVersionParts["length"]; ++i) {
				
					// Check if application version part is greater than the minimum compatible application version part
					if((new BigNumber(applicationVersionParts[i])).isGreaterThan(minimumCompatibleApplicationVersionParts[i]) === true) {
					
						// Return true
						return true;
					}
					
					// Otherwise check if application version part is less than the minimum compatible application version part
					else if((new BigNumber(applicationVersionParts[i])).isLessThan(minimumCompatibleApplicationVersionParts[i]) === true) {
					
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
				
				// Grin wallet
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
			}
		}
		
		// Application version string pattern
		static get APPLICATION_VERSION_STRING_PATTERN() {
		
			// Return hex string pattern
			return /^(\d+)\.(\d+)\.(\d+)$/u;
		}
		
		// Minimum compatible application version
		static get MINIMUM_COMPATIBLE_APPLICATION_VERSION() {
		
			// Return minimum compatible application version
			return "5.0.0";
		}
		
		// Built-in request class
		static get BUILT_IN_REQUEST_CLASS() {
		
			// Return built-in request class
			return 0xB0;
		}
		
		// Built-in request get application information instruction
		static get BUILT_IN_REQUEST_GET_APPLICATION_INFORMATION_INSTRUCTION() {
		
			// Return built-in request get application information instruction
			return 1;
		}
		
		// Request class
		static get REQUEST_CLASS() {
		
			// Return request class
			return 0xC7;
		}
		
		// Request get root public key instruction
		static get REQUEST_GET_ROOT_PUBLIC_KEY_INSTRUCTION() {

			// Return request get root public key instruction
			return 0;
		}

		// Request get address instruction
		static get REQUEST_GET_ADDRESS_INSTRUCTION() {

			// Return request get address instruction
			return HardwareWallet.REQUEST_GET_ROOT_PUBLIC_KEY_INSTRUCTION + 1;
		}

		// Request get seed cookie instruction
		static get REQUEST_GET_SEED_COOKIE_INSTRUCTION() {

			// Return request get seed cookie instruction
			return HardwareWallet.REQUEST_GET_ADDRESS_INSTRUCTION + 1;
		}

		// Request get commitment instruction
		static get REQUEST_GET_COMMITMENT_INSTRUCTION() {

			// Return request get commitment instruction
			return HardwareWallet.REQUEST_GET_SEED_COOKIE_INSTRUCTION + 1;
		}

		// Request get bulletproof components instruction
		static get REQUEST_GET_BULLETPROOF_COMPONENTS_INSTRUCTION() {

			// Return request get bulletproof components instruction
			return HardwareWallet.REQUEST_GET_COMMITMENT_INSTRUCTION + 1;
		}

		// Request verify root public key instruction
		static get REQUEST_VERIFY_ROOT_PUBLIC_KEY_INSTRUCTION() {

			// Return request verify root public key instruction
			return HardwareWallet.REQUEST_GET_BULLETPROOF_COMPONENTS_INSTRUCTION + 1;
		}

		// Request verify address instruction
		static get REQUEST_VERIFY_ADDRESS_INSTRUCTION() {

			// Return request verify address instruction
			return HardwareWallet.REQUEST_VERIFY_ROOT_PUBLIC_KEY_INSTRUCTION + 1;
		}

		// Request start encrypting slate instruction
		static get REQUEST_START_ENCRYPTING_SLATE_INSTRUCTION() {

			// Return request start encrypting slate instruction
			return HardwareWallet.REQUEST_VERIFY_ADDRESS_INSTRUCTION + 1;
		}

		// Request continue encrypting slate instruction
		static get REQUEST_CONTINUE_ENCRYPTING_SLATE_INSTRUCTION() {

			// Return request continue encrypting slate instruction
			return HardwareWallet.REQUEST_START_ENCRYPTING_SLATE_INSTRUCTION + 1;
		}

		// Request finish encrypting slate instruction
		static get REQUEST_FINISH_ENCRYPTING_SLATE_INSTRUCTION() {

			// Return request finish encrypting slate instruction
			return HardwareWallet.REQUEST_CONTINUE_ENCRYPTING_SLATE_INSTRUCTION + 1;
		}

		// Request start decrypting slate instruction
		static get REQUEST_START_DECRYPTING_SLATE_INSTRUCTION() {

			// Return request start decrypting slate instruction
			return HardwareWallet.REQUEST_FINISH_ENCRYPTING_SLATE_INSTRUCTION + 1;
		}

		// Request continue decrypting slate instruction
		static get REQUEST_CONTINUE_DECRYPTING_SLATE_INSTRUCTION() {

			// Return request continue decrypting slate instruction
			return HardwareWallet.REQUEST_START_DECRYPTING_SLATE_INSTRUCTION + 1;
		}

		// Request finish decrypting slate instruction
		static get REQUEST_FINISH_DECRYPTING_SLATE_INSTRUCTION() {

			// Return request finish decrypting slate instruction
			return HardwareWallet.REQUEST_CONTINUE_DECRYPTING_SLATE_INSTRUCTION + 1;
		}

		// Request start transaction instruction
		static get REQUEST_START_TRANSACTION_INSTRUCTION() {

			// Return request start transaction instruction
			return HardwareWallet.REQUEST_FINISH_DECRYPTING_SLATE_INSTRUCTION + 1;
		}

		// Request continue transaction include output instruction
		static get REQUEST_CONTINUE_TRANSACTION_INCLUDE_OUTPUT_INSTRUCTION() {

			// Return request continue transaction include output instruction
			return HardwareWallet.REQUEST_START_TRANSACTION_INSTRUCTION + 1;
		}

		// Request continue transaction include input instruction
		static get REQUEST_CONTINUE_TRANSACTION_INCLUDE_INPUT_INSTRUCTION() {

			// Return request continue transaction include input instruction
			return HardwareWallet.REQUEST_CONTINUE_TRANSACTION_INCLUDE_OUTPUT_INSTRUCTION + 1;
		}

		// Request continue transaction apply offset instruction
		static get REQUEST_CONTINUE_TRANSACTION_APPLY_OFFSET_INSTRUCTION() {

			// Return request continue transaction apply offset instruction
			return HardwareWallet.REQUEST_CONTINUE_TRANSACTION_INCLUDE_INPUT_INSTRUCTION + 1;
		}

		// Request continue transaction get public key instruction
		static get REQUEST_CONTINUE_TRANSACTION_GET_PUBLIC_KEY_INSTRUCTION() {

			// Return request continue transaction get public key instruction
			return HardwareWallet.REQUEST_CONTINUE_TRANSACTION_APPLY_OFFSET_INSTRUCTION + 1;
		}
		
		// Request continue transaction get public nonce instruction
		static get REQUEST_CONTINUE_TRANSACTION_GET_PUBLIC_NONCE_INSTRUCTION() {

			// Return request continue transaction get public nonce instruction
			return HardwareWallet.REQUEST_CONTINUE_TRANSACTION_GET_PUBLIC_KEY_INSTRUCTION + 1;
		}
		
		// Request continue transaction get message signature instruction
		static get REQUEST_CONTINUE_TRANSACTION_GET_MESSAGE_SIGNATURE_INSTRUCTION() {

			// Return request continue transaction get message signature instruction
			return HardwareWallet.REQUEST_CONTINUE_TRANSACTION_GET_PUBLIC_NONCE_INSTRUCTION + 1;
		}

		// Request finish transaction instruction
		static get REQUEST_FINISH_TRANSACTION_INSTRUCTION() {

			// Return request finish transaction instruction
			return HardwareWallet.REQUEST_CONTINUE_TRANSACTION_GET_MESSAGE_SIGNATURE_INSTRUCTION + 1;
		}

		// Request get MQS timestamp signature instruction
		static get REQUEST_GET_MQS_TIMESTAMP_SIGNATURE_INSTRUCTION() {

			// Return request get MQS timestamp signature instruction
			return HardwareWallet.REQUEST_FINISH_TRANSACTION_INSTRUCTION + 1;
		}

		// Request get Tor certificate signature instruction
		static get REQUEST_GET_TOR_CERTIFICATE_SIGNATURE_INSTRUCTION() {

			// Return request get Tor certificate signature instruction
			return HardwareWallet.REQUEST_GET_MQS_TIMESTAMP_SIGNATURE_INSTRUCTION + 1;
		}
		
		// Response delimiter length
		static get RESPONSE_DELIMITER_LENGTH() {
		
			// Return response delimiter length
			return (new Uint8Array([0x00, 0x00]))["length"];
		}
		
		// Unknown class response status
		static get UNKNOWN_CLASS_RESPONSE_STATUS() {
		
			// Return unknown class response status
			return 0xB100;
		}
		
		// Unknown instruction response status
		static get UNKNOWN_INSTRUCTION_RESPONSE_STATUS() {
		
			// Return unknown instruction response status
			return HardwareWallet.UNKNOWN_CLASS_RESPONSE_STATUS + 1;
		}
		
		// Malformed request response status
		static get MALFORMED_REQUEST_RESPONSE_STATUS() {
		
			// Return malformed request response status
			return HardwareWallet.UNKNOWN_INSTRUCTION_RESPONSE_STATUS + 1;
		}
		
		// User rejected response status
		static get USER_REJECTED_RESPONSE_STATUS() {
		
			// Return user rejected response status
			return HardwareWallet.MALFORMED_REQUEST_RESPONSE_STATUS + 1;
		}
		
		// Internal error response status
		static get INTERNAL_ERROR_RESPONSE_STATUS() {
		
			// Return internal error response status
			return HardwareWallet.USER_REJECTED_RESPONSE_STATUS + 1;
		}
		
		// Invalid parameters response status
		static get INVALID_PARAMETERS_RESPONSE_STATUS() {
		
			// Return invalid parameters response status
			return 0xD100;
		}
		
		// Internal state response status
		static get INVALID_STATE_RESPONSE_STATUS() {
		
			// Return invalid state response status
			return HardwareWallet.INVALID_PARAMETERS_RESPONSE_STATUS + 1;
		}
		
		// Device locked response status
		static get DEVICE_LOCKED_RESPONSE_STATUS() {
		
			// Return device locked response status
			return HardwareWallet.INVALID_STATE_RESPONSE_STATUS + 1;
		}
		
		// Success response status
		static get SUCCESS_RESPONSE_STATUS() {
		
			// Return success response status
			return 0x9000;
		}
		
		// Operating system locked response status
		static get OPERATING_SYSTEM_LOCKED_RESPONSE_STATUS() {
		
			// Return operating system locked response status
			return 0x5515;
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
}


// Main function

// Set global object's hardware wallet
globalThis["HardwareWallet"] = HardwareWallet;
