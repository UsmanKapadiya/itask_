import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import {addTag} from './FunctionCalls';
import plusIcon from "../../images/icon_left_add.png";
import {message} from "antd";

class AddTagModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            tag:''
        }
        this.onChange = this.onChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.Add = this.Add.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    toggle(e) {
        e.stopPropagation();
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    Add(e) {
        const tag = {
            tagname: this.state.tag
        }
        const props = this.props;
        addTag(tag).then(res => {
            if (res.errorStatus) {
                message.error(res.data)
            } else {
                this.setState(prevState => ({
                    modal: !prevState.modal
                }),function () {
                    message.success(res.data)
                    props.refreshData();
                });
            }
        })
    }

    render() {

        return (
            <div>
                <a onClick={this.toggle} style={{cursor: "pointer"}}> <img src={plusIcon} alt="add Project"/></a>
                <Modal isOpen={this.state.modal} className="{className} AddProject">
                    <ModalHeader>Add Tag</ModalHeader>
                    <ModalBody>
                        <p className="font-weight-bold mb-0">Tag name</p>
                        <input type="text"
                               className="form-control w-100 mb-2"
                               onChange={this.onChange}
                               name="tag"
                               placeholder={"Enter Tag"}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>{' '}
                        <Button color="primary" onClick={this.Add}>Add</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default AddTagModal;
