// import React from 'react'

// const ProfileSetting = () => {
//   return (
//     <div>ProfileSetting</div>
//   )
// }

// export default ProfileSetting

// import React, { useState } from 'react'
// import {
//   User, Mail, Phone, KeyRound, Clock,
//   CalendarDays, X, Eye, EyeOff,
// } from 'lucide-react'

// // ─── Sample Data (replace with your API / props) ────────────────────────────
// const profileData = {
//   name: 'MD Mustaq Ahmed',
//   initials: 'MM',
//   role: 'ADMIN',
//   staffId: 'AD0000001',
//   email: 'mustaqahmed@skygoalnext.com',
//   phone: '+918867322632',
//   lastLogin: '05/05/2026  10:05 AM',
//   createdOn: '17/12/2025',
// }

// // ─── Password Strength Bar ───────────────────────────────────────────────────
// const StrengthBar = ({ password }) => {
//   const getScore = (pw) => {
//     let score = 0
//     if (pw.length >= 8) score++
//     if (/[A-Z]/.test(pw)) score++
//     if (/[0-9]/.test(pw)) score++
//     if (/[^A-Za-z0-9]/.test(pw)) score++
//     return score
//   }

//   const score = getScore(password)
//   const colors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-400', 'bg-yellow-500', 'bg-green-500']
//   const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
//   const labelColors = ['', 'text-red-500', 'text-yellow-500', 'text-yellow-600', 'text-green-600']

//   if (!password) return null

//   return (
//     <div className="mt-2">
//       <div className="flex gap-1">
//         {[1, 2, 3, 4].map((i) => (
//           <div
//             key={i}
//             className={`flex-1 h-1 rounded-full transition-all duration-300 ${
//               i <= score ? colors[score] : 'bg-gray-200'
//             }`}
//           />
//         ))}
//       </div>
//       <p className={`text-xs mt-1 ${labelColors[score]}`}>{labels[score]}</p>
//     </div>
//   )
// }

// // ─── Password Input with Show/Hide ──────────────────────────────────────────
// const PasswordInput = ({ label, value, onChange, placeholder }) => {
//   const [show, setShow] = useState(false)
//   return (
//     <div className="mb-4">
//       <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
//       <div className="relative">
//         <input
//           type={show ? 'text' : 'password'}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="w-full h-10 border border-gray-200 rounded-lg px-3 pr-10 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
//         />
//         <button
//           type="button"
//           onClick={() => setShow(!show)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//         >
//           {show ? <EyeOff size={15} /> : <Eye size={15} />}
//         </button>
//       </div>
//     </div>
//   )
// }

// // ─── Change Password Modal ───────────────────────────────────────────────────
// const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
//   const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
//   const [error, setError] = useState('')

//   const handleSubmit = () => {
//     setError('')
//     if (!form.current || !form.newPw || !form.confirm) {
//       setError('Please fill in all fields.')
//       return
//     }
//     if (form.newPw.length < 8) {
//       setError('New password must be at least 8 characters.')
//       return
//     }
//     if (form.newPw !== form.confirm) {
//       setError('Passwords do not match.')
//       return
//     }
//     setForm({ current: '', newPw: '', confirm: '' })
//     onSuccess('Password updated successfully!')
//     onClose()
//   }

//   const handleClose = () => {
//     setForm({ current: '', newPw: '', confirm: '' })
//     setError('')
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
//       onClick={(e) => e.target === e.currentTarget && handleClose()}
//     >
//       <div className="bg-white rounded-xl shadow-xl w-[400px] max-w-[95vw] p-7">
//         {/* Modal Header */}
//         <div className="flex items-start justify-between mb-1">
//           <div>
//             <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
//             <p className="text-xs text-gray-500 mt-0.5">Update your account password below</p>
//           </div>
//           <button
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="border-t border-gray-100 mt-4 pt-4">
//           <PasswordInput
//             label="Current Password"
//             value={form.current}
//             onChange={(e) => setForm({ ...form, current: e.target.value })}
//             placeholder="Enter current password"
//           />

//           {/* New Password + Strength */}
//           <div className="mb-4">
//             <label className="block text-xs text-gray-500 mb-1.5">New Password</label>
//             <input
//               type="password"
//               value={form.newPw}
//               onChange={(e) => setForm({ ...form, newPw: e.target.value })}
//               placeholder="Enter new password"
//               className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
//             />
//             <StrengthBar password={form.newPw} />
//           </div>

