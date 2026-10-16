/** Label + control + error message. `as` can be input (default), select or textarea. */
export default function FormField({ label, name, error, as: Control = 'input', required, children, className = '', ...controlProps }) {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <Control id={name} name={name} className={error ? 'has-error' : ''} aria-invalid={Boolean(error)} {...controlProps}>
        {children}
      </Control>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
