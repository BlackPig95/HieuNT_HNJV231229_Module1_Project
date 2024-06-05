const CONSTANT = {
    buyTicket: "buy-ticket-data",
    seatSelected: "seat-selected",
    seatNotAvai: "seat-not-avai",
    seatAvai: "seat-avai",
    seat: "seat",
    selectedShow: "selected-show",
    userLogin: "user-login-data",
    // spotlight: true,
    // movieName: "GodzillaXKong",//Phải dùng escape character để dẫn link
    // imageUrl: "../../Images/Product_Data/GxK.jpg",
    // category: "Kaiju",
    // ticketPrice: 50000,
    // openingDate: "22-05-2024",
    // description: "Some description",
    // bookingUrl: CONSTANT.bookTicket,
    // showTime: CONSTANT.movieShowTime,
};
const movieShowData = JSON.parse(localStorage.getItem(CONSTANT.buyTicket));//Lấy dữ liệu về object phim đang được chọn
//Khu vực chọn vé
const movieShowName = document.getElementById("movie-name");//Trường tên phim ở mục thông tin
const movieShowPrice = document.getElementById("movie-price");//Trường giá phim ở mục thông tin
const movieShowTime = document.getElementById("movie-time");//Trường lịch chiếu ở mục thông tin
const seatContainer = document.querySelector(".seat-container");//Khu vực ghế ngồi
const purchaseTicket = document.getElementById("purchase-ticket");//Nút thanh toán
//Khu vực kiểm tra thông tin thanh toán
let completeContainer = document.querySelector(".complete-purchase-container");
let completeBack = document.querySelector("#complete-back");//Nút quay lại chỉnh sửa đơn hàng
let completeName = document.querySelector("#complete-name");
let completeTime = document.querySelector("#complete-time");
let completeSeat = document.querySelector("#complete-seat");
let completePrice = document.querySelector("#complete-price");
let completePay = document.querySelector("#complete-pay");

const movieInfoContainer = document.querySelector(".movie-info-container");//Thẻ div chứa toàn bộ khung chọn ghế
let countSeat = 0;//Đếm số lượng ghế được chọn
let seatIndice = [];//Dùng để lưu lại các số ghế đã được chọn
let screenTime = "";//Dùng để lưu lại suất chiếu đã chọn
const seatArray = document.querySelectorAll(".seat");//Tất cả các ghế trên màn hình
for (let i = 0; i < seatArray.length; i++)
{
    seatArray[ i ].classList.add(`seat-index-${ i }`);//Thêm index vào cho từng ghế
    seatArray[ i ].onclick = () => SelectSeat(i);//Thêm sự kiện để kiểm soát ghế nào được chọn
}
seatContainer.addEventListener("click", (e) =>//Sự kiện ấn chọn ghế ngồi
{
    let targetClassList = e.target.classList;
    if (targetClassList.contains("seat"))//Kiểm tra xem có đang ấn đúng vào ghế không
    {
        if (!targetClassList.contains("seat-not-avai"))//Nếu ghế không còn trống thì không cho chọn
        {
            if (targetClassList.contains(CONSTANT.seatSelected))//Ghế đã chọn rồi mà ấn lần nữa thì remove
            {
                targetClassList.remove(CONSTANT.seatSelected);
                countSeat -= 1;
            }
            else 
            {
                targetClassList.add(CONSTANT.seatSelected);//Ghế chưa chọn thì add
                countSeat += 1;
            }
        }
    }
    RenderPurchaseInfo();
});
function SelectSeat(index)//Quản lý các ghế trong mảng
{
    if (seatArray[ index ].classList.contains(CONSTANT.seatNotAvai))//Ghế đỏ thì không được chọn
        return;
    if (!seatArray[ index ].classList.contains(CONSTANT.seatSelected))//Nếu ghế chưa được chọn
    {
        let newSeat = { seatNumber: index, seatName: seatArray[ index ].textContent };
        seatIndice.push(newSeat);//Tạo obj chứa index của ghế và tên của ghế, đẩy vào mảng
    }
    else //Nếu như ghế đã được chọn
    {
        for (let i = 0; i < seatIndice.length; i++)//Duyệt qua mảng
        {
            if (seatIndice[ i ].seatNumber === index)//Kiểm tra xem số ghế có trùng với index của ghế trong mảng không
            {
                seatIndice.splice(i, 1);//Nếu trùng số ghế (tức ghế đã được chọn)=> Xóa ghế đó ra khỏi mảng
            }
        }
    }
}
//Hiện thông tin về phim đang chọn
function RenderMovieData()
{//Gán thông tin về tên phim và giá
    movieShowName.innerHTML += `${ movieShowData.movieName }`;
    movieShowPrice.innerHTML += `${ movieShowData.ticketPrice }` + " VND";

    for (let i = 0; i < movieShowData.showTime.length; i++)
    {//Truy cập vào mảng showTime để duyệt và gán từng phần tử
        const newDiv = document.createElement("div");
        newDiv.classList.add("show-time-div");
        newDiv.addEventListener("click", () => SelectShow(movieShowData.showTime[ i ]));
        newDiv.addEventListener("click", () => TimeChosen(i));
        newDiv.innerHTML = `${ movieShowData.showTime[ i ] }`;
        movieShowTime.appendChild(newDiv);
    }
}
RenderMovieData();

