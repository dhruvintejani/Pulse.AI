interface AuthAlertProps {
  message?: string;
}

const AuthAlert = ({ message }: AuthAlertProps) => {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600 shadow-sm">
      {message}
    </div>
  );
};

export default AuthAlert;
