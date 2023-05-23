# Sending MWC To Exchanges Compatibility

Compatibility for sending MWC from the MimbleWimble Coin web wallet and Ledger Live Desktop/Mobile  to exchanges:

|| [Hotbit](https://www.hotbit.io/exchange?symbol=MWC_USDT) | [TradeOgre](https://tradeogre.com/exchange/BTC-MWC) | [BitForex](https://www.bitforex.com/en/spot/mwc_usdt) |
|-|-|-|-|
| [MWC web wallet website](https://mwcwallet.com) | ❌ Hotbit doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✔ Requires version 2.2.0 or newer of the web wallet. | ❌ BitForex doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). |
| [MWC web wallet Onion Service](http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion) | ❌ Hotbit doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✔ Requires version 2.2.0 or newer of the web wallet. | ❌ BitForex doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). |
| MWC web wallet progressive web app version | ❌ Hotbit doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✔ Requires version 2.2.0 or newer of the web wallet. | ❌ BitForex doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). |
| [MWC web wallet browser extension version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension) | ✔ | ✔ Requires version 2.2.0 or newer of the web wallet. | ✔ Requires version 1.1.19 or newer of the web wallet. |
| [MWC web wallet standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone) | ❌ Hotbit doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | ✔ Requires version 2.2.0 or newer of the web wallet. | ❌ BitForex doesn't support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). |
| [Ledger Live Desktop/Mobile](https://github.com/NicolasFlamel1/ledger-live) | ✔ Requires version 2.52.1 or newer of Ledger Live Desktop and version 3.14.1 or newer of Ledger Live Mobile. | ✔ | ✔ |

\* This table assumes that the MimbleWimble Coin web wallet and Ledger Live Desktop/Mobile are using their default settings.
 
\* [WhiteBIT](https://whitebit.com/trade/MWC-BTC) had temporarily suspended depositing and withdrawing MWC when this table was created which is why they aren't included.

\* CORS issues can by bypassed by disabling CORS checks in your web browser, however this shouldn't be done without understanding the security implications of doing so.

# Receiving MWC From Exchanges Compatibility

Compatibility for receiving MWC from exchanges to the MimbleWimble Coin web wallet and Ledger Live Desktop/Mobile:

|| [Hotbit](https://www.hotbit.io/exchange?symbol=MWC_USDT) | [TradeOgre](https://tradeogre.com/exchange/BTC-MWC) | [BitForex](https://www.bitforex.com/en/spot/mwc_usdt) |
|-|-|-|-|
| [MWC web wallet website](https://mwcwallet.com) | ✔ | ✔ Requires version 2.2.0 or newer of the web wallet. | ✔ |
| [MWC web wallet Onion Service](http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion) | ✔ | ✔ Requires version 2.2.0 or newer of the web wallet. | ✔ |
| MWC web wallet progressive web app version | ✔ | ✔ Requires version 2.2.0 or newer of the web wallet. | ✔ |
| [MWC web wallet browser extension version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension) | ✔ | ✔ Requires version 2.2.0 or newer of the web wallet. | ✔ |
| [MWC web wallet standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Standalone) | ✔ | ✔ Requires version 2.2.0 or newer of the web wallet. | ✔ |
| [Ledger Live Desktop/Mobile](https://github.com/NicolasFlamel1/ledger-live) | ❌ Hotbit doesn't support withdrawing as file. | ✔ | ❌ BitForex doesn't support withdrawing as file. |

\* This table assumes that the MimbleWimble Coin web wallet and Ledger Live Desktop/Mobile are using their default settings.
 
\* [WhiteBIT](https://whitebit.com/trade/MWC-BTC) had temporarily suspended depositing and withdrawing MWC when this table was created which is why they aren't included.
 
\*  It's unlikely that any exchanges currently supports sending MWC to the MimbleWimble Coin web wallet when using a hardware wallet due to that [needing a longer network read timeout](https://github.com/mwcproject/mwc-wallet/pull/17).
