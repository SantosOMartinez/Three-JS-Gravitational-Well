precision highp float;

#include "utils/grid.frag"

#define PI 3.141592653589793238

#define RGB_BLACK vec4(0.1, 0.1, 0.1, 1.0)
#define RGB_GRAY vec4(0.25, 0.25, 0.25, 1.0)

uniform float u_time;
uniform float u_delay;
uniform float u_scale;
uniform vec3 u_color;
uniform vec2 u_transform;
uniform float u_thickness;

in vec2 vUv;
// Explicitly specify locations for each fragment output
layout(location = 0) out vec4 fragColor;

float f(in float x) {
    float time = u_time / u_delay;
    return sin(x * 20.0 * sin(time)) * sin(x * 3.0);
}

float constant_thickness(in vec2 uv, in float y, in float thickness) {
 // Normalize y to the range of uv.y (which is in [0, 1] range)
    float normalizedY = (y + 1.0) * 0.5;  // scale y from [-1, 1] to [0, 1]

    // Define the signed distance function for the curve
    float sdf = normalizedY - uv.y;  // Signed distance to the function

    // Determine the thickness using the absolute value of the signed distance
    return 1.0 - step(thickness, abs(sdf));  // 1 if inside the line, 0 if outside
}

mat2 scale(vec2 _scale) {
    return mat2(_scale.x, 0.0, 0.0, _scale.y);
}

void main() {
    vec2 uv = vUv - 0.5;
    uv *= scale(vec2(u_scale));
    uv += vec2(u_transform.x, u_transform.y);

    // Get the x coordinate from uv
    float x = uv.x * 2.0 * PI;  // scale x to range [0, 2 * PI]
    // Compute y = sin(x * 6) * 0.5
    float y = f(x);
    // Make sure the line is of constant thickness
    y = constant_thickness(uv, y, u_thickness);

    vec4 background = RGB_BLACK;
    vec4 foreground = vec4(u_color, 1.0);

    // Draw the grid with the given spacing
    float grid = create_grid(uv, 1.0 / u_scale);
    ;

    // Draw the axes (highlight the center lines)
    // float axes = create_axes(uv);

    fragColor = background;

    fragColor = mix(fragColor, RGB_GRAY, grid); // Grid
    // fragColor = mix(fragColor, RGB_GRAY, axes);          // Axes

    //fragColor = mix(fragColor, RGB_GRAY, create_grid(uv, 10.0, 0.01));
    fragColor = mix(fragColor, foreground, y);
}
