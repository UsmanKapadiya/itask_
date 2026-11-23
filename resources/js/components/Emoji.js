import React, {Component} from "react";
import {Popover} from "antd";
import {Picker} from "emoji-mart";
import emojiIcon from "../../images/icon_emoji.svg"

class Emoji extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emojiOpen: false
        }
    }


    render() {
        const input_name = this.props.inputName
        return (
            <Popover
                overlayStyle={{width: "405px"}}
                content={
                    <Picker title='Pick your emoji…' emoji='point_up' showPreview={false} onSelect={(e) => {
                        this.setState({"emojiOpen": false})
                        this.props.setEmoji(input_name, e)
                    }} emojiSize={28}/>
                }
                trigger="click"
                visible={this.state.emojiOpen}
                getPopupContainer={() => document.getElementsByClassName('modal')[0]}
                onVisibleChange={(visible) => {
                    if (!visible) {
                        this.setState({emojiOpen: false})
                    }
                }}
            >
                <img src={emojiIcon} alt={"Emoji"} className="cursor_pointer ml-2" onClick={() => {
                    this.setState(prevState => ({
                        emojiOpen: !prevState.emojiOpen
                    }))
                }} height={16}/>
            </Popover>
        );
    }

}

export default Emoji
