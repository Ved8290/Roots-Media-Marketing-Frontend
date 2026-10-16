import { Link } from 'react-router-dom';

export default function StatCard({ label, value, tone = 'default', to }) {
  const content = (
    <>
      <span className="stat-card__label">{label}</span>
      <span className={`stat-card__value stat-card__value--${tone}`}>{value}</span>
    </>
  );
  return to ? <Link to={to} className="stat-card stat-card--link">{content}</Link> : <div className="stat-card">{content}</div>;
}
