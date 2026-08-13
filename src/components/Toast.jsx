export default function Toast({ message }) {
  if (!message) return null;
  return <div className="bw-toast">{message}</div>;
}
