import React from 'react';

const Profile = ({ profileView, setProfileView, userInfo, setUserInfo, handleProfileSave, onLogout }) => {
  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up mt-4 md:mt-0">
      {profileView === 'main' && (
        <div className="w-full flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-black text-white rounded-full mb-4 flex items-center justify-center text-3xl shadow-[0_8px_20px_rgba(0,0,0,0.2)] border-4 border-white/80">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-2xl font-black text-zinc-900 mb-1 tracking-tight">{userInfo.name}</h3>
          <p className="text-zinc-500 font-medium mb-8 text-sm">{userInfo.phone}</p>
          
          <div className="w-full space-y-3 mb-8">
            <div onClick={() => setProfileView('edit_info')} className="bg-white/70 backdrop-blur-xl p-5 rounded-[20px] flex justify-between items-center cursor-pointer hover:bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-white/80 transition-all group">
              <span className="font-bold text-zinc-800 group-hover:text-red-600 transition-colors">Edit Personal Info</span><span className="text-zinc-300 font-bold group-hover:text-red-400">➔</span>
            </div>
            <div onClick={() => setProfileView('saved_addresses')} className="bg-white/70 backdrop-blur-xl p-5 rounded-[20px] flex justify-between items-center cursor-pointer hover:bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-white/80 transition-all group">
              <span className="font-bold text-zinc-800 group-hover:text-red-600 transition-colors">Saved Addresses</span><span className="text-zinc-300 font-bold group-hover:text-red-400">➔</span>
            </div>
            <div onClick={() => setProfileView('payment_methods')} className="bg-white/70 backdrop-blur-xl p-5 rounded-[20px] flex justify-between items-center cursor-pointer hover:bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-white/80 transition-all group">
              <span className="font-bold text-zinc-800 group-hover:text-red-600 transition-colors">Payment Methods</span><span className="text-zinc-300 font-bold group-hover:text-red-400">➔</span>
            </div>
          </div>
          <button onClick={onLogout} className="w-full p-4 rounded-2xl bg-zinc-100 text-red-600 font-bold hover:bg-red-50 transition-colors border border-zinc-200/50">Log Out</button>
        </div>
      )}

      {profileView === 'edit_info' && (
        <div className="w-full animate-fade-in-up">
          <button onClick={() => setProfileView('main')} className="mb-6 font-bold text-zinc-500 flex items-center gap-2 hover:text-red-600 transition-colors">
             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
             Back
          </button>
          <h2 className="text-2xl font-black text-zinc-900 mb-6 tracking-tight">Edit Info</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Full Name</label>
              <input type="text" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} className="w-full mt-1 p-4 rounded-2xl bg-white/60 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white/80 focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none font-bold text-zinc-800 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Phone</label>
              <input type="text" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="w-full mt-1 p-4 rounded-2xl bg-white/60 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white/80 focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none font-bold text-zinc-800 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Email</label>
              <input type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="w-full mt-1 p-4 rounded-2xl bg-white/60 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white/80 focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none font-bold text-zinc-800 transition-all" />
            </div>
            <button onClick={handleProfileSave} className="w-full mt-6 p-4 rounded-2xl bg-zinc-900 text-white font-bold shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-all hover:bg-black">Save Changes</button>
          </div>
        </div>
      )}

      {profileView === 'saved_addresses' && (
        <div className="w-full animate-fade-in-up">
          <button onClick={() => setProfileView('main')} className="mb-6 font-bold text-zinc-500 flex items-center gap-2 hover:text-red-600 transition-colors">
             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
             Back
          </button>
          <h2 className="text-2xl font-black text-zinc-900 mb-6 tracking-tight">Saved Addresses</h2>
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-xl">🏠</div>
              <div className="flex-1 overflow-hidden">
                <p className="font-black text-zinc-900">Home</p>
                <p className="font-medium text-zinc-500 text-xs truncate">123 Maninagar St, Ahmedabad</p>
              </div>
            </div>
          </div>
          <button className="w-full p-4 rounded-2xl bg-zinc-100 text-zinc-900 font-bold active:scale-95 transition-all hover:bg-zinc-200" onClick={() => alert("Coming soon!")}>+ Add New Address</button>
        </div>
      )}

      {profileView === 'payment_methods' && (
        <div className="w-full animate-fade-in-up">
          <button onClick={() => setProfileView('main')} className="mb-6 font-bold text-zinc-500 flex items-center gap-2 hover:text-red-600 transition-colors">
             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
             Back
          </button>
          <h2 className="text-2xl font-black text-zinc-900 mb-6 tracking-tight">Payment Methods</h2>
          <div className="space-y-4 mb-6">
            <div className="p-6 bg-gradient-to-r from-zinc-900 to-black text-white rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <p className="font-black tracking-widest text-lg">•••• 4242</p>
                <p className="text-xs font-medium text-zinc-400 mt-1">Visa • 12/26</p>
              </div>
              <div className="text-2xl font-black italic text-zinc-300 relative z-10">VISA</div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>
          <button className="w-full p-4 rounded-2xl bg-zinc-100 text-zinc-900 font-bold active:scale-95 transition-all hover:bg-zinc-200" onClick={() => alert("Coming soon!")}>+ Add New Card</button>
        </div>
      )}
    </div>
  );
};

export default Profile;