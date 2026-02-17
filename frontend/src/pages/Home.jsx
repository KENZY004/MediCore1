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

            {/* Trusted By Section (New) */}
            <section className="trusted-by">
                <p className="trusted-title">Trusted by 500+ Top Healthcare Institutions</p>
                <div className="logos-grid">
                    {/* Placeholders for logos - in prod use real SVGs */}
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8' }}>APOLLO</h4>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8' }}>FORTIS</h4>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8' }}>MAX HEALTH</h4>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8' }}>MANIPAL</h4>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8' }}>MEDANTA</h4>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2 className="section-title">Comprehensive Solutions</h2>
                <p className="section-subtitle">
                    Everything you need to run a modern medical facility, from patient intake to billing and analytics.
                </p>
                <div className="features-grid">
                    <FeatureCard
                        icon={<FaBuilding />}
                        title="OPD & IPD Management"
                        description="Seamlessly manage outpatient flow and inpatient admissions with digital bed tracking."
                    />
                    <FeatureCard
                        icon={<FaChartLine />}
                        title="Real-time Analytics"
                        description="Actionable insights into revenue, patient footfall, and operational bottlenecks."
                    />
                    <FeatureCard
                        icon={<FaUserMd />}
                        title="Staff & HR Portal"
                        description="Manage doctors' shifts, payroll, and performance via a dedicated portal."
                    />
                    <FeatureCard
                        icon={<FaShieldAlt />}
                        title="Bank-Grade Security"
                        description="HIPAA & GDPR compliant data encryption ensures patient privacy is never compromised."
                    />
                    <FeatureCard
                        icon={<FaCheckCircle />}
                        title="Insurance & Billing"
                        description="Automated claim processing and integrated billing engine for faster revenue cycles."
                    />
                    <FeatureCard
                        icon={<FaHospital />}
                        title="Telemedicine Ready"
                        description="Integrated video consultation suite to expand your reach beyond the hospital walls."
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">5M+</span>
                        <span className="stat-label">Patients Served</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1200+</span>
                        <span className="stat-label">Facilities</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">99.99%</span>
                        <span className="stat-label">System Uptime</span>
                    </div>
                </div>
            </section>

            {/* Testimonials (New) */}
            <section className="testimonials">
                <h2 className="section-title">What Administrators Say</h2>
                <div className="features-grid" style={{ maxWidth: '1000px' }}>
                    <div className="testimonial-card">
                        <FaQuoteLeft style={{ color: '#0066cc', fontSize: '2rem', marginBottom: '1rem' }} />
                        <p className="testimonial-text">
                            "ZenoCare transformed our chaotic paper records into a streamlined digital workflow. Efficiency improved by 40% in just two months."
                        </p>
                        <div className="testimonial-author">
                            <h4>Dr. Sarah Williams</h4>
                            <span>Chief Medical Officer, City General</span>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <FaQuoteLeft style={{ color: '#0066cc', fontSize: '2rem', marginBottom: '1rem' }} />
                        <p className="testimonial-text">
                            "The analytics dashboard alone is worth the investment. We can finally make data-driven decisions for staffing and resource allocation."
                        </p>
                        <div className="testimonial-author">
                            <h4>James Chen</h4>
                            <span>Director, Metropolitan Health</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section (New) */}
            <section className="faq">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="faq-container">
                    <FaqItem
                        question="Is the platform HIPAA compliant?"
                        answer="Yes, ZenoCare is fully HIPAA and GDPR compliant. We use AES-256 encryption for all patient data at rest and in transit."
                        isOpen={openFaq === 0}
                        onClick={() => toggleFaq(0)}
                    />
                    <FaqItem
                        question="Can I migrate data from my old system?"
                        answer="Absolutely. Our onboarding team provides free data migration services from most legacy hospital management systems."
                        isOpen={openFaq === 1}
                        onClick={() => toggleFaq(1)}
                    />
                    <FaqItem
                        question="Is there a limit on the number of users?"
                        answer="No. ZenoCare offers unlimited user seats for doctors, nurses, and admin staff on all our enterprise plans."
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
                    <div className="contact-info" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaPhone style={{ color: '#0066cc' }} /> <span>+1 (555) 123-4567</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaEnvelope style={{ color: '#0066cc' }} /> <span>contact@zenocare.com</span>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleContactSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
