import React from 'react';
import type { MenuItem } from '../types/restaurant';
import { roleCheck } from '../utils/roleCheck';

interface ItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAdd }) => {
  const showPrice = roleCheck.canSeePrices();

  return (
    <div
      className={`card hover:shadow-lg transition-all cursor-pointer border ${
        item.available ? 'border-gray-200' : 'border-red-300 opacity-50'
      }`}
      onClick={() => item.available && onAdd(item)}
    >
      <div className="flex flex-col">
        <h4 className="text-base font-semibold text-gray-800 mb-1">{item.name}</h4>
        
        {item.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-auto">
          {showPrice && (
            <span className="text-lg font-bold text-primary">₹{item.price}</span>
          )}
          
          {!item.available && (
            <span className="text-xs text-red-600 font-medium">Unavailable</span>
          )}
          
          {item.available && (
            <button
              className="ml-auto w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item);
              }}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
