const cols = document.querySelectorAll('.col');

// 1. Generate Random Hex Color
function generateRandomColor() {
    // Define valid hex characters
    const hexChars = '0123456789ABCDEF';
    let color = '#';
    // Loop 6 times to build the hex code
    for (let i = 0; i < 6; i++) {
        color += hexChars[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 2. Set Colors and Text Contrast
function setRandomColors(isInitial) {
    // If we pressed space, colors update. If isInitial is true, force update.
    
    cols.forEach((col) => {
        // Check if column is locked
        const isLocked = col.querySelector('.lock-btn').getAttribute('data-locked') === 'true';
        const text = col.querySelector('.hex-code');
        const lockBtn = col.querySelector('.lock-btn');

        // Only update if NOT locked (or if it's the very first load)
        if (isInitial || !isLocked) {
            const newColor = generateRandomColor();
            
            // Apply Background
            col.style.background = newColor;
            text.innerText = newColor;

            // Calculate Luminance to decide text color (White or Black)
            setTextColor(col, newColor);
        }
    });
}

// 3. Luminance Logic (Accessibility)
function setTextColor(col, color) {
    // Remove the hash
    const hex = color.substring(1); 
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // YIQ Equation for brightness
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    const text = col.querySelector('.hex-code');
    const btn = col.querySelector('.lock-btn');

    if (yiq >= 128) {
        // Background is light -> Text should be Dark
        text.style.color = '#1f1f1f';
        btn.style.color = '#1f1f1f';
    } else {
        // Background is dark -> Text should be Light
        text.style.color = '#f5f5f5';
        btn.style.color = '#f5f5f5';
    }
}

// 4. Lock Functionality
function toggleLock(btn) {
    const openIcon = btn.querySelector('.icon-open');
    const closedIcon = btn.querySelector('.icon-closed');
    
    // Check current state
    const isLocked = btn.getAttribute('data-locked') === 'true';

    if (isLocked) {
        // Unlock it
        btn.setAttribute('data-locked', 'false');
        openIcon.style.display = 'inline';
        closedIcon.style.display = 'none';
    } else {
        // Lock it
        btn.setAttribute('data-locked', 'true');
        openIcon.style.display = 'none';
        closedIcon.style.display = 'inline';
    }
}

// 5. Copy to Clipboard
function copyToClipboard(textElement) {
    const hex = textElement.innerText;
    
    navigator.clipboard.writeText(hex).then(() => {
        // Show Toast
        const notification = document.getElementById('notification');
        notification.innerText = `Copied ${hex} 😸`;
        notification.classList.add('active');
        
        // Hide after 2 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 2000);
    });
}

// 6. Event Listener: Spacebar
document.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.code.toLowerCase() === 'space') {
        setRandomColors(false); // false means "check for locks"
    }
});

// Initial Load
setRandomColors(true);