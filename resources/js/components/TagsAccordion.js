import React from 'react';
import AddTagModal from "./AddTagModal";
import EditTagModal from "./EditTagModal";
import tagImage from "../../images/icon_left_tag.png";
import dotImage from '../../images/icon_left_more.png'
import deleteImage from '../../images/icon_function_delete.png'
import {message, Popover} from 'antd';
import {deleteTag} from './FunctionCalls';
import {confirmAlert} from "react-confirm-alert";


class TagsAccordion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            className: 'accordion-content accordion-close',
            headingClassName: 'accordion-heading',
            content: "../../images/icon_left_dropleft.png",
            tags: [],
            individualtag: ''
        };

        this.handleClick = this.handleClick.bind(this);
        this.tagsData = this.tagsData.bind(this);
        this.delete = this.delete.bind(this);
        this.popoverRef = React.createRef();
    }

    /*
    * Handling the click event
    */
    componentDidMount() {
        this.tagsData()
    }

    tagsData() {
        fetch("/member-tags")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        tags: result,
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    handleClick() {
        const {open} = this.state;
        if (open) {
            this.setState({
                open: false,
                className: "accordion-content accordion-close",
                headingClassName: "accordion-heading",
                content: "../../images/icon_left_dropleft.png"
            });
        } else {
            this.setState({
                open: true,
                className: "accordion-content accordion-open",
                headingClassName: "accordion-heading clicked",
                content: "../../images/icon_left_dropdown.png"
            });
        }
    }

    delete(e) {
        this.popoverRef.current.props.onPopupVisibleChange(false);
        this.setState({individualtag: e.target.getAttribute("datavalue")}, () => {
            const individualTag = {tag_id: this.state.individualtag}
            const obj = this;
            confirmAlert({
                title: 'Delete tag',
                message: 'Are you sure want to delete?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            deleteTag(individualTag).then(res => {
                                if (res.errorStatus) {
                                    message.error(res.data)
                                } else {
                                    message.success(res.data)
                                    obj.tagsData();
                                    this.props.updateSelection("inbox", 1)
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
        });
    }

    render() {

        const {tags} = this.state;
        const {content} = this.state;
        const {className} = this.state;
        return (
            <div className="parent-accordion">
                <div className={"cursor_pointer"} onClick={this.handleClick}>
                    <img src={tagImage} alt="Tags" className={"mr-2 ml-3"}/>
                    <span className="color-black font-weight-bold">Tags</span>
                    <span className="color-black mr-4 float-right d-inline" id="modal"><AddTagModal refreshData={this.tagsData}/></span>
                    <span className="mr-4 float-right">
                        <img src={content} alt="Tags"/>
                    </span>
                </div>
                <div className={className}>
                    <div className={"pl-4"}>
                        {tags.map(individual => (
                            <div key={individual.id} className="headingClassName pl-3">
                                <span className="project-name" title={individual.name} onClick={() => {
                                    this.props.updateSelection("list_by_tag", individual.id)
                                }}>{individual.name}</span>
                                <Popover content={
                                    <div><span className={"d-flex align-items-center mb-1"}>
                                        <EditTagModal popRef={this.popoverRef} refreshData={this.tagsData} name={individual.name} id={individual.id}/></span>
                                        <a className={"d-flex align-items-center mb-1"} datavalue={individual.id}
                                           onClick={this.delete}>
                                            <img src={deleteImage} className={"mr-2"}/>Delete tag</a>
                                    </div>} trigger="click" ref={this.popoverRef}>
                                <span className={"cursor_pointer optionsDot float-right d-inline mr-4"}>
                                    <img src={dotImage} alt={"Options"}/></span>
                                </Popover>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
        );
    }

}

export default TagsAccordion;
