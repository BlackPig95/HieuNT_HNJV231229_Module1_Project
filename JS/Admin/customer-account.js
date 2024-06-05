const CONSTANT = {
    userData: "cinema-user-data",
    userLocked: "Locked",
    userGood: "Good",
};

const initialCustomerData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
const tableBody = document.getElementById("customer-table-body");
// function RenderUser()
// {//Comment lại code cũ để dùng pagination
//     tableBody.innerHTML = "";
//     const customerData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
//     const newFragment = document.createDocumentFragment();
//     for (let i = 0; i < customerData.length; i++)
//     {
//         const newTr = document.createElement("tr");
//         const customer = customerData[ i ];
//         if (customer.status === CONSTANT.userGood)
//         {//Nếu status của user này là good thì hiển thị nút khóa
//             newTr.innerHTML = `
//         <tr>
//         <td>${ i + 1 }</td>
//         <td>${ customer.name }</td>
//         <td>${ customer.userId }</td>
//         <td>${ customer.registerDate }</td>
//         <td>${ customer.totalPurchase } VND</td>
//         <td>
//         <button onclick="ChangeAccountStatus(${ i })" class="lock-button" id="lock-button-${ i }">Lock Account</button>
//         <button onclick="DeleteAccount(${ i })" class="delete-button">Delete Account</button>
//         </td>
//         <td>${ customer.status }</td>
//     </tr>`;
//         }
//         else 
//         {//Nếu status của user này là locked thì hiển thị nút mở khóa
//             newTr.innerHTML = `
//             <tr>
//             <td>${ i + 1 }</td>
//             <td>${ customer.name }</td>
//             <td>${ customer.userId }</td>
//             <td>${ customer.registerDate }</td>
//             <td>${ customer.totalPurchase } VND</td>
//             <td>
//             <button onclick="ChangeAccountStatus(${ i })" class="unlock-button" id="unlock-button-${ i }">Unlock</button>
//             <button onclick="DeleteAccount(${ i })" class="delete-button">Delete Account</button>
//             </td>
//             <td> ${ customer.status }</td>
//         </tr>`;
//         }
//         newFragment.appendChild(newTr);
//     }
//     tableBody.appendChild(newFragment);
// }
// RenderUser();

function DeleteAccount(i)
{
    Swal.fire({
        title: "Xóa tài khoản người dùng này?",
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
            const customerData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
            customerData.splice(i, 1);//Xóa object customer ở vị trí i
            localStorage.setItem(CONSTANT.userData, JSON.stringify(customerData));
            displayRows(customerData, currentPage);
            // RenderUser();
            Swal.fire({
                title: "Đã xóa!",
                text: "Xóa thành công.",
                icon: "success"
            });
        }
    });

}

function ChangeAccountStatus(i)
{
    const customerData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
    customerData[ i ].status = customerData[ i ].status === CONSTANT.userLocked ? CONSTANT.userGood : CONSTANT.userLocked;
    //Truy cập vào status của customer ở index i, kiểm tra xem đang ở trạng thái nào thì đổi ngược lại
    // lockButton.innerText = "Unlock Account";
    localStorage.setItem(CONSTANT.userData, JSON.stringify(customerData));
    // RenderUser();
    displayRows(customerData, currentPage);
}
//--------------------------------------
// Pagination
//--------------------------------------
const paginationTableBody = document.getElementById("customer-table-body");
const pagination = document.getElementById("pagination");
const rowsPerPage = 3;
let currentPage = 1;

function displayRows(rows, page)
{
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, rows.length);

    paginationTableBody.innerHTML = "";
    const newFragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++)
    {
        const customer = rows[ i ];
        const row = document.createElement("tr");
        if (customer.status === CONSTANT.userGood)
        {//Nếu status của user này là good thì hiển thị nút khóa
            row.innerHTML = `
        <tr>
        <td>${ i + 1 }</td>
        <td>${ customer.name }</td>
        <td>${ customer.userId }</td>
        <td>${ customer.registerDate }</td>
        <td>${ customer.email }</td>
        <td>
        <button onclick="ChangeAccountStatus(${ i })" class="lock-button" id="lock-button-${ i }">Lock Account</button>
        <button onclick="DeleteAccount(${ i })" class="delete-button">Delete Account</button>
        </td>
        <td>${ customer.status }</td>
    </tr>`;
        }
        else 
        {//Nếu status của user này là locked thì hiển thị nút mở khóa
            row.innerHTML = `
            <tr>
            <td>${ i + 1 }</td>
            <td>${ customer.name }</td>
            <td>${ customer.userId }</td>
            <td>${ customer.registerDate }</td>
            <td>${ customer.email }</td>
            <td>
            <button onclick="ChangeAccountStatus(${ i })" class="unlock-button" id="unlock-button-${ i }">Unlock</button>
            <button onclick="DeleteAccount(${ i })" class="delete-button">Delete Account</button>
            </td>
            <td> ${ customer.status }</td>
        </tr>`;
        }
        //         row.innerHTML = `
        // <td>${ rows[ i ].name }</td>
        // <td>${ rows[ i ].email }</td>
        // `;
        newFragment.appendChild(row);
    }
    tableBody.appendChild(newFragment);
}

function displayPagination()
{//Để thẻ nav thì sẽ bị dính css từ admin.css => Chuyển thành div
    const pageCount = Math.ceil(initialCustomerData.length / rowsPerPage);
    pagination.innerHTML = `
<div aria-label="Page navigation example">
<ul class="pagination">
<li class="page-item">
<a class="page-link" href="#" aria-label="Previous" onclick="prevPage()">
  <span aria-hidden="true">&laquo;</span>
</a>
</li>
${ createPageLinks(pageCount) }
<li class="page-item">
<a class="page-link" href="#" aria-label="Next" onclick="nextPage()">
  <span aria-hidden="true">&raquo;</span>
</a>
</li>
</ul>
</div>
`;
}

function createPageLinks(pageCount)
{
    let links = "";
    for (let i = 1; i <= pageCount; i++)
    {
        links += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(event, ${ i })">${ i }</a></li>`;
    }
    return links;
}

function updateActivePageLink()
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

function changePage(event, page)
{
    event.preventDefault();
    const customerData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
    currentPage = page;
    displayRows(customerData, currentPage);
    updateActivePageLink();
}

function prevPage()
{
    if (currentPage > 1)
    {
        const customerData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
        currentPage--;
        displayRows(customerData, currentPage);
        updateActivePageLink();
    }
}

function nextPage()
{
    const pageCount = Math.ceil(initialCustomerData.length / rowsPerPage);
    if (currentPage < pageCount)
    {
        const customerData = JSON.parse(localStorage.getItem(CONSTANT.userData)) || [];
        currentPage++;
        displayRows(customerData, currentPage);
        updateActivePageLink();
    }
}

function searchFunction()
{
    const input = document.getElementById("search-input");
    const filter = input.value.toUpperCase();
    const filteredData = initialCustomerData.filter((item) =>
    {
        return (
            item.name.toUpperCase().indexOf(filter) > -1 ||
            item.email.toUpperCase().indexOf(filter) > -1
        );
    });
    currentPage = 1;
    displayRows(filteredData, currentPage);
}

// Display initial data
displayRows(initialCustomerData, currentPage);
displayPagination(initialCustomerData);