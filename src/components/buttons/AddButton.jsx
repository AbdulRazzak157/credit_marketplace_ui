import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

export default function AddButton({ icon, content, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 bg-(--primary) text-white px-3 xs:px-4 py-2 rounded-md">
      <Icon icon={icon} className="text-xl xs:text-2xl" />
      <span className="font-medium text-sm xs:text-lg">{content}</span>
    </Link>
  )
}
