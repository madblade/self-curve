var Simple1DNoise = function() {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var scale = 1;

    var r = [];

    for ( var i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &
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

// function mainFunction(x, y) {
//     return (π / 2 + .6 * Math.sin(x - y + 2 * Math.sin(y)) + .3 * Math.sin(x * 2 + y * 2 * 1.81)
//         + .1825 * Math.sin(x * 3 - y * 2 * 2.18)) - .5;
// }


// My function:
// 1.570796 + .6 * sin(x - y + 2 * sin(y)) + .3 * sin(x * 2 + y * 2 * 1.81) + .1825 * sin(x * 3 - y * 2 * 2.18)) -.5
function multisine(x, y) {
    return (π / 2
        + .6 *    Math.sin(x - y + 2 * Math.sin(y))
        + .3 *    Math.sin(x * 2 + y * 2 * 1.81)
        + .1825 * Math.sin(x * 3 - y * 2 * 2.18)) - .5
}

function multisineT(t, x, y) {
    return (π / 2
        + .6 * Math.sin(x + t - y + 2 * Math.sin(y))
        + .3 * Math.sin(x * 2 + t + y * 2 * 1.81)
        + .1825 * Math.sin(x * 3 + t - y * 2 * 2.18)) - .5;
}

var emitSurfaceBlop = function (emit, x, y, i, j) {
    return emit(x, y, multisine(x, y));
};

var emitSurfaceBlopTime = function (emit, x, y, i, j, t) {
    let t1 = t % (2 * Math.PI);
    return emit(x, y, multisineT(t1, x, y));
};

var curveResolution = 256;

var resoCross = curveResolution;
var segmentResolution = 2;
var generator = Simple1DNoise();
var noise1D = [];
for (let i = 0; i < curveResolution; ++i)
    noise1D.push(generator.getVal(i / 15));

var curve = function(emit, x, i, t) {
    let xx = x * Math.PI / 2;
    let normalX = (x+2)/4;
    let distStart = normalX;
    let distEnd = Math.abs(1 - normalX);

    let ind = Math.floor((curveResolution-1) * normalX);
    let c1 = 10.0 * distStart * distEnd * noise1D[ind];
    let c2 = 0.5;

    return emit(
        c2 * (1.0 + c1) * Math.cos(xx),
        c2 * (1.0 + c1) * Math.sin(xx)
    );
};

var pp1 = -0.5;
var pp2 = -1.2;
var segment = function(emit, x, i, t) {
    let xp = (x < 0 ? pp1:pp2);
    let xx = xp * Math.PI / 2;
    let normalX = (xp+2)/4;
    let distStart = normalX;
    let distEnd = Math.abs(1 - normalX);

    let ind = Math.floor((curveResolution-1) * normalX);
    let c1 = 10.0 * distStart * distEnd * noise1D[ind];
    let c2 = 0.5;

    return emit(
        c2 * (1.0 + c1) * Math.cos(xx),
        c2 * (1.0 + c1) * Math.sin(xx)
    );
};

var segment2 = function(emit, x, i, t) {
    let bottom = (x > 0);
    let xp1 = pp1;
    let xx = xp1 * Math.PI / 2;
    let normalX = (xp1+2)/4;
    let distStart = normalX;
    let distEnd = Math.abs(1 - normalX);

    let ind = Math.floor((curveResolution-1) * normalX);
    let c1 = 10.0 * distStart * distEnd * noise1D[ind];
    let c2 = 0.5;
    let x1 = c2 * (1.0 + c1) * Math.cos(xx);
    let y1 = c2 * (1.0 + c1) * Math.sin(xx);

    let xp2 = pp2;
    xx = xp2 * Math.PI / 2;
    normalX = (xp2+2)/4;
    distStart = normalX;
    distEnd = Math.abs(1 - normalX);
    ind = Math.floor((curveResolution-1) * normalX);
    c1 = 10.0 * distStart * distEnd * noise1D[ind];
    c2 = 0.5;
    let x2 = c2 * (1.0 + c1) * Math.cos(xx);
    let y2 = c2 * (1.0 + c1) * Math.sin(xx);

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
    let xp1 = x;
    let xx = xp1 * Math.PI / 2;
    let normalX = (xp1+2)/4;
    let distStart = normalX;
    let distEnd = Math.abs(1 - normalX);

    let ind = Math.floor((curveResolution-1) * normalX);
    let c1 = 10.0 * distStart * distEnd * noise1D[ind];
    let c2 = 0.5;
    let x1 = c2 * (1.0 + c1) * Math.cos(xx);
    let y1 = c2 * (1.0 + c1) * Math.sin(xx);

    let xp2 = y;
    xx = xp2 * Math.PI / 2;
    normalX = (xp2+2)/4;
    distStart = normalX;
    distEnd = Math.abs(1 - normalX);
    ind = Math.floor((curveResolution-1) * normalX);
    c1 = 10.0 * distStart * distEnd * noise1D[ind];
    c2 = 0.5;
    let x2 = c2 * (1.0 + c1) * Math.cos(xx);
    let y2 = c2 * (1.0 + c1) * Math.sin(xx);

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

var lle = 10;
for (let uu = 0; uu < lle; ++uu) {
    let x = uu / lle;
    for (let vv = 0; vv < lle; ++vv) {
        let y = vv / lle;

        let xs = 2 * x / (1 + x*x + y*y);
        let ys = 2 * y / (1 + x*x + y*y);
        let zs = (-1 + x*x + y*y) / (1 + x*x + y*y);

        let lx = xs * xs;
        let ly = ys * ys;
        let lz = zs * zs;
        let tlength = 14;
        let lca = 0;
        let lcb = 0;
        if (xs > 0) {
            let stop = Math.floor(lx*divNb);
            let dep = lx - stop/divNb;
            for (let i = 0; i < stop; ++i)
                if (cols[i] === 'b')
                    lcb += 1/divNb;
                else lca += 1/divNb;
            if (dep > 0)
                if (cols[stop+1] === 'b')
                    lcb+=dep;
                else lcb+=dep;
        }
        if (ys > 0) {
            let start = Math.floor(lx*divNb);
            let dep0 = lx - start/divNb;
            if (dep0 > 0) {
                if (cols[start] === 'b')
                    lcb+=(1/divNb + dep0);
                else lcb+=(1/divNb + dep0);
            }
            start += 1;

            let stop = Math.floor(ly*divNb);
            let dep = ly - stop/divNb;
            for (let i = start; i < stop; ++i)
                if (cols[i] === 'b')
                    lcb += 1/divNb;
                else lca += 1/divNb;
            if (dep > 0)
                if (cols[stop+1] === 'b')
                    lcb+=dep;
                else lcb+=dep;
        }
        if (xs > 0) {
            let start = Math.floor(ly*divNb);
            let dep0 = ly - start/divNb;
            if (dep0 > 0) {
                if (cols[start] === 'b')
                    lcb+=(1/divNb + dep0);
                else lcb+=(1/divNb + dep0);
            }
            start += 1;

            let stop = Math.floor(lz*divNb);
            let dep = lz - stop/divNb;
            for (let i = start; i < stop; ++i)
                if (cols[i] === 'b')
                    lcb += 1/divNb;
                else lca += 1/divNb;
            if (dep > 0)
                if (cols[stop+1] === 'b')
                    lcb+=dep;
                else lcb+=dep;
        }

        voxData .push([x, y, 0.0]);
        voxData .push([x+lca, y+lcb, 0.0]);
        voxData .push([x+lca, y+lcb, 0.0]);
    }
}

console.log(voxData);
