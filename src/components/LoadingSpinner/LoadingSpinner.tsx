import './LoadingSpinner.css'

export const LoadingSpinner = () => {
    return (
      <div className="loading-spinner-container" data-testid='spinner'>
        <div className="loading-spinner"></div>
      </div>
    )
}