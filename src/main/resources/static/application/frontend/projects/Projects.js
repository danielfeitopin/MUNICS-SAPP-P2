class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            projects: []
        };
        this.handleClickOnViewOrEditProject = this.handleClickOnViewOrEditProject.bind(this);
        this.handleClickOnRemovetProject = this.handleClickOnRemovetProject.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.reloadProjects = this.reloadProjects.bind(this);
    }
    componentWillUnmount() {
    }
    componentDidMount() {
        this.reloadProjects();
    }
    componentDidUpdate() {
        $('table').DataTable({});
    }
    reloadProjects() {
        var onSuccess = (data) => {
            this.setState({
                loading: false,
                error: false,
                projects: data ? data : []
            });
        };
        var onError = (data) => {
            alerts.error(data.message);
            this.setState({
                loading: false,
                error: data.message,
                projects: []
            });
        };
        projectService.findProjects({
            token: this.props.token
        }, onSuccess.bind(this), onError.bind(this));
    }
    handleClickOnViewOrEditProject(e) {
        const $link = $(e.currentTarget);
        const href = $link.attr('href');
        if(href) {
            this.props.history.push(href);
        }
    }
    handleClickOnRemovetProject(e) {
        const $button = $(e.currentTarget);
        const href = $button.attr('href');
        
        var onSuccess = () => {
            alerts.success('Project #' + href + ' removed successfully!');
            this.setState({
                loading: true,
                error: false,
                projects: []
            });
            this.reloadProjects();
        };
        var onError = (data) => {
            alerts.error(data.message);
            this.setState({
                loading: false,
                error: data.message,
                projects: []
            });
        };
        projectService.removeProjectById(href, {
            token: this.props.token
        }, onSuccess.bind(this), onError.bind(this));
        
    }
    renderTable() {
        if(this.state.error) {
            return (<Error message={this.state.error}/>);
        } else if(!this.state.projects || this.state.projects.length === 0) {
            return (<Warning message="No projects!"/>);
        }
        const handleClickOnViewOrEditProject = this.handleClickOnViewOrEditProject;
        const handleClickOnRemovetProject = this.handleClickOnRemovetProject;
        const user = this.props.user;
        const isAdmin = this.props.isAdmin;
        var rows = this.state.projects.map(function(project){
            const isProjectAdmin = project.admin.username === user;
            var viewProjectHref = '/projects/' + encodeURIComponent(project.projectId);
            var editProjectHref = viewProjectHref + '/edit';
            return (
                <tr className="text-left" key={project.projectId}>
                    <td className="align-middle">{project.projectId}</td>
                    <td className="align-middle">{project.name}</td>
                    <td className="align-middle">{project.tasksCount}</td>
                    <td className="align-middle" className={user ? '' : 'd-none'}>
                        <button className="btn btn-sm btn-success" type="button" 
                                href={viewProjectHref} onClick={handleClickOnViewOrEditProject}>
                            <i className="fa fa-search"></i>
                        </button>
                    </td>                    
                    <td className="align-middle" className={isAdmin ? '' : 'd-none'}>
                        <button className={isProjectAdmin ? 'btn btn-sm btn-primary' : 'd-none'} type="button"  
                                disabled={project.state === 'CLOSED'}
                                href={editProjectHref} onClick={handleClickOnViewOrEditProject}>
                            <i className="fa fa-edit"></i>
                        </button>
                    </td>
                    <td className="align-middle" className={isAdmin ? '' : 'd-none'}>
                        <div className={isProjectAdmin ? '' : 'd-none'}>
                            <ConfirmButton icon="fa fa-trash" message="Remove project?" 
                                clickHandler={handleClickOnRemovetProject} data={project.projectId}/>
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
                                <th data-priority="3">Tasks</th>
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
        return (
            <div className="container">
                <Title title="Projects"></Title>
                {
                    this.state.loading ? (<Loading></Loading>) : (this.renderTable())
                }
            </div>
        );
    }
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

Projects = ReactRedux.connect(mapStateToProps)(Projects);


