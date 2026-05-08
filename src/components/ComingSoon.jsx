import { useState } from "react";

const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-45deg); }
    50%       { transform: translateY(-14px) rotate(-45deg); }
  }
  @keyframes trail {
    0%   { opacity: 0.7; transform: scaleX(1); }
    100% { opacity: 0;   transform: scaleX(0); }
  }
  @keyframes particle {
    0%   { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
  }
  .rocket       { animation: float 2.4s ease-in-out infinite; }
  .trail-1      { animation: trail 0.6s ease-out infinite; }
  .trail-2      { animation: trail 0.6s ease-out infinite 0.15s; }
  .trail-3      { animation: trail 0.6s ease-out infinite 0.3s; }
  .p1 { --tx: -8px;  --ty: 10px;  animation: particle 0.8s ease-out infinite 0s; }
  .p2 { --tx: 6px;   --ty: 14px;  animation: particle 0.8s ease-out infinite 0.2s; }
  .p3 { --tx: -4px;  --ty: 18px;  animation: particle 0.8s ease-out infinite 0.4s; }
  .p4 { --tx: 10px;  --ty: 10px;  animation: particle 0.8s ease-out infinite 0.1s; }
`;

export default function ComingSoon() {
  const [notified, setNotified] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm w-full">

          {/* Rocket animation */}
          <div className="flex items-center justify-center mb-8" style={{ height: 90 }}>
            <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>

              {/* Exhaust particles */}
              <span className="p1 absolute w-2 h-2 rounded-full bg-orange-300" style={{ bottom: 4, left: '44%' }} />
              <span className="p2 absolute w-1.5 h-1.5 rounded-full bg-red-300" style={{ bottom: 4, left: '50%' }} />
              <span className="p3 absolute w-1 h-1 rounded-full bg-yellow-300" style={{ bottom: 4, left: '40%' }} />
              <span className="p4 absolute w-2 h-2 rounded-full bg-orange-200" style={{ bottom: 4, left: '54%' }} />

              {/* Trails */}
              <span className="trail-1 absolute h-0.5 bg-violet-200 rounded-full origin-right" style={{ width: 28, bottom: 28, left: -22 }} />
              <span className="trail-2 absolute h-0.5 bg-violet-100 rounded-full origin-right" style={{ width: 20, bottom: 22, left: -16 }} />
              <span className="trail-3 absolute h-0.5 bg-violet-100 rounded-full origin-right" style={{ width: 14, bottom: 34, left: -10 }} />

              {/* Rocket emoji */}
              <span className="rocket text-5xl select-none" style={{ display: 'inline-block' }}>🚀</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Coming Soon
          </h1>

          {/* Subtext */}
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            This module is under development. We'll let you know when it's ready.
          </p>

          {/* Notify button */}
          {/* <button
            onClick={() => setNotified(true)}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              notified
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-violet-600 hover:bg-violet-700 text-white active:scale-95"
            }`}
          >
            {notified ? "✓ We'll notify you!" : "Notify me when ready"}
          </button> */}

        </div>
      </div>
    </>
  );
}