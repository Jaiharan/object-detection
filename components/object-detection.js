"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocossdload } from "@tensorflow-models/coco-ssd";
import * as ts from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

let detectInterval;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocossdload();
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  async function runObjectDetection(net) {
    if (
      canvasRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoWidth;

      // find detected objects
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );
      // console.log(detectedObjects);

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }

  const showMYVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  useEffect(() => {
    runCoco();
    showMYVideo();
  }, []);
  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="gradient-text"> Loading AI Model</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          {/* webcam */}
          <Webcam
            className="rounded-md w-full lg:h-[720px]"
            ref={webcamRef}
            muted
          />
          {/* canvas */}
          <canvas
            ref={canvasRef}
            className=" absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
