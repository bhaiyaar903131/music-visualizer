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

function createLights() {
    var ambientLight = new THREE.AmbientLight(0x505050);
    scene.add(ambientLight);

    var lightOne = new THREE.DirectionalLight(0xffffff, 0.7);
    lightOne.position.set(0, 1, 1);
    scene.add(lightOne);

    var lightTwo = new THREE.DirectionalLight(0xffffff, 0.7);
    lightTwo.position.set(1, 1, 0);
    scene.add(lightTwo);

    var lightThree = new THREE.DirectionalLight(0xffffff, 0.7);
    lightThree.position.set(0, -1, -1);
    scene.add(lightThree);

    var lightFour = new THREE.DirectionalLight(0xffffff, 0.7);
    lightFour.position.set(-1, -1, 0);
    scene.add(lightFour);
}

function createFloorGuide() {
    var guideGeometry = new THREE.PlaneGeometry(70, 270);
    var guideMaterial = new THREE.MeshBasicMaterial({
        color: 0x030303,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
    });
    var guide = new THREE.Mesh(guideGeometry, guideMaterial);
    guide.rotation.x = -Math.PI / 2;
    guide.position.y = -1;
    guide.position.z = 95;
    scene.add(guide);
}

createLights();
createFloorGuide();
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

function setCameraLens(fieldOfView, nearPlane, farPlane) {
    camera.fov = fieldOfView;
    camera.near = nearPlane;
    camera.far = farPlane;
    camera.updateProjectionMatrix();
}

function setOrbitBehavior() {
    controls.autoRotate = false;
    controls.autoRotateSpeed = 2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
}

function faceCameraTowardBars() {
    var target = new THREE.Vector3(0, 0, 95);
    camera.lookAt(target);
    controls.target.copy(target);
    controls.update();
}

function prepareCameraAndControls() {
    setCameraLens(65, 1, 1000);
    setOrbitBehavior();
    faceCameraTowardBars();
}

prepareCameraAndControls();
renderStillFrame();

function resetCameraHome() {
    camera.position.set(32, 50, 50);
    controls.target.set(0, 0, 95);
    camera.lookAt(controls.target);
    controls.update();
}
