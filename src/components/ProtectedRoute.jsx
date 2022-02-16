import { Redirect, Route } from "react-router-dom";

function getIsLoggedInValue() {
    return localStorage.getItem('isLoggedIn')
}

const ProtectedRoute = (props) => {
    return <Route path={props.path}>{getIsLoggedInValue() ? props.children : <Redirect to="./" />} </Route>
}

export default ProtectedRoute