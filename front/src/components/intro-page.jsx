import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
  Fade,
  Slide,
  Zoom,
} from "@mui/material"

import {
  Code,
  Functions,
  Route as RouteIcon,
  Timeline,
  ArrowForward,
  AccountTree,
  Tune, 
} from "@mui/icons-material"
import { useStore } from "../context/Store.jsx";

import { useState, useEffect } from "react"
import { useLocation } from 'wouter'
import Footer from './Common/Foot/Footer.jsx'


const CountUp = ({ end, duration = 2000, delay = 0, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    if (isNaN(Number.parseInt(end))) {
      setCount(end)
      return
    }

    const numericEnd = Number.parseInt(end.toString().replace(/[^\d]/g, ""))
    let startTime = null
    const startCount = 0

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startCount + (numericEnd - startCount) * easeOutQuart)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(numericEnd)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  const formatNumber = (num) => {
    if (typeof end === "string" && end.includes("/")) {
      return end 
    }

    if (typeof end === "string" && end.includes("K")) {
      return `${num}K+`
    }

    return `${prefix}${num.toLocaleString()}${suffix}`
  }

  return (
    <span
      style={{
        display: "inline-block",
        minWidth: "60px",
        transition: "all 0.3s ease",
      }}
    >
      {formatNumber(count)}
    </span>
  )
}

const IntroPage = () => {
  const [visible, setVisible] = useState(false)
  const { state } = useStore();
  const { userSession } = state;
  const [cardVisible, setCardVisible] = useState(false)
  const [, navigate] = useLocation()
  
  const isAuth = !!userSession?.authenticated;

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => setCardVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: <Functions sx={{ fontSize: 40 }} />,
      title: "Programación Funcional",
      description: "Algoritmos implementados con principios FP: pureza, composición e inmutabilidad",
    },
    {
      icon: <Tune sx={{ fontSize: 40 }} />,
      title: "Algoritmos Optimizados",
      description: "Implementaciones eficientes de Dijkstra, A* y otros algoritmos de búsqueda",
    },
    {
      icon: <AccountTree sx={{ fontSize: 40 }} />,
      title: "Visualización Interactiva",
      description: "Representación gráfica de grafos y rutas óptimas",
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: "API Funcional",
      description: "Backend construido con JavaScript puro y Node.js",
    },
  ]

  const stats = [
    { number: "21363", label: "Nodos Procesados" },
    { number: "5", label: "Tiempo Promedio por busqueda" },
    { number: "10", label: "Algoritmos Usados" },

  ]
  

  return (
      <Box
        sx={{
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
          <Fade in={visible} timeout={1000}>
            <Box textAlign="center" mb={8}>
              <Zoom in={visible} timeout={1200}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 4,
                    background: "linear-gradient(45deg, #4ade80, #22d3ee)",
                    animation: "float 3s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}
                >
                  <Timeline sx={{ fontSize: 60, color: "white" }} />
                </Avatar>
              </Zoom>

              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #ffffff, #a5b4fc)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                  animation: "slideInUp 1s ease-out",
                  "@keyframes slideInUp": {
                    from: { opacity: 0, transform: "translateY(30px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                PathFinderX
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  mb: 4,
                  maxWidth: 600,
                  mx: "auto",
                  animation: "slideInUp 1s ease-out 0.2s both",
                  color: "#94a3b8",
                }}
              >
                Encuentra la ruta óptima entre dos puntos de la ciudad de Bucaramanga-Colombia utilizando programación funcional en JavaScript
              </Typography>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                   onClick={() => {
                  if (isAuth) {
                    navigate("/profile");
                  } else {
                    navigate("/register");
                  }
                  }}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    background: "linear-gradient(45deg, #4ade80 30%, #22d3ee 90%)",
                    boxShadow: "0 4px 20px rgba(74, 222, 128, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #16a34a 30%, #0d9488 90%)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 25px rgba(74, 222, 128, 0.4)",
                    },
                    transition: "all 0.3s ease",
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { boxShadow: "0 4px 20px rgba(74, 222, 128, 0.3)" },
                      "50%": { boxShadow: "0 4px 30px rgba(74, 222, 128, 0.5)" },
                      "100%": { boxShadow: "0 4px 20px rgba(74, 222, 128, 0.3)" },
                    },
                  }}
                >
                  {isAuth ? "Ir a mi perfil" : "Probar Demo"}
                </Button>

                <Button
                  variant="outlined"
                  href="https://github.com/Angel-ISO/Programing-4"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    borderColor: "#4ade80",
                    color: "#4ade80",
                    "&:hover": {
                      borderColor: "#22d3ee",
                      backgroundColor: "rgba(74, 222, 128, 0.04)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Ver Código
                </Button>
              </Box>
            </Box>
          </Fade>

          <Slide direction="up" in={cardVisible} timeout={800}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mb: 8,
                borderRadius: 4,
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(74, 222, 128, 0.1)",
                maxWidth: "1000px",
                mx: "auto",
                backdropFilter: "blur(8px)",
              }}
            >
              <Grid 
                container 
                spacing={4}
                justifyContent="center"
                alignItems="center"
              >
                {stats.map((stat, index) => (
                  <Grid 
                    item 
                    xs={12}
                    sm={6}
                    md={3}
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box textAlign="center" sx={{ width: "100%" }}>
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: "#4ade80",
                          mb: 1,
                          minHeight: "64px", 
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CountUp
                          end={stat.number}
                          duration={2000}
                          delay={stat.delay}
                          suffix={stat.suffix}
                        />
                      </Typography>
                      <Typography variant="body1" color="#94a3b8" fontWeight={500}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Slide>

          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 6,
              color: "#ffffff",
            }}
          >
            Características Principales
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={cardVisible} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(74, 222, 128, 0.1)",
                      background: "rgba(15, 23, 42, 0.5)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 40px rgba(74, 222, 128, 0.15)",
                        borderColor: "#4ade80",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Box
                        sx={{
                          color: "#4ade80",
                          mb: 2,
                          animation: "bounce 2s infinite",
                          "@keyframes bounce": {
                            "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                            "40%": { transform: "translateY(-10px)" },
                            "60%": { transform: "translateY(-5px)" },
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight={600} color="#ffffff">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          <Fade in={cardVisible} timeout={1500}>
            <Box
              textAlign="center"
              sx={{
                mt: 10,
                p: 6,
                borderRadius: 4,
                background: "linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  animation: "float 20s linear infinite",
                },
              }}
            >
              <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
                ¿Listo para encontrar la ruta óptima?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Experimenta con diferentes algoritmos y visualiza los resultados
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Chip
                  icon={<Code />}
                  label="JavaScript Funcional"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 500,
                  }}
                />
                <Chip
                  icon={<Tune />}
                  label="Algoritmos Optimizados"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Container>
        <Footer />
      </Box>
  )
}

export default IntroPage