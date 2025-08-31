import React from 'react';
import { Row, Col, Card, Statistic, Alert } from 'antd';
import { 
  WarningOutlined, GlobalOutlined, SafetyOutlined, 
  TrophyOutlined, RiseOutlined, ExclamationOutlined 
} from '@ant-design/icons';
import { CommandCard, ChartContainer, MetricsGrid, MetricCard, StatusIndicator } from './StyledComponents';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  ComposedChart, PieChart, Pie, Cell
} from 'recharts';
import { ArmedForcesTheme } from '../styles/theme';

const StrategicAnalytics = ({ conflictData, globalData, expenditureData }) => {
  const chartColors = [
    ArmedForcesTheme.colors.accent,
    ArmedForcesTheme.colors.success,
    ArmedForcesTheme.colors.warning,
    ArmedForcesTheme.colors.danger,
    ArmedForcesTheme.colors.navy,
    ArmedForcesTheme.colors.airforce
  ];

  // Calculate strategic metrics
  const getStrategicMetrics = () => {
    return {
      securityIncidents: conflictData?.summary?.totalIncidents || 0,
      globalRank: globalData?.summary?.indiaRank || 'N/A',
      expenditureRatio: expenditureData?.summary?.currentRatio || 0,
      timespan: conflictData?.summary?.yearSpan || 'N/A'
    };
  };

  const metrics = getStrategicMetrics();

  return (
    <div>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <CommandCard className="critical">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: ArmedForcesTheme.colors.accent, margin: 0 }}>
                  STRATEGIC INTELLIGENCE MODULE
                </h2>
                <p style={{ color: ArmedForcesTheme.colors.textSecondary, margin: '8px 0 0' }}>
                  Comprehensive analysis of security threats, global positioning, and strategic capabilities
                </p>
              </div>
              <StatusIndicator className="warning">
                <div className="status-dot" />
                ACTIVE MONITORING
              </StatusIndicator>
            </div>
          </CommandCard>
        </Col>
      </Row>

      {/* Strategic Metrics */}
      <MetricsGrid>
        <MetricCard type="critical">
          <div className="metric-icon">
            <WarningOutlined />
          </div>
          <div className="metric-value">{metrics.securityIncidents}</div>
          <div className="metric-label">Security Incidents Monitored</div>
          <div className="metric-trend neutral">
            <ExclamationOutlined /> Timespan: {metrics.timespan}
          </div>
        </MetricCard>

        <MetricCard type="success">
          <div className="metric-icon">
            <TrophyOutlined />
          </div>
          <div className="metric-value">{metrics.globalRank}</div>
          <div className="metric-label">Global Military Ranking</div>
          <div className="metric-trend positive">
            <RiseOutlined /> Strong Position
          </div>
        </MetricCard>

        <MetricCard type="warning">
          <div className="metric-icon">
            <GlobalOutlined />
          </div>
          <div className="metric-value">{metrics.expenditureRatio?.toFixed(1) || '0.0'}:1</div>
          <div className="metric-label">Military Expenditure Ratio</div>
          <div className="metric-trend positive">
            <SafetyOutlined /> Strategic Advantage
          </div>
        </MetricCard>

        <MetricCard type="default">
          <div className="metric-icon">
            <SafetyOutlined />
          </div>
          <div className="metric-value">ACTIVE</div>
          <div className="metric-label">Defense Readiness Status</div>
          <div className="metric-trend positive">
            ✅ All Systems Operational
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Threat Level Alert */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Alert
            message="Current Threat Assessment: MODERATE"
            description="Continuous monitoring of regional security dynamics. All defense systems remain operational with enhanced surveillance protocols active."
            type="warning"
            showIcon
            style={{
              background: `${ArmedForcesTheme.colors.warning}15`,
              border: `1px solid ${ArmedForcesTheme.colors.warning}`,
              color: ArmedForcesTheme.colors.text
            }}
          />
        </Col>
      </Row>

      {/* Strategic Analytics Charts */}
      <Row gutter={[24, 24]}>
        {/* Conflict Escalation Timeline */}
        {conflictData?.escalationPatterns && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Security Incident Patterns</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={conflictData.escalationPatterns}>
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
          </Col>
        )}

        {/* Severity Analysis */}
        {conflictData?.severityTrends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Incident Severity Distribution</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conflictData.severityTrends}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="severity"
                      label={({ severity, percentage }) => `${severity}: ${percentage.toFixed(1)}%`}
                    >
                      {conflictData.severityTrends.map((entry, index) => {
                        let color = ArmedForcesTheme.colors.success;
                        if (entry.severity.toLowerCase().includes('high') || 
                            entry.severity.toLowerCase().includes('critical')) {
                          color = ArmedForcesTheme.colors.danger;
                        } else if (entry.severity.toLowerCase().includes('medium') || 
                                   entry.severity.toLowerCase().includes('moderate')) {
                          color = ArmedForcesTheme.colors.warning;
                        }
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: ArmedForcesTheme.colors.surface,
                        border: `1px solid ${ArmedForcesTheme.colors.border}`,
                        borderRadius: '8px',
                        color: ArmedForcesTheme.colors.text
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Global Military Comparison */}
        {globalData?.countryRankings && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Global Military Power Rankings</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={globalData.countryRankings.slice(0, 10)}
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
                      fill={(entry) => entry.country.toLowerCase().includes('india') ? 
                        ArmedForcesTheme.colors.accent : ArmedForcesTheme.colors.navy}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Long-term Expenditure Analysis */}
        {expenditureData?.expenditureTrends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Strategic Expenditure Advantage</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={expenditureData.expenditureTrends.slice(-15)}>
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
                    <Line 
                      type="monotone" 
                      dataKey="ratio" 
                      stroke={ArmedForcesTheme.colors.success}
                      strokeWidth={3}
                      dot={{ fill: ArmedForcesTheme.colors.success, strokeWidth: 2, r: 6 }}
                      name="India/Pakistan Expenditure Ratio"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Defense Personnel Comparison */}
        {globalData?.countryRankings && (
          <Col xs={24}>
            <ChartContainer>
              <div className="chart-title">Global Defense Personnel Comparison</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={globalData.countryRankings.filter(c => c.activePersonnel > 0).slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                    <XAxis dataKey="country" stroke={ArmedForcesTheme.colors.textSecondary} angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis yAxisId="budget" orientation="right" stroke={ArmedForcesTheme.colors.warning} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: ArmedForcesTheme.colors.surface,
                        border: `1px solid ${ArmedForcesTheme.colors.border}`,
                        borderRadius: '8px',
                        color: ArmedForcesTheme.colors.text
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="activePersonnel" 
                      fill={ArmedForcesTheme.colors.accent} 
                      name="Active Personnel (Thousands)"
                    />
                    <Line 
                      yAxisId="budget"
                      type="monotone" 
                      dataKey="defense_budget" 
                      stroke={ArmedForcesTheme.colors.warning}
                      strokeWidth={2}
                      name="Defense Budget ($B)"
                      dot={{ fill: ArmedForcesTheme.colors.warning, strokeWidth: 2, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}
      </Row>

      {/* Strategic Assessment & Recommendations */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={12}>
          <CommandCard className="success">
            <h3 style={{ color: ArmedForcesTheme.colors.success, marginBottom: 16 }}>
              STRATEGIC ADVANTAGES
            </h3>
            <div style={{ color: ArmedForcesTheme.colors.text }}>
              <ul style={{ paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>
                  <strong>Global Ranking:</strong> Maintains top-tier military position internationally
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong>Personnel Strength:</strong> Large, well-trained active force
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong>Expenditure Advantage:</strong> Sustainable defense investment ratio
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong>Technological Edge:</strong> Growing indigenous capabilities
                </li>
                <li>
                  <strong>Strategic Partnerships:</strong> Strong international defense cooperation
                </li>
              </ul>
            </div>
          </CommandCard>
        </Col>

        <Col xs={24} lg={12}>
          <CommandCard className="warning">
            <h3 style={{ color: ArmedForcesTheme.colors.warning, marginBottom: 16 }}>
              STRATEGIC RECOMMENDATIONS
            </h3>
            <div style={{ color: ArmedForcesTheme.colors.text }}>
              <ul style={{ paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>
                  <strong>Border Security:</strong> Enhance surveillance and early warning systems
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong>Cyber Defense:</strong> Strengthen digital warfare capabilities
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong>Technology Focus:</strong> Invest in AI and autonomous systems
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong>Regional Stability:</strong> Maintain diplomatic initiatives
                </li>
                <li>
                  <strong>Force Modernization:</strong> Continue equipment upgrade programs
                </li>
              </ul>
            </div>
          </CommandCard>
        </Col>
      </Row>

      {/* Key Performance Indicators */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <CommandCard>
            <h3 style={{ color: ArmedForcesTheme.colors.accent, marginBottom: 16 }}>
              STRATEGIC PERFORMANCE INDICATORS
            </h3>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6} md={4}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Readiness Level"
                    value={94.2}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.success, fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Tech Index"
                    value={87.6}
                    suffix="/100"
                    valueStyle={{ color: ArmedForcesTheme.colors.warning, fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Global Rank"
                    value={metrics.globalRank}
                    valueStyle={{ color: ArmedForcesTheme.colors.accent, fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Self-Reliance"
                    value={78.3}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.navy, fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Export Growth"
                    value={12.7}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.success, fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`,
                    textAlign: 'center'
                  }}
                >
                  <Statistic
                    title="Threat Level"
                    value="MODERATE"
                    valueStyle={{ color: ArmedForcesTheme.colors.warning, fontSize: 16 }}
                  />
                </Card>
              </Col>
            </Row>
          </CommandCard>
        </Col>
      </Row>
    </div>
  );
};

export default StrategicAnalytics;
