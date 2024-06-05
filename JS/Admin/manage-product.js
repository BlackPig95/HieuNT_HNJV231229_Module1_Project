//Khai báo mục edit lên đầu để truy cập không bị lỗi
const productTableBody = document.querySelector("#product-table-body");//Lấy reference tới table body
const manageMovieSection = document.querySelector(".manage-movie");
const addMovieSection = document.querySelector("#add-movie-form");//Lấy ra các form để bật tắt hiển thị
const editMovieSection = document.querySelector("#edit-movie-form");
let editIndex = -1;
// Khu vực manage product
const CONSTANT = //Global Constant Object để tiện quản lý các biến tái sử dụng và bớt rác hệ thống
{
    productData: "product-movie-data",
    hidden: "hidden",
    bookTicket: "../../HTML/BookingTicket/book-ticket.html",
    movieShowTime: [ "9:00 a.m 22-05-2024", "9:30 p.m 22-05-2024", "17 p.m 23-05-2024" ],
};
// const initialProductData = [//Giả định một số dữ liệu ban đầu
//     {
//         spotlight: true,
//         movieName: "GodzillaXKong",//Phải dùng escape character để dẫn link
//         imageUrl: "../../Images/Product_Data/GxK.jpg",
//         category: "Kaiju",
//         ticketPrice: 50000,
//         openingDate: "2024-5-22",
//         description: "Some description",
//         bookingUrl: CONSTANT.bookTicket,
//         showTime: CONSTANT.movieShowTime,
//     },
//     {
//         spotlight: true,
//         movieName: "Oppenheimer",
//         imageUrl: "../../Images/Product_Data/Oppenheimer.jpg",
//         category: "Drama",
//         ticketPrice: 60000,
//         openingDate: "2024-6-26",
//         description: "Some description",
//         bookingUrl: CONSTANT.bookTicket,
//         showTime: CONSTANT.movieShowTime,
//     },
//     {
//         spotlight: true,
//         movieName: "Interstella",
//         imageUrl: "../../Images/Product_Data/Interstella.jpg",
//         category: "Scifi",
//         ticketPrice: 60000,
//         openingDate: "2024-7-27",
//         description: "Some description",
//         bookingUrl: CONSTANT.bookTicket,
//         showTime: CONSTANT.movieShowTime,
//     }
// ];
// localStorage.setItem(CONSTANT.productData, JSON.stringify(initialProductData));

//------------------------------------------------------------------------------------------------------
//Commet lại code render cũ để dùng pagination
// function RenderMovieData()//Hàm render dữ liệu ra màn hình trang quản lý các bộ phim đang chiếu
// {
//     const productMovieData = JSON.parse(localStorage.getItem(CONSTANT.productData)) || [];
//     const newFragment = document.createDocumentFragment();
//     productTableBody.innerHTML = "";//Làm mới table body mỗi lần render để tránh ghi đè dữ liệu
//     for (let i = 0; i < productMovieData.length; i++)
//     {
//         const newTr = document.createElement("tr");
//         const newMovie = productMovieData[ i ];
//         newTr.innerHTML = `
//         <td>${ newMovie.spotlight === true ? "Yes" : "No" }</td>
//         <td>${ newMovie.movieName }</td>
//         <td>${ newMovie.imageUrl }</td>
//         <td>${ newMovie.category }</td>
//         <td>${ newMovie.ticketPrice }</td>
//         <td>${ newMovie.openingDate }</td>
//         <td>
//         <a onclick="EditMovieInfo(${ i })" href="#" style="text-decoration: none; color: white;">
//         <button onclick="ChangeSection('edit')" class="edit-button cursor-pointer">Edit</button></a>
//             <button onclick="DeleteMovie(${ i })" class="delete-button">Delete</button>
//         </td>
//         `;//Gắn sự kiện chuyển trang vào button, và sự kiện update info vào thẻ a
//         newFragment.appendChild(newTr);
//     }
//     productTableBody.appendChild(newFragment);
// }
// RenderMovieData();//Render khi vừa load trang
//------------------------------------------------------------------------------------------------------------------

function DeleteMovie(index)//Hàm xóa phim ra khỏi danh sách
{
    Swal.fire({
        title: "Xóa phim này?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Hủy",
        confirmButtonText: "Tiếp tục xóa"
    }).then((result) =>
    {
        if (result.isConfirmed)
        {
            const productMovieData = JSON.parse(localStorage.getItem(CONSTANT.productData)) || [];
            productMovieData.splice(index, 1);
            localStorage.setItem(CONSTANT.productData, JSON.stringify(productMovieData));
            DisplayRows(productMovieData, currentPage);
        }
    });
}
function ChangeSection(sectionName)//Hàm để thay đổi khu vực hiển thị
{
    if (sectionName == "add")//Kiểm tra xem nút add hay nút edit đang được bấm
    {
        manageMovieSection.classList.add(CONSTANT.hidden);
        editMovieSection.classList.add(CONSTANT.hidden);
        addMovieSection.classList.remove(CONSTANT.hidden);//Thêm class hidden vào những phần cần ẩn đi
    }
    else if (sectionName == "edit")
    {
        manageMovieSection.classList.add(CONSTANT.hidden);
        addMovieSection.classList.add(CONSTANT.hidden);
        editMovieSection.classList.remove(CONSTANT.hidden);
    }
}

