// Use strict
"use strict";


// Classes

// Slate output class
class SlateOutput {

	// Public
	
		// Constructor
		constructor(serializedSlateOutputOrFeatures, slateOrCommit, proof) {
		
			// Reset
			this.reset();
			
			// Check if a binary serialized slate output is provided
			if(serializedSlateOutputOrFeatures instanceof BitReader === true) {
			
				// Get serialized slate output
				var serializedSlateOutput = serializedSlateOutputOrFeatures;
				
				// Get slate
				var slate = slateOrCommit;
			
				// Unserialize the serialized slate output
				this.unserialize(serializedSlateOutput, slate);
			}
		
			// Otherwise check if a serialized slate output is provided
			else if(Object.isObject(serializedSlateOutputOrFeatures) === true) {
			
				// Get serialized slate output
				var serializedSlateOutput = serializedSlateOutputOrFeatures;
				
				// Get slate
				var slate = slateOrCommit;
			
				// Unserialize the serialized slate output
				this.unserialize(serializedSlateOutput, slate);
			}
			
			// Otherwise check if arguments are provided
			else if(typeof serializedSlateOutputOrFeatures === "number") {
			
				// Get features
				var features = serializedSlateOutputOrFeatures;
				
				// Get Commit
				var commit = slateOrCommit;
				
				// Set features to provided features
				this.features = features;
				
				// Set commit to provided commit
				this.commit = commit;
				
				// Set proof to provided proof
				this.proof = proof;
				
				// Check if proof failed to be verified
				if(this.verifyProof() === false) {
				
					// Throw error
					throw "Unsupported output.";
				}
			}
			
			// Otherwise
			else {
			
				// Throw error
				throw "Unsupported output.";
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
		
					// Return serialized slate output
					return {
					
						// Features
						"features": SlateOutput.featuresToText(this.getFeatures()),
						
						// Commit
						"commit": Common.toHexString(this.getCommit()),
						
						// Proof
						"proof": Common.toHexString(this.getProof())
					};
				
				// Version Slatepack
				case Slate.VERSION_SLATEPACK:
				
					// Try
					try {
				
						// Write commit
						bitWriter.setBytes(this.getCommit());
						
						// Check if proof is too long
						if(this.getProof()["length"] >= Math.pow(2, SlateOutput.COMPACT_PROOF_LENGTH_LENGTH)) {
						
							// Throw error
							throw "Proof is too long.";
						}
						
						// Write proof length
						bitWriter.setBits(this.getProof()["length"], SlateOutput.COMPACT_PROOF_LENGTH_LENGTH);
						
						// Write proof
						bitWriter.setBytes(this.getProof());
					}
					
					// Catch errors
					catch(error) {
					
						// Throw error
						throw "Unsupported output.";
					}
				
					// Break
					break;
				
				// Version four
				case Slate.VERSION_FOUR.toFixed():
				
					// Check if serializing slate output as binary
					if(typeof bitWriter !== "undefined") {
					
						// Try
						try {
					
							// Write features
							bitWriter.setBytes([this.getFeatures()]);
							
							// Write commit
							bitWriter.setBytes(this.getCommit());
							
							// Write proof length
							bitWriter.setBytes((new BigNumber(this.getProof()["length"])).toBytes(BigNumber.BIG_ENDIAN, Common.BYTES_IN_A_UINT64));
							
							// Write proof
							bitWriter.setBytes(this.getProof());
						}
						
						// Catch errors
						catch(error) {
						
							// Throw error
							throw "Unsupported output.";
						}
					}
					
					// Otherwise
					else {
				
						// Create serialized slate output
						var serializedSlateOutput = {
						
							// Commit
							"c": Common.toHexString(this.getCommit()),
							
							// Proof
							"p": Common.toHexString(this.getProof())
						};
						
						// Check if not plain
						if(this.isPlain() === false) {
						
							// Set serialized slate output's features
							serializedSlateOutput["f"] = this.getFeatures();
						}
						
						// Return serialized slate output
						return serializedSlateOutput;
					}
					
					// Break
					break;
				
				// Default
				default:
				
					// Throw error
					throw "Unsupported slate version.";
			}
		}
		
		// Get transaction
		getTransaction() {
		
			// Return transaction
			return {
			
				// Features
				"features": SlateOutput.featuresToText(this.getFeatures()),
				
				// Commit
				"commit": Common.toHexString(this.getCommit()),
				
				// Proof
				"proof": Common.toHexString(this.getProof())
			};
		}
		
