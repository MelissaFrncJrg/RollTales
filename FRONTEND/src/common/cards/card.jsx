import React from "react";
import "./card.scss";
import "../../assets/styles/variables.scss";
import "../../assets/styles/mixins.scss";

const Card = ({ children, onClick, className, title, ...props }) => {
  return (
    <div className={`card ${className}`} onClick={onClick} {...props}>
      <div className="card-info">{children}</div>
      {title && <p className="title">{title}</p>}
    </div>
  );
};

export default Card;
