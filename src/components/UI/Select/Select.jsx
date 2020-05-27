import React from 'react';

import './Select.css';

const Select = ( props ) => {

    let options = null;
    if (props.options) {
        options = props.options.map(opt => (
            <option
                key={opt}
                value={opt}
                type="text"
                disabled={props.disabled}
                >{opt}
            </option>
        ));
    }

    const selectWidth = props.selectWidth;

    return <select className="Select" value={props.value} onChange={props.clicked} style={{width: selectWidth }}>
        <option>{props.label}</option>
        {options}
    </select>
};

export default Select;
