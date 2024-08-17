const canvas = document.getElementById('snakeCanvas'); // Canvas elementini seç
const ctx = canvas.getContext('2d'); // 2D çizim bağlamını al
const scoreElement = document.getElementById('score'); // Skor elementini seç
const maxScoreElement = document.getElementById('maxScore'); // Maksimum skor elementini seç

const box = 20; // Yılan ve yiyecek kutusunun boyutu
let snake = [{ x: 10 * box, y: 10 * box }]; // Yılanın başlangıç konumu
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box, type: 'strawberry' }; // İlk yiyecek
let d; // Yılanın hareket yönü
let gameOver = false; // Oyun bitişi durumu
let hunger = 100; // Beslenme durumu
let difficulty = 0; // Zorluk seviyesi
let score = 0; // Oyuncunun skoru
let maxScore = 0; // Maksimum skor
let lastDirection; // Son yön
let isPaused = false; // Oyunun duraklatılma durumu

document.addEventListener('keydown', direction); // Klavye olayları için dinleyici ekle

function direction(event) {
  if (gameOver) return;

  // "E" tuşuna basıldığında oyunu duraklat veya devam ettir
  if (event.keyCode === 69) {
    isPaused = !isPaused;
    if (!isPaused) {
      game(); // Oyunu tekrar başlat
    }
    return;
  }

  // Klavye tuşlarına göre yönü belirle
  if (!isPaused) {
    if (event.keyCode == 37 && d != 'RIGHT' && lastDirection != 'LEFT') {
      d = 'LEFT';
      lastDirection = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN' && lastDirection != 'UP') {
      d = 'UP';
      lastDirection = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT' && lastDirection != 'RIGHT') {
      d = 'RIGHT';
      lastDirection = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP' && lastDirection != 'DOWN') {
      d = 'DOWN';
      lastDirection = 'DOWN';
    }
  }
}

function updateHungerAndDifficulty() {
  if (snake.length > difficulty) {
    hunger += 5;
    difficulty += 1;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    // Yılanı çiz
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60'; // Baş ve gövde rengi
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = '#bdc3c7';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Gölge rengi
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Yiyeceği çiz
    ctx.fillStyle = '#f1c40f'; // Yiyecek rengi
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2); // Yuvarlak yiyecek
    ctx.fill();
    ctx.strokeStyle = '#f39c12'; // Yiyecek kenar rengi
    ctx.lineWidth = 2;
    ctx.stroke();

    // Yiyeceği çiz
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2); // Yuvarlak yiyecek
    ctx.fill();
    ctx.stroke();

    // Yılanın başını hareket ettir
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    // Yılanın sınırlara çarpmasını kontrol et
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
      gameOver = true;
    }

    // Yılanın kendine çarpmasını kontrol et
    for (let i = 1; i < snake.length; i++) {
      if (snakeX === snake[i].x && snakeY === snake[i].y) {
        gameOver = true;
      }
    }

    // Yiyeceği yediyse
    if (snakeX === food.x && snakeY === food.y) {
      // Yeni yiyecek pozisyonunun yılanın üzerinde olmadığından emin ol
      let newFoodPosition;
      do {
        newFoodPosition = {
          x: Math.floor(Math.random() * 20) * box,
          y: Math.floor(Math.random() * 20) * box,
          type: 'strawberry'
        };
      } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
      food = newFoodPosition;

      hunger += 10; // Yem yendikçe beslenme durumunu arttır
      score += 10; // Skoru arttır
      scoreElement.textContent = 'Score: ' + score;
    } else {
      snake.pop();
      hunger -= 1; // Her adımda beslenme durumunu azalt
    }

    // Yılanın yeni başını ekle
    const newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);
  }
}

function game() {
  if (!isPaused) {
    draw();
    updateHungerAndDifficulty();

    // Oyun bittiyse ekrana mesaj yaz
    if (gameOver) {
      if (score > maxScore) {
        maxScore = score; // Maksimum skoru güncelle
        maxScoreElement.textContent = 'Max Score: ' + maxScore;
      }
      ctx.font = '20px Arial';
      ctx.fillStyle = '#e74c3c';
      ctx.fillText('Game Over! Press any key to restart.', 25, canvas.height / 2);
      document.addEventListener('keydown', resetGame);
    } else {
      setTimeout(game, 100);
    }
  }
}

function resetGame() {
  // Oyunu sıfırla
  snake = [{ x: 10 * box, y: 10 * box }];
  d = undefined;
  food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box, type: 'strawberry' };
  gameOver = false;
  hunger = 100;
  difficulty = 0;
  score = 0;
  isPaused = false;
  scoreElement.textContent = 'Score: ' + score;
  document.removeEventListener('keydown', resetGame);
  game();
}

game(); // Oyunu başlat
