import React from "react";
import "../css/Review.css";
import Orang1 from "../assets/images/orang1.jpeg";
import Orang2 from "../assets/images/orang2.jpeg";
import Orang3 from "../assets/images/orang3.jpeg";

const reviews = [
  {
    title: "Materinya Keren",
    comment:
      "Kamu bisa bereksperimen dengan warna dan teknik yang beragam untuk menciptakan tampilan yang unik dan menarik.",
    name: "Sharleen Jubaedah",
    profession: "Beautician, Itjeher Salon",
    image: Orang1,
  },
  {
    title: "Materinya Terstruktur",
    comment:
      "Materi tata rias disusun secara sistematis, mulai dari dasar-dasar hingga teknik riasan yang lebih kompleks.",
    name: "Rachmad Hakim",
    profession: "Barber, Putra Cipanas",
    image: Orang2,
  },
  {
    title: "Materinya Mudah",
    comment:
      "Tata rias itu gampang kok! Dengan panduan yang tepat, kamu bisa menguasai teknik-teknik dasar dan menciptakan riasan yang cantik sehari-hari.",
    name: "Alifia Nurul",
    profession: "Beauty Therapist, Bali Spa",
    image: Orang3,
  },
];

function ReviewCard({ title, comment, name, profession, image }) {
  return (
    <div className="card-review">
      <div className="card-review-text">
        <h2>{title}</h2>
        <p className="review-comments">{comment}</p>
        <div className="profile-container">
          <div className="profile-image">
            <img src={image} alt={name} />
          </div>
          <div className="profile-name">
            <h3 className="profile-title">{name}</h3>
            <p className="profile-profession">{profession}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Review({ scrollToService }) {
  return (
    <div className="review-container">
      <div className="overlay-review-container"></div>
      <div className="review-section-container">
        <div
          className="review-text-container"
          data-aos-offset="350"
          data-aos="fade-down"
          data-aos-once="false"
        >
          <p>Dipercaya oleh 100K+ Siswa</p>
          <h2>
            Join Our<br></br>Supportive Community
          </h2>
          <p className="review-comment">
            Kami telah membantu lebih dari 100.000 siswa untuk memulai karir
            sebagai barber, beautician, dan terapis spa.
          </p>
          <div className="button">
            <button className="button-review" onClick={scrollToService}>
              Mulai Belajar
            </button>
          </div>
        </div>

        {/* Container for looping cards */}
        <div
          className="review-person-container"
          data-aos-offset="350"
          data-aos="flip-left"
          data-aos-once="false"
        >
          <div className="review-carousel">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                title={review.title}
                comment={review.comment}
                name={review.name}
                profession={review.profession}
                image={review.image}
              />
            ))}
            {/* Duplicating cards for continuous effect */}
            {reviews.map((review, index) => (
              <ReviewCard
                key={`duplicate-${index}`}
                title={review.title}
                comment={review.comment}
                name={review.name}
                profession={review.profession}
                image={review.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
