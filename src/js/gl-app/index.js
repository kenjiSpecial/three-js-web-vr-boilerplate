"use strict";

var THREE = require('three');
var _ = require('underscore');

import App from "../lib/app";
var WebVRManager = require('../vendors/webvr-manager/webvr-manager');

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


export default class GLApp {
    constructor() {
        _.bindAll(this, 'onWindowResize', 'loop', 'onLoaded');
        var params = {
            hideButton: false, // Default: false.
            isUndistorted: false // Default: false.
        };
        
        this.camera = new THREE.PerspectiveCamera(70, size.width / size.height, 0.1, 100);
        
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0x000);
    
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
    
    
        var devicePixelRatio = 1;
        // if (sniffer.isDesktop) devicePixelRatio = window.devicePixelRatio;
        this.renderer.setPixelRatio(devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        
        this.renderer.setSize(size.width, size.height);
        
        
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
        }
        
        App.page = "loader";
        
        
        
        size.addListener(this.onWindowResize);
        this.onWindowResize();
        window.addEventListener('vrdisplaypresentchange', this.onWindowResize, true);
    }
    
    start() {
        if (App.page == "loader") this.startLoadAssets();
        
        
        
        this.clock.start();
        
        TweenLite.ticker.addEventListener("tick", this.loop, this);
        
    }
    
    startLoadAssets() {
        this.scenes[App.page].animateIn();
        this.scenes[App.page].startLoad();
        this.scenes[App.page].addEventListener('loaded', this.onLoaded)
    }
    
    onLoaded() {
        // create all scenes after having loaded assets
        _.extend(this.scenes, {
            "main": new Main(this.camera)
        });
    
        
        App.page = "main";
        this.scenes[App.page].animateIn();
    }
    
    loop() {
        var curScene = this.scenes[App.page];
        
        if (this.stats) this.stats.update();
        
        var delta = this.clock.getDelta();
        
        curScene.loop(delta);
        
        this.controls.update();
        this.manager.render(curScene, this.camera, delta * 1000);
    }
    
    onWindowResize() {
        
        this.effect.setSize(size.width, size.height);
        
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        
    }
    
}