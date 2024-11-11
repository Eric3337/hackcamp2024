// import Fuse from 'fuse.js';


// Sample resume skills and job description
const resumeSkills = ["JavaScript", "React", "Node.js", "Python", "SQL", "Android", "Java"];
// const jobDescription = "We are looking for a JavaScript developer with ReactJS, Node.js, and experience in Python and SQL.";
// const jobDescription = "Must be actively pursuing a degree or certification from an accredited program Growth mindset- We want individuals that are open to learning and receiving feedback Comfortable working in a team environment or autonomously on project work Strong written and oral communication skills Experience in writing test plan and test cases Familiarity with Software testing, test case development experience Knowledge of scripting in Python Knowledge of data communication, networking and protocols Ability to work effectively both independently and within team environment Knowledge of Linux operating system and Linux command line usage is an asset";
const jobDescription = ["About you",
    "Currently enrolled in a University program (+3rd year) or recently graduated in Computer Science, Computer Engineering, or related field of study.",
    "Minimum of 8 months of hands-on experience in software development.",
    "Available to work full-time (40 hours per week), Monday to Friday, 9 AM to 5 PM.",
    "Previous experience with Kotlin/Java and/or Android",
    "A solid understanding of data structures, algorithms, and software design",
    "Skilled in writing clean, reusable code using Object Oriented Design principles",
    "Ability to debug code and write unit tests",
    "Basic knowledge of version control systems to collaborate on projects and track changes. Experience with Git is a plus."];

const jobDescriptionString = jobDescription.join(" ");

// Tokenize the job description
const jobDescriptionTokens = jobDescriptionString.toLowerCase().split(/\s+/);

// let matches = [];

// Initialize Fuse.js with options


// Function to calculate match percentage
function calculateMatchPercentage(skill, jobDescriptionTokens) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('fuse.js');  // Path to local Fuse.js file
    console.log("function called");
    script.onload = function () {
        console.log("Fuse.js loaded successfully.");
        const fuse = new Fuse(jobDescriptionTokens, {
            includeScore: true, // Include the score of each result
            threshold: 0.4, // Adjust threshold based on your tolerance

        });
        const result = fuse.search(skill.toLowerCase());
        if (result.length > 0) {
            // Get the score for the best match
            const score = result[0].score;  // Fuse returns score (lower score means better match)
            const percentage = (1 - score) * 100; // Convert score to percentage
            return percentage.toFixed(2); // Round the percentage to 2 decimal places
        }
    }

    return 0; // Return 0% if no match
}

// Function to check if more than 50% of skills match the job description
export function checkSkillsMatch(resumeSkills, jobDescription) {

    const jobDescriptionTokens = jobDescription.toLowerCase().split(/\s+/);
    let matchedSkillsCount = 0;

    let matches = [];

    resumeSkills.forEach(skill => {
        const percentage = calculateMatchPercentage(skill, jobDescriptionTokens);
        if (percentage >= 80) {
            matchedSkillsCount++;
            matches.push(skill);
        }
    });

    const matchNum = matchedSkillsCount;

    // If more than 50% of skills match, return true
    // return {matchPercentage, matches};
    return {matchNum, matches};
}

// // Check if over 50% of skills match the job description
const {matchNum, matches} = checkSkillsMatch(resumeSkills, jobDescriptionString);
// const matchNum = checkSkillsMatch(resumeSkills, jobDescriptionString);
console.log("Match: ", matchNum);  // true or false
console.log(matches);
