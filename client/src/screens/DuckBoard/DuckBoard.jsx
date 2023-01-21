import "./DuckBoard.scss"
import ProfileCard from "../../components/Profilecard/ProfileCard"
import { Card, Illustration } from "web3uikit"
import { IpfsImage } from 'react-ipfs-image';
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddress } from "../../constants/index";
import { useEffect, useState } from "react";
import {parseBase64} from "../../utils/parseBase64ToJson";
import { AiOutlineLogout } from 'react-icons/ai'

const DuckBoard = (props) => {

    const { chainId: chainIdHex, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const invoicePlatformAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;
    const [tokenId, setTokenId] = useState(null);
    const [uri, setUri] = useState(null);
    const {
        runContractFunction: getTokenId,
    } = useWeb3Contract({
        abi: abi[chainId],
        contractAddress: invoicePlatformAddress,
        functionName: "getTokenId",
        params: {
            _pan: window.localStorage.getItem("pan") || "0x0000000000000000000000000000000000000000"   
        }
    })

    const {
        runContractFunction: tokenURI
    } = useWeb3Contract({
        abi: abi[chainId],
        contractAddress: invoicePlatformAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId
        }
    })

    const getNft = async() => {
        if(!account) return;
        setTokenId(await getTokenId());
        console.log(tokenId, "tokenId");
        const base64Uri = await tokenURI();
        console.log(base64Uri, "base64Uri");
        if(base64Uri) {
            const jsonobj = parseBase64(base64Uri);
            setUri(jsonobj.image);
        }
        console.log(uri, "uri");
    }
    
    useEffect(() => {
        getNft();
    }, [account])
    
    const nftwidget = <Card
        className='nftcard'
        description="You are rated 5 on the platform"
        onClick={() => { }}
        setIsSelected={() => {
            return false;
        }}
        title="Enterprise Duck"
        tooltipText={<span style={{ width: 200 }}>"The users who sign/reject the contracts you send them rate you out of five. Highly rated users get an NFT :"</span>}
    >
        <div>
            {
                uri ? <IpfsImage hash={uri} gatewayUrl='https://gateway.pinata.cloud/ipfs' className='img-fluid' onClick={getNft} /> 
                :
                <Illustration
                height="180px"
                logo="servers"
                width="100%"
            />
            }
        </div>
    </Card>;


    return <div className="DuckBoard">
        {/* top section in md screen onwards */}
        <div className="largescreens d-none d-md-block">
            <div className="topbanner row">
                {/* for showing credentials */}
                <div className="col-12 col-md-6 col-lg-5 credcol">
                    <div className="credbox">
                        <div className="row">
                            <div className="col-8">
                                <div className="row credrow">
                                    Duckingworth Webfeet
                                </div>
                                <div className="row credrow yellowtext">
                                    DUCKS6969D
                                </div>
                            </div>
                            <div className="col-4 centercol">
                                <button className="btn btn-sm btn-warning">
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col logoutcol">
                    <div className="logout">
                        <AiOutlineLogout color="red" size={30}
                            onClick={props.logout}
                        />
                    </div>
                </div>
            </div>
            <div className="row cardrow">
                <div className="col-md-3 col-lg-4">
                    <ProfileCard
                        image="token"
                        label="Want to send someone an invoice?"
                        button="CREATE INVOICE"
                    />
                </div>
                <div className="col-md-3 col-lg-4">
                    <ProfileCard
                        image="servers"
                        label="Want to take a look at your past invoices?"
                        button="HISTORY"
                    />
                </div>
                <div className="col d-none d-md-block d-lg-none"></div>
                <div className="col-md-5 col-lg-4 nftcardcol">
                    {nftwidget}
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
                                    Duckingworth Webfeet
                                </div>
                                <div className="row credrow yellowtext">
                                    DUCKS6969D
                                </div>
                            </div>
                            <div className="col-4 centercol">
                                <button className="btn btn-sm btn-warning">
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col logoutcol">
                        <div className="logout">
                            <AiOutlineLogout color="red" size={30}
                                onClick={logout}
                            />
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="row cardrow">
                <div className="col-6 centercol">
                    <button className="btn btn-warning profbtn">
                        CREATE INVOICE
                    </button>
                </div>
                <div className="col-6 centercol">
                    <button className="btn btn-warning profbtn">
                        PAST TRANSACTIONS
                    </button>
                </div>
            </div>
            <div className="row centercol">
                {nftwidget}
            </div>
        </div>
    </div>
}

export default DuckBoard;