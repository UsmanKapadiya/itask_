import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import attachmentIcon from '../../images/icon_function_attachment.png'
import {deleteAttachment, deleteMultipleAttachment} from './FunctionCalls'
import Dropzone from 'react-dropzone';
import {updateAttachment} from './FunctionCalls'
import {message, Popconfirm} from "antd";
import * as options from "./Constants"
import ProjectContext from "./projectContext";
import deleteImage from "../../images/icon_function_delete.png";
import deleteAllImage from "../../images/icon_add_delete.png"
import downloadImage from "../../images/icon_project_download.png"
import Comment from "./Comment";
import {countBy} from 'lodash';


class Attachments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            projectId: this.props.ptId,
            name: '',
            projectName: '',
            data: [],
            files: [],
            isCreator: 0,
            isMember: 0,
            isSelectAll: 0,
            selectedIds: [],
            storedfiles: 0,
            storedsize: 0
        }
        this.onClick = this.onClick.bind(this)
        this.toggle = this.toggle.bind(this)
        this.Delete = this.Delete.bind(this)
        this.DeleteAll = this.DeleteAll.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.removeAll = this.removeAll.bind(this)
        this.Update = this.Update.bind(this)
        this.getData = this.getData.bind(this)
        this.downloadDocument = this.downloadDocument.bind(this)
        this.chkBoxChange = this.chkBoxChange.bind(this)
        this.selectAll = this.selectAll.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.context.documentUpdatedID == this.state.projectId && this.state.modal) {
            this.getData();
            this.context.setDocumentProjectID(0)
        }

    }

    onClick(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        this.setState({projectName: this.props.projectname});
        this.setState({name: this.props.name});
        this.getData();
    }

    toggle(e) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    Delete(e) {
        const individualAttachment = {
            attachmentId: e,
        }
        deleteAttachment(individualAttachment).then(res => {
            if (res.errorStatus) {
                message.error(res.data)
            } else {
                message.success(res.data)
            }
        })
    }

    DeleteAll() {
        let selectedDoc = this.state.selectedIds;
        if (selectedDoc.length == 0) {
            message.error("Please select attachment(s)")
        } else {
            const individualAttachment = {
                attachmentIds: selectedDoc.join(","),
                projectId: this.state.projectId
            }
            deleteMultipleAttachment(individualAttachment).then(res => {
                if (res.errorStatus) {
                    message.error(res.data)
                } else {
                    message.success(res.data)
                }
            })
        }
    }

    chkBoxChange(e) {
        let selectedDoc = this.state.selectedIds;
        let target = e.target;
        let target_value = parseInt(target.value)
        if (target.checked) {
            if (selectedDoc.indexOf(target_value) == -1)
                selectedDoc.push(target_value)
        } else {
            selectedDoc.splice(selectedDoc.indexOf(target_value), 1);
        }
        if (selectedDoc.length == 0 && this.state.isSelectAll) {
            this.setState({isSelectAll: 0})
        }
        this.setState({selectedIds: selectedDoc})
    }

    downloadDocument() {
        let selectedDoc = this.state.selectedIds;
        if (selectedDoc.length == 0) {
            message.error("Please select attachment(s)")
        } else {
            const data = this.state.data;
            for (let s in selectedDoc) {
                for (let d in data) {
                    if (data[d].id == selectedDoc[s]) {
                        let link = document.createElement('a');
                        link.href = data[d].url;
                        link.download = data[d].url;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            }
        }
    }

    selectAll() {
        this.setState(prevState => ({
            isSelectAll: prevState.isSelectAll ? 0 : 1
        }), function () {
            let selectedDoc = [];
            if (this.state.isSelectAll) {
                const data = this.state.data;
                for (let d in data) {
                    selectedDoc.push(data[d].id)
                }
            }
            this.setState({selectedIds: selectedDoc})
        })
    }

    onDrop(files) {
        let addedfile = this.state.files;
        let newfiles = this.state.files.length;
        let newsize = 0;
        for (let d in addedfile) {
            newsize = newsize + addedfile[d].size;
        }
        let totalfiles = this.state.storedfiles + newfiles;
        let totalsize = this.state.storedsize + newsize;
        if (totalfiles < 7 && totalsize <= 30000) {
            if (totalfiles + files.length <= 7 && totalsize <= 30000) {
                this.setState({files: [...this.state.files, ...files]})
            } else {
                message.error("Maximum 7 attachments can be added and size must be less than 30MB");
            }
        } else {
            message.error("Maximum 7 attachments can be added and size must be less than 30MB");
        }

    };

    removeAll(data) {
        const files = this.state.files;
        files.splice(data, 1)
        this.setState({files: files})
    }

    Update() {
        const Attachments = {
            projectId: this.state.projectId,
            files: this.state.files,
        }
        updateAttachment(Attachments).then(res => {
            if (res.errorStatus) {
                message.error(res.data)
            } else {
                message.success(res.data)
                this.setState({
                    files: []
                });
            }
        })
    }

    getData() {
        const projectId = this.state.projectId;
        fetch("/attachment-detail-list/" + projectId)

            .then(res => res.json())
            .then(
                (result) => {
                    if (result.error_msg != "") {
                        message.error(result.error_msg);
                    } else {
                        let storedsize = 0;
                        for (let d in result.data) {
                            storedsize = storedsize + result.data[d].size;
                        }
                        this.setState({
                            data: result.data,
                            isCreator: result.is_creator,
                            isMember: result.is_member,
                            storedfiles: result.data.length,
                            storedsize: storedsize

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

    resetStates = () => {
        this.setState({
            files: [],
            isSelectAll: 0,
            selectedIds: []
        })
    }

    render() {
        const {data} = this.state;
        const files = this.state.files.map((file, index) => (
            <li className="tag" key={index}>
                <span className="tag-title">{file.name}</span>
                <span className="ml-1 cursor_pointer" onClick={() => {
                    this.removeAll(index)
                }}><i className="fas fa-times"></i></span>
            </li>
        ));
        let isAllowAddEdit = 0;
        if (this.props.isTask) {
            if (this.state.isCreator || this.state.isMember)
                isAllowAddEdit = 1;
        } else {
            isAllowAddEdit = 1;
        }
        return (
            <>
                <a onClick={this.onClick} style={{cursor: "pointer"}}><img src={options.ATTACHMENT_IMAGE}
                                                                           alt={"Attachments"}/></a>
                <Modal isOpen={this.state.modal} className="CommentModal" size={"lg"} onOpened={() => {
                    this.context.setAttachmentDialog(1)
                }} onClosed={() => {
                    this.context.setAttachmentDialog(0)
                    this.resetStates()
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
                            <h6 className={"color-navyblue font-weight-bold"}>Attachments</h6>
                            <div className={"attachment_container"}>
                                {data.map(individual => (
                                    <div key={individual.id}
                                         className={"d-flex justify-content-between align-items-center py-2 single_document hover-effect"}>
                                        <div className={"d-flex justify-content-start align-items-center"}>
                                            <div className={"ml-2 mr-3"}>
                                                <input type="checkbox" value={individual.id}
                                                       onChange={this.chkBoxChange}
                                                       checked={this.state.selectedIds.indexOf(parseInt(individual.id)) != -1 ? 1 : 0}/>
                                            </div>
                                            <div
                                                className={"document_preview"}
                                                style={{backgroundImage: "url(" + individual.icon + ")"}}></div>
                                        </div>
                                        <div className={"text-left w-50"}><a href={individual.url}
                                                                             target="_blank">{individual.name}</a></div>
                                        <div className={"d-flex justify-content-end align-items-center"}>
                                            <div className={"mr-3"}>{individual.uploaded_by}</div>
                                            <div className={"color-nobel mr-2"}>{individual.uploaded_time}</div>
                                            <div>
                                                {isAllowAddEdit ?
                                                    <button className="cursor_pointer delete-button btn-invisible">
                                                        <Popconfirm
                                                            icon={<i
                                                                className="far fa-question-circle position-absolute mt-1"
                                                                style={{color: 'red'}}></i>}
                                                            placement={"topLeft"}
                                                            title="Are you sure want to delete this attachment?"
                                                            onConfirm={(e) => {
                                                                this.Delete(individual.id)
                                                            }}
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
                                                            <img src={deleteImage} alt={"Delete"}/>
                                                        </Popconfirm>
                                                    </button> : ""}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                                <div className={"d-flex justify-content-between align-items-center py-2"}>
                                    <div className={"d-flex justify-content-start align-items-center"}>
                                        <div className={"color-nobel cursor_pointer"}
                                             onClick={this.selectAll}>{this.state.isSelectAll ? "Deselect " : "Select "}All
                                        </div>
                                    </div>
                                    <div className={"d-flex justify-content-end align-items-center"}>
                                        {this.state.isCreator ?
                                            <button className="cursor_pointer delete-multiple-button">
                                                <Popconfirm
                                                    icon={<i
                                                        className="far fa-question-circle position-absolute mt-1"
                                                        style={{color: 'red'}}></i>}
                                                    placement={"topLeft"}
                                                    title="Are you sure want to delete selected attachment(s)?"
                                                    onConfirm={(e) => {
                                                        this.DeleteAll()
                                                    }}
                                                    okText="Yes"
                                                    cancelText="No"
                                                    getPopupContainer={() => document.getElementsByClassName('modal')[0]}
                                                >
                                                    <img src={deleteAllImage} alt={"Delete"}/>
                                                </Popconfirm>
                                            </button> : ""}
                                        <div className={"cursor_pointer ml-2"}>
                                            <img alt={"Download"} src={downloadImage}
                                                 onClick={this.downloadDocument}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> : ""}
                    </ModalBody>
                    <ModalFooter>

                        {isAllowAddEdit ? <>
                            <Dropzone
                                onDrop={this.onDrop}
                                // maxFiles={1}
                                maxSize={31457000}
                                accept="image/*,video/*,audio/*,.rtf,.csv.json,.html,.htm,.zip,.pdf,.xml,.txt,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,text/plain,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                id="file"
                            >
                                {({getRootProps, getInputProps}) => (
                                    <div className="w-100 p-relative">
                                        <div {...getRootProps({className: 'attachmentmodal_attachment cursor_pointer'})}>
                                            <input {...getInputProps()} />
                                        </div>
                                    </div>
                                )}
                            </Dropzone>
                            <div className="border-0 comments_textarea_buttons textarea_buttons w-100">
                                <div className={"d-flex align-items-start"}>
                                    <a className={"cursor_pointer mr-3"}>
                                        <img src={options.ATTACHMENT_IMAGE} alt={"Attachments"}/>
                                    </a>
                                    {files.length > 0 ? <>
                                        <div className={"position-relative w-75 mr-2"}>
                                            <ul id="tags" className={"position-absolute ml-2"}>
                                                {files}
                                            </ul>
                                            <textarea className={"form-control"}/>
                                        </div>
                                        <button className="btn btn-primary modal-btn ml-2"
                                                onClick={this.Update}>Upload
                                        </button>
                                    </> : ""}
                                </div>
                            </div>
                        </> : ""}
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

Attachments.contextType = ProjectContext
export default Attachments;
