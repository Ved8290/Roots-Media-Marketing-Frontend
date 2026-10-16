import { useState } from 'react';
import { DEPARTMENTS, EMPLOYEE_STATUSES } from '../../utils/constants';
import { parseSkills, validateEmployee } from '../../utils/validators';
import FormField from '../common/FormField';
import FormBanner from '../common/FormBanner';

export const emptyEmployee = {
  employeeId: '', fullName: '', email: '', phone: '', department: '', role: '',
  joiningDate: '', status: 'Active', skills: '', leaveStart: '', leaveEnd: '',
};

export default function EmployeeForm({ title, initialValues = emptyEmployee, submitting, serverError, serverFieldErrors = {}, submitLabel = 'Submit', onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const shownErrors = { ...serverFieldErrors, ...errors };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateEmployee(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const onLeave = values.status === 'On Leave';
    onSubmit({
      employeeId: values.employeeId.trim(),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      department: values.department,
      role: values.role.trim(),
      joiningDate: values.joiningDate,
      status: values.status,
      skills: parseSkills(values.skills),
      leaveStart: onLeave ? values.leaveStart : null,
      leaveEnd: onLeave ? values.leaveEnd : null,
    });
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <h1 className="form-title">{title}</h1>
      <div className="form-grid">
        <FormField label="Employee ID" name="employeeId" required placeholder="e.g. EMP-001" value={values.employeeId} onChange={handleChange} error={shownErrors.employeeId} maxLength={20} />
        <FormField label="Full Name" name="fullName" required placeholder="Enter full name" value={values.fullName} onChange={handleChange} error={shownErrors.fullName} maxLength={80} />
        <FormField label="Email" name="email" type="email" required placeholder="name@company.com" value={values.email} onChange={handleChange} error={shownErrors.email} />
        <FormField label="Phone" name="phone" type="tel" required placeholder="+91 98765 43210" value={values.phone} onChange={handleChange} error={shownErrors.phone} />
        <FormField label="Department" name="department" as="select" required value={values.department} onChange={handleChange} error={shownErrors.department}>
          <option value="">Select...</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </FormField>
        <FormField label="Role" name="role" required placeholder="e.g. Frontend Developer" value={values.role} onChange={handleChange} error={shownErrors.role} maxLength={60} />
        <FormField label="Joining Date" name="joiningDate" type="date" required value={values.joiningDate} onChange={handleChange} error={shownErrors.joiningDate} />
        <FormField label="Status" name="status" as="select" required value={values.status} onChange={handleChange} error={shownErrors.status}>
          {EMPLOYEE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </FormField>
        {values.status === 'On Leave' && (
          <>
            <FormField label="Leave Start" name="leaveStart" type="date" required value={values.leaveStart} onChange={handleChange} error={shownErrors.leaveStart} />
            <FormField label="Leave End" name="leaveEnd" type="date" required min={values.leaveStart || undefined} value={values.leaveEnd} onChange={handleChange} error={shownErrors.leaveEnd} />
          </>
        )}
        <FormField label="Skills (comma separated)" name="skills" className="form-field--full" placeholder="React, Node.js, MongoDB" value={values.skills} onChange={handleChange} error={shownErrors.skills} />
      </div>

      <FormBanner message={serverError} />

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  );
}
