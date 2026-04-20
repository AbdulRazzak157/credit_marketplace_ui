import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";

export default function NavigationHeadline({ content, to }) {
    const navigate = useNavigate();
    return (
        <button className="w-fit flex items-center gap-2" onClick={() => navigate(to)} >
            <Icon icon="ion:chevron-back"
                className="text-2xl xs:text-3xl cursor-pointer" />
            <h1 className="text-2xl xs:text-2xl font-semibold">
                {content}
            </h1>
        </button>
    )
}