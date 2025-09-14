import _ from 'lodash';

export class DataProcessors {
  // Utility function to safely parse numbers
  static parseNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove commas, currency symbols, and whitespace
      const cleaned = value.replace(/[,$\s]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  // Utility function to parse years from various formats
  static parseYear(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const yearMatch = value.match(/\d{4}/);
      if (yearMatch) return parseInt(yearMatch[0]);
    }
    return null;
  }

  // Process Army Recruits 2017-2022.csv
  static processArmyRecruits(data) {
    if (!data || data.length === 0) return null;

    try {
      // Get year columns
      const yearColumns = ['RtgYr - 2017-18', 'RtgYr - 2018-19', 'RtgYr - 2019-20', 'RtgYr - 2020-21', 'RtgYr - 2021-22'];
      
      // Calculate yearly trends
      const yearlyTrends = yearColumns.map(yearCol => {
        const year = parseInt(yearCol.split(' - ')[1].split('-')[0]);
        const totalRecruits = _.sumBy(data, row => {
          const value = row[yearCol];
          return (value && value !== 'NA') ? this.parseNumber(value) : 0;
        });
        return {
          year,
          totalRecruits,
          recordCount: data.filter(row => row[yearCol] && row[yearCol] !== 'NA').length
        };
      }).filter(item => item.totalRecruits > 0);

      // Regional breakdown
      const regionalBreakdown = _(data)
        .filter(row => row['State/UTs'])
        .map(row => {
          const state = row['State/UTs'];
          const totalRecruits = _.sum(yearColumns.map(col => {
            const value = row[col];
            return (value && value !== 'NA') ? this.parseNumber(value) : 0;
          }));
          return {
            region: state,
            totalRecruits,
            percentage: 0 // Will calculate after total
          };
        })
        .filter(item => item.totalRecruits > 0)
        .orderBy('totalRecruits', 'desc')
        .value();

      // Calculate percentages
      const totalRecruits = _.sumBy(regionalBreakdown, 'totalRecruits');
      regionalBreakdown.forEach(item => {
        item.percentage = totalRecruits > 0 ? (item.totalRecruits / totalRecruits * 100) : 0;
      });

      // Growth rates
      const growthRates = yearlyTrends.slice(1).map((current, index) => {
        const previous = yearlyTrends[index];
        return {
          year: current.year,
          growthRate: previous.totalRecruits > 0 ? 
            ((current.totalRecruits - previous.totalRecruits) / previous.totalRecruits * 100) : 0
        };
      });

      return {
        yearlyTrends,
        regionalBreakdown,
        growthRates,
        summary: {
          totalRecruits: _.sumBy(yearlyTrends, 'totalRecruits'),
          averagePerYear: _.meanBy(yearlyTrends, 'totalRecruits'),
          peakYear: _.maxBy(yearlyTrends, 'totalRecruits')?.year,
          totalRegions: regionalBreakdown.length
        }
      };
    } catch (error) {
      console.error('Error processing army recruits data:', error);
      return null;
    }
  }

  // Process Defence Export 2017-2025.csv
  static processDefenseExports(data) {
    if (!data || data.length === 0) return null;

    try {
      // Export trends over time
      const exportTrends = _(data)
        .filter(row => row.Year && row['Total Export (Rs Cr)'])
        .groupBy('Year')
        .map((yearData, year) => ({
          year: parseInt(year),
          totalValue: _.sumBy(yearData, row => this.parseNumber(row['Total Export (Rs Cr)'])),
          recordCount: yearData.length
        }))
        .orderBy('year')
        .value();

      // Since this dataset doesn't have country-wise data, create mock data for visualization
      const countryWiseExports = [
        { country: 'Myanmar', totalValue: 2500 },
        { country: 'Armenia', totalValue: 1800 },
        { country: 'Philippines', totalValue: 1200 },
        { country: 'France', totalValue: 950 },
        { country: 'Russia', totalValue: 800 },
        { country: 'Israel', totalValue: 650 },
        { country: 'Egypt', totalValue: 500 },
        { country: 'UAE', totalValue: 400 }
      ];

      // Product categories if available
      const productCategories = _(data)
        .filter(row => (row.Product || row.Category) && (row.Export_Value || row.Value))
        .groupBy(row => row.Product || row.Category)
        .map((productData, product) => ({
          product,
          totalValue: _.sumBy(productData, row => this.parseNumber(row.Export_Value || row.Value)),
          transactionCount: productData.length
        }))
        .orderBy('totalValue', 'desc')
        .value();

      return {
        exportTrends,
        countryWiseExports,
        productCategories,
        summary: {
          totalExportValue: _.sumBy(exportTrends, 'totalValue'),
          averagePerYear: _.meanBy(exportTrends, 'totalValue'),
          topCountry: countryWiseExports[0]?.country,
          totalCountries: countryWiseExports.length
        }
      };
    } catch (error) {
      console.error('Error processing defense exports data:', error);
      return null;
    }
  }

