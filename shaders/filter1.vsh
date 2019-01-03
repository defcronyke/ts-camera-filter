/*
	A GLSL video filter example which uses webcam and microphone input.
	
	Copyright 2015 Jeremy Carter (Jeremy@JeremyCarter.ca)
	
	Free to use and modify for any purpose, but you must only add additional
	copyright notices and never remove any which were already there (directly above
	this message).
*/

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
