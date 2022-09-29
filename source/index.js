/* css */
import "/style/reset.css";

/* js */
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

/* shader */
import vertex_shader from "./shader/vertex.glsl?raw";
import fragment_shader from "./shader/fragment.glsl?raw";

/* ------------------------------------------------------------------------------------------------------ */
/* Renderer */
const renderer = new three.WebGLRenderer( { antialias: globalThis.devicePixelRatio < 2 } );

renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );
renderer.setSize( globalThis.innerWidth, globalThis.innerHeight );

document.body.append( renderer.domElement );

/* Scene */
const scene = new three.Scene();

/* Camera */
const camera = new three.PerspectiveCamera(
    75,
    globalThis.innerWidth / globalThis.innerHeight,
    0.01,
    100,
);

scene.add( camera );

/* Controls */
const controls = new OrbitControls( camera, renderer.domElement );

controls.enableDamping = true;

/* Resize */
globalThis.addEventListener( "resize", _ => {

    renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );
    renderer.setSize( globalThis.innerWidth, globalThis.innerHeight);

    camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
    camera.updateProjectionMatrix();

} );

/* Render */
const clock = new three.Clock();

renderer.setAnimationLoop( function loop() {

    const elapsed_time = clock.getElapsedTime();

    controls.update();

    renderer.render( scene, camera );

} );

/* ------------------------------------------------------------------------------------------------------ */
/* Camera */
camera.position.set( 1, 1, 1 );

/* Debug */
const gui = new dat.GUI( { width: 340 } );

/* Plane */
const geometry = new three.PlaneGeometry( 2, 2, 128, 128 );
const material = new three.MeshBasicMaterial();
const mesh = new three.Mesh( geometry, material );

mesh.rotation.x = - Math.PI * 0.5;

scene.add( mesh );

