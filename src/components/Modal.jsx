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
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        layoutId={`card-${card.id}`} // Matches the ID in DailyCard for the animation
        className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-300 hover:text-stone-600"
        >
          ✕
        </button>

        <div className="text-center">
          <span className="text-6xl mb-6 block">{card.icon}</span>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">{card.title}</h2>
          <p className="text-stone-600 leading-relaxed whitespace-pre-wrap mb-8">
            {card.content}
          </p>
          <button 
            onClick={onClose}
            className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;