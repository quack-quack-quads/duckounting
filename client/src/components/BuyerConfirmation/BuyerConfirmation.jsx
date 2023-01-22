import './BuyerConfirmation.scss'

const BuyerConfirmation = (props) => {
    return <div className="BuyerConfirmation row">
        <div className="col-6">
            <div className="row">
                <button className="btn btn-success">
                    {props.paid ? "ACCEPT" : "PAY"}
                </button>
            </div>
            <div className="row textrow">
                You attest to the validity of the invoice and {props.paid ? "to the fact that you have paid" :"agree to pay"} the required amount. You agree to put the invoice on the blockchain foreover.
            </div>
        </div>
        <div className="col-6">
            <div className="row">
                <button className="btn btn-danger">
                    REJECT
                </button>
            </div>
            <div className="row textrow">
                You do not believe that the details on the invoice are correct and you wish to prevent the invoice from going on the blockchain.
            </div>
        </div>
    </div>
}

export default BuyerConfirmation;