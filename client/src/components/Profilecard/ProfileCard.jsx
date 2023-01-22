import "./ProfileCard.scss"
import { Illustration, IllustrationProps } from "web3uikit";

const ProfileCard = (props)=>{
    return <div className="ProfileCard">
        <div className="row">
            <div className="col-6">
                <Illustration 
                logo={props.image} 
                className="illustration"
                width={150}
                height={150}
                />
            </div>
            <div className="col-5">
                <div className="row labelrow">
                    {props.label}
                </div>
                <div className="row">
                    <button className="btn btn-warning profilebtn"
                    onClick={props.handler}
                    >
                        {props.button}
                    </button>
                </div>
            </div>
        </div>
    </div>
};

export default ProfileCard;