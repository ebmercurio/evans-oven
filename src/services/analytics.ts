import ReactGA from 'react-ga4';

// Replace with your GA4 measurement ID
const MEASUREMENT_ID = 'G-DS8XG2LSS9'; // TODO: Replace with your actual GA4 measurement ID

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

// Page view tracking
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Recipe interaction events
export const trackRecipeEvent = (action: string, recipeId: string, recipeTitle: string) => {
  ReactGA.event({
    category: 'Recipe',
    action,
    label: recipeTitle,
  });
};

// User interaction events
export const trackUserEvent = (action: string, userId?: string) => {
  ReactGA.event({
    category: 'User',
    action,
    label: userId || 'anonymous',
  });
};

// Search events
export const trackSearchEvent = (action: string, label: string, value?: number) => {
  ReactGA.event({
    category: 'Search',
    action,
    label,
    ...(value !== undefined && { value }),
  });
};

// Category interaction events
export const trackCategoryEvent = (action: string, category: string) => {
  ReactGA.event({
    category: 'Category',
    action,
    label: category,
  });
};

// Filter events
export const trackFilterEvent = (filterType: string, value: string) => {
  ReactGA.event({
    category: 'Filter',
    action: 'apply_filter',
    label: `${filterType}: ${value}`,
  });
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string) => {
  ReactGA.event({
    category: 'Error',
    action: errorType,
    label: errorMessage,
  });
};