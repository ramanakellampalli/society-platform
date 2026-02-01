<div align="center">

# 🏘️ Society Platform

**A Modern Society Management System**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Turbo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)

*Streamline society management with modern technology*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Society Platform** is a comprehensive management system designed for residential societies, apartments, and gated communities. It simplifies the complexities of society administration by providing tools for maintenance tracking, expense management, resident communication, and financial operations.

### Why Society Platform?

- 💰 **Financial Transparency** - Track every rupee with detailed expense categorization
- 🏠 **Flat Management** - Manage residents, owners, and tenants effortlessly
- 📊 **Real-time Reporting** - Get insights into society finances and operations
- 🔐 **Role-based Access** - Secure access control for admins, committee members, and residents
- 📱 **Mobile-ready** - Built with modern responsive architecture

---

## ✨ Features

### Current Features (Phase 1)

| Feature | Description | Status |
|---------|-------------|--------|
| 🏘️ **Society Management** | Create and manage multiple societies | ✅ Ready |
| 🏢 **Flat Management** | Track flats, owners, and tenants | ✅ Ready |
| 👥 **User Management** | Role-based access (Admin, Committee, Treasurer, Resident, Security) | ✅ Ready |
| 💸 **Expense Tracking** | Categorize and track society expenses | ✅ Ready |
| 💰 **Maintenance Collection** | Monthly/Quarterly/Annual billing cycles | ✅ Ready |
| 🔐 **Authentication** | JWT-based secure authentication | ✅ Ready |
| 📊 **Financial Reports** | Expense categories with budget tracking | ✅ Ready |

### Planned Features (Phase 2+)

- 📢 **Announcements & Notices**
- 🎫 **Complaint Management**
- 👷 **Staff Management** (Security, Housekeeping, etc.)
- 📅 **Event Management**
- 🚗 **Parking Management**
- 📸 **Document & Receipt Management** (Cloudflare R2)
- 💳 **Payment Gateway Integration** (Razorpay)
- 📱 **SMS Notifications** (MSG91/Twilio)
- 📧 **Email Notifications**
- 📈 **Advanced Analytics Dashboard**

---

## 🛠️ Tech Stack

