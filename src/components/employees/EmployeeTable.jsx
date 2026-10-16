import { Link } from 'react-router-dom';
import { EmployeeStatusBadge } from '../common/Badge';
import ActionMenu from '../common/ActionMenu';

export default function EmployeeTable({ employees, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Role</th>
          <th>Status</th>
          <th>Active Tasks</th>
          <th className="col-action">Action</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td data-label="ID">{employee.employeeId}</td>
            <td data-label="Name"><Link to={`/employees/${employee.id}`} className="link">{employee.fullName}</Link></td>
            <td data-label="Email" className="break">{employee.email}</td>
            <td data-label="Department">{employee.department}</td>
            <td data-label="Role">{employee.role}</td>
            <td data-label="Status"><EmployeeStatusBadge status={employee.status} /></td>
            <td data-label="Active Tasks">{employee.activeTaskCount}</td>
            <td data-label="Action" className="col-action">
              <ActionMenu
                items={[
                  { label: 'View', to: `/employees/${employee.id}`, tone: 'view' },
                  { label: 'Edit', to: `/employees/${employee.id}/edit`, tone: 'edit' },
                  { label: 'Delete', onClick: () => onDelete(employee), tone: 'danger' },
                ]}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
