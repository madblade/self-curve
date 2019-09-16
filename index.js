// Init three
var scene, renderer;
var camera;
var controls;
init();
animate();
function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(new THREE.Color(256, 256, 256));
    document.body.appendChild( renderer.domElement );

    // Cam
    camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    // Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.enableDamping = true;
        // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    scene = new THREE.Scene();
    var gridHelper = new THREE.GridHelper( 400, 40, 0x0000ff, 0x808080 );
    gridHelper.position.y = 0;
    gridHelper.position.x = 0;
    scene.add( gridHelper );
    // var polarGridHelper = new THREE.PolarGridHelper( 200, 16, 8, 64, 0x0000ff, 0x808080 );
    // polarGridHelper.position.y = -150;
    // polarGridHelper.position.x = -150;
    // scene.add( polarGridHelper);

    var light = new THREE.PointLight( 0xffffff, 1, 1000);
    light.position.set( 0, 200, 0 );
    scene.add( light );

    var loop = generateClosedCurve(256);
    scene.add(loop);

    var plane = generatePlane();
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

    controls.update();

    renderer.render( scene, camera );
}



// Old mathbox
/*

// Axes + grid
slide.cartesian({ range: [[-2, 2], [-2, 2], [-2, 2]], scale: [4, 2, 3], position: [0, -.55]})
    // .axis({axis: 1, width: 3, detail: 256})
    // .axis({axis: 2, width: 3, detail: 256})
    // .axis({axis: 3, width: 3, detail: 256})
    .grid({width: 0.5, divideX: 20, divideY: 20})
;

mathbox.select('axis').set('color', 'black');
slide
    .cartesian({ range: [[-2, 2], [-2, 2], [-2, 2]], scale: [4, 2, 3], position: [0, -.55]})
    .slide()

    // .area({ axes: [1, 3], channels: 2, width: curveResolution, expr: curve})
    // .line({color: '#c56949', size: 15, opacity: 1, zIndex: 2 })
    // .slide()

    .voxel({
        data: [
            voxData
        ],
        height: voxData.length/3,
        items: 3,
        channels: 3
    }).vector({
        color: 0x000000,
        width: 3,
        start: true
    })



// .area({ axes: [1, 3], channels: 2, width: segmentResolution, expr: segment})
    // .line({color: '#3a46fd', size: 15, opacity: 1, zIndex: 2 })
    // .slide()

    // .area({ axes: [1, 3], channels: 2, width: segmentResolution, expr: segment})
    // .point({color: '#3a46fd', size: 20, opacity: 1, zIndex: 2 })
    // .slide()

    // .area({ axes: [1, 3], channels: 3, width: segmentResolution, expr: segment2})
    // .line({color: '#3a46fd', size: 50, opacity: 1, zIndex: 2 })
    // .slide()

    // .area({ axes: [1, 3], channels: 3, width: segmentResolution-1, expr: segment2})
    // .point({color: '#3a46fd', size: 20, opacity: 1, zIndex: 2 })
    // .slide()

    // .area({ axes: [1, 3], channels: 3, width: resoCross, height: resoCross, expr: emitSurfaceCross})
    // .surface({ zBias: 3, shaded: true, fill:false, lineX: true,
    //     lineY: true, color: '#474cff', opacity: 0.8})
    // .slide()
    // .area({ axes: [1, 3], channels: 3, width: resoCross, height: resoCross, expr: emitSurfaceCross})
    // .surface({ zBias: 3, shaded: true, lineX: true,
    //     lineY: true, color: '#86b1ff', opacity: 0.8})
    // .slide()

    // .area({ id: 'surfaceArea0', axes: [1, 3], width: 50, height: 25, channels: 3, expr: emitSurfaceBlop})
    // .surface({ zBias: 3, shaded: true, color: '#ff9d00', opacity: 0.8})
    // .slide()
    // .array({ id: 'sampler2', length: dataCritMin.length, data: dataCritMin, items: 3, channels: 3 })
    // .point({ color: '#0000AA', size: 20, zIndex: 2})
    // .slide()
    // .array({ id: 'sampler3', length: dataCritMax.length, data: dataCritMax, items: 3, channels: 3})
    // .point({ color: '#ff0b00', size: 20, zIndex: 2})
    // .slide()
    // .array({ id: 'sampler4', length: dataCritSad.length, data: dataCritSad, items: 3, channels: 3 })
    // .point({ color: '#ffffff', size: 20, zIndex: 2})
    // .slide()

    // .area({ axes: [1, 3], channels: 3, width: 10, height: pd.length, expr: pathMinToMax })
    // .line({color: '#f8fffd', size: 15, opacity: 1, zIndex: 2 })
    // .end().end().end()
    // .end()
    .end()

    // .slide()
    // .area({ id: 'surfaceArea1', axes: [1, 3], width: 193, height: 97, channels: 3, expr: emitSurfaceBlopTime })
    // .surface({ zBias: 3, shaded: true, color: '#ff9d00', opacity: 0.8})
    // .slide()
    // .end();
    // .array({ id: 'sampler5', length: 100, expr: emitCriticalMin, items: 3, channels: 3 })
    // .point({ color: '#0000ff', size: 20, zIndex: 2})
    // .slide()
    // .array({ id: 'sampler6', length: 100, expr: emitCriticalMax, items: 3, channels: 3 })
    // .point({ color: '#ff0009', size: 20, zIndex: 2})
    // .slide()
    // .array({ id: 'sampler7', length: 100, expr: emitCriticalSad, items: 3, channels: 3 })
    // .point({ color: '#fffbfe', size: 20, zIndex: 2})
    // .slide()
    // .area({ axes: [1, 3], channels: 3, width: 10, height: pd.length, expr: emitCriticalPath })
    // .line({color: '#f8fffd', size: 15, opacity: 1, zIndex: 2 })
    // .slide().slide()
    // .area({ axes: [1, 3], channels: 3, width: 100, height: 100, expr: emitTracking })
    // .line({color: '#1fff00', size: 15, opacity: 1, zIndex: 2 });

// color: '#B8860B',
*/

var nbSlides = 15;
// $(window).keydown(function(e) {});

$('#halfmunkres').hide();
document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 81:
            console.log('left');
            break;
        case 68:
            console.log('right');
            break;
    }
});
