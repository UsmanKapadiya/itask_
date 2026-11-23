import React from 'react';
import completeImage from "../../images/icon_left_completed.png"
import ProjectAccordion from "./ProjectAccordion";
import projectImage from "../../images/icon_left_projects.png";
import AddProjectModal from "./AddProjectModal";

class ProjectListAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            className: 'accordion-content accordion-close',
            headingClassName: 'accordion-heading',
            content: "../../images/icon_left_dropleft.png"
        };
        this.handleClick = this.handleClick.bind(this)
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
        const {content} = this.state;
        const {className} = this.state;
        const {updateSelection} = this.props;
        const {is_completed} = this.props;
        return (
            <div className="parent-accordion">
                <div className={"cursor_pointer"} onClick={this.handleClick}>
                    {is_completed ? <>
                        <img src={completeImage} alt="completed" className={"mr-2 ml-3"}/>
                        <span className="color-black font-weight-bold">Completed Projects</span>
                        <span className="mr-6 float-right"><img src={content} alt="Flag"/></span>
                    </> : <>
                        <img alt="Projects" src={projectImage} className={"mr-2 ml-3"}/>
                        <span className="color-black font-weight-bold">Projects</span>
                        <span className="color-black mr-4 float-right d-inline" id="modal">
                            <AddProjectModal isEdit={0} />
                        </span>
                        <span className="mr-4 float-right"><img src={content} alt="Flag"/></span>
                    </>}
                </div>
                <div className={className}>
                    <div className={"mt-2"}>
                        <ProjectAccordion isUpdateProjects={this.props.isUpdateProjects} is_completed={is_completed}
                                          updateSelection={updateSelection}
                                          deleteProjectTask={this.props.deleteProjectTask}
                                          updateEditView={this.props.updateEditView}
                                          updateProject={this.props.updateProject}/>
                    </div>
                </div>
            </div>
        )
    }

}

export default ProjectListAccordion
