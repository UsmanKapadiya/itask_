import React, {Component} from 'react'
import AssignedMembers from './AssignedMembersModal'
import Comment from './Comment'
import Attachments from './Attachments'
import {message, Popover, Breadcrumb, Modal, Radio, Button} from "antd";
import dotImage from "../../images/icon_left_more.png";
import 'react-confirm-alert/src/react-confirm-alert.css'
import SingleRowList from "./SingleRowList";
import {completeProject, reorderData} from "./FunctionCalls";
import repeatIcon from "../../images/icon_repeat.png";
import reviewIcon from "../../images/icon_yellow_review.png";
import onholdIcon from "../../images/icon_grey_hold.png";
import completeIcon from "../../images/icon_green_complete.png";
import * as options from './Constants'
import ProjectContext from "./projectContext";
import AddProjectModal from "./AddProjectModal";
import AddTaskModal from './AddTaskModal'
import Nestable from 'react-nestable';
import iconDropLeft from '../../images/icon_left_dropleft.png'
import iconDropDown from '../../images/icon_left_dropdown.png'

const statusList = options.statusValue;
let isAllow = false;

class ProjectdetailList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project: '',
            members: '',
            attachment: '',
            comment: '',
            total_tasks: '',
            remaining_tasks: '',
            overdue: '',
            data: [],
            completed: 0,
            errors: '',
            type: '',
            is_allow_completed: 0,
            completedProject: 0,
            reviewProject: 0,
            openSubProjectModal: 0,
            isReceivedData: 0,
            can_drag: 0,
            modalVisible: false,
            memberSelection: "none",
            reorderItems: "",
            draggedItem: ""
        }
        this.popoverRef = React.createRef()
        this.memberModal = React.createRef()
        this.toggleBox = this.toggleBox.bind(this)
        this.saveCallbackFunction = this.saveCallbackFunction.bind(this)
        this.completedTask = this.completedTask.bind(this)
        this.hidecompletedTask = this.hidecompletedTask.bind(this)
        this.completeProject = this.completeProject.bind(this)
        this.toggleCompletedProject = this.toggleCompletedProject.bind(this)
        this.toggleReviewProject = this.toggleReviewProject.bind(this)
        this.toggleSubProjectModal = this.toggleSubProjectModal.bind(this)
        this.reorderData = this.reorderData.bind(this)
    }

    componentDidMount() {
        this.fetchProjectData()
    }

    toggleBox(e) {
        this.setState({
            [e]: this.state[e] != undefined ? !this.state[e] : true,
        })
    }

    toggleCompletedProject() {
        this.setState(prevState => ({
            completedProject: prevState.completedProject ? 0 : 1
        }), function () {
            this.popoverRef.current.props.onPopupVisibleChange(false);
            this.fetchProjectData();
        })
    }

    toggleReviewProject() {
        this.setState(prevState => ({
            reviewProject: prevState.reviewProject ? 0 : 1
        }), function () {
            this.popoverRef.current.props.onPopupVisibleChange(false);
            this.fetchProjectData();
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.projectId != prevProps.projectId || this.context.toUpdate || this.context.showCompleted != "") {
            this.fetchProjectData()
        }
    }

    fetchProjectData() {
        this.setState({isReceivedData: 0})
        fetch('/project-detail-list', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            body: JSON.stringify({
                "projectId": this.props.projectId,
                "completed": (this.context.showCompleted != '' ? this.context.showCompleted : this.state.completed),
                "completedProject": this.state.completedProject,
                "reviewProject": this.state.reviewProject
            })
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result.error == null || result.error == undefined) {
                        this.setState({
                            data: result.data,
                            project: result.project,
                            members: result.members,
                            attachment: result.attachments,
                            comment: result.comments,
                            total_tasks: result.total_tasks,
                            remaining_tasks: result.remaining_tasks,
                            overdue: result.overdue,
                            type: result.type,
                            is_allow_completed: result.is_allow_completed,
                            errors: "",
                            breadcrumbs: result.breadcrumbs,
                            isReceivedData: 1,
                            openSubProjectModal: 0,
                            can_drag: result.can_drag
                        })
                        if (this.memberModal.current != null) {
                            this.memberModal.current.updateCount();
                        }
                    } else {
                        this.setState({
                            errors: result.error,
                        })
                    }
                },
                error => {
                    this.setState({
                        errors: error,
                    })
                },
            )
        if (this.context.toUpdate) {
            this.context.setUpdate(0);
        }
        if (this.context.showCompleted != "") {
            this.setState({completed: 1})
            this.context.updateCompletedState('')
        }
    }

    saveCallbackFunction(childData) {
        this.fetchProjectData()
    }

    toggleSubProjectModal(value) {
        this.setState({openSubProjectModal: value})
    }

    completedTask() {
        this.setState({
            completed: 1
        }, function () {
            this.fetchProjectData()
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }


    hidecompletedTask() {
        this.setState({
            completed: 0
        }, function () {
            this.fetchProjectData()
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    completeProject() {
        const props = this.props;
        this.popoverRef.current.props.onPopupVisibleChange(false);
        completeProject({project_id: this.state.project.id}).then(res => {
            if (res.errorStatus) {
                message.error(res.data);
            } else {
                message.success(res.data, 3);
            }
        })
    }

    reorderData() {
        let data = this.state.reorderItems;
        let project_id = this.state.draggedItem;
        let new_data = [];
        for (let d in data) {
            this.getRecursiveData(data[d], new_data, 0);
        }
        reorderData({
            project_id: project_id,
            base_parent_id: this.state.project.id,
            reorder_data: new_data,
            selected_value: this.state.memberSelection
        }).then(res => {
            if (res.errorStatus) {
                message.error(res.data);
            } else {
                message.success(res.data, 3);
            }
        })
    }

    getRecursiveData = (data, result, is_inner) => {
        let childs = []
        if (data.children.length > 0) {
            for (let i in data.children) {
                childs[i] = this.getRecursiveData(data.children[i], [], 1);
            }
        }
        if (!is_inner) {
            result.push({
                id: data.id,
                childs: childs
            })
            return result;
        } else {
            return {
                id: data.id,
                childs: childs
            }
        }
    }

    render() {
        const {data} = this.state
        const {errors} = this.state
        const {breadcrumbs} = this.state
        const searchString = this.context.isSearch
        return (
            <div className={'container' + (this.state.can_drag ? " can_drag" : "")}>
                {errors == '' ? (
                    <div className={'h-100 p-5'}>
                        {this.state.isReceivedData ?
                            <>
                                {searchString != "" ?
                                    <div className={"w-100 text-right mb-2"}><a className="back_to_search" href="#"
                                                                                onClick={() => {
                                                                                    this.props.updateSelection("search", "")
                                                                                }}>Back to search list</a></div> : ""}
                                <div>
                                    {this.state.openSubProjectModal ?
                                        <AddProjectModal parentId={this.state.project.id.toString()} isEdit={0}
                                                         closeSubprojectModal={() => {
                                                             this.toggleSubProjectModal(0)
                                                         }}
                                        /> : ""}
                                    <div className={'float-left'}>
                                        <div className={"d-flex"}>
                                        <span>
                                        {statusList[this.state.project.status].name == "Complete" ?
                                            <img src={completeIcon} alt={'complete'} style={{height: 15, width: 15}}
                                                 className={"mr-2"}/> : ''}
                                            {statusList[this.state.project.status].name == "Review" ?
                                                <img src={reviewIcon} alt={'review'} style={{height: 15, width: 15}}
                                                     className={"mr-2"}/> : ''}
                                            {statusList[this.state.project.status].name == "On-hold" ?
                                                <img src={onholdIcon} alt={'hold'} style={{height: 15, width: 15}}
                                                     className={"mr-2"}/> : ''}
                                        </span>
                                            <span><h2
                                                className={'project-title mb-1'}>{this.state.project.name}</h2></span>
                                            {this.state.project.repeat != "Never" && this.state.project.repeat != "" ? (
                                                <span className={"ml-3"}>
                                            <img src={repeatIcon} alt={'Repeat'} style={{height: 20, width: 20}}
                                                 className={"mt-1"}/>
                                        </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        {breadcrumbs.length > 0 ?
                                            <Breadcrumb separator=">">
                                                {
                                                    breadcrumbs.map(b => (
                                                        <Breadcrumb.Item key={b.id} onClick={() => {
                                                            this.props.updateSelection("project", b.id)
                                                        }}>{b.name}</Breadcrumb.Item>
                                                    ))
                                                }
                                                <Breadcrumb.Item
                                                    key={this.state.project.id}>{this.state.project.name}</Breadcrumb.Item>
                                            </Breadcrumb> : ""}
                                        <div className={'d-flex color-nobel project-info mt-2'}>
                                        <span className={'mr-2'}>
                                        {this.state.total_tasks} tasks,
                                        </span>
                                            <span className={'mr-2'}>
                                         {this.state.remaining_tasks} remaining,
                                        </span>
                                            <span className={'mr-2'}>{this.state.overdue} overdue</span>
                                        </div>
                                    </div>
                                    <div className={'float-right'}>
                                        <div className={'d-flex'}>
                                  <span className={'mr-4'}>
                                      <AssignedMembers isCreator={this.state.project.is_creator}
                                                       ptId={this.state.project.id}
                                                       projectname={this.state.project.name} ref={this.memberModal}
                                                       memberCount={this.state.members}/>
                                  </span>
                                            <span className={'mr-4'}>
                                    <Comment
                                        isTask={0}
                                        ptId={this.state.project.id}
                                        name=""
                                        projectname={this.state.project.name}
                                    />
                                    <span className={'color-nobel ml-1'}>{this.state.comment}</span>
                                  </span>
                                            <span className={'mr-4'}>
                                    <div className="d-inline-block ">
                                        <Attachments
                                            isTask='0'
                                            ptId={this.state.project.id}
                                            name={this.state.project.name}
                                            projectname=""
                                        />
                                        <span className={'color-nobel ml-1'}>{this.state.attachment}</span>
                                    </div>
                                  </span>

                                            <Popover ref={this.popoverRef} content={(<div>
                                                {!this.state.completed ?
                                                    <div className={'cursor_pointer mb-1'}
                                                         onClick={this.completedTask}>Show completed tasks</div> :
                                                    <div className={'cursor_pointer mb-1'}
                                                         onClick={this.hidecompletedTask}>Hide completed
                                                        tasks</div>}
                                                {this.state.project.is_creator ? <>
                                                    <div className={'cursor_pointer mb-1'} onClick={() => {
                                                        this.props.updateEditView(1, this.state.project.id);
                                                        this.popoverRef.current.props.onPopupVisibleChange(false);
                                                    }}>Edit project
                                                    </div>
                                                    <div className={'cursor_pointer mb-1'} onClick={() => {
                                                        this.props.deleteProjectTask(this.state.project.id, this.state.type, this.popoverRef)
                                                    }}>Delete project
                                                    </div>
                                                    {statusList[this.state.project.status].name != "Complete" && statusList[this.state.project.status].name != "Review" ?
                                                        <>
                                                            <div className={'cursor_pointer mb-1'}>
                                                                <AddTaskModal isHeader={0} popRef={this.popoverRef}/>
                                                            </div>
                                                            <div className={'cursor_pointer mb-1'} onClick={() => {
                                                                this.popoverRef.current.props.onPopupVisibleChange(false);
                                                                this.toggleSubProjectModal(1)
                                                            }}>Add sub-project
                                                            </div>
                                                        </> : ""}
                                                </> : ""}
                                                {this.state.is_allow_completed ?
                                                    <div className={'cursor_pointer mb-1'}
                                                         onClick={this.completeProject}>Mark
                                                        project as complete</div> : ""}
                                                {statusList[this.state.project.status].name != "Complete" && statusList[this.state.project.status].name != "Review" ?
                                                    (<div>
                                                        <div
                                                            className={'d-flex align-items-center cursor_pointer mb-1'}
                                                            onClick={this.toggleCompletedProject}>{this.state.completedProject ? "Hide" : "Show"} completed
                                                            projects
                                                        </div>
                                                        <div
                                                            className={'d-flex align-items-center cursor_pointer mb-1'}
                                                            onClick={this.toggleReviewProject}>{this.state.reviewProject ? "Hide" : "Show"} review
                                                            projects
                                                        </div>
                                                    </div>) : ""}
                                            </div>)} trigger="click" placement="bottomLeft">
                                                            <span className={"cursor_pointer"}>
                                                                <img src={dotImage} alt={"Options"}/>
                                                            </span>

                                            </Popover>
                                        </div>
                                    </div>
                                    <div className={'clearfix'}></div>
                                </div>
                                <div className={'mt-3'}>
                                    {data.length > 0 ? (
                                        <>
                                            <Modal
                                                visible={this.state.modalVisible}
                                                footer={[
                                                    <Button key="ok" onClick={() => {
                                                        this.setState({
                                                            modalVisible: false
                                                        }, function () {
                                                            this.reorderData();
                                                        });
                                                    }}>
                                                        OK
                                                    </Button>
                                                ]}
                                                onCancel={() => {
                                                    this.setState({
                                                        modalVisible: false
                                                    });
                                                }}
                                            >
                                                <p><strong>This task/project does not include all the members of the
                                                    dragged task/project</strong></p>
                                                <Radio.Group onChange={(e) => {
                                                    this.setState({
                                                        memberSelection: e.target.value
                                                    });
                                                }} value={this.state.memberSelection}>
                                                    <Radio value="parent_member">Add members</Radio>
                                                    <Radio value="none" defaultChecked={true}>Stop adding
                                                        members</Radio>
                                                    <Radio value="remove_member">Remove members</Radio>
                                                </Radio.Group>
                                            </Modal>
                                            <Nestable
                                                items={data}
                                                collapsed={true}
                                                renderItem={({item, collapseIcon}) => (
                                                    <>
                                                        <SingleRowList key={item.id} data={item} flag={true}
                                                                       review={false}
                                                                       id={item.id}
                                                                       updateSelection={this.props.updateSelection}
                                                                       collapseIcon={collapseIcon}
                                                        />
                                                    </>
                                                )}
                                                renderCollapseIcon={({isCollapsed}) =>
                                                    isCollapsed ? (
                                                        <img src={iconDropLeft} alt="Open" className="cursor_pointer"/>
                                                    ) : (
                                                        <img src={iconDropDown} alt="Close" className="cursor_pointer"/>
                                                    )
                                                }
                                                onChange={(items, item) => {
                                                    this.setState({
                                                        modalVisible: (isAllow ? false : true),
                                                        memberSelection: "none",
                                                        reorderItems: items,
                                                        draggedItem: item.id
                                                    }, function () {
                                                        if (isAllow) {
                                                            this.reorderData();
                                                        }
                                                    });
                                                }}
                                                confirmChange={(dragItem, destinationParent) => {
                                                    isAllow = true;
                                                    let is_allow = true;
                                                    if (!this.state.can_drag) {
                                                        is_allow = false;
                                                    } else if (!dragItem.is_task) {
                                                        if (destinationParent != null && destinationParent.is_task) {
                                                            is_allow = false;
                                                        }
                                                    } else {
                                                        let emails = dragItem.member_emails.split(",");
                                                        let destination_emails = (destinationParent != null ? destinationParent.member_emails : this.state.project.member_emails)
                                                        let count = 0;
                                                        if (emails.length > 0 && destination_emails != null) {
                                                            for (let e in emails) {
                                                                if (destination_emails.indexOf(emails[e]) == -1) {
                                                                    count++;
                                                                }
                                                            }
                                                            if (count > 0) {
                                                                isAllow = false;
                                                            }
                                                        }

                                                    }
                                                    return is_allow;
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <h3 className={'text-center'}>
                                            No sub-project(s)/task(s) found
                                        </h3>
                                    )}
                                </div>
                            </>
                            : ""
                        }
                    </div>
                ) : (
                    <div className={'h-100 p-5'}>
                        <h2 className="text-center">{errors}</h2>
                    </div>
                )}
            </div>
        )
    }
}

ProjectdetailList.contextType = ProjectContext
export default ProjectdetailList
