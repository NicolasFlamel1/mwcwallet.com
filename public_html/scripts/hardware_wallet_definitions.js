// Use strict
"use strict";


// Classes

// Hardware wallet definitions class
class HardwareWalletDefinitions {

	// Public
		
		// Ledger transport type
		static get LEDGER_TRANSPORT_TYPE() {
		
			// Return Ledger transport type
			return 0;
		}
		
		// Trezor transport type
		static get TREZOR_TRANSPORT_TYPE() {
		
			// Return Trezor type
			return HardwareWalletDefinitions.LEDGER_TRANSPORT_TYPE + 1;
		}
		
		// Ledger get application information message type
		static get LEDGER_GET_APPLICATION_INFORMATION_MESSAGE_TYPE() {
		
			// Return Ledger get application information message type
			return 0xB001;
		}
		
		// Ledger device locked message type
		static get LEDGER_DEVICE_LOCKED_MESSAGE_TYPE() {
		
			// Return Ledger device locked message type
			return 0x5515;
		}
		
		// Ledger success message type
		static get LEDGER_SUCCESS_MESSAGE_TYPE() {
		
			// Return Ledger success message type
			return 0x9000;
		}
		
		// Ledger user rejected message type
		static get LEDGER_USER_REJECTED_MESSAGE_TYPE() {
		
			// Return Ledger user rejected message type
			return 0xB103;
		}
		
		// Ledger app locked message type
		static get LEDGER_APP_LOCKED_MESSAGE_TYPE() {
		
			// Return Ledger app locked message type
			return 0xD102;
		}
		
		// Trezor initialize message type
		static get TREZOR_INITIALIZE_MESSAGE_TYPE() {
		
			// Return Trezor initialize message type
			return 0x0000;
		}
		
		// Trezor success message type
		static get TREZOR_SUCCESS_MESSAGE_TYPE() {
		
			// Return Trezor success message type
			return 0x0002;
		}
		
		// Trezor failure message type
		static get TREZOR_FAILURE_MESSAGE_TYPE() {
		
			// Return Trezor failure message type
			return 0x0003;
		}
		
		// Trezor Load device message type
		static get TREZOR_LOAD_DEVICE_MESSAGE_TYPE() {
		
			// Return Trezor load device message type
			return 0x000D;
		}
		
		// Trezor features message type
		static get TREZOR_FEATURES_MESSAGE_TYPE() {
		
			// Return Trezor features message type
			return 0x0011;
		}
		
		// Trezor pin matrix request message type
		static get TREZOR_PIN_MATRIX_REQUEST_MESSAGE_TYPE() {
		
			// Return Trezor pin matrix request message type
			return 0x0012;
		}

		// Trezor pin matrix acknowledge message type
		static get TREZOR_PIN_MATRIX_ACKNOWLEDGE_MESSAGE_TYPE() {
		
			// Return Trezor pin matrix acknowledge message type
			return 0x0013;
		}
		
		// Trezor lock device message type
		static get TREZOR_LOCK_DEVICE_MESSAGE_TYPE() {
		
			// Return Trezor lock device message type
			return 0x0018;
		}
		
		// Trezor apply settings message type
		static get TREZOR_APPLY_SETTINGS_MESSAGE_TYPE() {
		
			// Return Trezor apply settings message type
			return 0x0019;
		}

		// Trezor button request message type
		static get TREZOR_BUTTON_REQUEST_MESSAGE_TYPE() {
		
			// Return Trezor button request message type
			return 0x001A;
		}

		// Trezor button acknowledge message type
		static get TREZOR_BUTTON_ACKNOWLEDGE_MESSAGE_TYPE() {
		
			// Return Trezor button acknowledge message type
			return 0x001B;
		}
		
		// Trezor passphrase request message type
		static get TREZOR_PASSPHRASE_REQUEST_MESSAGE_TYPE() {
		
			// Return Trezor passphrase request message type
			return 0x0029;
		}
		
		// Trezor passphrase acknowledge message type
		static get TREZOR_PASSPHRASE_ACKNOWLEDGE_MESSAGE_TYPE() {
		
			// Return Trezor passphrase acknowledge message type
			return 0x002A;
		}
		
