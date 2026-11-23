import React, {Component} from 'react'
import {message, Popover} from "antd";
import SingleRowList from "./SingleRowList";
import dotImage from "../../images/icon_left_more.png";
import ProjectContext from "./projectContext";
import UnassigntaskList from "./UnassigntaskList";

class FlagwiseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            completed: 0,
            completedProject: 0,
            reviewProject: 0
        }
        this.popoverRef = React.createRef();
        this.completedTask = this.completedTask.bind(this)
        this.hidecompletedTask = this.hidecompletedTask.bind(this)
        this.fetchPriorityData = this.fetchPriorityData.bind(this)
        this.toggleCompletedProject = this.toggleCompletedProject.bind(this)
        this.toggleReviewProject = this.toggleReviewProject.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.flag != this.props.flag || this.context.toUpdate) {
            this.fetchPriorityData()
        }
    }

    componentDidMount() {
        this.fetchPriorityData()
    }

    toggleCompletedProject() {
        this.setState(prevState => ({
            completedProject: prevState.completedProject ? 0 : 1
        }), function () {
            this.popoverRef.current.props.onPopupVisibleChange(false);
            this.fetchPriorityData();
        })
    }

    toggleReviewProject() {
        this.setState(prevState => ({
            reviewProject: prevState.reviewProject ? 0 : 1
        }), function () {
            this.popoverRef.current.props.onPopupVisibleChange(false);
            this.fetchPriorityData();
        })
    }

    fetchPriorityData() {
        fetch('/list-by-flag', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            body: JSON.stringify({
                "priority": this.props.flag,
                "completed": this.state.completed,
                "completedProject": this.state.completedProject,
                "reviewProject": this.state.reviewProject
            })
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result.error == null || result.error == undefined) {
                        this.setState({
                            data: result
                        })
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
    }

    completedTask() {
        this.setState({
            completed: 1
        }, function () {
            this.fetchPriorityData()
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }


    hidecompletedTask() {
        this.setState({
            completed: 0
        }, function () {
            this.fetchPriorityData()
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    render() {
        const {data} = this.state;
        return (
            <div className={"container"}>
                <div className={"bg-white h-100 p-5"}>
                    <div className={'float-left'}>
                        <h2 className={"font-weight-bold text-left mb-4 color-navyblue"}>Priority {this.props.flag}</h2>
                    </div>
                    <div className={'float-right'}>
                        <Popover ref={this.popoverRef} content={(<div>
                            {!this.state.completed ? <div className={'d-flex align-items-center cursor_pointer'}
                                                          onClick={this.completedTask}
                            >
                                Show completed tasks
                            </div> : <div className={'d-flex align-items-center cursor_pointer'}
                                          onClick={this.hidecompletedTask}
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
                        </div>)} trigger="click" placement="bottomLeft">
                                    <span className={"cursor_pointer"}>
                                        <img src={dotImage} alt={"Options"}/>
                                    </span>
                        </Popover>
                    </div>
                    <div className={"clearfix"}></div>
                    <div className={'mt-3'}>
                        {data.length > 0 ? (
                            data.map(individual => (
                                <SingleRowList key={individual.id} data={individual} flag={false} review={false}
                                               id={individual.id}
                                               updateSelection={this.props.updateSelection}/>
                            ))
                        ) : (
                            <h3 className={'text-center'}>
                                No sub-project(s)/task(s) found
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

FlagwiseList.contextType = ProjectContext
export default FlagwiseList
