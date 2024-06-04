// FaceRecognition.js
import React, { useEffect } from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageurl, boxes }) => {
  return (
    <div className="center ma flex items-center justify-center">
      <div className="relative">
        <img id="inputimage" alt="img" className="center" width="500px" src={imageurl} />
        {boxes.map((box, index) => (
          <div
            key={index} // Adding a unique key for each box
            className="bounding-box"
            style={{
              top: box.topRow,
              left: box.leftCol,
              right: box.rightCol,
              bottom: box.bottomRow,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
