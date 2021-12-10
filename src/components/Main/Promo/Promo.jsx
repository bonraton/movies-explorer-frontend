import './Promo.css'
import { Link } from 'react-router-dom';
export default function Promo() {

  return (
    <section className="promo">
      <div className="promo__content">
        <h1 className="promo__title">
          Учебный проект студента факультета Веб-разработки
        </h1>
        <p className="promo__subtitle">
          Листайте ниже, чтобы узнать больше про этот проект и его создателя.
        </p>
        <Link to='/movies' className="promo__link">
          Узнать больше
        </Link>
      </div>
      <svg className="promo__image"></svg>

    </section>
  );
}