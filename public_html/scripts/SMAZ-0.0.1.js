
var smaz = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(smaz) {
  smaz = smaz || {};


var a;a||(a=typeof smaz !== 'undefined' ? smaz : {});var g=Object.assign,h,l;a.ready=new Promise(function(b,c){h=b;l=c});var m=g({},a),n="";"undefined"!==typeof document&&document.currentScript&&(n=document.currentScript.src);_scriptDir&&(n=_scriptDir);0!==n.indexOf("blob:")?n=n.substr(0,n.replace(/[?#].*/,"").lastIndexOf("/")+1):n="";var p=a.printErr||console.warn.bind(console);g(a,m);m=null;var q;a.wasmBinary&&(q=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;
"object"!==typeof WebAssembly&&r("no native wasm support detected");var t,u=!1,v,w;function x(){var b=t.buffer;v=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=w=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var y,z=[],A=[],B=[];function C(){var b=a.preRun.shift();z.unshift(b)}var D=0,E=null,F=null;a.preloadedImages={};a.preloadedAudios={};
function r(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";p(b);u=!0;b=new WebAssembly.RuntimeError(b+". Build with -s ASSERTIONS=1 for more info.");l(b);throw b;}function G(){return H.startsWith("data:application/octet-stream;base64,")}var H;H="." + getResource("./scripts/SMAZ-0.0.1.wasm");if(!G()){var I=H;H=a.locateFile?a.locateFile(I,n):n+I}function J(){var b=H;try{if(b==H&&q)return new Uint8Array(q);throw"both async and sync fetching of the wasm failed";}catch(c){r(c)}}
function K(){return q||"function"!==typeof fetch?Promise.resolve().then(function(){return J()}):fetch(H,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+H+"'";return b.arrayBuffer()}).catch(function(){return J()})}function L(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c(a);else{var f=c.m;"number"===typeof f?void 0===c.l?y.get(f)():y.get(f)(c.l):f(void 0===c.l?null:c.l)}}}
var M={a:function(b){var c=w.length;b>>>=0;if(2147483648<b)return!1;for(var f=1;4>=f;f*=2){var e=c*(1+.2/f);e=Math.min(e,b+100663296);e=Math.max(b,e);0<e%65536&&(e+=65536-e%65536);a:{try{t.grow(Math.min(2147483648,e)-v.byteLength+65535>>>16);x();var d=1;break a}catch(k){}d=void 0}if(d)return!0}return!1}};
(function(){function b(d){a.asm=d.exports;t=a.asm.b;x();y=a.asm.k;A.unshift(a.asm.c);D--;a.monitorRunDependencies&&a.monitorRunDependencies(D);0==D&&(null!==E&&(clearInterval(E),E=null),F&&(d=F,F=null,d()))}function c(d){b(d.instance)}function f(d){return K().then(function(k){return WebAssembly.instantiate(k,e)}).then(function(k){return k}).then(d,function(k){p("failed to asynchronously prepare wasm: "+k);r(k)})}var e={a:M};D++;a.monitorRunDependencies&&a.monitorRunDependencies(D);if(a.instantiateWasm)try{return a.instantiateWasm(e,
b)}catch(d){return p("Module.instantiateWasm callback failed with error: "+d),!1}(function(){return q||"function"!==typeof WebAssembly.instantiateStreaming||G()||"function"!==typeof fetch?f(c):fetch(H,{credentials:"same-origin"}).then(function(d){return WebAssembly.instantiateStreaming(d,e).then(c,function(k){p("wasm streaming compile failed: "+k);p("falling back to ArrayBuffer instantiation");return f(c)})})})().catch(l);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.c).apply(null,arguments)};a._invalidSize=function(){return(a._invalidSize=a.asm.d).apply(null,arguments)};a._compressSize=function(){return(a._compressSize=a.asm.e).apply(null,arguments)};a._compress=function(){return(a._compress=a.asm.f).apply(null,arguments)};a._decompressSize=function(){return(a._decompressSize=a.asm.g).apply(null,arguments)};a._decompress=function(){return(a._decompress=a.asm.h).apply(null,arguments)};
a._malloc=function(){return(a._malloc=a.asm.i).apply(null,arguments)};a._free=function(){return(a._free=a.asm.j).apply(null,arguments)};var N;F=function O(){N||P();N||(F=O)};
function P(){function b(){if(!N&&(N=!0,a.calledRun=!0,!u)){L(A);h(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();B.unshift(c)}L(B)}}if(!(0<D)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)C();L(z);0<D||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}a.run=P;
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();P();


  return smaz.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = smaz;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return smaz; });
else if (typeof exports === 'object')
  exports["smaz"] = smaz;
// Use strict
"use strict";


// Classes

// SMAZ class
class Smaz {

	// Public
	
		// Initialize
		static initialize() {
		
			// Set instance to invalid
			Smaz.instance = Smaz.INVALID;
		
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
				
				// Create SMAZ instance
				smaz(settings).then(function(instance) {
				
					// Prevent on abort from being called
					delete settings["onAbort"];
				
					// Set instance
					Smaz.instance = instance;
					
					// Resolve
					resolve();
				});
			});
		}
		
		// Compress
		static compress(input) {
		
			// Check if instance is invalid
			if(Smaz.instance === Smaz.INVALID)
			
				// Return operation failed
				return Smaz.OPERATION_FAILED;
			
			// Allocate and fill memory
			var inputBuffer = Smaz.instance._malloc(input["length"] * input["BYTES_PER_ELEMENT"]);
			Smaz.instance["HEAPU8"].set(input, inputBuffer / input["BYTES_PER_ELEMENT"]);
			
			// Check if getting compress size failed
			var compressSize = Smaz.instance._compressSize(inputBuffer, input["length"] * input["BYTES_PER_ELEMENT"]);
			
			if(compressSize === Smaz.instance._invalidSize()) {
			
				// Clear memory
				Smaz.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
				
				// Free memory
				Smaz.instance._free(inputBuffer);
			
				// Return operation failed
				return Smaz.OPERATION_FAILED;
			}
			
			// Initialize result to compress size
			var result = new Uint8Array(compressSize);
			
			// Allocate and fill memory
			var resultBuffer = Smaz.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			// Check if compressing failed
			if(Smaz.instance._compress(resultBuffer, result["length"] * result["BYTES_PER_ELEMENT"], inputBuffer, input["length"] * input["BYTES_PER_ELEMENT"]) === Smaz.C_FALSE) {
			
				// Clear memory
				Smaz.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Smaz.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
				
				// Free memory
				Smaz.instance._free(resultBuffer);
				Smaz.instance._free(inputBuffer);
			
				// Return operation failed
				return Smaz.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Smaz.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Smaz.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Smaz.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
			
			// Free memory
			Smaz.instance._free(resultBuffer);
			Smaz.instance._free(inputBuffer);
			
			// Return result
			return result;
		}
		
		// Decompress
		static decompress(input) {
		
			// Check if instance is invalid
			if(Smaz.instance === Smaz.INVALID)
			
				// Return operation failed
				return Smaz.OPERATION_FAILED;
			
			// Allocate and fill memory
			var inputBuffer = Smaz.instance._malloc(input["length"] * input["BYTES_PER_ELEMENT"]);
			Smaz.instance["HEAPU8"].set(input, inputBuffer / input["BYTES_PER_ELEMENT"]);
			
			// Check if getting decompress size failed
			var decompressSize = Smaz.instance._decompressSize(inputBuffer, input["length"] * input["BYTES_PER_ELEMENT"]);
			
			if(decompressSize === Smaz.instance._invalidSize()) {
			
				// Clear memory
				Smaz.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
				
				// Free memory
				Smaz.instance._free(inputBuffer);
			
				// Return operation failed
				return Smaz.OPERATION_FAILED;
			}
			
			// Initialize result to decompress size
			var result = new Uint8Array(decompressSize);
			
			// Allocate and fill memory
			var resultBuffer = Smaz.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			// Check if decompressing failed
			if(Smaz.instance._decompress(resultBuffer, result["length"] * result["BYTES_PER_ELEMENT"], inputBuffer, input["length"] * input["BYTES_PER_ELEMENT"]) === Smaz.C_FALSE) {
			
				// Clear memory
				Smaz.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Smaz.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
				
				// Free memory
				Smaz.instance._free(resultBuffer);
				Smaz.instance._free(inputBuffer);
			
				// Return operation failed
				return Smaz.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Smaz.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Smaz.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Smaz.instance["HEAPU8"].fill(0, inputBuffer / input["BYTES_PER_ELEMENT"], inputBuffer / input["BYTES_PER_ELEMENT"] + input["length"]);
			
			// Free memory
			Smaz.instance._free(resultBuffer);
			Smaz.instance._free(inputBuffer);
			
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
	module["exports"] = Smaz;
}
