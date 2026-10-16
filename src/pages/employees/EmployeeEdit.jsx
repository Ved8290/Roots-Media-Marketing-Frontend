import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employeeApi } from '../../api/employeeApi';
import { useApi } from '../../hooks/useApi';
import { toFieldErrors } from '../../utils/validators';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import EmployeeForm from '../../components/employees/EmployeeForm';

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, loading, error, reload } = useApi(() => employeeApi.get(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (loading) return <Spinner label="Loading employee..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const initialValues = {
    employeeId: employee.employeeId,
    fullName: employee.fullName,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    role: employee.role,
    joiningDate: employee.joiningDate,
    status: employee.status,
    skills: employee.skills.join(', '),
    leaveStart: employee.leaveStart || '',
    leaveEnd: employee.leaveEnd || '',
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError('');
    setFieldErrors({});
    try {
      const result = await employeeApi.update(id, payload);
      toast.success(result.message);
      navigate(`/employees/${id}`);
    } catch (err) {
      setServerError(err.message);
      setFieldErrors(toFieldErrors(err.fieldErrors));
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeeForm
      title={`Edit Employee ${employee.employeeId}`}
      initialValues={initialValues}
      submitting={submitting}
      serverError={serverError}
      serverFieldErrors={fieldErrors}
      submitLabel="Save changes"
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/employees/${id}`)}
    />
  );
}
