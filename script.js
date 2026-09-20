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

// 3. 學員好評資料
const testimonials = [
  {
    stars: "★★★★★",
    quote: "教練非常細心，三個月就看到明顯的體態變化，訓練過程也很有尊榮感！",
    author: "— 學員 陳小姐",
  },
  {
    stars: "★★★★★",
    quote: "課程規劃很專業，完全針對我的需求調整，推薦給想認真訓練的朋友。",
    author: "— 學員 林先生",
  },
  {
    stars: "★★★★★",
    quote: "環境舒適、教練用心，每次上課都很期待，是我這輩子最值得的投資。",
    author: "— 學員 王小姐",
  },
];

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

// 6. 動態產生學員好評卡片
function renderTestimonials() {
  const testimonialList = document.getElementById("testimonial-list");

  testimonials.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "testimonial-card";

    card.innerHTML = `
      <div class="stars">${item.stars}</div>
      <p class="quote">「${item.quote}」</p>
      <div class="author">${item.author}</div>
    `;

    testimonialList.appendChild(card);
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
  renderTestimonials();
  animateStats();
  setupContactForm();
});
