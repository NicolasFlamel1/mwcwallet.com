// Use strict
"use strict";


// Classes

// ProtocolHandler class
class ProtocolHandler {

	// Public

		// Register
		static register() {
		
			// Check if not an app and not loading from a file
			if(Common.isApp() === false && location["protocol"] !== Common.FILE_PROTOCOL) {
		
				// Check if can register protocol handler
				if(typeof navigator === "object" && navigator !== null && "registerProtocolHandler" in navigator === true) {
				
					// Go through all protocols
					for(var i = 0; i < ProtocolHandler.PROTOCOLS["length"]; ++i) {
					
						// Get protocol
						var protocol = ProtocolHandler.PROTOCOLS[i];
				
						// Try
						try {
						
							// Register protocol handler
							navigator.registerProtocolHandler(protocol, ProtocolHandler.HANDLER_URL, Language.getTranslation('MWC Wallet'));
						}
						
						// Catch errors
						catch(error) {
						
						}
					}
				}
			}
		}
		
		// Standardize URL protocol
		static standardizeUrlProtocol(url) {
		
			// Try
			try {
			
				// Parse URL
				var parsedUrl = new URL(url);
			}
			
			// Catch errors
			catch(error) {
			
				// Return URL
				return url;
			}
			
			// Check if URL's protocol is being handled
			if(ProtocolHandler.PROTOCOLS.map(function(protocol) {
			
				// Return protocol
				return protocol + ":";
				
			}).indexOf(parsedUrl["protocol"]) !== Common.INDEX_NOT_FOUND) {
			
				// Return standard URL
				return Common.ltrim(url).substring(ProtocolHandler.PROTOCOLS_PREFIX["length"]);
			}
			
			// Otherwise
			else {
			
				// Return URL
				return url;
			}
		}
	
	// Private
	
		// Protocols prefix
		static get PROTOCOLS_PREFIX() {
		
			// Check wallet type
			switch(Consensus.getWalletType()) {
			
				// MWC wallet
				case Consensus.MWC_WALLET_TYPE:
				
					// Check network type
					switch(Consensus.getNetworkType()) {
					
						// Mainnet network
						case Consensus.MAINNET_NETWORK_TYPE:
		
							// Return protocols prefix
							return "web+mwc";
						
						// Testnet network
						case Consensus.TESTNET_NETWORK_TYPE:
						
							// Return protocols prefix
							return "web+mwcfloonet";
					}
					
					// Break
					break;
				
				// GRIN wallet
				case Consensus.GRIN_WALLET_TYPE:
				
					// Check network type
					switch(Consensus.getNetworkType()) {
					
						// Mainnet network
						case Consensus.MAINNET_NETWORK_TYPE:
		
							// Return protocols prefix
							return "web+grin";
						
						// Testnet network
						case Consensus.TESTNET_NETWORK_TYPE:
						
							// Return protocols prefix
							return "web+grintestnet";
					}
					
					// Break
					break;
				
				// EPIC wallet
				case Consensus.EPIC_WALLET_TYPE:
				
					// Check network type
					switch(Consensus.getNetworkType()) {
					
						// Mainnet network
						case Consensus.MAINNET_NETWORK_TYPE:
		
							// Return protocols prefix
							return "web+epic";
						
						// Testnet network
						case Consensus.TESTNET_NETWORK_TYPE:
						
							// Return protocols prefix
							return "web+epicfloonet";
					}
					
					// Break
					break;
			}
		}
		
		// Protocols
		static get PROTOCOLS() {
		
			// Return protocols
			return [
			
				// HTTP
				ProtocolHandler.PROTOCOLS_PREFIX + "http",
				
				// HTTPS
				ProtocolHandler.PROTOCOLS_PREFIX + "https"
			];
		}
		
		// Handler URL
		static get HANDLER_URL() {
		
			// Return handler URL
			return "/index.html" + Common.URL_QUERY_STRING_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_WALLET_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.walletTypeToText(Consensus.getWalletType())).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_NETWORK_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.networkTypeToText(Consensus.getNetworkType())).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_SEPARATOR + encodeURIComponent("Request").replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent("Start Transaction").replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_SEPARATOR + encodeURIComponent("Recipient Address").replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + "%s";
		}
}


// Main function

// Set global object's protocol handler
globalThis["ProtocolHandler"] = ProtocolHandler;
