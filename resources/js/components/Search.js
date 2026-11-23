import React, {Component} from 'react'
import SingleRowList from "./SingleRowList";
import projectIcon from "../../images/icon_project.png";
import ProjectContext from "./projectContext";
import FlagwiseList from "./FlagwiseList";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: '',
            projects: [],
            tasks: [],
            comments: [],
            tags: []
        }
    }

    componentDidMount() {
        this.setState({
            searchKey: this.props.searchKey
        })
        this.getData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.searchKey != this.state.searchKey || this.context.toUpdate) {
            this.setState({
                searchKey: this.props.searchKey
            })
            this.getData()
        }
    }

    getData() {
        if (this.props.searchKey != "") {
            fetch('/search-list', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({
                    "searchKey": this.props.searchKey
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        this.setState({
                            projects: result.projects,
                            tasks: result.tasks,
                            comments: result.comments,
                            tags: result.tags
                        })
                    },
                    error => {
                        this.setState({
                            errors: error,
                        })
                    },
                )
        } else {
            this.setState({
                projects: [],
                tasks: [],
                comments: [],
                tags: []
            })
        }
        if (this.context.toUpdate) {
            this.context.setUpdate(0);
        }
    }

    render() {
        const {projects} = this.state
        const {tasks} = this.state
        const {comments} = this.state
        const {tags} = this.state
        const total = projects.length + tasks.length + comments.length + tags.length;
        return (
            <div className={"container"}>
                <div className={"bg-white h-100 p-5"}>
                    <div className={'d-flex justify-content-between'}>
                        {this.props.searchKey != "" ?
                            <h2 className={"font-weight-bold text-left mb-4 color-navyblue"}>Search
                                for {this.props.searchKey}</h2> : ""}
                    </div>
                    {total > 0 ?
                        <div className={'mt-3'}>
                            {projects.length > 0 ?
                                (
                                    <h3>Projects</h3>
                                ) : ''}
                            {projects.length > 0 ? (
                                projects.map(individual => (
                                    <SingleRowList key={individual.id} data={individual} flag={false} review={false}
                                                   id={individual.id} updateSelection={this.props.updateSelection}/>
                                ))
                            ) : (
                                ''
                            )}
                            {tasks.length > 0 ?
                                (
                                    <h3>Tasks</h3>
                                ) : ''}
                            {tasks.length > 0 ? (
                                tasks.map(individual => (
                                    <SingleRowList isSearch={1} key={individual.id} data={individual} flag={false}
                                                   review={false}
                                                   id={individual.id} updateSelection={this.props.updateSelection}/>
                                ))
                            ) : (
                                ''
                            )}
                            {comments.length > 0 ?
                                (
                                    <h3>Comments</h3>
                                ) : ''}
                            {comments.length > 0 ? (
                                comments.map(individual => (
                                    <div key={individual.id} className={"my-3 py-2 border-bottom cursor_pointer"}
                                         onClick={() => {
                                             {
                                                 individual.type == "task" ? (individual.ptID == 0 ? this.props.updateSelection("inbox", 1) : this.props.updateSelection("project", individual.ptID)) : this.props.updateSelection("project", individual.ptID)
                                             }
                                         }}>
                                        <div className={"d-flex mb-2 task-name"}>
                                            {individual.type == "project" ?
                                                <div className="mr-3"><img src={projectIcon} alt={'project'}/></div>
                                                : ""
                                            }
                                            <div className={"task-name"}>{individual.ptName}</div>
                                        </div>
                                        <div className={"d-flex"}>
                                            <span className="mr-2">{individual.commentedBy}</span>
                                            <span
                                                className="color-nobel font-weight-light">{individual.commentedTime}</span>
                                        </div>
                                        <div className="color-navyblue">
                                            {individual.comment}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                ''
                            )}
                            {tags.length > 0 ?
                                (
                                    <h3>By Tags</h3>
                                ) : ''}
                            {tags.length > 0 ?
                                (
                                    tags.map(individual => (
                                        <SingleRowList isSearch={1} key={individual.id} data={individual} flag={false}
                                                       review={false}
                                                       id={individual.id} updateSelection={this.props.updateSelection}/>
                                    ))
                                ) : (
                                    ''
                                )}
                        </div> : <div className={'h-100 p-5'}>
                            <h2 className="text-center">No data found</h2>
                        </div>}
                </div>
            </div>
        )
    }
}
Search.contextType = ProjectContext
export default Search
