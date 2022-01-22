const searchFormErrors = {
    searchInternalError: `Во время запроса произошла ошибка. 
    Возможно, проблема с соединением или сервер недоступен. 
    Подождите немного и попробуйте ещё раз.`,
    notFoundError: 'Ничего не найдено',
  }

  const validationErrors = {
      nameformat: 'Недопустимый символ в имени',
      nameCompared: 'Данное имя уже введено',
      required: 'Поле не может быть пустым',
      emailCompared: 'данный email уже введен',
      emailFormat: 'некорректная форма email',
      passwordFormat: 'Слишком короткий пароль'
  }

  export { searchFormErrors, validationErrors }