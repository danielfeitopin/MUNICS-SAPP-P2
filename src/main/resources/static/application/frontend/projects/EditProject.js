class EditProject extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.state = {
            loading: true,
            project: {}
        };
    }
    componentDidMount() {
        let onComplete = (data) => {
            this.setState({
                loading: false,
                project: data ? data : {}
            });
        };
        projectService.findProjectById(this.props.match.params.id, {
            token : this.props.token
        }, onComplete.bind(this), onComplete.bind(this));
    }
    handleClick() {
        if(!$('#projectForm').isValid({}, config.formValidator, true)) {
            return;
        }
        let onSuccess = () => {
            alerts.success('Project updated successfully!');
            this.props.history.push('/projects/' + encodeURIComponent(this.props.match.params.id));
        };
        projectService.updateProjectById(this.props.match.params.id, {
            token: this.props.token,
            body: {
                name: $('#name').val(),
                description: $('#description').val()
            }
        }, onSuccess.bind(this));
    }
    renderBody() {
        if(this.state.loading) {
            return (<Loading></Loading>);
        } else if(!this.state.project || !this.state.project.projectId) {
            return (<Warning message="Project not found!"/>);
        } else {
            return(
                <div className="row w-100">
                    <div className="col">
                        <div className="card mx-auto bg-light center-block">
                            <ProjectForm token={this.props.token} handleClick={this.handleClick} 
                                id={this.props.match.params.id} 
                                name={this.state.project.name} description={this.state.project.description}
                                action="Update" />
                        </div>
                    </div>
                </div>
            );
        }
    }
    render() {
        if(!this.props.user) {
            return (<ReactRouterDOM.Redirect to="/login"/>);
        }
        return (
            <div className="container">
                <Title title={'Edit Project #' + this.props.match.params.id}></Title>
                { this.renderBody() }
            </div>
        );
    }
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

EditProject = ReactRedux.connect(mapStateToProps)(EditProject);
