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
        dataIndex: "partyName",
        key: "customerName",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    },
    {
        title: "End User Tags",
        dataIndex: "endUserTags",
        key: "endUserTags",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
    }
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
