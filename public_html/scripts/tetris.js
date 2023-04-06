// Use strict
"use strict";


// Classes

// Tetris class
class Tetris {

	// Public
	
		// Constructor
		constructor(application, message, wakeLock) {
		
			// Set application
			this.application = application;
		
			// Set message
			this.message = message;
			
			// Set wake lock
			this.wakeLock = wakeLock;
		
			// Get Tetris display
			this.tetrisDisplay = $("section.tetris");
			
			// Get body display
			this.bodyDisplay = $("body");
			
			// Get canvas
			this.canvas = this.tetrisDisplay.find("canvas").get(0);
			
			// Get context
			this.context = this.canvas.getContext("2d");
			
			// Reset
			this.reset();
			
			// Set self
			var self = this;
			
			// Window resize event
			$(window).on("resize", function() {
			
				// Check if running
				if(self.running === true) {
			
					// Update size
					self.updateSize();
					
					// Draw
					self.draw();
				}
			});
			
			// Document key down event
			$(document).on("keydown", function(event) {
			
				// Check if running and not game over
				if(self.running === true && self.gameOver === false) {
			
					// Check which key was pressed
					switch(event["which"]) {
					
						// Key left
						case Tetris.KEY_LEFT:
						
							// Move left
							self.moveLeft();
						
							// Break
							break;
					
						// Key up
						case Tetris.KEY_UP:
						
							// Rotate left
							self.rotateLeft();
						
							// Break
							break;
						
						// Key right
						case Tetris.KEY_RIGHT:
						
							// Move right
							self.moveRight();
						
							// Break
							break;
						
						// Key down
						case Tetris.KEY_DOWN:
						
							// Rotate right
							self.rotateRight();
						
							// Break
							break;
					}
				}
			});
			
			// Initialize start touch position
			var startTouchPositionX = Tetris.NO_TOUCH_POSITION;
			var startTouchPositionY = Tetris.NO_TOUCH_POSITION;
			
			// Initialize last touch position
			var lastTouchPositionX = Tetris.NO_TOUCH_POSITION;
			var lastTouchPositionY = Tetris.NO_TOUCH_POSITION;
			
			// Document touch start event
			$(document).on("touchstart", function(event) {
			
				// Check if running and not game over
				if(self.running === true && self.gameOver === false) {
			
					// Set start touch position
					startTouchPositionX = event["touches"][0]["screenX"];
					startTouchPositionY = event["touches"][0]["screenY"];
					
					// Set last touch position
					lastTouchPositionX = event["touches"][0]["screenX"];
					lastTouchPositionY = event["touches"][0]["screenY"];
				}
				
			// Document touch move event
			}).on("touchmove", function() {
			
				// Check if running and not game over
				if(self.running === true && self.gameOver === false) {
			
					// Set last touch position
					lastTouchPositionX = event["touches"][0]["screenX"];
					lastTouchPositionY = event["touches"][0]["screenY"];
				}
			
			// Document touch end event
			}).on("touchend", function(event) {
			
				// Check if running and not game over
				if(self.running === true && self.gameOver === false) {
				
					// Check if start position exists
					if(startTouchPositionX !== Tetris.NO_TOUCH_POSITION && startTouchPositionY !== Tetris.NO_TOUCH_POSITION) {
			
						// Get swipe length
						var swipeLengthX = (lastTouchPositionX - startTouchPositionX) / screen["width"];
						var swipeLengthY = (lastTouchPositionY - startTouchPositionY) / screen["height"];
						
						// Check if swipe right
						if(swipeLengthX >= Tetris.SWIPE_SCREEN_LENGTH_THRESHOLD_PERCENT) {
						
							// Move right
							self.moveRight();
						}
						
						// Otherwise check if swipe left
						else if(swipeLengthX <= -Tetris.SWIPE_SCREEN_LENGTH_THRESHOLD_PERCENT) {
						
							// Move left
							self.moveLeft();
						}
						
						// Otherwise check if swipe down
						else if(swipeLengthY >= Tetris.SWIPE_SCREEN_LENGTH_THRESHOLD_PERCENT) {
						
							// Rotate right
							self.rotateRight();
						}
						
						// Otherwise check if swipe up
						else if(swipeLengthY <= -Tetris.SWIPE_SCREEN_LENGTH_THRESHOLD_PERCENT) {
						
							// Rotate left
							self.rotateLeft();
						}
					}
				}
				
				// Reset start touch position
				startTouchPositionX = Tetris.NO_TOUCH_POSITION;
				startTouchPositionY = Tetris.NO_TOUCH_POSITION;
			
			// Document touch cancel event
			}).on("touchcancel", function(event) {
			
				// Reset start touch position
				startTouchPositionX = Tetris.NO_TOUCH_POSITION;
				startTouchPositionY = Tetris.NO_TOUCH_POSITION;
			});
			
			// Initialize last timestamp
			var lastTimestamp = 0;
			
			// On frame
			var onFrame = function(timestamp) {
			
				// Check if running and not game over
				if(self.running === true) {
				
					// Run
					self.run(timestamp - lastTimestamp);
					
					// Draw
					self.draw();
				}
				
				// Update last timestamp
				lastTimestamp = timestamp;
				
				// Request animation frame
				requestAnimationFrame(onFrame);
			};
			
			// On frame
			onFrame(0);
		}
		
