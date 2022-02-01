import { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

export default function SearchForm({ ...props }) {

  const [state, setState] = useState({
    moviesValue: '',
    savedMoviesValue: ''
  })

  const history = useHistory()

  const value = history.location.pathname === '/movies' ? state.moviesValue : state.savedMoviesValue 

  useEffect(() => {
    setInitialValue()
  }, [])

  function setInitialValue () {
    const value = localStorage.getItem('searchValue');
    setState({
      moviesValue: value
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(value)
  }

  function setInputValue(e) {
    const value = e.target.value;
    if (history.location.pathname === '/movies') {
    setState({ moviesValue: value})
  } else {
    setState({ savedMoviesValue: value })
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