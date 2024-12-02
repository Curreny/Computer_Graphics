/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";

// define your buildings here - remember, they need to be imported
// into the "main" program
let townhouseCount = 0;
let houseCount = 0;
let modernhouseCount = 0;
let treeCount = 0;
export class Townhouse extends GrObject {
  constructor(params = {}) {
    let geom = new T.BufferGeometry();
    let geomRoof = new T.BufferGeometry();

    const vertices = new Float32Array([
      // front
      0, 0, 0, 5, 0, 0, 5, 3, 0, 0, 3, 0, 0, 0, 0, 5, 3, 0,

      // right
      5, 0, 0, 5, 0, -3, 5, 3, 0, 5, 0, -3, 5, 3, -3, 5, 3, 0,

      // back
      5, 3, -3, 5, 0, -3, 0, 0, -3, 5, 3, -3, 0, 0, -3, 0, 3, -3,

      // left
      0, 3, 0, 0, 0, -3, 0, 0, 0, 0, 3, 0, 0, 3, -3, 0, 0, -3,

      // top left
      0, 3, 0, 0, 4, -1.5, 0, 3, -3,

      // top right
      5, 3, -3, 5, 4, -1.5, 5, 3, 0,

      // bottom
      5, 0, 0, 0, 0, 0, 0, 0, -3, 5, 0, -3, 5, 0, 0, 0, 0, -3,
    ]);

    geom.setAttribute("position", new T.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();

    const uvs = new Float32Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
    ]);

    geom.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    let tl = new T.TextureLoader().load("../textures/townhouse_texture.jpg");
    let mat = new T.MeshStandardMaterial({ color: "white", map: tl });
    let houseMesh = new T.Mesh(geom, mat);
    houseMesh.scale.set(0.75, 0.75, 0.75);
    houseMesh.rotateY(Math.PI / 2);
    houseMesh.position.x = 2;

    const roofVertices = new Float32Array([
      // top front
      0, 4, -1.5, 0, 3, 0, 5, 3, 0, 0, 4, -1.5, 5, 3, 0, 5, 4, -1.5,

      // top back
      5, 3, -3, 0, 3, -3, 0, 4, -1.5, 5, 4, -1.5, 5, 3, -3, 0, 4, -1.5,
    ]);

    geomRoof.setAttribute("position", new T.BufferAttribute(roofVertices, 3));
    geomRoof.computeVertexNormals();

    const uvsRoof = new Float32Array([
      1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1,

      0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1,
    ]);

    geomRoof.setAttribute("uv", new T.BufferAttribute(uvsRoof, 2));
    let tlRoof = new T.TextureLoader().load("../textures/thRoof_texture.jpg");
    let matRoof = new T.MeshStandardMaterial({ color: "white", map: tlRoof });
    let roofMesh = new T.Mesh(geomRoof, matRoof);
    roofMesh.scale.set(0.75, 0.75, 0.75);
    roofMesh.rotateY(Math.PI / 2);
    roofMesh.position.x = 2;

    let townhouse = new T.Group();
    townhouse.add(houseMesh);
    townhouse.add(roofMesh);
    townhouse.scale.set(1.75, 1.75, 1.75);
    townhouse.rotateY(params.angle);
    townhouse.position.set(params.x, 0, params.z);

    super(`Townhouse-${++townhouseCount}`, townhouse);
  }
}

