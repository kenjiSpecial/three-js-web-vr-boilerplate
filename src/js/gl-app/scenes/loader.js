var THREE = require('three');

// var App = require('../data/app-manager');
import JsonLoader from '../../lib/json-loader';
import ImagesLoader from "../../lib/images-loader";
import App from "../../lib/app";
var _ = require('underscore');

export default class Loader extends THREE.Scene {
    
    constructor(camera) {
        super();
        
        this.useJsonp = true;
        this.isLoaded = false;
        this.loadEvents = 0;
        this.loaded = 0;
        
        // this.add(camera);
        
        _.bindAll(this, 'onLoadedConfigJson')
    }
    
    startLoad() {
        this.configJsonLoader = new JsonLoader(App.assetsURL, this.useJsonp);
        this.configJsonLoader.on("load", this.onLoadedConfigJson);
        this.configJsonLoader.load({'config': 'data/config.json'});
        
    }
    
    onLoadedConfigJson() {
        var manifest = this.configJsonLoader.data.config.manifest;
        var json = manifest.json;
        var images = manifest.images;
        
        
        // image loader
        this.imagesProgress = 0;
        var imagesLoader = new ImagesLoader(App.assetsURL);
        this.imagesLoader = imagesLoader;
        if (images && images.length) {
            imagesLoader.on('progress', this.onImagesProgress, this);
            imagesLoader.on('error', this.onError, this);
            imagesLoader.once('load', this.onLoad.bind(this, 'images'));
            imagesLoader.load(images);
            this.loadEvents++;
            // console.log('[Loader] Loading images...');
        }
        
        // Json loader
        this.jsonProgress = 0;
        var jsonLoader = new JsonLoader(App.assetsURL, this.useJsonp);
        this.jsonLoader = jsonLoader;
        if (json && _.keys(json).length) {
            jsonLoader.on('progress', this.onJsonProgress, this);
            jsonLoader.on('error', this.onError, this);
            jsonLoader.once('load', this.onLoad.bind(this, 'json'));
            jsonLoader.load(json);
            this.loadEvents++;
            // console.log('[Loader] Loading json...');
        }
    }
    
    onJsonProgress(progress) {
        this.jsonProgress = progress;
        
        this.onProgress();
    }
    
    onError() {
        
    }
    
    onLoad(from) {
        this.loaded++;
        this.onProgress();
        
        if (this.loaded < this.loadEvents) return;
        
        App.data = _.extend(App.data, this.jsonLoader.data);
        App.images = this.imagesLoader.images;
        
        // create texture
        App.textures = {};
        
        _.forEach(App.images, function (image, key) {
            if (key.indexOf('textures') > 0) {
                key = key.replace('images/textures/', '');
                var texture = new THREE.Texture(image);
                App.textures[key] = texture;
                texture.needsUpdate = true;
            }
        });
        
        // ------------------------
        
        this.onLoaded();
    }
    
    onProgress() {
        this.loadedProgress = ((this.jsonProgress + this.imagesProgress) / (this.loadEvents)) * 100;
    }
    
    onLoaded() {
        this.isLoaded = true;
        this.dispatchEvent({type: 'loaded'});
    }
    
    loop() {
        
    }
    
}