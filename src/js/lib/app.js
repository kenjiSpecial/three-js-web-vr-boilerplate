"use strict";

var _ = require('underscore');
var $ = require('jquery');
var EventEmitter = require('eventemitter3');

class App {
	constructor(){
	    this.models = {}
        this.data = {};
        this.vent = new EventEmitter();
	}
	configure(opts){
	    _.assign(this, opts);
    }
    set page(val){
        this.vent.emit("page", val);
        this._page = val;
    }
    get page(){
        return this._page;
    }
}


export default new App();