import DataTableDefault from "react-data-table-component";

const DataTable = DataTableDefault.default || DataTableDefault;


export const customStyles = {
    header: {
        style: {
            fontSize: "22px",
            fontWeight: "bold",
            color: "#333",
            padding: "10px",
        },
    },
    title: {
        style: {
            fontSize: "22px",
            fontWeight: "bold",
            color: "#1f2937",
        },
    },
    headRow: {
        style: {
            backgroundColor: "#F0F4FF",
            fontSize: "14px",
            margin: "0 6px"
        },
    },
    headCells: {
        style: {
            color: "#333",
            fontWeight: "600",
        },
    },
    rows: {
        style: {
            fontSize: "14px",
            color: "#111827",
            fontWeight: "400",
            width: "auto",
            '&:hover': {
                backgroundColor: '#f3f4f6',
            },
        },
    },
    pagination: {
        style: {
            borderTop: "1px solid #ccc",
            padding: "10px",
        },
    },
};

const DataTableBase = ({
    columns,
    data,
    title,
    pagination = true,
    paginationPerPage = 10,
    paginationTotalRows,
    onChangePage,
    onChangeRowsPerPage,
    progressPending,
}) => {
    return (
        <DataTable
            title={title}
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination={pagination}
            paginationServer={Boolean(onChangePage)}
            paginationPerPage={paginationPerPage}
            paginationTotalRows={paginationTotalRows}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            // progressPending={isLoading}
            highlightOnHover
            responsive
            progressPending={progressPending}
        />
    );
};

export default DataTableBase;
