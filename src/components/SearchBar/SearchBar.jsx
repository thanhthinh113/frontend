import "./SearchBar.css";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  // Không cần onSearch — chỉ cần truyền giá trị về FoodDisplay

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Tìm kiếm món ăn..."
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}
