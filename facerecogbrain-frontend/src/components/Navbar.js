import React from "react";

const Navbar = ({ issignedin, onRouteChange }) => {
  if (issignedin) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p onClick={() => onRouteChange('signout')} className="f3 link dim black underline pa2 pointer"> Sign Out </p>
      </nav>
    )
  }
  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <p onClick={() => onRouteChange('signin')} className="f3 link dim black underline pa2 pointer"> Sign In </p>
      <p onClick={() => onRouteChange('register')} className="f3 link dim black underline pa2 pointer"> Register </p>
    </nav>
  )
}


export default Navbar