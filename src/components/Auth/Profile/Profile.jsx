import './Profile.css';
import Input from '../Input/Input';
import { Link } from 'react-router-dom';

export default function Profile() {


  return (
    <form id="profile-form" name="profile-form" className="profile">
      <h3 className="profile__title">Привет, Олег!</h3>
      <Input
        placeholder="Имя"
        inputClass="input__form_white"
        labelClass="input__container_underlined"
        span={"Виталий"} />
      <Input
        placeholder="E-mail"
        inputClass="input__form_white"
        span="Oleg@oleg.ru" />
      <div className="profile__button-container">
        <button type="submit" className="profile__btn">Редактировать</button>
        <Link to="/signin" className="profile__btn profile__btn_logout">Выйти из аккаунта</Link>
      </div>
    </form>
  );
}
