import React from 'react';

import './Button.css';

const Button = (props) => (
    <button
        className={"Button " + props.type}
        type="button"
        onClick={props.clicked}
        onMouseEnter={props.enter}
        onMouseLeave={props.leave}
        disabled={props.disabled}
        >{props.children}
    </button>
);

export default Button;
