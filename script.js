const urlInput = document.getElementById("urlInput");
const shortenBtn = document.getElementById("shortenBtn");
const errorMessage = document.getElementById("errorMessage");
const result = document.getElementById("result");
const shortUrl = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");
const history = document.getElementById("history");

function loadHistory() {

    const savedHistory = JSON.parse(
        localStorage.getItem("shortenedUrls")
    ) || [];

    history.innerHTML = "";

    savedHistory.forEach(function (item) {

        const div = document.createElement("div");

        div.className = "history-item";

        div.innerHTML = `
            <p><strong>Original:</strong> ${item.original}</p>
            <p>
                <strong>Short:</strong>
                <a href="${item.short}" target="_blank">
                    ${item.short}
                </a>
            </p>
        `;

        history.appendChild(div);
    });
}

function isValidURL(url) {

    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

shortenBtn.addEventListener("click", async function () {

    const url = urlInput.value.trim();

    errorMessage.textContent = "";
    result.style.display = "none";

    if (url === "") {

        errorMessage.textContent =
            "Please enter a URL.";

        return;
    }

    if (!isValidURL(url)) {

        errorMessage.textContent =
            "Please enter a valid URL.";

        return;
    }


    shortenBtn.disabled = true;
    shortenBtn.textContent = "Shortening...";


    try {

        const apiUrl =
            "https://is.gd/create.php?format=json&url=" +
            encodeURIComponent(url);


        const response = await fetch(apiUrl);

        const data = await response.json();

        if (data.errorcode) {

            errorMessage.textContent =
                data.errormessage;

            return;
        }

        shortUrl.href = data.shorturl;
        shortUrl.textContent = data.shorturl;

        result.style.display = "block";

        const savedHistory = JSON.parse(
            localStorage.getItem("shortenedUrls")
        ) || [];


        savedHistory.unshift({
            original: url,
            short: data.shorturl
        });


        localStorage.setItem(
            "shortenedUrls",
            JSON.stringify(savedHistory)
        );


        loadHistory();


    } catch (error) {

        errorMessage.textContent =
            "Something went wrong. Please try again.";

    } finally {

        shortenBtn.disabled = false;
        shortenBtn.textContent = "Shorten URL";
    }

});

copyBtn.addEventListener("click", function () {

    navigator.clipboard.writeText(
        shortUrl.textContent
    );

    copyBtn.textContent = "Copied!";


    setTimeout(function () {

        copyBtn.textContent = "Copy";

    }, 1500);

});

loadHistory();