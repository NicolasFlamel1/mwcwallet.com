<?php

	// Append American English to available languages
	$availableLanguages["en-US"] = [
	
		// Constants
		"Constants" => [
		
			// Language
			"Language" => "English",
			
			// Direction
			"Direction" => "ltr",
			
			// Image
			"Image" => "./images/countries/america.svg",
			
			// Currency
			"Currency" => "USD",
			
			// Fallback
			"Fallback" => "en"
		],
		
		// Text
		"Text" => [
			'(?<=,) ' => ' ',
			'(?<=.) ' => ' ',
			'(?<=:) ' => ' ',
			',(?= )' => ',',
		]
	];
?>
