// Use strict
"use strict";


// Classes

// View proof builder class
class ViewProofBuilder extends ProofBuilder {

	// Public
	
		// Initialize
		initialize(extendedPrivateKeyOrRootPublicKey) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if an extended private key is provided
				if(extendedPrivateKeyOrRootPublicKey["length"] !== Crypto.SECP256K1_PUBLIC_KEY_LENGTH) {
				
					// Get extended private key
					var extendedPrivateKey = extendedPrivateKeyOrRootPublicKey;
			
					// Return getting root public key from extended private key
					return Crypto.rootPublicKey(extendedPrivateKey).then(function(publicKey) {
					
						// Check if getting rewind hash from public key was successful
						self.rewindHash = Blake2b.compute(Crypto.NONCE_LENGTH, publicKey, new Uint8Array([]));
						
						if(self.rewindHash !== Blake2b.OPERATION_FAILED) {
						
							// Securely clear public key
							publicKey.fill(0);
						
							// Resolve
							resolve();
						}
						
						// Otherwise
						else {
						
							// Securely clear public key
							publicKey.fill(0);
						
							// Reject error
							reject("Getting Rewind hash failed.");
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
				
				// Otherwise
				else {
				
					// Get root public key
					var rootPublicKey = extendedPrivateKeyOrRootPublicKey;
					
					// Check if getting rewind hash from root public key was successful
					self.rewindHash = Blake2b.compute(Crypto.NONCE_LENGTH, rootPublicKey, new Uint8Array([]));
					
					if(self.rewindHash !== Blake2b.OPERATION_FAILED) {
					
						// Resolve
						resolve();
					}
					
					// Otherwise
					else {
					
						// Reject error
						reject("Getting Rewind hash failed.");
					}
				}
			});
		}
		
		// Uninitialize
		uninitialize() {
		
			// Securely clear rewind hash
			this.rewindHash.fill(0);
		}
	
		// Rewind nonce
		rewindNonce(commit) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if getting nonce from rewind hash and commit was successful
				var nonce = Blake2b.compute(Crypto.NONCE_LENGTH, self.rewindHash, commit);
				
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
		
		// Proof message
		proofMessage(identifier, switchType) {
		
			// Create message
			var message = new Uint8Array(NewProofBuilder.MESSAGE_LENGTH).fill(0);
			
			// Set message's switch type
			message[NewProofBuilder.MESSAGE_SWITCH_TYPE_INDEX] = switchType;
			
			// Set everything after message's switch type to the identifier's value
			message = Common.mergeArrays([
			
				// Message switch type
				message.subarray(0, NewProofBuilder.MESSAGE_SWITCH_TYPE_INDEX + 1),
				
				// Identifier's value
				identifier.getValue().subarray(0, NewProofBuilder.MESSAGE_LENGTH - (NewProofBuilder.MESSAGE_SWITCH_TYPE_INDEX + 1))
			]);
			
			// Return message
			return message;
		}
		
		// Get output
		getOutput(extendedPrivateKeyOrRootPublicKey, amount, commit, message) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if message is valid
				if(message["length"] === NewProofBuilder.MESSAGE_LENGTH && Common.arraysAreEqual(message.subarray(0, NewProofBuilder.MESSAGE_HEADER_START["length"]), NewProofBuilder.MESSAGE_HEADER_START) === true) {
								
					// Get switch type from message
					var switchType = message[NewProofBuilder.MESSAGE_SWITCH_TYPE_INDEX];
					
					// Check if switch type is valid
					if(switchType === Crypto.SWITCH_TYPE_NONE || switchType === Crypto.SWITCH_TYPE_REGULAR) {
					
						// Get depth from message
						var depth = message[NewProofBuilder.MESSAGE_DEPTH_INDEX];
						
						// Try
						try {
						
							// Create identifier from depth and message
							var identifier = new Identifier(depth.toString(Common.HEX_NUMBER_BASE).padStart(Common.HEX_NUMBER_LENGTH, Common.HEX_NUMBER_PADDING) + Common.toHexString(message.subarray(NewProofBuilder.MESSAGE_HEADER_LENGTH)));
						}
						
						// Catch errors
						catch(error) {
						
							// Reject error
							reject("Identifier isn't valid.");
							
							// Return
							return;
						}
						
						// Check if an extended private key is provided
						if(extendedPrivateKeyOrRootPublicKey["length"] !== Crypto.SECP256K1_PUBLIC_KEY_LENGTH) {
						
							// Get extended private key
							var extendedPrivateKey = extendedPrivateKeyOrRootPublicKey;
						
							// Return getting commit from extended private key, amount, identifier, and switch type
							return Crypto.commit(extendedPrivateKey, amount, identifier, switchType).then(function(computedCommit) {
							
								// Check if commit matches the computed commit
								if(Common.arraysAreEqual(commit, computedCommit) === true) {
								
									// Resolve output
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
						
							// Resolve output
							resolve([
							
								// Identifier
								identifier,
								
								// Switch type
								switchType
							]);
						}
					}
					
					// Otherwise
					else {
					
						// Reject error
						reject("Switch type isn't valid.");
					}
				}
				
				// Otherwise
				else {
				
					// Reject error
					reject("Message isn't valid.");
				}
			});
		}
}


// Main function

// Set global object's view proof builder
globalThis["ViewProofBuilder"] = ViewProofBuilder;
