import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeCreate from './pages/employees/EmployeeCreate';
import EmployeeEdit from './pages/employees/EmployeeEdit';
import EmployeeView from './pages/employees/EmployeeView';
import TaskList from './pages/tasks/TaskList';
import TaskCreate from './pages/tasks/TaskCreate';
import TaskEdit from './pages/tasks/TaskEdit';
import TaskView from './pages/tasks/TaskView';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/new" element={<EmployeeCreate />} />
        <Route path="employees/:id" element={<EmployeeView />} />
        <Route path="employees/:id/edit" element={<EmployeeEdit />} />

        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/new" element={<TaskCreate />} />
        <Route path="tasks/:id" element={<TaskView />} />
        <Route path="tasks/:id/edit" element={<TaskEdit />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
