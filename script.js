// ========================================
// 健身教學網站 - 主要程式邏輯
// 所有互動功能都寫在這個檔案裡
// ========================================

// 1. 課程資料
// 用一個陣列存放所有課程資訊，之後要新增課程只要在這裡加一筆資料就好
const courses = [
  {
    title: "一對一尊爵體能訓練",
    desc: "針對個人體能與目標，量身打造專屬奢華訓練菜單。",
    price: "NT$ 2,200 / 堂",
  },
  {
    title: "重量訓練入門班",
    desc: "適合新手，學習正確姿勢，打好肌力訓練基礎。",
    price: "NT$ 1,500 / 堂",
  },
  {
    title: "VIP 小團體訓練課",
    desc: "2-4 人一起訓練，尊榮陪伴、互相激勵，氣氛更有趣。",
    price: "NT$ 1,000 / 堂 / 人",
  },
];

// 2. 特色資料（為什麼選我們）
const features = [
  {
    icon: "🏆",
    title: "專業認證教練",
    desc: "擁有多張國際健身教練證照，訓練方法安全且有效。",
  },
  {
    icon: "🎯",
    title: "客製化訓練菜單",
    desc: "依照每位學員的體態與目標，量身規劃專屬課程。",
  },
  {
    icon: "🥇",
    title: "尊榮一對一服務",
    desc: "全程專注陪伴，即時調整動作，訓練品質有保障。",
  },
  {
    icon: "🌟",
    title: "彈性預約時段",
    desc: "配合忙碌生活型態，提供多元時段供學員選擇。",
  },
];

// 3. Supabase 連線設定
// 這裡的網址跟金鑰是「公開金鑰」，只能讀取/新增資料，不能刪除或修改別人的資料，可以放心寫在前端
const SUPABASE_URL = "https://vuwlmmsstzhqbiglityg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1d2xtbXNzdHpocWJpZ2xpdHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzIyNTYsImV4cCI6MjEwNTQ0ODI1Nn0.V3GWt75WLEkvmauDb-K0LsmevSYM3JdeL5UVUzxe7V8";

// 用 Supabase 官方函式庫建立連線物件，之後讀寫資料庫都靠它
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 把數字評分（例如 5）轉成星星文字（例如 ★★★★★），方便顯示
function starsToText(starCount) {
  return "★".repeat(starCount) + "☆".repeat(5 - starCount);
}

// 4. 動態產生課程卡片
// 這個函式會把上面 courses 陣列裡的每一筆資料，變成一張課程卡片放進網頁裡
function renderCourses() {
  const courseList = document.getElementById("course-list");

  courses.forEach(function (course) {
    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.desc}</p>
      <div class="price">${course.price}</div>
    `;

    courseList.appendChild(card);
  });
}

// 5. 動態產生特色卡片
function renderFeatures() {
  const featureList = document.getElementById("feature-list");

  features.forEach(function (feature) {
    const card = document.createElement("div");
    card.className = "feature-card";

    card.innerHTML = `
      <div class="icon">${feature.icon}</div>
      <h3>${feature.title}</h3>
      <p>${feature.desc}</p>
    `;

    featureList.appendChild(card);
  });
}

// 6. 把一筆學員回饋資料，變成一張卡片並加到畫面最上方（最新的排最前面）
function addTestimonialCard(item) {
  const testimonialList = document.getElementById("testimonial-list");

  const card = document.createElement("div");
  card.className = "testimonial-card";

  card.innerHTML = `
    <div class="stars">${starsToText(item.stars)}</div>
    <p class="quote">「${item.quote}」</p>
    <div class="author">— 學員 ${item.name}</div>
  `;

  testimonialList.prepend(card); // prepend 讓最新的評論顯示在最上面
}

// 7. 從 Supabase 資料庫讀取所有學員回饋，並顯示在畫面上
async function loadTestimonials() {
  const testimonialList = document.getElementById("testimonial-list");

  // 依照建立時間新到舊排序
  const { data, error } = await supabaseClient
    .from("testimonials")
    .select("name, quote, stars")
    .order("created_at", { ascending: false });

  // 清空原本的「載入中...」文字
  testimonialList.innerHTML = "";

  if (error) {
    console.error("讀取學員回饋失敗：", error);
    testimonialList.innerHTML = `<p class="loading-text">好評載入失敗，請稍後再試。</p>`;
    return;
  }

  if (!data || data.length === 0) {
    testimonialList.innerHTML = `<p class="loading-text">目前還沒有學員回饋，快來當第一位吧！</p>`;
    return;
  }

  data.forEach(function (item) {
    addTestimonialCard(item);
  });
}

// 8. 處理學員回饋表單送出：把資料寫進 Supabase，成功後馬上顯示在畫面上
function setupTestimonialForm() {
  const form = document.getElementById("testimonial-form");
  const result = document.getElementById("testimonial-result");

  form.addEventListener("submit", async function (event) {
    // 阻止表單預設的送出行為（避免整頁重新整理）
    event.preventDefault();

    const name = document.getElementById("t-name").value.trim();
    const stars = parseInt(document.getElementById("t-stars").value, 10);
    const quote = document.getElementById("t-quote").value.trim();

    // 先把按鈕暫時關閉，避免使用者重複點擊送出
    const submitButton = form.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "送出中...";

    const newTestimonial = { name: name, quote: quote, stars: stars };

    // 把資料寫進 Supabase 的 testimonials 資料表
    const { error } = await supabaseClient.from("testimonials").insert(newTestimonial);

    submitButton.disabled = false;
    submitButton.textContent = "送出回饋";

    if (error) {
      console.error("新增學員回饋失敗：", error);
      result.textContent = "送出失敗，請稍後再試一次。";
      result.style.color = "#ff6b6b";
      return;
    }

    // 成功後，直接把這筆新回饋加到畫面最上面，不用重新整理頁面
    addTestimonialCard(newTestimonial);

    result.textContent = `謝謝 ${name} 的分享，您的回饋已經送出！`;
    result.style.color = ""; // 恢復預設的成功顏色

    form.reset();
  });
}

// 7. 數字統計動畫
// 讓數字從 0 慢慢跳到目標數字，看起來更有質感
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  statNumbers.forEach(function (el) {
    const target = parseInt(el.getAttribute("data-target"), 10); // 目標數字
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60)); // 控制跳動速度

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 25);
  });
}

// 8. 處理聯絡表單送出
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const result = document.getElementById("form-result");

  form.addEventListener("submit", function (event) {
    // 阻止表單預設的送出行為（避免整頁重新整理）
    event.preventDefault();

    const name = document.getElementById("name").value;

    result.textContent = `謝謝 ${name}，我們已經收到您的訊息，會盡快與您聯繫！`;

    form.reset();
  });
}

// 9. 網頁載入完成後，執行以上所有功能
document.addEventListener("DOMContentLoaded", function () {
  renderCourses();
  renderFeatures();
  loadTestimonials(); // 從 Supabase 讀取學員回饋
  animateStats();
  setupContactForm();
  setupTestimonialForm(); // 設定學員回饋表單的送出邏輯
});
