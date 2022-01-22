import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";

// export default function ProtectedRoute({ component: Component, ...props }) {
//     return (
//         <Route>
//             {() =>
//                 props.isLoggedIn ? <Component {...props} /> : <Redirect to="./" />}
//         </Route>
//     )
// }

const ProtectedRoute = (props) => {
    return <Route path={props.path}>{props.isLoggedIn ? props.children : <Redirect to="./" />} </Route>
}

export default ProtectedRoute