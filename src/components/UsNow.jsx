import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const ProfileSlot = ({ name, nickname }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImage();
    
    // Listen for changes so both yours and her screen update live
    const channel = supabase
      .channel(`profile-${name}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${name}` },
        (payload) => setImageUrl(payload.new.image_url)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchImage = async () => {
    const { data } = await supabase.from('profiles').select('image_url').eq('id', name).single();
    if (data?.image_url) setImageUrl(data.image_url);
  };

  const handleUpload = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${name}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Storage
      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 3. Update Database
      await supabase.from('profiles').update({ image_url: publicUrl }).eq('id', name);
      
      setImageUrl(publicUrl);
    } catch (error) {
      alert('Error uploading image!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="relative cursor-pointer group">
        <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleUpload} />
        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-rose-100 flex items-center justify-center transition-transform group-hover:scale-105 ${loading ? 'animate-pulse' : ''}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={nickname} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-rose-300 font-serif">{nickname[0]}</span>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-xs font-bold">Change ✨</span>
          </div>
        </div>
      </label>
      <span className="mt-3 font-serif font-medium text-stone-600 tracking-wide">{nickname}</span>
    </div>
  );
};

export const UsNow = () => (
  <section className="max-w-md mx-auto mb-12">
    <h2 className="text-center text-sm uppercase tracking-[0.2em] text-stone-400 mb-8">Us Now</h2>
    <div className="flex justify-center gap-12 md:gap-20">
      <ProfileSlot name="pibi" nickname="Pibi" />
      <ProfileSlot name="limi" nickname="Limi" />
    </div>
  </section>
);