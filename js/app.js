// Main App Logic

let currentUser = null;

window.onload = () => {
    // Check session
    const sessionStr = localStorage.getItem('saarthi_session');
    if (!sessionStr) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(sessionStr);
    
    // Initialize
    loadProfile();
    renderFeed();
    
    // Setup FAB based on role
    const fab = document.getElementById('add-post-btn');
    if(currentUser.type === 'doctor') {
        fab.style.background = 'var(--doctor-badge)';
    }
}

function logout() {
    localStorage.removeItem('saarthi_session');
    window.location.href = 'index.html';
}

function switchTab(tabId, navBtn) {
    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    navBtn.classList.add('active');
    
    // Update views
    document.querySelectorAll('.tab-view').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    
    // Hide FAB on SAARTHI
    document.getElementById('add-post-btn').style.display = tabId === 'saarthi' ? 'none' : 'flex';
}

function loadProfile() {
    document.getElementById('profile-name').innerText = currentUser.name;
    document.getElementById('profile-avatar').src = currentUser.avatar;
    
    const badgeContainer = document.getElementById('profile-badge-container');
    if(currentUser.type === 'doctor') {
        badgeContainer.innerHTML = `<span class="badge badge-doctor"><i class="fas fa-check-circle"></i> Verified Doctor</span> <span style="font-size:12px; color:var(--text-secondary); margin-left:8px;">ABHA: ${currentUser.abha.substring(0,4)}...</span>`;
    } else {
        badgeContainer.innerHTML = `<span class="badge badge-user">Patient User</span>`;
    }

    const savesCount = currentUser.saves ? currentUser.saves.length : 0;
    const likesCount = currentUser.likes ? currentUser.likes.length : 0;
    
    const statsContainer = document.querySelector('.profile-stats');
    if(statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-val">${likesCount}</div>
                <div class="stat-label">Liked</div>
            </div>
            <div class="stat-item">
                <div class="stat-val">${savesCount}</div>
                <div class="stat-label">Saved</div>
            </div>
        `;
    }

    // Render "My Posts" (Authored by user)
    const myPostsContainer = document.getElementById('profile-my-posts');
    if(myPostsContainer) {
        myPostsContainer.innerHTML = '';
        // In a real app we check authorId === currentUser.id. Here we'll map test posts.
        const myPosts = mockData.posts.filter(p => p.authorName === currentUser.name || p.authorId === currentUser.id);
        
        if (myPosts.length === 0) {
            myPostsContainer.innerHTML = "<p style='text-align:center; color:var(--text-secondary); margin-top:20px; font-size:13px;'>You haven't created any posts.</p>";
        } else {
            myPosts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'post-card glass-panel';
                card.style.transform = 'scale(0.98)'; 
                card.innerHTML = `
                    <div class="post-header">
                        <img src="${post.authorAvatar}" class="post-avatar">
                        <div class="post-author-info">
                            <div class="post-author-name">${post.authorName}</div>
                            <div class="post-time">${formatTimeAgo(post.timestamp)}</div>
                        </div>
                    </div>
                    <div class="post-content" style="font-size:13px">${post.content}</div>
                `;
                myPostsContainer.appendChild(card);
            });
        }
    }

    // Render "Saved Posts"
    const savedPostsContainer = document.getElementById('profile-saved-posts');
    if(savedPostsContainer) {
        savedPostsContainer.innerHTML = '';
        const userSavedPosts = mockData.posts.filter(p => currentUser.saves && currentUser.saves.includes(p.id));
        
        if (userSavedPosts.length === 0) {
            savedPostsContainer.innerHTML = "<p style='text-align:center; color:var(--text-secondary); margin-top:20px; font-size:13px;'>You haven't saved any posts yet.</p>";
        } else {
            userSavedPosts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'post-card glass-panel';
                card.style.transform = 'scale(0.98)'; 
                card.innerHTML = `
                    <div class="post-header">
                        <img src="${post.authorAvatar}" class="post-avatar">
                        <div class="post-author-info">
                            <div class="post-author-name">${post.authorName} <i class="fas fa-bookmark" style="color:var(--accent);font-size:10px;margin-left:4px;"></i></div>
                            <div class="post-time">${formatTimeAgo(post.timestamp)}</div>
                        </div>
                    </div>
                    <div class="post-content" style="font-size:13px">${post.content}</div>
                `;
                savedPostsContainer.appendChild(card);
            });
        }
    }
}

function formatTimeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    if(diff < 60000) return 'Just now';
    if(diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if(diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return Math.floor(diff/86400000) + 'd ago';
}

function renderFeed() {
    const container = document.getElementById('feed-container');
    container.innerHTML = '';
    
    const sortedPosts = mockData.posts.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedPosts.forEach(post => {
        let badgeHTML = '';
        if(post.authorType === 'doctor') badgeHTML = `<span class="badge badge-doctor">🩺 Doctor</span>`;
        if(post.authorType === 'vendor') badgeHTML = `<span class="badge badge-vendor">🏪 Vendor</span>`;
        if(post.authorType === 'user') badgeHTML = `<span class="badge badge-user">💡 Tip</span>`;
        
        const isLiked = currentUser.likes && currentUser.likes.includes(post.id);
        const isSaved = currentUser.saves && currentUser.saves.includes(post.id);
        const isReported = currentUser.reports && currentUser.reports.includes(post.id);

        const card = document.createElement('div');
        card.className = 'post-card glass-panel';
        card.innerHTML = `
            <div class="post-header">
                <img src="${post.authorAvatar}" class="post-avatar">
                <div class="post-author-info">
                    <div class="post-author-name">${post.authorName} ${post.authorType === 'doctor' ? '<i class="fas fa-check-circle" style="color:var(--doctor-badge);font-size:12px;"></i>' : ''}</div>
                    <div class="post-time">${formatTimeAgo(post.timestamp)} • ${badgeHTML}</div>
                </div>
                <i class="fas ${isReported ? 'fa-flag' : 'fa-ellipsis-v'}" style="color:${isReported ? 'var(--danger)' : 'var(--text-secondary)'}; cursor:pointer;" onclick="reportPost('${post.id}')"></i>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-actions">
                <button class="action-btn ${isLiked ? 'active-like' : ''}" onclick="toggleLike('${post.id}')">
                    <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> ${post.likes + (isLiked ? 1 : 0)}
                </button>
                <button class="action-btn" onclick="openComments('${post.id}')">
                    <i class="far fa-comment"></i> ${post.comments}
                </button>
                <button class="action-btn ${isSaved ? 'active-save' : ''}" style="margin-left: auto;" onclick="toggleSave('${post.id}')">
                    <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleLike(postId) {
    if(!currentUser.likes) currentUser.likes = [];
    const idx = currentUser.likes.indexOf(postId);
    if(idx === -1) {
        currentUser.likes.push(postId);
        showToast("❤️ Liked Post");
    } else {
        currentUser.likes.splice(idx, 1);
    }
    localStorage.setItem('saarthi_session', JSON.stringify(currentUser));
    renderFeed();
    loadProfile();
}

function toggleSave(postId) {
    if(!currentUser.saves) currentUser.saves = [];
    const idx = currentUser.saves.indexOf(postId);
    if(idx === -1) {
        currentUser.saves.push(postId);
        showToast("🔖 Saved to Profile");
    } else {
        currentUser.saves.splice(idx, 1);
        showToast("Removed from Saves");
    }
    localStorage.setItem('saarthi_session', JSON.stringify(currentUser));
    renderFeed();
    loadProfile();
}

function reportPost(postId) {
    if(!currentUser.reports) currentUser.reports = [];
    if(!currentUser.reports.includes(postId)) {
        currentUser.reports.push(postId);
        showToast("🚩 Post sent for Review");
        localStorage.setItem('saarthi_session', JSON.stringify(currentUser));
        renderFeed();
    } else {
        showToast("You've already reported this.");
    }
}

function openCreatePost() {
    document.getElementById('create-post-modal').classList.remove('hidden');
    document.getElementById('new-post-content').focus();
}

function closeCreatePost() {
    document.getElementById('create-post-modal').classList.add('hidden');
    document.getElementById('new-post-content').value = '';
}

function submitPost() {
    const input = document.getElementById('new-post-content');
    const text = input.value.trim();
    if(!text) return showToast("Post cannot be empty.");
    
    const newPost = {
        id: 'p' + Date.now(),
        authorId: currentUser.id || 'u' + Date.now(),
        authorName: currentUser.name,
        authorType: currentUser.type || 'user',
        authorAvatar: currentUser.avatar || 'https://ui-avatars.com/api/?name=' + currentUser.name,
        timestamp: new Date().toISOString(),
        content: text,
        likes: 0,
        comments: 0
    };
    
    // Unshift to add to top
    mockData.posts.unshift(newPost);
    
    closeCreatePost();
    showToast("✅ Successfully Posted!");
    
    // Re-render
    renderFeed();
    loadProfile();
}

function openComments(postId) {
    document.getElementById('comments-modal').classList.remove('hidden');
}

function closeComments() {
    document.getElementById('comments-modal').classList.add('hidden');
}

function addComment() {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if(!text) return;
    
    const list = document.getElementById('comments-list');
    if(list.innerText.includes("No comments yet")) {
        list.innerHTML = '';
    }
    
    list.innerHTML += `
        <div style="display:flex; gap:12px; margin-bottom:16px; animation:fadeIn 0.3s ease;">
            <img src="${currentUser.avatar}" style="width:36px; height:36px; border-radius:50%;">
            <div style="background:rgba(0,0,0,0.03); padding:10px 14px; border-radius:0 12px 12px 12px;">
                <p style="font-size:13px; font-weight:600; margin-bottom:4px; color:var(--accent);">${currentUser.name}</p>
                <p style="font-size:13px; color:var(--text-primary);">${text}</p>
            </div>
        </div>
    `;
    input.value = '';
    list.scrollTop = list.scrollHeight;
    showToast("Comment posted!");
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = msg;
    container.appendChild(t);
    setTimeout(() => {
        t.style.opacity = 0;
        setTimeout(() => t.remove(), 300);
    }, 2500);
}

// ==== SAARTHI AI Chatbot Logic ====

// 🔴 ACTION REQUIRED: Paste your free Google Gemini API Key here!
// Get one instantly at: https://aistudio.google.com/
const GEMINI_API_KEY = "AIzaSyDm6GFvK1RPQiZCq_U3GWZ3wOfeScxJt80";

function handleChatPress(e) {
    if(e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if(!text) return;
    
    // Add user message
    addMessage(text, 'user');
    input.value = '';
    
    // Simulate AI thinking
    const typingId = addTypingIndicator();
    
    // If API Key is missing, use the Mock Logic as fallback
    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE" || !GEMINI_API_KEY) {
        setTimeout(() => {
            document.getElementById(typingId).remove();
            // Fallback to our existing rule-engine in data.js
            const analysis = mockData.botLogic.analyzeSymptoms(text);
            renderAiResponse(analysis);
            addMessage("<i style='font-size:12px;color:var(--text-secondary)'>Note: This was a demo response. Add your Gemini API key in app.js for real AI!</i>", 'ai');
        }, 1200);
        return;
    }

    // Call Real Gemini API
    try {
        const prompt = `You are SAARTHI, a medical AI assistant. The user says: "${text}". 
        Analyze the symptoms and return a JSON object with strictly this exact structure (do not use markdown formatting like \`\`\`json, just return the raw JSON text):
        {
          "disease_info": { "name": "[Name of disease]", "spreads": "[How it spreads]" },
          "fruits_vegetables": [ { "item": "[Food Name]", "benefits": "[Why it helps]", "vendor": "Search local vendors" } ],
          "doctors": [ { "name": "Dr. AI Recommended", "specialty": "[Required Specialist]", "clinic": "Nearby Clinic" } ],
          "exercises": [ "[Exercise 1]", "[Exercise 2]" ],
          "dos_and_donts": { "dos": [ "[Do 1]", "[Do 2]" ], "donts": [ "[Dont 1]" ] }
        }`;
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{text: prompt}] }]
            })
        });
        
        const data = await response.json();
        document.getElementById(typingId).remove();
        
        if(data.candidates && data.candidates[0].content.parts[0].text) {
           let jsonText = data.candidates[0].content.parts[0].text;
           // Clean up any potential markdown formatting the AI might still add
           jsonText = jsonText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
           
           const analysis = JSON.parse(jsonText);
           renderAiResponse(analysis);
        } else {
           addMessage("Sorry, I could not analyze that right now.", 'ai');
        }
    } catch(err) {
        document.getElementById(typingId).remove();
        addMessage("<span style='color:var(--danger)'><i class='fas fa-exclamation-triangle'></i> API Error. Please check if your Gemini API key is valid.</span>", 'ai');
        console.error("Gemini API Error:", err);
    }
}

