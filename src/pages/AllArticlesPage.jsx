import React, { useContext, useEffect, useState } from "react";
import ReaderContext from "../utils/ReaderContext";
import ArticleListItem from "../components/ArticleListItem";
import Loader from "../utils/Loader";
import Hamburger from "../components/Hamburger";
import { FaTimes, FaFilter } from "react-icons/fa";

const AllArticlesPage = () => {
  let { authTokens } = useContext(ReaderContext);
  const [articles, setArticles] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayFilter, setDisplayFilter] = useState(false)

  const toggleDisplayFilter = () => {
    setDisplayFilter(!displayFilter)
  }

  const getArticlesByQuery = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      if (selectedAuthor) queryParams.append("author", selectedAuthor);
      if (selectedCategory) queryParams.append("category", selectedCategory);
      if (selectedDate) queryParams.append("date", selectedDate);

      const url = `/api/reader/articles/?${queryParams.toString()}`;
      let response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.status !== 204) {
        let data = await response.json();
        setArticles(data.results);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorsCategories = async () => {
    try {
      setLoading(true);
      const authorResponse = await fetch("/api/reader/get-authors/", {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      const authorData = await authorResponse.json();
      setAuthors(authorData);

      const categoryResponse = await fetch("/api/reader/get-categories/", {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    getArticlesByQuery();
    fetchAuthorsCategories();
  }, []);

  return (
    <div className="lg:w-[90%] mx-auto my-3 ">
      {loading && <Loader />}
      <div>
        <div className={"flex items-center justify-between w-[90%] mx-auto"}> 
        <h2 className="text-5xl font-bold lg:text-left text-center mb-4">
          All Articles
        </h2>
        <button className="font-bold" onClick={toggleDisplayFilter}>{displayFilter ? <FaTimes size={24}/> : <FaFilter size={24}/>}</button>
        </div>
        {/* Display Articles */}
        <div>
          {articles !== null && articles.length > 0
            ? articles.map((article, index) => (
                <ArticleListItem article={article} key={index} />
              ))
            : !loading && (
                <p className="text-center my-5 font-bold text-2xl">
                  No articles published yet
                </p>
              )}
        </div>
      </div>

      {articles && (
        <div className={`fixed z-50 top-0 left-0 h-[100dvh] w-1/2 bg-black p-5 flex flex-col gap-6 items-center transform transition-transform duration-300 lg:w-1/5   ${
          displayFilter ? "translate-x-0" : "-translate-x-full"
        } `}>
        <Hamburger
        selectedAuthor = {selectedAuthor} setSelectedAuthor = {setSelectedAuthor} authors = {authors} selectedCategory = {selectedCategory} setSelectedCategory = {setSelectedCategory} categories = {categories} selectedDate = {selectedDate} setSelectedDate = {setSelectedDate} getArticlesByQuery = {getArticlesByQuery} 
        />
        </div>
      )}

    </div>
  );
};

export default AllArticlesPage;
