import React from 'react';

function home(props) {
  return (
    <div>
      <button onClick={props.onStart}>Start Trip</button>
    </div>
  );
}

export default home;
