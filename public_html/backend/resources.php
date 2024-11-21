<?php

	// Constants
	
	// Favicon parts
	const FAVICON_PARTS = [
	
		// X dimension
		"X Dimension" => 0,
		
		// Y dimension
		"Y Dimension" => 1,
		
		// File path
		"File Path" => 2
	];
	
	// Favicons
	const FAVICONS = [
		["./favicon.ico"]
	];
	
	// App icon parts
	const APP_ICON_PARTS = [
	
		// X dimension
		"X Dimension" => 0,
		
		// Y dimension
		"Y Dimension" => 1,
		
		// Use as favicon
		"Use As Favicon" => 2,
		
		// Mobile only
		"Mobile Only" => 3,
		
		// File path
		"File Path" => 4
	];

	// App icons
	const APP_ICONS = [
		[16, 16, TRUE, NULL, "./images/app_icons/app_icon-16x16.png"],
		[24, 24, TRUE, NULL, "./images/app_icons/app_icon-24x24.png"],
		[32, 32, TRUE, NULL, "./images/app_icons/app_icon-32x32.png"],
		[48, 48, TRUE, NULL, "./images/app_icons/app_icon-48x48.png"],
		[64, 64, TRUE, NULL, "./images/app_icons/app_icon-64x64.png"],
		[114, 114, TRUE, NULL, "./images/app_icons/app_icon-114x114.png"],
		[120, 120, TRUE, NULL, "./images/app_icons/app_icon-120x120.png"],
		[128, 128, TRUE, NULL, "./images/app_icons/app_icon-128x128.png"],
		[144, 144, TRUE, NULL, "./images/app_icons/app_icon-144x144.png"],
		[152, 152, TRUE, NULL, "./images/app_icons/app_icon-152x152.png"],
		[180, 180, TRUE, NULL, "./images/app_icons/app_icon-180x180.png"],
		[192, 192, TRUE, FALSE, "./images/app_icons/app_icon-192x192.png"],
		[192, 192, FALSE, TRUE, "./images/app_icons/app_icon-192x192-mobile.png"],
		[256, 256, TRUE, FALSE, "./images/app_icons/app_icon-256x256.png"],
		[256, 256, FALSE, TRUE, "./images/app_icons/app_icon-256x256-mobile.png"],
		[384, 384, FALSE, NULL, "./images/app_icons/app_icon-384x384.png"],
		[512, 512, FALSE, NULL, "./images/app_icons/app_icon-512x512.png"],
		["./images/app_icons/app_icon.svg"]
	];
	
	// Touch icon parts
	const TOUCH_ICON_PARTS = [
	
		// X dimension
		"X Dimension" => 0,
		
		// Y dimension
		"Y Dimension" => 1,
		
		// File path
		"File Path" => 2
	];

	// Touch icons
	const TOUCH_ICONS = [
		[57, 57, "./images/touch_icons/touch_icon-57x57.png"],
		[76, 76, "./images/touch_icons/touch_icon-76x76.png"],
		[114, 114, "./images/touch_icons/touch_icon-114x114.png"],
		[120, 120, "./images/touch_icons/touch_icon-120x120.png"],
		[144, 144, "./images/touch_icons/touch_icon-144x144.png"],
		[152, 152, "./images/touch_icons/touch_icon-152x152.png"],
		[167, 167, "./images/touch_icons/touch_icon-167x167.png"],
		[180, 180, "./images/touch_icons/touch_icon-180x180.png"],
		["./images/touch_icons/touch_icon-180x180.png"]
	];
	
	// Tile image parts
	const TILE_IMAGE_PARTS = [
	
		// X dimension
		"X Dimension" => 0,
		
		// Y dimension
		"Y Dimension" => 1,
		
		// Ratio
		"Ratio" => 2,
		
		// File path
		"File Path" => 3
	];

	// Tile images
	const TILE_IMAGES = [
		[70, 70, "square", "./images/tile_images/tile_image-70x70.png"],
		[150, 150, "square", "./images/tile_images/tile_image-150x150.png"],
		[310, 150, "wide", "./images/tile_images/tile_image-310x150.png"],
		[310, 310, "square", "./images/tile_images/tile_image-310x310.png"]
	];

	// Mask images
	const MASK_IMAGE = "./images/mask_images/mask_image.svg";

	// Theme color
	const THEME_COLOR = "#FFFFFF";
	
	// Background color
	const BACKGROUND_COLOR = "#7A00D9";
	
	// Files
	$files = [
		"./" => [
			"Version" => 0,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./connection_test.html" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/font_awesome/font_awesome-5.15.4.woff2" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "gNULDPfQZDMqDI59ny4pTxq+0VxHZEywS5K3ha9GAbaDz9PGaMDvMd7jQoQAY+DDla5FNlAYSXG6mE7I7NMiOg=="
		],
		"./fonts/font_awesome/font_awesome-5.15.4.woff" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "ZLqsxHjeYNildxUCsvXMO5cIIhuWfamaIjlMuKEsY2q4pIQ1YjPCMrm9Df7hmdyMF4A+OKE8B+1dqmKpwB/rvQ=="
		],
		"./fonts/font_awesome/font_awesome.css" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/font_awesome/font_awesome_solid-5.15.4.woff2" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "qE4T8hbqlRRq8oWvmK7wtGTNliRA4WGhxgLKIXiheeBK5O0qL5jVsusWVIDsaSDg6I3nfV8et/Ee13Kwktr4ZQ=="
		],
		"./fonts/font_awesome/font_awesome_solid-5.15.4.woff" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "2RsYqSOpBz8fwf7PGwEJOPedgk0hB2Z1l/RaZdOEPjUOQguCqVBtfKYsAqWuq7HTZ2Y1+CXdN7hk0w8oNXFMQg=="
		],
		"./fonts/open_sans/open_sans.css" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/open_sans/open_sans-1.10.woff" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "d3WdXIW6Z4EumIsy5FdtC8dPTlap7QuUhf5tjoM+NC/Rd60w5wXJJC0FhK8V9/aRQ9usHfNUPe/KldMpzrCcoA=="
		],
		"./fonts/open_sans/open_sans-1.10.woff2" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "1rOU7Kf82ZZRJvJiNGXlgypsFrwAnO2Pwz6y84jWZ3zuz7GLfVontK79sm35BPlBvDdvwFl/Yrl4ogXzPu3q6A=="
		],
		"./fonts/open_sans/open_sans_semibold-1.10.woff" => [
			"Version" => 1,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "jW/+TDOsxdKHWZTSq5UOyKLPsrUlRyb6qN572yo/aCqgS9xsPZ5OBHi4GaMQDQOSmXvD9W6VwAa+6LuiFWthDg=="
		],
		"./fonts/open_sans/open_sans_semibold-1.10.woff2" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "0JKBQKmvWErkWlPg4bfszONNBjfUWJWZhK6yr936YeLYfGGkM9DULs/7puQcUK8iEVC4+XZ3jhUP4B91flnInQ=="
		],
		"./fonts/mwc/mwc.css" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/mwc/mwc.woff" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "QvAe73bxFv4FTrIZQywgCrSFqgMP24xT56PjT0qkOd+Ic9s9jufOH/QAQIDFwbE6yZSEu28imxVw2H1I/f9rhA=="
		],
		"./fonts/mwc/mwc.woff2" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "TxAB5YdnZoWzz/N9f+zGfa6KYTolOEXijnQuFtk762BOV/e0P97fx467xwzlB7/KR4klGmjpRxunpN1/F9l4Qw=="
		],
		"./fonts/grin/grin.css" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/grin/grin.woff" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "o2PiDYI0DXbX7wMWGPZLQhR6VnCwkLTX6iYholTb9pVzqhNc9vDiJRzNHqsaBNMr2oE//6IoTKAZzWqI39pZZg=="
		],
		"./fonts/grin/grin.woff2" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "V6bq44MMOpge+H/UOcSRgZIsxrXh/aB9e02bRS+M5XWlbSppzXf+p0O08bEbPlMxWZaIbJCaI05zfA61rT2+gg=="
		],
		"./fonts/epic/epic.css" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/epic/epic.woff" => [
			"Version" => 1,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "gNZ3w1GCnlgZoNwDzccpszVcV0GX4lDhO/6WxdXPNQMNDz/DT7sde4mffyp1E6jcdcafic6yqB24yBqpF54PIw=="
		],
		"./fonts/epic/epic.woff2" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "b8IHIOXGhAp29uhKUNFwDgRjSfz2Q5kcGw9Bg/BJr3v8YSeXvLWtbZYzrh2LOMuwH18QQlhPecyqQj9akfm/EA=="
		],
		"./fonts/btc/btc.css" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/btc/btc.woff" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "SfSYyklmLxkhgoli6lw65pMyT9HUI5p8w8/d4ILwWrmiSyq7vg1wY2ZpAGdseTgHqCMFFHqRvVXgoxyPFO/Ixw=="
		],
		"./fonts/btc/btc.woff2" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "HF1Vum3F2kBrrUKcZZ9VHiPRPzheZ/B8yahmr7aQx+TBCNeMtjYatU7N9lvqxWBiPo2cA6aYsyX2dzdljyxyuQ=="
		],
		"./fonts/eth/eth.css" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./fonts/eth/eth.woff" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "gt/dON/VN9ECB6aNxi1438gJbLkpf2esYiMfuw/E78pS6+QyI/iR+coBhrEE7XOeU3Q4Xrp3eRk2FlRzbmBQRQ=="
		],
		"./fonts/eth/eth.woff2" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "eo8uv656TWX4+oTTWrilXjsEsf0mY1wacVdsdskOHlw3CtZ0TtT6MwLig2m4LKHQFO11Ns/rZBtiw9DfGUXGCw=="
		],
		"./robots.txt" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./privacy_policy.txt" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./favicon.ico" => [
			"Version" => 0,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./sitemap.xml" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./scripts/prices.js" => [
			"Version" => 16,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "tJJnVOFB5KeDa13rKP9GYg71q8Ynwk+bNxSabqV2M2mCD8xu3GeACdF35TDd2WLTypXyZNp0IYhc5d1SjyfT5g=="
		],
		"./scripts/log.js" => [
			"Version" => 7,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "v7LKQef3zZkFw6DEmH1rjipx7uQKkQntQapNGAbOv03yoRPoyUsOJERGrPE2KIhPxre6Dx1BlLAwrDAhMeslOQ=="
		],
		"./scripts/qrcode-generator-1.4.4.js" => [
			"Version" => 7,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "OVFEJkHw515H4ocWALOe5Fg3GIJGJ3cOvWS5xPsoh75r6srpUB7B2C0pm9R1N/LerYefjk0eJDLR8pksUtyXwQ=="
		],
		"./scripts/jsQR-1.4.0.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "H2kn8fvMTiODT1At1gNgDrzr+K+CS9k7ervx0YANJHUlCyGQhWHVI48TX6hmoDPFt1Xdi+vS1ej982fclk3ZEg=="
		],
		"./scripts/clipboard.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "AaYCKtIK3CfkZgJL+KjqGHbvK+urVTVK0Wagvfi9MQcrVy95oT6vmwR0lkjIA1gO89vuQ15jrW4vjLyLjUihfA=="
		],
		"./scripts/wallets.js" => [
			"Version" => 73,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "dPusPRCnCmHd3HtU3too2Th76vqqKBE3ARrdf3SIhznOinyyBXyvn+xDw9PoMWITeGeD5XVkUTuvXzPSQN0oag=="
		],
		"./scripts/application.js" => [
			"Version" => 104,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "JxRayxeIgfzOSFJTzM/2N9XsKkgPH5otqTt6RqJw72b8V2/qfiSlacef4yqAV+p6tK/ZIrgKZ1IrTRHv0zoNnQ=="
		],
		"./scripts/automatic_lock.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "CKe5Yj4y0545+GGmB5xPKsioR+2XwWy9dKa5H6l3wGQL6FPM84MQ6cif1kSPU2AQEEDP5iQdmUoTfjH7Nkvnkw=="
		],
		"./scripts/wake_lock.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "6IoZ640jM4IsPVC0QB7+wiuens2+mcxLasLwGkGoszew+RVumYtcUmdruWbpr2LVG0ntS06TvUrUt5DqIJwVXQ=="
		],
		"./scripts/language.js" => [
			"Version" => 64,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "VOxCDUjUJMIxmu56wmw6hqTKGRuq2QhyHmI/97+9xwN8Ax+xy3a4O6TTVyEdCsxEKHpUJSfDpnnvIv7+QcKzag=="
		],
		"./scripts/protocol_handler.js" => [
			"Version" => 8,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "K87ooywiCyohMmt3YZeqByof/3bWyRpbYQJh+3ma78nHgRgGsdiaRI3qgnLS/M72Gq8jQKagdM1h7DrYqYv6sA=="
		],
		"./scripts/copyright.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "LHfSJCXoGVnVigP9EA7rYdPy5ppdNINHp7Hm4+ZeKzLl+C0feXKPTMdc9j/7P4CVwt8UBKuX3ZYffIuiacVQuQ=="
		],
		"./scripts/settings.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "/8I95gnj730sRL2t8+uapaIGhYl4n7lQHkrUa7nB2BTe73pIqJAkziCoabBBdcF+ClzPEuE1bVEOcjJ62nl99A=="
		],
		"./scripts/caps_lock.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "k4sftkZ0gB3BKP7dmfcMmIzXcNOOgse3V0EK2aTqtx60SYxlEWtPf3wyD+TaMT4r5fQwdAWd/AWd/+LAwFAGhw=="
		],
		"./scripts/instance.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "yBIcZfj1vFmK0dWgudrlqX3cYC0Hg+lrZ40uT3R6bfqZ7rAthgJTwkFjn+b5TXj+qV39KFJQJwKqnol7tIBdDA=="
		],
		"./scripts/tetris.js" => [
			"Version" => 10,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "MkRkaXe8V7U6UZI/wJza3b8syfEflRaPzK6FS025whXZ3xCS+zeE8OuMlzYqCcZI4RURQ9ePc683eJrMAFdpnw=="
		],
		"./scripts/logo.js" => [
			"Version" => 14,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "djV+b/HtH4v0vFscECm8/b8dj/sZ1Y4NrkHhb8FlUfZHAAKDpta2XMhC/QNrlBQoBJBIBjN/VOgnP9AoxmYd1Q=="
		],
		"./scripts/service_worker_installer.js" => [
			"Version" => 10,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "lpFVNVY1nK6ZM1winGWXDkVOz4bRxgpgKbyC6YeJELwiAXSy32/pvYZMlaySJfHyRbeyRMahuHqGaRZUUjMQdA=="
		],
		"./scripts/wallet.js" => [
			"Version" => 25,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "PojnUykqdVTAwgBtx2yYUzZLawnNQZS1AtSTHvMeImMo1X+5IFTVSY6Xezl8CTywaVkJ0SyRIWogmrOPvAmHvA=="
		],
		"./scripts/consensus.js" => [
			"Version" => 30,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "n5ES3sazs7wZq1XqWZbRrk22pJ3r9fMQd9s4Z1J9HoWB5DV/OAS9PDK8qo8lgsLsar3aV9DTpf+RfIEfwN9lEQ=="
		],
		"./scripts/transaction.js" => [
			"Version" => 13,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "D8F+g8KMqTxpFTXHYtZyJKNRmtsUx9vSIC/3+p3y/OoBRZ0SvB/HSmWPn9GgvJP5MJtWnsWaJDh0RCruLzK2OQ=="
		],
		"./scripts/transactions.js" => [
			"Version" => 19,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "8A7HGyjR2cWp2dy5mtGX5+okEawJSsZxO71S4rUQeaweIhyLqR5y1TaH/EoR8QfCunEcY5QkNfm4P0TU8MWE3g=="
		],
		"./scripts/focus.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "kKUstqzGQ5tu+0Mgeq+GaBOZAGC5hBxwPp1f/BhNKY7w0zV+xwz+Ko5AopwmK9EcQorimi2lkOTYCiXt7cSI+Q=="
		],
		"./scripts/identifier.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "jSzvJoFNyGWGAlNp1a4r556E4qYOKEqZFy153hcWtYOjKYGsBLkY+z5koJK/kiDxemFjQ1v8HtfqeassdIiazg=="
		],
		"./scripts/crypto.js" => [
			"Version" => 15,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "1Dos1rNWtUlUuVq4ElvN9Twhy9SaeXeN3kTAGT7ND8tAPn3eskDtegm+zVMrxqH5iyN+Zk3cL7IbTKs23OtHKA=="
		],
		"./scripts/api.js" => [
			"Version" => 131,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "la+Ke0z4OcOjZc0uhAP6w7pZ3Y+0esV/Gx5+ielneckX9kggeOfThy/sDFBrDF4+9lAWsA6logB27dAf9/iZ5Q=="
		],
		"./scripts/hardware_wallet.js" => [
			"Version" => 77,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "jSkNynN4NGRO4TyTa7bz2ojp4oCCA64VeEGEqxqdi5U4CW9RySV3+6qJ/L7lVV/P3ODsvtpmcHR6MtMxBorOkg=="
		],
		"./scripts/hardware_wallet_usb_transport.js" => [
			"Version" => 8,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "2Mv5CXrHhE4o7KnPHwme4X/CjM7CYl4WHxJ6c/7FA6jmCRjwP6xKr1OjoRmCrhiKJAmryK0pHSnQgjfKmbRoxA=="
		],
		"./scripts/hardware_wallet_bluetooth_transport.js" => [
			"Version" => 8,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "btNPxYqBOouFkxCbzCuQWUoJqNvSXcsAF3IrNw1FpBQbLq1Ny3sIHj/Fqrz+c5C53JcGZ9Esgoffq9U5bMf23A=="
		],
		"./scripts/hardware_wallet_definitions.js" => [
			"Version" => 10,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "EnU1TuygTMQWi1jyd8cKWL657kgmVrgi5rcn4PBQupeEl+WJKsKOVao8O7isPKvFygBYoQgPmQf3yTJM3O6beA=="
		],
		"./scripts/protocol_buffers.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "lhVliQVhGnbjQIDWGz99uzyqBMQSwAYw31EoKfCBORKBgf2QrD+uqJzXazKSq7bUYE2Abd+g3j5CvZF5deTtmw=="
		],
		"./scripts/proof_builder.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "+YQhxhPUHhCAaBEiVz7c3jiJL/eoGKcvhB8qi25Z2CrUdKIiSqdtrHAbIMLTlLmzwJ2iYoTxiAJdxxLxHJ5ryg=="
		],
		"./scripts/legacy_proof_builder.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "z0SKIdDp9pej96Y6IWMsGAwTBYTMLywl8rkFhZn4uHxwtWr2zclalpxA6dzZZSUOaevd4w3SU68e9q3iWgCU/w=="
		],
		"./scripts/new_proof_builder.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "HDbukxH9AKHtSVCYiFDJbf2nZ/2H/Vhl2PGTD81DUgX/m62mlsgwfk52Sg+S5RuXpx+gK6DXU3S8smegfyUi4g=="
		],
		"./scripts/view_proof_builder.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "lxuV6f6wNme51ooebXyuRZ2ILRkvd48l57/9UcU9UB+SyB7hwzFGahoz3hQ9bNYbvCGf8tmjqv0M90hFi/3qEQ=="
		],
		"./scripts/service_worker.js" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./scripts/bignumber.js-9.1.1.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "rc10/7RWHaBylfU5d1xX+pGO2dWTaooPdO7PbRmGSN8majqQGqDRoZ88xKUYfMK9oWp+m86MnRtvsx2CnmogDQ=="
		],
		"./scripts/base64.js-3.7.5.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "i7T2cMTN4yMPw3QW8KMu48My+GLzRYpuJsA71Y5JJYYKJh+H8hjvycsVwkIeLZcpGbNbX+G4q6uZ7WuVEI61eA=="
		],
		"./scripts/crc32-1.2.0.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "1C/g5xU+C5AIbkigSJ53JJ9j83nFt/3A53atZUwYN615yngUk2Ur+ajqoTPqVjHaJzbkUsZFkLfgsR54KuGG7A=="
		],
		"./scripts/database_transaction.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "xsBUDHmDFrkpT/ZXsyMdy9e0nls+PvNvl1ARxcAB8rPDWH3pH9x3PnLDCie7qmpaN+pOdYb6dxowQn2vcWHILA=="
		],
		"./scripts/database.js" => [
			"Version" => 20,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "gArt5uC3V53OjPXQsCXwOGSceIpAa2M4Wcu7Pj46JTTevrFs7zq6+7LtmKBP/gPVB3OnexLq2Z5ietJ5N2riIw=="
		],
		"./scripts/output.js" => [
			"Version" => 12,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "4+bncF10tkec8E6ZpuhaKLcLaFVYek0Ip34Fbc8/FtbM6lE9f5sQ8kfwaGifV8x3xsXY9doCywyrtM6KOxLzrw=="
		],
		"./scripts/output_information.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "ig4BjvopYK4Oh7AtF9x5MntYRzW0oSh/n7BTqThp1DlC0vJCTyRJ+/mtOWtDdgC6U+5d4sJzMCBfmGm69sJNTQ=="
		],
		"./scripts/output_worker.js" => [
			"Version" => 75,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./scripts/slate_worker.js" => [
			"Version" => 142,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./scripts/camera.js" => [
			"Version" => 8,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "2ZFvWf9x++Vv5+5yeq1fWEHazydcrD7rc+OTWhRAr3MlyZXYsKEvBo+/ZMHnBK7e5PPW/E34GSQDrgWXz+P0gA=="
		],
		"./scripts/emoji.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "RFXyJdMBrFe0rBAKTOwmTVcZzI6V3Pf7HHizK+RQVHguh/pCOTPV0Jj+EB7cvP1/wpuUAyh1SnWVZ01qLg4emg=="
		],
		"./scripts/languages.js" => [
			"Version" => 16,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./scripts/camera_worker.js" => [
			"Version" => 70,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./scripts/cookie_acceptance.js" => [
			"Version" => 9,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "UdiWWkqNvt3q0KH7I+E+eoFOWTt+hULNoXNxnwPaqevGInwqgpnjqJVG1S7lk9jo++XEPiJYK/xSWuwEwpEPRQ=="
		],
		"./scripts/listener.js" => [
			"Version" => 21,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "n9X9WDCumLjb9pic1KPaTnqRmaxecFNn8AbZwCjboXJl4i3Fw03YeG0rDoyM5j+0K2Mme3H105EJy7+wj+pMow=="
		],
		"./scripts/interaction.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "F6p/fp7lLTwzwxZI9R6YeP20ELp015vptQxEU6Y/4ryBpoYKuTJc6byBoeld6myKUkA+XzdC2ZMc92eiLVUUHg=="
		],
		"./scripts/glMatrix-3.4.1.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "7oogIEuYjEdB9P08VXSyYmGIk6ltV1xlhXey/p/kjYaduDRLCFaLLK5AJi2pQy08vBR1Vs0Irn0FTCTEb9VqAA=="
		],
		"./scripts/jQuery-3.6.4.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "6DC1eE3AWg1bgitkoaRM1lhY98PxbMIbhgYCGV107aZlyzzvaWCW1nJW2vDuYQm06hXrW0As6OGKcIaAVWnHJw=="
		],
		"./scripts/js-sha3-0.8.0.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "QkO9sBiE1vi+hFY7yO9Zo4rIrgUHBydF77a3SfX5Rj+VqoA+XYrv/77n17Pki3IXnQHN2ReqxvUykN1sChUQTw=="
		],
		"./scripts/js-sha256-0.10.0.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "FnKPFq1vQB0qyjsydpCBwfrPXAx8sC/ppUc/Xm3leT6rf4ei4tBiKOMoq76ilK/ZAHOKUmOzMA7GUin6IoN8sA=="
		],
		"./scripts/ChaCha-2.1.0.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "53JqNBE9WxJ27yw3uyHCWE0kQ9DIxa9BMuY+JoTxImkqaxPD24y+FN3KNqL7johYZm/G5UQalzUJ/AvI7RBx2w=="
		],
		"./scripts/json_rpc.js" => [
			"Version" => 16,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "n/aCB9fqFv7lGcxhOGiowafXf2dy683JipYk5I+qFMZPdJbTsYxXUypLc1P/ELVSQHpvMX87dMy1C95AHBMsEQ=="
		],
		"./scripts/tor.js" => [
			"Version" => 10,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "ewMz7P/K/A/ej2daA/n6QeEr9h5A1aECP8eDr5B3L77R94uLQH4z07/W2WTsCZc1d7fRRk2oiGK50QNdSXrGpw=="
		],
		"./scripts/mqs.js" => [
			"Version" => 18,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "QT8pp0Gth3Be2c7uJElPTbxP0wv3o8ilgLkeO1tCoDfSh9ke5mPxRKkCDtP+OKJoZNgU8qb/iEqYaSrTOiJr6A=="
		],
		"./scripts/slatepack.js" => [
			"Version" => 19,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "aXh+5wy+nrqJmC2Z6UCp8owWg2C7zrxOFveLY3QCIkdpv9zOFnizZswJTSYhfp78SpK7EGNCfMoTT+CZe/tc6Q=="
		],
		"./scripts/JSONBigNumber-1.1.1.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "yP+DgrnNWvBd6Wa/XTcmMkf+i+Ir0VyrxZ7rCrglwgL5j7shquvOGZ3fReEv09H+pZKMV3lvR5shnBncIo5VTQ=="
		],
		"./scripts/BLAKE2b-0.0.2.wasm" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "4xU8Pp8t8FTYzuH07/RgDxdDSc708DTufixQvCArycHCqV5/GMmMTVn6x0METVE7zRqFnrLQGQAq7LOjjd5nNQ=="
		],
		"./scripts/BLAKE2b-0.0.2.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "ZZpUPwazc+TKFvKShKqQYu9mda0g87afxz3v56jbRdw0sLZfr6V1UTKDlKpFtTpFPfB8MI6c4Slsrnu16ijsgg=="
		],
		"./scripts/seed.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "z+60/pufhivW2lYUUNwAfvcx9HU5fRQG0uStMaosvaLDqHOmWTovgtKb5tu3k/q42goXcyT/aj2OwHJWV82lJQ=="
		],
		"./scripts/secp256k1-zkp-0.0.29.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "099Zm36brdat2ZQVcbaBNxMD//jr4U5Sat5knVzPcMaC55asKBuZZ3ZL/RwaeUjeUKhKeFaBzhpFf04tyuv9Sg=="
		],
		"./scripts/SMAZ-0.0.31.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "fO9ivOe5e/uRXI7Jej9akItWxQGq1JWKdDMmb4PRU47AiekyagJwfjxjp6x5FxTYAbpaEvbgx5i4KgYqw2k+pQ=="
		],
		"./scripts/Ed25519-0.0.22.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "8z69nUefE0sJLexuhFr8X1Ljz/1vajNzWa+lYpX4438g+AJyUtZT/MGRpLWNnCzMt1iMM8Zi8MVmG3dydMWG1g=="
		],
		"./scripts/X25519-0.0.23.js" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "Ba4AMi1Gkx7QB5Xa8OiafsoSjdA5zxaqG3WfyB1I4p9RumPDxl0ZAR21mVN5fPRxsnImSbkIiuU+Lwif40LvqQ=="
		],
		"./scripts/tor_proxy.js" => [
			"Version" => 8,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "DKc9auFvln7lPN+3dXDaSpu/GASjOUb5TsUF/taDYvNDH9yftvtrRwtfISh5F3BOFqa3TIV8RqCljj5aF9ZORQ=="
		],
		"./scripts/node.js" => [
			"Version" => 32,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "9cTe85/BnPewM6wINvwKGxieNFZ/X8FU8NKS9fLZpAymO3trEoRt2AflHDnDxYGanyMmA3FD4dOYctY2NvIyWg=="
		],
		"./scripts/message.js" => [
			"Version" => 28,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "fUT2aWct3axErt/wI8N/bxKNkP3YMH9FkEYnKH4PRHhMKd90XDW8MIytywk4/OK2GMDexmxZoTv5irrRxmusjg=="
		],
		"./scripts/common.js" => [
			"Version" => 101,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "Ci03nuBe0rpS/HKhQc9UnnP14r69uGawWkUHBD21+SNqKNwHe8WPTJDiHkSPc+PHMo76I8/SJJfjyLnfAl5Trw=="
		],
		"./scripts/bit_reader.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "sZRRsnad/mXhGEl07hGYP/Ov+rf0+sbLcI1SSh8Na1b9E5m4edQYgpqr9W4PF0YfQdN+HqQZFPFQkQMyfAcpLw=="
		],
		"./scripts/bit_writer.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "HPq8AJb3mxHLLkhUQpLCNbHRt/Xk7JwByYUQD8KCFBmI0UjSBAwvJOtEvPlivCg5AiRo7IKMwxUzUMQ+AQIwgw=="
		],
		"./scripts/hi-base32-0.5.1.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "UADzbakt2KOLTZdSucmyNYI+VCgyiX/DfYIQDSU0GWrQJUfpLjBc9wUITrGx2oqdb+rvDuVXI0kzXowYoPXFPQ=="
		],
		"./scripts/bech32-2.0.0.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "5zxFg82/Io72GE57rxH7nD3dewDWi8IDwV5RhtbNLzIyoBuZc/33MsG/ygYZwTnkRFUPHPYwcZkjBDzzYKPvvw=="
		],
		"./scripts/base58.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "1qSnBxDGofAzuph+6Z6WjRJ5TxiQAsURE9vtylnLOsB1OJYTUSYbffI8GQXLQ6n0LPusp2HxTN8i+4BKc31iIg=="
		],
		"./scripts/fatal_error.js" => [
			"Version" => 18,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "aWPcZ8cSOyW0hKu7hOVlQrx4fwuZt5E6vftLCyOboHC1HTPUoizRoRtdLeGipTXLZ4dpGo6HmjanE4SFHPDDIQ=="
		],
		"./scripts/scroll.js" => [
			"Version" => 7,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "3vXtreIWfA4ZmF19S6v8GgBTBQKNIyWusog09bGqpbxT17E6Fj/uKUW8NW9jVS3tysjqu6D5c2M6UFmDA60Wtw=="
		],
		"./scripts/startup_images_creator.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "QNtKNG9TS2TfRgBAjPlLqCDIXv/UIcqDCTMi6tNwd3C7yxlKBkiErW/wtLpufToe46dfyTjUwbsBxkHAQilPBA=="
		],
		"./scripts/extension.js" => [
			"Version" => 7,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "W4VU2BdG0lMevLGhEK8sx7aXj3EHoQIqfRQBjQ/MuannygiCmjsaWjoH84qSGSZdrB8rMmzkxte4vyrIKqRt2w=="
		],
		"./scripts/version.js" => [
			"Version" => 13,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "1drVCyRwFERSpHGYqKn/IMCeMUFYz/YmgbCecM8XazxOaRWEn4wSUXNF4LJOEBELoUyGr1aD4RHCkb1A90M/IQ=="
		],
		"./scripts/secp256k1-zkp-0.0.29.wasm" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "cy6D8ymfNYx2nClB7IewZw/TkVQmLQW9Y2ioL0eQTyLVRGC4xUjH5nc/le1uTXq8fQhwqkcwnpN9vlFcZLWIow=="
		],
		"./scripts/SMAZ-0.0.31.wasm" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "tewJpZEMVKaHoTmFRoCc/J4P5pv1FWE4uv4iN7Wf1x5Bbz0llWlQ1anZsmfXJWH3mqKiZH9ChuvbKAC/PReZ+g=="
		],
		"./scripts/Ed25519-0.0.22.wasm" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "unWNdFJP8XDQLIzNHRaCNzt1XP9u9zQMLwFkxL0BLkb6jd16angfAlGK2zLyv5DukC74edDQ+OSZa+HJl+iS9g=="
		],
		"./scripts/X25519-0.0.23.wasm" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "aD21EXxdkP4IWbct7HkP1+KNqzcQM/vfm3kRRH3jzhpCOJ+uAS/WNAe8R83stTD1wQTYhVJhQcRLjh5UdeTsVw=="
		],
		"./scripts/height.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "KsE/PDYuBECaR9jgFKQkGx2F7Qoj6GKVFusYUHQGPDFhoumYsflByyo0omTAq88hHlizrRjqn51OFUEeh8TY4w=="
		],
		"./scripts/sections.js" => [
			"Version" => 7,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "VlwB5jd55CO2XVi+VBrYcXrEt65zFDs7IHn/pcrHebub8T79Rq9UE7FUnExUT5IAIeQSJJL/dctx3LRtQ/qjpA=="
		],
		"./scripts/section.js" => [
			"Version" => 15,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "FuRkoTy9wjnIhWFbbhyA5ZX65tehALL+qyvu4vX2Djub7PKBpU2DB+SM6ZqTlOpJK6SEZD/GD9IhQnDurylU8w=="
		],
		"./scripts/settings_section.js" => [
			"Version" => 25,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "tbo37DKhDLWgAFFmdHYd7m4aqyqHIQev/OEROMgr0+2IK+Wp9ldX+dzkDsxJWV0zsF8F9aDCf9AAaOkXWkF4eg=="
		],
		"./scripts/about_section.js" => [
			"Version" => 20,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "liNasQI9AlFyJZvge45UmsJ8mzflhC3CIOkRQAEqlO/JTscDe3edhvzHGZPrznwpqfCk9+pcWQSFXN8BLruXzw=="
		],
		"./scripts/transaction_section.js" => [
			"Version" => 38,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "UDay3ItgLltbFNgSTX5T5LHkJ9fGq37t40XKjjBghcYBPG+IEuKzVfEZuqC0TXympEEvRmxfjQ9pRvqoK5W1tw=="
		],
		"./scripts/account_section.js" => [
			"Version" => 14,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "NYI6dt8F95YbVXNa9QMby6C4L1ME8Ta+80FEZg5X4YQEn9N69du4R8yuCKDa+WWXFuxjcjokJHAYuW6hTnRguA=="
		],
		"./scripts/wallet_section.js" => [
			"Version" => 95,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "jRN7pGzbJeD8lvmQ5ALAowBt9QUrQfXY4e0GNR+cS0evYDOsOOiNttLvZhsPZTnhzzGRpkpJ4JhSHla3uQh7lQ=="
		],
		"./scripts/send_payment_section.js" => [
			"Version" => 106,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "6M0CZzIKGZEVngGgTyYxn+4FKCWpZwTKNvwhh3e18xlh1uTzBiVgszeL8U3KejwmMXIW+hSofztUH80cE87mjQ=="
		],
		"./scripts/log_section.js" => [
			"Version" => 7,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "5OYi7Oy3IWIdHayxkF6PhVTlRkEkMAV2J15sZEEAgKjIMC7+379SuoTTChEq4Ec+s0B0NgsrpyMYTUfQkMjW2g=="
		],
		"./scripts/initial_heights_obtained.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "RGtr0f7BvR7DyZRonM03t6BbKKNW9mjS4gmtF33pslBTR+cQL6WvbY0Q6t6/Mu/bsV6B+ywY5uEUU7jpP9n5pQ=="
		],
		"./scripts/recent_heights.js" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "T5uHBo/NYcxx0o9wdsFoyFqmNa7evSYVkAOoSCXr6d+4BZ/N3CeXGxsMRCsrODROagZnW0gBQj87suvwKEBUMQ=="
		],
		"./scripts/maintenance_notification.js" => [
			"Version" => 11,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "HX4BGD6ZkumCAIOraOfAoJUCnA7ne6vYJbMBnnaFtfbYQqnMUXMPfF1fXmpbfEc/NYI3hAX9q5NttgVidHp0OA=="
		],
		"./scripts/install_app.js" => [
			"Version" => 14,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "tL8JRuLipT2XAjuSFouO83j4CGsTPvdWE8Co6cKcuhskCdPKA3XquDvo3DgpU4cRhbjc4DrDwTZq27YChQ5IIA=="
		],
		"./scripts/unlocked.js" => [
			"Version" => 92,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "82dzsYR3p2pahc9CDklC2bFTmPDINx/GDiQKiIelG1YFE2f2kSOi1Ga7gPTIk29oWImtHQAYcIRkPNIZE2KOAw=="
		],
		"./scripts/uuid.js" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "FARFAds6eOs+YYMI35eRSx83h0XSayo3N2CSjbQ347zVBf8WHtnn6qU7J6OlqRQEH+1ioZoLY3xWPXZCh2qN6g=="
		],
		"./scripts/hash.js" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "OA4SbseOEmVcPnIky32I8ZUCfD16z7CnRpym1AVwXWvHwF/EG2E8E4LnsM32YpMCiTM2due3JCbxDtJITdFcwg=="
		],
		"./scripts/slate.js" => [
			"Version" => 102,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "EAy5J2zli5ohSClmJs2Vn1riGqcf4jyHUKmmZF4WMY+11pVeVxUoqwqLVU1JWGR7ThmTm/MO146suKxyxyWPqQ=="
		],
		"./scripts/slate_participant.js" => [
			"Version" => 11,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "wKmD1YCevS3Z8PuUqXGdFdOaaLepN0cwNp4pVEiHPOsMxlpuyYKaz+LpZoLIwwj3x9zMQ1n4LylhE7ZCpy+Spg=="
		],
		"./scripts/slate_input.js" => [
			"Version" => 10,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "rf/rEuF1UyqCuTaJ/HsA81AttbgyWZdaJOloAFLIIhqSfRQg1ehLzjsfz1LC3kOZeYfv9UZzvOGeme0EA9jaRQ=="
		],
		"./scripts/slate_output.js" => [
			"Version" => 9,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "X59+k52UjlbX4xjY1iHKXvLws7Ph9E3HRmRwYZR9oi8gUPgnkdIROnTRheBGLP/fHQ7D5EBCzDBjYPJ8XEPIAw=="
		],
		"./scripts/slate_kernel.js" => [
			"Version" => 9,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "qIFIYEDgExFhyokDEsP+XjflpB83Gx78R+9UT1MHI4MZ/vw/eqaHAEzf5kgdr8zjnpaONrc2Fso0TgjGRDuQPA=="
		],
		"./errors/500.html" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./errors/401.html" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./errors/403.html" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./errors/504.html" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./errors/503.html" => [
			"Version" => 0,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./errors/error.html" => [
			"Version" => 0,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./errors/502.html" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./errors/404.html" => [
			"Version" => 0,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./browserconfig.xml" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./images/circle.svg" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "wyTgo5fmZYwVSdR9kPllluUfvPzUg/Zd7uRvNVPjaqJr7pDI1vNWHFBtfOqmsuBcNV9awXZpePut9gHVKMjCVA=="
		],
		"./images/down_arrow.svg" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "3b1PtmLda1UA6xh5WWstp67TGoV/ITmtQ8pcot0uocmGSHUvL46ABelYATKbLthfecI2snR5Ar3PgQqpfN5NDQ=="
		],
		"./images/usb.svg" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "fMph2Fc1GDBQ4oFcnEo4CH3DElezAPdDquywENXnu3iUTZyn8kHaMsgGFoF1HMwFo6/zlM7CGl0mmgqI5WbyuA=="
		],
		"./images/bluetooth.svg" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "esQ21VaSlM4oh9CkdibD5uTfG5fNzduVxx6tOiGQaEAT0rWoBphqIvxuc3YJmKzyK0K188lszHrhuJtBG1bgBA=="
		],
		"./images/whale.svg" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "gCcaLJJatAtW+DX14/LMR0/bJQ2+Tn4w007UlVD/n6UVq6hQ+aBhFBODeFuPE63y3ebHIA2OXmvU369Jl0+75A=="
		],
		"./images/ledger.svg" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "V7elNFHZZC5VVZcrj3xm6PztYGhhNyz5EDhvQIDaZHqW49D5/XRp16uPOOcmGcAEcRSpU3I59qzkjCexiM4giQ=="
		],
		"./images/trezor.svg" => [
			"Version" => 2,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "keEwhm7p0JcKUS+qpyTwCBWreAa4eXUf9x6alWBVx2hMe8B4GN5kEXwc8/zkoL8EGrmS1Wl73myh26hYgUoI1A=="
		],
		"./images/countries/america.svg" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "6YsD9TAM6RKbXUBtqaqWUX9yme3VmqUpDgyXLX6GHvvOwhHja4CDBUJeTc9WQNYIMoImr5IGl6CajrDg52ylaQ=="
		],
		"./images/countries/china.svg" => [
			"Version" => 2,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "cW+hGTINEt40IUJmxVL33jY1NVh32p8tTB4UYaiZSx/NiIhnIy0ox+a1ioNWSUS43X+mTqHu9BaOeSxkZaB2zQ=="
		],
		"./images/countries/greece.svg" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "G77foDMhtN8Gh7XXBg/D5EJ9DwiWT//UvPqq9pfJcrj13u92Luwi2cYssnqqVwe4gRkRyoMOv8TX8iQniKN+aQ=="
		],
		"./images/countries/germany.svg" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "TKf6oGmstm1C2dJhgQYarPXKunanjax9M92Wk+FVTGc9ty7lB3UCLpBV2gqJmKk22COauKqa83vQg6+1lQ7FnQ=="
		],
		"./images/countries/netherlands.svg" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "9Mlm0FJ9BE+0uNazl1mggjzqHviixc5LO0lKPbwKQcOaY7+tGvL2OCyPPQ6+XSWrrOq4dc8FUPCMF0BoJUikXw=="
		],
		"./images/countries/czech_republic.svg" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "rLBl0FvuqHetz0DTr1ZnACgRfTjyWXFI7SG44HnSTgBi6Xem9P6ys84bf5rfq2xC6R/Fpo/6EzEAAGk6omJ8nQ=="
		],
		"./images/app_icons/app_icon-152x152.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "qZ5wSv7nlGZ/34dRFY70uButTCB3IFWvI9TNEPVb/I7fBiizjLfd14liKjlOaGIhLlkhcrXf1ZJ9jiPYDq4JGA=="
		],
		"./images/app_icons/app_icon-64x64.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "Gm8PRw90oQAoT7ziuw9aTpq5NXkAU9IRrHGsmwDnBuF6fU8SvZbVrtHVqZdKFBoOiiiTZPPJ57hY5IWa3I1qvg=="
		],
		"./images/tile_images/tile_image-70x70.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "uj+AdzNHPcPrmPwG4r06U4rwIlSuL0hmwG0p3TJ/2IybdI/uDUbNV12QUY+0+D9JFZX04jm9OH1VmRK1bwu72A=="
		],
		"./images/tile_images/tile_image-150x150.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "gD4yr31lazkNynmrykbL74WdKF1dSBUU3Zpcpa3joirzrLsSjG4EFveMb6CRy9iQi0QlHCoNGLx5jyid7D1bYA=="
		],
		"./images/tile_images/tile_image-310x310.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "c/rHxGePwbGtTB4jCqfpiWHhxeBxhJ3o15p2hJz4IisjjhyPwdpe40EWpmbY+qAoCCsYX5lFkcSfpiSj5RMQ/g=="
		],
		"./images/app_icons/app_icon-114x114.png" => [
			"Version" => 5,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "U+JR1ScLTBa55D4kSeItOYDBPD0iVCrEmlWNAfl4n/yEsp7lEQtRpMOaPNtUcKGL54nKduAkjN1dh4lv/j0ERQ=="
		],
		"./images/touch_icons/touch_icon-180x180.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "orB/G4EAseFJ+xDivo5SgtAaEg3TCiSRjjjqZ3IEBwqFObggpvmBNjlIfPK2VYHdcsU//xrE4XUvrsFsqlzypA=="
		],
		"./images/touch_icons/touch_icon-144x144.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "T/jsBMu4qPCAkCZSFalH2q51ckHyeHnAAh2a6WOe7I9ueagN8IA4J3hnxAZTUJILm3Jjkzp3Ixz3v57nOhGcCg=="
		],
		"./images/logo_small.svg" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "i7+n9MbIQCXdfta6ITG9x+NfvaXw1HtWgOFpZD5abJPC9/kwQzjgDPSdwNUegywCyfvZBbPqkkENuwRE0svQ+Q=="
		],
		"./images/touch_icons/touch_icon-57x57.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "7KiOW6LBbVa665HD5GqGvvCdcSx8x8NSFYqn/kScISnDLWq/p69Ub21sFiTFdYERwkLzg1jfku4ny3uiem1smQ=="
		],
		"./images/tile_images/tile_image-310x150.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "ymJVYV0wF6wdYqsDw2CgWDBrzBp87YY4cI9yKljJyd7hVGOfvpwIjMdGlI5mnHJpkr8yP3fSERmw6ckq1roXog=="
		],
		"./images/touch_icons/touch_icon-167x167.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "Ilbe8853D9Y0cVIt3Y3RTgxFA0/fFhEPseRxmja2ktun17r7qNlF+l7LTFogruqWOrek2rOhBcdwS3ev0RmGLQ=="
		],
		"./images/touch_icons/touch_icon-120x120.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "CEvrLz28mgcUdKxuzeeLL2FxVH/GryBSGhMkOEskjOMeQb0hTXbFjnzv37PybGitREzatLUH6EhwCySqENlRnA=="
		],
		"./images/app_icons/app_icon-384x384.png" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "brCLTAz5RA5lmdp8yeEadk1tVFZFvIEeeQoCeNZbOG4IgQLvQYm7GPov+FNiCElyflNPPRCRK24uGut1sEQoDg=="
		],
		"./images/app_icons/app_icon-512x512.png" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "m5Yogh0xABSeFHkZBQGFUPfgSVYH7W7O3bhpN5YHpJyRAaOKRg+QXEMuZU3dpBWj/sikKNsGG6iZjBbfxLYWKA=="
		],
		"./images/app_icons/app_icon.svg" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "xMR6vmv2Kvv952moj7vWjAeajvSKmmkbDblSDEgzK0co3R4JbTI+53uLybJAteIQNiWGCcRopw+x2DF4d2EwDA=="
		],
		"./images/app_icons/app_icon-256x256.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "ao8ydhrkQSRm/Wn2xo9S0mWwMNRMr1kn2BIskWGAnlJzbMfrk6eZVv/Dsx1OvoGtYeJYSvI9ICTgfkldFPd98g=="
		],
		"./images/app_icons/app_icon-192x192-mobile.png" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "/QOYqpPj4saqmVLKm5g/Ise7oRCiZwJ4SBszh8Uii8FXbH+NOSFBrLHzShWemuDcv8UACIdirudMEA+NRwVTBQ=="
		],
		"./images/app_icons/app_icon-256x256-mobile.png" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "7s+vHVZDiclgTx11ZFM1IcJ2bflVTCNbJ5uXOy1i1WB6YmyJiju8j2Zrygp5WOadyHEkPRkhdaaH4kcbSG0BPA=="
		],
		"./images/app_icons/app_icon-32x32.png" => [
			"Version" => 5,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "8/eMVhg6nGzmzd+fkZ7mlyQaLLy6VvmkXnJyzBPDz87/RX+e7oXcZbqYER5ShFh3mgxTF1hNMsgbqtWa19x2RA=="
		],
		"./images/mask_images/mask_image.svg" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "jX46GRxl03e1+FF+xvNiXa2roRnLfQjCZsmjFfFqWXhVpDA8qfdPVlOPysXMX2SXSzGISkH77MM1hbm2/E/qoQ=="
		],
		"./images/logo_big.svg" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "cwWAMRY3P0swCMogiglMzxJaEx1mqJNsc7l7OtP0DleoM9WLggNLidZ681tbhBc1hJL844a+7lKd0k9JyMKhvw=="
		],
		"./images/app_icons/app_icon-120x120.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "f4vKlplWm1ehQT2zQpsc+rTAxsWDXy0izZo4/JJ8akRaUffsHs7AghCw0jaP7MWRWszMB+q7Y+8EoCCsatyacQ=="
		],
		"./images/app_icons/app_icon-180x180.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "pFf0SFovITFfFqweiKhhdX2PIFhYu9QehYFgMbrnGxLMjOlTg0bsr1jvvOKe2LNv8O8HtEn14X89BiZISwpwWA=="
		],
		"./images/touch_icons/touch_icon-152x152.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "NgxJ8T19FxWYQfH9YDLWJHxDdYj4KMFqUtkbNvoZpa5W6RC970KyPYtW3SD0WVSYE8WYYtH1jKHAOWyNY2rh/w=="
		],
		"./images/touch_icons/touch_icon-114x114.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "a/oINidjWR5POHUQv0kQvpxVgTY9OCJBBGi6GVIohJ1iYnDnteZ5311kEHHytkAWEUK63sehCyYm47WTuf+11w=="
		],
		"./images/app_icons/app_icon-192x192.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "mnKFx4RG0ZtdtIYJc/dKM5/sOmUGKHzRFIF110w5Mz5pVnJqMbBgeII2i5enx/g7tO3jutnQoeg8DjvK7YuMog=="
		],
		"./images/app_icons/app_icon-48x48.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "XQMVcSfxOWy7a7qIs9TK41H5NboS2vHuVgLahNTeFHA1Q8Q+XKViHr2vX07Xtj837sCGzDics0BW+jiqyVYkYA=="
		],
		"./images/app_icons/app_icon-16x16.png" => [
			"Version" => 8,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "Nww9cqb81YoNraFe6JdSInU5BlkkyqbtdaD9XtSpFZh5fnmLEGojQj2uMhvjVpV4v0JqQ+shvYtKflvXT6DsZA=="
		],
		"./images/app_icons/app_icon-24x24.png" => [
			"Version" => 5,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "pJ4if6I3Ps8ItDYtTkruAAvaPUErNiwpKwH9JID9QVUjKrTWzM2eAS7WbDN1rdK3u0+CGGp+qdDsISvrRZ5hGg=="
		],
		"./images/touch_icons/touch_icon-76x76.png" => [
			"Version" => 6,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "pPKWb8sFr+8zAPTNla5MC/qj2RaO5thoI37cIenbViYTPtaHx1axkgldQnukDF7+gs0g6NbXmflpB/BvsKFvMQ=="
		],
		"./images/app_icons/app_icon-144x144.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "ERloWcoV1xJ7Z191mG1Mh58qsWr/59gPxD0j7lsWllTDi7M10aD/+MUoMS2hmqPUBJDNJYAra951bo7VFLaaAQ=="
		],
		"./images/app_icons/app_icon-128x128.png" => [
			"Version" => 4,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "caTLD2jtqhTWumHiyKvGJUXxpi7cb75/wsd+c5dyNkbPf6ba3cqlz2wnN1OQASc9sOq3NWcIyZsh7A4g3is4Gw=="
		],
		"./site.webmanifest" => [
			"Version" => 0,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./styles/cookie_acceptance.css" => [
			"Version" => 16,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "1iKjwj2jOLDQ8DBxGYhVzQ18C9omSRmAOb+rulDTYu39iI+RAT80JfAwGzKe+Sd/qdojtOAaxqxUhB/LfZEkxA=="
		],
		"./styles/language.css" => [
			"Version" => 9,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "GPY+XpKAx4Y4f88HZnxVt3ugNXm5oGzPK9u2sgGhwcdTFTQes2pXto8Ydjvnb3r6AnAjJxYKzZUoTB+rEg0UFg=="
		],
		"./styles/normalize.css-8.0.1.css" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg=="
		],
		"./styles/common.css" => [
			"Version" => 9,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "tOhHVb/LcJeCK0whL1JGdLGcBmMd58cq40BHkJQYk6I75O72DzZOpPB7/wZMbsee0tSPo86DxSLI4/IiOVJKLA=="
		],
		"./styles/unlocked.css" => [
			"Version" => 20,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./styles/sections.css" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "XD9ZdiMk+TvjGzPL9bShDP8BHp1n5SyqVAtRs3AreF6Nq+KXPASTM+yEASG0wbibhpJvqb4YEWyQadd4gM7D6Q=="
		],
		"./styles/section.css" => [
			"Version" => 11,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => NULL
		],
		"./styles/settings_section.css" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "xrlfUeqc9EIcXeWCUYozrJSCCpJbGSO+2XJgzH+RErsFp+7VfJFVPb9FriaQ4F3SXDp/7qkA1oxwgAdUEluVCg=="
		],
		"./styles/about_section.css" => [
			"Version" => 48,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "dvA+g9SQuOEXZ1+7F5IrhdFiSH3S7BXH3pC/s9gtfiC3WArvxjo0paJbPcIwdYjK47HVi3HGtN6Scxr8/SCAnw=="
		],
		"./styles/transaction_section.css" => [
			"Version" => 12,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "CQu4kK60uQl2b13ufaFGAn0SE+d1jgulF6jVTrcJWgqRUwJBiAtFfbPszflVpmna4TNcuvserMUVX4d0pCoV5g=="
		],
		"./styles/account_section.css" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "+iLOox399ALnS2ocTTcoR8TeLA911Bq1xoTAcINCUU40rxukwsiTQUbPLWxukc4VqPRhUlbTiTLie5fVPL64+Q=="
		],
		"./styles/wallet_section.css" => [
			"Version" => 25,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "BqtTeRBzz5OQVKD09LmOKeBhpXy9ddeoe3xyvguYYHrWzGPZiZXIxJtbX9r+vuWw7NM9IRJ5PnshbSpvmEqthA=="
		],
		"./styles/send_payment_section.css" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "cLTRO/Np02fFkoWyUAthMQl+YfCpvddAlNPL9UkbGYnvd0XkgDeBtBYSTIz+6MyE6Q9oacC+BUChZs0pUa4u0w=="
		],
		"./styles/log_section.css" => [
			"Version" => 6,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "TfYlbeTkuPz7GEzxlt0TnKkDuQBSxiypStGdp66j9EX+cU4yUAYSCsymF5QFymex3/D+Oh2thrv/ZxP73UHjkg=="
		],
		"./styles/maintenance_notification.css" => [
			"Version" => 13,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "vv14gQxsFGZPqjytDa5qqNcSPaumivuxIPUusIzLDmFd5KWpHfKYG5Zn0NZCEICYNGYtYTlzMRkmnZQtQ4fMsw=="
		],
		"./styles/install_app.css" => [
			"Version" => 11,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "FZSSSrCiHPbDC3QYv/7H/o4lGhZtX3P2CAx+2fdo5I6RRZ25o0iVcWixpAF31SR7AeyisQ5TALUanUftlhLzNQ=="
		],
		"./styles/application.css" => [
			"Version" => 16,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "VvrR6ya9WDBdsAObUtWoKmfydp7/TnmV6KaH4/uAmrcT34mgNBwzPky+uOTTUr5ub4X9SgaYPno7R9xXVlq9HQ=="
		],
		"./styles/message.css" => [
			"Version" => 30,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "iIM9l24e0L5gNTVxTRdpUpTqwvP9Zu7KPbpwSmGAN/NqTE6RVrWqP+UD4aL/gjUpfGa0jhCFKOuNJu+1VlB1LQ=="
		],
		"./styles/tetris.css" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "fV8QPcheziketlQHDWmDsP2g7qN4CGmm+UyokQmE8FrKqjCkpgk68Ed7XHBp/OY3RwPoWaAdIGi8yjE+Qmnu3A=="
		],
		"./styles/logo.css" => [
			"Version" => 8,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "he11vx/asU+kvHkYSNNVP3Ydb1qa7CE5hTB/o8gF33cJK0oT6pQfRnCWZbSr+hyDBwpsosfiSw8drEpypaBbLA=="
		],
		"./shaders/logo.frag" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "uUjiE+dVO09wWQuctlP2VBwMfbfmAW/xuvqL0VAKfMrYMoyuEGTVUBLy0Hc8rWyND3paJLtFS4EjFtSk+AvBDw=="
		],
		"./shaders/logo.vert" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "vSZoTodVV1zVsJ5XQHkdHfg0GYR5TX58MM/nSXMJ7p9TwaBjr/sNOcY6TISoa6Y1RBTWVczZM0jWs5nsO1u6IA=="
		],
		"./models/mwc.json" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "lN13VlgTjnoJSA7/ribpU/cYIkv/I+Kae2eEbzpSk/zQ4J4IxoNlQ9cpcQYrIJRrLFe9QIprXNZgwsFlWdJqNg=="
		],
		"./scripts/BLAKE2b license.txt" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "qqcTSJHo3upbPBJR1exc31V0W9MoKKpCuSciuQ8Wr+hYVF+NmdYYCqdABSb2S84Xr8I1WkHeDMOzI5Fbtd5vHw=="
		],
		"./scripts/base64.js license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "cY8GK2XA/Ti4mQ9Ds6YxaRdC8876FIZ+hlwu3u9gAA176EFezcvcDSdh+OOibVmoADinP+4kVS4a4TX0NHy8gg=="
		],
		"./scripts/crc32 license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "+ZcrmzsP3IHjWOBoSb0idDvDXvHkWVzqR98/EZdANUoeDg8bJOmM1aS7KhdEWdGO/ejk5jSwbl0bT8lqaLTBIg=="
		],
		"./scripts/bignumber.js license.txt" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "0TceHGsWk3ibsrAv8lI3NGV904M5XxzjfVFV0nyMGRxXgYBn2056ANUOkznCUXXzdAOirlm6m0c6M6kC1gDXYQ=="
		],
		"./scripts/bech32 license.txt" => [
			"Version" => 1,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "AakMfPm2wq07yVmqIBnTO6Bj9zKALq7T+wRvLUPsBn1JZctun/MACmC0OxyLruV+GUX45DUxvBXG1Rcm6bd1XQ=="
		],
		"./scripts/ChaCha license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "1C7ZACZXUPp8Zy+0C43TlyPbOWrskOluiBLoI8yaoSKS/zV3I632A6T9NXyXbQdby220iysum6I/vr/FLgUwPA=="
		],
		"./images/countries/Country Flags license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "ZrTab6FbCrWIxUi3vCup9rtWi5Mq2eKxFBxuT/a8IKbEzLLvoG1FD0TajprEcClniJQLRcfbSY9AWMqZXFzdIA=="
		],
		"./fonts/font_awesome/Font Awesome license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "nXcGEO5ZIMn3PLQtikE8+zxxBMnZNgNSDslF7MK5U5C+9vrYWSbJfId7yYDjIIMqGNloclGUPBQw6Yqi71sEcw=="
		],
		"./scripts/glMatrix license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "HKES2T36EnbF88OT/UyWxQ8KDSnS3x8xvetmr38epBEBYG6aLoHxWUMFtFfwDUgf8mGa/cdSMe+4CaEAatXYrw=="
		],
		"./scripts/hi-base32 license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "I93NWqGcrmBBppLx2N0ASJnB94ZCklj5OrZGqa7QzfzGCS1mEegXR+7Lnoohl9vb9uJatRAmmfAmbyjg36K0QA=="
		],
		"./scripts/JSONBigNumber license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "VskaH5EuExNsaMwR4iexZhz0cGGtI6Oj7fVngEAQ9IBMI3aJtkrl4fJE/joj0pgYYKPPJx+hi2loA+Xv9VL3cQ=="
		],
		"./scripts/jQuery license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "I//WQZK/IcsrwOx5Z5e2wHu5wBE6DS0Z9u8OX1Tp4AQuMICytxU4jfKhjFRTO7gyyS6bmB1zp+vC8PsvIR49GA=="
		],
		"./scripts/jsQR license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "MGmvPgoZ1MR+vP43MnsFnRhitgp4CjS5vNLEKzBO++bT7TIcvR/73qvINTfwy4tK3u6qomK7dFdwpcpnFRnFLQ=="
		],
		"./scripts/js-sha3 license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "xqluHqX7LN2vwHKVgNfFApwQ/D5GAfEM2rWtuLszEhYk+g2Nmk5Ket/YS4VwEwf+O5ZMnFkXW3jTAFVQt0fyAQ=="
		],
		"./scripts/js-sha256 license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "+URz+C7K7G1agtqu6vjZUWLiNMxk6ZmrRNcxHs7pb1sbD5yMPsPp8VEiSBWUqkKPMcm/XiKsXL32ue6by7dDdg=="
		],
		"./scripts/secp256k1-zkp license.txt" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "qElcmcO63QPcv3OrJp1b98l+Ut/sPnm6deMY93mqyUOedv9oLvA5EG4JNEWZ/Yxfzvb68jfk69CiNlo4QVreSQ=="
		],
		"./scripts/SMAZ license.txt" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "qElcmcO63QPcv3OrJp1b98l+Ut/sPnm6deMY93mqyUOedv9oLvA5EG4JNEWZ/Yxfzvb68jfk69CiNlo4QVreSQ=="
		],
		"./fonts/btc/BTC license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "U88z3axdRLn2IqBB8me89TynBFVfBIHuPonuulBQGcjR1QSm/+fr1qfR1dfSbPPaBSzGOzVA60JgznSpPPNYQQ=="
		],
		"./fonts/eth/ETH license.txt" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "U88z3axdRLn2IqBB8me89TynBFVfBIHuPonuulBQGcjR1QSm/+fr1qfR1dfSbPPaBSzGOzVA60JgznSpPPNYQQ=="
		],
		"./fonts/grin/GRIN license.txt" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "U88z3axdRLn2IqBB8me89TynBFVfBIHuPonuulBQGcjR1QSm/+fr1qfR1dfSbPPaBSzGOzVA60JgznSpPPNYQQ=="
		],
		"./styles/normalize.css license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "pSezlYXaPnUcXgNY1uTcePkCVL/YagLTAJeajG2n48iVI2DfWfptvDVQDpERSLEOsChtHBE0tvsAnkab/IUDaQ=="
		],
		"./fonts/open_sans/Open Sans license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "TMWhK/6YTApQv3lD4tcKlI1SDvQjZ3x3YpcHqs46lao3jSBd6SkQXWRGgGeecO8kSUebNgrUSJa3W6/tZmEycg=="
		],
		"./scripts/qrcode-generator license.txt" => [
			"Version" => 3,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "tgy0QxH9sSKe59CiCWgPJyln99UoIiuedEgdGp35X76n19dEF/uYOUJ6BxPNa/uZGdnLmgcwn0+oBZcniIXsVA=="
		],
		"./scripts/Ed25519 license.txt" => [
			"Version" => 4,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "qqcTSJHo3upbPBJR1exc31V0W9MoKKpCuSciuQ8Wr+hYVF+NmdYYCqdABSb2S84Xr8I1WkHeDMOzI5Fbtd5vHw=="
		],
		"./scripts/X25519 license.txt" => [
			"Version" => 5,
			"Cache" => TRUE,
			"Minified" => FALSE,
			"Checksum" => "qElcmcO63QPcv3OrJp1b98l+Ut/sPnm6deMY93mqyUOedv9oLvA5EG4JNEWZ/Yxfzvb68jfk69CiNlo4QVreSQ=="
		],
		"./images/down arrow license.txt" => [
			"Version" => 3,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "nXcGEO5ZIMn3PLQtikE8+zxxBMnZNgNSDslF7MK5U5C+9vrYWSbJfId7yYDjIIMqGNloclGUPBQw6Yqi71sEcw=="
		],
		"./images/bluetooth license.txt" => [
			"Version" => 1,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "nXcGEO5ZIMn3PLQtikE8+zxxBMnZNgNSDslF7MK5U5C+9vrYWSbJfId7yYDjIIMqGNloclGUPBQw6Yqi71sEcw=="
		],
		"./images/usb license.txt" => [
			"Version" => 1,
			"Cache" => FALSE,
			"Minified" => FALSE,
			"Checksum" => "nXcGEO5ZIMn3PLQtikE8+zxxBMnZNgNSDslF7MK5U5C+9vrYWSbJfId7yYDjIIMqGNloclGUPBQw6Yqi71sEcw=="
		]
	];
	
	// Attributions
	const ATTRIBUTIONS = [
		"BLAKE2b WASM Wrapper" => [
			"URL" => "https://github.com/NicolasFlamel1/BLAKE2b-WASM-Wrapper",
			"License Path" => "./scripts/BLAKE2b license.txt",
			"License Type" => "MIT License"
		],
		"base64.js" => [
			"URL" => "https://github.com/dankogai/js-base64",
			"License Path" => "./scripts/base64.js license.txt",
			"License Type" => "BSD 3-Clause \"New\" or \"Revised\" License"
		],
		"bech32" => [
			"URL" => "https://github.com/bitcoinjs/bech32",
			"License Path" => "./scripts/bech32 license.txt",
			"License Type" => "MIT License"
		],
		"bignumber.js" => [
			"URL" => "https://github.com/MikeMcl/bignumber.js",
			"License Path" => "./scripts/bignumber.js license.txt",
			"License Type" => "MIT License"
		],
		"ChaCha" => [
			"URL" => "https://github.com/calvinmetcalf/chacha20poly1305",
			"License Path" => "./scripts/ChaCha license.txt",
			"License Type" => "MIT License"
		],
		"Country Flags" => [
			"URL" => "https://www.countryflags.com",
			"License Path" => "./images/countries/Country Flags license.txt",
			"License Type" => "Country Flags Non-Commercial License"
		],
		"crc32" => [
			"URL" => "https://github.com/SheetJS/js-crc32",
			"License Path" => "./scripts/crc32 license.txt",
			"License Type" => "Apache License Version 2.0"
		],
		"Ed25519 WASM Wrapper" => [
			"URL" => "https://github.com/NicolasFlamel1/Ed25519-WASM-Wrapper",
			"License Path" => "./scripts/Ed25519 license.txt",
			"License Type" => "MIT License"
		],
		"Font Awesome" => [
			"URL" => "https://fontawesome.com",
			"License Path" => "./fonts/font_awesome/Font Awesome license.txt",
			"License Type" => "Font Awesome Free License"
		],
		"glMatrix" => [
			"URL" => "https://github.com/toji/gl-matrix",
			"License Path" => "./scripts/glMatrix license.txt",
			"License Type" => "MIT License"
		],
		"hi-base32" => [
			"URL" => "https://github.com/emn178/hi-base32",
			"License Path" => "./scripts/hi-base32 license.txt",
			"License Type" => "MIT License"
		],
		"JSONBigNumber" => [
			"URL" => "https://github.com/wbuss/JSONBigNumber",
			"License Path" => "./scripts/JSONBigNumber license.txt",
			"License Type" => "MIT License"
		],
		"jQuery" => [
			"URL" => "https://github.com/jquery/jquery",
			"License Path" => "./scripts/jQuery license.txt",
			"License Type" => "MIT License"
		],
		"jsQR" => [
			"URL" => "https://github.com/cozmo/jsQR",
			"License Path" => "./scripts/jsQR license.txt",
			"License Type" => "Apache License Version 2.0"
		],
		"js-sha256" => [
			"URL" => "https://github.com/emn178/js-sha256",
			"License Path" => "./scripts/js-sha256 license.txt",
			"License Type" => "MIT License"
		],
		"js-sha3" => [
			"URL" => "https://github.com/emn178/js-sha3",
			"License Path" => "./scripts/js-sha3 license.txt",
			"License Type" => "MIT License"
		],
		"Noto" => [
			"URL" => "https://fonts.google.com/noto",
			"License Path" => "./fonts/btc/BTC license.txt",
			"License Type" => "SIL Open Font License Version 1.1"
		],
		"normalize.css" => [
			"URL" => "https://github.com/necolas/normalize.css",
			"License Path" => "./styles/normalize.css license.txt",
			"License Type" => "MIT License"
		],
		"Open Sans" => [
			"URL" => "https://fonts.google.com/specimen/Open+Sans",
			"License Path" => "./fonts/open_sans/Open Sans license.txt",
			"License Type" => "Apache License Version 2.0"
		],
		"qrcode-generator" => [
			"URL" => "https://github.com/kazuhikoarase/qrcode-generator",
			"License Path" => "./scripts/qrcode-generator license.txt",
			"License Type" => "MIT License"
		],
		"Secp256k1-zkp WASM Wrapper" => [
			"URL" => "https://github.com/NicolasFlamel1/Secp256k1-zkp-WASM-Wrapper",
			"License Path" => "./scripts/secp256k1-zkp license.txt",
			"License Type" => "MIT License"
		],
		"SMAZ WASM Wrapper" => [
			"URL" => "https://github.com/NicolasFlamel1/SMAZ-WASM-Wrapper",
			"License Path" => "./scripts/SMAZ license.txt",
			"License Type" => "MIT License"
		],
		"X25519 WASM Wrapper" => [
			"URL" => "https://github.com/NicolasFlamel1/X25519-WASM-Wrapper",
			"License Path" => "./scripts/X25519 license.txt",
			"License Type" => "MIT License"
		]
	];
	
	
	// Main function
	
	// Check if disabling file versions
	if(array_key_exists("NO_FILE_VERSIONS", $_SERVER) === TRUE) {
	
		// Go through all files
		foreach($files as &$file) {
		
			// Set that file doesn't have a version
			$file["Version"] = 0;
		}
	}
	
	// Check if disabling file checksums
	if(array_key_exists("NO_FILE_CHECKSUMS", $_SERVER) === TRUE) {
	
		// Go through all files
		foreach($files as &$file) {
		
			// Set that file doesn't have a checksum
			$file["Checksum"] = NULL;
		}
	}
	
	// Check if disabling minified files
	if(array_key_exists("NO_MINIFIED_FILES", $_SERVER) === TRUE) {
	
		// Go through all files
		foreach($files as &$file) {
		
			// Set that file isn't minified
			$file["Minified"] = FALSE;
		}
	}
	
	
	// Supporting function implementation
	
	// Add minified suffix
	function addMinifiedSuffix($file) {
	
		// Get file's suffix offset
		$suffixOffset = mb_strrpos($file, ".");
		
		// Check if file contains no suffix
		if($suffixOffset === FALSE || $suffixOffset < mb_strlen("./"))
		
			// Return file with minified suffix at the end
			return $file . ".min";
		
		// Otherwise
		else
		
			// Return file with minified suffix insert before its suffix
			return mb_substr($file, 0, $suffixOffset) . ".min" . mb_substr($file, $suffixOffset);
	}
	
	// Get resource
	function getResource($file) {
	
		// Use files
		global $files;
	
		// Return resource with version
		return ((array_key_exists($file, $files) === TRUE && $files[$file]["Minified"] === TRUE) ? addMinifiedSuffix($file) : $file) . ((array_key_exists("NO_FILE_VERSIONS", $_SERVER) === FALSE && array_key_exists($file, $files) === TRUE && $files[$file]["Version"] !== 0) ? "?" . $files[$file]["Version"] : "");
	}
	
	// Get checksum
	function getChecksum($file) {
	
		// Use files
		global $files;
	
		// Return checksum
		return (array_key_exists("NO_FILE_CHECKSUMS", $_SERVER) === FALSE && array_key_exists($file, $files) === TRUE && $files[$file]["Checksum"] !== NULL) ? "sha512-" . $files[$file]["Checksum"] : "";
	}
?>
