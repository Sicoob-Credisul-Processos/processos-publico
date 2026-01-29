document.addEventListener("DOMContentLoaded", function oi() {

    const userEmailInput = document.getElementById("userEmail");
    console.log(userEmailInput);
    if (!userEmailInput) return;

    const userEmail = userEmailInput.value.trim().toLowerCase();
    console.log("User Email:", userEmail);
    if (!userEmail) return;

    const table = document.getElementById("TableStep");
    if (!table) return;

    console.log("Table found:", table);

    const rows = table.querySelectorAll("tr");

    let encontrou = false;

    rows.forEach(row => {
        if (encontrou) return;

        const cells = row.querySelectorAll("td");
        if (cells.length === 0) return;

        // 🔎 Procura o nome da tarefa
        const taskTitle = cells[0].querySelector("strong");
        if (!taskTitle) return;

        const taskName = taskTitle.textContent.trim();

        console.log("Task Name:", taskName);

        if (taskName === "T01 - Incluir dados do proponente") {

            // 👣 Varre as colunas seguintes
            cells.forEach(cell => {
                if (encontrou) return;

                const users = cell.querySelectorAll(".userAllocation .user-content .small");

                users.forEach(emailDiv => {
                    const emailEncontrado = emailDiv.textContent.trim().toLowerCase();

                    console.log("Found Email:", emailEncontrado);

                    if (emailEncontrado === userEmail) {
                        encontrou = true;

                        if (
                            window.SicoobZeev &&
                            SicoobZeev.ferramentasHTML &&
                            SicoobZeev.ferramentasHTML.Alertas &&
                            typeof SicoobZeev.ferramentasHTML.Alertas.emEdicao === "function"
                        ) {
                            SicoobZeev.ferramentasHTML.Alertas.emEdicao();
                        }
                    }
                });
            });
        }
    });
});