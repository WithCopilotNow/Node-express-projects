export const ROLE = { 
    ADMIN: "admin",
    BASIC: "basic" 
};

export const users = [
    { id: 1, username: "Roshan", role: ROLE.ADMIN},
    { id: 2, username: "Inaho", role: ROLE.BASIC},
    { id: 3, username: "Slaine", role: ROLE.BASIC},
]

export const projects = [
    { id: 1, projectName: "mars rock sample study", userId: 1},
    { id: 2, projectName: "martian rock effects on earth", userId: 2},
    { id: 3, projectName: "mars journey effects on humans", userId: 3},
]