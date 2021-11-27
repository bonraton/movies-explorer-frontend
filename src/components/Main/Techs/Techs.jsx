import './Techs.css';

export default function Techs () {
    return (
        <div className="landing landing_techs">
            <h2 className="landing__header">
                Технологии
            </h2>
            <h3 className="landing__title landing__title_techs">7 технологий</h3>
            <p className="techs__subtitle">На курсе веб-разработки мы освоили
             технологии, которые применили в дипломном проекте.</p>
             <ul className="techs__grid">
                 <li className="techs__item">HTML</li>
                 <li className="techs__item">CSS</li>
                 <li className="techs__item">JS</li>
                 <li className="techs__item">REACT</li>
                 <li className="techs__item">GIT</li>
                 <li className="techs__item">Express.js</li>
                 <li className="techs__item">mongoDB</li>
             </ul>

        </div>
    )
}