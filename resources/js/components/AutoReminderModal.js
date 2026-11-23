import React, {Component} from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap'
import {message, Select} from "antd";
import {updateautoreminder} from "./FunctionCalls";
import * as options from './Constants'

const {Option} = Select;

class AutoReminder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            userautoreminder: ''
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
                        userautoreminder: result.automatic_reminder
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
        const Autoreminder = new FormData()
        Autoreminder.append('name', this.state.userautoreminder)
        updateautoreminder(Autoreminder).then(res => {
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
                    Send automatic reminders
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className={"border-0 text-uppercase"}>Send Automatic
                        Reminders</ModalHeader>
                    <ModalBody>
                        <div>
                            <Select
                                showSearch
                                name="userautoreminder"
                                style={{width: 200}}
                                placeholder="Select Automatic Reminder"
                                optionFilterProp="children"
                                defaultValue={this.state.userautoreminder}
                                onChange={(e) => {
                                    this.setState({userautoreminder: e});
                                }}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >

                                {options.reminderOptions.map((reminder, index) => (
                                    <Option key={index} value={reminder} label={reminder}>
                                        {reminder}
                                    </Option>
                                ))}
                            </Select>
                            <div className="text-right mt-3">
                                <Button className={""} color="primary" onClick={this.Save}>Save</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default AutoReminder
