class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            task: {}
        };
        this.reloadTask = this.reloadTask.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.handleClickOnRemovetTask = this.handleClickOnRemovetTask.bind(this);
        this.handleClickOnEditTask = this.handleClickOnEditTask.bind(this);
        this.handleClickOnComment = this.handleClickOnComment.bind(this);
        this.handleClickOnChangeTaskState = this.handleClickOnChangeTaskState.bind(this);
        this.handleClickOnChangeTaskResolution = this.handleClickOnChangeTaskResolution.bind(this);
        this.handleClickOnChangeTaskProgress = this.handleClickOnChangeTaskProgress.bind(this);
        this.handleChangeProgress = this.handleChangeProgress.bind(this);
        this.renderTask = this.renderTask.bind(this);
        this.renderComments = this.renderComments.bind(this);
        this.renderTaskAndComments = this.renderTaskAndComments.bind(this);
        this.renderNewCommentForm = this.renderNewCommentForm.bind(this);
    }
    reloadTask() {
        var onComplete = (data) => {
            this.setState({
                loading: false,
                task: data ? data : {}
            });
        };
        taskService.findTaskById(this.props.match.params.id, {
            token : this.props.token
        }, onComplete.bind(this), onComplete.bind(this));
    }
    componentDidMount() {
        if(this.props.user) {
            this.reloadTask();
        }
    }
    handleClickOnEditTask() {
        this.props.history.push('/tasks/' + encodeURIComponent(this.props.match.params.id) + '/edit');
    }
    handleChangeProgress(e) {
        const $target = $(e.target);
        this.state.task.progress = $target.val();
        this.setState({
            task: this.state.task // TODO - Unsafe
        });
    }
    handleClickOnChangeTaskState(e) {
        var onSuccess = () => {
            alerts.success('Task state changed successfully!');
            this.setState({
                loading: true,
                task: {}
            });
            this.reloadTask();
        };
        
        taskService.updateTaskStateById(this.props.match.params.id, {
            token: this.props.token,
            body: $(e.currentTarget).data('state')
        }, onSuccess.bind(this));
              
    }
    handleClickOnChangeTaskResolution(e) {
        var onSuccess = () => {
            alerts.success('Task updated successfully!');
            this.setState({
                loading: true,
                task: {}
            });
            this.reloadTask();
        };
        taskService.updateTaskResolutionById(this.props.match.params.id, {
            token: this.props.token,
            body: $(e.currentTarget).data('resolution')
        }, onSuccess.bind(this));
    }
    handleClickOnChangeTaskProgress(e) {
        var onSuccess = () => {
            alerts.success('Task updated successfully!');
            this.setState({
                loading: true,
                task: {}
            });
            this.reloadTask();
        };
        taskService.updateTaskProgressById(this.props.match.params.id, {
            token: this.props.token,
            body: $('#progress').val()
        }, onSuccess.bind(this));
    }
    handleClickOnRemovetTask() {
        var onSuccess = () => {
            alerts.success('Task removed successfully!');
            this.props.history.push('/tasks');
        };
        taskService.removeTaskById(this.props.match.params.id, {
            token: this.props.token
        }, onSuccess.bind(this));
    }
    handleClickOnComment() {
        if(!$('#new-comment-form').isValid({}, config.formValidator, true)) {
            return;
        }
        var onSuccess = function() {
            alerts.success('Comment created successfully!');
            this.setState({
                loading: true,
                task: {}
            });
            this.reloadTask();
        };
        taskService.createComment({
            token: this.props.token,
            body: {
                text: $('#comment').val(),
                taskId: this.props.match.params.id
            }
        }, onSuccess.bind(this));
    }
    renderButtons() {
        if(this.state.task.project.admin.username === this.props.user) {
            if(this.state.task.state === 'CLOSED') {
                return (
                    <div className="row w-100 mx-auto">
                        <div className="col text-center">
                            <button className="btn btn-sm btn-primary" type="button" data-state="OPEN"
                                    onClick={this.handleClickOnChangeTaskState}>
                                <i className="fa fa-lock-open"></i>&nbsp;
                                <span>Reopen</span>
                            </button>
                            &nbsp;
                            <ConfirmButton icon="fa fa-trash" message="Remove task?" label="Remove"
                                           clickHandler={this.handleClickOnRemovetTask} 
                                           data={this.props.match.params.id}/>
                        </div>
                    </div>
                );
            }
            return (
                <div className="row w-100 mx-auto">
                    <div className="col text-center">
                        <button className="btn btn-sm btn-success" type="button" onClick={this.handleClickOnEditTask}>
                            <i className="fa fa-edit"></i>&nbsp;
                            <span>Edit</span>
                        </button>&nbsp;
                        <button className="btn btn-sm btn-primary" type="button" data-state="CLOSED"
                                onClick={this.handleClickOnChangeTaskState}>
                            <i className="fa fa-lock"></i>&nbsp;
                            <span>Close</span>
                        </button>
                        &nbsp;
                        <ConfirmButton icon="fa fa-trash" message="Remove task?" label="Remove"
                                       clickHandler={this.handleClickOnRemovetTask} data={this.props.match.params.id}/>
                    </div>
                </div>
            );
        } else if(this.props.user === this.state.task.owner.username && this.state.task.state === 'OPEN') {
            if(this.state.task.resolution === 'NEW') {
                return (<div className="row w-100 mx-auto">
                    <div className="col text-center">
                        <button className="btn btn-sm btn-primary" type="button" data-resolution="IN_PROGRESS"
                                onClick={this.handleClickOnChangeTaskResolution}>
                            <i className="fa fa-tasks"></i>&nbsp;
                            <span>Start</span>
                        </button>
                    </div>
                </div>);
            } else if(this.state.task.resolution === 'IN_PROGRESS') {
                return (<div className="row w-100 mx-auto">
                    <div className="col text-center">
                        <button className="btn btn-sm btn-primary" type="button"
                                onClick={this.handleClickOnChangeTaskProgress}>
                            <i className="fa fa-tasks"></i>&nbsp;
                            <span>Update Progress</span>
                        </button>&nbsp;
                        <button className="btn btn-sm btn-primary" type="button" data-resolution="COMPLETED"
                                onClick={this.handleClickOnChangeTaskResolution}>
                            <i className="fa fa-tasks"></i>&nbsp;
                            <span>Complete</span>
                        </button>
                    </div>
                </div>);              
            } else {
                return (<div className="row w-100 mx-auto">
                    <div className="col text-center">
                        <button className="btn btn-sm btn-primary" type="button" data-resolution="IN_PROGRESS"
                                onClick={this.handleClickOnChangeTaskResolution}>
                            <i className="fa fa-tasks"></i>&nbsp;
                            <span>In Progress</span>
                        </button>
                    </div>
                </div>);
            }
        }

    }
    renderTask() {
        var date = new Date(this.state.task.timestamp);
        return (
            <div className="row w-100 mx-auto">
                <div className="col">
                    <div className="card mx-auto bg-light center-block">
                        <div className="card-body">

                            <div className="form-group row">
                               <label className="col-6 text-right">Name</label>
                               <div className="col-6 text-left">
                                  <span>{this.state.task.name}</span>
                               </div>
                            </div>

                            <div className="form-group row">
                               <label className="col-6 text-right">Description</label>
                               <div className="col-6 text-left">
                                  <span>{this.state.task.description}</span>
                               </div>
                            </div>

                            <div className="form-group row">
                               <label className="col-6 text-right">Creation Date</label>
                               <div className="col-6 text-left">
                                  <span>{date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</span>
                               </div>
                            </div>

                            <div className="form-group row">
                               <label className="col-6 text-right">Type</label>
                               <div className="col-6 text-left">
                                  <span>{this.state.task.type}</span>
                               </div>
                            </div>

                            <div className="form-group row">
                               <label className="col-6 text-right">State</label>
                               <div className="col-6 text-left">
                                   {this.state.task.state === 'OPEN' ? 
                                        (<i className="fa fa-lock-open"></i>) : 
                                        (<i className="fa fa-lock"></i>)}
                                    &nbsp;
                                    <span>{this.state.task.state}</span>
                               </div>
                            </div>

                            <div className="form-group row">
                               <label className="col-6 text-right">Resolution</label>
                               <div className="col-6 text-left">
                                  <span>{this.state.task.resolution}</span>
                               </div>
                            </div>
                            
                            {this.props.user === this.state.task.owner.username && 
                             this.state.task.state === 'OPEN' &&
                             this.state.task.resolution === 'IN_PROGRESS' ?
                                <div className="form-group row">
                                    <label className="col-6 text-right">Progress</label>
                                    <div className="col-3 text-left">
                                    <select id="progress" name="progress" className="form-control"
                                            value={this.state.task.progress} onChange={this.handleChangeProgress}>
                                        <option value="0">0%</option>
                                        <option value="25">25%</option>
                                        <option value="50">50%</option>
                                        <option value="75">75%</option>
                                        <option value="75">100%</option>
                                    </select>
                                    </div>
                                </div>: null
                            }

                            <div className="form-group row">
                               <label className="col-6 text-right">Owner</label>
                               <div className="col-6 text-left">
                                  <span>{this.state.task.owner.username}</span>
                               </div>
                            </div>

                            {this.renderButtons()}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderComments() {
        if(!this.state.task.comments || !this.state.task.comments.length) {
            return (
                <div className="ui-helper-margin-top">
                    <Warning message="This task has no comments!"/>
                </div>
            );
        }
        const comments = this.state.task.comments.map(function(comment){
            var date = new Date(comment.timestamp);
            return(
                <div className="row w-100 mx-auto ui-helper-margin-top ui-helper-margin-bottom" key={comment.commentId}>
                    <div className="col">
                        <div className="card mx-auto bg-light center-block">
                            <div className="form-group row ui-helper-margin-top">
                                <div className="col-6 text-right">
                                    <span className="fas fa-user"></span>&nbsp;
                                    <span className="font-weight-bold">{comment.user.username}</span>
                                </div>
                                <div className="col-6 text-left">
                                    <span>{date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col text-center">
                                    <span>{comment.text}</span>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        return(<div>{comments}</div>);
    }
    renderNewCommentForm() {
        if(this.state.task.state === 'CLOSED') {
            return null;
        }
        return(
            <form id="new-comment-form">
                <div className="row w-100 mx-auto">
                    <div className="col">
                        <div className="mx-auto center-block w-100">
                            <div className="form-group row">
                                <div className="input-group col">
                                    <textarea className="form-control" id="comment" name="comment" rows="3"
                                              data-validation="length"
                                              data-validation-allowing=" _"
                                              data-validation-length="min4"
                                              data-validation-error-msg-container="#input-comment-error"
                                              data-validation-error-msg="Text name must be at least 4 characters length!">
                                    </textarea>
                                </div>
                            </div>
                            <div className="form-group row d-none">
                               <div className="col text-center" id="input-comment-error"></div>
                            </div>
                            <div className="row w-100 mx-auto ui-helper-margin-bottom">
                                <div className="col text-center">
                                    <button className="btn btn-sm btn-success" type="button" 
                                            onClick={this.handleClickOnComment}>
                                        <i className="fa fa-comment"></i>&nbsp;
                                        <span>Comment</span>
                                    </button>&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
    renderTaskAndComments() {
        if(!this.state.task || !this.state.task.taskId) {
            return (<Warning message="Task not found!"/>);
        }
        return(
            <div>
                {this.renderTask()}
                {this.renderComments()}
                {this.renderNewCommentForm()}
            </div>
        );
    }
    render() {
        if(!this.props.user) {
            return (<ReactRouterDOM.Redirect to="/login"/>);
        }
        return (
            <div className="container">
                <Title title={'Task #' + this.props.match.params.id}></Title>
                {this.state.loading ? (
                    <Loading></Loading>
                ) : (
                    this.renderTaskAndComments()
                )}
            </div>
        );
    }
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

Task = ReactRedux.connect(mapStateToProps)(Task);