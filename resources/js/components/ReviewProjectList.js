import React, {Component} from 'react'
import SingleRowList from "./SingleRowList";
import ProjectContext from "./projectContext";

class ReviewProjectList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.getData = this.getData.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.context.toUpdate)
            this.getData()
    }


    componentDidMount() {
        this.getData();
    }

    getData() {
        fetch("/review-project", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            }
        })

            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        data: result
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
        if (this.context.toUpdate) {
            this.context.setUpdate(0);
        }
    }

    render() {
        const {data} = this.state;
        return (
            <div className={"container"}>
                <div className={"bg-white h-100 p-5"}>
                    <h2 className={"font-weight-bold text-left mb-4 color-navyblue"}>Review</h2>
                    <div>
                        {
                            data.length > 0 ? (
                                data.map(individual => (
                                    <SingleRowList key={individual.id} data={individual} flag={true} review={true}
                                                   id={individual.id}
                                                   updateSelection={this.props.updateSelection}/>
                                ))
                            ) : <h3 className={"text-center"}>No project(s) found</h3>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

ReviewProjectList.contextType = ProjectContext
export default ReviewProjectList
