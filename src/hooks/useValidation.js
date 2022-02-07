import { useState, useContext } from "react";
import { validate } from "react-email-validator";
import CurrentUserContext from '../contexts/currentUserContext'
import { validationErrors } from "../constants/messages";

export default function useValidation() {
    const userContext = useContext(CurrentUserContext);

    const [name, setName] = useState(userContext.name)
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(userContext.email);
    const [isNameValid, setIsNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');


    const regexpLetters = /[a-zA-Zа-яёА-ЯЁ\-\s]/gi

    const handlePasswordChange = (e) => {
        let value = e.target.value
        setPassword(value)
    }

    const handleEmailChange = (e) => {
        let value = e.target.value;
        setEmail(value);
    }

    const handleNameChange = (e) => {
        let value = e.target.value;
        setName(value)
    }

    const checkPasswordValidity = (e) => {
        let value = e.target.value;
        if (value.length > 7) {
            setIsPasswordValid(true)
            setPasswordError('')
        } else if (value.length < 1) {
            setIsPasswordValid(false)
            setPasswordError(validationErrors.required)
        }
        else {
            setIsPasswordValid(false)
            setPasswordError(validationErrors.passwordFormat)
        }
    }

    const compareName = (e) => {
        let value = e.target.value
        if (value === userContext.name) {
            setIsNameValid(false)
            setNameError(validationErrors.nameCompared)
        } else {
            checkNameValidity(e)
        }
    }

    const checkNameValidity = (e) => {
        let value = e.target.value
        let matched = !value.match(regexpLetters) ? [] : value.match(regexpLetters)
        if (value.length > matched.length) {
            setIsNameValid(false)
            setNameError(validationErrors.nameformat)
        } else if (value === userContext.name) {
            setIsNameValid(false)
            setNameError(validationErrors.nameCompared)
        } else {
            setNameError('')
            setIsNameValid(true)
        }
    }

    const checkNameRequired = (e) => {
        let value = e.target.value
        if (value.length < 1) {
            setNameError(validationErrors.required)
            setIsNameValid(false)
        } else {
            checkNameValidity(e)
        }
    }

    const checkEmailValidity = (e) => {
        let value = e.target.value;
        if (validate(value)) {
            setIsEmailValid(true)
            setEmailError('')
            if (value === userContext.email) {
                setIsEmailValid(false)
                setEmailError(validationErrors.emailCompared)
            } else {
                return
            }
        } else {
            setIsEmailValid(false)
            setEmailError(validationErrors.emailFormat)
        }
    }

    const compareEmail = (e) => {
        let value = e.target.value;
        if (value === userContext.email) {
            setEmailError(validationErrors.emailCompared)
            setIsEmailValid(false)
        } else {
            checkEmailValidity(e)
        }
    }

    const emailRequiredValidity = (e) => {
        let value = e.target.value;
        if (value.length < 1) {
            setEmailError(false)
            setEmailError(validationErrors.required)
        } else {
            checkEmailValidity(e)
        }
    }

    const handleEmailInput = (e) => {
        handleEmailChange(e);
        compareEmail(e)
        checkEmailValidity(e)
        emailRequiredValidity(e)
    }

    const handlePasswordInput = (e) => {
        handlePasswordChange(e);
        checkPasswordValidity(e);
    }

    const handleNameInput = (e) => {
        handleNameChange(e);
        compareName(e)
        checkNameValidity(e);
        checkNameRequired(e)
    }

    return {
        handleEmailInput,
        handlePasswordInput,
        handleNameInput,
        isNameValid,
        name,
        email,
        password,
        isEmailValid,
        isPasswordValid,
        passwordError,
        emailError,
        nameError
    }
}