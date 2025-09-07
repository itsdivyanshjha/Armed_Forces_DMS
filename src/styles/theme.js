export const ArmedForcesTheme = {
  colors: {
    primary: '#1B4332', // Dark military green
    secondary: '#2D5016', // Army green  
    accent: '#FFD700', // Gold for insignia
    navy: '#0F3460', // Navy blue
    airforce: '#4A90E2', // Air force blue
    background: '#0A0E14', // Dark command center
    surface: '#1A1E23', // Card backgrounds
    text: '#E8E9EA', // Light text
    textSecondary: '#B0B6C1', // Secondary text
    success: '#27AE60',
    warning: '#F39C12', 
    danger: '#E74C3C',
    border: '#2A3142',
    hover: '#243447'
  },
  
  typography: {
    fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },

  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    large: '1200px'
  },

  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.15)',
    medium: '0 4px 20px rgba(0, 0, 0, 0.4)',
    large: '0 8px 32px rgba(0, 0, 0, 0.6)'
  },

  gradients: {
    primary: 'linear-gradient(135deg, #1B4332 0%, #2D5016 100%)',
    // Neutral, service-agnostic header gradient to avoid regiment-specific colors
    header: 'linear-gradient(135deg, #0F172A 0%, #1F2937 100%)',
    secondary: 'linear-gradient(135deg, #0F3460 0%, #4A90E2 100%)',
    accent: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  }
};

// Ant Design theme configuration
export const antdTheme = {
  token: {
    colorPrimary: ArmedForcesTheme.colors.primary,
    colorSuccess: ArmedForcesTheme.colors.success,
    colorWarning: ArmedForcesTheme.colors.warning,
    colorError: ArmedForcesTheme.colors.danger,
    borderRadius: 8,
    fontFamily: ArmedForcesTheme.typography.fontFamily
  },
  components: {
    Card: {
      colorBgContainer: ArmedForcesTheme.colors.surface,
      colorBorder: ArmedForcesTheme.colors.border,
      colorText: ArmedForcesTheme.colors.text
    },
    Button: {
      colorPrimary: ArmedForcesTheme.colors.primary,
      colorPrimaryHover: ArmedForcesTheme.colors.accent
    },
    Input: {
      colorBgContainer: ArmedForcesTheme.colors.background,
      colorBorder: ArmedForcesTheme.colors.border,
      colorText: ArmedForcesTheme.colors.text
    }
  }
};
