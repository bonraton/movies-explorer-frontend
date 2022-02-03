import {BASE_URL, PATHS} from "../constants/endpoints"

const getResponseData = (result) => {
    if (result.ok) {
        return result.json()
    } else {
        return Promise.reject(result)
    }
}

export async function register(name, email, password) {
    const promise = await fetch(`${BASE_URL}${PATHS.signup}`, {
        'method': 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
        })
    })
    try {
        const result = await getResponseData(promise)
        return result
    } catch (e) {
        console.log(e)
        return e.json()
    }
}

export async function login(email, password) {
    const promise = await fetch(`${BASE_URL}${PATHS.signin}`, {
        'method': 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    try {
        const result = await promise.ok ? promise.json() : Promise.reject(promise)
        const token = await result
        localStorage.setItem('jwt', token)
        return token
    } catch (e) {
        console.log(e)
        return e.json()
    }
}

export const getUserContent = (jwt) => {
    return fetch(`${BASE_URL}${PATHS.profile}`, {
        method: "GET",
        headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
    }).then((result) => getResponseData(result))
        .catch((e) => {
            console.log(e)
        })
}

export const getSavedMoviesContent = (jwt) => {
    return fetch(`${BASE_URL}${PATHS.movies}`, {
        method: "GET",
        headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
            "Authorizarion": `Bearer ${jwt}`
        },
    }).then((result) => getResponseData(result))
    .catch((e) => console.log(e))
}