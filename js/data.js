const mockData = {
    currentUser: {
        id: "u1",
        name: "Guest User",
        type: "user",
        avatar: "https://ui-avatars.com/api/?name=Guest+User&background=10b981&color=fff",
        bookmarks: [],
        likes: [],
        saves: [],
        reports: []
    },
    
    doctors: [
        { id: "d1", name: "Dr. Sharma", specialty: "Cardiologist", abha: "12345678901234", clinic: "Heart Care Clinic", verified: true, avatar: "https://ui-avatars.com/api/?name=Dr+Sharma&background=3b82f6&color=fff" },
        { id: "d2", name: "Dr. Gupta", specialty: "General Physician", abha: "98765432109876", clinic: "City Hospital", verified: true, avatar: "https://ui-avatars.com/api/?name=Dr+Gupta&background=3b82f6&color=fff" }
    ],

    vendors: [
        { id: "v1", name: "Healthy Bites", type: "Organic Food", contact: "9876543210", location: "Sector 14" },
        { id: "v2", name: "Green Pharmacy", type: "Ayurvedic Supplements", contact: "9998887776", location: "Downtown" }
    ],

    posts: [
        {
            id: "p1",
            authorId: "d1",
            authorName: "Dr. Sharma",
            authorType: "doctor",
            authorAvatar: "https://ui-avatars.com/api/?name=Dr+Sharma&background=3b82f6&color=fff",
            type: "doctor_post",
            content: "Always keep yourself hydrated. Drinking 8 glasses of water a day keeps your heart healthy! 💧❤️",
            likes: 120,
            comments: 15,
            timestamp: new Date().toISOString()
        },
        {
            id: "p2",
            authorId: "v1",
            authorName: "Healthy Bites",
            authorType: "vendor",
            authorAvatar: "https://ui-avatars.com/api/?name=Healthy+Bites&background=f59e0b&color=fff",
            type: "vendor_promo",
            content: "Fresh organic apples 🍎 just arrived! Boost your immunity naturally. Available at 15% off today. Call 9876543210.",
            likes: 45,
            comments: 2,
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: "p3",
            authorId: "u2",
            authorName: "Aarav Singh",
            authorType: "user",
            authorAvatar: "https://ui-avatars.com/api/?name=Aarav+Singh&background=8892b0&color=fff",
            type: "health_tip",
            content: "Just started a morning yoga routine. Feeling so much more energetic! 🧘‍♂️✨",
            likes: 89,
            comments: 8,
            timestamp: new Date(Date.now() - 7200000).toISOString()
        }
    ],

    // Simulated AI Data Engine
    botLogic: {
        analyzeSymptoms(text) {
            const lowerText = text.toLowerCase();
            let result = {
                fruits_vegetables: [],
                doctors: [],
                exercises: [],
                dos_and_donts: { dos: [], donts: [] },
                disease_info: null
            };

            // Basic NLP fallback rules matching user prompts
            if (lowerText.includes("fever") || lowerText.includes("cold")) {
                result.disease_info = {
                    name: "Viral Fever / Common Cold",
                    spreads: "Spreads through airborne droplets when an infected person coughs or sneezes, or by touching contaminated surfaces."
                };
                result.fruits_vegetables = [
                    { item: "Oranges, Lemons (Vitamin C)", benefits: "Boost immunity", vendor: "Healthy Bites (9876543210)" },
                    { item: "Ginger & Garlic", benefits: "Anti-inflammatory and antimicrobial properties", vendor: "Green Pharmacy (9998887776)" }
                ];
                result.doctors = [this.dFind("General Physician")];
                result.exercises = ["Rest is recommended. Light stretching only.", "Breathing exercises (Pranayama)"];
                result.dos_and_donts.dos = ["Drink plenty of warm fluids", "Take adequate rest", "Wash hands frequently"];
                result.dos_and_donts.donts = ["Do not consume cold beverages", "Avoid crowded places", "Don't share personal items"];
            } 
            else if (lowerText.includes("stomach") || lowerText.includes("pain") || lowerText.includes("digestion")) {
                result.disease_info = {
                    name: "Gastroenteritis / Indigestion",
                    spreads: "Often spreads through contaminated food or water, or contact with an infected person."
                };
                result.fruits_vegetables = [
                    { item: "Bananas & Papayas", benefits: "Easy to digest, soothes stomach", vendor: "Healthy Bites (9876543210)" },
                    { item: "Coconut Water", benefits: "Replenishes electrolytes", vendor: "Local Vendor" }
                ];
                result.doctors = [this.dFind("General Physician")];
                result.exercises = ["Gentle walking", "Yoga poses like Pawanmuktasana (wind-relieving pose)"];
                result.dos_and_donts.dos = ["Eat bland, easily digestible food (BRAT diet)", "Stay hydrated"];
                result.dos_and_donts.donts = ["Avoid spicy, oily, or dairy foods", "Do not lie down immediately after eating"];
            }
            else if (lowerText.includes("heart") || lowerText.includes("chest")) {
                result.disease_info = {
                    name: "Possible Cardiac Symptoms (Urgent)",
                    spreads: "Heart conditions are typically non-communicable. Caused by lifestyle, genetics, or acute events."
                };
                result.fruits_vegetables = [
                    { item: "Leafy Greens (Spinach)", benefits: "Rich in Vitamin K, protects arteries", vendor: "Healthy Bites" },
                    { item: "Berries", benefits: "Antioxidants reduce inflammation", vendor: "Healthy Bites" }
                ];
                result.doctors = [this.dFind("Cardiologist")];
                result.exercises = ["URGENT: Consult doctor before exercising.", "Usually, brisk walking is good for long-term health."];
                result.dos_and_donts.dos = ["Seek immediate medical attention if pain radiates to arm/jaw", "Chew aspirin if recommended by emergency services"];
                result.dos_and_donts.donts = ["Do not ignore severe chest pain", "Avoid physical exertion"];
            }
            else {
                 result.disease_info = {
                    name: "General Weakness / Unspecified",
                    spreads: "Varies depending on underlying cause."
                };
                result.fruits_vegetables = [
                    { item: "Mixed Fruits (Apples, Bananas)", benefits: "Overall health", vendor: "Healthy Bites (9876543210)" },
                ];
                result.doctors = [this.dFind("General Physician")];
                result.exercises = ["Daily 30 min walking", "Basic yoga"];
                result.dos_and_donts.dos = ["Maintain a balanced diet", "Sleep 7-8 hours"];
                result.dos_and_donts.donts = ["Avoid excessive stress", "Don't skip meals"];
            }
            
            return result;
        },
        dFind(specialty) {
            return mockData.doctors.find(d => d.specialty === specialty) || mockData.doctors[0];
        }
    }
};

window.mockData = mockData;
