import React, {Component} from 'react'
import {register} from './FunctionCalls'
import ReactDOM from "react-dom";
import Submit from "../../images/btn_next.png";
import addprofile from "../../images/add_profile.png";
import editprofile from "../../images/icon_camera.png";
import {message} from "antd";

class Register extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            file: '',
            previewURL: addprofile,
            errors: {},
            loading: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault()
        const newUser = new FormData()
        newUser.append('name', this.state.name)
        newUser.append('email', this.state.email)
        newUser.append('password', this.state.password)
        newUser.append('password_confirmation', this.state.password_confirmation)
        if (this.state.file != "") {
            newUser.append(
                'avatar',
                this.state.file,
                this.state.file.name
            )
        }
        this.setState({loading: "loading"})
        register(newUser).then(res => {
            if (res.errorStatus) {
                this.setState({loading: ""})
                this.setState({errors: res.data})
            } else {
                window.location = "/verify-code/" + btoa(this.state.email)
            }
        })
    }

    _handleImageChange(e) {
        e.preventDefault();
        if (Math.round(e.target.files[0].size / 1000000) > 5) {
            message.error("Image size must be less than 5 MB")
        } else {
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    previewURL: reader.result
                });
            }
            reader.readAsDataURL(file)
        }
    }

    render() {
        let {previewURL} = this.state;
        return (
            <div className="col-md-4 mt-5 mx-auto">
                <form noValidate onSubmit={this.onSubmit}>
                    <div className="previewComponent mt-5 mb-5">
                        <div className="profile_avtar  fileInputContainer position-relative text-center mx-auto"
                             style={{backgroundImage: "url(" + this.state.previewURL + ")", width: 100, height: 100}}>
                            <input className="fileInput" accept="image/*"
                                   type="file"
                                   onChange={(e) => this._handleImageChange(e)}/>
                            {previewURL.includes("add_", 1) ?
                                ""
                                : <img src={editprofile} className="accountediticon position-absolute" height="20"
                                       width="20"/>
                            }
                        </div>

                    </div>
                    <h1 className="h3 mb-3 font-weight-normal text-uppercase text-center mb-5">
                        <span className="title color-white">create account <hr/></span>
                    </h1>
                    <div className="form-group position-relative">
                        <span className={"input_bg_image span_name"}></span>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Name"
                            value={this.state.name}
                            onChange={this.onChange}
                            id="name"
                        />
                        {this.state.errors && this.state.errors.name ?
                            <label className="error" htmlFor="name">{this.state.errors.name}</label> : ""}
                    </div>
                    <div className="form-group position-relative">
                        <span className={"input_bg_image span_email"}></span>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
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
                            onChange={this.onChange}
                            id="password"

                        />
                        {this.state.errors && this.state.errors.password ?
                            <label className="error" htmlFor="password">{this.state.errors.password[0]}</label> : ""}
                    </div>
                    <div className="form-group position-relative">
                        <span className={"input_bg_image span_confirm-password"}></span>
                        <input
                            type="password"
                            className="form-control"
                            name="password_confirmation"
                            placeholder="Confirm Password"
                            onChange={this.onChange}
                            id="confirm-password"
                        />
                        {this.state.errors && this.state.errors.password ? <label className="error"
                                                                                  htmlFor="password_confirmation">{this.state.errors.password[1]}</label> : ""}
                    </div>
                    <div className="text-center mt-5 mb-5">
                        {this.state.loading != "" ? <div className="loader"></div> : <button
                            type="submit"
                            className=""
                        >
                            <img src={Submit} width="50"/>
                        </button>}
                    </div>
                </form>
                <div id="error" className=""></div>
            </div>
        )
    }
}

if (document.getElementById('register_container')) {
    ReactDOM.render(<Register/>, document.getElementById('register_container'));
}
