// ① おすすめする食べ物（価格と食事時間はサンプル）
const foods = [
  { name: "親子丼", price: 590, eatTime: 15, mood: "heavy", weather: ["sun", "rain", "hot", "cold"],shopType: "convenience"},
  { name: "うどん", price: 500, eatTime: 15, mood: "light", weather: ["sun", "rain", "cold"],shopType: "restaurant"},
  { name: "おにぎり", price: 360, eatTime: 6, mood: "light", weather: ["sun", "rain", "hot", "cold"],shopType: "convenience"},
  { name: "サンドイッチ", price: 300, eatTime: 10, mood: "light", weather: ["sun", "rain", "hot", "cold"],shopType: "convenience"},
  { name: "サラダ", price: 350, eatTime: 10, mood: "healthy", weather: ["sun", "rain", "hot", "cold"],shopType: "both"},
  { name: "お弁当", price: 480, eatTime: 15, mood: "heavy", weather: ["sun", "rain", "hot", "cold"],shopType: "both"},
  { name: "辛いラーメン", price: 750, eatTime: 20, mood: "spicy", weather: ["sun", "rain", "cold"],shopType: "both"},
  { name: "ドーナツ", price: 200, eatTime: 8, mood: "sweet", weather: ["sun", "rain", "hot", "cold"],shopType: "both"},
  { name: "温かいスープ", price: 350, eatTime: 10, mood: "warm", weather: ["rain", "cold"],shopType: "convenience"},
  { name: "冷やしうどん", price: 450, eatTime: 12, mood: "refreshing", weather: ["sun", "hot"],shopType: "restaurant"},
  { name: "チキン定食", price: 850, eatTime: 20, mood: "heavy", weather: ["sun", "rain", "hot", "cold"],shopType: "restaurant"},
  { name: "ケーキ", price: 600, eatTime: 15, mood: "sweet", weather: ["sun", "rain", "hot", "cold"],shopType: "convenience"},
  { name: "ざるそば", price: 600, eatTime: 15, mood: "refreshing", weather: ["sun", "hot"],shopType: "restaurant"},
  { name: "野菜スープ", price: 450, eatTime: 12, mood: "healthy", weather: ["rain", "cold"],shopType: "restaurant"},
  { name: "すっぱいレモングミ", price: 150, eatTime: 3, mood: "sour", weather: ["sun", "rain", "hot", "cold"], shopType: "convenience" },
  { name: "きゅうりの浅漬け", price: 200, eatTime: 5, mood: "sour", weather: ["sun", "rain", "hot", "cold"], shopType: "convenience" },
  { name: "フルーツヨーグルト", price: 180, eatTime: 5, mood: "sour", weather: ["sun", "rain", "hot", "cold"], shopType: "convenience" },
  { name: "レモン風味のパスタサラダ", price: 400, eatTime: 12, mood: "sour", weather: ["sun", "hot"], shopType: "convenience" },
  { name: "いなり寿司", price: 300, eatTime: 8, mood: "sour", weather: ["sun", "rain", "hot", "cold"], shopType: "both" },
];

// ② 時間の目安（分）
const waitTime = 5;    // 待ち時間（仮）
const safetyTime = 5;  // 余裕時間

