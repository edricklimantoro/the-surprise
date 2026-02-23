import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ card, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        layoutId={`card-${card.id}`}
        // Added max-h for the screen and flex-col to manage internal scrolling
        className="relative bg-white w-full max-w-sm max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Fixed Close Icon */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
        >
          <span className="text-sm">✕</span>
        </button>

        {/* Scrollable Area */}
        <div className="overflow-y-auto p-8 pt-12 custom-scrollbar">
          <div className="text-center">
            <span className="text-6xl mb-6 block drop-shadow-sm">{card.icon}</span>
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 tracking-tight">
              {card.title}
            </h2>
            
            {/* The actual content box */}
            <div className="bg-rose-50/30 p-5 rounded-2xl border border-rose-100/50 mb-8">
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap text-left text-base italic font-serif">
                {card.content}
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;