export class House extends GrObject {
  constructor(params = {}) {
    let geom = new T.BufferGeometry();
    let geomRoof = new T.BufferGeometry();

    const houseVertices = new Float32Array([
      // front
      0, 0, 0, 3, 0, 0, 3, 3, 0, 0, 3, 0, 0, 0, 0, 3, 3, 0,

      // right
      3, 0, 0, 3, 0, -3, 3, 3, 0, 3, 0, -3, 3, 3, -3, 3, 3, 0,

      // back
      3, 3, -3, 3, 0, -3, 0, 0, -3, 3, 3, -3, 0, 0, -3, 0, 3, -3,

      // left
      0, 3, 0, 0, 0, -3, 0, 0, 0, 0, 3, 0, 0, 3, -3, 0, 0, -3,

      // bottom
      3, 0, 0, 0, 0, 0, 0, 0, -3, 3, 0, -3, 3, 0, 0, 0, 0, -3,
    ]);

    geom.setAttribute("position", new T.BufferAttribute(houseVertices, 3));
    geom.computeVertexNormals();

    const uvs = new Float32Array([
      0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0,
    ]);

    geom.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    let tl = new T.TextureLoader().load("../textures/house_texture.jpg");
    let mat = new T.MeshStandardMaterial({ color: "white", map: tl });
    let houseMesh = new T.Mesh(geom, mat);
    houseMesh.scale.set(0.5, 0.5, 0.5);

    const roofVertices = new Float32Array([
      // top front
      1.5, 4.5, -1.5, 0, 3, 0, 3, 3, 0,

      // top back
      3, 3, -3, 0, 3, -3, 1.5, 4.5, -1.5,

      // top left
      0, 3, 0, 1.5, 4.5, -1.5, 0, 3, -3,

      // top right
      3, 3, -3, 1.5, 4.5, -1.5, 3, 3, 0,
    ]);

    geomRoof.setAttribute("position", new T.BufferAttribute(roofVertices, 3));
    geomRoof.computeVertexNormals();

    const uvsRoof = new Float32Array([
      0.5, 0.5, 0, 0, 1, 0,

      1, 0, 0, 0, 0.5, 0.5,

      0, 0, 0.5, 0.5, 1, 0,

      1, 0, 0.5, 0.5, 0, 0,
    ]);

    geomRoof.setAttribute("uv", new T.BufferAttribute(uvsRoof, 2));
    let tlRoof = new T.TextureLoader().load("../textures/roof_texture.jpg");
    let matRoof = new T.MeshStandardMaterial({ color: "white", map: tlRoof });
    let roofMesh = new T.Mesh(geomRoof, matRoof);
    roofMesh.scale.set(0.5, 0.5, 0.5);

    let house = new T.Group();
    house.add(houseMesh);
    house.add(roofMesh);
    house.scale.set(1.75, 1.75, 1.75);
    house.rotateY(params.angle);
    house.position.set(params.x, 0, params.z);

    super(`House-${++houseCount}`, house);
  }
}

export class ModernHouse extends GrObject {
  constructor(params = {}) {
    let geom = new T.BufferGeometry();
    let geomRoof = new T.BufferGeometry();

    const vertices = new Float32Array([
      // front
      0, 0, 0, 5, 0, 0, 5, 3, 0, 0, 3, 0, 0, 0, 0, 5, 3, 0,

      // right
      5, 0, 0, 5, 0, -3, 5, 3, 0, 5, 0, -3, 5, 3, -3, 5, 3, 0,

      // back
      5, 3, -3, 5, 0, -3, 0, 0, -3, 5, 3, -3, 0, 0, -3, 0, 3, -3,

      // left
      0, 3, 0, 0, 0, -3, 0, 0, 0, 0, 3, 0, 0, 3, -3, 0, 0, -3,

      // bottom
      5, 0, 0, 0, 0, 0, 0, 0, -3, 5, 0, -3, 5, 0, 0, 0, 0, -3,

      // side front
      3, 0, 0, 3, 0, 1, 3, 2, 0, 3, 2, 0, 3, 0, 1, 3, 2, 1,

      // side side
      5, 0, 1, 3, 2, 1, 3, 0, 1, 5, 0, 1, 5, 2, 1, 3, 2, 1,

      // side back
      5, 2, 0, 5, 0, 1, 5, 0, 0, 5, 2, 1, 5, 0, 1, 5, 2, 0,
    ]);

    geom.setAttribute("position", new T.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();

    const uvs = new Float32Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
    ]);