		// Show
		show() {
		
			// Keep device awake and catch errors
			this.wakeLock.preventLock().catch(function(error) {
			
			});
		
			// Prevent showing messages
			this.message.prevent();
			
			// Blur focus
			$(":focus").blur();
			
			// Check if application's create display is shown
			if(this.application.isCreateDisplayShown() === true) {
			
				// Disable tabbing to everything in application's create display and disable everything in application's create display
				this.application.createDisplay.find("*").disableTab().disable();
			}
			
			// Otherwise check if application's unlock display is shown
			else if(this.application.isUnlockDisplayShown() === true) {
			
				// Disable tabbing to everything in application's unlock display and disable everything in application's unlock display
				this.application.unlockDisplay.find("*").disableTab().disable();
			}
			
			// Show loading
			this.application.showLoading();
			
			// Update size
			this.updateSize();
			
			// Draw
			this.draw();
		
			// Show Tetris display
			this.tetrisDisplay.removeClass("hide");
			
			// Set that body display is showing Tetris
			this.bodyDisplay.addClass("tetris");
			
			// Set self
			var self = this;
			
			// Tetris display transition end or timeout event
			this.tetrisDisplay.transitionEndOrTimeout(function() {
			
				// Hide loading
				self.application.hideLoading();
				
				// Set running
				self.running = true;
				
			}, "opacity");
		}
		
		// Is shown
		isShown() {
		
			// Return if Tetris display is shown
			return this.tetrisDisplay.hasClass("hide") === false;
		}
	
	// Private
	
		// Hide
		hide() {
		
			// Show loading
			this.application.showLoading();
			
			// Hide Tetris display
			this.tetrisDisplay.addClass("hide");
			
			// Set self
			var self = this;
			
			// Tetris display transition end or timeout event
			this.tetrisDisplay.transitionEndOrTimeout(function() {
			
				// Set that body display isn't showing Tetris
				self.bodyDisplay.removeClass("tetris");
		
				// Reset
				self.reset();
				
				// Allow device to sleep and catch errors
				self.wakeLock.allowLock().catch(function(error) {
				
				// Finally
				}).finally(function() {
				
					// Hide loading
					self.application.hideLoading();
					
					// Check if application's create display is shown
					if(self.application.isCreateDisplayShown() === true) {
					
						// Enable tabbing to everything in application's create display and enable everything in application's create display
						self.application.createDisplay.find("*").enableTab().enable();
					}
					
					// Otherwise check if application's unlock display is shown
					else if(self.application.isUnlockDisplayShown() === true) {
					
						// Enable tabbing to everything in application's unlock display and enable everything in application's unlock display
						self.application.unlockDisplay.find("*").enableTab().enable();
					}
					
					// Allow showing messages
					self.message.allow();
				});
			}, "opacity");
		}
		
		// Update size
		updateSize() {
		
			// Remove canvas's width and height
			$(this.canvas).height("").width("");
			
			// Check if canvas's width can't be equal to the height's ratio
			if(this.canvas["clientWidth"] < this.canvas["clientHeight"] * Tetris.WIDTH_TO_HEIGHT_RATIO) {
			
				// Update canvas internal height
				this.canvas["height"] = this.canvas["clientWidth"] / Tetris.WIDTH_TO_HEIGHT_RATIO;
			}
			
			// Otherwise
			else {
		
				// Update canvas internal height
				this.canvas["height"] = this.canvas["clientHeight"];
			}
			
			// Set canvas's internal width
			this.canvas["width"] = this.canvas["height"] * Tetris.WIDTH_TO_HEIGHT_RATIO;
			
			// Set canvas's width and height
			$(this.canvas).height(this.canvas["height"]).width(this.canvas["width"]);
		}
		
