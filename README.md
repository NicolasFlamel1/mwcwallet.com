# mwcwallet.com

### Description
Source code of the MimbleWimble Coin web wallet, [mwcwallet.com](https://mwcwallet.com).

### Develop
This site can be ran from a local machine for development purposes. To do that, this repo's files are intended to reside at `/srv/mwcwallet.com`, but can be located anywhere as long as the `root` directive in the `nginx.conf` file correctly reflects the `public_html` folder's current location.

This repo includes a self-signed certificate, `privkey.pem` and `fullchain.pem`, that will work for `https://mwcwallet.com` and `https://www.mwcwallet.com` if `fullchain.pem` is added to your browser's trusted certificate authorities.

This site requires that the following are installed.
* [Nginx](https://www.nginx.com/) >= 1.18.0
* [PHP](https://www.php.net/) >= 7.4
* [Tor](https://www.torproject.org/download/) >= 0.4.2.7
* [Allow Headers Nginx module](https://github.com/NicolasFlamel1/Allow-Headers)
* [Block Access Nginx module](https://github.com/NicolasFlamel1/Block-Access)
* [SOCKS Proxy Nginx module](https://github.com/NicolasFlamel1/SOCKS-Proxy)

### Translate
This site can easily integrate translations for different languages. All lines of translatable text can be obtained by running the following command.
```
(grep -Proh "(?<=getTranslation\()'((?:.*?[^\\\])?(?:\\\\)*)'(?=[\),])"; grep -Proh "(?<=getDefaultTranslation\()'((?:.*?[^\\\])?(?:\\\\)*)'(?=[\),])") | sort -u | sed -r "s/\$\$/ => '',/"
```

Those lines of text can then be translated and added to a language specific file in the `public_html/languages` folder. The following characters must be escaped when creating translations.
* Escape `%` as `%%`.
* Escape `'` as `\'`.
* Escape `\` as `\\`.

Parameters can exist in translatable text, and they have the following meanings.
* `%d` is a date.
* `%t` is a time.
* `%u` is a timestamp.
* `%s` is a number.
* `%x` is a translated text.
* `%y` is a not translated text.
* `%c` is a currency.
* `%l` is a translated link.
* `%m` is a not translated link.
* `%v` is a version.

For example, here's what a file for a French translation, `public_html/languages/french.php`, may look like.
```
<?php

	$availableLanguages["fr"] = [
	
		"Contributors" => [
			"Your name here"
		],
		
		"Constants" => [
		
			"Language" => "Français",
			
			"Direction" => "ltr",
			
			"Image" => "./images/countries/france.svg",
			
			"Currency" => "EUR"
		],
		
		"Text" => [
		
			'Copy' => 'Copie',
			'Value: %1$c' => 'Valeur: %1$c',
			.
			.
			.
			'Wallet %1$s' => 'Portefeuille %1$s'
		]
	];
?>
```
