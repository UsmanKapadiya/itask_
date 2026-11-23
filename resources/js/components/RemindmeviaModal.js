import React, {Component} from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap'
import {updateReminderNotification} from "./FunctionCalls";
import {message} from "antd";

class RemindMeVia extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            viaemail: '',
            viamobile: '',
            viadesktop: ''
        }
        this.toggle = this.toggle.bind(this)
        this.Save = this.Save.bind(this)
    }

    componentDidMount() {
        fetch('/member-notification-information')
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        viaemail: (result.remind_via_email === 1 ? true : false),
                        viamobile: (result.remind_via_mobile === 1 ? true : false),
                        viadesktop: (result.remind_via_desktop === 1 ? true : false)
                    })
                },
                (error) => {
                    this.setState({
                        error,
                    })
                },
            )
    }

    Save(e) {
        e.preventDefault()
        const ReminderNotification = new FormData()
        ReminderNotification.append('mobile', this.state.viamobile)
        ReminderNotification.append('desktop', this.state.viadesktop)
        ReminderNotification.append('email', this.state.viaemail)
        updateReminderNotification(ReminderNotification).then(res => {
            if (res.errorStatus) {
                this.setState({errors: res.data})
            } else {
                this.setState({
                    modal: false
                }, function () {
                    message.success(res.data);
                })
            }
        })
    }

    toggle(e) {
        this.setState((prevState) => ({
            modal: !prevState.modal,
        }))
    }

    render() {
        return (
            <div>
                <a onClick={this.toggle} style={{cursor: 'pointer'}}>
                    Remind me via
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className={"border-0 text-uppercase"}>Remind me via</ModalHeader>
                    <ModalBody>
                        <div className={"d-flex"}>
                            <div className={"w-75"}>
                                <div>Mobile Push Notification</div>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input"
                                       type="checkbox" onChange={() => {
                                    this.setState((prevState) => ({
                                            viamobile: !prevState.viamobile
                                        })
                                    )
                                }
                                }
                                       defaultChecked={this.state.viamobile ? 1 : 0}/>
                            </div>
                        </div>
                        <div className={"d-flex"}>
                            <div className={"w-75"}>
                                <div>Desktop Push Notification</div>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input"
                                       type="checkbox" onChange={() => {
                                    this.setState((prevState) => ({
                                            viadesktop: !prevState.viadesktop
                                        })
                                    )
                                }
                                }
                                       defaultChecked={this.state.viadesktop ? 1 : 0}/>
                            </div>
                        </div>
                        <div className={"d-flex"}>
                            <div className={"w-75"}>
                                <div>Email</div>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input"
                                       type="checkbox" onChange={() => {
                                    this.setState((prevState) => ({
                                            viaemail: !prevState.viaemail
                                        })
                                    )
                                }
                                }
                                       defaultChecked={this.state.viaemail ? 1 : 0}/>
                            </div>
                        </div>
                        <div className="text-right mt-3">
                            <Button className={""} color="primary" onClick={this.Save}>Save</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default RemindMeVia
