import React, { useState } from "react";
import { Box, Grid, Typography, Button, TextField, Container } from "@mui/material";
import axios from "axios";
import { useCupon } from "../../../hooks/useCupon.js";

const CuponDescuento = () => {
  const [codigoCupon, setCodigoCupon] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { aplicarCupon, quitarCupon, cuponActivo } = useCupon();

  const manejarAplicar = async () => {
    if (!codigoCupon.trim()) {
      setMensaje("Por favor ingresa un código de cupón.");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:3001/api/cupones/validar/${codigoCupon.trim()}`);
      console.log("Respuesta del backend:", res.data);
      if (res.data) {
        aplicarCupon({
          nombreCupon: res.data.nombreCupon,
          porcentajeDescuento: res.data.porcentajeDescuento,
        });
        setMensaje("");
      } else {
        quitarCupon();
        setMensaje("El código de cupón ingresado no es válido o ha expirado.");
      }
    } catch {
      quitarCupon();
      setMensaje("Error al validar el cupón. Intenta nuevamente.");
    }
  };

  const manejarQuitar = () => {
    quitarCupon();
    setMensaje("Cupón eliminado.");
    setCodigoCupon("");
  };

  return (
    <Box
      sx={{
        minHeight: 350,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
        background: "#5a2a2a",
      }}
    >
      {/* 🔹 Contenedor central que iguala el ancho del Hero */}
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Grid
          container
          direction="column"
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 4,
            background: "#fdf6f0",
            borderRadius: 3,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.4)",
            textAlign: "center",
          }}
        >
          <Grid item>
            <Typography variant="h4" color="#5a2a2a" fontWeight={700}>
              ¿Tenés un cupón de descuento?
            </Typography>
          </Grid>

          <Grid item>
            <Typography paragraph color="#5a2a2a">
              Ingresá tu código aquí
            </Typography>
          </Grid>

          {/* 🔹 Input + botones */}
          <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={1}>
            <Grid item>
              <TextField
                placeholder="Código de descuento"
                variant="outlined"
                size="small"
                value={codigoCupon}
                onChange={(e) => setCodigoCupon(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#a0522d" },
                    "&:hover fieldset": { borderColor: "#5a2a2a" },
                    "&.Mui-focused fieldset": { borderColor: "#5a2a2a", borderWidth: "2px" },
                    backgroundColor: "#fdf6f0",
                    color: "#5a2a2a",
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                onClick={manejarAplicar}
                sx={{
                  backgroundColor: "#5a2a2a",
                  borderRadius: 2,
                  height: "40px",
                  "&:hover": { backgroundColor: "#3e1e1e" },
                  mr: cuponActivo ? 1 : 0,
                }}
              >
                Aplicar cupón
              </Button>
            </Grid>

            {cuponActivo && (
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={manejarQuitar}
                  sx={{
                    color: "#5a2a2a",
                    borderColor: "#5a2a2a",
                    borderRadius: 2,
                    height: "40px",
                    "&:hover": {
                      backgroundColor: "rgba(90, 42, 42, 0.1)",
                      borderColor: "#5a2a2a",
                    },
                  }}
                >
                  Quitar cupón
                </Button>
              </Grid>
            )}
          </Grid>

          {/* 🔹 Mensaje o estado activo */}
          {(mensaje || cuponActivo) && (
            <Grid item xs={12}>
              <Typography
                color={cuponActivo ? "green" : "red"}
                textAlign="center"
                mt={2}
                fontWeight={600}
              >
                {mensaje ||
                  `Cupón "${cuponActivo.nombreCupon}" (${cuponActivo.porcentajeDescuento}%) aplicado con éxito.`}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CuponDescuento;
