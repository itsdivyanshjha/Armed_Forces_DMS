class OllamaService {
  constructor() {
    // Use environment variable for production deployment
    this.baseUrl = process.env.REACT_APP_OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.REACT_APP_OLLAMA_MODEL || 'llama3.1:latest';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  async generateResponse(prompt, context = {}) {
    // In production, use fallback responses for demo purposes
    if (this.isProduction) {
      console.log('Production mode: Using fallback AI responses');
      return this.generateFallbackResponse(prompt, context);
    }

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
            max_tokens: 1024
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || 'Unable to generate response at this time.';
    } catch (error) {
      console.error('Ollama service error:', error);
      // Fallback to simulated military analyst responses
      return this.generateFallbackResponse(prompt, context);
    }
  }

  buildMilitaryPrompt(userQuery, context) {
    return `You are a Senior Defense Intelligence Analyst for the Indian Armed Forces with 20+ years of experience in strategic planning and military analytics.

CLASSIFICATION: FOR OFFICIAL USE ONLY

Your role:
- Analyze defense data and provide strategic insights
- Generate actionable intelligence reports
- Maintain professional military communication standards
- Focus on operational readiness and strategic implications

User Query: "${userQuery}"

${Object.keys(context).length > 0 ? `
Available Intelligence Data:
${Object.entries(context).map(([key, data]) => {
  if (data && typeof data === 'object') {
    return `- ${key}: ${JSON.stringify(data).substring(0, 500)}...`;
  }
  return `- ${key}: ${data}`;
}).join('\n')}
` : ''}

Instructions:
1. Respond as a military intelligence professional
2. Use appropriate military terminology and structure
3. Provide specific data-driven insights when possible
4. Include strategic recommendations
5. Format with clear sections: Assessment, Analysis, Recommendations
6. Maintain security awareness in communications
7. Keep responses concise but comprehensive (max 300 words)

Response:`;
  }

  generateFallbackResponse(query, context) {
    const queryLower = query.toLowerCase();
    
    // Recruitment-related queries
    if (queryLower.includes('recruit') || queryLower.includes('personnel')) {
      return `**PERSONNEL INTELLIGENCE ASSESSMENT**

📊 **Current Status:**
- Active recruitment programs maintaining 95% target achievement
- Regional distribution optimized for strategic requirements
- Technical specialization programs expanded by 15%

🎯 **Strategic Analysis:**
Personnel strength indicators show consistent growth trajectory aligned with modernization objectives. Current recruitment patterns support force expansion requirements.

**RECOMMENDATION:** Continue enhanced recruitment focus on cyber warfare and advanced technology specializations to meet emerging threat requirements.

**CLASSIFICATION:** FOR OFFICIAL USE ONLY`;
    }

    // Export-related queries
    if (queryLower.includes('export') || queryLower.includes('international')) {
      return `**DEFENSE EXPORT INTELLIGENCE SUMMARY**

📈 **Performance Metrics:**
- Export growth trajectory: +18% annually
- Market diversification across 47 countries
- Indigenous technology content: 78% average

🌍 **Strategic Assessment:**
Defense export capabilities demonstrate growing technological self-reliance and international market confidence in Indian defense products.

**RECOMMENDATION:** Accelerate partnerships with emerging markets while maintaining quality standards for sustained growth.

**CLASSIFICATION:** FOR OFFICIAL USE ONLY`;
    }

    // Budget-related queries
    if (queryLower.includes('budget') || queryLower.includes('financial')) {
      return `**FINANCIAL INTELLIGENCE ANALYSIS**

💰 **Budget Overview:**
- Allocation efficiency: 92.3% utilization rate
- Modernization fund: Priority allocation maintained
- R&D investment: 8% of total defense budget

📊 **Strategic Impact:**
Financial planning demonstrates balanced approach between operational readiness and capability enhancement programs.

**RECOMMENDATION:** Optimize procurement cycles and strengthen indigenous manufacturing to maximize budget effectiveness.

**CLASSIFICATION:** FOR OFFICIAL USE ONLY`;
    }

    // Default comprehensive response
    return `**COMPREHENSIVE DEFENSE INTELLIGENCE BRIEF**

🎯 **Situational Assessment:**
All major defense parameters indicate stable operational readiness with positive growth trends across key performance indicators.

📊 **Key Insights:**
- Personnel: Recruitment targets being met consistently
- Technology: Indigenous capabilities showing marked improvement
- International: Strategic partnerships expanding globally
- Budget: Efficient allocation supporting modernization goals

🔍 **Strategic Recommendations:**
1. Continue technology advancement initiatives
2. Strengthen international defense cooperation
3. Maintain personnel development programs
4. Optimize resource allocation for emerging threats

**CLASSIFICATION:** FOR OFFICIAL USE ONLY
**Analyst: Senior Defense Intelligence Officer**`;
  }

  async checkServerStatus() {
    // In production, always return false to show offline mode
    if (this.isProduction) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
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
}

// Export singleton instance
export const ollamaService = new OllamaService();
export default OllamaService;
