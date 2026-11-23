import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import userIcon from '../../images/multipleuser.png'
import {assignMemberTask} from "./FunctionCalls";
import {message} from "antd";

class EditMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            id: this.props.id,
            membercount: this.props.data.member_count,
            members: [],
            parentmembers: [],
            errors: "",
            all_member_detail: []
        }
        this.onClick = this.onClick.bind(this)
        this.checkboxChange = this.checkboxChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.saveMembers = this.saveMembers.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data.member_count != this.props.data.member_count) {
            this.setState({membercount: this.props.data.member_count})
        }

    }

    onClick(e) {
        e.stopPropagation();
        const projectId = this.state.id

        fetch("/member-to-assign/" + projectId)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.error != "") {
                        message.error(result.error);
                    } else {
                        if (result.parent_members.length > 0) {
                            this.setState(prevState => ({
                                modal: !prevState.modal
                            }), function () {
                                this.setState({
                                    members: result.members,
                                    parentmembers: result.parent_members,
                                    all_member_detail: result.all_member_detail
                                });
                            });
                        } else {
                            message.error("Parent project's member(s) not found")
                        }
                    }

                },
                (error) => {
                    this.setState({
                        errors: error,
                    })
                }
            )
    }

    checkboxChange(e) {
        const {members} = this.state
        if (e.target.checked) {
            if (members.indexOf(e.target.value) == -1)
                members.push(e.target.value)
        } else {
            members.splice(members.indexOf(e.target.value), 1)
        }
        this.setState({members: members})
    }

    toggle(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    saveMembers() {
        const props = this.props;
        assignMemberTask({task_id: this.state.id, members: JSON.stringify(this.state.members)}).then((res) => {
            if (res.errorStatus) {
                this.setState({errors: res.data})
            } else {
                this.setState((prevState) => ({
                    modal: false,
                }))
            }
        })
    }

    render() {
        const {members} = this.state
        const {parentmembers} = this.state
        const {all_member_detail} = this.state
        const {data} = this.props;
        return (
            <div className="d-inline-block">
                <a onClick={(e) => {
                    (data.parent_id != 0 && !data.completed) ? this.onClick(e) : message.error("Cannot edit member for completed/inbox task(s)")
                }} className={"member_indicator mr-2"}>
                    {this.state.membercount > 1 ?
                        <img className={"cursor_pointer"} src={userIcon} alt={"Members"} height={20}/> :
                        <span>{data.member_name}</span>}
                </a>
                <Modal isOpen={this.state.modal} className="CommentModal" onClosed={() => {
                    this.setState({
                        modal: false,
                        errors: ""
                    })
                }}>
                    <ModalHeader toggle={this.toggle}>
                        <p>Members</p>
                    </ModalHeader>
                    <ModalBody>
                        {this.state.errors && this.state.errors ? (
                            <Alert color="danger">{this.state.errors}</Alert>
                        ) : (
                            ''
                        )}
                        {data.creator == data.userId && parentmembers.length > 0 ? (
                            parentmembers.map(member => (
                                <div key={member.id} className="p-2 member_outer">
                                    <div className={"d-flex"}>
                                        <div className="my-0 mr-2 comment_avatar float-left"
                                             style={{backgroundImage: "url(" + member.avatar + ")"}}>&nbsp;</div>
                                        <div className={"w-75"}>
                                            <div>{member.name}</div>
                                            <div>{member.email}</div>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" datavalue={member.email}
                                                   type="checkbox" onChange={this.checkboxChange}
                                                   defaultChecked={members.indexOf(member.email) != -1 ? 1 : 0}
                                                   value={member.email}/>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            all_member_detail.length > 0 ? (
                                all_member_detail.map(member => (
                                    <div key={member.id} className="p-2 member_outer">
                                        <div className={"d-flex"}>
                                            <div className="my-0 mr-2 comment_avatar float-left"
                                                 style={{backgroundImage: "url(" + member.avatar + ")"}}>&nbsp;</div>
                                            {/* <div className={"avatar_wrap mr-2"}>
                                                <img src={member.avatar} alt={"Avatar"} height={25} className={""}/> */}
                                            {/* </div> */}
                                            <div className={"w-75"}>
                                                <div>{member.name}</div>
                                                <div>{member.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : ""
                        )}
                        {data.creator == data.userId ?
                            <div className={"text-right mt-5"}><Button color="primary"
                                                                       onClick={this.saveMembers}>Done</Button></div>
                            : ''}
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default EditMembers;
