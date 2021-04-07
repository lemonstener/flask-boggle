currentScore = document.querySelector('#current')
time = document.querySelector('#time')
feedback = document.querySelector('#feedback')
form = document.querySelector('form')
input = document.getElementsByName('word')[0]
correctWords = document.querySelector('#correct-words')


form.addEventListener('submit', function (e) {
    e.preventDefault();
    checkForWord(input.value.toLowerCase());
})

const game = {
    time: 60,
    responses: {
        'not-word': '<p class="red">Not a word</p>',
        'not-on-board': '<p class="red">Word is not on the board</p>',
        'ok': '<p class="green">Correct word</p>'
    },
    words: new Set,
    currentScore: 0,
    timer: setInterval(function () {
        countDown()
    }, 1000)
}

time.innerText = game.time;

async function countDown() {
    game.time--;
    time.innerText = game.time
    if (game.time === 0) {
        clearInterval(game.timer);
        endGame();
    }
}

async function checkForWord(word) {
    if (word === '') {
        return;
    }
    if (game.words.has(word) === true) {
        feedback.innerHTML = '<p>Word already discovered</p>';
        input.value = ''
        return;
    }
    const res = await axios.get('/check-word', { params: { word: word } })
    msg = res.data.result
    feedback.innerHTML = `${game.responses[msg]}`
    if (msg === 'ok') {
        updateScore(word);
    }
    input.value = ''

}

function updateScore(word) {
    game.words.add(word);
    game.currentScore += word.length;
    currentScore.innerHTML = game.currentScore

    const newWord = document.createElement('div');
    newWord.innerText = word;
    newWord.className = 'displayed-word'
    correctWords.append(newWord)
    return;
}

async function endGame() {
    form.hidden = true;
    const res = await axios.post('/endgame', { score: game.currentScore })
    if (res.data.brokeRecord) {
        feedback.innerHTML = `
        <p class="green">New Record: ${game.currentScore}</p>
        <a href="/"><button>Play Again?</button>
        `
    } else {
        feedback.innerHTML = `
        <p class="red">Final Score: ${game.currentScore}</p>
        <a href="/"><button>Play Again?</button>
        `
    }
}