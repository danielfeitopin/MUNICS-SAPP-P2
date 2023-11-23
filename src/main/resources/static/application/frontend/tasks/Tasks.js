var Tasks= (props) => {
    return (
        <div className="container">
            <Title title={props.title ? props.title : 'Tasks'}></Title>
            {
                <TasksTable owner={props.owner} token={props.token} history={props.history}></TasksTable>
            }
        </div>
    );
};

Tasks = ReactRedux.connect()(Tasks);

