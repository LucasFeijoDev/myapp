document.addEventListener("DOMContentLoaded", () => {   
    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const erroMsg = document.getElementById("erro");

            try {
                const response = await fetch("/myapp/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: `email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
                });

                if (response.ok) {
                    const data = await response.json();

                    // Redireciona baseado no perfil (opcional)
                    if (data.perfil === "admin") {
                        window.location.href = "report.html";
                    } else {
                        window.location.href = "jobs.html";
                    }
                } else if (response.status === 401) {
                    erroMsg.textContent = "Email ou senha incorretos.";
                    erroMsg.style.display = "block";
                } else {
                    erroMsg.textContent = "Erro no servidor.";
                    erroMsg.style.display = "block";
                }

            } catch (err) {
                console.error("Erro:", err);
                erroMsg.textContent = "Falha na conexão com o servidor.";
                erroMsg.style.display = "block";
            }
        });
    }
});
