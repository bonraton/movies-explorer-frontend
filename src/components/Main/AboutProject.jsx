export default function AboutProject() {
    return (
        <section className="about-project">
            <h2 className="landing__header">О проекте</h2>
            <div className="about-project__info">
                <div className="about-project__info-container">
                    <h3 className="about-project__info-title">Дипломный проект включал 5 этапов</h3>
                    <p className="about-project__info-text">Составление плана, работу над бэкендом, вёрстку,
                        добавление функциональности и финальные доработки.</p>
                </div>
                <div className="about-project__info-container">
                    <h3 className="about-project__info-title">
                        На выполнение диплома ушло 5 недель
                    </h3>
                    <p className="about-project__info-text">У каждого этапа был мягкий и жёсткий дедлайн,
                        которые нужно было соблюдать, чтобы успешно защититься.</p>
                </div>
            </div>
            <div className="about-project__plan">
                <div className="about-project__plan-container about-project__plan-container_backend">
                    <div className="about-project__plan-title about-project__plan-title_backend">1 неделя</div>
                    <p className='about-project__plan-subtitle'>Back-end</p>
                </div>
                <div className="about-project__plan-container about-project__plan-container_frontend">
                    <div className="about-project__plan-title about-project__plan-title_frontend">4 недели</div>
                    <p className="about-project__plan-subtitle">Front-end</p>
                </div>
            </div>
        </section>
    )
}