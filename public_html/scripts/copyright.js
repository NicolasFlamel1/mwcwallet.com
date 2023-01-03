// Use strict
"use strict";


// Classes

// Copyright class
class Copyright {

	// Public

		// Initialize
		static initialize() {
		
			// Update
			Copyright.update();
		}
	
	// Private
	
		// Update
		static update() {
		
			// Get current timestamp
			var currentTimestamp = new Date();
		
			// Get current year
			var currentYear = currentTimestamp.getFullYear();
			
			// Check if the current year is greater than the copyright year
			if(currentYear > COPYRIGHT_YEAR) {
			
				// Get new date copyright
				var newDateCopyright = $(Language.createTranslatableContainer("<meta>", Language.getDefaultTranslation('%1$s–%2$s'), [COPYRIGHT_YEAR.toFixed(), currentYear.toFixed()]));
			
				// Get new rights
				var newRights = $(Language.createTranslatableContainer("<meta>", Language.getDefaultTranslation('© %1$s–%2$s Nicolas Flamel.'), [COPYRIGHT_YEAR.toFixed(), currentYear.toFixed()]));
			}
			
			// Otherwise
			else {
			
				// Get new date copyright
				var newDateCopyright = $(Language.createTranslatableContainer("<meta>", "%1$s", [COPYRIGHT_YEAR.toFixed()]));
			
				// Get new rights
				var newRights = $(Language.createTranslatableContainer("<meta>", Language.getDefaultTranslation('© %1$s Nicolas Flamel.'), [COPYRIGHT_YEAR.toFixed()]));
			}
			
			// Set new date copyright's name
			newDateCopyright.attr("name", Copyright.DATE_COPYRIGHT_NAME);
			
			// Set new rights's name
			newRights.attr("name", Copyright.RIGHTS_NAME);
			
			// Replace date copyright with the new date copyright
			$("meta[name=\"" + Copyright.DATE_COPYRIGHT_NAME + "\"]").replaceWith(newDateCopyright);
			
			// Replace rights with the new rights
			$("meta[name=\"" + Copyright.RIGHTS_NAME + "\"]").replaceWith(newRights);
			
			// Get next year timestamp
			var nextYearTimestamp = new Date(currentYear + 1, Common.JANUARY_MONTH_INDEX);
			
			// Set timeout
			setTimeout(function() {
			
				// Update
				Copyright.update();
			
			}, Math.min(nextYearTimestamp - currentTimestamp, Common.INT32_MAX_VALUE));
		}
		
		// Date copyright name
		static get DATE_COPYRIGHT_NAME() {
		
			// Return date copyright name
			return "dcterms.dateCopyrighted";
		}
		
		// Rights name
		static get RIGHTS_NAME() {
		
			// Return rights name
			return "dcterms.rights";
		}
}


// Main function

// Set global object's copyright
globalThis["Copyright"] = Copyright;

// Ready event
$(function() {

	// Initialize copyright
	Copyright.initialize();
});