//Thay đổi thông tin thanh toán
const totalCost = document.getElementById("total-cost");
const selectedTime = document.getElementById("selected-time");//Lịch chiếu hiển thị ở khu vực thanh toán
function RenderPurchaseInfo()
{
    totalCost.innerHTML = "";
    totalCost.innerHTML = countSeat > 0 ? `Tổng tiền: ${ +countSeat * +movieShowData.ticketPrice } VND` : "Tổng tiền:";
    // selectedTime = "";
}

//Thay đổi thông tin lịch chiếu đã chọn
function SelectShow(show)
{
    selectedTime.innerHTML = "";
    selectedTime.innerHTML = `Lịch chiếu đã chọn:
    <div style="margin-top: 20px; background-color: rgba(0, 199, 250); padding: 5px; border-radius: 5px;">${ show }</div>
    `;
    screenTime = show;
}
//Hiển thị ở khu vực thông tin phim xem lịch nào đã được chọn
const availableShow = document.querySelectorAll(".show-time-div");//Lịch chiếu hiển thị ở khu vực thông tin phim
function TimeChosen(index)
{
    for (let i = 0; i < availableShow.length; i++)
    {
        if (index === i)
        {
            availableShow[ i ].classList.add(CONSTANT.selectedShow);
        }
        else
        {
            availableShow[ i ].classList.remove(CONSTANT.selectedShow);
        }
    }
}

purchaseTicket.addEventListener("click", () =>
{
    let timeConfirmed = false;
    let seatConfirmed = false;

    if (countSeat > 0)//Kiểm tra xem ghế ngồi đã được chọn chưa
    {
        seatConfirmed = true;
    }
    for (let i = 0; i < availableShow.length; i++)
    {
        if (availableShow[ i ].classList.contains(CONSTANT.selectedShow))//Kiểm tra xem lịch chiếu đã được chọn chưa
        {
            timeConfirmed = true;
        }
    }
    if (!timeConfirmed)//Nếu chưa chọn lịch chiếu
    {
        Swal.fire({
            icon: "error",
            title: "Vui lòng chọn lịch chiếu",
        });
        return;
    }
    else if (!seatConfirmed)//Nếu chưa chọn ghế ngồi
    {
        Swal.fire({
            icon: "error",
            title: "Vui lòng chọn ghế ngồi",
        });
        return;
    }
    let seatInfo = [];//Khi đã validate các điều kiện thì tiến hành nhập thông tin thanh toán
    for (let i = 0; i < seatIndice.length; i++)
    {//Chỉ cần tên của ghế, số index chỉ để quản lý việc chọn và bỏ chọn, không cần lưu vào thông tin thanh toán
        seatInfo.push(seatIndice[ i ].seatName);
    }
    completeName.innerHTML = "Tên bộ phim: " + movieShowData.movieName;
    completeTime.innerHTML = "Lịch chiếu: " + screenTime;
    completeSeat.innerHTML = "Số ghế đã chọn: ";
    for (let i = 0; i < seatInfo.length; i++)
    {
        completeSeat.innerHTML += seatInfo[ i ] + " | ";
    }
    completePrice.innerHTML = "Tổng tiền thanh toán: " + (+countSeat * +movieShowData.ticketPrice);
    movieInfoContainer.classList.add("hidden");
    completeContainer.classList.remove("hidden");
});
// Khu vực kiểm tra đơn hàng
//-------------------------

completeBack.onclick = () =>
{

    movieInfoContainer.classList.remove("hidden");
    completeContainer.classList.add("hidden");

};
completePay.onclick = () =>
{
    for (let i = 0; i < seatIndice.length; i++)//Duyệt qua mảng
    {
        seatArray[ seatIndice[ i ].seatNumber ].classList.add(CONSTANT.seatNotAvai);//Kiểm tra và đánh dấu đỏ lên các ghế đã được chọn
        seatArray[ seatIndice[ i ].seatNumber ].classList.remove(CONSTANT.seatSelected);
    }
    let seatInfo = [];
    for (let i = 0; i < seatIndice.length; i++)
    {//Chỉ cần tên của ghế, số index chỉ để quản lý việc chọn và bỏ chọn, không cần lưu vào thông tin thanh toán
        seatInfo.push(seatIndice[ i ].seatName);
    }
    const purchaseInfo = {
        nameInfo: movieShowData.movieName,//Lưu tên bộ phim vào thông tin thanh toán
        seatList: seatInfo,//Lưu số ghế đã chọn vào thông tin thanh toán
        screenTimeInfo: screenTime,//Lưu lịch chiếu vào thông tin thanh toán
        priceInfo: +countSeat * +movieShowData.ticketPrice,//Lưu số tiền phải thanh toán
    };
    const userLoginData = JSON.parse(localStorage.getItem(CONSTANT.userLogin)) || {};
    //Đẩy thông tin thanh toán lên localstorage, sau đó kéo về trang xác nhận thanh toán
    //Khi khách khác đăng nhập vào sẽ kéo local về và dựa trên thông tin này để đánh dấu các số ghế không được phép chọn

    const newTicketPurchase = { ...userLoginData, ticketPurchased: purchaseInfo };
    localStorage.setItem("ticket-info", JSON.stringify(newTicketPurchase));//Đẩy lên thông tin về người dùng và vé mà người này mua

    Swal.fire({//Để tạm thời vì chưa kịp làm trang thanh toán
        position: "center",
        icon: "success",
        title: "Thanh toán thành công",
        showConfirmButton: false,
        timer: 1000,
    });
};
