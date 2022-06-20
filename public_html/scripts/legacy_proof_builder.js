// Use strict
"use strict";


// Classes

// Legacy proof builder class
class LegacyProofBuilder extends ProofBuilder {

	// Public
	
		// Initialize
		initialize(extendedPrivateKey) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Return deriving root hash from extended private key and root identifier
				return Crypto.deriveSecretKey(extendedPrivateKey, new BigNumber(0), new Identifier(Identifier.ROOT_SERIALIZED_IDENTIFIER), Crypto.SWITCH_TYPE_REGULAR).then(function(rootHash) {
				
					// Set root hash
					self.rootHash = rootHash;
					
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Uninitialize
		uninitialize() {
		
			// Securely clear root hash
			this.rootHash.fill(0);
		}
	
		// Rewind nonce
		rewindNonce(commit) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if getting nonce from root hash and commit was successful
				var nonce = Blake2b.compute(Crypto.NONCE_LENGTH, self.rootHash, commit);
				
				if(nonce !== Blake2b.OPERATION_FAILED) {
				
					// Check if nonce is a valid secret key
					if(Secp256k1Zkp.isValidSecretKey(nonce) === true) {
					
						// Resolve nonce
						resolve(nonce);
					}
					
					// Otherwise
					else {
					
						// Securely clear nonce
						nonce.fill(0);
					
						// Reject error
						reject("Nonce is not a valid secret key.");
					}
				}
				
				// Otherwise
				else {
				
					// Reject error
					reject("Getting nonce failed.");
				}
			});
		}
		
		// Private nonce
		privateNonce(commit) {
		
			// Return rewind nonce
			return this.rewindNonce(commit);
		}
		
		// Proof message
		proofMessage(identifier, switchType) {
		
			// Create message
			var message = new Uint8Array(LegacyProofBuilder.MESSAGE_LENGTH).fill(0);
			
			// Set everything after message's header to the identifier's path value
			message = Common.mergeArrays([
			
				// Message header
				message.subarray(0, LegacyProofBuilder.MESSAGE_HEADER_LENGTH),
				
				// Identifier's path value
				identifier.getValue().subarray(Identifier.PATHS_INDEX)
			]);
			
			// Return message
			return message;
		}
		
		// Get output
		getOutput(extendedPrivateKey, amount, commit, message) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if message is valid
				if(message["length"] === LegacyProofBuilder.MESSAGE_LENGTH && Common.arraysAreEqual(message.subarray(0, LegacyProofBuilder.MESSAGE_HEADER_START["length"]), LegacyProofBuilder.MESSAGE_HEADER_START) === true) {
				
					// Set switch type
					var switchType = LegacyProofBuilder.MESSAGE_SWITCH_TYPE;
					
					// Set depth
					var depth = LegacyProofBuilder.MESSAGE_DEPTH;
					
					// Try
					try {
					
						// Create identifier from depth and message
						var identifier = new Identifier(depth.toString(Common.HEX_NUMBER_BASE).padStart(Common.HEX_NUMBER_LENGTH, Common.HEX_NUMBER_PADDING) + Common.toHexString(message.subarray(LegacyProofBuilder.MESSAGE_HEADER_LENGTH)));
					}
					
					// Catch errors
					catch(error) {
					
						// Reject error
						reject("Identifier isn't valid.");
						
						// Return
						return;
					}
					
					// Return getting commit from extended private key, amount, identifier, and switch type
					return Crypto.commit(extendedPrivateKey, amount, identifier, switchType).then(function(computedCommit) {
					
						// Check if commit matches the computed commit
						if(Common.arraysAreEqual(commit, computedCommit) === true) {
						
							// Resolve
							resolve([
							
								// Identifier
								identifier,
								
								// Switch type
								switchType
							]);
						}
						
						// Otherwise
						else {
						
							// Reject error
							reject("Output isn't valid.");
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
				
				// Otherwise
				else {
				
					// Reject error
					reject("Message isn't valid.");
				}
			});
		}
	
	// Private
	
		// Message header start
		static get MESSAGE_HEADER_START() {
		
			// Return message header start
			return new Uint8Array([0, 0, 0, 0]);
		}
		
		// Message switch type
		static get MESSAGE_SWITCH_TYPE() {
		
			// Return message switch type
			return Crypto.SWITCH_TYPE_REGULAR;
		}
		
		// Message depth
		static get MESSAGE_DEPTH() {
		
			// Return message depth
			return 3;
		}
		
		// Message header length
		static get MESSAGE_HEADER_LENGTH() {
		
			// Return message header length
			return LegacyProofBuilder.MESSAGE_HEADER_START["length"];
		}

		// Message length
		static get MESSAGE_LENGTH() {
		
			// Return message length
			return LegacyProofBuilder.MESSAGE_HEADER_LENGTH + Identifier.MAX_DEPTH * Uint32Array["BYTES_PER_ELEMENT"];
		}
}


// Main function

// Set global object's legacy proof builder
globalThis["LegacyProofBuilder"] = LegacyProofBuilder;
