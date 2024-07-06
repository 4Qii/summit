let video;
let poseNet;
let pose;
let skeleton;
let points; 
let names; 
let brain;
let poseLabel = "l";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'questionmodel/model.json',
    metadata: 'questionmodel/model_meta.json',
    weights: 'questionmodel/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function questionOne()
{
  points = 0; 
  translate(width,0);
  scale(-1, 1);
  if(poseLabel == "L")
  {
    names = "LEFT HOOK"
    points += 1;
  }
  
  if(poseLabel == "R")
  {
    names = "RIGHT HOOK"
    points -= 1;
  }
  
  if(poseLabel == "H")
  {
    names = ""
    points += 0; 

  }
}


function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  

  pop();
  
  translate(width,0);
  scale(-1, 1);
  questionOne();
  print(poseLabel); 
  print(points);
  fill(255, 0, 255);
  noStroke();
  textSize(50);
  textAlign(CENTER, CENTER);
  text(names, width / 2, height / 2);
  fill(255, 0, 255);
  
    textSize(100); 
  fill(255);
  text("FIGHT", 320, 100)
  //textAlign(CENTER, CENTER);
  //text(poseLabel, width / 2, height / 2);
  
  
}