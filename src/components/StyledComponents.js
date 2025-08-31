import styled from 'styled-components';
import { Card, Layout, Button, Input, Select } from 'antd';
import { ArmedForcesTheme } from '../styles/theme';

const { Header, Content, Sider } = Layout;

// Main Layout Components
export const AppLayout = styled(Layout)`
  min-height: 100vh;
  background: ${ArmedForcesTheme.colors.background};
  font-family: ${ArmedForcesTheme.typography.fontFamily};
`;

export const AppHeader = styled(Header)`
  background: ${ArmedForcesTheme.gradients.primary};
  border-bottom: 2px solid ${ArmedForcesTheme.colors.accent};
  padding: 0 ${ArmedForcesTheme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${ArmedForcesTheme.shadows.medium};
  position: sticky;
  top: 0;
  z-index: 1000;

  .logo {
    display: flex;
    align-items: center;
    gap: ${ArmedForcesTheme.spacing.md};
    
    h1 {
      color: ${ArmedForcesTheme.colors.accent};
      margin: 0;
      font-size: 24px;
      font-weight: ${ArmedForcesTheme.typography.weights.bold};
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .emblem {
      width: 40px;
      height: 40px;
      background: ${ArmedForcesTheme.colors.accent};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: ${ArmedForcesTheme.colors.primary};
      font-weight: ${ArmedForcesTheme.typography.weights.bold};
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
  }
`;

export const AppContent = styled(Content)`
  background: ${ArmedForcesTheme.colors.background};
  padding: ${ArmedForcesTheme.spacing.lg};
  overflow-x: hidden;
`;

export const AppSider = styled(Sider)`
  background: ${ArmedForcesTheme.colors.surface};
  border-right: 1px solid ${ArmedForcesTheme.colors.border};
  
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

// Command Center Cards
export const CommandCard = styled(Card)`
  background: ${ArmedForcesTheme.colors.surface};
  border: 1px solid ${ArmedForcesTheme.colors.border};
  border-radius: 12px;
  box-shadow: ${ArmedForcesTheme.shadows.medium};
  margin-bottom: ${ArmedForcesTheme.spacing.lg};
  
  &.critical {
    border-left: 4px solid ${ArmedForcesTheme.colors.danger};
  }
  
  &.warning {
    border-left: 4px solid ${ArmedForcesTheme.colors.warning};
  }
  
  &.success {
    border-left: 4px solid ${ArmedForcesTheme.colors.success};
  }
  
  &.accent {
    border-left: 4px solid ${ArmedForcesTheme.colors.accent};
  }

  .ant-card-head {
    background: rgba(27, 67, 50, 0.3);
    border-bottom: 1px solid ${ArmedForcesTheme.colors.border};
    
    .ant-card-head-title {
      color: ${ArmedForcesTheme.colors.accent};
      font-weight: ${ArmedForcesTheme.typography.weights.semibold};
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 14px;
    }
  }

  .ant-card-body {
    background: transparent;
    color: ${ArmedForcesTheme.colors.text};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${ArmedForcesTheme.shadows.large};
    transition: all 0.3s ease;
  }
