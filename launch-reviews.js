const reviewsContainer = document.querySelector(".reviews-grid");

const paintStars = (rating) => {
    const full = '★'.repeat(rating);
    const empty = '★'
        .repeat(5 - rating)
        .split('')
        .map(s => `<span style="color:#0055ff52">${s}</span>`)
        .join('');

    return full + empty;
};

fetch("/reviews.json")
  .then(response => response.json())
  .then(reviews => {

    // Sort newest to oldest
    reviews.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    reviews.forEach(review => {

      const formattedDate = new Date(review.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });

      const maskedEmail = maskEmail(review.email);

      const reviewCard = document.createElement("div");
      reviewCard.classList.add("review");

      reviewCard.innerHTML = `

        <div class="fio">
            <span aria-label="Rating: 2 stars" style=" letter-spacing: 3px ;font-size: 17px; color: #0055ff;">
                ${paintStars(review.rating)}
            </span>
            <p>${review.message}</p>
        </div>

        <div class="rev-top">
            <div class="dp">
                ${review.name[0].toUpperCase()}
            </div>
            <div class="sider">
                <span style="font-size: 15px;">${review.name}</span>  
                <div class="st-dt">
                    <span>${maskedEmail}</span>
                    <div class="spacer">
                        
                    </div>    
                    <div class="date">
                        <span>${formattedDate}</span>
                    </div>
                </div>
            </div>
        </div>
        
      `;

      reviewsContainer.appendChild(reviewCard);

    });

  })
  .catch(error => {
    console.error("Failed to load reviews:", error);
  });

// function maskEmail(email) {

//   if (!email) return "";

//   const [username, domain] = email.split("@");

//   if (username.length <= 2) {
//     return (
//       username[0] +
//       "*".repeat(Math.max(username.length - 2, 0)) + 
//       username.slice(-1) +
//       "@" +
//       domain
//     );
//   }

//   return (
//     username[0] +
//     "*".repeat(username.length - 2) +
//     username.slice(-1) +
//     "@" +
//     domain
//   );
// }


function maskEmail(email) {

  if (!email) return "";

  const [username, domain] = email.split("@");

  return `${username.slice(0, 1)}******${username.slice(-1)}@${domain}`;
}