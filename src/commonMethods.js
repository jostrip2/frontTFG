
function getSessionToken() {
    return sessionStorage.getItem('token')
}

function isAdmin() {
    return sessionStorage.getItem('rol') == 'Administrador'
}

function isFisio() {
    return sessionStorage.getItem('rol') == 'Fisioterapeuta'
}

function isClient() {
    return sessionStorage.getItem('rol') == 'Client'
}

function isAuthenticated() {
    return this.getSessionToken() != null
}

function getLoggedUserId() {
    return sessionStorage.getItem('userId')
}

function getLoggedUsername() {
    return sessionStorage.getItem('username')
}

function getUserFisio() {
    return JSON.parse(sessionStorage.getItem('fisio'))
}

export default {
    getSessionToken,
    isAdmin,
    isAuthenticated,
    getLoggedUserId,
    getLoggedUsername,
    getUserFisio,
    isFisio,
    isClient
}