# MediCore Hospital Management System

> B2B Hospital Management Platform built with MERN Stack

## 🏥 Project Overview

MediCore is a **B2B hospital management platform** designed for hospitals to manage their internal operations. The system allows hospitals to register on the platform and use it as their comprehensive management system for patients, doctors, appointments, staff, and departments. An admin oversees the entire platform and manages hospital registrations.

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
- PDFKit (PDF generation)
- express-validator (Input validation)

## 👥 User Roles

### **Admin** (Platform Administrator)
- Approve/reject hospital registrations
- Manage hospital accounts (activate/deactivate)
- View system-wide analytics
- Monitor platform usage

### **Hospital** (Hospital Staff)
- Register hospital on the platform
- Manage patient records
- Manage doctor profiles and schedules
- Schedule appointments (internal)
- Manage staff members
- Manage departments
- Generate reports and analytics
- Handle internal billing

## ✨ Key Features

- 🔐 JWT-based authentication with role-based access control
- 🏥 Hospital registration and approval workflow
- 👥 Patient management (by hospital)
- 👨‍⚕️ Doctor management and scheduling
- 📅 Internal appointment scheduling
- 👔 Staff management
- 🏢 Department management
- 📊 Hospital-specific and system-wide analytics
- 📧 Automated email notifications
- 📄 PDF generation for reports and prescriptions
- 🔍 Advanced search, filtering, and pagination
- 🔒 Data isolation (hospitals only see their own data)
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

# Frontend URL (update when deployed)
CLIENT_URL=http://localhost:5173
```

> **Note:** All services (database, email) use cloud-based solutions for seamless deployment.

## 🎯 Development Roadmap

### Phase 1: Core Setup
- [x] Project setup and configuration
- [ ] Database schema design
- [ ] Authentication system (Admin + Hospital)

### Phase 2: Hospital & Admin Features
- [ ] Hospital registration and approval workflow
- [ ] Admin dashboard (hospital management)
- [ ] Hospital dashboard (overview)

### Phase 3: Hospital Internal Management
- [ ] Patient management (by hospital)
- [ ] Doctor management and scheduling
- [ ] Appointment system (internal)
- [ ] Staff management
- [ ] Department management

### Phase 4: Advanced Features
- [ ] Medical reports and prescriptions
- [ ] PDF generation
- [ ] Email notifications
- [ ] Analytics dashboards
- [ ] Search and filtering

### Phase 5: Deployment
- [ ] Testing and bug fixes
- [ ] Documentation
- [ ] Deployment to cloud

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
