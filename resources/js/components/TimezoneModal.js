import React, {Component} from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap'
import {message, Select} from 'antd';
import axios from "axios";
import {updatetimezone} from "./FunctionCalls";

const { Option } = Select;

class TimezoneModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            timezonelist:[],
            usertimezone:''

        }
        this.toggle = this.toggle.bind(this)
        this.Save = this.Save.bind(this)
    }

    componentDidMount()
    {
        fetch('/member-information')
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        timezonelist: result.timezonelist,
                        membertimezone: result.usertimezone,
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

    Save(e){
        e.preventDefault()
        const Timezone = new FormData()
        Timezone.append('name', this.state.membertimezone)
        updatetimezone(Timezone).then(res => {
            if (res.errorStatus) {
                this.setState({errors: res.data})
            } else {
                this.setState({
                    modal: false
                }, function () {
                    message.success(res.data,function () {
                        window.location.reload();
                    });
                })
            }
        })
    }

    render()
    {
        const {timezonelist} = this.state
        return (
            <div>
                <a onClick={this.toggle} style={{cursor: 'pointer'}}>
                    Timezone
                </a>
                <Modal isOpen={this.state.modal}  toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className={"border-0"}>Timezone</ModalHeader>
                    <ModalBody>
                        <div>
                            <Select
                                showSearch
                                name="membertimezone"
                                style={{ width: 200 }}
                                placeholder="Select Timezone"
                                optionFilterProp="children"
                                defaultValue={this.state.membertimezone}
                                onChange={(e) => {
                                    this.setState({membertimezone: e});
                                }}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {timezonelist.map(timezone => (
                                    <Option value={timezone} label={timezone} key={timezone}>
                                        {timezone}
                                    </Option>))
                                }

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
export default TimezoneModal
