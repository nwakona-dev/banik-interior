    import React from "react";
    import { motion } from "framer-motion";
    // import "../App.css";
    import "../styles/whyChooseUs.css"

    const WhyChooseUs = () => {
    const features = [
        {
        number: "01",
        title: "TIMELESS DESIGN",
        description: "Furniture crafted to remain relevant for generations.",
        },
        {
        number: "02",
        title: "CURATED MATERIALS",
        description: "Exceptional woods, stones and fabrics selected without compromise.",
        },
        {
        number: "03",
        title: "WHITE-GLOVE EXPERIENCE",
        description: "From consultation to delivery, every detail is considered.",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.25, 
        },
        },
    };

    const cardVariants = {
        hidden: { 
        opacity: 0, 
        y: 40, 
        scale: 0.96 
        },
        visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.85,
            ease: [0.215, 0.61, 0.355, 1], 
        },
        },
    };

    return (
        <section className="why-choose-us">
        
        <motion.div 
            className="why-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
            <p className="why-label">The Baink Difference</p>
            <h2 className="why-title">Why Choose Us</h2>
        </motion.div>

        <motion.div 
            className="features"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={containerVariants}
        >
            {features.map((feature) => (
            <motion.div
                className="feature-card"
                key={feature.number}
                variants={cardVariants}
            >
                <span className="feature-number">
                {feature.number}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
            </motion.div>
            ))}
        </motion.div>

        </section>
    );
    };

    export default WhyChooseUs;