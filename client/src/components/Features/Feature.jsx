import { Card, Image } from "react-bootstrap";
import im from "../../assets/images/ducklogo.png";
import "./Feature.scss";

const Feature = (props) => {
  return (
    <div className={`${props.className} card-skeleton d-flex`}>
      <div className="card-outer d-flex">
        <Card className="feature-card card-inner">
          <div className="row">
            {props.img_pos == "top" && (
              <img
                src={props.static_img}
                className="static-img col-12 col-md-6 col-lg-12"
              />
            )}
            <div className="card-body col-12 col-md-6 col-lg-12">
              <h3 className="card-title">{props.title}</h3>
              <p className="card-text">{props.children}</p>
            </div>
            {props.img_pos == "bot" && (
              <img
                src={props.static_img}
                className="static-img col-12 col-md-6 col-lg-12"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Feature;
