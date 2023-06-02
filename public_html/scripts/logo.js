// Use strict
"use strict";


// Classes

// Logo class
class Logo {

	// Public
	
		// Constructor
		constructor(application, message, wakeLock) {
		
			// Set application
			this.application = application;
			
			// Set message
			this.message = message;
		
			// Get main display
			this.mainDisplay = $("main");
		
			// Get logo display
			this.logoDisplay = this.mainDisplay.children().children("div.logo");
			
			// Get canvas
			this.canvas = this.logoDisplay.children().get(0);
			
			// Set closing
			this.closing = false;
			
			// Set frame duration
			this.frameDuration = 0;
			
			// Set frame duration variation
			this.frameDurationVariation = 0;
			
			// Set shader program
			this.shaderProgram = Logo.NO_SHADER_PROGRAM;
			
			// Set buffers
			this.buffers = [];
			
			// Set textures
			this.textures = [];
			
			// Set can show
			this.canShow = false;
			
			// Set loaded
			this.loaded = false;
			
			// Set compatible
			this.compatible = true;
			
			// Set first time show
			this.firstTimeShow = true;
			
			// Set context lost
			this.contextLost = false;
			
			// Set position
			this.position = Logo.INITIAL_POSITION;
			
			// Set orientation
			this.orientation = Logo.INITIAL_ORIENTATION;
			
			// Set velocity X
			this.velocityX = 0;
			
			// Set velocity Y
			this.velocityY = 0;
			
			// Set restore context frame
			this.restoreContextFrame = Logo.NO_RESTORE_CONTEXT_FRAME;
			
			// Set close timeout
			this.closeTimeout = Logo.NO_CLOSE_TIMEOUT;
			
			// Set start recording rotation
			this.startRecordingRotation = false;
			
			// Set recorded rotation
			this.recordedRotation = 0;
			
			// Set Tetris
			this.tetris = new Tetris(this.application, this.message, wakeLock);
			
			// Set self
			var self = this;
		
			// Get WebGL context
			this.gl = this.canvas.getContext("webgl", {
			
				// Alpha
				"alpha": true,
				
				// Antialiad
				"antialias": true,
				
				// Depth
				"depth": true,
				
				// Power preference
				"powerPreference": "default",
				
				// Stencil
				"stencil": false
			});
			
			// Check if WebGL isn't supported
			if(this.gl === Logo.NO_WEBGL)
				
				// Get experimental WebGL context
				this.gl = this.canvas.getContext("experimental-webgl", {
				
					// Alpha
					"alpha": true,
					
					// Antialias
					"antialias": true,
					
					// Depth
					"depth": true,
					
					// Power preference
					"powerPreference": "default",
					
					// Stencil
					"stencil": false
				});
			
			// Check if WebGL is supported
			if(this.gl !== Logo.NO_WEBGL) {
			
				// Window unload event
				$(window).on("unload", function() {
				
					// Close and don't hide the logo
					self.close(false);
				});
				
				// Update canvas size
				this.updateCanvasSize();
				
				// Get WEBGL lose context extension
				var webglLoseContext = self.gl.getExtension("WEBGL_lose_context");
				
				// Canvas WebGL context lost event
				$(this.canvas).on("webglcontextlost", function(event) {
				
					// Set context lost
					self.contextLost = true;
					
					// Check if not closing
					if(self.closing === false) {
				
						// Check if getting WEBGL lose context extension was successful
						if(webglLoseContext !== Logo.NO_WEBGL_EXTENSION) {
						
							// Prevent default
							event.preventDefault();
							
							// Set restore context frame
							self.restoreContextFrame = requestAnimationFrame(function() {
							
								// Set restore context frame to no restore context frame
								self.restoreContextFrame = Logo.NO_RESTORE_CONTEXT_FRAME;
							
								// Set close timeout
								self.closeTimeout = setTimeout(function() {
								
									// Set close timeout to no close timeout
									self.closeTimeout = Logo.NO_CLOSE_TIMEOUT;
								
									// Close
									self.close();
									
								}, Logo.CLOSE_IF_NOT_RESTORED_MILLISECONDS);
								
								// Check if context is lost
								if(self.gl.isContextLost() === true) {
								
									// Restore context
									webglLoseContext.restoreContext();
								}
							});
						}
						
						// Otherwise
						else {
						
							// Close
							self.close();
						}
					}
				
				// Canvas WebGL context restored event
				}).on("webglcontextrestored", function() {
				
					// Check if restore context frame exists
					if(self.restoreContextFrame !== Logo.NO_RESTORE_CONTEXT_FRAME) {
					
						// Cancel restore context frame
						cancelAnimationFrame(self.restoreContextFrame);
						
						// Set restore context frame to no restore context frame
						self.restoreContextFrame = Logo.NO_RESTORE_CONTEXT_FRAME;
					}
					
					// Check if close timeout exists
					if(self.closeTimeout !== Logo.NO_CLOSE_TIMEOUT) {
					
						// Clear close timeout
						clearTimeout(self.closeTimeout);
						
						// Set close timeout to no close timeout
						self.closeTimeout = Logo.NO_CLOSE_TIMEOUT;
					}
				
					// Check if not closing
					if(self.closing === false) {
					
						// Cleanup
						self.cleanUp();
						
						// Initialize
						self.initialize(self.canvas["width"], self.canvas["height"]).then(function() {
						
							// Clear context lost
							self.contextLost = false;
							
							// Update size
							self.updateSize();
							
							// Draw
							self.draw();
						
						// Catch errors
						}).catch(function(error) {
						
							// Clear context lost
							self.contextLost = false;
							
							// Close
							self.close();
						});
					}
				});
				
				// Initialize
				this.initialize(this.canvas["width"], this.canvas["height"]).then(function() {
				
					// Run
					self.run();
						
					// Window resize event
					$(window).on("resize", function() {
					
						// Update size
						self.updateSize();
						
						// Draw
						self.draw();
					});
					
					// Update size
					self.updateSize();
					
					// Draw
					self.draw();
					
					// Set last pointer state
					self.lastPointerState = Logo.NO_POINTER_STATE;
					
					// Document pointer move and mouse move logo event
					$(document).on("pointermove mousemove.logo", function(event) {
					
						// Check if event is a pointer move
						if(event["type"] === "pointermove")
						
							// Turn off document mouse move logo event
							$(document).off("mousemove.logo");
					
						// Check if not closing
						if(self.closing === false) {
							
							// Check if event's coordinates are within the screen
							if(event["pageX"] < self.mainDisplay.width() && event["pageY"] < self.mainDisplay.height()) {
					
								// Get current timestamp
								var currentTimestamp = Date.now();
							
								// Check if logo is showing, message isn't showing, and Tetris isn't showing
								if(self.logoDisplay.hasClass("notLoaded") === false && self.logoDisplay.hasClass("hide") === false && self.mainDisplay.hasClass("logo") === true && self.logoDisplay.is(":visible") === true && self.message.isShown() === false && self.tetris.isShown() === false) {
							
									// Check if primary pointer button is pressed
									if((event["buttons"] & Common.PRIMARY_POINTER_BUTTON_BITMASK) !== 0) {
									
										// Set start recording rotation
										self.startRecordingRotation = true;
									
										// Check if last pointer state exists
										if(self.lastPointerState !== Logo.NO_POINTER_STATE) {
										
											// Get timestamp change of pointer movement
											var timestampChange = (currentTimestamp - self.lastPointerState["Timestamp"]) / Common.MILLISECONDS_IN_A_SECOND;
											
											// Check if timestamp change isn't zero
											if(timestampChange !== 0) {
										
												// Get percent of where pointer was is in the canvas
												var oldPercentX = (self.lastPointerState["Position X"] - $(self.canvas).offset()["left"]) / $(self.canvas).width();
												var oldPercentY = (self.lastPointerState["Position Y"] - $(self.canvas).offset()["top"]) / $(self.canvas).height();
											
												// Get percent of where pointer currently is in the canvas
												var newPercentX = (event["pageX"] - $(self.canvas).offset()["left"]) / $(self.canvas).width();
												var newPercentY = (event["pageY"] - $(self.canvas).offset()["top"]) / $(self.canvas).height();
												
												// Get minimum and maximum percents in the X axis
												if(oldPercentX <= newPercentX) {
													var minimumPercentX = oldPercentX;
													var maximumPercentX = newPercentX;
												}
												else {
													var minimumPercentX = newPercentX;
													var maximumPercentX = oldPercentX;
												}
												
												// Get minimum and maximum percents in the Y axis
												if(oldPercentY <= newPercentY) {
													var minimumPercentY = oldPercentY;
													var maximumPercentY = newPercentY;
												}
												else {
													var minimumPercentY = newPercentY;
													var maximumPercentY = oldPercentY;
												}
												
												// Check if pointer moved over the logo
												if(Logo.boundingBoxesCollide(minimumPercentX, minimumPercentY, maximumPercentX, maximumPercentY, Logo.LOGO_PERCENT_SIZE["Minimum X"], Logo.LOGO_PERCENT_SIZE["Minimum Y"], Logo.LOGO_PERCENT_SIZE["Maximum X"], Logo.LOGO_PERCENT_SIZE["Maximum Y"]) === true) {
												
													// Get pointer distances
													var distanceX = (event["pageX"] - self.lastPointerState["Position X"]) / $(document).width() * Logo.DISTANCE_RATIO_TO_SCREEN_WIDTH;
													var distanceY = (event["pageY"] - self.lastPointerState["Position Y"]) / $(document).height() * Logo.DISTANCE_RATIO_TO_SCREEN_HEIGHT;
													
													// Set pointer velocities
													self.velocityX = distanceX / timestampChange * Logo.POINTER_VELOCITY_SCALE_FACTOR;
													self.velocityY = distanceY / timestampChange * Logo.POINTER_VELOCITY_SCALE_FACTOR;
												}
											}
										}
									}
								}
									
								// Update last pointer state
								self.lastPointerState = {
								
									// Timestamp
									"Timestamp": currentTimestamp,
									
									// Position X
									"Position X": event["pageX"],
									
									// Position Y
									"Position Y": event["pageY"]
								};
							}
						}
					});
					
					// Set loaded
					self.loaded = true;
				
					// Set that logo display is loaded
					self.logoDisplay.removeClass("notLoaded");
				
				// Catch errors
				}).catch(function(error) {
				
					// Close
					self.close();
				});
			}
			
			// Otherwise
			else {
			
				// Close
				self.close();
			}
		}
		
