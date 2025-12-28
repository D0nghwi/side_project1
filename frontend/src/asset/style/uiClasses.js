export const layout = {
    appRoot: "min-h-screen flex flex-col bg-gray-100",
    bodyRow: "flex flex-1",
    main: "flex-1 p-6 overflow-y-auto",

    row: "flex gap-4 h-full",
    asideW80: "w-80",
};

export const card = {
    base: "bg-white rounded-lg shadow p-4",
    bordered: "border rounded-lg",
    dashed:
        "border border-dashed border-gray-300 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap",
};

export const text = {
    titleLg: "text-2xl font-bold text-gray-800",
    titleXl: "text-3xl font-bold text-gray-800",

    sectionTitle: "text-sm font-semibold text-gray-700",
    descXs: "text-xs text-gray-500 mt-1",

    bodySm: "text-sm text-gray-600",
    mutedXs: "text-xs text-gray-400",

    error: "text-red-500",

    qTitle: "text-lg font-medium text-gray-900",
    bodyWrapSm: "text-sm text-gray-800 whitespace-pre-wrap",
};

export const pill = {
    tag: "text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full",
    known: "px-2 py-1 rounded-full bg-green-100 text-green-700",
    unknown: "px-2 py-1 rounded-full bg-red-100 text-red-700",
};

export const form = {
    label: "block text-sm font-medium text-gray-700 mb-1",
    input:
        "w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
    textarea:
        "w-full border rounded-md px-3 py-2 text-sm h-40 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500",
};

export const alertBox = {
    error:
        "text-sm text-red-500 border border-red-200 bg-red-50 rounded-md px-3 py-2",
};

export const btn = {
    // 링크
    linkGray: "text-sm text-gray-600 hover:underline",
    linkBlue: "text-sm text-blue-600 hover:underline",

    // 버튼
    outlineBase: "px-3 py-1 text-sm rounded-md border",
    outlineBlue: "border-blue-600 text-blue-600 hover:bg-blue-50",
    outlineRed: "border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-60",
    outlineGray: "border text-gray-700 hover:bg-gray-50",

    // Primary
    primarySm: "px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700",
    primaryInline:
        "inline-flex items-center px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700",

    // Form actions
    cancel:
        "px-4 py-2 text-sm border rounded-md text-gray-600 hover:bg-gray-50",
    submit:
        "px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60",
};

export const empty = {
    centerWrap: "h-full flex flex-col items-center justify-center text-center",
};

export const nav = {
    header: "w-full h-14 bg-white shadow flex items-center justify-between px-6",
    brandWrap: "flex items-center gap-2",
    brandTitle: "font-bold text-xl text-blue-600",
    brandSub: "text-sm text-gray-500",
    navWrap: "flex items-center gap-4 text-sm",
    navLink: "text-gray-700 hover:text-blue-600",
};

export const sidebar = {
    aside: "w-56 bg-white border-r border-gray-200 p-4",
    title: "text-xs font-semibold text-gray-500 mb-2",
    nav: "flex flex-col",
    linkBase:
        "block px-4 py-2 rounded-md text-sm font-medium mb-1 transition-colors",
    linkActive: "bg-blue-100 text-blue-700",
    linkInactive: "text-gray-700 hover:bg-gray-100",
};

export const chat = {
    container: "w-80 bg-white rounded-lg shadow p-4 flex flex-col h-full min-h-0",

    headerWrap: "mb-3",
    headerTitle: "text-sm font-semibold text-gray-700",
    headerDesc: "text-xs text-gray-500 mt-1",

    list:
        "flex-1 min-h-0 border border-gray-200 rounded-md p-2 mb-3 overflow-y-auto text-sm bg-gray-50",
    empty: "text-xs text-gray-400",

    rowBase: "mb-2 flex",
    bubbleBase: "max-w-[80%] whitespace-pre-wrap px-3 py-2 rounded-lg text-xs",
    bubbleUser: "bg-blue-600 text-white rounded-br-none",
    bubbleAssistant: "bg-white text-gray-800 border border-gray-200 rounded-bl-none",

    thinking: "text-xs text-gray-500 mt-1",

    errorBox:
        "mb-2 text-xs text-red-500 border border-red-200 bg-red-50 rounded-md px-2 py-1",

    input:
        "w-full border rounded-md px-2 py-1 text-xs resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-500",
    sendWrap: "flex justify-end mt-1",
    sendBtn:
        "px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60",
};

export const pages = {
    notesList: {
        page: "p-4",
        header: "flex items-center justify-between mb-4",
        list: "space-y-3",
        itemLink: "block border rounded-lg p-3 hover:bg-gray-50 cursor-pointer",
        itemTitle: "font-semibold",
        itemContent: "text-sm text-gray-600 mt-1 line-clamp-2",
        tag: "mt-2 flex flex-wrap gap-2",
    },

    noteForm: {
        page: "max-w-3xl mx-auto p-4 space-y-4",
        header: "flex items-center justify-between",
        formCard: "space-y-4",
        actions: "flex justify-end gap-2",
    },

    flash: {
        page: "flex h-full gap-4 p-4",
        mainSection: "flex-1 flex flex-col",
        headerRow: "flex items-center justify-between mb-4",
        headerMeta: "flex items-center gap-3 text-xs text-gray-600",

        bodyCol: "flex-1 flex flex-col",
        qCard: "flex-1 border rounded-lg p-4 mb-4 bg-gray-50 flex flex-col",
        aCard: "border rounded-lg p-4 mb-4 bg-white",
        aHeader: "flex items-center justify-between mb-2",

        bottomRow: "flex items-center justify-between",
        btnGroup: "flex gap-2",
        aside: "w-80 flex flex-col",
        asideList: "flex-1 overflow-y-auto",
        asideUl: "space-y-2",
        itemBtnBase: "w-full text-left px-2 py-2 rounded-md text-xs",
        itemActive: "bg-blue-50 border border-blue-300 text-blue-800",
        itemInactive: "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
        itemTopRow: "flex justify-between mb-1",
        itemId: "font-semibold",
        itemQuestion: "truncate",
        rowBetween: "flex items-center justify-between", 
        rowBetweenMt4: "mt-4 flex items-center justify-between",
        rowGap2: "flex items-center gap-2",                    
        draftCardRow: "flex items-start gap-3",                
        draftCardGrid: "flex-1 grid grid-cols-1 gap-2",
        createGrid: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-3",
        createActions: "md:col-span-2 flex items-end gap-2",
    },
};