//           <PasswordInput
//             label="Confirm New Password"
//             value={form.confirm}
//             onChange={(e) => setForm({ ...form, confirm: e.target.value })}
//             placeholder="Confirm new password"
//           />

//           {error && (
//             <p className="text-xs text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
//           )}

//           {/* Actions */}
//           <div className="flex gap-2 justify-end mt-2">
//             <button
//               onClick={handleClose}
//               className="h-9 px-4 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="h-9 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//             >
//               Update Password
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Info Cell ───────────────────────────────────────────────────────────────
// const InfoCell = ({ icon: Icon, label, value, isLink, onLinkClick }) => (
//   <div className="flex items-start gap-3 p-4 border-b border-r border-gray-100 last:border-r-0">
//     <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
//       <Icon size={16} className="text-gray-500" />
//     </div>
//     <div className="min-w-0">
//       <p className="text-xs text-gray-400 mb-0.5">{label}</p>
//       {isLink ? (
//         <button
//           onClick={onLinkClick}
//           className="text-sm font-medium text-blue-600 hover:underline underline-offset-2 transition-colors"
//         >
//           {value}
//         </button>
//       ) : (
//         <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
//       )}
//     </div>
//   </div>
// )

// // ─── Toast ───────────────────────────────────────────────────────────────────
// const Toast = ({ message }) => {
//   if (!message) return null
//   return (
//     <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg shadow-lg">
//       {message}
//     </div>
//   )
// }

// // ─── Main Component ──────────────────────────────────────────────────────────
// const ProfileSetting = () => {
//   const [modalOpen, setModalOpen] = useState(false)
//   const [toast, setToast] = useState('')

//   const showToast = (msg) => {
//     setToast(msg)
//     setTimeout(() => setToast(''), 2500)
//   }

//   return (
//     <>
//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
//         <p className="text-sm text-gray-400 mt-0.5">Manage your account and preferences</p>
//       </div>

//       {/* Profile Card */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

//         {/* Avatar + Name + Role */}
//         <div className="flex items-center gap-5 px-8 py-6 border-b border-gray-100">
//           <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
//             {profileData.initials}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800">{profileData.name}</h2>
//             <span className="inline-block mt-1.5 text-xs font-semibold bg-blue-600 text-white px-3 py-0.5 rounded tracking-wider">
//               {profileData.role}
//             </span>
//           </div>
//         </div>

//         {/* Info Grid — 3 cols × 2 rows */}
//         <div className="grid grid-cols-3">
//           <InfoCell icon={User}        label="Staff ID"                value={profileData.staffId} />
//           <InfoCell icon={Mail}        label="Email Address"           value={profileData.email} />
//           <InfoCell icon={Phone}       label="Phone Number"            value={profileData.phone} />
//           <InfoCell icon={KeyRound}    label="Change password"         value="Edit Here" isLink onLinkClick={() => setModalOpen(true)} />
//           <InfoCell icon={Clock}       label="Last login date and time" value={profileData.lastLogin} />
//           <InfoCell icon={CalendarDays} label="Account Created On"    value={profileData.createdOn} />
//         </div>
//       </div>

//       {/* Change Password Modal */}
//       <ChangePasswordModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSuccess={showToast}
//       />

//       {/* Toast Notification */}
//       <Toast message={toast} />
//     </>
//   )
// }

// export default ProfileSetting


import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import {
  User, Mail, Phone, KeyRound, Clock,
  CalendarDays, X, Eye, EyeOff,
} from 'lucide-react'

// ─── API URL (update to match your project's API_URL config) ─────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const PROFILE_API = `${BASE_URL}/api/v1/users/profile`

// ─── Helper: get initials from full name ─────────────────────────────────────
const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

// ─── Helper: format date string ──────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB').replace(/\//g, '/')
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

const ProfileSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="flex items-center gap-5 px-8 py-6 border-b border-gray-100">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-44 h-5" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
    <div className="grid grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4 border-b border-r border-gray-100">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ─── Password Strength Bar ───────────────────────────────────────────────────
