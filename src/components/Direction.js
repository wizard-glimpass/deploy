import React, { useEffect, useState, useRef } from "react";
import { readStepDetection, inertialFrame } from './helper';


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




const Direction = () => {
  
  const initialState = {
    lastAccelZValue: -9999,
    lastCheckTime: 0,
    highLineState: true,
    lowLineState: true,
    passageState: false,
    highLine: 1,
    highBoundaryLine: 0,
    highBoundaryLineAlpha: 1.0,
    highLineMin: 0.50,
    highLineMax: 1.5,
    highLineAlpha: 0.0005,
    lowLine: -1,
    lowBoundaryLine: 0,
    lowBoundaryLineAlpha: -1.0,
    lowLineMax: -0.50,
    lowLineMin: -1.5,
    lowLineAlpha: 0.0005,
    lowPassFilterAlpha: 0.9,
    step: 0
  }

  const [state, setState] = useState(initialState);

  const [timeDif, setTimeDif] = useState(0);
  
  const [directionData, setDirectionData] = useState({});
  const [accelerationData, setAccelerationData] = useState({});
  // const [accXY, setAccXY] = useState({});
  // const [distance, setDistance] = useState(0);
  // const [speed, setSpeed] = useState(0);
  const [final_speed, setFinalSpeed] = useState(0);
  const [dist, setDist] = useState(0);

  
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  const [dx, setdx] = useState(0);
  const [dy, setdy] = useState(0);

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
const final_x = useRef(0);
const final_y = useRef(0);
const final_z = useRef(0);
const filterdataX_prev = useRef(0);
const prev_time = useRef(Date.now());
const sp_x = useRef(0);
const sp_y = useRef(0);
const dist_x = useRef(0);
const dist_y = useRef(0);
const final = useRef(0);
const push = useRef(0);
const sp_z = useRef(0);
const steps = useRef(-1);
const step_end = useRef(0);




  const handleMotion = (event) => {
    
       accRef.current = event.acceleration;
    totalAccX.current += parseInt(event.acceleration.x);
    totalAccY.current += parseInt(event.acceleration.y);
    overTime.current++;
    //const currTime = new Date();
    //milliseconds to second
    const timeInterval = 0
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    //setDistance(distRef.current);
   // Do stuff with the new orientation data
  //  dirRef.current.alpha = 360-dirRef.current.alpha
   setDirectionData(dirRef.current);

    //LowPass filteredData
    const filteredDataX = filter(accRef.current.x);
    //const filteredDataY = filter(accRef.current.y);
    //setLowPassY(parseFloat(filteredDataY).toFixed(2));
    

    
    
    //setTimeDif(timeDiff);
    

    const accn_x = parseInt(event.acceleration.x)
    const accn_y = parseInt(event.acceleration.y)
    const accn_z = parseInt(event.acceleration.z)
    const sin_a = (parseInt(dirRef.current.alpha))// * (Math.PI / 180))
    const sin_b = (parseInt(dirRef.current.beta))// * (Math.PI / 180))
    const sin_g = (parseInt(dirRef.current.gamma))// * (Math.PI / 180))
    // const cos_a = Math.cos(parseInt(dirRef.current.alpha) * (Math.PI / 180))
    // const cos_b = Math.cos(parseInt(dirRef.current.beta) * (Math.PI / 180))
    // const cos_g = Math.cos(parseInt(dirRef.current.gamma) * (Math.PI / 180))

    //windows.alert(sin_b)
    final.current = inertialFrame(sin_a* (Math.PI / 180),sin_b* (Math.PI / 180),sin_g* (Math.PI / 180),accn_x,accn_y,accn_z)
    

    //push implementation
    const timeDiff = (Date.now() - prev_time.current)/1000
    if (final.current[2] > 0 ) {
      if (push.current<1) {
        push.current+=0.334;
        if (push.current>=1) {
          sp_x.current=0
          sp_y.current=0
          sp_z.current=0
          if (timeDiff>0.3) {
            steps.current+=1
            prev_time.current = Date.now()
          }
        }
    }
  }

  if (final.current[2] < 0 ) {
    push.current-=0.51;
    if (push.current<0) {
     push.current = 0
  }
}
  if (push.current > 1 ) {
    sp_x.current+=final.current[0]
    sp_y.current+=final.current[1]
    sp_y.current+=final.current[2]
} 
    final_x.current = Math.sqrt(sp_x.current*sp_x.current + sp_y.current*sp_y.current )
    final_y.current = Math.sqrt(sp_x.current*sp_x.current + sp_y.current*sp_y.current + sp_z.current*sp_z.current)
    final_z.current = final_x.current * final_y.current


    // final_a.current = (accn_x * sin_b) + (accn_y * sin_g) + (accn_z * cos_b * cos_g)
    // const updatedState = readStepDetection(state,  final_a.current);
    // setState(updatedState);
    //setDist(final.current);
    setFinalSpeed(final_s.current.toFixed(3));
    setX(parseFloat(final_x.current).toFixed(4));
    setY(parseFloat(final_y.current).toFixed(4));
    setZ(parseFloat(final_z.current).toFixed(4));
    setdx(parseFloat(dist_x.current).toFixed(4));
    setdy(parseFloat(steps.current).toFixed(4));
   

    
    
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
          <span>alpha: </span>
          {parseInt(directionData.alpha)} {deg}
        </div>
      </div>

      
      <div className="device-X-container">
        <div>
          <span>betaaa : </span>
          {dx}
        </div>
      </div>

      <div className="device-Y-container">
        <div>
          <span>steps : </span>
          {dy}
        </div>
      </div>

      <div className="device-Z-container">
        <div>
          <span>Horizontal Force : </span>
          {X}
        </div>
      </div>
      <div className="device-Za-container">
        <div>
          <span>Net Force : </span>
          {Y}
        </div>
      </div><div className="device-Zaa-container">
        <div>
          <span>realsvar : </span>
          {Z}
        </div>
      </div>
      {/* <div className="device-LowPassY-container">
        <div>
          <span>rate/sec: </span>
          {dist} 
        </div>
      </div> */}

      
      {/* <div className="device-Speed-container">
        <div>
          <span>Final Speed for X (LowPass): </span>
          {final_speed} 
        </div>
      </div> */}

      
      {/* <div className="device-Distance-container">
        <div>
          <span>Final Distances (for Low-Pass): </span>
          {dist} 
        </div>
      </div> */}



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
