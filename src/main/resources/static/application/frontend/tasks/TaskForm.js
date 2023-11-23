class TaskForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name ? this.props.name : '',
            description: this.props.description ? this.props.description : '',
            type: this.props.type ? this.props.type : '',
            project: this.props.project ? this.props.project : '',
            owner: this.props.owner ? this.props.owner : '',
            loadedUsers: false,
            loadedProjects: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLoadedUsers = this.handleLoadedUsers.bind(this);
        this.handleLoadedProjects = this.handleLoadedProjects.bind(this);
    }
    handleChange(e) {
        const $target = $(e.target);
        this.setState({
            [$target.attr('name')]: $target.val()
        });
    }
    handleLoadedUsers(users) {
        this.setState({
            loadedUsers: users && users.length ? true: false
        });
    }
    handleLoadedProjects(projects) {
        this.setState({
            loadedProjects: projects && projects.length ? true : false
        });
    }
    render() {
        return (
            <form className="form-horizontal ui-helper-margin-top ui-helper-margin-bottom" id="task-form">
                <div className="form-group row ui-helper-margin-top">
                    <label htmlFor="name" className="col-3 text-right input-label-middle">
                        Name
                    </label>
                    <div className="input-group col-7 col-sm-7">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fas fa-tasks"></i></span>
                        </div>
                        <input type="text" className="form-control" id="name" name="name" placeholder="Task Name"
                            value={this.state.name} onChange={this.handleChange}
                            data-validation="length alphanumeric"
                            data-validation-allowing=" _"
                            data-validation-length="min4"
                            data-validation-error-msg-container="#input-name-error"
                            data-validation-error-msg="Task name must be alphanumeric with at least 4 characters length!"/>
                    </div>
                </div>
                <div className="form-group row d-none">
                   <div className="col-3"></div>
                   <div className="col-9 text-left" id="input-name-error"></div>
                </div>
                <div className="form-group row">
                    <label htmlFor="address" className="col-3 text-right">
                        Description
                    </label>
                    <div className="input-group col-7 col-sm-7">
                        <textarea className="form-control" id="description" name="description" rows="3"
                                  value={this.state.description} onChange={this.handleChange}>
                        </textarea>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="address" className="col-3 text-right input-label-middle">
                        Task type
                    </label>
                    <div className="input-group col-7 col-sm-7">
                        <select id="type" name="type" className="form-control"
                                value={this.state.type} onChange={this.handleChange}>
                            <option value="BUG">Bug</option>
                            <option value="FEATURE">Feature</option>
                        </select>
                    </div>
                </div>
                <Select label="Project" name="project" callback={projectService.findProjects} token={this.props.token}
                           optionLabel="name" optionValue="projectId" 
                           handleChange={this.handleChange} value={this.state.project}
                           handleOnload={this.handleLoadedProjects}/>
                <Select label="Owner" name="owner" callback={userService.findUsers} token={this.props.token}
                           optionLabel="username" optionValue="username" 
                           handleChange={this.handleChange} value={this.state.owner}
                           handleOnload={this.handleLoadedUsers}/>
                <div className="form-row text-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-primary" 
                                disabled={!this.state.loadedUsers || !this.state.loadedProjects} 
                                onClick={this.props.handleClick}>
                            {this.props.action}
                        </button>
                   </div>
                </div>
            </form>
        );
    }
};
