interface InterAPISERVICEENUM  {
    [key: string]: any
}
export enum APIENUM {
    NEST = 'NEST',
}

type InterAPISERVICEENUMS = {
    [k in APIENUM]: string | undefined
}

export const API_ENUM_SERVICE: InterAPISERVICEENUMS = {
    NEST: import.meta.env.VITE_APP_BASE_API,
}
export const API_SERVICE_ENUM: InterAPISERVICEENUM = {
    NEST: import.meta.env.VITE_APP_BASE_API,
}