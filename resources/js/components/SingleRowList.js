import React, {Component} from "react";
import EditorRow from "./EditorRow";
import projectIcon from "../../images/icon_project.png";
import Comment from "./Comment";
import Attachments from './Attachments'
import {message, Popover} from "antd";
import editIcon from "../../images/icon_function_edit.png";
import deleteIcon from "../../images/icon_function_delete.png";
import onHold from "../../images/icon_function_onhold.png"
import dotImage from "../../images/icon_left_more.png";
import {confirmAlert} from "react-confirm-alert";
import {deleteProjectTask, completeUncompleteTask} from "./FunctionCalls";
import * as options from './Constants'
import EditMembers from "./EditMemberModal"
import repeatIcon from "../../images/icon_repeat.png"
import completeIcon from "../../images/icon_green_complete.png";
import reviewIcon from "../../images/icon_yellow_review.png";
import onholdIcon from "../../images/icon_grey_hold.png";

const priorityFlags = options.priorityFlags;

class SingleRowList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: '',
            members: '',
            comment: '',
            total_tasks: '',
            remaining_tasks: '',
            overdue: '',
            data: [],
            errors: '',
            flag: this.props.flag
        }
        this.popoverRef = React.createRef();
        this.deleteEditRow = this.deleteEditRow.bind(this)
        this.openEditRow = this.openEditRow.bind(this)
        this.deleteEditRow = this.deleteEditRow.bind(this)
        this.beforeDeleteTask = this.beforeDeleteTask.bind(this)
        this.toggleComplete = this.toggleComplete.bind(this)
    }

    componentDidMount() {
        $('[data-toggle="tooltip"]').tooltip()
    }

    deleteEditRow(e) {
        this.setState({
            [e]: 0,
        })
    }

    openEditRow(e) {
        this.setState({
            ['edit_' + e]: 1,
            ['options_' + e]: !this.state['options_' + e],
        })
    }

    beforeDeleteTask(e) {
        const props = this.props;
        this.setState({
            ['options_' + e]: !this.state['options_' + e],
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
        confirmAlert({
            title: 'Delete task',
            message: 'Are you sure want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        const task = {
                            projectTaskId: e,
                        }

                        deleteProjectTask(task).then(res => {
                            if (res.errorStatus) {
                                message.error(res.data);
                            } else {
                                message.success(res.data, 3);
                            }
                        })
                    },
                },
                {
                    label: 'No',
                    onClick: () => {
                    },
                },
            ],
        })
    }

    toggleComplete(status, task_id) {
        const props = this.props;
        const task = {
            "status": status,
            "task_id": task_id
        }
        completeUncompleteTask(task).then(res => {
            if (res.errorStatus) {
                message.error(res.data);
            } else {
                message.success(res.data, 3);
            }
        })
    }

    render() {
        const individual = this.props.data;
        return (
            <div key={individual.id}
                 className={"edit-task-row"}>
                {individual.is_task &&
                this.state['edit_' + individual.id] ? (
                    <EditorRow
                        saveCallback={(childData) => {
                            this.setState({['edit_' + childData]: false})
                        }}
                        taskData={individual}
                        deleteRow={this.deleteEditRow}
                    />
                ) : (
                    <div
                        className={'d-flex my-3 py-2 border-bottom single-data'}
                    >
                        <div className={'mr-4'}>
                            <div>
                                {individual.is_task ? (
                                    individual.status != 'completed' ? (
                                        <i className="far fa-circle fa-2x color-nobel cursor_pointer" onClick={() => {
                                            this.toggleComplete("completed", individual.id)
                                        }}></i>
                                    ) : (
                                        <img className={"cursor_pointer"} src={onHold} alt="Unassign" onClick={() => {
                                            if (individual.isAllowInComplete) {
                                                this.toggleComplete("uncompleted", individual.id)
                                            } else {
                                                message.error("Please change the project status to active to allow incompletion of task")
                                            }
                                        }}/>
                                    )
                                ) : (
                                    <img src={projectIcon} alt={'Subproject'}/>
                                )}
                            </div>
                        </div>
                        <div className={'w-100 cursor_drag'}>
                            <div className={'d-flex justify-content-between w-100 task-name'}>
                                {!individual.is_task ?
                                    <div className={"d-flex"}>
                                         <span>
                                             {individual.status == "completed" ?
                                                 <img src={completeIcon} alt={'completed'}
                                                      style={{height: 15, width: 15}} className={"mr-2"}/> : ''}
                                             {individual.status == "review" ?
                                                 <img src={reviewIcon} alt={'review'} style={{height: 15, width: 15}}
                                                      className={"mr-2"}/> : ''}
                                             {individual.status == "On_hold" ?
                                                 <img src={onholdIcon} alt={'hold'} style={{height: 15, width: 15}}
                                                      className={"mr-2"}/> : ''}
                                        </span>
                                        <span className={"cursor_pointer"} onClick={() => {
                                            {
                                                this.props.isSearch != undefined ? (parseInt(individual.parentId) != 0 ? this.props.updateSelection("project", individual.parentId) : this.props.updateSelection("inbox", 1)) : (!individual.is_task) ? this.props.updateSelection("project", individual.id) : false
                                            }
                                        }}>{individual.name}</span>
                                    </div>
                                    :
                                    <div>
                                        {individual.name}
                                    </div>}
                                {individual.is_task ? (
                                        <EditMembers data={individual} id={this.props.id}/>
                                    ) :
                                    ''}
                            </div>
                            <div className={'d-flex'}>
                                {individual.repeat != "Never" && individual.repeat != "" ? (
                                    <div className={'mr-2'}>
                                        <img src={repeatIcon} alt={'Repeat'} style={{height: 15, width: 15}}/>
                                    </div>
                                ) : (
                                    ''
                                )}
                                {individual.dueDate != '' ? (
                                    <div
                                        className={individual.is_overdue == '0' ? "mr-3 due-date" : "mr-3 overdue-date"}>
                                        {individual.dueDate}
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className={'mr-3'}>
                                    <Comment
                                        isTask={individual.is_task}
                                        ptId={individual.id}
                                        name={individual.name}
                                        projectname={(this.state.project != "" && this.state.project != undefined) ? this.state.project.name : ""}
                                    />
                                    <span className={'color-nobel ml-1'}>
                              {individual.comments}
                            </span>
                                </div>
                                <div className={'mr-3'}>
                                    <div className="d-inline-block ">
                                        <Attachments
                                            isTask={individual.is_task}
                                            ptId={individual.id}
                                            name={individual.name}
                                            projectname={this.state.project.name}
                                        />
                                        <span className={'color-nobel ml-1'}>{individual.attachments}</span>
                                    </div>
                                </div>
                                {this.state.flag ?
                                    <div className={'mr-3'}>
                                        <img src={priorityFlags[individual.priority.toString()].image} height='30'
                                             alt={'Flag'} data-toggle="tooltip"
                                             title={priorityFlags[individual.priority.toString()].label}/>
                                    </div>
                                    : ''
                                }

                                <div className={'mr-3 d-flex align-items-center'}>
                                    {individual.tags != ''
                                        ? individual.tags.map((tag, index) => (
                                            <div key={index} className={'individual-tag'}>
                                                {tag}
                                            </div>
                                        ))
                                        : ''}
                                </div>
                            </div>
                            {!this.state.flag || this.state.review && individual.parentId != 0 ?
                                <div style={{position: 'relative'}}>
                                     <span
                                         className="list-color-round mr-2"
                                         style={{backgroundColor: "#" + individual.parentProjectColor}}
                                     >
                                      &nbsp;
                                    </span>
                                    <span className={"ml-3"}>{individual.parentProjectName}</span>

                                </div>
                                : ''}
                        </div>
                        {individual.is_task && (individual.creator == individual.userId) ? (
                            <div className={'position-relative'}>
                                <Popover ref={this.popoverRef} content={(<div>
                                    {individual.completed == 0 ?
                                        <div className={'d-flex align-items-center cursor_pointer'}
                                             onClick={() => this.openEditRow(individual.id)}>
                                            <img src={editIcon} alt={'Edit'} className={'mr-2'}/>Edit
                                            task
                                        </div>
                                        : ""}

                                    <div
                                        className={'d-flex align-items-center cursor_pointer mt-2'}
                                        onClick={() => this.beforeDeleteTask(individual.id)}>
                                        <img src={deleteIcon} alt={'Delete'}
                                             className={'mr-2'}/>Delete task
                                    </div>
                                </div>)} trigger="click">
                                                            <span className={"cursor_pointer optionsDot"}>
                                                                <img src={dotImage} alt={"Options"}/>
                                                            </span>
                                </Popover>
                            </div>
                        ) : ""}
                        <div className={''}>{this.props.collapseIcon != undefined ? this.props.collapseIcon : ""}</div>
                    </div>
                )}
            </div>
        );
    }
}

export default SingleRowList
