import React from "react";

const HomeComponent = (OriginalComponent) => {
    class homeComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                section: localStorage.getItem("section") != null ? atob(localStorage.getItem("section")) : '',
                value: localStorage.getItem("value") != null ? atob(localStorage.getItem("value")) : '',
                isEditView: 0,
                editProjectId: '',
                inboxCount: 0
            }
        }

        componentDidMount() {
            this.updateInboxCount();
        }

        updateSelectedSection = (property, value) => {
            this.setState({section: property, value: value}, function () {
                if (property != "search") {
                    localStorage.setItem("section", btoa(property))
                    localStorage.setItem("value", btoa(value))
                }
            })
        }

        updateInboxCount = () => {
            fetch("/inbox-task-count")
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            inboxCount: result.count,
                        });
                    },
                    (error) => {
                    }
                )
        }

        updateEditView = (isEdit, projectId) => {
            this.setState({isEditView: isEdit, editProjectId: projectId})
        }

        render() {
            return <OriginalComponent updateSelection={this.updateSelectedSection} updateEditView={this.updateEditView}
                                      updateInboxCount={this.updateInboxCount} {...this.state}/>
        }
    }

    return homeComponent
}

export default HomeComponent
