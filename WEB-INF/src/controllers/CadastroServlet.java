package controllers;

import dao.UsuarioDAO;
import models.Usuario;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

public class CadastroServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");

        // Criação do DAO dentro do método (correção)
        UsuarioDAO usuarioDAO = new UsuarioDAO(getServletContext());

        String nome = req.getParameter("nome");
        String email = req.getParameter("email");
        String senha = req.getParameter("senha");
        String perfil = req.getParameter("perfil");

        // Validações básicas
        if (nome == null || email == null || senha == null || perfil == null ||
                nome.isEmpty() || email.isEmpty() || senha.isEmpty() || perfil.isEmpty()) {

            resp.sendError(400, "Dados incompletos");
            return;
        }

        Usuario novo = new Usuario();
        novo.setNome(nome);
        novo.setEmail(email);
        novo.setSenha(senha); // posso aplicar hash se quiser
        novo.setPerfil(perfil);

        try {
            boolean ok = usuarioDAO.criarUsuario(novo);

            if (ok) {
                resp.setStatus(201);
                resp.getWriter().write("{\"message\":\"Usuário criado com sucesso\"}");
            } else {
                resp.sendError(500, "Falha ao criar usuário");
            }

        } catch (Exception e) {
            // Erro comum quando email é UNIQUE: "SQLITE_CONSTRAINT"
            if (e.getMessage().contains("UNIQUE")) {
                resp.sendError(409, "Email já cadastrado");
            } else {
                e.printStackTrace();
                resp.sendError(500, "Erro no servidor");
            }
        }
    }
}
