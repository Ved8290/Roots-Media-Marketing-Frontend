export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box state-box--error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
