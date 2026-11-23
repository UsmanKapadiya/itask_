import React, {Component} from 'react';
import {Select} from 'antd';
import DisplayTag from "./DisplayTag";

const {Option} = Select;

class Taglist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen: false,
            tags: [],
            selectedtags: (this.props.selectedTags != undefined ? this.props.selectedTags : [])
        }
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedTags != undefined && prevProps.selectedTags != this.state.selectedtags) {
            this.setState({selectedtags: prevProps.selectedTags})
        }
    }

    toggle(e) {
        this.setState(prevState => ({
            popoverOpen: !prevState.popoverOpen
        }));
    }

    onChange(e) {
        this.props.tagsCallback(e);
        this.setState({selectedtags: e});
    }

    render() {
        const {tags} = this.state;
        return (
            <div className={"mr-3 position-relative cursor_pointer"} id={"tags_container"}>
                <a onClick={this.toggle}>
                    <i className="fas fa-tag" data-toggle="tooltip" title="Add label(s)"></i>
                </a>
                {this.state.popoverOpen ? (
                    <div className={"flag-selection-outer"}>
                        <Select
                            style={{width: '100%'}}
                            mode="tags"
                            placeholder="Select tag"
                            value={this.state.selectedtags.length == 0 ? [] : this.state.selectedtags}
                            onChange={this.onChange}
                            optionLabelProp="label"
                            defaultOpen={true}
                            menuItemSelectedIcon={<i className="fas fa-check"></i>}
                            getPopupContainer={() => document.getElementsByClassName('modal')[0] != undefined ? document.getElementsByClassName('modal')[0] : document.getElementById('mainapp')}
                            removeIcon={<i className="fas fa-times remove-member"></i>}
                            autoFocus={true}
                            onBlur={() => {
                                this.setState({
                                    'popoverOpen': false
                                })
                                this.props.tagCreation('tag');
                            }}
                        >
                            {tags.map(individual => (
                                <Option key={individual.id} value={individual.name} label={individual.name}>
                                    <div className="demo-option-label-item">
                                        {individual.name}
                                    </div>
                                </Option>
                            ))
                            }
                        </Select></div>) : ""}
            </div>
        );
    }
}

export default Taglist;


