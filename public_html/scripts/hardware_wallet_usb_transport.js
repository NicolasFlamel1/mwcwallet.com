// Use strict
"use strict";


// Classes

// HardwareWallet USB transport class
class HardwareWalletUsbTransport {

	// Public
	
		// Constructor
		constructor(device, interfaceNumber) {
		
			// Set device
			this.device = device;
			
			// Set interface number
			this.interfaceNumber = interfaceNumber;
			
			// Set allow disconnect event to true
			this.allowDisconnectEvent = true;
			
			// Set product name
			var productName = device["manufacturerName"] + " " + device["productName"];
			
			// Go through all devices
			for(var i = 0; i < HardwareWalletUsbTransport.DEVICES["length"]; ++i) {
			
				// Check if device's vendor ID matches the device's
				if(device["vendorId"] === HardwareWalletUsbTransport.DEVICES[i]["Vendor ID"]) {
				
					// Set type to device's type
					this.type = HardwareWalletUsbTransport.DEVICES[i]["Type"];
					
					// Check if device's product ID matches the device's
					if("Product ID" in HardwareWalletUsbTransport.DEVICES[i] === false || device["productId"] === HardwareWalletUsbTransport.DEVICES[i]["Product ID"]) {
					
						// Check if device has a product name
						if("Product Name" in HardwareWalletUsbTransport.DEVICES[i] === true) {
					
							// Set product name
							productName = HardwareWalletUsbTransport.DEVICES[i]["Product Name"];
						}
						
						// Break
						break;
					}
				}
			}
			
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
					var callbackOnce = function(event) {
					
						// Check if device was disconnected
						if(event["device"] === self.device) {
					
							// Remove USB disconnect event
							navigator["usb"].removeEventListener("disconnect", callbackOnce);
							
							// Check if disconnect event is allowed
							if(self.allowDisconnectEvent === true) {
							
								// Call callback
								callback();
							}
						}
					};
				
					// USB disconnect event
					navigator["usb"].addEventListener("disconnect", callbackOnce);
					
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
				
					// Remove USB disconnect event
					navigator["usb"].removeEventListener("disconnect", callback);
					
					// Break
					break;
			}
		}
		
		// Close
		close() {
		
			// Clear allow disconnect event
			this.allowDisconnectEvent = false;
			
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return releasing device interface and catch errors
				return self.device.releaseInterface(self.interfaceNumber).catch(function(error) {
				
				// Finally
				}).finally(function() {
				
					// Return resetting device and catch errors
					return self.device.reset().catch(function(error) {
					
					// Finally
					}).finally(function() {
			
						// Return closing device and catch errors
						return self.device.close().then(function() {
						
							// Resolve
							resolve();
							
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					});
				});
			});
		}
		
		// Send
		send(messageType, parameterOne, parameterTwo, data) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check type
				switch(self.type) {
				
					// Ledger type
					case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
					
						// Create header
						var header = new Uint8Array([messageType >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, messageType, parameterOne, parameterTwo, data["length"]]);
						
						// Break
						break;
					
					// Trezor type
					case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
					
						// Create header
						var header = new Uint8Array([messageType >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, messageType, data["length"] >>> (HardwareWalletUsbTransport.BITS_IN_A_BYTE * 3), data["length"] >>> (HardwareWalletUsbTransport.BITS_IN_A_BYTE * 2), data["length"] >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, data["length"]]);
					
						// Break
						break;
				}
				
				// Create message
				var message = new Uint8Array(header["length"] + data["length"]);
				message.set(header);
				message.set(data, header["length"]);
		
				// Return sending message to the device
				return HardwareWalletUsbTransport.sendRequest(self.device, self.type, message).then(function(response) {
				
					// Check if response contains a message type
					if(response["length"] >= HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH) {
					
						// Get message type
						var messageType = (response[response["length"] - HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | response[response["length"] - (HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH - 1)];
						
						// Resolve
						resolve({
						
							// Message type
							"Message Type": messageType,
							
							// Data
							"Data": response.subarray(0, response["length"] - HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH)
						});
					}
					
					// Otherwise
					else {
					
						// Securely clear response
						response.fill(0);
					
						// Reject
						reject();
					}
					
				// Catch errors
				}).catch(function(error) {
				
					// Check if error is that the device was disconnected
					if(typeof error === "object" && error !== null && (("code" in error === true && error["code"] === HardwareWalletUsbTransport.NOT_FOUND_ERROR_CODE) || ("name" in error === true && error["name"] === "NotFoundError"))) {
					
						// Reject error
						reject(new DOMException("", "NetworkError"));
					}
					
					// Otherwise
					else {
				
						// Reject error
						reject(error);
					}
				});
			});
		}
		
		// Request
		static request(device = HardwareWalletUsbTransport.NO_DEVICE) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Get device
				var getDevice = function() {
				
					// Return promise
					return new Promise(function(resolve, reject) {
			
						// Check if no device was provided
						if(device === HardwareWalletUsbTransport.NO_DEVICE) {
						
							// Return requesting USB device
							return navigator["usb"].requestDevice({
							
								// Filters
								"filters": HardwareWalletUsbTransport.DEVICES.map(function(device) {
								
									// Check if device has a product ID
									if("Product ID" in device === true) {
									
										// Return device's vendor ID and product ID
										return {
										
											// Vendor ID
											"vendorId": device["Vendor ID"],
											
											// Product ID
											"productId": device["Product ID"]
										};
									}
									
									// Otherwise
									else {
								
										// Return device's vendor ID
										return {
										
											// Vendor ID
											"vendorId": device["Vendor ID"]
										};
									}
								})
								
							}).then(function(device) {
							
								// Check if device isn't opened
								if(device["opened"] === false) {
							
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
						
							// Initialize device applicable
							var deviceApplicable = false;
						
							// Go through all devices
							for(var i = 0; i < HardwareWalletUsbTransport.DEVICES["length"]; ++i) {
							
								// Check if device's vendor ID and product ID match the device's
								if(device["vendorId"] === HardwareWalletUsbTransport.DEVICES[i]["Vendor ID"] && ("Product ID" in HardwareWalletUsbTransport.DEVICES[i] === false || device["productId"] === HardwareWalletUsbTransport.DEVICES[i]["Product ID"])) {
								
									// Set device applicable
									deviceApplicable = true;
									
									// Break
									break;
								}
							}
						
							// Check if device is applicable
							if(deviceApplicable === true) {
							
								// Check if device isn't opened
								if(device["opened"] === false) {
							
									// Resolve device
									resolve(device);
								}
								
								// Otherwise
								else {
								
									// Reject error
									reject(new DOMException("", "InvalidStateError"));
								}
							}
							
							// Otherwise
							else {
							
								// Reject
								reject();
							}
						}
					});
				};
				
				// Return getting device
				return getDevice().then(function(device) {
				
					// Return opening device
					return device.open().then(function() {
					
						// Return selecting device's configuration
						return device.selectConfiguration(HardwareWalletUsbTransport.CONFIGURATION).then(function() {
						
							// Return resetting device and catch errors
							return device.reset().catch(function(error) {
							
							// Finally
							}).finally(function() {
						
								// Initialize interface found
								var interfaceFound = false;
									
								// Go through all the configuration's interfaces
								for(var i = 0; i < device["configurations"][0]["interfaces"]["length"] && interfaceFound === false; ++i) {
								
									// Go through all of the interface's alternates
									for(var j = 0; j < device["configurations"][0]["interfaces"][i]["alternates"]["length"]; ++j) {
									
										// Check if alternates is for WebUSB
										if(device["configurations"][0]["interfaces"][i]["alternates"][j]["interfaceClass"] === HardwareWalletUsbTransport.WEBUSB_INTERFACE_CLASS) {
										
											// Set interface found
											interfaceFound = true;
											
											// Set interface number
											var interfaceNumber = device["configurations"][0]["interfaces"][i]["interfaceNumber"];
											
											// Break
											break;
										}
									}
								}
								
								// Check if interface was found
								if(interfaceFound === true) {
								
									// Return claiming interface
									return device.claimInterface(interfaceNumber).then(function() {
							
										// Create transport for the device
										var transport = new HardwareWalletUsbTransport(device, interfaceNumber);
										
										// Resolve transport
										resolve(transport);
									
									// Catch errors
									}).catch(function(error) {
									
										// Return closing device and catch errors
										return device.close().catch(function(error) {
										
										// Finally
										}).finally(function() {
									
											// Reject error
											reject(error);
										});
									});
								}
								
								// Otherwise
								else {
								
									// Return closing device and catch errors
									return device.close().catch(function(error) {
									
									// Finally
									}).finally(function() {
								
										// Reject
										reject();
									});
								}
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Return closing device and catch errors
							return device.close().catch(function(error) {
							
							// Finally
							}).finally(function() {
						
								// Reject error
								reject(error);
							});
						});
						
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
		
		// List
		static list() {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return getting attached USB devices
				return navigator["usb"].getDevices().then(function(devices) {
				
					// Initialize applicable devices
					var applicableDevices = [];
					
					// Go through all devices
					for(var i = 0; i < devices["length"]; ++i) {
					
						// Check if device isn't opened
						if(devices[i]["opened"] === false) {
					
							// Initialize device applicable
							var deviceApplicable = false;
						
							// Go through all devices
							for(var j = 0; j < HardwareWalletUsbTransport.DEVICES["length"]; ++j) {
							
								// Check if device's vendor ID and product ID match the device's
								if(devices[i]["vendorId"] === HardwareWalletUsbTransport.DEVICES[j]["Vendor ID"] && ("Product ID" in HardwareWalletUsbTransport.DEVICES[j] === false || devices[i]["productId"] === HardwareWalletUsbTransport.DEVICES[j]["Product ID"])) {
								
									// Set device aapplicable
									deviceApplicable = true;
									
									// Break
									break;
								}
							}
						
							// Check if device is applicable
							if(deviceApplicable === true) {
						
								// Append device to list
								applicableDevices.push(devices[i]);
							}
						}
					}
				
					// Resolve applicable devices
					resolve(applicableDevices);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
	
	// Private
	
		// Create packets
		static createPackets(channel, type, payload = HardwareWalletUsbTransport.NO_PAYLOAD) {
		
			// Initialize packets
			var packets = [];
			
			// Check if payload doesn't exist
			if(payload === HardwareWalletUsbTransport.NO_PAYLOAD) {
			
				// Set payload to an empty array
				payload = new Uint8Array([]);
			}
			
			// Check type
			switch(type) {
			
				// Ledger type
				case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
			
					// Create padded payload
					var numberOfPackets = Math.ceil((HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH + payload["length"]) / (HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.LEDGER_PACKET_HEADER_LENGTH));
					var paddedPayload = (new Uint8Array(numberOfPackets * (HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.LEDGER_PACKET_HEADER_LENGTH))).fill(0);
					paddedPayload.set(new Uint8Array([payload["length"] >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, payload["length"]]));
					paddedPayload.set(payload, Uint16Array["BYTES_PER_ELEMENT"]);
					
					// Break
					break;
				
				// Trezor type
				case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
				
					// Check if more than one packet will be used
					if(payload["length"] > HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER["length"]) {
					
						// Create padded payload
						var numberOfPackets = Math.ceil((payload["length"] - (HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER["length"])) / (HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.TREZOR_NEXT_PACKETS_HEADER["length"]));
						var paddedPayload = (new Uint8Array(HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER["length"] + numberOfPackets * (HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.TREZOR_NEXT_PACKETS_HEADER["length"]))).fill(0);
						paddedPayload.set(payload);
					}
					
					// Otherwise
					else {
					
						// Create padded payload
						var paddedPayload = (new Uint8Array(HardwareWalletUsbTransport.PACKET_SIZE - HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER["length"])).fill(0);
						paddedPayload.set(payload);
					}
					
					// Break
					break;
			}
			
			// Set payload to padded payload
			payload = paddedPayload;
			
			// Initialize payload offset
			var payloadOffset = 0;
			
			// Go through all packets required to send the payload
			for(var i = 0; payloadOffset !== payload["length"]; ++i) {
			
				// Check type
				switch(type) {
				
					// Ledger type
					case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
					
						// Create header
						var header = new Uint8Array([channel >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, channel, HardwareWalletUsbTransport.LEDGER_PACKET_HEADER_TAG, i >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, i]);
						
						// Break
						break;
					
					// Trezor type
					case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
					
						// Check if at the first packet
						if(i === 0) {
						
							// Create header
							var header = HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER;
						}
						
						// Otherwise
						else {
					
							// Create header
							var header = HardwareWalletUsbTransport.TREZOR_NEXT_PACKETS_HEADER;
						}
						
						// Break
						break;
				}
				
				// Get payload part length
				var payloadPartLength = HardwareWalletUsbTransport.PACKET_SIZE - header["length"];
				
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
		static sendRequest(device, type, payload = HardwareWalletUsbTransport.NO_PAYLOAD) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Create random channel
				var channel = Math.floor(Math.random() * HardwareWalletUsbTransport.MAX_CHANNEL);
			
				// Get packets
				var packets = HardwareWalletUsbTransport.createPackets(channel, type, payload);
				
				// Check type
				switch(type) {
				
					// Ledger type
					case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
					
						// Set endpoint
						var endpoint = HardwareWalletUsbTransport.LEDGER_ENDPOINT;
						
						// Break
						break;
					
					// Trezor type
					case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
					
						// Set endpoint
						var endpoint = HardwareWalletUsbTransport.TREZOR_ENDPOINT;
						
						// Break
						break;
				}
				
				// Send packet
				var sendPacket = new Promise(function(resolve, reject) {
				
					// Resolve
					resolve();
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
						
							// Return transfering out packet
							return device.transferOut(endpoint, packet).then(function() {
							
								// Resolve
								resolve();
								
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						});
						
					// Catch errors
					}).catch(function(error) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
						
							// Reject error
							reject(error);
						});
					});
					
					// Append sending packet to list
					sendingPackets.push(sendPacket);
				}
				
				// Return sending all packets
				return Promise.all(sendingPackets).then(function() {
				
					// Receive packet
					var receivePacket = function(expectedSequenceIndex) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
						
							// Return transfering in packet
							return device.transferIn(endpoint, HardwareWalletUsbTransport.PACKET_SIZE).then(function(response) {
							
								// Get packet from response
								var packet = new Uint8Array(response["data"]["buffer"]);
								
								// Check if packet's size is correct
								if(packet["length"] === HardwareWalletUsbTransport.PACKET_SIZE) {
								
									// Check type
									switch(type) {
									
										// Ledger type
										case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
								
											// Get response channel
											var responseChannel = (packet[0] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | packet[1];
											
											// Check if response channel is correct
											if(responseChannel === channel) {
											
												// Check if tag is correct
												if(packet[Uint16Array["BYTES_PER_ELEMENT"]] === HardwareWalletUsbTransport.LEDGER_PACKET_HEADER_TAG) {
												
													// Get sequence index
													var sequenceIndex = (packet[Uint16Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"]] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | packet[Uint16Array["BYTES_PER_ELEMENT"] + Uint8Array["BYTES_PER_ELEMENT"] + 1];
													
													// Check if sequence index is correct
													if(sequenceIndex === expectedSequenceIndex) {
												
														// Resolve packet's payload
														resolve(packet.subarray(HardwareWalletUsbTransport.LEDGER_PACKET_HEADER_LENGTH));
													}
													
													// Otherwise
													else {
													
														// Securely clear packet
														packet.fill(0);
													
														// Reject
														reject();
													}
												}
												
												// Otherwise
												else {
												
													// Securely clear packet
													packet.fill(0);
												
													// Reject
													reject();
												}
											}
											
											// Otherwise
											else {
											
												// Securely clear packet
												packet.fill(0);
											
												// Reject
												reject();
											}
											
											// Break
											break;
										
										// Trezor type
										case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
										
											// Check if at the first packet
											if(expectedSequenceIndex === 0) {
											
												// Get magic numbers
												var magicNumbers = packet.subarray(0, HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER["length"]);
												
												// Go through all magic numbers
												for(var i = 0; i < magicNumbers["length"]; ++i) {
												
													// Check if magic number isn't correct
													if(magicNumbers[i] !== HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER[i]) {
													
														// Securely clear packet
														packet.fill(0);
														
														// Reject
														reject();
														
														// Return
														return;
													}
												}
												
												// Resolve packet's payload
												resolve(packet.subarray(HardwareWalletUsbTransport.TREZOR_FIRST_PACKET_HEADER["length"]));
											}
											
											// Otherwise
											else {
											
												// Get magic numbers
												var magicNumbers = packet.subarray(0, HardwareWalletUsbTransport.TREZOR_NEXT_PACKETS_HEADER["length"]);
												
												// Go through all magic numbers
												for(var i = 0; i < magicNumbers["length"]; ++i) {
												
													// Check if magic number isn't correct
													if(magicNumbers[i] !== HardwareWalletUsbTransport.TREZOR_NEXT_PACKETS_HEADER[i]) {
													
														// Securely clear packet
														packet.fill(0);
														
														// Reject
														reject();
														
														// Return
														return;
													}
												}
												
												// Resolve packet's payload
												resolve(packet.subarray(HardwareWalletUsbTransport.TREZOR_NEXT_PACKETS_HEADER["length"]));
											}
											
											// Break
											break;
									}
								
								}
									
								// Otherwise
								else {
								
									// Securely clear packet
									packet.fill(0);
								
									// Reject
									reject();
								}
								
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						});
					};
					
					// Return receiving first packet
					return receivePacket(0).then(function(responsePart) {
					
						// Check type
						switch(type) {
						
							// Ledger type
							case HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE:
					
								// Get message type
								var messageType = new Uint8Array([]);
								
								// Get response size
								var responseSize = (responsePart[0] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | responsePart[1];
								
								// Set response
								var response = responsePart.subarray(Uint16Array["BYTES_PER_ELEMENT"]);
								
								// Break
								break;
							
							// Trezor type
							case HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE:
							
								// Get message type
								var messageType = responsePart.subarray(0, HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH);
								
								// Get response size
								var responseSize = (responsePart[HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH] << (HardwareWalletUsbTransport.BITS_IN_A_BYTE * 3)) | (responsePart[HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH + 1] << (HardwareWalletUsbTransport.BITS_IN_A_BYTE * 2)) | (responsePart[HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH + 2] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | responsePart[HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH + 3];
								
								// Set response
								var response = responsePart.subarray(HardwareWalletUsbTransport.MESSAGE_TYPE_LENGTH + Uint32Array["BYTES_PER_ELEMENT"]);
								
								// Break
								break;
						}
						
						// Set next sequence index
						var nextSequenceIndex = 1;
						
						// Get next response part
						var getNextResponsePart = function() {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if the entire response hasn't been received
								if(response["length"] < responseSize) {
								
									// Return receiving next packet
									return receivePacket(nextSequenceIndex).then(function(responsePart) {
									
										// Append response part to response
										var currentResponse = new Uint8Array(response["length"] + responsePart["length"]);
										currentResponse.set(response);
										currentResponse.set(responsePart, response["length"]);
										response.fill(0);
										responsePart.fill(0);
										response = currentResponse;
										
										// Increment next sequence index
										++nextSequenceIndex;
										
										// Return getting next response part
										return getNextResponsePart().then(function() {
										
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
								}
								
								// Otherwise
								else {
								
									// Resolve
									resolve();
								}
							});
						};
						
						// Return getting next response part
						return getNextResponsePart().then(function() {
						
							// Append message type to response
							var finalResponse = new Uint8Array(responseSize + messageType["length"]);
							finalResponse.set(response.subarray(0, responseSize));
							finalResponse.set(messageType, responseSize);
							response.fill(0);
							
							// Resolve final response
							resolve(finalResponse);
						
						// Catch errors
						}).catch(function(error) {
						
							// Securely clear response
							response.fill(0);
						
							// Reject error
							reject(error);
						});
						
					// Catch error
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
		
		// No payload
		static get NO_PAYLOAD() {
		
			// Return no payload
			return null;
		}
		
		// No device
		static get NO_DEVICE() {
		
			// Return no device
			return null;
		}
		
		// Devices
		static get DEVICES() {
		
			// Return devices
			return [
			
				// Ledger
				{
				
					// Type
					"Type": HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE,
					
					// Vendor ID
					"Vendor ID": 0x2C97
				},
				
				// Trezor
				{
				
					// Type
					"Type": HardwareWalletDefinitions.TREZOR_TRANSPORT_TYPE,
					
					// Product name
					"Product Name": "Trezor",
					
					// Vendor ID
					"Vendor ID": 0x1209,
					
					// Product ID
					"Product ID": 0x53C1
				}
			];
		}
		
		// WebUSB interface class
		static get WEBUSB_INTERFACE_CLASS() {
		
			// Return WebUSB interface class
			return 0xFF;
		}
		
		// Configuration
		static get CONFIGURATION() {
		
			// Return configuration
			return 0x01;
		}
		
		// Packet size
		static get PACKET_SIZE() {
		
			// Return packet size
			return 64;
		}
		
		// Message type length
		static get MESSAGE_TYPE_LENGTH() {
		
			// Return message type length
			return Uint16Array["BYTES_PER_ELEMENT"];
		}
		
		// Bits in a byte
		static get BITS_IN_A_BYTE() {
		
			// Rerurn bits in a byte
			return 8;
		}
		
		// Ledger endpoint
		static get LEDGER_ENDPOINT() {
		
			// Return Ledger endpoint
			return 0x03;
		}
		
		// Trezor endpoint
		static get TREZOR_ENDPOINT() {
		
			// Return Trezor endpoint
			return 0x01;
		}
		
		// Not found error code
		static get NOT_FOUND_ERROR_CODE() {
		
			// Return not found error code
			return 8;
		}
		
		// Ledger packet header length
		static get LEDGER_PACKET_HEADER_LENGTH() {
		
			// Return Ledger packet header length
			return 5;
		}
		
		// Ledger packet header tag
		static get LEDGER_PACKET_HEADER_TAG() {
		
			// Return Ledger packet header tag
			return 0x05;
		}
		
		// Trezor first packet header
		static get TREZOR_FIRST_PACKET_HEADER() {
		
			// Return Trezor packet header
			return new Uint8Array([0x3F, 0x23, 0x23]);
		}
		
		// Trezor next packets header
		static get TREZOR_NEXT_PACKETS_HEADER() {
		
			// Return Trezor next packets header
			return new Uint8Array([0x3F]);
		}
		
		// Max channel
		static get MAX_CHANNEL() {
		
			// Return max channel
			return 0xFFFF;
		}
}


// Main function

// Set global object's hardware wallet USB transport
globalThis["HardwareWalletUsbTransport"] = HardwareWalletUsbTransport;
