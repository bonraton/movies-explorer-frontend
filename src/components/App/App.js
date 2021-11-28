import React from 'react';
import './App.css';
// import Main from '../Main/Main';
import SearchForm from '../SearchForm/SearchForm';
import MoviesCardList from '../MoviesCardList/MoviesCardList';


function App() {
  return (
    <div className="page">
      {/* <Main /> */}
      <SearchForm />
      <MoviesCardList />
    </div>
  );
}

export default App;
