import "./SearchForm.css";

export default function SearchForm() {
  return (
    <section className="search-form__page">
      <form
        className="search-form"
        name="search-form"
        id="search-form"
        method="post"
        required
      >
        <div className="search-form__container">
          <input
            type="text"
            name="submit"
            className="search-form__input"
            placeholder="фильм"
          ></input>
          <div className="search-form__button-container">
            <button className="search-form__button">Найти</button>
          </div>
        </div>
      </form>
      <div className="toggle">
        <label className="toggle__switch" for="toggle-button">
          <input
            id="toggle-button"
            type="checkbox"
            className="toggle__button"
          ></input>
          <span className="toggle__slider"></span>
        </label>
        <p className="toggle__info">Короткометражки</p>
      </div>
    </section>
  );
}
