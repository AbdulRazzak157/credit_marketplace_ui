

const AccessRestricted = ({
    title = "You don't have permission to view this page",
    description = "Your account doesn't have the required permissions for this section. Contact your administrator to request access.",
    onBack = () => history.back(),
    onHome = () => (window.location.href = '/dashboard'),
}) => {
    return (
        <div className="min-h-105 flex items-center justify-center px-4 py-8">
            <div className="text-center max-w-sm">

                <div className="w-18 h-18 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="11" width="14" height="10" rx="2" fill="#E24B4A" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#E24B4A" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="16" r="1.5" fill="white" />
                    </svg>
                </div>

                <p className="text-[11px] font-medium tracking-widest uppercase text-red-800 mb-2">
                    Access Restricted
                </p>

                <h2 className="text-xl font-medium text-gray-900 leading-snug mb-2.5">
                    {title}
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed mb-7">
                    {description}
                </p>

                <div className="flex gap-2 justify-center flex-wrap">
                    <button
                        onClick={onBack}
                        className="text-sm px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Go back
                    </button>
                    <button
                        onClick={onHome}
                        className="text-sm px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Go to dashboard
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AccessRestricted;