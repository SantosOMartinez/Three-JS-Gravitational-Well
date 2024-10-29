uniform float u_amplitude;
uniform float u_inner_radius;

#define PI 3.14

float in_boundary(float x) {
    return -u_inner_radius <= x && x <= u_inner_radius ? 1.0 : 0.0;
}

float gravitational_well(float x) {
    float f = -cos((x * PI) / u_inner_radius) * u_amplitude - u_amplitude;
    return f * in_boundary(x);
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float y = length(modelPosition.xz);
    modelPosition.y += gravitational_well(y);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

}