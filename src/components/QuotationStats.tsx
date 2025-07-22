import React from 'react';
import { BarChart3, TrendingUp, Users, Package, DollarSign, Award } from 'lucide-react';
import { QuotationStatistics, TopProvider, PriceRanges } from '../types/quotation';

interface QuotationStatsProps {
  statistics: QuotationStatistics;
  topProviders: TopProvider[];
  topBrands: TopProvider[];
  priceRanges: PriceRanges;
}

export const QuotationStats: React.FC<QuotationStatsProps> = ({
  statistics,
  topProviders,
  topBrands,
  priceRanges
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({
    icon, title, value, color
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Package className="w-6 h-6 text-white" />}
          title="Total Cotizaciones"
          value={statistics.totalItems.toString()}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-white" />}
          title="Proveedores"
          value={statistics.totalProviders.toString()}
          color="bg-green-500"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          title="Precio Promedio"
          value={formatPrice(statistics.avgPrice)}
          color="bg-yellow-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          title="Valor Total"
          value={formatPrice(statistics.totalValue)}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Proveedores */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Proveedores
          </h3>
          <div className="space-y-3">
            {topProviders.map((provider, index) => (
              <div key={provider.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 truncate">{provider.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{provider.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Marcas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Marcas
          </h3>
          <div className="space-y-3">
            {topBrands.map((brand, index) => (
              <div key={brand.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 truncate">{brand.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{brand.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución de precios */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Distribución de Precios
          </h3>
          <div className="space-y-3">
            {Object.entries(priceRanges).map(([range, count]) => {
              const total = Object.values(priceRanges).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={range} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{range.replace('-', ' - $').replace('+', '+')}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};