// Use strict
"use strict";


// Classes

// Service worker installer class
class ServiceWorkerInstaller {

	// Public

		// Constructor
		constructor(version) {
		
			// Set version
			this.version = version;
		
			// Set service worker to no service worker
			this.serviceWorker = ServiceWorkerInstaller.NO_SERVICE_WORKER;
			
			// Set allow updates
			this.allowUpdates = false;
			
			// Check if not an extension and not loading from file
			if(Common.isExtension() === false && location["protocol"] !== Common.FILE_PROTOCOL) {
		
				// Check if service workers are supported
				if(typeof navigator === "object" && navigator !== null && "serviceWorker" in navigator === true) {
				
					// Set installation status to installing
					this.installationStatus = ServiceWorkerInstaller.INSTALLING_STATUS;
				
					// Check if document is complete
					if(document["readyState"] === "complete")
					
						// Register
						this.register();
					
					// Otherwise
					else {
					
						// Set self
						var self = this;
					
						// Window load event
						$(window).on("load", function() {
						
							// Register
							self.register();
						});
					}
				}
				
				// Otherwise
				else {
				
					// Set installation status to unsupported
					this.installationStatus = ServiceWorkerInstaller.UNSUPPORTED_STATUS;
				}
			}
			
			// Otherwise
			else {
			
				// Set installation status to unsupported
				this.installationStatus = ServiceWorkerInstaller.UNSUPPORTED_STATUS;
			}
		}
		
		// Get installation status
		getInstallationStatus() {
		
			// Return installation status
			return this.installationStatus;
		}
		
		// Installing status
		static get INSTALLING_STATUS() {
		
			// Return installing status
			return 0;
		}
		
		// Unsupported status
		static get UNSUPPORTED_STATUS() {
		
			// Return unsupported status
			return ServiceWorkerInstaller.INSTALLING_STATUS + 1;
		}
		
		// Installed status
		static get INSTALLED_STATUS() {
		
			// Return installed status
			return ServiceWorkerInstaller.UNSUPPORTED_STATUS + 1;
		}
		
		// Failed status
		static get FAILED_STATUS() {
		
			// Return failed status
			return ServiceWorkerInstaller.INSTALLED_STATUS + 1;
		}
		
		// Install succeeded event
		static get INSTALL_SUCCEEDED_EVENT() {
		
			// Return install succeeded event
			return "ServiceWorkerInstallerInstallSucceededEvent";
		}
		
		// Install failed event
		static get INSTALL_FAILED_EVENT() {
		
			// Return install failed event
			return "ServiceWorkerInstallerInstallFailedEvent";
		}
		
		// Update available event
		static get UPDATE_AVAILABLE_EVENT() {
		
			// Return update available event
			return "ServiceWorkerInstallerUpdateAvailableEvent";
		}
	
	// Private
	
