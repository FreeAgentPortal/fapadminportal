# FreeAgent Portal - Admin Dashboard

A comprehensive administrative portal built with Next.js 15.3.4 and React 19, designed for managing athletes, teams, support systems, subscriptions, and features within the FreeAgent ecosystem.

## 🚀 Features

### Core Administration

- **User Management**: Complete CRUD operations for users with role-based permissions and authentication controls
- **Team Management**: Comprehensive team oversight with profile editing, player management, and organizational tools
- **Athlete Portal**: Dedicated interface for managing athlete profiles, statistics, and career progression
- **Legal Document Management**: Mobile-responsive forms for creating and managing legal documents

### Advanced Management

- **Plans & Features Administration**: Subscription plan management with feature assignment and pricing control
- **Support System**: Multi-tiered support ticket management with group organization and agent assignment
- **Search Preferences**: Advanced search configuration and preference management
- **Role-Based Access Control**: Granular permission system with developer, admin, and user roles

### Technical Features

- **Dark Theme**: High-contrast dark mode with improved readability
- **Mobile-First Design**: Responsive interface optimized for all device sizes
- **Real-time Updates**: Socket.IO integration for live data synchronization
- **Advanced UI Components**: Custom modals, forms, and interactive elements with glassmorphism design

## 🛠 Technology Stack

### Frontend

- **Next.js 15.3.4**: React framework with App Router and server-side rendering
- **React 19**: Latest React version with compatibility patches
- **TypeScript**: Full type safety and enhanced developer experience
- **SCSS Modules**: Component-scoped styling with CSS variables and responsive design

### UI Framework

- **Ant Design**: Enterprise-class UI library with React 19 compatibility patches
- **Framer Motion**: Advanced animations and transitions
- **React Masonry CSS**: Dynamic grid layouts for dashboard cards

### State Management

- **Zustand**: Lightweight state management for global application state
- **TanStack React Query**: Server state management with caching and synchronization
- **Socket.IO Client**: Real-time communication with backend services

### Development Tools

- **ESLint**: Code linting with modern JavaScript/TypeScript rules
- **Recharts**: Data visualization and analytics charts
- **TinyMCE**: Rich text editor for content management

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin-specific routes
│   ├── athletes/          # Athlete management
│   ├── teams/             # Team management
│   └── account_details/   # User account management
├── components/            # Reusable UI components
│   ├── blockedMessage/    # User blocking interface
│   ├── copyField/         # Copy-to-clipboard utility
│   ├── pagination/        # Data pagination controls
│   └── userItem/          # User card components
├── views/                 # Page-level components
│   ├── admin/            # Admin panel views
│   ├── dashboard/        # Main dashboard
│   ├── support/          # Support system
│   └── auth/             # Authentication views
├── layout/               # Layout components
│   ├── header/           # Navigation header
│   ├── sideBar/          # Navigation sidebar
│   └── container/        # Page containers
├── state/                # Zustand stores
│   ├── auth.ts           # Authentication state
│   ├── interface.ts      # UI state management
│   └── search.ts         # Search preferences
├── types/                # TypeScript interfaces
├── utils/                # Utility functions
│   ├── roleUtils.ts      # Role-based access control
│   ├── axios.ts          # API configuration
│   └── errorHandler.ts   # Error management
└── styles/               # Global styles and themes
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, pnpm, or bun package manager
- Access to FreeAgent Portal API

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
API_URL=https://api.freeagentportal.com/api/v1
AUTH_URL=your_auth_service_url

# Service Configuration
SERVICE_NAME=freeagent-admin
NODE_ENV=development

# Application URLs
TEAMS_APP_URL=https://teams.freeagentportal.com
ADMIN_APP_URL=https://admin.freeagentportal.com
SCOUT_APP_URL=https://scout.freeagentportal.com

# External Services
TINYMCE_API_KEY=your_tinymce_api_key

# Security (Use secure random key in production)
ENCRYPTION_KEY=your_secure_encryption_key_here
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd freeagentadmin
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment**
   Copy `.env.example` to `.env.local` and update the values

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Authentication

The application uses role-based authentication with the following roles:

- **Admin**: Full system access
- **Developer**: Advanced features including Plans & Features management
- **User**: Basic access with limited permissions

### Navigation

- **Dashboard**: Overview of system metrics and quick actions
- **Athletes**: Manage athlete profiles and career data
- **Teams**: Team administration and member management
- **Support**: Ticket management and customer support
- **Admin Panel**:
  - Plans & Features: Subscription management
  - User Management: User administration
  - Legal Documents: Document creation and management

### Key Features

#### User Management

- Create, edit, and delete user accounts
- Password reset functionality
- Role assignment and permission management
- Profile reference management

#### Plans & Features

- Create subscription plans with pricing tiers
- Feature assignment to plans
- Billing cycle configuration
- Popular plan designation

#### Support System

- Multi-tiered support groups
- Ticket assignment and tracking
- Agent management
- Real-time updates

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment-Specific Builds

The application supports multiple deployment environments:

**Development**

```bash
NODE_ENV=development npm run dev
```

**Staging**

```bash
NODE_ENV=staging npm run build
```

**Production**

```bash
NODE_ENV=production npm run build
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

#### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Manual Deployment

1. Run `npm run build`
2. Copy `.next`, `public`, `package.json`, and `next.config.ts` to server
3. Run `npm install --production`
4. Start with `npm start`

## 🔐 Security

### Authentication

- JWT-based authentication with role verification
- Secure API endpoint protection
- Session management with automatic renewal

### Data Protection

- Encrypted sensitive data transmission
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

### Role-Based Access

- Granular permission system
- Route-level protection
- Component-level access control

## 🎨 Customization

### Theming

The application uses CSS variables for consistent theming:

```scss
:root {
  --primary: #1890ff;
  --secondary: #000000;
  --background: #ffffff;
  --text: #000000;
}

[data-theme="dark"] {
  --background: #141414;
  --text: #ffffff;
}
```

### Component Styling

- SCSS Modules for component-specific styles
- Mobile-first responsive design
- Consistent spacing and typography

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript strict mode
2. Use SCSS Modules for styling
3. Implement proper error handling
4. Maintain responsive design principles
5. Follow React 19 best practices

### Code Standards

- Use ESLint configuration
- Implement proper TypeScript interfaces
- Follow component composition patterns
- Maintain consistent file structure

### Testing

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## 📖 API Integration

### useApiHook Pattern

```typescript
const { data, isLoading, error } = useApiHook({
  url: "/endpoint",
  method: "GET",
  key: ["cache-key"],
  enabled: true,
});
```

### Mutation Example

```typescript
const { mutate } = useApiHook({
  method: "POST",
  key: "create-item",
  queriesToInvalidate: ["items-list"],
});
```

## 🐛 Troubleshooting

### Common Issues

**Module Resolution Errors**

- Ensure TypeScript paths are configured correctly
- Check import statements use absolute paths

**API Connection Issues**

- Verify API_URL environment variable
- Check CORS configuration
- Validate authentication tokens

**Styling Issues**

- Clear browser cache
- Check SCSS compilation
- Verify CSS variable definitions

### Performance Optimization

- Use React Query for data caching
- Implement proper component memoization
- Optimize image loading with Next.js Image component

## 📝 License

This project is proprietary software for the FreeAgent Portal ecosystem.

## 📞 Support

For technical support or questions about this application:

- Internal Documentation: Check project wiki
- API Issues: Contact backend team
- UI/UX Issues: Contact frontend team

---

Built with ❤️ using Next.js 15.3.4 and React 19
