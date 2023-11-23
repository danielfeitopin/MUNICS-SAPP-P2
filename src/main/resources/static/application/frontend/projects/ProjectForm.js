class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name ? this.props.name : '',
            description: this.props.description ? this.props.description : ''
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        const $target = $(e.target);
        const name = $target.attr('name');
        this.setState({
            [name]: $target.val()
        });
    }
    render() {
        return (
            <form className="form-horizontal ui-helper-margin-top ui-helper-margin-bottom" id="project-form">
                <div className="form-group row ui-helper-margin-top">
                    <label htmlFor="name" className="col-3 text-right input-label-middle">
                        Name
                    </label>
                    <div className="input-group col-7 col-sm-7">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fas fa-list-ol"></i></span>
                        </div>
                        <input type="text" className="form-control" id="name" name="name" placeholder="Project Name"
                            value={this.state.name} onChange={this.handleChange}
                            data-validation="length alphanumeric"
                            data-validation-allowing=" _"
                            data-validation-length="min4"
                            data-validation-error-msg-container="#input-name-error"
                            data-validation-error-msg="Project name must be alphanumeric with at least 4 characters length!"/>
                    </div>
                </div>
                <div className="form-group row d-none">
                   <div className="col-3"></div>
                   <div className="col-9 text-left" id="input-name-error"></div>
                </div>
                <div className="form-group row">
                    <label htmlFor="address" className="col-3 text-right">
                        Description
                    </label>
                    <div className="input-group col-7 col-sm-7">
                        <textarea className="form-control" id="description" name="description" rows="3"
                                  value={this.state.description} onChange={this.handleChange}>
                        </textarea>
                    </div>
                </div>
                <div className="form-row text-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-primary" onClick={this.props.handleClick}>
                            {this.props.action}
                        </button>
                   </div>
                </div>
            </form>
        );
    }
};

