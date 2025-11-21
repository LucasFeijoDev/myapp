package controllers;

import dao.UsuarioDAO;
import models.Usuario;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
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
            // ✅ CRIAR SESSÃO
            HttpSession session = req.getSession();
            session.setAttribute("usuario", usuario);
            session.setAttribute("usuarioId", usuario.getId());
            session.setAttribute("usuarioNome", usuario.getNome());
            session.setAttribute("usuarioPerfil", usuario.getPerfil());
            
            resp.setStatus(200);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"message\":\"ok\",\"perfil\":\"" + usuario.getPerfil() + "\"}");
        } else {
            resp.sendError(401, "Login inválido");
        }
    }
}