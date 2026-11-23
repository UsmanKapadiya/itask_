import React, {Component} from 'react'
import {login} from './FunctionCalls'
import {Alert} from 'reactstrap';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password,
            errors: {}
        }

        login(user).then(res => {
            if (res.errorStatus) {
                if (res.data.not_found == "User not Verified") {
                    window.location = "/verify-code/" + btoa(this.state.email)
                } else {
                    this.setState({errors: res.data})
                }
            } else {
                localStorage.setItem("section", btoa("inbox"))
                localStorage.setItem("value", btoa("1"))
                window.location = "/dashboard"
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            {this.state.errors && this.state.errors.not_found ? <Alert color="danger">
                                {this.state.errors.not_found}
                            </Alert> : ""}
                            <div className="form-group position-relative">
                                <span className={"input_bg_image span_email"}></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    id="email"
                                />
                                {this.state.errors && this.state.errors.email ?
                                    <label className="error" htmlFor="email">{this.state.errors.email}</label> : ""}
                            </div>
                            <div className="form-group position-relative">
                                <span className={"input_bg_image span_password"}></span>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    id="password"

                                />
                                {this.state.errors && this.state.errors.password ?
                                    <label className="error"
                                           htmlFor="password">{this.state.errors.password}</label> : ""}
                            </div>
                            <p className="d-block text-right mb-7"><a className="color-white" href={'/password-reset'}>Forgot
                                your password?</a></p>

                            <button
                                type="submit"
                                className="btn btn-lg btn-primary btn-block"
                            >
                                Sign in
                            </button>
                        </form>
                        <div className="row mt-3 justify-content-center">
                            <p className=" float-left mr-2">Don't have an account ?</p>
                            <a className="color-white float-right" href={'/register'}>Sign Up</a>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default LoginForm




