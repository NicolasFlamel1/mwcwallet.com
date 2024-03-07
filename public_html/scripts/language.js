// Use strict
"use strict";


// Classes

// Language class
class Language {

	// Public
	
		// Initialize
		static initialize() {
		
			// Check if language hasn't already been initialized and available languages exist
			if(typeof Language.currentLanguage === "undefined" && typeof AVAILABLE_LANGUAGES !== "undefined") {
			
				// Get language display
				var languageDisplay = $("div.language");
				
				// Get body display
				var bodyDisplay = $("body");
				
				// Get language display button
				var languageDisplayButton = languageDisplay.children().children("button");
				
				// Get language display list
				var languageDisplayList = languageDisplay.children().children("div");
				
				// Get language display select
				var languageDisplaySelect = languageDisplay.children().children("select");
				
				// Update language display select's size
				languageDisplaySelect.width(languageDisplayButton.width());
				languageDisplaySelect.height(languageDisplayButton.height());
				
				// Check if language is saved in local storage and it is valid
				var savedLanguage = localStorage.getItem(Language.LOCAL_STORAGE_NAME);
				
				if(savedLanguage !== Common.INVALID_LOCAL_STORAGE_ITEM && savedLanguage in AVAILABLE_LANGUAGES === true) {
				
					// Set current language to saved language
					Language.currentLanguage = savedLanguage;
				
					// Check if HTML language isn't the saved language
					if(savedLanguage !== $("html").attr("lang")) {
					
						// Change language to saved language
						Language.changeLanguage(savedLanguage);
						
						// Go through all language display list buttons
						languageDisplayList.children("button").each(function() {
						
							// Get button
							var button = $(this);
							
							// Check if button is the saved language
							if(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "language") === savedLanguage)
							
								// Disable button
								button.disable();
							
							// Otherwise
							else
							
								// Enable button
								button.enable();
						});
						
						// Update language display select value
						languageDisplaySelect.val(savedLanguage);
						
						// Update language display select options
						languageDisplaySelect.children("option").enable().filter(":selected").disable();
					}
					
					// Otherwise
					else {
					
						// Change language to current language
						Language.changeLanguage(Language.currentLanguage, false);
					}
				}
				
				// Otherwise check if is an extension
				else if(Common.isExtension() === true && (typeof browser !== "undefined" || typeof chrome !== "undefined")) {
				
					// Get extension locale code
					var extensionLocaleCode = (typeof browser !== "undefined") ? browser["i18n"].getUILanguage() : chrome["i18n"].getUILanguage();
					
					// Set language found to false
					var languageFound = false;
					
					// Go through all available laguages
					for(var availableLanguage in AVAILABLE_LANGUAGES) {
					
						if(AVAILABLE_LANGUAGES.hasOwnProperty(availableLanguage) === true) {
						
							// Check if available language's extension locale code matches the extension's
							if("Constants" in AVAILABLE_LANGUAGES[availableLanguage] === true && "Extension Locale Code" in AVAILABLE_LANGUAGES[availableLanguage]["Constants"] === true && AVAILABLE_LANGUAGES[availableLanguage]["Constants"]["Extension Locale Code"] === extensionLocaleCode) {
							
								// Set extension language
								var extensionLanguage = availableLanguage;
								
								// Set language found to true
								languageFound = true;
								
								// Break
								break;
							}
						}
					}
					
					// Check if language was found
					if(languageFound === true) {
					
						// Set current language to extension language
						Language.currentLanguage = extensionLanguage;
					
						// Check if HTML language isn't the extension language
						if(extensionLanguage !== $("html").attr("lang")) {
						
							// Change language to extension language
							Language.changeLanguage(extensionLanguage);
							
							// Go through all language display list buttons
							languageDisplayList.children("button").each(function() {
							
								// Get button
								var button = $(this);
								
								// Check if button is the extension language
								if(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "language") === extensionLanguage)
								
									// Disable button
									button.disable();
								
								// Otherwise
								else
								
									// Enable button
									button.enable();
							});
							
							// Update language display select value
							languageDisplaySelect.val(extensionLanguage);
							
							// Update language display select options
							languageDisplaySelect.children("option").enable().filter(":selected").disable();
						}
						
						// Otherwise
						else {
						
							// Change language to current language
							Language.changeLanguage(Language.currentLanguage, false);
						}
					}
					
					// Otherwise
					else {
					
						// Get current language from HTML language
						Language.currentLanguage = $("html").attr("lang");
						
						// Change language to current language
						Language.changeLanguage(Language.currentLanguage, false);
					}
				}
				
				// Otherwise
				else {
				
					// Get current language from HTML language
					Language.currentLanguage = $("html").attr("lang");
					
					// Change language to current language
					Language.changeLanguage(Language.currentLanguage, false);
				}
				
				// Set cookie
				Language.setCookie();
				
				// Set local storage
				Language.setLocalStorage();
				
				// Language display button click event
				languageDisplayButton.on("click", function() {
				
					// Check if language display list is hidden
					if(languageDisplayList.hasClass("hide") === true) {
					
						// Reset language display list scroll position
						languageDisplayList.scrollTop(0);
					
						// Show language display list
						languageDisplayList.removeClass("hide").parent().addClass("shadow");
						
						// Make language display button transition and set that it is clicked
						languageDisplayButton.addClass("transition clicked");
					}
					
					// Otherwise
					else {
					
						// Hide language display list
						languageDisplayList.addClass("hide").parent().removeClass("shadow");
						
						// Make language display button not transition and set that it isn't clicked
						languageDisplayButton.removeClass("transition clicked");
					}
				
				// Language display button language change event
				}).on(Language.CHANGE_EVENT, function() {
				
					// Update language display select's size
					languageDisplaySelect.width(languageDisplayButton.width());
					languageDisplaySelect.height(languageDisplayButton.height());
				});
				
				// Language display focus out event
				languageDisplay.on("focusout", function(event) {
				
					// Check if element with focus isn't part of the language display
					if(typeof event !== "object" || event === null || "originalEvent" in event === false || typeof event["originalEvent"] !== "object" || event["originalEvent"] === null || "relatedTarget" in event["originalEvent"] === false || languageDisplay.has(event["originalEvent"]["relatedTarget"])["length"] === 0) {
					
						// Check if language display list is shown and not blocking input
						if(languageDisplayList.hasClass("hide") === false && bodyDisplay.hasClass("blockInput") === false) {
						
							// Hide language display list
							languageDisplayList.addClass("hide").parent().removeClass("shadow");
							
							// Set that language display button isn't clicked
							languageDisplayButton.removeClass("clicked").blur();
							
							// Language display list transition end or timeout event
							languageDisplayList.transitionEndOrTimeout(function() {
							
								// Make language display button not transition
								languageDisplayButton.removeClass("transition");
								
							}, "opacity");
						}
					}
				});
				
				// Language display list mouse down event
				languageDisplayList.on("mousedown", function(event) {
				
					// Prevent causing focus out event
					event.preventDefault();
					
					// Trigger focus change event
					languageDisplayList.trigger(Common.FOCUS_CHANGE_EVENT);
				});
				
