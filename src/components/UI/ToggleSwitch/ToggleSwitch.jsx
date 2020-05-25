import React from 'react';

import './ToggleSwitch.css';

const ToggleSwitch = ( props ) => (
    <label className="ToggleSwitch">
        <input
            type="checkbox"
            checked={props.check}
            onChange={props.change}
        />
        <span className="Slider" />
    </label>
);

export default ToggleSwitch;
