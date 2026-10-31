import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/features.css";

const FeaturedCollections = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.610, 0.355, 1.000],
      },
    },
  };

  return (
    <motion.section
      className="featured-collections"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={containerVariants}
    >
      <motion.div className="section-header" variants={itemVariants}>
        <p className="section-label">Curated Spaces</p>
        <h2 className="section-title">Featured Collections</h2>
      </motion.div>

      <div className="collections-grid">

        {/* LIVING ROOM */}
        <motion.div
          className="collection-card living"
          variants={itemVariants}
        >
          <img src="/chair1.0.png" alt="Living Room Collection" />

          <div className="collection-overlay">
            <div className="overlay-content">
              <h3>Living Collection</h3>
              <p>Sophisticated comfort for modern living.</p>

              <Link
                to="/collections?category=SITTING"
                className="luxury-btn"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </motion.div>

        {/* DINING ROOM */}
        <motion.div
          className="collection-card dining"
          variants={itemVariants}
        >
          <img src="/dining.png" alt="Dining Room Collection" />

          <div className="collection-overlay">
            <div className="overlay-content">
              <h3>Dining Collection</h3>
              <p>Gather around timeless craftsmanship.</p>

              <Link
                to="/collections?category=DINING"
                className="luxury-btn"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </motion.div>

        {/* BEDROOM */}
        <motion.div
          className="collection-card bedroom"
          variants={itemVariants}
        >
          <img src="/bed2.png" alt="Bedroom Collection" />

          <div className="collection-overlay">
            <div className="overlay-content">
              <h3>Bedroom Collection</h3>
              <p>Designed for rest and refined luxury.</p>

              <Link
                to="/collections?category=BEDROOM"
                className="luxury-btn"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default FeaturedCollections;