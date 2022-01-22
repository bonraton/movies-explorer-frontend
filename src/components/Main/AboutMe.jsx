import { Link } from 'react-router-dom';
import myPicture from '../../images/mypicture.jpeg'

export default function AboutMe() {
    return (
        <section className="about-me">
            <h3 className="landing__header">Студент</h3>
            <div className="about-me__container">
                <div className="about-me__content">
                    <h2 className="landing__title">Олег</h2>
                    <p className="about-me__subtitle">Фронтенд-разработчик, 29 лет</p>
                    <p className="about-me__text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Quisque euismod laoreet lacus, id rutrum odio ultrices sed.
                        Donec eget finibus quam. Donec imperdiet lobortis pharetra.
                        Donec ac urna sem. Pellentesque placerat eu ipsum vitae tincidunt.
                        Aliquam dapibus erat id vestibulum. </p>
                    <nav>
                        <Link to={{ pathname: "https://www.facebook.com/zarechny.oleg/" }} target="_blank" className="about-me__link">Facebook</Link>
                        <Link to={{ pathname: "https://github.com/bonraton" }} target="_blank" className="about-me__link">Github</Link>
                    </nav>
                </div>
                <img className="about-me__image" src={myPicture} alt="student"></img>
            </div>

        </section>
    )
}