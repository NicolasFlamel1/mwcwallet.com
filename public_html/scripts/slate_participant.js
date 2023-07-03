// Use strict
"use strict";


// Classes

// Slate participant class
class SlateParticipant {

	// Public
	
		// Constructor
		constructor(serializedSlateParticipantOrId, slateOrPublicBlindExcess, publicNonce, partialSignature, message, messageSignature) {
		
			// Reset
			this.reset();
			
			// Check if a binary serialized slate participant is provided
			if(serializedSlateParticipantOrId instanceof BitReader === true) {
			
				// Get serialized slate participant
				var serializedSlateParticipant = serializedSlateParticipantOrId;
				
				// Get slate
				var slate = slateOrPublicBlindExcess;
			
				// Unserialize the serialized slate participant
				this.unserialize(serializedSlateParticipant, slate);
			}
			
			// Otherwise check if a serialized slate participant is provided
			else if(Object.isObject(serializedSlateParticipantOrId) === true) {
			
				// Get serialized slate participant
				var serializedSlateParticipant = serializedSlateParticipantOrId;
				
				// Get slate
				var slate = slateOrPublicBlindExcess;
			
				// Unserialize the serialized slate participant
				this.unserialize(serializedSlateParticipant, slate);
			}
			
			// Otherwise check if arguments are provided
			else if(serializedSlateParticipantOrId instanceof BigNumber === true) {
			
				// Get ID
				var id = serializedSlateParticipantOrId;
				
				// Get public blind excess
				var publicBlindExcess = slateOrPublicBlindExcess;
				
				// Set ID to provided ID
				this.id = id;
				
				// Set public blind excess to provided public blind excess
				this.publicBlindExcess = publicBlindExcess;
				
				// Set public nonce to provided public nonce
				this.publicNonce = publicNonce;
				
				// Set partial signature to provided partial signature
				this.partialSignature = partialSignature;
				
				// Set message to provided message
				this.message = message;
				
				// Set message signature to provided message signature
				this.messageSignature = messageSignature;
				
				// Check if a message signature exists
				if(this.getMessageSignature() !== SlateParticipant.NO_MESSAGE_SIGNATURE) {
				
					// Check if message signature failed to be verified
					if(this.verifyMessageSignature() === false) {
					
						// Throw error
						throw "Unsupported participant.";
					}
				}
			}
			
			// Otherwise
			else {
			
				// Throw error
				throw "Unsupported participant.";
			}
		}
		
