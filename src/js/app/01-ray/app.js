"use strict";
window.THREE = require('three');
require('../../vendors/three/controls/OrbitControls');
var control = require('control-panel');
var line;
var mesh;
var raf = require('raf');
var Stats = require('stats.js');
var panel;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 100, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();

var panel, ray, controls;

var stats = new Stats();
document.body.appendChild( stats.dom );

var ControlKit = require('controlkit');
var controlKit;

var planeG = new THREE.PlaneGeometry(20, 20);
var mat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});

var plane = new THREE.Mesh(planeG, mat);
var rad = 50;
var theta0 = Math.PI * 2 * Math.random();
var theta1 = 0; //Math.PI * (1 * Math.random());
var xPos = Math.cos(theta0) * rad;
var yPos = 0; //Math.sin(theta0) * Math.cos(theta1) * rad;
var zPos = Math.sin(theta0) * rad;
plane.position.set(xPos, yPos, zPos);
plane.lookAt(new THREE.Vector3());
scene.add(plane);

var obj = {
    rotationX:0, rangeRotationX:[0,360],
    rotationY:0, rangeRotationY:[0,360],
    rotationZ:0, rangeRotationZ:[0,360],
};

var axisHelper = new THREE.AxisHelper( 20 );
scene.add( axisHelper );
axisHelper.position.set(-100, 1, 0);

var boxGeometry = new THREE.BoxGeometry(20, 10, 10);
var mat = new THREE.MeshBasicMaterial({wireframe: true, color: 0x0000ff, wireframeLinewidth: 2});
var mesh = new THREE.Mesh(boxGeometry, mat);
mesh.matrixAutoUpdate = false;
var lineGeo, line;

mesh.add(new THREE.Mesh(new THREE.BoxGeometry(20-0.5, 10-0.5, 10-0.5), new THREE.MeshBasicMaterial({color: 0xffffff})));
scene.add(mesh);
var originTargetPos = new THREE.Vector3(80, 0, 0);

var ray;
var rayCaster;

var boxMesh;
var boxMat = new THREE.MeshBasicMaterial({color: 0xffffff});
var boxGeo = new THREE.BoxGeometry(3, 3, 3);
boxMesh = new THREE.Mesh(boxGeo, boxMat);

scene.add(boxMesh);

require('domready')(() => {
    init();
    loop()
});

function init(){
    // var mat = new THREE.MeshBasicMaterial({color: 0x00ff00, side : THREE.DoubleSide });
    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    // geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    // geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    //
    // mesh = new THREE.Line(geometry, mat);

    var mat = new THREE.MeshBasicMaterial({color: 0x00ff00, side : THREE.DoubleSide });
    lineGeo = new THREE.Geometry();
    lineGeo.vertices.push(new THREE.Vector3());
    lineGeo.vertices.push(originTargetPos);
    line = new THREE.Line(lineGeo, mat);
    line.position.set(0, 0.1, 0);
    scene.add(line);

    var size = 100;
    var step = 10;

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();

    var gridHelper = new THREE.GridHelper( size, step );
    scene.add( gridHelper );

    var controlKit = new ControlKit();
    controlKit.addPanel()
                .addSubGroup()
                    .addSlider(obj,'rotationX','rangeRotationX', {onChange : onChangeRotation})
                    .addSlider(obj,'rotationY','rangeRotationZ', {onChange : onChangeRotation})
                    .addSlider(obj,'rotationZ','rangeRotationZ', {onChange : onChangeRotation});

    ray = new THREE.Ray(new THREE.Vector3(), new THREE.Vector3());
    rayCaster = new THREE.Raycaster(mesh.position);
}

function loop(){
    raf(loop);

    var direction = new THREE.Vector3().copy(originTargetPos).applyQuaternion(mesh.quaternion);
    lineGeo.vertices[1] = direction;
    line.geometry.verticesNeedUpdate = true;
    var normalizedDirection = direction.clone().normalize();
    ray.direction = normalizedDirection;
    rayCaster.set(mesh.position, normalizedDirection);
    var test = rayCaster.intersectObject(plane, false);
    if(test.length > 0){
        var testObj = test[0];
        boxMesh.setRotationFromQuaternion(mesh.quaternion);
        boxMesh.position.copy(testObj.point);
        boxMesh.visible = true;
    } else boxMesh.visible = false;


    stats.update();
    renderer.render(scene, camera);
}

var axisX = new THREE.Vector3(1, 0, 0);
var axisY = new THREE.Vector3(0, 1, 0);
var axisZ = new THREE.Vector3(0, 0, 1);
var quantanion = new THREE.Quaternion();

function onChangeRotation(){
    var quaternion1 = new THREE.Quaternion(), quaternion2 = new THREE.Quaternion(), quaternion3 = new THREE.Quaternion();
    quaternion1.setFromAxisAngle(axisX, obj.rotationX / 180 * Math.PI);
    quaternion2.setFromAxisAngle(axisY, obj.rotationY / 180 * Math.PI);
    quaternion3.setFromAxisAngle(axisZ, obj.rotationZ / 180 * Math.PI);

    quantanion = quantanion.multiplyQuaternions(quantanion.multiplyQuaternions(quaternion1, quaternion2), quaternion3);
    quantanion.normalize();

    mesh.setRotationFromQuaternion(quantanion);
    mesh.updateMatrix();
}