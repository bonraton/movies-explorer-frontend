import './AboutProject.css'

export default function AboutProject () {
    return (
        <div className="about">
            <h2 className="about__title">О проекте</h2>
            <div className="about__info">
            <div className="about__info-container">
                <h3 className="about__info-title">Дипломный проект включал 5 этапов</h3>
                <p className="about__info-text">Составление плана, работу над бэкендом, вёрстку,
                 добавление функциональности и финальные доработки.</p>
            </div>
            <div className="about__info-container">
                <h3 className="about__info-title">
                На выполнение диплома ушло 5 недель
                </h3>
                <p className="about__info-text">У каждого этапа был мягкий и жёсткий дедлайн,
                 которые нужно было соблюдать, чтобы успешно защититься.</p>
            </div>
            </div>
            <div className="about__plan">
            <div className="about__plan-container about__plan-container_backend">
                <div className="about__plan-title about__plan-title_backend">1 неделя</div>
                <p className='about__plan-subtitle'>Back-end</p>
            </div>
            <div className="about__plan-container about__plan-container_frontend">
                <div className="about__plan-title about__plan-title_frontend">4 недели</div>
                <p className="about__plan-subtitle">Front-end</p>
            </div>
            </div>
        </div>
    )
}