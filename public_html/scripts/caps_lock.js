// Use strict
"use strict";


// Classes

// Caps lock class
class CapsLock {

	// Public
	
		// Constructor
		constructor() {
		
			// Set state
			this.state = false;
		
			// Get is linux
			this.isLinux = (typeof navigator === "object" && navigator !== null) ? (("userAgentData" in navigator === true && "platform" in navigator["userAgentData"] === true) ? navigator["userAgentData"]["platform"] : navigator["platform"]).toLowerCase().indexOf("linux") !== Common.INDEX_NOT_FOUND : false;
			
			// Turning off
			this.turningOff = false;
			
			// Get body display
			this.bodyDisplay = $("body");
			
			// Set self
			var self = this;
			
			// Document key down, key up, mouse down, mouse up, and mousemove event
			$(document).on("keydown keyup mousedown mouseup mousemove", function(event) {
			
				// Check if Linux, event is key up or key down, and caps lock is the key
				if(self.isLinux === true && (event["type"] === "keyup" || event["type"] === "keydown") && event["originalEvent"]["code"] === "CapsLock") {
				
					// Check if event is key down
					if(event["type"] === "keydown") {
					
						// Check if caps lock is off
						if(event["originalEvent"].getModifierState("CapsLock") === false) {
						
							// Check if state is off
							if(self.state === false) {
							
								// Set state
								self.state = true;
								
								// Set that body display has caps lock
								self.bodyDisplay.addClass("capsLock");
							}
						}
						
						// Otherwise
						else
						
							// Set turning off
							self.turningOff = true;
					}
					
					// Otherwise assume event is key up
					else {
					
						// Check if turning off
						if(self.turningOff === true) {
						
							// Clear turning off
							self.turningOff = false;
							
							// Check if state is on
							if(self.state === true) {
							
								// Clear state
								self.state = false;
								
								// Set that body display doesn't have caps lock
								self.bodyDisplay.removeClass("capsLock");
							}
						}
					}
				}
				
				// Otherwise check if event includes the ability to get the modifier state
				else if(typeof event === "object" && event !== null && "originalEvent" in event === true && typeof event["originalEvent"] === "object" && event["originalEvent"] !== null && "getModifierState" in event["originalEvent"] === true) {
			
					// Check if caps lock is on
					if(event["originalEvent"].getModifierState("CapsLock") === true) {
					
						// Check if state is off
						if(self.state === false) {
						
							// Set state
							self.state = true;
							
							// Set that body display has caps lock
							self.bodyDisplay.addClass("capsLock");
						}
					}
					
					// Otherwise check if caps lock is off
					else if(event["originalEvent"].getModifierState("CapsLock") === false) {
					
						// Check if state is on
						if(self.state === true) {
						
							// Clear state
							self.state = false;
							
							// Set that body display doesn't have caps lock
							self.bodyDisplay.removeClass("capsLock");
						}
					}
				}
			});
		}
		
		// Is on
		isOn() {
		
			// Return if caps lock is on
			return this.state === true;
		}
		
		// Is off
		isOff() {
		
			// Return if not on
			return this.isOn() === false;
		}
}


// Main function

// Set global object's caps lock
globalThis["CapsLock"] = CapsLock;
