# GitHub Pages Deployment Guide

This document explains how to deploy the WhatsApp Chat Analyzer to GitHub Pages using GitHub Actions.

## 🚀 Automated Deployment Setup

### Prerequisites
1. GitHub repository with your project code
2. Repository name should match the base path in `vite.config.ts`
3. Node.js project with Vite build configuration

### Configuration Files

#### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- **Trigger**: Automatically runs on every push to `main` branch
- **Permissions**: Configured for GitHub Pages deployment
- **Steps**: 
  - Checkout code
  - Setup Node.js 18
  - Install dependencies with `npm ci`
  - Build project with `npm run build`
  - Deploy to GitHub Pages

#### 2. Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/Whatsapp-Chat-Analyser/', // Must match your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
```

### 🔧 GitHub Repository Settings

#### Enable GitHub Pages
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

#### Repository Permissions
The workflow requires these permissions (configured in `deploy.yml`):
- `contents: read` - To clone the repository
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For authentication

## 📦 Deployment Process

### Automatic Deployment
1. **Push to main branch**: Every push triggers the deployment
2. **GitHub Actions runs**: Build and deployment process starts automatically
3. **Live site**: Your app will be available at `https://yourusername.github.io/Whatsapp-Chat-Analyser/`

### Manual Deployment
You can also trigger deployment manually:
1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button

## 🌐 Access Your Deployed App

After successful deployment, your app will be available at:
```
https://[your-username].github.io/Whatsapp-Chat-Analyser/
```

## 🔍 Monitoring Deployment

### Check Deployment Status
1. **Actions Tab**: Monitor build and deployment progress
2. **Pages Section**: View deployment history and status
3. **Environment**: Check the `github-pages` environment for live URL

### Common Issues & Solutions

#### Build Failures
- **Node.js Version**: Ensure using Node.js 18+ in workflow
- **Dependencies**: Check if all dependencies are properly listed in `package.json`
- **TypeScript Errors**: Fix any TypeScript compilation errors

#### Deployment Failures
- **Base Path**: Ensure `base` in `vite.config.ts` matches repository name
- **Permissions**: Verify GitHub Pages permissions are enabled
- **Branch Protection**: Ensure main branch allows GitHub Actions

#### Asset Loading Issues
- **Relative Paths**: All assets should use relative paths
- **Base URL**: Vite's `base` configuration handles asset paths automatically
- **Router Configuration**: If using client-side routing, configure for GitHub Pages

## 🛠️ Development Workflow

### Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to GitHub Pages
The deployment happens automatically on push to main, but you can also:
```bash
npm run deploy  # If you add gh-pages package
```

## 📋 Deployment Checklist

- [ ] Repository created on GitHub
- [ ] GitHub Actions workflow file created
- [ ] Vite config updated with correct base path
- [ ] GitHub Pages enabled in repository settings
- [ ] Code pushed to main branch
- [ ] First deployment completed successfully
- [ ] App accessible via GitHub Pages URL

## 🔄 Updates and Maintenance

### Updating the App
1. Make your changes locally
2. Test with `npm run dev`
3. Commit and push to main branch
4. GitHub Actions will automatically deploy the updates

### Monitoring
- **Actions**: Check the Actions tab for deployment status
- **Issues**: Monitor for any build or deployment failures
- **Performance**: Use browser dev tools to check loading performance

## 📝 Notes

- **Build Time**: Initial deployment may take 3-5 minutes
- **Propagation**: Changes may take a few minutes to appear on the live site
- **Cache**: Browser caching may require hard refresh to see updates
- **Analytics**: Consider adding Google Analytics for usage tracking

## 🚨 Security Considerations

- **Client-Side Only**: This app processes files entirely in the browser
- **No Server**: No backend server means no data is stored remotely
- **Privacy**: WhatsApp chat data never leaves the user's device
- **HTTPS**: GitHub Pages serves over HTTPS by default
