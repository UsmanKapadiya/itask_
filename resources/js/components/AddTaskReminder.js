import React, {Component} from 'react';
import {message, Select} from 'antd';
import reminderIcon from '../../images/icon_function_reminder.png'
import * as options from './Constants'

const {Option} = Select;
const reminderOptions = options.reminderOptions;

class Reminder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen: false,
            reminder: (this.props.reminder != undefined ? this.props.reminder.toString() : "None")
        }
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.reminder != this.state.reminder) {
            this.setState({reminder: prevProps.reminder})
        }
    }

    toggle(e) {
        if (this.props.selectedDueDate == "") {
            message.error("Please select Date first to set Reminder")
        } else {
            this.setState(prevState => ({
                popoverOpen: !prevState.popoverOpen
            }));
        }
    }

    onChange(e) {
        this.props.reminderCallback(e);
        this.setState({reminder: e});
    }

    render() {
        return (
            <div className={"mr-3 position-relative cursor_pointer"}>
                <a onClick={this.toggle}>
                    <img src={reminderIcon} alt={"Reminder"} data-toggle="tooltip" title="Add Reminder"/>
                </a>
                {this.state.popoverOpen ? (
                    <div className={"flag-selection-outer"}>
                        <Select
                            style={{width: '100%'}}
                            placeholder="Select reminder"
                            value={this.state.reminder}
                            onChange={this.onChange}
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
                                this.props.tagCreation('reminder');
                            }}
                        >
                            {reminderOptions.map((reminder, index) => (
                                <Option key={index} value={reminder} label={reminder}>
                                    <div className="demo-option-label-item">
                                        {reminder}
                                    </div>
                                </Option>
                            ))}
                        </Select></div>) : ""}
            </div>
        );
    }
}

export default Reminder;



