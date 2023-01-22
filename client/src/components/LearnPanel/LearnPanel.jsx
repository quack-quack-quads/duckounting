import "./LearnPanel.scss";
import con from "../../assets/images/user.png";

const LearnPanel = () => {
  return (
    <div className="learnpanel container">
      <div className="line"></div>
      <div className="row">
        <h3 className="col-12 col-md-8 learn-header">
          How will Web3 help you improve your invoice management?
        </h3>
        <img
          className="col-4 offset-4 d-md-none d-flex learn-image"
          src={con}
        />
        <div className="col-12 col-md-8">
          <ul className="d-flex flex-column learn-points justify-content-between">
            <li className="flex-fill">
              Having your invoices stored on the chain would ensure transparency
              to the maximum degree
            </li>
            <li className="flex-fill">You save money (not real)</li>
            <li className="flex-fill">
              Blockchain is what the cool kids use nowadays
            </li>
            <li className="flex-fill">You might get sex</li>
          </ul>
        </div>
        <div className="col-4">
          <img className="d-none d-md-block learn-image" src={con} />
        </div>
      </div>
    </div>
  );
};

export default LearnPanel;
