export function formatDate(dateString) {
    if (!dateString) {
        return null;
    }

    var date = new Date(dateString);
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
}

export function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getUrlParameter(parameter) {
    var params = window.location.search.substr(1).split('&');

    for (var i = 0; i < params.length; i++) {
        var p = params[i].split('=');
        if (p[0] == parameter) {
            return decodeURIComponent(p[1]);
        }
    }
    return null;
}