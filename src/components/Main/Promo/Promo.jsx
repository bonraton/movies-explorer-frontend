import './Promo.css'

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
          <button className="promo__link" href="#">
            Узнать больше
          </button>
        </div>
        <svg className="promo__image"></svg>
        
    </section>
  );
}