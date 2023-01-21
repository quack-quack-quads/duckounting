import "./Features.scss";
import Feature from "./Feature";
import lcpng from "../../assets/images/litecoin.png";
import fipng from "../../assets/images/file.png";
import smpng from "../../assets/images/speedometer.png";
import nftpng from "../../assets/images/card.png";

const Features = () => {
  return (
    <div className="features">
      <div className="line"></div>
      <h1 className="features-heading">
        Explore the amazing features of decentralisation with Duckounting
      </h1>
      <div className="d-flex flex-column flex-lg-row">
        <Feature
          className="align-self-stretch col-12 col-lg-3"
          static_img={lcpng}
          img_pos="top"
          title="Ethereum payment gateway"
        >
          Perform your transactions seamlessly through our integrated Ethereum
          payment gateway
        </Feature>
        <Feature
          className="align-self-stretch col-12 col-lg-3"
          static_img={fipng}
          img_pos="bot"
          title="Hassle-free recurring payments"
        >
          Handle payments over installments through our hassle-free recurring
          payment system
        </Feature>
        <Feature
          className="align-self-stretch col-12 col-lg-3"
          static_img={smpng}
          img_pos="top"
          title="Get Duckountability index"
        >
          Flaunt your performance as a buyer through our Duckountbility index
          and establish credibility with potential partners
        </Feature>
        <Feature
          className="align-self-stretch col-12 col-lg-3"
          static_img={nftpng}
          img_pos="bot"
          title="Get NFTs based on your performance"
        >
          Get dynamic NFTs minted for you based on your partners' ratings
        </Feature>
      </div>
    </div>
  );
};

export default Features;
