const Error = (props) => {
    return (
        <div className="row w-100 mx-auto">
            <div className="col">
               <div className="alert alert-danger text-center">
                  <span>{props.message}</span>
               </div>               
            </div>
        </div>
    );
};
