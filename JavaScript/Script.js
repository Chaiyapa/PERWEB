document.addEventListener("DOMContentLoaded", function () {
    let deck = [];
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function cardValue(card) {
        if (card.value === 'A') return 11;
        if (['K', 'Q', 'J'].includes(card.value)) return 10;
        return parseInt(card.value);
    }

    function calculateScore(cards) {
        let score = 0;
        let aces = 0;
        for (let card of cards) {
            score += cardValue(card);
            if (card.value === 'A') aces++;
        }
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        return score;
    }

    const dealerCardsDiv = document.getElementById('dealer-cards');
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerScoreP = document.getElementById('dealer-score');
    const playerScoreP = document.getElementById('player-score');
    const resultDiv = document.getElementById('result');
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const restartBtn = document.getElementById('restart-btn');

    let dealerCards = [];
    let playerCards = [];
    let gameOver = false;
    let playerStands = false;

    function startGame() {
        createDeck();
        shuffleDeck();
        dealerCards = [deck.pop(), deck.pop()];
        playerCards = [deck.pop(), deck.pop()];
        gameOver = false;
        playerStands = false;
        resultDiv.textContent = "";
        renderGame();
    }

    function renderGame() {
        dealerCardsDiv.innerHTML = "";
        playerCardsDiv.innerHTML = "";

        dealerCards.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = "card";

            if (index === 0 || playerStands) {
                cardDiv.textContent = card.value + card.suit;
            } else {
                cardDiv.textContent = "❓";
            }

            dealerCardsDiv.appendChild(cardDiv);
        });

        playerCards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = "card";
            cardDiv.textContent = card.value + card.suit;
            playerCardsDiv.appendChild(cardDiv);
        });

        let dealerScore = calculateScore(dealerCards);
        let playerScore = calculateScore(playerCards);

        if (!playerStands) {
            dealerScoreP.textContent = "คะแนน: " + cardValue(dealerCards[0]); 
        } else {
            dealerScoreP.textContent = "คะแนน: " + dealerScore;
        }
        playerScoreP.textContent = "คะแนน: " + playerScore;

        if (playerScore > 21) {
            resultDiv.textContent = "💥 คุณแพ้! เกิน 21";
            gameOver = true;
        }

        if (playerStands) {
            while (calculateScore(dealerCards) < 17) {
                if (calculateScore(dealerCards) === 17) break; // หยุดจั่วหากแต้มเป็น 17
                if (deck.length > 0) {
                    dealerCards.push(deck.pop());
                } else {
                    console.error("สำรับไพ่หมดแล้ว!");
                    break;
                }
            }
            dealerScore = calculateScore(dealerCards);
            dealerScoreP.textContent = "คะแนน: " + dealerScore;
            
            dealerCardsDiv.innerHTML = ""; // เคลียร์แล้วแสดงไพ่ใหม่
            dealerCards.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.className = "card";
                cardDiv.textContent = card.value + card.suit;
                dealerCardsDiv.appendChild(cardDiv);
            });

            if (dealerScore > 21) {
                resultDiv.textContent = "🎉 คุณชนะ! เจ้ามือเกิน 21";
            } else if (dealerScore > playerScore) {
                resultDiv.textContent = "💀 คุณแพ้!";
            } else if (dealerScore < playerScore) {
                resultDiv.textContent = "🎉 คุณชนะ!";
            } else {
                resultDiv.textContent = "😐 เสมอ!";
            }
            gameOver = true;
        }
    }

    hitBtn.addEventListener('click', () => {
        if (!gameOver && !playerStands) {
            if (deck.length > 0) {
                playerCards.push(deck.pop());
                renderGame();
            } else {
                console.error("❌ ไม่มีไพ่เหลือในสำรับ!");
            }
        }
    });

    standBtn.addEventListener('click', () => {
        if (!gameOver) {
            playerStands = true;
            renderGame();
        }
    });

    restartBtn.addEventListener('click', () => {
        startGame();
    });

    startGame();
});

