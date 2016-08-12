var THREE = require("three");
var gravity = new THREE.Vector3(0, -0.2, 0.0);
import {clamp, getRandom} from "../../utils/utils";

export default class Particle extends THREE.Vector3 {
    constructor(index) {
        super(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

        this.particleIndex = index;
        this.life = 5 * Math.random();
        this.curlife = this.life * Math.random();
        this.vel = new THREE.Vector3();
        this.controlerId = parseInt(Math.random() * 2);

    }

    loop(dt, controlPoses, bufferAttribute, curLifeBufferAttribute, matrixArray, controllers) {
        this.curlife += dt;

        if (this.curlife < this.life) {
            this.vel.multiplyScalar(0.95);
            this.vel.y += gravity.y * dt;

            this.x += this.vel.x * dt;
            this.y += this.vel.y * dt;
            this.z += this.vel.z * dt;


        } else {
            var controlPos = controlPoses[this.controlerId];
            var matrix = matrixArray[this.controlerId];
            var controller = controllers[this.controlerId];

            if(controller.triggerClicked && controller.triggerLevel > Math.random() ){
                this.curlife = 0;

                var pos = new THREE.Vector3(0, -0.025, -0.02);
                pos = pos.applyMatrix4(matrix);

                this.copy(pos);

                this.vel.set(
                    getRandom(-0.1, 0.1),
                    getRandom(0.1, 1),
                    getRandom(-0.1, 0.1)
                );

            }
        }

        // console.log(this.vel)

        // console.log(this.curlife)
        // console.log(this.x + ', ' + this.y)

        bufferAttribute.setXYZ(this.particleIndex, this.x, this.y, this.z);
        curLifeBufferAttribute.setXYZ(this.particleIndex, this.curlife);

    }
}