<?php

	// Included files
	require_once __DIR__ . "/../backend/common.php";
	require_once __DIR__ . "/../backend/resources.php";
	
	
	// Main function
	
	// Set content type header
	header("Content-Type: application/javascript; charset=" . mb_internal_encoding());

?>// Use strict
"use strict";


// Import scripts
importScripts(".<?= escapeString(getResource("./scripts/camera.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/jsQR-1.4.0.js")); ?>");


// Constants

// No QR code
const NO_QR_CODE = null;


// Global variables

// URL query string
var URL_QUERY_STRING;


// Events

// Message event
self.addEventListener("message", function(event) {

	// Get message
	var message = event["data"];
	
	// Get message's request index
	var requestIndex = message[Camera.MESSAGE_REQUEST_INDEX_OFFSET];
	
	// Get message's type
	var type = message[Camera.MESSAGE_TYPE_OFFSET];
	
	// Check type
	switch(type) {
	
		// Initialize request type
		case Camera.INITIALIZE_REQUEST_TYPE:
		
			// Get message's URL query string
			URL_QUERY_STRING = message[Camera.MESSAGE_INITIALIZE_URL_QUERY_STRING_OFFSET];
		
			// Respond with success status
			postMessage([
			
				// Request index
				requestIndex,
			
				// Type
				type,
			
				// Status
				Camera.STATUS_SUCCESS_VALUE
			]);
		
			// Break
			break;
		
		// Uninitialize request type
		case Camera.UNINITIALIZE_REQUEST_TYPE:
		
			// Respond with success status
			postMessage([
			
				// Request index
				requestIndex,
			
				// Type
				type,
			
				// Status
				Camera.STATUS_SUCCESS_VALUE
			]);
		
			// Break
			break;
		
		// Decode request type
		case Camera.DECODE_REQUEST_TYPE:
		
			// Get message's width
			var width = message[Camera.MESSAGE_WIDTH_OFFSET];
			
			// Get message's height
			var height = message[Camera.MESSAGE_HEIGHT_OFFSET];
			
			// Get message's image data
			var imageData = new Uint8Array(message[Camera.MESSAGE_IMAGE_DATA_OFFSET]);
			
			// Get QR code from image data, width, and height
			var qrCode = jsQR(imageData, width, height, {
			
				// Inversion attempts
				"inversionAttempts": "attemptBoth"
			});
			
			// Check if getting QR code failed
			if(qrCode === NO_QR_CODE) {
			
				// Respond with no value
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Value
					Camera.NO_VALUE
				]);
			}
			
			// Otherwise
			else {
			
				// Respond with value
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Value
					[
					
						// Data
						qrCode["data"],
						
						// Top left corner X
						qrCode["location"]["topLeftCorner"]["x"],
						
						// Top left corner Y
						qrCode["location"]["topLeftCorner"]["y"],
						
						// Top right corner X
						qrCode["location"]["topRightCorner"]["x"],
						
						// Top right corner Y
						qrCode["location"]["topRightCorner"]["y"],
						
						// Bottom left corner X
						qrCode["location"]["bottomLeftCorner"]["x"],
						
						// Bottom left corner Y
						qrCode["location"]["bottomLeftCorner"]["y"],
						
						// Bottom right corner X
						qrCode["location"]["bottomRightCorner"]["x"],
						
						// Bottom right corner Y
						qrCode["location"]["bottomRightCorner"]["y"]
					]
				]);
			}
			
			// Break;
			break;
	}
});
