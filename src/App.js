/*
	A GLSL video filter example which uses webcam and microphone input.
	
	Copyright Jeremy Carter (Jeremy@JeremyCarter.ca) 2019
	
  See the LICENSE file in this project's root directory for license
  details.
*/

import React, { Component } from 'react';
import * as THREE from 'three';
import './App.css';

class App extends Component {
  static async loadShaders(vertexPath, fragmentPath) {
    const vertex = await fetch(vertexPath).then(res => res.text());
    const fragment = await fetch(fragmentPath).then(res => res.text());

    return { vertex, fragment };
  }

  constructor(props) {
    super(props);

    this.state = {
      showClickToStart: true
    }

    this.buffSize = 2048;
    this.numChannels = 2;
    this.audioSliceSize = 32;
    this.z_pos = -290;
    this.y_rot = 180;
    this.filter1_vsh = null;
    this.filter1_fsh = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas_area = null;
    this.video = null;
    this.createObjectURL = null;
    this.videoImage = null;
    this.videoImageContext = null;
    this.videoTexture = null;
    this.movieMaterial = null;
    this.audioDataQueue = [];
    this.audioFreqQueue = [];
    this.audioFreqSlice = [];
    this.fullscreen = false;

    this.flipVideoHorizontally = this.flipVideoHorizontally.bind(this);

    this.SceneUtils = {

      createMultiMaterialObject: (geometry, materials) => {
        const group = new THREE.Group();

        for (var i = 0, l = materials.length; i < l; i++) {
          group.add(new THREE.Mesh(geometry, materials[i]));
        }

        return group;
      },

      detach: (child, parent, scene) => {
        child.applyMatrix(parent.matrixWorld);
        parent.remove(child);
        scene.add(child);
      },

      attach: (child, scene, parent) => {
        child.applyMatrix(new THREE.Matrix4().getInverse(parent.matrixWorld));

        scene.remove(child);
        parent.add(child);
      }
    };

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (() => {
        return window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
          });
      })();
    }

    navigator.getUserMedia_ = (navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia);

    window.createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || ((stream) => { });

    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
  }

  componentDidMount() {
    this.init(this.threeRootElement);
  }

  async init(threeRootElement) {
    document.addEventListener('click', () => {
      this.setState(() => ({
        showClickToStart: false
      }), () => {
        if (!this.fullscreen) {
          document.documentElement.requestFullscreen();
        }

        this.video.play();
      });
    });

    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 && this.fullscreen) {
        document.exitFullscreen();
      }
    });

    this.shaders = await App.loadShaders("shaders/filter1.vsh", "shaders/filter1.fsh");

    this.scene = new THREE.Scene();

    this.w = 640;
    this.h = 480;
    this.view_angle = 45.0;
    this.aspect = this.w / this.h;
    this.near = 0.1;
    this.far = 20000.0;
    this.camera = new THREE.PerspectiveCamera(this.view_angle, this.aspect, this.near, this.far);
    this.camera.position.set(0, 0, this.z_pos);
    this.camera.rotation.y = this.y_rot * Math.PI / 180;
    this.scene.add(this.camera);

    if (window.WebGLRenderingContext) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
    } else {
      console.log("WebGL not supported by your browser or gpu driver. Falling back to canvas rendering.");
      this.renderer = new THREE.CanvasRenderer();
    }

    this.renderer.setSize(this.w, this.h);
    this.renderer.setClearColor(0x000000, 1);
    threeRootElement.appendChild(this.renderer.domElement);

    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(0, 250, 0);
    this.scene.add(this.light);

    this.video = document.createElement('video');
    this.video.crossOrigin = "anonymous";

    if (!!navigator.getUserMedia_) {
      navigator.getUserMedia_({
        video: {
          optional: [
            { minWidth: 640 },
            { minHeight: 480 }
          ]
        },

        audio: false
      },
        (stream) => {
          this.processVideo(stream);
          this.animate();

          navigator.getUserMedia_({
            audio: true
          },
            (stream) => {
              this.processAudio(stream);
            },
            (error) => {
              const msg = "Failed to get a stream due to " + error;
              console.log(msg);
            });
        },
        (error) => {
          const msg = "Failed to get a stream due to " + error;
          console.log(msg);
          this.video.src = '';
        });
    } else {
      console.log("Error: navigator.getUserMedia not found.");
      return;
    }
  }

  processVideo(stream) {
    this.video.srcObject = stream;
    this.video.load();

    this.video.muted = true;

    this.videoImage = document.createElement('canvas');
    this.videoImage.width = 640;
    this.videoImage.height = 480;

    this.sizeMultiplier = 0.5;

    this.videoImageContext = this.videoImage.getContext('2d');
    this.videoImageContext.fillStyle = '#000000';	// fallback background color
    this.videoImageContext.fillRect(0, 0, this.videoImage.width, this.videoImage.height);

    this.videoTexture = new THREE.Texture(this.videoImage);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    this.movieMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { type: "t", value: this.videoTexture },
        uAudioData: { type: "1fv", value: new Float32Array(this.audioSliceSize) },
        uAudioFreq: { type: "1fv", value: new Float32Array(this.audioSliceSize) }
      },
      vertexShader: this.shaders.vertex,
      fragmentShader: this.shaders.fragment,
      side: THREE.DoubleSide,
      transparent: true
    });

    this.movieMaterials = [
      this.movieMaterial,
    ];

    this.movieGeometry = new THREE.PlaneGeometry(Math.floor(this.videoImage.width * this.sizeMultiplier), Math.floor(this.videoImage.height * this.sizeMultiplier), 4, 4);
    this.movieScreen = new this.SceneUtils.createMultiMaterialObject(this.movieGeometry, this.movieMaterials);
    this.movieScreen.position.set(0, 0, 0);

    this.scene.add(this.movieScreen);
  }

  processAudio(stream) {
    this.audioContext = new AudioContext();
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
    this.recorder = this.audioContext.createScriptProcessor(this.buffSize, 2, 2);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.buffSize;

    this.recorder.onaudioprocess = (s) => {
      this.l = s.inputBuffer.getChannelData(0);
      this.r = s.inputBuffer.getChannelData(1);

      this.out_l = s.outputBuffer.getChannelData(0);
      this.out_r = s.outputBuffer.getChannelData(1);

      this.audioDataQueue = [];

      for (let key in this.l) {

        this.audioDataQueue.push(this.l[key]);
        this.audioDataQueue.push(this.r[key]);

        //out_l[key] = l[key];  // NOTE: uncomment these two lines if you want sound output.
        //out_r[key] = r[key];
      }

      this.movieMaterial.uniforms.uAudioData.value = new Float32Array(this.audioDataQueue.slice(0, this.audioSliceSize));

      this.audioFreqQueue = new Float32Array(this.analyser.frequencyBinCount);
      this.analyser.getFloatFrequencyData(this.audioFreqQueue);

      this.audioFreqSlice = [];
      for (let i = 0; i < this.audioSliceSize; i++) {
        this.audioFreqSlice.push(1.0 - (Math.abs(this.audioFreqQueue[i]) / 128.0));
      }

      this.movieMaterial.uniforms.uAudioFreq.value = new Float32Array(this.audioFreqSlice);

      if (this.videoTexture) {
        this.videoTexture.needsUpdate = true;
      }
    };

    this.mediaStreamSource.onended = () => {
      this.mediaStreamSource.disconnect(this.analyser);
      this.analyser.disconnect(this.recorder);
      this.recorder.disconnect(this.audioContext.destination);
    };

    this.mediaStreamSource.connect(this.analyser);
    this.analyser.connect(this.recorder);
    this.recorder.connect(this.audioContext.destination);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.renderThree();
    this.update();
  }

  renderThree() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.videoImageContext.drawImage(this.video, 0, 0);

      if (this.videoTexture) {
        this.videoTexture.needsUpdate = true;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.renderer.setSize(window.innerWidth * 0.997, window.innerHeight * 0.997);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  flipVideoHorizontally() {
    console.log('Flipping video horizontally.');

    if (this.camera.rotation.y >= 360) {
      this.camera.rotation.y = 0 * Math.PI / 180;
    }

    this.camera.rotation.y += this.y_rot * Math.PI / 180;
    this.z_pos = -this.z_pos;
    this.camera.position.set(0, 0, this.z_pos);
  }

  render() {
    return (
      <div className="App">
        {this.state.showClickToStart
          ? (
            <div
              id="click_to_start"
            >
              Click or tap anywhere to start the Telephone Sound audio-reactive camera filter.
            </div>
          )
          : null}

        <div
          ref={element => this.threeRootElement = element}
          onClick={this.flipVideoHorizontally}
        />
      </div>
    );
  }
}

export default App;
