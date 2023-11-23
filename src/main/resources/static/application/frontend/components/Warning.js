const Warning = (props) => {
    return (
        <div className="row w-100 mx-auto">
            <div className="col">
               <div className="alert alert-warning text-center">
                  <span>{props.message}</span>
               </div>               
            </div>
        </div>
    );
};

