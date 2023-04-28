<?php

	// Constants
	
	// Version number
	const VERSION_NUMBER = "2.0.0";
	
	// Version release date
	const VERSION_RELEASE_DATE = "28 Apr 2023 06:58:00 UTC";
	
	// Version changes
	const VERSION_CHANGES = [
		"Fixed bold fonts being displayed inconsistently across different browsers.",
		"Fixed error response messages not being displayed if they contained certain characters.",
		"Fixed detecting when a hardware wallet is locked.",
		"Added options to open the extension version of this service in a tab or window.",
		"Changed the standalone version of this service to use WASM instead of asm.js for some libraries.",
		"Added Chinese translation by grincalf.",
		"Added Greek translation by NickTheG.",
		"Added German translation by High ko XMR.",
		"Added Dutch translation by Ollebollegijs.",
		"Added Czech translation by blumchen."
	];
	
	// Maintenance start time
	const MAINTENANCE_START_TIME = "01 Jan 1970 00:00:00 UTC";

	// Copyright year
	const COPYRIGHT_YEAR = 2022;
	
	// Date year string
	const DATE_YEAR_STRING = "Y";
	
	// Grace accent HTML entity
	const GRAVE_ACCENT_HTML_ENTITY = "&#x60;";
	
	// Seconds in a minute
	const SECONDS_IN_A_MINUTE = 60;
	
	// Minutes in an hour
	const MINUTES_IN_AN_HOUR = 60;
	
	// Hours in a day
	const HOURS_IN_A_DAY = 24;
	
	
	// Supporting function implementation
	
	// Encode string
	function encodeString($string) {
	
		// Return string with backticks, ampersands, double quotes, single quotes, greater than signs, and less than signs encoded as HTML
		return preg_replace('/`/u', GRAVE_ACCENT_HTML_ENTITY, htmlspecialchars($string, ENT_QUOTES));
	}
	
	// Escape string
	function escapeString($string) {
	
		// Return string with double quotes and back slashes escaped
		return preg_replace('/(["\\\\])/u', "\\\\$1", $string);
	}
	
	// Sanitize attribute name
	function sanitizeAttributeName($string) {
	
		// Return string without spaces, equals, double quotes, single quotes, backticks, greater than signs, less than signs, and ampersands
		return preg_replace('/[ ="\'`<>&]/u', "", $string);
	}
	
	// Get year
	function getYear() {
	
		// Return year
		return intval(date(DATE_YEAR_STRING));
	}
	
	// Starts with
	function startsWith($haystack, $needle) {
	
		// Search backwards starting from haystack length characters from the end
		return $needle === "" || mb_strrpos($haystack, $needle, -mb_strlen($haystack)) !== FALSE;
	}
?>
