const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const adminHashedPassword = bcrypt.hashSync('admin123', salt);
const customerHashedPassword = bcrypt.hashSync('customer123', salt);

const initialCategories = [
  'Software & Boilerplates',
  'UI & Design Kits',
  'E-Books & Guides',
  'Templates & Tools',
  'Website Templates'
];

const initialUsers = [
  {
    id: 'user_admin',
    name: 'Store Admin',
    email: 'admin@store.com',
    password: adminHashedPassword,
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user_customer_1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: customerHashedPassword,
    role: 'customer',
    createdAt: '2026-02-15T10:30:00.000Z'
  }
];

const initialProducts = [
  {
    id: 'prod_1',
    title: 'SaaS Boilerplate Pro (Next.js 14 + Stripe + Auth)',
    slug: 'saas-boilerplate-pro',
    category: 'Software & Boilerplates',
    price: 79,
    originalPrice: 129,
    rating: 4.9,
    reviewCount: 38,
    badge: 'Best Seller',
    summary: 'Ship your SaaS in days, not months. Includes Stripe subscriptions, auth, email, database migrations, and clean UI components.',
    description: `A production-grade, highly opinionated Next.js starter kit equipped with everything you need to build, launch, and monetize web apps quickly.

### What is Included:
- **Next.js 14 App Router** with full TypeScript support
- **Stripe Subscriptions & Webhooks** pre-configured for monthly/yearly tiers
- **Authentication**: Email/Password, Magic Links, and OAuth (GitHub & Google)
- **Database**: Prisma ORM with PostgreSQL / SQLite support
- **UI Components**: Modern Tailwind CSS + Radix UI / shadcn style
- **SEO & OpenGraph**: Auto-generated meta tags, sitemaps, and robots.txt
- **Lifetime Updates** and private GitHub repo access.`,
    features: [
      'Next.js 14 + TypeScript + Tailwind CSS',
      'Stripe recurring billing & checkout integration',
      'User auth & session management',
      'SEO optimized & ready for Vercel/Render deploy',
      'Production deployment checklist'
    ],
    fileDetails: {
      fileName: 'saas-boilerplate-pro-v2.4.zip',
      fileSize: '14.8 MB',
      format: 'ZIP Archive',
      version: 'v2.4.0',
      licenseType: 'Unlimited Commercial License'
    },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T12:00:00.000Z'
  },
  {
    id: 'prod_2',
    title: 'Nexus: Ultimate Figma Design System & UI Kit',
    slug: 'nexus-figma-design-system',
    category: 'UI & Design Kits',
    price: 49,
    originalPrice: 89,
    rating: 4.8,
    reviewCount: 54,
    badge: 'Popular',
    summary: 'Over 2,400+ responsive components, design tokens, light & dark mode variants, and 50+ pre-designed SaaS dashboards.',
    description: `Accelerate your product design workflow by 10x. Built specifically for UI/UX designers, developers, and product managers.

### Key Highlights:
- **2,400+ Components & Variants** with Auto Layout 5.0
- **Design Tokens**: Standardized colors, spacing, typography, and shadow variables
- **50+ Pre-built Pages**: Dashboard layouts, analytics, settings, checkout flows, and profiles
- **WCAG 2.1 AA Compliant** color contrast tested
- **Free Updates**: Regularly updated with new Figma features and components.`,
    features: [
      'Auto-Layout 5.0 on all components',
      'Light & Dark mode variable support',
      '50+ full page screen templates',
      'Font & color token guides',
      'Includes Figma file (.fig) and interactive demo'
    ],
    fileDetails: {
      fileName: 'nexus-design-system-v3.2.fig',
      fileSize: '88.5 MB',
      format: 'Figma (.fig) + Design Tokens (.json)',
      version: 'v3.2.0',
      licenseType: 'Commercial Use'
    },
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T12:00:00.000Z'
  },
  {
    id: 'prod_3',
    title: 'Designing Data-Intensive Microservices (Handbook)',
    slug: 'designing-data-intensive-microservices',
    category: 'E-Books & Guides',
    price: 29,
    originalPrice: 45,
    rating: 5.0,
    reviewCount: 29,
    badge: 'Staff Pick',
    summary: 'A deep-dive, practical engineering guide on designing distributed systems, event-driven architectures, caching, and resilient APIs.',
    description: `A masterclass in real-world backend architecture. Written for senior engineers and engineering leads who want to master fault-tolerant distributed systems.

### Chapters Covered:
1. Decomposing Monoliths to Microservices cleanly
2. Event-Driven Architectures with Kafka & RabbitMQ
3. Distributed Caching Strategies (Redis & CDN layers)
4. Database Partitioning, Sharding & Replication
5. Handling Transactions across distributed boundaries (Saga Pattern)
6. Zero-Downtime Deployments & Observability.`,
    features: [
      '320 pages of illustrated diagrams & code examples',
      'Includes PDF, EPUB, and Kindle MOBI formats',
      'Bonus: 10 production architecture incident post-mortems',
      'Downloadable system design cheat sheets'
    ],
    fileDetails: {
      fileName: 'data-intensive-microservices-guide.pdf',
      fileSize: '24.2 MB',
      format: 'PDF, EPUB, MOBI',
      version: '2nd Edition',
      licenseType: 'Single User License'
    },
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'prod_4',
    title: 'DevOps & Kubernetes Production Cluster Blueprint',
    slug: 'devops-k8s-production-blueprint',
    category: 'Software & Boilerplates',
    price: 69,
    originalPrice: 99,
    rating: 4.7,
    reviewCount: 19,
    badge: 'New',
    summary: 'Turnkey Infrastructure-as-Code: Terraform, Helm charts, CI/CD GitHub Actions, ArgoCD, Prometheus & Grafana dashboards.',
    description: `Stop reinventing Kubernetes cluster setups. Deploy enterprise-ready Kubernetes infrastructure on AWS (EKS), GCP (GKE), or Hetzner in minutes with validated Terraform scripts.`,
    features: [
      'Terraform modules for AWS EKS & GCP GKE',
      'ArgoCD GitOps deployment workflows',
      'Prometheus, Grafana & Loki observability stack',
      'Automated SSL via cert-manager and Let’s Encrypt',
      'Hardened security baseline & network policies'
    ],
    fileDetails: {
      fileName: 'k8s-production-blueprint-v1.8.zip',
      fileSize: '32.1 MB',
      format: 'Terraform & Helm scripts (ZIP)',
      version: 'v1.8.0',
      licenseType: 'Team Commercial License'
    },
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T12:00:00.000Z'
  },
  {
    id: 'prod_5',
    title: 'Executive Notion Operating System & Productivity OS',
    slug: 'executive-notion-operating-system',
    category: 'Templates & Tools',
    price: 19,
    originalPrice: 35,
    rating: 4.9,
    reviewCount: 82,
    badge: 'Popular',
    summary: 'All-in-one Notion workspace template: Task manager, CRM, Goal Tracker (OKRs), Financial dashboard, and Habit tracker.',
    description: `Organize your personal projects, business ventures, finances, and daily habits with a streamlined, interconnected Notion system.`,
    features: [
      '1-Click duplicate into your personal or team Notion',
      'Built-in automated database relationships & rollups',
      'Sprint planner and GTD (Getting Things Done) framework',
      'Client invoice & proposal trackers',
      'Includes step-by-step video setup walkthrough'
    ],
    fileDetails: {
      fileName: 'notion-executive-os-bundle.pdf',
      fileSize: '6.4 MB',
      format: 'PDF Guide + One-Click Duplicate URL',
      version: '2026 Edition',
      licenseType: 'Personal & Professional Use'
    },
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-18T12:00:00.000Z'
  },
  {
    id: 'prod_6',
    title: 'Aura: Astro + Tailwind Developer Portfolio & Blog',
    slug: 'aura-astro-portfolio-template',
    category: 'Website Templates',
    price: 35,
    originalPrice: 50,
    rating: 4.6,
    reviewCount: 22,
    badge: 'Staff Pick',
    summary: 'Ultra-fast, 100/100 Lighthouse score portfolio with MDX blog, project showcase, dark mode, and newsletter integration.',
    description: `Stand out with a modern developer portfolio that loads instantly. Features seamless page transitions, interactive code snippets, and responsive layout.`,
    features: [
      'Built on Astro 4 & Tailwind CSS',
      'Perfect 100 PageSpeed & SEO score out of the box',
      'MDX supported blog with syntax highlighting',
      'Contact form ready for Formspree / Web3Forms',
      'Zero client-side JS overhead by default'
    ],
    fileDetails: {
      fileName: 'aura-astro-portfolio-theme.zip',
      fileSize: '8.3 MB',
      format: 'ZIP (Node/Astro Source)',
      version: 'v2.0.1',
      licenseType: 'Commercial License'
    },
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-20T12:00:00.000Z'
  }
];

