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
- **Next.js 15.2.2**
- **Tailwind CSS** + **Shadcn/ui**
- **React Query** & **Zustand**
- **TypeScript**
- **Firebase Authentication**
- **Firebase Firestore**
- **Firebase Storage**

### Backend
- **FastAPI**
- **Google Gemini AI**
- **PyMuPDF** for PDF processing
- **Firebase Admin SDK**

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
- **Vercel** (Frontend hosting)
- **Railway** (Backend hosting)
- **Firebase**
  - Firestore Database
  - Firebase Authentication
  - Firebase Storage (for file storage)
  - Firebase Functions (serverless functions)
  - Real-time data synchronization
  - Built-in security rules

### Authentication & Security
- **Firebase Authentication**
  - Email/password authentication
  - Social login providers (Google, GitHub, etc.)
  - Multi-factor authentication
  - Secure token management
  - User management dashboard
  - Custom claims and user roles
- **Firebase Security Rules** for data protection
- **API key management** for secure backend communication

## 🎨 Color Theme

Our color theme is designed to reflect trust, professionalism, and Indian cultural elements while maintaining modern design principles:

### Primary Colors
- **Deep Blue** (#12232E)
  - Represents trust, stability, and professionalism
  - Used for primary backgrounds and key UI elements

- **Accent Orange** (#FF6B6B)
  - Symbolizes energy and Indian cultural vibrancy
  - Used for CTAs and important highlights

- **Soft Purple** (#7D94B5)
  - Represents innovation and technology
  - Used for secondary elements and gradients

### Supporting Colors
- **Pure White** (#FFFFFF)
  - Creates clean, modern spaces
  - Used for content areas and text on dark backgrounds

- **Light Gray** (#F5F7FA)
  - Provides subtle contrast
  - Used for backgrounds and section separators

### Usage Guidelines
- Deep Blue serves as the primary brand color
- Accent Orange is used sparingly for important actions
- Soft Purple adds depth and sophistication
- White and Light Gray create breathing space and improve readability
- Color contrast ratios follow WCAG 2.1 accessibility guidelines

## 📋 Prerequisites

- Node.js 18.x or higher
- Python 3.9 or higher
- Firebase account
- Google Cloud account (for Gemini AI)
- npm package manager
- Razorpay account (for payment integration)
- Valid business PAN/GST for Razorpay integration

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/chitragarakash/naukriguru.git
cd naukriguru
```

2. Set up Firebase:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

3. Install frontend dependencies:
```bash
cd frontend
pnpm install
```

4. Install backend dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

5. Set up environment variables:

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Create `.env` in the backend directory:
```env
GOOGLE_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=path/to/serviceAccountKey.json
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
│   │   ├── auth/          # Authentication pages
│   │   └── layout.tsx     # Root layout with Firebase providers
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   │   ├── firebase.ts    # Firebase configuration
│   │   └── api.ts         # API client
│   └── styles/            # Global styles
├── backend/
│   ├── app/              # Main application
│   ├── services/         # Business logic
│   └── models/           # Data models
└── docs/                 # Documentation
```

## 🚀 Deployment

1. Deploy the backend to Railway:
```bash
# Follow Railway CLI instructions
```

2. Deploy the frontend to Vercel:
```bash
vercel
```

3. Deploy Firebase configuration:
```bash
firebase deploy
```

## 🔒 Security

- Authentication handled by Firebase Authentication
- Firestore security rules for data protection
- All API keys and secrets stored securely
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

MIT License

Copyright (c) 2024 Naukri Guru

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

For more information, please refer to the [LICENSE](LICENSE) file in the repository.

## 🙏 Acknowledgments

- Google Gemini AI for powering the resume analysis
- Firebase for backend infrastructure
- All contributors and supporters of the project

## 📞 Support

For support:
- Technical issues: Open an issue in the repository
- Billing issues: billing@naukriguru.com
- General queries: support@naukriguru.com

## 💰 Pricing Plans

### Basic Plan (₹99/month)
- **Resume Analysis**
  - 5 resume matches per month
  - Basic ATS compatibility check
  - Core skills gap analysis
  - Basic keyword optimization

- **Features**
  - PDF resume parsing
  - Job description analysis
  - Basic match rate calculation
  - Essential feedback
  - Email support

### Pro Plan (₹199/month)
- **Everything in Basic, plus:**
- **Enhanced Analysis**
  - Unlimited resume matches
  - Advanced ATS optimization
  - Industry-specific recommendations
  - Skill benchmarking
  - Automated keyword suggestions

- **Premium Features**
  - Priority processing
  - Multiple resume versions
  - Resume templates library
  - Job market insights
  - Chat support

### Ultimate Plan (₹299/month)
- **Everything in Pro, plus:**
- **Advanced Features**
  - AI-powered resume rewriting
  - Interview preparation tips
  - Salary insights
  - Industry trends analysis
  - Career path recommendations

- **Expert Services**
  - Priority 24/7 support
  - One-on-one expert consultation
  - Custom resume templates
  - LinkedIn profile optimization
  - Job search strategy session


### Compare Plans

| Feature                          | Basic          | Pro            | Ultimate       |
|----------------------------------|----------------|----------------|----------------|
| Price                            | ₹99/month      | ₹199/month    | ₹299/month    |
| Resume Matches                   | 5/month        | Unlimited      | Unlimited      |
| ATS Optimization                 | Basic          | Advanced       | Advanced+      |
| Match Rate Analysis              | ✓              | ✓              | ✓              |
| Keyword Optimization             | Basic          | Advanced       | Advanced+      |
| Resume Templates                 | -              | 50+            | 100+           |
| Skills Gap Analysis             | Basic          | Detailed       | Comprehensive  |
| Job Market Insights             | -              | ✓              | ✓              |
| Career Path Planning            | -              | -              | ✓              |
| Expert Consultation             | -              | -              | Monthly        |
| Support                         | Email          | Chat           | 24/7 Priority  |
| Processing Speed                | Standard       | Priority       | Instant        |

### All Plans Include
- Secure document handling
- Regular feature updates
- Mobile-friendly interface
- Basic customer support
- SSL encryption
- Regular backups

### Payment Options
- All major credit/debit cards
- UPI payments
- Net banking
- EMI options available
- Auto-renewal option
- Money-back guarantee

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

## 🚀 Firebase Integration

The application uses Firebase for:

1. **Authentication**: User sign-up, sign-in, and Google authentication
2. **Firestore Database**: Storing user data, resumes, and analysis results
3. **Storage**: Storing uploaded resume files

### Database Structure

- **users**: User account information
- **resumes**: Uploaded resume files with metadata
- **analyses**: Analysis results linked to users and resumes

## 📝 API Endpoints

- `GET /`: Welcome message
- `POST /analyze`: Analyze a resume against a job description (authenticated)
- `GET /users/me/analyses`: Get a user's analysis history (authenticated)
- `GET /users/me/resumes`: Get a user's uploaded resumes (authenticated)
- `POST /analyze-dev`: Development endpoint for testing (no authentication)

## 📄 Project Structure

```
naukri-guru/
├── frontend/               # Next.js frontend
│   ├── app/                # App router
│   ├── components/         # React components
│   ├── lib/                # Utility functions and API client
│   └── public/             # Static assets
│
├── backend/                # FastAPI backend
│   ├── services/           # Service modules
│   │   ├── pdf_parser.py   # PDF text extraction
│   │   ├── resume_analyzer.py # Resume analysis with Gemini
│   │   ├── firebase_admin.py # Firebase integration
│   │   ├── database.py     # Database operations
│   │   └── auth.py         # Authentication service
│   └── main.py             # FastAPI application
│
└── SETUP.md                # Setup instructions
```

## 🚀 Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions. 