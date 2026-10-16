import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';
import { isTaskEditable } from '../../utils/constants';
import { PriorityBadge } from '../common/Badge';
import ActionMenu from '../common/ActionMenu';
import StatusDropdown from './StatusDropdown';
import EmployeeName from '../employees/EmployeeName';

export default function TaskTable({ tasks, busyId, onStatusChange, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Employee</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Due Date</th>
          <th className="col-action">Action</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td data-label="ID">{task.taskId}</td>
            <td data-label="Title"><Link to={`/tasks/${task.id}`} className="link">{task.title}</Link></td>
            <td data-label="Employee"><EmployeeName employee={task.employee} /></td>
            <td data-label="Priority"><PriorityBadge priority={task.priority} /></td>
            <td data-label="Status">
              <StatusDropdown status={task.status} disabled={busyId === task.id} onChange={(status) => onStatusChange(task, status)} />
            </td>
            <td data-label="Due Date" className={task.isOverdue ? 'text-overdue' : ''}>
              {formatDate(task.dueDate)}{task.isOverdue && ' (Overdue)'}
            </td>
            <td data-label="Action" className="col-action">
              <ActionMenu
                items={[
                  { label: 'View', to: `/tasks/${task.id}`, tone: 'view' },
                  { label: 'Edit', to: `/tasks/${task.id}/edit`, tone: 'edit', hidden: !isTaskEditable(task) },
                  { label: 'Delete', onClick: () => onDelete(task), tone: 'danger' },
                ]}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
