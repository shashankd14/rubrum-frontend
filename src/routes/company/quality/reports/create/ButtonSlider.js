
import React from "react";
import "./ButtonSlider.css"; 

function ButtonSlider({ activeButton, onButtonClick }) {
  return (
    <div className="cylinder-buttons">
      <button
        className={`cylinder-button ${activeButton === "ToDo" ? "pink" : ""}`}
        onClick={() => onButtonClick("ToDo")}
      >
        ToDo
      </button>
      <button
        className={`cylinder-button ${activeButton === "Completed" ? "grey" : ""}`}
        onClick={() => onButtonClick("Completed")}
      >
        Completed
      </button>
    </div>
  );
}

export default ButtonSlider;