`;

// Metric Display Components
export const MetricCard = styled.div`
  background: ${ArmedForcesTheme.colors.surface};
  border: 1px solid ${ArmedForcesTheme.colors.border};
  border-radius: 8px;
  padding: ${ArmedForcesTheme.spacing.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      switch (props.type) {
        case 'critical': return ArmedForcesTheme.colors.danger;
        case 'warning': return ArmedForcesTheme.colors.warning;
        case 'success': return ArmedForcesTheme.colors.success;
        default: return ArmedForcesTheme.colors.accent;
      }
    }};
  }

  .metric-icon {
    position: absolute;
    top: ${ArmedForcesTheme.spacing.md};
    right: ${ArmedForcesTheme.spacing.md};
    font-size: 32px;
    color: ${ArmedForcesTheme.colors.accent};
    opacity: 0.7;
  }

  .metric-value {
    font-size: 36px;
    font-weight: ${ArmedForcesTheme.typography.weights.bold};
    color: ${ArmedForcesTheme.colors.text};
    margin: 0;
    line-height: 1;
  }

  .metric-label {
    color: ${ArmedForcesTheme.colors.textSecondary};
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
    margin-top: ${ArmedForcesTheme.spacing.sm};
    font-weight: ${ArmedForcesTheme.typography.weights.medium};
  }

  .metric-trend {
    display: flex;
    align-items: center;
    gap: ${ArmedForcesTheme.spacing.xs};
    margin-top: ${ArmedForcesTheme.spacing.sm};
    font-size: 14px;
    
    &.positive {
      color: ${ArmedForcesTheme.colors.success};
    }
    
    &.negative {
      color: ${ArmedForcesTheme.colors.danger};
    }
    
    &.neutral {
      color: ${ArmedForcesTheme.colors.textSecondary};
    }
  }
`;

// Grid Layouts
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${ArmedForcesTheme.spacing.lg};
  margin-bottom: ${ArmedForcesTheme.spacing.xl};
`;

