
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/hero.css";

const slides = [
  {
    image: "/hero1.png",
    mobileImage: "/hero1-mobile.png",
    title: (
      <>
        WHERE LUXURY
        <br />
        FEELS EFFORTLESS.
      </>
    ),
    description:
      "Sophisticated interiors inspired by modern living and crafted to leave a lasting impression.",
  },
  {
    image: "/hero2.png",
    mobileImage: "/hero2-mobile.png",
    title: (
      <>
        CRAFTED FOR
        <br />
        GENERATIONS.
      </>
    ),
    description:
      "Introducing the Ember II in exclusive Vesper Leather. Timeless design, made new.",
  },
  {
    image: "/hero3.png",
    mobileImage: "/hero3-mobile.png",
    title: (
      <>
        DESIGN THAT
        <br />
        DEFINES SPACES.
      </>
    ),
    description:
      "Elevating interiors through exceptional craftsmanship and refined materials.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Container variants to coordinate sequential child delays
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  // Cinematic fade-up variants for textual elements
  const elementVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  return (
    <section className="hero">
      {slides.map((slide, index) => {
        const isActive = currentSlide === index;

        return (
          <div
            key={index}
            className={`slide ${isActive ? "active" : ""}`}
            style={{ display: isActive ? "block" : "none" }}
          >
            {/* Responsive Picture element for Art Direction */}
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={slide.mobileImage}
              />

              <img
                src={slide.image}
                alt="Luxury Interior"
                className="hero-bg"
              />
            </picture>

            <div className="hero-overlay"></div>

            {/* Granular Content Animation */}
            <div className="hero-content">
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                  >
                    <motion.h1
                      className="hero-title"
                      variants={elementVariants}
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      className="hero-description"
                      variants={elementVariants}
                    >
                      {slide.description}
                    </motion.p>

                    <motion.div variants={elementVariants}>
                      <Link
                        to="/collections"
                        className="hero-btn"
                      >
                        EXPERIENCE THE COLLECTION
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* Pagination Navigation indicator */}
      <div className="hero-pagination">
        {slides.map((_, index) => (
          <span
            key={index}
            className={currentSlide === index ? "active" : ""}
            onClick={() => setCurrentSlide(index)}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        ))}
      </div>

      {/* Decorative Scrolling indicator */}
      <div className="hero-scroll">
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;
