import {BASE_URL, endpoints} from "../constants/endpoints"

const getResponseData = (result) => {
    if (result.ok) {
        return result.json()
    } else {
        return Promise.reject(result)
    }
}

export async function register(name, email, password) {
    const promise = await fetch(`${BASE_URL}${endpoints.signup}`, {
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
    const promise = await fetch(`${BASE_URL}${endpoints.signin}`, {
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
        console.log(token.token)
        localStorage.setItem('jwt', token)
        return token
    } catch (e) {
        console.log(e)
        return e.json()
    }
}

export const getUserContent = (jwt) => {
    return fetch(`${BASE_URL}${endpoints.profile}`, {
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