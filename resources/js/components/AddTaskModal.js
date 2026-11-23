import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Dropzone from 'react-dropzone'
import Datetime from 'react-datetime'
import 'antd/dist/antd.css';
import {Dropdown, Menu, message, Spin} from 'antd';
import Projectlist from "./AddTaskProjectList";
import Taglist from "./AddTaskTagList";
import Flaglist from "./AddTaskFlagList";
import Reminder from "./AddTaskReminder";
import AssignMembers from './AssignToProject'
import {addTask} from "./FunctionCalls";
import addImage from '../../images/icon_nav_add.png';
import Comment from "./AddTaskComment"
import DisplayTag from "./DisplayTag";
import ProjectContext from "./projectContext";
import * as options from "./Constants";


class AddTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            modal: false,
            taskname: '',
            date: '',
            repeat: 'Never',
            frequency: '',
            frequency_count: '',
            displayDueDate: false,
            displayRepeat: '',
            reminder: 'None',
            priority: '4',
            parentproject: '0',
            parentProjectLabel: '',
            memberSuggestion: [],
            type: 'task',
            status: '1',
            tags: [],
            members: [],
            comment: '',
            showMe: false,
            files: [],
            errors: {},
            isDisplaySpinner: false,
            isDisplayBtnSpinner: false,
            tagsData: {
                'tag': [],
                'member': [],
                'reminder': [],
                'attachment': [],
                'project': [],
                'comment': []
            },
            isReceiveData: 0
        }
        this.onChange = this.onChange.bind(this);
        this.datecallbackFunction = this.datecallbackFunction.bind(this)
        this.displayRepeat = this.displayRepeat.bind(this)
        this.parentCallbackFunction = this.parentCallbackFunction.bind(this);
        this.tagscallbackFunction = this.tagscallbackFunction.bind(this);
        this.flagcallbackFunction = this.flagcallbackFunction.bind(this);
        this.remindercallbackFunction = this.remindercallbackFunction.bind(this);
        this.membercallbackFunction = this.membercallbackFunction.bind(this)
        this.commentCallbackfunction = this.commentCallbackfunction.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.removeFile = this.removeFile.bind(this)
        this.removeAll = this.removeAll.bind(this)
        this.toggle = this.toggle.bind(this)
        this.Add = this.Add.bind(this)
        this.createTag = this.createTag.bind(this);
        this.resetStates = this.resetStates.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.commentElement = React.createRef();
        this.parentProjectElement = React.createRef();
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleOutsideClick);
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
                    'reminder': [...prevState.tagsData.reminder],
                    'attachment': [...prevState.tagsData.attachment],
                    'project': [...prevState.tagsData.project],
                    'comment': [...prevState.tagsData.comment]
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
                    'member': members,
                    'tag': [...prevState.tagsData.tag],
                    'reminder': [...prevState.tagsData.reminder],
                    'attachment': [...prevState.tagsData.attachment],
                    'project': [...prevState.tagsData.project],
                    'comment': [...prevState.tagsData.comment]
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
                    'member': [...prevState.tagsData.member],
                    'tag': [...prevState.tagsData.tag],
                    'reminder': reminder,
                    'attachment': [...prevState.tagsData.attachment],
                    'project': [...prevState.tagsData.project],
                    'comment': [...prevState.tagsData.comment]
                },
            }))
        } else if (type == "attachment") {
            let files = [];
            if (this.state.files.length > 0) {
                files = this.state.files.map((file, index) => {
                    return ({
                        'type': 'attachment',
                        'data': file.name,
                        'removeFunction': () => this.removeValue('attachment', index)
                    })
                });
            }
            this.setState(prevState => ({
                tagsData: {
                    'member': [...prevState.tagsData.member],
                    'tag': [...prevState.tagsData.tag],
                    'reminder': [...prevState.tagsData.reminder],
                    'attachment': files,
                    'project': [...prevState.tagsData.project],
                    'comment': [...prevState.tagsData.comment]
                },
            }))
        } else if (type == "comment") {
            let comment = [];
            if (this.state.comment != '') {
                comment = [{
                    'type': 'comment',
                    'data': this.state.comment,
                    'removeFunction': () => this.removeValue('comment', this.state.comment)
                }];
            }
            this.setState(prevState => ({
                tagsData: {
                    'member': [...prevState.tagsData.member],
                    'tag': [...prevState.tagsData.tag],
                    'reminder': [...prevState.tagsData.reminder],
                    'attachment': [...prevState.tagsData.attachment],
                    'project': [...prevState.tagsData.project],
                    'comment': comment
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
                    'attachment': [...prevState.tagsData.attachment],
                    'project': project,
                    'comment': [...prevState.tagsData.comment]
                },
            }))
        }
    }

    resetStates() {
        this.setState({
            taskname: '',
            date: '',
            repeat: 'Never',
            frequency: '',
            frequency_count: '',
            displayDueDate: false,
            displayRepeat: '',
            reminder: 'None',
            priority: '4',
            parentproject: '0',
            parentProjectLabel: '',
            memberSuggestion: [],
            status: '1',
            tags: [],
            members: [],
            comment: '',
            showMe: false,
            files: [],
            errors: {},
            tagsData: {
                'tag': [],
                'member': [],
                'reminder': [],
                'attachment': [],
                'project': [],
                'comment': []
            }
        });
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
        } else if (type == "attachment") {
            const files = this.state.files;
            files.splice(data, 1)
            this.setState({files: files}, function () {
                this.createTag('attachment');
            });
        } else if (type == "comment") {
            this.setState({comment: ""}, function () {
                this.commentElement.current.state.comment = "";
                this.createTag('comment');
            })
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

    parentCallbackFunction(childData, name) {
        this.setState({
            parentproject: childData,
            parentProjectLabel: name,
            memberSuggestion: [],
            members: [],
            isReceiveData: parseInt(childData) == 0 ? 1 : 0
        }, function () {
            this.createTag('member');
            if (parseInt(childData) != 0) {
                this.setState({isDisplaySpinner: true})
                fetch("/members-list/" + childData)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                memberSuggestion: result,
                                isReceiveData: 1,
                                isDisplaySpinner: false
                            });
                        },
                        (error) => {
                            this.setState({
                                error,
                                isDisplaySpinner: false
                            });
                        }
                    )
            }
            this.createTag('project');
        });
    }


    tagscallbackFunction(childData) {
        this.setState({tags: childData});
    }

    flagcallbackFunction(childData) {
        this.setState({priority: childData});
    }

    remindercallbackFunction(childData) {
        this.setState({reminder: childData});
    }

    membercallbackFunction(childData) {
        this.setState({members: childData})
    }

    commentCallbackfunction(childData) {
        this.setState({comment: childData}, function () {
            this.createTag('comment');
        })
    }

    onDrop(files) {
        this.setState({files: files}, function () {
            this.createTag('attachment');
        })
    }

    removeFile(file) {
        this.setState({
            files: this.state.files.splice(this.state.files.indexOf(file), 1),
        })
    }

    removeAll() {
        this.state.files.length = 0
        this.setState({
            files: this.state.files.splice(0, this.state.files.length),
        })
    }

    toggle(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    Add(e) {
        this.setState({isDisplayBtnSpinner: true})
        const task = {
            taskname: this.state.taskname,
            date: this.state.date,
            repeat: this.displayRepeat(),
            type: this.state.type,
            status: this.state.status,
            reminder: this.state.reminder,
            priority: this.state.priority,
            tags: this.state.tags,
            parentproject: this.state.parentproject,
            members: this.state.members,
            comment: this.state.comment,
            files: this.state.files,
            errors: {}
        }
        const parentProject = this.state.parentproject;
        const contextVar = this.context;
        addTask(task).then(res => {
            if (res.errorStatus) {
                this.setState({errors: res.data, isDisplayBtnSpinner: false})
            } else {
                this.setState(prevState => ({
                    modal: !prevState.modal,
                    isDisplayBtnSpinner: false
                }))
                message.success(res.data, 3);
            }
        })
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleOutsideClick);
    }

    render() {
        const {tagsData} = this.state;
        const projectId = this.context.selectedValue
        return (
            <div>
                {this.props.isHeader == 1 ? <a onClick={this.toggle}><img src={addImage}/></a>
                    : <div className={'cursor_pointer mb-1'}
                           onClick={() => {
                               this.props.popRef.current.props.onPopupVisibleChange(false);
                               this.toggle();
                           }}>Add task</div>}
                <Modal isOpen={this.state.modal} toggle={this.toggle} size={"lg"}
                       onOpened={() => {
                           $('[data-toggle="tooltip"]').tooltip()
                           this.displayRepeat()
                       }} onClosed={() => {
                    this.resetStates()
                }}>
                    <ModalHeader toggle={this.toggle}>Add Task</ModalHeader>
                    <ModalBody>
                        {this.state.errors && this.state.errors.not_found ? <Alert color="danger">
                            {this.state.errors.not_found}
                        </Alert> : ""}
                        <Spin spinning={this.state.isDisplaySpinner} size={"large"}>
                            <div className="d-flex" id="task_modal">
                                <div className="task-tags-input w-75">
                                    <input type="text"
                                           className="form-control border-0 p-0"
                                           onChange={this.onChange}
                                           placeholder="Name"
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
                                {this.state.isReceiveData ? <AssignMembers parentId={this.state.parentproject}
                                                                           memberSuggestion={this.state.memberSuggestion}
                                                                           memberCallback={this.membercallbackFunction}
                                                                           tagCreation={this.createTag}
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
                                        value={this.state.date != "" ? new Date(this.state.date) : new Date()}
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
                            <div className="d-flex w-100 justify-content-between mt-3">
                                <Button className={""} color="primary" onClick={this.Add} disabled={this.state.isDisplayBtnSpinner ? true : false}>Add Task <Spin size={"small"} spinning={this.state.isDisplayBtnSpinner}/></Button>
                                <div className="d-flex">
                                    <Projectlist parentId={projectId} parentCallback={this.parentCallbackFunction}
                                                 ref={this.parentProjectElement}
                                                 reminderCallback={this.remindercallbackFunction}/>
                                    <Taglist tagsCallback={this.tagscallbackFunction} tagCreation={this.createTag}
                                             selectedTags={this.state.tags}/>
                                    <Flaglist flagCallback={this.flagcallbackFunction}/>
                                    <Reminder selectedDueDate={this.state.date} reminder={this.state.reminder}
                                              reminderCallback={this.remindercallbackFunction}
                                              tagCreation={this.createTag} selectedValue={this.state.reminder}/>
                                    <Comment commentCallback={this.commentCallbackfunction} ref={this.commentElement}
                                             updateComment={() => {
                                                 this.commentElement.current.state.comment = this.state.comment
                                             }}/>
                                    <a className={"cursor_pointer"}>
                                        <img src={options.ATTACHMENT_IMAGE} alt={"Attachment"}/>
                                    </a>
                                </div>
                            </div>
                            <div className={"position-relative"}>
                                {this.state.errors && this.state.errors.files ? (
                                    <label className="error">
                                        {this.state.errors.files}
                                    </label>
                                ) : (
                                    ''
                                )}
                                <Dropzone
                                    onDrop={this.onDrop}
                                    maxFiles={7}
                                    maxSize={31457280}
                                    accept="image/*,video/*,audio/*,.rtf,.csv.json,.html,.htm,.zip,.pdf,.xml,.txt,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,text/plain,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                    id="file"
                                >
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps({
                                            className: 'attachment bottom-15 cursor_pointer',
                                            'data-toggle': 'tooltip',
                                            title: 'Add attachment(s)'
                                        })}>
                                            <input {...getInputProps()} />

                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                        </Spin>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

}

AddTaskModal.contextType = ProjectContext;
export default AddTaskModal;


