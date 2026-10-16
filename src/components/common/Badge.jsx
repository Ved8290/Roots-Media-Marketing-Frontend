const slug = (text) => text.toLowerCase().replace(/\s+/g, '-');

export function Badge({ tone, children, as: Tag = 'span', ...rest }) {
  return (
    <Tag className={`badge badge--${tone}`} {...rest}>
      {children}
    </Tag>
  );
}

export function StatusBadge({ status, caret, ...rest }) {
  return (
    <Badge tone={slug(status)} {...rest}>
      {status}
      {caret && ' \u25BE'}
    </Badge>
  );
}

export const PriorityBadge = ({ priority }) => <Badge tone={`priority-${slug(priority)}`}>{priority}</Badge>;
export const EmployeeStatusBadge = ({ status }) => <Badge tone={`emp-${slug(status)}`}>{status}</Badge>;
export const OverdueBadge = () => <Badge tone="overdue">Overdue</Badge>;
