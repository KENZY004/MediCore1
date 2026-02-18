import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
    FaHospital, FaUserMd, FaChartLine, FaShieldAlt,
    FaArrowRight, FaCheckCircle, FaBuilding, FaQuoteLeft,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaQuestionCircle
} from 'react-icons/fa';
import './Home.css';
import { useState } from 'react';

function Home() {
    // Simple state for FAQ accordion (optional interaction)
    const [openFaq, setOpenFaq] = useState(null);

    // Contact Form State
    const [contactForm, setContactForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        hospitalName: '',
        message: ''
    });
    const [contactLoading, setContactLoading] = useState(false);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleContactChange = (e) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            const { data } = await api.post('/contact', contactForm);
            if (data.success) {
                alert('Message sent successfully!');
                setContactForm({ firstName: '', lastName: '', email: '', hospitalName: '', message: '' });
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src="/LogoNew.png" alt="Logo" className="logo-img" />
                    <span>ZenoCare</span>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="nav-btn btn-secondary">Login</Link>
                    <Link to="/register" className="nav-btn btn-primary-nav">Register Hospital</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    {/* Removed B2B Badge */}
                    <h1 className="hero-title">
                        The Future of Hospital<br />
                        Management is Here
                    </h1>
                    <p className="hero-subtitle">
                        A comprehensive, cloud-based ecosystem designed to streamline medical operations,
                        enhance patient care, and drive administrative efficiency.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn-large btn-glow">
                            Get Started Free <FaArrowRight />
                        </Link>
                        <Link to="/login" className="btn-large btn-outline">
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <h2 className="section-title">Comprehensive Solutions</h2>
                <p className="section-subtitle">
                    Everything you need to run a modern medical facility, from patient management to billing.
                </p>
                <div className="features-grid">
                    <FeatureCard
                        icon={<FaUserMd />}
                        title="Patient Management"
                        description="Complete patient registration, records management, and appointment scheduling system."
                    />
                    <FeatureCard
                        icon={<FaHospital />}
                        title="Appointment System"
                        description="Book, track, and manage patient appointments with automated reminders and scheduling."
                    />
                    <FeatureCard
                        icon={<FaBuilding />}
                        title="Staff & Doctor Portal"
                        description="Dedicated portals for doctors and staff with role-based access and management tools."
                    />
                    <FeatureCard
                        icon={<FaCheckCircle />}
                        title="Billing & Invoicing"
                        description="Integrated billing system with invoice generation and payment tracking."
                    />
                    <FeatureCard
                        icon={<FaShieldAlt />}
                        title="Secure Authentication"
                        description="Multi-role authentication system with JWT tokens and encrypted data storage."
                    />
                    <FeatureCard
                        icon={<FaChartLine />}
                        title="Digital Prescriptions"
                        description="Doctors can create and manage digital prescriptions with medication tracking."
                    />
                </div>
            </section>

            {/* FAQ Section (New) */}
            <section className="faq">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="faq-container">
                    <FaqItem
                        question="What technologies power ZenoCare?"
                        answer="ZenoCare is built using the MERN stack (MongoDB, Express.js, React, Node.js) with JWT authentication and cloud database hosting on MongoDB Atlas."
                        isOpen={openFaq === 0}
                        onClick={() => toggleFaq(0)}
                    />
                    <FaqItem
                        question="What features are currently available?"
                        answer="The system includes patient management, appointment scheduling, staff management, billing & invoicing, digital prescriptions, and role-based access for admins, hospitals, doctors, and receptionists."
                        isOpen={openFaq === 1}
                        onClick={() => toggleFaq(1)}
                    />
                    <FaqItem
                        question="Is this a production-ready system?"
                        answer="ZenoCare is a comprehensive college project demonstrating full-stack development skills. It includes core HMS functionality and can be extended for production use with additional security hardening and compliance features."
                        isOpen={openFaq === 2}
                        onClick={() => toggleFaq(2)}
                    />
                </div>
            </section>

            {/* Contact Section (New) */}
            <section className="contact">
                <h2 className="section-title">Get in Touch</h2>
                <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
                    Ready to modernize your hospital? Our team is here to help.
                </p>
                <div className="contact-card">
                    <h3 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem', color: '#1e293b' }}>Send Us a Message</h3>

                    <form className="contact-form" onSubmit={handleContactSubmit}>
                        <div className="form-name-row">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={contactForm.firstName}
                                onChange={handleContactChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={contactForm.lastName}
                                onChange={handleContactChange}
                                required
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Work Email"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            required
                        />
                        <input
                            type="text"
                            name="hospitalName"
                            placeholder="Hospital / Organization Name"
                            value={contactForm.hospitalName}
                            onChange={handleContactChange}
                        />
                        <textarea
                            rows="4"
                            name="message"
                            placeholder="How can we help you?"
                            value={contactForm.message}
                            onChange={handleContactChange}
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="btn-large btn-glow"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                            disabled={contactLoading}
                        >
                            {contactLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </section>

            {/* Expanded Light Footer */}
            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-col footer-brand-col">
                        <div className="footer-brand" style={{ justifyContent: 'flex-start' }}>
                            <img src="/LogoNew.png" alt="Logo" className="logo-img" />
                            <span>ZenoCare</span>
                        </div>
                        <p style={{ lineHeight: '1.6' }}>
                            Empowering healthcare providers with next-generation digital infrastructure.
                            Secure, scalable, and simple.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h3>Product</h3>
                        <div className="footer-links">
                            <a href="#">Features</a>
                            <a href="#">Pricing</a>
                            <a href="#">Security</a>
                            <a href="#">Roadmap</a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h3>Company</h3>
                        <div className="footer-links">
                            <a href="#">About Us</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                            <a href="#">Partners</a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h3>Legal</h3>
                        <div className="footer-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">BAA Agreement</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 ZenoCare HMS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="feature-card">
            <div className="icon-box">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

function FaqItem({ question, answer, isOpen, onClick }) {
    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <div className="faq-question" onClick={onClick}>
                {question}
                <FaQuestionCircle style={{ color: isOpen ? '#0066cc' : '#94a3b8' }} />
            </div>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );
}

export default Home;
