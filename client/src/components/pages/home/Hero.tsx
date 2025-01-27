import React from "react";
import styles from "../../../style";
import { valoranttext } from "../../../assets/index";
import { Link } from "react-router-dom";

const Hero = () => (
  <section
    id="hero"
    className="relative flex items-center justify-center h-screen overflow-hidden min-h-[490px] h-[36vh]"
  >
    <div
      className={`relative flex items-center justify-center flex-col px-[5%] py-[4rem] w-full h-full`}
    >
      <div className="sm:py-10 py-0 flex items-center justify-between sm:flex-col flex-col-reverse mb-auto">
        <h6 className="text-white font-semibold mt-4 text-center sm:mb-10">
        Collect and strategize with Runaway
        </h6>
        <div>
          <img
            src={valoranttext}
            alt="runaway"
            className="sm:h-[100px] h-[50px]"
          />
        </div>
      </div>
      <Link to={"/runaways"}>
      <button className="btn">
        <span className="btn__inner">
          <span className="btn__slide"></span>
          <span className="btn__content">PLAY NOW</span>
        </span>
      </button>
      </Link>
    </div>
    <video
      autoPlay
      loop
      muted
      className="absolute z-[-1] w-auto min-w-full min-h-full max-w-none"
    >
      <source
        src="https://res.cloudinary.com/dydj8hnhz/video/upload/v1721861317/runaway_sxlaiz.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  </section>
);

export default Hero;