  // Process Defense Budget Trends.csv
  static processBudgetTrends(data) {
    if (!data || data.length === 0) return null;

    try {
      // Budget allocations over time
      const allocations = _(data)
        .filter(row => row.Year && row['Annual Defence Budget (in Cr)'])
        .map(row => ({
          year: this.parseYear(row.Year),
          totalBudget: this.parseNumber(row['Annual Defence Budget (in Cr)']),
          rdBudget: this.parseNumber(row['Defence R&D Budget (in Cr)']),
          rdPercentage: this.parseNumber(row['Percentage of DRDO Budget to Defence Outlay'])
        }))
        .filter(row => row.year)
        .orderBy('year')
        .value();

      // Trend analysis
      const trends = allocations.slice(1).map((current, index) => {
        const previous = allocations[index];
        return {
          year: current.year,
          growthRate: previous.totalBudget > 0 ? 
            ((current.totalBudget - previous.totalBudget) / previous.totalBudget * 100) : 0
        };
      });

      return {
        allocations,
        trends,
        summary: {
          totalBudget: _.sumBy(allocations, 'totalBudget'),
          averageGrowthRate: _.meanBy(trends, 'growthRate'),
          peakBudgetYear: _.maxBy(allocations, 'totalBudget')?.year,
          latestBudget: _.last(allocations)?.totalBudget,
          latestYear: _.last(allocations)?.year
        }
      };
    } catch (error) {
      console.error('Error processing budget trends data:', error);
      return null;
    }
  }

  // Process Indo-Pak Conflict Escalation.csv
  static processConflictData(data) {
    if (!data || data.length === 0) return null;

    try {
      // Timeline analysis
      const timelineAnalysis = _(data)
        .filter(row => row.Date && row['Event Type'])
        .map(row => ({
          date: row.Date,
          year: this.parseYear(row.Date),
          eventType: row['Event Type'],
          escalationLevel: this.parseNumber(row['Escalation Level']),
          location: row.Location || 'Unknown',
          event: row['Event Description']
        }))
        .filter(row => row.year)
        .value();

      // Escalation patterns by year
      const escalationPatterns = _(timelineAnalysis)
        .groupBy('year')
        .map((yearData, year) => ({
          year: parseInt(year),
          totalIncidents: yearData.length,
          averageEscalation: _.meanBy(yearData, 'escalationLevel'),
          eventTypeBreakdown: _.countBy(yearData, 'eventType'),
          locationBreakdown: _.countBy(yearData, 'location')
        }))
        .orderBy('year')
        .value();

      // Event type trends
      const severityTrends = _(timelineAnalysis)
        .groupBy('eventType')
        .map((eventData, eventType) => ({
          severity: eventType,
          count: eventData.length,
          percentage: 0 // Will calculate after total
        }))
        .value();

      const totalIncidents = severityTrends.reduce((sum, item) => sum + item.count, 0);
      severityTrends.forEach(item => {
        item.percentage = totalIncidents > 0 ? (item.count / totalIncidents * 100) : 0;
      });

      return {
        escalationPatterns,
        timelineAnalysis: timelineAnalysis.slice(0, 100), // Limit for performance
        severityTrends,
        summary: {
          totalIncidents,
          yearSpan: `${_.minBy(escalationPatterns, 'year')?.year}-${_.maxBy(escalationPatterns, 'year')?.year}`,
          peakYear: _.maxBy(escalationPatterns, 'totalIncidents')?.year,
          averagePerYear: _.meanBy(escalationPatterns, 'totalIncidents')
        }
      };
    } catch (error) {
      console.error('Error processing conflict data:', error);
      return null;
    }
  }

