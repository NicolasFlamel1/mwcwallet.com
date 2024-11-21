// Use strict
"use strict";


// Classes

// Node class
class Node {

	// Public

		// Constructor
		constructor(torProxy, settings) {
		
			// Set Tor proxy
			this.torProxy = torProxy;
		
			// Set settings
			this.settings = settings;
			
			// Set retry delay to initial value
			this.retryDelay = Node.INITIAL_RETRY_DELAY_MILLISECONDS;
			
			// Set reconnect timeout to no timeout
			this.reconnectTimeout = Node.NO_TIMEOUT;
			
			// Set started to false
			this.started = false;
			
			// Set connected to fase
			this.connected = false;
			
			// Set failed to connect
			this.failedToConnect = false;
			
			// Set last height response timestamp
			this.lastHeightResponseTimestamp = Node.NO_HEIGHT_RESPONSE_TIMESTAMP;
			
			// Set update height timeout to no timeout
			this.updateHeightTimeout = Node.NO_TIMEOUT;
			
			// Set current height to a height with an unknown height
			this.currentHeight = new Height(Node.UNKNOWN_HEIGHT);
			
			// Set version obtained to false
			this.versionObtained = false;
			
			// Set use custom node to setting's default value
			this.useCustomNode = Node.SETTINGS_USE_CUSTOM_NODE_DEFAULT_VALUE;
			
			// Set custom node address to setting's default value
			this.customNodeAddress = Node.SETTINGS_CUSTOM_NODE_ADDRESS_DEFAULT_VALUE;
			
			// Set custom node secret to setting's default value
			this.customNodeSecret = Node.SETTINGS_CUSTOM_NODE_SECRET_DEFAULT_VALUE;
			
			// Set empty address
			this.emptyAddress = true;
			
			// Set cached PMMR indices response to no cached response
			this.cachedPmmrIndicesResponse = Node.NO_CACHED_RESPONSE;
			
			// Set cache PMMR indicies parameters to no cache parameters
			this.cachePmmrIndiciesParameters = Node.NO_CACHE_PARAMETERS;
			
			// Set cached unspent outputs response to no cached response
			this.cachedUnspentOutputsResponse = Node.NO_CACHED_RESPONSE;
			
			// Set cache unspent outputs parameters to no cache parameters
			this.cacheUnspentOutputsParameters = Node.NO_CACHE_PARAMETERS;
			
			// Set cached header responses
			this.cachedHeaderResponses = {};
			
			// Set cached kernel responses
			this.cachedKernelResponses = {};
			
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
			
						// Use custom node setting
						self.settings.createValue(Node.SETTINGS_USE_CUSTOM_NODE_NAME, Node.SETTINGS_USE_CUSTOM_NODE_DEFAULT_VALUE),
						
						// Custom node address setting
						self.settings.createValue(Node.SETTINGS_CUSTOM_NODE_ADDRESS_NAME, Node.SETTINGS_CUSTOM_NODE_ADDRESS_DEFAULT_VALUE),
						
						// Custom node secret setting
						self.settings.createValue(Node.SETTINGS_CUSTOM_NODE_SECRET_NAME, Node.SETTINGS_CUSTOM_NODE_SECRET_DEFAULT_VALUE)
					
					]).then(function() {
					
						// Initialize settings
						var settings = [
						
							// Use custom node setting
							Node.SETTINGS_USE_CUSTOM_NODE_NAME,
							
							// Custom node address setting
							Node.SETTINGS_CUSTOM_NODE_ADDRESS_NAME,
							
							// Custom node secret setting
							Node.SETTINGS_CUSTOM_NODE_SECRET_NAME
						];
					
						// Return getting settings' values
						return Promise.all(settings.map(function(setting) {
						
							// Return getting setting's value
							return self.settings.getValue(setting);
						
						})).then(function(settingValues) {
						
							// Set use custom node to setting's value
							self.useCustomNode = settingValues[settings.indexOf(Node.SETTINGS_USE_CUSTOM_NODE_NAME)];
							
							// Set custom node address to setting's value
							self.customNodeAddress = settingValues[settings.indexOf(Node.SETTINGS_CUSTOM_NODE_ADDRESS_NAME)];
							
							// Set custom node secret to setting's value
							self.customNodeSecret = settingValues[settings.indexOf(Node.SETTINGS_CUSTOM_NODE_SECRET_NAME)];
							
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
			
				// Initialize node setting changed
				var nodeSettingChanged = false;
			
				// Check what setting was changes
				switch(setting[Settings.DATABASE_SETTING_NAME]) {
				
					// Use custom node setting
					case Node.SETTINGS_USE_CUSTOM_NODE_NAME:
					
						// Set use custom node to setting's value
						self.useCustomNode = setting[Settings.DATABASE_VALUE_NAME];
						
						// Set node setting changed
						nodeSettingChanged = true;
					
						// Break
						break;
					
					// Custom node address setting
					case Node.SETTINGS_CUSTOM_NODE_ADDRESS_NAME:
					
						// Set custom node address to setting's value
						self.customNodeAddress = setting[Settings.DATABASE_VALUE_NAME];
						
						// Set node setting changed
						nodeSettingChanged = true;
					
						// Break
						break;
					
					// Custom node secret setting
					case Node.SETTINGS_CUSTOM_NODE_SECRET_NAME:
					
						// Set custom node secret to setting's value
						self.customNodeSecret = setting[Settings.DATABASE_VALUE_NAME];
						
						// Set node setting changed
						nodeSettingChanged = true;
					
						// Break
						break;
				}
			
				// Check if a node setting was changed
				if(nodeSettingChanged === true) {
				
					// Check if connected to the node
					if(self.versionObtained === true) {
				
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Node settings changed. Disconnecting from the node.'));
					}
				
					// Clear version obtained
					self.versionObtained = false;
				
					// Trigger settings change event
					$(self).trigger(Node.SETTINGS_CHANGE_EVENT);
					
					// Restart
					self.restart();
				}
			});
			
			// Tor proxy settings change event
			$(this.torProxy).on(TorProxy.SETTINGS_CHANGE_EVENT, function() {
			
				// Check if using a custom node, the custom node exists, and not using a custom Tor proxy or a Tor proxy address exists
				if(self.usingCustomNode() === true && self.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0]["length"] !== 0 && (self.torProxy.usingCustomTorProxy() === false || self.torProxy.getAddress()["length"] !== 0)) {
			
					// Get URL as the first address
					var url = self.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0];
					
					// Check if Tor proxy will be used to connect to the node
					if(Tor.isTorUrl(url) === true && Tor.isSupported() === false) {
					
						// Check if connected
						if(self.isConnected() === true) {
						
							// Update height immediately
							self.updateHeight(true);
						}
						
						// Otherwise
						else {
						
							// Clear version obtained
							self.versionObtained = false;
					
							// Restart
							self.restart();
						}
					}
				}
			});
			
			// Connection warning or close event
			$(this).on(Node.CONNECTION_WARNING_EVENT + " " + Node.CONNECTION_CLOSE_EVENT, function(event, type) {
			
				// Check type
				switch(type) {
				
					// No connection close type
					case Node.NO_CONNECTION_CLOSE_TYPE:
					
						// Check if address exists
						if(self.emptyAddress === false) {
					
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Connecting to the node failed.'));
						}
					
						// Break
						break;
					
					// Disconnected close type
					case Node.DISCONNECTED_CLOSE_TYPE:
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Disconnected from the node.'));
					
						// Break
						break;
					
					// Unauthorized warning type
					case Node.UNAUTHORIZED_WARNING_TYPE:
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('You\'re not authorized to connect to the node.'));
					
						// Break
						break;
					
					// Invalid response warning type
					case Node.INVALID_RESPONSE_WARNING_TYPE:
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Received an invalid response from the node.'));
					
						// Break
						break;
					
					// Incompatible warning type
					case Node.INCOMPATIBLE_WARNING_TYPE:
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Not compatible with node versions less than %1$v.'), [
						
							// Version
							Node.MINIMUM_COMPATIBLE_NODE_VERSION
						]);
						
						// Break
						break;
				}
			
				// Check if reconnect timeout exists
				if(self.reconnectTimeout !== Node.NO_TIMEOUT) {
				
					// Clear reconnect timeout
					clearTimeout(self.reconnectTimeout);
					
					// Set reconnect timeout to no timeout
					self.reconnectTimeout = Node.NO_TIMEOUT;
				}
			
				// Set reconnect timeout
				self.reconnectTimeout = setTimeout(function() {
				
					// Set reconnect timeout to no timeout
					self.reconnectTimeout = Node.NO_TIMEOUT;
				
					// Connect
					self.connect();
				
				}, Math.min(Node.MAXIMUM_RETRY_DELAY_MILLISECONDS, self.retryDelay));
				
				// Update retry delay
				self.retryDelay *= Node.RETRY_DELAY_SCALING_FACTOR;
			});
			
			// Window online event
			$(window).on("online", function() {
			
				// Check if reconnect timeout exists
				if(self.reconnectTimeout !== Node.NO_TIMEOUT) {
				
					// Clear reconnect timeout
					clearTimeout(self.reconnectTimeout);
					
					// Set reconnect timeout to no timeout
					self.reconnectTimeout = Node.NO_TIMEOUT;
				
					// Reset retry delay
					self.retryDelay = Node.INITIAL_RETRY_DELAY_MILLISECONDS;
					
					// Connect
					self.connect();
				}
			
			// Window offline event
			}).on("offline", function() {
			
				// Check if started
				if(self.started === true) {
				
					// Reset
					self.reset();
			
					// Trigger connection close event
					$(self).trigger(Node.CONNECTION_CLOSE_EVENT, (self.versionObtained === false) ? Node.NO_CONNECTION_CLOSE_TYPE : Node.DISCONNECTED_CLOSE_TYPE);
					
					// Clear version obtained
					self.versionObtained = false;
				}
			
			// Window focus event
			}).on("focus", function() {
			
				// Check if connected and hasn't received a height response recently
				if(self.isConnected() === true && self.lastHeightResponseTimestamp !== Node.NO_HEIGHT_RESPONSE_TIMESTAMP && self.lastHeightResponseTimestamp < Common.getCurrentTimestamp() - Node.MAXIMUM_NO_HEIGHT_RESPONSE_DURATION_SECONDS)
				
					// Update height immediately
					self.updateHeight(true);
			});
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
		
		// Restart
		restart(disconnectFirst = true) {
		
			// Check if not already started
			if(this.started === false)
			
				// Start
				this.start();
			
			// Otherwise
			else {
		
				// Check if update height timeout exists
				if(this.updateHeightTimeout !== Node.NO_TIMEOUT) {
				
					// Clear update height timeout
					clearTimeout(this.updateHeightTimeout);
					
					// Set update height timeout to no timeout
					this.updateHeightTimeout = Node.NO_TIMEOUT;
				}
				
				// Check if disconnecting first
				if(disconnectFirst === true) {
			
					// Clear connected
					this.connected = false;
					
					// Clear failed to connect
					this.failedToConnect = false;
					
					// Clear last height response timestamp
					this.lastHeightResponseTimestamp = Node.NO_HEIGHT_RESPONSE_TIMESTAMP;
					
					// Set current height's height to an unknown height
					this.currentHeight.setHeight(Node.UNKNOWN_HEIGHT);
				}
				
				// Check if reconnect timeout exists
				if(this.reconnectTimeout !== Node.NO_TIMEOUT) {
				
					// Clear reconnect timeout
					clearTimeout(this.reconnectTimeout);
					
					// Set reconnect timeout to no timeout
					this.reconnectTimeout = Node.NO_TIMEOUT;
				}
				
				// Reset retry delay
				this.retryDelay = Node.INITIAL_RETRY_DELAY_MILLISECONDS;
				
				// Connect
				this.connect(disconnectFirst);
			}
		}
		
		// Using custom node
		usingCustomNode() {
		
			// Return if using a custom node
			return this.useCustomNode === true;
		}
		
		// Get addresses
		getAddresses(isMainnet) {
		
			// Check if not using a custom node
			if(this.usingCustomNode() === false) {
			
				// Check wallet type
				switch(Consensus.getWalletType()) {
				
					// MWC wallet
					case Consensus.MWC_WALLET_TYPE:
					
						// Check if mainnet
						if(isMainnet === true) {
					
							// Return addresses
							return [
							
								// Addresses
								"https://mwc713.mwc.mw",
								"https://mwc7132.mwc.mw",
								"https://mwc7133.mwc.mw",
								"https://mwc7134.mwc.mw",
								"https://mwc7135.mwc.mw",
								"https://mwc7136.mwc.mw"
							];
						}
						
						// Otherwise
						else {
						
							// Return addresses
							return [
							
								// Addresses
								"https://mwc713.floonet.mwc.mw"
							];
						}
						
						// Break
						break;
					
					// GRIN wallet
					case Consensus.GRIN_WALLET_TYPE:
					
						// Check if mainnet
						if(isMainnet === true) {
				
							// Return addresses
							return [
							
								// Addresses
								"https://grinnode.live:3413"
							];
						}
						
						// Otherwise
						else {
						
							// Return addresses
							return [
							
								// Addresses
								"http://localhost:13413"
							];
						}
						
						// Break
						break;
					
					// EPIC wallet
					case Consensus.EPIC_WALLET_TYPE:
					
						// Check if mainnet
						if(isMainnet === true) {
				
							// Return addresses
							return [
							
								// Addresses
								"https://node.epiccash.com:3413"
							];
						}
						
						// Otherwise
						else {
						
							// Return addresses
							return [
							
								// Addresses
								"http://localhost:13413"
							];
						}
						
						// Break
						break;
				}
			}
			
			// Otherwise
			else {
			
				// Get custom node address
				var customNodeAddress = this.customNodeAddress.trim();
				
				// Check if custom node address isn't set
				if(customNodeAddress["length"] === 0) {
				
					// Return
					return [
					
						// Custom node address
						customNodeAddress
					];
				}
				
				// Otherwise
				else {
			
					// Check if custom node address doesn't have a protocol
					if(Common.urlContainsProtocol(customNodeAddress) === false) {
					
						// Add protocol to custom node address
						customNodeAddress = Common.HTTP_PROTOCOL + "//" + customNodeAddress;
					}
				
					// Return
					return [
					
						// Custom node address upgraded if applicable and without any trailing slashes
						Common.removeTrailingSlashes(Common.upgradeApplicableInsecureUrl(customNodeAddress))
					];
				}
			}
		}
		
		// Is connected
		isConnected() {
		
			// Return if connected
			return this.connected === true;
		}
		
		// Connection failed
		connectionFailed() {
		
			// Return if failed to connect
			return this.failedToConnect === true;
		}
		
		// Get current height
		getCurrentHeight() {
		
			// Return a copy of current height
			return new Height(this.currentHeight.getHeight(), this.currentHeight.getHash());
		}
		
		// Get PMMR indices
		getPmmrIndices(startBlockHeight, endBlockHeight) {
		
			// Check if response is cached
			if(this.cachedPmmrIndicesResponse !== Node.NO_CACHED_RESPONSE && this.cachePmmrIndiciesParameters !== Node.NO_CACHE_PARAMETERS && startBlockHeight.isEqualTo(this.cachePmmrIndiciesParameters[0]) === true && endBlockHeight.isEqualTo(this.cachePmmrIndiciesParameters[1]) === true) {
			
				// Set self
				var self = this;
				
				// Return new promise
				return new Promise(function(resolve, reject) {
				
					// Check if cache is still valid
					if(self.cachedPmmrIndicesResponse !== Node.NO_CACHED_RESPONSE) {
				
						// Wait for cached PMMR indices response
						return self.cachedPmmrIndicesResponse.then(function(response) {
						
							// Check if cache is still valid
							if(self.cachedPmmrIndicesResponse !== Node.NO_CACHED_RESPONSE) {
							
								// Resolve response
								resolve(response);
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
					
						// Reject
						reject();
					}
				});
			}
			
			// Otherwise
			else {
			
				// Set cache PMMR indicies parameters
				this.cachePmmrIndiciesParameters = [
				
					// Start block height
					startBlockHeight,
					
					// End block height
					endBlockHeight
				];
			
				// Set self
				var self = this;
				
				// Set cached PMMR indices response
				this.cachedPmmrIndicesResponse = new Promise(function(resolve, reject) {
			
					// Return getting PMMR indices from response
					return self.getResponse("get_pmmr_indices", Node.OBJECT_RESPONSE_TYPE, [
					
						// Start block height
						startBlockHeight,
						
						// End block height
						endBlockHeight
					], [
					
						// Last retrieved index
						"last_retrieved_index",
						
						// Highest index
						"highest_index"
					], [
					
						// Last retrieved index validation
						function(lastRetrievedIndex) {
						
							// Return if last retrieved index is valid
							return (Common.isNumberString(lastRetrievedIndex) === true || lastRetrievedIndex instanceof BigNumber === true) && (new BigNumber(lastRetrievedIndex)).isInteger() === true && (new BigNumber(lastRetrievedIndex)).isPositive() === true;
						},
						
						// Highest index validation
						function(highestIndex) {
						
							// Return if highest index is valid
							return (Common.isNumberString(highestIndex) === true || highestIndex instanceof BigNumber === true) && (new BigNumber(highestIndex)).isInteger() === true && (new BigNumber(highestIndex)).isPositive() === true;
						}
					
					]).then(function(value) {
					
						// Resolve
						resolve({
						
							// Last retrieved index
							"last_retrieved_index": new BigNumber(value["last_retrieved_index"]),
							
							// Highest index
							"highest_index": new BigNumber(value["highest_index"])
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				});
				
				// Return new promise
				return new Promise(function(resolve, reject) {
				
					// Check if getting cached PMMR indices is still valid
					if(self.cachedPmmrIndicesResponse !== Node.NO_CACHED_RESPONSE) {
				
						// Return cached PMMR indices response
						return self.cachedPmmrIndicesResponse.then(function(response) {
						
							// Resolve response
							resolve(response);
						
						// Catch errors
						}).catch(function(error) {
						
							// Set cached PMMR indices response to no cached response
							self.cachedPmmrIndicesResponse = Node.NO_CACHED_RESPONSE;
							
							// Set cache PMMR indicies parameters to no cache parameters
							self.cachePmmrIndiciesParameters = Node.NO_CACHE_PARAMETERS;
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Reject
						reject();
					}
				});
			}
		}
		
		// Get unspent outputs
		getUnspentOutputs(startIndex, endIndex, max, pmmrIndices = Node.NO_PMMR_INDICES) {
		
			// Check if start index is zero
			if(startIndex.isZero() === true) {
			
				// Set start index to first index
				startIndex = Node.FIRST_INDEX;
			}
			
			// Check if end index is zero
			if(endIndex.isZero() === true) {
			
				// Set end index to first index
				endIndex = Node.FIRST_INDEX;
			}
			
			// Check if response is cached
			if(this.cachedUnspentOutputsResponse !== Node.NO_CACHED_RESPONSE && this.cacheUnspentOutputsParameters !== Node.NO_CACHE_PARAMETERS && startIndex.isEqualTo(this.cacheUnspentOutputsParameters[0]) === true && endIndex.isEqualTo(this.cacheUnspentOutputsParameters[1]) === true && max.isEqualTo(this.cacheUnspentOutputsParameters[2]) === true) {
			
				// Set self
				var self = this;
				
				// Return new promise
				return new Promise(function(resolve, reject) {
				
					// Check if cache is still valid
					if(self.cachedUnspentOutputsResponse !== Node.NO_CACHED_RESPONSE) {
					
						// Wait for cached unspent outputs response
						return self.cachedUnspentOutputsResponse.then(function(response) {
						
							// Check if cache is still valid
							if(self.cachedUnspentOutputsResponse !== Node.NO_CACHED_RESPONSE) {
							
								// Check if PMMR indices are provided and current height is known
								if(pmmrIndices !== Node.NO_PMMR_INDICES && self.currentHeight.getHeight() !== Node.UNKNOWN_HEIGHT) {
								
									// Check if not at the last output
									if(response["highest_index"].isLessThanOrEqualTo(response["last_retrieved_index"]) === false) {
								
										// Get next PMMR indicies to populate the cache
										self.getPmmrIndices(response["outputs"][response["outputs"]["length"] - 1]["block_height"], self.currentHeight.getHeight()).then(function(newPmmrIndices) {
										
											// Check if start index to one after the last retrieved index
											if(newPmmrIndices["last_retrieved_index"].isEqualTo(pmmrIndices["last_retrieved_index"]) === true && response["last_retrieved_index"].isGreaterThanOrEqualTo(pmmrIndices["last_retrieved_index"]) === true) {
											
												// Get next unspent outputs to populate the cache
												self.getUnspentOutputs(response["last_retrieved_index"].plus(1), newPmmrIndices["highest_index"], max).catch(function(error) {
												
												});
											}
											
											// Otherwise
											else {
											
												// Get next unspent outputs to populate the cache
												self.getUnspentOutputs(newPmmrIndices["last_retrieved_index"], newPmmrIndices["highest_index"], max).catch(function(error) {
												
												});
											}
											
										// Catch errors
										}).catch(function(error) {
										
										});
									}
								}
								
								// Resolve response
								resolve(response);
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
					
						// Reject
						reject();
					}
				});
			}
			
			// Otherwise
			else {
			
				// Set cache unspent outputs parameters
				this.cacheUnspentOutputsParameters = [
				
					// Start index
					startIndex,
					
					// End index
					endIndex,
					
					// Max
					max
				];
			
				// Set self
				var self = this;
				
				// Set cached unspent outputs response
				this.cachedUnspentOutputsResponse = new Promise(function(resolve, reject) {
				
					// Return getting unspent outputs from response
					return self.getResponse("get_unspent_outputs", Node.OBJECT_RESPONSE_TYPE, [
				
						// Start index
						startIndex,
						
						// End index
						endIndex,
						
						// Max
						max,
						
						// Include proof
						true
					], [
					
						// Highest index
						"highest_index",
						
						// Last retrieved index
						"last_retrieved_index",
						
						// Outputs
						"outputs"
					], [
					
						// Highest index validation
						function(highestIndex) {
						
							// Return if highest index is valid
							return (Common.isNumberString(highestIndex) === true || highestIndex instanceof BigNumber === true) && (new BigNumber(highestIndex)).isInteger() === true && (new BigNumber(highestIndex)).isGreaterThanOrEqualTo(startIndex) === true;
						},
						
						// Last retrieved index validation
						function(lastRetrievedIndex) {
						
							// Return if last retrieved index is valid
							return (Common.isNumberString(lastRetrievedIndex) === true || lastRetrievedIndex instanceof BigNumber === true) && (new BigNumber(lastRetrievedIndex)).isInteger() === true && (new BigNumber(lastRetrievedIndex)).isGreaterThanOrEqualTo(startIndex) === true;
						},
						
						// Outputs validation
						function(outputs) {
					
							// Check if outputs isn't an array
							if(Array.isArray(outputs) === false)
							
								// Return false
								return false;
							
							// Go through all outputs
							for(var i = 0; i < outputs["length"]; ++i) {
							
								// Get output
								var output = outputs[i];
								
								// Check if output is invalid
								if(Object.isObject(output) === false)
								
									// Return false
									return false;
								
								// Check if output's commit is invalid
								if("commit" in output === false || Common.isHexString(output["commit"]) === false || Common.hexStringLength(output["commit"]) !== Crypto.COMMIT_LENGTH)
								
									// Return false
									return false;
								
								// Check if output's proof is invalid
								if("proof" in output === false || Common.isHexString(output["proof"]) === false || Common.hexStringLength(output["proof"]) !== Crypto.PROOF_LENGTH)
								
									// Return false
									return false;
								
								// Check if output's output type is invalid
								if("output_type" in output === false || (output["output_type"] !== Output.COINBASE_TYPE && output["output_type"] !== Output.TRANSACTION_TYPE))
								
									// Return false
									return false;
								
								// Check if output's block height is invalid
								if("block_height" in output === false || (Common.isNumberString(output["block_height"]) === false && output["block_height"] instanceof BigNumber === false) || (new BigNumber(output["block_height"])).isInteger() === false || (new BigNumber(output["block_height"])).isGreaterThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === false)
								
									// Return false
									return false;
							}
							
							// Return true
							return true;
						}
					
					]).then(function(value) {
					
						// Initialize result
						var result = {
						
							// Highest index
							"highest_index": new BigNumber(value["highest_index"]),
							
							// Last retrieved index
							"last_retrieved_index": new BigNumber(value["last_retrieved_index"]),
							
							// Outputs
							"outputs": value["outputs"].map(function(output) {
							
								// Return
								return {
								
									// Commit
									"commit": Common.fromHexString(output["commit"]),
									
									// Proof
									"proof": Common.fromHexString(output["proof"], true),
									
									// Output type
									"output_type": output["output_type"],
									
									// Block height
									"block_height": new BigNumber(output["block_height"])
								};
							})
						};
						
						// Check if PMMR indices are provided and current height is known
						if(pmmrIndices !== Node.NO_PMMR_INDICES && self.currentHeight.getHeight() !== Node.UNKNOWN_HEIGHT) {
						
							// Check if not at the last output
							if(result["highest_index"].isLessThanOrEqualTo(result["last_retrieved_index"]) === false) {
						
								// Get next PMMR indicies to populate the cache
								self.getPmmrIndices(result["outputs"][result["outputs"]["length"] - 1]["block_height"], self.currentHeight.getHeight()).then(function(newPmmrIndices) {
								
									// Check if start index to one after the last retrieved index
									if(newPmmrIndices["last_retrieved_index"].isEqualTo(pmmrIndices["last_retrieved_index"]) === true && result["last_retrieved_index"].isGreaterThanOrEqualTo(pmmrIndices["last_retrieved_index"]) === true) {
									
										// Get next unspent outputs to populate the cache
										self.getUnspentOutputs(result["last_retrieved_index"].plus(1), newPmmrIndices["highest_index"], max).catch(function(error) {
										
										});
									}
									
									// Otherwise
									else {
									
										// Get next unspent outputs to populate the cache
										self.getUnspentOutputs(newPmmrIndices["last_retrieved_index"], newPmmrIndices["highest_index"], max).catch(function(error) {
										
										});
									}
									
								// Catch errors
								}).catch(function(error) {
								
								});
							}
						}
						
						// Resolve result
						resolve(result);
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				});
				
				// Return new promise
				return new Promise(function(resolve, reject) {
				
					// Check if getting cached unspent outputs is still valid
					if(self.cachedUnspentOutputsResponse !== Node.NO_CACHED_RESPONSE) {
					
						// Return cached unspent outputs response
						return self.cachedUnspentOutputsResponse.then(function(response) {
						
							// Resolve response
							resolve(response);
						
						// Catch errors
						}).catch(function(error) {
						
							// Set cached unspent outputs response to no cached response
							self.cachedUnspentOutputsResponse = Node.NO_CACHED_RESPONSE;
							
							// Set cache unspent outputs parameters to no cache parameters
							self.cacheUnspentOutputsParameters = Node.NO_CACHE_PARAMETERS;
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Reject
						reject();
					}
				});
			}
		}
		
		// Get outputs
		getOutputs(outputCommits) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Initialize output commits index
				var outputCommitsIndex = 0;
			
				// Return getting outputs from response
				return self.getResponse("get_outputs", Node.ARRAY_RESPONSE_TYPE, [
				
					// Output commit
					outputCommits.map(function(outputCommit) {
					
						// Return output commit as a hex string
						return Common.toHexString(outputCommit);
					}),
					
					// Start height
					Node.API_NO_VALUE,
					
					// End height
					Node.API_NO_VALUE,
					
					// Include proof
					true,
					
					// Include Merkle proof
					false
				], [
				
					// Commit
					"commit",
					
					// Block height
					"block_height",
					
					// Output type
					"output_type",
					
					// Proof
					"proof"
				], [
				
					// Commit validation
					function(commit, index) {
					
						// Return if commit is invalid
						if(Common.isHexString(commit) === false || Common.hexStringLength(commit) !== Crypto.COMMIT_LENGTH || index >= outputCommits["length"]) {
						
							// Return false
							return false;
						}
						
						// Loop while commit isn't for the output commit at the current index
						while(Common.arraysAreEqual(outputCommits[outputCommitsIndex], Common.fromHexString(commit)) === false) {
						
							// Increment output commits index and check if at the last output commit
							if(++outputCommitsIndex === outputCommits["length"]) {
							
								// Return false
								return false;
							}
						}
						
						// Increment output commits index
						++outputCommitsIndex;
						
						// Return true
						return true;
					},
					
					// Block height validation
					function(blockHeight, index) {
					
						// Return if block height is valid
						return (Common.isNumberString(blockHeight) === true || blockHeight instanceof BigNumber === true) && (new BigNumber(blockHeight)).isInteger() === true && (new BigNumber(blockHeight)).isGreaterThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true;
					},
					
					// Output type validation
					function(outputType, index) {
					
						// Return if output type is valid
						return outputType === Output.COINBASE_TYPE || outputType === Output.TRANSACTION_TYPE;
					},
					
					// Proof validation
					function(proof, index) {
					
						// Check if proof is valid
						return Common.isHexString(proof) === true && Common.hexStringLength(proof) === Crypto.PROOF_LENGTH;
					}
				
				]).then(function(values) {
				
					// Initialize outputs
					var outputs = [];
					
					// Go through all requested outputs
					for(var i = 0, j = 0; i < outputCommits["length"]; ++i) {
					
						// Check if response exists
						if(j < values["length"]) {
					
							// Get output
							var output = values[j];
							
							// Check if response is for the current requested output
							if(Common.arraysAreEqual(outputCommits[i], Common.fromHexString(output["commit"])) === true) {
							
								// Append output to list
								outputs.push({
						
									// Commit
									"commit": Common.fromHexString(output["commit"]),
									
									// Proof
									"proof": Common.fromHexString(output["proof"], true),
									
									// Output type
									"output_type": output["output_type"],
									
									// Block height
									"block_height": new BigNumber(output["block_height"])
								});
							
								// Increment output index
								++j;
							}
							
							// Otherwise
							else {
							
								// Append no output found to list
								outputs.push(Node.NO_OUTPUT_FOUND);
							}
						}
						
						// Otherwise
						else {
						
							// Append no output found to list
							outputs.push(Node.NO_OUTPUT_FOUND);
						}
					}
					
					// Resolve outputs
					resolve(outputs);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Get header
		getHeader(headerHeight) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if response is cached
				if(self.cachedHeaderResponses.hasOwnProperty(headerHeight.toFixed()) === true) {
				
					// Resolve cached response
					resolve(self.cachedHeaderResponses[headerHeight.toFixed()]);
				}
				
				// Otherwise
				else {
		
					// Return getting header from response
					return self.getResponse("get_header", Node.OBJECT_RESPONSE_TYPE, [
					
						// Header height
						headerHeight,
						
						// Hash
						Node.API_NO_VALUE,
						
						// Commit
						Node.API_NO_VALUE
						
					], [
					
						// Height
						"height",
					
						// Hash
						"hash",
						
						// Timestamp
						"timestamp"
					], [
					
						// Height validation
						function(height) {
						
							// Return if height is valid
							return (Common.isNumberString(height) === true || height instanceof BigNumber === true) && (new BigNumber(height)).isEqualTo(headerHeight) === true;
						},
					
						// Hash validation
						function(hash) {
						
							// Return if hash is valid
							return Common.isHexString(hash) === true && Common.hexStringLength(hash) === RecentHeights.HEADER_HASH_LENGTH;
						},
						
						// Timestamp validation
						Common.isRfc3339String
					
					], false, true).then(function(value) {
					
						// Initialize result
						var result = {
						
							// Hash
							"hash": Common.fromHexString(value["hash"]),
							
							// Timestamp
							"timestamp": Common.rfc3339StringToTimestamp(value["timestamp"])
						};
						
						// Cache result
						self.cachedHeaderResponses[headerHeight.toFixed()] = result;
						
						// Resolve result
						resolve(result);
					
					// Catch errors
					}).catch(function(error) {
					
						// Check if no header exists at the height
						if(Node.isNotFoundError(error) === true) {
						
							// Cache result
							self.cachedHeaderResponses[headerHeight.toFixed()] = Node.NO_HEADER_FOUND;
						
							// Resolve no header found
							resolve(Node.NO_HEADER_FOUND);
						}
						
						// Otherwise
						else
					
							// Reject error
							reject(error);
					});
				}
			});
		}
		
		// Get kernel
		getKernel(excess, minimumHeight, maximumHeight) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if response is cached
				if(self.cachedKernelResponses.hasOwnProperty(Common.toHexString(excess)) === true) {
				
					// Resolve cached response
					resolve(self.cachedKernelResponses[Common.toHexString(excess)]);
				}
				
				// Otherwise
				else {
		
					// Return getting kernel from response
					return self.getResponse("get_kernel", Node.OBJECT_RESPONSE_TYPE, [
					
						// Excess
						Common.toHexString(excess),
					
						// Minimum height
						minimumHeight,
						
						// Maximum height
						maximumHeight
					], [
					
						// Kernel
						"tx_kernel",
						
						// Height
						"height"
					], [
					
						// Kernel validation
						function(kernel) {
						
							// Check if kernel is invalid
							if(Object.isObject(kernel) === false)
							
								// Return false
								return false;
						
							// Check if kernel's excess is invalid
							if("excess" in kernel === false || Common.isHexString(kernel["excess"]) === false || Common.hexStringLength(kernel["excess"]) !== Crypto.COMMIT_LENGTH || Common.arraysAreEqual(excess, Common.fromHexString(kernel["excess"])) === false)
							
								// Return false
								return false;
							
							// Check if kernel's features is invalid
							if("features" in kernel === false || Object.isObject(kernel["features"]) === false || Object.keys(kernel["features"])["length"] !== SlateKernel.TRANSACTION_FEATURES_LENGTH || SlateKernel.textToFeatures(Object.keys(kernel["features"])[0]) === SlateKernel.UNSUPPORTED_FEATURES)
							
								// Return false
								return false;
							
							// Return true
							return true;
						},
					
						// Height validation
						function(height) {
						
							// Return if height is valid
							return (Common.isNumberString(height) === true || height instanceof BigNumber === true) && (new BigNumber(height)).isInteger() === true && (new BigNumber(height)).isGreaterThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true;
						}
					
					], false, true).then(function(value) {
					
						// Initialize result
						var result = {
						
							// Kernel
							"tx_kernel": {
								
								// Features
								"features": value["tx_kernel"]["features"]
							},
							
							// Height
							"height": new BigNumber(value["height"])
						};
						
						// Cache result
						self.cachedKernelResponses[Common.toHexString(excess)] = result;
						
						// Resolve result
						resolve(result);
					
					// Catch errors
					}).catch(function(error) {
					
						// Check if no kernel exists in the height range
						if(Node.isNotFoundError(error) === true) {
						
							// Cache result
							self.cachedKernelResponses[Common.toHexString(excess)] = Node.NO_KERNEL_FOUND;
						
							// Resolve no kernel found
							resolve(Node.NO_KERNEL_FOUND);
						}
						
						// Otherwise
						else
					
							// Reject error
							reject(error);
					});
				}
			});
		}
		
		// Broadcast transaction
		broadcastTransaction(transaction) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return pushing transaction from response
				return self.getResponse("push_transaction", Node.NO_RESPONSE_TYPE, [
				
					// Transaction
					transaction,
					
					// Fluff
					false,
				
				], Node.NO_VALUE, [], false, false, true).then(function(value) {
				
					// Resolve value
					resolve(value);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Clear cache
		clearCache() {
		
			// Set cached PMMR indices response to no cached response
			this.cachedPmmrIndicesResponse = Node.NO_CACHED_RESPONSE;
			
			// Set cache PMMR indicies parameters to no cache parameters
			this.cachePmmrIndiciesParameters = Node.NO_CACHE_PARAMETERS;
			
			// Set cached unspent outputs response to no cached response
			this.cachedUnspentOutputsResponse = Node.NO_CACHED_RESPONSE;
			
			// Set cache unspent outputs parameters to no cache parameters
			this.cacheUnspentOutputsParameters = Node.NO_CACHE_PARAMETERS;
			
			// Clear cached header responses
			this.cachedHeaderResponses = {};
			
			// Clear cached kernel responses
			this.cachedKernelResponses = {};
		}
		
		// Optimize cache
		optimizeCache() {
		
			// Check if current height is known
			if(this.currentHeight.getHeight() !== Node.UNKNOWN_HEIGHT) {
			
				// Get minimum used height threshold
				var minimumUsedHeightThreshold = this.currentHeight.getHeight().minus(Node.UNUSED_CACHED_RESPONSE_HEIGHT_VARIATION);
				
				// Check if minimum used height threshold is less than the first block height
				if(minimumUsedHeightThreshold.isLessThan(Consensus.FIRST_BLOCK_HEIGHT) === true) {
				
					// Set minimum used height threshold to the first block height
					minimumUsedHeightThreshold = new BigNumber(Consensus.FIRST_BLOCK_HEIGHT);
				}
			
				// Go through all cached header responses
				for(var height in this.cachedHeaderResponses) {
											
					if(this.cachedHeaderResponses.hasOwnProperty(height) === true) {
					
						// Check if header's height is less than the minimum used height threshold
						if(minimumUsedHeightThreshold.isGreaterThan(height) === true) {
						
							// Remove cached header response
							delete this.cachedHeaderResponses[height];
						}
					}
				}
				
				// Go through all cached kernel responses
				for(var commit in this.cachedKernelResponses) {
											
					if(this.cachedKernelResponses.hasOwnProperty(commit) === true) {
					
						// Check if kernel doesn't exist or its height is less than the minimum used height threshold
						if(this.cachedKernelResponses[commit] === Node.NO_KERNEL_FOUND || minimumUsedHeightThreshold.isGreaterThan(this.cachedKernelResponses[commit]["height"]) === true) {
						
							// Remove cached kernel response
							delete this.cachedKernelResponses[commit];
						}
					}
				}
			}
		}
		
		// Connection open event
		static get CONNECTION_OPEN_EVENT() {
		
			// Return connection open event
			return "NodeConnectionOpenEvent";
		}
		
		// Connection warning event
		static get CONNECTION_WARNING_EVENT() {
		
			// Return connection warning event
			return "NodeConnectionWarningEvent";
		}
		
		// Connection close event
		static get CONNECTION_CLOSE_EVENT() {
		
			// Return connection close event
			return "NodeConnectionCloseEvent";
		}
		
		// Height change event
		static get HEIGHT_CHANGE_EVENT() {
		
			// Return height change event
			return "NodeHeightChangeEvent";
		}
		
		// Settings change event
		static get SETTINGS_CHANGE_EVENT() {
		
			// Return settings change event
			return "NodeSettingsChangeEvent";
		}
		
		// Unknown height
		static get UNKNOWN_HEIGHT() {
		
			// Return unknown height
			return null;
		}
		
		// No header found
		static get NO_HEADER_FOUND() {
		
			// Return no header found
			return null;
		}
		
		// No kernel found
		static get NO_KERNEL_FOUND() {
		
			// Return no kernel found
			return null;
		}
		
		// No connection close type
		static get NO_CONNECTION_CLOSE_TYPE() {
		
			// Return no connection close type
			return 0;
		}
		
		// Disconnected close type
		static get DISCONNECTED_CLOSE_TYPE() {
		
			// Return disconnected close type
			return Node.NO_CONNECTION_CLOSE_TYPE + 1;
		}
		
		// Incompatible warning type
		static get INCOMPATIBLE_WARNING_TYPE() {
		
			// Return incompatible warning type
			return 0;
		}
		
		// Invalid response warning type
		static get INVALID_RESPONSE_WARNING_TYPE() {
		
			// Return invalid response warning type
			return Node.INCOMPATIBLE_WARNING_TYPE + 1;
		}
		
		// Unauthorized warning type
		static get UNAUTHORIZED_WARNING_TYPE() {
		
			// Return unauthorized warning type
			return Node.INVALID_RESPONSE_WARNING_TYPE + 1;
		}
		
		// Minimum compatible node version
		static get MINIMUM_COMPATIBLE_NODE_VERSION() {
		
			// Check wallet type
			switch(Consensus.getWalletType()) {
			
				// MWC wallet
				case Consensus.MWC_WALLET_TYPE:
				
					// Return minimum compatible node version
					return "4.2.1";
				
				// GRIN wallet
				case Consensus.GRIN_WALLET_TYPE:
			
					// Return minimum compatible node version
					return "5.0.1";
				
				// EPIC wallet
				case Consensus.EPIC_WALLET_TYPE:
			
					// Return minimum compatible node version
					return "3.3.2";
			}
		}
		
		// No value
		static get NO_VALUE() {
		
			// Return no value
			return null;
		}
		
		// No output found
		static get NO_OUTPUT_FOUND() {
		
			// Return no output found
			return null;
		}
	
	// Private
		
		// Reset
		reset() {
		
			// Check if update height timeout exists
			if(this.updateHeightTimeout !== Node.NO_TIMEOUT) {

				// Clear update height timeout
				clearTimeout(this.updateHeightTimeout);
				
				// Set update height timeout to no timeout
				this.updateHeightTimeout = Node.NO_TIMEOUT;
			}

			// Clear connected
			this.connected = false;

			// Set failed to connect
			this.failedToConnect = true;

			// Clear last height response timestamp
			this.lastHeightResponseTimestamp = Node.NO_HEIGHT_RESPONSE_TIMESTAMP;

			// Set current height's height to an unknown height
			this.currentHeight.setHeight(Node.UNKNOWN_HEIGHT);
		}
		
		// Connect
		connect(disconnectFirst = true) {
		
			// Check if disconnecting first
			if(disconnectFirst === true) {
			
				// Set empty address
				this.emptyAddress = this.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0]["length"] === 0;
			
				// Check if address exists
				if(this.emptyAddress === false) {
			
					// Log message
					Log.logMessage(Language.getDefaultTranslation('Trying to connect to the node at %1$y.'), [
					
						[
							// Text
							this.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0],
							
							// Is raw data
							true
						]
					]);
				}
		
				// Clear connected
				this.connected = false;
				
				// Clear failed to connect
				this.failedToConnect = false;
				
				// Clear last height response timestamp
				this.lastHeightResponseTimestamp = Node.NO_HEIGHT_RESPONSE_TIMESTAMP;
				
				// Clear version obtained
				this.versionObtained = false;
			}
		
			// Set self
			var self = this;
		
			// Get version
			this.getVersion().then(function(version) {
			
				// Check if disconnecting first
				if(disconnectFirst === true) {
			
					// Log message
					Log.logMessage(Language.getDefaultTranslation('Successfully connected to the node.'));
				
					// Log message
					Log.logMessage(Language.getDefaultTranslation('The node\'s version is %1$v.'), [
					
						// Version
						version
					]);
				}
			
				// Set version obtained
				self.versionObtained = true;
			
				// Check if version is compatible
				if(Node.isVersionGreaterThanOrEqual(version, Node.MINIMUM_COMPATIBLE_NODE_VERSION) === true) {
				
					// Get tip
					self.getTip(true).then(function(tip) {
					
						// Set current tip's height and hash
						self.currentHeight.setHeight(tip["height"]);
						self.currentHeight.setHash(tip["last_block_pushed"]);
					
						// Reset retry delay
						self.retryDelay = Node.INITIAL_RETRY_DELAY_MILLISECONDS;
					
						// Set connected
						self.connected = true;
						
						// Clear failed to connect
						self.failedToConnect = false;
						
						// Set last height response timestamp
						self.lastHeightResponseTimestamp = Common.getCurrentTimestamp();
					
						// Trigger connection open event
						$(self).trigger(Node.CONNECTION_OPEN_EVENT);
						
						// Trigger height change event
						$(self).trigger(Node.HEIGHT_CHANGE_EVENT, [
						
							// Height
							tip["height"],
							
							// Last block pushed
							tip["last_block_pushed"]
						]);
						
						// Update height
						self.updateHeight();
					
					// Catch errors
					}).catch(function(error) {
					
					});
				}
				
				// Otherwise
				else {
				
					// Reset
					self.reset();
				
					// Trigger connection warning event
					$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INCOMPATIBLE_WARNING_TYPE);
				}
			
			// Catch errors
			}).catch(function(error) {
			
			});
		}
	
		// Get response
		getResponse(method, responseType, parameters, value, validate, allowUnconnected = false, allowNotFoundError = false, allowMessageError = false) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if not connected and unconnected isn't allowed
				if(self.connected === false && allowUnconnected === false) {
				
					// Reject connection error
					reject([
					
						// Error type
						Node.CONNECTION_ERROR,
						
						// Response
						Node.NO_RESPONSE
					]);
				}
				
				// Otherwise check if first address isn't a valid URL
				else if(Common.isValidUrl(self.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0]) === false) {
				
					// Reset
					self.reset();
				
					// Trigger connection close event
					$(self).trigger(Node.CONNECTION_CLOSE_EVENT, (self.versionObtained === false) ? Node.NO_CONNECTION_CLOSE_TYPE : Node.DISCONNECTED_CLOSE_TYPE);
					
					// Clear version obtained
					self.versionObtained = false;
				
					// Reject connection error
					reject([
					
						// Error type
						Node.CONNECTION_ERROR,
						
						// Response
						Node.NO_RESPONSE
					]);
				}
				
				// Otherwise
				else {
				
					// Get current ignore response index
					var index = self.ignoreResponseIndex++;
					
					// Check if current ignore resposne index is at the max safe integer
					if(index === Number.MAX_SAFE_INTEGER) {
					
						// Reset ignore response index
						self.ignoreResponseIndex = 0;
					}
					
					// Set ignore response
					var ignoreResponse = false;
					
					// Node settings change node index event
					$(self).one(Node.SETTINGS_CHANGE_EVENT + ".node" + index.toFixed(), function() {
					
						// Set ignore response
						ignoreResponse = true;
					});
					
					// Node connection warning node index event
					$(self).one(Node.CONNECTION_WARNING_EVENT + ".node" + index.toFixed(), function() {
					
						// Set ignore response
						ignoreResponse = true;
					});
					
					// Node connection close node index event
					$(self).one(Node.CONNECTION_CLOSE_EVENT + ".node" + index.toFixed(), function() {
					
						// Set ignore response
						ignoreResponse = true;
					});
					
					// Get URL as the first address
					var url = self.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE)[0];
					
					// Get proxy request
					var proxyRequest = Tor.isTorUrl(url) === true && Tor.isSupported() === false;
					
					// Return sending a JSON-RPC request
					return JsonRpc.sendRequest(self.getAddresses(Consensus.getNetworkType() === Consensus.MAINNET_NETWORK_TYPE).map(function(address) {
					
						// Return address with Tor proxy if required and the foreign API path
						return ((Tor.isTorUrl(address) === true && Tor.isSupported() === false) ? self.torProxy.getAddress() : "") + address + Node.FOREIGN_API_URL;
					
					}), method, parameters, (self.getSecret() === Node.NO_SECRET) ? {} : {
					
						// Authorization
						"Authorization": "Basic " + Base64.fromUint8Array((new TextEncoder()).encode(self.getUsername() + ":" + self.getSecret()))
					
					}, JsonRpc.DEFAULT_NUMBER_OF_ATTEMPTS, function() {
					
						// Return if ignoring response
						return ignoreResponse === true;
						
					}).then(function(response) {
					
						// Check if not ignoring response
						if(ignoreResponse === false) {
						
							// Turn off node settings change node index event
							$(self).off(Node.SETTINGS_CHANGE_EVENT + ".node" + index.toFixed());
							
							// Turn off node connection warning node index event
							$(self).off(Node.CONNECTION_WARNING_EVENT + ".node" + index.toFixed());
							
							// Turn off node connection close node index event
							$(self).off(Node.CONNECTION_CLOSE_EVENT + ".node" + index.toFixed());
						}
				
						// Check if response isn't valid
						if(Object.isObject(response) === false || "Ok" in response === false) {
						
							// Set error to invalid response error
							var error = [
							
								// Error type
								Node.INVALID_RESPONSE_ERROR,
								
								// Response
								response
							];
							
							// Check if not ignoring response
							if(ignoreResponse === false) {
							
								// Check if message error is allowed and error is a message error
								if(allowMessageError === true && Node.isMessageError(error) === true) {
								
									// Reject error
									reject(error);
									
									// Return
									return;
								}
							
								// Check if not found error isn't allowed or the error isn't a not found error
								if(allowNotFoundError === false || Node.isNotFoundError(error) === false) {
							
									// Reset
									self.reset();
								
									// Trigger connection warning event
									$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
								}
							}
						
							// Reject error
							reject(error);
						}
						
						// Otherwise
						else {
						
							// Set response to its value
							response = response["Ok"];
							
							// Check if response doesn't match the expected response type
							if((responseType === Node.ARRAY_RESPONSE_TYPE && Array.isArray(response) === false) || (responseType === Node.OBJECT_RESPONSE_TYPE && Object.isObject(response) === false) || (responseType === Node.NO_RESPONSE_TYPE && response !== Node.API_NO_VALUE)) {
							
								// Check if not ignoring response
								if(ignoreResponse === false) {
							
									// Reset
									self.reset();
								
									// Trigger connection warning event
									$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
								}
								
								// Reject invalid response error
								reject([
								
									// Error type
									Node.INVALID_RESPONSE_ERROR,
									
									// Response
									response
								]);
								
								// Return
								return;
							}
							
							// Otherwise check if there is no value
							else if(value === Node.NO_VALUE) {
							
								// Check if response is no value
								if(response === Node.API_NO_VALUE) {
								
									// Set response value to no value
									var responseValue = Node.NO_VALUE;
								}
								
								// Otherwise
								else {
								
									// Check if not ignoring response
									if(ignoreResponse === false) {
								
										// Reset
										self.reset();
									
										// Trigger connection warning event
										$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
									}
								
									// Reject invalid response error
									reject([
									
										// Error type
										Node.INVALID_RESPONSE_ERROR,
										
										// Response
										response
									]);
									
									// Return
									return;
								}
							}
							
							// Otherwise check if there are multiple values
							else if(Array.isArray(value) === true) {
								
								// Check if response is an array
								if(Array.isArray(response) === true) {
								
									// Initialize response value
									var responseValue = [];
								
									// Go through all parts of the response
									for(var i = 0; i < response["length"]; ++i) {
									
										// Set first value
										var firstValue = true;
									
										// Go through all values
										for(var j = 0; j < value["length"]; ++j) {
										
											// Check if response part doesn't contain the value
											if(Object.isObject(response[i]) === false || value[j] in response[i] === false) {
											
												// Check if not ignoring response
												if(ignoreResponse === false) {
											
													// Reset
													self.reset();
												
													// Trigger connection warning event
													$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
												}
												
												// Reject invalid response error
												reject([
												
													// Error type
													Node.INVALID_RESPONSE_ERROR,
													
													// Response
													response
												]);
												
												// Return
												return;
											}
											
											// Check if value is invalid
											if(validate[j](response[i][value[j]], i) === false) {
											
												// Check if not ignoring response
												if(ignoreResponse === false) {
												
													// Reset
													self.reset();
												
													// Trigger connection warning event
													$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
												}
												
												// Reject invalid response error
												reject([
												
													// Error type
													Node.INVALID_RESPONSE_ERROR,
													
													// Response
													response
												]);
												
												// Return
												return;
											}
											
											// Check if first value
											if(firstValue === true) {
											
												// Clear first value
												firstValue = false;
											
												// Append to response value
												responseValue.push({});
											}
											
											// Set value in response value
											responseValue[responseValue["length"] - 1][value[j]] = response[i][value[j]];
										}
									}
								}
								
								// Otherwise check if response is an object
								else if(Object.isObject(response) === true) {
								
									// Initialize response value
									var responseValue = {};
						
									// Go through all values
									for(var i = 0; i < value["length"]; ++i) {
									
										// Check if response doesn't contain the value
										if(value[i] in response === false) {
										
											// Check if not ignoring response
											if(ignoreResponse === false) {
										
												// Reset
												self.reset();
											
												// Trigger connection warning event
												$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
											}
											
											// Reject invalid response error
											reject([
											
												// Error type
												Node.INVALID_RESPONSE_ERROR,
												
												// Response
												response
											]);
											
											// Return
											return;
										}
										
										// Check if value is invalid
										if(validate[i](response[value[i]]) === false) {
										
											// Check if not ignoring response
											if(ignoreResponse === false) {
										
												// Reset
												self.reset();
											
												// Trigger connection warning event
												$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
											}
											
											// Reject invalid response error
											reject([
											
												// Error type
												Node.INVALID_RESPONSE_ERROR,
												
												// Response
												response
											]);
											
											// Return
											return;
										}
										
										// Set value in response value
										responseValue[value[i]] = response[value[i]];
									}
								}
								
								// Otherwise
								else {
								
									// Check if not ignoring response
									if(ignoreResponse === false) {
								
										// Reset
										self.reset();
									
										// Trigger connection warning event
										$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
									}
									
									// Reject invalid response error
									reject([
									
										// Error type
										Node.INVALID_RESPONSE_ERROR,
										
										// Response
										response
									]);
									
									// Return
									return;
								}
							}
							
							// Otherwise
							else {
							
								// Check if response is an array
								if(Array.isArray(response) === true) {
								
									// Initialize response value
									var responseValue = [];
								
									// Go through all parts of the response
									for(var i = 0; i < response["length"]; ++i) {
									
										// Check if response part doesn't contain the value
										if(Object.isObject(response[i]) === false || value in response[i] === false) {
										
											// Check if not ignoring response
											if(ignoreResponse === false) {
										
												// Reset
												self.reset();
											
												// Trigger connection warning event
												$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
											}
											
											// Reject invalid response error
											reject([
											
												// Error type
												Node.INVALID_RESPONSE_ERROR,
												
												// Response
												response
											]);
											
											// Return
											return;
										}
										
										// Check if value is invalid
										if(validate(response[i][value], i) === false) {
										
											// Check if not ignoring response
											if(ignoreResponse === false) {
										
												// Reset
												self.reset();
											
												// Trigger connection warning event
												$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
											}
											
											// Reject invalid response error
											reject([
											
												// Error type
												Node.INVALID_RESPONSE_ERROR,
												
												// Response
												response
											]);
											
											// Return
											return;
										}
										
										// Set value in response value
										responseValue.push(response[i][value]);
									}
								}
								
								// Otherwise check if response is an object
								else if(Object.isObject(response) === true) {
							
									// Check if response doesn't contain the value
									if(value in response === false) {
									
										// Check if not ignoring response
										if(ignoreResponse === false) {
									
											// Reset
											self.reset();
										
											// Trigger connection warning event
											$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
										}
										
										// Reject invalid response error
										reject([
										
											// Error type
											Node.INVALID_RESPONSE_ERROR,
											
											// Response
											response
										]);
										
										// Return
										return;
									}
									
									// Check if value is invalid
									if(validate(response[value]) === false) {
									
										// Check if not ignoring response
										if(ignoreResponse === false) {
									
											// Reset
											self.reset();
										
											// Trigger connection warning event
											$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
										}
										
										// Reject invalid response error
										reject([
										
											// Error type
											Node.INVALID_RESPONSE_ERROR,
											
											// Response
											response
										]);
										
										// Return
										return;
									}
									
									// Set response value to value
									var responseValue = response[value];
								}
								
								// Otherwise
								else {
								
									// Check if not ignoring response
									if(ignoreResponse === false) {
								
										// Reset
										self.reset();
									
										// Trigger connection warning event
										$(self).trigger(Node.CONNECTION_WARNING_EVENT, Node.INVALID_RESPONSE_WARNING_TYPE);
									}
									
									// Reject invalid response error
									reject([
									
										// Error type
										Node.INVALID_RESPONSE_ERROR,
										
										// Response
										response
									]);
									
									// Return
									return;
								}
							}
							
							// Resolve response value
							resolve(responseValue);
						}
					
					// On error
					}).catch(function(responseStatusOrResponse) {
					
						// Check if ignoring response
						if(ignoreResponse === true) {
						
							// Reject connection error
							reject([
							
								// Error type
								Node.CANCELED_RESPONSE_ERROR,
								
								// Response
								Node.NO_RESPONSE
							]);
						
							// Return
							return;
						}
						
						// Otherwise
						else {
						
							// Turn off node settings change node index event
							$(self).off(Node.SETTINGS_CHANGE_EVENT + ".node" + index.toFixed());
							
							// Turn off node connection warning node index event
							$(self).off(Node.CONNECTION_WARNING_EVENT + ".node" + index.toFixed());
							
							// Turn off node connection close node index event
							$(self).off(Node.CONNECTION_CLOSE_EVENT + ".node" + index.toFixed());
						}
						
						// Check if response is provided
						if(typeof responseStatusOrResponse !== "number") {
						
							// Set response status to HTTP ok status
							var responseStatus = Common.HTTP_OK_STATUS;
						}
						
						// Otherwise
						else {
						
							// Set response status to response status
							var responseStatus = responseStatusOrResponse;
						}
						
						// Check if response's status isn't no response or a timed out proxy response
						if(responseStatus !== Common.HTTP_NO_RESPONSE_STATUS || (proxyRequest === true && responseStatus !== Common.HTTP_BAD_GATEWAY_STATUS && responseStatus !== Common.HTTP_GATEWAY_TIMEOUT_STATUS && responseStatus !== Common.HTTP_NO_RESPONSE_STATUS)) {
						
							// Reset
							self.reset();
						
							// Trigger connection warning event
							$(self).trigger(Node.CONNECTION_WARNING_EVENT, (self.usingCustomNode() === true && responseStatus === Common.HTTP_UNAUTHORIZED_STATUS) ? Node.UNAUTHORIZED_WARNING_TYPE : Node.INVALID_RESPONSE_WARNING_TYPE);
							
							// Reject bad response error
							reject([
							
								// Error type
								Node.BAD_RESPONSE_ERROR,
								
								// Response
								responseStatus
							]);
						}
						
						// Otherwise
						else {
						
							// Reset
							self.reset();
						
							// Trigger connection close event
							$(self).trigger(Node.CONNECTION_CLOSE_EVENT, (self.versionObtained === false) ? Node.NO_CONNECTION_CLOSE_TYPE : Node.DISCONNECTED_CLOSE_TYPE);
							
							// Clear version obtained
							self.versionObtained = false;
						
							// Reject connection error
							reject([
							
								// Error type
								Node.CONNECTION_ERROR,
								
								// Response
								Node.NO_RESPONSE
							]);
						}
					});
				}
			});
		}
		
		// Get version
		getVersion() {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return getting version from response
				return self.getResponse("get_version", Node.OBJECT_RESPONSE_TYPE, [], "node_version", function(nodeVersion) {
				
					// Check if node version isn't a string
					if(typeof nodeVersion !== "string")
					
						// Return false
						return false;
					
					// Return if node version is valid
					return Node.VERSION_PATTERN.test(nodeVersion) === true;
				
				}, true).then(function(value) {
				
					// Resolve value
					resolve(value);
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Get tip
		getTip(allowUnconnected = false) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return getting tip from response
				return self.getResponse("get_tip", Node.OBJECT_RESPONSE_TYPE, [], [
				
					// Height
					"height",
					
					// Last block pushed
					"last_block_pushed"
				], [
				
					// Height validation
					function(height) {
					
						// Return if height is valid
						return (Common.isNumberString(height) === true || height instanceof BigNumber === true) && (new BigNumber(height)).isInteger() === true && (new BigNumber(height)).isGreaterThanOrEqualTo(Consensus.FIRST_BLOCK_HEIGHT) === true;
					},
					
					// Last block pushed validation
					function(lastBlockPushed) {
					
						// Return if last block pushed is valid
						return Common.isHexString(lastBlockPushed) === true && Common.hexStringLength(lastBlockPushed) === RecentHeights.HEADER_HASH_LENGTH;
					}
				
				], allowUnconnected).then(function(value) {
				
					// Check if current height is unknown
					if(self.currentHeight.getHeight() === Node.UNKNOWN_HEIGHT) {
				
						// Log message
						Log.logMessage(Language.getDefaultTranslation('The node\'s current height is %1$s.'), [
						
							// Tip height
							(new BigNumber(value["height"])).toFixed()
						]);
					}
					
					// Otherwise check if current height changed
					else if(self.currentHeight.getHeight().isEqualTo(value["height"]) === false) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('The node\'s new height is %1$s.'), [
						
							// Tip height
							(new BigNumber(value["height"])).toFixed()
						]);
					}
				
					// Resolve
					resolve({
					
						// Height
						"height": new BigNumber(value["height"]),
						
						// Last block pushed
						"last_block_pushed": Common.fromHexString(value["last_block_pushed"])
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Update height
		updateHeight(runImmediately = false) {
		
			// Check if update height timeout exists
			if(this.updateHeightTimeout !== Node.NO_TIMEOUT) {
			
				// Clear update height timeout
				clearTimeout(this.updateHeightTimeout);
				
				// Set update height timeout to no timeout
				this.updateHeightTimeout = Node.NO_TIMEOUT;
			}
			
			// Set self
			var self = this;
			
			// Check if run immediately
			if(runImmediately === true) {
			
				// Get tip
				this.getTip().then(function(tip) {
				
					// Set current tip's height and hash
					self.currentHeight.setHeight(tip["height"]);
					self.currentHeight.setHash(tip["last_block_pushed"]);
					
					// Set last height response timestamp
					self.lastHeightResponseTimestamp = Common.getCurrentTimestamp();
					
					// Trigger height change event
					$(self).trigger(Node.HEIGHT_CHANGE_EVENT, [
					
						// Height
						tip["height"],
						
						// Last block pushed
						tip["last_block_pushed"],
						
						// Ignore synced status
						true
					]);
					
					// Update height
					self.updateHeight();
				
				// Catch errors
				}).catch(function(error) {
				
				});
			}
			
			// Otherwise
			else {
		
				// Set update height timeout
				this.updateHeightTimeout = setTimeout(function() {
				
					// Set update height timeout to no timeout
					self.updateHeightTimeout = Node.NO_TIMEOUT;
			
					// Get tip
					self.getTip().then(function(tip) {
					
						// Set current tip's height and hash
						self.currentHeight.setHeight(tip["height"]);
						self.currentHeight.setHash(tip["last_block_pushed"]);
						
						// Set last height response timestamp
						self.lastHeightResponseTimestamp = Common.getCurrentTimestamp();
						
						// Trigger height change event
						$(self).trigger(Node.HEIGHT_CHANGE_EVENT, [
						
							// Height
							tip["height"],
							
							// Last block pushed
							tip["last_block_pushed"]
						]);
						
						// Update height
						self.updateHeight();
					
					// Catch errors
					}).catch(function(error) {
					
					});
				
				}, Node.UPDATE_HEIGHT_INTERVAL_SECONDS * Common.MILLISECONDS_IN_A_SECOND);
			}
		}
		
		// Get username
		getUsername(isMainnet) {
		
			// Check wallet type
			switch(Consensus.getWalletType()) {
			
				// MWC wallet
				case Consensus.MWC_WALLET_TYPE:
				
					// Check if mainnet
					if(isMainnet === true)
				
						// Return username
						return "mwcmain";
					
					// Otherwise
					else
					
						// Return address
						return "mwcfloo";
					
					// Break
					break;
				
				// GRIN wallet
				case Consensus.GRIN_WALLET_TYPE:
			
					// Return username
					return "grin";
				
				// EPIC wallet
				case Consensus.EPIC_WALLET_TYPE:
			
					// Return username
					return "epic";
			}
		}
		
		// Get secret
		getSecret() {
		
			// Check if not using a custom node
			if(this.usingCustomNode() === false) {
			
				// Check wallet type
				switch(Consensus.getWalletType()) {
				
					// MWC wallet
					case Consensus.MWC_WALLET_TYPE:
					
						// Return secret
						return "11ne3EAUtOXVKwhxm84U";
					
					// GRIN or EPIC wallet
					case Consensus.GRIN_WALLET_TYPE:
					case Consensus.EPIC_WALLET_TYPE:
				
						// Return secret
						return Node.NO_SECRET;
				}
			}
			
			// Otherwise
			else {
			
				// Check if custom node's secret doesn't exist
				if(this.customNodeSecret["length"] === 0)
				
					// Return no secret
					return Node.NO_SECRET;
				
				// Otherwise
				else
			
					// Return custom node's secret
					return this.customNodeSecret;
			}
		}
		
		// Is version greater than or equal
		static isVersionGreaterThanOrEqual(firstVersion, secondVersion) {
		
			// Check if versions are equal
			if(firstVersion === secondVersion)
			
				// Return true
				return true;
			
			// Get first version components
			var firstVersionComponents = firstVersion.split(Node.VERSION_COMPONENT_PATTERN).map(function(versionComponent) {
			
				// Return version component as a number
				return (Common.isNumberString(versionComponent) === false || (new BigNumber(versionComponent)).isInteger() === false) ? Node.versionComponentTextToNumber(versionComponent).toFixed() : versionComponent;
			});
			
			// Get second version components
			var secondVersionComponents = secondVersion.split(Node.VERSION_COMPONENT_PATTERN).map(function(versionComponent) {
			
				// Return version component as a number
				return (Common.isNumberString(versionComponent) === false || (new BigNumber(versionComponent)).isInteger() === false) ? Node.versionComponentTextToNumber(versionComponent).toFixed() : versionComponent;
			});
			
			// Go through all version components
			for(var i = 0; i < Math.max(firstVersionComponents["length"], secondVersionComponents["length"]); ++i) {
			
				// Get version component numbers
				var firstVersionComponentNumber = new BigNumber((i < firstVersionComponents["length"]) ? firstVersionComponents[i] : Node.RELEASE_VERSION_COMPONENT_TEXT_VALUE.toFixed());
				var secondVersionComponentNumber = new BigNumber((i < secondVersionComponents["length"]) ? secondVersionComponents[i] : Node.RELEASE_VERSION_COMPONENT_TEXT_VALUE.toFixed());
			
				// Check if first version component number is greater than second version component number
				if(firstVersionComponentNumber.isGreaterThan(secondVersionComponentNumber) === true) {
				
					// Return true
					return true;
				}
				
				// Otherwise check if first version component number is less than second version component number
				else if(firstVersionComponentNumber.isLessThan(secondVersionComponentNumber) === true) {
				
					// Return false
					return false;
				}
			}
			
			// Return true
			return true;
		}
		
		// Version component text to number
		static versionComponentTextToNumber(versionComponentText) {
		
			// Make version component text lower case
			versionComponentText = versionComponentText.toLowerCase();
		
			// Return version component text value or release version component text value if not found
			return (versionComponentText in Node.VERSION_COMPONENT_TEXT_VALUES === true) ? Node.VERSION_COMPONENT_TEXT_VALUES[versionComponentText] : Node.RELEASE_VERSION_COMPONENT_TEXT_VALUE;
		}
		
		// Is not found error
		static isNotFoundError(error) {
		
			// Return if error is that the value wasn't found
			return Array.isArray(error) === true && error["length"] > Node.ERROR_RESPONSE_INDEX && error[Node.ERROR_TYPE_INDEX] === Node.INVALID_RESPONSE_ERROR && Object.isObject(error[Node.ERROR_RESPONSE_INDEX]) === true && "Err" in error[Node.ERROR_RESPONSE_INDEX] === true && ((Object.isObject(error[Node.ERROR_RESPONSE_INDEX]["Err"]) === true && "NotFound" in error[Node.ERROR_RESPONSE_INDEX]["Err"] === true) || error[Node.ERROR_RESPONSE_INDEX]["Err"] === "NotFound");
		}
		
		// Is message error
		static isMessageError(error) {
		
			// Return if error contains a message
			return Array.isArray(error) === true && error["length"] > Node.ERROR_RESPONSE_INDEX && error[Node.ERROR_TYPE_INDEX] === Node.INVALID_RESPONSE_ERROR && Object.isObject(error[Node.ERROR_RESPONSE_INDEX]) === true && "Err" in error[Node.ERROR_RESPONSE_INDEX] === true && Object.isObject(error[Node.ERROR_RESPONSE_INDEX]["Err"]) === true && "Internal" in error[Node.ERROR_RESPONSE_INDEX]["Err"] === true && typeof error[Node.ERROR_RESPONSE_INDEX]["Err"]["Internal"] === "string";
		}
		
		// Version pattern
		static get VERSION_PATTERN() {
		
			// Return version pattern
			return /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[^\d].*)?$/u;
		}
		
		// Version component text values
		static get VERSION_COMPONENT_TEXT_VALUES() {
		
			// Return version component text values
			return {
			
				// Release
				"release": 0,
				
				// Beta
				"beta": -1,
				
				// Alpha
				"alpha": -2,
				
				// Dev
				"dev": -3,
				
				// Canary
				"canary": -4
			};
		}
		
		// Release version component text value
		static get RELEASE_VERSION_COMPONENT_TEXT_VALUE() {
		
			// Return release version component text value
			return Node.VERSION_COMPONENT_TEXT_VALUES["release"];
		}
		
		// Version component pattern
		static get VERSION_COMPONENT_PATTERN() {
		
			// Return version component pattern
			return /[\.-]/ug;
		}
		
		// Connection error
		static get CONNECTION_ERROR() {
		
			// Return connection error
			return 0;
		}
		
		// Invalid response error
		static get INVALID_RESPONSE_ERROR() {
		
			// Return invalid response error
			return Node.CONNECTION_ERROR + 1;
		}
		
		// Bad response error
		static get BAD_RESPONSE_ERROR() {
		
			// Return bad response error
			return Node.INVALID_RESPONSE_ERROR + 1;
		}
		
		// Canceled response error
		static get CANCELED_RESPONSE_ERROR() {
		
			// Return canceled response error
			return Node.BAD_RESPONSE_ERROR + 1;
		}
		
		// Initial retry delay milliseconds
		static get INITIAL_RETRY_DELAY_MILLISECONDS() {
		
			// Return initial retry delay milliseconds
			return 1 * Common.MILLISECONDS_IN_A_SECOND;
		}
		
		// Maximum retry delay milliseconds
		static get MAXIMUM_RETRY_DELAY_MILLISECONDS() {
		
			// Return maximum retry delay milliseconds
			return Consensus.BLOCK_TIME_SECONDS * Common.MILLISECONDS_IN_A_SECOND;
		}
		
		// Retry delay scaling factor
		static get RETRY_DELAY_SCALING_FACTOR() {
		
			// Return retry delay scaling factor
			return 3;
		}
		
		// No timeout
		static get NO_TIMEOUT() {
		
			// Return no timeout
			return null;
		}
		
		// Settings use custom node name
		static get SETTINGS_USE_CUSTOM_NODE_NAME() {
		
			// Return settings use custom node name
			return "Use Custom Node";
		}
		
		// Settings use custom node default value
		static get SETTINGS_USE_CUSTOM_NODE_DEFAULT_VALUE() {
		
			// Return settings use custom node default value
			return false;
		}
		
		// Settings custom node address name
		static get SETTINGS_CUSTOM_NODE_ADDRESS_NAME() {
		
			// Return settings custom node address name
			return "Custom Node Address";
		}
		
		// Settings custom node address default value
		static get SETTINGS_CUSTOM_NODE_ADDRESS_DEFAULT_VALUE() {
		
			// Return settings custom node address default value
			return "";
		}
		
		// Settings custom node secret name
		static get SETTINGS_CUSTOM_NODE_SECRET_NAME() {
		
			// Return settings custom node secret name
			return "Custom Node Secret";
		}
		
		// Settings custom node secret default value
		static get SETTINGS_CUSTOM_NODE_SECRET_DEFAULT_VALUE() {
		
			// Return settings custom node secret default value
			return "";
		}
		
		// No response
		static get NO_RESPONSE() {
		
			// Return no response
			return null;
		}
		
		// Error type index
		static get ERROR_TYPE_INDEX() {
		
			// Return error type index
			return 0;
		}
		
		// Error response index
		static get ERROR_RESPONSE_INDEX() {
		
			// Return error response index
			return Node.ERROR_TYPE_INDEX + 1;
		}
		
		// Foreign API version
		static get FOREIGN_API_VERSION() {
		
			// Return foreign API version
			return 2;
		}
		
		// Foreign API URL
		static get FOREIGN_API_URL() {
		
			// Return foreign API URL
			return "/v" + Node.FOREIGN_API_VERSION.toFixed() + "/foreign";
		}
		
		// API no value
		static get API_NO_VALUE() {
		
			// Return API no value
			return null;
		}
		
		// No height response timestamp
		static get NO_HEIGHT_RESPONSE_TIMESTAMP() {
		
			// Return no height response timestamp
			return null;
		}
		
		// Maximum no height response duration seconds
		static get MAXIMUM_NO_HEIGHT_RESPONSE_DURATION_SECONDS() {
		
			// Return maximum no height response duration seconds
			return 3 * Node.UPDATE_HEIGHT_INTERVAL_SECONDS;
		}
		
		// No secret
		static get NO_SECRET() {
		
			// Return no secret
			return "";
		}
		
		// Update height interval seconds
		static get UPDATE_HEIGHT_INTERVAL_SECONDS() {
		
			// Return update height interval seconds
			return Consensus.BLOCK_TIME_SECONDS;
		}
		
		// Array response type
		static get ARRAY_RESPONSE_TYPE() {
		
			// Return array response type
			return 0;
		}
		
		// Object response type
		static get OBJECT_RESPONSE_TYPE() {
		
			// Return object response type
			return Node.ARRAY_RESPONSE_TYPE + 1;
		}
		
		// NO response type
		static get NO_RESPONSE_TYPE() {
		
			// Return no response type
			return Node.OBJECT_RESPONSE_TYPE + 1;
		}
		
		// No cached response
		static get NO_CACHED_RESPONSE() {
		
			// Return no cached response
			return null;
		}
		
		// No cache parameters
		static get NO_CACHE_PARAMETERS() {
		
			// Return no cache parameters
			return null;
		}
		
		// No PMMR indices
		static get NO_PMMR_INDICES() {
		
			// Return no PMMR indices
			return null;
		}
		
		// Unused cached response height variation
		static get UNUSED_CACHED_RESPONSE_HEIGHT_VARIATION() {
		
			// Return unused cached response height variation
			return Consensus.BLOCK_HEIGHT_WEEK;
		}
		
		// First index
		static get FIRST_INDEX() {
		
			// Return first index
			return new BigNumber(1);
		}
}


// Main function

// Set global object's node
globalThis["Node"] = Node;
