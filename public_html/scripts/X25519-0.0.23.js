
var x25519 = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(x25519) {
  x25519 = x25519 || {};


var a;a||(a=typeof x25519 !== 'undefined' ? x25519 : {});var g,h;a.ready=new Promise(function(b,d){g=b;h=d});var k=Object.assign({},a),m="";"undefined"!=typeof document&&document.currentScript&&(m=document.currentScript.src);_scriptDir&&(m=_scriptDir);0!==m.indexOf("blob:")?m=m.substr(0,m.replace(/[?#].*/,"").lastIndexOf("/")+1):m="";var n=a.printErr||console.warn.bind(console);Object.assign(a,k);k=null;var p;a.wasmBinary&&(p=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;
"object"!=typeof WebAssembly&&q("no native wasm support detected");var r,t=!1,u,v;function w(){var b=r.buffer;u=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=v=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var x=[],y=[],z=[];function A(){var b=a.preRun.shift();x.unshift(b)}var B=0,C=null,D=null;
function q(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";n(b);t=!0;b=new WebAssembly.RuntimeError(b+". Build with -sASSERTIONS for more info.");h(b);throw b;}function E(){return F.startsWith("data:application/octet-stream;base64,")}var F;F="." + getResource("./scripts/X25519-0.0.23.wasm");if(!E()){var G=F;F=a.locateFile?a.locateFile(G,m):m+G}function H(){var b=F;try{if(b==F&&p)return new Uint8Array(p);throw"both async and sync fetching of the wasm failed";}catch(d){q(d)}}
function I(){return p||"function"!=typeof fetch?Promise.resolve().then(function(){return H()}):fetch(F,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+F+"'";return b.arrayBuffer()}).catch(function(){return H()})}function J(b){for(;0<b.length;)b.shift()(a)}
var K={b:function(){q("")},a:function(b){var d=v.length;b>>>=0;if(2147483648<b)return!1;for(var l=1;4>=l;l*=2){var f=d*(1+.2/l);f=Math.min(f,b+100663296);var c=Math;f=Math.max(b,f);c=c.min.call(c,2147483648,f+(65536-f%65536)%65536);a:{try{r.grow(c-u.byteLength+65535>>>16);w();var e=1;break a}catch(O){}e=void 0}if(e)return!0}return!1}};
(function(){function b(c){a.asm=c.exports;r=a.asm.c;w();y.unshift(a.asm.d);B--;a.monitorRunDependencies&&a.monitorRunDependencies(B);0==B&&(null!==C&&(clearInterval(C),C=null),D&&(c=D,D=null,c()))}function d(c){b(c.instance)}function l(c){return I().then(function(e){return WebAssembly.instantiate(e,f)}).then(function(e){return e}).then(c,function(e){n("failed to asynchronously prepare wasm: "+e);q(e)})}var f={a:K};B++;a.monitorRunDependencies&&a.monitorRunDependencies(B);if(a.instantiateWasm)try{return a.instantiateWasm(f,
b)}catch(c){return n("Module.instantiateWasm callback failed with error: "+c),!1}(function(){return p||"function"!=typeof WebAssembly.instantiateStreaming||E()||"function"!=typeof fetch?l(d):fetch(F,{credentials:"same-origin"}).then(function(c){return WebAssembly.instantiateStreaming(c,f).then(d,function(e){n("wasm streaming compile failed: "+e);n("falling back to ArrayBuffer instantiation");return l(d)})})})().catch(h);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.d).apply(null,arguments)};a._secretKeySize=function(){return(a._secretKeySize=a.asm.e).apply(null,arguments)};a._secretKeyFromEd25519SecretKey=function(){return(a._secretKeyFromEd25519SecretKey=a.asm.f).apply(null,arguments)};a._publicKeySize=function(){return(a._publicKeySize=a.asm.g).apply(null,arguments)};a._publicKeyFromEd25519PublicKey=function(){return(a._publicKeyFromEd25519PublicKey=a.asm.h).apply(null,arguments)};
a._sharedSecretKeySize=function(){return(a._sharedSecretKeySize=a.asm.i).apply(null,arguments)};a._sharedSecretKeyFromSecretKeyAndPublicKey=function(){return(a._sharedSecretKeyFromSecretKeyAndPublicKey=a.asm.j).apply(null,arguments)};a._malloc=function(){return(a._malloc=a.asm.k).apply(null,arguments)};a._free=function(){return(a._free=a.asm.l).apply(null,arguments)};var L;D=function M(){L||N();L||(D=M)};
function N(){function b(){if(!L&&(L=!0,a.calledRun=!0,!t)){J(y);g(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var d=a.postRun.shift();z.unshift(d)}J(z)}}if(!(0<B)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)A();J(x);0<B||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();N();


  return x25519.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = x25519;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return x25519; });
else if (typeof exports === 'object')
  exports["x25519"] = x25519;
// Use strict
"use strict";


// Classes

// X25519 class
class X25519 {

	// Public
	
		// Initialize
		static initialize() {
		
			// Set instance to invalid
			X25519.instance = X25519.INVALID;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Set settings
				var settings = {
				
					// On abort
					"onAbort": function(error) {
					
						// Prevent on abort from being called again
						delete settings["onAbort"];
						
						// Reject error
						reject("Failed to download resource");
					}
				};
				
				// Create X25519 instance
				x25519(settings).then(function(instance) {
				
					// Prevent on abort from being called
					delete settings["onAbort"];
				
					// Set instance
					X25519.instance = instance;
					
					// Resolve
					resolve();
				});
			});
		}
		
		// Secret key from Ed25519 secret key
		static secretKeyFromEd25519SecretKey(ed25519SecretKey) {
		
			// Check if instance doesn't exist
			if(typeof X25519.instance === "undefined")
			
				// Set instance
				X25519.instance = x25519();
		
			// Check if instance is invalid
			if(X25519.instance === X25519.INVALID)
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			
			// Initialize secret key to size of secret key
			var secretKey = new Uint8Array(X25519.instance._secretKeySize());
			
			// Allocate and fill memory
			var secretKeyBuffer = X25519.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			
			var ed25519SecretKeyBuffer = X25519.instance._malloc(ed25519SecretKey["length"] * ed25519SecretKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(ed25519SecretKey, ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting secret key from Ed25519 secret key failed
			if(X25519.instance._secretKeyFromEd25519SecretKey(secretKeyBuffer, ed25519SecretKeyBuffer, ed25519SecretKey["length"] * ed25519SecretKey["BYTES_PER_ELEMENT"]) === X25519.C_FALSE) {
			
				// Clear memory
				X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				X25519.instance["HEAPU8"].fill(0, ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"], ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"] + ed25519SecretKey["length"]);
				
				// Free memory
				X25519.instance._free(secretKeyBuffer);
				X25519.instance._free(ed25519SecretKeyBuffer);
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			}
			
			// Get secret key
			secretKey = new Uint8Array(X25519.instance["HEAPU8"].subarray(secretKeyBuffer, secretKeyBuffer + secretKey["length"]));
			
			// Clear memory
			X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			X25519.instance["HEAPU8"].fill(0, ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"], ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"] + ed25519SecretKey["length"]);
			
			// Free memory
			X25519.instance._free(secretKeyBuffer);
			X25519.instance._free(ed25519SecretKeyBuffer);
			
			// Return secret key
			return secretKey;
		}
		
		// Public key from Ed25519 public key
		static publicKeyFromEd25519PublicKey(ed25519PublicKey) {
		
			// Check if instance doesn't exist
			if(typeof X25519.instance === "undefined")
			
				// Set instance
				X25519.instance = x25519();
		
			// Check if instance is invalid
			if(X25519.instance === X25519.INVALID)
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			
			// Initialize public key to size of public key
			var publicKey = new Uint8Array(X25519.instance._publicKeySize());
			
			// Allocate and fill memory
			var publicKeyBuffer = X25519.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			
			var ed25519PublicKeyBuffer = X25519.instance._malloc(ed25519PublicKey["length"] * ed25519PublicKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(ed25519PublicKey, ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting public key from Ed25519 public key failed
			if(X25519.instance._publicKeyFromEd25519PublicKey(publicKeyBuffer, ed25519PublicKeyBuffer, ed25519PublicKey["length"] * ed25519PublicKey["BYTES_PER_ELEMENT"]) === X25519.C_FALSE) {
			
				// Clear memory
				X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				X25519.instance["HEAPU8"].fill(0, ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"], ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"] + ed25519PublicKey["length"]);
				
				// Free memory
				X25519.instance._free(publicKeyBuffer);
				X25519.instance._free(ed25519PublicKeyBuffer);
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			}
			
			// Get public key
			publicKey = new Uint8Array(X25519.instance["HEAPU8"].subarray(publicKeyBuffer, publicKeyBuffer + publicKey["length"]));
			
			// Clear memory
			X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			X25519.instance["HEAPU8"].fill(0, ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"], ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"] + ed25519PublicKey["length"]);
			
			// Free memory
			X25519.instance._free(publicKeyBuffer);
			X25519.instance._free(ed25519PublicKeyBuffer);
			
			// Return public key
			return publicKey;
		}
		
		// Shared secret key from secret key and public key
		static sharedSecretKeyFromSecretKeyAndPublicKey(secretKey, publicKey) {
		
			// Check if instance doesn't exist
			if(typeof X25519.instance === "undefined")
			
				// Set instance
				X25519.instance = x25519();
		
			// Check if instance is invalid
			if(X25519.instance === X25519.INVALID)
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			
			// Initialize shared secret key to size of shared secret key
			var sharedSecretKey = new Uint8Array(X25519.instance._sharedSecretKeySize());
			
			// Allocate and fill memory
			var sharedSecretKeyBuffer = X25519.instance._malloc(sharedSecretKey["length"] * sharedSecretKey["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = X25519.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = X25519.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting shared secret key from secret key and public key failed
			if(X25519.instance._sharedSecretKeyFromSecretKeyAndPublicKey(sharedSecretKeyBuffer, secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"], publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === X25519.C_FALSE) {
			
				// Clear memory
				X25519.instance["HEAPU8"].fill(0, sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"], sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"] + sharedSecretKey["length"]);
				X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
				// Free memory
				X25519.instance._free(sharedSecretKeyBuffer);
				X25519.instance._free(secretKeyBuffer);
				X25519.instance._free(publicKeyBuffer);
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			}
			
			// Get shared secret key
			sharedSecretKey = new Uint8Array(X25519.instance["HEAPU8"].subarray(sharedSecretKeyBuffer, sharedSecretKeyBuffer + sharedSecretKey["length"]));
			
			// Clear memory
			X25519.instance["HEAPU8"].fill(0, sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"], sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"] + sharedSecretKey["length"]);
			X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			X25519.instance._free(sharedSecretKeyBuffer);
			X25519.instance._free(secretKeyBuffer);
			X25519.instance._free(publicKeyBuffer);
			
			// Return shared secret key
			return sharedSecretKey;
		}
		
		// Operation failed
		static get OPERATION_FAILED() {
		
			// Return operation failed
			return null;
		}
	
	// Private
	
		// Invalid
		static get INVALID() {
		
			// Return invalid
			return null;
		}
		
		// C false
		static get C_FALSE() {
		
			// Return C false
			return 0;
		}
}


// Supporting fuction implementation

// Check if document doesn't exist
if(typeof document === "undefined") {

	// Create document
	var document = {};
}

// Check if module exports exists
if(typeof module === "object" && module !== null && "exports" in module === true) {

	// Exports
	module["exports"] = X25519;
}
