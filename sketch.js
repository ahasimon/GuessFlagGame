var lan = "da";
var lanFlags = {
  en: "🇬🇧",
  da: "🇩🇰",
}
var settings;

var choice;
var answer;
var lastFlag;

var flagScl;
var scl;

var score;
var highscore;
var onFire;
var scoreScl;

var mouseIsUp;
var done;

// Setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  
  score = 0;
  highscore = 0;
  onFire = false;
  scoreScl = 1;
  flagScl = 1;
  lastFlag = "";
  
  //localStorage.removeItem("flag-highscore");
  
  // Get Local Saved Highscore
  if (localStorage.getItem("flag-highscore") == null) {
    localStorage.setItem("flag-highscore", 0);
  }
  
  highscore = localStorage.getItem("flag-highscore");
  
  settings = {
    x: 35,
    y: 0, // set in draw
    scl: 9,
  }
  
  NewFlag();
  
}

// Get New Flag
function NewFlag() {
  
  scl = 0;
  
  // Setup Level
  answer = round(random(flag.data.length - 1));
  choice = [];
  
  // Generate non-repeating choices
  var validChoice = [];
  for (i = 0; i < flag.data.length; i++) {
    validChoice.push(flag.data[i])
    validChoice.push(Object.assign({}, flag.data[i]))
  }
  
  for (i = 0; i < 4; i++) {
    var ri = round(random(validChoice.length - 1));
    
    choice.push(validChoice[ri]);
    
    validChoice.splice(ri, 1);
  }
  
  if (choice.indexOf(flag.data[answer]) <= -1) {
    choice[round(random(choice.length - 1))] = flag.data[answer];
  }
  
  // Done, Pressed this level button
  done = {
    bool: false,
    correct: false,
    maxTime: 200,
    time: 0,
  }
  
}

// Draw
function draw() {
  background(30); //30
  rectMode(CENTER);
  //textFont("Poppins");
  
  // Mouse Click, instead of press
  if (mouseIsPressed == false) { mouseIsUp = true; }
  
  scl += (1 - scl) / 9;
  scoreScl += (1 - scoreScl) / 23;
  
  // Top GUI
  push();
  translate(width/2, height * 0.1)
  scale(30 * scoreScl);
  
  fill(190);
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(1);
  text("Score: " + score, 0, 0);
  pop();
  
  var onFireTxt = "";
  if (onFire) { onFireTxt = "🔥"; }
  
  fill(120)
  textSize(18);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  text("Highscore: " + highscore + onFireTxt, width/2, height * 0.1 + 20);
  
  // Render Last Flag
  push();
  translate(width/2, height * 0.35);
  scale(170 * map(scl, 0, 1, 1, 0))
  
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(1);
  text(lastFlag, 0, 0);
  pop();
  
  // Render Flag
  push();
  translate(width/2, height * 0.35);
  scale(0.4 * map(scl, 0, 1, 0, flagScl));
  
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(500);
  text(flag.data[answer].flag, 0, 0);
  pop();
  
  if (dist(mouseX, mouseY, width/2, height * 0.35) < 70) {
    flagScl += (map(sin(frameCount * 0.016), -1, 1, 1.5, 1.7) - flagScl) / 17;
  }
  else {
    flagScl += (1 - flagScl) / 20;
  }
  
  // Render Buttons
  for (var i = 0; i < choice.length; i++) {
    var pos = createVector(width/2, height - (i + 0.75) * 70);
    
    fill(200);
    if (done.bool && choice[i].name[lan] == flag.data[answer].name[lan]) { fill(0, 255, 100); }
    else if (done.bool) { fill(255, 0, 100, map(done.time, done.maxTime * 0.1, done.maxTime, 0, 200)); }
    
    rect(pos.x, pos.y, width * 0.9 * scl, 60 * scl, map(scl, 0, 1, 40, 20));
    
    push();
    translate(pos.x, pos.y);
    scale(0.25 * scl);
    
    fill(30);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(100);
    text(choice[i].name[lan], 0, 0);
    pop();
    
    // Mouse Hover
    if (mouseY > pos.y - 35 && mouseY < pos.y + 35 && done.bool == false) {
      fill(30, 90);
      noStroke();
      rect(pos.x, pos.y, width * 0.9, 60, 10);
      
      // Mouse Pressed
      if (mouseIsPressed && mouseIsUp) {
        done.bool = true;
        done.correct = choice[i].name[lan] == flag.data[answer].name[lan];
        done.time = done.maxTime;
        lastFlag = flag.data[answer].flag;
        
        // Check if got right
        if (done.correct) {
          score++;
          scoreScl += 0.35;
          
          if (score > highscore) { 
            highscore = score; 
            onFire = true;
            localStorage.setItem("flag-highscore", highscore);
          }
        }
        else {
          score = 0;
          onFire = false;
        }
        
      }
      
    }
  }
  
  // Done time
  if (done.bool && done.time > 0) {
    done.time--;
    
    if (done.time <= 1) {
      NewFlag();
    }
    
    // Render time bar
    fill(50);
    noStroke();
    rect(width/2, 15, width * 0.95, 9, 100);
    
    fill(250);
    rectMode(CORNER);
    rect(width * 0.025, 15 - 4.5, map(done.time, 0, done.maxTime, 0, width * 0.95), 9, 100);
    
    // Render correct/wrong edges
    noFill();
    rectMode(CENTER);
    if (done.correct) { stroke(0, 255, 100, map(done.time, done.maxTime * 0.45, done.maxTime, 0, 255)); }
    else {              stroke(255, 0, 100, map(done.time, done.maxTime * 0.45, done.maxTime, 0, 255)); }
    strokeWeight(12);
    rect(width/2, height/2, width, height);
  }
  
  // Render settings
  fill(255);
  noStroke();
  
  if (mouseY < 100 && mouseX < width/2) {
    settings.y += (35 - settings.y) / 14;
  }
  else {
    settings.y += (-35 - settings.y) / 14;
  }
  
  if (dist(mouseX, mouseY, settings.x, settings.y) < settings.scl * 3.5) {
    fill(255, 180);
    
    if (mouseIsPressed && mouseIsUp) {
      mouseIsUp = false;
      settings.y -= 10;
      
      if (lan == "en") { lan = "da"; }
      else { lan = "en"; }
    }
  }
  
  push();
  translate(settings.x, settings.y);
  scale(settings.scl * 4.5);
  
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(1);
  text(lanFlags[lan], 0, 0);
  
  pop();
  
}