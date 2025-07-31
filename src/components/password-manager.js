// Password-protected app access
export class AppPasswordManager {
    static enablePasswordProtection(linkId, password, redirectUrl, promptText) {
        const link = document.getElementById(linkId);
        if (!link) return;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const userPassword = prompt(promptText);
            if (userPassword === password) {
                link.style.opacity = '1';
                link.style.cursor = 'pointer';
                link.classList.remove('btn-locked');
                window.location.href = redirectUrl;
            } else if (userPassword !== null) {
                alert('Feil passord');
            }
        });
    }
}