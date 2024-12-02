/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { Geometry, Face3 } from "../libs/CS559-Three/examples/jsm/deprecated/Geometry.js";

// define your vehicles here - remember, they need to be imported
// into the "main" program

let carCount = 0
let truckCount = 0

export class Car extends GrObject{
    constructor(params = {}){
        let bodyGeom = new T.BufferGeometry();

        const bodyVertices = new Float32Array([
        // left
        3.75, 0, 0,
        0, 0.5, 0,
        0, 0, 0,
        3.75, 0, 0,
        3.75, 0.5, 0,
        0, 0.5, 0,
        
        // back
        3.75, 0, 0,
        3.75, 0, -3,
        4.75, 0.5, 0,
        3.75, 0, -3,
        4.75, 0.5, -3,
        4.75, 0.5, 0,
        
        // right
        3.75, 0.5, -3,
        3.75, 0, -3,
        0, 0, -3,
        3.75, 0.5, -3,
        0, 0, -3,
        0, 0.5, -3,
        
        // front
        -1.5, 0.5, 0,
        0, 0, -3,
        0, 0, 0,
        -1.5, 0.5, 0,
        -1.5, 0.5, -3,
        0, 0, -3,

        // front left
        0, 0, 0,
        0, 0.5, 0,
        -1.5, 0.5, 0,

        // front right
        -1.5, 0.5, -3,
        0, 0.5, -3,
        0, 0, -3,

        // front grill
        -1.5, 0.5, 0,
        -1.5, 1, 0,
        -1.5, 1, -3,
        -1.5, 0.5, -3,
        -1.5, 0.5, 0,
        -1.5, 1, -3,
         
        // hood
        -1.5, 1, 0,
        0.5, 1.25, 0,
        -1.5, 1, -3,
        -1.5, 1, -3,
        0.5, 1.25, 0,
        0.5, 1.25, -3,

        // top
        0.5, 1.25, 0,
        3.5, 1.25, 0,
        3.5, 1.25, -3,
        0.5, 1.25, 0,
        3.5, 1.25, -3,
        0.5, 1.25, -3,

        // trunk
        3.5, 1.25, 0,
        4.75, 1, 0,
        3.5, 1.25, -3,
        3.5, 1.25, -3,
        4.75, 1, 0,
        4.75, 1, -3,

        // trunk back
        4.75, 1, 0,
        4.75, 0.5, 0,
        4.75, 0.5, -3,
        4.75, 1, 0,
        4.75, 0.5, -3,
        4.75, 1, -3,

        // bottom
        3.75, 0, 0,
        0, 0, 0,
        0, 0, -3,
        3.75, 0, -3,
        3.75, 0, 0,
        0, 0, -3,

        // bottom left
        3.75, 0, 0,
        4.75, 0.5, 0,
        3.75, 0.5, 0,

        // bottom right
        3.75, 0, -3,
        3.75, 0.5, -3,
        4.75, 0.5, -3,

        // left mid panel
        4.75, 1, 0,
        -1.5, 1, 0,
        -1.5, 0.5, 0,
        4.75, 1, 0,
        -1.5, 0.5, 0,
        4.75, 0.5, 0,

        // right mid panel
        -1.5, 0.5, -3,
        -1.5, 1, -3,
        4.75, 1, -3,
        4.75, 0.5, -3,
        -1.5, 0.5, -3,
        4.75, 1, -3,

        // left top panel
        -1.5, 1, 0,
        0.5, 1, 0,
        0.5, 1.25, 0,
        3.5, 1.25, 0,
        0.5, 1.25, 0,
        0.5, 1, 0,
        3.5, 1.25, 0,
        0.5, 1, 0,
        3.5, 1, 0,
        3.5, 1, 0,
        4.75, 1, 0,
        3.5, 1.25, 0,

        // right top panel
        0.5, 1.25, -3,
        0.5, 1, -3,
        -1.5, 1, -3,
        0.5, 1, -3,
        0.5, 1.25, -3,
        3.5, 1.25, -3,
        3.5, 1, -3,
        0.5, 1, -3,
        3.5, 1.25, -3,
        3.5, 1.25, -3,
        4.75, 1, -3,
        3.5, 1., -3,
  
        ]);

        bodyGeom.setAttribute('position', new T.BufferAttribute(bodyVertices, 3));
        bodyGeom.computeVertexNormals();

        let bodyMat = new T.MeshStandardMaterial({color: "red", metalness: 0.5, roughness: 0});
        let bodyMesh = new T.Mesh(bodyGeom, bodyMat);
        bodyMesh.position.y = 0.5;

        let topGeom = new T.BufferGeometry();

        const topVertices = new Float32Array([
            // left side
            1.75, 1.25, -.25,
            1.75, 2, -.5,
            0.75, 1.25, -.25,

            2.75, 1.25, -.25,
            2.75, 2, -.5,
            1.75, 1.25, -.25,
            1.75, 1.25, -.25,
            2.75, 2, -.5,
            1.75, 2, -.5,

            3.5, 1.25, -.25,
            2.75, 2, -.5,
            2.75, 1.25, -.25,

            // front side
            0.75, 1.25, -.25,
            1.75, 2, -.5,
            0.75, 1.25, -.5,

            0.75, 1.25, -.5,
            1.75, 2, -2.5,
            0.75, 1.25, -2.5,
            0.75, 1.25, -.5,
            1.75, 2, -.5,
            1.75, 2, -2.5,
            
            1.75, 2, -2.5,
            0.75, 1.25, -2.75,
            0.75, 1.25, -2.5,

            // right side
            0.75, 1.25, -2.75,
            1.75, 2, -2.5,
            1.75, 1.25, -2.75,

            1.75, 1.25, -2.75,
            2.75, 2, -2.5,
            2.75, 1.25, -2.75,
            1.75, 2, -2.5,
            2.75, 2, -2.5,
            1.75, 1.25, -2.75,

            2.75, 1.25, -2.75,
            2.75, 2, -2.5,
            3.5, 1.25, -2.75,

            // back side
            3.5, 1.25, -.25,
            3.5, 1.25, -.5,
            2.75, 2, -.5,

            3.5, 1.25, -.5,
            3.5, 1.25, -2.5,
            2.75, 2, -2.5,
            3.5, 1.25, -.5,
            2.75, 2, -2.5,
            2.75, 2, -.5,
            
            3.5, 1.25, -2.75,
            2.75, 2, -2.5,
            3.5, 1.25, -2.5,

            // top
            1.75, 2, -.5,
            2.75, 2, -2.5,
            1.75, 2, -2.5,
            1.75, 2, -.5,
            2.75, 2, -.5,
            2.75, 2, -2.5,
        ]);

        topGeom.setAttribute('position', new T.BufferAttribute(topVertices, 3));
        topGeom.computeVertexNormals();

        let topMat = new T.MeshStandardMaterial({color: "#1b1c1c", roughness: 0});
        let topMesh = new T.Mesh(topGeom, topMat);
        topMesh.position.y = 0.5;

        let wheels = new T.Group();
        
        let wheelGeom = new T.TorusGeometry(6, 3, 16, 100);
        let wheelMat = new T.MeshStandardMaterial({color: "#171717"});
        let wheelMesh1 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh1.scale.set(0.075, 0.075, 0.075);
        wheelMesh1.position.set(0.75, 0.5, 0);
        wheels.add(wheelMesh1);

        let wheelMesh2 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh2.scale.set(0.075, 0.075, 0.075);
        wheelMesh2.position.set(3.25, 0.5, 0);
        wheels.add(wheelMesh2);

        let wheelMesh3 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh3.scale.set(0.075, 0.075, 0.075);
        wheelMesh3.position.set(3.25, 0.5, -3);
        wheels.add(wheelMesh3);

        let wheelMesh4 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh4.scale.set(0.075, 0.075, 0.075);
        wheelMesh4.position.set(0.75, 0.5, -3);
        wheels.add(wheelMesh4);

        let rimGeom = new T.CircleGeometry(0.5);
        let rimMat = new T.MeshStandardMaterial({color: "#b8b8b8", metalness: 0.25, roughness: 0});
        let rimMesh1 = new T.Mesh(rimGeom, rimMat);
        rimMesh1.position.set(0.75, 0.5,0.1);
        wheels.add(rimMesh1);

        let rimMesh2 = new T.Mesh(rimGeom, rimMat);
        rimMesh2.position.set(3.25, 0.5,0.1);
        wheels.add(rimMesh2);

        let rimMesh3 = new T.Mesh(rimGeom, rimMat);
        rimMesh3.position.set(3.25, 0.5,-3.1);
        rimMesh3.rotateY(Math.PI);
        wheels.add(rimMesh3);

        let rimMesh4 = new T.Mesh(rimGeom, rimMat);
        rimMesh4.position.set(0.75, 0.5,-3.1);
        rimMesh4.rotateY(Math.PI);
        wheels.add(rimMesh4);

        let car = new T.Group();
        car.add(bodyMesh);
        car.add(topMesh);
        car.add(wheels);
        car.scale.set(0.45, 0.45, 0.45)
        car.position.set(params.x, 0, params.z)


        super(`Car-${++carCount}`, car);
        this.whole_ob = car;
        this.state = 0
        this.delay = 0

        this.ridePoint = new T.Object3D();
        this.ridePoint.rotation.y = -Math.PI/2;
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
    switch(this.state){
        case 0:
          this.state = 1;
          this.delay = 2;
          break;
        case 5:
          this.whole_ob.position.x += delta * 0.005
          if(this.whole_ob.position.x >= 9.5){
            this.whole_ob.position.x = 9.5
            this.delay -= delta * 0.005
            if(this.delay < 0){
                this.state = 6;
                this.delay = 2;
            }
          }
          break;
        case 6:
          this.whole_ob.position.x += delta * 0.0025
          this.whole_ob.position.z -= delta * 0.0025
          this.whole_ob.rotation.y += delta * 0.0013
          if(this.whole_ob.position.x >= 12.5){
            this.whole_ob.position.x = 12.5
            this.whole_ob.position.z = 5.5
            this.whole_ob.rotation.y = -Math.PI/2
            this.state = 7;
          }
          break;
        case 7:
          this.whole_ob.position.z -= delta * 0.005
          if(this.whole_ob.position.z <= -5.5){
            this.whole_ob.position.z = -5.5
            this.delay -= delta * 0.005
            if(this.delay < 0){
                this.state = 8;
                this.delay = 2;
            }
          }
          break;
        case 8:
            this.whole_ob.position.x -= delta * 0.0025
            this.whole_ob.position.z -= delta * 0.0025
            this.whole_ob.rotation.y += delta * 0.0013
            if(this.whole_ob.position.x <= 9.5){
              this.whole_ob.position.x = 9.5
              this.whole_ob.position.z = -8.5
              this.whole_ob.rotation.y = 0
              this.state = 1;
            }
            break;
        case 1:
          this.whole_ob.position.x -= delta * 0.005
          if(this.whole_ob.position.x <= -9.5){
            this.whole_ob.position.x = -9.5
            this.delay -= delta * 0.005
            if(this.delay < 0){
                this.state = 2;
                this.delay = 2;
            }
          }
          break;
        case 2:
            this.whole_ob.position.x -= delta * 0.0025
            this.whole_ob.position.z += delta * 0.0025
            this.whole_ob.rotation.y += delta * 0.0013
            if(this.whole_ob.position.x <= -12.5){
              this.whole_ob.position.x = -12.5
              this.whole_ob.position.z = -5.5
              this.whole_ob.rotation.y = Math.PI/2
              this.state = 3;
            }
            break;
        case 3:
            this.whole_ob.position.z += delta * 0.005
            if(this.whole_ob.position.z >= 5.5){
              this.whole_ob.position.z = 5.5
              this.delay -= delta * 0.005
              if(this.delay < 0){
                  this.state = 4;
                  this.delay = 2;
              }
            }
            break;
        case 4:
            this.whole_ob.position.x += delta * 0.0025
            this.whole_ob.position.z += delta * 0.0025
            this.whole_ob.rotation.y += delta * 0.0013
            if(this.whole_ob.position.x >= -9.5){
              this.whole_ob.position.x = -9.5
              this.whole_ob.position.z = 8.5
              this.whole_ob.rotation.y = Math.PI
              this.state = 5;
            }
            break;
      }
  }
}

