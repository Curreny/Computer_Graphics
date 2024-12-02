/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

function degreesToRadians(deg) {
    return (deg * Math.PI) / 180;
}

let cementObCtr = 0;
// A simple dumptruck
/**
 * @typedef CementProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
 export class GrCementTruck extends GrObject {
  /**
   * @param {CementProperties} params
   */
  constructor(params = {}) {
    let cement = new T.Group();

    let cementSettings = {
      steps: 2,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 2
    };

    let baseGeo = new T.BoxGeometry(1,0.5,3);
    let baseMat = new T.MeshStandardMaterial({color: "yellow", metalness: 0.5, roughness: 0.7});
    let base = new T.Mesh(baseGeo, baseMat);
    base.position.y = 0.9;
    base.rotateY(Math.PI/2);
    cement.add(base);

    let tireGeo = new T.TorusGeometry(1, 1, 16, 100);
    let tireMat = new T.MeshStandardMaterial({color: "#888888", roughness: 0.9});
    let tire = new T.Mesh(tireGeo, tireMat);
    tire.scale.set(0.3,0.3,0.3);
    tire.position.y = 0.55;
    tire.position.x = -1;
    tire.position.z = -0.6;
    cement.add(tire);

    let tire2 = new T.Mesh(tireGeo, tireMat);
    tire2.scale.set(0.3,0.3,0.3);
    tire2.position.y = 0.55;
    tire2.position.x = -1;
    tire2.position.z = 0.6;
    cement.add(tire2);

    let tire3 = new T.Mesh(tireGeo, tireMat);
    tire3.scale.set(0.3,0.3,0.3);
    tire3.position.y = 0.55;
    tire3.position.x = 1;
    tire3.position.z = -0.6;
    cement.add(tire3);

    let tire4 = new T.Mesh(tireGeo, tireMat);
    tire4.scale.set(0.3,0.3,0.3);
    tire4.position.y = 0.55;
    tire4.position.x = 1;
    tire4.position.z = 0.6;
    cement.add(tire4);

    let cabGeo = new T.BoxGeometry(1.25,1,1.25);
    let cabMat = new T.MeshStandardMaterial({color: "yellow", metalness: 0.5, roughness: 0.7});
    let cab = new T.Mesh(cabGeo, cabMat);
    cab.position.y = 1.6;
    cab.position.x = -1;
    cement.add(cab);

    let mixer_group = new T.Group();
    mixer_group.position.set(1.3,1.7,0);
    //mixer_group.position.set(1.3,2,0);
    //mixer_group.rotateZ(1/5);
    cement.add(mixer_group);

    let mixerGeo = new T.CylinderGeometry(1,0.5,1.5,16);
    let mixerMat = new T.MeshStandardMaterial({color: "#888888", metalness: 0.6, roughness: 0.3});
    let mixer = new T.Mesh(mixerGeo, mixerMat);
    mixer.scale.set(0.75,0.75,0.75);
    mixer.rotateZ(Math.PI/2);
    mixer_group.add(mixer);

    let mixer2 = new T.Mesh(mixerGeo, mixerMat);
    mixer2.scale.set(0.75,0.75,0.75);
    mixer2.rotateZ(-Math.PI/2);
    mixer2.position.x = -1.1;
    mixer_group.add(mixer2);

    super(`CementMixer-${++cementObCtr}`, cement, [
      ["x", -10, 10, 0],
      ["z", -10, 10, 0],
      ["theta", 0, 360, 0],
      ["mixer_rotate", 0, 360, 0]
    ]);
    
    this.whole_ob = cement;
    this.mixer = mixer_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    cement.scale.set(scale, scale, scale);
  }
/**
* StepWorld method
* @param {*} delta 
* @param {*} timeOfDay 
*/
    stepWorld(delta, timeOfDay) {
    this.mixer.rotateX(delta * 0.0005)
  }
}

let craneObCtr = 0;

