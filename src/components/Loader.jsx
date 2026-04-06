export default function Loader({ text = 'Processing...' }) {
  return (
    <div className="loader-container">
      <div className="spinner" />
      <span className="loader-text">{text}</span>
    </div>
  );
}
