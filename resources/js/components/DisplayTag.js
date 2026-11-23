import React, {Component} from 'react'
import tagIcon from "../../images/icon_left_tag.png";
import memberIcon from "../../images/icon_add_assign.png"
import reminderIcon from "../../images/icon_function_reminder.png"
import attachmentIcon from "../../images/icon_function_attachment.png"
import commentIcon from "../../images/icon_function_comment.png"
import projectIcon from "../../images/icon_project.png"

class DisplayTag extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let icon = "";
        if (this.props.type == "tag")
            icon = tagIcon
        else if (this.props.type == "member")
            icon = memberIcon
        else if (this.props.type == "reminder")
            icon = reminderIcon
        else if (this.props.type == "attachment")
            icon = attachmentIcon
        else if (this.props.type == "comment")
            icon = commentIcon
        else if (this.props.type == "project")
            icon = projectIcon
        return (
            <li className="tag">
                <img src={icon} alt={"Indicator"} className={"mr-1 cursor_pointer"}
                     height="16"/>
                {this.props.data.link != undefined ? <span className="tag-title cursor_pointer" onClick={() => {
                        window.open(this.props.data.link, '_blank');
                    }}>{this.props.data.data}</span> :
                    <span className="tag-title">{this.props.data.data}</span>}

                <span className={"ml-1 cursor_pointer"} onClick={this.props.data.removeFunction}>
                        <i className="fas fa-times"></i>
                </span>
            </li>
        );
    }
}

export default DisplayTag
