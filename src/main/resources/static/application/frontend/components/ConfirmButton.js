class ConfirmButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirm: false
        };
        this.confirm = this.confirm.bind(this);
    }
    confirm() {
        this.setState({
            confirm: true
        });
    }
    render() {
        return (
            <div className="d-inline">
                <button className="btn btn-sm btn-danger" type="button" onClick={this.confirm}>
                    <i className={this.props.icon}></i>{this.props.label ? '\u00A0' : ''}
                    {this.props.label}
                </button>
                <Confirm show={this.state.confirm} message={this.props.message} 
                         clickHandler={this.props.clickHandler} data={this.props.data}/>
            </div>
        );
    }
};
