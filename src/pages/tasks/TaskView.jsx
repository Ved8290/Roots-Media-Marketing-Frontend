import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskApi } from '../../api/taskApi';
import { useApi } from '../../hooks/useApi';
import { isTaskEditable } from '../../utils/constants';
import { formatDate, formatTimestamp } from '../../utils/format';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import DetailItem from '../../components/common/DetailItem';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { OverdueBadge, PriorityBadge } from '../../components/common/Badge';
import StatusDropdown from '../../components/tasks/StatusDropdown';
import EmployeeName from '../../components/employees/EmployeeName';

export default function TaskView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: task, loading, error, reload } = useApi(() => taskApi.get(id), [id]);
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading && !task) return <Spinner label="Loading task..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      const result = await taskApi.updateStatus(id, status);
      toast.success(result.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await taskApi.remove(id);
      toast.success(result.message);
      navigate('/tasks');
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  };

  const { employee } = task;

  return (
    <>
      <PageHeader title={task.title} subtitle={task.taskId}>
        {isTaskEditable(task) && <Link to={`/tasks/${task.id}/edit`} className="btn btn--secondary">Edit</Link>}
        <button type="button" className="btn btn--danger" onClick={() => setConfirmDelete(true)}>Delete</button>
      </PageHeader>

      <div className="view-layout">
        <section className="card">
          <h2 className="section-title">Task details</h2>
          <dl className="detail-grid">
            <DetailItem label="Status"><StatusDropdown status={task.status} disabled={updating} onChange={handleStatusChange} /></DetailItem>
            <DetailItem label="Priority"><PriorityBadge priority={task.priority} /></DetailItem>
            <DetailItem label="Department">{task.department}</DetailItem>
            <DetailItem label="Start date">{formatDate(task.startDate)}</DetailItem>
            <DetailItem label="Due date">
              <span className={task.isOverdue ? 'text-overdue' : ''}>{formatDate(task.dueDate)}</span>{' '}
              {task.isOverdue && <OverdueBadge />}
            </DetailItem>
            <DetailItem label="Created">{formatTimestamp(task.createdAt)}</DetailItem>
            <DetailItem label="Completed">{formatTimestamp(task.completedDate)}</DetailItem>
          </dl>
          <h3 className="sub-title">Description</h3>
          <p className="description">{task.description || 'No description provided.'}</p>
        </section>

        <aside className="card">
          <h2 className="section-title">Assigned employee</h2>
          <dl className="detail-grid detail-grid--single">
            <DetailItem label="Name"><EmployeeName employee={employee} /></DetailItem>
            <DetailItem label="Employee ID">{employee.employeeId}</DetailItem>
            <DetailItem label="Email">{employee.email}</DetailItem>
            <DetailItem label="Department">{employee.department}</DetailItem>
            <DetailItem label="Role">{employee.role}</DetailItem>
          </dl>
          {employee.isDeleted && <p className="muted note">This employee has been deleted. Details shown are the ones saved with the task.</p>}
        </aside>
      </div>

      <p><Link to="/tasks" className="link">&larr; Back to tasks</Link></p>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete task?"
        message={`"${task.title}" (${task.taskId}) will be permanently deleted.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
