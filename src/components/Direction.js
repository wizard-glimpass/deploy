import React, { useEffect, useState, useRef } from "react";

const Direction = () => {
  const [directionData, setDirectionData] = useState({});
  const [accelerationData, setAccelerationData] = useState({});
  const [accXY, setAccXY] = useState({});
  const [distance, setDistance] = useState(0);

  const dirRef = useRef();
  const accRef = useRef();
  const totalAccX = useRef(0);
  const totalAccY = useRef(0);
  const overTime = useRef(0);
  const timeRef = useRef(new Date());
  const distRef = useRef(0);
  const handleOrientation = (event) => {
    dirRef.current = event;

    // Do stuff with the new orientation data
  };
  const handleMotion = (event) => {
    accRef.current = event.acceleration;
    totalAccX.current += parseInt(event.acceleration.x);
    totalAccY.current += parseInt(event.acceleration.y);
    overTime.current++;
    const currTime = new Date();
    const timeInterval = currTime - timeRef.current;
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    timeRef.current=currTime;
    setDistance(distRef.current);
    // Do stuff with the new orientation data
  };

  useEffect(() => {
    setInterval(() => {
      setDirectionData(dirRef.current);
      setAccelerationData(accRef.current);
      totalAccX.current = totalAccX.current / overTime.current;
      totalAccY.current = totalAccY.current / overTime.current;
      setAccXY({
        x: totalAccX.current,
        y: totalAccY.current,
        time: overTime.current,
      });
      overTime.current = 1;
      totalAccX.current = 0;
      totalAccY.current = 0;
    }, 1000);
  }, []);
  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("devicemotion", handleMotion, true);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener("devicemotion", handleMotion, true);
    };
  }, []);

  return (
    <>
      <div className="device-orientation-container">
        <div>
          <span>alpha angle</span>
          {parseInt(directionData.alpha)}
        </div>
      </div>
      <div className="device-acceleration-container">
        <div>
          <span>acc along x-axis</span>
          {accelerationData.x}
        </div>
        <div>
          <span>acc along y axis</span>
          {accelerationData.y}
        </div>

        <div>
          <span> average acc along y axis</span>
          {accXY.y}
        </div>
        <div>
        <span> distance along x axis</span>
          {distance}
        </div>

      </div>
    </>
  );
};
export default Direction;
