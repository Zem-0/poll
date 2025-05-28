
export default function ChatLoader() {
    return (
      <div id="chatloader" className="flex flex-col items-start my-3">
        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
  
          .loader-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
          }
  
          .indicator {
            width: 4px;
            height: 20px;
            background-color: #4f46e5; /* Indigo shade */
            border-radius: 2px;
          }
  
          .loader {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            background-color: white;
            border-radius: 50px;
            padding: 12px 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
  
          .dot {
            width: 6px;
            height: 6px;
            background-color: #4f46e5; /* Indigo shade */
            border-radius: 50%;
            animation: bounce 1.5s infinite ease-in-out;
          }
  
          .dot:nth-child(1) {
            animation-delay: -0.3s;
          }
  
          .dot:nth-child(2) {
            animation-delay: -0.15s;
          }
  
          .dot:nth-child(3) {
            animation-delay: 0s;
          }
        `}</style>
  
        <div className="loader-wrapper">
          <div className="indicator"></div>
          <div className="loader">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  }
  