		// Show
		show() {
		
			// Set self
			var self = this;
			
			// Set timeout
			setTimeout(function() {
		
				// Set can show
				self.canShow = true;
				
			}, Logo.INITIAL_SHOW_DELAY_MILLISECONDS);
		
			// Show logo display
			this.logoDisplay.removeClass("hide");
			
			// Logo display transition end or timeout event
			this.logoDisplay.transitionEndOrTimeout(function() {
			
				// Set logo display to transition at the correct speed
				self.logoDisplay.addClass("normalTransitionSpeed");
				
			}, "opacity");
		}
		
		// Hide
		hide() {
		
			// Hide logo display
			this.logoDisplay.addClass("hide");
		}
		
		// Allow showing
		allowShowing() {
		
			// Check if compatible
			if(this.compatible === true)
		
				// Allow main display to show logo
				this.mainDisplay.addClass("logo");
		}
	
	// Private
	
		// Update size
		updateSize() {
		
			// Update canvas size
			this.updateCanvasSize();
			
			// Update last dimensions
			this.lastWidth = window["innerWidth"];
			this.lastHeight = window["innerHeight"];
			
			// Resize
			this.resize(this.canvas["width"], this.canvas["height"]);
		}
		
		// Prevent showing
		preventShowing() {
		
			// Clear compatible
			this.compatible = false;
		
			// Don't allow main display to show logo
			this.mainDisplay.removeClass("logo");
		}
		
		// Update canvas size
		updateCanvasSize() {
		
			// Update canvas size
			this.canvas["width"] = this.canvas["clientWidth"];
			this.canvas["height"] = this.canvas["clientHeight"];
		}
		
		// Initialize
		initialize(width, height) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Set matrix array type
				glMatrix["glMatrix"].setMatrixArrayType(Array);
			
				// Check if getting EXT texture filter anisotropic extension was successful
				var extTextureFilterAnisotropic = self.gl.getExtension("EXT_texture_filter_anisotropic");
				if(extTextureFilterAnisotropic !== Logo.NO_WEBGL_EXTENSION) {
				
					// Add anisotropic constants
					self.gl["constructor"]["prototype"]["MAX_TEXTURE_MAX_ANISOTROPY_EXT"] = extTextureFilterAnisotropic["MAX_TEXTURE_MAX_ANISOTROPY_EXT"];
					self.gl["constructor"]["prototype"]["TEXTURE_MAX_ANISOTROPY_EXT"] = extTextureFilterAnisotropic["TEXTURE_MAX_ANISOTROPY_EXT"];
				}
				
				// Set anisotropy
				self.anisotropy = Logo.DEFAULT_ANISOTROPY;
				
				// Get max anisotropy
				if(typeof self.gl["MAX_TEXTURE_MAX_ANISOTROPY_EXT"] !== "undefined")
					self.anisotropy = self.gl.getParameter(self.gl["MAX_TEXTURE_MAX_ANISOTROPY_EXT"]);
				
				// Limit anisotropy
				self.anisotropy = Math.min(self.anisotropy, Logo.MAX_ANISOTROPY);
				
				// Set viewport size
				self.gl.viewport(0, 0, width, height);
				
				// Enable back face culling
				self.gl.enable(self.gl["CULL_FACE"]);
				self.gl.cullFace(self.gl["BACK"]);
				self.gl.frontFace(self.gl["CCW"]);
				
				// Enable depth testing
				self.gl.enable(self.gl["DEPTH_TEST"]);
				
				// Use closer fragments from depth test
				self.gl.depthFunc(self.gl["LESS"]);
				
				// Enabe writing to depth buffer
				self.gl.depthMask(true);
				
				// Enable alpha blending
				self.gl.enable(self.gl["BLEND"]);
				self.gl.blendFunc(self.gl["SRC_ALPHA"], self.gl["ONE_MINUS_SRC_ALPHA"]);
				
				// Set clear color
				self.gl.clearColor(0, 0, 0, 0);
				
