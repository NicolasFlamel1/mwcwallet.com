<?php

	// Included files
	require_once __DIR__ . "/../backend/common.php";
	require_once __DIR__ . "/../backend/language.php";
	
	
	// Main function
	
	// Set content type header
	header("Content-Type: application/javascript; charset=" . mb_internal_encoding());

?>// Use strict
"use strict";


// Constants

// Available languages
var AVAILABLE_LANGUAGES = <?= json_encode(getAvailableLanguages()); ?>;
