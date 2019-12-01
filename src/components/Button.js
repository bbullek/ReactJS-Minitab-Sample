import React from "react";
import "../styles/Button.css";

const styles = [
    "btn--primary--solid",
    "btn--primary--outline",
    "btn--secondary--solid",
    "btn--secondary--outline"
];

const sizes = ['btn--med', 'btn--sm'];

/**
 * A simple custom Button with several color/size options and a small animation 
 * on hover.
 */
export const Button = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
}) => {

    // Set props to a default choice if the requested style/size doesn't exist
    const setButtonStyle = styles.includes(buttonStyle) ? buttonStyle : styles[0];
    const setButtonSize = sizes.includes(buttonSize) ? buttonSize : sizes[0];

    return (
        <button className={`btn ${setButtonStyle} ${setButtonSize}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
}