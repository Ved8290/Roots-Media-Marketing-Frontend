import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employeeApi } from '../../api/employeeApi';
import { toFieldErrors } from '../../utils/validators';
import EmployeeForm from '../../components/employees/EmployeeForm';

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError('');
    setFieldErrors({});
    try {
      const result = await employeeApi.create(payload);
      toast.success(result.message);
      navigate(`/employees/${result.data.id}`);
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
      title="Add Employee"
      submitting={submitting}
      serverError={serverError}
      serverFieldErrors={fieldErrors}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/employees')}
    />
  );
}
