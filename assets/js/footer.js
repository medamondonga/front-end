export function loadFooter() {
    fetch('/components/footer.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('footer').innerHTML = html;
        });
}