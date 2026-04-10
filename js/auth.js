// Simulated Auth Logic for Demo

function switchAuthTab(type) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Update forms
    document.getElementById('userLoginForm').classList.add('hidden');
    document.getElementById('doctorLoginForm').classList.add('hidden');
    
    if(type === 'user') {
        document.getElementById('userLoginForm').classList.remove('hidden');
        document.getElementById('userLoginForm').classList.add('active');
    } else {
        document.getElementById('doctorLoginForm').classList.remove('hidden');
        document.getElementById('doctorLoginForm').classList.add('active');
    }
}

function handleLogin(type) {
    const msgBlock = document.getElementById('authMessage');
    msgBlock.style.display = 'block';
    
    if (type === 'doctor') {
        const abhaInput = document.getElementById('docAbha').value;
        if (!abhaInput || abhaInput.length < 14) {
            msgBlock.style.color = 'var(--danger)';
            msgBlock.innerText = "Please enter a valid 14-digit ABHA ID for Doctor Verification.";
            return;
        }
        
        msgBlock.style.color = 'var(--accent)';
        msgBlock.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Verifying ABHA ID via NHA API...";
        
        // Simulate API delay
        setTimeout(() => {
            // Set mock doctor session
            localStorage.setItem('saarthi_session', JSON.stringify({
                id: "d99",
                name: "Dr. New User",
                type: "doctor",
                abha: abhaInput,
                specialty: "General",
                verified: true,
                avatar: "https://ui-avatars.com/api/?name=Dr+New+User&background=3b82f6&color=fff"
            }));
            
            msgBlock.style.color = '#10b981';
            msgBlock.innerHTML = "<i class='fas fa-check-circle'></i> Verification Successful! Redirecting...";
            
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 1000);
        }, 1500);
        
    } else {
        // User login
        msgBlock.style.color = 'var(--text-secondary)';
        msgBlock.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i> Sending OTP / Authenticating...";
        
        setTimeout(() => {
            // Set mock user session
            localStorage.setItem('saarthi_session', JSON.stringify({
                id: "u99",
                name: "Test Patient",
                type: "user",
                avatar: "https://ui-avatars.com/api/?name=Test+Patient&background=10b981&color=fff"
            }));
            
            window.location.href = 'app.html';
        }, 1000);
    }
}

// Auto-redirect if already logged in
window.onload = function() {
    if(localStorage.getItem('saarthi_session') && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'app.html';
    }
}
