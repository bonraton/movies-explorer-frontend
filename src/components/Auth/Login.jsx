import Input from "./Input";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import useValidation from '../../hooks/useValidation';

function Login(props) {

  const {
    email,
    password,
    handleEmailInput,
    handlePasswordInput,
    isEmailValid,
    isPasswordValid,
    emailError,
    passwordError } = useValidation()

  function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(email, password);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <Input
        isDisabled={props.isDisabled ? true : false}
        inputClass="input__form"
        isValidated={isEmailValid}
        name="E-mail"
        id="login-email"
        type="email"
        onChange={handleEmailInput}
        value={email || ''}
        error={emailError}
      />
      <Input
        isDisabled={props.isDisabled ? true : false}
        inputClass="input__form"
        id="login-password"
        name="Пароль"
        type="password"
        onChange={handlePasswordInput}
        value={password || ''}
        isValidated={isPasswordValid}
        error={passwordError}
      />
      {/* <p className="auth-form__error">{props.formError}</p> */}
      <div className="auth-form__btn-container">
        <button
          disabled={`${(!isPasswordValid || !isEmailValid) ? 'disabled' : ''}`}
          className='auth-form__submit-btn'>
          Войти
        </button>
        <p className="auth-form__text">Еще не зарегистрированы?
          <Link to="/signup" className="auth-form__link">
            Регистрация
          </Link>
        </p>
      </div>
    </form>
  );
}

export default withRouter(Login);