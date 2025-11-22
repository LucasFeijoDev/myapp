-- Para a vaga de Desenvolvedor Java Full Stack (ID 1)
SELECT u.id, u.nome, u.email,
       COUNT(DISTINCT uh.habilidade_id) as habilidades_match,
       (SELECT COUNT(*) FROM (
        SELECT CAST(value AS INTEGER) as hab_id 
        FROM json_each('[' || REPLACE(v.habilidades_necessarias, ',', ',') || ']')
       )) as total_habilidades,
       ROUND((COUNT(DISTINCT uh.habilidade_id) * 100.0 / 
             (SELECT COUNT(*) FROM (
              SELECT CAST(value AS INTEGER) as hab_id 
              FROM json_each('[' || REPLACE(v.habilidades_necessarias, ',', ',') || ']')
             ))), 2) as compatibilidade_percent
FROM usuarios u
JOIN usuario_habilidade uh ON u.id = uh.usuario_id
JOIN vagas v ON v.id = 1
WHERE uh.habilidade_id IN (
    SELECT CAST(value AS INTEGER) as hab_id 
    FROM json_each('[' || REPLACE(v.habilidades_necessarias, ',', ',') || ']')
)
GROUP BY u.id, u.nome, u.email
ORDER BY compatibilidade_percent DESC;