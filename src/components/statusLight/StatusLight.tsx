import React, { SFC } from "react";
import cn from "classnames";
import { ResponseCode, System } from "../../api";
import "./StatusLight.css";

interface IStatusLightProps {
    system: System;
    text: string;
    type: ResponseCode;
}

const StatusLight: SFC<IStatusLightProps> = ({ system, text, type }: IStatusLightProps) => {
    return(
        <div className="status-container">
            <div className="status__text">{ system } <span>{ text }</span></div>
          <div className={cn("status__light", { [`status__light--${type}`]: true })} />
        </div>
    )
} 

export default React.memo(StatusLight);
