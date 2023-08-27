// Use strict
"use strict";


// Classes

// Protocol Buffers class
class ProtocolBuffers {

	// Public
	
		// Decode
		static decode(messageType, data, schema) {
		
			// Check if schema for message type isn't known
			if(messageType.toFixed() in schema === false) {
			
				// Throw error
				throw "Schema for message type isn't known.";
			}
			
			// Get message schema
			var messageSchema = schema[messageType.toFixed()];
			
			// Initialize result
			var result = {};
			
			// Go through all fields in the data
			for(var i = 0; i < data["length"];) {
			
				// Get field tag
				var fieldTag = ProtocolBuffers.decodeVarint(data, i);
				
				// Go to start of the field payload
				i += ProtocolBuffers.getVarintLength(data, i);
				
				// Check if field tag is too big
				if(fieldTag > Number.MAX_SAFE_INTEGER) {
				
					// Throw error
					throw "Field tag is too big.";
				}
				
				// Get field number
				var fieldNumber = fieldTag.toNumber() >>> 3;
				
				// Get field wire type
				var fieldWireType = fieldTag.toNumber() & 0b111;
				
				// Check if field is known in the message schema
				if(fieldNumber.toFixed() in messageSchema === true) {
				
					// Check field's expected type
					switch(messageSchema[fieldNumber.toFixed()]["Type"]) {
					
						// Uint, bool, enum, or sint
						case ProtocolBuffers.UINT_SCHEMA_DATA_TYPE:
						case ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE:
						case ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE:
						case ProtocolBuffers.SINT_SCHEMA_DATA_TYPE:
						
							// Check if field wire type isn't correct
							if(fieldWireType !== ProtocolBuffers.VARINT_WIRE_TYPE) {
							
								// Throw error
								throw "Field wire type isn't correct.";
							}
						
							// Break
							break;
						
						// String or bytes
						case ProtocolBuffers.STRING_SCHEMA_DATA_TYPE:
						case ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE:
						
							// Check if field wire type isn't correct
							if(fieldWireType !== ProtocolBuffers.LEN_WIRE_TYPE) {
							
								// Throw error
								throw "Field wire type isn't correct.";
							}
						
							// Break
							break;
					}
					
					// Check if field doesn't exist in the result
					if(messageSchema[fieldNumber.toFixed()]["Name"] in result === false) {
					
						// Create field in result
						result[messageSchema[fieldNumber.toFixed()]["Name"]] = [];			
					}				
				}
				
				// Check field wire type
				switch(fieldWireType) {
				
					// Varint
					case ProtocolBuffers.VARINT_WIRE_TYPE:
					
						// Check if field is known in the message schema
						if(fieldNumber.toFixed() in messageSchema === true) {
						
							// Get value from the field payload
							var value = ProtocolBuffers.decodeVarint(data, i);
							
							// Check field's expected type
							switch(messageSchema[fieldNumber.toFixed()]["Type"]) {
							
								// Uint
								case ProtocolBuffers.UINT_SCHEMA_DATA_TYPE:
						
									// Append value to result
									result[messageSchema[fieldNumber.toFixed()]["Name"]].push(value);
									
									// Break
									break;
								
								// Bool
								case ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE:
						
									// Append value as a boolean to result
									result[messageSchema[fieldNumber.toFixed()]["Name"]].push(value.isZero() === false);
									
									// Break
									break;
								
								// Enum
								case ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE:
								
									// Check if value is too big
									if(value > Number.MAX_SAFE_INTEGER) {
									
										// Throw error
										throw "Value is too big.";
									}
						
									// Append value as an enum to result
									result[messageSchema[fieldNumber.toFixed()]["Name"]].push(value.toNumber());
									
									// Break
									break;
								
								// Sint
								case ProtocolBuffers.SINT_SCHEMA_DATA_TYPE:
								
									// Get if value is even
									if(value.modulo(2).isZero() === true) {
						
										// Append value as a positive number to result
										result[messageSchema[fieldNumber.toFixed()]["Name"]].push(value.dividedToIntegerBy(2));
									}
									
									// Otherwise
									else {
									
										// Append value as a negative number to result
										result[messageSchema[fieldNumber.toFixed()]["Name"]].push(value.plus(1).dividedToIntegerBy(-2));
									}
									
									// Break
									break;
							}
						}
						
						// Go to next field
						i += ProtocolBuffers.getVarintLength(data, i);
						
						// Break
						break;
					
					// I64
					case ProtocolBuffers.I64_WIRE_TYPE:
					
						// Check if field payload doesn't contain data
						if(i + Common.BYTES_IN_A_UINT64 > data["length"]) {
						
							// Throw error
							throw "Field payload doesn't contain data.";
						}
						
						// Go to next field
						i += Common.BYTES_IN_A_UINT64;
						
						// Break
						break;
					
					// Len
					case ProtocolBuffers.LEN_WIRE_TYPE:
					
						// Get length from the field payload
						var length = ProtocolBuffers.decodeVarint(data, i);
						
						// Go to the field payload's data
						i += ProtocolBuffers.getVarintLength(data, i);
						
						// Check if length is too big
						if(length > Number.MAX_SAFE_INTEGER) {
						
							// Throw error
							throw "Length is too big.";
						}
					
						// Check if field payload doesn't contain data
						if(i + length.toNumber() > data["length"]) {
						
							// Throw error
							throw "Field payload doesn't contain data.";
						}
						
						// Check if field is known in the message schema
						if(fieldNumber.toFixed() in messageSchema === true) {
						
							// Get value from the field payload's data
							var value = data.subarray(i, i + length.toNumber());
							
							// Check field's expected type
							switch(messageSchema[fieldNumber.toFixed()]["Type"]) {
							
								// String
								case ProtocolBuffers.STRING_SCHEMA_DATA_TYPE:
								
									// Append value as a string to result
									result[messageSchema[fieldNumber.toFixed()]["Name"]].push((new TextDecoder("utf-8", {"fatal": true})).decode(value));
								
									// Break
									break;
								
								// Bytes
								case ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE:
								
									// Append value to result
									result[messageSchema[fieldNumber.toFixed()]["Name"]].push(value);
								
									// Break
									break;
							}
						}
						
						// Go to next field
						i += length.toNumber();
						
						// Break
						break;
					
					// I32
					case ProtocolBuffers.I32_WIRE_TYPE:
					
						// Check if field payload doesn't contain data
						if(i + Common.BYTES_IN_A_UINT32 > data["length"]) {
						
							// Throw error
							throw "Field payload doesn't contain data.";
						}
						
						// Go to next field
						i += Common.BYTES_IN_A_UINT32;
						
						// Break
						break;
					
					// Default
					default:
					
						// Throw error
						throw "Field wire type isn't known.";
				}
			}
			
			// Return result
			return result;
		}
		
