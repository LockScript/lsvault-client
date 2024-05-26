export function isAuthenticated() {
    const vaultKey = window.sessionStorage.getItem("vk");
    return vaultKey !== null;
}