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

/* ------------------------------------------------------------------------------------------------------ */
/* Camera */
camera.position.set( 1, 1, 1 );

/* Plane */
const initial_depth_color = 0x186691;
const initial_surface_color = 0x9bd8ff;
const geometry = new three.PlaneGeometry( 2, 2, 128, 128 );
const material = new three.ShaderMaterial( {
    vertexShader: vertex_shader,
    fragmentShader: fragment_shader,
    uniforms: {
        uElevation: { value: 0.2 },
        uFrequency: { value: new three.Vector2( 4, 1.5 ) },
        uTime: { value: 0 },
        uSpeed: { value: 0.75 },
        uDepthColor: { value: new three.Color( initial_depth_color ) },
        uSurfaceColor: { value: new three.Color( initial_surface_color ) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
    }
} );
const mesh = new three.Mesh( geometry, material );

mesh.rotation.x = - Math.PI * 0.5;
scene.add( mesh );

/* Debug */
const gui = new dat.GUI( { width: 340 } );
const debug_object = {
    depthColor: initial_depth_color,
    surfaceColor: initial_surface_color,
};

gui.add( material.uniforms.uElevation, "value" ).min( 0 ).max( 1 ).step( 0.001 ).name( "uElevation" );
gui.add( material.uniforms.uFrequency.value, "x" ).min( 0 ).max( 10 ).step( 0.001 ).name( "uFrequencyX" );
gui.add( material.uniforms.uFrequency.value, "y" ).min( 0 ).max( 10 ).step( 0.001 ).name( "uFrequencyY" );
gui.add( material.uniforms.uSpeed, "value" ).min( 0 ).max( 4 ).step( 0.001 ).name( "uSpeed" );
gui.add( material.uniforms.uColorOffset, "value" ).min( 0 ).max( 1 ).step( 0.001 ).name( "uColorOffset" );
gui.add( material.uniforms.uColorMultiplier, "value" ).min( 0 ).max( 10 ).step( 0.001 ).name( "uColorMultiplier" );

gui.addColor( debug_object, "depthColor" ).onChange( _ => material.uniforms.uDepthColor.value.set( debug_object.depthColor ) );
gui.addColor( debug_object, "surfaceColor" ).onChange( _ => material.uniforms.uSurfaceColor.value.set( debug_object.surfaceColor ) );

/* Render */
const clock = new three.Clock();

renderer.setAnimationLoop( function loop() {

    const elapsed_time = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed_time;

    controls.update();
    renderer.render( scene, camera );

} );
