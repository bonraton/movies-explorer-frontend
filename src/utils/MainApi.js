import { PATHS, BASE_URL } from "../constants/endpoints";

function getJwtFromLocal() {
    return localStorage.getItem('jwt')
}

const getResponseData = (result) => {
    if (result.ok) {
        return result.json()
    } else {
        return Promise.reject(result.json())
    }
}

export async function getUser() {
    let promise = await fetch(`${BASE_URL}${PATHS.profile}`, {
        'method': 'GET',
        headers: {
            'Authorization': `Bearer ${getJwtFromLocal()}`,
        }
    });
    let result = await getResponseData(promise)
    return result
}

export async function updateUser(name, email) {
    const promise = await fetch(`${BASE_URL}${PATHS.profile}`, {
        'method': 'PATCH',
        headers: {
            'Authorization': `Bearer ${getJwtFromLocal()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email
        })
    })
    const result = await getResponseData(promise)
    return result
}

//addMovie
export async function saveMovie(movie) {
        let promise = await fetch(`${BASE_URL}${PATHS.movies}`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getJwtFromLocal()}`
            },
            body: JSON.stringify({
                movieId: movie.movieId,
                nameRU: movie.nameRU,
                nameEN: !movie.nameEN,
                country: !movie.country,
                director: movie.director,
                thumbnail: movie.thumbnail,
                duration: movie.duration,
                image: movie.image,
                link: movie.trailerLink,
                year: movie.year,
                description: movie.description,
                trailer: movie.trailer
            })
        })
        let result = await getResponseData(promise);
        return result
}

export async function removeMovie(data) {
    const promise = await fetch(`${BASE_URL}${PATHS.movies}/${data}`, {
        'method': 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwtFromLocal()}`,
        },
    })
    let result = await getResponseData(promise);
    return result
}

export async function getSavedMoviesData(userId) {
    let promise = await fetch(`${BASE_URL}${PATHS.movies}`, {
        'method': 'GET',
        headers: {
            'Authorization': `Bearer ${getJwtFromLocal()}`,
        },
    })
    let result = await getResponseData(promise)
    return await result.data.filter((movie) => {
        return movie.owner === userId
    })
}