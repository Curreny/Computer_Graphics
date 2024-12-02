/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { Helicopter } from "../examples/helicopter.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";

let radarCount = 0;

/**
 * @typedef RadarProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrRadar extends GrObject{
    /**
   * @param {RadarProperties} params
   */
    constructor(params = {}){
        let radar = new T.Group();

        let points = [];
        for ( let i = 0; i < 10; i ++ ) {
            points.push( new T.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
        }

        let baseGeo = new T.ConeGeometry(0.75, 0.75, 4);
        let baseMat = new T.MeshStandardMaterial({color : "#363636"});
        let base = new T.Mesh(baseGeo, baseMat);
        base.position.y = 0.3;

        let satellite = new T.Group();
        satellite.position.y = 0.75;
        satellite.rotateX(-Math.PI/2);

        let rotorGeo = new T.SphereGeometry(0.25);
        let rotorMat = new T.MeshStandardMaterial({color : "#363636"});
        let rotor = new T.Mesh(rotorGeo, rotorMat);
        satellite.add(rotor);

        let dishGeo = new T.LatheGeometry(points);
        let dishMat = new T.MeshStandardMaterial({color: "#cccccc" , side : T.DoubleSide});
        let dish = new T.Mesh(dishGeo, dishMat);
        dish.scale.set(0.05, 0.025, 0.05);
        dish.rotateX(Math.PI/3);
        dish.position.y = 0.18;
        dish.position.z = 0.3;
        satellite.add(dish);

        let antennaGeo = new T.ConeGeometry(0.25, 0.5, 32);
        let antennaMat = new T.MeshStandardMaterial({color : "#757575"});
        let antenna = new T.Mesh(antennaGeo, antennaMat);
        antenna.rotateX(Math.PI/3);
        antenna.position.z = 0.3;
        antenna.position.y = 0.18;
        satellite.add(antenna);

        radar.position.set(2, 0, 2);
        radar.add(base);
        radar.add(satellite);

        super(`Radar-${++radarCount}`, radar);
        this.whole_ob = radar;
        this.satellite = satellite;

        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        radar.scale.set(scale, scale, scale);
    };

    /**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.satellite.rotateZ(delta * 0.0005)
  }
}

let heliCount = 0

export class GrHelicopter extends GrObject{
    constructor(params={}){
        let sphereGeoHeli = new T.SphereGeometry(0.5, 32, 16);
        let sphereMatHeli = new T.MeshStandardMaterial({color : "#2b2b2b"});
        let heliSphere = new T.Mesh(sphereGeoHeli, sphereMatHeli);

        let tailGeoHeli = new T.CylinderGeometry(0.1, 0.1, 1);
        let tailMatHeli = new T.MeshStandardMaterial({color : "#3d3d3d"});
        let heliTail = new T.Mesh(tailGeoHeli, tailMatHeli);
        heliTail.rotateX(Math.PI/2);
        heliTail.position.z = -0.65;

        let ringGeoHeli = new T.TorusGeometry(0.3, 0.075, 16, 100);
        let ringMatHeli = new T.MeshStandardMaterial({color : "#3d3d3d"});
        let heliRing = new T.Mesh(ringGeoHeli, ringMatHeli);
        heliRing.rotateY(Math.PI/2);
        heliRing.position.z = -1.45;

        let postGeoHeli = new T.CylinderGeometry(0.08, 0.08, 0.3);
        let postMatHeli = new T.MeshStandardMaterial({color : "#3d3d3d"});
        let heliPost = new T.Mesh(postGeoHeli, postMatHeli);
        heliPost.position.y = .55;

        let propGeoHeli = new T.PlaneGeometry(2, 0.15);
        let propMatHeli = new T.MeshStandardMaterial({color : "grey", side : T.DoubleSide});
        let heliProp = new T.Mesh(propGeoHeli, propMatHeli);
        heliProp.position.y = .65;
        heliProp.rotateX(Math.PI/2);

        let propGeoHeli2 = new T.PlaneGeometry(0.55, 0.1);
        let propMatHeli2 = new T.MeshStandardMaterial({color : "grey", side : T.DoubleSide});
        let heliProp2 = new T.Mesh(propGeoHeli2, propMatHeli2);
        heliProp2.position.z = -1.45;
        heliProp2.rotateY(Math.PI/2);

        let legGeoHeli = new T.CylinderGeometry(0.06, 0.06, 0.3);
        let legMatHeli = new T.MeshStandardMaterial({color : "#3d3d3d"});
        let heliLeg = new T.Mesh(legGeoHeli, legMatHeli);
        heliLeg.position.y = -.5;
        heliLeg.position.x = 0.2;
        heliLeg.position.z = 0.2;

        let legGeoHeli2 = new T.CylinderGeometry(0.06, 0.06, 0.3);
        let legMatHeli2 = new T.MeshStandardMaterial({color : "#3d3d3d"});
        let heliLeg2 = new T.Mesh(legGeoHeli2, legMatHeli2);
        heliLeg2.position.y = -.5;
        heliLeg2.position.x = 0.2;
        heliLeg2.position.z = -0.2;

        let legGeoHeli3 = new T.CylinderGeometry(0.06, 0.06, 0.3);
        let legMatHeli3 = new T.MeshStandardMaterial({color : "#3d3d3d"});
        let heliLeg3 = new T.Mesh(legGeoHeli3, legMatHeli3);
        heliLeg3.position.y = -.5;
        heliLeg3.position.x = -0.2;
        heliLeg3.position.z = 0.2;

        let legGeoHeli4 = new T.CylinderGeometry(0.06, 0.06, 0.3);
        let legMatHeli4 = new T.MeshStandardMaterial({color : "#3d3d3d"});
        let heliLeg4 = new T.Mesh(legGeoHeli4, legMatHeli4);
        heliLeg4.position.y = -.5;
        heliLeg4.position.x = -0.2;
        heliLeg4.position.z = -0.2;

        let footGeoHeli = new T.PlaneGeometry(1, 0.15);
        let footMatHeli = new T.MeshStandardMaterial({color : "#3d3d3d", side : T.DoubleSide});
        let heliFoot = new T.Mesh(footGeoHeli, footMatHeli);
        heliFoot.position.y = -.65;
        heliFoot.position.x = 0.2;
        heliFoot.rotateY(Math.PI/2);
        heliFoot.rotateX(Math.PI/2);

        let footGeoHeli2 = new T.PlaneGeometry(1, 0.15);
        let footMatHeli2 = new T.MeshStandardMaterial({color : "#3d3d3d", side : T.DoubleSide});
        let heliFoot2 = new T.Mesh(footGeoHeli2, footMatHeli2);
        heliFoot2.position.y = -.65;
        heliFoot2.position.x = -0.2;
        heliFoot2.rotateY(Math.PI/2);
        heliFoot2.rotateX(Math.PI/2);

        const helicopter = new T.Group();
        helicopter.position.y = 3;
        helicopter.add(heliSphere);
        helicopter.add(heliTail);
        helicopter.add(heliRing);
        helicopter.add(heliPost);
        helicopter.add(heliProp);
        helicopter.add(heliProp2);
        helicopter.add(heliLeg);
        helicopter.add(heliLeg2);
        helicopter.add(heliLeg3);
        helicopter.add(heliLeg4);
        helicopter.add(heliFoot);
        helicopter.add(heliFoot2);

        super(`Helicopter-${++heliCount}`, helicopter);
        this.whole_ob = helicopter;
        this.top_prop = heliProp;
        this.back_prop = heliProp2;
        this.time = 0;

        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        helicopter.scale.set(scale, scale, scale);

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.5);
        this.objects[0].add(this.ridePoint);
        this.rideable = this.ridePoint;
    }

/**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.time += delta / 1000;

    let x = 10 * Math.cos(this.time);
    let y = 5 * Math.sin(this.time)
    let z = 10 * Math.sin(this.time);
    this.whole_ob.position.x = x;
    this.whole_ob.position.z = z;
    this.whole_ob.position.y = y + 12;

    this.whole_ob.rotation.y = -Math.atan2(-z, -x) + Math.PI;

    this.top_prop.rotateZ(0.025 * delta);
    this.back_prop.rotateZ(0.025 * delta);
  }
}