				// Load vertex shader source, fragment shader source, and model
				Promise.all([$.ajax({
				
					// URL
					"url": "." + getResource(Logo.VERTEX_SHADER_FILE_LOCATION),
					
					// Data type
					"dataType": "text"
				
				}), $.ajax({
				
					// URL
					"url": "." + getResource(Logo.FRAGMENT_SHADER_FILE_LOCATION),
					
					// Data type
					"dataType": "text"
				
				}), $.getJSON("." + getResource(Logo.MODEL_FILE_LOCATION))]).then(function(resources) {
				
					// Check if closing
					if(self.closing === true) {
					
						// Reject
						reject();
						
						// Return
						return;
					}
					
					// Get vertex shader source
					var vertexShaderSource = resources[0];
				
					// Create vertex shader
					var vertexShader = self.gl.createShader(self.gl["VERTEX_SHADER"]);
					
					// Prepend constants to vertex shader source
					vertexShaderSource = Logo.SHADER_CONSTANTS + "\n" + vertexShaderSource;
					
					// Compile vertex shader
					self.gl.shaderSource(vertexShader, vertexShaderSource);
					self.gl.compileShader(vertexShader);
					
					// Check if compiling vertex shader failed
					if(self.gl.getShaderParameter(vertexShader, self.gl["COMPILE_STATUS"]) === false) {
					
						// Delete vertex shader
						self.gl.deleteShader(vertexShader);
					
						// Reject error
						reject("Compiling vertex shader failed.");
						
						// Return
						return;
					}
					
					// Get fragment shader source
					var fragmentShaderSource = resources[1];
					
					// Create fragment shader
					var fragmentShader = self.gl.createShader(self.gl["FRAGMENT_SHADER"]);
					
					// Prepend constants to fragment shader source
					fragmentShaderSource = Logo.SHADER_CONSTANTS + "\n" + fragmentShaderSource;
					
					// Compile fragment shader
					self.gl.shaderSource(fragmentShader, fragmentShaderSource);
					self.gl.compileShader(fragmentShader);
					
					// Check if compiling fragment shader failed
					if(self.gl.getShaderParameter(fragmentShader, self.gl["COMPILE_STATUS"]) === false) {
					
						// Delete vertex shader
						self.gl.deleteShader(vertexShader);
						
						// Delete fragment shader
						self.gl.deleteShader(fragmentShader);
					
						// Reject error
						reject("Compiling fragment shader failed.");
						
						// Return
						return;
					}
					
					// Create shader program
					self.shaderProgram = self.gl.createProgram();
					
					// Attach vertex shader to shader program
					self.gl.attachShader(self.shaderProgram, vertexShader);
					
					// Attach fragment shader to shader program
					self.gl.attachShader(self.shaderProgram, fragmentShader);
					
					// Link shader program
					self.gl.linkProgram(self.shaderProgram);
					
					// Check if linking shader program failed
					if(self.gl.getProgramParameter(self.shaderProgram, self.gl["LINK_STATUS"]) === false) {
					
						// Delete vertex shader
						self.gl.deleteShader(vertexShader);
						
						// Delete fragment shader
						self.gl.deleteShader(fragmentShader);
					
						// Reject error
						reject("Linking shader program failed.");
						
						// Return
						return;
					}
					
					// Delete vertex shader
					self.gl.deleteShader(vertexShader);
					
					// Delete fragment shader
					self.gl.deleteShader(fragmentShader);
					
					// Use shader program
					self.gl.useProgram(self.shaderProgram);
					
					// Get model
					var model = resources[2];
				
					// Create index buffer
					var indexBuffer = self.gl.createBuffer();
					
					// Append index buffer to list of buffers
					self.buffers.push(indexBuffer);
					
					// Bind index buffer
					self.gl.bindBuffer(self.gl["ELEMENT_ARRAY_BUFFER"], indexBuffer);
					
					// Move data into index buffer
					self.gl.bufferData(self.gl["ELEMENT_ARRAY_BUFFER"], new Uint16Array(model["Textured Models"][0]["Indices"]), self.gl["STATIC_DRAW"]);
					
					// Create positions buffer
					var positionsBuffer = self.gl.createBuffer();
					
					// Append positions buffer to list of buffers
					self.buffers.push(positionsBuffer);
					
					// Bind positions buffer
					self.gl.bindBuffer(self.gl["ARRAY_BUFFER"], positionsBuffer);
					
					// Move data into positions buffer
					self.gl.bufferData(self.gl["ARRAY_BUFFER"], new Float32Array(model["Textured Models"][0]["Positions"]), self.gl["STATIC_DRAW"]);
					
					// Get position attribute location in the shader program
					var positionAttribute = self.gl.getAttribLocation(self.shaderProgram, "position");
					
					// Set position attribute to the positions buffer
					self.gl.vertexAttribPointer(positionAttribute, 3, self.gl["FLOAT"], false, 0, 0);
					
					// Enable position attribute
					self.gl.enableVertexAttribArray(positionAttribute);
					
					// Create text coordinates buffer
					var textureCoordinatesBuffer = self.gl.createBuffer();
					
					// Append texture coordinates buffer to list of buffers
					self.buffers.push(textureCoordinatesBuffer);
					
					// Bind texture coordinates buffer
					self.gl.bindBuffer(self.gl["ARRAY_BUFFER"], textureCoordinatesBuffer);
					
					// Move data into texture coordinates buffer
					self.gl.bufferData(self.gl["ARRAY_BUFFER"], new Float32Array(model["Textured Models"][0]["Texture Coordinates"]), self.gl["STATIC_DRAW"]);
					
					// Get texture coordinate attribute location in the shader program
					var textureCoordinateAttribute = self.gl.getAttribLocation(self.shaderProgram, "textureCoordinate");
					
					// Set texture coordinate attribute to the texture coordinates buffer
					self.gl.vertexAttribPointer(textureCoordinateAttribute, 2, self.gl["FLOAT"], false, 0, 0);
					
					// Enable texture coordinate attribute
					self.gl.enableVertexAttribArray(textureCoordinateAttribute);
					
					// Create normals buffer
					var normalsBuffer = self.gl.createBuffer();
					
					// Append normals buffer to list of buffers
					self.buffers.push(normalsBuffer);
					
					// Bind normals buffer
					self.gl.bindBuffer(self.gl["ARRAY_BUFFER"], normalsBuffer);
					
					// Move data into normals buffer
					self.gl.bufferData(self.gl["ARRAY_BUFFER"], new Float32Array(model["Textured Models"][0]["Normals"]), self.gl["STATIC_DRAW"]);
					
					// Get normal attribute location in the shader program
					var normalAttribute = self.gl.getAttribLocation(self.shaderProgram, "normal");
					
					// Set normal attribute to the texture coordinates buffer
					self.gl.vertexAttribPointer(normalAttribute, 3, self.gl["FLOAT"], false, 0, 0);
					
					// Enable normal attribute
					self.gl.enableVertexAttribArray(normalAttribute);
					
					// Create tangents buffer
					var tangentsBuffer = self.gl.createBuffer();
					
					// Append tangents buffer to list of buffers
					self.buffers.push(tangentsBuffer);
					
					// Bind tangents buffer
					self.gl.bindBuffer(self.gl["ARRAY_BUFFER"], tangentsBuffer);
					
					// Move data into tangents buffer
					self.gl.bufferData(self.gl["ARRAY_BUFFER"], new Float32Array(model["Textured Models"][0]["Tangents"]), self.gl["STATIC_DRAW"]);
					
					// Get tangent attribute location in the shader program
					var tangentAttribute = self.gl.getAttribLocation(self.shaderProgram, "tangent");
					
					// Set tangent attribute to the texture coordinates buffer
					self.gl.vertexAttribPointer(tangentAttribute, 3, self.gl["FLOAT"], false, 0, 0);
					
					// Enable tangent attribute
					self.gl.enableVertexAttribArray(tangentAttribute);
					
					// Create bitangents buffer
					var bitangentsBuffer = self.gl.createBuffer();
					
					// Append bitangents buffer to list of buffers
					self.buffers.push(bitangentsBuffer);
					
					// Bind bitangents buffer
					self.gl.bindBuffer(self.gl["ARRAY_BUFFER"], bitangentsBuffer);
					
					// Move data into bitangents buffer
					self.gl.bufferData(self.gl["ARRAY_BUFFER"], new Float32Array(model["Textured Models"][0]["Bitangents"]), self.gl["STATIC_DRAW"]);
					
					// Get bitangent attribute location in the shader program
					var bitangentAttribute = self.gl.getAttribLocation(self.shaderProgram, "bitangent");
					
					// Set bitangent attribute to the texture coordinates buffer
					self.gl.vertexAttribPointer(bitangentAttribute, 3, self.gl["FLOAT"], false, 0, 0);
					
					// Enable bitangent attribute
					self.gl.enableVertexAttribArray(bitangentAttribute);
					
					// Load model's diffuse texture
					self.loadTexture((model["Textured Models"][0]["Diffuse Texture Index"] === Logo.NO_TEXTURE_INDEX) ? "" : model["Textures"][model["Textured Models"][0]["Diffuse Texture Index"]]).then(function(diffuseTexture) {
					
						// Check if closing
						if(self.closing === true) {
						
							// Reject
							reject();
							
							// Return
							return;
						}
					
						// Get material diffuse map location in the shader
						var materialDiffuseMapLocation = self.gl.getUniformLocation(self.shaderProgram, "material.diffuseMap");
						
						// Load material diffuse map in the shader
						self.gl.uniform1i(materialDiffuseMapLocation, 0);
						
						// Bind diffuse map in the shader
						self.gl.activeTexture(self.gl["TEXTURE0"]);
						self.gl.bindTexture(self.gl["TEXTURE_2D"], diffuseTexture);
						
						// Load model's specular texture
						self.loadTexture((model["Textured Models"][0]["Specular Texture Index"] === Logo.NO_TEXTURE_INDEX) ? "" : model["Textures"][model["Textured Models"][0]["Specular Texture Index"]]).then(function(specularTexture) {
						
							// Check if closing
							if(self.closing === true) {
							
								// Reject
								reject();
								
								// Return
								return;
							}
						
							// Get material has specular map location in the shader
							var materialHasSpecularMapLocation = self.gl.getUniformLocation(self.shaderProgram, "material.hasSpecularMap");
							
							// Load material has specular map in the shader
							self.gl.uniform1i(materialHasSpecularMapLocation, specularTexture !== Logo.INVALID_TEXTURE);
							
							// Check if specular texture exists
							if(specularTexture !== Logo.INVALID_TEXTURE) {
						
								// Get material specular map location in the shader
								var materialSpecularMapLocation = self.gl.getUniformLocation(self.shaderProgram, "material.specularMap");
								
								// Load material specular map in the shader
								self.gl.uniform1i(materialSpecularMapLocation, 1);
								
								// Bind specular map in the shader
								self.gl.activeTexture(self.gl["TEXTURE1"]);
								self.gl.bindTexture(self.gl["TEXTURE_2D"], specularTexture);
							}
							
							// Load model's emission texture
							self.loadTexture((model["Textured Models"][0]["Emission Texture Index"] === Logo.NO_TEXTURE_INDEX) ? "" : model["Textures"][model["Textured Models"][0]["Emission Texture Index"]]).then(function(emissionTexture) {
							
								// Check if closing
								if(self.closing === true) {
								
									// Reject
									reject();
									
									// Return
									return;
								}
							
								// Get material has emission map location in the shader
								var materialHasEmissionMapLocation = self.gl.getUniformLocation(self.shaderProgram, "material.hasEmissionMap");
								
								// Load material has emission map in the shader
								self.gl.uniform1i(materialHasEmissionMapLocation, emissionTexture !== Logo.INVALID_TEXTURE);
								
								// Check if emission texture exists
								if(emissionTexture !== Logo.INVALID_TEXTURE) {
								
									// Get material emission map location in the shader
									var materialEmissionMapLocation = self.gl.getUniformLocation(self.shaderProgram, "material.emissionMap");
									
									// Load material emission map in the shader
									self.gl.uniform1i(materialEmissionMapLocation, 2);
									
									// Bind emission map in the shader
									self.gl.activeTexture(self.gl["TEXTURE2"]);
									self.gl.bindTexture(self.gl["TEXTURE_2D"], emissionTexture);
								}
								
								// Load model's normal texture
								self.loadTexture((model["Textured Models"][0]["Normal Texture Index"] === Logo.NO_TEXTURE_INDEX) ? "" : model["Textures"][model["Textured Models"][0]["Normal Texture Index"]]).then(function(normalTexture) {
								
									// Check if closing
									if(self.closing === true) {
									
										// Reject
										reject();
										
										// Return
										return;
									}
								
									// Get material has normal map location in the shader
									var materialHasNormalMapLocation = self.gl.getUniformLocation(self.shaderProgram, "material.hasNormalMap");
									
									// Load material has normal map in the shader
									self.gl.uniform1i(materialHasNormalMapLocation, normalTexture !== Logo.INVALID_TEXTURE);
									
									// Check if normal texture exists
									if(normalTexture !== Logo.INVALID_TEXTURE) {
									
										// Get material normal map location in the shader
										var materialNormalMapLocation = self.gl.getUniformLocation(self.shaderProgram, "material.normalMap");
										
										// Load material normal map in the shader
										self.gl.uniform1i(materialNormalMapLocation, 3);
										
										// Bind normal map in the shader
										self.gl.activeTexture(self.gl["TEXTURE3"]);
										self.gl.bindTexture(self.gl["TEXTURE_2D"], normalTexture);
									}
									
									// Get material shininess location in the shader
									var materialShininessLocation = self.gl.getUniformLocation(self.shaderProgram, "material.shininess");
									
									// Load material shininess in the shader
									self.gl.uniform1f(materialShininessLocation, model["Textured Models"][0]["Shininess"]);
									
									// Create view matrix
									var viewMatrix = glMatrix["mat4"].create();
									
									// Get view matrix location in the shader program
									var viewMatrixLocation = self.gl.getUniformLocation(self.shaderProgram, "viewMatrix");
									
									// Load view matrix in the shader program
									self.gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
							
									// Update projection matrix
									self.updateProjectionMatrix(width, height);
									
									// Go through all lights
									var lightTypeLocations = [];
									var lightPositionLocations = [];
									var lightConstantAttenuationFactorLocations = [];
									var lightLinearAttenuationFactorLocations = [];
									var lightQuadraticAttenuationFactorLocations = [];
									var lightDirectionLocations = [];
									var lightInnerCutOffAngleLocations = [];
									var lightOuterCutOffAngleLocations = [];
									var lightAmbientColorLocations = [];
									var lightDiffuseColorLocations = [];
									var lightSpecularColorLocations = [];
									for(var i = 0; i < Logo.MAX_NUMBER_OF_LIGHTS; ++i) {
									
										// Get light type location in the shader
										lightTypeLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].type"));
									
										// Get light position location in the shader
										lightPositionLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].position"));
										
										// Get gight constant attenuation factor location in the shader
										lightConstantAttenuationFactorLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].constantAttenuationFactor"));
										
										// Get light linear attenuation factor location in the shader
										lightLinearAttenuationFactorLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].linearAttenuationFactor"));
										
										// Get light quadratic attenuation factor location in the shader
										lightQuadraticAttenuationFactorLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].quadraticAttenuationFactor"));
										
										// Get light direction location in the shader
										lightDirectionLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].direction"));
										
										// Get light inner cut off angle location in the shader
										lightInnerCutOffAngleLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].innerCutOffAngle"));
										
										// Get light outer cut off angle location in the shader
										lightOuterCutOffAngleLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].outerCutOffAngle"));
										
										// Get light ambient color location in the shader
										lightAmbientColorLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].ambientColor"));
										
										// Get light diffuse color location in the shader
										lightDiffuseColorLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].diffuseColor"));
										
										// Get light specular color location in the shader
										lightSpecularColorLocations.push(self.gl.getUniformLocation(self.shaderProgram, "lights[" + i.toFixed() + "].specularColor"));
									}
									
