import React, {Component} from 'react'
import settingImage from '../../images/icon_nav_setting.png'
import {Popover, Menu, message} from "antd";
import AccountModal from './updateaccountmodal'
import TimezoneModal from "./TimezoneModal"
import RemindMeVia from "./RemindmeviaModal"
import AutoReminder from "./AutoReminderModal"
import NotificationModal from "./NotificationModal";
import {confirmAlert} from "react-confirm-alert";
import {deleteAccount} from "./FunctionCalls";

const {SubMenu} = Menu;

class Settingmenu extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.popoverRef = React.createRef()
        this.onclick = this.onclick.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    onclick() {
        this.popoverRef.current.props.onPopupVisibleChange(false);
    }

    deleteAccount() {
        confirmAlert({
            title: 'Delete account',
            message: 'Are you sure want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteAccount().then(res => {
                            if (res.errorStatus) {
                                message.error(res.data);
                            } else {
                                window.location = "/login";
                            }
                        })
                    },
                },
                {
                    label: 'No',
                    onClick: () => {
                    },
                },
            ],
        })
    }

    render() {
        return (
            <Popover ref={this.popoverRef} content={(
                <Menu
                    style={{width: 256}}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                >
                    <Menu.Item>
                        <div className={'cursor_pointer mb-1'} onClick={this.onclick}>
                            <AccountModal/>
                        </div>
                    </Menu.Item>
                    <SubMenu key="sub1" title="General">
                        <Menu.Item>
                            <div className={'cursor_pointer mb-1'} onClick={this.onclick}>
                                <TimezoneModal/>
                            </div>
                        </Menu.Item>
                        <SubMenu key="sub2" title="Reminders">
                            <Menu.Item>
                                <div className={'cursor_pointer mb-1'} onClick={this.onclick}>
                                    <RemindMeVia/>
                                </div>
                            </Menu.Item>
                            <Menu.Item>
                                <div className={'cursor_pointer mb-1'} onClick={this.onclick}>
                                    <AutoReminder/>
                                </div>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item>
                            <div className={'cursor_pointer mb-1'} onClick={this.onclick}>
                                <NotificationModal/>
                            </div>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item>
                        <div className={'cursor_pointer mb-1'} onClick={this.deleteAccount}>
                            Delete account
                        </div>
                    </Menu.Item>
                </Menu>
            )} trigger="click" placement="topLeft">
                <span className={"cursor_pointer"}>
                    <img src={settingImage} alt={"Options"}/>
                </span>

            </Popover>
        )
    }
}

export default Settingmenu
