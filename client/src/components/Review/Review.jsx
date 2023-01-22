import {Slider} from "@web3uikit/core"
import { useState } from "react"
import "./Review.scss"
import {useWeb3Contract} from "react-moralis"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const Review = ({
    sellerPan,
    contractAbi,
    invoicePlatformAddress
}) => {
    const [rating, setRating] = useState(1)
    const [review, setReview] = useState("")
    const {runContractFunction: addRating} = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "addRating",
        params: {
            _sellerPAN: sellerPan,
            _rating: 3,
        }     
    })

    const handleSuccess = () => {
        console.log("success");
        toast.success("Added Rating!", {
        position: toast.POSITION.TOP_CENTER,
        });
    }
    
    const handleRating = async () => {
        console.log(invoicePlatformAddress,contractAbi, sellerPan, rating)
        await addRating({
            onSuccess: handleSuccess,
            onError: (error) => {
                console.log("error", error);
                toast.error("Error in Registration!", {
                position: toast.POSITION.TOP_CENTER,
                });
            }
        });
    }

    return (
    <div className="Rating">
        <ToastContainer theme="dark" />
        <div className="container review__container">
            <h1 className="review__heading">Review</h1>
            <Slider
            leftLabel="1"
            max={5}
            min={1}
            onChange={(value) => {
                setRating(value)
            }}  
            rangeControllerPrefix=""
            rightLabel="5"
            step={1}
            value={rating}
            />
            <input type="text" value={
                sellerPan
            }/>
            <label htmlFor="review">Enter Review</label>
            <textarea onChange={(event) => {
                setReview(event.target.value)
            }}
            id="review"
            />
            <button onClick={handleRating}>Add Rating</button>
        </div>
    </div>
    )
}

export default Review