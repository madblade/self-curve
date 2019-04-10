// Init libs
var mathbox = mathBox({
    plugins: ['core', 'controls', 'cursor', 'mathbox'],
    controls: {
        klass: THREE.OrbitControls // Orbit controls, i.e. Euler angles, with gimbal lock
        //klass: THREE.TrackballControls // Trackball controls, i.e. Free quaternion rotation
    }
});

if (mathbox.fallback) throw "WebGL not supported";
var three = mathbox.three;
three.renderer.setClearColor(new THREE.Color(256.0, 256.0, 256.0), 1.0);
var camera = mathbox.camera({proxy: true, position: [0, 0, 10]});
var view = mathbox.cartesian({range: [[-2, 2], [-2, 2], [-2, 2]], scale: [4, 4, 2]});
mathbox.set('focus', 3);

$('#button').on('click', function(event) {
    event.preventDefault(); // To prevent following the link (optional)
    // performDemo();
});


/** ############## PRESENTATION */

var present = mathbox.present({index: 0});
var slide = present.clock().slide({id: 'top'});

// Axes + grid
slide.cartesian({ range: [[-2, 2], [-2, 2], [-2, 2]], scale: [4, 4, 3], position: [0, -.55]})
    .axis({axis: 1, width: 3, detail: 256})
    .axis({axis: 2, width: 3, detail: 256})
    .axis({axis: 3, width: 3, detail: 256})
    .grid({width: 0.5, divideX: 20, divideY: 20})
;

mathbox.select('axis').set('color', 'black');
slide
    .cartesian({ range: [[-2, 2], [-2, 2], [-2, 2]], scale: [4, 4, 3], position: [0, -.55]})
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
        color: 0x00FFFF,
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

let nbSlides = 15;
// $(window).keydown(function(e) {});

$('#halfmunkres').hide();
top.onkeydown = function(e) {
    switch (e.keyCode) {
        case 81:
            let a = present[0].get('index') + 1;
            //console.log(a);
            return present[0].set('index', Math.max(present[0].get('index') - 1, 0));
        case 68:
            let b = present[0].get('index') + 1;
            //console.log(b);
            console.log("Next slide.");
            return present[0].set('index', Math.min(present[0].get('index') + 1, nbSlides));
    }
};
