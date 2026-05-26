# mwcwallet.com

### Description
Source code of the MimbleWimble Coin web wallet, [mwcwallet.com](https://mwcwallet.com).

Mwcwallet.com is a self-custodial web wallet that allows you to manage your MimbleWimble Coin in your web browser. It can be accessed as a website at [https://mwcwallet.com](https://mwcwallet.com), as an Onion Service at [http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion](http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion), as a progressive web app, as a [browser extension](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension), as a [mobile app](https://github.com/NicolasFlamel1/MWC-Wallet-Mobile-App), or as a [standalone HTML file](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone).

This wallet also allows for you to manage your MimbleWimble Coin with Ledger and Trezor hardware wallets by being compatible with the [Ledger MimbleWimble Coin app](https://github.com/NicolasFlamel1/Ledger-MimbleWimble-Coin) and [Trezor firmware with MimbleWimble Coin support](https://github.com/NicolasFlamel1/trezor-firmware).

You can also use your own [node](https://github.com/mwcproject/mwc-node), [listener](https://github.com/NicolasFlamel1/WebSocket-Listener), and [Tor proxy](https://github.com/NicolasFlamel1/Tor-Proxy) with this wallet thus allowing it to function without having to rely on any third parties.

### Sending MWC To Exchanges Compatibility

Compatibility for sending MWC from the MimbleWimble Coin web wallet to exchanges:

|| [WhiteBIT](https://whitebit.com/trade/MWC-BTC) | [XT](https://www.xt.com/en/trade/mwc_btc) | [AscendEX](https://ascendex.com/en/cashtrade-spottrading/usdt/mwc) | [Coinstore](https://www.coinstore.com/spot/MWCUSDT) | [NonLogs](https://nonlogs.io/trade/MWC-USDT) |
|-|-|-|-|-|-|
| [MWC web wallet website](https://mwcwallet.com) | ❌ WhiteBIT doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✅ | ✅ | ✅ | ✅ Requires version 2.8.1 or newer of the web wallet. |
| [MWC web wallet Onion Service](http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion) | ❌ WhiteBIT doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✅ | ✅ | ✅ | ✅ Requires version 2.8.1 or newer of the web wallet. |
| MWC web wallet progressive web app version | ❌ WhiteBIT doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✅ | ✅ | ✅ | ✅ Requires version 2.8.1 or newer of the web wallet. |
| [MWC web wallet browser extension version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension) | ✅ | ✅ | ✅ | ✅ | ✅ Requires version 2.8.1 or newer of the web wallet. |
| [MWC web wallet mobile app version](https://github.com/NicolasFlamel1/MWC-Wallet-Mobile-App) | ✅ | ✅ | ✅ | ✅ | ✅ Requires version 2.8.1 or newer of the web wallet. |
| [MWC web wallet standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone) | ❌ WhiteBIT doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✅ | ✅ | ✅ | ✅ Requires version 2.8.1 or newer of the web wallet. |

\* This table assumes that the MimbleWimble Coin web wallet is using its default settings.

\* CORS issues can by bypassed by disabling CORS checks in your web browser, however this shouldn't be done without understanding the security implications of doing so. If you're using Chrome then you can install the [CORS Bypass](https://github.com/NicolasFlamel1/CORS-Bypass) browser extension to bypass your web browser's CORS restrictions.

### Receiving MWC From Exchanges Compatibility

Compatibility for receiving MWC from exchanges to the MimbleWimble Coin web wallet:

|| [WhiteBIT](https://whitebit.com/trade/MWC-BTC) | [XT](https://www.xt.com/en/trade/mwc_btc) | [AscendEX](https://ascendex.com/en/cashtrade-spottrading/usdt/mwc) | [Coinstore](https://www.coinstore.com/spot/MWCUSDT) | [NonLogs](https://nonlogs.io/trade/MWC-USDT) |
|-|-|-|-|-|-|
| [MWC web wallet website](https://mwcwallet.com) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [MWC web wallet Onion Service](http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion) | ✅ | ✅ | ✅ | ✅ | ✅ |
| MWC web wallet progressive web app version | ✅ | ✅ | ✅ | ✅ | ✅ |
| [MWC web wallet browser extension version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [MWC web wallet mobile app version](https://github.com/NicolasFlamel1/MWC-Wallet-Mobile-App) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [MWC web wallet standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone) | ✅ | ✅ | ✅ | ✅ | ✅ |

\* This table assumes that the MimbleWimble Coin web wallet is using its default settings.

\* It's unlikely that any exchanges using non-file based withdrawal methods currently support sending MWC to the MimbleWimble Coin web wallet when using a hardware wallet due to that [needing a longer network read timeout](https://github.com/mwcproject/mwc-wallet/pull/17).

### Trust And Privacy Concerns
By default, the MimbleWimble Coin web wallet is not trustless and sacrifices some of its users' privacy in order to achieve a greater ease of use. This is true for any of the methods that can be used to access this web wallet including accessing it from its website at [https://mwcwallet.com](https://mwcwallet.com), accessing it from its Onion Service at [http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion](http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion), accessing it from its progressive web app version, accessing it from its [browser extension version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension), accessing it from its [mobile app version](https://github.com/NicolasFlamel1/MWC-Wallet-Mobile-App), and accessing it from its [standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone).

However, this web wallet does provide a way to use it in a completely trustless and private way. This can be accomplished by performing the following steps.

1. Use the [Tor Browser](https://www.torproject.org/download/) to access this web wallet from [its standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone).
2. Run your own [MWC node](https://github.com/mwcproject/mwc-node) and set the web wallet to use it in its settings.
3. Run your own [listener](https://github.com/NicolasFlamel1/WebSocket-Listener) and set the web wallet to use it in its settings.

Accessing this web wallet in this way will remove the need to trust the servers hosting the site, listener, Tor proxy, and node. This will also preserve your privacy by not leaking your IP address to anyone that you send MWC to and your ISP won't be aware that you're using this web wallet.

### Wallet Integration
This wallet provides several ways to make it easier for services to accept receiving MimbleWimble Coin payments from those using this wallet. These are as follows:

All versions of this wallet, aside from its [standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone), will attempt to associate themselves with the `web+mwc` URL protocol. This allows clicking on links with that protocol to automatically open the wallet to initiate sending a transaction to a provided recipient address. For example: `<a href="web+mwchttps://mwcwallet.com/donate/mwc">Send</a>`.

This wallet's [browser extension version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension) injects a `MwcWallet` object into every site which allows those sites to automatically open the browser extension to initiate sending a transaction to a provided recipient address with an optionally provided amount and message. This is done using the [browser extension's start transaction API](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension#api). For example: `MwcWallet.startTransaction(MwcWallet.MWC_WALLET_TYPE, MwcWallet.MAINNET_NETWORK_TYPE, "https://mwcwallet.com/donate/mwc", "123.456", "Optional message")`.

The following JavaScript code demonstrates how to change clicking on a link to a recipient address to instead open this wallet's browser extension if its installed and, if not, add the `web+mwc` URL protocol to the link temporarily so that it will open this wallet. The URL protocol is immediately removed so that the user could still choose to copy and paste the link by right clicking on it instead.
```
// Link click event
document.getElementsByTagName("a")[0].addEventListener("click", (event) => {

	// Get link's URL
	const url = event.target.href;
	
	// Check if the MWC Wallet browser extension is installed and this event isn't recursive
	if(typeof MwcWallet !== "undefined" && event.isTrusted !== false) {
	
		// Prevent default
		event.preventDefault();
		
		// Start transaction with the MWC Wallet browser extension and catch errors
		MwcWallet.startTransaction(MwcWallet.MWC_WALLET_TYPE, MwcWallet.MAINNET_NETWORK_TYPE, url).catch(function(error) {
		
			// Recursivley trigger link's click event
			event.target.click();
		});
	}
	
	// Otherwise
	else {
	
		// Add the web+mwc protocol to the link's URL
		event.target.setAttribute("href", "web+mwc" + url);
		
		// Set timeout
		setTimeout(() => {
		
			// Remove the web+mwc protocol from the link's URL
			event.target.setAttribute("href", url);
		}, 0);
	}
});
```

This wallet's scan QR code feature when sending a payment will automatically fill in the transaction's details when sending a payment if the scanned QR code consists of a JSON object containing a recipient address and an optional amount and message. For example: `{"Recipient Address": "https://mwcwallet.com/donate/mwc", "Amount": "123.456", "Message": "Optional message"}`.

### Develop
This site can be ran from a local machine for development purposes. To do that, this repo's files are intended to reside at `/srv/mwcwallet.com`, but can be located anywhere as long as the `root` directive in the `nginx.conf` file correctly reflects the `public_html` folder's current location.

This repo includes a self-signed certificate, `privkey.pem` and `fullchain.pem`, that will work for `https://mwcwallet.com` and `https://www.mwcwallet.com` if `fullchain.pem` is added to your browser's trusted certificate authorities.

This site requires that the following are installed.
* [Nginx](https://nginx.org/) >= 1.18.0
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

	$availableLanguages["fr-FR"] = [
	
		"Contributors" => [
			"Your name here" => "http://yourLinkHere"
		],
		
		"Constants" => [
		
			"Language" => "Français",
			
			"Direction" => "ltr",
			
			"Image" => "./images/countries/france.svg",
			
			"Currency" => "EUR",
			
			"Extension Locale Code" => "fr",
			
			"Fallback" => "fr"
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