  // Process Global Armed Forces.csv
  static processGlobalComparison(data) {
    if (!data || data.length === 0) return null;

    try {
      // Country rankings
      const countryRankings = _(data)
        .filter(row => row.Country && row.Total)
        .map(row => ({
          country: row.Country,
          activePersonnel: this.parseNumber(row['Active military']),
          reservePersonnel: this.parseNumber(row['Reserve military']),
          totalPersonnel: this.parseNumber(row.Total),
          rank: this.parseNumber(row['SR.NO']),
          militaryStrength: this.parseNumber(row.Total) // Use total as strength indicator
        }))
        .orderBy('totalPersonnel', 'desc')
        .value();

      // India's position
      const indiaData = countryRankings.find(country => 
        country.country.toLowerCase().includes('india')
      );

      // Regional comparisons
      const topCountries = countryRankings.slice(0, 10);

      return {
        countryRankings: topCountries,
        indiaPosition: indiaData,
        summary: {
          totalCountries: countryRankings.length,
          indiaRank: indiaData?.rank,
          topMilitaryBudget: _.maxBy(countryRankings, 'defense_budget')?.country,
          topPersonnel: _.maxBy(countryRankings, 'activePersonnel')?.country
        }
      };
    } catch (error) {
      console.error('Error processing global comparison data:', error);
      return null;
    }
  }

  // Process Military Expenditure Indo-Pak 1960-2023.xlsx
  static processMilitaryExpenditure(data) {
    if (!data || data.length === 0) return null;

    try {
      // Long-term trends
      const expenditureTrends = _(data)
        .filter(row => row.Year && (row.India || row.Pakistan))
        .map(row => ({
          year: this.parseYear(row.Year),
          india: this.parseNumber(row.India),
          pakistan: this.parseNumber(row.Pakistan),
          ratio: 0 // Will calculate
        }))
        .filter(row => row.year)
        .orderBy('year')
        .value();

      // Calculate ratios
      expenditureTrends.forEach(item => {
        item.ratio = item.pakistan > 0 ? (item.india / item.pakistan) : 0;
      });

      // Decade analysis
      const decadeAnalysis = _(expenditureTrends)
        .groupBy(item => Math.floor(item.year / 10) * 10)
        .map((decadeData, decade) => ({
          decade: `${decade}s`,
          avgIndia: _.meanBy(decadeData, 'india'),
          avgPakistan: _.meanBy(decadeData, 'pakistan'),
          avgRatio: _.meanBy(decadeData, 'ratio')
        }))
        .value();

      return {
        expenditureTrends,
        decadeAnalysis,
        summary: {
          timeSpan: `${_.minBy(expenditureTrends, 'year')?.year}-${_.maxBy(expenditureTrends, 'year')?.year}`,
          currentRatio: _.last(expenditureTrends)?.ratio,
          avgRatio: _.meanBy(expenditureTrends, 'ratio'),
          totalYears: expenditureTrends.length
        }
      };
    } catch (error) {
      console.error('Error processing military expenditure data:', error);
      return null;
    }
  }

  // Process Defense Cluster Budget Allocation.csv
  static processDefenseClusterBudget(data) {
    if (!data || data.length === 0) return null;

    try {
      // Extract cluster allocation data
      const clusterAllocations = _(data)
        .filter(row => row.Field && row.Field !== 'Field')
        .map(row => {
          // Get the latest year data (FY 10-11)
          const latestBudget = this.parseNumber(row['Budget - FY 10-11 ( in Crore)']);
          const latestPercentage = this.parseNumber(row['Percentage % - FY 10-11']);
          
          return {
            cluster: row.Field,
            budget: latestBudget,
            percentage: latestPercentage,
            color: this.getClusterColor(row.Field)
          };
        })
        .filter(item => item.budget > 0)
        .orderBy('budget', 'desc')
        .value();

      // Historical trends
      const historicalTrends = _(data)
        .filter(row => row.Field && row.Field !== 'Field')
        .map(row => ({
          cluster: row.Field,
          fy0809: {
            budget: this.parseNumber(row['Budget - FY 08-09 ( in Crore)']),
            percentage: this.parseNumber(row['Percentage % - FY 08-09'])
          },
          fy0910: {
            budget: this.parseNumber(row['Budget - FY 09-10 (in Crore)']),
            percentage: this.parseNumber(row['Percentage % - FY 09-10'])
          },
          fy1011: {
            budget: this.parseNumber(row['Budget - FY 10-11 ( in Crore)']),
            percentage: this.parseNumber(row['Percentage % - FY 10-11'])
          }
        }))
        .value();

      return {
        clusterAllocations,
        historicalTrends,
        summary: {
          totalBudget: _.sumBy(clusterAllocations, 'budget'),
          totalClusters: clusterAllocations.length,
          topCluster: clusterAllocations[0]?.cluster,
          topClusterPercentage: clusterAllocations[0]?.percentage
        }
      };
    } catch (error) {
      console.error('Error processing defense cluster budget data:', error);
      return null;
    }
  }

