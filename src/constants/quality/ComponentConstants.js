export const STAGES = [
    { value: "INWARD", label: "Inward" },
    { value: "PRE_PROCESSING", label: "Pre Processing" },
    { value: "PROCESSING", label: "Processing" },
    { value: "PRE_DISPATCH", label: "Pre Dispatch" },
    { value: "POST_DISPATCH", label: "Post Dispatch" },

]

export const PROCESSES = [
    { value: "SLITTING", label: "Slitting" },
    { value: "CUTTING", label: "Cutting" },
    { value: "SLIT_CUT", label: "Slit & Cut" },

]

export const QUALITY_TEMPLATE_ACTIONS = {
    "print": { label: "quality.templates.button.action.print.label" },
    "export": { label: "quality.templates.button.action.export.label" },
    "create": { label: "quality.templates.button.action.create.label" },
    "search": { label: "quality.templates.input.action.search.label", placeholder: "quality.templates.input.action.search.placeholder" }
}

export const QUALITY_TEMPLATE_COLUMNS = [
    {
        title: "Template ID",
        dataIndex: "templateId",
        key: "templateId",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    },
    {
        title: "Template Name",
        dataIndex: "templateName",
        key: "templateName",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    },
    {
        title: "Stage Name",
        dataIndex: "stageName",
        key: "stageName",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    },
]

export const QUALITY_LINKED_TEMPLATE_COLUMNS = [
    {
        title: "Template ID",
        dataIndex: "templateId",
        key: "templateId",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    },
    {
        title: "Template Name",
        dataIndex: "templateName",
        key: "templateName",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    },
    {
        title: "Stage Name",
        dataIndex: "stageName",
        key: "stageName",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    },
    {
        title: "Customer Name", 
        dataIndex: "parties",
        key: "parties",
        render: (parties) => parties.join(', ')
    },
    // {
    //     title: "End User Tags",
    //     dataIndex: "endUserTags",
    //     key: "endUserTags",
    //     filters: [],
    //     sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    // }
]

export const QUALITY_REPORT_CREATE_COLUMNS = [
    {
        title: "Coil No.",
        dataIndex: "coilNo",
        key: "coilNo",
    },
    {
        title: "Customer Name",
        dataIndex: "party.partyName",
        key: "party.partyName",
    },
    {
        title: "Thickness",
        dataIndex: "fthickness",
        key: "fthickness",
    },
    {
        title: "Width",
        dataIndex: "fWidth",
        key: "fWidth",
    },
    {
        title: "Material Desc",
        dataIndex: "material.description",
        key: "material.description",
    },
    {
        title: "Material Grade",
        dataIndex: "materialGrade",
        key: "materialGrade",
    },
    {
        title: "Net Weight",
        dataIndex: "targetWeight",
        key: "targetWeight",
    },
]

export const QUALITY_REPORT_INWARD_COLUMNS = [
    {
        title: "Coil Number",
        dataIndex: "coilNumber",
        key: "coilNumber",
        filters: [],
        sorter: (a, b) => a.coilNumber.length - b.coilNumber.length
        // sortOrder: sortedInfo.columnKey === "coilNumber" && sortedInfo.order,
    },
    {
        title: "Batch No",
        dataIndex: "batchNumber",
        key: "batchNumber",
        // filteredValue: filteredInfo ? filteredInfo["batchNumber"] : null,
        onFilter: (value, record) => record.batchNumber == value,
        // filters:
        //     props.inward.inwardList.length > 0
        //         ? [
        //             ...new Set(
        //                 props.inward.inwardList.map((item) => item.batchNumber)
        //             ),
        //         ].map((partyName) => ({ text: partyName, value: partyName }))
        //         : [],
        sorter: (a, b) => a.batchNumber.length - b.batchNumber.length,
        // sortOrder: sortedInfo.columnKey === "batchNumber" && sortedInfo.order,
    },
    {
        title: "Inward Date",
        dataIndex: "dReceivedDate",
        // render(value) {
        //     return moment(value).format("Do MMM YYYY");
        // },
        key: "dReceivedDate",
        filters: [],
        sorter: (a, b) => a.dReceivedDate - b.dReceivedDate,
        // sortOrder: sortedInfo.columnKey === "dReceivedDate" && sortedInfo.order,
    },
    {
        title: "Material",
        dataIndex: "material.description",
        key: "material.description",
        // filteredValue: filteredInfo ? filteredInfo["material.description"] : null,
        onFilter: (value, record) => record.material.description == value,
        // filters:
            // props.inward.inwardList.length > 0
            //     ? [
            //         ...new Set(
            //             props.inward.inwardList.map((item) => item.material.description)
            //         ),
            //     ].map((material) => ({ text: material, value: material }))
            //     : [],
        sorter: (a, b) =>
            a.material.description.length - b.material.description.length,
        // sortOrder:
        //     sortedInfo.columnKey === "material.description" && sortedInfo.order,
    },
    {
        title: "Status",
        dataIndex: "status.statusName",
        key: "status.statusName",
        filters: [],
        sorter: (a, b) => a.status.statusName.length - b.status.statusName.length,
        // sortOrder:
        //     sortedInfo.columnKey === "status.statusName" && sortedInfo.order,
    },
    {
        title: "Thickness",
        dataIndex: "fThickness",
        key: "fThickness",
        filters: [],
        sorter: (a, b) => a.fThickness - b.fThickness,
        // sortOrder: sortedInfo.columnKey === "fThickness" && sortedInfo.order,
    },
    {
        title: "Weight",
        dataIndex: "fQuantity",
        key: "fQuantity",
        filters: [],
        sorter: (a, b) => a.fQuantity - b.fQuantity,
        // sortOrder: sortedInfo.columnKey === "fQuantity" && sortedInfo.order,
    },
     
]

