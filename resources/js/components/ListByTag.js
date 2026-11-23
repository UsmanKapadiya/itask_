import React, {Component} from 'react'
import {message, Popover} from "antd";
import dotImage from "../../images/icon_left_more.png";
import SingleRowList from "./SingleRowList";
import ProjectContext from "./projectContext";

class ListByTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            completed: 0,
            completedProject: 0,
            reviewProject: 0,
            tagName: ''
        }
        this.popoverRef = React.createRef();
        this.toggleCompletedTask = this.toggleCompletedTask.bind(this)
        this.ListByTagId = this.ListByTagId.bind(this)
        this.toggleCompletedProject = this.toggleCompletedProject.bind(this)
        this.toggleReviewProject = this.toggleReviewProject.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.tagId != this.props.tagId || this.context.toUpdate) {
            this.ListByTagId()
        }
    }

    componentDidMount() {
        this.ListByTagId()
    }

    toggleCompletedProject() {
        this.setState(prevState => ({
            completedProject: prevState.completedProject ? 0 : 1
        }), function () {
            this.popoverRef.current.props.onPopupVisibleChange(false);
            this.ListByTagId();
        })
    }

    toggleReviewProject() {
        this.setState(prevState => ({
            reviewProject: prevState.reviewProject ? 0 : 1
        }), function () {
            this.popoverRef.current.props.onPopupVisibleChange(false);
            this.ListByTagId();
        })
    }

    ListByTagId() {
        fetch('/project-task-by-tag', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            body: JSON.stringify({
                "tag_id": this.props.tagId,
                "completed": this.state.completed,
                "completedProject": this.state.completedProject,
                "reviewProject": this.state.reviewProject
            })
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result.error == "") {
                        this.setState({
                            data: result.response,
                            tagName: result.name
                        })
                    } else {
                        message.error(result.error)
                    }
                },
                error => {
                    message.error(error)
                },
            )
        if (this.context.toUpdate) {
            this.context.setUpdate(0);
        }
    }

    toggleCompletedTask(is_completed) {
        this.setState({
            completed: is_completed
        }, function () {
            this.ListByTagId()
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    render() {
        const {data} = this.state;
        return (
            <div className={"container"}>
                <div className={"bg-white h-100 p-5"}>
                    <div className={'d-flex justify-content-between mb-5'}>
                        <h2 className={"font-weight-bold text-left mb-0 color-navyblue"}>By tag: {this.state.tagName}</h2>
                        <Popover ref={this.popoverRef} content={(<div>
                            {!this.state.completed ? <div className={'d-flex align-items-center cursor_pointer'}
                                                          onClick={() => {
                                                              this.toggleCompletedTask(1)
                                                          }}
                            >
                                Show completed tasks
                            </div> : <div className={'d-flex align-items-center cursor_pointer'}
                                          onClick={() => {
                                              this.toggleCompletedTask(0)
                                          }}
                            >
                                Hide completed tasks
                            </div>}
                            <div className={'d-flex align-items-center cursor_pointer'}
                                 onClick={this.toggleCompletedProject}>{this.state.completedProject ? "Hide" : "Show"} completed
                                projects
                            </div>
                            <div className={'d-flex align-items-center cursor_pointer'}
                                 onClick={this.toggleReviewProject}>{this.state.reviewProject ? "Hide" : "Show"} review
                                projects
                            </div>
                        </div>)} trigger="click" placement="topRight">
                                    <span className={"cursor_pointer"}>
                                        <img src={dotImage} alt={"Options"}/>
                                    </span>
                        </Popover>
                    </div>
                    <div className={'mt-3'}>
                        {data.length > 0 ? (
                            data.map(individual => (
                                <SingleRowList key={individual.id} data={individual} flag={true} review={false}
                                               id={individual.id}
                                               updateSelection={this.props.updateSelection}/>
                            ))
                        ) : (
                            <h3 className={'text-center'}>
                                No project(s)/task(s) found
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

ListByTag.contextType = ProjectContext
export default ListByTag


