
import { ChevronRight } from 'lucide-react';
import React from 'react'

const ItemCard = ({ label, color, title , onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between p-2 bg-gray-100 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:shadow-md"
    >
      <div className="flex items-center space-x-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-md text-white font-bold text-sm transition-all duration-300 group-hover:rotate-3 group-hover:scale-110"
          style={{ backgroundColor: color }}
        >
          {label}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-gray-800 text-sm font-semibold truncate max-w-[150px]">{title}</h3>
          <p className="text-gray-500 text-xs">Click to view</p>
        </div>
      </div>
      <ChevronRight className="text-gray-400 w-4 h-4 transition-all duration-300 group-hover:text-gray-600 group-hover:translate-x-1" />
    </div>
  )
}

export default ItemCard;