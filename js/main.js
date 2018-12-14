var cnvs = document.getElementById('cnvs');
var ctx = cnvs.getContext('2d');
var W = 500;
var H = 500;
var bgColor = "#000";
var	bgColorSoft = "rgba(0,0,0,0.125)"

cnvs.width = W;
cnvs.height = H;
vp = {l:-2 , r:2 , t:2 , b: -2};


function drawPoint(p,r) {
	if(r == null || r == undefined)
		r = 1; 
	ctx.beginPath();
	ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
	ctx.fill();
}

function drawLine(p,q,r) {
	ctx.beginPath();
	ctx.moveTo(p.x,p.y);
	ctx.lineTo(q.x,q.y)
	ctx.stroke();
}


function hardClear(argument) {
	ctx.fillStyle = bgColor ;
	ctx.fillRect(0,0,W,H);
}


function clear(argument) {
	ctx.fillStyle = bgColorSoft ;
	ctx.fillRect(0,0,W,H);
}

function toPixSpace(p){
	return {
		x: W * (p.x-vp.l)/(vp.r - vp.l),
		y: H * (vp.t-p.y)/(vp.t-vp.b)
	}
}

var N = 1000
var particles = []
var oldparticles = []
var maxLife = 2;

var A = [
	[ 1, 0],
	[0, 1]
];
var dt = 10/1000;

function genPoint() {
	return{
		x:Math.random()*(vp.r-vp.l) + vp.l,
		y:Math.random()*(vp.t-vp.b) + vp.b,
		life:maxLife
	}
}
function norm2(p) {
	return p.x*p.x + p.y*p.y;
}


var updtBtn = document.getElementById('updtBtn');

var input11 = document.getElementById('input11');
var input12 = document.getElementById('input12');
var input21 = document.getElementById('input21');
var input22 = document.getElementById('input22');

updtBtn.onclick = function () {
	A = [
		[ input11.value * 1, input12.value * 1],
		[ input21.value * 1, input22.value * 1]
	];
}



function init(){
	for (var i = 0; i < N; i++) {
		particles[i] = genPoint();
		particles[i].life = maxLife * Math.random();
		
		oldparticles[i] = {
			x:particles[i].x,
			y:particles[i].y
		}
	}

	ctx.lineWidth = 2;
	ctx.lineCap = 'round'
 	hardClear();
	setInterval(loop,dt*1000)
}

function loop() {
	update();
	render();
}
function update() {
	var velox , veloy;
	for (var i = 0; i < N; i++) {
		oldparticles[i] = {
			x:particles[i].x,
			y:particles[i].y
		}

		velox = A[0][0]*particles[i].x +A[0][1]*particles[i].y;
		veloy = A[1][0]*particles[i].x +A[1][1]*particles[i].y;
		particles[i].x += velox *dt;
		particles[i].y += veloy *dt;
		particles[i].life -= dt;

		if (norm2(particles[i])> 9 || norm2(particles[i])< 0.0005) {
			particles[i] = genPoint();
		}

		if(particles[i].life<0){
			particles[i] = genPoint();
		}
	}


	
}

function phi(x) {
	return 4*x -4*x*x;
}

function render() {
	clear();
	ctx.fillStyle = '#311'
	ctx.fillRect(0,H/2,W,1)
	ctx.fillRect(W/2,0,1,H)
	var p = {};
	var q = {};
	
	for (var i = 0; i < N; i++) {
		ctx.strokeStyle = 'rgba(255,255,255,' + 
			phi(particles[i].life / maxLife) + ')';
		p = toPixSpace(oldparticles[i])
		q = toPixSpace(particles[i])
		drawLine(p,q)
	}
}

init()