		// Register
		register() {
		
			// Set self
			var self = this;
		
			// Register service worker
			navigator["serviceWorker"].register(getResource(ServiceWorkerInstaller.FILE_LOCATION), {
			
				// Scope
				"scope": ServiceWorkerInstaller.SCOPE
			
			// Check if registration was successful
			}).then(function(registration) {
			
				// Set service worker to registration
				self.serviceWorker = registration;
			
				// Try
				try {
			
					// Save last update timestamp in local storage
					localStorage.setItem(ServiceWorkerInstaller.SERVICE_WORKER_LAST_UPDATE_TIMESTAMP_LOCAL_STORAGE_NAME, Common.getCurrentTimestamp().toFixed());
				}
				
				// Catch errors
				catch(error) {
				
					// Trigger a fatal error
					new FatalError(FatalError.LOCAL_STORAGE_ERROR);
					
					// Return
					return;
				}
				
				// Get active service worker
				var activeServiceWorker = self.serviceWorker["active"];
				
				// Check if there is no existing active service worker
				if(activeServiceWorker === ServiceWorkerInstaller.NO_ACTIVE_SERVICE_WORKER) {
				
					// Get installing service worker
					var installingServiceWorker = self.serviceWorker["installing"];
					
					// Check if a service worker is installing
					if(installingServiceWorker !== ServiceWorkerInstaller.NO_INSTALLING_SERVICE_WORKER) {
					
						// Save initial state change function
						var initialStateChangeFunction = installingServiceWorker["onstatechange"];
						
						// Installing service worker state change event
						installingServiceWorker["onstatechange"] = function(event) {
							
							// Check if installing service worker's state is activated
							if(event["target"]["state"] === ServiceWorkerInstaller.ACTIVATED_STATE) {
							
								// Restore initial state change function
								installingServiceWorker["onstatechange"] = initialStateChangeFunction;
								
								// Set installation status to installed
								self.installationStatus = ServiceWorkerInstaller.INSTALLED_STATUS;
							
								// Trigger install succeeded event
								$(self).trigger(ServiceWorkerInstaller.INSTALL_SUCCEEDED_EVENT);
								
								// Service worker update found event
								self.serviceWorker["onupdatefound"] = function() {
								
									// Get installing service worker
									installingServiceWorker = self.serviceWorker["installing"];
									
									// Check if a service worker is installing
									if(installingServiceWorker !== ServiceWorkerInstaller.NO_INSTALLING_SERVICE_WORKER) {
									
										// Save initial state change function
										initialStateChangeFunction = installingServiceWorker["onstatechange"];
										
										// Installing service worker state change event
										installingServiceWorker["onstatechange"] = function(event) {
										
											// Check if installing service worker's state is activated
											if(event["target"]["state"] === ServiceWorkerInstaller.ACTIVATED_STATE) {
											
												// Restore initial state change function
												installingServiceWorker["onstatechange"] = initialStateChangeFunction;
												
												// Trigger update available event
												$(self).trigger(ServiceWorkerInstaller.UPDATE_AVAILABLE_EVENT);
											}
										};
									}
								};
								
								// Set allow updates
								self.allowUpdates = true;
							}
							
							// Otherwise check if service worker's state is redundant
							else if(event["target"]["state"] === ServiceWorkerInstaller.REDUNDANT_STATE) {
							
								// Restore initial state change function
								installingServiceWorker["onstatechange"] = initialStateChangeFunction;
								
								// Set installation status to failed
								self.installationStatus = ServiceWorkerInstaller.FAILED_STATUS;
							
								// Trigger install failed event
								$(self).trigger(ServiceWorkerInstaller.INSTALL_FAILED_EVENT);
							}
						};
					}
					
					// Otherwise
					else {
					
						// Set installation status to failed
						self.installationStatus = ServiceWorkerInstaller.FAILED_STATUS;
						
						// Trigger install failed event
						$(self).trigger(ServiceWorkerInstaller.INSTALL_FAILED_EVENT);
					}
				}
				
				// Otherwise
				else {
				
					// Service worker message event
					navigator["serviceWorker"]["onmessage"] = function(event) {
					
						// Check if active service worker is the current version
						if(event["data"] === self.version.getVersion()) {
						
							// Set installation status to installed
							self.installationStatus = ServiceWorkerInstaller.INSTALLED_STATUS;
							
							// Trigger install succeeded event
							$(self).trigger(ServiceWorkerInstaller.INSTALL_SUCCEEDED_EVENT);
							
							// Service worker update found event
							self.serviceWorker["onupdatefound"] = function() {
							
								// Get installing service worker
								installingServiceWorker = self.serviceWorker["installing"];
								
								// Check if a service worker is installing
								if(installingServiceWorker !== ServiceWorkerInstaller.NO_INSTALLING_SERVICE_WORKER) {
								
									// Save initial state change function
									initialStateChangeFunction = installingServiceWorker["onstatechange"];
									
									// Installing service worker state change event
									installingServiceWorker["onstatechange"] = function(event) {
									
										// Check if installing service worker's state is activated
										if(event["target"]["state"] === ServiceWorkerInstaller.ACTIVATED_STATE) {
										
											// Restore initial state change function
											installingServiceWorker["onstatechange"] = initialStateChangeFunction;
											
											// Trigger update available event
											$(self).trigger(ServiceWorkerInstaller.UPDATE_AVAILABLE_EVENT);
										}
									};
								}
							};
							
							// Set allow updates
							self.allowUpdates = true;
						}
						
						// Otherwise
						else {
						
							// Service worker update found event
							self.serviceWorker["onupdatefound"] = function() {
							
								// Get installing service worker
								var installingServiceWorker = self.serviceWorker["installing"];
								
								// Check if a service worker is installing
								if(installingServiceWorker !== ServiceWorkerInstaller.NO_INSTALLING_SERVICE_WORKER) {
								
									// Save initial state change function
									var initialStateChangeFunction = installingServiceWorker["onstatechange"];
									
									// Installing service worker state change event
									installingServiceWorker["onstatechange"] = function(event) {
									
										// Check if installing service worker's state is activated
										if(event["target"]["state"] === ServiceWorkerInstaller.ACTIVATED_STATE) {
										
											// Restore initial state change function
											installingServiceWorker["onstatechange"] = initialStateChangeFunction;
											
											// Set installation status to installed
											self.installationStatus = ServiceWorkerInstaller.INSTALLED_STATUS;
											
											// Trigger install succeeded event
											$(self).trigger(ServiceWorkerInstaller.INSTALL_SUCCEEDED_EVENT);
											
											// Service worker update found event
											self.serviceWorker["onupdatefound"] = function() {
											
												// Get installing service worker
												installingServiceWorker = self.serviceWorker["installing"];
												
												// Check if a service worker is installing
												if(installingServiceWorker !== ServiceWorkerInstaller.NO_INSTALLING_SERVICE_WORKER) {
												
													// Save initial state change function
													initialStateChangeFunction = installingServiceWorker["onstatechange"];
													
													// Installing service worker state change event
													installingServiceWorker["onstatechange"] = function(event) {
													
														// Check if installing service worker's state is activated
														if(event["target"]["state"] === ServiceWorkerInstaller.ACTIVATED_STATE) {
														
															// Restore initial state change function
															installingServiceWorker["onstatechange"] = initialStateChangeFunction;
															
															// Trigger update available event
															$(self).trigger(ServiceWorkerInstaller.UPDATE_AVAILABLE_EVENT);
														}
													};
												}
											};
											
											// Set allow updates
											self.allowUpdates = true;
										}
										
										// Otherwise check if service worker's state is redundant
										else if(event["target"]["state"] === ServiceWorkerInstaller.REDUNDANT_STATE) {
										
											// Restore initial state change function
											installingServiceWorker["onstatechange"] = initialStateChangeFunction;
											
											// Set installation status to failed
											self.installationStatus = ServiceWorkerInstaller.FAILED_STATUS;
										
											// Trigger install failed event
											$(self).trigger(ServiceWorkerInstaller.INSTALL_FAILED_EVENT);
										}
									};
								}
								
								// Otherwise
								else {
								
									// Set installation status to failed
									self.installationStatus = ServiceWorkerInstaller.FAILED_STATUS;
									
									// Trigger install failed event
									$(self).trigger(ServiceWorkerInstaller.INSTALL_FAILED_EVENT);
								}
							};
						}
					};
					
					// Request version from active service worker
					activeServiceWorker.postMessage("");
				}
				
				// Set interval
				setInterval(function() {
				
					// Check for updates
					self.checkForUpdates();
				
				}, ServiceWorkerInstaller.CHECK_FOR_UPDATES_INTERVAL_SECONDS * Common.MILLISECONDS_IN_A_SECOND);
			
			// Catch errors
			}).catch(function(error) {
			
				// Set installation status to failed
				self.installationStatus = ServiceWorkerInstaller.FAILED_STATUS;
				
				// Trigger install failed event
				$(self).trigger(ServiceWorkerInstaller.INSTALL_FAILED_EVENT);
			});
		}
		
