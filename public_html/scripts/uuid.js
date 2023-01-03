// Use strict
"use strict";


// Classes

// UUID class
class Uuid {

	// Public
	
		// Constructor
		constructor(serializedUuid) {
		
			// Unserialize the serialized UUID
			this.unserialize(serializedUuid);
		}
		
		// Get version
		getVersion() {
		
			// Return version
			return this.version;
		}
		
		// Get variant
		getVariant() {
		
			// Return variant
			return this.variant;
		}
		
		// Get data
		getData() {
		
			// Return data
			return this.data;
		}
		
		// Serialize
		serialize() {
		
			// Return serialized data
			return Uuid.serializeData(this.data);
		}
	
		// Unserialize
		unserialize(serializedUuid) {
		
			// Reset
			this.reset();
		
			// Check if the serialized UUID isn't a nil UUID
			if(serializedUuid !== Uuid.NIL_SERIALIZED_UUID) {
			
				// Check if serialized UUID isn't formatted correctly
				if(Uuid.SERIALIZED_PATTERN.test(serializedUuid) === false) {
				
					// Throw error
					throw "Invalid UUID";
				}
		
				// Get serialized UUID's version
				this.version = parseInt(serializedUuid[Uuid.SERIALIZED_VERSION_OFFSET], Common.HEX_NUMBER_BASE);
				
				// Check if version is invalid
				if(this.version < Uuid.MINIMUM_VERSION || this.version > Uuid.MAXIMUM_VERSION) {
				
					// Throw error
					throw "Invalid UUID";
				}
				
				// Get serialized UUID's variant field
				var variantField = parseInt(serializedUuid[Uuid.SERIALIZED_VARIANT_OFFSET], Common.HEX_NUMBER_BASE);
				
				// Check if variant is type zero
				if((variantField & Uuid.VARIANT_ZERO_BITMASK) === Uuid.VARIANT_ZERO_BITMASK_RESULT)
				
					// Set variant to variant zero
					this.variant = Uuid.VARIANT_ZERO;
				
				// Otherwise check if variant is type one
				else if((variantField & Uuid.VARIANT_ONE_BITMASK) === Uuid.VARIANT_ONE_BITMASK_RESULT)
				
					// Set variant to variant one
					this.variant = Uuid.VARIANT_ONE;
				
				// Otherwise check if variant is type two
				else if((variantField & Uuid.VARIANT_TWO_BITMASK) === Uuid.VARIANT_TWO_BITMASK_RESULT)
				
					// Set variant to variant two
					this.variant = Uuid.VARIANT_TWO;
				
				// Otherwise
				else {
				
					// Throw error
					throw "Invalid UUID";
				}
				
				// Set data to serialized UUID's sections as bytes
				this.data = Common.fromHexString(serializedUuid.replaceAll(Uuid.SECTION_SEPARATOR, ""));
				
				// Check if variant is two
				if(this.getVariant() === Uuid.VARIANT_TWO) {
				
					// Change data's first three components to little endian
					this.data.subarray(0, Uint32Array["BYTES_PER_ELEMENT"]).reverse();
					this.data.subarray(Uint32Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"]).reverse();
					this.data.subarray(Uint32Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"]).reverse();
				}
			}
		}
		
		// Is random
		isRandom() {
		
			// Return if version is four
			return this.version === Uuid.VERSION_FOUR;
		}
		
		// Random serialized UUID
		static randomSerializedUuid() {
		
			// Create a random data
			var randomData = new Uint8Array(Uuid.DATA_LENGTH);
			
			// Fill random data with random values
			crypto.getRandomValues(randomData);
			
			// Serialize the random data
			var serializedRandomData = Uuid.serializeData(randomData);
			
			// Get serialized random data's version
			var version = parseInt(serializedRandomData[Uuid.SERIALIZED_VERSION_OFFSET], Common.HEX_NUMBER_BASE);
			
			// Set version to four
			version = Uuid.VERSION_FOUR.toString(Common.HEX_NUMBER_BASE);
			
			// Set version in serialized random data
			serializedRandomData = serializedRandomData.substring(0, Uuid.SERIALIZED_VERSION_OFFSET) + version + serializedRandomData.substring(Uuid.SERIALIZED_VERSION_OFFSET + version["length"]);
			
			// Get serialized random data's variant
			var variant = parseInt(serializedRandomData[Uuid.SERIALIZED_VARIANT_OFFSET], Common.HEX_NUMBER_BASE);
			
			// Set variant to one
			variant = ((variant & ~Uuid.VARIANT_ONE_BITMASK) | Uuid.VARIANT_ONE_BITMASK_RESULT).toString(Common.HEX_NUMBER_BASE);
			
			// Set variant in serialized random data
			serializedRandomData = serializedRandomData.substring(0, Uuid.SERIALIZED_VARIANT_OFFSET) + variant + serializedRandomData.substring(Uuid.SERIALIZED_VARIANT_OFFSET + variant["length"]);
			
			// Return serialized random data
			return serializedRandomData;
		}
		
		// Unknown version
		static get UNKNOWN_VERSION() {
		
			// Return unknown version
			return null;
		}
		
		// Unknown variant
		static get UNKNOWN_VARIANT() {
		
			// Return unknown variant
			return null;
		}
		
		// Byte length
		static get BYTE_LENGTH() {
		
			// Return byte length
			return (Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.THIRD_SECTION_SERIALIZED_LENGTH + Uuid.FOURTH_SECTION_SERIALIZED_LENGTH + Uuid.FIFTH_SECTION_SERIALIZED_LENGTH) / Common.HEX_NUMBER_LENGTH;
		}
		
	// Private
	
		// Reset
		reset() {
		
			// Set version to unknown
			this.version = Uuid.UNKNOWN_VERSION;
			
			// Set variant to unknown
			this.variant = Uuid.UNKNOWN_VARIANT;
			
			// Set data
			this.data = (new Uint8Array(Uuid.DATA_LENGTH)).fill(0);
		}
		
		// Serialize data
		static serializeData(data) {
		
			// Copy data
			var copy = new Uint8Array(data);
		
			// Get copy's variant field
			var variantField = copy[Uuid.DATA_VARIANT_OFFSET] >>> 4;
			
			// Check if variant is type two
			if((variantField & Uuid.VARIANT_TWO_BITMASK) === Uuid.VARIANT_TWO_BITMASK_RESULT) {
			
				// Change copy's first three components to big endian
				copy.subarray(0, Uint32Array["BYTES_PER_ELEMENT"]).reverse();
				copy.subarray(Uint32Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"]).reverse();
				copy.subarray(Uint32Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"], Uint32Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"] + Uint16Array["BYTES_PER_ELEMENT"]).reverse();
			}
			
			// Get copy as a string
			var string = Common.toHexString(copy);
			
			// Return string as sections
			return string.substring(0, Uuid.FIRST_SECTION_SERIALIZED_LENGTH) + Uuid.SECTION_SEPARATOR + string.substring(Uuid.FIRST_SECTION_SERIALIZED_LENGTH, Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH) + Uuid.SECTION_SEPARATOR + string.substring(Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH, Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.THIRD_SECTION_SERIALIZED_LENGTH) + Uuid.SECTION_SEPARATOR + string.substring(Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.THIRD_SECTION_SERIALIZED_LENGTH, Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.THIRD_SECTION_SERIALIZED_LENGTH + Uuid.FOURTH_SECTION_SERIALIZED_LENGTH) + Uuid.SECTION_SEPARATOR + string.substring(Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.THIRD_SECTION_SERIALIZED_LENGTH + Uuid.FOURTH_SECTION_SERIALIZED_LENGTH, Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.THIRD_SECTION_SERIALIZED_LENGTH + Uuid.FOURTH_SECTION_SERIALIZED_LENGTH + Uuid.FIFTH_SECTION_SERIALIZED_LENGTH);
		}
		
		// First section serialized length
		static get FIRST_SECTION_SERIALIZED_LENGTH() {
		
			// Return first section serialized length
			return 8;
		}
		
		// Second section serialized length
		static get SECOND_SECTION_SERIALIZED_LENGTH() {
		
			// Return second section serialized length
			return 4;
		}
		
		// Third section serialized length
		static get THIRD_SECTION_SERIALIZED_LENGTH() {
		
			// Return third section serialized length
			return 4;
		}
		
		// Fourth section serialized length
		static get FOURTH_SECTION_SERIALIZED_LENGTH() {
		
			// Return fourth section serialized length
			return 4;
		}
		
		// Fifth section serialized length
		static get FIFTH_SECTION_SERIALIZED_LENGTH() {
		
			// Return fifth section serialized length
			return 12;
		}
		
		// Section separator
		static get SECTION_SEPARATOR() {
		
			// Return section separator
			return "-";
		}
		
		// Data length
		static get DATA_LENGTH() {
		
			// Return data length
			return (Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.THIRD_SECTION_SERIALIZED_LENGTH + Uuid.FOURTH_SECTION_SERIALIZED_LENGTH + Uuid.FIFTH_SECTION_SERIALIZED_LENGTH) / Common.HEX_NUMBER_LENGTH;
		}
		
		// Data variant offset
		static get DATA_VARIANT_OFFSET() {
		
			// Return data variant offset
			return 8;
		}
		
		// Serialized pattern
		static get SERIALIZED_PATTERN() {
		
			// Return serialized pattern
			return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/ui;
		}
		
		// Nil serialized UUID
		static get NIL_SERIALIZED_UUID() {
		
			// Return nil serialized UUID
			return "00000000-0000-0000-0000-000000000000";
		}
		
		// Serialized version offset
		static get SERIALIZED_VERSION_OFFSET() {
		
			// Return serialized version offset
			return Uuid.FIRST_SECTION_SERIALIZED_LENGTH + Uuid.SECTION_SEPARATOR["length"] + Uuid.SECOND_SECTION_SERIALIZED_LENGTH + Uuid.SECTION_SEPARATOR["length"];
		}
		
		// Serialized variant offset
		static get SERIALIZED_VARIANT_OFFSET() {
		
			// Return serialized variant offset
			return Uuid.SERIALIZED_VERSION_OFFSET + Uuid.THIRD_SECTION_SERIALIZED_LENGTH + Uuid.SECTION_SEPARATOR["length"];
		}
		
		// Variant zero bitmask
		static get VARIANT_ZERO_BITMASK() {
		
			// Return variant zero bitmask
			return 0b1000;
		}
		
		// Variant zero bitmask result
		static get VARIANT_ZERO_BITMASK_RESULT() {
		
			// Return variant zero bitmask result
			return 0b0000;
		}
		
		// Variant one bitmask
		static get VARIANT_ONE_BITMASK() {
		
			// Return variant one bitmask
			return 0b1100;
		}
		
		// Variant one bitmask result
		static get VARIANT_ONE_BITMASK_RESULT() {
		
			// Return variant one bitmask result
			return 0b1000;
		}
		
		// Variant two bitmask
		static get VARIANT_TWO_BITMASK() {
		
			// Return variant two bitmask
			return 0b1110;
		}
		
		// Variant two bitmask result
		static get VARIANT_TWO_BITMASK_RESULT() {
		
			// Return variant two bitmask result
			return 0b1100;
		}
		
		// Version one
		static get VERSION_ONE() {
		
			// Return version one
			return 1;
		}
		
		// Version two
		static get VERSION_TWO() {
		
			// Return version two
			return 2;
		}
		
		// Version three
		static get VERSION_THREE() {
		
			// Return version three
			return 3;
		}
		
		// Version four
		static get VERSION_FOUR() {
		
			// Return version four
			return 4;
		}
		
		// Version five
		static get VERSION_FIVE() {
		
			// Return version five
			return 5;
		}
		
		// Minimum version
		static get MINIMUM_VERSION() {
		
			// Return minimum version
			return Uuid.VERSION_ONE;
		}
		
		// Maximum version
		static get MAXIMUM_VERSION() {
		
			// Return maximum version
			return Uuid.VERSION_FIVE;
		}
	
		// Variant zero
		static get VARIANT_ZERO() {
		
			// Return variant zero
			return 0;
		}
		
		// Variant one
		static get VARIANT_ONE() {
		
			// Return variant one
			return 1;
		}
		
		// Variant two
		static get VARIANT_TWO() {
		
			// Return variant two
			return 2;
		}
}


// Main function

// Set global object's UUID
globalThis["Uuid"] = Uuid;
