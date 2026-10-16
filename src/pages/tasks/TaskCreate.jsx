import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskApi } from '../../api/taskApi';
import { employeeApi } from '../../api/employeeApi';
import { useApi } from '../../hooks/useApi';
import { toFieldErrors } from '../../utils/validators';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import TaskForm from '../../components/tasks/TaskForm';

export default function TaskCreate() {
  const navigate = useNavigate();
  const { data: employees, loading, error, reload } = useApi(() => employeeApi.options(), []);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError('');
    setFieldErrors({});
    try {
      const result = await taskApi.create(payload);
      toast.success(result.message);
      navigate(`/tasks/${result.data.id}`);
    } catch (err) {
      setServerError(err.message);
      setFieldErrors(toFieldErrors(err.fieldErrors));
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading employees..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  return (
    <TaskForm
      title="Add Task"
      employees={employees}
      submitting={submitting}
      serverError={serverError}
      serverFieldErrors={fieldErrors}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/tasks')}
    />
  );
}
