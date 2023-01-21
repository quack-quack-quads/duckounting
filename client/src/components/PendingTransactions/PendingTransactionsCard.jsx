import { Card } from "react-bootstrap";
import "./PendingTransaction.scss";

const PendingTransactionCard = (props) => {
  return (
    <Card className="pt-card d-flex flex-row alig-items-center">
      <div className="d-flex flex-column align-items-center flex-fill">
        <h4 className="invoice-id">{props.invoiceID}</h4>
        <h4 className="partner-pan">{props.partnerPAN}</h4>
      </div>
      <div className="d-flex flex-column align-items-center flex-fill">
        <h4 className="date">{props.date}</h4>
        <h4 className="mode">{props.mode}</h4>
      </div>
      <div className="d-flex flex-row justify-content-center align-items-center flex-fill">
        <h4 className="amount">{props.amount}</h4>
      </div>
    </Card>
  );
};

export default PendingTransactionCard;
