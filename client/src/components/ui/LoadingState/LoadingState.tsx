import "./LoadingState.css";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Chargement..." }: LoadingStateProps) => {
  return (
    <div className="loading-state">
      <div className="loading-state__spinner" />
      <span className="loading-state__text">{message}</span>
    </div>
  );
};

export default LoadingState;
