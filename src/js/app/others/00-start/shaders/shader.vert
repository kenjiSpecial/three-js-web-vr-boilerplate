attribute float curLife;
attribute float life;

varying float vCurLife;
varying float vLife;

void main(){
    vCurLife = curLife;
    vLife = life;
    float size = (1. - clamp(vCurLife/vLife, 0.0, 1.0)) * 3.0;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
}
