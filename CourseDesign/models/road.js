/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import {
  Geometry,
  Face3,
} from "../libs/CS559-Three/examples/jsm/deprecated/Geometry.js";
import {
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  Plane,
  PlaneGeometry,
} from "../libs/CS559-Three/build/three.module.js";

let roadCount = 0;

export class Road extends GrObject {
  constructor(params = {}) {
    let roadGeo = new PlaneGeometry(4, 40);
    let roadMat = new MeshStandardMaterial({ color: "grey" });
    let road = new Mesh(roadGeo, roadMat);
    road.rotateY(params.rotateY);
    road.rotateX(params.rotateX);
    road.position.set(params.x, 0.01, params.z);
    super(`Road-${++roadCount}`, road);
  }
}

let signCount = 0;
export class StopSign extends GrObject {
  constructor(params = {}) {
    let stopSign = new T.Group();
    let signGeo = new CylinderGeometry(1.9, 1.9, 0.25, 8, 1);
    let signMat = new MeshStandardMaterial({ color: "red" });
    let sign = new Mesh(signGeo, signMat);
    sign.rotateZ(Math.PI / 2);
    sign.rotateY(Math.PI / 2.75);
    sign.position.y = 4.2;

    let stopSign2 = new T.Group();
    let signGeo2 = new CylinderGeometry(2, 2, 0.24, 8, 1);
    let signMat2 = new MeshStandardMaterial({ color: "white" });
    let sign2 = new Mesh(signGeo2, signMat2);
    sign2.rotateZ(Math.PI / 2);
    sign2.rotateY(Math.PI / 2.75);
    sign2.position.y = 4.2;

    let poleGeo = new CylinderGeometry(0.15, 0.15, 5, 32);
    let poleMat = new MeshStandardMaterial({ color: "grey" });
    let pole = new Mesh(poleGeo, poleMat);

    let textGeo = new T.BoxGeometry(0.152, 2.5, 1.75);
    const uvsSign = new Float32Array([
      1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    textGeo.setAttribute("uv", new T.BufferAttribute(uvsSign, 2));
    let tlSign = new T.TextureLoader().load("../textures/stopSign.jpg");
    let textMat = new MeshStandardMaterial({ color: "white", map: tlSign });
    let text = new Mesh(textGeo, textMat);
    text.rotateY(0);
    text.rotateX(-Math.PI / 2);
    text.position.y = 4.25;
    text.position.x = 0.05;

    let text2 = new Mesh(textGeo, textMat);
    text2.rotateY(Math.PI);
    text2.rotateX(-Math.PI / 2);
    text2.position.y = 4.25;
    text2.position.x = -0.05;

    stopSign.add(sign);
    stopSign.add(pole);
    stopSign.add(text);
    stopSign.add(text2);
    stopSign.add(sign2);

    stopSign.scale.set(0.15, 0.15, 0.15);

    super(`StopSign-${++signCount}`, stopSign);

    this.whole_ob = stopSign;

    stopSign.position.x = params.x;
    stopSign.position.y = params.y;
    stopSign.position.z = params.z;
    stopSign.rotation.y = params.rotate;
  }
}
