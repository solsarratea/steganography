function Shader(scene) {
    var geometry = new THREE.PlaneBufferGeometry( 2,2);
    var texture  = new THREE.TextureLoader().load("textures/q2.jpg");
    var hiddenTexture  = new THREE.TextureLoader().load("textures/q1.jpg");


    var material = new THREE.ShaderMaterial( {
        uniforms: {
            resolution : { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight) },
            decode : { value: true},
            tex0: { type: "t", value: texture },
            tex1: { type: "t", value: hiddenTexture },
            time: { type: "f", value: 150.},
         },
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        vertexShader: document.getElementById( 'vertexShader' ).textContent
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
    }
}
