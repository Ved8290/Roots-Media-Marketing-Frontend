import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskApi } from '../../api/taskApi';
import { useApi } from '../../hooks/useApi';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { PAGE_SIZE } from '../../utils/constants';
import { saveBlob } from '../../utils/download';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskTable from '../../components/tasks/TaskTable';

export default function TaskList() {
  const { filters, updateFilters, clearFilters } = useUrlFilters();
  const [busyId, setBusyId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filtering, sorting and paging all happen on the server; the URL is the single source of truth
  const { data, loading, error, reload } = useApi(
    () => taskApi.list({ ...filters, limit: PAGE_SIZE }),
    [JSON.stringify(filters)]
  );

  const handleStatusChange = async (task, status) => {
    setBusyId(task.id);
    try {
      const result = await taskApi.updateStatus(task.id, status);
      toast.success(result.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await taskApi.remove(taskToDelete.id);
      toast.success(result.message);
      setTaskToDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Same filters as the list, but without page/limit so ALL matching tasks are exported
      const { page, ...exportFilters } = filters;
      saveBlob(await taskApi.exportCsv(exportFilters), 'tasks.csv');
      toast.success('CSV exported');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader title="Tasks">
        <Link to="/tasks/new" className="btn btn--primary">+ Add Task</Link>
        <button type="button" className="btn btn--accent" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export To Csv'}
        </button>
      </PageHeader>

      <TaskFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />

      <section className="card card--flush">
        {loading && !data && <Spinner label="Loading tasks..." />}
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {data && (
          <div className={loading ? 'is-refreshing' : ''}>
            {data.data.length === 0 ? (
              <EmptyState title="No tasks found" hint="Try changing the search or filters." />
            ) : (
              <TaskTable tasks={data.data} busyId={busyId} onStatusChange={handleStatusChange} onDelete={setTaskToDelete} />
            )}
            <Pagination pagination={data.pagination} noun="tasks" onPageChange={(page) => updateFilters({ page }, { resetPage: false })} />
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete task?"
        message={taskToDelete ? `"${taskToDelete.title}" (${taskToDelete.taskId}) will be permanently deleted.` : ''}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </>
  );
}
