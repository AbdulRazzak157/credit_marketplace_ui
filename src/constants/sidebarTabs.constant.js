
export const sidebarItems = [
    {
        name: "Overview",
        to: "/",
        // icon: "solar:home-2-outline",
        icon: "bitcoin-icons:graph-outline",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Dashboard",
        to: "/dashboard",
        icon: "solar:widget-2-outline",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Sub Admins",
        to: "/sub-admins",
        icon: "solar:users-group-two-rounded-outline",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Lead Management",
        to: "/leads",
        icon: "solar:users-group-rounded-outline",
        // icon: "fa6-solid:users-line",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Manage Lead",
        to: "/manage-leads",
        icon: "solar:user-check-rounded-outline",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Lender Management",
        to: "/lenders",
        icon: "solar:buildings-2-outline",
        // icon: "mdi:bank-outline",
        // icon: "hugeicons:bank",
        // icon: "tabler:building-bank",
        // icon: "ph:bank",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Staff Management",
        to: "/staff",
        icon: "solar:user-id-outline",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Product Management",
        to: "/products",
        icon: "solar:box-outline",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Reports",
        to: "/reports",
        // icon: "solar:chart-outline",
        icon: "lsicon:report-outline",
        iconClass: "w-[24px] h-[24px]",
    },
    {
        name: "Profile / Settings",
        to: "/profile",
        icon: "solar:settings-outline",
        iconClass: "w-[24px] h-[24px]",
    },
];

export const getUserSidebarItems = (userProfile) => {
    if (userProfile?.userRole === "SUB_ADMIN") {
        const tabs = sidebarItems;
        const restrictTabs = ["/staff"];

        const data = tabs.filter((tab) => !restrictTabs.includes(tab.to));
        console.log("data : ", data);
        return data;
    }
    if (userProfile?.userRole === "EXECUTIVE") {
        const tabs = sidebarItems;
        const restrictTabs = ["/staff", "/lenders"];

        return tabs.filter((tab) => !restrictTabs.includes(tab.to));
    }

    return sidebarItems;
}

