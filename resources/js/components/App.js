import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Home from "./Home";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Home/>
        )
    }
}

if (document.getElementById('mainapp')) {
    ReactDOM.render(<App/>, document.getElementById('mainapp'));
}
