# Integra Explorer Platform

A blockchain explorer for the Integra ecosystem, built on Cloudflare Pages with edge computing capabilities.

## 🚀 Live Deployments

- **Production**: [https://integra-explorer-platform.pages.dev](https://integra-explorer-platform.pages.dev)
- **Staging**: [https://staging.integra-explorer-platform.pages.dev](https://staging.integra-explorer-platform.pages.dev)

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Chakra UI
- **Data Fetching**: tRPC with React Query
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Hosting**: Cloudflare Pages
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/IntegraLedger/integra-explorer-platform.git
cd integra-explorer-platform

# Install dependencies
npm install
```

## 🔧 Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

## 🏗️ Building

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## 🚢 Deployment

Deployments are automated via GitHub Actions:

- **Main branch** → Production environment
- **Staging branch** → Staging environment
- **Pull requests** → Preview deployments

### Manual Deployment

```bash
# Deploy to staging
wrangler pages deploy dist --project-name integra-explorer-platform --branch staging

# Deploy to production
wrangler pages deploy dist --project-name integra-explorer-platform --branch main
```

## 🗄️ Database Configuration

The application uses different D1 databases for each environment:

- **Development**: `blockchain-index-dev`
- **Staging**: `blockchain-index-staging`
- **Production**: `blockchain-index-prod`

Database bindings are configured in `wrangler.toml`.

## 🔐 Environment Variables

Required GitHub Secrets for CI/CD:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages write access
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## 📝 Features

- Real-time blockchain transaction explorer
- Multi-chain support (Ethereum, Polygon, Base, Avalanche, etc.)
- Transaction search by hash, block, or Integra ID
- Detailed transaction and block views
- Responsive design with dark mode support
- Edge-powered API with sub-second response times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Integra ecosystem.

## 🛟 Support

For issues and questions, please use the [GitHub Issues](https://github.com/IntegraLedger/integra-explorer-platform/issues) page.