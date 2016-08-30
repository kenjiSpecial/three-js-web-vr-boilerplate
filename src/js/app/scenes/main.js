"use strict";

var THREE = require('three');
var AppMan = require('../data/app-manager');

export default class MainScene extends THREE.Scene {
	constructor(camera){
		super();
		
		this.add(camera)
		
		var boxSize = 5;
		var texture = AppMan.textures['img/box.png'];
		
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(boxSize, boxSize);
		
		var skyboxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
		var skyboxMaterial = new THREE.MeshBasicMaterial({
			map: texture,
			color: 0x01BE00,
			side: THREE.DoubleSide
		});
		var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
		// skybox.position.y = boxSize/2;
		this.add(skybox)
		
		
		var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		var material = new THREE.MeshNormalMaterial();
		var cube = new THREE.Mesh(geometry, material);

		cube.position.set(0, 0, 0);

		this.add(cube);
		
		
	}
};