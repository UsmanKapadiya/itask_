import React from 'react'
import userIcon from "../../images/icon_add_assign.png";
import {Form, message, Popover, Select, TreeSelect} from "antd";

let fields = {
    parentId: '',
    setValidationCount: ''
};
let count = 0;

class AssignMembers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            members: (this.props.selectedMembers != undefined ? this.props.selectedMembers : []),
            popoverOpen: false
        }
        this.toggle = this.toggle.bind(this);

    }

    toggle() {
        this.setState(prevState => ({
            popoverOpen: !prevState.popoverOpen
        }));
    }

    render() {
        const suggestions = this.props.memberSuggestion;
        fields["parentId"] = this.props.parentId;
        fields["setValidationCount"] = this.props.setValidationCount;
        return (
            <div className={"mr-3 position-relative cursor_pointer"}>
                <img src={userIcon} alt={"Assign member(s)"} height="25" className={"ml-2 cursor_pointer"}
                     onClick={() => {
                         fields["parentId"] != 0 ? this.toggle() : message.error("Please select parent project")
                     }}/>
                {this.state.popoverOpen ?
                    <div className={"member-selection-outer"}>
                        <Form fields={[
                            {name: ['members'], value: this.state.members},
                        ]}>
                            <Form.Item name="members" rules={[({getFieldValue}) => ({
                                validator(rule, value) {
                                    count = 0;
                                    if (fields.parentId == undefined) {
                                        count = 0;
                                        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                                        for (let v in value) {
                                            if (!mailformat.test(value[v])) {
                                                count++;
                                            }
                                        }
                                        fields.setValidationCount(count)
                                        if (count == 0) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject('Invalid email-id');
                                        }
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            })]}>
                                <Select
                                    style={{width: '100%'}}
                                    mode={this.props.parentId == undefined ? "tags" : "multiple"}
                                    placeholder="Type an assignee"
                                    value={this.state.members}
                                    onChange={
                                        (e) => {
                                            if (count == 0) {
                                                this.props.memberCallback(e);
                                            }
                                            this.setState({"members": e})
                                        }
                                    }
                                    optionLabelProp="label"
                                    defaultOpen={false}
                                    menuItemSelectedIcon={<i className="fas fa-check"></i>}
                                    getPopupContainer={() => document.getElementsByClassName('modal')[0] != undefined ? document.getElementsByClassName('modal')[0] : document.getElementById('mainapp')}
                                    removeIcon={<i className="fas fa-times remove-member"></i>}
                                    autoFocus={true}
                                    onBlur={() => {
                                        if (count == 0) {
                                            this.setState({
                                                'popoverOpen': false
                                            })
                                            this.props.tagCreation('member');
                                        }
                                    }}
                                >
                                    {suggestions.map((member) => (
                                        <Select.Option key={member.id} value={member.email} label={member.email}>
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
                    : ""}
            </div>
        )
    }
}

export default AssignMembers;
