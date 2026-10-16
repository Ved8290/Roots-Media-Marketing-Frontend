import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employeeApi } from '../../api/employeeApi';
import { taskApi } from '../../api/taskApi';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/format';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import DetailItem from '../../components/common/DetailItem';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { EmployeeStatusBadge, PriorityBadge, StatusBadge } from '../../components/common/Badge';

export default function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(
    async () => ({
      employee: await employeeApi.get(id),
      tasks: await taskApi.list({ employee: id, limit: 5, sortBy: 'createdAt', order: 'desc' }),
    }),
    [id]
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <Spinner label="Loading employee..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { employee, tasks } = data;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await employeeApi.remove(id);
      toast.success(result.message);
      navigate('/employees');
    } catch (err) {
      toast.error(err.message);
      setConfirmDelete(false);
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title={employee.fullName} subtitle={`${employee.employeeId} \u00B7 ${employee.role}`}>
        <Link to={`/employees/${employee.id}/edit`} className="btn btn--secondary">Edit</Link>
        <button type="button" className="btn btn--danger" onClick={() => setConfirmDelete(true)}>Delete</button>
      </PageHeader>

      <div className="view-layout">
        <section className="card">
          <h2 className="section-title">Profile</h2>
          <dl className="detail-grid">
            <DetailItem label="Status"><EmployeeStatusBadge status={employee.status} /></DetailItem>
            <DetailItem label="Department">{employee.department}</DetailItem>
            <DetailItem label="Email"><span className="break">{employee.email}</span></DetailItem>
            <DetailItem label="Phone">{employee.phone}</DetailItem>
            <DetailItem label="Joining date">{formatDate(employee.joiningDate)}</DetailItem>
            <DetailItem label="Active tasks">{employee.activeTaskCount} of 3</DetailItem>
            {employee.status === 'On Leave' && (
              <DetailItem label="Leave period">{formatDate(employee.leaveStart)} to {formatDate(employee.leaveEnd)}</DetailItem>
            )}
          </dl>
          <h3 className="sub-title">Skills</h3>
          {employee.skills.length === 0 ? (
            <p className="muted">No skills added.</p>
          ) : (
            <ul className="chips">{employee.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          )}
        </section>

        <aside className="card">
          <h2 className="section-title">Recent tasks</h2>
          {tasks.data.length === 0 ? (
            <EmptyState title="No tasks yet" />
          ) : (
            <ul className="mini-list">
              {tasks.data.map((task) => (
                <li key={task.id}>
                  <Link to={`/tasks/${task.id}`} className="link">{task.taskId} &middot; {task.title}</Link>
                  <span className="mini-list__meta">
                    <StatusBadge status={task.status} /> <PriorityBadge priority={task.priority} />
                    <span className={task.isOverdue ? 'text-overdue' : 'muted'}>{formatDate(task.dueDate)}{task.isOverdue && ' (Overdue)'}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {tasks.pagination.total > tasks.data.length && (
            <p className="muted note">Showing {tasks.data.length} of {tasks.pagination.total} tasks.</p>
          )}
        </aside>
      </div>

      <p><Link to="/employees" className="link">&larr; Back to employees</Link></p>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete employee?"
        message={`${employee.fullName} will be permanently deleted. Their past tasks will keep showing their details.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
