
precision highp float;

out vec2 vUv; 

void main(){
    gl_Position=  modelMatrix * vec4(position,0.5);
    vUv = uv;
}