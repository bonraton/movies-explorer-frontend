import { useState, useEffect } from 'react'
import { localStorageConstants } from '../constants/constant';
import { PATHS } from '../constants/endpoints';
import { useHistory } from "react-router-dom";

export default function SearchForm({ ...props }) {

  const [state, setState] = useState({
    moviesValue: '',
    savedMoviesValue: ''
  })

  const history = useHistory()

  const value = history.location.pathname === PATHS.movies ? state.moviesValue : state.savedMoviesValue 

  useEffect(() => {
    setInitialValue()
  }, [])

  function setInitialValue () {
    const moviesSearchValue = localStorage.getItem(localStorageConstants.searchValue);
    setState({
      moviesValue: moviesSearchValue
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(value)
  }

  function setInputValue(e) {
    const moviesSearchValue = localStorage.getItem(localStorageConstants.searchValue);
    const savedMoviesSearchValue = localStorage.getItem('savedSearchValue')
    const value = e.target.value;
    if (history.location.pathname === PATHS.movies) {
    setState({ moviesValue: value, savedMoviesValue: savedMoviesSearchValue})
  } else {
    setState({ savedMoviesValue: value, moviesValue: moviesSearchValue})
  }
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
            disabled={props.isRequesting ? true : false}
            type="text"
            name={props.name}
            className="search-form__input"
            placeholder="фильм"
            onChange={setInputValue}
            value={value || ''} >
          </input>
          <div className="search-form__button-container">
            <button disabled={props.isDisabled} className="search-form__button">Найти</button>
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