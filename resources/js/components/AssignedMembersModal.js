import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import userIcon from '../../images/icon_add_assign.png'
import InviteMembers from './InviteMembers'
import {removeMember} from './FunctionCalls'
import deleteIcon from "../../images/icon_function_delete.png";
import {Popconfirm, message} from 'antd';

class AssignedMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            loginId: '',
            data: [],
            invitedmember: [],
            errors: "",
            count: 0,
            suggestions: []
        }
        this.onClick = this.onClick.bind(this)
        this.membercallbackFunction = this.membercallbackFunction.bind(this)
        this.toggle = this.toggle.bind(this)
        this.Remove = this.Remove.bind(this)
        this.updateCount = this.updateCount.bind(this)
        this.checkDuplication = this.checkDuplication.bind(this)
    }

    onClick(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        const projectId = this.props.ptId;
        fetch("/member-detail-list/" + projectId)

            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        loginId: result.loginId,
                        data: result.data,
                        invitedmember: result.invitedmember,
                        suggestions: result.unassigned_members,
                        errors: ""
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    membercallbackFunction(childData) {
        const projectId = this.props.ptId;
        fetch("/member-detail-list/" + projectId)

            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        loginId: result.loginId,
                        data: result.data,
                        invitedmember: result.invitedmember,
                        errors: "",
                        suggestions: result.unassigned_members
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    toggle(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    updateCount() {
        this.setState({count: this.props.memberCount});
    }

    Remove(email) {
        const existingMembers = this.state.data;
        let member_email = new Array();
        for (let e in existingMembers) {
            if(existingMembers[e].id != this.state.loginId) {
                if (existingMembers[e].email != email) {
                    member_email.push(existingMembers[e].email)
                }
            }
        }
        const projectId = this.props.ptId;
        const individualMember = {
            memberId: JSON.stringify(member_email),
            projectId: projectId
        }

        removeMember(individualMember).then(res => {
            if (res.errorStatus) {
                this.setState({errors: res.data})
            } else {
                fetch("/member-detail-list/" + projectId)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                data: result.data,
                                invitedmember: result.invitedmember,
                                errors: "",
                                suggestions: result.unassigned_members
                            });
                        },
                        (error) => {
                            this.setState({
                                error
                            });
                        }
                    )
            }
        })

    }

    checkDuplication(emails) {
        let existing_members = this.state.data;
        let invited_members = this.state.invitedmember
        let duplicate_count = 0;
        for (let e in emails) {
            for (let em in existing_members) {
                if (existing_members[em].email == emails[e]) {
                    duplicate_count = duplicate_count + 1;
                    break;
                }
            }
            if (duplicate_count == 0) {
                for (let im in invited_members) {
                    if (invited_members[im].email == emails[e]) {
                        duplicate_count = duplicate_count + 1;
                        break;
                    }
                }
            }
        }
        if (duplicate_count == 0) {
            this.setState({errors: ""})
            return "success"
        } else {
            this.setState({errors: "Email id is already exists"})
            return "error"
        }
    }

    render() {
        const {data} = this.state;
        const {invitedmember} = this.state;
        const {isCreator} = this.props;
        return (
            <div className="d-inline-block ">
                <a onClick={this.onClick} className={"cursor_pointer"}><img src={userIcon} alt={"Members"}/></a>
                <Modal isOpen={this.state.modal} className="AssignmentModal">
                    <ModalHeader toggle={this.toggle}>
                        Project Members
                    </ModalHeader>
                    <ModalBody>
                        {this.state.errors != "" ? <Alert color="danger">
                            {this.state.errors}
                        </Alert> : ""}
                        {isCreator ?
                            <InviteMembers checkDuplication={this.checkDuplication} suggestions={this.state.suggestions}
                                           projectId={this.props.ptId}
                                           projectName={this.props.projectname}
                                           memberCallback={this.membercallbackFunction}
                            /> : ""}
                        {data.map(individual => (
                            <div key={individual.id}>
                                {individual.id == this.state.loginId ?
                                    <div>
                                        <div className="my-0 mr-2 avatar-img float-left"
                                                 style={{backgroundImage: "url(" + individual.avtar + ")"}}>&nbsp;</div>
                                        <span className="my-0 font-weight-bold mr-2">Me</span>
                                        <div>
                                            <p style={{marginLeft: 30}}>{individual.email}</p>
                                        </div>
                                    </div>
                                    : <div className={isCreator ? "hover-effect" : ""}>
                                        <div className="my-0 mr-2 avatar-img float-left"
                                                 style={{backgroundImage: "url(" + individual.avtar + ")"}}>&nbsp;</div>
                                        <span className="my-0 font-weight-bold mr-2">{individual.name}</span>
                                        {isCreator ?
                                            <span className={"float-right"}>
                                                 <button className="delete-button btn-invisible">
                                                    <Popconfirm
                                                        icon={<i
                                                            className="far fa-question-circle position-absolute mt-1"
                                                            style={{color: 'red'}}></i>}
                                                        placement={"topLeft"}
                                                        title="Are you sure want to remove this member?"
                                                        onConfirm={(e) => this.Remove(individual.email)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onClick={(e) => {
                                                            e.target.parentElement.classList.remove("btn-invisible")
                                                        }}
                                                        onVisibleChange={(visible) => {
                                                            if (visible == false) {
                                                                const all_delete = document.getElementsByClassName("delete-button")
                                                                for (let i = 0; i < all_delete.length; i++) {
                                                                    all_delete[i].classList.add("btn-invisible")
                                                                }
                                                            }
                                                        }}
                                                        getPopupContainer={() => document.getElementsByClassName('modal')[0]}
                                                    >

                                                        <img src={deleteIcon} alt={"Delete"}/>

                                                </Popconfirm>
                                                      </button>
                                            </span>
                                            : ""}
                                        <div>
                                            <p style={{marginLeft: 30}}>{individual.email}</p>
                                        </div>
                                    </div>}

                            </div>
                        ))
                        }
                        {invitedmember.map(member => (
                            <div key={member.id} className={"mb-2"}>
                                <div className="my-0 mr-2 comment_avatar float-left"
                                                 style={{backgroundImage: "url(" + member.avtar + ")"}}>&nbsp;</div>
                                <span>{member.email}</span><span className="ml-1 color-red">(Invitation pending)</span>
                            </div>
                        ))
                        }
                    </ModalBody>
                </Modal>
                <span className={"color-nobel"}>{this.state.count}</span>
            </div>
        )
    }
}

export default AssignedMembers;
