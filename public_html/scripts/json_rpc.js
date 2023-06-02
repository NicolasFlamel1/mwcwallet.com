// Use strict
"use strict";


// Classes

// JSON-RPC class
class JsonRpc {

	// Public
	
		// Send request
		static sendRequest(urlOrUrls, method, parameters = [], headers = {}, numberOfAttempts = JsonRpc.DEFAULT_NUMBER_OF_ATTEMPTS, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Set current attempt
				var currentAttempt = new Promise(function(resolve, reject) {
				
					// Resolve invalid response
					resolve(JsonRpc.INVALID_RESPONSE);
				});
				
				// Initiaize attempts
				var attempts = [currentAttempt];
			
				// Go through all attempts or URLs
				for(let i = 0; i < Math.max(numberOfAttempts, (Array.isArray(urlOrUrls) === true) ? urlOrUrls["length"] : [urlOrUrls]["length"]); ++i) {
				
					// Set attempt that runs after the current attempt
					currentAttempt = currentAttempt.then(function(response) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
						
							// Check if response isn't invalid
							if(response !== JsonRpc.INVALID_RESPONSE) {
						
								// Resolve response
								resolve(response);
							}
							
							// Otherwise
							else {
							
								// Get current URL
								var currentUrl = (Array.isArray(urlOrUrls) === true) ? urlOrUrls[i % urlOrUrls["length"]] : urlOrUrls;
								
								// Return sending data
								return JsonRpc.sendData(currentUrl, method, parameters, headers, JsonRpc.DEFAULT_ID, cancelOccurred).then(function(currentResponse) {
								
									// Resolve current response
									resolve(currentResponse);
								
								// Catch errors
								}).catch(function(error) {
								
									// Check if at the last attempt, the error's response had an ok, bad request, unauthorized, forbidden, not found, unsupported media type, or payload too large status, or the response is a JSON-RPC error
									if(i === Math.max(numberOfAttempts, (Array.isArray(urlOrUrls) === true) ? urlOrUrls["length"] : [urlOrUrls]["length"]) - 1 || error === Common.HTTP_OK_STATUS || error === Common.HTTP_BAD_REQUEST_STATUS || error === Common.HTTP_UNAUTHORIZED_STATUS || error === Common.HTTP_FORBIDDEN_STATUS || error === Common.HTTP_NOT_FOUND_STATUS || error === Common.HTTP_UNSUPPORTED_MEDIA_TYPE_STATUS || error === Common.HTTP_PAYLOAD_TOO_LARGE_STATUS || Object.isObject(error) === true) {
									
										// Reject error
										reject(error);
									}
									
									// Otherwise
									else {
									
										// Resolve invalid response
										resolve(JsonRpc.INVALID_RESPONSE);
									}
								});
							}
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
							
							// Reject error
							reject(error);
						});
					});
					
					// Append current attempt to list
					attempts.push(currentAttempt);
				}
				
				// Return trying all attempts
				return Promise.all(attempts).then(function(responses) {
				
					// Resolve response
					resolve(responses[responses["length"] - 1]);
					
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Send notification
		static sendNotification(urlOrUrls, method, parameters = [], headers = {}, numberOfAttempts = JsonRpc.DEFAULT_NUMBER_OF_ATTEMPTS, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Set current attempt
				var currentAttempt = new Promise(function(resolve, reject) {
				
					// Resolve invalid response
					resolve(JsonRpc.INVALID_RESPONSE);
				});
				
				// Initiaize attempts
				var attempts = [currentAttempt];
			
				// Go through all attempts or URLs
				for(let i = 0; i < Math.max(numberOfAttempts, (Array.isArray(urlOrUrls) === true) ? urlOrUrls["length"] : [urlOrUrls]["length"]); ++i) {
				
					// Set attempt that runs after the current attempt
					currentAttempt = currentAttempt.then(function(response) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
					
							// Check if response isn't invalid
							if(response !== JsonRpc.INVALID_RESPONSE) {
						
								// Resolve response
								resolve(response);
							}
							
							// Otherwise
							else {
							
								// Get current URL
								var currentUrl = (Array.isArray(urlOrUrls) === true) ? urlOrUrls[i % urlOrUrls["length"]] : urlOrUrls;
							
								// Return sending data
								return JsonRpc.sendData(currentUrl, method, parameters, headers, JsonRpc.NO_ID, cancelOccurred).then(function(currentResponse) {
								
									// Resolve current response
									resolve(currentResponse);
								
								// Catch errors
								}).catch(function(error) {
								
									// Check if at the last attempt, the error's response had an ok, bad request, unauthorized, forbidden, not found, unsupported media type, or payload too large status, or the response is a JSON-RPC error
									if(i === Math.max(numberOfAttempts, (Array.isArray(urlOrUrls) === true) ? urlOrUrls["length"] : [urlOrUrls]["length"]) - 1 || error === Common.HTTP_OK_STATUS || error === Common.HTTP_BAD_REQUEST_STATUS || error === Common.HTTP_UNAUTHORIZED_STATUS || error === Common.HTTP_FORBIDDEN_STATUS || error === Common.HTTP_NOT_FOUND_STATUS || error === Common.HTTP_UNSUPPORTED_MEDIA_TYPE_STATUS || error === Common.HTTP_PAYLOAD_TOO_LARGE_STATUS || Object.isObject(error) === true) {
									
										// Reject error
										reject(error);
									}
									
									// Otherwise
									else {
									
										// Resolve invalid response
										resolve(JsonRpc.INVALID_RESPONSE);
									}
								});
							}
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Return promise
						return new Promise(function(resolve, reject) {
							
							// Reject error
							reject(error);
						});
					});
					
					// Append current attempt to list
					attempts.push(currentAttempt);
				}
				
				// Return trying all attempts
				return Promise.all(attempts).then(function(responses) {
				
					// Resolve response
					resolve(responses[responses["length"] - 1]);
					
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
		
		// Create response
		static createResponse(response, requestOrNotification, isError = false) {
		
			// Check if a request is provided
			if(Object.isObject(requestOrNotification) === true && "id" in requestOrNotification === true) {
			
				// Check if not error
				if(isError === false) {
		
					// Return response
					return {
					
						// Version
						"jsonrpc": JsonRpc.VERSION,
						
						// ID
						"id": requestOrNotification["id"],
						
						// Result
						"result": response
					};
				}
				
				// Otherwise
				else {
				
					// Return response
					return {
					
						// Version
						"jsonrpc": JsonRpc.VERSION,
						
						// ID
						"id": requestOrNotification["id"],
						
						// Error
						"error": response
					};
				}
			}
			
			// Otherwise
			else {
			
				// Return no response
				return JsonRpc.NO_RESPONSE;
			}
		}
		
		// Create error response
		static createErrorResponse(error, requestOrNotification, message = JsonRpc.DEFAULT_MESSAGE) {
		
			// Check if message is default message
			if(message === JsonRpc.DEFAULT_MESSAGE) {
		
				// Check error
				switch(error) {
				
					// Invalid request error
					case JsonRpc.INVALID_REQUEST_ERROR:
					
						// Set message
						message = Language.getDefaultTranslation('Invalid request');
					
						// Break
						break;
					
					// Method not found error
					case JsonRpc.METHOD_NOT_FOUND_ERROR:
					
						// Set message
						message = Language.getDefaultTranslation('Method not found');
					
						// Break
						break;
					
					// Invalid parameters error
					case JsonRpc.INVALID_PARAMETERS_ERROR:
					
						// Set message
						message = Language.getDefaultTranslation('Invalid parameters');
					
						// Break
						break;
					
					// Internal error error
					case JsonRpc.INTERNAL_ERROR_ERROR:
					
						// Set message
						message = Language.getDefaultTranslation('Internal error');
					
						// Break
						break;
				}
			}
			
			// Return create response
			return JsonRpc.createResponse({
									
				// Code
				"code": error,
				
				// Message
				"message": message
			
			}, requestOrNotification, true);
		}
		
		// Is request
		static isRequest(data) {
		
			// Return if data is a request
			return Object.isObject(data) === true && "jsonrpc" in data === true && data["jsonrpc"] === JsonRpc.VERSION && "id" in data === true && data["id"] instanceof BigNumber === true && data["id"].isInteger() === true && data["id"].isPositive() === true && "method" in data === true && "params" in data === true;
		}
		
		// Is notification
		static isNotification(data) {
		
			// Return if data is a notification
			return Object.isObject(data) === true && "jsonrpc" in data === true && data["jsonrpc"] === JsonRpc.VERSION && "id" in data === false && "method" in data === true && "params" in data === true;
		}
		
		// Is error response
		static isErrorResponse(response) {
		
			// Return if response is an error
			return Object.isObject(response) === true && "jsonrpc" in response === true && response["jsonrpc"] === JsonRpc.VERSION && "id" in response === true && response["id"] instanceof BigNumber === true && response["id"].isInteger() === true && response["id"].isPositive() === true && "error" in response === true && Object.isObject(response["error"]) === true && "code" in response["error"] === true;
		}
		
		// No response
		static get NO_RESPONSE() {
		
			// Return no response
			return null;
		}
		
		// Invalid request error
		static get INVALID_REQUEST_ERROR() {
		
			// Return invalid request error
			return -32600;
		}
		
		// Method not found error
		static get METHOD_NOT_FOUND_ERROR() {
		
			// Return method not found error
			return -32601;
		}
		
		// Invalid parameters error
		static get INVALID_PARAMETERS_ERROR() {
		
			// Return invalid parameters error
			return -32602;
		}
		
		// Internal error error
		static get INTERNAL_ERROR_ERROR() {
		
			// Return internal error error
			return -32603;
		}
		
		// Default message
		static get DEFAULT_MESSAGE() {
		
			// Return default message
			return null;
		}
	
	// Private
	
		// Send data
		static sendData(url, method, parameters, headers, id, cancelOccurred = Common.NO_CANCEL_OCCURRED) {
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if cancel didn't occur
				if(cancelOccurred === Common.NO_CANCEL_OCCURRED || cancelOccurred() === false) {
			
					// Set data
					var data = {
						
						// Version
						"jsonrpc": JsonRpc.VERSION,
						
						// Method
						"method": method,
						
						// Parameters
						"params": parameters
					};
					
					// Check if an ID is provided
					if(id !== JsonRpc.NO_ID)
					
						// Set data's ID
						data["id"] = id;
					
					// Get AJAX request
					var ajaxRequest = $.ajax(url, {
					
						// Data
						"data": JSONBigNumber.stringify(data),
						
						// Content type
						"contentType": "application/json",
						
						// Data type
						"dataType": "text",
						
						// Type
						"type": "POST",
						
						// Headers
						"headers": headers
					});
					
					// Initialize cancel allowed
					var cancelAllowed = true;
					
					// Abort if canceled
					var abortIfCanceled = function() {
					
						// Check if cancel is allowed
						if(cancelAllowed === true) {
					
							// Check if cancel occurred
							if(cancelOccurred !== Common.NO_CANCEL_OCCURRED && cancelOccurred() === true) {
							
								// Abort AJAX request
								ajaxRequest.abort();
							}
							
							// Otherwise
							else {
							
								// Set timeout
								setTimeout(function() {
								
									// Abort if canceled
									abortIfCanceled();
								
								}, JsonRpc.AJAX_REQUEST_CANCELED_CHECK_INTERVAL_MILLISECONDS);
							}
						}
					};
					
					// Abort if canceled
					abortIfCanceled();
					
					// Return sending AJAX request
					return ajaxRequest.then(function(response, status, request) {
					
						// Clear cancel allowed
						cancelAllowed = false;
					
						// Check if a response was expected
						if(id !== JsonRpc.NO_ID) {
					
							// Try
							try {
							
								// Parse response as JSON
								response = JSONBigNumber.parse(response);
							}
							
							// Catch errors
							catch(error) {
							
								// Reject request's status
								reject(request["status"]);
								
								// Return
								return;
							}
							
							// Check if response is invalid
							if(Object.isObject(response) === false)
							
								// Reject request's status
								reject(request["status"]);
							
							// Otherwise check if response contains an invalid version
							else if("jsonrpc" in response === false || response["jsonrpc"] !== JsonRpc.VERSION)
							
								// Reject request's status
								reject(request["status"]);
							
							// Otherwise check if response contains an invalid ID
							else if("id" in response === false || response["id"] instanceof BigNumber === false || response["id"].isInteger() === false || response["id"].isPositive() === false)
							
								// Reject request's status
								reject(request["status"]);
							
							// Otherwise check if response contains an invalid result
							else if("error" in response === true || "result" in response === false)
							
								// Reject response's error or request's status
								reject(("error" in response === true) ? response["error"] : request["status"]);
							
							// Otherwise
							else
							
								// Resolve response's result
								resolve(response["result"]);
						}
						
						// Otherwise
						else {
						
							// Check if a response exists
							if(response["length"] !== 0)
							
								// Reject request's status
								reject(request["status"]);
							
							// Otherwise
							else
							
								// Resolve
								resolve();
						}
						
					// Catch errors
					}).catch(function(request) {
					
						// Clear cancel allowed
						cancelAllowed = false;
					
						// Reject request's status
						reject(request["status"]);
					});
				}
				
				// Otherwise
				else {
				
					// Reject HTTP no response status
					reject(Common.HTTP_NO_RESPONSE_STATUS);
				}
			});
		}
		
		// Version
		static get VERSION() {
		
			// Return version
			return "2.0";
		}
		
		// Default ID
		static get DEFAULT_ID() {
		
			// Return default ID
			return 1;
		}
		
		// Default number of attempts
		static get DEFAULT_NUMBER_OF_ATTEMPTS() {
		
			// Return default number of attempts
			return 5;
		}
		
		// Invalid response
		static get INVALID_RESPONSE() {
		
			// Return invalid response
			return undefined;
		}
		
		// No ID
		static get NO_ID() {
		
			// Return no ID
			return null;
		}
		
		// AJAX request canceled check interval milliseconds
		static get AJAX_REQUEST_CANCELED_CHECK_INTERVAL_MILLISECONDS() {
		
			// Return AJAX request canceled check interval milliseconds
			return 50;
		}
}


// Main function

// Set global object's JSON-RPC
globalThis["JsonRpc"] = JsonRpc;
