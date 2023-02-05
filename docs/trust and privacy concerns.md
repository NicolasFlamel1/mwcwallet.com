# Trust And Privacy Concerns
By default, the MimbleWimble Coin web wallet is not trustless and sacrifices some of its users' privacy in order to achieve a greater ease of use. This is true for any of the methods that can be used to access this web wallet, including accessing it from its website at [https://mwcwallet.com](https://mwcwallet.com), accessing it from its Onion Service at [http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion](http://mwcwalletmiq3gdkmfbqlytxunvlxyli4m6zrqozk7xjc353ewqb6bad.onion), accessing it from its progressive web app version, accessing it from [its browser extension version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension), and accessing it from [its standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension).

However, this web wallet does provide a way to use it in a completely trustless and private way. This can be accomplished by performing the following steps.

1. Use the [Tor Browser](https://www.torproject.org/download/) to access this web wallet from [its standalone version](https://github.com/NicolasFlamel1/MWC-Wallet-Browser-Extension).
2. Run your own [MWC node](https://github.com/mwcproject/mwc-node) and set the web wallet to use it in its settings.
3. Run your own [listener](https://github.com/NicolasFlamel1/WebSocket-Listener) and set the web wallet to use it in its settings.

Accessing this web wallet in this way will remove the need to trust the servers hosting the site, listener, tor proxy, and node. This will also preserve your privacy by not leaking your IP address to any wallets that you send MWC to and your ISP won't be aware that you're using this web wallet.
