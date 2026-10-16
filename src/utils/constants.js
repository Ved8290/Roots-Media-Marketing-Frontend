export const DEPARTMENTS = ['Development', 'Design', 'QA', 'HR', 'Sales'];
export const EMPLOYEE_STATUSES = ['Active', 'Inactive', 'On Leave'];
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const TASK_STATUSES = ['Todo', 'In Progress', 'Completed', 'Cancelled'];
export const PAGE_SIZE = 10;

// Only used to decide which options to SHOW. The backend enforces the real rule.
export const NEXT_STATUSES = {
  Todo: ['In Progress', 'Cancelled'],
  'In Progress': ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};

export const TASK_SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'dueDate:asc', label: 'Due date (earliest)' },
  { value: 'dueDate:desc', label: 'Due date (latest)' },
  { value: 'priority:desc', label: 'Priority (high to low)' },
  { value: 'priority:asc', label: 'Priority (low to high)' },
  { value: 'title:asc', label: 'Title (A-Z)' },
  { value: 'title:desc', label: 'Title (Z-A)' },
];

export const EMPLOYEE_SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'fullName:asc', label: 'Name (A-Z)' },
  { value: 'fullName:desc', label: 'Name (Z-A)' },
  { value: 'joiningDate:desc', label: 'Joined (latest)' },
  { value: 'joiningDate:asc', label: 'Joined (earliest)' },
];

export const isTaskEditable = (task) => task.status === 'Todo' || task.status === 'In Progress';
