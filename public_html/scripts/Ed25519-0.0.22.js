
var ed25519 = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(ed25519) {
  ed25519 = ed25519 || {};


var a;a||(a=typeof ed25519 !== 'undefined' ? ed25519 : {});var g,h;a.ready=new Promise(function(b,d){g=b;h=d});var k=Object.assign({},a),m="";"undefined"!=typeof document&&document.currentScript&&(m=document.currentScript.src);_scriptDir&&(m=_scriptDir);0!==m.indexOf("blob:")?m=m.substr(0,m.replace(/[?#].*/,"").lastIndexOf("/")+1):m="";var n=a.printErr||console.warn.bind(console);Object.assign(a,k);k=null;var p;a.wasmBinary&&(p=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;
"object"!=typeof WebAssembly&&q("no native wasm support detected");var r,t=!1,u,v;function w(){var b=r.buffer;u=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=v=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var x=[],y=[],z=[];function A(){var b=a.preRun.shift();x.unshift(b)}var B=0,C=null,D=null;
function q(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";n(b);t=!0;b=new WebAssembly.RuntimeError(b+". Build with -sASSERTIONS for more info.");h(b);throw b;}function E(){return F.startsWith("data:application/octet-stream;base64,")}var F;F="." + getResource("./scripts/Ed25519-0.0.22.wasm");if(!E()){var G=F;F=a.locateFile?a.locateFile(G,m):m+G}function H(){var b=F;try{if(b==F&&p)return new Uint8Array(p);throw"both async and sync fetching of the wasm failed";}catch(d){q(d)}}
function I(){return p||"function"!=typeof fetch?Promise.resolve().then(function(){return H()}):fetch(F,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+F+"'";return b.arrayBuffer()}).catch(function(){return H()})}function J(b){for(;0<b.length;)b.shift()(a)}
var K={b:function(){q("")},a:function(b){var d=v.length;b>>>=0;if(2147483648<b)return!1;for(var l=1;4>=l;l*=2){var f=d*(1+.2/l);f=Math.min(f,b+100663296);var c=Math;f=Math.max(b,f);c=c.min.call(c,2147483648,f+(65536-f%65536)%65536);a:{try{r.grow(c-u.byteLength+65535>>>16);w();var e=1;break a}catch(O){}e=void 0}if(e)return!0}return!1}};
(function(){function b(c){a.asm=c.exports;r=a.asm.c;w();y.unshift(a.asm.d);B--;a.monitorRunDependencies&&a.monitorRunDependencies(B);0==B&&(null!==C&&(clearInterval(C),C=null),D&&(c=D,D=null,c()))}function d(c){b(c.instance)}function l(c){return I().then(function(e){return WebAssembly.instantiate(e,f)}).then(function(e){return e}).then(c,function(e){n("failed to asynchronously prepare wasm: "+e);q(e)})}var f={a:K};B++;a.monitorRunDependencies&&a.monitorRunDependencies(B);if(a.instantiateWasm)try{return a.instantiateWasm(f,
b)}catch(c){return n("Module.instantiateWasm callback failed with error: "+c),!1}(function(){return p||"function"!=typeof WebAssembly.instantiateStreaming||E()||"function"!=typeof fetch?l(d):fetch(F,{credentials:"same-origin"}).then(function(c){return WebAssembly.instantiateStreaming(c,f).then(d,function(e){n("wasm streaming compile failed: "+e);n("falling back to ArrayBuffer instantiation");return l(d)})})})().catch(h);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.d).apply(null,arguments)};a._publicKeySize=function(){return(a._publicKeySize=a.asm.e).apply(null,arguments)};a._publicKeyFromSecretKey=function(){return(a._publicKeyFromSecretKey=a.asm.f).apply(null,arguments)};a._signatureSize=function(){return(a._signatureSize=a.asm.g).apply(null,arguments)};a._sign=function(){return(a._sign=a.asm.h).apply(null,arguments)};a._verify=function(){return(a._verify=a.asm.i).apply(null,arguments)};
a._malloc=function(){return(a._malloc=a.asm.j).apply(null,arguments)};a._free=function(){return(a._free=a.asm.k).apply(null,arguments)};var L;D=function M(){L||N();L||(D=M)};
function N(){function b(){if(!L&&(L=!0,a.calledRun=!0,!t)){J(y);g(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var d=a.postRun.shift();z.unshift(d)}J(z)}}if(!(0<B)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)A();J(x);0<B||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();N();


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
