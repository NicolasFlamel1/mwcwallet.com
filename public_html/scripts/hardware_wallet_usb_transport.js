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
			
			// Set device model
			this["deviceModel"] = {
			
				// Product name
				"productName": device["manufacturerName"] + " " + device["productName"]
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
		send(requestClass, requestInstruction, parameterOne, parameterTwo, data) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Create header
				var header = new Uint8Array([requestClass, requestInstruction, parameterOne, parameterTwo, data["length"]]);
				
				// Create APDU
				var apdu = new Uint8Array(header["length"] + data["length"]);
				apdu.set(header);
				apdu.set(data, header["length"]);
		
				// Return getting APDU response from device
				return HardwareWalletUsbTransport.sendRequest(self.device, apdu).then(function(response) {
				
					// Check if response contains a status
					if(response["length"] >= HardwareWalletUsbTransport.APDU_STATUS_LENGTH) {
					
						// Get status
						var status = response[response["length"] - 1] | (response[response["length"] - 2] << HardwareWalletUsbTransport.BITS_IN_A_BYTE);
						
						// Check if status is success
						if(status === HardwareWalletUsbTransport.APDU_SUCCESS_STATUS) {
						
							// Resolve response
							resolve(response);
						}
						
						// Otherwise
						else {
						
							// Reject error
							reject({
							
								// Status code
								"statusCode": status
							});
						}
					}
					
					// Otherwise
					else {
					
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
								"filters": HardwareWalletUsbTransport.VENDOR_IDS.map(function(vendorId) {
								
									// Return vendor ID
									return {
									
										// Vendor ID
										"vendorId": vendorId
									};
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
						
							// Check if device has an applicable vendor ID
							if(HardwareWalletUsbTransport.VENDOR_IDS.indexOf(device["vendorId"]) !== HardwareWalletUsbTransport.INDEX_NOT_FOUND) {
							
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
					
						// Select configuration
						var selectConfiguration = function() {
						
							// Return promise
							return new Promise(function(resolve, reject) {
							
								// Check if device's configuration has been selected
								if(device["configuration"] === null) {
								
									// Return selecting device's configuration
									return device.selectConfiguration(HardwareWalletUsbTransport.CONFIGURATION).then(function() {
									
										// Resolve
										resolve();
										
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
						
						// Return selecting configuration
						return selectConfiguration().then(function() {
						
							// Return resetting device and catch errors
							return device.reset().catch(function(error) {
							
							// Finally
							}).finally(function() {
						
								// Initialize interface found
								var interfaceFound = false;
									
								// Go through all the configuration's interfaces
								for(var i = 0; i < device["configurations"][0]["interfaces"]["length"]; ++i) {
								
									// Go through all of the interface's alternates
									for(var j = 0; j < device["configurations"][0]["interfaces"][i]["alternates"]["length"]; ++j) {
									
										// Check if alternates is for WebUSB
										if(device["configurations"][0]["interfaces"][i]["alternates"][j]["interfaceClass"] === HardwareWalletUsbTransport.WEBUSB_INTERFACE_CLASS) {
										
											// Set interface found
											interfaceFound = true;
											
											// Set interface number
											var interfaceNumber = device["configurations"][0]["interfaces"][i]["interfaceNumber"];
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
					
						// Check if device has an applicable vendor ID and it's not opened
						if(HardwareWalletUsbTransport.VENDOR_IDS.indexOf(devices[i]["vendorId"]) !== HardwareWalletUsbTransport.INDEX_NOT_FOUND && devices[i]["opened"] === false) {
						
							// Append device to list
							applicableDevices.push(devices[i]);
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
		static createPackets(channel, payload = HardwareWalletUsbTransport.NO_PAYLOAD) {
		
			// Initialize packets
			var packets = [];
			
			// Check if payload doesn't exist
			if(payload === HardwareWalletUsbTransport.NO_PAYLOAD) {
			
				// Set payload to an empty array
				payload = new Uint8Array([]);
			}
			
			// Create padded payload
			var numberOfPackets = Math.ceil((2 + payload["length"]) / (HardwareWalletUsbTransport.PACKET_SIZE - 5));
			var paddedPayload = (new Uint8Array(numberOfPackets * (HardwareWalletUsbTransport.PACKET_SIZE - 5))).fill(0);
			paddedPayload.set(new Uint8Array([payload["length"] >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, payload["length"]]));
			paddedPayload.set(payload, 2);
			
			// Set payload to padded payload
			payload = paddedPayload;
			
			// Initialize payload offset
			var payloadOffset = 0;
			
			// Go through all packets required to send the payload
			for(var i = 0; payloadOffset !== payload["length"]; ++i) {
			
				// Create header
				var header = new Uint8Array([channel >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, channel, HardwareWalletUsbTransport.APDU_TAG, i >>> HardwareWalletUsbTransport.BITS_IN_A_BYTE, i]);
				
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
		static sendRequest(device, payload = HardwareWalletUsbTransport.NO_PAYLOAD) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Create random channel
				var channel = Math.floor(Math.random() * HardwareWalletUsbTransport.MAX_CHANNEL);
			
				// Get packets
				var packets = HardwareWalletUsbTransport.createPackets(channel, payload);
				
				// Send packet
				var sendPacket = new Promise(function(resolve, reject) {
				
					// Resolve
					resolve();
				});
				
				// Go through all packets
				for(var i = 0; i < packets["length"]; ++i) {
				
					// Get packet
					let packet = packets[i];
					
					// Send next pack after previous packet is send
					sendPacket = sendPacket.then(function() {
					
						// Return promise
						return new Promise(function(resolve, reject) {
						
							// Return transfering out packet
							return device.transferOut(HardwareWalletUsbTransport.APDU_ENDPOINT, packet).then(function() {
							
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
				}
				
				// Return sending all packets
				return sendPacket.then(function() {
				
					// Receive packet
					var receivePacket = function(expectedSequenceIndex) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
						
							// Return transfering in packet
							return device.transferIn(HardwareWalletUsbTransport.APDU_ENDPOINT, HardwareWalletUsbTransport.PACKET_SIZE).then(function(response) {
							
								// Get packet from response
								var packet = new Uint8Array(response["data"]["buffer"]);
								
								// Check if packet's size is correct
								if(packet["length"] === HardwareWalletUsbTransport.PACKET_SIZE) {
								
									// Get response channel
									var responseChannel = (packet[HardwareWalletUsbTransport.CHANNEL_INDEX] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | packet[HardwareWalletUsbTransport.CHANNEL_INDEX + 1];
									
									// Check if response channel is correct
									if(responseChannel === channel) {
									
										// Get tag
										var tag = packet[HardwareWalletUsbTransport.TAG_INDEX];
										
										// Check if tag is correct
										if(tag === HardwareWalletUsbTransport.APDU_TAG) {
										
											// Get sequence index
											var sequenceIndex = (packet[HardwareWalletUsbTransport.SEQUENCE_INDEX_INDEX] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | packet[HardwareWalletUsbTransport.SEQUENCE_INDEX_INDEX + 1];
											
											// Check if sequence index is correct
											if(sequenceIndex === expectedSequenceIndex) {
										
												// Resolve packet's payload
												resolve(packet.subarray(HardwareWalletUsbTransport.PAYLOAD_INDEX));
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
							
								// Reject error
								reject(error);
							});
						});
					};
					
					// Return receiving first packet
					return receivePacket(0).then(function(responsePart) {
					
						// Get response size
						var responseSize = (responsePart[0] << HardwareWalletUsbTransport.BITS_IN_A_BYTE) | responsePart[1];
						
						// Set response
						var response = responsePart.subarray(2);
						
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
						
							// Resolve response
							resolve(response.subarray(0, responseSize));
						
						// Catch errors
						}).catch(function(error) {
						
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
		
		// Vendor IDs
		static get VENDOR_IDS() {
		
			// Return vendor IDs
			return [
			
				// Ledger
				0x2C97
			];
		}
		
		// Index not found
		static get INDEX_NOT_FOUND() {
		
			// Return index not found
			return -1;
		}
		
		// WebUSB interface class
		static get WEBUSB_INTERFACE_CLASS() {
		
			// Return WebUSB interface class
			return 255;
		}
		
		// Configuration
		static get CONFIGURATION() {
		
			// Return configuration
			return 1;
		}
		
		// Packet size
		static get PACKET_SIZE() {
		
			// Return packet size
			return 64;
		}
		
		// APDU status length
		static get APDU_STATUS_LENGTH() {
		
			// Return APDU status length
			return (new Uint8Array([0x00, 0x00]))["length"];
		}
		
		// APDU success status
		static get APDU_SUCCESS_STATUS() {
		
			// Return APDU success status
			return 0x9000;
		}
		
		// Bits in a byte
		static get BITS_IN_A_BYTE() {
		
			// Rerurn bits in a byte
			return 8;
		}
		
		// APDU endpoint
		static get APDU_ENDPOINT() {
		
			// Return APDU endpoint
			return 3;
		}
		
		// APDU tag
		static get APDU_TAG() {
		
			// Return APDU tag
			return 0x05;
		}
		
		// Max channel
		static get MAX_CHANNEL() {
		
			// Return max channel
			return 0xFFFF;
		}
		
		// Channel index
		static get CHANNEL_INDEX() {
		
			// Return channel index
			return 0;
		}
		
		// Tag index
		static get TAG_INDEX() {
		
			// Return tag index
			return HardwareWalletUsbTransport.CHANNEL_INDEX + 2;
		}
		
		// Sequence index index
		static get SEQUENCE_INDEX_INDEX() {
		
			// Return sequence index index
			return HardwareWalletUsbTransport.TAG_INDEX + 1;
		}
		
		// Payload index
		static get PAYLOAD_INDEX() {
		
			// Return payload index
			return HardwareWalletUsbTransport.SEQUENCE_INDEX_INDEX + 2;
		}
		
		// Not found error code
		static get NOT_FOUND_ERROR_CODE() {
		
			// Return not found error code
			return 8;
		}
}


// Main function

// Set global object's hardware wallet USB transport
globalThis["HardwareWalletUsbTransport"] = HardwareWalletUsbTransport;
