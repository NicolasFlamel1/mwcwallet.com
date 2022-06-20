// Percision
precision highp int;
precision highp float;


// Structures

// Light
struct Light {
	int type;
	vec3 position;
	float constantAttenuationFactor;
	float linearAttenuationFactor;
	float quadraticAttenuationFactor;
	vec3 direction;
	float innerCutOffAngle;
	float outerCutOffAngle;
	vec3 ambientColor;
	vec3 diffuseColor;
	vec3 specularColor;
};


// Inputs
attribute vec3 position;
attribute vec2 textureCoordinate;
attribute vec3 normal;
attribute vec3 tangent;
attribute vec3 bitangent;


// Outputs
varying vec2 textureCoordinateLocalSpace;
varying vec3 directionTowardCameraTangentSpace;
varying vec3 directionTowardLightTangentSpaces[MAX_NUMBER_OF_LIGHTS];
varying vec3 positionWorldSpace;


// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform Light lights[MAX_NUMBER_OF_LIGHTS];


// Supporting function implementation

// Transpose
mat3 transpose(mat3 matrix) {

	// Return matrix's transpose
	return mat3(
		matrix[0][0], matrix[1][0], matrix[2][0],
		matrix[0][1], matrix[1][1], matrix[2][1],
		matrix[0][2], matrix[1][2], matrix[2][2]
	);
}

// Transpose
mat4 transpose(mat4 matrix) {

	// Return matrix's transpose
	return mat4(
		matrix[0][0], matrix[1][0], matrix[2][0], matrix[3][0],
		matrix[0][1], matrix[1][1], matrix[2][1], matrix[3][1],
		matrix[0][2], matrix[1][2], matrix[2][2], matrix[3][2],
		matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]
	);
}

// Inverse
mat4 inverse(mat4 matrix) {

	// Return matrix's inverse
	float crossProductOne = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
	float crossProductTwo = matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0];
	float crossProductThree = matrix[0][0] * matrix[1][3] - matrix[0][3] * matrix[1][0];
	float crossProductFour = matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1];
	float crossProductFive = matrix[0][1] * matrix[1][3] - matrix[0][3] * matrix[1][1];
	float crossProductSix = matrix[0][2] * matrix[1][3] - matrix[0][3] * matrix[1][2];
	float crossProductSeven = matrix[2][0] * matrix[3][1] - matrix[2][1] * matrix[3][0];
	float crossProductEight = matrix[2][0] * matrix[3][2] - matrix[2][2] * matrix[3][0];
	float crossProductNine = matrix[2][0] * matrix[3][3] - matrix[2][3] * matrix[3][0];
	float crossProductTen = matrix[2][1] * matrix[3][2] - matrix[2][2] * matrix[3][1];
	float crossProductEleven = matrix[2][1] * matrix[3][3] - matrix[2][3] * matrix[3][1];
	float crossProductTwelve = matrix[2][2] * matrix[3][3] - matrix[2][3] * matrix[3][2];
	float determinant = crossProductOne * crossProductTwelve - crossProductTwo * crossProductEleven + crossProductThree * crossProductTen + crossProductFour * crossProductNine - crossProductFive * crossProductEight + crossProductSix * crossProductSeven;
	
	return mat4(
		matrix[1][1] * crossProductTwelve - matrix[1][2] * crossProductEleven + matrix[1][3] * crossProductTen, matrix[0][2] * crossProductEleven - matrix[0][1] * crossProductTwelve - matrix[0][3] * crossProductTen, matrix[3][1] * crossProductSix - matrix[3][2] * crossProductFive + matrix[3][3] * crossProductFour, matrix[2][2] * crossProductFive - matrix[2][1] * crossProductSix - matrix[2][3] * crossProductFour,
		matrix[1][2] * crossProductNine - matrix[1][0] * crossProductTwelve - matrix[1][3] * crossProductEight, matrix[0][0] * crossProductTwelve - matrix[0][2] * crossProductNine + matrix[0][3] * crossProductEight, matrix[3][2] * crossProductThree - matrix[3][0] * crossProductSix - matrix[3][3] * crossProductTwo, matrix[2][0] * crossProductSix - matrix[2][2] * crossProductThree + matrix[2][3] * crossProductTwo,
		matrix[1][0] * crossProductEleven - matrix[1][1] * crossProductNine + matrix[1][3] * crossProductSeven, matrix[0][1] * crossProductNine - matrix[0][0] * crossProductEleven - matrix[0][3] * crossProductSeven, matrix[3][0] * crossProductFive - matrix[3][1] * crossProductThree + matrix[3][3] * crossProductOne, matrix[2][1] * crossProductThree - matrix[2][0] * crossProductFive - matrix[2][3] * crossProductOne,
		matrix[1][1] * crossProductEight - matrix[1][0] * crossProductTen - matrix[1][2] * crossProductSeven, matrix[0][0] * crossProductTen - matrix[0][1] * crossProductEight + matrix[0][2] * crossProductSeven, matrix[3][1] * crossProductTwo - matrix[3][0] * crossProductFour - matrix[3][2] * crossProductOne, matrix[2][0] * crossProductFour - matrix[2][1] * crossProductTwo + matrix[2][2] * crossProductOne
	) / determinant;
}


// Main function
void main(void) {

	// Get position in world space
	positionWorldSpace = vec3(modelMatrix * vec4(position, 1));
	
	// Get view model matrix
	mat4 viewModelMatrix = viewMatrix * modelMatrix;

	// Set position in clip space
	gl_Position = projectionMatrix * viewModelMatrix * vec4(position, 1);
	
	// Set texture coordinate in local space
	textureCoordinateLocalSpace = textureCoordinate;
	
	// Get normal in view space
	mat3 normalMatrix = mat3(transpose(inverse(viewModelMatrix)));
	vec3 normalViewSpace = normalize(normalMatrix * normal);
	
	// Get tangent in view space
	vec3 tangentViewSpace = normalize(normalMatrix * tangent);
	
	// Get bitangent in view space
	vec3 bitangentViewSpace = normalize(normalMatrix * bitangent);
	
	// Get view to tangent matrix
	mat3 inverseTangentMatrix = transpose(mat3(tangentViewSpace, bitangentViewSpace, normalViewSpace));
	
	// Get direction toward camera in tangent space
	vec3 positionViewSpace = vec3(viewModelMatrix * vec4(position, 1));
	vec3 directionTowardCameraViewSpace = normalize(-positionViewSpace);
	directionTowardCameraTangentSpace = normalize(inverseTangentMatrix * directionTowardCameraViewSpace);
	
	// Go through all lights
	for(int i = 0; i < MAX_NUMBER_OF_LIGHTS; ++i) {
	
		// Check if light isn't used
		if(lights[i].type == INVALID_LIGHT_TYPE)
		
			// Break
			break;
	
		// Check if light is a point light or spot light
		vec3 directionTowardLightViewSpace = vec3(0);
		if(lights[i].type == POINT_LIGHT_TYPE || lights[i].type == SPOT_LIGHT_TYPE) {
		
			// Get direction toward light in view space
			vec3 lightPositionViewSpace = vec3(viewMatrix * vec4(lights[i].position, 1));
			directionTowardLightViewSpace = normalize(lightPositionViewSpace - positionViewSpace);
		}
		
		// Otherwise check if light is a directional light
		else if(lights[i].type == DIRECTIONAL_LIGHT_TYPE) {
		
			// Get direction toward light in view space
			vec3 lightDirectionViewSpace = normalize(vec3(viewMatrix * vec4(normalize(lights[i].direction), 0)));
			directionTowardLightViewSpace = -lightDirectionViewSpace;
		}
		
		// Get direction toward light in tangent space
		directionTowardLightTangentSpaces[i] = normalize(inverseTangentMatrix * directionTowardLightViewSpace);
	}
}
