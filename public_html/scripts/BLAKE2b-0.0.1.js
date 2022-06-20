
var blake2b = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(blake2b) {
  blake2b = blake2b || {};


var a;a||(a=typeof blake2b !== 'undefined' ? blake2b : {});var g=Object.assign,h,l;a.ready=new Promise(function(b,c){h=b;l=c});var m=g({},a),n="";"undefined"!==typeof document&&document.currentScript&&(n=document.currentScript.src);_scriptDir&&(n=_scriptDir);0!==n.indexOf("blob:")?n=n.substr(0,n.replace(/[?#].*/,"").lastIndexOf("/")+1):n="";var p=a.printErr||console.warn.bind(console);g(a,m);m=null;var q;a.wasmBinary&&(q=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;
"object"!==typeof WebAssembly&&r("no native wasm support detected");var t,u=!1,v,w;function x(){var b=t.buffer;v=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=w=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var y,z=[],A=[],B=[];function C(){var b=a.preRun.shift();z.unshift(b)}var D=0,E=null,F=null;a.preloadedImages={};a.preloadedAudios={};
function r(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";p(b);u=!0;b=new WebAssembly.RuntimeError(b+". Build with -s ASSERTIONS=1 for more info.");l(b);throw b;}function G(){return H.startsWith("data:application/octet-stream;base64,")}var H;H="." + getResource("./scripts/BLAKE2b-0.0.1.wasm");if(!G()){var I=H;H=a.locateFile?a.locateFile(I,n):n+I}function J(){var b=H;try{if(b==H&&q)return new Uint8Array(q);throw"both async and sync fetching of the wasm failed";}catch(c){r(c)}}
function K(){return q||"function"!==typeof fetch?Promise.resolve().then(function(){return J()}):fetch(H,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+H+"'";return b.arrayBuffer()}).catch(function(){return J()})}function L(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c(a);else{var f=c.i;"number"===typeof f?void 0===c.h?y.get(f)():y.get(f)(c.h):f(void 0===c.h?null:c.h)}}}
var M={a:function(b){var c=w.length;b>>>=0;if(2147483648<b)return!1;for(var f=1;4>=f;f*=2){var e=c*(1+.2/f);e=Math.min(e,b+100663296);e=Math.max(b,e);0<e%65536&&(e+=65536-e%65536);a:{try{t.grow(Math.min(2147483648,e)-v.byteLength+65535>>>16);x();var d=1;break a}catch(k){}d=void 0}if(d)return!0}return!1}};
(function(){function b(d){a.asm=d.exports;t=a.asm.b;x();y=a.asm.g;A.unshift(a.asm.c);D--;a.monitorRunDependencies&&a.monitorRunDependencies(D);0==D&&(null!==E&&(clearInterval(E),E=null),F&&(d=F,F=null,d()))}function c(d){b(d.instance)}function f(d){return K().then(function(k){return WebAssembly.instantiate(k,e)}).then(function(k){return k}).then(d,function(k){p("failed to asynchronously prepare wasm: "+k);r(k)})}var e={a:M};D++;a.monitorRunDependencies&&a.monitorRunDependencies(D);if(a.instantiateWasm)try{return a.instantiateWasm(e,
b)}catch(d){return p("Module.instantiateWasm callback failed with error: "+d),!1}(function(){return q||"function"!==typeof WebAssembly.instantiateStreaming||G()||"function"!==typeof fetch?f(c):fetch(H,{credentials:"same-origin"}).then(function(d){return WebAssembly.instantiateStreaming(d,e).then(c,function(k){p("wasm streaming compile failed: "+k);p("falling back to ArrayBuffer instantiation");return f(c)})})})().catch(l);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.c).apply(null,arguments)};a._compute=function(){return(a._compute=a.asm.d).apply(null,arguments)};a._malloc=function(){return(a._malloc=a.asm.e).apply(null,arguments)};a._free=function(){return(a._free=a.asm.f).apply(null,arguments)};var N;F=function O(){N||P();N||(F=O)};
function P(){function b(){if(!N&&(N=!0,a.calledRun=!0,!u)){L(A);h(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();B.unshift(c)}L(B)}}if(!(0<D)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)C();L(z);0<D||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}a.run=P;
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();P();


  return blake2b.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = blake2b;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return blake2b; });
else if (typeof exports === 'object')
  exports["blake2b"] = blake2b;
// Use strict
"use strict";


// Classes

// BLAKE2b class
class Blake2b {

	// Public
	
		// Initialize
		static initialize() {
		
			// Set instance to invalid
			Blake2b.instance = Blake2b.INVALID;
		
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
				
				// Create BLAKE2b instance
				blake2b(settings).then(function(instance) {
				
					// Prevent on abort from being called
					delete settings["onAbort"];
				
					// Set instance
					Blake2b.instance = instance;
					
					// Resolve
					resolve();
				});
			});
		}
		
		// Compute
		static compute(resultSize, input, key) {
		
			// Check if instance is invalid
			if(Blake2b.instance === Blake2b.INVALID)
			
				// Return operation failed
				return Blake2b.OPERATION_FAILED;
			
			// Initialize result to result size
			var result = new Uint8Array(resultSize);
			
			// Allocate and fill memory
			var resultBuffer = Blake2b.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var inputBuffer = Blake2b.instance._malloc(input["length"] * input["BYTES_PER_ELEMENT"]);
			Blake2b.instance["HEAPU8"].set(input, inputBuffer / input["BYTES_PER_ELEMENT"]);
			
			var keyBuffer = Blake2b.instance._malloc(key["length"] * key["BYTES_PER_ELEMENT"]);
			Blake2b.instance["HEAPU8"].set(key, keyBuffer / key["BYTES_PER_ELEMENT"]);
			
			// Check if computing BLAKE2b failed
			if(Blake2b.instance._compute(resultBuffer, result["length"] * result["BYTES_PER_ELEMENT"], inputBuffer, input["length"] * input["BYTES_PER_ELEMENT"], keyBuffer, key["length"] * key["BYTES_PER_ELEMENT"]) === Blake2b.C_FALSE) {
			
				// Clear memory
				Blake2b.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Blake2b.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
				Blake2b.instance["HEAPU8"].fill(0, keyBuffer / key["BYTES_PER_ELEMENT"], keyBuffer / key["BYTES_PER_ELEMENT"] + key["length"]);
				
				// Free memory
				Blake2b.instance._free(resultBuffer);
				Blake2b.instance._free(inputBuffer);
				Blake2b.instance._free(keyBuffer);
			
				// Return operation failed
				return Blake2b.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Blake2b.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Blake2b.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Blake2b.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
			Blake2b.instance["HEAPU8"].fill(0, keyBuffer / key["BYTES_PER_ELEMENT"], keyBuffer / key["BYTES_PER_ELEMENT"] + key["length"]);
			
			// Free memory
			Blake2b.instance._free(resultBuffer);
			Blake2b.instance._free(inputBuffer);
			Blake2b.instance._free(keyBuffer);
			
			// Return result
			return result;
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
	module["exports"] = Blake2b;
}
