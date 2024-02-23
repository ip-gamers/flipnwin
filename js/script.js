class AudioController {
    constructor() {
        this.pbSound = new Audio('https://ip-gamers.net/downloads/Ever/pages_media/The-Avengers-Theme-Song.wav');
        this.rollSound = new Audio('https://ip-gamers.net/downloads/Ever/pages_media/Flip-sound.wav');
        this.matchSound = new Audio('https://ip-gamers.net/downloads/Ever/pages_media/mixkit-ethereal-fairy-win-sound-2019.wav');
        this.victorySound = new Audio('https://ip-gamers.net/downloads/Ever/pages_media/mixkit-male-voice-cheer-victory-2011.wav');
        this.gameOverSound = new Audio('https://ip-gamers.net/downloads/Ever/pages_media/game over evil.wav');
        this.timeWarning = new Audio('https://ip-gamers.net/downloads/Ever/pages_media/mixkit-tick-tock-clock-close-up-1059.wav');
        this.pbSound.volume = 0.2;
        this.pbSound.loop = true;
        this.matchSound.volume = 0.2;
    }
    startMusic() {
        this.pbSound.play();
    }
    stopMusic() {
        this.pbSound.pause();
        this.pbSound.currentTime = 0;
    }
    stopWarning() {
        this.timeWarning.pause();
        this.timeWarning.currentTime = 0;
    }
    flip() {
        this.rollSound.play();
    }
    match() {
        this.matchSound.play();
    }
    warning() {
        this.stopMusic();
        this.timeWarning.play();
        document.getElementById('time-countdown').classList.add('visible');
    }
    victory() {
        this.stopMusic();
        this.stopWarning();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.stopWarning();
        this.gameOverSound.play();
    }
}

class FLIP2N2WIN {
    constructor(totalTime, tokens) {
        this.tokensArray = tokens;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-countdown');
        this.ticker = document.getElementById('flips-counter');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedTokens = [];
        this.busy = true;
        document.getElementById('time-countdown').classList.remove('visible');
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleTokens();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideTokens();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    hideTokens() {
        this.tokensArray.forEach(token => {
            token.classList.remove('visible');
            token.classList.remove('matched');
        });
    }
    flipCard(token) {
        if (this.canFlipCard(token)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            token.classList.add('visible');

            if (this.cardToCheck)
                this.checkForCardMatch(token);
            else
                this.cardToCheck = token;
        }
    }
    checkForCardMatch(token) {
        if (this.getCardType(token) === this.getCardType(this.cardToCheck))
            this.cardMatch(token, this.cardToCheck);
        else
            this.cardMisMatch(token, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(token1, token2) {
        this.matchedTokens.push(token1);
        this.matchedTokens.push(token2);
        token1.classList.add('matched');
        token2.classList.add('matched');
        this.audioController.match();
        if (this.matchedTokens.length === this.tokensArray.length)
            this.victory();
    }
    cardMisMatch(token1, token2) {
        this.busy = true;
        setTimeout(() => {
            token1.classList.remove('visible');
            token2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType(token) {
        return token.getElementsByClassName('card-icon')[0].src;
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
            else if (this.timeRemaining <= 10)
                this.warning();
        }, 1000);
    }
    warning() {
        this.audioController.warning();
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-ovr-txt').classList.add('visible');
    }
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('win-ovr-txt').classList.add('visible');
    }

    shuffleTokens() {
        for (let i = this.tokensArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.tokensArray[randIndex].style.order = i;
            this.tokensArray[i].style.order = randIndex;
        }
    }

    canFlipCard(token) {
        return !this.busy && !this.matchedTokens.includes(token) && token !== this.cardToCheck;
    }
}

function pview() {
    // let instructions = Array.from(document.getElementsByClassName('preview-txt'));
    //     let tokens = Array.from(document.getElementsByClassName('token'));
    //     let game = new FLIP2N2WIN(30, tokens);

    // instructions.forEach(instruction => {
    //     instruction.addEventListener('click', () => {
    //         instruction.classList.remove('visible');
    //     });
    // });

    //     tokens.forEach(token => {
    //         token.addEventListener('click', () => {
    //             game.flipCard(token);
    //         });
    //     });

    ready();
}

function ready() {
    let instructions = Array.from(document.getElementsByClassName('preview-txt'));
    let overlays = Array.from(document.getElementsByClassName('overlay-txt'));
    let tokens = Array.from(document.getElementsByClassName('token'));
    let game = new FLIP2N2WIN(30, tokens);

    instructions.forEach(instruction => {
        instruction.addEventListener('click', () => {
            instruction.classList.remove('visible');
            game.startGame();
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
    tokens.forEach(token => {
        token.addEventListener('click', () => {
            game.flipCard(token);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}