import { Icon } from "@iconify/react";
import { useState } from "react";
import CustomThreeDotsLoader from "../shared/CustomThreeDotsLoader";

export default function DeleteAlertModal({ setIsDeleteModalOpen, deletableId, setDeletableId, mainText, subText, handleConfirmDeleteRecord }) {

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setIsDeleteModalOpen(false);
        setDeletableId("");
    };

    const handleDeleteRecord = async () => {
        try {
            setIsLoading(true);
            await handleConfirmDeleteRecord(deletableId);
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setDeletableId("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='modal-bg-styles'>
            <div className="rounded-xl bg-white flex flex-col items-center justify-center gap-6 p-8 mx-4">
                <div className="bg-[#CD585826]/15 rounded-full w-[70px] h-[70px] grid place-items-center">
                    <div className="bg-[#EF44442E] rounded-full w-[50px] h-[50px] grid place-items-center">
                        <Icon
                            icon="fluent:delete-24-regular"
                            className="text-[#CD5858] text-[1.4rem]"
                        />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-[#111827] text-xl md:text-2xl font-semibold">{mainText}</h2>
                    <p className="text-[#232323] text-base md:text-lg">{subText}</p>
                </div>
                <div className="w-full flex items-center justify-end gap-6">
                    <button
                        className="text-base font-medium border border-black/30 rounded-md w-[100px] md:w-[120px] h-[40px]"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    {isLoading ?
                        <CustomThreeDotsLoader color="red" />
                        :
                        <button
                            className="text-base font-medium bg-[#CD5858] text-white rounded-md w-[100px] md:w-[120px] h-[40px]"
                            onClick={handleDeleteRecord}
                        >
                            Delete
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}
