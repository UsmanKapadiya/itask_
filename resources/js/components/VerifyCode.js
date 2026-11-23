import React, {Component} from 'react'
import {verifyCode} from './FunctionCalls'
import {resendCode} from './FunctionCalls'
import ReactDOM from "react-dom";
import Submit from "../../images/btn_next.png";
import {register} from "./FunctionCalls";

class Verifycode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email:  this.props.email,
            vc1: '',
            vc2: '',
            vc3: '',
            vc4: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.resend = this.resend.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault()

        const code = {
            vc1: this.state.vc1,
            vc2: this.state.vc2,
            vc3: this.state.vc3,
            vc4: this.state.vc4,
            email: this.state.email,
            errors: {}
        }
        verifyCode(code).then(res => {
            if (res.errorStatus) {
                this.setState({errors: res.data})
            } else {
                window.location = "/dashboard"
            }
        })

    }

    resend(e) {
        e.preventDefault()
        const email = {
            email: this.state.email
        }
        resendCode(email).then(res => {
            window.location = "/verify-code/"+btoa(this.state.email)
        })
    }

    render() {
        return (
            <div id="register_container" className="col-md-4 mt-5 mx-auto">
                <h1>
                    <span className="title text-center color-white">VERIFICATION<hr/></span>
                </h1>
                <p className={"text-center mt-5"}>
                    We have sent you an access code via email for verification purpose.</p>
                <p className={"text-center mt-5 mb-3"}>
                    Enter code here</p>
                <form noValidate onSubmit={this.onSubmit}>

                    <div className="input-group">
                        <input type="text"
                               className="form-control mx-2 rounded"
                               name="vc1"
                               maxLength={"1"}
                               onChange={this.onChange}/>
                        <input type="text"
                               className="form-control mx-2 rounded"
                               name="vc2"
                               maxLength={"1"}
                               onChange={this.onChange}/>
                        <input type="text"
                               className="form-control mx-2 rounded"
                               name="vc3"
                               maxLength={"1"}
                               onChange={this.onChange}/>
                        <input type="text"
                               className="form-control mx-2 rounded"
                               name="vc4"
                               maxLength={"1"}
                               onChange={this.onChange}/>
                    </div>
                    {this.state.errors && this.state.errors.code ?
                        <label className="error" htmlFor="code">{this.state.errors.code}</label> : ""}
                    {this.state.errors && this.state.errors.vcode ?
                        <label className="error">{this.state.errors.vcode}</label> : ""}
                    <div className="text-center mt-5">
                        <button
                            type="submit"
                            className=""
                        >
                            <img src={Submit} width="50"/>
                        </button>
                    </div>
                </form>
                <a href={"#"} className="text-center d-block mt-3" onClick={this.resend}>Resend the code</a>
            </div>
        )
    }
}

if (document.getElementById('verifycode')) {
    var div = document.getElementById('verifycode');
    var email = div.getAttribute('email');
    div.removeAttribute('email');
    ReactDOM.render(<Verifycode email={email}/>, div);
}
