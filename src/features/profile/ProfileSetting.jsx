import React, { useState } from 'react'
import {
  User, Mail, Phone, KeyRound, Clock,
  CalendarDays, X, Eye, EyeOff,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import moment from 'moment/moment'
import API_URL from '../../api/apiConfig'
import { toast } from 'react-toastify'
import { set } from 'react-hook-form'

// ─── Sample Data (replace with your API / props) ────────────────────────────
const profileData = {
  name: 'MD Mustaq Ahmed',
  initials: 'MM',
  role: 'ADMIN',
  staffId: 'AD0000001',
  email: 'mustaqahmed@skygoalnext.com',
  phone: '+918867322632',
  lastLogin: '05/05/2026  10:05 AM',
  createdOn: '17/12/2025',
}

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
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-gray-200'
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
          autoComplete="new-password"
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
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getAccessToken, logout } = useAuth();

  const handleSubmit = async () => {
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
    setIsSubmitting(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate API delay

      const token = await getAccessToken();
      const response = await fetch(`${API_URL.profile.updateUserPassword}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.newPw
        })
      });
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult?.message);
      }
      const result = await response.json();
      // console.log("Result from Update Password API: ", result);
      if (result?.response?.email) {
        await logout()
        toast.success("Password updated. Please login with new password.");
      }
      // toast.success("Password updated. Please login with new password.");
    } catch (error) {
      console.log("Error in Change Password : ", error?.message);
    }
    setIsSubmitting(false);
    setForm({ current: '', newPw: '', confirm: '' })
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
      <div className="bg-white rounded-xl shadow-xl w-100 max-w-[95vw] p-7">
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update your account password below</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="border-t border-gray-100 mt-4 pt-4">
          <PasswordInput
            label="Current Password"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
            placeholder="Enter current password"
          />

          {/* New Password + Strength */}
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

          {/* Actions */}
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={handleClose}
              className="h-9 px-4 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {
              isSubmitting ? (
                <button
                  disabled
                  className="min-w-40 cursor-not-allowed h-9 px-4 rounded-lg text-sm font-medium bg-gray-200 text-gray-500 transition-colors"
                >
                  Updating...
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="min-w-40 h-9 px-4 rounded-lg text-sm font-medium bg-(--primary) text-white hover:bg-black transition-colors"
                >
                  Update Password
                </button>
              )
            }
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
        <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
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
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const { getAccessToken, userProfile } = useAuth();

  const userRole = {
    ADMIN: "ADMIN",
    SUB_ADMIN: "SUB ADMIN",
    EXECUTIVE: "STAFF"
  }
  function nameTagInitials(name) {
    let initials = "";
    name?.split(" ")?.forEach((str) => {
      initials += str[0];
    });

    return initials?.slice(0, 2)?.toUpperCase();
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        {/* Avatar + Name + Role */}
        <div className="flex items-center gap-5 px-8 py-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-(--primary) text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
            {nameTagInitials(userProfile?.userName)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{userProfile.userName}</h2>
            <span className="inline-block mt-1.5 text-xs font-semibold bg-(--primary) text-white px-3 py-1 rounded tracking-wider">
              {userRole[userProfile.userRole]}
            </span>
          </div>
        </div>

        {/* Info Grid — 3 cols × 2 rows */}
        <div className="grid grid-cols-3">
          <InfoCell icon={User} label="User ID" value={userProfile.userCustomId} />
          <InfoCell icon={Mail} label="Email Address" value={userProfile.userEmail} />
          <InfoCell icon={Phone} label="Phone Number" value={userProfile.userMobile} />
          <InfoCell icon={KeyRound} label="Change password" value="Edit Here" isLink onLinkClick={() => setModalOpen(true)} />
          {/* <InfoCell icon={Clock}       label="Last login date and time" value={profileData.lastLogin} /> */}
          <InfoCell icon={CalendarDays} label="Account Created On" value={moment(userProfile.createdAt || new Date()).format("DD/MM/YYYY HH:MM A")} />
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={showToast}
      />

      {/* Toast Notification */}
      <Toast message={toast} />
    </>
  )
}

export default ProfileSetting