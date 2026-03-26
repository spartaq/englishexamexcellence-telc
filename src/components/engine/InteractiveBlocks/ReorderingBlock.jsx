import React from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, ListOrdered } from 'lucide-react';
import '../engine.css';

const ReorderingBlock = ({ items, setItems }) => {
  return (
    <div className="block-container">
      <div className="question-prompt" style={{ marginBottom: '0px' }}>
        <ListOrdered size={18} color="var(--lab-indigo)" />
        <span>Drag to order the logical sequence:</span>
      </div>

      <Reorder.Group 
        axis="y" 
        values={items} 
        onReorder={setItems} 
        className="reorder-list"
      >
        {items.map((item) => (
          <Reorder.Item 
            key={item.id} 
            value={item}
            className="reorder-item"
            whileDrag={{ 
              scale: 1.03, 
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              borderColor: "var(--lab-indigo)" 
            }}
          >
            <div className="drag-handle">
              <GripVertical size={20} />
            </div>
            <div className="reorder-text">
              {item.text}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default ReorderingBlock;
