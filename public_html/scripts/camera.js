// Use strict
"use strict";


// Classes

// Camera class
class Camera {

	// Public
	
		// Initialize
		static initialize() {
		
			// Initialize request index
			Camera.requestIndex = 0;
		
			// Create worker
			Camera.worker = new Worker(Camera.WORKER_FILE_LOCATION);
			
			// Window before unload event
			$(window).on("beforeunload", function() {
			
				// Get current request index
				var currentRequestIndex = Camera.requestIndex++;
				
				// Check if current request index is at the max safe integer
				if(currentRequestIndex === Number.MAX_SAFE_INTEGER)
				
					// Reset request index
					Camera.requestIndex = 0;
				
				// Send worker an uninitialize request
				Camera.worker.postMessage([
				
					// Request index
					currentRequestIndex,
				
					// Type
					Camera.UNINITIALIZE_REQUEST_TYPE
				]);
			
				// Terminate worker
				Camera.worker.terminate();
			});
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Worker on error
				Camera.worker["onerror"] = function() {

					// Reject error
					reject("Failed to create camera worker.");
				};
				
				// Worker on message
				Camera.worker["onmessage"] = function(event) {
				
					// Get message
					var message = event["data"];
					
					// Get message's request index
					var requestIndex = message[Camera.MESSAGE_REQUEST_INDEX_OFFSET];
					
					// Check message's type
					switch(message[Camera.MESSAGE_TYPE_OFFSET]) {
					
						// Initialize request type
						case Camera.INITIALIZE_REQUEST_TYPE:
						
							// Get message's status
							var status = message[Camera.MESSAGE_STATUS_OFFSET];
						
							// Check if worker initialized successfully
							if(status === Camera.STATUS_SUCCESS_VALUE)
						
								// Resolve
								resolve();
							
							// Otherwise
							else
							
								// Reject error
								reject("Failed to initialize camera worker.");
						
							// Break
							break;
						
						// Default
						default:
						
							// Get message's response
							var response = message[Camera.MESSAGE_RESPONSE_OFFSET];
							
							// Trigger response request index event
							$(document).trigger(Camera.RESPONSE_EVENT + requestIndex.toFixed(), [
								
								// Response
								response
							]);
							
							// Break
							break;
					}
				};
				
				// Get current request index
				var currentRequestIndex = Camera.requestIndex++;
				
				// Check if current request index is at the max safe integer
				if(currentRequestIndex === Number.MAX_SAFE_INTEGER)
				
					// Reset request index
					Camera.requestIndex = 0;
				
				// Send worker an initialize request
				Camera.worker.postMessage([
				
					// Request index
					currentRequestIndex,
				
					// Type
					Camera.INITIALIZE_REQUEST_TYPE,
					
					// URL query string
					Common.URL_QUERY_STRING_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_WALLET_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.walletTypeToText(Consensus.getWalletType())).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_SEPARATOR + encodeURIComponent(Consensus.OVERRIDE_NETWORK_TYPE_URL_PARAMETER_NAME).replace(/%20/ug, "+") + Common.URL_QUERY_STRING_PARAMETER_VALUE_SEPARATOR + encodeURIComponent(Consensus.networkTypeToText(Consensus.getNetworkType())).replace(/%20/ug, "+")
				]);
			});
		}
		
		// Get value
		static getValue(image, width, height) {
		
			// Create canvas
			var canvas = document.createElement("canvas");
			
			// Set canvas's dimensions
			canvas["width"] = width;
			canvas["height"] = height;
			
			// Draw image on canvas
			var context = canvas.getContext("2d");
			context.drawImage(image, 0, 0, width, height);
			
			// Get image's data from the canvas
			var imageData = context.getImageData(0, 0, width, height)["data"]["buffer"];
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Return sending decode request
				return Camera.sendRequest([
				
					// Type
					Camera.DECODE_REQUEST_TYPE,
					
					// Width
					width,
					
					// Height
					height,
					
					// Image data
					imageData
				], [
				
					// Image data
					imageData
				
				]).then(function(response) {
				
					// Check if response is no value
					if(response === Camera.NO_VALUE)
					
						// Resolve no value
						resolve(Camera.NO_VALUE);
					
					// Otherwise
					else {
					
						// Get data from response
						var data = response[Camera.RESPONSE_DATA_INDEX];
						
						// Get top left corner X from response
						var topLeftCornerX = response[Camera.RESPONSE_TOP_LEFT_CORNER_X_INDEX];
						
						// Get top left corner Y from response
						var topLeftCornerY = response[Camera.RESPONSE_TOP_LEFT_CORNER_Y_INDEX];
						
						// Get top right corner X from response
						var topRightCornerX = response[Camera.RESPONSE_TOP_RIGHT_CORNER_X_INDEX];
						
						// Get top right corner Y from response
						var topRightCornerY = response[Camera.RESPONSE_TOP_RIGHT_CORNER_Y_INDEX];
						
						// Get bottom left corner X from response
						var bottomLeftCornerX = response[Camera.RESPONSE_BOTTOM_LEFT_CORNER_X_INDEX];
						
						// Get bottom left corner Y from response
						var bottomLeftCornerY = response[Camera.RESPONSE_BOTTOM_LEFT_CORNER_Y_INDEX];
						
						// Get bottom right corner X from response
						var bottomRightCornerX = response[Camera.RESPONSE_BOTTOM_RIGHT_CORNER_X_INDEX];
						
						// Get bottom right corner Y from response
						var bottomRightCornerY = response[Camera.RESPONSE_BOTTOM_RIGHT_CORNER_Y_INDEX];
						
						// Resolve data
						resolve(data);
					}
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			});
		}
	
		// Initialize request type
		static get INITIALIZE_REQUEST_TYPE() {
		
			// Return initialize request type
			return 0;
		}
		
		// Uninitialize request type
		static get UNINITIALIZE_REQUEST_TYPE() {
		
			// Return uninitialize request type
			return Camera.INITIALIZE_REQUEST_TYPE + 1;
		}
		
		// Decode request type
		static get DECODE_REQUEST_TYPE() {
		
			// Return decode request type
			return Camera.UNINITIALIZE_REQUEST_TYPE + 1;
		}
		
		// Message request index offset
		static get MESSAGE_REQUEST_INDEX_OFFSET() {
		
			// Return message request index offset
			return 0;
		}
		
		// Message type offset
		static get MESSAGE_TYPE_OFFSET() {
		
			// Return message type offset
			return Camera.MESSAGE_REQUEST_INDEX_OFFSET + 1;
		}
		
		// Message initialize URL query string offset
		static get MESSAGE_INITIALIZE_URL_QUERY_STRING_OFFSET() {
		
			// Return message initialize URL query string offset
			return Camera.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Message width offset
		static get MESSAGE_WIDTH_OFFSET() {
		
			// Return message width offset
			return Camera.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Message height offset
		static get MESSAGE_HEIGHT_OFFSET() {
		
			// Return message height offset
			return Camera.MESSAGE_WIDTH_OFFSET + 1;
		}
		
		// Message image data offset
		static get MESSAGE_IMAGE_DATA_OFFSET() {
		
			// Return message image data offset
			return Camera.MESSAGE_HEIGHT_OFFSET + 1;
		}
		
		// Status success value
		static get STATUS_SUCCESS_VALUE() {
		
			// Return status success value
			return true;
		}
		
		// Status failed value
		static get STATUS_FAILED_VALUE() {
		
			// Return status failed value
			return false;
		}
		
		// No value
		static get NO_VALUE() {
		
			// Return no value
			return null;
		}
	
	// Private
	
		// Send request
		static sendRequest(request, transfer) {
		
			// Get current request index
			var currentRequestIndex = Camera.requestIndex++;
			
			// Check if current request index is at the max safe integer
			if(currentRequestIndex === Number.MAX_SAFE_INTEGER)
			
				// Reset request index
				Camera.requestIndex = 0;
			
			// Add current request index to request
			request.unshift(currentRequestIndex);
			
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Response current request index event
				$(document).one(Camera.RESPONSE_EVENT + currentRequestIndex.toFixed(), function(event, response) {
				
					// Resolve response
					resolve(response);
				});
			
				// Send worker the request
				Camera.worker.postMessage(request, transfer);
			});
		}
		
		// Message status offset
		static get MESSAGE_STATUS_OFFSET() {
		
			// Return message status offset
			return Camera.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Message response offset
		static get MESSAGE_RESPONSE_OFFSET() {
		
			// Return message response offset
			return Camera.MESSAGE_TYPE_OFFSET + 1;
		}
		
		// Response event
		static get RESPONSE_EVENT() {
		
			// Return response event
			return "CameraResponseEvent";
		}
		
		// Response data index
		static get RESPONSE_DATA_INDEX() {
		
			// Return response data index
			return 0;
		}
		
		// Response top left corner X index
		static get RESPONSE_TOP_LEFT_CORNER_X_INDEX() {
		
			// Return response top left corner X index
			return Camera.RESPONSE_DATA_INDEX + 1;
		}
		
		// Response top left corner Y index
		static get RESPONSE_TOP_LEFT_CORNER_Y_INDEX() {
		
			// Return response top left corner Y index
			return Camera.RESPONSE_TOP_LEFT_CORNER_X_INDEX + 1;
		}
		
		// Response top right corner X index
		static get RESPONSE_TOP_RIGHT_CORNER_X_INDEX() {
		
			// Return response top right corner X index
			return Camera.RESPONSE_TOP_LEFT_CORNER_Y_INDEX + 1;
		}
		
		// Response top right corner Y index
		static get RESPONSE_TOP_RIGHT_CORNER_Y_INDEX() {
		
			// Return response top right corner Y index
			return Camera.RESPONSE_TOP_RIGHT_CORNER_X_INDEX + 1;
		}
		
		// Response bottom left corner X index
		static get RESPONSE_BOTTOM_LEFT_CORNER_X_INDEX() {
		
			// Return response bottom left corner X index
			return Camera.RESPONSE_TOP_RIGHT_CORNER_Y_INDEX + 1;
		}
		
		// Response bottom left corner Y index
		static get RESPONSE_BOTTOM_LEFT_CORNER_Y_INDEX() {
		
			// Return response bottom left corner Y index
			return Camera.RESPONSE_BOTTOM_LEFT_CORNER_X_INDEX + 1;
		}
		
		// Response bottom right corner X index
		static get RESPONSE_BOTTOM_RIGHT_CORNER_X_INDEX() {
		
			// Return response bottom right corner X index
			return Camera.RESPONSE_BOTTOM_LEFT_CORNER_Y_INDEX + 1;
		}
		
		// Response bottom right corner Y index
		static get RESPONSE_BOTTOM_RIGHT_CORNER_Y_INDEX() {
		
			// Return response bottom right corner Y index
			return Camera.RESPONSE_BOTTOM_RIGHT_CORNER_X_INDEX + 1;
		}
		
		// Worker file location
		static get WORKER_FILE_LOCATION() {
		
			// Return worker file location
			return "." + getResource("./scripts/camera_worker.js");
		}
}


// Main function

// Set global object's camera
globalThis["Camera"] = Camera;
