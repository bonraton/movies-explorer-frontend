import './Input.css';
import { useState } from 'react';

export default function Input(props) {
    const [hiddenSpanInput, setHiddenSpanInput] = useState(false);
    function hideInputSpan() {
        setHiddenSpanInput(true)
    }
    return (
        <div className="input">
            <span className="input__name">{props.name}</span>
            <label htmlFor={props.id}
                className={`input__container ${props.labelClass}`}>
                <input
                    onKeyPress={hideInputSpan}
                    placeholder={props.placeholder}
                    type={props.type} name={props.id}
                    id={props.id}
                    className={`input__form ${props.inputClass}`}
                    required>
                </input>
                <span className={`input__span ${hiddenSpanInput ? 'input__span_hidden' : ''}`}>
                    {props.span}
                </span>
            </label>
            <span className="input__error">{props.error}</span>
        </div>
    )
}