const StrengthBar = ({ password }) => {
  const getScore = (pw) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }
  const score = getScore(password)
  const colors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-400', 'bg-yellow-500', 'bg-green-500']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const labelColors = ['', 'text-red-500', 'text-yellow-500', 'text-yellow-600', 'text-green-600']
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1 ${labelColors[score]}`}>{labels[score]}</p>
    </div>
  )
}

// ─── Password Input with Show/Hide ──────────────────────────────────────────
const PasswordInput = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-10 border border-gray-200 rounded-lg px-3 pr-10 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  )
}

// ─── Change Password Modal ───────────────────────────────────────────────────
const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!form.current || !form.newPw || !form.confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (form.newPw.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (form.newPw !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setForm({ current: '', newPw: '', confirm: '' })
    onSuccess('Password updated successfully!')
    onClose()
  }

  const handleClose = () => {
    setForm({ current: '', newPw: '', confirm: '' })
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-[400px] max-w-[95vw] p-7">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update your account password below</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
            <X size={18} />
          </button>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <PasswordInput
            label="Current Password"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
            placeholder="Enter current password"
          />
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1.5">New Password</label>
            <input
              type="password"
              value={form.newPw}
              onChange={(e) => setForm({ ...form, newPw: e.target.value })}
              placeholder="Enter new password"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            <StrengthBar password={form.newPw} />
          </div>
          <PasswordInput
            label="Confirm New Password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Confirm new password"
          />

          {error && (
            <p className="text-xs text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={handleClose}
              className="h-9 px-4 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-9 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Info Cell ───────────────────────────────────────────────────────────────
const InfoCell = ({ icon: Icon, label, value, isLink, onLinkClick }) => (
  <div className="flex items-start gap-3 p-4 border-b border-r border-gray-100 last:border-r-0">
    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-gray-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      {isLink ? (
        <button
          onClick={onLinkClick}
          className="text-sm font-medium text-blue-600 hover:underline underline-offset-2 transition-colors"
        >
          {value}
        </button>
      ) : (
        <p className="text-sm font-medium text-gray-800 truncate">{value || '—'}</p>
      )}
    </div>
  </div>
)

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message }) => {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg shadow-lg">
      {message}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
const ProfileSetting = () => {
  const { getAccessToken } = useAuth()
  const mainRef = useOutletContext()

  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')

  // Scroll to top on mount
  useEffect(() => {
    if (mainRef?.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ─── Fetch Profile ────────────────────────────────────────────────────────
  const getUserProfile = async () => {
    const token = await getAccessToken()

    const response = await fetch(PROFILE_API, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorResult = await response.json()
      throw new Error(errorResult?.message || 'Failed to fetch profile')
    }

    const result = await response.json()
    console.log('Profile API response:', result.response)

    const user = result.response

    return {
      name:      user?.name       || '',
      initials:  getInitials(user?.name),
      role:      user?.role       || '',
      staffId:   user?.staffId    || '',
      email:     user?.email      || '',
      phone:     user?.mobileNumber || user?.phone || '',
      lastLogin: formatDateTime(user?.lastLogin   || user?.lastLoginAt),
      createdOn: formatDate(user?.createdAt),
    }
  }

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  })

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Loading */}
      {isLoading && <ProfileSkeleton />}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 text-sm text-red-600">
          Failed to load profile: {error?.message || 'Something went wrong.'}
        </div>
      )}

      {/* Profile Card */}
      {!isLoading && !isError && profile && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Avatar + Name + Role */}
          <div className="flex items-center gap-5 px-8 py-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
              {profile.initials}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{profile.name}</h2>
              {profile.role && (
                <span className="inline-block mt-1.5 text-xs font-semibold bg-blue-600 text-white px-3 py-0.5 rounded tracking-wider">
                  {profile.role.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Info Grid — 3 cols × 2 rows */}
          <div className="grid grid-cols-3">
            <InfoCell icon={User}         label="Staff ID"                 value={profile.staffId} />
            <InfoCell icon={Mail}         label="Email Address"            value={profile.email} />
            <InfoCell icon={Phone}        label="Phone Number"             value={profile.phone} />
            <InfoCell icon={KeyRound}     label="Change password"          value="Edit Here" isLink onLinkClick={() => setModalOpen(true)} />
            <InfoCell icon={Clock}        label="Last login date and time" value={profile.lastLogin} />
            <InfoCell icon={CalendarDays} label="Account Created On"       value={profile.createdOn} />
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={showToast}
      />

      {/* Toast */}
      <Toast message={toast} />
    </>
  )
}

export default ProfileSetting