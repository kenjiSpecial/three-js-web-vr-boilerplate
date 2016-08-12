"use strict";
window.THREE = require('three');
const WEBVR = require('../../vendors/three/WebVR');
require('../../vendors/three/effects/VREffect');
require('../../vendors/three/controls/VRControls');
var ViveController = require('../../vendors/three/custom-three-vive-controller/index')(THREE, './');


const glslify = require('glslify');
const raf = require('raf');

var clock = new THREE.Clock();
var scene, camera, room, controls, container, renderer, controller1, controller2, effect;
var scaled = 1/100;
require('domready')(() => {
    if ( WEBVR.isLatestAvailable() === false ) {
        
        document.body.appendChild( WEBVR.getMessage() );
        // InitializeWebVRPolyfill();
        // init();
        // loop();
    }else{
        init();
        loop();
    }
    
});

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
    scene.add( camera );

    room = new THREE.Mesh(
        new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
    );


    scene.add( room );

    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor( 0x505050 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;
    container.appendChild( renderer.domElement );

    controls = new THREE.VRControls( camera );
    controls.standing = true;

    controller1 = new ViveController(0, controls);
    scene.add(controller1);


    controller2 = new ViveController(1, controls);
    scene.add(controller2);
    effect = new THREE.VREffect(renderer);

    if (WEBVR.isAvailable() === true) {

        document.body.appendChild(WEBVR.getButton(effect));

    }

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize(window.innerWidth, window.innerHeight);
}

function loop() {
  raf(loop);

    controls.update();

    effect.render(scene, camera);
}