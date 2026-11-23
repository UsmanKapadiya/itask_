import React, {Component} from 'react'
import {Modal, ModalHeader, ModalBody, Alert} from 'reactstrap';
import {addComment} from './FunctionCalls';
import {saveComment} from './FunctionCalls';
import {deleteComment} from './FunctionCalls';
import commentIcon from "../../images/icon_function_comment.png"
import {message, Popconfirm} from "antd";
import deleteCommentImage from "../../images/icon_function_delete.png"
import editCommentImage from "../../images/icon_function_edit.png"
import NewComment from "./NewComment";
import Emoji from "./Emoji";
import ProjectContext from "./projectContext";
import ProjectdetailList from "./ProjectdetailList";

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            projectId: this.props.ptId,
            name: '',
            projectName: '',
            data: [],
            comment: '',
            files: [],
            isCreator: 0,
            isMember: 0
        }

        this.onClick = this.onClick.bind(this)
        this.Edit = this.Edit.bind(this)
        this.saveEdit = this.saveEdit.bind(this)
        this.cancelEdit = this.cancelEdit.bind(this)
        this.Delete = this.Delete.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.removeAll = this.removeAll.bind(this);
        this.toggle = this.toggle.bind(this)
        this.Add = this.Add.bind(this)
        this.commentData = this.commentData.bind(this)
        this.replyComment = this.replyComment.bind(this)
        this.setEmoji = this.setEmoji.bind(this)
    }

    componentDidMount() {
        if (this.props.modelOpen != undefined) {
            this.commentData();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.context.commentUpdatedID == this.state.projectId && this.state.modal) {
            this.commentData();
            this.context.setCommentProjectID(0)
        }

    }

    onClick(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));

    }

    commentData() {
        this.setState({projectName: this.props.projectname});
        this.setState({name: this.props.name});
        const projectId = this.state.projectId;
        fetch("/comment-detail-list/" + projectId)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.error != "") {
                        message.error(result.error)
                        if (this.props.modelOpen != undefined) {
                            this.props.setCommentData()
                        }
                    } else {
                        this.setState({
                            data: result.data,
                            isCreator: result.is_creator,
                            isMember: result.is_member
                        }, function () {
                            if (this.props.modelOpen != undefined) {
                                this.setState({
                                    modal: this.props.modelOpen
                                })
                            }
                        });
                    }
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    Edit(e) {
        this.setState({
            ['editComment_' + e]: true

        })
    }

    saveEdit(dataValue) {
        const individualComment = {
            commentId: dataValue,
            comment: this.state["edit_comment_text_" + dataValue] != undefined ? this.state["edit_comment_text_" + dataValue] : document.getElementsByName("edit_comment_text_" + dataValue)[0].getAttribute('value')
        }
        saveComment(individualComment).then(res => {
            if (res.errorStatus) {
                message.error(res.data)
            } else {
                this.setState({['editComment_' + dataValue]: false});
            }
        })
    }

    cancelEdit(e) {
        this.setState({
            ['editComment_' + e]: false

        })
    }

    Delete(dataValue) {
        const individualComment = {
            commentId: dataValue
        }
        deleteComment(individualComment).then(res => {
            if (res.errorStatus) {
                message.error(res.data)
            }
        })
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }


    onDrop(files, parentID) {
        this.setState({files: {...this.state.files, [parentID]: files}})
    };

    removeAll(commentId) {
        const files = this.state.files;
        delete files[commentId];
        this.setState({files: files})
    }

    replyComment(index, comment_id) {
        this.setState(prevState => ({
            ["reply_" + index + "_" + comment_id]: !prevState["reply_" + index + "_" + comment_id]
        }), function () {
            if (!this.state["reply_" + index + "_" + comment_id]) {
                this.setState({[comment_id != 0 ? "comment_reply_" + index + "_" + comment_id : "comment"]: ""});
            }
            this.removeAll(index + "_" + comment_id);
        });
    }

    Add(comment_state_name, replyIndex, parentId) {
        const comment = {
            projectId: this.state.projectId,
            comment: this.state[comment_state_name] != undefined ? this.state[comment_state_name] : "",
            file: this.state.files[replyIndex + "_" + parentId] == undefined ? [] : this.state.files[replyIndex + "_" + parentId],
            parentId: parentId
        }
        addComment(comment).then(res => {
            if (res.errorStatus) {
                message.error(res.data)
            } else {
                this.setState({
                    [comment_state_name]: '',
                    files: []
                });
                if (parseInt(parentId) != 0) {
                    this.setState({["reply_" + replyIndex + "_" + parentId]: false});
                }
            }
        })
    }


    toggle(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    resetStates = () => {
        const all_state = this.state;
        const not_to_delete = Array("data", "isCreator", "isMember", "modal", "name", "projectId", "projectName")
        for (let s in all_state) {
            if (not_to_delete.indexOf(s) == -1) {
                if (s == "comment") {
                    this.state[s] = "";
                } else if (s == "files") {
                    this.state[s] = [];
                } else {
                    delete this.state[s]
                }
            }
        }
    }

    setEmoji(input_name, e) {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)
        const input_value = document.getElementsByName(input_name)[0].getAttribute('value');
        this.setState({
            [input_name]: ((this.state[input_name] != undefined ? this.state[input_name] : (input_value != null ? input_value : "")) + emoji + " ")
        });
    }

    render() {
        const {data} = this.state;

        let isAllowAddEdit = 0;
        if (this.state.isCreator || this.state.isMember)
            isAllowAddEdit = 1;

        return (
            <div className="d-inline-block ">
                <a onClick={this.onClick} style={{cursor: "pointer"}}><img src={commentIcon} alt={"Comment"}/></a>
                <Modal isOpen={this.state.modal} className="CommentModal" onOpened={() => {
                    this.context.setCommentDialog(1)
                    this.commentData();
                }} onClosed={() => {
                    this.context.setCommentDialog(0)
                    if (this.props.modelOpen != undefined) {
                        this.props.setCommentData()
                    }
                    this.resetStates();
                    this.context.setUpdate(1)
                }}>
                    <ModalHeader toggle={this.toggle}>
                        {this.state.projectName == "" ?
                            <p>{this.state.name}</p> :
                            <div>
                                <h4>{this.state.projectName}</h4>
                                <p>{this.state.name}</p>
                            </div>
                        }
                    </ModalHeader>
                    <ModalBody>
                        {data.length > 0 ? <>
                            <h6 className={"color-navyblue font-weight-bold"}>Comments</h6>
                            <div className={"comment_container"}>
                                {data.map(individual => (
                                    <div key={individual.id}>
                                        <div className={"mb-2 hover-effect"}>
                                            <div className="my-0 mr-2 comment_avatar float-left"
                                                 style={{backgroundImage: "url(" + individual.commentedByAvtar + ")"}}>&nbsp;</div>
                                            <div className={"float-left w-85"}>
                                                <span
                                                    className="my-0 font-weight-bold mr-2">{individual.commentedBy}</span>
                                                <span
                                                    className="my-0 font-weight-light color-nobel comment_time">{individual.commentedTime}</span>
                                                {individual.canDelete ? (
                                                    <span
                                                        className={this.state['editComment_' + individual.id] ? "ml-3 cursor_pointer" : "ml-3 cursor_pointer btn-invisible"}>
                                                    <img src={editCommentImage} alt={"Edit"}
                                                         onClick={() => this.Edit(individual.id)}/>
                                            </span>) : ""}
                                                {(individual.canDelete || this.state.isCreator) ?
                                                    <button className="cursor_pointer delete-button btn-invisible">
                                                        <Popconfirm
                                                            icon={<i
                                                                className="far fa-question-circle position-absolute mt-1"
                                                                style={{color: 'red'}}></i>}
                                                            placement={"topLeft"}
                                                            title="Are you sure want to delete this comment?"
                                                            onConfirm={(e) => this.Delete(individual.id)}
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
                                                            <img src={deleteCommentImage} alt={"Delete"}/>
                                                        </Popconfirm>
                                                    </button> : ""}
                                                {this.state['editComment_' + individual.id] ?
                                                    (
                                                        <div className={"editor-container"}>
                                                            <input type={"text"}
                                                                   name={"edit_comment_text_" + individual.id}
                                                                   onChange={this.onChange}
                                                                   value={this.state["edit_comment_text_" + individual.id] != undefined ? this.state["edit_comment_text_" + individual.id] : (individual.comment != null ? individual.comment : '')}
                                                                   className="border-0 w-100 form-control"
                                                                   placeholder={"Write a comment"}
                                                                   autoComplete={"off"}
                                                            />
                                                            <div className={"mt-3 mb-2 px-2"}>
                                                                <div className={"edit_button_container"}>
                                                                    <div className={"float-left"}>
                                                                        <Emoji setEmoji={this.setEmoji}
                                                                               inputName={"edit_comment_text_" + individual.id}></Emoji>
                                                                    </div>
                                                                    <div className={"float-right"}>
                                                                        <input type={"button"}
                                                                               className={"btn bg-skyblue"}
                                                                               value={"Save"}
                                                                               onClick={() => this.saveEdit(individual.id)}/>
                                                                        <a className={"ml-2 mr-2"}
                                                                           onClick={() => this.cancelEdit(individual.id)}>Cancel</a>
                                                                    </div>
                                                                </div>
                                                                <div className={"clearfix"}></div>
                                                            </div>
                                                        </div>
                                                    )
                                                    :
                                                    (<>
                                                        <div>{individual.comment}</div>
                                                        {(individual.documentURL == null && individual.documentThumbUrl == null) ? "" :
                                                            <><a className={"d-inline-block"}
                                                                 href={individual.documentURL}
                                                                 target="_blank">
                                                                <img
                                                                    src={individual.documentThumbUrl != null ? individual.documentThumbUrl : individual.documentURL}
                                                                    alt={individual.documentName}
                                                                    className={"comment_document"}/>
                                                            </a><a className={"d-inline-block download"}
                                                                   href={individual.documentURL} download>&nbsp;</a></>}
                                                        <div className="color-nobel reply cursor_pointer"
                                                             onClick={() => this.replyComment((parseInt(individual.reply_comment.length) + 1), individual.id)}>Reply
                                                        </div>
                                                    </>)
                                                }
                                            </div>
                                            <div className={"clearfix"}></div>
                                        </div>
                                        {this.state['reply_' + (parseInt(individual.reply_comment.length) + 1) + '_' + individual.id] ?
                                            <NewComment replyIndex={parseInt(individual.reply_comment.length) + 1}
                                                        parentId={individual.id} isReply={1}
                                                        dropMethod={this.onDrop}
                                                        changeMethod={this.onChange}
                                                        addMethod={this.Add} {...this.state}
                                                        removeFile={this.removeAll}
                                                        replyComment={this.replyComment}
                                                        setEmoji={this.setEmoji}
                                            /> : ""}
                                        {individual.reply_comment.length > 0 && individual.reply_comment.map((reply, index) => (
                                            <div key={reply.id}>
                                                <div className={"mb-2 hover-effect reply_section"}>
                                                    <div className="my-0 mr-2 comment_avatar float-left"
                                                         style={{backgroundImage: "url(" + reply.commentedByAvtar + ")"}}>&nbsp;</div>
                                                    <div className={"float-left w-85"}>
                                                    <span
                                                        className="my-0 font-weight-bold mr-2">{reply.commentedBy}</span>
                                                        <span
                                                            className="my-0 font-weight-light color-nobel comment_time">{reply.commentedTime}</span>
                                                        {reply.canDelete ? (
                                                            <span
                                                                className={this.state['editComment_' + reply.id] ? "ml-3 cursor_pointer" : "ml-3 cursor_pointer btn-invisible"}>
                                                <img src={editCommentImage} alt={"Edit"}
                                                     onClick={() => this.Edit(reply.id)}/>
                                            </span>) : ""}
                                                        {(reply.canDelete || this.state.isCreator) ?
                                                            <button
                                                                className="cursor_pointer delete-button btn-invisible">
                                                                <Popconfirm
                                                                    icon={<i
                                                                        className="far fa-question-circle position-absolute mt-1"
                                                                        style={{color: 'red'}}></i>}
                                                                    placement={"topLeft"}
                                                                    title="Are you sure want to delete this comment?"
                                                                    onConfirm={(e) => this.Delete(reply.id)}
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
                                                                    <img src={deleteCommentImage} alt={"Delete"}/>
                                                                </Popconfirm>
                                                            </button>
                                                            : ""}
                                                        {this.state['editComment_' + reply.id] ?
                                                            (
                                                                <div className={"editor-container"}>
                                                                    <input type={"text"}
                                                                           name={"edit_comment_text_" + reply.id}
                                                                           onChange={this.onChange}
                                                                           value={this.state["edit_comment_text_" + reply.id] != undefined ? this.state["edit_comment_text_" + reply.id] : (reply.comment != null ? reply.comment : '')}
                                                                           className="border-0 w-100 form-control"
                                                                           placeholder={"Write a comment"}
                                                                           autoComplete={"off"}
                                                                    />
                                                                    <div className={"mt-3 mb-2 px-2"}>
                                                                        <div className={"edit_button_container"}>
                                                                            <div className={"float-left"}>
                                                                                <Emoji setEmoji={this.setEmoji}
                                                                                       inputName={"edit_comment_text_" + reply.id}></Emoji>
                                                                            </div>
                                                                            <div className={"float-right"}>
                                                                                <input type={"button"}
                                                                                       className={"btn bg-skyblue"}
                                                                                       value={"Save"}
                                                                                       onClick={() => this.saveEdit(reply.id)}/>
                                                                                <a className={"ml-2 mr-2"}
                                                                                   onClick={() => this.cancelEdit(reply.id)}>Cancel</a>
                                                                            </div>
                                                                        </div>
                                                                        <div className={"clearfix"}></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                            :
                                                            (<>
                                                                <div>{reply.comment}</div>
                                                                {(reply.documentURL == null && reply.documentThumbUrl == null) ? "" :
                                                                    <>
                                                                        <a className={"d-inline-block"}
                                                                           href={reply.documentURL}
                                                                           target="_blank">
                                                                            <img
                                                                                src={reply.documentThumbUrl != null ? reply.documentThumbUrl : reply.documentURL}
                                                                                alt={reply.documentName}
                                                                                className={"comment_document"}/>
                                                                        </a>
                                                                        <a className={"d-inline-block download"}
                                                                           href={reply.documentURL} download>&nbsp;</a>
                                                                    </>}
                                                                <div className="color-nobel reply cursor_pointer"
                                                                     onClick={() => this.replyComment(index, individual.id)}>Reply
                                                                </div>
                                                            </>)
                                                        }
                                                    </div>
                                                    <div className={"clearfix"}></div>
                                                </div>
                                                {this.state['reply_' + index + '_' + individual.id] ?
                                                    <NewComment replyIndex={index} parentId={individual.id} isReply={1}
                                                                dropMethod={this.onDrop}
                                                                changeMethod={this.onChange}
                                                                addMethod={this.Add} {...this.state}
                                                                removeFile={this.removeAll}
                                                                replyComment={this.replyComment}
                                                                setEmoji={this.setEmoji}
                                                    /> : ""}
                                            </div>
                                        ))}
                                    </div>
                                ))
                                }
                            </div>
                        </> : ""}
                        {isAllowAddEdit ?
                            <NewComment replyIndex={0} parentId={0} replyIndex={1} isReply={0} dropMethod={this.onDrop}
                                        changeMethod={this.onChange}
                                        addMethod={this.Add} {...this.state} removeFile={this.removeAll}
                                        setEmoji={this.setEmoji}/> : ""}
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

Comment.contextType = ProjectContext
export default Comment;
