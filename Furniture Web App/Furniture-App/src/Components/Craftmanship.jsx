import React from "react";
import { motion } from "framer-motion";
import "../App.css";

const highlights = [
  {
    title: "Premium Materials",
    description: "Hand-selected hardwoods, natural stone, and premium fabrics sourced from the world's finest suppliers.",
    image: "/craft1.png" // Put your material texture image here
  },
  {
    title: "Expert Craftsmanship",
    description: "Created by skilled artisans whose attention to detail transforms furniture into functional works of art.",
    image: "/craft2.png" // Put your woodworking/artisan image here
  },
  {
    title: "Timeless Design",
    description: "Designed to transcend trends and become a lasting part of your home.",
    image: "/craft3.png" // Put your accent chair image here
  }
];

const Craftsmanship = () => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <section className="craftsmanship-section">
      {/* Intro Header */}
      <motion.div 
        className="craft-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="craft-header-left">
          <motion.span className="craft-label" variants={elementVariants}>
            CRAFTED TO PERFECTION
          </motion.span>
          <motion.h2 className="craft-title" variants={elementVariants}>
            Where Exceptional Materials <br />
            Meet Timeless Artistry
          </motion.h2>
        </div>
        
        <div className="craft-header-right">
          <motion.p className="craft-description" variants={elementVariants}>
            Every piece is meticulously crafted using carefully selected 
            materials and refined techniques, ensuring beauty, durability, 
            and comfort that lasts for generations.
          </motion.p>
        </div>
      </motion.div>

      {/* Luxury 3-Column Card Grid Layout */}
      <motion.div 
        className="craft-cards-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={containerVariants}
      >
        {highlights.map((item, index) => (
          <div className="craft-luxury-card" key={index}>
            {/* Image Container with Top Rounded Corners */}
            <div className="craft-card-image-wrapper">
              <img src={item.image} alt={item.title} />
            </div>

            {/* Content Container Area */}
            <div className="craft-card-content">
              <motion.div className="card-top-accent" variants={elementVariants}>
                <span className="craft-index">0{index + 1}</span>
                <span className="craft-accent-line"></span>
              </motion.div>
              
              <motion.h3 className="highlight-title" variants={elementVariants}>
                {item.title}
              </motion.h3>
              
              <motion.p className="highlight-text" variants={elementVariants}>
                {item.description}
              </motion.p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Craftsmanship;