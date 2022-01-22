import Input from './Input';
import useValidation from '../../hooks/useValidation';
import { useContext } from 'react';
import CurrentUserContext from '../../contexts/currentUserContext';

export default function Profile(props) {

  const userContext = useContext(CurrentUserContext);

  const {
    email,
    name,
    handleEmailInput,
    handleNameInput,
    isNameValid,
    isEmailValid,
    emailError,
    nameError } = useValidation()

  function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(name, email)
  }

  const disableSubmitBtn =
    (!isNameValid ||
      email === userContext.email) ? 'disabled' : ''

  return (
    <div>
      <form onSubmit={handleSubmit} id="profile-form" name="profile-form" className="profile">
        <h3 className="profile__title">Привет, {userContext.name}!</h3>
        <Input
          inputClass="input__form input__form_white"
          placeholder="Имя"
          labelClass="input__container_underlined"
          value={name}
          type="text"
          error={nameError}
          onChange={handleNameInput}
          isValidated={isNameValid}
          span={userContext.name}
        />
        <Input
          placeholder="E-mail"
          inputClass="input__form input__form_white"
          value={email || ''}
          type={'email'}
          error={emailError}
          onChange={handleEmailInput}
          isValidated={isEmailValid}
          span={userContext.email} />
        <p className='profile__message profile__message_error'>{props.formError}</p>
        <p className='profile__message'>{props.successe}</p>
        <div className="profile__button-container">
          <button onSubmit={handleSubmit}
            type="submit"
            className="profile__btn"
            disabled={disableSubmitBtn}
          >
            Редактировать
          </button>
          <button onClick={props.onLogout}
            className="profile__btn profile__btn_logout">
            Выйти из аккаунта
          </button>
        </div>
      </form>
    </div>
  );
}
