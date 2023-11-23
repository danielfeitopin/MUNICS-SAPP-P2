class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            project: {}
        };
        this.reloadProject = this.reloadProject.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.handleClickOnRemovetProject = this.handleClickOnRemovetProject.bind(this);
        this.handleClickOnEditProject = this.handleClickOnEditProject.bind(this);
        this.renderProject = this.renderProject.bind(this);
        this.renderTasks = this.renderTasks.bind(this);
        this.renderProjectAndTasks = this.renderProjectAndTasks.bind(this);
    }
    reloadProject() {
        var onComplete = (data) => {
            this.setState({
                loading: false,
                project: data ? data : {}
            });
        };
        projectService.findProjectById(this.props.match.params.id, {
            token : this.props.token
        }, onComplete.bind(this), onComplete.bind(this));
    }
    componentDidMount() {
        if(this.props.user) {
            this.reloadProject();
        }
    }
    handleClickOnEditProject() {
        this.props.history.push('/projects/' + encodeURIComponent(this.props.match.params.id) + '/edit');
    }
    handleClickOnRemovetProject() {
        var onSuccess = () => {
            alerts.success('Project removed successfully!');
            this.props.history.push('/projects');
        };
        projectService.removeProjectById(this.props.match.params.id, {
            token: this.props.token
        }, onSuccess.bind(this));
    }
    renderButtons() {
        return (
            <div className="row w-100 mx-auto">
                <div className="col text-center">
                    <button className="btn btn-sm btn-success" type="button" onClick={this.handleClickOnEditProject}>
                        <i className="fa fa-edit"></i>&nbsp;
                        <span>Edit</span>
                    </button>&nbsp;
                    <ConfirmButton icon="fa fa-trash" message="Remove project?" label="Remove"
                                   clickHandler={this.handleClickOnRemovetProject}
                                   data={this.props.match.params.id}/>
                </div>
            </div>
        );
    }
    renderProject() {
        var date = new Date(this.state.project.timestamp);
        const isAdmin = this.state.project.admin.username === this.props.user;
        return (
            <div className="row w-100 mx-auto">
                <div className="col">
                    <div className="card mx-auto bg-light center-block">
                        <div className="card-body">

                            <div className="form-group row">
                               <label className="col-6 text-right">Name</label>
                               <div className="col-6 text-left">
                                  <span>{this.state.project.name}</span>
                               </div>
                            </div>

                            <div className="form-group row">
                               <label className="col-6 text-right">Description</label>
                               <div className="col-6 text-left">
                                  <span>{this.state.project.description}</span>
                               </div>
                            </div>

                            <div className="form-group row">
                               <label className="col-6 text-right">Creation Date</label>
                               <div className="col-6 text-left">
                                  <span>{date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</span>
                               </div>
                            </div>

                            { isAdmin && this.renderButtons() }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderTasks() {
        return(
            <div className="ui-helper-margin-top">
                <TasksTable project={this.props.match.params.id} token={this.props.token} 
                            history={this.props.history}></TasksTable>
            </div>);
    }
    renderProjectAndTasks() {
        if(!this.state.project || !this.state.project.projectId) {
            return (<Warning message="Project not found!"/>);
        }
        return(
            <div>
                {this.renderProject()}
                {this.renderTasks()}
            </div>
        );
    }
    render() {
        if(!this.props.user) {
            return (<ReactRouterDOM.Redirect to="/login"/>);
        }
        return (
            <div className="container">
                <Title title={'Project #' + this.props.match.params.id}></Title>
                {this.state.loading ? (
                    <Loading></Loading>
                ) : (
                    this.renderProjectAndTasks()
                )}
            </div>
        );
    }
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

Project = ReactRedux.connect(mapStateToProps)(Project);
