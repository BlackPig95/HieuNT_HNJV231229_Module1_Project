//Carousel 
const carouselTrack = document.querySelector(".carousel-track");
const registerLogin = document.querySelector(".register-login");
const headNavContainer = document.querySelector(".head-nav-container");
const showingMovie = document.querySelector(".showing-movie");//Mục phim đang chiếu
let currentIndex = 0;//Set index mặc định khi load page
const CONSTANT = //global constant object để gán các biến tái sử dụng cho tiện kiểm soát và bớt việc cho GC
{
    carouselClone: "carousel-clone",
    active: "active",
    animSec: 1,
    userData: "cinema-user-data",
    productData: "product-movie-data",
    carouselItem: "carousel-item",
    userLogin: "user-login-data",
    buyTicket: "buy-ticket-data",
};

//         id: 1214,  //Format của 1 object phim trên localStorage, để đây cho đỡ quên
//         movieName: "GodzillaXKong",//Phải dùng escape character để dẫn link
//         imageUrl: "E:\\Rikkei\\Project_Module_1\\Images\\Slideshow_Index\\GxK.jpg",
//         category: "Kaiju",
//         ticketPrice: 50000,
//         openingDate: "22-05-2024",
//         description: "Some description"
window.onscroll = function ()//Thay đổi màu thanh nav bar khi scroll
{
    if (window.scrollY >= 100)
    {
        headNavContainer.classList.add("head-nav-colored");
    }
    else
    {
        headNavContainer.classList.remove("head-nav-colored");
    }
};
function RenderPage()//Render thông tin ra trang chủ
{//Render thông tin của carousel và khu vực PHIM
    const carouselData = JSON.parse(localStorage.getItem(CONSTANT.productData)) || [];
    const newFragment = document.createDocumentFragment();
    const onshowFragment = document.createDocumentFragment();

    for (let i = 0; i < carouselData.length; i++)
    {
        const onshowMovie = document.createElement("div");
        onshowMovie.classList.add("movie-item");
        onshowMovie.innerHTML =
            `<img onclick='BuyTicket("${ carouselData[ i ].bookingUrl }",  ${ JSON.stringify(carouselData[ i ]) }  )' 
        src="${ carouselData[ i ].imageUrl }" alt="movie" />
        <span class="movie-title">${ carouselData[ i ].movieName }</span>`;
        onshowFragment.appendChild(onshowMovie);//Tạo và gán các movie mới vào phần phim đang chiếu

        if (!carouselData[ i ].spotlight)
        {//Nếu phim không được check spotlight thì không cho lên carousel
            continue;
        }
        const newImg = document.createElement("div");
        newImg.classList.add(CONSTANT.carouselItem);
        newImg.innerHTML = `
        <a onclick='BuyTicket("${ carouselData[ i ].bookingUrl }",  ${ JSON.stringify(carouselData[ i ]) }  )'  href="#"><img src="${ carouselData[ i ].imageUrl }" alt="photo-carousel-${ i }"></a>
        `;
        newFragment.appendChild(newImg);//Tạo và gán các movie mới vào thanh carousel
    }
    carouselTrack.innerHTML = "";//Reset lại HTML trước khi gán fragment để đảm bảo không bị ghi đè
    carouselTrack.appendChild(newFragment);//Gán fragment vào carousel
    showingMovie.innerHTML = "";
    showingMovie.appendChild(onshowFragment);//Gán fragment vào mục phim đang chiếu

    const userLogin = JSON.parse(localStorage.getItem(CONSTANT.userLogin));//Kiểm tra xem có người dùng nào đang đăng nhập không
    if (userLogin)
    {
        registerLogin.innerHTML = `
        <a id="username">${ userLogin.name }</a>
        <a onclick="UserLogOut()" id="logout-button">Đăng xuất</a>
        `;
    }
    else 
    {
        registerLogin.innerHTML = `<a href="./HTML/Register-Login/login.html">Đăng nhập</a>
        <a href="./HTML/Register-Login/register.html">Đăng ký</a>`;
    }
}
RenderPage();

