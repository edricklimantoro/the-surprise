import React from 'react';
import { motion } from 'framer-motion';

const DailyCard = ({ card, onClick }) => {
  const isLocked = card.unlock_date ? (new Date().toLocaleDateString('en-CA') < card.unlock_date) : true;
  
  return (
    <motion.div
      layoutId={`card-${card.id}`} // This creates the smooth "expanding" effect
      onClick={!isLocked ? onClick : null}
      className={`relative h-48 rounded-2xl cursor-pointer overflow-hidden shadow-md 
        ${isLocked ? 'grayscale bg-stone-200 cursor-not-allowed' : 'bg-white hover:shadow-xl'}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {isLocked ? (
          <span className="text-3xl text-stone-400">🔒</span>
        ) : (
          <>
            <span className="text-4xl mb-2">{card.icon}</span>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-tighter">Day {card.id}</span>
          </>
        )}
      </div>
      
      {/* Date Badge */}
      <div className="absolute top-3 left-3 text-[10px] font-mono text-stone-400">
        {card.unlock_date}
      </div>
    </motion.div>
  );
};

export default DailyCard;