import React from 'react';
import axios from 'axios';
import Section from './AccordionSection';


class ProjectAccordion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.getProject()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isUpdateProjects != this.props.isUpdateProjects && this.props.isUpdateProjects) {
            this.getProject()
        }
    }

    getProject = () => {
        axios.post('/projects',
            {
                is_completed: this.props.is_completed
            })
            .then(res => {
                const projects = res.data;

                this.setState({
                    projects,
                    loading: false,
                    error: null
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: true
                });
            });
        this.props.updateProject(0);
    }

    /*
    * Method to render the loading screen
    */
    renderLoading() {
        return (
            <div className="accordion-container">
                <h1 className="error">Loading...</h1>
            </div>
        );
    }

    /*
    * Method to render the Error Message
    */
    renderError() {
        return (
            <div>
                Something went wrong, Will be right back.
            </div>
        );
    }

    /*
    * Method to render the projects list
    */
    renderPosts() {
        const {projects, loading, error} = this.state;

        if (error) {
            return this.renderError();
        }

        if (!Array.isArray(projects) || projects.length === 0) {
            return '';
        }

        return (
            <div className={"border-top projects-container"}>
                <div className="accordion-container pl-4">
                    {
                        projects.map(project =>
                            <Section project={project} key={project.id}
                                     deleteProjectTask={this.props.deleteProjectTask}
                                     updateSelection={this.props.updateSelection}
                                     updateEditView={this.props.updateEditView}
                                     is_completed={this.props.is_completed}/>
                        )}
                </div>
            </div>
        );
    }

    render() {

        /*
        * Using destructuring to extract the 'error' from state.
        */

        const {loading} = this.state;
        return (
            <div className={"pt-1"}>
                {loading ? this.renderLoading() : this.renderPosts()}
            </div>

        );
    }

}

export default ProjectAccordion
