import React from 'react';

function insideTrip(props) {
  return (
    <div>
      <button onClick={props.onAddNode}>Add Node</button>
    </div>
  );
}

export default insideTrip;
