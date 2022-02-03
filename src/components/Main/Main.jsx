import Promo from './Promo';
import AboutProject from './AboutProject';
import Techs from './Techs';
import AboutMe from './AboutMe';
import Portfolio from './Portfolio';
import { withRouter } from 'react-router-dom';

function Main() {
    return (
        <div>
            <Promo />
            <AboutProject />
            <Techs />
            <AboutMe />
            <Portfolio />
        </div>
    );
};

export default withRouter(Main)