
var smaz = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(smaz) {
  smaz = smaz || {};


var a;a||(a=typeof smaz !== 'undefined' ? smaz : {});var g,h;a.ready=new Promise(function(b,d){g=b;h=d});var k=Object.assign({},a),m="";"undefined"!=typeof document&&document.currentScript&&(m=document.currentScript.src);_scriptDir&&(m=_scriptDir);0!==m.indexOf("blob:")?m=m.substr(0,m.replace(/[?#].*/,"").lastIndexOf("/")+1):m="";var n=a.printErr||console.warn.bind(console);Object.assign(a,k);k=null;var p;a.wasmBinary&&(p=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;
"object"!=typeof WebAssembly&&q("no native wasm support detected");var r,t=!1,u,v;function w(){var b=r.buffer;u=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=v=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var x=[],y=[],z=[];function A(){var b=a.preRun.shift();x.unshift(b)}var B=0,C=null,D=null;
function q(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";n(b);t=!0;b=new WebAssembly.RuntimeError(b+". Build with -sASSERTIONS for more info.");h(b);throw b;}function E(){return F.startsWith("data:application/octet-stream;base64,")}var F;F="." + getResource("./scripts/SMAZ-0.0.31.wasm");if(!E()){var G=F;F=a.locateFile?a.locateFile(G,m):m+G}function H(){var b=F;try{if(b==F&&p)return new Uint8Array(p);throw"both async and sync fetching of the wasm failed";}catch(d){q(d)}}
function I(){return p||"function"!=typeof fetch?Promise.resolve().then(function(){return H()}):fetch(F,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+F+"'";return b.arrayBuffer()}).catch(function(){return H()})}function J(b){for(;0<b.length;)b.shift()(a)}
var K={b:function(){q("")},a:function(b){var d=v.length;b>>>=0;if(2147483648<b)return!1;for(var l=1;4>=l;l*=2){var f=d*(1+.2/l);f=Math.min(f,b+100663296);var c=Math;f=Math.max(b,f);c=c.min.call(c,2147483648,f+(65536-f%65536)%65536);a:{try{r.grow(c-u.byteLength+65535>>>16);w();var e=1;break a}catch(O){}e=void 0}if(e)return!0}return!1}};
(function(){function b(c){a.asm=c.exports;r=a.asm.c;w();y.unshift(a.asm.d);B--;a.monitorRunDependencies&&a.monitorRunDependencies(B);0==B&&(null!==C&&(clearInterval(C),C=null),D&&(c=D,D=null,c()))}function d(c){b(c.instance)}function l(c){return I().then(function(e){return WebAssembly.instantiate(e,f)}).then(function(e){return e}).then(c,function(e){n("failed to asynchronously prepare wasm: "+e);q(e)})}var f={a:K};B++;a.monitorRunDependencies&&a.monitorRunDependencies(B);if(a.instantiateWasm)try{return a.instantiateWasm(f,
b)}catch(c){return n("Module.instantiateWasm callback failed with error: "+c),!1}(function(){return p||"function"!=typeof WebAssembly.instantiateStreaming||E()||"function"!=typeof fetch?l(d):fetch(F,{credentials:"same-origin"}).then(function(c){return WebAssembly.instantiateStreaming(c,f).then(d,function(e){n("wasm streaming compile failed: "+e);n("falling back to ArrayBuffer instantiation");return l(d)})})})().catch(h);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.d).apply(null,arguments)};a._invalidSize=function(){return(a._invalidSize=a.asm.e).apply(null,arguments)};a._compressSize=function(){return(a._compressSize=a.asm.f).apply(null,arguments)};a._compress=function(){return(a._compress=a.asm.g).apply(null,arguments)};a._decompressSize=function(){return(a._decompressSize=a.asm.h).apply(null,arguments)};a._decompress=function(){return(a._decompress=a.asm.i).apply(null,arguments)};
a._malloc=function(){return(a._malloc=a.asm.j).apply(null,arguments)};a._free=function(){return(a._free=a.asm.k).apply(null,arguments)};var L;D=function M(){L||N();L||(D=M)};
function N(){function b(){if(!L&&(L=!0,a.calledRun=!0,!t)){J(y);g(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var d=a.postRun.shift();z.unshift(d)}J(z)}}if(!(0<B)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)A();J(x);0<B||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();N();


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
		
			// Check if instance doesn't exist
			if(typeof Smaz.instance === "undefined")
			
				// Set instance
				Smaz.instance = smaz();
		
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
		
			// Check if instance doesn't exist
			if(typeof Smaz.instance === "undefined")
			
				// Set instance
				Smaz.instance = smaz();
		
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