		// Get features
		getFeatures() {
		
			// Return features
			return this.features;
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
		
		// Is plain
		isPlain() {
		
			// Return if features is plain
			return this.getFeatures() === SlateOutput.PLAIN_FEATURES;
		}
		
		// Is coinbase
		isCoinbase() {
		
			// Return if features is coinbase
			return this.getFeatures() === SlateOutput.COINBASE_FEATURES;
		}
		
		// Get hash
		getHash() {
		
			// Return hash
			return new Hash([
			
				// Features
				new Uint8Array([this.getFeatures()]),
				
				// Commit
				this.getCommit()
			]);
		}
		
		// Is equal to
		isEqualTo(slateOutput) {
		
			// Check if features aren't equal
			if(this.getFeatures() !== slateOutput.getFeatures())
			
				// Return false
				return false;
			
			// Check if commits aren't equal
			if(Common.arraysAreEqual(this.getCommit(), slateOutput.getCommit()) === false)
			
				// Return false
				return false;
			
			// Check if proofs aren't equal
			if(Common.arraysAreEqual(this.getProof(), slateOutput.getProof()) === false)
			
				// Return false
				return false;
			
			// Return true
			return true;
		}
	
	// Private
	
		// Reset
		reset() {
		
			// Set features to plain features
			this.features = SlateOutput.PLAIN_FEATURES;
		}
		
		// Unserialize
		unserialize(serializedSlateOutput, slate) {
		
			// Check slate's version
			switch((slate.getVersion() instanceof BigNumber === true) ? slate.getVersion().toFixed() : slate.getVersion()) {
			
				// Version two and three
				case Slate.VERSION_TWO.toFixed():
				case Slate.VERSION_THREE.toFixed():
		
					// Check if serialized slate output's features isn't supported
					if("features" in serializedSlateOutput === false || SlateOutput.textToFeatures(serializedSlateOutput["features"]) === SlateOutput.UNSUPPORTED_FEATURES || SlateOutput.textToFeatures(serializedSlateOutput["features"]) === SlateOutput.COINBASE_FEATURES) {
					
						// Throw error
						throw "Unsupported output.";
					}
					
					// Set features to serialized slate output's features
					this.features = SlateOutput.textToFeatures(serializedSlateOutput["features"]);
				
					// Check if serialized slate output's commit isn't supported
					if("commit" in serializedSlateOutput === false || Common.isHexString(serializedSlateOutput["commit"]) === false || Common.hexStringLength(serializedSlateOutput["commit"]) !== Crypto.COMMIT_LENGTH || Secp256k1Zkp.isValidCommit(Common.fromHexString(serializedSlateOutput["commit"])) !== true) {
					
						// Throw error
						throw "Unsupported output.";
					}
					
					// Set commit to serialized slate output's commit
					this.commit = Common.fromHexString(serializedSlateOutput["commit"]);
					
					// Check if serialized slate output's proof isn't supported
					if("proof" in serializedSlateOutput === false || Common.isHexString(serializedSlateOutput["proof"]) === false || Common.hexStringLength(serializedSlateOutput["proof"]) !== Crypto.PROOF_LENGTH) {
					
						// Throw error
						throw "Unsupported output.";
					}
					
					// Set proof to serialized slate output's proof
					this.proof = Common.fromHexString(serializedSlateOutput["proof"]);
					
					// Break
					break;
				
				// Version Slatepack
				case Slate.VERSION_SLATEPACK:
				
					// Get bit reader
					var bitReader = serializedSlateOutput;
					
					// Try
					try {
					
						// Set commit to serialized slate output's commit
						this.commit = bitReader.getBytes(Crypto.COMMIT_LENGTH);
						
						// Check if commit is invalid
						if(Secp256k1Zkp.isValidCommit(this.getCommit()) !== true) {
						
							// Throw error
							throw "Unsupported output.";
						}
						
						// Get serialized slate output's proof length
						var proofLength = bitReader.getBits(SlateOutput.COMPACT_PROOF_LENGTH_LENGTH);
						
						// Check if serialized slate output's proof length isn't supported
						if(proofLength !== Crypto.PROOF_LENGTH) {
						
							// Throw error
							throw "Unsupported output.";
						}
						
						// Set proof to serialized slate output's proof
						this.proof = bitReader.getBytes(proofLength);
					}
					
					// Catch errors
					catch(error) {
					
						// Throw error
						throw "Unsupported output.";
					}
					
					// Break
					break;
				
				// Version four
				case Slate.VERSION_FOUR.toFixed():
				
					// Check if serialized slate output is binary
					if(serializedSlateOutput instanceof BitReader === true) {
					
						// Get bit reader
						var bitReader = serializedSlateOutput;
						
						// Try
						try {
						
							// Set features to serialized slate output's features
							this.features = bitReader.getBytes(1)[0];
							
							// Check if serialized slate output's features isn't supported
							if(this.getFeatures() !== SlateOutput.PLAIN_FEATURES) {
							
								// Throw error
								throw "Unsupported output.";
							}
							
							// Set commit to serialized slate output's commit
							this.commit = bitReader.getBytes(Crypto.COMMIT_LENGTH);
							
							// Check if serialized slate output's commit isn't supported
							if(Secp256k1Zkp.isValidCommit(this.getCommit()) !== true) {
							
								// Throw error
								throw "Unsupported output.";
							}
							
							// Get serialized slate output's proof length
							var proofLength = new BigNumber(Common.HEX_PREFIX + Common.toHexString(bitReader.getBytes(Common.BYTES_IN_A_UINT64)));
							
							// Check if serialized slate output's proof length is invalid
							if(proofLength.isEqualTo(Crypto.PROOF_LENGTH) === false) {
							
								// Throw error
								throw "Unsupported output.";
							}
							
							// Set proof to serialized slate output's proof
							this.proof = bitReader.getBytes(proofLength.toNumber());
						}
						
						// Catch errors
						catch(error) {
						
							// Throw error
							throw "Unsupported output.";
						}
					}
					
					// Otherwise
					else {
				
						// Check if serialized slate output's features isn't supported
						if("f" in serializedSlateOutput === true && ((Common.isNumberString(serializedSlateOutput["f"]) === false && serializedSlateOutput["f"] instanceof BigNumber === false) || (new BigNumber(serializedSlateOutput["f"])).isEqualTo(SlateOutput.PLAIN_FEATURES) === false)) {
						
							// Throw error
							throw "Unsupported output.";
						}
						
						// Set features to serialized slate output's features
						this.features = ("f" in serializedSlateOutput === true) ? (new BigNumber(serializedSlateOutput["f"])).toNumber() : SlateOutput.PLAIN_FEATURES;
					
						// Check if serialized slate output's commit isn't supported
						if("c" in serializedSlateOutput === false || Common.isHexString(serializedSlateOutput["c"]) === false || Common.hexStringLength(serializedSlateOutput["c"]) !== Crypto.COMMIT_LENGTH || Secp256k1Zkp.isValidCommit(Common.fromHexString(serializedSlateOutput["c"])) !== true) {
						
							// Throw error
							throw "Unsupported output.";
						}
						
						// Set commit to serialized slate output's commit
						this.commit = Common.fromHexString(serializedSlateOutput["c"]);
						
						// Check if serialized slate output's proof isn't supported
						if("p" in serializedSlateOutput === false || Common.isHexString(serializedSlateOutput["p"]) === false || Common.hexStringLength(serializedSlateOutput["p"]) !== Crypto.PROOF_LENGTH) {
						
							// Throw error
							throw "Unsupported output.";
						}
						
						// Set proof to serialized slate output's proof
						this.proof = Common.fromHexString(serializedSlateOutput["p"]);
					}
					
					// Break
					break;
				
				// Default
				default:
				
					// Throw error
					throw "Unsupported output.";
			}
			
			// Check if proof failed to be verified
			if(this.verifyProof() === false) {
			
				// Throw error
				throw "Unsupported output.";
			}
		}
		
		// Verify proof
		verifyProof() {
		
			// Check if proof verifies the commit
			return Secp256k1Zkp.verifyBulletproof(this.getProof(), this.getCommit(), new Uint8Array([])) === true;
		}
		
		// Features to text
		static featuresToText(features) {
		
			// Check features
			switch(features) {
			
				// Plain features
				case SlateOutput.PLAIN_FEATURES:
				
					// Return plain text
					return "Plain";
				
				// Coinbase features
				case SlateOutput.COINBASE_FEATURES:
				
					// Return coinbase text
					return "Coinbase";
				
				// Default
				default:
				
					// Return unsupported features
					return SlateOutput.UNSUPPORTED_FEATURES;
			}
		}
		
		// Text to feature
		static textToFeatures(text) {
		
			// Check text
			switch(text) {
			
				// Plain text
				case "Plain":
				
					// Return plain features
					return SlateOutput.PLAIN_FEATURES;
				
				// Coinbase text
				case "Coinbase":
				
					// Return coinbase features
					return SlateOutput.COINBASE_FEATURES;
				
				// Default
				default:
				
					// Return unsupported features
					return SlateOutput.UNSUPPORTED_FEATURES;
			}
		}
		
		// Plain features
		static get PLAIN_FEATURES() {
		
			// Return plain features
			return 0;
		}
		
		// Coinbase features
		static get COINBASE_FEATURES() {
		
			// Return coinbase features
			return SlateOutput.PLAIN_FEATURES + 1;
		}
		
		// Unsupported features
		static get UNSUPPORTED_FEATURES() {
		
			// Return unsupported features
			return SlateOutput.COINBASE_FEATURES + 1;
		}
		
		// Compact proof length length
		static get COMPACT_PROOF_LENGTH_LENGTH() {
		
			// Return compact proof length length
			return 10;
		}
}


// Main function

// Set global object's slate output
globalThis["SlateOutput"] = SlateOutput;
