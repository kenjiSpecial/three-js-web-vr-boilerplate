'use strict';

var $ = require('jquery');
var _ = require('underscore');
var EventEmitter = require('eventemitter3');


export default class JsonLoader extends EventEmitter {
    constructor(baseUrl, useJsonp) {
        super();
        
        this.baseUrl = baseUrl || '';
        this.data = {};
        this.assetsLoaded = 0;
        this.totalAssets = 0;
        this.useJsonp = useJsonp;
        
    }
    
    load(urls){
        var keys = _.keys(urls);
        this.totalAssets = keys.length;
    
        keys.forEach(function(id) {
            var url = urls[id];
            var path = url;
            if (url.indexOf('http') === 0) path = url;
            else path = this.baseUrl + url;
            $.ajax({
                dataType: this.useJsonp ? 'jsonp' : 'json',
                jsonpCallback: id + 'Callback',
                url: path,
                success: this.onJsonLoad.bind(this, id),
                error: this.onError.bind(this)
            });
        }, this);
    }
    
    onJsonLoad( id, result ){
        this.assetsLoaded++;
        this.data[id] = result;
        
        this.emit('progress', this.assetsLoaded / this.totalAssets);
        if (this.assetsLoaded >= this.totalAssets) this.onLoad();
    }
    
    onLoad(){
        this.emit('load', this.data);
    }
    onError(error){
        this.emit('error', error)
    }
};