var NewTask = (props) => {
    const handleClick = () => {
        if(!$('#task-form').isValid({}, config.formValidator, true)) {
            return;
        }
        var onSuccess = data => {
            alerts.success('Task created successfully!');
            props.history.push('/tasks/' + encodeURIComponent(data.taskId));
        };
        taskService.createTask({
            token: props.token,
            body: {
                name: $('#name').val(),
                description: $('#description').val(),
                type: $('#type').val(),
                project: $('#project').val(),
                owner: $('#owner').val()
            }
        }, onSuccess);
    };
    if(!props.user) {
        return (<ReactRouterDOM.Redirect to="/login"/>);
    }
    return (
        <div className="container">
            <Title title="New Task"></Title>
            <div className="row w-100">
                <div className="col">
                    <div className="card mx-auto bg-light center-block">
                        <TaskForm token={props.token} handleClick={handleClick} action="Create" />
                    </div>
                </div>
            </div>
        </div>    
    );
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

NewTask = ReactRedux.connect(mapStateToProps)(NewTask);