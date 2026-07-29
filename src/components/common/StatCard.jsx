import React from "react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
  valueColor = "text-slate-800",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${valueColor}`}
          >
            {value}
          </h2>

          {subtitle && (
            <p className="text-xs text-slate-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            <Icon
              size={28}
              className={iconColor}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;