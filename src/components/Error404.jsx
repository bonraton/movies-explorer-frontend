import { useHistory } from 'react-router'
import { withRouter } from 'react-router-dom';


function Error404() {

    const history = useHistory()

    function handleBackClick() {
        history.goBack()
    }

    return (
        <section className="error-page">
            <h2 className="error-page__title">404</h2>
            <p className="error-page__subtitle">Страница не найдена</p>
            <p onClick={handleBackClick} className="error-page__link">Назад</p>
        </section>
    )
}

export default withRouter(Error404)