"use strict";
window.THREE = require('three');
// const WEBVR = require('../../vendors/three/WebVR');
require('../../vendors/three/effects/VREffect');
require('../../vendors/three/controls/VRControls');
var IS_DEBUG = !!require('../../utils/utils').getQueryVariable("debug");
var size = require('size');
var Stats = require('stats.js');

const glslify = require('glslify');
const raf = require('raf');

import oui from "ouioui"
let gui;


var clock = new THREE.Clock();
var scene, camera, room, controls, container, renderer, controller1, controller2, effect, manager, clock;
var scaled = 1 / 100;

var stats = null; //

// stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom


// Create a VR manager helper to enter and exit VR mode.
var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};

require('domready')(() => {
    init();
    loop();
    
    
});

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    scene.add(camera);
    
    room = new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6, 8, 8, 8),
        new THREE.MeshBasicMaterial({color: 0x404040, wireframe: true})
    );
    
    
    scene.add(room);
    
    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x505050);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    container.appendChild(renderer.domElement);
    
    controls = new THREE.VRControls(camera);
    controls.standing = true;
    
    effect = new THREE.VREffect(renderer);
    effect.setSize(size.width, size.height)
    
    manager = new WebVRManager(renderer, effect, params);
    
    clock = new THREE.Clock();
    clock.start();
    
    if(IS_DEBUG){
        stats = new Stats();
        container.appendChild(stats.dom);
        
        // oui({test: 100})
        gui = oui.datoui(null, _=> console.log( _ ))
        let b = {test:10}
        var f1 = gui.addFolder({label:'folder1', open:true})
        f1.add( b, 'test' )
    
    }
    
    size.addListener(onWindowResize);
    window.addEventListener('vrdisplaypresentchange', onWindowResize, true);
    
}

var display;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
    navigator.getVRDisplays().then(function(displays) {
        if (displays.length > 0) {
            display = displays[0];
            if (display.stageParameters) {
                setStageDimensions(display.stageParameters);
            }
        }
    });
}

function setStageDimensions(stage){
    // var material = skybox.material;
    
    room.geometry = new THREE.BoxGeometry(stage.sizeX, stage.sizeY, stage.sizeZ);
    scene.remove(room);
    
}

function onWindowResize() {
    effect.setSize(size.width, size.height);
    
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
}

function loop() {
    raf(loop);
    if(stats) stats.update();
    
    var delta = clock.getDelta();
    
    controls.update();
    manager.render(scene, camera, delta * 1000);
    
}