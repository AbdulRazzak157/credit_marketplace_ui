import { Icon } from "@iconify/react/dist/iconify.js";

export default function ActionButton({ type = "view", onClick }) {

  const config = {
    view: {
      icon: 'hugeicons:view',
      color: 'text-blue-500 hover:bg-blue-100 border-blue-500',
      label: 'View',
    },
    edit: {
      icon: 'akar-icons:edit',
      color: 'text-yellow-500 hover:bg-yellow-100 border-yellow-500',
      label: 'Edit',
    },
    delete: {
      icon: 'fluent:delete-32-regular',
      color: 'text-red-600 hover:bg-red-100 border-red-600',
      label: 'Delete',
    },
  };

  const { icon, color, label } = config[type] || config.view;

  return (
    <button
      onClick={onClick}
      type="button"
      title={label}
      className={`p-1 rounded-[4px] transition-colors duration-150 border ${color}`}
    >
      <Icon icon={icon} className="text-xl" />
    </button>
  );
}
