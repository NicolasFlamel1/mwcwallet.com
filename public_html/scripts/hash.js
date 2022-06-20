// Use strict
"use strict";


// Classes

// Hash class
class Hash {

	// Public
	
		// Constructor
		constructor(data) {
		
			// Check if creating hash from data was successful
			this.bytes = Blake2b.compute(Hash.HASH_LENGTH, Common.mergeArrays(data), new Uint8Array([]));
			
			if(this.bytes === Blake2b.OPERATION_FAILED) {
			
				// Throw error
				throw "Creating hash failed.";
			}
		}
		
		// Compare
		compare(hash) {
		
			// Go through all bytes in the hash
			for(var i = 0; i < Hash.HASH_LENGTH; ++i) {
			
				// Get bytes
				var byte = this.getBytes()[i];
				var otherByte = hash.getBytes()[i];
			
				// Check if byte is greater than the other
				if(byte > otherByte)
				
					// Return sort greater than
					return Common.SORT_GREATER_THAN;
				
				// Otherwise check if byte is less than the other
				else if(byte < otherByte)
				
					// Return sort less than
					return Common.SORT_LESS_THAN;
			}
			
			// Return sort equal
			return Common.SORT_EQUAL;
		}
		
		// Serialize
		serialize() {
		
			// Return serialized hash
			return Common.toHexString(this.getBytes());
		}
	
	// Private
	
		// Get bytes
		getBytes() {
		
			// Return bytes
			return this.bytes;
		}
	
		// Hash length
		static get HASH_LENGTH() {
		
			// Return hash length
			return 32;
		}
}


// Main function

// Set global object's hash
globalThis["Hash"] = Hash;
