// Use strict
"use strict";


// Classes

// Log class
class Log {

	// Public
	
		// Initialize
		static initialize() {
		
			// Get log display
			Log.logDisplay = $("div.unlocked").find("div.sections").find("div.log");
			
			// Check if log display exists
			if(Log.logDisplay["length"] !== 0) {
		
				// Get message display
				Log.messageDisplay = Log.logDisplay.find("div.messages");
				
				// Log message
				Log.logMessage(Language.getDefaultTranslation('Log initialized.'), [], ACCESS_TIMESTAMP);
				
				// Check if messages exist
				if(typeof Log.messages !== "undefined") {
				
					// Go through all messages
					for(var i = 0; i < Log.messages["length"]; ++i) {
					
						// Get message
						var message = Log.messages[i];
						
						// Log message
						Log.logMessage(message[Log.MESSAGE_TEXT_INDEX], message[Log.MESSAGE_TEXT_ARGUMENTS_INDEX], message[Log.MESSAGE_TIMESTAMP_INDEX]);
					}
				}
			}
		}
		
		// Log message
		static logMessage(text, textArguments = [], timestamp = Date.now()) {
		
			// Check if log has been initialized and the log display exists
			if(typeof Log.logDisplay !== "undefined" && Log.logDisplay["length"] !== 0) {
		
				// Get if log display is scrolled to the bottom
				var scrollToBottom = Math.abs(Log.logDisplay.get(0)["scrollHeight"] - Log.logDisplay.get(0)["clientHeight"] - Log.logDisplay.get(0)["scrollTop"]) <= Scroll.TOLERANCE || Log.logDisplay.get(0)["scrollHeight"] - Log.logDisplay.get(0)["scrollTop"] <= Log.logDisplay.get(0)["clientHeight"];
				
				// Append message to message display
				Log.messageDisplay.append("<p class=\"contextMenu\">" + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('%1$u:'), [
				
					// Timestamp
					timestamp.toFixed()
				
				], "timestamp") + Language.createTranslatableContainer("<span>", Language.getDefaultTranslation('(?<=:) ')) + Language.createTranslatableContainer("<span>", text, textArguments) + "</p>");
				
				// Check if log display was scrolled to the bottom
				if(scrollToBottom === true) {
				
					// Request animation frame
					requestAnimationFrame(function() {
				
						// Scroll log display to the bottom
						Log.logDisplay.get(0)["scrollTop"] = Log.logDisplay.get(0)["scrollHeight"] - Log.logDisplay.get(0)["clientHeight"] + Scroll.TOLERANCE;
					});
				}
				
				// Trigger message event
				$(document).trigger(Log.MESSAGE_EVENT);
			}
			
			// Otherwise
			else {
			
				// Check if messages doesn't exist
				if(typeof Log.messages === "undefined") {
				
					// Create messages
					Log.messages = [];
				}
			
				// Append message to list
				Log.messages.push([
				
					// Text
					text,
					
					// Text arguments
					textArguments,
					
					// Timestamp
					timestamp
				]);
			}
		}
		
		// Message event
		static get MESSAGE_EVENT() {
		
			// Return message event
			return "LogMessageEvent";
		}
	
	// Private
	
		// Message text index
		static get MESSAGE_TEXT_INDEX() {
		
			// Return message text index
			return 0;
		}
		
		// Message text arguments index
		static get MESSAGE_TEXT_ARGUMENTS_INDEX() {
		
			// Return message text arguments index
			return Log.MESSAGE_TEXT_INDEX + 1;
		}
		
		// Message timestamp index
		static get MESSAGE_TIMESTAMP_INDEX() {
		
			// Return message timestamp index
			return Log.MESSAGE_TEXT_ARGUMENTS_INDEX + 1;
		}
}


// Main function

// Set global object's log
globalThis["Log"] = Log;

// Ready event
$(function() {

	// Initialize log
	Log.initialize();
});
