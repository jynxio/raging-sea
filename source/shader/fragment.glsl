uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec2 vResolution;
varying vec2 vUv;

void main() {

    vec2 pixelStep = vec2( 1.0 ) / vResolution;
    vec2 pixelIndex = floor( vUv / pixelStep ); // 0, 1, 2, 3, ...
    vec2 pixelIndex4 = mod( pixelIndex, 4.0 ); // 0, 1, 2, 3, 0, 1, 2, 3, ..., 0, 1, 2, 3
    mat4 pattern = mat4(
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 0.0, 0.0
    );
    vec4 row = vec4( // 取y行
        step( 0.0, 0.5 - pixelIndex4.y ),
        step( 0.0, pixelIndex4.y - 0.5 ) * step( 0.0, 1.5 - pixelIndex4.y ),
        step( 0.0, pixelIndex4.y - 1.5 ) * step( 0.0, 2.5 - pixelIndex4.y ),
        step( 0.0, pixelIndex4.y - 2.5 )
    );
    vec4 col = vec4( // 取x列
        step( 0.0, 0.5 - pixelIndex4.x ),
        step( 0.0, pixelIndex4.x - 0.5 ) * step( 0.0, 1.5 - pixelIndex4.x ),
        step( 0.0, pixelIndex4.x - 1.5 ) * step( 0.0, 2.5 - pixelIndex4.x ),
        step( 0.0, pixelIndex4.x - 2.5 )
    );
    float strength = length( col * pattern * row );

    // float strength = ( vElevation + uColorOffset ) * uColorMultiplier;

    strength = ( vElevation + uColorOffset ) * uColorMultiplier;

    vec3 color = mix( uDepthColor, uSurfaceColor, strength );

    gl_FragColor = vec4( color, 1.0 );

}