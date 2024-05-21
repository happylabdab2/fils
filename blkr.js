// blkr.js

// List of allowed domains
const allowedDomains = [
    'example.com',
    'allowed-domain.com',
    window.location.host.toString(),
];

// Save the original window.open function
const originalWindowOpen = window.open;

// Override the window.open function
window.open = function(url, ...args) {
    // Create an anchor element to easily parse the URL
    const anchor = document.createElement('a');
    anchor.href = url;

    // Check if the domain is in the allowed list
    const domainAllowed = allowedDomains.some(domain => anchor.hostname.includes(domain));

    if (domainAllowed) {
        // If the domain is allowed, call the original window.open function
        return originalWindowOpen.apply(window, [url, ...args]);
    } else {
        // If the domain is not allowed, block the attempt
        console.warn(`Blocked window.open to: ${url}`);
        return null;
    }
};

// Function to check if a domain is allowed
function isDomainAllowed(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    return allowedDomains.some(domain => anchor.hostname.endsWith(domain));
}

// Remove anchor tags that lead to outside domains
function removeUnallowedLinks() {
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(anchor => {
        if (!isDomainAllowed(anchor.href)) {
            anchor.remove();
            console.warn(`Removed link to: ${anchor.href}`);
        }
    });
}

// Run the function to remove unallowed links
removeUnallowedLinks();

// Observe changes to the DOM to remove new unallowed links
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            removeUnallowedLinks();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
