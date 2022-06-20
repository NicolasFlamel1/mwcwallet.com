// Use strict
"use strict";


// Classes

// Startup images creator class
class StartupImagesCreator {

	// Public
		
		// Initialize
		static initialize() {
		
			// Check if device pixel ratio is supported
			if(typeof devicePixelRatio === "number") {
		
				// Create image
				var image = new Image();
				
				// Image load event
				image["onload"] = function() {
				
					// Get width, height, and pixel ratio
					var width = screen["width"];
					var height = screen["height"];
					var pixelRatio = devicePixelRatio;
					
					// Create portrait and landscape startup images
					StartupImagesCreator.createStartupImage(width, height, pixelRatio, image, (width < height) ? StartupImagesCreator.PORTRAIT_ORIENTATION : StartupImagesCreator.LANDSCAPE_ORIENTATION);
					StartupImagesCreator.createStartupImage(height, width, pixelRatio, image, (height <= width) ? StartupImagesCreator.PORTRAIT_ORIENTATION : StartupImagesCreator.LANDSCAPE_ORIENTATION);
				};
				
				// Set image's source
				image["src"] = "." + getResource(StartupImagesCreator.LOGO_FILE_LOCATION);
			}
		}
	
	// Private
	
		// Add startup image
		static createStartupImage(width, height, pixelRatio, image, orientation) {
		
			// Create canvas
			var canvas = document.createElement("canvas");
			
			// Size canvas to be full screen on the device
			canvas["width"] = width * pixelRatio;
			canvas["height"] = height * pixelRatio;
			
			// Get canvas's context
			var context = canvas.getContext("2d");
			
			// Set context's image smoothing
			context["imageSmoothingEnabled"] = true;
			context["mozImageSmoothingEnabled"] = true;
			context["webkitImageSmoothingEnabled"] = true;
			context["msImageSmoothingEnabled"] = true;
			context["imageSmoothingQuality"] = "high";
			
			// Scale context to the pixel ratio
			context.scale(pixelRatio, pixelRatio);
			
			// Create gradient
			var gradient = context.createLinearGradient(0, 0, width, 0);
			gradient.addColorStop(0, StartupImagesCreator.BACKGROUND_GRADIENT_START_COLOR);
			gradient.addColorStop(1, StartupImagesCreator.BACKGROUND_GRADIENT_END_COLOR);
			
			// Fill context with the gradient
			context["fillStyle"] = gradient;
			context.fillRect(0, 0, width, height);
			
			// Draw image in the middle of the context
			var imageWidth = image["width"] * Math.min(width, height) * StartupImagesCreator.IMAGE_SCALE_FACTOR;
			var imageHeight = imageWidth * image["height"] / image["width"];
			context.drawImage(image, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
			
			// Create link from the context
			var link = document.createElement("link");
			link.setAttribute("rel", "apple-touch-startup-image");
			link.setAttribute("media", "(orientation: " + orientation + ")");
			link.setAttribute("href", canvas.toDataURL());
			
			// Add link to document
			document["head"].appendChild(link);
		}
		
		// Background gradient start color
		static get BACKGROUND_GRADIENT_START_COLOR() {
		
			// Return background gradient start color
			return "#9E00E7";
		}
		
		// Background gradient end color
		static get BACKGROUND_GRADIENT_END_COLOR() {
		
			// Return background gradient end color
			return "#3600C9";
		}
		
		// Image scale factor
		static get IMAGE_SCALE_FACTOR() {
		
			// Return image scale factor
			return 1 / 830;
		}
		
		// Logo file location
		static get LOGO_FILE_LOCATION() {
		
			// Return vertex shader file location
			return "./images/logo_small.svg";
		}
		
		// Portrait orientation
		static get PORTRAIT_ORIENTATION() {
		
			// Return portrait orientation
			return "portrait";
		}
		
		// Landscape orientation
		static get LANDSCAPE_ORIENTATION() {
		
			// Return landscape orientation
			return "landscape";
		}
}


// Main function

// Set global object's startup images creator
globalThis["StartupImagesCreator"] = StartupImagesCreator;

// Ready event
$(function() {

	// Initialize startup images creator
	StartupImagesCreator.initialize();
});
