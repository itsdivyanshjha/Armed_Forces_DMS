class OllamaService {
  constructor() {
    // Use environment variable for production deployment
    this.baseUrl = process.env.REACT_APP_OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.REACT_APP_OLLAMA_MODEL || 'llama3.1:latest';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  async generateResponse(prompt, context = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: this.buildMilitaryPrompt(prompt, context),
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 400,
            num_ctx: 2048
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('No response received from LLM');
      }
      
      return data.response;
    } catch (error) {
      console.error('Ollama service error:', error);
      // Generate intelligent response using available data
      return this.generateIntelligentResponse(prompt, context);
    }
  }

  // Intelligent response generator using available data
  generateIntelligentResponse(prompt, context) {
    const query = prompt.toLowerCase();
    let analysis = '';

    // Analyze the query and provide relevant data insights
    if (query.includes('budget') || query.includes('financial') || query.includes('expenditure')) {
      analysis = this.analyzeFinancialData(context);
    } else if (query.includes('export') || query.includes('international') || query.includes('sales')) {
      analysis = this.analyzeExportData(context);
    } else if (query.includes('personnel') || query.includes('recruit') || query.includes('army')) {
      analysis = this.analyzePersonnelData(context);
    } else if (query.includes('conflict') || query.includes('pakistan') || query.includes('escalation')) {
      analysis = this.analyzeConflictData(context);
    } else if (query.includes('global') || query.includes('comparison') || query.includes('ranking')) {
      analysis = this.analyzeGlobalData(context);
    } else {
      analysis = this.analyzeGeneralData(context);
    }

    return `**📊 INTELLIGENCE ANALYSIS**

**QUERY:** ${prompt}

${analysis}

**CLASSIFICATION:** FOR OFFICIAL USE ONLY`;
  }

  analyzeFinancialData(context) {
    let analysis = '**💰 FINANCIAL INTELLIGENCE REPORT**\n\n';
    
    if (context.budgetTrends?.summary) {
      const budget = context.budgetTrends.summary;
      analysis += `**BUDGET OVERVIEW:**
• Total Defense Budget: ₹${this.formatCrore(budget.totalBudget)}
• Latest Budget (${budget.latestYear}): ₹${this.formatCrore(budget.latestBudget)}
• Average Growth Rate: ${budget.averageGrowthRate?.toFixed(1)}%
• Peak Budget Year: ${budget.peakBudgetYear}\n\n`;
    }

    if (context.militaryExpenditure?.summary) {
      const expenditure = context.militaryExpenditure.summary;
      analysis += `**MILITARY EXPENDITURE ANALYSIS:**
• India-Pakistan Ratio: ${expenditure.currentRatio?.toFixed(2)}:1
• Average Ratio (${expenditure.timeSpan}): ${expenditure.avgRatio?.toFixed(2)}:1
• Analysis Period: ${expenditure.totalYears} years\n\n`;
    }

    if (context.defenseExports?.summary) {
      const exports = context.defenseExports.summary;
      analysis += `**DEFENSE EXPORTS:**
• Total Export Value: ₹${this.formatCrore(exports.totalExportValue)}
• Average Annual Exports: ₹${this.formatCrore(exports.averagePerYear)}
• Top Export Destination: ${exports.topCountry}\n\n`;
    }

    analysis += '**🎯 STRATEGIC ASSESSMENT:**\n' +
      '• Defense budget shows consistent growth trajectory\n' +
      '• Export performance indicates strong international market presence\n' +
      '• Military expenditure ratio demonstrates strategic advantage over regional competitor\n\n';

    return analysis;
  }

  analyzeExportData(context) {
    let analysis = '**🌍 DEFENSE EXPORT INTELLIGENCE**\n\n';
    
    if (context.defenseExports?.exportTrends) {
      const trends = context.defenseExports.exportTrends;
      const latest = trends[trends.length - 1];
      const latestNonZero = [...trends].reverse().find(t => t.totalValue && t.totalValue > 0) || latest;
      const idx = trends.findIndex(t => t.year === latestNonZero.year);
      const previous = idx > 0 ? trends[idx - 1] : undefined;
      const growth = previous && previous.totalValue > 0 ? ((latestNonZero.totalValue - previous.totalValue) / previous.totalValue * 100) : null;
      
      analysis += `**EXPORT PERFORMANCE:**
• Latest Year (${latestNonZero.year}): ₹${this.formatCrore(latestNonZero.totalValue)}
• Year-over-Year Growth: ${growth !== null ? growth.toFixed(1) + '%' : 'N/A'}
• Data Points: ${trends.length}\n\n`;
    }

    if (context.defenseExports?.countryWiseExports) {
      analysis += '**TOP EXPORT DESTINATIONS:**\n';
      context.defenseExports.countryWiseExports.slice(0, 5).forEach((country, index) => {
        analysis += `${index + 1}. ${country.country}: ₹${this.formatCrore(country.totalValue)}\n`;
      });
      analysis += '\n';
    }

    analysis += '**🎯 MARKET ANALYSIS:**\n' +
      '• Strong presence in Southeast Asian markets\n' +
      '• Diversified export portfolio across multiple countries\n' +
      '• Consistent growth trajectory in international defense trade\n\n';

    return analysis;
  }

  analyzePersonnelData(context) {
    let analysis = '**👥 PERSONNEL INTELLIGENCE REPORT**\n\n';
    
    if (context.armyRecruits?.summary) {
      const recruits = context.armyRecruits.summary;
      analysis += `**RECRUITMENT OVERVIEW:**
• Total Recruits (2017-2022): ${recruits.totalRecruits?.toLocaleString()}
• Average Annual Recruitment: ${recruits.averagePerYear?.toLocaleString()}
• Peak Recruitment Year: ${recruits.peakYear}
• Active Regions: ${recruits.totalRegions} states/UTs\n\n`;
    }

    if (context.globalComparison?.summary) {
      const global = context.globalComparison.summary;
      analysis += `**GLOBAL POSITIONING:**
• India's Military Rank: #${global.indiaRank}
• Total Countries Analyzed: ${global.totalCountries}
• Top Personnel Country: ${global.topPersonnel}\n\n`;
    }

    analysis += '**🎯 STRATEGIC ASSESSMENT:**\n' +
      '• Consistent recruitment patterns across all regions\n' +
      '• Strong global military personnel ranking\n' +
      '• Robust human resource pipeline for defense operations\n\n';

    return analysis;
  }

  analyzeConflictData(context) {
    let analysis = '**⚔️ CONFLICT INTELLIGENCE REPORT**\n\n';
    
    if (context.conflictData?.summary) {
      const conflict = context.conflictData.summary;
      analysis += `**CONFLICT ANALYSIS:**
• Total Incidents: ${conflict.totalIncidents}
• Analysis Period: ${conflict.yearSpan}
• Peak Incident Year: ${conflict.peakYear}
• Average Incidents/Year: ${conflict.averagePerYear?.toFixed(1)}\n\n`;
    }

    if (context.militaryExpenditure?.summary) {
      const expenditure = context.militaryExpenditure.summary;
      analysis += `**MILITARY BALANCE:**
• Current India-Pakistan Ratio: ${expenditure.currentRatio?.toFixed(2)}:1
• Strategic Advantage: ${expenditure.currentRatio > 2 ? 'Significant' : 'Moderate'}
• Analysis Period: ${expenditure.timeSpan}\n\n`;
    }

    analysis += '**🎯 THREAT ASSESSMENT:**\n' +
      '• Regional stability requires continuous monitoring\n' +
      '• Military expenditure ratio provides strategic deterrence\n' +
      '• Incident patterns indicate need for enhanced security measures\n\n';

    return analysis;
  }

  analyzeGlobalData(context) {
    let analysis = '**🌐 GLOBAL MILITARY INTELLIGENCE**\n\n';
    
    if (context.globalComparison?.countryRankings) {
      analysis += '**TOP 10 MILITARY POWERS:**\n';
      context.globalComparison.countryRankings.slice(0, 10).forEach((country, index) => {
        analysis += `${index + 1}. ${country.country}: ${country.totalPersonnel?.toLocaleString()} personnel\n`;
      });
      analysis += '\n';
    }

    if (context.globalComparison?.indiaPosition) {
      const india = context.globalComparison.indiaPosition;
      analysis += `**INDIA'S GLOBAL POSITION:**
• Military Rank: #${india.rank}
• Total Personnel: ${india.totalPersonnel?.toLocaleString()}
• Active Personnel: ${india.activePersonnel?.toLocaleString()}
• Reserve Personnel: ${india.reservePersonnel?.toLocaleString()}\n\n`;
    }

    analysis += '**🎯 STRATEGIC POSITIONING:**\n' +
      '• India maintains strong global military presence\n' +
      '• Personnel strength ranks among top global powers\n' +
      '• Balanced active and reserve force structure\n\n';

    return analysis;
  }

  analyzeGeneralData(context) {
    let analysis = '**📊 COMPREHENSIVE INTELLIGENCE BRIEF**\n\n';
    
    const availableData = [];
    if (context.budgetTrends) availableData.push('Budget Trends');
    if (context.defenseExports) availableData.push('Defense Exports');
    if (context.armyRecruits) availableData.push('Personnel Data');
    if (context.conflictData) availableData.push('Conflict Analysis');
    if (context.globalComparison) availableData.push('Global Rankings');
    if (context.militaryExpenditure) availableData.push('Military Expenditure');

    analysis += `**AVAILABLE INTELLIGENCE MODULES:**
${availableData.map(item => `• ${item}`).join('\n')}\n\n`;

    analysis += '**🎯 RECOMMENDATIONS:**\n' +
      '• Utilize specific query terms to access detailed analysis\n' +
      '• Reference budget, export, personnel, or conflict data for targeted insights\n' +
      '• Combine multiple data sources for comprehensive strategic assessment\n\n';

    return analysis;
  }

  buildMilitaryPrompt(userQuery, context) {
    const dataContext = this.buildDataContext(context);
    
    return `You are a Senior Defense Intelligence Analyst for the Indian Armed Forces with 20+ years of experience in strategic planning and military analytics.

CLASSIFICATION: FOR OFFICIAL USE ONLY

ROLE & RESPONSIBILITIES:
- Analyze defense data and provide strategic insights
- Generate actionable intelligence reports with specific metrics
- Maintain professional military communication standards
- Focus on operational readiness and strategic implications
- Provide data-driven analysis with historical context

USER QUERY: "${userQuery}"

${dataContext}

AVAILABLE DATASETS FOR ANALYSIS:
- Army Recruits 2017-2022: Personnel recruitment trends by state/region
- Defense Export 2017-2025: Export performance, growth trajectories, market analysis
- Defense Budget Trends: Annual allocations, R&D spending, utilization rates
- Indo-Pak Conflict Escalation: Historical incidents, escalation patterns, strategic analysis
- Global Armed Forces: International military strength comparisons, rankings
- Military Expenditure Indo-Pak 1960-2023: Long-term spending analysis, strategic balance

RESPONSE REQUIREMENTS:
1. Use professional military intelligence format
2. Include specific data points and metrics from available datasets
3. Provide historical context and trend analysis
4. Structure with clear sections using appropriate military terminology
5. Include strategic assessment and operational recommendations
6. Reference data sources used in analysis
7. Maintain analytical objectivity while highlighting strategic implications
8. Use appropriate emojis for section headers (📊 for metrics, 🎯 for assessment, etc.)

Generate a comprehensive intelligence brief addressing the query with available data context.

RESPONSE:`;
  }

  buildDataContext(context) {
    if (!context || Object.keys(context).length === 0) {
      return 'INTELLIGENCE STATUS: Operating with general knowledge base. Request specific dataset analysis for enhanced intelligence.';
    }

    let dataContext = 'AVAILABLE INTELLIGENCE DATA:\n';
    Object.entries(context).forEach(([key, data]) => {
      if (data && typeof data === 'object') {
        if (data.summary) {
          dataContext += `- ${key.toUpperCase()}: ${JSON.stringify(data.summary)}\n`;
        }
        if (data.exportTrends) {
          dataContext += `- EXPORT TRENDS: ${data.exportTrends.length} data points covering ${data.exportTrends[0]?.year}-${data.exportTrends[data.exportTrends.length-1]?.year}\n`;
        }
        if (data.expenditureTrends) {
          dataContext += `- EXPENDITURE DATA: ${data.expenditureTrends.length} years of India-Pakistan military spending\n`;
        }
        if (data.countryRankings) {
          dataContext += `- GLOBAL RANKINGS: ${data.countryRankings.length} countries military strength data\n`;
        }
      }
    });
    
    return dataContext;
  }

  formatCrore(value) {
    const num = typeof value === 'number' ? value : parseFloat(value || 0);
    const rounded = Math.round(num);
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(rounded) + ' Cr';
  }

  async checkServerStatus() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Ollama server status check failed:', error);
      return false;
    }
  }

  async getAvailableModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        return data.models || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  // Generate chart visualization suggestions based on query and available data
  generateVisualizationSuggestion(query, context) {
    const queryLower = query.toLowerCase();
    const suggestions = [];

    // Check for export-related visualizations
    if (queryLower.includes('export') && context.defenseExports) {
      suggestions.push({
        type: 'line',
        title: 'Defense Export Growth Trends',
        data: context.defenseExports.exportTrends,
        xKey: 'year',
        yKey: 'totalValue',
        description: 'Year-over-year defense export performance showing growth trajectory'
      });

      if (context.defenseExports.countryWiseExports) {
        suggestions.push({
          type: 'bar',
          title: 'Top Export Destinations',
          data: context.defenseExports.countryWiseExports,
          xKey: 'country',
          yKey: 'totalValue',
          description: 'Leading countries by defense export value'
        });
      }
    }

    // Check for military expenditure visualizations
    if ((queryLower.includes('pakistan') || queryLower.includes('expenditure')) && context.militaryExpenditure) {
      suggestions.push({
        type: 'composed',
        title: 'India-Pakistan Military Expenditure Comparison',
        data: context.militaryExpenditure.expenditureTrends,
        bars: [
          { key: 'india', name: 'India', color: '#FFD700' },
          { key: 'pakistan', name: 'Pakistan', color: '#FF6B6B' }
        ],
        lines: [
          { key: 'ratio', name: 'Expenditure Ratio', yAxisId: 'ratio', color: '#4ECDC4' }
        ],
        description: 'Historical military spending comparison and strategic advantage ratio'
      });
    }

    // Check for personnel/global rankings
    if (queryLower.includes('global') || queryLower.includes('ranking') || queryLower.includes('personnel')) {
      if (context.globalComparison && context.globalComparison.countryRankings) {
        suggestions.push({
          type: 'bar',
          title: 'Global Military Personnel Rankings',
          data: context.globalComparison.countryRankings.slice(0, 10),
          xKey: 'country',
          yKey: 'totalPersonnel',
          description: 'Top 10 countries by total military personnel strength'
        });
      }
    }

    return suggestions;
  }
}

// Export singleton instance
export const ollamaService = new OllamaService();
export default OllamaService;
