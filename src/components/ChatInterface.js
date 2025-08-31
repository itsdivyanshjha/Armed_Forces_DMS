import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Tag, Spin, notification } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, WifiOutlined, DisconnectOutlined } from '@ant-design/icons';
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
import { ArmedForcesTheme } from '../styles/theme';

const { TextArea } = Input;

const ChatInterface = ({ datasets, processedData }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleQueries = [
    "Show me Army recruitment trends from 2017 to 2022",
    "Compare India's defense exports growth over the last 8 years", 
    "What's the breakdown of defense budget allocation by cluster?",
    "How does India's military expenditure compare to Pakistan?",
    "Analyze defense production trends and self-reliance progress",
    "Show conflict escalation patterns between India and Pakistan",
    "Compare India's armed forces with global military powers",
    "Generate a comprehensive defense export performance report"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check Ollama connection and add welcome message
    const initializeChat = async () => {
      const connected = await ollamaService.checkServerStatus();
      setOllamaConnected(connected);
      
      if (messages.length === 0) {
        setMessages([{
          id: 1,
          type: 'ai',
          content: `**ARMED FORCES COMMAND CENTER - AI ANALYST ACTIVATED**

🎯 **System Status:** ${connected ? 'Llama 3.1 Online' : 'Offline Mode - Demo Responses Active'}
🔐 **Classification:** FOR OFFICIAL USE ONLY
🇮🇳 **Jurisdiction:** Indian Armed Forces Intelligence Division

**Available Defense Analytics:**
• Personnel & Recruitment Intelligence
• Defense Export Performance Analysis  
• Budget Allocation & Financial Intelligence
• Strategic Threat Assessment
• Global Military Positioning
• Indo-Pak Regional Analysis

**Instructions:** Submit your intelligence queries using natural language. All responses are generated for strategic planning and operational decision-making.

Ready to assist with defense intelligence analysis.`,
          timestamp: new Date()
        }]);
      }
    };
    
    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const identifyRelevantDataset = (query) => {
    const lowercaseQuery = query.toLowerCase();
    const relevantData = {};

    // Match query to relevant datasets
    if (lowercaseQuery.includes('recruit') || lowercaseQuery.includes('personnel') || lowercaseQuery.includes('army')) {
      relevantData.armyRecruits = processedData.armyRecruits;
    }

    if (lowercaseQuery.includes('export') || lowercaseQuery.includes('international') || lowercaseQuery.includes('sales')) {
      relevantData.defenseExports = processedData.defenseExports;
    }

    if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('allocation') || lowercaseQuery.includes('spending')) {
      relevantData.budgetTrends = processedData.budgetTrends;
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

    // If no specific match, include all available data
    if (Object.keys(relevantData).length === 0) {
      return processedData;
    }

    return relevantData;
  };

  const generateAIResponse = async (query, relevantData) => {
    try {
      // Use Ollama service for AI response generation
      const response = await ollamaService.generateResponse(query, relevantData);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      notification.error({
        message: 'AI System Error',
        description: 'Failed to connect to military AI analyst. Using backup intelligence protocols.',
        placement: 'topRight'
      });
      
      // Fallback to built-in responses if Ollama fails
      return ollamaService.generateFallbackResponse ? 
        ollamaService.generateFallbackResponse(query, relevantData) :
        `**SYSTEM STATUS: BACKUP INTELLIGENCE MODE**

Unable to connect to primary AI analyst system. Operating in offline intelligence mode.

Based on your query: "${query}"

**Available Operations:**
- Review sample queries for guided analysis
- Access historical data summaries
- Generate basic intelligence reports

**RECOMMENDATION:** Check Ollama service connection for full AI analyst capabilities.

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
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      notification.error({
        message: 'Intelligence System Error',
        description: 'Failed to process query. Please try again.',
        placement: 'topRight'
      });
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
    <div>
      {/* Sample Queries */}
      <CommandCard style={{ marginBottom: 24 }}>
        <h3 style={{ color: ArmedForcesTheme.colors.accent, marginBottom: 16 }}>
          STRATEGIC ANALYSIS QUERIES
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sampleQueries.map((query, index) => (
            <Tag
              key={index}
              style={{
                background: ArmedForcesTheme.colors.background,
                color: ArmedForcesTheme.colors.textSecondary,
                border: `1px solid ${ArmedForcesTheme.colors.border}`,
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '12px'
              }}
              onClick={() => handleSampleQuery(query)}
            >
              {query}
            </Tag>
          ))}
        </div>
      </CommandCard>

      {/* Chat Interface */}
      <ChatContainer>
        <ChatHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <RobotOutlined style={{ fontSize: 20 }} />
            <h3>Military AI Analyst</h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: ollamaConnected ? 'rgba(39, 174, 96, 0.2)' : 'rgba(243, 156, 18, 0.2)',
              color: ollamaConnected ? ArmedForcesTheme.colors.success : ArmedForcesTheme.colors.warning,
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              {ollamaConnected ? <WifiOutlined /> : <DisconnectOutlined />}
              {ollamaConnected ? 'LLAMA 3.1 ONLINE' : 'OFFLINE MODE'}
            </div>
          </div>
        </ChatHeader>

        <ChatMessages>
          {messages.map((message) => (
            <Message key={message.id} className={message.type}>
              <div className="message-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {message.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
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
  );
};

export default ChatInterface;