		// Serialize
		serialize(slateOrVersion, bitWriter) {
		
			// Get slate version
			var slateVersion = (slateOrVersion instanceof Slate === true) ? slateOrVersion.getVersion() : slateOrVersion;
		
			// Check slate's version
			switch((slateVersion instanceof BigNumber === true) ? slateVersion.toFixed() : slateVersion) {
			
				// Version two and three
				case Slate.VERSION_TWO.toFixed():
				case Slate.VERSION_THREE.toFixed():
		
					// Return serialized slate participant
					return {
					
						// Id
						"id": this.getId().toFixed(),
					
						// Public blind excess
						"public_blind_excess": Common.toHexString(this.getPublicBlindExcess()),
						
						// Public nonce
						"public_nonce": Common.toHexString(this.getPublicNonce()),
						
						// Message
						"message": (this.getMessage() !== SlateParticipant.NO_MESSAGE) ? this.getMessage() : null,
						
						// Partial signature
						"part_sig": (this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE) ? Common.toHexString(this.getPartialSignature()) : null,
						
						// Message signature
						"message_sig": (this.getMessageSignature() !== SlateParticipant.NO_MESSAGE_SIGNATURE) ? Common.toHexString(this.getMessageSignature()) : null
					};
				
				// Version Slatepack
				case Slate.VERSION_SLATEPACK:
				
					// Try
					try {
				
						// Write public blind excess
						Slate.compactPublicKey(this.getPublicBlindExcess(), bitWriter);
						
						// Write public nonce
						Slate.compactPublicKey(this.getPublicNonce(), bitWriter);
						
						// Check if partial signature exists
						if(this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE) {
						
							// Write partial signature exists
							bitWriter.setBits(Slate.COMPACT_BOOLEAN_TRUE, Slate.COMPACT_BOOLEAN_LENGTH);
							
							// Write partial signature
							bitWriter.setBytes(this.getPartialSignature());
						}
						
						// Otherwise
						else {
						
							// Write partial signature doesn't exist
							bitWriter.setBits(Slate.COMPACT_BOOLEAN_FALSE, Slate.COMPACT_BOOLEAN_LENGTH);
						}
						
						// Check if message and message signature exists
						if(this.getMessage() !== SlateParticipant.NO_MESSAGE && this.getMessageSignature() !== SlateParticipant.NO_MESSAGE_SIGNATURE) {
						
							// Write message exists
							bitWriter.setBits(Slate.COMPACT_BOOLEAN_TRUE, Slate.COMPACT_BOOLEAN_LENGTH);
							
							// Compress message
							var compressedMessage = Smaz.compress((new TextEncoder()).encode(this.getMessage()));
							
							// Check if compressing message failed
							if(compressedMessage === Smaz.OPERATION_FAILED) {
							
								// Throw error
								throw "Compressing message failed.";
							}
							
							// Check if compressed message is too long
							if(compressedMessage["length"] >= Math.pow(2, SlateParticipant.COMPACT_COMPRESSED_MESSAGE_LENGTH_LENGTH)) {
							
								// Throw error
								throw "Compressed message is too long.";
							}
							
							// Write compressed message length
							bitWriter.setBits(compressedMessage["length"], SlateParticipant.COMPACT_COMPRESSED_MESSAGE_LENGTH_LENGTH);
							
							// Write compressed message
							bitWriter.setBytes(compressedMessage);
							
							// Write message signature
							bitWriter.setBytes(this.getMessageSignature());
						}
						
						// Otherwise
						else {
						
							// Write message doesn't exist
							bitWriter.setBits(Slate.COMPACT_BOOLEAN_FALSE, Slate.COMPACT_BOOLEAN_LENGTH);
						}
					}
					
					// Catch errors
					catch(error) {
					
						// Throw error
						throw "Unsupported participant.";
					}
				
					// Break
					break;
				
				// Version four
				case Slate.VERSION_FOUR.toFixed():
				
					// Check if serializing slate output as binary
					if(typeof bitWriter !== "undefined") {
					
						// Try
						try {
					
							// Write has partial signature
							bitWriter.setBytes([(this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE) ? 1 : 0]);
							
							// Write public blind excess
							bitWriter.setBytes(this.getPublicBlindExcess());
							
							// Write public nonce
							bitWriter.setBytes(this.getPublicNonce());
							
							// Check if partial signature exists
							if(this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE) {
							
								// Check if uncompacting partial signature failed
								var partialSignature = Secp256k1Zkp.uncompactSingleSignerSignature(this.getPartialSignature());
								if(partialSignature === Secp256k1Zkp.OPERATION_FAILED) {
								
									// Throw error
									throw "Unsupported participant.";
								}
								
								// Write partial signature
								bitWriter.setBytes(partialSignature);
							}
						}
						
						// Catch errors
						catch(error) {
						
							// Throw error
							throw "Unsupported participant.";
						}
					}
					
					// Otherwise
					else {
					
						// Create serialized slate participant
						var serializedSlateParticipant = {
						
							// Public blind excess
							"xs": Common.toHexString(this.getPublicBlindExcess()),
							
							// Public nonce
							"nonce": Common.toHexString(this.getPublicNonce())
						};
						
						// Check if partial signature exists
						if(this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE) {
						
							// Set serialized slate participant's partial signature
							serializedSlateParticipant["part"] = Common.toHexString(this.getPartialSignature());
						}
						
						// Return serialized slate participant
						return serializedSlateParticipant;
					}
					
					// Break
					break;
				
				// Default
				default:
				
					// Throw error
					throw "Unsupported slate version.";
			}
		}
		
		// Get ID
		getId() {
		
			// Return ID
			return this.id;
		}
		
