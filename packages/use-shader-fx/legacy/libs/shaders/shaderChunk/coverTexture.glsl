float aspectRatio = uResolution.x / uResolution.y;
float textureAspect = uTextureResolution.x / uTextureResolution.y;
vec2 aspectRatio = vec2(
	min(aspectRatio / textureAspect, 1.0),
	min(textureAspect / aspectRatio, 1.0)
);
vec2 uv = vUv * aspectRatio + (1.0 - aspectRatio) * .5;