import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import ReactDOM from "react-dom";

class Tags extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tags: [],
            suggestions: [
                // { id: 3, name: "Bananas" },
                //                 // { id: 4, name: "Mangos" },
                //                 // { id: 5, name: "Lemons" },
                //                 // { id: 6, name: "Apricots" }

            ]
        }
    }

    componentDidMount() {
        fetch("/member-tags")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        suggestions: result

                    });
                    // console.log("after");
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    handleDelete(i) {
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1)
        this.setState({tags})
        this.props.projecttagCallback(tags);
    }

    handleAddition(tag) {
        const tags = [].concat(this.state.tags, tag)
        this.setState({tags})
        this.props.projecttagCallback(tags);

    }


    render() {
        const {suggestions} = this.state;
        return (
            <ReactTags
                tags={this.state.tags}
                suggestions={this.state.suggestions}
                handleDelete={this.handleDelete.bind(this)}
                handleAddition={this.handleAddition.bind(this)}
                allowNew={true}
            />


        )
    }
}

export default Tags;

