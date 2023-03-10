import "./ViewUser.scss";

const ViewUser = (props)=>{
    return <div className="ViewUser">
        <div className="row panrow">
            {props.pan}
        </div>
        <div className="row centerrow">
            <button className="btn btn-warning"
                onClick={props.handler}
            >
                View Profile
            </button>
        </div>
    </div>
}

export default ViewUser;