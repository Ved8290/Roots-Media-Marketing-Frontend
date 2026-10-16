export default function FormBanner({ message }) {
  if (!message) return null;
  return (
    <div className="form-banner" role="alert">
      {message}
    </div>
  );
}
