import './LearnPanel.scss'
import con from '../../assets/images/confused.png'

const LearnPanel = () => {
    return(
        <div className="learnpanel container">
            <div className="line"></div>
            <div className="row">
                <h3 className="col-12 col-md-8 learn-header">How will Web3 help you improve your invoice management?</h3>
                <img className='col-4 offset-4 d-md-none d-flex learn-image' src={con}/>
                <div className="col-12 col-md-8">
                    <ul className='d-flex flex-column learn-points justify-content-between'>
                        <li className='flex-fill'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio, ratione?</li>
                        <li className='flex-fill'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio, ratione?</li>
                        <li className='flex-fill'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio, ratione?</li>
                        <li className='flex-fill'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio, ratione?</li>
                    </ul>
                </div>
                <div className="col-4">
                    <img className='d-none d-md-block learn-image' src={con}/>
                </div>
            </div>
        </div>
    )
}

export default LearnPanel;