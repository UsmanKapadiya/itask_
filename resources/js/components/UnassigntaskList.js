import React, {Component} from 'react'
import {message, Popover} from "antd";
import dotImage from "../../images/icon_left_more.png";
import SingleRowList from "./SingleRowList";
import ProjectContext from "./projectContext";
import Nestable from "react-nestable";
import iconDropLeft from "../../images/icon_left_dropleft.png";
import iconDropDown from "../../images/icon_left_dropdown.png";
import {reorderData} from "./FunctionCalls";

class UnassigntaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            completed: 0,
        }
        this.popoverRef = React.createRef();
        this.getData = this.getData.bind(this);
        this.completedTask = this.completedTask.bind(this)
        this.hidecompletedTask = this.hidecompletedTask.bind(this)
        this.reorderData = this.reorderData.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.context.toUpdate || this.context.showCompleted != "")
            this.getData()
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        fetch("/unassign-task", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            body: JSON.stringify({
                "completed": (this.context.showCompleted != '' ? this.context.showCompleted : this.state.completed)
            })
        })

            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        data: result,
                    }, function () {
                        this.props.updateInboxCount()
                    });
                },
                (error) => {
                    this.setState({
                        error,
                    });
                }
            )
        if (this.context.toUpdate) {
            this.context.setUpdate(0);
        }
        if (this.context.showCompleted != "") {
            this.setState({completed: 1})
            this.context.updateCompletedState('')
        }
    }

    completedTask() {
        this.setState({
            completed: 1
        }, function () {
            this.getData();
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    hidecompletedTask() {
        this.setState({
            completed: 0
        }, function () {
            this.getData();
        })
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    reorderData(data, project_id) {
        let new_data = [];
        for (let d in data) {
            this.getRecursiveData(data[d], new_data, 0);
        }
        reorderData({project_id: project_id, base_parent_id: 0, reorder_data: new_data}).then(res => {
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
        const {data} = this.state;
        return (
            <div className={"container can_drag"}>
                <div className={"bg-white h-100 p-5"}>
                    <div className={'float-left'}>
                        <h2 className={"font-weight-bold text-left color-navyblue"}>Inbox</h2>
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
                        </div>)} trigger="click" placement="bottomLeft">
                                <span className={"cursor_pointer"}>
                                    <img src={dotImage} alt={"Options"}/>
                                </span>
                        </Popover>
                    </div>
                    <div className={"clearfix"}></div>
                    <div>
                        {
                            data.length > 0 ? (
                                <Nestable
                                    items={data}
                                    collapsed={true}
                                    renderItem={({item, collapseIcon}) => (
                                        <>
                                            <SingleRowList key={item.id} data={item} flag={true} review={false}
                                                           id={item.id}
                                                           collapseIcon={collapseIcon}
                                                           updateSelection={() => {
                                                           }}/>
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
                                        this.reorderData(items, item.id);
                                    }}
                                />
                            ) : <h3 className={"text-center"}>No task(s) found</h3>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

UnassigntaskList.contextType = ProjectContext
export default UnassigntaskList
