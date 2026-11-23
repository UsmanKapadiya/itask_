import React, {Component} from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap'
import emailNotification from '../../images/icon_notification_email.png';
import mobileNotification from '../../images/icon_notification_mobile.png';
import {updateNotificationSetting} from "./FunctionCalls";
import {message} from "antd";

class NotificationModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            data: []
        }
        this.toggle = this.toggle.bind(this)
        this.Save = this.Save.bind(this)
    }

    componentDidMount() {
        fetch('/notification-information')
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        data: result.notification_settings
                    }, () => {
                        const key = this.state.data
                        for (var i = 0; i < key.length; i++) {
                            this.state[key[i].key_val] = {
                                email: key[i].email,
                                push_notification: key[i].push_notification
                            }
                        }
                    })
                },
                (error) => {
                    this.setState({
                        error,
                    })
                },
            )
    }

    toggle(e) {
        this.setState((prevState) => ({
            modal: !prevState.modal,
        }))
    }

    Save(e) {
        e.preventDefault()
        const state_data = this.state;
        const NotificationSetting = new FormData()
        for (let i in state_data) {
            if (i != "modal" && i != "data") {
                NotificationSetting.append(i, JSON.stringify(state_data[i]))
            }
        }
        updateNotificationSetting(NotificationSetting).then(res => {
            if (res.errorStatus) {
                message.error(res.data)
            } else {
                this.setState({
                    modal: false
                }, function () {
                    message.success(res.data);
                })
            }
        })
    }

    render() {
        const {data} = this.state
        return (
            <div>
                <a onClick={this.toggle} style={{cursor: 'pointer'}}>
                    Notification
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className={"border-0 text-uppercase"}>Notification</ModalHeader>
                    <ModalBody>
                        <div className={"d-flex justify-content-between border-bottom my-2"}>
                            <div className={"w-75"}>
                                <div className={"text-uppercase"}>Notify me about</div>
                            </div>
                            <div>
                                <span className={"mr-2"}><img src={emailNotification} style={{height: 15, width: 20}}/></span>
                                <span><img src={mobileNotification} style={{height: 15, width: 20}}/></span>
                            </div>
                        </div>
                        {data.map(individual => (
                            <div className={"d-flex justify-content-between  my-2"} key={individual.key_val}>
                                <div className={"w-75"}>
                                    {individual.title}
                                </div>
                                <div>
                                    <span className={"mr-4"}>
                                        <input className="form-check-input"
                                               type="checkbox"
                                               onChange={(e) => {
                                                   const c = e.target.checked ? 1 : 0
                                                   this.setState((prevState) => ({
                                                       [individual.key_val]: {
                                                           "email": c,
                                                           "push_notification": this.state[individual.key_val]["push_notification"]
                                                       }
                                                   }))
                                               }}
                                               defaultChecked={this.state[individual.key_val] != undefined ? this.state[individual.key_val]["email"] ? 1 : 0 : 0}/>
                                    </span>
                                    <span><input className="form-check-input"
                                                 type="checkbox"
                                                 onChange={(e) => {
                                                     const c = e.target.checked ? 1 : 0
                                                     this.setState((prevState) => ({
                                                         [individual.key_val]: {
                                                             "email": this.state[individual.key_val]["email"],
                                                             "push_notification": c
                                                         }
                                                     }))
                                                 }}
                                                 defaultChecked={this.state[individual.key_val] != undefined ? this.state[individual.key_val]["push_notification"] ? 1 : 0 : 0}/>
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="text-right mt-3">
                            <Button className={""} color="primary" onClick={this.Save}>Save</Button>
                        </div>
                    </ModalBody>
                </Modal>

            </div>
        )
    }
}

export default NotificationModal
