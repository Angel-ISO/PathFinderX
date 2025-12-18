import { Box, Typography, Divider, Link, IconButton } from "@mui/material"
import { Code, Functions, Route, GitHub, Email, LinkedIn } from "@mui/icons-material"

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 4,
        px: 2,
        mt: "auto",
        bgcolor: "rgba(2, 6, 23, 0.8)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(74, 222, 128, 0.1)",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 4,
          mb: 4,
        }}
      >
        {/* Logo y descripción */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Route sx={{ color: "#4ade80", fontSize: 32 }} />
            <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: "#4ade80" }}>
              PathFinderX
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Algoritmos de ruta implementados con programación funcional en JavaScript
          </Typography>
        </Box>

        {/* Enlaces rápidos */}
        <Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: "#4ade80", 
              textTransform: "uppercase", 
              fontWeight: 600, 
              mb: 2 
            }}
          >
            Enlaces
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 1 }}>
            <li>
              <Link href="#" variant="body2" sx={{ color: "#94a3b8", '&:hover': { color: "#4ade80" } }}>
                Demo
              </Link>
            </li>
            <li>
              <Link href="#" variant="body2" sx={{ color: "#94a3b8", '&:hover': { color: "#4ade80" } }}>
                Documentación
              </Link>
            </li>
            <li>
              <Link href="#" variant="body2" sx={{ color: "#94a3b8", '&:hover': { color: "#4ade80" } }}>
                Algoritmos
              </Link>
            </li>
          </Box>
        </Box>

        {/* Contacto y redes */}
        <Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: "#4ade80", 
              textTransform: "uppercase", 
              fontWeight: 600, 
              mb: 2 
            }}
          >
            Contacto
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton 
              href="https://github.com/Angel-ISO" 
              target="_blank"
              sx={{ 
                color: "#94a3b8", 
                '&:hover': { 
                  color: "#4ade80",
                  bgcolor: "rgba(74, 222, 128, 0.1)" 
                } 
              }}
            >
              <GitHub />
            </IconButton>
            <IconButton 
              href="https://www.linkedin.com/in/angel-gabriel-ortega/" 
              target="_blank"
              sx={{ 
                color: "#94a3b8", 
                '&:hover': { 
                  color: "#4ade80",
                  bgcolor: "rgba(74, 222, 128, 0.1)" 
                } 
              }}
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ 
        my: 2, 
        bgcolor: "rgba(74, 222, 128, 0.1)", 
        backgroundImage: "linear-gradient(to right, transparent, rgba(74, 222, 128, 0.3), transparent)" 
      }} />

      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" }, 
        justifyContent: "space-between", 
        alignItems: "center", 
        gap: 2 
      }}>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          © {new Date().getFullYear()} PathFinderX. Todos los derechos reservados.
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Link href="#" variant="body2" sx={{ color: "#64748b", '&:hover': { color: "#4ade80" } }}>
            Términos
          </Link>
          <Link href="#" variant="body2" sx={{ color: "#64748b", '&:hover': { color: "#4ade80" } }}>
            Privacidad
          </Link>
          <Link href="#" variant="body2" sx={{ color: "#64748b", '&:hover': { color: "#4ade80" } }}>
            Cookies
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer