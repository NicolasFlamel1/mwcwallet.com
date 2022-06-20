// Percision
precision highp int;
precision highp float;


// Structures

// Material
struct Material {
	sampler2D diffuseMap;
	bool hasSpecularMap;
	sampler2D specularMap;
	bool hasEmissionMap;
	sampler2D emissionMap;
	bool hasNormalMap;
	sampler2D normalMap;
	float shininess;
};

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
varying vec2 textureCoordinateLocalSpace;
varying vec3 directionTowardCameraTangentSpace;
varying vec3 directionTowardLightTangentSpaces[MAX_NUMBER_OF_LIGHTS];
varying vec3 positionWorldSpace;


// Uniforms
uniform Material material;
uniform Light lights[MAX_NUMBER_OF_LIGHTS];


// Constants

// Phong to Blinn shininess factor
const int PHONG_TO_BLINN_SHININESS_FACTOR = 4;

// Gamma factor
const float GAMMA_FACTOR = 2.2;


// Supporting function implementation

// To gamma
vec3 toGamma(vec3 value) {

	// Return color in gamma space
	return pow(value, vec3(float(1) / GAMMA_FACTOR));
}

// To gamma
vec4 toGamma(vec4 value) {

	// Return color in gamma space
	return vec4(toGamma(value.rgb), value.a);
}

// To linear
vec3 toLinear(vec3 value) {

	// Return color in linear space
	return pow(value, vec3(GAMMA_FACTOR));
}

// To linear
vec4 toLinear(vec4 value) {

	// Return color in linear space
	return vec4(toLinear(value.rgb), value.a);
}


// Main function
void main(void) {

	// Get diffuse texture color
	vec4 diffuseTextureColor = toLinear(texture2D(material.diffuseMap, textureCoordinateLocalSpace));
	
	// Get normalized normal in tangent space
	vec3 unitNormalTangentSpace = vec3(0, 0, 1);
	if(material.hasNormalMap)
		unitNormalTangentSpace = normalize(texture2D(material.normalMap, textureCoordinateLocalSpace).rgb * float(2) - float(1));
	
	// Get normalized direction toward camera in tangent space
	vec3 unitTowardCameraTangentSpace = normalize(directionTowardCameraTangentSpace);
	
	// Go through all lights
	vec3 combinedColor = vec3(0);
	for(int i = 0; i < MAX_NUMBER_OF_LIGHTS; ++i) {
	
		// Check if light isn't used
		if(lights[i].type == INVALID_LIGHT_TYPE)
		
			// Break
			break;
	
		// Check if light is a point light or spot light
		float attenuation = float(1);
		float intensity = float(1);
		if(lights[i].type == POINT_LIGHT_TYPE || lights[i].type == SPOT_LIGHT_TYPE) {
		
			// Get distance to light in world space
			float distanceToLightWorldSpace = length(lights[i].position - positionWorldSpace);
			
			// Set attenuation based on distance
			attenuation = float(1) / (lights[i].constantAttenuationFactor + lights[i].linearAttenuationFactor * distanceToLightWorldSpace + lights[i].quadraticAttenuationFactor * pow(distanceToLightWorldSpace, float(2)));
			
			// Check if light is a spot light
			if(lights[i].type == SPOT_LIGHT_TYPE) {
		
				// Get direction toward light in world space
				vec3 directionTowardLightWorldSpace = normalize(lights[i].position - positionWorldSpace);
			
				// Get angle to light direction
				float angleToLightDirection = dot(directionTowardLightWorldSpace, normalize(-lights[i].direction));
				
				// Set intensity based on angle
				intensity = clamp((angleToLightDirection - lights[i].outerCutOffAngle) / (lights[i].innerCutOffAngle - lights[i].outerCutOffAngle), float(0), float(1));
			}
		}

		// Get ambient light color
		vec3 ambientLightColor = lights[i].ambientColor * diffuseTextureColor.rgb;
		combinedColor += ambientLightColor * attenuation * intensity;
		
		// Get normalized direction toward light in tangent space
		vec3 unitTowardLightTangentSpace = normalize(directionTowardLightTangentSpaces[i]);
		
		// Get diffuse light color
		float diffuseBrightness = max(dot(unitNormalTangentSpace, unitTowardLightTangentSpace), float(0));
		vec3 diffuseLightColor = lights[i].diffuseColor * diffuseBrightness * diffuseTextureColor.rgb;
		combinedColor += diffuseLightColor * attenuation * intensity;
		
		// Check if material has a specular map
		if(material.hasSpecularMap) {
			
			// Get normalized direction halfway between the direction toward light and direction toward camera in tangent space
			vec3 unitHalfwayTangentSpace = normalize(unitTowardLightTangentSpace + unitTowardCameraTangentSpace);
			
			// Get specular light color
			float specularLightFactor = pow(max(dot(unitNormalTangentSpace, unitHalfwayTangentSpace), float(0)), material.shininess * float(PHONG_TO_BLINN_SHININESS_FACTOR));
			vec3 specularLightColor = lights[i].specularColor * specularLightFactor * texture2D(material.specularMap, textureCoordinateLocalSpace).rgb;
			combinedColor += specularLightColor * attenuation * intensity;
		}
	}
	
	// Check if material has an emission map
	if(material.hasEmissionMap) {
	
		// Get emission light color
		vec3 emissionLightColor = toLinear(texture2D(material.emissionMap, textureCoordinateLocalSpace).rgb);
		combinedColor += emissionLightColor;
	}
	
	// Set color
	gl_FragColor = toGamma(vec4(combinedColor, diffuseTextureColor.a));
}
