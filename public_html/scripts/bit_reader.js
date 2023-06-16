// Use strict
"use strict";


// Classes

// Bit reader class
class BitReader {

	// Public

		// Constructor
		constructor(data) {
		
			// Set data
			this.data = data;
			
			// Initialize byte index
			this.byteIndex = 0;
			
			// Initialize bit index
			this.bitIndex = 0;
		}
		
		// Get bits
		getBits(numberOfBits) {
		
			// Check if more than one byte is requested
			if(numberOfBits > Common.BITS_IN_A_BYTE) {
			
				// Initialize result
				var result = 0;
			
				// Go through all bytes
				while(numberOfBits > 0) {
				
					// Update result to make space for more bits
					result <<= Math.min(numberOfBits, Common.BITS_IN_A_BYTE);
					
					// Include bits in result
					result |= this.getBits(Math.min(numberOfBits, Common.BITS_IN_A_BYTE));
				
					// Update number of bits
					numberOfBits -= Common.BITS_IN_A_BYTE;
				}
				
				// Return result
				return result;
			}
			
			// Otherwise
			else {
			
				// Check if no bits requested
				if(numberOfBits === 0) {
				
					// Return zero
					return 0;
				}
		
				// Check if number of bits is invalid
				if(this.byteIndex === this.data["length"] || (this.byteIndex === this.data["length"] - 1 && this.bitIndex + numberOfBits > Common.BITS_IN_A_BYTE)) {
				
					// Throw error
					throw "Invalid number of bits.";
				}
			
				// Initialize result to data at the byte index
				var result = this.data[this.byteIndex] << Common.BITS_IN_A_BYTE;
				
				// Check if more data is needed
				if(this.bitIndex + numberOfBits > Common.BITS_IN_A_BYTE) {
				
					// Append next byte to the result
					result |= this.data[this.byteIndex + 1];
				}
				
				// Remove upper bits from result
				result &= (1 << (Common.BITS_IN_A_BYTE * 2 - this.bitIndex)) - 1;
				
				// Remove lower bits from result
				result >>>= (Common.BITS_IN_A_BYTE * 2 - (this.bitIndex + numberOfBits));
			
				// Update bit index
				this.bitIndex += numberOfBits;
				
				// Check if bit index overflowed into the next byte
				if(this.bitIndex >= Common.BITS_IN_A_BYTE) {
				
					// Increment byte index
					++this.byteIndex;
				
					// Correct bit index
					this.bitIndex %= Common.BITS_IN_A_BYTE;
				}
				
				// Return result
				return result;
			}
		}
		
		// Get bytes
		getBytes(numberOfBytes) {
		
			// Initialize result
			var result = new Uint8Array(numberOfBytes);
			
			// Go through all bytes
			for(var i = 0; i < numberOfBytes; ++i) {
			
				// Set byte in the result
				result[i] = this.getBits(Common.BITS_IN_A_BYTE);
			}
			
			// Return result
			return result;
		}
}


// Main function

// Set global object's bit reader
globalThis["BitReader"] = BitReader;
