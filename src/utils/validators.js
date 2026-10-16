// Same rules as the backend (zod schemas), so users get instant feedback.

export function validateTask(values) {
  const errors = {};
  const title = values.title.trim();

  if (!title) errors.title = 'Title is required';
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters';
  else if (title.length > 100) errors.title = 'Title cannot exceed 100 characters';

  if (!values.employee) errors.employee = 'Please select an employee';
  if (!values.priority) errors.priority = 'Please select a priority';
  if (!values.department) errors.department = 'Please select a department';
  if (!values.startDate) errors.startDate = 'Start date is required';
  if (!values.dueDate) errors.dueDate = 'Due date is required';
  if (values.startDate && values.dueDate && values.dueDate < values.startDate) {
    errors.dueDate = 'Due date cannot be earlier than start date';
  }
  if (values.description.length > 500) errors.description = 'Description cannot exceed 500 characters';
  return errors;
}

export function parseSkills(text) {
  return text
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function validateEmployee(values) {
  const errors = {};
  const employeeId = values.employeeId.trim();
  const fullName = values.fullName.trim();
  const phone = values.phone.replace(/[\s()-]/g, '');

  if (!employeeId) errors.employeeId = 'Employee ID is required';
  else if (!/^[A-Za-z0-9_-]{2,20}$/.test(employeeId)) errors.employeeId = 'Use 2-20 letters, numbers, - or _';

  if (!fullName) errors.fullName = 'Full name is required';
  else if (!/^\p{L}[\p{L}\s.'-]{1,79}$/u.test(fullName)) errors.fullName = 'Use 2-80 letters (spaces, . - and apostrophes allowed)';

  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Enter a valid email address';

  if (!phone) errors.phone = 'Phone is required';
  else if (!/^\+?\d{10,15}$/.test(phone)) errors.phone = 'Phone must have 10 to 15 digits';

  if (!values.department) errors.department = 'Please select a department';
  if (!values.role.trim()) errors.role = 'Role is required';
  else if (values.role.trim().length < 2) errors.role = 'Role must be at least 2 characters';
  if (!values.joiningDate) errors.joiningDate = 'Joining date is required';

  const skills = parseSkills(values.skills);
  if (skills.length > 15) errors.skills = 'You can add at most 15 skills';
  else if (skills.some((skill) => skill.length > 30)) errors.skills = 'Each skill can have at most 30 characters';

  if (values.status === 'On Leave') {
    if (!values.leaveStart) errors.leaveStart = 'Leave start is required';
    if (!values.leaveEnd) errors.leaveEnd = 'Leave end is required';
    if (values.leaveStart && values.leaveEnd && values.leaveEnd < values.leaveStart) {
      errors.leaveEnd = 'Leave end cannot be earlier than leave start';
    }
  }
  return errors;
}

/** Converts the server's per-field error list into { field: message } */
export function toFieldErrors(fieldErrors = []) {
  return fieldErrors.reduce((acc, { field, message }) => ({ ...acc, [field]: message }), {});
}
