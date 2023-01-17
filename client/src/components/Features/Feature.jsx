import { Card, Image } from "react-bootstrap"
import im from '../../assets/images/ducklogo.png'
import './Feature.scss'

const Feature = (props) => {
    return(<div className={`${props.className}`}>
        <div className="card-outer">

        <Card className="feature-card card-inner">
            <div className="row">
                {props.img_pos=="top" && <img src={props.static_img} className="static-img col-12 col-md-6 col-lg-12"/>}
                <div className="card-body col-12 col-md-6 col-lg-12">
                    <h5 className="card-title">{props.title}</h5>
                    <p className="card-text">{props.children}</p>
                </div>
                {props.img_pos=="bot" && <img src={props.static_img} className="static-img col-12 col-md-6 col-lg-12"/>}
            </div>
        </Card>
        </div>
    </div>
    )
}

export default Feature;