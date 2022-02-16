import { BEATFILM_URL } from "../constants/endpoints";

export default class MoviesApi {
    constructor() {
        this._url = BEATFILM_URL;
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


