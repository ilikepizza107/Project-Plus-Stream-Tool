export const teams = [];

/** Resets team names */
export function clearTeams() {
    for (let i = 0; i < teams.length; i++) {
        teams[i].setNames("");
    }
}