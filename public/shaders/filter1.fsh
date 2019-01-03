/*
	A GLSL video filter example which uses webcam and microphone input.
	
	Copyright 2015 Jeremy Carter (Jeremy@JeremyCarter.ca)
	
	Free to use and modify for any purpose, but you must only add additional
	copyright notices and never remove any which were already there (directly above
	this message).
*/

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uAudioData[32];
uniform float uAudioFreq[32];

float rand(vec2 co, float range) {
	return mod(fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453), range);
}

vec4 filter1(vec4 color) {
	
	float r = color.r;
	float g = color.g;
	float b = color.b;
	float a = color.a;
	
	float n = 0.5;
	
	if ((uAudioFreq[0] > n) || (uAudioFreq[1] > n) || (uAudioFreq[2] > n) || (uAudioFreq[3] > n)) {
		
		if (color.g < n) {
			r = (color.r + color.b) / (uAudioFreq[0]);
		}
		
		if (color.r < n) {
			b = color.b / color.r + (uAudioFreq[3]);
		}
		
		if (color.b < n) {
			g = (color.g) + (uAudioFreq[1]) / (uAudioFreq[2]);
		}
	}
	
	
	if ((uAudioFreq[4] > n) || (uAudioFreq[5] > n) || (uAudioFreq[6] > n) || (uAudioFreq[7] > n)) {
	
		r = r * color.g * color.r / (uAudioFreq[4]);
		g = g * color.b * color.g / (uAudioFreq[6]);
		b = b * color.r * color.b / (uAudioFreq[5]);
	}
	
	
	if ((uAudioFreq[8] > n) || (uAudioFreq[9] > n) || (uAudioFreq[10] > n) || (uAudioFreq[11] > n)) {
		
		if (color.g > n) {
			r = r * mod(color.b, (uAudioFreq[8]));
		}
		
		if (color.b > n) { 
			g = mod((g - (color.r)), (uAudioFreq[10]));
		}
		
		if (color.r > n) {
			b = b * mod((color.g + color.b)/2.0, ((uAudioFreq[9]) + (uAudioFreq[11]))/2.0);
		}
	}
	
	
	
	if ((uAudioFreq[12] > n) || (uAudioFreq[13] > n) || (uAudioFreq[14] > n) || (uAudioFreq[15] > n)) {
		
		if (r > n) {
			r = r / mod((color.b * (uAudioFreq[12])), uAudioFreq[8]);
		}
		
		if (g > n) {
			g = g / mod((color.r * (uAudioFreq[14])), uAudioFreq[5]);
		}
		
		if (b > n) {
			b = b / mod((color.g * (uAudioFreq[13])), uAudioFreq[3]);
		}
	}
	
	
	r = mod(r, 1.0001);
	g = mod(g, 1.0001);
	b = mod(b, 1.0001);
	a = mod(a, 1.0001);
	
	return vec4(r, g, b, a);
}

void main() {
	
	vec4 color = texture2D(tDiffuse, vUv);
	color = filter1(color);
	gl_FragColor = color;
}
