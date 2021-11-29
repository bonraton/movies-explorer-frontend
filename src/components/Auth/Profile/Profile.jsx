import './Profile.css';

export default function Profile() {
  return (
    <section className="profile">
      <h3 className="profile__title">Привет, Олег!</h3>
      <div className="profile__info-container">
          <p className="profile__info-text">Имя</p>
          <p className="profile__info-text profile__info-text_user">Олег</p>
      </div>
      <div className="profile__info-container">
          <p className="profile__info-text">E-mail</p>
          <p className="profile__info-text profile__info-text_user">oleg@oleg.ru</p>
      </div>
      <div className="profile__button-container">
          <button className="profile__btn">Редактировать</button>
          <button className="profile__btn profile__btn_logout">Выйти из аккаунта</button>
      </div>
    </section>
  );
}
