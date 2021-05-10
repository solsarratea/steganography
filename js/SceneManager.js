function SceneManager(canvas) {

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height,
    }

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene);
    const sceneControls = {
        decode: false,
        updateTex0: false,
        updateTex1: false,
        shift: 4,
        pixels: 240,
    };
    const guiControls = addGuiControls();

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");

        return scene;
    }


    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true,  preserveDrawingBuffer: true  });
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        return renderer;
    }

    function buildCamera({ width, height }) {
      const camera = new THREE.Camera();
        return camera;
    }

    function createSceneSubjects(scene,buffer) {
        let sceneSubjects;
        let url = window.location.href.split("/").reverse()[0];
        if (url =='decode'){
            sceneSubjects = [
                new Decoder(scene)
            ]
        }else {
            sceneSubjects = [
                new Shader(scene),
            ];
        }

        return sceneSubjects;
    }


    function addGuiControls(){

       const datGui  = new dat.GUI({ autoPlace: true });
       var toggleDecode = { decode:function(){
           sceneControls.decode = true; }};
       var toggleEncode = { hide:function(){
           sceneControls.decode = false; }};
        let url = window.location.href.split("/").reverse()[0];
        let folder;
        if (url != 'decode') {
         folder = datGui.addFolder(`create secret image`)
         folder.add(toggleEncode,'hide');
         folder.add(toggleDecode,'decode');
         folder.add({bits: 4},'bits').min(0).max(8).step(1).onFinishChange(function(val ){ sceneControls.pixels= val })
            folder.add({shift: 4},'shift').min(0).max(8).step(1).onFinishChange(function(val ){ sceneControls.shift= val })
        } else {
         folder = datGui.addFolder(`decode message`)
         folder.add(toggleEncode,'hide');
         folder.add(toggleDecode,'decode');
         folder.add({bits: 4},'bits').min(0).max(8).step(1).onFinishChange(function(val ){ sceneControls.pixels= val })
        }
        folder.open();

    }

    this.updateSource = function() {
        sceneControls.updateTex0 = true;
    }

    this.updateHidden = function() {
        sceneControls.updateTex1 = true;
    }

    this.update = function() {
        var elapsedTime = 0;
        if (sceneControls.start){
            elapsedTime = clock.getElapsedTime();
        }
        for(let i=0; i<sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime,sceneControls);

        renderer.render(scene, camera);
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;

        renderer.setSize(width, height);
    }


}
