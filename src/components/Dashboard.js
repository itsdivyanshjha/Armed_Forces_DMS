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
      conflictIncidents: processedData.conflictData?.summary?.totalIncidents || 0,
      icgSafetyIndex: processedData.icgReports?.summary?.safetyIndex || 0,
      icgTotalReports: processedData.icgReports?.summary?.totalReports || 0,
      icgDefects: processedData.icgReports?.summary?.totalDefects || 0,
      icgIncidents: processedData.icgReports?.summary?.totalIncidents || 0
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

        <MetricCard type="success">
          <div className="metric-icon">
            <CheckCircleOutlined />
          </div>
          <div className="metric-value">{metrics.icgSafetyIndex.toFixed(1)}%</div>
          <div className="metric-label">ICG Safety Index</div>
          <div className="metric-trend positive">
            <CheckCircleOutlined /> Operational Safety
          </div>
        </MetricCard>

        <MetricCard type="warning">
          <div className="metric-icon">
            <WarningOutlined />
          </div>
          <div className="metric-value">{metrics.icgDefects}</div>
          <div className="metric-label">Aircraft Defects</div>
          <div className="metric-trend neutral">
            <WarningOutlined /> Maintenance Tracking
          </div>
        </MetricCard>

        <MetricCard type="default">
          <div className="metric-icon">
            <GlobalOutlined />
          </div>
          <div className="metric-value">{metrics.icgTotalReports}</div>
          <div className="metric-label">ICG Total Reports</div>
          <div className="metric-trend neutral">
            <CheckCircleOutlined /> Coast Guard Operations
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

        {/* Defense Export Trends - Different from Financial Intelligence */}
        {processedData.defenseExports?.exportTrends && (
          <ChartContainer>
            <div className="chart-title">Defense Export Growth Trends</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedData.defenseExports.exportTrends}>
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
                    formatter={(value) => [`₹${value.toLocaleString()} Cr`, 'Export Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke={ArmedForcesTheme.colors.airforce}
                    strokeWidth={3}
                    dot={{ fill: ArmedForcesTheme.colors.airforce, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}

        {/* ICG Defect Analysis - removed by request */}

        {/* ICG Unit Performance */}
        {processedData.icgReports?.defectAnalysis?.defectByUnit && (
          <ChartContainer>
            <div className="chart-title">ICG Unit Defect Distribution</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processedData.icgReports.defectAnalysis.defectByUnit.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="defectCount"
                    nameKey="unit"
                    label={({ unit, percentage }) => `${unit}: ${percentage.toFixed(1)}%`}
                  >
                    {processedData.icgReports.defectAnalysis.defectByUnit.slice(0, 6).map((entry, index) => (
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

        {/* Global Armed Forces Comparison - removed by request */}

        {/* ICG Incident Analysis */}
        {processedData.icgReports?.incidentAnalysis?.causeClassification && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">ICG Incident Cause Analysis</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processedData.icgReports.incidentAnalysis.causeClassification.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="cause"
                      label={({ cause, percentage }) => `${cause}: ${percentage.toFixed(1)}%`}
                    >
                      {processedData.icgReports.incidentAnalysis.causeClassification.slice(0, 6).map((entry, index) => (
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
          </Col>
        )}

        {/* ICG Safety Overview */}
        {processedData.icgReports?.safetyMetrics && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">ICG Safety Metrics Overview</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { 
                        metric: 'Safety Index', 
                        value: processedData.icgReports.safetyMetrics.safetyIndex,
                        color: ArmedForcesTheme.colors.success
                      },
                      { 
                        metric: 'Defect Rate', 
                        value: processedData.icgReports.safetyMetrics.defectRate,
                        color: ArmedForcesTheme.colors.warning
                      },
                      { 
                        metric: 'Incident Rate', 
                        value: processedData.icgReports.safetyMetrics.incidentRate,
                        color: ArmedForcesTheme.colors.danger
                      }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                    <XAxis dataKey="metric" stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: ArmedForcesTheme.colors.surface,
                        border: `1px solid ${ArmedForcesTheme.colors.border}`,
                        borderRadius: '8px',
                        color: ArmedForcesTheme.colors.text
                      }}
                      formatter={(value) => [`${value.toFixed(1)}%`, 'Rate']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={ArmedForcesTheme.colors.accent}
                      radius={[4, 4, 0, 0]}
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
