import './Portfolio.css';

export default function Portfolio() {
    return (
        <section className="landing landing_portfolio">
            <h3 className="portfolio__header">Портфолио</h3>
            <ul className="portfolio__links">
                <li className="portfolio__item">
                    <p className="portfolio__item-title">Статичный сайт</p>
                    <button className="portfolio__item-icon"></button>
                </li>
                <li className="portfolio__item">
                    <p className="portfolio__item-title">Адаптивный сайт</p>
                    <button className="portfolio__item-icon"></button>
                </li>
                <li className="portfolio__item">
                    <p className="portfolio__item-title">Одностраничное приложение</p>
                    <button className="portfolio__item-icon"></button>
                </li>
            </ul>
        </section>
    )
}