function addMessage(text, sender) {
    const chat = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = `chat-msg msg-${sender}`;
    msg.innerHTML = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const chat = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.id = id;
    msg.className = `chat-msg msg-ai`;
    msg.innerHTML = `<i class="fas fa-ellipsis-h fa-fade"></i>`;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    return id;
}

function renderAiResponse(data) {
    let html = `Based on your symptoms, here is a complete health breakdown:<br>`;
    
    // Disease Info
    if(data.disease_info) {
        html += `
        <div class="ai-card">
            <h4><i class="fas fa-virus"></i> Likely Issue: ${data.disease_info.name}</h4>
            <p style="font-size:12px; color:var(--text-secondary)"><b>How it spreads:</b> ${data.disease_info.spreads}</p>
        </div>`;
    }
    
    // Diet
    if(data.fruits_vegetables.length > 0) {
        html += `<div class="ai-card"><h4><i class="fas fa-apple-alt"></i> Recommended Diet</h4><ul>`;
        data.fruits_vegetables.forEach(f => {
            html += `<li><b>${f.item}</b> - <span style="font-size:12px;color:var(--text-secondary)">${f.benefits}</span><br><span style="font-size:11px;color:var(--vendor-badge)">🛒 Available at: ${f.vendor}</span></li>`;
        });
        html += `</ul></div>`;
    }
    
    // Doctors
    if(data.doctors.length > 0) {
        html += `<div class="ai-card" style="border-color:rgba(59,130,246,0.3)"><h4><i class="fas fa-user-md"></i> Verified Doctors (Consult)</h4><ul>`;
        data.doctors.forEach(d => {
            html += `<li><b>${d.name}</b> (${d.specialty})<br><span style="font-size:12px;color:var(--text-secondary)"><i class="fas fa-hospital"></i> ${d.clinic} | ✅ ABHA Verified</span></li>`;
        });
        html += `</ul></div>`;
    }
    
    // Exercise
    if(data.exercises.length > 0) {
        html += `<div class="ai-card"><h4><i class="fas fa-running"></i> Exercises</h4><ul>`;
        data.exercises.forEach(e => html += `<li>${e}</li>`);
        html += `</ul></div>`;
    }
    
    // Dos and Donts
    if(data.dos_and_donts.dos.length > 0) {
        html += `<div class="ai-card" style="display:flex; gap:10px;">
            <div style="flex:1">
                <h4 style="color:#10b981"><i class="fas fa-check-circle"></i> Do's</h4>
                <ul style="padding-left:15px;font-size:12px">${data.dos_and_donts.dos.map(d=>`<li>${d}</li>`).join('')}</ul>
            </div>
            <div style="flex:1">
                <h4 style="color:#ef4444"><i class="fas fa-times-circle"></i> Don'ts</h4>
                <ul style="padding-left:15px;font-size:12px">${data.dos_and_donts.donts.map(d=>`<li>${d}</li>`).join('')}</ul>
            </div>
        </div>`;
    }
    
    addMessage(html, 'ai');
}
