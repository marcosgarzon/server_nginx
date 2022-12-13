let data = parseInt(process.argv.slice(2))

function numeroRandom(cantidad) {
  const cantidadIngresada = cantidad || 100000000
  for (let index = 0; index < cantidadIngresada ; index++) {
    Math.floor(Math.random() * 1000 + 1)
  }
  const result = {message: 'Tarea completada', amount: cantidadIngresada}
  return process.send(result)
}

numeroRandom(data)