		// Get public blind excess
		getPublicBlindExcess() {
		
			// Return public blind excess
			return this.publicBlindExcess;
		}
		
		// Get public nonce
		getPublicNonce() {
		
			// Return public nonce
			return this.publicNonce;
		}
		
		// Get message
		getMessage() {
		
			// Return message
			return this.message;
		}
		
		// Get partial signature
		getPartialSignature() {
		
			// Return partial signature
			return this.partialSignature;
		}
		
		// Set partial signature
		setPartialSignature(partialSignature) {
		
			// Set partial signature
			this.partialSignature = partialSignature;
		}
		
		// Get message signature
		getMessageSignature() {
		
			// Return message signature
			return this.messageSignature;
		}
		
		// Is sender
		isSender() {
		
			// Return if ID is the sender ID
			return this.getId().isEqualTo(SlateParticipant.SENDER_ID) === true;
		}
		
		// Is complete
		isComplete() {
		
			// Return if a partial signature exists
			return this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE;
		}
		
		// Is equal to
		isEqualTo(slateParticipant) {
		
			// Check if IDs aren't equal
			if(this.getId().isEqualTo(slateParticipant.getId()) === false)
			
				// Return false
				return false;
			
			// Check if public blind excesses aren't equal
			if(Common.arraysAreEqual(this.getPublicBlindExcess(), slateParticipant.getPublicBlindExcess()) === false)
			
				// Return false
				return false;
			
			// Check if public blind nonces aren't equal
			if(Common.arraysAreEqual(this.getPublicNonce(), slateParticipant.getPublicNonce()) === false)
			
				// Return false
				return false;
			
			// Check if messages aren't equal
			if(this.getMessage() !== slateParticipant.getMessage())
			
				// Return false
				return false;
			
			// Check if partial signatures aren't equal
			if((this.getPartialSignature() === SlateParticipant.NO_PARTIAL_SIGNATURE && slateParticipant.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE) || (this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE && slateParticipant.getPartialSignature() === SlateParticipant.NO_PARTIAL_SIGNATURE) || (this.getPartialSignature() !== SlateParticipant.NO_PARTIAL_SIGNATURE && Common.arraysAreEqual(this.getPartialSignature(), slateParticipant.getPartialSignature()) === false))
			
				// Return false
				return false;
			
			// Check if message signatures aren't equal
			if((this.getMessageSignature() === SlateParticipant.NO_MESSAGE_SIGNATURE && slateParticipant.getMessageSignature() !== SlateParticipant.NO_MESSAGE_SIGNATURE) || (this.getMessageSignature() !== SlateParticipant.NO_MESSAGE_SIGNATURE && slateParticipant.getMessageSignature() === SlateParticipant.NO_MESSAGE_SIGNATURE) || (this.getMessageSignature() !== SlateParticipant.NO_MESSAGE_SIGNATURE && Common.arraysAreEqual(this.getMessageSignature(), slateParticipant.getMessageSignature()) === false))
			
				// Return false
				return false;
			
			// Return true
			return true;
		}
		
		// Sender ID
		static get SENDER_ID() {
		
			// Return sender ID
			return new BigNumber(0);
		}
		
		// No message
		static get NO_MESSAGE() {
		
			// Return no message
			return null;
		}
		
		// No message signature
		static get NO_MESSAGE_SIGNATURE() {
		
			// Return no message signature
			return null;
		}
	
	// Private
	
		// Reset
		reset() {
		
			// Set ID to sender
			this.id = SlateParticipant.SENDER_ID;
			
			// Set message to no message
			this.message = SlateParticipant.NO_MESSAGE;
			
			// Set partial signature to no partial signature
			this.partialSignature = SlateParticipant.NO_PARTIAL_SIGNATURE;
			
			// Set message signature to no message signature
			this.messageSignature = SlateParticipant.NO_MESSAGE_SIGNATURE;
		}
		
