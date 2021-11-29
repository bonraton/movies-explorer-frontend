import './Input.css';

export default function Input (props) {
    return (
        <div className="input">
            <span className="input__name">{props.name}</span>
        <input type={props.type} name={props.id} id={props.id} className={`input__form ${props.className}`} required></input>
        <span className="input__error">{props.error}</span>
        </div>
    )
}