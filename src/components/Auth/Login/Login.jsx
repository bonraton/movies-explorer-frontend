import Input from "../Input/Input";
import './Login.css';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <form className="auth-form">
      <Input
        name="E-mail"
        id="login-email"
        type="email" />
      <Input
        id="login-password"
        name="Пароль"
        type="password"
        className="input__form_error"
      />
      <div className="auth-form__btn-container">
        <Link to="/" className="auth-form__submit-btn">
          Войти
        </Link>
        <p className="auth-form__text">Еще не зарегистрированы?
          <Link to="/signup" className="auth-form__link">
            Регистрация
          </Link>
        </p>
      </div>
    </form>
  );
}
