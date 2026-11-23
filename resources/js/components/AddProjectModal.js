import React, {Component} from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap'
import AssignMembers from './AssignToProject'
import plusIcon from '../../images/icon_left_add.png'

import {addProject} from './FunctionCalls'
import Taglist from "./AddTaskTagList";
import Flaglist from './AddTaskFlagList'
import Reminder from './AddTaskReminder'
import Datetime from 'react-datetime'
import 'antd/dist/antd.css';
import * as options from './Constants'
import Dropzone from 'react-dropzone'
import {message, TreeSelect, Dropdown, Menu, Select, Spin} from 'antd';
import DisplayTag from "./DisplayTag";
import {confirmAlert} from "react-confirm-alert";

let isEdit = 0;
let validationCheck = 0;
let changeChildStatus = 0;
const all_status = options.statusValue;

class AddProjectModal extends Component {
    constructor(props) {
        super(props)
        isEdit = this.props.isEdit;
        this.state = {
            error: null,
            projects: [],
            modal: false,
            flag: '4',
            projectname: '',
            date: '',
            repeat: 'Never',
            reminder: 'None',
            projectcolor: '000000',
            parentproject: '0',
            parent_project_status: "",
            memberSuggestion: [],
            members: [],
            type: 'project',
            status: 1,
            tags: [],
            showMe: false,
            frequency: '',
            frequency_count: '',
            files: [],
            errors: {},
            displayDueDate: false,
            displayRepeat: '',
            note: '',
            status_name: '',
            isDisplaySpinner: false,
            isDisplayBtnSpinner: false,
            tagsData: {
                'tag': [],
                'member': [],
                'reminder': [],
                'attachment': []
            }
        }
        this.onChange = this.onChange.bind(this)
        this.projectColorChange = this.projectColorChange.bind(this)
        this.statusChange = this.statusChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.Add = this.Add.bind(this)
        this.tagscallbackFunction = this.tagscallbackFunction.bind(this)
        this.flagcallbackFunction = this.flagcallbackFunction.bind(this)
        this.membercallbackFunction = this.membercallbackFunction.bind(this)
        this.datecallbackFunction = this.datecallbackFunction.bind(this)
        this.showFiles = this.showFiles.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.displayRepeat = this.displayRepeat.bind(this)
        this.remindercallbackFunction = this.remindercallbackFunction.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.createTag = this.createTag.bind(this);
        this.resetStates = this.resetStates.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.getMemberProjects = this.getMemberProjects.bind(this);
    }

