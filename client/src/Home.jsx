import Hero from "./components/Hero/Hero"
import Features from "./components/Features/Features"
import LearnPanel from "./components/LearnPanel/LearnPanel"
import Review from "./components/Review/Review"
const Home = ({contractAbi,invoicePlatformAddress }) => {
    return (
        <div>
            <Hero />
            <Features />
            <LearnPanel />
            <Review sellerPan={"rohitPan"} contractAbi={contractAbi} invoicePlatformAddress={invoicePlatformAddress}/>
        </div>
    )
}

export default Home