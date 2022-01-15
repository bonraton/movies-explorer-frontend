import "./SearchForm.css";
import { useState } from 'react'

export default function SearchForm({ ...props }) {

  const [searchValue, setSearchValue] = useState('')
  const [checkBoxValue, setCheckBoxValue] = useState(false)

  function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(searchValue)
  }

  function setInputValue(e) {
    setSearchValue(e.target.value)
  }

  return (
    <section className="search-form__page">
      <form
        className="search-form"
        name="search-form"
        id="search-form"
        method="post"
        onSubmit={handleSubmit}
        required>
        <div className="search-form__container">
          <input
            type="text"
            name="submit"
            className="search-form__input"
            placeholder="фильм"
            onChange={setInputValue}
            value={searchValue || ''} >
          </input>
          <div className="search-form__button-container">
            <button className="search-form__button">Найти</button>
          </div>
        </div>
      </form>
      <div className="toggle">
        <label className="toggle__switch" htmlFor={props.id}>
          <input
            id={props.id}
            type="checkbox"
            checked={props.isChecked || false}
            className="toggle__button"
            onChange={props.onFilterChange}
          ></input>
          <span className="toggle__slider"></span>
        </label>
        <p className="toggle__info">Короткометражки</p>
      </div>
    </section>
  );
}