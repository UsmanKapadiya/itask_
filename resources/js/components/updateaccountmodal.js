import React, {Component} from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap'
import Submit from "../../images/btn_next.png";
import {updateuser} from "./FunctionCalls";
import {message, Popover, Popconfirm} from "antd";
import addprofile from "../../images/add_profile.png";
import editprofile from "../../images/icon_camera.png";


class AccountModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            file: '',
            previewURL: '',
            editProfile: false,
            errors: {}

        }
        this.toggle = this.toggle.bind(this)
        this.getMemberDetail = this.getMemberDetail.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.popoverRef = React.createRef()
        this.editProfile = this.editProfile.bind(this)
        this.onFileUpload = this.onFileUpload.bind(this)
        this.removeProfile = this.removeProfile.bind(this)
    }

    toggle(e) {
        this.setState((prevState) => ({
            modal: !prevState.modal,
        }))
    }

    getMemberDetail() {
        this.setState({errors: ""})
        fetch('/member-information')
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        previewURL: result.avatar,

                    })
                },
                (error) => {
                    this.setState({
                        error,
                    })
                },
            )
    }

    _handleImageChange(e) {
        e.preventDefault();
        if (Math.round(e.target.files[0].size / 1000000) > 5) {
            message.error("Image size must be less than 5 MB")
        } else {
            let file = e.target.files[0];
            this.setState({
                file: file
            });
        }
    }

    onFileUpload(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = this.state.file;
        reader.onloadend = () => {
            this.setState({
                file: file,
                previewURL: reader.result
            });
        }

        reader.readAsDataURL(file)
        this.setState((prevState) => ({
            editProfile: !prevState.editProfile,
        }))
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault()
        const User = new FormData()
        User.append('name', this.state.name)
        User.append('email', this.state.email)
        User.append('password', this.state.password)
        User.append('password_confirmation', this.state.password_confirmation)
        if (this.state.file != "") {
            User.append(
                'avatar',
                this.state.file,
                this.state.file.name
            )
        }
        updateuser(User).then(res => {
            if (res.errorStatus) {
                this.setState({errors: res.data})
            } else {
                this.setState({
                    modal: false
                }, function () {
                    message.success(res.data, 3, function () {
                        window.location.reload();
                    });
                })
            }
        })
    }


    editProfile() {
        this.setState((prevState) => ({
            editProfile: !prevState.editProfile,
        }))
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    removeProfile(e) {
        this.setState({
            file: "",
            previewURL: addprofile
        });
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    render() {
        let {previewURL} = this.state;
        return (
            <div>
                <a onClick={this.toggle} style={{cursor: 'pointer'}}>
                    Account
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} onOpened={this.getMemberDetail}
                       id={"register_container"} className={"accountmodal"}>
                    <ModalHeader toggle={this.toggle} className={"border-0"}></ModalHeader>
                    <ModalBody>
                        <div className="col-md-8 mt-5 mx-auto">
                            <form noValidate onSubmit={this.onSubmit}>
                                <div className="previewComponent mt-5 mb-5">
                                    {!this.state.editProfile ?
                                        <Popover ref={this.popoverRef} style={{right: 50, bottom: 20}} content={(<div>
                                            <div className={'cursor_pointer mb-1'}
                                                 onClick={this.editProfile}>Edit
                                            </div>
                                            {previewURL != addprofile ?
                                                <Popconfirm title="Are you sure you want to remove your current avatar?"
                                                            okText="Yes" cancelText="No"
                                                            getPopupContainer={() => document.getElementsByClassName('modal')[0]}
                                                            onConfirm={(e) => {
                                                                this.removeProfile()
                                                            }}>
                                                    <div className={'cursor_pointer mb-1'}>Remove</div>
                                                </Popconfirm> :
                                                ''}

                                        </div>)} trigger="click"
                                                 getPopupContainer={() => document.getElementsByClassName('modal')[0]}>
                                            <div
                                                className={"cursor_pointer profile_avtar  fileInputContainer position-relative text-center mx-auto"}
                                                style={{
                                                    backgroundImage: "url(" + this.state.previewURL + ")",
                                                    width: 100,
                                                    height: 100
                                                }}>
                                                {previewURL != addprofile ?
                                                    <img src={editprofile}
                                                         className=" accountediticon position-absolute" height="20"
                                                         width="20"/> :
                                                    ""}
                                            </div>
                                        </Popover> :
                                        <div>
                                            <input type="file" accept="image/*" onChange={(e) => this._handleImageChange(e)}/>

                                            <button onClick={(e) => this.onFileUpload(e)}>
                                                Upload
                                            </button>
                                            <button onClick={() => this.setState({editProfile: false})}>
                                                Cancel
                                            </button>
                                        </div>}
                                </div>
                                <h1 className="h3 mb-3 font-weight-normal text-uppercase text-center mb-5">
                                    <span className="title color-white">edit account <hr/></span>
                                </h1>
                                <div className="form-group position-relative">
                                    <span className={"input_bg_image span_name"}></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Name"
                                        value={this.state.name}
                                        id="name"
                                        onChange={this.onChange}
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
                                        id="email"
                                        onChange={this.onChange}
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
                                        id="password"
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group position-relative">
                                    <span className={"input_bg_image span_confirm-password"}></span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password_confirmation"
                                        placeholder="Confirm Password"
                                        id="confirm-password"
                                        onChange={this.onChange}
                                    />
                                    {this.state.errors && this.state.errors.password ? <label className="error"
                                                                                              htmlFor="password_confirmation">{this.state.errors.password}</label> : ""}
                                </div>
                                <div className="text-center mt-5 mb-5">
                                    <button type="submit" className="">
                                        <img src={Submit} width="50"/>
                                    </button>
                                </div>
                            </form>
                            <div id="error" className=""></div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default AccountModal
