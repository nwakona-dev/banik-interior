    import React from 'react';
    import { motion } from 'framer-motion';
    import { ArrowRight, Globe, Shield } from 'lucide-react';
    import { FaInstagram , FaWhatsapp } from "react-icons/fa";
    import '../App.css'; // Path to your main or component stylesheet

    export default function Footer() {
    const currentYear = new Date().getFullYear();

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert("Welcome to the inner circle.");
    };

    return (
        <footer className="luxury-footer">
        <div className="footer-container">
            
            {/* Row 1: Brand Signature & Newsletter Ledger */}
            <div className="footer-main-grid">
            
            {/* Brand Column */}
            <div className="footer-brand-block">
                <h2 className="footer-logo">BAINK INTERIOR</h2>
                <p className="footer-manifesto">
                Engineering legacies through architectural furniture. We tailormake spaces 
                that balance structural poetry with absolute comfort for the discerning collector.
                </p>
                
                {/* Elegant Minimal Newsletter Input */}
                
                <label className="newsletter-label">Social Media Handles</label>
                <div className="footer-social-row">
                <a href="https://www.instagram.com/bainkinterior/" className="footer-social-link" aria-label="Instagram">
                    <FaInstagram size={28} color="#C6A66B" />
                </a>
                
                <a href="https://wa.me/2349133488474" className="footer-social-link" aria-label="WhatsApp">
                    <FaWhatsapp size={28} color="#C6A66B" />
                </a>
                </div>
                
            </div>

            {/* Navigation Matrix */}
            <div className="footer-links-matrix">
                <div className="footer-link-group">
                <h3 className="footer-group-title">Collections</h3>
                <ul>
                    <li><a href="#living">The Living Lounge</a></li>
                    <li><a href="#dining">Architectural Dining</a></li>
                    <li><a href="#bedroom">Bespoke Bedroom</a></li>
                    <li><a href="#journal">The Journal</a></li>
                </ul>
                </div>

                <div className="footer-link-group">
                <h3 className="footer-group-title">Contact</h3>
                <ul>
                    <li><a href="mailto:bank.interior@gmail.com">bank.interior@gmail.com</a></li>
                </ul>
                </div>
            </div>

            {/* Showroom Residences / Contact Column */}
            <div className="footer-residences-block">
                <h3 className="footer-group-title">Showroom Residences</h3>
                <p className="residence-location">
                <strong>Port Harcourt Atelier</strong> <br />
                Port Harcourt, Rivers State, Nigeria
                </p>
                
                
            </div>

            </div>

            {/* Row 2: Subtle Divider Line */}
            <hr className="footer-divider" />

            {/* Row 3: Legal & Bottom Ledger */}
            <div className="footer-bottom-ledger">
            <div className="footer-legal-left">
                <span>&copy; {currentYear} Banik Interior. All Rights Reserved.</span>
            </div>
            <div className="footer-legal-right">
                <a href="#privacy" className="legal-link">Privacy Mandate</a>
                <span className="legal-separator">•</span>
                <a href="#terms" className="legal-link">Terms of Service</a>
            </div>
            </div>

        </div>
        </footer>
    );
    }