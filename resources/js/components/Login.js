import React from "react";
import ReactDOM from "react-dom";
import Logo from "./logo";
import LoginForm from "./LoginForm";


function Login() {
    return(
        <div>
            <Logo />
            <LoginForm />
        </div>
    );
}

if (document.getElementById('login')) {
    ReactDOM.render(<Login />, document.getElementById('login'));
}
