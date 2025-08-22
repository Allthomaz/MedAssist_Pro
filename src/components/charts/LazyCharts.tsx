import { lazy } from 'react';

// Lazy load chart components for better performance
export const LineChart = lazy(() =>
  import('recharts').then(module => ({ default: module.LineChart }))
);

export const BarChart = lazy(() =>
  import('recharts').then(module => ({ default: module.BarChart }))
);

export const PieChart = lazy(() =>
  import('recharts').then(module => ({ default: module.PieChart }))
);

export const AreaChart = lazy(() =>
  import('recharts').then(module => ({ default: module.AreaChart }))
);

export const ResponsiveContainer = lazy(() =>
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

export const XAxis = lazy(() =>
  import('recharts').then(module => ({ default: module.XAxis }))
);

export const YAxis = lazy(() =>
  import('recharts').then(module => ({ default: module.YAxis }))
);

export const CartesianGrid = lazy(() =>
  import('recharts').then(module => ({ default: module.CartesianGrid }))
);

export const Tooltip = lazy(() =>
  import('recharts').then(module => ({ default: module.Tooltip }))
);

export const Legend = lazy(() =>
  import('recharts').then(module => ({ default: module.Legend }))
);

export const Line = lazy(() =>
  import('recharts').then(module => ({ default: module.Line }))
);

export const Bar = lazy(() =>
  import('recharts').then(module => ({ default: module.Bar }))
);

export const Area = lazy(() =>
  import('recharts').then(module => ({ default: module.Area }))
);

export const Pie = lazy(() =>
  import('recharts').then(module => ({ default: module.Pie }))
);

export const Cell = lazy(() =>
  import('recharts').then(module => ({ default: module.Cell }))
);