    componentDidMount() {
        this._ismounted = true;
        document.addEventListener("mousedown", this.handleOutsideClick);
        if (this.props.projectId != undefined) {
            this.setState({modal: true, isDisplaySpinner: true});
            fetch('/project-detail-by-id', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({
                    "projectId": this.props.projectId
                })
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        this.setState({isDisplaySpinner: false});
                        if (result.error_msg != "") {
                            message.error(result.error_msg);
                            this.props.updateEditView();
                        } else {
                            let response_result = result.response;
                            this.setState({...this.state, ...response_result}, function () {
                                this.createTag("tag");
                                this.createTag("member");
                                this.createTag("reminder");
                                this.createTag("attachment");
                                this.displayRepeat();
                            })
                        }
                    },
                    (error) => {
                        this.setState({
                            error,
                            isDisplaySpinner: false
                        })
                    },
                )
        }
        if (this.props.parentId != undefined) {
            this.setState({modal: true})
        }
    }

    getMemberProjects() {
        this.displayRepeat();
        this.setState({isDisplaySpinner: true});
        $('[data-toggle="tooltip"]').tooltip()
        fetch('/member-projects', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            body: JSON.stringify({
                "type": "project",
                "pt_id": this.props.projectId
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        projects: result.projects,
                        memberSuggestion: result.members,
                    }, function () {
                        this.setState({isDisplaySpinner: false});
                        if (this.props.parentId != undefined) {
                            this.setState({parentproject: this.props.parentId});
                        }
                        if (this.props.projectId == undefined) {
                            this.setState({reminder: result.auto_reminder});
                        }
                    })
                },
                (error) => {
                    this.setState({
                        error,
                        isDisplaySpinner: false
                    })
                },
            )
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
                    'attachment': [...prevState.tagsData.attachment]
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
                    'attachment': [...prevState.tagsData.attachment]
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
                    'attachment': [...prevState.tagsData.attachment]
                },
            }))
        } else if (type == "attachment") {
            let files = [];
            if (Object.keys(this.state.files).length > 0) {
                files = Object.keys(this.state.files).map((file) => {
                    return ({
                        'type': 'attachment',
                        'data': this.state.files[file].name,
                        'link': (this.state.files[file].url != undefined ? this.state.files[file].url : undefined),
                        'removeFunction': () => this.removeValue('attachment', file)
                    })
                });
            }
            this.setState(prevState => ({
                tagsData: {
                    'member': [...prevState.tagsData.member],
                    'tag': [...prevState.tagsData.tag],
                    'reminder': [...prevState.tagsData.reminder],
                    'attachment': files,
                },
            }))
        }
    }

    projectColorChange(projectcolor) {
        this.setState({projectcolor: projectcolor})
    }

    statusChange(status) {
        changeChildStatus = 0;
        if (this.state.status_name != "") {
            const selectedStatus = all_status[status.toString()];
            let is_error = 0;
            if (this.state.parent_project_status != "") {
                if (this.state.status_name == "completed" && (this.state.parent_project_status == "review" || this.state.parent_project_status == "completed")) {
                    if (this.state.parent_project_status == "review") {
                        is_error = 1;
                        message.error("Parent Project is under review. Please change its status to active then you can change this project's status.")
                    } else if (this.state.parent_project_status == "completed") {
                        is_error = 1;
                        message.error("Parent Project is completed. Please change its status to active then you can change this project's status.")
                    }
                }
            }
            if (!is_error) {
                if ((this.state.status_name == "review" || this.state.status_name == "completed") && (selectedStatus.name == "Active" || selectedStatus.name == "On-hold")) {
                    confirmAlert({
                        title: '',
                        message: "Do you want to change status of this project's tasks and subprojects to active?",
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: () => {
                                    changeChildStatus = 1;
                                    this.setState({status: status})
                                },
                            },
                            {
                                label: 'No',
                                onClick: () => {
                                    this.setState({status: status})
                                },
                            },
                        ],
                    })
                } else {
                    this.setState({status: status})
                }
            }
        } else {
            this.setState({status: status})
        }

    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    toggle(e) {
        e.stopPropagation();
        this.setState((prevState) => ({
            modal: !prevState.modal,
        }))
    }

    remindercallbackFunction(childData) {
        this.setState({reminder: childData});
    }

    Add(e) {
        if (validationCheck == 0) {
            this.setState({isDisplayBtnSpinner: true})
            const props = this.props;
            const project = {
                projectname: this.state.projectname,
                date: this.state.date,
                repeat: this.displayRepeat(),
                reminder: this.state.reminder,
                flag: this.state.flag,
                projectcolor: this.state.projectcolor,
                parentproject: this.state.parentproject,
                members: this.state.members,
                type: this.state.type,
                status: this.state.status,
                tags: this.state.tags,
                files: this.state.files,
                errors: {},
                note: this.state.note,
                isEdit: isEdit,
                projectId: (this.props.projectId != undefined ? this.props.projectId : ""),
                isUpdateStatus: changeChildStatus
            }
            const parentProject = this.state.parentproject;
            addProject(project).then((res) => {
                if (res.errorStatus) {
                    this.setState({errors: res.data, isDisplayBtnSpinner: false})
                } else {
                    if (this._ismounted) {
                        this.setState((prevState) => ({
                            modal: false,
                            isDisplayBtnSpinner: false
                        }))
                    }
                    message.success(res.data, 3);
                }
            })
        }
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

    tagscallbackFunction(childData) {
        this.setState({tags: childData});
    }

    flagcallbackFunction(childData) {
        this.setState({flag: childData});
    }

    membercallbackFunction(childData) {
        this.setState({members: childData})
    }

    datecallbackFunction(childData) {
        this.setState({date: childData.format('YYYY-MM-DD HH:mm')})
    }

    validation(currentDate) {
        var new_date = new Date()
        new_date.setDate(new_date.getDate() - 1)
        return currentDate.isAfter(new_date)
    }

    showFiles() {
        this.setState((prevState) => ({showMe: !prevState.showMe}));
    }

    onDrop(files) {
        this.setState({files: [...this.state.files, ...files]}, function () {
            this.createTag('attachment');
        })
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
        }

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

    componentWillUnmount() {
        this._ismounted = false;
        document.removeEventListener("mousedown", this.handleOutsideClick);
    }

    resetStates() {
        this.setState({
            flag: '4',
            projectname: '',
            date: '',
            repeat: 'Never',
            reminder: 'None',
            projectcolor: '000000',
            parentproject: '0',
            memberSuggestion: [],
            members: [],
            status: 1,
            tags: [],
            showMe: false,
            frequency: '',
            frequency_count: '',
            files: [],
            errors: {},
            displayDueDate: false,
            displayRepeat: '',
            note: '',
            tagsData: {
                'tag': [],
                'member': [],
                'reminder': [],
                'attachment': []
            }
        });
        if (isEdit == 1) {
            this.props.updateEditView();
            isEdit = 0;
        }
    }

    setValidationCount = (count) => {
        validationCheck = count;
    }

    render() {
        const {projects} = this.state
        const {tagsData} = this.state;
        return (
            <>
                {!this.props.isEdit && this.props.parentId == undefined ?
                    <a onClick={this.toggle} style={{cursor: 'pointer'}}>
                        <img src={plusIcon} alt="add Project"/>
                    </a>
                    : ""}

                <Modal isOpen={this.state.modal} onOpened={this.getMemberProjects} className="modal-lg AddProject"
                       onClosed={() => {
                           this.resetStates()
                           if (this.props.parentId != undefined) {
                               this.props.closeSubprojectModal();
                           }
                       }}>
                    <ModalHeader>{isEdit ? "Edit" : "Add"} project</ModalHeader>
                    <ModalBody>
                        {this.state.errors && this.state.errors.not_found ? (
                            <Alert color="danger">{this.state.errors.not_found}</Alert>
                        ) : (
                            ''
                        )}
                        <Spin spinning={this.state.isDisplaySpinner} size={"large"}>
                            <p className="font-weight-bold mb-0">Project name</p>
                            <div className="d-flex">
                                <div className="tags-input w-75">
                                    <ul id="tags">
                                        {
                                            Object.keys(tagsData).map(function (name, index) {
                                                return tagsData[name].length > 0 && tagsData[name].map((n, index) => (
                                                    <DisplayTag key={n.type + "_" + index} data={n} type={n.type}/>
                                                ));
                                            })
                                        }
                                    </ul>
                                    <input type="text" className="form-control add-project-name"
                                           onChange={this.onChange} name="projectname" placeholder={"Name"}
                                           value={this.state.projectname}/>
                                </div>
                                <input type="text" className="form-control w-25 dueDate" onChange={() => {
                                }} name="dueDate" placeholder={"Schedule"} value={this.state.date} onClick={() => {
                                    this.setState((prevState) => ({
                                        displayDueDate: !prevState.displayDueDate,
                                    }))
                                }} autoComplete={"off"}/>
                                {this.state.memberSuggestion.length > 0 ?
                                    <AssignMembers setValidationCount={this.setValidationCount}
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
                            {this.state.errors && this.state.errors.name ? (
                                <label className="error" htmlFor="name">
                                    {this.state.errors.name}
                                </label>
                            ) : (
                                ''
                            )}
                            <div className="d-flex justify-content-end my-3">
                                <Taglist tagsCallback={this.tagscallbackFunction} tagCreation={this.createTag}
                                         selectedTags={this.state.tags}/>
                                <Flaglist priority={this.state.flag} flagCallback={this.flagcallbackFunction}/>
                                <Reminder selectedDueDate={this.state.date} reminder={this.state.reminder}
                                          reminderCallback={this.remindercallbackFunction}
                                          tagCreation={this.createTag} selectedValue={this.state.reminder}/>
                                <a className={"cursor_pointer"}>
                                    <img src={options.ATTACHMENT_IMAGE} alt={"Attachment"}/>
                                </a>
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
                                        <div {...getRootProps({className: 'attachment bottom-22 cursor_pointer','data-toggle':'tooltip',title:'Add attachment(s)'})}>
                                            <input {...getInputProps()} />

                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div className="d-flex mb-3 justify-content-between">
                                <div className="add-project-col w-25">
                                    <p className="font-weight-bold mb-0">Color</p>
                                    <Select
                                        style={{width: '100%'}}
                                        placeholder="Select project color"
                                        defaultValue={this.state.projectcolor}
                                        onChange={this.projectColorChange}
                                        optionLabelProp="label"
                                        showSearch={false}
                                    >
                                        {options.colorOptions.map((color, index) => (
                                            <Select.Option key={index} value={color.value} label={color.label}>
                                                {color.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="add-project-col" id={"parent-project-select"}>
                                    <p className="font-weight-bold mb-0">Parent project</p>
                                    <TreeSelect
                                        showSearch
                                        style={{width: '100%'}}
                                        value={this.state.parentproject}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="No parent"
                                        allowClear
                                        treeDefaultExpandAll
                                        onChange={(value) => {
                                            const selectedStatus = all_status[this.state.status.toString()];
                                            if (selectedStatus.name == "Review") {
                                                message.error("This project is under review so change its status to active and save then only you can edit parent project")
                                            } else if (selectedStatus.name == "Complete") {
                                                message.error("This project is completed so change its status to active and save then only you can edit parent project")
                                            } else {
                                                this.setState({"parentproject": value})
                                            }
                                        }}
                                        treeData={projects}
                                    >
                                    </TreeSelect>
                                </div>
                                <div className="add-project-col w-25">
                                    <p className="font-weight-bold mb-0 mr-2 ">Status</p>
                                    <Select
                                        style={{width: '100%'}}
                                        placeholder="Select status"
                                        value={this.state.status}
                                        onChange={this.statusChange}
                                        optionLabelProp="label"
                                        showSearch={false}
                                    >
                                        {options.statusOptions.map((status, index) => (
                                            <Select.Option key={index}
                                                           disabled={(!isEdit && (status.name == "Complete" || status.name == "Review")) ? true : false}
                                                           value={status.value} label={status.label}>
                                                {status.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <p className="font-weight-bold mb-0">Note</p>
                            <div>
                            <textarea className={"form-control"} placeholder={"Note"} rows={"2"} cols={"3"}
                                      name={"note"} onChange={this.onChange} value={this.state.note}></textarea>
                            </div>
                        </Spin>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}
                                disabled={this.state.isDisplayBtnSpinner ? true : false}>
                            Cancel
                        </Button>{' '}
                        <Button color="primary" onClick={this.Add}
                                disabled={this.state.isDisplayBtnSpinner ? true : false}>
                            {isEdit ? "Update" : "Add"} <Spin size={"small"} spinning={this.state.isDisplayBtnSpinner}/>
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default AddProjectModal
