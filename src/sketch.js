// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */

// Grab elements, create settings, etc.
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject=stream;
    video.play();
  });
}

/*const rosNode = await rosnodejs.initNode('/posenet');
// ROS function for simple recieveing node param
const getParam = async function(key, default_value){
    if(await rosNode.hasParam(key)){
        const param = await rosNode.getParam(key);
        return param;
    }
    return default_value;
}

let buffer = [];
let newBuffer = false;
let image_width = 0;
let image_height = 0;
let header = null;

// topic names
const camera_topic = await getParam('topic','/image_raw');
const output_topic = await getParam('poses_topic','/poses');
// ROS topics
let pub = rosNode.advertise(output_topic, StringMsg);
//
let sub = rosNode.subscribe(camera_topic, sensor_msgs.Image,
    (data) => {
        // TODO more encodings
        if (data.encoding == 'bgr8'){
            // Change the encoding to rgb8 
            // Atm not implemented, this means red is blue and vice versa which leads to worse results
            // data.data = swapChannels(data.data);
            data.encoding = 'rgb8';
        }
        // Currently works only with rgb8 data
        assert(data.encoding == 'rgb8');
        buffer = data.data;
        newBuffer = true;
        header = data.header;
        image_height = data.height;
        image_width = data.width;
    }
);
*/
// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet 
// is not detecting a position
function drawCameraIntoCanvas() {
  // Draw the video element into the canvas
  ctx.drawImage(video, 0, 0, 640, 480);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, 'single', gotPoses);
// You can optionally call it for multiple poses 
//const poseNet = new ml5.PoseNet(video, 'multiple', gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
  console.log('debug')
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.stroke();
    }
  }
}