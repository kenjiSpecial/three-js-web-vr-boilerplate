"use strict";
var EventEmitter = require('eventemitter3');

module.exports = {
    vent  : new EventEmitter(),
    scene : "loader",
    data  : {}
};
