// Use strict
"use strict";


// Classes

// Output class
class Output {

	// Public
	
		// Initialize
		static initialize() {
		
			// Initialize request index
			Output.requestIndex = 0;
			
			// Initialize worker index
			Output.workerIndex = 0;
		
			// Initialize workers
			Output.workers = [];
			
			// Get the number of processors or the default number of processors if not available
			var numberOfProcessors = ("hardwareConcurrency" in navigator === true) ? navigator["hardwareConcurrency"] : Output.DEFAULT_NUMBER_OF_PROCESSORS;
			
			// Check if device has low memory
			if(Common.isLowMemoryDevice() === true)
			
				// Only create one worker to reduce memory usage
				numberOfProcessors = 1;
			
			// Go through all of the processors
			for(var i = 0; i < numberOfProcessors; ++i)
		
				// Create worker and append it to list of workers
				Output.workers.push(new Worker(Output.WORKER_FILE_LOCATION));
			
			// Window before unload event
			$(window).on("beforeunload", function() {
			
				// Go through all of the workers
				for(var i = 0; i < Output.workers["length"]; ++i) {
				
					// Get worker
					var worker = Output.workers[i];
					
					// Get current request index
					var currentRequestIndex = Output.requestIndex++;
					
					// Check if current request index is at the max safe integer
					if(currentRequestIndex === Number.MAX_SAFE_INTEGER)
					
						// Reset request index
						Output.requestIndex = 0;
					
					// Send worker an uninitialize request
					worker.postMessage([
					
						// Request index
						currentRequestIndex,
					
						// Type
						Output.UNINITIALIZE_REQUEST_TYPE
					]);
			
					// Terminate worker
					worker.terminate();
				}
			});
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Initialize initialize workers
				var initializeWorkers = [];
			
				// Go through all of the workers
				for(var i = 0; i < Output.workers["length"]; ++i) {
				
					// Get worker
					let worker = Output.workers[i];
					
					// Append initializing worker to list
					initializeWorkers.push(new Promise(function(resolve, reject) {
				
						// Worker on error
						worker["onerror"] = function() {

							// Reject error
							reject("Failed to create output worker.");
						};
						
						// Worker on message
						worker["onmessage"] = function(event) {
						
							// Get message
							var message = event["data"];
							
							// Get message's request index
							var requestIndex = message[Output.MESSAGE_REQUEST_INDEX_OFFSET];
							
							// Check message's type
							switch(message[Output.MESSAGE_TYPE_OFFSET]) {
							
								// Initialize request type
								case Output.INITIALIZE_REQUEST_TYPE:
								
									// Get message's status
									var status = message[Output.MESSAGE_STATUS_OFFSET];
								
									// Check if worker initialized successfully
									if(status === Output.STATUS_SUCCESS_VALUE)
								
										// Resolve
										resolve();
									
									// Otherwise
									else
									
										// Reject error
										reject("Failed to initialize output worker.");
								
									// Break
									break;
								
								// Default
								default:
								
									// Get message's response
									var response = message[Output.MESSAGE_RESPONSE_OFFSET];
									
									// Trigger response request index event
									$(document).trigger(Output.RESPONSE_EVENT + requestIndex.toFixed(), [
									
										// Response
										response
									]);
									
									// Break
									break;
							}
						};
					}));
					
					// Get current request index
					var currentRequestIndex = Output.requestIndex++;
					
					// Check if current request index is at the max safe integer
					if(currentRequestIndex === Number.MAX_SAFE_INTEGER)
					
						// Reset request index
						Output.requestIndex = 0;
					
					// Send worker an initialize request
					worker.postMessage([
					
						// Request index
						currentRequestIndex,
					
						// Type
						Output.INITIALIZE_REQUEST_TYPE,
						
						// URL query string
						Common.URL_QUERY_STRING_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_WALLET_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.walletTypeToText(Consensus.getWalletType())).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_NETWORK_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.networkTypeToText(Consensus.getNetworkType())).replace(/%20/ug, "+")
					]);
				}
				
				// Return initializing all workers
				return Promise.all(initializeWorkers).then(function() {
				
					// Resolve
					resolve();
					
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
	
		// Constructor
		constructor(commit, proof, type, height) {
		
			// Set commit
			this.commit = commit;
			
			// Set proof
			this.proof = proof;
			
			// Set type
			this.type = type;
			
			// Set height
			this.height = height;
			
			// Set maturity height
			this.maturityHeight = (this.isCoinbase() === true) ? this.getHeight().plus(Consensus.COINBASE_MATURITY - 1) : this.getHeight();
		}
		
		// Get commit
		getCommit() {
		
			// Return commit
			return this.commit;
		}
		
		// Get proof
		getProof() {
		
			// Return proof
			return this.proof;
		}
		
		// Is coinbase
		isCoinbase() {
		
			// Return if type is coinbase type
			return this.type === Output.COINBASE_TYPE;
		}
		
		// Is transaction
		isTransaction() {
		
			// Return is type is transaction type
			return this.type === Output.TRANSACTION_TYPE;
		}
		
		// Get height
		getHeight() {
		
			// Return height
			return this.height;
		}
		
		// Get maturity height
		getMaturityHeight() {
		
			// Return maturity height
			return this.maturityHeight;
		}
		
		// Get information
		getInformation(extendedPrivateKeyOrRootPublicKey, isMainnet) {
		
			// Set self
			var self = this;
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if an extended private key is provided
				if(extendedPrivateKeyOrRootPublicKey["length"] !== Crypto.SECP256K1_PUBLIC_KEY_LENGTH) {
				
					// Get extended private key
					var extendedPrivateKey = extendedPrivateKeyOrRootPublicKey;
			
					// Return getting output legacy information
					return self.getLegacyOutputInformation(extendedPrivateKey, isMainnet).then(function(legacyOutputInformation) {
					
						// Check if legacy output information is no information
						if(legacyOutputInformation === Output.NO_INFORMATION) {
						
							// Return getting new output infromation
							return self.getNewOutputInformation(extendedPrivateKey).then(function(newOutputInformation) {
							
								// Resolve new output information
								resolve(newOutputInformation);
							
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
						
						// Otherwise
						else {
						
							// Resolve legacy output information
							resolve(legacyOutputInformation);
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Return getting new output infromation
						return self.getNewOutputInformation(extendedPrivateKey).then(function(newOutputInformation) {
						
							// Resolve new output information
							resolve(newOutputInformation);
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					});
				}
				
				// Otherwise
				else {
				
					// Get root public key
					var rootPublicKey = extendedPrivateKeyOrRootPublicKey;
				
					// Return getting view output infromation
					return self.getViewOutputInformation(rootPublicKey).then(function(viewOutputInformation) {
					
						// Resolve view output information
						resolve(viewOutputInformation);
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
			});
		}
		
		// No information
		static get NO_INFORMATION() {
		
			// Return no information
			return null;
		}
		
		// Coinbase type
		static get COINBASE_TYPE() {
		
			// Return coinbase type
			return "Coinbase";
		}
		
		// Transaction type
		static get TRANSACTION_TYPE() {
		
			// Return transaction type
			return "Transaction";
		}
		
		// Initialize request type
		static get INITIALIZE_REQUEST_TYPE() {
		
			// Return initialize request type
			return 0;
		}
		
		// Uninitialize request type
		static get UNINITIALIZE_REQUEST_TYPE() {
		
			// Return uninitialize request type
			return Output.INITIALIZE_REQUEST_TYPE + 1;
		}
		
		// Legacy information request type
		static get LEGACY_INFORMATION_REQUEST_TYPE() {
		
			// Return legacy information request type
			return Output.UNINITIALIZE_REQUEST_TYPE + 1;
		}
		
		// New information request type
		static get NEW_INFORMATION_REQUEST_TYPE() {
		
			// Return new information request type
			return Output.LEGACY_INFORMATION_REQUEST_TYPE + 1;
		}
		
		// View information request type
		static get VIEW_INFORMATION_REQUEST_TYPE() {
		
			// Return view information request type
			return Output.NEW_INFORMATION_REQUEST_TYPE + 1;
		}
		
		// Message request index offset
		static get MESSAGE_REQUEST_INDEX_OFFSET() {
		
			// Return message request index offset
			return 0;
		}
		
		// Message type offset
		static get MESSAGE_TYPE_OFFSET() {
		
			// Return message type offset
			return Output.MESSAGE_REQUEST_INDEX_OFFSET + 1;
		}
		
		// Message initialize URL query string offset
		static get MESSAGE_INITIALIZE_URL_QUERY_STRING_OFFSET() {
		
			// Return message initialize URL query string offset
			return Output.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Message proof offset
		static get MESSAGE_PROOF_OFFSET() {
		
			// Return message proof offset
			return Output.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Message commit offset
		static get MESSAGE_COMMIT_OFFSET() {
		
			// Return message commit offset
			return Output.MESSAGE_PROOF_OFFSET + 1;
		}
		
		// Message extended private key or root public key offset
		static get MESSAGE_EXTENDED_PRIVATE_KEY_OR_ROOT_PUBLIC_KEY_OFFSET() {
		
			// Return message extended private key or root public key offset
			return Output.MESSAGE_COMMIT_OFFSET + 1;
		}
		
		// Status success value
		static get STATUS_SUCCESS_VALUE() {
		
			// Return status success value
			return true;
		}
		
		// Status failed value
		static get STATUS_FAILED_VALUE() {
		
			// Return status failed value
			return false;
		}
	
	// Private
	
		// Send request
		static sendRequest(request) {
		
			// Get current request index
			var currentRequestIndex = Output.requestIndex++;
			
			// Check if current request index is at the max safe integer
			if(currentRequestIndex === Number.MAX_SAFE_INTEGER)
			
				// Reset request index
				Output.requestIndex = 0;
			
			// Add current request index to request
			request.unshift(currentRequestIndex);
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Response current request index event
				$(document).one(Output.RESPONSE_EVENT + currentRequestIndex.toFixed(), function(event, response) {
				
					// Resolve response
					resolve(response);
				});
			
				// Send worker at worker index the request
				Output.workers[Output.workerIndex].postMessage(request);
				
				// Increment worker index
				Output.workerIndex = (Output.workerIndex + 1) % Output.workers["length"];
			});
		}
		
		// Get legacy output information
		getLegacyOutputInformation(extendedPrivateKey, isMainnet) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check wallet type
				switch(Consensus.getWalletType()) {
				
					// MWC or GRIN wallet
					case Consensus.MWC_WALLET_TYPE:
					case Consensus.GRIN_WALLET_TYPE:
			
						// Get legacy previous weeks ago
						var legacyPreviousWeeksAgo = self.getHeight().minus(Output.LEGACY_PREVIOUS_BLOCKS_CHECK_DURATION);
						
						if(legacyPreviousWeeksAgo.isLessThan(0) === true)
							legacyPreviousWeeksAgo = new BigNumber(0);
						
						// Set perform legacy check to if the output could be legacy
						var performLegacyCheck = Consensus.isValidHeaderVersion(isMainnet, legacyPreviousWeeksAgo, Consensus.LEGACY_HEADER_VERSION) === true;
						
						// Break
						break;
					
					// EPIC wallet
					case Consensus.EPIC_WALLET_TYPE:
					
						// Set perform legacy check
						var performLegacyCheck = true;
						
						// Break
						break;
				}
			
				// Check if performing legacy check
				if(performLegacyCheck === true) {
				
					// Return sending legacy information request
					return Output.sendRequest([
					
						// Type
						Output.LEGACY_INFORMATION_REQUEST_TYPE,
						
						// Proof
						self.getProof(),
						
						// Commit
						self.getCommit(),
						
						// Extended private key
						extendedPrivateKey
					
					]).then(function(response) {
					
						// Check if response is no information
						if(response === Output.NO_INFORMATION)
						
							// Resolve no information
							resolve(Output.NO_INFORMATION);
						
						// Otherwise
						else {
						
							// Get amount from response
							var amount = Common.unserializeObject(response[Output.RESPONSE_AMOUNT_INDEX]);
							
							// Get identifier from response
							var identifier = Common.unserializeObject(response[Output.RESPONSE_IDENTIFIER_INDEX]);
							
							// Get switch type from response
							var switchType = response[Output.RESPONSE_SWITCH_TYPE_INDEX];
						
							// Create legacy output information
							var legacyOutputInformation = new OutputInformation(self, amount, identifier, switchType);
							
							// Resolve legacy output information
							resolve(legacyOutputInformation);
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
				
				// Otherwise
				else {
				
					// Resolve no information
					resolve(Output.NO_INFORMATION);
				}
			});
		}
		
		// Get new output information
		getNewOutputInformation(extendedPrivateKey) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return sending new information request
				return Output.sendRequest([
				
					// Type
					Output.NEW_INFORMATION_REQUEST_TYPE,
					
					// Proof
					self.getProof(),
					
					// Commit
					self.getCommit(),
					
					// Extended private key
					extendedPrivateKey
				
				]).then(function(response) {
				
					// Check if response is no information
					if(response === Output.NO_INFORMATION)
					
						// Resolve no information
						resolve(Output.NO_INFORMATION);
					
					// Otherwise
					else {
					
						// Get amount from response
						var amount = Common.unserializeObject(response[Output.RESPONSE_AMOUNT_INDEX]);
						
						// Get identifier from response
						var identifier = Common.unserializeObject(response[Output.RESPONSE_IDENTIFIER_INDEX]);
						
						// Get switch type from response
						var switchType = response[Output.RESPONSE_SWITCH_TYPE_INDEX];
					
						// Create new output information
						var newOutputInformation = new OutputInformation(self, amount, identifier, switchType);
						
						// Resolve new output information
						resolve(newOutputInformation);
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Get view output information
		getViewOutputInformation(extendedPrivateKeyOrRootPublicKey) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return sending view information request
				return Output.sendRequest([
				
					// Type
					Output.VIEW_INFORMATION_REQUEST_TYPE,
					
					// Proof
					self.getProof(),
					
					// Commit
					self.getCommit(),
					
					// Extended private key or root public key
					extendedPrivateKeyOrRootPublicKey
				
				]).then(function(response) {
				
					// Check if response is no information
					if(response === Output.NO_INFORMATION)
					
						// Resolve no information
						resolve(Output.NO_INFORMATION);
					
					// Otherwise
					else {
					
						// Get amount from response
						var amount = Common.unserializeObject(response[Output.RESPONSE_AMOUNT_INDEX]);
						
						// Get identifier from response
						var identifier = Common.unserializeObject(response[Output.RESPONSE_IDENTIFIER_INDEX]);
						
						// Get switch type from response
						var switchType = response[Output.RESPONSE_SWITCH_TYPE_INDEX];
					
						// Create view output information
						var viewOutputInformation = new OutputInformation(self, amount, identifier, switchType);
						
						// Resolve view output information
						resolve(viewOutputInformation);
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Message status offset
		static get MESSAGE_STATUS_OFFSET() {
		
			// Return message status offset
			return Output.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Message response offset
		static get MESSAGE_RESPONSE_OFFSET() {
		
			// Return message response offset
			return Output.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Response event
		static get RESPONSE_EVENT() {
		
			// Return response event
			return "OutputResponseEvent";
		}
		
		// Response amount index
		static get RESPONSE_AMOUNT_INDEX() {
		
			// Return response amount index
			return 0;
		}
		
		// Response identifier index
		static get RESPONSE_IDENTIFIER_INDEX() {
		
			// Return response identifier index
			return Output.RESPONSE_AMOUNT_INDEX + 1;
		}
		
		// Response switch type index
		static get RESPONSE_SWITCH_TYPE_INDEX() {
		
			// Return response switch type index
			return Output.RESPONSE_IDENTIFIER_INDEX + 1;
		}
		
		// Default number of processors
		static get DEFAULT_NUMBER_OF_PROCESSORS() {
		
			// Return default number of processors
			return 1;
		}
		
		// Legacy previous blocks check duration
		static get LEGACY_PREVIOUS_BLOCKS_CHECK_DURATION() {
		
			// Return legacy previous blocks check duration
			return 2 * Consensus.BLOCK_HEIGHT_WEEK;
		}
		
		// Worker file location
		static get WORKER_FILE_LOCATION() {
		
			// Return worker file location
			return "." + getResource("./scripts/output_worker.js");
		}
}


// Main function

// Set global object's output
globalThis["Output"] = Output;
