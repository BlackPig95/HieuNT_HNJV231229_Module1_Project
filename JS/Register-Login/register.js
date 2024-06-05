const form = document.querySelector("form");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const showPassword = document.querySelector("#show-password");
const ShowConfirmPassword = document.querySelector("#show-cfPassword");

const CONSTANT = {
    password: "password",
    text: "text",
    small: "small",
    error: "error",
    userData: "cinema-user-data",
};

showPassword.addEventListener("click", () =>//Ẩn hiện pass
{
    showPassword.classList.toggle("fa-eye");
    showPassword.classList.toggle("fa-eye-slash");
    if (password.type == CONSTANT.password)
    {
        password.type = CONSTANT.text;
    }
    else password.type = CONSTANT.password;
});
ShowConfirmPassword.addEventListener("click", () =>
{
    ShowConfirmPassword.classList.toggle("fa-eye");
    ShowConfirmPassword.classList.toggle("fa-eye-slash");
    if (confirmPassword.type == CONSTANT.password)
    {
        confirmPassword.type = CONSTANT.text;
    }
    else confirmPassword.type = CONSTANT.password;
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

function CheckEmailError(input)
{//Kiểm tra xem email đã được viết đúng hình thức chưa
    let regexEMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    input.value = input.value.trim();
    let checkEmail = regexEMail.test(input.value);
    if (checkEmail)
    {
        ShowSuccess(input);
        return true;
    }
    if (input.value == "")
    {
        ShowError(input, "Không được để trống");
        return false;
    }

    ShowError(input, "Email không đúng");
    return false;
}

function CheckLengthError(input, name, min, max)
{//Kiểm tra độ dài của các trường
    input.value = input.value.trim();
    if (!input.value) //input.value = "" => false => !input.value = true
    {
        ShowError(input, "Không được để trống");
        return false;
    }
    if (input.value.length < min)
    {
        ShowError(input, `${ name } không được nhỏ hơn ${ min } ký tự`);
        console.log(name);
        return false;
    }
    if (input.value.length > max)
    {
        ShowError(input, `${ name } không được lớn hơn ${ max } ký tự`);
        console.log(name);

        return false;
    }
    ShowSuccess(input);
    return true;
}

function CheckConfirmPassword(password, cfPassword)
{//Kiểm tra xem password nhập lại có đúng không
    if (cfPassword.value === "")
    {
        ShowError(cfPassword, "Không được để trống");
        return false;
    }
    if (password.value !== cfPassword.value)
    {
        ShowError(cfPassword, "Mật khẩu không trùng khớp");
        return false;
    }
    ShowSuccess(confirmPassword);
    return true;
}
function CheckEmailDuplicate(emailInput)//Kiểm tra xem email đã được sử dụng chưa
{
    const getUserData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
    for (let i = 0; i < getUserData.length; i++)
    {
        if (emailInput.value === getUserData[ i ].email)
        {
            ShowError(emailInput, `Email này đã được sử dụng`);
            return false;
        }
    }
    return true;
}
form.addEventListener("submit", (e) =>
{//Gọi các hàm validate khi form được submit
    e.preventDefault();
    let checkEmpty = CheckEmptyError([ username, email, password, confirmPassword ]);
    let checkEmail = CheckEmailError(email);
    let checkLengthUser = CheckLengthError(username, "Tên người dùng", 6, 20);
    let checkLengthPass = CheckLengthError(password, "Mật khẩu", 8, 20);
    let checkcfPass = CheckConfirmPassword(password, confirmPassword);
    let checkEmailDup = CheckEmailDuplicate(email);
    //Chỉ thực hiện logic đăng ký khi đã validate thành công
    if (checkEmpty && checkEmail && checkLengthUser && checkLengthPass && checkcfPass && checkEmailDup)
    {
        const arrUser = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
        const dateRegistered = new Date();
        const objUser = {
            name: username.value,
            email: email.value,
            password: password.value,
            userId: Date.now(),
            registerDate: dateRegistered.toDateString(),
            totalPurchase: 0,
            status: "Good",
        };
        arrUser.push(objUser);
        localStorage.setItem(CONSTANT.userData, JSON.stringify(arrUser));

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Đăng ký thành công",
            showConfirmButton: false,
            timer: 1500,
        }).then(() =>
        {
            window.location.href = "login.html";
        });
    }
    else 
    {
        Swal.fire({
            title: 'Error!',
            text: 'Đăng ký thất bại',
            icon: 'error',
            confirmButtonText: 'Cancel'
        });
    }
});