//Khu vực add product
const addMovieForm = document.querySelector("#add-movie-form");
const movieNameInput = document.querySelector("#movie-name-input");
const ticketPriceInput = document.querySelector("#ticket-price-input");
const movieCategory = document.querySelector("#category-input");
const openingDateInput = document.querySelector("#opening-date-input");
const imageUrlInput = document.querySelector("#img-button");//Tạm thời chưa dùng đến nút này
const movieDescription = document.querySelector("#movie-description");
const submitButton = document.querySelector("#submit-button");
const spotlightInput = document.querySelector("#spotlight-input");

let filePath = "";//Tạo biến rỗng để lưu tên của hình ảnh được truyền vào, biến này sẽ được thay đổi với sự kiện onchange
addMovieForm.addEventListener("submit", (e) =>
{
    e.preventDefault();
    if (!ValidateInput(movieNameInput.value, movieCategory.value, ticketPriceInput.value, openingDateInput.value, movieDescription.value))
        return;//Không thực hiện push object nếu validate input trả về false
    const getMovieProduct = JSON.parse(localStorage.getItem(CONSTANT.productData));
    const newMovie = {//Tạo object mới chứa các thông tin về movie mới được thêm
        spotlight: spotlightInput.checked ? true : false,//Kiểm tra xem checkbox có được đánh dấu không
        movieName: movieNameInput.value,
        imageUrl: "../../Images/Product_Data/" + filePath,//Gán đường dẫn file
        category: movieCategory.value,
        ticketPrice: +ticketPriceInput.value,
        openingDate: openingDateInput.value,
        description: movieDescription.value,
        bookingUrl: CONSTANT.bookTicket,
        showTime: CONSTANT.movieShowTime,
    };
    getMovieProduct.push(newMovie);
    localStorage.setItem(CONSTANT.productData, JSON.stringify(getMovieProduct));
    window.location.href = "manage-product.html";//Redirect về trang quản lý phim sau khi đã push xong phim mới
});

let imageUrl = (files) =>//Hàm được gọi khi có sự kiện onchange ở input file
{
    if (files.length > 0)
    {
        filePath = files[ 0 ].name;//Lấy tên file
    }
};
//Khu vực edit product
const editMovieForm = document.querySelector("#edit-movie-form");
const movieNameEdit = document.querySelector("#movie-name-edit");
const ticketPriceEdit = document.querySelector("#ticket-price-edit");
const categoryEdit = document.querySelector("#category-edit");
const openingDateEdit = document.querySelector("#opening-date-edit");
const imageButtonEdit = document.querySelector("#img-button-edit");//Tạm thời chưa dùng đến nút này
const movieDescriptionEdit = document.querySelector("#movie-description-edit");
const submitButtonEdit = document.querySelector("#submit-button-edit");
const spotlightEdit = document.querySelector("#spotlight-edit");

editMovieForm.addEventListener("submit", (e) =>
{
    e.preventDefault();
    if (!ValidateInput(movieNameEdit.value, categoryEdit.value, ticketPriceEdit.value, openingDateEdit.value, movieDescriptionEdit.value))
        return;//Không thực hiện sửa thông tin nếu validate input trả về false
    const getMovieProduct = JSON.parse(localStorage.getItem(CONSTANT.productData));
    const updatedMovie = getMovieProduct[ editIndex ];
    console.log(spotlightEdit);
    console.log(spotlightEdit.checked);
    console.log(updatedMovie.spotlight);
    updatedMovie.movieName = movieNameEdit.value;
    updatedMovie.imageUrl = "../../Images/Product_Data/" + filePath;//Gán đường dẫn file
    updatedMovie.category = categoryEdit.value;
    updatedMovie.ticketPrice = +ticketPriceEdit.value;
    updatedMovie.openingDate = openingDateEdit.value;
    updatedMovie.spotlight = spotlightEdit.checked ? true : false;
    updatedMovie.description = movieDescriptionEdit.value;

    localStorage.setItem(CONSTANT.productData, JSON.stringify(getMovieProduct));
    window.location.href = "manage-product.html";//Redirect về trang quản lý phim sau khi đã sửa xong 
});
function ValidateInput(movieName, category, ticketPrice, openingDate, description)
{
    if (movieName.length == 0)
    {
        alert("Không được để trống các trường");
        return false;
    }
    if (category.length == 0)
    {
        alert("Không được để trống các trường");
        return false;
    }
    if (ticketPrice.length == 0)
    {
        alert("Không được để trống các trường");
        return false;
    }
    if (openingDate.length == 0)
    {
        alert("Không được để trống các trường");
        return false;
    }
    if (description.length == 0)
    {
        alert("Không được để trống các trường");
        return false;
    }
    return true;
}

