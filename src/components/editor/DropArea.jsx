import React from 'react';
import { useDrop } from 'react-dnd';
import { FiPlus } from 'react-icons/fi';

const DropArea = ({ index, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['COMPONENT', 'SECTION'],
    drop: () => ({ targetIndex: index }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`drop-area ${isActive ? 'active' : ''}`}
    >
      <div className={`drop-indicator ${isActive ? 'visible' : ''}`}>
        <FiPlus />
        <span className="drop-text">שחרר כאן</span>
      </div>
    </div>
  );
};

export default DropArea;