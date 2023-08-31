import React, { useEffect, useState, useRef } from "react";


  //Speed calculation initialization
//   let v_previous = 0; // Initial velocity (m/s)
// let last_time = Date.now(); // Returns the current time in milliseconds
// const dragFactor = 0.05; // Adjust this value based on your requirements
// const highDragFactor = 0.5; // Drag factor when acceleration is very low
// const accelThreshold = 0.1; // Acceleration below which is considered very low
// const negligibleAccel = 1e-1; // Acceleration below this is treated as zero.

// const [previousY, setPreviousY] = useState(0);
// const [previousX, setPreviousX] = useState(0);
window.previousY = 0;
const useLowPassFilter = (alpha) => {
  
  const applyFilter = (input) => {
    const output = alpha * input + (1 - alpha) * window.previousY;
    //window.alert(window.previousY);
    window.previousY = output;
    return output;
  };
  return applyFilter;
};
// const useLowPassFilterX = (alpha) => {
//   const applyFilterX = (input) => {
//     const output = alpha * input + (1 - alpha) * previousY;
//     window.alert(previousY);
//     setPreviousY(output);
//     return output;
//   };
//   return applyFilter;
// };

const Direction = () => {
  
  const [timeDif, setTimeDif] = useState(0);
  
  const [directionData, setDirectionData] = useState({});
  const [accelerationData, setAccelerationData] = useState({});
  // const [accXY, setAccXY] = useState({});
  // const [distance, setDistance] = useState(0);
  // const [speed, setSpeed] = useState(0);
  const [final_speed, setFinalSpeed] = useState(0);
  const [dist, setDist] = useState(0);

  
  const [lowPassX, setLowPassX] = useState(0);
  const [lowPassY, setLowPassY] = useState(0);

  //Low-Pass
  const alpha = 1 / (1 + (1 / (2 * Math.PI * 6)) * 60);
  const filter = useLowPassFilter(alpha);


  //datapoint setter
  const [samplePoint, setDatapoint] = useState(0);
  const [deg, setDegree] = useState("Degree");

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
  
  
  //for datapoint 
  var datapoint = 0;
  var degree = "Degree";
//changes for speed
const initial_a = useRef(0);
const intial_speed = useRef(0); 
const final_s = useRef(0); 
const d = useRef(0); 
const final_a = useRef(0);
const filterdataX_prev = useRef(0);
const prev_time = useRef(Date.now());
const final_a_prev = useRef(0);
const final_s_prev = useRef(0);
const final_jerk = useRef(0);
const final_jerk_prev = useRef(0);



  const handleMotion = (event) => {
    
       accRef.current = event.acceleration;
    totalAccX.current += parseInt(event.acceleration.x);
    totalAccY.current += parseInt(event.acceleration.y);
    overTime.current++;
    const currTime = new Date();
    //milliseconds to second
    const timeInterval = (currTime - timeRef.current)/1000;
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    //setDistance(distRef.current);
   // Do stuff with the new orientation data
   setDirectionData(dirRef.current);

    //LowPass filteredData
    const filteredDataX = filter(accRef.current.x);
    //const filteredDataY = filter(accRef.current.y);
    //setLowPassY(parseFloat(filteredDataY).toFixed(2));
    

    const timeDiff = Date.now() - prev_time.current;
    prev_time.current = Date.now();
    setTimeDif(timeDiff);
    //window.alert(timeDiff);
    //jerk
    
    final_jerk.current = (event.acceleration.x - filterdataX_prev.current)/(timeDiff/1000);

    final_a.current += (final_jerk.current + final_jerk_prev.current)*(timeDiff/2000);
    final_s.current += (final_a.current + final_a_prev.current)*(timeDiff/2000);
    d.current += (final_s.current + final_s_prev.current)*(timeDiff/2000);
    
    final_jerk_prev.current = final_jerk.current;
    final_a_prev.current = final_a.current;
    final_s_prev.current = final_s.current;
    filterdataX_prev.current = event.acceleration.x;
    setDist(d.current.toFixed(3));
    setFinalSpeed(final_s.current.toFixed(3));
    setLowPassX(parseFloat(final_a.current).toFixed(3));

    
    
  };

  useEffect(() => {
    setInterval(() => {

      

      // setDirectionData(dirRef.current);
      setAccelerationData(accRef.current);
      totalAccX.current = totalAccX.current / overTime.current;
      totalAccY.current = totalAccY.current / overTime.current;
      // setAccXY({
      //   x: totalAccX.current,
      //   y: totalAccY.current,
      //   time: overTime.current,
      // });
      overTime.current = 1;
      totalAccX.current = 0;
      totalAccY.current = 0;

      setDatapoint(datapoint);
      datapoint = 0;
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
          <span>direction: </span>
          {parseInt(directionData.alpha)} D{deg}
        </div>
      </div>

      
      <div className="device-LowpassX-container">
        <div>
          <span>LowpassX: </span>
          {lowPassX}
        </div>
      </div>

      
      {/* <div className="device-LowPassY-container">
        <div>
          <span>LowPassY: </span>
          {lowPassY} 
        </div>
      </div> */}

      
      <div className="device-Speed-container">
        <div>
          <span>Final Speed for X (LowPass): </span>
          {final_speed} 
        </div>
      </div>

      
      <div className="device-Distance-container">
        <div>
          <span>Final Distance (for Low-Pass): </span>
          {dist} 
        </div>
      </div>



      {/* <div className="device-speed-container">
        <div>
          <span>Speed: </span>
          {final_speed} m/s
        </div>
      </div>
      <div className="device-dist-container">
        <div>
          <span>distance: </span>
          {dist} meters
        </div>
      </div>
      <div className="device-datapoint-container">
        <div>
          <span>datapoint: </span>
          {samplePoint} / second
        </div>
      </div> */}
{/* 
      <div className="device-speed-container">
        <div>
          <span>Speed from Chatgpt: </span>
          {parseInt(speed)} m/s
        </div>
      </div>
       */}

      {/* <div className="device-acceleration-container">
        <div>
          <span>acc along x-axis: </span>
          {accelerationData.x}
        </div>
        <div>
          <span>acc along y axis: </span>
          {accelerationData.y}
        </div>

        <div>
          <span> average acc along y axis: </span>
          {accXY.y}
        </div>
        <div>
        <span> distance along x axis: </span>
          {distance}
        </div> 

      </div>*/}
    </>
  );
};
export default Direction;
