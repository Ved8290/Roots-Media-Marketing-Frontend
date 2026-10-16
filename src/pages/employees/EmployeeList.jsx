import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employeeApi } from '../../api/employeeApi';
import { useApi } from '../../hooks/useApi';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { PAGE_SIZE } from '../../utils/constants';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmployeeFilters from '../../components/employees/EmployeeFilters';
import EmployeeTable from '../../components/employees/EmployeeTable';

export default function EmployeeList() {
  const { filters, updateFilters, clearFilters } = useUrlFilters();
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, reload } = useApi(
    () => employeeApi.list({ ...filters, limit: PAGE_SIZE }),
    [JSON.stringify(filters)]
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await employeeApi.remove(employeeToDelete.id);
      toast.success(result.message);
      setEmployeeToDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message); // e.g. employee still has Todo / In Progress tasks
      setEmployeeToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Employees">
        <Link to="/employees/new" className="btn btn--primary">+ Add Employee</Link>
      </PageHeader>

      <EmployeeFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />

      <section className="card card--flush">
        {loading && !data && <Spinner label="Loading employees..." />}
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {data && (
          <div className={loading ? 'is-refreshing' : ''}>
            {data.data.length === 0 ? (
              <EmptyState title="No employees found" hint="Try changing the search or filters." />
            ) : (
              <EmployeeTable employees={data.data} onDelete={setEmployeeToDelete} />
            )}
            <Pagination pagination={data.pagination} noun="employees" onPageChange={(page) => updateFilters({ page }, { resetPage: false })} />
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(employeeToDelete)}
        title="Delete employee?"
        message={employeeToDelete ? `${employeeToDelete.fullName} (${employeeToDelete.employeeId}) will be permanently deleted. Their past tasks will keep showing their details.` : ''}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </>
  );
}
