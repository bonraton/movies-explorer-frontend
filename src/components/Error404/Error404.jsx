import './Error404.css';
import { Link } from 'react-router-dom';

export default function Error404() {
    return (
        <section className="error-page">
            <h2 className="error-page__title">404</h2>
            <p className="error-page__subtitle">Страница не найдена</p>
            <Link to="/" className="error-page__link">Назад</Link>
        </section>
    )
}