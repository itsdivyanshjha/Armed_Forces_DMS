import React, { useState, useEffect } from 'react';
import { ConfigProvider, Spin, notification } from 'antd';
import { 
  DashboardOutlined, 
  MessageOutlined, 
  DollarOutlined,
  GlobalOutlined 
} from '@ant-design/icons';
import { 
  AppLayout, 
  AppHeader, 
  AppContent, 
  LoadingOverlay 
} from './components/StyledComponents';
import { antdTheme } from './styles/theme';
import { dataLoader } from './services/dataLoader';
import DataProcessors from './services/dataProcessors';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import FinancialAnalytics from './components/FinancialAnalytics';
import StrategicAnalytics from './components/StrategicAnalytics';
import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState({});
  const [processedData, setProcessedData] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApplication();
  }, []);

  const initializeApplication = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all datasets
      console.log('Loading datasets...');
      const loadedData = await dataLoader.loadAllData();
      setDatasets(loadedData);

      // Process the data
      console.log('Processing datasets...');
      const processed = DataProcessors.processAllData(loadedData);
      setProcessedData(processed);

      console.log('Application initialized successfully');
      notification.success({
        message: 'System Operational',
        description: 'Armed Forces Intelligence Hub loaded successfully',
        placement: 'topRight'
      });

    } catch (error) {
      console.error('Failed to initialize application:', error);
      setError(error.message);
      notification.error({
        message: 'System Error',
        description: 'Failed to load intelligence data. Please check your connection.',
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            datasets={datasets}
            processedData={processedData}
          />
        );
      case 'chat':
        return (
          <ChatInterface 
            datasets={datasets}
            processedData={processedData}
          />
        );
      case 'financial':
        return (
          <FinancialAnalytics 
            budgetData={processedData.budgetTrends}
            exportData={processedData.defenseExports}
            expenditureData={processedData.militaryExpenditure}
          />
        );
      case 'strategic':
        return (
          <StrategicAnalytics 
            conflictData={processedData.conflictData}
            globalData={processedData.globalComparison}
            expenditureData={processedData.militaryExpenditure}
          />
        );
      default:
        return <Dashboard datasets={datasets} processedData={processedData} />;
    }
  };

  const navigationItems = [
    { key: 'dashboard', label: 'Command Dashboard', icon: <DashboardOutlined /> },
    { key: 'chat', label: 'AI Intelligence', icon: <MessageOutlined /> },
    { key: 'financial', label: 'Financial Intelligence', icon: <DollarOutlined /> },
    { key: 'strategic', label: 'Strategic Analysis', icon: <GlobalOutlined /> }
  ];

  if (loading) {
    return (
      <ConfigProvider theme={antdTheme}>
        <AppLayout>
          <LoadingOverlay>
            <div className="loading-content">
              <Spin size="large" />
              <div className="loading-text">
                Initializing Armed Forces Intelligence Hub...
              </div>
            </div>
          </LoadingOverlay>
        </AppLayout>
      </ConfigProvider>
    );
  }

  if (error) {
    return (
      <ConfigProvider theme={antdTheme}>
        <AppLayout>
          <AppContent style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#E74C3C'
          }}>
            <h2>System Error</h2>
            <p>{error}</p>
            <button onClick={initializeApplication}>
              Retry Initialization
            </button>
          </AppContent>
        </AppLayout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={antdTheme}>
      <AppLayout>
        <AppHeader>
          <div className="logo">
            <div className="emblem">🇮🇳</div>
            <h1>Intelligence Hub</h1>
          </div>
          <div className="nav-actions">
            {navigationItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  background: activeTab === item.key ? '#FFD700' : 'transparent',
                  color: activeTab === item.key ? '#1B4332' : '#FFD700',
                  border: '1px solid #FFD700',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  minHeight: '32px'
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </AppHeader>
        
        <AppContent>
          {renderContent()}
        </AppContent>
      </AppLayout>
    </ConfigProvider>
  );
}

export default App;
