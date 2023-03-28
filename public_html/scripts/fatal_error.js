// Use strict
"use strict";


// Classes

// Fatal error class
class FatalError {

	// Public
		
		// Constructor
		constructor(errorType = FatalError.UNKNOWN_ERROR) {
		
			// Check if a fatal error hasn't occurred
			if(FatalError.errorOccurred === false) {
			
				// Set that a fatal error occurred
				FatalError.errorOccurred = true;
		
				// Check error type
				switch(errorType) {
				
					// Local storage error
					case FatalError.LOCAL_STORAGE_ERROR:
					
						// Log error
						console.log("A local storage error occurred.");
					
						// Break
						break;
					
					// Database error
					case FatalError.DATABASE_ERROR:
					
						// Log error
						console.log("A database error occurred.");
					
						// Break
						break;
					
					// Unknown error and default
					case FatalError.UNKNOWN_ERROR:
					default:
					
						// Log error
						console.log("An unknown error occurred.");
					
						// Break
						break;
				}
				
				// Log stack trace
				console.trace();
				
				// Prevent extension from interrupting on close
				Extension.preventInterruptOnClose();
				
				// Check if not an extension and not loading from file
				if(Common.isExtension() === false && location["protocol"] !== Common.FILE_PROTOCOL) {
				
					// Go to error page
					location.replace(((location["protocol"] === Common.HTTPS_PROTOCOL) ? Common.HTTPS_PROTOCOL : Common.HTTP_PROTOCOL) + "//" + location["hostname"] + FatalError.ERROR_PAGE_URL);
				}
				
				// Otherwise
				else {
				
					// Close
					window.close();
				}
			}
		}
		
		// Local storage error
		static get LOCAL_STORAGE_ERROR() {
		
			// Return local storage error
			return 0;
		}
		
		// Database error
		static get DATABASE_ERROR() {
		
			// Return database error
			return FatalError.LOCAL_STORAGE_ERROR + 1;
		}
		
		// Unknown error
		static get UNKNOWN_ERROR() {
		
			// Return unknown error
			return FatalError.DATABASE_ERROR + 1;
		}
	
	// Private
	
		// Error page URL
		static get ERROR_PAGE_URL() {
		
			// Return error page URL
			return "/errors/error.html";
		}
}


// Main function

// Set global object's fatal error
globalThis["FatalError"] = FatalError;

// Set fatal error error occurred
FatalError.errorOccurred = false;

// Window error event
$(window).on("error", function() {

	// Check if using application error handler
	if(usingApplicationErrorHandler() === true)

		// Trigger a fatal error
		new FatalError(FatalError.UNKNOWN_ERROR);
});
