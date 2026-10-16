import { Link } from 'react-router-dom';

/** Employee name that still makes sense for tasks whose employee was deleted. */
export default function EmployeeName({ employee }) {
  if (!employee.isDeleted) {
    return <Link to={`/employees/${employee.id}`} className="link">{employee.fullName}</Link>;
  }
  return (
    <span title={`${employee.employeeId || ''} ${employee.email || ''}`.trim()}>
      {employee.fullName || 'Unknown employee'} <span className="tag tag--muted">Deleted</span>
    </span>
  );
}