const initialReviews = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    userName: 'Marcus Sterling',
    userRole: 'Founder @ DevSprint',
    rating: 5,
    comment: 'Saved our team at least 4 weeks of boilerplating auth and Stripe billing. The code is modular, type-safe, and cleanly structured.',
    createdAt: '2026-02-02T14:22:00.000Z',
    verifiedPurchase: true
  },
  {
    id: 'rev_2',
    productId: 'prod_1',
    userName: 'Elena Rostova',
    userRole: 'Fullstack Dev',
    rating: 5,
    comment: 'The Stripe webhook implementation alone is worth the price. Handled customer portal redirects and subscription cancellations flawlessly.',
    createdAt: '2026-02-14T09:15:00.000Z',
    verifiedPurchase: true
  },
  {
    id: 'rev_3',
    productId: 'prod_2',
    userName: 'David Chen',
    userRole: 'Product Designer',
    rating: 5,
    comment: 'The Figma variables and auto-layout setup are state-of-the-art. Easily the best design system purchase I have made this year.',
    createdAt: '2026-02-18T18:40:00.000Z',
    verifiedPurchase: true
  },
  {
    id: 'rev_4',
    productId: 'prod_3',
    userName: 'Sarah Jenkins',
    userRole: 'Staff Engineer',
    rating: 5,
    comment: 'Super practical. The chapter on event-driven sagas helped us solve a stubborn data inconsistency issue in production.',
    createdAt: '2026-02-19T11:05:00.000Z',
    verifiedPurchase: true
  }
];

const initialOrders = [
  {
    id: 'ord_demo_101',
    userId: 'user_customer_1',
    customerEmail: 'alex@example.com',
    customerName: 'Alex Johnson',
    items: [
      {
        productId: 'prod_1',
        title: 'SaaS Boilerplate Pro (Next.js 14 + Stripe + Auth)',
        price: 79,
        quantity: 1,
        downloadFileName: 'saas-boilerplate-pro-v2.4.zip',
        licenseKey: 'SBPRO-89F2-47A1-BC99-2026'
      },
      {
        productId: 'prod_3',
        title: 'Designing Data-Intensive Microservices (Handbook)',
        price: 29,
        quantity: 1,
        downloadFileName: 'data-intensive-microservices-guide.pdf',
        licenseKey: 'MICRO-55E8-31C4-AA12-2026'
      }
    ],
    totalAmount: 108,
    status: 'completed',
    paymentMethod: 'Stripe (Card ending in 4242)',
    stripeSessionId: 'cs_test_mock_seeded_session_101',
    createdAt: '2026-02-16T15:30:00.000Z'
  }
];

module.exports = {
  initialCategories,
  initialUsers,
  initialProducts,
  initialReviews,
  initialOrders
};
