
var x25519 = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(x25519) {
  x25519 = x25519 || {};


var a;a||(a=typeof x25519 !== 'undefined' ? x25519 : {});var g=Object.assign,h,l;a.ready=new Promise(function(b,c){h=b;l=c});var m=g({},a),n="";"undefined"!==typeof document&&document.currentScript&&(n=document.currentScript.src);_scriptDir&&(n=_scriptDir);0!==n.indexOf("blob:")?n=n.substr(0,n.replace(/[?#].*/,"").lastIndexOf("/")+1):n="";var p=a.printErr||console.warn.bind(console);g(a,m);m=null;var q;a.wasmBinary&&(q=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;
"object"!==typeof WebAssembly&&r("no native wasm support detected");var t,u=!1,v,w;function x(){var b=t.buffer;v=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=w=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var y,z=[],A=[],B=[];function C(){var b=a.preRun.shift();z.unshift(b)}var D=0,E=null,F=null;a.preloadedImages={};a.preloadedAudios={};
function r(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";p(b);u=!0;b=new WebAssembly.RuntimeError(b+". Build with -s ASSERTIONS=1 for more info.");l(b);throw b;}function G(){return H.startsWith("data:application/octet-stream;base64,")}var H;H="." + getResource("./scripts/X25519-0.0.2.wasm");if(!G()){var I=H;H=a.locateFile?a.locateFile(I,n):n+I}function J(){var b=H;try{if(b==H&&q)return new Uint8Array(q);throw"both async and sync fetching of the wasm failed";}catch(c){r(c)}}
function K(){return q||"function"!==typeof fetch?Promise.resolve().then(function(){return J()}):fetch(H,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+H+"'";return b.arrayBuffer()}).catch(function(){return J()})}function L(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c(a);else{var f=c.o;"number"===typeof f?void 0===c.m?y.get(f)():y.get(f)(c.m):f(void 0===c.m?null:c.m)}}}
var M={a:function(b){var c=w.length;b>>>=0;if(2147483648<b)return!1;for(var f=1;4>=f;f*=2){var e=c*(1+.2/f);e=Math.min(e,b+100663296);e=Math.max(b,e);0<e%65536&&(e+=65536-e%65536);a:{try{t.grow(Math.min(2147483648,e)-v.byteLength+65535>>>16);x();var d=1;break a}catch(k){}d=void 0}if(d)return!0}return!1}};
(function(){function b(d){a.asm=d.exports;t=a.asm.b;x();y=a.asm.l;A.unshift(a.asm.c);D--;a.monitorRunDependencies&&a.monitorRunDependencies(D);0==D&&(null!==E&&(clearInterval(E),E=null),F&&(d=F,F=null,d()))}function c(d){b(d.instance)}function f(d){return K().then(function(k){return WebAssembly.instantiate(k,e)}).then(function(k){return k}).then(d,function(k){p("failed to asynchronously prepare wasm: "+k);r(k)})}var e={a:M};D++;a.monitorRunDependencies&&a.monitorRunDependencies(D);if(a.instantiateWasm)try{return a.instantiateWasm(e,
b)}catch(d){return p("Module.instantiateWasm callback failed with error: "+d),!1}(function(){return q||"function"!==typeof WebAssembly.instantiateStreaming||G()||"function"!==typeof fetch?f(c):fetch(H,{credentials:"same-origin"}).then(function(d){return WebAssembly.instantiateStreaming(d,e).then(c,function(k){p("wasm streaming compile failed: "+k);p("falling back to ArrayBuffer instantiation");return f(c)})})})().catch(l);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.c).apply(null,arguments)};a._secretKeySize=function(){return(a._secretKeySize=a.asm.d).apply(null,arguments)};a._secretKeyFromEd25519SecretKey=function(){return(a._secretKeyFromEd25519SecretKey=a.asm.e).apply(null,arguments)};a._publicKeySize=function(){return(a._publicKeySize=a.asm.f).apply(null,arguments)};a._publicKeyFromEd25519PublicKey=function(){return(a._publicKeyFromEd25519PublicKey=a.asm.g).apply(null,arguments)};
a._sharedSecretKeySize=function(){return(a._sharedSecretKeySize=a.asm.h).apply(null,arguments)};a._sharedSecretKeyFromSecretKeyAndPublicKey=function(){return(a._sharedSecretKeyFromSecretKeyAndPublicKey=a.asm.i).apply(null,arguments)};a._malloc=function(){return(a._malloc=a.asm.j).apply(null,arguments)};a._free=function(){return(a._free=a.asm.k).apply(null,arguments)};var N;F=function O(){N||P();N||(F=O)};
function P(){function b(){if(!N&&(N=!0,a.calledRun=!0,!u)){L(A);h(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();B.unshift(c)}L(B)}}if(!(0<D)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)C();L(z);0<D||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}a.run=P;
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();P();


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
