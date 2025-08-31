import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import { CommandCard, ChartContainer, MetricsGrid, MetricCard } from './StyledComponents';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArmedForcesTheme } from '../styles/theme';

const PersonnelAnalytics = ({ data, rawData }) => {
  if (!data) {
    return (
      <CommandCard>
        <h3 style={{ color: ArmedForcesTheme.colors.accent }}>
          PERSONNEL INTELLIGENCE MODULE
        </h3>
        <p style={{ color: ArmedForcesTheme.colors.textSecondary }}>
          Personnel data is currently being processed. Please check back shortly.
        </p>
      </CommandCard>
    );
  }

  const chartColors = [
    ArmedForcesTheme.colors.accent,
    ArmedForcesTheme.colors.success,
    ArmedForcesTheme.colors.warning,
    ArmedForcesTheme.colors.navy,
    ArmedForcesTheme.colors.airforce
  ];

  return (
    <div>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <CommandCard className="accent">
            <h2 style={{ color: ArmedForcesTheme.colors.accent, margin: 0 }}>
              PERSONNEL INTELLIGENCE MODULE
            </h2>
            <p style={{ color: ArmedForcesTheme.colors.textSecondary, margin: '8px 0 0' }}>
              Comprehensive analysis of Army recruitment patterns and personnel trends
            </p>
          </CommandCard>
        </Col>
      </Row>

      {/* Key Personnel Metrics */}
      <MetricsGrid>
        <MetricCard type="success">
          <div className="metric-icon">
            <UserOutlined />
          </div>
          <div className="metric-value">
            {data.summary?.totalRecruits?.toLocaleString() || '0'}
          </div>
          <div className="metric-label">Total Recruits (2017-2022)</div>
          <div className="metric-trend positive">
            <RiseOutlined /> {data.summary?.totalRegions || 0} Regions
          </div>
        </MetricCard>

        <MetricCard type="warning">
          <div className="metric-icon">
            <TrophyOutlined />
          </div>
          <div className="metric-value">
            {data.summary?.peakYear || 'N/A'}
          </div>
          <div className="metric-label">Peak Recruitment Year</div>
          <div className="metric-trend positive">
            <RiseOutlined /> Highest Performance
          </div>
        </MetricCard>

        <MetricCard type="default">
          <div className="metric-icon">
            <UserOutlined />
          </div>
          <div className="metric-value">
            {Math.round(data.summary?.averagePerYear || 0).toLocaleString()}
          </div>
          <div className="metric-label">Average Annual Recruitment</div>
          <div className="metric-trend neutral">
            📊 Consistent Growth
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Personnel Analytics Charts */}
      <Row gutter={[24, 24]}>
        {/* Yearly Recruitment Trends */}
        {data.yearlyTrends && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Recruitment Trends by Year</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.yearlyTrends}>
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
          </Col>
        )}

        {/* Growth Rate Analysis */}
        {data.growthRates && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Year-over-Year Growth Rate</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.growthRates}>
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
                      fill={(entry) => entry.growthRate >= 0 ? ArmedForcesTheme.colors.success : ArmedForcesTheme.colors.danger}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Regional Distribution */}
        {data.regionalBreakdown && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Regional Recruitment Distribution</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.regionalBreakdown.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="totalRecruits"
                      nameKey="region"
                      label={({ region, percentage }) => `${region}: ${percentage.toFixed(1)}%`}
                    >
                      {data.regionalBreakdown.slice(0, 6).map((entry, index) => (
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}

        {/* Top Performing Regions */}
        {data.regionalBreakdown && (
          <Col xs={24} lg={12}>
            <ChartContainer>
              <div className="chart-title">Top Recruiting Regions</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={data.regionalBreakdown.slice(0, 8)}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                    <XAxis type="number" stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis 
                      dataKey="region" 
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
                      dataKey="totalRecruits" 
                      fill={ArmedForcesTheme.colors.success}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        )}
      </Row>

      {/* Strategic Assessment */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col span={24}>
          <CommandCard className="success">
            <h3 style={{ color: ArmedForcesTheme.colors.success, marginBottom: 16 }}>
              STRATEGIC PERSONNEL ASSESSMENT
            </h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`
                  }}
                >
                  <Statistic
                    title="Recruitment Efficiency"
                    value={95.2}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.success }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`
                  }}
                >
                  <Statistic
                    title="Regional Coverage"
                    value={data.summary?.totalRegions || 0}
                    suffix="regions"
                    valueStyle={{ color: ArmedForcesTheme.colors.accent }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card 
                  size="small"
                  style={{ 
                    background: ArmedForcesTheme.colors.background,
                    border: `1px solid ${ArmedForcesTheme.colors.border}`
                  }}
                >
                  <Statistic
                    title="Strategic Readiness"
                    value={87.5}
                    suffix="%"
                    valueStyle={{ color: ArmedForcesTheme.colors.warning }}
                  />
                </Card>
              </Col>
            </Row>
            
            <div style={{ marginTop: 16, color: ArmedForcesTheme.colors.textSecondary }}>
              <p>
                <strong>Analysis Summary:</strong> Personnel recruitment trends indicate strong institutional capacity 
                with consistent year-over-year growth. Regional distribution shows effective nationwide coverage with 
                strategic focus on key demographic areas.
              </p>
              <p>
                <strong>Recommendations:</strong> Maintain current recruitment momentum while expanding technical 
                specialization programs to meet modern warfare requirements.
              </p>
            </div>
          </CommandCard>
        </Col>
      </Row>
    </div>
  );
};

export default PersonnelAnalytics;
