// src/pages/DashboardOverviewPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  LineChart,
  Users,
  Building,
  Clipboard
} from 'lucide-react';
import { getDashboardDataBatchApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const pieColors = ['#1e40af', '#9333ea', '#dc2626', '#16a34a', '#FFEB3B', '#3F51B5', '#0EA5E9', '#F97316'];

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon: Icon, imageSrc, iconBgColor, valueColor }) => (
  <div
    className={`bg-[#141824] p-4 rounded-lg shadow-xl border border-gray-800 flex items-center justify-between`}
  >
    <div className="flex items-center">
      <div
        className={`p-2 rounded-full mr-4 ${iconBgColor || 'bg-gray-800'}`}
      >
        {Icon ? (
          <Icon className={`w-7 h-7 ${valueColor}`} />
        ) : imageSrc ? (
          <img src={imageSrc} alt={title} className={`w-11 h-11 object-contain`}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/24x24/1F2937/D1D5DB?text=!" }}
          />
        ) : null}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <span
          className={`text-2xl font-bold mt-1 ${valueColor}`}
        >
          {value}
        </span>
      </div>
    </div>
  </div>
);

// --- Reusable Visa Alert Card Component ---
const expiringTextColor = (days) => {
  switch (days) {
    case "2":
      return "text-red-400";
    case "7":
      return "text-yellow-400";
    case "30":
      return "text-green-400";
    default:
      return "text-gray-300";
  }
};

const VisaAlertCard = ({ days, count, onClick }) => {
  const textColorClass = expiringTextColor(days);
  return (
    <div className="bg-[#1f2937] p-3 rounded-md border border-gray-700 flex items-center justify-between">
      <div className="flex flex-col items-start">
        <span className={`text-md font-semibold ${textColorClass} mb-1`}>
          Expiring in {days} days
        </span>
        <span className={`text-2xl font-bold ${textColorClass}`}>
          {count}
        </span>
      </div>

    </div>
  );
};

// --- Reusable Country List Item Component ---
const CountryListItem = ({ country, color }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
      <span className="text-sm text-gray-300">{country}</span>
    </div>
  </div>
);