// A simple crane
/**
 * @typedef CraneProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCrane extends GrObject {
  /**
   * @param {CraneProperties} params
   */
  constructor(params = {}) {
    let crane = new T.Group();

    let exSettings = {
      steps: 2,
      depth: 0.5,
      bevelEnabled: false
    };

    // first, we define the base of the crane.
    // Just draw a curve for the shape, then use three's "ExtrudeGeometry"
    // to create the shape itself.
    /**@type THREE.Shape */
    let base_curve = new T.Shape();
    base_curve.moveTo(-0.5, 0);
    base_curve.lineTo(-0.5, 2);
    base_curve.lineTo(-0.25, 2.25);
    base_curve.lineTo(-0.25, 5);
    base_curve.lineTo(-0.2, 5);
    base_curve.lineTo(-0.2, 5.5);
    base_curve.lineTo(0.2, 5.5);
    base_curve.lineTo(0.2, 5);
    base_curve.lineTo(0.25, 5);
    base_curve.lineTo(0.25, 2.25);
    base_curve.lineTo(0.5, 2);
    base_curve.lineTo(0.5, 0);
    base_curve.lineTo(-0.5, 0);
    let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
    let crane_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let base = new T.Mesh(base_geom, crane_mat);
    crane.add(base);
    base.translateZ(-0.25);

    // Use a similar process to create the cross-arm.
    // Note, we create a group for the arm, and move it to the proper position.
    // This ensures rotations will behave nicely,
    // and we just have that one point to work with for animation/sliders.
    let arm_group = new T.Group();
    crane.add(arm_group);
    arm_group.translateY(4.5);
    let arm_curve = new T.Shape();
    arm_curve.moveTo(-1.5, 0);
    arm_curve.lineTo(-1.5, 0.25);
    arm_curve.lineTo(-0.5, 0.5);
    arm_curve.lineTo(4, 0.4);
    arm_curve.lineTo(4, 0);
    arm_curve.lineTo(-1.5, 0);
    let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
    let arm = new T.Mesh(arm_geom, crane_mat);
    arm_group.add(arm);
    arm.translateZ(-0.25);

    // Finally, add the hanging "wire" for the crane arm,
    // which is what carries materials in a real crane.
    // The extrusion makes this not look very wire-like, but that's fine for what we're doing.
    let wire_group = new T.Group();
    arm_group.add(wire_group);
    wire_group.translateX(3);
    let wire_curve = new T.Shape();
    wire_curve.moveTo(-0.25, 0);
    wire_curve.lineTo(-0.25, -0.25);
    wire_curve.lineTo(-0.05, -0.3);
    wire_curve.lineTo(-0.05, -3);
    wire_curve.lineTo(0.05, -3);
    wire_curve.lineTo(0.05, -0.3);
    wire_curve.lineTo(0.25, -0.25);
    wire_curve.lineTo(0.25, 0);
    wire_curve.lineTo(-0.25, 0);
    let wire_geom = new T.ExtrudeGeometry(wire_curve, exSettings);
    let wire_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.6,
      roughness: 0.3
    });
    let wire = new T.Mesh(wire_geom, wire_mat);
    wire_group.add(wire);
    wire.translateZ(-0.25);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // This is also where we define parameters for UI sliders.
    // These have format "name," "min", "max", "starting value."
    // Sliders are standardized to have 30 "steps" per slider,
    // so if your starting value does not fall on one of the 30 steps,
    // the starting value in the UI may be slightly different from the starting value you gave.
    super(`Crane-${++craneObCtr}`, crane, [
      ["x", -4, 4, 0],
      ["z", -4, 4, 0],
      ["theta", 0, 360, 0],
      ["wire", 1, 3.5, 2],
      ["arm_rotation", 0, 360, 0]
    ]);
    // Here, we store the crane, arm, and wire groups as part of the "GrCrane" object.
    // This allows us to modify transforms as part of the update function.
    this.whole_ob = crane;
    this.arm = arm_group;
    this.wire = wire_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    crane.scale.set(scale, scale, scale);

    this.state = 0;
    this.delay = 0;
  }
