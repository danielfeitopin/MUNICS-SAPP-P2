class Confirm extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        $('.modal').modal('show');
    }
    render() {
        if(!this.props.show) {
            return null;
        }
        return (
            <div className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                   <div className="modal-content">
                      <div className="modal-header">
                         <h5 className="modal-title">Confirm</h5>
                         <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                         </button>
                      </div>
                      <div className="modal-body">
                         <p>{this.props.message}</p>
                      </div>
                      <div className="modal-footer">
                         <button type="button" className="btn btn-danger" href={this.props.data}
                                 onClick={this.props.clickHandler} data-dismiss="modal">Yes</button>
                         <button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
                      </div>
                   </div>
                </div>
             </div>
        );
    }
};


