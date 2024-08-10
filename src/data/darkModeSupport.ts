const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (prefersDarkScheme && window.location.search.includes('darkMode=auto')) {
    document.body.classList.add('darkMode');
} else if (window.location.search.includes('darkMode=true') 
    || window.localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('darkMode');
}

(window as any).enableDarkMode = () => {
    document.body.classList.add('darkMode');
    window.localStorage.setItem('darkMode', 'true');
}

(window as any).disableDarkMode = () => {
    document.body.classList.remove('darkMode');
    window.localStorage.setItem('darkMode', 'false');
}