		// Check for updates
		checkForUpdates() {
		
			// Get last update timestamp from local storage
			var lastUpdateTimestamp = localStorage.getItem(ServiceWorkerInstaller.SERVICE_WORKER_LAST_UPDATE_TIMESTAMP_LOCAL_STORAGE_NAME);
			
			// Check if time to check for an update
			if(lastUpdateTimestamp === Common.INVALID_LOCAL_STORAGE_ITEM || parseInt(lastUpdateTimestamp, Common.DECIMAL_NUMBER_BASE) <= Common.getCurrentTimestamp() - ServiceWorkerInstaller.UPDATE_EXPIRATION_SECONDS) {
			
				// Try
				try {
			
					// Save last update timestamp in local storage
					localStorage.setItem(ServiceWorkerInstaller.SERVICE_WORKER_LAST_UPDATE_TIMESTAMP_LOCAL_STORAGE_NAME, Common.getCurrentTimestamp().toFixed());
				}
				
				// Catch errors
				catch(error) {
				
					// Trigger a fatal error
					new FatalError(FatalError.LOCAL_STORAGE_ERROR);
					
					// Return
					return;
				}
				
				// Check if service worker exists and updates are allowed
				if(this.serviceWorker !== ServiceWorkerInstaller.NO_SERVICE_WORKER && this.allowUpdates === true) {
				
					// Update service worker and catch errors
					this.serviceWorker.update().catch(function(error) {
					
					});
				}
			}
		}
		
		// No service worker
		static get NO_SERVICE_WORKER() {
		
			// Return no service worker
			return null;
		}
		
		// File location
		static get FILE_LOCATION() {
		
			// Return file location
			return "./scripts/service_worker.js";
		}
		
		// Scope
		static get SCOPE() {
		
			// Return scope
			return "./";
		}
		
		// Service worker Last update timestamp local storage name
		static get SERVICE_WORKER_LAST_UPDATE_TIMESTAMP_LOCAL_STORAGE_NAME() {
		
			// Return service worker last update timestamp local storage name
			return "Service Worker Last Update Timestamp";
		}
		
		// Check for updates interval seconds
		static get CHECK_FOR_UPDATES_INTERVAL_SECONDS() {
		
			// Return check for updates interval seconds
			return 2 * Common.MINUTES_IN_AN_HOUR * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Update expiration seconds
		static get UPDATE_EXPIRATION_SECONDS() {
		
			// Return update expiration seconds
			return 1 * Common.HOURS_IN_A_DAY * Common.MINUTES_IN_AN_HOUR * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Activated state
		static get ACTIVATED_STATE() {
		
			// Return activated state
			return "activated";
		}
		
		// Redundant state
		static get REDUNDANT_STATE() {
		
			// Return redundant state
			return "redundant";
		}
		
		// No active service worker
		static get NO_ACTIVE_SERVICE_WORKER() {
		
			// Return no active service worker
			return null;
		}
		
		// No installing service worker
		static get NO_INSTALLING_SERVICE_WORKER() {
		
			// Return no installing service worker
			return ServiceWorkerInstaller.NO_ACTIVE_SERVICE_WORKER;
		}
}


// Main function

// Set global object's service worker installer
globalThis["ServiceWorkerInstaller"] = ServiceWorkerInstaller;