### Backend
- **Framework:** [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Database:** [PostgreSQL](https://www.postgresql.org/) - Robust relational database
- **ORM:** [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Authentication:** JWT (JSON Web Tokens) + Passport.js
- **Validation:** class-validator & class-transformer

### Frontend (Coming Soon)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context / Zustand
- **UI Components:** shadcn/ui

### DevOps & Tools
- **Monorepo:** [Turborepo](https://turbo.build/) - High-performance build system
- **Package Manager:** [pnpm](https://pnpm.io/) - Fast, disk space efficient
- **Version Control:** Git
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest

### Infrastructure
- **Deployment:** Docker (planned)
- **File Storage:** Cloudflare R2 (planned)
- **SMS Gateway:** MSG91/Twilio (planned)
- **Payments:** Razorpay (planned)

---

## 📁 Project Structure

```
society-platform/
├── apps/
│   ├── api/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── common/        # Shared utilities (Prisma, Guards, etc.)
│   │   │   ├── financial/     # Expense & payment management
│   │   │   ├── flats/         # Flat management
│   │   │   ├── societies/     # Society management
│   │   │   ├── users/         # User management
│   │   │   ├── app.module.ts  # Root module
│   │   │   └── main.ts        # Application entry point
│   │   ├── test/              # E2E tests
│   │   └── package.json
│   │
│   └── web/                    # Next.js Frontend (Coming Soon)
│
├── packages/
│   ├── config/                 # Shared configuration
│   ├── database/              # Prisma schema & migrations
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Database schema
│   │   └── src/               # Database client export
│   ├── types/                 # Shared TypeScript types
│   ├── ui/                    # Shared UI components (planned)
│   └── utils/                 # Shared utilities
│
├── .env.example               # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Root package configuration
├── pnpm-workspace.yaml       # pnpm workspace config
├── turbo.json                # Turborepo configuration
└── README.md                 # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.15.0
- **PostgreSQL** >= 14.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd society-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database and other settings:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/society_platform"
   JWT_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # Or run migrations (for production)
   pnpm db:migrate
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

   The API will be available at: `http://localhost:4000/api`

---

## 💻 Development

### Database Management

```bash
# Generate Prisma Client after schema changes
pnpm db:generate

# Push schema changes to database (development)
pnpm db:push

# Create and run migrations (production)
pnpm db:migrate

# Open Prisma Studio (Database GUI)
pnpm db:studio
```

### Building

```bash
# Build all apps and packages
pnpm build

# Build specific workspace
pnpm --filter @repo/api build
```

### Code Quality

```bash
# Lint all workspaces
pnpm lint

# Type checking
pnpm type-check
```

### Testing

```bash
# Run tests
pnpm --filter @repo/api test

# Watch mode
pnpm --filter @repo/api test:watch

# E2E tests
pnpm --filter @repo/api test:e2e

# Coverage
pnpm --filter @repo/api test:cov
```

---

## 🗄️ Database Schema

### Core Entities

| Entity | Description | Key Fields |
|--------|-------------|------------|
| **Society** | Residential society/complex | name, address, totalFlats, maintenanceAmount |
| **Flat** | Individual units in society | flatNumber, block, floor, sqFeet, owner/tenant info |
| **User** | System users | phone, email, name, role, society |
| **ExpenseCategory** | Expense classification | name, budgetAmount, color |
| **Expense** | Society expenditures | amount, date, vendorName, category, receipt |
| **MaintenancePayment** | Monthly maintenance records | flat, month, year, amount, status, paymentMode |

### User Roles

- **ADMIN** - Full system access, manage societies
- **COMMITTEE** - Society committee members, approve expenses
- **TREASURER** - Financial management, payment tracking
- **RESIDENT** - View payments, submit requests
- **SECURITY** - Gate management (planned)

### Payment & Billing

**Billing Cycles:** MONTHLY | QUARTERLY | ANNUALLY

**Payment Status:** PENDING | PAID | OVERDUE | PARTIAL

**Payment Modes:** CASH | UPI | CHEQUE | BANK_TRANSFER | ONLINE

---

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Core Endpoints (Planned)

#### Authentication
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login with credentials
POST   /auth/refresh           # Refresh access token
GET    /auth/profile           # Get current user profile
```

#### Societies
```
GET    /societies              # List all societies
POST   /societies              # Create new society
GET    /societies/:id          # Get society details
PATCH  /societies/:id          # Update society
DELETE /societies/:id          # Delete society
```

#### Flats
```
GET    /flats                  # List all flats
POST   /flats                  # Add new flat
GET    /flats/:id              # Get flat details
PATCH  /flats/:id              # Update flat info
DELETE /flats/:id              # Remove flat
```

#### Financial
```
GET    /expenses               # List expenses
POST   /expenses               # Record new expense
GET    /expenses/categories    # List expense categories
POST   /maintenance/payments   # Record maintenance payment
GET    /maintenance/pending    # Get pending payments
GET    /reports/financial      # Financial summary
```

> **Note:** Full API documentation with Swagger/OpenAPI coming soon!

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/society_platform?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# API Configuration
API_PORT=4000
API_URL="http://localhost:4000"
CORS_ORIGIN="http://localhost:3000"

# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Optional: File Upload (Cloudflare R2)
# CLOUDFLARE_R2_ACCOUNT_ID=
# CLOUDFLARE_R2_ACCESS_KEY_ID=
# CLOUDFLARE_R2_SECRET_ACCESS_KEY=
# CLOUDFLARE_R2_BUCKET_NAME=

# Optional: SMS Gateway (MSG91/Twilio)
# MSG91_AUTH_KEY=
# MSG91_SENDER_ID=

# Optional: Payment Gateway (Razorpay)
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=
```

---

## 📜 Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run linting across all workspaces |
| `pnpm type-check` | Type check all TypeScript code |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Prisma Studio |

### API (apps/api)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start API in watch mode |
| `pnpm build` | Build API for production |
| `pnpm start:prod` | Run production build |
| `pnpm lint` | Lint API code |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm test:cov` | Generate test coverage |

---

## 🗺️ Roadmap

### Phase 1: Core Foundation ✅ (Current)
- [x] Project setup with Turborepo + pnpm
- [x] Database schema design
- [x] Basic authentication & authorization
- [x] Society, Flat, User management
- [x] Expense tracking
- [x] Maintenance payment tracking

### Phase 2: Enhanced Features 🚧 (In Progress)
- [ ] Frontend (Next.js + Tailwind CSS)
- [ ] Announcements & Notices
- [ ] Complaint management system
- [ ] Document upload (Cloudflare R2)
- [ ] Advanced reporting & analytics

### Phase 3: Integration & Automation 📅 (Planned)
- [ ] Payment gateway integration (Razorpay)
- [ ] SMS notifications (MSG91/Twilio)
- [ ] Email notifications
- [ ] Automated payment reminders
- [ ] Bulk operations & data import/export

### Phase 4: Advanced Features 🔮 (Future)
- [ ] Mobile app (React Native)
- [ ] Visitor management
- [ ] Parking slot allocation
- [ ] Asset management
- [ ] Meeting scheduler
- [ ] Voting system for society decisions
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the UNLICENSED License - see the package.json for details.

---

## 📧 Contact & Support

For questions, issues, or suggestions:

- **Issues:** [GitHub Issues](../../issues)
- **Discussions:** [GitHub Discussions](../../discussions)

---

<div align="center">

**Built with ❤️ for modern society management**

⭐ Star this repo if you find it helpful!

</div>
