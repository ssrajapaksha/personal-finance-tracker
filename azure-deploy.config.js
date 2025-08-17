module.exports = {
  // Azure App Service configuration
  azure: {
    // Node.js version for Azure
    nodeVersion: '18.17.0',
    
    // Build configuration
    build: {
      command: 'npm run build',
      outputDirectory: '.next',
      installCommand: 'npm ci --only=production'
    },
    
    // Environment variables
    environment: {
      NODE_ENV: 'production',
      PORT: '8080'
    },
    
    // PM2 configuration for process management
    pm2: {
      name: 'personal-finance-tracker',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: '8080'
      }
    }
  },
  
  // Web.config for Azure (if needed)
  webConfig: {
    rewrite: [
      {
        from: '/*',
        to: '/index.html'
      }
    ],
    headers: [
      {
        name: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        name: 'X-Content-Type-Options',
        value: 'nosniff'
      }
    ]
  }
};
