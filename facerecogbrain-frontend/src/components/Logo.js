import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from "./brain.png";
import "./logo.css";

const logo =()=>{
  return(
    <div className="ma4 mt0">
      <Tilt className="tilt br2 shadow-2" options={{max:25}} style={{ height: '100px',width:'100px' }}>
        <div className="tilt-inner pa3">
          <img style={{paddingTop:'5px'}} src={brain} alt="img"/>
        </div>
     </Tilt>
    </div>
  );
}

export default logo