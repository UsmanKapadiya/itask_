import React, {Component} from 'react';
import {TreeSelect, Popover, Select} from 'antd';

class Projectlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen: false,
            projects: [],
            // parentproject: this.props.parentId.toString()
            parentproject: this.props.parentId.toString() == 0 ? '0' : this.props.parentId.toString()
        }
        this.toggle = this.toggle.bind(this);
        this.popoverRef = React.createRef();
    }

    componentDidMount() {
        fetch('/member-projects', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            body: JSON.stringify({
                "type": "project"
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    let all_projects = [];
                    this.setState({
                        projects: result.projects

                    }, function () {
                        all_projects = result.projects;
                        this.parentCheck(all_projects);
                        if (this.props.reminderCallback != undefined) {
                            this.props.reminderCallback(result.auto_reminder);
                        }
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    parentCheck = (all_projects) => {
        let isSet = 0;
        for (let p in all_projects) {
            if (parseInt(all_projects[p].value) == parseInt(this.props.parentId)) {
                this.setState({parentproject: (this.props.parentId).toString()}, function () {
                    this.props.parentCallback(this.state.parentproject, all_projects[p].title);
                });
                isSet = 1;
                break;
            } else {
                if (all_projects[p].children.length > 0) {
                    this.parentCheck(all_projects[p].children);
                }
            }
        }
        if (!isSet) {
            this.setState({parentproject: "0"}, function () {
                this.props.parentCallback(this.state.parentproject, "");
            });
        }
    }

    toggle(e) {
        this.setState(prevState => ({
            popoverOpen: !prevState.popoverOpen
        }));
    }

    render() {
        const {projects} = this.state;
        return (
            <div className={"d-inline mr-3 cursor_pointer"}>

                <Popover
                    ref={this.popoverRef}
                    content={(
                        <TreeSelect
                            style={{width: '400px'}}
                            value={this.state.parentproject}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="No parent"
                            allowClear
                            treeDefaultExpandAll
                            onChange={(value, label) => {
                                this.setState({"parentproject": value, "popoverOpen": false}, () => {
                                    this.props.parentCallback(this.state.parentproject, label);
                                })
                            }}
                            treeData={projects.length > 0 ? projects : []}>
                        </TreeSelect>
                    )}
                    trigger="click"
                    visible={this.state.popoverOpen}
                    getPopupContainer={() => document.getElementsByClassName('modal')[0] != undefined ? document.getElementsByClassName('modal')[0] : document.getElementById('mainapp')}
                    onVisibleChange={(visible) => {
                        if (!visible) {
                            this.setState({"popoverOpen": false})
                        }
                    }}
                >
                    <a onClick={this.toggle}>
                        <i className="fas fa-list" data-toggle="tooltip" title="Select parent"></i>
                    </a>
                </Popover>
            </div>
        );
    }
}

export default Projectlist;



