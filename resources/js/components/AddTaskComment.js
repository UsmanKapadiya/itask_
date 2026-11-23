import React, {Component} from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap'

import commentIcon from "../../images/icon_function_comment.png"
import 'antd/dist/antd.css';

class Comment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            comment: '',
            errors: {}
        }
        this.onChange = this.onChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.Add = this.Add.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    toggle(e) {
        this.setState((prevState) => ({
            modal: !prevState.modal,
        }))
    }

    Add(e) {
        if (this.state.comment == "") {
            this.setState({errors: {"not_found": "Please enter comment"}})
        } else {
            this.props.commentCallback(this.state.comment);
            this.setState((prevState) => ({
                modal: !prevState.modal,
                errors: {"not_found": ""}
            }))
        }
    }

    render() {
        return (
            <div className="mr-3 position-relative cursor_pointer">
                <a onClick={this.toggle}>
                    <img src={commentIcon} alt="add Comment" data-toggle="tooltip" title="Add comment"/>
                </a>
                <Modal isOpen={this.state.modal} className="modal-md AddProject" onClosed={() => {
                    this.setState({errors: {"not_found": ""}})
                    this.props.updateComment();
                }}>
                    <ModalHeader>Add comment</ModalHeader>
                    <ModalBody>
                        {this.state.errors && this.state.errors.not_found ? (
                            <Alert color="danger">{this.state.errors.not_found}</Alert>
                        ) : (
                            ''
                        )}
                        <input
                            type="text"
                            className="form-control"
                            onChange={this.onChange}
                            name="comment"
                            value={this.state.comment}
                        />
                        {this.state.errors && this.state.errors.name ? (
                            <label className="error" htmlFor="name">
                                {this.state.errors.name}
                            </label>
                        ) : (
                            ''
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>
                            Cancel
                        </Button>{' '}
                        <Button color="primary" onClick={this.Add}>
                            Add
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Comment
