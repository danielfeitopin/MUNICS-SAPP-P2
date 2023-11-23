const NavbarItem = (props) => {
    return (
        <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <ReactRouterDOM.Link className="nav-link" to={props.href} onClick={props.clickHandler}>
                {
                    props.stackIcon ? (
                        <span>
                          <i className={props.icon}></i>
                          <i className={props.stackIcon}></i>
                        </span>                    
                    ) : (
                        <span className={props.icon}></span>
                    )
                }
                
                <div>{props.label}</div>
            </ReactRouterDOM.Link>
        </li>);
};


