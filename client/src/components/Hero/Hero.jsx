import './Hero.scss'
import Spline from '@splinetool/react-spline';

const Hero = () => {
    return(
        <div className="row hero">
            <div className="col-6">
                <h1 className='hero-title'>Welcome to <span className='hero-title-accent'>Duckounting</span>!</h1>
                <p className='hero-text'>A simple and easy to use de-centralised invoice management system. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa voluptatum reiciendis sequi at eius est aliquid aspernatur eos numquam quod?</p>
            </div>
            <div className="col-6">
                <Spline scene="https://draft.spline.design/8FkFbFeiUjJijnCZ/scene.splinecode" />
            </div>
        </div>
    )
}

export default Hero;