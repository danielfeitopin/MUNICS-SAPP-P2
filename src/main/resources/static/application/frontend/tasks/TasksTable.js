class TasksTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            tasks: []
        };
        this.handleClickOnViewOrEditTask = this.handleClickOnViewOrEditTask.bind(this);
        this.handleClickOnRemovetTask = this.handleClickOnRemovetTask.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.reloadTasks = this.reloadTasks.bind(this);
    }
    componentDidMount() {
        this.reloadTasks();
    }
    componentDidUpdate() {
        $('table').DataTable({});
    }
    reloadTasks() {
        var onSuccess = (data) => {
            this.setState({
                loading: false,
                error: false,
                tasks: data ? data : []
            });
        };
        var onError = (data) => {
            alerts.error(data.message);
            this.setState({
                loading: false,
                error: data.message,
                tasks: []
            });
        };
        if(this.props.owner) {
            taskService.findTasksByOwner(this.props.owner, {
                token: this.props.token
            }, onSuccess.bind(this), onError.bind(this));
        } else if(this.props.project) {
            projectService.findProjectTasksById(this.props.project, {
                token: this.props.token
            }, onSuccess.bind(this), onError.bind(this));
        } else {
            taskService.findTasks({
                token: this.props.token
            }, onSuccess.bind(this), onError.bind(this));
        }
    }
    handleClickOnViewOrEditTask(e) {
        const $link = $(e.currentTarget);
        const href = $link.attr('href');
        if(href) {
            this.props.history.push(href);
        }
    }
    handleClickOnRemovetTask(e) {
        const $button = $(e.currentTarget);
        const href = $button.attr('href');
        
        var onSuccess = () => {
            alerts.success('Task #' + href + ' removed successfully!');
            this.setState({
                loading: true,
                error: false,
                tasks: []
            });
            this.reloadTasks();
        };
        var onError = (data) => {
            alerts.error(data.message);
            this.setState({
                loading: false,
                error: data.message,
                tasks: []
            });
        };
        taskService.removeTaskById(href, {
            token: this.props.token
        }, onSuccess.bind(this), onError.bind(this));
        
    }
    renderTable() {
        if(this.state.error) {
            return (<Error message={this.state.error}/>);
        } else if(!this.state.tasks || this.state.tasks.length === 0) {
            return (<Warning message="No tasks!"/>);
        }
        const handleClickOnViewOrEditTask = this.handleClickOnViewOrEditTask;
        const handleClickOnRemovetTask = this.handleClickOnRemovetTask;
        const user = this.props.user;
        const isAdmin = this.props.isAdmin;
        var rows = this.state.tasks.map(function(task){
            console.log();
            const isProjectAdmin = task.project.admin.username === user;
            var viewTaskHref = '/tasks/' + encodeURIComponent(task.taskId);
            var editTaskHref = viewTaskHref + '/edit';
            return (
                <tr className="text-left" key={task.taskId}>
                    <td className="align-middle">{task.taskId}</td>
                    <td className="align-middle">{task.name}</td>
                    <td className="align-middle">{task.type}</td>
                    <td className="align-middle">{task.owner.username}</td>
                    <td className="align-middle">
                        {task.state === 'OPEN' ? 
                            (<i className="fa fa-lock-open"></i>) : 
                            (<i className="fa fa-lock"></i>)}
                    </td>
                    <td className="align-middle">{task.resolution}</td>
                    <td className="align-middle" className={user ? '' : 'd-none'}>
                        <button className="btn btn-sm btn-success" type="button" 
                                href={viewTaskHref} onClick={handleClickOnViewOrEditTask}>
                            <i className="fa fa-search"></i>
                        </button>
                    </td>
                    <td className="align-middle" className={isAdmin ? '' : 'd-none'}>
                        <button className={isProjectAdmin ? 'btn btn-sm btn-primary' : 'd-none'} 
                                type="button"  disabled={task.state === 'CLOSED'}
                                href={editTaskHref} onClick={handleClickOnViewOrEditTask}>
                            <i className="fa fa-edit"></i>
                        </button>
                    </td>
                    <td className="align-middle" className={isAdmin ? '' : 'd-none'}>
                        <div className={isProjectAdmin ? '' : 'd-none'}>
                            <ConfirmButton icon="fa fa-trash" message="Remove task?" 
                               clickHandler={handleClickOnRemovetTask} data={task.taskId}/>
                        </div>
                    </td>
                </tr>);
        });
        
        return (
            <div className="row w-100 mx-auto">
                <div className="col">
                    <table className="table table-striped dt-responsive w-100" >
                         <thead>
                            <tr className="text-left">
                                <th data-priority="1">#</th>
                                <th data-priority="1">Name</th>
                                <th data-priority="4">Type</th>
                                <th data-priority="3">Owner</th>
                                <th data-priority="3">State</th>
                                <th data-priority="3">Resolution</th>
                                <th data-priority="2" data-orderable="false" 
                                    className={this.props.user ? '' : 'd-none'}>
                                    <i className="fas fa-search"></i>
                                </th>
                                <th data-priority="2" data-orderable="false" 
                                    className={this.props.isAdmin ? '' : 'd-none'}>
                                    <i className="fas fa-edit"></i>
                                </th>
                                <th data-priority="2" data-orderable="false" 
                                    className={this.props.isAdmin ? '' : 'd-none'}>
                                    <i className="fas fa-trash"></i>
                                </th>
                            </tr>
                         </thead>
                         <tbody>{rows}</tbody>
                      </table>
                </div>
            </div>
        );
    }
    render() {
        if(this.state.loading) {
            return <Loading></Loading>;
        } else {
            return this.renderTable();
        }
    }
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

TasksTable = ReactRedux.connect(mapStateToProps)(TasksTable);
