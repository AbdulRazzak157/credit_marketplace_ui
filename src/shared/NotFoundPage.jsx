import { useNavigate } from "react-router-dom";
import assets from "../constants/assets.constant";

export default function NotFoundPage() {

    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/");
    };


    return (
        <div className="bg-secondary flex items-center justify-center h-screen">
            <div className="flex flex-col gap-6 items-center justify-center">
                <img
                    src={assets.error404}
                    className="object-cover w-62.5 sm:w-87.5"
                />
                <div className="flex items-center justify-center gap-4 flex-col">
                    <h2 className="text-2xl sm:text-3xl font-semibold">Page Not Found</h2>
                    <p className="text-[#6B7280] text-base sm:text-xl">The Screen you’re Looking doesn’t Exist</p>
                    <button
                        className="text-white bg-(--primary) w-40 sm:w-44 h-10 rounded-md text-sm sm:text-base"
                        onClick={handleBackHome}
                    >
                        Back To Home Page
                    </button>
                </div>
            </div>
        </div>
    );
}
