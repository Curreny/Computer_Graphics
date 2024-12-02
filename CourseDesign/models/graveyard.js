/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";

let gravestoneCount = 0

export class Gravestone extends GrObject{
    constructor(params = {}) {
        let gravestone = new T.Group();

        let graveGeo = new T.BoxGeometry(1, 1.5, 0.25);
        let graveMat = new T.MeshStandardMaterial({color: "#3d3d3d"})
        let graveStone = new T.Mesh(graveGeo, graveMat)

        let graveGeo2 = new T.CylinderGeometry(0.5, 0.5, 0.25, 32, 1, false, 0, Math.PI);
        let graveMat2 = new T.MeshStandardMaterial({color: "#3d3d3d"})
        let graveStone2 = new T.Mesh(graveGeo2, graveMat2)
        graveStone2.position.y = 0.75;
        graveStone2.rotateZ(Math.PI/2)
        graveStone2.rotateX(Math.PI/2)

        gravestone.add(graveStone)
        gravestone.add(graveStone2)
        super(`Gravestone-${++gravestoneCount}`, gravestone)

        this.whole_ob = gravestone;
        this.whole_ob.position.x = params.x
        this.whole_ob.position.y = params.y
        this.whole_ob.position.z = params.z
        this.whole_ob.scale.set(params.scale, params.scale, params.scale)
    }
}

let largeGravestoneCount = 0

    export class LargeGravestone extends GrObject{
        constructor(params = {}) {
            let largeGravestone = new T.Group();
    
            let graveGeo = new T.BoxGeometry(1, 1, 1);
            let graveMat = new T.MeshStandardMaterial({color: "#3d3d3d"})
            let graveStone = new T.Mesh(graveGeo, graveMat)
    
            let graveGeo2 = new T.BoxGeometry(0.75, 0.75, 0.75);
            let graveMat2 = new T.MeshStandardMaterial({color: "#3d3d3d"})
            let graveStone2 = new T.Mesh(graveGeo2, graveMat2)
            graveStone2.position.y = 0.75;
            graveStone2.rotateZ(Math.PI/2)
            graveStone2.rotateX(Math.PI/2)

            let crossGeo = new T.BoxGeometry(0.25, 0.75, 0.25);
            let crossMat = new T.MeshStandardMaterial({color: "#3d3d3d"})
            let cross = new T.Mesh(crossGeo, crossMat)
            cross.position.y = 2.25;
            cross.rotateZ(Math.PI/2)

            let crossGeo2= new T.BoxGeometry(0.25, 1.75, 0.25);
            let crossMat2 = new T.MeshStandardMaterial({color: "#3d3d3d"})
            let cross2 = new T.Mesh(crossGeo2, crossMat2)
            cross2.position.y = 1.75;
    
            largeGravestone.add(graveStone)
            largeGravestone.add(graveStone2)
            largeGravestone.add(cross)
            largeGravestone.add(cross2)
            super(`LargeGravestone-${++largeGravestoneCount}`, largeGravestone)
    
            this.whole_ob = largeGravestone;
            this.whole_ob.position.x = params.x
            this.whole_ob.position.y = params.y
            this.whole_ob.position.z = params.z
            this.whole_ob.scale.set(params.scale, params.scale, params.scale)
        }
}