'use strict';
var EventEmitter = require('eventemitter3');
var _ = require('underscore');

export default class ImagesLoader extends EventEmitter {
	constructor(baseUrl){
		super();
        
        this.baseUrl = baseUrl || '';
        this.images = {};
        this.assetsLoaded = 0;
        this.totalAssets = 0;
	}
	
	load(urls){
        this.totalAssets = urls.length;
        
        urls.forEach(function(url) {
            var img = new Image();
            this.images[url] = img;
            img.onerror = this.onImageError.bind(this, img);
            img.onload = this.onImageLoad.bind(this, img);
            if (url.indexOf('http') === 0) img.src = url;
            else img.src = this.baseUrl + url;
            return img;
        }, this);
    }
    
    onImageLoad(image){
        clearImage(image);
        this.assetsLoaded++;
    
        this.emit('progress', this.assetsLoaded / this.totalAssets);
    
        if (this.assetsLoaded >= this.totalAssets) this.onLoad();
    }
	
	onImageLoad (image){
	    this.emit('load', this.images);
        
    }
    
    onImageError(image, error){
        clearImage(image);
        this.emit('load', error);
    }
	
};

function clearImage(img) {
    img.onerror = img.onload = null;
}
