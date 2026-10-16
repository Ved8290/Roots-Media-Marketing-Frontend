import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskApi } from '../../api/taskApi';
import { employeeApi } from '../../api/employeeApi';
import { useApi } from '../../hooks/useApi';
import { isTaskEditable } from '../../utils/constants';
import { toFieldErrors } from '../../utils/validators';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import TaskForm from '../../components/tasks/TaskForm';

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(
    async () => ({ task: await taskApi.get(id), employees: await employeeApi.options() }),
    [id]
  );
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (loading) return <Spinner label="Loading task..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { task, employees } = data;

  if (!isTaskEditable(task)) {
    return (
      <>
        <EmptyState title={`${task.status} tasks cannot be edited`} hint="Only Todo and In Progress tasks can be changed." />
        <p className="center"><Link to={`/tasks/${task.id}`} className="btn btn--secondary">Back to task</Link></p>
      </>
    );
  }

  // The current employee may be Inactive (not in the assignable list), so make sure it is still shown
  const options = !task.employee.isDeleted && !employees.some((e) => e.id === task.employee.id)
    ? [{ ...task.employee }, ...employees]
    : employees;

  const initialValues = {
    title: task.title,
    employee: task.employee.id || '',
    priority: task.priority,
    department: task.department,
    startDate: task.startDate,
    dueDate: task.dueDate,
    description: task.description || '',
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError('');
    setFieldErrors({});
    try {
      const result = await taskApi.update(id, payload);
      toast.success(result.message);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setServerError(err.message);
      setFieldErrors(toFieldErrors(err.fieldErrors));
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TaskForm
      title={`Edit Task ${task.taskId}`}
      initialValues={initialValues}
      employees={options}
      submitting={submitting}
      serverError={serverError}
      serverFieldErrors={fieldErrors}
      submitLabel="Save changes"
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/tasks/${id}`)}
    />
  );
}
