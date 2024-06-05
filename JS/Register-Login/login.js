const email = document.querySelector("#email");
const password = document.querySelector("#password");
const btnSubmit = document.querySelector("#btn-submit");
const form = document.querySelector("form");
const showPassword = document.querySelector("#show-password");

const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
});

const CONSTANT = {
    password: "password",
    text: "text",
    small: "small",
    error: "error",
    userData: "cinema-user-data",
    userLogin: "user-login-data",
    userGood: "Good",
    userLocked: "Locked",
};
const adminAccount = {
    adminName: "Admin",
    adminEmail: "admin@gmail.com",
    adminPassword: "admin",
};
localStorage.setItem("admin-account", JSON.stringify(adminAccount));//Thông tin về tài khoản admin
form.addEventListener("submit", (e) =>
{
    e.preventDefault();
    console.log(email.value);
    console.log(password.value);
    console.log(adminAccount.adminEmail);
    console.log(adminAccount.adminPassword);
    if (email.value == adminAccount.adminEmail && password.value == adminAccount.adminPassword)
    {//Nếu là tài khoản admin thì chuyển hướng sang trang admin
        console.log("Admin đăng nhập");
        Toast.fire({
            icon: "success",
            title: `Chào mừng Admin`,
        }).then(() =>
        {
            window.location.href = "../../HTML/Admin/admin.html";
        });
        return;
    }
    let userExist = false;
    const userData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
    let emptyError = CheckEmptyError([ email, password ]);
    if (!emptyError)//Không cần kiểm tra tài khoản nếu đã nhập sai
        return;//Không cần validate nhiều thông tin vì việc này đã thực hiện trong bước đăng ký tài khoản rồi
    for (let i = 0; i < userData.length; i++)
    {
        if (email.value === userData[ i ].email && password.value === userData[ i ].password)
        {//Kiểm tra email và password trong local xem có trùng không
            if (userData[ i ].status === CONSTANT.userLocked)
            {//Kiểm tra xem có bị khóa không, nếu có thì hiện thông báo và không cho đăng nhập
                Swal.fire({
                    title: 'Tài khoản đã bị khóa!',
                    text: 'Vui lòng liên hệ đội ngũ chăm sóc khách hàng',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }
            //Nếu không bị khóa thì tiến hành đăng nhập
            const newLoginUser = {//Tạo object mới về user vừa đăng nhập
                name: userData[ i ].name,
                email: email.value,
                password: password.value,
            };
            userExist = true;
            localStorage.setItem(CONSTANT.userLogin, JSON.stringify(newLoginUser));//Đẩy thông tin về người vừa đăng nhập lên local
            Toast.fire({
                icon: "success",
                title: `Chào mừng ${ userData[ i ].name }`,
            }).then(() =>
            {
                window.location.href = "../../index.html";
            });
        }
    }
    if (!userExist)
    {//Đi hết vòng for mà không có tài khoản trùng khớp thì nghĩa là tài khoản hoặc mật khẩu bị sai
        Swal.fire({
            title: 'Đăng nhập thất bại!',
            text: 'Vui lòng kiểm tra lại mật khẩu hoặc tài khoản',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
});

function ShowError(input, message)//Hiển thị dòng chữ báo lỗi ở các trường bị nhập sai yêu cầu
{
    let parent = input.parentElement;
    let small = parent.querySelector(CONSTANT.small);
    parent.classList.add(CONSTANT.error);
    small.textContent = message;
}
function ShowSuccess(input)//Giữ lại thông tin ở các trường đã được nhập đúng
{
    let parent = input.parentElement;
    let small = parent.querySelector(CONSTANT.small);
    parent.classList.remove(CONSTANT.error);
    small.textContent = "";
}

function CheckEmptyError(listInput)
{//Kiểm tra xem có trường nào bị để trống không
    let checkEmpty = true;
    for (let i = 0; i < listInput.length; i++)
    {
        let input = listInput[ i ];
        input.value = input.value.trim();
        if (!input.value) //input.value = "" => false => !input.value = true
        {
            checkEmpty = false;
            ShowError(input, "Không được để trống");
        }
        else 
        {
            ShowSuccess(input);
        }
    }
    return checkEmpty;
}
showPassword.addEventListener("click", () =>//Ẩn hiện password
{
    showPassword.classList.toggle("fa-eye");
    showPassword.classList.toggle("fa-eye-slash");
    if (password.type == CONSTANT.password)
    {
        password.type = CONSTANT.text;
    }
    else password.type = CONSTANT.password;
});