uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec2 vResolution;
varying vec2 vUv;

void main() {

    float strength = ( vElevation + uColorOffset ) * uColorMultiplier;

    strength = ( vElevation + uColorOffset ) * uColorMultiplier;

    vec3 color = mix( uDepthColor, uSurfaceColor, strength );

    gl_FragColor = vec4( color, 1.0 );

}