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

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: ordersDateData } = useGetOrdersByDateQuery();

  const [chartData, setChartData] = useState({
    categories: [],
    salesData: [],
    ordersData: [],
  });

  useEffect(() => {
    if (salesDetail && salesDetail.length > 0) {
      setChartData({
        categories: salesDetail.map((item) => item._id),
        salesData: salesDetail.map((item) => item.totalSales),
        ordersData: salesDetail.map(
          (item) =>
            ordersDateData?.find((order) => order._id === item._id)?.count || 0,
        ),
      });
    }
  }, [salesDetail, ordersDateData]);

  const chartOptions = useMemo(
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
        axisBorder: { color: "#d1d5db" },
        axisTicks: { color: "#d1d5db" },
      },
      yaxis: [
        {
          seriesName: "Sales",
          title: {
            text: "Sales Amount ($)",
            style: { fontSize: "14px", color: "#ec4899" },
          },
          labels: {
            style: { colors: "#ec4899" },
          },
          min: 0,
        },
        {
          seriesName: "Orders",
          opposite: true,
          title: {
            text: "Order Count",
            style: { fontSize: "14px", color: "#3b82f6" },
          },
          labels: {
            style: { colors: "#3b82f6" },
          },
          min: 0,
        },
      ],
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
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
      <section className="xl:ml-[4rem] md:ml-[0rem] bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your sales overview.
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
                }).format(sales?.totalSales)
              )}
            </div>
            <div className="text-white/70 text-sm">Revenue this month</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
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
              {loadingTwo ? <Loader /> : orders?.totalOrders || "0"}
            </div>
            <div className="text-white/70 text-sm">All orders placed</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Sales Performance
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Track your sales trends over time
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            {chartData.salesData && chartData.salesData.length > 0 ? (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={400}
                width="100%"
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <p>No sales data available yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-gray-600 text-sm mt-1">
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
