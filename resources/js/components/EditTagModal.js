import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import {editTag} from './FunctionCalls';
import editImage from '../../images/icon_function_edit.png'
import {message} from "antd";

class EditTagModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            tag:this.props.name

        }
        this.onChange = this.onChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.Add = this.Add.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    toggle(e) {
        this.props.popRef.current.props.onPopupVisibleChange(false);
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    Add(e) {
        const tag = {
            tagname: this.state.tag,
            tagid: this.props.id,
        }
        const props = this.props;
        editTag(tag).then(res => {
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
                <a onClick={this.toggle} className={"cursor_pointer"}><img src={editImage} className={"mr-2"}/>Edit tag</a>
                <Modal isOpen={this.state.modal} className="AddProject">
                    <ModalHeader>Edit Tag</ModalHeader>
                    <ModalBody>
                        <p className="font-weight-bold mb-0">Tag name</p>
                        <input type="text"
                               className="form-control w-100 mb-2"
                               onChange={this.onChange}
                               name="tag"
                               value={this.state.tag}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.Add}>Save</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default EditTagModal;
