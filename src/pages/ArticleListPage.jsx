import React, { useContext, useState, useEffect } from "react";
import ReaderContext from "../utils/ReaderContext";
import ArticleListItem from "../components/ArticleListItem"
import Loader from "../utils/Loader";

const ArticleListPage = () => {
  let { authTokens, backendUrl } = useContext(ReaderContext);
  let [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false)

  const getFreshArticles = async () => {
    try {
      setLoading(true)
      let response = await fetch(`${backendUrl}api/reader/todays-articles/`, {
        headers: {
          "Authorization": `Bearer ${authTokens.access}`
        }
      });
      
      if (response.status === 200) {
        let data = await response.json();
        setArticles(data);
        console.log(data)
      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getFreshArticles();
  }, []);

  return (
    <div className="lg:w-[90%] mx-auto my-3">
      <h2 className="text-5xl font-bold mb-4 text-center lg:text-left">Todays Articles</h2>
      {loading && <Loader/>}
      {(articles !== null && articles.length > 0)
        ? articles.map((article, index) => (
            <ArticleListItem article={article} key={index || article.id} />
          ))
        : 
        (!loading && <p className="text-center my-5 font-bold text-2xl">No new articles published yet</p>)}
    </div>
  );
};

export default ArticleListPage;