function BuyTicket(url, movieObj)
{
    const userLogin = JSON.parse(localStorage.getItem(CONSTANT.userLogin));//Kiểm tra xem có người dùng nào đang đăng nhập không
    console.log(userLogin);
    if (userLogin)
    {
        window.location.href = url;
        localStorage.setItem(CONSTANT.buyTicket, JSON.stringify(movieObj));
        //Chuyển hướng tới trang đặt vé và đẩy dữ liệu về phim đã được đặt lên local
    }
    else
    {
        Swal.fire("Vui lòng đăng nhập trước").then(() =>
        {
            window.location.href = "../../HTML/Register-Login/login.html";
        });
    }
}

const carouselContainer = document.querySelector(".carousel-container");
const carouselItems = document.querySelectorAll(".carousel-item");//Sử dụng nodelist static để khi clone không bị update
const imageWidth = +window.getComputedStyle(carouselItems[ 1 ]).width.slice(0, -2);//Lấy ra giá trị chiều dài của ảnh và bỏ chữ px
const totalItem = carouselItems.length;//Lưu đệm dộ dài của mảng nodelist cho dễ truy cập

//Lấy ra giá trị fontSize của root element để di chuyển ảnh
const columnGap = window.getComputedStyle(document.body).getPropertyValue("font-size").slice(0, -2) * 2;
//Set vị trí ban đầu dể cho ảnh index 0 vào trung tâm
carouselTrack.style.transform = `translateX(-${ (imageWidth + columnGap) * 2 - (0.2 * imageWidth) }px)`;

//Hiệu ứng infinite scroll
for (let i = 0; i < 2; i++)
{
    carouselItems[ i ].classList.add(CONSTANT.carouselClone);//Tạo clone của 2 ảnh đầu và đặt xuống cuối
    carouselTrack.append(carouselItems[ i ].cloneNode(true));
    carouselItems[ i ].classList.remove(CONSTANT.carouselClone);//Không truy cập được classList của cloneNode nên phải làm cách này

    carouselItems[ totalItem - i - 1 ].classList.add(CONSTANT.carouselClone);//Tạo clone của 2 ảnh cuối cùng và đặt lên đầu
    carouselTrack.prepend(carouselItems[ totalItem - i - 1 ].cloneNode(true));
    carouselItems[ totalItem - i - 1 ].classList.remove(CONSTANT.carouselClone);
}
function CreateIndicator() //Tạo các nút bấm tròn dưới thanh carousel
{
    let indicatorBar = document.createElement("div");
    indicatorBar.classList.add("indicator-nav");
    for (let i = 0; i < totalItem; i++)
    {
        carouselItems[ i ].classList.add(`item-index-${ i }`);//Đặt class cho dễ kiểm soát các thẻ ban đầu
        const newIndicator = document.createElement("button");
        newIndicator.type = "button";
        newIndicator.classList.add("carousel-indicator");//Thêm class để đi CSS
        newIndicator.onclick = () => IndicatorIndex(i);//Gán chỉ số index vào từng nút tương ứng
        // phải gọi qua arrow function để tránh hàm bị gọi lúc vừa load page
        indicatorBar.appendChild(newIndicator);//Gán nút bấm được tạo vào một thanh nav
    }
    carouselContainer.appendChild(indicatorBar);//Gán thanh nav bar của các nút bấm vào carousel
}
CreateIndicator();//Gọi ngay khi load page

