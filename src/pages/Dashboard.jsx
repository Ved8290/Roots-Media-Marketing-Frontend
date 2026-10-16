import { dashboardApi } from '../api/dashboardApi';
import { useApi } from '../hooks/useApi';
import PageHeader from '../components/common/PageHeader';
import Spinner from '../components/common/Spinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import StatCard from '../components/dashboard/StatCard';
import WorkloadTable from '../components/dashboard/WorkloadTable';

export default function Dashboard() {
  const { data, loading, error, reload } = useApi(() => dashboardApi.get(), []);

  if (loading && !data) return <Spinner label="Loading dashboard..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { employees, tasks, workload, maxActiveTasks } = data;

  return (
    <>
      <PageHeader title="Dashboard" />

      <section className="stat-grid stat-grid--4" aria-label="Employees">
        <StatCard label="Total Employees" value={employees.total} to="/employees" />
        <StatCard label="Active" value={employees.active} tone="green" to="/employees?status=Active" />
        <StatCard label="Inactive" value={employees.inactive} tone="grey" to="/employees?status=Inactive" />
        <StatCard label="On Leave" value={employees.onLeave} tone="amber" to="/employees?status=On%20Leave" />
      </section>

      <section className="stat-grid stat-grid--6" aria-label="Tasks">
        <StatCard label="Total Tasks" value={tasks.total} to="/tasks" />
        <StatCard label="Todo" value={tasks.todo} tone="grey" to="/tasks?status=Todo" />
        <StatCard label="In Progress" value={tasks.inProgress} tone="blue" to="/tasks?status=In%20Progress" />
        <StatCard label="Completed" value={tasks.completed} tone="green" to="/tasks?status=Completed" />
        <StatCard label="Cancelled" value={tasks.cancelled} tone="brown" to="/tasks?status=Cancelled" />
        <StatCard label="Overdue" value={tasks.overdue} tone="red" to="/tasks?overdue=true" />
      </section>

      <section className="card">
        <h2 className="section-title">Employee Workload</h2>
        {workload.length === 0 ? (
          <EmptyState title="No active tasks" hint="Workload appears once tasks are assigned." />
        ) : (
          <WorkloadTable workload={workload} max={maxActiveTasks} />
        )}
      </section>
    </>
  );
}
