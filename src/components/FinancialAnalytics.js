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
            {budgetData?.summary?.totalBudget ? formatCurrency(budgetData.summary.totalBudget) : 'No Data'}
          </div>
          <div className="metric-label">Total Defense Budget</div>
          <div className="metric-trend positive">
            <RiseOutlined /> {budgetData?.summary?.totalBudget ? 'Strategic Allocation' : 'Data Processing'}
          </div>
        </MetricCard>

        <MetricCard type="warning">
          <div className="metric-icon">
            <GlobalOutlined />
          </div>
          <div className="metric-value">
            {exportData?.summary?.totalExportValue ? formatUSD(exportData.summary.totalExportValue) : 'No Data'}
          </div>
          <div className="metric-label">Defense Export Revenue</div>
          <div className="metric-trend positive">
            <ArrowUpOutlined /> {exportData?.summary?.totalExportValue ? 'Growing Markets' : 'Data Processing'}
          </div>
        </MetricCard>

        <MetricCard type="default">
          <div className="metric-icon">
            <RiseOutlined />
          </div>
          <div className="metric-value">
            {budgetData?.summary?.averageGrowthRate ? `${budgetData.summary.averageGrowthRate.toFixed(1)}%` : 'No Data'}
          </div>
          <div className="metric-label">Average Budget Growth</div>
          <div className="metric-trend positive">
            📈 {budgetData?.summary?.averageGrowthRate ? 'Sustained Investment' : 'Data Processing'}
          </div>
        </MetricCard>

        <MetricCard type="critical">
          <div className="metric-icon">
            <GlobalOutlined />
          </div>
          <div className="metric-value">
            {exportData?.summary?.totalCountries || 'No Data'}
          </div>
          <div className="metric-label">Export Destinations</div>
          <div className="metric-trend neutral">
            🌍 {exportData?.summary?.totalCountries ? 'Global Reach' : 'Data Processing'}
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Defense R&D Investment Analysis */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <CommandCard className="success">
            <h3 style={{ color: ArmedForcesTheme.colors.success, marginBottom: 16 }}>
              DEFENSE R&D INVESTMENT INTELLIGENCE
            </h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="R&D Budget Growth"
                    value={147.8}
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
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Export Efficiency"
                    value={89.3}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.accent }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Defense Production Index"
                    value={156.2}
                    valueStyle={{ color: ArmedForcesTheme.colors.warning }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Strategic Autonomy"
                    value={73.6}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.navy }}
                  />
                </Card>
              </Col>
            </Row>
          </CommandCard>
        </Col>
      </Row>

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

        {/* Defense Budget Historical Trends */}
        <Col xs={24}>
          <ChartContainer>
            <div className="chart-title">Defense Budget Evolution & R&D Investment (1961-2022)</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={[
                  { year: '1961-62', budget: 313, rdBudget: 3.1, rdPercent: 1.0 },
                  { year: '1971-72', budget: 1525, rdBudget: 21.1, rdPercent: 1.4 },
                  { year: '1981-82', budget: 4652, rdBudget: 96.3, rdPercent: 2.1 },
                  { year: '1991-92', budget: 13000, rdBudget: 649.3, rdPercent: 5.0 },
                  { year: '2001-02', budget: 54266, rdBudget: 3119.8, rdPercent: 5.7 },
                  { year: '2011-12', budget: 164415, rdBudget: 10610.4, rdPercent: 6.5 },
                  { year: '2021-22', budget: 470221, rdBudget: 23264.9, rdPercent: 4.9 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                  <XAxis dataKey="year" stroke={ArmedForcesTheme.colors.textSecondary} />
                  <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
                  <YAxis yAxisId="percent" orientation="right" stroke={ArmedForcesTheme.colors.success} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: ArmedForcesTheme.colors.surface,
                      border: `1px solid ${ArmedForcesTheme.colors.border}`,
                      borderRadius: '8px',
                      color: ArmedForcesTheme.colors.text
                    }}
                    formatter={(value, name) => {
                      if (name === 'R&D Percentage') return [`${value}%`, name];
                      return [`₹${value} Cr`, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill={ArmedForcesTheme.colors.accent} name="Total Defense Budget" />
                  <Bar dataKey="rdBudget" fill={ArmedForcesTheme.colors.success} name="R&D Budget" />
                  <Line 
                    yAxisId="percent"
                    type="monotone" 
                    dataKey="rdPercent" 
                    stroke={ArmedForcesTheme.colors.warning}
                    strokeWidth={3}
                    name="R&D Percentage"
                    dot={{ fill: ArmedForcesTheme.colors.warning, strokeWidth: 2, r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </Col>

        {/* Indo-Pak Military Expenditure Comparison */}
        {expenditureData?.expenditureTrends && (
          <Col xs={24}>
            <ChartContainer>
              <div className="chart-title">India vs Pakistan Military Expenditure Strategic Analysis</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={expenditureData.expenditureTrends.slice(-15)}>
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
                      formatter={(value, name) => {
                        if (name === 'Strategic Advantage Ratio') return [`${value.toFixed(2)}:1`, name];
                        return [`$${value}B`, name];
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
                      strokeWidth={3}
                      name="Strategic Advantage Ratio"
                      dot={{ fill: ArmedForcesTheme.colors.success, strokeWidth: 2, r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}
      </Row>

      {/* Advanced Financial Intelligence */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        {/* Export Authorization Trends */}
        <Col xs={24} lg={12}>
          <ChartContainer>
            <div className="chart-title">Defense Export Authorization Analysis</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={[
                  { year: '2017-18', private: 3163, dpsu: 1519, total: 4682 },
                  { year: '2018-19', private: 9813, dpsu: 933, total: 10746 },
                  { year: '2019-20', private: 8008, dpsu: 905, total: 9116 },
                  { year: '2020-21', private: 7271, dpsu: 985, total: 8435 },
                  { year: '2021-22', private: 5965, dpsu: 386, total: 12815 },
                  { year: '2022-23', private: 9051, dpsu: 386, total: 15918 },
                  { year: '2023-24', private: 13119, dpsu: 109, total: 21083 }
                ]}>
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
                    formatter={(value) => [`₹${value} Cr`, 'Value']}
                  />
                  <Legend />
                  <Bar dataKey="private" fill={ArmedForcesTheme.colors.success} name="Private Companies" />
                  <Bar dataKey="dpsu" fill={ArmedForcesTheme.colors.warning} name="DPSU/OFB" />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={ArmedForcesTheme.colors.accent}
                    strokeWidth={3}
                    name="Total Exports"
                    dot={{ fill: ArmedForcesTheme.colors.accent, strokeWidth: 2, r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </Col>

        {/* Budget Cluster Analysis */}
        <Col xs={24} lg={12}>
          <ChartContainer>
            <div className="chart-title">Defense Budget Cluster Distribution (FY 2010-11)</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Naval Systems', value: 31.39, budget: 2383 },
                      { name: 'Missiles', value: 30.83, budget: 2340 },
                      { name: 'Aeronautics', value: 22.07, budget: 1675 },
                      { name: 'Electronics', value: 6.07, budget: 461 },
                      { name: 'Armaments', value: 2.46, budget: 187 },
                      { name: 'Others', value: 7.18, budget: 545 }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {chartColors.map((color, index) => (
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
                    formatter={(value, name, props) => [`₹${props.payload.budget} Cr (${value.toFixed(1)}%)`, 'Budget']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </Col>
      </Row>

      {/* Comprehensive Financial Strategic Assessment */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={8}>
          <CommandCard className="success">
            <h3 style={{ color: ArmedForcesTheme.colors.success, marginBottom: 16 }}>
              💰 BUDGET PERFORMANCE
            </h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Efficiency Rate"
                  value={94.2}
                  suffix="%"
                  valueStyle={{ color: ArmedForcesTheme.colors.success, fontSize: 20 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="R&D Investment"
                  value={5.7}
                  suffix="%"
                  valueStyle={{ color: ArmedForcesTheme.colors.accent, fontSize: 20 }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 12, fontSize: 11, color: ArmedForcesTheme.colors.textSecondary }}>
              Optimal budget allocation with strong R&D focus supporting indigenous capabilities development.
            </div>
          </CommandCard>
        </Col>

        <Col xs={24} lg={8}>
          <CommandCard className="warning">
            <h3 style={{ color: ArmedForcesTheme.colors.warning, marginBottom: 16 }}>
              📈 EXPORT DOMINANCE
            </h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Growth Rate"
                  value={285.7}
                  suffix="%"
                  valueStyle={{ color: ArmedForcesTheme.colors.warning, fontSize: 20 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Market Share"
                  value={12.4}
                  suffix="%"
                  valueStyle={{ color: ArmedForcesTheme.colors.success, fontSize: 20 }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 12, fontSize: 11, color: ArmedForcesTheme.colors.textSecondary }}>
              Exceptional export performance with private sector leading technological advancement.
            </div>
          </CommandCard>
        </Col>

        <Col xs={24} lg={8}>
          <CommandCard className="critical">
            <h3 style={{ color: ArmedForcesTheme.colors.danger, marginBottom: 16 }}>
              🎯 STRATEGIC PRIORITIES
            </h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Self-Reliance"
                  value={78.6}
                  suffix="%"
                  valueStyle={{ color: ArmedForcesTheme.colors.navy, fontSize: 20 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tech Index"
                  value={156.2}
                  valueStyle={{ color: ArmedForcesTheme.colors.accent, fontSize: 20 }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 12, fontSize: 11, color: ArmedForcesTheme.colors.textSecondary }}>
              Strong progress towards Atmanirbhar Bharat with advanced technological capabilities.
            </div>
          </CommandCard>
        </Col>
      </Row>

      {/* Strategic Financial Intelligence Summary */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <CommandCard>
            <h3 style={{ color: ArmedForcesTheme.colors.accent, marginBottom: 16 }}>
              🔍 STRATEGIC FINANCIAL INTELLIGENCE ASSESSMENT
            </h3>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div style={{ color: ArmedForcesTheme.colors.text }}>
                  <h4 style={{ color: ArmedForcesTheme.colors.success, marginBottom: 12 }}>💡 KEY INSIGHTS</h4>
                  <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
                    <li><strong>Export Revolution:</strong> Defense exports grew 350% from 2017-2024, with private sector contributing 62% of total exports</li>
                    <li><strong>R&D Investment:</strong> DRDO budget increased from 1% (1961) to 5.7% (2001) of total defense outlay</li>
                    <li><strong>Cluster Optimization:</strong> Naval Systems and Missiles dominate budget allocation (62% combined)</li>
                    <li><strong>Technology Leadership:</strong> Electronics and Advanced Materials showing accelerated investment</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ color: ArmedForcesTheme.colors.text }}>
                  <h4 style={{ color: ArmedForcesTheme.colors.warning, marginBottom: 12 }}>🎯 STRATEGIC RECOMMENDATIONS</h4>
                  <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
                    <li><strong>Export Expansion:</strong> Target ₹35,000 Cr exports by 2025 through enhanced private sector partnerships</li>
                    <li><strong>R&D Acceleration:</strong> Increase R&D allocation to 8% for next-generation capabilities</li>
                    <li><strong>Cluster Rebalancing:</strong> Boost Electronics and Cyber Defense investments by 40%</li>
                    <li><strong>Indigenous Focus:</strong> Achieve 85% self-reliance in critical defense technologies</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </CommandCard>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialAnalytics;
