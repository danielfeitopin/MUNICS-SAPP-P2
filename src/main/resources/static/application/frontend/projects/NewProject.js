var NewProject = (props) => {
    const handleClick = () => {
        if(!$('#project-form').isValid({}, config.formValidator, true)) {
            return;
        }
        var onSuccess = data => {
            alerts.success('Project created successfully!');
            props.history.push('/projects/' + encodeURIComponent(data.projectId));
        };
        
        projectService.createProject({
            token: props.token,
            body: {
                name: $('#name').val(),
                description: $('#description').val()
            }
        }, onSuccess.bind(this));
    };
    if(!props.user) {
        return (<ReactRouterDOM.Redirect to="/login"/>);
    }
    return (
        <div className="container">
            <Title title="New Project"></Title>
            <div className="row w-100">
                <div className="col">
                    <div className="card mx-auto bg-light center-block">
                        <ProjectForm token={props.token} handleClick={handleClick} action="Create" />
                    </div>
                </div>
            </div>
        </div>    
    );
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

NewProject = ReactRedux.connect(mapStateToProps)(NewProject);