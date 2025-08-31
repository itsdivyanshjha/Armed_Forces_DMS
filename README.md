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

## 🚀 Setup

```bash
# Install dependencies
npm install

# Start development server  
npm start

# Access platform
http://localhost:3000
```

For AI capabilities, install Ollama and run:
```bash
ollama pull llama3.1:latest
ollama serve
```

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