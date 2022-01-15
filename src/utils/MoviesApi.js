export default class MoviesApi {
    constructor() {
        this._url = 'https://api.nomoreparties.co/beatfilm-movies';
    }

    getMoviesData() {
        return fetch(this._url)
            .then((result) => {
                if (result.ok) {
                    return result.json()
                } else {
                    return Promise.reject(result.status)
                }
            })
    }
}


