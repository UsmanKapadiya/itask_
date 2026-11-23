import React from 'react';
import dotImage from '../../images/icon_left_more.png'
import editImage from '../../images/icon_function_edit.png'
import deleteImage from '../../images/icon_function_delete.png'
import {message, Popover} from 'antd';

class Section extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            className: 'accordion-content accordion-close',
            headingClassName: 'accordion-heading',
            content: "../../images/icon_left_dropleft.png",
        };
        this.popoverRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    /*
    * Handling the click event
    */
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

    render() {
        /*
        * Using destructuring to extract the 'error' from state.
        */
        const project = this.props.project;
        const {content} = this.state;
        const {className} = this.state;
        const options = (
            <div>
                <a className={"d-flex align-items-center mb-1"} onClick={() => {
                    this.props.updateEditView(1, project.id)
                    this.popoverRef.current.props.onPopupVisibleChange(false);
                }}><img src={editImage} className={"mr-2"}/>Edit project</a>
                <a className={"d-flex align-items-center mb-1"} onClick={() => {
                    this.props.deleteProjectTask(project.id, project.type, this.popoverRef)
                }}><img src={deleteImage} className={"mr-2"}/>Delete
                    project</a>
            </div>
        );
        return (
            <div>
                {
                    project.child_projects.length == 0 ?
                        <div className="headingClassName pl-3">
                            <span className={"mr-2"}><i className="fas fa-circle" style={{
                                "fontSize": "xx-small",
                                "color": "#" + project.color
                            }}></i></span>
                            <span className="project-name" title={project.name}
                                  onClick={() => {
                                      this.props.updateSelection("project", project.id)
                                  }}>{project.name}</span>
                            {this.props.is_completed ? "" :
                                <span className={"total-count"}>{project.no_of_tasks}</span>}
                            {project.is_creator_of_project ?
                                <Popover content={options} trigger="click" ref={this.popoverRef}>
                                 <span className={"cursor_pointer optionsDot float-right d-inline"}><img src={dotImage}
                                                                                                         alt={"Options"}/></span>
                                </Popover>
                                : ""}
                        </div> : <div className="arrow-parent-accordion parent-accordion">
                            <div className="headingClassName d-flex align-items-center pl-3">
                                <span className={"mr-2"}><i className="fas fa-circle" style={{
                                    "fontSize": "xx-small",
                                    "color": "#" + project.color
                                }}></i></span>
                                <span className="project-name" title={project.name}
                                      onClick={() => {
                                          this.props.updateSelection("project", project.id)
                                      }}>{project.name}</span>
                                {this.props.is_completed ? "" :
                                    <span className={"total-count"}>{project.no_of_tasks}</span>}
                                <span className={project.is_creator_of_project ? "ml-auto mr-4" : "ml-auto mr-5"}
                                      onClick={this.handleClick}>
                                    <img src={content} alt="Project" style={{"cursor": "pointer"}}/>
                                </span>
                                {project.is_creator_of_project ?
                                    <Popover content={options} trigger="click" ref={this.popoverRef}>
                                    <span className={"cursor_pointer optionsDot"}><img src={dotImage}
                                                                                       alt={"Options"}/></span>
                                    </Popover> : ""}
                            </div>
                            <div className={className}>
                                {project.child_projects.map(project =>
                                    <Section project={project} key={project.id} updateSelection={this.props.updateSelection}
                                             deleteProjectTask={this.props.deleteProjectTask}
                                             updateEditView={this.props.updateEditView}
                                             is_completed={this.props.is_completed}/>
                                )}
                            </div>
                        </div>
                }
            </div>
        );
    }

}

export default Section;
