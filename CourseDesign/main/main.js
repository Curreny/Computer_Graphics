/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import { SimpleHouse } from "../examples/house.js";
import { Car, Truck } from "../models/car.js"
import { Townhouse, House, Tree, ModernHouse } from "../models/building.js";

import { main } from "../examples/main.js";
import { Road, StopSign } from "../models/road.js";
import { GrAdvancedSwing, GrColoredRoundabout, Playground } from "../models/park.js";
import { DirtPatch, GrCementTruck, GrCrane, GrExcavator } from "../models/construction.js";
import { GrHelicopter, GrRadar } from "../models/helicopter.js";
import { Gravestone, LargeGravestone } from "../models/graveyard.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// make the world
let world = new GrWorld({
    width: 1300,
    height: 900,
    groundplanesize: 20 // make the ground plane big enough for a world of stuff
});

// put stuff into the world

// main block
world.add(new Car({ x: 6, z: -8.5 }))
world.add(new Truck({ x: -9.5, z: 8.5 }))
world.add(new Townhouse({ x: -8, z: 5, angle: 0 }))
world.add(new House({ x: -6, z: -5, angle: Math.PI }))
world.add(new House({ x: -1, z: -5, angle: Math.PI }))
world.add(new House({ x: -3, z: 5, angle: 0 }))
world.add(new House({ x: 6, z: 5, angle: 0 }))
world.add(new ModernHouse({ x: 1, z: 5, angle: 0 }))
world.add(new SimpleHouse({ x: 6, z: -5, size: 1.25, rotate: 0 }))
world.add(new Tree({ x: 4, z: -4, scale: 0.5 }))
world.add(new Tree({ x: 1, z: -4, scale: 0.5 }))

// middle right block
world.add(new Tree({ x: 15.5, z: 4, scale: 0.5 }))
world.add(new Tree({ x: 18.5, z: 4, scale: 0.5 }))
world.add(new Townhouse({ x: 18.5, z: -5, angle: Math.PI }))

// top right block
world.add(new ModernHouse({ x: 15.5, z: -11, angle: 0 }))
world.add(new House({ x: 15.5, z: -19, angle: -Math.PI / 2 }))

// roads
world.add(new Road({ x: 0, z: 8, rotateX: -Math.PI / 2, rotateY: Math.PI / 2 }))
world.add(new Road({ x: 0, z: -8, rotateX: -Math.PI / 2, rotateY: Math.PI / 2 }))
world.add(new Road({ x: 12, z: 0, rotateX: -Math.PI / 2, rotateY: 0 }))
world.add(new Road({ x: -12, z: 0, rotateX: -Math.PI / 2, rotateY: 0 }))
world.add(new StopSign({ x: 9.5, z: 10.5, y: 0.3, rotate: 0 }))
world.add(new StopSign({ x: 9.5, z: 5.5, y: 0.3, rotate: Math.PI / 2 }))
world.add(new StopSign({ x: 14.5, z: 5.5, y: 0.3, rotate: 0 }))
world.add(new StopSign({ x: 14.5, z: 10.5, y: 0.3, rotate: Math.PI / 2 }))

world.add(new StopSign({ x: -9.5, z: 10.5, y: 0.3, rotate: Math.PI / 2 }))
world.add(new StopSign({ x: -9.5, z: 5.5, y: 0.3, rotate: 0 }))
world.add(new StopSign({ x: -14.5, z: 5.5, y: 0.3, rotate: Math.PI / 2 }))
world.add(new StopSign({ x: -14.5, z: 10.5, y: 0.3, rotate: 0 }))

world.add(new StopSign({ x: 9.5, z: -10.5, y: 0.3, rotate: Math.PI / 2 }))
world.add(new StopSign({ x: 9.5, z: -5.5, y: 0.3, rotate: 0 }))
world.add(new StopSign({ x: 14.5, z: -5.5, y: 0.3, rotate: Math.PI / 2 }))
world.add(new StopSign({ x: 14.5, z: -10.5, y: 0.3, rotate: 0 }))

