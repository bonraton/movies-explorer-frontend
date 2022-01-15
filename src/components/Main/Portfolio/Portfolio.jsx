import "./Portfolio.css";
import { Link } from "react-router-dom";

export default function Portfolio() {
  return (
    <section className="portfolio">
      <h3 className="portfolio__header">Портфолио</h3>
      <ul className="portfolio__links">
        <li className="portfolio__item">
          <p className="portfolio__item-title">Статичный сайт</p>
          <Link
            to={{ pathname: "https://bonraton.github.io/how-to-learn/" }}
            target="_blank">
            <button className="portfolio__item-icon"></button>
          </Link>
        </li>
        <li className="portfolio__item">
          <p className="portfolio__item-title">Адаптивный сайт</p>
          <Link to={{ pathname: "https://bonraton.github.io/russian-travel/" }} target="_blank">
            <button className="portfolio__item-icon"></button>
          </Link>
        </li>
        <li className="portfolio__item">
          <p className="portfolio__item-title">Одностраничное приложение</p>
          <Link to={{ pathname: "https://nomoredomains.mesto.nomoredomains.rocks/" }} target="_blank">
            <button className="portfolio__item-icon"></button>
          </Link>
        </li>
      </ul>
    </section>
  );
}
