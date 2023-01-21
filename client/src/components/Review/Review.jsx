import {Slider, Typography} from "@web3uikit/core"
import { useState } from "react"
import "./Review.scss"
const Review = () => {
    const [rating, setRating] = useState(1)
    return (
        <div className="container review__container">
            <h1 className="review__heading">Review</h1>
            <Slider
            leftLabel="1"
            // markers={[
            //     '',
            //     <Typography>Starter</Typography>,
            //     <Typography>Pro</Typography>,
            //     <Typography>Business</Typography>,
            //     <Typography>Enterprise</Typography>,
            //     ''
            // ]}
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

        </div>
    )
}

export default Review