world.add(new StopSign({ x: -9.5, z: -10.5, y: 0.3, rotate: 0 }))
world.add(new StopSign({ x: -9.5, z: -5.5, y: 0.3, rotate: Math.PI / 2 }))
world.add(new StopSign({ x: -14.5, z: -5.5, y: 0.3, rotate: 0 }))
world.add(new StopSign({ x: -14.5, z: -10.5, y: 0.3, rotate: Math.PI / 2 }))

// bottom middle block
world.add(new GrAdvancedSwing({ x: 7, z: 14, size: 0.6 }))
world.add(new GrAdvancedSwing({ x: 7, z: 15, size: 0.6 }))
world.add(new GrAdvancedSwing({ x: 7, z: 16, size: 0.6 }))
world.add(new GrAdvancedSwing({ x: 7, z: 17, size: 0.6 }))
world.add(new GrColoredRoundabout({ x: 2, z: 16, size: 0.4 }))
world.add(new GrColoredRoundabout({ x: 4, z: 13, size: 0.4 }))
world.add(new GrColoredRoundabout({ x: 0, z: 13, size: 0.4 }))
world.add(new Playground())

// top middle block
world.add(new GrCementTruck({ x: -2, z: -12 }))
world.add(new GrCrane({ x: -7, z: -17, size: 1.25 }))
world.add(new GrExcavator({ x: 7, z: -16, size: 1.25 }))
world.add(new DirtPatch())

// middle left block
world.add(new GrHelicopter({ size: 2 }))
world.add(new GrRadar({ x: -17, z: 0, size: 2.25 }))
world.add(new Tree({ x: -15.5, z: 4, scale: 0.5 }))
world.add(new Tree({ x: -18.5, z: 4, scale: 0.5 }))
world.add(new Tree({ x: -15.5, z: -4, scale: 0.5 }))
world.add(new Tree({ x: -18.5, z: -4, scale: 0.5 }))

// bottom left block
world.add(new SimpleHouse({ x: -19, z: 18, size: 1.25, rotate: Math.PI / 2 }))
world.add(new SimpleHouse({ x: -19, z: 14, size: 1.25, rotate: Math.PI / 2 }))

// top left block
world.add(new Gravestone({ x: -15, y: 0.25, z: -16, scale: 0.5 }))
world.add(new Gravestone({ x: -15, y: 0.25, z: -14, scale: 0.5 }))
world.add(new Gravestone({ x: -15, y: 0.25, z: -12, scale: 0.5 }))
world.add(new Gravestone({ x: -15, y: 0.25, z: -18, scale: 0.5 }))
world.add(new Gravestone({ x: -17, y: 0.25, z: -12, scale: 0.5 }))
world.add(new Gravestone({ x: -17, y: 0.25, z: -14, scale: 0.5 }))
world.add(new Gravestone({ x: -17, y: 0.25, z: -16, scale: 0.5 }))
world.add(new Gravestone({ x: -19, y: 0.25, z: -16, scale: 0.5 }))
world.add(new Gravestone({ x: -19, y: 0.25, z: -14, scale: 0.5 }))
world.add(new Gravestone({ x: -19, y: 0.25, z: -12, scale: 0.5 }))
world.add(new Gravestone({ x: -19, y: 0.25, z: -18, scale: 0.5 }))
world.add(new LargeGravestone({ x: -17, y: 0.5, z: -18, scale: 1 }))

// bottom right block
world.add(new ModernHouse({ x: 15, z: 11, angle: -Math.PI / 2 }))
world.add(new Tree({ x: 15.5, z: 16, scale: 0.5 }))
world.add(new Tree({ x: 15.5, z: 19, scale: 0.5 }))
world.add(new Tree({ x: 18.5, z: 19, scale: 0.5 }))

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
highlight("StopSign-1");
highlight("LargeGravestone-1")

highlight("ModernHouse-1");
highlight("Car-1");
highlight("Truck-1")
highlight("Helicopter-1")
highlight("Radar-1")

highlight("Playground-1");

highlight("Tree-1")

highlight("CementMixer-1")
highlight("Crane-1")
highlight("Excavator-1")

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();