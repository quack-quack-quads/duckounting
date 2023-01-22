import './InvoiceDisplay.scss'
import stamp from '../../assets/images/stamp.png'
import { AiOutlineWallet } from 'react-icons/ai'
import { AiOutlineNumber } from 'react-icons/ai'
import { FaFileInvoice } from 'react-icons/fa'
import Ducklogo from '../../assets/images/ducklogo.png'
import { IpfsImage } from 'react-ipfs-image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

const InvoiceDisplay = (props) => {
    const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'];
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    var amtDue = parseFloat(props.amt) * parseFloat(props.months);
    const delta = 1e-6;
    var transactionWidget;

    const paynow = ()=>{
        
    }

    if (Math.abs(amtDue) <= delta) {
        transactionWidget =
            <>
                <div className="paid">
                    PAID
                </div>
                <div className="helpertext">
                    Yay!! Transaction successfully concluded.
                </div>
            </>
    } else {
        transactionWidget =
            <>
                <div className="pending"
                    onClick={
                        paynow
                    }
                >
                    PAY NOW
                </div>
                <div className="helpertext">
                    Some payments are pending.
                </div>
            </>
    }


    return <div className="InvoiceDisplay">
        <div className="row typerow">
            <div className="typetext">
                {props.transactionType}
            </div>
            <div className="date">
                {props.date}
            </div>
        </div>
        <div className="row typerow">
            <div className='idlabel'>
                Invoice ID &nbsp;
                {/* <AiOutlineNumber size={25}/>  */}
                <FaFileInvoice size={22}></FaFileInvoice>
            </div>
            <div className="idtext">
                {props.invoiceId}
            </div>
        </div>
        <div className="row typerow">
            <div className='idlabel'>
                Recipient Add. &nbsp;
                <AiOutlineWallet className="labelIcon" size={25} />
            </div>
            <div className="idtext">
                {props.walletAddress}
            </div>
        </div>
        <div className="row typerow">
            <div className="buyer">
                <span className='buyerlabel'>BUYER PAN</span>
                <br />
                <span className='buyerinfo'>{props.buyerPan}</span>
            </div>
            <div className="seller">
                <span className='buyerlabel'>SELLER PAN</span>
                <br />
                <span className='buyerinfo'>{props.sellerPan}</span>
            </div>
            <div className="typerow">
                <div className="amt">
                    {props.amt}
                    <br />
                    <span className='amtlabel'>INR per month</span>
                </div>
                <div className="number">
                    {props.months}
                    <br />
                    <span className='amtlabel'>Months left</span>
                </div>
            </div>
            <div className="line"></div>
            <div className="row">
                <div className="total">
                    {amtDue} &nbsp;
                    <span className='due'>INR DUE</span>
                </div>
            </div>
            <div className="typerow">
                {transactionWidget}
            </div>
        </div>
        <div className="row imgrow">
            <div className="col-12 col-md-7 d-flex justify-content-center align-items-center">
                    <div className="proofdiv">
                        <IpfsImage hash={props.proof} gatewayUrl='https://gateway.pinata.cloud/ipfs' className='proofimg' 
                        onClick={handleShow}
                        />
                    </div>
            </div>
            <div className="col-12 col-md-5 d-flex justify-content-center align-items-center">
                <img src={stamp} alt="" className="logo" />
            </div>
        </div>
        <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => setShow(false)}
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
            <div className="d-flex justify-content-center ipfs-img-container">
                <IpfsImage hash={props.proof} gatewayUrl='https://gateway.pinata.cloud/ipfs' className='img-fluid' />
            </div>
        </Modal.Body>   
        </Modal>
    </div>
}

export default InvoiceDisplay;