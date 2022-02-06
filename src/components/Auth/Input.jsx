import { useState } from 'react';
import { useEffect } from 'react';

export default function Input(props) {


    useEffect(() => {
        hideInputSpan()
    }, [props.value])

    const [hiddenSpanInput, setHiddenSpanInput] = useState(false);

    function hideInputSpan() {
            (props.value) ? setHiddenSpanInput(true) :setHiddenSpanInput(false)
    }

    return (
        <div className="input">
            <span className="input__name">{props.name}</span>
            <label htmlFor={props.id}
                className={`input__container ${props.labelClass}`}>
                <input
                    disabled={props.isDisabled}
                    autoComplete='off'
                    value={props.value}
                    onChange={props.onChange}
                    onKeyPress={hideInputSpan}
                    placeholder={props.placeholder}
                    type={props.type} name={props.id}
                    id={props.id}
                    className={`${props.inputClass} ${!props.isValidated ? 'input__form_error' : ''} `}
                >
                </input>
                <span className={`input__span ${hiddenSpanInput ? 'input__span input__span_hidden' : ''}`}>
                    {props.span}
                </span>
            </label>
            <span className="input__error">{props.error}</span>
        </div>
    )
}