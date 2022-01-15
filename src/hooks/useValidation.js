import { useState, useContext } from "react";
import { validate } from "react-email-validator";
import CurrentUserContext from '../contexts/currentUserContext'

export default function useValidation() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isNameValid, setIsNameValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');

    const userContext = useContext(CurrentUserContext);

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
            setPasswordError('Поле не может быть пустым')
        }
        else {
            setIsPasswordValid(false)
            setPasswordError('Пароль не может быть короче 8 символов')
        }
    }

    const compareName = (e) => {
        let value = e.target.value
        if (value === userContext.name) {
            setIsNameValid(false)
            setNameError('Я машина, и я уничтожу тебя!')
        } else {
            checkNameValidity(e)
        }
    }

    const checkNameValidity = (e) => {
        let value = e.target.value
        let matched = !value.match(regexpLetters) ? [] : value.match(regexpLetters)
        if (value.length > matched.length) {
            setIsNameValid(false)
            setNameError('Недопустимый символ в имени')
        } else if (value === userContext.name) {
            setIsNameValid(false)
            setNameError('Данное имя уже введено')
        } else {
            setNameError('')
            setIsNameValid(true)
        }
    }

    const checkNameRequired = (e) => {
        let value = e.target.value
        if (value.length < 1) {
            setNameError('Поле не может быть пустым')
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
                setEmailError('Данный email уже введен')
            } else {
                return
            }
        } else {
            setIsEmailValid(false)
            setEmailError('некорректная форма email')
        }
    }

    const emailRequiredValidity = (e) => {
        let value = e.target.value;
        if (value.length < 1) {
            setEmailError(false)
            setEmailError('Поле не может быть пустым')
        } else {
            checkEmailValidity(e)
        }
    }

    const compareEmail = (e) => {
        let value = e.target.value;
        if (value === userContext.email) {
            setEmailError('Я машина, и я отказываюсь перезаписывать данное значение')
            setIsEmailValid(false)
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