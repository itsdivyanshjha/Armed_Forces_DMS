import Papa from 'papaparse';
import * as XLSX from 'xlsx';

class DataLoader {
  constructor() {
    this.datasets = [
      'Army Recruits 2017-2022.csv',
      'Defence Export 2017-2025.csv', 
      'Defence Production 2017-2024.csv',
      'Defense Budget Trends.csv',
      'Defense Cluster Budget Allocation.csv',
      'Global Armed Forces.csv',
      'Indo-Pak Conflict Escalation.csv',
      'Military Expenditure Indo-Pak 1960-2023.xlsx'
    ];
    
    this.cache = {};
    this.isLoading = false;
  }

  async loadCSV(filename) {
    try {
      const response = await fetch(`/datasets/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      const result = Papa.parse(csvText, { 
        header: true, 
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim()
      });
      
      if (result.errors.length > 0) {
        console.warn(`Parsing warnings for ${filename}:`, result.errors);
      }
      
      return result.data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }

  async loadExcel(filename) {
    try {
      const response = await fetch(`/datasets/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: ''
      });
      
      // Transform to object format with headers
      if (data.length === 0) return [];
      
      const headers = data[0].map(header => String(header).trim());
      const rows = data.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      return rows;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }

  async loadSingleDataset(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    try {
      let data;
      if (filename.endsWith('.xlsx')) {
        data = await this.loadExcel(filename);
      } else {
        data = await this.loadCSV(filename);
      }
      
      this.cache[filename] = data;
      return data;
    } catch (error) {
      console.error(`Failed to load ${filename}:`, error);
      return [];
    }
  }

  async loadAllData() {
    if (this.isLoading) {
      return this.cache;
    }

    this.isLoading = true;
    
    try {
      const dataPromises = this.datasets.map(async (file) => {
        const data = await this.loadSingleDataset(file);
        const key = this.generateDataKey(file);
        return { key, data, filename: file };
      });

      const results = await Promise.all(dataPromises);
      
      const organizedData = {};
      results.forEach(({ key, data, filename }) => {
        organizedData[key] = {
          data,
          filename,
          lastUpdated: new Date(),
          recordCount: data.length
        };
      });

      this.cache = { ...this.cache, ...organizedData };
      return this.cache;
    } catch (error) {
      console.error('Error loading datasets:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  generateDataKey(filename) {
    // Convert filename to camelCase key
    return filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9]/g, ' ') // Replace special chars with spaces
      .split(' ')
      .filter(word => word.length > 0)
      .map((word, index) => 
        index === 0 ? word.toLowerCase() : 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }

  getDataset(key) {
    return this.cache[key]?.data || [];
  }

  getDatasetInfo(key) {
    return this.cache[key] || null;
  }

  getAllDatasetKeys() {
    return Object.keys(this.cache);
  }

  clearCache() {
    this.cache = {};
  }

  // Helper method to get data with metadata
  getDataWithMeta(key) {
    const info = this.getDatasetInfo(key);
    if (!info) return null;
    
    return {
      data: info.data,
      metadata: {
        filename: info.filename,
        recordCount: info.recordCount,
        lastUpdated: info.lastUpdated,
        columns: info.data.length > 0 ? Object.keys(info.data[0]) : []
      }
    };
  }
}

// Export singleton instance
export const dataLoader = new DataLoader();
export default DataLoader;
