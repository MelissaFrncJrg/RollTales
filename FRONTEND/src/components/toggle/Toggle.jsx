import React from "react";
import "./toggle.css";

const Toggle = ({ setTrueFalse, choices, title, checked, id }) => {
  const handleToggle = () => {
    setTrueFalse(!checked);
  };

  return (
    <div className="checkbox-wrapper">
      <input
        value="private"
        name="switch"
        id={id}
        type="checkbox"
        className="switch"
        checked={checked}
        onChange={handleToggle}
      />
      <label htmlFor={id}>
        <span className="switch-text">{title}</span>
        <span className="switch-toggletext">
          <span className="switch-unchecked">
            <span className="switch-hiddenlabel" />
            {choices[0]}
          </span>
          <span className="switch-checked">
            <span className="switch-hiddenlabel" />
            {choices[1]}
          </span>
        </span>
      </label>
    </div>
  );
};

export default Toggle;
