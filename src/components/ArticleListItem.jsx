import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ReaderContext from '../utils/ReaderContext';
const ArticleListItem = ({article}) => {

    let {isSmallScreen, backendUrl} = useContext(ReaderContext)

    return (
      <Link to={`/article/${article.id}`} className='lg:w-[90%]'>
    <div
        className="my-2 bg-black bg-opacity-30 hover:translate-x-10 transition-all
      rounded flex p-3 shadow-xl flex-col"
      >
        <div className='flex'>
          <div>
            {isSmallScreen && article.image && <img 
          className="shadow-xl block rounded mx-auto max-h-[250px] object-cover my-auto"
          src={article.image.url} alt='...'/>}
          
          <p className="font-extrabold text-3xl lg:text-4xl">{!isSmallScreen ? article.title : article.title.substring(0,40) + "..."}</p>
          <p className="font-bold text-2xl">{!isSmallScreen ? article.sub_title : article.sub_title.substring(0, 30) + "..."}</p>
          <p
            className="text-xl"
            dangerouslySetInnerHTML={{
              __html: article.content.substring(0,100) + "..."
            }}
          ></p>
          </div>
          {!isSmallScreen && article.image && <img 
          className="shadow-xl block rounded w-[30%] max-h-[250px] object-cover mx-2 my-auto"
          src={article.image.url} alt='...'/>}
          </div>
          <div className="flex items-center">
            <p className="border rounded text-center p-1 border-black">
              {article.category?.name}
            </p>
          <p className="font-bold mx-2">{article.author?.name}</p>

            <p className='ml-auto'>
              {new Date(article.publish_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
      </div>
        </Link>
      )
}

export default ArticleListItem;