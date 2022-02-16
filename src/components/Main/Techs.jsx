import { Link } from 'react-router-dom';

export default function Techs() {
    return (
        <div className="techs">
            <h2 className="landing__header">
                Технологии
            </h2>
            <h3 className="landing__title landing__title_techs">7 технологий</h3>
            <p className="techs__subtitle">На курсе веб-разработки мы освоили
                технологии, которые применили в дипломном проекте.</p>
            <ul className="techs__grid">
                <Link to={{ pathname: "https://html.spec.whatwg.org/" }} target="_blank" className="techs__item">HTML</Link>
                <Link to={{ pathname: "https://developer.mozilla.org/ru/docs/Web/CSS" }} target="_blank" className="techs__item">CSS</Link>
                <Link to={{ pathname: "https://developer.mozilla.org/ru/docs/Web/JavaScript" }} target="_blank" className="techs__item">JS</Link>
                <Link to={{ pathname: "https://ru.reactjs.org/docs/getting-started.html" }} target="_blank" className="techs__item">REACT</Link>
                <Link to={{ pathname: "https://git-scm.com/doc" }} target="_blank" className="techs__item">GIT</Link>
                <Link to={{ pathname: "https://expressjs.com/ru/" }} target="_blank" className="techs__item">Express.js</Link>
                <Link to={{ pathname: "https://www.mongodb.com/" }} target="_blank" className="techs__item">mongoDB</Link>
            </ul>

        </div>
    )
}