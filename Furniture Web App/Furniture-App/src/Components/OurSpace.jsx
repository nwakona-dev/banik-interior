import React from "react";
import { motion } from "framer-motion";
import "../App.css";

// Replace with your agent's WhatsApp number.
const AGENT_WHATSAPP_NUMBER = "2349133488474";

const OurSpaces = () => {
  // WhatsApp contact handler
  const handleContactUs = () => {
    const message =
      "Hello Banik Interior, I am interested in your interior design and furniture services. I would love to make an enquiry.";

    const whatsappUrl = `https://wa.me/${AGENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Text animation
  const textVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <section  id="our-spaces" className="our-spaces">

      {/* HEADER SECTION */}
      <motion.div
        className="spaces-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.p className="spaces-label" variants={textVariants}>
          Interior Design Portfolio
        </motion.p>

        <motion.h2 className="why-title" variants={textVariants}>
          Our Spaces
        </motion.h2>

        <motion.p className="spaces-subtitle" variants={textVariants}>
          We don't simply furnish rooms. We shape experiences.
        </motion.p>
      </motion.div>

      {/* GRID LAYOUT */}
      <div className="spaces-grid">

        {/* CARD 1: THE SKYLINE PENTHOUSE */}
        <div className="space-card featured">
          <img
            src="/ourstory1.png"
            alt="Skyline Penthouse"
            loading="lazy"
            decoding="async"
          />

          <motion.div
            className="space-overlay"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.h3 variants={textVariants}>
              The Skyline Penthouse
            </motion.h3>

            <motion.p variants={textVariants}>
              Modern luxury living elevated through bespoke furniture
              and thoughtful design.
            </motion.p>

            <motion.button
              variants={textVariants}
              onClick={handleContactUs}
              type="button"
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>

        {/* CARD 2: THE ELYSIAN VILLA */}
        <div className="space-card">
          <img
            src="/ourstory3.png"
            alt="Elysian Villa"
            loading="lazy"
            decoding="async"
          />

          <motion.div
            className="space-overlay"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.h3 variants={textVariants}>
              The Elysian Villa
            </motion.h3>
          </motion.div>
        </div>

        {/* CARD 3: MERIDIAN RESIDENCE */}
        <div className="space-card">
          <img
            src="/ourstory.png"
            alt="Meridian Residence"
            loading="lazy"
            decoding="async"
          />

          <motion.div
            className="space-overlay"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.h3 variants={textVariants}>
              Meridian Residence
            </motion.h3>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default OurSpaces;