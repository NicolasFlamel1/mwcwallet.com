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
importScripts(".<?= escapeString(getResource("./scripts/secp256k1-zkp-0.0.29.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/bignumber.js-9.1.1.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/common.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/crypto.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/identifier.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/proof_builder.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/legacy_proof_builder.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/new_proof_builder.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/view_proof_builder.js")); ?>");
importScripts(".<?= escapeString(getResource("./scripts/output.js")); ?>");


// Constants

// Files
const FILES = <?= json_encode($files); ?>;

// Dependencies initializations
const DEPENDENCIES_INITIALIZATIONS = [
	
	// BLAKE2b initialize
	Blake2b.initialize,

	// Secp256k1-zkp initialize
	Secp256k1Zkp.initialize
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
	var requestIndex = message[Output.MESSAGE_REQUEST_INDEX_OFFSET];
	
	// Get message's type
	var type = message[Output.MESSAGE_TYPE_OFFSET];
	
	// Check type
	switch(type) {
	
		// Initialize request type
		case Output.INITIALIZE_REQUEST_TYPE:
		
			// Get message's URL query string
			URL_QUERY_STRING = message[Output.MESSAGE_INITIALIZE_URL_QUERY_STRING_OFFSET];
		
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
					Output.STATUS_SUCCESS_VALUE
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
					Output.STATUS_FAILED_VALUE
				]);
			});
		
			// Break
			break;
		
		// Uninitialize request type
		case Output.UNINITIALIZE_REQUEST_TYPE:
		
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
				Output.STATUS_SUCCESS_VALUE
			]);
		
			// Break
			break;
		
		// Legacy information request type, new information request type, or view information request type
		case Output.LEGACY_INFORMATION_REQUEST_TYPE:
		case Output.NEW_INFORMATION_REQUEST_TYPE:
		case Output.VIEW_INFORMATION_REQUEST_TYPE:
		
			// Get message's proof
			var proof = message[Output.MESSAGE_PROOF_OFFSET];
			
			// Get message's commit
			var commit = message[Output.MESSAGE_COMMIT_OFFSET];
			
			// Get message's extended private key or root public key
			var extendedPrivateKeyOrRootPublicKey = message[Output.MESSAGE_EXTENDED_PRIVATE_KEY_OR_ROOT_PUBLIC_KEY_OFFSET];
			
			// Check type
			switch(type) {
			
				// Legacy information request type
				case Output.LEGACY_INFORMATION_REQUEST_TYPE:
			
					// Create legacy proof builder
					var proofBuilder = new LegacyProofBuilder();
					
					// Break
					break;
				
				// New information request type
				case Output.NEW_INFORMATION_REQUEST_TYPE:
				
					// Create new proof builder
					var proofBuilder = new NewProofBuilder();
					
					// Break
					break;
				
				// View information request type
				case Output.VIEW_INFORMATION_REQUEST_TYPE:
				
					// Create view proof builder
					var proofBuilder = new ViewProofBuilder();
					
					// Break
					break;
			}
			
			// Initialize proof builder
			proofBuilder.initialize(extendedPrivateKeyOrRootPublicKey).then(function() {
			
				// Get information
				getInformation(proof, commit, extendedPrivateKeyOrRootPublicKey, proofBuilder).then(function(information) {
				
					// Uninitialize proof builder
					proofBuilder.uninitialize();
				
					// Securely clear extended private key or root public key
					extendedPrivateKeyOrRootPublicKey.fill(0);
				
					// Respond with information
					postMessage([
					
						// Request index
						requestIndex,
					
						// Type
						type,
					
						// Information
						information
					]);
				
				// Catch errors
				}).catch(function(error) {
				
					// Uninitialize proof builder
					proofBuilder.uninitialize();
					
					// Securely clear extended private key or root public key
					extendedPrivateKeyOrRootPublicKey.fill(0);
				
					// Respond with no information
					postMessage([
					
						// Request index
						requestIndex,
					
						// Type
						type,
					
						// Information
						Output.NO_INFORMATION
					]);
				});
			
			// Catch errors
			}).catch(function(error) {
			
				// Securely clear extended private key or root public key
				extendedPrivateKeyOrRootPublicKey.fill(0);
			
				// Respond with no information
				postMessage([
				
					// Request index
					requestIndex,
				
					// Type
					type,
				
					// Information
					Output.NO_INFORMATION
				]);
			});
			
			// Break;
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

// Get information
function getInformation(proof, commit, extendedPrivateKeyOrRootPublicKey, proofBuilder) {

	// Return promise
	return new Promise(function(resolve, reject) {
	
		// Check if commit is valid
		if(Secp256k1Zkp.isValidCommit(commit) === true) {
	
			// Return getting rewind nonce from the proof builder
			return proofBuilder.rewindNonce(commit).then(function(rewindNonce) {
		
				// Check if rewinding bulletproof was successful
				var bulletproof = Secp256k1Zkp.rewindBulletproof(proof, commit, rewindNonce);
				
				if(bulletproof !== Secp256k1Zkp.OPERATION_FAILED) {
				
					// Securely clear rewind nonce
					rewindNonce.fill(0);
				
					// Get amount from bulletproof
					var amount = new BigNumber(bulletproof["Value"]);
				
					// Get message from bulletproof
					var message = bulletproof["Message"];
					
					// Return having the proof builder get the output
					return proofBuilder.getOutput(extendedPrivateKeyOrRootPublicKey, amount, commit, message).then(function(output) {
					
						// Get identifier from output
						var identifier = output[ProofBuilder.OUTPUT_IDENTIFIER_INDEX];
						
						// Get switch type from output
						var switchType = output[ProofBuilder.OUTPUT_SWITCH_TYPE_INDEX];
						
						// Check if output's proof verifies the output's commit
						if(Secp256k1Zkp.verifyBulletproof(proof, commit, new Uint8Array([])) === true) {
					
							// Resolve information
							resolve([
							
								// Amount
								Common.serializeObject(amount),
								
								// Identifier
								Common.serializeObject(identifier),
								
								// Switch type
								switchType
							]);
						}
						
						// Otherwise
						else {
						
							// Resolve no information
							resolve(Output.NO_INFORMATION);
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Resolve no information
						resolve(Output.NO_INFORMATION);
					});
				}
				
				// Otherwise
				else {
				
					// Securely clear rewind nonce
					rewindNonce.fill(0);
				
					// Resolve no information
					resolve(Output.NO_INFORMATION);
				}
			
			// Catch errors
			}).catch(function(error) {
			
				// Resolve no information
				resolve(Output.NO_INFORMATION);
			});
		}
		
		// Otherwise
		else {
		
			// Resolve no information
			resolve(Output.NO_INFORMATION);
		}
	});
}
