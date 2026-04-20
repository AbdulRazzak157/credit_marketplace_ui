import { useAuth } from '../context/AuthContext';
import { getFirebaseErrorMessage } from '../helpers/firebaseErrors';
import { toast } from 'react-toastify';
import { MdOutlineLogout } from 'react-icons/md';

export default function LogoutModal({ setIsLogoutModalOpen }) {

    const { logout, setUserProfile } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            setIsLogoutModalOpen(false);
            setUserProfile(null)
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(getFirebaseErrorMessage(error));
            console.error("Login error:", error.message);
        }
    };

    const handleCancel = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <div className='modal-bg-styles'>
            <div className="rounded-xl bg-white flex flex-col items-center justify-center gap-6 p-8 mx-4 w-112.5">
                <div className="bg-[#CD5858] rounded-full w-15 h-15 grid place-items-center">
                    <MdOutlineLogout className='text-white text-[1.5rem]' />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-[#111827] text-xl md:text-2xl font-semibold">Logout?</h2>
                    <p className="text-[#232323] text-base md:text-lg">Are you sure you want to logout.</p>
                </div>
                <div className="w-full flex items-center justify-end gap-6">
                    <button
                        className="text-base font-medium border border-black/30 rounded-md w-25 md:w-30 h-10"
                        onClick={handleCancel}
                    >
                        No
                    </button>
                    <button
                        className="text-base font-medium bg-[#CD5858] text-white rounded-md w-25 md:w-30 h-10"
                        onClick={handleLogout}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
}