				// Language display list button click and touch end event
				languageDisplayList.children("button").on("click touchend", function(event) {
				
					// Check if event is touch end
					if("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") {
					
						// Check if address copy isn't under the touch area
						var changedTouch = event["originalEvent"]["changedTouches"][0];
						if(this !== document.elementFromPoint(changedTouch["clientX"], changedTouch["clientY"])) {
						
							// Return
							return;
						}
					}
					
					// Get button
					var button = $(this);
					
					// Check if button isn't disabled
					if(button.is(":disabled") === false) {
					
						// Block input
						bodyDisplay.addClass("blockInput");
						
						// Set that button is clicked
						button.addClass("clicked");
						
						// Set timeout
						setTimeout(function() {
						
							// Get new language
							var newLanguage = button.attr(Common.DATA_ATTRIBUTE_PREFIX + "language");
							
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Language changed to %1$y.'), [
							
								// Language
								AVAILABLE_LANGUAGES[newLanguage]["Constants"]["Language"]
							]);
					
							// Change language
							Language.changeLanguage(newLanguage);
							
							// Update language display select value
							languageDisplaySelect.val(newLanguage);
							
							// Update language display select options
							languageDisplaySelect.children().enable().filter(":selected").disable();
							
							// Request animation frame or timeout
							Common.requestAnimationFrameOrTimeout(function() {
							
								// Unblock input
								bodyDisplay.removeClass("blockInput");
							
								// Trigger langauge display focus out event
								languageDisplay.trigger("focusout");
								
								// Language display list transition end or timeout event
								languageDisplayList.transitionEndOrTimeout(function() {
								
									// Disable button and enable its siblings
									button.disable().siblings().enable();
									
									// Set that button isn't clicked
									button.removeClass("clicked");
									
								}, "opacity");
							});
						}, ("type" in event["originalEvent"] === true && event["originalEvent"]["type"] === "touchend") ? 0 : Language.CHANGE_LANGUAGE_DELAY_MILLISECONDS);
					}
				});
				
				// Language display select input event
				languageDisplaySelect.on("input", function() {
				
					// Get new language
					var newLanguage = languageDisplaySelect.val();
				
					// Check if new language isn't the current language
					if(newLanguage !== Language.currentLanguage) {
				
						// Block input
						bodyDisplay.addClass("blockInput");
						
						// Set timeout
						setTimeout(function() {
						
							// Log message
							Log.logMessage(Language.getDefaultTranslation('Language changed to %1$y.'), [
							
								// Language
								AVAILABLE_LANGUAGES[newLanguage]["Constants"]["Language"]
							]);
					
							// Change language
							Language.changeLanguage(newLanguage);
							
							// Go through all language display list buttons
							languageDisplayList.children("button").each(function() {
							
								// Get button
								var button = $(this);
								
								// Check if button is the new language
								if(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "language") === newLanguage)
								
									// Disable button
									button.disable();
								
								// Otherwise
								else
								
									// Enable button
									button.enable();
							});
							
							// Update language display select options
							languageDisplaySelect.children().enable().filter(":selected").disable();
							
							// Request animation frame
							requestAnimationFrame(function() {
							
								// Unblock input
								bodyDisplay.removeClass("blockInput");
							});
							
							// Blur language display select
							languageDisplaySelect.blur();
						}, 0);
					}
				});
				
				// Document key down event
				$(document).on("keydown", function(event) {
				
					// Check if blocking input and key tab is pressed
					if(bodyDisplay.hasClass("blockInput") === true && event["which"] === "\t".charCodeAt(0))
					
						// Prevent default
						event.preventDefault();
				});
				
				// Document mouse down, focus in, touch start, and focus change event
				$(document).on("mousedown focusin touchstart " + Common.FOCUS_CHANGE_EVENT, function(event) {
				
					// Check if language display list is shown and element with focus isn't part of the language display or the block input
					if(languageDisplayList.hasClass("hide") === false && languageDisplay.has(event["target"])["length"] === 0 && $(event["target"]).hasClass("blockInput") === false) {
					
						// Trigger langauge display focus out event
						languageDisplay.trigger("focusout");
					}
				});
				
				// Window blur event
				$(window).on("blur", function() {
				
					// Check if language display list is shown
					if(languageDisplayList.hasClass("hide") === false)
				
						// Trigger langauge display focus out event
						languageDisplay.trigger("focusout");
				
				// Window storage event
				}).on("storage", function(event) {
				
					// Check if language was changed
					if(event["originalEvent"]["key"] === Language.LOCAL_STORAGE_NAME && event["originalEvent"]["oldValue"] !== event["originalEvent"]["newValue"]) {
					
						// Log message
						Log.logMessage(Language.getDefaultTranslation('Language changed to %1$y.'), [
						
							// Language
							AVAILABLE_LANGUAGES[event["originalEvent"]["newValue"]]["Constants"]["Language"]
						]);
					
						// Change language
						Language.changeLanguage(event["originalEvent"]["newValue"]);
						
						// Go through all language display list buttons
						languageDisplayList.children("button").each(function() {
						
							// Get button
							var button = $(this);
							
							// Check if button is the new language
							if(button.attr(Common.DATA_ATTRIBUTE_PREFIX + "language") === event["originalEvent"]["newValue"])
							
								// Disable button
								button.disable();
							
							// Otherwise
							else
							
								// Enable button
								button.enable();
						});
						
						// Update language display select value
						languageDisplaySelect.val(event["originalEvent"]["newValue"]);
					}
				
				// Windows resize event
				}).on("resize", function() {
				
					// Update language display select's size
					languageDisplaySelect.width(languageDisplayButton.width());
					languageDisplaySelect.height(languageDisplayButton.height());
				});
			}
		}
		
		// Set get displayed currency
		static setGetDisplayedCurrency(getDisplayedCurrency) {
		
			// Set language get displayed currency
			Language.getDisplayedCurrency = getDisplayedCurrency;
		}
		
		// Set get price
		static setGetPrice(prices) {
		
			// Set language get price
			Language.getPrice = function(currency) {
			
				// Return currency's price
				return prices.getPrice(currency);
			};
			
			// Prices change event
			$(prices).on(Prices.CHANGE_EVENT, function(event, prices) {
			
				// Check if translated currency display values exist
				var translatedCurrencyDisplayValues = $(".translatedCurrencyDisplayValue");
				if(translatedCurrencyDisplayValues["length"] !== 0) {
				
					// Go through all translated currency display values
					translatedCurrencyDisplayValues.each(function() {
					
						// Translate the translatable container that the translated currency display value is in
						Language.translateElement($(this).closest(".translatable"));
					});
					
					// Trigger resize event
					$(window).trigger("resize");
				}
			});
		}
		
		// Get translation
		static getTranslation(text, textArguments = [], encodeHtml = false) {
		
			// Set applicable language
			var applicableLanguage = Language.currentLanguage;
			
			// Check if text isn't a standalone placeholder
			if(Language.PLACEHOLDER_PATTERN.test(text) === false) {
			
				// Loop while a value isn't found
				while(true) {
				
					// Check if applicable language is available
					if(typeof AVAILABLE_LANGUAGES !== "undefined" && applicableLanguage in AVAILABLE_LANGUAGES === true) {
					
						// Check if text exist for the applicable language and the specified text exists
						if("Text" in AVAILABLE_LANGUAGES[applicableLanguage] === true && text in AVAILABLE_LANGUAGES[applicableLanguage]["Text"] === true) {
						
							// Set text to the text for the applicable language
							text = AVAILABLE_LANGUAGES[applicableLanguage]["Text"][text];
							
							// Break
							break;
						}
						
						// Otherwise check if applicable language provides a fallback language
						else if(applicableLanguage !== DEFAULT_LANGUAGE && "Constants" in AVAILABLE_LANGUAGES[applicableLanguage] === true && "Fallback" in AVAILABLE_LANGUAGES[applicableLanguage]["Constants"] === true)
						
							// Set applicable language to the language's fallback language
							applicableLanguage = AVAILABLE_LANGUAGES[applicableLanguage]["Constants"]["Fallback"];
						
						// Otherwise check if the applicable language is not the default language
						else if(applicableLanguage !== DEFAULT_LANGUAGE)
						
							// Set applicable language to default language
							applicableLanguage = DEFAULT_LANGUAGE;
						
						// Otherwise
						else
						
							// Break
							break;
					}
					
					// Otherwise check if the applicable language is not the default language
					else if(applicableLanguage !== DEFAULT_LANGUAGE)
					
						// Set applicable language to default language
						applicableLanguage = DEFAULT_LANGUAGE;
					
					// Otherwise
					else
					
						// Break
						break;
				}
			}
			
			// Initialize formatter locales
			var formatterLocales = [
				applicableLanguage
			];
			
			// Loop while applicable language isn't the default language
			while(applicableLanguage !== DEFAULT_LANGUAGE) {
			
				// Check if applicable language provides a fallback language
				if(typeof AVAILABLE_LANGUAGES !== "undefined" && applicableLanguage in AVAILABLE_LANGUAGES === true && "Constants" in AVAILABLE_LANGUAGES[applicableLanguage] === true && "Fallback" in AVAILABLE_LANGUAGES[applicableLanguage]["Constants"] === true)
				
					// Set applicable language to the language's fallback language
					applicableLanguage = AVAILABLE_LANGUAGES[applicableLanguage]["Constants"]["Fallback"];
				
				// Otherwise check if the applicable language is not the default language
				else if(applicableLanguage !== DEFAULT_LANGUAGE)
				
					// Set applicable language to default language
					applicableLanguage = DEFAULT_LANGUAGE;
				
				// Otherwise
				else
				
					// Break
					break;
				
				// Append applicable language to formatter locales list
				formatterLocales.push(applicableLanguage);
			}
			
			// Append default formatter locale to list
			formatterLocales.push(Language.DEFAULT_FORMATTER_LOCALE);
			
			// Initialize result
			var result = "";
			
			// Go through all characters in the text
			var placeholderStart = Language.NO_PLACEHOLDER_START;
			for(var i = 0; i < text["length"]; ++i) {
			
				// Check if character is an escaped escape character
				if(placeholderStart !== Language.NO_PLACEHOLDER_START && i > 1 && text[i] === Language.ESCAPE_CHARACTER && text[i - 1] === Language.ESCAPE_CHARACTER) {
				
					// Clear placeholder start
					placeholderStart = Language.NO_PLACEHOLDER_START;
					
					// Append character to result and encode it if specified
					result += (encodeHtml === false) ? text[i] : Common.htmlEncode(text[i]);
				}
				
				// Otherwise check if character is an escape character
				else if(text[i] === Language.ESCAPE_CHARACTER)
				
					// Set placeholder start
					placeholderStart = i;
				
				// Otherwise check if placeholder start exists
				else if(placeholderStart !== Language.NO_PLACEHOLDER_START) {
				
					// Get place holder
					var placeholder = text.substring(placeholderStart, i + 1).match(Language.PLACEHOLDER_PATTERN);
					
					// Check if placeholder exists
					if(placeholder !== Common.NO_MATCH_FOUND) {
					
						// Clear placeholder start
						placeholderStart = Language.NO_PLACEHOLDER_START;
						
						// Check if the placeholder's argument index is valid
						var argumentIndex = parseInt(placeholder[Common.FIRST_MATCH_RESULT_INDEX], Common.DECIMAL_NUMBER_BASE) - 1;
						if(argumentIndex >= 0 && argumentIndex < textArguments["length"]) {
						
							// Check placeholder's type
							switch(placeholder[2]) {
							
								// Number
								case Language.NUMBER_PLACEHOLDER_TYPE:
								
									// Get number formatter
									var numberFormatter = new Intl.NumberFormat(formatterLocales, Language.NUMBER_FORMAT);
									
									// Check if argument contains a fractional part
									var fractionIndex = textArguments[argumentIndex].indexOf(Language.INTEGER_FRACTION_SEPARATOR);
									
									if(fractionIndex !== Common.INDEX_NOT_FOUND) {
									
										// Truncate fractional part after the maximum number of fraction digits
										textArguments[argumentIndex] = textArguments[argumentIndex].substring(0, fractionIndex + Language.INTEGER_FRACTION_SEPARATOR["length"] + numberFormatter.resolvedOptions()["maximumFractionDigits"]);
									}
									
									// Get argument formatted as a number
									var formattedArgumentNumber = numberFormatter.format(textArguments[argumentIndex]);
									
									// Append argument formatted as a number to result and encode it if specified
									result += (encodeHtml === false) ? formattedArgumentNumber : Common.htmlEncode(formattedArgumentNumber);
								
									// Break
									break;
								
								// Currency
								case Language.CURRENCY_PLACEHOLDER_TYPE:
								
									// Check if text argument is an array
									if(Array.isArray(textArguments[argumentIndex]) === true) {
									
										// Get text argument number, currency, and display value
										var textArgumentNumber = textArguments[argumentIndex][Language.CURRENCY_NUMBER_ARGUMENT_INDEX];
										var textArgumentCurrency = textArguments[argumentIndex][Language.CURRENCY_CURRENCY_ARGUMENT_INDEX];
										var textArgumentDisplayValue = (textArguments[argumentIndex]["length"] > Language.CURRENCY_DISPLAY_VALUE_ARGUMENT_INDEX) ? textArguments[argumentIndex][Language.CURRENCY_DISPLAY_VALUE_ARGUMENT_INDEX] : false;
									}
									
									// Otherwise
									else {
									
										// Get text argument number, use default currency, and don't display value
										var textArgumentNumber = textArguments[argumentIndex];
										var textArgumentCurrency = Language.DEFAULT_CURRENCY;
										var textArgumentDisplayValue = false;
									}
								
									// Get text argument number as integer and fraction parts
									var argumentParts = textArgumentNumber.split(Language.INTEGER_FRACTION_SEPARATOR);
									
									// Check if text argument number has a fraction part
									if(argumentParts["length"] > 1) {
									
										// Get formatted argument currency integer parts using text argument currency
										var currencyIntegerFormatter = new Intl.NumberFormat(formatterLocales, Language.getCurrencyIntegerFormat(textArgumentCurrency));
										
										var formattedArgumentCurrencyIntegerParts = currencyIntegerFormatter.formatToParts(argumentParts[0]);
										
										// Go through all formatted argument currency integer parts
										var integerStartingFractionIndex = Language.NO_FRACTION_INDEX;
										var integerEndingFractionIndex = Language.NO_FRACTION_INDEX;
										for(var j = 0; j < formattedArgumentCurrencyIntegerParts["length"]; ++j) {
										
											// Check if part is a fraction
											if(formattedArgumentCurrencyIntegerParts[j]["type"] === "fraction") {
											
												// Check if integer starting fraction index doesn't exist
												if(integerStartingFractionIndex === Language.NO_FRACTION_INDEX)
												
													// Set integer starting fraction index
													integerStartingFractionIndex = j;
												
												// Set integer ending fraction index
												integerEndingFractionIndex = j;
											}
										}
										
										// Get formatted argument currency fraction parts using text argument currency
										var currencyFractionFormatter = new Intl.NumberFormat(formatterLocales, Language.getCurrencyFractionFormat(textArgumentCurrency));
										
										var formattedArgumentCurrencyFractionParts = currencyFractionFormatter.formatToParts(Language.INTEGER_FRACTION_SEPARATOR + argumentParts[1].substring(0, currencyFractionFormatter.resolvedOptions()["maximumFractionDigits"]));
										
										// Go through all formatted argument currency fraction parts
										var fractionStartingFractionIndex = Language.NO_FRACTION_INDEX;
										var fractionEndingFractionIndex = Language.NO_FRACTION_INDEX;
										for(var j = 0; j < formattedArgumentCurrencyFractionParts["length"]; ++j) {
										
											// Check if part is a fraction
											if(formattedArgumentCurrencyFractionParts[j]["type"] === "fraction") {
											
												// Check if fraction starting fraction index doesn't exist
												if(fractionStartingFractionIndex === Language.NO_FRACTION_INDEX)
												
													// Set fraction starting fraction index
													fractionStartingFractionIndex = j;
												
												// Set fraction ending fraction index
												fractionEndingFractionIndex = j;
											}
										}
										
										// Check if no fraction starting fraction index exists
										if(fractionStartingFractionIndex === Language.NO_FRACTION_INDEX)
										
											// Set formatted argument currency parts to the formatted argument integer without the fraction
											var formattedArgumentCurrencyParts = formattedArgumentCurrencyIntegerParts.slice(0, integerStartingFractionIndex - 1).concat(formattedArgumentCurrencyIntegerParts.slice(integerEndingFractionIndex + 1));
										
										// Otherwise
										else
										
											// Set formatted argument currency parts to a combination of formatted argument integer and fraction parts to prevent large numbers from having their fraction parts truncated
											var formattedArgumentCurrencyParts = formattedArgumentCurrencyIntegerParts.slice(0, integerStartingFractionIndex).concat(formattedArgumentCurrencyFractionParts.slice(fractionStartingFractionIndex, fractionEndingFractionIndex + 1)).concat(formattedArgumentCurrencyIntegerParts.slice(integerEndingFractionIndex + 1));
									}
									
									// Otherwise
									else {
									
										// Get formatted argument as currency using text argument currency
										var currencyFormatter = new Intl.NumberFormat(formatterLocales, Language.getCurrencyFormat(textArgumentCurrency));
										
										// Set formatted argument currency parts
										var formattedArgumentCurrencyParts = currencyFormatter.formatToParts(textArgumentNumber);
									}
										
									// Get argument formatted as a currency
									var formattedArgumentCurrency = formattedArgumentCurrencyParts.map(function(part) {
									
										// Check part's type
										switch(part["type"]) {
										
											// Currency
											case "currency":
											
												// Check text argument currency
												switch(textArgumentCurrency) {
											
													// Currency name
													case Consensus.CURRENCY_NAME:
													
														// Check wallet type
														switch(Consensus.getWalletType()) {
														
															// MWC wallet
															case Consensus.MWC_WALLET_TYPE:
												
																// Return currency symbol and encode it if specified
																return (encodeHtml === false) ? Consensus.CURRENCY_NAME : ("<span class=\"mwc\">" + Common.htmlEncode(Consensus.CURRENCY_NAME) + "</span>");
															
															// GRIN wallet
															case Consensus.GRIN_WALLET_TYPE:
												
																// Return currency symbol and encode it if specified
																return (encodeHtml === false) ? Consensus.CURRENCY_NAME : ("<span class=\"grin\">" + Common.htmlEncode(Consensus.CURRENCY_NAME) + "</span>");
															
															// EPIC wallet
															case Consensus.EPIC_WALLET_TYPE:
												
																// Return currency symbol and encode it if specified
																return (encodeHtml === false) ? Consensus.CURRENCY_NAME : ("<span class=\"epic\">" + Common.htmlEncode(Consensus.CURRENCY_NAME) + "</span>");
														}
														
														// Break
														break;
													
													// Bitcoin currency name
													case Prices.BITCOIN_CURRENCY_NAME:
													
														// Return Bitcoin currency symbol and encode it if specified
														return (encodeHtml === false) ? Prices.BITCOIN_CURRENCY_NAME : ("<span class=\"btc\">" + Common.htmlEncode(Prices.BITCOIN_CURRENCY_NAME) + "</span>");
													
													// Ethereum currency name
													case Prices.ETHEREUM_CURRENCY_NAME:
													
														// Return Ethereum currency symbol and encode it if specified
														return (encodeHtml === false) ? Prices.ETHEREUM_CURRENCY_NAME : ("<span class=\"eth\">" + Common.htmlEncode(Prices.ETHEREUM_CURRENCY_NAME) + "</span>");
													
													// Default
													default:
													
														// Return part's value and encode it if specified
														return (encodeHtml === false) ? part["value"] : Common.htmlEncode(part["value"]);
												}
												
												// Break
												break;
												
											// Default
											default:
											
												// Return part's value and encode it if specified
												return (encodeHtml === false) ? part["value"] : Common.htmlEncode(part["value"]);
										}
									}).reduce(function(parts, part) {
									
										// Combine parts
										return parts + part;
									});
									
									// Append argument formatted as a currency to result
									result += formattedArgumentCurrency;
									
									// Check if displaying text argument value and text argument currency is the currency
									if(textArgumentDisplayValue === true && textArgumentCurrency === Consensus.CURRENCY_NAME) {
									
										// Check if language get displayed currency and get price exist
										if(typeof Language.getDisplayedCurrency !== "undefined" && typeof Language.getPrice !== "undefined") {
									
											// Get currency
											var currency = Language.getDisplayedCurrency();
											
											// Get price in the currency
											var price = Language.getPrice(currency);
											
											// Check if price exists
											if(price !== Prices.NO_PRICE_FOUND) {
											
												// Get formatted argument display value
												var formattedArgumentDisplayValue = Language.getTranslation(Language.getDefaultTranslation(' (%1$c)'), [
							
													[
													
														// Amount
														(new BigNumber(textArgumentNumber)).multipliedBy(price).toFixed(),
														
														// Currency
														currency
													]
												], encodeHtml);
												
												// Append formatted argument display value to result and encode it if specified
												result += (encodeHtml === false) ? formattedArgumentDisplayValue : ("<span class=\"translatedCurrencyDisplayValue\">" + formattedArgumentDisplayValue + "</span>");
											}
											
											// Otherwise
											else {
											
												// Append hidden formatted argument display value to result and encode it if specified
												result += (encodeHtml === false) ? "" : ("<span class=\"translatedCurrencyDisplayValue hide\"></span>");
											}
										}
									}
								
									// Break
									break;
							
								// Translated text
								case Language.TRANSLATED_TEXT_PLACEHOLDER_TYPE:
								
									// Get translated text argument
									var translatedTextArgumentText = Language.getTranslation(Language.escapeText(textArguments[argumentIndex]));
								
									// Append argument to result and encode it if specified
									result += (encodeHtml === false) ? translatedTextArgumentText : Common.htmlEncode(translatedTextArgumentText);
								
									// Break
									break;
								
								// Not translated text
								case Language.NOT_TRANSLATED_TEXT_PLACEHOLDER_TYPE:
								
									// Check if not translated text argument is an array
									if(Array.isArray(textArguments[argumentIndex]) === true) {
									
										// Get not translated text argument text and is raw data
										var notTranslatedTextArgumentText = textArguments[argumentIndex][Language.NOT_TRANSLATED_TEXT_TEXT_ARGUMENT_INDEX];
										var notTranslatedTextArgumentIsRawData = textArguments[argumentIndex][Language.NOT_TRANSLATED_TEXT_IS_RAW_DATA_ARGUMENT_INDEX];
									}
									
									// Otherwise
									else {
									
										// Get not translated text argument text and use default is raw data
										var notTranslatedTextArgumentText = textArguments[argumentIndex];
										var notTranslatedTextArgumentIsRawData = false;
									}
								
									// Append argument to result and encode it if specified
									result += (encodeHtml === false) ? notTranslatedTextArgumentText : ((notTranslatedTextArgumentIsRawData === true) ? "<span style=\"word-break: break-all;\">" + Common.htmlEncode(notTranslatedTextArgumentText) + "</span>" : Common.htmlEncode(notTranslatedTextArgumentText));
								
									// Break
									break;
								
								// Time
								case Language.TIME_PLACEHOLDER_TYPE:
								
									// Get time argument
									var timeArgument = new Date(parseInt(textArguments[argumentIndex], Common.DECIMAL_NUMBER_BASE) * Common.MILLISECONDS_IN_A_SECOND);
								
									// Get argument formatted as time
									var timeFormatter = new Intl.DateTimeFormat(formatterLocales, Language.TIME_FORMAT);
									
									var formattedArgumentTime = timeFormatter.format(timeArgument);
									
									// Append argument formatted as time to result and encode it if specified
									result += (encodeHtml === false) ? formattedArgumentTime : "<time datetime=\"" + Common.htmlEncode(timeArgument.getHours().toFixed().padStart(Language.TIME_HOUR_LENGTH, Language.TIME_COMPONENT_PADDING) + ":" + timeArgument.getMinutes().toFixed().padStart(Language.TIME_MINUTE_LENGTH, Language.TIME_COMPONENT_PADDING)) + "\">" + Common.htmlEncode(formattedArgumentTime) + "</time>";
									
									// Break
									break;
								
								// Date
								case Language.DATE_PLACEHOLDER_TYPE:
								
									// Get date argument
									var dateArgument = new Date(parseInt(textArguments[argumentIndex], Common.DECIMAL_NUMBER_BASE) * Common.MILLISECONDS_IN_A_SECOND);
								
									// Get argument formatted as a date
									var dateFormatter = new Intl.DateTimeFormat(formatterLocales, Language.DATE_FORMAT);
									
									var formattedArgumentDate = dateFormatter.format(dateArgument);
									
									// Append argument formatted as a date to result and encode it if specified
									result += (encodeHtml === false) ? formattedArgumentDate : "<time datetime=\"" + Common.htmlEncode(dateArgument.getFullYear().toFixed() + "-" + (dateArgument.getMonth() + 1).toFixed().padStart(Language.DATE_MONTH_LENGTH, Language.DATE_COMPONENT_PADDING) + "-" + dateArgument.getDate().toFixed().padStart(Language.DATE_DAY_LENGTH, Language.DATE_COMPONENT_PADDING)) + "\">" + Common.htmlEncode(formattedArgumentDate) + "</time>";
									
									// Break
									break;
								
								// Timestamp
								case Language.TIMESTAMP_PLACEHOLDER_TYPE:
								
									// Get timestamp argument
									var timestampArgument = new Date(parseInt(textArguments[argumentIndex], Common.DECIMAL_NUMBER_BASE));
								
									// Get argument formatted as a timestamp
									var dateFormatter = new Intl.DateTimeFormat(formatterLocales, Language.TIMESTAMP_FORMAT);
									
									var formattedArgumentDate = dateFormatter.format(timestampArgument);
									
									// Append argument formatted as a timestamp to result and encode it if specified
									result += (encodeHtml === false) ? formattedArgumentDate : "<time datetime=\"" + Common.htmlEncode(timestampArgument.getFullYear().toFixed() + "-" + (timestampArgument.getMonth() + 1).toFixed().padStart(Language.DATE_MONTH_LENGTH, Language.DATE_COMPONENT_PADDING) + "-" + timestampArgument.getDate().toFixed().padStart(Language.DATE_DAY_LENGTH, Language.DATE_COMPONENT_PADDING) + " " + timestampArgument.getHours().toFixed().padStart(Language.TIME_HOUR_LENGTH, Language.TIME_COMPONENT_PADDING) + ":" + timestampArgument.getMinutes().toFixed().padStart(Language.TIME_MINUTE_LENGTH, Language.TIME_COMPONENT_PADDING) + ":" + timestampArgument.getSeconds().toFixed().padStart(Language.TIME_SECOND_LENGTH, Language.TIME_COMPONENT_PADDING) + "." + timestampArgument.getMilliseconds().toFixed().padStart(Language.TIME_MILLISECOND_LENGTH, Language.TIME_COMPONENT_PADDING)) + "\">" + Common.htmlEncode(formattedArgumentDate) + "</time>";
									
									// Break
									break;
								
								// Translated link
								case Language.TRANSLATED_LINK_PLACEHOLDER_TYPE:
								
									// Get translated text argument text, URL, and is external
									var translatedTextArgumentText = Language.getTranslation(Language.escapeText(textArguments[argumentIndex][Language.LINK_TEXT_ARGUMENT_INDEX]));
									var translatedTextArgumentUrl = textArguments[argumentIndex][Language.LINK_URL_ARGUMENT_INDEX];
									var translatedTextArgumentIsExternal = textArguments[argumentIndex][Language.LINK_IS_EXTERNAL_ARGUMENT_INDEX];
									var translatedTextArgumentIsBlob = textArguments[argumentIndex][Language.LINK_IS_BLOB_ARGUMENT_INDEX];
									
									// Check if loading from file and translated text argument URL is a relative path
									if(location["protocol"] === Common.FILE_PROTOCOL && translatedTextArgumentUrl.substring(0, "./"["length"]) === "./") {
									
										// Set translated text argument URL to be an absolute path
										translatedTextArgumentUrl = HTTPS_SERVER_ADDRESS + translatedTextArgumentUrl.substring("."["length"]);
									}
									
									// Append argument to result and encode it if specified
									result += (encodeHtml === false) ? translatedTextArgumentText : ("<a href=\"" + Common.htmlEncode(translatedTextArgumentUrl) + "\" referrerpolicy=\"same-origin\" " + ((translatedTextArgumentIsBlob === true) ? "download=\"" + Common.htmlEncode(translatedTextArgumentText) + "\" " : "") + ((translatedTextArgumentIsExternal === true) ? "target=\"_blank\" rel=\"nofollow noopener noreferrer\"" : "target=\"_self\" hreflang=\"" + Common.htmlEncode(Language.currentLanguage) + "\"") + ">" + Common.htmlEncode(translatedTextArgumentText) + "</a>");
								
									// Break
									break;
								
								// Not translated link
								case Language.NOT_TRANSLATED_LINK_PLACEHOLDER_TYPE:
								
									// Get not translated text argument text, URL, and is external
									var notTranslatedTextArgumentText = textArguments[argumentIndex][Language.LINK_TEXT_ARGUMENT_INDEX];
									var notTranslatedTextArgumentUrl = textArguments[argumentIndex][Language.LINK_URL_ARGUMENT_INDEX];
									var notTranslatedTextArgumentIsExternal = textArguments[argumentIndex][Language.LINK_IS_EXTERNAL_ARGUMENT_INDEX];
									var notTranslatedTextArgumentIsBlob = textArguments[argumentIndex][Language.LINK_IS_BLOB_ARGUMENT_INDEX];
									
									// Check if loading from file and not translated text argument URL is a relative path
									if(location["protocol"] === Common.FILE_PROTOCOL && notTranslatedTextArgumentUrl.substring(0, "./"["length"]) === "./") {
									
										// Set not translated text argument URL to be an absolute path
										notTranslatedTextArgumentUrl = HTTPS_SERVER_ADDRESS + notTranslatedTextArgumentUrl.substring("."["length"]);
									}
									
									// Append argument to result and encode it if specified
									result += (encodeHtml === false) ? notTranslatedTextArgumentText : ("<a href=\"" + Common.htmlEncode(notTranslatedTextArgumentUrl) + "\" referrerpolicy=\"same-origin\" " + ((notTranslatedTextArgumentIsBlob === true) ? "download=\"" + Common.htmlEncode(notTranslatedTextArgumentText) + "\" " : "") + ((notTranslatedTextArgumentIsExternal === true) ? "target=\"_blank\" rel=\"nofollow noopener noreferrer\"" : "target=\"_self\" hreflang=\"" + Common.htmlEncode(Language.currentLanguage) + "\"") + ">" + Common.htmlEncode(notTranslatedTextArgumentText) + "</a>");
									
									// Break
									break;
								
								// Version
								case Language.VERSION_PLACEHOLDER_TYPE:
								
									// Get argument formatted as a number
									var numberFormatter = new Intl.NumberFormat(formatterLocales, Language.NUMBER_FORMAT);
									
									// Get text argument number as version number parts
									var argumentParts = textArguments[argumentIndex].split(Language.VERSION_NUMBER_PART_SEPARATOR);
									
									// Go through all argument parts
									for(var j = 0; j < argumentParts["length"]; ++j) {
									
										// Get argument part as subparts
										var argumentPartSubparts = argumentParts[j].split(Language.VERSION_NUMBER_PART_SUBPART_SEPARATOR);
										
										// Go through all argument part subparts
										for(var k = 0; k < argumentPartSubparts["length"]; ++k) {
										
											// Check if argument part subpart is a numeric string
											if(Language.NUMERIC_STRING_PATTERN.test(argumentPartSubparts[k]) === true) {
										
												// Get argument part subpart formatted as a number
												argumentPartSubparts[k] = numberFormatter.format(argumentPartSubparts[k]);
											}
										}
										
										// Combine argument part subparts
										argumentParts[j] = argumentPartSubparts.join(Language.VERSION_NUMBER_PART_SUBPART_SEPARATOR);
									}
									
									// Combine argument parts
									var formattedArgumentNumber = argumentParts.join(Language.VERSION_NUMBER_PART_SEPARATOR);
									
									// Append argument formatted as a number to result and encode it if specified
									result += (encodeHtml === false) ? formattedArgumentNumber : Common.htmlEncode(formattedArgumentNumber);
									
									// Break
									break;
							}
						}
						
						// Otherwise
						else
						
							// Return empty string
							return "";
					}
				}
				
				// Otherwise
				else
				
					// Append character to result and encode it if specified
					result += (encodeHtml === false) ? text[i] : Common.htmlEncode(text[i]);
			}
			
			// Check if last placeholder is invalid
			if(placeholderStart !== Language.NO_PLACEHOLDER_START)
			
				// Return empty string
				return "";
			
			// Return result
			return result;
		}
		
		// Get constant
		static getConstant(constant, language = Language.NO_LANGUAGE) {
		
			// Set applicable language to the language if provided otherwise the current language
			var applicableLanguage = (language === Language.NO_LANGUAGE) ? Language.currentLanguage : language;
		
			// Loop while a value isn't found
			while(true) {
			
				// Check if applicable language is available
				if(typeof AVAILABLE_LANGUAGES !== "undefined" && applicableLanguage in AVAILABLE_LANGUAGES === true) {
				
					// Check if constants exist for the applicable language and the specified constant exists
					if("Constants" in AVAILABLE_LANGUAGES[applicableLanguage] === true && constant in AVAILABLE_LANGUAGES[applicableLanguage]["Constants"] === true)
					
						// Return the constant for the applicable language
						return AVAILABLE_LANGUAGES[applicableLanguage]["Constants"][constant];
					
					// Otherwise check if applicable language provides a fallback language
					else if(applicableLanguage !== DEFAULT_LANGUAGE && "Constants" in AVAILABLE_LANGUAGES[applicableLanguage] === true && "Fallback" in AVAILABLE_LANGUAGES[applicableLanguage]["Constants"] === true)
					
						// Set applicable language to the language's fallback language
						applicableLanguage = AVAILABLE_LANGUAGES[applicableLanguage]["Constants"]["Fallback"];
					
					// Otherwise check if the available language is not the default language
					else if(applicableLanguage !== DEFAULT_LANGUAGE)
					
						// Set applicable language to default language
						applicableLanguage = DEFAULT_LANGUAGE;
					
					// Otherwise
					else
					
						// Return empty string
						return "";
				}
				
				// Otherwise check if the applicable language is not the default language
				else if(applicableLanguage !== DEFAULT_LANGUAGE)
				
					// Set applicable language to default language
					applicableLanguage = DEFAULT_LANGUAGE;
				
				// Otherwise
				else
				
					// Return empty string
					return "";
			}
		}
		
		// Get default translation
		static getDefaultTranslation(text) {
		
			// Return text
			return text;
		}
		
		// Create translatable container
		static createTranslatableContainer(type, text, textArguments = [], classes = "", textIsTitle = false) {
		
			// Create container
			var container = $(type);
			
			// Make container translatable
			container.addClass("translatable");
			container.attr(Common.DATA_ATTRIBUTE_PREFIX + "text", text);
			container.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments", JSON.stringify(textArguments));
			
			// Check if type is meta
			if(type === "<meta>")
			
				// Set container's content to translation
				container.attr("content", Language.getTranslation(text, textArguments));
			
			// Otherwise check if text is title
			else if(textIsTitle === true)
			
				// Set container's title to translation
				container.attr("title", Language.getTranslation(text, textArguments));
			
			// Otherwise check if type is input
			else if(type === "<input>")
			
				// Set container's placeholder to translation
				container.attr("placeholder", Language.getTranslation(text, textArguments));
			
			// Otherwise
			else
			
				// Set container's HTML to translation
				container.html(Language.getTranslation(text, textArguments, true));
			
			// Add provided classes to text
			container.addClass(classes);
			
			// Return container's outer HTML
			return container.outerHtml();
		}
		
		// Show display
		static showDisplay(delayShow = false) {
		
			// Check if more than one language exists
			if(typeof AVAILABLE_LANGUAGES !== "undefined" && Object.keys(AVAILABLE_LANGUAGES)["length"] > 1) {
			
				// Check if delay show
				if(delayShow === true)
				
					// Set language display to transition at a slower speed
					$("div.language").removeClass("normalTransitionSpeed");
			
				// Show language display
				$("div.language").removeClass("hide");
				
				// Make room for language display
				$("main").addClass("languagesAvailable");
			}
		}
		
		// Translate element
		static translateElement(element) {
		
			// Change language for element
			Language.changeLanguage(Language.currentLanguage, false, element);
		}
		
		// Change event
		static get CHANGE_EVENT() {
		
			// Return change event
			return "LanguageChangeEvent";
		}
		
		// Before change event
		static get BEFORE_CHANGE_EVENT() {
		
			// Return before change event
			return "LanguageBeforeChangeEvent";
		}
		
		// Currency constant
		static get CURRENCY_CONSTANT() {
		
			// Return currency constant
			return "Currency";
		}
		
		// Currency number argument index
		static get CURRENCY_NUMBER_ARGUMENT_INDEX() {
		
			// Return currency number argument index
			return 0;
		}
		
		// Currency currency argument index
		static get CURRENCY_CURRENCY_ARGUMENT_INDEX() {
		
			// Return currency currency argument index
			return Language.CURRENCY_NUMBER_ARGUMENT_INDEX + 1;
		}
		
		// Currency display value argument index
		static get CURRENCY_DISPLAY_VALUE_ARGUMENT_INDEX() {
		
			// Return currency display value argument index
			return Language.CURRENCY_CURRENCY_ARGUMENT_INDEX + 1;
		}
		
		// Not translated text argument text index
		static get NOT_TRANSLATED_TEXT_TEXT_ARGUMENT_INDEX() {
		
			// Return not translated text argument text index
			return 0;
		}
		
		// Not translated text argument is raw data index
		static get NOT_TRANSLATED_TEXT_IS_RAW_DATA_ARGUMENT_INDEX() {
		
			// Return not translated text argument is raw data index
			return Language.NOT_TRANSLATED_TEXT_TEXT_ARGUMENT_INDEX + 1;
		}
	
	// Private
	
		// Change language
		static changeLanguage(newLanguage, languageIsDifferent = true, root = $("html")) {
		
			// Check if translating everything
			if(root.is("html") === true) {
			
				// Trigger language before change event
				$(document).trigger(Language.BEFORE_CHANGE_EVENT);
			
				// Set current language
				Language.currentLanguage = newLanguage;
				
				// Set cookie
				Language.setCookie();
				
				// Set local storage
				Language.setLocalStorage();
				
				// Check if language is different
				if(languageIsDifferent === true) {
				
					// Log message
					console.log("%c%s", "color: red; font-size: 30px; text-transform: uppercase;", Language.getTranslation('If someone asked you to copy/paste something here you are being scammed!!!'));
				}
			}
			
			// Go through all translatable elements
			root.find(".translatable").addBack(".translatable").each(function() {
			
				// Get element
				var element = $(this);
				
				// Check elements tag
				switch(element.prop("tagName")) {
				
					// HTML
					case "HTML":
					
						// Set element's language attribute
						element.attr("lang", Language.currentLanguage);
						
						// Set element's direction attribute
						element.attr("dir", Language.getConstant("Direction", Language.currentLanguage));
					
						// Break
						break;
					
					// Link
					case "LINK":
					
						// Check if language is different
						if(languageIsDifferent === true) {
					
							// Check if element has an href
							var href = element.attr("href");
							
							if(href !== Common.NO_ATTRIBUTE) {
						
								// Set element's href
								element.removeAttr("href");
								
								// Set timeout
								setTimeout(function() {
								
									// Restore element's href
									element.attr("href", href);
								}, 0);
							}
						}
						
						// Break
						break;
					
					// Meta
					case "META":
					
						// Check if element has a data text attribute
						if(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text") !== Common.NO_ATTRIBUTE)
						
							// Set element's content attribute
							element.attr("content", Language.getTranslation(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text"), (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments") !== Common.NO_ATTRIBUTE) ? JSON.parse(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments")) : []));
						
						// Break
						break;
					
					// Input
					case "INPUT":
					
						// Check if element has a data text attribute
						if(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text") !== Common.NO_ATTRIBUTE) {
						
							// Check if element is hidden
							if(element.attr("type") === "hidden")
							
								// Set element's value
								element.val(Language.getTranslation(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text"), (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments") !== Common.NO_ATTRIBUTE) ? JSON.parse(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments")) : []));
								
							// Otherwise
							else
						
								// Set element's placeholder attribute
								element.attr("placeholder", Language.getTranslation(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text"), (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments") !== Common.NO_ATTRIBUTE) ? JSON.parse(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments")) : []));
						}
						
						// Break
						break;
					
					// Default
					default:
						
						// Check if element has a data text attribute
						if(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text") !== Common.NO_ATTRIBUTE) {
						
							// Check if element has a title attribute
							if(element.attr("title") !== Common.NO_ATTRIBUTE)
							
								// Set element's title attribute
								element.attr("title", Language.getTranslation(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text"), (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments") !== Common.NO_ATTRIBUTE) ? JSON.parse(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments")) : []));
							
							// Otherwise check if element has its title currently saved
							else if(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title") !== Common.NO_ATTRIBUTE)
							
								// Set element's saved title attribute
								element.attr(Common.DATA_ATTRIBUTE_PREFIX + "title", Language.getTranslation(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text"), (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments") !== Common.NO_ATTRIBUTE) ? JSON.parse(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments")) : []));
							
							// Otherwise
							else
							
								// Set element's HTML
								element.html(Language.getTranslation(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "text"), (element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments") !== Common.NO_ATTRIBUTE) ? JSON.parse(element.attr(Common.DATA_ATTRIBUTE_PREFIX + "arguments")) : [], true));
						}
					
						// Break
						break;
				}
				
				// Check if tab is disabled for the element
				if(element.attr("tabindex") === Common.NO_TAB_INDEX) {
				
					// Disable tabbing to element's children
					element.find("*").disableTab();
				}
				
				// Check if element is a title tag
				if(element.prop("tagName") === "TITLE") {
				
					// Try
					try {
				
						// Trigger language change event on the element
						element.get(0).dispatchEvent(new Event(Language.CHANGE_EVENT));
					}
					
					// Catch errors
					catch(error) {
					
						// Trigger language change event on the element
						element.trigger(Language.CHANGE_EVENT);
					}
				}
				
				// Otherwise
				else {
				
					// Trigger language change event on the element
					element.trigger(Language.CHANGE_EVENT);
				}
			});
		}
		
		// Set cookie
		static setCookie() {
		
			// Set language cookie as current language
			document["cookie"] = Language.COOKIE_NAME + "=" + Language.currentLanguage + "; max-age=" + Language.COOKIE_MAX_AGE.toFixed() + "; secure; samesite=lax; priority=high; path=/; partitioned";
		}
		
		// Set local storage
		static setLocalStorage() {
		
			// Try
			try {
			
				// Save current language in local storage
				localStorage.setItem(Language.LOCAL_STORAGE_NAME, Language.currentLanguage);
			}
			
			// Catch errors
			catch(error) {
			
				// Check if fatal errors can be triggered
				if(typeof FatalError !== "undefined")
			
					// Trigger a fatal error
					new FatalError(FatalError.LOCAL_STORAGE_ERROR);
			}
		}
		
		// Get currency integer format
		static getCurrencyIntegerFormat(currency = Language.DEFAULT_CURRENCY) {
		
			// Check currency
			switch(currency) {
			
				// Currency name, Bitcoin currency name, Ethereum currency name
				case Consensus.CURRENCY_NAME:
				case Prices.BITCOIN_CURRENCY_NAME:
				case Prices.ETHEREUM_CURRENCY_NAME:
		
					// Return Bitcoin and Ethereum currency integer format
					return {
					
						// Style
						"style": "currency",
						
						// Currency
						"currency": Language.DEFAULT_CURRENCY,
						
						// Currency display
						"currencyDisplay": "symbol",
						
						// Notation
						"notation": "standard",
						
						// Minimum fraction digits
						"minimumFractionDigits": 1,
						
						// Maximum fraction digits
						"maximumFractionDigits": 1,
						
						// Use grouping
						"useGrouping": true
					};
				
				// Default
				default:
				
					// Return default currency integer format
					return {
					
						// Style
						"style": "currency",
						
						// Currency
						"currency": currency,
						
						// Currency display
						"currencyDisplay": "symbol",
						
						// Notation
						"notation": "standard",
						
						// Minimum fraction digits
						"minimumFractionDigits": 1,
						
						// Maximum fraction digits
						"maximumFractionDigits": 1,
						
						// Use grouping
						"useGrouping": true
					};
			}
		}
		
		// Get currency fraction format
		static getCurrencyFractionFormat(currency = Language.DEFAULT_CURRENCY) {
		
			// Check currency
			switch(currency) {
			
				// Currency name
				case Consensus.CURRENCY_NAME:
		
					// Return currency fraction format
					return {
					
						// Style
						"style": "currency",
						
						// Currency
						"currency": Language.DEFAULT_CURRENCY,
						
						// Currency display
						"currencyDisplay": "symbol",
						
						// Notation
						"notation": "standard",
						
						// Minimum fraction digits
						"minimumFractionDigits": 0,
						
						// Maximum fraction digits
						"maximumFractionDigits": Consensus.VALUE_NUMBER_BASE.toFixed()["length"] - 1,
						
						// Use grouping
						"useGrouping": true
					};
				
				// Bitcoin currency name
				case Prices.BITCOIN_CURRENCY_NAME:
		
					// Return Bitcoin currency fraction format
					return {
					
						// Style
						"style": "currency",
						
						// Currency
						"currency": Language.DEFAULT_CURRENCY,
						
						// Currency display
						"currencyDisplay": "symbol",
						
						// Notation
						"notation": "standard",
						
						// Minimum fraction digits
						"minimumFractionDigits": 0,
						
						// Maximum fraction digits
						"maximumFractionDigits": Prices.BITCOIN_NUMBER_BASE.toFixed()["length"] - 1,
						
						// Use grouping
						"useGrouping": true
					};
				
				// Ethereum currency name
				case Prices.ETHEREUM_CURRENCY_NAME:
		
					// Return Ethereum currency fraction format
					return {
					
						// Style
						"style": "currency",
						
						// Currency
						"currency": Language.DEFAULT_CURRENCY,
						
						// Currency display
						"currencyDisplay": "symbol",
						
						// Notation
						"notation": "standard",
						
						// Minimum fraction digits
						"minimumFractionDigits": 0,
						
						// Maximum fraction digits
						"maximumFractionDigits": Prices.ETHEREUM_NUMBER_BASE.toFixed()["length"] - 1,
						
						// Use grouping
						"useGrouping": true
					};
				
				// Default
				default:
				
					// Return default currency fraction format
					return {
					
						// Style
						"style": "currency",
						
						// Currency
						"currency": currency,
						
						// Currency display
						"currencyDisplay": "symbol",
						
						// Notation
						"notation": "standard",
						
						// Use grouping
						"useGrouping": true
					};
			}
		}
		
		// Get currency format
		static getCurrencyFormat(currency = Language.DEFAULT_CURRENCY) {
		
			// Return currency format
			return Language.getCurrencyFractionFormat(currency);
		}
		
		// Escape text
		static escapeText(text) {
		
			// Return text with all escape characters escaped
			return text.replace(Language.ESCAPE_CHARACTER_PATTERN, Language.ESCAPE_CHARACTER + Language.ESCAPE_CHARACTER);
		}
		
		// Escape character
		static get ESCAPE_CHARACTER() {
		
			// Return escape character
			return "%";
		}
		
		// Escape character pattern
		static get ESCAPE_CHARACTER_PATTERN() {
		
			// Return escape character pattern
			return /%/gu;
		}
		
		// Cookie name
		static get COOKIE_NAME() {
		
			// Return cookie name
			return "__Host-Language";
		}
		
		// Cookie max age
		static get COOKIE_MAX_AGE() {
		
			// Return cookie max age
			return 5 * Common.WEEKS_IN_A_YEAR * Common.DAYS_IN_A_WEEK * Common.HOURS_IN_A_DAY * Common.MINUTES_IN_AN_HOUR * Common.SECONDS_IN_A_MINUTE;
		}
		
		// Local storage name
		static get LOCAL_STORAGE_NAME() {
		
			// Return local storage name
			return "Language";
		}
		
		// No placeholder start
		static get NO_PLACEHOLDER_START() {
		
			// Return no placeholder start
			return null;
		}
		
		// Number placeholder type
		static get NUMBER_PLACEHOLDER_TYPE() {
		
			// Return number placeholder type
			return "s";
		}
		
		// Currency placeholder type
		static get CURRENCY_PLACEHOLDER_TYPE() {
		
			// Return currency placeholder type
			return "c";
		}
		
		// Translated text placeholder type
		static get TRANSLATED_TEXT_PLACEHOLDER_TYPE() {
		
			// Return translated text placeholder type
			return "x";
		}
		
		// Not translated text placeholder type
		static get NOT_TRANSLATED_TEXT_PLACEHOLDER_TYPE() {
		
			// Return not translated text placeholder type
			return "y";
		}
		
		// Time placeholder type
		static get TIME_PLACEHOLDER_TYPE() {
		
			// Return time placeholder type
			return "t";
		}
		
		// Date placeholder type
		static get DATE_PLACEHOLDER_TYPE() {
		
			// Return date placeholder type
			return "d";
		}
		
		// Timestamp placeholder type
		static get TIMESTAMP_PLACEHOLDER_TYPE() {
		
			// Return timestamp placeholder type
			return "u";
		}
		
		// Translated link placeholder type
		static get TRANSLATED_LINK_PLACEHOLDER_TYPE() {
		
			// Return translated link placeholder type
			return "l";
		}
		
		// Not translated link placeholder type
		static get NOT_TRANSLATED_LINK_PLACEHOLDER_TYPE() {
		
			// Return not translated link placeholder type
			return "m";
		}
		
		// Version placeholder type
		static get VERSION_PLACEHOLDER_TYPE() {
		
			// Return version placeholder type
			return "v";
		}
		
		// Placeholder pattern
		static get PLACEHOLDER_PATTERN() {
		
			// Return placeholder pattern
			return new RegExp("^" + Common.escapeRegularExpression(Language.ESCAPE_CHARACTER) + "([1-9]\\d*)\\$([" + Common.escapeRegularExpression(Language.NUMBER_PLACEHOLDER_TYPE + Language.CURRENCY_PLACEHOLDER_TYPE + Language.TRANSLATED_TEXT_PLACEHOLDER_TYPE + Language.NOT_TRANSLATED_TEXT_PLACEHOLDER_TYPE + Language.TIME_PLACEHOLDER_TYPE + Language.DATE_PLACEHOLDER_TYPE + Language.TIMESTAMP_PLACEHOLDER_TYPE + Language.TRANSLATED_LINK_PLACEHOLDER_TYPE + Language.NOT_TRANSLATED_LINK_PLACEHOLDER_TYPE + Language.VERSION_PLACEHOLDER_TYPE) + "])$", "u");
		}
		
		// Default formatter locale
		static get DEFAULT_FORMATTER_LOCALE() {
		
			// Return default formatter locale
			return "default";
		}
		
		// Number format
		static get NUMBER_FORMAT() {
		
			// Return number format
			return {
			
				// Style
				"style": "decimal",
				
				// Notation
				"notation": "standard",
				
				// Minimum fraction digits
				"minimumFractionDigits": 0,
				
				// Maximum fraction digits
				"maximumFractionDigits": Language.NUMBER_MAX_FRACTIONAL_DIGITS,
				
				// Use grouping
				"useGrouping": false
			};
		}
		
		// Number max fractional digits
		static get NUMBER_MAX_FRACTIONAL_DIGITS() {
		
			// Return number max fractional digits
			return 9;
		}
		
		// Time format
		static get TIME_FORMAT() {
		
			// Return time format
			return {
			
				// Hour
				"hour": "numeric",
				
				// Minute
				"minute": "numeric"
			};
		}
		
		// Date format
		static get DATE_FORMAT() {
		
			// Return date format
			return {
			
				// Year
				"year": "numeric",
				
				// Month
				"month": "long",
				
				// Day
				"day": "numeric"
			};
		}
		
		// Timestamp format
		static get TIMESTAMP_FORMAT() {
		
			// Return timestamp format
			return {
			
				// Year
				"year": "numeric",
				
				// Month
				"month": "2-digit",
				
				// Day
				"day": "2-digit",
				
				// Hour
				"hour": "2-digit",
				
				// Minute
				"minute": "2-digit",
				
				// Second
				"second": "2-digit",
				
				// Fractional second digits
				"fractionalSecondDigits": "3"
			};
		}
		
		// No fraction index
		static get NO_FRACTION_INDEX() {
		
			// Return no fraction index
			return null;
		}
		
		// Integer fraction separator
		static get INTEGER_FRACTION_SEPARATOR() {
		
			// Return integer fraction separator
			return ".";
		}
		
		// Version number part separator
		static get VERSION_NUMBER_PART_SEPARATOR() {
		
			// Return version number part separator
			return ".";
		}
		
		// Version number part subpart separator
		static get VERSION_NUMBER_PART_SUBPART_SEPARATOR() {
		
			// Return version number part subpart separator
			return "-";
		}
		
		// No language
		static get NO_LANGUAGE() {
		
			// Return no language
			return null;
		}
		
		// Default currency
		static get DEFAULT_CURRENCY() {
		
			// Return default currency
			return Language.getConstant(Language.CURRENCY_CONSTANT, DEFAULT_LANGUAGE);
		}
		
		// Link text argument index
		static get LINK_TEXT_ARGUMENT_INDEX() {
		
			// Return link text argument index
			return 0;
		}
		
		// Link URL argument index
		static get LINK_URL_ARGUMENT_INDEX() {
		
			// Return link URL argument index
			return Language.LINK_TEXT_ARGUMENT_INDEX + 1;
		}
		
		// Link is external argument index
		static get LINK_IS_EXTERNAL_ARGUMENT_INDEX() {
		
			// Return link is external argument index
			return Language.LINK_URL_ARGUMENT_INDEX + 1;
		}
		
		// Link is blob argument index
		static get LINK_IS_BLOB_ARGUMENT_INDEX() {
		
			// Return link is blob argument index
			return Language.LINK_IS_EXTERNAL_ARGUMENT_INDEX + 1;
		}
		
		// Change language delay milliseconds
		static get CHANGE_LANGUAGE_DELAY_MILLISECONDS() {
		
			// Return change language delay milliseconds
			return 100;
		}
		
		// Time hour length
		static get TIME_HOUR_LENGTH() {
		
			// Return time hour length
			return 2;
		}
		
		// Time minute length
		static get TIME_MINUTE_LENGTH() {
		
			// Return time minute length
			return 2;
		}
		
		// Time second length
		static get TIME_SECOND_LENGTH() {
		
			// Return time second length
			return 2;
		}
		
		// Time millisecond length
		static get TIME_MILLISECOND_LENGTH() {
		
			// Return time millisecond length
			return 3;
		}
		
		// Time component padding
		static get TIME_COMPONENT_PADDING() {
		
			// Return time component padding
			return "0";
		}
		
		// Date month length
		static get DATE_MONTH_LENGTH() {
		
			// Return date month length
			return 2;
		}
		
		// Date day length
		static get DATE_DAY_LENGTH() {
		
			// Return date day length
			return 2;
		}
		
		// Date component padding
		static get DATE_COMPONENT_PADDING() {
		
			// Return date component padding
			return "0";
		}
		
		// Numeric string pattern
		static get NUMERIC_STRING_PATTERN() {
		
			// Return numeric string pattern
			return /^(?:0|[1-9]\d*)$/u;
		}
}


// Main function

// Set global object's language
globalThis["Language"] = Language;

// Initialize language
Language.initialize();
