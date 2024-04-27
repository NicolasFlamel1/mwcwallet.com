// Use strict
"use strict";


// Classes

// HardwareWallet Bluetooth transport class
class HardwareWalletBluetoothTransport {

	// Public
	
		// Constructor
		constructor(connection, writeCharacteristic, notifyCharacteristic, mtu, productName) {
		
			// Set connection
			this.connection = connection;
			
			// Set write characteristic
			this.writeCharacteristic = writeCharacteristic;
			
			// Set notify characteristic
			this.notifyCharacteristic = notifyCharacteristic;
			
			// Set MTU
			this.mtu = mtu;
		
			// Set allow disconnect event to true
			this.allowDisconnectEvent = true;
			
			// Set type to Ledger
			this.type = HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE;
		
			// Set device model
			this["deviceModel"] = {
			
				// Product name
				"productName": productName
			};
		}
		
		// On
		on(event, callback) {
		
			// Check event
			switch(event) {
			
				// Disconnect
				case "disconnect":
				
					// Set self
					var self = this;
				
					// Create callback once
					var callbackOnce = function() {
					
						// Remove GATT server disconnected event
						self.connection["device"].removeEventListener("gattserverdisconnected", callbackOnce);
						
						// Check if disconnect event is allowed
						if(self.allowDisconnectEvent === true) {
						
							// Call callback
							callback();
						}
					};
				
					// Device GATT server disconnected event
					this.connection["device"].addEventListener("gattserverdisconnected", callbackOnce);
				
					// Return callback once
					return callbackOnce;
			}
		}
		
		// Off
		off(event, callback) {
		
			// Check event
			switch(event) {
			
				// Disconnect
				case "disconnect":
				
					// Remove GATT server disconnected event
					this.connection["device"].removeEventListener("gattserverdisconnected", callback);
					
					// Break
					break;
			}
		}
		
