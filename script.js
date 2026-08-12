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

function createBars() {
    bars = [];

    var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    var material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        flatShading: false,
        specular: 0xffffff,
        shininess: 14,
        reflectivity: 2,
        fog: false
    });

    var rowIndex = 0;
    for (var z = 0; z <= 256; z += 2) {
        bars[rowIndex] = [];

        var columnIndex = 0;
        for (var x = 0; x <= 62; x += 2) {
            var bar = new THREE.Mesh(geometry, material);
            bar.position.x = x - 30;
            bar.position.y = 0;
            bar.position.z = z;
            scene.add(bar);
            bars[rowIndex][columnIndex] = bar;
            columnIndex += 1;
        }

        rowIndex += 1;
    }
}

function resetBars() {
    for (var row = 0; row < bars.length; row += 1) {
        for (var column = 0; column < bars[row].length; column += 1) {
            bars[row][column].scale.y = 1;
        }
    }
}

function centerCameraOnBars() {
    controls.target.set(0, 0, 95);
    camera.lookAt(controls.target);
    controls.update();
}

createBars();
centerCameraOnBars();
renderStillFrame();

function createFloatingShapes() {
    floatingShapes = [];

    var geometry = new THREE.TetrahedronGeometry(Math.random() + 0.5, 2);
    var material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        flatShading: true
    });

    for (var index = 0; index < 1000; index += 1) {
        var shape = new THREE.Mesh(geometry, material);
        shape.position.x = (Math.random() - 0.5) * 300;
        shape.position.y = (Math.random() - 0.5) * 300;
        shape.position.z = (Math.random() - 0.5) * 300;
        shape.scale.x = 0.5 + Math.random() * 1.5;
        shape.scale.y = 0.5 + Math.random() * 1.5;
        shape.scale.z = 0.5 + Math.random() * 1.5;
        shape.rotation.set(
            Math.random() * 4,
            Math.random() * 4,
            Math.random() * 4
        );
        scene.add(shape);
        floatingShapes.push(shape);
    }
}

function rotateFloatingShapes() {
    for (var index = 0; index < floatingShapes.length; index += 1) {
        var shape = floatingShapes[index];
        shape.rotation.z += 0.02;
    }
}

function tintSceneFromEnergy(energy) {
    if (!bars.length || !bars[0].length) {
        return;
    }

    var material = bars[0][0].material;
    var hue = (0.58 + energy * 0.22) % 1;
    var lightness = 0.42 + energy * 0.18;
    material.color.setHSL(hue, 0.72, lightness);
}

createFloatingShapes();
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

function forEachBar(callback) {
    for (var row = 0; row < bars.length; row += 1) {
        for (var column = 0; column < bars[row].length; column += 1) {
            callback(bars[row][column], row, column);
        }
    }
}

function setEveryBarHeight(height) {
    forEachBar(function (bar) {
        bar.scale.y = height;
    });
}

function getBarMaterial() {
    if (!bars.length || !bars[0].length) {
        return null;
    }
    return bars[0][0].material;
}

function prepareBarField() {
    setEveryBarHeight(1);
    centerCameraOnBars();
}

prepareBarField();
renderStillFrame();

function randomRange(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
}

function setShapeRotation(shape) {
    shape.rotation.x = randomRange(0, 4);
    shape.rotation.y = randomRange(0, 4);
    shape.rotation.z = randomRange(0, 4);
}

function setShapeScale(shape) {
    shape.scale.x = randomRange(0.5, 2);
    shape.scale.y = randomRange(0.5, 2);
    shape.scale.z = randomRange(0.5, 2);
}

function setShapePosition(shape) {
    shape.position.x = randomRange(-150, 150);
    shape.position.y = randomRange(-150, 150);
    shape.position.z = randomRange(-150, 150);
}

function refreshFloatingShape(shape) {
    setShapePosition(shape);
    setShapeScale(shape);
    setShapeRotation(shape);
}

function resetCameraHome() {
    camera.position.set(32, 50, 50);
    controls.target.set(0, 0, 95);
    camera.lookAt(controls.target);
    controls.update();
}

function getFloatingShapeCount() {
    return floatingShapes.length;
}
