precision highp float;

uniform vec3 u_color;

void main() {
    csm_FragColor = vec4(u_color, 1.0);
}


