# Intelligence Hub
**AI-Powered Defense Analytics Platform**

## 🎯 Objective

A professional military-grade analytics platform that processes defense datasets and provides AI-powered insights through conversational intelligence and interactive visualizations for strategic decision-making.

## 🚀 Features

- **Command Dashboard**: Real-time defense metrics and KPIs visualization
- **AI Military Analyst**: Natural language query interface powered by Ollama (Llama 3.1)
- **Personnel Analytics**: Army recruitment trends and regional analysis
- **Financial Intelligence**: Budget allocation and defense export analysis  
- **Strategic Analysis**: Global military positioning and threat assessment
- **Data Processing**: Automated CSV/Excel parsing and cross-dataset correlation

## ⚙️ How It Works

1. **Data Loading**: Automatically processes 8 defense datasets from CSV/Excel files
2. **Processing**: Transforms raw data into strategic intelligence metrics
3. **Visualization**: Generates interactive charts and dashboards with military styling
4. **AI Analysis**: Uses Ollama Llama 3.1 for natural language query processing
5. **Intelligence**: Provides actionable insights and strategic recommendations

## 📊 Dataset Overview

| Dataset | Content | Period |
|---------|---------|--------|
| Army Recruits | Personnel recruitment trends | 2017-2022 |
| Defence Export | International sales performance | 2017-2025 |
| Defence Production | Indigenous production capabilities | 2017-2024 |
| Defense Budget Trends | Budget allocation patterns | Historical |
| Defense Cluster Budget | Detailed budget breakdowns | Current |
| Global Armed Forces | International military comparisons | Current |
| Indo-Pak Conflict | Security threat analysis | Historical |
| Military Expenditure | Indo-Pak spending comparison | 1960-2023 |

## 📁 File Structure

```
Intelligence Hub/
├── public/
│   └── datasets/           # CSV/Excel data files
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.js
│   │   ├── ChatInterface.js
│   │   └── Analytics modules
│   ├── services/           # Data processing & AI
│   │   ├── dataLoader.js
│   │   ├── dataProcessors.js
│   │   └── ollamaService.js
│   └── styles/            # Theming & CSS
├── README.md
└── OLLAMA_SETUP.md        # AI setup instructions
```

## 🚀 Local Development Setup

```bash
# Clone repository
git clone <your-repo-url>
cd armed-forces-dms

# Install dependencies
npm install

# Start development server  
npm start

# Access platform
http://localhost:3000
```

### AI Setup (Optional - for local development)
For AI capabilities, install Ollama and run:
```bash
ollama pull llama3.1:latest
ollama serve
```

## 🌐 Vercel Deployment

### Prerequisites
1. GitHub repository with your code
2. Vercel account (free tier available)

### Deployment Steps

#### Method 1: Vercel Dashboard (Recommended)
1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Build Command: `npm run vercel-build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables** (Optional)
   - Add in Vercel dashboard under "Environment Variables":
   ```
   REACT_APP_APP_NAME=Armed Forces Intelligence Hub
   GENERATE_SOURCEMAP=false
   CI=false
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build completion
   - Your app will be live at `https://your-project-name.vercel.app`

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings
# - Deploy
```

### Production Features
- ✅ **Datasets**: All CSV/Excel files automatically served from `/public/datasets/`
- ✅ **Visualizations**: All charts and analytics work without backend
- ✅ **AI Chat**: Uses intelligent fallback responses (no Ollama server needed)
- ✅ **Responsive**: Optimized for desktop and mobile viewing
- ✅ **Performance**: Optimized build with caching headers
- ✅ **Security**: Proper headers and CORS configuration

### Post-Deployment
1. **Test All Features**
   - Command Dashboard visualizations
   - Financial and Strategic Analytics
   - AI Intelligence chat with sample queries
   - All navigation and responsive design

2. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS records as instructed

3. **Share with Team**
   - Send Vercel URL to developers/clients
   - All features work immediately without setup

## 🎯 Demo Scenarios

**Personnel Analysis**: "Show Army recruitment trends from 2017-2022"
- Displays recruitment patterns, regional distribution, and growth analysis

**Export Intelligence**: "Compare India's defense exports growth over 8 years"  
- Analyzes export performance, market penetration, and international sales

**Budget Review**: "What's the breakdown of defense budget allocation?"
- Shows budget trends, allocation efficiency, and spending patterns

**Strategic Assessment**: "How does India's military expenditure compare to Pakistan?"
- Provides comparative analysis, expenditure ratios, and strategic implications

**Threat Analysis**: "Analyze Indo-Pak conflict escalation patterns"
- Presents conflict timeline, severity trends, and risk assessment

---

**Tech Stack**: React 18, Ant Design, Recharts, Ollama, Styled Components  
**Classification**: FOR OFFICIAL USE ONLY