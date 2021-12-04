import './AboutMe.css';
import { Link } from 'react-router-dom';
import aboutMe from '../../../images/about-me.png';

export default function AboutMe () {
    return (
        <section className="about-me">
            <h3 className="landing__header">Студент</h3>
            <div className="about-me__container">
                <div className="about-me__content">
            <h2 className="landing__title">Олег</h2>
            <p className="about-me__subtitle">Фронтенд-разработчик, 29 лет</p>
            <p className="about-me__text">Я родился и живу в Саратове, закончил факультет экономики СГУ. У меня есть жена 
            и дочь. Я люблю слушать музыку, а ещё увлекаюсь бегом. Недавно начал кодить. С 2015 года работал в компании 
            «СКБ Контур». После того, как прошёл курс по веб-разработке, начал заниматься фриланс-заказами </p>
            <nav>
            <Link to="#" href="#" className="about-me__link">Facebook</Link>
            <Link to="#" href="#" className="about-me__link">Github</Link>
            </nav>
            </div>
            <img className="about-me__image" src={aboutMe} alt="student"></img>
            </div>

        </section>
    )
}