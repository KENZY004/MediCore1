# MediCore Hospital Management System

> Advanced Hospital Management System built with MERN Stack

## 🏥 Project Overview

MediCore is a comprehensive hospital management system designed to streamline hospital operations including patient management, appointment scheduling, medical reporting, billing, and automated notifications.

## 🚀 Technology Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Chart.js / Recharts (for analytics)
- CSS3 (Modern styling)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Nodemailer (Email notifications)
- Razorpay (Payment gateway)
- PDFKit (PDF generation)
- express-validator (Input validation)

## 👥 User Roles

- **Admin**: Manage users, doctors, view analytics
- **Doctor**: View appointments, create reports, issue prescriptions
- **Reception**: Register patients, book appointments
- **Patient**: View appointments, medical history, pay bills

## ✨ Key Features

- 🔐 JWT-based authentication with role-based access control
- 📅 Appointment scheduling and management
- 📊 Dashboard analytics with interactive charts
- 📧 Automated email notifications
- 💳 Online payment integration (Razorpay)
- 📄 PDF generation for prescriptions and bills
- 🔍 Advanced search, filtering, and pagination
- 🔒 Secure password reset functionality
- 📱 Responsive design

## 📁 Project Structure

```
MediCore-HMS/
├── backend/          # Node.js/Express API
├── frontend/         # React/Vite application
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier available)
- Git
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KENZY004/MediCore1.git
cd MediCore1
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## 📝 Environment Variables

Create `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas (Cloud Database - REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicore?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration (Gmail or SendGrid)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (update when deployed)
CLIENT_URL=http://localhost:5173
```

> **Note:** All services (database, email, payments) use cloud-based solutions for seamless deployment.

## 🎯 Development Roadmap

- [x] Project setup and configuration
- [ ] Authentication system
- [ ] Patient management
- [ ] Appointment system
- [ ] Medical reports
- [ ] Billing and payments
- [ ] Email notifications
- [ ] Dashboard analytics
- [ ] PDF generation
- [ ] Testing and deployment

## 👨‍💻 Developer

**Kenzn**  
BTech CSE - Lovely Professional University (LPU)  
Placement Enhancement Program (PEP)

## 📄 License

This project is developed for educational purposes as part of the BTech CSE curriculum.

---

**Status**: 🚧 In Development  
**Version**: 1.0.0  
**Last Updated**: February 2026
