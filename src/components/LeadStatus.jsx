import { Icon } from "@iconify/react";

export const STATUS_COLORS = {
    NEW: { label: 'New', color: '#6B21A8', bg: '#F3E8FF', dot: '#9333EA' },
    IN_REVIEW: { label: 'In Review', color: '#B45309', bg: '#FEF3C7', dot: '#D97706' },
    APPROVED: { label: 'Approved', color: '#0E8A3E', bg: '#E6F4ED', dot: '#12A84C' },
    REJECTED: { label: 'Rejected', color: '#C0280C', bg: '#FEE8E5', dot: '#DC2626' },
    DISBURSED: { label: 'Disbursed', color: '#0E8A3E', bg: '#E6F4ED', dot: '#12A84C' },
};

export function LeadStatus({ status }) {
    const config = STATUS_COLORS[status] ?? STATUS_COLORS.NEW;

    return (
        <span
            className="flex items-center gap-x-1.5 py-1 px-3 rounded-xl w-fit border border-transparent"
            style={{ backgroundColor: config.bg, color: config.color, borderColor: config.color + '60' }}
        >
            <span
                className="min-w-2 min-h-2 rounded-full"
                style={{ backgroundColor: config.dot }}
            />
            <span className="font-semibold text-xs">{config.label}</span>
        </span>
    );
}

const CH_ICON = { WEB: 'vaadin:globe', IN_APP: 'fontisto:mobile', PIC_AGENT: 'mynaui:user-solid', STORE: 'ph:storefront-duotone', REFERRAL: 'streamline-sharp:link-share-2-solid' };
const CH_LABEL = { WEB: 'Web', IN_APP: 'In-App', PIC_AGENT: 'Agent', STORE: 'Store', REFERRAL: 'Referral' };

export function LeadSource({ source }) {

    const label = CH_LABEL[source];
    const icon = CH_ICON['IN_APP'];
    return (
        <span
            className="flex items-center gap-x-1.5 py-1 px-3 rounded-xl w-fit bg-[#E2E8F0] text-[#2D3748]"
        >
            <Icon icon={icon} width={13} height={13} />
            <span className="font-semibold text-xs">{label}</span>
        </span>
    )
}