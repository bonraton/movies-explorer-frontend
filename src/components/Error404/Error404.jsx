import './Error404.css';

export default function Error404 () {
    return (
        <section className="error-page">
            <h2 className="error-page__title">404</h2>
            <p className="error-page__subtitle">Страница не найдена</p>
            <a className="error-page__link" href="#">Назад</a>
        </section>
    )
}