		// Encode
		static encode(messageType, data, schema) {
		
			// Check if schema for message type isn't known
			if(messageType.toFixed() in schema === false) {
			
				// Throw error
				throw "Schema for message type isn't known.";
			}
			
			// Get message schema
			var messageSchema = schema[messageType.toFixed()];
			
			// Initialize result
			var result = new Uint8Array([]);
			
			// Go through all values in the data
			for(var name in data) {
						
				if(data.hasOwnProperty(name) === true) {
				
					// Initialize value found
					var valueFound = false;
				
					// Go through all fields in the message schema
					for(var fieldNumber in messageSchema) {
					
						if(messageSchema.hasOwnProperty(fieldNumber) === true) {
						
							// Check if field is for the value
							if(messageSchema[fieldNumber]["Name"] === name) {
							
								// Set value found
								valueFound = true;
								
								// Check field's type
								switch(messageSchema[fieldNumber]["Type"]) {
								
									// Uint
									case ProtocolBuffers.UINT_SCHEMA_DATA_TYPE:
									
										// Check if value type isn't correct
										if(data[name] instanceof BigNumber === false) {
										
											// Throw error
											throw "Value's type isn't correct.";
										}
										
										// Set field wire type
										var fieldWireType = ProtocolBuffers.VARINT_WIRE_TYPE;
										
										// Set field payload
										var fieldPayload = ProtocolBuffers.encodeVarint(data[name]);
									
										// Break
										break;
										
									// Bool
									case ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE:
									
										// Check if value type isn't correct
										if(typeof data[name] !== "boolean") {
										
											// Throw error
											throw "Value's type isn't correct.";
										}
										
										// Set field wire type
										var fieldWireType = ProtocolBuffers.VARINT_WIRE_TYPE;
										
										// Set field payload
										var fieldPayload = ProtocolBuffers.encodeVarint(new BigNumber((data[name] === true) ? 1 : 0));
									
										// Break
										break;
										
									// Enum
									case ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE:
									
										// Check if value type isn't correct
										if(typeof data[name] !== "number") {
										
											// Throw error
											throw "Value's type isn't correct.";
										}
										
										// Set field wire type
										var fieldWireType = ProtocolBuffers.VARINT_WIRE_TYPE;
										
										// Set field payload
										var fieldPayload = ProtocolBuffers.encodeVarint(new BigNumber(data[name]));
									
										// Break
										break;
									
									// String
									case ProtocolBuffers.STRING_SCHEMA_DATA_TYPE:
									
										// Check if value's type isn't correct
										if(typeof data[name] !== "string") {
										
											// Throw error
											throw "Value's type isn't correct.";
										}
										
										// Set field wire type
										var fieldWireType = ProtocolBuffers.LEN_WIRE_TYPE;
										
										// Set field payload
										var fieldPayload = Common.mergeArrays([
										
											// Length
											ProtocolBuffers.encodeVarint(new BigNumber(data[name]["length"])),
											
											// Data
											(new TextEncoder()).encode(data[name])
										]);
										
										// Break
										break;
									
									// Bytes
									case ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE:
									
										// Check if value's type isn't correct
										if(data[name] instanceof Uint8Array === false) {
										
											// Throw error
											throw "Value's type isn't correct.";
										}
										
										// Check if no data exists and data is optional
										if(data[name]["length"] === 0 && "Optional" in messageSchema[fieldNumber] === true && messageSchema[fieldNumber]["Optional"] === true) {
										
											// Clear value found
											valueFound = false;
										}
										
										// Otherwise
										else {
										
											// Set field wire type
											var fieldWireType = ProtocolBuffers.LEN_WIRE_TYPE;
											
											// Set field payload
											var fieldPayload = Common.mergeArrays([
											
												// Length
												ProtocolBuffers.encodeVarint(new BigNumber(data[name]["length"])),
												
												// Data
												data[name]
											]);
										}
									
										// Break
										break;
									
									// Sint
									case ProtocolBuffers.SINT_SCHEMA_DATA_TYPE:
									
										// Check if value type isn't correct
										if(data[name] instanceof BigNumber === false) {
										
											// Throw error
											throw "Value's type isn't correct.";
										}
										
										// Set field wire type
										var fieldWireType = ProtocolBuffers.VARINT_WIRE_TYPE;
										
										// Check if value is positive
										if(data[name].isPositive() === true) {
										
											// Set field payload
											var fieldPayload = ProtocolBuffers.encodeVarint(data[name].multipliedBy(2));
										}
										
										// Otherwise
										else {
										
											// Set field payload
											var fieldPayload = ProtocolBuffers.encodeVarint(data[name].multipliedBy(-2).minus(1));
										}
									
										// Break
										break;
								}
								
								// Break
								break;
							}
						}
					}
					
					// Check if value was found in message schema
					if(valueFound === true) {
					
						// Set field tag
						var fieldTag = ProtocolBuffers.encodeVarint(new BigNumber((fieldNumber << 3) | fieldWireType));
						
						// Append field tag and field payload to the result
						result = Common.mergeArrays([
						
							// Result
							result,
							
							// Field tag
							fieldTag,
							
							// Field payload
							fieldPayload
						]);
					}
				}
			}
			
			// Return result
			return result;
		}
		
