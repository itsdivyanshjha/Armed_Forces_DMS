import React from 'react';
import { Row, Col, Card, Statistic, Alert } from 'antd';
import { 
  WarningOutlined, GlobalOutlined, SafetyOutlined, 
  TrophyOutlined, RiseOutlined, ExclamationOutlined 
} from '@ant-design/icons';
import { CommandCard, ChartContainer, MetricsGrid, MetricCard, StatusIndicator } from './StyledComponents';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  ComposedChart, PieChart, Pie, Cell
} from 'recharts';
import { ArmedForcesTheme } from '../styles/theme';

const StrategicAnalytics = ({ conflictData, globalData, expenditureData }) => {
  // Colors derived directly where used; no unused local palette

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
                <h2 style={{ color: ArmedForcesTheme.colors.accent, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="bi bi-shield-fill-check" /> STRATEGIC INTELLIGENCE MODULE
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

      {/* Enhanced Threat Intelligence Dashboard */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Alert
            message="CURRENT THREAT LEVEL: HEIGHTENED"
            description="Regional security analysis indicates elevated risk patterns. Enhanced surveillance and rapid response protocols active across all sectors."
            type="warning"
            showIcon
            style={{
              background: `${ArmedForcesTheme.colors.warning}15`,
              border: `1px solid ${ArmedForcesTheme.colors.warning}`,
              color: ArmedForcesTheme.colors.text
            }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Alert
            message="STRATEGIC POSTURE: DEFENSIVE READINESS"
            description="All command centers operational. Force deployment optimized for multi-domain operations with advanced early warning systems active."
            type="info"
            showIcon
            style={{
              background: `${ArmedForcesTheme.colors.accent}15`,
              border: `1px solid ${ArmedForcesTheme.colors.accent}`,
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
              <div className="chart-title"><i className="bi bi-activity" /> Security Incident Patterns</div>
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
              <div className="chart-title"><i className="bi bi-pie-chart" /> Incident Severity Distribution</div>
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
              <div className="chart-title"><i className="bi bi-bar-chart" /> Global Military Power Rankings</div>
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
              <div className="chart-title"><i className="bi bi-graph-up-arrow" /> Strategic Expenditure Advantage</div>
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

        {/* Conflict Severity Distribution */}
        {conflictData?.severityTrends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Security Incident Severity Analysis</div>
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

        {/* Strategic Expenditure Advantage Timeline */}
        {expenditureData?.expenditureTrends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Strategic Military Expenditure Advantage (2010-2023)</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={expenditureData.expenditureTrends.slice(-14)}>
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
                        if (name === 'Strategic Ratio') return [`${value.toFixed(2)}:1`, name];
                        return [`$${value}B`, name];
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="india" 
                      stroke={ArmedForcesTheme.colors.accent}
                      fill={`${ArmedForcesTheme.colors.accent}33`}
                      name="India Expenditure ($B)"
                    />
                    <Line 
                      yAxisId="ratio"
                      type="monotone" 
                      dataKey="ratio" 
                      stroke={ArmedForcesTheme.colors.success}
                      strokeWidth={3}
                      name="Strategic Ratio"
                      dot={{ fill: ArmedForcesTheme.colors.success, strokeWidth: 2, r: 5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}
      </Row>

      {/* Advanced Strategic Intelligence Assessment */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={8}>
          <CommandCard className="success">
            <h3 style={{ color: ArmedForcesTheme.colors.success, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-stars" /> STRATEGIC ADVANTAGES
            </h3>
            <div style={{ color: ArmedForcesTheme.colors.text, fontSize: 12 }}>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.success}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-geo-alt-fill" /> Global Position:</strong> 2nd largest military force globally with 2.61M total personnel
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.accent}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-lightning-charge-fill" /> Force Multiplier:</strong> 7.4:1 expenditure advantage over Pakistan maintaining strategic deterrence
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.navy}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-cpu-fill" /> Technology Edge:</strong> Advanced missile systems, space capabilities, and cyber warfare units
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.success}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-people-fill" /> Alliance Network:</strong> QUAD, SCO partnerships enhancing strategic depth
              </div>
            </div>
          </CommandCard>
        </Col>

        <Col xs={24} lg={8}>
          <CommandCard className="warning">
            <h3 style={{ color: ArmedForcesTheme.colors.warning, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-exclamation-triangle-fill" /> THREAT ASSESSMENT
            </h3>
            <div style={{ color: ArmedForcesTheme.colors.text, fontSize: 12 }}>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.danger}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-arrow-up-right-circle-fill" /> Escalation Pattern:</strong> 9 major incidents since 2001, with 67% high-impact events
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.warning}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-bullseye" /> Terror Nexus:</strong> 56% of conflicts initiated by non-state actors with state backing
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.warning}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-geo" /> Border Dynamics:</strong> LoC remains primary flashpoint with 78% of skirmishes
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.danger}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-arrow-repeat" /> Cycle Analysis:</strong> 3-4 year escalation cycle with increasing severity
              </div>
            </div>
          </CommandCard>
        </Col>

        <Col xs={24} lg={8}>
          <CommandCard className="critical">
            <h3 style={{ color: ArmedForcesTheme.colors.danger, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-shield-fill-plus" /> STRATEGIC IMPERATIVES
            </h3>
            <div style={{ color: ArmedForcesTheme.colors.text, fontSize: 12 }}>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.accent}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-diagram-3-fill" /> Intelligence Fusion:</strong> AI-powered threat detection across multi-domain spectrum
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.navy}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-lightning-fill" /> Rapid Response:</strong> 48-hour deployment capability for surgical operations
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.success}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-tools" /> Force Modernization:</strong> 65% equipment upgrade completion by 2030
              </div>
              <div style={{ marginBottom: 12, padding: 8, background: `${ArmedForcesTheme.colors.warning}15`, borderRadius: 4 }}>
                <strong><i className="bi bi-shield-check" /> Diplomatic Shield:</strong> Multilateral engagement preventing escalation
              </div>
            </div>
          </CommandCard>
        </Col>
      </Row>

      {/* Comprehensive Threat Matrix */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <CommandCard>
            <h3 style={{ color: ArmedForcesTheme.colors.accent, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-search" /> COMPREHENSIVE STRATEGIC THREAT MATRIX
            </h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div style={{ 
                  background: `${ArmedForcesTheme.colors.danger}15`, 
                  border: `1px solid ${ArmedForcesTheme.colors.danger}`,
                  borderRadius: 8,
                  padding: 16
                }}>
                  <h4 style={{ color: ArmedForcesTheme.colors.danger, marginBottom: 12 }}>HIGH PRIORITY THREATS</h4>
                  <ul style={{ fontSize: 11, lineHeight: 1.5, paddingLeft: 16 }}>
                    <li>Cross-border terrorism with state sponsorship</li>
                    <li>Cyber warfare targeting critical infrastructure</li>
                    <li>Nuclear escalation risks during crisis periods</li>
                    <li>Proxy conflicts in Kashmir and Northeast regions</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ 
                  background: `${ArmedForcesTheme.colors.warning}15`, 
                  border: `1px solid ${ArmedForcesTheme.colors.warning}`,
                  borderRadius: 8,
                  padding: 16
                }}>
                  <h4 style={{ color: ArmedForcesTheme.colors.warning, marginBottom: 12 }}>MEDIUM PRIORITY CONCERNS</h4>
                  <ul style={{ fontSize: 11, lineHeight: 1.5, paddingLeft: 16 }}>
                    <li>Border infrastructure development competition</li>
                    <li>Maritime domain awareness in Arabian Sea</li>
                    <li>Space warfare capabilities development</li>
                    <li>Economic warfare through trade disruption</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ 
                  background: `${ArmedForcesTheme.colors.success}15`, 
                  border: `1px solid ${ArmedForcesTheme.colors.success}`,
                  borderRadius: 8,
                  padding: 16
                }}>
                  <h4 style={{ color: ArmedForcesTheme.colors.success, marginBottom: 12 }}>MANAGED RISKS</h4>
                  <ul style={{ fontSize: 11, lineHeight: 1.5, paddingLeft: 16 }}>
                    <li>Conventional military balance maintained</li>
                    <li>International diplomatic support secured</li>
                    <li>Defense technology self-reliance improving</li>
                    <li>Strategic partnerships strengthening deterrence</li>
                  </ul>
                </div>
              </Col>
            </Row>
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
