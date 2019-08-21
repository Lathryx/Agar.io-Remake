var socket;

let bloob;
let foods = [];
let viruses = [];
let blobs = [];
let mode;
let pos;
let velocity;
let acceleration;
var cnv;
var zoom = 1;
var input;
//var thisName;
//let leemet = leemet * bloob.r / 2;

function Virus(x, y) {
let r = 75;
let g = 255;
let b = 90;
this.r = 225;
this.x = x;
this.y = y;

  this.show = function() {
    fill(r, g, b);
    stroke(r - 75, g, b - 75);
    strokeWeight(4);
    ellipse(x, y, this.r, this.r);

  }

  this.eaten = function() {
    let d = dist(pos.x, pos.y, this.x, this.y);
    if (d < this.r + bloob.r && bloob.r > 130) {
      return true;
    } else {
      return false;
    }
  }
}

function Food(x, y) {
let r = random(75, 255);
let g = random(75, 255);
let b = random(75, 255);
this.r = random(10, 17.5);
this.x = x;
this.y = y;
ellipse(this.x, this.y, this.r, this.r);

  this.show = function() {
    fill(r, g, b);
    noStroke();

    push();
  translate(this.x, this.y);
  scale(0.08);
  beginShape();
	vertex(-75, -130);
	vertex(75, -130);
	vertex(150, 0);
	vertex(75, 130);
  vertex(-75, 130);
	vertex(-150, 0);
	endShape(CLOSE);
	pop();
  }

  this.eaten = function() {
    let d = dist(pos.x, pos.y, this.x, this.y);
    if (d < this.r + bloob.r) {
      return true;
    } else {
      return false;
    }
  }
}

function Blob(x, y, r) {
this.r = r;
this.x = x;
this.y = y;

//var rate = this.r * 0.3;

   this.show = function() {
     fill(0, 125, 255);
     stroke(75, 255, 125);
     strokeWeight(2.5);
     ellipse(pos.x, pos.y, this.r*2, this.r*2);
     console.log(pos.x + ' , ' + pos.y);
   }

   this.update = function() {
this.x += width/2+this.x; // rate;
this.y += height/2+this.y; // rate;

velocity.add(acceleration);
pos.add(velocity);
velocity.limit(6.5);

//console.log('Speed ? :' + rate);
}

this.constrain = function() {
this.x = constrain(this.x, -width, width*8);
this.y = constrain(this.y, -height, height*20);
cnv.x = constrain(cnv.x, -width, width*8);
cnv.y = constrain(cnv.y, -height, height*20);
this.r = constrain(this.r, 16, 20000);

/*if (this.x < -width) {
  this.x = -width;
  }
if (this.x > width*2) {
  this.x = width*2;
  }
if (this.y < -height) {
  this.y = -height;
  }
if (this.y > height*2) {
  this.y = height*2;
}*/
}

   this.grow = function(amount) {
     bloob.r += amount;
   }

   this.deplete = function() {
     this.r = this.r * 0.1;
   }

   this.eaten = function(other) {
     let d = dist(this.x, this.y, other.x, other.y);
     if (d < this.r + other.r && this.r < other.r) {
       return true;
       other.r += this.r;
     } else {
       return false;
     }
   }
}

function setup() {
  cnv = createCanvas(windowWidth - 50, windowHeight-200);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y + 75);

  pos = createVector(0, 0);
  velocity = createVector(0, 0);
  acceleration = createVector(floor(random(-1, 1)), floor(random(-1, 1)));

let col = color(50, 120, 98);
  bloob = new Blob(pos.x, pos.y, 16);
  input = createInput();
  input.style('color', col);
  input.position(width/2, height/2 + 50);
  input.value('Username');
  //thisName = input.value();

socket = io.connect('http://localhost:3000');

var data = {
  x: pos.x,
  y: pos.y,
  r: bloob.r
}

socket.emit('start', data);

socket.on('heartbeat',

function(data) {
  //console.log(data);
  blobs = data;
  }
);

//bloob.x = pos.x;
//bloob.y = pos.y;

for (let j = 0; j < 60; j++) {
  let ree = random(-width, width*8);
  let roy = random(-height, height*20);
  let voiross = new Virus(ree, roy);
  viruses.push(voiross);
}

