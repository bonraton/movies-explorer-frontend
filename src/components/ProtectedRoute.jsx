import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
const isLoggedIn = localStorage.getItem('isLoggedIn')

const ProtectedRoute = (props) => {
    return <Route path={props.path}>{isLoggedIn ? props.children : <Redirect to="./" />} </Route>
}

export default ProtectedRoute