export const KQP_COLUMNS = [
    {
        title: "KQP ID",
        dataIndex: "kqpId",
        key: "kqpId",
        filters: [],
        sorter: (a, b) => a.kqpId.length - b.kqpId.length,
    },
    {
        title: "KQP Name",
        dataIndex: "kqpName",
        key: "kqpName",
        onFilter: (value, record) => record.kqpName == value,
        sorter: (a, b) => a.kqpName.length - b.kqpName.length,
    },
    {
        title: "Stage Name",
        dataIndex: "stageName",
        key: "stageName",
        filters: [],
        sorter: (a, b) => a.stageName - b.stageName,
    },
    
]

export const KQP_LINK_COLUMNS = [
    {
        title: "KQP ID",
        dataIndex: "kqpId",
        key: "kqpId",
        filters: [],
        sorter: (a, b) => a.kqpId.length - b.kqpId.length,
    },
    {
        title: "KQP Name",
        dataIndex: "kqpName",
        key: "kqpName",
        onFilter: (value, record) => record.kqpName == value,
        sorter: (a, b) => a.kqpName.length - b.kqpName.length,
    },
    {
        title: "Stage Name",
        dataIndex: "stageName",
        key: "stageName",
        filters: [],
        sorter: (a, b) => a.stageName - b.stageName,
    },
    {
        title: "Customer Name",
        dataIndex: "parties",
        key: "parties",
        render: (parties) => parties.join(', '),
        // onFilter: (value, record) => record.partyName == value,
        // sorter: (a, b) => a.partyName.length - b.partyName.length,
    },
    
]

export const QUALITY_LINKED_TEMPLATE_ACTIONS = {
    "print": { label: "quality.templates.button.action.print.label" },
    "export": { label: "quality.templates.button.action.export.label" },
    "search": { label: "quality.templates.input.action.search.label", placeholder: "quality.templates.input.action.search.placeholder" }
}

export const QUALITY_REPORT_ACTIONS = {
    "print": { label: "quality.templates.button.action.print.label" },
    "export": { label: "quality.templates.button.action.export.label" },
    "select": { label: "quality.templates.input.action.search.label", placeholder: "quality.templates.input.action.search.placeholder" },
    "search": { label: "quality.templates.input.action.search.label", placeholder: "quality.templates.input.action.search.placeholder" }
}

export const QUALITY_KQP_ACTIONS = {
    "print": { label: "quality.templates.button.action.print.label" },
    "export": { label: "quality.templates.button.action.export.label" },
    "create": { label: "quality.templates.button.action.create.label" },
    "search": { label: "quality.templates.input.action.search.label", placeholder: "quality.templates.input.action.search.placeholder" }
}

export const QUALITY_LINKED_KQP_ACTIONS = {
    "print": { label: "quality.templates.button.action.print.label" },
    "export": { label: "quality.templates.button.action.export.label" },
    "create": { label: "quality.templates.button.action.create.label" },
    "search": { label: "quality.templates.input.action.search.label", placeholder: "quality.templates.input.action.search.placeholder" }
}
