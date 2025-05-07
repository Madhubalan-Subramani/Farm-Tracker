import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import allImages from "../../assets/CloudinaryImages";

const Home = () => {
  const navigate = useNavigate();
  const cards = [
    {
      title: "List Page",
      image: allImages.homepageImages.logo_list,
      path: "/list",
    },
    {
      title: "Add Page",
      image: allImages.homepageImages.logo_add_data,
      path: "/add",
    },
    {
      title: "Person Records",
      image: allImages.homepageImages.logo_personData,
      path: "/personrecords",
    },
    {
      title: "Add Payment",
      image: allImages.homepageImages.logo_payement,
      path: "/payment",
    },
  ];

  return (
    <div className="home-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`home-card home-card-animate-${index + 1}`}
          onClick={() => navigate(card.path)}
        >
          <img src={card.image} alt={card.title} className="home-card-image" />
          <h3 className="home-card-title">{card.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Home;
