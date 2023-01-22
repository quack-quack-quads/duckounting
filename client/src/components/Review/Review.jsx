import { Slider } from "@web3uikit/core"
import { useState } from "react"
import "./Review.scss"
import { useWeb3Contract } from "react-moralis"
import { toast, ToastContainer } from 'react-toastify';
import {
    IconButton, Box, Input, FilledInput, OutlinedInput, InputLabel, InputAdornment,
    FormHelperText, FormControl, TextField, ThemeProvider, Select, MenuItem, Button, FormLabel,
    RadioGroup, FormControlLabel, Radio, Grid
} from "@mui/material";
import { createTheme } from "@mui/material";
import Rating from '@mui/material/Rating';
import "react-toastify/dist/ReactToastify.css";
import stamp from '../../assets/images/stamp.png'
import Modal from 'react-bootstrap/Modal';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        black: {
            main: '#000000'

        },
        yellow: {
            main: '#efd00b !important'
        }
    }
})

const Review = ({
    sellerPan,
    contractAbi,
    invoicePlatformAddress,
    showModal,
    setshowModal
}) => {
    const [review, setReview] = useState("")
    const [rating, setValue] = useState(1);
    const { runContractFunction: addRating } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "addRating",
        params: {
            _sellerPAN: sellerPan,
            _rating: rating,
        }
    })
    console.log("at review", showModal);
    const handleReviewChange = (event) => {
        setReview(event.target.value);
    }

    const handleSuccess = () => {
        console.log("success");
        toast.success("Added Rating!", {
            position: toast.POSITION.TOP_CENTER,
        });
    }

    const handleRating = async () => {
        console.log(invoicePlatformAddress, contractAbi, sellerPan, rating)
        await addRating({
            onSuccess: handleSuccess,
            onError: (error) => {
                console.log("error", error);
                toast.error("Error, cannot submit the review!", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        });
    }


    return (
        <div className="Rating">

            <div className="container review__container">
                <ThemeProvider theme={darkTheme}>
                    <Modal
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={showModal}
                        onHide={() => setshowModal(false)}
                        className="review-modal1"

                    >
                        <ToastContainer theme="dark" />
                        <Modal.Header closeButton className="modal-head row4 d-flex justify-content-center">
                            <div className="container">
                                <div className="row ">
                                    <div className="col d-flex justify-content-center mod-tit">
                                        FeedBack
                                    </div>
                                </div>
                            </div>
                        </Modal.Header>
                        <div className="mod-body" >
                            <Modal.Body className="review-modal">
                                <div className="container review-modal">

                                </div>
                                <div className="row row1">
                                    <div className="col d-flex justify-content-center">
                                        <img src={stamp}></img>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12 d-flex justify-content-center">
                                        <h1 className="seller-name">{sellerPan}</h1>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 d-flex justify-content-center">
                                        <Rating
                                            name="simple-controlled"
                                            value={rating}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                            size="large"
                                            className="rating-stars"
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3 ">
                                    <div className="col d-flex justify-content-center ">
                                        <textarea type="email" class="form-control review-field" id="review" aria-describedby="emailHelp" placeholder="Enter Review" onChange={handleReviewChange} />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col d-flex justify-content-center">
                                        <button type="button" class="btn btn-warning sub" onClick={handleRating}>Submit</button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </div>

                    </Modal>

                </ThemeProvider>

            </div>
        </div>
    )
}

export default Review