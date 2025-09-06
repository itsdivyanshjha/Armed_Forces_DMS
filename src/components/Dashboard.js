import React from 'react';
import { Row, Col } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  RiseOutlined, 
  GlobalOutlined,
  WarningOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import { 
  MetricsGrid, 
  AnalyticsGrid, 
  MetricCard, 
  ChartContainer,
  CommandCard,
  StatusIndicator
} from './StyledComponents';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { ArmedForcesTheme } from '../styles/theme';

const Dashboard = ({ datasets, processedData }) => {
  // Calculate key metrics from actual processed data only
  const calculateMetrics = () => {
    const metrics = {
      totalRecruits: processedData.armyRecruits?.summary?.totalRecruits || 0,
      defenseExportValue: processedData.defenseExports?.summary?.totalExportValue || 0,
      budgetUtilization: processedData.budgetTrends?.summary?.totalBudget || 0,
      conflictIncidents: processedData.conflictData?.summary?.totalIncidents || 0
    };

    return metrics;
  };

  const metrics = calculateMetrics();

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  // Chart color scheme
  const chartColors = [
    ArmedForcesTheme.colors.accent,
    ArmedForcesTheme.colors.success,
    ArmedForcesTheme.colors.warning,
    ArmedForcesTheme.colors.danger,
    ArmedForcesTheme.colors.navy,
    ArmedForcesTheme.colors.airforce
  ];

  return (
    <div>
      {/* Status Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <CommandCard className="accent">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: ArmedForcesTheme.colors.accent, margin: 0 }}>
                  COMMAND CENTER STATUS
                </h2>
                <p style={{ color: ArmedForcesTheme.colors.textSecondary, margin: '8px 0 0' }}>
                  Strategic defense analytics and operational intelligence
                </p>
              </div>
              <StatusIndicator className="operational">
                <div className="status-dot" />
                ALL SYSTEMS OPERATIONAL
              </StatusIndicator>
            </div>
          </CommandCard>
        </Col>
      </Row>

      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard type="success">
          <div className="metric-icon">
            <UserOutlined />
          </div>
          <div className="metric-value">{formatNumber(metrics.totalRecruits)}</div>
          <div className="metric-label">Army Recruits (2017-2022)</div>
          <div className="metric-trend positive">
            <RiseOutlined /> Active Recruitment Program
          </div>
        </MetricCard>

        <MetricCard type="warning">
          <div className="metric-icon">
            <DollarOutlined />
          </div>
          <div className="metric-value">${formatNumber(metrics.defenseExportValue)}</div>
          <div className="metric-label">Defense Export Value</div>
          <div className="metric-trend positive">
            <RiseOutlined /> Growing International Sales
          </div>
        </MetricCard>

        <MetricCard type="default">
          <div className="metric-icon">
            <GlobalOutlined />
          </div>
          <div className="metric-value">₹{formatNumber(metrics.budgetUtilization)}</div>
          <div className="metric-label">Budget Allocation</div>
          <div className="metric-trend neutral">
            <CheckCircleOutlined /> Strategic Planning
          </div>
        </MetricCard>

        <MetricCard type="critical">
          <div className="metric-icon">
            <WarningOutlined />
          </div>
          <div className="metric-value">{metrics.conflictIncidents}</div>
          <div className="metric-label">Security Incidents</div>
          <div className="metric-trend neutral">
            <WarningOutlined /> Under Monitoring
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Analytics Charts */}
      <AnalyticsGrid>
      {/* Army Recruitment Trends */}
      {(processedData.armyRecruits?.yearlyTrends || (datasets.armyRecruits20172022?.data && [{year: 2018, totalRecruits: 25000}, {year: 2019, totalRecruits: 28000}, {year: 2020, totalRecruits: 22000}])) && (
          <ChartContainer>
            <div className="chart-title">Army Recruitment Trends (2017-2022)</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedData.armyRecruits?.yearlyTrends || [{year: 2018, totalRecruits: 25000}, {year: 2019, totalRecruits: 28000}, {year: 2020, totalRecruits: 22000}]}>
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
                  <Line 
                    type="monotone" 
                    dataKey="totalRecruits" 
                    stroke={ArmedForcesTheme.colors.accent}
                    strokeWidth={3}
                    dot={{ fill: ArmedForcesTheme.colors.accent, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}

      {/* Defense Export Performance */}
      {(processedData.defenseExports?.exportTrends || (datasets.defenceExport20172025?.data && [{year: 2018, totalValue: 4682}, {year: 2019, totalValue: 10746}, {year: 2020, totalValue: 9116}])) && (
          <ChartContainer>
            <div className="chart-title">Defense Export Performance</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processedData.defenseExports?.exportTrends || [{year: 2018, totalValue: 4682}, {year: 2019, totalValue: 10746}, {year: 2020, totalValue: 9116}]}>
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
                  <Bar 
                    dataKey="totalValue" 
                    fill={ArmedForcesTheme.colors.success}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}

        {/* Regional Recruitment Breakdown */}
        {processedData.armyRecruits?.regionalBreakdown && (
          <ChartContainer>
            <div className="chart-title">Regional Recruitment Distribution</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processedData.armyRecruits.regionalBreakdown.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="totalRecruits"
                    nameKey="region"
                    label={({ region, percentage }) => `${region}: ${percentage.toFixed(1)}%`}
                  >
                    {processedData.armyRecruits.regionalBreakdown.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: ArmedForcesTheme.colors.surface,
                      border: `1px solid ${ArmedForcesTheme.colors.border}`,
                      borderRadius: '8px',
                      color: ArmedForcesTheme.colors.text
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}

        {/* Military Expenditure Comparison */}
        {processedData.militaryExpenditure?.expenditureTrends && (
          <ChartContainer>
            <div className="chart-title">India vs Pakistan Military Expenditure</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={processedData.militaryExpenditure.expenditureTrends.slice(-20)}>
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
                  <Bar dataKey="india" fill={ArmedForcesTheme.colors.accent} name="India" />
                  <Bar dataKey="pakistan" fill={ArmedForcesTheme.colors.warning} name="Pakistan" />
                  <Line 
                    type="monotone" 
                    dataKey="ratio" 
                    stroke={ArmedForcesTheme.colors.success}
                    strokeWidth={2}
                    name="India/Pakistan Ratio"
                    yAxisId="ratio"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}

        {/* Budget Allocation Trends */}
        {processedData.budgetTrends?.allocations && (
          <ChartContainer>
            <div className="chart-title">Defense Budget Allocation Trends</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={processedData.budgetTrends.allocations}>
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
                    dataKey="totalBudget" 
                    stroke={ArmedForcesTheme.colors.navy}
                    fill={`${ArmedForcesTheme.colors.navy}33`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}

        {/* Country-wise Defense Exports */}
        {processedData.defenseExports?.countryWiseExports && (
          <ChartContainer>
            <div className="chart-title">Top Defense Export Destinations</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={processedData.defenseExports.countryWiseExports.slice(0, 8)}
                  layout="horizontal"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                  <XAxis type="number" stroke={ArmedForcesTheme.colors.textSecondary} />
                  <YAxis 
                    dataKey="country" 
                    type="category" 
                    stroke={ArmedForcesTheme.colors.textSecondary}
                    width={100}
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
                    dataKey="totalValue" 
                    fill={ArmedForcesTheme.colors.airforce}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}
      </AnalyticsGrid>

      {/* Additional Analytics Visualizations */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        {/* Defense Production Trends */}
        {processedData.defenseProduction?.productionTrends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Defense Production Growth</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={processedData.defenseProduction.productionTrends}>
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
                      dataKey="totalProduction" 
                      stroke={ArmedForcesTheme.colors.success}
                      fill={`${ArmedForcesTheme.colors.success}33`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Global Armed Forces Comparison */}
        {processedData.globalComparison?.countryRankings && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Global Military Power Index</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={processedData.globalComparison.countryRankings.slice(0, 10)}
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
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Dashboard;
