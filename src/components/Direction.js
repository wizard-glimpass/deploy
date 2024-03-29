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
// Assume this data is globally accessible
let data = [["Timestamp", "accn_x", "accn_y", "accn_z", "sin_a", "sin_b", "sin_g", "rate_a", "rate_b", "rate_c","final_omega", "final.current"]];

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

  const dirRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
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
const prev_force = useRef(0);
const final_force = useRef(0);
const final_z = useRef(0);
const filterdataX_prev = useRef(0);
const prev_time = useRef(Date.now());
const prev_time_y = useRef(Date.now());
const sp_x = useRef(0);
const sp_y = useRef(0);
const dist_x = useRef(0);
const dist_y = useRef(0);
const final = useRef(0);
const push = useRef(0);
const sp_z = useRef(0);
const steps = useRef(0);
const push_y = useRef(0);
const travel = useRef(0);
const travel_state = useRef(0);
const temp_angle = useRef(0);
const prev_angle = useRef(0);
const omega_a = useRef(0);
const omega_a_p = useRef(0);
const omega_max_p = useRef(0);
const omega_max = useRef(0);
const lrav_prev = useRef(-1);
const lrav_now = useRef(0);
const lrav_push = useRef(0);
const lrav_final = useRef(0);
const lrah_prev = useRef(-1);
const lrah_now = useRef(0);
const lrah_push = useRef(0);
const lrah_final = useRef(0);
const lrov_prev = useRef(-1);
const lrov_now = useRef(0);
const lrov_push = useRef(0);
const lrov_final = useRef(0);
const lroh_prev = useRef(-1);
const lroh_now = useRef(0);
const lroh_push = useRef(0);
const lroh_final = useRef(0);


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
    
    
    const acc_th = 0.1 ;
    const omega_th = 10;
    const time_th = 0.3 ; 
    const angle_th = 10 ; 
    const force_th = 10 ;
    const travel_th = 4 ; 

    
    let accn_x = parseInt(event.acceleration.x)
    if (Math.abs(accn_x) < acc_th ) { accn_x=0;}
    let accn_y = parseInt(event.acceleration.y)
    if (Math.abs(accn_y) < acc_th ) { accn_y=0;}
    let accn_z = parseInt(event.acceleration.z)
    if (Math.abs(accn_z) < acc_th ) { accn_z=0;}
    const sin_a = (parseInt(dirRef.current.alpha))// * (Math.PI / 180))
    const sin_b = (parseInt(dirRef.current.beta))// * (Math.PI / 180))
    const sin_g = (parseInt(dirRef.current.gamma))// * (Math.PI / 180))
    const rate_a = parseInt(event.rotationRate.alpha)
    const rate_b = parseInt(event.rotationRate.beta)
    let rate_c = parseInt(event.rotationRate.gamma)
    const final_omega = inertialFrame(sin_a* (Math.PI / 180),sin_b* (Math.PI / 180),sin_g* (Math.PI / 180),rate_a,rate_b,rate_c)
    //rate_c = final_omega[2]

    

    
    //windows.alert(sin_b)
    final.current = inertialFrame(sin_a* (Math.PI / 180),sin_b* (Math.PI / 180),sin_g* (Math.PI / 180),accn_x,accn_y,accn_z)

    const timestamp = new Date().toISOString();
    data.push([timestamp, accn_x, accn_y, accn_z, sin_a, sin_b, sin_g, rate_a, rate_b, rate_c, final_omega, final.current]);

    // accn vertical
    if (lrav_prev.current == -1 ) {
      if (final.current[2] < 0 ) {lrav_push.current-=1}
      if (lrav_push.current < -10 ) {lrav_now.current = 1}}
      
    else {
      if (final.current[2] > 0 ) {lrav_push.current+=1}
      if (lrav_push.current > 3 ) {lrav_now.current = -1}}
    lrav_final.current = lrav_prev.current * lrav_now.current

    // omega horizontal
    if (lroh_prev.current == -1 ) {
      if (rate_c < 0 ) {lroh_push.current-=1}
      if (lroh_push.current < -10 ) {lroh_now.current = 1}}
      
    else {
      if (rate_c > 0 ) {lroh_push.current+=1}
      if (lroh_push.current > 10 ) {lroh_now.current = -1}}
    lroh_final.current = lroh_prev.current * lroh_now.current

    //push implementation
    const timeDiff = (Date.now() - prev_time.current)/1000
    if (final.current[2] > 0) {
      if (push.current<1) {push.current+=0.334}
      if (accn_y < 0 && push_y.current<1 ) {push_y.current+=0.334}
      if (push_y.current>=1 && timeDiff> time_th) {
          push_y.current=1
          travel.current +=1}
      if (travel.current >= travel_th) {travel_state.current = 1}

      final_force.current = Math.max(final.current[2], final_force.current)
      omega_max.current = Math.max(Math.abs(rate_c), omega_max.current)
      omega_a.current = Math.max(Math.abs(rate_a), omega_a.current)

      if (push.current>=1  && 
          timeDiff> time_th &&
          (push_y.current>=1 ||
          travel_state.current == 1)) {
            if ((omega_max.current < 50 && 
                 omega_max.current > 5 
                 && (lroh_final.current == -1 || lrav_final.current==-1  )
                 ) 
                 //||travel_state.current == 0
                 ) {
                    steps.current+=1 
                    push.current=1
                    prev_time.current = Date.now()
                    lroh_prev.current = lroh_now.current
                    lroh_push.current = 0
                    lrav_prev.current = lrav_now.current
                    lrav_push.current = 0

                    if (omega_a.current > 0 ) {omega_a_p.current  = omega_a.current }
                    omega_a.current = 0

                    if (omega_max.current > 0 ) {omega_max_p.current  = omega_max.current }
                    omega_max.current = 0

                    if (final_force.current > 0 ) {prev_force.current  = final_force.current }
                    final_force.current = 0}

            if (omega_max.current > 0 ) {omega_max_p.current  = omega_max.current }
            omega_max.current = 0
        }
    }

    if (final.current[2] <= 0 ) {
      push.current-=0.51;
      if (push.current<0) {
        push.current = 0
        push_y.current = 0
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //final_z.current = lr_now.current * lr_prev.current
    sp_x.current=Math.sqrt(prev_force.current*omega_a_p.current*omega_max_p.current)
    setFinalSpeed(final_s.current.toFixed(3));
    setX(parseFloat(lrah_final.current).toFixed(4));
    setY(parseFloat(lrov_final.current).toFixed(4));
    setZ(parseFloat(lroh_final.current).toFixed(4));
    setdx(parseFloat(sp_x.current).toFixed(4));
    setdy(parseFloat(steps.current));
   

    
    
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
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
          
            window.addEventListener("deviceorientation", handleOrientation);
            window.addEventListener("devicemotion", handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("devicemotion", handleMotion);
    }
  }, []);


  // const requestPermission = () => {
  //   if (
  //     typeof DeviceOrientationEvent !== "undefined" &&
  //     typeof DeviceOrientationEvent.requestPermission === "function"
  //   ) {
  //     DeviceOrientationEvent.requestPermission()
  //       .then((response) => {
  //         if (response == "granted") {
  //           window.addEventListener("deviceorientation", handleOrientation);
  //           window.addEventListener("devicemotion", handleMotion);
  //         }
  //       })
  //       .catch(console.error);
  //   } else {
  //     window.addEventListener("deviceorientation", handleOrientation);
  //     window.addEventListener("devicemotion", handleMotion);
  //   }

  // };
 
  // useEffect(() => {
  //    requestPermission();
  //   return () => {
  //     // Cleanup
  //     window.removeEventListener("deviceorientation", handleOrientation);
  //     window.removeEventListener("devicemotion", handleMotion);
  //   };
  // }, []);

  const downloadCSV=() => {
    const csvContent = data.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Assuming you have a button with id 'downloadBtn'
  
 // document.getElementById('downloadBtn').addEventListener('click', downloadCSV);


  return (
    
    <>
      <div className="device-orientation-container">
      

        <div>
          <span>alpha: </span>
          {parseInt(directionData.alpha)} {deg}
        </div>
      </div>

      
     

      <div className="device-Y-container">
        <div>
          <span>steps : </span>
          {dy}
        </div>
      </div>
      <div className="device-Ya-container">
        <div>
          <span>size : </span>
          {dx}
        </div>
      </div>
      <button id="downloadBtn" onClick={downloadCSV}>Download CSV</button>

      {/* <div className="device-Z-container">
        <div>
          <span>acc ver : </span>
          {dx}
        </div>
      </div>

      <div className="device-Za-container">
        <div>
          <span>nan : </span>
          {X}
        </div>
      </div>
      <div className="device-X-container">
        <div>
          <span>nan : </span>
          {Y}
        </div>
      </div>
      <div className="device-Zaa-container">
        <div>
          <span>omega hor : </span>
          {Z}
        </div>
      </div> */}
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
