export default function EmptyState({ title, hint }) {
  return (
    <div className="state-box">
      <strong>{title}</strong>
      {hint && <span className="muted">{hint}</span>}
    </div>
  );
}