									// Create lights
									var lights = [
										Logo.createDirectionalLight(glMatrix["vec3"].normalize(glMatrix["vec3"].create(), glMatrix["vec3"].fromValues(0, 0, -1)), glMatrix["vec3"].fromValues(0.5, 0.5, 0.5), glMatrix["vec3"].fromValues(0.3, 0.3, 0.3), glMatrix["vec3"].fromValues(1, 1, 1))
									];
									
									// Go through all lights
									for(var i = 0; i < lights["length"]; ++i) {
									
										// Get light
										var light = lights[i];
									
										// Load light type
										self.gl.uniform1i(lightTypeLocations[i], light["Type"]);
									
										// Check if light is a point light
										if(light["Type"] === Logo.POINT_LIGHT_TYPE) {

											// Load light position
											self.gl.uniform3fv(lightPositionLocations[i], light["Position"]);
											
											// Load light constant attenuation factor
											self.gl.uniform1f(lightConstantAttenuationFactorLocations[i], light["Constant Attenuation Factor"]);
											
											// Load light linear attenuation factor
											self.gl.uniform1f(lightLinearAttenuationFactorLocations[i], light["Linear Attenuation Factor"]);
											
											// Load light quadratic attenuation factor
											self.gl.uniform1f(lightQuadraticAttenuationFactorLocations[i], light["Quadratic Attenuation Factor"]);
										}
										
										// Otherwise
										else {
										
											// Check if light is a directional light
											if(light["Type"] === Logo.DIRECTIONAL_LIGHT_TYPE)

												// Load light direction
												self.gl.uniform3fv(lightDirectionLocations[i], light["Direction"]);
											
											// Otherwise
											else {
											
												// Check if light is a spot light
												if(light["Type"] === Logo.SPOT_LIGHT_TYPE) {

													// Load light position
													self.gl.uniform3fv(lightPositionLocations[i], light["Position"]);
													
													// Load light constant attenuation factor
													self.gl.uniform1f(lightConstantAttenuationFactorLocations[i], light["Constant Attenuation Factor"]);
													
													// Load light linear attenuation factor
													self.gl.uniform1f(lightLinearAttenuationFactorLocations[i], light["Linear Attenuation Factor"]);
													
													// Load light quadratic attenuation factor
													self.gl.uniform1f(lightQuadraticAttenuationFactorLocations[i], light["Quadratic Attenuation Factor"]);
													
													// Load light direction
													self.gl.uniform3fv(lightDirectionLocations[i], light["Direction"]);
													
													// Load light inner cut off angle
													self.gl.uniform1f(lightInnerCutOffAngleLocations[i], light["Inner Cut Off Angle"]);
													
													// Load light outer cut off angle
													self.gl.uniform1f(lightOuterCutOffAngleLocations[i], light["Outer Cut Off Angle"]);
												}
											}
										}
										
										// Load light ambient color
										self.gl.uniform3fv(lightAmbientColorLocations[i], light["Ambient Color"]);
										
										// Load light diffuse color
										self.gl.uniform3fv(lightDiffuseColorLocations[i], light["Diffuse Color"]);
										
										// Load light specular color
										self.gl.uniform3fv(lightSpecularColorLocations[i], light["Specular Color"]);
									}
									
