import styles from "../../../style";
import Hero from "./Hero";
import News from "./News";
import LastEpisode from "./LastEpisode";
import Overview from "./Overview";
import Agents from "./Agents";
import Maps from "./MapsSection";

const Home = () => (
  <>
    <div className={`${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
        <LastEpisode />
      </div>
    </div>
    <Overview />

    <Maps />
  </>
);

export default Home;