export class Truck extends GrObject{
    constructor(params = {}){
        let bodyGeom = new T.BufferGeometry();

        const bodyVertices = new Float32Array([
        // left
        3.75, 0, 0,
        0, 0.5, 0,
        0, 0, 0,
        3.75, 0, 0,
        3.75, 0.5, 0,
        0, 0.5, 0,
        
        // back
        3.75, 0, 0,
        3.75, 0, -3,
        5.25, 0.25, 0,
        3.75, 0, -3,
        5.25, 0.25, -3,
        5.25, 0.25, 0,
        
        // right
        3.75, 0.5, -3,
        3.75, 0, -3,
        0, 0, -3,
        3.75, 0.5, -3,
        0, 0, -3,
        0, 0.5, -3,
        
        // front
        -.5, 0.25, 0,
        0, 0, -3,
        0, 0, 0,
        -.5, 0.25, 0,
        -.5, 0.25, -3,
        0, 0, -3,

        // front left
        0, 0, 0,
        0, 0.25, 0,
        -.5, 0.25, 0,

        // front right
        -.5, 0.25, -3,
        0, 0.25, -3,
        0, 0, -3,

        // front grill
        -.5, 0.25, 0,
        -.5, 1, 0,
        -.5, 1, -3,
        -.5, 0.25, -3,
        -.5, 0.25, 0,
        -.5, 1, -3,
         
        // hood
        -.5, 1, 0,
        0.5, 1.25, 0,
        -.5, 1, -3,
        -.5, 1, -3,
        0.5, 1.25, 0,
        0.5, 1.25, -3,

        // top
        0.5, 1.25, 0,
        3.5, 1.25, 0,
        3.5, 1.25, -3,
        0.5, 1.25, 0,
        3.5, 1.25, -3,
        0.5, 1.25, -3,

        // trunk
        3.5, 1.25, 0,
        5.25, 1.25, 0,
        3.5, 1.25, -3,
        3.5, 1.25, -3,
        5.25, 1.25, 0,
        5.25, 1.25, -3,

        // trunk back
        5.25, 1.25, 0,
        5.25, 0.25, 0,
        5.25, 0.25, -3,
        5.25, 1.25, 0,
        5.25, 0.25, -3,
        5.25, 1.25, -3,

        3.5, 1.25, 0,
        5.25, 1, 0,
        5.25, 1.25, 0,

        5.25, 1.25, -3,
        5.25, 1, -3,
        3.5, 1.25, -3,
        
        

        // bottom
        3.75, 0, 0,
        0, 0, 0,
        0, 0, -3,
        3.75, 0, -3,
        3.75, 0, 0,
        0, 0, -3,

        // bottom left
        3.75, 0, 0,
        5.25, 0.5, 0,
        3.75, 0.5, 0,
        5.25, 0.25, 0,
        5.25, 0.5, 0,
        3.75, 0, 0,

        -0.5, 0.25, 0,
        0, 0.25, 0,
        0, 0.5, 0,

        -0.5, 0.25, 0,
        0, 0.5, 0,
        -0.5, 0.5, 0,

        0, 0.5, -3,
        0, 0.25, -3,
        -0.5, 0.25, -3,
        
        -0.5, 0.5, -3,
        0, 0.5, -3,
        -0.5, 0.25, -3,

        // bottom right
        3.25, 0, -3,
        3.25, 0.5, -3,
        5.25, 0.5, -3,
        3.25, 0, -3,
        5.25, 0.5, -3,
        5.25, 0.25, -3,


        // left mid panel
        5.25, 1, 0,
        -.5, 1, 0,
        -.5, 0.5, 0,
        5.25, 1, 0,
        -.5, 0.5, 0,
        5.25, 0.5, 0,

        // right mid panel
        -.5, 0.5, -3,
        -.5, 1, -3,
        5.25, 1, -3,
        5.25, 0.5, -3,
        -.5, 0.5, -3,
        5.25, 1, -3,

        // left top panel
        -.5, 1, 0,
        0.5, 1, 0,
        0.5, 1.25, 0,
        3.5, 1.25, 0,
        0.5, 1.25, 0,
        0.5, 1, 0,
        3.5, 1.25, 0,
        0.5, 1, 0,
        3.5, 1, 0,
        3.5, 1, 0,
        5.25, 1, 0,
        3.5, 1.25, 0,

        // right top panel
        0.5, 1.25, -3,
        0.5, 1, -3,
        -.5, 1, -3,
        0.5, 1, -3,
        0.5, 1.25, -3,
        3.5, 1.25, -3,
        3.5, 1, -3,
        0.5, 1, -3,
        3.5, 1.25, -3,
        3.5, 1.25, -3,
        5.25, 1, -3,
        3.5, 1., -3,
  
        ]);

        bodyGeom.setAttribute('position', new T.BufferAttribute(bodyVertices, 3));
        bodyGeom.computeVertexNormals();

        let bodyMat = new T.MeshStandardMaterial({color: "#2c76e6", metalness: 0.3, roughness: 0});
        let bodyMesh = new T.Mesh(bodyGeom, bodyMat);
        bodyMesh.position.y = 0.5;

        let topGeom = new T.BufferGeometry();

        const topVertices = new Float32Array([
            // left side
            1.75, 1.25, -.25,
            1.75, 2, -.5,
            0.75, 1.25, -.25,

            2.75, 1.25, -.25,
            2.75, 2, -.5,
            1.75, 1.25, -.25,
            1.75, 1.25, -.25,
            2.75, 2, -.5,
            1.75, 2, -.5,

            3, 1.25, -.25,
            2.75, 2, -.5,
            2.75, 1.25, -.25,

            // front side
            0.75, 1.25, -.25,
            1.75, 2, -.5,
            0.75, 1.25, -.5,

            0.75, 1.25, -.5,
            1.75, 2, -2.5,
            0.75, 1.25, -2.5,
            0.75, 1.25, -.5,
            1.75, 2, -.5,
            1.75, 2, -2.5,
            
            1.75, 2, -2.5,
            0.75, 1.25, -2.75,
            0.75, 1.25, -2.5,

            // right side
            0.75, 1.25, -2.75,
            1.75, 2, -2.5,
            1.75, 1.25, -2.75,

            1.75, 1.25, -2.75,
            2.75, 2, -2.5,
            2.75, 1.25, -2.75,
            1.75, 2, -2.5,
            2.75, 2, -2.5,
            1.75, 1.25, -2.75,

            2.75, 1.25, -2.75,
            2.75, 2, -2.5,
            3, 1.25, -2.75,

            // back side
            3, 1.25, -.25,
            3, 1.25, -.5,
            2.75, 2, -.5,

            3, 1.25, -.5,
            3, 1.25, -2.5,
            2.75, 2, -2.5,
            3, 1.25, -.5,
            2.75, 2, -2.5,
            2.75, 2, -.5,
            
            3, 1.25, -2.75,
            2.75, 2, -2.5,
            3, 1.25, -2.5,

            // top
            1.75, 2, -.5,
            2.75, 2, -2.5,
            1.75, 2, -2.5,
            1.75, 2, -.5,
            2.75, 2, -.5,
            2.75, 2, -2.5,
        ]);

        topGeom.setAttribute('position', new T.BufferAttribute(topVertices, 3));
        topGeom.computeVertexNormals();

        let topMat = new T.MeshStandardMaterial({color: "#1b1c1c", roughness: 0});
        let topMesh = new T.Mesh(topGeom, topMat);
        topMesh.position.y = 0.5;

        let wheels = new T.Group();
        
        let wheelGeom = new T.TorusGeometry(6, 3, 16, 100);
        let wheelMat = new T.MeshStandardMaterial({color: "#171717"});
        let wheelMesh1 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh1.scale.set(0.075, 0.075, 0.075);
        wheelMesh1.position.set(0.75, 0.5, 0);
        wheels.add(wheelMesh1);

        let wheelMesh2 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh2.scale.set(0.075, 0.075, 0.075);
        wheelMesh2.position.set(3.25, 0.5, 0);
        wheels.add(wheelMesh2);

        let wheelMesh3 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh3.scale.set(0.075, 0.075, 0.075);
        wheelMesh3.position.set(3.25, 0.5, -3);
        wheels.add(wheelMesh3);

        let wheelMesh4 = new T.Mesh(wheelGeom, wheelMat);
        wheelMesh4.scale.set(0.075, 0.075, 0.075);
        wheelMesh4.position.set(0.75, 0.5, -3);
        wheels.add(wheelMesh4);

        let rimGeom = new T.CircleGeometry(0.5);
        let rimMat = new T.MeshStandardMaterial({color: "#b8b8b8", metalness: 0.25, roughness: 0});
        let rimMesh1 = new T.Mesh(rimGeom, rimMat);
        rimMesh1.position.set(0.75, 0.5,0.1);
        wheels.add(rimMesh1);

        let rimMesh2 = new T.Mesh(rimGeom, rimMat);
        rimMesh2.position.set(3.25, 0.5,0.1);
        wheels.add(rimMesh2);

        let rimMesh3 = new T.Mesh(rimGeom, rimMat);
        rimMesh3.position.set(3.25, 0.5,-3.1);
        rimMesh3.rotateY(Math.PI);
        wheels.add(rimMesh3);

        let rimMesh4 = new T.Mesh(rimGeom, rimMat);
        rimMesh4.position.set(0.75, 0.5,-3.1);
        rimMesh4.rotateY(Math.PI);
        wheels.add(rimMesh4);

        let truck = new T.Group();
        truck.add(bodyMesh);
        truck.add(topMesh);
        truck.add(wheels);
        truck.scale.set(0.45, 0.45, 0.45)
        truck.position.set(params.x, 0, params.z)
        truck.rotateY(Math.PI)

        super(`Truck-${++truckCount}`, truck);
        
        this.whole_ob = truck
        this.state = 0
        this.delay = 0

        this.ridePoint = new T.Object3D();
        this.ridePoint.rotation.y = -Math.PI/2;
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
    switch(this.state){
        case 0:
          this.state = 1;
          this.delay = 2;
          break;
        case 1:
          this.whole_ob.position.x += delta * 0.005
          if(this.whole_ob.position.x >= 9.5){
            this.whole_ob.position.x = 9.5
            this.delay -= delta * 0.005
            if(this.delay < 0){
                this.state = 2;
                this.delay = 2;
            }
          }
          break;
        case 2:
          this.whole_ob.position.x += delta * 0.0025
          this.whole_ob.position.z -= delta * 0.0025
          this.whole_ob.rotation.y -= delta * 0.0013
          if(this.whole_ob.position.x >= 12.5){
            this.whole_ob.position.x = 12.5
            this.whole_ob.position.z = 5.5
            this.whole_ob.rotation.y = -Math.PI/2
            this.state = 3;
          }
          break;
        case 3:
          this.whole_ob.position.z -= delta * 0.005
          if(this.whole_ob.position.z <= -5.5){
            this.whole_ob.position.z = -5.5
            this.delay -= delta * 0.005
            if(this.delay < 0){
                this.state = 4;
                this.delay = 2;
            }
          }
          break;
        case 4:
            this.whole_ob.position.x -= delta * 0.0025
            this.whole_ob.position.z -= delta * 0.0025
            this.whole_ob.rotation.y -= delta * 0.0013
            if(this.whole_ob.position.x <= 9.5){
              this.whole_ob.position.x = 9.5
              this.whole_ob.position.z = -8.5
              this.whole_ob.rotation.y = Math.PI
              this.state = 5;
            }
            break;
        case 5:
          this.whole_ob.position.x -= delta * 0.005
          if(this.whole_ob.position.x <= -9.5){
            this.whole_ob.position.x = -9.5
            this.delay -= delta * 0.005
            if(this.delay < 0){
                this.state = 6;
                this.delay = 2;
            }
          }
          break;
        case 6:
            this.whole_ob.position.x -= delta * 0.0025
            this.whole_ob.position.z += delta * 0.0025
            this.whole_ob.rotation.y -= delta * 0.0013
            if(this.whole_ob.position.x <= -12.5){
              this.whole_ob.position.x = -12.5
              this.whole_ob.position.z = -5.5
              this.whole_ob.rotation.y = Math.PI/2
              this.state = 7;
            }
            break;
        case 7:
            this.whole_ob.position.z += delta * 0.005
            if(this.whole_ob.position.z >= 5.5){
              this.whole_ob.position.z = 5.5
              this.delay -= delta * 0.005
              if(this.delay < 0){
                  this.state = 8;
                  this.delay = 2;
              }
            }
            break;
        case 8:
            this.whole_ob.position.x += delta * 0.0025
            this.whole_ob.position.z += delta * 0.0025
            this.whole_ob.rotation.y -= delta * 0.0013
            if(this.whole_ob.position.x >= -9.5){
              this.whole_ob.position.x = -9.5
              this.whole_ob.position.z = 8.5
              this.whole_ob.rotation.y = 0
              this.state = 1;
            }
            break;
      }
}
}

