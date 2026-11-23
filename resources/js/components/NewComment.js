import React, {Component} from "react";
import * as options from "./Constants";
import Dropzone from "react-dropzone";
import deleteIcon from "../../images/icon_function_delete.png";
import "emoji-mart/css/emoji-mart.css";
import Emoji from "./Emoji";

class NewComment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isReply = this.props.isReply;
        const parentCommentId = this.props.parentId;
        const replyIndex = this.props.replyIndex;
        const fileIndex = replyIndex + "_" + parentCommentId;
        let files = [];
        if (this.props.files[fileIndex] != undefined) {
            files = this.props.files[fileIndex].map(file => (
                <li key={file.name} className={"d-flex align-items-center"}>
                    <span>{file.name} - {file.size} bytes</span>
                    <img src={deleteIcon} alt={"Delete"} onClick={() => this.props.removeFile(fileIndex)}
                         className={"ml-2 cursor_pointer"}/>
                </li>
            ));
        }
        const input_name = isReply ? "comment_reply_" + replyIndex + "_" + parentCommentId : "comment";
        return (
            <div className={isReply ? "comments_textarea_holder reply_comment" : "comments_textarea_holder"}>
                <input type={"text"}
                       name={input_name}
                       onChange={this.props.changeMethod}
                       value={this.props[input_name] != undefined ? this.props[input_name] : ""}
                       className="border-0 newComment form-control"
                       placeholder={"Write a comment"}
                       autoComplete={"off"}
                />
                {files.length > 0 ? (<ul className={"mt-2 pl-0"}>{files}</ul>) : ""}
                <div className="comments_textarea_buttons textarea_buttons w-100">
                    {files.length == 0 ?
                        <a className={"cursor_pointer"}>
                            <img src={options.ATTACHMENT_IMAGE} alt={"Attachment"}/>
                        </a> : ""}
                    {isReply ? <a className={"cursor_pointer float-right ml-2 mt-1 mr-2"} onClick={() => {
                        this.props.replyComment(replyIndex, parentCommentId)
                    }}>Cancel</a> : ""}
                    <Emoji setEmoji={this.props.setEmoji} inputName={input_name}></Emoji>
                    <button className="float-right bg-skyblue color-white px-3 py-1"
                            onClick={() => {
                                this.props.addMethod(input_name, replyIndex, parentCommentId)
                            }}
                            style={{borderRadius: 10, border: 0}}>Add Comment
                    </button>
                    {files.length == 0 ?
                        <div className={"position-relative"}>
                            <Dropzone
                                onDrop={(files) => {
                                    this.props.dropMethod(files, fileIndex)
                                }}
                                maxFiles={1}
                                maxSize={31457280}
                                accept="image/*,video/*"
                            >
                                {({getRootProps, getInputProps}) => (
                                    <div>
                                        <div {...getRootProps({className: 'comment_attachment cursor_pointer'})}>
                                            <input {...getInputProps()} />
                                        </div>
                                    </div>
                                )}
                            </Dropzone>
                        </div> : ""}
                </div>
            </div>
        );
    }
}

export default NewComment

