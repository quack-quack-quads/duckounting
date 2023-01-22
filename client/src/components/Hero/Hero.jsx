import "./Hero.scss";
import Spline from "@splinetool/react-spline";

const Hero = () => {
  return (
    <div className="row hero">
      <div className="col-12 col-sm-5 centercol">
        <div className="colcontent">
          <h1 className="hero-title">
            Welcome to <span className="hero-title-accent">Duckounting</span>
          </h1>
          <p className="hero-text">
            A simple and easy to use decentralised application to maintain a
            ledger of your invoices on the blockchain.<br />
            <span className="yellowhighlight">
              Connect your wallet NOW.
            </span>
          </p>
        </div>
      </div>
      <div className="col-8 offset-1 offset-sm-2 col-sm-5">
        <Spline scene="https://draft.spline.design/vmQYyqQa9DnCbzdQ/scene.splinecode" />
      </div>
    </div>
  );
};

export default Hero;
