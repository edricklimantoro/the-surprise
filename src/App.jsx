import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DailyCard from './components/DailyCard';
import Modal from './components/Modal';
import { supabase } from './utils/supabase'
import { UsNow } from './components/UsNow';


function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [mood, setMood] = useState('😊');
  const moods = ['🥰', '😊', '☹️', '🤒', '😴', '😠'];

  useEffect(() => {
    // 1. Initial Fetch
    const fetchMood = async () => {
      const { data, error } = await supabase
        .from('global_mood')
        .select('mood')
        .eq('id', 1)
        .single();

      if (data) setMood(data.mood);
      if (error) console.error("Error fetching mood:", error);
    };

    fetchMood();

    // 2. Fetch Cards from Supabase
    const fetchCards = async () => {
      const { data, error } = await supabase
        .from('daily_cards')
        .select('*')
        .order('id', { ascending: true }); // Keep them in order

      if (data) setCards(data);
      if (error) console.error("Error fetching cards:", error);
    };

    fetchCards();

    // 3. Real-time Subscription
    const channel = supabase
      .channel('site-updates') // Renamed to something more general
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'global_mood', filter: 'id=eq.1' },
        (payload) => setMood(payload.new.mood)
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'daily_cards' }, // Listening to ALL changes (Insert/Update/Delete)
        (payload) => {
          // Refresh your cards list when a change happens
          fetchCards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Update Function
  const handleMoodUpdate = async (newMood) => {
    // Optimistic Update (change UI immediately)
    setMood(newMood);

    // Update the single row in Supabase
    const { error } = await supabase
      .from('global_mood')
      .update({ mood: newMood })
      .eq('id', 1);

    if (error) {
      console.error("Error updating mood:", error);
      // Optional: Revert mood if update fails
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 text-stone-800 font-sans p-8">
      {/* Header */}
      <header className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-rose-600 mb-2">To My Favorite Person</h1>
        <p className="text-stone-500 italic">Counting down the days until your special day...</p>
      </header>

      {/* Mood Gauge */}
      <section className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-sm mb-12 text-center">
        <h2 className="text-sm uppercase tracking-widest text-stone-400 mb-4">How are you today?</h2>
        <div className="flex justify-around text-3xl">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => handleMoodUpdate(m)}
              className={`transition-transform hover:scale-125 ${mood === m ? 'scale-150 drop-shadow-md' : 'opacity-40'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      {/* Selfie Photos */}
      <UsNow />

      {/* Daily Cards Grid */}
      <main className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
        {cards.length === 0 ? (
          // Show 3 empty "shimmering" boxes while loading
          [1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-stone-200 animate-pulse rounded-2xl" />
          ))
        ) : (cards.map((card) => (
          <DailyCard
            key={card.id}
            card={card}
            onClick={() => setSelectedCard(card)}
          />
          ))
        )}
      </main>

      {/* Animation Portal for Modal */}
      <AnimatePresence>
        {selectedCard && (
          <Modal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;