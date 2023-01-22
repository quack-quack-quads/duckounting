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
              📝 Tamper-proof and transparent ledger for recording transactions
            </li>
            <li className="flex-fill">🔐 Increased trust and efficiency in the invoice process</li>
            <li className="flex-fill">
              🔍 Easily track the status of invoices
            </li>
            <li className="flex-fill">
                🤖 Smart contracts help fasten the invoice process
            </li>
            <li className="flex-fill">
              🚀 Streamline and secure the invoice management process 
            </li>
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
