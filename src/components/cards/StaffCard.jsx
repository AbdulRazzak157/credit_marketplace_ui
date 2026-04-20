
export default function StaffCard({ label, value, color }) {
    return (
        <div className="flex flex-col max-sm:gap-1 gap-3 text-center w-full max-sm:py-2 font-medium">
            <label className="text-lg xs:text-xl">
                {label}
            </label>
            <p className={`text-2xl xs:text-3xl ${color}`}>
                {value}
            </p>
        </div>
    )
}