		// Uint schema data type
		static get UINT_SCHEMA_DATA_TYPE() {
		
			// Return uint data type
			return 0;
		}
		
		// Bool schema data type
		static get BOOL_SCHEMA_DATA_TYPE() {
		
			// Return bool data type
			return ProtocolBuffers.UINT_SCHEMA_DATA_TYPE + 1;
		}
		
		// Enum schema data type
		static get ENUM_SCHEMA_DATA_TYPE() {
		
			// Return enum data type
			return ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE + 1;
		}
		
		// String schema data type
		static get STRING_SCHEMA_DATA_TYPE() {
		
			// Return string data type
			return ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE + 1;
		}
		
		// Bytes schema data type
		static get BYTES_SCHEMA_DATA_TYPE() {
		
			// Return bytes data type
			return ProtocolBuffers.STRING_SCHEMA_DATA_TYPE + 1;
		}
		
		// Sint schema data type
		static get SINT_SCHEMA_DATA_TYPE() {
		
			// Return sint data type
			return ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE + 1;
		}
	
	// Private
	
		// Decode varint
		static decodeVarint(data, offset) {
		
			// Initialize payloads
			var payloads = [];
		
			// Loop through all bytes in the varint
			do {
			
				// Check if data doesn't contain a varint
				if(offset >= data["length"]) {
				
					// Throw error
					throw "Data doesn't contain a varint.";
				}
			
				// Get if continuation bit is set
				var continuationBitSet = (data[offset] & 0b10000000) !== 0;
				
				// Append payload to list
				payloads.unshift(data[offset] & 0b01111111);
				
				// Increment offset
				++offset;
			
			} while(continuationBitSet === true);
			
			// Create bit writer
			var bitWriter = new BitWriter();
			
			// Add padding bits to bit writer
			bitWriter.setBits(0, payloads["length"] % Common.BITS_IN_A_BYTE);
			
			// Go through all payloads
			for(var i = 0; i < payloads["length"]; ++i) {
			
				// Add payload to the bit writer
				bitWriter.setBits(payloads[i], 7);
			}
			
			// Return number value of the bit writer's bytes
			return new BigNumber(Common.HEX_PREFIX + Common.toHexString(bitWriter.getBytes()));
		}
		