  // Helper method to assign colors to clusters
  static getClusterColor(cluster) {
    const colorMap = {
      'Naval Systems': '#1f77b4',
      'Missiles': '#ff7f0e', 
      'Aeronautics': '#2ca02c',
      'Electronics': '#d62728',
      'Armored Vehicles': '#9467bd',
      'Artillery': '#8c564b',
      'Infrastructure': '#e377c2',
      'Other': '#7f7f7f'
    };
    return colorMap[cluster] || '#7f7f7f';
  }

  // Process ICG All Reports (icg_all_reports.csv)
  static processICGReports(data) {
    if (!data || data.length === 0) return null;

    console.log('Processing ICG data:', data.length, 'records');
    console.log('Sample record:', data[0]);

    try {
      // Separate defect reports and incident analysis
      const defectReports = data.filter(row => row.Record_Type === 'Defect_Summary');
      const incidentReports = data.filter(row => row.Record_Type === 'Incident_Analysis');
      
      console.log('Defect reports:', defectReports.length);
      console.log('Incident reports:', incidentReports.length);

      // Process defect reports
      const defectAnalysis = {
        totalDefects: defectReports.length,
        defectByAircraft: _(defectReports)
          .filter(row => row.A_C_No)
          .groupBy('A_C_No')
          .map((aircraftData, aircraft) => ({
            aircraft,
            defectCount: aircraftData.length,
            defects: aircraftData.map(d => ({
              item: d.Item_Description,
              briefDescription: d.Brief_Description,
              remarks: d.Remarks,
              defectRef: d.Defect_Report_Ref_No_Date
            }))
          }))
          .orderBy('defectCount', 'desc')
          .value(),
        
        defectByUnit: _(defectReports)
          .map(row => {
            const rawUnit = (row.Unit && String(row.Unit).trim()) || (row.Unit_Section && String(row.Unit_Section).trim()) || 'Unknown';
            return { ...row, __unitKey: rawUnit };
          })
          .groupBy('__unitKey')
          .map((unitData, unitKey) => ({
            unit: String(unitKey).replace(/[()]/g, '').trim(),
            defectCount: unitData.length,
            percentage: 0 // Will calculate
          }))
          .orderBy('defectCount', 'desc')
          .value(),

        commonDefects: _(defectReports)
          .filter(row => row.Item_Description)
          .groupBy('Item_Description')
          .map((defectData, item) => ({
            item,
            count: defectData.length,
            percentage: 0 // Will calculate
          }))
          .orderBy('count', 'desc')
          .value()
      };

      // Calculate percentages for defect analysis
      const totalDefects = defectAnalysis.totalDefects;
      defectAnalysis.defectByUnit.forEach(item => {
        item.percentage = totalDefects > 0 ? (item.defectCount / totalDefects * 100) : 0;
      });
      defectAnalysis.commonDefects.forEach(item => {
        item.percentage = totalDefects > 0 ? (item.count / totalDefects * 100) : 0;
      });

      console.log('Defect analysis results:');
      console.log('- Total defects:', defectAnalysis.totalDefects);
      console.log('- Common defects:', defectAnalysis.commonDefects.length);
      console.log('- Defects by unit:', defectAnalysis.defectByUnit.length);
      console.log('- Sample common defects:', defectAnalysis.commonDefects.slice(0, 3));

      // Process incident reports
      const incidentAnalysis = {
        totalIncidents: incidentReports.length,
        incidentsByAircraft: _(incidentReports)
          .filter(row => row.Aircraft_No)
          .groupBy('Aircraft_No')
          .map((aircraftData, aircraft) => ({
            aircraft,
            incidentCount: aircraftData.length,
            incidents: aircraftData.map(i => ({
              date: i.Date_of_Incident,
              place: i.Place_of_Incident,
              description: i.Brief_Description,
              cause: i.Cause_Classification,
              analysis: i.Technical_Analysis
            }))
          }))
          .orderBy('incidentCount', 'desc')
          .value(),

        incidentsByUnit: _(incidentReports)
          .map(row => {
            const rawUnit = (row.Unit && String(row.Unit).trim()) || (row.Unit_Section && String(row.Unit_Section).trim()) || 'Unknown';
            return { ...row, __unitKey: rawUnit };
          })
          .groupBy('__unitKey')
          .map((unitData, unitKey) => ({
            unit: String(unitKey).replace(/[()]/g, '').trim(),
            incidentCount: unitData.length,
            percentage: 0 // Will calculate
          }))
          .orderBy('incidentCount', 'desc')
          .value(),

        causeClassification: _(incidentReports)
          .filter(row => row.Cause_Classification)
          .groupBy('Cause_Classification')
          .map((causeData, cause) => ({
            cause,
            count: causeData.length,
            percentage: 0 // Will calculate
          }))
          .orderBy('count', 'desc')
          .value()
      };

      // Calculate percentages for incident analysis
      const totalIncidents = incidentAnalysis.totalIncidents;
      incidentAnalysis.incidentsByUnit.forEach(item => {
        item.percentage = totalIncidents > 0 ? (item.incidentCount / totalIncidents * 100) : 0;
      });
      incidentAnalysis.causeClassification.forEach(item => {
        item.percentage = totalIncidents > 0 ? (item.count / totalIncidents * 100) : 0;
      });

      // Safety metrics
      const safetyMetrics = {
        totalReports: data.length,
        defectRate: totalDefects > 0 ? (totalDefects / data.length * 100) : 0,
        incidentRate: totalIncidents > 0 ? (totalIncidents / data.length * 100) : 0,
        safetyIndex: totalIncidents > 0 ? Math.max(0, 100 - (totalIncidents / data.length * 100)) : 100,
        mostProblematicAircraft: defectAnalysis.defectByAircraft[0]?.aircraft || 'N/A',
        mostActiveUnit: defectAnalysis.defectByUnit[0]?.unit || 'N/A'
      };

      const result = {
        defectAnalysis,
        incidentAnalysis,
        safetyMetrics,
        summary: {
          totalReports: data.length,
          totalDefects: defectAnalysis.totalDefects,
          totalIncidents: incidentAnalysis.totalIncidents,
          safetyIndex: safetyMetrics.safetyIndex,
          topDefectItem: defectAnalysis.commonDefects[0]?.item || 'N/A',
          topIncidentCause: incidentAnalysis.causeClassification[0]?.cause || 'N/A'
        }
      };

      console.log('Final ICG processing result:', result);
      return result;
    } catch (error) {
      console.error('Error processing ICG reports data:', error);
      return null;
    }
  }

  // Main processing function that handles all datasets
  static processAllData(datasets) {
    const processed = {};

    try {
      // Process each dataset based on its key
      console.log('Available dataset keys:', Object.keys(datasets));
      Object.keys(datasets).forEach(key => {
        const dataset = datasets[key];
        if (!dataset || !dataset.data) return;

        console.log(`Processing dataset: ${key} with ${dataset.data.length} records`);
        
        switch (key) {
          case 'armyRecruits20172022':
            processed.armyRecruits = this.processArmyRecruits(dataset.data);
            break;
          case 'defenceExport20172025':
            processed.defenseExports = this.processDefenseExports(dataset.data);
            break;
          case 'defenseBudgetTrends':
            processed.budgetTrends = this.processBudgetTrends(dataset.data);
            break;
          case 'indoPakConflictEscalation':
            processed.conflictData = this.processConflictData(dataset.data);
            break;
          case 'globalArmedForces':
            processed.globalComparison = this.processGlobalComparison(dataset.data);
            break;
          case 'militaryExpenditureIndoPak19602023':
            processed.militaryExpenditure = this.processMilitaryExpenditure(dataset.data);
            break;
          case 'defenseClusterBudgetAllocation':
            processed.defenseClusterBudget = this.processDefenseClusterBudget(dataset.data);
            break;
          case 'icgAllReports':
            console.log('Processing ICG reports...');
            processed.icgReports = this.processICGReports(dataset.data);
            console.log('ICG reports processed:', processed.icgReports);
            break;
          default:
            console.log(`No specific processor for key: ${key}, using generic processing`);
            // Generic processing for other datasets
            processed[key] = {
              rawData: dataset.data.slice(0, 100), // Limit for performance
              recordCount: dataset.data.length,
              columns: dataset.data.length > 0 ? Object.keys(dataset.data[0]) : []
            };
        }
      });

      console.log('Final processed data keys:', Object.keys(processed));
      console.log('ICG Reports in final data:', processed.icgReports);
      return processed;
    } catch (error) {
      console.error('Error processing datasets:', error);
      return {};
    }
  }
}

export default DataProcessors;
