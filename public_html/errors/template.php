<?php
	
	// Included files
	require_once __DIR__ . "/../backend/common.php";
	require_once __DIR__ . "/../backend/language.php";
	require_once __DIR__ . "/../backend/resources.php";
	
	
	// Constants
	
	// Language
	$language = getLanguage();
	
	// Get year
	$year = getYear();
	
	// Is crawler
	$isCrawler = array_key_exists("HTTP_USER_AGENT", $_SERVER) === TRUE && is_string($_SERVER["HTTP_USER_AGENT"]) === TRUE && mb_stristr($_SERVER["HTTP_USER_AGENT"], "googlebot") !== FALSE;
	
	
	// Main function
	
	// Set content language header
	header("Content-Language: " . $language);

?><!DOCTYPE html>
<html class="translatable" lang="<?= encodeString($language); ?>" dir="<?= encodeString(getConstant("Direction")); ?>">

<head>

	<meta charset="UTF-8">
	<meta name="robots" content="none">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<base href="<?= "http" . ((array_key_exists("HTTPS", $_SERVER) === TRUE && $_SERVER["HTTPS"] === "on") ? "s" : "") . "://" . rawurlencode($_SERVER["SERVER_NAME"]) . "/errors/"; ?>">
	
	<script>
	
		// Use strict
		"use strict";
		
		
		// Main function
		
		// Log message
		console.log("%c%s", "color: red; font-size: 30px; text-transform: uppercase;", "<?= escapeString(getTranslation('If someone asked you to copy/paste something here you are being scammed!!!')); ?>");
		
		// Make older browsers aware of newer tags
		document.createElement("aside");
		document.createElement("section");
	
	</script>
	
	<link rel="preload" as="image" href=".<?= encodeString(getResource("./images/logo_big.svg")); ?>" type="image/svg+xml">
	<link rel="preload" as="image" href=".<?= encodeString(getResource("./images/logo_small.svg")); ?>" type="image/svg+xml">
	<link rel="preload" as="font" href=".<?= encodeString(getResource("./fonts/open_sans/open_sans-1.10.woff2")); ?>" type="font/woff2" crossorigin="anonymous">
	<link rel="preload" as="font" href=".<?= encodeString(getResource("./fonts/open_sans/open_sans_semibold-1.10.woff2")); ?>" type="font/woff2" crossorigin="anonymous">
	
	<link rel="stylesheet" type="text/css" href=".<?= encodeString(getResource("./styles/normalize.css-8.0.1.css")); ?>" integrity="<?= encodeString(getChecksum("./styles/normalize.css-8.0.1.css")); ?>">
	<link rel="stylesheet" type="text/css" href=".<?= encodeString(getResource("./fonts/open_sans/open_sans.css")); ?>" integrity="<?= encodeString(getChecksum("./fonts/open_sans/open_sans.css")); ?>">
	<link rel="stylesheet" type="text/css" href=".<?= encodeString(getResource("./fonts/font_awesome/font_awesome.css")); ?>" integrity="<?= encodeString(getChecksum("./fonts/font_awesome/font_awesome.css")); ?>">
	
	<style>
	
		.hide {
			display: none;
		}
		
		* {
			touch-action: none;
		}
		
		p, li, h2, h3 {
			cursor: default;
		}
		
		::selection {
			background: #D4B7F2;
		}
		
		.scrollable, .scrollable * {
			touch-action: pan-y;
		}
		
		:focus {
			outline: none !important;
		}

		::-ms-reveal, ::-ms-clear {
			display: none !important;
		}

		::-webkit-caps-lock-indicator, ::-webkit-credentials-auto-fill-button {
			display: none !important;
			width: 0 !important;
			margin: 0 !important;
		}

		::-moz-focus-inner {
			border: 0 !important;
		}

		select:-moz-focusring {
			color: transparent !important;
			-moz-text-shadow: 0 0 0 white !important;
			text-shadow: 0 0 0 white !important;
		}

		[draggable] {
			-ms-user-select: none;
			-mox-user-select: none;
			-webkit-user-select: none;
			-o-user-select: none;
			user-select: none;
			cursor: move;
		}
	
		@viewport {
			zoom: 1.0;
			width: device-width;
		}
		
		html {
			margin: 0;
			padding: 0;
			height: 100%;
		}

		body {
			white-space: normal;
			white-space: break-spaces;
			padding: 0;
			width: 100%;
			margin: auto;
			font-family: "Open Sans", Arial, sans-serif;
			height: 100%;
			position: fixed;
			-moz-user-select: none;
			-webkit-user-select: none;
			-o-user-select: none;
			-ms-user-select: none;
			user-select: none;
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			top: 0;
			left: 0;
			background: #7A00D9;
			background: linear-gradient(to right, #9E00E7, #3600C9);
			min-width: 250px;
			min-height: 350px;
			overflow: hidden;
			font-size: 100%;
			-webkit-font-smoothing: antialiased;
		}
		
		body.loading, body.loading * {
			cursor: wait !important;
		}

		body > div {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			position: relative;
			min-height: 0;
			align-items: center;
		}

		body > div > div {
			align-items: center;
			height: 100%;
			position: relative;
			top: 0;
			left: 0;
			padding: 0;
			margin: 0 auto;
			flex-grow: 0;
			display: flex;
			flex-direction: column;
			width: 100%;
			justify-content: center;
			min-height: 0;
		}
		
		main {
			height: 100%;
			width: 100%;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
		}
		
		main > div {
			height: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			width: calc(100% - 4em);
			margin: auto;
			max-height: 900px;
			align-items: center;
			position: relative;
		}

		main > div > div {
			height: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			max-width: 30em;
			margin: auto;
		}

		main > div > div > div.logo {
			background-image: url(".<?= encodeString(getResource("./images/logo_big.svg")); ?>");
			background-size: 100%;
			background-repeat: no-repeat;
			background-position: center;
			flex-grow: 1;
			visibility: visible;
			opacity: 1;
			transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
		}

		main > div > div > div.logo.hide {
			display: block;
			visibility: hidden;
			opacity: 0;
		}

		@media only screen and (max-width: 500px) {

			main > div > div > div.logo {
				background-image: url(".<?= encodeString(getResource("./images/logo_small.svg")); ?>");
				background-size: 59%;
			}
		}

		@media only screen and (max-height: 500px) {

			main > div > div > div.logo {
				background-image: url(".<?= encodeString(getResource("./images/logo_small.svg")); ?>");
				background-size: 35%;
			}
		}

		@media only screen and (max-width: 300px) {

			main > div > div > div.logo {
				background-size: 0%;
			}
		}

		@media only screen and (max-height: 400px) {

			main > div > div > div.logo {
				background-size: 0%;
			}
		}

		div.loading > div.spinner {
			display: none;
			display: flex;
			flex-direction: column;
			height: 50%;
			visibility: visible;
			opacity: 1;
			transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
			align-items: center;
		}
		
		div.loading > div.spinner.hide {
			display: flex;
			visibility: hidden;
			opacity: 0;
		}


		@media only screen and (max-height: 500px) {

			div.loading > div.spinner {
				height: 60%;
			}
		}

		@media only screen and (max-width: 300px) {

			div.loading > div.spinner {
				height: 100%;
				justify-content: center;
			}
		}

		@media only screen and (max-height: 400px) {

			div.loading > div.spinner {
				height: 100%;
				justify-content: center;
			}
		}
		
		@keyframes spin {

			0% {
				transform: rotate(0deg);
			}
			
			100% {
				transform: rotate(360deg);
			}
		}

		div.loading > div.spinner > div {
			border: 0.7em solid white;
			border-bottom: 0.7em solid #6D00D7;
			border-bottom: 0.7em solid transparent;
			border-right: 0.7em solid #6D00D7;
			border-right: 0.7em solid transparent;
			border-radius: 50%;
			width: 4em;
			height: 4em;
			animation: spin 1.3s linear infinite;
			margin-top: 2.6em;
		}
		
		@media only screen and (max-width: 300px) {

			div.loading > div.spinner > div {
				margin-top: 0;
			}
		}

		@media only screen and (max-height: 400px) {

			div.loading > div.spinner > div {
				margin-top: 0;
			}
		}

		div.loading > div.spinner > p {
			text-overflow: ellipsis;
			white-space: nowrap;
			white-space: pre;
			text-align: center;
			overflow: hidden;
			width: 100%;
			margin: 0.6em 2em 0 2em;
			color: white;
			font-family: "Open Sans", Arial, sans-serif;
			font-size: 19pt;
			padding-bottom: 0.2em;
		}
		
		aside.message {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 4;
			top: 0;
			left: 0;
			display: table;
			display: flex;
			align-items: center;
			background: rgba(0, 0, 0, 0.31);
			visibility: visible;
			opacity: 1;
			transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
		}

		aside.message.hide {
			display: flex;
			visibility: hidden;
			opacity: 0;
			pointer-events: none;
		}
		
		aside.message.hide * {
			pointer-events: none;
		}
		
		aside.message > div {
			width: calc(100% - 4em);
			margin: auto;
			padding: 0 2em;
			display: table-cell;
			vertical-align: middle;
			display: flex;
			max-width: 55em;
			height: 100%;
			align-items: center;
			visibility: visible;
			opacity: 1;
			transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
		}
		
		aside.message.noMessage > div {
			visibility: hidden;
			opacity: 0;
		}

		aside.message > div > div {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			margin: auto;
			background: white;
			box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
			width: 100%;
			max-height: 70%;
			max-width: 51em;
			overflow: hidden;
		}
		
		@media only screen and (max-width: 500px) {

			aside.message > div > div {
				max-height: calc(100% - 4em);
			}
		}

		@media only screen and (max-height: 600px) {

			aside.message > div > div {
				max-height: calc(100% - 4em);
			}
		}

		aside.message > div > div > h2 {
			font-weight: normal;
			color: #3600C9;
			font-size: 20pt;
			margin: 0 2em 0.7em 2em;
			padding-top: 1em;
			white-space: nowrap;
			white-space: pre;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: calc(100% - 4em);
			flex-shrink: 0;
			line-height: 1.4em;
			cursor: default;
			text-align: center;
		}
		
		@media only screen and (max-width: 600px) {

			aside.message > div > div > h2 {
				font-size: 19pt;
			}
		}

		@media only screen and (max-height: 400px) {

			aside.message > div > div > h2 {
				font-size: 19pt;
			}
		}

		aside.message > div > div > p {
			overflow-y: auto;
			overflow-x: hidden;
			min-height: 5.5em;
			color: #3600C9;
			font-size: 16pt;
			text-align: center;
			margin: 0;
			width: 100%;
			padding: 0.3em 0;
			cursor: default;
			flex-grow: 1;
			position: relative;
			z-index: 5;
			scrollbar-width: thin;
		}

		@media only screen and (max-width: 600px) {

			aside.message > div > div > p {
				font-size: 15pt;
			}
		}

		@media only screen and (max-height: 400px) {

			aside.message > div > div > p {
				min-height: 0.5em;
				max-height: 5.5em;
				font-size: 15pt;
				height: 5.5em;
			}
		}

		@media only screen and (max-width: 500px) {

			aside.message > div > div > p {
				font-size: 14pt;
			}
		}

		aside.message.noButtons > div > div > p {
			min-height: 2em;
		}

		aside.message > div > div.separate > p {
			border-top: 0.15em solid #3600C9;
			border-bottom: 0.15em solid #3600C9;
		}
		
		aside.message > div > div > span.upArrow, aside.message > div > div > span.downArrow {
			font-family: "Font Awesome";
			font-weight: bold;
			position: relative;
			align-self: stretch;
			color: #3600C9;
			display: none;
			visibility: hidden;
			opacity: 0;
			transition: opacity 0.14s ease-in-out, visibility 0.14s ease-in-out;
			margin-right: 0;
		}
		
		aside.message > div > div > span.upArrow.safeMargin, aside.message > div > div > span.downArrow.safeMargin {
			margin-right: 20px;
		}
		
		aside.message.noArrowTransition > div > div > span.upArrow, aside.message.noArrowTransition > div > div > span.downArrow {
			transition: none;
		}
		
		aside.message > div > div.separate > span.upArrow, aside.message > div > div.separate > span.downArrow {
			display: block;
		}
		
		@media only screen and (max-height: 350px) {

			aside.message > div > div.separate > span.upArrow {
				display: none;
			}
			
			aside.message.noButtons > div > div.separate > span.upArrow {
				display: block;
			}
		}
		
		aside.message > div > div.scrollUp > span.upArrow, aside.message > div > div.scrollDown > span.downArrow {
			visibility: visible;
			opacity: 1;
		}
		
		@keyframes moveDown {
		
			0% {
				margin-top: 0;
			}

			50% {
				margin-top: 3px;
			}
			
			100% {
				margin-top: 0;
			}
		}
		
		aside.message > div > div > span.upArrow::before, aside.message > div > div > span.downArrow::before {
			content: "\F0DE";
			position: absolute;
			right: 0.3em;
			top: 0.2em;
			font-size: 26pt;
			animation: moveDown 0.7s linear infinite;
		}
		
		@keyframes moveUp {
		
			0% {
				margin-top: 0;
			}

			50% {
				margin-top: -3px;
			}
			
			100% {
				margin-top: 0;
			}
		}
		
		aside.message > div > div > span.downArrow::before {
			top: -0.2em;
			transform: rotateZ(180deg) translateY(100%);
			animation: moveUp 0.7s linear infinite;
		}
		
		@media only screen and (max-width: 600px) {

			aside.message > div > div.separate > span.upArrow::before, aside.message > div > div.separate > span.downArrow::before {
				font-size: 23pt;
			}
		}

		@media only screen and (max-height: 400px) {

			aside.message > div > div.separate > span.upArrow::before, aside.message > div > div.separate > span.downArrow::before {
				font-size: 23pt;
			}
		}

		@media only screen and (max-width: 500px) {

			aside.message > div > div.separate > span.upArrow::before, aside.message > div > div.separate > span.downArrow::before {
				font-size: 20pt;
				padding-top: 1px;
			}
		}
		
		@media only screen and (max-width: 350px) {

			aside.message > div > div.separate > span.upArrow::before, aside.message > div > div.separate > span.downArrow::before {
				right: 0.1em;
			}
		}

		aside.message > div > div > p > span.text {
			margin: 0 2em;
			display: block;
			line-height: 1.4em;
			padding: 0;
			word-break: break-word;
		}
		
		@media only screen and (max-width: 350px) {

			aside.message > div > div > p > span.text {
				margin: 0 1em;
			}
		}
		
		aside.message > div > div > p > span.text span.lineBreak {
			display: block;
			height: 0.5em;
		}
		
		aside.message > div > div > div {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			margin: 0.6em 1em 0 1em;
			flex-shrink: 0;
			font-size: 16pt;
			max-width: 100%;
		}

		aside.message.noButtons > div > div > div {
			flex-wrap: nowrap;
			height: 2em;
			margin: 0;
			padding: 0;
		}

		aside.message > div > div > div > button {
			color: #3600C9;
			margin: 0 1em 0.6em 1em;
			background: white;
			border: 0.15em solid #3600C9;
			min-width: 7em;
			line-height: 2.2em;
			white-space: nowrap;
			white-space: pre;
			max-width: calc(100% - 4em);
			flex-shrink: 0;
			font-size: 16pt;
		}
		
		aside.message > div > div > div > button:disabled {
			pointer-events: auto;
		}
		
		aside.message.hide > div > div > div > button {
			pointer-events: none;
		}

		aside.message.noButtons > div > div > div > button {
			display: block;
			visibility: hidden;
			margin: 0;
			height: 2em;
			padding: 0;
			cursor: default;
		}
		
		@media only screen and (max-width: 500px) {
		
			aside.message > div > div > div, aside.message > div > div > div > button {
				font-size: 15pt;
			}
		}
		
		@media only screen and (max-height: 400px) {
		
			aside.message > div > div > div, aside.message > div > div > div > button {
				font-size: 15pt;
			}
		}
	</style>
	
	<!--[if lt IE 8]>
		<style>
		
			div.loading {
				display: none;
			}
			
			aside.message {
				overflow: hidden;
			}
			
			aside.message > div > div {
				margin-top: 10%;
			}
			
			aside.message.noScriptShow, aside.message.errorShow {
				display: block;
			}
			
			button {
				visibility: hidden;
			}
		</style>
	<![endif]-->
	
	<!--[if lte IE 8]>
		<noscript>
			<style>
			
				body {
					background: white;
				}
				
				body > div > div > div {
					display: none;
				}
				
				div.maintenanceNotification, div.cookieAcceptance, div.installApp {
					display: none;
				}
				
				body > div > div > div.message {
					display: block;
					margin: 1em;
				}
				
				body > div > div > div.message button {
					display: none;
				}
			</style>
		</noscript>
	<![endif]-->
	
	<noscript>
		<style>
			.noScriptHide {
				display: none !important;
			}
			
			.noScriptShow {
				display: flex !important;
				visibility: visible !important;
				opacity: 1 !important;
				pointer-events: auto !important;
			}
			
			.noScriptShow * {
				pointer-events: auto !important;
			}
			
			body.loading, body.loading * {
				cursor: default !important;
			}
		</style>
	</noscript>
	
	<style>
		.errorHide {
			display: none !important;
		}
		
		.errorShow {
			display: flex !important;
			visibility: visible !important;
			opacity: 1 !important;
			pointer-events: auto !important;
		}
		
		.errorShow * {
			pointer-events: auto !important;
		}
	</style>
	
	<link class="translatable" rel="manifest" href=".<?= encodeString(getResource("./site.webmanifest")); ?>" crossorigin="use-credentials">
	<meta name="msapplication-config" content=".<?= encodeString(getResource("./browserconfig.xml")); ?>">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-touch-fullscreen" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="default">
	<meta name="msapplication-TileColor" content="<?= encodeString(BACKGROUND_COLOR); ?>">
	<link rel="mask-icon" color="<?= encodeString(BACKGROUND_COLOR); ?>" href=".<?= encodeString(getResource(MASK_IMAGE)); ?>">
	<title class="translatable" data-text="<?= encodeString($title); ?>" data-arguments='<?= escapeData([sprintf("%.0F", $titleArgument)]); ?>'><?= encodeString(getTranslation($title, [getNumberTranslation($titleArgument)])); ?></title>
	<meta class="translatable" name="apple-mobile-web-app-title" data-text="<?= encodeString(getDefaultTranslation('MWC Wallet')); ?>" content="<?= encodeString(getTranslation('MWC Wallet')); ?>">
	<meta class="translatable" name="application-name" data-text="<?= encodeString(getDefaultTranslation('MWC Wallet')); ?>" content="<?= encodeString(getTranslation('MWC Wallet')); ?>">
	<meta class="translatable" name="msapplication-tooltip" data-text="<?= encodeString(getDefaultTranslation('MWC Wallet')); ?>" content="<?= encodeString(getTranslation('MWC Wallet')); ?>">
	<meta name="msapplication-starturl" content="<?= "http" . ((array_key_exists("HTTPS", $_SERVER) === TRUE && $_SERVER["HTTPS"] === "on") ? "s" : "") . "://" . rawurlencode($_SERVER["SERVER_NAME"]) . "/"; ?>">
	<meta class="translatable" name="description" data-text="<?= encodeString(getDefaultTranslation('MWC Wallet is a self-custodial web wallet that allows you to manage your MimbleWimble Coin in your web browser.')); ?>" content="<?= encodeString(getTranslation('MWC Wallet is a self-custodial web wallet that allows you to manage your MimbleWimble Coin in your web browser.')); ?>">
	<meta class="translatable" name="author" data-text="<?= encodeString(getDefaultTranslation('Nicolas Flamel')); ?>" content="<?= encodeString(getTranslation('Nicolas Flamel')); ?>">
	<link rel="schema.dcterms" href="http://purl.org/dc/terms/">
	<meta class="translatable" name="dcterms.rightsHolder" data-text="<?= encodeString(getDefaultTranslation('Nicolas Flamel')); ?>" content="<?= encodeString(getTranslation('Nicolas Flamel')); ?>">
	
	<?php
	
		// Check if copyright year is newer than the copyright year
		if($year > COPYRIGHT_YEAR) {
		
			// Display copyright information with the current year
			echo "<meta class=\"translatable\" name=\"dcterms.dateCopyrighted\" data-text=\"" . encodeString(getDefaultTranslation('%1$s–%2$s')) . "\" data-arguments='" . escapeData([sprintf("%.0F", COPYRIGHT_YEAR), sprintf("%.0F", $year)]) . "' content=\"" . encodeString(getTranslation('%1$s–%2$s', [getNumberTranslation(COPYRIGHT_YEAR), getNumberTranslation($year)])) . "\">";
			echo "<meta class=\"translatable\" name=\"dcterms.rights\" data-text=\"" . encodeString(getDefaultTranslation('© %1$s–%2$s Nicolas Flamel.')) . "\" data-arguments='" . escapeData([sprintf("%.0F", COPYRIGHT_YEAR), sprintf("%.0F", $year)]) . "' content=\"" . encodeString(getTranslation('© %1$s–%2$s Nicolas Flamel.', [getNumberTranslation(COPYRIGHT_YEAR), getNumberTranslation($year)])) . "\">";
		}
		
		// Otherwise
		else {
		
			// Display copyright information with the copyright year
			echo "<meta class=\"translatable\" name=\"dcterms.dateCopyrighted\" data-text=\"" . encodeString("%1\$s") . "\" data-arguments='" . escapeData([sprintf("%.0F", COPYRIGHT_YEAR)]) . "' content=\"" . encodeString(getTranslation("%1\$s", [getNumberTranslation(COPYRIGHT_YEAR)])) . "\">";
			echo "<meta class=\"translatable\" name=\"dcterms.rights\" data-text=\"" . encodeString(getDefaultTranslation('© %1$s Nicolas Flamel.')) . "\" data-arguments='" . escapeData([sprintf("%.0F", COPYRIGHT_YEAR)]) . "' content=\"" . encodeString(getTranslation('© %1$s Nicolas Flamel.', [getNumberTranslation(COPYRIGHT_YEAR)])) . "\">";
		}
		
		// Display theme color
		echo "<meta name=\"theme-color\" content=\"" . encodeString(THEME_COLOR) . "\">";
		
		// Check if not crawler
		if($isCrawler === FALSE) {
		
			// Go through all touch icons
			foreach(TOUCH_ICONS as $touchIcon) {
			
				// Check if touch icon's parts aren't provided
				if(count($touchIcon) !== count(TOUCH_ICON_PARTS))
			
					// Display touch icon
					echo "<link rel=\"apple-touch-icon\" href=\"." . encodeString(getResource($touchIcon[0])) . "\">";
				
				// Otherwise
				else
			
					// Display touch icon
					echo "<link rel=\"apple-touch-icon\" sizes=\"" . encodeString($touchIcon[TOUCH_ICON_PARTS["X Dimension"]]) . "x" . encodeString($touchIcon[TOUCH_ICON_PARTS["Y Dimension"]]) . "\" href=\"." . encodeString(getResource($touchIcon[TOUCH_ICON_PARTS["File Path"]])) . "\">";
			}
		}
		
		// Go through all favicons
		foreach(FAVICONS as $favicon) {
		
			// Check if favicon's parts aren't provided
			if(count($favicon) !== count(FAVICON_PARTS))
			
				// Display favicon
				echo "<link rel=\"icon\" type=\"image/x-icon\" href=\"." . encodeString(getResource($favicon[0])) . "\">";
			
			// Otherwise
			else
			
				// Display favicon
				echo "<link rel=\"icon\" type=\"image/png\" sizes=\"" . encodeString($favicon[FAVICON_PARTS["X Dimension"]]) . "x" . encodeString($favicon[FAVICON_PARTS["Y Dimension"]]) . "\" href=\"." . encodeString(getResource($favicon[FAVICON_PARTS["File Path"]])) . "\">";
		}
		
		// Go through all app icons
		foreach(APP_ICONS as $appIcon) {
		
			// Check if app icon's parts aren't provided
			if(count($appIcon) !== count(APP_ICON_PARTS))
			
				// Display app icon
				echo "<link rel=\"icon\" type=\"image/svg+xml\" href=\"." . encodeString(getResource($appIcon[0])) . "\">";
			
			// Otherwise check if app icon can be used as a favicon
			else if($appIcon[APP_ICON_PARTS["Use As Favicon"]] === TRUE)
		
				// Display app icon
				echo "<link rel=\"icon\" type=\"image/png\" sizes=\"" . encodeString($appIcon[APP_ICON_PARTS["X Dimension"]]) . "x" . encodeString($appIcon[APP_ICON_PARTS["Y Dimension"]]) . "\" href=\"." . encodeString(getResource($appIcon[APP_ICON_PARTS["File Path"]])) . "\">";
		}
		
		// Go through all tile images
		foreach(TILE_IMAGES as $tileImage)
		
			// Display tile image
			echo "<meta name=\"msapplication-" . encodeString(mb_strtolower($tileImage[TILE_IMAGE_PARTS["Ratio"]])) . encodeString($tileImage[TILE_IMAGE_PARTS["X Dimension"]]) . "x" . encodeString($tileImage[TILE_IMAGE_PARTS["Y Dimension"]]) . "logo\" content=\"." . encodeString(getResource($tileImage[TILE_IMAGE_PARTS["File Path"]])) . "\">";
	?>

</head>

<body class="loading" spellcheck="false"><!--
	--><div><!--
		--><div><!--
			--><main><!--
				--><div class="language normalTransitionSpeed hide"><!--
					--><div><!--
						--><select tabindex="-1"><!--
							
							--><?php
							
								// Go through all available languages
								foreach(getAvailableLanguages() as $languageIdentifier => $availableLanguage) {
								
									// Display language currency option
									echo "<option value=\"" . encodeString($languageIdentifier) . "\"" . (($language === $languageIdentifier) ? " selected=\"selected\" disabled=\"disabled\"" : "") . ">" . encodeString($availableLanguage["Constants"]["Language"]) . "</option>";
								}
							?><!--
							
						--></select><!--
						--><button><!--
							--><span class="icon"></span><!--
							--><span><!--
								--><span class="translatable" data-text="<?= encodeString(getDefaultTranslation('Language')); ?>"><?= encodeString(getTranslation('Language')); ?></span><!--
							--></span><!--
						--></button><!--
						--><div class="scrollable hide"><!--
						
							--><?php
							
								// Go through all available languages
								foreach(getAvailableLanguages() as $languageIdentifier => $availableLanguage) {
								
									// Display available language button
									echo "<button data-language=\"" . encodeString($languageIdentifier) . "\"" . (($language === $languageIdentifier) ? " disabled=\"disabled\"" : "") . "><img src=\"." . encodeString(getResource($availableLanguage["Constants"]["Image"])) . "\"><span>" . encodeString($availableLanguage["Constants"]["Language"]) . "</span></button>";
								}
							?><!--
						--></div><!--
					--></div><!--
				--></div><!--
				--><div><!--
					--><div class="loading"><!--
						--><div class="logo"></div><!--
						--><div class="spinner"><!--
							--><div class="errorHide"></div><!--
							--><p class="errorHide translatable" data-text="<?= encodeString(getDefaultTranslation('Loading…')); ?>"><?= encodeString(getTranslation('Loading…')); ?></p><!--
						--></div><!--
					--></div><!--
				--></div><!--
			--></main><!--
			--><aside class="message noButtons hide errorShow"><!--
				--><div class="message"><!--
					--><div><!--
						--><h2 class="translatable" data-text="<?= encodeString($error); ?>" data-arguments='<?= escapeData([sprintf("%.0F", $errorArgument)]); ?>'><?= encodeString(getTranslation($error, [getNumberTranslation($errorArgument)])); ?></h2><!--
						--><span class="upArrow"></span><!--
						--><p class="scrollable"><!--
							--><span class="text"><!--
								--><span class="translatable" data-text="<?= encodeString($message); ?>"><?= encodeString(getTranslation($message)); ?></span><!--
							--></span><!--
						--></p><!--
						--><span class="downArrow"></span><!--
						--><div><!--
							--><button><!--
								--><span class="translatable"></span><!--
								--><span class="dots"><!--
									--><span></span><!--
									--><span></span><!--
									--><span></span><!--
								--></span><!--
							--></button><!--
							--><button><!--
								--><span class="translatable"></span><!--
								--><span class="dots"><!--
									--><span></span><!--
									--><span></span><!--
									--><span></span><!--
								--></span><!--
							--></button><!--
						--></div><!--
					--></div><!--
				--></div><!--
			--></aside><!--
		--></div><!--
	--></div><!--
	
	--><link rel="prefetch" as="font" href=".<?= encodeString(getResource("./fonts/font_awesome/font_awesome-5.15.4.woff2")); ?>" type="font/woff2" crossorigin="anonymous"><!--
	--><link rel="prefetch" as="font" href=".<?= encodeString(getResource("./fonts/font_awesome/font_awesome_solid-5.15.4.woff2")); ?>" type="font/woff2" crossorigin="anonymous"><!--
	
	--><link rel="stylesheet" type="text/css" href=".<?= encodeString(getResource("./styles/common.css")); ?>" integrity="<?= encodeString(getChecksum("./styles/common.css")); ?>"><!--
	--><link rel="stylesheet" type="text/css" href=".<?= encodeString(getResource("./styles/language.css")); ?>" integrity="<?= encodeString(getChecksum("./styles/language.css")); ?>"><!--
	
	--><script>
	
		// Use strict
		"use strict";
		
		
		// Constants
		
		// Files
		var FILES = <?= json_encode($files); ?>;
		
		// Copyright year
		var COPYRIGHT_YEAR = <?= COPYRIGHT_YEAR; ?>;
		
		// Default language
		var DEFAULT_LANGUAGE = "<?= escapeString(DEFAULT_LANGUAGE); ?>";
		
		// Index not found
		var INDEX_NOT_FOUND = -1;
		
		// Scroll tolerance
		var SCROLL_TOLERANCE = 2;
		
	
		// Global variables
		
		// DOM content loaded
		var domContentLoaded = false;
		
		
		// Supporting function implementation
		
		// Add minified suffix
		function addMinifiedSuffix(file) {
		
			// Get file's suffix offset
			var suffixOffset = file.lastIndexOf(".");
			
			// Check if file contains no suffix
			if(suffixOffset === INDEX_NOT_FOUND || suffixOffset < "./"["length"])
			
				// Return file with minified suffix at the end
				return file + ".min";
			
			// Otherwise
			else
			
				// Return file with minified suffix insert before its suffix
				return file.substring(0, suffixOffset) + ".min" + file.substring(suffixOffset);
		}
		
		// Get resource
		function getResource(file) {
		
			// Return resource with version
			return ((file in FILES === true && FILES[file]["Minified"] === true) ? addMinifiedSuffix(file) : file) + ((file in FILES === true && FILES[file]["Version"] !== 0) ? "?" + FILES[file]["Version"] : "");
		}
		
		// Array index
		function arrayIndex(array, value) {
		
			// Go through all values in the array
			for(var i = 0; i < array["length"]; ++i)
			
				// Check if array value matches the value
				if(array[i] === value)
				
					// Return index
					return i;
			
			// Return index not found
			return INDEX_NOT_FOUND;
		}
		
		// Add event
		function addEvent(element, event, callback) {
		
			// Check if element add event listener is supported
			if(typeof element.addEventListener !== "undefined")
			
				// Add event listener to the element
				element.addEventListener(event, callback);
			
			// Otherwise check if element attach event is supported
			else if(typeof element.attachEvent !== "undefined")
			
				// Attach event to the element
				element.attachEvent("on" + event, callback);
		}
		
		// Add class
		function addClass(element, className) {
		
			// Check if element has no classes
			if(typeof element["className"] === "undefined" || element["className"] === null || element["className"]["length"] === 0)
			
				// Set element's classes to class
				element["className"] = className;
			
			// Otherwise
			else {
			
				// Get all of the element's classes
				var classes = element["className"].split(" ");
				
				// Check if element doesn't already have the class
				if(arrayIndex(classes, className) === INDEX_NOT_FOUND)
				
					// Append class to element's classes
					element["className"] += " " + className;
			}
		}
		
		// Remove class
		function removeClass(element, className) {
		
			// Check if element has classes
			if(typeof element["className"] !== "undefined" && element["className"] !== null && element["className"]["length"] !== 0) {
			
				// Get all of the element's classes
				var classes = element["className"].split(" ");
				
				// Check if element has the class
				var classIndex = arrayIndex(classes, className);
				if(classIndex !== INDEX_NOT_FOUND) {
				
					// Remove class from classes
					classes.splice(classIndex, 1);
					
					// Set element's classes to changed classes
					element["className"] = classes.join(" ");
				}
			}
		}
		
		// Has class
		function hasClass(element, className) {
		
			// Check if element has classes
			if(typeof element["className"] !== "undefined" && element["className"] !== null && element["className"]["length"] !== 0) {
			
				// Get all of the element's classes
				var classes = element["className"].split(" ");
				
				// Check if element has the class
				var classIndex = arrayIndex(classes, className);
				if(classIndex !== INDEX_NOT_FOUND)
				
					// Return true
					return true;
			}
			
			// Return false
			return false;
		}
		
		// Get element
		function getElement(parent, tagName, className) {
		
			// Get all elements with the tag name
			var elements = parent.getElementsByTagName(tagName);
			
			// Go through all elements with the tag name
			for(var i = 0; i < elements["length"]; ++i)
			
				// Check if element has the class
				if(hasClass(elements[i], className) === true)
				
					// Return element
					return elements[i];
		}
		
		// On resize
		function onResize() {
		
			// Get message display
			var messageDisplay = getElement(document, "aside", "message");
			
			// Get message display text
			var messageDisplayText = messageDisplay.getElementsByTagName("p")[0];
			
			// Check if message display is shown
			if(hasClass(messageDisplay, "hide") === false || hasClass(messageDisplay, "errorShow") === true) {
				
				// Check if message display text has scroll bars
				if(messageDisplayText["scrollHeight"] > messageDisplayText["clientHeight"]) {
				
					// Add message display text separator
					addClass(messageDisplayText["parentNode"], "separate");
					
					// Check if message display text's offset width is supported
					if(typeof messageDisplayText["offsetWidth"] !== "undefined" && messageDisplayText["offsetWidth"] !== null) {
					
						// Get scrollbar width
						var scrollbarWidth = messageDisplayText["offsetWidth"] - messageDisplayText["clientWidth"] + "px";
					
						// Set message display arrows margin to scrollbar width
						getElement(messageDisplay, "span", "upArrow")["style"]["marginRight"] = scrollbarWidth;
						getElement(messageDisplay, "span", "downArrow")["style"]["marginRight"] = scrollbarWidth;
					}
					
					// Otherwise
					else {
					
						// Set message display arrows margin to a safe value
						addClass(getElement(messageDisplay, "span", "upArrow"), "safeMargin");
						addClass(getElement(messageDisplay, "span", "downArrow"), "safeMargin");
					}
						
				}
				
				// Otherwise
				else
				
					// Remove message display text separator
					removeClass(messageDisplayText["parentNode"], "separate");
			}
			
			// Otherwise
			else
			
				// Remove message display text separator
				removeClass(messageDisplayText["parentNode"], "separate");
			
			// Scroll message display text to add or remove arrows
			onScroll();
		}
		
		// On scroll
		function onScroll() {
		
			// Get message display text
			var messageDisplayText = getElement(document, "aside", "message").getElementsByTagName("p")[0];
			
			// Check if message display text's scroll top is supported
			if(typeof messageDisplayText["scrollTop"] !== "undefined" && messageDisplayText["scrollTop"] !== null) {
			
				// Check if scrolled to the top
				if(messageDisplayText["scrollTop"] <= 0)
				
					// Hide scroll up arrow
					removeClass(messageDisplayText["parentNode"], "scrollUp");
				
				// Otherwise
				else
				
					// Show scroll up arrow
					addClass(messageDisplayText["parentNode"], "scrollUp");
				
				// Check if scrolled to the bottom
				if(Math.abs(messageDisplayText["scrollHeight"] - messageDisplayText["clientHeight"] - messageDisplayText["scrollTop"]) <= SCROLL_TOLERANCE || messageDisplayText["scrollHeight"] - messageDisplayText["scrollTop"] <= messageDisplayText["clientHeight"]) {
				
					// Hide scroll down arrow
					removeClass(messageDisplayText["parentNode"], "scrollDown");
				}
				
				// Otherwise
				else {
				
					// Show scroll down arrow
					addClass(messageDisplayText["parentNode"], "scrollDown");
				}
			}
			
			// Otherwise
			else {
			
				// Hide scroll up arrow
				removeClass(messageDisplayText["parentNode"], "scrollUp");
			
				// Hide scroll down arrow
				removeClass(messageDisplayText["parentNode"], "scrollDown");
			}
		}
		
		
		// Main function
	
		// Document ready state change event
		addEvent(document, "readystatechange", function(event) {
		
			// Check if document is complete
			if(document["readyState"] === "complete") {
		
				// Check if DOM content hasn't already loaded
				if(domContentLoaded === false) {
			
					// Set DOM content loaded
					domContentLoaded = true;
					
					// Get body
					var body = getElement(document, "body", "loading");
					
					// Hide loading
					removeClass(body, "loading");
				
					// Get message display
					var messageDisplay = getElement(document, "aside", "message");
					
					// Get message display text
					var messageDisplayText = messageDisplay.getElementsByTagName("p")[0];
			
					// Window resize event
					addEvent(window, "resize", onResize);
					
					// Message display text scroll event
					addEvent(messageDisplayText, "scroll", onScroll);
					
					// Resize window
					onResize();
					
					// Check if message display text's scroll top is supported
					if(typeof messageDisplayText["scrollTop"] !== "undefined" && messageDisplayText["scrollTop"] !== null)
				
						// Scroll to the top of message display text
						messageDisplayText["scrollTop"] = 0;
					
					// Show language display
					Language.showDisplay();
				}
			}
		});
	
	</script><!--
	
	--><script src=".<?= encodeString(getResource("./scripts/jQuery-3.6.4.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/jQuery-3.6.4.js")); ?>" type="application/javascript" charset="UTF-8"></script><!--
	--><script src=".<?= encodeString(getResource("./scripts/common.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/common.js")); ?>" type="application/javascript" charset="UTF-8"></script><!--
	--><script src=".<?= encodeString(getResource("./scripts/consensus.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/consensus.js")); ?>" type="application/javascript" charset="UTF-8"></script><!--
	--><script src=".<?= encodeString(getResource("./scripts/languages.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/languages.js")); ?>" type="application/javascript" charset="UTF-8"></script><!--
	--><script src=".<?= encodeString(getResource("./scripts/language.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/language.js")); ?>" type="application/javascript" charset="UTF-8"></script><!--
	--><script src=".<?= encodeString(getResource("./scripts/startup_images_creator.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/startup_images_creator.js")); ?>" type="application/javascript" charset="UTF-8" defer="true"></script><!--
	--><script src=".<?= encodeString(getResource("./scripts/copyright.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/copyright.js")); ?>" type="application/javascript" charset="UTF-8" defer="true"></script><!--
	--><script src=".<?= encodeString(getResource("./scripts/log.js")); ?>" integrity="<?= encodeString(getChecksum("./scripts/log.js")); ?>" type="application/javascript" charset="UTF-8" defer="true"></script><!--
	
	--><?php
		
		// Check if hiding URL
		if(isset($hideUrl) === TRUE) {
		
	?><!--
	
	--><script>
	
		// Use strict
		"use strict";
		
		
		// Constants
			
		// No state
		var NO_STATE = null;
		
		// Referrer
		var REFERRER = "<?= escapeString($_SERVER["HTTP_REFERER"]); ?>";
		
		
		// Main function
		
		// Initialize error occurred
		var errorOccurred = false;
		
		// Try
		try {
	
			// Parse referrer as a URL
			var url = new URL(REFERRER);
		}
		
		// Catch errors
		catch(error) {
		
			// Set error occurred
			errorOccurred = true;
		}
		
		// Check if an error didn't occur
		if(errorOccurred === false) {
		
			// Update URL
			updateUrl(url["pathname"] + url["search"]);
		
			// Title language change event
			$("title").on(Language.CHANGE_EVENT, function() {
			
				// Set timeout
				setTimeout(function() {
				
					// Update URL
					updateUrl(url["pathname"] + url["search"]);
				}, 0);
			});
		}
		
		
		// Supporting function implementation

		// Update URL
		function updateUrl(path) {
		
			// Check if history is supported
			if(typeof history === "object" && history !== null)
			
				// Change displayed URL
				history.replaceState(NO_STATE, Language.getTranslation('MWC Wallet'), path);
		}
		
	</script><!--
	
	--><?php
					
		}
	?><!--
	
	--><?php
		
		// Check if is generic error
		if(isset($isGenericError) === TRUE) {
		
	?><!--
	
	--><script>
	
		// Use strict
		"use strict";
		
		
		// Main function
		
		// Get message text display
		var messageTextDisplay = $("aside.message").find("p").children("span.text").children("span");
	
		// Check if is an app
		if(Common.isApp() === true) {
		
			// Set message
			var message = Language.getDefaultTranslation('An error has occurred. This app will automatically reload in a few seconds.');
		}
		
		// Otherwise
		else {
		
			// Set message
			var message = Language.getDefaultTranslation('An error has occurred. This site will automatically reload in a few seconds.');
		}
		
		// Replace message text display
		messageTextDisplay.replaceWith(Language.createTranslatableContainer("<span>", message));
		
	</script><!--
	
	--><?php
					
		}
	?><!--
	
	--><?php
		
		// Check if is maintenance error
		if(isset($isMaintenanceError) === TRUE) {
		
	?><!--
	
	--><script>
	
		// Use strict
		"use strict";
		
		
		// Main function
		
		// Get message text display
		var messageTextDisplay = $("aside.message").find("p").children("span.text").children("span");
	
		// Check if is an app
		if(Common.isApp() === true) {
		
			// Set message
			var message = Language.getDefaultTranslation('This app is currently down for maintenance.');
		}
		
		// Otherwise
		else {
		
			// Set message
			var message = Language.getDefaultTranslation('This site is currently down for maintenance.');
		}
		
		// Replace message text display
		messageTextDisplay.replaceWith(Language.createTranslatableContainer("<span>", message));
		
	</script><!--
	
	--><?php
					
		}
	?><!--
	
--></body>
</html>