		// Draw
		draw() {
		
			// Go through all heights of the tetromino's orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"]; ++i) {
			
				// Go through all widths of the tetromino's orientation height
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"]; ++j) {
				
					// Check of position exists in the field
					if(this.positionX + j >= 0 && this.positionX + j < Tetris.FIELD_WIDTH && this.positionY + i >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
					
						// Check if tetromino exists at the position
						if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
				
							// Set field at the position to the tetromino
							this.field[this.positionX + j][this.positionY + i] = true;
						}
					}
				}
			}
		
			// Clear
			this.context.clearRect(0, 0, this.canvas["width"], this.canvas["height"]);
		
			// Set fill color
			this.context["fillStyle"] = Tetris.FILL_COLOR;
			this.context["strokeStyle"] = Tetris.FILL_COLOR;
			
			// Get unit width and height
			var unitWidth = this.canvas["width"] / (Tetris.FIELD_WIDTH + Tetris.BORDER_WIDTH * 2);
			var unitHeight = this.canvas["height"] / (Tetris.FIELD_HEIGHT + Tetris.BORDER_HEIGHT);
			
			// Get corner angle radians
			var cornerAngleRadians = Tetris.getUnitCornerAngleRadians(unitWidth);
			
			// Go through all units in the field that can have a unit to its right
			for(var i = 0; i < Tetris.FIELD_WIDTH - 1; ++i) {
			
				for(var j = 0; j < Tetris.FIELD_HEIGHT; ++j) {
				
					// Check if unit is set and the unit to its right is set
					if(this.field[i][j] === true && this.field[i + 1][j] === true) {
					
						// Draw rectangle
						this.context.fillRect(unitWidth * Tetris.BORDER_WIDTH + unitWidth * i + unitWidth / 2 + cornerAngleRadians, unitHeight * j + cornerAngleRadians, unitWidth - cornerAngleRadians * 2, unitHeight - cornerAngleRadians * 2);
						
						// Mask out top and bottom of rectangle
						this.context["globalCompositeOperation"] = "destination-out";
						
						this.drawUnit(unitWidth * Tetris.BORDER_WIDTH + unitWidth * i + unitWidth / 2, unitHeight * j - unitHeight / 2, unitWidth, unitHeight);
						this.drawUnit(unitWidth * Tetris.BORDER_WIDTH + unitWidth * i + unitWidth / 2, unitHeight * j + unitHeight / 2, unitWidth, unitHeight);
						
						this.context["globalCompositeOperation"] = "source-over";
					}
				}
			}
			
			// Go through all units in the field that can have a unit under it
			for(var i = 0; i < Tetris.FIELD_WIDTH; ++i) {
			
				for(var j = 0; j < Tetris.FIELD_HEIGHT - 1; ++j) {
				
					// Check if unit is set and the unit under it is set
					if(this.field[i][j] === true && this.field[i][j + 1] === true) {
					
						// Draw rectangle
						this.context.fillRect(unitWidth * Tetris.BORDER_WIDTH + unitWidth * i + cornerAngleRadians, unitHeight * j + unitHeight / 2 + cornerAngleRadians, unitWidth - cornerAngleRadians * 2, unitHeight - cornerAngleRadians * 2);
						
						// Mask out left and right of rectangle
						this.context["globalCompositeOperation"] = "destination-out";
						
						this.drawUnit(unitWidth * Tetris.BORDER_WIDTH + unitWidth * i + unitWidth / 2, unitHeight * j + unitHeight / 2, unitWidth, unitHeight);
						this.drawUnit(unitWidth * Tetris.BORDER_WIDTH + unitWidth * i - unitWidth / 2, unitHeight * j + unitHeight / 2, unitWidth, unitHeight);
						
						this.context["globalCompositeOperation"] = "source-over";
					}
				}
			}
			
			// Go through all units in the field
			for(var i = 0; i < Tetris.FIELD_WIDTH; ++i) {
			
				for(var j = 0; j < Tetris.FIELD_HEIGHT; ++j) {
				
					// Check if unit is set
					if(this.field[i][j] === true) {
					
						// Draw unit
						this.context["globalCompositeOperation"] = "destination-over";
						
						this.drawUnit(unitWidth * Tetris.BORDER_WIDTH + unitWidth * i, unitHeight * j, unitWidth, unitHeight);
						
						this.context["globalCompositeOperation"] = "source-over";
					}
				}
			}
			
			// Draw Left border
			this.context.fillRect(0, 0, unitWidth * Tetris.BORDER_WIDTH, this.canvas["height"]);
			
			// Draw right border
			this.context.fillRect(this.canvas["width"] - unitWidth * Tetris.BORDER_WIDTH, 0, unitWidth * Tetris.BORDER_WIDTH, this.canvas["height"]);
			
			// Draw bottom border
			this.context.fillRect(0, this.canvas["height"] - unitHeight * Tetris.BORDER_HEIGHT, this.canvas["width"], unitHeight * Tetris.BORDER_HEIGHT);
			
			// Go through all heights of the tetromino's orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"]; ++i) {
			
				// Go through all widths of the tetromino's orientation height
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"]; ++j) {
				
					// Check of position exists in the field
					if(this.positionX + j >= 0 && this.positionX + j < Tetris.FIELD_WIDTH && this.positionY + i >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
					
						// Check if tetromino exists at the position
						if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
				
							// Remove field at the position to the tetromino
							this.field[this.positionX + j][this.positionY + i] = false;
						}
					}
				}
			}
		}
		
		// Reset
		reset() {
		
			// Set score to zero
			this.score = 0;
		
			// Set running to false;
			this.running = false;
			
			// Set run time to zero
			this.runTime = 0;
			
			// Set last move time to zero
			this.lastMoveTime = 0;
			
			// Set game over time to zero
			this.gameOverTime = 0;
			
			// Set move time milliseconds to the initial move speed
			this.moveTimeMilliseconds = Tetris.INITIAL_MOVE_SPEED_MILLISECONDS;
			
			// Set lines cleared to zero
			this.linesCleared = 0;
			
			// Set game over to false
			this.gameOver = false;
			
			// Set game over row
			this.gameOverRow = Tetris.FIELD_HEIGHT - 1;
			
			// Initialize field
			this.field = new Array(Tetris.FIELD_WIDTH);
			
			// Go through all units in field width
			for(var i = 0; i < Tetris.FIELD_WIDTH; ++i) {
			
				// Initialize field width
				this.field[i] = new Array(Tetris.FIELD_HEIGHT);
				
				// Go through all units in field height
				for(var j = 0; j < Tetris.FIELD_HEIGHT; ++j) {
				
					// Initialize field height
					this.field[i][j] = false;
				}
			}
			
			// Set random tetromino
			this.tetromino = Object.keys(Tetris.TETROMINOES)[Common.randomNumber(0, Object.keys(Tetris.TETROMINOES)["length"] - 1)];
			
			// Set random orientation
			this.orientation = Common.randomNumber(0, Tetris.TETROMINOES[this.tetromino]["length"] - 1);
			
			// Initialize starting offset found
			var startingOffsetFound = false;
			
			// Go through all rows in the orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation][0]["length"] && startingOffsetFound === false; ++i) {
			
				// Go through all columns in the orientation
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && startingOffsetFound === false; ++j) {
				
					// Check if unit at the orientation row and column is set
					if(Tetris.TETROMINOES[this.tetromino][this.orientation][j][i] === true) {
					
						// Set starting offset
						var startingOffset = i;
					
						// Set starting offset found
						startingOffsetFound = true;
					}
				}
			}
			
			// Initialize ending offset found
			var endingOffsetFound = false;
			
			// Go through all rows in the orientation
			for(var i = Tetris.TETROMINOES[this.tetromino][this.orientation][0]["length"] - 1; i >= 0 && endingOffsetFound === false; --i) {
			
				// Go through all columns in the orientation
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && endingOffsetFound === false; ++j) {
				
					// Check if unit at the orientation row and column is set
					if(Tetris.TETROMINOES[this.tetromino][this.orientation][j][i] === true) {
					
						// Set ending offset
						var endingOffset = i;
					
						// Set ending offset found
						endingOffsetFound = true;
					}
				}
			}
			
			// Set additional offset
			var additionalOffset = (this.tetromino === "I" && this.orientation === 1) || (this.tetromino === "S" && this.orientation === 0) || (this.tetromino === "Z" && this.orientation === 2) || (this.tetromino === "L" && this.orientation === 3) || (this.tetromino === "J" && this.orientation === 3) || (this.tetromino === "T" && this.orientation === 2);
			
			// Set position X to be at the center
			this.positionX = Math.floor((Tetris.FIELD_WIDTH - (endingOffset - startingOffset + 1)) / 2) - startingOffset + ((additionalOffset === true) ? 1 : 0);
			
			// Initialize highest row found
			var highestRowFound = false;
			
			// Go through all rows in the tetromino's orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && highestRowFound === false; ++i) {
			
				// Go through all units in the row
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && highestRowFound === false; ++j) {
				
					// Check if unit is set
					if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
					
						// Set position Y so that this row is on the top row
						this.positionY = -i;
						
						// Set highest row found
						highestRowFound = true;
					}
				}
			}
			
			// Initialize collision occurred
			var collisionOccurred = false;
			
			// Loop until a collision doesn't occur
			do {
			
				// Clear collision occurred
				collisionOccurred = false;
			
				// Go through all heights of the tetromino's orientation
				for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && collisionOccurred === false; ++i) {
				
					// Go through all widths of the tetromino's orientation height
					for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && collisionOccurred === false; ++j) {
					
						// Check of position exists in the field
						if(this.positionX + j >= 0 && this.positionX + j < Tetris.FIELD_WIDTH && this.positionY + i >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
						
							// Check if tetromino exists at the position and the position is set
							if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true && this.field[this.positionX + j][this.positionY + i] === true) {
							
								// Move tetromino up
								--this.positionY;
								
								// Set collision occurred
								collisionOccurred = true;
							}
						}
					}
				}
			} while(collisionOccurred === true);
		}
		
		// Run
		run(deltaTime) {
		
			// Update run time
			this.runTime += deltaTime;
		
			// Check if not game over
			if(this.gameOver === false) {
		
				// Check if time to move
				if(this.runTime - this.lastMoveTime >= this.moveTimeMilliseconds) {
				
					// Update last move time
					this.lastMoveTime = this.runTime;
				
					// Initialize done moving
					var doneMoving = false;
				
					// Go through all heights of the tetromino's orientation
					for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && doneMoving === false; ++i) {
					
						// Go through all widths of the tetromino's orientation height
						for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && doneMoving === false; ++j) {
						
							// Check of position exists in the field
							if(this.positionX + j >= 0 && this.positionX + j < Tetris.FIELD_WIDTH && this.positionY + i + 1 >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
							
								// Set tetromino exists at the position and the position under it is the floor or is another tetromino
								if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true && (this.positionY + i + 1 === Tetris.FIELD_HEIGHT || this.field[this.positionX + j][this.positionY + i + 1] === true)) {
								
									// Set done moving
									doneMoving = true;
								}
							}
						}
					}
					
					// Check if not done moving
					if(doneMoving === false) {
					
						// Update position Y
						++this.positionY;
					}
					
					// Otherwise
					else {
					
						// Go through all heights of the tetromino's orientation
						for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && this.gameOver === false; ++i) {
						
							// Go through all widths of the tetromino's orientation height
							for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && this.gameOver === false; ++j) {
							
								// Check of position is above the field
								if(this.positionY + i < 0) {
								
									// Check if tetromino exists at the position
									if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
									
										// Set game over
										this.gameOver = true;
										
										// Set game over time
										this.gameOverTime = this.runTime;
									}
								}
							}
						}
						
						// Check if not game over
						if(this.gameOver === false) {
					
							// Go through all heights of the tetromino's orientation
							for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"]; ++i) {
							
								// Go through all widths of the tetromino's orientation height
								for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"]; ++j) {
								
									// Check of position exists in the field
									if(this.positionX + j >= 0 && this.positionX + j < Tetris.FIELD_WIDTH && this.positionY + i >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
									
										// Check if tetromino exists at the position
										if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
								
											// Set field at the position to the tetromino
											this.field[this.positionX + j][this.positionY + i] = true;
										}
									}
								}
							}
							
							// Initialize lines cleared
							var linesCleared = 0;
							
							// Go through all rows in the field
							for(var i = 0; i < Tetris.FIELD_HEIGHT; ++i) {
							
								for(var j = 0; j < Tetris.FIELD_WIDTH; ++j) {
								
									// Check if unit isn't set
									if(this.field[j][i] === false) {
									
										// Break
										break;
									}
									
									// Otherwise check if at the last unit in the row
									else if(j === Tetris.FIELD_WIDTH - 1) {
									
										// Increment lines cleared
										++linesCleared;
									
										// Go through all rows at and above the row
										for(var k = i; k >= 0; --k) {
									
											for(var l = 0; l < Tetris.FIELD_WIDTH; ++l) {
											
												// Check if at the top row
												if(k === 0) {
												
													// Set unit to false
													this.field[l][k] = false;
												}
												
												// Otherwise
												else {
											
													// Set unit to the one above it
													this.field[l][k] = this.field[l][k - 1];
												}
											}
										}
									}
								}
							}
							
							// Check if ten more lines were cleared
							if(Math.floor((this.linesCleared + linesCleared) / 10) > Math.floor(this.linesCleared / 10)) {
							
								// Update move speed
								this.moveTimeMilliseconds -= Tetris.MOVE_SPEED_CHANGE_MILLISECONDS;
								
								// Check if move speed is to fast
								if(this.moveTimeMilliseconds < Tetris.MINIMUM_MOVE_SPEED_MILLISECONDS) {
								
									// Set move speed to minimum move speed
									this.moveTimeMilliseconds = Tetris.MINIMUM_MOVE_SPEED_MILLISECONDS;
								}
							}
							
							// Update score
							this.score += linesCleared * linesCleared;
							
							// Update lines cleared
							this.linesCleared += linesCleared;
						
							// Set random tetromino
							this.tetromino = Object.keys(Tetris.TETROMINOES)[Common.randomNumber(0, Object.keys(Tetris.TETROMINOES)["length"] - 1)];
							
							// Set random orientation
							this.orientation = Common.randomNumber(0, Tetris.TETROMINOES[this.tetromino]["length"] - 1);
							
							// Initialize starting offset found
							var startingOffsetFound = false;
							
							// Go through all rows in the orientation
							for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation][0]["length"] && startingOffsetFound === false; ++i) {
							
								// Go through all columns in the orientation
								for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && startingOffsetFound === false; ++j) {
								
									// Check if unit at the orientation row and column is set
									if(Tetris.TETROMINOES[this.tetromino][this.orientation][j][i] === true) {
									
										// Set starting offset
										var startingOffset = i;
									
										// Set starting offset found
										startingOffsetFound = true;
									}
								}
							}
							
							// Initialize ending offset found
							var endingOffsetFound = false;
							
							// Go through all rows in the orientation
							for(var i = Tetris.TETROMINOES[this.tetromino][this.orientation][0]["length"] - 1; i >= 0 && endingOffsetFound === false; --i) {
							
								// Go through all columns in the orientation
								for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && endingOffsetFound === false; ++j) {
								
									// Check if unit at the orientation row and column is set
									if(Tetris.TETROMINOES[this.tetromino][this.orientation][j][i] === true) {
									
										// Set ending offset
										var endingOffset = i;
									
										// Set ending offset found
										endingOffsetFound = true;
									}
								}
							}
							
							// Set additional offset
							var additionalOffset = (this.tetromino === "I" && this.orientation === 1) || (this.tetromino === "S" && this.orientation === 0) || (this.tetromino === "Z" && this.orientation === 2) || (this.tetromino === "L" && this.orientation === 3) || (this.tetromino === "J" && this.orientation === 3) || (this.tetromino === "T" && this.orientation === 2);
							
							// Set position X to be at the center
							this.positionX = Math.floor((Tetris.FIELD_WIDTH - (endingOffset - startingOffset + 1)) / 2) - startingOffset + ((additionalOffset === true) ? 1 : 0);
							
							// Initialize highest row found
							var highestRowFound = false;
							
							// Go through all rows in the tetromino's orientation
							for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && highestRowFound === false; ++i) {
							
								// Go through all units in the row
								for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && highestRowFound === false; ++j) {
								
									// Check if unit is set
									if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
									
										// Set position Y so that this row is on the top row
										this.positionY = -i;
										
										// Set highest row found
										highestRowFound = true;
									}
								}
							}
							
							// Initialize collision occurred
							var collisionOccurred = false;
							
							// Loop until a collision doesn't occur
							do {
							
								// Clear collision occurred
								collisionOccurred = false;
							
								// Go through all heights of the tetromino's orientation
								for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && collisionOccurred === false; ++i) {
								
									// Go through all widths of the tetromino's orientation height
									for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && collisionOccurred === false; ++j) {
									
										// Check of position exists in the field
										if(this.positionX + j >= 0 && this.positionX + j < Tetris.FIELD_WIDTH && this.positionY + i >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
										
											// Check if tetromino exists at the position and the position is set
											if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true && this.field[this.positionX + j][this.positionY + i] === true) {
											
												// Move tetromino up
												--this.positionY;
												
												// Set collision occurred
												collisionOccurred = true;
											}
										}
									}
								}
							} while(collisionOccurred === true);
						}
					}
				}
			}
			
			// Otherwise
			else {
			
				// Check if time to show game over row
				if(this.runTime - this.gameOverTime >= Tetris.GAME_OVER_ROW_SPEED_MILLISECONDS) {
				
					// Update game over time
					this.gameOverTime = this.runTime;
					
					// Go through all units in field width
					for(var i = 0; i < Tetris.FIELD_WIDTH; ++i) {
					
						// Check if game over row exists in the field
						if(this.gameOverRow >= 0) {
					
							// Set field in game over row
							this.field[i][this.gameOverRow] = true;
						}
					}
					
					// Check if all game over rows have been shown
					if(this.gameOverRow === 0) {
					
						// Set self
						var self = this;
					
						// Set timeout
						setTimeout(function() {
					
							// Hide
							self.hide();
							
						}, Tetris.GAME_OVER_DELAY_HIDE_MILLISECONDS);
					}
					
					// Check if there are more game over rows
					if(this.gameOverRow >= 0) {
					
						// Update game over row
						--this.gameOverRow;
					}
				}
			}
		}
		
		// Draw unit
		drawUnit(x, y, width, height) {
		
			// Save state
			this.context.save();
			
			// Set translation
			this.context.translate(x + width / 2, y + height / 2);
			
			// Set rotation
			this.context.rotate(Tetris.UNIT_ANGLE_RADIANS);
			
			// Get corner angle radians
			var cornerAngleRadians = Tetris.getUnitCornerAngleRadians(width);
			
			// Check if masking out shape
			if(this.context["globalCompositeOperation"] === "destination-out") {
			
				// Scale width and height
				width *= Tetris.UNIT_MASK_DIMENSIONS_SCALE;
				height *= Tetris.UNIT_MASK_DIMENSIONS_SCALE;
			}
			
			// Otherwise
			else {
			
				// Scale width and height
				width *= Tetris.UNIT_DIMENSIONS_SCALE;
				height *= Tetris.UNIT_DIMENSIONS_SCALE;
			}
			
			// Draw path
			this.context.beginPath();
			this.context.moveTo(-width / 2 + cornerAngleRadians, -height / 2);
			
			this.context.lineTo(width / 2 - cornerAngleRadians, -height / 2);
			this.context.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + cornerAngleRadians);
			
			this.context.lineTo(width / 2, height / 2 - cornerAngleRadians);
			this.context.quadraticCurveTo(width / 2, height / 2, width / 2 - cornerAngleRadians, height / 2);
			
			this.context.lineTo(-width / 2 + cornerAngleRadians, height / 2);
			this.context.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - cornerAngleRadians);
			
			this.context.lineTo(-width / 2, -height / 2 + cornerAngleRadians);
			this.context.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + cornerAngleRadians, -height / 2);
			
			this.context.closePath();
			this.context.fill();
			
			// Restore state
			this.context.restore();
		}
		
		// Move left
		moveLeft() {
		
			// Initialize collision occurred
			var collisionOccurred = false;
		
			// Go through all heights of the tetromino's orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && collisionOccurred === false; ++i) {
			
				// Go through all widths of the tetromino's orientation height
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && collisionOccurred === false; ++j) {
				
					// Check if tetromino exists at the position
					if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
				
						// Check of position to the left doesn't exists in the field
						if(this.positionX + j - 1 < 0 || this.positionX + j - 1 >= Tetris.FIELD_WIDTH) {
						
							// Set collision occurred
							collisionOccurred = true;
						}
						
						// Otherwise check if the position exists in the field
						else if(this.positionY + i >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
						
							// Check if the position is set
							if(this.field[this.positionX + j - 1][this.positionY + i] === true) {
							
								// Set collision occurred
								collisionOccurred = true;
							}
						}
					}
				}
			}
		
			// Check if a collision didn't occur
			if(collisionOccurred === false) {
		
				// Update position X
				--this.positionX;
			}
		}
		
		// Move right
		moveRight() {
		
			// Initialize collision occurred
			var collisionOccurred = false;
		
			// Go through all heights of the tetromino's orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][this.orientation]["length"] && collisionOccurred === false; ++i) {
			
				// Go through all widths of the tetromino's orientation height
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][this.orientation][i]["length"] && collisionOccurred === false; ++j) {
				
					// Check if tetromino exists at the position
					if(Tetris.TETROMINOES[this.tetromino][this.orientation][i][j] === true) {
				
						// Check of position to the right doesn't exists in the field
						if(this.positionX + j + 1 < 0 || this.positionX + j + 1 >= Tetris.FIELD_WIDTH) {
						
							// Set collision occurred
							collisionOccurred = true;
						}
						
						// Otherwise check if the position exists in the field
						else if(this.positionY + i >= 0 && this.positionY + i < Tetris.FIELD_HEIGHT) {
						
							// Check if the position is set
							if(this.field[this.positionX + j + 1][this.positionY + i] === true) {
							
								// Set collision occurred
								collisionOccurred = true;
							}
						}
					}
				}
			}
		
			// Check if a collision didn't occur
			if(collisionOccurred === false) {
		
				// Update position X
				++this.positionX;
			}
		}
		
		// Rotate left
		rotateLeft() {
		
			// Check if can rotate left
			if(this.orientation > 0) {
			
				// Set new orientation
				var newOrientation = this.orientation - 1;
			}
			
			// Otherwise
			else {
			
				// Set new orientation
				var newOrientation = Tetris.TETROMINOES[this.tetromino]["length"] - 1;
			}
		
			// Initialize collision occurred
			var collisionOccurred = false;
		
			// Go through all heights of the new orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][newOrientation]["length"] && collisionOccurred === false; ++i) {
			
				// Go through all widths of the new orientation height
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][newOrientation][i]["length"] && collisionOccurred === false; ++j) {
				
					// Check if tetromino exists at the position
					if(Tetris.TETROMINOES[this.tetromino][newOrientation][i][j] === true) {
				
						// Check of position doesn't exists in the field
						if(this.positionX + j < 0 || this.positionX + j >= Tetris.FIELD_WIDTH || this.positionY + i >= Tetris.FIELD_HEIGHT) {
						
							// Set collision occurred
							collisionOccurred = true;
						}
						
						// Otherwise check if the position exists in the field
						else if(this.positionY + i >= 0) {
						
							// Check if the position is set
							if(this.field[this.positionX + j][this.positionY + i] === true) {
							
								// Set collision occurred
								collisionOccurred = true;
							}
						}
					}
				}
			}
		
			// Check if a collision didn't occur
			if(collisionOccurred === false) {
		
				// Update orientation
				this.orientation = newOrientation;
			}
		}
		
		// Rotate right
		rotateRight() {
		
			// Check if can rotate left
			if(this.orientation < Tetris.TETROMINOES[this.tetromino]["length"] - 1) {
			
				// Set new orientation
				var newOrientation = this.orientation + 1;
			}
			
			// Otherwise
			else {
			
				// Set new orientation
				var newOrientation = 0;
			}
		
			// Initialize collision occurred
			var collisionOccurred = false;
		
			// Go through all heights of the new orientation
			for(var i = 0; i < Tetris.TETROMINOES[this.tetromino][newOrientation]["length"] && collisionOccurred === false; ++i) {
			
				// Go through all widths of the new orientation height
				for(var j = 0; j < Tetris.TETROMINOES[this.tetromino][newOrientation][i]["length"] && collisionOccurred === false; ++j) {
				
					// Check if tetromino exists at the position
					if(Tetris.TETROMINOES[this.tetromino][newOrientation][i][j] === true) {
				
						// Check of position doesn't exists in the field
						if(this.positionX + j < 0 || this.positionX + j >= Tetris.FIELD_WIDTH || this.positionY + i >= Tetris.FIELD_HEIGHT) {
						
							// Set collision occurred
							collisionOccurred = true;
						}
						
						// Otherwise check if the position exists in the field
						else if(this.positionY + i >= 0) {
						
							// Check if the position is set
							if(this.field[this.positionX + j][this.positionY + i] === true) {
							
								// Set collision occurred
								collisionOccurred = true;
							}
						}
					}
				}
			}
		
			// Check if a collision didn't occur
			if(collisionOccurred === false) {
		
				// Update orientation
				this.orientation = newOrientation;
			}
		}
		
		// Unit corner angle radians
		static getUnitCornerAngleRadians(unitWidth) {
		
			// Return angle
			return glMatrix["glMatrix"].toRadian(unitWidth * 8);
		}
		
		// Fill color
		static get FILL_COLOR() {
		
			// Return fill color
			return "rgba(255, 255, 255, 1)";
		}
		
		// Field width
		static get FIELD_WIDTH() {
		
			// Return field width
			return 10;
		}
		
		// Field height
		static get FIELD_HEIGHT() {
		
			// Return field height
			return 20;
		}
		
		// Border width
		static get BORDER_WIDTH() {
		
			// Return border width
			return 1;
		}
		
		// Border height
		static get BORDER_HEIGHT() {
		
			// Return border height
			return 1;
		}
		
		// Width to height ratio
		static get WIDTH_TO_HEIGHT_RATIO() {
		
			// Return width to height ratio
			return (Tetris.FIELD_WIDTH + Tetris.BORDER_WIDTH * 2) / (Tetris.FIELD_HEIGHT + Tetris.BORDER_HEIGHT);
		}
		
		// Unit angle radians
		static get UNIT_ANGLE_RADIANS() {
		
			// Return unit angle radians
			return glMatrix["glMatrix"].toRadian(45);
		}
		
		// Unit dimensions scale
		static get UNIT_DIMENSIONS_SCALE() {
		
			// Return unit dimentions scale
			return 0.8;
		}
		
		// Unit mask dimensions scale
		static get UNIT_MASK_DIMENSIONS_SCALE() {
		
			// Return unit mask dimentions scale
			return 0.62;
		}
		
		// Key left
		static get KEY_LEFT() {
		
			// Return key left
			return 37;
		}
		
		// Key up
		static get KEY_UP() {
		
			// Return key up
			return 38;
		}
		
		// Key right
		static get KEY_RIGHT() {
		
			// Return key right
			return 39;
		}
		
		// Key down
		static get KEY_DOWN() {
		
			// Return key down
			return 40;
		}
		
		// Tetrominoes
		static get TETROMINOES() {
		
			// Return
			return {
		
				// I
				"I": [
				
					// First orientation
					[
						[false, false, false, false],
						[false, false, false, false],
						[true, true, true, true]
					],
					
					// Second orientation
					[
						[false, false, true],
						[false, false, true],
						[false, false, true],
						[false, false, true]
					],
					
					// Third orientation
					[
						[false, false, false, false],
						[false, false, false, false],
						[true, true, true, true]
					],
					
					// Fourth orientation
					[
						[false, false],
						[false, true],
						[false, true],
						[false, true],
						[false, true]
					]
				],
				
				// O
				"O": [
				
					// First orientation
					[
						[true, true],
						[true, true]
					]
				],
				
				// Z
				"Z": [
				
					// First orientation
					[
						[true, true, false],
						[false, true, true]
					],
					
					// Second orientation
					[
					
						[false, false, true],
						[false, true, true],
						[false, true, false]
					],
					
					// Third orientation
					[
						[false, false, false],
						[true, true, false],
						[false, true, true]
					],
					
					// fourth orientation
					[
						[false, true, false],
						[true, true, false],
						[true, false, false]
					]
				],
				
				// S
				"S": [
				
					// First orientation
					[
						[false, true, true],
						[true, true, false]
					],
					
					// Second orientation
					[
					
						[false, true, false],
						[false, true, true],
						[false, false, true]
					],
					
					// Third orientation
					[
						[false, false, false],
						[false, true, true],
						[true, true, false]
					],
					
					// fourth orientation
					[
						[true, false, false],
						[true, true, false],
						[false, true, false]
					]
				],
				
				// L
				"L": [
				
					// First orientation
					[
						[false, true, false],
						[false, true, false],
						[false, true, true]
					],
					
					// Second orientation
					[
						[false, false, false],
						[true, true, true],
						[true, false, false]
					],
					
					// Third orientation
					[
						[true, true, false],
						[false, true, false],
						[false, true, false]
					],
					
					// Fourth orientation
					[
						[false, false, true],
						[true, true, true],
						[false, false, false],
					]
				],
				
				// J
				"J": [
				
					// First orientation
					[
						[false, true, false],
						[false, true, false],
						[true, true, false]
					],
					
					// Second orientation
					[
						[true, false, false],
						[true, true, true],
						[false, false, false]
					],
					
					// Third orientation
					[
						[false, true, true],
						[false, true, false],
						[false, true, false]
					],
					
					// Fourth orientation
					[
						[false, false, false],
						[true, true, true],
						[false, false, true]
					]
				],
				
				// T
				"T": [
				
					// First orientation
					[
						[false, false, false],
						[true, true, true],
						[false, true, false]
					],
					
					// Second orientation
					[
						[false, true, false],
						[true, true, false],
						[false, true, false]
					],
					
					// Third orientation
					[
						[false, true, false],
						[true, true, true],
						[false, false, false]
					],
					
					// Fourth orientation
					[
						[false, true, false],
						[false, true, true],
						[false, true, false]
					]
				]
			};
		}
		
		// Initial move speed milliseconds
		static get INITIAL_MOVE_SPEED_MILLISECONDS() {
		
			// Return initial move speed milliseconds
			return 750;
		}
		
		// Move speed change milliseconds
		static get MOVE_SPEED_CHANGE_MILLISECONDS() {
		
			// Return move speed change milliseconds
			return 100;
		}
		
		// Minimum move speed milliseconds
		static get MINIMUM_MOVE_SPEED_MILLISECONDS() {
		
			// Return minimum move speed milliseconds
			return 100;
		}
		
		// No touch position
		static get NO_TOUCH_POSITION() {
		
			// Return no touch position
			return null;
		}
		
		// Swipe screen length threshold percent
		static get SWIPE_SCREEN_LENGTH_THRESHOLD_PERCENT() {
		
			// Return swipe screen length threshold percent
			return 0.04;
		}
		
		// Game over row speed milliseconds
		static get GAME_OVER_ROW_SPEED_MILLISECONDS() {
		
			// Return game over line speed milliseconds
			return 25;
		}
		
		// Game over delay hide milliseconds
		static get GAME_OVER_DELAY_HIDE_MILLISECONDS() {
		
			// Return game over delay hide milliseconds
			return 500;
		}
}


// Main function

// Set global object's Tetris
globalThis["Tetris"] = Tetris;
