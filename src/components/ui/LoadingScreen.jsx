import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-logo">English Exam Excellence</div>
      <div className="loading-tagline">Master Your English Certification</div>
      
      <div className="spinner-wrapper">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-center"></div>
      </div>

      <div className="loading-progress">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
