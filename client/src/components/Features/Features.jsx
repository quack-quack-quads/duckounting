import './Features.scss'
import Feature from './Feature';
import lcpng from '../../assets/images/litecoin.png'
import fipng from '../../assets/images/file.png'
import smpng from '../../assets/images/speedometer.png'
import nftpng from '../../assets/images/card.png'



const Features = () => {
    return(
        <div className="features">
            <div className="line"></div>
            <h1 className="features-heading">Explore the amazing features of decentralization with Duckounting</h1>
            <div className="d-flex flex-column flex-lg-row">
                <Feature className="align-self-stretch col-12 col-lg-3" static_img={lcpng} img_pos="top" title="Ethereum payment gateway">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus obcaecati dolores magni recusandae quis. Aspernatur a voluptate debitis. Consectetur, voluptatibus! </Feature>
                <Feature className="align-self-stretch col-12 col-lg-3" static_img={fipng} img_pos="bot" title="Hassle-free recurring payments">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor pariatur, facilis earum temporibus nulla maiores quidem voluptas hic atque expedita!</Feature>
                <Feature className="align-self-stretch col-12 col-lg-3" static_img={smpng} img_pos="top" title="Get credibility scores">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro ratione quis nobis explicabo eaque laudantium est inventore facere voluptate in.</Feature>
                <Feature className="align-self-stretch col-12 col-lg-3" static_img={nftpng} img_pos="bot" title="Get NFTs based on your performance">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro ratione quis nobis explicabo eaque laudantium est inventore facere voluptate in.</Feature>
            </div>
        </div>
    )
}

export default Features;