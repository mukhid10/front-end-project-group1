import "./HomePage.css";
import MainFooter from "../../components/MainFooter";
import Bookoftheday from "./Bookoftheday";
import TopPicks from "./TopPicks/TopPicks";
import { useState } from "react";
import axios from "axios";
import BookCard from "../../components/BookCard";

function HomePage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  async function getData() {
    const hasil = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${search}&&startIndex=0&maxResults=20`
    );
    let limitData = [];
    for (let i = 0; i < 6; i++) {
      limitData.push(hasil.data.items[i]);
    }

    filterData(limitData);
  }

  function filterData(datas) {
    const filteredData = [];

    for (const data of datas) {
      if (
        data.volumeInfo.imageLinks &&
        data.accessInfo.viewability !== "NO_PAGES"
      ) {
        const book = {
          id: data.id,
          judul: data.volumeInfo.title,
          cover: data.volumeInfo.imageLinks.thumbnail,
          penulis: data.volumeInfo.authors,
          date: data.volumeInfo.publishedDate,
          penerbit: data.volumeInfo.publisher,
          deskripsi: data.volumeInfo.description,
          readlink: data.volumeInfo.previewLink,
          price: undefined,
          buylink: undefined,
          amount: 1,
        };

        if (data.saleInfo.saleability === "FOR_SALE") {
          book.price = data.saleInfo.retailPrice.amount;
          book.buylink = data.saleInfo.buyLink;
        }

        filteredData.push(book);
      }
    }

    //console.log(filteredData);
    setData(filteredData);
  }

  function handleSubmit(e) {
    e.preventDefault();
    getData();
  }

  return (
    <>
      <div
        className="HomePage d-flex justify-content-center align-items-center flex-column"
        style={{ minHeight: "90vh" }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="text-center">
              <h1>Mau Baca apa Hari ini</h1>
            </div>
            <div className="col-md-7 offset-md-3 col-sm-7 offset-sm-3">
              <form onSubmit={(e) => handleSubmit(e)} className="d-flex">
                <input
                  className="form-control text-light me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  style={{ background: "rgba(0, 0, 0, 0.1)" }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />

                <button type="submit" className="btn btn-success fw-bold">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center  mt-4 container mb-4">
          <div className="row d-flex justify-content-center">
            {data.map((d, index) => (
              <BookCard data={d} key={index} />
            ))}
          </div>
        </div>
      </div>
      <Bookoftheday />
      <TopPicks />
      <MainFooter />
    </>
  );
}

export default HomePage;
