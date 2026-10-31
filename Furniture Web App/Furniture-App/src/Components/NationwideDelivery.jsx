    import React from 'react';
    import { motion } from 'framer-motion';
    import { MapPin, Box, Truck, Armchair, Bell } from 'lucide-react';
    import '../App.css'; // Importing your external stylesheet

    export default function NationwideDelivery() {
    const features = [
        {
        id: 1,
        title: "Nationwide Coverage",
        description: "We deliver to every corner of Nigeria, from major cities to remote locations.",
        icon: <MapPin className="luxury-icon" size={32} strokeWidth={1} />
        },
        {
        id: 2,
        title: "Secure White-Glove Handling",
        description: "Your furniture is carefully packed, handled, and transported with the utmost care.",
        icon: <Box className="luxury-icon" size={32} strokeWidth={1} />
        },
        {
        id: 3,
        title: "Timely Delivery",
        description: "We respect your time and ensure prompt, reliable delivery to your doorstep.",
        icon: <Truck className="luxury-icon" size={32} strokeWidth={1} />
        },
        {
        id: 4,
        title: "Installation Assistance",
        description: "Our team handles the setup and placement, so your space is ready to enjoy.",
        icon: <Armchair className="luxury-icon" size={32} strokeWidth={1} />
        },
        {
        id: 5,
        title: "Real-Time Order Updates",
        description: "Stay informed at every step with real-time tracking and updates.",
        icon: <Bell className="luxury-icon" size={32} strokeWidth={1} />
        }
    ];

    // Framer Motion configuration variants for infinite repeatable luxury effects
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.15, 
            delayChildren: 0.1 
        }
        }
    };

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }
    };

    const fadeInRightVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] }
        }
    };

    const footerContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
        }
    };

    const footerItemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
        }
    };

    return (
        <section className="delivery-section">
        
        {/* Top Banner Content Matrix */}
        <motion.div 
            className="delivery-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }} // Fires animation both scrolling up and down
            variants={containerVariants}
        >
            
            {/* Left Column: Premium Editorial Typography */}
            <div className="delivery-text-block">
            <motion.div className="delivery-badge-wrapper" variants={fadeInUpVariants}>
                <span className="delivery-badge">Nationwide Delivery</span>
                <div className="delivery-badge-line"></div>
            </motion.div>
            
            <motion.h2 className="delivery-heading" variants={fadeInUpVariants}>
                Delivering Luxury <br />
                <span className="delivery-heading-italic">Across Nigeria</span>
            </motion.h2>
            
            <motion.p className="delivery-paragraph" variants={fadeInUpVariants}>
                From Lagos to Abuja, Port Harcourt, Kano, Enugu, and beyond, we provide secure 
                nationwide delivery, ensuring every piece arrives in perfect condition and ready to 
                transform your space.
            </motion.p>
            </div>

            {/* Right Column: Nigeria Geographic Visual Wrapper */}
            <motion.div 
            className="delivery-visual-block"
            variants={fadeInRightVariants}
            >
            <img 
                src="/deliver1.png"
                alt="Luxury delivery routes across Nigeria" 
                className="delivery-map-img"
            />
            </motion.div>

        </motion.div>

        {/* Bottom Row: Core Value Propositions Grid */}
        <div className="features-footer">
            <motion.div 
            className="features-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }} // Seamless infinite looping view trigger
            variants={footerContainerVariants}
            >
            {features.map((feature) => (
                <motion.div 
                key={feature.id} 
                className="footer-feature-card"
                variants={footerItemVariants}
                whileHover={{ 
                    y: -6,
                    transition: { duration: 0.3, ease: "easeOut" }
                }}
                >
                {/* Added a custom whileHover here to sync the icon scale perfectly with the card uplift */}
                <motion.div 
                    className="feature-icon-container"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    {feature.icon}
                </motion.div>
                <div className="feature-text-content">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                </div>
                </motion.div>
            ))}
            </motion.div>
        </div>

        </section>
    );
    }