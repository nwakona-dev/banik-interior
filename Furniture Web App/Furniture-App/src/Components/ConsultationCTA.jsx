import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Compass,
  Star,
  Map,
  ShieldCheck,
  Award,
} from "lucide-react";

import "../App.css";

// Replace with your agent's actual WhatsApp number.
// Use 234 followed by the number, without +, spaces or dashes.
const AGENT_WHATSAPP_NUMBER = "+2349133488474";

export default function ConsultationCTA() {
  const stats = [
    {
      id: 1,
      value: "500+",
      label: "Projects Delivered",
      icon: <Award className="stat-icon" size={20} strokeWidth={1} />,
    },
    {
      id: 2,
      value: "36",
      label: "States Covered",
      icon: <Map className="stat-icon" size={20} strokeWidth={1} />,
    },
    {
      id: 3,
      value: "100%",
      label: "Premium Materials",
      icon: (
        <ShieldCheck
          className="stat-icon"
          size={20}
          strokeWidth={1}
        />
      ),
    },
    {
      id: 4,
      value: "5★",
      label: "Client Satisfaction",
      icon: <Star className="stat-icon" size={20} strokeWidth={1} />,
    },
  ];

  // Animation configurations
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const imageScaleIn = {
    hidden: { opacity: 0, scale: 1.06 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.4,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  // Open WhatsApp for a private consultation.
  const handleCommission = () => {
    const message =
      "Hello Banik Interior, I am interested in commissioning a space. I would like to discuss my project and book a private consultation.";

    const whatsappUrl = `https://wa.me/${AGENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="cta-section">
      <motion.div
        className="cta-main-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={sectionVariants}
      >
        {/* UPPER SPLIT DISPLAY */}
        <div className="cta-grid-upper">

          {/* LEFT CONTENT BLOCK */}
          <div className="cta-content-block">
            <motion.div
              className="cta-badge-container"
              variants={fadeInUp}
            >
              <div className="cta-badge-dot"></div>

              <span className="cta-badge-text">
                Private Consultation
              </span>
            </motion.div>

            <motion.h2
              className="cta-title"
              variants={fadeInUp}
            >
              Transform Your Space <br />

              <span className="cta-title-serif">
                With Timeless Luxury
              </span>
            </motion.h2>

            <motion.div
              className="cta-description-wrapper"
              variants={fadeInUp}
            >
              <p>
                Whether you're furnishing a new residence,
                redesigning a living space, or seeking a bespoke
                statement piece, our design specialists are ready
                to guide you through every detail.
              </p>

              <p>
                Experience furniture crafted for beauty, comfort,
                and lasting sophistication.
              </p>
            </motion.div>

            {/* ACTION BUTTONS */}
            <motion.div
              className="cta-action-row"
              variants={fadeInUp}
            >
              {/* COMMISSION YOUR SPACE - WHATSAPP */}
              <motion.button
                type="button"
                className="btn-luxury-primary"
                onClick={handleCommission}
                whileHover={{
                  y: -3,
                  backgroundColor: "#b39255",
                }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Calendar size={16} strokeWidth={1.5} />

                <span>Commission Your Space</span>
              </motion.button>

              {/* EXPLORE COLLECTION - COLLECTIONS PAGE */}
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/collections"
                  className="btn-luxury-secondary"
                >
                  <Compass size={16} strokeWidth={1.5} />

                  <span>Explore Collection</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT IMAGE BLOCK */}
          <div className="cta-visual-frame">
            <motion.div
              className="cta-image-mask"
              variants={imageScaleIn}
            >
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury living space architectural showcase"
                className="cta-showcase-image"
                loading="lazy"
                decoding="async"
              />

              <div className="cta-ambient-glow"></div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}