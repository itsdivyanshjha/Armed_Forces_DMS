import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { DollarOutlined, RiseOutlined, GlobalOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { CommandCard, ChartContainer, MetricsGrid, MetricCard } from './StyledComponents';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { ArmedForcesTheme } from '../styles/theme';

const FinancialAnalytics = ({ budgetData, exportData, expenditureData }) => {
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

  const chartColors = [
    ArmedForcesTheme.colors.accent,
    ArmedForcesTheme.colors.success,
    ArmedForcesTheme.colors.warning,
    ArmedForcesTheme.colors.navy,
    ArmedForcesTheme.colors.airforce,
    ArmedForcesTheme.colors.danger
  ];

  return (
    <div>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <CommandCard className="warning">
            <h2 style={{ color: ArmedForcesTheme.colors.accent, margin: 0 }}>
              FINANCIAL INTELLIGENCE MODULE
            </h2>
            <p style={{ color: ArmedForcesTheme.colors.textSecondary, margin: '8px 0 0' }}>
              Comprehensive analysis of defense budget allocation, export performance, and financial trends
            </p>
          </CommandCard>
        </Col>
      </Row>

      {/* Financial Metrics */}
      <MetricsGrid>
        <MetricCard type="success">
          <div className="metric-icon">
            <DollarOutlined />
          </div>
          <div className="metric-value">
            {formatCurrency(budgetData?.summary?.totalBudget || 0)}
          </div>
          <div className="metric-label">Total Defense Budget</div>
          <div className="metric-trend positive">
            <RiseOutlined /> Strategic Allocation
          </div>
        </MetricCard>

        <MetricCard type="warning">
          <div className="metric-icon">
            <GlobalOutlined />
          </div>
          <div className="metric-value">
            {formatUSD(exportData?.summary?.totalExportValue || 0)}
          </div>
          <div className="metric-label">Defense Export Revenue</div>
          <div className="metric-trend positive">
            <ArrowUpOutlined /> Growing Markets
          </div>
        </MetricCard>

        <MetricCard type="default">
          <div className="metric-icon">
            <RiseOutlined />
          </div>
          <div className="metric-value">
            {budgetData?.summary?.averageGrowthRate?.toFixed(1) || '0.0'}%
          </div>
          <div className="metric-label">Average Budget Growth</div>
          <div className="metric-trend positive">
            📈 Sustained Investment
          </div>
        </MetricCard>

        <MetricCard type="critical">
          <div className="metric-icon">
            <GlobalOutlined />
          </div>
          <div className="metric-value">
            {exportData?.summary?.totalCountries || 0}
          </div>
          <div className="metric-label">Export Destinations</div>
          <div className="metric-trend neutral">
            🌍 Global Reach
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Financial Analytics Charts */}
      <Row gutter={[24, 24]}>
        {/* Budget Allocation Trends */}
        {budgetData?.allocations && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Defense Budget Allocation Trends</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={budgetData.allocations}>
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
          </Col>
        )}

        {/* Budget Growth Rate */}
        {budgetData?.trends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Budget Growth Rate Analysis</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetData.trends}>
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
                      formatter={(value) => [`${value.toFixed(1)}%`, 'Growth Rate']}
                    />
                    <Bar 
                      dataKey="growthRate" 
                      fill={ArmedForcesTheme.colors.success}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Category-wise Budget Breakdown */}
        {budgetData?.categoryBreakdown && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Budget Allocation by Category</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetData.categoryBreakdown.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="totalBudget"
                      nameKey="category"
                      label={({ category, totalBudget }) => 
                        `${category}: ${formatCurrency(totalBudget)}`
                      }
                    >
                      {budgetData.categoryBreakdown.slice(0, 6).map((entry, index) => (
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
                      formatter={(value) => [formatCurrency(value), 'Budget']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Defense Export Trends */}
        {exportData?.exportTrends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Defense Export Performance</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={exportData.exportTrends}>
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
                      dot={{ fill: ArmedForcesTheme.colors.success, strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Top Export Destinations */}
        {exportData?.countryWiseExports && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Top Export Destinations</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={exportData.countryWiseExports.slice(0, 8)}
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
          </Col>
        )}

        {/* Indo-Pak Military Expenditure Comparison */}
        {expenditureData?.expenditureTrends && (
          <Col xs={24}>
            <ChartContainer>
              <div className="chart-title">India vs Pakistan Military Expenditure Analysis</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={expenditureData.expenditureTrends.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                    <XAxis dataKey="year" stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis yAxisId="ratio" orientation="right" stroke={ArmedForcesTheme.colors.success} />
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
                    <Line 
                      yAxisId="ratio"
                      type="monotone" 
                      dataKey="ratio" 
                      stroke={ArmedForcesTheme.colors.success}
                      strokeWidth={2}
                      name="India/Pakistan Ratio"
                      dot={{ fill: ArmedForcesTheme.colors.success, strokeWidth: 2, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}
      </Row>

      {/* Financial Strategic Assessment */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col span={24}>
          <CommandCard className="warning">
            <h3 style={{ color: ArmedForcesTheme.colors.warning, marginBottom: 16 }}>
              FINANCIAL STRATEGIC ASSESSMENT
            </h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`
                  }}
                >
                  <Statistic
                    title="Budget Efficiency"
                    value={92.7}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.success }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`
                  }}
                >
                  <Statistic
                    title="Export Growth"
                    value={15.3}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.success }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`
                  }}
                >
                  <Statistic
                    title="Self-Reliance Index"
                    value={78.4}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.warning }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`
                  }}
                >
                  <Statistic
                    title="Investment Ratio"
                    value={expenditureData?.summary?.currentRatio?.toFixed(1) || '0.0'}
                    suffix=":1"
                    valueStyle={{ color: ArmedForcesTheme.colors.accent }}
                  />
                </Card>
              </Col>
            </Row>
            
            <div style={{ marginTop: 16, color: ArmedForcesTheme.colors.textSecondary }}>
              <p>
                <strong>Financial Analysis Summary:</strong> Defense budget allocation demonstrates strategic 
                planning with consistent growth trajectory. Export performance indicates growing technological 
                capabilities and international market penetration.
              </p>
              <p>
                <strong>Strategic Recommendations:</strong> Continue investment in indigenous production 
                capabilities while expanding export partnerships. Optimize budget allocation towards emerging 
                technologies and force modernization programs.
              </p>
            </div>
          </CommandCard>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialAnalytics;
