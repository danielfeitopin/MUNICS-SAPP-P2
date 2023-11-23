const WEBAPP_CONTEXT = '/tasks-service/dashboard';
class Main extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const HomePage = () => <Welcome token={this.props.token}/>;
        const LoginPage = (props) => <Login token={this.props.token} history={props.history}/>;
        const OAuthLoginPage = (props) => <OAuthLogin token={this.props.token} history={props.history}/>;
        
        const ProjectsPage = (props) => <Projects token={this.props.token} history={props.history}/>;
        const NewProjectPage = (props) => <NewProject token={this.props.token} history={props.history}/>;
        const EditProjectPage = (props) => <EditProject token={this.props.token} match={props.match} history={props.history}/>;
        const ProjectPage = (props) => <Project token={this.props.token} match={props.match} history={props.history}/>;
        
        const TasksPage = (props) => <Tasks token={this.props.token} history={props.history}/>;
        const MyTasksPage = (props) => <MyTasks token={this.props.token} history={props.history}/>;
        const NewTaskPage = (props) => <NewTask token={this.props.token} history={props.history}/>;
        const TaskPage = (props) => <Task token={this.props.token} match={props.match} history={props.history}/>;
        const EditTaskPage = (props) => <EditTask token={this.props.token} match={props.match} history={props.history}/>;

        return (
            <ReactRouterDOM.BrowserRouter basename={WEBAPP_CONTEXT}>
                <div>
                    <Navbar></Navbar>
                    <div className="container">
                        <ReactRouterDOM.Switch>
                            <ReactRouterDOM.Route exact path='/' component={HomePage}/>
                            <ReactRouterDOM.Route path='/login' component={LoginPage}/>
                            <ReactRouterDOM.Route path='/loginOAuth' component={OAuthLoginPage}/>
                            
                            <ReactRouterDOM.Route exact path='/projects' component={ProjectsPage}/>
                            <ReactRouterDOM.Route path='/newProject' component={NewProjectPage}/>
                            <ReactRouterDOM.Route exact path='/projects/:id' component={ProjectPage}/>
                            <ReactRouterDOM.Route path='/projects/:id/edit' component={EditProjectPage}/>
                            
                            <ReactRouterDOM.Route exact path='/tasks' component={TasksPage}/>
                            <ReactRouterDOM.Route path='/myTasks' component={MyTasksPage}/>
                            <ReactRouterDOM.Route path='/newTask' component={NewTaskPage}/>
                            <ReactRouterDOM.Route exact path='/tasks/:id' component={TaskPage}/>
                            <ReactRouterDOM.Route path='/tasks/:id/edit' component={EditTaskPage}/>
                        </ReactRouterDOM.Switch>
                    </div>
                </div>
            </ReactRouterDOM.BrowserRouter>
        );
    }
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

Main = ReactRedux.connect(mapStateToProps)(Main);

