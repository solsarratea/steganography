let vertexShader =`varying vec2 texCoordVarying;
   uniform bool decode;
   uniform vec2 resolution;

   void main() {
   texCoordVarying = uv;
   gl_Position =   projectionMatrix *
   modelViewMatrix *
     vec4(position,1.0);
 }
`

let fragmentShader =`uniform bool decode;
uniform vec2 resolution;
varying vec2 texCoordVarying;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform int pixels;
uniform int shift;

uniform float time;

struct RGB{
    uint r;
    uint g;
    uint b;
};

void encode_image(inout RGB dstPixel, RGB srcPixel)
{
    dstPixel.r = (dstPixel.r & uint(pixels)) | (srcPixel.r & uint(255)) >> shift;
    dstPixel.g = (dstPixel.g & uint(pixels)) | (srcPixel.g & uint(255)) >> shift;
    dstPixel.b = (dstPixel.b & uint(pixels)) | (srcPixel.b & uint(255)) >> shift;
}


void decode_image(inout RGB dstPixel)
{
    dstPixel.r = (dstPixel.r & uint(~pixels)) << shift;
    dstPixel.g = (dstPixel.g & uint(~pixels)) << shift;
    dstPixel.b = (dstPixel.b & uint(~pixels)) << shift;
}
////////////////////////////////////////////////////////

void main()
{
    vec2 uv = texCoordVarying * vec2(resolution.x/resolution.y, 1.0);

    vec3 img1 ; vec3 img2;

    img1 = texture2D(tex0, texCoordVarying).xyz;
    img2 = texture2D(tex1, texCoordVarying).xyz;
    vec3 color;

    RGB dstPixel;RGB srcPixel;

    dstPixel.r = uint(img1.r*255.);
    dstPixel.g = uint(img1.g*255.);
    dstPixel.b = uint(img1.b*255.);

    srcPixel.r = uint(img2.r*255.);
    srcPixel.g = uint(img2.g*255.);
    srcPixel.b = uint(img2.b*255.);

    //Encode texture
    encode_image(dstPixel, srcPixel);
    //Decode texture
    if(decode){
        decode_image(dstPixel);
    }

     gl_FragColor = vec4(float(dstPixel.r)/255.,float(dstPixel.g)/255., float(dstPixel.b)/255.,1.0);
}
`

function Shader(scene) {
    var geometry = new THREE.PlaneBufferGeometry( 2,2);
    var texture  = new THREE.TextureLoader().load("textures/q2.jpg");
    var hiddenTexture  = new THREE.TextureLoader().load("textures/q1.jpg");
    let pixelsMap = {
        0: 0,
        1: 128,
        2: 192,
        3: 224,
        4: 240,
        5: 248,
        6: 252,
        7: 254,
        8: 255,
    }


    var material = new THREE.ShaderMaterial( {
        uniforms: {
            resolution : { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight) },
            decode : { value: true},
            tex0: { type: "t", value: texture },
            tex1: { type: "t", value: hiddenTexture },
            time: { type: "f", value: 150.},
            shift: { type: "i", value: 4 },
            pixels: { type: "i", value: 240},
        },
        fragmentShader: fragmentShader,
        vertexShader: vertexShader
    });

    var shaderObject = new THREE.Mesh( geometry, material );
    scene.add( shaderObject );

    this.update = function(time, sceneControls) {
        material.uniforms.decode.value = sceneControls.decode;
        if (sceneControls.updateTex0){
            var path  = localStorage.getItem("source");
            var texture  = new THREE.TextureLoader().load(path);
            material.uniforms.tex0.value = texture
            sceneControls.updateTex0 = false;

        }

        if (sceneControls.updateTex1){
            var path  = localStorage.getItem("hidden");
            var texture  = new THREE.TextureLoader().load(path);
            material.uniforms.tex1.value = texture
            sceneControls.updateTex1 = false;

        }

        if ( material.uniforms.pixels.value != sceneControls.pixels){
            material.uniforms.pixels.value = pixelsMap[sceneControls.pixels];
        }

        if ( material.uniforms.shift.value != sceneControls.shift){
            material.uniforms.shift.value = sceneControls.shift;
        }
    }
}
