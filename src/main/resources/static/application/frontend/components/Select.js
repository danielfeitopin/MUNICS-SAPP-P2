class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            options: []
        };
    }
    componentDidMount() {
        var onSuccess = (data) => {
            this.setState({
                loading: false,
                options: data ? data : []
            });
            this.props.handleOnload(data);
        };
        var onError = () => {
            this.props.handleOnload();
        };
        this.props.callback({
            token: this.props.token
        }, onSuccess.bind(this), onError.bind(this));
    }
    render() {
        const options = this.state.options.map(function(json){
            return (<option value={json[this.props.optionValue]} key={json[this.props.optionValue]}>
                    {json[this.props.optionLabel]}
                </option>);
        }.bind(this));
        return (
            <div className="form-group row align-items-center">
                <label className="col-3 text-right input-label-middle">
                    {this.props.label}
                </label>
                <div className="input-group col-7 col-sm-7">
                    <select name={this.props.name} id={this.props.name} value={this.props.value} 
                            onChange={this.props.handleChange} className="form-control">
                        { this.state.loading ? (null) : (options) }
                    </select>
                </div>
                <div className="col-2 col-sm-0">
                    {
                        this.state.loading ? 
                        (<span className="align-middle"><i className="fa fa-spinner fa-spin fa-2x"></i></span>) : (null)
                    }
                </div>
            </div>
        );
    }
};

