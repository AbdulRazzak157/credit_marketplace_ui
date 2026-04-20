export const reactSelectCustomStyles = {
    groupHeading: (base) => ({
        ...base,
        backgroundColor: '#2A2443',
        padding: '6px 10px',
        margin: 0,
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        // width: '100%',
        boxSizing: 'border-box'
    }),
    control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ? '#d1d5db  ' : '#d1d5db ',
        boxShadow: state.isFocused ? 'none' : 'none',
        '&:hover': {
            borderColor: 'none',
        },
        fontSize: '14px',
        padding: "2px 4px",
        color: 'black',
        borderRadius: '6px',
    }),
    singleValue: (base) => ({
        ...base,
        color: 'black', // selected value text color
        fontWeight: 500
    }),
    input: (base) => ({
        ...base,
        color: 'black', // input text color
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9CA3AF',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#2A2443'
            : state.isFocused
                ? '#DBEAFE'
                : 'white',
        color: state.isSelected ? 'white' : 'black',
        fontSize: '14px',
        margin: "4px 0",
        cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
};