									// Check if some lights aren't used
									if(i !== Logo.MAX_NUMBER_OF_LIGHTS)
									
										// Load next light's type as invalid
										self.gl.uniform1i(lightTypeLocations[i], Logo.INVALID_LIGHT_TYPE);
									
									// Set number of indices
									self.numberOfIndices = model["Textured Models"][0]["Indices"]["length"];
									
									// Resolve
									resolve();
								
								// Catch errors
								}).catch(function(error) {
								
									// Reject error
									reject("Loading normal texture failed.");
								});
							
							// Catch errors
							}).catch(function(error) {
							
								// Reject error
								reject("Loading emission texture failed.");
							});
						
						// Catch errors
						}).catch(function(error) {
						
							// Reject error
							reject("Loading specular texture failed.");
						});
					
					// Catch errors
					}).catch(function(error) {
					
						// Reject error
						reject("Loading diffuse texture failed.");
					});
				
				// Catch errors
				}).catch(function(error) {
				
					// Reject error
					reject("Loading resources failed.");
				});
			});
		}
		
		// Close
		close(hideLogo = true) {
		
			// Check if not already closing
			if(this.closing === false) {
			
				// Set closing
				this.closing = true;
				
				// Check if hiding logo
				if(hideLogo === true) {
				
					// Prevent showing
					this.preventShowing();
				}
				
				// Clean up
				this.cleanUp();
			}
		}
		
		// Clean up
		cleanUp() {
		
			// Check if WebGL is supported
			if(this.gl !== Logo.NO_WEBGL) {
		
				// Check if shader program exists
				if(this.shaderProgram !== Logo.NO_SHADER_PROGRAM) {
				
					// Stop using shader
					this.gl.useProgram(Logo.NO_SHADER_PROGRAM);
					
					// Check if context wasn't lost
					if(this.contextLost === false) {
				
						// Delete shader program
						this.gl.deleteProgram(this.shaderProgram);
					}
					
					// Set shader program to no shader program
					this.shaderProgram = Logo.NO_SHADER_PROGRAM;
				}
				
				// Check if context wasn't lost
				if(this.contextLost === false) {
				
					// Go through all buffers
					for(var i = 0; i < this.buffers["length"]; ++i) {
					
						// Delete buffer
						this.gl.deleteBuffer(this.buffers[i]);
					}
				}
				
				// Empty buffers
				this.buffers = [];
				
				// Check if context wasn't lost
				if(this.contextLost === false) {
				
					// Go through all textures
					for(var i = 0; i < this.textures["length"]; ++i) {
					
						// Delete texture
						this.gl.deleteTexture(this.textures[i]);
					}
				}
				
				// Empty textures
				this.textures = [];
			}
		}
		
		// Run
		run(currentTime = 0) {
		
			// Check if last frame time hasn't been set
			if(typeof this.lastFrameTime === "undefined")
			
				// Set last frame time
				this.lastFrameTime = currentTime;
			
			// Set frame duration
			this.frameDuration = currentTime - this.lastFrameTime;
			
			// Set frame duration variation
			this.frameDurationVariation = this.frameDuration * Logo.TIMING_FRAMES_PER_SECOND;
			
			// Set last frame time
			this.lastFrameTime = currentTime;
			
			// Can if can show and loaded
			if(this.canShow === true && this.loaded === true) {
			
				// Check if first time show
				if(this.firstTimeShow === true) {
				
					// Clear first time show
					this.firstTimeShow = false;
					
					// Set initial X velocity
					this.velocityX = Logo.INITIAL_X_VELOCITY;
				}
				
				// Check if X or Y velocity exists
				if(this.velocityX !== 0 || this.velocityY !== 0) {
				
					// Limit frame duration variation
					this.frameDurationVariation = Math.min(Math.max(this.frameDurationVariation, Logo.MINIMUM_FRAME_DURATION_VARIATION), Logo.MAXIMUM_FRAME_DURATION_VARIATION);
					
					// Rotate orientation on global X axis proportional to Y velocity
					var rotationX = glMatrix["quat"].fromEuler(glMatrix["quat"].create(), this.velocityY * Logo.VELOCITY_APPLIED_SCALE_FACTOR * this.frameDurationVariation, 0, 0);
					
					glMatrix["quat"].normalize(this.orientation, glMatrix["quat"].multiply(this.orientation, rotationX, this.orientation));
					
					// Update Y velocity
					this.velocityY *= 1 - Math.min(Math.max(Logo.VELOCITY_DEGRADE_SCALE_FACTOR * this.frameDurationVariation, 0), 1);
					
					// Check if Y velocity is too small
					if(Math.abs(this.velocityY) < Logo.MINIMUM_VELOCITY_THRESHOLD)
					
						// Clear Y velocity
						this.velocityY = 0;
					
					// Rotate orientation on global Y axis proportional to X velocity
					var rotationY = glMatrix["quat"].fromEuler(glMatrix["quat"].create(), 0, this.velocityX * Logo.VELOCITY_APPLIED_SCALE_FACTOR * this.frameDurationVariation, 0);
					
					glMatrix["quat"].normalize(this.orientation, glMatrix["quat"].multiply(this.orientation, rotationY, this.orientation));
					
					// Update X velocity
					this.velocityX *= 1 - Math.min(Math.max(Logo.VELOCITY_DEGRADE_SCALE_FACTOR * this.frameDurationVariation, 0), 1);
					
					// Check if X velocity is too small
					if(Math.abs(this.velocityX) < Logo.MINIMUM_VELOCITY_THRESHOLD)
					
						// Clear X velocity
						this.velocityX = 0;
					
					// Check if recording rotation
					if(this.startRecordingRotation === true) {
					
						// Update recorded rotation
						this.recordedRotation += this.velocityX * Logo.VELOCITY_APPLIED_SCALE_FACTOR * this.frameDurationVariation;
						
						// Check if recorded rotation exceeds Tetris threshold
						if(Math.abs(this.recordedRotation) >= Logo.TETRIS_ROTATION_THRESHOLD) {
						
							// Set start recording rotation to false
							this.startRecordingRotation = false;
							
							// Reset recorded rotation
							this.recordedRotation = 0;
							
							// Check if logo is showing, create or unlock display is shown, message display isn't shown, application isn't showing loading, application isn't disabled, and messages are allowed
							if(this.logoDisplay.hasClass("notLoaded") === false && this.logoDisplay.hasClass("hide") === false && this.mainDisplay.hasClass("logo") === true && this.logoDisplay.is(":visible") === true && (this.application.isCreateDisplayShown() === true || this.application.isUnlockDisplayShown() === true) && this.message.isShown() === false && this.application.isShowingLoading() === false && this.application.isDisabled() === false && this.message.getAllowed() === true) {
							
								// Show tetris
								this.tetris.show();
							}
						}
					}
					
					// Draw
					this.draw();
				}
				
				// Otherwise check if frame duration variation is too large
				else if(this.frameDurationVariation >= Logo.FORCE_REDRAW_FRAME_DURATION_VARIATION_THRESHOLD) {
				
					// Draw
					this.draw();
					
					// Set self
					var self = this;
					
					// Go through number of times to draw
					for(var i = 0; i < Logo.FORCE_REDRAW_NUMBER_OF_TIMES - 1; ++i) {
					
						// Set timeout
						setTimeout(function() {
						
							// Draw
							self.draw();
						
						}, i * Logo.FORCE_REDRAW_INTERVAL_SECONDS * Common.MILLISECONDS_IN_A_SECOND);
					}
				}
			}
			
			// Check if not closing
			if(this.closing === false) {
			
				// Set self
				var self = this;
				
				// Request animation frame
				requestAnimationFrame(function(currentTime) {
				
					// Run
					self.run(currentTime / Common.MILLISECONDS_IN_A_SECOND);
				});
			}
		}
		
		// Draw
		draw() {
		
			// Check if context wasn't lost and not closing
			if(this.contextLost === false && this.closing === false) {
		
				// Check if window dimensions changed without triggering a resize event
				if(window["innerWidth"] !== this.lastWidth || window["innerHeight"] !== this.lastHeight) {
				
					// Update size
					this.updateSize();
				}
				
				// Clear color and depth buffers
				this.gl.clear(this.gl["COLOR_BUFFER_BIT"] | this.gl["DEPTH_BUFFER_BIT"]);
				
				// Create model matrix
				var modelMatrix = Logo.createModelMatrix(this.position, this.orientation, glMatrix["vec3"].fromValues(1, 1, 1));
				
				// Get model matrix location in the shader program
				var modelMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, "modelMatrix");
				
				// Load model matrix in the shader program
				this.gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
				
				// Draw model
				this.gl.drawElements(this.gl["TRIANGLES"], this.numberOfIndices, this.gl["UNSIGNED_SHORT"], 0);
			}
		}
		
		// Resize
		resize(width, height) {
		
			// Check if context wasn't lost and not closing
			if(this.contextLost === false && this.closing === false) {
		
				// Set viewport size
				this.gl.viewport(0, 0, width, height);
				
				// Update projection matrix
				this.updateProjectionMatrix(width, height);
			}
		}
		
		// Update projection matrix
		updateProjectionMatrix(width, height) {
		
			// Check if context wasn't lost and not closing
			if(this.contextLost === false && this.closing === false) {
		
				// Create projection matrix
				var projectionMatrix = glMatrix["mat4"].perspective(glMatrix["mat4"].create(), glMatrix["glMatrix"].toRadian((height <= Logo.SMALL_HEIGHT_THRESHOLD) ? Logo.SMALL_HEIGHT_FIELD_OF_VIEW : Logo.FIELD_OF_VIEW), width / height, Logo.NEAR_PLANE, Logo.FAR_PLANE);
				
				// Get projection matrix location in the shader program
				var projectionMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
				
				// Load projection matrix in the shader program
				this.gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
			}
		}
		
		// Create model matrix
		static createModelMatrix(translation, orientation, scale) {
		
			// Return scaled, rotated, and translated matrix
			return glMatrix["mat4"].fromRotationTranslationScale(glMatrix["mat4"].create(), orientation, translation, scale);
		}
		
		// Load texture
		loadTexture(file) {
		
			// Set self
			var self = this;
		
			// Return promise
			return new Promise(function(resolve, reject) {
			
				// Check if file is invalid
				if(file["length"] === 0)
				
					// Resolve invalid texture
					resolve(Logo.INVALID_TEXTURE);
				
				// Otherwise
				else {
			
					// Create image
					var image = new Image();
					
					// Image load event
					$(image).on("load", function() {
					
						// Check if image has dimensions that aren't powers of two
						if((image["width"] & (image["width"] - 1)) !== 0 || (image["height"] & (image["height"] - 1)) !== 0) {
						
							// Get new dimensions to make its dimensions powers of two
							var canvasWidth = Math.pow(2, Math.ceil(Math.log(image["width"]) / Math.log(2)));
							var canvasHeight = Math.pow(2, Math.ceil(Math.log(image["height"]) / Math.log(2)));
						
							// Create canvas and get its context
							var context = $("<canvas></canvas>").attr({
							
								// Width
								"width": canvasWidth.toFixed(),
								
								// Height
								"height": canvasHeight.toFixed()
							
							}).get(0).getContext("2d");
							
							// Smooth image when resizing
							context["imageSmoothingEnabled"] = true;
							context["mozImageSmoothingEnabled"] = true;
							context["webkitImageSmoothingEnabled"] = true;
							context["msImageSmoothingEnabled"] = true;
							context["imageSmoothingQuality"] = "high";
							
							// Draw image on canvas
							context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
							
							// Get the image's data from the canvas
							var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight)["data"];
							
							// Create texture
							var texture = self.gl.createTexture();
							
							// Append texture to list of textures
							self.textures.push(texture);
							
							// Bind texture
							var maxTextureUnit = self.gl.getParameter(self.gl["MAX_COMBINED_TEXTURE_IMAGE_UNITS"]);
							self.gl.activeTexture(self.gl["TEXTURE0"] + maxTextureUnit - 1);
							self.gl.bindTexture(self.gl["TEXTURE_2D"], texture);
							
							// Set texture wrapping
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_WRAP_S"], self.gl["CLAMP_TO_EDGE"]);
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_WRAP_T"], self.gl["CLAMP_TO_EDGE"]);
							
							// Set texture filtering
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_MIN_FILTER"], self.gl["LINEAR_MIPMAP_LINEAR"]);
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_MAG_FILTER"], self.gl["LINEAR"]);
							
							// Set max anisotropy
							if(typeof self.gl["TEXTURE_MAX_ANISOTROPY_EXT"] !== "undefined")
								self.gl.texParameterf(self.gl["TEXTURE_2D"], self.gl["TEXTURE_MAX_ANISOTROPY_EXT"], self.anisotropy);
							
							// Create texture
							self.gl.texImage2D(self.gl["TEXTURE_2D"], 0, self.gl["RGBA"], canvasWidth, canvasHeight, 0, self.gl["RGBA"], self.gl["UNSIGNED_BYTE"], new Uint8Array(imageData));
						}
						
						// Otherwise
						else {
						
							// Create texture
							var texture = self.gl.createTexture();
							
							// Append texture to list of textures
							self.textures.push(texture);
							
							// Bind texture
							var maxTextureUnit = self.gl.getParameter(self.gl["MAX_COMBINED_TEXTURE_IMAGE_UNITS"]);
							self.gl.activeTexture(self.gl["TEXTURE0"] + maxTextureUnit - 1);
							self.gl.bindTexture(self.gl["TEXTURE_2D"], texture);
							
							// Set texture wrapping
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_WRAP_S"], self.gl["CLAMP_TO_EDGE"]);
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_WRAP_T"], self.gl["CLAMP_TO_EDGE"]);
							
							// Set texture filtering
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_MIN_FILTER"], self.gl["LINEAR_MIPMAP_LINEAR"]);
							self.gl.texParameteri(self.gl["TEXTURE_2D"], self.gl["TEXTURE_MAG_FILTER"], self.gl["LINEAR"]);
							
							// Set max anisotropy
							if(typeof self.gl["TEXTURE_MAX_ANISOTROPY_EXT"] !== "undefined")
								self.gl.texParameterf(self.gl["TEXTURE_2D"], self.gl["TEXTURE_MAX_ANISOTROPY_EXT"], self.anisotropy);
						
							// Create texture
							self.gl.texImage2D(self.gl["TEXTURE_2D"], 0, self.gl["RGBA"], self.gl["RGBA"], self.gl["UNSIGNED_BYTE"], image);
						}
						
						// Create mipmaps
						self.gl.generateMipmap(self.gl["TEXTURE_2D"]);
						
						// Resolve texture
						resolve(texture);
					
					// Image error event
					}).on("error", function(error) {
					
						// Reject error
						reject(error);
					});
					
					// Set image source
					image["src"] = file;
				}
			});
		}
		
		// Create directional light
		static createDirectionalLight(direction, ambientColor, diffuseColor, specularColor) {
		
			// Return directional light
			return {
			
				// Type
				"Type": Logo.DIRECTIONAL_LIGHT_TYPE,
				
				// Direction
				"Direction": direction,
				
				// Ambient color
				"Ambient Color": ambientColor,
				
				// Diffuse color
				"Diffuse Color": diffuseColor,
				
				// Specular color
				"Specular Color": specularColor
			};
		}
		
		// Create point light
		static createPointLight(position, constantAttenuationFactor, linearAttenuationFactor, quadraticAttenuationFactor, ambientColor, diffuseColor, specularColor) {
		
			// Return point light
			return {
			
				// Type
				"Type": Logo.POINT_LIGHT_TYPE,
				
				// Position
				"Position": position,
				
				// Constant attenuation factor
				"Constant Attenuation Factor": constantAttenuationFactor,
				
				// Linear attenuation factor
				"Linear Attenuation Factor": linearAttenuationFactor,
				
				// Quadratic attenuation factor
				"Quadratic Attenuation Factor": quadraticAttenuationFactor,
				
				// Ambient color
				"Ambient Color": ambientColor,
				
				// Diffuse color
				"Diffuse Color": diffuseColor,
				
				// Specular color
				"Specular Color": specularColor
			};
		}
		
		// Create spot light
		static createSpotLight(position, direction, constantAttenuationFactor, linearAttenuationFactor, quadraticAttenuationFactor, innerCutOffAngle, outerCutOffAngle, ambientColor, diffuseColor, specularColor) {
		
			// Return spot light
			return {
			
				// Type
				"Type": Logo.SPOT_LIGHT_TYPE,
				
				// Position
				"Position": position,
				
				// Direction
				"Direction": direction,
				
				// Constant attenuation factor
				"Constant Attenuation Factor": constantAttenuationFactor,
				
				// Linear attenuation factor
				"Linear Attenuation Factor": linearAttenuationFactor,
				
				// Quadratic attenuation factor
				"Quadratic Attenuation Factor": quadraticAttenuationFactor,
				
				// Inner cut off angle
				"Inner Cut Off Angle": Math.cos(glMatrix["glMatrix"].toRadian(innerCutOffAngle)),
				
				// Outer cut off angle
				"Outer Cut Off Angle": Math.cos(glMatrix["glMatrix"].toRadian(outerCutOffAngle)),
				
				// Ambient color
				"Ambient Color": ambientColor,
				
				// Diffuse color
				"Diffuse Color": diffuseColor,
				
				// Specular color
				"Specular Color": specularColor
			};
		}
		
		// Bounding boxes collide
		static boundingBoxesCollide(minimumXOne, minimumYOne, maximumXOne, maximumYOne, minimumXTwo, minimumYTwo, maximumXTwo, maximumYTwo) {
		
			// Check if an X axis collision occurred
			if((minimumXOne <= minimumXTwo && maximumXOne >= minimumXTwo) || (minimumXOne <= maximumXTwo && maximumXOne >= maximumXTwo) || (minimumXOne >= minimumXTwo && maximumXOne <= maximumXTwo))
			
				// Check if a Y axis collision occurred
				if((minimumYOne <= minimumYTwo && maximumYOne >= minimumYTwo) || (minimumYOne <= maximumYTwo && maximumYOne >= maximumYTwo) || (minimumYOne >= minimumYTwo && maximumYOne <= maximumYTwo))
				
					// Return true
					return true;
			
			// Return false
			return false;
		}
	
		// No WebGL
		static get NO_WEBGL() {
		
			// Return no WebGL
			return null;
		}
		
		// No WebGL extension
		static get NO_WEBGL_EXTENSION() {
		
			// Return no WebGL extension
			return null;
		}
		
		// Timing frames per second
		static get TIMING_FRAMES_PER_SECOND() {
		
			// Return timing frames per second
			return 60;
		}
		
		// No shader program
		static get NO_SHADER_PROGRAM() {
		
			// Return no shader program
			return null;
		}
		
		// Field of view
		static get FIELD_OF_VIEW() {
		
			// Return field of view
			return 70;
		}
		
		// Small height field of view
		static get SMALL_HEIGHT_FIELD_OF_VIEW() {
		
			// Return small height field of view
			return 55;
		}
		
		// Small height threshold
		static get SMALL_HEIGHT_THRESHOLD() {
		
			// Return small height threshold
			return 300;
		}
		
		// Near plane
		static get NEAR_PLANE() {
		
			// Return near plane
			return 10;
		}
		
		// Far plane
		static get FAR_PLANE() {
		
			// Return far plane
			return 50;
		}
		
		// Default anisotropy
		static get DEFAULT_ANISOTROPY() {
		
			// Return default anisotropy
			return 1;
		}
		
		// Max anisotropy
		static get MAX_ANISOTROPY() {
		
			// Return max anisotropy
			return 4;
		}
		
		// Max number of lights
		static get MAX_NUMBER_OF_LIGHTS() {
		
			// Return max lights
			return 1;
		}
		
		// Invalid light type
		static get INVALID_LIGHT_TYPE() {
		
			// Return invalid light type
			return 0;
		}
		
		// Directional light type
		static get DIRECTIONAL_LIGHT_TYPE() {
		
			// Return directional light type
			return Logo.INVALID_LIGHT_TYPE + 1;
		}
		
		// Point light type
		static get POINT_LIGHT_TYPE() {
		
			// Return point light type
			return Logo.DIRECTIONAL_LIGHT_TYPE + 1;
		}
		
		// Spot light type
		static get SPOT_LIGHT_TYPE() {
		
			// Return spot light type
			return Logo.POINT_LIGHT_TYPE + 1;
		}
		
		// Shader constants
		static get SHADER_CONSTANTS() {
		
			// Return invalid light type
			return "const int INVALID_LIGHT_TYPE = " + Logo.INVALID_LIGHT_TYPE + ";\n" +
			
			// Directional light type
			"const int DIRECTIONAL_LIGHT_TYPE = " + Logo.DIRECTIONAL_LIGHT_TYPE + ";\n" +
			
			// Point light type
			"const int POINT_LIGHT_TYPE = " + Logo.POINT_LIGHT_TYPE + ";\n" +
			
			// Spot light type
			"const int SPOT_LIGHT_TYPE = " + Logo.SPOT_LIGHT_TYPE + ";\n" +
			
			// Max number of lights
			"const int MAX_NUMBER_OF_LIGHTS = " + Logo.MAX_NUMBER_OF_LIGHTS + ";";
		}
		
		// No texture index
		static get NO_TEXTURE_INDEX() {
		
			// Return no texture index
			return -1;
		}
		
		// Invalid texture
		static get INVALID_TEXTURE() {
		
			// Return invalid texture
			return null;
		}
		
		// No pointer state
		static get NO_POINTER_STATE() {
		
			// Return no pointer state
			return null;
		}
		
		// Logo percent size
		static get LOGO_PERCENT_SIZE() {
		
			// Return logo percent size
			return {
			
				// Minimum X
				"Minimum X": 0.212,
				
				// Minimum Y
				"Minimum Y": 0.360,
				
				// Maximum X
				"Maximum X": 0.794,
				
				// Maximum Y
				"Maximum Y": 0.646
			};
		}
		
		// Velocity applied scale factor
		static get VELOCITY_APPLIED_SCALE_FACTOR() {
		
			// Return velocity applied scale factor
			return 0.0012;
		}
		
		// Velocity degrade scale factor
		static get VELOCITY_DEGRADE_SCALE_FACTOR() {
		
			// Return velocity degrade scale factor
			return 0.06;
		}
		
		// Minimum velocity threshold
		static get MINIMUM_VELOCITY_THRESHOLD() {
		
			// Return minimum velocity threshold
			return 0.01;
		}
		
		// Vertex shader file location
		static get VERTEX_SHADER_FILE_LOCATION() {
		
			// Return vertex shader file location
			return "./shaders/logo.vert";
		}
		
		// Fragment shader file location
		static get FRAGMENT_SHADER_FILE_LOCATION() {
		
			// Return fragment shader file location
			return "./shaders/logo.frag";
		}
		
		// Model file location
		static get MODEL_FILE_LOCATION() {
		
			// Return model file location
			return "./models/mwc.json";
		}
		
		// Minimum frame duration variation
		static get MINIMUM_FRAME_DURATION_VARIATION() {
		
			// Return minimum frame duration variation
			return -2;
		}
		
		// Maximum frame duration variation
		static get MAXIMUM_FRAME_DURATION_VARIATION() {
		
			// Return maximum frame duration variation
			return 2;
		}
		
		// Initial X velocity
		static get INITIAL_X_VELOCITY() {
		
			// Return initial X velocity
			return 13500;
		}
		
		// Initial position
		static get INITIAL_POSITION() {
		
			// Return initial position
			return glMatrix["vec3"].fromValues(0, 0, -30);
		}
		
		// Initial orientation
		static get INITIAL_ORIENTATION() {
		
			// Return initial orientation
			return glMatrix["quat"].normalize(glMatrix["quat"].create(), glMatrix["quat"].setAxisAngle(glMatrix["quat"].create(), glMatrix["vec3"].fromValues(0, 1, 0), glMatrix["glMatrix"].toRadian(-90)));
		}
		
		// Pointer velocity scale factor
		static get POINTER_VELOCITY_SCALE_FACTOR() {
		
			// Return pointer velocity scale factor
			return 0.6;
		}
		
		// Force redraw frame duration variation threshold
		static get FORCE_REDRAW_FRAME_DURATION_VARIATION_THRESHOLD() {
		
			// Return force redraw frame duration variation threshold
			return 20;
		}
		
		// Force redraw number of times
		static get FORCE_REDRAW_NUMBER_OF_TIMES() {
		
			// Return force redraw number of times
			return 10;
		}
		
		// Force redraw interval seconds
		static get FORCE_REDRAW_INTERVAL_SECONDS() {
		
			// Return force redraw interval seconds
			return 1;
		}
		
		// Distance ratio to screen width
		static get DISTANCE_RATIO_TO_SCREEN_WIDTH() {
		
			// Return distance ratio to screen width
			return 600;
		}
		
		// Distance ratio to screen height
		static get DISTANCE_RATIO_TO_SCREEN_HEIGHT() {
		
			// Return distance ratio to screen height
			return 600;
		}
		
		// Initial show delay milliseconds
		static get INITIAL_SHOW_DELAY_MILLISECONDS() {
		
			// Return initial show delay milliseconds
			return 70;
		}
		
		// No restore context frame
		static get NO_RESTORE_CONTEXT_FRAME() {
		
			// Return no context frame
			return null;
		}
		
		// No close timeout
		static get NO_CLOSE_TIMEOUT() {
		
			// Return no close timeout
			return null;
		}
		
		// Close if not restored milliseconds
		static get CLOSE_IF_NOT_RESTORED_MILLISECONDS() {
		
			// Return close if not restored milliseconds
			return 50;
		}
		
		// Tetris rotation threshold
		static get TETRIS_ROTATION_THRESHOLD() {
		
			// Return Tetris rotation threshold
			return 180 * 3;
		}
}


// Main function

// Set global object's logo
globalThis["Logo"] = Logo;
