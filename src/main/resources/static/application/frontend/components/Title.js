const Title = (props) => {
    return (
        <div className="row w-100 mx-auto">
            <div className="col">
               <div className="mx-auto center-block">
                  <div className="card-body">
                     <div className="row">
                        <div className="col-12 text-center">
                           <h2>{props.title}</h2>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </div>
    );
};
