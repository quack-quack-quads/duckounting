import "./OtherBoard.scss";
import ProfileCard from "../../components/Profilecard/ProfileCard";
import { Card, Illustration } from "web3uikit";
import { IpfsImage } from "react-ipfs-image";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { parseBase64 } from "../../utils/parseBase64ToJson";
import { AiOutlineLogout, AiOutlineSearch, AiOutlineWallet } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import { ConstructionOutlined, Foundation } from "@mui/icons-material";
import Footer from "../../components/Footer/Footer";
import NotFoundImage from "../../assets/backgrounds/notfound.png"
import SearchingImage from "../../assets/backgrounds/searching.png"
import { useEnsName } from 'react-moralis'




const OtherBoard = ({
    account,
    logout,
    invoicePlatformAddress,
    contractAbi,
}) => {
    const location = useLocation();
    useEffect(()=>{
        if(location.state != null && location.state != undefined && pan === ""){
            setPan(location.state.pan);
        }    
    },[]);

    const [name, setName] = useState("");
    const [pan, setPan] = useState("");
    const [toSearch, setToSearch] = useState("");

    const { address: foundAddress } = useEnsName(toSearch);
    const [address, setAddress] = useState("");

    const [tokenId, setTokenId] = useState(null);
    const [uri, setUri] = useState(null);
    const [duckIndex, setDuckIndex] = useState(0.7);
    const [rating, setRating] = useState("4");

    const changeAddress = (_address) => {
        return new Promise((res, rej) => {
            setAddress(_address, () => res());
        })
    }

    const changePan = (_pan) => {

    }

    const changeUri = (_uri) => {

    }

    const { runContractFunction: getTokenId } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "getTokenId",
        params: {
            _pan: pan || "0x0000000000000000000000000000000000000000000000000000000000000000",
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
            PAN: pan,
        },
    });

    const { runContractFunction: getPersonPAN } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "getPersonPAN",
        params: {
            _addr: address,
        }
    })

    const retrieveTokenId = async () => {
        const tokenid = await getTokenId();
        // console.log("tokenId", tokenid.toString());
        setTokenId(tokenid.toString())
    }

    const retrievePersonPan = async () => {
        await getPersonPAN().then(async (foundpan) => {
            setPan(foundpan)
            // console.log("foundPan",foundpan)
        }).catch(err => {
            // console.log(err);
            setDefaults();
            setMode(<NotFound />)
        })
    }

    const retrieveDetails = async () => {
        // console.log("pan before getPersonDetails", pan);
        await getPersonDetails().then(person => {
            setRating(person.rating.toString());
            setAddress(person.addr);
            setName(person.name);
        })
            .catch(err => {
                // console.log(err);
                setDefaults();
                setMode(<NotFound />)
            })
        // console.log(person);
        await getNft();
    };

    const getNft = async () => {
        // sleep for 2 seconds
        await new Promise((r) => setTimeout(r, 2000));
        let uri_ = await tokenURI();
        if (uri_ !== undefined) {
            uri_ = parseBase64(uri_.toString());
            uri_ = uri_.image;
            // console.log("found nft by you",uri_);
            setUri(uri_)
        }
    };

    const setDefaults = () => {
        setAddress("")
        setUri(null)
        setPan("")
        setTokenId(null)
    }

    const ratingmap = {
        5: "Enterprise",
        4: "Exquisite",
        3: "Exquisite",
        2: "Normie",
        1: "Normie",
    };

    useEffect(() => {
        if (pan != "") {
            // console.log("pan changed");
            retrieveTokenId();
        }
    }, [pan])

    useEffect(() => {
        if (pan != "" && tokenId != null) {
            retrieveDetails();
        }
    }, [tokenId, pan])

    useEffect(() => {
        if (address != "") {
            // console.log("address changed");
            retrievePersonPan();
        }
    }, [address])

    useEffect(() => {
        if (uri !== null && uri !== undefined) {
            setMode(<OtherProfile />)
        }
    }, [uri])

    const searchForPerson = async () => {
        // if toSearch is a valid address
        if (toSearch === pan || toSearch === address) {
            return;
        }
        setMode(<Searching />)
        // console.log("clicked me", toSearch)
        if (toSearch.length === 42 && toSearch.includes("0x")) {
            // ! wallet address provided
            // console.log("enteredAddr",toSearch, address)
            setAddress(toSearch)
        } else if (toSearch.includes(".eth")) {
            // ! ENS name provided
            // console.log("foundAddress",foundAddress)
            setAddress(foundAddress);
        } else {
            // ! pan is provided
            // console.log("IN PAN MODE", toSearch)
            setPan(toSearch);
        }
    }

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

    const OtherProfile = () => {
        return <>
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
                            // console.log("btn click");
                            navigate("/createInvoice");
                        }}
                    >
                        {"Send " + name.split(" ")[0] + " an Invoice"}
                    </button>
                </div>
            </div>
        </>
    }
    const NotFound = () => {
        return <>
            <div className="row centercol">
                <img src={NotFoundImage} alt="" className="searchimage" />
            </div>
            <div className="row centercol messagerow">
                Sorry. No such user found.
            </div>
        </>
    }
    const Searching = () => {
        return <>
            <div className="row centercol">
                <img src={SearchingImage} alt="" className="searchimage" />
            </div>
            <div className="row centercol messagerow">
                Enter the keywords to lookup user.
            </div>
        </>
    }

    const [mode, setMode] = useState(<Searching/>);
    // <NotFound/>, <Searching/>, <OtherProfile/>

    return (
        <div className="OtherBoard">
            {/* search */}
            <div className="row searchtitle">
                Look up using ENS / Address / UserPAN !
            </div>
            <div className="row searchbar">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Address / ENS / PAN" aria-label="search field" onChange={(event) => {
                        setToSearch(event.target.value);
                    }} />
                    <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2">
                            &nbsp;&nbsp;<AiOutlineSearch size={30} onClick={
                                // ()=>{
                                //     changeAddress("dkjfdjfoejreri")
                                // }
                                searchForPerson
                            }
                                className="searchicon"
                            />&nbsp;&nbsp;
                        </span>
                    </div>
                </div>
            </div>

            {mode}
            <Footer />
        </div>
    );
};

export default OtherBoard;
