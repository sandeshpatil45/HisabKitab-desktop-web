import React from 'react';
import type { Table } from '../types/restaurant';

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
  onEdit?: (table: Table) => void;
  onDelete?: (table: Table) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onClick, onEdit, onDelete }) => {
  const getStatusColor = () => {
    switch (table.status) {
      case 'FREE':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'OCCUPIED':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'BILL_PENDING':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const getStatusBadge = () => {
    switch (table.status) {
      case 'FREE':
        return 'Free';
      case 'OCCUPIED':
        return 'Occupied';
      case 'BILL_PENDING':
        return 'Bill Pending';
      default:
        return table.status;
    }
  };

  return (
    <div
      className={`card border-2 ${getStatusColor()} cursor-pointer hover:shadow-lg transition-all relative`}
      onClick={() => onClick(table)}
    >
      <div className="flex flex-col items-center justify-center py-4">
        <h3 className="text-2xl font-bold mb-2">{table.name}</h3>
        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white bg-opacity-70">
          {getStatusBadge()}
        </span>
        {table.capacity && (
          <p className="text-xs mt-2 opacity-75">Capacity: {table.capacity}</p>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex space-x-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(table);
              }}
              className="w-6 h-6 bg-white rounded hover:bg-gray-200 flex items-center justify-center text-xs"
              title="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(table);
              }}
              className="w-6 h-6 bg-white rounded hover:bg-red-100 flex items-center justify-center text-xs"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableCard;