		// Unserialize
		unserialize(serializedSlateParticipant, slate) {
		
			// Check slate's version
			switch((slate.getVersion() instanceof BigNumber === true) ? slate.getVersion().toFixed() : slate.getVersion()) {
			
				// Version two and three
				case Slate.VERSION_TWO.toFixed():
				case Slate.VERSION_THREE.toFixed():
				
					// Check if serialized slate participant's ID isn't supported
					if("id" in serializedSlateParticipant === false || (Common.isNumberString(serializedSlateParticipant["id"]) === false && serializedSlateParticipant["id"] instanceof BigNumber === false) || (new BigNumber(serializedSlateParticipant["id"])).isInteger() === false || (new BigNumber(serializedSlateParticipant["id"])).isLessThan(SlateParticipant.SENDER_ID) === true) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Set ID to serialized slate participant's ID
					this.id = new BigNumber(serializedSlateParticipant["id"]);
					
					// Check if serialized slate participant's public blind excess isn't supported
					if("public_blind_excess" in serializedSlateParticipant === false || Common.isHexString(serializedSlateParticipant["public_blind_excess"]) === false || Secp256k1Zkp.isValidPublicKey(Common.fromHexString(serializedSlateParticipant["public_blind_excess"])) !== true) {
					
						// Throw error
						throw "Unsupported participant.";
					}
				
					// Set public blind excess to serialized slate participant's public blind excess
					this.publicBlindExcess = Secp256k1Zkp.publicKeyFromData(Common.fromHexString(serializedSlateParticipant["public_blind_excess"]));
					
					// Check if public blind excess isn't a valid public key
					if(this.getPublicBlindExcess() === Secp256k1Zkp.OPERATION_FAILED) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Check if serialized slate participant's public nonce isn't supported
					if("public_nonce" in serializedSlateParticipant === false || Common.isHexString(serializedSlateParticipant["public_nonce"]) === false || Secp256k1Zkp.isValidPublicKey(Common.fromHexString(serializedSlateParticipant["public_nonce"])) !== true) {
					
						// Throw error
						throw "Unsupported participant.";
					}
				
					// Set public nonce to serialized slate participant's public nonce
					this.publicNonce = Secp256k1Zkp.publicKeyFromData(Common.fromHexString(serializedSlateParticipant["public_nonce"]));
					
					// Check if public nonce isn't a valid public key
					if(this.getPublicNonce() === Secp256k1Zkp.OPERATION_FAILED) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Check if serialized slate participant's message isn't supported
					if("message" in serializedSlateParticipant === false || (serializedSlateParticipant["message"] !== null && typeof serializedSlateParticipant["message"] !== "string")) {
					
						// Throw error
						throw "Unsupported participant.";
					}
				
					// Set message to serialized slate participant's message
					this.message = (serializedSlateParticipant["message"] !== null) ? serializedSlateParticipant["message"] : SlateParticipant.NO_MESSAGE;
					
					// Check if serialized slate participant's partial signature isn't supported
					if("part_sig" in serializedSlateParticipant === false || (serializedSlateParticipant["part_sig"] !== null && (Common.isHexString(serializedSlateParticipant["part_sig"]) === false || Secp256k1Zkp.isValidSingleSignerSignature(Common.fromHexString(serializedSlateParticipant["part_sig"])) !== true))) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Set partial signature to serialized slate participant's partial signature
					this.partialSignature = (serializedSlateParticipant["part_sig"] !== null) ? Secp256k1Zkp.singleSignerSignatureFromData(Common.fromHexString(serializedSlateParticipant["part_sig"])) : SlateParticipant.NO_PARTIAL_SIGNATURE;
					
					// Check if partial signature isn't a valid signature
					if(serializedSlateParticipant["part_sig"] !== null && this.getPartialSignature() === Secp256k1Zkp.OPERATION_FAILED) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Check if serialized slate participant's message signature isn't supported
					if("message_sig" in serializedSlateParticipant === false || (serializedSlateParticipant["message_sig"] === null && this.getMessage() !== SlateParticipant.NO_MESSAGE) || (serializedSlateParticipant["message_sig"] !== null && (Common.isHexString(serializedSlateParticipant["message_sig"]) === false || Secp256k1Zkp.isValidSingleSignerSignature(Common.fromHexString(serializedSlateParticipant["message_sig"])) !== true || this.getMessage() === SlateParticipant.NO_MESSAGE))) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Set message signature to serialized slate participant's partial signature
					this.messageSignature = (serializedSlateParticipant["message_sig"] !== null) ? Secp256k1Zkp.singleSignerSignatureFromData(Common.fromHexString(serializedSlateParticipant["message_sig"])) : SlateParticipant.NO_MESSAGE_SIGNATURE;
					
					// Check if message signature isn't a valid signature
					if(serializedSlateParticipant["message_sig"] !== null && this.getMessageSignature() === Secp256k1Zkp.OPERATION_FAILED) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Break
					break;
				
				// Version Slatepack
				case Slate.VERSION_SLATEPACK:
				
					// Get bit reader
					var bitReader = serializedSlateParticipant;
					
					// Try
					try {
					
						// Set ID to serialized slate participant's ID
						this.id = new BigNumber(slate.getParticipants()["length"]);
						
						// Check if serialized slate participant's ID isn't supported
						if(this.getId().isLessThan(SlateParticipant.SENDER_ID) === true) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Check if serialized slate participant's public blind excess is invalid
						var publicBlindExcess = Slate.uncompactPublicKey(bitReader);
						if(Secp256k1Zkp.isValidPublicKey(publicBlindExcess) !== true) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Set public blind excess to serialized slate participant's public blind excess
						this.publicBlindExcess = Secp256k1Zkp.publicKeyFromData(publicBlindExcess);
						
						// Check if public blind excess isn't a valid public key
						if(this.getPublicBlindExcess() === Secp256k1Zkp.OPERATION_FAILED) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Check if serialized slate participant's public nonce is invalid
						var publicNonce = Slate.uncompactPublicKey(bitReader);
						if(Secp256k1Zkp.isValidPublicKey(publicNonce) !== true) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Set public nonce to serialized slate participant's public nonce
						this.publicNonce = Secp256k1Zkp.publicKeyFromData(publicNonce);
						
						// Check if public nonce isn't a valid public key
						if(this.getPublicNonce() === Secp256k1Zkp.OPERATION_FAILED) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Check if serialized slate participant contains partial signature
						if(bitReader.getBits(Slate.COMPACT_BOOLEAN_LENGTH) === Slate.COMPACT_BOOLEAN_TRUE) {
						
							// Check if serialized slate participant's partial signature is invalid
							var partialSignature = bitReader.getBytes(Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH);
							if(Secp256k1Zkp.isValidSingleSignerSignature(partialSignature) !== true) {
							
								// Throw error
								throw "Unsupported participant.";
							}
						
							// Set partial signature to serialized slate participant's partial signature
							this.partialSignature = Secp256k1Zkp.singleSignerSignatureFromData(partialSignature);
							
							// Check if partial signature isn't a valid signature
							if(this.getPartialSignature() === Secp256k1Zkp.OPERATION_FAILED) {
							
								// Throw error
								throw "Unsupported participant.";
							}
						}
						
						// Otherwise
						else {
						
							// Set partial signature to serialized slate participant's partial signature
							this.partialSignature = SlateParticipant.NO_PARTIAL_SIGNATURE;
						}
						
						// Check if serialized slate participant contains message and message signature
						if(bitReader.getBits(Slate.COMPACT_BOOLEAN_LENGTH) === Slate.COMPACT_BOOLEAN_TRUE) {
						
							// Get compressed message length
							var compressedMessageLength = bitReader.getBits(SlateParticipant.COMPACT_COMPRESSED_MESSAGE_LENGTH_LENGTH);
							
							// Set message to serialized slate participant's message
							this.message = Smaz.decompress(bitReader.getBytes(compressedMessageLength));
							
							// Check if message isn't a valid message
							if(this.getMessage() === Smaz.OPERATION_FAILED) {
							
								// Throw error
								throw "Unsupported participant.";
							}
							
							// Decode message
							this.message = (new TextDecoder("utf-8", {"fatal": true})).decode(this.getMessage());
							
							// Check if serialized slate participant's message signature is invalid
							var messageSignature = bitReader.getBytes(Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH);
							if(Secp256k1Zkp.isValidSingleSignerSignature(messageSignature) !== true) {
							
								// Throw error
								throw "Unsupported participant.";
							}
							
							// Set message signature to serialized slate participant's message signature
							this.messageSignature = Secp256k1Zkp.singleSignerSignatureFromData(messageSignature);
							
							// Check if message signature isn't a valid signature
							if(this.getMessageSignature() === Secp256k1Zkp.OPERATION_FAILED) {
							
								// Throw error
								throw "Unsupported participant.";
							}
						}
						
						// Otherwise
						else {
						
							// Set message to serialized slate participant's message
							this.message = SlateParticipant.NO_MESSAGE;
						
							// Set message to serialized slate participant's message signature
							this.messageSignature = SlateParticipant.NO_MESSAGE_SIGNATURE;
						}
					}
					
					// Catch errors
					catch(error) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Break
					break;
				
				// Version four
				case Slate.VERSION_FOUR.toFixed():
				
					// Set ID to serialized slate participant's ID
					this.id = new BigNumber(slate.getParticipants()["length"]);
					
					// Check if serialized slate participant's ID isn't supported
					if(this.getId().isLessThan(SlateParticipant.SENDER_ID) === true) {
					
						// Throw error
						throw "Unsupported participant.";
					}
					
					// Check if serialized slate participant is binary
					if(serializedSlateParticipant instanceof BitReader === true) {
					
						// Get bit reader
						var bitReader = serializedSlateParticipant;
						
						// Try
						try {
						
							// Get if serialized slate participant has a partial signature
							var hasPartialSignature = bitReader.getBytes(1)[0] !== 0;
							
							// Check if serialized slate participant's public blind excess isn't supported
							var publicBlindExcess = bitReader.getBytes(Crypto.SECP256K1_PUBLIC_KEY_LENGTH);
							if(Secp256k1Zkp.isValidPublicKey(publicBlindExcess) !== true) {
							
								// Throw error
								throw "Unsupported participant.";
							}
							
							// Set public blind excess to serialized slate participant's public blind excess
							this.publicBlindExcess = Secp256k1Zkp.publicKeyFromData(publicBlindExcess);
							
							// Check if public blind excess isn't a valid public key
							if(this.getPublicBlindExcess() === Secp256k1Zkp.OPERATION_FAILED) {
							
								// Throw error
								throw "Unsupported participant.";
							}
							
							// Check if serialized slate participant's public nonce isn't supported
							var publicNonce = bitReader.getBytes(Crypto.SECP256K1_PUBLIC_KEY_LENGTH);
							if(Secp256k1Zkp.isValidPublicKey(publicNonce) !== true) {
							
								// Throw error
								throw "Unsupported participant.";
							}
							
							// Set public nonce to serialized slate participant's public nonce
							this.publicNonce = Secp256k1Zkp.publicKeyFromData(publicNonce);
							
							// Check if public nonce isn't a valid public key
							if(this.getPublicNonce() === Secp256k1Zkp.OPERATION_FAILED) {
							
								// Throw error
								throw "Unsupported participant.";
							}
							
							// Check if serialized slate participant has a partial signature
							if(hasPartialSignature === true) {
							
								// Set partial signature to serialize slate participant's partial signature
								this.partialSignature = Secp256k1Zkp.compactSingleSignerSignature(bitReader.getBytes(Crypto.SINGLE_SIGNER_SIGNATURE_LENGTH));
								
								// Check if partial signature isn't a valid single-signer signature
								if(this.getPartialSignature() === Secp256k1Zkp.OPERATION_FAILED || Secp256k1Zkp.isValidSingleSignerSignature(this.getPartialSignature()) !== true) {
								
									// Throw error
									throw "Unsupported participant.";
								}
							}
						}
						
						// Catch errors
						catch(error) {
						
							// Throw error
							throw "Unsupported participant.";
						}
					}
					
					// Otherwise
					else {
						
						// Check if serialized slate participant's public blind excess isn't supported
						if("xs" in serializedSlateParticipant === false || Common.isHexString(serializedSlateParticipant["xs"]) === false || Secp256k1Zkp.isValidPublicKey(Common.fromHexString(serializedSlateParticipant["xs"])) !== true) {
						
							// Throw error
							throw "Unsupported participant.";
						}
					
						// Set public blind excess to serialized slate participant's public blind excess
						this.publicBlindExcess = Secp256k1Zkp.publicKeyFromData(Common.fromHexString(serializedSlateParticipant["xs"]));
						
						// Check if public blind excess isn't a valid public key
						if(this.getPublicBlindExcess() === Secp256k1Zkp.OPERATION_FAILED) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Check if serialized slate participant's public nonce isn't supported
						if("nonce" in serializedSlateParticipant === false || Common.isHexString(serializedSlateParticipant["nonce"]) === false || Secp256k1Zkp.isValidPublicKey(Common.fromHexString(serializedSlateParticipant["nonce"])) !== true) {
						
							// Throw error
							throw "Unsupported participant.";
						}
					
						// Set public nonce to serialized slate participant's public nonce
						this.publicNonce = Secp256k1Zkp.publicKeyFromData(Common.fromHexString(serializedSlateParticipant["nonce"]));
						
						// Check if public nonce isn't a valid public key
						if(this.getPublicNonce() === Secp256k1Zkp.OPERATION_FAILED) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Check if serialized slate participant's partial signature isn't supported
						if("part" in serializedSlateParticipant === true && serializedSlateParticipant["part"] !== null && (Common.isHexString(serializedSlateParticipant["part"]) === false || Secp256k1Zkp.isValidSingleSignerSignature(Common.fromHexString(serializedSlateParticipant["part"])) !== true)) {
						
							// Throw error
							throw "Unsupported participant.";
						}
						
						// Set partial signature to serialized slate participant's partial signature
						this.partialSignature = ("part" in serializedSlateParticipant === true && serializedSlateParticipant["part"] !== null) ? Secp256k1Zkp.singleSignerSignatureFromData(Common.fromHexString(serializedSlateParticipant["part"])) : SlateParticipant.NO_PARTIAL_SIGNATURE;
						
						// Check if partial signature isn't a valid signature
						if("part" in serializedSlateParticipant === true && serializedSlateParticipant["part"] !== null && this.getPartialSignature() === Secp256k1Zkp.OPERATION_FAILED) {
						
							// Throw error
							throw "Unsupported participant.";
						}
					}
				
					// Break
					break;
				
				// Default
				default:
				
					// Throw error
					throw "Unsupported participant.";
			}
			
			// Check if a message signature exists
			if(this.getMessageSignature() !== SlateParticipant.NO_MESSAGE_SIGNATURE) {
			
				// Check if message signature failed to be verified
				if(this.verifyMessageSignature() === false) {
				
					// Throw error
					throw "Unsupported participant.";
				}
			}
		}
		
		// Verify message signature
		verifyMessageSignature() {
		
			// Get message's hash
			var messageHash = Blake2b.compute(Crypto.SINGLE_SIGNER_MESSAGE_LENGTH, (new TextEncoder()).encode(this.getMessage()), new Uint8Array([]));
			
			// Check if getting message's hash failed
			if(messageHash === Blake2b.OPERATION_FAILED) {
			
				// Return false
				return false;
			}
			
			// Return if message signature verifies the message
			return Secp256k1Zkp.verifySingleSignerSignature(this.getMessageSignature(), messageHash, Secp256k1Zkp.NO_PUBLIC_NONCE, this.getPublicBlindExcess(), this.getPublicBlindExcess(), false) === true;
		}
		
		// No partial signature
		static get NO_PARTIAL_SIGNATURE() {
		
			// Return no partial signature
			return null;
		}
		
		// Compact compressed message length length
		static get COMPACT_COMPRESSED_MESSAGE_LENGTH_LENGTH() {
		
			// Return compact compressed message length length
			return 16;
		}
}


// Main function

// Set global object's slate participant
globalThis["SlateParticipant"] = SlateParticipant;
