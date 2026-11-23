import React from 'react'
import userIcon from "../../images/icon_add_assign.png";
import {Form, Input, message, Select} from "antd";
import {inviteMember} from './FunctionCalls';

let count = 0;

class InviteMembers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectId: this.props.projectId,
            projectName: this.props.projectName,
            members: []
        }

        this.invite = this.invite.bind(this)
    }

    invite(e) {
        if (count != 0) {
            return false;
        }
        const is_duplicate = this.props.checkDuplication(this.state.members)
        if (is_duplicate == "success") {
            const inviteMembers = {
                projectId: this.state.projectId,
                projectName: this.state.projectName,
                members: this.state.members
            }
            inviteMember(inviteMembers).then(res => {
                if (res.errorStatus) {
                    message.error(res.data)
                } else {
                    this.setState({members: []})
                    this.props.memberCallback(e);
                }
            })
        }
    }

    render() {
        const suggestions = this.props.suggestions;
        return (
            <div className={"d-flex justify-content-around mb-4"} id={"member_container"}>
                <div className={"w-100"}>
                    <Form fields={[{name: ['members'], value: this.state.members}]}>
                        <Form.Item name="members" rules={[({getFieldValue}) => ({
                            validator(rule, value) {
                                count = 0;
                                let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                                for (let v in value) {
                                    if (!mailformat.test(value[v])) {
                                        count++;
                                    }
                                }
                                if (count == 0) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('Invalid email-id');
                                }
                            },
                        })]}>
                            <Select
                                style={{width: '100%'}}
                                mode={"tags"}
                                placeholder="Enter Name or Email"
                                value={this.state.members}
                                onChange={
                                    (e) => {
                                        this.setState({"members": e})
                                    }
                                }
                                optionLabelProp="value"
                                defaultOpen={true}
                                menuItemSelectedIcon={<i className="fas fa-check"></i>}
                                getPopupContainer={() => document.getElementsByClassName('modal')[0] != undefined ? document.getElementsByClassName('modal')[0] : document.getElementById('mainapp')}
                                removeIcon={<i className="fas fa-times remove-member"></i>}
                                autoFocus={true}
                            >
                                {suggestions.map((member) => (
                                    <Select.Option key={member.id} value={member.email} label={member.name}>
                                        <div className="demo-option-label-item">
                                        <div className="my-0 mr-2 assign_to_avatar float-left mt-1"
                                                 style={{backgroundImage: "url(" + member.avatar + ")"}}>&nbsp;</div>
                                            {member.name}
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <button onClick={this.invite} className={"btn btn-primary modal-btn ml-2"}>Invite</button>
                </div>
            </div>
        )
    }
}

export default InviteMembers;
