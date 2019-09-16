// Init three
var scene, renderer;
var camera;
var controls;
var rawLoop, rawMesh;
var colorLoop, colorMesh;

init();
animate();
function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth - 15, window.innerHeight - 15);
    renderer.setClearColor(new THREE.Color(256, 256, 256));
    document.body.appendChild( renderer.domElement );

    // Cam
    camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;
    camera.position.y = 300;

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
        // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    scene = new THREE.Scene();
    var gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    gridHelper.position.y = 0;
    gridHelper.position.x = 0;
    scene.add(gridHelper);

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(light);

    var resolution = 100;

    var loop = generateClosedCurve(resolution);
    var loopSkeleton = loop[0];
    var loopMesh = loop[1];
    colorLoop = loopMesh;
    scene.add(loopMesh);

    var plane = generatePlane(
        resolution - 1,
        resolution - 1,
        loopSkeleton,
        true
    );
    colorMesh = plane;
    scene.add(plane);

    // Listeners
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    // var time = - performance.now() * 0.0003;
    // camera.position.x = 400 * Math.cos( time );
    // camera.position.z = 400 * Math.sin( time );
    // camera.lookAt( scene.position );

    if (controls) controls.update();

    renderer.render( scene, camera );
}

function reinitObjects() {
    if (colorLoop) scene.remove(colorLoop);
    if (colorMesh) scene.remove(colorMesh);
    if (rawLoop) scene.remove(rawLoop);
    if (rawMesh) scene.remove(rawMesh);
    colorLoop = undefined;
    colorMesh = undefined;
    rawLoop = undefined;
    rawMesh = undefined;
}

var nbSlides = 15;
$('#halfmunkres').hide();
document
    .getElementById('genraw')
    .addEventListener('click', function(e) {
        reinitObjects();
        var resolution = 400;

        var loop = generateClosedCurve(resolution);
        var loopSkeleton = loop[0];
        var loopMesh = loop[1];
        rawLoop = loopMesh;
        scene.add(loopMesh);

        var plane = generatePlane(
            resolution - 1,
            resolution - 1,
            loopSkeleton,
            false
        );
        rawMesh = plane;
        scene.add(plane);
    });

document
    .getElementById('gencol')
    .addEventListener('click', function(e) {
        reinitObjects();

        var resolution = 100;

        var loop = generateClosedCurve(resolution);
        var loopSkeleton = loop[0];
        var loopMesh = loop[1];
        colorLoop = loopMesh;
        scene.add(loopMesh);

        var plane = generatePlane(
            resolution - 1,
            resolution - 1,
            loopSkeleton,
            true
        );
        colorMesh = plane;
        scene.add(plane);
    });
