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
importScripts(".<?= escapeString(getResource("./scripts/BLAKE2b-0.0.2.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/Ed25519-0.0.22.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/js-sha3-0.8.0.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/js-sha256-0.10.0.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/secp256k1-zkp-0.0.29.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/SMAZ-0.0.31.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/hi-base32-0.5.1.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/bech32-2.0.0.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/base58.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/bignumber.js-9.1.1.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/common.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/consensus.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/bit_reader.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/bit_writer.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/crypto.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/tor.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/mqs.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/slatepack.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/uuid.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/hash.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/slate.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/slate_participant.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/slate_input.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/slate_output.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/slate_kernel.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/identifier.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/output.js")); ?>");


// Constants

// Files
const FILES = <?= json_encode($files); ?>;

// Dependencies initializations
const DEPENDENCIES_INITIALIZATIONS = [

	// BLAKE2b initialize
	Blake2b.initialize,
	
	// Ed25519 initialize
	Ed25519.initialize,
	
	// Secp256k1-zkp initialize
	Secp256k1Zkp.initialize,
	
	// SMAZ initialize
	Smaz.initialize
];

// Dependencies uninitializations
const DEPENDENCIES_UNINITIALIZATIONS = [
	
	// Secp256k1-zkp uninitialize
	Secp256k1Zkp.uninitialize
];


// Global variables

// URL query string
var URL_QUERY_STRING;


// Events