    geom.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    let tl = new T.TextureLoader().load("../textures/modernhouse_texture.jpg");
    let mat = new T.MeshStandardMaterial({ color: "white", map: tl });
    let houseMesh = new T.Mesh(geom, mat);
    houseMesh.scale.set(0.6, 0.6, 0.6);
    houseMesh.rotateY(Math.PI / 2);
    houseMesh.position.x = 2;

    const roofVertices = new Float32Array([
      // top front
      -0.25, 3.25, -3.25, -0.25, 3.25, 0.25, 5.25, 3, 0.25, -0.25, 3.25, -3.25,
      5.25, 3, 0.25, 5.25, 3, -3.25,

      5.25, 3, 0.25, -0.25, 3, 0.25, -0.25, 3, -3.25, 5.25, 3, -3.25, 5.25, 3,
      0.25, -0.25, 3, -3.25,

      -0.25, 3.25, 0.25, -0.25, 3, 0.25, 5.25, 3, 0.25,

      5.25, 3, -3.25, -0.25, 3, -3.25, -0.25, 3.25, -3.25,

      -0.25, 3.25, 0.25, -0.25, 3.25, -3.25, -0.25, 3, 0.25, -0.25, 3.25, -3.25,
      -0.25, 3, -3.25, -0.25, 3, 0.25,

      3, 2.5, 0, 3, 2, 1, 5, 2, 1, 3, 2.5, 0, 5, 2, 1, 5, 2.5, 0,

      3, 2, 1, 3, 2.5, 0, 3, 2, 0,

      5, 2, 0, 5, 2.5, 0, 5, 2, 1,
    ]);

    geomRoof.setAttribute("position", new T.BufferAttribute(roofVertices, 3));
    geomRoof.computeVertexNormals();

    const uvsRoof = new Float32Array([
      1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1,

      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    geomRoof.setAttribute("uv", new T.BufferAttribute(uvsRoof, 2));
    let tlRoof = new T.TextureLoader().load(
      "../textures/modernRoof_texture.jpg"
    );
    let matRoof = new T.MeshStandardMaterial({ color: "white", map: tlRoof });
    let roofMesh = new T.Mesh(geomRoof, matRoof);
    roofMesh.scale.set(0.6, 0.6, 0.6);
    roofMesh.rotateY(Math.PI / 2);
    roofMesh.position.x = 2;

    let modernhouse = new T.Group();
    modernhouse.add(houseMesh);
    modernhouse.add(roofMesh);
    modernhouse.scale.set(1.5, 1.5, 1.5);
    modernhouse.rotateY(params.angle);
    modernhouse.position.set(params.x, 0, params.z);

    super(`ModernHouse-${++modernhouseCount}`, modernhouse);
  }
}

export class Tree extends GrObject {
  constructor(params = {}) {
    let trunkGeo = new T.CylinderGeometry(0.5, 0.75, 1.5);
    let trunkMat = new T.MeshStandardMaterial({ color: "#1f1215" });
    let trunk = new T.Mesh(trunkGeo, trunkMat);

    let leavesGeo = new T.ConeGeometry(2.5, 6, 32, 32);

    let image = new T.TextureLoader().load("../textures/leaves.jpg");

    let shaderMat = shaderMaterial(
      "../shaders/leafShader.vs",
      "../shaders/leafShader.fs",
      {
        side: T.DoubleSide,
        uniforms: {
          tex: { value: image },
        },
      }
    );

    let leaves = new T.Mesh(leavesGeo, shaderMat);
    leaves.position.y = 3.5;

    let tree = new T.Group();
    tree.add(trunk);
    tree.add(leaves);
    tree.scale.set(params.scale, params.scale, params.scale);
    tree.position.set(params.x, 0.31, params.z);
    super(`Tree-${++treeCount}`, tree);
  }
}
