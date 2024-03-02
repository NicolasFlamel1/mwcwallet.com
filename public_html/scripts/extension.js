// Use strict
"use strict";


// Classes

// Extension class
class Extension {

	// Public
	
		// Initialize
		static initialize() {
		
			// Get URL parameters
			var urlParameters = Common.getUrlParameters();
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Check if URL parameters contains a request
				if("Request" in urlParameters === true) {
				
					// Set close when done
					Extension.closeWhenDone = true;
					
					// Try
					try {
				
						// Process URL parameters as a request
						Extension.processRequest(urlParameters, true);
					}
					
					// Catch errors
					catch(error) {
					
						// Reject error
						reject(error);
						
						// Return
						return;
					}
				}
				
				// Otherwise
				else {
				
					// Clear close when done
					Extension.closeWhenDone = false;
				}
				
				// Resolve
				resolve();
			});
		}
		
		// Get requests
		static getRequests() {
		
			// Return requests
			return Extension.requests;
		}
		
		// Allow interrupt on close
		static allowInterruptOnClose() {
		
			// Set can interrupt close
			Extension.canInterruptClose = true;
		}
		
		// Prevent interrupt on close
		static preventInterruptOnClose() {
		
			// Clear can interrupt close
			Extension.canInterruptClose = false;
		}
		
		// Get close when done
		static getCloseWhenDone() {
		
			// Return close when done
			return Extension.closeWhenDone;
		}
		
		// No transaction amount
		static get NO_TRANSACTION_AMOUNT() {
		
			// Return no transaction amount
			return null;
		}

		// No transaction message
		static get NO_TRANSACTION_MESSAGE() {
		
			// Return no transation message
			return null;
		}
	
	// Private
	
		// Process request
		static processRequest(request, makeFirstRequest = false) {
		
			// Check request
			switch(request["Request"]) {
			
				// Start transaction
				case "Start Transaction":
				
					// Check if recipient address isn't valid
					if("Recipient Address" in request === false || typeof request["Recipient Address"] !== "string" || request["Recipient Address"]["length"] === 0) {
					
						// Throw error
						throw Language.getDefaultTranslation('Invalid recipient address.');
					}
					
					// Otherwise check if amount isn't valid
					else if("Amount" in request === true && request["Amount"] !== Extension.NO_TRANSACTION_AMOUNT && (Common.isNumberString(request["Amount"]) === false || Common.getNumberStringPrecision(request["Amount"]) > Extension.MAXIMUM_AMOUNT_PRECISION || parseFloat(Common.removeTrailingZeros(request["Amount"])) < Extension.MINIMUM_AMOUNT)) {
					
						// Throw error
						throw Language.getDefaultTranslation('Invalid amount.');
					}
					
					// Otherwise check if message isn't valid
					else if("Message" in request === true && request["Message"] !== Extension.NO_TRANSACTION_MESSAGE && typeof request["Message"] !== "string") {
					
						// Throw error
						throw Language.getDefaultTranslation('Invalid message.');
					}
					
					// Otherwise
					else {
					
						// Get request information
						var requestInformation = {
							
							// Name
							"Name": SendPaymentSection.NAME,
							
							// State
							"State": {
							
								// Elements states
								[Section.STATE_ELEMENTS_STATES_NAME]: [
								
									// Back
									{
										"Tag": "BUTTON",
										"Focused": false,
										"Value": Section.NO_VALUE
									},
									
									// Forward
									{
										"Tag": "BUTTON",
										"Focused": false,
										"Value": Section.NO_VALUE
									},
									
									// Recipient address
									{
										"Tag": "INPUT",
										"Focused": false,
										"Value": ProtocolHandler.standardizeUrlProtocol(request["Recipient Address"]),
										"Selection Start": Section.NO_VALUE,
										"Selection End": Section.NO_VALUE,
										"Selection Direction": Section.NO_VALUE
									},
									
									// Scan
									{
										"Tag": "BUTTON",
										"Focused": false,
										"Value": Section.NO_VALUE
									},
									
									// Wallet
									{
										"Tag": "SELECT",
										"Focused": false,
										"Value": Section.NO_VALUE
									},
									
									// Amount
									{
										"Tag": "INPUT",
										"Focused": false,
										"Value": ("Amount" in request === true && request["Amount"] !== Extension.NO_TRANSACTION_AMOUNT) ? (new BigNumber(request["Amount"])).toFixed() : Section.NO_VALUE,
										"Selection Start": Section.NO_VALUE,
										"Selection End": Section.NO_VALUE,
										"Selection Direction": Section.NO_VALUE
									},
									
									// All
									{
										"Tag": "BUTTON",
										"Focused": false,
										"Value": Section.NO_VALUE
									},
									
									// Value
									{
										"Tag": "INPUT",
										"Focused": false,
										"Value": Section.NO_VALUE,
										"Selection Start": Section.NO_VALUE,
										"Selection End": Section.NO_VALUE,
										"Selection Direction": Section.NO_VALUE
									},
									
									// Base fee
									{
										"Tag": "INPUT",
										"Focused": false,
										"Value": Section.NO_VALUE,
										"Selection Start": Section.NO_VALUE,
										"Selection End": Section.NO_VALUE,
										"Selection Direction": Section.NO_VALUE
									},
									
									// Default base fee
									{
										"Tag": "BUTTON",
										"Focused": false,
										"Value": Section.NO_VALUE
									},
									
									// Message
									{
										"Tag": "INPUT",
										"Focused": false,
										"Value": ("Message" in request === true && request["Message"] !== Extension.NO_TRANSACTION_MESSAGE) ? request["Message"] : Section.NO_VALUE,
										"Selection Start": Section.NO_VALUE,
										"Selection End": Section.NO_VALUE,
										"Selection Direction": Section.NO_VALUE
									},
									
									// Send
									{
										"Tag": "BUTTON",
										"Focused": false,
										"Value": Section.NO_VALUE
									},
									
									// Cancel
									{
										"Tag": "BUTTON",
										"Focused": false,
										"Value": Section.NO_VALUE
									}
								]
							}
						};
						
						// Check if making first request
						if(makeFirstRequest === true) {
						
							// Add request information to beginning of list
							Extension.requests.unshift(requestInformation);
						}
						
						// Otherwise
						else {
					
							// Append request information to list
							Extension.requests.push(requestInformation);
						}
						
						// Trigger extension request receive event
						$(document).trigger(Extension.REQUEST_RECEIVE_EVENT);
					}
				
					// Break
					break;
				
				// Default
				default:
				
					// Throw error
					throw Language.getDefaultTranslation('Invalid request.');
			}
		}
		
		// Maximum amount precision
		static get MAXIMUM_AMOUNT_PRECISION() {
		
			// Return maximum amount precision
			return Math.log10(Consensus.VALUE_NUMBER_BASE);
		}

		// Minimum amount
		static get MINIMUM_AMOUNT() {
		
			// Return minimum amount
			return 1 / Consensus.VALUE_NUMBER_BASE;
		}
		
		// Request receive event
		static get REQUEST_RECEIVE_EVENT() {
		
			// Return request receive event
			return "ExtensionRequestReceiveEvent";
		}
}


