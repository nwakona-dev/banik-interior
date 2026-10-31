import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import "../App.css";

const testimonials = [
  {
    id: 1,
    name: "Sophia Bennett",
    role: "Interior Designer",
    review: "Every piece feels like a work of art. The craftsmanship, comfort, and attention to detail exceeded everything we expected.",
  },
  {
    id: 2,
    name: "Michael Carter",
    role: "Homeowner",
    review: "Our living space feels entirely transformed. Elegant, timeless, and beautifully made.",
  },
  {
    id: 3,
    name: "Amelia Thompson",
    role: "Architect",
    review: "The quality is remarkable. You can immediately feel the difference in every detail.",
  },
];

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "10K+", label: "Satisfied Clients" },
  { value: "250+", label: "Exclusive Designs" },
  { value: "98%", label: "Client Satisfaction" },
];

const Testimonial = () => {
  // Container stagger mechanics
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  // Smooth, luxurious individual element reveal
  const elementVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.215, 0.61, 0.355, 1], // Premium cinematic ease-out
      },
    },
  };

  return (
    <section className="testimonials-section">
      {/* Background Ambient Glows */}
      <div className="luxury-glow top-left"></div>
      <div className="luxury-glow bottom-right"></div>

      {/* HEADER - Granular Animation */}
      <motion.div 
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.span className="section-tag" variants={elementVariants}>
          METICULOUSLY CRAFTED SPACES
        </motion.span>
        <motion.h2 className="section-title" variants={elementVariants}>
          The Homes We Help Transform Speak For Themselves
        </motion.h2>
        <motion.p className="section-subtitle" variants={elementVariants}>
          From elegant city residences to expansive private estates, our furniture 
          has become part of spaces designed to inspire, comfort, and endure for generations.
        </motion.p>
      </motion.div>

      {/* STATS SECTION */}
      <motion.div 
        className="stats-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        {stats.map((item, index) => (
          <motion.div className="stat-item" key={index} variants={elementVariants}>
            <h3 className="stat-value">{item.value}</h3>
            <span className="stat-label">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <hr className="luxury-divider" />

      {/* ASYMMETRICAL TESTIMONIALS */}
      <motion.div 
        className="luxury-testimonials-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={containerVariants}
      >
        {testimonials.map((item) => (
          <motion.div 
            className="luxury-testimonial-node" 
            key={item.id}
            variants={elementVariants}
          >
            <Quote className="luxury-quote-icon" strokeWidth={1} />
            
            <p className="luxury-review">
              "{item.review}"
            </p>
            
            <div className="luxury-client-info">
              <span className="line-decorator"></span>
              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonial;