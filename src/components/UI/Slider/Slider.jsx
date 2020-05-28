import React from 'react';

import './Slider.css';

const Slider = ( props ) => {

    return <div className="Slider">
        <input
            type="range"
            min={props.min}
            max={props.max}
            value={props.value}
            onChange={(event) => props.change(event.target.value)}
        />
        <p>{props.children}</p>
    </div>

};

export default Slider;
