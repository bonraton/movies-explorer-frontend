import { filterShorts } from "./filter"
import {searchFormErrors} from '../constants/messages'

function getSearchError (movies) {
    if (movies.length < 1) {
      return ({long: searchFormErrors.notFoundError, shorts: searchFormErrors.notFoundError})
    } else {
      let shorts = filterShorts(movies)
      if (shorts.length < 1) {
          return ({long: '', shorts: searchFormErrors.notFoundError})
      } else {
          return ({long: '', shorts: ''})
      }
    }
  }

  function getInitialError (movies) {
    if (movies.length > 0) {
      let shorts = filterShorts(movies)
      if (shorts.length < 1) {
          return ({long: '', shorts: searchFormErrors.notFoundError})
      } else {
          return ({long: '', shorts: ''})
      }
    } else {
        return ({long: '', shorts: ''})
    }
  }

  export {getSearchError, getInitialError}