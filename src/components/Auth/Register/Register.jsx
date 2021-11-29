import './Register.css';
import Input from '../Input/Input';

export default function Register (props) {
    return (
        <form type="submit" name={props.name} id={props.id} className="auth-form">
            <Input
            id="name"
            name="имя"
            type="text">
            </Input>
            <Input
            id="email"
            name="E-mail"
            type="email"
            />
            <Input
            id="password"
            name="Пароль"
            error="Что-то пошло не так..."
            type="password"
            className="input__form_error"
            />
            <button className="auth-form__submit-btn">Зарегистрироваться</button>
            <p className="auth-form__text">Уже зарегистрированы?<a className="auth-form__link" href="#"> Войти</a></p>
        </form>
    )
}