// Start phase section
let start_phase = document.querySelector("#start-phase"); // save start phase
let start_button = document.querySelector("#start-card"); // start card

// Game phase section
let game_phase = document.querySelector("#game-phase"); // save game phase
let time = document.querySelector("#timer"); // timer 
let answers = document.querySelector("#answers"); // answers
let questionE = document.querySelector("#question"); // question
let questionNo = document.querySelector("#question-number"); // question number

// Score phase section
let score_phase = document.querySelector("#score-phase"); // save scores phase
let saved_scores = document.querySelector("#scores");

let footer = document.querySelector("footer");

let questionset = [
    {question: "Which language is used to program dynamic effects in a webpage?",answers: ["JavaScript", "CSS", "HTML", "Sea Sharp"],},
    {question: "Which of the following CSS styling qualities positions content at a set position regardless of scrolling?", answers: ["fixed","absolute","relative","static"]},
    {question: "In the box model, which is the outermost layer of spacing?", answers: ["margin","content","padding","border"]},
    {question: "Which display property hides all content within the element?", answers: ["none","some","block","inline"]},
    {question: "Which of the following denotes an array?", answers: ["[ ]", "' '", "{ }", '" "']},
]

let questions_answers;
let correct;
let scores_list;

start_button.addEventListener("click", function(event) { // Event listener for start button
    if (event.target.id==="start") {
        questions_answers = JSON.parse(JSON.stringify(questionset));
        event.preventDefault();
        show_game(); // Hides score and start button, shows game
        time_left = 60; // Set timers
        time.textContent = "💣Time left: " + time_left + "s"; // Display time left  
        correct = 0; // Starting score of 0
        let answer = generate_question(); // Use generate_question to create and display question, then store true answer into answer var.
        answers.addEventListener("click", (e) => { // Event listener for <ul> of possible answers
            if (e.target.className == "answer-card") { // If user clicks within answer-card <li>
                if (e.target.textContent == answer) { // Check if answer is correct
                    correct++; // If answer is correct, add 1 to score
                    if (questions_answers.length > 0) { // If there are questions left, generate a new question
                        answer = generate_question(); // Set new answer as true answer for next question
                    } else { // If no questions left
                        time_left = -1; // Set time left to less than 0, start score phase.
                        clearInterval(timer);
                        save_name();
                        hide_game();
                    }
                } else { // If answer incorrect
                    time_left += -5; // deduct time from timer
                    if (questions_answers.length > 0) { // Generate new question if available
                        answer = generate_question();
                    } else { // Otherwise end game
                        time_left = -1;
                        clearInterval(timer);
                        save_name();
                        hide_game();
                    }
                }
            }
        } )

        timer = setInterval(() => { // Use timer
            time_left--; // Count down
            time.textContent = "💣Time left: " + time_left + "s"; // Change content of timer text as time counts down
            if(time_left <= 0) {  // Stops execution of action at set interval
                clearInterval(timer);// Stops timer
                save_name(); // Request name to save score
                hide_game(); // Hide game phase, show score and start phase
            }
        }, 1000);
    }
});

function generate_question () {
    let used_question_number = Math.floor(Math.random()*questions_answers.length)
    let random_question = questions_answers[used_question_number];
    questions_answers.splice(used_question_number,1);
    let current_question = random_question["question"];
    let answer_list = random_question["answers"];
    questionE.textContent = current_question;
    let true_answer = answer_list[0];
    for (let position = 0; position < 4; position++) {
        random_position = Math.floor(Math.random()*answer_list.length) //generate random position
        answers.children[position].textContent = answer_list[random_position]; // Set card answers
        answer_list.splice(random_position, 1);
    }
    return (true_answer);
}

function save_name() {
    let name = false;
    scores_list = JSON.parse(localStorage.getItem("scores_list"));
    if (!scores_list || scores_list === null) {
        scores_list = [];
    }
    // first one you add is already
    // 2nd one you add you have to look at the first 1 and and compare
    // third an on you will have to check all of therm until you find the correct spot
    // -- add it where it matters

    // push it to the array
    // then call the sort function
    
    if (scores_list.length <= 3 || correct > scores_list[2][1] || scores_list === []){
        let new_score;
        while (!name) {
            name = prompt("Enter your initials");
            if (name.length < 2 || name.length > 2 || name==null) {
                alert("Please enter only two characters!");
                name = false;
                continue
            }
            new_score = [name,correct];
        }
        if  (scores_list.length === 0) {
            localStorage.setItem("scores_list", JSON.stringify([new_score]));
        } else if (scores_list.length === 1) {
            console.log(scores_list)
            if (scores_list[0][1] < correct) {
                scores_list.splice(0,0,new_score);
            } else {
                scores_list.splice(1,0,new_score);
            }
        } else if (scores_list.length === 2) {
            if (scores_list[1][1]<correct) {
                if (scores_list[0][1]<correct) {
                    scores_list.splice(0,0,new_score);
                    localStorage.setItem("scores_list", JSON.stringify(scores_list));
                } else {
                    scores_list.splice(1,0,new_score);
                    localStorage.setItem("scores_list", JSON.stringify(scores_list));
                }
            }
        } else {
            if (correct > scores_list[2][1]) { // If score is greater than 3rd position score 
                if (correct > scores_list[1][1]) { // If score is greater than 2nd top score
                    if (correct > scores_list[0][1]) { // If score is greater than top score
                        scores_list.splice(0,0,new_score); // Add as top score
                        scores_list.splice(3,1); // Remove old 3rd position score
                    } else {
                        scores_list.splice(1,0,new_score); // Add as new second score
                        scores_list.splice(3,1); // Remove old 3rd position score
                    }
                } else {
                    scores_list.splice(2,1,new_score); // Replace 3rd position score
                }
            }
        }
    }
    show_scores();
};

function show_scores () {
    scores_list = JSON.parse(localStorage.getItem("scores_list"));
    saved_scores.children[0].textContent = scores_list[0][0] + ":   " + scores_list[0][1] + " point(s)";
    if (saved_scores.length < 1) {
        saved_scores.children[1].textContent = scores_list[1][0] + ":   " + scores_list[1][1] + " point(s)";
    }
}

function show_game() { // Use to show game content
    start_phase.setAttribute("style","display:none"); // Hides start button
    score_phase.setAttribute("style","display:none"); // Hides highscores
    game_phase.setAttribute("style", "display:block"); // Shows game info
    footer.setAttribute("style", "display:none");
}

function hide_game() {
    start_phase.setAttribute("style","display:block"); // Shows start button
    score_phase.setAttribute("style","display:block"); // Shows highscores
    game_phase.setAttribute("style", "display:none"); // Hides game info
    footer.setAttribute("style","display:block")
    correct = 0; // Reset score
}



  