import Input from "../Input/Input";
import './Login.css';

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
       <button className="auth-form__submit-btn">Войти</button>
        <p className="auth-form__text">Еще не зарегистрированы?<a className="auth-form__link" href="#"> Зарегистрироваться</a></p>
    </form>
  );
}
