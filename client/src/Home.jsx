import Hero from "./components/Hero/Hero"
import Features from "./components/Features/Features"
import LearnPanel from "./components/LearnPanel/LearnPanel"
import InvoiceDisplay from "./components/InvoiceDisplay/InvoiceDisplay"
const Home = () => {
    return (
        <div>
            <InvoiceDisplay/>
            <Hero />
            <Features />
            <LearnPanel />
        </div>
    )
}

export default Home