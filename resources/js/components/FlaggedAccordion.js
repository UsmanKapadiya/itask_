import React from 'react';
import flagImage from "../../images/icon_left_flag.png"
import * as options from './Constants'
import {Select} from "antd";

const priorityFlags = options.priorityFlags;

class FlaggedAccordion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            className: 'accordion-content accordion-close',
            headingClassName: 'accordion-heading',
            content: "../../images/icon_left_dropleft.png",
        };

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
        const {content} = this.state;
        const {className} = this.state;
        const {updateSelection} = this.props;
        return (
            <div className="parent-accordion">
                <div className={"cursor_pointer"} onClick={this.handleClick}>
                    <img src={flagImage} alt="Flagged" className={"mr-2 ml-3"}/>
                    <span>Flagged</span>
                    <span className="mr-6 float-right">
                        <img src={content} alt="Flag"/>
                    </span>
                </div>
                <div className={className}>
                    <ul className={"flaglist"}>
                        {Object.keys(priorityFlags).map((f) => (
                            <li key={f}>
                                <a href={"#"}>
                                    <span className={"d-inline-block mr-2"}>
                                        <img src={priorityFlags[f].image} className="flag" height="30"/>
                                    </span>
                                    <span onClick={() => {updateSelection("flag",priorityFlags[f].value)}}>{priorityFlags[f].label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


        );
    }

}

export default FlaggedAccordion;
