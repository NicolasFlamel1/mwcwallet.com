// Use strict
"use strict";


// Classes

// Bit writer class
class BitWriter {

	// Public

		// Constructor
		constructor() {
		
			// Set data
			this.data = new Uint8Array([]);
			
			// Initialize byte index
			this.byteIndex = 0;
			
			// Initialize bit index
			this.bitIndex = 0;
		}
		
		// Set bits
		setBits(value, numberOfBits) {
		
			// Go through all bytes past one byte
			while(numberOfBits > Common.BITS_IN_A_BYTE) {
			
				// Set byte
				this.setBits(value >>> (Common.BITS_IN_A_BYTE * (Math.floor(numberOfBits / Common.BITS_IN_A_BYTE) - 1) + numberOfBits % Common.BITS_IN_A_BYTE), Math.min(numberOfBits, Common.BITS_IN_A_BYTE));
				
				// Update number of bits
				numberOfBits -= Common.BITS_IN_A_BYTE;
			}
			
			// Check if no bits requested
			if(numberOfBits === 0) {
			
				// Return
				return;
			}
			
			// Check if more data is needed
			if(this.bitIndex === 0 || this.bitIndex + numberOfBits > Common.BITS_IN_A_BYTE) {
			
				// Increase data's size by one
				var temp = new Uint8Array(this.data["length"] + 1);
				
				temp.set(this.data);
				
				this.data = temp;
			}
			
			// Check if value will overflow into the next byte
			if(this.bitIndex + numberOfBits > Common.BITS_IN_A_BYTE) {
			
				// Include data in value at byte index
				this.data[this.byteIndex] |= value >>> ((this.bitIndex + numberOfBits) - Common.BITS_IN_A_BYTE);
				
				// Include data in value at next byte index
				this.data[this.byteIndex + 1] |= value << (Common.BITS_IN_A_BYTE * 2 - (this.bitIndex + numberOfBits));
			}
			
			// Otherwise
			else {
			
				// Include data in value at byte index
				this.data[this.byteIndex] |= value << (Common.BITS_IN_A_BYTE - (this.bitIndex + numberOfBits));
			}
			
			// Update bit index
			this.bitIndex += numberOfBits;
			
			// Check if bit index overflowed into the next byte
			if(this.bitIndex >= Common.BITS_IN_A_BYTE) {
			
				// Increment byte index
				++this.byteIndex;
			
				// Correct bit index
				this.bitIndex %= Common.BITS_IN_A_BYTE;
			}
		}
		
		// Set bytes
		setBytes(bytes) {
		
			// Go through all bytes
			for(var i = 0; i < bytes["length"]; ++i) {
			
				// Set byte in the data
				this.setBits(bytes[i], Common.BITS_IN_A_BYTE);
			}
		}
		
		// Get bytes
		getBytes() {
		
			// Return data
			return this.data;
		}
}


// Main function

// Set global object's bit writer
globalThis["BitWriter"] = BitWriter;
