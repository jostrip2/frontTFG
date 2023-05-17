
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

function getUserFisio() {
    return JSON.parse(sessionStorage.getItem('fisio'))
}

export default {
    getSessionToken,
    isAdmin,
    isAuthenticated,
    getLoggedUserId,
    getUserFisio
}