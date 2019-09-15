var Simple1DNoise = function()
{
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var nbPoints = 15;
    var scale = 1 / nbPoints;

    var r = [];

    // Quick and dirty loop.
    var fmn = Math.floor(MAX_VERTICES / nbPoints);
    for ( var i = 0; i < fmn; ++i ) {
        r.push(Math.random());
    }
    for ( var j = 1; j < 15; ++j ) {
        for ( var i = 0; i < fmn; ++i ) {
            r.push(r[i]);
        }
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        // Modulo using &
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
     * Linear interpolation function.
     * @param a The lower integer value
     * @param b The upper integer value
     * @param t The value between the two
     * @returns {number}
     */
    var lerp = function(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function(newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function(newScale) {
            scale = newScale;
        }
    };
};

var curveResolution = 256;
function generateClosedCurve(resolution)
{
    var generator = Simple1DNoise();
    var noise1D = [];
    for (var idx = 0; idx < resolution; ++idx)
        noise1D.push(generator.getVal(idx));

    // console.log(noise1D[0]);
    // console.log(noise1D[noise1D.length-1]);

    var lineMaterial = new MeshLineMaterial({
        color: 0xff8800,
        lineWidth: 1,
        clipping: false
    });

    var geometry = new THREE.Geometry();
    for (var x = 0; x < resolution; ++x) {
        var xx = (x / resolution) * 2 * Math.PI;
        var c1 = 50 + 150 * noise1D[x];

        var coordX = c1 * Math.cos(xx);
        var coordY = c1 * Math.sin(xx);

        geometry.vertices.push(
            new THREE.Vector3(
                coordX,
                1,
                coordY
            )
        );
    }

    // var material = new THREE.LineBasicMaterial({
    //     color: 0xff8800
    // });
    // var line = new THREE.Line( geometry, material );

    var line = new MeshLine();
    line.setGeometry(geometry);
    var meshLineMesh = new THREE.Mesh(line.geometry, lineMaterial);

    return meshLineMesh;
}

//

var curve = function(emit, x, i, t) {
    var xx = x * Math.PI / 2;
    var normalX = (x+2)/4;
    var distStart = normalX;
    var distEnd = Math.abs(1 - normalX);

    var ind = Math.floor((curveResolution-1) * normalX);
    var c1 = 10.0 * distStart * distEnd * noise1D[ind];
    var c2 = 0.5;

    return emit(
        c2 * (1.0 + c1) * Math.cos(xx),
        c2 * (1.0 + c1) * Math.sin(xx)
    );
};

var pp1 = -0.5;
var pp2 = -1.2;
var segment = function(emit, x, i, t) {
    var xp = (x < 0 ? pp1:pp2);
    var xx = xp * Math.PI / 2;
    var normalX = (xp+2)/4;
    var distStart = normalX;
    var distEnd = Math.abs(1 - normalX);

    var ind = Math.floor((curveResolution-1) * normalX);
    var c1 = 10.0 * distStart * distEnd * noise1D[ind];
    var c2 = 0.5;

    return emit(
        c2 * (1.0 + c1) * Math.cos(xx),
        c2 * (1.0 + c1) * Math.sin(xx)
    );
};

var segment2 = function(emit, x, i, t) {
    var bottom = (x > 0);
    var xp1 = pp1;
    var xx = xp1 * Math.PI / 2;
    var normalX = (xp1+2)/4;
    var distStart = normalX;
    var distEnd = Math.abs(1 - normalX);

    var ind = Math.floor((curveResolution-1) * normalX);
    var c1 = 10.0 * distStart * distEnd * noise1D[ind];
    var c2 = 0.5;
    var x1 = c2 * (1.0 + c1) * Math.cos(xx);
    var y1 = c2 * (1.0 + c1) * Math.sin(xx);

    var xp2 = pp2;
    xx = xp2 * Math.PI / 2;
    normalX = (xp2+2)/4;
    distStart = normalX;
    distEnd = Math.abs(1 - normalX);
    ind = Math.floor((curveResolution-1) * normalX);
    c1 = 10.0 * distStart * distEnd * noise1D[ind];
    c2 = 0.5;
    var x2 = c2 * (1.0 + c1) * Math.cos(xx);
    var y2 = c2 * (1.0 + c1) * Math.sin(xx);

    return emit(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        bottom ? 0 : Math.sqrt(
        Math.pow(x2-x1, 2) +
           Math.pow(y2-y1, 2)
        )
    );
};

var emitSurfaceCross = function(emit, x, y, i, j) {
    var xp1 = x;
    var xx = xp1 * Math.PI / 2;
    var normalX = (xp1+2)/4;
    var distStart = normalX;
    var distEnd = Math.abs(1 - normalX);

    var ind = Math.floor((curveResolution-1) * normalX);
    var c1 = 10.0 * distStart * distEnd * noise1D[ind];
    var c2 = 0.5;
    var x1 = c2 * (1.0 + c1) * Math.cos(xx);
    var y1 = c2 * (1.0 + c1) * Math.sin(xx);

    var xp2 = y;
    xx = xp2 * Math.PI / 2;
    normalX = (xp2+2)/4;
    distStart = normalX;
    distEnd = Math.abs(1 - normalX);
    ind = Math.floor((curveResolution-1) * normalX);
    c1 = 10.0 * distStart * distEnd * noise1D[ind];
    c2 = 0.5;
    var x2 = c2 * (1.0 + c1) * Math.cos(xx);
    var y2 = c2 * (1.0 + c1) * Math.sin(xx);

    return emit(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        Math.sqrt(
            Math.pow(x2-x1, 2) +
            Math.pow(y2-y1, 2)
        )
    );
};

var voxData = [];

var cols = ['b','b','b','o','b','b','b','o',
'b','b','o','o','o','o'];
var divNb = cols.length;

var lle = 5;
for (var uu = -lle; uu < lle; uu+=0.25) {
    var x = uu / lle - 0.0001;
    x *= 2.0;
    for (var vv = -lle; vv < lle; vv+=0.5) {
        var y = vv / lle - 0.0001;
        y *= 2.0;

        var xs = 2 * x / (1 + x*x + y*y);
        var ys = 2 * y / (1 + x*x + y*y);
        var zs = (-1 + x*x + y*y) / (1 + x*x + y*y);

        var lx = xs * xs;
        var ly = ys * ys;
        var lz = zs * zs;
        var tlength = 14;
        var lca = 0;
        var lcb = 0;
        if (xs > 0) {
            var stop = Math.floor(lx*divNb);
            var dep = lx - stop/divNb;
            for (var i = 0; i < stop; ++i)
                if (cols[i] === 'b')
                    lcb += 1/divNb;
                else lca += 1/divNb;
            if (dep > 0)
                if (cols[stop+1] === 'b')
                    lcb+=dep;
                else lcb+=dep;
        }
        if (ys > 0) {
            var start = Math.floor(lx*divNb);
            var dep0 = lx - start/divNb;
            if (dep0 > 0) {
                if (cols[start] === 'b')
                    lcb+=(1/divNb + dep0);
                else lcb+=(1/divNb + dep0);
            }
            start += 1;

            var stop = Math.floor(ly*divNb);
            var dep = ly - stop/divNb;
            for (var i = start; i < stop; ++i)
                if (cols[i] === 'b')
                    lcb += 1/divNb;
                else lca += 1/divNb;
            if (dep > 0)
                if (cols[stop+1] === 'b')
                    lcb+=dep;
                else lcb+=dep;
        }
        if (zs > 0) {
            var start = Math.floor(ly*divNb);
            var dep0 = ly - start/divNb;
            if (dep0 > 0) {
                if (cols[start] === 'b')
                    lcb+=(1/divNb + dep0);
                else lcb+=(1/divNb + dep0);
            }
            start += 1;

            var stop = Math.floor(lz*divNb);
            var dep = lz - stop/divNb;
            for (var i = start; i < stop; ++i)
                if (cols[i] === 'b')
                    lcb += 1/divNb;
                else lca += 1/divNb;
            if (dep > 0)
                if (cols[stop+1] === 'b')
                    lcb+=dep;
                else lcb+=dep;
        }

        lca *= 0.1;
        lcb *= 0.1;
        voxData .push([x, y, 0.0]);
        voxData .push([x+lca, y+lcb, 0.0]);
        voxData .push([x+lca, y+lcb, 0.0]);
    }
}

// console.log(voxData);
