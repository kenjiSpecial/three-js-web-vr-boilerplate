"use strict";
var THREE = require('three');
var _ = require('underscore');
var AppMan = require('./data/app-manager');

var size = require('size');
var sniffer = require('sniffer')
var Stats = require('stats.js');

var IS_DEBUG = !!require('../lib/utils').getQueryVariable("debug");

require('../vendors/three/effects/VREffect')(THREE);
require('../vendors/three/controls/VRControls')(THREE);

var TweenMax = require('gsap');

import oui from "ouioui"
let gui;

import Loader from "./scenes/loader";
import Main from "./scenes/main";


export default class App {
    constructor() {
        _.bindAll(this, 'onWindowResize', 'loop', 'onLoaded');
        var params = {
            hideButton: false, // Default: false.
            isUndistorted: false // Default: false.
        };
        
        var container = document.createElement('div');
        document.body.appendChild(container);
        
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
        
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0x000);
        
        var devicePixelRatio = 1;
        if (sniffer.isDesktop) devicePixelRatio = window.devicePixelRatio;
        this.renderer.setPixelRatio(devicePixelRatio);
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);
        
        this.controls = new THREE.VRControls(this.camera);
        this.controls.standing = true;
        
        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(size.width, size.height);
        
        this.manager = new WebVRManager(this.renderer, this.effect, params);
        
        this.clock = new THREE.Clock();
        // clock.start();
        
        if (IS_DEBUG) {
            stats = new Stats();
            container.appendChild(stats.dom);
            
            // oui({test: 100})
            gui = oui.datoui(null, _=> console.log(_))
            let b = {test: 10}
            var f1 = gui.addFolder({label: 'folder1', open: true})
            f1.add(b, 'test')
            
        }
        
        this.scenes = {
            "loader": new Loader(this.camera),
            "main": new Main(this.camera)
        }
        
        AppMan.scene = "loader";
        this.scene = AppMan.scene;
        
        
        size.addListener(this.onWindowResize);
        window.addEventListener('vrdisplaypresentchange', this.onWindowResize, true);
        
    }
    
    start() {
        if (this.scene == "loader") this.startLoadAssets();
        
        
        this.clock.start();
        
        TweenLite.ticker.addEventListener("tick", this.loop, this);
        
    }
    
    startLoadAssets() {
        this.scenes[this.scene].startLoad();
        this.scenes[this.scene].addEventListener('loaded', this.onLoaded)
    }
    
    onLoaded() {
        AppMan.scene = "main";
        this.scene = AppMan.scene;
        
    }
    
    loop() {
        var curScene = this.scenes[this.scene];
        if (this.stats) this.stats.update();
        
        var delta = this.clock.getDelta();
        
        this.controls.update();
        this.manager.render(curScene, this.camera, delta * 1000);
    }
    
    onWindowResize() {
        effect.setSize(size.width, size.height);
        
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
    }
    
}