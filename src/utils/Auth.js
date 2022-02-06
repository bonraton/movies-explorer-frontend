import {BASE_URL, PATHS} from "../constants/endpoints"

const getResponseData = (result) => {
    if (result.ok) {
        return result.json()
    } else {
        return Promise.reject(result.json())
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
        const result = await getResponseData(promise)
        return result
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
        const result = await getResponseData(promise)
        const token = await result
        return token
}

export async function getUserContent (jwt) {
    const promise = await fetch(`${BASE_URL}${PATHS.profile}`, {
        method: "GET",
        headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
    })
    const result = await getResponseData(promise)
    return result
}

export async function getSavedMoviesContent (jwt) {
    const promise = await fetch(`${BASE_URL}${PATHS.movies}`, {
        method: "GET",
        headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
            "Authorizarion": `Bearer ${jwt}`
        },
    })
    const result = await getResponseData(promise)
    return result
}