// --- DashboardOverviewPage Component (Main content of the dashboard) ---
const DashboardOverviewPage = () => {
  const navigate = useNavigate();
  const hasShownToast = useRef(false);
  const handleClick = (days) => {
    switch (days) {
      case "2":
      case "7":
      case "30":
      default:
        navigate('/registered-arrivals');
        break;
    }
  };
  const handleInvestigateClick = () => {
    navigate('/overstays');
  };

  const [nationalityData, setNationalityData] = useState({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
  const [dashboardMetrics, setDashboardMetrics] = useState({
    total_foreigners: 0,
    total_organizations: 0,
    total_grievances: 0,
    total_overstayed: 0,
  });
  const [visaExpiryMetrics, setVisaExpiryMetrics] = useState({
    visa_expires_in_2_days: 0,
    visa_expires_in_7_days: 0,
    visa_expires_in_30_days: 0,
    total_overstays: 0,
  });
  const [visitorAnalytics, setVisitorAnalytics] = useState({ total_visitors: 0, monthly_counts: [] });
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setDashboardLoading(true);
      try {
        // console.log('🔄 Starting dashboard data fetch...');
        const { metrics, nationality, visaExpiry, visitorAnalytics: analytics } = await getDashboardDataBatchApi();

        // console.log('📊 Dashboard data received:', { metrics, nationality, visaExpiry, analytics });

        // Set dashboard metrics
        setDashboardMetrics(metrics);

        // Set nationality data
        const labels = Object.keys(nationality);
        const counts = Object.values(nationality);
        const backgroundColors = counts.map((_, i) => pieColors[i % pieColors.length]);
        setNationalityData({
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: backgroundColors,
            hoverOffset: 10,
          }]
        });

        // Set visa expiry metrics
        setVisaExpiryMetrics(visaExpiry);

        // Set visitor analytics
        setVisitorAnalytics(analytics);

        // console.log('✅ All dashboard data loaded successfully in single batch');
        if (!hasShownToast.current) {
          toast.success('Dashboard data loaded successfully!');
          hasShownToast.current = true;
        }
      } catch (error) {
        console.error('❌ Failed to fetch dashboard data:', error);
        toast.error(`Failed to load dashboard data: ${error.message}`);

        // Set default values to prevent UI crashes
        setDashboardMetrics({ total_foreigners: 0, total_organizations: 0, total_grievances: 0, total_overstayed: 0 });
        setVisaExpiryMetrics({ visa_expires_in_2_days: 0, visa_expires_in_7_days: 0, visa_expires_in_30_days: 0, total_overstays: 0 });
        setVisitorAnalytics({ total_visitors: 0, monthly_counts: [] });
        setNationalityData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  // Define barChartData and barChartOptions after visitorAnalytics state is declared
  const barChartData = {
    labels: visitorAnalytics.monthly_counts.map(d => d.month),
    datasets: [{
      label: 'Visitors',
      data: visitorAnalytics.monthly_counts.map(d => d.count),
      backgroundColor: (context) => {
        return context.dataIndex === new Date().getMonth() ? '#00BCD4' : '#2C5282';
      },
      hoverBackgroundColor: '#FF6384',
      borderRadius: 8,
      barThickness: 32,
      categoryPercentage: 0.8,
      barPercentage: 0.9
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' visitors';
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#fff', padding: 10 },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { display: false },
        max: Math.max(...visitorAnalytics.monthly_counts.map(d => d.count)) + 500,
      }
    }
  };


  return (
    <>
      <CustomScrollbarStyles />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-950 custom-scrollbar">
        {dashboardLoading ? (
          <div className="text-center text-gray-400">Loading dashboard data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Foreigners"
                value={dashboardMetrics.total_foreigners}
                icon={Users}
                iconBgColor="bg-blue-900"
                valueColor="text-blue-400"
              />
              <StatCard
                title="Total Organizations"
                value={dashboardMetrics.total_organizations}
                icon={Building}
                iconBgColor="bg-purple-900"
                valueColor="text-purple-400"
              />
              <StatCard
                title="Total Grievances"
                value={dashboardMetrics.total_grievances}
                icon={Clipboard}
                iconBgColor="bg-red-900"
                valueColor="text-red-400"
              />
              <StatCard
                title="Total Overstayed"
                value={dashboardMetrics.total_overstayed}
                icon={AlertTriangle}
                iconBgColor="bg-yellow-900"
                valueColor="text-yellow-400"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visa Expiry Alerts */}
              <div className="lg:col-span-1 bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800">
                <h2 className="text-lg font-semibold text-gray-50 mb-5">Visa Expiry Alerts</h2>
                {dashboardLoading ? (
                  <LoadingSpinner size="medium" message="Loading visa metrics..." />
                ) : (
                  <div className="flex flex-col space-y-4">
                    <VisaAlertCard days="2" count={visaExpiryMetrics.visa_expires_in_2_days} onClick={() => handleClick("2")} />
                    <VisaAlertCard days="7" count={visaExpiryMetrics.visa_expires_in_7_days} onClick={() => handleClick("7")} />
                    <VisaAlertCard days="30" count={visaExpiryMetrics.visa_expires_in_30_days} onClick={() => handleClick("30")} />
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 bg-red-800 bg-opacity-30 p-3 rounded-md border border-red-700">
                  <div className="flex flex-col">
                    <span className="text-red-400 font-semibold text-md">Total Overstays</span>
                    <span className="text-red-300 font-bold text-2xl">{visaExpiryMetrics.total_overstays}</span>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 ml-4"
                    onClick={handleInvestigateClick}>
                    Investigate</button>
                </div>
              </div>

              {/* Visitors from various countries */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800 flex flex-col items-center">
                <h2 className="text-lg font-semibold text-gray-50 mb-[60px] w-full">Visitors from various countries</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-20">
                  <div className="flex-shrink-1">
                    {dashboardLoading ? (
                      <LoadingSpinner size="large" message="Loading nationality data..." />
                    ) : (
                      <div className="w-80 h-80 flex p-5 items-center justify-center">
                        <Pie
                          data={nationalityData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            cutout: '45%',
                            plugins: {
                              legend: { display: false, position: 'bottom' }
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full mt-10 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {dashboardLoading ? (
                      <div className="text-gray-400">Loading nationality data...</div>
                    ) : (
                      nationalityData.labels.map((country, index) => (
                        <CountryListItem
                          key={country}
                          country={country}
                          color={`bg-[${nationalityData.datasets[0].backgroundColor[index]}]`}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visitors Trends Monthly */}
            <div className="mt-6 bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-50">Visitors Trends Monthly</h2>
                <div className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-400">MAX</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-50 mb-6">
                {dashboardLoading ? '...' : `${visitorAnalytics.total_visitors} visitors`}
              </p>

              <div style={{ width: '100%', height: '300px' }}>
                {dashboardLoading ? (
                  <div className="text-center text-gray-400">Loading visitor analytics...</div>
                ) : (
                  <div className="w-full h-64">
                    <Bar data={barChartData} options={barChartOptions} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default DashboardOverviewPage;
