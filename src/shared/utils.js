export const STATUS_COLORS = {
    NEW: { bg: '#F1EFE8', text: '#444441', border: '#B4B2A9' },
    IN_REVIEW: { bg: '#E6F1FB', text: '#0C447C', border: '#85B7EB' },
    APPROVED: { bg: '#EAF3DE', text: '#27500A', border: '#97C459' },
    REJECTED: { bg: '#FCEBEB', text: '#791F1F', border: '#F09595' },
    DISBURSED: { bg: '#EEEDFE', text: '#3C3489', border: '#AFA9EC' },
}

export const timeAgo = (date) => {
    if (!date) return '—'

    const now = new Date()
    const past = new Date(date)
    const seconds = Math.floor((now - past) / 1000)

    if (seconds < 60) return 'Just now'

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    if (days === 1) return 'Yesterday'
    if (days < 15) return `${days}d ago`

    const dd = String(past.getDate()).padStart(2, '0')
    const mo = String(past.getMonth() + 1).padStart(2, '0')
    const yy = past.getFullYear()

    const rawHours = past.getHours()
    const mm = String(past.getMinutes()).padStart(2, '0')
    const ampm = rawHours >= 12 ? 'PM' : 'AM'
    const hh = String(rawHours % 12 || 12).padStart(2, '0')

    return `${dd}/${mo}/${yy} ${hh}:${mm} ${ampm}`
}
export const getBureauScoreColor = (score) => {
    if (!score) return { dot: '#B4B2A9', text: '#444441', label: '—' }

    if (score >= 750) return { dot: '#639922', text: '#27500A', label: 'Excellent' }
    if (score >= 700) return { dot: '#1D9E75', text: '#085041', label: 'Good' }
    if (score >= 650) return { dot: '#BA7517', text: '#633806', label: 'Fair' }
    if (score >= 600) return { dot: '#D85A30', text: '#712B13', label: 'Poor' }
    return { dot: '#E24B4A', text: '#791F1F', label: 'Very Poor' }
}
