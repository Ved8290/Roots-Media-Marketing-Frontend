import { useState } from 'react';
import { DEPARTMENTS, TASK_PRIORITIES } from '../../utils/constants';
import { validateTask } from '../../utils/validators';
import FormField from '../common/FormField';
import FormBanner from '../common/FormBanner';

export const emptyTask = { title: '', employee: '', priority: '', department: '', startDate: '', dueDate: '', description: '' };

const employeeLabel = (e) => `${e.fullName} (${e.employeeId})${e.status !== 'Active' ? ` - ${e.status}` : ''}`;

export default function TaskForm({ title, initialValues = emptyTask, employees, submitting, serverError, serverFieldErrors = {}, submitLabel = 'Submit', onSubmit, onCancel }) {
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
    const found = validateTask(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onSubmit({ ...values, title: values.title.trim(), description: values.description.trim() });
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <h1 className="form-title">{title}</h1>
      <div className="form-grid">
        <FormField label="Title" name="title" required placeholder="Enter title" value={values.title} onChange={handleChange} error={shownErrors.title} maxLength={100} />
        <FormField label="Assigned Employee" name="employee" as="select" required value={values.employee} onChange={handleChange} error={shownErrors.employee}>
          <option value="">Select...</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{employeeLabel(e)}</option>)}
        </FormField>
        <FormField label="Priority" name="priority" as="select" required value={values.priority} onChange={handleChange} error={shownErrors.priority}>
          <option value="">Select...</option>
          {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </FormField>
        <FormField label="Department" name="department" as="select" required value={values.department} onChange={handleChange} error={shownErrors.department}>
          <option value="">Select...</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </FormField>
        <FormField label="Start Date" name="startDate" type="date" required value={values.startDate} onChange={handleChange} error={shownErrors.startDate} />
        <FormField label="Due Date" name="dueDate" type="date" required min={values.startDate || undefined} value={values.dueDate} onChange={handleChange} error={shownErrors.dueDate} />
        <FormField label="Description" name="description" as="textarea" rows={4} className="form-field--full" placeholder="Enter description" value={values.description} onChange={handleChange} error={shownErrors.description} maxLength={500} />
      </div>

      <FormBanner message={serverError} />

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  );
}
