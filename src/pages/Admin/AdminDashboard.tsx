import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
  useGetOrdersByDateQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect, useMemo } from "react";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { ChartData, OrdersByDate } from "../../types/admin";
import { ApexOptions } from "apexcharts";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();

  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const { data: ordersDateData } = useGetOrdersByDateQuery();

  const [chartData, setChartData] = useState<ChartData>({
    categories: [],
    salesData: [],
    ordersData: [],
  });

  useEffect(() => {
    if (salesDetail && salesDetail.sales && salesDetail.sales.length > 0) {
      setChartData({
        categories: salesDetail.sales.map((item: { _id: string }) => item._id),
        salesData: salesDetail.sales.map(
          (item: { total: number }) => item.total,
        ),
        ordersData: salesDetail.sales.map(
          (item: { _id: string }) =>
            ordersDateData?.orders?.find(
              (order: OrdersByDate) => order._id === item._id,
            )?.count || 0,
        ),
      });
    }
  }, [salesDetail, ordersDateData]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        background: "transparent",
        toolbar: { show: true },
        stacked: false,
      },
      tooltip: {
        theme: "light",
        style: { fontSize: "12px" },
      },
      colors: ["#ec4899", "#3b82f6"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      title: {
        text: "Sales & Orders Trend",
        align: "left",
        style: { fontSize: "18px", fontWeight: "600" },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
      },
      markers: {
        size: 5,
        colors: ["#ec4899", "#3b82f6"],
        strokeColor: "#fff",
        strokeWidth: 2,
      },
      xaxis: {
        categories: chartData.categories,
        title: {
          text: "Date",
          style: { fontSize: "14px" },
        },
      },
      yaxis: [
        {
          title: {
            text: "Sales Amount ($)",
            style: { color: "#ec4899" },
          },
        },
        {
          opposite: true,
          title: {
            text: "Order Count",
            style: { color: "#3b82f6" },
          },
        },
      ],
    }),
    [chartData.categories],
  );

  const chartSeries = useMemo(
    () => [
      { name: "Sales", data: chartData.salesData },
      { name: "Orders", data: chartData.ordersData },
    ],
    [chartData.salesData, chartData.ordersData],
  );

  return (
    <>
      <section className="xl:ml-[4rem] md:ml-[0rem] bg-gradient-to-br from-surface-muted to-surface-subtle min-h-screen p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-text-secondary">
            Welcome back! Here&apos;s your sales overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Total Sales
              </div>
              <div className="text-3xl text-white/60">💰</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {isLoading ? (
                <Loader />
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(sales?.total ?? 0)
              )}
            </div>
            <div className="text-white/70 text-sm">Revenue this month</div>
          </div>

          <div className="bg-gradient-to-br from-primary-light to-primary rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Total Customers
              </div>
              <div className="text-3xl text-white/60">👥</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {loading ? <Loader /> : customers?.length || "0"}
            </div>
            <div className="text-white/70 text-sm">Active customers</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Total Orders
              </div>
              <div className="text-3xl text-white/60">📦</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {loadingTwo ? <Loader /> : orders?.total || "0"}
            </div>
            <div className="text-white/70 text-sm">All orders placed</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              Sales Performance
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Track your sales trends over time
            </p>
          </div>
          <div className="bg-surface-muted rounded-lg p-4">
            {chartData.salesData && chartData.salesData.length > 0 ? (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={400}
                width="100%"
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-text-secondary">
                <p>No sales data available yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-8 border-b border-border">
            <h2 className="text-2xl font-bold text-text-primary">
              Recent Orders
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Manage and track all orders
            </p>
          </div>
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
