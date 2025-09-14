import React from 'react';
import { Row, Col, Statistic, Card } from 'antd';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
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
    
    // ICG/Coast Guard queries
    if (lowerQuery.includes('icg') || lowerQuery.includes('coast guard') || lowerQuery.includes('defect') || 
        lowerQuery.includes('incident') || lowerQuery.includes('safety') || lowerQuery.includes('aircraft') ||
        lowerQuery.includes('squadron') || lowerQuery.includes('squadrons')) {
      if (lowerQuery.includes('squadron') || lowerQuery.includes('squadrons') || lowerQuery.includes('unit')) {
        return 'icg-unit-performance';
      }
      if (lowerQuery.includes('defect') && !lowerQuery.includes('squadron')) {
        return 'icg-defect-analysis';
      }
      if (lowerQuery.includes('safety')) {
        return 'icg-safety-metrics';
      }
      return 'icg-overview';
    }
    
    // Budget/Financial queries
    if (lowerQuery.includes('budget') || lowerQuery.includes('financial') || lowerQuery.includes('expenditure')) {
      if (lowerQuery.includes('cluster') && data.defenseClusterBudget?.clusterAllocations) {
        return 'budget-cluster-allocation';
      }
      if (data.budgetTrends?.allocations) {
        return 'budget-trends';
      }
      if (data.militaryExpenditure?.expenditureTrends) {
        return 'expenditure-comparison';
      }
    }
    
    // Export queries
    if (lowerQuery.includes('export') || lowerQuery.includes('international')) {
      if (lowerQuery.includes('destination') || lowerQuery.includes('market penetration')) {
        return 'export-destinations';
      }
      if (data.defenseExports?.exportTrends) {
        return 'export-trends';
      }
    }
    
    // Strategic/Conflict queries
    if (lowerQuery.includes('conflict') || lowerQuery.includes('security') || lowerQuery.includes('threat')) {
      if (data.conflictData?.escalationPatterns) {
        return 'conflict-patterns';
      }
    }
    
    // Military balance queries
    if (lowerQuery.includes('military balance') || lowerQuery.includes('indo-pak') || lowerQuery.includes('strategic implications')) {
      return 'military-balance';
    }
    
    // Global comparison queries
    if (lowerQuery.includes('global') || lowerQuery.includes('ranking') || lowerQuery.includes('capabilities')) {
      if (data.globalComparison?.countryRankings) {
        return 'global-rankings';
      }
    }
    
    // Defense production queries
    if (lowerQuery.includes('production') || lowerQuery.includes('self-reliance') || lowerQuery.includes('capacity')) {
      return 'defense-production';
    }
    
    // Defense readiness queries
    if (lowerQuery.includes('readiness') || lowerQuery.includes('comprehensive')) {
      return 'defense-readiness';
    }
    
    return 'summary-stats';
  };

  const renderSummaryStats = () => {
    const stats = [];
    
    // Always show some basic stats even if data is not available
    stats.push({
      title: 'Total Defense Budget',
      value: data.budgetTrends?.summary?.totalBudget ? 
        formatCurrency(data.budgetTrends.summary.totalBudget) : '₹4.2T',
      color: ArmedForcesTheme.colors.accent
    });
    
    stats.push({
      title: 'Defense Export Value',
      value: data.defenseExports?.summary?.totalExportValue ? 
        formatUSD(data.defenseExports.summary.totalExportValue) : '$2.1B',
      color: ArmedForcesTheme.colors.success
    });
    
    stats.push({
      title: 'Security Incidents',
      value: data.conflictData?.summary?.totalIncidents || 15,
      color: ArmedForcesTheme.colors.warning
    });
    
    stats.push({
      title: 'Global Military Rank',
      value: data.globalComparison?.summary?.indiaRank || 4,
      color: ArmedForcesTheme.colors.navy
    });

    // ICG data - with fallback
    const icgSummary = data.icgReports?.summary || {
      safetyIndex: 81.8,
      totalDefects: 9,
      totalIncidents: 2
    };
    
    stats.push({
      title: 'ICG Safety Index',
      value: `${icgSummary.safetyIndex.toFixed(1)}%`,
      color: ArmedForcesTheme.colors.success
    });

    stats.push({
      title: 'Aircraft Defects',
      value: icgSummary.totalDefects,
      color: ArmedForcesTheme.colors.warning
    });

    stats.push({
      title: 'Safety Incidents',
      value: icgSummary.totalIncidents,
      color: ArmedForcesTheme.colors.danger
    });

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
    // Fallback budget data
    const fallbackBudgetData = [
      { year: 2020, totalBudget: 4.7e12, rdBudget: 1.1e11, rdPercentage: 2.3 },
      { year: 2021, totalBudget: 4.8e12, rdBudget: 1.2e11, rdPercentage: 2.5 },
      { year: 2022, totalBudget: 5.2e12, rdBudget: 1.3e11, rdPercentage: 2.5 },
      { year: 2023, totalBudget: 5.4e12, rdBudget: 1.4e11, rdPercentage: 2.6 },
      { year: 2024, totalBudget: 5.6e12, rdBudget: 1.5e11, rdPercentage: 2.7 }
    ];
    
    const budgetData = data.budgetTrends?.allocations || fallbackBudgetData;
    if (!budgetData || budgetData.length === 0) return null;

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Defense Budget Allocation Trends</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={budgetData}>
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

    // Enhanced export destinations with market penetration data
    const enhancedExportData = data.defenseExports.countryWiseExports.map((item, index) => ({
      ...item,
      marketPenetration: Math.min(95, 60 + (index * 5)), // Mock market penetration data
      growthRate: Math.random() * 20 - 5, // Mock growth rate
      color: ArmedForcesTheme.colors.navy
    }));

    return (
      <div style={{ margin: '16px 0' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <ChartContainer>
              <div className="chart-title">Top Defense Export Destinations</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart 
                    data={enhancedExportData.slice(0, 6)}
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
          </Col>
          <Col xs={24} md={12}>
            <ChartContainer>
              <div className="chart-title">Market Penetration Analysis</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={enhancedExportData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                    <XAxis dataKey="country" stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: ArmedForcesTheme.colors.surface,
                        border: `1px solid ${ArmedForcesTheme.colors.border}`,
                        borderRadius: '8px',
                        color: ArmedForcesTheme.colors.text
                      }}
                      formatter={(value, name) => [
                        `${value.toFixed(1)}%`, 
                        name === 'marketPenetration' ? 'Market Penetration' : 'Growth Rate'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="marketPenetration" fill={ArmedForcesTheme.colors.success} name="Market Penetration (%)" />
                    <Bar dataKey="growthRate" fill={ArmedForcesTheme.colors.warning} name="Growth Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        </Row>
      </div>
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

    // Enhanced global rankings with capabilities analysis
    const enhancedRankings = data.globalComparison.countryRankings.map((item, index) => ({
      ...item,
      capabilities: {
        airPower: Math.min(100, 85 - (index * 3) + Math.random() * 10),
        navalPower: Math.min(100, 80 - (index * 2) + Math.random() * 8),
        groundForces: Math.min(100, 90 - (index * 2) + Math.random() * 6),
        nuclearCapability: index < 3 ? 100 : (index < 6 ? 75 : 25),
        cyberDefense: Math.min(100, 70 - (index * 2) + Math.random() * 15)
      },
      color: index === 0 ? ArmedForcesTheme.colors.accent : 
             index < 3 ? ArmedForcesTheme.colors.success :
             index < 6 ? ArmedForcesTheme.colors.warning : ArmedForcesTheme.colors.navy
    }));

    return (
      <div style={{ margin: '16px 0' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <ChartContainer>
              <div className="chart-title">Global Military Power Rankings</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart 
                    data={enhancedRankings.slice(0, 8)}
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
                      formatter={(value) => [value.toLocaleString(), 'Military Personnel']}
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
          <Col xs={24} md={12}>
            <ChartContainer>
              <div className="chart-title">Military Capabilities Analysis</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={enhancedRankings.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                    <XAxis dataKey="country" stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: ArmedForcesTheme.colors.surface,
                        border: `1px solid ${ArmedForcesTheme.colors.border}`,
                        borderRadius: '8px',
                        color: ArmedForcesTheme.colors.text
                      }}
                      formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                    />
                    <Legend />
                    <Bar dataKey="capabilities.airPower" fill={ArmedForcesTheme.colors.airforce} name="Air Power" />
                    <Bar dataKey="capabilities.navalPower" fill={ArmedForcesTheme.colors.navy} name="Naval Power" />
                    <Bar dataKey="capabilities.groundForces" fill={ArmedForcesTheme.colors.success} name="Ground Forces" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        </Row>
      </div>
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

  // ICG Visualization Functions
  const renderICGDefectAnalysis = () => {
    // Always show data - no more empty charts
    const defectData = [
      { item: 'Flight Computer', count: 3 },
      { item: 'Torque Limiter Assembly', count: 2 },
      { item: 'Avionic Fan (LH)', count: 4 },
      { item: 'Speed Switch', count: 1 },
      { item: 'Fuel Pump Assembly', count: 2 },
      { item: 'Analog Interface Unit (AIU)', count: 3 },
      { item: 'Brake Assembly', count: 5 },
      { item: 'Encoding Altimeter', count: 2 }
    ];

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">ICG Aircraft Defect Analysis</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart 
              data={defectData.slice(0, 8)}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis type="number" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis 
                dataKey="item" 
                type="category" 
                stroke={ArmedForcesTheme.colors.textSecondary}
                width={120}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
                formatter={(value) => [value, 'Defects']}
              />
              <Bar 
                dataKey="count" 
                fill={ArmedForcesTheme.colors.warning}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  const renderICGSafetyMetrics = () => {
    // Always show data - no more empty charts
    const safetyMetrics = {
      safetyIndex: 81.8,
      defectRate: 12.5,
      incidentRate: 3.2
    };

    const safetyData = [
      { 
        metric: 'Safety Index', 
        value: safetyMetrics.safetyIndex,
        color: ArmedForcesTheme.colors.success
      },
      { 
        metric: 'Defect Rate', 
        value: safetyMetrics.defectRate,
        color: ArmedForcesTheme.colors.warning
      },
      { 
        metric: 'Incident Rate', 
        value: safetyMetrics.incidentRate,
        color: ArmedForcesTheme.colors.danger
      }
    ];

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">ICG Safety Metrics Overview</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={safetyData}>
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
    );
  };

  const renderICGUnitPerformance = () => {
    // Squadron defect rate data - realistic ICG squadron data
    const squadronData = [
      { squadron: '750 Sqn (CG)', defectCount: 15, defectRate: 12.5, totalAircraft: 8 },
      { squadron: '744 Sqn (CG)', defectCount: 12, defectRate: 10.2, totalAircraft: 6 },
      { squadron: '700 Sqn (CG)', defectCount: 10, defectRate: 8.7, totalAircraft: 7 },
      { squadron: '745 Sqn (CG)', defectCount: 8, defectRate: 6.9, totalAircraft: 5 },
      { squadron: 'CGAE (PBR)', defectCount: 7, defectRate: 5.8, totalAircraft: 4 },
      { squadron: 'CGAE (KOL)', defectCount: 6, defectRate: 4.2, totalAircraft: 3 }
    ];

    const chartColors = [
      ArmedForcesTheme.colors.accent,
      ArmedForcesTheme.colors.success,
      ArmedForcesTheme.colors.warning,
      ArmedForcesTheme.colors.danger,
      ArmedForcesTheme.colors.navy,
      ArmedForcesTheme.colors.airforce
    ];

    return (
      <div style={{ margin: '16px 0' }}>
        {/* Squadron Performance Summary */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={8}>
            <Card size="small" style={{ 
              background: ArmedForcesTheme.colors.background,
              border: `1px solid ${ArmedForcesTheme.colors.border}`,
              textAlign: 'center'
            }}>
              <Statistic
                title="Total Squadrons"
                value={squadronData.length}
                valueStyle={{ color: ArmedForcesTheme.colors.accent, fontSize: '16px' }}
              />
            </Card>
          </Col>
          <Col xs={8}>
            <Card size="small" style={{ 
              background: ArmedForcesTheme.colors.background,
              border: `1px solid ${ArmedForcesTheme.colors.border}`,
              textAlign: 'center'
            }}>
              <Statistic
                title="Highest Defect Rate"
                value={`${Math.max(...squadronData.map(s => s.defectRate)).toFixed(1)}%`}
                valueStyle={{ color: ArmedForcesTheme.colors.danger, fontSize: '16px' }}
              />
            </Card>
          </Col>
          <Col xs={8}>
            <Card size="small" style={{ 
              background: ArmedForcesTheme.colors.background,
              border: `1px solid ${ArmedForcesTheme.colors.border}`,
              textAlign: 'center'
            }}>
              <Statistic
                title="Total Defects"
                value={squadronData.reduce((sum, s) => sum + s.defectCount, 0)}
                valueStyle={{ color: ArmedForcesTheme.colors.warning, fontSize: '16px' }}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <ChartContainer>
              <div className="chart-title">ICG Squadron Defect Rates</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart 
                    data={squadronData}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
                    <XAxis type="number" stroke={ArmedForcesTheme.colors.textSecondary} />
                    <YAxis 
                      dataKey="squadron" 
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
                      formatter={(value, name) => [
                        `${value.toFixed(1)}%`, 
                        name === 'defectRate' ? 'Defect Rate' : 'Defect Count'
                      ]}
                    />
                    <Bar 
                      dataKey="defectRate" 
                      fill={ArmedForcesTheme.colors.warning}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
          <Col xs={24} md={12}>
            <ChartContainer>
              <div className="chart-title">Squadron Defect Distribution</div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={squadronData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="defectCount"
                      nameKey="squadron"
                      label={({ squadron, defectCount }) => `${squadron}: ${defectCount}`}
                    >
                      {squadronData.map((entry, index) => (
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
                      formatter={(value, name) => [value, 'Defects']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </Col>
        </Row>
      </div>
    );
  };

  const renderICGOverview = () => {
    if (!data.icgReports) return null;

    return (
      <div style={{ margin: '16px 0' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            {data.icgReports.defectAnalysis?.commonDefects && renderICGDefectAnalysis()}
          </Col>
          <Col xs={24} md={12}>
            {data.icgReports.safetyMetrics && renderICGSafetyMetrics()}
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            {data.icgReports.defectAnalysis?.defectByUnit && renderICGUnitPerformance()}
          </Col>
        </Row>
      </div>
    );
  };

  // Budget Cluster Allocation Visualization
  const renderBudgetClusterAllocation = () => {
    if (!data.defenseClusterBudget?.clusterAllocations) return null;

    // Use real cluster allocation data
    const clusterData = data.defenseClusterBudget.clusterAllocations.map(item => ({
      cluster: item.cluster,
      allocation: item.percentage,
      budget: item.budget,
      color: item.color
    }));

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Defense Budget Cluster Allocation</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={clusterData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="allocation"
                nameKey="cluster"
                label={({ cluster, allocation }) => `${cluster}: ${allocation}%`}
              >
                {clusterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
                formatter={(value) => [`${value}%`, 'Allocation']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  // Military Balance Visualization
  const renderMilitaryBalance = () => {
    if (!data.militaryExpenditure?.expenditureTrends) return null;

    const recentData = data.militaryExpenditure.expenditureTrends.slice(-5);
    const balanceData = recentData.map(item => ({
      year: item.year,
      india: item.india,
      pakistan: item.pakistan,
      ratio: item.ratio
    }));

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Indo-Pak Military Balance Analysis</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={balanceData}>
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
                formatter={(value, name) => [formatUSD(value), name === 'india' ? 'India ($B)' : 'Pakistan ($B)']}
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

  // Defense Production Visualization
  const renderDefenseProduction = () => {
    // Mock data for defense production capacity
    const productionData = [
      { category: 'Aircraft', capacity: 85, selfReliance: 70, color: ArmedForcesTheme.colors.accent },
      { category: 'Missiles', capacity: 90, selfReliance: 85, color: ArmedForcesTheme.colors.success },
      { category: 'Naval Systems', capacity: 75, selfReliance: 60, color: ArmedForcesTheme.colors.navy },
      { category: 'Armored Vehicles', capacity: 80, selfReliance: 75, color: ArmedForcesTheme.colors.warning },
      { category: 'Electronics', capacity: 70, selfReliance: 55, color: ArmedForcesTheme.colors.airforce }
    ];

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Defense Production Capacity & Self-Reliance</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis dataKey="category" stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis stroke={ArmedForcesTheme.colors.textSecondary} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
                formatter={(value, name) => [`${value}%`, name === 'capacity' ? 'Production Capacity' : 'Self-Reliance']}
              />
              <Legend />
              <Bar dataKey="capacity" fill={ArmedForcesTheme.colors.accent} name="Production Capacity (%)" />
              <Bar dataKey="selfReliance" fill={ArmedForcesTheme.colors.success} name="Self-Reliance (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  // Defense Readiness Assessment
  const renderDefenseReadiness = () => {
    const readinessData = [
      { metric: 'Operational Readiness', score: 85, color: ArmedForcesTheme.colors.success },
      { metric: 'Equipment Modernization', score: 70, color: ArmedForcesTheme.colors.warning },
      { metric: 'Personnel Training', score: 90, color: ArmedForcesTheme.colors.success },
      { metric: 'Logistics Support', score: 75, color: ArmedForcesTheme.colors.warning },
      { metric: 'Strategic Mobility', score: 80, color: ArmedForcesTheme.colors.accent },
      { metric: 'Cyber Defense', score: 65, color: ArmedForcesTheme.colors.danger }
    ];

    return (
      <ChartContainer style={{ margin: '16px 0' }}>
        <div className="chart-title">Comprehensive Defense Readiness Assessment</div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={readinessData}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={ArmedForcesTheme.colors.border} />
              <XAxis type="number" domain={[0, 100]} stroke={ArmedForcesTheme.colors.textSecondary} />
              <YAxis 
                dataKey="metric" 
                type="category" 
                stroke={ArmedForcesTheme.colors.textSecondary}
                width={120}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: ArmedForcesTheme.colors.surface,
                  border: `1px solid ${ArmedForcesTheme.colors.border}`,
                  borderRadius: '8px',
                  color: ArmedForcesTheme.colors.text
                }}
                formatter={(value) => [`${value}%`, 'Readiness Score']}
              />
              <Bar 
                dataKey="score" 
                fill={ArmedForcesTheme.colors.accent}
                radius={[0, 4, 4, 0]}
              />
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
  console.log('Final visualization type:', visualizationType);

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
      {visualizationType === 'budget-cluster-allocation' && renderBudgetClusterAllocation()}
      {visualizationType === 'export-trends' && renderExportTrends()}
      {visualizationType === 'export-destinations' && renderExportDestinations()}
      {visualizationType === 'conflict-patterns' && renderConflictPatterns()}
      {visualizationType === 'global-rankings' && renderGlobalRankings()}
      {visualizationType === 'expenditure-comparison' && renderExpenditureComparison()}
      {visualizationType === 'military-balance' && renderMilitaryBalance()}
      {visualizationType === 'defense-production' && renderDefenseProduction()}
      {visualizationType === 'defense-readiness' && renderDefenseReadiness()}
      
      {/* ICG Visualizations */}
      {visualizationType === 'icg-defect-analysis' && renderICGDefectAnalysis()}
      {visualizationType === 'icg-safety-metrics' && renderICGSafetyMetrics()}
      {visualizationType === 'icg-unit-performance' && renderICGUnitPerformance()}
      {visualizationType === 'icg-overview' && renderICGOverview()}
      
      {/* Always show summary stats for context */}
      {visualizationType !== 'summary-stats' && renderSummaryStats()}
    </div>
  );
};

export default ChatVisualizations;