		// Get varint length
		static getVarintLength(data, offset) {
		
			// Initialize length
			var length = 0;
		
			// Loop through all bytes in the varint
			do {
			
				// Check if data doesn't contain a varint
				if(offset + length >= data["length"]) {
				
					// Throw error
					throw "Data doesn't contain a varint.";
				}
			
				// Get if continuation bit is set
				var continuationBitSet = (data[offset + length] & 0b10000000) !== 0;
				
				// Increment length
				++length;
			
			} while(continuationBitSet === true);
			
			// Return length
			return length;
		}
		
		// Encode varint
		static encodeVarint(value) {
		
			// Get value as bytes
			var bytes = value.toBytes(BigNumber.BIG_ENDIAN);
			
			// Initialize result
			var result = (new Uint8Array((bytes["length"] > 1 || bytes[0] >= 0b10000000) ? Math.ceil(bytes["length"] * Common.BITS_IN_A_BYTE / 7) : bytes["length"])).fill(0);
			
			// Initialize bit reader with the bytes
			var bitReader = new BitReader(bytes);
			
			// Go through all bytes in the result
			for(var i = result["length"] - 1; i >= 0; --i) {
			
				// Set byte's continuation bit
				result[i] |= (i === result["length"] - 1) ? 0b00000000 : 0b10000000;
				
				// Check if bytes can be encoded in one payload
				if(bytes["length"] === 1 && bytes[0] < 0b10000000) {
				
					// Set byte's payload
					result[i] |= bitReader.getBits(8);
				}
				
				// Otherwise check at the ending byte and a fewer than seven bits remain
				else if(i === result["length"] - 1 && bytes["length"] * Common.BITS_IN_A_BYTE % 7 !== 0) {
				
					// Set byte's payload
					result[i] |= bitReader.getBits(bytes["length"] * Common.BITS_IN_A_BYTE % 7);
				}
				
				// Otherwise
				else {
				
					// Set byte's payload
					result[i] |= bitReader.getBits(7);
				}
			}
			
			// Return result
			return result;
		}
		
		// Varint wire type
		static get VARINT_WIRE_TYPE() {
		
			// Return varint wire type
			return 0;
		}
		
		// I64 wire type
		static get I64_WIRE_TYPE() {
		
			// Return i64 wire type
			return ProtocolBuffers.VARINT_WIRE_TYPE + 1;
		}
		
		// Len wire type
		static get LEN_WIRE_TYPE() {
		
			// Return len wire type
			return ProtocolBuffers.I64_WIRE_TYPE + 1;
		}
		
		// Sgroup wire type
		static get SGROUP_WIRE_TYPE() {
		
			// Return sgroup wire type
			return ProtocolBuffers.LEN_WIRE_TYPE + 1;
		}
		
		// Egroup wire type
		static get EGROUP_WIRE_TYPE() {
		
			// Return egroup wire type
			return ProtocolBuffers.SGROUP_WIRE_TYPE + 1;
		}
		
		// I32 wire type
		static get I32_WIRE_TYPE() {
		
			// Return i32 wire type
			return ProtocolBuffers.EGROUP_WIRE_TYPE + 1;
		}
}


// Main function

// Set global object's Protocol Buffers
globalThis["ProtocolBuffers"] = ProtocolBuffers;
