const glslify = require('glslify');
const raf = require('raf');
window.THREE = require('three');

const WEBVR = require('../../vendors/three/WebVR');
require('../../vendors/three/effects/VREffect');
require('../../vendors/three/controls/VRControls');

var camera, scene, renderer;
var container;

require('domready')(() => {
    init();
    loop()
});

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - htc vive';
    container.appendChild( info );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
    scene.add( camera );

    room = new THREE.Mesh(
        new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
    );

    room.position.y = 3;
    scene.add( room );

    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );




}