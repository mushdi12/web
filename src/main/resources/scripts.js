const canvas = document.getElementById('coordinatePlane');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 28;

window.onload = loadTableData;

function drawAxes() {
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.moveTo(canvas.width - 10, centerY - 5);
    ctx.lineTo(canvas.width, centerY);
    ctx.lineTo(canvas.width - 10, centerY + 5);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("X", canvas.width - 14, centerY + 19);
    ctx.fillText("Y", centerX + 10, 14);
}

function drawCircle(R) {
    ctx.fillStyle = "#66cabe";
    // Четверть круга
    ctx.beginPath();
    ctx.arc(centerX, centerY, R  * scale, -Math.PI , -1 * Math.PI/2);
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();
}

function drawTriangle(R) {
    ctx.fillStyle = "#66cabe";
    // Треугольник
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + R/2  * scale);
    ctx.lineTo(centerX + R  * scale, centerY );
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();
}

function drawSquare(R) {
    ctx.fillStyle = "#66cabe";
    // Квадрат
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + R * scale);
    ctx.lineTo(centerX - R  * scale, centerY + R * scale);
    ctx.lineTo(centerX - R  * scale, centerY);
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();
}

function drawPoint(x, y) {
    ctx.fillStyle = "#ff0000";
    // Точка
    ctx.beginPath();
    ctx.arc(centerX + x * scale, centerY - y * scale, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function checkX(x) {
    if (x >= -3 && x <= 3) {
        let str = x.toString();
        let decimalIndex = str.indexOf(".");
        if (decimalIndex === -1) {
            return true;
        }
        return str.length - decimalIndex - 1 <= 2;
    } else {
        return false;
    }
}

function checkR(r) {
    if (r >= 1 && r <= 5) {
        let str = r.toString();
        let decimalIndex = str.indexOf(".");
        if (decimalIndex === -1) {
            return true;
        }
        return str.length - decimalIndex - 1 <= 2;
    } else {
        return false;
    }
}

function submitForm() {

    let currentTime = new Date();
    let time = currentTime.toLocaleTimeString();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = document.getElementById("x").value;
    let y = document.querySelector('input[name="option"]:checked');
    let r = document.getElementById("r").value;

    if (y) {
        y = y.value;
    } else {
        y = null;
    }


    if (checkX(x) && checkR(r) && y != null) {
        document.getElementById("result").innerText = " ";
        sendHtml(x, y, r, time)
        drawSquare(r)
        drawCircle(r)
        drawTriangle(r)
        drawAxes()
        drawPoint(x, y)
    } else {
        document.getElementById("result").innerText = "Please fill all fields correctly"

    }


}

function sendHtml(x, y, r, time) {
    // Создаем URL с параметрами запроса
    let url = new URL("http://localhost:8080/fcgi-bin/web1.jar");
    url.searchParams.append("x", x);
    url.searchParams.append("y", y);
    url.searchParams.append("r", r);

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (response) {

            console.log("Response from server: ", response);

            if (response.x ==="null"){
                document.getElementById("result").innerText = response.result;
            }else {
                document.getElementById("result").innerText = " ";
                const resultTable = document.querySelector("table:nth-of-type(2)");
                const newRow = resultTable.insertRow(-1);


                const cellRequestTime = newRow.insertCell(0);
                const cellWorkTime = newRow.insertCell(1);
                const cellX = newRow.insertCell(2);
                const cellY = newRow.insertCell(3);
                const cellR = newRow.insertCell(4);
                const cellResult = newRow.insertCell(5);


                cellRequestTime.textContent = time;
                cellWorkTime.textContent = response.workTime;
                cellX.textContent = response.x;
                cellY.textContent = response.y;
                cellR.textContent = response.r;
                cellResult.textContent = response.result;


                saveTableData(time);
            }

        },
        error: function (xhr, status, error) {
            console.error("Error occurred: ", status, error);
        }
    });
}


function saveTableData(time) {
    const resultTable = document.querySelector("table:nth-of-type(2)");
    const rows = resultTable.rows;
    let data = [];

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].cells;
        data.push({
            request: time,
            workTime: cells[1].textContent,
            x: cells[2].textContent,
            y: cells[3].textContent,
            r: cells[4].textContent,
            result: cells[5].textContent
        });
    }


    document.cookie = `tableData=${JSON.stringify(data)}; path=/; max-age=86400`;
}


function loadTableData() {
    const cookieData = document.cookie.split('; ').find(row => row.startsWith('tableData='));

    if (cookieData) {
        const jsonData = cookieData.split('=')[1];
        const data = JSON.parse(decodeURIComponent(jsonData));

        const resultTable = document.querySelector("table:nth-of-type(2)");

        // Очищаем таблицу перед загрузкой данных
        while (resultTable.rows.length > 1) {
            resultTable.deleteRow(1);
        }

        // Заполняем таблицу сохраненными данными
        data.forEach(item => {
            const newRow = resultTable.insertRow(-1);
            newRow.insertCell(0).textContent = item.request;
            newRow.insertCell(1).textContent = item.workTime;
            newRow.insertCell(2).textContent = item.x;
            newRow.insertCell(3).textContent = item.y;
            newRow.insertCell(4).textContent = item.r;
            newRow.insertCell(5).textContent = item.result;
        });
    }
}








