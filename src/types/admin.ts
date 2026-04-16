export type OrdersByDate = {
  _id: string; // date
  count: number;
};

export type ChartData = {
  categories: string[];
  salesData: number[];
  ordersData: number[];
};