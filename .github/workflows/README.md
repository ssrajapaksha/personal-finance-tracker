# GitHub Actions Workflows - Azure Deployment

This directory contains GitHub Actions workflows for CI/CD automation to Azure App Service.

## Workflows

### 1. CI (`ci.yml`)
- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Purpose**: Code quality checks and testing
- **Features**:
  - Runs on Node.js 18 and 20
  - Installs dependencies
  - Runs linting (`npm run lint`)
  - Runs tests (`npm run test`)
  - Type checking (`npx tsc --noEmit`)
  - Build verification (`npm run build`)

### 2. Deploy to Azure (`deploy-azure.yml`)
- **Triggers**: Push to `main` branch, Pull Requests
- **Purpose**: Automatic deployment to Azure App Service
- **Features**:
  - Production deployment on `main` branch
  - Preview deployment on Pull Requests
  - Runs after CI checks pass
  - Uses Azure Web Apps Deploy action

## Required Secrets

Set these secrets in your GitHub repository settings:

### Azure Configuration
- `AZURE_WEBAPP_NAME`: Your Azure App Service name
- `AZURE_WEBAPP_PUBLISH_PROFILE`: Your Azure publish profile XML content

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## How to Get Azure Secrets

### 1. AZURE_WEBAPP_NAME
- Go to Azure Portal → App Services
- Copy the name of your web app

### 2. AZURE_WEBAPP_PUBLISH_PROFILE
- In Azure Portal → App Service → Overview
- Click "Get publish profile"
- Download the `.publishsettings` file
- Copy the entire XML content
- Paste as the secret value

## Azure App Service Setup

### 1. Create App Service
```bash
# Using Azure CLI
az group create --name myResourceGroup --location eastus
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name your-app-name --runtime "NODE|18-lts"
```

### 2. Configure Environment Variables
```bash
az webapp config appsettings set --resource-group myResourceGroup --name your-app-name --settings \
  NODE_ENV=production \
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url \
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### 3. Enable Continuous Deployment
```bash
az webapp deployment source config --resource-group myResourceGroup --name your-app-name \
  --repo-url https://github.com/username/repo --branch main --manual-integration
```

## Workflow Behavior

### On Push to Main
1. CI workflow runs tests and builds
2. If CI passes, deploy workflow deploys to production
3. Production URL is updated

### On Pull Request
1. CI workflow runs tests and builds
2. If CI passes, deploy workflow creates preview deployment
3. Preview URL is available in Azure

### On Push to Develop
1. Only CI workflow runs
2. No deployment (development branch)

## Azure-Specific Files

### 1. `web.config`
- IIS configuration for Azure App Service
- Handles routing and security headers
- Optimized for Next.js applications

### 2. `server.js`
- Custom Node.js server for Azure
- Handles static files and API routes
- Optimized for production deployment

### 3. `azure-deploy.config.js`
- Azure deployment configuration
- Build and environment settings
- PM2 process management

## Local Testing

To test workflows locally:

```bash
# Install act (GitHub Actions local runner)
npm install -g @nektos/act

# Run CI workflow locally
act pull_request

# Run deploy workflow locally
act push
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Test Failures**: Ensure all tests pass locally with `npm test`
3. **Deployment Failures**: Verify Azure secrets are correctly set
4. **Environment Variables**: Ensure Supabase secrets are available
5. **Azure Permissions**: Check that your service principal has proper access

### Debug Mode

Enable debug logging by adding this secret:
- `ACTIONS_STEP_DEBUG`: Set to `true`

### Azure Logs

Check Azure App Service logs:
```bash
az webapp log tail --resource-group myResourceGroup --name your-app-name
```

## Performance Optimization

- Uses `npm ci` for faster, reliable dependency installation
- Caches npm dependencies between runs
- Matrix testing on multiple Node.js versions
- Optimized Azure deployment with proper file packaging
- Custom server configuration for better performance

## Security Features

- Security headers in web.config
- Environment variable protection
- HTTPS enforcement (configure in Azure)
- Input validation and sanitization
- Proper error handling without information leakage

## Cost Optimization

- Use appropriate App Service Plan tier
- Enable auto-scaling based on demand
- Monitor resource usage in Azure Portal
- Use Azure Dev/Test subscription for development
