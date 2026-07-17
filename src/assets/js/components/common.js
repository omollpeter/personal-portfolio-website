export function hideLoader() {
    const loader = document.getElementById("loader");

    if (loader && !loader.classList.contains("fade-out")) {
        loader.classList.add("fade-out");
    }
}