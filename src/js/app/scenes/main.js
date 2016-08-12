"use strict";

var THREE = require('three');

export default class MainScene extends THREE.Scene {
	constructor(camera){
		super();
		this.add(camera);
        
        
        var room = new THREE.Mesh(
            new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
            new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
        );
        this.add(room)
	}
};