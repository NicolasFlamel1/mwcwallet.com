// Use strict
"use strict";


// Classes

// Slate input class
class SlateInput {

	// Public
	
		// Constructor
		constructor(serializedSlateInputOrFeatures, slateOrCommit) {
		
			// Reset
			this.reset();
			
			// Check if a binary serialized slate input is provided
			if(serializedSlateInputOrFeatures instanceof BitReader === true) {
			
				// Get serialized slate input
				var serializedSlateInput = serializedSlateInputOrFeatures;
				
				// Get slate
				var slate = slateOrCommit;
			
				// Unserialize the serialized slate input
				this.unserialize(serializedSlateInput, slate);
			}
			
			// Otherwise check if a serialized slate input is provided
			else if(Object.isObject(serializedSlateInputOrFeatures) === true) {
			
				// Get serialized slate input
				var serializedSlateInput = serializedSlateInputOrFeatures;
				
				// Get slate
				var slate = slateOrCommit;
		
				// Unserialize the serialized slate input
				this.unserialize(serializedSlateInput, slate);
			}
			
			// Otherwise check if arguments are provided
			else if(typeof serializedSlateInputOrFeatures === "number") {
			
				// Get features
				var features = serializedSlateInputOrFeatures;
				
				// Get Commit
				var commit = slateOrCommit;
				
				// Set features to provided features
				this.features = features;
				
				// Set commit to provided commit
				this.commit = commit;
			}
			
			// Otherwise
			else {
			
				// Throw error
				throw "Unsupported input.";
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
		
					// Return serialized slate input
					return {
					
						// Features
						"features": SlateInput.featuresToText(this.getFeatures()),
						
						// Commit
						"commit": Common.toHexString(this.getCommit())
					};
				
				// Version four
				case Slate.VERSION_FOUR.toFixed():
				
					// Check if serializing slate input as binary
					if(typeof bitWriter !== "undefined") {
					
						// Try
						try {
					
							// Write features
							bitWriter.setBytes([this.getFeatures()]);
							
							// Write commit
							bitWriter.setBytes(this.getCommit());
						}
						
						// Catch errors
						catch(error) {
						
							// Throw error
							throw "Unsupported input.";
						}
					}
					
					// Otherwise
					else {
					
						// Create serialized slate input
						var serializedSlateInput = {
						
							// Commit
							"c": Common.toHexString(this.getCommit())
						};
						
						// Check if not plain
						if(this.isPlain() === false) {
						
							// Set serialized slate input's features
							serializedSlateInput["f"] = this.getFeatures();
						}
						
						// Return serialized slate input
						return serializedSlateInput;
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
				"features": SlateInput.featuresToText(this.getFeatures()),
				
				// Commit
				"commit": Common.toHexString(this.getCommit())
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
		
		// Is plain
		isPlain() {
		
			// Return if features is plain
			return this.getFeatures() === SlateInput.PLAIN_FEATURES;
		}
		
		// Is coinbase
		isCoinbase() {
		
			// Return if features is coinbase
			return this.getFeatures() === SlateInput.COINBASE_FEATURES;
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
		isEqualTo(slateInput) {
		
			// Check if features aren't equal
			if(this.getFeatures() !== slateInput.getFeatures())
			
				// Return false
				return false;
			
			// Check if commits aren't equal
			if(Common.arraysAreEqual(this.getCommit(), slateInput.getCommit()) === false)
			
				// Return false
				return false;
			
			// Return true
			return true;
		}
	
	// Private
	
		// Reset
		reset() {
		
			// Set features to plain features
			this.features = SlateInput.PLAIN_FEATURES;
		}
		
		// Unserialize
		unserialize(serializedSlateInput, slate) {
		
			// Check slate's version
			switch((slate.getVersion() instanceof BigNumber === true) ? slate.getVersion().toFixed() : slate.getVersion()) {
			
				// Version two and three
				case Slate.VERSION_TWO.toFixed():
				case Slate.VERSION_THREE.toFixed():
		
					// Check if serialized slate input's features isn't supported
					if("features" in serializedSlateInput === false || SlateInput.textToFeatures(serializedSlateInput["features"]) === SlateInput.UNSUPPORTED_FEATURES) {
					
						// Throw error
						throw "Unsupported input.";
					}
					
					// Set features to serialized slate input's features
					this.features = SlateInput.textToFeatures(serializedSlateInput["features"]);
				
					// Check if serialized slate input's commit isn't supported
					if("commit" in serializedSlateInput === false || Common.isHexString(serializedSlateInput["commit"]) === false || Common.hexStringLength(serializedSlateInput["commit"]) !== Crypto.COMMIT_LENGTH || Secp256k1Zkp.isValidCommit(Common.fromHexString(serializedSlateInput["commit"])) !== true) {
					
						// Throw error
						throw "Unsupported input.";
					}
					
					// Set commit to serialized slate input's commit
					this.commit = Common.fromHexString(serializedSlateInput["commit"]);
					
					// Break
					break;
				
				// Version four
				case Slate.VERSION_FOUR.toFixed():
				
					// Check if serialized slate input is binary
					if(serializedSlateInput instanceof BitReader === true) {
					
						// Get bit reader
						var bitReader = serializedSlateInput;
						
						// Try
						try {
						
							// Set features to serialized slate input's features
							this.features = bitReader.getBytes(1)[0];
							
							// Check if serialized slate input's features isn't supported
							if(this.getFeatures() !== SlateInput.PLAIN_FEATURES && this.getFeatures() !== SlateInput.COINBASE_FEATURES) {
							
								// Throw error
								throw "Unsupported input.";
							}
							
							// Set commit to serialized slate input's commit
							this.commit = bitReader.getBytes(Crypto.COMMIT_LENGTH);
							
							// Check if serialized slate input's commit isn't supported
							if(Secp256k1Zkp.isValidCommit(this.getCommit()) !== true) {
							
								// Throw error
								throw "Unsupported input.";
							}
						}
						
						// Catch errors
						catch(error) {
						
							// Throw error
							throw "Unsupported input.";
						}
					}
					
					// Otherwise
					else {
					
						// Check if serialized slate input's features isn't supported
						if("f" in serializedSlateInput === true && ((Common.isNumberString(serializedSlateInput["f"]) === false && serializedSlateInput["f"] instanceof BigNumber === false) || ((new BigNumber(serializedSlateInput["f"])).isEqualTo(SlateInput.PLAIN_FEATURES) === false && (new BigNumber(serializedSlateInput["f"])).isEqualTo(SlateInput.COINBASE_FEATURES) === false))) {
						
							// Throw error
							throw "Unsupported input.";
						}
						
						// Set features to serialized slate input's features
						this.features = ("f" in serializedSlateInput === true) ? (new BigNumber(serializedSlateInput["f"])).toNumber() : SlateInput.PLAIN_FEATURES;
					
						// Check if serialized slate input's commit isn't supported
						if("c" in serializedSlateInput === false || Common.isHexString(serializedSlateInput["c"]) === false || Common.hexStringLength(serializedSlateInput["c"]) !== Crypto.COMMIT_LENGTH || Secp256k1Zkp.isValidCommit(Common.fromHexString(serializedSlateInput["c"])) !== true) {
						
							// Throw error
							throw "Unsupported input.";
						}
						
						// Set commit to serialized slate input's commit
						this.commit = Common.fromHexString(serializedSlateInput["c"]);
					}
					
					// Break
					break;
				
				// Default
				default:
				
					// Throw error
					throw "Unsupported input.";
			}
		}
		
		// Features to text
		static featuresToText(features) {
		
			// Check features
			switch(features) {
			
				// Plain features
				case SlateInput.PLAIN_FEATURES:
				
					// Return plain text
					return "Plain";
				
				// Coinbase features
				case SlateInput.COINBASE_FEATURES:
				
					// Return coinbase text
					return "Coinbase";
				
				// Default
				default:
				
					// Return unsupported features
					return SlateInput.UNSUPPORTED_FEATURES;
			}
		}
		
		// Text to feature
		static textToFeatures(text) {
		
			// Check text
			switch(text) {
			
				// Plain text
				case "Plain":
				
					// Return plain features
					return SlateInput.PLAIN_FEATURES;
				
				// Coinbase text
				case "Coinbase":
				
					// Return coinbase features
					return SlateInput.COINBASE_FEATURES;
				
				// Default
				default:
				
					// Return unsupported features
					return SlateInput.UNSUPPORTED_FEATURES;
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
			return SlateInput.PLAIN_FEATURES + 1;
		}
		
		// Unsupported features
		static get UNSUPPORTED_FEATURES() {
		
			// Return unsupported features
			return SlateInput.COINBASE_FEATURES + 1;
		}
}


// Main function

// Set global object's slate input
globalThis["SlateInput"] = SlateInput;
