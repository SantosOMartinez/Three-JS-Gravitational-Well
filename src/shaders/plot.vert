uniform float u_amplitude;
uniform float u_inner_radius;

float in_boundary(float x) {
    return -u_inner_radius <= x && x <= u_inner_radius ? 1.0 : 0.0;
}

float gravitational_well(float x) {
    float f = -cos((x * PI) / u_inner_radius) * u_amplitude - u_amplitude;
    return f * in_boundary(x);
}

void main() {
    vec3 modelPosition = position;
    float y = length(modelPosition.xy);
    modelPosition.z += gravitational_well(y);

    csm_Position = modelPosition;

}