document.getElementById("share-blog").addEventListener("click", function() {
    var blogURL = window.location.href; // Get the current URL of the page
    copyToClipboard(blogURL); // Call function to copy URL to clipboard
});

function copyToClipboard(text) {
    var input = document.createElement("textarea");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);

    var popup = document.getElementById("custom-popup");
    popup.style.display = "block";
    setTimeout(function() {
        popup.style.display = "none";
    }, 2000); // Hide popup after 2 seconds
}