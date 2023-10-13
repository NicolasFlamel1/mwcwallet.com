<?php

	// Included files
	require_once __DIR__ . "/../backend/common.php";
	require_once __DIR__ . "/../backend/resources.php";
	
	
	// Constants
	
	// Relative root path
	const RELATIVE_ROOT_PATH = "../";
	
	
	// Main function
	
	// Set content type header
	header("Content-Type: application/javascript; charset=" . mb_internal_encoding());
	
	// Set service worker allowed header
	header("Service-Worker-Allowed: " . RELATIVE_ROOT_PATH);

?>// Use strict
"use strict";


// Constants

// Files
const FILES = <?= json_encode($files); ?>;

// Relative root path
const RELATIVE_ROOT_PATH = "<?= escapeString(RELATIVE_ROOT_PATH); ?>";

// Host name
const HOST_NAME = "<?= escapeString(rawurlencode($_SERVER["SERVER_NAME"])); ?>";

// Response not in cache
const RESPONSE_NOT_IN_CACHE = undefined;

// HTML file pattern
const HTML_FILE_PATTERN = /(?:\.html|\/)$/ui;

// Manifest file pattern
const MANIFEST_FILE_PATTERN = /\.webmanifest$/ui;

// Minified file pattern
const MINIFIED_FILE_PATTERN = /\.min(\.[^\.]*)?$/u;

// Index not found
const INDEX_NOT_FOUND = -1;

// Hash bits shift right
const HASH_BITS_SHIFT_RIGHT = 5;

// Maintenance HTTP status
const MAINTENANCE_HTTP_STATUS = 503;

// Maintenance URL
const MAINTENANCE_URL = RELATIVE_ROOT_PATH + "./errors/503.html".substring("./"["length"]);


// Events

