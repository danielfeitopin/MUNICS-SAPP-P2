var Navbar = (props) => {
    
    const isLoggedIn = props.user ? true : false;
    const isAdmin = isLoggedIn && props.isAdmin;
    
    const handleLogout = (e) => {
        e.preventDefault();
        alerts.success(escapeHtml('User ' + props.user) + ' logged out!');
        jwt.destroyJwtToken();
        props.dispatch({
            type: 'logout'
        });
    };

    const HomeLink     = <NavbarItem label="Home" icon="fas fa-home" href="/" />;
    const ProjectsLink = <NavbarItem label="Projects" icon="fas fa-file-alt" href="/projects" />;
    const TasksLink    = <NavbarItem label="Tasks" icon="fas fa-tasks" href="/tasks" />;
    const NewTaskLink  = <NavbarItem label="New Task" icon="fas fa-tasks" stackIcon="fas fa-plus-circle fa-xs" 
                                     href="/newTask" />;
    const NewProjectLink  = <NavbarItem label="New Project" icon="fas fa-file-alt" stackIcon="fas fa-plus-circle fa-xs"
                                        href="/newProject" />;
    const MyTasksLink  = <NavbarItem label="My Tasks" icon="fa fa-user-cog" href="/myTasks" />;
    const LogoutLink   = <NavbarItem label={'Logout (' + props.user + ')'} icon="fas fa-sign-out-alt"
                                    user={props.user} clickHandler={handleLogout} href="/" />;
    const LoginLink    = <NavbarItem label="Login" icon="fas fa-sign-in-alt" href="/login" user={props.user}/>;

    return (
         <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light border">
            <ReactRouterDOM.Link className="navbar-brand" to="/">
                <span className="fa-stack fa-2x">
                  <i className="fas fa-circle fa-stack-2x"></i>
                  <i className="fa fa-tasks fa-stack-1x fa-inverse"></i>
                </span>
            </ReactRouterDOM.Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" 
                    aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
               <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav mr-auto">
                    {HomeLink}
                    {ProjectsLink}
                    {TasksLink}
                </ul>

                {
                    isLoggedIn ? (
                        <ul className="navbar-nav">
                            {isAdmin && (NewProjectLink)}
                            {isAdmin ?  (NewTaskLink) : (MyTasksLink)}
                            {LogoutLink}
                        </ul>
                    ) : 
                    (
                        <ul className="navbar-nav">
                            {LoginLink}
                        </ul>
                    )
                }
            </div>
         </nav>
    );
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

Navbar = ReactRouterDOM.withRouter(Navbar);
Navbar = ReactRedux.connect(mapStateToProps)(Navbar);