// Message event
self.addEventListener("message", function(event) {

	// Get message
	var message = event["data"];
	
	// Get message's request index
	var requestIndex = message[Slate.MESSAGE_REQUEST_INDEX_OFFSET];
	
	// Get message's type
	var type = message[Slate.MESSAGE_TYPE_OFFSET];
	
	// Check type
	switch(type) {
	
		// Initialize request type
		case Slate.INITIALIZE_REQUEST_TYPE:
		
			// Get message's URL query string
			URL_QUERY_STRING = message[Slate.MESSAGE_INITIALIZE_URL_QUERY_STRING_OFFSET];
		
			// Perform dependencies initializations
			Promise.all(DEPENDENCIES_INITIALIZATIONS.map(function(dependencyInitialization) {
			
				// Return performing dependency initialization
				return dependencyInitialization();
				
			})).then(function() {
		
				// Respond with success status
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Status
					Slate.STATUS_SUCCESS_VALUE
				]);
			
			// Catch errors
			}).catch(function(error) {
			
				// Respond with failed status
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Status
					Slate.STATUS_FAILED_VALUE
				]);
			});
		
			// Break
			break;
		
		// Uninitialize request type
		case Slate.UNINITIALIZE_REQUEST_TYPE:
		
			// Go through all dependencies uninitializations
			for(var i = 0; i < DEPENDENCIES_UNINITIALIZATIONS["length"]; ++i) {
			
				// Get dependency's uninitialization
				var dependencyUninitialization = DEPENDENCIES_UNINITIALIZATIONS[i];
				
				// Perform dependency's uninitialization
				dependencyUninitialization();
			}
			
			// Respond with success status
			postMessage([
			
				// Request index
				requestIndex,
			
				// Type
				type,
			
				// Status
				Slate.STATUS_SUCCESS_VALUE
			]);
		
			// Break
			break;
		
		// Parse slate request type
		case Slate.PARSE_SLATE_REQUEST_TYPE:
		
			// Get message's serialized slate
			var serializedSlate = (message[Slate.MESSAGE_PARSE_SLATE_SERIALIZED_SLATE_OFFSET] instanceof ArrayBuffer === true) ? new Uint8Array(message[Slate.MESSAGE_PARSE_SLATE_SERIALIZED_SLATE_OFFSET]) : Common.unserializeObject(message[Slate.MESSAGE_PARSE_SLATE_SERIALIZED_SLATE_OFFSET]);
			
			// Get message's is mainnet
			var isMainnet = message[Slate.MESSAGE_PARSE_SLATE_IS_MAINNET_OFFSET];
			
			// Get message's purpose
			var purpose = message[Slate.MESSAGE_PARSE_SLATE_PURPOSE_OFFSET];
			
			// Get message's initial send slate
			var initialSendSlate = Common.unserializeObject(message[Slate.MESSAGE_PARSE_SLATE_INITIAL_SEND_SLATE_OFFSET]);
			
			// Try
			try {
			
				// Create slate
				var slate = new Slate(serializedSlate, isMainnet, purpose, initialSendSlate);
			}
			
			// Catch errors
			catch(error) {
			
				// Respond with failed status
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Status
					Slate.STATUS_FAILED_VALUE
				]);
				
				// Return
				return;
			}
			
			// Respond with slate
			postMessage([
			
				// Request index
				requestIndex,
			
				// Type
				type,
			
				// slate
				Common.serializeObject(slate)
			]);
		
			// Break
			break;
		
		// Add outputs request type
		case Slate.ADD_OUTPUTS_REQUEST_TYPE:
		
			// Get message's slate
			var slate = Common.unserializeObject(message[Slate.MESSAGE_ADD_OUTPUTS_SLATE_OFFSET]);
			
			// Get message's outputs
			var outputs = Common.unserializeObject(message[Slate.MESSAGE_ADD_OUTPUTS_OUTPUTS_OFFSET]);
			
			// Get message's update kernel
			var updateKernel = message[Slate.MESSAGE_ADD_OUTPUTS_UPDATE_KERNEL_OFFSET];
			
			// Check if adding outputs to the slate failed
			if(slate.addOutputs(outputs, updateKernel) === false) {
			
				// Respond with failed status
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Status
					Slate.STATUS_FAILED_VALUE
				]);
			}
			
			// Otherwise
			else {
			
				// Respond with slate
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// slate
					Common.serializeObject(slate)
				]);
			}
			
			// Break
			break;
		
		// Add inputs request type
		case Slate.ADD_INPUTS_REQUEST_TYPE:
		
			// Get message's slate
			var slate = Common.unserializeObject(message[Slate.MESSAGE_ADD_INPUTS_SLATE_OFFSET]);
			
			// Get message's inputs
			var inputs = Common.unserializeObject(message[Slate.MESSAGE_ADD_INPUTS_INPUTS_OFFSET]);
			
			// Get message's update kernel
			var updateKernel = message[Slate.MESSAGE_ADD_INPUTS_UPDATE_KERNEL_OFFSET];
			
			// Get message's expected number of outputs
			var expectedNumberOfOutputs = message[Slate.MESSAGE_ADD_INPUTS_EXPECTED_NUMBER_OF_OUTPUTS_OFFSET];
			
			// Check if adding inputs to the slate failed
			if(slate.addInputs(inputs, updateKernel, expectedNumberOfOutputs) === false) {
			
				// Respond with failed status
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Status
					Slate.STATUS_FAILED_VALUE
				]);
			}
			
			// Otherwise
			else {
			
				// Respond with slate
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// slate
					Common.serializeObject(slate)
				]);
			}
			
			// Break
			break;
		
		// Verify after finalize request type
		case Slate.VERIFY_AFTER_FINALIZE_REQUEST_TYPE:
		
			// Get message's slate
			var slate = Common.unserializeObject(message[Slate.MESSAGE_VERIFY_AFTER_FINALIZE_SLATE_OFFSET]);
			
			// Get message's base fee
			var baseFee = Common.unserializeObject(message[Slate.MESSAGE_VERIFY_AFTER_FINALIZE_BASE_FEE_OFFSET]);
			
			// Get message's is mainnet
			var isMainnet = message[Slate.MESSAGE_VERIFY_AFTER_FINALIZE_IS_MAINNET_OFFSET];
			
			// Check if verifying the slate after finalize failed
			if(slate.verifyAfterFinalize(baseFee, isMainnet) === false) {
			
				// Respond with failed status
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Status
					Slate.STATUS_FAILED_VALUE
				]);
			}
			
			// Otherwise
			else {
			
				// Respond with success status
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Status
					Slate.STATUS_SUCCESS_VALUE
				]);
			}
			
			// Break
			break;
	}
});


// Supporting function implementation
		
// Add minified suffix
function addMinifiedSuffix(file) {

	// Get file's suffix offset
	var suffixOffset = file.lastIndexOf(".");
	
	// Check if file contains no suffix
	if(suffixOffset === Common.INDEX_NOT_FOUND || suffixOffset < "./"["length"])
	
		// Return file with minified suffix at the end
		return file + ".min";
	
	// Otherwise
	else
	
		// Return file with minified suffix insert before its suffix
		return file.substring(0, suffixOffset) + ".min" + file.substring(suffixOffset);
}

// Get resource
function getResource(file) {

	// Return resource with version
	return ((file in FILES === true && FILES[file]["Minified"] === true) ? addMinifiedSuffix(file) : file) + ((file in FILES === true && FILES[file]["Version"] !== 0) ? "?" + FILES[file]["Version"] : "");
}
