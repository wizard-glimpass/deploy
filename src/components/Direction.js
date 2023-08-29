import React, { useEffect, useState } from "react";

const Direction = () => {
  const [directionData, setDirectionData] = useState({});
  const [accelerationData, setAccelerationData] = useState({});
  const handleOrientation = (event) => {
    setDirectionData(event);

    // Do stuff with the new orientation data
  };
  const handleMotion = (event) => {
    setAccelerationData(event.acceleration);

    // Do stuff with the new orientation data
  };
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
          {directionData.alpha}
        </div>
        <div>
          <span>absolute angle</span>
          {directionData.absolute}
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
          <span>acc along z axis</span>
          {accelerationData.z}
        </div>
      </div>
    </>
  );
};
export default Direction;
