const glslify = require('glslify');
const raf = require('raf');
window.THREE = require('three');

const WEBVR = require('../../vendors/three/WebVR');
require('../../vendors/three/effects/VREffect');
require('../../vendors/three/controls/VRControls');
import Particle from "./particle";
// require('./vendors/three/ViveController');

var ViveController = require('../../vendors/three/custom-three-vive-controller/index')(THREE, './');

var camera, scene, renderer;
var geometry, shaderMaterial, mesh, material;
var particleSystem;
var room, controls, controller1, controller2;
var debugMesh;
var effect;
var light;
var positionAttribute;
var lifeTimeAttribute, curLifeTimeAttribute;

var mesh1, mesh2;
var positions, lifeTimes, curLifeTimes;

var particles = 10000;
var particleArr = [];
var controllers = [];


require('domready')(() => {
    init();
    loop();
});


function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1, 100)
    camera.position.z = 0

    material = new THREE.ShaderMaterial({
        uniforms: {
            time: {type: "f", value: 1.0},
            resolution: {type: "v2", value: new THREE.Vector2()}
        },
        vertexShader: glslify('./shaders/shader.vert'),
        fragmentShader: glslify('./shaders/shader.frag'),
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlendin,
        transparent :true,
        depthWrite : false
    });

    scene.add(new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6, 10, 10, 10),
        new THREE.MeshBasicMaterial({color: 0x202020, wireframe: true})
    ))

    var debugCube = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var debugMat = new THREE.MeshBasicMaterial({color: 0xffff00});
    debugMesh = new THREE.Mesh(debugCube, debugMat);
    // scene.add(debugMesh);

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
    controls.standing = true;


    controller1 = new ViveController(0, controls)
    scene.add(controller1);
    var axisHelper = new THREE.AxisHelper( 0.1 );
    //scene.add( axisHelper );

    controller1.add(axisHelper)

    controller2 = new ViveController(1, controls)
    scene.add(controller2)

    controllers.push(controller1);
    controllers.push(controller2);

    geometry = new THREE.BufferGeometry();

    positions = new Float32Array(particles * 3);
    lifeTimes = new Float32Array(particles * 1);
    curLifeTimes = new Float32Array(particles * 1);

    for (var i = 0, i3 = 0; i < particles; i++, i3 += 3) {
        var particle = new Particle(i);
        particleArr.push(particle);
        positions[i3 + 0] = particle.x;
        positions[i3 + 1] = particle.y;
        positions[i3 + 2] = particle.z;

        lifeTimes[i] = particle.life;
        curLifeTimes[i] = particle.curlife;
    }

    positionAttribute = new THREE.BufferAttribute(positions, 3);
    lifeTimeAttribute = new THREE.BufferAttribute(lifeTimes, 1);
    curLifeTimeAttribute = new THREE.BufferAttribute(curLifeTimes, 1);

    geometry.addAttribute('position', positionAttribute);
    geometry.addAttribute('curLife', curLifeTimeAttribute);
    geometry.addAttribute('life', lifeTimeAttribute);
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

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

var testMat = new THREE.MeshBasicMaterial({color: 0xffff00});

function loop() {
    raf(loop);


    var matWorld = controls.getStandingMatrix()
    var mat = controller1.matrix;
    var matElements = mat.elements;
    var xx1 = matElements[12];
    var yy1 = matElements[13];
    var zz1 = matElements[14];

    var mat2 = controller2.matrix;
    matElements = mat2.elements;

    var xx2 = matElements[12];
    var yy2 = matElements[13];
    var zz2 = matElements[14];

    var matrixArray = [mat, mat2];
    var controllerPositions = [new THREE.Vector3(xx1, yy1, zz1), new THREE.Vector3(xx2, yy2, zz2)];

    // debugMesh.position.set(xx1, yy1, zz1);

    var dt = 1/60;
    particleArr.forEach(function(particle, index){
        particle.loop(dt, controllerPositions, positionAttribute, curLifeTimeAttribute, matrixArray, controllers)
    }.bind(this))

    positionAttribute.needsUpdate = true;
    curLifeTimeAttribute.needsUpdate = true;
    render();
}

function render() {
    controls.update();

    effect.render(scene, camera);
}


