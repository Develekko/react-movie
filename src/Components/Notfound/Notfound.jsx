import { useCallback } from "react";
import Particles from "react-particles";
import { Link } from "react-router-dom";
import { loadFull } from "tsparticles";
import './Notfound.css'
import { Helmet } from "react-helmet";

const Notfound = () => {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  return <>
    <Helmet>
      <title>Not Found</title>
    </Helmet>
    <div className="notfound">
      <div className="notfound-404">
        <h3>Oops! Page not found</h3>
        <h1><span>4</span><span>0</span><span>4</span></h1>
      </div>
      <h2>we are sorry, but the page you requested was not found</h2>
      <Link to={'/'}><button className="btn">Go To Homepage</button></Link>
    </div>

    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          zIndex: -1
        },
        background: {
          color: {
            value: "rgb(39, 43, 48);",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 150,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            directions: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 4,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
  </>
};
export default Notfound