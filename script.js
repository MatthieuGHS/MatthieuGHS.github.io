let centralImage = document.getElementById("central-image");
let health = 2000;
let damagePerSecond = 5;
let adversaries = [];
let adversarySpeed = 1;
let interval;
let isGameStarted = false;
let score = 1;
let waveCleared = false;

let audio = new Audio("coucou.mp3");
audio.volume = 1.0;

function createAdversary(x, y) {
    let adversary = document.createElement("img");
    let imgIndex = Math.floor(Math.random() * 27);
    adversary.src = `imgAssos/${imgIndex}.jpg`;
    adversary.classList.add("adversary");
    // adversary.style.width = "30px";
    adversary.style.height = "30px";
    adversary.style.left = `${x}px`;
    adversary.style.top = `${y}px`;

    let audio = new Audio("coucou.mp3");
    audio.volume = 1.0;
    audio.play();

    adversary.addEventListener("click", (event) => {
        event.stopPropagation();
        adversary.remove();
        clearInterval(adversary.damageInterval);
        adversaries = adversaries.filter(a => a !== adversary);
        checkWaveCompletion();
        let audio = new Audio("mortW.mp3");
        audio.volume = 1.0;
        audio.play();
        let audio2 = new Audio("horn.mp3");
        audio2.volume = 1.0;
        audio2.play();
    });

    document.body.appendChild(adversary);
    adversaries.push(adversary);
}

function initializeAdversaries() {
    let alarmAudio = new Audio("alarm.mp3");
    alarmAudio.volume = 1.0;
    alarmAudio.play();

    for (let i = 0; i < 25 * score; i++) {
        let randomX = Math.random() * window.innerWidth;
        let randomY = Math.random() * window.innerHeight;
        createAdversary(randomX, randomY);
    }
    waveCleared = false;
}

function checkWaveCompletion() {
    if (adversaries.length === 0) {
        score += 1;
        centralImage.style.width = `${100 * score}px`;
        centralImage.style.height = `${100 * score}px`;
        waveCleared = true;
        let yeah = new Audio("yeah.mp3");
        yeah.volume = 1.0;
        yeah.play();
    }
}

function addNewAdversariesAround(x, y) {
    for (let i = 0; i < 5; i++) {
        let offsetX = (Math.random() - 0.5) * 200;
        let offsetY = (Math.random() - 0.5) * 200;
        createAdversary(x + offsetX, y + offsetY);
    }
}

function moveAdversaries() {
    adversaries.forEach(adversary => {
        let adversaryRect = adversary.getBoundingClientRect();
        let centralRect = centralImage.getBoundingClientRect();

        let adversaryX = adversaryRect.left + adversaryRect.width / 2;
        let adversaryY = adversaryRect.top + adversaryRect.height / 2;
        let centralX = centralRect.left + centralRect.width / 2;
        let centralY = centralRect.top + centralRect.height / 2;

        let dx = centralX - adversaryX;
        let dy = centralY - adversaryY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance !== 0) {
            let moveX = (dx / distance) * adversarySpeed;
            let moveY = (dy / distance) * adversarySpeed;

            adversary.style.left = `${adversary.offsetLeft + moveX}px`;
            adversary.style.top = `${adversary.offsetTop + moveY}px`;
        }

        if (distance < (centralRect.width / 2 + adversaryRect.width / 2)) {
            if (!adversary.colliding) {
                adversary.colliding = true;
                adversary.damageInterval = setInterval(() => {
                    damageCentralImage();
                }, 1000);
            }
        } else {
            if (adversary.colliding) {
                adversary.colliding = false;
                clearInterval(adversary.damageInterval);
            }
        }
    });
}

function damageCentralImage() {
    health -= damagePerSecond;
    centralImage.style.opacity = health / 2000;

    let hitAudio = new Audio("hit.mp3");
    hitAudio.volume = 1.0;
    hitAudio.play();

    if (health <= 0) {
        clearInterval(interval);
        let audio1 = new Audio("mort.mp3");
        audio1.volume = 1.0;
        audio1.play();
        
        adversaries.forEach(adversary => {
            if (adversary.damageInterval) {
                clearInterval(adversary.damageInterval);
            }
        });
        
        document.body.style.backgroundColor = "black";
        centralImage.style.display = "none";
        adversaries.forEach(adversary => adversary.style.display = "none");
    }
}

interval = setInterval(moveAdversaries, 50);

document.addEventListener("click", (event) => {
    if (!isGameStarted) {
        initializeAdversaries();
        isGameStarted = true;
    } else if (waveCleared) {
        initializeAdversaries();
    } else {
        addNewAdversariesAround(event.clientX, event.clientY);
    }
});
