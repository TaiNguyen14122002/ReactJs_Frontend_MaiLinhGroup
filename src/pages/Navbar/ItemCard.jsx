
import React from 'react'

const ItemCard = ({ label, color, title , onClick }) => {
  return (
    <div onClick={onClick} className="flex items-center space-x-2 my-2 cursor-pointer">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-md text-white font-bold"
        
        style={{ backgroundColor: color }}
      >
        {label}
      </div>
      <div className="text-white">{title}</div>
    </div>
  )
}

export default ItemCard;