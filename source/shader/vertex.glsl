uniform float uElevation;
uniform vec2 uFrequency;

void main() {

    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    float elevation =
        sin( modelPosition.x * uFrequency.x ) *
        sin( modelPosition.z * uFrequency.y ) *
        uElevation;

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}
