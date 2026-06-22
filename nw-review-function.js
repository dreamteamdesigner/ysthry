document.addEventListener('DOMContentLoaded', () => {

/* ----------  CONFIG  ---------- */
const STORAGE_KEY   = 'recentReviews';
const MAX_AGE_MS    = 1000 * 60 * 60;          // 1 hour
const container     = document.querySelector('.reviews-grid');
const form          = document.querySelector('.review-form');
const sortSelect    = document.getElementById('nnn');

/* ----------  HELPERS  ---------- */
const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    return user[0] + '*'.repeat(Math.max(user.length - 2, 0)) + user.slice(-1) + '@' + domain;
};

const paintStars = (rating) => {
    const full  = '★'.repeat(rating);
    const empty = '★'.repeat(5 - rating).split('').map(s => `<span style="color:#0055ff52">${s}</span>`).join('');
    return full + empty;
};

const dateIso  = (ts) => new Date(ts).toISOString().slice(0, 10);             // YYYY‑MM‑DD
const dateNice = (ts) => new Date(ts).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

/* ----------  DOM ↔ DATA  ---------- */
function buildReviewHTML({ name, email, rating, text, timestamp }) {
    const div = document.createElement('div');
    div.className = 'review';
    div.dataset.date = dateIso(timestamp);                                       // for sorting
    div.innerHTML = `

        <div class="fio">
            <span aria-label="Rating: 2 stars" style="font-size: 16px; color: #0055ff;">
                <span>${paintStars(rating)}</span>
            </span>
            <p>${text}</p>
        </div>

        <div class="rev-top">
            <div class="dp">
                ${name[0].toUpperCase()}
            </div>
            <div class="sider">
                <span style="font-size: 15px;">${name}</span>  
                <div class="st-dt">
                    <span>${maskEmail(email)}</span>
                    <div class="spacer">
                        
                    </div>    
                    <div class="date">
                        <span>${dateNice(timestamp)}</span>
                    </div>
                </div>
            </div>
        </div>

    `;
    return div;
}

/* ----------  SORTING  ---------- */
//   const getRating = el => +el.querySelector('[aria-label]')
//                             .getAttribute('aria-label')
//                             .match(/(\d+)/)[1];

//   const getDate   = el => new Date(el.dataset.date);

//   function sortReviews(order) {
//     const reviews = [...container.children];
//     reviews.sort((a, b) => {
//       if (order === 'newest')  return getDate(b) - getDate(a);
//       if (order === 'oldest')  return getDate(a) - getDate(b);
//       if (order === 'highest') return getRating(b) - getRating(a);
//       if (order === 'lowest')  return getRating(a) - getRating(b);
//       return 0;
//     });
//     container.replaceChildren(...reviews);
//   }

//   sortSelect.addEventListener('change', () => sortReviews(sortSelect.value));

/* ----------  PERSISTENCE  ---------- */
function loadStoredReviews() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    let arr;
    try { arr = JSON.parse(raw); }
    catch { localStorage.removeItem(STORAGE_KEY); return []; }

    const fresh = arr.filter(r => Date.now() - r.timestamp < MAX_AGE_MS);
    if (fresh.length !== arr.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); // prune expired
    }
    return fresh;
}

function saveStoredReviews(reviewsArr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsArr));
}

/* ----------  REPLAY  ---------- */
const stored = loadStoredReviews();
stored.forEach(obj => container.prepend(buildReviewHTML(obj)));

/* ----------  FORM SUBMIT  ---------- */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name   = document.getElementById('name')?.value.trim();
    const email  = document.getElementById('email')?.value.trim();
    const text   = document.getElementById('message')?.value.trim();
    const rating = form.querySelector('input[name="rating"]:checked')?.value;

    if (!name || !email || !rating) {
    alert('Fill every field and choose a star rating.');
    return;
    }

    const data = {
    name,
    email,
    text,
    rating: +rating,
    timestamp: Date.now()
    };

    /* show immediately */
    container.prepend(buildReviewHTML(data));

    /* persist */
    stored.push(data);
    saveStoredReviews(stored);

    form.reset();
});

/* initial sort after replay */
//   sortReviews(sortSelect.value);
});
