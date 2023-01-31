import './InvoiceDisplay.scss'
import stamp from '../../assets/images/stamp.png'
import { AiOutlineWallet } from 'react-icons/ai'
import { AiOutlineNumber } from 'react-icons/ai'
import { FaEthereum, FaFileInvoice } from 'react-icons/fa'
import Ducklogo from '../../assets/images/ducklogo.png'
import { IpfsImage } from 'react-ipfs-image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import Review from '../Review/Review'
import { abi, contractAddress } from "../../constants/index";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { toast } from 'react-toastify'
import { ethers } from "ethers";
import { Dropdown } from 'react-bootstrap'
import ViewUser from '../ViewUser/ViewUser'
import { useNavigate } from 'react-router-dom'

const InvoiceDisplay = (props) => {
    const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'];
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [contractAbi, setContractAbi] = useState(null);
    const [invoicePlatformAddress, setInvoicePlatformAddress] = useState("");
    const { chainId: chainIdHex } = useMoralis();
    const [chainId, setChainId] = useState(parseInt(chainIdHex));

    const handleShow = () => setShow(true);
    var amtDue = parseFloat(props.amt) * parseFloat(props.months);
    const delta = 1e-6;
    var transactionWidget;

    const { runContractFunction: pay } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "pay",
        params: {
            _sellerAddress: props.walletAddress,
            _buyerPan: props.buyerPan,
            _sellerPan: props.sellerPan,
            _id: props.invoiceId
        },
        msgValue: ethers.utils.parseEther(props.amt.split(" ")[0])
    });

    const getContractDetails = () => {
        try {
            setInvoicePlatformAddress(contractAddress[parseInt(chainIdHex)][0]);
            setContractAbi(abi[parseInt(chainIdHex)]);
        } catch (err) { }
    };

    const paynow = async () => {
        await pay({
            onSuccess: () => {
                setSuccess(true);
                toast.success("Sucessfully Paid", { position: toast.POSITION.TOP_CENTER });
            },
            onError: (err) => {
                setSuccess(false);
                toast.error("Payment Failed", { position: toast.POSITION.TOP_CENTER });
            },
        });
        if (success) {
            setShowModal(true);
        }

    }
    console.log("at invoice display : ", success);
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
                {
                    props.sellerPan !== localStorage.getItem("pan") ?
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

                        :
                        <>
                            <div className="pending">
                                UNPAID
                            </div>
                            <div className="helpertext">
                                Some payments are pending.
                            </div>
                        </>
                }
            </>
    }

    useEffect(() => {
        setChainId(parseInt(chainIdHex));
        getContractDetails();
    }, [chainIdHex]);

    const navigate = useNavigate();

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
                Seller Add. &nbsp;
                <AiOutlineWallet className="labelIcon" size={25} />
            </div>
            <div className="idtext">
                {props.walletAddress}
            </div>
        </div>
        <div className="row typerow">
            <div className="buyer">
                <Dropdown>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic" className="e-caret-hide">
                        <span className='buyerlabel'>BUYER PAN</span>
                        <br />
                        <span className='buyerinfo'>{props.buyerPan}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <ViewUser
                            pan={props.buyerPan}
                            handler={
                                () => {
                                    if (props.buyerPan === localStorage.getItem("pan")) {
                                        navigate("/duckboard");
                                    } else {
                                        navigate(
                                            "/otherboard",
                                            {
                                                state : {
                                                    pan: props.buyerPan
                                                }
                                            }

                                        );
                                    }
                                }
                            }
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* <div className="buyer">
                <span className='buyerlabel'>BUYER PAN</span>
                <br />
                <span className='buyerinfo'>{props.buyerPan}</span>
            </div> */}
            <div className="seller">
                <Dropdown>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic" className="e-caret-hide">
                        <span className='buyerlabel'>SELLER PAN</span>
                        <br />
                        <span className='buyerinfo'>
                            {props.sellerPan}
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <ViewUser
                            pan={props.sellerPan}
                            handler={
                                () => {
                                    if (props.sellerPan === localStorage.getItem("pan")) {
                                        navigate("/duckboard");
                                    } else {
                                        navigate(
                                            "/otherboard",
                                            {
                                                state: {
                                                    pan: props.sellerPan
                                                }
                                            }

                                        );
                                    }
                                }
                            }
                        />
                    </Dropdown.Menu>
                </Dropdown>
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
                    Invoice Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
                <div className="d-flex justify-content-center ipfs-img-container">
                    <IpfsImage hash={props.proof} gatewayUrl='https://gateway.pinata.cloud/ipfs' className='img-fluid' />
                </div>
            </Modal.Body>
        </Modal>
        {success === true ? <Review sellerPan={"rohitPan"} contractAbi={contractAbi} invoicePlatformAddress={invoicePlatformAddress}
            showModal={showModal} setshowModal={setShowModal} /> : null}
    </div>
}

export default InvoiceDisplay;