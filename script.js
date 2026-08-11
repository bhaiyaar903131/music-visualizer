var scene;
var camera;
var renderer;
var controls;
var analyser;
var audioContext;
var sourceNode;
var dataArray;
var bars = [];
var floatingShapes = [];
var animationFrame = null;
var audioPlayer = document.getElementById('audioPlayer');
var fileUpload = document.getElementById('audioFile');
var visualizer = document.getElementById('visualizer');

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    visualizer.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.x = 32;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 90);
    controls.update();
}

function renderStillFrame() {
    if (!renderer || !scene || !camera) {
        return;
    }
    renderer.render(scene, camera);
}

createScene();
renderStillFrame();

function removeOldCanvas() {
    var oldCanvas = visualizer.querySelector('canvas');
    if (oldCanvas && oldCanvas !== renderer.domElement) {
        oldCanvas.remove();
    }
}

function setCameraPosition(x, y, z) {
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
}

function setOrbitTarget(x, y, z) {
    controls.target.x = x;
    controls.target.y = y;
    controls.target.z = z;
    controls.update();
}

function setRendererSize(width, height) {
    renderer.setSize(width, height);
}

function setRendererPixelRatio() {
    var ratio = window.devicePixelRatio || 1;
    renderer.setPixelRatio(Math.min(ratio, 2));
}

function prepareSceneView() {
    removeOldCanvas();
    setCameraPosition(32, 50, 50);
    setOrbitTarget(0, 0, 90);
    setRendererPixelRatio();
    setRendererSize(window.innerWidth, window.innerHeight);
}

prepareSceneView();
renderStillFrame();
