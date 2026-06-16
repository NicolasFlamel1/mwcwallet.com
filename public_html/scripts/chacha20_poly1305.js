// Use strict
"use strict";


// Classes

// ChaCha20 Poly1305 class
class ChaCha20Poly1305 {

	// Public
	
		// Encrypt
		static encrypt(key, nonce, data, additionalAuthenticatedData = new Uint8Array([])) {
		
			// Check if key or nonce is invalid
			if(key["length"] !== ChaCha20Poly1305.KEY_LENGTH || nonce["length"] !== ChaCha20Poly1305.NONCE_LENGTH) {
			
				// Return false
				return false;
			}
			
			// Create state from key and nonce
			var state = ChaCha20Poly1305.createState(ChaCha20Poly1305.CONSTANTS, key, nonce);
			
			// Create working state
			var workingState = new Array(state["length"]);
			for(var i = 0; i < workingState["length"]; ++i) {
			
				workingState[i] = new Uint8Array(Uint32Array.BYTES_PER_ELEMENT);
			}
			
			// Update working state from state
			ChaCha20Poly1305.chaCha20Block(workingState, state);
			
			// Get r from working state
			var r = new Uint8Array(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH);
			for(var i = 0, j = Math.floor(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH / Uint32Array.BYTES_PER_ELEMENT); i < j; ++i) {
			
				r.set(workingState[i], i * Uint32Array.BYTES_PER_ELEMENT);
			}
			
			// Clamp r
			r[3] &= 15;
			r[7] &= 15;
			r[11] &= 15;
			r[15] &= 15;
			r[4] &= 252;
			r[8] &= 252;
			r[12] &= 252;
			
			// Get s from working state
			var s = new Uint8Array(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH);
			for(var i = 0, j = Math.floor(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH / Uint32Array.BYTES_PER_ELEMENT); i < j; ++i) {
			
				s.set(workingState[i + j], i * Uint32Array.BYTES_PER_ELEMENT);
			}
			
			// Set accumulator to zero
			var accumulator = new Uint8Array(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH);
			
			// Update accumulator with the additional authenticated data
			ChaCha20Poly1305.updateAccumulator(accumulator, r, additionalAuthenticatedData);
			
			// Create encrypted data
			var encryptedData = new Uint8Array(data["length"]);
			
			// Go through all blocks of data
			for(var i = 0, j = Math.floor((data["length"] + ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH - 1) / ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH); i < j; ++i) {
			
				// Go through all bytes in state's counter while carry exists
				var carry = 1;
				for(var k = 0; k < state[ChaCha20Poly1305.COUNTER_INDEX]["length"] && carry > 0; ++k) {
				
					// Add byte to carry
					carry += state[ChaCha20Poly1305.COUNTER_INDEX][k];
					
					// Set byte to carry's byte
					state[ChaCha20Poly1305.COUNTER_INDEX][k] = carry;
					
					// Remove byte from carry
					carry >>= Common.BITS_IN_A_BYTE;
				}
				
				// Check if counter overflowed
				if(carry !== 0) {
				
					// Securley clear s
					s.fill(0);
					
					// Securley clear r
					r.fill(0);
					
					// Go through all parts of the state
					for(var k = 0; k < state["length"]; ++k) {
					
						// Securley clear state
						state[k].fill(0);
						
						// Securley clear working state
						workingState[k].fill(0);
					}
					
					// Return false
					return false;
				}
				
				// Update working state from state
				ChaCha20Poly1305.chaCha20Block(workingState, state);
				
				// Get block from data
				var block = data.subarray(i * ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH, (i + 1) * ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH);
				
				// Go through all bytes in the block
				for(var k = 0; k < block["length"]; ++k) {
				
					// Encrypt byte using the working state
					encryptedData[k + i * ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH] = block[k] ^ workingState[Math.floor(k / Uint32Array.BYTES_PER_ELEMENT)][k % Uint32Array.BYTES_PER_ELEMENT];
				}
			}
			
			// Go through all parts of the state
			for(var i = 0; i < state["length"]; ++i) {
			
				// Securley clear state
				state[i].fill(0);
				
				// Securley clear working state
				workingState[i].fill(0);
			}
			
			// Update accumulator with the encrypted data
			ChaCha20Poly1305.updateAccumulator(accumulator, r, encryptedData);
			
			// Update accumulator with the additional authenticated data's length and encrypted data's length
			var lengths = new Uint8Array(Common.BYTES_IN_A_UINT64 * 2);
			lengths.set((new BigNumber(additionalAuthenticatedData["length"])).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64));
			lengths.set((new BigNumber(encryptedData["length"])).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64), Common.BYTES_IN_A_UINT64);
			
			ChaCha20Poly1305.updateAccumulator(accumulator, r, lengths);
			
			// Securley clear r
			r.fill(0);
			
			// Add s to the accumulator
			ChaCha20Poly1305.addArrays(accumulator, s);
			
			// Securley clear s
			s.fill(0);
			
			// Return encrypted data and tag
			return [
			
				// Encrypted data
				encryptedData,
				
				// Tag
				accumulator.subarray(0, ChaCha20Poly1305.TAG_LENGTH)
			];
		}
		
		// Decrypt
		static decrypt(key, nonce, encryptedData, tag, additionalAuthenticatedData = new Uint8Array([])) {
		
			// Check if key, nonce, or tag is invalid
			if(key["length"] !== ChaCha20Poly1305.KEY_LENGTH || nonce["length"] !== ChaCha20Poly1305.NONCE_LENGTH || tag["length"] !== ChaCha20Poly1305.TAG_LENGTH) {
			
				// Return false
				return false;
			}
			
			// Create state from key and nonce
			var state = ChaCha20Poly1305.createState(ChaCha20Poly1305.CONSTANTS, key, nonce);
			
			// Create working state
			var workingState = new Array(state["length"]);
			for(var i = 0; i < workingState["length"]; ++i) {
			
				workingState[i] = new Uint8Array(Uint32Array.BYTES_PER_ELEMENT);
			}
			
			// Update working state from state
			ChaCha20Poly1305.chaCha20Block(workingState, state);
			
			// Get r from working state
			var r = new Uint8Array(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH);
			for(var i = 0, j = Math.floor(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH / Uint32Array.BYTES_PER_ELEMENT); i < j; ++i) {
			
				r.set(workingState[i], i * Uint32Array.BYTES_PER_ELEMENT);
			}
			
			// Clamp r
			r[3] &= 15;
			r[7] &= 15;
			r[11] &= 15;
			r[15] &= 15;
			r[4] &= 252;
			r[8] &= 252;
			r[12] &= 252;
			
			// Get s from working state
			var s = new Uint8Array(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH);
			for(var i = 0, j = Math.floor(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH / Uint32Array.BYTES_PER_ELEMENT); i < j; ++i) {
			
				s.set(workingState[i + j], i * Uint32Array.BYTES_PER_ELEMENT);
			}
			
			// Set accumulator to zero
			var accumulator = new Uint8Array(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH);
			
			// Update accumulator with the additional authenticated data
			ChaCha20Poly1305.updateAccumulator(accumulator, r, additionalAuthenticatedData);
			
			// Create decrypted data
			var decryptedData = new Uint8Array(encryptedData["length"]);
			
			// Go through all blocks of encrypted data
			for(var i = 0, j = Math.floor((encryptedData["length"] + ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH - 1) / ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH); i < j; ++i) {
			
				// Go through all bytes in state's counter while carry exists
				var carry = 1;
				for(var k = 0; k < state[ChaCha20Poly1305.COUNTER_INDEX]["length"] && carry > 0; ++k) {
				
					// Add byte to carry
					carry += state[ChaCha20Poly1305.COUNTER_INDEX][k];
					
					// Set byte to carry's byte
					state[ChaCha20Poly1305.COUNTER_INDEX][k] = carry;
					
					// Remove byte from carry
					carry >>= Common.BITS_IN_A_BYTE;
				}
				
				// Check if counter overflowed
				if(carry !== 0) {
				
					// Securley clear s
					s.fill(0);
					
					// Securley clear r
					r.fill(0);
					
					// Go through all parts of the state
					for(var k = 0; k < state["length"]; ++k) {
					
						// Securley clear state
						state[k].fill(0);
						
						// Securley clear working state
						workingState[k].fill(0);
					}
					
					// Return false
					return false;
				}
				
				// Update working state from state
				ChaCha20Poly1305.chaCha20Block(workingState, state);
				
				// Get block from encrypted data
				var block = encryptedData.subarray(i * ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH, (i + 1) * ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH);
				
				// Go through all bytes in the block
				for(var k = 0; k < block["length"]; ++k) {
				
					// Decrypt byte using the working state
					decryptedData[k + i * ChaCha20Poly1305.CHACHA20_BLOCK_LENGTH] = block[k] ^ workingState[Math.floor(k / Uint32Array.BYTES_PER_ELEMENT)][k % Uint32Array.BYTES_PER_ELEMENT];
				}
			}
			
			// Go through all parts of the state
			for(var i = 0; i < state["length"]; ++i) {
			
				// Securley clear state
				state[i].fill(0);
				
				// Securley clear working state
				workingState[i].fill(0);
			}
			
			// Update accumulator with the encrypted data
			ChaCha20Poly1305.updateAccumulator(accumulator, r, encryptedData);
			
			// Update accumulator with the additional authenticated data's length and encrypted data's length
			var lengths = new Uint8Array(Common.BYTES_IN_A_UINT64 * 2);
			lengths.set((new BigNumber(additionalAuthenticatedData["length"])).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64));
			lengths.set((new BigNumber(encryptedData["length"])).toBytes(BigNumber.LITTLE_ENDIAN, Common.BYTES_IN_A_UINT64), Common.BYTES_IN_A_UINT64);
			
			ChaCha20Poly1305.updateAccumulator(accumulator, r, lengths);
			
			// Securley clear r
			r.fill(0);
			
			// Add s to the accumulator
			ChaCha20Poly1305.addArrays(accumulator, s);
			
			// Securley clear s
			s.fill(0);
			
			// Check if tag isn't correct
			if(Common.arraysAreEqualTimingSafe(accumulator.subarray(0, ChaCha20Poly1305.TAG_LENGTH), tag) === false) {
			
				// Return false
				return false;
			}
			
			// Return decrypted data
			return decryptedData;
		}
		
		// Encrypted data index
		static get ENCRYPTED_DATA_INDEX() {
		
			// Return encrypted data index
			return 0;
		}
		
		// Tag index
		static get TAG_INDEX() {
		
			// Return tag index
			return ChaCha20Poly1305.ENCRYPTED_DATA_INDEX + 1;
		}
	
	// Private
	
		// Add arrays
		static addArrays(valueOne, valueTwo) {
		
			// Go through all bytes in value one
			for(var i = 0, carry = 0; i < valueOne["length"]; ++i) {
			
				// Add sum of value's bytes to carry
				carry += valueOne[i] + valueTwo[i];
				
				// Set byte to carry's byte
				valueOne[i] = carry;
				
				// Remove byte from carry
				carry >>= Common.BITS_IN_A_BYTE;
			}
		}
		
		// Quarter round
		static quarterRound(a, b, c, d) {
		
			// Get a += b
			ChaCha20Poly1305.addArrays(a, b);
			
			// Get d = rotl(d ^ a, 16)
			var tempOne = d[0];
			d[0] = d[2] ^ a[2];
			d[2] = tempOne ^ a[0];
			tempOne = d[1];
			d[1] = d[3] ^ a[3];
			d[3] = tempOne ^ a[1];
			
			// Get c += d
			ChaCha20Poly1305.addArrays(c, d);
			
			// Get b ^= c
			for(var i = 0; i < b["length"]; ++i) {
			
				b[i] ^= c[i];
			}
			
			// Get b = rotl(b, 12)
			tempOne = b[0];
			b[0] = (b[3] << 4) | (b[2] >> (Common.BITS_IN_A_BYTE - 4));
			var tempTwo = b[1];
			b[1] = (tempOne << 4) | (b[3] >> (Common.BITS_IN_A_BYTE - 4));
			b[3] = (b[2] << 4) | (tempTwo >> (Common.BITS_IN_A_BYTE - 4));
			b[2] = (tempTwo << 4) | (tempOne >> (Common.BITS_IN_A_BYTE - 4));
			
			// Get a += b
			ChaCha20Poly1305.addArrays(a, b);
			
			// Get d = rotl(d ^ a, 8)
			tempOne = d[3];
			d[3] = d[2] ^ a[2];
			d[2] = d[1] ^ a[1];
			d[1] = d[0] ^ a[0];
			d[0] = tempOne ^ a[3];
			
			// Get c += d
			ChaCha20Poly1305.addArrays(c, d);
			
			// Get b ^= c
			for(var i = 0; i < b["length"]; ++i) {
			
				b[i] ^= c[i];
			}
			
			// Get b = rotl(b, 7)
			tempOne = b[3];
			b[3] = (b[3] << 7) | (b[2] >> (Common.BITS_IN_A_BYTE - 7));
			b[2] = (b[2] << 7) | (b[1] >> (Common.BITS_IN_A_BYTE - 7));
			b[1] = (b[1] << 7) | (b[0] >> (Common.BITS_IN_A_BYTE - 7));
			b[0] = (b[0] << 7) | (tempOne >> (Common.BITS_IN_A_BYTE - 7));
		}
		
		// Create state
		static createState(constants, key, nonce) {
		
			// Return state
			return [
			
				// Constants
				new Uint8Array(constants.subarray(0, Uint32Array.BYTES_PER_ELEMENT)),
				new Uint8Array(constants.subarray(Uint32Array.BYTES_PER_ELEMENT, Uint32Array.BYTES_PER_ELEMENT * 2)),
				new Uint8Array(constants.subarray(Uint32Array.BYTES_PER_ELEMENT * 2, Uint32Array.BYTES_PER_ELEMENT * 3)),
				new Uint8Array(constants.subarray(Uint32Array.BYTES_PER_ELEMENT * 3)),
				
				// Key
				new Uint8Array(key.subarray(0, Uint32Array.BYTES_PER_ELEMENT)),
				new Uint8Array(key.subarray(Uint32Array.BYTES_PER_ELEMENT, Uint32Array.BYTES_PER_ELEMENT * 2)),
				new Uint8Array(key.subarray(Uint32Array.BYTES_PER_ELEMENT * 2, Uint32Array.BYTES_PER_ELEMENT * 3)),
				new Uint8Array(key.subarray(Uint32Array.BYTES_PER_ELEMENT * 3, Uint32Array.BYTES_PER_ELEMENT * 4)),
				new Uint8Array(key.subarray(Uint32Array.BYTES_PER_ELEMENT * 4, Uint32Array.BYTES_PER_ELEMENT * 5)),
				new Uint8Array(key.subarray(Uint32Array.BYTES_PER_ELEMENT * 5, Uint32Array.BYTES_PER_ELEMENT * 6)),
				new Uint8Array(key.subarray(Uint32Array.BYTES_PER_ELEMENT * 6, Uint32Array.BYTES_PER_ELEMENT * 7)),
				new Uint8Array(key.subarray(Uint32Array.BYTES_PER_ELEMENT * 7)),
				
				// Counter
				new Uint8Array(Uint32Array.BYTES_PER_ELEMENT),
				
				// Nonce
				new Uint8Array(nonce.subarray(0, Uint32Array.BYTES_PER_ELEMENT)),
				new Uint8Array(nonce.subarray(Uint32Array.BYTES_PER_ELEMENT, Uint32Array.BYTES_PER_ELEMENT * 2)),
				new Uint8Array(nonce.subarray(Uint32Array.BYTES_PER_ELEMENT * 2))
			];
		}
		
		// ChaCha20 block
		static chaCha20Block(workingState, state) {
		
			// Set working state from state
			for(var i = 0; i < workingState["length"]; ++i) {
			
				workingState[i].set(state[i]);
			}
			
			// Go through all rounds
			for(var i = 0; i < ChaCha20Poly1305.NUMBER_OF_ROUNDS / 2; ++i) {
			
				// Perform two rounds on the working state
				ChaCha20Poly1305.quarterRound(workingState[0], workingState[4], workingState[8], workingState[12]);
				ChaCha20Poly1305.quarterRound(workingState[1], workingState[5], workingState[9], workingState[13]);
				ChaCha20Poly1305.quarterRound(workingState[2], workingState[6], workingState[10], workingState[14]);
				ChaCha20Poly1305.quarterRound(workingState[3], workingState[7], workingState[11], workingState[15]);
				ChaCha20Poly1305.quarterRound(workingState[0], workingState[5], workingState[10], workingState[15]);
				ChaCha20Poly1305.quarterRound(workingState[1], workingState[6], workingState[11], workingState[12]);
				ChaCha20Poly1305.quarterRound(workingState[2], workingState[7], workingState[8], workingState[13]);
				ChaCha20Poly1305.quarterRound(workingState[3], workingState[4], workingState[9], workingState[14]);
			}
			
			// Go through all parts of the working state
			for(var i = 0; i < workingState["length"]; ++i) {
			
				// Add state's part to the part
				ChaCha20Poly1305.addArrays(workingState[i], state[i]);
			}
		}
		
		// Update accumulator
		static updateAccumulator(accumulator, r, data) {
		
			// Go through all blocks of data
			for(var i = 0, j = Math.floor((data["length"] + ChaCha20Poly1305.POLY1305_BLOCK_LENGTH - 1) / ChaCha20Poly1305.POLY1305_BLOCK_LENGTH); i < j; ++i) {
			
				// Get block from data
				var block = data.subarray(i * ChaCha20Poly1305.POLY1305_BLOCK_LENGTH, (i + 1) * ChaCha20Poly1305.POLY1305_BLOCK_LENGTH);
				
				// Pad block and append a one to it
				var paddedBlock = new Uint8Array(ChaCha20Poly1305.POLY1305_NUMBER_LENGTH);
				paddedBlock.set(block);
				paddedBlock[paddedBlock["length"] - 1] = 1;
				
				// Add padded block to accumulator
				ChaCha20Poly1305.addArrays(accumulator, paddedBlock);
				
				// Securley clear padded block
				paddedBlock.fill(0);
				
				// Multiple the accumulator by r then modulo by P
				accumulator.set(new BigNumber(Common.HEX_PREFIX + Common.toHexString(new Uint8Array(accumulator).reverse())).multipliedBy(new BigNumber(Common.HEX_PREFIX + Common.toHexString(new Uint8Array(r).reverse()))).modulo(ChaCha20Poly1305.P).toBytes(BigNumber.LITTLE_ENDIAN, accumulator["length"]));
			}
		}
		
		// Key length
		static get KEY_LENGTH() {
		
			// Return key length
			return 32;
		}
		
		// Nonce length
		static get NONCE_LENGTH() {
		
			// Return nonce length
			return 12;
		}
		
		// Tag length
		static get TAG_LENGTH() {
		
			// Return tag length
			return 16;
		}
		
		// Constants
		static get CONSTANTS() {
		
			// Return constants
			return (new TextEncoder()).encode("expand 32-byte k");
		}
		
		// ChaCha20 block length
		static get CHACHA20_BLOCK_LENGTH() {
		
			// Return ChaCha20 block length
			return 64;
		}
		
		// Counter index
		static get COUNTER_INDEX() {
		
			// Return counter index
			return 12;
		}
		
		// Number of rounds
		static get NUMBER_OF_ROUNDS() {
		
			// Return number of rounds
			return 20;
		}
		
		// Poly1305 number length
		static get POLY1305_NUMBER_LENGTH() {
		
			// Return Poly1305 number length
			return 17;
		}
		
		// Poly1305 block length
		static get POLY1305_BLOCK_LENGTH() {
		
			// Return Poly1305 block length
			return 16;
		}
		
		// P
		static get P() {
		
			// Return P
			return "0x03FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB";
		}
}


// Main function

// Set global object's ChaCha20 Poly1305
globalThis["ChaCha20Poly1305"] = ChaCha20Poly1305;
