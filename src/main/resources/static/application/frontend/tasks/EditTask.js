class EditTask extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.state = {
            loading: true,
            task: {}
        };
    }
    componentDidMount() {
        let onComplete = (data) => {
            this.setState({
                loading: false,
                task: data ? data : {}
            });
        };
        taskService.findTaskById(this.props.match.params.id, {
            token : this.props.token
        }, onComplete.bind(this), onComplete.bind(this));
    }
    handleClick() {
        if(!$('#taskForm').isValid({}, config.formValidator, true)) {
            return;
        }
        let onSuccess = () => {
            alerts.success('Task updated successfully!');
            this.props.history.push('/tasks/' + encodeURIComponent(this.props.match.params.id));
        };
        taskService.updateTaskById(this.props.match.params.id, {
            token: this.props.token,
            body: {
                name: $('#name').val(),
                description: $('#description').val(),
                type: $('#type').val(),
                project: $('#project').val(),
                owner: $('#owner').val()
            }
        }, onSuccess.bind(this));
    }
    renderBody() {
        if(this.state.loading) {
            return (<Loading></Loading>);
        } else if(!this.state.task || !this.state.task.taskId) {
            return (<Warning message="Task not found!"/>);
        } else {
            return(
                <div className="row w-100">
                    <div className="col">
                        <div className="card mx-auto bg-light center-block">
                            <TaskForm token={this.props.token} handleClick={this.handleClick} 
                                id={this.props.match.params.id} 
                                name={this.state.task.name} description={this.state.task.description}
                                status={this.state.task.status} owner={this.state.task.owner.username}
                                type={this.state.task.type} project={this.state.task.project.projectId} 
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
                <Title title={'Edit Task #' + this.props.match.params.id}></Title>
                { this.renderBody() }
            </div>
        );
    }
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

EditTask = ReactRedux.connect(mapStateToProps)(EditTask);