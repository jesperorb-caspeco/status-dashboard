import React, { SFC } from "react";
import cn from "classnames";
import { ResponseCode, System } from "../../api";
import "./StatusLight.css";

interface IStatusLightProps {
  system: System;
  text: string;
  type: ResponseCode;
  time?: number;
  days?: number;
  hours?: number;
  minutes?: number;
}

const StatusLight: SFC<IStatusLightProps> = ({
  system,
  text,
  type,
  days = 0,
  hours = 0,
  minutes = 0,
}: IStatusLightProps) => {
  return (
    <div className="status-container">
      <div className="status__text">
        {system}&nbsp;<span>{text}</span>
      </div>
      <div className={cn("status__light", { [`status__light--${type}`]: true })}>
        <div> 
          {" "} 
          {days} d {hours} h {minutes} m
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatusLight);
