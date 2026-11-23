import React, {Component} from 'react'
import LogoImage from '../../images/logo_itask.png'
import notificationImage from '../../images/icon_nav_notification.png'
import AddTaskModal from './AddTaskModal'
import Notificationlist from './notification'
import Settingmenu from "./setting";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchKey: '',
            data: [],
            errors: {}
        }

    }

    render() {
        return (
            <div className="container-fluid navigation px-5">
                <div className="color-white">
                    <div className="row">
                        <div className="col-md-3 my-auto px-0">
                            <img src={LogoImage} alt="itask"/>
                        </div>
                        <div className="col-md-9 px-0">
                            <div className="float-right d-flex h-100">
                                <div className="align-self-center">
                                    <div className="d-inline-block mr-4 add-task">
                                        <AddTaskModal isHeader={1}/>
                                    </div>
                                    <Notificationlist/>
                                    <div className="d-inline-block mr-4 add-task">
                                        <Settingmenu/>
                                    </div>
                                    <a href="#" onClick={() => {
                                        localStorage.setItem("section", null)
                                        localStorage.setItem("value", null)
                                        window.location = "/logout"
                                    }}>
                                        <span className="d-inline logout">
                                          <i className="fas fa-sign-out-alt fa-lg color-white ml-4"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header
