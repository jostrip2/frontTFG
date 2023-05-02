
function getSessionToken() {
    return sessionStorage.getItem('token')
}

function isAdmin() {
    return sessionStorage.getItem('rol') == 'Administrador'
}

function isAuthenticated() {
    return this.getSessionToken() != null
}

function getLoggedUserId() {
    return sessionStorage.getItem('userId')
}

export default {
    getSessionToken,
    isAdmin,
    isAuthenticated,
    getLoggedUserId
}