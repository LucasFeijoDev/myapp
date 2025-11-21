document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("cadastroForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const perfil = document.getElementById("perfil").value;

        const erro = document.getElementById("erroCadastro");
        const sucesso = document.getElementById("sucessoCadastro");

        erro.style.display = "none";
        sucesso.style.display = "none";

        try {
            const response = await fetch("/myapp/api/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: 
                    `nome=${encodeURIComponent(nome)}` +
                    `&email=${encodeURIComponent(email)}` +
                    `&senha=${encodeURIComponent(senha)}` +
                    `&perfil=${encodeURIComponent(perfil)}`
            });

            if (response.status === 201) {
                sucesso.textContent = "Usuário cadastrado com sucesso!";
                sucesso.style.display = "block";
                form.reset();
                return;
            }

            if (response.status === 409) {
                erro.textContent = "Este email já está cadastrado.";
                erro.style.display = "block";
                return;
            }

            erro.textContent = "Erro ao cadastrar usuário.";
            erro.style.display = "block";

        } catch (e) {
            erro.textContent = "Erro de conexão com o servidor.";
            erro.style.display = "block";
        }
    });

});
