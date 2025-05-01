import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/setup";
import "./Home.css";
import Images from "../../assets/Images";


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();

      const confirmed = window.confirm("Are you sure you want to go back to Sign In?");
      if (confirmed) {
        auth.signOut();
        navigate("/signin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const cards = [
    { title: "List Page", image: Images.logo_list, path: "/list" },
    { title: "Add Page", image: Images.logo_add_data, path: "/add" },
    { title: "Person Data", image: Images.logo_personData, path: "/personrecords" },
    { title: "Add Payment", image: Images.logo_payement, path: "/payment" },
  ];

  return (
    <div className="home-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className="home-card"
          onClick={() => navigate(card.path)}
        >
          <img src={card.image} alt={card.title} className="home-card-img" />
          <h3 className="home-card-title">{card.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Home;
