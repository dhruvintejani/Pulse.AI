const AuthLoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8F4EC]" role="status" aria-live="polite">
    <div className="w-10 h-10 rounded-full border-2 border-[#E9A24C]/30 border-t-[#E9A24C] animate-spin" aria-hidden="true" />
    <span className="sr-only">Loading Pulse AI</span>
  </div>
);

export default AuthLoadingScreen;
