const surveyForm = document.getElementById("surveyForm");
const resultsBody = document.getElementById("resultsBody");
const confirmationMessage = document.getElementById("confirmationMessage");
const interestError = document.getElementById("interestError");

const totalResponsesEl = document.getElementById("totalResponses");
const mostSelectedEl = document.getElementById("mostSelected");
const avgRatingEl = document.getElementById("avgRating");
const topInterestEl = document.getElementById("topInterest");
const recommendPercentEl = document.getElementById("recommendPercent");

const surveySection = document.getElementById("surveySection");
const resultsSection = document.getElementById("resultsSection");
const surveyTab = document.getElementById("surveyTab");
const resultsTab = document.getElementById("resultsTab");

const teachingRange = document.getElementById("teachingRange");
const teachingValue = document.getElementById("teachingValue");
const overallRange = document.getElementById("overallRange");
const overallValue = document.getElementById("overallValue");

// Array of objects: each object stores one full survey response.
const surveyResponses = [];

teachingRange.addEventListener("input", () => {
    teachingValue.textContent = teachingRange.value;
});

overallRange.addEventListener("input", () => {
    overallValue.textContent = overallRange.value;
});

surveyTab.addEventListener("click", () => showSection("survey"));
resultsTab.addEventListener("click", () => showSection("results"));

function showSection(section) {
    const showSurvey = section === "survey";
    surveySection.classList.toggle("hidden", !showSurvey);
    resultsSection.classList.toggle("hidden", showSurvey);
    surveyTab.classList.toggle("active", showSurvey);
    resultsTab.classList.toggle("active", !showSurvey);
}

surveyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(surveyForm);
    const selectedInterests = formData.getAll("interests");

    // Manual validation for checkbox group: at least one interest is required.
    if (selectedInterests.length === 0) {
        interestError.textContent = "Please select at least one area of interest.";
        return;
    }

    interestError.textContent = "";

    const response = {
        name: formData.get("name"),
        email: formData.get("email"),
        age: Number(formData.get("age")),
        department: formData.get("department"),
        year: formData.get("year"),
        language: formData.get("language"),
        residence: formData.get("residence"),
        attendance: formData.get("attendance"),
        experience: formData.get("experience"),
        interests: selectedInterests,
        teachingRating: Number(formData.get("teachingRating")),
        codingEnvironment: Number(formData.get("codingEnvironment")),
        materialsHelpful: formData.get("materialsHelpful"),
        teacherParticipation: formData.get("teacherParticipation"),
        courseDifficulty: formData.get("courseDifficulty"),
        overallRating: Number(formData.get("overallRating")),
        recommendCollege: formData.get("recommendCollege"),
        feedback: formData.get("feedback") || "-",
    };

    surveyResponses.push(response);
    confirmationMessage.textContent = "✅ Survey submitted successfully!";

    surveyForm.reset();
    teachingRange.value = "3";
    teachingValue.textContent = "3";
    overallRange.value = "3";
    overallValue.textContent = "3";

    renderResultsTable();
    updateStatistics();
    showSection("results");
});

function renderResultsTable() {
    resultsBody.innerHTML = "";

    // forEach loop used to create table rows dynamically for each response object.
    surveyResponses.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.department}</td>
            <td>${entry.year}</td>
            <td>${entry.language}</td>
            <td>${entry.experience}</td>
            <td>${entry.interests.join(", ")}</td>
            <td>${entry.codingEnvironment}</td>
            <td>${entry.overallRating}</td>
            <td>${entry.recommendCollege}</td>
        `;
        resultsBody.appendChild(row);
    });
}

function updateStatistics() {
    totalResponsesEl.textContent = String(surveyResponses.length);

    const languageCount = {};
    const interestCount = {};
    let ratingSum = 0;
    let yesRecommendations = 0;

    // for loop used for analytics calculations from response array.
    for (let i = 0; i < surveyResponses.length; i += 1) {
        const response = surveyResponses[i];

        languageCount[response.language] = (languageCount[response.language] || 0) + 1;
        ratingSum += response.codingEnvironment;

        if (response.recommendCollege === "Yes") {
            yesRecommendations += 1;
        }

        // Nested for loop to count each selected interest area.
        for (let j = 0; j < response.interests.length; j += 1) {
            const area = response.interests[j];
            interestCount[area] = (interestCount[area] || 0) + 1;
        }
    }

    let mostSelectedLanguage = "N/A";
    let maxLanguageCount = 0;

    // for...in loop to find most selected language.
    for (const language in languageCount) {
        if (languageCount[language] > maxLanguageCount) {
            maxLanguageCount = languageCount[language];
            mostSelectedLanguage = language;
        }
    }

    let topInterestArea = "N/A";
    let maxInterestCount = 0;

    // for...in loop to find top interest area.
    for (const area in interestCount) {
        if (interestCount[area] > maxInterestCount) {
            maxInterestCount = interestCount[area];
            topInterestArea = area;
        }
    }

    const averageRating =
        surveyResponses.length > 0 ? (ratingSum / surveyResponses.length).toFixed(1) : "0.0";

    const recommendPercent =
        surveyResponses.length > 0
            ? `${((yesRecommendations / surveyResponses.length) * 100).toFixed(0)}%`
            : "0%";

    mostSelectedEl.textContent = mostSelectedLanguage;
    avgRatingEl.textContent = averageRating;
    topInterestEl.textContent = topInterestArea;
    recommendPercentEl.textContent = recommendPercent;
}
