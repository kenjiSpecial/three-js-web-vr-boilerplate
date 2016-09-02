"use strict";

var THREE = require('three');

import App from "../../lib/app";
import AbstractBase from "./abstract-base";

export default class MainScene extends AbstractBase {
    constructor(camera) {
        super();
        
        this.add(camera)
        
        var boxSize = 5;
        var texture = App.textures['box.png'];
        
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(boxSize, boxSize);
        
        this.add(new THREE.AmbientLight(0x3D4143));
        var light = new THREE.DirectionalLight(0xffffff, 1.4);
        light.position.set(3, 4, 5);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.camera.near = 500;
        light.shadow.camera.far = 1600;
        light.shadow.camera.fov = 70;
        light.shadow.bias = 0.0001;
        light.shadow.darkness = 0.7;
        //light.shadowCameraVisible = true;
        light.shadow.mapWidth = light.shadow.mapHeight = 1024;
        this.add(light);
        
        
        var skyboxGeometry = new THREE.BufferGeometry();
        skyboxGeometry.fromGeometry(new THREE.BoxGeometry(boxSize, boxSize, boxSize));
        var skyboxMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            color: 0x01BE00,
            side: THREE.DoubleSide,
            depthWrite: false,
            fog: false
        });
        var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.add(skybox)
        
        
        var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        var material = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(geometry, material);
        
        cube.position.set(0, 0, 0);
        
        this.add(cube);
        
        
    }
};