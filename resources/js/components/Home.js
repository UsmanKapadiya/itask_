import React, {Component} from "react";
import HomeComponent from "./CommonFunctions";
import inboxImage from "../../images/icon_left_inbox.png";
import UnassigntaskList from "./UnassigntaskList";
import FlaggedAccordion from "./FlaggedAccordion";
import FlagwiseList from "./FlagwiseList";
import ReviewProjectList from "./ReviewProjectList";
import reviewImage from "../../images/icon_left_review.png"
import TagsAccordion from "./TagsAccordion";
import ProjectAccordion from "./ProjectAccordion";
import projectImage from "../../images/icon_left_projects.png"
import ProjectdetailList from "./ProjectdetailList";
import ProjectListAccordion from "./CompletedProjects";
import AddProjectModal from "./AddProjectModal";
import SearchIcon from "../../images/icon_nav_search.png";
import Search from "./Search";
import Header from "./Header";
import {message, notification} from "antd";
import {ContextProvider} from "./projectContext";
import Comment from "./Comment";
import {confirmAlert} from "react-confirm-alert";
import {deleteProjectTask} from "./FunctionCalls";
import ListByTag from "./ListByTag";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: '',
            sendKey: '',
            isUpdateProjects: 1,
            notificationCount: 0,
            commentData: {},
            isUpdateList: 0,
            isUpdateNotificationList: 0,
            showCompleted: '',
            projectOpen: false,
            isSearch: 0,
            commentProjectId: 0,
            documentProjectId: 0,
            isCommentDialogOpen: 0,
            isAttachmentDialogOpen: 0
        }
        this.onChange = this.onChange.bind(this)
        this.updateProject = this.updateProject.bind(this)
        this.updateList = this.updateList.bind(this)
        this.updateNotificationList = this.updateNotificationList.bind(this)
        this.setCommentData = this.setCommentData.bind(this)
        this.getNotificationCount = this.getNotificationCount.bind(this)
        this.notificationRedirection = this.notificationRedirection.bind(this)
        this.updateCompletedState = this.updateCompletedState.bind(this)
    }

    componentDidMount() {
        Pusher.logToConsole = false;
        Echo.channel('user' + user_key + "." + user_channel)
            .listen('ProjectEvent', (data) => {
                console.log("data :", data)
                if (data.text != "") {
                    notification.open({
                        key: data.type,
                        message: "iTask",
                        description: data.text,
                        duration: 3,
                        className: "cursor_pointer",
                        onClick: () => {
                            this.notificationRedirection(data)
                        },
                    });
                    if (data.type == "add_project" || data.type == "add_task" || data.type == "add_comment" || data.type == "member_removed_by" || data.type == "complete_project" || data.type == "complete_uncomplete") {
                        this.refreshListing(data.pt_id, data.type, data)
                    }
                    this.getNotificationCount();
                    this.updateNotificationList(1);
                } else {
                    if (data.type == "removed_task" || data.type == "refresh_list" || data.type == "updated_member" || data.type == "member_invited") {
                        this.refreshListing(data.pt_id, data.type, data)
                        if (data.type == "removed_task") {
                            this.getNotificationCount();
                            this.updateNotificationList(1);
                        }
                    }
                    if (data.type == "comment_list") {
                        if (this.state.isCommentDialogOpen) {
                            if (this.props.section == "project" && this.props.value == data.pt_id) {
                                this.setCommentProjectID(data.comment_pt_id)
                            } else if ((this.props.section == "project" && this.props.value == data.comment_pt_id) || this.props.section == "inbox") {
                                this.setCommentProjectID(data.comment_pt_id)
                            }
                        } else {
                            this.refreshListing(((this.props.section == "project" && data.pt_id == 0) ? data.comment_pt_id : data.pt_id), data.type, data)
                        }
                    }
                    if (data.type == "attachment_list") {
                        if (this.state.isAttachmentDialogOpen) {
                            if (this.props.section == "project" && this.props.value == data.pt_id) {
                                this.setDocumentProjectID(data.attachment_pt_id)
                            } else if ((this.props.section == "project" && this.props.value == data.attachment_pt_id) || this.props.section == "inbox") {
                                this.setDocumentProjectID(data.attachment_pt_id)
                            }
                        } else {
                            this.refreshListing(((this.props.section == "project" && data.pt_id == 0) ? data.attachment_pt_id : data.pt_id), data.type, data)
                        }
                    }
                    if (data.type == "member_removed") {
                        if (this.props.section == "project" && this.props.value == data.pt_id) {
                            this.props.updateSelection("inbox", "1")
                        }
                        this.updateProject(1)
                        message.error(data.slient_msg)
                        this.getNotificationCount();
                        this.updateNotificationList(1);
                    }
                    if (data.type == "delete_project_task") {
                        if ((data.pt_id == "" || data.pt_id != parseInt(this.props.value)) && this.props.section == "project") {
                            this.props.updateSelection("inbox", "1")
                            this.updateProject(1)
                        } else {
                            this.refreshListing(data.pt_id, data.type, data)
                        }
                        if (!data.is_same_user) {
                            message.error(data.slient_msg)
                        }
                    }
                }
            });
        this.getNotificationCount();
    }

    notificationRedirection(data) {
        if (data.type == "add_project" || data.type == "add_task" || data.type == "add_comment" || data.type == "member_removed_by" || data.type == "complete_project" || data.type == "complete_uncomplete" || data.type == "reminder") {
            if (data.type == "complete_uncomplete") {
                this.updateCompletedState(1)
            }
            if (parseInt(data.pt_id) != 0) {
                this.props.updateSelection("project", data.pt_id)
            } else {
                this.props.updateSelection("inbox", "1")
            }
            if (data.type == "add_comment") {
                this.setState({commentData: data.display_data})
            }
        }
        if (data.type == "member_removed") {
            message.error(data.slient_msg)
        }
    }

    getNotificationCount() {
        fetch('/notification-count')
            .then(res => res.json())
            .then(
                result => {
                    this.setState({notificationCount: result})
                },
                error => {
                },
            )
    }

    refreshListing = (pt_id, n_type, result) => {
        if (parseInt(pt_id) != 0) {
            if (this.props.section == "project" && this.props.value == pt_id) {
                this.updateList(1)
            } else if (this.props.section == "inbox" || this.props.section == "project") {
                if (result.all_ids != undefined) {
                    let child_ids = result.all_ids.split(",");
                    for (let c in child_ids) {
                        if (parseInt(child_ids[c]) == parseInt(this.props.value)) {
                            this.updateList(1)
                        } else if (parseInt(child_ids[c]) == 0) {
                            this.updateList(1)
                            this.props.updateInboxCount();
                        }
                    }
                }
            }
            if (this.props.section == "review" || this.props.section == "flag" || this.props.section == "search" || this.props.section == "list_by_tag") {
                this.updateList(1)
            }
        } else {
            if (this.props.section == "inbox") {
                this.updateList(1)
            } else {
                this.props.updateInboxCount();
            }
        }
        if (n_type == "add_project" || n_type == "add_task" || n_type == "complete_project" || n_type == "complete_uncomplete" || n_type == "removed_task" || n_type == "refresh_list" || n_type == "delete_project_task") {
            this.updateProject(1)
        }
    }

    deleteProjectTask = (id, type, popoverRef) => {
        popoverRef.current.props.onPopupVisibleChange(false);
        const obj = this;
        confirmAlert({
            title: 'Delete ' + type,
            message: 'Are you sure want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        const data = {
                            projectTaskId: id,
                        }
                        deleteProjectTask(data).then(res => {
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

    updateNotificationList(value) {
        this.setState({isUpdateNotificationList: value})
    }

    updateProject(value) {
        this.setState({isUpdateProjects: value})
    }

    updateList(value) {
        this.setState({isUpdateList: value})
    }

    setCommentData() {
        this.setState({commentData: {}});
    }

    updateCompletedState(value) {
        this.setState({showCompleted: value})
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    setCommentProjectID = (pt_id) => {
        this.setState({commentProjectId: pt_id})
    }

    setCommentDialog = (value) => {
        this.setState({isCommentDialogOpen: value})
    }

    setAttachmentDialog = (value) => {
        this.setState({isAttachmentDialogOpen: value})
    }

    setDocumentProjectID = (pt_id) => {
        this.setState({documentProjectId: pt_id})
    }

    render() {
        const {updateSelection} = this.props;
        const {section} = this.props;
        return (
            <React.Fragment>
                <ContextProvider value={{
                    toUpdate: this.state.isUpdateList,
                    setUpdate: this.updateList,
                    updateSidebarProject: this.updateProject,
                    isUpdateList: this.state.isUpdateNotificationList,
                    setUpdateList: this.updateNotificationList,
                    notificationCount: this.state.notificationCount,
                    notificationRedirection: this.notificationRedirection,
                    showCompleted: this.state.showCompleted,
                    updateCompletedState: this.updateCompletedState,
                    selectedValue: (section == "project" ? this.props.value : ""),
                    selectedSection: section,
                    updateSelection: updateSelection,
                    isSearch: this.state.isSearch,
                    updateNotificationCount: this.getNotificationCount,
                    commentUpdatedID: this.state.commentProjectId,
                    documentUpdatedID: this.state.documentProjectId,
                    setCommentProjectID: this.setCommentProjectID,
                    setDocumentProjectID: this.setDocumentProjectID,
                    setCommentDialog: this.setCommentDialog,
                    setAttachmentDialog: this.setAttachmentDialog
                }}>
                    <div id="header">
                        <Header/>
                    </div>
                    <div className={"row h-100"}>
                        <div className={"col-md-3 px-0"}>
                            <div className="sidebar h-100 py-4">
                                <ul className="nav-bar flex-column">
                                    <li className="nav-item border-bottom">
                                        <a className="d-flex align-items-center nav-link active" href="#"
                                           onClick={() => {
                                               updateSelection("inbox", "1")
                                           }}>
                                            <img src={inboxImage} alt="Inbox" className="mr-2"/>
                                            <div className={"pr-2"}>Inbox</div>
                                            <span className={"total-count"}>{this.props.inboxCount}</span>
                                        </a>
                                    </li>
                                    <li className="nav-item border-bottom py-2">
                                        <ProjectListAccordion isUpdateProjects={this.state.isUpdateProjects}
                                                              is_completed={0}
                                                              deleteProjectTask={this.deleteProjectTask}
                                                              updateSelection={updateSelection}
                                                              updateEditView={this.props.updateEditView}
                                                              updateProject={this.updateProject}/>
                                    </li>
                                    <li className="nav-item border-bottom py-2">
                                    <span className="color-black font-weight-bold">
                                        <FlaggedAccordion {...this.props}/>
                                    </span>
                                    </li>
                                    <li className="nav-item border-bottom">
                                        <a className="nav-link active" href="#" onClick={() => {
                                            updateSelection("review", "1")
                                        }}>
                                            <img src={reviewImage} alt="Review" className={"mr-2"}/>Review
                                        </a>
                                    </li>
                                    <li className="nav-item border-bottom py-2">
                                        <TagsAccordion updateSelection={updateSelection}/>
                                    </li>
                                    <li className="nav-item border-bottom py-2">
                                        <ProjectListAccordion isUpdateProjects={this.state.isUpdateProjects}
                                                              is_completed={1}
                                                              deleteProjectTask={this.deleteProjectTask}
                                                              updateSelection={updateSelection}
                                                              updateEditView={this.props.updateEditView}
                                                              updateProject={this.updateProject}/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={"col-md-9 px-0"}>
                            <div className="form-group has-search float-left mb-0 pl-4 d-flex"
                                 style={{position: "absolute", top: -49}}>
                                <input type="text"
                                       className="form-control"
                                       onChange={this.onChange}
                                       name="searchKey"/>
                                <a className={"ml-2"} onClick={() => {
                                    updateSelection("search", "")
                                    this.setState({sendKey: this.state.searchKey}, function () {
                                        this.setState({isSearch: (this.state.searchKey != "" ? 1 : 0)})
                                    })
                                }}><img src={SearchIcon}/></a>
                            </div>
                            {section == "inbox" ?
                                <UnassigntaskList
                                    updateInboxCount={this.props.updateInboxCount}/> : (section == "search" ?
                                    <Search
                                        updateSelection={updateSelection}
                                        searchKey={this.state.sendKey}/> : (section == "flag" ? <FlagwiseList
                                        updateSelection={updateSelection}
                                        flag={this.props.value}/> : (section == "project" ?
                                        <ProjectdetailList updateSelection={updateSelection}
                                                           updateEditView={this.props.updateEditView}
                                                           deleteProjectTask={this.deleteProjectTask}
                                                           updateProject={this.updateProject}
                                                           projectId={this.props.value}/> : (section == "review" ?
                                            <ReviewProjectList
                                                updateSelection={updateSelection}/> : (section == "list_by_tag" ?
                                                <ListByTag tagId={this.props.value}
                                                           updateSelection={updateSelection}/> :
                                                <UnassigntaskList
                                                    updateInboxCount={this.props.updateInboxCount}/>)))))}
                        </div>
                        {this.props.isEditView ?
                            <AddProjectModal isEdit={this.props.isEditView}
                                             projectId={this.props.editProjectId}
                                             updateEditView={() => {
                                                 this.props.updateEditView(0, '')
                                             }}/> : ""}
                        {this.state.commentData.project_id != undefined ?
                            <Comment modelOpen={true} ptId={this.state.commentData.project_id}
                                     name={this.state.commentData.project_name} projectname={""}
                                     setCommentData={this.setCommentData}/> : ""}
                    </div>
                </ContextProvider>
            </React.Fragment>
        );
    }
}

export default HomeComponent(Home)
