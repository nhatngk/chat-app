import { useState } from "react";
const Search = () => {
  const [search, setSearch] = useState('');
  const handleSubmitSearch = (e) => {
    e.preventDefault();
  }
  const handleChange = (e) => {
    setSearch(e.target.value)
  }
  return (
    <form onSubmit={handleSubmitSearch} type="submit"
      className="mt-3 py-2 px-3 rounded-3xl bg-white border-blur border">
      <i className="fa-solid fa-magnifying-glass mr-2"></i>
      <input type="text" placeholder="Search..." className="outline-none" onChange={handleChange} />
    </form>
  )
}

export default Search