import { Link } from 'react-router-dom';

export default function WorkloadTable({ workload, max }) {
  return (
    <table className="data-table data-table--compact">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Active Tasks</th>
        </tr>
      </thead>
      <tbody>
        {workload.map((row) => (
          <tr key={row.id}>
            <td data-label="Employee"><Link to={`/employees/${row.id}`} className="link">{row.fullName}</Link></td>
            <td data-label="Active Tasks">
              <span className="workload">
                <strong>{row.activeTasks}</strong>
                <span className="workload__bar" aria-hidden="true">
                  {Array.from({ length: max }, (_, i) => (
                    <i key={i} className={i < row.activeTasks ? 'is-filled' : ''} />
                  ))}
                </span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