for (let i = 0; i < 2250; i++) {
  let ree = random(-width, width*8);
  let roy = random(-height, height*20);
  let fibble = new Food(ree, roy);
  foods.push(fibble);
  }

  mode = 0;
}

function draw() {
  clear();
background(60, 60, 80);
frameRate(300);



if (mode == 0) {
  fill(random(255), random(255), random(255));
  textSize(50);
  textFont('Comic Sans MS');
  textAlign(CENTER, TOP);
  text('Hit play to begin...', width/2, height/2 - 260);
  frameRate(5);
  playButton.draw();
}



if (mode == 1) {



translate(width/2, height/2);
var newzoom = 60 / bloob.r;
zoom = lerp(zoom, newzoom, 0.1);
scale(zoom);
translate(-pos.x, -pos.y);
//bloob.deplete();

for (var i = blobs.length - 1; i >= 0; i--) {

if (blobs[i].id !== socket.id) {
  fill(0, 125, 255, 75);
  stroke(255, 0, 0, 75);
  ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);

}

if (blobs[i].eaten(blobs)) {
  blobs.splice(i, 1);
  //blobs[i].grow(blobs[i].r);
}

fill(255);
textAlign(CENTER);
textFont('Futura');
text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r*1.5);

}

bloob.update();
bloob.show();
bloob.constrain();

var data = {
  x: pos.x,
  y: pos.y,
  r: bloob.r
}

socket.emit('update', data);

/*for (var row = 0; row < 9; row += 1) {
  for (var col = 0; col < 9; col += 1) {
    noFill();
    rect(col*40, row*40, 40, 40);
    strokeWeight(1);
    stroke(255);
    //noLoop();
  }
}*/

if (keyIsDown(107) || keyIsDown(187)) {
  bloob.grow(8);
}

if (keyIsDown(109) || keyIsDown(189)) {
  bloob.grow(-5);
}

//window.setInterval(foods.push(new Food(random(width), random(height))), random(10000, 30000));

noStroke();
fill(255);
textSize(floor(bloob.r / 4));
textFont('Comic Sans MS');
textAlign(CENTER, BOTTOM);
text(bloob.r, pos.x, pos.y);

/*if (bloob.r >= 350) {
  textSize(100);
  textFont('Futura');
  textAlign(CENTER, CENTER);
  text('Congratulations , you win!\n' + 'Final Score : ' + bloob.r, width*4/2, height*8/2);
  noStroke();
}*/

for (let j = 0; j < viruses.length; j++) {
  viruses[j].show();

  if (viruses[j].eaten()) {
    let ree = random(-width, width*8);
    let roy = random(-height, height*20);

    viruses.splice(j, 1);
    bloob.grow(-100);
    viruses.push(new Virus(ree, roy));
        }
}

for (let i = 0; i < foods.length; i++) {
  foods[i].show();

if (foods[i].eaten()) {
  let ree = random(-width, width*8);
  let roy = random(-height, height*20);

  foods.splice(i, 1);
  bloob.grow(1);
  foods.push(new Food(ree, roy));
      }
    }
  }
}

var playButton = new Clickable();

playButton.locate(1390/2, 588/2);
playButton.color = '#c93847';
playButton.cornerRadius = 10;
playButton.stroke = '#a13743';
playButton.strokeWeight = 5;
playButton.text = 'Play';
playButton.textColor = '#c94bff';
playButton.onHover = function() {
  playButton.color = '#fa5064';
}
playButton.onOutside = function() {
  playButton.color = '#c93847';
}
playButton.onPress = function() {
  input.remove();
  mode = 1;
}

function keyPressed() {
  if (key==='w' || keyCode===UP_ARROW) {
    acceleration = createVector(0, -1)
  }

  if (key==='a' || keyCode===LEFT_ARROW) {
    acceleration = createVector(-1, 0)
  }

  if (key==='s' || keyCode===DOWN_ARROW) {
    acceleration = createVector(0, 1)
  }

  if (key==='d' || keyCode===RIGHT_ARROW) {
    acceleration = createVector(1, 0)
  }
  if (key==='e') {
    acceleration = createVector(0, 0);
    velocity = createVector(0, 0);
  }
}
