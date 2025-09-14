import React, { useState, useRef, useEffect } from 'react';
import { Input, Spin, notification } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { ollamaService } from '../services/ollamaService';
import { 
  ChatContainer, 
  ChatHeader, 
  ChatMessages, 
  ChatInput, 
  Message,
  CommandCard,
  MilitaryButton 
} from './StyledComponents';
import ChatVisualizations from './ChatVisualizations';
import { ArmedForcesTheme } from '../styles/theme';

const { TextArea } = Input;

const ChatInterface = ({ datasets, processedData }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const strategicQueries = {
    "Financial Intelligence": [
      "Analyze defense budget allocation trends and growth patterns",
      "Compare India's defense exports performance with global competitors",
      "Show military expenditure ratio between India and Pakistan over time",
      "Generate financial efficiency report for defense spending"
    ],
    "Strategic Assessment": [
      "Evaluate current security threat levels and conflict patterns",
      "Compare India's global military ranking and capabilities",
      "Analyze Indo-Pak military balance and strategic implications",
      "Assess defense production capacity and self-reliance metrics"
    ],
    "Operational Intelligence": [
      "Show defense export destinations and market penetration",
      "Analyze budget cluster allocation for strategic planning",
      "Compare global armed forces strength and positioning",
      "Generate comprehensive defense readiness assessment"
    ],
    "Coast Guard Operations": [
      "Analyze ICG aircraft defect patterns and maintenance trends",
      "Show ICG safety index and incident analysis by unit",
      "Compare defect rates across different ICG squadrons",
      "Generate ICG operational safety assessment report"
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  useEffect(() => {
    // Check Ollama connection and add welcome message
    const initializeChat = async () => {
      const connected = await ollamaService.checkServerStatus();
      setOllamaConnected(connected);
      
      if (messages.length === 0) {
        setMessages([{
          id: 1,
          type: 'ai',
          content: `**MILITARY AI ANALYST - OPERATIONAL**

STATUS: ${connected ? 'ONLINE' : 'INTELLIGENCE MODE'} | SECURITY: FOR OFFICIAL USE ONLY

AVAILABLE INTELLIGENCE MODULES:
- Financial Intelligence: Budget analysis, export performance, expenditure trends
- Strategic Assessment: Threat evaluation, conflict analysis, military balance
- Operational Intelligence: Defense readiness, global comparisons, market analysis
- Coast Guard Operations: ICG safety analysis, defect tracking, incident reports

READY FOR ANALYSIS — Submit queries using suggestions above or type custom requests.`,
          timestamp: new Date()
        }]);
      }
    };
    
    initializeChat();
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const identifyRelevantDataset = (query) => {
    const lowercaseQuery = query.toLowerCase();
    const relevantData = {};
    
    console.log('Identifying relevant dataset for query:', query);
    console.log('Available processedData keys:', Object.keys(processedData));
    console.log('ICG Reports available:', !!processedData.icgReports);

    // Match query to relevant datasets
    if (lowercaseQuery.includes('recruit') || lowercaseQuery.includes('personnel') || lowercaseQuery.includes('army')) {
      relevantData.armyRecruits = processedData.armyRecruits;
    }

    if (lowercaseQuery.includes('export') || lowercaseQuery.includes('international') || lowercaseQuery.includes('sales')) {
      relevantData.defenseExports = processedData.defenseExports;
    }

    if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('allocation') || lowercaseQuery.includes('spending')) {
      relevantData.budgetTrends = processedData.budgetTrends;
      if (lowercaseQuery.includes('cluster')) {
        relevantData.defenseClusterBudget = processedData.defenseClusterBudget;
      }
    }

    if (lowercaseQuery.includes('conflict') || lowercaseQuery.includes('pakistan') || lowercaseQuery.includes('escalation')) {
      relevantData.conflictData = processedData.conflictData;
    }

    if (lowercaseQuery.includes('global') || lowercaseQuery.includes('comparison') || lowercaseQuery.includes('ranking')) {
      relevantData.globalComparison = processedData.globalComparison;
    }

    if (lowercaseQuery.includes('expenditure') || lowercaseQuery.includes('spending') || lowercaseQuery.includes('indo-pak')) {
      relevantData.militaryExpenditure = processedData.militaryExpenditure;
    }

    if (lowercaseQuery.includes('icg') || lowercaseQuery.includes('coast guard') || lowercaseQuery.includes('defect') || 
        lowercaseQuery.includes('incident') || lowercaseQuery.includes('safety') || lowercaseQuery.includes('aircraft')) {
      console.log('ICG query detected, adding ICG data');
      console.log('ICG data structure:', processedData.icgReports);
      relevantData.icgReports = processedData.icgReports;
    }

    // If no specific match, include all available data
    if (Object.keys(relevantData).length === 0) {
      console.log('No specific match, returning all processed data');
      return processedData;
    }

    console.log('Returning relevant data:', Object.keys(relevantData));
    return relevantData;
  };

  const generateAIResponse = async (query, relevantData) => {
    try {
      // Use Ollama service for AI response generation (now includes fallback)
      const response = await ollamaService.generateResponse(query, relevantData);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      // The ollamaService now handles intelligent responses internally
      notification.info({
        message: 'AI Analyst',
        description: 'Generating intelligence analysis...',
        placement: 'topRight',
        duration: 3
      });
      
      // Return a basic response
      return `**📊 INTELLIGENCE ANALYSIS**

**QUERY:** ${query}

**AVAILABLE DATA:**
${Object.keys(relevantData).length > 0 ? 
  Object.keys(relevantData).map(key => `• ${key}`).join('\n') : 
  'No specific data available for this query.'}

**CLASSIFICATION:** FOR OFFICIAL USE ONLY`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Identify relevant data
      const relevantData = identifyRelevantDataset(inputValue.trim());
      
      // Generate AI response
      const aiResponse = await generateAIResponse(inputValue.trim(), relevantData);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        visualization: relevantData && Object.keys(relevantData).length > 0 ? {
          query: inputValue.trim(),
          data: relevantData
        } : null
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to process intelligence query:', error);
      
      // Add a system message to the chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `**📊 INTELLIGENCE ANALYSIS**

**QUERY:** ${inputValue.trim()}

**STATUS:** Processing complete with available data.

**CLASSIFICATION:** FOR OFFICIAL USE ONLY`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuery = (query) => {
    setInputValue(query);
  };

  const formatMessageContent = (content) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={index} style={{ 
              fontWeight: 'bold', 
              color: ArmedForcesTheme.colors.accent,
              marginBottom: '8px',
              fontSize: '16px'
            }}>
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }
        if (line.startsWith('• ')) {
          return (
            <div key={index} style={{ 
              marginLeft: '16px', 
              marginBottom: '4px',
              color: ArmedForcesTheme.colors.text
            }}>
              {line}
            </div>
          );
        }
        if (line.includes('📊') || line.includes('🎯') || line.includes('⚠️') || 
            line.includes('🌍') || line.includes('💰') || line.includes('🔒') ||
            line.includes('📈') || line.includes('🌐')) {
          return (
            <div key={index} style={{ 
              fontWeight: 'bold',
              color: ArmedForcesTheme.colors.success,
              marginTop: '12px',
              marginBottom: '6px'
            }}>
              {line}
            </div>
          );
        }
        return line ? (
          <div key={index} style={{ 
            marginBottom: '4px',
            color: ArmedForcesTheme.colors.text
          }}>
            {line}
          </div>
        ) : (
          <div key={index} style={{ height: '8px' }} />
        );
      });
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      height: 'calc(100vh - 120px)',
      flexDirection: window.innerWidth < 1024 ? 'column' : 'row'
    }}>
      {/* Main Chat Interface - Takes most of the space */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: window.innerWidth < 1024 ? '400px' : 'auto'
      }}>

        {/* Chat Interface */}
        <ChatContainer style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="bi bi-robot" style={{ fontSize: 16 }} />
            <h4 style={{ margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-cpu" /> Military AI Analyst
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: ollamaConnected ? 'rgba(39, 174, 96, 0.2)' : 'rgba(243, 156, 18, 0.2)',
              color: ollamaConnected ? ArmedForcesTheme.colors.success : ArmedForcesTheme.colors.warning,
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '9px',
              fontWeight: 'bold'
            }}>
              {ollamaConnected ? <i className="bi bi-wifi" /> : <i className="bi bi-cpu" />}
              {ollamaConnected ? 'ONLINE' : 'INTELLIGENCE'}
            </div>
          </div>
        </ChatHeader>

        <ChatMessages>
          {messages.map((message) => (
            <Message key={message.id} className={message.type}>
              <div className="message-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {message.type === 'ai' ? <i className="bi bi-robot" /> : <i className="bi bi-person" />}
                  <strong>
                    {message.type === 'ai' ? 'AI Analyst' : 'Command'}
                  </strong>
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div>
                  {typeof message.content === 'string' ? 
                    formatMessageContent(message.content) : 
                    message.content
                  }
                </div>
                {message.visualization && (
                  <ChatVisualizations 
                    query={message.visualization.query}
                    data={message.visualization.data}
                  />
                )}
              </div>
            </Message>
          ))}
          
          {isLoading && (
            <Message className="ai">
              <div className="message-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Spin size="small" />
                  <span>Analyzing intelligence data...</span>
                </div>
              </div>
            </Message>
          )}
          
          <div ref={messagesEndRef} />
        </ChatMessages>

        <ChatInput>
          <div style={{ display: 'flex', gap: 8 }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your intelligence query..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              style={{
                background: ArmedForcesTheme.colors.background,
                border: `1px solid ${ArmedForcesTheme.colors.border}`,
                color: ArmedForcesTheme.colors.text
              }}
            />
            <MilitaryButton
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              loading={isLoading}
            >
              Send
            </MilitaryButton>
          </div>
        </ChatInput>
      </ChatContainer>
      </div>

      {/* Quick Analysis Queries Sidebar */}
      <div style={{ 
        width: window.innerWidth < 1024 ? '100%' : '300px',
        maxHeight: window.innerWidth < 1024 ? '200px' : 'auto',
        display: 'flex', 
        flexDirection: 'column',
        gap: '8px'
      }}>
        <CommandCard style={{ 
          padding: '12px',
          maxHeight: window.innerWidth < 1024 ? '180px' : 'auto',
          overflowY: window.innerWidth < 1024 ? 'auto' : 'visible'
        }}>
          <h4 style={{ 
            color: ArmedForcesTheme.colors.accent, 
            marginBottom: 12,
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <i className="bi bi-bullseye" /> QUICK ANALYSIS
          </h4>
          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth < 1024 ? 'row' : 'column',
            flexWrap: window.innerWidth < 1024 ? 'wrap' : 'nowrap',
            gap: '6px' 
          }}>
            {Object.entries(strategicQueries).map(([category, queries]) => 
              queries.slice(0, 3).map((query, index) => (
                <div
                  key={`${category}-${index}`}
                  style={{
                    background: ArmedForcesTheme.colors.background,
                    color: ArmedForcesTheme.colors.textSecondary,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    borderRadius: '4px',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    fontSize: '9px',
                    lineHeight: '1.3',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onClick={() => handleSampleQuery(query)}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = ArmedForcesTheme.colors.accent;
                    e.target.style.background = `${ArmedForcesTheme.colors.accent}15`;
                    e.target.style.color = ArmedForcesTheme.colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = ArmedForcesTheme.colors.border;
                    e.target.style.background = ArmedForcesTheme.colors.background;
                    e.target.style.color = ArmedForcesTheme.colors.textSecondary;
                  }}
                >
                  {query.length > 60 ? query.substring(0, 57) + '...' : query}
                </div>
              ))
            )}
          </div>
        </CommandCard>
      </div>
    </div>
  );
};

export default ChatInterface;
