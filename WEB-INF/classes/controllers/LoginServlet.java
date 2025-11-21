package controllers;

import dao.UsuarioDAO;
import models.Usuario;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

import java.io.IOException;

public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String email = req.getParameter("email");
        String senha = req.getParameter("senha");

        UsuarioDAO dao = new UsuarioDAO(getServletContext());
        Usuario usuario;

        try {
            usuario = dao.autenticar(email, senha);
        } catch (Exception e) {
            resp.sendError(500, "Erro no servidor");
            return;
        }

        if (usuario != null) {
            resp.setStatus(200);
            resp.getWriter().write("{\"message\":\"ok\",\"perfil\":\"" + usuario.getPerfil() + "\"}");
        } else {
            resp.sendError(401, "Login inválido");
        }
    }
}
