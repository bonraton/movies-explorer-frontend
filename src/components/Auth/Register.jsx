import Input from './Input';
import { Link } from 'react-router-dom';
import useValidation from '../../hooks/useValidation';

export default function Register(props) {

    const {
        email,
        password,
        name,
        handleEmailInput,
        handlePasswordInput,
        handleNameInput,
        isNameValid,
        isEmailValid,
        isPasswordValid,
        emailError,
        passwordError,
        nameError } = useValidation()

    function handleSubmit(e) {
        e.preventDefault();

        props.onSubmit(name, email, password)
    }

    return (
        <form onSubmit={handleSubmit}
            type="submit"
            name="regiter-form"
            id="register-form"
            className="auth-form">
            <Input
                isDisabled={props.isDisabled ? true : false}
                inputClass="input__form"
                isValidated={isNameValid}
                onChange={handleNameInput}
                value={name || ''}
                id="name"
                name="имя"
                type="text"
                error={nameError} />
            <Input
                isDisabled={props.isDisabled ? true : false}
                inputClass="input__form"
                isValidated={isEmailValid}
                onChange={handleEmailInput}
                value={email || ''}
                id="email"
                name="E-mail"
                type="email"
                error={emailError} />
            <Input
                isDisabled={props.isDisabled ? true : false}
                inputClass="input__form"
                onChange={handlePasswordInput}
                isValidated={isPasswordValid}
                value={password || ''}
                id="password"
                name="Пароль"
                error={passwordError}
                type="password"
            />
            <div className="auth-form__btn-container">
                <button
                    disabled={`${(!isPasswordValid || !isEmailValid || !isNameValid || props.isDisabled) ? 'disabled' : ''}`}
                    className="auth-form__submit-btn"
                    type="submit">
                    Зарегистрироваться
                </button>
                <p className="auth-form__text">Уже зарегистрированы?
                    <Link to="signin" className="auth-form__link"> Войти</Link>
                </p>
            </div>
        </form>
    )
}