// Install event
self.addEventListener("install", function(event) {

	// Wait until
	event.waitUntil(new Promise(function(resolve, reject) {

		// Get cache files
		var cacheFiles = getCacheFiles();
		
		// Get cache version
		var cacheVersion = getCacheVersion(cacheFiles);
		
		// Return opening cache
		return caches.open(cacheVersion).then(function(cache) {
		
			// Return going through all files to cache
			return Promise.all(cacheFiles.map(function(url) {
			
				// Return promise
				return new Promise(function(resolve, reject) {
			
					// Get getting cached response for the file
					return caches.match(url).then(function(response) {
					
						// Get URL parts
						var urlParts = url.split("?");
					
						// Check if cached response doesn't exist, request is for an HTML or manifest file, or the file doesn't have a version
						if(response === RESPONSE_NOT_IN_CACHE || HTML_FILE_PATTERN.test(urlParts[0]) === true || MANIFEST_FILE_PATTERN.test(urlParts[0]) === true || urlParts["length"] === 1) {
						
							// Get checksum
							var checksum = getFileChecksum(url);
							
							// Return getting network response for the file
							return fetch(url, (checksum === "") ? {} : {
							
								// Integrity
								"integrity": checksum
							
							}).then(function(response) {
								
								// Check if response is valid
								if(response["ok"] === true || (response["status"] === MAINTENANCE_HTTP_STATUS && url === MAINTENANCE_URL)) {
							
									// Return setting network response in cache
									return cache.put(url, response).then(function() {
							
										// Resolve
										resolve();
									
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(error);
									});
								}
								
								// Otherwise
								else {
								
									// Reject
									reject();
								}
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
						
						// Otherwise
						else {
						
							// Return setting cached response in cache
							return cache.put(url, response).then(function() {
							
								// Resolve
								resolve();
							
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						}
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				});
			
			// Once all files are caches
			})).then(function() {
			
				// Activate service worker
				return self.skipWaiting().then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			
			// Catch errors
			}).catch(function(error) {
			
				// Reject error
				reject(error);
			});
			
		// Catch errors
		}).catch(function(error) {
		
			// Reject error
			reject(error);
		});
	}));
});

// Activate event
self.addEventListener("activate", function(event) {

	// Wait until
	event.waitUntil(new Promise(function(resolve, reject) {
	
		// Return getting all caches
		return caches.keys().then(function(cacheVersions) {
	
			// Get cache files
			var cacheFiles = getCacheFiles();
			
			// Get cache version
			var cacheVersion = getCacheVersion(cacheFiles);
		
			// Go through all caches
			return Promise.all(cacheVersions.map(function(currentCacheVersion) {
			
				// Return promise
				return new Promise(function(resolve, reject) {
			
					// Check if cache isn't the current cache
					if(currentCacheVersion !== cacheVersion) {
					
						// Return deleting cache
						return caches.delete(currentCacheVersion).then(function() {
						
							// Resolve
							resolve();
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
					
					// Otherwise
					else {
					
						// Resolve
						resolve();
					}
				});
			
			// Once all other caches are deleted
			})).then(function() {
			
				// Claim all clients
				return self.clients.claim().then(function() {
				
					// Resolve
					resolve();
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject(error);
				});
			
			// Catch errors
			}).catch(function(error) {
			
				// Reject error
				reject(error);
			});
		
		// Catch errors
		}).catch(function(error) {
		
			// Reject error
			reject(error);
		});
	}));
});

// Fetch event
self.addEventListener("fetch", function(event) {

	// Check if request isn't a GET request
	if(event["request"]["method"] !== "GET") {
	
		// Use default fetch
		return;
	}

	// Respond with
	event.respondWith(new Promise(function(resolve, reject) {

		// Try
		try {

			// Parse URL
			var parsedUrl = new URL(event["request"]["url"]);
		}
		
		// Catch errors
		catch(error) {
		
			// Reject
			reject();
			
			// Return
			return;
		}
		
		// Check if request goes to the server at /index.html
		if(parsedUrl["hostname"] === HOST_NAME && parsedUrl["pathname"] === "/index.html") {
		
			// Resolve redirect response
			resolve(new Response(new Blob(), {
			
				// Status
				"status": 301,
				
				// Headers
				"headers": {
				
					// Location
					"location": event["request"]["url"].replace("/index.html", "/")
				}
			}));
			
			// Return
			return;
		}
		
		// Get request's cache name
		var cacheName = RELATIVE_ROOT_PATH + parsedUrl["pathname"].substring("/"["length"]) + ((parsedUrl["hostname"] === HOST_NAME && parsedUrl["pathname"] === "/") ? "" : parsedUrl["search"]);
		
		// Check if request isn't a GET request, doesn't go to the server, or is for an HTML or manifest file
		if(event["request"]["method"] !== "GET" || parsedUrl["hostname"] !== HOST_NAME || HTML_FILE_PATTERN.test(parsedUrl["pathname"]) === true || MANIFEST_FILE_PATTERN.test(parsedUrl["pathname"]) === true) {
		
			// Get checksum
			var checksum = (parsedUrl["hostname"] === HOST_NAME) ? getFileChecksum(cacheName) : "";
			
			// Return getting network response for the request
			return fetch(event["request"], (checksum === "") ? {} : {
			
				// Integrity
				"integrity": checksum
			
			}).then(function(networkResponse) {
			
				// Check if request isn't a GET request, doesn't go to the server, or network response is invalid
				if(event["request"]["method"] !== "GET" || parsedUrl["hostname"] !== HOST_NAME || (networkResponse["ok"] !== true && (networkResponse["status"] !== MAINTENANCE_HTTP_STATUS || RELATIVE_ROOT_PATH + parsedUrl["pathname"].substring("/"["length"]) !== MAINTENANCE_URL))) {
				
					// Resolve network response
					resolve(networkResponse);
				}
				
				// Otherwise
				else {
				
					// Get cache files
					var cacheFiles = getCacheFiles();
					
					// Check if request shouldn't be cached
					if(cacheFiles.indexOf(cacheName) === INDEX_NOT_FOUND) {
					
						// Resolve network response
						resolve(networkResponse);
					}
					
					// Otherwise
					else {
					
						// Get cache version
						var cacheVersion = getCacheVersion(cacheFiles);
				
						// Return opening cache
						return caches.open(cacheVersion).then(function(cache) {
					
							// Return setting network response in cache
							return cache.put((parsedUrl["hostname"] === HOST_NAME && parsedUrl["pathname"] === "/") ? event["request"]["url"].split("?")[0] : event["request"], networkResponse.clone()).then(function() {
							
								// Resolve network response
								resolve(networkResponse);
							
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject(error);
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject(error);
						});
					}
				}
			
			// Check if getting network response failed
			}).catch(function(error) {
			
				// Check if request isn't a GET request or doesn't go to the server
				if(event["request"]["method"] !== "GET" || parsedUrl["hostname"] !== HOST_NAME) {
				
					// Reject
					reject();
				}
				
				// Otherwise
				else {
			
					// Return getting cached response for the request
					return caches.match((parsedUrl["hostname"] === HOST_NAME && parsedUrl["pathname"] === "/") ? event["request"]["url"].split("?")[0] : event["request"]).then(function(cachedResponse) {
					
						// Check if cached response doesn't exist
						if(cachedResponse === RESPONSE_NOT_IN_CACHE) {
						
							// Reject
							reject();
						}
						
						// Otherwise
						else {
					
							// Resolve cached response
							resolve(cachedResponse);
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
			});
		}
		
		// Otherwise
		else {
		
			// Return getting cached response for the request
			return caches.match((parsedUrl["hostname"] === HOST_NAME && parsedUrl["pathname"] === "/") ? event["request"]["url"].split("?")[0] : event["request"]).then(function(cachedResponse) {
			
				// Check if cached response doesn't exist
				if(cachedResponse === RESPONSE_NOT_IN_CACHE) {
				
					// Get checksum
					var checksum = (parsedUrl["hostname"] === HOST_NAME) ? getFileChecksum(cacheName) : "";
					
					// Return getting network response for the request
					return fetch(event["request"], (checksum === "") ? {} : {
					
						// Integrity
						"integrity": checksum
						
					}).then(function(networkResponse) {
					
						// Check if request isn't a GET request, doesn't go to the server, or network response is invalid
						if(event["request"]["method"] !== "GET" || parsedUrl["hostname"] !== HOST_NAME || (networkResponse["ok"] !== true && (networkResponse["status"] !== MAINTENANCE_HTTP_STATUS || RELATIVE_ROOT_PATH + parsedUrl["pathname"].substring("/"["length"]) !== MAINTENANCE_URL))) {
						
							// Resolve network response
							resolve(networkResponse);
						}
						
						// Otherwise
						else {
					
							// Get cache files
							var cacheFiles = getCacheFiles();
							
							// Check if request shouldn't be cached
							if(cacheFiles.indexOf(cacheName) === INDEX_NOT_FOUND) {
							
								// Resolve network response
								resolve(networkResponse);
							}
							
							// Otherwise
							else {
							
								// Get cache version
								var cacheVersion = getCacheVersion(cacheFiles);
								
								// Return opening cache
								return caches.open(cacheVersion).then(function(cache) {
							
									// Set network response in cache
									return cache.put((parsedUrl["hostname"] === HOST_NAME && parsedUrl["pathname"] === "/") ? event["request"]["url"].split("?")[0] : event["request"], networkResponse.clone()).then(function() {
									
										// Resolve network response
										resolve(networkResponse);
									
									// Catch errors
									}).catch(function(error) {
									
										// Reject error
										reject(error);
									});
									
								// Catch errors
								}).catch(function(error) {
								
									// Reject error
									reject(error);
								});
							}
						}
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject(error);
					});
				}
				
				// Otherwise
				else {
			
					// Resolve cached response
					resolve(cachedResponse);
				}
			
			// Catch errors
			}).catch(function(error) {
			
				// Reject error
				reject(error);
			});
		}
	}));
});

// Message event
self.addEventListener("message", function(event) {

	// Get version
	var version = hash(JSON.stringify(FILES));

	// Respond with version
	event["source"].postMessage(version);
});


// Supporting functon implementation

// Add minified suffix
function addMinifiedSuffix(file) {

	// Get file's suffix offset
	var suffixOffset = file.lastIndexOf(".");
	
	// Check if file contains no suffix
	if(suffixOffset === INDEX_NOT_FOUND || suffixOffset < "./"["length"]) {
	
		// Return file with minified suffix at the end
		return file + ".min";
	}
	
	// Otherwise
	else {
	
		// Return file with minified suffix insert before its suffix
		return file.substring(0, suffixOffset) + ".min" + file.substring(suffixOffset);
	}
}

// Get cache files
function getCacheFiles() {

	// Initialize cache files
	var cacheFiles = [];
	
	// Go through all files
	for(var file in FILES) {
	
		if(FILES.hasOwnProperty(file) === true) {
		
			// Check if file should be cached
			if(FILES[file]["Cache"] === true) {
			
				// Append file with version query to cache files
				cacheFiles.push(RELATIVE_ROOT_PATH + ((FILES[file]["Minified"] === true) ? addMinifiedSuffix(file) : file).substring("./"["length"]) + ((FILES[file]["Version"] !== 0) ? "?" + FILES[file]["Version"] : ""));
			}
		}
	}
	
	// Return cache files
	return cacheFiles;
}

// Get file checksum
function getFileChecksum(file) {

	// Get file parts
	var fileParts = file.split("?");

	// Get original file from file
	var originalFile = "./" + fileParts[0].substring(RELATIVE_ROOT_PATH["length"]).replace(MINIFIED_FILE_PATTERN, "$1");
	
	// Return original file's checksum if it exists
	return (originalFile in FILES === true && FILES[originalFile]["Checksum"] !== null && ((FILES[originalFile]["Version"] === 0 && fileParts["length"] === 1) || (FILES[originalFile]["Version"] !== 0 && fileParts["length"] >= 2 && FILES[originalFile]["Version"].toFixed() === fileParts[1]))) ? "sha512-" + FILES[originalFile]["Checksum"] : "";
}

// Get cache version
function getCacheVersion(cacheFiles) {

	// Return cache version
	return hash(cacheFiles.toString());
}

// Hash
function hash(string) {

	// Initialize hash
	var hash = 0;
	
	// Go through all characters in the string
	for(var i = 0; i < string["length"]; ++i) {
	
		// Get the character as a number
		var character = string.charCodeAt(i);
		
		// Update the hash using the character
		hash = ((hash << HASH_BITS_SHIFT_RIGHT) - hash) + character;
		
		// Limit the hash
		hash |= 0;
	}
	
	// Return hash
	return hash.toFixed();
}
