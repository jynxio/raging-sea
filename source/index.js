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
const geometry = new three.PlaneGeometry( 10, 10, 512, 512 );
const material = new three.ShaderMaterial( {
    wireframe: false,
    vertexShader: vertex_shader,
    fragmentShader: fragment_shader,
    uniforms: {
        uBigElevation: { value: 0.2 },
        uBigFrequency: { value: new three.Vector2( 4, 1.5 ) },
        uBigSpeed: { value: 0.75 },
        uSmallElevation: { value: 0.15 },
        uSmallFrequency: { value: 3 },
        uSmallSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },
        uTime: { value: 0 },
        uDepthColor: { value: new three.Color( initial_depth_color ) },
        uSurfaceColor: { value: new three.Color( initial_surface_color ) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
    }
} );
const mesh = new three.Mesh( geometry, material );

mesh.rotation.x = - Math.PI * 0.5;
scene.add( mesh );

const material_bone = new three.ShaderMaterial( {
    wireframe: true,
    vertexShader: vertex_shader,
    fragmentShader: fragment_shader,
    uniforms: {
        uBigElevation: { value: 0.2 },
        uBigFrequency: { value: new three.Vector2( 4, 1.5 ) },
        uBigSpeed: { value: 0.75 },
        uSmallElevation: { value: 0.15 },
        uSmallFrequency: { value: 3 },
        uSmallSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },
        uTime: { value: 0 },
        uDepthColor: { value: new three.Color( initial_depth_color ) },
        uSurfaceColor: { value: new three.Color( initial_surface_color ) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
    }
} );
const mesh_bone = new three.Mesh( geometry, material_bone );

mesh_bone.rotation.x = - Math.PI * 0.5;
scene.add( mesh_bone );

/* Debug */
const gui = new dat.GUI( { width: 340 } );
const debug_object = {
    depthColor: initial_depth_color,
    surfaceColor: initial_surface_color,
};

gui.add( material.uniforms.uBigElevation, "value" ).min( 0 ).max( 1 ).step( 0.001 ).name( "uBigElevation" );
gui.add( material.uniforms.uBigFrequency.value, "x" ).min( 0 ).max( 10 ).step( 0.001 ).name( "uBigFrequencyX" );
gui.add( material.uniforms.uBigFrequency.value, "y" ).min( 0 ).max( 10 ).step( 0.001 ).name( "uBigFrequencyY" );
gui.add( material.uniforms.uBigSpeed, "value" ).min( 0 ).max( 4 ).step( 0.001 ).name( "uBigSpeed" );
gui.add( material.uniforms.uColorOffset, "value" ).min( 0 ).max( 1 ).step( 0.001 ).name( "uColorOffset" );
gui.add( material.uniforms.uColorMultiplier, "value" ).min( 0 ).max( 10 ).step( 0.001 ).name( "uColorMultiplier" );
gui.add( material.uniforms.uSmallElevation, "value" ).min( 0 ).max( 1 ).step( 0.001 ).name( "uSmallElevation" );
gui.add( material.uniforms.uSmallFrequency, "value" ).min( 0 ).max( 30 ).step( 0.001 ).name( "uSmallFrequency" );
gui.add( material.uniforms.uSmallSpeed, "value" ).min( 0 ).max( 4 ).step( 0.001 ).name( "uSmallSpeed" );
gui.add( material.uniforms.uSmallIterations, "value" ).min( 0 ).max( 5 ).step( 1 ).name( "uSmallIterations" );

gui.addColor( debug_object, "depthColor" ).onChange( _ => material.uniforms.uDepthColor.value.set( debug_object.depthColor ) );
gui.addColor( debug_object, "surfaceColor" ).onChange( _ => material.uniforms.uSurfaceColor.value.set( debug_object.surfaceColor ) );

/* Render */
const clock = new three.Clock();

renderer.setAnimationLoop( function loop() {

    const elapsed_time = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed_time;

    material_bone.uniforms.uTime.value = elapsed_time;

    controls.update();
    renderer.render( scene, camera );

} );

// Fog