carouselTrack.addEventListener("transitionend", () =>
{//Kiểm tra và set lại giá trị của currentIndex sau khi kết thúc di chuyển carousel
    if (currentIndex > totalItem - 1)
    {
        currentIndex = 0;
        MoveSlide(-totalItem);//Ngay lập tức đưa carousel về lại vị trí index 0 sau khi kết thúc animation
    }
    else if (currentIndex < 0)
    {
        currentIndex = totalItem - 1;
        MoveSlide(totalItem);//Ngay lập tức đưa carousel về vị trí index cuối sau khi kết thúc animation
    }
    if (!intervalIsRunning)
    {//Khởi dộng lại interval sau khi kết thúc animation
        intervalIsRunning = true;//Set lại giá trị cho lần bấm nút tiếp theo
        ControlInterval();
    }
});
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");
prevButton.addEventListener("click", () => //Khi bấm vào mũi tên thì tạm ngừng interval
{
    if (intervalIsRunning)
    {
        ControlInterval.clearCarouselInterval();
        intervalIsRunning = false;
    }
});
nextButton.addEventListener("click", () => //Khi bấm vào mũi tên thì tạm ngừng interval
{
    if (intervalIsRunning)
    {
        ControlInterval.clearCarouselInterval();
        intervalIsRunning = false;
    }
});
function ChangeIndex(n)
{
    if (currentIndex > totalItem - 1) return;//Không cho phép bấm quá nhanh sẽ gây lỗi carousel di chuyển sai
    if (currentIndex < 0) return;
    currentIndex += n;
    MoveSlide(n, CONSTANT.animSec);//n luôn là 1 hoặc -1

}
function IndicatorIndex(index)
{
    let count = index - currentIndex;
    currentIndex = index;
    MoveSlide(count, CONSTANT.animSec);
    if (intervalIsRunning)//Chỉ thực hiện khi giá trị đã được set thành true, tránh việc hàm clear và set bị gọi nhiều lần
    {//Tạm ngưng interval khi bấm vào dấu chấm
        ControlInterval.clearCarouselInterval();
        intervalIsRunning = false;
    }//Còn 1 bug nhỏ, khi bấm 2 lần vào cùng 1 nút tròn thì interval sẽ bị ngừng cho đến khi bấm tiếp nút khác
}

let initialPos = +carouselTrack.style.transform.match(/\d+/g).join(".") * -1;//Lấy ra vị trí ban đầu dưới dạng số
//Vì đi về bên phải là giá trị X âm nên phải nhân với -1
function MoveSlide(stepCount, animTime = 0)//Di chuyển carousel dựa trên input nhận vào
{
    //2rem là giá trị column-gap đã set trong css, nhân với root element font size để đổi ra px
    initialPos += (imageWidth + columnGap) * stepCount * -1;//Nhân với -1 để đảo chiều cho khớp với mũi tên
    carouselTrack.style.transition = `transform ${ animTime }s ease`;//Dùng transition để di chuyển mượt và tạo hiệu ứng infinite scroll
    carouselTrack.style.transform = `translateX(${ initialPos }px)`;
    SelectIndicator(currentIndex);//Bật tắt các nút indicator
}

const indicators = document.querySelectorAll(".carousel-indicator");//Các dấu chấm tròn được tạo ra ở trên
function SelectIndicator(index)
{
    for (let i = 0; i < totalItem; i++)
    {
        if (index === i)
        {
            indicators[ i ].classList.add(CONSTANT.active);
        }
        else
        {
            indicators[ i ].classList.remove(CONSTANT.active);
        }
    }
}
SelectIndicator(currentIndex); //Set indicator khi vừa load page

function ControlInterval()//Function để chạy hoặc clear interval
{
    let intervalCarousel = setInterval(() => ChangeIndex(1), 4000);//Tự đổi ảnh mỗi 5s
    function ClearCarouselInterval()
    {
        clearInterval(intervalCarousel);
    };
    ControlInterval.clearCarouselInterval = ClearCarouselInterval;//Cho phép access nested function từ bên ngoài
}
var intervalIsRunning = true;//Dùng biến var để có thể access từ các function viết ở trên đỡ phải sửa lại vị trí biến
window.onload = ControlInterval();//Gọi hàm interval để tự động chạy carousel khi load page

const logOutButton = document.getElementById("logout-button");
function UserLogOut()
{
    localStorage.removeItem(CONSTANT.userLogin);
    RenderPage();
}