/**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    switch(this.state){
      case 0:
        this.state = 1;
        break;
      case 1:
        this.arm.rotation.y -= delta * 0.0003
        if(this.arm.rotation.y <= -1.6){
          this.arm.rotation.y = -1.6
          this.state = 2;
        }
        break;
      case 2:
        this.wire.position.x -= delta * 0.0005
        if(this.wire.position.x <= 1.3){
          this.wire.position.x = 1.3
          this.state = 3;
        }
        break;
      case 3:
        this.arm.rotation.y += delta * 0.0003
        if(this.arm.rotation.y >= 0){
          this.arm.rotation.y = 0
          this.state = 4;
        }
        break;
      case 4:
        this.wire.position.x += delta * 0.0005
        if(this.wire.position.x >= 3.4){
          this.wire.position.x = 3.4
          this.state = 0;
        }
        break;
    }
  }
}

let excavatorObCtr = 0;

// A simple excavator
/**
 * @typedef ExcavatorProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrExcavator extends GrObject {
  /**
   * @param {ExcavatorProperties} params
   */
  constructor(params = {}) {
    let excavator = new T.Group();

    let exSettings = {
      steps: 2,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 2
    };

    // As with the crane, we define the base (treads) of the excavator.
    // We draw a line, then extrude the line with ExtrudeGeometry,
    // to get the "cutout" style object.
    // Note, for this object, we translate each piece by 0.25 on the negative x-axis.
    // This makes rotation about the y-axis work nicely
    // (since the extrusion happens along +z, a y-rotation goes around an axis on the back face of the piece,
    //  rather than an axis through the center of the piece).
    /**@type THREE.Shape */
    let base_curve = new T.Shape();
    base_curve.moveTo(-1, 0);
    base_curve.lineTo(-1.2, 0.2);
    base_curve.lineTo(-1.2, 0.4);
    base_curve.lineTo(-1, 0.6);
    base_curve.lineTo(1, 0.6);
    base_curve.lineTo(1.2, 0.4);
    base_curve.lineTo(1.2, 0.2);
    base_curve.lineTo(1, 0);
    base_curve.lineTo(-1, 0);
    let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
    let excavator_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let base = new T.Mesh(base_geom, excavator_mat);
    excavator.add(base);
    base.translateZ(-0.2);

    // We'll add the "pedestal" piece for the cab of the excavator to sit on.
    // It can be considered a part of the treads, to some extent,
    // so it doesn't need a group of its own.
    let pedestal_curve = new T.Shape();
    pedestal_curve.moveTo(-0.35, 0);
    pedestal_curve.lineTo(-0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0);
    pedestal_curve.lineTo(-0.35, 0);
    let pedestal_geom = new T.ExtrudeGeometry(pedestal_curve, exSettings);
    let pedestal = new T.Mesh(pedestal_geom, excavator_mat);
    excavator.add(pedestal);
    pedestal.translateY(0.6);
    pedestal.translateZ(-0.2);

    // For the cab, we create a new group, since the cab should be able to spin on the pedestal.
    let cab_group = new T.Group();
    excavator.add(cab_group);
    cab_group.translateY(0.7);
    let cab_curve = new T.Shape();
    cab_curve.moveTo(-1, 0);
    cab_curve.lineTo(1, 0);
    cab_curve.lineTo(1.2, 0.35);
    cab_curve.lineTo(1, 0.75);
    cab_curve.lineTo(0.25, 0.75);
    cab_curve.lineTo(0, 1.5);
    cab_curve.lineTo(-0.8, 1.5);
    cab_curve.lineTo(-1, 1.2);
    cab_curve.lineTo(-1, 0);
    let cab_geom = new T.ExtrudeGeometry(cab_curve, exSettings);
    let cab = new T.Mesh(cab_geom, excavator_mat);
    cab_group.add(cab);
    cab.translateZ(-0.2);

    // Next up is the first part of the bucket arm.
    // In general, each piece is just a series of line segments,
    // plus a bit of extra to get the geometry built and put into a group.
    // We always treat the group as the "pivot point" around which the object should rotate.
    // It is helpful to draw the lines for extrusion with the zero at our desired "pivot point."
    // This minimizes the fiddling needed to get the piece placed correctly relative to its parent's origin.
    // The remaining few pieces are very similar to the arm piece.
    let arm_group = new T.Group();
    cab_group.add(arm_group);
    arm_group.position.set(-0.8, 0.5, 0);
    let arm_curve = new T.Shape();
    arm_curve.moveTo(-2.25, 0);
    arm_curve.lineTo(-2.35, 0.15);
    arm_curve.lineTo(-1, 0.5);
    arm_curve.lineTo(0, 0.25);
    arm_curve.lineTo(-0.2, 0);
    arm_curve.lineTo(-1, 0.3);
    arm_curve.lineTo(-2.25, 0);
    let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
    let arm_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.6,
      roughness: 0.3
    });
    let arm = new T.Mesh(arm_geom, arm_mat);
    arm_group.add(arm);
    arm.translateZ(-0.2);

    let forearm_group = new T.Group();
    arm_group.add(forearm_group);
    forearm_group.position.set(-2.1, 0, 0);
    let forearm_curve = new T.Shape();
    forearm_curve.moveTo(-1.5, 0);
    forearm_curve.lineTo(-1.5, 0.1);
    forearm_curve.lineTo(0, 0.15);
    forearm_curve.lineTo(0.15, 0);
    forearm_curve.lineTo(-1.5, 0);
    let forearm_geom = new T.ExtrudeGeometry(forearm_curve, exSettings);
    let forearm = new T.Mesh(forearm_geom, arm_mat);
    forearm_group.add(forearm);
    forearm.translateZ(-0.2);
    forearm_group.rotateZ(Math.PI/5)

    let bucket_group = new T.Group();
    forearm_group.add(bucket_group);
    bucket_group.position.set(-1.4, 0, 0);
    let bucket_curve = new T.Shape();
    bucket_curve.moveTo(-0.25, -0.9);
    bucket_curve.lineTo(-0.5, -0.5);
    bucket_curve.lineTo(-0.45, -0.3);
    bucket_curve.lineTo(-0.3, -0.2);
    bucket_curve.lineTo(-0.15, 0);
    bucket_curve.lineTo(0.1, 0);
    bucket_curve.lineTo(0.05, -0.2);
    bucket_curve.lineTo(0.5, -0.7);
    bucket_curve.lineTo(-0.25, -0.9);
    let bucket_geom = new T.ExtrudeGeometry(bucket_curve, exSettings);
    let bucket = new T.Mesh(bucket_geom, arm_mat);
    bucket_group.add(bucket);
    bucket.translateZ(-0.2);
    bucket.rotation.z = -Math.PI/2

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // The parameters for sliders are also defined here.
    super(`Excavator-${++excavatorObCtr}`, excavator, [
      ["x", -10, 10, 0],
      ["z", -10, 10, 0],
      ["theta", 0, 360, 0],
      ["spin", 0, 360, 0],
      ["arm_rotate", 0, 50, 45],
      ["forearm_rotate", 0, 90, 45],
      ["bucket_rotate", -90, 45, 0]
    ]);
    // As with the crane, we save the "excavator" group as the "whole object" of the GrExcavator class.
    // We also save the groups of each object that may be manipulated by the UI.
    this.whole_ob = excavator;
    this.cab = cab_group;
    this.arm = arm_group;
    this.forearm = forearm_group;
    this.bucket = bucket_group;

    arm_group.rotateZ(-Math.PI/10)
    this.state = 0

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    excavator.scale.set(scale, scale, scale);
  }

  /**
     * StepWorld Method
     * @param {*} delta 
     * @param {*} timeOfDay 
     */
  stepWorld(delta, timeOfDay) {
    switch(this.state){
      case 0:
        this.state = 1;
        break;
      case 1:
        this.cab.rotation.y += delta * 0.0003
        if(this.cab.rotation.y >= 1){
          this.cab.rotation.y = 1
          this.state = 2;
        }
        break;
      case 2:
        this.forearm.rotation.z += delta * 0.0005
        if(this.forearm.rotation.z >= 1.1){
          this.forearm.rotation.z = 1.1
          this.state = 3;
        }
        break;
      case 3:
        this.bucket.rotation.z += delta * 0.0003
        if(this.bucket.rotation.z >= 1.2){
          this.bucket.rotation.z = 1.2
          this.state = 4;
        }
        break;
      case 4:
        this.cab.rotation.y -= delta * 0.0003
        if(this.cab.rotation.y <= -.6){
          this.cab.rotation.y = -.6
          this.state = 5;
        }
        break;
      case 5:
        this.forearm.rotation.z -= delta * 0.0003
        if(this.forearm.rotation.z <= 0.7){
          this.forearm.rotation.z = 0.7
          this.state = 6;
        }
        break;
      case 6:
        this.bucket.rotation.z -= delta * 0.0005
        if(this.bucket.rotation.z <= -.4){
          this.bucket.rotation.z = -.4
          this.state = 0;
        }
        break;
    }
  }
}

let dirtCount = 0

export class DirtPatch extends GrObject{
  constructor(params = {}){
    let dirt = new T.Group();

    let dirtGeo = new T.PlaneGeometry(20, 10)
    let dirtMat = new T.MeshStandardMaterial({color: "#54432d"})
    let dirtPatch = new T.Mesh(dirtGeo, dirtMat)
    dirtPatch.rotateX(-Math.PI/2)

    dirt.add(dirtPatch)
    dirt.position.y = 0.01
    dirt.position.z = -15

    super(`Dirt-${++dirtCount}`, dirt)

    this.whole_ob = dirt
  }
}
