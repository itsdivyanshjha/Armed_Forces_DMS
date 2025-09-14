import React from 'react';

const DebugInfo = ({ data, query }) => {
  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      color: '#fff',
      fontSize: '12px'
    }}>
      <h4 style={{ color: '#FFD700', marginBottom: '12px' }}>🔍 DEBUG INFO</h4>
      <div style={{ marginBottom: '8px' }}>
        <strong>Query:</strong> {query}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Data Keys:</strong> {Object.keys(data || {}).join(', ')}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>ICG Reports Available:</strong> {data?.icgReports ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Defect Analysis Available:</strong> {data?.icgReports?.defectAnalysis ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Common Defects Count:</strong> {data?.icgReports?.defectAnalysis?.commonDefects?.length || 0}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Safety Metrics Available:</strong> {data?.icgReports?.safetyMetrics ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Budget Trends Available:</strong> {data?.budgetTrends ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Defense Exports Available:</strong> {data?.defenseExports ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Global Comparison Available:</strong> {data?.globalComparison ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Military Expenditure Available:</strong> {data?.militaryExpenditure ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Conflict Data Available:</strong> {data?.conflictData ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Defense Cluster Budget Available:</strong> {data?.defenseClusterBudget ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default DebugInfo;
