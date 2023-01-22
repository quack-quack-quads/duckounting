import Hero from "./components/Hero/Hero"
import Features from "./components/Features/Features"
import LearnPanel from "./components/LearnPanel/LearnPanel"
import Review from "./components/Review/Review"
import Footer from "./components/Footer/Footer"
const Home = ({ contractAbi, invoicePlatformAddress }) => {
    return (
        <div>
            <Hero />
            <Features />
            <LearnPanel />
            {/* <Review sellerPan={"rohitPan"} contractAbi={contractAbi} invoicePlatformAddress={invoicePlatformAddress} /> */}
            <Footer />
        </div>
    )
}

export default Home