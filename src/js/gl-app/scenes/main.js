"use strict";

var THREE = require('three');
var OIMO = require('../../vendors/oimo/oimo');
var utils = require('../../lib/utils');

import App from "../../lib/app";
import AbstractBase from "./abstract-base";

function basicTexture(n = 0){
    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
    var color;
    if(n===0) color = "#3884AA";// sphere58AA80
    if(n===1) color = "#61686B";// sphere sleep
    if(n===2) color = "#AA6538";// box
    if(n===3) color = "#61686B";// box sleep
    if(n===4) color = "#AAAA38";// cyl
    if(n===5) color = "#61686B";// cyl sleep
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    
    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}

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
        
        this.vrScale = 1/100;
        this.add(light);
        
        
        var skyboxGeometry = new THREE.BufferGeometry();
        skyboxGeometry.fromGeometry(new THREE.BoxGeometry(boxSize, boxSize, boxSize));
        var skyboxMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            color: 0x01BE00,
            side: THREE.DoubleSide,
            depthWrite: false,
            fog: false,
            opacity : 0.4
        });
        var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.add(skybox)

        
        this.sphereMat = new  THREE.MeshPhongMaterial( {shininess: 10, map: basicTexture(0), name:'sph' } );
        this.groundMat = new THREE.MeshPhongMaterial( {shininess: 10, color:0x3D4143, transparent:true, opacity:1, side : THREE.DoubleSide } );
        this.boxMat = new THREE.MeshPhongMaterial({ shininess: 10, map: basicTexture(2), name:'box' });
    
        this.sphereGeo = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(1,16,10));
        this.boxGeo = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry(1,1,1));
        
        this.initOimoPhysics();
    }
    //----------------------------------
    //  OIMO PHYSICS
    //----------------------------------
    initOimoPhysics(){
        this.world = new OIMO.World(1/60, 2, 8);
        this.world.gravity = new OIMO.Vec3(0, -10, 0);
    
        this.grouds = [];
        this.meshs = [];
        
        this.populate();
    }
    
    populate(){
        this.world.clear();
        this.bodys = [];
        
        //
        var size = [400, 300, 400];
        var pos = [0, -400 - 30/2, 0];
        this.addGround(size, pos);
    
        var x, y, z, w, h, d;
        var max = 100;
        var i = max;
        
        while(i--){
            var x = utils.getRandom(-100, 100);
            var y = utils.getRandom(-100, 100);
            var z = utils.getRandom(-100, 100);
    
            var w = utils.getRandom(10, 30);
            var h = utils.getRandom(10, 30);
            var d = utils.getRandom(10, 30);
    
            var body, mesh;
            
            if(Math.random() < 0.9){
                body = this.world.add({type: 'sphere', size: [w * 0.5], pos: [x, y, z], move : true, world: this.world});
                mesh = new THREE.Mesh(this.sphereGeo, this.sphereMat);
                mesh.scale.set(0.5 * w * this.vrScale, 0.5 * w * this.vrScale, 0.5 * w * this.vrScale);
            }else{
                body = this.world.add({type:'box', size:[w,h,d], pos:[x,y,z], move:true, world:this.world});
                mesh = new THREE.Mesh( this.boxGeo, this.boxMat);
                mesh.scale.set( w * this.vrScale, h * this.vrScale, d * this.vrScale );
            }
    
            mesh.castShadow = true;
            mesh.receiveShadow = true;
    
            this.add(mesh);
    
            this.bodys.push(body);
            this.meshs.push(mesh);
        }
    
    }
    
    addGround(size, pos){
        var ground = this.world.add({size:size, pos:pos, world:this.world})
        
        var groundGeo = new THREE.BoxGeometry(1, 1, 1);
        
        var mesh = new THREE.Mesh(groundGeo, this.groundMat);
        // mesh.rotation.x = Math.PI / 2;
        mesh.position.set(pos[0] * this.vrScale, pos[1] * this.vrScale, pos[2]* this.vrScale);
        mesh.scale.set(size[0]* this.vrScale, size[1]* this.vrScale, size[2]* this.vrScale);
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.add(mesh);
        
    }
    
    loop(dt){
        if(this.world == null) return;
    
        window.world = this.world;
        this.world.step();
        
        var x, y, z, mesh, body, i = this.bodys.length;
        
        while(i--){
            body = this.bodys[i];
            mesh = this.meshs[i];
            
            
            if(!body.sleeping){
                mesh.position.copy(body.getPosition().multiplyScalar(this.vrScale));
                mesh.quaternion.copy(body.getQuaternion());
    
                if(mesh.position.y<-10){
                    x = utils.getRandom(-100, 100);
                    y = utils.getRandom(400, 600);
                    z = utils.getRandom(-100, 100);
                    body.resetPosition(x,y,z);
                }
            }
        }
    
        
    }
};