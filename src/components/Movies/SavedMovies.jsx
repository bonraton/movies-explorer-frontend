import MoviesCardList from './MoviesCardList';

export default function SavedMovies({ movie, savedMovies, ...props}) {

    function handleDelete (movie) {
        props.onDelete(movie)
    }

    return (
        <section>
            <MoviesCardList
            error={props.error}
            isLoading={props.isLoading}
            movies={props.movies}
            onClick={props.onClick}
            isLoaded={true}
            savedMovies={savedMovies}
            onDelete={handleDelete}
            hiddenAddBtn={props.hiddenAddBtn}
            >
            </MoviesCardList>
        </section>
    )
}