import React, {Component} from 'react';
import {Select} from 'antd';
import * as options from './Constants'

const {Option} = Select;
const priorityFlags = options.priorityFlags;

class Flaglist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen: false,
            flag: (this.props.priority != undefined ? this.props.priority.toString() : "4")
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle(e) {
        this.setState(prevState => ({
            popoverOpen: !prevState.popoverOpen
        }));
    }

    render() {
        return (
            <div className={"mr-3 position-relative cursor_pointer"}>
                <a onClick={this.toggle}>
                    <img src={priorityFlags[this.state.flag].image} alt={"Add priority"} height="30" data-toggle="tooltip" title="Add priority"/>
                </a>
                {this.state.popoverOpen ? (
                    <div className={"flag-selection-outer"}>
                        <Select
                            style={{width: '100%'}}
                            placeholder="Select priority"
                            defaultValue={this.state.flag}
                            onChange={(e) => {
                                this.props.flagCallback(e);
                                this.setState({flag: e});
                            }}
                            optionLabelProp="label"
                            showSearch={false}
                            defaultOpen={true}
                            open={true}
                            menuItemSelectedIcon={<i className="fas fa-check"></i>}
                            autoFocus={true}
                            onBlur={() => {
                                this.setState({
                                    'popoverOpen': false
                                })
                            }}

                        >
                            {Object.keys(priorityFlags).map((f) => (
                                <Option value={priorityFlags[f].value} label={priorityFlags[f].label} key={f}>
                                    <div className="demo-option-label-item">
                                        <img src={priorityFlags[f].image} alt={priorityFlags[f].label}
                                             className={"mr-2"} height="30"/>
                                        {priorityFlags[f].label}
                                    </div>
                                </Option>
                            ))}
                        </Select></div>) : ""}
            </div>
        );
    }
}

export default Flaglist;