// ③ ボタンを押したらおすすめを表示
function findFood() {
  const breakTime = Number(document.getElementById("breakTime").value);
  const budget = Number(document.getElementById("budget").value);
  const mood = document.getElementById("mood").value;
  const weather = document.getElementById("weather").value;
  const message = document.getElementById("message");
  const result = document.getElementById("result");

  message.textContent = "";
  result.replaceChildren();

  if (!breakTime || !budget || !mood || !weather) {
    message.textContent = "すべての条件を選んでください。";
    return;
  }

  // 予算・気分・天気で選ぶ。
  // 移動時間はまだ不明なので、食事＋待ち＋余裕時間だけ先に確認する。
  const recommendations = foods.filter(function(food) {
    const budgetOK = food.price <= budget;
    const moodOK = mood === "any" || food.mood === mood;
    const weatherOK = food.weather.includes(weather);
    const minimumTime = food.eatTime + waitTime + safetyTime;
    const timeOK = minimumTime <= breakTime;
    return budgetOK && moodOK && weatherOK && timeOK;
  });

  if (recommendations.length === 0) {
    message.textContent = "条件に合う食べ物が見つかりませんでした。条件を変えてみてください。";
    return;
  }

  const title = document.createElement("h2");
  title.textContent = "🍽️ おすすめの食事";
  result.appendChild(title);

  recommendations.forEach(function(food) {
    // おすすめの食べ物ごとにカードを作る
    const card = document.createElement("article");
    card.className = "food-card";

    const name = document.createElement("h3");
    name.textContent = "🍱 " + food.name;
    card.appendChild(name);

    const price = document.createElement("p");
    price.textContent = "💰 参考価格：約" + food.price + "円";
    card.appendChild(price);

    const eat = document.createElement("p");
    eat.textContent = "🍽️ 食事時間の目安：約" + food.eatTime + "分";
    card.appendChild(eat);

    // Google Maps で食べ物を検索（APIキー不要）
    const mapLink = document.createElement("a");
    mapLink.className = "map-link";
    mapLink.textContent = "🗺️ Google Mapsで近くのお店を探す";
    
let searchWord = "";

if (food.shopType === "convenience") {
  searchWord = "近くのコンビニ";
} else if (food.shopType === "restaurant") {
  searchWord = food.name + " 近くの飲食店";
} else if (food.shopType === "both") {
  searchWord = food.name + " 近くの店 コンビニ";
}

mapLink.href =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(searchWord);
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    card.appendChild(mapLink);

    const note = document.createElement("p");
    note.className = "note";
    note.textContent = "地図でお店・実際の価格・徒歩時間を確認してください。";
    card.appendChild(note);

    // 徒歩時間を入力して計算
    const checkBox = document.createElement("div");
    checkBox.className = "time-check";

    const label = document.createElement("label");
    label.textContent = "🚶 Google Mapsで確認した片道徒歩時間（分）";
    const walkInput = document.createElement("input");
    walkInput.type = "number";
    walkInput.min = "0";
    walkInput.max = "180";
    walkInput.step = "1";
    walkInput.placeholder = "例：5";
    label.appendChild(walkInput);
    checkBox.appendChild(label);

    const checkButton = document.createElement("button");
    checkButton.type = "button";
    checkButton.textContent = "⏱️ 休憩時間に間に合うか確認";
    checkBox.appendChild(checkButton);

    const judgment = document.createElement("p");
    judgment.className = "judgment";
    judgment.setAttribute("role", "status");
    checkBox.appendChild(judgment);

    checkButton.addEventListener("click", function() {
      if (walkInput.value.trim() === "") {
        judgment.className = "judgment ng";
        judgment.textContent = "片道徒歩時間を入力してください。";
        return;
      }

      const walkTime = Number(walkInput.value);
      if (!Number.isInteger(walkTime) || walkTime < 0 || walkTime > 180) {
        judgment.className = "judgment ng";
        judgment.textContent = "0〜180の整数を入力してください。";
        return;
      }

      // 往復移動時間 ＋ 食事時間 ＋ 待ち時間 ＋ 余裕時間
      const totalTime = walkTime * 2 + food.eatTime + waitTime + safetyTime;
      const remaining = breakTime - totalTime;

      if (remaining >= 0) {
        judgment.className = "judgment ok";
        judgment.textContent = "✅ 合計約" + totalTime + "分。休憩時間内に戻れる見込みです（残り" + remaining + "分）。";
      } else {
        judgment.className = "judgment ng";
        judgment.textContent = "⚠️ 合計約" + totalTime + "分。休憩時間を" + (-remaining) + "分超える見込みです。";
      }
    });

    card.appendChild(checkBox);
    result.appendChild(card);
  });
}

// ④ 検索ボタンと関数をつなぐ
document.getElementById("searchButton").addEventListener("click", findFood);