		// Trezor action canceled failure type
		static get TREZOR_ACTION_CANCELED_FAILURE_TYPE() {
		
			// Return Trezor action canceled failure type
			return 0x04;
		}
		
		// Trezor pin canceled failure type
		static get TREZOR_PIN_CANCELED_FAILURE_TYPE() {
		
			// Return Trezor pin canceled failure type
			return 0x06;
		}
		
		// Trezor pin invalid failure type
		static get TREZOR_PIN_INVALID_FAILURE_TYPE() {
		
			// Return Trezor pin invalid failure type
			return 0x07;
		}
		
		// Trezor passphrase entry button request type
		static get TREZOR_PASSPHRASE_ENTRY_BUTTON_REQUEST_TYPE() {
		
			// Return Trezor passphrase entry button request type
			return 0x13;
		}
		
		// Trezor pin entry button request type
		static get TREZOR_PIN_ENTRY_BUTTON_REQUEST_TYPE() {
		
			// Return Trezor pin entry button request type
			return 0x14;
		}
		
		// MimbleWimble Coin get root public key message type
		static get MIMBLEWIMBLE_COIN_GET_ROOT_PUBLIC_KEY_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin get root public key message type
			return 0xC700;
		}
		
		// MimbleWimble Coin root public key message type
		static get MIMBLEWIMBLE_COIN_ROOT_PUBLIC_KEY_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin root public key message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ROOT_PUBLIC_KEY_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin get address message type
		static get MIMBLEWIMBLE_COIN_GET_ADDRESS_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin get address message type
			return 0xC701;
		}
		
		// MimbleWimble Coin address message type
		static get MIMBLEWIMBLE_COIN_ADDRESS_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin address message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ADDRESS_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin get seed cookie message type
		static get MIMBLEWIMBLE_COIN_GET_SEED_COOKIE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin get seed cookie message type
			return 0xC702;
		}
		
		// MimbleWimble Coin seed cookie message type
		static get MIMBLEWIMBLE_COIN_SEED_COOKIE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin seed cookie message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_SEED_COOKIE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin get commitment message type
		static get MIMBLEWIMBLE_COIN_GET_COMMITMENT_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin get commitment message type
			return 0xC703;
		}
		
		// MimbleWimble Coin commitment message type
		static get MIMBLEWIMBLE_COIN_COMMITMENT_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin commitment message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_COMMITMENT_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin get bulletproof components message type
		static get MIMBLEWIMBLE_COIN_GET_BULLETPROOF_COMPONENTS_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin get bulletproof components message type
			return 0xC704;
		}
		
		// MimbleWimble Coin bulletproof components message type
		static get MIMBLEWIMBLE_COIN_BULLETPROOF_COMPONENTS_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin bulletproof components message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_BULLETPROOF_COMPONENTS_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin verify root public key message type
		static get MIMBLEWIMBLE_COIN_VERIFY_ROOT_PUBLIC_KEY_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin verify root public key message type
			return 0xC705;
		}
		
		// MimbleWimble Coin verify address message type
		static get MIMBLEWIMBLE_COIN_VERIFY_ADDRESS_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin verify address message type
			return 0xC706;
		}
		
		// MimbleWimble Coin start encrypting slate message type
		static get MIMBLEWIMBLE_COIN_START_ENCRYPTING_SLATE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin start encrypting slate message type
			return 0xC707;
		}
		
		// MimbleWimble Coin encrypted slate nonce message type
		static get MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_NONCE_AND_SALT_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin encrypted slate nonce and salt message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_START_ENCRYPTING_SLATE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin continue encrypting slate message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_ENCRYPTING_SLATE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue encrypting slate message type
			return 0xC708;
		}
		
		// MimbleWimble Coin encrypted slate data message type
		static get MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_DATA_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin encrypted slate data message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_ENCRYPTING_SLATE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin finish encrypting slate message type
		static get MIMBLEWIMBLE_COIN_FINISH_ENCRYPTING_SLATE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin finish encrypting slate message type
			return 0xC709;
		}
		
		// MimbleWimble Coin encrypted slate tag and signature message type
		static get MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_TAG_AND_SIGNATURE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin encrypted slate tag and signature message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_ENCRYPTING_SLATE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin start decrypting slate message type
		static get MIMBLEWIMBLE_COIN_START_DECRYPTING_SLATE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin start decrypting slate message type
			return 0xC70A;
		}
		
		// MimbleWimble Coin continue decrypting slate message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_DECRYPTING_SLATE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue decrypting slate message type
			return 0xC70B;
		}
		
		// MimbleWimble Coin decrypted slate data message type
		static get MIMBLEWIMBLE_COIN_DECRYPTED_SLATE_DATA_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin decrypted slate data message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_DECRYPTING_SLATE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin finish decrypting slate message type
		static get MIMBLEWIMBLE_COIN_FINISH_DECRYPTING_SLATE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin finish decrypting slate message type
			return 0xC70C;
		}
		
		// MimbleWimble Coin decrypted slate AES key message type
		static get MIMBLEWIMBLE_COIN_DECRYPTED_SLATE_AES_KEY_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin decrypted slate AES key message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_DECRYPTING_SLATE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin start transaction message type
		static get MIMBLEWIMBLE_COIN_START_TRANSACTION_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin start transaction message type
			return 0xC70D;
		}
		
		// MimbleWimble Coin continue transaction include output message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_INCLUDE_OUTPUT_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue transaction include output message type
			return 0xC70E;
		}
		
		// MimbleWimble Coin continue transaction include input message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_INCLUDE_INPUT_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue transaction include input message type
			return 0xC70F;
		}
		
		// MimbleWimble Coin continue transaction apply offset message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_APPLY_OFFSET_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue transaction apply offset message type
			return 0xC710;
		}
		
		// MimbleWimble Coin transaction secret nonce index message type
		static get MIMBLEWIMBLE_COIN_TRANSACTION_SECRET_NONCE_INDEX_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin transaction secret nonce index message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_APPLY_OFFSET_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin continue transaction get public key message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_KEY_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue transaction get public key message type
			return 0xC711;
		}
		
		// MimbleWimble Coin transaction public key message type
		static get MIMBLEWIMBLE_COIN_TRANSACTION_PUBLIC_KEY_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin transaction public key message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_KEY_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin continue transaction get public nonce message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_NONCE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue transaction get public nonce message type
			return 0xC712;
		}
		
		// MimbleWimble Coin transaction public nonce message type
		static get MIMBLEWIMBLE_COIN_TRANSACTION_PUBLIC_NONCE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin transaction public nonce message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_NONCE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin continue transaction get message signature message type
		static get MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_MESSAGE_SIGNATURE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin continue transaction get message signature message type
			return 0xC713;
		}
		
		// MimbleWimble Coin transaction message signature message type
		static get MIMBLEWIMBLE_COIN_TRANSACTION_MESSAGE_SIGNATURE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin transaction message signature message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_MESSAGE_SIGNATURE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin finish transaction message type
		static get MIMBLEWIMBLE_COIN_FINISH_TRANSACTION_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin finish transaction message type
			return 0xC714;
		}
		
		// MimbleWimble Coin transaction signature and payment proof message type
		static get MIMBLEWIMBLE_COIN_TRANSACTION_SIGNATURE_AND_PAYMENT_PROOF_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin transaction signature and payment proof message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_TRANSACTION_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin get MQS challenge signature message type
		static get MIMBLEWIMBLE_COIN_GET_MQS_CHALLENGE_SIGNATURE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin get MQS challenge signature message type
			return 0xC715;
		}
		
		// MimbleWimble Coin MQS challenge signature message type
		static get MIMBLEWIMBLE_COIN_MQS_CHALLENGE_SIGNATURE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin MQS challenge signature message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_MQS_CHALLENGE_SIGNATURE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
		
		// MimbleWimble Coin get login challenge signature message type
		static get MIMBLEWIMBLE_COIN_GET_LOGIN_CHALLENGE_SIGNATURE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin get login challenge signature message type
			return 0xC716;
		}
		
		// MimbleWimble Coin login challenge signature message type
		static get MIMBLEWIMBLE_COIN_LOGIN_CHALLENGE_SIGNATURE_MESSAGE_TYPE() {
		
			// Return MimbleWimble Coin login challenge signature message type
			return HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_LOGIN_CHALLENGE_SIGNATURE_MESSAGE_TYPE | HardwareWalletDefinitions.MESSAGE_RESPONSE_MASK;
		}
	
		// Schema
		static get SCHEMA() {
		
			// Return schema
			return {
			
				// Trezor success
				[HardwareWalletDefinitions.TREZOR_SUCCESS_MESSAGE_TYPE.toFixed()]: {},
				
				// Trezor failure
				[HardwareWalletDefinitions.TREZOR_FAILURE_MESSAGE_TYPE.toFixed()]: {
				
					// Failure type
					"1": {
					
						// Name
						"Name": "Failure Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					}
				},
				
				// Trezor load device
				[HardwareWalletDefinitions.TREZOR_LOAD_DEVICE_MESSAGE_TYPE.toFixed()]: {
				
					// Mnemonic
					"1": {
					
						// Name
						"Name": "Mnemonic",
						
						// Type
						"Type": ProtocolBuffers.STRING_SCHEMA_DATA_TYPE
					},
					
					// Pin
					"3": {
					
						// Name
						"Name": "Pin",
						
						// Type
						"Type": ProtocolBuffers.STRING_SCHEMA_DATA_TYPE
					}
				},
				
				// Trezor features
				[HardwareWalletDefinitions.TREZOR_FEATURES_MESSAGE_TYPE.toFixed()]: {
				
					// Major version
					"2": {
					
						// Name
						"Name": "Major Version",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Minor version
					"3": {
					
						// Name
						"Name": "Minor Version",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Patch version
					"4": {
					
						// Name
						"Name": "Patch Version",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Pin protection
					"7": {
					
						// Name
						"Name": "Pin Protection",
						
						// Type
						"Type": ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE
					},
					
					// Passphrase protection
					"8": {
					
						// Name
						"Name": "Passphrase Protection",
						
						// Type
						"Type": ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE
					},
					
					// Initialized
					"12": {
					
						// Name
						"Name": "Initialized",
						
						// Type
						"Type": ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE
					},
					
					// Unlocked
					"16": {
					
						// Name
						"Name": "Unlocked",
						
						// Type
						"Type": ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE
					},
					
					// Model
					"21": {
					
						// Name
						"Name": "Model",
						
						// Type
						"Type": ProtocolBuffers.STRING_SCHEMA_DATA_TYPE
					},
					
					// Capabilities
					"30": {
					
						// Name
						"Name": "Capabilities",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Passphrase always on device
					"36": {
					
						// Name
						"Name": "Passphrase Always On Device",
						
						// Type
						"Type": ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE
					}
				},
				
				// Trezor pin matrix acknowledge
				[HardwareWalletDefinitions.TREZOR_PIN_MATRIX_ACKNOWLEDGE_MESSAGE_TYPE.toFixed()]: {
				
					// Pin
					"1": {
					
						// Name
						"Name": "Pin",
						
						// Type
						"Type": ProtocolBuffers.STRING_SCHEMA_DATA_TYPE
					}
				},
				
				// Trezor apply settings request
				[HardwareWalletDefinitions.TREZOR_APPLY_SETTINGS_MESSAGE_TYPE.toFixed()]: {
				
					// Use passphrase
					"3": {
					
						// Name
						"Name": "Use Passphrase",
						
						// Type
						"Type": ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE
					},
					
					// Passphrase always on device
					"8": {
					
						// Name
						"Name": "Passphrase Always On Device",
						
						// Type
						"Type": ProtocolBuffers.BOOL_SCHEMA_DATA_TYPE
					}
				},
				
				// Trezor button request
				[HardwareWalletDefinitions.TREZOR_BUTTON_REQUEST_MESSAGE_TYPE.toFixed()]: {
				
					// Button request type
					"1": {
					
						// Name
						"Name": "Button Request Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					}
				},
				
				// Trezor passphrase acknowledge
				[HardwareWalletDefinitions.TREZOR_PASSPHRASE_ACKNOWLEDGE_MESSAGE_TYPE.toFixed()]: {
				
					// Passphrase
					"1": {
					
						// Name
						"Name": "Passphrase",
						
						// Type
						"Type": ProtocolBuffers.STRING_SCHEMA_DATA_TYPE
					}
				},
				
				// MimbleWimble Coin get root public key
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ROOT_PUBLIC_KEY_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					}
				},
				
				// MimbleWimble Coin root public key
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ROOT_PUBLIC_KEY_MESSAGE_TYPE.toFixed()]: {
				
					// Root public key
					"1": {
					
						// Name
						"Name": "Root Public Key",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},
				
				// MimbleWimble Coin get address
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_ADDRESS_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Address type
					"3": {
					
						// Name
						"Name": "Parameter One",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"4": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Index
					"5": {
					
						// Name
						"Name": "Index",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					}
				},
				
				// MimbleWimble Coin address
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ADDRESS_MESSAGE_TYPE.toFixed()]: {
				
					// Address
					"1": {
					
						// Name
						"Name": "Address",
						
						// Type
						"Type": ProtocolBuffers.STRING_SCHEMA_DATA_TYPE
					}
				},
				
				// MimbleWimble Coin get seed cookie
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_SEED_COOKIE_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					}
				},
				
				// MimbleWimble Coin seed cookie
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_SEED_COOKIE_MESSAGE_TYPE.toFixed()]: {
				
					// Seed cookie
					"1": {
					
						// Name
						"Name": "Seed Cookie",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},
				
				// MimbleWimble Coin get commitment
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_COMMITMENT_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Identifier
					"4": {
					
						// Name
						"Name": "Identifier",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Value
					"5": {
					
						// Name
						"Name": "Value",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Switch type
					"6": {
					
						// Name
						"Name": "Switch Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin commitment
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_COMMITMENT_MESSAGE_TYPE.toFixed()]: {
				
					// Commitment
					"1": {
					
						// Name
						"Name": "Commitment",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin get bulletproof components
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_BULLETPROOF_COMPONENTS_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Message type
					"3": {
					
						// Name
						"Name": "Parameter One",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"4": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Identifier
					"5": {
					
						// Name
						"Name": "Identifier",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Value
					"6": {
					
						// Name
						"Name": "Value",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Switch type
					"7": {
					
						// Name
						"Name": "Switch Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin bulletproof components
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_BULLETPROOF_COMPONENTS_MESSAGE_TYPE.toFixed()]: {
				
					// Tau x
					"1": {
					
						// Name
						"Name": "Tau X",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// T one
					"2": {
					
						// Name
						"Name": "T One",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// T two
					"3": {
					
						// Name
						"Name": "T Two",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin verify root public key
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_VERIFY_ROOT_PUBLIC_KEY_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					}
				},

				// MimbleWimble Coin verify address
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_VERIFY_ADDRESS_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Address type
					"3": {
					
						// Name
						"Name": "Parameter One",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"4": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Index
					"5": {
					
						// Name
						"Name": "Index",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					}
				},

				// MimbleWimble Coin start encrypting slate
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_START_ENCRYPTING_SLATE_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Index
					"4": {
					
						// Name
						"Name": "Index",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Recipient address
					"5": {
					
						// Name
						"Name": "Recipient Address",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin encrypted slate nonce
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_NONCE_AND_SALT_MESSAGE_TYPE.toFixed()]: {
				
					// Nonce
					"1": {
					
						// Name
						"Name": "Nonce",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Salt
					"2": {
					
						// Name
						"Name": "Salt",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin continue encrypting slate
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_ENCRYPTING_SLATE_MESSAGE_TYPE.toFixed()]: {
				
					// Data
					"1": {
					
						// Name
						"Name": "Data",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin encrypted slate data
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_DATA_MESSAGE_TYPE.toFixed()]: {
				
					// Encrypted data
					"1": {
					
						// Name
						"Name": "Encrypted Data",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin finish encrypting slate
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_ENCRYPTING_SLATE_MESSAGE_TYPE.toFixed()]: {},

				// MimbleWimble Coin encrypted slate tag and signature
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_ENCRYPTED_SLATE_TAG_AND_SIGNATURE_MESSAGE_TYPE.toFixed()]: {
				
					// Tag
					"1": {
					
						// Name
						"Name": "Tag",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// MQS message signature
					"2": {
					
						// Name
						"Name": "MQS Message Signature",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin start decrypting slate
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_START_DECRYPTING_SLATE_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Index
					"4": {
					
						// Name
						"Name": "Index",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Nonce
					"5": {
					
						// Name
						"Name": "Nonce",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Sender address or ephemeral X25519 public key
					"6": {
					
						// Name
						"Name": "Sender Address Or Ephemeral X25519 Public Key",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Salt or encrypted file key
					"7": {
					
						// Name
						"Name": "Salt Or Encrypted File Key",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					},
					
					// Payload nonce
					"8": {
					
						// Name
						"Name": "Payload Nonce",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin continue decrypting slate
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_DECRYPTING_SLATE_MESSAGE_TYPE.toFixed()]: {
				
					// Encrypted data
					"1": {
					
						// Name
						"Name": "Encrypted Data",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin decrypted slate data
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_DECRYPTED_SLATE_DATA_MESSAGE_TYPE.toFixed()]: {
				
					// Data
					"1": {
					
						// Name
						"Name": "Data",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin finish decrypting slate
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_DECRYPTING_SLATE_MESSAGE_TYPE.toFixed()]: {
				
					// Tag
					"1": {
					
						// Name
						"Name": "Tag",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin decrypted slate AES key
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_DECRYPTED_SLATE_AES_KEY_MESSAGE_TYPE.toFixed()]: {
				
					// AES key
					"1": {
					
						// Name
						"Name": "AES Key",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin start transaction
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_START_TRANSACTION_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Index
					"4": {
					
						// Name
						"Name": "Index",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Output
					"5": {
					
						// Name
						"Name": "Output",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Input
					"6": {
					
						// Name
						"Name": "Input",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Fee
					"7": {
					
						// Name
						"Name": "Fee",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Secret nonce index
					"8": {
					
						// Name
						"Name": "Secret Nonce Index",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Address
					"9": {
					
						// Name
						"Name": "Address",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin continue transaction include output
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_INCLUDE_OUTPUT_MESSAGE_TYPE.toFixed()]: {
				
					// Identifier
					"1": {
					
						// Name
						"Name": "Identifier",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Value
					"2": {
					
						// Name
						"Name": "Value",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Switch type
					"3": {
					
						// Name
						"Name": "Switch Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin continue transaction include input
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_INCLUDE_INPUT_MESSAGE_TYPE.toFixed()]: {
				
					// Identifier
					"1": {
					
						// Name
						"Name": "Identifier",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Value
					"2": {
					
						// Name
						"Name": "Value",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Switch type
					"3": {
					
						// Name
						"Name": "Switch Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin continue transaction apply offset
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_APPLY_OFFSET_MESSAGE_TYPE.toFixed()]: {
				
					// Offset
					"1": {
					
						// Name
						"Name": "Offset",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin transaction secret nonce index
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_SECRET_NONCE_INDEX_MESSAGE_TYPE.toFixed()]: {
				
					// Secret nonce index
					"1": {
					
						// Name
						"Name": "Secret Nonce Index",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin continue transaction get public key
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_KEY_MESSAGE_TYPE.toFixed()]: {},

				// MimbleWimble Coin transaction public key
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_PUBLIC_KEY_MESSAGE_TYPE.toFixed()]: {
				
					// Public key
					"1": {
					
						// Name
						"Name": "Public Key",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin continue transaction get public nonce
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_PUBLIC_NONCE_MESSAGE_TYPE.toFixed()]: {},

				// MimbleWimble Coin transaction public nonce
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_PUBLIC_NONCE_MESSAGE_TYPE.toFixed()]: {
				
					// Public nonce
					"1": {
					
						// Name
						"Name": "Public Nonce",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin continue transaction get message signature
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_CONTINUE_TRANSACTION_GET_MESSAGE_SIGNATURE_MESSAGE_TYPE.toFixed()]: {
				
					// Message
					"1": {
					
						// Name
						"Name": "Message",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin transaction message signature
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_MESSAGE_SIGNATURE_MESSAGE_TYPE.toFixed()]: {
				
					// Message signature
					"1": {
					
						// Name
						"Name": "Message Signature",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin finish transaction
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_FINISH_TRANSACTION_MESSAGE_TYPE.toFixed()]: {
				
					// Address type
					"1": {
					
						// Name
						"Name": "Parameter One",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Public nonce
					"2": {
					
						// Name
						"Name": "Public Nonce",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Public key
					"3": {
					
						// Name
						"Name": "Public Key",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Kernel information
					"4": {
					
						// Name
						"Name": "Kernel Information",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Kernel commitment
					"5": {
					
						// Name
						"Name": "Kernel Commitment",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					},
					
					// Payment proof
					"6": {
					
						// Name
						"Name": "Payment Proof",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin transaction signature and payment proof
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_TRANSACTION_SIGNATURE_AND_PAYMENT_PROOF_MESSAGE_TYPE.toFixed()]: {
				
					// Signature
					"1": {
					
						// Name
						"Name": "Signature",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Payment proof
					"2": {
					
						// Name
						"Name": "Payment Proof",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin get MQS challenge signature
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_MQS_CHALLENGE_SIGNATURE_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Index
					"4": {
					
						// Name
						"Name": "Index",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Timestamp
					"5": {
					
						// Name
						"Name": "Timestamp",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64,
						
						// Optional
						"Optional": true
					},
					
					// Time zone offset
					"6": {
					
						// Name
						"Name": "Time Zone Offset",
						
						// Type
						"Type": ProtocolBuffers.SINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT16,
						
						// Optional
						"Optional": true
					}
				},

				// MimbleWimble Coin MQS challenge signature
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_MQS_CHALLENGE_SIGNATURE_MESSAGE_TYPE.toFixed()]: {
				
					// MQS challenge signature
					"1": {
					
						// Name
						"Name": "MQS Challenge Signature",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},
				
				// MimbleWimble Coin get login challenge signature
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_GET_LOGIN_CHALLENGE_SIGNATURE_MESSAGE_TYPE.toFixed()]: {
				
					// Coin type
					"1": {
					
						// Name
						"Name": "Coin Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Network type
					"2": {
					
						// Name
						"Name": "Network Type",
						
						// Type
						"Type": ProtocolBuffers.ENUM_SCHEMA_DATA_TYPE
					},
					
					// Account
					"3": {
					
						// Name
						"Name": "Account",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT32
					},
					
					// Timestamp
					"4": {
					
						// Name
						"Name": "Timestamp",
						
						// Type
						"Type": ProtocolBuffers.UINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT64
					},
					
					// Time zone offset
					"5": {
					
						// Name
						"Name": "Time Zone Offset",
						
						// Type
						"Type": ProtocolBuffers.SINT_SCHEMA_DATA_TYPE,
						
						// Size
						"Size": Common.BYTES_IN_A_UINT16
					},
					
					// Identifier
					"6": {
					
						// Name
						"Name": "Identifier",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				},

				// MimbleWimble Coin login challenge signature
				[HardwareWalletDefinitions.MIMBLEWIMBLE_COIN_LOGIN_CHALLENGE_SIGNATURE_MESSAGE_TYPE.toFixed()]: {
				
					// Login public key
					"1": {
					
						// Name
						"Name": "Login Public Key",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					},
					
					// Login challenge signature
					"2": {
					
						// Name
						"Name": "Login Challenge Signature",
						
						// Type
						"Type": ProtocolBuffers.BYTES_SCHEMA_DATA_TYPE
					}
				}
			};
		}
		
		// Ledger ignore field names
		static get LEDGER_IGNORE_FIELD_NAMES() {
		
			// Return Ledger ignore field names
			return [
			
				// Coin type
				"Coin Type",
				
				// Network type
				"Network Type",
				
				// Parameter one
				"Parameter One",
				
				// Parameter Two
				"Parameter Two"
			];
		}
	
	// Private
	
		// Message response mask
		static get MESSAGE_RESPONSE_MASK() {
		
			// Return message response mask
			return 0x80;
		}
}


// Main function

// Set global object's hardware wallet definitions
globalThis["HardwareWalletDefinitions"] = HardwareWalletDefinitions;
