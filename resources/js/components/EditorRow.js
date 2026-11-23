import React, {Component, useState} from 'react'
import Datetime from 'react-datetime'
import 'antd/dist/antd.css';
import {TreeSelect, Dropdown, Menu, Select, Spin} from 'antd';
import userIcon from "../../images/icon_add_assign.png";
import Projectlist from "./AddTaskProjectList";
import Taglist from "./AddTaskTagList"
import Flaglist from './AddTaskFlagList'
import Reminder from './AddTaskReminder'
import AssignMembers from './AssignToProject'
import {editTask} from "./FunctionCalls";
import DisplayTag from "./DisplayTag";


class EditorRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: this.props.taskData.id,
            taskname: this.props.taskData.name,
            priority: this.props.taskData.priority,
            date: this.props.taskData.editdueDate,
            repeat: 'Never',
            frequency: '',
            frequency_count: '',
            displayDueDate: false,
            displayRepeat: this.props.taskData.repeat,
            members: [],
            parentproject: this.props.taskData.parentId,
            parentProjectLabel: '',
            tags: this.props.taskData.tags,
            reminder: this.props.taskData.reminder,
            memberSuggestion: [],
            tagsData: {
                'tag': [],
                'member': [],
                'reminder': [],
                'project': []
            },
            isReceiveData: 0
        }
        this.createTag = this.createTag.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.onChange = this.onChange.bind(this)
        this.datecallbackFunction = this.datecallbackFunction.bind(this)
        this.displayRepeat = this.displayRepeat.bind(this)
        this.membercallbackFunction = this.membercallbackFunction.bind(this)
        this.parentCallbackFunction = this.parentCallbackFunction.bind(this);
        this.tagscallbackFunction = this.tagscallbackFunction.bind(this)
        this.flagcallbackFunction = this.flagcallbackFunction.bind(this)
        this.remindercallbackFunction = this.remindercallbackFunction.bind(this)
        this.saveEdit = this.saveEdit.bind(this)
        this.cancelEditRow = this.cancelEditRow.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleOutsideClick);
        $('[data-toggle="tooltip"]').tooltip()
        this.setState({isReceiveData: 0});
        if (this.props.taskData.id != undefined) {
            fetch("/members-list/" + this.props.taskData.parentId)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            memberSuggestion: result
                        });
                    },
                    (error) => {
                        this.setState({
                            error,
                        });
                    }
                )

            fetch('/project-detail-by-id', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({
                    "projectId": this.props.taskData.id
                })
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        if (result.error_msg != "") {
                            message.error(result.error_msg);
                        } else {
                            var result = result.response;
                            this.setState({...this.state, ...result}, function () {
                                this.setState({isReceiveData: 1});
                                if (this.state.tags.length != 0) {
                                    this.createTag("tag");
                                }
                                this.createTag("member");
                                this.createTag("reminder");
                                this.displayRepeat();
                            })
                        }
                    },
                    (error) => {
                        this.setState({
                            error,
                        })
                    },
                )
        }
    }

    createTag(type) {
        if (type == "tag") {
            const tags = this.state.tags.map((tag, index) => {
                return ({
                        'type': 'tag',
                        'data': tag,
                        'removeFunction': () => this.removeValue('tag', index)
                    }
                )
            });
            this.setState(prevState => ({
                tagsData: {
                    'tag': tags,
                    'member': [...prevState.tagsData.member],
                    'project': [...prevState.tagsData.project],
                    'reminder': [...prevState.tagsData.reminder]
                }
            }))
        } else if (type == "member") {
            const members = this.state.members.map((member, index) => {
                return ({
                        'type': 'member',
                        'data': member,
                        'removeFunction': () => this.removeValue('member', index)
                    }
                )
            });
            this.setState(prevState => ({
                tagsData: {
                    'tag': [...prevState.tagsData.tag],
                    'member': members,
                    'reminder': [...prevState.tagsData.reminder],
                    'project': [...prevState.tagsData.project]
                },
            }))
        } else if (type == "reminder") {
            let reminder = [];
            if (this.state.reminder != 'None') {
                reminder = [{
                    'type': 'reminder',
                    'data': this.state.reminder,
                    'removeFunction': () => this.removeValue('reminder', this.state.reminder)
                }];
            }
            this.setState(prevState => ({
                tagsData: {
                    'tag': [...prevState.tagsData.tag],
                    'member': [...prevState.tagsData.member],
                    'project': [...prevState.tagsData.project],
                    'reminder': reminder
                },
            }))
        } else if (type == "project") {
            let project = [];
            if (this.state.parentproject != '0') {
                project = [{
                    'type': 'project',
                    'data': this.state.parentProjectLabel,
                    'removeFunction': () => this.removeValue('project', this.state.parentproject)
                }];
            }
            this.setState(prevState => ({
                tagsData: {
                    'member': [...prevState.tagsData.member],
                    'tag': [...prevState.tagsData.tag],
                    'reminder': [...prevState.tagsData.reminder],
                    'project': project,
                },
            }))
        }
    }

    removeValue(type, data) {
        if (type == "tag") {
            const tags = this.state.tags;
            tags.splice(data, 1)
            this.setState({tags: tags}, function () {
                this.createTag('tag');
            });
        } else if (type == "member") {
            const members = this.state.members;
            members.splice(data, 1)
            this.setState({members: members}, function () {
                this.createTag('member');
            })
        } else if (type == "reminder") {
            this.setState({reminder: 'None'}, function () {
                this.createTag('reminder');
            });
        } else if (type == "project") {
            this.setState({parentproject: "0", parentProjectLabel: "", memberSuggestion: [], members: []}, function () {
                this.parentProjectElement.current.state.parentproject = "0";
                this.createTag('project');
                this.createTag('member');
            })
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    validation(currentDate) {
        var new_date = new Date()
        new_date.setDate(new_date.getDate() - 1)
        return currentDate.isAfter(new_date)
    }

    datecallbackFunction(childData) {
        this.setState({date: childData.format('YYYY-MM-DD HH:mm')});
    }

    displayRepeat() {
        let repeat = this.state.repeat;

        if (this.state.repeat == "") {
            let count = (this.state.frequency_count != "" ? this.state.frequency_count : "1");
            if (this.state.frequency == "daily" || this.state.frequency == "")
                repeat = "Every " + count + (count > 1 ? " Days" : " Day");
            else if (this.state.frequency == "weekly")
                repeat = "Every " + count + (count > 1 ? " Weeks" : " Week");
            else if (this.state.frequency == "monthly")
                repeat = "Every " + count + (count > 1 ? " Months" : " Month");
            else if (this.state.frequency == "yearly")
                repeat = "Every " + count + (count > 1 ? " Years" : " Year");
        }
        this.setState({
            'displayRepeat': repeat
        })
        return repeat
    }

    membercallbackFunction(childData) {
        this.setState({members: childData})
    }

    tagscallbackFunction(childData) {
        this.setState({tags: childData});
    }

    flagcallbackFunction(childData) {
        this.setState({priority: childData}, () => {
        });
    }

    remindercallbackFunction(childData) {
        this.setState({reminder: childData}, () => {
        });
    }

    saveEdit(e) {
        const task = {
            projectId: this.state.projectId,
            name: this.state.taskname,
            date: this.state.date,
            repeat: this.displayRepeat(),
            priority: this.state.priority,
            reminder: this.state.reminder,
            tags: this.state.tags,
            members: this.state.members,
            parentproject: this.state.parentproject,
            errors: {}
        }
        editTask(task).then(res => {
            if (res.errorStatus) {
                this.setState({errors: res.data})
            } else {
                this.props.saveCallback(this.state.projectId);
            }
        })

    }

    handleOutsideClick(e) {
        let classList = Array.from(e.target.classList);
        if (classList.length == 0) {
            classList = Array.from(e.target.parentNode.classList);
        }
        let rdt = 0;
        for (let i in classList) {
            if (classList[i].indexOf("rdt") > -1) {
                rdt = rdt + 1;
            }
        }
        if (rdt == 0 && !e.target.classList.contains("ant-dropdown-link") && !e.target.classList.contains("ant-dropdown-menu-item")) {
            this.setState({
                'displayDueDate': 0
            })
        }
    }

    cancelEditRow(e) {
        this.props.deleteRow(e);
    }

    parentCallbackFunction(childData, name) {
        if (childData != this.state.parentproject) {
            this.setState({
                parentproject: childData,
                parentProjectLabel: name,
                memberSuggestion: [],
                members: [],
                isReceiveData: parseInt(childData) == 0 ? 1 : 0
            }, function () {
                this.createTag('member');
                if (parseInt(childData) != 0) {
                    fetch("/members-list/" + childData)
                        .then(res => res.json())
                        .then(
                            (result) => {
                                this.setState({
                                    memberSuggestion: result,
                                    isReceiveData: 1
                                });
                            },
                            (error) => {
                                this.setState({
                                    error
                                });
                            }
                        )
                }
                this.createTag('project');
            });
        }


    }

    render() {
        const {tagsData} = this.state;
        const projectId = this.props.taskData.parentId;
        return (
            <div>
                <div className={"my-3 py-2 border-bottom "}>
                    {this.state.errors && this.state.errors.not_found ? <Alert color="danger">
                        {this.state.errors.not_found}
                    </Alert> : ""}
                    <div className={"d-flex"}>
                        <div className="task-tags-input w-75">
                            <input type="text"
                                   className="form-control border-0 pl-0"
                                   onChange={this.onChange}
                                   value={this.state.taskname}
                                   name="taskname"
                            />
                            <ul id="tags">
                                {
                                    Object.keys(tagsData).map(function (name, index) {
                                        return tagsData[name].length > 0 && tagsData[name].map((n, index) => (
                                            <DisplayTag key={n.type + "_" + index} data={n} type={n.type}/>
                                        ));
                                    })
                                }
                            </ul>
                        </div>
                        <input
                            type="text"
                            className="form-control w-25 dueDate"
                            onChange={() => {
                            }}
                            name="dueDate"
                            placeholder={"Schedule"}
                            value={this.state.date}
                            onClick={() => {
                                this.setState((prevState) => ({
                                    displayDueDate: !prevState.displayDueDate,
                                }))
                            }}
                            autoComplete={"off"}
                        />
                        {this.state.isReceiveData ?
                            <AssignMembers parentId={this.props.taskData.parentId}
                                           memberSuggestion={this.state.memberSuggestion}
                                           memberCallback={this.membercallbackFunction} tagCreation={this.createTag}
                                           selectedMembers={this.state.members}/> : ""}
                    </div>
                    {this.state.displayDueDate ? (
                        <div className={"due-date-container"}>
                            <Datetime
                                closeOnSelect={true}
                                isValidDate={this.validation}
                                onChange={this.datecallbackFunction}
                                open={true}
                                input={false}
                                value={new Date(this.state.date)}
                            />
                            <div className={"p-2 d-flex"}>
                                <Dropdown disabled={this.state.date != "" ? false : true} overlay={
                                    (<Menu onClick={(item) => {
                                        if (item.keyPath.length > 1) {
                                            if (item.keyPath[1] == "frequency") {
                                                this.setState({
                                                    "repeat": "",
                                                    "frequency": item.keyPath[0],
                                                    "frequency_count": (this.state.frequency_count != "" ? this.state.frequency_count : "1")
                                                }, function () {
                                                    this.displayRepeat();
                                                })
                                            } else if (item.keyPath[1] == "frequency_count") {
                                                this.setState({
                                                    "repeat": "",
                                                    "frequency_count": item.keyPath[0],
                                                    "frequency": (this.state.frequency != "" ? this.state.frequency : "daily")
                                                }, function () {
                                                    this.displayRepeat();
                                                })
                                            }
                                        } else {
                                            this.setState({
                                                "repeat": item.key,
                                                "frequency": "",
                                                "frequency_count": ""
                                            }, function () {
                                                this.displayRepeat();
                                            })
                                        }
                                    }}
                                           selectedKeys={[this.state.repeat, this.state.frequency, this.state.frequency_count]}>
                                        <Menu.Item key={"Never"}>Never</Menu.Item>
                                        <Menu.Item key={"Every Day"}>Every Day</Menu.Item>
                                        <Menu.Item key={"Every Week"}>Every Week</Menu.Item>
                                        <Menu.Item key={"Every 2 Weeks"}>Every 2 Weeks</Menu.Item>
                                        <Menu.Item key={"Every Month"}>Every Month</Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.ItemGroup title="Custom">
                                            <Menu.SubMenu title="Frequency" key={"frequency"}>
                                                <Menu.Item key={"daily"}>Daily</Menu.Item>
                                                <Menu.Item key={"weekly"}>Weekly</Menu.Item>
                                                <Menu.Item key={"monthly"}>Monthly</Menu.Item>
                                                <Menu.Item key={"yearly"}>Yearly</Menu.Item>
                                            </Menu.SubMenu>
                                            <Menu.SubMenu title="Every" key={"frequency_count"}>
                                                <Menu.Item key={"1"}>1</Menu.Item>
                                                <Menu.Item key={"2"}>2</Menu.Item>
                                                <Menu.Item key={"3"}>3</Menu.Item>
                                                <Menu.Item key={"4"}>4</Menu.Item>
                                                <Menu.Item key={"5"}>5</Menu.Item>
                                                <Menu.Item key={"6"}>6</Menu.Item>
                                            </Menu.SubMenu>
                                        </Menu.ItemGroup>
                                    </Menu>)
                                } trigger={['click']}>
                                    <a className="ant-dropdown-link w-50" onClick={e => e.preventDefault()}>
                                        Repeat
                                    </a>
                                </Dropdown>
                                <div className={"ml-2"}>{this.state.displayRepeat}</div>
                            </div>
                        </div>) : ""}
                    {this.state.errors && this.state.errors.name ?
                        <label className="error" htmlFor="name">{this.state.errors.name}</label> : ""}
                    <div className={"d-flex mt-3"}>
                        <div className={"w-75"}>
                            <input type={"button"}
                                   className={"btn bg-skyblue"}
                                   value={"Save"}
                                   onClick={this.saveEdit}/>
                            <a className={"ml-3"}
                               onClick={() => this.cancelEditRow("edit_" + this.props.taskData.id)}>Cancel</a>
                        </div>
                        <div className="d-flex">
                            <Projectlist parentId={projectId} parentCallback={this.parentCallbackFunction}
                                         ref={this.parentProjectElement}/>
                            <Taglist tagsCallback={this.tagscallbackFunction} tagCreation={this.createTag}
                                     selectedTags={this.state.tags}/>
                            <Flaglist priority={this.props.taskData.priority}
                                      flagCallback={this.flagcallbackFunction}/>
                            <Reminder selectedDueDate={this.state.date}
                                      reminderCallback={this.remindercallbackFunction}
                                      tagCreation={this.createTag} reminder={this.state.reminder}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditorRow
