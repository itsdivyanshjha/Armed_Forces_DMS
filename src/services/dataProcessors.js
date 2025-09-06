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

      // Country-wise exports
      const countryWiseExports = _(data)
        .filter(row => row.Country && (row.Export_Value || row.Value))
        .groupBy('Country')
        .map((countryData, country) => ({
          country,
          totalValue: _.sumBy(countryData, row => this.parseNumber(row.Export_Value || row.Value)),
          transactionCount: countryData.length
        }))
        .orderBy('totalValue', 'desc')
        .take(10) // Top 10 countries
        .value();

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
        .filter(row => row.Country)
        .map(row => ({
          country: row.Country,
          activePersonnel: this.parseNumber(row['Active military']),
          reservePersonnel: this.parseNumber(row['Reserve military']),
          totalPersonnel: this.parseNumber(row.Total),
          rank: this.parseNumber(row['SR.NO']),
          militaryStrength: this.parseNumber(row.Total) // Use total as strength indicator
        }))
        .orderBy('rank')
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

  // Main processing function that handles all datasets
  static processAllData(datasets) {
    const processed = {};

    try {
      // Process each dataset based on its key
      Object.keys(datasets).forEach(key => {
        const dataset = datasets[key];
        if (!dataset || !dataset.data) return;

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
          default:
            // Generic processing for other datasets
            processed[key] = {
              rawData: dataset.data.slice(0, 100), // Limit for performance
              recordCount: dataset.data.length,
              columns: dataset.data.length > 0 ? Object.keys(dataset.data[0]) : []
            };
        }
      });

      return processed;
    } catch (error) {
      console.error('Error processing datasets:', error);
      return {};
    }
  }
}

export default DataProcessors;
