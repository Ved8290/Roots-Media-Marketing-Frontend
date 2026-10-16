export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="state-box" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
