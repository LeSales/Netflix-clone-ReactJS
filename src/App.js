import React, { useEffect, useState } from "react";
import "./App.css";
import FeaturedMovie from "./components/FeaturedMovie";
import MovieRow from "./components/MovieRow";
import Tmdb from "./Tmdb";
import Header from "./components/Header";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer className="footer-text">
        <div >
          <p>Feito por Leandro Sales<br/>
          Direitos de imagem para Netflix<br/>
          Dados pegos do site Themoviedb.org<br/>
          </p>
        </div>
        <div className="contacts">
          <a href="https://www.linkedin.com/in/leandro-sales-87249059/" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon/>
          </a>
          <a href="https://github.com/LeSales" target="_blank" rel="noopener noreferrer">
          <GitHubIcon/>
          </a>
        </div>
      </footer>

      {movieList <= 0 && (
        <div className="loading">
          <img
            src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif"
            alt="Carregando"
          />
        </div>
      )}
    </div>
  );
};
