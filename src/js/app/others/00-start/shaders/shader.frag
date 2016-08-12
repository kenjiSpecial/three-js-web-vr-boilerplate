
varying float vCurLife;
varying float vLife;
void main(){
    float alpha = 1. - clamp(vCurLife/vLife, 0.0, 1.0);


 gl_FragColor = vec4(1.0, // R
                     1.0, // G
                     1.0, // B
                     alpha);  // A
}
