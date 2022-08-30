<?php

	// Constants
	
	// Version number
	const VERSION_NUMBER = "1.1.10";
	
	// Version release date
	const VERSION_RELEASE_DATE = "30 Aug 2022 11:39:00 UTC";
	
	// Version changes
	const VERSION_CHANGES = [
		"Fixed parsing Slatepacks."
	];
	
	// Maintenance start time
	const MAINTENANCE_START_TIME = "01 Jan 1970 00:00:00 UTC";

	// Require access code
	const REQUIRE_ACCESS_CODE = FALSE;

	// Copyright year
	const COPYRIGHT_YEAR = 2022;
	
	// Date year string
	const DATE_YEAR_STRING = "Y";
	
	// Grace accent HTML entity
	const GRAVE_ACCENT_HTML_ENTITY = "&#x60;";
	
	// Minutes in an hour
	const MINUTES_IN_AN_HOUR = 60;
	
	// Hours in a day
	const HOURS_IN_A_DAY = 24;
	
	
	// Supporting function implementation
	
	// Encode string
	function encodeString($string) {
	
		// Return string backticks, ampersands, double quotes, single quotes, greater than signs, and less than signs encoded as HTML
		return preg_replace('/`/u', GRAVE_ACCENT_HTML_ENTITY, htmlspecialchars($string, ENT_QUOTES));
	}
	
	// Escape string
	function escapeString($string) {
	
		// Return string with double quotes and back slashes escaped
		return preg_replace('/("|\\\\)/u', "\\\\$1", $string);
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
