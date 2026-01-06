let cache = [];

function logEvent(message) {
    const log = document.getElementById("activityLog");
    if (!log) return;

    Array.from(log.children).forEach(child => child.classList.remove("is-active"));

    const line = document.createElement("div");
    line.className = "log-line";
    line.innerText = message;
    line.classList.add("is-active");
    log.prepend(line);

    while (log.children.length > 8) {
        log.removeChild(log.lastChild);
    }
}

function addProcess() {
    const capacity = document.getElementById("capacity").value;
    const process = document.getElementById("process").value;
    if (capacity === "" || process === "") {
        alert("Please enter capacity and process");
        return;
    }
    const cap = parseInt(capacity);

    const wasHit = cache.indexOf(process) !== -1;
    const willEvict = !wasHit && cache.length >= cap;
    const lruBefore = willEvict ? cache[cache.length - 1] : null;

    // If process already exists → remove it
    const index = cache.indexOf(process);
    if (index !== -1) {
        cache.splice(index, 1);
    }
    // Add process to front (MRU)
    cache.unshift(process);
    // If capacity exceeded → remove LRU
    if (cache.length > cap) {
        cache.pop();
    }
    document.getElementById("process").value = "";
    renderCache();

    if (wasHit) {
        logEvent(`Cache hit: "${process}" moved to MRU.`);
    } else {
        logEvent(`Cache miss: "${process}" inserted as MRU.`);
    }
    if (willEvict && lruBefore !== null && lruBefore !== undefined) {
        logEvent(`Evicted LRU: "${lruBefore}" (capacity ${cap}).`);
    }
}

function renderCache() {
    const container = document.getElementById("cacheContainer");
    container.innerHTML = "";

    cache.forEach(item => {
        const div = document.createElement("div");
        div.className = "cache-item";
        div.innerText = item;
        container.appendChild(div);
    });
}