
function sessionToken() {
    return sessionStorage.getItem('token')
}

function isAdmin() {
    return sessionStorage.getItem('rol') == 'Administrador'
}

function isAuthenticated() {
    return this.sessionToken() != null
}

export default {
    sessionToken,
    isAdmin,
    isAuthenticated
}