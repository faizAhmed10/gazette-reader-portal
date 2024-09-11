import React from "react";

const Hamburger = ({
  selectedAuthor,
  setSelectedAuthor,
  authors,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedDate,
  setSelectedDate,
  getArticlesByQuery,
}) => {
  return (
    <div>
      <aside className="flex flex-col mx-auto w-full">
        <h3 className="text-2xl my-2 text-white">Filters</h3>
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="bg-white rounded p-2 my-2"
        >
          <option value="">All Authors</option>
          {authors &&
            authors.map((author, index) => (
              <option key={index} value={author.name}>
                {author.name}
              </option>
            ))}
        </select>

        {/* Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className=" bg-white rounded p-2 my-2"
        >
          <option value="">All Categories</option>
          {categories &&
            categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>

        {/* Date Filter Input */}
        <label htmlFor="dt" className="text-white">Click here to set date</label>
        <input
          type="date"
          id="dt"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded p-2 border border-black bg-white text-black my-2"
          style={{
            color: "black", // Ensure text color is black
            backgroundColor: "white", // Ensure background color is white
          }}
        />

        {/* Filter Button */}
        <button
          onClick={getArticlesByQuery}
          className="bg-white font-bold p-2 mx-auto rounded"
        >
          Filter Articles
        </button>
      </aside>
    </div>
  );
};

export default Hamburger;
