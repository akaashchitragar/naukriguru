# Naukri Guru (नौकरी गुरु) 🚀

> Your AI-Powered Career Companion for the Indian Job Market

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Love in India](https://madewithlove.org.in/badge.svg)](https://madewithlove.org.in/)

## 🎯 Vision

Naukri Guru is revolutionizing the Indian job search experience by providing smart, localized resume optimization and job matching services. Built specifically for the Indian market, it helps job seekers perfect their resumes for Applicant Tracking Systems (ATS) while considering local industry requirements and practices. Our comprehensive scoring system evaluates resumes across multiple criteria including keyword matching, experience level, technical skills, job relevance, industry knowledge, and educational qualifications to provide tailored feedback for the Indian job market.

## 🌟 Features

### 📊 Smart Resume Analysis
- **Match Rate Visualization**
  - Dynamic circular progress indicator
  - Real-time match percentage calculation
  - Color-coded scoring feedback (Green: Good, Yellow: Average, Red: Needs Improvement)
  - Instant visual feedback during analysis

- **Core Analysis Features**
  - PDF resume parsing and analysis
  - Job description optimization
  - AI-powered evaluation using Google Gemini
  - Real-time processing with loading indicators
  - Multi-format resume support

### 🎯 Scoring System (100 points total)
- **Comprehensive Scoring Breakdown**
  - Keyword Match (30 points)
    - Job-specific terminology
    - Industry-standard terms
    - Required skills matching
  
  - Experience Level (20 points)
    - Years of relevant experience
    - Role-specific achievements
    - Leadership and responsibilities
  
  - Technical Skills & Tools (20 points)
    - Required technical competencies
    - Software and tool proficiency
    - Technical certifications
  
  - Job Title & Role Relevance (15 points)
    - Title alignment
    - Role responsibilities match
    - Industry relevance
  
  - Industry & Domain Knowledge (10 points)
    - Sector-specific experience
    - Domain expertise
    - Market understanding
  
  - Certifications & Education (5 points)
    - Relevant degrees
    - Professional certifications
    - Continuing education

### 💡 Intelligent Feedback
- **Detailed Recommendations**
  - Action-oriented improvement suggestions
  - Industry-specific optimization tips
  - Keyword optimization guidance
  - Skills gap analysis
  - Career path recommendations

### 🎨 User Experience
- **Modern Interface**
  - Responsive design for all devices
  - Intuitive dashboard layout
  - Real-time analysis updates
  - Interactive scoring components
  - Easy document upload/paste

- **User Experience**
  - Modern, responsive interface
  - Real-time analysis
  - Visual score presentation
  - Detailed feedback dashboard
  - User authentication and history

- **Premium Features**
  - Detailed ATS optimization suggestions
  - Industry-specific resume templates
  - Priority processing
  - Unlimited resume analysis
  - Expert consultation booking
  - Bulk resume processing for recruiters

- **Payment Integration**
  - Secure payment processing via Razorpay
  - Multiple payment methods (UPI, Cards, Netbanking)
  - Subscription management
  - Invoice generation
  - Payment history
  - Refund processing

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**
- **Tailwind CSS** + **Shadcn/ui**
- **React Query** & **Zustand**
- **TypeScript**

### Backend
- **FastAPI**
- **Google Gemini AI**
- **PyMuPDF** for PDF processing
- **MongoDB** for data storage

### Payment Processing
- **Razorpay**
  - Secure payment gateway integration
  - Webhook integration for payment status
  - Subscription management
  - Payment analytics
  - Automated invoice generation
  - Multi-currency support
  - Test mode for development

### Infrastructure
- **AWS Amplify**
  - Amplify Hosting (Frontend & Backend hosting)
  - Amplify Storage (S3 for file storage)
  - Amplify API (GraphQL/REST APIs)
  - Amplify CLI (Infrastructure management)
  - Built-in CI/CD pipeline
  - Automatic SSL/TLS certificates

### Authentication & Security
- **Clerk**
  - Modern authentication and user management
  - Social login providers (Google, GitHub, etc.)
  - Multi-session management
  - User profiles and organization management
  - JWT management and session security
  - Built-in React components
  - Webhook integrations
- **AWS WAF** for security
- **AWS KMS** for key management

## 📋 Prerequisites

- Node.js 18.x or higher
- Python 3.9 or higher
- MongoDB Atlas account
- AWS account
- Google Cloud account (for Gemini AI)
- Clerk account
- pnpm package manager
- AWS Amplify CLI
- Razorpay account
- Valid business PAN/GST for Razorpay integration

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/chitragarakash/naukriguru.git
cd naukriguru
```

2. Install and configure AWS Amplify CLI:
```bash
npm install -g @aws-amplify/cli
amplify configure
```

3. Initialize Amplify in your project:
```bash
amplify init
```

4. Add necessary Amplify services:
```bash
amplify add storage
amplify add api
amplify push
```

5. Install frontend dependencies:
```bash
cd frontend
pnpm install
pnpm add @clerk/nextjs
```

6. Install backend dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

7. Set up environment variables:

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Create `.env` in the backend directory:
```env
GOOGLE_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_uri
AWS_REGION=your_aws_region
CLERK_SECRET_KEY=your_clerk_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## 🏃‍♂️ Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
cd frontend
pnpm dev
```

3. Access the application at `http://localhost:3000`

## 📁 Project Structure

```
├── frontend/
│   ├── app/                # Next.js app router
│   │   ├── sign-in/       # Clerk sign in page
│   │   ├── sign-up/       # Clerk sign up page
│   │   └── layout.tsx     # Root layout with ClerkProvider
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   ├── styles/            # Global styles
│   └── middleware.ts      # Clerk authentication middleware
├── backend/
│   ├── app/              # Main application
│   ├── services/         # Business logic
│   └── models/           # Data models
├── amplify/              # Amplify backend configuration
└── docs/                 # Documentation
```

## 🚀 Deployment

1. Deploy the backend:
```bash
amplify push
```

2. Deploy the frontend:
```bash
amplify publish
```

The application will be automatically deployed to AWS Amplify Hosting with a secure domain and SSL certificate.

## 🔒 Security

- Authentication handled by Clerk's secure infrastructure
- JWT validation and session management by Clerk
- All API keys and secrets stored securely using AWS Secrets Manager
- CORS properly configured for production
- Input validation and sanitization implemented
- Regular security audits and updates
- SSL/TLS encryption for all communications
- PCI DSS compliance for payment processing
- Secure payment data handling
- Payment information encryption
- Automated fraud detection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the resume analysis
- AWS for infrastructure support
- MongoDB Atlas for database services
- All contributors and supporters of the project

## 📞 Support

For support:
- Technical issues: Open an issue in the repository
- Billing issues: billing@naukriguru.com
- General queries: support@naukriguru.com

## 💰 Pricing Plans

### Basic Plan (Free)
- 1 resume analysis per day
- Basic ATS score
- Standard processing time

### Pro Plan (₹499/month)
- Unlimited resume analysis
- Detailed ATS recommendations
- Priority processing
- Premium templates
- Email support

### Enterprise Plan (Custom Pricing)
- Bulk resume processing
- API access
- Custom integration
- Dedicated support
- Custom features

## 💳 Payment Integration

### Available Payment Methods
- Credit/Debit Cards
- UPI
- Netbanking
- Wallets
- EMI (for eligible cards)

### Testing Payments
Use these test credentials in development:
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
OTP: 1234
```

### Webhook Integration
Configure webhooks for:
- Payment success/failure
- Subscription creation
- Subscription cancellation
- Payment refund status

## 📝 API Endpoints

### Payment Endpoints
```
POST /api/payments/create-order
POST /api/payments/verify
POST /api/webhooks/razorpay
GET  /api/subscriptions/status
POST /api/subscriptions/cancel
``` 