export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${ArmedForcesTheme.spacing.lg};
  
  @media (max-width: ${ArmedForcesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

// Chart Container
export const ChartContainer = styled.div`
  background: ${ArmedForcesTheme.colors.surface};
  border: 1px solid ${ArmedForcesTheme.colors.border};
  border-radius: 12px;
  padding: ${ArmedForcesTheme.spacing.lg};
  box-shadow: ${ArmedForcesTheme.shadows.small};

  .chart-title {
    color: ${ArmedForcesTheme.colors.accent};
    font-size: 18px;
    font-weight: ${ArmedForcesTheme.typography.weights.semibold};
    margin-bottom: ${ArmedForcesTheme.spacing.lg};
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
  }

  .chart-wrapper {
    width: 100%;
    height: 300px;
    
    .recharts-wrapper {
      font-family: ${ArmedForcesTheme.typography.fontFamily};
    }
    
    .recharts-text {
      fill: ${ArmedForcesTheme.colors.textSecondary};
      font-size: 12px;
    }
    
    .recharts-cartesian-axis-line,
    .recharts-cartesian-axis-tick-line {
      stroke: ${ArmedForcesTheme.colors.border};
    }
    
    .recharts-tooltip-wrapper {
      .recharts-default-tooltip {
        background: ${ArmedForcesTheme.colors.surface} !important;
        border: 1px solid ${ArmedForcesTheme.colors.border} !important;
        border-radius: 8px !important;
        color: ${ArmedForcesTheme.colors.text} !important;
      }
    }
  }
`;

// Military Action Buttons
export const MilitaryButton = styled(Button)`
  background: ${ArmedForcesTheme.gradients.primary};
  border: 1px solid ${ArmedForcesTheme.colors.accent};
  color: ${ArmedForcesTheme.colors.accent};
  font-weight: ${ArmedForcesTheme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: 1px;
  height: 40px;
  padding: 0 ${ArmedForcesTheme.spacing.lg};
  
  &:hover, &:focus {
    background: ${ArmedForcesTheme.colors.accent};
    color: ${ArmedForcesTheme.colors.primary};
    border-color: ${ArmedForcesTheme.colors.accent};
    transform: translateY(-1px);
    box-shadow: ${ArmedForcesTheme.shadows.medium};
  }
  
  &.danger {
    background: linear-gradient(135deg, ${ArmedForcesTheme.colors.danger} 0%, #a93226 100%);
    border-color: ${ArmedForcesTheme.colors.danger};
    color: white;
    
    &:hover, &:focus {
      background: ${ArmedForcesTheme.colors.danger};
      border-color: ${ArmedForcesTheme.colors.danger};
    }
  }
  
  &.success {
    background: linear-gradient(135deg, ${ArmedForcesTheme.colors.success} 0%, #1e8449 100%);
    border-color: ${ArmedForcesTheme.colors.success};
    color: white;
    
    &:hover, &:focus {
      background: ${ArmedForcesTheme.colors.success};
      border-color: ${ArmedForcesTheme.colors.success};
    }
  }
`;

// Chat Interface Components
export const ChatContainer = styled.div`
  background: ${ArmedForcesTheme.colors.surface};
  border: 1px solid ${ArmedForcesTheme.colors.border};
  border-radius: 12px;
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  background: ${ArmedForcesTheme.gradients.primary};
  padding: ${ArmedForcesTheme.spacing.md} ${ArmedForcesTheme.spacing.lg};
  border-bottom: 1px solid ${ArmedForcesTheme.colors.border};
  
  h3 {
    color: ${ArmedForcesTheme.colors.accent};
    margin: 0;
    font-size: 16px;
    font-weight: ${ArmedForcesTheme.typography.weights.semibold};
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${ArmedForcesTheme.spacing.md};
  background: ${ArmedForcesTheme.colors.background};
`;

export const ChatInput = styled.div`
  border-top: 1px solid ${ArmedForcesTheme.colors.border};
  padding: ${ArmedForcesTheme.spacing.md};
  background: ${ArmedForcesTheme.colors.surface};
  
  .ant-input {
    background: ${ArmedForcesTheme.colors.background};
    border: 1px solid ${ArmedForcesTheme.colors.border};
    color: ${ArmedForcesTheme.colors.text};
    
    &:focus, &:hover {
      border-color: ${ArmedForcesTheme.colors.accent};
      box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
    }
  }
`;

// Message Components
export const Message = styled.div`
  margin-bottom: ${ArmedForcesTheme.spacing.md};
  
  &.user {
    text-align: right;
    
    .message-content {
      background: ${ArmedForcesTheme.gradients.primary};
      color: ${ArmedForcesTheme.colors.text};
      display: inline-block;
      padding: ${ArmedForcesTheme.spacing.sm} ${ArmedForcesTheme.spacing.md};
      border-radius: 12px 12px 4px 12px;
      max-width: 70%;
      border: 1px solid ${ArmedForcesTheme.colors.accent};
    }
  }
  
  &.ai {
    text-align: left;
    
    .message-content {
      background: ${ArmedForcesTheme.colors.surface};
      color: ${ArmedForcesTheme.colors.text};
      display: inline-block;
      padding: ${ArmedForcesTheme.spacing.sm} ${ArmedForcesTheme.spacing.md};
      border-radius: 12px 12px 12px 4px;
      max-width: 70%;
      border: 1px solid ${ArmedForcesTheme.colors.border};
      border-left: 3px solid ${ArmedForcesTheme.colors.accent};
    }
  }
  
  .message-time {
    font-size: 10px;
    color: ${ArmedForcesTheme.colors.textSecondary};
    margin-top: ${ArmedForcesTheme.spacing.xs};
  }
`;

// Status Indicators
export const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${ArmedForcesTheme.spacing.xs};
  padding: ${ArmedForcesTheme.spacing.xs} ${ArmedForcesTheme.spacing.sm};
  border-radius: 16px;
  font-size: 12px;
  font-weight: ${ArmedForcesTheme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &.operational {
    background: rgba(39, 174, 96, 0.2);
    color: ${ArmedForcesTheme.colors.success};
    border: 1px solid ${ArmedForcesTheme.colors.success};
  }
  
  &.warning {
    background: rgba(243, 156, 18, 0.2);
    color: ${ArmedForcesTheme.colors.warning};
    border: 1px solid ${ArmedForcesTheme.colors.warning};
  }
  
  &.critical {
    background: rgba(231, 76, 60, 0.2);
    color: ${ArmedForcesTheme.colors.danger};
    border: 1px solid ${ArmedForcesTheme.colors.danger};
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

// Loading Components
export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 20, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .loading-content {
    text-align: center;
    color: ${ArmedForcesTheme.colors.accent};
    
    .loading-text {
      margin-top: ${ArmedForcesTheme.spacing.md};
      font-weight: ${ArmedForcesTheme.typography.weights.medium};
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
`;
