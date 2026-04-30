const ManageLeadCard = ({ value, label, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200 border border-gray-100">
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
        </div>

        <div className={`p-3 rounded-lg text-white ${bgColor}`}>
          {icon}
        </div>
      </div>

    </div>
  )
}

export default ManageLeadCard