var rendimiento = "0%";
var resueltos = 0;
var pendientes = 0;
var chart;  // Definir la variable 'chart' globalmente

// Función para actualizar el tamaño del gráfico y la fuente
function updateChartSize() {
    var screenWidth = window.innerWidth;

    // Define el tamaño del gráfico donut en función del tamaño de la pantalla
    var chartWidth;
    var font;
    if (screenWidth < 600) { // Extra small devices (portrait phones)
        chartWidth = 180;
        font = '10px';
    } else if (screenWidth < 800) { // Small devices (landscape phones)
        chartWidth = 280;
        font = '15px';
    } else if (screenWidth < 1100) { // Medium devices (tablets)
        chartWidth = 380;
        font = '30px';
    } else if (screenWidth < 1400) { // Large devices (desktops)
        chartWidth = 480;
        font = '50px';
    } else { // Extra large devices (large desktops)
        chartWidth = 540;
        font = '70px';
    }

    // Asegurarse de que el gráfico exista antes de intentar actualizarlo
    if (chart) {
        // Actualizar el tamaño del gráfico y la fuente
        chart.updateOptions({
            chart: {
                width: chartWidth
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            total: {
                                fontSize: font
                            },
                            name: {
                                style: {
                                    fontSize: font
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

function cargarDatos() {
    // URL del archivo JSON
    const url = "https://horus-metepec.github.io/Data/resultados.json";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extraer los datos del JSON
            resueltos = data["TotResueltos"];
            pendientes = data["TotPendientes"];

            // Calcular el rendimiento
            if (resueltos + pendientes > 0) {
                rendimiento = `${Math.round((resueltos / (resueltos + pendientes)) * 100)}%`;
            } else {
                rendimiento = "0%";
            }

            // Actualizar las series del gráfico con los nuevos valores
            chart.updateSeries([resueltos, pendientes]);

            // Actualizar el rendimiento en el gráfico
            chart.updateOptions({
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                total: {
                                    label: rendimiento
                                }
                            }
                        }
                    }
                }
            });

            // Actualizar el gráfico después de cargar los datos
            updateChartSize();
        })
        .catch(error => {
            console.error("Error al obtener el JSON:", error);
        });
}

// Opciones iniciales para el gráfico
var options = {
    series: [resueltos, pendientes],
    chart: {
        width: 500,
        type: 'donut',
    },
    labels: ['Resueltos', 'Pendientes'],
    colors: ['#70ce58', '#204f78'],
    dataLabels: {
        enabled: false,
        offsetY: 10,
        formatter: function (val, opts) {
            if (opts.seriesIndex === 0) {
                return `${Math.round(val)}%`;
            }
            return '';
        }
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: rendimiento,
                        fontSize: '70px',
                        formatter: function () {},
                        offsetY: 50
                    },
                    name: {
                        show: true,
                        offsetY: 5
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetY: 0,
                    formatter: function (val, opts) {
                        if (opts.seriesIndex === 0) {
                            return `${Math.round(val)}%`;
                        }
                        return '';
                    }
                },
                tooltip: {
                    enabled: true,
                    offsetY: 0,
                    custom: function({ series, seriesIndex, dataPointIndex, w }) {
                        return `<div class="apexcharts-tooltip-custom">${rendimiento}</div>`;
                    }
                }
            }

        }
    },
    responsive: [{
        breakpoint: 400,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
};

// Inicializar el gráfico (esto debe ocurrir después de definir la variable chart)
chart = new ApexCharts(document.querySelector("#chart_rendimiento"), options);
chart.render();

// Ejecutar la función cuando se carga la página por primera vez
window.addEventListener("load", cargarDatos);

// Agregar un controlador de eventos resize para ajustar el tamaño cuando la ventana cambie
window.addEventListener('resize', updateChartSize);
