import React from "react";
import "./ImageLinkForm.css";

const DEFAULT_IMAGE = 'https://media.istockphoto.com/id/1323528520/photo/beauty-woman-on-background.jpg?s=2048x2048&w=is&k=20&c=_bOmRWhfltBQqAorrJJgbALP7-mNHmE2_mosFOD5WVE=';

const ImageLinkForm = ({ inputValue, onInputChange, onClickDetect }) => {
  return (
    <div>
      <div className="center parent">
        <p className="f4 center block">Welcome to the world of magic!!Give a try</p>
        <form className="pa3 br3 shadow-5 center child m2">
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            className="f4 pa2 center w-65"
          />
          <button className="w-25 grow f4 link pv2" type="button" onClick={onClickDetect}>Detect</button>
        </form>
      </div>
    </div>
  );

}
export default ImageLinkForm;