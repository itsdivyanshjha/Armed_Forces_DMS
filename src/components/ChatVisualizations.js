import React from 'react';
import { Row, Col, Statistic, Card } from 'antd';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArmedForcesTheme } from '../styles/theme';
import { ChartContainer } from './StyledComponents';

const ChatVisualizations = ({ query, data, type = 'auto' }) => {

  const formatCurrency = (value) => {
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
    return `₹${value}`;
  };

  const formatUSD = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value}`;
  };

  const determineVisualizationType = (query, data) => {
    const lowerQuery = query.toLowerCase();
    
    // Budget/Financial queries
    if (lowerQuery.includes('budget') || lowerQuery.includes('financial') || lowerQuery.includes('expenditure')) {
      if (data.budgetTrends?.allocations) {
        return 'budget-trends';
      }
      if (data.militaryExpenditure?.expenditureTrends) {
        return 'expenditure-comparison';
      }
    }
    
    // Export queries
    if (lowerQuery.includes('export') || lowerQuery.includes('international')) {
      if (data.defenseExports?.exportTrends) {
        return 'export-trends';
      }
      if (data.defenseExports?.countryWiseExports) {
        return 'export-destinations';
      }
    }
    
    // Strategic/Conflict queries
    if (lowerQuery.includes('conflict') || lowerQuery.includes('security') || lowerQuery.includes('threat')) {
      if (data.conflictData?.escalationPatterns) {
        return 'conflict-patterns';
      }
    }
    
    // Global comparison queries
    if (lowerQuery.includes('global') || lowerQuery.includes('ranking') || lowerQuery.includes('comparison')) {
      if (data.globalComparison?.countryRankings) {
        return 'global-rankings';
      }
    }
    
    return 'summary-stats';
  };

  const renderSummaryStats = () => {
    const stats = [];
    
    if (data.budgetTrends?.summary?.totalBudget) {
      stats.push({
        title: 'Total Defense Budget',
        value: formatCurrency(data.budgetTrends.summary.totalBudget),
        color: ArmedForcesTheme.colors.accent
      });
    }
    
    if (data.defenseExports?.summary?.totalExportValue) {
      stats.push({
        title: 'Defense Export Value',
        value: formatUSD(data.defenseExports.summary.totalExportValue),
        color: ArmedForcesTheme.colors.success
      });
    }
    
    if (data.conflictData?.summary?.totalIncidents) {
      stats.push({
        title: 'Security Incidents',
        value: data.conflictData.summary.totalIncidents,
        color: ArmedForcesTheme.colors.warning
      });
    }
    
    if (data.globalComparison?.summary?.indiaRank) {
      stats.push({
        title: 'Global Military Rank',
        value: data.globalComparison.summary.indiaRank,
        color: ArmedForcesTheme.colors.navy
      });
    }

    if (stats.length === 0) {
      return (
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          color: ArmedForcesTheme.colors.textSecondary,
          fontSize: '12px'
        }}>
          📊 Data processing in progress...
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]} style={{ margin: '16px 0' }}>
        {stats.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card 
              size="small"
              style={{ 
                background: ArmedForcesTheme.colors.background,
                border: `1px solid ${ArmedForcesTheme.colors.border}`,
                textAlign: 'center'
              }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color, fontSize: '16px' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderBudgetTrends = () => {
    if (!data.budgetTrends?.allocations) return null;

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Defense Budget Allocation Trends</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.budgetTrends.allocations}>
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis dataKey="year" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
                formatter={(value) => [formatCurrency(value), 'Budget']}
              />
              <Area 
                type="monotone" 
                dataKey="totalBudget" 
                stroke={ArmedForcesTheme.colors.accent}
                fill={`${ArmedForcesTheme.colors.accent}33`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  const renderExportTrends = () => {
    if (!data.defenseExports?.exportTrends) return null;

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Defense Export Performance</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.defenseExports.exportTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis dataKey="year" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
                formatter={(value) => [formatUSD(value), 'Export Value']}
              />
              <Line 
                type="monotone" 
                dataKey="totalValue" 
                stroke={ArmedForcesTheme.colors.success}
                strokeWidth={3}
                dot={{ fill: ArmedForcesTheme.colors.success, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  const renderExportDestinations = () => {
    if (!data.defenseExports?.countryWiseExports) return null;

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Top Defense Export Destinations</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart 
              data={data.defenseExports.countryWiseExports.slice(0, 6)}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis type="number" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis 
                dataKey="country" 
                type="category" 
                stroke={ArmedForcesTheme.colors.textSecondary}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
                formatter={(value) => [formatUSD(value), 'Export Value']}
              />
              <Bar 
                dataKey="totalValue" 
                fill={ArmedForcesTheme.colors.navy}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  const renderConflictPatterns = () => {
    if (!data.conflictData?.escalationPatterns) return null;

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Security Incident Patterns</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.conflictData.escalationPatterns}>
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis dataKey="year" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
              />
              <Area 
                type="monotone" 
                dataKey="totalIncidents" 
                stroke={ArmedForcesTheme.colors.danger}
                fill={`${ArmedForcesTheme.colors.danger}33`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  const renderGlobalRankings = () => {
    if (!data.globalComparison?.countryRankings) return null;

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Global Military Power Rankings</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart 
              data={data.globalComparison.countryRankings.slice(0, 8)}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis type="number" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis 
                dataKey="country" 
                type="category" 
                stroke={ArmedForcesTheme.colors.textSecondary}
                width={60}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
              />
              <Bar 
                dataKey="militaryStrength" 
                fill={ArmedForcesTheme.colors.navy}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  const renderExpenditureComparison = () => {
    if (!data.militaryExpenditure?.expenditureTrends) return null;

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">India vs Pakistan Military Expenditure</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.militaryExpenditure.expenditureTrends.slice(-10)}>
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis dataKey="year" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
              />
              <Legend />
              <Bar dataKey="india" fill={ArmedForcesTheme.colors.accent} name="India ($B)" />
              <Bar dataKey="pakistan" fill={ArmedForcesTheme.colors.warning} name="Pakistan ($B)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const visualizationType = type === 'auto' ? determineVisualizationType(query, data) : type;

  return (
    <div style={{ 
      background: ArmedForcesTheme.colors.surface, 
      border: `1px solid ${ArmedForcesTheme.colors.border}`,
      borderRadius: '8px',
      padding: '16px',
      margin: '12px 0'
    }}>
      <div style={{ 
        color: ArmedForcesTheme.colors.accent,
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        📊 INTELLIGENCE VISUALIZATION
      </div>
      
      {visualizationType === 'summary-stats' && renderSummaryStats()}
      {visualizationType === 'budget-trends' && renderBudgetTrends()}
      {visualizationType === 'export-trends' && renderExportTrends()}
      {visualizationType === 'export-destinations' && renderExportDestinations()}
      {visualizationType === 'conflict-patterns' && renderConflictPatterns()}
      {visualizationType === 'global-rankings' && renderGlobalRankings()}
      {visualizationType === 'expenditure-comparison' && renderExpenditureComparison()}
      
      {/* Always show summary stats for context */}
      {visualizationType !== 'summary-stats' && renderSummaryStats()}
    </div>
  );
};

export default ChatVisualizations;
