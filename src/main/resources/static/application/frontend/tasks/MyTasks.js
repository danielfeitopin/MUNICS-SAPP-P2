var MyTasks = (props) => {
    if(!props.user) {
        return (<ReactRouterDOM.Redirect to="/login"/>);
    }
    return (
        <Tasks title="My Tasks" owner={props.user} token={props.token} 
               history={props.history}></Tasks>
    );
};

var mapStateToProps = (state) => {
    return getUserInfo(state);
};

MyTasks = ReactRedux.connect(mapStateToProps)(MyTasks);