function EditMovieInfo(i)//Đặt ở dưới để có thể access vào các phần tử của khu vực edit
{
    const getMovieProduct = JSON.parse(localStorage.getItem(CONSTANT.productData));
    let itemToEdit = getMovieProduct[ i ];
    movieNameEdit.value = itemToEdit.movieName;
    ticketPriceEdit.value = itemToEdit.ticketPrice;
    categoryEdit.value = itemToEdit.category;
    spotlightEdit.checked = itemToEdit.spotlight;//Xem checkbox có được checked không
    openingDateEdit.value = itemToEdit.openingDate;
    movieDescriptionEdit.value = itemToEdit.description;
    editIndex = i;
}
//----------------
//Pagination
//-----------------
const initialMovieData = JSON.parse(localStorage.getItem(CONSTANT.productData)) || [];//Dữ liệu ban đầu
const tableBody = document.getElementById("product-table-body");
const pagination = document.getElementById("pagination");
const rowsPerPage = 3;
let currentPage = 1;

function DisplayRows(rows, page)
{
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
    tableBody.innerHTML = "";
    const newFragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++)
    {
        const newMovie = rows[ i ];
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${ newMovie.spotlight === true ? "Yes" : "No" }</td>
        <td>${ newMovie.movieName }</td>
        <td><img src ="${ newMovie.imageUrl }" alt='photo' style="width: 200px; height: 200px"/></td>
        <td>${ newMovie.category }</td>
        <td>${ newMovie.ticketPrice }</td>
        <td>${ newMovie.openingDate }</td>
        <td>
        <a onclick="EditMovieInfo(${ i })" href="#" style="text-decoration: none; color: white;">
        <button onclick="ChangeSection('edit')" class="edit-button cursor-pointer">Edit</button></a>
            <button onclick="DeleteMovie(${ i })" class="delete-button">Delete</button>
        </td>
`;
        newFragment.appendChild(row);
    }
    tableBody.appendChild(newFragment);
}

function DisplayPagination()
{//Để thẻ nav thì sẽ bị dính css từ admin.css => Chuyển thành div
    const pageCount = Math.ceil(initialMovieData.length / rowsPerPage);
    pagination.innerHTML = `
<div aria-label="Page navigation example">
<ul class="pagination">
<li class="page-item">
<a class="page-link" href="#" aria-label="Previous" onclick="PrevPage()">
  <span aria-hidden="true">&laquo;</span>
</a>
</li>
${ CreatePageLinks(pageCount) }
<li class="page-item">
<a class="page-link" href="#" aria-label="Next" onclick="NextPage()">
  <span aria-hidden="true">&raquo;</span>
</a>
</li>
</ul>
</div>
`;
}

function CreatePageLinks(pageCount)
{
    let links = "";
    for (let i = 1; i <= pageCount; i++)
    {
        links += `<li class="page-item"><a class="page-link" href="#" onclick="ChangePage(event, ${ i })">${ i }</a></li>`;
    }
    return links;
}

function UpdateActivePageLink()
{
    const links = pagination.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++)
    {
        const link = links[ i ];
        if (parseInt(link.textContent) === currentPage)
        {
            link.classList.add("active");
        } else
        {
            link.classList.remove("active");
        }
    }
}

function ChangePage(event, page)
{
    event.preventDefault();
    const movieProductData = JSON.parse(localStorage.getItem(CONSTANT.productData));
    currentPage = page;
    DisplayRows(movieProductData, currentPage);
    UpdateActivePageLink();
}

function PrevPage()
{
    if (currentPage > 1)
    {
        const movieProductData = JSON.parse(localStorage.getItem(CONSTANT.productData));
        currentPage--;
        DisplayRows(movieProductData, currentPage);
        UpdateActivePageLink();
    }
}

function NextPage()
{
    const pageCount = Math.ceil(initialMovieData.length / rowsPerPage);
    if (currentPage < pageCount)
    {
        const movieProductData = JSON.parse(localStorage.getItem(CONSTANT.productData));
        currentPage++;
        DisplayRows(movieProductData, currentPage);
        UpdateActivePageLink();
    }
}

function SearchFunction()
{
    const input = document.getElementById("search-input");
    const filter = input.value.toUpperCase();
    const filteredData = initialMovieData.filter((item) =>
    {
        return (
            item.movieName.toUpperCase().indexOf(filter) > -1 ||
            item.category.toUpperCase().indexOf(filter) > -1
        );
    });
    currentPage = 1;
    DisplayRows(filteredData, currentPage);
}

// Display initial data
DisplayRows(initialMovieData, currentPage);
DisplayPagination(initialMovieData);

