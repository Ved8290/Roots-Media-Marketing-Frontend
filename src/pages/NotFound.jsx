import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';

export default function NotFound() {
  return (
    <>
      <EmptyState title="Page not found" hint="The page you are looking for does not exist." />
      <p className="center"><Link to="/" className="btn btn--primary">Go to dashboard</Link></p>
    </>
  );
}