		// Close
		close() {
		
			// Clear allow disconnect event
			this.allowDisconnectEvent = false;
			
			// Check if connection is connected
			if(this.connection["connected"] === true) {
		
				// Disconnect connection
				this.connection.disconnect();
			}
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Resolve
				resolve();
			});
		}
		
		// Send
		send(messageType, parameterOne, parameterTwo, data) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if connection is connected
				if(self.connection["connected"] === true) {
				
					// Create header
					var header = new Uint8Array([messageType >>> HardwareWalletBluetoothTransport.BITS_IN_A_BYTE, messageType, parameterOne, parameterTwo, data["length"]]);
					
					// Create payload
					var payload = new Uint8Array(header["length"] + data["length"]);
					payload.set(header);
					payload.set(data, header["length"]);
			
					// Return sending request to the device
					return HardwareWalletBluetoothTransport.sendRequest(self.connection, self.writeCharacteristic, self.notifyCharacteristic, HardwareWalletBluetoothTransport.LEDGER_SEND_REQUEST_COMMAND_TAG, payload, self.mtu).then(function(response) {
					
						// Check if connection is connected
						if(self.connection["connected"] === true) {
						
							// Check if response contains a message type
							if(response["length"] >= HardwareWalletBluetoothTransport.MESSAGE_TYPE_LENGTH) {
							
								// Get message type
								var messageType = (response[response["length"] - HardwareWalletBluetoothTransport.MESSAGE_TYPE_LENGTH] << HardwareWalletBluetoothTransport.BITS_IN_A_BYTE) | response[response["length"] - (HardwareWalletBluetoothTransport.MESSAGE_TYPE_LENGTH - 1)];
								
								// Resolve
								resolve({
								
									// Message type
									"Message Type": messageType,
									
									// Data
									"Data": response.subarray(0, response["length"] - HardwareWalletBluetoothTransport.MESSAGE_TYPE_LENGTH)
								});
							}
							
							// Otherwise
							else {
							
								// Securely clear response
								response.fill(0);
							
								// Reject
								reject();
							}
						}
						
						// Otherwise
						else {
						
							// Securely clear response
							response.fill(0);
						
							// Reject error
							reject(new DOMException("", "NetworkError"));
						}
						
					// Catch errors
					}).catch(function(error) {
					
						// Check if connection is connected
						if(self.connection["connected"] === true) {
					
							// Reject error
							reject(error);
						}
						
						// Otherwise
						else {
						
							// Reject error
							reject(new DOMException("", "NetworkError"));
						}
					});
				}
				
				// Otherwise
				else {
				
					// Reject error
					reject(new DOMException("", "NetworkError"));
				}
			});
		}

		// Request
		static request(device = HardwareWalletBluetoothTransport.NO_DEVICE) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get device
				var getDevice = function() {
				
					// Return promise
					return new Promise(function(resolve, reject) {
					
						// Check if no device was provided
						if(device === HardwareWalletBluetoothTransport.NO_DEVICE) {
			
							// Return getting device
							return navigator["bluetooth"].requestDevice({
							
								// Filters
								"filters": HardwareWalletBluetoothTransport.DEVICES.map(function(device) {
								
									// Return device's service UUID
									return {
									
										// Services
										"services": [device["Service UUID"]]
									};
								})
							}).then(function(device) {
							
								// Check if device isn't connected
								if(device["gatt"]["connected"] === false) {
							
									// Resolve device
									resolve(device);
								}
								
								// Otherwise
								else {
								
									// Reject error
									reject(new DOMException("", "InvalidStateError"));
								}
								
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
						
						// Otherwise
						else {
						
							// Resolve device
							resolve(device);
						}
					});
				};
				
				// Return getting device
				return getDevice().then(function(device) {
				
					// Get connection
					var getConnection = function() {
					
						// Return promise
						return new Promise(function(resolve, reject) {
						
							// Check if device's connection is already connected
							if(device["gatt"]["connected"] === true) {
							
								// Resolve connection
								resolve(device["gatt"]);
							}
							
							// Otherwise
							else {
							
								// Return getting connection to the device
								return device["gatt"].connect().then(function(connection) {
								
									// Check if connection is connected
									if(connection["connected"] === true) {
								
										// Resolve connection
										resolve(connection);
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
						});
					};
				
					// Return getting connection
					return getConnection().then(function(connection) {
					
						// Check if connection is connected
						if(connection["connected"] === true) {
						
							// Initialize timeout occurred
							var timeoutOccurred = false;
						
							// Connection timeout
							var connectTimeout = setTimeout(function() {
							
								// Set timeout occurred
								timeoutOccurred = true;
							
								// Check if connection is connected
								if(connection["connected"] === true) {
							
									// Disconnect connection
									connection.disconnect();
								}
								
								// Reject
								reject();
								
							}, HardwareWalletBluetoothTransport.CONNECT_TIMEOUT_DURATION_MILLISECONDS);
						
							// Return getting connection's services
							return connection.getPrimaryServices().then(function(services) {
							
								// Check if a timeout didn't occur
								if(timeoutOccurred === false) {
							
									// Clear connect timeout
									clearTimeout(connectTimeout);
							
									// Check if connection is connected
									if(connection["connected"] === true) {
								
										// Initialize device found
										var deviceFound = false;
									
										// Go through all services
										for(var i = 0; i < services["length"] && deviceFound === false; ++i) {
										
											// Check if service has a UUID
											if("uuid" in services[i] === true) {
										
												// Go through all devices
												for(var j = 0; j < HardwareWalletBluetoothTransport.DEVICES["length"]; ++j) {
												
													// Check if device's service UUID is the service's UUID
													if(HardwareWalletBluetoothTransport.DEVICES[j]["Service UUID"] === services[i]["uuid"]) {
													
														// Set device found
														deviceFound = true;
														
														// Set device index
														var deviceIndex = j;
														
														// Set service
														var service = services[i];
														
														// Break
														break;
													}
												}
											}
										}
										
										// Check if device was found
										if(deviceFound === true) {
										
											// Return getting service's notify characteristic
											return service.getCharacteristic(HardwareWalletBluetoothTransport.DEVICES[deviceIndex]["Notify Characteristic UUID"]).then(function(notifyCharacteristic) {
											
												// Check if connection is connected
												if(connection["connected"] === true) {
											
													// Return getting service's write characteristic
													return service.getCharacteristic(HardwareWalletBluetoothTransport.DEVICES[deviceIndex]["Write Characteristic UUID"]).then(function(writeCharacteristic) {
													
														// Check if connection is connected
														if(connection["connected"] === true) {
														
															// Return starting notify characteristic's notifications
															return notifyCharacteristic.startNotifications().then(function() {
															
																// Check if connection is connected
																if(connection["connected"] === true) {
																
																	// Disconnected handler
																	var disconnectedHandler = function() {
																	
																		// Remove GATT server disconnected event
																		device.removeEventListener("gattserverdisconnected", disconnectedHandler);
																	
																		// Stop notifications and catch errors
																		notifyCharacteristic.stopNotifications().catch(function(error) {
																		
																		});
																	};
															
																	// Device GATT server disconnected event
																	device.addEventListener("gattserverdisconnected", disconnectedHandler);
																	
																	// Return getting MTU from the device
																	return HardwareWalletBluetoothTransport.sendRequest(connection, writeCharacteristic, notifyCharacteristic, HardwareWalletBluetoothTransport.LEDGER_GET_MTU_COMMAND_TAG).then(function(response) {
																	
																		// Check if connection is connected
																		if(connection["connected"] === true) {
																		
																			// Check if response is valid
																			if(response["length"] === 1) {
																
																				// Get MTU from response
																				var mtu = Math.min(response[0], HardwareWalletBluetoothTransport.MAXIMUM_MTU);
																				
																				// Check if MTU is valid
																				if(mtu >= HardwareWalletBluetoothTransport.MINIMUM_MTU) {
																				
																					// Create transport
																					var transport = new HardwareWalletBluetoothTransport(connection, writeCharacteristic, notifyCharacteristic, mtu, HardwareWalletBluetoothTransport.DEVICES[deviceIndex]["Product Name"]);
																					
																					// Resolve transport
																					resolve(transport);
																				}
																				
																				// Otherwise
																				else {
																				
																					// Disconnect connection
																					connection.disconnect();
																					
																					// Reject
																					reject();
																				}
																			}
																				
																			// Otherwise
																			else {
																			
																				// Disconnect connection
																				connection.disconnect();
																				
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
																	
																		// Check if connection is connected
																		if(connection["connected"] === true) {
																	
																			// Disconnect connection
																			connection.disconnect();
																		}
																		
																		// Reject error
																		reject(error);
																	});
																}
																
																// Otherwise
																else {
																
																	// Return stopping notifications and catch errors
																	return notifyCharacteristic.stopNotifications().catch(function(error) {
																	
																	// Finally
																	}).finally(function() {
																	
																		// Reject
																		reject();
																	});
																}
																
															// Catch errors
															}).catch(function(error) {
															
																// Check if connection is connected
																if(connection["connected"] === true) {
															
																	// Disconnect connection
																	connection.disconnect();
																}
																
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
													
														// Check if connection is connected
														if(connection["connected"] === true) {
													
															// Disconnect connection
															connection.disconnect();
														}
														
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
											
												// Check if connection is connected
												if(connection["connected"] === true) {
											
													// Disconnect connection
													connection.disconnect();
												}
												
												// Reject error
												reject(error);
											});
										}
										
										// Otherwise
										else {
										
											// Check if connection is connected
											if(connection["connected"] === true) {
										
												// Disconnect connection
												connection.disconnect();
											}
											
											// Reject
											reject();
										}
									}
									
									// Otherwise
									else {
									
										// Reject
										reject();
									}
								}
							
							// Catch errors
							}).catch(function(error) {
							
								// Check if a timeout didn't occur
								if(timeoutOccurred === false) {
								
									// Clear connect timeout
									clearTimeout(connectTimeout);
							
									// Check if connection is connected
									if(connection["connected"] === true) {
								
										// Disconnect connection
										connection.disconnect();
									}
									
									// Check if disconnected error occurred
									if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWalletBluetoothTransport.NETWORK_ERROR_CODE) || ("name" in error === true && error["name"] === "NetworkError"))) {
									
										// Return requesting transport
										return HardwareWalletBluetoothTransport.request(device).then(function(transport) {
										
											// Resolve transport
											resolve(transport);
										
										// Catch errors
										}).catch(function(error) {
										
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
							});
						}
						
						// Otherwise
						else {
						
							// Reject
							reject();
						}
						
					// Catch errors
					}).catch(function(error) {
					
						// Check if device's connection is connected
						if(device["gatt"]["connected"] === true) {
						
							// Disconnect device's connection
							device["gatt"].disconnect();
						}
						
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
	
	// Private
	
		// Create packets
		static createPackets(commandTag, payload = HardwareWalletBluetoothTransport.NO_PAYLOAD, mtu = HardwareWalletBluetoothTransport.DEFAULT_MTU) {
		
			// Initialize packets
			var packets = [];
			
			// Check if payload doesn't exist
			if(payload === HardwareWalletBluetoothTransport.NO_PAYLOAD) {
			
				// Set payload to an empty array
				payload = new Uint8Array([]);
			}
			
			// Initialize payload offset
			var payloadOffset = 0;
			
			// Go through all packets required to send the payload
			for(var i = 0; i === 0 || payloadOffset !== payload["length"]; ++i) {
			
				// Check if at the first packet
				if(i === 0) {
				
					// Create header
					var header = new Uint8Array([commandTag, i >>> HardwareWalletBluetoothTransport.BITS_IN_A_BYTE, i, payload["length"] >>> HardwareWalletBluetoothTransport.BITS_IN_A_BYTE, payload["length"]]);
				}
				
				// Otherwise
				else {
				
					// Create header
					var header = new Uint8Array([commandTag, i >>> HardwareWalletBluetoothTransport.BITS_IN_A_BYTE, i]);
				}
				
				// Get payload part length
				var payloadPartLength = Math.min(payload["length"] - payloadOffset, mtu - header["length"]);
				
				// Create packet
				var packet = new Uint8Array(header["length"] + payloadPartLength);
				packet.set(header);
				packet.set(payload.subarray(payloadOffset, payloadOffset + payloadPartLength), header["length"]);
				
				// Append packet to list
				packets.push(packet);
				
				// Update payload offset
				payloadOffset += payloadPartLength;
			}
			
			// Return packets
			return packets;
		}
		
		// Send request
		static sendRequest(connection, writeCharacteristic, notifyCharacteristic, commandTag, payload = HardwareWalletBluetoothTransport.NO_PAYLOAD, mtu = HardwareWalletBluetoothTransport.DEFAULT_MTU) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if connection is connected
				if(connection["connected"] === true) {
				
					// Initialize response
					var response = new Uint8Array([]);
					
					// Initialize response size
					var responseSize;
					
					// Initialize first response packet
					var firstResponsePacket = true;
					
					// Initialize sequence index
					var lastSequenceIndex;
					
					// Process response packet
					var processResponsePacket = function(event) {
					
						// Get response packet
						var responsePacket = new Uint8Array(event["target"]["value"]["buffer"]);
						
						// Check if response packet is too short
						if((firstResponsePacket === true && responsePacket["length"] < HardwareWalletBluetoothTransport.LEDGER_FIRST_PACKET_HEADER_LENGTH) || (firstResponsePacket === false && responsePacket["length"] <= HardwareWalletBluetoothTransport.LEDGER_NEXT_PACKETS_HEADER_LENGTH)) {
						
							// Remove GATT server disconnected event
							connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
						
							// Remove notify characteristic value changed event
							notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
							
							// Securely clear response packet
							responsePacket.fill(0);
							
							// Securely clear response
							response.fill(0);
							
							// Check if connection is connected
							if(connection["connected"] === true) {
						
								// Reject
								reject();
							}
							
							// Otherwise
							else {
							
								// Reject error
								reject(new DOMException("", "NetworkError"));
							}
						}
						
						// Otherwise
						else {
						
							// Get tag
							var tag = responsePacket[0];
							
							// Check if tag is invalid
							if(tag !== commandTag) {
							
								// Remove GATT server disconnected event
								connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
							
								// Remove notify characteristic value changed event
								notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
								
								// Securely clear response packet
								responsePacket.fill(0);
								
								// Securely clear response
								response.fill(0);
								
								// Check if connection is connected
								if(connection["connected"] === true) {
							
									// Reject
									reject();
								}
								
								// Otherwise
								else {
								
									// Reject error
									reject(new DOMException("", "NetworkError"));
								}
							}
							
							// Otherwise
							else {
							
								// Get sequence index
								var sequenceIndex = (responsePacket[Uint8Array["BYTES_PER_ELEMENT"]] << HardwareWalletBluetoothTransport.BITS_IN_A_BYTE) | responsePacket[Uint8Array["BYTES_PER_ELEMENT"] + 1];
								
								// Check if first response packet
								if(firstResponsePacket === true) {
								
									// Check if sequence index is invalid
									if(sequenceIndex !== 0) {
									
										// Remove GATT server disconnected event
										connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
									
										// Remove notify characteristic value changed event
										notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
										
										// Securely clear response packet
										responsePacket.fill(0);
										
										// Securely clear response
										response.fill(0);
										
										// Check if connection is connected
										if(connection["connected"] === true) {
									
											// Reject
											reject();
										}
										
										// Otherwise
										else {
										
											// Reject error
											reject(new DOMException("", "NetworkError"));
										}
										
										// Return
										return;
									}
									
									// Clear first response packet
									firstResponsePacket = false;
									
									// Get response size
									responseSize = (responsePacket[Uint8Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"]] << HardwareWalletBluetoothTransport.BITS_IN_A_BYTE) | responsePacket[Uint8Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"] + 1];
									
									// Get response part
									var responsePart = responsePacket.subarray(HardwareWalletBluetoothTransport.LEDGER_FIRST_PACKET_HEADER_LENGTH);
								}
								
								// Otherwise
								else {
								
									// Check if sequence index is invalid
									if(sequenceIndex !== lastSequenceIndex + 1) {
									
										// Remove GATT server disconnected event
										connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
									
										// Remove notify characteristic value changed event
										notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
										
										// Securely clear response packet
										responsePacket.fill(0);
										
										// Securely clear response
										response.fill(0);
										
										// Check if connection is connected
										if(connection["connected"] === true) {
									
											// Reject
											reject();
										}
										
										// Otherwise
										else {
										
											// Reject error
											reject(new DOMException("", "NetworkError"));
										}
										
										// Return
										return;
									}
									
									// Get response part
									var responsePart = responsePacket.subarray(HardwareWalletBluetoothTransport.LEDGER_NEXT_PACKETS_HEADER_LENGTH);
								}
								
								// Update last sequence index
								lastSequenceIndex = sequenceIndex;
								
								// Append response part to response
								var currentResponse = new Uint8Array(response["length"] + responsePart["length"]);
								currentResponse.set(response);
								currentResponse.set(responsePart, response["length"]);
								response.fill(0);
								responsePart.fill(0);
								response = currentResponse;
								
								// Check if response is too large
								if(response["length"] > responseSize) {
								
									// Remove GATT server disconnected event
									connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
								
									// Remove notify characteristic value changed event
									notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
									
									// Securely clear response
									response.fill(0);
									
									// Check if connection is connected
									if(connection["connected"] === true) {
								
										// Reject
										reject();
									}
									
									// Otherwise
									else {
									
										// Reject error
										reject(new DOMException("", "NetworkError"));
									}
								}
								
								// Otherwise check if entire response has been received
								else if(response["length"] === responseSize) {
								
									// Remove GATT server disconnected event
									connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
								
									// Remove notify characteristic value changed event
									notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
									
									// Check if connection is connected
									if(connection["connected"] === true) {
									
										// Resolve response
										resolve(response);
									}
									
									// Otherwise
									else {
									
										// Reject error
										reject(new DOMException("", "NetworkError"));
									}
								}
							}
						}
					};
					
					// Disconnected handler
					var disconnectedHandler = function() {
					
						// Remove GATT server disconnected event
						connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
					
						// Remove notify characteristic value changed event
						notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
						
						// Securely clear response
						response.fill(0);
						
						// Reject error
						reject(new DOMException("", "NetworkError"));
					};
					
					// Notify characteristic value changed event
					notifyCharacteristic.addEventListener("characteristicvaluechanged", processResponsePacket);
					
					// Device GATT server disconnected event
					connection["device"].addEventListener("gattserverdisconnected", disconnectedHandler);
					
					// Get packets
					var packets = HardwareWalletBluetoothTransport.createPackets(commandTag, payload, mtu);
					
					// Send packet
					var sendPacket = new Promise(function(resolve, reject) {
					
						// Check if connection is connected
						if(connection["connected"] === true) {
					
							// Resolve
							resolve();
						}
								
						// Otherwise
						else {
						
							// Reject error
							reject(new DOMException("", "NetworkError"));
						}
					});
					
					// Initialize sending packets
					var sendingPackets = [sendPacket];
					
					// Go through all packets
					for(var i = 0; i < packets["length"]; ++i) {
					
						// Get packet
						let packet = packets[i];
						
						// Send next pack after previous packet is send
						sendPacket = sendPacket.then(function() {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if connection is connected
								if(connection["connected"] === true) {
								
									// Return writing packet
									return writeCharacteristic.writeValueWithResponse(packet).then(function() {
									
										// Check if connection is connected
										if(connection["connected"] === true) {
									
											// Resolve
											resolve();
										}
								
										// Otherwise
										else {
										
											// Reject error
											reject(new DOMException("", "NetworkError"));
										}
										
									// Catch errors
									}).catch(function(error) {
									
										// Check if connection is connected
										if(connection["connected"] === true) {
									
											// Reject error
											reject(error);
										}
								
										// Otherwise
										else {
										
											// Reject error
											reject(new DOMException("", "NetworkError"));
										}
									});
								}
								
								// Otherwise
								else {
								
									// Reject error
									reject(new DOMException("", "NetworkError"));
								}
							});
							
						// Catch errors
						}).catch(function(error) {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if connection is connected
								if(connection["connected"] === true) {
							
									// Reject error
									reject(error);
								}
								
								// Otherwise
								else {
								
									// Reject error
									reject(new DOMException("", "NetworkError"));
								}
							});
						});
						
						// Append sending packet to list
						sendingPackets.push(sendPacket);
					}
					
					// Return sending all packets and catch errors
					return Promise.all(sendingPackets).catch(function(error) {
					
						// Remove GATT server disconnected event
						connection["device"].removeEventListener("gattserverdisconnected", disconnectedHandler);
					
						// Remove notify characteristic value changed event
						notifyCharacteristic.removeEventListener("characteristicvaluechanged", processResponsePacket);
						
						// Securely clear response
						response.fill(0);
						
						// Check if connection is connected
						if(connection["connected"] === true) {
						
							// Reject error
							reject(error);
						}
						
						// Otherwise
						else {
						
							// Reject error
							reject(new DOMException("", "NetworkError"));
						}
					});
				}
				
				// Otherwise
				else {
				
					// Reject error
					reject(new DOMException("", "NetworkError"));
				}
			});
		}
		
		// Devices
		static get DEVICES() {
		
			// Return devices
			return [
			
				// Ledger Nano X
				{
				
					// Product name
					"Product Name": "Ledger Nano X",
				
					// Service UUID
					"Service UUID": "13d63400-2c97-0004-0000-4c6564676572",
					
					// Notify characteristic UUID
					"Notify Characteristic UUID": "13d63400-2c97-0004-0001-4c6564676572",
					
					// Write characteristic UUID
					"Write Characteristic UUID": "13d63400-2c97-0004-0002-4c6564676572"
				},
				
				// Ledger Stax
				{
				
					// Product name
					"Product Name": "Ledger Stax",
				
					// Service UUID
					"Service UUID": "13d63400-2c97-6004-0000-4c6564676572",
					
					// Notify characteristic UUID
					"Notify Characteristic UUID": "13d63400-2c97-6004-0001-4c6564676572",
					
					// Write characteristic UUID
					"Write Characteristic UUID": "13d63400-2c97-6004-0002-4c6564676572"
				},
				
				// Ledger Flex
				{
				
					// Product name
					"Product Name": "Ledger Flex",
				
					// Service UUID
					"Service UUID": "13d63400-2c97-3004-0000-4c6564676572",
					
					// Notify characteristic UUID
					"Notify Characteristic UUID": "13d63400-2c97-3004-0001-4c6564676572",
					
					// Write characteristic UUID
					"Write Characteristic UUID": "13d63400-2c97-3004-0002-4c6564676572"
				}
			];
		}
		
		// Default MTU
		static get DEFAULT_MTU() {
		
			// Return default MTU
			return 20;
		}
		
		// Minimum MTU
		static get MINIMUM_MTU() {
		
			// Return minimum MTU
			return 6;
		}
		
		// Maximum MTU
		static get MAXIMUM_MTU() {
		
			// Return maximum MTU
			return 100;
		}
		
		// No payload
		static get NO_PAYLOAD() {
		
			// Return no payload
			return null;
		}
		
		// Ledger get MTU command tag
		static get LEDGER_GET_MTU_COMMAND_TAG() {
		
			// Return Ledger get MTU command tag
			return 0x08;
		}
		
		// Ledger send request command tag
		static get LEDGER_SEND_REQUEST_COMMAND_TAG() {
		
			// Return Ledger send request command tag
			return 0x05;
		}
		
		// Message type length
		static get MESSAGE_TYPE_LENGTH() {
		
			// Return message type length
			return Uint16Array["BYTES_PER_ELEMENT"];
		}
		
		// No device
		static get NO_DEVICE() {
		
			// Return no device
			return null;
		}
		
		// Connect timeout duration milliseconds
		static get CONNECT_TIMEOUT_DURATION_MILLISECONDS() {
		
			// Return connect timeout duration milliseconds
			return 4000;
		}
		
		// Bits in a byte
		static get BITS_IN_A_BYTE() {
		
			// Rerurn bits in a byte
			return 8;
		}
		
		// Ledger first packet header length
		static get LEDGER_FIRST_PACKET_HEADER_LENGTH() {
		
			// Return Ledger first packet header length
			return 5;
		}
		
		// Ledger next packets header length
		static get LEDGER_NEXT_PACKETS_HEADER_LENGTH() {
		
			// Return Ledger next packets header length
			return 3;
		}
		
		// Network error code
		static get NETWORK_ERROR_CODE() {
		
			// Return network error code
			return 19;
		}
}


// Main function

// Set global object's hardware wallet Bluetooth transport
globalThis["HardwareWalletBluetoothTransport"] = HardwareWalletBluetoothTransport;
