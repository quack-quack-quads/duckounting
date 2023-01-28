import "./OtherBoard.scss";
import ProfileCard from "../../components/Profilecard/ProfileCard";
import { Card, Illustration } from "web3uikit";
import { IpfsImage } from "react-ipfs-image";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { parseBase64 } from "../../utils/parseBase64ToJson";
import { AiOutlineLogout, AiOutlineWallet } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import { ConstructionOutlined } from "@mui/icons-material";
import Footer from "../../components/Footer/Footer";
import { Modal, Button } from "react-bootstrap";




const OtherBoard = ({
    account,
    logout,
    invoicePlatformAddress,
    contractAbi,
}) => {
    const name = localStorage.getItem("name");
    const pan = localStorage.getItem("pan");
    const address = "0x9bAfce2A8dc304546827b7f74cf623b15272C416";

    const [tokenId, setTokenId] = useState(null);
    const [uri, setUri] = useState(null);
    const [duckIndex, setDuckIndex] = useState(0.7);
    const [rating, setRating] = useState("4");
    const { runContractFunction: getTokenId } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "getTokenId",
        params: {
            _pan:
                window.localStorage.getItem("pan") ||
                "0x0000000000000000000000000000000000000000",
        },
    });

    const { runContractFunction: tokenURI } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    const { runContractFunction: getPersonDetails } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "getPerson",
        params: {
            PAN: window.localStorage.getItem("pan"),
        },
    });

    const retrieveDetails = async () => {
        const tokenid = await getTokenId();
        setTokenId(tokenid);
        const person = await getPersonDetails();
        console.log(person);
        setRating(person.rating.toString());
    };

    const getNft = async () => {
        // sleep for 2 seconds
        await new Promise((r) => setTimeout(r, 2000));
        let uri_ = await tokenURI();
        if (uri_ !== undefined) {
            uri_ = parseBase64(uri_.toString());
            uri_ = uri_.image;
            setUri(uri_);
        }
        // console.log(tokenId.toString(), uri_);
    };

    const ratingmap = {
        5: "Enterprise",
        4: "Exquisite",
        3: "Exquisite",
        2: "Normie",
        1: "Normie",
    };
    useEffect(() => {
        retrieveDetails();
    }, [invoicePlatformAddress]);

    useEffect(() => {
        getNft();
    }, [tokenId]);



    const navigate = useNavigate();

    const nftwidget = (
        <Card
            className="nftcard"
            description={name.split(" ")[0] + " is rated " + rating + " on the platform"}
            onClick={() => { }}
            setIsSelected={() => {
                return false;
            }}
            title={ratingmap[rating] + " Duck"}
            tooltipText={
                <span style={{ width: 60 }}>
                    "The users who sign/reject the contracts you send them rate you out of
                    five. Highly rated users get an NFT :)"
                </span>
            }
        >
            <div>
                {uri ? (
                    <IpfsImage
                        hash={uri}
                        gatewayUrl="https://gateway.pinata.cloud/ipfs"
                        className="nftimage"
                    />
                ) : (
                    // CENTER THE SPINNER
                    <div className="row justify-content-center">
                        <div className="spinner-border text-warning" role="status"></div>
                    </div>
                )}
            </div>
        </Card>
    );

    const WalletAddress = () => {
        return <div className="walletdeets">
            <div className="row centercol addresstitle">
                <span>Wallet Address <AiOutlineWallet /></span>
            </div>
            <div className="row centercol walletaddress">
                <div className="addtext">
                    {address}
                </div>
            </div>
            <div className="row centercol copybtn">
                <button className="btn btn-warning"
                    onClick={
                        () => {
                            navigator.clipboard.writeText(address);
                        }
                    }
                >
                    Copy
                </button>
            </div>
        </div>
    }

    return (
        <div className="OtherBoard">
            {/* top section in md screen onwards */}
            <div className="largescreens d-none d-md-block">
                <div className="topbanner row">
                    {/* for showing credentials */}
                    <div className="col-12 col-md-6 col-lg-5 credcol">
                        <div className="credbox">
                            <div className="row">
                                <div className="col-8">
                                    <div className="row credrow">
                                        {name}
                                    </div>
                                    <div className="row credrow yellowtext">
                                        {pan}
                                    </div>
                                </div>
                                <div className="col-4 centercol logoutcol">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col logoutcol"></div>
                </div>
                <div className="row cardrow">
                    <div className="col-md-3 col-lg-4">
                        <ProfileCard
                            image="token"
                            label={"Want to send " + name.split(" ")[0] + " an invoice?"}
                            button="CREATE INVOICE"
                            handler={() => {
                                navigate("/createInvoice");
                            }}
                        />
                    </div>
                    <div className="col-md-4 centercol">
                        <WalletAddress />
                    </div>
                    <div className="col-md-5 col-lg-4 nftcardcol">
                        <div className="wrapperdiv">
                            <div className="row">{nftwidget}</div>
                            <div className="row">
                                <img
                                    src="../assets/images/duck.png"
                                    alt=""
                                    className="ducklogo"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="smallscreens d-block d-md-none">
                <div className="topbanner">
                    {/* for showing credentials */}
                    <div className="row centercol">
                        <div className="credbox">
                            <div className="row">
                                <div className="col-8">
                                    <div className="row credrow">
                                        {name}
                                    </div>
                                    <div className="row credrow yellowtext">
                                        {pan}
                                    </div>
                                </div>
                                <div className="col-4 centercol logoutcol">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row cardrow">
                    <div className="col-12 centercol">
                        <WalletAddress />
                    </div>
                </div>
                <div className="row centercol">{nftwidget}</div>
                <div className="row centercol">
                    <button
                        className="btn btn-warning profbtn"
                        onClick={() => {
                            console.log("btn click");
                            navigate("/createInvoice");
                        }}
                    >
                        {"Send " + name.split(" ")[0] + " an Invoice"}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OtherBoard;
