import React, { useRef } from 'react';
import { useDrag } from "react-dnd";
import { Button } from "../../components/ui/button";

export function DraggableQuestion({ question, icon, className }) {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "question",
    item: question,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  drag(ref);
  
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Button 
        variant="ghost" 
        className={`justify-start gap-2 text-white hover:bg-gray-800 w-full ${className}`}
      >
        {icon}
        {question.title}
      </Button>
    </div>
  );
}