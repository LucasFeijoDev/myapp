package controllers;

import dao.VagaDAO;
import dao.HabilidadeDAO;
import models.Vaga;
import models.Habilidade;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class VagasServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        VagaDAO vagaDAO = new VagaDAO(getServletContext());
        HabilidadeDAO habilidadeDAO = new HabilidadeDAO(getServletContext());
        
        try {
            String action = req.getParameter("action");
            Gson gson = new Gson();
            resp.setContentType("application/json");
            
            if ("habilidades".equals(action)) {
                // Retorna lista de habilidades
                List<Habilidade> habilidades = habilidadeDAO.listarTodas();
                resp.getWriter().write(gson.toJson(habilidades));
                
            } else if ("minhas-habilidades".equals(action)) {
                // Retorna habilidades do usuário logado
                HttpSession session = req.getSession(false);
                if (session != null) {
                    Integer usuarioId = (Integer) session.getAttribute("usuarioId");
                    if (usuarioId != null) {
                        List<Habilidade> habilidades = habilidadeDAO.listarHabilidadesUsuario(usuarioId);
                        resp.getWriter().write(gson.toJson(habilidades));
                    } else {
                        resp.sendError(401, "Usuário não logado");
                    }
                } else {
                    resp.sendError(401, "Sessão inválida");
                }
                
            } else {
                // Retorna lista de vagas
                List<Vaga> vagas = vagaDAO.listarTodas();
                resp.getWriter().write(gson.toJson(vagas));
            }
            
        } catch (SQLException e) {
            resp.sendError(500, "Erro no banco de dados: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        HttpSession session = req.getSession(false);
        
        if (session == null) {
            resp.sendError(401, "Usuário não logado");
            return;
        }
        
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            resp.sendError(401, "Usuário não logado");
            return;
        }
        
        try {
            HabilidadeDAO habilidadeDAO = new HabilidadeDAO(getServletContext());
            
            if ("adicionar-habilidade".equals(action)) {
                int habilidadeId = Integer.parseInt(req.getParameter("habilidade_id"));
                
                boolean success = habilidadeDAO.adicionarHabilidadeUsuario(usuarioId, habilidadeId);
                
                if (success) {
                    resp.setStatus(200);
                    resp.getWriter().write("{\"message\":\"Habilidade adicionada com sucesso\"}");
                } else {
                    resp.sendError(400, "Erro ao adicionar habilidade");
                }
            } else if ("remover-habilidade".equals(action)) {
                int habilidadeId = Integer.parseInt(req.getParameter("habilidade_id"));
                
                boolean success = habilidadeDAO.removerHabilidadeUsuario(usuarioId, habilidadeId);
                
                if (success) {
                    resp.setStatus(200);
                    resp.getWriter().write("{\"message\":\"Habilidade removida com sucesso\"}");
                } else {
                    resp.sendError(400, "Erro ao remover habilidade");
                }
            } else {
                resp.sendError(400, "Ação não reconhecida");
            }
        } catch (NumberFormatException e) {
            resp.sendError(400, "ID de habilidade inválido");
        } catch (SQLException e) {
            resp.sendError(500, "Erro no banco de dados: " + e.getMessage());
        } catch (Exception e) {
            resp.sendError(500, "Erro no servidor: " + e.getMessage());
        }
    }
}