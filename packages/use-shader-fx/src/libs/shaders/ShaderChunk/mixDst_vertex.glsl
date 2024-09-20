#ifdef USF_USE_MIXDST
	float mixDstAspect = mixDstResolution.x / mixDstResolution.y;
	vec2 mixDstAspectAspectRatio = vec2(
		min(screenAspect / mixDstAspect, 1.0),
		min(mixDstAspect / screenAspect, 1.0)
	);
	vMixDstCoverUv = vUv * mixDstAspectAspectRatio + (1.0 - mixDstAspectAspectRatio) * .5;
#endif