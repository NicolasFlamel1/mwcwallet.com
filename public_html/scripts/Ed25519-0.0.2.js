
var ed25519 = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(ed25519) {
  ed25519 = ed25519 || {};


var a;a||(a=typeof ed25519 !== 'undefined' ? ed25519 : {});var g=Object.assign,h,l;a.ready=new Promise(function(b,c){h=b;l=c});var m=g({},a),n="";"undefined"!==typeof document&&document.currentScript&&(n=document.currentScript.src);_scriptDir&&(n=_scriptDir);0!==n.indexOf("blob:")?n=n.substr(0,n.replace(/[?#].*/,"").lastIndexOf("/")+1):n="";var p=a.printErr||console.warn.bind(console);g(a,m);m=null;var q;a.wasmBinary&&(q=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;
"object"!==typeof WebAssembly&&r("no native wasm support detected");var t,u=!1,v,w;function x(){var b=t.buffer;v=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=w=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var y,z=[],A=[],B=[];function C(){var b=a.preRun.shift();z.unshift(b)}var D=0,E=null,F=null;a.preloadedImages={};a.preloadedAudios={};
function r(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";p(b);u=!0;b=new WebAssembly.RuntimeError(b+". Build with -s ASSERTIONS=1 for more info.");l(b);throw b;}function G(){return H.startsWith("data:application/octet-stream;base64,")}var H;H="." + getResource("./scripts/Ed25519-0.0.2.wasm");if(!G()){var I=H;H=a.locateFile?a.locateFile(I,n):n+I}function J(){var b=H;try{if(b==H&&q)return new Uint8Array(q);throw"both async and sync fetching of the wasm failed";}catch(c){r(c)}}
function K(){return q||"function"!==typeof fetch?Promise.resolve().then(function(){return J()}):fetch(H,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+H+"'";return b.arrayBuffer()}).catch(function(){return J()})}function L(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c(a);else{var f=c.m;"number"===typeof f?void 0===c.l?y.get(f)():y.get(f)(c.l):f(void 0===c.l?null:c.l)}}}
var M={a:function(b){var c=w.length;b>>>=0;if(2147483648<b)return!1;for(var f=1;4>=f;f*=2){var e=c*(1+.2/f);e=Math.min(e,b+100663296);e=Math.max(b,e);0<e%65536&&(e+=65536-e%65536);a:{try{t.grow(Math.min(2147483648,e)-v.byteLength+65535>>>16);x();var d=1;break a}catch(k){}d=void 0}if(d)return!0}return!1}};
(function(){function b(d){a.asm=d.exports;t=a.asm.b;x();y=a.asm.k;A.unshift(a.asm.c);D--;a.monitorRunDependencies&&a.monitorRunDependencies(D);0==D&&(null!==E&&(clearInterval(E),E=null),F&&(d=F,F=null,d()))}function c(d){b(d.instance)}function f(d){return K().then(function(k){return WebAssembly.instantiate(k,e)}).then(function(k){return k}).then(d,function(k){p("failed to asynchronously prepare wasm: "+k);r(k)})}var e={a:M};D++;a.monitorRunDependencies&&a.monitorRunDependencies(D);if(a.instantiateWasm)try{return a.instantiateWasm(e,
b)}catch(d){return p("Module.instantiateWasm callback failed with error: "+d),!1}(function(){return q||"function"!==typeof WebAssembly.instantiateStreaming||G()||"function"!==typeof fetch?f(c):fetch(H,{credentials:"same-origin"}).then(function(d){return WebAssembly.instantiateStreaming(d,e).then(c,function(k){p("wasm streaming compile failed: "+k);p("falling back to ArrayBuffer instantiation");return f(c)})})})().catch(l);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.c).apply(null,arguments)};a._publicKeySize=function(){return(a._publicKeySize=a.asm.d).apply(null,arguments)};a._publicKeyFromSecretKey=function(){return(a._publicKeyFromSecretKey=a.asm.e).apply(null,arguments)};a._signatureSize=function(){return(a._signatureSize=a.asm.f).apply(null,arguments)};a._sign=function(){return(a._sign=a.asm.g).apply(null,arguments)};a._verify=function(){return(a._verify=a.asm.h).apply(null,arguments)};
a._malloc=function(){return(a._malloc=a.asm.i).apply(null,arguments)};a._free=function(){return(a._free=a.asm.j).apply(null,arguments)};var N;F=function O(){N||P();N||(F=O)};
function P(){function b(){if(!N&&(N=!0,a.calledRun=!0,!u)){L(A);h(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();B.unshift(c)}L(B)}}if(!(0<D)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)C();L(z);0<D||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}a.run=P;
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();P();


  return ed25519.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = ed25519;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return ed25519; });
else if (typeof exports === 'object')
  exports["ed25519"] = ed25519;
// Use strict
"use strict";


// Classes

// Ed25519 class
class Ed25519 {

	// Public
	
		// Initialize
		static initialize() {
		
			// Set instance to invalid
			Ed25519.instance = Ed25519.INVALID;
		
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
				
				// Create Ed25519 instance
				ed25519(settings).then(function(instance) {
				
					// Prevent on abort from being called
					delete settings["onAbort"];
				
					// Set instance
					Ed25519.instance = instance;
					
					// Resolve
					resolve();
				});
			});
		}
		
		// Public key from secret key
		static publicKeyFromSecretKey(secretKey) {
		
			// Check if instance doesn't exist
			if(typeof Ed25519.instance === "undefined")
			
				// Set instance
				Ed25519.instance = ed25519();
		
			// Check if instance is invalid
			if(Ed25519.instance === Ed25519.INVALID)
			
				// Return operation failed
				return Ed25519.OPERATION_FAILED;
			
			// Initialize public key to size of public key
			var publicKey = new Uint8Array(Ed25519.instance._publicKeySize());
			
			// Allocate and fill memory
			var publicKeyBuffer = Ed25519.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Ed25519.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Ed25519.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting public key from secret key failed
			if(Ed25519.instance._publicKeyFromSecretKey(publicKeyBuffer, secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]) === Ed25519.C_FALSE) {
			
				// Clear memory
				Ed25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				Ed25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				
				// Free memory
				Ed25519.instance._free(publicKeyBuffer);
				Ed25519.instance._free(secretKeyBuffer);
			
				// Return operation failed
				return Ed25519.OPERATION_FAILED;
			}
			
			// Get public key
			publicKey = new Uint8Array(Ed25519.instance["HEAPU8"].subarray(publicKeyBuffer, publicKeyBuffer + publicKey["length"]));
			
			// Clear memory
			Ed25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			Ed25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			
			// Free memory
			Ed25519.instance._free(publicKeyBuffer);
			Ed25519.instance._free(secretKeyBuffer);
			
			// Return public key
			return publicKey;
		}
		
		// Sign
		static sign(message, secretKey) {
		
			// Check if instance doesn't exist
			if(typeof Ed25519.instance === "undefined")
			
				// Set instance
				Ed25519.instance = ed25519();
		
			// Check if instance is invalid
			if(Ed25519.instance === Ed25519.INVALID)
			
				// Return operation failed
				return Ed25519.OPERATION_FAILED;
			
			// Initialize signature to size of signature
			var signature = new Uint8Array(Ed25519.instance._signatureSize());
			
			// Allocate and fill memory
			var signatureBuffer = Ed25519.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			
			var messageBuffer = Ed25519.instance._malloc(message["length"] * message["BYTES_PER_ELEMENT"]);
			Ed25519.instance["HEAPU8"].set(message, messageBuffer / message["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Ed25519.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Ed25519.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			// Check if signing message failed
			if(Ed25519.instance._sign(signatureBuffer, messageBuffer, message["length"] * message["BYTES_PER_ELEMENT"], secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]) === Ed25519.C_FALSE) {
			
				// Clear memory
				Ed25519.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				Ed25519.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
				Ed25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				
				// Free memory
				Ed25519.instance._free(signatureBuffer);
				Ed25519.instance._free(messageBuffer);
				Ed25519.instance._free(secretKeyBuffer);
			
				// Return operation failed
				return Ed25519.OPERATION_FAILED;
			}
			
			// Get signature
			signature = new Uint8Array(Ed25519.instance["HEAPU8"].subarray(signatureBuffer, signatureBuffer + signature["length"]));
			
			// Clear memory
			Ed25519.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			Ed25519.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
			Ed25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			
			// Free memory
			Ed25519.instance._free(signatureBuffer);
			Ed25519.instance._free(messageBuffer);
			Ed25519.instance._free(secretKeyBuffer);
			
			// Return signature
			return signature;
		}
		
		// Verify
		static verify(message, signature, publicKey) {
		
			// Check if instance doesn't exist
			if(typeof Ed25519.instance === "undefined")
			
				// Set instance
				Ed25519.instance = ed25519();
		
			// Check if instance is invalid
			if(Ed25519.instance === Ed25519.INVALID)
			
				// Return operation failed
				return Ed25519.OPERATION_FAILED;
			
			// Allocate and fill memory
			var messageBuffer = Ed25519.instance._malloc(message["length"] * message["BYTES_PER_ELEMENT"]);
			Ed25519.instance["HEAPU8"].set(message, messageBuffer / message["BYTES_PER_ELEMENT"]);
			
			var signatureBuffer = Ed25519.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			Ed25519.instance["HEAPU8"].set(signature, signatureBuffer / signature["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Ed25519.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Ed25519.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if performing verify failed
			if(Ed25519.instance._verify(messageBuffer, message["length"] * message["BYTES_PER_ELEMENT"], signatureBuffer, signature["length"] * signature["BYTES_PER_ELEMENT"], publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === Ed25519.C_FALSE) {
			
				// Clear memory
				Ed25519.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
				Ed25519.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				Ed25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				
				// Free memory
				Ed25519.instance._free(messageBuffer);
				Ed25519.instance._free(signatureBuffer);
				Ed25519.instance._free(publicKeyBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Ed25519.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
			Ed25519.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			Ed25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			Ed25519.instance._free(messageBuffer);
			Ed25519.instance._free(signatureBuffer);
			Ed25519.instance._free(publicKeyBuffer);
			
			// Return true
			return true;
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
	module["exports"] = Ed25519;
}
