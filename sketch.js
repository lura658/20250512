let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  userStartAudio(); // 等待用戶互動後啟動音訊
  createCanvas(640, 480);
  video = createCapture(VIDEO, function(stream) {
    console.log("Video stream started");
  }, function(err) {
    console.error("Error accessing video stream:", err);
  });
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  image(video, 0, 0, width, height);
  drawFacemesh();
}

function drawFacemesh() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    stroke(255, 0, 0); // 紅色線條
    strokeWeight(5); // 線條粗細為 5

    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = keypoints[points[i]];
      const [x2, y2] = keypoints[points[i + 1]];
      line(x1, y1, x2, y2); // 畫出兩點之間的線
    }

    // 將最後一點與第一點連接
    const [xStart, yStart] = keypoints[points[0]];
    const [xEnd, yEnd] = keypoints[points[points.length - 1]];
    line(xEnd, yEnd, xStart, yStart);
  }
}
