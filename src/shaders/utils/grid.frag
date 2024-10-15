precision highp float;

#define INTERVAL_DIVISIONS 1.0

#define MAJOR_INTENSITY 0.9
#define MINOR_INTENSITY 0.3

#define PI 3.141592653589793238

// TODO: Implement
void create_axes(vec2 uv) {

}

float create_grid_axes(float x, float spacing) {
  // TODO make line width zoom-independent
    float major = smoothstep(0.995, 1.0, cos(x * (2. * PI) / spacing)) * MAJOR_INTENSITY;
    float minor = smoothstep(0.97, 1.0, cos(x * (2. * PI) * INTERVAL_DIVISIONS / spacing)) * MINOR_INTENSITY;
    return max(major, minor);
}

float create_grid(vec2 uv, float spacing) {
    return create_grid_axes(uv.x, spacing) + create_grid_axes(uv.y, spacing);
}
