import React from 'react';

const AnalyticsCard = ({ title, items }) => {
  return (
    <div className="p-4 border rounded bg-white">
      <h4 className="font-bold mb-2">{title}</h4>
      <ul className="text-sm">
        {Object.values(items || {}).map(v => (
          <li key={v.user._id} className="flex justify-between py-1">
            <span>{v.user.name}</span>
            <span className="font-medium">{v.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalyticsCard;
