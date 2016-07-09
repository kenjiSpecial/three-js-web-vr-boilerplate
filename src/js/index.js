const glslify = require('glslify');
const raf = require('raf');
window.THREE = require('three');

const WEBVR = require('./vendors/three/WebVR');
require('./vendors/three/effects/VREffect');
require('./vendors/three/controls/VRControls');
// require('./vendors/three/ViveController');

var ViveController = require('./vendors/three/custom-three-vive-controller/index')(THREE, './');

var camera, scene, renderer;
var geometry, shaderMaterial, mesh;
var room, controls, controller1, controller2;
var effect;
var light;

var mesh1, mesh2;

require('domready')(() => {
    init();
    loop();
});

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1, 10000)
    camera.position.z = 0
    scene.add(new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6, 10, 10, 10),
        new THREE.MeshBasicMaterial({color: 0x202020, wireframe: true})
    ))


    // scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0))
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 10).normalize()
    scene.add(light)


    var renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setClearColor(0x101010)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    controls = new THREE.VRControls(camera)
    controls.standing = true

    controller1 = new ViveController(0, controls)
    scene.add(controller1);


    controller2 = new ViveController(1, controls)
    scene.add(controller2)

    var geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    mesh1 = new THREE.Mesh( geometry, material );
    // mesh2 = new THREE.Mesh(new THREE.Sphere(1, 32, 32), new THREE.MeshBasicMaterial({color: 0x0000ff}));

    scene.add(mesh1);
    // scene.add(mesh2);
    

    effect = new THREE.VREffect( renderer );

    if ( WEBVR.isAvailable() === true ) {

        document.body.appendChild( WEBVR.getButton( effect ) );

    }

    window.addEventListener( 'resize', onWindowResize, false );

}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize( window.innerWidth, window.innerHeight );

}

function loop() {
    raf(loop);

    mesh1.position.copy(controller1.position);
    mesh1.quaternion.copy(controller1.quaternion);
    mesh1.matrix.compose(mesh1.position, mesh1.quaternion, mesh1.scale);
    // mesh1.matrix.multiplyMatrices(mesh1.standingMatrix, mesh1.matrix);
    mesh1.matrixWorldNeedsUpdate = true;

    render();
}

function render(){
    controls.update();

    effect.render(scene, camera);
}