// Main function

// Set global object's extension
globalThis["Extension"] = Extension;

// Initialize extension requests
Extension.requests = [];

// Initialize extension can interrupt close
Extension.canInterruptClose = false;

// Window before unload event
$(window).on("beforeunload", function(event) {

	// Check if extension can interrupt close and extension requests exist
	if(Extension.canInterruptClose === true && Extension.getRequests()["length"] !== 0) {
	
		// Try
		try {
	
			// Prevent default
			event.preventDefault();
			
			// Stop propagation
			event.stopPropagation();
			event.stopImmediatePropagation();
			
			// Check if one extension request exists
			if(Extension.getRequests()["length"] === 1) {
			
				// Return message
				return event["originalEvent"]["returnValue"] = Language.getTranslation('Are you sure you want to exit? There\'s a remaining transaction.');
			}
			
			// Otherwise
			else {
			
				// Return message
				return event["originalEvent"]["returnValue"] = Language.getTranslation('Are you sure you want to exit? There\'s remaining transactions.');
			}
		}
		
		// Catch errors
		catch(error) {
		
		}
	}
});
		
// Check if is a Firefox or Safari extension
if(Common.isExtension() === true && typeof browser !== "undefined") {

	// Message event
	browser["runtime"]["onMessage"].addListener(function(request, sender, sendResponse) {
	
		// Check if request is from the content script
		if(sender["id"] === browser["runtime"]["id"] && "frameId" in sender === true && typeof request === "object" && request !== null && "Wallet Type" in request === true && "Network Type" in request === true && "Request" in request === true) {
		
			// Check if request's wallet type is the current wallet type and network type is the current network type
			if(request["Wallet Type"] === Consensus.walletTypeToText(Consensus.getWalletType()) && request["Network Type"] === Consensus.networkTypeToText(Consensus.getNetworkType())) {
		
				// Try
				try {
				
					// Process extension request
					Extension.processRequest(request);
				}
				
				// Catch errors
				catch(error) {
				
				}
			}
		}
	});
}

// Otherwise check if is a Chrome extension
else if(Common.isExtension() === true && typeof chrome !== "undefined") {

	// Message event
	chrome["runtime"]["onMessage"].addListener(function(request, sender, sendResponse) {
	
		// Check if request is from the content script
		if(sender["id"] === chrome["runtime"]["id"] && "frameId" in sender === true && typeof request === "object" && request !== null && "Wallet Type" in request === true && "Network Type" in request === true && "Request" in request === true) {
		
			// Check if request's wallet type is the current wallet type and network type is the current network type
			if(request["Wallet Type"] === Consensus.walletTypeToText(Consensus.getWalletType()) && request["Network Type"] === Consensus.networkTypeToText(Consensus.getNetworkType())) {
		
				// Try
				try {
				
					// Process extension request
					Extension.processRequest(request);
				}
				
				// Catch errors
				catch(error) {
				
				}
			}
		}
	});
}
